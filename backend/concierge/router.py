import asyncio
import json
from collections.abc import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ml.registry import model_snapshot
from services.business_impact import BusinessImpact, project_business_impact

router = APIRouter(prefix="/api/concierge", tags=["concierge"])


class ConciergeRequest(BaseModel):
    message: str


def sse(event: str, payload: dict[str, object]) -> str:
    return f"event: {event}\ndata: {json.dumps(payload)}\n\n"


async def _stream_tokens(text: str) -> AsyncGenerator[str, None]:
    for token in text.split(" "):
        yield sse("token", {"text": f"{token} "})
        await asyncio.sleep(0.025)


async def stream_response(message: str) -> AsyncGenerator[str, None]:
    snapshot = model_snapshot()

    yield sse(
        "meta",
        {
            "snapshot": snapshot,
            "question": message,
        },
    )
    await asyncio.sleep(0)

    impact: BusinessImpact = await project_business_impact(message, snapshot)

    yield sse(
        "action",
        {
            "action": impact.action,
            "horizon": impact.horizon,
            "source": impact.source,
        },
    )

    headline = f"{impact.action}. {impact.summary}"
    async for chunk in _stream_tokens(headline):
        yield chunk

    yield sse("impact", impact.model_dump())
    yield sse("done", {"status": "complete", "source": impact.source})


@router.post("/stream")
async def stream_concierge(request: ConciergeRequest) -> StreamingResponse:
    return StreamingResponse(
        stream_response(request.message),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
