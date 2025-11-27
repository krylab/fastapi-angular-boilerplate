import logging
from pathlib import Path

from lelab_common.logger import setup_logger

from .config import settings


def configure_logging() -> logging.Logger:
    """
    Configure application logging based on settings.

    It sets up the root logger with:
    - Console handler with colored output (ISO8601 time)
    - File handler with daily rotation (ISO8601 time) in workspace logs folder
    """
    # Workspace logs folder
    log_dir = Path("logs")

    logger = setup_logger(
        log_level=settings.log_level,
        log_dir=log_dir,
        log_filename="rest_angular.log",
        rotation="midnight",
        retention_days=7,
    )

    # Configure additional handlers for production
    if settings.environment.lower() == "production":
        _configure_production_logging(logger)

    return logger


def _configure_production_logging(logger: logging.Logger) -> None:
    """
    Add production-specific log handlers.
    This can be customized or replaced to support external logging services.
    """
    # Example: Add a handler for a centralized logging system
    # handler = ...
    # logger.addHandler(handler)
    pass
