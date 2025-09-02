import uvicorn

from rest_angular.config import settings


def main() -> None:
    """Entrypoint of the application."""
    uvicorn.run(
        "rest_angular.app:create_app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level=settings.log_level.lower(),
        factory=True,
    )


if __name__ == "__main__":
    main()
