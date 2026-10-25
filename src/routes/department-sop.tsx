import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Network,
  Users,
  Building2,
  GitFork,
  Search,
  ShieldCheck,
  FileSpreadsheet,
  Printer,
  ZoomIn,
  ZoomOut,
  Database,
  Cpu,
  TrendingUp,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/department-sop")({
  head: () => ({
    meta: [
      { title: "Department SOP & Organogram — CRIPTON HRIS" },
      { name: "description", content: "Department SOP, hierarchy tree, and reporting organogram." },
    ],
  }),
  component: DepartmentSOPPage,
});

export interface PersonnelItem {
  id: string;
  sl: string;
  name: string;
  department: string;
  reporting: string;
}

export function DepartmentSOPPage() {
  const [activeTab, setActiveTab] = useState<"organogram" | "departments" | "table" | "sop">("organogram");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [zoomScale, setZoomScale] = useState<number>(100);

  const handlePrint = () => {
    window.print();
  };

  // Master Personnel Data (All 58 rows from source with exact spelling)
  const allPersonnel: PersonnelItem[] = useMemo(() => [
    { id: "EMP-01", sl: "43", name: "Mohammad Methoun Ahmed", department: "Tech & Engineering", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-02", sl: "38", name: "Md. Mahfuzur Rahman", department: "Implementation & Business Analysis", reporting: "Mohammad Tareq Safa" },
    { id: "EMP-03", sl: "39", name: "Zakir Hossain", department: "Implementation & Business Analysis", reporting: "Mohammad Tareq Safa" },
    { id: "EMP-04", sl: "40", name: "Dipan Kumar Kundu", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-05", sl: "41", name: "Sunit Corneleous Sarker", department: "Tech & Engineering", reporting: "Mohammad Tareq Safa" },
    { id: "EMP-06", sl: "42", name: "Dipon Saha", department: "Tech & Engineering", reporting: "Mohammad Tareq Safa" },
    { id: "EMP-07", sl: "12", name: "Md. Maruf Hossen", department: "Business Development", reporting: "SK. Nasif Wahid" },
    { id: "EMP-08", sl: "13", name: "Md. Shahinur Alahi Khan", department: "Business Development", reporting: "SK. Nasif Wahid" },
    { id: "EMP-09", sl: "14", name: "Miraz Uddin", department: "Business Development", reporting: "SK. Nasif Wahid" },
    { id: "EMP-10", sl: "15", name: "Md. Ashanur Kabir", department: "Business Development", reporting: "SK. Nasif Wahid" },
    { id: "EMP-11", sl: "16", name: "Tanver Rahman Shaon", department: "Business Development", reporting: "SK. Nasif Wahid" },
    { id: "EMP-12", sl: "21", name: "Allama Bakhtiyar Nafis", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-13", sl: "22", name: "Shahadath Hossain Tamim", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-14", sl: "23", name: "Parvej Mahmud", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-15", sl: "24", name: "Md. Sadmanur Islam Shishir", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-16", sl: "25", name: "Md Mahir Shahriyar", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-17", sl: "26", name: "Tahmid Afsar", department: "Tech & Engineering", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-18", sl: "27", name: "Hanif Uddin", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-19", sl: "28", name: "Md. Akash Sheikh", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-20", sl: "29", name: "Al Riyad Karim", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-21", sl: "30", name: "Mir Md Moshiu Islam", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-22", sl: "31", name: "Md. Anik Islam", department: "Tech & Engineering", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-23", sl: "32", name: "Muksitul Islam", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-24", sl: "33", name: "Md Robayet Hasan Yeasin", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-25", sl: "34", name: "Md. Shahid Hasan", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-26", sl: "35", name: "Md. Piyash Hasan", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-27", sl: "36", name: "Md Maimoon Hossain Shomoy", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-28", sl: "37", name: "Raihan Jami Khan", department: "Tech & Engineering", reporting: "Md. Anik Islam" },
    { id: "EMP-29", sl: "44", name: "S.M Rakib Rahman Tuhin", department: "Tech & Engineering", reporting: "Sumaya" },
    { id: "EMP-30", sl: "45", name: "Md Jahid Hasan Polok", department: "Tech & Engineering", reporting: "Mahfujul" },
    { id: "EMP-31", sl: "46", name: "Md. Rana Miah", department: "Tech & Engineering", reporting: "Anwar" },
    { id: "EMP-32", sl: "47", name: "Md. Mahfujul Haque", department: "Tech & Engineering", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-33", sl: "48", name: "Md. Rafsan Kabir", department: "Tech & Engineering", reporting: "Mahfujul" },
    { id: "EMP-34", sl: "49", name: "Md. Al Amin", department: "Tech & Engineering", reporting: "Sumaya" },
    { id: "EMP-35", sl: "50", name: "Sumaya Siddika", department: "Tech & Engineering", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-36", sl: "51", name: "Md Johirul Islam", department: "Tech & Engineering", reporting: "Anwar" },
    { id: "EMP-37", sl: "53", name: "Md. Anwar Hossain", department: "Tech & Engineering", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-38", sl: "55", name: "Md Rahat Hossain", department: "Database Administrator (DBA)", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-39", sl: "2", name: "Masud Rana", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-40", sl: "6", name: "Istiak Ahmed", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-41", sl: "7", name: "Jannatul Maowa", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-42", sl: "8", name: "Easin Mia", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-43", sl: "9", name: "Javed Mia", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-44", sl: "10", name: "Sohanur Rahman Sohan", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-45", sl: "11", name: "Md. Sakil", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-46", sl: "54", name: "Kaikobad Howlader", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-47", sl: "56", name: "Md. Monjur Alam", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-48", sl: "57", name: "Asif Hossain", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-49", sl: "58", name: "Sabbir Hossen Babu", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-50", sl: "59", name: "Hasnain", department: "HR, Admin and Compliance", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-51", sl: "1", name: "MD. HASANUR RAHMAN", department: "Implementation & Business Analysis", reporting: "Mohammad Tareq Safa" },
    { id: "EMP-52", sl: "3", name: "Ruhul Amin", department: "Implementation & Business Analysis", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-53", sl: "4", name: "SALMAN RAHMAN", department: "Implementation & Business Analysis", reporting: "Mohammad Tareq Safa" },
    { id: "EMP-54", sl: "5", name: "Md. Jahidul Islam", department: "Implementation & Business Analysis", reporting: "Mohammad Tareq Safa" },
    { id: "EMP-55", sl: "17", name: "Irfan Hossain", department: "Implementation & Business Analysis", reporting: "Mohammad Tareq Safa" },
    { id: "EMP-56", sl: "20", name: "Riazul Islam", department: "Implementation & Business Analysis", reporting: "Rajebul Hasan Rajon" },
    { id: "EMP-57", sl: "—", name: "SK. Nasif Wahid", department: "Business Development", reporting: "Rakibul Islam Khan" },
    { id: "EMP-58", sl: "—", name: "Mohammad Tareq Safa", department: "MIS", reporting: "Rakibul Islam Khan" },
  ], []);

  // Filtered list for search and master table
  const filteredList = useMemo(() => {
    return allPersonnel.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reporting.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDept === "All" || p.department === selectedDept;
      return matchSearch && matchDept;
    });
  }, [allPersonnel, searchQuery, selectedDept]);

  // Breakdown by official department
  const deptsSummary = useMemo(() => {
    const map: Record<string, PersonnelItem[]> = {
      "Tech & Engineering": [],
      "HR, Admin and Compliance": [],
      "Implementation & Business Analysis": [],
      "Business Development": [],
      "Database Administrator (DBA)": [],
      "MIS": [],
    };
    allPersonnel.forEach((p) => {
      if (map[p.department]) {
        map[p.department].push(p);
      } else {
        map[p.department] = [p];
      }
    });
    return map;
  }, [allPersonnel]);

  // Core hierarchical teams
  const anikTeam = useMemo(
    () => allPersonnel.filter((p) => p.reporting === "Md. Anik Islam" || p.reporting === "Anik"),
    [allPersonnel]
  );
  const sumayaTeam = useMemo(
    () => allPersonnel.filter((p) => p.reporting === "Sumaya" || p.reporting === "Sumaya Siddika"),
    [allPersonnel]
  );
  const mahfujulTeam = useMemo(
    () => allPersonnel.filter((p) => p.reporting === "Mahfujul" || p.reporting === "Md. Mahfujul Haque"),
    [allPersonnel]
  );
  const anwarTeam = useMemo(
    () => allPersonnel.filter((p) => p.reporting === "Anwar" || p.reporting === "Md. Anwar Hossain"),
    [allPersonnel]
  );
  const nasifTeam = useMemo(
    () => allPersonnel.filter((p) => p.reporting === "SK. Nasif Wahid" || p.reporting === "Naasif"),
    [allPersonnel]
  );
  const tareqTeam = useMemo(
    () => allPersonnel.filter((p) => p.reporting === "Mohammad Tareq Safa" || p.reporting === "Tareq"),
    [allPersonnel]
  );

  // Direct under Rajebul Hasan Rajon
  const rajonHrTeam = useMemo(
    () => allPersonnel.filter((p) => (p.reporting.includes("Rajon") || p.reporting.includes("Rajebul")) && p.department === "HR, Admin and Compliance"),
    [allPersonnel]
  );
  const rajonImplTeam = useMemo(
    () => allPersonnel.filter((p) => (p.reporting.includes("Rajon") || p.reporting.includes("Rajebul")) && p.department === "Implementation & Business Analysis"),
    [allPersonnel]
  );
  const rajonDbaTeam = useMemo(
    () => allPersonnel.filter((p) => (p.reporting.includes("Rajon") || p.reporting.includes("Rajebul")) && p.department === "Database Administrator (DBA)"),
    [allPersonnel]
  );
  const rajonDirectTech = useMemo(
    () => allPersonnel.filter((p) => p.name === "Tahmid Afsar" || p.name === "Mohammad Methoun Ahmed"),
    [allPersonnel]
  );

  return (
    <div className="app-layout-root flex h-screen bg-slate-100/70 dark:bg-slate-950 overflow-hidden font-sans text-slate-800 dark:text-slate-200 print:h-auto print:overflow-visible print:bg-white print:block">
      {/* Sidebar hidden during print */}
      <div className="no-print">
        <Sidebar />
      </div>

      <div className="app-main-container flex-1 flex flex-col min-w-0 overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* Topbar hidden during print */}
        <div className="no-print">
          <Topbar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 print:p-0 print:m-0 print:overflow-visible print:h-auto print:block">
          {/* Header Bar */}
          <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                <Network className="size-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Department SOP & Organogram
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  CRIPTON HRIS • Master Organizational Reporting Architecture (A4 Landscape Ready)
                </p>
              </div>
            </div>

            {/* Print & Action Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrint}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Printer className="size-4" />
                Print A4 Landscape
              </Button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="no-print flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("organogram")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "organogram"
                  ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
              >
                <GitFork className="size-3.5" />
                Organogram Tree (A4 View)
              </button>
              <button
                onClick={() => setActiveTab("departments")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "departments"
                  ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
              >
                <Building2 className="size-3.5" />
                Departments (6)
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "table"
                  ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
              >
                <FileSpreadsheet className="size-3.5" />
                Personnel Table (58)
              </button>
              <button
                onClick={() => setActiveTab("sop")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "sop"
                  ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
              >
                <ShieldCheck className="size-3.5" />
                SOP Rules
              </button>
            </div>

            {/* Scale Slider */}
            <div className="hidden lg:flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-xs">
              <span className="text-slate-400 font-medium">Scale:</span>
              <button
                onClick={() => setZoomScale(Math.max(60, zoomScale - 10))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                <ZoomOut className="size-3 text-slate-600 dark:text-slate-300" />
              </button>
              <span className="font-mono font-bold w-8 text-center">{zoomScale}%</span>
              <button
                onClick={() => setZoomScale(Math.min(130, zoomScale + 10))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                <ZoomIn className="size-3 text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={() => setZoomScale(100)}
                className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold underline"
              >
                100%
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════════
              TAB 1: PERFECT SINGLE-PAGE A4 LANDSCAPE ORGANOGRAM
          ════════════════════════════════════════════════════════════════════════ */}
          {activeTab === "organogram" && (
            <div className="print-canvas-wrapper flex justify-center overflow-x-auto">
              <div
                className="print-sheet bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-3 sm:p-4 transition-transform duration-200 origin-top w-full max-w-[1240px]"
                style={{
                  transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : "none",
                }}
              >
                {/* Print Title Header */}
                <div className="mb-1.5 pb-1 border-b border-slate-300 dark:border-slate-700 text-center">
                  <div className="text-[8.5px] tracking-widest uppercase font-bold text-slate-500">
                    CRIPTON HRIS • ORGANIZATIONAL STRUCTURE
                  </div>
                  <h1 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    Department SOP & Hierarchy Organogram
                  </h1>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    LAYER 1: FIRST LAYER — RAKIBUL ISLAM KHAN
                ───────────────────────────────────────────────────────────── */}
                <div className="flex flex-col items-center mb-0.5">
                  <div className="bg-slate-900 text-white dark:bg-slate-950 dark:border-slate-700 px-4 py-1.5 rounded-lg border border-slate-800 text-center min-w-[240px] shadow-xs">
                    <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                      Top Management
                    </div>
                    <div className="text-[11.5px] font-bold tracking-tight">
                      Rakibul Islam Khan
                    </div>
                  </div>

                  {/* SVG Tree Connector directly spanning to the 3 columns (Centers: 24%, 59.5%, 85.5%) */}
                  <div className="w-full flex justify-center my-0.5">
                    <svg className="w-full h-4 overflow-visible" viewBox="0 0 1000 16" fill="none" preserveAspectRatio="none">
                      {/* Vertical line from top node */}
                      <line x1="500" y1="0" x2="500" y2="8" stroke="#94a3b8" strokeWidth="1.5" />
                      {/* Horizontal bar across 3 column centers */}
                      <line x1="240" y1="8" x2="855" y2="8" stroke="#94a3b8" strokeWidth="1.5" />
                      {/* Drop to Col 1 (Rajon - center 24%) */}
                      <line x1="240" y1="8" x2="240" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
                      {/* Drop to Col 2 (Nasif - center 59.5%) */}
                      <line x1="595" y1="8" x2="595" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
                      {/* Drop to Col 3 (Tareq - center 85.5%) */}
                      <line x1="855" y1="8" x2="855" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    LAYER 2 & 3: THREE EXECUTIVE LEADS (STRICT 3-COLUMN GRID: 48% / 23% / 29%)
                ───────────────────────────────────────────────────────────── */}
                <div
                  className="organogram-three-columns w-full"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48% 23% 29%",
                    gap: "6px",
                    alignItems: "start",
                  }}
                >
                  {/* ═══════════════════════════════════════════════════════════
                      COLUMN 1: RAJEBUL HASAN RAJON (48% width)
                  ═══════════════════════════════════════════════════════════ */}
                  <div className="flex flex-col rounded-lg p-2 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
                    {/* Header */}
                    <div className="bg-slate-800 text-white dark:bg-slate-800/90 py-1.5 px-2 rounded-md text-center mb-1.5 shadow-xs">
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-300 block">
                        Executive Lead
                      </span>
                      <h2 className="text-[11.5px] font-bold">Rajebul Hasan Rajon</h2>
                    </div>

                    <div className="space-y-1.5 flex-1 text-xs">
                      {/* Department: Tech & Engineering */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5">
                        <div className="pb-1 border-b border-slate-200 dark:border-slate-800 mb-1 flex items-center gap-1">
                          <Cpu className="size-3 text-slate-600" />
                          <h3 className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                            Department: Tech & Engineering
                          </h3>
                        </div>

                        {/* Sub-Branch: Anik (16 members in 2-column grid) */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded p-1 bg-slate-50/60 dark:bg-slate-800/40 mb-1">
                          <div className="text-[9px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                            Team Lead: <strong>Md. Anik Islam</strong>
                          </div>
                          <div className="grid grid-cols-2 gap-0.5">
                            {anikTeam.map((m) => (
                              <div
                                key={m.id}
                                className="text-[8px] px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 truncate leading-tight font-medium"
                              >
                                {m.name}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Direct Tech ICs */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded p-1 bg-slate-50/60 dark:bg-slate-800/40 mb-1">
                          <div className="text-[8.5px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                            Direct Technical Members (Team Lead Rajon)
                          </div>
                          <div className="grid grid-cols-2 gap-0.5">
                            {rajonDirectTech.map((m) => (
                              <div
                                key={m.id}
                                className="text-[8px] px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold truncate leading-tight"
                              >
                                {m.name}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sub-Leads: Sumaya, Mahfujul, Anwar */}
                        <div className="grid grid-cols-3 gap-1">
                          {/* Sumaya */}
                          <div className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-[8px]">
                            <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Sumaya Siddika (TL)</div>
                            <div className="mt-0.5 space-y-0.5">
                              {sumayaTeam.map((p) => (
                                <div key={p.id} className="p-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 truncate text-[7.5px] leading-tight">
                                  {p.name}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mahfujul */}
                          <div className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-[8px]">
                            <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Md. Mahfujul Haque (TL)</div>
                            <div className="mt-0.5 space-y-0.5">
                              {mahfujulTeam.map((p) => (
                                <div key={p.id} className="p-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 truncate text-[7.5px] leading-tight">
                                  {p.name}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Anwar */}
                          <div className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-[8px]">
                            <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Md. Anwar Hossain (TL)</div>
                            <div className="mt-0.5 space-y-0.5">
                              {anwarTeam.map((p) => (
                                <div key={p.id} className="p-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 truncate text-[7.5px] leading-tight">
                                  {p.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Department: Database Administrator (DBA) */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 flex items-center justify-between text-xs">
                        <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                          DBA:
                        </span>
                        {rajonDbaTeam.map((m) => (
                          <span key={m.id} className="text-[8.5px] font-bold text-slate-900 dark:text-white">
                            {m.name}
                          </span>
                        ))}
                      </div>

                      {/* Department: HR, Admin and Compliance */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5">
                        <div className="pb-0.5 border-b border-slate-200 dark:border-slate-800 mb-1 flex items-center gap-1">
                          <Users className="size-3 text-slate-600" />
                          <h3 className="text-[9px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                            Department: HR, Admin and Compliance
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-0.5">
                          {rajonHrTeam.map((m) => (
                            <div key={m.id} className="text-[8px] px-1 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate leading-tight font-medium">
                              {m.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Department: Implementation & Business Analysis (Wing) */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1">
                        <div className="text-[9px] font-bold text-slate-800 dark:text-slate-200 uppercase mb-0.5">
                          Department: Implementation & Business Analysis (Wing)
                        </div>
                        <div className="grid grid-cols-2 gap-0.5">
                          {rajonImplTeam.map((m) => (
                            <div key={m.id} className="text-[8px] px-1 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold truncate leading-tight">
                              {m.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ═══════════════════════════════════════════════════════════
                      COLUMN 2: SK. NASIF WAHID (23% width)
                  ═══════════════════════════════════════════════════════════ */}
                  <div className="flex flex-col rounded-lg p-2 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
                    {/* Header */}
                    <div className="bg-slate-800 text-white dark:bg-slate-800/90 py-1.5 px-2 rounded-md text-center mb-1.5 shadow-xs">
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-300 block">
                        Executive Lead
                      </span>
                      <h2 className="text-[11.5px] font-bold">SK. Nasif Wahid</h2>
                    </div>

                    <div className="space-y-1.5 flex-1 text-xs">
                      {/* Department: Business Development */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5">
                        <div className="pb-1 border-b border-slate-200 dark:border-slate-800 mb-1 flex items-center gap-1">
                          <TrendingUp className="size-3 text-slate-600" />
                          <h3 className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                            Department: Business Development
                          </h3>
                        </div>

                        {/* Head */}
                        <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 mb-1">
                          <span className="text-[7.5px] uppercase font-bold text-slate-500 block">Lead</span>
                          <span className="text-[10px] font-bold text-slate-900 dark:text-white">SK. Nasif Wahid</span>
                        </div>

                        {/* Team */}
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            Team Members
                          </span>
                          {nasifTeam.map((m) => (
                            <div
                              key={m.id}
                              className="text-[8.5px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white truncate leading-tight"
                            >
                              {m.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ═══════════════════════════════════════════════════════════
                      COLUMN 3: MOHAMMAD TAREQ SAFA (29% width)
                  ═══════════════════════════════════════════════════════════ */}
                  <div className="flex flex-col rounded-lg p-2 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
                    {/* Header */}
                    <div className="bg-slate-800 text-white dark:bg-slate-800/90 py-1.5 px-2 rounded-md text-center mb-1.5 shadow-xs">
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-300 block">
                        Executive Lead
                      </span>
                      <h2 className="text-[11.5px] font-bold">Mohammad Tareq Safa</h2>
                    </div>

                    <div className="space-y-1.5 flex-1 text-xs">
                      {/* Department: MIS */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 flex items-center justify-between text-xs">
                        <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                          Department: MIS
                        </span>
                        <span className="text-[8.5px] font-bold text-slate-900 dark:text-white">
                          Mohammad Tareq Safa
                        </span>
                      </div>

                      {/* Department: Implementation & Business Analysis */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5">
                        <div className="pb-1 border-b border-slate-200 dark:border-slate-800 mb-1 flex items-center gap-1">
                          <ClipboardCheck className="size-3 text-slate-600" />
                          <h3 className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                            Department: Implementation & Business Analysis
                          </h3>
                        </div>

                        <div className="space-y-0.5">
                          {tareqTeam
                            .filter((m) => m.department === "Implementation & Business Analysis")
                            .map((m) => (
                              <div
                                key={m.id}
                                className="text-[8.5px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white truncate leading-tight"
                              >
                                {m.name}
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Department: Tech & Engineering (Wing) */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5">
                        <div className="pb-1 border-b border-slate-200 dark:border-slate-800 mb-1 flex items-center gap-1">
                          <Cpu className="size-3 text-slate-600" />
                          <h3 className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                            Department: Tech & Engineering (Wing)
                          </h3>
                        </div>
                        <div className="space-y-0.5">
                          {tareqTeam
                            .filter((m) => m.department === "Tech & Engineering")
                            .map((m) => (
                              <div
                                key={m.id}
                                className="text-[8.5px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white truncate leading-tight"
                              >
                                {m.name}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Footer */}
                <div className="mt-2 pt-1 border-t border-slate-300 dark:border-slate-700 flex justify-between text-[7.5px] text-slate-500 font-medium">
                  <span>CRIPTON HRIS • Master Department SOP Organogram</span>
                  <span>All 58 Personnel • Single Page A4 Landscape Format</span>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              TAB 2: VIEW BY EXACT OFFICIAL DEPARTMENTS (6 TOTAL)
          ════════════════════════════════════════════════════════════════════════ */}
          {activeTab === "departments" && (
            <div className="space-y-3">
              {Object.entries(deptsSummary).map(([deptName, members]) => (
                <div
                  key={deptName}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 mb-2.5">
                    <span className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                      <Building2 className="size-3.5" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        Department: {deptName}
                      </h3>
                      <span className="text-[10px] text-slate-500">{members.length} Members</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5">
                    {members.map((emp) => (
                      <div
                        key={emp.id}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs"
                      >
                        <div className="font-bold text-[11px] text-slate-900 dark:text-white">
                          {emp.name}
                        </div>
                        <div className="text-[9.5px] text-slate-500 mt-0.5">
                          Reports to: <strong className="text-slate-700 dark:text-slate-300">{emp.reporting}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              TAB 3: PERSONNEL MASTER LIST (58)
          ════════════════════════════════════════════════════════════════════════ */}
          {activeTab === "table" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">58 Personnel Master Roster</h3>
                  <p className="text-[11px] text-slate-500">Source spreadsheet replica with node mapping</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search name, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-52 h-7 text-xs"
                  />
                  <Badge variant="outline" className="font-mono text-xs">
                    {filteredList.length} / 58
                  </Badge>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-1.5 px-3">SL</th>
                      <th className="py-1.5 px-3">Personnel Name</th>
                      <th className="py-1.5 px-3">Official Department</th>
                      <th className="py-1.5 px-3">Reporting Supervisor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredList.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-1.5 px-3 font-mono text-slate-500">{emp.sl}</td>
                        <td className="py-1.5 px-3 font-bold text-slate-900 dark:text-white">{emp.name}</td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-300">{emp.department}</td>
                        <td className="py-1.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{emp.reporting}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              TAB 4: DEPARTMENT SOP & HIERARCHY RULES
          ════════════════════════════════════════════════════════════════════════ */}
          {activeTab === "sop" && (
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="size-4 text-slate-700 dark:text-slate-300" />
                  CRIPTON Standard Operating Procedure (SOP) & Hierarchy Blueprint
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Decent corporate styling, A4 single-sheet landscape print specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">Official Departments</h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                    <li>Tech & Engineering (30)</li>
                    <li>HR, Admin and Compliance (12)</li>
                    <li>Implementation & Business Analysis (8)</li>
                    <li>Business Development (6)</li>
                    <li>Database Administrator (DBA) (1)</li>
                    <li>MIS (1)</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">A4 Landscape Print Rules</h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                    <li>Size: Standard A4 Landscape (297mm × 210mm)</li>
                    <li>Margins: 4mm all sides to ensure zero page overflow</li>
                    <li>Strict single-page print fit without scrollbars or clipped contents</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── BULLETPROOF CSS PRINT OVERRIDE FOR PERFECT SINGLE-SHEET A4 LANDSCAPE ── */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 4mm 5mm 4mm 5mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            width: 100% !important;
            min-width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            -webkit-font-smoothing: antialiased !important;
          }
          .no-print, header, aside, nav, button, [class*="chat"], [class*="Chatbot"], .fixed {
            display: none !important;
            visibility: hidden !important;
          }
          .app-layout-root, .app-main-container, main {
            display: block !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            border: none !important;
            background: transparent !important;
          }
          .print-canvas-wrapper {
            overflow: visible !important;
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-sheet {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 6px !important;
            box-shadow: none !important;
            padding: 2.5mm 3.5mm !important;
            margin: 0 !important;
            transform: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            background: #ffffff !important;
          }
          .organogram-three-columns {
            display: grid !important;
            grid-template-columns: 48% 23% 29% !important;
            gap: 6px !important;
            width: 100% !important;
            align-items: start !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .organogram-three-columns > div {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
