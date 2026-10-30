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
  Clock,
  RefreshCw,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/pending-ot-request")({
  head: () => ({
    meta: [
      { title: "Pending OT Request — CRIPTON HRIS" },
      {
        name: "description",
        content: "Track, inspect, and approve pending overtime requisitions and authorized amounts.",
      },
    ],
  }),
  component: PendingOTRequestPage,
});

export interface OTRequestRecord {
  sl: number;
  empId: string;
  empIdOff: string;
  name: string;
  type: string;
  department: string;
  designation: string;
  unit: string;
  line: string;
  date: string;
  inTime: string;
  otReq: string; // e.g. "2.0 hrs"
  otHoursNum: number;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  requisitionType: "Regular OT" | "Extra OT" | "Weekend OT" | "Holiday OT";
}

const INITIAL_OT_DATA: OTRequestRecord[] = [
  {
    sl: 1,
    empId: "2025057343",
    empIdOff: "2025057343",
    name: "Md. Sazzadul Alam",
    type: "Worker",
    department: "RMG Operations",
    designation: "Helper",
    unit: "Unit-01",
    line: "Line-01",
    date: "28/10/2026",
    inTime: "08:00 AM",
    otReq: "2.5 hrs",
    otHoursNum: 2.5,
    amount: 320.0,
    status: "Pending",
    requisitionType: "Regular OT",
  },
  {
    sl: 2,
    empId: "2025057364",
    empIdOff: "2025057364",
    name: "Tania Khatun",
    type: "Worker",
    department: "RMG Operations",
    designation: "Jr. Operator (Sewing)",
    unit: "Unit-01",
    line: "Line-02",
    date: "28/10/2026",
    inTime: "08:05 AM",
    otReq: "3.0 hrs",
    otHoursNum: 3.0,
    amount: 450.0,
    status: "Pending",
    requisitionType: "Regular OT",
  },
  {
    sl: 3,
    empId: "2025057367",
    empIdOff: "2025057367",
    name: "Most. Jharna Begom",
    type: "Worker",
    department: "RMG Operations",
    designation: "Jr. Operator (Sewing)",
    unit: "Unit-01",
    line: "Line-03",
    date: "28/10/2026",
    inTime: "07:58 AM",
    otReq: "2.0 hrs",
    otHoursNum: 2.0,
    amount: 300.0,
    status: "Pending",
    requisitionType: "Regular OT",
  },
  {
    sl: 4,
    empId: "2025057370",
    empIdOff: "2025057370",
    name: "Mst. Rupa Akter",
    type: "Worker",
    department: "RMG Operations",
    designation: "Jr. Operator (Sewing)",
    unit: "Unit-02",
    line: "Line-01",
    date: "28/10/2026",
    inTime: "08:02 AM",
    otReq: "3.5 hrs",
    otHoursNum: 3.5,
    amount: 525.0,
    status: "Pending",
    requisitionType: "Extra OT",
  },
  {
    sl: 5,
    empId: "2025057372",
    empIdOff: "2025057372",
    name: "Md. Shahedul Islam",
    type: "Worker",
    department: "RMG Operations",
    designation: "Operator (Sewing)",
    unit: "Unit-02",
    line: "Line-04",
    date: "28/10/2026",
    inTime: "08:00 AM",
    otReq: "2.0 hrs",
    otHoursNum: 2.0,
    amount: 360.0,
    status: "Pending",
    requisitionType: "Regular OT",
  },
  {
    sl: 6,
    empId: "2025057376",
    empIdOff: "2025057376",
    name: "Md. Masud Rana",
    type: "Worker",
    department: "RMG Operations",
    designation: "Iron Man",
    unit: "Unit-01",
    line: "Line-02",
    date: "28/10/2026",
    inTime: "08:10 AM",
    otReq: "4.0 hrs",
    otHoursNum: 4.0,
    amount: 600.0,
    status: "Pending",
    requisitionType: "Extra OT",
  },
  {
    sl: 7,
    empId: "2025057379",
    empIdOff: "2025057379",
    name: "Rasel Mia",
    type: "Worker",
    department: "Finishing Department",
    designation: "Jr. Operator (Printing)",
    unit: "Unit-03",
    line: "Line-01",
    date: "28/10/2026",
    inTime: "08:00 AM",
    otReq: "2.5 hrs",
    otHoursNum: 2.5,
    amount: 400.0,
    status: "Pending",
    requisitionType: "Regular OT",
  },
  {
    sl: 8,
    empId: "2025057382",
    empIdOff: "2025057382",
    name: "Sumon Ali",
    type: "Worker",
    department: "Finishing Department",
    designation: "Jr. Operator (Embroidery)",
    unit: "Unit-03",
    line: "Line-02",
    date: "28/10/2026",
    inTime: "07:55 AM",
    otReq: "3.0 hrs",
    otHoursNum: 3.0,
    amount: 480.0,
    status: "Pending",
    requisitionType: "Regular OT",
  },
  {
    sl: 9,
    empId: "2025057385",
    empIdOff: "2025057385",
    name: "Mst. Sharmin Akter",
    type: "Worker",
    department: "Quality Assurance",
    designation: "Quality Inspector",
    unit: "Unit-01",
    line: "Line-03",
    date: "28/10/2026",
    inTime: "08:00 AM",
    otReq: "2.0 hrs",
    otHoursNum: 2.0,
    amount: 380.0,
    status: "Pending",
    requisitionType: "Regular OT",
  },
  {
    sl: 10,
    empId: "2025057388",
    empIdOff: "2025057388",
    name: "Md. Al-Amin",
    type: "Staff",
    department: "Maintenance",
    designation: "Senior Electrician",
    unit: "Unit-02",
    line: "N/A",
    date: "28/10/2026",
    inTime: "08:00 AM",
    otReq: "4.0 hrs",
    otHoursNum: 4.0,
    amount: 720.0,
    status: "Pending",
    requisitionType: "Weekend OT",
  },
  {
    sl: 11,
    empId: "2025057391",
    empIdOff: "2025057391",
    name: "Kamrul Hasan",
    type: "Staff",
    department: "Admin and HR",
    designation: "Executive",
    unit: "PSL",
    line: "N/A",
    date: "28/10/2026",
    inTime: "08:30 AM",
    otReq: "2.0 hrs",
    otHoursNum: 2.0,
    amount: 450.0,
    status: "Approved",
    requisitionType: "Regular OT",
  },
  {
    sl: 12,
    empId: "2025057394",
    empIdOff: "2025057394",
    name: "Shahidul Islam",
    type: "Worker",
    department: "RMG Operations",
    designation: "Senior Operator",
    unit: "Unit-01",
    line: "Line-04",
    date: "28/10/2026",
    inTime: "08:15 AM",
    otReq: "1.5 hrs",
    otHoursNum: 1.5,
    amount: 270.0,
    status: "Approved",
    requisitionType: "Regular OT",
  },
  {
    sl: 13,
    empId: "2025057398",
    empIdOff: "2025057398",
    name: "Mst. Salma Khatun",
    type: "Worker",
    department: "RMG Operations",
    designation: "Helper",
    unit: "Unit-02",
    line: "Line-02",
    date: "28/10/2026",
    inTime: "08:00 AM",
    otReq: "2.0 hrs",
    otHoursNum: 2.0,
    amount: 260.0,
    status: "Rejected",
    requisitionType: "Regular OT",
  },
];

