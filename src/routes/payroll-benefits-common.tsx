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
} from "lucide-react";

export const Route = createFileRoute("/payroll-benefits-common")({
  head: () => ({
    meta: [
      { title: "Common Benefits — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Assign and manage common benefit amounts for employees by type, department, and benefit category.",
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

const PAGE_SIZE = 15;

function CommonBenefitsPage() {
  // ── Filters ──────────────────────────────────────────────────────────────
  const [empType, setEmpType] = useState("Office Executive");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");
  const [benefitType, setBenefitType] = useState("Added Amount");
  const [benefit, setBenefit] = useState("Conveyance Allowance");
  const [status, setStatus] = useState("Working");

  const [appliedFilters, setAppliedFilters] = useState({
    empType: "Office Executive",
    department: "All Departments",
    section: "ALL",
    empIdInput: "",
    status: "Working",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Employee data with editable amounts ──────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>(SEED_EMPLOYEES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({ empType, department, section, empIdInput, status });
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleReset = () => {
    setEmpType("Office Executive");
    setDepartment("All Departments");
    setSection("ALL");
    setEmpIdInput("");
    setBenefitType("Added Amount");
    setBenefit("Conveyance Allowance");
    setStatus("Working");
    setAppliedFilters({ empType: "Office Executive", department: "All Departments", section: "ALL", empIdInput: "", status: "Working" });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      if (appliedFilters.department !== "All Departments" && emp.department !== appliedFilters.department) return false;
      if (appliedFilters.section !== "ALL" && emp.section !== appliedFilters.section) return false;
      if (appliedFilters.empType && emp.empType !== appliedFilters.empType) return false;
      if (appliedFilters.status && emp.status !== appliedFilters.status) return false;
      if (appliedFilters.empIdInput.trim()) {
        const ids = appliedFilters.empIdInput.split(",").map((id) => id.trim().toLowerCase());
        if (!ids.some((id) => emp.empId.toLowerCase().includes(id))) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !emp.name.toLowerCase().includes(q) &&
          !emp.empId.toLowerCase().includes(q) &&
          !emp.designation.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [employees, appliedFilters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalWithAmount = filtered.filter((e) => e.amount > 0).length;
  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const updateAmount = (empId: string, value: string) => {
    const num = parseFloat(value.replace(/,/g, "")) || 0;
    setEmployees((prev) =>
      prev.map((e) => (e.empId === empId ? { ...e, amount: num } : e))
    );
    setIsSaved(false);
  };

  const toggleSelect = (empId: string) => {
    setSelectedIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const toggleSelectAll = () => {
    const pageIds = paginated.map((e) => e.empId);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter((id) => !pageIds.includes(id)) : [...new Set([...selectedIds, ...pageIds])]);
  };

  const handleSave = () => {
    setIsSaved(true);
    showToast(`✓ Benefits saved for ${selectedIds.length || filtered.length} employees (${benefit})`);
  };

  const pageIds = paginated.map((e) => e.empId);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected = pageIds.some((id) => selectedIds.includes(id));

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 space-y-5">

          {/* ── Page Header ──────────────────────────────────────────── */}
          <div className="bg-card rounded-xl border border-border/70 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
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
                Common Benefits
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5">
                Assign benefit amounts to employees by type, department, and benefit category
              </p>
            </div>

            {/* Stats chips */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <div className="bg-muted/60 border border-border/50 rounded-xl px-3.5 py-2 text-center min-w-[80px]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">Employees</div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">{filtered.length}</div>
              </div>
              <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-3.5 py-2 text-center min-w-[80px]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Assigned</div>
                <div className="text-sm font-extrabold text-emerald-600 mt-0.5">{totalWithAmount}</div>
              </div>
              <div className="bg-primary/8 border border-primary/20 rounded-xl px-3.5 py-2 text-center min-w-[100px]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-primary">Total Amount</div>
                <div className="text-sm font-extrabold text-primary mt-0.5">৳{totalAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* ── Filter Panel ─────────────────────────────────────────── */}
          <form
            onSubmit={handleSearch}
            className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden"
          >
            <div className="px-5 py-2.5 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <Filter className="size-3.5 text-primary" />
              <span className="text-[11px] font-black uppercase tracking-widest text-primary">Filters</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    Employee Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={empType}
                    onChange={(e) => setEmpType(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  >
                    {EMP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  >
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    Section <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  >
                    {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1 lg:col-span-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    Emp ID <span className="text-muted-foreground/50 normal-case font-normal">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={empIdInput}
                    onChange={(e) => setEmpIdInput(e.target.value)}
                    placeholder="e.g. 2021028542, 2022035599"
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Benefit Type</label>
                  <select
                    value={benefitType}
                    onChange={(e) => setBenefitType(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  >
                    {BENEFIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Benefits</label>
                  <select
                    value={benefit}
                    onChange={(e) => setBenefit(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  >
                    {BENEFIT_NAMES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  >
                    <option value="Working">Working</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="flex-1 h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Search className="size-3.5" />
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="h-9 w-9 flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted/50 text-muted-foreground transition"
                    title="Reset filters"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* ── Active Benefit Badge ──────────────────────────────────── */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Benefit:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-bold">
              <Gift className="size-3" />
              {benefit}
              <span className="text-primary/60">·</span>
              {benefitType}
            </span>
          </div>

          {/* ── Table Panel ──────────────────────────────────────────── */}
          <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">

            {/* Toolbar */}
            <div className="px-5 py-3 border-b border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Exporting to Excel...")}
                  className="h-8 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  Excel
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition"
                >
                  <Printer className="size-3.5 text-primary" />
                  Print
                </button>
                <button
                  onClick={() => alert("Exporting PDF...")}
                  className="h-8 px-3.5 flex items-center gap-1.5 rounded-lg border border-border/60 hover:bg-muted/60 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition"
                >
                  <FileDown className="size-3.5 text-rose-500" />
                  PDF
                </button>

                {selectedIds.length > 0 && (
                  <span className="ml-1 text-[10px] font-bold text-primary">
                    {selectedIds.length} selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {/* Inline search */}
                <div className="relative">
                  <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search name or ID..."
                    className="h-8 w-44 pl-8 pr-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xs transition flex items-center gap-1.5"
                >
                  <Save className="size-3.5" />
                  Save
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground/70 border-b border-border/40">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                        onChange={toggleSelectAll}
                        className="rounded border-border/50 text-primary focus:ring-primary/20 size-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">Emp ID</th>
                    <th className="px-4 py-3 whitespace-nowrap min-w-[160px]">Name</th>
                    <th className="px-4 py-3 whitespace-nowrap">Emp Type</th>
                    <th className="px-4 py-3 whitespace-nowrap min-w-[180px]">Department</th>
                    <th className="px-4 py-3 whitespace-nowrap">Designation</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">Join Date</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">Status</th>
                    <th className="px-4 py-3 whitespace-nowrap text-right w-[140px]">Amount (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {paginated.map((emp, idx) => {
                    const isSelected = selectedIds.includes(emp.empId);
                    return (
                      <tr
                        key={emp.empId}
                        className={[
                          "transition-colors duration-100 group",
                          isSelected
                            ? "bg-primary/5 border-l-2 border-l-primary"
                            : idx % 2 === 0
                            ? "bg-card hover:bg-muted/30"
                            : "bg-muted/10 hover:bg-muted/30",
                        ].join(" ")}
                      >
                        <td className="px-4 py-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(emp.empId)}
                            className="rounded border-border/50 text-primary focus:ring-primary/20 size-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-2.5 font-mono font-semibold text-foreground/90">
                          {emp.empId}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-foreground">{emp.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{emp.empType}</td>
                        <td className="px-4 py-2.5 text-muted-foreground/90">{emp.department}</td>
                        <td className="px-4 py-2.5 text-muted-foreground/80">{emp.designation}</td>
                        <td className="px-4 py-2.5 text-center font-mono text-muted-foreground/70">
                          {emp.joinDate}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span
                            className={[
                              "inline-block px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wide",
                              emp.status === "Working"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : emp.status === "On Leave"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 border border-rose-500/20",
                            ].join(" ")}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-muted-foreground/50 text-[11px] font-bold select-none">৳</span>
                            <input
                              type="number"
                              min="0"
                              step="500"
                              value={emp.amount || ""}
                              onChange={(e) => updateAmount(emp.empId, e.target.value)}
                              placeholder="0"
                              className={[
                                "w-full h-7 pl-6 pr-2 rounded-md text-right text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-primary/30",
                                emp.amount > 0
                                  ? "bg-primary/5 border border-primary/25 text-primary focus:border-primary/50"
                                  : "bg-muted/40 border border-border/40 text-foreground focus:border-primary/50",
                              ].join(" ")}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                          <Gift className="size-10 opacity-20" />
                          <p className="text-sm font-semibold">No employees found</p>
                          <p className="text-xs">Try adjusting the filters and searching again</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            <div className="px-5 py-3.5 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground font-semibold">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
                {selectedIds.length > 0 && (
                  <span className="text-primary ml-2">· {selectedIds.length} selected</span>
                )}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 flex items-center justify-center rounded-lg border border-border/50 disabled:opacity-30 hover:bg-muted/50 transition"
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
                          "h-7 min-w-[28px] px-1.5 rounded-lg text-[11px] font-bold transition",
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
                  className="h-7 w-7 flex items-center justify-center rounded-lg border border-border/50 disabled:opacity-30 hover:bg-muted/50 transition"
                >
                  <ChevronRightIcon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
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
