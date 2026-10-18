import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Clock,
  ChevronRight,
  Plus,
  ArrowLeft,
  Search,
  Users,
  Check,
  Trash2,
  Eye,
  FileSpreadsheet,
  Printer,
  FileDown,
  AlertCircle,
  Building2,
  RefreshCw,
  X,
  CheckCircle2,
  FolderTree,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/shift-control-center")({
  head: () => ({
    meta: [
      { title: "Initial Shift Setup — CRIPTON" },
      {
        name: "description",
        content: "Initial base shift allocation for employees when beginning system operations.",
      },
    ],
  }),
  component: ShiftControlCenterPage,
});

// Employee Structure
interface Employee {
  id: string;
  name: string;
  dept: string;
  section: string;
  designation: string;
  unit: string;
  line: string;
  type: string;
  currentShift: string;
}

// Shift Assignment Record Structure
interface ShiftRecord {
  id: string;
  empId: string;
  name: string;
  dept: string;
  section: string;
  designation: string;
  unit: string;
  previousShift: string;
  assignedShift: string;
  effectiveDate: string;
  status: "Active" | "Scheduled";
  createdAt: string;
  notes?: string;
}

// Available Shift Definitions
interface ShiftOption {
  id: string;
  name: string;
  timeRange: string;
}

const SHIFT_OPTIONS: ShiftOption[] = [
  { id: "general", name: "General Shift", timeRange: "09:00 AM – 06:00 PM" },
  { id: "morning", name: "Morning Shift", timeRange: "06:00 AM – 02:00 PM" },
  { id: "day", name: "Day Shift", timeRange: "08:00 AM – 05:00 PM" },
  { id: "evening", name: "Evening Shift", timeRange: "02:00 PM – 10:00 PM" },
  { id: "night", name: "Night Shift", timeRange: "10:00 PM – 06:00 AM" },
  { id: "exe-ptvl", name: "Exe-Ptvl", timeRange: "09:30 AM – 06:30 PM" },
  { id: "general-transport", name: "General-Transport", timeRange: "07:30 AM – 04:30 PM" },
];

