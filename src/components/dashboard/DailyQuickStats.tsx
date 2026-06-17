import {
  Users, UserPlus, UserMinus, UserX,
  Wallet, UserCheck, Briefcase, UserCog,
  Clock, Clock4, Banknote, HandCoins,
  TrendingUp, TrendingDown
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const spark = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({ v: 20 + Math.sin(i / 1.5 + seed) * 10 + seed * 3 + i }));

type Tint = "primary" | "success" | "warning" | "info" | "violet" | "rose";

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

const stats = {
  headcount: [
    { label: "Total Employee", value: "2,515", delta: "+4.6%", up: true, icon: Users, tint: "primary", data: spark(1) },
    { label: "New Joining", value: "101", delta: "+12.1%", up: true, icon: UserPlus, tint: "success", data: spark(2) },
    { label: "Resigned", value: "3", delta: "-0.6%", up: false, icon: UserMinus, tint: "rose", data: spark(3) },
    { label: "Lefty", value: "177", delta: "+1.2%", up: true, icon: UserX, tint: "warning", data: spark(4) },
  ],
  attendance: {
    summary: {
      present: { label: "Today Present", value: "2,408", ratio: "95.8%", delta: "+0.8%", up: true, icon: UserCheck, tint: "success" },
      absent: { label: "Today Absent", value: "104", ratio: "4.1%", delta: "-0.8%", up: false, icon: UserX, tint: "rose" },
    },
    details: [
      { label: "Worker Absent", value: "74", delta: "-2.3%", up: true, icon: Briefcase, tint: "warning" },
      { label: "Staff Absent", value: "30", delta: "+0.5%", up: false, icon: UserCog, tint: "rose" },
      { label: "Worker Late", value: "109", delta: "+5.1%", up: false, icon: Clock, tint: "violet" },
      { label: "Staff Late", value: "37", delta: "-1.2%", up: true, icon: Clock4, tint: "info" },
    ]
  },
  finance: [
    { label: "Gross Salary", value: "46,418,240 ৳", delta: "+2.4%", up: true, icon: Wallet, tint: "info" },
    { label: "Total OT AMT", value: "7,080,012 ৳", delta: "+15%", up: true, icon: Banknote, tint: "primary" },
    { label: "Total Hold Salary", value: "0 ৳", delta: "0.0%", up: true, icon: HandCoins, tint: "success" },
  ]
};

