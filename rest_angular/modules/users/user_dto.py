import uuid

from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    """Represents a read command for a user."""

    pass


class UserCreate(schemas.BaseUserCreate):
    """Represents a create command for a user."""

    pass


class UserUpdate(schemas.BaseUserUpdate):
    """Represents an update command for a user."""

    pass
