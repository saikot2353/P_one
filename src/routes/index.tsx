import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { DailyQuickStats } from "@/components/dashboard/DailyQuickStats";
import {
  HeadcountChart, DepartmentChart, AttendanceChart, GoalsRadial,
  TodayAttendancePie, TodayLateAbsentPie, DateWiseOTBar
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
        <div className="p-3.5 md:p-4.5 lg:p-5 space-y-4 lg:space-y-5">
          {/* Key Metrics Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5 mb-2">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Daily Quick Stats</h2>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">Real-time operational metrics for today</p>
              </div>
            </div>
            <DailyQuickStats />
          </div>

          {/* Analytics & Performance Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Today's Presence & Overtime</h2>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">Daily attendance statuses and overtime payouts</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 lg:gap-4.5">
              <TodayAttendancePie />
              <TodayLateAbsentPie />
            </div>
            <div className="mt-3.5 lg:mt-4.5">
              <DateWiseOTBar />
            </div>
          </div>

          {/* Historical Overview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Historical Overview</h2>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">Headcount cycles, department allocation splits, and attendance schedules</p>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5 lg:gap-4.5">
              <HeadcountChart />
              <DepartmentChart />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5 lg:gap-4.5">
              <AttendanceChart />
              <GoalsRadial />
            </div>
          </div>

          {/* Operations & Recruitment Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Operations & Logistics</h2>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">Request approvals, milestone tracking, and active recruitment pipelines</p>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5 lg:gap-4.5">
              <LeaveRequests />
              <UpcomingEvents />
            </div>
            <div className="grid grid-cols-1 gap-3.5 lg:gap-4.5">
              <RecruitmentPipeline />
            </div>
          </div>

          <footer className="pt-3 pb-1 text-center text-[10px] font-medium text-muted-foreground/60 border-t border-border/20">
            © 2026 CRIPTON HRIS — crafted with care for modern people teams.
          </footer>
        </div>
      </main>
    </div>
  );
}
