import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  RotateCcw,
  BarChart3,
  Building2,
  Users,
  DollarSign,
  Clock,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/hr-report-overtime-summary")({
  head: () => ({
    meta: [
      { title: "Overtime Summary Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Overtime Summary & Costing Report by Department, Manpower, OT Hours, Expenses, and CM Income.",
      },
    ],
  }),
  component: OvertimeSummaryReportPage,
});

export interface OvertimeSummaryRecord {
  sl: number;
  department: string;
  empType: "Worker" | "ExeStaff" | "Office Executive";
  manpower: number;
  otHour: number;
  otAmount: number;
  tiffin: number;
  nightBill: number;
  totalExpenses: number;
  generalHrsProduction: number;
  otHrsProduction: number;
  avgCmPcsTaka: number;
  ttlCmPcsIncomeTaka: number;
  difference: number;
  remarks: string;
}

const SAMPLE_OT_SUMMARY_DATA: OvertimeSummaryRecord[] = [
  { sl: 1, department: "Sewing", empType: "Worker", manpower: 1, otHour: 0, otAmount: 0, tiffin: 29, nightBill: 0, totalExpenses: 29, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -29, remarks: "Normal" },
  { sl: 2, department: "Accessories Store (MCD)", empType: "Worker", manpower: 1, otHour: 0, otAmount: 0, tiffin: 29, nightBill: 0, totalExpenses: 29, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -29, remarks: "Normal" },
  { sl: 3, department: "Accessories Store 1", empType: "Worker", manpower: 2, otHour: 0, otAmount: 0, tiffin: 58, nightBill: 0, totalExpenses: 58, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -58, remarks: "Normal" },
  { sl: 4, department: "Chemical Store (MCD)", empType: "Worker", manpower: 6, otHour: 0, otAmount: 0, tiffin: 174, nightBill: 0, totalExpenses: 174, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -174, remarks: "Normal" },
  { sl: 5, department: "Cutting 1", empType: "Worker", manpower: 7, otHour: 14, otAmount: 1223, tiffin: 0, nightBill: 0, totalExpenses: 1223, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -1223, remarks: "Urgent Order" },
  { sl: 6, department: "Dyeing Finishing", empType: "ExeStaff", manpower: 45, otHour: 0, otAmount: 0, tiffin: 1350, nightBill: 0, totalExpenses: 1350, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -1350, remarks: "Normal" },
  { sl: 7, department: "Dyeing Finishing", empType: "Worker", manpower: 19, otHour: 0, otAmount: 0, tiffin: 551, nightBill: 0, totalExpenses: 551, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -551, remarks: "Normal" },
  { sl: 8, department: "Dyeing Lab", empType: "Worker", manpower: 2, otHour: 6, otAmount: 460, tiffin: 0, nightBill: 0, totalExpenses: 460, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -460, remarks: "Lab Test" },
  { sl: 9, department: "Dyeing planning and Batch", empType: "Worker", manpower: 15, otHour: 0, otAmount: 0, tiffin: 435, nightBill: 0, totalExpenses: 435, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -435, remarks: "Normal" },
  { sl: 10, department: "Dyeing Production", empType: "ExeStaff", manpower: 7, otHour: 0, otAmount: 0, tiffin: 210, nightBill: 0, totalExpenses: 210, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -210, remarks: "Normal" },
  { sl: 11, department: "Dyeing Production", empType: "Worker", manpower: 6, otHour: 0, otAmount: 0, tiffin: 174, nightBill: 0, totalExpenses: 174, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -174, remarks: "Normal" },
  { sl: 12, department: "Fabric Quality", empType: "ExeStaff", manpower: 4, otHour: 0, otAmount: 0, tiffin: 120, nightBill: 0, totalExpenses: 120, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -120, remarks: "Normal" },
  { sl: 13, department: "Finish Fabric Store (MCD)", empType: "ExeStaff", manpower: 5, otHour: 0, otAmount: 0, tiffin: 150, nightBill: 0, totalExpenses: 150, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -150, remarks: "Normal" },
  { sl: 14, department: "Finish Fabric Store (MCD)", empType: "Worker", manpower: 14, otHour: 0, otAmount: 0, tiffin: 406, nightBill: 0, totalExpenses: 406, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -406, remarks: "Normal" },
  { sl: 15, department: "Finishing", empType: "ExeStaff", manpower: 1, otHour: 0, otAmount: 0, tiffin: 30, nightBill: 0, totalExpenses: 30, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -30, remarks: "Normal" },
  { sl: 16, department: "Finishing", empType: "Worker", manpower: 20, otHour: 0, otAmount: 0, tiffin: 591, nightBill: 0, totalExpenses: 591, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -591, remarks: "Normal" },
  { sl: 17, department: "Finishing 1", empType: "ExeStaff", manpower: 1, otHour: 0, otAmount: 0, tiffin: 30, nightBill: 0, totalExpenses: 30, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -30, remarks: "Normal" },
  { sl: 18, department: "Finishing 1", empType: "Worker", manpower: 6, otHour: 18, otAmount: 1590, tiffin: 0, nightBill: 0, totalExpenses: 1590, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -1590, remarks: "Urgent Packing" },
  { sl: 19, department: "Finishing Quality", empType: "Worker", manpower: 2, otHour: 0, otAmount: 0, tiffin: 58, nightBill: 0, totalExpenses: 58, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -58, remarks: "Normal" },
  { sl: 20, department: "General Store (MCD)", empType: "Worker", manpower: 5, otHour: 10, otAmount: 820, tiffin: 0, nightBill: 0, totalExpenses: 820, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -820, remarks: "Stock Audit" },
  { sl: 21, department: "Grey Fabric Store (MCD)", empType: "Worker", manpower: 10, otHour: 0, otAmount: 0, tiffin: 290, nightBill: 0, totalExpenses: 290, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -290, remarks: "Normal" },
  { sl: 22, department: "House Keeping", empType: "Worker", manpower: 171, otHour: 522, otAmount: 40112, tiffin: 261, nightBill: 0, totalExpenses: 40373, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -40373, remarks: "Deep Clean" },
  { sl: 23, department: "Knitting Production", empType: "ExeStaff", manpower: 29, otHour: 0, otAmount: 0, tiffin: 870, nightBill: 0, totalExpenses: 870, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -870, remarks: "Normal" },
  { sl: 24, department: "Knitting Production", empType: "Worker", manpower: 12, otHour: 0, otAmount: 0, tiffin: 348, nightBill: 0, totalExpenses: 348, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -348, remarks: "Normal" },
  { sl: 25, department: "Knitting Quality", empType: "ExeStaff", manpower: 27, otHour: 0, otAmount: 0, tiffin: 810, nightBill: 0, totalExpenses: 810, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -810, remarks: "Normal" },
  { sl: 26, department: "Maintenance RMG", empType: "ExeStaff", manpower: 2, otHour: 0, otAmount: 0, tiffin: 60, nightBill: 0, totalExpenses: 60, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -60, remarks: "Normal" },
  { sl: 27, department: "Maintenance Utility & Textile", empType: "ExeStaff", manpower: 1, otHour: 0, otAmount: 0, tiffin: 30, nightBill: 0, totalExpenses: 30, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -30, remarks: "Normal" },
  { sl: 28, department: "Maintenance Utility & Textile", empType: "Worker", manpower: 2, otHour: 0, otAmount: 0, tiffin: 58, nightBill: 0, totalExpenses: 58, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -58, remarks: "Normal" },
  { sl: 29, department: "Office Admin", empType: "Worker", manpower: 17, otHour: 30, otAmount: 2475, tiffin: 0, nightBill: 0, totalExpenses: 2475, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -2475, remarks: "Late Duty" },
  { sl: 30, department: "Printing", empType: "Worker", manpower: 1, otHour: 0, otAmount: 0, tiffin: 29, nightBill: 0, totalExpenses: 29, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -29, remarks: "Normal" },
  { sl: 31, department: "Printing Quality", empType: "ExeStaff", manpower: 7, otHour: 0, otAmount: 0, tiffin: 210, nightBill: 0, totalExpenses: 210, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -210, remarks: "Normal" },
  { sl: 32, department: "Sample", empType: "ExeStaff", manpower: 103, otHour: 0, otAmount: 0, tiffin: 9030, nightBill: 0, totalExpenses: 9030, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -9030, remarks: "Normal" },
  { sl: 33, department: "Sample", empType: "Worker", manpower: 34, otHour: 0, otAmount: 0, tiffin: 986, nightBill: 0, totalExpenses: 986, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -986, remarks: "Normal" },
  { sl: 34, department: "Security", empType: "Worker", manpower: 9, otHour: 0, otAmount: 0, tiffin: 261, nightBill: 0, totalExpenses: 261, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -261, remarks: "Normal" },
  { sl: 35, department: "Special Quality", empType: "ExeStaff", manpower: 4, otHour: 0, otAmount: 0, tiffin: 120, nightBill: 0, totalExpenses: 120, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -120, remarks: "Normal" },
  { sl: 36, department: "Transport", empType: "Worker", manpower: 1, otHour: 3, otAmount: 236, tiffin: 0, nightBill: 0, totalExpenses: 236, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -236, remarks: "Late Trip" },
  { sl: 37, department: "Yarn Store (MCD)", empType: "Worker", manpower: 40, otHour: 69, otAmount: 5363, tiffin: 319, nightBill: 0, totalExpenses: 5682, generalHrsProduction: 0, otHrsProduction: 0, avgCmPcsTaka: 0.0, ttlCmPcsIncomeTaka: 0, difference: -5682, remarks: "Yarn Unloading" },
];

