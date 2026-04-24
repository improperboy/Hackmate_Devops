from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from middleware.auth_middleware import auth_middleware
from middleware.rate_limiter import rate_limit_middleware
from middleware.maintenance import maintenance_middleware
from routes import router

app = FastAPI(
    title="HackMate API Gateway",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True},
)

# JWT auth + role enforcement
app.add_middleware(BaseHTTPMiddleware, dispatch=auth_middleware)

# Maintenance mode check
app.add_middleware(BaseHTTPMiddleware, dispatch=maintenance_middleware)

# Rate limiter — runs before auth
app.add_middleware(BaseHTTPMiddleware, dispatch=rate_limit_middleware)

# CORS — outermost layer
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hackmate-frontend-ten.vercel.app",
        "https://hackmate.dulify.in",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
