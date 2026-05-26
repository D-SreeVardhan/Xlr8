# Tech Stack

Every dependency. Updated whenever a new package is added.

## Frontend (`frontend/`)

| Package | Version | Purpose |
|---|---|---|
| `next` | 15.x | App Router, React 19, server actions, Turbopack |
| `react` / `react-dom` | 19.x | UI runtime |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 4.x | Utility-first styling |
| `@apollo/client` | 3.x | GraphQL client with subscription support |
| `graphql` | 16.x | Reference implementation |
| `graphql-ws` | 5.x | WebSocket subscription transport |
| `@graphql-codegen/cli` + `client-preset` | 5.x | Auto-generated typed React hooks from `.graphql` files |
| `recharts` | 2.x | Most KPI charts |
| `@visx/*` | 3.x | Custom visualizations (bed Tetris, dependency graph) |
| `react-leaflet` + `leaflet` | 4.x / 1.9.x | Ambulance live map |
| `framer-motion` | 11.x | Minimal motion (number flip, overlay transitions) |
| `sonner` | 1.x | Toast notifications |
| `vega` + `vega-lite` + `react-vega` | 5.x / 5.x / 7.x | Concierge inline chart rendering |
| `cmdk` | 1.x | Cmd+K palette for Concierge |
| `clsx` + `tailwind-merge` | latest | Class utilities |

### Fonts (self-hosted via `next/font/google`)

- **Fraunces** — display serif for KPI headline numbers
- **Inter** — body
- **JetBrains Mono** — timestamps, IDs, tool-trace JSON

## Backend (`backend/`)

| Package | Version | Purpose |
|---|---|---|
| `fastapi` | 0.115+ | HTTP framework |
| `uvicorn[standard]` | 0.30+ | ASGI server with WebSocket support |
| `strawberry-graphql[fastapi]` | 0.230+ | GraphQL schema, subscriptions, GraphiQL playground |
| `sqlalchemy` | 2.x | ORM |
| `pydantic` + `pydantic-settings` | 2.x | Schemas, env-var loading |
| `openai` | 1.50+ | LLM client (gpt-4o-mini, gpt-4o) |
| `httpx` | 0.27+ | Async HTTP for any external calls |
| `pandas` | 2.x | Aggregations for KPIs |
| `numpy` | 1.x | Numerics |
| `scikit-learn` | 1.5+ | Logistic Regression (attrition), IsolationForest (anomaly) |
| `xgboost` | 2.x | Denial-risk classifier |
| `prophet` | 1.x | Surge forecasting with festival + AQI regressors |
| `transformers` + `torch` | 4.x / 2.x | Pretrained sentiment model (CPU only) |
| `faker` | 28+ | Synthetic-data generation |
| `python-dateutil` | 2.x | Festival calendar arithmetic |

## Dev tooling

| Tool | Purpose |
|---|---|
| `ruff` | Python lint + format |
| `mypy` | Static typing |
| `eslint` + `@typescript-eslint` | JS/TS lint |
| `prettier` | JS/TS format |

## Why these choices

See ADRs in [`adr/`](adr/) for non-obvious decisions:
- GraphQL over REST → [`adr/0001-graphql-over-rest.md`](adr/0001-graphql-over-rest.md)
- OpenAI over Groq → [`adr/0002-openai-over-groq.md`](adr/0002-openai-over-groq.md)
- Strawberry over Graphene → [`adr/0003-strawberry-over-graphene.md`](adr/0003-strawberry-over-graphene.md)
- Apollo Client over urql → [`adr/0004-apollo-client-over-urql.md`](adr/0004-apollo-client-over-urql.md)
- SSE over GraphQL subs for LLM streaming → [`adr/0005-sse-for-concierge-stream.md`](adr/0005-sse-for-concierge-stream.md)
- SQLite for prototype → [`adr/0006-sqlite-for-prototype.md`](adr/0006-sqlite-for-prototype.md)
