import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  Gift,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Save,
  CheckCircle2,
  Users,
  Coins,
  TrendingUp,
  Filter,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  RotateCcw,
  UserCheck,
  ArrowLeft,
  Copy,
  Info,
  Check,
  AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/payroll-benefits-common")({
  head: () => ({
    meta: [
      { title: "Common Benefits — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure and manage common benefit records, amounts, and effective dates for employees.",
      },
    ],
  }),
  component: CommonBenefitsPage,
});

// ─── Types ───────────────────────────────────────────────────────────────────
interface Employee {
  empId: string;
  name: string;
  empType: string;
  department: string;
  section: string;
  designation: string;
  joinDate: string;
  status: "Working" | "On Leave" | "Resigned";
  amount: number;
}

interface CommonBenefitRecord {
  id: string;
  benefitName: string;
  benefitType: string;
  empType: string;
  department: string;
  section: string;
  amount: number; // Default amount
  effectiveDate: string;
  status: "Active" | "Inactive";
  customAmounts?: { [empId: string]: number }; // Customized amounts per employee
  assignedEmpIds?: string[]; // IDs of assigned employees
}

// ─── Master Data ──────────────────────────────────────────────────────────────
const BENEFIT_TYPES = ["Added Amount", "Fixed Amount", "Percentage"];
const BENEFIT_NAMES = [
  "Conveyance Allowance",
  "Medical Allowance",
  "Food Allowance",
  "House Rent Allowance",
  "Mobile Allowance",
  "Internet Allowance",
  "Night Allowance",
  "Tiffin Allowance",
  "Attendance Bonus",
  "Performance Bonus",
];
const EMP_TYPES = ["Office Executive", "Office Staff", "Worker"];
const DEPARTMENTS = [
  "All Departments",
  "Business Automation (HR)",
  "Business Development",
  "Business Innovation",
  "Core Development",
  "Admin",
  "Finance",
  "ERP Team",
  "APPS Team",
];
const SECTIONS = [
  "ALL",
  "Core Development (HR)",
  "Implementation & Support (HR)",
  "Core Sales",
  "Digital Marketing",
  "Project Resource & Strategy",
  "WEB-Team",
  "APPS Team",
  "General ERP",
];

