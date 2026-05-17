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
    card: "bg-[oklch(0.97_0.025_200)] dark:bg-[oklch(0.24_0.04_220)]",
    iconBg: "bg-primary text-primary-foreground",
    iconFg: "",
    stroke: "var(--primary)",
    ring: "ring-primary/10",
  },
  success: {
    card: "bg-[oklch(0.96_0.04_160)] dark:bg-[oklch(0.24_0.05_165)]",
    iconBg: "bg-success text-success-foreground",
    iconFg: "",
    stroke: "var(--success)",
    ring: "ring-success/10",
  },
  warning: {
    card: "bg-[oklch(0.96_0.05_75)] dark:bg-[oklch(0.26_0.06_70)]",
    iconBg: "bg-warning text-warning-foreground",
    iconFg: "",
    stroke: "var(--warning)",
    ring: "ring-warning/10",
  },
  info: {
    card: "bg-[oklch(0.96_0.035_255)] dark:bg-[oklch(0.24_0.05_255)]",
    iconBg: "bg-info text-info-foreground",
    iconFg: "",
    stroke: "var(--info)",
    ring: "ring-info/10",
  },
};

export function StatCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        const t = tintMap[s.tint];
        return (
          <div
            key={s.label}
            className={`relative overflow-hidden rounded-xl border border-border/60 p-4 ring-1 ${t.ring} ${t.card} transition-shadow hover:shadow-[var(--shadow-soft)]`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-muted-foreground">{s.label}</div>
                <div className="mt-1.5 text-2xl font-bold tracking-tight leading-none">{s.value}</div>
                <div className={`mt-2 inline-flex items-center gap-1 text-[11px] font-medium ${s.up ? "text-success" : "text-destructive"}`}>
                  {s.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {s.delta}
                  <span className="text-muted-foreground font-normal ml-1">vs last mo.</span>
                </div>
              </div>
              <div className={`size-9 rounded-lg grid place-items-center shadow-sm ${t.iconBg}`}>
                <Icon className="size-[18px]" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-10 opacity-70 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.data} margin={{ top: 4, left: 0, right: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`g-${s.label}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={t.stroke} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={t.stroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={t.stroke} strokeWidth={1.75} fill={`url(#g-${s.label})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
