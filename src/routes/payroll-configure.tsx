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
  Banknote,
  Briefcase,
  DollarSign
} from "lucide-react";

export const Route = createFileRoute("/payroll-configure")({
  head: () => ({
    meta: [
      { title: "Payroll Configuration — CRIPTON HRIS" },
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

interface FestivalBonusRule {
  id: string;
  minTenureMonths: number;
  maxTenureMonths: number;
  bonusType: "basic-percent" | "gross-percent" | "flat";
  bonusValue: number;
}

interface PayrollAdvanceSettings {
  maxAdvancePercent: number;
  minServiceTenure: number;
  maxInstallments: number;
  autoRepaymentEnabled: boolean;
  approvalWorkflowRequired: boolean;
}

interface PayrollLoanSettings {
  maxLoanMultiplier: number;
  maxLoanTenure: number;
  interestRate: number;
  minServiceTenureLoan: number;
  allowMultipleActiveLoans: boolean;
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

const DEFAULT_BONUS_RULES: FestivalBonusRule[] = [
  { id: "1", minTenureMonths: 0, maxTenureMonths: 3, bonusType: "flat", bonusValue: 1000 },
  { id: "2", minTenureMonths: 3, maxTenureMonths: 6, bonusType: "basic-percent", bonusValue: 50 },
  { id: "3", minTenureMonths: 6, maxTenureMonths: 12, bonusType: "basic-percent", bonusValue: 80 },
  { id: "4", minTenureMonths: 12, maxTenureMonths: 999, bonusType: "basic-percent", bonusValue: 100 }
];

const DEFAULT_ADVANCE_SETTINGS: PayrollAdvanceSettings = {
  maxAdvancePercent: 50,
  minServiceTenure: 3,
  maxInstallments: 3,
  autoRepaymentEnabled: true,
  approvalWorkflowRequired: true
};

const DEFAULT_LOAN_SETTINGS: PayrollLoanSettings = {
  maxLoanMultiplier: 3,
  maxLoanTenure: 24,
  interestRate: 0,
  minServiceTenureLoan: 12,
  allowMultipleActiveLoans: false
};

const DEFAULT_DISBURSEMENT_SETTINGS: PayrollDisbursementSettings = {
  bankEnabled: true,
  mfsEnabled: true,
  cashEnabled: true,
  primaryBank: "Mutual Trust Bank PLC",
  mfsProvider: "bKash"
};

const TABS = [
  { id: "categories", label: "Deduction Categories", icon: Tag },
  { id: "general", label: "Rates & Allowances", icon: Sliders },
  { id: "cycle", label: "Pay-Cycle Schedules", icon: Calendar },
  { id: "lateness", label: "Lateness Penalties", icon: ShieldAlert },
  { id: "bonus", label: "Festival Bonuses", icon: Coins },
  { id: "advance", label: "Salary Advances", icon: Briefcase },
  { id: "loan", label: "Company Loans Policy", icon: DollarSign },
  { id: "disbursement", label: "Payout Channels", icon: Banknote },
];

function PayrollConfigurePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");

  // State configurations
  const [deductionTypes, setDeductionTypes] = useState<string[]>(DEFAULT_CATEGORIES);
  const [generalSettings, setGeneralSettings] = useState<PayrollGeneralSettings>(DEFAULT_GENERAL_SETTINGS);
  const [cycleSettings, setCycleSettings] = useState<PayrollCycleSettings>(DEFAULT_CYCLE_SETTINGS);
  const [latenessSettings, setLatenessSettings] = useState<PayrollLatenessSettings>(DEFAULT_LATENESS_SETTINGS);
  const [bonusRules, setBonusRules] = useState<FestivalBonusRule[]>(DEFAULT_BONUS_RULES);
  const [advanceSettings, setAdvanceSettings] = useState<PayrollAdvanceSettings>(DEFAULT_ADVANCE_SETTINGS);
  const [loanSettings, setLoanSettings] = useState<PayrollLoanSettings>(DEFAULT_LOAN_SETTINGS);
  const [disbursementSettings, setDisbursementSettings] = useState<PayrollDisbursementSettings>(DEFAULT_DISBURSEMENT_SETTINGS);

  // New Category input state
  const [newCategory, setNewCategory] = useState("");

  // New Bonus Rule input states
  const [newMinTenure, setNewMinTenure] = useState<number>(0);
  const [newMaxTenure, setNewMaxTenure] = useState<number>(12);
  const [newBonusType, setNewBonusType] = useState<"basic-percent" | "gross-percent" | "flat">("basic-percent");
  const [newBonusValue, setNewBonusValue] = useState<number>(100);

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

    // 5. Festival Bonus rules
    const storedBonus = localStorage.getItem("payroll_bonus_rules");
    if (storedBonus) {
      try {
        const parsed = JSON.parse(storedBonus);
        if (Array.isArray(parsed)) {
          setBonusRules(parsed);
        }
      } catch (e) {
        console.error("Failed to parse bonus rules", e);
      }
    }

    // 6. Salary advance settings
    const storedAdvance = localStorage.getItem("payroll_advance_settings");
    if (storedAdvance) {
      try {
        const parsed = JSON.parse(storedAdvance);
        if (parsed && typeof parsed === "object") {
          setAdvanceSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse advance settings", e);
      }
    }

    // 7. Loan settings
    const storedLoan = localStorage.getItem("payroll_loan_settings");
    if (storedLoan) {
      try {
        const parsed = JSON.parse(storedLoan);
        if (parsed && typeof parsed === "object") {
          setLoanSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to parse loan settings", e);
      }
    }

    // 8. Disbursement settings
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

  const handleSaveBonusRules = (updatedRules: FestivalBonusRule[]) => {
    const sorted = [...updatedRules].sort((a, b) => a.minTenureMonths - b.minTenureMonths);
    setBonusRules(sorted);
    localStorage.setItem("payroll_bonus_rules", JSON.stringify(sorted));
  };

  const handleAddBonusRule = () => {
    if (newMinTenure < 0 || newMaxTenure <= newMinTenure) {
      alert("Please specify a valid service tenure month range.");
      return;
    }
    const newRule: FestivalBonusRule = {
      id: Date.now().toString(),
      minTenureMonths: newMinTenure,
      maxTenureMonths: newMaxTenure,
      bonusType: newBonusType,
      bonusValue: newBonusValue
    };
    const updated = [...bonusRules, newRule];
    handleSaveBonusRules(updated);
    // Reset additions form
    setNewMinTenure(0);
    setNewMaxTenure(12);
    setNewBonusValue(100);
  };

  const handleDeleteBonusRule = (id: string) => {
    if (window.confirm("Are you sure you want to delete this tenure bracket rule?")) {
      const updated = bonusRules.filter(r => r.id !== id);
      handleSaveBonusRules(updated);
    }
  };

  const handleSaveAdvanceSettings = () => {
    localStorage.setItem("payroll_advance_settings", JSON.stringify(advanceSettings));
    alert("Salary Advance Request Limits saved successfully!");
  };

  const handleSaveLoanSettings = () => {
    localStorage.setItem("payroll_loan_settings", JSON.stringify(loanSettings));
    alert("Company Loan Policies saved successfully!");
  };

  const handleSaveDisbursementSettings = () => {
    if (!disbursementSettings.bankEnabled && !disbursementSettings.mfsEnabled && !disbursementSettings.cashEnabled) {
      alert("At least one disbursement payout channel must be enabled.");
      return;
    }
    localStorage.setItem("payroll_disbursement_settings", JSON.stringify(disbursementSettings));
    alert("Payment Disbursement Accounts saved successfully!");
  };

  const inputClass = "w-full h-10 px-3.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-semibold transition-all outline-none";
  const selectClass = "w-full h-10 px-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-semibold outline-none cursor-pointer";
  const labelClass = "text-xs font-bold text-muted-foreground uppercase mb-1 block";

  return (
    <div className="flex min-h-screen bg-muted/10 w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 md:p-6 pb-24">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Breadcrumb & Header */}
            <div className="bg-card rounded-2xl border border-border/40 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                  <span>Home</span>
                  <ChevronRight className="size-3.5" />
                  <span>Configure</span>
                  <ChevronRight className="size-3.5" />
                  <span className="text-primary font-bold">Payroll Configuration</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Settings className="size-6 text-primary" />
                  Payroll Configuration Setup
                </h1>
              </div>
            </div>

            {/* Horizontal Master Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 pb-5 border-b border-border/40 mb-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium"
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            {activeTab === "categories" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Deduction Categories Configurator</h3>
                    <p className="text-sm text-muted-foreground">Configure categories dynamically. Added types immediately map into template creator lists.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Welfare Fund, Utility Deduction"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                    className={inputClass}
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Plus className="size-4" />
                    Add Type
                  </Button>
                </div>

                <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/5">
                  <div className="px-4 py-3 bg-muted/30 border-b border-border/40 flex justify-between items-center text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80">
                    <span>Deduction Category Name</span>
                    <span>Action</span>
                  </div>

                  <div className="divide-y divide-border/45 max-h-[300px] overflow-y-auto">
                    {deductionTypes.map((cat) => (
                      <div key={cat} className="px-4 py-3 bg-card flex justify-between items-center group hover:bg-muted/10 transition-colors">
                        <span className="text-sm font-semibold text-foreground">{cat}</span>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title={`Delete ${cat}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Rates, Allowances & PF Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure multiplier standards and PF contribution policies globally.</p>
                  </div>
                  <Button
                    onClick={handleSaveGeneralSettings}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className={labelClass}>Overtime (OT) Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      value={generalSettings.otMultiplier}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, otMultiplier: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Monthly Attendance Bonus</label>
                    <input
                      type="number"
                      value={generalSettings.attendanceBonus}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, attendanceBonus: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Provident Fund (PF) Employee Rate (%)</label>
                    <input
                      type="number"
                      value={generalSettings.pfEmployeeRate}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, pfEmployeeRate: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Provident Fund (PF) Employer Rate (%)</label>
                    <input
                      type="number"
                      value={generalSettings.pfEmployerRate}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, pfEmployerRate: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelClass}>Annual Tax Exemption Slab Ceiling</label>
                    <input
                      type="number"
                      value={generalSettings.taxStandardExemption}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, taxStandardExemption: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cycle" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Pay-Cycle Calendars Configuration</h3>
                    <p className="text-sm text-muted-foreground">Configure start/end cutoff cycles for attendance and salaries calculations.</p>
                  </div>
                  <Button
                    onClick={handleSaveCycleSettings}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className={labelClass}>Salary Cut-off Start Day</label>
                    <select
                      value={cycleSettings.cutoffStartDay}
                      onChange={(e) => setCycleSettings({ ...cycleSettings, cutoffStartDay: Number(e.target.value) })}
                      className={selectClass}
                    >
                      {Array.from({ length: 31 }).map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}th day</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Salary Cut-off End Day</label>
                    <select
                      value={cycleSettings.cutoffEndDay}
                      onChange={(e) => setCycleSettings({ ...cycleSettings, cutoffEndDay: Number(e.target.value) })}
                      className={selectClass}
                    >
                      {Array.from({ length: 31 }).map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}th day</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Salary Pay Day</label>
                    <select
                      value={cycleSettings.payDay}
                      onChange={(e) => setCycleSettings({ ...cycleSettings, payDay: Number(e.target.value) })}
                      className={selectClass}
                    >
                      {Array.from({ length: 31 }).map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}th day</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "lateness" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Lateness & Attendance Penalties</h3>
                    <p className="text-sm text-muted-foreground">Define check-in grace windows and multi-day buffer penalties for attendance sheets.</p>
                  </div>
                  <Button
                    onClick={handleSaveLatenessSettings}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className={labelClass}>Lateness Grace Period (Minutes)</label>
                    <input
                      type="number"
                      value={latenessSettings.gracePeriod}
                      onChange={(e) => setLatenessSettings({ ...latenessSettings, gracePeriod: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Monthly Allowed Buffer Days</label>
                    <input
                      type="number"
                      value={latenessSettings.allowedLateDays}
                      onChange={(e) => setLatenessSettings({ ...latenessSettings, allowedLateDays: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Penalty Deduction Rate (Multiplier)</label>
                    <input
                      type="number"
                      value={latenessSettings.penaltyMultiplier}
                      onChange={(e) => setLatenessSettings({ ...latenessSettings, penaltyMultiplier: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Late Entries Trigger Ratio</label>
                    <input
                      type="number"
                      value={latenessSettings.lateTriggerRatio}
                      onChange={(e) => setLatenessSettings({ ...latenessSettings, lateTriggerRatio: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelClass}>Penalty Calculation Base Salary</label>
                    <select
                      value={latenessSettings.penaltyBaseType}
                      onChange={(e) => setLatenessSettings({ ...latenessSettings, penaltyBaseType: e.target.value as any })}
                      className={selectClass}
                    >
                      <option value="basic">Basic Salary Structure</option>
                      <option value="gross">Gross Salary Structure</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bonus" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Festival Bonus Tenure Brackets</h3>
                  <p className="text-sm text-muted-foreground">Configure multiple brackets rules based on employee service tenure length.</p>
                </div>

                {/* Add Rule Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-muted/20 border border-border/50 rounded-xl">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Min Tenure (Mths)</label>
                    <input
                      type="number"
                      value={newMinTenure}
                      onChange={(e) => setNewMinTenure(Number(e.target.value))}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Max Tenure (Mths)</label>
                    <input
                      type="number"
                      value={newMaxTenure}
                      onChange={(e) => setNewMaxTenure(Number(e.target.value))}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Calculation Type</label>
                    <select
                      value={newBonusType}
                      onChange={(e) => setNewBonusType(e.target.value as any)}
                      className={selectClass}
                    >
                      <option value="basic-percent">% of Basic</option>
                      <option value="gross-percent">% of Gross</option>
                      <option value="flat">Flat BDT (৳)</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Bonus Value / Rate</label>
                    <input
                      type="number"
                      value={newBonusValue}
                      onChange={(e) => setNewBonusValue(Number(e.target.value))}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div className="flex items-end col-span-1">
                    <Button
                      onClick={handleAddBonusRule}
                      className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="size-4" />
                      Add Rule
                    </Button>
                  </div>
                </div>

                {/* Brackets rules list */}
                <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/5">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/30 text-muted-foreground font-semibold border-b border-border/60">
                      <tr>
                        <th className="px-4 py-3">Service Tenure Range</th>
                        <th className="px-4 py-3">Bonus Calculation</th>
                        <th className="px-4 py-3 text-right">Value</th>
                        <th className="px-4 py-3 text-center w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/45">
                      {bonusRules.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                            No service tenure rules defined. Click Add Rule to create one.
                          </td>
                        </tr>
                      ) : (
                        bonusRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-muted/10 bg-card transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-700">
                              {rule.maxTenureMonths >= 999 
                                ? `Above ${rule.minTenureMonths} months (${Math.round(rule.minTenureMonths / 12)}+ years)`
                                : `${rule.minTenureMonths} to ${rule.maxTenureMonths} months`}
                            </td>
                            <td className="px-4 py-3 text-slate-600 font-medium">
                              {rule.bonusType === "basic-percent" 
                                ? "% of Basic Salary" 
                                : rule.bonusType === "gross-percent" 
                                ? "% of Gross Salary" 
                                : "Fixed Flat Payout"}
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                              {rule.bonusValue.toLocaleString()}
                              {rule.bonusType === "flat" ? " ৳" : " %"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteBonusRule(rule.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Delete Rule"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "advance" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Salary Advance Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure limits, eligibility service thresholds, and monthly auto-repayment intervals.</p>
                  </div>
                  <Button
                    onClick={handleSaveAdvanceSettings}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className={labelClass}>Max Advance Amount Ceiling (%)</label>
                    <input
                      type="number"
                      value={advanceSettings.maxAdvancePercent}
                      onChange={(e) => setAdvanceSettings({ ...advanceSettings, maxAdvancePercent: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Min. Service Threshold (Months)</label>
                    <input
                      type="number"
                      value={advanceSettings.minServiceTenure}
                      onChange={(e) => setAdvanceSettings({ ...advanceSettings, minServiceTenure: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Max Repayment Installments (Months)</label>
                    <input
                      type="number"
                      value={advanceSettings.maxInstallments}
                      onChange={(e) => setAdvanceSettings({ ...advanceSettings, maxInstallments: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Enable Auto-Recovery Deductions</label>
                    <select
                      value={advanceSettings.autoRepaymentEnabled ? "Yes" : "No"}
                      onChange={(e) => setAdvanceSettings({ ...advanceSettings, autoRepaymentEnabled: e.target.value === "Yes" })}
                      className={selectClass}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Approval Workflow Required</label>
                    <select
                      value={advanceSettings.approvalWorkflowRequired ? "Yes" : "No"}
                      onChange={(e) => setAdvanceSettings({ ...advanceSettings, approvalWorkflowRequired: e.target.value === "Yes" })}
                      className={selectClass}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "loan" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Company Loan Policies</h3>
                    <p className="text-sm text-muted-foreground">Configure maximum loan borrowing limits, simple interest rates, service charges, and maximum tenure bounds.</p>
                  </div>
                  <Button
                    onClick={handleSaveLoanSettings}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <label className={labelClass}>Max Loan Multiplier (x Basic)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={loanSettings.maxLoanMultiplier}
                      onChange={(e) => setLoanSettings({ ...loanSettings, maxLoanMultiplier: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Max Repayment Tenure (Months)</label>
                    <input
                      type="number"
                      value={loanSettings.maxLoanTenure}
                      onChange={(e) => setLoanSettings({ ...loanSettings, maxLoanTenure: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Simple Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanSettings.interestRate}
                      onChange={(e) => setLoanSettings({ ...loanSettings, interestRate: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Min. Service Threshold (Months)</label>
                    <input
                      type="number"
                      value={loanSettings.minServiceTenureLoan}
                      onChange={(e) => setLoanSettings({ ...loanSettings, minServiceTenureLoan: Number(e.target.value) })}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelClass}>Allow Multiple Active Loans</label>
                    <select
                      value={loanSettings.allowMultipleActiveLoans ? "Yes" : "No"}
                      onChange={(e) => setLoanSettings({ ...loanSettings, allowMultipleActiveLoans: e.target.value === "Yes" })}
                      className={selectClass}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "disbursement" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Payment Payout Channels</h3>
                    <p className="text-sm text-muted-foreground">Configure active payout paths and primary corporate processing banks.</p>
                  </div>
                  <Button
                    onClick={handleSaveDisbursementSettings}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className={labelClass}>Bank Transfer Channel</label>
                    <select
                      value={disbursementSettings.bankEnabled ? "Active" : "Inactive"}
                      onChange={(e) => setDisbursementSettings({ ...disbursementSettings, bankEnabled: e.target.value === "Active" })}
                      className={selectClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Mobile Wallet (MFS) Channel</label>
                    <select
                      value={disbursementSettings.mfsEnabled ? "Active" : "Inactive"}
                      onChange={(e) => setDisbursementSettings({ ...disbursementSettings, mfsEnabled: e.target.value === "Active" })}
                      className={selectClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Cash Disbursement Channel</label>
                    <select
                      value={disbursementSettings.cashEnabled ? "Active" : "Inactive"}
                      onChange={(e) => setDisbursementSettings({ ...disbursementSettings, cashEnabled: e.target.value === "Active" })}
                      className={selectClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelClass}>Primary Corporate Disbursing Bank</label>
                    <input
                      type="text"
                      value={disbursementSettings.primaryBank}
                      onChange={(e) => setDisbursementSettings({ ...disbursementSettings, primaryBank: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Primary MFS Provider</label>
                    <select
                      value={disbursementSettings.mfsProvider}
                      onChange={(e) => setDisbursementSettings({ ...disbursementSettings, mfsProvider: e.target.value })}
                      className={selectClass}
                    >
                      <option value="bKash">bKash PLC</option>
                      <option value="Nagad">Nagad PLC</option>
                      <option value="Rocket">Rocket (DBBL)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
