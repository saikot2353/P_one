import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Timer,
  Search,
  ChevronRight,
  FileSpreadsheet,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/budget-overtime")({
  head: () => ({
    meta: [
      { title: "OT Limit & Overtime Budget — CRIPTON HRIS" },
      {
        name: "description",
        content: "Department-wise overtime hours limits and financial budget configuration.",
      },
    ],
  }),
  component: BudgetOvertimePage,
});

export interface DepartmentOTBudget {
  id: string;
  year: string;
  month: string;
  section: string;
  otHours: number;
  otAmount: number;
}

const SECTIONS_LIST = [
  "Accessories Store (MCD)",
  "Accessories Store 1",
  "Accounts",
  "Accounts & Finance",
  "Admin",
  "Admin and Compliance",
  "Admin and Compliiance",
  "Administration",
  "All over Printing",
  "Audit",
  "Brand and Media",
  "Business Automation",
  "Business Automation (HR)",
  "Business Development",
  "Business Innovation",
  "CAD",
  "Canteen",
  "Civil Engineering",
  "Commercial",
  "Commercial, Procurement and Supply Chain",
  "Core Development",
  "CSR",
  "Cutting",
  "Database Administrator (DBA)",
  "Designing",
  "e-Governance",
  "Embroidery",
  "EMS",
  "ENORSIA",
  "Fabric Dyeing",
  "Fabrics Department",
  "Finishing Department",
  "HR, Admin and Compliance",
  "Human Resources",
  "I.C.T.",
  "IE & Planning",
  "Implementation & Business Analysis",
  "Industrial Engineering (I.E.)",
  "Information and Communication Technology",
  "Internal Audit",
  "Knitting",
  "Maintenance",
  "Maintenance (RMG)",
  "Management",
  "Marketing",
  "Marketing and Merchandising",
  "Marketing and Technical",
  "Material Control Department",
  "Merchandinsing Supply chain",
  "Merchandising Supply Chain",
  "MIS",
  "Operation & Marketing",
  "Planning Sourcing",
  "Print and Emblishment",
  "Procurement and Supply Chain",
  "Product Management",
  "Production Audit",
  "Production Planning",
  "Project Resource & Strategy",
  "Quality Assurance Department",
  "Recycling Management",
  "Research and Development",
  "RMG Operations",
  "Sample",
  "Sample & CAD",
  "Sewing",
  "Supply Chain",
  "Technical Operation",
  "Technology",
  "Vat & Tax",
  "VAT & TAX",
  "Washing",
  "Worker",
  "WTP",
  "Yarn Dyeing",
  "Yarn Dyeing (Production)",
];

const initialBudgetData: DepartmentOTBudget[] = SECTIONS_LIST.map((sec, idx) => {
  let defaultAmount = 0;
  let defaultHours = 0;

  if (sec === "Accessories Store (MCD)") {
    defaultAmount = 225620.0;
    defaultHours = 0.0;
  } else if (sec === "Accessories Store 1") {
    defaultAmount = 150000.0;
    defaultHours = 0.0;
  } else if (sec === "Cutting") {
    defaultAmount = 85000.0;
    defaultHours = 48.0;
  } else if (sec === "Finishing Department") {
    defaultAmount = 95000.0;
    defaultHours = 52.0;
  } else if (sec === "Sewing") {
    defaultAmount = 250000.0;
    defaultHours = 72.0;
  } else if (sec === "Human Resources") {
    defaultAmount = 45000.0;
    defaultHours = 30.0;
  } else if (sec === "I.C.T.") {
    defaultAmount = 35000.0;
    defaultHours = 25.0;
  } else if (sec === "Industrial Engineering (I.E.)") {
    defaultAmount = 60000.0;
    defaultHours = 40.0;
  } else if (sec === "Knitting") {
    defaultAmount = 110000.0;
    defaultHours = 50.0;
  } else if (sec === "Maintenance (RMG)") {
    defaultAmount = 135000.0;
    defaultHours = 65.0;
  } else if (sec === "Marketing and Merchandising") {
    defaultAmount = 75000.0;
    defaultHours = 45.0;
  } else if (sec === "Quality Assurance Department") {
    defaultAmount = 70000.0;
    defaultHours = 48.0;
  } else if (sec === "Washing") {
    defaultAmount = 90000.0;
    defaultHours = 55.0;
  } else if (sec === "Yarn Dyeing") {
    defaultAmount = 80000.0;
    defaultHours = 50.0;
  }

  return {
    id: `OT-BUDGET-${idx + 1}`,
    year: "2026",
    month: "Sep",
    section: sec,
    otHours: defaultHours,
    otAmount: defaultAmount,
  };
});

