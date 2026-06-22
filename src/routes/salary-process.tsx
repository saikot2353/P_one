import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Cpu, CheckCircle2, Send, FileText, Gift, Building, 
  CalendarCheck, Clock, Settings, Upload, Zap, Search
} from "lucide-react";

export const Route = createFileRoute("/salary-process")({
  head: () => ({
    meta: [
      { title: "Salary Process — CRIPTON" },
      { name: "description", content: "Process and manage salaries and bonuses." },
    ],
  }),
  component: SalaryProcessPage,
});

function SalaryProcessPage() {
  const sections = [
    {
      title: "Salary & Bonus Processing",
      description: "Initialize and run payroll calculations.",
      icon: Zap,
      items: [
        { title: "Monthly Salary Process", icon: Settings, desc: "Process regular monthly salaries.", to: "#" },
        { title: "Advance Salary Process", icon: Clock, desc: "Process advance salary payments.", to: "#" },
        { title: "Yearly Bonus Process", icon: Gift, desc: "Process yearly bonuses and incentives.", to: "#" },
      ]
    },
    {
      title: "Review & Verification",
      description: "Check calculations before finalizing.",
      icon: Search,
      items: [
        { title: "Check Salary", icon: FileText, desc: "Verify and check standard salary calculations.", to: "#" },
        { title: "Check Salary (Advance)", icon: FileText, desc: "Check advance salary calculations.", to: "#" },
        { title: "Bonus Check", icon: FileText, desc: "Verify bonus calculations and amounts.", to: "#" },
      ]
    },
    {
      title: "Submission & Approvals",
      description: "Submit payroll data and obtain sign-offs.",
      icon: CheckCircle2,
      items: [
        { title: "Monthly Salary Approve", icon: CheckCircle2, desc: "Approve processed monthly salaries.", to: "#" },
        { title: "Yearly Salary Approve", icon: CalendarCheck, desc: "Approve yearly salary processing.", to: "#" },
        { title: "Approve by Plant Head", icon: Building, desc: "Final approval by the Plant Head.", to: "#" },
        { title: "Salary Submit", icon: Send, desc: "Submit processed standard salaries.", to: "#" },
        { title: "Salary Submit (Advance)", icon: Send, desc: "Submit advance salaries.", to: "#" },
        { title: "Bonus Submit", icon: Upload, desc: "Submit processed bonuses.", to: "#" },
      ]
    }
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
            <span className="text-foreground font-semibold">Salary Process</span>
          </div>

          {/* Page Header */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                    <Cpu className="size-5" />
                  </div>
                  Salary Operations Hub
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Execute payroll operations, verify calculations, and secure necessary management approvals in a streamlined workflow.
                </p>
              </div>
              <div className="shrink-0">
                <div className="text-xs font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
                  Accounting Period: <span className="text-foreground font-semibold">June 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sections as Cards */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-border/60 bg-muted/10">
                  <div className="flex items-center gap-2.5 text-foreground">
                    <section.icon className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 ml-7.5">{section.description}</p>
                </div>
                <div className="p-3 bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {section.items.map(category => (
                      <Link
                        key={category.title}
                        to={category.to}
                        className="group flex items-start gap-3 p-3 bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-border/80 rounded-lg transition-all shadow-sm hover:shadow"
                      >
                        <div className="p-2 bg-primary/5 text-primary rounded-md border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
                          <category.icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{category.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{category.desc}</p>
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
