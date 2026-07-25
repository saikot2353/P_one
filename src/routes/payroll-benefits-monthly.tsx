import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState, useMemo } from "react";
import {
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileDown,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  X,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Upload,
  TrendingUp,
  Coins,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/payroll-benefits-monthly")({
  head: () => ({
    meta: [
      { title: "Monthly Benefits — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage and assign monthly one-time benefit amounts for employees by type and category.",
      },
    ],
  }),
  component: MonthlyBenefitsPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface BenefitRecord {
  id: number;
  empId: string;
  empIdOff: string;
  empName: string;
  type: string;
  department: string;
  designation: string;
  unit: string;
  benefits: string;
  amount: number;
  reason: string;
  month: string;
  year: string;
  section: string;
  company: string;
  basicSalary: number;
  grossSalary: number;
  status: "Active" | "Pending" | "Inactive";
}

// ─── Master Lists ─────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = ["2024", "2025", "2026"];
const BENEFIT_TYPES = ["Added Amount", "Fixed Amount", "Percentage"];
const BENEFIT_NAMES = ["Arrear", "Conveyance Allowance", "Medical Allowance", "Food Allowance", "House Rent Allowance", "Mobile Allowance", "Internet Allowance", "Night Allowance", "Tiffin Allowance", "Performance Bonus", "Festival Bonus"];
const EMP_TYPES = ["ALL", "Office Executive", "Office Staff", "Worker"];
const DEPARTMENTS = ["ALL", "Business Automation (HR)", "Business Development", "Business Innovation", "Core Development", "Admin", "Finance", "ERP Team", "APPS Team"];
const UNITS = ["ALL", "PSL", "N/A", "General"];

// ─── Employee DB ──────────────────────────────────────────────────────────────
const EMPLOYEE_DB: Record<string, { name: string; designation: string; section: string; company: string; department: string; basicSalary: number; grossSalary: number; unit: string; type: string }> = {
  "2021028542": { name: "Zakir Hossain", designation: "Executive", section: "Implementation & Support (HR)", company: "Cripton IT Ltd.", department: "Business Automation (HR)", basicSalary: 30000, grossSalary: 50000, unit: "PSL", type: "Office Executive" },
  "2022035599": { name: "Dipon Saha", designation: "Manager", section: "Core Development (HR)", company: "Cripton IT Ltd.", department: "Business Automation (HR)", basicSalary: 40000, grossSalary: 65000, unit: "PSL", type: "Office Executive" },
  "2023043910": { name: "Tahmid Afsar", designation: "Asst. Manager", section: "Project Resource & Strategy", company: "Cripton IT Ltd.", department: "Business Innovation", basicSalary: 28000, grossSalary: 46000, unit: "N/A", type: "Office Executive" },
  "2023043974": { name: "Md. Anwar Hossain", designation: "Asst. Manager", section: "Core Sales", company: "Cripton IT Ltd.", department: "Business Development", basicSalary: 25000, grossSalary: 42000, unit: "N/A", type: "Office Executive" },
  "2023044078": { name: "Md. Anik Islam", designation: "Deputy Manager", section: "WEB-Team", company: "Cripton IT Ltd.", department: "Business Innovation", basicSalary: 35000, grossSalary: 55000, unit: "N/A", type: "Office Executive" },
  "2023046001": { name: "Sohanur Rahman Schan", designation: "Executive", section: "Admin", company: "Cripton IT Ltd.", department: "Admin", basicSalary: 22000, grossSalary: 36000, unit: "PSL", type: "Office Executive" },
  "2024049166": { name: "MD Maimoon Hossain Shomoy", designation: "Sr. Executive", section: "WEB-Team", company: "Cripton IT Ltd.", department: "Business Innovation", basicSalary: 26000, grossSalary: 43000, unit: "N/A", type: "Office Executive" },
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_RECORDS: BenefitRecord[] = [
  { id: 1, empId: "2021028542", empIdOff: "OFF-001", empName: "Zakir Hossain", type: "Office Executive", department: "Business Automation (HR)", designation: "Executive", unit: "PSL", benefits: "Arrear", amount: 5000, reason: "Q1 Arrear Settlement", month: "Jul", year: "2026", section: "Implementation & Support (HR)", company: "Cripton IT Ltd.", basicSalary: 30000, grossSalary: 50000, status: "Active" },
  { id: 2, empId: "2022035599", empIdOff: "OFF-002", empName: "Dipon Saha", type: "Office Executive", department: "Business Automation (HR)", designation: "Manager", unit: "PSL", benefits: "Medical Allowance", amount: 3000, reason: "Medical Supplement", month: "Jul", year: "2026", section: "Core Development (HR)", company: "Cripton IT Ltd.", basicSalary: 40000, grossSalary: 65000, status: "Active" },
  { id: 3, empId: "2023043910", empIdOff: "OFF-003", empName: "Tahmid Afsar", type: "Office Executive", department: "Business Innovation", designation: "Asst. Manager", unit: "N/A", benefits: "Performance Bonus", amount: 8000, reason: "Project Performance", month: "Jun", year: "2026", section: "Project Resource & Strategy", company: "Cripton IT Ltd.", basicSalary: 28000, grossSalary: 46000, status: "Pending" },
  { id: 4, empId: "2023044078", empIdOff: "OFF-004", empName: "Md. Anik Islam", type: "Office Executive", department: "Business Innovation", designation: "Deputy Manager", unit: "N/A", benefits: "Conveyance Allowance", amount: 2500, reason: "Transport Supplement", month: "Jul", year: "2026", section: "WEB-Team", company: "Cripton IT Ltd.", basicSalary: 35000, grossSalary: 55000, status: "Active" },
];

const PAGE_SIZE = 15;
const CURRENT_MONTH = "Jul";
const CURRENT_YEAR = "2026";

// ─── Form State type ──────────────────────────────────────────────────────────
interface FormState {
  empId: string;
  month: string;
  year: string;
  benefitType: string;
  benefit: string;
  amount: string;
  reason: string;
}

const EMPTY_FORM: FormState = {
  empId: "",
  month: CURRENT_MONTH,
  year: CURRENT_YEAR,
  benefitType: "Added Amount",
  benefit: "Arrear",
  amount: "",
  reason: "",
};

function MonthlyBenefitsPage() {
  // ── Filter state ──────────────────────────────────────────────────────────
  const [filterMonth, setFilterMonth] = useState(CURRENT_MONTH);
  const [filterYear, setFilterYear] = useState(CURRENT_YEAR);
  const [filterBenefitType, setFilterBenefitType] = useState("Added Amount");
  const [filterBenefit, setFilterBenefit] = useState("Arrear");
  const [filterEmpType, setFilterEmpType] = useState("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [filterUnit, setFilterUnit] = useState("ALL");
  const [filterEmpIds, setFilterEmpIds] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Applied
  const [applied, setApplied] = useState({ month: CURRENT_MONTH, year: CURRENT_YEAR, empType: "ALL", dept: "ALL", unit: "ALL", empIds: "" });

  // ── Data ──────────────────────────────────────────────────────────────────
  const [records, setRecords] = useState<BenefitRecord[]>(SEED_RECORDS);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BenefitRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<BenefitRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [toastMsg, setToastMsg] = useState("");

  // Resolve employee info from empId
  const resolvedEmp = EMPLOYEE_DB[form.empId];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({ month: filterMonth, year: filterYear, empType: filterEmpType, dept: filterDept, unit: filterUnit, empIds: filterEmpIds });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilterMonth(CURRENT_MONTH); setFilterYear(CURRENT_YEAR); setFilterBenefitType("Added Amount");
    setFilterBenefit("Arrear"); setFilterEmpType("ALL"); setFilterDept("ALL"); setFilterUnit("ALL");
    setFilterEmpIds(""); setSearchQuery(""); setCurrentPage(1);
    setApplied({ month: CURRENT_MONTH, year: CURRENT_YEAR, empType: "ALL", dept: "ALL", unit: "ALL", empIds: "" });
  };

  const openAddModal = () => { setEditingRecord(null); setForm(EMPTY_FORM); setModalOpen(true); };

  const openEditModal = (rec: BenefitRecord) => {
    setEditingRecord(rec);
    setForm({ empId: rec.empId, month: rec.month, year: rec.year, benefitType: rec.type, benefit: rec.benefits, amount: String(rec.amount), reason: rec.reason });
    setModalOpen(true);
  };

  const handleFormChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormReset = () => setForm(editingRecord ? { empId: editingRecord.empId, month: editingRecord.month, year: editingRecord.year, benefitType: editingRecord.type, benefit: editingRecord.benefits, amount: String(editingRecord.amount), reason: editingRecord.reason } : EMPTY_FORM);

  const handleSubmit = () => {
    if (!form.empId.trim() || !form.amount || !form.reason.trim()) { showToast("⚠ Please fill all required fields"); return; }
    const emp = EMPLOYEE_DB[form.empId] || { name: form.empId, designation: "—", section: "—", company: "—", department: "—", basicSalary: 0, grossSalary: 0, unit: "—", type: "—" };
    if (editingRecord) {
      setRecords((prev) => prev.map((r) => r.id === editingRecord.id ? { ...r, empId: form.empId, empName: emp.name, type: emp.type, department: emp.department, designation: emp.designation, unit: emp.unit, benefits: form.benefit, amount: parseFloat(form.amount) || 0, reason: form.reason, month: form.month, year: form.year, section: emp.section, company: emp.company, basicSalary: emp.basicSalary, grossSalary: emp.grossSalary } : r));
      showToast("✓ Benefit record updated successfully");
    } else {
      const newRec: BenefitRecord = { id: Date.now(), empId: form.empId, empIdOff: `OFF-${String(records.length + 1).padStart(3, "0")}`, empName: emp.name, type: emp.type, department: emp.department, designation: emp.designation, unit: emp.unit, benefits: form.benefit, amount: parseFloat(form.amount) || 0, reason: form.reason, month: form.month, year: form.year, section: emp.section, company: emp.company, basicSalary: emp.basicSalary, grossSalary: emp.grossSalary, status: "Pending" };
      setRecords((prev) => [newRec, ...prev]);
      showToast("✓ Benefit record added successfully");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast("✓ Record deleted");
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (applied.month && r.month !== applied.month) return false;
      if (applied.year && r.year !== applied.year) return false;
      if (applied.dept !== "ALL" && r.department !== applied.dept) return false;
      if (applied.empType !== "ALL" && r.type !== applied.empType) return false;
      if (applied.unit !== "ALL" && r.unit !== applied.unit) return false;
      if (applied.empIds.trim()) {
        const ids = applied.empIds.split(",").map((id) => id.trim().toLowerCase());
        if (!ids.some((id) => r.empId.toLowerCase().includes(id))) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!r.empName.toLowerCase().includes(q) && !r.empId.toLowerCase().includes(q) && !r.benefits.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [records, applied, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 space-y-5">

          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="bg-card rounded-xl border border-border/70 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Payroll</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Monthly Benefits</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <CalendarDays className="size-4 text-primary" />
                </div>
                Monthly Benefits
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5">Assign one-time monthly benefit amounts per employee for each period</p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <div className="bg-muted/60 border border-border/50 rounded-xl px-3.5 py-2 text-center min-w-[72px]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">Records</div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">{filtered.length}</div>
              </div>
              <div className="bg-primary/8 border border-primary/20 rounded-xl px-3.5 py-2 text-center min-w-[100px]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-primary">Total Amount</div>
                <div className="text-sm font-extrabold text-primary mt-0.5">৳{totalAmount.toLocaleString()}</div>
              </div>
              <button
                onClick={openAddModal}
                className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <Plus className="size-4" /> New Benefit
              </button>
            </div>
          </div>

          {/* ── Filter Panel ─────────────────────────────────────────── */}
          <form onSubmit={handleApplyFilters} className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 p-5">
              {/* Month */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Month</label>
                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition">
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Year</label>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition">
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Benefit Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Benefit Type</label>
                <select value={filterBenefitType} onChange={(e) => setFilterBenefitType(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition">
                  {BENEFIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Benefit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Benefits</label>
                <select value={filterBenefit} onChange={(e) => setFilterBenefit(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition">
                  {BENEFIT_NAMES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Employee Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Employee Type</label>
                <select value={filterEmpType} onChange={(e) => setFilterEmpType(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition">
                  {EMP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Department</label>
                <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition">
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Unit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Unit</label>
                <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition">
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              {/* Employee ID */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Employee ID</label>
                <input
                  type="text"
                  value={filterEmpIds}
                  onChange={(e) => setFilterEmpIds(e.target.value)}
                  placeholder="Use comma as separator"
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                />
              </div>
            </div>

            {/* Filter action row */}
            <div className="px-5 pb-4 flex items-center gap-2">
              <button type="submit" className="h-8 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xs transition flex items-center gap-1.5">
                <Search className="size-3.5" /> Search
              </button>
              <button type="button" onClick={handleReset} className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/50 text-xs font-semibold text-muted-foreground transition">
                <X className="size-3.5" /> Reset
              </button>
              <button type="button" onClick={() => alert("Import benefits from file...")} className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-xs font-semibold text-rose-600 transition ml-auto">
                <Upload className="size-3.5" /> Import
              </button>
            </div>
          </form>

          {/* ── Table Panel ──────────────────────────────────────────── */}
          <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">

            {/* Toolbar */}
            <div className="px-5 py-3 border-b border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button onClick={() => alert("Exporting Excel...")} className="h-8 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel
                </button>
                <button onClick={() => window.print()} className="h-8 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition">
                  <Printer className="size-3.5 text-primary" /> Print
                </button>
                <button onClick={() => alert("Exporting PDF...")} className="h-8 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition">
                  <FileDown className="size-3.5 text-rose-500" /> PDF
                </button>
              </div>
              <div className="relative">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search name, ID, or benefit..."
                  className="h-8 w-52 pl-8 pr-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground/70 border-b border-border/40">
                    <th className="px-4 py-3 whitespace-nowrap w-24">Actions</th>
                    <th className="px-4 py-3 whitespace-nowrap">Emp ID</th>
                    <th className="px-4 py-3 whitespace-nowrap">Emp ID (Off)</th>
                    <th className="px-4 py-3 whitespace-nowrap min-w-[160px]">Employee Name</th>
                    <th className="px-4 py-3 whitespace-nowrap">Type</th>
                    <th className="px-4 py-3 whitespace-nowrap min-w-[160px]">Department</th>
                    <th className="px-4 py-3 whitespace-nowrap">Designation</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">Unit</th>
                    <th className="px-4 py-3 whitespace-nowrap">Benefits</th>
                    <th className="px-4 py-3 whitespace-nowrap text-right">Amount (৳)</th>
                    <th className="px-4 py-3 whitespace-nowrap min-w-[140px]">Reason</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {paginated.map((rec, idx) => (
                    <tr key={rec.id} className={idx % 2 === 0 ? "bg-card hover:bg-muted/20 transition-colors" : "bg-muted/10 hover:bg-muted/25 transition-colors"}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setViewRecord(rec); setViewModalOpen(true); }}
                            className="size-6 flex items-center justify-center rounded-md hover:bg-primary/10 text-primary transition"
                            title="View"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(rec)}
                            className="size-6 flex items-center justify-center rounded-md hover:bg-amber-500/10 text-amber-500 transition"
                            title="Edit"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="size-6 flex items-center justify-center rounded-md hover:bg-rose-500/10 text-rose-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-mono font-semibold text-foreground/90">{rec.empId}</td>
                      <td className="px-4 py-2.5 text-muted-foreground/70 font-mono text-[11px]">{rec.empIdOff}</td>
                      <td className="px-4 py-2.5 font-semibold text-foreground">{rec.empName}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{rec.type}</td>
                      <td className="px-4 py-2.5 text-muted-foreground/90">{rec.department}</td>
                      <td className="px-4 py-2.5 text-muted-foreground/80">{rec.designation}</td>
                      <td className="px-4 py-2.5 text-center font-mono text-muted-foreground/70">{rec.unit}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-[10px] font-bold">{rec.benefits}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-foreground">
                        {rec.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground/80 max-w-[140px] truncate" title={rec.reason}>{rec.reason}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={["inline-block px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wide",
                          rec.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : rec.status === "Pending" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        ].join(" ")}>{rec.status}</span>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={12} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                          <CalendarDays className="size-10 opacity-20" />
                          <p className="text-sm font-semibold">No benefits data found</p>
                          <p className="text-xs">Apply filters and search, or add a new record</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="px-5 py-3.5 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground font-semibold">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-7 w-7 flex items-center justify-center rounded-lg border border-border/50 disabled:opacity-30 hover:bg-muted/50 transition">
                  <ChevronLeft className="size-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p); return acc;
                  }, [])
                  .map((p, i) => p === "..." ? (
                    <span key={`el-${i}`} className="px-1 text-muted-foreground text-xs">…</span>
                  ) : (
                    <button key={p} onClick={() => setCurrentPage(p as number)} className={["h-7 min-w-[28px] px-1.5 rounded-lg text-[11px] font-bold transition", currentPage === p ? "bg-primary text-primary-foreground shadow-xs" : "border border-border/50 hover:bg-muted/50 text-muted-foreground"].join(" ")}>{p}</button>
                  ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-7 w-7 flex items-center justify-center rounded-lg border border-border/50 disabled:opacity-30 hover:bg-muted/50 transition">
                  <ChevronRightIcon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAB (floating add button) ─────────────────────────────── */}
        <button
          onClick={openAddModal}
          className="fixed bottom-6 right-6 size-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 z-30"
          title="Add Monthly Benefit"
        >
          <Plus className="size-5" />
        </button>
      </main>

      {/* ════════════════════════════════════════════════════════════
          ADD / EDIT MODAL
      ════════════════════════════════════════════════════════════ */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[780px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-border/40">
            <DialogTitle className="text-lg font-bold text-foreground/85">
              {editingRecord ? "Edit Monthly Benefit" : "Monthly Benefits"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editingRecord ? "Edit existing monthly benefit record" : "Create a new monthly benefit entry for an employee"}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ── Left: Form ─────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Employee ID */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-primary">
                  Employee ID <span className="text-rose-500">*</span>
                </Label>
                <input
                  type="text"
                  value={form.empId}
                  onChange={(e) => handleFormChange("empId", e.target.value)}
                  placeholder="Enter Employee ID..."
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition"
                />
              </div>

              {/* Date: Year + Month */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">
                  Date (Year, Month) <span className="text-rose-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <select
                    value={form.year}
                    onChange={(e) => handleFormChange("year", e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  >
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select
                    value={form.month}
                    onChange={(e) => handleFormChange("month", e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  >
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Benefit Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">Benefit Type</Label>
                <select
                  value={form.benefitType}
                  onChange={(e) => handleFormChange("benefitType", e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                >
                  {BENEFIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Benefits */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">Benefits</Label>
                <select
                  value={form.benefit}
                  onChange={(e) => handleFormChange("benefit", e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                >
                  {BENEFIT_NAMES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">
                  Amount <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-xs font-bold select-none">৳</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={form.amount}
                    onChange={(e) => handleFormChange("amount", e.target.value)}
                    placeholder="0"
                    className="w-full h-9 pl-7 pr-3 rounded-lg bg-background border border-border/60 text-xs font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition"
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">
                  Reason <span className="text-rose-500">*</span>
                </Label>
                <textarea
                  value={form.reason}
                  onChange={(e) => handleFormChange("reason", e.target.value)}
                  placeholder="Enter reason for this benefit..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* ── Right: Employee Info Panel ──────────────────────── */}
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60 mb-3">Employee Information</p>
              {[
                { label: "Employee Name", value: resolvedEmp?.name },
                { label: "Designation", value: resolvedEmp?.designation },
                { label: "Section", value: resolvedEmp?.section },
                { label: "Company", value: resolvedEmp?.company },
                { label: "Basic Salary", value: resolvedEmp ? `৳${resolvedEmp.basicSalary.toLocaleString()}` : undefined },
                { label: "Gross Salary", value: resolvedEmp ? `৳${resolvedEmp.grossSalary.toLocaleString()}` : undefined },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                  <span className="text-xs font-semibold text-muted-foreground/80 min-w-[110px]">{label}</span>
                  <span className="text-xs font-bold text-foreground text-right">
                    {value ?? (
                      form.empId
                        ? <span className="text-rose-400 font-semibold text-[11px]">ID not found</span>
                        : <span className="text-muted-foreground/30 font-normal">—</span>
                    )}
                  </span>
                </div>
              ))}

              {/* Info hint */}
              {!resolvedEmp && form.empId && (
                <div className="mt-4 p-3 rounded-lg bg-amber-500/8 border border-amber-500/20">
                  <p className="text-[11px] text-amber-600 font-semibold">
                    Employee not found in the system. Please verify the Employee ID.
                  </p>
                </div>
              )}
              {!form.empId && (
                <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border/30">
                  <p className="text-[11px] text-muted-foreground/70">
                    Enter an Employee ID on the left to auto-fill employee details here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border/40 bg-muted/10 sm:justify-between">
            <DialogClose asChild>
              <button type="button" className="h-9 px-5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition">
                CLOSE
              </button>
            </DialogClose>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleFormReset} className="h-9 px-4 rounded-lg border border-border/60 hover:bg-muted/50 text-xs font-black uppercase tracking-wider text-muted-foreground transition flex items-center gap-1.5">
                <RotateCcw className="size-3.5" /> RESET
              </button>
              <button type="button" onClick={handleSubmit} className="h-9 px-6 rounded-lg bg-[#7CB342] hover:bg-[#689f38] text-white text-xs font-black uppercase tracking-wider transition">
                {editingRecord ? "UPDATE" : "SUBMIT"}
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════
          VIEW MODAL
      ════════════════════════════════════════════════════════════ */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-border/40">
            <DialogTitle className="text-lg font-bold text-foreground/85 flex items-center gap-2">
              <Eye className="size-4.5 text-primary" />
              Benefit Record Details
            </DialogTitle>
            <DialogDescription className="sr-only">View benefit record details</DialogDescription>
          </DialogHeader>
          {viewRecord && (
            <div className="p-6 space-y-3">
              {[
                { label: "Employee ID", value: viewRecord.empId },
                { label: "Employee Name", value: viewRecord.empName },
                { label: "Designation", value: viewRecord.designation },
                { label: "Department", value: viewRecord.department },
                { label: "Section", value: viewRecord.section },
                { label: "Unit", value: viewRecord.unit },
                { label: "Period", value: `${viewRecord.month} ${viewRecord.year}` },
                { label: "Benefit Type", value: viewRecord.type },
                { label: "Benefit", value: viewRecord.benefits },
                { label: "Amount", value: `৳${viewRecord.amount.toLocaleString()}` },
                { label: "Reason", value: viewRecord.reason },
                { label: "Basic Salary", value: `৳${viewRecord.basicSalary.toLocaleString()}` },
                { label: "Gross Salary", value: `৳${viewRecord.grossSalary.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border/25 last:border-0">
                  <span className="text-xs font-semibold text-muted-foreground/80 min-w-[130px]">{label}</span>
                  <span className="text-xs font-bold text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter className="p-4 border-t border-border/40 bg-muted/10">
            <DialogClose asChild>
              <button type="button" className="h-9 px-5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition">
                CLOSE
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Toast ────────────────────────────────────────────────── */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-card border border-primary/25 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 max-w-sm">
          <div className="size-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-3.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