function BudgetOvertimePage() {
  const navigate = useNavigate();

  // Load / Persist OT Budgets
  const [budgetItems, setBudgetItems] = useState<DepartmentOTBudget[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_ot_dept_budgets");
      return saved ? JSON.parse(saved) : initialBudgetData;
    }
    return initialBudgetData;
  });

  useEffect(() => {
    localStorage.setItem("cripton_ot_dept_budgets", JSON.stringify(budgetItems));
  }, [budgetItems]);

  // Filter States
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Sep");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [tableSearch, setTableSearch] = useState("");

  // Checkbox Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtered Budget Items
  const filteredBudgetItems = useMemo(() => {
    return budgetItems.filter((item) => {
      if (selectedYear && item.year !== selectedYear) return false;
      if (selectedMonth && item.month !== selectedMonth) return false;
      if (selectedDept !== "ALL" && item.section !== selectedDept) return false;
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        return (
          item.section.toLowerCase().includes(q) ||
          item.year.toLowerCase().includes(q) ||
          item.month.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [budgetItems, selectedYear, selectedMonth, selectedDept, tableSearch]);

  // Total Summary
  const totals = useMemo(() => {
    const totalHours = filteredBudgetItems.reduce((acc, curr) => acc + (curr.otHours || 0), 0);
    const totalAmount = filteredBudgetItems.reduce((acc, curr) => acc + (curr.otAmount || 0), 0);
    return { totalHours, totalAmount };
  }, [filteredBudgetItems]);

  // Handle Row Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredBudgetItems.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Inline Value Change Handlers
  const handleValueChange = (id: string, field: "otHours" | "otAmount", val: number) => {
    setBudgetItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    if (filteredBudgetItems.length === 0) {
      toast.error("No budget items to export!");
      return;
    }
    const headers = ["#", "Year", "Month", "Sections / Department", "OT Hours Limit", "OT Amount Budget (BDT)"];
    const rows = filteredBudgetItems.map((r, i) => [
      i + 1,
      r.year,
      r.month,
      `"${r.section}"`,
      r.otHours.toFixed(2),
      r.otAmount.toFixed(2),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Overtime_Department_Budget_${selectedYear}_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Overtime Budget Excel exported successfully!");
  };

  // Save Handlers
  const handleSaveBudgets = () => {
    localStorage.setItem("cripton_ot_dept_budgets", JSON.stringify(budgetItems));
    toast.success("Department Overtime Budget limits updated & saved successfully!");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 space-y-5">
          {/* Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">OT Limit</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                  <Timer className="size-5.5 text-primary" />
                </div>
                <span>Department Overtime Limit & Budget</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportExcel}
                className="h-10 px-4 bg-muted hover:bg-muted/80 active:scale-[0.98] text-foreground font-extrabold text-xs rounded-xl shadow-xs transition duration-150 flex items-center gap-1.5 uppercase border border-border"
              >
                <FileSpreadsheet className="size-4 text-emerald-500" />
                <span>Export</span>
              </button>
              <button
                onClick={handleSaveBudgets}
                className="h-10 px-4 bg-primary hover:bg-primary-glow hover:shadow-primary/15 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-xs transition duration-150 flex items-center gap-1.5 uppercase"
              >
                <Save className="size-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2">
            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none cursor-pointer focus:border-primary transition"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none cursor-pointer focus:border-primary transition"
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                    (m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none cursor-pointer focus:border-primary transition truncate"
                >
                  <option value="ALL">All Departments</option>
                  {SECTIONS_LIST.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => toast.success(`Loaded OT limit records for ${selectedMonth} ${selectedYear}.`)}
                  className="w-full h-9 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition duration-200"
                >
                  Load Records
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/40">
              <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                Department Overtime Limits ({filteredBudgetItems.length} records)
              </span>
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search department..."
                  className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold transition duration-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-border/50 rounded-xl shadow-3xs max-h-[50vh]">
              <table className="min-w-[900px] w-full border-collapse text-[10.5px] text-left">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-slate-800/20 text-slate-800 dark:text-slate-250 font-black border-b border-slate-200 dark:border-slate-800/80">
                    <th className="px-4 py-3 font-extrabold w-12 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredBudgetItems.length > 0 &&
                          selectedIds.size === filteredBudgetItems.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-slate-400 accent-primary"
                      />
                    </th>
                    <th className="px-4 py-3 font-extrabold w-20">Year</th>
                    <th className="px-4 py-3 font-extrabold w-20">Month</th>
                    <th className="px-4 py-3 font-extrabold">Sections</th>
                    <th className="px-4 py-3 font-extrabold text-center w-48">OT Hours</th>
                    <th className="px-4 py-3 font-extrabold text-right w-52">OT Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredBudgetItems.map((row, index) => {
                    const isChecked = selectedIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`transition ${
                          isChecked
                            ? "bg-primary/5"
                            : "hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                        }`}
                      >
                        <td className="px-4 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(row.id)}
                            className="rounded border-slate-400 accent-primary"
                          />
                        </td>

                        <td className="px-4 py-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {row.year}
                        </td>

                        <td className="px-4 py-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {row.month}
                        </td>

                        <td className="px-4 py-2.5 font-extrabold text-foreground">
                          {row.section}
                        </td>

                        <td className="px-4 py-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            value={row.otHours}
                            onChange={(e) =>
                              handleValueChange(row.id, "otHours", parseFloat(e.target.value) || 0)
                            }
                            className="w-36 h-8 px-2.5 rounded-lg bg-muted border border-border/40 font-mono font-bold text-xs text-center outline-none focus:border-primary transition"
                          />
                        </td>

                        <td className="px-4 py-2 text-right">
                          <input
                            type="number"
                            step="100"
                            value={row.otAmount}
                            onChange={(e) =>
                              handleValueChange(row.id, "otAmount", parseFloat(e.target.value) || 0)
                            }
                            className="w-44 h-8 px-2.5 rounded-lg bg-muted border border-border/40 font-mono font-bold text-xs text-right text-emerald-600 dark:text-emerald-400 outline-none focus:border-primary transition"
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {filteredBudgetItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-16 text-center text-muted-foreground font-bold"
                      >
                        No department OT budget records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground font-bold flex flex-wrap items-center gap-4">
                <span>
                  Total OT Hours:{" "}
                  <strong className="text-primary font-mono text-sm">
                    {totals.totalHours.toFixed(2)} hrs
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Total Allocated OT Budget:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    ৳ {totals.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
