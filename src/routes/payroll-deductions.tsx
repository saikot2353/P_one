import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  ChevronRight, 
  Search, 
  FileText, 
  Printer, 
  FileDown, 
  MinusCircle, 
  Save, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  Clock,
  Info,
  Sliders,
  TrendingDown,
  Tag,
  Users,
  Building2,
  CalendarDays,
  FileCheck,
  AlertTriangle,
  ClipboardList,
  Copy,
  Moon,
  ArrowRight
} from "lucide-react";

// Define Deduction Template Interface
interface DeductionTemplate {
  id: number;
  name: string;
  type: string; // Penalty, Damage, Lunch Deduction, Transport, etc.
  amount: string;
  amountType: "flat" | "percent-basic" | "percent-gross"; // Flat Tk, % of Basic, % of Gross
  targetGroup: string; // All Staff, All Permanent, etc.
  status: "Active" | "Inactive";
  recurrence: "one-time" | "monthly";
  oneTimeMonth?: string; // e.g. "Jul"
  oneTimeYear?: string;  // e.g. "2026"
  excludeRamadan: boolean;
  excludedMonths: string[]; // e.g. ["Jun", "Jul"] - skips in these months every year
  customExcludedPeriods: string[]; // e.g. ["2026-12"] - skips in specific year-month
}

export const Route = createFileRoute("/payroll-deductions")({
  head: () => ({
    meta: [
      { title: "Deduction Templates — CRIPTON" },
      { name: "description", content: "Manage recurring and one-time deduction rules with smart calendar exclusions." },
    ],
  }),
  component: PayrollDeductionsPage,
});

// Months and Years constants
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];
const DEDUCTION_TYPES = ["Penalty", "Damage", "Lunch Deduction", "Transport Deduction", "Other"];

// Ramadan/Roza dates mapping (Approximate overlap with Gregorian months)
const RAMADAN_RANGES: Record<number, { start: Date; end: Date; desc: string }> = {
  2024: { start: new Date(2024, 2, 11), end: new Date(2024, 3, 9), desc: "Mar 11 – Apr 9" },
  2025: { start: new Date(2025, 2, 1), end: new Date(2025, 2, 30), desc: "Mar 1 – Mar 30" },
  2026: { start: new Date(2026, 1, 18), end: new Date(2026, 2, 19), desc: "Feb 18 – Mar 19" },
  2027: { start: new Date(2027, 1, 8), end: new Date(2027, 2, 9), desc: "Feb 8 – Mar 9" },
  2028: { start: new Date(2028, 0, 28), end: new Date(2028, 1, 26), desc: "Jan 28 – Feb 26" },
  2029: { start: new Date(2029, 0, 16), end: new Date(2029, 1, 14), desc: "Jan 16 – Feb 14" },
  2030: { start: new Date(2030, 0, 5), end: new Date(2030, 1, 3), desc: "Jan 5 – Feb 3" },
};

// Check if a specific month/year overlaps with Ramadan (taking optional calibration offset into account)
const getRamadanOverlap = (year: number, monthStr: string, calibrationOffsetDays: number = 0) => {
  const monthIdx = MONTHS.indexOf(monthStr);
  if (monthIdx === -1) return false;

  const baseRange = RAMADAN_RANGES[year];
  if (!baseRange) return false;

  // Apply calibration offset in days to the Ramadan dates
  const adjustedStart = new Date(baseRange.start.getTime());
  adjustedStart.setDate(adjustedStart.getDate() + calibrationOffsetDays);
  
  const adjustedEnd = new Date(baseRange.end.getTime());
  adjustedEnd.setDate(adjustedEnd.getDate() + calibrationOffsetDays);

  const monthStart = new Date(year, monthIdx, 1);
  const monthEnd = new Date(year, monthIdx + 1, 0);

  return adjustedStart <= monthEnd && monthStart <= adjustedEnd;
};

