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
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  Pencil,
  X,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/increment-queuelist")({
  head: () => ({
    meta: [
      { title: "Increment QueueList — CRIPTON HRIS" },
      {
        name: "description",
        content: "Employee salary increment queue and verification list under HR Reports.",
      },
    ],
  }),
  component: IncrementQueueListPage,
});

export interface IncrementQueueRecord {
  sl: number;
  id: string; // Emp ID
  name: string;
  department: string;
  section: string;
  designation: string;
  joiningDate: string;
  prevGross: number;
  lastIncDate: string;
  lastIncAmount: number;
  grossAfterInc: number;
  company: string;
  area: string;
  employeeType: string;
  unit: string;
  line: string;
  status: string;
  year: string;
  month: string;
}

const INITIAL_QUEUE_DATA: IncrementQueueRecord[] = [
  {
    sl: 1,
    id: "2025057343",
    name: "Md. Sazzadul Alam",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Helper",
    joiningDate: "11/10/2025",
    prevGross: 12500,
    lastIncDate: "11/10/2025",
    lastIncAmount: 1200,
    grossAfterInc: 13700,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-01",
    line: "Line-01",
    status: "Working",
    year: "2026",
    month: "October",
  },
  {
    sl: 2,
    id: "2025057364",
    name: "Tania Khatun",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    joiningDate: "12/10/2025",
    prevGross: 14000,
    lastIncDate: "12/10/2025",
    lastIncAmount: 1500,
    grossAfterInc: 15500,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-01",
    line: "Line-02",
    status: "Working",
    year: "2026",
    month: "October",
  },
  {
    sl: 3,
    id: "2025057367",
    name: "Most. Jharna Begom",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    joiningDate: "12/10/2025",
    prevGross: 14000,
    lastIncDate: "12/10/2025",
    lastIncAmount: 1500,
    grossAfterInc: 15500,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-01",
    line: "Line-03",
    status: "Working",
    year: "2026",
    month: "October",
  },
  {
    sl: 4,
    id: "2025057370",
    name: "Mst. Rupa Akter",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    joiningDate: "12/10/2025",
    prevGross: 14200,
    lastIncDate: "12/10/2025",
    lastIncAmount: 1500,
    grossAfterInc: 15700,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-02",
    line: "Line-01",
    status: "Working",
    year: "2026",
    month: "October",
  },
  {
    sl: 5,
    id: "2025057372",
    name: "Md. Shahedul Islam",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Operator (Sewing)",
    joiningDate: "12/10/2025",
    prevGross: 16500,
    lastIncDate: "12/10/2025",
    lastIncAmount: 1800,
    grossAfterInc: 18300,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-02",
    line: "Line-04",
    status: "Working",
    year: "2026",
    month: "October",
  },
  {
    sl: 6,
    id: "2025057375",
    name: "Md. Zahid Miya",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Iron Man",
    joiningDate: "11/10/2025",
    prevGross: 15000,
    lastIncDate: "11/10/2025",
    lastIncAmount: 1600,
    grossAfterInc: 16600,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-03",
    line: "Finishing-01",
    status: "Working",
    year: "2026",
    month: "October",
  },
  {
    sl: 7,
    id: "2025057378",
    name: "Md. Ahsan Habib",
    department: "RMG Operations",
    section: "Printing",
    designation: "Jr. Operator (Printing)",
    joiningDate: "12/10/2025",
    prevGross: 14500,
    lastIncDate: "12/10/2025",
    lastIncAmount: 1500,
    grossAfterInc: 16000,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-02",
    line: "Print-01",
    status: "Working",
    year: "2026",
    month: "October",
  },
  {
    sl: 8,
    id: "2025057380",
    name: "Md. Saiful Islam",
    department: "RMG Operations",
    section: "Embroidery",
    designation: "Jr. Operator (Embroidery)",
    joiningDate: "12/10/2025",
    prevGross: 14800,
    lastIncDate: "12/10/2025",
    lastIncAmount: 1500,
    grossAfterInc: 16300,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-03",
    line: "Emb-02",
    status: "Working",
    year: "2026",
    month: "October",
  },
  {
    sl: 9,
    id: "2025057385",
    name: "Mst. Salma Khatun",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Senior Operator",
    joiningDate: "05/08/2024",
    prevGross: 17500,
    lastIncDate: "01/01/2026",
    lastIncAmount: 2000,
    grossAfterInc: 19500,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Worker",
    unit: "Unit-01",
    line: "Line-02",
    status: "Working",
    year: "2026",
    month: "January",
  },
  {
    sl: 10,
    id: "2025057392",
    name: "Md. Al-Amin Hossain",
    department: "Quality Assurance",
    section: "Finishing QA",
    designation: "Quality Inspector",
    joiningDate: "15/09/2024",
    prevGross: 18000,
    lastIncDate: "01/01/2026",
    lastIncAmount: 2200,
    grossAfterInc: 20200,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Staff",
    unit: "Unit-03",
    line: "QA-01",
    status: "Working",
    year: "2026",
    month: "January",
  },
  {
    sl: 11,
    id: "2025057401",
    name: "Farzana Yasmin",
    department: "Admin and HR",
    section: "Compliance",
    designation: "Executive",
    joiningDate: "01/02/2024",
    prevGross: 32000,
    lastIncDate: "01/01/2026",
    lastIncAmount: 3500,
    grossAfterInc: 35500,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Office Executive",
    unit: "Unit-01",
    line: "Admin",
    status: "Working",
    year: "2026",
    month: "January",
  },
  {
    sl: 12,
    id: "2025057415",
    name: "Md. Robiul Islam",
    department: "Maintenance",
    section: "Electrical",
    designation: "Senior Electrician",
    joiningDate: "10/05/2023",
    prevGross: 24000,
    lastIncDate: "01/01/2026",
    lastIncAmount: 2500,
    grossAfterInc: 26500,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "Staff",
    unit: "Unit-02",
    line: "Utility",
    status: "Working",
    year: "2026",
    month: "January",
  },
];