function StatCard({ s }: { s: any }) {
  const Icon = s.icon;
  const t = tintMap[s.tint as Tint];
  const gradId = `g-${s.label.replace(/[^a-zA-Z0-9]/g, "-")}`;
  
  return (
    <div className={`group relative overflow-hidden rounded-lg border p-3.5 ring-1 ${t.ring} ${t.card} transition-all duration-350 hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">{s.label}</div>
          <div className="mt-1 text-xl font-extrabold tracking-tight leading-none text-foreground">{s.value}</div>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[8.5px] font-bold bg-background/60 backdrop-blur-xs border border-border/30 shadow-2xs ${s.up ? "text-success" : "text-destructive"}`}>
              {s.up ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
              {s.delta}
            </span>
            <span className="text-[9px] text-muted-foreground/80 font-medium truncate flex-1 leading-tight">vs last mo.</span>
          </div>
        </div>
        <div className={`size-7 rounded-lg grid place-items-center transition-transform duration-300 group-hover:scale-105 ${t.iconBg} shrink-0`}>
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
            <Area type="monotone" dataKey="v" stroke={t.stroke} strokeWidth={1.5} fill={`url(#${gradId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MasterCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-xs">
      <div className="bg-muted/30 px-4 py-2.5 border-b border-border/40">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/85">{title}</h3>
      </div>
      <div className="p-3.5">
        {children}
      </div>
    </div>
  );
}

export function DailyQuickStats() {
  return (
    <div className="space-y-4">
      <MasterCard title="Headcount & Movement Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {stats.headcount.map(s => <StatCard key={s.label} s={s} />)}
        </div>
      </MasterCard>
      
      <MasterCard title="Today's Attendance">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Attendance Overview Left Column (5/12 grid span) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-xl border border-border/40 bg-muted/10 relative overflow-hidden">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">Attendance Ratio</span>
              <div className="mt-2 flex items-baseline gap-4">
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-foreground">{stats.attendance.summary.present.value}</div>
                  <div className="text-[9.5px] font-semibold text-success flex items-center gap-1 mt-0.5">
                    <span className="inline-block size-2 rounded-full bg-success"></span>
                    Present ({stats.attendance.summary.present.ratio})
                  </div>
                </div>
                <div className="border-l border-border/60 h-8 self-center"></div>
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-foreground">{stats.attendance.summary.absent.value}</div>
                  <div className="text-[9.5px] font-semibold text-destructive flex items-center gap-1 mt-0.5">
                    <span className="inline-block size-2 rounded-full bg-destructive"></span>
                    Absent ({stats.attendance.summary.absent.ratio})
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Dual Distribution Progress Bar */}
            <div className="mt-4">
              <div className="flex w-full h-2 rounded-full overflow-hidden bg-muted/60">
                <div 
                  className="bg-success transition-all duration-500" 
                  style={{ width: stats.attendance.summary.present.ratio }}
                  title={`Present: ${stats.attendance.summary.present.ratio}`}
                />
                <div 
                  className="bg-destructive transition-all duration-500" 
                  style={{ width: stats.attendance.summary.absent.ratio }}
                  title={`Absent: ${stats.attendance.summary.absent.ratio}`}
                />
              </div>
              <div className="mt-2 flex justify-between items-center text-[9px] text-muted-foreground font-medium">
                <span className="flex items-center gap-1">
                  <TrendingUp className="size-2.5 text-success" />
                  {stats.attendance.summary.present.delta} vs last mo.
                </span>
                <span className="flex items-center gap-1">
                  <TrendingDown className="size-2.5 text-destructive" />
                  {stats.attendance.summary.absent.delta} vs last mo.
                </span>
              </div>
            </div>
          </div>

          {/* Details & Late Grid Right Column (7/12 grid span) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3">
            {stats.attendance.details.map(s => {
              const Icon = s.icon;
              const t = tintMap[s.tint as Tint];
              return (
                <div 
                  key={s.label}
                  className={`flex items-center gap-3 p-3 rounded-lg border ring-1 ${t.ring} ${t.card} transition-all duration-300 hover:shadow-xs`}
                >
                  <div className={`size-8 rounded-lg grid place-items-center ${t.iconBg} shrink-0`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/75 truncate">{s.label}</div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-lg font-extrabold tracking-tight text-foreground">{s.value}</span>
                      <span className={`inline-flex items-center gap-0.5 text-[8.5px] font-bold ${s.up ? "text-success" : "text-destructive"}`}>
                        {s.up ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                        {s.delta}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </MasterCard>

      <MasterCard title="Payroll & Finances">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 bg-muted/10 rounded-xl border border-border/40 overflow-hidden">
          {stats.finance.map(s => {
            const Icon = s.icon;
            const t = tintMap[s.tint as Tint];
            return (
              <div 
                key={s.label} 
                className="flex items-center justify-between gap-4 p-4 hover:bg-muted/20 transition-all duration-300"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground/75">{s.label}</div>
                  <div className="mt-1 text-lg font-extrabold tracking-tight text-foreground leading-none">{s.value}</div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[8.5px] font-bold ${s.up ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                      {s.up ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                      {s.delta}
                    </span>
                    <span className="text-[9px] text-muted-foreground/70 font-medium">vs last mo.</span>
                  </div>
                </div>
                <div className={`size-9 rounded-lg grid place-items-center ${t.iconBg} shrink-0`}>
                  <Icon className="size-4.5" />
                </div>
              </div>
            );
          })}
        </div>
      </MasterCard>
    </div>
  );
}
