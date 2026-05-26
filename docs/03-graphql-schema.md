# GraphQL Schema Reference

This file is updated whenever Strawberry schema fields change.

## Current Scaffold Schema

```graphql
scalar DateTime

type FacilityType {
  id: String!
  name: String!
  city: String!
  operationalBeds: Int!
}

type ExecutiveFlashType {
  facilityId: String!
  capturedAt: DateTime!
  revenueCr: Float!
  arpob: Float!
  occupancyPct: Float!
  alosDays: Float!
  operatingEbitdaMarginPct: Float!
  ebitdaPerBedLakh: Float!
  isSimulated: Boolean!
}

type Query {
  health: String!
  facilities: [FacilityType!]!
  executiveFlash(facilityId: String! = "hyd-banjara"): ExecutiveFlashType!
}

type Mutation {
  acknowledgeAlert(id: ID!): Boolean!
}

type Subscription {
  executiveFlashTicks(facilityId: String! = "hyd-banjara"): ExecutiveFlashType!
}
```

## Planned Expansion Fields

- Revenue lens: `revenue(window, departmentId)`
- Operations: `beds`, `orRooms`, `ambulances`, `erQueue`
- Workforce: `doctorScorecard`, `nurseAttritionRisk`
- Quality: `nabhIndicators`, `sentinelEvents`
- TPA: `tpaDenialRisk`, `tpaEvents`
- Simulation: `runSimulation`, `revertSimulation`, `dashboardOverlay`

## Rules

- Frontend uses `.graphql` operation files only.
- `graphql-codegen` generates TypeScript operation types and hooks.
- Concierge tools execute only persisted, allowlisted GraphQL operations.
- Dataloaders must be used for resolver paths that fan out across relations.