// Rich Initial Database of Employees across multiple Departments & Sections
const initialEmployeesDatabase: Employee[] = [
  // Core Development (HR)
  {
    id: "2023043910",
    name: "Tahmid Afsar Shapno",
    dept: "Core Development (HR)",
    section: "Core Engineering",
    designation: "Asst. Manager",
    unit: "PSL",
    line: "Line-01",
    type: "Staff",
    currentShift: "General Shift",
  },
  {
    id: "2022035599",
    name: "Dipon Saha",
    dept: "Core Development (HR)",
    section: "Core Engineering",
    designation: "Manager",
    unit: "PSL",
    line: "Line-01",
    type: "Staff",
    currentShift: "Exe-Ptvl",
  },
  {
    id: "2025057309",
    name: "Bani Amin Jwel",
    dept: "Core Development (HR)",
    section: "R&D Architecture",
    designation: "Sr. Manager",
    unit: "PSL",
    line: "Line-02",
    type: "Staff",
    currentShift: "General Shift",
  },
  {
    id: "2023046001",
    name: "Sohanur Rahman Sohan",
    dept: "Core Development (HR)",
    section: "Backend Services",
    designation: "Software Engineer",
    unit: "PSL",
    line: "Line-01",
    type: "Staff",
    currentShift: "General Shift",
  },

  // WEB-Team
  {
    id: "2025053125",
    name: "Al Riyad Karim",
    dept: "WEB-Team",
    section: "Frontend Engineering",
    designation: "Sr. Executive",
    unit: "PSL",
    line: "Line-01",
    type: "Staff",
    currentShift: "General Shift",
  },
  {
    id: "2024039822",
    name: "Tanvir Hasan",
    dept: "WEB-Team",
    section: "UI/UX Development",
    designation: "Frontend Engineer",
    unit: "PSL",
    line: "Line-01",
    type: "Staff",
    currentShift: "Morning Shift",
  },
  {
    id: "2024045109",
    name: "Mahmudul Hasan",
    dept: "WEB-Team",
    section: "Fullstack Solutions",
    designation: "Fullstack Developer",
    unit: "PSL",
    line: "Line-02",
    type: "Staff",
    currentShift: "General Shift",
  },

  // Implementation & Support (HR)
  {
    id: "2021028542",
    name: "Zakir Hossain",
    dept: "Implementation & Support (HR)",
    section: "Client Support",
    designation: "Executive",
    unit: "PSL",
    line: "Line-03",
    type: "Staff",
    currentShift: "Exe-Ptvl",
  },
  {
    id: "2022019943",
    name: "Farhan Shakil",
    dept: "Implementation & Support (HR)",
    section: "On-site Implementation",
    designation: "Implementation Lead",
    unit: "PSL",
    line: "Line-03",
    type: "Staff",
    currentShift: "Day Shift",
  },

  // Admin & Security
  {
    id: "2024052336",
    name: "Md. Badal Mia",
    dept: "Admin",
    section: "Transport & Fleet",
    designation: "Driver",
    unit: "PSL",
    line: "Transport",
    type: "Staff",
    currentShift: "General-Transport",
  },
  {
    id: "2026059284",
    name: "Istiak Ahmed",
    dept: "Admin",
    section: "General Services",
    designation: "Office Boy",
    unit: "PSL",
    line: "N/A",
    type: "Staff",
    currentShift: "General Shift",
  },
  {
    id: "2022040132",
    name: "Md. Sakil",
    dept: "Admin",
    section: "Cafeteria & Hospitality",
    designation: "Asst. Cook",
    unit: "PTVL",
    line: "Cafeteria",
    type: "Worker",
    currentShift: "Morning Shift",
  },
  {
    id: "2021022804",
    name: "Kaikobad Howlader",
    dept: "Admin",
    section: "Physical Security",
    designation: "Security Guard",
    unit: "PTVL",
    line: "Gate-01",
    type: "Worker",
    currentShift: "Night Shift",
  },

  // Merchandising
  {
    id: "2023044501",
    name: "Anik Saha",
    dept: "Merchandising",
    section: "Woven Garments",
    designation: "Sr. Merchandiser",
    unit: "PTVL",
    line: "Woven",
    type: "Staff",
    currentShift: "General Shift",
  },
  {
    id: "2023043921",
    name: "Ariful Hasan",
    dept: "Merchandising",
    section: "Knit Garments",
    designation: "Jr. Merchandiser",
    unit: "PTVL",
    line: "Knit",
    type: "Staff",
    currentShift: "Day Shift",
  },

  // Production & Operations
  {
    id: "2024021101",
    name: "Mizanur Rahman",
    dept: "Production",
    section: "Sewing Section",
    designation: "Line Supervisor",
    unit: "PTVL",
    line: "Line-05",
    type: "Worker",
    currentShift: "Day Shift",
  },
  {
    id: "2024021102",
    name: "Shahidul Islam",
    dept: "Production",
    section: "Sewing Section",
    designation: "Machine Operator",
    unit: "PTVL",
    line: "Line-05",
    type: "Worker",
    currentShift: "Morning Shift",
  },
  {
    id: "2024021103",
    name: "Monir Hossain",
    dept: "Production",
    section: "Cutting Section",
    designation: "Cutting Master",
    unit: "PTVL",
    line: "Line-02",
    type: "Worker",
    currentShift: "Night Shift",
  },

  // Quality Assurance
  {
    id: "2023038812",
    name: "Shirin Akter",
    dept: "Quality Assurance",
    section: "Finished Goods Inspection",
    designation: "QA Executive",
    unit: "PTVL",
    line: "Inspection-A",
    type: "Staff",
    currentShift: "Day Shift",
  },
  {
    id: "2023038813",
    name: "Nazmul Haque",
    dept: "Quality Assurance",
    section: "In-line Audit",
    designation: "Quality Inspector",
    unit: "PTVL",
    line: "Inspection-B",
    type: "Staff",
    currentShift: "Evening Shift",
  },
];

