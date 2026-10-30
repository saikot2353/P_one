import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Coins,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  Lock,
  ArrowLeft,
  X,
  UploadCloud,
  TrendingUp,
  History,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";

export interface CurrencySetup {
  id: string;
  code: string;
  country: string;
  displayCode: string;
  name: string;
  symbol: string;
  decimalPlace: number;
  subunit: string;
  commaFormat: string;
}

export interface CurrencyRate {
  id: string;
  currencyId: string;
  rate: number;
  effectiveDate: string;
  isBase: boolean;
  scheduledRate?: {
    rate: number;
    effectiveDate: string;
  };
}

export interface RateHistoryItem {
  id: string;
  currencyId: string;
  rate: number;
  effectiveDate: string;
  createdAt: string;
}

export interface CurrencySetupViewProps {
  embedded?: boolean;
  onBackToOverview?: () => void;
}

const DEFAULT_SETUPS: CurrencySetup[] = [
  { id: "c1", code: "BDT", country: "Bangladesh", displayCode: "BDT-Bangladesh", name: "Bangladeshi Taka", symbol: "৳", decimalPlace: 2, subunit: "Poisa", commaFormat: "12,34,56,789" },
  { id: "c2", code: "USD", country: "United States", displayCode: "USD-United States", name: "US Dollar", symbol: "$", decimalPlace: 2, subunit: "Cent", commaFormat: "1,234,567,890" },
  { id: "c3", code: "EUR", country: "Eurozone", displayCode: "EUR-Eurozone", name: "Euro", symbol: "€", decimalPlace: 2, subunit: "Cent", commaFormat: "1.234.567.890" },
  { id: "c4", code: "GBP", country: "United Kingdom", displayCode: "GBP-United Kingdom", name: "British Pound", symbol: "£", decimalPlace: 2, subunit: "Penny", commaFormat: "1,234,567,890" },
  { id: "c5", code: "JPY", country: "Japan", displayCode: "JPY-Japan", name: "Japanese Yen", symbol: "¥", decimalPlace: 0, subunit: "Sen", commaFormat: "1,234,567,890" },
  { id: "c6", code: "CAD", country: "Canada", displayCode: "CAD-Canada", name: "Canadian Dollar", symbol: "C$", decimalPlace: 2, subunit: "Cent", commaFormat: "1,234,567,890" },
  { id: "c7", code: "AUD", country: "Australia", displayCode: "AUD-Australia", name: "Australian Dollar", symbol: "A$", decimalPlace: 2, subunit: "Cent", commaFormat: "1,234,567,890" },
  { id: "c8", code: "CHF", country: "Switzerland", displayCode: "CHF-Switzerland", name: "Swiss Franc", symbol: "CHF", decimalPlace: 2, subunit: "Rappen", commaFormat: "1,234,567,890" },
  { id: "c9", code: "CNY", country: "China", displayCode: "CNY-China", name: "Chinese Yuan Renminbi", symbol: "¥", decimalPlace: 2, subunit: "Fen", commaFormat: "1,234,567,890" },
  { id: "c10", code: "INR", country: "India", displayCode: "INR-India", name: "Indian Rupee", symbol: "₹", decimalPlace: 2, subunit: "Paisa", commaFormat: "12,34,56,789" },
  { id: "c11", code: "AED", country: "United Arab Emirates", displayCode: "AED-UAE", name: "UAE Dirham", symbol: "د.إ", decimalPlace: 2, subunit: "Fils", commaFormat: "1,234,567,890" },
  { id: "c12", code: "SAR", country: "Saudi Arabia", displayCode: "SAR-Saudi Arabia", name: "Saudi Riyal", symbol: "﷼", decimalPlace: 2, subunit: "Halala", commaFormat: "1,234,567,890" },
  { id: "c13", code: "SGD", country: "Singapore", displayCode: "SGD-Singapore", name: "Singapore Dollar", symbol: "S$", decimalPlace: 2, subunit: "Cent", commaFormat: "1,234,567,890" },
  { id: "c14", code: "MYR", country: "Malaysia", displayCode: "MYR-Malaysia", name: "Malaysian Ringgit", symbol: "RM", decimalPlace: 2, subunit: "Sen", commaFormat: "1,234,567,890" },
];

