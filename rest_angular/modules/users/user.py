from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseOAuthAccountTableUUID
from fastapi_users_db_sqlalchemy.generics import GUID
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, declared_attr, mapped_column, relationship

from ...infra.orm.base_model import Base


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    """Represents a oauth account entity."""

    __tablename__ = "oauth_accounts"

    @declared_attr
    def user_id(cls) -> Mapped[GUID]:
        return mapped_column(GUID, ForeignKey("users.id", ondelete="cascade"), nullable=False)


class User(SQLAlchemyBaseUserTableUUID, Base):
    """Represents a user entity."""

    __tablename__ = "users"

    oauth_accounts: Mapped[list[OAuthAccount]] = relationship(
        "OAuthAccount",
        lazy="joined",
    )