// Initial Shift Records (List of shift assignments)
const initialShiftRecords: ShiftRecord[] = [
  {
    id: "SHF-101",
    empId: "2023043910",
    name: "Tahmid Afsar Shapno",
    dept: "Core Development (HR)",
    section: "Core Engineering",
    designation: "Asst. Manager",
    unit: "PSL",
    previousShift: "Morning Shift",
    assignedShift: "General Shift",
    effectiveDate: "2026-10-15",
    status: "Active",
    createdAt: "2026-10-14 10:30",
    notes: "Core engineering project roster assignment",
  },
  {
    id: "SHF-102",
    empId: "2022035599",
    name: "Dipon Saha",
    dept: "Core Development (HR)",
    section: "Core Engineering",
    designation: "Manager",
    unit: "PSL",
    previousShift: "General Shift",
    assignedShift: "Exe-Ptvl",
    effectiveDate: "2026-10-12",
    status: "Active",
    createdAt: "2026-10-11 16:45",
    notes: "Executive shift allocation",
  },
  {
    id: "SHF-103",
    empId: "2025053125",
    name: "Al Riyad Karim",
    dept: "WEB-Team",
    section: "Frontend Engineering",
    designation: "Sr. Executive",
    unit: "PSL",
    previousShift: "Day Shift",
    assignedShift: "General Shift",
    effectiveDate: "2026-10-10",
    status: "Active",
    createdAt: "2026-10-09 11:20",
    notes: "Web squad shift alignment",
  },
  {
    id: "SHF-104",
    empId: "2021022804",
    name: "Kaikobad Howlader",
    dept: "Admin",
    section: "Physical Security",
    designation: "Security Guard",
    unit: "PTVL",
    previousShift: "Evening Shift",
    assignedShift: "Night Shift",
    effectiveDate: "2026-10-01",
    status: "Active",
    createdAt: "2026-09-30 18:00",
    notes: "Gate night duty roster",
  },
  {
    id: "SHF-105",
    empId: "2024052336",
    name: "Md. Badal Mia",
    dept: "Admin",
    section: "Transport & Fleet",
    designation: "Driver",
    unit: "PSL",
    previousShift: "General Shift",
    assignedShift: "General-Transport",
    effectiveDate: "2026-09-28",
    status: "Active",
    createdAt: "2026-09-27 09:15",
    notes: "Fleet transport driver roster",
  },
  {
    id: "SHF-106",
    empId: "2024021101",
    name: "Mizanur Rahman",
    dept: "Production",
    section: "Sewing Section",
    designation: "Line Supervisor",
    unit: "PTVL",
    previousShift: "Morning Shift",
    assignedShift: "Day Shift",
    effectiveDate: "2026-10-05",
    status: "Active",
    createdAt: "2026-10-04 14:10",
    notes: "Production line 5 schedule",
  },
];