const DEFAULT_RATES: CurrencyRate[] = [
  { id: "r1", currencyId: "c1", rate: 1, effectiveDate: "2026-09-29", isBase: true },
  { id: "r2", currencyId: "c2", rate: 120.4, effectiveDate: "2026-09-29", isBase: false },
  { id: "r3", currencyId: "c3", rate: 132.8, effectiveDate: "2026-09-29", isBase: false },
  { id: "r4", currencyId: "c4", rate: 163.24, effectiveDate: "2026-09-29", isBase: false },
  { id: "r5", currencyId: "c5", rate: 0.81, effectiveDate: "2026-09-29", isBase: false },
  { id: "r6", currencyId: "c6", rate: 89.15, effectiveDate: "2026-09-29", isBase: false },
  { id: "r7", currencyId: "c7", rate: 81.3, effectiveDate: "2026-09-29", isBase: false },
  { id: "r8", currencyId: "c8", rate: 138.5, effectiveDate: "2026-09-29", isBase: false },
  { id: "r9", currencyId: "c9", rate: 17.15, effectiveDate: "2026-09-29", isBase: false },
  { id: "r10", currencyId: "c10", rate: 1.44, effectiveDate: "2026-09-29", isBase: false },
  { id: "r11", currencyId: "c11", rate: 32.78, effectiveDate: "2026-09-29", isBase: false },
  { id: "r12", currencyId: "c12", rate: 32.1, effectiveDate: "2026-09-29", isBase: false },
  { id: "r13", currencyId: "c13", rate: 93.4, effectiveDate: "2026-09-29", isBase: false },
  { id: "r14", currencyId: "c14", rate: 27.65, effectiveDate: "2026-09-29", isBase: false },
];

function formatNumber(num: number, commaFormat: string, decimals: number = 4): string {
  if (num === undefined || num === null || isNaN(num)) return "0.0000";
  return num.toFixed(decimals);
}

