"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Panel } from "@/components/primitives/panel";
import type { BusinessImpact } from "@/lib/concierge-client";

import { AiConcierge } from "./ai-concierge";
import { OperationsCockpit } from "./operations-cockpit";

type WindowKey = "daily" | "weekly" | "monthly" | "yearly";

type Simulation = {
  active: boolean;
  action: string;
  revenueDelta: number;
  waitDelta: number;
  costDelta: number;
  occupancyDelta: number;
};

const departments = [
  { name: "Emergency", revenue: 3.8, occupancy: 86, arpob: 52000, beds: 42, doctors: 18 },
  { name: "ICU", revenue: 4.6, occupancy: 91, arpob: 88000, beds: 64, doctors: 14 },
  { name: "Cardiac", revenue: 5.1, occupancy: 74, arpob: 96000, beds: 72, doctors: 21 },
  { name: "Oncology", revenue: 4.2, occupancy: 69, arpob: 91000, beds: 58, doctors: 16 },
  { name: "Neuro", revenue: 3.4, occupancy: 67, arpob: 81000, beds: 44, doctors: 13 },
  { name: "Ortho", revenue: 3.2, occupancy: 72, arpob: 74000, beds: 52, doctors: 15 },
  { name: "Maternity", revenue: 2.1, occupancy: 63, arpob: 39000, beds: 48, doctors: 12 },
];

const revenueWindows: Record<WindowKey, { label: string; multiplier: number }> = {
  daily: { label: "Daily", multiplier: 1 },
  weekly: { label: "Weekly", multiplier: 7 },
  monthly: { label: "Monthly", multiplier: 30 },
  yearly: { label: "Yearly", multiplier: 365 },
};

const trend = [
  { day: "Mon", revenue: 20.4, occupancy: 68, denials: 12 },
  { day: "Tue", revenue: 22.1, occupancy: 71, denials: 16 },
  { day: "Wed", revenue: 21.8, occupancy: 70, denials: 9 },
  { day: "Thu", revenue: 24.2, occupancy: 76, denials: 18 },
  { day: "Fri", revenue: 23.6, occupancy: 74, denials: 14 },
  { day: "Sat", revenue: 19.2, occupancy: 64, denials: 8 },
  { day: "Sun", revenue: 18.7, occupancy: 62, denials: 11 },
];

const doctors = [
  {
    name: "Dr. Ananya Rao",
    specialty: "Cardiac Sciences",
    score: 94,
    nps: 92,
    revenue: 2.4,
    readmission: 1.8,
    reward: "Platinum",
  },
  {
    name: "Dr. Kabir Menon",
    specialty: "Oncology",
    score: 91,
    nps: 89,
    revenue: 2.1,
    readmission: 2.1,
    reward: "Gold",
  },
  {
    name: "Dr. Farah Siddiqui",
    specialty: "Neuro",
    score: 88,
    nps: 86,
    revenue: 1.7,
    readmission: 2.8,
    reward: "Gold",
  },
  {
    name: "Dr. Raghav Iyer",
    specialty: "Orthopaedics",
    score: 54,
    nps: 61,
    revenue: 1.2,
    readmission: 8.4,
    reward: "Review",
  },
];

const tpaRows = [
  { payer: "Star Health", specialty: "Ortho Implants", amount: "INR 18.4L", risk: 82, sla: "00:41" },
  { payer: "HDFC Ergo", specialty: "Oncology Chemo", amount: "INR 12.1L", risk: 61, sla: "01:18" },
  { payer: "CGHS", specialty: "Cardiac Stent", amount: "INR 9.8L", risk: 74, sla: "02:07" },
  { payer: "Bajaj Allianz", specialty: "ICU Stay", amount: "INR 7.2L", risk: 44, sla: "00:56" },
];

const licenses = [
  { name: "Fire NOC", expiry: "18 days", cost: "INR 4.2L", blast: "OT shutdown risk" },
  { name: "Pharmacy License", expiry: "42 days", cost: "INR 1.1L", blast: "IP admission risk" },
  { name: "AERB Radiology", expiry: "67 days", cost: "INR 2.8L", blast: "CT/MRI halt" },
  { name: "NABH Surveillance", expiry: "91 days", cost: "INR 7.5L", blast: "Accreditation risk" },
];

const assets = [
  { machine: "MRI 3T", available: 2, total: 3, uptime: 82, maintenance: "AMC due in 11d" },
  { machine: "CT 128 Slice", available: 4, total: 4, uptime: 96, maintenance: "Healthy" },
  { machine: "Cath Lab", available: 1, total: 2, uptime: 71, maintenance: "Calibration due" },
  { machine: "LINAC", available: 1, total: 1, uptime: 91, maintenance: "Healthy" },
];

const feedback = [
  { category: "Doctor Communication", score: 4.7 },
  { category: "Nursing Attendance", score: 4.2 },
  { category: "Food", score: 3.6 },
  { category: "Bed Comfort", score: 4.0 },
  { category: "Billing Clarity", score: 3.4 },
];

