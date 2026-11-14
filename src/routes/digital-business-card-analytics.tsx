import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DigitalBusinessCardSidebar } from "@/components/dashboard/DigitalBusinessCardSidebar";
import {
  BarChart3,
  Calendar,
  Users,
  Eye,
  TrendingUp,
  CreditCard,
  Building2,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  getCardByEmployeeId,
  getCardAnalytics,
  getAdminAggregateAnalytics,
  getHrisEmployee,
  getPublicCardUrl,
  DigitalBusinessCard,
  CardAnalyticsRecord,
} from "@/lib/digital-business-card-service";
import { employeesData } from "@/routes/personnel-list";

export const Route = createFileRoute("/digital-business-card-analytics")({
  head: () => ({
    meta: [
      { title: "Card Analytics — Digital Business Card" },
      {
        name: "description",
        content:
          "Track public engagement, view counts, and engagement traffic for digital business cards.",
      },
    ],
  }),
  component: CardAnalyticsPage,
});

function CardAnalyticsPage() {
  const [currentUser, setCurrentUser] = useState<{
    role?: string;
    name?: string;
    [key: string]: unknown;
  } | null>(null);
  const [currentEmpId, setCurrentEmpId] = useState<string>("2023043910");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [card, setCard] = useState<DigitalBusinessCard | null>(null);
  const [analytics, setAnalytics] = useState<CardAnalyticsRecord | null>(null);

  // Companies list for admin filter
  const companies = useMemo(() => {
    const list = new Set<string>();
    employeesData.forEach((e) => {
      if (e.unit) list.add(e.unit);
    });
    return ["ALL", ...Array.from(list)];
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_current_user");
        if (stored) {
          const user = JSON.parse(stored);
          setCurrentUser(user);
          if (user.empId || user.userId) {
            setCurrentEmpId(user.empId || user.userId);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const c = getCardByEmployeeId(currentEmpId);
    setCard(c);
    if (c) {
      setAnalytics(getCardAnalytics(c.publicToken));
    }
  }, [currentEmpId]);

  const hrisEmp = getHrisEmployee(currentEmpId) || employeesData[0];
  const aggregateAnalytics = useMemo(() => {
    return getAdminAggregateAnalytics(selectedCompany);
  }, [selectedCompany]);

  const publicUrl = card ? getPublicCardUrl(card.publicToken) : "";
  const isAdmin = currentUser?.role?.toString().toLowerCase() === "admin" || !currentUser; // Default true in prototype for testing

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <DigitalBusinessCardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <BarChart3 className="size-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Business Card Analytics
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Privacy-conscious traffic analytics measuring public digital business card views and
                engagement.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/my-digital-business-card"
                className="h-9 px-3 rounded-xl border border-border hover:bg-muted text-xs font-bold transition flex items-center gap-1.5"
              >
                <CreditCard className="size-3.5" />
                <span>My Card</span>
              </Link>

              <Link
                to="/share-my-card"
                className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition flex items-center gap-1.5 shadow-xs hover:bg-primary/90"
              >
                <span>Share Card</span>
              </Link>
            </div>
          </div>

          {/* Section 1: Personal Card Analytics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Personal Card Metrics
                </span>
                <span className="text-xs font-bold text-foreground">— {hrisEmp.name}</span>
              </div>

              {/* Employee selector */}
              <div className="flex items-center gap-1.5 bg-card border border-border px-2 rounded-lg h-8">
                <span className="text-[11px] text-muted-foreground font-medium">Switch:</span>
                <select
                  value={currentEmpId}
                  onChange={(e) => setCurrentEmpId(e.target.value)}
                  className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                >
                  {employeesData.slice(0, 10).map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Eye className="size-3 text-indigo-500" />
                  Total Page Loads
                </span>
                <div className="text-3xl font-extrabold text-foreground">
                  {analytics?.totalViews || 0}
                </div>
                <p className="text-[11px] text-muted-foreground">Successful visits</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="size-3 text-emerald-500" />
                  This Month
                </span>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {(() => {
                    const now = new Date();
                    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
                    return analytics?.monthlyViews[thisMonth] || 0;
                  })()}
                </div>
                <p className="text-[11px] text-muted-foreground">Current calendar month</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Clock className="size-3 text-purple-500" />
                  Last Viewed At
                </span>
                <div className="text-sm font-bold text-foreground mt-2 truncate">
                  {analytics?.lastViewedAt
                    ? new Date(analytics.lastViewedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "No views recorded yet"}
                </div>
                <p className="text-[11px] text-muted-foreground">Recent visitor timestamp</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <CreditCard className="size-3 text-sky-500" />
                  Card Status
                </span>
                <div className="mt-2">
                  {card?.adminDisabled ? (
                    <span className="text-rose-500 font-bold text-sm">Locked by Admin</span>
                  ) : card?.employeePublished ? (
                    <span className="text-emerald-500 font-bold text-sm flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live & Public
                    </span>
                  ) : (
                    <span className="text-amber-500 font-bold text-sm">Unpublished (Draft)</span>
                  )}
                </div>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold pt-1"
                >
                  <span>Open Public Card</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>

            {/* Daily History Box */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Daily Load Breakdown (Last 7 Days)
              </h4>

              {analytics && Object.keys(analytics.dailyViews).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {Object.entries(analytics.dailyViews)
                    .slice(-7)
                    .map(([date, count]) => (
                      <div
                        key={date}
                        className="p-3 rounded-xl bg-muted/30 border border-border/60 text-center space-y-1"
                      >
                        <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                          <Calendar className="size-3" />
                          <span>{date.slice(5)}</span>
                        </div>
                        <div className="text-base font-extrabold text-foreground font-mono">
                          {count}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No view history recorded yet. Open or scan the QR code to record view metrics.
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Organization-Wide Aggregate Analytics (Admin View) */}
          {isAdmin && (
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Shield className="size-4 text-purple-500" />
                    <span>Company-Wide Aggregate Engagement (Admin)</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Consolidated performance across all registered employee digital business cards.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 rounded-xl h-9">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                    >
                      {companies.map((c) => (
                        <option key={c} value={c}>
                          {c === "ALL" ? "All Companies" : c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Link
                    to="/digital-business-cards-admin"
                    className="h-9 px-3 rounded-xl border border-border hover:bg-muted text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Manage All Cards</span>
                  </Link>
                </div>
              </div>

              {/* Company Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Total Registered Cards
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {aggregateAnalytics.totalCards}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Published & Active
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {aggregateAnalytics.publishedCards}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Admin Locked
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                    {aggregateAnalytics.adminDisabledCards}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Total Org Page Views
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {aggregateAnalytics.totalViews}
                  </div>
                </div>
              </div>

              {/* Top Cards Table */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-border bg-muted/20">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Top Visited Employee Cards
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase">
                        <th className="py-2.5 px-4">Employee</th>
                        <th className="py-2.5 px-4">Company</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {aggregateAnalytics.topCards
                        .slice(0, 8)
                        .map(({ card: c, employee, views }) => (
                          <tr key={c.id} className="hover:bg-muted/30">
                            <td className="py-2.5 px-4 font-bold text-foreground">
                              {employee?.name || c.employeeId}
                            </td>
                            <td className="py-2.5 px-4 text-muted-foreground">
                              {employee?.unit || "Pakiza Software"}
                            </td>
                            <td className="py-2.5 px-4">
                              {c.adminDisabled ? (
                                <span className="text-rose-500 font-bold">Locked</span>
                              ) : c.employeePublished ? (
                                <span className="text-emerald-500 font-bold">Live</span>
                              ) : (
                                <span className="text-amber-500 font-bold">Unpublished</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono font-bold text-primary">
                              {views}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
