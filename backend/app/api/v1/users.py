from typing import Annotated

from fastapi import Depends, APIRouter

from app.schemas.user_schemas import UserResponse
from app.core.dependencies import get_current_active_user
from app.models.user import User


router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def read_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user