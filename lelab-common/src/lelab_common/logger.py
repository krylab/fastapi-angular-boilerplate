import logging
import os
from datetime import datetime
from zoneinfo import ZoneInfo


class ColoredISO8601Formatter(logging.Formatter):
    COLORS = {
        "DEBUG": "\033[36m",  # Cyan
        "INFO": "\033[32m",  # Green
        "WARNING": "\033[33m",  # Yellow
        "ERROR": "\033[31m",  # Red
        "CRITICAL": "\033[35m",  # Magenta
    }
    RESET = "\033[0m"

    def formatTime(self, record, datefmt=None):
        tz_name = os.environ.get("TZ", "UTC")
        dt = datetime.fromtimestamp(record.created, tz=ZoneInfo(tz_name))
        return dt.isoformat()

    def format(self, record):
        color = self.COLORS.get(record.levelname, "")
        if color:
            record.levelname = f"{color}{record.levelname}{self.RESET}"
        message = super().format(record)
        return message


def setup_logger():
    """
    Setup root logger with iso8601 datetime and return root logger instance.
    """
    logger = logging.getLogger()

    formatter = ColoredISO8601Formatter("%(levelname)s:\t%(asctime)s\t[%(name)s]\t%(message)s")
    channel = logging.StreamHandler()
    channel.setFormatter(formatter)

    logger.addHandler(channel)

    return logger
