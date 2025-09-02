# Use a Python base image with uv pre-installed for convenience and speed.
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS final

# Set environment variables for uv to optimize builds
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

# Set the working directory inside the container
WORKDIR /app

# Copy the Python modules and their dependencies
COPY pyproject.toml uv.lock README.md ./
COPY lelab-common/ ./lelab-common/
COPY rest_angular/ ./rest_angular/

# Install all dependencies and the project itself
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Set the PATH to include the virtual environment's bin directory
ENV PATH="/app/.venv/bin:$PATH"

# Expose the port your application listens on
EXPOSE 8000

# Set the default command to run the FastAPI application
CMD ["python", "-m", "rest_angular"]
