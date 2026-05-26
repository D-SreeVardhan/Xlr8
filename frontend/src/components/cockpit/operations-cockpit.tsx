"use client";

import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { Panel } from "@/components/primitives/panel";

const AmbulanceMap = dynamic(() => import("./ambulance-map").then((m) => m.AmbulanceMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center border border-hairline bg-background text-xs text-muted">
      Loading live ambulance map
    </div>
  ),
});

type WardStatus = "free" | "stable" | "busy" | "crit";

type Ward = {
  id: string;
  name: string;
  totalBeds: number;
  beds: WardStatus[];
  spark: number[];
};

type ORBlock = {
  id: string;
  surgeon: string;
  procedure: string;
  startMin: number;
  durationMin: number;
};

type ORRoom = {
  id: string;
  name: string;
  blocks: ORBlock[];
};

type ESI = 1 | 2 | 3 | 4 | 5;

type ERStage = "Triage" | "Doctor" | "Imaging" | "Disposition";

type ERPatient = {
  id: string;
  name: string;
  age: number;
  complaint: string;
  esi: ESI;
  waitMin: number;
  stage: ERStage;
};

export type AmbulanceStatus = "idle" | "enroute" | "onsite" | "returning";

export type Ambulance = {
  id: string;
  callSign: string;
  lat: number;
  lng: number;
  status: AmbulanceStatus;
  etaMin: number;
  heading: number;
};

const HOSPITAL_CENTER: [number, number] = [17.4145, 78.448];

const WARD_LAYOUT: Array<{ id: string; name: string; total: number }> = [
  { id: "icu-a", name: "ICU A", total: 18 },
  { id: "icu-b", name: "ICU B", total: 14 },
  { id: "hdu", name: "HDU", total: 16 },
  { id: "cardiac", name: "Cardiac Ward", total: 24 },
  { id: "neuro", name: "Neuro Ward", total: 20 },
  { id: "ortho", name: "Ortho Ward", total: 22 },
  { id: "maternity", name: "Maternity", total: 18 },
];

const SURGEON_POOL = [
  { surgeon: "Dr. Ananya Rao", procedure: "Cardiac Bypass" },
  { surgeon: "Dr. Kabir Menon", procedure: "Onco Resection" },
  { surgeon: "Dr. Farah Siddiqui", procedure: "Spine Decompression" },
  { surgeon: "Dr. Raghav Iyer", procedure: "Hip Replacement" },
  { surgeon: "Dr. Meera Pillai", procedure: "Lap Cholecystectomy" },
  { surgeon: "Dr. Vikram Shetty", procedure: "Coronary Angioplasty" },
  { surgeon: "Dr. Nadia Khan", procedure: "Knee Arthroscopy" },
];

const ER_NAME_POOL = [
  "Aarav S.",
  "Diya R.",
  "Ishaan M.",
  "Kavya P.",
  "Rohan K.",
  "Saanvi G.",
  "Vihaan T.",
  "Aanya J.",
  "Reyansh N.",
  "Zara A.",
  "Krish B.",
  "Mira H.",
];

const ER_COMPLAINTS: Array<{ text: string; esi: ESI }> = [
  { text: "Chest pain, 55M, diaphoresis", esi: 1 },
  { text: "RTA polytrauma, GCS 13", esi: 1 },
  { text: "Acute abdomen, ?appendicitis", esi: 2 },
  { text: "Stroke alert, left hemiparesis", esi: 1 },
  { text: "Asthma exacerbation, SpO2 88%", esi: 2 },
  { text: "Febrile illness, dengue suspect", esi: 3 },
  { text: "Laceration, forearm, 8cm", esi: 4 },
  { text: "Vertigo, post-viral", esi: 4 },
  { text: "URTI, dehydration mild", esi: 5 },
  { text: "Postpartum bleed, stable", esi: 2 },
];

const AMBULANCE_SEED: Ambulance[] = [
  { id: "amb-01", callSign: "AMB-01", lat: 17.434, lng: 78.418, status: "enroute", etaMin: 12, heading: 110 },
  { id: "amb-02", callSign: "AMB-02", lat: 17.402, lng: 78.49, status: "returning", etaMin: 6, heading: 290 },
  { id: "amb-03", callSign: "AMB-03", lat: 17.45, lng: 78.46, status: "onsite", etaMin: 0, heading: 0 },
  { id: "amb-04", callSign: "AMB-04", lat: 17.39, lng: 78.43, status: "enroute", etaMin: 18, heading: 50 },
  { id: "amb-05", callSign: "AMB-05", lat: 17.418, lng: 78.402, status: "idle", etaMin: 0, heading: 0 },
  { id: "amb-06", callSign: "AMB-06", lat: 17.428, lng: 78.5, status: "returning", etaMin: 9, heading: 250 },
];

