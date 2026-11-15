import React from "react";
import {
  DollarSign,
  Percent,
  Truck,
  Wrench,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Info,
  ShieldCheck,
} from "lucide-react";
import {
  SupplierInvitationRecord,
  OverallQuotation,
} from "@/lib/supplier-portal/types";
import { calculateFinancialSummary } from "@/lib/supplier-portal/mock-data";

interface Props {
  invitation: SupplierInvitationRecord;
  onUpdateOverall?: (overall: OverallQuotation) => void;
  onUpdateOverallQuote?: (overall: OverallQuotation) => void;
  onNext: () => void;
  onPrev: () => void;
  isReadOnly: boolean;
}

export function Step4OverallQuotation({
  invitation,
  onUpdateOverall,
  onUpdateOverallQuote,
  onNext,
  onPrev,
  isReadOnly,
}: Props) {
  const { currentQuotation, items, csInfo } = invitation;
  const overall = currentQuotation.overallQuote;
  const handleUpdate = onUpdateOverallQuote || onUpdateOverall || (() => {});

  const finSummary = calculateFinancialSummary(
    items,
    currentQuotation.itemQuotes,
    overall,
  );

  const handleChange = (field: keyof OverallQuotation, value: string | number) => {
    if (isReadOnly) return;
    let sanitized = value;
    if (
      field === "discountValue" ||
      field === "vatPercent" ||
      field === "taxPercent" ||
      field === "transportationCharges" ||
      field === "installationCharges" ||
      field === "otherCharges"
    ) {
      sanitized = Math.max(0, Number(value) || 0);
    }

    handleUpdate({
      ...overall,
      [field]: sanitized,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Overall Pricing Adjustments */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="size-5 text-blue-600" />
              <span>Overall Quotation Commercial Adjustments</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure overall commercial discounts, supplemental freight, installation, or package
              terms applied to the entire quotation.
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Overall Discount */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Overall Commercial Discount
                </label>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => handleChange("discountType", "Percentage")}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      overall.discountType === "Percentage"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => handleChange("discountType", "Amount")}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      overall.discountType === "Amount"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Fixed ({csInfo.currency})
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  disabled={isReadOnly}
                  value={overall.discountValue || ""}
                  onChange={(e) => handleChange("discountValue", e.target.value)}
                  placeholder={overall.discountType === "Percentage" ? "e.g. 2.5%" : "e.g. 50000"}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
                  {overall.discountType === "Percentage" ? "%" : csInfo.currency}
                </span>
              </div>
            </div>

            {/* Supplemental Overall Taxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Overall VAT (%)</span>
                  <span className="text-slate-400 font-normal">If not item-level</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    disabled={isReadOnly}
                    value={overall.vatPercent || ""}
                    onChange={(e) => handleChange("vatPercent", e.target.value)}
                    placeholder="0"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Overall TAX / AIT (%)</span>
                  <span className="text-slate-400 font-normal">If not item-level</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    disabled={isReadOnly}
                    value={overall.taxPercent || ""}
                    onChange={(e) => handleChange("taxPercent", e.target.value)}
                    placeholder="0"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Charges (Transportation, Installation, Other) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Additional Ancillary Charges ({csInfo.currency})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Transportation */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Truck className="size-3" />
                    Transportation
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={isReadOnly}
                    value={overall.transportationCharges || ""}
                    onChange={(e) => handleChange("transportationCharges", e.target.value)}
                    placeholder="0.00"
                    className="w-full h-9.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
                  />
                </div>

                {/* Installation */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Wrench className="size-3" />
                    Installation
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={isReadOnly}
                    value={overall.installationCharges || ""}
                    onChange={(e) => handleChange("installationCharges", e.target.value)}
                    placeholder="0.00"
                    className="w-full h-9.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
                  />
                </div>

                {/* Other */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Other Charges
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={isReadOnly}
                    value={overall.otherCharges || ""}
                    onChange={(e) => handleChange("otherCharges", e.target.value)}
                    placeholder="0.00"
                    className="w-full h-9.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Overall Remarks */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Overall Commercial Quotation Remarks
              </label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={overall.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                placeholder="State any package bundle assumptions, volume rebates, or freight details..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition resize-none disabled:bg-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Comprehensive Financial Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-7 space-y-5 shadow-lg">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  Real-time Calculation Engine
                </span>
                <h3 className="text-base font-bold text-white">Quotation Financial Summary</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {finSummary.quotedItemsCount} / {finSummary.totalItems} Items
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Item-wise Gross Total</span>
                <span className="font-mono font-bold text-slate-100">
                  {csInfo.currency}{" "}
                  {finSummary.itemWiseGrossTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Item-wise Discounts Total</span>
                <span className="font-mono font-bold text-amber-400">
                  - {csInfo.currency}{" "}
                  {finSummary.itemWiseDiscountTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Item-wise Net Taxable Total</span>
                <span className="font-mono font-bold text-slate-100">
                  {csInfo.currency}{" "}
                  {finSummary.itemWiseTaxableTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Item-wise VAT Total</span>
                <span className="font-mono font-bold text-blue-300">
                  + {csInfo.currency}{" "}
                  {finSummary.itemWiseVatTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Item-wise TAX / AIT Total</span>
                <span className="font-mono font-bold text-blue-300">
                  + {csInfo.currency}{" "}
                  {finSummary.itemWiseTaxTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Overall Adjustments Sub-block */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                {finSummary.overallDiscountAmount > 0 && (
                  <div className="flex items-center justify-between text-amber-300">
                    <span>Overall Package Discount</span>
                    <span className="font-mono font-bold">
                      - {csInfo.currency}{" "}
                      {finSummary.overallDiscountAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                {finSummary.overallVatAmount > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Overall VAT ({overall.vatPercent}%)</span>
                    <span className="font-mono font-bold text-blue-300">
                      + {csInfo.currency}{" "}
                      {finSummary.overallVatAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                {finSummary.overallTaxAmount > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Overall TAX ({overall.taxPercent}%)</span>
                    <span className="font-mono font-bold text-blue-300">
                      + {csInfo.currency}{" "}
                      {finSummary.overallTaxAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                {finSummary.transportationCharges > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Transportation / Freight</span>
                    <span className="font-mono font-bold text-slate-100">
                      + {csInfo.currency}{" "}
                      {finSummary.transportationCharges.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                {finSummary.installationCharges > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Installation & Commissioning</span>
                    <span className="font-mono font-bold text-slate-100">
                      + {csInfo.currency}{" "}
                      {finSummary.installationCharges.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                {finSummary.otherCharges > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Other Ancillary Charges</span>
                    <span className="font-mono font-bold text-slate-100">
                      + {csInfo.currency}{" "}
                      {finSummary.otherCharges.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Bold Grand Final Net Amount Box */}
              <div className="pt-4 border-t border-slate-700/80">
                <div className="p-4 rounded-xl bg-blue-600 text-white shadow-md space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100 block">
                    Final Net Quotation Amount
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-tight">
                    {csInfo.currency}{" "}
                    {finSummary.netQuotationAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <span className="text-[10px] text-blue-200 block">
                    Total landed cost inclusive of all quoted taxes and charges
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="h-10 px-5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-[#172554] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Item Quotations</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="h-10 px-6 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold shadow-md shadow-[#4169E1]/20 transition flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
        >
          <span>Continue to Commercial Terms</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

