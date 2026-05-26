# Design System

Goal: a distinctive CEO command cockpit, not a generic blue healthcare SaaS dashboard.

## Visual Direction

Clinical Command Center meets Bloomberg Terminal and Indian business press.

## Palette

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0B0D` | Page background |
| `--surface` | `#14161A` | Tile surfaces |
| `--ink` | `#F5F1E8` | Primary text |
| `--muted` | `#8A8275` | Secondary text |
| `--accent` | `#E04E2C` | Vermilion accent |
| `--ok` | `#7C8C5F` | Healthy/sage |
| `--warn` | `#D4A04A` | Warning/ochre |
| `--crit` | `#B23A2C` | Critical/terracotta |

## Typography

- Fraunces: headline KPIs.
- Inter: body.
- JetBrains Mono: timestamps, IDs, tool traces.

## Layout

- 12-column dense grid.
- Hairline dividers instead of heavy cards.
- No pastel card soup.
- No generic electric-blue gradients.
- No glassmorphism.
- No decorative animation.

## Motion

- Number flip on metric updates.
- Slide-over for Concierge.
- Full-screen alert only for severe stress score.

## Components

- `Tile`
- `StatCard`
- `Sparkline`
- `SeverityPill`
- `SimulationBadge`
- `ToolTrace`
- `CommandPanel`
