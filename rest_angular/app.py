import os
import time
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from lelab_common import (
    RequestTraceMiddleware,
    get_configuration,
    responses_model,
)
from lelab_common.auth import get_current_user, get_oauth2_current_user

from .config import settings
from .infra.monitor.otel import setup_opentelemetry, stop_opentelemetry
from .modules.plans import routes as plans_routes
from .modules.system.routes import router as system_router
from .modules.users import user_routes


def create_app() -> FastAPI:
    """
    Factory method to create a FastAPI application.

    Returns:
        FastAPI application.
    """

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.settings = settings
        setup_opentelemetry(app)
        yield
        stop_opentelemetry(app)

    app = FastAPI(
        lifespan=lifespan,
        responses=responses_model,
        swagger_ui_init_oauth={
            "clientId": settings.openapi_oauth2_client_id,
            "clientSecret": settings.openapi_oauth2_client_secret,
            "scopes": settings.openapi_oauth2_scopes,
            "usePkceWithAuthorizationCodeGrant": True,
            "useBasicAuthenticationWithAccessCodeGrant": True,
        },
        docs_url="/api/docs",
        redoc_url="/api/redocs",
        openapi_url="/api/openapi.json" if settings.openapi_enabled else None,
    )

    """ Add middleware """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["x-trace-id", "x-process-time"],
    )
    app.add_middleware(RequestTraceMiddleware)

    """ Add routes """
    api_router = APIRouter(prefix="/api")
    api_router.include_router(system_router)
    api_router.include_router(user_routes.router)
    api_router.include_router(plans_routes.router)
    app.include_router(api_router)

    """ Dependency overrides """
    app.dependency_overrides[get_configuration] = lambda: settings
    app.dependency_overrides[get_current_user] = get_oauth2_current_user

    return app