function seedWards(): Ward[] {
  return WARD_LAYOUT.map((ward) => {
    const beds: WardStatus[] = Array.from({ length: ward.total }, (_, index) => {
      const r = (index * 7 + ward.total) % 11;
      return r === 0 ? "crit" : r < 4 ? "busy" : r < 8 ? "stable" : "free";
    });
    const occupancyPct = Math.round((beds.filter((b) => b !== "free").length / ward.total) * 100);
    return {
      id: ward.id,
      name: ward.name,
      totalBeds: ward.total,
      beds,
      spark: Array.from({ length: 24 }, (_, i) => occupancyPct + Math.sin(i / 2) * 6),
    };
  });
}

function seedORs(): ORRoom[] {
  // Day window: 8:00 (480) to 18:00 (1080)
  const rooms = ["OT-1", "OT-2", "OT-3", "OT-4", "OT-5"];
  return rooms.map((name, idx) => {
    let cursor = 480 + idx * 25;
    const blocks: ORBlock[] = [];
    let n = 0;
    while (cursor < 1020 && n < 5) {
      const choice = SURGEON_POOL[(idx + n) % SURGEON_POOL.length];
      const duration = 80 + ((idx + n) % 4) * 35;
      blocks.push({
        id: `${name}-${n}`,
        surgeon: choice.surgeon,
        procedure: choice.procedure,
        startMin: cursor,
        durationMin: duration,
      });
      cursor += duration + 15;
      n += 1;
    }
    return { id: name.toLowerCase(), name, blocks };
  });
}

function seedER(): ERPatient[] {
  return Array.from({ length: 9 }, (_, idx) => {
    const complaint = ER_COMPLAINTS[idx % ER_COMPLAINTS.length];
    const stages: ERStage[] = ["Triage", "Doctor", "Imaging", "Disposition"];
    return {
      id: `er-${idx}`,
      name: ER_NAME_POOL[idx % ER_NAME_POOL.length],
      age: 18 + ((idx * 7) % 60),
      complaint: complaint.text,
      esi: complaint.esi,
      waitMin: 3 + (idx % 4) * 5,
      stage: stages[idx % stages.length],
    };
  });
}

function mutateWards(prev: Ward[]): Ward[] {
  return prev.map((ward) => {
    const beds = ward.beds.slice();
    // Two random bed flips per tick to keep things lively.
    for (let i = 0; i < 2; i += 1) {
      const idx = Math.floor(Math.random() * beds.length);
      const roll = Math.random();
      beds[idx] = roll < 0.07 ? "crit" : roll < 0.45 ? "busy" : roll < 0.85 ? "stable" : "free";
    }
    const occupancyPct = Math.round((beds.filter((b) => b !== "free").length / ward.totalBeds) * 100);
    const nextSpark = ward.spark.slice(-23).concat(occupancyPct);
    return { ...ward, beds, spark: nextSpark };
  });
}

function mutateER(prev: ERPatient[]): ERPatient[] {
  const stages: ERStage[] = ["Triage", "Doctor", "Imaging", "Disposition"];
  const next = prev
    .map((patient) => {
      const advance = Math.random() < 0.18;
      const stageIndex = stages.indexOf(patient.stage);
      const nextStage = advance && stageIndex < stages.length - 1 ? stages[stageIndex + 1] : patient.stage;
      return { ...patient, waitMin: patient.waitMin + 1, stage: nextStage };
    })
    .filter((patient) => !(patient.stage === "Disposition" && Math.random() < 0.25));

  if (Math.random() < 0.55 && next.length < 14) {
    const complaint = ER_COMPLAINTS[Math.floor(Math.random() * ER_COMPLAINTS.length)];
    next.unshift({
      id: `er-${Date.now()}`,
      name: ER_NAME_POOL[Math.floor(Math.random() * ER_NAME_POOL.length)],
      age: 12 + Math.floor(Math.random() * 70),
      complaint: complaint.text,
      esi: complaint.esi,
      waitMin: 0,
      stage: "Triage",
    });
  }

  return next.slice(0, 14);
}

