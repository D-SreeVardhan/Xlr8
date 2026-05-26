# ADR 0004: Apollo Client over urql

## Context

The frontend needs typed GraphQL queries, mutations, subscriptions, cache updates, and a recognizable enterprise data-client story.

## Decision

Use Apollo Client 3.x over urql.

## Consequences

- Strong ecosystem and documentation.
- Good support for HTTP/WebSocket split links.
- Works well with `graphql-codegen`.
- Slightly heavier than urql, acceptable for a CEO dashboard prototype.
- Name alignment with Apollo Hospitals is a useful narrative coincidence, not the technical reason.
