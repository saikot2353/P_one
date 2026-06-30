import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  RefreshCw,
  Trash2,
  Plus,
  Minus,
  Calculator,
  Landmark,
  Coins,
  Smartphone,
  UserCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/earn-leave-workflow")({
  head: () => ({
    meta: [
      { title: "Earn Leave Workflow Center — CRIPTON" },
      {
        name: "description",
        content:
          "Unified multi-tier workflow panel containing Earn Leave Submit, Check Verification, and HRD Authorizations.",
      },
    ],
  }),
  component: EarnLeaveWorkflowPage,
});

interface EarnLeaveWorkflowRow {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  totalDays: number;
  perDayRate: number;
  netPay: number;
  paymentMode: "Bank" | "Cash" | "bKash" | "Rocket";
  bankName: string;
  accountNo: string;
  status: "Draft" | "Submitted" | "Checked" | "Authorized (HRD)";
}

const initialWorkflowRows: EarnLeaveWorkflowRow[] = [
  {
    id: "ELW-001",
    empId: "2023043910",
    empName: "Tahmid Afsar Shapno",
    department: "Project Resource & Strategy",
    designation: "Asst. Manager",
    totalDays: 4.39,
    perDayRate: 1733.33,
    netPay: 7609,
    paymentMode: "Bank",
    bankName: "Dutch-Bangla Bank PLC",
    accountNo: "125.120.44391",
    status: "Draft",
  },
  {
    id: "ELW-002",
    empId: "2022035599",
    empName: "Dipon Saha",
    department: "Core Development (HR)",
    designation: "Senior Software Engineer",
    totalDays: 5.6,
    perDayRate: 2600.0,
    netPay: 14560,
    paymentMode: "Bank",
    bankName: "Dutch-Bangla Bank PLC",
    accountNo: "125.120.35599",
    status: "Draft",
  },
  {
    id: "ELW-003",
    empId: "2021032646",
    empName: "Sadiqul Islam",
    department: "Core Sales",
    designation: "Deputy Manager",
    totalDays: 3.0,
    perDayRate: 1100.0,
    netPay: 3300,
    paymentMode: "Cash",
    bankName: "",
    accountNo: "",
    status: "Submitted",
  },
  {
    id: "ELW-004",
    empId: "2047508",
    empName: "Mst. Jahanara Khatun",
    department: "Sewing",
    designation: "Asst. Operator",
    totalDays: 12.0,
    perDayRate: 230.5,
    netPay: 2766,
    paymentMode: "bKash",
    bankName: "",
    accountNo: "01712345678",
    status: "Submitted",
  },
  {
    id: "ELW-005",
    empId: "2400015",
    empName: "Mst. Mukta Khatun",
    department: "Sewing",
    designation: "Operator",
    totalDays: 14.5,
    perDayRate: 250.0,
    netPay: 3625,
    paymentMode: "Rocket",
    bankName: "",
    accountNo: "01812345678",
    status: "Checked",
  },
  {
    id: "ELW-006",
    empId: "3302786",
    empName: "Md. Shantona Khatun",
    department: "Sewing",
    designation: "Asst. Operator",
    totalDays: 8.0,
    perDayRate: 220.0,
    netPay: 1760,
    paymentMode: "Cash",
    bankName: "",
    accountNo: "",
    status: "Checked",
  },
  {
    id: "ELW-007",
    empId: "33028814",
    empName: "Most. Fote Khatun",
    department: "Sewing",
    designation: "Asst. Operator",
    totalDays: 10.0,
    perDayRate: 220.0,
    netPay: 2200,
    paymentMode: "Bank",
    bankName: "Pubali Bank PLC",
    accountNo: "33429817298",
    status: "Authorized (HRD)",
  },
  {
    id: "ELW-008",
    empId: "8020064",
    empName: "Amina Khatun",
    department: "Store",
    designation: "Jr. Needle Man",
    totalDays: 6.5,
    perDayRate: 240.0,
    netPay: 1560,
    paymentMode: "bKash",
    bankName: "",
    accountNo: "01998765432",
    status: "Draft",
  },
  {
    id: "ELW-009",
    empId: "8179446",
    empName: "Mst. Morzina Khatun",
    department: "Sewing",
    designation: "Quality Ins.",
    totalDays: 5.0,
    perDayRate: 280.0,
    netPay: 1400,
    paymentMode: "Bank",
    bankName: "Sonali Bank PLC",
    accountNo: "12093847293",
    status: "Draft",
  },
  {
    id: "ELW-010",
    empId: "1001111",
    empName: "Md. Yeasin Ali",
    department: "Sewing",
    designation: "Supervisor",
    totalDays: 7.5,
    perDayRate: 310.0,
    netPay: 2325,
    paymentMode: "Rocket",
    bankName: "",
    accountNo: "01512345678",
    status: "Submitted",
  },
];

