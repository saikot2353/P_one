import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Settings,
  Sliders,
  Tag,
  Calendar,
  Percent,
  Trash2,
  Plus,
  Save,
  Info,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Coins,
  Banknote
} from "lucide-react";

export const Route = createFileRoute("/payroll-configure")({
  head: () => ({
    meta: [
      { title: "Payroll Configuration — CRIPTON" },
      { name: "description", content: "Configure global payroll variables, deduction categories, and schedules." },
    ],
  }),
  component: PayrollConfigurePage,
});

interface PayrollGeneralSettings {
  otMultiplier: number;
  attendanceBonus: number;
  pfEmployeeRate: number;
  pfEmployerRate: number;
  taxStandardExemption: number;
}

interface PayrollCycleSettings {
  cutoffStartDay: number;
  cutoffEndDay: number;
  payDay: number;
}

interface PayrollLatenessSettings {
  gracePeriod: number;
  allowedLateDays: number;
  penaltyMultiplier: number;
  lateTriggerRatio: number;
  penaltyBaseType: "basic" | "gross";
}

interface PayrollBonusSettings {
  bonusType: "basic-percent" | "gross-percent" | "flat";
  bonusValue: number;
  minServiceMonths: number;
}

interface PayrollDisbursementSettings {
  bankEnabled: boolean;
  mfsEnabled: boolean;
  cashEnabled: boolean;
  primaryBank: string;
  mfsProvider: string;
}

const DEFAULT_CATEGORIES = ["Penalty", "Damage", "Lunch Deduction", "Transport Deduction", "Other"];

const DEFAULT_GENERAL_SETTINGS: PayrollGeneralSettings = {
  otMultiplier: 1.5,
  attendanceBonus: 1000,
  pfEmployeeRate: 10,
  pfEmployerRate: 10,
  taxStandardExemption: 350000
};

const DEFAULT_CYCLE_SETTINGS: PayrollCycleSettings = {
  cutoffStartDay: 26,
  cutoffEndDay: 25,
  payDay: 7
};

const DEFAULT_LATENESS_SETTINGS: PayrollLatenessSettings = {
  gracePeriod: 15,
  allowedLateDays: 3,
  penaltyMultiplier: 1,
  lateTriggerRatio: 3,
  penaltyBaseType: "gross"
};

const DEFAULT_BONUS_SETTINGS: PayrollBonusSettings = {
  bonusType: "basic-percent",
  bonusValue: 100,
  minServiceMonths: 6
};

const DEFAULT_DISBURSEMENT_SETTINGS: PayrollDisbursementSettings = {
  bankEnabled: true,
  mfsEnabled: true,
  cashEnabled: true,
  primaryBank: "Mutual Trust Bank PLC",
  mfsProvider: "bKash"
};

function PayrollConfigurePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"categories" | "general" | "cycle" | "lateness" | "bonus" | "disbursement">("categories");

  // State configurations
  const [deductionTypes, setDeductionTypes] = useState<string[]>(DEFAULT_CATEGORIES);
  const [generalSettings, setGeneralSettings] = useState<PayrollGeneralSettings>(DEFAULT_GENERAL_SETTINGS);
  const [cycleSettings, setCycleSettings] = useState<PayrollCycleSettings>(DEFAULT_CYCLE_SETTINGS);
  const [latenessSettings, setLatenessSettings] = useState<PayrollLatenessSettings>(DEFAULT_LATENESS_SETTINGS);
  const [bonusSettings, setBonusSettings] = useState<PayrollBonusSettings>(DEFAULT_BONUS_SETTINGS);
  const [disbursementSettings, setDisbursementSettings] = useState<PayrollDisbursementSettings>(DEFAULT_DISBURSEMENT_SETTINGS);

  // New Category input state
  const [newCategory, setNewCategory] = useState("");

  // Load configurations from local storage on mount
  useEffect(() => {
    // 1. Deduction categories
    const storedCats = localStorage.getItem("payroll_deduction_types");
    if (storedCats) {
      try {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed)) setDeductionTypes(parsed);
      } catch (e) {
        console.error("Failed to parse deduction types", e);
      }
    }

    // 2. General settings
    const storedGeneral = localStorage.getItem("payroll_general_settings");
    if (storedGeneral) {
      try {
        const parsed = JSON.parse(storedGeneral);
        if (parsed && typeof parsed === "object") {
          setGeneralSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse general settings", e);
      }
    }

    // 3. Cycle settings
    const storedCycle = localStorage.getItem("payroll_cycle_settings");
    if (storedCycle) {
      try {
        const parsed = JSON.parse(storedCycle);
        if (parsed && typeof parsed === "object") {
          setCycleSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse cycle settings", e);
      }
    }

    // 4. Lateness settings
    const storedLate = localStorage.getItem("payroll_lateness_settings");
    if (storedLate) {
      try {
        const parsed = JSON.parse(storedLate);
        if (parsed && typeof parsed === "object") {
          setLatenessSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse lateness settings", e);
      }
    }

    // 5. Bonus settings
    const storedBonus = localStorage.getItem("payroll_bonus_settings");
    if (storedBonus) {
      try {
        const parsed = JSON.parse(storedBonus);
        if (parsed && typeof parsed === "object") {
          setBonusSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse bonus settings", e);
      }
    }

    // 6. Disbursement settings
    const storedDisb = localStorage.getItem("payroll_disbursement_settings");
    if (storedDisb) {
      try {
        const parsed = JSON.parse(storedDisb);
        if (parsed && typeof parsed === "object") {
          setDisbursementSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse disbursement settings", e);
      }
    }

    setIsMounted(true);
  }, []);

  // Save handlers
  const handleSaveCategories = (updatedCats: string[]) => {
    setDeductionTypes(updatedCats);
    localStorage.setItem("payroll_deduction_types", JSON.stringify(updatedCats));
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (deductionTypes.includes(trimmed)) {
      alert("This category already exists.");
      return;
    }
    const updated = [...deductionTypes, trimmed];
    handleSaveCategories(updated);
    setNewCategory("");
  };

  const handleDeleteCategory = (cat: string) => {
    if (deductionTypes.length <= 1) {
      alert("At least one deduction category is required.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete the deduction type "${cat}"?`)) {
      const updated = deductionTypes.filter(c => c !== cat);
      handleSaveCategories(updated);
    }
  };

  const handleSaveGeneralSettings = () => {
    localStorage.setItem("payroll_general_settings", JSON.stringify(generalSettings));
    alert("General Payroll Settings saved successfully!");
  };

  const handleSaveCycleSettings = () => {
    localStorage.setItem("payroll_cycle_settings", JSON.stringify(cycleSettings));
    alert("Salary Cycle Calendars saved successfully!");
  };

  const handleSaveLatenessSettings = () => {
    localStorage.setItem("payroll_lateness_settings", JSON.stringify(latenessSettings));
    alert("Lateness & Attendance Penalties saved successfully!");
  };

  const handleSaveBonusSettings = () => {
    localStorage.setItem("payroll_bonus_settings", JSON.stringify(bonusSettings));
    alert("Festival Bonus Schemes saved successfully!");
  };

  const handleSaveDisbursementSettings = () => {
    if (!disbursementSettings.bankEnabled && !disbursementSettings.mfsEnabled && !disbursementSettings.cashEnabled) {
      alert("At least one disbursement payout channel must be enabled.");
      return;
    }
    localStorage.setItem("payroll_disbursement_settings", JSON.stringify(disbursementSettings));
    alert("Payment Disbursement Accounts saved successfully!");
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-800 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-5 md:p-8 space-y-8 w-full max-w-[1200px] mx-auto font-sans">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-300" />
            <span>Payroll</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span className="text-slate-600">Configuration</span>
          </div>

          {/* Header Card */}
          <div className="relative bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                <Settings className="size-3.5" />
                Settings Workspace
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                Payroll Configuration
              </h1>
              <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
                Configure deduction categories, overtime multipliers, PF contribution rates, lateness check-in rules, and payouts channels globally.
              </p>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar navigation links */}
            <div className="md:col-span-3 space-y-2">
              <button
                onClick={() => setActiveTab("categories")}
                className={`w-full p-3.5 rounded-2xl border text-left font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === "categories"
                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Tag className="size-4 shrink-0" />
                Deduction Categories
              </button>

              <button
                onClick={() => setActiveTab("general")}
                className={`w-full p-3.5 rounded-2xl border text-left font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === "general"
                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Sliders className="size-4 shrink-0" />
                Rates & Allowances
              </button>

              <button
                onClick={() => setActiveTab("cycle")}
                className={`w-full p-3.5 rounded-2xl border text-left font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === "cycle"
                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Calendar className="size-4 shrink-0" />
                Pay-Cycle Schedules
              </button>

              <button
                onClick={() => setActiveTab("lateness")}
                className={`w-full p-3.5 rounded-2xl border text-left font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === "lateness"
                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <ShieldAlert className="size-4 shrink-0" />
                Lateness Penalties
              </button>

              <button
                onClick={() => setActiveTab("bonus")}
                className={`w-full p-3.5 rounded-2xl border text-left font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === "bonus"
                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Coins className="size-4 shrink-0" />
                Festival Bonuses
              </button>

              <button
                onClick={() => setActiveTab("disbursement")}
                className={`w-full p-3.5 rounded-2xl border text-left font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === "disbursement"
                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Banknote className="size-4 shrink-0" />
                Payout Channels
              </button>
            </div>

            {/* Config Panels */}
            <div className="md:col-span-9 bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
              
              {activeTab === "categories" ? (
                /* PANEL 1: DEDUCTION CATEGORIES */
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-extrabold text-slate-900">Deduction Categories Configurator</h2>
                    <p className="text-xs text-slate-400 mt-1">Configure categories dynamically. Added types immediately map into template creator lists.</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Welfare Fund, Utility Deduction"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                      className="flex-1 h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 placeholder:text-slate-350 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all"
                    />
                    <Button
                      onClick={handleAddCategory}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="size-4" />
                      Add Type
                    </Button>
                  </div>

                  <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/20 shadow-inner">
                    <div className="px-4 py-3 bg-slate-100/50 border-b border-slate-200/60 flex justify-between items-center text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                      <span>Deduction Category Name</span>
                      <span>Action</span>
                    </div>

                    <div className="divide-y divide-slate-150 max-h-[300px] overflow-y-auto">
                      {deductionTypes.map((cat) => (
                        <div key={cat} className="px-4 py-3 bg-white flex justify-between items-center group">
                          <span className="text-sm font-bold text-slate-750">{cat}</span>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1.5 bg-slate-50 text-slate-450 hover:bg-rose-50 hover:text-rose-600 rounded-lg border border-slate-250/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            title={`Delete ${cat}`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === "general" ? (
                /* PANEL 2: GENERAL RATES & FORMULAS */
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Rates, Allowances & PF Settings</h2>
                      <p className="text-xs text-slate-400 mt-1">Configure multiplier standards and PF contribution policies globally.</p>
                    </div>
                    <Button
                      onClick={handleSaveGeneralSettings}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="size-4" />
                      Save Changes
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Overtime (OT) Multiplier</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={generalSettings.otMultiplier}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, otMultiplier: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">x Basic/hr</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Calculates overtime payout rates multiplier: e.g. 1.5 times hourly rate.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Monthly Attendance Bonus</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={generalSettings.attendanceBonus}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, attendanceBonus: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-8 pr-3.5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-mono"
                        />
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">৳</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Monthly attendance incentive awarded to employees with 0 unexcused absences.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Provident Fund (PF) Employee Rate</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={generalSettings.pfEmployeeRate}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, pfEmployeeRate: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white pr-8 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">%</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Deducted from employee's monthly basic salary towards PF contribution.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Provident Fund (PF) Employer Contribution</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={generalSettings.pfEmployerRate}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, pfEmployerRate: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white pr-8 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">%</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Contributed by employer on top of employee's basic salary structure.</p>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 block">Annual Tax Exemption Slab Ceiling</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={generalSettings.taxStandardExemption}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, taxStandardExemption: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-8 pr-3.5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-mono"
                        />
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">৳</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Standard annual taxable salary exemption slab limit (for general category tax calculations).</p>
                    </div>
                  </div>
                </div>
              ) : activeTab === "cycle" ? (
                /* PANEL 3: SALARY CYCLES */
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Pay-Cycle Calendars Configuration</h2>
                      <p className="text-xs text-slate-400 mt-1">Configure start/end cutoff cycles for attendance and salaries calculations.</p>
                    </div>
                    <Button
                      onClick={handleSaveCycleSettings}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="size-4" />
                      Save Changes
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Salary Cut-off Start Day</label>
                      <select
                        value={cycleSettings.cutoffStartDay}
                        onChange={(e) => setCycleSettings({ ...cycleSettings, cutoffStartDay: Number(e.target.value) })}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer font-sans"
                      >
                        {Array.from({ length: 31 }).map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}th day</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400">Cut-off period starts from this day of the previous calendar month.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Salary Cut-off End Day</label>
                      <select
                        value={cycleSettings.cutoffEndDay}
                        onChange={(e) => setCycleSettings({ ...cycleSettings, cutoffEndDay: Number(e.target.value) })}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer font-sans"
                      >
                        {Array.from({ length: 31 }).map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}th day</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400">Cut-off period ends on this day of the current processing calendar month.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Salary Pay Day</label>
                      <select
                        value={cycleSettings.payDay}
                        onChange={(e) => setCycleSettings({ ...cycleSettings, payDay: Number(e.target.value) })}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer font-sans"
                      >
                        {Array.from({ length: 31 }).map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}th day</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400">Deduction process finalizes and payouts execute on this date of the next month.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4.5 space-y-2 text-xs text-blue-800 flex items-start gap-3">
                    <Info className="size-4 text-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-blue-900 block">Cycle Context:</span>
                      <p className="leading-relaxed font-medium">
                        Based on settings, the current salary cycle runs from <strong>{cycleSettings.cutoffStartDay}th of the previous month</strong> to <strong>{cycleSettings.cutoffEndDay}th of the current month</strong>, with payouts releasing on the <strong>{cycleSettings.payDay}th of the following month</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              ) : activeTab === "lateness" ? (
                /* PANEL 4: LATENESS PENALTIES */
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Lateness & Attendance Penalties</h2>
                      <p className="text-xs text-slate-400 mt-1">Define check-in grace windows and multi-day buffer penalties for attendance sheets.</p>
                    </div>
                    <Button
                      onClick={handleSaveLatenessSettings}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="size-4" />
                      Save Changes
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Lateness Grace Period</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={latenessSettings.gracePeriod}
                          onChange={(e) => setLatenessSettings({ ...latenessSettings, gracePeriod: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 focus:outline-none font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">minutes</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Allowed buffer after shift start time before marked as "Late Check-in".</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Monthly Allowed Buffer Days</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={latenessSettings.allowedLateDays}
                          onChange={(e) => setLatenessSettings({ ...latenessSettings, allowedLateDays: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 focus:outline-none font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">entries</span>
                      </div>
                      <p className="text-[10px] text-slate-400">First few late check-in entries in a month exempted from any payroll deductions.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Penalty Deduction Rate</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={latenessSettings.penaltyMultiplier}
                          onChange={(e) => setLatenessSettings({ ...latenessSettings, penaltyMultiplier: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 focus:outline-none font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">day's pay</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Equivalent work day salary deducted when late entries trigger threshold.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-550 block">Late Entries Trigger Ratio</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={latenessSettings.lateTriggerRatio}
                          onChange={(e) => setLatenessSettings({ ...latenessSettings, lateTriggerRatio: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 focus:outline-none font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">late days</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Number of late arrivals past buffer that trigger the penalty rate.</p>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 block">Penalty Calculation Base Salary</label>
                      <select
                        value={latenessSettings.penaltyBaseType}
                        onChange={(e) => setLatenessSettings({ ...latenessSettings, penaltyBaseType: e.target.value as any })}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer font-sans"
                      >
                        <option value="basic">Basic Salary Structure</option>
                        <option value="gross">Gross Salary Structure</option>
                      </select>
                      <p className="text-[10px] text-slate-400">Specifies whether lateness deductions subtract from basic or gross daily salary.</p>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-250/60 rounded-xl p-4.5 text-xs text-amber-900 flex items-start gap-3 font-sans">
                    <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Active Policy Summary:</span>
                      <p className="leading-relaxed font-medium mt-0.5">
                        Employees have a check-in grace window of <strong>{latenessSettings.gracePeriod} minutes</strong>. Every <strong>{latenessSettings.lateTriggerRatio} late check-ins</strong> exceeding the monthly buffer of <strong>{latenessSettings.allowedLateDays} days</strong> triggers a deduction of <strong>{latenessSettings.penaltyMultiplier} day's worth</strong> of <strong>{latenessSettings.penaltyBaseType}</strong> salary.
                      </p>
                    </div>
                  </div>
                </div>
              ) : activeTab === "bonus" ? (
                /* PANEL 5: FESTIVAL BONUSES */
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Festival Bonus Rules</h2>
                      <p className="text-xs text-slate-400 mt-1">Configure parameters for calculating and paying seasonal festival bonus schedules.</p>
                    </div>
                    <Button
                      onClick={handleSaveBonusSettings}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="size-4" />
                      Save Changes
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Bonus Calculation Type</label>
                      <select
                        value={bonusSettings.bonusType}
                        onChange={(e) => setBonusSettings({ ...bonusSettings, bonusType: e.target.value as any })}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer font-sans"
                      >
                        <option value="basic-percent">% of Basic Salary</option>
                        <option value="gross-percent">% of Gross Salary</option>
                        <option value="flat">Fixed Flat Payout (৳)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Bonus Value / Rate</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={bonusSettings.bonusValue}
                          onChange={(e) => setBonusSettings({ ...bonusSettings, bonusValue: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 focus:outline-none font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">
                          {bonusSettings.bonusType === "flat" ? "৳" : "%"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Min. Service Tenure (Months)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={bonusSettings.minServiceMonths}
                          onChange={(e) => setBonusSettings({ ...bonusSettings, minServiceMonths: Number(e.target.value) })}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 focus:outline-none font-mono"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-extrabold">months</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 text-xs text-indigo-900 leading-relaxed font-sans">
                    <Info className="size-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-950 block">Eligibility Check:</span>
                      <p className="mt-0.5">
                        During bonus processing runs, only staff members with a continuous service tenure of at least <strong>{bonusSettings.minServiceMonths} months</strong> qualify. The payout is calculated as <strong>{bonusSettings.bonusValue}{bonusSettings.bonusType === "flat" ? " Tk" : "%"}</strong> of their <strong>{bonusSettings.bonusType === "basic-percent" ? "Basic Salary" : bonusSettings.bonusType === "gross-percent" ? "Gross Salary" : "Flat Payout"}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* PANEL 6: DISBURSEMENT ACCOUNTS */
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Payment Payout Channels</h2>
                      <p className="text-xs text-slate-400 mt-1">Configure active payout paths and primary corporate processing banks.</p>
                    </div>
                    <Button
                      onClick={handleSaveDisbursementSettings}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="size-4" />
                      Save Changes
                    </Button>
                  </div>

                  <div className="space-y-5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Active Disbursement Channels</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={disbursementSettings.bankEnabled}
                          onChange={(e) => setDisbursementSettings({ ...disbursementSettings, bankEnabled: e.target.checked })}
                          className="accent-blue-600 size-4.5 rounded cursor-pointer"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 block">Bank Transfer</span>
                          <span className="text-[10px] text-slate-400 font-medium">Standard corporate banking</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={disbursementSettings.mfsEnabled}
                          onChange={(e) => setDisbursementSettings({ ...disbursementSettings, mfsEnabled: e.target.checked })}
                          className="accent-blue-600 size-4.5 rounded cursor-pointer"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 block">Mobile Wallet (MFS)</span>
                          <span className="text-[10px] text-slate-400 font-medium">bKash / Nagad wallets</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={disbursementSettings.cashEnabled}
                          onChange={(e) => setDisbursementSettings({ ...disbursementSettings, cashEnabled: e.target.checked })}
                          className="accent-blue-600 size-4.5 rounded cursor-pointer"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 block">Cash Disbursement</span>
                          <span className="text-[10px] text-slate-400 font-medium">Physical cash counter payout</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Primary Corporate Disbursing Bank</label>
                      <input
                        type="text"
                        value={disbursementSettings.primaryBank}
                        onChange={(e) => setDisbursementSettings({ ...disbursementSettings, primaryBank: e.target.value })}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400">Used as the source bank on auto-generated bank advice letter documents.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 block">Primary MFS Provider</label>
                      <select
                        value={disbursementSettings.mfsProvider}
                        onChange={(e) => setDisbursementSettings({ ...disbursementSettings, mfsProvider: e.target.value })}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer font-sans"
                      >
                        <option value="bKash">bKash PLC</option>
                        <option value="Nagad">Nagad PLC</option>
                        <option value="Rocket">Rocket (DBBL)</option>
                      </select>
                      <p className="text-[10px] text-slate-400">Preferred provider channel for processing mobile wallet payroll files.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
