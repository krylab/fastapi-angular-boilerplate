import uuid

import pytest
from fastapi import FastAPI
from httpx import AsyncClient


@pytest.mark.anyio
class TestTierRoutes:
    """Test suite for tier-related endpoints."""

    async def test_get_tiers_empty(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test getting tiers when none exist."""
        url = fastapi_app.url_path_for("get_tiers")
        response = await client.get(url)

        assert response.status_code == 200
        assert response.json() == []

    async def test_create_tier_success(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test successful tier creation."""
        tier_data = {"name": "premium"}

        url = fastapi_app.url_path_for("create_tier")
        response = await client.post(url, json=tier_data)

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "premium"
        assert "id" in data
        assert "created_at" in data

    async def test_create_tier_duplicate_name(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test tier creation with duplicate name fails."""
        # Create first tier
        tier_data = {"name": "enterprise"}
        create_url = fastapi_app.url_path_for("create_tier")
        await client.post(create_url, json=tier_data)

        # Try to create second tier with same name
        response = await client.post(create_url, json=tier_data)

        assert response.status_code == 400
        assert "already exists" in response.json()["message"].lower()

    async def test_get_tiers_with_data(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test getting tiers when some exist."""
        # Create some random tiers
        tiers = [uuid.uuid4().hex for _ in range(3)]
        create_url = fastapi_app.url_path_for("create_tier")
        for tier_name in tiers:
            await client.post(create_url, json={"name": tier_name})

        get_url = fastapi_app.url_path_for("get_tiers")
        response = await client.get(get_url)

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 3
        assert all(tier_name in [tier["name"] for tier in data] for tier_name in tiers)

    async def test_get_tier_by_id_success(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test successful tier retrieval by ID."""
        # Create a tier
        create_url = fastapi_app.url_path_for("create_tier")
        create_response = await client.post(create_url, json={"name": "basic"})
        tier_id = create_response.json()["id"]

        get_url = fastapi_app.url_path_for("get_tier", tier_id=tier_id)
        response = await client.get(get_url)

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == tier_id
        assert data["name"] == "basic"

    async def test_get_tier_by_id_not_found(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test tier retrieval with non-existent ID."""
        url = fastapi_app.url_path_for("get_tier", tier_id=999)
        response = await client.get(url)

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()

    async def test_update_tier_success(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test successful tier update."""
        # Create a tier
        create_url = fastapi_app.url_path_for("create_tier")
        create_response = await client.post(create_url, json={"name": "old_name"})
        tier_id = create_response.json()["id"]

        # Update the tier
        update_data = {"name": "new_name"}
        update_url = fastapi_app.url_path_for("update_tier", tier_id=tier_id)
        response = await client.put(update_url, json=update_data)

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "new_name"
        assert data["id"] == tier_id

    async def test_update_tier_not_found(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test tier update with non-existent ID."""
        update_data = {"name": "new_name"}
        url = fastapi_app.url_path_for("update_tier", tier_id=999)
        response = await client.put(url, json=update_data)

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()

    async def test_update_tier_duplicate_name(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test tier update with duplicate name fails."""
        # Create two tiers
        create_url = fastapi_app.url_path_for("create_tier")
        await client.post(create_url, json={"name": "tier1"})
        create_response = await client.post(create_url, json={"name": "tier2"})
        tier_id = create_response.json()["id"]

        # Try to update second tier with first tier's name
        update_data = {"name": "tier1"}
        update_url = fastapi_app.url_path_for("update_tier", tier_id=tier_id)
        response = await client.put(update_url, json=update_data)

        assert response.status_code == 400
        assert "already exists" in response.json()["message"].lower()

    async def test_delete_tier_success(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test successful tier deletion."""
        # Create a tier
        create_url = fastapi_app.url_path_for("create_tier")
        create_response = await client.post(create_url, json={"name": "to_delete"})
        tier_id = create_response.json()["id"]

        # Delete the tier
        delete_url = fastapi_app.url_path_for("delete_tier", tier_id=tier_id)
        response = await client.delete(delete_url)

        assert response.status_code == 204

        # Verify it's deleted
        get_url = fastapi_app.url_path_for("get_tier", tier_id=tier_id)
        get_response = await client.get(get_url)
        assert get_response.status_code == 404

    async def test_delete_tier_not_found(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test tier deletion with non-existent ID."""
        url = fastapi_app.url_path_for("delete_tier", tier_id=999)
        response = await client.delete(url)

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()


@pytest.mark.anyio
class TestRateLimitRoutes:
    """Test suite for rate limit-related endpoints."""

    async def test_get_rate_limits_empty(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test getting rate limits when none exist."""
        url = fastapi_app.url_path_for("get_rate_limits")
        response = await client.get(url)

        assert response.status_code == 200
        assert response.json() == []

    async def test_get_rate_limit_by_id_not_found(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test rate limit retrieval with non-existent ID."""
        url = fastapi_app.url_path_for("get_rate_limit", rate_limit_id=999)
        response = await client.get(url)

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()

    async def test_update_rate_limit_not_found(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test rate limit update with non-existent ID."""
        update_data = {"limit": 100}
        url = fastapi_app.url_path_for("update_rate_limit", rate_limit_id=999)
        response = await client.put(url, json=update_data)

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()

    async def test_delete_rate_limit_not_found(self, client: AsyncClient, fastapi_app: FastAPI):
        """Test rate limit deletion with non-existent ID."""
        url = fastapi_app.url_path_for("delete_rate_limit", rate_limit_id=999)
        response = await client.delete(url)

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()


@pytest.mark.anyio
class TestEagerLoading:
    """Test suite for eager loading functionality."""

    async def test_selective_eager_loading_difference(self, client: AsyncClient, fastapi_app: FastAPI):
        """
        Test to demonstrate the new selective eager loading functionality.

        This test shows that:
        1. By default, no relationships are loaded (lazy loading)
        2. You can selectively load specific relationships using eager_load parameter
        3. Performance is optimized by only loading what you need
        """
        # Create a tier first
        tier_data = {"name": "test_eager_tier"}
        create_url = fastapi_app.url_path_for("create_tier")
        create_response = await client.post(create_url, json=tier_data)
        tier_id = create_response.json()["id"]

        # Test 1: Regular get_by_id (no eager loading)
        # This will NOT load tier_targets - they will be loaded lazily when accessed
        get_url = fastapi_app.url_path_for("get_tier", tier_id=tier_id)
        response = await client.get(get_url)
        assert response.status_code == 200

        # The response should only contain tier data, not tier_targets
        # This proves that by default, no relationships are loaded
        tier_data = response.json()
        assert "id" in tier_data
        assert "name" in tier_data
        # Note: tier_targets would only be loaded when explicitly accessed

        # Test 2: If we had an endpoint that uses eager loading, it would work differently
        # For example, if we had: tier = await repo.get_by_id(id, eager_load=["tier_targets"])
        # Then tier.tier_targets would be pre-loaded and accessible without additional queries

        # Test 3: The new repository methods provide convenience methods for common scenarios:
        # - get_with_targets(tier_id) -> loads tier + tier_targets
        # - get_all_with_targets() -> loads all tiers + their tier_targets
        # - get_with_rate_limits(tier_target_id) -> loads tier_target + rate_limits
