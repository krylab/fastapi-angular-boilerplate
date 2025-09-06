# Lelab Common Module

Common utilities and shared components for lelab projects.

## Installation

```bash
uv add ./lelab-common
```

## Usage

```python
from lelab_common import configuration, exceptions, logger
from lelab_common.auth import bearer_jwt, oauth2_jwt
```

## Development

```bash
cd lelab-common
uv sync
uv run pytest
```
