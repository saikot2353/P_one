import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Gift,
  Database,
  List,
  FileText,
  Send,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Building,
  UserCheck,
  Calculator,
} from "lucide-react";

export const Route = createFileRoute("/payroll-benefits")({
  head: () => ({
    meta: [
      { title: "Benefits Management — CRIPTON" },
      { name: "description", content: "Manage employee benefits and final settlements." },
    ],
  }),
  component: PayrollBenefitsPage,
});

function PayrollBenefitsPage() {
  const sections = [
    {
      title: "Configuration & Records",
      description: "Manage benefit definitions and master lists.",
      icon: Database,
      items: [
        {
          title: "Master Data",
          icon: Database,
          desc: "Configure master data for benefits.",
          to: "/payroll-benefits-master-data",
        },
        { title: "Common Benefits", icon: Gift, desc: "Assign common benefit amounts to employees.", to: "/payroll-benefits-common" },
        {
          title: "Common Benefit List",
          icon: List,
          desc: "View the list of common benefits.",
          to: "#",
        },
        {
          title: "Monthly Benefits",
          icon: FileText,
          desc: "Assign and track one-time monthly benefit entries per employee.",
          to: "/payroll-benefits-monthly",
        },
        {
          title: "Exclude Benefit",
          icon: ShieldCheck,
          desc: "Manage benefit exclusions.",
          to: "#",
        },
        { title: "Benefit List", icon: List, desc: "Comprehensive list of all benefits.", to: "#" },
      ],
    },
    {
      title: "Final Settlement Workflow",
      description: "Process and approve employee final settlements (FS).",
      icon: CheckCircle2,
      items: [
        { title: "Submit FS", icon: Send, desc: "Submit a new final settlement.", to: "#" },
        { title: "Check By (HR) FS", icon: UserCheck, desc: "HR verification of FS.", to: "#" },
        { title: "Checked By HRD", icon: UserCheck, desc: "HR Director approval for FS.", to: "#" },
        {
          title: "Checked By (Audit) FS",
          icon: ShieldCheck,
          desc: "Audit department verification.",
          to: "#",
        },
        { title: "Plant Head FS", icon: Building, desc: "Plant head authorization.", to: "#" },
        {
          title: "Authorized By (A/C) FS",
          icon: Calculator,
          desc: "Accounts department authorization.",
          to: "#",
        },
        {
          title: "Final Settlement",
          icon: FileText,
          desc: "Process final settlement.",
          to: "/final-settlement",
        },
        {
          title: "Final Settlement (V2)",
          icon: FileText,
          desc: "Process final settlement (Version 2).",
          to: "#",
        },
        {
          title: "Check Final Settlement By(HR)",
          icon: UserCheck,
          desc: "HR verification of final settlement.",
          to: "#",
        },
        {
          title: "Check Final Settlement By(HRD)",
          icon: UserCheck,
          desc: "HRD verification of final settlement.",
          to: "#",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />

        <div className="p-4 md:p-6 space-y-6 w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Benefits</span>
          </div>

          {/* Page Header */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                    <Gift className="size-5" />
                  </div>
                  Benefits & Settlement Hub
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Manage employee benefits, handle loan and advance requests, and execute the
                  complete final settlement workflow.
                </p>
              </div>
              <div className="shrink-0">
                <div className="text-xs font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
                  Accounting Period:{" "}
                  <span className="text-foreground font-semibold">June 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sections as Cards */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-5 border-b border-border/60 bg-muted/10">
                  <div className="flex items-center gap-2.5 text-foreground">
                    <section.icon className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 ml-7.5">
                    {section.description}
                  </p>
                </div>
                <div className="p-3 bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {section.items.map((category) => (
                      <Link
                        key={category.title}
                        to={category.to}
                        className="group flex items-start gap-3 p-3 bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-border/80 rounded-lg transition-all shadow-sm hover:shadow"
                      >
                        <div className="p-2 bg-primary/5 text-primary rounded-md border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
                          <category.icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {category.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                            {category.desc}
                          </p>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 self-center" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
