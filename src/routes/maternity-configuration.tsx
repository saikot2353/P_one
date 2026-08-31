import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Calendar,
  Sliders,
  Calculator,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  Coins,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/maternity-configuration")({
  head: () => ({
    meta: [
      { title: "Maternity Policy Configuration — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure maternity benefit calculation rules, cutoff dates, Gross Pay vs Net Pay calculation basis, and applicability standards.",
      },
    ],
  }),
  component: MaternityConfigurationPage,
});

export interface MaternityPolicyRule {
  id: string;
  policyTitle: string;
  cutoffDate: string; // e.g. "2026-06-10" or "2026-07-10"
  conditionOperator: "BEFORE" | "AFTER_OR_EQUAL";
  wageBasis: "GROSS_PAY" | "NET_PAY";
  benefitDays: number;
  employeeCategory: "ALL" | "WORKERS" | "STAFF";
  effectiveArea: string;
  status: "ACTIVE" | "INACTIVE";
  notes: string;
  updatedBy: string;
  updatedDate: string;
}

// Initial pre-loaded policy rules based on user prompt requirements
const initialPolicyRules: MaternityPolicyRule[] = [
  {
    id: "MC-RULE-001",
    policyTitle: "Pre-June 2026 Net Pay Maternity Calculation Policy",
    cutoffDate: "2026-06-10",
    conditionOperator: "BEFORE",
    wageBasis: "NET_PAY",
    benefitDays: 112,
    employeeCategory: "ALL",
    effectiveArea: "All Areas (Savar, Gazipur, HO)",
    status: "ACTIVE",
    notes: "Leave applications with start date BEFORE 10/06/2026 calculate benefit using Net Monthly Payable Earnings.",
    updatedBy: "HR Compliance Lead",
    updatedDate: "2026-08-15 10:30:00",
  },
  {
    id: "MC-RULE-002",
    policyTitle: "Post-July 2026 Gross Pay Maternity Calculation Policy",
    cutoffDate: "2026-07-10",
    conditionOperator: "AFTER_OR_EQUAL",
    wageBasis: "GROSS_PAY",
    benefitDays: 112,
    employeeCategory: "ALL",
    effectiveArea: "All Areas (Savar, Gazipur, HO)",
    status: "ACTIVE",
    notes: "Leave applications with start date ON OR AFTER 10/07/2026 calculate benefit using Gross Monthly Salary.",
    updatedBy: "HR Compliance Lead",
    updatedDate: "2026-08-20 14:15:00",
  },
];

