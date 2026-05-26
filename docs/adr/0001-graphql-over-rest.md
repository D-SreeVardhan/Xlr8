# ADR 0001: GraphQL over REST

## Context

The dashboard needs many role-specific views that share overlapping data: revenue, beds, TPA claims, doctors, machines, alerts, and simulations. Real-time updates also need typed subscriptions.

Apollo Hospitals' public Microsoft Fabric case study mentions replacing complex stored procedures with GraphQL APIs during their analytics modernization, which aligns with this prototype's narrative.

## Decision

Use GraphQL as the primary API for queries, mutations, and subscriptions.

## Consequences

- Frontend can request exactly the fields each tile needs.
- GraphQL subscriptions provide a single real-time model.
- Concierge tools can call the same persisted operations as the UI, avoiding duplicate backend logic.
- Schema design needs discipline; `graphql-codegen` is mandatory for frontend type safety.