export function PendingOTRequestPage() {
  // Filter States matching the user's provided criteria image
  const [startDate, setStartDate] = useState("2026-10-28");
  const [endDate, setEndDate] = useState("2026-10-28");
  const [status, setStatus] = useState("Pending");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [requisitionType, setRequisitionType] = useState("All");
  const [employeeId, setEmployeeId] = useState("");

  // Applied Filters State for the SEARCH button
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "2026-10-28",
    endDate: "2026-10-28",
    status: "Pending",
    employeeType: "ALL",
    department: "ALL",
    jobTitle: "ALL",
    unit: "ALL",
    line: "ALL",
    requisitionType: "All",
    employeeId: "",
  });

  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState<keyof OTRequestRecord>("sl");
  const [sortAsc, setSortAsc] = useState(true);
  const [isReportPdfModalOpen, setIsReportPdfModalOpen] = useState(false);
  const [records, setRecords] = useState<OTRequestRecord[]>(INITIAL_OT_DATA);

  // Search Action
  const handleSearch = () => {
    setAppliedFilters({
      startDate,
      endDate,
      status,
      employeeType,
      department,
      jobTitle,
      unit,
      line,
      requisitionType,
      employeeId,
    });
    toast.success("Filtering Pending OT Requests report...");
  };

  // Reset Action
  const handleReset = () => {
    setStartDate("2026-10-28");
    setEndDate("2026-10-28");
    setStatus("Pending");
    setEmployeeType("ALL");
    setDepartment("ALL");
    setJobTitle("ALL");
    setUnit("ALL");
    setLine("ALL");
    setRequisitionType("All");
    setEmployeeId("");
    setTableSearch("");
    setAppliedFilters({
      startDate: "2026-10-28",
      endDate: "2026-10-28",
      status: "Pending",
      employeeType: "ALL",
      department: "ALL",
      jobTitle: "ALL",
      unit: "ALL",
      line: "ALL",
      requisitionType: "All",
      employeeId: "",
    });
    toast.info("Filter criteria reset to default.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return records.filter((item) => {
      // Status filter
      if (appliedFilters.status !== "ALL" && item.status !== appliedFilters.status) {
        return false;
      }
      // Employee Type
      if (appliedFilters.employeeType !== "ALL" && item.type !== appliedFilters.employeeType) {
        return false;
      }
      // Department
      if (appliedFilters.department !== "ALL" && item.department !== appliedFilters.department) {
        return false;
      }
      // Job Title / Designation
      if (appliedFilters.jobTitle !== "ALL" && item.designation !== appliedFilters.jobTitle) {
        return false;
      }
      // Unit
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) {
        return false;
      }
      // Line
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) {
        return false;
      }
      // Requisition Type
      if (
        appliedFilters.requisitionType !== "All" &&
        item.requisitionType !== appliedFilters.requisitionType
      ) {
        return false;
      }
      // Employee Id
      if (
        appliedFilters.employeeId.trim() &&
        !item.empId.toLowerCase().includes(appliedFilters.employeeId.trim().toLowerCase()) &&
        !item.empIdOff.toLowerCase().includes(appliedFilters.employeeId.trim().toLowerCase())
      ) {
        return false;
      }

      // Instant Table search
      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matches =
          item.empId.toLowerCase().includes(query) ||
          item.empIdOff.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.designation.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.unit.toLowerCase().includes(query) ||
          item.line.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [records, appliedFilters, tableSearch]);

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

  const handleSort = (field: keyof OTRequestRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Excel Export
  const handleExportExcel = () => {
    const headers = [
      "#",
      "Emp ID",
      "Emp ID(Off)",
      "Name",
      "Type",
      "Department",
      "Designation",
      "Unit",
      "Line",
      "Date",
      "In Time",
      "OT Req",
      "Amount",
      "Status",
    ];

    const rows = sortedData.map((r, i) => [
      (i + 1).toString(),
      r.empId,
      r.empIdOff,
      r.name,
      r.type,
      r.department,
      r.designation,
      r.unit,
      r.line,
      r.date,
      r.inTime,
      r.otReq,
      r.amount.toFixed(2),
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
      `Pending_OT_Request_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
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
  const pdfColumns: ColumnDef<OTRequestRecord>[] = [
    { header: "#", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "Emp ID", accessor: (r) => r.empId, align: "center", width: "85px" },
    { header: "Emp ID(Off)", accessor: (r) => r.empIdOff, align: "center", width: "85px" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Type", accessor: (r) => r.type, width: "70px" },
    { header: "Department", accessor: (r) => r.department },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Unit", accessor: (r) => r.unit, align: "center", width: "65px" },
    { header: "Line", accessor: (r) => r.line, align: "center", width: "65px" },
    { header: "Date", accessor: (r) => r.date, align: "center", width: "80px" },
    { header: "In Time", accessor: (r) => r.inTime, align: "center", width: "75px" },
    { header: "OT Req", accessor: (r) => r.otReq, align: "center", width: "70px" },
    {
      header: "Amount (৳)",
      accessor: (r) => r.amount.toLocaleString("en-US", { minimumFractionDigits: 2 }),
      align: "right",
      width: "80px",
    },
    { header: "Status", accessor: (r) => r.status, align: "center", width: "70px" },
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
              Pending OT Request
            </span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Clock className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Pending OT Request Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monitor, verify, and export employee overtime requisitions and pending allowance queues.
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

          {/* SEARCH & FILTER CRITERIA PANEL (EXACTLY AS SHOWN IN USER IMAGE) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Form Fields: Two Rows as per provided UI reference */}
            <div className="space-y-4 text-xs">
              {/* Row 1: Start Date, End Date, Status, Employee Type, Department, Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* 1. Start Date */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* 2. End Date */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* 3. Status */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="ALL">ALL Statuses</option>
                  </select>
                </div>

                {/* 4. Employee Type */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Type
                  </label>
                  <select
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Worker">Worker</option>
                    <option value="Staff">Staff</option>
                    <option value="Office Executive">Office Executive</option>
                  </select>
                </div>

                {/* 5. Department */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="RMG Operations">RMG Operations</option>
                    <option value="Finishing Department">Finishing Department</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Admin and HR">Admin and HR</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* 6. Job Title / Designation */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Job Title
                  </label>
                  <select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
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
              </div>

              {/* Row 2: Unit, Line, Requisition Type, Employee Id, SEARCH button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
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
                    <option value="ALL">ALL</option>
                    <option value="Unit-01">Unit-01</option>
                    <option value="Unit-02">Unit-02</option>
                    <option value="Unit-03">Unit-03</option>
                    <option value="PSL">PSL</option>
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
                    <option value="ALL">ALL</option>
                    <option value="Line-01">Line-01</option>
                    <option value="Line-02">Line-02</option>
                    <option value="Line-03">Line-03</option>
                    <option value="Line-04">Line-04</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>

                {/* 9. Requisition Type */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Requisition Type
                  </label>
                  <select
                    value={requisitionType}
                    onChange={(e) => setRequisitionType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All</option>
                    <option value="Regular OT">Regular OT</option>
                    <option value="Extra OT">Extra OT</option>
                    <option value="Weekend OT">Weekend OT</option>
                    <option value="Holiday OT">Holiday OT</option>
                  </select>
                </div>

                {/* 10. Employee Id */}
                <div className="space-y-1 xl:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Id
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Employee ID..."
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* 11. SEARCH Button */}
                <div className="space-y-1">
                  <button
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95 uppercase tracking-wider"
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

            {/* Data Table: Exactly matching the 14 columns from user image */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th
                      onClick={() => handleSort("sl")}
                      className="p-2.5 w-10 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      #
                    </th>
                    <th
                      onClick={() => handleSort("empId")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Emp ID
                    </th>
                    <th
                      onClick={() => handleSort("empIdOff")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Emp ID(Off)
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Name
                    </th>
                    <th
                      onClick={() => handleSort("type")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Type
                    </th>
                    <th
                      onClick={() => handleSort("department")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Department
                    </th>
                    <th
                      onClick={() => handleSort("designation")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Designation
                    </th>
                    <th
                      onClick={() => handleSort("unit")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Unit
                    </th>
                    <th
                      onClick={() => handleSort("line")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Line
                    </th>
                    <th
                      onClick={() => handleSort("date")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Date
                    </th>
                    <th
                      onClick={() => handleSort("inTime")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      In Time
                    </th>
                    <th
                      onClick={() => handleSort("otHoursNum")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      OT Req
                    </th>
                    <th
                      onClick={() => handleSort("amount")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Amount
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="p-2.5 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {sortedData.length > 0 ? (
                    sortedData.map((row, idx) => (
                      <tr
                        key={row.empId + "-" + row.date + "-" + idx}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* # */}
                        <td className="p-2.5 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>

                        {/* Emp ID */}
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.empId}
                        </td>

                        {/* Emp ID(Off) */}
                        <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">
                          {row.empIdOff}
                        </td>

                        {/* Name */}
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>

                        {/* Type */}
                        <td className="p-2.5 text-slate-700 dark:text-slate-300 font-semibold">
                          {row.type}
                        </td>

                        {/* Department */}
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                          {row.department}
                        </td>

                        {/* Designation */}
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {row.designation}
                        </td>

                        {/* Unit */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.unit}
                        </td>

                        {/* Line */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.line}
                        </td>

                        {/* Date */}
                        <td className="p-2.5 text-center font-semibold text-slate-900 dark:text-white">
                          {row.date}
                        </td>

                        {/* In Time */}
                        <td className="p-2.5 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.inTime}
                        </td>

                        {/* OT Req */}
                        <td className="p-2.5 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.otReq}
                        </td>

                        {/* Amount */}
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ৳{row.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Status */}
                        <td className="p-2.5 text-center">
                          {row.status === "Pending" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              <AlertCircle className="size-3" />
                              Pending
                            </span>
                          ) : row.status === "Approved" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="size-3" />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                              <XCircle className="size-3" />
                              Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={14} className="p-10 text-center text-slate-500 dark:text-slate-400 font-medium text-xs">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {sortedData.length > 0 ? (
                  <>Showing 1 to {sortedData.length} of {sortedData.length} entries</>
                ) : (
                  <>Showing 0 to 0 of 0 entries</>
                )}
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

      {/* PDF Export Modal */}
      <HRReportPdfModal
        isOpen={isReportPdfModalOpen}
        onClose={() => setIsReportPdfModalOpen(false)}
        reportTitle="Pending OT Request Report"
        companyName="Pakiza Knit Composite Ltd"
        dateRange={`${appliedFilters.startDate} to ${appliedFilters.endDate}`}
        columns={pdfColumns}
        data={sortedData}
        totalRow={
          <tr>
            <td colSpan={11} className="border border-slate-300 p-2 font-bold text-right text-xs">
              Total Overtime Amount:
            </td>
            <td className="border border-slate-300 p-2 font-bold text-center font-mono text-xs">
              {sortedData.reduce((sum, r) => sum + r.otHoursNum, 0).toFixed(1)} hrs
            </td>
            <td className="border border-slate-300 p-2 font-bold text-right font-mono text-xs text-emerald-700">
              ৳{sortedData.reduce((sum, r) => sum + r.amount, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
            <td className="border border-slate-300 p-2 font-bold text-center text-xs">
              {sortedData.length} Requests
            </td>
          </tr>
        }
      />
    </div>
  );
}
