import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  FileSpreadsheet,
  Printer,
  FileText,
  Filter,
  RotateCcw,
  Send,
  UserCheck,
  ArrowUpDown,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/bulk-leave")({
  head: () => ({
    meta: [
      { title: "Bulk Leave Allocation — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Enterprise bulk leave processing console for searching employees, selecting candidates, and allocating leaves via submission modal.",
      },
    ],
  }),
  component: BulkLeavePage,
});

interface EmployeeRecord {
  id: string;
  empId: string;
  empIdOffc: string;
  name: string;
  empType: "Worker" | "Staff" | "Management" | "Executive";
  department: string;
  section: string;
  jobTitle: string;
  unit: string;
  line: string;
  grade: string;
  joiningDate: string;
  clBalance: number;
  slBalance: number;
  elBalance: number;
  remarks: string;
}

const mockEmployees: EmployeeRecord[] = [
  {
    id: "1",
    empId: "1074",
    empIdOffc: "SWOP7-1074",
    name: "Md. Al Amin",
    empType: "Worker",
    department: "Production",
    section: "Sewing",
    jobTitle: "Operator",
    unit: "Aleya Apparels Ltd. (Shirt)",
    line: "02.Line-B",
    grade: "2",
    joiningDate: "11/10/2016",
    clBalance: 8,
    slBalance: 12,
    elBalance: 15,
    remarks: "",
  },
  {
    id: "2",
    empId: "10782",
    empIdOffc: "LOD-10782",
    name: "Md. Sadekul Islam",
    empType: "Worker",
    department: "Store",
    section: "Store",
    jobTitle: "Loader",
    unit: "Aleya Apparels Ltd.",
    line: "N/A",
    grade: "4",
    joiningDate: "01/10/2020",
    clBalance: 5,
    slBalance: 10,
    elBalance: 18,
    remarks: "",
  },
  {
    id: "3",
    empId: "1088",
    empIdOffc: "SWOP7-1088",
    name: "Monira Khatun",
    empType: "Worker",
    department: "Production",
    section: "Sewing",
    jobTitle: "Operator",
    unit: "Aleya Apparels Ltd. (Pant-1)",
    line: "11.Line-3",
    grade: "2",
    joiningDate: "01/03/2018",
    clBalance: 10,
    slBalance: 14,
    elBalance: 20,
    remarks: "",
  },
  {
    id: "4",
    empId: "11134",
    empIdOffc: "LOD-11134",
    name: "Md. Sajdar Rahman",
    empType: "Worker",
    department: "Store",
    section: "Store",
    jobTitle: "Loader",
    unit: "Aleya Apparels Ltd.",
    line: "N/A",
    grade: "4",
    joiningDate: "17/11/2022",
    clBalance: 7,
    slBalance: 8,
    elBalance: 12,
    remarks: "",
  },
  {
    id: "5",
    empId: "11441",
    empIdOffc: "DIST-11441",
    name: "Md. Parvej",
    empType: "Worker",
    department: "Wash",
    section: "Wash",
    jobTitle: "Jr. Distributor",
    unit: "Aleya Apparels Ltd. (Pant-2)",
    line: "AT-N/A",
    grade: "3",
    joiningDate: "01/01/2024",
    clBalance: 9,
    slBalance: 11,
    elBalance: 8,
    remarks: "",
  },
  {
    id: "6",
    empId: "11456",
    empIdOffc: "FLOD-11456",
    name: "Md. Anowar Hossen",
    empType: "Worker",
    department: "Production",
    section: "Finishing",
    jobTitle: "Loader",
    unit: "Aleya Apparels Ltd. (Shirt)",
    line: "N/A",
    grade: "4",
    joiningDate: "03/02/2024",
    clBalance: 4,
    slBalance: 9,
    elBalance: 10,
    remarks: "",
  },
  {
    id: "7",
    empId: "11504",
    empIdOffc: "TECN-11504",
    name: "Md. Ridoy Mia",
    empType: "Worker",
    department: "Electric",
    section: "Electric",
    jobTitle: "Asst. Boiler Operator",
    unit: "Aleya Apparels Ltd.",
    line: "N/A",
    grade: "4",
    joiningDate: "04/03/2024",
    clBalance: 6,
    slBalance: 14,
    elBalance: 11,
    remarks: "",
  },
  {
    id: "8",
    empId: "11639",
    empIdOffc: "ATFLOD-11639",
    name: "Md. Lotif Molla",
    empType: "Worker",
    department: "Production",
    section: "Finishing",
    jobTitle: "Loader",
    unit: "Aleya Apparels Ltd. (Pant-2)",
    line: "AT-N/A",
    grade: "4",
    joiningDate: "01/07/2024",
    clBalance: 8,
    slBalance: 10,
    elBalance: 7,
    remarks: "",
  },
  {
    id: "9",
    empId: "11681",
    empIdOffc: "ATFLOD-11681",
    name: "Md. Nur Nobi",
    empType: "Worker",
    department: "Production",
    section: "Finishing",
    jobTitle: "Loader",
    unit: "Aleya Apparels Ltd. (Shirt)",
    line: "N/A",
    grade: "4",
    joiningDate: "09/07/2024",
    clBalance: 10,
    slBalance: 12,
    elBalance: 6,
    remarks: "",
  },
  {
    id: "10",
    empId: "11697",
    empIdOffc: "ATLODR-11697",
    name: "Md. Shohan Hosen",
    empType: "Worker",
    department: "Production",
    section: "Fusing",
    jobTitle: "Fusing Asst.",
    unit: "Aleya Apparels Ltd. (Pant-2)",
    line: "AT-N/A",
    grade: "4",
    joiningDate: "10/07/2024",
    clBalance: 5,
    slBalance: 13,
    elBalance: 5,
    remarks: "",
  },
  {
    id: "11",
    empId: "11766",
    empIdOffc: "SLOD-11766",
    name: "Md. Hafijar Rahman",
    empType: "Worker",
    department: "Store",
    section: "Store",
    jobTitle: "Loader",
    unit: "Aleya Apparels Ltd.",
    line: "N/A",
    grade: "4",
    joiningDate: "01/08/2024",
    clBalance: 9,
    slBalance: 10,
    elBalance: 9,
    remarks: "",
  },
  {
    id: "12",
    empId: "12015",
    empIdOffc: "SWOP8-12015",
    name: "Rashida Begum",
    empType: "Worker",
    department: "Production",
    section: "Sewing",
    jobTitle: "Senior Operator",
    unit: "Aleya Apparels Ltd. (Shirt)",
    line: "05.Line-A",
    grade: "2",
    joiningDate: "15/09/2024",
    clBalance: 7,
    slBalance: 11,
    elBalance: 14,
    remarks: "",
  },
  {
    id: "13",
    empId: "12110",
    empIdOffc: "OFF-12110",
    name: "Shahidul Islam",
    empType: "Staff",
    department: "HR & Admin",
    section: "Compliance",
    jobTitle: "Compliance Executive",
    unit: "Aleya Apparels Ltd.",
    line: "N/A",
    grade: "1",
    joiningDate: "02/01/2025",
    clBalance: 10,
    slBalance: 14,
    elBalance: 18,
    remarks: "",
  },
];

