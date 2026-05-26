# GraphQL Schema Reference

This file is updated whenever Strawberry schema fields change.

## Initial Schema Plan

```graphql
type Query {
  executiveFlash: ExecutiveFlash!
  revenue(window: TimeWindow!, departmentId: ID): RevenueLens!
  beds(facilityId: ID!): [Bed!]!
  doctorScorecard(filter: DoctorFilter): [DoctorScore!]!
  nabhIndicators: [NabhIndicator!]!
  tpaDenialRisk: [DenialClaim!]!
  licenses: [License!]!
  patientFeedback(window: TimeWindow!): FeedbackSummary!
  diagnosticsRoi: [MachineRoi!]!
}

type Mutation {
  acknowledgeAlert(id: ID!): Alert!
  runSimulation(input: SimulationInput!): SimulationResult!
  revertSimulation(snapshotId: ID!): Boolean!
}

type Subscription {
  bedEvents(facilityId: ID!): BedEvent!
  vitalsStream(unit: String!): VitalsTick!
  tpaEvents: TpaEvent!
  alerts(minSeverity: Severity = LOW): Alert!
  stressScore: StressTick!
  ambulancePositions: [AmbulanceTick!]!
}
```

## Rules

- Frontend uses `.graphql` operation files only.
- `graphql-codegen` generates TypeScript operation types and hooks.
- Concierge tools execute only persisted, allowlisted GraphQL operations.
- Dataloaders must be used for resolver paths that fan out across relations.
