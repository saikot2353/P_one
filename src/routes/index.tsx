import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { StatCards } from "@/components/dashboard/StatCards";
import {
  HeadcountChart, DepartmentChart, AttendanceChart, GoalsRadial,
} from "@/components/dashboard/Charts";
import {
  LeaveRequests, UpcomingEvents, RecruitmentPipeline,
} from "@/components/dashboard/Panels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CRIPTON HRIS — Workforce Intelligence Dashboard" },
      { name: "description", content: "A modern HR command center: headcount, attendance, payroll, and recruitment analytics in one place." },
      { property: "og:title", content: "CRIPTON HRIS — Workforce Intelligence Dashboard" },
      { property: "og:description", content: "Professional HR dashboard with charts, approvals, and recruitment pipelines." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="p-6 space-y-6">
          <StatCards />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <HeadcountChart />
            <DepartmentChart />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <AttendanceChart />
            <GoalsRadial />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <LeaveRequests />
            <UpcomingEvents />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <RecruitmentPipeline />
          </div>
          <footer className="pt-4 pb-2 text-center text-xs text-muted-foreground">
            © 2026 CRIPTON HRIS — crafted for modern people teams.
          </footer>
        </div>
      </main>
    </div>
  );
}
