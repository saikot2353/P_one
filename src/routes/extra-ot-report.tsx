import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ChevronRight,
  ChevronDown,
  Check,
  RefreshCw,
  SlidersHorizontal,
  X,
  Timer,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/extra-ot-report")({
  head: () => ({
    meta: [
      { title: "Extra OT Report — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Detailed employee overtime hours, hourly rates, and total disbursement under Payroll Reports.",
      },
    ],
  }),
  component: ExtraOtReportPage,
});

export interface ExtraOtRecord {
  sl: number;
  empId: string;
  empIdOffc: string;
  name: string;
  empType: string;
  designation: string;
  dept: string;
  section: string;
  unit: string;
  line: string;
  gross: number;
  basic: number;
  otHour: number;
  otRate: number;
  totalOtPayment: number;
  status: string;
  year: string;
  month: string;
}

// Authentic dataset matching screenshot and extra operational profiles
export const INITIAL_EXTRA_OT_DATA: ExtraOtRecord[] = [
  {
    sl: 1,
    empId: "2022037921",
    empIdOffc: "",
    name: "Ukhaimong Marma",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 10,
    otRate: 97.11,
    totalOtPayment: 971,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 2,
    empId: "2020018300",
    empIdOffc: "",
    name: "Md. Masud Rana",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 12,
    otRate: 97.11,
    totalOtPayment: 1165,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 3,
    empId: "2022034652",
    empIdOffc: "",
    name: "Md. Soruj Bokaul",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 13,
    otRate: 97.11,
    totalOtPayment: 1262,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 4,
    empId: "2022033648",
    empIdOffc: "",
    name: "Raven Tanchangya",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 13,
    otRate: 97.11,
    totalOtPayment: 1262,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 5,
    empId: "2021031353",
    empIdOffc: "",
    name: "Ratan Chandra Barman",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 18,
    otRate: 97.11,
    totalOtPayment: 1748,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 6,
    empId: "2017008259",
    empIdOffc: "2017008259",
    name: "Md. Deen Islam Gazi",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 12,
    otRate: 97.11,
    totalOtPayment: 1165,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 7,
    empId: "2022038524",
    empIdOffc: "",
    name: "Md. Abu Arif Mia",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 18,
    otRate: 97.11,
    totalOtPayment: 1748,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 8,
    empId: "2022041220",
    empIdOffc: "",
    name: "Mst. Sarmin Khatun",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 15200,
    basic: 8500,
    otHour: 7,
    otRate: 81.73,
    totalOtPayment: 572,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 9,
    empId: "2021027143",
    empIdOffc: "",
    name: "Bipul Tanchangha",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 12,
    otRate: 97.11,
    totalOtPayment: 1165,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 10,
    empId: "2021032488",
    empIdOffc: "",
    name: "Md. Akter Biswas",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 13,
    otRate: 97.11,
    totalOtPayment: 1262,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 11,
    empId: "2019013632",
    empIdOffc: "2019013632",
    name: "Md. Habibur Rahman",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 13,
    otRate: 97.11,
    totalOtPayment: 1262,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 12,
    empId: "2020020208",
    empIdOffc: "",
    name: "Mrs. Khadija Khatun",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 3,
    otRate: 97.11,
    totalOtPayment: 291,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 13,
    empId: "2022037255",
    empIdOffc: "",
    name: "Mohidul Fakir",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 9,
    otRate: 97.11,
    totalOtPayment: 874,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 14,
    empId: "2022039134",
    empIdOffc: "",
    name: "Azim Molla",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 9,
    otRate: 97.11,
    totalOtPayment: 874,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 15,
    empId: "2019014130",
    empIdOffc: "2019014130",
    name: "Md. Shohidul Islam",
    empType: "Worker",
    designation: "Security Guard",
    dept: "Admin and Compliance",
    section: "Security",
    unit: "N/A",
    line: "N/A",
    gross: 17599,
    basic: 10099,
    otHour: 14,
    otRate: 97.11,
    totalOtPayment: 1360,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 16,
    empId: "2023041512",
    empIdOffc: "2023041512",
    name: "Md. Rasel Hossain",
    empType: "Worker",
    designation: "Senior Sewing Operator",
    dept: "Sewing",
    section: "Line-01",
    unit: "Unit-01",
    line: "Line-01",
    gross: 18500,
    basic: 11000,
    otHour: 22,
    otRate: 105.77,
    totalOtPayment: 2327,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 17,
    empId: "2021029410",
    empIdOffc: "",
    name: "Mst. Sharmin Akter",
    empType: "Worker",
    designation: "Sewing Operator",
    dept: "Sewing",
    section: "Line-02",
    unit: "Unit-01",
    line: "Line-02",
    gross: 16200,
    basic: 9200,
    otHour: 16,
    otRate: 88.46,
    totalOtPayment: 1415,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 18,
    empId: "2020015520",
    empIdOffc: "2020015520",
    name: "Md. Anowar Hossain",
    empType: "Staff",
    designation: "Quality Inspector",
    dept: "Quality",
    section: "Finishing QA",
    unit: "Unit-02",
    line: "N/A",
    gross: 22500,
    basic: 13500,
    otHour: 15,
    otRate: 129.81,
    totalOtPayment: 1947,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 19,
    empId: "2022038102",
    empIdOffc: "",
    name: "Nasima Begum",
    empType: "Worker",
    designation: "Finishing Helper",
    dept: "Finishing",
    section: "Iron & Packing",
    unit: "Unit-02",
    line: "Line-03",
    gross: 14500,
    basic: 8100,
    otHour: 8,
    otRate: 77.88,
    totalOtPayment: 623,
    status: "Maternity",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 20,
    empId: "2018009211",
    empIdOffc: "2018009211",
    name: "Md. Kamal Hossain",
    empType: "Worker",
    designation: "Cutting Operator",
    dept: "Cutting",
    section: "Manual Cutting",
    unit: "Unit-01",
    line: "N/A",
    gross: 17800,
    basic: 10200,
    otHour: 14,
    otRate: 98.08,
    totalOtPayment: 1373,
    status: "Resigned",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 21,
    empId: "2019011844",
    empIdOffc: "",
    name: "Md. Jahangir Alam",
    empType: "Worker",
    designation: "Senior Maintenance Tech",
    dept: "Maintenance",
    section: "Electrical",
    unit: "Unit-01",
    line: "N/A",
    gross: 24000,
    basic: 14500,
    otHour: 25,
    otRate: 139.42,
    totalOtPayment: 3486,
    status: "Working",
    year: "2026",
    month: "Sep",
  },
  {
    sl: 22,
    empId: "2022036128",
    empIdOffc: "",
    name: "Rubel Mia",
    empType: "Worker",
    designation: "Fabric Loader",
    dept: "Cutting",
    section: "Spreading",
    unit: "Unit-02",
    line: "N/A",
    gross: 15000,
    basic: 8400,
    otHour: 11,
    otRate: 80.77,
    totalOtPayment: 888,
    status: "Lefty",
    year: "2026",
    month: "Sep",
  },
];

