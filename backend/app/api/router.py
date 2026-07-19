from fastapi import APIRouter
from app.api.v1 import auth_router, users_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router, tags=["auth"])
api_router.include_router(users_router, tags=["users"])