function mutateAmbulances(prev: Ambulance[]): Ambulance[] {
  return prev.map((ambulance) => {
    let { status, etaMin, heading } = ambulance;
    let { lat, lng } = ambulance;

    if (status === "idle" && Math.random() < 0.18) {
      status = "enroute";
      etaMin = 8 + Math.floor(Math.random() * 16);
      heading = Math.random() * 360;
    } else if (status === "enroute") {
      etaMin = Math.max(0, etaMin - 1);
      if (etaMin === 0) status = "onsite";
    } else if (status === "onsite" && Math.random() < 0.35) {
      status = "returning";
      etaMin = 5 + Math.floor(Math.random() * 10);
    } else if (status === "returning") {
      etaMin = Math.max(0, etaMin - 1);
      if (etaMin === 0) status = "idle";
    }

    const rad = (heading * Math.PI) / 180;
    const speed = status === "enroute" || status === "returning" ? 0.0018 : 0.0003;
    lat += Math.cos(rad) * speed;
    lng += Math.sin(rad) * speed;

    // Clamp inside Hyderabad bounding box
    lat = Math.min(17.5, Math.max(17.33, lat));
    lng = Math.min(78.55, Math.max(78.36, lng));

    return { ...ambulance, status, etaMin, heading, lat, lng };
  });
}

function formatTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
}

function esiColor(esi: ESI): string {
  switch (esi) {
    case 1:
      return "bg-crit";
    case 2:
      return "bg-accent";
    case 3:
      return "bg-warn";
    case 4:
      return "bg-ok";
    default:
      return "bg-muted";
  }
}

function statusColor(status: AmbulanceStatus): string {
  switch (status) {
    case "idle":
      return "var(--muted)";
    case "enroute":
      return "var(--accent)";
    case "onsite":
      return "var(--crit)";
    case "returning":
      return "var(--ok)";
  }
}

