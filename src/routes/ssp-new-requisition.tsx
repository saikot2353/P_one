import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  CalendarClock,
  Laptop,
  Package,
  Smartphone,
  Utensils,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Layers,
  HandCoins,
} from "lucide-react";

export const Route = createFileRoute("/ssp-new-requisition")({
  head: () => ({
    meta: [
      { title: "Self-Service Requisition Hub — CRIPTON" },
      {
        name: "description",
        content:
          "Submit and monitor leave requests, ICT requisitions, IOU slips, SIM allocations, and conveyance claims.",
      },
    ],
  }),
  component: NewRequisitionPage,
});

function NewRequisitionPage() {
  const categories = [
    {
      title: "IOU Requisition",
      icon: HandCoins,
      desc: "Request temporary cash advances with IOU slips and track multi-level adjustment approvals.",
      to: "/ssp-iou-requisition",
      color: "from-amber-500/10 via-amber-500/5 to-transparent hover:border-amber-500/40",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      badge: "Active",
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      title: "Leave Application",
      icon: CalendarClock,
      desc: "Apply for annual, sick, or casual leaves and track balance accounts.",
      to: "/ssp-leave-requisition",
      color: "from-blue-500/10 via-blue-500/5 to-transparent hover:border-blue-500/40",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      badge: "Active",
      badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      title: "ICT Requisition",
      icon: Laptop,
      desc: "Request corporate laptops, software, hardware upgrades, and IT accessories.",
      to: "/ssp-ict-requisition",
      color: "from-purple-500/10 via-purple-500/5 to-transparent hover:border-purple-500/40",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      badge: "Active",
      badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    {
      title: "General Store Requisition",
      icon: Package,
      desc: "Order office supplies, corporate stationery, files, and physical materials.",
      to: "#",
      color: "from-emerald-500/10 via-emerald-500/5 to-transparent hover:border-emerald-500/40",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      badge: "Available",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      title: "Sim Requisition",
      icon: Smartphone,
      desc: "Request corporate mobile SIM allocation, cellular package updates, or limits.",
      to: "#",
      color: "from-slate-500/10 via-slate-500/5 to-transparent hover:border-slate-500/40",
      iconColor: "text-slate-500",
      iconBg: "bg-slate-500/10 border-slate-500/20",
      badge: "Available",
      badgeColor: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
    {
      title: "Lunch and Conveyance",
      icon: Utensils,
      desc: "Submit reimbursement claims for business food expenditures and travel allowances.",
      to: "#",
      color: "from-rose-500/10 via-rose-500/5 to-transparent hover:border-rose-500/40",
      iconColor: "text-rose-500",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      badge: "Claimable",
      badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
  ];

  const recentRequisitions = [
    {
      id: "REQ-2026-010",
      type: "Leave Application",
      date: "20/06/2026",
      details: "Sick Leave (1 Day)",
      status: "Pending",
    },
    {
      id: "REQ-2026-009",
      type: "Conveyance Claim",
      date: "18/06/2026",
      details: "Client Visit Travel Allowance",
      status: "Approved",
    },
    {
      id: "REQ-2026-008",
      type: "ICT Requisition",
      date: "17/06/2026",
      details: 'Dell 24" IPS Monitor',
      status: "Pending",
    },
    {
      id: "REQ-2026-007",
      type: "Lunch Allowance",
      date: "15/06/2026",
      details: "Team Meeting Catering",
      status: "Approved",
    },
    {
      id: "REQ-2026-006",
      type: "Sim Requisition",
      date: "12/06/2026",
      details: "Corporate Sim Card Request",
      status: "Approved",
    },
    {
      id: "REQ-2026-005",
      type: "Leave Application",
      date: "10/06/2026",
      details: "Casual Leave (3 Days)",
      status: "Approved",
    },
    {
      id: "REQ-2026-004",
      type: "ICT Requisition",
      date: "05/06/2026",
      details: "Logitech MX Master 3S Mouse",
      status: "Rejected",
    },
    {
      id: "REQ-2026-003",
      type: "Conveyance Claim",
      date: "01/06/2026",
      details: "Daily Office Travel Allowance",
      status: "Approved",
    },
    {
      id: "REQ-2026-002",
      type: "Leave Application",
      date: "28/05/2026",
      details: "Annual Leave (5 Days)",
      status: "Approved",
    },
    {
      id: "REQ-2026-001",
      type: "ICT Requisition",
      date: "20/05/2026",
      details: "USB-C Hub Multiport Adapter",
      status: "Approved",
    },
  ];

  const stats = [
    {
      label: "Total Submitted",
      value: "14",
      icon: FileText,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      label: "Pending Reviews",
      value: "1",
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Approved Requisitions",
      value: "11",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Rejected Requests",
      value: "2",
      icon: XCircle,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
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
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">SSP</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">New Requisition</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20 text-primary">
                  <Send className="size-5 animate-pulse" />
                </div>
                <span>Self-Service Requisition Hub</span>
              </h1>
            </div>
            <div className="text-[10.5px] font-black uppercase bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-md shadow-xs self-start md:self-center">
              Roster Grade: Grade 3 Employee
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border/80 p-3 rounded-lg shadow-xs flex items-center gap-3"
              >
                <div
                  className={`size-8.5 rounded-md border flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="size-4" />
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-muted-foreground uppercase block">
                    {stat.label}
                  </span>
                  <span className="text-sm font-black text-foreground">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Requisition Categories (col-span-2) */}
            <div className="lg:col-span-2 bg-card border border-border/80 p-4 rounded-lg shadow-xs space-y-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-primary">
                  Select Requisition Category
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Choose a portal category to configure and submit a request
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {categories.map((category) => (
                  <Link
                    key={category.title}
                    to={category.to}
                    className={`group relative bg-muted/20 hover:bg-card border border-border hover:border-primary/30 rounded-lg p-5 shadow-xs transition-all duration-300 overflow-hidden flex flex-col gap-4 hover:-translate-y-0.5 ${category.to === "#" ? "pointer-events-none opacity-60" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`size-12 rounded-md border ${category.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                      >
                        <category.icon className={`size-5.5 ${category.iconColor}`} />
                      </div>
                      <span
                        className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border ${category.badgeColor}`}
                      >
                        {category.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-foreground group-hover:text-primary transition-colors duration-200">
                        {category.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground leading-normal mt-1 font-medium">
                        {category.desc}
                      </p>
                    </div>

                    {category.to !== "#" && (
                      <div className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary-glow select-none mt-2">
                        <span>Launch Portal</span>
                        <ChevronRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Side Column: Recent Requisitions */}
            <div className="space-y-2">
              {/* Recent Activity Log */}
              <div className="bg-card border border-border/80 p-4 rounded-lg shadow-xs space-y-3">
                <div className="border-b border-border/40 pb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    Recent Requisitions
                  </span>
                  <Link
                    to="/ssp-my-requisition"
                    className="text-[9px] font-black uppercase tracking-wider text-primary hover:text-primary-glow hover:underline transition-all"
                  >
                    View All
                  </Link>
                </div>

                <div className="divide-y divide-border/40 text-xs">
                  {recentRequisitions.map((req) => (
                    <div
                      key={req.id}
                      className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9.5px] font-mono font-bold text-muted-foreground">
                            {req.id}
                          </span>
                          <span className="text-[9.5px] font-black text-foreground truncate">
                            {req.type}
                          </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground block truncate">
                          {req.details} &bull; {req.date}
                        </span>
                      </div>

                      <span
                        className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                          req.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                            : req.status === "Rejected"
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/25"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/25"
                        }`}
                      >
                        {req.status}
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
