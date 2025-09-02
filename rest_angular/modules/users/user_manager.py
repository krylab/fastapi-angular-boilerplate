import uuid
from typing import AsyncGenerator

from fastapi import Depends
from fastapi_users import BaseUserManager, UUIDIDMixin
from fastapi_users.db import SQLAlchemyUserDatabase
from lelab_common import Settings
from sqlalchemy.ext.asyncio import AsyncSession

from ...infra.orm.sa import get_sa_session
from .settings import UserSettings
from .user import OAuthAccount, User


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    """Manages a user session and its tokens."""

    def __init__(self, user_db: SQLAlchemyUserDatabase[User, uuid.UUID], settings: UserSettings):
        super().__init__(user_db)
        self.reset_password_token_secret = settings.reset_password_token_secret
        self.verification_token_secret = settings.verification_token_secret


async def get_user_db(
    session: AsyncSession = Depends(get_sa_session),
) -> AsyncGenerator[SQLAlchemyUserDatabase[User, uuid.UUID], None]:
    """
    Yield a SQLAlchemyUserDatabase instance.

    :param session: asynchronous SQLAlchemy session.
    :yields: instance of SQLAlchemyUserDatabase.
    """
    yield SQLAlchemyUserDatabase(session, User, OAuthAccount)


async def get_user_manager(
    settings: Settings,
    user_db: SQLAlchemyUserDatabase[User, uuid.UUID] = Depends(get_user_db),
) -> AsyncGenerator[UserManager, None]:
    """
    Yield a UserManager instance.

    :param user_db: SQLAlchemy user db instance
    :yields: an instance of UserManager.
    """
    if not isinstance(settings, UserSettings):
        raise NotImplementedError("The application settings is not inherited from UserSettings")
    yield UserManager(user_db, settings)
