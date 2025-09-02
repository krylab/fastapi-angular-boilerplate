from fastapi import FastAPI
from lelab_common import AppSettings, Settings
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.resources import (
    DEPLOYMENT_ENVIRONMENT,
    SERVICE_NAME,
    TELEMETRY_SDK_LANGUAGE,
    Resource,
)
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.trace import set_tracer_provider

from .settings import MonitorSettings


def setup_opentelemetry(app: FastAPI) -> None:
    """
    Enables opentelemetry instrumentation.

    :param app: current application.
    """
    settings: Settings = app.state.settings
    if not isinstance(settings, MonitorSettings):
        raise NotImplementedError(
            "The application settings is not attached to app state or inherited from MonitorSettings"
        )

    opentelemetry_endpoint = settings.opentelemetry_endpoint

    if not opentelemetry_endpoint:
        return

    if isinstance(settings, AppSettings):
        environment = settings.environment
        log_level = settings.log_level
    else:
        environment = "dev"
        log_level = "INFO"

    tracer_provider = TracerProvider(
        resource=Resource(
            attributes={
                SERVICE_NAME: "rest_angular",
                TELEMETRY_SDK_LANGUAGE: "python",
                DEPLOYMENT_ENVIRONMENT: environment,
            },
        ),
    )

    tracer_provider.add_span_processor(
        BatchSpanProcessor(
            OTLPSpanExporter(
                endpoint=opentelemetry_endpoint,
                insecure=True,
            ),
        ),
    )

    excluded_endpoints = [
        app.url_path_for("health_check"),
        app.url_path_for("openapi"),
        app.url_path_for("swagger_ui_html"),
        app.url_path_for("swagger_ui_redirect"),
        app.url_path_for("redoc_html"),
    ]

    FastAPIInstrumentor().instrument_app(
        app,
        tracer_provider=tracer_provider,
        excluded_urls=",".join(excluded_endpoints),
    )
    RedisInstrumentor().instrument(
        tracer_provider=tracer_provider,
    )
    SQLAlchemyInstrumentor().instrument(
        tracer_provider=tracer_provider,
        engine=app.state.db_engine.sync_engine,
    )
    LoggingInstrumentor().instrument(
        tracer_provider=tracer_provider,
        set_logging_format=True,
        log_level=log_level,
    )

    set_tracer_provider(tracer_provider=tracer_provider)


def stop_opentelemetry(app: FastAPI) -> None:
    """
    Disables opentelemetry instrumentation.

    :param app: current application.
    """
    # Cleanup if needed
    pass
