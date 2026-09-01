import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Activity,
  Award,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  DollarSign,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  Layers,
  Building2,
  Printer,
  Zap,
  PieChart,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import { loadAssessments, loadKpiCycles, loadGradeBands } from "@/lib/kpi-data";

export const Route = createFileRoute("/kpi-dashboard")({
  head: () => ({
    meta: [
      { title: "KPI Analytics & Performance Dashboard — CRIPTON HRIS" },
      {
        name: "description",
        content: "Comprehensive KPI Performance Analytics, Department Metrics & Multi-Layer Appraisal Tracker.",
      },
    ],
  }),
  component: KpiDashboardPage,
});

// Expanded Mock Performance Data for Dashboard Richness
interface DashboardEmployee {
  empId: string;
  name: string;
  photoUrl: string;
  designation: string;
  department: string;
  kpiScore: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "E";
  status: "Completed" | "HOD Review" | "HRD Review" | "Plant Head" | "MD Sign-off";
  currentSalary: number;
  proposedIncrement: number;
  effectiveMonth: string;
  completedDate: string;
}

const mockEmployeeAppraisals: DashboardEmployee[] = [
  {
    empId: "2019013884",
    name: "Javed Mia",
    photoUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg",
    designation: "Helper (Cook)",
    department: "Admin",
    kpiScore: 78,
    grade: "B",
    status: "MD Sign-off",
    currentSalary: 21200,
    proposedIncrement: 1000,
    effectiveMonth: "Jan 2026",
    completedDate: "01/01/2026",
  },
  {
    empId: "2022120145",
    name: "Khairul Bashar Masum",
    photoUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg",
    designation: "Asst. Manager",
    department: "HR Team",
    kpiScore: 83,
    grade: "A",
    status: "Completed",
    currentSalary: 46500,
    proposedIncrement: 4000,
    effectiveMonth: "Jan 2026",
    completedDate: "28/12/2025",
  },
  {
    empId: "2023080012",
    name: "Tariqul Islam",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    designation: "Sr. Software Engineer",
    department: "Software & Tech",
    kpiScore: 94,
    grade: "A+",
    status: "Completed",
    currentSalary: 85000,
    proposedIncrement: 7500,
    effectiveMonth: "Jan 2026",
    completedDate: "29/12/2025",
  },
  {
    empId: "2021051290",
    name: "Sabrina Akter",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    designation: "Executive Merchandiser",
    department: "Commercial & Merchandising",
    kpiScore: 88,
    grade: "A",
    status: "Plant Head",
    currentSalary: 52000,
    proposedIncrement: 4500,
    effectiveMonth: "Jan 2026",
    completedDate: "30/12/2025",
  },
  {
    empId: "2020034411",
    name: "Md. Rafiqul Islam",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    designation: "Quality Assurance Lead",
    department: "Production & Quality",
    kpiScore: 91,
    grade: "A+",
    status: "Completed",
    currentSalary: 62000,
    proposedIncrement: 5500,
    effectiveMonth: "Jan 2026",
    completedDate: "27/12/2025",
  },
  {
    empId: "2024010992",
    name: "Farhana Yasmin",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    designation: "Accounts Officer",
    department: "Accounts & Finance",
    kpiScore: 74,
    grade: "B",
    status: "HRD Review",
    currentSalary: 38000,
    proposedIncrement: 2500,
    effectiveMonth: "Jan 2026",
    completedDate: "02/01/2026",
  },
  {
    empId: "2018045610",
    name: "Anowar Hossain",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    designation: "Supply Chain Manager",
    department: "Supply Chain",
    kpiScore: 89,
    grade: "A",
    status: "Completed",
    currentSalary: 95000,
    proposedIncrement: 8000,
    effectiveMonth: "Jan 2026",
    completedDate: "26/12/2025",
  },
];

const departmentAnalytics = [
  { dept: "Software & Tech", total: 42, completed: 40, avgScore: 89.4, grade: "A", incBudget: 185000, color: "#2563eb" },
  { dept: "Commercial & Merchandising", total: 85, completed: 81, avgScore: 85.2, grade: "A", incBudget: 340000, color: "#0d9488" },
  { dept: "HR & Admin", total: 38, completed: 36, avgScore: 82.6, grade: "A", incBudget: 145000, color: "#059669" },
  { dept: "Production & Quality", total: 210, completed: 195, avgScore: 79.8, grade: "B", incBudget: 620000, color: "#d97706" },
  { dept: "Accounts & Finance", total: 28, completed: 26, avgScore: 83.5, grade: "A", incBudget: 120000, color: "#7c3aed" },
  { dept: "Supply Chain", total: 45, completed: 42, avgScore: 86.1, grade: "A", incBudget: 195000, color: "#0284c7" },
];