// Returns adjusted range string description
const getCalibratedRamadanRangeDesc = (year: number, offsetDays: number = 0) => {
  const baseRange = RAMADAN_RANGES[year];
  if (!baseRange) return "Variable";
  if (offsetDays === 0) return baseRange.desc;

  const adjStart = new Date(baseRange.start.getTime());
  adjStart.setDate(adjStart.getDate() + offsetDays);

  const adjEnd = new Date(baseRange.end.getTime());
  adjEnd.setDate(adjEnd.getDate() + offsetDays);

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${adjStart.toLocaleDateString("en-US", options)} – ${adjEnd.toLocaleDateString("en-US", options)}`;
};

// Calculate whether a deduction should apply or skip (Safe against undefined array fields)
const checkDeductionStatus = (
  template: DeductionTemplate,
  year: number,
  monthStr: string,
  calibrationOffsetDays: number = 0
): { isSkipped: boolean; reason?: string } => {
  if (template.status === "Inactive") {
    return { isSkipped: true, reason: "Inactive Template" };
  }

  // 1. One-time recurrence evaluation
  if (template.recurrence === "one-time") {
    if (template.oneTimeMonth !== monthStr || template.oneTimeYear !== String(year)) {
      return { isSkipped: true, reason: `One-time: runs only in ${template.oneTimeMonth || "Jul"} ${template.oneTimeYear || "2026"}` };
    }
    return { isSkipped: false };
  }

  // 2. Monthly recurring rules evaluation
  // A. Ramadan exclusion
  if (template.excludeRamadan && getRamadanOverlap(year, monthStr, calibrationOffsetDays)) {
    const rangeDesc = getCalibratedRamadanRangeDesc(year, calibrationOffsetDays);
    return { isSkipped: true, reason: `Ramadan Exception (${rangeDesc})` };
  }

  // B. Specific calendar month of year exclusion
  const exclMonths = template.excludedMonths || [];
  if (exclMonths.includes(monthStr)) {
    return { isSkipped: true, reason: `Annual skipped month (${monthStr})` };
  }

  // C. Custom single period exclusion
  const monthNum = String(MONTHS.indexOf(monthStr) + 1).padStart(2, "0");
  const periodStr = `${year}-${monthNum}`;
  const customExcl = template.customExcludedPeriods || [];
  if (customExcl.includes(periodStr)) {
    return { isSkipped: true, reason: `One-off exception month (${monthStr} ${year})` };
  }

  return { isSkipped: false };
};

// Mock Employee DB with salaries to calculate percentage-based deductions
interface EmployeeRecord {
  id: number;
  empId: string;
  name: string;
  empType: string;
  department: string;
  designation: string;
  basic: number;
  gross: number;
}

const MOCK_EMPLOYEES: EmployeeRecord[] = [
  { id: 1, empId: "2025057068", name: "Riazul Islam", empType: "Office Executive", department: "Accounts & Vat", designation: "Asst. Manager", basic: 42000, gross: 70000 },
  { id: 2, empId: "2023046001", name: "Sohanur Rahman Sohan", empType: "Office Executive", department: "Admin", designation: "Executive", basic: 30000, gross: 50000 },
  { id: 3, empId: "2023043021", name: "Easin Mia", empType: "Office Executive", department: "Admin", designation: "Receptionist", basic: 15000, gross: 25000 },
  { id: 4, empId: "2026059411", name: "Jannatul Maowa", empType: "Office Executive", department: "Admin", designation: "Jr. Executive", basic: 18000, gross: 30000 },
  { id: 5, empId: "2024049326", name: "Hanif Uddin", empType: "Office Executive", department: "APPS Team", designation: "Sr. Executive", basic: 36000, gross: 60000 }
];

// Helper to evaluate final monetary value based on calculation type
const getEvaluatedAmount = (amount: string, amountType: "flat" | "percent-basic" | "percent-gross", basic: number, gross: number) => {
  const numericVal = Number(amount) || 0;
  if (amountType === "percent-basic") {
    return Math.round((numericVal / 100) * basic);
  }
  if (amountType === "percent-gross") {
    return Math.round((numericVal / 100) * gross);
  }
  return numericVal;
};

// Default Templates Data
const DEFAULT_TEMPLATES: DeductionTemplate[] = [
  {
    id: 1,
    name: "Late Penalty (Over 3 Days)",
    type: "Penalty",
    amount: "500",
    amountType: "flat",
    targetGroup: "All Staff",
    status: "Active",
    recurrence: "monthly",
    excludeRamadan: false,
    excludedMonths: [],
    customExcludedPeriods: []
  },
  {
    id: 2,
    name: "Lunch Deduction",
    type: "Lunch Deduction",
    amount: "1200",
    amountType: "flat",
    targetGroup: "All Staff",
    status: "Active",
    recurrence: "monthly",
    excludeRamadan: true, // skipped during Ramadan
    excludedMonths: [],
    customExcludedPeriods: []
  },
  {
    id: 3,
    name: "Transport Deduction",
    type: "Transport Deduction",
    amount: "2",
    amountType: "percent-basic", // 2% of basic
    targetGroup: "All Staff",
    status: "Active",
    recurrence: "monthly",
    excludeRamadan: false,
    excludedMonths: ["Jun", "Jul"], // e.g. annual summer break
    customExcludedPeriods: []
  },
  {
    id: 4,
    name: "Festival Token Charge",
    type: "Other",
    amount: "300",
    amountType: "flat",
    targetGroup: "All Staff",
    status: "Inactive",
    recurrence: "one-time",
    oneTimeMonth: "Jul",
    oneTimeYear: "2026",
    excludeRamadan: false,
    excludedMonths: [],
    customExcludedPeriods: []
  }
];

function PayrollDeductionsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [templates, setTemplates] = useState<DeductionTemplate[]>(DEFAULT_TEMPLATES);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Bulk selections state
  const [bulkSelectedIds, setBulkSelectedIds] = useState<number[]>([]);

  // Current active audit month selector (for main page listing analysis)
  const [activeProcessMonth, setActiveProcessMonth] = useState("Jul");
  const [activeProcessYear, setActiveProcessYear] = useState("2026");

  // Modal active tab state: "general" | "schedule"
  const [activeTab, setActiveTab] = useState<"general" | "schedule">("general");

  // Form Editing State
  const [editingTemplate, setEditingTemplate] = useState<DeductionTemplate | null>(null);

  // Form Fields States
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("---Select---");
  const [formAmount, setFormAmount] = useState("");
  const [formAmountType, setFormAmountType] = useState<"flat" | "percent-basic" | "percent-gross">("flat");
  const [formEmpType, setFormEmpType] = useState("ALL");
  const [formDepartment, setFormDepartment] = useState("All Departments");
  const [formSection, setFormSection] = useState("ALL");
  const [formEmpId, setFormEmpId] = useState("");
  const [formRecurrence, setFormRecurrence] = useState<"one-time" | "monthly">("monthly");
  const [formOneTimeMonth, setFormOneTimeMonth] = useState("Jul");
  const [formOneTimeYear, setFormOneTimeYear] = useState("2026");
  const [formExcludeRamadan, setFormExcludeRamadan] = useState(false);
  const [formExcludedMonths, setFormExcludedMonths] = useState<string[]>([]);
  
  // Custom excluded months states
  const [formExclusionMonth, setFormExclusionMonth] = useState("Jan");
  const [formExclusionYear, setFormExclusionYear] = useState("2026");
  const [formCustomExcludedPeriods, setFormCustomExcludedPeriods] = useState<string[]>([]);

  // Simulation & Calibration States
  const [simMonth, setSimMonth] = useState("Mar"); // Mar 2026 contains Ramadan
  const [simYear, setSimYear] = useState("2026");
  const [ramadanCalibrationOffset, setRamadanCalibrationOffset] = useState(0); // Offset in days: -2 to +2
  const [simResults, setSimResults] = useState<{ template: DeductionTemplate; status: { isSkipped: boolean; reason?: string } }[]>([]);

  // Load from localStorage only after component mounts to avoid SSR hydration mismatches
  useEffect(() => {
    const stored = localStorage.getItem("payroll_deduction_templates");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((t: any) => ({
            id: t.id || Date.now() + Math.random(),
            name: t.name || "Untitled Deduction",
            type: t.type || "Other",
            amount: t.amount || "0",
            amountType: t.amountType || "flat",
            targetGroup: t.targetGroup || "All Staff",
            status: t.status === "Inactive" ? "Inactive" : "Active",
            recurrence: t.recurrence || "monthly",
            oneTimeMonth: t.oneTimeMonth || "Jul",
            oneTimeYear: t.oneTimeYear || "2026",
            excludeRamadan: !!t.excludeRamadan,
            excludedMonths: Array.isArray(t.excludedMonths) ? t.excludedMonths : [],
            customExcludedPeriods: Array.isArray(t.customExcludedPeriods) ? t.customExcludedPeriods : []
          }));
          setTemplates(migrated);
        }
      } catch (e) {
        console.error("Failed to parse templates from localStorage", e);
      }
    }
    setIsMounted(true);
  }, []);

  // Sync templates to localStorage (only after mount!)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("payroll_deduction_templates", JSON.stringify(templates));
    }
  }, [templates, isMounted]);

  // Bulk toggle selections helper
  const handleToggleBulkSelectRow = (id: number) => {
    if (bulkSelectedIds.includes(id)) {
      setBulkSelectedIds(bulkSelectedIds.filter(item => item !== id));
    } else {
      setBulkSelectedIds([...bulkSelectedIds, id]);
    }
  };

  const handleToggleBulkSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setBulkSelectedIds(filteredTemplates.map(t => t.id));
    } else {
      setBulkSelectedIds([]);
    }
  };

  // Bulk action triggers
  const handleBulkActivate = () => {
    if (bulkSelectedIds.length === 0) return;
    setTemplates(templates.map(t => bulkSelectedIds.includes(t.id) ? { ...t, status: "Active" as const } : t));
    setBulkSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    if (bulkSelectedIds.length === 0) return;
    setTemplates(templates.map(t => bulkSelectedIds.includes(t.id) ? { ...t, status: "Inactive" as const } : t));
    setBulkSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (bulkSelectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete the ${bulkSelectedIds.length} selected template(s)?`)) {
      setTemplates(templates.filter(t => !bulkSelectedIds.includes(t.id)));
      setBulkSelectedIds([]);
    }
  };

  const handleFetchPreview = () => {
    setIsPreviewLoaded(true);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setFormName("");
    setFormType("---Select---");
    setFormAmount("");
    setFormAmountType("flat");
    setFormEmpType("ALL");
    setFormDepartment("All Departments");
    setFormSection("ALL");
    setFormEmpId("");
    setFormRecurrence("monthly");
    setFormOneTimeMonth("Jul");
    setFormOneTimeYear("2026");
    setFormExcludeRamadan(false);
    setFormExcludedMonths([]);
    setFormCustomExcludedPeriods([]);
    setIsPreviewLoaded(false);
    setActiveTab("general");
  };

  const handleCreateNewClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (template: DeductionTemplate) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormType(template.type);
    setFormAmount(template.amount);
    setFormAmountType(template.amountType || "flat");
    
    setFormEmpType(template.targetGroup.includes("Permanent") ? "Permanent" : template.targetGroup.includes("Contractual") ? "Contractual" : "ALL");
    setFormDepartment(template.targetGroup.includes("IT") ? "IT" : "All Departments");
    setFormSection("ALL");
    setFormEmpId("");
    
    setFormRecurrence(template.recurrence);
    setFormOneTimeMonth(template.oneTimeMonth || "Jul");
    setFormOneTimeYear(template.oneTimeYear || "2026");
    setFormExcludeRamadan(template.excludeRamadan);
    setFormExcludedMonths(template.excludedMonths || []);
    setFormCustomExcludedPeriods(template.customExcludedPeriods || []);
    
    setIsPreviewLoaded(false);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  // Copy template helper
  const handleDuplicateTemplate = (template: DeductionTemplate) => {
    const duplicated: DeductionTemplate = {
      ...template,
      id: Date.now(),
      name: `Copy of ${template.name}`,
      status: "Inactive" // default copied rule to inactive for safety
    };
    setTemplates([...templates, duplicated]);
  };

  const handleDeleteTemplate = (id: number) => {
    if (window.confirm("Are you sure you want to permanently delete this deduction template?")) {
      setTemplates(templates.filter((t) => t.id !== id));
      setBulkSelectedIds(bulkSelectedIds.filter(item => item !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setTemplates(
      templates.map((t) =>
        t.id === id ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" } : t
      )
    );
  };

  const handleAddCustomExclusion = () => {
    const monthNum = String(MONTHS.indexOf(formExclusionMonth) + 1).padStart(2, "0");
    const periodStr = `${formExclusionYear}-${monthNum}`;
    
    if (formCustomExcludedPeriods.includes(periodStr)) {
      alert("This specific month is already in the exclusion list.");
      return;
    }
    setFormCustomExcludedPeriods([...formCustomExcludedPeriods, periodStr]);
  };

  const handleRemoveCustomExclusion = (periodStr: string) => {
    setFormCustomExcludedPeriods(formCustomExcludedPeriods.filter((p) => p !== periodStr));
  };

  const toggleFormExcludedMonth = (month: string) => {
    if (formExcludedMonths.includes(month)) {
      setFormExcludedMonths(formExcludedMonths.filter((m) => m !== month));
    } else {
      setFormExcludedMonths([...formExcludedMonths, month]);
    }
  };

  const handleSaveTemplate = () => {
    if (!formName.trim()) {
      alert("Template Name is required.");
      return;
    }
    if (formType === "---Select---") {
      alert("Please select a valid deduction type.");
      return;
    }
    if (!formAmount || Number(formAmount) <= 0) {
      alert("Amount must be a positive number.");
      return;
    }

    const saved: DeductionTemplate = {
      id: editingTemplate ? editingTemplate.id : Date.now(),
      name: formName,
      type: formType,
      amount: formAmount,
      amountType: formAmountType,
      targetGroup: formEmpType === "ALL" ? "All Staff" : `All ${formEmpType}`,
      status: editingTemplate ? editingTemplate.status : "Active",
      recurrence: formRecurrence,
      oneTimeMonth: formRecurrence === "one-time" ? formOneTimeMonth : undefined,
      oneTimeYear: formRecurrence === "one-time" ? formOneTimeYear : undefined,
      excludeRamadan: formRecurrence === "monthly" ? formExcludeRamadan : false,
      excludedMonths: formRecurrence === "monthly" ? formExcludedMonths : [],
      customExcludedPeriods: formRecurrence === "monthly" ? formCustomExcludedPeriods : [],
    };

    if (editingTemplate) {
      setTemplates(templates.map((t) => (t.id === editingTemplate.id ? saved : t)));
    } else {
      setTemplates([...templates, saved]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const getTimelinePreview = () => {
    let currentMonthIdx = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const tempTemplate: DeductionTemplate = {
      id: 0,
      name: formName,
      type: formType,
      amount: formAmount || "0",
      amountType: formAmountType,
      targetGroup: "",
      status: "Active",
      recurrence: formRecurrence,
      oneTimeMonth: formOneTimeMonth,
      oneTimeYear: formOneTimeYear,
      excludeRamadan: formExcludeRamadan,
      excludedMonths: formExcludedMonths,
      customExcludedPeriods: formCustomExcludedPeriods,
    };

    const results = [];
    for (let i = 0; i < 12; i++) {
      const monthStr = MONTHS[currentMonthIdx];
      const statusRes = checkDeductionStatus(tempTemplate, currentYear, monthStr, ramadanCalibrationOffset);
      results.push({
        monthStr,
        year: currentYear,
        ...statusRes,
      });

      currentMonthIdx++;
      if (currentMonthIdx > 11) {
        currentMonthIdx = 0;
        currentYear++;
      }
    }
    return results;
  };

  // Run simulation calculation
  const handleRunSimulation = () => {
    const results = templates.map((t) => {
      const status = checkDeductionStatus(t, Number(simYear), simMonth, ramadanCalibrationOffset);
      return { template: t, status };
    });
    setSimResults(results);
  };

  useEffect(() => {
    handleRunSimulation();
  }, [templates, simMonth, simYear, ramadanCalibrationOffset]);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Computes how each template runs in the ACTIVE listing month selection
  const templatesRunStatusMap = useMemo(() => {
    const record: Record<number, { isSkipped: boolean; reason?: string }> = {};
    templates.forEach(t => {
      record[t.id] = checkDeductionStatus(t, Number(activeProcessYear), activeProcessMonth, ramadanCalibrationOffset);
    });
    return record;
  }, [templates, activeProcessMonth, activeProcessYear, ramadanCalibrationOffset]);

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-800 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-5 md:p-8 space-y-8 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-300" />
            <span>Payroll</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span className="text-slate-600">Deduction Rules</span>
          </div>

          {/* Header Card with Gradient and Icons */}
          <div className="relative bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-rose-50/30 rounded-full blur-2xl -z-10 translate-y-1/2" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                  <TrendingDown className="size-3.5" />
                  Payroll Exceptions
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                  Deduction Templates
                </h1>
                <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
                  Manage fixed and recurring salary deduction profiles. Use automated exclusion controls to easily pause deductions in fasting seasons like <strong>Ramadan (Rojar Mash)</strong>, custom monthly windows, or off-peak periods without touching individual records.
                </p>
              </div>

              <div>
                <Button
                  onClick={handleCreateNewClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus className="size-5" />
                  NEW TEMPLATE
                </Button>
              </div>
            </div>
          </div>

          {/* Active Period Dashboard (Interactive list status override) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-500">Active Audit Period</span>
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                Evaluating Templates for: 
                <span className="text-blue-600 underline decoration-indigo-300 underline-offset-4">{activeProcessMonth} {activeProcessYear}</span>
              </h2>
              <p className="text-xs text-slate-400">Main table statuses and evaluation logs react dynamically to this setting to preview output.</p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex-1 md:flex-none">
                <label className="text-[9px] text-slate-400 font-extrabold uppercase block mb-1">Month</label>
                <select
                  value={activeProcessMonth}
                  onChange={(e) => setActiveProcessMonth(e.target.value)}
                  className="w-full md:w-32 h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-xs cursor-pointer focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500"
                >
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex-1 md:flex-none">
                <label className="text-[9px] text-slate-400 font-extrabold uppercase block mb-1">Year</label>
                <select
                  value={activeProcessYear}
                  onChange={(e) => setActiveProcessYear(e.target.value)}
                  className="w-full md:w-32 h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-xs cursor-pointer focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500"
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Action Controls bar (visible when rows are checked) */}
          {bulkSelectedIds.length > 0 && (
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg text-blue-400">
                  <ClipboardList className="size-4" />
                </div>
                <span className="text-xs font-bold">{bulkSelectedIds.length} templates selected for bulk updates:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkActivate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors border-0 cursor-pointer"
                >
                  Activate
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors border-0 cursor-pointer"
                >
                  Deactivate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors border-0 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setBulkSelectedIds([])}
                  className="text-slate-400 hover:text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Templates Directory Block */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Table Control Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="flex bg-slate-100/80 border border-slate-200/50 rounded-xl p-1 w-fit shadow-xs">
                <button className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <FileDown className="size-4 text-emerald-600" />
                  EXCEL
                </button>
                <div className="w-px bg-slate-200 my-1.5" />
                <button className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <Printer className="size-4 text-blue-600" />
                  PRINT
                </button>
                <div className="w-px bg-slate-200 my-1.5" />
                <button className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <FileText className="size-4 text-rose-600" />
                  PDF
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-full sm:w-72">
                  <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        className="accent-blue-600 w-3.5 h-3.5 rounded border-slate-300 cursor-pointer"
                        onChange={handleToggleBulkSelectAll}
                        checked={filteredTemplates.length > 0 && bulkSelectedIds.length === filteredTemplates.length}
                      />
                    </th>
                    <th className="p-4 pl-2 text-center w-14">Sl</th>
                    <th className="p-4">Deduction Rule</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Base Rate</th>
                    <th className="p-4">Schedule Pattern</th>
                    <th className="p-4">Target Scope</th>
                    <th className="p-4 text-center w-40">Period Run Audit</th>
                    <th className="p-4 text-center w-24">Status</th>
                    <th className="p-4 text-center pr-6 w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-16 text-center text-slate-400 text-sm">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="size-8 text-slate-300" />
                          <span>No deduction profiles found.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((row, idx) => {
                      const runStatus = templatesRunStatusMap[row.id];
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/40 transition-colors group">
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              className="accent-blue-600 w-3.5 h-3.5 rounded border-slate-300 cursor-pointer"
                              checked={bulkSelectedIds.includes(row.id)}
                              onChange={() => handleToggleBulkSelectRow(row.id)}
                            />
                          </td>
                          <td className="p-4 pl-2 text-slate-400 font-bold text-center">{idx + 1}</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{row.name}</span>
                              {row.recurrence === "monthly" && row.excludeRamadan && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-100/50 rounded px-1.5 py-0.5 w-fit mt-1">
                                  🌙 Excludes Ramadan (Rojar)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200/40 text-slate-600">
                              <Tag className="size-3 text-slate-400" />
                              {row.type}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              {row.amountType === "flat" ? (
                                <span className="font-extrabold text-slate-900">৳ {Number(row.amount).toLocaleString()}</span>
                              ) : (
                                <span className="font-extrabold text-slate-900">{row.amount}% <span className="text-[10px] text-slate-400 font-bold">of {row.amountType === "percent-basic" ? "Basic" : "Gross"}</span></span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {row.recurrence === "one-time" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                <CalendarDays className="size-3.5" /> One-Time ({row.oneTimeMonth || "Jul"} {row.oneTimeYear || "2026"})
                              </span>
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                  <Clock className="size-3.5" /> Monthly Recurring
                                </span>
                                <div className="text-[10px] text-slate-400 leading-tight">
                                  {row.excludedMonths && row.excludedMonths.length > 0 && `Skip: ${row.excludedMonths.join(", ")}. `}
                                  {row.customExcludedPeriods && row.customExcludedPeriods.length > 0 && `Exceptions: ${row.customExcludedPeriods.join(", ")}.`}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-slate-500 font-medium">
                            <span className="inline-flex items-center gap-1">
                              <Users className="size-3.5 text-slate-400" />
                              {row.targetGroup}
                            </span>
                          </td>
                          
                          {/* Live audit for the selected run month */}
                          <td className="p-4 text-center">
                            {row.status === "Inactive" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                Skip: Inactive
                              </span>
                            ) : runStatus?.isSkipped ? (
                              <div className="inline-flex flex-col items-center gap-0.5">
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded">
                                  ⚠️ Suspended
                                </span>
                                <span className="text-[8px] text-slate-400 block max-w-[150px] truncate" title={runStatus.reason}>
                                  {runStatus.reason}
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                ✓ Will Run
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleStatus(row.id)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                row.status === "Active"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200/60 hover:bg-emerald-100 hover:-translate-y-0.5"
                                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:-translate-y-0.5"
                              }`}
                            >
                              {row.status}
                            </button>
                          </td>
                          <td className="p-4 text-center pr-6">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <button
                                onClick={() => handleEditClick(row)}
                                className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-200/50 cursor-pointer"
                                title="Edit Template"
                              >
                                <Edit className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleDuplicateTemplate(row)}
                                className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200/50 cursor-pointer"
                                title="Duplicate Template"
                              >
                                <Copy className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(row.id)}
                                className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors border border-slate-200/50 cursor-pointer"
                                title="Delete Template"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="text-xs font-bold text-slate-400">
                Showing 1 to {filteredTemplates.length} of {filteredTemplates.length} entries
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold text-slate-400 bg-white border-slate-200 hover:bg-slate-50 rounded-xl" disabled>Previous</Button>
                <Button variant="default" size="sm" className="h-9 w-9 p-0 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl">1</Button>
                <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold text-slate-400 bg-white border-slate-200 hover:bg-slate-50 rounded-xl" disabled>Next</Button>
              </div>
            </div>
          </div>

          {/* DEDUCTION SIMULATOR */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
                  <Sliders className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Period Run Simulator & Exception Log</h2>
                  <p className="text-xs text-slate-500 mt-1">Audit deduction logic and calibrate Ramadan lunar dates sighting offsets before starting monthly salary calculations.</p>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                Simulation Workspace
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Simulator settings panel */}
              <div className="lg:col-span-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 space-y-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Simulation Controls</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Simulation Year</label>
                      <select
                        value={simYear}
                        onChange={(e) => setSimYear(e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                      >
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Simulation Month</label>
                      <select
                        value={simMonth}
                        onChange={(e) => setSimMonth(e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                      >
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Ramadan calibration settings block */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Moon className="size-3.5 text-blue-600" />
                      Ramadan Moon Sighting Calibration
                    </label>
                    <select
                      value={ramadanCalibrationOffset}
                      onChange={(e) => setRamadanCalibrationOffset(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="-2">-2 days (Earlier moon sighting)</option>
                      <option value="-1">-1 day</option>
                      <option value="0">0 days (Standard Calculation)</option>
                      <option value="1">+1 day (Delayed moon sighting)</option>
                      <option value="2">+2 days</option>
                    </select>
                    <span className="text-[10px] text-slate-400 block leading-tight font-medium">Calibrate Hijri calendar offsets to match the national moon-sighting committee announcements.</span>
                  </div>

                  {RAMADAN_RANGES[Number(simYear)] && (
                    <div className="bg-amber-50/40 border border-amber-200/50 rounded-xl p-4 space-y-2 text-xs text-amber-800">
                      <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                        🌙 Ramadan Calendar for {simYear} (Calibrated):
                      </span>
                      <p className="font-bold text-amber-950 text-sm">{getCalibratedRamadanRangeDesc(Number(simYear), ramadanCalibrationOffset)}</p>
                      
                      {getRamadanOverlap(Number(simYear), simMonth, ramadanCalibrationOffset) ? (
                        <div className="flex items-start gap-1.5 text-rose-600 font-bold bg-rose-50 border border-rose-100 p-2.5 rounded-lg mt-2">
                          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                          <p className="leading-snug font-semibold">Selected month overlaps with Ramadan fasting. Ramadan-suspension rules are active.</p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-1.5 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg mt-2">
                          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                          <p className="leading-snug font-semibold">No Ramadan overlap. Templates will apply normally.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200/80 pt-5 mt-4 space-y-3.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>Applied Templates:</span>
                    <span className="font-bold text-slate-700">
                      {simResults.filter(r => !r.status.isSkipped && r.template.status === "Active").length} of {templates.filter(t => t.status === "Active").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>Excluded (Suspended):</span>
                    <span className="font-bold text-rose-600">
                      {simResults.filter(r => r.status.isSkipped && r.template.status === "Active").length}
                    </span>
                  </div>

                  <div className="bg-blue-600 text-white rounded-xl p-4 flex justify-between items-center shadow-md shadow-blue-500/10 mt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">Simulated Total</span>
                      <span className="text-xl font-extrabold font-mono">
                        ৳ {simResults
                          .filter(r => !r.status.isSkipped && r.template.status === "Active")
                          .reduce((sum, r) => {
                            // Sum evaluating flat or percentage amounts across our mock employee list
                            const totalVal = MOCK_EMPLOYEES.reduce((empSum, emp) => {
                              const amt = getEvaluatedAmount(r.template.amount, r.template.amountType, emp.basic, emp.gross);
                              return empSum + amt;
                            }, 0);
                            return sum + totalVal;
                          }, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                    <FileCheck className="size-7 opacity-80" />
                  </div>
                </div>
              </div>

              {/* Log results layout */}
              <div className="lg:col-span-8 border border-slate-200/80 rounded-2xl overflow-hidden shadow-inner bg-slate-50/20 flex flex-col">
                <div className="p-4 bg-slate-100/50 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Evaluation Log: {simMonth} {simYear}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-sans">Live Output</span>
                </div>
                
                <div className="flex-1 overflow-x-auto divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                  {simResults.map(({ template, status }) => {
                    const totalVal = MOCK_EMPLOYEES.reduce((sum, emp) => {
                      return sum + getEvaluatedAmount(template.amount, template.amountType, emp.basic, emp.gross);
                    }, 0);

                    return (
                      <div key={template.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/60 hover:bg-white transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{template.name}</span>
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{template.type}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-medium">
                            {template.amountType === "flat" ? (
                              <span>Rate: ৳{Number(template.amount).toLocaleString()} flat</span>
                            ) : (
                              <span>Rate: {template.amount}% of {template.amountType === "percent-basic" ? "Basic" : "Gross"}</span>
                            )}
                            <span>•</span>
                            <span>{template.recurrence === "one-time" ? "One-Time" : "Monthly schedule"}</span>
                            <span>•</span>
                            <span className="text-slate-500 font-bold">Estimated Audit Total (5 staff): ৳{totalVal.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="text-right font-sans">
                          {status.isSkipped ? (
                            <div className="inline-flex flex-col sm:items-end gap-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                EXCLUDED
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold block max-w-[240px] leading-tight">
                                {status.reason}
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex flex-col sm:items-end gap-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                APPLIED
                              </span>
                              <span className="text-[10px] text-emerald-600 font-bold block">
                                Will run (estimated ৳{totalVal.toLocaleString()})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SETUP DIALOG - TABBED SYSTEM */}
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="sm:max-w-4xl p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-2xl">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl shadow-xs">
                  <ClipboardList className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold text-slate-800">
                    {editingTemplate ? "Edit Deduction Template" : "Create Deduction Template"}
                  </DialogTitle>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Setup rates, dynamic percentages, target staff scopes, and exclusions.</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="px-6 pt-4 bg-white border-b border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 select-none cursor-pointer ${
                  activeTab === "general"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Tag className="size-4" />
                1. General & Targeting
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("schedule")}
                className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 select-none cursor-pointer ${
                  activeTab === "schedule"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <CalendarDays className="size-4" />
                2. Recurrence & Exclusions
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto bg-slate-50/40">
              {activeTab === "general" ? (
                /* TAB 1: GENERAL SETTINGS & TARGETING */
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Name input */}
                      <div className="sm:col-span-6 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Template Title <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          placeholder="e.g. Lunch Deduction"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-300 font-semibold"
                        />
                      </div>

                      {/* Calculation rate type */}
                      <div className="sm:col-span-3 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Deduction Method</label>
                        <select
                          value={formAmountType}
                          onChange={(e) => setFormAmountType(e.target.value as any)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans"
                        >
                          <option value="flat">Flat Amount (Tk)</option>
                          <option value="percent-basic">% of Basic Salary</option>
                          <option value="percent-gross">% of Gross Salary</option>
                        </select>
                      </div>

                      {/* Amount input */}
                      <div className="sm:col-span-3 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Deduction Rate <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                            {formAmountType === "flat" ? "৳" : "%"}
                          </span>
                          <input
                            type="number"
                            placeholder={formAmountType === "flat" ? "1200" : "1.5"}
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                            className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-8 pr-3.5 text-sm text-slate-700 font-extrabold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Deduction Type <span className="text-rose-500">*</span></label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-semibold cursor-pointer font-sans"
                        >
                          <option>---Select---</option>
                          {DEDUCTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Employee Type Filter</label>
                        <select
                          value={formEmpType}
                          onChange={(e) => setFormEmpType(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-semibold font-sans"
                        >
                          <option value="ALL">ALL Employees</option>
                          <option value="Permanent">Permanent Staff</option>
                          <option value="Contractual">Contractual Staff</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Target Group Filtering</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Department</label>
                        <select
                          value={formDepartment}
                          onChange={(e) => setFormDepartment(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-semibold font-sans"
                        >
                          <option value="All Departments">All Departments</option>
                          <option value="IT">IT Department</option>
                          <option value="HR">HR Department</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Section</label>
                        <select
                          value={formSection}
                          onChange={(e) => setFormSection(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-semibold font-sans"
                        >
                          <option value="ALL">ALL Sections</option>
                          <option value="Software">Software Section</option>
                          <option value="Networking">Networking Section</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Emp IDs (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. 2025057068"
                          value={formEmpId}
                          onChange={(e) => setFormEmpId(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Collapsible preview table inside general tab */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Preview Target Employees & Calculated Values</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-slate-200 text-xs font-bold bg-white text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                        onClick={handleFetchPreview}
                      >
                        Run Group Audit
                      </Button>
                    </div>
                    {!isPreviewLoaded ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-medium">
                        Click "Run Group Audit" to simulate which employees will be targeted and view exact calculated rates based on calculations settings.
                      </div>
                    ) : (
                      <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="text-[10px] font-bold tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 uppercase">
                            <tr>
                              <th className="px-4 py-3">Emp ID</th>
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Department</th>
                              <th className="px-4 py-3 text-right">Basic Salary</th>
                              <th className="px-4 py-3 text-right">Gross Salary</th>
                              <th className="px-4 py-3 text-right pr-6 w-36">Evaluated Deduction</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {MOCK_EMPLOYEES.map((row) => {
                              const finalVal = getEvaluatedAmount(formAmount, formAmountType, row.basic, row.gross);
                              return (
                                <tr key={row.id} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-2.5 font-bold text-slate-700">{row.empId}</td>
                                  <td className="px-4 py-2.5 font-bold text-slate-800">{row.name}</td>
                                  <td className="px-4 py-2.5 text-slate-500">{row.department}</td>
                                  <td className="px-4 py-2.5 text-right font-medium text-slate-600 font-mono">৳{row.basic.toLocaleString()}</td>
                                  <td className="px-4 py-2.5 text-right font-medium text-slate-600 font-mono">৳{row.gross.toLocaleString()}</td>
                                  <td className="px-4 py-2.5 text-right pr-6 font-extrabold text-blue-600 bg-blue-50/30 font-mono">৳{finalVal.toLocaleString()}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* TAB 2: SCHEDULING & EXCLUSIONS */
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 block">Recurrence Policy</label>
                      <div className="bg-slate-100/85 p-1 rounded-xl flex gap-1.5 w-fit border border-slate-200/50">
                        <button
                          type="button"
                          onClick={() => setFormRecurrence("monthly")}
                          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all select-none cursor-pointer ${
                            formRecurrence === "monthly"
                              ? "bg-white text-blue-600 shadow-sm border border-slate-200/40"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Clock className="size-3.5" />
                          Monthly Recurring
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormRecurrence("one-time")}
                          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all select-none cursor-pointer ${
                            formRecurrence === "one-time"
                              ? "bg-white text-blue-600 shadow-sm border border-slate-200/40"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Calendar className="size-3.5" />
                          One-Time Only
                        </button>
                      </div>
                    </div>

                    {formRecurrence === "one-time" ? (
                      /* One-Time Month/Year */
                      <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">Month</label>
                          <select
                            value={formOneTimeMonth}
                            onChange={(e) => setFormOneTimeMonth(e.target.value)}
                            className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-semibold cursor-pointer font-sans"
                          >
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">Year</label>
                          <select
                            value={formOneTimeYear}
                            onChange={(e) => setFormOneTimeYear(e.target.value)}
                            className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-semibold font-sans"
                          >
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </div>
                    ) : (
                      /* Recurring calendar exclusions */
                      <div className="space-y-5">
                        {/* Ramadan Callout */}
                        <div className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-4.5 space-y-2.5">
                          <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formExcludeRamadan}
                              onChange={(e) => setFormExcludeRamadan(e.target.checked)}
                              className="accent-amber-600 size-4.5 rounded mt-0.5 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <span className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                                🌙 Auto-Skip during Ramadan (Rojar Mash)
                              </span>
                              <span className="text-xs text-amber-700 block leading-relaxed font-medium">
                                Enable this to automatically suspend lunch or utility deductions during the variable Ramadan dates.
                              </span>
                            </div>
                          </label>

                          {formExcludeRamadan && (
                            <div className="pl-7 pt-1.5 text-[11px] text-amber-800 space-y-1 border-t border-amber-200/30">
                              <p className="font-extrabold text-amber-900 uppercase tracking-wider text-[9px]">Calculated Ramadan Month Ranges (Calibrated):</p>
                              <div className="grid grid-cols-2 gap-1 font-semibold">
                                <span>• 2025: March</span>
                                <span>• 2026: {getCalibratedRamadanRangeDesc(2026, ramadanCalibrationOffset)}</span>
                                <span>• 2027: {getCalibratedRamadanRangeDesc(2027, ramadanCalibrationOffset)}</span>
                                <span>• 2028: {getCalibratedRamadanRangeDesc(2028, ramadanCalibrationOffset)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* General Annual Calendar Month Exclusion */}
                        <div className="space-y-2">
                          <div className="space-y-0.5">
                            <label className="text-xs font-bold text-slate-600 block">
                              Annual Skip Calendar
                            </label>
                            <span className="text-[10px] text-slate-400 block font-medium">Toggle months where this deduction is suspended every year (e.g. holiday windows).</span>
                          </div>
                          
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                            {MONTHS.map((m) => {
                              const isSelected = formExcludedMonths.includes(m);
                              return (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => toggleFormExcludedMonth(m)}
                                  className={`h-9 text-xs font-bold rounded-xl border transition-all relative flex flex-col items-center justify-center select-none cursor-pointer ${
                                    isSelected
                                      ? "bg-rose-50 border-rose-300 text-rose-600 font-extrabold shadow-xs"
                                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                                  }`}
                                >
                                  <span>{m}</span>
                                  {isSelected && (
                                    <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Exclusion Tags */}
                        <div className="space-y-2">
                          <div className="space-y-0.5">
                            <label className="text-xs font-bold text-slate-600 block">
                              Single Period Exceptions
                            </label>
                            <span className="text-[10px] text-slate-400 block font-medium">Add exceptions for a single specific year/month only (e.g. suspension due to office relocation).</span>
                          </div>
                          
                          <div className="flex gap-2.5 items-end max-w-md">
                            <div className="flex-1 space-y-1">
                              <label className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Month</label>
                              <select
                                value={formExclusionMonth}
                                onChange={(e) => setFormExclusionMonth(e.target.value)}
                                className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 cursor-pointer font-sans"
                              >
                                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                            <div className="flex-1 space-y-1">
                              <label className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Year</label>
                              <select
                                value={formExclusionYear}
                                onChange={(e) => setFormExclusionYear(e.target.value)}
                                className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 cursor-pointer font-sans"
                              >
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddCustomExclusion}
                              className="bg-slate-800 text-white h-9 px-4 text-xs font-bold rounded-xl hover:bg-slate-900 border-0 transition-colors shadow-xs select-none cursor-pointer"
                            >
                              Add
                            </button>
                          </div>

                          {formCustomExcludedPeriods.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {formCustomExcludedPeriods.map((period) => {
                                const [yearStr, monthNum] = period.split("-");
                                const monthName = MONTHS[Number(monthNum) - 1];
                                return (
                                  <span
                                    key={period}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600 shadow-xs font-sans"
                                  >
                                    {monthName} {yearStr}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCustomExclusion(period)}
                                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                    >
                                      <X className="size-3" />
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 12-Month Preview Box at the bottom of Schedule Tab */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                      <Info className="size-4 text-indigo-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Dynamic Schedule Timeline Preview</h4>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 font-medium">Verify how your rules evaluate over the next 12 calendar periods (calibrated with offset):</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                      {getTimelinePreview().map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                            item.isSkipped
                              ? "bg-slate-50 border-slate-200/50 text-slate-400"
                              : "bg-emerald-50/20 border-emerald-100 text-emerald-800 font-bold"
                          }`}
                        >
                          <span className="text-[11px] font-bold block">{item.monthStr} {item.year}</span>
                          
                          {item.isSkipped ? (
                            <div className="space-y-0.5 font-sans">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-50 text-amber-600 border border-amber-100/50 uppercase tracking-wider font-sans">
                                Skipped
                              </span>
                              <span className="text-[8px] text-slate-400 font-medium block leading-none truncate max-w-full" title={item.reason}>
                                {item.reason}
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 uppercase tracking-wider font-sans">
                                Active
                              </span>
                              <span className="text-[10px] font-extrabold text-slate-800 block leading-none font-mono">
                                {formAmountType === "flat" ? `৳ ${formAmount || "0"}` : `${formAmount || "0"}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
              <div>
                {activeTab === "general" ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab("schedule")}
                    className="h-10 px-5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all flex items-center gap-1.5 border border-blue-100 cursor-pointer select-none"
                  >
                    Next Step: Recurrence
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab("general")}
                    className="h-10 px-5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer select-none"
                  >
                    Back to General
                  </button>
                )}
              </div>

              <div className="flex gap-2.5">
                <Button
                  variant="ghost"
                  className="text-slate-600 font-bold px-4 rounded-xl hover:bg-slate-100 h-10 select-none text-xs cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md h-10 px-6 rounded-xl flex items-center gap-2 select-none text-xs cursor-pointer"
                  onClick={handleSaveTemplate}
                >
                  <Save className="size-4" />
                  SAVE PROFILE
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
