"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import { formatCurrency, formatCurrencyCr, formatPercent } from "@/lib/formatters";

const EXECUTIVE_FLASH_QUERY = gql`
  query ExecutiveFlash($facilityId: String!) {
    executiveFlash(facilityId: $facilityId) {
      facilityId
      capturedAt
      revenueCr
      arpob
      occupancyPct
      alosDays
      operatingEbitdaMarginPct
      ebitdaPerBedLakh
      isSimulated
    }
  }
`;

type ExecutiveFlashData = {
  executiveFlash: {
    facilityId: string;
    capturedAt: string;
    revenueCr: number;
    arpob: number;
    occupancyPct: number;
    alosDays: number;
    operatingEbitdaMarginPct: number;
    ebitdaPerBedLakh: number;
    isSimulated: boolean;
  };
};

export function ExecutiveFlash() {
  const { data, loading, error } = useQuery<ExecutiveFlashData>(EXECUTIVE_FLASH_QUERY, {
    variables: { facilityId: "hyd-banjara" },
    pollInterval: 5000,
  });

  if (loading) {
    return <FlashShell eyebrow="Loading live command cockpit" />;
  }

  if (error || !data) {
    return (
      <FlashShell
        eyebrow="Backend not connected"
        message="Start FastAPI on port 8000, seed the database, then refresh."
      />
    );
  }

  const flash = data.executiveFlash;
  const metrics = [
    { label: "Revenue Today", value: formatCurrencyCr(flash.revenueCr), delta: "+8.4% vs plan" },
    { label: "ARPOB", value: formatCurrency(flash.arpob), delta: "Apollo-grade benchmark" },
    { label: "Occupancy", value: formatPercent(flash.occupancyPct), delta: "Target band 68-78%" },
    { label: "ALOS", value: `${flash.alosDays.toFixed(1)} days`, delta: "Lower is throughput" },
    {
      label: "EBITDA Margin",
      value: formatPercent(flash.operatingEbitdaMarginPct),
      delta: "ICRA range 22-24%",
    },
    {
      label: "EBITDA / Bed",
      value: `₹${flash.ebitdaPerBedLakh.toFixed(1)}L`,
      delta: "Annualized lens",
    },
  ];

  return (
    <section className="rounded-none border border-hairline bg-surface p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            Executive Flash
          </p>
          <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-none tracking-tight text-foreground md:text-6xl">
            Xlr8 Hospital Command Cockpit
          </h1>
        </div>
        <div className="text-right font-mono text-xs text-muted">
          <div>HYD / BANJARA</div>
          <div>{new Date(flash.capturedAt).toLocaleString("en-IN")}</div>
        </div>
      </div>
      <div className="grid gap-px bg-hairline md:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => (
          <article key={metric.label} className="bg-background p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
              {metric.label}
            </p>
            <p className="mt-3 font-serif text-3xl leading-none text-foreground">
              {metric.value}
            </p>
            <p className="mt-3 text-xs text-muted">{metric.delta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FlashShell({ eyebrow, message }: { eyebrow: string; message?: string }) {
  return (
    <section className="border border-hairline bg-surface p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        {eyebrow}
      </p>
      <p className="mt-3 text-sm text-muted">
        {message ?? "Preparing the CEO cockpit data surface."}
      </p>
    </section>
  );
}
