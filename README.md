# Xlr8 — Hospital CEO Command Cockpit

A hackathon prototype: a real-time business-intelligence cockpit for the CEO of a large Indian hospital chain. Live KPIs, predictive alerts, and an OpenAI-powered AI Concierge that can run what-if simulations and mutate the dashboard live.

> Built for the Indian hospital context (Apollo, Fortis, Max, Narayana scale): ARPOB, ALOS, EBITDA per bed, TPA denial risk, NABH 6th-edition compliance, festival/AQI surge forecasting, nurse attrition prediction.

---

## Stack at a glance

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) · TypeScript · Tailwind · Apollo Client 3 · graphql-codegen |
| Backend | FastAPI · Strawberry GraphQL · SQLAlchemy · SQLite · python-asyncio |
| Real-time | GraphQL Subscriptions over `graphql-ws` WebSocket transport |
| AI Concierge | OpenAI `gpt-4o-mini` (escalates to `gpt-4o`) · streamed over SSE · function-calling backed by persisted GraphQL operations |
| ML | XGBoost · scikit-learn · Prophet · IsolationForest · HuggingFace `cardiffnlp/twitter-xlm-roberta-base-sentiment` (pretrained) |
| Charts | Recharts · visx · Vega-Lite (Concierge inline) |
| Maps | Leaflet (Ambulance live positions) |

Full per-package version log: [`docs/01-tech-stack.md`](docs/01-tech-stack.md).

---

## Quick start

See [`docs/10-setup-and-run.md`](docs/10-setup-and-run.md) for the full guide. TL;DR:

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e .
cp .env.example .env   # then paste your OPENAI_API_KEY
python -m data_gen.seed
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run codegen        # generate typed GraphQL hooks
npm run dev            # http://localhost:3000
```

---

## Documentation

All architectural decisions, schemas, and runbooks live under [`docs/`](docs/):

- [`01-tech-stack.md`](docs/01-tech-stack.md) — every dependency, pinned version, rationale
- [`02-architecture.md`](docs/02-architecture.md) — system diagram, data flow
- [`03-graphql-schema.md`](docs/03-graphql-schema.md) — schema reference
- [`04-api-reference.md`](docs/04-api-reference.md) — Concierge SSE endpoint
- [`05-ml-models.md`](docs/05-ml-models.md) — predictive layer details
- [`06-data-model.md`](docs/06-data-model.md) — 18-entity ERD + seed rules
- [`07-design-system.md`](docs/07-design-system.md) — palette, type, anti-generic principles
- [`08-concierge.md`](docs/08-concierge.md) — prompts, tools, guardrails
- [`09-demo-script.md`](docs/09-demo-script.md) — 90-second walkthrough
- [`10-setup-and-run.md`](docs/10-setup-and-run.md) — local dev
- [`adr/`](docs/adr/) — Architecture Decision Records (numbered, append-only)
