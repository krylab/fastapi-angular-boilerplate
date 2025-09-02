from typing import Annotated, AsyncGenerator

from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from fastapi import Depends
from lelab_common import Settings

from .settings import KafkaSettings


async def get_kafka_producer(settings: Settings) -> AsyncGenerator[AIOKafkaProducer, None]:
    """Get kafka producer"""
    if isinstance(settings, KafkaSettings):
        bootstrap_servers = settings.kafka_bootstrap_servers
    else:
        raise NotImplementedError("The application settings is not inherited from KafkaSettings")

    async with AIOKafkaProducer(
        bootstrap_servers=bootstrap_servers,
    ) as kafka_producer:
        yield kafka_producer
        await kafka_producer.stop()


KafkaProducer = Annotated[AIOKafkaProducer, Depends(get_kafka_producer)]


async def get_kafka_consumer(settings: Settings) -> AsyncGenerator[AIOKafkaConsumer, None]:
    """Get kafka consumer"""
    if isinstance(settings, KafkaSettings):
        bootstrap_servers = settings.kafka_bootstrap_servers
    else:
        raise NotImplementedError("The application settings is not inherited from KafkaSettings")

    async with AIOKafkaConsumer(
        bootstrap_servers=bootstrap_servers,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
    ) as kafka_consumer:
        yield kafka_consumer
        await kafka_consumer.stop()


KafkaConsumer = Annotated[AIOKafkaConsumer, Depends(get_kafka_consumer)]
