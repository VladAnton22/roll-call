from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

engine = create_async_engine(settings.sqlalchemy_url, echo=True)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: yields a session and guarantees it's closed.

    Routes commits explicitly: the context manager just handles teardown.
    """
    async with AsyncSessionLocal() as session:
        yield session