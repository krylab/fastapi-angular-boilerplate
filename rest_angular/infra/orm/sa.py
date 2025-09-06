from typing import Annotated, AsyncGenerator

from fastapi import Depends
from lelab_common import Settings
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from .settings import DatabaseSettings

_engine: AsyncEngine | None = None


def get_database_engine(settings: Settings) -> AsyncEngine:
    """Get database engine with settings from dependency injection."""
    if not isinstance(settings, DatabaseSettings):
        raise NotImplementedError("The application settings is not inherited from DatabaseSettings")
    global _engine
    if _engine is None:
        _engine = create_async_engine(settings.db_url, echo=False, future=True)
    return _engine


_async_sessionmaker: async_sessionmaker[AsyncSession] | None = None


def get_async_session_factory(settings: Settings) -> async_sessionmaker[AsyncSession]:
    """Get async session factory with settings from dependency injection."""
    global _async_sessionmaker
    if _async_sessionmaker is None:
        engine = get_database_engine(settings)
        _async_sessionmaker = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
    return _async_sessionmaker


AsyncSessionFactory = Annotated[async_sessionmaker[AsyncSession], Depends(get_async_session_factory)]


async def get_sa_session(settings: Settings) -> AsyncGenerator[AsyncSession, None]:
    """Get database session with settings from dependency injection."""
    session_factory = get_async_session_factory(settings)
    async with session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


AsyncSessionDep = Annotated[AsyncSession, Depends(get_sa_session)]
