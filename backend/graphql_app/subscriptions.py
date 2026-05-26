import asyncio
from collections.abc import AsyncGenerator
from datetime import UTC, datetime

import strawberry

from graphql_app.types.executive import ExecutiveFlashType


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def executive_flash_ticks(
        self, facility_id: str = "hyd-banjara"
    ) -> AsyncGenerator[ExecutiveFlashType, None]:
        while True:
            await asyncio.sleep(5)
            yield ExecutiveFlashType(
                facility_id=facility_id,
                captured_at=datetime.now(UTC),
                revenue_cr=18.4,
                arpob=60588,
                occupancy_pct=68.0,
                alos_days=3.8,
                operating_ebitda_margin_pct=22.4,
                ebitda_per_bed_lakh=64.2,
                is_simulated=False,
            )
