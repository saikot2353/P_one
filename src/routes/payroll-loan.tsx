import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, CreditCard, Send, List, CheckCircle2, UserCheck,
  Briefcase, FileText, Activity
} from "lucide-react";

export const Route = createFileRoute("/payroll-loan")({
  head: () => ({
    meta: [
      { title: "Loan Management — CRIPTON" },
      { name: "description", content: "Manage loan applications, lists, and approvals." },
    ],
  }),
  component: PayrollLoanPage,
});

function PayrollLoanPage() {
  const categories = [
    {
      title: "Loan Application",
      icon: Send,
      desc: "Submit a new employee loan application for personal or business needs.",
      to: "#",
    },
    {
      title: "Loan Application List",
      icon: List,
      desc: "View the list of all submitted loan applications and their current statuses.",
      to: "#",
    },
    {
      title: "Approve By HOD",
      icon: CheckCircle2,
      desc: "Department heads can review and approve loan applications from their team.",
      to: "#",
    },
    {
      title: "Approve By HR",
      icon: UserCheck,
      desc: "Final authorization and processing of loan applications by HR department.",
      to: "#",
    },
  ];

  const stats = [
    { label: "Active Loans", value: "84", icon: Briefcase },
    { label: "Pending HOD", value: "6", icon: Activity },
    { label: "Pending HR", value: "2", icon: FileText },
    { label: "Disbursed", value: "112", icon: CheckCircle2 },
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
            <span className="text-foreground font-semibold">Loan</span>
          </div>

          {/* Page Header */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                    <CreditCard className="size-5" />
                  </div>
                  Loan Management
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Oversee the complete employee loan lifecycle, from initial applications to departmental and HR approvals.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
