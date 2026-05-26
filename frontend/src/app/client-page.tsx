"use client";

import dynamic from "next/dynamic";

const CommandCenter = dynamic(
  () => import("@/components/cockpit/command-center").then((mod) => mod.CommandCenter),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen bg-background p-6 text-foreground">
        <section className="border border-hairline bg-surface p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            Loading CEO Cockpit
          </p>
          <h1 className="mt-3 font-serif text-5xl">Xlr8 Hospital Command</h1>
        </section>
      </main>
    ),
  },
);

export function ClientPage() {
  return <CommandCenter />;
}
