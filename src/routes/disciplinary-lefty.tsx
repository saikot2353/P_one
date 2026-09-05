import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  FileSpreadsheet,
  Printer,
  ShieldAlert,
  Plus,
  X,
  UserX,
  Building2,
  Clock,
  AlertTriangle,
  Banknote,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/disciplinary-lefty")({
  head: () => ({
    meta: [
      { title: "Lefty Management — CRIPTON" },
      {
        name: "description",
        content:
          "Manage unauthorized employee absences, progressive Lefty notices, and cash salary conversions.",
      },
    ],
  }),
  component: LeftyManagementPage,
});

export interface LeftyRecord {
  sl: number;
  id: string;
  letterRef: string;
  empId: string;
  empIdOff: string;
  empName: string;
  company: string;
  department: string;
  designation: string;
  absenceStartDate: string;
  consecutiveDays: number;
  hasNotice: boolean;
  stage: "Stage 1" | "Stage 2" | "Stage 3" | "Terminated" | "Resolved";
  noticeStatus: "1st Letter Issued" | "2nd Letter Issued" | "Final Letter Issued" | "Pending Action" | "Case Closed";
  salaryPaymentMode: "Cash" | "Bank / Regular";
  cashConversionDate?: string;
  lastLetterDate?: string;
  remarks: string;
}

const initialMockLeftyRecords: LeftyRecord[] = [
  {
    sl: 1,
    id: "LFT-2026-001",
    letterRef: "LFT/NOTICE/2026/014",
    empId: "2047508",
    empIdOff: "47508",
    empName: "Mst. Jahanara Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Asst. Operator",
    absenceStartDate: "25/07/2026",
    consecutiveDays: 12,
    hasNotice: false,
    stage: "Stage 1",
    noticeStatus: "1st Letter Issued",
    salaryPaymentMode: "Cash",
    cashConversionDate: "04/08/2026",
    lastLetterDate: "04/08/2026",
    remarks: "Absent without prior authorization for 12 days. 1st Lefty letter sent to home address.",
  },
  {
    sl: 2,
    id: "LFT-2026-002",
    letterRef: "LFT/NOTICE/2026/012",
    empId: "3302786",
    empIdOff: "C-28786",
    empName: "Md. Shantona Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Asst. Operator",
    absenceStartDate: "15/07/2026",
    consecutiveDays: 22,
    hasNotice: false,
    stage: "Stage 2",
    noticeStatus: "2nd Letter Issued",
    salaryPaymentMode: "Cash",
    cashConversionDate: "25/07/2026",
    lastLetterDate: "04/08/2026",
    remarks: "No response to 1st notice. 2nd warning notice dispatched after 20 days cumulative absence.",
  },
  {
    sl: 3,
    id: "LFT-2026-003",
    letterRef: "LFT/NOTICE/2026/009",
    empId: "8020064",
    empIdOff: "WQ-20064",
    empName: "Amina Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Store",
    designation: "Jr. Needle Man",
    absenceStartDate: "08/07/2026",
    consecutiveDays: 28,
    hasNotice: false,
    stage: "Stage 3",
    noticeStatus: "Final Letter Issued",
    salaryPaymentMode: "Cash",
    cashConversionDate: "18/07/2026",
    lastLetterDate: "04/08/2026",
    remarks: "Passed 27 days limit. Final termination letter generated. Settlement transferred to cash register.",
  },
  {
    sl: 4,
    id: "LFT-2026-004",
    letterRef: "LFT/NOTICE/2026/019",
    empId: "2025058109",
    empIdOff: "58109",
    empName: "Mohammad Methoun Ahmed",
    company: "Pakiza Software",
    department: "Business Automation",
    designation: "Sr. Manager",
    absenceStartDate: "28/07/2026",
    consecutiveDays: 10,
    hasNotice: false,
    stage: "Stage 1",
    noticeStatus: "1st Letter Issued",
    salaryPaymentMode: "Cash",
    cashConversionDate: "07/08/2026",
    lastLetterDate: "07/08/2026",
    remarks: "10th day consecutive unauthorized leave. Auto-marked as Lefty and salary converted to cash.",
  },
  {
    sl: 5,
    id: "LFT-2026-005",
    letterRef: "LFT/NOTICE/2026/005",
    empId: "2022035599",
    empIdOff: "35599",
    empName: "Dipon Saha",
    company: "Pakiza Software",
    department: "HR & Compliance",
    designation: "Manager",
    absenceStartDate: "01/07/2026",
    consecutiveDays: 30,
    hasNotice: false,
    stage: "Terminated",
    noticeStatus: "Case Closed",
    salaryPaymentMode: "Cash",
    cashConversionDate: "11/07/2026",
    lastLetterDate: "28/07/2026",
    remarks: "Employment terminated under section 27 of Labor Act following 3 sequential notices.",
  },
];