function ShiftControlCenterPage() {
  // Page mode: "list" (Full-page list with Filters & Create Shift Button) vs "create" (Full-page control screen)
  const [currentPageMode, setCurrentPageMode] = useState<"list" | "create">("list");

  // Persistent States
  const [employees, setEmployees] = useState<Employee[]>(initialEmployeesDatabase);
  const [shiftRecords, setShiftRecords] = useState<ShiftRecord[]>(initialShiftRecords);

  // ----------------------------------------------------
  // LIST PAGE: Filters & States (Neutral styling)
  // ----------------------------------------------------
  const [listSearch, setListSearch] = useState("");
  const [listDeptFilter, setListDeptFilter] = useState("ALL");
  const [listShiftFilter, setListShiftFilter] = useState("ALL");
  const [listDateFilter, setListDateFilter] = useState("");
  const [selectedListRecordIds, setSelectedListRecordIds] = useState<Set<string>>(new Set());

  // Record Detail Modal
  const [viewingRecord, setViewingRecord] = useState<ShiftRecord | null>(null);

  // Available unique departments
  const allDepartments = useMemo(() => {
    const set = new Set(employees.map((e) => e.dept));
    return Array.from(set).sort();
  }, [employees]);

  // Filtered shift records for the List Page
  const filteredRecords = useMemo(() => {
    return shiftRecords.filter((rec) => {
      const q = listSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rec.name.toLowerCase().includes(q) ||
        rec.empId.toLowerCase().includes(q) ||
        rec.designation.toLowerCase().includes(q) ||
        rec.section.toLowerCase().includes(q) ||
        rec.id.toLowerCase().includes(q);

      const matchesDept = listDeptFilter === "ALL" || rec.dept === listDeptFilter;
      const matchesShift = listShiftFilter === "ALL" || rec.assignedShift === listShiftFilter;
      const matchesDate = !listDateFilter || rec.effectiveDate === listDateFilter;

      return matchesSearch && matchesDept && matchesShift && matchesDate;
    });
  }, [shiftRecords, listSearch, listDeptFilter, listShiftFilter, listDateFilter]);

  // Reset list filters
  const handleResetListFilters = () => {
    setListSearch("");
    setListDeptFilter("ALL");
    setListShiftFilter("ALL");
    setListDateFilter("");
  };

  // Delete Record Handler
  const handleDeleteRecord = (id: string, name: string) => {
    setShiftRecords((prev) => prev.filter((r) => r.id !== id));
    setSelectedListRecordIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success(`Removed shift record for ${name}`);
  };

  // Bulk Delete Records Handler
  const handleBulkDelete = () => {
    if (selectedListRecordIds.size === 0) return;
    const count = selectedListRecordIds.size;
    setShiftRecords((prev) => prev.filter((r) => !selectedListRecordIds.has(r.id)));
    setSelectedListRecordIds(new Set());
    toast.success(`Deleted ${count} shift assignment record(s)`);
  };

  // Export handlers
  const handleExportExcel = () => toast.success("Exporting shift records to Excel (.xlsx)");
  const handleExportPDF = () => toast.success("Generating shift assignments PDF report");
  const handlePrint = () => window.print();

  // ----------------------------------------------------
  // CREATE / CONTROL SHIFT PAGE: States & Handlers
  // ----------------------------------------------------
  const [selectedDeptForShift, setSelectedDeptForShift] = useState("");
  const [selectedSectionForShift, setSelectedSectionForShift] = useState("ALL");
  const [hasSearchedDept, setHasSearchedDept] = useState(false);
  const [searchedEmployees, setSearchedEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const [filterEmployeeName, setFilterEmployeeName] = useState("");

  // Dynamically compute available sections for the selected department
  const availableSectionsForDept = useMemo(() => {
    if (!selectedDeptForShift) return [];
    const deptEmployees = employees.filter((e) => e.dept === selectedDeptForShift);
    const sectionsSet = new Set(deptEmployees.map((e) => e.section));
    return Array.from(sectionsSet).sort();
  }, [employees, selectedDeptForShift]);

  // Shift assignment fields
  const [effectiveDate, setEffectiveDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedShiftType, setSelectedShiftType] = useState("General Shift");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger: User clicks "Search Employees" button after selecting department & optional section
  const handleSearchDepartmentEmployees = () => {
    if (!selectedDeptForShift) {
      toast.error("Please select a department first before searching!");
      return;
    }

    const matched = employees.filter((e) => {
      const matchDept = e.dept === selectedDeptForShift;
      const matchSection =
        selectedSectionForShift === "ALL" || e.section === selectedSectionForShift;
      return matchDept && matchSection;
    });

    setSearchedEmployees(matched);
    setHasSearchedDept(true);
    setSelectedEmployeeIds(new Set()); // reset previous selection
    setFilterEmployeeName("");

    if (matched.length === 0) {
      toast.info(`No employees found in "${selectedDeptForShift}" with selected criteria.`);
    } else {
      toast.success(
        `Loaded ${matched.length} employee(s) from ${selectedDeptForShift}${
          selectedSectionForShift !== "ALL" ? ` (${selectedSectionForShift})` : ""
        }.`
      );
    }
  };

  // Filter within searched employees
  const visibleSearchedEmployees = useMemo(() => {
    if (!filterEmployeeName.trim()) return searchedEmployees;
    const q = filterEmployeeName.toLowerCase().trim();
    return searchedEmployees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.section.toLowerCase().includes(q)
    );
  }, [searchedEmployees, filterEmployeeName]);

  // Multi-select toggle for single employee
  const handleToggleEmployee = (empId: string) => {
    setSelectedEmployeeIds((prev) => {
      const next = new Set(prev);
      if (next.has(empId)) {
        next.delete(empId);
      } else {
        next.add(empId);
      }
      return next;
    });
  };

  // Multi-select Select All toggle
  const handleToggleSelectAllSearched = () => {
    if (visibleSearchedEmployees.length === 0) return;
    const allVisibleSelected = visibleSearchedEmployees.every((e) => selectedEmployeeIds.has(e.id));
    if (allVisibleSelected) {
      // Unselect visible
      setSelectedEmployeeIds((prev) => {
        const next = new Set(prev);
        visibleSearchedEmployees.forEach((e) => next.delete(e.id));
        return next;
      });
    } else {
      // Select all visible
      setSelectedEmployeeIds((prev) => {
        const next = new Set(prev);
        visibleSearchedEmployees.forEach((e) => next.add(e.id));
        return next;
      });
    }
  };

  // Save Shift Assignment
  const handleSaveShiftAssignment = () => {
    if (selectedEmployeeIds.size === 0) {
      toast.error("Please select at least one employee from the loaded list!");
      return;
    }

    if (!effectiveDate) {
      toast.error("Please choose a valid Start Date!");
      return;
    }

    if (!selectedShiftType) {
      toast.error("Please select a target Shift Type!");
      return;
    }

    setIsSubmitting(true);

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const selectedEmps = employees.filter((e) => selectedEmployeeIds.has(e.id));

    // Create new records
    const newRecords: ShiftRecord[] = selectedEmps.map((emp, idx) => ({
      id: `SHF-${Date.now().toString().slice(-4)}${idx + 1}`,
      empId: emp.id,
      name: emp.name,
      dept: emp.dept,
      section: emp.section,
      designation: emp.designation,
      unit: emp.unit,
      previousShift: emp.currentShift,
      assignedShift: selectedShiftType,
      effectiveDate: effectiveDate,
      status: "Active",
      createdAt: nowStr,
      notes: assignmentNotes.trim() || undefined,
    }));

    // Update employees' currentShift in database
    setEmployees((prev) =>
      prev.map((emp) => {
        if (selectedEmployeeIds.has(emp.id)) {
          return {
            ...emp,
            currentShift: selectedShiftType,
          };
        }
        return emp;
      })
    );

    // Prepend new records to shift records list
    setShiftRecords((prev) => [...newRecords, ...prev]);

    // Also update searched employees
    setSearchedEmployees((prev) =>
      prev.map((emp) => {
        if (selectedEmployeeIds.has(emp.id)) {
          return {
            ...emp,
            currentShift: selectedShiftType,
          };
        }
        return emp;
      })
    );

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        `Successfully assigned ${selectedShiftType} to ${selectedEmps.length} employee(s)!`,
        {
          description: `Starting from ${effectiveDate}. Records updated in shift control center.`,
        }
      );
      setSelectedEmployeeIds(new Set());
      setAssignmentNotes("");
      setCurrentPageMode("list");
    }, 300);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative h-screen overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ========================================================================= */}
          {/* TOP HEADER / BAR                                                          */}
          {/* ========================================================================= */}
          <div className="bg-card border-b border-border/60 px-4 md:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 shadow-2xs">
            <div className="space-y-0.5">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Manage Shift</span>
                <ChevronRight className="size-2.5" />
                <button
                  onClick={() => setCurrentPageMode("list")}
                  className={`hover:text-foreground transition-colors ${
                    currentPageMode === "list" ? "text-foreground font-black" : "text-muted-foreground/75"
                  }`}
                >
                  Initial Shift Setup
                </button>
                {currentPageMode === "create" && (
                  <>
                    <ChevronRight className="size-2.5" />
                    <span className="text-foreground font-black">Assign Base Shift</span>
                  </>
                )}
              </div>

              {/* Title */}
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-muted rounded-lg text-foreground">
                  <Clock className="size-5" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                    {currentPageMode === "list" ? "Initial Shift Setup" : "Assign Base Shift"}
                  </h1>
                </div>
              </div>
            </div>

            {/* Top Right Action Button */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {currentPageMode === "list" ? (
                <button
                  onClick={() => setCurrentPageMode("create")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  <Plus className="size-4" />
                  <span>Create Shift</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPageMode("list")}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border hover:bg-muted text-foreground font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back to Shift List</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BODY CONTENT: FULL PAGE LAYOUT                                           */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
            {currentPageMode === "list" ? (
              /* ===================================================================== */
              /* 1. LIST PAGE: FULL-PAGE FILTER TOOLBAR + FULL-WIDTH SHIFT TABLE       */
              /* ===================================================================== */
              <div className="w-full space-y-4">
                {/* Filter Toolbar Card (Clean Neutral Styling, No Colors) */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
                    {/* Search Input */}
                    <div className="lg:col-span-5 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Search Employee / ID / Section
                      </label>
                      <div className="relative">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                          type="text"
                          placeholder="Search name, ID, section, or designation..."
                          value={listSearch}
                          onChange={(e) => setListSearch(e.target.value)}
                          className="w-full h-9.5 pl-9 pr-3 rounded-lg bg-background border border-border text-xs font-normal text-foreground focus:outline-none focus:ring-1 focus:ring-border transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>

                    {/* Department Filter (Neutral, No Color) */}
                    <div className="lg:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Department
                      </label>
                      <select
                        value={listDeptFilter}
                        onChange={(e) => setListDeptFilter(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg bg-background border border-border text-xs font-normal text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-border transition-all"
                      >
                        <option value="ALL">All Departments</option>
                        {allDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Shift Filter (Neutral, No Color) */}
                    <div className="lg:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Assigned Shift
                      </label>
                      <select
                        value={listShiftFilter}
                        onChange={(e) => setListShiftFilter(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg bg-background border border-border text-xs font-normal text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-border transition-all"
                      >
                        <option value="ALL">All Shift Types</option>
                        {SHIFT_OPTIONS.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Start Date Filter (Neutral, No Color) */}
                    <div className="lg:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={listDateFilter}
                        onChange={(e) => setListDateFilter(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg bg-background border border-border text-xs font-normal text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-border transition-all"
                      />
                    </div>
                  </div>

                  {/* Reset Filters Toolbar Row */}
                  {(listSearch ||
                    listDeptFilter !== "ALL" ||
                    listShiftFilter !== "ALL" ||
                    listDateFilter) && (
                    <div className="flex items-center justify-end pt-2 border-t border-border/40">
                      <button
                        onClick={handleResetListFilters}
                        className="px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="size-3" />
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Table Card - Full Width Clean Monochrome */}
                <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden w-full">
                  {/* Table Header Tools */}
                  <div className="p-3.5 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          Shift Allocations ({filteredRecords.length})
                        </span>
                      </div>

                      {selectedListRecordIds.size > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in">
                          <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                            {selectedListRecordIds.size} selected
                          </span>
                          <button
                            onClick={handleBulkDelete}
                            className="text-xs font-semibold text-foreground hover:bg-muted px-2 py-0.5 rounded border border-border transition flex items-center gap-1"
                          >
                            <Trash2 className="size-3" /> Delete Selected
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Export Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleExportExcel}
                        className="h-8 px-2.5 rounded-md border border-border bg-card hover:bg-muted font-medium text-xs text-foreground flex items-center gap-1.5 transition"
                        title="Export to Excel"
                      >
                        <FileSpreadsheet className="size-3.5" />
                        <span className="hidden sm:inline">Excel</span>
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="h-8 px-2.5 rounded-md border border-border bg-card hover:bg-muted font-medium text-xs text-foreground flex items-center gap-1.5 transition"
                        title="Download PDF"
                      >
                        <FileDown className="size-3.5" />
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                      <button
                        onClick={handlePrint}
                        className="h-8 px-2.5 rounded-md border border-border bg-card hover:bg-muted font-medium text-xs text-foreground flex items-center gap-1.5 transition"
                        title="Print Table"
                      >
                        <Printer className="size-3.5" />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                    </div>
                  </div>

                  {/* Responsive Full-Width Data Table */}
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse text-xs text-left">
                      <thead>
                        <tr className="bg-muted/40 text-muted-foreground border-b border-border uppercase tracking-wider text-[10px] font-bold">
                          <th className="px-4 py-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={
                                filteredRecords.length > 0 &&
                                selectedListRecordIds.size === filteredRecords.length
                              }
                              onChange={() => {
                                if (selectedListRecordIds.size === filteredRecords.length) {
                                  setSelectedListRecordIds(new Set());
                                } else {
                                  setSelectedListRecordIds(
                                    new Set(filteredRecords.map((r) => r.id))
                                  );
                                }
                              }}
                              className="size-3.5 rounded cursor-pointer"
                            />
                          </th>
                          <th className="px-4 py-3">Employee Details</th>
                          <th className="px-4 py-3">Department & Section</th>
                          <th className="px-4 py-3">Unit</th>
                          <th className="px-4 py-3">Assigned Shift</th>
                          <th className="px-4 py-3">Previous Shift</th>
                          <th className="px-4 py-3">Start Date</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredRecords.map((rec) => {
                          const isSelected = selectedListRecordIds.has(rec.id);
                          return (
                            <tr
                              key={rec.id}
                              className={`hover:bg-muted/30 transition-colors ${
                                isSelected ? "bg-muted/50" : ""
                              }`}
                            >
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    setSelectedListRecordIds((prev) => {
                                      const next = new Set(prev);
                                      if (next.has(rec.id)) next.delete(rec.id);
                                      else next.add(rec.id);
                                      return next;
                                    });
                                  }}
                                  className="size-3.5 rounded cursor-pointer"
                                />
                              </td>
                              {/* Employee Details: Clean text, NO image circle */}
                              <td className="px-4 py-3">
                                <div>
                                  <div className="font-semibold text-foreground">
                                    {rec.name}
                                  </div>
                                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                                    <span>{rec.empId}</span>
                                    <span>•</span>
                                    <span className="font-sans">{rec.designation}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-foreground">{rec.dept}</div>
                                <div className="text-[11px] text-muted-foreground">
                                  {rec.section}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-foreground text-xs">
                                  {rec.unit}
                                </span>
                              </td>
                              {/* Assigned Shift: Plain clean text, NO icon and NO color */}
                              <td className="px-4 py-3">
                                <span className="font-medium text-foreground">
                                  {rec.assignedShift}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground font-normal">
                                {rec.previousShift}
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-mono text-foreground text-xs">
                                  {rec.effectiveDate}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setViewingRecord(rec)}
                                    className="p-1.5 rounded border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
                                    title="View Details"
                                  >
                                    <Eye className="size-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRecord(rec.id, rec.name)}
                                    className="p-1.5 rounded border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
                                    title="Revoke / Delete Assignment"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {filteredRecords.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-12 text-center">
                              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <AlertCircle className="size-5" />
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-xs text-foreground">
                                    No Shift Records Found
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    Try adjusting your filters or click "Create Shift" to assign employees.
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              /* ===================================================================== */
              /* 2. CREATE SHIFT PAGE: FULL-PAGE CLEAN DESIGN WITHOUT COLORS           */
              /* ===================================================================== */
              <div className="w-full space-y-4 animate-in fade-in duration-200">
                {/* STEP 1: Department Selector + Section Selector + Search Button */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-bold text-foreground">
                      Step 1 — Select Department & Section
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* Department Dropdown (Neutral, No Color) */}
                    <div className="md:col-span-5 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Select Department
                      </label>
                      <select
                        value={selectedDeptForShift}
                        onChange={(e) => {
                          setSelectedDeptForShift(e.target.value);
                          setSelectedSectionForShift("ALL");
                          setHasSearchedDept(false);
                          setSearchedEmployees([]);
                          setSelectedEmployeeIds(new Set());
                        }}
                        className="w-full h-9.5 px-3 rounded-lg bg-background border border-border text-xs font-normal text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-border transition-all"
                      >
                        <option value="">-- Choose a Department --</option>
                        {allDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Section Dropdown (Neutral, No Color) */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Select Section
                      </label>
                      <select
                        value={selectedSectionForShift}
                        disabled={!selectedDeptForShift}
                        onChange={(e) => setSelectedSectionForShift(e.target.value)}
                        className={`w-full h-9.5 px-3 rounded-lg border text-xs font-normal transition-all ${
                          !selectedDeptForShift
                            ? "bg-muted/20 text-muted-foreground cursor-not-allowed border-border"
                            : "bg-background border-border text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-border"
                        }`}
                      >
                        <option value="ALL">All Sections</option>
                        {availableSectionsForDept.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Employees Button */}
                    <div className="md:col-span-3">
                      <button
                        type="button"
                        onClick={handleSearchDepartmentEmployees}
                        disabled={!selectedDeptForShift}
                        className={`w-full h-9.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                          selectedDeptForShift
                            ? "bg-foreground text-background cursor-pointer hover:opacity-90 active:scale-[0.98]"
                            : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                        }`}
                      >
                        <Search className="size-3.5" />
                        <span>Search Employees</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* STEP 2: Loaded Employee List with Multi-Select (Clean, No Circle, No Colors) */}
                {hasSearchedDept ? (
                  <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden space-y-0 animate-in fade-in w-full">
                    {/* Header bar of employee list */}
                    <div className="p-3 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-foreground">
                          {selectedDeptForShift}{" "}
                          {selectedSectionForShift !== "ALL" ? `• ${selectedSectionForShift}` : ""}{" "}
                          ({visibleSearchedEmployees.length} Found)
                        </span>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                          {selectedEmployeeIds.size} Selected
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Search inside loaded employees */}
                        <div className="relative">
                          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                          <input
                            type="text"
                            placeholder="Filter by name / ID..."
                            value={filterEmployeeName}
                            onChange={(e) => setFilterEmployeeName(e.target.value)}
                            className="h-8 pl-8 pr-2.5 rounded-md bg-background border border-border text-xs font-normal focus:outline-none focus:ring-1 focus:ring-border w-52"
                          />
                        </div>

                        {/* Quick Selection Toggle */}
                        <button
                          type="button"
                          onClick={handleToggleSelectAllSearched}
                          className="h-8 px-3 rounded-md border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition"
                        >
                          {visibleSearchedEmployees.every((e) => selectedEmployeeIds.has(e.id))
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>
                    </div>

                    {/* Table of Searched Employees */}
                    <div className="overflow-x-auto max-h-[380px] overflow-y-auto w-full">
                      <table className="w-full border-collapse text-xs text-left">
                        <thead className="sticky top-0 bg-card z-10 shadow-2xs">
                          <tr className="bg-muted/40 text-muted-foreground border-b border-border uppercase tracking-wider text-[10px] font-bold">
                            <th className="px-4 py-2.5 w-12 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  visibleSearchedEmployees.length > 0 &&
                                  visibleSearchedEmployees.every((e) =>
                                    selectedEmployeeIds.has(e.id)
                                  )
                                }
                                onChange={handleToggleSelectAllSearched}
                                className="size-3.5 rounded cursor-pointer"
                              />
                            </th>
                            <th className="px-4 py-2.5">Employee Name & ID</th>
                            <th className="px-4 py-2.5">Section</th>
                            <th className="px-4 py-2.5">Designation & Unit</th>
                            <th className="px-4 py-2.5">Current Active Shift</th>
                            <th className="px-4 py-2.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {visibleSearchedEmployees.map((emp) => {
                            const isSelected = selectedEmployeeIds.has(emp.id);
                            return (
                              <tr
                                key={emp.id}
                                onClick={() => handleToggleEmployee(emp.id)}
                                className={`cursor-pointer transition-colors ${
                                  isSelected ? "bg-muted/50" : "hover:bg-muted/20"
                                }`}
                              >
                                <td
                                  className="px-4 py-2.5 text-center w-12"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleEmployee(emp.id)}
                                    className="size-3.5 rounded cursor-pointer"
                                  />
                                </td>
                                {/* Employee Name & ID: Clean text, NO circle */}
                                <td className="px-4 py-2.5">
                                  <div>
                                    <div className="font-semibold text-foreground">{emp.name}</div>
                                    <div className="font-mono text-[11px] text-muted-foreground">
                                      {emp.id}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className="text-foreground">{emp.section}</span>
                                </td>
                                <td className="px-4 py-2.5">
                                  <div className="font-medium text-foreground">
                                    {emp.designation}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    Unit: {emp.unit}
                                  </div>
                                </td>
                                {/* Current Active Shift: Clean text, NO icon, NO color */}
                                <td className="px-4 py-2.5">
                                  <span className="font-medium text-foreground">
                                    {emp.currentShift}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                  {isSelected ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground">
                                      <Check className="size-3" /> Selected
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-muted-foreground/60">
                                      Select
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}

                          {visibleSearchedEmployees.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                <p className="font-medium text-xs">
                                  No employees match your filter within this department and section.
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center space-y-1.5">
                    <p className="font-semibold text-xs text-foreground">
                      Ready to Load Department Personnel
                    </p>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Select a department (and optional section) above and click "Search Employees" to load staff.
                    </p>
                  </div>
                )}

                {/* STEP 3: Shift Allocation Console (Clean Neutral Form, No Colors in Selection Fields) */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-2">
                    <span className="text-xs font-bold text-foreground">
                      Step 2 — Set Start Date & Shift Type
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Target: {selectedEmployeeIds.size} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Start Date Selection (Neutral, No Color) */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg bg-background border border-border text-xs font-normal text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-border transition-all"
                      />
                    </div>

                    {/* Shift Type Selection (Neutral, No Color) */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Select Shift Type
                      </label>
                      <select
                        value={selectedShiftType}
                        onChange={(e) => setSelectedShiftType(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg bg-background border border-border text-xs font-normal text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-border transition-all"
                      >
                        {SHIFT_OPTIONS.map((shift) => (
                          <option key={shift.id} value={shift.name}>
                            {shift.name} ({shift.timeRange})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Remarks (Neutral, No Color) */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground block">
                        Remarks / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Rotation schedule, shift change..."
                        value={assignmentNotes}
                        onChange={(e) => setAssignmentNotes(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg bg-background border border-border text-xs font-normal text-foreground focus:outline-none focus:ring-1 focus:ring-border"
                      />
                    </div>
                  </div>

                  {/* Submission and Cancel Buttons */}
                  <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPageMode("list")}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border hover:bg-muted font-medium text-xs text-foreground transition"
                    >
                      Cancel & Return
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveShiftAssignment}
                      disabled={isSubmitting || selectedEmployeeIds.size === 0}
                      className={`w-full sm:w-auto px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        selectedEmployeeIds.size === 0 || isSubmitting
                          ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                          : "bg-foreground text-background cursor-pointer hover:opacity-90 active:scale-[0.98]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="size-3.5 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-3.5" />
                          <span>Save Shift Assignment ({selectedEmployeeIds.size})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* RECORD DETAILS MODAL (Neutral, No Circle, No Colors)                      */}
      {/* ========================================================================= */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-xl max-w-lg w-full shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-3.5 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Shift Assignment Details
              </span>
              <button
                onClick={() => setViewingRecord(null)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content: Clean Text, No Avatar Circle */}
            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg border border-border">
                <div className="font-bold text-sm text-foreground">
                  {viewingRecord.name}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  ID: {viewingRecord.empId} • {viewingRecord.designation}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-card border border-border rounded-lg space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground block">
                    Department
                  </span>
                  <span className="font-medium text-foreground">{viewingRecord.dept}</span>
                </div>
                <div className="p-2.5 bg-card border border-border rounded-lg space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground block">
                    Section
                  </span>
                  <span className="font-medium text-foreground">{viewingRecord.section}</span>
                </div>
                <div className="p-2.5 bg-card border border-border rounded-lg space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground block">
                    Operating Unit
                  </span>
                  <span className="font-medium text-foreground">{viewingRecord.unit}</span>
                </div>
                <div className="p-2.5 bg-card border border-border rounded-lg space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground block">
                    Previous Shift
                  </span>
                  <span className="font-normal text-muted-foreground">
                    {viewingRecord.previousShift}
                  </span>
                </div>
                <div className="p-2.5 bg-card border border-border rounded-lg space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground block">
                    Assigned Shift
                  </span>
                  <span className="font-medium text-foreground">
                    {viewingRecord.assignedShift}
                  </span>
                </div>
                <div className="p-2.5 bg-card border border-border rounded-lg space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground block">
                    Start Date
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {viewingRecord.effectiveDate}
                  </span>
                </div>
              </div>

              {viewingRecord.notes && (
                <div className="p-2.5 bg-muted/20 border border-border rounded-lg space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground block">
                    Remarks
                  </span>
                  <p className="text-muted-foreground text-xs font-normal">
                    {viewingRecord.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-muted/20 flex justify-end">
              <button
                onClick={() => setViewingRecord(null)}
                className="px-4 py-1.5 rounded-lg bg-foreground text-background font-medium text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
