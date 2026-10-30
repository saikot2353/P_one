import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Moon,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/night-allowance-report")({
  head: () => ({
    meta: [
      { title: "Night Allowance Report — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Employee night shift attendance, in/out timestamps, and allowance disbursement audit under Payroll Reports.",
      },
    ],
  }),
  component: NightAllowanceReportPage,
});

export interface NightAllowanceRecord {
  sl: number;
  empId: string;
  empIdOffc: string;
  name: string;
  empType: string;
  department: string;
  section: string;
  designation: string;
  line: string;
  unit: string;
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
  nightAllow: number;
  status: string;
}

// Data extracted directly from screenshot and complemented with active shifts
export const INITIAL_NIGHT_ALLOWANCE_DATA: NightAllowanceRecord[] = [
  {
    sl: 1,
    empId: "2022037464",
    empIdOffc: "",
    name: "Asit Sutradhar",
    empType: "Worker",
    department: "RMG Operations",
    section: "Cutting",
    designation: "Jr. Lay Man",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "08:07:14",
    outDate: "28/10/2026",
    outTime: "08:05:03",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 2,
    empId: "2023044531",
    empIdOffc: "",
    name: "Salim Miya",
    empType: "Worker",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Jr. Packing Man",
    line: "N/A",
    unit: "Unit-05",
    inDate: "27/10/2026",
    inTime: "07:59:12",
    outDate: "27/10/2026",
    outTime: "23:00:25",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 3,
    empId: "2024051738",
    empIdOffc: "",
    name: "Alom Sarker",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:46:58",
    outDate: "28/10/2026",
    outTime: "01:02:46",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 4,
    empId: "2026061838",
    empIdOffc: "",
    name: "Md. Rasel Mia",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:51:25",
    outDate: "28/10/2026",
    outTime: "01:00:42",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 5,
    empId: "2024051139",
    empIdOffc: "",
    name: "Amajul",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:51:36",
    outDate: "28/10/2026",
    outTime: "01:00:40",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 6,
    empId: "2024050913",
    empIdOffc: "",
    name: "Md. Shafiq Mia",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:48:04",
    outDate: "28/10/2026",
    outTime: "01:02:40",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 7,
    empId: "2020019684",
    empIdOffc: "",
    name: "Md. Babul",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:46:31",
    outDate: "28/10/2026",
    outTime: "01:01:28",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 8,
    empId: "2025054521",
    empIdOffc: "",
    name: "Md. Saifur Rahman",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:42:23",
    outDate: "28/10/2026",
    outTime: "01:01:11",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 9,
    empId: "2018010907",
    empIdOffc: "2018010907",
    name: "Md. Jewel Rana",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:50:12",
    outDate: "28/10/2026",
    outTime: "01:00:21",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 10,
    empId: "2025054520",
    empIdOffc: "",
    name: "Bimal Ojha",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:42:52",
    outDate: "28/10/2026",
    outTime: "01:00:36",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 11,
    empId: "2025054369",
    empIdOffc: "",
    name: "Sabuj Sikder",
    empType: "Production Executive",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Jr. Officer",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:54:56",
    outDate: "28/10/2026",
    outTime: "01:03:02",
    nightAllow: 210,
    status: "Working",
  },
  {
    sl: 12,
    empId: "2024050917",
    empIdOffc: "",
    name: "Md. Amir",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:46:39",
    outDate: "28/10/2026",
    outTime: "01:00:34",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 13,
    empId: "2025054368",
    empIdOffc: "",
    name: "Md. Rayhan Uddin",
    empType: "Production Executive",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Jr. Officer",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "08:02:51",
    outDate: "28/10/2026",
    outTime: "01:09:09",
    nightAllow: 210,
    status: "Working",
  },
  {
    sl: 14,
    empId: "2026061665",
    empIdOffc: "",
    name: "Md. Razu Molla",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Grey Fabric Store (MCD)",
    designation: "Loader",
    line: "N/A",
    unit: "N/A",
    inDate: "27/10/2026",
    inTime: "07:50:42",
    outDate: "28/10/2026",
    outTime: "01:00:54",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 15,
    empId: "2023044120",
    empIdOffc: "2023044120",
    name: "Md. Jahid Hasan",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Operator",
    line: "Line-01",
    unit: "Unit-01",
    inDate: "27/10/2026",
    inTime: "08:00:10",
    outDate: "28/10/2026",
    outTime: "02:15:30",
    nightAllow: 100,
    status: "Working",
  },
  {
    sl: 16,
    empId: "2021032155",
    empIdOffc: "",
    name: "Faruk Hossain",
    empType: "Staff",
    department: "Maintenance",
    section: "Electrical",
    designation: "Electrician",
    line: "N/A",
    unit: "Unit-02",
    inDate: "27/10/2026",
    inTime: "07:45:00",
    outDate: "28/10/2026",
    outTime: "04:30:00",
    nightAllow: 150,
    status: "Working",
  },
  {
    sl: 17,
    empId: "2022039912",
    empIdOffc: "2022039912",
    name: "Shah Alam",
    empType: "Production Executive",
    department: "RMG Operations",
    section: "Finishing",
    designation: "Floor In-Charge",
    line: "N/A",
    unit: "Unit-05",
    inDate: "27/10/2026",
    inTime: "08:10:00",
    outDate: "28/10/2026",
    outTime: "01:45:00",
    nightAllow: 210,
    status: "Working",
  },
  {
    sl: 18,
    empId: "2024050218",
    empIdOffc: "",
    name: "Mst. Parvin Akter",
    empType: "Worker",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Iron Operator",
    line: "N/A",
    unit: "Unit-05",
    inDate: "27/10/2026",
    inTime: "07:55:00",
    outDate: "27/10/2026",
    outTime: "23:45:00",
    nightAllow: 100,
    status: "Working",
  },
];

