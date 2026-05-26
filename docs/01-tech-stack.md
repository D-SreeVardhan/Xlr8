# Tech Stack

Every dependency. Updated whenever a new package is added.

## Frontend (`frontend/`)

| Package | Version | Purpose |
|---|---|---|
| `next` | `^15.5.18` | App Router, React 19, server actions, Turbopack |
| `react` / `react-dom` | `19.2.4` | UI runtime |
| `typescript` | `^5` | Type safety |
| `tailwindcss` | `^4` | Utility-first styling |
| `@apollo/client` | `^4.2.0` | GraphQL client with subscription support |
| `graphql` | `^16.14.0` | Reference implementation |
| `graphql-ws` | `^6.0.8` | WebSocket subscription transport |
| `@graphql-codegen/cli` + `client-preset` | `^7.0.0` / `^6.0.0` | Auto-generated typed React hooks from `.graphql` files |
| `recharts` | `^3.8.1` | Most KPI charts |
| Custom SVG/React components | local | Bed Tetris and license dependency graph; avoids `@visx/*` React 19 peer conflict |
| `react-leaflet` + `leaflet` | `^5.0.0` / `^1.9.4` | Ambulance live map |
| `framer-motion` | `^12.40.0` | Minimal motion (number flip, overlay transitions) |
| `sonner` | `^2.0.7` | Toast notifications |
| `vega` + `vega-lite` + `react-vega` | `^6.2.0` / `^6.4.3` / `^8.0.0` | Concierge inline chart rendering |
| `cmdk` | `^1.1.1` | Cmd+K palette for Concierge |
| `clsx` + `tailwind-merge` | `^2.1.1` / `^3.6.0` | Class utilities |

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
