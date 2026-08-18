from fastapi import APIRouter
from app.api.v1 import auth_router, users_router, ratings_router, sessions_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router, tags=["auth"])
api_router.include_router(users_router, tags=["users"])
api_router.include_router(ratings_router, tags=["ratings"])
api_router.include_router(sessions_router, tags=["sessions"])