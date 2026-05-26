# ADR 0005: SSE for Concierge Streaming

## Context

GraphQL subscriptions are useful for domain events like beds, alerts, ambulances, and stress score. LLM token streaming has different semantics: unidirectional, ordered, and tied to one request.

## Decision

Use Server-Sent Events for `POST /api/concierge/stream`.

## Consequences

- Simpler client implementation for token streams.
- Easier to emit mixed events: token, tool start, tool result, chart, done.
- Keeps GraphQL for business data while using the right protocol for model output.
- Requires one small REST endpoint in an otherwise GraphQL-first system.
