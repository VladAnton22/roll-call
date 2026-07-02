import asyncio

from sqlalchemy import text

from app.db.session import AsyncSessionLocal

async def main() -> None:
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("SELECT 1"))
        print("SELECT 1 ->", result.scalar_one())

        # Confirm the migration actually landed.
        tables = await session.execute(
            text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
        )
        print("tables:", sorted(row[0] for row in tables))


if __name__ == "__main__":
    asyncio.run(main())