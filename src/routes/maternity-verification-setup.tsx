import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Stethoscope,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import {
  MaternityVerificationConfig,
  DEFAULT_MATERNITY_VERIFICATION_CONFIG,
  getMaternityVerificationConfig,
  saveMaternityVerificationConfig,
  resetMaternityVerificationConfig,
} from "@/lib/maternityLeaveStore";

export const Route = createFileRoute("/maternity-verification-setup")({
  head: () => ({
    meta: [
      { title: "Maternity Verification Setup — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure minimum working period eligibility, mandatory medical clinic follow-up counts, and pre/post-delivery leave schedules.",
      },
    ],
  }),
  component: MaternityVerificationSetupPage,
});

function MaternityVerificationSetupPage() {
  const [config, setConfig] = useState<MaternityVerificationConfig>(DEFAULT_MATERNITY_VERIFICATION_CONFIG);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const loaded = getMaternityVerificationConfig();
    setConfig(loaded);

    const handleUpdate = (e: any) => {
      if (e.detail) setConfig(e.detail);
    };
    window.addEventListener("maternity-config-updated", handleUpdate);
    return () => window.removeEventListener("maternity-config-updated", handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSave = () => {
    const totalDays = Number(config.preDeliveryLeaveDays) + Number(config.postDeliveryLeaveDays);
    const updated = saveMaternityVerificationConfig({
      ...config,
      totalLeaveDays: totalDays,
      updatedBy: "HR Compliance Authority",
    });
    setConfig(updated);
    showToast("Maternity Verification Setup saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Restore statutory default parameters?")) {
      const reset = resetMaternityVerificationConfig();
      setConfig(reset);
      showToast("Restored statutory defaults.");
    }
  };

  const totalCalculatedDays = Number(config.preDeliveryLeaveDays || 0) + Number(config.postDeliveryLeaveDays || 0);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 w-full space-y-6">
          {/* Toast */}
          {toastMessage && (
            <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4">
              <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
            </div>
          )}

          {/* Clean Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Link to="/" className="hover:text-purple-600 transition">
                  Dashboard
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Configure</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Maternity Verification Setup
                </span>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Maternity Verification Setup
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Clean 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {/* 1. Working Period Setup */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Eligibility &amp; Working Period
                </h2>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Minimum Service Period
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={config.minServicePeriodMonths}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        minServicePeriodMonths: Number(e.target.value) || 1,
                        minServicePeriodDays: (Number(e.target.value) || 1) * 30,
                      })
                    }
                    className="col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                  <select
                    value={config.servicePeriodUnit}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        servicePeriodUnit: e.target.value as "MONTHS" | "DAYS",
                      })
                    }
                    className="col-span-1 px-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="MONTHS">Months</option>
                    <option value="DAYS">Days</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400">
                  Equivalent to {config.servicePeriodUnit === "MONTHS" ? config.minServicePeriodMonths * 30 : config.minServicePeriodDays} days.
                </p>
              </div>
            </div>

            {/* 2. Medical Follow-up Setup */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Medical Follow-up Count
                </h2>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Minimum Follow-up Checkups
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={config.minMedicalFollowupCount}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        minMedicalFollowupCount: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-purple-500 focus:outline-none pr-16"
                  />
                  <span className="absolute right-3 top-2 text-[11px] text-slate-400">Visits</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Minimum Interval Between Visits
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={config.minFollowupIntervalDays}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        minFollowupIntervalDays: Number(e.target.value) || 7,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-purple-500 focus:outline-none pr-16"
                  />
                  <span className="absolute right-3 top-2 text-[11px] text-slate-400">Days</span>
                </div>
              </div>
            </div>

            {/* 3. Leave Schedule Setup */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Leave Schedule (Pre &amp; Post EDD)
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pre-Delivery (Prior EDD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={14}
                      max={120}
                      value={config.preDeliveryLeaveDays}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          preDeliveryLeaveDays: Number(e.target.value) || 0,
                          totalLeaveDays: (Number(e.target.value) || 0) + Number(config.postDeliveryLeaveDays),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-purple-500 focus:outline-none pr-12"
                    />
                    <span className="absolute right-3 top-2 text-[11px] text-slate-400">Days</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Post-Delivery (After EDD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={14}
                      max={120}
                      value={config.postDeliveryLeaveDays}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          postDeliveryLeaveDays: Number(e.target.value) || 0,
                          totalLeaveDays: Number(config.preDeliveryLeaveDays) + (Number(e.target.value) || 0),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-purple-500 focus:outline-none pr-12"
                    />
                    <span className="absolute right-3 top-2 text-[11px] text-slate-400">Days</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Total Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {totalCalculatedDays} Days ({(totalCalculatedDays / 7).toFixed(0)} Weeks)
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Max Living Children for Benefit
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={config.maxLivingChildrenForBenefit}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxLivingChildrenForBenefit: Number(e.target.value) || 2,
                    })
                  }
                  className="w-24 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