export function IncrementQueueListPage() {
  // Filter States (matching hr-report-new-joining-info style & screenshot)
  const [company, setCompany] = useState("Pakiza Knit Composite Ltd");
  const [area, setArea] = useState("PKCL-Savar");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [employeeId, setEmployeeId] = useState("");
  const [option, setOption] = useState("ALL");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("ALL");

  // Table Search and Sorting
  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState<keyof IncrementQueueRecord>("sl");
  const [sortAsc, setSortAsc] = useState(true);

  // PDF Modal
  const [isReportPdfModalOpen, setIsReportPdfModalOpen] = useState(false);

  // Applied Filter Trigger
  const [appliedFilters, setAppliedFilters] = useState({
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    employeeType: "ALL",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    line: "ALL",
    status: "Working",
    employeeId: "",
    option: "ALL",
    year: "2026",
    month: "ALL",
  });

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<IncrementQueueRecord | null>(null);
  const [editIncAmount, setEditIncAmount] = useState<number>(0);
  const [records, setRecords] = useState<IncrementQueueRecord[]>(INITIAL_QUEUE_DATA);

  const handleSearch = () => {
    setAppliedFilters({
      company,
      area,
      employeeType,
      department,
      section,
      designation,
      unit,
      line,
      status,
      employeeId,
      option,
      year,
      month,
    });
    toast.success("Filtering Increment QueueList report...");
  };

  const handleReset = () => {
    setCompany("Pakiza Knit Composite Ltd");
    setArea("PKCL-Savar");
    setEmployeeType("ALL");
    setDepartment("All Departments");
    setSection("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setLine("ALL");
    setStatus("Working");
    setEmployeeId("");
    setOption("ALL");
    setYear("2026");
    setMonth("ALL");
    setTableSearch("");
    setAppliedFilters({
      company: "Pakiza Knit Composite Ltd",
      area: "PKCL-Savar",
      employeeType: "ALL",
      department: "All Departments",
      section: "ALL",
      designation: "ALL",
      unit: "ALL",
      line: "ALL",
      status: "Working",
      employeeId: "",
      option: "ALL",
      year: "2026",
      month: "ALL",
    });
    toast.info("Filter criteria reset to default.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return records.filter((item) => {
      if (appliedFilters.company !== "ALL" && item.company !== appliedFilters.company) return false;
      if (appliedFilters.area !== "ALL" && item.area !== appliedFilters.area) return false;
      if (appliedFilters.employeeType !== "ALL" && item.employeeType !== appliedFilters.employeeType) return false;
      if (appliedFilters.department !== "All Departments" && item.department !== appliedFilters.department) return false;
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section) return false;
      if (appliedFilters.designation !== "ALL" && item.designation !== appliedFilters.designation) return false;
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) return false;
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) return false;
      if (appliedFilters.status !== "ALL" && item.status !== appliedFilters.status) return false;
      if (appliedFilters.employeeId && !item.id.toLowerCase().includes(appliedFilters.employeeId.toLowerCase())) return false;
      if (appliedFilters.year !== "ALL" && item.year !== appliedFilters.year) return false;
      if (appliedFilters.month !== "ALL" && item.month !== appliedFilters.month) return false;

      // Table search
      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matches =
          item.id.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.section.toLowerCase().includes(query) ||
          item.designation.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [records, appliedFilters, tableSearch]);

  // Sort
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

  const handleSort = (field: keyof IncrementQueueRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Edit increment modal handler
  const handleEditClick = (rec: IncrementQueueRecord) => {
    setEditingRecord(rec);
    setEditIncAmount(rec.lastIncAmount);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    setRecords((prev) =>
      prev.map((r) =>
        r.id === editingRecord.id
          ? {
              ...r,
              lastIncAmount: editIncAmount,
              grossAfterInc: r.prevGross + editIncAmount,
            }
          : r
      )
    );
    toast.success(`Increment adjustment saved for ${editingRecord.name}.`);
    setEditingRecord(null);
  };

  // Export handlers
  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Name",
      "Department",
      "Section",
      "Designation",
      "Joining Date",
      "Prev. Gross",
      "Last Inc Date",
      "Last Inc Amount",
      "Gross after Inc.",
    ];

    const rows = sortedData.map((r, i) => [
      (i + 1).toString(),
      r.id,
      r.name,
      r.department,
      r.section,
      r.designation,
      r.joiningDate,
      r.prevGross.toFixed(2),
      r.lastIncDate,
      r.lastIncAmount.toFixed(2),
      r.grossAfterInc.toFixed(2),
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
    link.setAttribute("download", `Increment_QueueList_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel report exported successfully!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // PDF Columns Definition for HRReportPdfModal
  const pdfColumns: ColumnDef<IncrementQueueRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "Emp ID", accessor: (r) => r.id, align: "center", width: "90px" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Department", accessor: (r) => r.department },
    { header: "Section", accessor: (r) => r.section },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Joining Date", accessor: (r) => r.joiningDate, align: "center", width: "85px" },
    {
      header: "Prev. Gross (৳)",
      accessor: (r) => r.prevGross.toLocaleString("en-US", { minimumFractionDigits: 2 }),
      align: "right",
    },
    { header: "Last Inc Date", accessor: (r) => r.lastIncDate, align: "center", width: "85px" },
    {
      header: "Last Inc Amount (৳)",
      accessor: (r) => r.lastIncAmount.toLocaleString("en-US", { minimumFractionDigits: 2 }),
      align: "right",
    },
    {
      header: "Gross after Inc. (৳)",
      accessor: (r) => r.grossAfterInc.toLocaleString("en-US", { minimumFractionDigits: 2 }),
      align: "right",
    },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full print:p-0">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium print:hidden">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-primary transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Increment QueueList
            </span>
          </div>

          {/* Page Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Increment QueueList Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Filter, monitor, and export queued employee salary increments and historical adjustments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* COMPREHENSIVE SEARCH & FILTER PANEL (MATCHING HR-REPORT-NEW-JOINING-INFO STYLE) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-xs">
              {/* 1. Company */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Company
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                  <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                  <option value="ALL">ALL Companies</option>
                </select>
              </div>

              {/* 2. Area Name */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="PKCL-Savar">PKCL-Savar</option>
                  <option value="PSL-Operation">PSL-Operation</option>
                  <option value="ALL">ALL Areas</option>
                </select>
              </div>

              {/* 3. Employee Type */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Employee Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Types</option>
                  <option value="Worker">Worker</option>
                  <option value="Staff">Staff</option>
                  <option value="Office Executive">Office Executive</option>
                </select>
              </div>

              {/* 4. Department */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="RMG Operations">RMG Operations</option>
                  <option value="Finishing Department">Finishing Department</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Admin and HR">Admin and HR</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {/* 5. Section */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Sections</option>
                  <option value="Sewing">Sewing</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Printing">Printing</option>
                  <option value="Embroidery">Embroidery</option>
                  <option value="Finishing QA">Finishing QA</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              {/* 6. Designation */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Designations</option>
                  <option value="Helper">Helper</option>
                  <option value="Jr. Operator (Sewing)">Jr. Operator (Sewing)</option>
                  <option value="Operator (Sewing)">Operator (Sewing)</option>
                  <option value="Iron Man">Iron Man</option>
                  <option value="Jr. Operator (Printing)">Jr. Operator (Printing)</option>
                  <option value="Jr. Operator (Embroidery)">Jr. Operator (Embroidery)</option>
                  <option value="Senior Operator">Senior Operator</option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Executive">Executive</option>
                  <option value="Senior Electrician">Senior Electrician</option>
                </select>
              </div>

              {/* 7. Unit */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Units</option>
                  <option value="Unit-01">Unit-01</option>
                  <option value="Unit-02">Unit-02</option>
                  <option value="Unit-03">Unit-03</option>
                </select>
              </div>

              {/* 8. Line */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Line
                </label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Lines</option>
                  <option value="Line-01">Line-01</option>
                  <option value="Line-02">Line-02</option>
                  <option value="Line-03">Line-03</option>
                  <option value="Line-04">Line-04</option>
                </select>
              </div>

              {/* 9. Status */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Working">Working</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                  <option value="ALL">ALL Statuses</option>
                </select>
              </div>

              {/* 10. Employee ID */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Employee ID
                </label>
                <input
                  type="text"
                  placeholder="Search by ID..."
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 11. Option */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Option
                </label>
                <select
                  value={option}
                  onChange={(e) => setOption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Queue">Queue List</option>
                  <option value="Proposed">Proposed</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>

              {/* 12. Year */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="ALL">ALL Years</option>
                </select>
              </div>

              {/* 13. Month */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Months</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
            </div>

            {/* Search Trigger Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
              >
                <Search className="size-4" />
                <span>SEARCH REPORT</span>
              </button>
            </div>
          </div>

          {/* ACTION TOOLBAR & RESULTS TABLE CARD (MATCHING HR-REPORT-NEW-JOINING-INFO STYLE) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Toolbar Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              {/* Quick Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="size-4" />
                  <span>EXCEL</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>PRINT</span>
                </button>

                <button
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
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5 w-12 text-center">Action</th>
                    <th
                      onClick={() => handleSort("sl")}
                      className="p-2.5 w-10 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      #
                    </th>
                    <th
                      onClick={() => handleSort("id")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Emp ID
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Name
                    </th>
                    <th
                      onClick={() => handleSort("department")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Department
                    </th>
                    <th
                      onClick={() => handleSort("section")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Section
                    </th>
                    <th
                      onClick={() => handleSort("designation")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Designation
                    </th>
                    <th
                      onClick={() => handleSort("joiningDate")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Joining Date
                    </th>
                    <th
                      onClick={() => handleSort("prevGross")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Prev. Gross
                    </th>
                    <th
                      onClick={() => handleSort("lastIncDate")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Last Inc Date
                    </th>
                    <th
                      onClick={() => handleSort("lastIncAmount")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Last Inc Amount
                    </th>
                    <th
                      onClick={() => handleSort("grossAfterInc")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Gross after Inc.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {sortedData.length > 0 ? (
                    sortedData.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Action Pencil Icon */}
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleEditClick(row)}
                            className="p-1 rounded text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Edit / Adjust Increment"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        </td>

                        {/* # */}
                        <td className="p-2.5 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>

                        {/* Emp ID */}
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.id}
                        </td>

                        {/* Name */}
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>

                        {/* Department */}
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                          {row.department}
                        </td>

                        {/* Section */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.section}
                        </td>

                        {/* Designation */}
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {row.designation}
                        </td>

                        {/* Joining Date */}
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.joiningDate}
                        </td>

                        {/* Prev. Gross */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.prevGross.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Last Inc Date */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.lastIncDate}
                        </td>

                        {/* Last Inc Amount */}
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {row.lastIncAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Gross after Inc. */}
                        <td className="p-2.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.grossAfterInc.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No matching increment queue records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing 1 to {sortedData.length} of {sortedData.length} entries
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsReportPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>VIEW (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* EDIT / ADJUST INCREMENT MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Adjust Increment Proposal
                </h3>
                <p className="text-xs text-slate-500">
                  {editingRecord.name} ({editingRecord.id})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-semibold">{editingRecord.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold">{editingRecord.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current / Prev Gross:</span>
                  <span className="font-mono font-bold">{editingRecord.prevGross.toLocaleString()} BDT</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Proposed Increment Amount (BDT) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={editIncAmount}
                  onChange={(e) => setEditIncAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex justify-between items-center font-bold">
                <span className="text-blue-900 dark:text-blue-200">New Gross after Inc:</span>
                <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  {(editingRecord.prevGross + (Number(editIncAmount) || 0)).toLocaleString()} BDT
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL PRINT / PDF PREVIEW MODAL (STANDARDIZED HR REPORT PDF) */}
      <HRReportPdfModal
        isOpen={isReportPdfModalOpen}
        onClose={() => setIsReportPdfModalOpen(false)}
        reportTitle="Increment QueueList Report"
        companyName={appliedFilters.company !== "ALL" ? appliedFilters.company : "Pakiza Knit Composite Ltd"}
        dateRange={`Year: ${appliedFilters.year} • Month: ${appliedFilters.month}`}
        columns={pdfColumns}
        data={sortedData}
        totalRow={
          <tr>
            <td colSpan={7} className="p-2 text-right font-bold text-[10px] uppercase">
              Total / Summary:
            </td>
            <td className="p-2 text-right font-mono font-bold text-[10px]">
              {sortedData.reduce((sum, r) => sum + r.prevGross, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
            <td className="p-2"></td>
            <td className="p-2 text-right font-mono font-bold text-[10px] text-emerald-600">
              {sortedData.reduce((sum, r) => sum + r.lastIncAmount, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
            <td className="p-2 text-right font-mono font-bold text-[10px]">
              {sortedData.reduce((sum, r) => sum + r.grossAfterInc, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
          </tr>
        }
      />
    </div>
  );
}
