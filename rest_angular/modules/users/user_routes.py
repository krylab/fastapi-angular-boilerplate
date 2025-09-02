import uuid

from fastapi import APIRouter
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    CookieTransport,
    JWTStrategy,
)
from lelab_common import Settings

from .google_oauth_routes import get_google_oauth_routes
from .settings import UserSettings
from .user import User
from .user_dto import UserCreate, UserRead, UserUpdate
from .user_manager import get_user_manager


def get_jwt_strategy(settings: Settings) -> JWTStrategy[User, uuid.UUID]:
    """
    Return a JWTStrategy in order to instantiate it dynamically.

    :returns: instance of JWTStrategy with provided settings.
    """
    if not isinstance(settings, UserSettings):
        raise NotImplementedError("The application settings is not inherited from UserSettings")
    return JWTStrategy(secret=settings.jwt_strategy_secret, lifetime_seconds=None)


# Authentication backends
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")
auth_jwt = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

cookie_transport = CookieTransport()
auth_cookie = AuthenticationBackend(
    name="cookie",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

backends = [auth_cookie, auth_jwt]

# FastAPI Users instance
api_users = FastAPIUsers[User, uuid.UUID](get_user_manager, backends)


# Router
router = APIRouter()

# Auth routes
router.include_router(
    api_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_auth_router(auth_jwt),
    prefix="/auth/jwt",
    tags=["auth"],
)

router.include_router(
    api_users.get_auth_router(auth_cookie),
    prefix="/auth/cookie",
    tags=["auth"],
)

# Custom Google OAuth2 routes
router.include_router(
    get_google_oauth_routes(auth_jwt),
    prefix="/auth/google",
    tags=["auth"],
)

# User management routes
router.include_router(
    api_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
