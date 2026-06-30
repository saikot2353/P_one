import {
  Users,
  UserPlus,
  UserMinus,
  Clock4,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const spark = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({ v: 20 + Math.sin(i / 1.5 + seed) * 10 + seed * 3 + i }));

type Tint = "primary" | "success" | "warning" | "info" | "violet" | "rose";

const stats: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: any;
  tint: Tint;
  data: any;
  subText: string;
}[] = [
  {
    label: "Total Employees",
    value: "1,284",
    delta: "+4.6%",
    up: true,
    icon: Users,
    tint: "primary",
    data: spark(2),
    subText: "1,042 active · 242 remote",
  },
  {
    label: "New Hires (MTD)",
    value: "37",
    delta: "+12.1%",
    up: true,
    icon: UserPlus,
    tint: "success",
    data: spark(5),
    subText: "14 onboarding · 23 placed",
  },
  {
    label: "Attrition Rate",
    value: "2.4%",
    delta: "-0.6%",
    up: false,
    icon: UserMinus,
    tint: "warning",
    data: spark(3),
    subText: "Target <4.0% · 2 yr low",
  },
  {
    label: "Avg. Working Hrs",
    value: "8.2h",
    delta: "+0.3h",
    up: true,
    icon: Clock4,
    tint: "info",
    data: spark(7),
    subText: "94.2% on-time presence",
  },
  {
    label: "Open Reqs",
    value: "18",
    delta: "+3",
    up: true,
    icon: Briefcase,
    tint: "violet",
    data: spark(9),
    subText: "12 tech · 6 sales",
  },
  {
    label: "Approvals",
    value: "45",
    delta: "-12",
    up: false,
    icon: ClipboardCheck,
    tint: "rose",
    data: spark(4),
    subText: "32 leave · 13 exp",
  },
];

const tintMap: Record<Tint, { card: string; iconBg: string; stroke: string; ring: string }> = {
  primary: {
    card: "bg-[oklch(0.99_0.005_255)] dark:bg-[oklch(0.16_0.015_255)] border-[oklch(0.48_0.19_255/0.12)] hover:border-[oklch(0.48_0.19_255/0.35)]",
    iconBg: "bg-primary text-primary-foreground shadow-[0_3px_10px_oklch(0.48_0.19_255/0.2)]",
    stroke: "var(--primary)",
    ring: "ring-primary/5",
  },
  success: {
    card: "bg-[oklch(0.99_0.005_160)] dark:bg-[oklch(0.16_0.015_165)] border-[oklch(0.62_0.16_155/0.12)] hover:border-[oklch(0.62_0.16_155/0.35)]",
    iconBg: "bg-success text-success-foreground shadow-[0_3px_10px_oklch(0.62_0.16_155/0.25)]",
    stroke: "var(--success)",
    ring: "ring-success/5",
  },
  warning: {
    card: "bg-[oklch(0.99_0.005_75)] dark:bg-[oklch(0.16_0.015_70)] border-[oklch(0.75_0.16_75/0.12)] hover:border-[oklch(0.75_0.16_75/0.35)]",
    iconBg: "bg-warning text-warning-foreground shadow-[0_3px_10px_oklch(0.75_0.16_75/0.2)]",
    stroke: "var(--warning)",
    ring: "ring-warning/5",
  },
  info: {
    card: "bg-[oklch(0.99_0.005_250)] dark:bg-[oklch(0.16_0.015_250)] border-[oklch(0.58_0.16_250/0.12)] hover:border-[oklch(0.58_0.16_250/0.35)]",
    iconBg: "bg-info text-info-foreground shadow-[0_3px_10px_oklch(0.58_0.16_250/0.2)]",
    stroke: "var(--info)",
    ring: "ring-info/5",
  },
  violet: {
    card: "bg-[oklch(0.99_0.005_300)] dark:bg-[oklch(0.16_0.015_300)] border-[oklch(0.6_0.19_300/0.12)] hover:border-[oklch(0.6_0.19_300/0.35)]",
    iconBg: "bg-[oklch(0.6_0.19_300)] text-white shadow-[0_3px_10px_oklch(0.6_0.19_300/0.2)]",
    stroke: "oklch(0.6 0.19 300)",
    ring: "ring-[oklch(0.6_0.19_300)]/5",
  },
  rose: {
    card: "bg-[oklch(0.99_0.005_15)] dark:bg-[oklch(0.16_0.015_15)] border-[oklch(0.6_0.19_15/0.12)] hover:border-[oklch(0.6_0.19_15/0.35)]",
    iconBg: "bg-[oklch(0.6_0.19_15)] text-white shadow-[0_3px_10px_oklch(0.6_0.19_15/0.2)]",
    stroke: "oklch(0.6 0.19 15)",
    ring: "ring-[oklch(0.6_0.19_15)]/5",
  },
};

export function StatCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
      {stats.map((s) => {
        const Icon = s.icon;
        const t = tintMap[s.tint];
        const gradId = `g-${s.label.replace(/[^a-zA-Z0-9]/g, "-")}`;
        return (
          <div
            key={s.label}
            className={`group relative overflow-hidden rounded-lg border p-3.5 ring-1 ${t.ring} ${t.card} transition-all duration-350 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-2 relative z-10">
              <div className="min-w-0 flex-1">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {s.label}
                </div>
                <div className="mt-1 text-xl font-extrabold tracking-tight leading-none text-foreground">
                  {s.value}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <span
                    className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[8.5px] font-bold bg-background/60 backdrop-blur-xs border border-border/30 shadow-2xs ${s.up ? "text-success" : "text-destructive"}`}
                  >
                    {s.up ? (
                      <TrendingUp className="size-2.5" />
                    ) : (
                      <TrendingDown className="size-2.5" />
                    )}
                    {s.delta}
                  </span>
                  <span className="text-[9px] text-muted-foreground/80 font-medium truncate flex-1 leading-tight">
                    {s.subText}
                  </span>
                </div>
              </div>
              <div
                className={`size-7 rounded-lg grid place-items-center transition-transform duration-300 group-hover:scale-105 ${t.iconBg} shrink-0`}
              >
                <Icon className="size-3.5" />
              </div>
            </div>
            {/* Sparkline gradient and area */}
            <div className="absolute inset-x-0 bottom-0 h-9 opacity-40 pointer-events-none group-hover:opacity-60 transition-opacity duration-300">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.data} margin={{ top: 8, left: 0, right: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={t.stroke} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={t.stroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={t.stroke}
                    strokeWidth={1.5}
                    fill={`url(#${gradId})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
