from typing import Any

from fastapi import APIRouter

router = APIRouter()


@router.get("/health", name="health_check")
async def health_check() -> dict[str, str]:
    """
    Health check endpoint.

    :return: health status.
    """
    return {"status": "ok"}
