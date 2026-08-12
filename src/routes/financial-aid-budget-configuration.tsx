import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Banknote, ChevronRight, Settings } from "lucide-react";

export const Route = createFileRoute("/financial-aid-budget-configuration")({
  head: () => ({
    meta: [
      { title: "Financial Aid Budget Configuration — CRIPTON" },
      { name: "description", content: "Configure Financial Aid Budget Pool." },
    ],
  }),
  component: FinancialAidBudgetConfigurationPage,
});

function FinancialAidBudgetConfigurationPage() {
  const [budgetPool, setBudgetPool] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_financial_aid_budget");
      return saved ? parseFloat(saved) : 1500000;
    }
    return 1500000;
  });

  const [tempBudgetInput, setTempBudgetInput] = useState(budgetPool.toString());

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(tempBudgetInput);
    if (!isNaN(parsed) && parsed >= 0) {
      setBudgetPool(parsed);
      localStorage.setItem("cripton_financial_aid_budget", parsed.toString());
      alert("Budget updated successfully!");
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
                Configure the corporate welfare fund pool.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Settings className="size-5 text-slate-500" /> Budget Configuration
            </h2>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-md">
               <form onSubmit={handleUpdateBudget} className="space-y-5 text-sm">
                  <div className="space-y-2">
                    <label className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                      Allocated Corporate Welfare Fund (৳) *
                    </label>
                    <input
                      type="number"
                      required
                      value={tempBudgetInput}
                      onChange={(e) => setTempBudgetInput(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-background outline-none focus:border-blue-500 border border-border/60 font-black text-xl shadow-sm transition text-blue-600"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-md"
                    >
                      Save Pool
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