function EarnLeaveWorkflowPage() {
  const [rows, setRows] = useState<EarnLeaveWorkflowRow[]>(initialWorkflowRows);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [filterByStepStatus, setFilterByStepStatus] = useState(true);

  // Filters State
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("May");
  const [empType, setEmpType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Quick Add State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newEmpId, setNewEmpId] = useState("");
  const [newEmpName, setNewEmpName] = useState("");
  const [newDept, setNewDept] = useState("Sewing");
  const [newDesig, setNewDesig] = useState("Asst. Operator");
  const [newDays, setNewDays] = useState("5");
  const [newRate, setNewRate] = useState("250");
  const [newPaymentMode, setNewPaymentMode] = useState<"Bank" | "Cash" | "bKash" | "Rocket">(
    "Cash",
  );
  const [newBankName, setNewBankName] = useState("");
  const [newAccountNo, setNewAccountNo] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    year: "2026",
    month: "May",
    empType: "ALL",
    section: "ALL",
    unit: "ALL",
    empIdFilter: "",
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      year,
      month,
      empType,
      section,
      unit,
      empIdFilter,
    });
  };

  // Stepper Badge Counts (Calculated dynamically)
  const stepCounts = useMemo(() => {
    return {
      drafts: rows.filter((r) => r.status === "Draft").length,
      submitted: rows.filter((r) => r.status === "Submitted").length,
      checked: rows.filter((r) => r.status === "Checked").length,
      authorized: rows.filter((r) => r.status === "Authorized (HRD)").length,
    };
  }, [rows]);

  // Handle click on Stepper Cards to switch step
  const handleStepClick = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
    setSelectedIds(new Set()); // Reset selection when switching context
  };

  // Filter calculation logic
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      // 1. Step Status Filter (if enabled)
      if (filterByStepStatus) {
        if (currentStep === 1 && r.status !== "Draft") return false;
        if (currentStep === 2 && r.status !== "Submitted") return false;
        if (currentStep === 3 && r.status !== "Checked") return false;
      }

      // 2. Emp ID Filter
      if (appliedFilters.empIdFilter.trim() && r.empId !== appliedFilters.empIdFilter.trim()) {
        return false;
      }

      // 3. Search query matching Name, ID, Department, Designation
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.empId.toLowerCase().includes(q) ||
          r.empName.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.paymentMode.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [rows, currentStep, filterByStepStatus, appliedFilters, searchQuery]);

  // KPI Metrics for Shown Rows
  const kpis = useMemo(() => {
    const totalNetPay = filteredRows.reduce((sum, r) => sum + r.netPay, 0);
    const totalDays = filteredRows.reduce((sum, r) => sum + r.totalDays, 0);
    const paymentCounts = filteredRows.reduce(
      (acc, r) => {
        acc[r.paymentMode] = (acc[r.paymentMode] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalNetPay,
      totalDays: Math.round(totalDays * 100) / 100,
      paymentSummary: `Bank: ${paymentCounts.Bank || 0} | Cash: ${paymentCounts.Cash || 0} | Mobile: ${(paymentCounts.bKash || 0) + (paymentCounts.Rocket || 0)}`,
      count: filteredRows.length,
    };
  }, [filteredRows]);

  // Inline Row Editor
  const handleRowEdit = (id: string, field: keyof EarnLeaveWorkflowRow, value: any) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          // Recalculate netPay when days or rate change
          if (field === "totalDays" || field === "perDayRate") {
            const d = field === "totalDays" ? Number(value) : r.totalDays;
            const pr = field === "perDayRate" ? Number(value) : r.perDayRate;
            updated.netPay = Math.round(d * pr);
          }
          return updated;
        }
        return r;
      }),
    );
  };

  // Single Row Transition Actions
  const handleSingleTransition = (id: string, currentStatus: string) => {
    let nextStatus: "Submitted" | "Checked" | "Authorized (HRD)" = "Submitted";
    let message = "";

    if (currentStatus === "Draft") {
      nextStatus = "Submitted";
      message = "Ledger row submitted for verification.";
    } else if (currentStatus === "Submitted") {
      nextStatus = "Checked";
      message = "Ledger row checked & verified.";
    } else if (currentStatus === "Checked") {
      nextStatus = "Authorized (HRD)";
      message = "Ledger row authorized for cash disbursement.";
    } else {
      return;
    }

    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
    toast.success(message);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Bulk actions handlers
  const handleBulkAction = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to process!");
      return;
    }

    let nextStatus: "Submitted" | "Checked" | "Authorized (HRD)" = "Submitted";
    let message = "";

    if (currentStep === 1) {
      nextStatus = "Submitted";
      message = `Submitted ${selectedIds.size} records to verification queue.`;
    } else if (currentStep === 2) {
      nextStatus = "Checked";
      message = `Checked & verified ${selectedIds.size} records.`;
    } else if (currentStep === 3) {
      nextStatus = "Authorized (HRD)";
      message = `Authorized ${selectedIds.size} payouts for payout release!`;
    }

    setRows((prev) => prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: nextStatus } : r)));
    toast.success(message);

    // Auto-advance step if everything in current filtered list was checked
    const remainingCount = filteredRows.filter((r) => !selectedIds.has(r.id)).length;
    if (remainingCount === 0 && currentStep < 3) {
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) as any);
        toast.info(`Advancing to Step ${currentStep + 1}`);
      }, 1000);
    }

    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to delete.");
      return;
    }
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected records?`)) return;
    setRows((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    toast.success(`Deleted ${selectedIds.size} records.`);
    setSelectedIds(new Set());
  };

  const handleSingleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Record deleted successfully.");
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Reset Cycle handler
  const handleResetWorkflow = () => {
    if (!confirm("Reset all records to Draft stage for testing?")) return;
    setRows(initialWorkflowRows);
    setCurrentStep(1);
    toast.info("Workflow reset to Draft state for demonstration.");
  };

  // Quick Add handler
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpId.trim() || !newEmpName.trim()) {
      toast.error("Employee ID and Name are required!");
      return;
    }

    const days = parseFloat(newDays) || 0;
    const rate = parseFloat(newRate) || 0;
    const net = Math.round(days * rate);

    const newRow: EarnLeaveWorkflowRow = {
      id: `ELW-${Math.floor(1000 + Math.random() * 9000)}`,
      empId: newEmpId.trim(),
      empName: newEmpName.trim(),
      department: newDept,
      designation: newDesig,
      totalDays: days,
      perDayRate: rate,
      netPay: net,
      paymentMode: newPaymentMode,
      bankName: newPaymentMode === "Bank" ? newBankName.trim() : "",
      accountNo: newPaymentMode !== "Cash" ? newAccountNo.trim() : "",
      status: "Draft",
    };

    setRows((prev) => [newRow, ...prev]);
    toast.success(`Added processed record for ${newEmpName}!`);

    // Reset inputs
    setNewEmpId("");
    setNewEmpName("");
    setNewDays("5");
    setNewRate("250");
    setNewBankName("");
    setNewAccountNo("");
    setIsQuickAddOpen(false);
  };

  // Bulk selections logic
  const isAllSelected = filteredRows.length > 0 && filteredRows.every((r) => selectedIds.has(r.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredRows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredRows.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const toggleSelect = (id: string) => {
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

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5">
          {/* Breadcrumb Header */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Leave Management</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-extrabold">Earn Leave Workflow</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="size-5.5 text-primary" />
                <span>Earn Leave Workflow Panel</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                className="h-8.5 px-3 bg-primary hover:bg-primary-glow text-white font-extrabold text-[10.5px] rounded-lg shadow-sm transition flex items-center gap-1.5 uppercase"
              >
                <Plus className="size-3.5" />
                <span>Quick-Add Record</span>
              </button>

              <button
                onClick={handleResetWorkflow}
                className="h-8.5 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-[10.5px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 transition uppercase"
                title="Reset database workflow statuses to drafts"
              >
                <RefreshCw className="size-3" />
                <span>Reset Cycle</span>
              </button>
            </div>
          </div>

          {/* Collapsible Quick Add Form Panel */}
          {isQuickAddOpen && (
            <div className="bg-white dark:bg-[#1e293b] rounded-lg border-2 border-dashed border-primary/20 p-5 shadow-xs animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-4">
                <h3 className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-2">
                  <Calculator className="size-4" />
                  <span>Quick-Add Processed Accrual Record</span>
                </h3>
                <span className="text-[9px] uppercase font-bold text-slate-400">
                  Creates Draft Item
                </span>
              </div>

              <form
                onSubmit={handleQuickAdd}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 text-[11px] font-bold"
              >
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-400">Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    placeholder="e.g. 2023043910"
                    className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none focus:border-primary transition font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-400">Employee Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none focus:border-primary transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-400">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Project Resource & Strategy">Project Resource & Strategy</option>
                    <option value="Core Development (HR)">Core Development (HR)</option>
                    <option value="Core Sales">Core Sales</option>
                    <option value="Sewing">Sewing</option>
                    <option value="Store">Store</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-400">Designation</label>
                  <select
                    value={newDesig}
                    onChange={(e) => setNewDesig(e.target.value)}
                    className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Asst. Manager">Asst. Manager</option>
                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                    <option value="Deputy Manager">Deputy Manager</option>
                    <option value="Operator">Operator</option>
                    <option value="Asst. Operator">Asst. Operator</option>
                    <option value="Quality Ins.">Quality Ins.</option>
                    <option value="Jr. Needle Man">Jr. Needle Man</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-400">Earned Days</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDays}
                    onChange={(e) => setNewDays(e.target.value)}
                    className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-400">Per Day Rate (BDT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-slate-400">Payment Mode</label>
                  <select
                    value={newPaymentMode}
                    onChange={(e) => setNewPaymentMode(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Cash">Cash (Cash Office)</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="bKash">bKash Payout</option>
                    <option value="Rocket">Rocket Payout</option>
                  </select>
                </div>

                {newPaymentMode === "Bank" && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-400">Bank Name</label>
                    <input
                      type="text"
                      value={newBankName}
                      onChange={(e) => setNewBankName(e.target.value)}
                      placeholder="e.g. Dutch-Bangla Bank"
                      className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none"
                    />
                  </div>
                )}

                {newPaymentMode !== "Cash" && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-400">
                      {newPaymentMode === "Bank" ? "Account No" : "Wallet Number"}
                    </label>
                    <input
                      type="text"
                      value={newAccountNo}
                      onChange={(e) => setNewAccountNo(e.target.value)}
                      placeholder={newPaymentMode === "Bank" ? "125.120.xxxxx" : "017xxxxxxxx"}
                      className="w-full h-8 px-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 outline-none font-mono"
                    />
                  </div>
                )}

                <div className="flex items-end justify-end md:col-span-2 lg:col-span-1">
                  <button
                    type="submit"
                    className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-extrabold text-[10px] uppercase shadow-sm transition"
                  >
                    Add to Drafts
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Stepper Workflow Cards Panel (Interactive Tabs) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Submit */}
            <button
              onClick={() => handleStepClick(1)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 select-none shadow-3xs flex flex-col justify-between h-28 relative overflow-hidden ${
                currentStep === 1
                  ? "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500 ring-2 ring-blue-500/20"
                  : "bg-white dark:bg-[#1e293b] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`size-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      currentStep === 1
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white">
                      L1: Submission (Clerk)
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                      Drafts stage
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded text-[9px] font-black uppercase">
                  {stepCounts.drafts} Draft{stepCounts.drafts !== 1 && "s"}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Verify accrued calculations, configure payouts & click submit to forward.
              </div>
            </button>

            {/* Step 2: Check */}
            <button
              onClick={() => handleStepClick(2)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 select-none shadow-3xs flex flex-col justify-between h-28 relative overflow-hidden ${
                currentStep === 2
                  ? "bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500 ring-2 ring-purple-500/20"
                  : "bg-white dark:bg-[#1e293b] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`size-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      currentStep === 2
                        ? "bg-purple-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white">
                      L2: Verification (Check Officer)
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                      Officer stage
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded text-[9px] font-black uppercase">
                  {stepCounts.submitted} Awaiting check
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Verify banking details, perform audit calculations & forward to Director.
              </div>
            </button>

            {/* Step 3: Approve (HRD) */}
            <button
              onClick={() => handleStepClick(3)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 select-none shadow-3xs flex flex-col justify-between h-28 relative overflow-hidden ${
                currentStep === 3
                  ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500 ring-2 ring-emerald-500/20"
                  : "bg-white dark:bg-[#1e293b] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`size-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      currentStep === 3
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white">
                      L3: Authorization (Director HRD)
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                      Director stage
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-[9px] font-black uppercase">
                  {stepCounts.checked} Awaiting app
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Confirm compliance checklist, authorize disbursements & issue clearance.
              </div>
            </button>
          </div>

          {/* KPI Mini metrics summary strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-4.5 shadow-3xs">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/[0.03] border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                <UserCheck className="size-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wide block">
                  Ledger Volume
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white leading-tight block">
                  {kpis.count} Profile{kpis.count !== 1 && "s"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-100 dark:border-slate-800/60 pl-3 md:pl-5">
              <div className="size-9 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/[0.03] border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                <Coins className="size-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wide block">
                  Accrued days
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white leading-tight block">
                  {kpis.totalDays} Day{kpis.totalDays !== 1 && "s"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-100 dark:border-slate-800/60 pl-3 md:pl-5">
              <div className="size-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/[0.03] border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Landmark className="size-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wide block">
                  Net Cash value
                </span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 leading-tight block">
                  {kpis.totalNetPay.toLocaleString()} ৳
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-100 dark:border-slate-800/60 pl-3 md:pl-5">
              <div className="size-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/[0.03] border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <Smartphone className="size-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wide block">
                  Payment channels
                </span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight block truncate">
                  {kpis.paymentSummary}
                </span>
              </div>
            </div>
          </div>

          {/* Main Action Details Panel */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            {/* Header controls inside table card */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              {/* Left actions */}
              <div className="flex items-center gap-2.5">
                {/* Click action for active step */}
                <button
                  onClick={handleBulkAction}
                  className={`h-8 px-4 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition flex items-center gap-1.5 shadow-sm text-white ${
                    currentStep === 1
                      ? "bg-blue-600 hover:bg-blue-700"
                      : currentStep === 2
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-emerald-600 hover:bg-emerald-700 animate-pulse"
                  }`}
                >
                  <Unlock className="size-3.5" />
                  <span>
                    {currentStep === 1
                      ? "Submit Selected"
                      : currentStep === 2
                        ? "Verify Selected"
                        : "Authorize Selected"}
                  </span>
                </button>

                <button
                  onClick={handleDeleteSelected}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-650 text-white font-extrabold text-[10px] rounded-lg shadow-sm flex items-center gap-1.5 uppercase transition"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Selected</span>
                </button>
              </div>

              {/* Right filters & controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Step filter toggle check */}
                <label className="flex items-center gap-2 px-3 h-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                  {filterByStepStatus ? (
                    <Eye className="size-3.5 text-primary" />
                  ) : (
                    <EyeOff className="size-3.5 text-slate-400" />
                  )}
                  <span>Filter by Step Status</span>
                  <input
                    type="checkbox"
                    checked={filterByStepStatus}
                    onChange={(e) => setFilterByStepStatus(e.target.checked)}
                    className="sr-only"
                  />
                </label>

                {/* Print capabilities */}
                <div className="flex items-center gap-1">
                  <button
                    className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition"
                    title="Export Excel"
                  >
                    <FileSpreadsheet className="size-4 text-emerald-500" />
                  </button>
                  <button
                    className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition"
                    title="Print Grid"
                  >
                    <Printer className="size-4 text-blue-500" />
                  </button>
                  <button
                    className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition"
                    title="Save PDF"
                  >
                    <FileDown className="size-4 text-rose-500" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ledger grid..."
                    className="h-8 pl-8 pr-2.5 w-40 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-extrabold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Compact spreadsheet table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-3xs">
              <table className="w-full border-collapse text-[10px] text-left">
                <thead>
                  <tr className="bg-[#ffebee] dark:bg-rose-950/20 text-slate-800 dark:text-rose-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none">
                    <th className="px-2.5 py-2.5 text-center w-8 border-r border-slate-200/50 dark:border-slate-800/30">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-primary focus:ring-primary size-3 cursor-pointer"
                      />
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 w-20">
                      Emp ID
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 w-36">
                      Name
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30">
                      Department
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30">
                      Designation
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 text-center w-20">
                      Days
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 text-right w-24">
                      Rate (BDT)
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 text-right w-24">
                      Net Pay
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 text-center w-24">
                      Payment Mode
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 text-left w-36">
                      Bank Name
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 text-left w-36">
                      Account No
                    </th>
                    <th className="px-2.5 py-2.5 border-r border-slate-200/50 dark:border-slate-800/30 text-center w-20">
                      Status
                    </th>
                    <th className="px-2.5 py-2.5 text-center w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredRows.map((row) => {
                    const isSelected = selectedIds.has(row.id);

                    let statusColor =
                      "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                    if (row.status === "Submitted") {
                      statusColor =
                        "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400";
                    } else if (row.status === "Checked") {
                      statusColor =
                        "bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400";
                    } else if (row.status === "Authorized (HRD)") {
                      statusColor =
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400";
                    }

                    // Payment Mode Pills styling
                    let paymentBadge =
                      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
                    if (row.paymentMode === "Bank")
                      paymentBadge = "bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400";
                    if (row.paymentMode === "bKash")
                      paymentBadge =
                        "bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400";
                    if (row.paymentMode === "Rocket")
                      paymentBadge =
                        "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400";
                    if (row.paymentMode === "Cash")
                      paymentBadge =
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";

                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap"
                      >
                        <td className="px-2.5 py-1.5 text-center border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(row.id)}
                            className="rounded border-slate-300 text-primary focus:ring-primary size-3 cursor-pointer"
                          />
                        </td>

                        <td className="px-2.5 py-1.5 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">
                          {row.empId}
                        </td>
                        <td
                          className="px-2.5 py-1.5 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50 truncate max-w-[120px]"
                          title={row.empName}
                        >
                          {row.empName}
                        </td>
                        <td
                          className="px-2.5 py-1.5 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50 truncate max-w-[110px]"
                          title={row.department}
                        >
                          {row.department}
                        </td>
                        <td
                          className="px-2.5 py-1.5 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50 truncate max-w-[110px]"
                          title={row.designation}
                        >
                          {row.designation}
                        </td>

                        {/* Inline editable Earned Days */}
                        <td className="px-1.5 py-1 border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="number"
                            step="0.01"
                            disabled={row.status === "Authorized (HRD)"}
                            value={row.totalDays}
                            onChange={(e) =>
                              handleRowEdit(row.id, "totalDays", parseFloat(e.target.value) || 0)
                            }
                            className="w-full h-6 px-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-center focus:border-primary outline-none disabled:opacity-50"
                          />
                        </td>

                        {/* Inline editable Rate */}
                        <td className="px-1.5 py-1 border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="number"
                            step="0.01"
                            disabled={row.status === "Authorized (HRD)"}
                            value={row.perDayRate}
                            onChange={(e) =>
                              handleRowEdit(row.id, "perDayRate", parseFloat(e.target.value) || 0)
                            }
                            className="w-full h-6 px-1 text-right rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono focus:border-primary outline-none disabled:opacity-50"
                          />
                        </td>

                        {/* Recalculated Net Pay Display */}
                        <td className="px-2.5 py-1.5 font-mono font-black text-right text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50">
                          {row.netPay.toLocaleString()}
                        </td>

                        {/* Inline editable Payment Mode */}
                        <td className="px-1.5 py-1 border-r border-slate-100 dark:border-slate-800/50">
                          <select
                            value={row.paymentMode}
                            disabled={row.status === "Authorized (HRD)"}
                            onChange={(e) =>
                              handleRowEdit(row.id, "paymentMode", e.target.value as any)
                            }
                            className={`w-full h-6 px-0.5 rounded border border-slate-200 dark:border-slate-800 text-[9px] font-black focus:border-primary outline-none cursor-pointer ${paymentBadge}`}
                          >
                            <option
                              value="Cash"
                              className="bg-white dark:bg-slate-950 text-slate-700"
                            >
                              Cash
                            </option>
                            <option
                              value="Bank"
                              className="bg-white dark:bg-slate-950 text-slate-700"
                            >
                              Bank
                            </option>
                            <option
                              value="bKash"
                              className="bg-white dark:bg-slate-950 text-slate-700"
                            >
                              bKash
                            </option>
                            <option
                              value="Rocket"
                              className="bg-white dark:bg-slate-950 text-slate-700"
                            >
                              Rocket
                            </option>
                          </select>
                        </td>

                        {/* Bank Name Input */}
                        <td className="px-1.5 py-1 border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="text"
                            disabled={
                              row.status === "Authorized (HRD)" || row.paymentMode !== "Bank"
                            }
                            value={row.bankName}
                            onChange={(e) => handleRowEdit(row.id, "bankName", e.target.value)}
                            placeholder="Bank Name"
                            className="w-full h-6 px-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[9.5px] focus:border-primary outline-none disabled:opacity-40"
                          />
                        </td>

                        {/* Account Number Input */}
                        <td className="px-1.5 py-1 border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="text"
                            disabled={
                              row.status === "Authorized (HRD)" || row.paymentMode === "Cash"
                            }
                            value={row.accountNo}
                            onChange={(e) => handleRowEdit(row.id, "accountNo", e.target.value)}
                            placeholder="Acc No / Wallet No"
                            className="w-full h-6 px-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[9.5px] font-mono focus:border-primary outline-none disabled:opacity-40"
                          />
                        </td>

                        {/* Status Badge */}
                        <td className="px-2.5 py-1.5 text-center border-r border-slate-100 dark:border-slate-800/50">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${statusColor}`}
                          >
                            {row.status === "Authorized (HRD)" ? "Authorized" : row.status}
                          </span>
                        </td>

                        {/* Context-aware Actions Cell */}
                        <td className="px-2.5 py-1.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* State transitions */}
                            {row.status === "Draft" && (
                              <button
                                onClick={() => handleSingleTransition(row.id, "Draft")}
                                className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white rounded text-[8px] font-black uppercase transition"
                              >
                                Submit
                              </button>
                            )}

                            {row.status === "Submitted" && (
                              <button
                                onClick={() => handleSingleTransition(row.id, "Submitted")}
                                className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white rounded text-[8px] font-black uppercase transition"
                              >
                                Verify
                              </button>
                            )}

                            {row.status === "Checked" && (
                              <button
                                onClick={() => handleSingleTransition(row.id, "Checked")}
                                className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white rounded text-[8px] font-black uppercase transition animate-pulse"
                              >
                                Authorize
                              </button>
                            )}

                            {row.status === "Authorized (HRD)" && (
                              <span className="text-emerald-500 dark:text-emerald-400 font-extrabold text-[9px] uppercase tracking-wide">
                                Cleared ✓
                              </span>
                            )}

                            {/* Trash Icon */}
                            <button
                              onClick={() => handleSingleDelete(row.id)}
                              className="text-slate-400 hover:text-rose-500 hover:scale-110 p-0.5 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={13} className="px-4 py-16 text-center text-slate-400 font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <HelpCircle className="size-6.5 text-slate-350" />
                          <span>No processed earned leave records in active filtered list.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Grid summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <span className="text-[10px] font-bold text-slate-400">
                Showing 1 to {filteredRows.length} of {filteredRows.length} entries
              </span>

              <div className="flex items-center gap-1 select-none text-[10px] font-bold">
                <button className="px-2.5 h-7 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed">
                  Previous
                </button>
                <button className="size-7 rounded bg-primary text-white flex items-center justify-center font-black">
                  1
                </button>
                <button className="px-2.5 h-7 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