export function OperationsCockpit() {
  const [wards, setWards] = useState<Ward[]>(() => seedWards());
  const [ors] = useState<ORRoom[]>(() => seedORs());
  const [er, setER] = useState<ERPatient[]>(() => seedER());
  const [ambulances, setAmbulances] = useState<Ambulance[]>(() => AMBULANCE_SEED);
  const [nowMin, setNowMin] = useState<number>(540); // 9:00 AM

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWards((prev) => mutateWards(prev));
      setER((prev) => mutateER(prev));
      setAmbulances((prev) => mutateAmbulances(prev));
      setNowMin((m) => (m + 4 > 1080 ? 540 : m + 4));
    }, 1500);
    return () => window.clearInterval(interval);
  }, []);

  const orFreeNow = useMemo(
    () =>
      ors.filter((room) => !room.blocks.some((b) => b.startMin <= nowMin && nowMin < b.startMin + b.durationMin))
        .length,
    [ors, nowMin],
  );

  const erDoctorQueue = er.filter((p) => p.stage !== "Disposition").length;
  const ambulancesAvailable = ambulances.filter((a) => a.status === "idle" || a.status === "returning").length;

  return (
    <Panel
      title="Operations Command Wall"
      kicker="wards · or gantt · er triage · ambulance live"
      className="space-y-0"
    >
      <div className="mb-4 grid grid-cols-2 gap-px bg-hairline md:grid-cols-4">
        <Header label="Local Time" value={formatTime(nowMin)} />
        <Header label="OR Free" value={`${orFreeNow} / ${ors.length}`} />
        <Header label="ER Queue" value={String(erDoctorQueue)} />
        <Header label="Ambulances" value={`${ambulancesAvailable} / ${ambulances.length}`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <WardStripConsole wards={wards} />
        <ORGantt rooms={ors} nowMin={nowMin} />
        <ERTriageQueue patients={er} />
        <div className="border border-hairline bg-background">
          <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              Ambulance Live · Hyderabad
            </p>
            <p className="font-mono text-[10px] text-muted">{ambulances.length} units</p>
          </div>
          <div className="h-72">
            <AmbulanceMap ambulances={ambulances} hospital={HOSPITAL_CENTER} statusColor={statusColor} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function Header({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl">{value}</p>
    </div>
  );
}

function WardStripConsole({ wards }: { wards: Ward[] }) {
  return (
    <div className="border border-hairline bg-background">
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          Ward Strip Console
        </p>
        <p className="font-mono text-[10px] text-muted">live bed flips every 1.5s</p>
      </div>
      <div className="divide-y divide-hairline">
        {wards.map((ward) => {
          const occupancyPct = Math.round(
            (ward.beds.filter((b) => b !== "free").length / ward.totalBeds) * 100,
          );
          const free = ward.beds.filter((b) => b === "free").length;
          const critical = ward.beds.filter((b) => b === "crit").length;

          return (
            <div key={ward.id} className="grid grid-cols-[120px_60px_60px_1fr_72px] items-center gap-3 px-3 py-2">
              <p className="text-sm">{ward.name}</p>
              <p className="font-serif text-xl">{occupancyPct}%</p>
              <Sparkline values={ward.spark} />
              <BedRow beds={ward.beds} />
              <p className="font-mono text-[10px] text-muted">
                {free} free · <span className="text-crit">{critical} crit</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-6 w-full">
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" />
    </svg>
  );
}

function BedRow({ beds }: { beds: WardStatus[] }) {
  return (
    <div className="flex gap-[2px]">
      {beds.map((status, index) => (
        <span
          key={`${status}-${index}`}
          title={`Bed ${index + 1}: ${status}`}
          className={`h-3 flex-1 border transition-colors duration-300 ${
            status === "crit"
              ? "border-crit bg-crit"
              : status === "busy"
                ? "border-warn bg-warn"
                : status === "stable"
                  ? "border-ok bg-ok"
                  : "border-hairline bg-background"
          }`}
        />
      ))}
    </div>
  );
}

function ORGantt({ rooms, nowMin }: { rooms: ORRoom[]; nowMin: number }) {
  const dayStart = 480; // 8 AM
  const dayEnd = 1080; // 6 PM
  const total = dayEnd - dayStart;
  const nowPct = Math.max(0, Math.min(100, ((nowMin - dayStart) / total) * 100));

  return (
    <div className="border border-hairline bg-background">
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          OR Gantt · Today
        </p>
        <p className="font-mono text-[10px] text-muted">{formatTime(dayStart)} → {formatTime(dayEnd)}</p>
      </div>
      <div className="px-3 py-3">
        <div className="space-y-2">
          {rooms.map((room) => (
            <div key={room.id} className="grid grid-cols-[56px_1fr] items-center gap-3">
              <p className="font-mono text-[11px] text-muted">{room.name}</p>
              <div className="relative h-7 border border-hairline bg-surface">
                {room.blocks.map((block) => {
                  const left = ((block.startMin - dayStart) / total) * 100;
                  const width = (block.durationMin / total) * 100;
                  const completed = nowMin >= block.startMin + block.durationMin;
                  const running = nowMin >= block.startMin && !completed;

                  return (
                    <div
                      key={block.id}
                      className={`absolute top-0 h-full border ${
                        completed
                          ? "border-ok/40 bg-ok/20"
                          : running
                            ? "border-accent bg-accent/40"
                            : "border-hairline bg-background"
                      }`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      title={`${room.name} · ${block.surgeon} · ${block.procedure} · ${formatTime(block.startMin)}`}
                    >
                      <span className="block truncate px-1 pt-0.5 font-mono text-[9px] uppercase tracking-[0.12em]">
                        {block.surgeon.split(" ").slice(-1)[0]}
                      </span>
                    </div>
                  );
                })}
                <div
                  className="pointer-events-none absolute top-[-3px] bottom-[-3px] z-10 w-px bg-accent"
                  style={{ left: `${nowPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-3 font-mono text-[10px] text-muted">
          <span><i className="mr-1 inline-block h-2 w-2 bg-ok/40" /> done</span>
          <span><i className="mr-1 inline-block h-2 w-2 bg-accent/40" /> live</span>
          <span><i className="mr-1 inline-block h-2 w-2 border border-hairline" /> next</span>
          <span className="ml-auto">now: {formatTime(nowMin)}</span>
        </div>
      </div>
    </div>
  );
}

function ERTriageQueue({ patients }: { patients: ERPatient[] }) {
  return (
    <div className="border border-hairline bg-background">
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          ER Triage Queue
        </p>
        <p className="font-mono text-[10px] text-muted">ESI 1 = highest acuity</p>
      </div>
      <div className="max-h-80 divide-y divide-hairline overflow-y-auto">
        {patients.map((patient) => (
          <div key={patient.id} className="grid grid-cols-[14px_1fr_72px_72px] items-center gap-3 px-3 py-2">
            <span className={`h-3 w-3 ${esiColor(patient.esi)}`} title={`ESI ${patient.esi}`} />
            <div>
              <p className="text-sm">{patient.name} · {patient.age}</p>
              <p className="text-xs text-muted">{patient.complaint}</p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{patient.stage}</p>
            <p className="text-right font-serif text-lg">{patient.waitMin}m</p>
          </div>
        ))}
        {patients.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted">ER queue empty</p>
        )}
      </div>
    </div>
  );
}
