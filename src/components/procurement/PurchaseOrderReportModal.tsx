import React, { useRef } from "react";
import { X, Printer, ShoppingCart, Briefcase } from "lucide-react";

export interface PurchaseOrderItemReport {
  itemCode?: string;
  itemName: string;
  description?: string;
  specification?: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  vatPercent?: number;
  vatAmount?: number;
  taxPercent?: number;
  taxAmount?: number;
  lineTotal: number;
}

export interface WorkOrderItemReport {
  serviceCode?: string;
  serviceName: string;
  csNumber?: string;
  workDescription?: string;
  specification?: string;
  uom: string;
  workOrderQuantity: number;
  unitRate: number;
  discount?: number;
  vatPercent?: number;
  vatAmount?: number;
  taxPercent?: number;
  taxAmount?: number;
  lineTotal: number;
}

export interface PurchaseOrderReportData {
  orderNumber: string;
  orderDate: string;
  documentType: "Purchase Order" | "Work Order";
  supplierName: string;
  supplierAddress?: string;
  supplierContact?: string;
  supplierMobile?: string;
  paymentMode?: string;
  deliveryWarehouse?: string;
  workLocation?: string;
  area?: string;
  contractPerson?: string;
  prepareBy?: string;
  department?: string;
  currency?: string;
  subtotal: number;
  discountTotal: number;
  taxTotal?: number;
  vatTotal: number;
  grandTotal: number;
  termsAndConditions?: string;
  items?: PurchaseOrderItemReport[];
  woItems?: WorkOrderItemReport[];
}

interface PurchaseOrderReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrderReportData | null;
}

