import React, { useRef } from "react";
import { X, Printer, Scale, CheckCircle2, Award, Calendar, Building2, Layers } from "lucide-react";
import { ComparativeStatement } from "@/lib/procurement-requisition-data";

interface ComparativeStatementReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cs: ComparativeStatement | null;
}

export function ComparativeStatementReportModal({
  isOpen,
  onClose,
  cs,
}: ComparativeStatementReportModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !cs) return null;

  const handlePrint = () => {
    window.print();
  };

  const suppliers = cs.suppliers || [];
  const items = cs.items || [];
  const linkedPRs = cs.linkedPRs || [];
  const org = cs.organization || (cs as any).company || "Pakiza Knit Composite Ltd.";
  const csNum = cs.csNumber || "CS-Report";
  const currency = cs.currency || "BDT";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden print:max-h-none print:border-none print:shadow-none print:w-full print:rounded-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Comparative Statement Preview Report (Landscape)
              </h3>
              <p className="text-[11px] text-slate-500">
                Print-friendly bidder evaluation matrix and technical comparison
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content (Landscape Optimized) */}
        <div
          ref={printRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 print:overflow-visible print:p-0"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
                {org}
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Procurement & Supply Chain Management Division • Strategic Sourcing Department
              </p>
              <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wide bg-slate-900 text-white">
                Comparative Statement (CS) Evaluation Matrix
              </div>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <div className="text-sm font-black text-indigo-700 font-mono">{csNum}</div>
              <div className="text-slate-600">
                Date: <strong className="text-slate-900">{cs.csDate}</strong>
              </div>
              <div className="text-slate-600">
                Currency: <strong className="text-slate-900">{currency}</strong>
              </div>
              <div className="text-slate-600">
                Status: <strong className="text-emerald-700">{cs.status}</strong>
              </div>
            </div>
          </div>

          {/* Scope and Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Department</span>
              <strong className="text-slate-900">{cs.department || "Procurement"}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Prepared By</span>
              <strong className="text-slate-900">{cs.preparedBy || "Procurement Officer"}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Delivery Destination</span>
              <strong className="text-slate-900">{cs.deliveryWarehouse || "Central Store"}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Linked PR Reference</span>
              <strong className="text-indigo-700">
                {linkedPRs.length > 0
                  ? linkedPRs.map((p) => p.prNumber).join(", ")
                  : cs.prNumber || "PR Reference"}
              </strong>
            </div>
          </div>

          {/* Section 1: Item-Wise Bidder Comparison Matrix */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Item-Wise Bidder Evaluation Matrix
              </h3>
              <span className="text-[11px] text-slate-500">
                {items.length} Requisition Item{items.length !== 1 ? "s" : ""} • {suppliers.length} Participating Bidder{suppliers.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="py-2 px-2.5 border-r border-slate-200 w-8 text-center" rowSpan={2}>
                      #
                    </th>
                    <th className="py-2 px-2.5 border-r border-slate-200 min-w-[200px]" rowSpan={2}>
                      Item Description & Spec
                    </th>
                    <th className="py-2 px-2 border-r border-slate-200 text-center w-14" rowSpan={2}>
                      UOM
                    </th>
                    <th className="py-2 px-2 border-r border-slate-200 text-right w-16" rowSpan={2}>
                      Req Qty
                    </th>
                    <th className="py-2 px-2 border-r border-slate-200 text-right w-20" rowSpan={2}>
                      PR Rate (৳)
                    </th>
                    {suppliers.map((s) => (
                      <th
                        key={s.supplierId}
                        colSpan={3}
                        className="py-1.5 px-2 border-r border-slate-300 text-center bg-indigo-50/70 text-indigo-900"
                      >
                        <div className="font-bold truncate max-w-[220px] mx-auto">{s.supplierName}</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          Ref: {s.quotationRef || "QT"}
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-slate-50 text-[10px] text-slate-600 font-semibold border-b border-slate-300">
                    {suppliers.map((s) => (
                      <React.Fragment key={s.supplierId}>
                        <th className="py-1 px-1.5 border-r border-slate-200 text-right w-16">Quoted</th>
                        <th className="py-1 px-1.5 border-r border-slate-200 text-right w-16 text-emerald-700">Neg. Rate</th>
                        <th className="py-1 px-1.5 border-r border-slate-300 text-right w-20 font-bold">Total (৳)</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, idx) => {
                    return (
                      <tr key={item.id || item.prItemId || idx} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 border-r border-slate-200 text-center text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200">
                          <div className="font-bold text-slate-900">{item.itemName}</div>
                          {item.specification && (
                            <div className="text-[10px] text-slate-500 line-clamp-1">{item.specification}</div>
                          )}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-center text-slate-600">
                          {item.uom}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-right font-bold text-slate-800">
                          {item.quantity?.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-right text-slate-600">
                          {(item.estimatedUnitPrice || 0).toLocaleString()}
                        </td>

                        {suppliers.map((s) => {
                          const quote = item.quotes?.[s.supplierId];
                          const quotedRate = typeof quote?.unitPrice === "number" ? quote.unitPrice : 0;
                          const negRate = (quote as any)?.negotiatedRate ?? quotedRate;
                          const total = (item.quantity || 1) * negRate;

                          return (
                            <React.Fragment key={s.supplierId}>
                              <td className="py-2 px-1.5 border-r border-slate-200 text-right text-slate-600">
                                {quotedRate ? quotedRate.toLocaleString() : "—"}
                              </td>
                              <td className="py-2 px-1.5 border-r border-slate-200 text-right font-semibold text-emerald-700 bg-emerald-50/20">
                                {negRate ? negRate.toLocaleString() : "—"}
                              </td>
                              <td className="py-2 px-1.5 border-r border-slate-300 text-right font-bold text-slate-900">
                                {total ? total.toLocaleString() : "—"}
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Financial Summary & Taxes Comparison */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Supplier-Wise Commercial & Tax Summary
            </h3>

            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="py-2 px-3 border-r border-slate-200 min-w-[200px]">Commercial Metric</th>
                    {suppliers.map((s) => (
                      <th key={s.supplierId} className="py-2 px-3 border-r border-slate-300 text-right font-bold">
                        {s.supplierName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">Gross Quoted Total</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 text-right">
                        ৳ {(s.grossAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">Discount Offered (-)</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 text-right text-emerald-600 font-medium">
                        - ৳ {(s.discountAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/60 font-semibold">
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-800">Net Quoted Amount</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 text-right font-bold text-slate-900">
                        ৳ {(s.netQuotedAmount ?? (s as any).totalAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">VAT Amount (+)</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 text-right text-slate-700">
                        + ৳ {(s.vatAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })} ({s.vatPercentage || 0}%)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">Tax / AIT (+)</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 text-right text-slate-700">
                        + ৳ {(s.taxAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })} ({s.taxPercentage || 0}%)
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-indigo-50/50 font-bold border-t-2 border-indigo-200 text-indigo-950">
                    <td className="py-2 px-3 border-r border-slate-200">Final Evaluated Cost (Including Tax & VAT)</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-2 px-3 border-r border-slate-300 text-right text-xs">
                        ৳ {(s.finalTotal ?? s.netQuotedAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Technical Evaluation & Delivery Terms */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Technical Evaluation & Commercial Delivery Terms
            </h3>

            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="py-2 px-3 border-r border-slate-200 min-w-[200px]">Evaluation Factor</th>
                    {suppliers.map((s) => (
                      <th key={s.supplierId} className="py-2 px-3 border-r border-slate-300 font-bold">
                        {s.supplierName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">Delivery Lead Time</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 font-semibold text-slate-800">
                        {s.deliveryLeadDays} Days
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">Payment Terms</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 text-slate-700">
                        {s.paymentTerms}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">Delivery Terms</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 text-slate-700">
                        {s.deliveryTerms}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">Warranty Provided</td>
                    {suppliers.map((s) => (
                      <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 text-slate-700">
                        {s.warranty}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-medium">Technical Score</td>
                    {suppliers.map((s) => {
                      const score = cs.technicalScorecards?.find(t => t.supplierId === s.supplierId)?.overallScore ?? 88;
                      return (
                        <td key={s.supplierId} className="py-1.5 px-3 border-r border-slate-300 font-bold text-indigo-700">
                          {score} / 100
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Recommendation & Executive Decision */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-amber-950 uppercase tracking-wide">
                Evaluation Committee Recommendation
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 block">Recommended Supplier:</span>
                <strong className="text-sm font-bold text-slate-900">
                  {cs.recommendedSupplierName || "Pending Recommendation"}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Recommended Negotiated Value:</span>
                <strong className="text-sm font-bold text-slate-900 font-mono">
                  ৳ {(cs.negotiatedTotal ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Estimated Savings vs Target:</span>
                <strong className="text-sm font-bold text-emerald-700 font-mono">
                  ৳ {(cs.estimatedSavings ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </strong>
              </div>
            </div>
            <div className="pt-1 text-slate-700">
              <span className="font-semibold text-slate-800">Justification: </span>
              {cs.recommendationJustification ||
                "Supplier selected based on lowest responsive quoted rate, favorable credit payment terms, and proven quality compliance history."}
            </div>
          </div>

          {/* Committee Signatures */}
          <div className="pt-8 grid grid-cols-4 gap-6 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">{cs.preparedBy || "Engr. Nazmul Huda"}</div>
              <div className="text-[11px] text-slate-500">Prepared By (Procurement)</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">Engr. Zahirul Islam</div>
              <div className="text-[11px] text-slate-500">Technical Head (Spinning)</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">Md. Rafiqul Islam</div>
              <div className="text-[11px] text-slate-500">Commercial / Finance Head</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">Rafiqul Islam Pakiza</div>
              <div className="text-[11px] text-slate-500">Director / Approved By</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
