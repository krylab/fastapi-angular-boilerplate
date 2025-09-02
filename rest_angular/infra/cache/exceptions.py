from typing import Any

from lelab_common.exceptions import (
    ApplicationException,
)
from starlette import status


class RedisConnectionException(ApplicationException):
    """Exception raised when Redis connection fails"""

    def __init__(
        self,
        message: str = "Redis connection failed",
        debug: str = "Unable to connect to Redis service for rate limiting",
        extra: dict[str, Any] | None = None,
    ):
        super().__init__(
            message=message,
            debug=debug,
            extra=extra,
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