function KpiDashboardPage() {
  const [cycles] = useState(() => loadKpiCycles());
  const [activeCycle, setActiveCycle] = useState(cycles[0]?.id || "2025-annual");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filteredAppraisals = useMemo(() => {
    return mockEmployeeAppraisals.filter((emp) => {
      if (selectedDept !== "ALL" && emp.department !== selectedDept) return false;
      if (selectedStatus !== "ALL" && emp.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          emp.empId.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedDept, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    const totalCount = mockEmployeeAppraisals.length;
    const completedCount = mockEmployeeAppraisals.filter((e) => e.status === "Completed").length;
    const pendingCount = totalCount - completedCount;
    const totalIncrementSum = mockEmployeeAppraisals.reduce((sum, e) => sum + e.proposedIncrement, 0);
    const avgScore = Math.round(
      mockEmployeeAppraisals.reduce((sum, e) => sum + e.kpiScore, 0) / totalCount,
    );

    const aPlusCount = mockEmployeeAppraisals.filter((e) => e.grade === "A+").length;
    const aCount = mockEmployeeAppraisals.filter((e) => e.grade === "A").length;
    const bCount = mockEmployeeAppraisals.filter((e) => e.grade === "B").length;
    const cCount = mockEmployeeAppraisals.filter((e) => e.grade === "C").length;

    return {
      totalCount,
      completedCount,
      pendingCount,
      totalIncrementSum,
      avgScore,
      aPlusCount,
      aCount,
      bCount,
      cCount,
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Executive Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Ambient Background Blur Graphics */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                  <Sparkles className="size-4 text-emerald-400 animate-pulse" />
                  <span>Performance Management System • Annual Evaluation 2025-2026</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3 font-sans">
                  <BarChart3 className="size-8 text-emerald-400" />
                  <span>KPI Performance & Executive Appraisal Dashboard</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed font-sans">
                  Real-time organization performance analytics, multi-layer evaluation approvals, grade distribution, and proposed salary increment budget metrics.
                </p>
              </div>

              {/* Action Buttons & Cycle Picker */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3 py-2 rounded-xl flex items-center gap-2">
                  <Clock className="size-4 text-emerald-400" />
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-bold text-slate-300 block leading-none">Evaluation Cycle</span>
                    <select
                      value={activeCycle}
                      onChange={(e) => setActiveCycle(e.target.value)}
                      className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pt-0.5"
                    >
                      {cycles.map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Link
                  to="/kpi-approval"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <ShieldCheck className="size-4" />
                  <span>KPI Approval Queue</span>
                </Link>

                <Link
                  to="/kpi-final-report"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all hover:scale-[1.02]"
                >
                  <Printer className="size-4 text-blue-300" />
                  <span>Assesment Final Report (A4)</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Key Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {/* Stat Card 1: Total Appraisals */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Evaluated Staff</span>
                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{stats.totalCount}</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="size-3.5" /> +100%
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Completed: <strong className="text-slate-800">{stats.completedCount}</strong></span>
                <span>Pending: <strong className="text-amber-600">{stats.pendingCount}</strong></span>
              </div>
            </div>

            {/* Stat Card 2: Average KPI Score */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Org KPI Score</span>
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Activity className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600">{stats.avgScore}%</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Grade B+</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Target: <strong className="text-slate-800">80.0%</strong></span>
                <span className="text-emerald-600 font-semibold">+2.4% above target</span>
              </div>
            </div>

            {/* Stat Card 3: Total Increment Budget */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proposed Inc. Budget</span>
                <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <DollarSign className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">৳{stats.totalIncrementSum.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Avg Inc: <strong className="text-slate-800">৳{Math.round(stats.totalIncrementSum / stats.totalCount).toLocaleString()}</strong></span>
                <span className="text-purple-600 font-semibold">Effective Jan 2026</span>
              </div>
            </div>

            {/* Stat Card 4: Top Performer (A+ Count) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Star Performers (A+)</span>
                <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Award className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-600">{stats.aPlusCount} Staff</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">90%+ Score</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Grade A (81-90): <strong className="text-slate-800">{stats.aCount}</strong></span>
                <span>Grade B (71-80): <strong className="text-slate-800">{stats.bCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Section 2: Performance Distribution & Multi-Layer Approval Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Grade Band Distribution */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <PieChart className="size-5 text-indigo-600" />
                    <span>Appraisal Grade Distribution</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Evaluation rating breakdown across official Grade Bands (A+ to E)</p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Total: {stats.totalCount}</span>
              </div>

              {/* Bar Chart Visual */}
              <div className="pt-6 pb-2 space-y-4 flex-1">
                {/* Grade A+ */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className="size-3 rounded-full bg-emerald-500" />
                      Grade A+ (91-100 Marks) • Outstanding
                    </span>
                    <span className="text-emerald-700 font-mono">{stats.aPlusCount} Staff ({Math.round((stats.aPlusCount / stats.totalCount) * 100)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700" style={{ width: `${(stats.aPlusCount / stats.totalCount) * 100}%` }} />
                  </div>
                </div>

                {/* Grade A */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className="size-3 rounded-full bg-blue-500" />
                      Grade A (81-90 Marks) • Excellent
                    </span>
                    <span className="text-blue-700 font-mono">{stats.aCount} Staff ({Math.round((stats.aCount / stats.totalCount) * 100)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700" style={{ width: `${(stats.aCount / stats.totalCount) * 100}%` }} />
                  </div>
                </div>

                {/* Grade B */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className="size-3 rounded-full bg-indigo-500" />
                      Grade B (71-80 Marks) • Very Good
                    </span>
                    <span className="text-indigo-700 font-mono">{stats.bCount} Staff ({Math.round((stats.bCount / stats.totalCount) * 100)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-700" style={{ width: `${(stats.bCount / stats.totalCount) * 100}%` }} />
                  </div>
                </div>

                {/* Grade C */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className="size-3 rounded-full bg-amber-500" />
                      Grade C (61-70 Marks) • Good
                    </span>
                    <span className="text-amber-700 font-mono">{stats.cCount} Staff ({Math.round((stats.cCount / stats.totalCount) * 100)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-700" style={{ width: `${(stats.cCount / stats.totalCount) * 100}%` }} />
                  </div>
                </div>

                {/* Grade D & E */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className="size-3 rounded-full bg-rose-500" />
                      Grade D & E (&lt;60 Marks) • Average & Probation Extension
                    </span>
                    <span className="text-rose-700 font-mono">0 Staff (0%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full transition-all duration-700" style={{ width: `0%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Workflow Funnel */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="size-5 text-emerald-600" />
                    <span>Multi-Layer Approval Pipeline</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Appraisal movement across approval authority layers</p>
                </div>
                <Link to="/kpi-approval" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  View Queue <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="pt-5 space-y-3 flex-1 flex flex-col justify-between">
                {/* Layer 1: HOD Review */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      L1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">HOD Department Head</h4>
                      <span className="text-[10px] text-slate-500">Initial Assessment & Recommendations</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">18 Appraisals</span>
                </div>

                {/* Layer 2: HRD Final Evaluation */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
                      L2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">HRD Final Evaluation</h4>
                      <span className="text-[10px] text-slate-500">Policy verification & Strength Analysis</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">14 Pending</span>
                </div>

                {/* Layer 3: Plant Head Approval */}
                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                      L3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Plant Head Approval</h4>
                      <span className="text-[10px] text-slate-500">Operation alignment & Salary adjustments</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">6 Pending</span>
                </div>

                {/* Layer 4: MD Final Sign-off */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      L4
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">MD Final Sign-off</h4>
                      <span className="text-[10px] text-slate-500">Final executive approval & execution</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">4 Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Department Performance Matrix & Top Performers Wall */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Department Performance Table */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="size-5 text-blue-600" />
                    <span>Department Performance & Budget Analytics</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Average KPI marks, completion rates, and proposed increment allocation per department</p>
                </div>
              </div>

              <div className="overflow-x-auto pt-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                      <th className="py-3 px-3">Department Name</th>
                      <th className="py-3 px-3 text-center">Evaluated Staff</th>
                      <th className="py-3 px-3 text-center">Avg KPI Score</th>
                      <th className="py-3 px-3 text-center">Overall Grade</th>
                      <th className="py-3 px-3 text-right">Proposed Inc. Budget</th>
                      <th className="py-3 px-3 text-center">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {departmentAnalytics.map((dept) => (
                      <tr key={dept.dept} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="size-2 rounded-full" style={{ backgroundColor: dept.color }} />
                          {dept.dept}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                          {dept.completed} / {dept.total}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                          {dept.avgScore}%
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            {dept.grade}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                          ৳{dept.incBudget.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2 w-28 mx-auto">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.round((dept.completed / dept.total) * 100)}%`,
                                  backgroundColor: dept.color,
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-600">
                              {Math.round((dept.completed / dept.total) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Star Performers Showcase Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Star className="size-5 text-amber-500 fill-amber-400" />
                  <span>Top Star Performers</span>
                </h2>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">A+ Ranked</span>
              </div>

              <div className="pt-4 space-y-3.5 flex-1 overflow-y-auto">
                {mockEmployeeAppraisals
                  .filter((e) => e.kpiScore >= 80)
                  .sort((a, b) => b.kpiScore - a.kpiScore)
                  .slice(0, 4)
                  .map((emp, idx) => (
                    <div key={emp.empId} className="p-3 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={emp.photoUrl} alt={emp.name} className="size-11 rounded-full object-cover border-2 border-amber-400 shadow-xs" />
                        <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] grid place-items-center shadow-xs">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{emp.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{emp.designation} • {emp.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Inc: +৳{emp.proposedIncrement.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold text-slate-900 font-mono">{emp.kpiScore}%</div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          Grade {emp.grade}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Section 4: Live Employee Appraisal Register Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="size-5 text-emerald-600" />
                  <span>Employee Performance Appraisal Register</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">List of evaluated employees with score breakdowns and printable A4 report actions</p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative min-w-56">
                  <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, ID, dept..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none cursor-pointer focus:border-emerald-500"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Admin">Admin</option>
                  <option value="HR Team">HR Team</option>
                  <option value="Software & Tech">Software & Tech</option>
                  <option value="Commercial & Merchandising">Commercial & Merchandising</option>
                  <option value="Production & Quality">Production & Quality</option>
                  <option value="Accounts & Finance">Accounts & Finance</option>
                  <option value="Supply Chain">Supply Chain</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none cursor-pointer focus:border-emerald-500"
                >
                  <option value="ALL">All Approval Status</option>
                  <option value="Completed">Completed</option>
                  <option value="HRD Review">HRD Review</option>
                  <option value="Plant Head">Plant Head</option>
                  <option value="MD Sign-off">MD Sign-off</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Employee</th>
                    <th className="py-3 px-3">Designation & Department</th>
                    <th className="py-3 px-3 text-center">KPI Mark</th>
                    <th className="py-3 px-3 text-center">Grade</th>
                    <th className="py-3 px-3 text-right">Current Salary</th>
                    <th className="py-3 px-3 text-right">Proposed Inc.</th>
                    <th className="py-3 px-3 text-center">Approval Stage</th>
                    <th className="py-3 px-3 text-center">A4 Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAppraisals.map((emp) => (
                    <tr key={emp.empId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img src={emp.photoUrl} alt={emp.name} className="size-9 rounded-full object-cover border border-slate-200" />
                          <div>
                            <div className="font-bold text-slate-900">{emp.name}</div>
                            <div className="text-[10px] font-mono text-slate-500">ID: {emp.empId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{emp.designation}</div>
                        <div className="text-[10px] text-slate-500">{emp.department}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 text-sm">
                        {emp.kpiScore}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                          emp.grade === "A+" ? "bg-amber-100 text-amber-900 border border-amber-300" :
                          emp.grade === "A" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                          "bg-blue-100 text-blue-800 border border-blue-300"
                        }`}>
                          {emp.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        ৳{emp.currentSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                        +৳{emp.proposedIncrement.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          emp.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                          emp.status === "MD Sign-off" ? "bg-purple-100 text-purple-800" :
                          "bg-amber-100 text-amber-900"
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Link
                          to="/kpi-final-report"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-xs"
                        >
                          <Printer className="size-3.5 text-emerald-400" />
                          View A4
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