function BulkLeavePage() {
  // Search Filter Console State
  const [year, setYear] = useState("2026");
  const [employeeIdQuery, setEmployeeIdQuery] = useState("");
  const [empType, setEmpType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [shift, setShift] = useState("");

  // Table Search & Selection
  const [tableSearch, setTableSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(["1", "2"]) // Default selection matching reference UI
  );
  const [rowRemarks, setRowRemarks] = useState<Record<string, string>>({});

  // SUBMIT MODAL STATE
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [modalLeaveType, setModalLeaveType] = useState("CL");
  const [modalFromDate, setModalFromDate] = useState("2026-09-14");
  const [modalToDate, setModalToDate] = useState("2026-09-15");
  const [modalReason, setModalReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute Days in Modal
  const modalCalculatedDays = useMemo(() => {
    if (!modalFromDate || !modalToDate) return 1;
    const start = new Date(modalFromDate);
    const end = new Date(modalToDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [modalFromDate, modalToDate]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return mockEmployees.filter((emp) => {
      // Table search term
      if (tableSearch.trim()) {
        const term = tableSearch.toLowerCase().trim();
        const match =
          emp.empId.toLowerCase().includes(term) ||
          emp.empIdOffc.toLowerCase().includes(term) ||
          emp.name.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term) ||
          emp.section.toLowerCase().includes(term) ||
          emp.jobTitle.toLowerCase().includes(term) ||
          emp.unit.toLowerCase().includes(term) ||
          emp.line.toLowerCase().includes(term);
        if (!match) return false;
      }

      // Department filter
      if (department !== "All Departments" && emp.department !== department)
        return false;

      // Section filter
      if (section !== "ALL" && emp.section !== section) return false;

      // Designation filter
      if (designation !== "ALL" && emp.jobTitle !== designation) return false;

      // Unit filter
      if (unit !== "ALL" && emp.unit !== unit) return false;

      // Line filter
      if (line !== "ALL" && emp.line !== line) return false;

      // Emp Type filter
      if (empType !== "ALL" && emp.empType !== empType) return false;

      // Comma-separated Employee ID Search
      if (employeeIdQuery.trim()) {
        const ids = employeeIdQuery
          .split(",")
          .map((i) => i.trim().toLowerCase())
          .filter(Boolean);
        if (ids.length > 0) {
          const matchId = ids.some(
            (id) =>
              emp.empId.toLowerCase().includes(id) ||
              emp.empIdOffc.toLowerCase().includes(id)
          );
          if (!matchId) return false;
        }
      }

      return true;
    });
  }, [
    tableSearch,
    department,
    section,
    designation,
    unit,
    line,
    empType,
    employeeIdQuery,
  ]);

  // Selected Employee Objects
  const selectedEmployeeObjects = useMemo(() => {
    return mockEmployees.filter((emp) => selectedIds.has(emp.id));
  }, [selectedIds]);

  // Checkbox helpers
  const isAllSelected =
    filteredData.length > 0 &&
    filteredData.every((emp) => selectedIds.has(emp.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const next = new Set(selectedIds);
      filteredData.forEach((emp) => next.delete(emp.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      filteredData.forEach((emp) => next.add(emp.id));
      setSelectedIds(next);
    }
  };

  const handleToggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleResetFilters = () => {
    setYear("2026");
    setEmployeeIdQuery("");
    setEmpType("ALL");
    setDepartment("All Departments");
    setSection("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setLine("ALL");
    setShift("");
    setTableSearch("");
    toast.info("Reset filter options to default.");
  };

  // Open Modal Handler
  const handleOpenSubmitModal = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee from the table first!");
      return;
    }
    setIsSubmitModalOpen(true);
  };

  // Confirm Submission inside Modal
  const handleConfirmBulkLeave = () => {
    if (!modalFromDate || !modalToDate) {
      toast.error("Please select valid From Date and To Date!");
      return;
    }
    if (modalCalculatedDays <= 0) {
      toast.error("To Date must be equal to or after From Date!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
      toast.success(
        `Bulk Leave (${modalLeaveType}) successfully granted for ${selectedIds.size} selected employee(s)!`,
        {
          description: `Duration: ${modalFromDate} to ${modalToDate} (${modalCalculatedDays} Days)${
            modalReason ? ` | Reason: ${modalReason}` : ""
          }`,
        }
      );
    }, 500);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Emp ID",
      "Emp ID(Offc)",
      "Name",
      "Employee Type",
      "Department",
      "Section",
      "Job Title",
      "Unit",
      "Line",
      "Grade",
      "Joining Date",
      "Remarks",
    ];

    const rows = mockEmployees
      .filter((e) => selectedIds.has(e.id))
      .map((e) => [
        e.empId,
        e.empIdOffc,
        e.name,
        e.empType,
        e.department,
        e.section,
        e.jobTitle,
        e.unit,
        e.line,
        e.grade,
        e.joiningDate,
        rowRemarks[e.id] || "",
      ]);

    if (rows.length === 0) {
      toast.error("No employees selected for export!");
      return;
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((val) => `"${val}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bulk_leave_selected_list_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    toast.success(`Exported ${rows.length} employee records to CSV.`);
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Page Top Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/leave" className="hover:text-slate-900 transition-colors">
              Leave Management
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Bulk Leave Allocation</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded border border-slate-200 uppercase tracking-wider">
              Enterprise Module
            </span>
          </div>
        </div>

        {/* Scrollable Work Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Header Title Section */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-slate-700" />
                Bulk Leave Allocation Console
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Search and select employees from the grid, then click Submit to grant bulk leaves.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-1.5 text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Total Staff
                </span>
                <span className="text-xs font-extrabold text-slate-800">
                  {mockEmployees.length}
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-1.5 text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Selected Count
                </span>
                <span className="text-xs font-extrabold text-blue-600">
                  {selectedIds.size} Selected
                </span>
              </div>
            </div>
          </div>

          {/* FILTER CONSOLE CARD */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Filter className="w-4 h-4 text-slate-500" />
                <span>Search & Filter Criteria</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 text-xs">
              {/* Year */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800 font-medium focus:ring-1 focus:ring-slate-400"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Employee ID (Comma Separated) */}
              <div className="xl:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Employee ID <span className="text-slate-400 font-normal">(Comma Separated)</span>
                </label>
                <input
                  type="text"
                  value={employeeIdQuery}
                  onChange={(e) => setEmployeeIdQuery(e.target.value)}
                  placeholder="e.g. 1074, 1088, 11441..."
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-slate-400 placeholder-slate-400"
                />
              </div>

              {/* Employee Type */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Employee Type
                </label>
                <select
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:ring-1 focus:ring-slate-400"
                >
                  <option value="ALL">All Types</option>
                  <option value="Worker">Worker</option>
                  <option value="Staff">Staff</option>
                  <option value="Management">Management</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:ring-1 focus:ring-slate-400"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="Production">Production</option>
                  <option value="Store">Store</option>
                  <option value="Wash">Wash</option>
                  <option value="Electric">Electric</option>
                  <option value="HR & Admin">HR & Admin</option>
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:ring-1 focus:ring-slate-400"
                >
                  <option value="ALL">ALL</option>
                  <option value="Sewing">Sewing</option>
                  <option value="Store">Store</option>
                  <option value="Wash">Wash</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Electric">Electric</option>
                  <option value="Fusing">Fusing</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:ring-1 focus:ring-slate-400"
                >
                  <option value="ALL">ALL</option>
                  <option value="Operator">Operator</option>
                  <option value="Loader">Loader</option>
                  <option value="Jr. Distributor">Jr. Distributor</option>
                  <option value="Asst. Boiler Operator">Asst. Boiler Operator</option>
                  <option value="Fusing Asst.">Fusing Asst.</option>
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:ring-1 focus:ring-slate-400"
                >
                  <option value="ALL">ALL</option>
                  <option value="Aleya Apparels Ltd. (Shirt)">Aleya Apparels Ltd. (Shirt)</option>
                  <option value="Aleya Apparels Ltd.">Aleya Apparels Ltd.</option>
                  <option value="Aleya Apparels Ltd. (Pant-1)">Aleya Apparels Ltd. (Pant-1)</option>
                  <option value="Aleya Apparels Ltd. (Pant-2)">Aleya Apparels Ltd. (Pant-2)</option>
                </select>
              </div>

              {/* Line */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Line
                </label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:ring-1 focus:ring-slate-400"
                >
                  <option value="ALL">ALL</option>
                  <option value="02.Line-B">02.Line-B</option>
                  <option value="11.Line-3">11.Line-3</option>
                  <option value="AT-N/A">AT-N/A</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              {/* Shift */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Shift
                </label>
                <input
                  type="text"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  placeholder="Shift..."
                  className="w-full h-8.5 px-2.5 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>

            {/* Search Button Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  toast.info(`Found ${filteredData.length} matching employee record(s).`);
                }}
                className="h-9 px-6 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow-2xs transition-colors flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                SEARCH EMPLOYEES
              </button>
            </div>
          </div>

          {/* TABLE DATA GRID CARD */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  EXCEL
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  PRINT
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                  PDF
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <label className="text-slate-600 font-medium">Search Table:</label>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter grid..."
                  className="h-8 px-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 text-slate-800 w-48 sm:w-64"
                />
              </div>
            </div>

            {/* High-Density Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                <thead className="bg-[#e2e8f0] text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center border-r border-slate-300">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-400 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Emp ID</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Emp ID (Offc)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Employee Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <span>Type</span>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <span>Department</span>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <span>Section</span>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <span>Designation</span>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <span>Unit</span>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300">
                      <span>Line</span>
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center">
                      <span>Balances (CL / SL / EL)</span>
                    </th>
                    <th className="py-2.5 px-3 min-w-[150px]">
                      <span>Remarks / Note</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="py-8 text-center text-slate-500 italic"
                      >
                        No employee records found matching current search parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((emp) => {
                      const isSelected = selectedIds.has(emp.id);
                      return (
                        <tr
                          key={emp.id}
                          onClick={() => handleToggleRow(emp.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-slate-100/90 font-medium"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td
                            className="py-2 px-3 text-center border-r border-slate-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleRow(emp.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 font-mono text-slate-700">
                            {emp.empId}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 font-mono text-slate-700">
                            {emp.empIdOffc}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-900">
                            {emp.name}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                            {emp.empType}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                            {emp.department}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                            {emp.section}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                            {emp.jobTitle}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                            {emp.unit}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                            {emp.line}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-center">
                            <span className="text-[11px] font-mono text-slate-600">
                              CL: <strong>{emp.clBalance}</strong> | SL:{" "}
                              <strong>{emp.slBalance}</strong> | EL:{" "}
                              <strong>{emp.elBalance}</strong>
                            </span>
                          </td>
                          <td
                            className="py-1.5 px-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={rowRemarks[emp.id] ?? ""}
                              onChange={(e) =>
                                setRowRemarks({
                                  ...rowRemarks,
                                  [emp.id]: e.target.value,
                                })
                              }
                              placeholder="Remarks..."
                              className="w-full h-7 px-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-400"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & SUBMIT Button Bar (Bottom Left) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs text-slate-600 font-medium">
                  Showing 1 to {filteredData.length} of 2,375 entries
                  {selectedIds.size > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[11px]">
                      {selectedIds.size} Selected
                    </span>
                  )}
                </div>

                {/* SUBMIT BUTTON ON BOTTOM LEFT */}
                <div>
                  <button
                    type="button"
                    onClick={handleOpenSubmitModal}
                    className="px-6 py-2 bg-[#f97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SUBMIT ({selectedIds.size})</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const allIds = new Set(filteredData.map((e) => e.id));
                    setSelectedIds(allIds);
                  }}
                  className="text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Select All Filtered
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-slate-500 hover:text-slate-800"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BULK LEAVE PARAMETERS MODAL */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="bg-[#1e293b] text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-sm tracking-wide text-white">
                    Bulk Leave Application Parameters
                  </h3>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - 2 Column Wide Enterprise Layout */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Left Column: Selected Employees Table List */}
                <div className="space-y-2 flex flex-col min-h-0">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Selected Candidates ({selectedIds.size})
                    </label>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[11px] border border-blue-200">
                      {selectedIds.size} Staff Selected
                    </span>
                  </div>

                  <div className="flex-1 max-h-[260px] overflow-y-auto border border-slate-200 rounded bg-slate-50">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-200 text-slate-700 font-semibold sticky top-0 border-b border-slate-300">
                        <tr>
                          <th className="py-2 px-2.5 border-r border-slate-300">#</th>
                          <th className="py-2 px-2.5 border-r border-slate-300">Emp ID</th>
                          <th className="py-2 px-2.5 border-r border-slate-300">Name</th>
                          <th className="py-2 px-2.5">Dept</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {selectedEmployeeObjects.map((emp, index) => (
                          <tr key={emp.id} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2.5 text-slate-500 font-mono border-r border-slate-200">
                              {index + 1}
                            </td>
                            <td className="py-1.5 px-2.5 font-mono text-slate-700 font-medium border-r border-slate-200">
                              {emp.empId}
                            </td>
                            <td className="py-1.5 px-2.5 font-semibold text-slate-900 border-r border-slate-200">
                              {emp.name}
                            </td>
                            <td className="py-1.5 px-2.5 text-slate-600">
                              {emp.department}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: Leave Parameters Form */}
                <div className="space-y-4">
                  {/* Leave Type * */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={modalLeaveType}
                      onChange={(e) => setModalLeaveType(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-300 rounded bg-white text-slate-900 font-bold text-xs focus:ring-1 focus:ring-slate-400"
                    >
                      <option value="CL">CL (Casual Leave)</option>
                      <option value="SL">SL (Sick Leave)</option>
                      <option value="EL">EL (Earned Leave / Annual Leave)</option>
                      <option value="CPL">CPL (Compensatory Leave)</option>
                      <option value="LWP">LWP (Leave Without Pay)</option>
                      <option value="ML">ML (Maternity Leave)</option>
                    </select>
                  </div>

                  {/* From Date * & To Date * */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        From Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={modalFromDate}
                        onChange={(e) => setModalFromDate(e.target.value)}
                        className="w-full h-9 px-3 border border-slate-300 rounded bg-white text-slate-900 font-semibold text-xs focus:ring-1 focus:ring-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        To Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={modalToDate}
                        onChange={(e) => setModalToDate(e.target.value)}
                        className="w-full h-9 px-3 border border-slate-300 rounded bg-white text-slate-900 font-semibold text-xs focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  {/* Duration Calculation Banner */}
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded flex items-center justify-between text-xs text-blue-900 font-medium">
                    <span>
                      Duration: <strong className="text-slate-900">{modalCalculatedDays} Day(s)</strong>
                    </span>
                    <span>
                      Total Man-Days: <strong className="text-slate-900">{selectedIds.size * modalCalculatedDays} Days</strong>
                    </span>
                  </div>

                  {/* Reason / Purpose Note */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Reason / Purpose Note <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={modalReason}
                      onChange={(e) => setModalReason(e.target.value)}
                      placeholder="Enter reason for bulk leave application..."
                      className="w-full p-2.5 border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-slate-400 placeholder-slate-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBulkLeave}
                  className="px-6 py-2 bg-[#f97316] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>CONFIRM & APPLY BULK LEAVE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
