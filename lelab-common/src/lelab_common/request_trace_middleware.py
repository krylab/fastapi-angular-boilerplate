import logging
import time
import uuid

from starlette import status
from starlette.datastructures import MutableHeaders
from starlette.responses import JSONResponse as StarletteJSONResponse
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from .exceptions import ApplicationException

logger = logging.getLogger(__name__)


class RequestTraceMiddleware:
    """
    ASGI middleware that handles request tracing, timing, and exception handling.

    Features:
    - Integrates with OpenTelemetry trace IDs when available
    - Falls back to UUID generation when OTEL is not configured
    - Measures request processing time
    - Adds trace_id and processing time headers to all responses
    - Handles exceptions with proper error responses
    - Comprehensive request/response logging
    """

    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Initialize request tracking
        start_time = time.time()
        trace_id = self._get_trace_id_from_scope(scope)
        method = scope.get("method", "UNKNOWN")
        path = scope.get("path", "unknown")
        process_time = "0"
        status_code = "unknown"

        # Store trace_id in scope for access by other middleware/handlers
        scope["trace_id"] = trace_id

        # Log the start of request with trace_id
        logger.info(f"Request started - trace_id: {trace_id}, {method} {path}")

        async def send_with_headers(message: Message) -> None:
            """Intercept response to add trace_id and timing headers"""
            nonlocal process_time, status_code

            if message["type"] == "http.response.start":
                # Calculate processing time
                process_time_ms = time.time() - start_time
                process_time = str(int(round(process_time_ms * 1000)))
                status_code = str(message.get("status", "unknown"))

                # Add headers using MutableHeaders for better handling
                headers = MutableHeaders(scope=message)
                headers.append("x-trace-id", trace_id)
                headers.append("x-process-time", process_time)

            await send(message)

        try:
            # Process the request (OTEL context is already set if available)
            await self.app(scope, receive, send_with_headers)
            logger.info(f"Request completed - trace_id: {trace_id}, {method} {path} - {process_time}ms - {status_code}")
        except Exception as exc:
            # Calculate processing time for error case
            error_process_time_ms = time.time() - start_time
            error_process_time = str(int(round(error_process_time_ms * 1000)))

            # Create error response using Starlette's JSONResponse
            if isinstance(exc, ApplicationException):
                response_status = exc.status
                error_content = {
                    "status": exc.status,
                    "type": exc.type,
                    "message": exc.message,
                    "debug": "Application error occurred",
                    "extra": {"trace_id": trace_id, **(exc.extra or {})},
                }
            else:
                response_status = status.HTTP_500_INTERNAL_SERVER_ERROR
                user_message = self.get_user_friendly_message(exc)

                error_content = {
                    "status": response_status,
                    "type": exc.__class__.__name__,
                    "message": user_message,
                    "debug": "Contact admin for further info",
                    "extra": {"trace_id": trace_id},
                }

            logger.error(
                f"Request failed - trace_id: {trace_id}, {method} {path} - {error_process_time}ms - {response_status} - {exc}"
            )

            # Use Starlette's JSONResponse to ensure proper ASGI handling
            response = StarletteJSONResponse(
                content=error_content,
                status_code=response_status,
                headers={
                    "x-trace-id": trace_id,
                    "x-process-time": error_process_time,
                },
            )

            # Send the response using Starlette's built-in ASGI handling
            await response(scope, receive, send)

    def get_user_friendly_message(self, exc: Exception) -> str:
        """Convert technical exceptions to user-friendly messages"""
        exc_name = exc.__class__.__name__
        exc_str = str(exc).lower()

        # Database-related errors
        if "undefinedtable" in exc_name.lower() or "relation" in exc_str and "does not exist" in exc_str:
            return "The service is temporarily unavailable. Please try again later."

        if "operationalerror" in exc_name.lower():
            if "connection" in exc_str:
                return "Database connection issue. Please try again in a moment."
            return "A database error occurred. Please try again later."

        if "integrityerror" in exc_name.lower():
            if "unique" in exc_str or "duplicate" in exc_str:
                return "This information already exists. Please check your input."
            return "The data you provided conflicts with existing information."

        # Validation errors
        if "validationerror" in exc_name.lower():
            return "The information you provided is invalid. Please check and try again."

        # Permission errors
        if "permissionerror" in exc_name.lower() or "forbidden" in exc_str:
            return "You don't have permission to perform this action."

        # Timeout errors
        if "timeout" in exc_name.lower() or "timeout" in exc_str:
            return "The request timed out. Please try again."

        # File/IO errors
        if "filenotfounderror" in exc_name.lower():
            return "A required resource was not found. Please contact support."

        # Default fallback
        return "An unexpected error occurred. Please try again later."

    def _get_trace_id_from_scope(self, scope: Scope) -> str:
        """
        Extract trace ID from OpenTelemetry context or generate a fallback.

        Args:
            scope: ASGI scope containing request information

        Returns:
            Trace ID string (either from OTEL or fallback UUID)
        """
        try:
            # First priority: Check headers for existing trace ID (for distributed tracing)
            headers: dict[bytes, bytes] = dict(scope.get("headers", []))
            trace_header = headers.get(b"x-trace-id")
            if trace_header:
                trace_id = trace_header.decode("utf-8")

                # Set the trace context in OpenTelemetry if available
                try:
                    from opentelemetry import trace
                    from opentelemetry.trace import SpanContext, TraceFlags
                    from opentelemetry.trace.span import INVALID_SPAN_ID

                    # Convert hex string to int for trace_id
                    try:
                        trace_id_int = int(trace_id, 16)
                        # Create a span context with the trace ID from headers
                        span_context = SpanContext(
                            trace_id=trace_id_int,
                            span_id=INVALID_SPAN_ID,  # We don't have span_id from headers
                            is_remote=True,
                            trace_flags=TraceFlags(0),
                        )

                        # Create a non-recording span with the context
                        non_recording_span = trace.NonRecordingSpan(span_context)
                        # Set the span context as current
                        context = trace.set_span_in_context(non_recording_span)
                        # Store context in scope for later use
                        scope["otel_context"] = context
                    except ValueError:
                        logger.warning(f"Invalid trace ID format in header: {trace_id}")

                except ImportError:
                    pass
                except Exception:
                    pass

                return trace_id

            # Second priority: Try to get from current OTEL span context
            try:
                from opentelemetry import trace

                current_span = trace.get_current_span()
                if current_span:
                    span_context = current_span.get_span_context()
                    if span_context and span_context.trace_id:
                        trace_id = format(span_context.trace_id, "032x")
                        return trace_id
            except ImportError:
                pass
            except Exception:
                pass

            # Final fallback: generate UUID
            fallback_trace_id = str(uuid.uuid4())
            return fallback_trace_id

        except Exception as e:
            logger.warning(f"Failed to extract trace ID from OTEL context: {e}")
            fallback_trace_id = str(uuid.uuid4())
            return fallback_trace_id
