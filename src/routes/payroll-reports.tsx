import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  BarChart3,
  FileText,
  History,
  List,
  CalendarDays,
  Calculator,
  Gift,
  PieChart,
} from "lucide-react";

export const Route = createFileRoute("/payroll-reports")({
  head: () => ({
    meta: [
      { title: "Payroll Reports — CRIPTON" },
      { name: "description", content: "Access and generate payroll reports." },
    ],
  }),
  component: PayrollReportsPage,
});

function PayrollReportsPage() {
  const sections = [
    {
      title: "Salary Reports",
      description: "Generate comprehensive salary sheets and employee history.",
      icon: FileText,
      items: [
        {
          title: "Monthly Salary Details",
          icon: FileText,
          desc: "Detailed breakdown of monthly salaries.",
          to: "/monthly-salary-details",
        },
        {
          title: "Monthly Lefty Salary Sheet",
          icon: FileText,
          desc: "Salary sheet for resigned/separated employees.",
          to: "/monthly-lefty-salary-sheet",
        },
        {
          title: "Employee Salary History",
          icon: History,
          desc: "Historical salary data and increment records for employees.",
          to: "/employee-salary-history",
        },
        {
          title: "Monthly Advance Salary Sheet",
          icon: FileText,
          desc: "Report on monthly advance salary disbursements.",
          to: "/monthly-advance-salary-sheet",
        },
        {
          title: "Summary Salary Sheet",
          icon: List,
          desc: "Summarized overview of the monthly department/unit salary.",
          to: "/summary-salary-sheet",
        },
        {
          title: "Holiday Summary Sheet",
          icon: CalendarDays,
          desc: "Summary report on holiday overtime and compensation.",
          to: "/holiday-summary-sheet",
        },
      ],
    },
    {
      title: "Bonus, Allowance & Settlement Reports",
      description: "Review yearly bonus, festival allowance, earn leave pay, and final settlements.",
      icon: Calculator,
      items: [
        {
          title: "Yearly Bonus Report",
          icon: Gift,
          desc: "Comprehensive report on yearly festival and performance bonuses.",
          to: "#",
        },
        {
          title: "Earn Leave Pay Report",
          icon: FileText,
          desc: "Report on earned leave encashment and payments.",
          to: "#",
        },
        {
          title: "Festival Allowance Payment Sheet",
          icon: Gift,
          desc: "Detailed payment sheet for festival allowances.",
          to: "#",
        },
        {
          title: "Final Settlement Report",
          icon: FileText,
          desc: "Comprehensive report on processed employee final settlements.",
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
            <span className="text-foreground font-semibold">Reports</span>
          </div>

          {/* Page Header */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                    <BarChart3 className="size-5" />
                  </div>
                  Payroll Reports Hub
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Generate, view, and export detailed reports for salaries, bonuses, taxes, and
                  final settlements.
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
                        to={category.to as any}
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
