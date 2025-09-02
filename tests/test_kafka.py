import asyncio
import uuid
from contextlib import asynccontextmanager, suppress
from typing import cast

import pytest
from aiokafka import ConsumerRecord
from fastapi import FastAPI
from httpx import AsyncClient
from rest_angular.config import settings
from rest_angular.infra.bus.kafka import get_kafka_consumer
from starlette import status

consumer_context = asynccontextmanager(get_kafka_consumer)


@pytest.mark.anyio
async def test_message_publishing(
    fastapi_app: FastAPI,
    client: AsyncClient,
) -> None:
    topic_name = uuid.uuid4().hex
    message = uuid.uuid4().hex
    message_received_future: asyncio.Future[bool] = asyncio.Future()

    async def _consume_messages() -> None:
        try:
            async for rec in consumer:  # type: ignore[assignment]
                rec = cast(ConsumerRecord[bytes, bytes], rec)
                if rec.topic == topic_name and rec.value is not None and rec.value.decode() == message:
                    if not message_received_future.done():
                        message_received_future.set_result(True)
                    break
        except asyncio.CancelledError:
            pass

    # Send message first to create the topic
    url = fastapi_app.url_path_for("test_send_kafka_message")
    response = await client.post(url, json={"topic": topic_name, "message": message})
    assert response.status_code == status.HTTP_200_OK

    async with consumer_context(settings) as consumer:
        # Small delay to ensure topic is created
        await asyncio.sleep(0.5)

        consumer.subscribe(topics=[topic_name])
        consumer_task = asyncio.create_task(_consume_messages())

        try:
            try:
                # Set timeout to 5 seconds to avoid hanging the test
                await asyncio.wait_for(message_received_future, timeout=5.0)
            except asyncio.TimeoutError:
                pytest.fail("Timeout when waiting for message to be consumed.")
        finally:
            consumer_task.cancel()
            with suppress(asyncio.CancelledError):
                await consumer_task

    assert message_received_future.result() is True
