"""
Rate limiter using Upstash Redis (HTTP REST).
Falls back to in-memory if Upstash is not configured.
Uses a sliding window algorithm with Redis sorted sets.
"""
import time
import logging
from collections import defaultdict
from fastapi import Request, status
from fastapi.responses import JSONResponse
from config import settings

logger = logging.getLogger(__name__)

# In-memory fallback store
_request_log: dict = defaultdict(list)

# Upstash HTTP client (lazy init)
_upstash_client = None


def _get_upstash_client():
    global _upstash_client
    if _upstash_client is None and settings.upstash_redis_rest_url and settings.upstash_redis_rest_token:
        try:
            from upstash_redis import Redis
            _upstash_client = Redis(
                url=settings.upstash_redis_rest_url,
                token=settings.upstash_redis_rest_token,
            )
            logger.info("Upstash Redis rate limiter initialized")
        except ImportError:
            logger.warning("upstash-redis not installed — falling back to in-memory rate limiting")
    return _upstash_client


def _in_memory_check(client_ip: str, now: float) -> bool:
    """Returns True if request is allowed."""
    window_start = now - settings.rate_limit_window
    _request_log[client_ip] = [ts for ts in _request_log[client_ip] if ts > window_start]
    if len(_request_log[client_ip]) >= settings.rate_limit_requests:
        return False
    _request_log[client_ip].append(now)
    return True


def _upstash_check(redis, client_ip: str, now: float) -> bool:
    """
    Sliding window rate limit via Redis sorted set.
    Key: ratelimit:{ip}, score = timestamp, member = timestamp (unique via nano suffix).
    Returns True if request is allowed.
    """
    key = f"ratelimit:{client_ip}"
    window_start = now - settings.rate_limit_window
    member = f"{now:.6f}"

    redis.zremrangebyscore(key, "-inf", window_start)
    redis.zadd(key, {member: now})
    count = redis.zcard(key)
    redis.expire(key, settings.rate_limit_window + 1)

    return count <= settings.rate_limit_requests


async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/health":
        return await call_next(request)

    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"
    now = time.time()

    redis = _get_upstash_client()
    try:
        if redis:
            allowed = _upstash_check(redis, client_ip, now)
        else:
            allowed = _in_memory_check(client_ip, now)
    except Exception as exc:
        logger.warning("Rate limiter error (%s) — falling back to in-memory", exc)
        allowed = _in_memory_check(client_ip, now)

    if not allowed:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": f"Rate limit exceeded. Max {settings.rate_limit_requests} requests per {settings.rate_limit_window}s."},
        )

    return await call_next(request)
