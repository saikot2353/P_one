import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Target,
  Plus,
  Save,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Filter,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  ChevronDown,
} from "lucide-react";
import {
  MarketingPerformanceRepository,
  MarketingTargetPlan,
  BuyerTargetRecord,
  calculateTargetFobExtra,
  KNOWN_HODS,
  MasterBuyerItem,
  getBuyerMasterList,
  getMappedHODForBuyer,
} from "../../lib/marketing-performance-data";

interface SearchableBuyerSelectProps {
  value: string;
  onChange: (buyerName: string) => void;
  masterList: MasterBuyerItem[];
}

function SearchableBuyerSelect({ value, onChange, masterList }: SearchableBuyerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return masterList;
    const q = query.toLowerCase();
    return masterList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.hod && m.hod.toLowerCase().includes(q))
    );
  }, [masterList, query]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => {
          setIsOpen((prev) => !prev);
          setQuery("");
        }}
        className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-teal-500 transition shadow-sm"
      >
        <span className={`truncate font-semibold ${value ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}`}>
          {value || "Select Buyer..."}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-72 max-w-[90vw] z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search Buyer name or HOD..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const isSelected = item.name.toLowerCase() === value.toLowerCase();
                return (
                  <button
                    key={item.id || item.name}
                    type="button"
                    onClick={() => {
                      onChange(item.name);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                      isSelected
                        ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div>
                      <span className="block font-medium">{item.name}</span>
                      {item.hod ? (
                        <span className="text-[10px] text-teal-600 dark:text-teal-400">
                          HOD: {item.hod}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">HOD: Unassigned</span>
                      )}
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400 italic">
                No buyers found matching "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function MarketingTargetPlanningView() {
  const [selectedYear, setSelectedYear] = useState<number>(2027);
  const [plan, setPlan] = useState<MarketingTargetPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHodFilter, setSelectedHodFilter] = useState("ALL");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Load plan on year change
  useEffect(() => {
    const loaded = MarketingPerformanceRepository.getTargetPlan(selectedYear);
    setPlan(loaded);
    setIsDirty(false);
  }, [selectedYear]);

  // Master lists
  const availableYears = MarketingPerformanceRepository.getAvailableYears();
  const availableHODs = MarketingPerformanceRepository.getAvailableHODs();
  const masterBuyers = useMemo(() => getBuyerMasterList(), []);

  // Handle plan header update
  const handlePlanNameChange = (name: string) => {
    if (!plan) return;
    setPlan({ ...plan, planName: name });
    setIsDirty(true);
  };

  const handleStatusChange = (status: "Draft" | "Active" | "Approved") => {
    if (!plan) return;
    setPlan({ ...plan, status });
    setIsDirty(true);
  };

  // Handle Buyer row updates with automatic HOD mapping
  const handleRowChange = (
    id: string,
    field: "buyer" | "targetQty" | "targetFob",
    value: any
  ) => {
    if (!plan) return;
    const updatedBuyers = plan.buyers.map((b) => {
      if (b.id !== id) return b;
      const updated = { ...b, [field]: value };
      if (field === "buyer") {
        updated.buyer = value;
        const autoHod = getMappedHODForBuyer(value);
        updated.hod = autoHod || "";
      } else if (field === "targetFob") {
        const num = value === "" || value === null ? null : Number(value);
        updated.targetFob = isNaN(num as any) ? null : num;
        updated.targetFobExtra = calculateTargetFobExtra(updated.targetFob);
      } else if (field === "targetQty") {
        const num = value === "" || value === null ? null : Number(value);
        updated.targetQty = isNaN(num as any) ? null : num;
      }
      return updated;
    });

    setPlan({ ...plan, buyers: updatedBuyers });
    setIsDirty(true);
  };

  // Add new buyer row with blank / unassigned HOD
  const handleAddBuyerRow = () => {
    if (!plan) return;
    const newId = `rec-${plan.year}-${Date.now().toString(36)}`;
    const newRecord: BuyerTargetRecord = {
      id: newId,
      buyer: "",
      hod: "",
      targetQty: null,
      targetFob: null,
      targetFobExtra: null,
      achievements: {
        jan: { achieveQty: null, achieveFob: null },
        feb: { achieveQty: null, achieveFob: null },
        mar: { achieveQty: null, achieveFob: null },
        apr: { achieveQty: null, achieveFob: null },
        may: { achieveQty: null, achieveFob: null },
        jun: { achieveQty: null, achieveFob: null },
        jul: { achieveQty: null, achieveFob: null },
        aug: { achieveQty: null, achieveFob: null },
        sep: { achieveQty: null, achieveFob: null },
        oct: { achieveQty: null, achieveFob: null },
        nov: { achieveQty: null, achieveFob: null },
        dec: { achieveQty: null, achieveFob: null },
      },
    };
    setPlan({
      ...plan,
      buyers: [newRecord, ...plan.buyers],
    });
    setIsDirty(true);
    setNotification({
      type: "info",
      message: "New buyer row added at top. Please select Buyer and enter monthly target amounts.",
    });
  };

  // Delete buyer row
  const handleDeleteBuyerRow = (id: string, buyerName: string) => {
    if (!plan) return;
    if (confirm(`Remove target entry for "${buyerName || "unnamed buyer"}"?`)) {
      setPlan({
        ...plan,
        buyers: plan.buyers.filter((b) => b.id !== id),
      });
      setIsDirty(true);
    }
  };

  // Save plan
  const handleSavePlan = () => {
    if (!plan) return;

    // Check duplicate buyers
    const buyerNames = plan.buyers
      .map((b) => b.buyer.trim().toLowerCase())
      .filter(Boolean);
    const duplicates = buyerNames.filter((item, index) => buyerNames.indexOf(item) !== index);
    if (duplicates.length > 0) {
      setNotification({
        type: "error",
        message: `Duplicate Buyer entries detected: "${duplicates.join(", ")}". Please consolidate duplicate rows.`,
      });
      return;
    }

    const updatedPlan: MarketingTargetPlan = {
      ...plan,
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    MarketingPerformanceRepository.saveTargetPlan(updatedPlan);
    setPlan(updatedPlan);
    setIsDirty(false);
    setNotification({
      type: "success",
      message: `Marketing Target Plan for year ${plan.year} saved successfully. Monthly baselines updated.`,
    });
  };

  // Reset to original seed baseline
  const handleResetToBaseline = () => {
    if (confirm(`Reset ${selectedYear} plan back to original business Excel reference baseline?`)) {
      const resetPlan = MarketingPerformanceRepository.resetPlanToSeed(selectedYear);
      setPlan(resetPlan);
      setIsDirty(false);
      setNotification({
        type: "info",
        message: `Plan reset to original Excel reference baseline (${selectedYear}).`,
      });
    }
  };

  // Filtered buyers
  const filteredBuyers = useMemo(() => {
    if (!plan) return [];
    return plan.buyers.filter((b) => {
      if (selectedHodFilter !== "ALL" && b.hod !== selectedHodFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          b.buyer.toLowerCase().includes(q) || b.hod.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [plan, selectedHodFilter, searchTerm]);

  // Aggregated totals
  const totals = useMemo(() => {
    if (!plan)
      return {
        count: 0,
        monthlyQty: 0,
        monthlyFob: 0,
        monthlyExtra: 0,
        annualQty: 0,
        annualFob: 0,
        annualExtra: 0,
      };

    let monthlyQty = 0;
    let monthlyFob = 0;
    let monthlyExtra = 0;

    plan.buyers.forEach((b) => {
      if (b.targetQty) monthlyQty += b.targetQty;
      if (b.targetFob) monthlyFob += b.targetFob;
      if (b.targetFobExtra) monthlyExtra += b.targetFobExtra;
    });

    return {
      count: plan.buyers.length,
      monthlyQty,
      monthlyFob,
      monthlyExtra,
      annualQty: monthlyQty * 12,
      annualFob: monthlyFob * 12,
      annualExtra: monthlyExtra * 12,
    };
  }, [plan]);

  if (!plan) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading Marketing Target Plan...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Marketing & Merchandising</span>
            <span>/</span>
            <span>Marketing Planning & Performance</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Marketing Target Planning</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Marketing Target Planning</span>
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                plan.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : plan.status === "Approved"
                  ? "bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800"
                  : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {plan.status}
            </span>
            {isDirty && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium">
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleAddBuyerRow}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
          >
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Add Buyer</span>
          </button>
          <button
            type="button"
            onClick={handleSavePlan}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Target Plan</span>
          </button>
        </div>
      </div>

      {/* Global Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
              : notification.type === "error"
              ? "bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
              : "bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {notification.type === "error" && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {notification.type === "info" && <Info className="w-4 h-4 shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
          >
            ×
          </button>
        </div>
      )}

      {/* Form Header Configuration Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {/* Target Year Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Financial / Calendar Year {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Target Plan Name */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Plan Name
            </label>
            <input
              type="text"
              value={plan.planName}
              onChange={(e) => handlePlanNameChange(e.target.value)}
              placeholder="e.g. Annual Marketing Target Plan — 2027"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Plan Status
            </label>
            <select
              value={plan.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Informational Guidance Notice */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>
              Target Qty & FOB entered below represent the <strong>recurring monthly baseline</strong> for each Buyer.
              Target FOB with 15% Extra is computed automatically (`Target FOB × 1.15`).
            </span>
          </div>
          <span className="font-mono text-slate-400">
            Last Updated: {plan.lastUpdated}
          </span>
        </div>
      </div>

      {/* KPI Cards: Monthly Recurring vs Annual Projections */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Configured Buyers
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 block font-mono">
            {totals.count}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">6 Strategic HODs</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Monthly Target Qty
          </span>
          <span className="text-lg font-bold text-teal-700 dark:text-teal-400 mt-1 block font-mono">
            {totals.monthlyQty.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Pcs / Month</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Monthly Base FOB $
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 block font-mono">
            ${totals.monthlyFob.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Monthly Baseline</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Monthly FOB (+15%)
          </span>
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1 block font-mono">
            ${totals.monthlyExtra.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">+15% Extra Margin</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Yearly Target Qty (×12)
          </span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1 block font-mono">
            {totals.annualQty.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">12 Months Total</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Yearly Base FOB (×12)
          </span>
          <span className="text-lg font-bold text-teal-800 dark:text-teal-300 mt-1 block font-mono">
            ${totals.annualFob.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Annual FOB Projection</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Buyer or HOD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter HOD:</span>
          <select
            value={selectedHodFilter}
            onChange={(e) => setSelectedHodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
          >
            <option value="ALL">All HODs (6)</option>
            {availableHODs.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-mono ml-2">
            Showing {filteredBuyers.length} of {plan.buyers.length}
          </span>
        </div>
      </div>

      {/* Buyer-Wise Target Entry Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3.5 py-3 w-12 text-center">SL</th>
                <th className="px-3.5 py-3 min-w-[220px]">Buyer</th>
                <th className="px-3.5 py-3 min-w-[130px]">HOD</th>
                <th className="px-3.5 py-3 text-right min-w-[150px]">
                  Target Qty <span className="text-[10px] text-slate-400 font-normal">(Monthly)</span>
                </th>
                <th className="px-3.5 py-3 text-right min-w-[160px]">
                  Target FOB $ <span className="text-[10px] text-slate-400 font-normal">(Base)</span>
                </th>
                <th className="px-3.5 py-3 text-right min-w-[170px] bg-teal-50/50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300">
                  Target FOB with 15% Extra <span className="text-[10px] font-normal">(Calculated)</span>
                </th>
                <th className="px-3.5 py-3 text-right min-w-[160px] font-semibold text-slate-700 dark:text-slate-300">
                  Annual Quantity (×12)
                </th>
                <th className="px-3.5 py-3 text-right min-w-[150px] text-slate-400 font-normal">
                  Annual Projection (×12)
                </th>
                <th className="px-3 py-3 w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredBuyers.length > 0 ? (
                filteredBuyers.map((b, idx) => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition group"
                  >
                    <td className="px-3.5 py-2.5 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    {/* Buyer Searchable Dropdown */}
                    <td className="px-3.5 py-2">
                      <SearchableBuyerSelect
                        value={b.buyer}
                        onChange={(val) => handleRowChange(b.id, "buyer", val)}
                        masterList={masterBuyers}
                      />
                    </td>

                    {/* HOD Auto-Filled (Read-only / Non-editable) */}
                    <td className="px-3.5 py-2">
                      <div
                        className={`w-full px-2.5 py-1.5 rounded-md border text-xs font-semibold select-none ${
                          b.hod
                            ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            : "border-dashed border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 italic"
                        }`}
                        title={b.hod ? `Assigned HOD: ${b.hod}` : "No HOD assigned to this buyer"}
                      >
                        {b.hod || "Unassigned"}
                      </div>
                    </td>

                    {/* Target Qty */}
                    <td className="px-3.5 py-2 text-right">
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={b.targetQty !== null && b.targetQty !== undefined ? b.targetQty : ""}
                        onChange={(e) => handleRowChange(b.id, "targetQty", e.target.value)}
                        placeholder="Unassigned"
                        className="w-full px-2.5 py-1.5 text-right font-mono text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      />
                    </td>

                    {/* Target FOB $ */}
                    <td className="px-3.5 py-2 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs font-mono">$</span>
                        <input
                          type="number"
                          min="0"
                          step="5000"
                          value={b.targetFob !== null && b.targetFob !== undefined ? b.targetFob : ""}
                          onChange={(e) => handleRowChange(b.id, "targetFob", e.target.value)}
                          placeholder="Unassigned"
                          className="w-full pl-6 pr-2.5 py-1.5 text-right font-mono text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                    </td>

                    {/* Target FOB with 15% Extra (Read-only Calculated) */}
                    <td className="px-3.5 py-2 text-right bg-teal-50/30 dark:bg-teal-950/10">
                      <span className="font-mono font-bold text-teal-800 dark:text-teal-300 block text-xs">
                        {b.targetFobExtra !== null && b.targetFobExtra !== undefined
                          ? `$${b.targetFobExtra.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                          : "—"}
                      </span>
                      {b.targetFob && (
                        <span className="text-[10px] text-teal-600/70 dark:text-teal-400/60 block font-mono">
                          +${Math.round(b.targetFob * 0.15).toLocaleString()} extra
                        </span>
                      )}
                    </td>

                    {/* Annual Quantity (x12) Column (Read-only Calculated = Target Qty * 12) */}
                    <td className="px-3.5 py-2 text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {b.targetQty !== null && b.targetQty !== undefined
                        ? (b.targetQty * 12).toLocaleString()
                        : "—"}
                    </td>

                    {/* Annual Projection (Read-only preview) */}
                    <td className="px-3.5 py-2 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {b.targetFob ? `$${(b.targetFob * 12).toLocaleString()}` : "—"}
                    </td>

                    {/* Action */}
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteBuyerRow(b.id, b.buyer)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition opacity-80 group-hover:opacity-100"
                        title="Delete Buyer row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-xs text-slate-400 italic">
                    No buyers match the current filter or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Footer with Totals */}
            <tfoot className="bg-slate-100 dark:bg-slate-800/90 font-bold text-slate-900 dark:text-slate-100 border-t-2 border-slate-300 dark:border-slate-700">
              <tr>
                <td colSpan={3} className="px-3.5 py-3 text-right uppercase tracking-wider text-xs">
                  Monthly Baseline Total ({filteredBuyers.length} Buyers):
                </td>
                <td className="px-3.5 py-3 text-right font-mono text-xs text-teal-700 dark:text-teal-300">
                  {totals.monthlyQty.toLocaleString()} Pcs
                </td>
                <td className="px-3.5 py-3 text-right font-mono text-xs">
                  ${totals.monthlyFob.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </td>
                <td className="px-3.5 py-3 text-right font-mono text-xs bg-teal-100/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200">
                  ${totals.monthlyExtra.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </td>
                <td className="px-3.5 py-3 text-right font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  {totals.annualQty.toLocaleString()} Pcs
                </td>
                <td className="px-3.5 py-3 text-right font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  ${totals.annualFob.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
