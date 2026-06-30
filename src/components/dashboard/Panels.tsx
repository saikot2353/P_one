import {
  CalendarDays,
  Cake,
  Award,
  Briefcase,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

const requests = [
  {
    name: "Daniel Kwan",
    role: "Frontend Engineer",
    type: "Annual Leave",
    days: "Jun 12 — Jun 16",
    status: "pending",
  },
  {
    name: "Priya Shah",
    role: "Product Designer",
    type: "Sick Leave",
    days: "Today",
    status: "approved",
  },
  {
    name: "Marcus Lee",
    role: "Sales Lead",
    type: "WFH",
    days: "Jun 10 — Jun 11",
    status: "pending",
  },
  {
    name: "Helena Cruz",
    role: "HR Specialist",
    type: "Comp Off",
    days: "Jun 20",
    status: "rejected",
  },
  {
    name: "Tomás Rivera",
    role: "DevOps Engineer",
    type: "Annual Leave",
    days: "Jul 01 — Jul 08",
    status: "pending",
  },
];

const events = [
  {
    type: "birthday",
    icon: Cake,
    title: "Anika Mehta's birthday",
    date: "Today",
    tint: "bg-accent text-accent-foreground",
  },
  {
    type: "anniversary",
    icon: Award,
    title: "5 yrs — Jordan Park",
    date: "Tomorrow",
    tint: "bg-success/15 text-success",
  },
  {
    type: "interview",
    icon: Briefcase,
    title: "Interview · Senior PM",
    date: "Jun 11, 2:00 PM",
    tint: "bg-info/15 text-info",
  },
  {
    type: "meeting",
    icon: CalendarDays,
    title: "All-hands meeting",
    date: "Jun 14, 10:00 AM",
    tint: "bg-primary/15 text-primary",
  },
];

const recruitment = [
  { role: "Senior Product Manager", dept: "Product", applicants: 248, stage: "Interview", pct: 68 },
  {
    role: "Staff Engineer, Platform",
    dept: "Engineering",
    applicants: 412,
    stage: "Screening",
    pct: 32,
  },
  { role: "UX Researcher", dept: "Design", applicants: 156, stage: "Offer", pct: 88 },
  { role: "Account Executive", dept: "Sales", applicants: 198, stage: "Interview", pct: 54 },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; Icon: any; label: string }> = {
    approved: { cls: "bg-success/15 text-success", Icon: CheckCircle2, label: "Approved" },
    pending: { cls: "bg-warning/15 text-warning", Icon: Clock, label: "Pending" },
    rejected: { cls: "bg-destructive/15 text-destructive", Icon: XCircle, label: "Rejected" },
  };
  const { cls, Icon, label } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${cls}`}
    >
      <Icon className="size-3" /> {label}
    </span>
  );
}

const initials = (n: string) =>
  n
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

export function LeaveRequests() {
  return (
    <div className="rounded-lg bg-card border border-border/70 shadow-xs xl:col-span-2 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border/95 relative group">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-between p-4 border-b border-border/55">
        <div>
          <h3 className="font-bold tracking-tight text-[13px] text-foreground">
            Pending Approvals
          </h3>
          <p className="text-xs text-muted-foreground/80 mt-0.5">
            Leave requests awaiting your action
          </p>
        </div>
        <button className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline hover:opacity-90 transition-opacity">
          View all <ArrowUpRight className="size-3.5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/30">
              <th className="px-4 py-2.5 font-bold">Employee</th>
              <th className="px-4 py-2.5 font-bold">Type</th>
              <th className="px-4 py-2.5 font-bold">Period</th>
              <th className="px-4 py-2.5 font-bold">Status</th>
              <th className="px-4 py-2.5 font-bold w-8"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={i} className="border-t border-border/45 hover:bg-muted/40 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-primary/95 to-primary-glow grid place-items-center text-[10px] font-bold text-primary-foreground shadow-xs">
                      {initials(r.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-xs">{r.name}</div>
                      <div className="text-[10px] text-muted-foreground/90 font-medium">
                        {r.role}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs font-medium">{r.type}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs font-medium">{r.days}</td>
                <td className="px-4 py-2.5">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-4 py-2.5">
                  <button className="text-muted-foreground/70 hover:text-foreground p-1 rounded-md hover:bg-muted transition duration-200">
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UpcomingEvents() {
  return (
    <div className="rounded-lg bg-card border border-border/70 p-4 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/95 relative group">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold tracking-tight text-[13px] text-foreground">Upcoming</h3>
          <p className="text-xs text-muted-foreground/80 mt-0.5">Events & milestones this week</p>
        </div>
        <button className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200">
          Calendar →
        </button>
      </div>
      <ul className="space-y-2">
        {events.map((e, i) => {
          const Icon = e.icon;
          return (
            <li
              key={i}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-all duration-200 group/evt border border-transparent hover:border-border/40"
            >
              <div
                className={`size-8 rounded-lg grid place-items-center transition-transform duration-300 group-hover/evt:scale-105 shadow-2xs ${e.tint}`}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-foreground truncate">{e.title}</div>
                <div className="text-[10px] text-muted-foreground/80 font-medium mt-0.5">
                  {e.date}
                </div>
              </div>
              <button className="text-xs text-primary font-bold hover:underline opacity-0 group-hover/evt:opacity-100 transition-opacity duration-200">
                View
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RecruitmentPipeline() {
  return (
    <div className="rounded-lg bg-card border border-border/70 p-4 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/95 relative group xl:col-span-3">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold tracking-tight text-[13px] text-foreground">
            Recruitment Pipeline
          </h3>
          <p className="text-xs text-muted-foreground/80 mt-0.5">
            Active openings and candidate progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs font-semibold px-2.5 h-8 rounded-lg border border-border/60 hover:bg-muted transition duration-200">
            Export
          </button>
          <button className="text-xs font-semibold px-3 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-sm hover:shadow-md hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5">
            + New Job
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recruitment.map((r, i) => (
          <div
            key={i}
            className="group/pip rounded-xl border border-border/60 p-3.5 hover:border-primary/45 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 bg-background/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-foreground text-xs tracking-tight">{r.role}</div>
                <div className="text-[10px] text-muted-foreground/90 font-medium mt-0.5">
                  {r.dept} · {r.applicants} applicants
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent border border-accent-foreground/5 text-accent-foreground font-semibold tracking-tight">
                {r.stage}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[9px] text-muted-foreground/85 font-medium mb-1">
                <span>Pipeline progress</span>
                <span className="font-bold text-foreground">{r.pct}%</span>
              </div>
              <div className="h-1 rounded-full bg-muted overflow-hidden border border-border/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 group-hover/pip:shadow-[0_0_8px_var(--primary-glow)]"
                  style={{ width: `${r.pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
