import React from "react";
import {
  FileCheck2,
  Calendar,
  Truck,
  Wrench,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import {
  SupplierInvitationRecord,
  CommercialTerms,
} from "@/lib/supplier-portal/types";

interface Props {
  invitation: SupplierInvitationRecord;
  onUpdateTerms: (terms: CommercialTerms) => void;
  onNext: () => void;
  onPrev: () => void;
  isReadOnly: boolean;
}

const PAYMENT_TERM_PRESETS = [
  "30 Days Credit from Date of Final Quality Inspection & GRN",
  "45 Days Credit via Account Payee Cheque against Original VAT Challan",
  "60 Days Deferred L/C through Authorized Dealer Bank",
  "90 Days Deferred L/C through Authorized Dealer Bank",
  "100% Sight L/C against Shipping Documents",
  "10% Advance, 90% after Successful Commissioning",
  "Cash on Delivery (COD)",
];

const DELIVERY_TERM_PRESETS = [
  "Delivered at Place (DAP) - Pakiza Gorai Factory Compound",
  "Delivered at Place (DAP) - Pakiza Gazipur Store",
  "Delivered at Place (DAP) - Factory Gate",
  "Ex-Works (Supplier Warehouse)",
  "FOB (Free on Board) - Chattogram Port",
  "CFR (Cost & Freight) - Chattogram Port",
  "CIF (Cost, Insurance & Freight) - Chattogram Port",
];

const OFFER_VALIDITY_PRESETS = [
  "15 Days from submission",
  "30 Days from submission",
  "45 Days from submission",
  "60 Days from submission",
  "90 Days from submission",
];

export function Step5CommercialTerms({
  invitation,
  onUpdateTerms,
  onNext,
  onPrev,
  isReadOnly,
}: Props) {
  const terms = invitation.currentQuotation.commercialTerms;

  const handleChange = (field: keyof CommercialTerms, value: unknown) => {
    if (isReadOnly) return;
    onUpdateTerms({
      ...terms,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="size-5 text-blue-600" />
            <span>Commercial & Delivery Terms</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Specify standard commercial conditions, Incoterms, lead times, warranties, and inclusions
            governing this quotation.
          </p>
        </div>

        <div className="space-y-5 text-xs">
          {/* Payment Terms */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Payment Terms *
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative sm:w-1/2">
                <select
                  disabled={isReadOnly}
                  value={
                    PAYMENT_TERM_PRESETS.includes(terms.paymentTerms)
                      ? terms.paymentTerms
                      : "Custom"
                  }
                  onChange={(e) => {
                    if (e.target.value !== "Custom") {
                      handleChange("paymentTerms", e.target.value);
                    }
                  }}
                  className="w-full h-10 px-3.5 pr-8 rounded-xl border border-slate-300 bg-white text-xs font-semibold appearance-none outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100 cursor-pointer"
                >
                  {PAYMENT_TERM_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="Custom">Custom Payment Terms...</option>
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <input
                type="text"
                disabled={isReadOnly}
                value={terms.paymentTerms}
                onChange={(e) => handleChange("paymentTerms", e.target.value)}
                placeholder="Or type custom payment terms..."
                className="flex-1 h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Delivery Terms (Incoterms) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Delivery Terms (Incoterms) *
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative sm:w-1/2">
                <select
                  disabled={isReadOnly}
                  value={
                    DELIVERY_TERM_PRESETS.includes(terms.deliveryTerms)
                      ? terms.deliveryTerms
                      : "Custom"
                  }
                  onChange={(e) => {
                    if (e.target.value !== "Custom") {
                      handleChange("deliveryTerms", e.target.value);
                    }
                  }}
                  className="w-full h-10 px-3.5 pr-8 rounded-xl border border-slate-300 bg-white text-xs font-semibold appearance-none outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100 cursor-pointer"
                >
                  {DELIVERY_TERM_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="Custom">Custom Delivery Terms...</option>
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <input
                type="text"
                disabled={isReadOnly}
                value={terms.deliveryTerms}
                onChange={(e) => handleChange("deliveryTerms", e.target.value)}
                placeholder="Or type custom delivery terms / destination details..."
                className="flex-1 h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Lead Time & Offer Validity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Overall Delivery Lead Time */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Clock className="size-3 text-slate-400" />
                <span>Overall Delivery Lead Time (Days) *</span>
              </label>
              <input
                type="number"
                min="1"
                disabled={isReadOnly}
                value={terms.overallLeadTimeDays || ""}
                onChange={(e) =>
                  handleChange("overallLeadTimeDays", Math.max(1, Number(e.target.value) || 0))
                }
                placeholder="e.g. 14"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
              />
            </div>

            {/* Offer Validity */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="size-3 text-slate-400" />
                <span>Offer Validity Period *</span>
              </label>
              <div className="relative">
                <select
                  disabled={isReadOnly}
                  value={terms.offerValidity}
                  onChange={(e) => handleChange("offerValidity", e.target.value)}
                  className="w-full h-10 px-3.5 pr-8 rounded-xl border border-slate-300 bg-white text-xs font-semibold appearance-none outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100 cursor-pointer"
                >
                  {OFFER_VALIDITY_PRESETS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                  <option value="90 Days or End of Fiscal Quarter">
                    90 Days or End of Fiscal Quarter
                  </option>
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Warranty Terms */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="size-3 text-slate-400" />
              <span>Warranty / Shelf-Life Conditions</span>
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={terms.warrantyTerms}
              onChange={(e) => handleChange("warrantyTerms", e.target.value)}
              placeholder="e.g. 12 Months shelf life / replacement warranty against defects"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-100"
            />
          </div>

          {/* Commercial Inclusions Toggles */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Commercial Inclusions in Offered Pricing
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Transportation Included */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-xs block">Transportation</span>
                  <span className="text-[10px] text-slate-400">Door delivery included</span>
                </div>
                <input
                  type="checkbox"
                  disabled={isReadOnly}
                  checked={terms.transportationIncluded}
                  onChange={(e) => handleChange("transportationIncluded", e.target.checked)}
                  className="size-4 text-blue-600 rounded cursor-pointer"
                />
              </label>

              {/* Installation Included */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-xs block">Installation</span>
                  <span className="text-[10px] text-slate-400">Assembly/Commissioning</span>
                </div>
                <input
                  type="checkbox"
                  disabled={isReadOnly}
                  checked={terms.installationIncluded}
                  onChange={(e) => handleChange("installationIncluded", e.target.checked)}
                  className="size-4 text-blue-600 rounded cursor-pointer"
                />
              </label>

              {/* After-Sales Service */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-xs block">After-Sales Support</span>
                  <span className="text-[10px] text-slate-400">Technical engineer on-call</span>
                </div>
                <input
                  type="checkbox"
                  disabled={isReadOnly}
                  checked={terms.afterSalesService}
                  onChange={(e) => handleChange("afterSalesService", e.target.checked)}
                  className="size-4 text-blue-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Special Conditions */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Special Commercial Conditions
            </label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={terms.specialConditions}
              onChange={(e) => handleChange("specialConditions", e.target.value)}
              placeholder="e.g. Prices firm and fixed for contract duration, no exchange rate surcharge..."
              className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition resize-none disabled:bg-slate-100"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Additional Supplier Notes / Remarks
            </label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={terms.additionalNotes}
              onChange={(e) => handleChange("additionalNotes", e.target.value)}
              placeholder="Any supplementary technical or commercial remarks..."
              className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition resize-none disabled:bg-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="h-10 px-5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-[#172554] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Overall Quotation</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="h-10 px-6 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold shadow-md shadow-[#4169E1]/20 transition flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
        >
          <span>Continue to Attachments</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

