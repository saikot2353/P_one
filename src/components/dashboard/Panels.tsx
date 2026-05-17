import { CalendarDays, Cake, Award, Briefcase, ArrowUpRight, MoreHorizontal, CheckCircle2, XCircle, Clock } from "lucide-react";

const requests = [
  { name: "Daniel Kwan", role: "Frontend Engineer", type: "Annual Leave", days: "Jun 12 — Jun 16", status: "pending" },
  { name: "Priya Shah", role: "Product Designer", type: "Sick Leave", days: "Today", status: "approved" },
  { name: "Marcus Lee", role: "Sales Lead", type: "WFH", days: "Jun 10 — Jun 11", status: "pending" },
  { name: "Helena Cruz", role: "HR Specialist", type: "Comp Off", days: "Jun 20", status: "rejected" },
  { name: "Tomás Rivera", role: "DevOps Engineer", type: "Annual Leave", days: "Jul 01 — Jul 08", status: "pending" },
];

const events = [
  { type: "birthday", icon: Cake, title: "Anika Mehta's birthday", date: "Today", tint: "bg-accent text-accent-foreground" },
  { type: "anniversary", icon: Award, title: "5 yrs — Jordan Park", date: "Tomorrow", tint: "bg-success/15 text-success" },
  { type: "interview", icon: Briefcase, title: "Interview · Senior PM", date: "Jun 11, 2:00 PM", tint: "bg-info/15 text-info" },
  { type: "meeting", icon: CalendarDays, title: "All-hands meeting", date: "Jun 14, 10:00 AM", tint: "bg-primary/15 text-primary" },
];

const recruitment = [
  { role: "Senior Product Manager", dept: "Product", applicants: 248, stage: "Interview", pct: 68 },
  { role: "Staff Engineer, Platform", dept: "Engineering", applicants: 412, stage: "Screening", pct: 32 },
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
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${cls}`}>
      <Icon className="size-3" /> {label}
    </span>
  );
}

const initials = (n: string) => n.split(" ").map((s) => s[0]).slice(0, 2).join("");

export function LeaveRequests() {
  return (
    <div className="rounded-xl bg-card border border-border shadow-[var(--shadow-soft)] xl:col-span-2">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="font-semibold tracking-tight text-[13px]">Pending Approvals</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Leave requests awaiting your action</p>
        </div>
        <button className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline">
          View all <ArrowUpRight className="size-3.5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Employee</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Period</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium w-8"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-primary/80 to-primary-glow grid place-items-center text-xs font-semibold text-primary-foreground">
                      {initials(r.name)}
                    </div>
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{r.type}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.days}</td>
                <td className="px-5 py-3"><StatusPill status={r.status} /></td>
                <td className="px-5 py-3"><button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button></td>
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
    <div className="rounded-xl bg-card border border-border p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold tracking-tight text-[13px]">Upcoming</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Events & milestones this week</p>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground">Calendar →</button>
      </div>
      <ul className="space-y-3">
        {events.map((e, i) => {
          const Icon = e.icon;
          return (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors">
              <div className={`size-10 rounded-xl grid place-items-center ${e.tint}`}><Icon className="size-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium truncate">{e.title}</div>
                <div className="text-xs text-muted-foreground">{e.date}</div>
              </div>
              <button className="text-xs text-primary font-medium hover:underline">View</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RecruitmentPipeline() {
  return (
    <div className="rounded-xl bg-card border border-border p-4 shadow-[var(--shadow-soft)] xl:col-span-3">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold tracking-tight text-[13px]">Recruitment Pipeline</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Active openings and candidate progress</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs font-medium px-3 h-8 rounded-lg border border-border hover:bg-muted">Export</button>
          <button className="text-xs font-medium px-3 h-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90">+ New Job</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recruitment.map((r, i) => (
          <div key={i} className="rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{r.role}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.dept} · {r.applicants} applicants</div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-accent text-accent-foreground font-medium">{r.stage}</span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                <span>Pipeline progress</span><span className="font-medium text-foreground">{r.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
