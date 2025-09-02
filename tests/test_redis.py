import uuid

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette import status


@pytest.mark.anyio
async def test_setting_value(
    fastapi_app: FastAPI,
    client: AsyncClient,
) -> None:
    """
    Tests that you can set value in redis.

    :param fastapi_app: current application fixture.
    :param client: client fixture.
    """
    url = fastapi_app.url_path_for("test_set_redis_value")

    test_key = uuid.uuid4().hex
    test_val = uuid.uuid4().hex
    response = await client.put(url, json={"key": test_key, "value": test_val})

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.anyio
async def test_getting_value(
    fastapi_app: FastAPI,
    client: AsyncClient,
) -> None:
    """
    Tests that you can get value from redis by key.

    :param fastapi_app: current application fixture.
    :param client: client fixture.
    """
    test_key = uuid.uuid4().hex
    test_val = uuid.uuid4().hex

    # First set a value
    set_url = fastapi_app.url_path_for("test_set_redis_value")
    set_response = await client.put(set_url, json={"key": test_key, "value": test_val})
    assert set_response.status_code == status.HTTP_200_OK

    # Then get the value
    get_url = fastapi_app.url_path_for("test_get_redis_value")
    get_response = await client.get(get_url, params={"key": test_key})

    assert get_response.status_code == status.HTTP_200_OK
    assert get_response.json()["key"] == test_key
    assert get_response.json()["value"] == test_val
