import logging
import os
import sys
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path
from zoneinfo import ZoneInfo


class ISO8601Formatter(logging.Formatter):
    """
    Formatter that uses ISO8601 date format with time zone support.
    """

    def formatTime(self, record, datefmt=None):
        tz_name = os.environ.get("TZ", "UTC")
        dt = datetime.fromtimestamp(record.created, tz=ZoneInfo(tz_name))
        return dt.isoformat()


class ColoredISO8601Formatter(ISO8601Formatter):
    COLORS = {
        "DEBUG": "\033[36m",  # Cyan
        "INFO": "\033[32m",  # Green
        "WARNING": "\033[33m",  # Yellow
        "ERROR": "\033[31m",  # Red
        "CRITICAL": "\033[35m",  # Magenta
    }
    RESET = "\033[0m"

    def format(self, record):
        original_levelname = record.levelname
        color = self.COLORS.get(record.levelname, "")
        if color:
            record.levelname = f"{color}{record.levelname}{self.RESET}"

        try:
            message = super().format(record)
        finally:
            # Restore original levelname to avoid affecting other handlers
            record.levelname = original_levelname

        return message


def setup_logger(
    log_level: str = "INFO",
    log_dir: str | Path = "logs",
    log_filename: str = "app.log",
    rotation: str = "midnight",
    retention_days: int = 7,
) -> logging.Logger:
    """
    Setup root logger with iso8601 datetime and return root logger instance.

    Args:
        log_level: Logging level (default: INFO)
        log_dir: Directory to store log files (default: logs)
        log_filename: Name of the log file (default: app.log)
        rotation: Rotation interval for TimedRotatingFileHandler (default: midnight)
        retention_days: Number of days to keep log files (default: 7)
    """
    logger = logging.getLogger()
    logger.setLevel(log_level)

    # Clear existing handlers
    if logger.handlers:
        logger.handlers.clear()

    formatter_str = "%(levelname)s:\t%(asctime)s\t[%(name)s]\t%(message)s"

    # Console Handler
    console_formatter = ColoredISO8601Formatter(formatter_str)
    channel = logging.StreamHandler(sys.stdout)
    channel.setFormatter(console_formatter)
    logger.addHandler(channel)

    # File Handler
    if log_dir:
        try:
            log_path = Path(log_dir)
            log_path.mkdir(parents=True, exist_ok=True)
            file_path = log_path / log_filename

            file_handler = TimedRotatingFileHandler(
                filename=file_path,
                when=rotation,
                interval=1,
                backupCount=retention_days,
                encoding="utf-8",
            )
            # Use plain ISO8601 formatter for files (no colors)
            file_formatter = ISO8601Formatter(formatter_str)
            file_handler.setFormatter(file_formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            # Fallback to stderr if file logging fails
            print(f"Failed to setup file logging: {e}", file=sys.stderr)

    return logger
