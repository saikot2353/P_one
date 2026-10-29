// src/components/procurement/ProcurementConfigurationForm.tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Building2,
  Info,
  Layers,
  FileText,
  Save,
} from "lucide-react";
import {
  getStoredProcurementConfigs,
  updateProcurementConfig,
  ProcurementCompanyConfig,
} from "@/lib/procurement-config-data";

const COMPANY_OPTIONS = [
  "Pakiza Knit Composite Ltd",
  "Pakiza Apparels Ltd",
  "Pakiza Spinning Mills Ltd",
  "Pakiza Dyeing & Printing Industries Ltd",
  "Pakiza Textiles Ltd",
];

interface ProcurementConfigurationFormProps {
  onSaveSuccess?: () => void;
  hideHeaderActions?: boolean;
}

export function ProcurementConfigurationForm({
  onSaveSuccess,
  hideHeaderActions = false,
}: ProcurementConfigurationFormProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>(COMPANY_OPTIONS[0]);
  const [configs, setConfigs] = useState<ProcurementCompanyConfig[]>(() =>
    getStoredProcurementConfigs()
  );

  const activeConfig =
    configs.find(
      (c) => c.companyName.trim().toLowerCase() === selectedCompany.trim().toLowerCase()
    ) || {
      id: "temp",
      companyName: selectedCompany,
      allowMultipleCategories: false,
      isCSRequired: true,
    };

  const [allowMultipleCategories, setAllowMultipleCategories] = useState<boolean>(
    activeConfig.allowMultipleCategories
  );
  const [isCSRequired, setIsCSRequired] = useState<boolean>(activeConfig.isCSRequired);
  const [isSaving, setIsSaving] = useState(false);

  // Sync configuration state when company changes
  useEffect(() => {
    const found = configs.find(
      (c) => c.companyName.trim().toLowerCase() === selectedCompany.trim().toLowerCase()
    );
    if (found) {
      setAllowMultipleCategories(found.allowMultipleCategories);
      setIsCSRequired(found.isCSRequired);
    } else {
      setAllowMultipleCategories(false);
      setIsCSRequired(true);
    }
  }, [selectedCompany, configs]);

  const handleSave = () => {
    setIsSaving(true);
    try {
      updateProcurementConfig(selectedCompany, {
        allowMultipleCategories,
        isCSRequired,
        updatedBy: "Ruhul Amin Saikot",
      });
      setConfigs(getStoredProcurementConfigs());
      toast.success(`Procurement configuration saved for ${selectedCompany}!`);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save procurement configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row (Displayed when rendered standalone without route header) */}
      {!hideHeaderActions && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1">
              <span>»</span>
              <span className="hover:text-slate-600 transition">Procurement</span>
              <span>›</span>
              <span className="text-slate-800 font-bold">Procurement Configuration</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Procurement Configuration
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Configure company-level settings for procurement processes and workflows.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#9f1239] hover:bg-[#881337] active:scale-95 disabled:opacity-60 text-white font-bold text-xs transition shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Save className="size-4" />
            <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
          </button>
        </div>
      )}

      {/* Main Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Section Header with Circular Light Pink Icon */}
        <div className="flex items-start gap-3.5 pb-1">
          <div className="w-10 h-10 rounded-full bg-[#fdf2f4] border border-[#fce7eb] flex items-center justify-center text-[#e11d48] shrink-0 mt-0.5">
            <Building2 className="size-5 text-[#e11d48]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Requisition & Purchase Order Settings
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5 leading-relaxed">
              Configure the rules for Purchase Requisitions, Purchase Orders, and Comparative Statements under the selected company.
            </p>
          </div>
        </div>

        {/* Company / Business Unit Selection Row (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Company / Business Unit <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:border-[#9f1239] focus:ring-1 focus:ring-[#9f1239] outline-none shadow-2xs cursor-pointer"
            >
              {COMPANY_OPTIONS.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs">
            <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11.5px]">
              <strong className="font-semibold text-blue-950">Company-Level Policy Enforcement:</strong> The rules configured below are applied specifically to Purchase Requisitions, Comparative Statements, and Purchase Orders under the selected business unit.
            </p>
          </div>
        </div>

        {/* Configuration Cards Grid (Side by side on desktop, stacked on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Multiple Category Requisition and Purchase Order */}
          <div className="rounded-2xl border border-[#fda4af] bg-[#fff5f6] p-6 flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#fce7eb] flex items-center justify-center text-[#be123c] shrink-0">
                  <Layers className="size-5 text-[#be123c]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[15px] sm:text-base leading-snug">
                    Multiple Category Requisition and Purchase Order
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Allow multiple item categories within a single Purchase Requisition (PR) and Purchase Order (PO) / Work Order (WO).
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={allowMultipleCategories}
                  onClick={() => setAllowMultipleCategories(!allowMultipleCategories)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    allowMultipleCategories ? "bg-[#9f1239]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      allowMultipleCategories ? "translate-x-5" : "translate-x-0.5"
                    } mt-0.25`}
                  />
                </button>
                <label
                  onClick={() => setAllowMultipleCategories(!allowMultipleCategories)}
                  className="text-sm font-bold text-slate-800 cursor-pointer select-none"
                >
                  Allow Multiple Categories
                </label>
              </div>
            </div>

            {/* Bottom Informational Panel */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#fce7eb]/60 border border-[#fecdd3]/80 flex items-start gap-2.5 text-xs text-[#881337] leading-relaxed">
              <Info className="size-4 text-[#be123c] shrink-0 mt-0.5" />
              <p>
                When disabled, items from different categories cannot be added in a single PR or PO. The first selected item will define the category and any item from a different category will be blocked.
              </p>
            </div>
          </div>

          {/* Card 2: Comparative Statement (CS) Requirement */}
          <div className="rounded-2xl border border-[#bfdbfe] bg-[#f0f7ff] p-6 flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#2563eb] shrink-0">
                  <FileText className="size-5 text-[#2563eb]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[15px] sm:text-base leading-snug">
                    Comparative Statement (CS) Requirement
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Require Comparative Statement (CS) before placing a Purchase Order or Work Order.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isCSRequired}
                  onClick={() => setIsCSRequired(!isCSRequired)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isCSRequired ? "bg-[#9f1239]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isCSRequired ? "translate-x-5" : "translate-x-0.5"
                    } mt-0.25`}
                  />
                </button>
                <label
                  onClick={() => setIsCSRequired(!isCSRequired)}
                  className="text-sm font-bold text-slate-800 cursor-pointer select-none"
                >
                  CS Is Required
                </label>
              </div>
            </div>

            {/* Bottom Informational Panel */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#dbeafe]/60 border border-[#bfdbfe]/80 flex items-start gap-2.5 text-xs text-[#1e40af] leading-relaxed">
              <Info className="size-4 text-[#2563eb] shrink-0 mt-0.5" />
              <p>
                When enabled, the &quot;Comparative Statement&quot; button will be visible under Creation Method in the New Purchase Order / Work Order form. When disabled, the button will be hidden.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
