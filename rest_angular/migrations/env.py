import os
import sys

sys.path.append(os.path.abspath(os.path.join(__file__, "..", "..")))
print(sys.path)

from logging.config import fileConfig

from alembic import context
from rest_angular.config import settings
from rest_angular.infra.orm.base_model import Base
from rest_angular.migrations import models
from sqlalchemy import engine_from_config, pool

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations() -> None:
    """Run migrations in 'online' mode."""
    configuration = config.get_section(config.config_ini_section)
    if configuration is None:
        raise ValueError("Alembic init section is not found in alembic.ini")

    configuration["sqlalchemy.url"] = settings.db_url.replace("+asyncpg", "+psycopg2")

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_schemas=True,
        )

        with context.begin_transaction():
            context.run_migrations()


run_migrations()
