import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, CalendarClock, CheckCircle2, ShieldCheck, ListOrdered,
  Send, Trash2, CalendarDays, CalendarRange, Clock, Coins, FileText
} from "lucide-react";

export const Route = createFileRoute("/leave")({
  head: () => ({
    meta: [
      { title: "Leave & Accruals Hub — CRIPTON" },
      { name: "description", content: "Access leave applications, approval boards, lists, and earned leave processing channels." },
    ],
  }),
  component: LeaveHubPage,
});

function LeaveHubPage() {
  const categories = [
    {
      title: "Leave Application",
      icon: CalendarClock,
      desc: "Submit new leave requisitions, draft requests, and track pending leave verification.",
      to: "/leave-application",
      color: "from-blue-500/10 via-blue-500/5 to-transparent hover:border-blue-500/40",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      badge: "Entry",
      badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      title: "Leave Approved & List",
      icon: ShieldCheck,
      desc: "Review, verify, approve employee leaves, view historical leave database logs, and manage deletions.",
      to: "/leave-list",
      color: "from-emerald-500/10 via-emerald-500/5 to-transparent hover:border-emerald-500/40",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      badge: "Approve, View or Delete",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    {
      title: "Earn Leave Process (Year)",
      icon: CalendarDays,
      desc: "Initiate year-base process calculation and accrue cash payments for employee earned leaves.",
      to: "/earn-leave-process?type=year",
      color: "from-amber-500/10 via-amber-500/5 to-transparent hover:border-amber-500/40",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      badge: "Year Base Process",
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      title: "Earn Leave Process Month",
      icon: CalendarRange,
      desc: "Process month-base calculation ledger and accrue cash payments for employee earned leaves.",
      to: "/earn-leave-process?type=month",
      color: "from-orange-500/10 via-orange-500/5 to-transparent hover:border-orange-500/40",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10 border-orange-500/20",
      badge: "Month Base Process",
      badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    {
      title: "Earn Leave Submit & List",
      icon: Send,
      desc: "Unified multi-tier verify and submit workflow panel to finalize cash earned leaves, delete items, and reset cycles.",
      to: "/earn-leave-workflow",
      color: "from-indigo-500/10 via-indigo-500/5 to-transparent hover:border-indigo-500/40",
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
      badge: "Submit Or Delete",
      badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    }
  ];

  const recentActions = [
    { id: "LV-2026-004", type: "Leave Application", name: "Tahmid Afsar", date: "20/06/2026", details: "Casual Leave (2 Days)", status: "Approved" },
    { id: "ELS-001", type: "Earn Leave Submit", name: "Tahmid Afsar", date: "19/06/2026", details: "disb. 4.39 Days (7,609 BDT)", status: "Submitted" },
    { id: "ELS-002", type: "Earn Leave Submit", name: "Dipon Saha", date: "19/06/2026", details: "disb. 5.60 Days (14,560 BDT)", status: "Submitted" },
    { id: "LV-2026-003", type: "Leave Application", name: "Dipon Saha", date: "18/06/2026", details: "Sick Leave (3 Days)", status: "Approved" },
    { id: "LV-2026-002", type: "Leave Application", name: "Sadiqul Islam", date: "17/06/2026", details: "Annual Leave (5 Days)", status: "Pending" },
    { id: "LV-2026-001", type: "Leave Application", name: "Tahmid Afsar", date: "15/06/2026", details: "Casual Leave (1 Day)", status: "Approved" }
  ];

  const stats = [
    { label: "Pending Leave Requests", value: "1", icon: Clock, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { label: "Approved (This Month)", value: "3", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Earn Leave Accrued", value: "9.99 Days", icon: Coins, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { label: "Total Action Records", value: "6", icon: FileText, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />
        <div className="p-4 md:p-6 space-y-2">
          {/* Page Header */}
          <div className="bg-card border border-border/80 rounded-lg p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Leave Management</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Leave Hub</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20 text-primary">
                  <CalendarClock className="size-5 animate-pulse" />
                </div>
                <span>Leave Management Hub</span>
              </h1>
            </div>
            <div className="text-[10.5px] font-black uppercase bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-md shadow-xs self-start md:self-center">
              Active User: Tahmid Afsar
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stats.map(stat => (
              <div key={stat.label} className="bg-card border border-border/80 p-3 rounded-lg shadow-xs flex items-center gap-3">
                <div className={`size-8.5 rounded-md border flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="size-4" />
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-muted-foreground uppercase block">{stat.label}</span>
                  <span className="text-sm font-black text-foreground">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Requisition Categories (col-span-2) */}
            <div className="lg:col-span-2 bg-card border border-border/80 p-4 rounded-lg shadow-xs space-y-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-primary">Select Leave Portal Category</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Choose an action below to process transactions or view historical grids</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {categories.map(category => (
                  <Link
                    key={category.title}
                    to={category.to}
                    className="group relative bg-muted/20 hover:bg-card border border-border hover:border-primary/30 rounded-lg p-5 shadow-xs transition-all duration-300 overflow-hidden flex flex-col gap-4 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`size-12 rounded-md border ${category.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                        <category.icon className={`size-5.5 ${category.iconColor}`} />
                      </div>
                      <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border ${category.badgeColor}`}>
                        {category.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-foreground group-hover:text-primary transition-colors duration-200">{category.title}</h3>
                      <p className="text-[10px] text-muted-foreground leading-normal mt-1 font-medium">{category.desc}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary-glow select-none mt-2">
                      <span>Open Portal</span>
                      <ChevronRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Side Column: Recent Actions */}
            <div className="space-y-2">
              <div className="bg-card border border-border/80 p-4 rounded-lg shadow-xs space-y-3">
                <div className="border-b border-border/40 pb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">Recent Leave Actions</span>
                  <Link to="/leave-list" className="text-[9px] font-black uppercase tracking-wider text-primary hover:text-primary-glow hover:underline transition-all">
                    View All
                  </Link>
                </div>

                <div className="divide-y divide-border/40 text-xs">
                  {recentActions.map(action => (
                    <div key={action.id} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9.5px] font-mono font-bold text-muted-foreground">{action.id}</span>
                          <span className="text-[9.5px] font-black text-foreground truncate">{action.type}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground block truncate font-medium">{action.name} &bull; {action.details} &bull; {action.date}</span>
                      </div>

                      <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${action.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25" :
                        action.status === "Submitted" ? "bg-blue-500/10 text-blue-600 border-blue-500/25" : "bg-amber-500/10 text-amber-600 border-amber-500/25"
                        }`}>
                        {action.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
