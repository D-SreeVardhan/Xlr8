# ADR 0003: Strawberry over Graphene

## Context

The backend is Python/FastAPI and needs a clean GraphQL implementation with async subscriptions, type hints, and readable resolver code.

## Decision

Use `strawberry-graphql[fastapi]` instead of Graphene.

## Consequences

- Type-first Python decorators make schema code easier to maintain.
- Better FastAPI integration.
- Async subscription support fits the real-time cockpit.
- Slightly younger ecosystem than Graphene, but better developer experience for this prototype.