const ALL_STATUS_OPTIONS = ["Working", "Resigned", "Lefty", "Maternity"];

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  Working: {
    label: "Working",
    badgeClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
  },
  Resigned: {
    label: "Resigned",
    badgeClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    dotClass: "bg-amber-500",
  },
  Lefty: {
    label: "Lefty",
    badgeClass: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    dotClass: "bg-rose-500",
  },
  Maternity: {
    label: "Maternity",
    badgeClass: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    dotClass: "bg-purple-500",
  },
};

export function ExtraOtReportPage() {
  // Filter States matching screenshot
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Sep");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "Working",
    "Resigned",
    "Lefty",
    "Maternity",
  ]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");

  // Applied Filter Trigger State
  const [appliedFilters, setAppliedFilters] = useState({
    year: "2026",
    month: "Sep",
    statuses: ["Working", "Resigned", "Lefty", "Maternity"],
    department: "All Departments",
    section: "ALL",
    unit: "ALL",
    line: "ALL",
    employeeId: "",
    idType: "System" as "System" | "Office",
  });

  // Table Search and Sorting
  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState<keyof ExtraOtRecord>("sl");
  const [sortAsc, setSortAsc] = useState(true);

  // PDF Preview Modal
  const [isReportPdfModalOpen, setIsReportPdfModalOpen] = useState(false);

  // Dynamic filter dropdown options
  const departmentOptions = useMemo(() => {
    const set = new Set(INITIAL_EXTRA_OT_DATA.map((r) => r.dept).filter(Boolean));
    return ["All Departments", ...Array.from(set).sort()];
  }, []);

  const sectionOptions = useMemo(() => {
    const filtered =
      department === "All Departments"
        ? INITIAL_EXTRA_OT_DATA
        : INITIAL_EXTRA_OT_DATA.filter((r) => r.dept === department);
    const set = new Set(filtered.map((r) => r.section).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [department]);

  const unitOptions = useMemo(() => {
    const set = new Set(INITIAL_EXTRA_OT_DATA.map((r) => r.unit).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const lineOptions = useMemo(() => {
    const set = new Set(INITIAL_EXTRA_OT_DATA.map((r) => r.line).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  // Multi-status tag helpers
  const handleRemoveStatus = (st: string) => {
    setSelectedStatuses((prev) => prev.filter((s) => s !== st));
  };

  const handleAddStatus = (st: string) => {
    if (!selectedStatuses.includes(st)) {
      setSelectedStatuses((prev) => [...prev, st]);
    }
  };

  // Close status dropdown on click outside
  useEffect(() => {
    if (!isStatusDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".status-dropdown-container")) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isStatusDropdownOpen]);

  // Search & Reset
  const handleGetSalaryData = () => {
    setIsStatusDropdownOpen(false);
    setAppliedFilters({
      year,
      month,
      statuses: [...selectedStatuses],
      department,
      section,
      unit,
      line,
      employeeId: employeeIdInput,
      idType,
    });
    toast.success("Filtering Extra OT data...");
  };

  const handleReset = () => {
    setIsStatusDropdownOpen(false);
    setYear("2026");
    setMonth("Sep");
    setSelectedStatuses(["Working", "Resigned", "Lefty", "Maternity"]);
    setDepartment("All Departments");
    setSection("ALL");
    setUnit("ALL");
    setLine("ALL");
    setEmployeeIdInput("");
    setIdType("System");
    setTableSearch("");
    setAppliedFilters({
      year: "2026",
      month: "Sep",
      statuses: ["Working", "Resigned", "Lefty", "Maternity"],
      department: "All Departments",
      section: "ALL",
      unit: "ALL",
      line: "ALL",
      employeeId: "",
      idType: "System",
    });
    toast.info("Filter criteria reset to default.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_EXTRA_OT_DATA.filter((item) => {
      // Year & Month
      if (appliedFilters.year !== "ALL" && item.year !== appliedFilters.year) return false;
      if (appliedFilters.month !== "ALL" && item.month !== appliedFilters.month) return false;

      // Statuses (must be in selected statuses)
      if (
        appliedFilters.statuses.length > 0 &&
        !appliedFilters.statuses.includes(item.status)
      ) {
        return false;
      }

      // Department, Section, Unit, Line
      if (
        appliedFilters.department !== "All Departments" &&
        item.dept !== appliedFilters.department
      )
        return false;
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section)
        return false;
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) return false;
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) return false;

      // Employee ID (supports comma-separated list as labeled in UI: "use comma as separator")
      if (appliedFilters.employeeId.trim()) {
        const targetId = appliedFilters.idType === "System" ? item.empId : item.empIdOffc;
        const searchTokens = appliedFilters.employeeId
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);

        if (searchTokens.length > 0) {
          const matched = searchTokens.some((tok) => targetId.toLowerCase().includes(tok));
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
          item.dept.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q);
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

  const handleSort = (field: keyof ExtraOtRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Aggregated totals
  const totalSummary = useMemo(() => {
    return sortedData.reduce(
      (acc, r) => {
        acc.gross += r.gross;
        acc.basic += r.basic;
        acc.otHour += r.otHour;
        acc.totalPayment += r.totalOtPayment;
        return acc;
      },
      { gross: 0, basic: 0, otHour: 0, totalPayment: 0 },
    );
  }, [sortedData]);

  // Excel CSV Export
  const handleExportExcel = () => {
    const headers = [
      "SL",
      "EmpId",
      "Emp Id(Off)",
      "Name",
      "Emp. Type",
      "Designation",
      "Dept.",
      "Section",
      "Unit",
      "Gross",
      "Basic",
      "OT Hour",
      "OT Rate",
      "Total OT Payment",
      "Status",
    ];

    const rows = sortedData.map((r, i) => [
      (i + 1).toString(),
      r.empId,
      r.empIdOffc,
      r.name,
      r.empType,
      r.designation,
      r.dept,
      r.section,
      r.unit,
      r.gross.toFixed(2),
      r.basic.toFixed(2),
      r.otHour.toString(),
      r.otRate.toFixed(2),
      r.totalOtPayment.toString(),
      r.status,
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
      `Extra_OT_Report_${appliedFilters.year}_${appliedFilters.month}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Extra OT Excel report exported successfully!");
  };

  // Browser Print
  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // PDF Modal Column Definitions
  const pdfColumns: ColumnDef<ExtraOtRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "EmpId", accessor: (r) => r.empId, align: "center", width: "85px" },
    { header: "Emp Id(Off)", accessor: (r) => r.empIdOffc || "—", align: "center", width: "85px" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Emp. Type", accessor: (r) => r.empType, align: "center", width: "70px" },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Dept.", accessor: (r) => r.dept },
    { header: "Section", accessor: (r) => r.section },
    { header: "Unit", accessor: (r) => r.unit, align: "center", width: "50px" },
    {
      header: "Gross (৳)",
      accessor: (r) => r.gross.toLocaleString("en-US", { minimumFractionDigits: 2 }),
      align: "right",
    },
    {
      header: "Basic (৳)",
      accessor: (r) => r.basic.toLocaleString("en-US", { minimumFractionDigits: 2 }),
      align: "right",
    },
    { header: "OT Hour", accessor: (r) => r.otHour, align: "center", width: "55px" },
    {
      header: "OT Rate",
      accessor: (r) => r.otRate.toFixed(2),
      align: "right",
      width: "60px",
    },
    {
      header: "Total OT Payment (৳)",
      accessor: (r) => r.totalOtPayment.toLocaleString(),
      align: "right",
    },
    { header: "Status", accessor: (r) => r.status, align: "center", width: "70px" },
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
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Extra OT</span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Timer className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Extra OT Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monthly employee extra overtime hours, rates, and total disbursement audit under Payroll Reports.
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

          {/* EXACT SEARCH & FILTER CRITERIA MATCHING SCREENSHOT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 border-l-4 border-l-blue-500 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Controls Grid */}
            <div className="space-y-4 text-xs">
              {/* Row 1: Year, Month, Status */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Year */}
                <div className="md:col-span-3 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="ALL">ALL Years</option>
                  </select>
                </div>

                {/* Month */}
                <div className="md:col-span-3 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Sep">Sep</option>
                    <option value="Jan">Jan</option>
                    <option value="Feb">Feb</option>
                    <option value="Mar">Mar</option>
                    <option value="Apr">Apr</option>
                    <option value="May">May</option>
                    <option value="Jun">Jun</option>
                    <option value="Jul">Jul</option>
                    <option value="Aug">Aug</option>
                    <option value="Oct">Oct</option>
                    <option value="Nov">Nov</option>
                    <option value="Dec">Dec</option>
                    <option value="ALL">ALL Months</option>
                  </select>
                </div>

                {/* Multiselectable Status Dropdown */}
                <div className="md:col-span-6 space-y-1 relative status-dropdown-container">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Status
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {selectedStatuses.length} of {ALL_STATUS_OPTIONS.length} selected
                    </span>
                  </div>

                  {/* Dropdown Trigger Bar */}
                  <div
                    onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
                    className={`w-full min-h-[38px] px-2.5 py-1.5 rounded-xl border bg-white dark:bg-slate-800 flex items-center justify-between gap-2 cursor-pointer transition select-none ${
                      isStatusDropdownOpen
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                      {selectedStatuses.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">
                          Select status (click to choose)...
                        </span>
                      ) : (
                        selectedStatuses.map((st) => (
                          <span
                            key={st}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{st}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveStatus(st);
                              }}
                              className="hover:bg-slate-200 dark:hover:bg-slate-600 rounded p-0.5 transition cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title={`Remove ${st}`}
                            >
                              <X className="size-3 stroke-[2.5]" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-slate-400">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          isStatusDropdownOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Floating Multiselect Dropdown Menu */}
                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1.5 z-40 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2.5 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-900 dark:text-slate-100">
                      <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <span>Filter Status Options</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedStatuses([...ALL_STATUS_OPTIONS])}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-bold"
                          >
                            Select All
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setSelectedStatuses([])}
                            className="text-slate-400 hover:text-rose-500 hover:underline cursor-pointer font-bold"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {ALL_STATUS_OPTIONS.map((st) => {
                          const isSelected = selectedStatuses.includes(st);
                          const conf = STATUS_CONFIG[st];

                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedStatuses((prev) => prev.filter((s) => s !== st));
                                } else {
                                  setSelectedStatuses((prev) => [...prev, st]);
                                }
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition cursor-pointer text-xs ${
                                isSelected
                                  ? "bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`size-4 rounded border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                  }`}
                                >
                                  {isSelected && <Check className="size-2.5 stroke-[3.5]" />}
                                </div>
                                <span className="font-bold">{st}</span>
                              </div>

                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                  conf?.badgeClass || ""
                                }`}
                              >
                                {st}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Department, Section, Unit, Line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Department */}
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

                {/* Section */}
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

                {/* Unit */}
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

                {/* Line */}
                <div className="space-y-1">
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
              </div>

              {/* Row 3: Employee Id, Radio options (System / Office), and GET SALARY DATA Button */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-1">
                {/* Employee Id */}
                <div className="md:col-span-6 space-y-1">
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

                {/* Radio: System / Office */}
                <div className="md:col-span-3 pb-2 flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
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

                {/* GET SALARY DATA Button */}
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleGetSalaryData}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Search className="size-4" />
                    <span>GET SALARY DATA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION TOOLBAR & RESULTS TABLE CARD (EXACT STYLE MATCH) */}
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

            {/* HIGH-FIDELITY DATA TABLE WITH EXACT COLUMN SEQUENCE */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-[11px] text-left border-collapse min-w-[1450px]">
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

                    {/* 2. EmpId */}
                    <th
                      onClick={() => handleSort("empId")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>EmpId</span>
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
                        {sortField === "empIdOffc" && <ArrowUpDown className="size-3 text-blue-500" />}
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

                    {/* 5. Emp. Type */}
                    <th
                      onClick={() => handleSort("empType")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Emp. Type</span>
                        {sortField === "empType" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 6. Designation */}
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

                    {/* 7. Dept. */}
                    <th
                      onClick={() => handleSort("dept")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Dept.</span>
                        {sortField === "dept" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 8. Section */}
                    <th
                      onClick={() => handleSort("section")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Section</span>
                        {sortField === "section" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 9. Unit */}
                    <th
                      onClick={() => handleSort("unit")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Unit</span>
                        {sortField === "unit" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 10. Gross */}
                    <th
                      onClick={() => handleSort("gross")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Gross</span>
                        {sortField === "gross" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 11. Basic */}
                    <th
                      onClick={() => handleSort("basic")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Basic</span>
                        {sortField === "basic" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 12. OT Hour */}
                    <th
                      onClick={() => handleSort("otHour")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>OT Hour</span>
                        {sortField === "otHour" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 13. OT Rate */}
                    <th
                      onClick={() => handleSort("otRate")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>OT Rate</span>
                        {sortField === "otRate" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>

                    {/* 14. Total OT Payment */}
                    <th
                      onClick={() => handleSort("totalOtPayment")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Total OT Payment</span>
                        {sortField === "totalOtPayment" && (
                          <ArrowUpDown className="size-3 text-blue-500" />
                        )}
                      </div>
                    </th>

                    {/* 15. Status */}
                    <th
                      onClick={() => handleSort("status")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Status</span>
                        {sortField === "status" && <ArrowUpDown className="size-3 text-blue-500" />}
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {sortedData.length > 0 ? (
                    sortedData.map((row, idx) => (
                      <tr
                        key={row.empId}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* 1. SL */}
                        <td className="p-2.5 text-center font-bold text-slate-500 dark:text-slate-400">
                          {idx + 1}
                        </td>

                        {/* 2. EmpId */}
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

                        {/* 5. Emp. Type */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.empType}
                        </td>

                        {/* 6. Designation */}
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                          {row.designation}
                        </td>

                        {/* 7. Dept. */}
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-medium">
                          {row.dept}
                        </td>

                        {/* 8. Section */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.section}
                        </td>

                        {/* 9. Unit */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.unit}
                        </td>

                        {/* 10. Gross */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {row.gross.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                        </td>

                        {/* 11. Basic */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.basic.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                        </td>

                        {/* 12. OT Hour */}
                        <td className="p-2.5 text-center font-mono font-bold text-slate-900 dark:text-white">
                          {row.otHour}
                        </td>

                        {/* 13. OT Rate */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.otRate.toFixed(2)}
                        </td>

                        {/* 14. Total OT Payment */}
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {row.totalOtPayment.toLocaleString()}
                        </td>

                        {/* 15. Status */}
                        <td className="p-2.5 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              row.status === "Working"
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : row.status === "Resigned"
                                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                  : row.status === "Lefty"
                                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                    : "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="p-10 text-center text-slate-400 dark:text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <span className="font-bold text-xs">
                            No Extra OT records match the specified search and filter criteria.
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
                      <td colSpan={9} className="p-2.5 text-right uppercase tracking-wider text-[10px]">
                        Total Summary ({sortedData.length} Employees):
                      </td>
                      <td className="p-2.5 text-right font-mono text-slate-800 dark:text-slate-200">
                        {totalSummary.gross.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                      </td>
                      <td className="p-2.5 text-right font-mono text-slate-800 dark:text-slate-200">
                        {totalSummary.basic.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                      </td>
                      <td className="p-2.5 text-center font-mono text-indigo-600 dark:text-indigo-400">
                        {totalSummary.otHour.toLocaleString()}
                      </td>
                      <td className="p-2.5"></td>
                      <td className="p-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-black">
                        {totalSummary.totalPayment.toLocaleString()} BDT
                      </td>
                      <td className="p-2.5"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination & Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing 1 to {sortedData.length} of {sortedData.length} entries (Total Disbursed: ৳{totalSummary.totalPayment.toLocaleString()})
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
        reportTitle="Extra OT Report"
        companyName="Pakiza Knit Composite Ltd"
        dateRange={`Year: ${appliedFilters.year} • Month: ${appliedFilters.month}`}
        columns={pdfColumns}
        data={sortedData}
        totalRow={
          <tr>
            <td colSpan={9} className="p-2 text-right font-bold text-[10px] uppercase">
              Total / Summary:
            </td>
            <td className="p-2 text-right font-mono font-bold text-[10px]">
              {totalSummary.gross.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
            <td className="p-2 text-right font-mono font-bold text-[10px]">
              {totalSummary.basic.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
            <td className="p-2 text-center font-mono font-bold text-[10px]">
              {totalSummary.otHour}
            </td>
            <td className="p-2"></td>
            <td className="p-2 text-right font-mono font-bold text-[10px] text-emerald-600">
              {totalSummary.totalPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
            <td className="p-2"></td>
          </tr>
        }
      />
    </div>
  );
}