// ─── Sample Employees ─────────────────────────────────────────────────────────
const SEED_EMPLOYEES: Employee[] = [
  { empId: "2021028542", name: "Zakir Hossain", empType: "Office Executive", department: "Business Automation (HR)", section: "Implementation & Support (HR)", designation: "Executive", joinDate: "09/10/2021", status: "Working", amount: 0 },
  { empId: "2022035599", name: "Dipon Saha", empType: "Office Executive", department: "Business Automation (HR)", section: "Core Development (HR)", designation: "Manager", joinDate: "07/05/2022", status: "Working", amount: 0 },
  { empId: "2023043021", name: "Easin Mia", empType: "Office Executive", department: "Admin", section: "ALL", designation: "Receptionist", joinDate: "01/02/2023", status: "Working", amount: 0 },
  { empId: "2023043909", name: "Md. Ashanur Kabir", empType: "Office Executive", department: "Business Development", section: "Digital Marketing", designation: "Manager", joinDate: "01/08/2023", status: "Working", amount: 0 },
  { empId: "2023043910", name: "Tahmid Afsar", empType: "Office Executive", department: "Business Innovation", section: "Project Resource & Strategy", designation: "Asst. Manager", joinDate: "01/08/2023", status: "Working", amount: 0 },
  { empId: "2023043974", name: "Md. Anwar Hossain", empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "Asst. Manager", joinDate: "09/08/2023", status: "Working", amount: 0 },
  { empId: "2023044012", name: "Tanver Rahman Shaon", empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "Asst. Manager", joinDate: "01/01/2025", status: "Working", amount: 0 },
  { empId: "2023044017", name: "Md. Rejaul Karim", empType: "Office Executive", department: "Business Automation (HR)", section: "Implementation & Support (HR)", designation: "Deputy Manager", joinDate: "13/08/2023", status: "Working", amount: 0 },
  { empId: "2023044078", name: "Md. Anik Islam", empType: "Office Executive", department: "Business Innovation", section: "WEB-Team", designation: "Deputy Manager", joinDate: "16/08/2023", status: "Working", amount: 0 },
  { empId: "2023045044", name: "Sultan Ahmed", empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "Manager", joinDate: "01/10/2023", status: "Working", amount: 0 },
  { empId: "2023045045", name: "Farhan Ahammed", empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "AGM", joinDate: "01/10/2023", status: "Working", amount: 0 },
  { empId: "2023046001", name: "Sohanur Rahman Schan", empType: "Office Executive", department: "Admin", section: "ALL", designation: "Executive", joinDate: "01/11/2023", status: "Working", amount: 0 },
  { empId: "2023046544", name: "Mazharul Haque", empType: "Office Executive", department: "ERP Team", section: "General ERP", designation: "Deputy Manager", joinDate: "02/12/2023", status: "Working", amount: 0 },
  { empId: "2024046961", name: "Sumaya Siddika", empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Deputy Manager", joinDate: "03/01/2024", status: "Working", amount: 0 },
  { empId: "2024049166", name: "MD Maimoon Hossain Shomoy", empType: "Office Executive", department: "Business Innovation", section: "WEB-Team", designation: "Sr. Executive", joinDate: "18/05/2024", status: "Working", amount: 0 },
  { empId: "2024049326", name: "Hanif Uddin", empType: "Office Executive", department: "APPS Team", section: "APPS Team", designation: "Sr. Executive", joinDate: "01/06/2024", status: "Working", amount: 0 },
  { empId: "2024052335", name: "Md. Al Amin", empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Sr. Officer", joinDate: "01/10/2024", status: "Working", amount: 0 },
  { empId: "2024053060", name: "Md. Mahfujul Haque", empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Manager", joinDate: "10/12/2024", status: "Working", amount: 0 },
];

const INITIAL_COMMON_BENEFITS: CommonBenefitRecord[] = [
  { id: "CB-101", benefitName: "Conveyance Allowance", benefitType: "Added Amount", empType: "Office Executive", department: "Business Automation (HR)", section: "ALL", amount: 3000, effectiveDate: "2026-07-01", status: "Active", assignedEmpIds: ["2021028542", "2022035599", "2023044017"], customAmounts: { "2022035599": 3500 } },
  { id: "CB-102", benefitName: "Food Allowance", benefitType: "Fixed Amount", empType: "Office Executive", department: "All Departments", section: "ALL", amount: 1500, effectiveDate: "2026-06-15", status: "Active", assignedEmpIds: ["2021028542", "2022035599", "2023043021", "2023043909", "2023043910", "2023043974", "2023044012", "2023044017", "2023044078", "2023045044", "2023045045", "2023046001", "2023046544", "2024046961", "2024049166", "2024049326", "2024052335", "2024053060"] },
  { id: "CB-103", benefitName: "Medical Allowance", benefitType: "Percentage", empType: "Office Executive", department: "Admin", section: "ALL", amount: 10, effectiveDate: "2026-07-01", status: "Active", assignedEmpIds: ["2023043021", "2023046001"] },
  { id: "CB-104", benefitName: "Mobile Allowance", benefitType: "Added Amount", empType: "Office Executive", department: "Business Development", section: "ALL", amount: 1200, effectiveDate: "2026-07-10", status: "Active", assignedEmpIds: ["2023043909", "2023043974", "2023044012", "2023045044", "2023045045"] },
  { id: "CB-105", benefitName: "Internet Allowance", benefitType: "Fixed Amount", empType: "Office Executive", department: "Core Development", section: "ALL", amount: 1000, effectiveDate: "2026-07-01", status: "Inactive", assignedEmpIds: ["2024046961", "2024052335", "2024053060"] },
];

function CommonBenefitsPage() {
  const [records, setRecords] = useState<CommonBenefitRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hris_payroll_common_benefits");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse hris_payroll_common_benefits", e);
        }
      }
    }
    return INITIAL_COMMON_BENEFITS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("hris_payroll_common_benefits", JSON.stringify(records));
  }, [records]);

  // Dual View Control: "list" | "workspace"
  const [view, setView] = useState<"list" | "workspace">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Main UI Filter and Search States (List View)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  // Workspace Form Fields State
  const [modalBenefitName, setModalBenefitName] = useState("Conveyance Allowance");
  const [modalBenefitType, setModalBenefitType] = useState("Added Amount");
  const [modalEmpType, setModalEmpType] = useState("Office Executive");
  const [modalDepartment, setModalDepartment] = useState("All Departments");
  const [modalSection, setModalSection] = useState("ALL");
  const [modalAmount, setModalAmount] = useState<number>(1000);
  const [modalEffectiveDate, setModalEffectiveDate] = useState("2026-07-01");
  const [modalStatus, setModalStatus] = useState<"Active" | "Inactive">("Active");

  // Workspace Employee Allocations State
  const [workspaceActiveEmpIds, setWorkspaceActiveEmpIds] = useState<string[]>([]);
  const [workspaceAssignedEmpIds, setWorkspaceAssignedEmpIds] = useState<string[]>([]);
  const [workspaceCustomAmounts, setWorkspaceCustomAmounts] = useState<{ [empId: string]: number }>({});
  const [workspaceSearchQuery, setWorkspaceSearchQuery] = useState("");
  const [selectedEmpIdToAdd, setSelectedEmpIdToAdd] = useState("");

  // Toast Msg State
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Compute matched employees in workspace based on target criteria
  const currentMatching = useMemo(() => {
    return SEED_EMPLOYEES.filter((emp) => {
      if (modalEmpType && emp.empType !== modalEmpType) return false;
      if (modalDepartment !== "All Departments" && emp.department !== modalDepartment) return false;
      if (modalSection !== "ALL" && emp.section !== modalSection) return false;
      return true;
    });
  }, [modalEmpType, modalDepartment, modalSection]);

  // Render employees who are active in the workspace
  const workspaceActiveEmployees = useMemo(() => {
    return SEED_EMPLOYEES.filter((emp) => workspaceActiveEmpIds.includes(emp.empId));
  }, [workspaceActiveEmpIds]);

  // Filter active workspace employees based on workspace-specific search query
  const workspaceFilteredEmployees = useMemo(() => {
    return workspaceActiveEmployees.filter((emp) => {
      if (workspaceSearchQuery.trim()) {
        const q = workspaceSearchQuery.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          emp.empId.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [workspaceActiveEmployees, workspaceSearchQuery]);

  // Find employees that are in the system database but NOT currently added in this roster workspace list
  const availableToAdd = useMemo(() => {
    return SEED_EMPLOYEES.filter((emp) => !workspaceActiveEmpIds.includes(emp.empId));
  }, [workspaceActiveEmpIds]);

  // Workspace Total Stats
  const workspaceAllocatedTotal = useMemo(() => {
    let sum = 0;
    workspaceAssignedEmpIds.forEach((empId) => {
      const match = SEED_EMPLOYEES.some(e => e.empId === empId);
      if (match) {
        const val = workspaceCustomAmounts[empId] !== undefined ? workspaceCustomAmounts[empId] : modalAmount;
        sum += val;
      }
    });
    return sum;
  }, [workspaceAssignedEmpIds, workspaceCustomAmounts, modalAmount]);

  // Helper for filter changes inside the Workspace
  const handleFilterChange = (field: string, val: string) => {
    if (field === "empType") setModalEmpType(val);
    if (field === "department") setModalDepartment(val);
    if (field === "section") setModalSection(val);

    // Dynamic auto-allocation based on new filter combination
    const newEmpType = field === "empType" ? val : modalEmpType;
    const newDept = field === "department" ? val : modalDepartment;
    const newSect = field === "section" ? val : modalSection;

    const newMatching = SEED_EMPLOYEES.filter((emp) => {
      if (newEmpType && emp.empType !== newEmpType) return false;
      if (newDept !== "All Departments" && emp.department !== newDept) return false;
      if (newSect !== "ALL" && emp.section !== newSect) return false;
      return true;
    });

    const newIds = newMatching.map((e) => e.empId);
    setWorkspaceActiveEmpIds(newIds);
    setWorkspaceAssignedEmpIds(newIds);
    setWorkspaceCustomAmounts({});
  };

  // Handlers for Views
  const handleOpenAddWorkspace = () => {
    setEditingId(null);
    setModalBenefitName("Conveyance Allowance");
    setModalBenefitType("Added Amount");
    setModalEmpType("Office Executive");
    setModalDepartment("All Departments");
    setModalSection("ALL");
    setModalAmount(1000);
    setModalEffectiveDate(new Date().toISOString().split("T")[0]);
    setModalStatus("Active");
    setWorkspaceSearchQuery("");
    setSelectedEmpIdToAdd("");

    // Pre-populate selections for default "Office Executive", "All Departments", "ALL"
    const matching = SEED_EMPLOYEES.filter(e => e.empType === "Office Executive");
    const matchingIds = matching.map((e) => e.empId);
    setWorkspaceActiveEmpIds(matchingIds);
    setWorkspaceAssignedEmpIds(matchingIds);
    setWorkspaceCustomAmounts({});
    setView("workspace");
  };

  const handleOpenEditWorkspace = (rec: CommonBenefitRecord) => {
    setEditingId(rec.id);
    setModalBenefitName(rec.benefitName);
    setModalBenefitType(rec.benefitType);
    setModalEmpType(rec.empType);
    setModalDepartment(rec.department);
    setModalSection(rec.section);
    setModalAmount(rec.amount);
    setModalEffectiveDate(rec.effectiveDate);
    setModalStatus(rec.status);
    setWorkspaceSearchQuery("");
    setSelectedEmpIdToAdd("");

    // Active roster list: union of matching target employees + manually assigned employees saved in record
    const matching = SEED_EMPLOYEES.filter((emp) => {
      if (rec.empType && emp.empType !== rec.empType) return false;
      if (rec.department !== "All Departments" && emp.department !== rec.department) return false;
      if (rec.section !== "ALL" && emp.section !== rec.section) return false;
      return true;
    });
    const unionIds = Array.from(new Set([...(rec.assignedEmpIds || []), ...matching.map(e => e.empId)]));
    setWorkspaceActiveEmpIds(unionIds);
    setWorkspaceAssignedEmpIds(rec.assignedEmpIds || []);
    setWorkspaceCustomAmounts(rec.customAmounts || {});
    setView("workspace");
  };

  const handleDuplicateRule = (rec: CommonBenefitRecord) => {
    const newRec: CommonBenefitRecord = {
      ...rec,
      id: `CB-${Date.now().toString().slice(-3)}`,
      benefitName: `${rec.benefitName} (Copy)`,
      status: "Inactive", // Default to Inactive for review
    };
    setRecords((prev) => [newRec, ...prev]);
    showToast(`✓ Duplicated "${rec.benefitName}"`);
  };

  const handleDeleteRule = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the configuration for "${name}"?`)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast(`✗ Deleted common benefit: ${name}`);
    }
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: "Active" | "Inactive") => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
    showToast(`✓ Status of "${name}" changed to ${nextStatus}`);
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAmount || modalAmount <= 0) {
      showToast("⚠ Please enter a valid default benefit amount!");
      return;
    }
    if (workspaceAssignedEmpIds.length === 0) {
      if (!confirm("No employees are selected for this benefit. Save anyway?")) {
        return;
      }
    }

    if (editingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                benefitName: modalBenefitName,
                benefitType: modalBenefitType,
                empType: modalEmpType,
                department: modalDepartment,
                section: modalSection,
                amount: modalAmount,
                effectiveDate: modalEffectiveDate,
                status: modalStatus,
                assignedEmpIds: workspaceAssignedEmpIds,
                customAmounts: workspaceCustomAmounts,
              }
            : r
        )
      );
      showToast(`✓ Updated "${modalBenefitName}" workspace successfully!`);
    } else {
      const newRec: CommonBenefitRecord = {
        id: `CB-${Date.now().toString().slice(-3)}`,
        benefitName: modalBenefitName,
        benefitType: modalBenefitType,
        empType: modalEmpType,
        department: modalDepartment,
        section: modalSection,
        amount: modalAmount,
        effectiveDate: modalEffectiveDate,
        status: modalStatus,
        assignedEmpIds: workspaceAssignedEmpIds,
        customAmounts: workspaceCustomAmounts,
      };
      setRecords((prev) => [newRec, ...prev]);
      showToast(`✓ Created new common benefit: "${modalBenefitName}"`);
    }
    setView("list");
  };

  // Workspace employee table action tools
  const toggleEmployeeSelection = (empId: string) => {
    setWorkspaceAssignedEmpIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const toggleSelectAllWorkspace = () => {
    const visibleIds = workspaceFilteredEmployees.map((e) => e.empId);
    const allVisibleSelected = visibleIds.every((id) => workspaceAssignedEmpIds.includes(id));
    if (allVisibleSelected) {
      setWorkspaceAssignedEmpIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setWorkspaceAssignedEmpIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleCustomAmountChange = (empId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setWorkspaceCustomAmounts((prev) => ({
      ...prev,
      [empId]: num,
    }));
  };

  const handleResetWorkspaceAmounts = () => {
    if (confirm("Reset all overrides? Checked employees will revert to the default amount.")) {
      setWorkspaceCustomAmounts({});
      showToast("✓ Overrides cleared");
    }
  };

  const handleSelectAllMatching = () => {
    setWorkspaceAssignedEmpIds(workspaceActiveEmpIds);
  };

  const handleDeselectAllMatching = () => {
    setWorkspaceAssignedEmpIds([]);
  };

  // Main list filters (List View)
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.benefitName.toLowerCase().includes(q) ||
          r.benefitType.toLowerCase().includes(q) ||
          r.empType.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.section.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, statusFilter, searchQuery]);

  // Main list pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Dynamic record allocations calculations for summary table
  const recordsStats = useMemo(() => {
    return records.reduce<{ [id: string]: { count: number; total: number } }>((acc, rule) => {
      const matching = SEED_EMPLOYEES.filter((emp) => {
        if (rule.empType && emp.empType !== rule.empType) return false;
        if (rule.department !== "All Departments" && emp.department !== rule.department) return false;
        if (rule.section !== "ALL" && emp.section !== rule.section) return false;
        return true;
      });

      const assignedList = rule.assignedEmpIds || matching.map(e => e.empId);
      const count = assignedList.length;

      let total = 0;
      SEED_EMPLOYEES.forEach((emp) => {
        if (assignedList.includes(emp.empId)) {
          const val = (rule.customAmounts && rule.customAmounts[emp.empId] !== undefined)
            ? rule.customAmounts[emp.empId]
            : rule.amount;
          total += val;
        }
      });

      acc[rule.id] = { count, total };
      return acc;
    }, {});
  }, [records]);

  // Combined active rules total est. payout
  const totalAllocatedAmount = useMemo(() => {
    let total = 0;
    records.forEach((rule) => {
      if (rule.status === "Active" && recordsStats[rule.id]) {
        total += recordsStats[rule.id].total;
      }
    });
    return total;
  }, [records, recordsStats]);

  const activeCount = useMemo(() => records.filter((r) => r.status === "Active").length, [records]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        {/* ════════════════════════════════════════════════════════════
            VIEW 1: CONFIGURATIONS LIST VIEW
        ════════════════════════════════════════════════════════════ */}
        {view === "list" && (
          <div className="p-4 md:p-6 space-y-5 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="bg-card rounded-xl border border-border/70 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <ChevronRight className="size-3" />
                  <span>Payroll</span>
                  <ChevronRight className="size-3" />
                  <span className="text-primary font-black">Common Benefits</span>
                </div>
                <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Gift className="size-4 text-primary" />
                  </div>
                  Common Benefits Configuration
                </h1>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Assign group benefit policies and customize individual employee allocations in a workspace.
                </p>
              </div>

              {/* Stats Overview */}
              <div className="flex items-center gap-2.5 flex-wrap shrink-0 relative z-10">
                <div className="bg-muted/60 border border-border/50 rounded-xl px-3.5 py-2 text-center min-w-[80px]">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center justify-center gap-1">
                    <Users className="size-3 text-muted-foreground/60" /> Policy Rules
                  </div>
                  <div className="text-sm font-extrabold text-foreground mt-0.5">{records.length}</div>
                </div>
                <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-3.5 py-2 text-center min-w-[80px]">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="size-3 text-emerald-500" /> Active
                  </div>
                  <div className="text-sm font-extrabold text-emerald-600 mt-0.5">{activeCount}</div>
                </div>
                <div className="bg-primary/8 border border-primary/20 rounded-xl px-3.5 py-2 text-center min-w-[115px]">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-primary flex items-center justify-center gap-1">
                    <Coins className="size-3 text-primary" /> Est. Payout
                  </div>
                  <div className="text-sm font-extrabold text-primary mt-0.5">৳{totalAllocatedAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* List Toolbar */}
            <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search benefit name, target group, type..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                      className="h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    {(searchQuery || statusFilter !== "ALL") && (
                      <button
                        onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); setCurrentPage(1); }}
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted/50 text-muted-foreground transition"
                        title="Reset filters"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Print/Export and Add New */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => alert("Exporting to Excel...")}
                    className="h-9 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition"
                  >
                    <FileSpreadsheet className="size-3.5 text-emerald-600" />
                    Excel
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="h-9 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition"
                  >
                    <Printer className="size-3.5 text-primary" />
                    Print
                  </button>
                  <button
                    onClick={() => alert("Exporting PDF...")}
                    className="h-9 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition"
                  >
                    <FileDown className="size-3.5 text-rose-500" />
                    PDF
                  </button>

                  <button
                    onClick={handleOpenAddWorkspace}
                    className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xs transition flex items-center gap-1.5"
                  >
                    <Plus className="size-4" />
                    Add New Policy
                  </button>
                </div>
              </div>

              {/* Table of Policy Rules */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground/70 border-b border-border/40">
                      <th className="px-5 py-3.5 text-center w-28">Action</th>
                      <th className="px-5 py-3.5 whitespace-nowrap min-w-[150px]">Benefit Name</th>
                      <th className="px-5 py-3.5 whitespace-nowrap">Benefit Type</th>
                      <th className="px-5 py-3.5 whitespace-nowrap">Target Group Filter</th>
                      <th className="px-5 py-3.5 whitespace-nowrap text-right w-[100px]">Base Amt</th>
                      <th className="px-5 py-3.5 whitespace-nowrap text-center">Effective Date</th>
                      <th className="px-5 py-3.5 whitespace-nowrap text-center min-w-[160px]">Allocated Employees</th>
                      <th className="px-5 py-3.5 whitespace-nowrap text-center w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/25">
                    {paginatedRecords.map((rec, idx) => {
                      const stats = recordsStats[rec.id] || { count: 0, total: 0 };
                      return (
                        <tr
                          key={rec.id}
                          className={[
                            "transition-colors duration-100 group",
                            idx % 2 === 0 ? "bg-card hover:bg-muted/30" : "bg-muted/10 hover:bg-muted/30",
                          ].join(" ")}
                        >
                          {/* Actions */}
                          <td className="px-5 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditWorkspace(rec)}
                                className="size-7 rounded-lg hover:bg-amber-500/10 text-amber-600 flex items-center justify-center transition border border-transparent hover:border-amber-500/20 cursor-pointer"
                                title="Edit benefit policy workspace"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateRule(rec)}
                                className="size-7 rounded-lg hover:bg-primary/10 text-primary flex items-center justify-center transition border border-transparent hover:border-primary/20 cursor-pointer"
                                title="Duplicate rule"
                              >
                                <Copy className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRule(rec.id, rec.benefitName)}
                                className="size-7 rounded-lg hover:bg-rose-500/10 text-rose-500 flex items-center justify-center transition border border-transparent hover:border-rose-500/20 cursor-pointer"
                                title="Delete policy rule"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Benefit Details */}
                          <td className="px-5 py-3 font-semibold text-foreground">
                            {rec.benefitName}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground/80 font-medium">
                            {rec.benefitType}
                          </td>

                          {/* Target Group */}
                          <td className="px-5 py-3">
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-primary/10 border border-primary/20 text-primary">
                                {rec.empType}
                              </span>
                              {rec.department !== "All Departments" && (
                                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-muted border border-border/80 text-muted-foreground">
                                  {rec.department}
                                </span>
                              )}
                              {rec.section !== "ALL" && (
                                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-muted border border-border/80 text-muted-foreground">
                                  {rec.section}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Base Amount */}
                          <td className="px-5 py-3 text-right font-mono font-bold text-foreground">
                            ৳{rec.amount.toLocaleString()}
                            {rec.benefitType === "Percentage" && "%"}
                          </td>

                          {/* Effective Date (The requested column) */}
                          <td className="px-5 py-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/80 border border-border/40 font-mono text-[10.5px] font-semibold text-muted-foreground">
                              <Calendar className="size-3 text-muted-foreground/60" />
                              {rec.effectiveDate}
                            </span>
                          </td>

                          {/* Allocated Details */}
                          <td className="px-5 py-3 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-[11px] font-bold text-foreground">
                                {stats.count} Employees
                              </span>
                              <span className="text-[9.5px] font-extrabold text-primary font-mono mt-0.5">
                                Total: ৳{stats.total.toLocaleString()}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(rec.id, rec.benefitName, rec.status)}
                              className={[
                                "inline-flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full border transition hover:scale-105 active:scale-95 cursor-pointer",
                                rec.status === "Active"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                                  : "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20",
                              ].join(" ")}
                              title="Click to toggle status"
                            >
                              <span className={["size-1.5 rounded-full", rec.status === "Active" ? "bg-emerald-500" : "bg-slate-400"].join(" ")} />
                              {rec.status}
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedRecords.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-16">
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Gift className="size-10 opacity-20" />
                            <p className="text-sm font-semibold">No common benefits policies found</p>
                            <p className="text-xs">Click "+ Add New Policy" to define a group benefit record.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3.5 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Showing {filteredRecords.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
                  {Math.min(currentPage * PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length} entries
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-border/50 disabled:opacity-30 hover:bg-muted/50 transition cursor-pointer"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground text-xs">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          className={[
                            "h-7 min-w-[28px] px-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer",
                            currentPage === p
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "border border-border/50 hover:bg-muted/50 text-muted-foreground",
                          ].join(" ")}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-border/50 disabled:opacity-30 hover:bg-muted/50 transition cursor-pointer"
                  >
                    <ChevronRightIcon className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            VIEW 2: CONFIGURE BENEFIT WORKSPACE (FULL PAGE VIEW)
        ════════════════════════════════════════════════════════════ */}
        {view === "workspace" && (
          <div className="p-4 md:p-6 space-y-5 animate-in slide-in-from-right-3 duration-300">
            
            {/* Header toolbar */}
            <div className="bg-card rounded-xl border border-border/70 p-4 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="size-8 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground flex items-center justify-center transition cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div>
                  <h1 className="text-base font-black text-foreground tracking-tight">
                    {editingId ? "Modify Common Benefit Policy Workspace" : "Configure New Common Benefit Policy"}
                  </h1>
                  <p className="text-[11px] text-muted-foreground">
                    Define target filter group, set the base benefit details, and customize individual assignments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status:</span>
                <div className="flex rounded-lg border border-border/60 p-0.5 bg-muted/40">
                  <button
                    type="button"
                    onClick={() => setModalStatus("Active")}
                    className={["px-3 py-1 rounded-md text-[10px] font-black uppercase transition", modalStatus === "Active" ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-foreground"].join(" ")}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalStatus("Inactive")}
                    className={["px-3 py-1 rounded-md text-[10px] font-black uppercase transition", modalStatus === "Inactive" ? "bg-slate-500 text-white" : "text-muted-foreground hover:text-foreground"].join(" ")}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveWorkspace} className="space-y-5">
              {/* STEP 1 CARD: POLICY SETTINGS */}
              <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-border/40 bg-muted/20 flex items-center gap-2">
                  <span className="size-5 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xs">1</span>
                  <span className="text-xs font-black uppercase tracking-wider text-foreground">Step 1: Policy Rules & Target Filter Group</span>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {/* Benefit Name */}
                  <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Benefit Name <span className="text-rose-500">*</span></label>
                    <select
                      value={modalBenefitName}
                      onChange={(e) => setModalBenefitName(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition cursor-pointer"
                    >
                      {BENEFIT_NAMES.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Benefit Type */}
                  <div className="space-y-1.5 lg:col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Benefit Type <span className="text-rose-500">*</span></label>
                    <select
                      value={modalBenefitType}
                      onChange={(e) => setModalBenefitType(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition cursor-pointer"
                    >
                      {BENEFIT_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Employee Type Target */}
                  <div className="space-y-1.5 lg:col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Target Emp Type <span className="text-rose-500">*</span></label>
                    <select
                      value={modalEmpType}
                      onChange={(e) => handleFilterChange("empType", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition cursor-pointer"
                    >
                      {EMP_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department Target */}
                  <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Target Department <span className="text-rose-500">*</span></label>
                    <select
                      value={modalDepartment}
                      onChange={(e) => handleFilterChange("department", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition cursor-pointer"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Section Target */}
                  <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Target Section <span className="text-rose-500">*</span></label>
                    <select
                      value={modalSection}
                      onChange={(e) => handleFilterChange("section", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition cursor-pointer"
                    >
                      {SECTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Default Amount */}
                  <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Default Amount ({modalBenefitType === "Percentage" ? "%" : "৳"}) <span className="text-rose-500">*</span></label>
                    <div className="relative flex items-center">
                      {modalBenefitType !== "Percentage" && (
                        <span className="absolute left-3 text-muted-foreground/50 text-xs font-bold select-none">৳</span>
                      )}
                      <input
                        type="number"
                        min="1"
                        step="50"
                        required
                        placeholder="e.g. 1000"
                        value={modalAmount || ""}
                        onChange={(e) => setModalAmount(parseFloat(e.target.value) || 0)}
                        className={["w-full h-9 rounded-lg border border-border/60 bg-background text-xs font-bold outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition", modalBenefitType !== "Percentage" ? "pl-7 pr-3" : "px-3"].join(" ")}
                      />
                      {modalBenefitType === "Percentage" && (
                        <span className="absolute right-3 text-muted-foreground/50 text-xs font-bold select-none">%</span>
                      )}
                    </div>
                  </div>

                  {/* Effective Date (The requested field) */}
                  <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Effective Date <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={modalEffectiveDate}
                        onChange={(e) => setModalEffectiveDate(e.target.value)}
                        className="w-full h-9 rounded-lg bg-background border border-border/60 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2 CARD: ROSTER ALLOCATION */}
              <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-border/40 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xs">2</span>
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">Step 2: Assign & Customize Employee Roster Allocations</span>
                  </div>

                  {/* Allocation statistics display */}
                  <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 text-primary text-[10px] font-black uppercase tracking-wide">
                      Selected: {workspaceAssignedEmpIds.length} / {workspaceActiveEmpIds.length} Employees
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-wide">
                      Est. Total: ৳{workspaceAllocatedTotal.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Table Control Panel */}
                <div className="px-5 py-3 border-b border-border/30 bg-muted/10 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                  
                  {/* Left: Search & manual add employee */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                    {/* Inline table search */}
                    <div className="relative flex-1 max-w-xs">
                      <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                      <input
                        type="text"
                        value={workspaceSearchQuery}
                        onChange={(e) => setWorkspaceSearchQuery(e.target.value)}
                        placeholder="Search within active roster..."
                        className="w-full h-8 pl-8 pr-3 rounded-lg bg-background border border-border/60 text-[11px] font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition"
                      />
                    </div>

                    {/* Manual add selector (NEW FEATURE) */}
                    <div className="flex items-center gap-2 border-l border-border/80 pl-3">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground whitespace-nowrap">Add Manually:</span>
                      <select
                        value={selectedEmpIdToAdd}
                        onChange={(e) => setSelectedEmpIdToAdd(e.target.value)}
                        className="h-8 px-2 rounded-lg bg-background border border-border/60 text-[11px] font-bold text-foreground outline-none max-w-[200px] cursor-pointer"
                      >
                        <option value="">Select Employee...</option>
                        {availableToAdd.map((emp) => (
                          <option key={emp.empId} value={emp.empId}>
                            {emp.name} ({emp.empId}) - {emp.designation}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!selectedEmpIdToAdd}
                        onClick={() => {
                          if (selectedEmpIdToAdd) {
                            setWorkspaceActiveEmpIds((prev) => [...prev, selectedEmpIdToAdd]);
                            setWorkspaceAssignedEmpIds((prev) => [...prev, selectedEmpIdToAdd]);
                            showToast(`✓ Added ${SEED_EMPLOYEES.find(e => e.empId === selectedEmpIdToAdd)?.name} to roster`);
                            setSelectedEmpIdToAdd("");
                          }
                        }}
                        className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-[10px] font-bold uppercase tracking-wider text-white transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="size-3" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Right: Roster action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleSelectAllMatching}
                      className="h-8 px-3 rounded-lg border border-border/60 bg-background text-[10px] font-black uppercase tracking-wide text-foreground hover:bg-muted transition cursor-pointer"
                    >
                      Check All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllMatching}
                      className="h-8 px-3 rounded-lg border border-border/60 bg-background text-[10px] font-black uppercase tracking-wide text-foreground hover:bg-muted transition cursor-pointer"
                    >
                      Uncheck All
                    </button>
                    <button
                      type="button"
                      onClick={handleResetWorkspaceAmounts}
                      className="h-8 px-3.5 bg-muted/60 border border-border/50 text-[10px] font-black uppercase tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground transition flex items-center gap-1.5 cursor-pointer"
                      title="Clear all overrides and use the default rule amount"
                    >
                      <RotateCcw className="size-3" /> Clear Custom Overrides
                    </button>
                  </div>
                </div>

                {/* Employee Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground/70 border-b border-border/40">
                        <th className="px-5 py-3 w-12 text-center">
                          <input
                            type="checkbox"
                            checked={workspaceFilteredEmployees.length > 0 && workspaceFilteredEmployees.every(e => workspaceAssignedEmpIds.includes(e.empId))}
                            onChange={toggleSelectAllWorkspace}
                            className="rounded border-border/50 text-primary focus:ring-primary/20 size-3.5 cursor-pointer"
                          />
                        </th>
                        <th className="px-5 py-3 whitespace-nowrap">Emp ID</th>
                        <th className="px-5 py-3 whitespace-nowrap min-w-[150px]">Name</th>
                        <th className="px-5 py-3 whitespace-nowrap">Designation</th>
                        <th className="px-5 py-3 whitespace-nowrap">Department / Section</th>
                        <th className="px-5 py-3 text-center whitespace-nowrap">Join Date</th>
                        <th className="px-5 py-3 text-center whitespace-nowrap">Status</th>
                        <th className="px-5 py-3 text-right w-[160px] whitespace-nowrap">Allocation Amount ({modalBenefitType === "Percentage" ? "%" : "৳"})</th>
                        <th className="px-5 py-3 text-center w-16 whitespace-nowrap">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/25">
                      {workspaceFilteredEmployees.map((emp, idx) => {
                        const isAssigned = workspaceAssignedEmpIds.includes(emp.empId);
                        const customAmt = workspaceCustomAmounts[emp.empId];
                        const isOverridden = customAmt !== undefined;
                        const displayAmt = isOverridden ? customAmt : modalAmount;

                        return (
                          <tr
                            key={emp.empId}
                            className={[
                              "transition-colors duration-100 group",
                              isAssigned
                                ? "bg-primary/5 border-l-2 border-l-primary"
                                : idx % 2 === 0
                                ? "bg-card hover:bg-muted/30"
                                : "bg-muted/10 hover:bg-muted/30",
                            ].join(" ")}
                          >
                            {/* Checkbox */}
                            <td className="px-5 py-2.5 text-center">
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={() => toggleEmployeeSelection(emp.empId)}
                                className="rounded border-border/50 text-primary focus:ring-primary/20 size-3.5 cursor-pointer"
                              />
                            </td>

                            {/* Emp Details */}
                            <td className="px-5 py-2.5 font-mono font-bold text-foreground/90">
                              {emp.empId}
                            </td>
                            <td className="px-5 py-2.5 font-bold text-foreground">
                              {emp.name}
                            </td>
                            <td className="px-5 py-2.5 text-muted-foreground/80 font-medium">
                              {emp.designation}
                            </td>
                            <td className="px-5 py-2.5 text-muted-foreground/70">
                              {emp.department} <span className="text-[10px] text-muted-foreground/40 font-bold">·</span> {emp.section}
                            </td>
                            <td className="px-5 py-2.5 text-center font-mono text-muted-foreground/60">
                              {emp.joinDate}
                            </td>
                            <td className="px-5 py-2.5 text-center">
                              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                {emp.status}
                              </span>
                            </td>

                            {/* Amount input */}
                            <td className="px-5 py-2">
                              <div className="relative flex items-center justify-end">
                                {modalBenefitType !== "Percentage" && (
                                  <span className="absolute left-2.5 text-muted-foreground/50 text-[11px] font-bold select-none">৳</span>
                                )}
                                <input
                                  type="number"
                                  min="0"
                                  disabled={!isAssigned}
                                  value={isAssigned ? displayAmt : ""}
                                  onChange={(e) => handleCustomAmountChange(emp.empId, e.target.value)}
                                  placeholder={isAssigned ? displayAmt.toString() : "Skipped"}
                                  className={[
                                    "w-full h-8 pl-6 pr-3 rounded-lg text-right text-xs font-bold transition focus:outline-none focus:ring-1 focus:ring-primary/50",
                                    !isAssigned
                                      ? "bg-muted/20 border border-border/20 text-muted-foreground/30 cursor-not-allowed placeholder:text-muted-foreground/30"
                                      : isOverridden
                                      ? "bg-amber-500/5 border border-amber-500/40 text-amber-600 focus:border-amber-500/60"
                                      : "bg-background border border-border/60 text-foreground focus:border-primary/50"
                                  ].join(" ")}
                                />
                                {isAssigned && isOverridden && (
                                  <span className="absolute left-[38px] text-[8.5px] font-extrabold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded px-1 scale-90" title="Custom individual amount override">
                                    Custom
                                  </span>
                                )}
                                {modalBenefitType === "Percentage" && isAssigned && (
                                  <span className="absolute right-2.5 text-muted-foreground/50 text-[11px] font-bold select-none">%</span>
                                )}
                              </div>
                            </td>

                            {/* Remove row level (NEW FEATURE) */}
                            <td className="px-5 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setWorkspaceActiveEmpIds((prev) => prev.filter((id) => id !== emp.empId));
                                  setWorkspaceAssignedEmpIds((prev) => prev.filter((id) => id !== emp.empId));
                                  setWorkspaceCustomAmounts((prev) => {
                                    const copy = { ...prev };
                                    delete copy[emp.empId];
                                    return copy;
                                  });
                                  showToast(`✗ Removed ${emp.name} from active roster list`);
                                }}
                                className="size-7 rounded-lg hover:bg-rose-500/15 text-rose-500 flex items-center justify-center border border-transparent hover:border-rose-500/20 cursor-pointer"
                                title="Remove employee completely from this workspace allocation roster"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {workspaceFilteredEmployees.length === 0 && (
                        <tr>
                          <td colSpan={9} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2.5 text-muted-foreground">
                              <AlertCircle className="size-8 text-rose-500/45" />
                              <p className="text-sm font-semibold">No active workspace employees found</p>
                              <p className="text-xs">Select target filters in Step 1 or search manually add individual employees above.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Info Note Banner */}
                <div className="p-4 bg-muted/20 border-t border-border/40 flex items-start gap-2.5">
                  <Info className="size-4.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-normal text-muted-foreground/80 font-medium">
                    Checked employees will be assigned the benefit. Manually add employees using the selector above or remove them from the list using the trash can button in each row. Custom overridden amounts (highlighted in <span className="text-amber-600 font-bold">amber</span>) will take precedence over the base default amount.
                  </p>
                </div>
              </div>

              {/* Workspace Action Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="h-10 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer"
                >
                  Back to List
                </button>
                <button
                  type="submit"
                  className="h-10 px-8 rounded-lg bg-[#7CB342] hover:bg-[#689f38] text-white text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="size-4" />
                  Save Policy Rule
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-card border border-primary/25 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-sm">
          <div className="size-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-3.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