export function PurchaseOrderReportModal({
  isOpen,
  onClose,
  order,
}: PurchaseOrderReportModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const isPO = order.documentType === "Purchase Order";
  const items = order.items || [];
  const woItems = order.woItems || [];
  const taxAmount = order.taxTotal ?? 0;
  const currencySymbol = "৳";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden print:max-h-none print:border-none print:shadow-none print:w-full print:rounded-none">
        {/* Header Toolbar (Hidden in Print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPO ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"}`}>
              {isPO ? <ShoppingCart className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Official {order.documentType} Document — <span className="font-mono text-indigo-700">{order.orderNumber}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Landscape Print & PDF Preview • Verified Commercial Order Form
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body (Landscape Layout) */}
        <div
          ref={printRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 text-xs font-sans print:overflow-visible print:p-0"
        >
          {/* Header - No Pakiza Logo */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-slate-950">
                PAKIZA KNIT COMPOSITE LTD.
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Khan ABC Tradeplex, House #37, Road #2, Dhanmondi, Dhaka-1205
              </p>
              <div className="inline-block mt-1.5 px-3 py-0.5 bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-sm">
                {isPO ? "OFFICIAL PURCHASE ORDER" : "OFFICIAL WORK ORDER"}
              </div>
            </div>
          </div>

          {/* Supplier & Delivery Location Grid */}
          {isPO ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/60 text-xs">
              {/* Order Details: PO No, Order Date, Payment Terms, Currency */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Order Details:
                </div>
                <div>
                  <span className="text-slate-500 font-medium">PO No: </span>
                  <strong className="text-slate-900 font-mono">{order.orderNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Order Date: </span>
                  <strong className="text-slate-900">{order.orderDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Payment Terms: </span>
                  <strong className="text-slate-900">{order.paymentMode || "Credit 30 Days"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Currency: </span>
                  <strong className="text-slate-900">{order.currency || "BDT"}</strong>
                </div>
              </div>

              {/* Delivery & Issuance Details */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Delivery &amp; Issuance Details:
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Delivery Warehouse: </span>
                  <strong className="text-slate-900">
                    {order.deliveryWarehouse || "Central Warehouse"}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Department: </span>
                  <strong className="text-slate-900">{order.department || "Procurement & Commercial"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Prepared By: </span>
                  <strong className="text-slate-900">{order.prepareBy || "Procurement Officer"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Vendor / Supplier Name: </span>
                  <strong className="text-slate-900">{order.supplierName}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/60 text-xs">
              {/* Column 1: Work Order No, Date, Supplier Name */}
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 font-medium">Work Order No: </span>
                  <strong className="text-slate-900 font-mono">{order.orderNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Date: </span>
                  <strong className="text-slate-900">{order.orderDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Supplier Name: </span>
                  <strong className="text-slate-900">{order.supplierName}</strong>
                </div>
              </div>

              {/* Column 2: Work Location, Area, Contract Person */}
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 font-medium">Work Location: </span>
                  <strong className="text-slate-900">
                    {order.workLocation || "Pakiza Knit Composite Ltd"}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Area: </span>
                  <strong className="text-slate-900">
                    {order.area || "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Contract Person: </span>
                  <strong className="text-slate-900">
                    {order.contractPerson || "—"}
                  </strong>
                </div>
              </div>

              {/* Column 3: Department, Prepared By */}
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 font-medium">Department: </span>
                  <strong className="text-slate-900">{order.department || "Procurement & Commercial"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Prepared By: </span>
                  <strong className="text-slate-900">{order.prepareBy || "Procurement Officer"}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Line Items Table: Unit Price -> Discount -> VAT -> Tax -> Line Total */}
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px]">
                  <th className="py-2.5 px-3 border-r border-slate-200 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[220px]">
                    {isPO ? "Item Description & Specification" : "Scope of Work / Service Description"}
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center w-14">UOM</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right w-20">Quantity</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right w-24">Unit Price (৳)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right w-24 text-emerald-700">Discount (৳)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right w-20 text-indigo-700">VAT (%)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right w-20 text-purple-700">Tax (%)</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-right w-28 font-bold">Line Total (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isPO && items.length > 0 ? (
                  items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{it.itemName}</div>
                        {(it.specification || it.description) && (
                          <div className="text-[10px] text-slate-500">{it.specification || it.description}</div>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-medium text-slate-700">
                        {it.uom}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900">
                        {it.quantity.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-slate-800">
                        {it.unitPrice.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-emerald-700">
                        {it.discount ? it.discount.toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-indigo-700">
                        {it.vatPercent !== undefined ? `${it.vatPercent}%` : "5%"}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-purple-700">
                        {it.taxPercent !== undefined ? `${it.taxPercent}%` : "3%"}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-300 text-right font-bold text-slate-950 font-mono">
                        {it.lineTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : woItems.length > 0 ? (
                  woItems.map((w, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{w.serviceName}</div>
                        {(w.workDescription || w.specification) && (
                          <div className="text-[10px] text-slate-500">{w.workDescription} • {w.specification}</div>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-medium text-slate-700">
                        {w.uom}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900">
                        {w.workOrderQuantity.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-slate-800">
                        {w.unitRate.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-emerald-700">
                        {w.discount ? w.discount.toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-indigo-700">
                        {w.vatPercent !== undefined ? `${w.vatPercent}%` : "5%"}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-right font-mono text-purple-700">
                        {w.taxPercent !== undefined ? `${w.taxPercent}%` : "3%"}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-300 text-right font-bold text-slate-950 font-mono">
                        {w.lineTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                      No order line items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Summary: Subtotal, Discount, Tax Amount, VAT Amount, Grand Total */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2 bg-slate-50 p-4 border border-slate-300 rounded-xl text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">
                  {currencySymbol} {order.subtotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="font-mono font-bold">
                  - {currencySymbol} {order.discountTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {/* Tax Amount immediately below Discount */}
              <div className="flex justify-between text-purple-700">
                <span>Tax Amount:</span>
                <span className="font-mono font-bold">
                  + {currencySymbol} {taxAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {/* VAT Amount in summary */}
              <div className="flex justify-between text-indigo-700">
                <span>VAT Amount:</span>
                <span className="font-mono font-bold">
                  + {currencySymbol} {order.vatTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black border-t-2 border-slate-400 pt-2 text-slate-950">
                <span>Grand Total:</span>
                <span className="font-mono text-base text-indigo-900">
                  {currencySymbol} {order.grandTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          {order.termsAndConditions && (
            <div className="space-y-1 pt-2 border-t border-slate-200">
              <span className="font-bold text-[10px] uppercase tracking-wider block text-slate-900">
                TERMS &amp; CONDITIONS:
              </span>
              <p className="text-[11px] text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {order.termsAndConditions}
              </p>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-4 gap-4 text-center text-[10px] font-bold text-slate-700">
            <div className="border-t border-slate-400 pt-2">
              <p className="text-slate-950 font-black text-xs">{order.prepareBy || "Engr. Nazmul Huda"}</p>
              <p className="text-slate-500 font-normal">Prepared By</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="text-slate-950 font-black text-xs">Engr. Tariqul Islam</p>
              <p className="text-slate-500 font-normal">Checked &amp; Verified By</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="text-slate-950 font-black text-xs">Kamrul Islam</p>
              <p className="text-slate-500 font-normal">Head of Procurement</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="text-slate-950 font-black text-xs">Rafiqul Islam Pakiza</p>
              <p className="text-slate-500 font-normal">Authorized MD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
