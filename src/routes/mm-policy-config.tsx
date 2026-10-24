import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMCompanyPolicy,
  MMPolicyAuditEntry,
} from "../lib/marketing-merchandising-data";
import {
  Settings,
  ShieldCheck,
  Percent,
  AlertTriangle,
  History,
  Save,
  CheckCircle2,
  Lock,
  Users,
  Plus,
  Trash2,
  ArrowRight,
  HelpCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-policy-config")({
  head: () => ({
    meta: [
      { title: "MM Company Policy & Configuration — CriptonHRIS" },
      {
        name: "description",
        content: "Company policy and approval workflow configurations for Marketing & Merchandising operations.",
      },
    ],
  }),
  component: MMPolicyConfigPage,
});

function MMPolicyConfigPage() {
  const [policy, setPolicy] = useState<MMCompanyPolicy>(MMRepository.getPolicy());
  const [audits, setAudits] = useState<MMPolicyAuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"policies" | "approvalRoles" | "audit">("policies");

  // Reason modal state for policy changes
  const [pendingChange, setPendingChange] = useState<{
    key: string;
    prevVal: string;
    newVal: string;
    apply: () => void;
  } | null>(null);
  const [changeReason, setChangeReason] = useState("");

  useEffect(() => {
    setPolicy(MMRepository.getPolicy());
    setAudits(MMRepository.getPolicyAudits());
  }, []);

  const triggerChange = (key: string, prevVal: string, newVal: string, apply: () => void) => {
    setPendingChange({ key, prevVal, newVal, apply });
    setChangeReason("");
  };

  const confirmChange = () => {
    if (!pendingChange) return;
    if (!changeReason.trim()) {
      toast.error("Please enter a mandatory justification reason for this policy update.");
      return;
    }

    pendingChange.apply();
    const auditEntry: MMPolicyAuditEntry = {
      id: `p-aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      user: "Rashidul Islam (Head of Merchandising)",
      policyKey: pendingChange.key,
      previousValue: pendingChange.prevVal,
      newValue: pendingChange.newVal,
      reason: changeReason.trim(),
    };

    // Save and re-read
    setAudits((prev) => [auditEntry, ...prev]);
    setPendingChange(null);
    setChangeReason("");
    toast.success(`Policy '${pendingChange.key}' updated successfully.`);
  };

  const handleSaveAll = () => {
    MMRepository.savePolicy(policy);
    toast.success("Marketing & Merchandising company policies saved successfully.");
  };

  const handleToggle = (key: keyof MMCompanyPolicy, label: string) => {
    const currentVal = !!policy[key];
    const nextVal = !currentVal;
    triggerChange(
      label,
      currentVal ? "Enabled (Yes)" : "Disabled (No)",
      nextVal ? "Enabled (Yes)" : "Disabled (No)",
      () => {
        const updated = { ...policy, [key]: nextVal };
        setPolicy(updated);
        MMRepository.savePolicy(updated, {
          id: `p-aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
          user: "Rashidul Islam (Head of Merchandising)",
          policyKey: label,
          previousValue: currentVal ? "Yes" : "No",
          newValue: nextVal ? "Yes" : "No",
          reason: changeReason.trim() || "Policy toggle updated by authorized management",
        });
      }
    );
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-policy-config"
      breadcrumbs={[{ label: "Company Policy & Configuration" }]}
      title="Company Policy & Configuration"
      subtitle="Define operational controls, saving targets, exception gates, and approval hierarchies"
      actions={
        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/30 transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("policies")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "policies"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>15 Core Policies</span>
          </button>
          <button
            onClick={() => setActiveTab("approvalRoles")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "approvalRoles"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Approval Sequence & Limits</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Policy Change Audit Trail ({audits.length})</span>
          </button>
        </div>

        {/* ── TAB 1: 15 CORE COMPANY POLICIES ─────────────────────────────────── */}
        {activeTab === "policies" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group 1: Commercial & Estimation Approvals */}
            <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Commercial & Costing Approvals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Controls commercial entry into downstream operations
                </p>
              </div>

              {/* Policy 1: Buyer Quotation Approval */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    1. Buyer Quotation Approval Required
                  </span>
                  <span className="text-[11px] text-slate-500">
                    If No, quotations may proceed to Pre-Costing immediately upon creation.
                  </span>
                </div>
                <button
                  onClick={() => handleToggle("quotationApprovalRequired", "Buyer Quotation Approval Required")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    policy.quotationApprovalRequired ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      policy.quotationApprovalRequired ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Policy 2: Pre-Costing Approval */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    2. Pre-Costing Approval Required
                  </span>
                  <span className="text-[11px] text-slate-500">
                    If Yes, Main Orders and BOMs can only be linked to an Approved Pre-Costing version.
                  </span>
                </div>
                <button
                  onClick={() => handleToggle("preCostingApprovalRequired", "Pre-Costing Approval Required")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    policy.preCostingApprovalRequired ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      policy.preCostingApprovalRequired ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Policy 3: Post-Approval Pre-Costing Amendment Restrictions */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  3. Post-Approval Pre-Costing Amendment Restrictions
                </span>
                <select
                  value={policy.postApprovalPreCostingRestrictions}
                  onChange={(e) => {
                    const newMode = e.target.value as any;
                    triggerChange(
                      "Post-Approval Pre-Costing Amendment Restrictions",
                      policy.postApprovalPreCostingRestrictions,
                      newMode,
                      () => {
                        const updated = { ...policy, postApprovalPreCostingRestrictions: newMode };
                        setPolicy(updated);
                        MMRepository.savePolicy(updated);
                      }
                    );
                  }}
                  className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="AllowAmendmentWithReapproval">
                    Allow Amendment with Full Re-Approval (Preserves Prior Approved Version)
                  </option>
                  <option value="StrictLock">Strict Lock (No amendments allowed once approved)</option>
                  <option value="Flexible">Flexible (Minor rate adjustments allowed with manager log)</option>
                </select>
              </div>

              {/* Policy 4 & 5: Fabric & Accessories Booking Approval (Independently Configurable) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      4. Fabric Booking Approval
                    </span>
                    <button
                      onClick={() => handleToggle("fabricBookingApprovalRequired", "Fabric Booking Approval Required")}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                        policy.fabricBookingApprovalRequired ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          policy.fabricBookingApprovalRequired ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Pending fabric bookings blocked from PI selection.
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      5. Accessories Approval
                    </span>
                    <button
                      onClick={() =>
                        handleToggle("accessoriesBookingApprovalRequired", "Accessories Booking Approval Required")
                      }
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                        policy.accessoriesBookingApprovalRequired ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          policy.accessoriesBookingApprovalRequired ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Independent from fabric approval setting.
                  </span>
                </div>
              </div>

              {/* Policy 14: Booking Amendment Approval Requirements */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    14. Booking Amendment Approval Required
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Material quantity or rate amendments trigger re-approval workflow.
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleToggle("bookingAmendmentApprovalRequired", "Booking Amendment Approval Required")
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    policy.bookingAmendmentApprovalRequired ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      policy.bookingAmendmentApprovalRequired ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Group 2: Saving Targets, Exceptions & Budget Controls */}
            <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-teal-600" />
                  Saving Target & Exception Gates
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Performance targets and budgetary guardrails (not hard price caps)
                </p>
              </div>

              {/* Policy 6: Booking Saving Target Percentage (Default 2%) */}
              <div className="p-3 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                    6. Booking Saving Target Percentage
                  </span>
                  <span className="text-xs font-bold text-teal-600 font-mono">
                    {policy.savingTargetPercentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2">
                  Performance benchmark used for monitoring and configurable exception handling.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.25"
                    value={policy.savingTargetPercentage}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setPolicy((prev) => ({ ...prev, savingTargetPercentage: val }));
                    }}
                    className="flex-1 accent-teal-600"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={policy.savingTargetPercentage}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setPolicy((prev) => ({ ...prev, savingTargetPercentage: val }));
                    }}
                    className="w-16 p-1 text-center font-mono font-bold text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <span className="text-xs font-bold">%</span>
                </div>
              </div>

              {/* Policy 7: Booking Price Exceeds Pre-Costing Amount */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>7. Booking Price Exceeding Pre-Costing Amount Controls</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Action triggered when booked rate/amount exceeds the approved baseline.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policy.bookingPriceExceedsPreCosting.showAlert}
                      onChange={(e) =>
                        setPolicy((prev) => ({
                          ...prev,
                          bookingPriceExceedsPreCosting: {
                            ...prev.bookingPriceExceedsPreCosting,
                            showAlert: e.target.checked,
                          },
                        }))
                      }
                      className="rounded text-teal-600"
                    />
                    <span>Show Alert</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policy.bookingPriceExceedsPreCosting.requireReason}
                      onChange={(e) =>
                        setPolicy((prev) => ({
                          ...prev,
                          bookingPriceExceedsPreCosting: {
                            ...prev.bookingPriceExceedsPreCosting,
                            requireReason: e.target.checked,
                          },
                        }))
                      }
                      className="rounded text-teal-600"
                    />
                    <span>Require Reason</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policy.bookingPriceExceedsPreCosting.requireSpecialApproval}
                      onChange={(e) =>
                        setPolicy((prev) => ({
                          ...prev,
                          bookingPriceExceedsPreCosting: {
                            ...prev.bookingPriceExceedsPreCosting,
                            requireSpecialApproval: e.target.checked,
                          },
                        }))
                      }
                      className="rounded text-teal-600"
                    />
                    <span>Special Approval</span>
                  </label>
                </div>
              </div>

              {/* Policy 8: Saving Target Exception (< Target %) */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>8. Saving Target Exception (&lt; {policy.savingTargetPercentage}%) Controls</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Action triggered when positive saving is achieved but below the target percentage.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policy.savingTargetException.showAlert}
                      onChange={(e) =>
                        setPolicy((prev) => ({
                          ...prev,
                          savingTargetException: {
                            ...prev.savingTargetException,
                            showAlert: e.target.checked,
                          },
                        }))
                      }
                      className="rounded text-teal-600"
                    />
                    <span>Show Alert</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policy.savingTargetException.requireReason}
                      onChange={(e) =>
                        setPolicy((prev) => ({
                          ...prev,
                          savingTargetException: {
                            ...prev.savingTargetException,
                            requireReason: e.target.checked,
                          },
                        }))
                      }
                      className="rounded text-teal-600"
                    />
                    <span>Require Reason</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policy.savingTargetException.requireSpecialApproval}
                      onChange={(e) =>
                        setPolicy((prev) => ({
                          ...prev,
                          savingTargetException: {
                            ...prev.savingTargetException,
                            requireSpecialApproval: e.target.checked,
                          },
                        }))
                      }
                      className="rounded text-teal-600"
                    />
                    <span>Special Approval</span>
                  </label>
                </div>
              </div>

              {/* Policy 9: Item Wastage Rules */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  9. Item Wastage Calculation Rule
                </span>
                <select
                  value={policy.itemWastageRule}
                  onChange={(e) => setPolicy((prev) => ({ ...prev, itemWastageRule: e.target.value as any }))}
                  className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                >
                  <option value="ItemSpecific">Item-Specific Wastage % (Default for Fabric & Trims)</option>
                  <option value="CategoryDefault">Category Default Wastage Matrix</option>
                  <option value="Tiered">Tiered Volume Wastage Rules</option>
                </select>
              </div>

              {/* Policy 10: Country Breakdown Requirement */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    10. Country-wise Order Quantity Breakdown Required
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Enforces reconciliation of country-wise breakdown sum with Order Quantity.
                  </span>
                </div>
                <button
                  onClick={() => handleToggle("countryBreakdownRequired", "Country-wise Breakdown Required")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    policy.countryBreakdownRequired ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      policy.countryBreakdownRequired ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Group 3: Authorization Roles (FOB, BOM, Order Closure) */}
            <div className="md:col-span-2 p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-600" />
                  Role-Based Authorization Policies (Policies 11, 12, 13)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Strict backend/UI authorization restrictions preventing unauthorized modifications
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Policy 11: FOB Editing Permissions */}
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    11. FOB Editing Permissions
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Authorized roles permitted to update FOB after initial order creation:
                  </p>
                  <div className="space-y-1">
                    {["Merchandiser", "Senior Merchandiser", "Merchandising Manager", "Head of Merchandising", "Admin"].map(
                      (role) => {
                        const checked = policy.fobEditAuthorizedRoles.includes(role);
                        return (
                          <label key={role} className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const nextRoles = e.target.checked
                                  ? [...policy.fobEditAuthorizedRoles, role]
                                  : policy.fobEditAuthorizedRoles.filter((r) => r !== role);
                                setPolicy((prev) => ({ ...prev, fobEditAuthorizedRoles: nextRoles }));
                              }}
                              className="rounded text-teal-600"
                            />
                            <span>{role}</span>
                          </label>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Policy 12: BOM Editing Permissions */}
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    12. BOM Editing Permissions
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Authorized roles permitted to modify order BOM quantities and map items:
                  </p>
                  <div className="space-y-1">
                    {[
                      "Merchandiser",
                      "Senior Merchandiser",
                      "Supply Chain Manager",
                      "Merchandising Manager",
                      "Admin",
                    ].map((role) => {
                      const checked = policy.bomEditAuthorizedRoles.includes(role);
                      return (
                        <label key={role} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const nextRoles = e.target.checked
                                ? [...policy.bomEditAuthorizedRoles, role]
                                : policy.bomEditAuthorizedRoles.filter((r) => r !== role);
                              setPolicy((prev) => ({ ...prev, bomEditAuthorizedRoles: nextRoles }));
                            }}
                            className="rounded text-teal-600"
                          />
                          <span>{role}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Policy 13: Order Closure & Reopening Permissions */}
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    13. Order Closure & Reopening
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Authorized roles permitted to close active orders or reopen closed orders:
                  </p>
                  <div className="space-y-1">
                    {[
                      "Merchandising Manager",
                      "Head of Merchandising",
                      "Supply Chain Manager",
                      "Managing Director",
                      "Admin",
                    ].map((role) => {
                      const checked = policy.orderClosureAuthorizedRoles.includes(role);
                      return (
                        <label key={role} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const nextRoles = e.target.checked
                                ? [...policy.orderClosureAuthorizedRoles, role]
                                : policy.orderClosureAuthorizedRoles.filter((r) => r !== role);
                              setPolicy((prev) => ({ ...prev, orderClosureAuthorizedRoles: nextRoles }));
                            }}
                            className="rounded text-teal-600"
                          />
                          <span>{role}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: APPROVAL ROLES, SEQUENCE & LIMITS (POLICY 15) ───────────── */}
        {activeTab === "approvalRoles" && (
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  15. Approval Roles, Sequence, and Monetary Limits (USD)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Defines the progressive authorization hierarchy for Quotations, Costings, Bookings, and PIs
                </p>
              </div>
              <button
                onClick={() => {
                  const updated = [
                    ...policy.approvalRoles,
                    { roleName: "New Approver Role", approvalLimitUsd: 10000, sequence: policy.approvalRoles.length + 1 },
                  ];
                  setPolicy({ ...policy, approvalRoles: updated });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
              >
                <Plus className="w-3.5 h-3.5" /> Add Approval Stage
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Sequence</th>
                    <th className="py-2.5 px-3 font-semibold">Role Name</th>
                    <th className="py-2.5 px-3 font-semibold">Approval Limit (USD)</th>
                    <th className="py-2.5 px-3 font-semibold">Scope of Authority</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {policy.approvalRoles.map((role, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-teal-600">Stage {role.sequence}</td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={role.roleName}
                          onChange={(e) => {
                            const updated = [...policy.approvalRoles];
                            updated[idx].roleName = e.target.value;
                            setPolicy({ ...policy, approvalRoles: updated });
                          }}
                          className="p-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold w-64"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <div className="flex items-center gap-1">
                          <span>$</span>
                          <input
                            type="number"
                            value={role.approvalLimitUsd}
                            onChange={(e) => {
                              const updated = [...policy.approvalRoles];
                              updated[idx].approvalLimitUsd = parseFloat(e.target.value) || 0;
                              setPolicy({ ...policy, approvalRoles: updated });
                            }}
                            className="p-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold w-32"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {role.sequence === 1 && "Booking line variances within $15,000"}
                        {role.sequence === 2 && "Pre-Costing revisions & bookings up to $50,000"}
                        {role.sequence === 3 && "Full order confirmations & supplier PIs up to $250,000"}
                        {role.sequence >= 4 && "Managing Director unlimited executive approval"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {policy.approvalRoles.length > 1 && (
                          <button
                            onClick={() => {
                              const updated = policy.approvalRoles.filter((_, i) => i !== idx);
                              setPolicy({ ...policy, approvalRoles: updated });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Remove Stage"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: AUDIT TRAIL OF POLICY CHANGES ───────────────────────────── */}
        {activeTab === "audit" && (
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                Immutable Policy Configuration History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Records previous value, new value, user, timestamp, and mandatory justification reason
              </p>
            </div>

            {audits.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border rounded-lg border-dashed">
                No policy modifications recorded yet in this session. Default baseline is active.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                      <th className="py-2.5 px-3 font-semibold">Policy Name</th>
                      <th className="py-2.5 px-3 font-semibold">Previous Value</th>
                      <th className="py-2.5 px-3 font-semibold">New Value</th>
                      <th className="py-2.5 px-3 font-semibold">Authorized User</th>
                      <th className="py-2.5 px-3 font-semibold">Justification Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {audits.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{entry.timestamp}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {entry.policyKey}
                        </td>
                        <td className="py-2.5 px-3 text-rose-600 font-mono line-through">
                          {entry.previousValue}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-600 font-mono font-bold">
                          {entry.newValue}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                          {entry.user}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 italic">
                          "{entry.reason}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MODAL: MANDATORY REASON FOR POLICY CHANGE ───────────────────────── */}
        {pendingChange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Confirm Policy Modification</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You are updating policy <strong className="text-teal-600">{pendingChange.key}</strong> from{" "}
                <span className="font-mono text-rose-500 font-bold">{pendingChange.prevVal}</span> to{" "}
                <span className="font-mono text-emerald-500 font-bold">{pendingChange.newVal}</span>.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Change Justification Reason:
                </label>
                <textarea
                  rows={3}
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="e.g. Approved by Board resolution for Autumn 2026 margin optimization..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setPendingChange(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChange}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  Confirm & Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
