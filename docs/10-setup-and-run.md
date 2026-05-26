# Setup and Run

## Prerequisites

- Node.js 20+
- Python 3.11+
- OpenAI API key

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e .
cp .env.example .env
# paste OPENAI_API_KEY into .env
python -m data_gen.seed
uvicorn main:app --reload --port 8000
```

## Frontend

```bash
cd frontend
npm install
npm run codegen
npm run dev
```

Open `http://localhost:3000`.

## Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- GraphQL: `http://localhost:8000/graphql`

## Environment

`backend/.env`

```bash
OPENAI_API_KEY=sk-...
OPENAI_DEFAULT_MODEL=gpt-4o-mini
OPENAI_REASONING_MODEL=gpt-4o
XL8_SEED=20260526
XL8_OFFLINE_MODE=false
```

Never commit `.env`.
