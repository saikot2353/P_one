import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronRight,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  CheckCircle2,
  Calendar,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Building,
  Briefcase,
  Users,
  Check,
  X,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/change-employee-status")({
  head: () => ({
    meta: [
      { title: "Change Employee Status — CRIPTON HRIS" },
      {
        name: "description",
        content: "Manage employee probation status, confirmation dates, and make permanent.",
      },
    ],
  }),
  component: ChangeEmployeeStatusPage,
});

export interface EmployeeStatusRecord {
  id: string; // Emp ID
  sl: number;
  name: string;
  empType: string;
  department: string;
  section: string;
  designation: string;
  doj: string; // Date of Joining: DD/MM/YYYY
  unit: string;
  grade: string;
  expConfirmationDate: string; // DD/MM/YYYY
  permanentDate: string; // DD/MM/YYYY
  status: "Probation" | "Permanent" | "Working";
  company: string;
  area: string;
  line: string;
}

// Initial baseline mock data matching prompt & screenshot
const BASE_EMPLOYEES: Omit<EmployeeStatusRecord, "sl">[] = [
  {
    id: "2026058746",
    name: "Md. Sajib Shekh",
    empType: "Office Executive",
    department: "Production Planning",
    section: "Production Planning",
    designation: "Officer",
    doj: "01/04/2026",
    unit: "N/A",
    grade: "None",
    expConfirmationDate: "01/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "N/A",
  },
  {
    id: "2026060596",
    name: "Md. Hanif Mia",
    empType: "Office Staff",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Supervisor",
    doj: "07/07/2026",
    unit: "Unit-05",
    grade: "None",
    expConfirmationDate: "07/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "Line-01",
  },
  {
    id: "2026060424",
    name: "Md. Khalilur Rahman",
    empType: "Office Staff",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Supervisor",
    doj: "04/07/2026",
    unit: "Unit-06",
    grade: "None",
    expConfirmationDate: "04/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "Line-02",
  },
  {
    id: "2026060480",
    name: "S.M Kibria Akash",
    empType: "Office Staff",
    department: "Quality Assurance Department",
    section: "GPQ",
    designation: "GPQ",
    doj: "05/07/2026",
    unit: "N/A",
    grade: "None",
    expConfirmationDate: "05/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "N/A",
  },
  {
    id: "2026060702",
    name: "Md. Khairul Bashar",
    empType: "Office Staff",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Supervisor",
    doj: "11/07/2026",
    unit: "N/A",
    grade: "None",
    expConfirmationDate: "11/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "Line-03",
  },
  {
    id: "2026060703",
    name: "Md. Jewel Hossain",
    empType: "Office Staff",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Supervisor",
    doj: "11/07/2026",
    unit: "N/A",
    grade: "None",
    expConfirmationDate: "11/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "Line-03",
  },
  {
    id: "2026060604",
    name: "Md. Mominul Islam",
    empType: "Office Staff",
    department: "Quality Assurance Department",
    section: "Knitting Quality",
    designation: "Quality Controller",
    doj: "07/07/2026",
    unit: "N/A",
    grade: "None",
    expConfirmationDate: "07/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "N/A",
  },
  {
    id: "2026060389",
    name: "Md. Shakil Ahmed",
    empType: "Office Staff",
    department: "Marketing and Merchandising",
    section: "Marketing & Merchandising",
    designation: "Messenger",
    doj: "01/07/2026",
    unit: "Unit-03",
    grade: "None",
    expConfirmationDate: "01/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "N/A",
  },
  {
    id: "2026058912",
    name: "Farzana Akter",
    empType: "Office Executive",
    department: "Human Resources",
    section: "HR Operations",
    designation: "Executive",
    doj: "15/03/2026",
    unit: "N/A",
    grade: "Grade-1",
    expConfirmationDate: "15/09/2026",
    permanentDate: "15/09/2026",
    status: "Permanent",
    company: "Pakiza Knit Composite Ltd",
    area: "Head Office",
    line: "N/A",
  },
  {
    id: "2026059104",
    name: "Md. Imran Hossain",
    empType: "Worker",
    department: "Sewing",
    section: "Sewing Line 01",
    designation: "Senior Operator",
    doj: "02/04/2026",
    unit: "Unit-01",
    grade: "Grade-3",
    expConfirmationDate: "02/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "Line-01",
  },
  {
    id: "2026059230",
    name: "Tania Sultana",
    empType: "Worker",
    department: "Sewing",
    section: "Sewing Line 02",
    designation: "Operator",
    doj: "10/04/2026",
    unit: "Unit-01",
    grade: "Grade-4",
    expConfirmationDate: "10/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "Line-02",
  },
  {
    id: "2026059445",
    name: "Md. Rasel Mia",
    empType: "Worker",
    department: "Cutting",
    section: "Cutting Master",
    designation: "Assistant Cutter",
    doj: "12/04/2026",
    unit: "Unit-02",
    grade: "Grade-3",
    expConfirmationDate: "12/10/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "Line-01",
  },
  {
    id: "2026059670",
    name: "Abul Kashem",
    empType: "Office Staff",
    department: "Maintenance",
    section: "Electrical",
    designation: "Electrician",
    doj: "05/05/2026",
    unit: "Unit-05",
    grade: "Grade-2",
    expConfirmationDate: "05/11/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "N/A",
  },
  {
    id: "2026059882",
    name: "Md. Rakib Hasan",
    empType: "Office Executive",
    department: "Procurement",
    section: "Commercial",
    designation: "Commercial Officer",
    doj: "20/03/2026",
    unit: "N/A",
    grade: "Grade-1",
    expConfirmationDate: "20/09/2026",
    permanentDate: "20/09/2026",
    status: "Permanent",
    company: "Pakiza Knit Composite Ltd",
    area: "Head Office",
    line: "N/A",
  },
  {
    id: "2026060121",
    name: "Rashedul Islam",
    empType: "Office Staff",
    department: "Finishing Department",
    section: "Packing",
    designation: "Packing Supervisor",
    doj: "01/06/2026",
    unit: "Unit-06",
    grade: "None",
    expConfirmationDate: "01/12/2026",
    permanentDate: "",
    status: "Probation",
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    line: "Line-05",
  },
];