const inventory = [
  { item: "O negative blood", stock: 18, need: 42, risk: "critical" },
  { item: "Meropenem 1g", stock: 140, need: 180, risk: "watch" },
  { item: "Cardiac stents", stock: 32, need: 28, risk: "healthy" },
  { item: "PPE kits", stock: 2100, need: 1600, risk: "healthy" },
];

const alerts = [
  "TPA discharge SLA breach risk: Star Health Ortho case, 41 min left",
  "ICU nurse ratio below target in Hyderabad night shift",
  "Diwali AQI forecast: respiratory admissions likely +34% in 6 days",
  "Cath Lab uptime below benchmark, calibration due",
];

export function CommandCenter() {
  const [windowKey, setWindowKey] = useState<WindowKey>("daily");
  const [tick, setTick] = useState(0);
  const [simulation, setSimulation] = useState<Simulation>({
    active: false,
    action: "",
    revenueDelta: 0,
    waitDelta: 0,
    costDelta: 0,
    occupancyDelta: 0,
  });
  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 2500);
    const alertTimer = window.setInterval(() => {
      toast.warning(alerts[Math.floor(Math.random() * alerts.length)]);
    }, 9000);

    return () => {
      window.clearInterval(timer);
      window.clearInterval(alertTimer);
    };
  }, []);

  const pulse = Math.sin(tick / 2) * 0.7;
  const revenueMultiplier = revenueWindows[windowKey].multiplier;
  const totalDailyRevenue = departments.reduce((sum, department) => sum + department.revenue, 0);
  const simulatedRevenue = totalDailyRevenue * (1 + simulation.revenueDelta / 100);
  const stressScore = Math.round(72 + tick * 1.3 + (simulation.active ? 8 : 0)) % 100;

  const departmentRevenue = useMemo(
    () =>
      departments.map((department) => ({
        name: department.name,
        revenue: Number((department.revenue * revenueMultiplier).toFixed(1)),
      })),
    [revenueMultiplier],
  );

  function applyImpact(impact: BusinessImpact) {
    const findDelta = (needles: string[]): number => {
      const c = impact.contributions.find((row) =>
        needles.some((needle) => row.metric.toLowerCase().includes(needle)),
      );
      return c ? c.delta : 0;
    };

    setSimulation({
      active: true,
      action: impact.action,
      revenueDelta: findDelta(["revenue"]),
      waitDelta: findDelta(["er wait", "wait"]),
      costDelta: findDelta(["operating cost", "cost", "capex"]),
      occupancyDelta: findDelta(["occupancy"]),
    });
    toast.success(`Impact projected: ${impact.action}`);
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-6">
      {simulation.active && (
        <div className="mb-4 border border-accent bg-accent/10 p-3 font-mono text-xs text-accent">
          SIMULATION ACTIVE: {simulation.action}
          <button
            className="ml-4 border border-accent px-2 py-1 text-[10px] uppercase tracking-[0.2em]"
            onClick={() =>
              setSimulation({
                active: false,
                action: "",
                revenueDelta: 0,
                waitDelta: 0,
                costDelta: 0,
                occupancyDelta: 0,
              })
            }
          >
            Revert
          </button>
        </div>
      )}

      <section className="border border-hairline bg-surface p-5">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
              CEO Live Command
            </p>
            <h1 className="mt-3 max-w-5xl font-serif text-5xl leading-none tracking-tight md:text-7xl">
              Indian Hospital Intelligence Cockpit
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs text-muted md:grid-cols-4">
            <Badge label="Facilities" value="4" />
            <Badge label="Beds" value="1,404" />
            <Badge label="Live Alerts" value={String(12 + (tick % 5))} tone="warn" />
            <Badge label="Stress" value={`${stressScore}/100`} tone={stressScore > 80 ? "crit" : "ok"} />
          </div>
        </div>

        <div className="mt-6 grid gap-px bg-hairline md:grid-cols-3 xl:grid-cols-6">
          <Metric label="Revenue" value={`INR ${simulatedRevenue.toFixed(1)} Cr`} sub="+8.4% vs plan" />
          <Metric label="ARPOB" value={`INR ${(60588 + pulse * 440).toFixed(0)}`} sub="Apollo benchmark" />
          <Metric label="Occupancy" value={`${(70.2 + simulation.occupancyDelta + pulse).toFixed(1)}%`} sub="Target 68-78%" />
          <Metric label="ALOS" value="3.8 days" sub="throughput stable" />
          <Metric label="EBITDA margin" value={`${(22.4 + simulation.revenueDelta / 4).toFixed(1)}%`} sub="ICRA band 22-24%" />
          <Metric label="EBITDA / bed" value="INR 64.2L" sub="annualized" />
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <Panel title="Revenue Command" kicker="daily weekly monthly yearly departmentwise">
          <div className="mb-4 flex flex-wrap gap-2">
            {(Object.keys(revenueWindows) as WindowKey[]).map((key) => (
              <button
                key={key}
                className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  key === windowKey
                    ? "border-accent bg-accent text-background"
                    : "border-hairline text-muted"
                }`}
                onClick={() => setWindowKey(key)}
              >
                {revenueWindows[key].label}
              </button>
            ))}
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={departmentRevenue}>
                <CartesianGrid stroke="rgba(245,241,232,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#8A8275" tick={{ fontSize: 10 }} />
                <YAxis stroke="#8A8275" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#14161A", border: "1px solid #2a2d33" }} />
                <Bar dataKey="revenue" fill="#E04E2C" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="TPA Denial War Room" kicker="cashless approval denial revenue leakage">
          <div className="space-y-3">
            {tpaRows.map((row) => (
              <div key={`${row.payer}-${row.specialty}`} className="border border-hairline bg-background p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{row.payer}</p>
                    <p className="text-xs text-muted">{row.specialty}</p>
                  </div>
                  <p className="font-mono text-xs text-accent">{row.sla}</p>
                </div>
                <div className="mt-3 h-1.5 bg-surface-raised">
                  <div className="h-full bg-accent" style={{ width: `${row.risk}%` }} />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[11px] text-muted">
                  <span>{row.amount} at risk</span>
                  <span>{row.risk}% denial risk</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-4">
        <OperationsCockpit />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Panel title="Availability by Department" kicker="beds doctors nurses meds blood">
          <div className="space-y-2">
            {departments.slice(0, 6).map((department) => (
              <div key={department.name} className="grid grid-cols-[1fr_auto] gap-3 border-b border-hairline py-2">
                <div>
                  <p className="text-sm">{department.name}</p>
                  <p className="text-xs text-muted">
                    {department.beds} beds | {department.doctors} doctors | {Math.round(department.beds * 1.8)} nurses
                  </p>
                </div>
                <p className="font-mono text-xs text-accent">{department.occupancy}%</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Critical Alerts" kicker="composite stress not alarm spam">
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={alert} className="border-l-2 border-accent bg-background p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Severity {index === 0 ? "critical" : "watch"}
                </p>
                <p className="mt-2 text-sm leading-5">{alert}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
        <Panel title="Doctor Performance and Rewards" kicker="quality weighted scorecard">
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="grid grid-cols-[1fr_auto] gap-4 border border-hairline bg-background p-3">
                <div>
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-xs text-muted">
                    {doctor.specialty} | NPS {doctor.nps} | Readmission {doctor.readmission}%
                  </p>
                </div>
                <div className="text-right">
                  <p className={doctor.score < 60 ? "font-serif text-2xl text-crit" : "font-serif text-2xl text-ok"}>
                    {doctor.score}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{doctor.reward}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Patient Voice and Popularity" kicker="food beds staff attendance billing">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={feedback} dataKey="score" nameKey="category" innerRadius={62} outerRadius={94}>
                  {feedback.map((entry, index) => (
                    <Cell key={entry.category} fill={["#E04E2C", "#D4A04A", "#7C8C5F", "#8A8275", "#B23A2C"][index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#14161A", border: "1px solid #2a2d33" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted">
            {feedback.map((item) => (
              <span key={item.category}>{item.category}: {item.score}/5</span>
            ))}
          </div>
        </Panel>

        <Panel title="Diagnostics, Stock and Licenses" kicker="machines meds blood expiry cost">
          <div className="space-y-4">
            <SubList title="Machine Availability" rows={assets.map((asset) => `${asset.machine}: ${asset.available}/${asset.total}, uptime ${asset.uptime}%`)} />
            <SubList title="Stock Risk" rows={inventory.map((item) => `${item.item}: ${item.stock}/${item.need} (${item.risk})`)} />
            <SubList title="License Cascade" rows={licenses.map((license) => `${license.name}: ${license.expiry}, ${license.blast}`)} />
          </div>
        </Panel>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Panel title="Revenue, Occupancy and Denials Trend" kicker="descriptive analytics root cause">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid stroke="rgba(245,241,232,0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="#8A8275" tick={{ fontSize: 10 }} />
                <YAxis stroke="#8A8275" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#14161A", border: "1px solid #2a2d33" }} />
                <Line type="monotone" dataKey="revenue" stroke="#E04E2C" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="occupancy" stroke="#7C8C5F" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="denials" stroke="#D4A04A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <AiConcierge onImpact={applyImpact} />
      </section>
    </main>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <article className="bg-background p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className="mt-3 font-serif text-3xl leading-none">{value}</p>
      <p className="mt-3 text-xs text-muted">{sub}</p>
    </article>
  );
}

function Badge({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "ok" | "warn" | "crit" }) {
  const toneClass = {
    muted: "text-muted",
    ok: "text-ok",
    warn: "text-warn",
    crit: "text-crit",
  }[tone];

  return (
    <div className="border border-hairline bg-background p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className={`mt-1 text-lg ${toneClass}`}>{value}</p>
    </div>
  );
}

function SubList({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{title}</p>
      <div className="mt-2 space-y-1">
        {rows.map((row) => (
          <p key={row} className="border-b border-hairline pb-1 text-xs text-muted">
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}
