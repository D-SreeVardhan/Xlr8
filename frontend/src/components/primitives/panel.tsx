import type { ReactNode } from "react";

export function Panel({
  title,
  kicker,
  children,
  className,
}: {
  title: string;
  kicker: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`border border-hairline bg-surface p-5 ${className ?? ""}`.trim()}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
        {kicker}
      </p>
      <h2 className="mt-2 font-serif text-3xl leading-none">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-hairline bg-background p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl">{value}</p>
    </div>
  );
}
