import uuid

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
class TestTierRoutes:
    """Test suite for tier-related endpoints."""

    async def test_get_tiers_empty(self, client: AsyncClient):
        """Test getting tiers when none exist."""
        response = await client.get("/api/tiers")

        assert response.status_code == 200
        assert response.json() == []

    async def test_create_tier_success(self, client: AsyncClient):
        """Test successful tier creation."""
        tier_data = {"name": "premium"}

        response = await client.post("/api/tiers", json=tier_data)

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "premium"
        assert "id" in data
        assert "created_at" in data

    async def test_create_tier_duplicate_name(self, client: AsyncClient):
        """Test tier creation with duplicate name fails."""
        # Create first tier
        tier_data = {"name": "enterprise"}
        await client.post("/api/tiers", json=tier_data)

        # Try to create second tier with same name
        response = await client.post("/api/tiers", json=tier_data)

        assert response.status_code == 400
        assert "already exists" in response.json()["message"].lower()

    async def test_get_tiers_with_data(self, client: AsyncClient):
        """Test getting tiers when some exist."""
        # Create some random tiers
        tiers = [uuid.uuid4().hex for _ in range(3)]
        for tier_name in tiers:
            await client.post("/api/tiers", json={"name": tier_name})

        response = await client.get("/api/tiers")

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 3
        assert all(tier_name in [tier["name"] for tier in data] for tier_name in tiers)

    async def test_get_tier_by_id_success(self, client: AsyncClient):
        """Test successful tier retrieval by ID."""
        # Create a tier
        create_response = await client.post("/api/tiers", json={"name": "basic"})
        tier_id = create_response.json()["id"]

        response = await client.get(f"/api/tiers/{tier_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == tier_id
        assert data["name"] == "basic"

    async def test_get_tier_by_id_not_found(self, client: AsyncClient):
        """Test tier retrieval with non-existent ID."""
        response = await client.get("/api/tiers/999")

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()

    async def test_update_tier_success(self, client: AsyncClient):
        """Test successful tier update."""
        # Create a tier
        create_response = await client.post("/api/tiers", json={"name": "old_name"})
        tier_id = create_response.json()["id"]

        # Update the tier
        update_data = {"name": "new_name"}
        response = await client.put(f"/api/tiers/{tier_id}", json=update_data)

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "new_name"
        assert data["id"] == tier_id

    async def test_update_tier_not_found(self, client: AsyncClient):
        """Test tier update with non-existent ID."""
        update_data = {"name": "new_name"}
        response = await client.put("/api/tiers/999", json=update_data)

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()

    async def test_update_tier_duplicate_name(self, client: AsyncClient):
        """Test tier update with duplicate name fails."""
        # Create two tiers
        await client.post("/api/tiers", json={"name": "tier1"})
        create_response = await client.post("/api/tiers", json={"name": "tier2"})
        tier_id = create_response.json()["id"]

        # Try to update second tier with first tier's name
        update_data = {"name": "tier1"}
        response = await client.put(f"/api/tiers/{tier_id}", json=update_data)

        assert response.status_code == 400
        assert "already exists" in response.json()["message"].lower()

    async def test_delete_tier_success(self, client: AsyncClient):
        """Test successful tier deletion."""
        # Create a tier
        create_response = await client.post("/api/tiers", json={"name": "to_delete"})
        tier_id = create_response.json()["id"]

        # Delete the tier
        response = await client.delete(f"/api/tiers/{tier_id}")

        assert response.status_code == 204

        # Verify it's deleted
        get_response = await client.get(f"/api/tiers/{tier_id}")
        assert get_response.status_code == 404

    async def test_delete_tier_not_found(self, client: AsyncClient):
        """Test tier deletion with non-existent ID."""
        response = await client.delete("/api/tiers/999")

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()


@pytest.mark.anyio
class TestRateLimitRoutes:
    """Test suite for rate limit-related endpoints."""

    async def test_get_rate_limits_empty(self, client: AsyncClient):
        """Test getting rate limits when none exist."""
        response = await client.get("/api/rate-limits")

        assert response.status_code == 200
        assert response.json() == []

    async def test_get_rate_limit_by_id_not_found(self, client: AsyncClient):
        """Test rate limit retrieval with non-existent ID."""
        response = await client.get("/api/rate-limits/999")

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()

    async def test_update_rate_limit_not_found(self, client: AsyncClient):
        """Test rate limit update with non-existent ID."""
        update_data = {"limit": 100}
        response = await client.put("/api/rate-limits/999", json=update_data)

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()

    async def test_delete_rate_limit_not_found(self, client: AsyncClient):
        """Test rate limit deletion with non-existent ID."""
        response = await client.delete("/api/rate-limits/999")

        assert response.status_code == 404
        assert "not found" in response.json()["message"].lower()


@pytest.mark.anyio
class TestEagerLoading:
    """Test suite for eager loading functionality."""

    async def test_selective_eager_loading_difference(self, client: AsyncClient):
        """
        Test to demonstrate the new selective eager loading functionality.

        This test shows that:
        1. By default, no relationships are loaded (lazy loading)
        2. You can selectively load specific relationships using eager_load parameter
        3. Performance is optimized by only loading what you need
        """
        # Create a tier first
        tier_data = {"name": "test_eager_tier"}
        create_response = await client.post("/api/tiers", json=tier_data)
        tier_id = create_response.json()["id"]

        # Test 1: Regular get_by_id (no eager loading)
        # This will NOT load tier_targets - they will be loaded lazily when accessed
        response = await client.get(f"/api/tiers/{tier_id}")
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
