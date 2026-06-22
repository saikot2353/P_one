import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Banknote, CheckCircle2, List, FileText, Send, Coins,
  TrendingUp, Clock, AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/payroll-advance")({
  head: () => ({
    meta: [
      { title: "Advance Management — CRIPTON" },
      { name: "description", content: "Manage advance requisitions, approvals, and lists." },
    ],
  }),
  component: PayrollAdvancePage,
});

function PayrollAdvancePage() {
  const categories = [
    {
      title: "Advance Requisition",
      icon: Send,
      desc: "Submit a new request for employee salary or general advance.",
      to: "#",
    },
    {
      title: "Approve Requisition",
      icon: CheckCircle2,
      desc: "Review, approve, or reject pending advance requisitions from your team.",
      to: "#",
    },
    {
      title: "Advance List",
      icon: List,
      desc: "View the comprehensive list and history of all processed advances.",
      to: "#",
    },
    {
      title: "Advance Status",
      icon: FileText,
      desc: "Track the real-time processing status of submitted advance applications.",
      to: "#",
    },
    {
      title: "Incentive Allowance",
      icon: Coins,
      desc: "Manage, assign, and process custom incentive allowances for employees.",
      to: "#",
    },
  ];

  const stats = [
    { label: "Total Advances", value: "245", icon: TrendingUp },
    { label: "Pending Approvals", value: "12", icon: Clock },
    { label: "Approved This Month", value: "18", icon: CheckCircle2 },
    { label: "Requires Attention", value: "3", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />
        <div className="p-4 md:p-6 space-y-6 w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Advance</span>
          </div>

          {/* Page Header */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                    <Banknote className="size-5" />
                  </div>
                  Advance Management
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Manage employee advance requests, track approval workflows, and configure incentive allowances across the organization.
                </p>
              </div>
              <div className="shrink-0">
                <div className="text-xs font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
                  Accounting Period: <span className="text-foreground font-semibold">June 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="bg-card border border-border/60 p-4 rounded-lg shadow-sm flex items-center gap-4">
                <div className="p-3 bg-muted rounded-md border border-border/50 text-muted-foreground">
                  <stat.icon className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                  <div className="text-xl font-bold text-foreground mt-0.5">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Modules Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => (
                <Link
                  key={category.title}
                  to={category.to}
                  className="group bg-card border border-border/60 hover:border-primary/40 p-5 rounded-lg shadow-sm hover:shadow transition-colors flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/5 text-primary rounded-md border border-primary/10 group-hover:bg-primary/10 transition-colors">
                        <category.icon className="size-5" />
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{category.title}</h3>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{category.desc}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
