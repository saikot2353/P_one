import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, BarChart3, TrendingUp, Users, Target, Activity, Award, Star
} from "lucide-react";
import { loadAssessments, loadKpiCycles, loadGradeBands } from "@/lib/kpi-data";

export const Route = createFileRoute("/kpi-dashboard")({
  head: () => ({
    meta: [
      { title: "KPI Dashboard — CRIPTON" },
      { name: "description", content: "Organization-wide KPI analytics and performance overview." },
    ],
  }),
  component: KpiDashboardPage,
});

function KpiDashboardPage() {
  const [cycles] = useState(() => loadKpiCycles());
  const [assessments] = useState(() => loadAssessments());
  const [bands] = useState(() => loadGradeBands());

  const [activeCycle, setActiveCycle] = useState(cycles[0]?.id || "");

  // Analytics for active cycle
  const cycleAssessments = useMemo(() => assessments.filter(a => a.cycleId === activeCycle), [assessments, activeCycle]);
  
  const completedAssessments = cycleAssessments.filter(a => a.status === "Completed");
  
  const avgScore = completedAssessments.length > 0 
    ? Math.round(completedAssessments.reduce((sum, a) => sum + a.totalWeightedScore, 0) / completedAssessments.length)
    : 0;

  const topPerformers = useMemo(() => {
    return [...completedAssessments]
      .sort((a, b) => b.totalWeightedScore - a.totalWeightedScore)
      .slice(0, 5);
  }, [completedAssessments]);

  // Grade Distribution
  const gradeDistribution = useMemo(() => {
    const dist: Record<string, { count: number, color: string }> = {};
    bands.forEach(b => {
      dist[b.grade] = { count: 0, color: b.color };
    });
    completedAssessments.forEach(a => {
      if (dist[a.gradeResult]) {
        dist[a.gradeResult].count++;
      }
    });
    return dist;
  }, [completedAssessments, bands]);

  // Department Performance
  const deptPerformance = useMemo(() => {
    const depts: Record<string, { count: number, totalScore: number }> = {};
    completedAssessments.forEach(a => {
      if (!depts[a.department]) depts[a.department] = { count: 0, totalScore: 0 };
      depts[a.department].count++;
      depts[a.department].totalScore += a.totalWeightedScore;
    });
    return Object.entries(depts).map(([dept, data]) => ({
      department: dept,
      avgScore: Math.round(data.totalScore / data.count)
    })).sort((a, b) => b.avgScore - a.avgScore);
  }, [completedAssessments]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">

          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">KPI</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Dashboard</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <BarChart3 className="size-5.5 text-primary" />
                <span>Performance Analytics Dashboard</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Cycle:</span>
              <select 
                value={activeCycle}
                onChange={(e) => setActiveCycle(e.target.value)}
                className="h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5] min-w-48"
              >
                {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="size-16" />
              </div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block mb-1">Total Assessments</span>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-foreground">{cycleAssessments.length}</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500">
                <Target className="size-16" />
              </div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block mb-1">Completed</span>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-emerald-500">{completedAssessments.length}</span>
                <span className="text-xs font-bold text-muted-foreground mb-1.5">/ {cycleAssessments.length}</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#1e88e5]">
                <Activity className="size-16" />
              </div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block mb-1">Average Score</span>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-[#1e88e5]">{avgScore}%</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-amber-500">
                <TrendingUp className="size-16" />
              </div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block mb-1">Top Performers (A+)</span>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-amber-500">{gradeDistribution["A+"]?.count || 0}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Grade Distribution Bar Chart */}
            <div className="bg-card rounded-xl border border-border/80 shadow-xs flex flex-col">
              <div className="p-5 border-b border-border/30">
                <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                  <BarChart3 className="size-4 text-primary" />
                  Grade Distribution
                </h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-end gap-2 h-64">
                <div className="flex items-end h-full gap-2 mt-auto">
                  {Object.entries(gradeDistribution).map(([grade, data]) => {
                    const height = completedAssessments.length > 0 
                      ? Math.max(5, (data.count / completedAssessments.length) * 100) 
                      : 0;
                    return (
                      <div key={grade} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.count}
                        </div>
                        <div 
                          className="w-full rounded-t-sm transition-all duration-500 hover:brightness-110"
                          style={{ height: `${height}%`, backgroundColor: data.color }}
                        />
                        <span className="text-[10px] font-black text-foreground">{grade}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-card rounded-xl border border-border/80 shadow-xs flex flex-col">
              <div className="p-5 border-b border-border/30">
                <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                  <Award className="size-4 text-amber-500" />
                  Top Performers
                </h3>
              </div>
              <div className="p-0">
                <div className="divide-y divide-border/20">
                  {topPerformers.map((emp, idx) => (
                    <div key={emp.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition">
                      <div className="size-8 rounded-full bg-amber-500/10 text-amber-600 grid place-items-center font-black text-xs">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-foreground truncate">{emp.employeeName}</h4>
                        <span className="text-[10px] font-bold text-muted-foreground truncate block">{emp.designation} • {emp.department}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-foreground">{emp.totalWeightedScore}%</span>
                        <span className="text-[10px] font-black block" style={{ color: bands.find(b => b.grade === emp.gradeResult)?.color }}>
                          {emp.gradeResult}
                        </span>
                      </div>
                    </div>
                  ))}
                  {topPerformers.length === 0 && (
                    <div className="p-8 text-center text-xs font-bold text-muted-foreground">
                      No completed assessments yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Department Performance */}
            <div className="bg-card rounded-xl border border-border/80 shadow-xs flex flex-col lg:col-span-2">
              <div className="p-5 border-b border-border/30">
                <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                  <Star className="size-4 text-[#1e88e5]" />
                  Department Average Scores
                </h3>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {deptPerformance.map((dept) => (
                    <div key={dept.department} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-foreground">{dept.department}</span>
                        <span className="text-[#1e88e5]">{dept.avgScore}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                        <div 
                          className="h-full bg-[#1e88e5] rounded-full transition-all duration-1000"
                          style={{ width: `${dept.avgScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {deptPerformance.length === 0 && (
                    <div className="text-center text-xs font-bold text-muted-foreground">
                      No data available.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
