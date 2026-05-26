"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Panel } from "@/components/primitives/panel";
import {
  type BusinessImpact,
  type Contribution,
  streamConcierge,
} from "@/lib/concierge-client";

type Status = "idle" | "streaming" | "error";

const SUGGESTIONS = [
  "What if we add 12 ICU beds at Banjara Hills?",
  "Should we raise cardiac surgery package by 6%?",
  "What contributions would a NABH re-accreditation push make?",
  "Launch a tier-2 referral alliance with 8 secondary hospitals.",
  "Hire 24 ICU nurses to cut agency dependency.",
];

type Props = {
  onImpact?: (impact: BusinessImpact) => void;
};

export function AiConcierge({ onImpact }: Props) {
  const [message, setMessage] = useState<string>(SUGGESTIONS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [streamedText, setStreamedText] = useState<string>("");
  const [impact, setImpact] = useState<BusinessImpact | null>(null);
  const [actionTag, setActionTag] = useState<{ action: string; source: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const run = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || status === "streaming") return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus("streaming");
      setStreamedText("");
      setImpact(null);
      setActionTag(null);
      setError(null);

      try {
        await streamConcierge(
          prompt,
          (event) => {
            switch (event.type) {
              case "action":
                setActionTag({ action: event.action, source: event.source });
                break;
              case "token":
                setStreamedText((prev) => prev + event.text);
                break;
              case "impact":
                setImpact(event.impact);
                onImpact?.(event.impact);
                break;
              case "done":
                toast.success(`Concierge: ${event.source === "openai" ? "AI analysis" : "Heuristic projection"} ready`);
                break;
            }
          },
          controller.signal,
        );
        setStatus("idle");
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setStatus("idle");
          return;
        }
        setError((err as Error).message);
        setStatus("error");
      }
    },
    [onImpact, status],
  );

  return (
    <Panel title="AI Concierge" kicker="ask anything · grounded business impact">
      <div className="space-y-4">
        <div className="border border-hairline bg-background p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">CEO asks</p>
          <textarea
            className="mt-3 min-h-24 w-full resize-none border border-hairline bg-surface p-3 text-sm outline-none focus:border-accent"
            value={message}
            placeholder="Ask anything about the business..."
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void run(message);
              }
            }}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setMessage(suggestion)}
                className="border border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:border-accent hover:text-accent"
              >
                {suggestion.length > 42 ? `${suggestion.slice(0, 40)}…` : suggestion}
              </button>
            ))}
          </div>
          <button
            disabled={status === "streaming"}
            className="mt-3 w-full bg-accent px-4 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-background disabled:opacity-40"
            onClick={() => void run(message)}
          >
            {status === "streaming" ? "Projecting impact…" : "Project Business Impact"}
          </button>
          {error && (
            <p className="mt-2 font-mono text-[11px] text-crit">⚠ {error}</p>
          )}
        </div>

        {(actionTag || streamedText || status === "streaming") && (
          <div className="border border-hairline bg-background p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Concierge response
              </p>
              {actionTag && (
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  source · {actionTag.source}
                </span>
              )}
            </div>
            {actionTag && (
              <p className="mt-3 font-serif text-xl leading-tight">{actionTag.action}</p>
            )}
            <p className="mt-3 text-sm leading-6 text-foreground/90">
              {streamedText}
              {status === "streaming" && (
                <span className="ml-1 inline-block h-3 w-2 animate-pulse bg-accent align-middle" />
              )}
            </p>
          </div>
        )}

        {impact && (
          <>
            <ContributionGrid contributions={impact.contributions} />
            <div className="grid gap-3 md:grid-cols-3">
              <SummaryStat label="Horizon" value={impact.horizon} />
              <SummaryStat
                label="Payback"
                value={impact.payback_months != null ? `${impact.payback_months} months` : "—"}
              />
              <SummaryStat label="Overall confidence" value={`${impact.confidence}/100`} />
            </div>
            {impact.risks.length > 0 && (
              <div className="border border-hairline bg-background p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  Execution risks
                </p>
                <ul className="mt-3 space-y-2">
                  {impact.risks.map((risk) => (
                    <li
                      key={risk}
                      className="border-l-2 border-warn pl-3 text-sm leading-5 text-foreground/85"
                    >
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Panel>
  );
}

function ContributionGrid({ contributions }: { contributions: Contribution[] }) {
  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {contributions.map((c) => (
        <ContributionCard key={`${c.metric}-${c.delta}`} contribution={c} />
      ))}
    </div>
  );
}

function ContributionCard({ contribution }: { contribution: Contribution }) {
  const sign = contribution.delta > 0 ? "+" : "";
  const tone =
    contribution.direction === "positive"
      ? "text-ok"
      : contribution.direction === "negative"
        ? "text-crit"
        : "text-muted";
  const barTone =
    contribution.direction === "positive"
      ? "bg-ok"
      : contribution.direction === "negative"
        ? "bg-crit"
        : "bg-muted";

  return (
    <div className="border border-hairline bg-background p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {contribution.metric}
        </p>
        <p className={`font-serif text-2xl leading-none ${tone}`}>
          {sign}
          {formatDelta(contribution.delta)} <span className="text-xs text-muted">{contribution.unit}</span>
        </p>
      </div>
      <div className="mt-3 h-1 w-full bg-surface">
        <div className={`h-full ${barTone}`} style={{ width: `${contribution.confidence}%` }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
        <span>{contribution.direction}</span>
        <span>{contribution.confidence}% conf</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-foreground/80">{contribution.rationale}</p>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-hairline bg-background p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-xl">{value}</p>
    </div>
  );
}

function formatDelta(delta: number): string {
  const abs = Math.abs(delta);
  if (abs >= 100) return delta.toFixed(0);
  if (abs >= 10) return delta.toFixed(1);
  return delta.toFixed(2);
}
