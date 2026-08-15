from .auth import router as auth_router
from .users import router as users_router
from .ratings import router as ratings_router

__all__ = ["auth_router", "users_router", "ratings_router"]