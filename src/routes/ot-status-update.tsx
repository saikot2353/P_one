import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Timer,
  ChevronRight,
  Search,
  Printer,
  CheckCircle2,
  XCircle,
  Filter,
  RotateCcw,
  Users,
  Award,
  FileSpreadsheet,
  UserCheck,
  Building2,
  Layers,
  X,
} from "lucide-react";

export const Route = createFileRoute("/ot-status-update")({
  head: () => ({
    meta: [
      { title: "OT Status Update — CRIPTON HRIS" },
      {
        name: "description",
        content: "Update employee OT status, attendance bonus, and behaviour bonus in bulk or individually.",
      },
    ],
  }),
  component: OTStatusUpdatePage,
});

export interface EmployeeOTStatusRecord {
  id: string;
  empId: string;
  empIdOff: string;
  name: string;
  type: string;
  department: string;
  designation: string;
  section: string;
  unit: string;
  line: string;
  otStatus: "Yes" | "No";
  attendanceBonus: number;
  behaviourBonus: number;
  lastUpdated: string;
  updatedBy?: string;
  remarks?: string;
}

const DEPARTMENTS = [
  "ALL",
  "Accounts & Finance",
  "Admin",
  "Administration",
  "Audit",
  "CAD",
  "Commercial",
  "Cutting",
  "Dyeing",
  "Finishing",
  "Human Resources",
  "ICT",
  "IE & Planning",
  "Knitting",
  "Maintenance",
  "Marketing & Merchandising",
  "MIS",
  "Procurement",
  "Production",
  "QA & QC",
  "R&D",
  "Sewing",
  "Supply Chain",
  "Washing",
];

const DESIGNATIONS = [
  "ALL",
  "General Manager",
  "Deputy General Manager",
  "Assistant General Manager",
  "Manager",
  "Deputy Manager",
  "Assistant Manager",
  "Senior Executive",
  "Executive",
  "Junior Executive",
  "Officer",
  "Senior Officer",
  "Supervisor",
  "Line Leader",
  "Quality Inspector",
  "Senior Operator",
  "Operator",
  "Junior Operator",
  "Helper",
  "Driver",
  "Security Guard",
  "Peon / Office Attendant",
  "Intern",
];

const SECTIONS = [
  "ALL",
  "Core Management",
  "Office Administration",
  "Human Resources",
  "Internal Audit",
  "General Store (MCD)",
  "Chemical Store (MCD)",
  "Cutting Section",
  "Sewing Section",
  "Finishing Section",
  "Quality Control",
  "Maintenance Utility & Textile",
  "Maintenance RMG",
  "Marketing & Merchandising",
  "Medical",
  "Compliance",
  "Fire and Safety",
  "Production Planning",
];

const UNITS = [
  "ALL",
  "N/A",
  "Unit-01",
  "Unit-02",
  "Unit-03",
  "Unit-04",
  "Unit-05",
  "Unit-06",
  "Unit-07",
  "Unit-08",
  "Unit-10",
];

const LINES = [
  "ALL",
  "N/A",
  "0",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "12",
  "15",
  "20",
  "25",
  "30",
  "45",
  "65",
];

