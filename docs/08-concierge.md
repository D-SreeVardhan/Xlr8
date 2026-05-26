# AI Concierge

The Concierge is a tool-using executive analyst. It must answer from dashboard data, not generic healthcare advice.

## Model

- Default: OpenAI `gpt-4o-mini`
- Escalation: `gpt-4o` when a request requires more than two tool calls or a multi-step what-if simulation.

## Transport

- Frontend sends a message to `POST /api/concierge/stream`.
- Backend streams SSE events: tokens, tool traces, charts, done/error.

## Tools

All tools execute persisted GraphQL operations.

| Tool | GraphQL Backing | Purpose |
|---|---|---|
| `query_metric` | whitelisted queries | Retrieve metrics with filters |
| `simulate_action` | `runSimulation` mutation | Run what-if scenarios |
| `mutate_dashboard` | subscription event | Apply simulation overlay |
| `revert_dashboard` | `revertSimulation` mutation | Undo overlay |
| `cite_evidence` | raw query payload | Ground numeric claims |

## Guardrails

- Refuse questions outside the hospital/company dashboard scope.
- No numeric claim without evidence.
- No hidden medical advice to patients.
- Explain uncertainty and show source rows when confidence is low.
- Tool operations are allowlisted; no arbitrary SQL or arbitrary GraphQL text from the model.

## Example

User: `Add 10 ICU beds at Banjara Hills`

Expected flow:

1. `simulate_action(ADD_BEDS, { facility: \"Banjara Hills\", department: \"ICU\", count: 10 })`
2. Return revenue, occupancy, cost, staffing, payback deltas.
3. `mutate_dashboard(snapshotId)`
4. Frontend shows `SIMULATED` badges and a revert banner.
