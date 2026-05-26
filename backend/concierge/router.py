import json
from collections.abc import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ml.registry import model_snapshot
from services.simulator import run_simulation

router = APIRouter(prefix="/api/concierge", tags=["concierge"])


class ConciergeRequest(BaseModel):
    message: str


def sse(event: str, payload: dict[str, object]) -> str:
    return f"event: {event}\ndata: {json.dumps(payload)}\n\n"


async def stream_response(message: str) -> AsyncGenerator[str, None]:
    snapshot = model_snapshot()
    result = run_simulation(message)

    yield sse("tool_start", {"name": "model_snapshot", "arguments": {}})
    yield sse("tool_result", {"name": "model_snapshot", "result": snapshot})
    yield sse("tool_start", {"name": "simulate_action", "arguments": {"message": message}})
    yield sse("tool_result", {"name": "simulate_action", "result": result.__dict__})

    text = (
        f"Simulation applied: {result.action}. "
        f"Revenue changes by {result.revenue_delta_pct:+.1f}%, ER wait time changes by "
        f"{result.er_wait_delta_pct:+.1f}%, operating cost changes by "
        f"{result.cost_delta_pct:+.1f}%, and occupancy changes by "
        f"{result.occupancy_delta_pct:+.1f}%. Estimated payback is "
        f"{result.payback_months} months. {result.staffing_note}"
    )

    for token in text.split(" "):
        yield sse("token", {"text": f"{token} "})

    yield sse("done", {"status": "complete"})


@router.post("/stream")
async def stream_concierge(request: ConciergeRequest) -> StreamingResponse:
    return StreamingResponse(stream_response(request.message), media_type="text/event-stream")