const INITIAL_EMPLOYEES: EmployeeOTStatusRecord[] = [
  {
    id: "EMP-001",
    empId: "2020021549",
    empIdOff: "OFF-1549",
    name: "Aminur Islam",
    type: "Office Executive",
    department: "Human Resources",
    designation: "Assistant Manager",
    section: "Human Resources",
    unit: "Unit-01",
    line: "N/A",
    otStatus: "Yes",
    attendanceBonus: 500,
    behaviourBonus: 300,
    lastUpdated: "2026-10-20",
    updatedBy: "Admin",
  },
  {
    id: "EMP-002",
    empId: "2023044857",
    empIdOff: "OFF-4857",
    name: "Md. Rakibul Alam Raju",
    type: "Office Executive",
    department: "Marketing & Merchandising",
    designation: "Deputy Manager",
    section: "Marketing & Merchandising",
    unit: "Unit-05",
    line: "02",
    otStatus: "Yes",
    attendanceBonus: 800,
    behaviourBonus: 500,
    lastUpdated: "2026-10-18",
    updatedBy: "HR Lead",
  },
  {
    id: "EMP-003",
    empId: "2023045146",
    empIdOff: "OFF-5146",
    name: "Asif Hossain",
    type: "Worker",
    department: "Admin",
    designation: "Driver",
    section: "Office Administration",
    unit: "Unit-01",
    line: "01",
    otStatus: "Yes",
    attendanceBonus: 400,
    behaviourBonus: 200,
    lastUpdated: "2026-10-15",
    updatedBy: "Admin",
  },
  {
    id: "EMP-004",
    empId: "2023043910",
    empIdOff: "OFF-3910",
    name: "Tahmid Afsar Shapno",
    type: "Office Executive",
    department: "ICT",
    designation: "Assistant Manager",
    section: "Core Management",
    unit: "Unit-02",
    line: "N/A",
    otStatus: "No",
    attendanceBonus: 0,
    behaviourBonus: 0,
    lastUpdated: "2026-10-12",
    updatedBy: "Admin",
  },
  {
    id: "EMP-005",
    empId: "2021031021",
    empIdOff: "OFF-1021",
    name: "Farhana Yasmin",
    type: "Office Executive",
    department: "Accounts & Finance",
    designation: "Senior Officer",
    section: "Core Management",
    unit: "Unit-01",
    line: "N/A",
    otStatus: "Yes",
    attendanceBonus: 600,
    behaviourBonus: 400,
    lastUpdated: "2026-10-22",
    updatedBy: "Finance Mgr",
  },
  {
    id: "EMP-006",
    empId: "2022041180",
    empIdOff: "OFF-1180",
    name: "Kamrul Hasan",
    type: "Worker",
    department: "Sewing",
    designation: "Senior Operator",
    section: "Sewing Section",
    unit: "Unit-03",
    line: "04",
    otStatus: "Yes",
    attendanceBonus: 1000,
    behaviourBonus: 500,
    lastUpdated: "2026-10-21",
    updatedBy: "Floor Sup",
  },
  {
    id: "EMP-007",
    empId: "2022041195",
    empIdOff: "OFF-1195",
    name: "Nazmul Haque",
    type: "Worker",
    department: "Sewing",
    designation: "Operator",
    section: "Sewing Section",
    unit: "Unit-03",
    line: "04",
    otStatus: "Yes",
    attendanceBonus: 800,
    behaviourBonus: 300,
    lastUpdated: "2026-10-21",
    updatedBy: "Floor Sup",
  },
  {
    id: "EMP-008",
    empId: "2022041210",
    empIdOff: "OFF-1210",
    name: "Mst. Rina Akter",
    type: "Worker",
    department: "Sewing",
    designation: "Junior Operator",
    section: "Sewing Section",
    unit: "Unit-03",
    line: "05",
    otStatus: "No",
    attendanceBonus: 500,
    behaviourBonus: 0,
    lastUpdated: "2026-10-10",
    updatedBy: "Floor Sup",
  },
  {
    id: "EMP-009",
    empId: "2021051560",
    empIdOff: "OFF-1560",
    name: "Shahadat Hossain",
    type: "Worker",
    department: "Cutting",
    designation: "Supervisor",
    section: "Cutting Section",
    unit: "Unit-02",
    line: "01",
    otStatus: "Yes",
    attendanceBonus: 750,
    behaviourBonus: 400,
    lastUpdated: "2026-10-19",
    updatedBy: "Prod Mgr",
  },
  {
    id: "EMP-010",
    empId: "2021051582",
    empIdOff: "OFF-1582",
    name: "Mahfuzur Rahman",
    type: "Worker",
    department: "Cutting",
    designation: "Helper",
    section: "Cutting Section",
    unit: "Unit-02",
    line: "01",
    otStatus: "Yes",
    attendanceBonus: 500,
    behaviourBonus: 200,
    lastUpdated: "2026-10-19",
    updatedBy: "Prod Mgr",
  },
  {
    id: "EMP-011",
    empId: "2020081944",
    empIdOff: "OFF-1944",
    name: "Tanvir Ahmed",
    type: "Office Executive",
    department: "Procurement",
    designation: "Executive",
    section: "General Store (MCD)",
    unit: "Unit-01",
    line: "N/A",
    otStatus: "No",
    attendanceBonus: 0,
    behaviourBonus: 0,
    lastUpdated: "2026-10-05",
    updatedBy: "Admin",
  },
  {
    id: "EMP-012",
    empId: "2023012055",
    empIdOff: "OFF-2055",
    name: "Fatema Tuz Zohra",
    type: "Office Executive",
    department: "QA & QC",
    designation: "Quality Inspector",
    section: "Quality Control",
    unit: "Unit-04",
    line: "08",
    otStatus: "Yes",
    attendanceBonus: 650,
    behaviourBonus: 350,
    lastUpdated: "2026-10-23",
    updatedBy: "QA Head",
  },
  {
    id: "EMP-013",
    empId: "2023012089",
    empIdOff: "OFF-2089",
    name: "Ariful Islam",
    type: "Worker",
    department: "Finishing",
    designation: "Line Leader",
    section: "Finishing Section",
    unit: "Unit-04",
    line: "10",
    otStatus: "Yes",
    attendanceBonus: 900,
    behaviourBonus: 500,
    lastUpdated: "2026-10-17",
    updatedBy: "Floor Sup",
  },
  {
    id: "EMP-014",
    empId: "2022092301",
    empIdOff: "OFF-2301",
    name: "Sharmin Sultana",
    type: "Worker",
    department: "Finishing",
    designation: "Helper",
    section: "Finishing Section",
    unit: "Unit-04",
    line: "10",
    otStatus: "No",
    attendanceBonus: 400,
    behaviourBonus: 200,
    lastUpdated: "2026-10-08",
    updatedBy: "Floor Sup",
  },
  {
    id: "EMP-015",
    empId: "2021112502",
    empIdOff: "OFF-2502",
    name: "Zahidul Karim",
    type: "Office Executive",
    department: "Maintenance",
    designation: "Assistant Manager",
    section: "Maintenance Utility & Textile",
    unit: "Unit-01",
    line: "N/A",
    otStatus: "Yes",
    attendanceBonus: 700,
    behaviourBonus: 400,
    lastUpdated: "2026-10-20",
    updatedBy: "Chief Engr",
  },
  {
    id: "EMP-016",
    empId: "2021112540",
    empIdOff: "OFF-2540",
    name: "Babul Mia",
    type: "Worker",
    department: "Maintenance",
    designation: "Operator",
    section: "Maintenance RMG",
    unit: "Unit-03",
    line: "02",
    otStatus: "Yes",
    attendanceBonus: 600,
    behaviourBonus: 300,
    lastUpdated: "2026-10-16",
    updatedBy: "Chief Engr",
  },
  {
    id: "EMP-017",
    empId: "2024013100",
    empIdOff: "OFF-3100",
    name: "Nusrat Jahan",
    type: "Office Executive",
    department: "IE & Planning",
    designation: "Junior Executive",
    section: "Production Planning",
    unit: "Unit-01",
    line: "N/A",
    otStatus: "No",
    attendanceBonus: 0,
    behaviourBonus: 0,
    lastUpdated: "2026-10-01",
    updatedBy: "Admin",
  },
  {
    id: "EMP-018",
    empId: "2022063345",
    empIdOff: "OFF-3345",
    name: "Moniruzzaman",
    type: "Worker",
    department: "Dyeing",
    designation: "Senior Operator",
    section: "General Store (MCD)",
    unit: "Unit-06",
    line: "N/A",
    otStatus: "Yes",
    attendanceBonus: 1200,
    behaviourBonus: 600,
    lastUpdated: "2026-10-22",
    updatedBy: "Dyeing Head",
  },
  {
    id: "EMP-019",
    empId: "2022063390",
    empIdOff: "OFF-3390",
    name: "Shohel Rana",
    type: "Worker",
    department: "Dyeing",
    designation: "Helper",
    section: "General Store (MCD)",
    unit: "Unit-06",
    line: "N/A",
    otStatus: "Yes",
    attendanceBonus: 500,
    behaviourBonus: 250,
    lastUpdated: "2026-10-18",
    updatedBy: "Dyeing Head",
  },
  {
    id: "EMP-020",
    empId: "2023083750",
    empIdOff: "OFF-3750",
    name: "Rubel Ahmed",
    type: "Worker",
    department: "Knitting",
    designation: "Operator",
    section: "General Store (MCD)",
    unit: "Unit-07",
    line: "05",
    otStatus: "Yes",
    attendanceBonus: 750,
    behaviourBonus: 350,
    lastUpdated: "2026-10-14",
    updatedBy: "Knitting Sup",
  },
  {
    id: "EMP-021",
    empId: "2023083792",
    empIdOff: "OFF-3792",
    name: "Sabbir Hossain",
    type: "Worker",
    department: "Supply Chain",
    designation: "Officer",
    section: "General Store (MCD)",
    unit: "Unit-01",
    line: "N/A",
    otStatus: "No",
    attendanceBonus: 300,
    behaviourBonus: 200,
    lastUpdated: "2026-10-11",
    updatedBy: "SC Head",
  },
  {
    id: "EMP-022",
    empId: "2021024011",
    empIdOff: "OFF-4011",
    name: "Jannatul Ferdous",
    type: "Office Executive",
    department: "Commercial",
    designation: "Senior Executive",
    section: "Core Management",
    unit: "Unit-01",
    line: "N/A",
    otStatus: "Yes",
    attendanceBonus: 850,
    behaviourBonus: 500,
    lastUpdated: "2026-10-23",
    updatedBy: "Commercial Mgr",
  },
];

