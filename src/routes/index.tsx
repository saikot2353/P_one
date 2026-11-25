import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { DailyQuickStats } from "@/components/dashboard/DailyQuickStats";
import {
  HeadcountChart,
  DepartmentChart,
  AttendanceChart,
  GoalsRadial,
  TodayAttendancePie,
  TodayLateAbsentPie,
  DateWiseOTBar,
} from "@/components/dashboard/Charts";
import { LeaveRequests, UpcomingEvents, RecruitmentPipeline, RecentMessages } from "@/components/dashboard/Panels";
import {
  DashboardTemplate,
  loadDashboardTemplates,
  getActiveDashboardTemplateId,
  WidgetColSpan,
  DASHBOARD_COMPONENTS_CATALOG,
} from "@/components/dashboard-maker/dashboard-maker-types";
import { DashboardWidgetRenderer } from "@/components/dashboard-maker/DashboardWidgetRenderer";
import { Sparkles, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CRIPTON HRIS — Workforce Intelligence Dashboard" },
      {
        name: "description",
        content:
          "A modern HR command center: headcount, attendance, payroll, and recruitment analytics in one place.",
      },
      { property: "og:title", content: "CRIPTON HRIS — Workforce Intelligence Dashboard" },
      {
        property: "og:description",
        content: "Professional HR dashboard with charts, approvals, and recruitment pipelines.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("standard_hris");

  useEffect(() => {
    const list = loadDashboardTemplates();
    setTemplates(list);
    const activeId = getActiveDashboardTemplateId();
    if (activeId && list.some((t) => t.id === activeId)) {
      setSelectedTemplateId(activeId);
    }
  }, []);

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="p-3.5 md:p-4.5 lg:p-5 space-y-4 lg:space-y-5">
          {/* Active Template Switcher Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border/60 rounded-2xl p-3 px-4 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Active Dashboard:</span>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="h-8 px-2.5 rounded-lg border border-border/70 bg-background font-bold text-xs text-foreground cursor-pointer outline-none focus:border-primary"
                >
                  <option value="standard_hris">Standard HRIS Dashboard (Factory Default)</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.title} ({tpl.widgets.length} Widgets) {tpl.isActiveMain ? "★ Main" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard-maker"
                className="h-8 px-3.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="size-3.5" />
                Customize in Dashboard Maker
              </Link>
            </div>
          </div>

          {/* RENDER CUSTOM TEMPLATE IF SELECTED (OTHER THAN STANDARD) */}
          {selectedTemplateId !== "standard_hris" && activeTemplate ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div>
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    {activeTemplate.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{activeTemplate.description}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeTemplate.modules.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wider"
                    >
                      {m === "merchandising" ? "MM" : m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3.5 lg:gap-4.5">
                {activeTemplate.widgets.map((widget) => {
                  const def = DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === widget.componentId);
                  const minSpan = def?.minColSpan || 3;
                  const effectiveSpan = Math.max(widget.colSpan, minSpan) as WidgetColSpan;
                  const spanClass = getGridColSpanClass(effectiveSpan);
                  return (
                    <div key={widget.id} className={spanClass}>
                      <DashboardWidgetRenderer widget={{ ...widget, colSpan: effectiveSpan }} />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Key Metrics Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5 mb-2">
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                      Daily Quick Stats
                    </h2>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">
                      Real-time operational metrics for today
                    </p>
                  </div>
                </div>
                <DailyQuickStats />
              </div>

              {/* Analytics & Performance Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                      Today's Presence & Overtime
                    </h2>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">
                      Daily attendance statuses and overtime payouts
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 lg:gap-4.5">
                  <TodayAttendancePie />
                  <TodayLateAbsentPie />
                  <RecentMessages />
                </div>
                <div className="mt-3.5 lg:mt-4.5">
                  <DateWiseOTBar />
                </div>
              </div>

              {/* Historical Overview Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                      Historical Overview
                    </h2>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">
                      Headcount cycles, department allocation splits, and attendance schedules
                    </p>
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
                    <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                      Operations & Logistics
                    </h2>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-semibold">
                      Request approvals, milestone tracking, and active recruitment pipelines
                    </p>
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
            </>
          )}

          <footer className="pt-3 pb-1 text-center text-[10px] font-medium text-muted-foreground/60 border-t border-border/20">
            © 2026 CRIPTON HRIS — crafted with care for modern people teams.
          </footer>
        </div>
      </main>
    </div>
  );
}

function getGridColSpanClass(span: WidgetColSpan): string {
  switch (span) {
    case 12:
      return "col-span-12";
    case 8:
      return "col-span-12 lg:col-span-8";
    case 6:
      return "col-span-12 lg:col-span-6";
    case 4:
      return "col-span-12 sm:col-span-6 lg:col-span-4";
    case 3:
      return "col-span-12 sm:col-span-6 lg:col-span-3";
    default:
      return "col-span-12 lg:col-span-6";
  }
}

