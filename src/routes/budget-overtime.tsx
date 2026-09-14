import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Timer,
  Search,
  ArrowLeft,
  FileSpreadsheet,
  Save,
  Filter,
  CheckCircle2,
  RefreshCw,
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

  // Filter States (Matching Screenshot)
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
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Top Header Bar Matching Screenshot */}
        <div className="bg-[#2196f3] text-white px-5 py-3 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/" })}
              className="p-1 hover:bg-white/20 rounded-md transition"
              title="Go Back"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-base font-extrabold tracking-wide flex items-center gap-2">
              <span>OT Limit</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span>&gt;</span>
            <span>Human Resource</span>
            <span>&gt;</span>
            <span className="font-bold text-white">OT Limit</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top Filter Console Card (Exact Match to Screenshot) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end text-xs">
              {/* Year Dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              {/* Month Dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
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

              {/* Department Dropdown */}
              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs truncate"
                >
                  <option value="ALL">All Departments</option>
                  {SECTIONS_LIST.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* SHOW Button (Red outline highlighted in screenshot) */}
              <div>
                <button
                  type="button"
                  onClick={() => toast.success(`Loaded OT limit records for ${selectedMonth} ${selectedYear}.`)}
                  className="w-full h-9 px-5 bg-[#2196f3] hover:bg-[#1976d2] text-white font-extrabold text-xs rounded shadow-xs uppercase tracking-wider transition border-2 border-red-500 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  SHOW
                </button>
              </div>

              {/* EXPORT EXCEL Button (Red styling matching screenshot) */}
              <div>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="w-full h-9 px-4 bg-[#f44336] hover:bg-[#d32f2f] text-white font-extrabold text-xs rounded shadow-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5" /> EXPORT EXCEL
                </button>
              </div>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Live Table Search Header Bar */}
            <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Timer className="size-4 text-blue-600" />
                <span>Department Overtime Budget &amp; Hour Limits ({filteredBudgetItems.length} Sections)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="h-8 px-3 w-48 sm:w-64 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:border-blue-500 shadow-2xs"
                  placeholder="Filter section..."
                />
              </div>
            </div>

            {/* Data Grid Table Matching ERP Screenshot Layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700 text-[11px] whitespace-nowrap">
                    <th className="px-3 py-2.5 text-center border-r border-slate-300 dark:border-slate-700 w-12">
                      <input
                        type="checkbox"
                        checked={
                          filteredBudgetItems.length > 0 &&
                          selectedIds.size === filteredBudgetItems.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-slate-400"
                      />
                    </th>
                    <th className="px-3 py-2.5 border-r border-slate-300 dark:border-slate-700 w-20">Year</th>
                    <th className="px-3 py-2.5 border-r border-slate-300 dark:border-slate-700 w-20">Month</th>
                    <th className="px-4 py-2.5 border-r border-slate-300 dark:border-slate-700">Sections</th>
                    <th className="px-4 py-2.5 border-r border-slate-300 dark:border-slate-700 w-48 text-center">OT Hours</th>
                    <th className="px-4 py-2.5 text-right w-52">OT Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans text-xs">
                  {filteredBudgetItems.map((row, index) => {
                    const isChecked = selectedIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`transition ${
                          isChecked
                            ? "bg-blue-50/60 dark:bg-blue-950/30"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="px-3 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-center gap-1 font-mono">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectRow(row.id)}
                              className="rounded border-slate-400"
                            />
                            <span className="text-[10px] text-slate-400 font-bold">{index + 1}</span>
                          </div>
                        </td>

                        <td className="px-3 py-2 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                          {row.year}
                        </td>

                        <td className="px-3 py-2 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                          {row.month}
                        </td>

                        <td className="px-4 py-2 font-extrabold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                          {row.section}
                        </td>

                        <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="number"
                            step="0.5"
                            value={row.otHours}
                            onChange={(e) =>
                              handleValueChange(row.id, "otHours", parseFloat(e.target.value) || 0)
                            }
                            className="w-36 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs text-center outline-none focus:border-blue-500 shadow-2xs"
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
                            className="w-44 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs text-right text-emerald-600 dark:text-emerald-400 outline-none focus:border-blue-500 shadow-2xs"
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {filteredBudgetItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-slate-400 italic font-medium"
                      >
                        No department OT budget records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-bold flex flex-wrap items-center gap-4">
                <span>
                  Total OT Hours:{" "}
                  <strong className="text-blue-600 dark:text-blue-400 font-mono text-sm">
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

              <button
                type="button"
                onClick={handleSaveBudgets}
                className="h-9 px-6 bg-[#2196f3] hover:bg-[#1976d2] text-white font-extrabold text-xs rounded shadow-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
              >
                <Save className="size-4" /> SAVE OVERTIME BUDGET LIMITS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
