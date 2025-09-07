import os
import time
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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

    """ Add API routes first (higher priority) """
    api_router = APIRouter(prefix="/api")
    api_router.include_router(system_router)
    api_router.include_router(user_routes.router)
    api_router.include_router(plans_routes.router)
    app.include_router(api_router)

    """ Static files for Angular app (production only) """
    static_dir = Path(__file__).parent / "static"
    index_file = static_dir / "index.html"
    if index_file.exists():
        # Import required modules
        from fastapi import Request
        from fastapi.responses import FileResponse

        # Serve static files at root path and handle Angular SPA routing
        @app.get("/{file_path:path}")
        async def serve_static_or_angular(request: Request, file_path: str):
            """
            Serve static files at root path and Angular app for SPA routing.
            This catch-all route handles all non-API requests.
            Priority: Static files > Angular SPA (index.html)
            """
            # Handle root path - serve index.html
            if not file_path or file_path == "":
                return FileResponse(index_file)

            # Check if it's a static file request
            static_file_path = static_dir / file_path
            if static_file_path.exists() and static_file_path.is_file():
                return FileResponse(static_file_path)

            # For all other routes, serve index.html (Angular SPA routing)
            # This enables Angular's client-side routing
            return FileResponse(index_file)

    """ Dependency overrides """
    app.dependency_overrides[get_configuration] = lambda: settings
    app.dependency_overrides[get_current_user] = get_oauth2_current_user

    return app
