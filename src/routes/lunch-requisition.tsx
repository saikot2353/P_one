import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  UtensilsCrossed,
  ChevronRight,
  Search,
  Printer,
  FileSpreadsheet,
  FileText,
  Pencil,
  X,
  CheckCircle2,
  Calendar,
  Filter,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { submitLunchRequisitionBatch } from "@/lib/lunchRequisitionStore";

export const Route = createFileRoute("/lunch-requisition")({
  head: () => ({
    meta: [
      { title: "Lunce Requisition — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage, allocate, and submit employee lunch requisitions during overtime and festival duties.",
      },
    ],
  }),
  component: LunchRequisitionPage,
});

// ---------------------------------------------------------------------------
// Types & Defaults
// ---------------------------------------------------------------------------
export interface LunchRequisitionEmployee {
  id: string;
  sl: number;
  empId: string;
  name: string;
  employeeType: string;
  department: string;
  designation: string;
  unit: string;
  line: string;
  inDate: string;   // "19/10/2026"
  inTime: string;   // "08:55:35"
  outDate: string;  // "19/10/2026"
  outTime: string;  // ""
  ot: number;       // 0.00
  status: "Present" | "Absent" | "Late" | "Leave";
}

const STORAGE_KEY = "hris_lunch_requisition_records_v1";