function OTStatusUpdatePage() {
  // Master Records State
  const [employees, setEmployees] = useState<EmployeeOTStatusRecord[]>(INITIAL_EMPLOYEES);

  // Filter Form States
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("ALL");
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [filterSection, setFilterSection] = useState("ALL");
  const [filterUnit, setFilterUnit] = useState("ALL");
  const [filterLine, setFilterLine] = useState("ALL");

  // Applied Filter States (triggered when user clicks Search)
  const [appliedFilters, setAppliedFilters] = useState({
    employee: "",
    designation: "ALL",
    department: "ALL",
    section: "ALL",
    unit: "ALL",
    line: "ALL",
  });

  // Table In-search & OT Status Filter
  const [tableSearch, setTableSearch] = useState("");
  const [otStatusQuickFilter, setOtStatusQuickFilter] = useState<"ALL" | "Yes" | "No">("ALL");

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Under-table Dropdown Action State
  const [dropdownAction, setDropdownAction] = useState<string>("");

  // Modals States
  const [isOtModalOpen, setIsOtModalOpen] = useState(false);
  const [otModalValue, setOtModalValue] = useState<"Yes" | "No">("Yes");

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceAmount, setAttendanceAmount] = useState<string>("500");

  const [isBehaviourModalOpen, setIsBehaviourModalOpen] = useState(false);
  const [behaviourAmount, setBehaviourAmount] = useState<string>("300");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle Search Button Click
  const handleSearch = () => {
    setAppliedFilters({
      employee: filterEmployee.trim(),
      designation: filterDesignation,
      department: filterDepartment,
      section: filterSection,
      unit: filterUnit,
      line: filterLine,
    });
    setCurrentPage(1);
    toast.info("Search filters applied successfully.");
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilterEmployee("");
    setFilterDesignation("ALL");
    setFilterDepartment("ALL");
    setFilterSection("ALL");
    setFilterUnit("ALL");
    setFilterLine("ALL");
    setAppliedFilters({
      employee: "",
      designation: "ALL",
      department: "ALL",
      section: "ALL",
      unit: "ALL",
      line: "ALL",
    });
    setTableSearch("");
    setOtStatusQuickFilter("ALL");
    setCurrentPage(1);
    toast.success("Filters reset to default.");
  };

  // Filtered Records based on applied search + in-table search
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Applied Employee text filter (supports search by name, ID, or comma-separated list of IDs)
      if (appliedFilters.employee) {
        const query = appliedFilters.employee.toLowerCase();
        const commaSeparated = query
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        if (commaSeparated.length > 1) {
          const matchAny = commaSeparated.some(
            (term) =>
              emp.empId.toLowerCase().includes(term) ||
              emp.empIdOff.toLowerCase().includes(term) ||
              emp.name.toLowerCase().includes(term)
          );
          if (!matchAny) return false;
        } else {
          const matches =
            emp.empId.toLowerCase().includes(query) ||
            emp.empIdOff.toLowerCase().includes(query) ||
            emp.name.toLowerCase().includes(query);
          if (!matches) return false;
        }
      }

      // Designation
      if (appliedFilters.designation !== "ALL" && emp.designation !== appliedFilters.designation) {
        return false;
      }

      // Department
      if (appliedFilters.department !== "ALL" && emp.department !== appliedFilters.department) {
        return false;
      }

      // Section
      if (appliedFilters.section !== "ALL" && emp.section !== appliedFilters.section) {
        return false;
      }

      // Unit
      if (appliedFilters.unit !== "ALL" && emp.unit !== appliedFilters.unit) {
        return false;
      }

      // Line
      if (appliedFilters.line !== "ALL" && emp.line !== appliedFilters.line) {
        return false;
      }

      // Quick OT Status tab
      if (otStatusQuickFilter !== "ALL" && emp.otStatus !== otStatusQuickFilter) {
        return false;
      }

      // In-table live search
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        const matchesTable =
          emp.empId.toLowerCase().includes(q) ||
          emp.empIdOff.toLowerCase().includes(q) ||
          emp.name.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q) ||
          emp.section.toLowerCase().includes(q) ||
          emp.unit.toLowerCase().includes(q) ||
          emp.line.toLowerCase().includes(q);
        if (!matchesTable) return false;
      }

      return true;
    });
  }, [employees, appliedFilters, otStatusQuickFilter, tableSearch]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Selected Records
  const selectedEmployees = useMemo(() => {
    return employees.filter((emp) => selectedIds.has(emp.id));
  }, [employees, selectedIds]);

  // Checkbox helpers
  const isAllPaginatedSelected =
    paginatedEmployees.length > 0 && paginatedEmployees.every((emp) => selectedIds.has(emp.id));

  const isAllFilteredSelected =
    filteredEmployees.length > 0 && filteredEmployees.every((emp) => selectedIds.has(emp.id));

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectPaginated = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllPaginatedSelected) {
        paginatedEmployees.forEach((emp) => next.delete(emp.id));
      } else {
        paginatedEmployees.forEach((emp) => next.add(emp.id));
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedIds(new Set(filteredEmployees.map((emp) => emp.id)));
    toast.success(`Selected all ${filteredEmployees.length} filtered employees.`);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    toast.info("Cleared employee selection.");
  };

  // Under-table Dropdown change handler
  const handleDropdownChange = (val: string) => {
    setDropdownAction(val);

    if (!val) return;

    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee from the table first!");
      setDropdownAction("");
      return;
    }

    if (val === "ot-status") {
      setIsOtModalOpen(true);
    } else if (val === "attendance-bonus") {
      setIsAttendanceModalOpen(true);
    } else if (val === "behaviour-bonus") {
      setIsBehaviourModalOpen(true);
    }
  };

  // Submit OT Status Modal
  const handleConfirmOtStatus = () => {
    const today = new Date().toISOString().split("T")[0];
    setEmployees((prev) =>
      prev.map((emp) => {
        if (selectedIds.has(emp.id)) {
          return {
            ...emp,
            otStatus: otModalValue,
            lastUpdated: today,
            updatedBy: "Current User",
          };
        }
        return emp;
      })
    );

    toast.success(
      `Updated OT Status to "${otModalValue}" for ${selectedIds.size} employee(s) successfully!`
    );
    setIsOtModalOpen(false);
    setDropdownAction("");
  };

  // Submit Attendance Bonus Modal
  const handleSubmitAttendanceBonus = () => {
    const num = parseFloat(attendanceAmount);
    if (isNaN(num) || num < 0) {
      toast.error("Please enter a valid bonus amount (৳).");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    setEmployees((prev) =>
      prev.map((emp) => {
        if (selectedIds.has(emp.id)) {
          return {
            ...emp,
            attendanceBonus: num,
            lastUpdated: today,
            updatedBy: "Current User",
          };
        }
        return emp;
      })
    );

    toast.success(
      `Updated Attendance Bonus to ৳${num.toLocaleString()} for ${selectedIds.size} employee(s) successfully!`
    );
    setIsAttendanceModalOpen(false);
    setDropdownAction("");
  };

  // Submit Behaviour Bonus Modal
  const handleSubmitBehaviourBonus = () => {
    const num = parseFloat(behaviourAmount);
    if (isNaN(num) || num < 0) {
      toast.error("Please enter a valid bonus amount (৳).");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    setEmployees((prev) =>
      prev.map((emp) => {
        if (selectedIds.has(emp.id)) {
          return {
            ...emp,
            behaviourBonus: num,
            lastUpdated: today,
            updatedBy: "Current User",
          };
        }
        return emp;
      })
    );

    toast.success(
      `Updated Behaviour Bonus to ৳${num.toLocaleString()} for ${selectedIds.size} employee(s) successfully!`
    );
    setIsBehaviourModalOpen(false);
    setDropdownAction("");
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Off ID",
      "Name",
      "Department",
      "Designation",
      "Section",
      "Unit",
      "Line",
      "OT Status",
      "Attendance Bonus",
      "Behaviour Bonus",
      "Last Updated",
    ];

    const rows = filteredEmployees.map((emp, idx) => [
      idx + 1,
      emp.empId,
      emp.empIdOff,
      `"${emp.name}"`,
      `"${emp.department}"`,
      `"${emp.designation}"`,
      `"${emp.section}"`,
      emp.unit,
      emp.line,
      emp.otStatus,
      emp.attendanceBonus,
      emp.behaviourBonus,
      emp.lastUpdated,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OT_Status_Update_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredEmployees.length} employee records to CSV!`);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 md:p-6 space-y-5 flex-1">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Human Resource</span>
                <ChevronRight className="size-3" />
                <span className="text-muted-foreground font-medium">Manage Overtime</span>
                <ChevronRight className="size-3" />
                <span className="text-blue-600 dark:text-blue-400 font-semibold">OT Status Update</span>
              </nav>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                  <Timer className="size-5" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    OT Status Update
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Filter and bulk update Employee Overtime (OT) eligibility, Attendance Bonus, and Behaviour Bonus.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links / Badges */}
            <div className="flex items-center gap-2">
              <Link
                to="/approve-overtime"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="size-3.5" /> Approve OT Requisition
              </Link>
              <Link
                to="/manage-overtime"
                search={{ tab: "requisition" }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20 transition-all"
              >
                <Timer className="size-3.5" /> OT Requisition
              </Link>
            </div>
          </div>

          {/* Filter Panel Console */}
          <div className="bg-card border border-border/80 rounded-2xl p-4 md:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-semibold text-foreground tracking-tight">
                  Employee Filter Console
                </h2>
                <Badge variant="outline" className="text-[11px] px-2 py-0 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                  Search & Multi-select
                </Badge>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" /> Reset Filters
              </button>
            </div>

            {/* Filter Inputs Grid: Employee, Designation, Department, Section, Unit, Line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {/* 1. Employee Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <UserCheck className="size-3 text-muted-foreground" /> Employee
                </label>
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={filterEmployee}
                    onChange={(e) => setFilterEmployee(e.target.value)}
                    placeholder="ID or Name..."
                    className="w-full text-xs pl-8.5 pr-7 py-2 rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-muted-foreground/60"
                  />
                  {filterEmployee && (
                    <button
                      type="button"
                      onClick={() => setFilterEmployee("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Designation Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Award className="size-3 text-muted-foreground" /> Designation
                </label>
                <select
                  value={filterDesignation}
                  onChange={(e) => setFilterDesignation(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground"
                >
                  {DESIGNATIONS.map((desig) => (
                    <option key={desig} value={desig}>
                      {desig}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Department Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Building2 className="size-3 text-muted-foreground" /> Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Section Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Layers className="size-3 text-muted-foreground" /> Section
                </label>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Unit Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Building2 className="size-3 text-muted-foreground" /> Unit
                </label>
                <select
                  value={filterUnit}
                  onChange={(e) => setFilterUnit(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground"
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Line Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Layers className="size-3 text-muted-foreground" /> Line
                </label>
                <select
                  value={filterLine}
                  onChange={(e) => setFilterLine(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground"
                >
                  {LINES.map((line) => (
                    <option key={line} value={line}>
                      {line}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-muted-foreground">
                Showing <strong className="text-foreground">{filteredEmployees.length}</strong> matching employees based on current criteria.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3.5 py-2 rounded-lg border border-input text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  <Search className="size-3.5" /> Search
                </button>
              </div>
            </div>
          </div>

          {/* BULK UPDATE ACTIONS BAR (TOP OF TABLE) */}
          <div className="bg-card border border-border/80 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Selected:</span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  selectedIds.size > 0
                    ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {selectedIds.size} employee{selectedIds.size === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={dropdownAction}
                onChange={(e) => handleDropdownChange(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-48"
              >
                <option value="">Select Action...</option>
                <option value="ot-status">OT Status</option>
                <option value="attendance-bonus">Attendence bonous</option>
                <option value="behaviour-bonus">behaviour bonus</option>
              </select>

              <button
                type="button"
                disabled={!dropdownAction || selectedIds.size === 0}
                onClick={() => handleDropdownChange(dropdownAction)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Employee List Table Section */}
          <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            {/* Table Toolbar */}
            <div className="p-3.5 md:p-4 border-b border-border/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-muted/20">
              <div className="flex flex-wrap items-center gap-2">
                {/* Live table search */}
                <div className="relative w-64 max-w-full">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => {
                      setTableSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Quick search in table..."
                    className="w-full text-xs pl-8.5 pr-3 py-1.5 rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* OT Status Quick Filter Pills */}
                <div className="inline-flex items-center p-0.5 rounded-lg bg-muted border border-border/50 text-xs">
                  <button
                    type="button"
                    onClick={() => setOtStatusQuickFilter("ALL")}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      otStatusQuickFilter === "ALL"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All ({employees.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtStatusQuickFilter("Yes")}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      otStatusQuickFilter === "Yes"
                        ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    OT: Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtStatusQuickFilter("No")}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      otStatusQuickFilter === "No"
                        ? "bg-background text-rose-600 dark:text-rose-400 shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    OT: No
                  </button>
                </div>
              </div>

              {/* Selection Controls & Export Tools */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {selectedIds.size} selected
                    </span>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-xs text-muted-foreground hover:text-rose-600 transition-colors"
                      title="Clear selection"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="px-2.5 py-1.5 rounded-lg border border-input text-xs font-medium text-foreground hover:bg-muted transition-all"
                  title="Select all filtered employees"
                >
                  Select All ({filteredEmployees.length})
                </button>

                <div className="h-4 w-[1px] bg-border mx-1" />

                {/* Export Buttons */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-input text-xs font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
                  title="Export to CSV / Excel"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel/CSV
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-input text-xs font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
                  title="Print Table"
                >
                  <Printer className="size-3.5 text-blue-600" /> Print
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllPaginatedSelected}
                        onChange={toggleSelectPaginated}
                        className="size-4 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer"
                        title={isAllPaginatedSelected ? "Deselect page" : "Select entire page"}
                      />
                    </th>
                    <th className="py-3 px-2 w-12 text-center"># SL</th>
                    <th className="py-3 px-3">Employee ID</th>
                    <th className="py-3 px-3">Employee Name</th>
                    <th className="py-3 px-3">Designation</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Section</th>
                    <th className="py-3 px-3">Unit / Line</th>
                    <th className="py-3 px-3 text-center">OT Status</th>
                    <th className="py-3 px-3 text-right">Attendance Bonus</th>
                    <th className="py-3 px-3 text-right">Behaviour Bonus</th>
                    <th className="py-3 px-3 text-center">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="size-8 text-muted-foreground/40" />
                          <p className="font-medium text-sm">No employees match your filter criteria.</p>
                          <p className="text-xs text-muted-foreground">Try clearing or adjusting the search filters above.</p>
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="mt-2 px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((emp, index) => {
                      const isSelected = selectedIds.has(emp.id);
                      const sl = (currentPage - 1) * pageSize + index + 1;

                      return (
                        <tr
                          key={emp.id}
                          onClick={() => toggleSelectRow(emp.id)}
                          className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-blue-50/70 dark:bg-blue-950/30 border-l-3 border-l-blue-600"
                              : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td
                            className="py-2.5 px-3 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(emp.id)}
                              className="size-4 rounded border-input text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* SL */}
                          <td className="py-2.5 px-2 text-center text-muted-foreground font-mono">
                            {sl}
                          </td>

                          {/* Employee ID */}
                          <td className="py-2.5 px-3">
                            <span className="font-mono font-semibold text-foreground">
                              {emp.empId}
                            </span>
                            <span className="block text-[11px] text-muted-foreground font-mono">
                              {emp.empIdOff}
                            </span>
                          </td>

                          {/* Employee Name */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="size-7 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                                {emp.name
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="font-medium text-foreground hover:underline">
                                {emp.name}
                              </span>
                            </div>
                          </td>

                          {/* Designation */}
                          <td className="py-2.5 px-3 text-foreground font-medium">
                            {emp.designation}
                          </td>

                          {/* Department */}
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {emp.department}
                          </td>

                          {/* Section */}
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {emp.section}
                          </td>

                          {/* Unit / Line */}
                          <td className="py-2.5 px-3">
                            <span className="text-foreground font-medium">{emp.unit}</span>
                            <span className="text-muted-foreground text-[11px]"> / L-{emp.line}</span>
                          </td>

                          {/* OT Status */}
                          <td className="py-2.5 px-3 text-center">
                            {emp.otStatus === "Yes" ? (
                              <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold gap-1 text-[11px] px-2 py-0.5">
                                <CheckCircle2 className="size-3" /> Yes
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-semibold gap-1 text-[11px] px-2 py-0.5">
                                <XCircle className="size-3" /> No
                              </Badge>
                            )}
                          </td>

                          {/* Attendance Bonus */}
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-foreground">
                            ৳ {emp.attendanceBonus.toLocaleString()}
                          </td>

                          {/* Behaviour Bonus */}
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-foreground">
                            ৳ {emp.behaviourBonus.toLocaleString()}
                          </td>

                          {/* Last Updated */}
                          <td className="py-2.5 px-3 text-center text-muted-foreground font-mono text-[11px]">
                            {emp.lastUpdated}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Bar */}
            <div className="p-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs bg-muted/10">
              <div className="text-muted-foreground">
                Showing{" "}
                <strong className="text-foreground">
                  {filteredEmployees.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground">
                  {Math.min(currentPage * pageSize, filteredEmployees.length)}
                </strong>{" "}
                of <strong className="text-foreground">{filteredEmployees.length}</strong> entries
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 rounded border border-input bg-background text-foreground text-xs"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded border border-input bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-2 text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 rounded border border-input bg-background hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: OT STATUS MODAL (Yes or No) */}
      {/* ======================================================== */}
      {isOtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-sm rounded-xl shadow-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Update OT Status</h3>
              <button
                type="button"
                onClick={() => {
                  setIsOtModalOpen(false);
                  setDropdownAction("");
                }}
                className="size-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Set OT status for <strong className="text-foreground">{selectedIds.size}</strong> selected employee(s):
              </p>

              {/* Yes or No Selection */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setOtModalValue("Yes")}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    otModalValue === "Yes"
                      ? "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <CheckCircle2 className="size-3.5 text-emerald-600" /> Yes
                </button>

                <button
                  type="button"
                  onClick={() => setOtModalValue("No")}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    otModalValue === "No"
                      ? "border-rose-600 bg-rose-500/15 text-rose-700 dark:text-rose-300"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <XCircle className="size-3.5 text-rose-600" /> No
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOtModalOpen(false);
                  setDropdownAction("");
                }}
                className="px-3 py-1.5 rounded-lg border border-input text-xs font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOtStatus}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ATTENDANCE BONUS MODAL (Amount Input Field) */}
      {/* ======================================================== */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-sm rounded-xl shadow-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Update Attendance Bonus</h3>
              <button
                type="button"
                onClick={() => {
                  setIsAttendanceModalOpen(false);
                  setDropdownAction("");
                }}
                className="size-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Enter bonus amount for <strong className="text-foreground">{selectedIds.size}</strong> selected employee(s):
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Amount (৳)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={attendanceAmount}
                    onChange={(e) => setAttendanceAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full text-xs font-semibold pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAttendanceModalOpen(false);
                  setDropdownAction("");
                }}
                className="px-3 py-1.5 rounded-lg border border-input text-xs font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitAttendanceBonus}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: BEHAVIOUR BONUS MODAL (Amount Input Field) */}
      {/* ======================================================== */}
      {isBehaviourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-sm rounded-xl shadow-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Update Behaviour Bonus</h3>
              <button
                type="button"
                onClick={() => {
                  setIsBehaviourModalOpen(false);
                  setDropdownAction("");
                }}
                className="size-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Enter bonus amount for <strong className="text-foreground">{selectedIds.size}</strong> selected employee(s):
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Amount (৳)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={behaviourAmount}
                    onChange={(e) => setBehaviourAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full text-xs font-semibold pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsBehaviourModalOpen(false);
                  setDropdownAction("");
                }}
                className="px-3 py-1.5 rounded-lg border border-input text-xs font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitBehaviourBonus}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
