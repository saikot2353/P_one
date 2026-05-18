import { Users, UserPlus, UserMinus, Clock4, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const spark = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({ v: 20 + Math.sin(i / 1.5 + seed) * 10 + seed * 3 + i }));

type Tint = "primary" | "success" | "warning" | "info";

const stats: { label: string; value: string; delta: string; up: boolean; icon: any; tint: Tint; data: any }[] = [
  { label: "Total Employees", value: "1,284", delta: "+4.6%", up: true, icon: Users, tint: "primary", data: spark(2) },
  { label: "New Hires (MTD)", value: "37", delta: "+12.1%", up: true, icon: UserPlus, tint: "success", data: spark(5) },
  { label: "Attrition Rate", value: "2.4%", delta: "-0.6%", up: false, icon: UserMinus, tint: "warning", data: spark(3) },
  { label: "Avg. Working Hrs", value: "8.2h", delta: "+0.3h", up: true, icon: Clock4, tint: "info", data: spark(7) },
];

const tintMap: Record<Tint, { card: string; iconBg: string; iconFg: string; stroke: string; ring: string }> = {
  primary: {
    card: "bg-[oklch(0.98_0.015_255)] dark:bg-[oklch(0.20_0.035_255)] border-[oklch(0.48_0.19_255/0.15)] hover:border-[oklch(0.48_0.19_255/0.4)]",
    iconBg: "bg-primary text-primary-foreground shadow-[0_4px_12px_oklch(0.48_0.19_255/0.25)]",
    iconFg: "",
    stroke: "var(--primary)",
    ring: "ring-primary/10",
  },
  success: {
    card: "bg-[oklch(0.98_0.02_160)] dark:bg-[oklch(0.20_0.035_165)] border-[oklch(0.62_0.16_155/0.15)] hover:border-[oklch(0.62_0.16_155/0.4)]",
    iconBg: "bg-success text-success-foreground shadow-[0_4px_12px_oklch(0.62_0.16_155/0.25)]",
    iconFg: "",
    stroke: "var(--success)",
    ring: "ring-success/10",
  },
  warning: {
    card: "bg-[oklch(0.98_0.02_75)] dark:bg-[oklch(0.20_0.035_70)] border-[oklch(0.75_0.16_75/0.15)] hover:border-[oklch(0.75_0.16_75/0.4)]",
    iconBg: "bg-warning text-warning-foreground shadow-[0_4px_12px_oklch(0.75_0.16_75/0.25)]",
    iconFg: "",
    stroke: "var(--warning)",
    ring: "ring-warning/10",
  },
  info: {
    card: "bg-[oklch(0.98_0.025_250)] dark:bg-[oklch(0.20_0.035_250)] border-[oklch(0.58_0.16_250/0.15)] hover:border-[oklch(0.58_0.16_250/0.4)]",
    iconBg: "bg-info text-info-foreground shadow-[0_4px_12px_oklch(0.58_0.16_250/0.25)]",
    iconFg: "",
    stroke: "var(--info)",
    ring: "ring-info/10",
  },
};

export function StatCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const t = tintMap[s.tint];
        const gradId = `g-${s.label.replace(/[^a-zA-Z0-9]/g, "-")}`;
        return (
          <div
            key={s.label}
            className={`group relative overflow-hidden rounded-2xl border p-5 ring-1 ${t.ring} ${t.card} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">{s.label}</div>
                <div className="mt-2 text-3xl font-extrabold tracking-tight leading-none text-foreground">{s.value}</div>
                <div className={`mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-background/55 backdrop-blur-xs border border-border/40 shadow-xs ${s.up ? "text-success" : "text-destructive"}`}>
                  {s.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {s.delta}
                  <span className="text-muted-foreground/85 font-normal ml-1">vs last mo.</span>
                </div>
              </div>
              <div className={`size-10 rounded-xl grid place-items-center transition-transform duration-300 group-hover:scale-110 ${t.iconBg}`}>
                <Icon className="size-5" />
              </div>
            </div>
            {/* Sparkline gradient and area */}
            <div className="absolute inset-x-0 bottom-0 h-12 opacity-60 pointer-events-none group-hover:opacity-85 transition-opacity duration-300">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.data} margin={{ top: 8, left: 0, right: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={t.stroke} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={t.stroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={t.stroke} strokeWidth={2} fill={`url(#${gradId})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
