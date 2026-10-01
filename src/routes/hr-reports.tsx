import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileSpreadsheet,
  UserPlus,
  Users,
  CalendarX,
  FileText,
  Clock,
  UserX,
  Printer,
  Smartphone,
  BarChart3,
  CalendarDays,
  Coffee,
  Moon,
} from "lucide-react";

export const Route = createFileRoute("/hr-reports")({
  head: () => ({
    meta: [
      { title: "HR Reports — CRIPTON" },
      { name: "description", content: "Access and generate comprehensive HR reports." },
    ],
  }),
  component: HRReportsPage,
});

function HRReportsPage() {
  const sections = [
    {
      title: "Employee & Onboarding Reports",
      description: "Track employee headcount, new hires, and SIM requisitions.",
      icon: Users,
      items: [
        {
          title: "New Joining Info",
          icon: UserPlus,
          desc: "Detailed report of newly onboarded employees and joining dates.",
          to: "/hr-report-new-joining-info",
        },
        {
          title: "Separation List",
          icon: UserMinus,
          desc: "Detailed report of separated employees.",
          to: "/hr-report-separation-list",
        },
        {
          title: "Employee Count",
          icon: Users,
          desc: "Headcount breakdown by department, designation, and unit.",
          to: "/hr-report-employee-count",
        },
        {
          title: "SIM Requisition Report",
          icon: Smartphone,
          desc: "Status and history of company SIM card requisitions.",
          to: "/hr-report-sim-requisition",
        },
      ],
    },
    {
      title: "Attendance & Absence Reports",
      description: "Monitor daily attendance records, monthly trends, and absenteeism.",
      icon: Clock,
      items: [
        {
          title: "Daily Attendance Report",
          icon: Clock,
          desc: "Daily log of employee check-ins, check-outs, and late arrivals.",
          to: "/hr-report-daily-attendance",
        },
        {
          title: "Monthly Attendance Report",
          icon: CalendarDays,
          desc: "Monthly consolidated attendance and working day summary.",
          to: "/hr-report-monthly-attendance",
        },
        {
          title: "Absenteeism Summary",
          icon: UserX,
          desc: "Overview of unexcused absences and attendance compliance.",
          to: "/hr-report-absenteeism-summary",
        },
        {
          title: "Continuous Absent",
          icon: UserX,
          desc: "Report on employees absent continuously beyond policy limits.",
          to: "/hr-report-continuous-absent",
        },
        {
          title: "Night Card",
          icon: Moon,
          desc: "Detailed individual night shift record and net pay overview.",
          to: "/hr-report-night-card",
        },
        {
          title: "Tiffin Card",
          icon: Coffee,
          desc: "Detailed individual tiffin duty record and net pay overview.",
          to: "/hr-report-tiffin-card",
        },
      ],
    },
    {
      title: "Leave & Overtime Reports",
      description: "Manage employee leave summaries, active leave, and OT requisitions.",
      icon: CalendarX,
      items: [
        {
          title: "Leave Summary",
          icon: CalendarX,
          desc: "Summary of taken, remaining, and allocated leave balances.",
          to: "/hr-report-leave-summary",
        },
        {
          title: "Leave",
          icon: FileText,
          desc: "Detailed report of individual and department leave records.",
          to: "/hr-report-leave-details",
        },
        {
          title: "Overtime Summary",
          icon: BarChart3,
          desc: "Total overtime hours and cost distribution summary.",
          to: "/hr-report-overtime-summary",
        },
        {
          title: "Print OT Requisition",
          icon: Printer,
          desc: "Print approved overtime requisitions and slips.",
          to: "#",
        },
        {
          title: "Tiffin Allowance All",
          icon: Coffee,
          desc: "Detailed report of tiffin allowances and net payable amounts.",
          to: "/hr-report-tiffin-allowance-all",
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
            <span>HR</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">HR Reports</span>
          </div>

          {/* Page Header */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                    <FileSpreadsheet className="size-5" />
                  </div>
                  HR Reports Hub
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Centralized reporting hub for new joinings, employee headcounts, leave metrics,
                  daily/monthly attendance logs, overtime summaries, and requisitions.
                </p>
              </div>
              <div className="shrink-0">
                <div className="text-xs font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
                  Active Period:{" "}
                  <span className="text-foreground font-semibold">September 2026</span>
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
