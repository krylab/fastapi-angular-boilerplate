from typing import Any

from pydantic import BaseModel

from .exceptions import (
    ApplicationException,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    UnprocessableEntityException,
)


class ErrorResponse(BaseModel):
    status: int = 500
    type: str = "ApplicationException"
    message: str = "The requested operation failed"
    debug: str = "An unknown and unhandled exception occurred in the API"
    extra: dict[str, Any] | None = None


__all__ = ["responses_model"]

responses_model: dict[int | str, dict[str, Any]] = {
    400: {
        "model": ErrorResponse,
        "content": {"application/json": {"example": BadRequestException().to_dict()}},
    },
    401: {
        "model": ErrorResponse,
        "content": {
            "application/json": {
                "example": ErrorResponse(
                    status=401,
                    type="UnauthorizedException",
                    message="Token validation failed",
                ).model_dump()
            }
        },
    },
    403: {
        "model": ErrorResponse,
        "content": {"application/json": {"example": ForbiddenException().to_dict()}},
    },
    404: {
        "model": ErrorResponse,
        "content": {"application/json": {"example": NotFoundException().to_dict()}},
    },
    422: {
        "model": ErrorResponse,
        "content": {"application/json": {"example": UnprocessableEntityException().to_dict()}},
    },
    500: {
        "model": ErrorResponse,
        "content": {"application/json": {"example": ApplicationException().to_dict()}},
    },
}
