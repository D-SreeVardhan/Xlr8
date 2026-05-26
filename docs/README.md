# Xlr8 Documentation Index

This folder is the single source of truth for the project. It is updated **in the same commit** as the code change it describes — no after-the-fact docs.

## Reading order for a new contributor

1. [`10-setup-and-run.md`](10-setup-and-run.md) — get it running locally
2. [`02-architecture.md`](02-architecture.md) — what the system is, end to end
3. [`06-data-model.md`](06-data-model.md) — what is in the database
4. [`03-graphql-schema.md`](03-graphql-schema.md) — what you can query
5. [`07-design-system.md`](07-design-system.md) — how the UI is built and what to avoid
6. [`08-concierge.md`](08-concierge.md) — the AI agent's design
7. [`05-ml-models.md`](05-ml-models.md) — the predictive layer

## Reference

- [`01-tech-stack.md`](01-tech-stack.md) — every dependency
- [`04-api-reference.md`](04-api-reference.md) — REST/SSE surface (Concierge)
- [`09-demo-script.md`](09-demo-script.md) — judging walkthrough

## Architecture Decision Records

Append-only, numbered. Lightweight: Context, Decision, Consequences.

- [`adr/0001-graphql-over-rest.md`](adr/0001-graphql-over-rest.md)
- [`adr/0002-openai-over-groq.md`](adr/0002-openai-over-groq.md)
- [`adr/0003-strawberry-over-graphene.md`](adr/0003-strawberry-over-graphene.md)
- [`adr/0004-apollo-client-over-urql.md`](adr/0004-apollo-client-over-urql.md)
- [`adr/0005-sse-for-concierge-stream.md`](adr/0005-sse-for-concierge-stream.md)
- [`adr/0006-sqlite-for-prototype.md`](adr/0006-sqlite-for-prototype.md)

## Update discipline

When you add code, you must also update one or more of:

| You changed... | You update... |
|---|---|
| Added an npm/pip dependency | [`01-tech-stack.md`](01-tech-stack.md) |
| Added/changed a GraphQL type, query, mutation, or subscription | [`03-graphql-schema.md`](03-graphql-schema.md) |
| Added/changed a REST/SSE endpoint | [`04-api-reference.md`](04-api-reference.md) |
| Added/changed an ML model or its features | [`05-ml-models.md`](05-ml-models.md) |
| Added/changed an entity, column, or seed rule | [`06-data-model.md`](06-data-model.md) |
| Made a non-trivial architectural fork | new ADR in [`adr/`](adr/) |
