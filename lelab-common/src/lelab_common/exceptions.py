from enum import Enum
from typing import Any

from starlette import status as request_status


class ExceptionSeverity(Enum):
    WARNING = 1
    ERROR = 2
    CRITICAL = 3


class ApplicationException(Exception):
    status: int = 500
    severity: ExceptionSeverity = ExceptionSeverity.ERROR
    message: str = "The requested operation failed"
    debug: str = "An unknown and unhandled exception occurred in the API"
    extra: dict[str, Any] | None = None

    @property
    def type(self) -> str:
        return self.__class__.__name__

    def __init__(
        self,
        message: str = "The requested operation failed",
        debug: str = "An unknown and unhandled exception occurred in the API",
        extra: dict[str, Any] | None = None,
        status: int = 500,
        severity: ExceptionSeverity = ExceptionSeverity.ERROR,
    ):
        self.status = status
        self.message = message
        self.debug = debug
        self.extra = extra
        self.severity = severity

    def to_dict(self) -> dict[str, int | str | dict[str, Any] | None]:
        return {
            "status": self.status,
            "type": self.type,
            "message": self.message,
            "debug": self.debug,
            "extra": self.extra,
        }


class NotFoundException(ApplicationException):
    def __init__(
        self,
        message: str = "The requested resource could not be found",
        debug: str = "The requested resource could not be found",
        extra: dict[str, Any] | None = None,
    ):
        super().__init__(
            message,
            debug,
            extra,
            request_status.HTTP_404_NOT_FOUND,
            severity=ExceptionSeverity.WARNING,
        )


class BadRequestException(ApplicationException):
    def __init__(
        self,
        message: str = "Invalid data for the operation",
        debug: str = "Unable to complete the requested operation with the given input values",
        extra: dict[str, Any] | None = None,
    ):
        super().__init__(
            message,
            debug,
            extra,
            request_status.HTTP_400_BAD_REQUEST,
            severity=ExceptionSeverity.WARNING,
        )


class UnprocessableEntityException(ApplicationException):
    def __init__(
        self,
        message: str = "The received data is invalid",
        debug: str = "Values are invalid for requested operation",
        extra: dict[str, Any] | None = None,
    ):
        super().__init__(
            message,
            debug,
            extra,
            request_status.HTTP_422_UNPROCESSABLE_ENTITY,
            severity=ExceptionSeverity.WARNING,
        )


class UnauthorizedException(ApplicationException):
    def __init__(
        self,
        message: str = "Unauthorized access",
        debug: str = "Action denied because of unauthorized access",
        extra: dict[str, Any] | None = None,
    ):
        super().__init__(
            message,
            debug,
            extra,
            request_status.HTTP_401_UNAUTHORIZED,
            severity=ExceptionSeverity.WARNING,
        )


class ForbiddenException(ApplicationException):
    def __init__(
        self,
        message: str = "Missing privilege for accessing the resource",
        debug: str = "Action denied because of insufficient permissions",
        extra: dict[str, Any] | None = None,
    ):
        super().__init__(
            message,
            debug,
            extra,
            request_status.HTTP_403_FORBIDDEN,
            severity=ExceptionSeverity.WARNING,
        )
