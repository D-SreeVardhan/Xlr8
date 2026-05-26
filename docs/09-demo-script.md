# Demo Script

Target duration: 90 seconds.

## Flow

1. Open cockpit. Show live numbers moving: revenue, ARPOB, occupancy, ALOS, EBITDA margin.
2. Highlight Indian-specific metrics: TPA denial risk, NABH compliance, nurse attrition, festival/AQI surge.
3. Trigger or wait for a critical alert: ICU stress score, TPA discharge SLA breach, or diagnostic machine downtime.
4. Drill into TPA Denials: show heatmap by TPA and specialty, risky claims, and documentation gaps.
5. Open Concierge with `Cmd+K`.
6. Ask: `Why did Bengaluru ARPOB drop this week?`
7. Show cited answer with chart and raw evidence.
8. Ask: `Add 10 ICU beds at Banjara Hills.`
9. Show dashboard simulation overlay:
   - Revenue increases
   - Emergency wait time decreases
   - Operating cost increases
   - Nurse requirement increases
   - Payback period appears
10. Click Revert.
11. End on the Differentiators:
   - GraphQL real-time cockpit
   - Indian TPA denial SLA intelligence
   - Nurse attrition prediction
   - Festival/AQI surge forecast
   - What-if AI Concierge

## Backup Path

If OpenAI key/network fails:

- Use pre-scripted `offline_mode=true`.
- Concierge returns deterministic mocked tool results.
- Dashboard still demonstrates simulation overlay locally.
