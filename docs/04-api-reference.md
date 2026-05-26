# API Reference

GraphQL is the primary API. REST is used only where it is a better protocol fit.

## GraphQL

- Endpoint: `GET/POST /graphql`
- WebSocket subscriptions: `/graphql` using `graphql-ws`
- Local IDE: GraphiQL enabled in development

See [`03-graphql-schema.md`](03-graphql-schema.md).

## Concierge SSE

`POST /api/concierge/stream`

Streams OpenAI-generated tokens and tool traces as Server-Sent Events.

### Request

```json
{
  "message": "Add 10 ICU beds at Banjara Hills",
  "dashboardState": {
    "facilityId": "hyd-banjara-hills",
    "activeFilters": {}
  }
}
```

### Event Types

| Event | Payload |
|---|---|
| `token` | `{ \"text\": \"...\" }` |
| `tool_start` | `{ \"name\": \"simulate_action\", \"arguments\": {...} }` |
| `tool_result` | `{ \"name\": \"simulate_action\", \"result\": {...} }` |
| `chart` | Vega-Lite JSON spec |
| `error` | `{ \"message\": \"...\" }` |
| `done` | `{ \"conversationId\": \"...\" }` |

## Environment

Backend reads `OPENAI_API_KEY` from `backend/.env`. The `.env` file is never committed.
