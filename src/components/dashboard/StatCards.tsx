import { Users, UserPlus, UserMinus, Clock4, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const spark = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({ v: 20 + Math.sin(i / 1.5 + seed) * 10 + seed * 3 + i }));

const stats = [
  { label: "Total Employees", value: "1,284", delta: "+4.6%", up: true, icon: Users, tint: "primary", data: spark(2) },
  { label: "New Hires (MTD)", value: "37", delta: "+12.1%", up: true, icon: UserPlus, tint: "success", data: spark(5) },
  { label: "Attrition Rate", value: "2.4%", delta: "-0.6%", up: false, icon: UserMinus, tint: "warning", data: spark(3) },
  { label: "Avg. Working Hrs", value: "8.2h", delta: "+0.3h", up: true, icon: Clock4, tint: "info", data: spark(7) },
];

const tintMap: Record<string, { bg: string; fg: string; stroke: string }> = {
  primary: { bg: "bg-primary/10", fg: "text-primary", stroke: "var(--primary)" },
  success: { bg: "bg-success/10", fg: "text-success", stroke: "var(--success)" },
  warning: { bg: "bg-warning/15", fg: "text-warning", stroke: "var(--warning)" },
  info: { bg: "bg-info/10", fg: "text-info", stroke: "var(--info)" },
};

export function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const t = tintMap[s.tint];
        return (
          <div key={s.label} className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
                <div className="mt-2 text-3xl font-display font-bold tracking-tight">{s.value}</div>
                <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${s.up ? "text-success" : "text-destructive"}`}>
                  {s.up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                  {s.delta}
                  <span className="text-muted-foreground font-normal ml-1">vs last month</span>
                </div>
              </div>
              <div className={`size-10 rounded-xl grid place-items-center ${t.bg} ${t.fg}`}>
                <Icon className="size-5" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-16 opacity-80 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.data} margin={{ top: 8, left: 0, right: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`g-${s.label}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={t.stroke} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={t.stroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={t.stroke} strokeWidth={2} fill={`url(#g-${s.label})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
