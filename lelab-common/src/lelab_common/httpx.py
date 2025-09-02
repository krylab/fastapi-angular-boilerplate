import httpx

from .cancellation_context import CancellationContext


class HttpService:
    def __init__(self, context: CancellationContext) -> None:
        self._context = context

    async def get(self, url: str, timeout: float = 10) -> httpx.Response:
        async with httpx.AsyncClient(timeout=timeout) as client:
            return await self._context.wait_for(client.get(url))
