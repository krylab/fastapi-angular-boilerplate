from pydantic import Field
from pydantic_settings import BaseSettings


class KafkaSettings(BaseSettings):
    """Kafka message bus settings."""

    kafka_bootstrap_servers: str = Field(default="rest_angular-kafka:9092", description="Kafka bootstrap servers")