export function NightAllowanceReportPage() {
  // Filter States matching the exact screenshot
  const [fromDate, setFromDate] = useState("27/10/2026");
  const [toDate, setToDate] = useState("27/10/2026");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");

  const [line, setLine] = useState("ALL");
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  const [status, setStatus] = useState("Working");
  const [reportType, setReportType] = useState("Details");
  const [employeeType, setEmployeeType] = useState("ALL");

  // Applied Filter Trigger State
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: "27/10/2026",
    toDate: "27/10/2026",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    line: "ALL",
    employeeId: "",
    idType: "System" as "System" | "Office",
    status: "Working",
    reportType: "Details",
    employeeType: "ALL",
  });

  // Table Search and Sorting
  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState<keyof NightAllowanceRecord>("sl");
  const [sortAsc, setSortAsc] = useState(true);

  // PDF Preview Modal
  const [isReportPdfModalOpen, setIsReportPdfModalOpen] = useState(false);

  // Dynamic filter lists
  const departmentOptions = useMemo(() => {
    const set = new Set(INITIAL_NIGHT_ALLOWANCE_DATA.map((r) => r.department).filter(Boolean));
    return ["All Departments", ...Array.from(set).sort()];
  }, []);

  const sectionOptions = useMemo(() => {
    const filtered =
      department === "All Departments"
        ? INITIAL_NIGHT_ALLOWANCE_DATA
        : INITIAL_NIGHT_ALLOWANCE_DATA.filter((r) => r.department === department);
    const set = new Set(filtered.map((r) => r.section).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [department]);

  const designationOptions = useMemo(() => {
    const set = new Set(INITIAL_NIGHT_ALLOWANCE_DATA.map((r) => r.designation).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const unitOptions = useMemo(() => {
    const set = new Set(INITIAL_NIGHT_ALLOWANCE_DATA.map((r) => r.unit).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const lineOptions = useMemo(() => {
    const set = new Set(INITIAL_NIGHT_ALLOWANCE_DATA.map((r) => r.line).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const employeeTypeOptions = useMemo(() => {
    const set = new Set(INITIAL_NIGHT_ALLOWANCE_DATA.map((r) => r.empType).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  // Search & Reset
  const handleSearch = () => {
    setAppliedFilters({
      fromDate,
      toDate,
      department,
      section,
      designation,
      unit,
      line,
      employeeId: employeeIdInput,
      idType,
      status,
      reportType,
      employeeType,
    });
    toast.success("Filtering Night Allowance report...");
  };

  const handleReset = () => {
    setFromDate("27/10/2026");
    setToDate("27/10/2026");
    setDepartment("All Departments");
    setSection("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setLine("ALL");
    setEmployeeIdInput("");
    setIdType("System");
    setStatus("Working");
    setReportType("Details");
    setEmployeeType("ALL");
    setTableSearch("");
    setAppliedFilters({
      fromDate: "27/10/2026",
      toDate: "27/10/2026",
      department: "All Departments",
      section: "ALL",
      designation: "ALL",
      unit: "ALL",
      line: "ALL",
      employeeId: "",
      idType: "System",
      status: "Working",
      reportType: "Details",
      employeeType: "ALL",
    });
    toast.info("Filter criteria reset to default.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_NIGHT_ALLOWANCE_DATA.filter((item) => {
      // Department
      if (
        appliedFilters.department !== "All Departments" &&
        item.department !== appliedFilters.department
      )
        return false;

      // Section
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section)
        return false;

      // Designation
      if (
        appliedFilters.designation !== "ALL" &&
        item.designation !== appliedFilters.designation
      )
        return false;

      // Unit & Line
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) return false;
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) return false;

      // Employee Type
      if (
        appliedFilters.employeeType !== "ALL" &&
        item.empType !== appliedFilters.employeeType
      )
        return false;

      // Status
      if (appliedFilters.status !== "ALL" && item.status !== appliedFilters.status)
        return false;

      // Employee Id lookup (comma separated support as shown in UI: "use comma as separator")
      if (appliedFilters.employeeId.trim()) {
        const targetId = appliedFilters.idType === "System" ? item.empId : item.empIdOffc;
        const tokens = appliedFilters.employeeId
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);

        if (tokens.length > 0) {
          const matched = tokens.some((tok) => targetId.toLowerCase().includes(tok));
          if (!matched) return false;
        }
      }

      // Quick Search input in toolbar
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        const matches =
          item.empId.toLowerCase().includes(q) ||
          item.empIdOffc.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q) ||
          item.inDate.toLowerCase().includes(q) ||
          item.outDate.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [appliedFilters, tableSearch]);

  // Sorting
  const sortedData = useMemo(() => {
    const list = [...filteredData];
    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return list;
  }, [filteredData, sortField, sortAsc]);

  const handleSort = (field: keyof NightAllowanceRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Aggregated total allowance
  const totalAllowanceSum = useMemo(() => {
    return sortedData.reduce((sum, r) => sum + r.nightAllow, 0);
  }, [sortedData]);

  // Excel CSV Export
  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Emp Id(Off)",
      "Name",
      "Emp Type",
      "Department",
      "Section",
      "Designation",
      "Line",
      "Unit",
      "In Date",
      "In Time",
      "Out Date",
      "Out Time",
      "Night Allow.",
    ];

    const rows = sortedData.map((r, i) => [
      (i + 1).toString(),
      r.empId,
      r.empIdOffc,
      r.name,
      r.empType,
      r.department,
      r.section,
      r.designation,
      r.line,
      r.unit,
      r.inDate,
      r.inTime,
      r.outDate,
      r.outTime,
      r.nightAllow.toString(),
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
    link.href = url;
    link.setAttribute(
      "download",
      `Night_Allowance_Report_${appliedFilters.fromDate.replace(/\//g, "-")}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Night Allowance Excel report exported successfully!");
  };

  // Browser Print
  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // PDF Columns Definition for HRReportPdfModal
  const pdfColumns: ColumnDef<NightAllowanceRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "35px" },
    { header: "Emp ID", accessor: (r) => r.empId, align: "center", width: "85px" },
    { header: "Emp Id(Off)", accessor: (r) => r.empIdOffc || "—", align: "center", width: "80px" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Emp Type", accessor: (r) => r.empType, align: "center", width: "70px" },
    { header: "Department", accessor: (r) => r.department },
    { header: "Section", accessor: (r) => r.section },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Line", accessor: (r) => r.line, align: "center", width: "45px" },
    { header: "Unit", accessor: (r) => r.unit, align: "center", width: "45px" },
    { header: "In Date", accessor: (r) => r.inDate, align: "center", width: "75px" },
    { header: "In Time", accessor: (r) => r.inTime, align: "center", width: "65px" },
    { header: "Out Date", accessor: (r) => r.outDate, align: "center", width: "75px" },
    { header: "Out Time", accessor: (r) => r.outTime, align: "center", width: "65px" },
    {
      header: "Night Allow. (৳)",
      accessor: (r) => r.nightAllow.toLocaleString(),
      align: "right",
      width: "80px",
    },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1750px] mx-auto w-full print:p-0">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium print:hidden">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/payroll-reports" className="hover:text-primary transition-colors">
              Payroll Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Night Allowance Report
            </span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Moon className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Night Allowance Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Overnight shift timings, in/out biometric punches, and night allowance disbursement ledger under Payroll Reports.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* SEARCH & FILTER CRITERIA PANEL MATCHING SCREENSHOT EXACTLY */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 border-l-4 border-l-blue-500 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Controls Grid */}
            <div className="space-y-4 text-xs">
              {/* Row 1: From Date, To Date, Department, Section, Designation, Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* 1. From Date */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    From Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Calendar className="size-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. To Date */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    To Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Calendar className="size-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Department */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {departmentOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Section */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {sectionOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Designation */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Designation
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {designationOptions.map((des) => (
                      <option key={des} value={des}>
                        {des}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Unit */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {unitOptions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Line, Employee Id with (System / Office) radio, Status, Report Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 items-end">
                {/* 7. Line */}
                <div className="md:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Line
                  </label>
                  <select
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {lineOptions.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 8. Employee Id */}
                <div className="md:col-span-4 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Employee Id
                  </label>
                  <input
                    type="text"
                    placeholder="use comma as separator"
                    value={employeeIdInput}
                    onChange={(e) => setEmployeeIdInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold placeholder:text-slate-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* System / Office Radios */}
                <div className="md:col-span-2 pb-2 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="idType"
                      checked={idType === "System"}
                      onChange={() => setIdType("System")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>System</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="idType"
                      checked={idType === "Office"}
                      onChange={() => setIdType("Office")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Office</span>
                  </label>
                </div>

                {/* 9. Status */}
                <div className="md:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Working">Working</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Lefty">Lefty</option>
                    <option value="Maternity">Maternity</option>
                    <option value="ALL">ALL</option>
                  </select>
                </div>

                {/* 10. Report Type */}
                <div className="md:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Details">Details</option>
                    <option value="Summary">Summary</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Employee Type and SEARCH Button */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-8 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Employee Type
                  </label>
                  <select
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {employeeTypeOptions.map((et) => (
                      <option key={et} value={et}>
                        {et}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Search className="size-4" />
                    <span>SEARCH</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION TOOLBAR & RESULTS TABLE CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Toolbar Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              {/* Quick Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="size-4" />
                  <span>EXCEL</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>PRINT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsReportPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileText className="size-4" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Instant Search Box */}
              <div className="flex items-center gap-2 w-full sm:w-72">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Search:
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search in table..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY DATA TABLE MATCHING EXACT SCREENSHOT */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-[11px] text-left border-collapse min-w-[1400px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    {/* 1. SL */}
                    <th
                      onClick={() => handleSort("sl")}
                      className="p-2.5 w-12 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>SL</span>
                        {sortField === "sl" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 2. Emp ID */}
                    <th
                      onClick={() => handleSort("empId")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Emp ID</span>
                        {sortField === "empId" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 3. Emp Id(Off) */}
                    <th
                      onClick={() => handleSort("empIdOffc")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Emp Id(Off)</span>
                        {sortField === "empIdOffc" && (
                          <ArrowUpDown className="size-3 text-blue-500" />
                        )}
                      </div>
                    </th>

                    {/* 4. Name */}
                    <th
                      onClick={() => handleSort("name")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Name</span>
                        {sortField === "name" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 5. Emp Type */}
                    <th
                      onClick={() => handleSort("empType")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Emp Type</span>
                        {sortField === "empType" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 6. Department */}
                    <th
                      onClick={() => handleSort("department")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Department</span>
                        {sortField === "department" && (
                          <ArrowUpDown className="size-3 text-blue-500" />
                        )}
                      </div>
                    </th>

                    {/* 7. Section */}
                    <th
                      onClick={() => handleSort("section")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Section</span>
                        {sortField === "section" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 8. Designation */}
                    <th
                      onClick={() => handleSort("designation")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Designation</span>
                        {sortField === "designation" && (
                          <ArrowUpDown className="size-3 text-blue-500" />
                        )}
                      </div>
                    </th>

                    {/* 9. Line */}
                    <th
                      onClick={() => handleSort("line")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Line</span>
                        {sortField === "line" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 10. Unit */}
                    <th
                      onClick={() => handleSort("unit")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Unit</span>
                        {sortField === "unit" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 11. In Date */}
                    <th
                      onClick={() => handleSort("inDate")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>In Date</span>
                        {sortField === "inDate" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 12. In Time */}
                    <th
                      onClick={() => handleSort("inTime")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>In Time</span>
                        {sortField === "inTime" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 13. Out Date */}
                    <th
                      onClick={() => handleSort("outDate")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Out Date</span>
                        {sortField === "outDate" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 14. Out Time */}
                    <th
                      onClick={() => handleSort("outTime")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Out Time</span>
                        {sortField === "outTime" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 15. Night Allow. */}
                    <th
                      onClick={() => handleSort("nightAllow")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Night Allow.</span>
                        {sortField === "nightAllow" && (
                          <ArrowUpDown className="size-3 text-blue-500" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {sortedData.length > 0 ? (
                    sortedData.map((row, idx) => (
                      <tr
                        key={`${row.empId}-${idx}`}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* 1. SL */}
                        <td className="p-2.5 text-center font-bold text-slate-500 dark:text-slate-400">
                          {idx + 1}
                        </td>

                        {/* 2. Emp ID */}
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.empId}
                        </td>

                        {/* 3. Emp Id(Off) */}
                        <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300">
                          {row.empIdOffc || "—"}
                        </td>

                        {/* 4. Name */}
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>

                        {/* 5. Emp Type */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.empType}
                        </td>

                        {/* 6. Department */}
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-medium">
                          {row.department}
                        </td>

                        {/* 7. Section */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.section}
                        </td>

                        {/* 8. Designation */}
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                          {row.designation}
                        </td>

                        {/* 9. Line */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.line}
                        </td>

                        {/* 10. Unit */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.unit}
                        </td>

                        {/* 11. In Date */}
                        <td className="p-2.5 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.inDate}
                        </td>

                        {/* 12. In Time */}
                        <td className="p-2.5 text-center font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {row.inTime}
                        </td>

                        {/* 13. Out Date */}
                        <td className="p-2.5 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.outDate}
                        </td>

                        {/* 14. Out Time */}
                        <td className="p-2.5 text-center font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {row.outTime}
                        </td>

                        {/* 15. Night Allow. */}
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {row.nightAllow.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="p-10 text-center text-slate-400 dark:text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <span className="font-bold text-xs">
                            No Night Allowance records found for the specified filter criteria.
                          </span>
                          <button
                            type="button"
                            onClick={handleReset}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1 cursor-pointer"
                          >
                            Clear and Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Summary / Total Footer Row */}
                {sortedData.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 font-extrabold text-[11px] text-slate-900 dark:text-white">
                      <td colSpan={14} className="p-2.5 text-right uppercase tracking-wider text-[10px]">
                        Total Summary ({sortedData.length} Personnel):
                      </td>
                      <td className="p-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-black">
                        {totalAllowanceSum.toLocaleString()} BDT
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination & Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing 1 to {sortedData.length} of {sortedData.length} entries (Total Night Allowance: ৳{totalAllowanceSum.toLocaleString()})
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <FileText className="size-3.5" />
                  <span>VIEW (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FULL PRINT / PDF PREVIEW MODAL */}
      <HRReportPdfModal
        isOpen={isReportPdfModalOpen}
        onClose={() => setIsReportPdfModalOpen(false)}
        reportTitle="Night Allowance Report"
        companyName="Pakiza Knit Composite Ltd"
        dateRange={`From: ${appliedFilters.fromDate} • To: ${appliedFilters.toDate}`}
        columns={pdfColumns}
        data={sortedData}
        totalRow={
          <tr>
            <td colSpan={14} className="p-2 text-right font-bold text-[10px] uppercase">
              Total Night Allowance:
            </td>
            <td className="p-2 text-right font-mono font-bold text-[10px] text-emerald-600">
              {totalAllowanceSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
          </tr>
        }
      />
    </div>
  );
}