function MaternityConfigurationPage() {
  // Policy Rules Database State
  const [rules, setRules] = useState<MaternityPolicyRule[]>(initialPolicyRules);

  // Form State
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [policyTitle, setPolicyTitle] = useState("");
  const [cutoffDate, setCutoffDate] = useState("2026-06-10");
  const [conditionOperator, setConditionOperator] = useState<"BEFORE" | "AFTER_OR_EQUAL">("BEFORE");
  const [wageBasis, setWageBasis] = useState<"GROSS_PAY" | "NET_PAY">("NET_PAY");
  const [benefitDays, setBenefitDays] = useState(112);
  const [employeeCategory, setEmployeeCategory] = useState<"ALL" | "WORKERS" | "STAFF">("ALL");
  const [effectiveArea, setEffectiveArea] = useState("All Areas (Savar, Gazipur, HO)");
  const [ruleStatus, setRuleStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [notes, setNotes] = useState("");

  // Notification Toast
  const [toastMsg, setToastMsg] = useState("");

  // Live Simulator States
  const [simTestDate, setSimTestDate] = useState("2026-05-15");
  const [simBasicSalary, setSimBasicSalary] = useState(21000);
  const [simGrossSalary, setSimGrossSalary] = useState(35000);
  const [simDeductions, setSimDeductions] = useState(2000);
  const [simAttnBonus, setSimAttnBonus] = useState(1000);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const q = searchTerm.toLowerCase();
      return (
        !q ||
        r.policyTitle.toLowerCase().includes(q) ||
        r.cutoffDate.includes(q) ||
        r.notes.toLowerCase().includes(q)
      );
    });
  }, [rules, searchTerm]);

  // Handle Edit click
  const handleEditRule = (rule: MaternityPolicyRule) => {
    setEditingRuleId(rule.id);
    setPolicyTitle(rule.policyTitle);
    setCutoffDate(rule.cutoffDate);
    setConditionOperator(rule.conditionOperator);
    setWageBasis(rule.wageBasis);
    setBenefitDays(rule.benefitDays);
    setEmployeeCategory(rule.employeeCategory);
    setEffectiveArea(rule.effectiveArea);
    setRuleStatus(rule.status);
    setNotes(rule.notes);
  };

  // Handle Clear / Reset form
  const handleResetForm = () => {
    setEditingRuleId(null);
    setPolicyTitle("");
    setCutoffDate("2026-06-10");
    setConditionOperator("BEFORE");
    setWageBasis("NET_PAY");
    setBenefitDays(112);
    setEmployeeCategory("ALL");
    setEffectiveArea("All Areas (Savar, Gazipur, HO)");
    setRuleStatus("ACTIVE");
    setNotes("");
  };

  // Save or Update Rule
  const handleSaveRule = () => {
    if (!cutoffDate) {
      alert("Please select a valid Cutoff Date!");
      return;
    }

    const titleToUse =
      policyTitle ||
      `${conditionOperator === "BEFORE" ? "Before" : "On/After"} ${cutoffDate} (${
        wageBasis === "GROSS_PAY" ? "Gross Pay" : "Net Pay"
      }) Maternity Policy`;

    if (editingRuleId) {
      const updated = rules.map((r) => {
        if (r.id === editingRuleId) {
          return {
            ...r,
            policyTitle: titleToUse,
            cutoffDate,
            conditionOperator,
            wageBasis,
            benefitDays,
            employeeCategory,
            effectiveArea,
            status: ruleStatus,
            notes: notes || `Maternity leave starting ${conditionOperator === "BEFORE" ? "before" : "on/after"} ${cutoffDate} calculates on ${wageBasis}.`,
            updatedBy: "HR Admin",
            updatedDate: new Date().toLocaleString(),
          };
        }
        return r;
      });
      setRules(updated);
      setToastMsg(`Policy Rule '${titleToUse}' updated successfully.`);
    } else {
      const newRule: MaternityPolicyRule = {
        id: `MC-RULE-${String(rules.length + 1).padStart(3, "0")}`,
        policyTitle: titleToUse,
        cutoffDate,
        conditionOperator,
        wageBasis,
        benefitDays,
        employeeCategory,
        effectiveArea,
        status: ruleStatus,
        notes: notes || `Maternity leave starting ${conditionOperator === "BEFORE" ? "before" : "on/after"} ${cutoffDate} calculates on ${wageBasis}.`,
        updatedBy: "HR Admin",
        updatedDate: new Date().toLocaleString(),
      };
      setRules([newRule, ...rules]);
      setToastMsg(`New Maternity Policy Rule '${titleToUse}' created successfully.`);
    }

    setTimeout(() => setToastMsg(""), 4000);
    handleResetForm();
  };

  // Toggle active/inactive status
  const handleToggleStatus = (id: string) => {
    setRules(
      rules.map((r) => {
        if (r.id === id) {
          return { ...r, status: r.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" };
        }
        return r;
      })
    );
  };

  // Delete Rule
  const handleDeleteRule = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete policy rule '${title}'?`)) {
      setRules(rules.filter((r) => r.id !== id));
      setToastMsg(`Policy rule deleted.`);
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  // Live Simulator Logic
  const simulatorResult = useMemo(() => {
    const simDate = new Date(simTestDate);
    const activeRules = rules.filter((r) => r.status === "ACTIVE");

    // Match rule
    let matchedRule: MaternityPolicyRule | null = null;
    for (const rule of activeRules) {
      const ruleCutoff = new Date(rule.cutoffDate);
      if (rule.conditionOperator === "BEFORE" && simDate < ruleCutoff) {
        matchedRule = rule;
        break;
      } else if (rule.conditionOperator === "AFTER_OR_EQUAL" && simDate >= ruleCutoff) {
        matchedRule = rule;
        break;
      }
    }

    // Default fallback if no specific rule matches
    const basis: "GROSS_PAY" | "NET_PAY" = matchedRule ? matchedRule.wageBasis : "NET_PAY";
    const netSalary = simGrossSalary - simDeductions + simAttnBonus;
    const monthlyWageUsed = basis === "GROSS_PAY" ? simGrossSalary : netSalary;
    const dailyWage = Number((monthlyWageUsed / 26).toFixed(2));
    const daysToUse = matchedRule ? matchedRule.benefitDays : 112;
    const totalBenefit = Number((dailyWage * daysToUse).toFixed(2));
    const firstInstalment = Number((totalBenefit / 2).toFixed(2));
    const secondInstalment = Number((totalBenefit - firstInstalment).toFixed(2));

    return {
      matchedRule,
      basis,
      monthlyWageUsed,
      netSalary,
      dailyWage,
      daysToUse,
      totalBenefit,
      firstInstalment,
      secondInstalment,
    };
  }, [simTestDate, simBasicSalary, simGrossSalary, simDeductions, simAttnBonus, rules]);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans overflow-hidden">
      {/* Primary Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Configure</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Maternity Configuration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sliders size={14} /> Active Rules: {rules.filter((r) => r.status === "ACTIVE").length}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button
                onClick={() => setToastMsg("")}
                className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Intro Information Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-base font-bold flex items-center gap-2">
                <Calendar size={20} className="text-blue-300" />
                Maternity Benefit Calculation Cutoff Date Configurator
              </h1>
              <p className="text-xs text-blue-100 max-w-3xl leading-relaxed">
                Define effective date thresholds to govern whether maternity leave benefit calculations are processed using <strong className="text-white underline">Gross Pay</strong> (Gross Monthly Salary) or <strong className="text-white underline">Net Pay</strong> (Net Monthly Payable Earnings) based on the leave start date.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN: POLICY RULE FORM CONFIGURATOR (1 COL) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sliders size={16} className="text-blue-600" />
                  {editingRuleId ? "Edit Policy Rule" : "Add New Policy Rule"}
                </h2>
                {editingRuleId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Policy Rule Title
                  </label>
                  <input
                    type="text"
                    value={policyTitle}
                    onChange={(e) => setPolicyTitle(e.target.value)}
                    placeholder="e.g. Pre-June 2026 Net Pay Policy"
                    className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      Cutoff Date Threshold
                    </label>
                    <input
                      type="date"
                      value={cutoffDate}
                      onChange={(e) => setCutoffDate(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      Condition Operator
                    </label>
                    <select
                      value={conditionOperator}
                      onChange={(e) => setConditionOperator(e.target.value as any)}
                      className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
                    >
                      <option value="BEFORE">Before Cutoff Date (&lt;)</option>
                      <option value="AFTER_OR_EQUAL">On or After Cutoff Date (&ge;)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2">
                  <label className="block text-blue-900 dark:text-blue-300 font-bold">
                    Calculation Basis (Wage Type)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`p-2.5 rounded border cursor-pointer text-center flex flex-col items-center justify-center transition-all ${
                        wageBasis === "NET_PAY"
                          ? "bg-blue-600 text-white font-bold border-blue-600 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="wageBasis"
                        value="NET_PAY"
                        checked={wageBasis === "NET_PAY"}
                        onChange={() => setWageBasis("NET_PAY")}
                        className="sr-only"
                      />
                      <span className="text-xs">NET PAY</span>
                      <span className="text-[10px] opacity-80 font-normal">Net Payable Earnings</span>
                    </label>

                    <label
                      className={`p-2.5 rounded border cursor-pointer text-center flex flex-col items-center justify-center transition-all ${
                        wageBasis === "GROSS_PAY"
                          ? "bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="wageBasis"
                        value="GROSS_PAY"
                        checked={wageBasis === "GROSS_PAY"}
                        onChange={() => setWageBasis("GROSS_PAY")}
                        className="sr-only"
                      />
                      <span className="text-xs">GROSS PAY</span>
                      <span className="text-[10px] opacity-80 font-normal">Gross Monthly Salary</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      Benefit Days Basis
                    </label>
                    <input
                      type="number"
                      value={benefitDays}
                      onChange={(e) => setBenefitDays(Number(e.target.value))}
                      className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      Employee Group
                    </label>
                    <select
                      value={employeeCategory}
                      onChange={(e) => setEmployeeCategory(e.target.value as any)}
                      className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    >
                      <option value="ALL">All Employees</option>
                      <option value="WORKERS">Workers</option>
                      <option value="STAFF">Office Staff &amp; Executive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Rule Notes / Policy Justification
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter compliance notes or internal HR circular ref..."
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveRule}
                    className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                  >
                    <Plus size={15} />
                    {editingRuleId ? "Update Policy Rule" : "Save Policy Rule"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="h-9 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE RULES REGISTRY & LIVE SIMULATOR (2 COLS) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Policy Rules Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-3 p-5">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    Configured Policy Rules Registry ({rules.length})
                  </h2>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search rules..."
                      className="h-7 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                        <th className="py-2.5 px-3">Rule ID &amp; Title</th>
                        <th className="py-2.5 px-3">Condition &amp; Cutoff Date</th>
                        <th className="py-2.5 px-3 text-center">Wage Basis</th>
                        <th className="py-2.5 px-3 text-center">Days</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredRules.map((rule) => (
                        <tr
                          key={rule.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {rule.policyTitle}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ID: {rule.id} • {rule.effectiveArea}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 font-medium">
                            <span className="inline-flex items-center gap-1 font-bold text-blue-800 dark:text-blue-300">
                              {rule.conditionOperator === "BEFORE" ? "Before (<)" : "On/After (≥)"}{" "}
                              {rule.cutoffDate}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                rule.wageBasis === "GROSS_PAY"
                                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
                              }`}
                            >
                              {rule.wageBasis === "GROSS_PAY" ? "GROSS PAY" : "NET PAY"}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center font-bold">{rule.benefitDays} d</td>

                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(rule.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                rule.status === "ACTIVE"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              {rule.status}
                            </button>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditRule(rule)}
                                title="Edit Rule"
                                className="p-1.5 rounded bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRule(rule.id, rule.policyTitle)}
                                title="Delete Rule"
                                className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* LIVE POLICY CALCULATION SIMULATOR TOOL */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900 shadow-sm p-5 space-y-4">
                
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Calculator size={16} className="text-blue-600" />
                    Live Maternity Benefit Policy Rule Simulator
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Test how leave dates trigger policy rules
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Test Leave Start Date</label>
                    <input
                      type="date"
                      value={simTestDate}
                      onChange={(e) => setSimTestDate(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-bold text-blue-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Monthly Gross Pay (৳)</label>
                    <input
                      type="number"
                      value={simGrossSalary}
                      onChange={(e) => setSimGrossSalary(Number(e.target.value))}
                      className="w-full h-8 px-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Monthly Deductions (৳)</label>
                    <input
                      type="number"
                      value={simDeductions}
                      onChange={(e) => setSimDeductions(Number(e.target.value))}
                      className="w-full h-8 px-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Attendance Bonus (৳)</label>
                    <input
                      type="number"
                      value={simAttnBonus}
                      onChange={(e) => setSimAttnBonus(Number(e.target.value))}
                      className="w-full h-8 px-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Simulation Output Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Triggered Policy:</span>
                      {simulatorResult.matchedRule ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold border border-blue-300">
                          {simulatorResult.matchedRule.policyTitle}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                          Default Standard Rule (Net Pay)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Active Basis:</span>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-2xs">
                        {simulatorResult.basis === "GROSS_PAY" ? "GROSS PAY BASIS" : "NET PAY BASIS"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-200 dark:border-slate-700">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[11px]">Monthly Wage Used</span>
                      <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                        ৳{simulatorResult.monthlyWageUsed.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[11px]">Average Daily Wage</span>
                      <div className="font-mono font-bold text-sm text-blue-700 dark:text-blue-400">
                        ৳{simulatorResult.dailyWage.toLocaleString()} / day
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[11px]">1st Payment (56 Days)</span>
                      <div className="font-mono font-bold text-sm text-emerald-700">
                        ৳{simulatorResult.firstInstalment.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[11px]">Total Benefit ({simulatorResult.daysToUse}d)</span>
                      <div className="font-mono font-black text-sm text-rose-600 dark:text-rose-400">
                        ৳{simulatorResult.totalBenefit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