const SECTIONS = [
  "ALL",
  "Sewing",
  "Accessories Store (MCD)",
  "Accessories Store 1",
  "Chemical Store (MCD)",
  "Cutting 1",
  "Dyeing Finishing",
  "Dyeing Lab",
  "Dyeing planning and Batch",
  "Dyeing Production",
  "Fabric Quality",
  "Finish Fabric Store (MCD)",
  "Finishing",
  "Finishing 1",
  "Finishing Quality",
  "General Store (MCD)",
  "Grey Fabric Store (MCD)",
  "House Keeping",
  "Knitting Production",
  "Knitting Quality",
  "Maintenance RMG",
  "Maintenance Utility & Textile",
  "Office Admin",
  "Printing",
  "Printing Quality",
  "Sample",
  "Security",
  "Special Quality",
  "Transport",
  "Yarn Store (MCD)",
];

function OvertimeSummaryReportPage() {
  const [startDate, setStartDate] = useState("2026-09-21");
  const [endDate, setEndDate] = useState("2026-09-26");
  const [sectionName, setSectionName] = useState("ALL");
  const [tableSearch, setTableSearch] = useState("");

  const filteredData = useMemo(() => {
    return SAMPLE_OT_SUMMARY_DATA.filter((item) => {
      if (sectionName !== "ALL" && item.department !== sectionName) return false;
      if (tableSearch.trim()) {
        const query = tableSearch.trim().toLowerCase();
        const matchDept = item.department.toLowerCase().includes(query);
        const matchType = item.empType.toLowerCase().includes(query);
        const matchRemarks = item.remarks.toLowerCase().includes(query);
        if (!matchDept && !matchType && !matchRemarks) return false;
      }
      return true;
    });
  }, [sectionName, tableSearch]);

  // Totals calculations
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.manpower += curr.manpower;
        acc.otHour += curr.otHour;
        acc.otAmount += curr.otAmount;
        acc.tiffin += curr.tiffin;
        acc.nightBill += curr.nightBill;
        acc.totalExpenses += curr.totalExpenses;
        acc.generalHrsProduction += curr.generalHrsProduction;
        acc.otHrsProduction += curr.otHrsProduction;
        acc.ttlCmPcsIncomeTaka += curr.ttlCmPcsIncomeTaka;
        acc.difference += curr.difference;
        return acc;
      },
      {
        manpower: 0,
        otHour: 0,
        otAmount: 0,
        tiffin: 0,
        nightBill: 0,
        totalExpenses: 0,
        generalHrsProduction: 0,
        otHrsProduction: 0,
        ttlCmPcsIncomeTaka: 0,
        difference: 0,
      }
    );
  }, [filteredData]);

  const handleReset = () => {
    setStartDate("2026-09-21");
    setEndDate("2026-09-26");
    setSectionName("ALL");
    setTableSearch("");
    toast.info("Filters reset to default.");
  };

  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Department",
      "Emp. Type",
      "Manpower",
      "OT Hour",
      "OT Amount",
      "Tiffin",
      "Night Bill",
      "Total Expenses",
      "General Hrs Production",
      "OT Hrs Production",
      "Avarage CM.Pcs(Taka)",
      "Ttl CM.Pcs Income(Taka)",
      "Difference",
      "Remarks",
    ];

    const rows = filteredData.map((r, i) => [
      (i + 1).toString(),
      r.department,
      r.empType,
      r.manpower.toString(),
      r.otHour.toString(),
      r.otAmount.toString(),
      r.tiffin.toString(),
      r.nightBill.toString(),
      r.totalExpenses.toString(),
      r.generalHrsProduction.toString(),
      r.otHrsProduction.toString(),
      r.avgCmPcsTaka.toFixed(2),
      r.ttlCmPcsIncomeTaka.toString(),
      r.difference.toString(),
      r.remarks,
    ]);

    // Total row
    rows.push([
      "Total:-",
      "",
      "",
      totals.manpower.toString(),
      totals.otHour.toString(),
      totals.otAmount.toString(),
      totals.tiffin.toString(),
      totals.nightBill.toString(),
      totals.totalExpenses.toString(),
      totals.generalHrsProduction.toString(),
      totals.otHrsProduction.toString(),
      "0.00",
      totals.ttlCmPcsIncomeTaka.toString(),
      totals.difference.toString(),
      "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Overtime_Summary_Costing_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel CSV export downloaded successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 md:p-6 space-y-5 max-w-[1600px] w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span>HR</span>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Overtime Summary Report
            </span>
          </div>

          {/* Top Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <BarChart3 className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Overtime Summary & Costing Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Overtime hours, OT amount, tiffin & night bill expenses, general vs OT production, and net CM income breakdown.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="size-4" />
                <span>EXCEL</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Printer className="size-4" />
                <span>PRINT</span>
              </button>
              <button
                onClick={() => toast.success("PDF summary generated!")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <FileText className="size-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Manpower</span>
                <Users className="size-4 text-indigo-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {totals.manpower}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Total OT Hours</span>
                <Clock className="size-4 text-indigo-500" />
              </div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {totals.otHour} <span className="text-xs font-normal text-slate-400">hrs</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">OT Amount (৳)</span>
                <DollarSign className="size-4 text-amber-500" />
              </div>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                ৳{totals.otAmount.toLocaleString()}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Total Expenses (৳)</span>
                <DollarSign className="size-4 text-rose-500" />
              </div>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                ৳{totals.totalExpenses.toLocaleString()}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs col-span-2 sm:col-span-4 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Net Difference</span>
                <Building2 className="size-4 text-purple-500" />
              </div>
              <div className={`text-xl font-extrabold mt-1 ${totals.difference < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600"}`}>
                ৳{totals.difference.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end text-xs">
              {/* Start Date */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Section Name */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Section Name
                </label>
                <select
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success(`Search executed from ${startDate} to ${endDate}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  <Search className="size-3.5" />
                  <span>SEARCH</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold transition-all cursor-pointer"
                  title="Reset Filters"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Data Table Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Table Search & Export Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Showing entries for section:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold uppercase">
                  {sectionName}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter table rows..."
                  className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Overtime Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#2c3e50] text-white uppercase tracking-wider font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-3 text-center">SL</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Emp. Type</th>
                    <th className="p-3 text-center">Manpower</th>
                    <th className="p-3 text-center">OT Hour</th>
                    <th className="p-3 text-right">OT Amount</th>
                    <th className="p-3 text-right">Tiffin</th>
                    <th className="p-3 text-right">Night Bill</th>
                    <th className="p-3 text-right bg-slate-800/80">Total Expenses</th>
                    <th className="p-3 text-center">General Hrs Production</th>
                    <th className="p-3 text-center">OT Hrs Production</th>
                    <th className="p-3 text-right">Avarage CM.Pcs(Taka)</th>
                    <th className="p-3 text-right">Ttl CM.Pcs Income(Taka)</th>
                    <th className="p-3 text-right">Difference</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
                      <tr
                        key={`${row.department}-${row.empType}-${idx}`}
                        className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-3 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white bg-slate-100/50 dark:bg-slate-800/30">
                          {row.department}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.empType === "Worker"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            }`}
                          >
                            {row.empType}
                          </span>
                        </td>
                        <td className="p-3 text-center font-extrabold text-slate-800 dark:text-slate-200">
                          {row.manpower}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.otHour}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                          {row.otAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">
                          {row.tiffin.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">
                          {row.nightBill.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-950/20">
                          {row.totalExpenses.toLocaleString()}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">
                          {row.generalHrsProduction}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">
                          {row.otHrsProduction}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-500">
                          {row.avgCmPcsTaka.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono font-semibold text-emerald-600">
                          {row.ttlCmPcsIncomeTaka}
                        </td>
                        <td className={`p-3 text-right font-mono font-extrabold ${row.difference < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600"}`}>
                          {row.difference}
                        </td>
                        <td className="p-3 text-slate-500 italic text-[11px]">
                          {row.remarks}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No overtime summary records found matching filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Total Row */}
                <tfoot className="bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold border-t-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    <td colSpan={3} className="p-3 text-left font-black tracking-wide">
                      Total:-
                    </td>
                    <td className="p-3 text-center font-mono font-black">
                      {totals.manpower}
                    </td>
                    <td className="p-3 text-center font-mono font-black text-indigo-600 dark:text-indigo-400">
                      {totals.otHour}
                    </td>
                    <td className="p-3 text-right font-mono font-black">
                      {totals.otAmount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono font-black">
                      {totals.tiffin.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono font-black">
                      {totals.nightBill.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono font-black text-rose-600 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-950/40">
                      {totals.totalExpenses.toLocaleString()}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {totals.generalHrsProduction}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {totals.otHrsProduction}
                    </td>
                    <td className="p-3 text-right font-mono">
                      0.00
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-600">
                      {totals.ttlCmPcsIncomeTaka}
                    </td>
                    <td className={`p-3 text-right font-mono font-black ${totals.difference < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600"}`}>
                      {totals.difference.toLocaleString()}
                    </td>
                    <td className="p-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bottom Footer Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Showing 1 to {filteredData.length} of {filteredData.length} entries
                </span>
                <button
                  onClick={() => toast.success("Generating PDF report...")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-lime-600 hover:bg-lime-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs uppercase tracking-wider"
                >
                  <FileDown className="size-3.5" />
                  <span>VIEW(PDF)</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold">
                <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-lg bg-lime-600 text-white font-bold">
                  1
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
