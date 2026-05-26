export type Direction = "positive" | "negative" | "neutral";

export type Contribution = {
  metric: string;
  delta: number;
  unit: string;
  direction: Direction;
  confidence: number;
  rationale: string;
};

export type BusinessImpact = {
  action: string;
  summary: string;
  horizon: string;
  payback_months: number | null;
  confidence: number;
  contributions: Contribution[];
  risks: string[];
  source: "openai" | "heuristic";
};

export type Refusal = {
  reason: string;
  suggestions: string[];
};

export type ConciergeEvent =
  | { type: "meta"; snapshot: Record<string, number>; question: string }
  | { type: "action"; action: string; horizon: string; source: string }
  | { type: "token"; text: string }
  | { type: "impact"; impact: BusinessImpact }
  | { type: "refusal"; refusal: Refusal }
  | { type: "done"; status: string; source: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

function parseSseChunk(buffer: string): { events: ConciergeEvent[]; rest: string } {
  const events: ConciergeEvent[] = [];
  const blocks = buffer.split("\n\n");
  const rest = blocks.pop() ?? "";

  for (const block of blocks) {
    if (!block.trim()) continue;
    let eventName = "message";
    let dataRaw = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) eventName = line.slice(6).trim();
      else if (line.startsWith("data:")) dataRaw += line.slice(5).trim();
    }
    if (!dataRaw) continue;
    try {
      const data = JSON.parse(dataRaw) as Record<string, unknown>;
      switch (eventName) {
        case "meta":
          events.push({
            type: "meta",
            snapshot: (data.snapshot as Record<string, number>) ?? {},
            question: String(data.question ?? ""),
          });
          break;
        case "action":
          events.push({
            type: "action",
            action: String(data.action ?? ""),
            horizon: String(data.horizon ?? ""),
            source: String(data.source ?? "heuristic"),
          });
          break;
        case "token":
          events.push({ type: "token", text: String(data.text ?? "") });
          break;
        case "impact":
          events.push({ type: "impact", impact: data as unknown as BusinessImpact });
          break;
        case "refusal":
          events.push({
            type: "refusal",
            refusal: {
              reason: String(data.reason ?? ""),
              suggestions: Array.isArray(data.suggestions)
                ? (data.suggestions as string[])
                : [],
            },
          });
          break;
        case "done":
          events.push({
            type: "done",
            status: String(data.status ?? "complete"),
            source: String(data.source ?? "heuristic"),
          });
          break;
      }
    } catch {
      // Drop malformed events silently.
    }
  }

  return { events, rest };
}

export async function streamConcierge(
  message: string,
  onEvent: (event: ConciergeEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/concierge/stream`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "text/event-stream" },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Concierge request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const { events, rest } = parseSseChunk(buffer);
    buffer = rest;
    for (const event of events) {
      onEvent(event);
    }
  }

  if (buffer.trim()) {
    const { events } = parseSseChunk(`${buffer}\n\n`);
    for (const event of events) {
      onEvent(event);
    }
  }
}
