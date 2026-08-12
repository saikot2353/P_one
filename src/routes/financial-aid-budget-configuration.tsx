import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Banknote, ChevronRight, Plus, Settings, X, Trash2 } from "lucide-react";

export const Route = createFileRoute("/financial-aid-budget-configuration")({
  head: () => ({
    meta: [
      { title: "Financial Aid Budget Configuration — CRIPTON" },
      { name: "description", content: "Configure Financial Aid Budget Pools." },
    ],
  }),
  component: FinancialAidBudgetConfigurationPage,
});

interface AidRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  tenureMonths: number;
  amount: number;
  reason: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const defaultAidRecords: AidRecord[] = [
  {
    id: "FA-2026-01",
    employeeName: "Shakil Ahmed",
    employeeId: "2023043021",
    tenureMonths: 18,
    amount: 30000,
    reason: "Medical emergency - Hospitalization fees",
    requestDate: "2026-06-10",
    status: "Approved",
  },
  {
    id: "FA-2026-02",
    employeeName: "Salma Khatun",
    employeeId: "2023046001",
    tenureMonths: 24,
    amount: 15000,
    reason: "House repair costs due to flash flooding damages",
    requestDate: "2026-06-15",
    status: "Pending",
  },
];

function FinancialAidBudgetConfigurationPage() {
  const [records] = useState<AidRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_financial_aid");
      return saved ? JSON.parse(saved) : defaultAidRecords;
    }
    return defaultAidRecords;
  });

  const [budgetPools, setBudgetPools] = useState<{ year: number; amount: number }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_financial_aid_budgets");
      return saved ? JSON.parse(saved) : [{ year: new Date().getFullYear(), amount: 1500000 }];
    }
    return [{ year: new Date().getFullYear(), amount: 1500000 }];
  });

  const [selectedBudgetYear, setSelectedBudgetYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    localStorage.setItem("cripton_financial_aid_budgets", JSON.stringify(budgetPools));
  }, [budgetPools]);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudgetYear, setNewBudgetYear] = useState(new Date().getFullYear().toString());
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(newBudgetYear);
    const amount = parseFloat(newBudgetAmount);
    if (isNaN(year) || isNaN(amount) || amount < 0) return;

    setBudgetPools((prev) => {
      const existing = prev.find((b) => b.year === year);
      if (existing) {
        return prev.map((b) => (b.year === year ? { ...b, amount } : b));
      }
      return [...prev, { year, amount }].sort((a, b) => b.year - a.year);
    });
    setNewBudgetAmount("");
    setIsBudgetModalOpen(false);
  };

  const handleDeleteBudget = (year: number) => {
    if (confirm(`Delete budget for ${year}?`)) {
      setBudgetPools((prev) => prev.filter((b) => b.year !== year));
      if (selectedBudgetYear === year && budgetPools.length > 1) {
        setSelectedBudgetYear(budgetPools.filter((b) => b.year !== year)[0].year);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Welfare & Support</span>
                <ChevronRight className="size-2.5" />
                <span className="text-blue-600 font-semibold">Financial Aid Budget Configuration</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Banknote className="size-5.5 text-blue-600" />
                <span>Financial Aid Budget Configuration</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Configure Financial Aid corporate welfare pools for different years.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Settings className="size-5 text-slate-500" /> Budget Configurations
              </h2>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition"
              >
                <Plus className="size-3.5" />
                <span>Add Budget</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] border-b border-slate-200 whitespace-nowrap">
                    <tr>
                      <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-center w-20">
                        Year
                      </th>
                      <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">
                        Total Budget (৳)
                      </th>
                      <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">
                        Assigned (৳)
                      </th>
                      <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">
                        Distributed (৳)
                      </th>
                      <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">
                        Remaining (৳)
                      </th>
                      <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {budgetPools.map((b) => {
                      const bRecords = records.filter((r) =>
                        r.requestDate.startsWith(b.year.toString()),
                      );
                      const assigned = bRecords.reduce((sum, r) => sum + r.amount, 0);
                      const distributed = bRecords.reduce(
                        (sum, r) =>
                          r.status === "Approved"
                            ? sum + r.amount
                            : sum,
                        0,
                      );
                      const remaining = b.amount - assigned;
                      return (
                        <tr
                          key={b.year}
                          className="hover:bg-slate-50 transition-colors duration-150"
                        >
                          <td className="px-5 py-3.5 text-xs font-semibold text-slate-700 text-center">
                            {b.year}
                          </td>
                          <td className="px-5 py-3.5 text-xs font-bold text-slate-800 text-right">
                            {b.amount.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-slate-600 text-right">
                            {assigned.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-slate-600 text-right">
                            {distributed.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-slate-600 text-right">
                            {remaining.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-center flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setNewBudgetYear(b.year.toString());
                                setNewBudgetAmount(b.amount.toString());
                                setIsBudgetModalOpen(true);
                              }}
                              className="p-1 text-amber-500 hover:bg-amber-50 rounded transition-colors"
                              title="Edit"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBudget(b.year)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete budget"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {budgetPools.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-slate-400 text-sm font-medium"
                        >
                          No budgets configured
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: Configure Budget */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[20px] shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white rounded-t-[20px]">
              <div className="flex items-center gap-3">
                <div className="bg-[#0B1527] text-white size-9 rounded-full flex items-center justify-center">
                  <Settings className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Configure Financial Aid Budget</h3>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddBudget} className="flex flex-col">
              <div className="p-6 space-y-5 bg-white">
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      required
                      value={newBudgetYear}
                      onChange={(e) => setNewBudgetYear(e.target.value)}
                      className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                      Amount (৳)
                    </label>
                    <input
                      type="number"
                      required
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                      className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-200 bg-slate-50 rounded-b-[20px]">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="h-11 px-6 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="h-11 px-8 rounded-xl font-bold text-sm text-white bg-[#2563EB] hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