// 9 exact entries from reference screenshot + realistic seeded entries up to 137
const INITIAL_EMPLOYEES: LunchRequisitionEmployee[] = [
  {
    id: "lr-1",
    sl: 1,
    empId: "2016001065",
    name: "Md. Babul Mia",
    employeeType: "Office Executive",
    department: "Accounts & Finance",
    designation: "Deputy Manager",
    unit: "N/A",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "08:55:35",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
  {
    id: "lr-2",
    sl: 2,
    empId: "2017007795",
    name: "Md. Abdullah Al- Mamun",
    employeeType: "Office Executive",
    department: "Accounts & Finance",
    designation: "Deputy Manager",
    unit: "N/A",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "08:56:05",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
  {
    id: "lr-3",
    sl: 3,
    empId: "2017008164",
    name: "Hasan Ahammad",
    employeeType: "Office Executive",
    department: "Accounts & Finance",
    designation: "Deputy Manager",
    unit: "N/A",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "08:55:34",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
  {
    id: "lr-4",
    sl: 4,
    empId: "2018011220",
    name: "Md. Samiul Alam",
    employeeType: "Office Staff",
    department: "Accounts & Finance",
    designation: "Messenger",
    unit: "N/A",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "09:03:34",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
  {
    id: "lr-5",
    sl: 5,
    empId: "2019014166",
    name: "Shahriar Mustafiz",
    employeeType: "Office Executive",
    department: "Accounts & Finance",
    designation: "Sr. Officer",
    unit: "N/A",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "08:56:22",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
  {
    id: "lr-6",
    sl: 6,
    empId: "2020018602",
    name: "Md. Anowar Hossain",
    employeeType: "Office Staff",
    department: "Accounts & Finance",
    designation: "Office Asst",
    unit: "N/A",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "09:01:20",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
  {
    id: "lr-7",
    sl: 7,
    empId: "2021031739",
    name: "Bilas Roy",
    employeeType: "Office Executive",
    department: "Accounts & Finance",
    designation: "Officer",
    unit: "N/A",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "08:59:14",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
  {
    id: "lr-8",
    sl: 8,
    empId: "2022034743",
    name: "Md.Amir Hossain",
    employeeType: "Office Executive",
    department: "Accounts & Finance",
    designation: "Officer",
    unit: "N/A",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "08:56:26",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
  {
    id: "lr-9",
    sl: 9,
    empId: "2025057429",
    name: "Md. Rubel Hossain",
    employeeType: "Office Executive",
    department: "Accounts & Finance",
    designation: "Asst. Officer",
    unit: "Unit-01",
    line: "N/A",
    inDate: "19/10/2026",
    inTime: "07:49:17",
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  },
];

// Generate additional realistic employees to total 137 entries as seen in the image
const OTHER_DEPTS = [
  { dept: "Accounts & Finance", roles: ["Junior Officer", "Cashier", "Accountant", "Accounts Executive", "Billing Officer"] },
  { dept: "Maintenance", roles: ["Technician", "Maintenance Engineer", "Electrician", "Utility Operator", "Foreman"] },
  { dept: "HR, Admin & Comp.", roles: ["HR Officer", "Compliance Auditor", "Admin Assistant", "Security Guard", "Safety Officer"] },
  { dept: "Knitting", roles: ["Knitter Operator", "Supervisor", "Machine Setter", "Helper", "Floor In-Charge"] },
  { dept: "Dyeing", roles: ["Dyeing Master", "Color Matcher", "Batch In-Charge", "Hydro Operator", "Chemical Dispenser"] },
  { dept: "Cutting", roles: ["Cutting Master", "Spreader", "Marker Maker", "Quality Inspector", "Pattern Cutter"] },
  { dept: "Quality Assurance", roles: ["QA Inspector", "Quality Controller", "Audit Officer", "Fabric Checker"] },
  { dept: "Production Planning", roles: ["Planning Officer", "Line Coordinator", "PPC Executive", "IE Analyst"] },
  { dept: "Merchandising", roles: ["Merchandiser", "Sr. Merchandiser", "Sample Coordinator", "Costing Officer"] },
];

const NAMES_POOL = [
  "Md. Tariqul Islam", "Ashraful Haque", "Kamrul Hasan", "Sultan Ahmed", "Tanvir Rahman",
  "Mahbub Alam", "Rasel Mia", "Shahinur Islam", "Jahangir Alam", "Mustafizur Rahman",
  "Al-Amin Hossain", "Shohel Rana", "Mehedi Hasan", "Anisur Rahman", "Farid Uddin",
  "Nazmul Huda", "Saiful Islam", "Golam Kibria", "Habibur Rahman", "Zakir Hossain",
  "Mizanur Rahman", "Shakil Ahmed", "Akram Hossain", "Rashedul Karim", "Moniruzzaman",
  "Sharif Hossain", "Saidur Rahman", "Imran Nazir", "Kawsar Ali", "Delowar Hossain",
];

for (let i = 10; i <= 137; i++) {
  const dIndex = (i - 10) % OTHER_DEPTS.length;
  const deptObj = OTHER_DEPTS[dIndex];
  const role = deptObj.roles[(i - 10) % deptObj.roles.length];
  const name = NAMES_POOL[(i - 10) % NAMES_POOL.length] + ` (${i})`;
  const empYear = 2016 + ((i * 3) % 10);
  const empSerial = String(100000 + i * 173).padStart(6, "0");
  const empId = `${empYear}${empSerial}`;

  const inHour = String(7 + (i % 3)).padStart(2, "0");
  const inMin = String(10 + ((i * 7) % 50)).padStart(2, "0");
  const inSec = String(10 + ((i * 11) % 50)).padStart(2, "0");

  INITIAL_EMPLOYEES.push({
    id: `lr-${i}`,
    sl: i,
    empId,
    name,
    employeeType: i % 4 === 0 ? "Worker" : i % 3 === 0 ? "Office Staff" : "Office Executive",
    department: deptObj.dept,
    designation: role,
    unit: i % 2 === 0 ? "Unit-01" : "N/A",
    line: i % 5 === 0 ? `Line-0${(i % 4) + 1}` : "N/A",
    inDate: "19/10/2026",
    inTime: `${inHour}:${inMin}:${inSec}`,
    outDate: "19/10/2026",
    outTime: "",
    ot: 0.0,
    status: "Present",
  });
}

const EMPLOYEE_TYPES = [
  "ALL",
  "Worker",
  "Office Staff",
  "Office Executive",
  "Production Executive",
  "Management",
];

const DEPARTMENTS = [
  "ALL",
  "Accounts & Finance",
  "Maintenance",
  "HR, Admin & Comp.",
  "Knitting",
  "Dyeing",
  "Cutting",
  "Quality Assurance",
  "Production Planning",
  "Merchandising",
];

const UNITS = ["ALL", "Unit-01", "Unit-02", "Unit-03", "N/A"];
const LINES = ["ALL", "Line-01", "Line-02", "Line-03", "Line-04", "N/A"];

export function LunchRequisitionPage() {
  // Stored / working list of employees
  const [employees, setEmployees] = useState<LunchRequisitionEmployee[]>(INITIAL_EMPLOYEES);

  // Load from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEmployees(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load records from localStorage", err);
      }
    }
  }, []);

  const persistEmployees = (newList: LunchRequisitionEmployee[]) => {
    setEmployees(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      } catch (err) {
        console.error("Failed to save records to localStorage", err);
      }
    }
  };

  // -------------------------------------------------------------------------
  // Filter Console States (Matching Image Form)
  // -------------------------------------------------------------------------
  const [startDate, setStartDate] = useState("2026-10-19");
  const [toDate, setToDate] = useState("2026-10-19");
  const [filterEmpId, setFilterEmpId] = useState("");
  const [selectedEmpType, setSelectedEmpType] = useState("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [selectedLine, setSelectedLine] = useState("ALL");

  // Applied filter state (updated on clicking "SHOW")
  const [appliedFilters, setAppliedFilters] = useState({
    empId: "",
    empType: "ALL",
    dept: "ALL",
    unit: "ALL",
    line: "ALL",
  });

  const handleShowFilter = () => {
    setAppliedFilters({
      empId: filterEmpId.trim(),
      empType: selectedEmpType,
      dept: selectedDepartment,
      unit: selectedUnit,
      line: selectedLine,
    });
    setCurrentPage(1);
    toast.info("Filter applied", {
      description: `Filtering records by selected parameters.`,
    });
  };

  // Row Selection (Checkboxes)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Table Search Filter
  const [tableSearch, setTableSearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(137); // Defaults to show all 137 as in screenshot or paginated

  // -------------------------------------------------------------------------
  // Filtered Records Computation
  // -------------------------------------------------------------------------
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // 1. Employee Id Filter (supports comma separation)
      if (appliedFilters.empId) {
        const ids = appliedFilters.empId
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        if (ids.length > 0 && !ids.some((id) => emp.empId.toLowerCase().includes(id))) {
          return false;
        }
      }

      // 2. Employee Type Filter
      if (appliedFilters.empType !== "ALL" && emp.employeeType !== appliedFilters.empType) {
        return false;
      }

      // 3. Department Filter
      if (appliedFilters.dept !== "ALL" && emp.department !== appliedFilters.dept) {
        return false;
      }

      // 4. Unit Filter
      if (appliedFilters.unit !== "ALL" && emp.unit !== appliedFilters.unit) {
        return false;
      }

      // 5. Line Filter
      if (appliedFilters.line !== "ALL" && emp.line !== appliedFilters.line) {
        return false;
      }

      // 6. Live Table Search
      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matches =
          emp.empId.toLowerCase().includes(query) ||
          emp.name.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query) ||
          emp.designation.toLowerCase().includes(query) ||
          emp.unit.toLowerCase().includes(query) ||
          emp.line.toLowerCase().includes(query) ||
          emp.status.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [employees, appliedFilters, tableSearch]);

  // Paginated records
  const totalEntries = filteredEmployees.length;
  const effectivePageSize = pageSize === -1 ? totalEntries || 1 : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalEntries / effectivePageSize));
  const paginatedEmployees = useMemo(() => {
    if (pageSize === -1) return filteredEmployees;
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Select all handler for currently visible paginated rows
  const isAllSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((emp) => selectedIds.has(emp.id));

  const handleToggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) {
      paginatedEmployees.forEach((emp) => next.delete(emp.id));
    } else {
      paginatedEmployees.forEach((emp) => next.add(emp.id));
    }
    setSelectedIds(next);
  };

  const handleToggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Individual Row OT change
  const handleRowOtChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = employees.map((emp) =>
      emp.id === id ? { ...emp, ot: num } : emp
    );
    persistEmployees(updated);
  };

  // Remove individual row (Action column red cross)
  const handleRemoveRow = (id: string, name: string) => {
    const updated = employees.filter((emp) => emp.id !== id);
    persistEmployees(updated);
    const nextSel = new Set(selectedIds);
    nextSel.delete(id);
    setSelectedIds(nextSel);
    toast.info(`Removed ${name} from requisition list.`);
  };

  // Submit Requisition Handler -> Dispatches to Lunce Requisition Approval
  const handleSubmitRequisition = () => {
    const itemsToSubmit =
      selectedIds.size > 0
        ? filteredEmployees.filter((emp) => selectedIds.has(emp.id))
        : filteredEmployees;

    if (itemsToSubmit.length === 0) {
      toast.warning("No employees available to submit.");
      return;
    }

    const totalOtHours = itemsToSubmit.reduce((acc, curr) => acc + (curr.ot || 0), 0);
    const primaryDept =
      appliedFilters.dept !== "ALL"
        ? appliedFilters.dept
        : itemsToSubmit[0]?.department || "Accounts & Finance";

    // Format date DD/MM/YYYY
    const formattedDate = startDate.includes("-")
      ? startDate.split("-").reverse().join("/")
      : startDate;

    const newBatch = submitLunchRequisitionBatch({
      requisitionDate: formattedDate,
      submittedBy: "Md. Babul Mia (Deputy Manager)",
      department: primaryDept,
      employeeCount: itemsToSubmit.length,
      totalOt: Number(totalOtHours.toFixed(2)),
      remarks: `Lunch Requisition for ${itemsToSubmit.length} employee(s) on ${formattedDate}.`,
      items: itemsToSubmit,
    });

    toast.success("Lunce Requisition Submitted!", {
      description: `Batch #${newBatch.id} sent to Lunce Requisition Approval.`,
    });
  };

  // Export to CSV / Excel
  const handleExportCSV = () => {
    if (filteredEmployees.length === 0) {
      toast.warning("No data to export.");
      return;
    }

    const headers = [
      "SL",
      "Emp ID",
      "Name",
      "Department",
      "Designation",
      "Unit",
      "Line",
      "In Date",
      "In Time",
      "Out Date",
      "Out Time",
      "OT",
      "Status",
    ];

    const rows = filteredEmployees.map((emp, idx) => [
      idx + 1,
      emp.empId,
      `"${emp.name.replace(/"/g, '""')}"`,
      `"${emp.department}"`,
      `"${emp.designation}"`,
      emp.unit,
      emp.line,
      emp.inDate,
      emp.inTime,
      emp.outDate,
      emp.outTime,
      emp.ot.toFixed(2),
      emp.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lunch_requisition_${startDate.replace(/-/g, "")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Excel CSV downloaded successfully!");
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans antialiased">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* --------------------------------------------------------------------------- */}
          {/* Header Banner matching app design layout                                    */}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <Link to="/manage-overtime" className="hover:text-primary transition-colors">
                  Manage Overtime
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold uppercase">
                  Lunce Requisition
                </span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <UtensilsCrossed className="size-6 text-primary" />
                <span>Lunce Requisition</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Allocate employee meal allowances, manage duty assignments, and submit batch lunch requisitions.
              </p>
            </div>
          </div>

          {/* --------------------------------------------------------------------------- */}
          {/* Top Filter Panel (Standard ERP Page Design)                                 */}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {/* Start Date */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs transition cursor-pointer"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs transition cursor-pointer"
                />
              </div>

              {/* Employee Id */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Employee Id
                </label>
                <input
                  type="text"
                  value={filterEmpId}
                  onChange={(e) => setFilterEmpId(e.target.value)}
                  placeholder="use comma as separator"
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary shadow-2xs transition"
                />
              </div>

              {/* Employee Type */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Employee Type
                </label>
                <div className="relative">
                  <select
                    value={selectedEmpType}
                    onChange={(e) => setSelectedEmpType(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {EMPLOYEE_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-card text-foreground">
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-card text-foreground">
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Unit
                </label>
                <div className="relative">
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u} className="bg-card text-foreground">
                        {u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Line */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Line
                </label>
                <div className="relative">
                  <select
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {LINES.map((l) => (
                      <option key={l} value={l} className="bg-card text-foreground">
                        {l}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* SHOW Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleShowFilter}
                  className="w-full h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="size-3.5" />
                  <span>SHOW</span>
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------------- */}
          {/* Main Table Card & Toolbar                                                   */}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
            {/* Toolbar: EXCEL, PRINT, PDF on Left | Search on Right */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 print:hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 rounded border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  <span>EXCEL</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <Printer className="size-3.5 text-blue-600" />
                  <span>PRINT</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <FileText className="size-3.5 text-rose-600" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Right Side: Search */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground font-medium">Search:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => {
                      setTableSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search table..."
                    className="w-48 sm:w-60 h-8 px-2.5 rounded border border-border bg-background text-xs text-foreground focus:outline-none focus:border-primary transition"
                  />
                  {tableSearch && (
                    <button
                      type="button"
                      onClick={() => setTableSearch("")}
                      className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                {/* Table Header: Light sky blue matching screenshot */}
                <thead>
                  <tr className="bg-[#e1f0fa] dark:bg-sky-950/40 text-[#2c3e50] dark:text-sky-200 border-b border-sky-200 dark:border-sky-900 font-bold whitespace-nowrap">
                    {/* Checkbox Column */}
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        className="rounded border-border text-primary focus:ring-primary size-4 cursor-pointer"
                        title="Select All"
                      />
                    </th>
                    <th className="py-2.5 px-3">SL</th>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Designation</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Line</th>
                    <th className="py-2.5 px-3">In Date</th>
                    <th className="py-2.5 px-3">In Time</th>
                    <th className="py-2.5 px-3">Out Date</th>
                    <th className="py-2.5 px-3">Out Time</th>
                    <th className="py-2.5 px-3 text-center w-24">OT</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-border/40 text-foreground">
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="size-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">No employee records found.</p>
                          <p className="text-xs text-muted-foreground/70">
                            Try adjusting your search query or filter options.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((emp, index) => {
                      const isSelected = selectedIds.has(emp.id);
                      return (
                        <tr
                          key={emp.id}
                          className={`hover:bg-muted/40 transition-colors ${
                            isSelected ? "bg-primary/5" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRow(emp.id)}
                              className="rounded border-border text-primary focus:ring-primary size-4 cursor-pointer"
                            />
                          </td>

                          {/* SL */}
                          <td className="py-2 px-3 text-muted-foreground font-medium">
                            {(currentPage - 1) * (pageSize === -1 ? 0 : pageSize) + index + 1}
                          </td>

                          {/* Emp ID */}
                          <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">
                            {emp.empId}
                          </td>

                          {/* Name */}
                          <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                            {emp.name}
                          </td>

                          {/* Department */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {emp.department}
                          </td>

                          {/* Designation */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {emp.designation}
                          </td>

                          {/* Unit */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {emp.unit}
                          </td>

                          {/* Line */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {emp.line}
                          </td>

                          {/* In Date */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {emp.inDate}
                          </td>

                          {/* In Time */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {emp.inTime}
                          </td>

                          {/* Out Date */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {emp.outDate}
                          </td>

                          {/* Out Time */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {emp.outTime || "—"}
                          </td>

                          {/* OT (Editable Input Box) */}
                          <td className="py-1 px-3 text-center">
                            <input
                              type="number"
                              step="0.01"
                              value={emp.ot.toFixed(2)}
                              onChange={(e) => handleRowOtChange(emp.id, e.target.value)}
                              className="w-16 h-7 text-center rounded border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-2xs"
                            />
                          </td>

                          {/* Status */}
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {emp.status}
                            </span>
                          </td>

                          {/* Action (Red Cross) */}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(emp.id, emp.name)}
                              title="Remove employee"
                              className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded cursor-pointer"
                            >
                              <X className="size-4 font-bold" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Status & Actions (Matching Screenshot) */}
            <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <span>
                  Showing {totalEntries === 0 ? 0 : (currentPage - 1) * (pageSize === -1 ? totalEntries : pageSize) + 1} to{" "}
                  {pageSize === -1
                    ? totalEntries
                    : Math.min(currentPage * pageSize, totalEntries)}{" "}
                  of {totalEntries} entries
                </span>

                {/* Page Size Selector */}
                <div className="flex items-center gap-1.5 print:hidden">
                  <span>| Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-transparent border border-border rounded px-1.5 py-0.5 text-xs text-foreground cursor-pointer"
                  >
                    <option value={15} className="bg-card text-foreground">15</option>
                    <option value={25} className="bg-card text-foreground">25</option>
                    <option value={50} className="bg-card text-foreground">50</option>
                    <option value={100} className="bg-card text-foreground">100</option>
                    <option value={137} className="bg-card text-foreground">137 (All)</option>
                    <option value={-1} className="bg-card text-foreground">All</option>
                  </select>
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1 text-xs print:hidden">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className={`px-2 py-1 rounded border border-border text-foreground hover:bg-muted transition cursor-pointer ${
                      currentPage <= 1 ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    Previous
                  </button>
                  <span className="px-2 text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className={`px-2 py-1 rounded border border-border text-foreground hover:bg-muted transition cursor-pointer ${
                      currentPage >= totalPages ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Submit Action Bar (Orange/Amber SUBMIT Button matching screenshot) */}
            <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSubmitRequisition}
                className="px-6 py-2 bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold text-xs uppercase tracking-wider rounded shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="size-4 font-bold" />
                <span>SUBMIT</span>
              </button>

              <span className="text-xs text-muted-foreground">
                {selectedIds.size > 0
                  ? `${selectedIds.size} employee(s) selected for submission`
                  : "All current filtered entries will be submitted"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
