# ADR 0006: SQLite for Prototype

## Context

The company does not exist yet, and the hackathon prototype uses synthetic data. We need fast setup, deterministic seeding, and no external database dependency.

## Decision

Use SQLite for the prototype store.

## Consequences

- One-file database, easy to regenerate.
- No Docker/database setup required for judges.
- SQLAlchemy keeps the path open to PostgreSQL later.
- Not suitable for production concurrency, but sufficient for a local demo with simulated live ticks.