function LeftyManagementPage() {
  const [records, setRecords] = useState<LeftyRecord[]>(initialMockLeftyRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [selectedRecordForLetter, setSelectedRecordForLetter] = useState<LeftyRecord | null>(null);
  const [letterLanguage, setLetterLanguage] = useState<"bn" | "en">("bn");
  const [letterType, setLetterType] = useState<"1st" | "2nd" | "final">("1st");

  // New Record Form State
  const [newForm, setNewForm] = useState({
    empId: "",
    empIdOff: "",
    empName: "",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Operator",
    absenceStartDate: new Date().toISOString().slice(0, 10),
    consecutiveDays: 10,
    hasNotice: false,
    remarks: "",
  });

  // Unique departments for filter
  const departments = useMemo(() => {
    const list = Array.from(new Set(records.map((r) => r.department)));
    return ["ALL", ...list];
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.empId.includes(searchTerm) ||
        r.empIdOff.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.letterRef.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStage = stageFilter === "ALL" || r.stage === stageFilter;
      const matchDept = deptFilter === "ALL" || r.department === deptFilter;

      return matchSearch && matchStage && matchDept;
    });
  }, [records, searchTerm, stageFilter, deptFilter]);

  // Analytics Metrics
  const stats = useMemo(() => {
    const total = records.length;
    const stage1 = records.filter((r) => r.stage === "Stage 1").length;
    const stage2 = records.filter((r) => r.stage === "Stage 2").length;
    const stage3 = records.filter((r) => r.stage === "Stage 3").length;
    const cashSalaryCount = records.filter((r) => r.salaryPaymentMode === "Cash").length;
    return { total, stage1, stage2, stage3, cashSalaryCount };
  }, [records]);

  // Action: Open Letter Modal
  const handleOpenLetterModal = (record: LeftyRecord, type: "1st" | "2nd" | "final" = "1st") => {
    setSelectedRecordForLetter(record);
    setLetterType(type);
    setIsLetterModalOpen(true);
  };

  // Action: Escalate Stage
  const handleEscalateStage = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        let newStage = r.stage;
        let newStatus = r.noticeStatus;
        let newDays = r.consecutiveDays;

        if (r.stage === "Stage 1") {
          newStage = "Stage 2";
          newStatus = "2nd Letter Issued";
          newDays = Math.max(r.consecutiveDays, 20);
          toast.success(`Escalated ${r.empName} to Stage 2. 2nd Letter generated.`);
        } else if (r.stage === "Stage 2") {
          newStage = "Stage 3";
          newStatus = "Final Letter Issued";
          newDays = Math.max(r.consecutiveDays, 27);
          toast.warning(`Escalated ${r.empName} to Stage 3. Final Discharge Letter generated.`);
        } else if (r.stage === "Stage 3") {
          newStage = "Terminated";
          newStatus = "Case Closed";
          toast.error(`Marked ${r.empName} as Terminated / Discharged from service.`);
        }

        return {
          ...r,
          stage: newStage,
          noticeStatus: newStatus,
          consecutiveDays: newDays,
          lastLetterDate: new Date().toLocaleDateString("en-GB"),
        };
      })
    );
  };

  // Action: Submit New Lefty Case
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.empId || !newForm.empName) {
      toast.error("Please fill in required employee information.");
      return;
    }

    const days = Number(newForm.consecutiveDays);
    let stage: LeftyRecord["stage"] = "Stage 1";
    let noticeStatus: LeftyRecord["noticeStatus"] = "1st Letter Issued";

    if (days >= 27) {
      stage = "Stage 3";
      noticeStatus = "Final Letter Issued";
    } else if (days >= 20) {
      stage = "Stage 2";
      noticeStatus = "2nd Letter Issued";
    }

    // Cash conversion applies if absent >= 10 days without notice
    const isCashConverted = days >= 10 && !newForm.hasNotice;

    const newRecord: LeftyRecord = {
      sl: records.length + 1,
      id: `LFT-2026-${String(records.length + 1).padStart(3, "0")}`,
      letterRef: `LFT/NOTICE/2026/${String(records.length + 15).padStart(3, "0")}`,
      empId: newForm.empId,
      empIdOff: newForm.empIdOff || newForm.empId.slice(-5),
      empName: newForm.empName,
      company: newForm.company,
      department: newForm.department,
      designation: newForm.designation,
      absenceStartDate: newForm.absenceStartDate,
      consecutiveDays: days,
      hasNotice: newForm.hasNotice,
      stage,
      noticeStatus,
      salaryPaymentMode: isCashConverted ? "Cash" : "Bank / Regular",
      cashConversionDate: isCashConverted ? new Date().toLocaleDateString("en-GB") : undefined,
      lastLetterDate: new Date().toLocaleDateString("en-GB"),
      remarks: newForm.remarks || `Logged unauthorized absence of ${days} days. Auto-flagged Lefty.`,
    };

    setRecords([newRecord, ...records]);
    setIsAddModalOpen(false);
    toast.success(
      `Lefty case created for ${newForm.empName}! ${
        isCashConverted ? "Monthly salary automatically converted to Cash." : ""
      }`
    );

    // Reset form
    setNewForm({
      empId: "",
      empIdOff: "",
      empName: "",
      company: "KAC Fashion Wear Ltd",
      department: "Sewing",
      designation: "Operator",
      absenceStartDate: new Date().toISOString().slice(0, 10),
      consecutiveDays: 10,
      hasNotice: false,
      remarks: "",
    });
  };

  // Action: Export CSV
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Lefty ID",
      "Letter Ref",
      "Emp ID",
      "Name",
      "Company",
      "Department",
      "Absence Start",
      "Days Absent",
      "Lefty Stage",
      "Notice Status",
      "Salary Mode",
      "Remarks",
    ];

    const rows = filteredRecords.map((r) => [
      r.sl,
      r.id,
      r.letterRef,
      r.empId,
      r.empName,
      r.company,
      r.department,
      r.absenceStartDate,
      r.consecutiveDays,
      r.stage,
      r.noticeStatus,
      r.salaryPaymentMode,
      r.remarks,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Lefty_Absence_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Lefty cases exported to CSV successfully.");
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Link to="/disciplinary-case-files" className="hover:text-primary transition-colors">
                  Disciplinary Action
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-800 dark:text-slate-200">Lefty Management</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserX className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                Lefty Action & Unauthorized Absence Tracking
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Automated 10-day Lefty flagging, progressive letter generation (Stage 1 → Stage 2 → Stage 3), and cash salary conversions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold shadow-sm transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Export CSV
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Log Lefty Case
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Lefty Cases</span>
                <UserX className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.total}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Active & Historical Cases</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Stage 1</span>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{stats.stage1}</div>
                <div className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-0.5">1st Letter Issued</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Stage 2</span>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{stats.stage2}</div>
                <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">2nd Warning Issued</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Stage 3</span>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-rose-700 dark:text-rose-300">{stats.stage3}</div>
                <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">Final Notice / Dismissal</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Cash Salary Mode</span>
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{stats.cashSalaryCount}</div>
                <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">Cash Channel Active</div>
              </div>
            </div>
          </div>

          {/* Filters & Control Bar */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Employee ID, Name, Ref No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Stage Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500 shrink-0">Stage:</label>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-medium"
                >
                  <option value="ALL">All Stages</option>
                  <option value="Stage 1">Stage 1</option>
                  <option value="Stage 2">Stage 2</option>
                  <option value="Stage 3">Stage 3</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Dept Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500 shrink-0">Department:</label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d === "ALL" ? "All Departments" : d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Records Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-3.5 w-12 text-center">SL</th>
                    <th className="py-3 px-3.5">Employee Info</th>
                    <th className="py-3 px-3.5">Department & Company</th>
                    <th className="py-3 px-3.5 text-center">Absence Start</th>
                    <th className="py-3 px-3.5 text-center">Days Absent</th>
                    <th className="py-3 px-3.5 text-center">Current Stage</th>
                    <th className="py-3 px-3.5 text-center">Salary Mode</th>
                    <th className="py-3 px-3.5 text-center">Notice Status</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <UserX className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                        <p className="font-semibold">No Lefty records found</p>
                        <p className="text-xs text-slate-500">Try adjusting your search query or stage filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3.5 text-center font-bold text-slate-500">{record.sl}</td>

                        {/* Employee Info - ONLY Name and ID */}
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {record.empName}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                            ID: {record.empId}
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{record.department}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" /> {record.company}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 text-center font-mono text-slate-700 dark:text-slate-300">
                          {record.absenceStartDate}
                        </td>

                        <td className="py-3 px-3.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full font-black text-xs inline-flex items-center gap-1 ${
                              record.consecutiveDays >= 27
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300"
                                : record.consecutiveDays >= 20
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300"
                            }`}
                          >
                            <Clock className="w-3 h-3" /> {record.consecutiveDays} Days
                          </span>
                        </td>

                        {/* Current Stage - ONLY Stage 1, Stage 2, Stage 3 */}
                        <td className="py-3 px-3.5 text-center">
                          {record.stage === "Stage 1" && (
                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-[11px] border border-blue-200 dark:border-blue-900">
                              Stage 1
                            </span>
                          )}
                          {record.stage === "Stage 2" && (
                            <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-900">
                              Stage 2
                            </span>
                          )}
                          {record.stage === "Stage 3" && (
                            <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold text-[11px] border border-rose-200 dark:border-rose-900">
                              Stage 3
                            </span>
                          )}
                          {record.stage === "Terminated" && (
                            <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 font-bold text-[11px]">
                              Terminated
                            </span>
                          )}
                          {record.stage === "Resolved" && (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200">
                              Resolved
                            </span>
                          )}
                        </td>

                        {/* Salary Mode - ONLY Cash */}
                        <td className="py-3 px-3.5 text-center">
                          {record.salaryPaymentMode === "Cash" ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-extrabold text-[11px] inline-flex items-center gap-1 border border-emerald-300 dark:border-emerald-800 shadow-sm">
                              <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              Cash
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[11px]">
                              Bank / Regular
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5 text-center font-medium text-slate-700 dark:text-slate-300">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                            {record.noticeStatus}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Generate / Print Letter */}
                            <button
                              onClick={() =>
                                handleOpenLetterModal(
                                  record,
                                  record.stage === "Stage 3"
                                    ? "final"
                                    : record.stage === "Stage 2"
                                    ? "2nd"
                                    : "1st"
                                )
                              }
                              title="View / Print Lefty Notice Letter"
                              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                            >
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>

                            {/* Escalate Stage Button */}
                            {record.stage !== "Terminated" && (
                              <button
                                onClick={() => handleEscalateStage(record.id)}
                                title="Escalate to Next Stage"
                                className="p-1.5 rounded-md hover:bg-amber-100 dark:hover:bg-amber-950/60 text-amber-700 dark:text-amber-400 transition-colors"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                            )}

                            {/* Quick Letter Action */}
                            <button
                              onClick={() => handleOpenLetterModal(record, "1st")}
                              className="px-2 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100 font-semibold text-[11px] border border-rose-200 dark:border-rose-900"
                            >
                              Letter
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Log New Lefty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserX className="w-5 h-5 text-rose-600" />
                Log Unauthorized Absence / Lefty Entry
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2047508"
                    value={newForm.empId}
                    onChange={(e) => setNewForm({ ...newForm, empId: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 47508"
                    value={newForm.empIdOff}
                    onChange={(e) => setNewForm({ ...newForm, empIdOff: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employee Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Md. Rahatul Islam"
                  value={newForm.empName}
                  onChange={(e) => setNewForm({ ...newForm, empName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newForm.department}
                    onChange={(e) => setNewForm({ ...newForm, department: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={newForm.designation}
                    onChange={(e) => setNewForm({ ...newForm, designation: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Absence Start Date
                  </label>
                  <input
                    type="date"
                    value={newForm.absenceStartDate}
                    onChange={(e) => setNewForm({ ...newForm, absenceStartDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Consecutive Days Absent *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newForm.consecutiveDays}
                    onChange={(e) => setNewForm({ ...newForm, consecutiveDays: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Dynamic Warning Alert on Days */}
              {newForm.consecutiveDays >= 10 && (
                <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Banknote className="w-4 h-4" /> Automatic Salary Rule Applied!
                  </div>
                  <p>
                    Since absence is <strong>{newForm.consecutiveDays} days</strong> without notice, this employee will be marked as <strong>Lefty</strong> and their monthly salary mode will automatically switch to <strong>Cash</strong>.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Remarks / Internal Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or notes..."
                  value={newForm.remarks}
                  onChange={(e) => setNewForm({ ...newForm, remarks: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Save & Apply Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Formal HR Lefty Notice Letter Modal */}
      {isLetterModalOpen && selectedRecordForLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-3xl w-full p-6 space-y-6 my-8">
            {/* Modal Control Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-rose-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Formal Lefty Notice Letter Generator
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ref: {selectedRecordForLetter.letterRef} | Employee: {selectedRecordForLetter.empName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switch */}
                <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setLetterLanguage("bn")}
                    className={`px-2.5 py-1 rounded-md ${
                      letterLanguage === "bn"
                        ? "bg-rose-600 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => setLetterLanguage("en")}
                    className={`px-2.5 py-1 rounded-md ${
                      letterLanguage === "en"
                        ? "bg-rose-600 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    English
                  </button>
                </div>

                {/* Letter Type Switch */}
                <select
                  value={letterType}
                  onChange={(e) => setLetterType(e.target.value as "1st" | "2nd" | "final")}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-semibold"
                >
                  <option value="1st">1st Notice (Stage 1)</option>
                  <option value="2nd">2nd Notice (Stage 2)</option>
                  <option value="final">Final Notice (Stage 3)</option>
                </select>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>

                <button
                  onClick={() => setIsLetterModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 bg-white text-slate-900 rounded-lg border border-slate-200 shadow-inner font-serif space-y-6 text-sm leading-relaxed print:p-0 print:border-none print:shadow-none print:text-black">
              {/* Header Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                <h1 className="text-xl font-bold tracking-wide uppercase">{selectedRecordForLetter.company}</h1>
                <p className="text-xs text-slate-600">
                  Human Resources & Corporate Compliance Division
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  Ref No: <span className="font-mono">{selectedRecordForLetter.letterRef}</span> | Date:{" "}
                  {new Date().toLocaleDateString("en-GB")}
                </p>
              </div>

              {/* Bangla Content */}
              {letterLanguage === "bn" ? (
                <div className="space-y-4 text-xs leading-relaxed text-justify">
                  <div className="space-y-1 font-sans">
                    <p><strong>প্রাপক:</strong> {selectedRecordForLetter.empName}</p>
                    <p><strong>আইডি নং:</strong> {selectedRecordForLetter.empId}</p>
                    <p><strong>ডিপার্টমেন্ট:</strong> {selectedRecordForLetter.department}</p>
                    <p><strong>প্রতিষ্ঠান:</strong> {selectedRecordForLetter.company}</p>
                  </div>

                  <div className="text-center font-bold text-sm text-slate-900 py-2 underline decoration-2 underline-offset-4">
                    {letterType === "1st" && "বিষয়: ১০ দিন অগোচরে অনুপস্থিতির জন্য কারণ দর্শানো ও ১ম সতর্কীকরণ নোটিশ (Lefty Notice #1)"}
                    {letterType === "2nd" && "বিষয়: ২০ দিন অগোচরে অনুপস্থিতির জন্য ২য় সতর্কীকরণ ও চূড়ান্ত কারণ দর্শানো নোটিশ (Lefty Notice #2)"}
                    {letterType === "final" && "বিষয়: ২৭ দিন অগোচরে অনুপস্থিতির প্রেক্ষিতে চাকরি হতে অবসান/বরখাস্তকরণ ও পাওনা মেটানোর নোটিশ (Lefty Final Notice)"}
                  </div>

                  <p>জনাব/জনাবে,</p>

                  {letterType === "1st" && (
                    <>
                      <p>
                        আপনাকে এতদ্বারা জানানো যাচ্ছে যে, আপনি গত <strong>{selectedRecordForLetter.absenceStartDate}</strong> তারিখ হতে কর্তৃপক্ষের কোনো পূর্বানুমতি বা লিখিত আবেদন ছাড়াই ধারাবাহিকভাবে <strong>১০ দিন</strong> কর্মস্থলে অনুপস্থিত রয়েছেন।
                      </p>
                      <p>
                        কোম্পানির শৃঙ্খলা ও বাংলাদেশ শ্রম আইন ২০০৬ (সংশোধিত ২০১৩) অনুযায়ী কর্তৃপক্ষের অনুমোদন ব্যতীত consecutive ১০ দিন অগোচরে অনুপস্থিত থাকা চরম শৃঙ্খলাভঙ্গ ও "Lefty" হিসেবে বিবেচিত।
                      </p>
                      <p className="p-2.5 rounded border border-slate-300 bg-slate-50 font-sans text-[11px]">
                        <strong>বেতন প্রদান নীতি নির্দেশিকা:</strong> যেহেতু আপনি ১০ দিন কোনো নোটিশ প্রদান ছাড়াই অনুপস্থিত রয়েছেন, আপনার চলতি মাসের বেতন প্রদান মাধ্যম সম্পূর্ণ <strong>ক্যাশ (Cash Payment Channel)</strong> এ স্থানান্তরিত করা হলো।
                      </p>
                      <p>
                        অতএব, এই পত্র প্রাপ্তির ৩ (তিন) কর্মদিবসের মধ্যে আপনার এই অগোচরে অনুপস্থিতির সুনির্দিষ্ট লিখিত ব্যাখ্যা ও প্রমাণাদিসহ এইচআর বিভাগে উপস্থিত হওয়ার নির্দেশ প্রদান করা যাচ্ছে।
                      </p>
                    </>
                  )}

                  {letterType === "2nd" && (
                    <>
                      <p>
                        আপনার অবগতির জন্য জানানো যাচ্ছে যে, পূর্বের ১ম কারণ দর্শানো নোটিশ প্রদান করা সত্ত্বেও আপনি আজ পর্যন্ত কর্মস্থলে যোগদান করেননি বা কোনো লিখিত ব্যাখ্যা প্রদান করেননি। আপনি গত <strong>{selectedRecordForLetter.absenceStartDate}</strong> তারিখ হতে এ যাবত মোট <strong>২০ দিন</strong> অগোচরে অনুপস্থিত রয়েছেন।
                      </p>
                      <p>
                        আপনার এই আচরণ প্রতিষ্ঠানের উৎপাদন ও নিয়মানুবর্তিতার পরিপন্থী। আপনাকে পুনরায় ২য় ও শেষ সুযোগ প্রদান করা হচ্ছে। এই পত্র পাওয়ার ২ (দুই) দিনের মধ্যে সশরীরে উপস্থিত হয়ে লিখিত কৈফিয়ত প্রদান করতে ব্যর্থ হলে আপনার বিরুদ্ধে বরখাস্তের আইনগত ব্যবস্থা গ্রহণ করা হবে।
                      </p>
                    </>
                  )}

                  {letterType === "final" && (
                    <>
                      <p>
                        আপনি গত <strong>{selectedRecordForLetter.absenceStartDate}</strong> তারিখ হতে বিনা নোটিশে মোট <strong>২৭ দিন (বা তদূর্ধ্ব)</strong> কর্মস্থলে অনুপস্থিত রয়েছেন এবং পূর্ববর্তী ১ম ও ২য় কোনো কারণ দর্শানো নোটিশের জবাব প্রদান করেননি।
                      </p>
                      <p>
                        অতএব, বাংলাদেশ শ্রম আইন অনুযায়ী আপনাকে অত্র প্রতিষ্ঠানের চাকরি হতে চূড়ান্তভাবে <strong>অবসান / বরখাস্ত (Lefty Discharge)</strong> করা হলো। আপনার অলিখিত দিনসমূহের বেতন সমন্বয়পূর্বক চূড়ান্ত পাওনা ক্যাশ রেজিস্টারের মাধ্যমে প্রদান করা হবে।
                      </p>
                    </>
                  )}

                  <div className="pt-12 flex items-center justify-between font-sans text-xs">
                    <div className="border-t border-slate-400 pt-1 text-center w-40">
                      গ্রহীতার স্বাক্ষর ও তারিখ
                    </div>
                    <div className="border-t border-slate-400 pt-1 text-center w-48">
                      মানবসম্পদ ও প্রশাসন বিভাগ<br />
                      {selectedRecordForLetter.company}
                    </div>
                  </div>
                </div>
              ) : (
                /* English Content */
                <div className="space-y-4 text-xs leading-relaxed text-justify font-sans">
                  <div className="space-y-1">
                    <p><strong>To:</strong> {selectedRecordForLetter.empName}</p>
                    <p><strong>Employee ID:</strong> {selectedRecordForLetter.empId}</p>
                    <p><strong>Dept:</strong> {selectedRecordForLetter.department}</p>
                    <p><strong>Company:</strong> {selectedRecordForLetter.company}</p>
                  </div>

                  <div className="text-center font-bold text-sm text-slate-900 py-2 underline decoration-2 underline-offset-4 font-serif">
                    {letterType === "1st" && "Subject: Show Cause & 1st Warning Notice for 10 Days Unauthorized Absence (Lefty Stage 1)"}
                    {letterType === "2nd" && "Subject: 2nd Warning & Final Show Cause Notice for 20 Days Cumulative Absence (Lefty Stage 2)"}
                    {letterType === "final" && "Subject: Employment Discharge & Final Settlement Notice for 27 Days Absence (Lefty Stage 3)"}
                  </div>

                  <p>Dear Employee,</p>

                  {letterType === "1st" && (
                    <>
                      <p>
                        This is to inform you that you have been continuously absent from duty for <strong>10 consecutive days</strong> starting from <strong>{selectedRecordForLetter.absenceStartDate}</strong> without any prior written permission or approved leave from the authority.
                      </p>
                      <p>
                        Under company policy and Section 27 of Bangladesh Labor Act 2006, 10 days of unexcused absence is classified as gross misconduct and triggers "Lefty" disciplinary action.
                      </p>
                      <p className="p-2.5 rounded border border-slate-300 bg-slate-50 text-[11px]">
                        <strong>Payroll Notice:</strong> Due to 10 days of absence without prior notice, your monthly salary disbursement channel has been automatically converted to <strong>Cash</strong>.
                      </p>
                      <p>
                        You are hereby instructed to submit a written explanation within 3 working days from the receipt of this letter.
                      </p>
                    </>
                  )}

                  {letterType === "2nd" && (
                    <>
                      <p>
                        Following our 1st Show Cause Notice, you have neither reported for duty nor provided any written explanation. You have now been absent for a cumulative total of <strong>20 days</strong> since <strong>{selectedRecordForLetter.absenceStartDate}</strong>.
                      </p>
                      <p>
                        You are given a final opportunity to present yourself to HR within 2 days. Failure to do so will result in immediate termination proceedings.
                      </p>
                    </>
                  )}

                  {letterType === "final" && (
                    <>
                      <p>
                        You have remained continuously absent for <strong>27 days</strong> since <strong>{selectedRecordForLetter.absenceStartDate}</strong> without notice and failed to respond to both prior warning notices.
                      </p>
                      <p>
                        Consequently, your employment is hereby <strong>terminated / discharged</strong> under company regulations. Final settlement dues will be processed via Cash disbursement.
                      </p>
                    </>
                  )}

                  <div className="pt-12 flex items-center justify-between text-xs">
                    <div className="border-t border-slate-400 pt-1 text-center w-40">
                      Employee Signature & Date
                    </div>
                    <div className="border-t border-slate-400 pt-1 text-center w-48">
                      Authorized HR Signatory<br />
                      {selectedRecordForLetter.company}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeftyManagementPage;
