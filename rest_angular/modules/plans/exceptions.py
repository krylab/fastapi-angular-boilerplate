from typing import Any

from lelab_common.exceptions import (
    ApplicationException,
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
)
from starlette import status


class RateLimitException(ApplicationException):
    """Exception raised when rate limit is exceeded"""

    def __init__(
        self,
        message: str = "Rate limit exceeded",
        debug: str = "The request rate has exceeded the configured limit for this endpoint",
        extra: dict[str, Any] | None = None,
    ):
        super().__init__(
            message=message,
            debug=debug,
            extra=extra,
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )


class TierNotFoundException(NotFoundException):
    """Exception raised when a tier is not found"""

    def __init__(
        self,
        tier_id: int | None = None,
        tier_name: str | None = None,
        extra: dict[str, Any] | None = None,
    ):
        if tier_id:
            message = f"Tier with ID {tier_id} not found"
            debug = f"Tier with ID {tier_id} does not exist in the system"
        elif tier_name:
            message = f"Tier with name '{tier_name}' not found"
            debug = f"Tier with name '{tier_name}' does not exist in the system"
        else:
            message = "Tier not found"
            debug = "The requested tier could not be found"

        super().__init__(message=message, debug=debug, extra=extra)


class TierTargetNotFoundException(NotFoundException):
    """Exception raised when a tier target is not found"""

    def __init__(
        self,
        target_type: str | None = None,
        target_id: str | None = None,
        extra: dict[str, Any] | None = None,
    ):
        if target_type and target_id:
            message = f"Tier target of type '{target_type}' with ID '{target_id}' not found"
            debug = f"Tier target of type '{target_type}' with ID '{target_id}' does not exist or is inactive"
        else:
            message = "Tier target not found"
            debug = "The requested tier target could not be found"

        super().__init__(message=message, debug=debug, extra=extra)


class RateLimitNotFoundException(NotFoundException):
    """Exception raised when a rate limit configuration is not found"""

    def __init__(
        self,
        tier_target_id: int | None = None,
        path: str | None = None,
        extra: dict[str, Any] | None = None,
    ):
        if tier_target_id and path:
            message = f"Rate limit configuration for tier target {tier_target_id} and path '{path}' not found"
            debug = f"No rate limit configuration exists for tier target {tier_target_id} and path '{path}'"
        else:
            message = "Rate limit configuration not found"
            debug = "The requested rate limit configuration could not be found"

        super().__init__(message=message, debug=debug, extra=extra)


class TierAlreadyExistsException(BadRequestException):
    """Exception raised when trying to create a tier with a name that already exists"""

    def __init__(
        self,
        tier_name: str,
        extra: dict[str, Any] | None = None,
    ):
        message = f"Tier with name '{tier_name}' already exists"
        debug = f"Cannot create tier with name '{tier_name}' as it already exists in the system"

        super().__init__(message=message, debug=debug, extra=extra)


class TierTargetAlreadyExistsException(BadRequestException):
    """Exception raised when trying to create a tier target that already exists"""

    def __init__(
        self,
        target_type: str,
        target_id: str,
        extra: dict[str, Any] | None = None,
    ):
        message = f"Tier target of type '{target_type}' with ID '{target_id}' already exists"
        debug = f"Cannot create tier target of type '{target_type}' with ID '{target_id}' as it already exists"

        super().__init__(message=message, debug=debug, extra=extra)


class RateLimitAlreadyExistsException(BadRequestException):
    """Exception raised when trying to create a rate limit that already exists"""

    def __init__(
        self,
        tier_target_id: int,
        path: str,
        extra: dict[str, Any] | None = None,
    ):
        message = f"Rate limit for tier target {tier_target_id} and path '{path}' already exists"
        debug = f"Cannot create rate limit for tier target {tier_target_id} and path '{path}' as it already exists"

        super().__init__(message=message, debug=debug, extra=extra)


class InvalidTierDataException(UnprocessableEntityException):
    """Exception raised when tier data is invalid"""

    def __init__(
        self,
        field: str | None = None,
        value: str | None = None,
        reason: str | None = None,
        extra: dict[str, Any] | None = None,
    ):
        if field and value:
            message = f"Invalid tier data: {field} '{value}' is not valid"
            debug = f"Tier validation failed for field '{field}' with value '{value}': {reason or 'Invalid format'}"
        else:
            message = "Invalid tier data provided"
            debug = "The tier data contains invalid values or format"

        super().__init__(message=message, debug=debug, extra=extra)


class InvalidRateLimitDataException(UnprocessableEntityException):
    """Exception raised when rate limit data is invalid"""

    def __init__(
        self,
        field: str | None = None,
        value: str | None = None,
        reason: str | None = None,
        extra: dict[str, Any] | None = None,
    ):
        if field and value:
            message = f"Invalid rate limit data: {field} '{value}' is not valid"
            debug = (
                f"Rate limit validation failed for field '{field}' with value '{value}': {reason or 'Invalid format'}"
            )
        else:
            message = "Invalid rate limit data provided"
            debug = "The rate limit data contains invalid values or format"

        super().__init__(message=message, debug=debug, extra=extra)


class PlansServiceException(ApplicationException):
    """Generic exception for plans service operations"""

    def __init__(
        self,
        operation: str | None = None,
        message: str = "Plans service operation failed",
        debug: str = "An error occurred during plans service operation",
        extra: dict[str, Any] | None = None,
    ):
        if operation:
            message = f"Plans service operation '{operation}' failed"
            debug = f"An error occurred during plans service operation: {operation}"

        super().__init__(message=message, debug=debug, extra=extra)
