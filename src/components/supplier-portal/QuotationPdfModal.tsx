import React from "react";
import { Printer, Download, X, Building2, CheckCircle2 } from "lucide-react";
import {
  SupplierInvitationRecord,
  FinancialSummary,
} from "@/lib/supplier-portal/types";
import { calculateFinancialSummary } from "@/lib/supplier-portal/mock-data";

interface Props {
  invitation: SupplierInvitationRecord;
  onClose: () => void;
}

export const QuotationPdfModal: React.FC<Props> = ({ invitation, onClose }) => {
  const { csInfo, items, supplierMaster, supplierContact, currentQuotation } =
    invitation;
  const financialSummary: FinancialSummary = calculateFinancialSummary(
    items,
    currentQuotation.itemQuotes,
    currentQuotation.overallQuote
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[96vh] flex flex-col print:border-none print:shadow-none print:max-w-none print:max-h-none print:rounded-none">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Formal Quotation Document Preview
              </h3>
              <p className="text-xs text-slate-500">
                Print-ready official submission format
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 font-sans print:p-4 print:overflow-visible text-slate-900 text-xs">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {supplierMaster.supplierName}
                </h1>
                <p className="text-xs text-slate-600 max-w-md mt-0.5">
                  {supplierContact.officeAddress}, {supplierContact.country}
                </p>
                <p className="text-xs text-slate-500">
                  Tel: {supplierContact.mobile} | Email: {supplierContact.email}
                </p>
              </div>

              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white font-black px-3 py-1 rounded text-xs uppercase tracking-widest mb-1">
                  OFFICIAL QUOTATION
                </div>
                <div className="text-xs font-mono font-bold text-slate-800">
                  Ref: {currentQuotation.quotationReference}
                </div>
                <div className="text-xs text-slate-600">
                  Date:{" "}
                  {currentQuotation.submittedAt
                    ? new Date(currentQuotation.submittedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : new Date().toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                </div>
                <div className="text-[11px] text-slate-500">
                  Version: v{currentQuotation.version}.0 | Currency: {csInfo.currency}
                </div>
              </div>
            </div>
          </div>

          {/* Client & CS Info Box */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Submitted To (Buyer)
              </span>
              <p className="font-bold text-sm text-slate-900">
                Pakiza Software / Pakiza Group
              </p>
              <p className="text-xs text-slate-600">
                Central Procurement & Sourcing Division
              </p>
              <p className="text-xs text-slate-600">
                Delivery: {csInfo.deliveryLocation}
              </p>
              <p className="text-xs text-slate-500">
                Department: {csInfo.department}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Tender / CS Reference
              </span>
              <p className="font-mono font-bold text-xs text-blue-700">
                CS No: {csInfo.csNumber}
              </p>
              <p className="font-medium text-xs text-slate-800">
                Subject: {csInfo.csSubject}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Quotation Validity: {currentQuotation.commercialTerms.offerValidity}
              </p>
            </div>
          </div>

          {/* Itemized Quotation Table */}
          <div className="mb-6">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-700 mb-2">
              Itemized Quotation Breakdown
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px]">
                  <th className="p-2 border border-slate-300 w-8 text-center">#</th>
                  <th className="p-2 border border-slate-300">Item & Description</th>
                  <th className="p-2 border border-slate-300 text-center">Brand/Origin</th>
                  <th className="p-2 border border-slate-300 text-center">Qty / UOM</th>
                  <th className="p-2 border border-slate-300 text-right">Unit Price</th>
                  <th className="p-2 border border-slate-300 text-right">Disc %</th>
                  <th className="p-2 border border-slate-300 text-right">VAT/TAX</th>
                  <th className="p-2 border border-slate-300 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, idx) => {
                  const q = currentQuotation.itemQuotes[item.itemId];
                  if (!q || q.status === "Not Quoted") {
                    return (
                      <tr key={item.itemId} className="bg-slate-50/50">
                        <td className="p-2 border border-slate-300 text-center text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="p-2 border border-slate-300">
                          <span className="font-semibold text-slate-700">
                            {item.itemName}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {item.itemCode}
                          </span>
                        </td>
                        <td
                          colSpan={6}
                          className="p-2 border border-slate-300 text-center italic text-slate-400"
                        >
                          Not Quoted by Supplier
                        </td>
                      </tr>
                    );
                  }

                  const gross = item.requiredQuantity * (q.unitPrice || 0);
                  const disc = gross * ((q.discountPercent || 0) / 100);
                  const taxable = gross - disc;
                  const vat = taxable * ((q.vatPercent || 0) / 100);
                  const tax = taxable * ((q.taxPercent || 0) / 100);
                  const finalLine = taxable + vat + tax;

                  return (
                    <tr key={item.itemId}>
                      <td className="p-2 border border-slate-300 text-center font-bold">
                        {idx + 1}
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div className="font-bold text-slate-900">{item.itemName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.itemCode} | {item.specification}
                        </div>
                        {q.remarks && (
                          <div className="text-[10px] text-blue-700 mt-0.5">
                            Note: {q.remarks}
                          </div>
                        )}
                      </td>
                      <td className="p-2 border border-slate-300 text-center">
                        <span className="font-medium text-slate-800">
                          {q.offeredBrand || "—"}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {q.offeredOrigin || "—"}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 text-center">
                        <span className="font-bold">
                          {item.requiredQuantity.toLocaleString()}
                        </span>{" "}
                        <span className="text-[10px] text-slate-500">{item.uom}</span>
                      </td>
                      <td className="p-2 border border-slate-300 text-right font-mono font-medium">
                        {(q.unitPrice || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-2 border border-slate-300 text-right">
                        {q.discountPercent > 0 ? `${q.discountPercent}%` : "0%"}
                      </td>
                      <td className="p-2 border border-slate-300 text-right text-[10px]">
                        VAT {q.vatPercent}% / TAX {q.taxPercent}%
                      </td>
                      <td className="p-2 border border-slate-300 text-right font-mono font-bold text-slate-900">
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

          {/* Financial Calculation Summary Box */}
          <div className="flex justify-end mb-6">
            <div className="w-full sm:w-80 bg-slate-50 border border-slate-300 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Item-Wise Subtotal:</span>
                <span className="font-mono">
                  {csInfo.currency}{" "}
                  {financialSummary.itemWiseFinalTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {financialSummary.overallDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Overall Discount:</span>
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

              <div className="pt-2 border-t-2 border-slate-900 flex justify-between font-bold text-sm text-slate-900">
                <span>Net Total Quotation:</span>
                <span className="font-mono text-blue-700">
                  {csInfo.currency}{" "}
                  {financialSummary.netQuotationAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Commercial Terms Summary */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6 text-xs">
            <h4 className="uppercase font-bold tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-1">
              Agreed Commercial Terms & Conditions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Payment Terms
                </span>
                <p className="font-medium text-slate-800">
                  {currentQuotation.commercialTerms.paymentTerms}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Delivery Terms (Incoterms)
                </span>
                <p className="font-medium text-slate-800">
                  {currentQuotation.commercialTerms.deliveryTerms}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Lead Time / Delivery Schedule
                </span>
                <p className="font-medium text-slate-800">
                  {currentQuotation.commercialTerms.overallLeadTimeDays} Calendar Days
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Warranty & After-Sales
                </span>
                <p className="font-medium text-slate-800">
                  {currentQuotation.commercialTerms.warrantyTerms || "Standard Warranty"}
                </p>
              </div>
            </div>
            {currentQuotation.commercialTerms.specialConditions && (
              <div className="mt-2 pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Special Conditions
                </span>
                <p className="italic text-slate-700">
                  {currentQuotation.commercialTerms.specialConditions}
                </p>
              </div>
            )}
          </div>

          {/* Signature Block */}
          <div className="pt-8 mt-8 border-t border-slate-300 grid grid-cols-2 gap-12">
            <div>
              <p className="text-[11px] text-slate-500 mb-12">
                Certified and submitted on behalf of{" "}
                <span className="font-bold text-slate-800">
                  {supplierMaster.supplierName}
                </span>
                :
              </p>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-slate-900">
                  {supplierContact.contactPerson}
                </p>
                <p className="text-xs text-slate-600">
                  {supplierContact.designation}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Authorized Signatory & Seal
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col justify-end">
              <div className="inline-block p-3 border border-dashed border-slate-300 rounded-lg text-center max-w-xs ml-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500">
                  Digitally Authenticated via CriptonHRIS Supplier Portal
                </p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                  ID: {invitation.invitationToken}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