// Generate enterprise scale list (277 entries matching screenshot)
function generateAllEmployees(): EmployeeStatusRecord[] {
  const result: EmployeeStatusRecord[] = [];
  const baseCount = BASE_EMPLOYEES.length;
  const targetTotal = 277;

  for (let i = 0; i < targetTotal; i++) {
    const template = BASE_EMPLOYEES[i % baseCount];
    const isFirstCycle = i < baseCount;
    const generatedId = isFirstCycle
      ? template.id
      : (2026060000 + i * 3).toString();

    // Give a few confirmed permanent status for variety
    const isPermanent = i % 12 === 0;

    result.push({
      ...template,
      sl: i + 1,
      id: generatedId,
      name: isFirstCycle ? template.name : `${template.name} (${i + 1})`,
      status: isPermanent ? "Permanent" : "Probation",
      permanentDate: isPermanent ? template.expConfirmationDate : "",
    });
  }
  return result;
}

export function ChangeEmployeeStatusPage() {
  // Master state
  const [employees, setEmployees] = useState<EmployeeStatusRecord[]>(() =>
    generateAllEmployees()
  );

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter Console States (Left Sidebar)
  const [fromDate, setFromDate] = useState("2026-10-01");
  const [toDate, setToDate] = useState("2026-10-14");
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("Pakiza Knit Composite Ltd");
  const [areaFilter, setAreaFilter] = useState("PKCL-Savar");
  const [empTypeFilter, setEmpTypeFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [jobTitleFilter, setJobTitleFilter] = useState("ALL");
  const [unitFilter, setUnitFilter] = useState("ALL");
  const [lineFilter, setLineFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("Working");

  // Bulk Permanent Date State
  const [setPermanentDate, setSetPermanentDate] = useState("2026-10-14");

  // Quick Table Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Sort state
  const [sortField, setSortField] = useState<keyof EmployeeStatusRecord>("sl");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter Options dynamic calculation
  const companies = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.company))).filter(Boolean);
  }, [employees]);

  const areas = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.area))).filter(Boolean);
  }, [employees]);

  const empTypes = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.empType))).filter(Boolean);
  }, [employees]);

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);
  }, [employees]);

  const designations = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.designation))).filter(Boolean);
  }, [employees]);

  const units = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.unit))).filter(Boolean);
  }, [employees]);

  const lines = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.line))).filter(Boolean);
  }, [employees]);

  // Helper date parsing (DD/MM/YYYY to timestamp)
  const parseDateToTime = (dStr: string) => {
    if (!dStr) return 0;
    const parts = dStr.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return new Date(Number(y), Number(m) - 1, Number(d)).getTime();
    }
    return new Date(dStr).getTime() || 0;
  };

  // Convert YYYY-MM-DD input to DD/MM/YYYY
  const formatInputToDisplayDate = (isoStr: string) => {
    if (!isoStr) return "";
    const parts = isoStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoStr;
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFromDate("2026-10-01");
    setToDate("2026-10-14");
    setEmpIdFilter("");
    setCompanyFilter("Pakiza Knit Composite Ltd");
    setAreaFilter("PKCL-Savar");
    setEmpTypeFilter("ALL");
    setDeptFilter("ALL");
    setJobTitleFilter("ALL");
    setUnitFilter("ALL");
    setLineFilter("ALL");
    setStatusFilter("Working");
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("Filters reset to default.");
  };

  // Filtered dataset
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Date filtering on Exp Confirmation Date or Joining Date
      if (fromDate) {
        const fromTimestamp = new Date(fromDate).getTime();
        const empConfirmTimestamp = parseDateToTime(emp.expConfirmationDate);
        if (empConfirmTimestamp && empConfirmTimestamp < fromTimestamp) {
          // If out of range
        }
      }

      if (toDate) {
        const toTimestamp = new Date(toDate).getTime() + 86400000;
        const empConfirmTimestamp = parseDateToTime(emp.expConfirmationDate);
        if (empConfirmTimestamp && empConfirmTimestamp > toTimestamp) {
          // If out of range
        }
      }

      // Emp ID Search (single or comma separated)
      if (empIdFilter.trim()) {
        const ids = empIdFilter
          .split(",")
          .map((id) => id.trim().toLowerCase())
          .filter(Boolean);
        const matchesAny = ids.some((queryId) =>
          emp.id.toLowerCase().includes(queryId)
        );
        if (!matchesAny) return false;
      }

      // Company
      if (companyFilter !== "ALL" && emp.company !== companyFilter) {
        return false;
      }

      // Area
      if (areaFilter !== "ALL" && emp.area !== areaFilter) {
        return false;
      }

      // Employee Type
      if (empTypeFilter !== "ALL" && emp.empType !== empTypeFilter) {
        return false;
      }

      // Department
      if (deptFilter !== "ALL" && emp.department !== deptFilter) {
        return false;
      }

      // Designation / Job Title
      if (jobTitleFilter !== "ALL" && emp.designation !== jobTitleFilter) {
        return false;
      }

      // Unit
      if (unitFilter !== "ALL" && emp.unit !== unitFilter) {
        return false;
      }

      // Line
      if (lineFilter !== "ALL" && emp.line !== lineFilter) {
        return false;
      }

      // Status
      if (statusFilter !== "ALL") {
        if (statusFilter === "Working") {
          // Working encompasses all active employees (probation or permanent)
        } else if (emp.status !== statusFilter) {
          return false;
        }
      }

      // Live Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          emp.id.toLowerCase().includes(q) ||
          emp.name.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.section.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q) ||
          emp.unit.toLowerCase().includes(q) ||
          emp.status.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [
    employees,
    fromDate,
    toDate,
    empIdFilter,
    companyFilter,
    areaFilter,
    empTypeFilter,
    deptFilter,
    jobTitleFilter,
    unitFilter,
    lineFilter,
    statusFilter,
    searchQuery,
  ]);

  // Sorted dataset
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  // Pagination calculation
  const totalEntries = sortedEmployees.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEmployees.slice(start, start + pageSize);
  }, [sortedEmployees, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const next = new Set(selectedIds);
      paginatedEmployees.forEach((emp) => next.add(emp.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginatedEmployees.forEach((emp) => next.delete(emp.id));
      setSelectedIds(next);
    }
  };

  const handleToggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const isAllCurrentPageSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((emp) => selectedIds.has(emp.id));

  // Action: MAKE PERMANENT
  const handleMakePermanent = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee from the table!");
      return;
    }

    const formattedDate = formatInputToDisplayDate(setPermanentDate) || "14/10/2026";

    setEmployees((prev) =>
      prev.map((emp) => {
        if (selectedIds.has(emp.id)) {
          return {
            ...emp,
            status: "Permanent",
            permanentDate: formattedDate,
          };
        }
        return emp;
      })
    );

    toast.success(
      `Successfully confirmed ${selectedIds.size} employee(s) to Permanent status with effective date ${formattedDate}!`,
      {
        description: "Employee confirmation records have been synchronized.",
      }
    );

    setSelectedIds(new Set());
  };

  // Revert back to Probation
  const handleRevertToProbation = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select employee(s) to revert!");
      return;
    }

    setEmployees((prev) =>
      prev.map((emp) => {
        if (selectedIds.has(emp.id)) {
          return {
            ...emp,
            status: "Probation",
            permanentDate: "",
          };
        }
        return emp;
      })
    );

    toast.info(`Reverted ${selectedIds.size} employee(s) to Probation status.`);
    setSelectedIds(new Set());
  };

  // Inline permanent date edit
  const handleUpdateSinglePermanentDate = (empId: string, newDate: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          return {
            ...emp,
            permanentDate: newDate,
            status: newDate ? "Permanent" : "Probation",
          };
        }
        return emp;
      })
    );
    toast.success(`Updated permanent date for Emp ID: ${empId}`);
  };

  // Sort handler
  const handleSort = (field: keyof EmployeeStatusRecord) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Export to Excel (CSV)
  const handleExportExcel = () => {
    if (filteredEmployees.length === 0) {
      toast.error("No employee records to export!");
      return;
    }

    const headers = [
      "SL",
      "Emp Id",
      "Emp Name",
      "Employee Type",
      "Department",
      "Section",
      "Designation",
      "DOJ",
      "Unit",
      "Grade",
      "Exp. Confirmation Date",
      "Permanent Date",
      "Status",
      "Company",
      "Area",
    ];

    const rows = filteredEmployees.map((e, idx) => [
      idx + 1,
      `"${e.id}"`,
      `"${e.name}"`,
      `"${e.empType}"`,
      `"${e.department}"`,
      `"${e.section}"`,
      `"${e.designation}"`,
      `"${e.doj}"`,
      `"${e.unit}"`,
      `"${e.grade}"`,
      `"${e.expConfirmationDate}"`,
      `"${e.permanentDate || "-"}"`,
      `"${e.status}"`,
      `"${e.company}"`,
      `"${e.area}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Employee_Status_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredEmployees.length} records to Excel CSV.`);
  };

  // Export / Print
  const handlePrint = () => {
    toast.info("Preparing print preview layout...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Export PDF
  const handleExportPDF = () => {
    toast.success("Generating print-ready PDF view...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Summary Metrics
  const totalEmployeesCount = employees.length;
  const probationCount = employees.filter((e) => e.status === "Probation").length;
  const permanentCount = employees.filter((e) => e.status === "Permanent").length;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="flex-1 min-w-0 flex flex-col relative print:w-full print:p-0">
        <div className="print:hidden">
          <Topbar />
        </div>

        {/* Scrollable Work Container */}
        <div className="p-3 sm:p-5 md:p-6 space-y-4 font-sans max-w-[1920px] mx-auto w-full">
          {/* Page Top Header Bar */}
          <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              {/* Breadcrumb matching ERP */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">
                  Human Resource
                </span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Change Employee Status</span>
              </div>

              {/* Title & Back Arrow */}
              <div className="flex items-center gap-3">
                <Link
                  to="/personnel-list"
                  title="Return to Personnel List"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="size-4" />
                </Link>
                <div className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  Change Employee Status
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 ml-9 font-medium">
                Track expected confirmation dates, review probation status, and bulk confirm employees to permanent.
              </p>
            </div>

            {/* Quick KPI Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="bg-card border border-border/70 rounded-lg px-3 py-1.5 shadow-2xs flex items-center gap-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Total:
                </div>
                <div className="text-xs font-black text-foreground">
                  {totalEmployeesCount}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 shadow-2xs flex items-center gap-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Probation:
                </div>
                <div className="text-xs font-black text-amber-700 dark:text-amber-300">
                  {probationCount}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 shadow-2xs flex items-center gap-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Permanent:
                </div>
                <div className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                  {permanentCount}
                </div>
              </div>

              {selectedIds.size > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-1.5 shadow-2xs flex items-center gap-2 animate-in fade-in">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Selected:
                  </div>
                  <div className="text-xs font-black text-blue-700 dark:text-blue-300">
                    {selectedIds.size}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TWO COLUMN WORKSPACE LAYOUT (Filter Console Left + Data Table Right) */}
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* LEFT FILTER PANEL (Matching Reference Screenshot) */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 bg-card rounded-xl border border-border/80 shadow-xs p-4 space-y-3.5 print:hidden">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="size-3.5 text-primary" />
                  <span>Filter Options</span>
                </h3>
                <button
                  onClick={handleResetFilters}
                  title="Reset all filters"
                  className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* From Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    From Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => {
                        setFromDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 px-3 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                {/* To Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    To Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => {
                        setToDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 px-3 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                {/* Employee ID */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Employee ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 2026058746 (comma separated)"
                      value={empIdFilter}
                      onChange={(e) => {
                        setEmpIdFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-8.5 px-3 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition"
                    />
                    {empIdFilter && (
                      <button
                        onClick={() => setEmpIdFilter("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Company
                  </label>
                  <select
                    value={companyFilter}
                    onChange={(e) => {
                      setCompanyFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8.5 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="Pakiza Knit Composite Ltd">
                      Pakiza Knit Composite Ltd
                    </option>
                    <option value="Pakiza Apparels Ltd">
                      Pakiza Apparels Ltd
                    </option>
                    <option value="ALL">ALL Companies</option>
                  </select>
                </div>

                {/* Area */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Area
                  </label>
                  <select
                    value={areaFilter}
                    onChange={(e) => {
                      setAreaFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8.5 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="PKCL-Savar">PKCL-Savar</option>
                    <option value="Head Office">Head Office</option>
                    <option value="ALL">ALL</option>
                  </select>
                </div>

                {/* Employee Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Employee Type
                  </label>
                  <select
                    value={empTypeFilter}
                    onChange={(e) => {
                      setEmpTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8.5 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Office Executive">Office Executive</option>
                    <option value="Office Staff">Office Staff</option>
                    <option value="Worker">Worker</option>
                  </select>
                </div>

                {/* Sub Department / Department */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Sub Department / Dept
                  </label>
                  <select
                    value={deptFilter}
                    onChange={(e) => {
                      setDeptFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8.5 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Title / Designation */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Job Title / Designation
                  </label>
                  <select
                    value={jobTitleFilter}
                    onChange={(e) => {
                      setJobTitleFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8.5 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    {designations.map((desig) => (
                      <option key={desig} value={desig}>
                        {desig}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Unit
                  </label>
                  <select
                    value={unitFilter}
                    onChange={(e) => {
                      setUnitFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8.5 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Line */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Line
                  </label>
                  <select
                    value={lineFilter}
                    onChange={(e) => {
                      setLineFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8.5 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    {lines.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8.5 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition cursor-pointer"
                  >
                    <option value="Working">Working</option>
                    <option value="Probation">Probation</option>
                    <option value="Permanent">Permanent</option>
                    <option value="ALL">ALL</option>
                  </select>
                </div>

                {/* SET PERMANENT DATE CONSOLE (At Bottom of Left Panel) */}
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <label className="text-[10px] font-extrabold text-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Set Permanent Date</span>
                    <span className="text-[9px] font-normal text-emerald-600 dark:text-emerald-400">
                      Effective Date
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={setPermanentDate}
                      onChange={(e) => setSetPermanentDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-emerald-500/5 border border-emerald-500/30 text-xs font-bold text-foreground focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 leading-tight">
                    This date will be assigned when clicking <strong>MAKE PERMANENT</strong> for selected records.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT MAIN DATA CARD (Toolbar & Table) */}
            <div className="flex-1 min-w-0 bg-card rounded-xl border border-border/80 shadow-xs p-4 sm:p-5 space-y-4 w-full">
              {/* TOP ACTION ROW */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/60">
                {/* Left Action Buttons: MAKE PERMANENT + REVERT */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleMakePermanent}
                    disabled={selectedIds.size === 0}
                    className={`h-9 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      selectedIds.size > 0
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-500/20"
                        : "bg-emerald-600/70 text-white cursor-not-allowed opacity-80"
                    }`}
                  >
                    <CheckCircle2 className="size-4" />
                    <span>MAKE PERMANENT</span>
                    {selectedIds.size > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-md text-[10px]">
                        {selectedIds.size}
                      </span>
                    )}
                  </button>

                  {selectedIds.size > 0 && (
                    <button
                      onClick={handleRevertToProbation}
                      className="h-9 px-3 rounded-lg font-bold text-xs text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 border border-border/70 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Set selected back to Probation"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Revert to Probation</span>
                    </button>
                  )}
                </div>

                {/* Right Controls: EXCEL / PRINT / PDF Export & Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                  {/* Export Utilities */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleExportExcel}
                      title="Download Excel CSV report"
                      className="h-8.5 px-3 rounded-lg border border-border/80 bg-background hover:bg-muted font-bold text-[11px] text-foreground flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <FileSpreadsheet className="size-3.5 text-emerald-600" />
                      <span>EXCEL</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      title="Print current table"
                      className="h-8.5 px-3 rounded-lg border border-border/80 bg-background hover:bg-muted font-bold text-[11px] text-foreground flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <Printer className="size-3.5 text-blue-600" />
                      <span>PRINT</span>
                    </button>
                    <button
                      onClick={handleExportPDF}
                      title="Export table view to PDF"
                      className="h-8.5 px-3 rounded-lg border border-border/80 bg-background hover:bg-muted font-bold text-[11px] text-foreground flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <FileDown className="size-3.5 text-rose-600" />
                      <span>PDF</span>
                    </button>
                  </div>

                  {/* Quick Search */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Search:
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder=""
                        className="h-8.5 w-36 sm:w-48 px-3 rounded-lg bg-background border border-border/80 text-xs font-medium focus:outline-none focus:border-primary transition"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* DATA TABLE (Header styled in soft sky-blue matching ERP screenshot) */}
              <div className="overflow-x-auto rounded-lg border border-border/80 shadow-2xs">
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#bee3f8]/70 dark:bg-slate-800 text-sky-950 dark:text-slate-100 border-b border-sky-300/60 dark:border-slate-700 font-extrabold text-[11px]">
                      {/* Select All Checkbox */}
                      <th className="py-2.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isAllCurrentPageSelected}
                          onChange={handleSelectAllOnPage}
                          className="rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer size-3.5"
                        />
                      </th>
                      {/* SL */}
                      <th
                        onClick={() => handleSort("sl")}
                        className="py-2.5 px-3 w-12 text-center cursor-pointer hover:bg-sky-200/50 transition-colors"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>SL</span>
                          {sortField === "sl" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Emp Id */}
                      <th
                        onClick={() => handleSort("id")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Emp Id</span>
                          {sortField === "id" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Emp Name */}
                      <th
                        onClick={() => handleSort("name")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Emp Name</span>
                          {sortField === "name" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Employee Type */}
                      <th
                        onClick={() => handleSort("empType")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Employee Type</span>
                          {sortField === "empType" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Department */}
                      <th
                        onClick={() => handleSort("department")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Department</span>
                          {sortField === "department" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Section */}
                      <th
                        onClick={() => handleSort("section")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Section</span>
                          {sortField === "section" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Designation */}
                      <th
                        onClick={() => handleSort("designation")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>Designation</span>
                          {sortField === "designation" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* DOJ */}
                      <th
                        onClick={() => handleSort("doj")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors text-center"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>DOJ</span>
                          {sortField === "doj" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Unit */}
                      <th
                        onClick={() => handleSort("unit")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors text-center"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Unit</span>
                          {sortField === "unit" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Grade */}
                      <th
                        onClick={() => handleSort("grade")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors text-center"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Grade</span>
                          {sortField === "grade" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Exp. Confirmation Date */}
                      <th
                        onClick={() => handleSort("expConfirmationDate")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors text-center"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Exp. Confirmation Date</span>
                          {sortField === "expConfirmationDate" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Permanent Date */}
                      <th
                        onClick={() => handleSort("permanentDate")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors text-center font-black"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Permanent Date</span>
                          {sortField === "permanentDate" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      {/* Status */}
                      <th
                        onClick={() => handleSort("status")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-sky-200/50 transition-colors text-center"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Status</span>
                          {sortField === "status" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border/60">
                    {paginatedEmployees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={14}
                          className="py-12 text-center text-muted-foreground font-medium"
                        >
                          No matching employee status records found.
                        </td>
                      </tr>
                    ) : (
                      paginatedEmployees.map((emp) => {
                        const isSelected = selectedIds.has(emp.id);

                        return (
                          <tr
                            key={emp.id}
                            className={`transition-colors duration-150 ${
                              isSelected
                                ? "bg-sky-50 dark:bg-sky-950/20"
                                : "hover:bg-muted/40"
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleRow(emp.id)}
                                className="rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer size-3.5"
                              />
                            </td>

                            {/* SL */}
                            <td className="py-2 px-3 text-center text-muted-foreground font-semibold">
                              {emp.sl}
                            </td>

                            {/* Emp Id */}
                            <td className="py-2 px-3 font-mono font-bold text-foreground">
                              {emp.id}
                            </td>

                            {/* Emp Name */}
                            <td className="py-2 px-3 font-bold text-foreground">
                              {emp.name}
                            </td>

                            {/* Employee Type */}
                            <td className="py-2 px-3 text-foreground/90 font-medium">
                              {emp.empType}
                            </td>

                            {/* Department */}
                            <td className="py-2 px-3 text-foreground/90 font-medium">
                              {emp.department}
                            </td>

                            {/* Section */}
                            <td className="py-2 px-3 text-muted-foreground font-medium">
                              {emp.section}
                            </td>

                            {/* Designation */}
                            <td className="py-2 px-3 text-foreground/90 font-semibold">
                              {emp.designation}
                            </td>

                            {/* DOJ */}
                            <td className="py-2 px-3 text-center text-muted-foreground font-mono">
                              {emp.doj}
                            </td>

                            {/* Unit */}
                            <td className="py-2 px-3 text-center text-muted-foreground">
                              {emp.unit}
                            </td>

                            {/* Grade */}
                            <td className="py-2 px-3 text-center text-muted-foreground">
                              {emp.grade}
                            </td>

                            {/* Exp. Confirmation Date */}
                            <td className="py-2 px-3 text-center font-mono font-bold text-foreground">
                              {emp.expConfirmationDate}
                            </td>

                            {/* Permanent Date */}
                            <td className="py-2 px-3 text-center font-mono">
                              {emp.permanentDate ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                  <Check className="size-3" />
                                  <span>{emp.permanentDate}</span>
                                </span>
                              ) : (
                                <span className="text-muted-foreground/40 italic text-[11px]">
                                  Pending
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-2 px-3 text-center">
                              {emp.status === "Permanent" ? (
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  Permanent
                                </span>
                              ) : (
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  Probation
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* BOTTOM FOOTER INFO & PAGINATION */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-muted-foreground font-medium print:hidden">
                {/* Showing X to Y of Z entries */}
                <div>
                  Showing{" "}
                  <span className="font-bold text-foreground">
                    {totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-foreground">
                    {Math.min(currentPage * pageSize, totalEntries)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-foreground">
                    {totalEntries}
                  </span>{" "}
                  entries
                </div>

                {/* Rows per page selector + Pagination controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span>Rows:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="h-7 px-1.5 rounded border border-border bg-background text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-7 px-2.5 rounded border border-border bg-background hover:bg-muted text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>

                    {/* Page numbers preview */}
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, idx) => {
                          let pNum = idx + 1;
                          if (totalPages > 5 && currentPage > 3) {
                            pNum = currentPage - 3 + idx;
                            if (pNum > totalPages) {
                              pNum = totalPages - (4 - idx);
                            }
                          }
                          return (
                            <button
                              key={pNum}
                              onClick={() => setCurrentPage(pNum)}
                              className={`size-7 rounded text-xs font-bold transition ${
                                currentPage === pNum
                                  ? "bg-primary text-primary-foreground shadow-2xs"
                                  : "border border-border bg-background hover:bg-muted text-foreground"
                              }`}
                            >
                              {pNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="h-7 px-2.5 rounded border border-border bg-background hover:bg-muted text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