export function CurrencySetupView({
  embedded = false,
  onBackToOverview,
}: CurrencySetupViewProps) {
  // Currencies state from localStorage
  const [setups, setSetups] = useState<CurrencySetup[]>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem("accounts:currencies");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETUPS;
  });

  // Rates state from localStorage
  const [rates, setRates] = useState<CurrencyRate[]>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem("accounts:currency_rates");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_RATES;
  });

  // Persist
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("accounts:currencies", JSON.stringify(setups));
      }
    } catch (e) {
      console.error(e);
    }
  }, [setups]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("accounts:currency_rates", JSON.stringify(rates));
      }
    } catch (e) {
      console.error(e);
    }
  }, [rates]);

  // Rate Map
  const ratesMap = useMemo(() => {
    const map = new Map<string, CurrencyRate>();
    rates.forEach((r) => map.set(r.currencyId, r));
    return map;
  }, [rates]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Base" | "NonBase">("All");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  // Modals state
  const [isNewCurrencyModalOpen, setIsNewCurrencyModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CurrencySetup | null>(null);
  const [rateModalTarget, setRateModalTarget] = useState<{
    setup: CurrencySetup;
    rate?: CurrencyRate;
  } | null>(null);
  const [historyTarget, setHistoryTarget] = useState<CurrencySetup | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Filtered Currencies
  const filteredSetups = useMemo(() => {
    return setups.filter((c) => {
      const rate = ratesMap.get(c.id);
      const isBase = !!rate?.isBase;

      if (filterType === "Base" && !isBase) return false;
      if (filterType === "NonBase" && isBase) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [setups, ratesMap, filterType, searchQuery]);

  // Set Base Currency Handler
  const handleSetBase = (currencyId: string) => {
    const targetSetup = setups.find((c) => c.id === currencyId);
    if (!targetSetup) return;

    setRates((prev) =>
      prev.map((r) => {
        if (r.currencyId === currencyId) {
          return { ...r, isBase: true, rate: 1.0 };
        }
        return { ...r, isBase: false };
      })
    );
    toast.success(`Base currency switched to ${targetSetup.code} (${targetSetup.name}).`);
  };

  // Upsert Rate Handler
  const handleUpsertRate = (currencyId: string, newRate: number, effectiveDate: string) => {
    const today = new Date().toISOString().split("T")[0];
    const isFuture = effectiveDate > today;

    setRates((prev) => {
      const existing = prev.find((r) => r.currencyId === currencyId);
      if (existing) {
        if (isFuture) {
          return prev.map((r) =>
            r.currencyId === currencyId
              ? { ...r, scheduledRate: { rate: newRate, effectiveDate } }
              : r
          );
        } else {
          return prev.map((r) =>
            r.currencyId === currencyId
              ? { ...r, rate: newRate, effectiveDate, scheduledRate: undefined }
              : r
          );
        }
      } else {
        const newEntry: CurrencyRate = {
          id: `r-${Date.now()}`,
          currencyId,
          rate: newRate,
          effectiveDate,
          isBase: false,
        };
        return [...prev, newEntry];
      }
    });

    const setup = setups.find((s) => s.id === currencyId);
    toast.success(`Exchange rate for ${setup?.code || "currency"} updated to ${newRate}.`);
    setRateModalTarget(null);
  };

  // Save Currency (Create or Update)
  const handleSaveCurrency = (data: Omit<CurrencySetup, "id" | "displayCode">, initialRate: number, effectiveDate: string) => {
    if (editingCurrency) {
      setSetups((prev) =>
        prev.map((c) =>
          c.id === editingCurrency.id
            ? {
                ...c,
                ...data,
                displayCode: `${data.code}-${data.country}`,
              }
            : c
        )
      );
      toast.success(`Currency "${data.code}" updated successfully.`);
    } else {
      if (setups.some((c) => c.code.toUpperCase() === data.code.toUpperCase())) {
        toast.error(`Currency "${data.code}" already exists!`);
        return;
      }
      const newId = `c-${Date.now().toString(36)}`;
      const newSetup: CurrencySetup = {
        ...data,
        id: newId,
        displayCode: `${data.code}-${data.country}`,
      };
      setSetups((prev) => [...prev, newSetup]);

      const newRate: CurrencyRate = {
        id: `r-${Date.now()}`,
        currencyId: newId,
        rate: initialRate > 0 ? initialRate : 1.0,
        effectiveDate: effectiveDate || new Date().toISOString().split("T")[0],
        isBase: false,
      };
      setRates((prev) => [...prev, newRate]);
      toast.success(`Currency "${data.code}" created successfully.`);
    }
    setIsNewCurrencyModalOpen(false);
    setEditingCurrency(null);
  };

  // Delete Currency
  const handleDeleteCurrency = (id: string) => {
    const setup = setups.find((c) => c.id === id);
    const rate = ratesMap.get(id);
    if (rate?.isBase) {
      toast.error("Cannot delete the active Base currency. Set another currency as Base first.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${setup?.code} (${setup?.name})?`)) {
      setSetups((prev) => prev.filter((c) => c.id !== id));
      setRates((prev) => prev.filter((r) => r.currencyId !== id));
      toast.success(`Currency ${setup?.code} deleted.`);
    }
  };

  // Bulk update rates
  const handleBulkUpdate = (updatedRates: Record<string, { rate: number; effectiveDate: string }>) => {
    setRates((prev) =>
      prev.map((r) => {
        const update = updatedRates[r.currencyId];
        if (update && !r.isBase) {
          return {
            ...r,
            rate: update.rate,
            effectiveDate: update.effectiveDate,
            scheduledRate: undefined,
          };
        }
        return r;
      })
    );
    toast.success("All currency exchange rates updated successfully.");
    setIsBulkModalOpen(false);
  };

  const rowPadding = density === "comfortable" ? "py-2.5" : "py-1.5";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-20">
      {/* Top Header & Breadcrumb (Exact replica of OJ) */}
      <div className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
            <span>Home</span>
            <ChevronRight className="size-3 text-muted-foreground/40" />
            <span>Accounts Configuration</span>
            <ChevronRight className="size-3 text-muted-foreground/40" />
            <span className="text-primary font-black">Currency Setup</span>
          </div>

          {embedded && onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Master Overview</span>
            </button>
          )}
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-indigo-50 border border-indigo-200/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-2xs">
              <Coins className="size-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <span>Currency Setup</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {setups.length} Currencies
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Manage configured currencies, base currency rules, and daily exchange rates.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <UploadCloud className="size-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Bulk Upload / Update</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingCurrency(null);
                setIsNewCurrencyModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>+ New Currency</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card (Exact replica of $Ze) */}
      <div className="space-y-3">
        {/* Search & Filter Header */}
        <div className="bg-card border border-border/80 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by code, country, or currency name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-border/80 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
              <Filter className="size-3 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
              >
                <option value="All">All Currencies</option>
                <option value="Base">Base Currency Only</option>
                <option value="NonBase">Foreign Currencies</option>
              </select>
            </div>

            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setDensity("comfortable")}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                  density === "comfortable" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Comfortable
              </button>
              <button
                type="button"
                onClick={() => setDensity("compact")}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                  density === "compact" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Compact
              </button>
            </div>
          </div>
        </div>

        {/* Currency Table */}
        <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/40 border-b border-border/80 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                <tr>
                  <th className="py-2.5 px-4 font-black">Currency Name</th>
                  <th className="py-2.5 px-4 font-black text-right w-44">Exchange Rate</th>
                  <th className="py-2.5 px-4 font-bold min-w-[190px] w-48">Effective Date</th>
                  <th className="py-2.5 px-4 font-bold w-20 text-center">History</th>
                  <th className="py-2.5 px-4 font-bold min-w-[140px] text-center whitespace-nowrap">Base Currency</th>
                  <th className="py-2.5 px-4 font-bold w-16 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredSetups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <Coins className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm font-semibold">No currencies configured</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Add your organization's base currency and foreign trading currencies.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSetups.map((setup) => {
                    const rateObj = ratesMap.get(setup.id);
                    const isBase = !!rateObj?.isBase;
                    const scheduled = rateObj?.scheduledRate;

                    return (
                      <tr
                        key={setup.id}
                        className={`border-b border-border/40 transition-colors text-xs hover:bg-muted/15 ${
                          isBase ? "border-l-4 border-l-amber-500 bg-amber-500/[0.03]" : ""
                        }`}
                      >
                        {/* Currency Name & Info */}
                        <td className={`px-4 ${rowPadding}`}>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-foreground text-sm font-mono tracking-tight">
                                {setup.code}
                              </span>
                              <span className="text-muted-foreground font-semibold">
                                ({setup.symbol})
                              </span>
                            </div>
                            {isBase && (
                              <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                BASE
                              </span>
                            )}
                            <span className="text-[11px] text-muted-foreground/70 hidden sm:inline truncate max-w-[160px]">
                              • {setup.name} ({setup.country})
                            </span>
                          </div>
                        </td>

                        {/* Exchange Rate */}
                        <td className={`px-4 ${rowPadding} text-right`}>
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {isBase ? (
                              <div
                                title="Base currency exchange rate is locked to 1.00"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/30 border border-border/50 text-foreground font-mono font-bold text-xs tabular-nums select-none"
                              >
                                <Lock className="size-3 text-muted-foreground/70" />
                                <span>1.0000</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setRateModalTarget({ setup, rate: rateObj })}
                                title="Click to open exchange rate update modal"
                                className="group inline-flex flex-col items-end gap-0.5 px-2.5 py-1 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/80 transition-all font-mono font-bold text-xs tabular-nums text-foreground cursor-pointer text-right"
                              >
                                <div className="inline-flex items-center gap-1.5">
                                  <span>{formatNumber(rateObj?.rate || 0, setup.commaFormat, setup.decimalPlace || 4)}</span>
                                  <Edit2 className="size-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </div>
                                {scheduled && (
                                  <span className="text-[9.5px] font-medium text-amber-600 dark:text-amber-400 font-sans tracking-tight">
                                    Next: {formatNumber(scheduled.rate, setup.commaFormat, setup.decimalPlace || 4)}
                                  </span>
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Effective Date */}
                        <td className={`px-4 ${rowPadding} text-muted-foreground font-mono text-[11px]`}>
                          <div className="inline-flex flex-col items-start gap-0.5">
                            <div className="inline-flex items-center gap-1.5 text-foreground font-semibold">
                              <Calendar className="size-3 text-muted-foreground/70 shrink-0" />
                              <span>{rateObj?.effectiveDate || "—"}</span>
                            </div>
                            {scheduled && (
                              <div className="inline-flex items-center gap-1 text-[9.5px] font-sans font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded-full">
                                <Clock className="size-2.5" />
                                <span>Starts {scheduled.effectiveDate}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* History Action */}
                        <td className={`px-4 ${rowPadding} text-center`}>
                          <button
                            type="button"
                            onClick={() => setHistoryTarget(setup)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold transition-colors cursor-pointer border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                            title="View archive history"
                          >
                            <History className="size-3" />
                            <span>Logs</span>
                          </button>
                        </td>

                        {/* Base Currency Toggle */}
                        <td className={`px-4 ${rowPadding} text-center`}>
                          {isBase ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                              <CheckCircle2 className="size-3" />
                              <span>Active Base</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetBase(setup.id)}
                              className="px-2 py-0.5 rounded-md text-[10.5px] font-bold text-muted-foreground hover:text-foreground border border-border/60 hover:bg-muted transition cursor-pointer"
                            >
                              Set as Base
                            </button>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className={`px-4 ${rowPadding} text-right`}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCurrency(setup);
                                setIsNewCurrencyModalOpen(true);
                              }}
                              title="Edit Currency Details"
                              className="p-1.5 rounded-lg border border-border/60 hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-muted-foreground hover:text-indigo-600 transition cursor-pointer shadow-2xs"
                            >
                              <Edit2 className="size-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCurrency(setup.id)}
                              title="Delete Currency"
                              disabled={isBase}
                              className="p-1.5 rounded-lg border border-border/60 hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-muted-foreground hover:text-rose-600 transition cursor-pointer shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed"
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
        </div>
      </div>

      {/* Modal: Update Exchange Rate (Exact replica of ZZe) */}
      {rateModalTarget && (
        <UpdateRateModal
          isOpen={!!rateModalTarget}
          onClose={() => setRateModalTarget(null)}
          setup={rateModalTarget.setup}
          rate={rateModalTarget.rate}
          onSave={(newRate, effDate) =>
            handleUpsertRate(rateModalTarget.setup.id, newRate, effDate)
          }
        />
      )}

      {/* Modal: Create / Edit Currency (Exact replica of qZe / HF) */}
      <CurrencyModal
        isOpen={isNewCurrencyModalOpen}
        onClose={() => {
          setIsNewCurrencyModalOpen(false);
          setEditingCurrency(null);
        }}
        onSubmit={handleSaveCurrency}
        initialSetup={editingCurrency}
      />

      {/* Drawer: Rate Archive History (Exact replica of VZe) */}
      {historyTarget && (
        <RateHistoryDrawer
          isOpen={!!historyTarget}
          onClose={() => setHistoryTarget(null)}
          currency={historyTarget}
          currentRate={ratesMap.get(historyTarget.id)?.rate || 1.0}
        />
      )}

      {/* Modal: Bulk Update Rates (Exact replica of GZe) */}
      <BulkUpdateRatesModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        setups={setups}
        ratesMap={ratesMap}
        onSave={handleBulkUpdate}
      />
    </div>
  );
}

// Modal: Update Exchange Rate (ZZe)
interface UpdateRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  setup: CurrencySetup;
  rate?: CurrencyRate;
  onSave: (rate: number, effectiveDate: string) => void;
}

function UpdateRateModal({ isOpen, onClose, setup, rate, onSave }: UpdateRateModalProps) {
  const [val, setVal] = useState(rate?.rate?.toString() || "1.00");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (rate) {
      setVal(rate.rate.toString());
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [rate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(val);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Please enter a valid exchange rate.");
      return;
    }
    onSave(parsed, date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-border shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Update Exchange Rate</h4>
              <p className="text-[11px] text-muted-foreground">{setup.code} ({setup.name})</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Exchange Rate (vs 1 Base Unit) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              required
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Effective Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
            <p className="text-[10px] text-muted-foreground">Setting a future date schedules this rate automatically.</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Update Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal: Currency Definition (HF / qZe)
interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CurrencySetup, "id" | "displayCode">, rate: number, effectiveDate: string) => void;
  initialSetup: CurrencySetup | null;
}

function CurrencyModal({ isOpen, onClose, onSubmit, initialSetup }: CurrencyModalProps) {
  const [code, setCode] = useState(initialSetup?.code || "");
  const [country, setCountry] = useState(initialSetup?.country || "");
  const [name, setName] = useState(initialSetup?.name || "");
  const [symbol, setSymbol] = useState(initialSetup?.symbol || "");
  const [decimalPlace, setDecimalPlace] = useState(initialSetup?.decimalPlace ?? 2);
  const [subunit, setSubunit] = useState(initialSetup?.subunit || "Cent");
  const [commaFormat, setCommaFormat] = useState(initialSetup?.commaFormat || "1,234,567,890");
  const [rate, setRate] = useState("1.00");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (initialSetup) {
      setCode(initialSetup.code);
      setCountry(initialSetup.country);
      setName(initialSetup.name);
      setSymbol(initialSetup.symbol);
      setDecimalPlace(initialSetup.decimalPlace);
      setSubunit(initialSetup.subunit);
      setCommaFormat(initialSetup.commaFormat);
    } else {
      setCode("");
      setCountry("");
      setName("");
      setSymbol("");
      setDecimalPlace(2);
      setSubunit("Cent");
      setCommaFormat("1,234,567,890");
      setRate("1.00");
      setEffectiveDate(new Date().toISOString().split("T")[0]);
    }
  }, [initialSetup, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !country.trim() || !symbol.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    onSubmit(
      {
        code: code.trim().toUpperCase(),
        country: country.trim(),
        name: name.trim(),
        symbol: symbol.trim(),
        decimalPlace: Number(decimalPlace),
        subunit: subunit.trim(),
        commaFormat,
      },
      parseFloat(rate) || 1.0,
      effectiveDate
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Coins className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                {initialSetup ? `Edit Currency • ${initialSetup.code}` : "Add New Currency"}
              </h4>
              <p className="text-[11px] text-muted-foreground">Configure ISO code, subunit, and display formatting</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground block">
                Currency Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={3}
                placeholder="e.g. USD"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground block">
                Symbol <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. $"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Currency Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. US Dollar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Country / Economic Zone <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. United States"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground block">Decimal Places</label>
              <select
                value={decimalPlace}
                onChange={(e) => setDecimalPlace(Number(e.target.value))}
                className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none cursor-pointer"
              >
                <option value={0}>0 (e.g. JPY)</option>
                <option value={2}>2 (Standard)</option>
                <option value={3}>3 (e.g. BHD)</option>
                <option value={4}>4 (Precise)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground block">Subunit Term</label>
              <input
                type="text"
                placeholder="e.g. Cent, Poisa"
                value={subunit}
                onChange={(e) => setSubunit(e.target.value)}
                className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground block">Comma Formatting Rule</label>
            <select
              value={commaFormat}
              onChange={(e) => setCommaFormat(e.target.value)}
              className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none cursor-pointer"
            >
              <option value="1,234,567,890">1,234,567,890 (International Standard)</option>
              <option value="12,34,56,789">12,34,56,789 (South Asian / Lakh-Crore)</option>
              <option value="1.234.567.890">1.234.567.890 (European Standard)</option>
            </select>
          </div>

          {!initialSetup && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground block">Initial Exchange Rate</label>
                <input
                  type="number"
                  step="any"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground block">Effective Date</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              {initialSetup ? "Save Changes" : "Create Currency"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Drawer: Historical Rates Archive (VZe)
interface RateHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySetup;
  currentRate: number;
}

function RateHistoryDrawer({ isOpen, onClose, currency, currentRate }: RateHistoryDrawerProps) {
  if (!isOpen) return null;

  // Generate simulated historical progression
  const historyList = [
    { year: 2026, date: "2026-09-29", rate: currentRate },
    { year: 2025, date: "2025-07-01", rate: +(currentRate * 0.94).toFixed(2) },
    { year: 2024, date: "2024-07-01", rate: +(currentRate * 0.88).toFixed(2) },
    { year: 2023, date: "2023-07-01", rate: +(currentRate * 0.82).toFixed(2) },
    { year: 2022, date: "2022-07-01", rate: +(currentRate * 0.74).toFixed(2) },
    { year: 2020, date: "2020-07-01", rate: +(currentRate * 0.70).toFixed(2) },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-2xs">
              <TrendingUp className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <span>{currency.code} ({currency.symbol})</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                  Rate Archive
                </span>
              </h2>
              <p className="text-xs text-muted-foreground font-medium">{currency.name} • {currency.country}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="size-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Active Rate</span>
              <div className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                1 {currency.code} = {currentRate} BDT
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>

          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Historical Effective Dates</h3>

          <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden bg-card">
            {historyList.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between hover:bg-muted/20 text-xs">
                <div>
                  <div className="font-semibold text-foreground font-mono">{item.date}</div>
                  <div className="text-[10px] text-muted-foreground">Fiscal Cycle {item.year}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-foreground">{item.rate}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">per 1.00</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal: Bulk Update Rates (GZe)
interface BulkUpdateRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  setups: CurrencySetup[];
  ratesMap: Map<string, CurrencyRate>;
  onSave: (updated: Record<string, { rate: number; effectiveDate: string }>) => void;
}

function BulkUpdateRatesModal({ isOpen, onClose, setups, ratesMap, onSave }: BulkUpdateRatesModalProps) {
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().split("T")[0]);
  const [values, setValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const init: Record<string, number> = {};
    setups.forEach((s) => {
      const r = ratesMap.get(s.id);
      if (r && !r.isBase) {
        init[s.id] = r.rate;
      }
    });
    setValues(init);
    setBulkDate(new Date().toISOString().split("T")[0]);
  }, [setups, ratesMap, isOpen]);

  if (!isOpen) return null;

  const handleRateChange = (currencyId: string, val: string) => {
    const parsed = parseFloat(val);
    setValues((prev) => ({ ...prev, [currencyId]: isNaN(parsed) ? 0 : parsed }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: Record<string, { rate: number; effectiveDate: string }> = {};
    Object.entries(values).forEach(([cid, rate]) => {
      result[cid] = { rate, effectiveDate: bulkDate };
    });
    onSave(result);
  };

  const nonBaseCurrencies = setups.filter((s) => !ratesMap.get(s.id)?.isBase);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-xl rounded-2xl border border-border shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UploadCloud className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Bulk Update Exchange Rates</h4>
              <p className="text-[11px] text-muted-foreground">Apply simultaneous exchange rate changes across foreign trading currencies</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Universal Effective Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={bulkDate}
              onChange={(e) => setBulkDate(e.target.value)}
              className="w-full sm:w-1/2 h-8.5 px-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none"
            />
          </div>

          <div className="border border-border/80 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Currency</th>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3 text-right">New Exchange Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {nonBaseCurrencies.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/15">
                    <td className="py-2 px-3 font-mono font-bold text-foreground">
                      {c.code} ({c.symbol})
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{c.country}</td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="any"
                        value={values[c.id] ?? 0}
                        onChange={(e) => handleRateChange(c.id, e.target.value)}
                        className="w-28 h-7 px-2 rounded border border-border bg-background text-right font-mono font-bold text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Save All Rates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
