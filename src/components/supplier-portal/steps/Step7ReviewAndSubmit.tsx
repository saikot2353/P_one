import React, { useState } from "react";
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Send,
  ArrowLeft,
  Building2,
  FileText,
  DollarSign,
  Truck,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  SupplierInvitationRecord,
  FinancialSummary,
} from "@/lib/supplier-portal/types";
import { calculateFinancialSummary } from "@/lib/supplier-portal/mock-data";
import { QuotationPdfModal } from "../QuotationPdfModal";

interface Props {
  invitation: SupplierInvitationRecord;
  onToggleDeclaration: (accepted: boolean) => void;
  onSubmitQuotation: () => void;
  onGoToStep: (step: number) => void;
  onPrev: () => void;
  isReadOnly: boolean;
}

export const Step7ReviewAndSubmit: React.FC<Props> = ({
  invitation,
  onToggleDeclaration,
  onSubmitQuotation,
  onGoToStep,
  onPrev,
  isReadOnly,
}) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { csInfo, items, supplierMaster, supplierContact, currentQuotation } =
    invitation;
  const financialSummary: FinancialSummary = calculateFinancialSummary(
    items,
    currentQuotation.itemQuotes,
    currentQuotation.overallQuote
  );

  const hasQuotedItems = financialSummary.quotedItemsCount > 0;
  const isDeclarationAccepted = currentQuotation.declarationAccepted;
  const canSubmit = hasQuotedItems && isDeclarationAccepted && !isReadOnly;

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    onSubmitQuotation();
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                Step 7
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Review & Submit Official Quotation
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Please thoroughly review all entered item prices, overall discounts,
              commercial conditions, and attachments before final submission.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              Print / Save PDF Preview
            </button>
          </div>
        </div>

        {/* Warning if 0 items quoted */}
        {!hasQuotedItems && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Warning:</strong> You have not quoted any items. Please return
              to Step 3 (Item-Wise Quotation) to enter rates for at least one item
              before submitting.
            </span>
          </div>
        )}
      </div>

      {/* Grid of Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tender & CS Reference */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Building2 className="w-4 h-4 text-blue-600" />
              Comparative Statement & Tender
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Edit in Step 1
            </button>
          </div>
          <div className="pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">CS Reference:</span>
              <span className="font-mono font-bold text-slate-800">
                {csInfo.csNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subject:</span>
              <span className="font-semibold text-slate-800 text-right max-w-xs truncate">
                {csInfo.csSubject}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="text-slate-800">{csInfo.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Currency:</span>
              <span className="font-bold text-slate-800">{csInfo.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Point:</span>
              <span className="text-slate-800">{csInfo.deliveryLocation}</span>
            </div>
          </div>
        </div>

        {/* Supplier Signatory Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Authorized Supplier Profile
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Edit in Step 2
            </button>
          </div>
          <div className="pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Vendor Entity:</span>
              <span className="font-bold text-slate-900">
                {supplierMaster.supplierName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Officer:</span>
              <span className="font-semibold text-slate-800">
                {supplierContact.contactPerson} ({supplierContact.designation})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="text-blue-700 font-mono">
                {supplierContact.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mobile / Phone:</span>
              <span className="text-slate-800 font-mono">
                {supplierContact.mobile}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address:</span>
              <span className="text-slate-800 text-right truncate max-w-xs">
                {supplierContact.officeAddress}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Item-wise Quoted Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Quoted Items Breakdown ({financialSummary.quotedItemsCount} of{" "}
              {financialSummary.totalItems} Items Quoted)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Edit Items in Step 3
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Item Name & Spec</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Brand / Origin</th>
                <th className="px-4 py-3 text-center">Qty / UOM</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Net Line Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => {
                const quote = currentQuotation.itemQuotes[item.itemId];
                const isQuoted = quote && quote.status === "Quoted";

                if (!isQuoted) {
                  return (
                    <tr key={item.itemId} className="bg-slate-50/30 text-slate-400">
                      <td className="px-4 py-3 font-semibold">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-700">
                          {item.itemName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {item.itemCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-500 font-medium">
                          Not Quoted
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">—</td>
                      <td className="px-4 py-3 text-center">
                        {item.requiredQuantity.toLocaleString()} {item.uom}
                      </td>
                      <td className="px-4 py-3 text-right">—</td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-slate-400">
                        —
                      </td>
                    </tr>
                  );
                }

                const gross = item.requiredQuantity * (quote.unitPrice || 0);
                const disc = gross * ((quote.discountPercent || 0) / 100);
                const taxable = gross - disc;
                const vat = taxable * ((quote.vatPercent || 0) / 100);
                const tax = taxable * ((quote.taxPercent || 0) / 100);
                const finalLine = taxable + vat + tax;

                return (
                  <tr key={item.itemId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-700">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900">
                        {item.itemName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {item.itemCode} | {item.specification}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                        Quoted
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-slate-800">
                        {quote.offeredBrand || "—"}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {quote.offeredOrigin || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-slate-800">
                        {item.requiredQuantity.toLocaleString()}
                      </span>{" "}
                      <span className="text-slate-500">{item.uom}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-slate-800">
                      {(quote.unitPrice || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {finalLine.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary & Commercial Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commercial Highlights */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Clock className="w-4 h-4 text-blue-600" />
              Commercial & Delivery Terms
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(5)}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Edit in Step 5
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                Payment Terms
              </span>
              <p className="font-medium text-slate-800">
                {currentQuotation.commercialTerms.paymentTerms}
              </p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                Delivery Terms (Incoterms)
              </span>
              <p className="font-medium text-slate-800">
                {currentQuotation.commercialTerms.deliveryTerms}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                  Lead Time
                </span>
                <p className="font-bold text-slate-800">
                  {currentQuotation.commercialTerms.overallLeadTimeDays} Days
                </p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                  Offer Validity
                </span>
                <p className="font-bold text-slate-800">
                  {currentQuotation.commercialTerms.offerValidity}
                </p>
              </div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                Warranty & Support
              </span>
              <p className="text-slate-800">
                {currentQuotation.commercialTerms.warrantyTerms || "Standard Warranty"}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Calculation Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Final Quotation Value
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(4)}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Edit in Step 4
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Item-Wise Subtotal:</span>
              <span className="font-mono font-medium">
                {csInfo.currency}{" "}
                {financialSummary.itemWiseFinalTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {financialSummary.overallDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>
                  Overall Discount ({currentQuotation.overallQuote.discountType === "Percentage" ? `${currentQuotation.overallQuote.discountValue}%` : "Fixed Amount"}):
                </span>
                <span className="font-mono">
                  - {csInfo.currency}{" "}
                  {financialSummary.overallDiscountAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {financialSummary.overallVatAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Overall VAT ({currentQuotation.overallQuote.vatPercent}%):</span>
                <span className="font-mono">
                  + {csInfo.currency}{" "}
                  {financialSummary.overallVatAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {financialSummary.overallTaxAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Overall TAX ({currentQuotation.overallQuote.taxPercent}%):</span>
                <span className="font-mono">
                  + {csInfo.currency}{" "}
                  {financialSummary.overallTaxAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {financialSummary.transportationCharges > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Transportation / Freight:</span>
                <span className="font-mono">
                  + {csInfo.currency}{" "}
                  {financialSummary.transportationCharges.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {financialSummary.installationCharges > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Installation / Commissioning:</span>
                <span className="font-mono">
                  + {csInfo.currency}{" "}
                  {financialSummary.installationCharges.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {financialSummary.otherCharges > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Other Ancillary Charges:</span>
                <span className="font-mono">
                  + {csInfo.currency}{" "}
                  {financialSummary.otherCharges.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-base text-slate-900">
              <span>Net Quotation Value:</span>
              <span className="font-mono text-blue-700">
                {csInfo.currency}{" "}
                {financialSummary.netQuotationAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Snapshot */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
            <FileText className="w-4 h-4 text-blue-600" />
            Uploaded Supporting Documents (
            {currentQuotation.attachments.length} Files)
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(6)}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Manage Attachments in Step 6
          </button>
        </div>

        {currentQuotation.attachments.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No supporting documents uploaded. (An official PDF quotation is recommended).
          </p>
        ) : (
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {currentQuotation.attachments.map((att) => (
              <div
                key={att.id}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs"
              >
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate">
                    {att.fileName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {att.category} • {att.fileSizeFormatted}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formal Declaration & Checkbox */}
      <div className="bg-blue-50/70 border-2 border-blue-200/80 text-[#172554] rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#4169E1] mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#4169E1]" />
          Formal Quotation Certification & Declaration
        </h3>

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isDeclarationAccepted}
            disabled={isReadOnly}
            onChange={(e) => onToggleDeclaration(e.target.checked)}
            className="mt-1 w-4 h-4 text-[#4169E1] bg-white border-slate-300 rounded focus:ring-[#4169E1] focus:ring-2 disabled:opacity-50 cursor-pointer"
          />
          <span className="text-xs text-[#172554] leading-relaxed">
            I, <strong className="text-[#172554] font-bold">{supplierContact.contactPerson}</strong>, authorized representative of{" "}
            <strong className="text-[#172554] font-bold">{supplierMaster.supplierName}</strong>, hereby declare and confirm that the rates, technical specifications, and commercial terms submitted in this quotation are accurate, legally binding, and comply with all specifications outlined in the Comparative Statement tender document. I understand that upon submission, this quotation cannot be edited unless a revision is explicitly requested and approved by Pakiza Procurement.
          </span>
        </label>
      </div>

      {/* Navigation & Submit Trigger */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Previous: Attachments
        </button>

        {!isReadOnly ? (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => setShowConfirmModal(true)}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
              canSubmit
                ? "bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white shadow-[#4169E1]/25 hover:scale-[1.01] cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Send className="w-4 h-4" />
            Submit Official Quotation
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onGoToStep(8)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            View Submission Status
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">
              Confirm Official Submission?
            </h3>
            <p className="text-xs text-slate-600 text-center mb-4 leading-relaxed">
              You are about to officially submit Quotation{" "}
              <strong className="text-slate-900 font-mono">
                {currentQuotation.quotationReference}
              </strong>{" "}
              (Net Value:{" "}
              <strong className="text-blue-700 font-mono">
                {csInfo.currency}{" "}
                {financialSummary.netQuotationAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </strong>
              ) for Comparative Statement <strong>{csInfo.csNumber}</strong>.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mb-6 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Once submitted, this quotation will be locked for evaluation. Any
                further modifications will require a formal Revision Request.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                Go Back & Review
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
              >
                Yes, Submit Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && (
        <QuotationPdfModal
          invitation={invitation}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};

