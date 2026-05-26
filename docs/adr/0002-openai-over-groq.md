# ADR 0002: OpenAI over Groq

## Context

The original plan considered Groq's free tier for Llama 3.3 70B. The user chose OpenAI instead and provided an API key.

## Decision

Use OpenAI as the AI Concierge provider:

- Default model: `gpt-4o-mini`
- Escalation model: `gpt-4o`

## Consequences

- Better function-calling reliability and structured-output behavior for the hackathon demo.
- Slightly higher cost than Groq, but the request volume is tiny.
- The API key must only live in `backend/.env`, never in source control.
- The key pasted in chat should be rotated before final demo use.
