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
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="p-4 md:p-6 xl:p-8 space-y-6 lg:space-y-8">
          {/* Key Metrics Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Workspace Indicators</h2>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">Real-time operational overview metrics</p>
              </div>
            </div>
            <StatCards />
          </div>

          {/* Analytics & Performance Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Overview & Analytics</h2>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">Headcount cycles, department allocation splits, and attendance schedules</p>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              <HeadcountChart />
              <DepartmentChart />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              <AttendanceChart />
              <GoalsRadial />
            </div>
          </div>

          {/* Operations & Recruitment Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Operations & Logistics</h2>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">Request approvals, milestone tracking, and active recruitment pipelines</p>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              <LeaveRequests />
              <UpcomingEvents />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              <RecruitmentPipeline />
            </div>
          </div>

          <footer className="pt-4 pb-2 text-center text-[10px] font-medium text-muted-foreground/60 border-t border-border/30">
            © 2026 CRIPTON HRIS — crafted with care for modern people teams.
          </footer>
        </div>
      </main>
    </div>
  );
}
