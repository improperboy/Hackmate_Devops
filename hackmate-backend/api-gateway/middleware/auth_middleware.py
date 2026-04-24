from fastapi import Request, status
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from config import settings

# Routes that do NOT require a JWT token
PUBLIC_ROUTES = {
    ("POST", "/auth/login"),
    ("POST", "/auth/register"),
    ("POST", "/auth/refresh"),
    ("GET",  "/health"),
    ("GET",  "/docs"),
    ("GET",  "/openapi.json"),
    ("GET",  "/redoc"),
}

# Routes restricted to specific roles only
# Format: (method, path_prefix) -> set of allowed roles
ROLE_RESTRICTED = {
    ("GET",    "/admin"):  {"admin"},
    ("POST",   "/admin"):  {"admin"},
    ("PUT",    "/admin"):  {"admin"},
    ("DELETE", "/admin"):  {"admin"},
    ("POST",   "/rounds"): {"admin"},
    ("PUT",    "/rounds"): {"admin"},
    ("DELETE", "/rounds"): {"admin"},
    ("POST",   "/scores"): {"mentor", "admin"},
    ("PUT",    "/scores"): {"mentor", "admin"},
    ("POST",   "/users"):  {"admin"},
    ("DELETE", "/users"):  {"admin"},
}

# GET /users routes accessible to non-admins
USER_GET_PUBLIC_PREFIXES = (
    "/users/me",
    "/users/search",
    "/users/skills/all",
)

# Admin sub-paths accessible to all authenticated users
ADMIN_PUBLIC_PREFIXES = (
    "/admin/settings/public",
    "/admin/venue/volunteer-assignments/mine",
)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None


def is_public(method: str, path: str) -> bool:
    if method == "OPTIONS":
        return True
    return (method, path) in PUBLIC_ROUTES or path.startswith("/auth/")


def check_role(method: str, path: str, role: str) -> bool:
    # Allow any authenticated user to access specific GET /users/* routes
    if method == "GET" and path.startswith(USER_GET_PUBLIC_PREFIXES):
        return True
    # Allow any authenticated user to access public admin sub-paths
    if method == "GET" and path.startswith(ADMIN_PUBLIC_PREFIXES):
        return True
    # Admin-only: GET /users/ (list all users) and GET /users/{id} (view any user)
    if method == "GET" and path.startswith("/users") and not path.startswith(USER_GET_PUBLIC_PREFIXES):
        return role == "admin"
    for (m, prefix), allowed_roles in ROLE_RESTRICTED.items():
        if method == m and path.startswith(prefix):
            return role in allowed_roles
    return True  # no restriction defined — allow any authenticated user


async def auth_middleware(request: Request, call_next):
    method = request.method
    path = request.url.path

    # Always allow public routes through
    if is_public(method, path):
        return await call_next(request)

    # Extract Bearer token
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Missing or invalid Authorization header"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.split(" ", 1)[1]
    payload = decode_token(token)

    if not payload:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Invalid or expired token"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    role = payload.get("role", "")

    # Role-based access check
    if not check_role(method, path, role):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"detail": f"Access denied for role '{role}'"},
        )

    # Inject user info as headers so downstream services can trust them
    request.state.user_id = payload.get("sub")
    request.state.user_role = role
    request.state.user_name = payload.get("name", "")

    return await call_next(request)
