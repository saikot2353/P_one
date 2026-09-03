import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Printer,
  ArrowLeft,
  HandCoins,
} from "lucide-react";
import clientLogo from "@/components/dashboard/client_logo.png";

export const Route = createFileRoute("/ssp-iou-requisition-view")({
  head: () => ({
    meta: [
      { title: "Cash Requisition View — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Official Pakiza Software Limited Cash Requisition Slip View and Approval Audit Trail.",
      },
    ],
  }),
  component: CashRequisitionViewPage,
});

function CashRequisitionViewPage() {
  const reqNo = "MRN/2026/00035";
  const reqDate = "25/08/2026";
  const reqFor = "IOU - Salary Advance";
  const chequeRequired = "No";
  const tenor = "60";
  const expectedDate = "25/08/2026";
  const adjustmentDate = "24/10/2026";
  const previousUnadjusted = "0.00";
  const status = "Approved";

  const preparedBy = "Tahmid Afsar";
  const empId = "2023043910";
  const dept = "Business Innovation";
  const purpose = "Family Issue";
  const remarks = "";
  const amount = 5000;
  const amountInWords = "Five Thousand Taka";

  return (
    <div className="min-h-screen flex bg-slate-100/90 text-slate-800 font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto w-full">
          {/* Top Breadcrumb & Page Header */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  HOME
                </Link>
                <ChevronRight className="size-3 text-slate-300" />
                <Link to="/ssp-new-requisition" className="hover:text-blue-600 transition-colors">
                  REQUISITIONS
                </Link>
                <ChevronRight className="size-3 text-slate-300" />
                <Link to="/ssp-iou-requisition" className="hover:text-blue-600 transition-colors">
                  CASH REQUISITION ENTRY
                </Link>
                <ChevronRight className="size-3 text-slate-300" />
                <span className="text-blue-600 font-bold">SLIP VIEW ({reqNo})</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2.5 font-sans tracking-tight">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200/60 shadow-2xs">
                  <HandCoins className="size-5" />
                </div>
                <span>Cash Requisition Official View</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/ssp-iou-requisition"
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-md border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="size-3.5 text-slate-500" />
                <span>Back to Requisition Entry</span>
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-md shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>

          {/* Wide Printable Requisition Slip Document in Times New Roman Font */}
          <div className="bg-slate-200/60 p-4 sm:p-8 rounded-lg border border-slate-300/80 shadow-inner">
            <div
              id="printable-iou-slip-page"
              className="bg-white p-6 sm:p-10 rounded-lg border border-slate-300 shadow-md space-y-5 text-slate-900 text-xs w-full max-w-full font-['Times_New_Roman',_Times,_serif]"
            >
              {/* Top Company Header matching exact Pakiza Software screenshot */}
              <div className="flex items-center justify-between border-b border-slate-300 pb-3.5 gap-4">
                <div className="w-48 shrink-0">
                  <img
                    src={clientLogo}
                    alt="Pakiza Software Logo"
                    className="h-12 object-contain"
                  />
                </div>

                <div className="flex-1 text-center space-y-0.5">
                  <h2 className="font-bold text-base text-slate-900 tracking-tight">
                    Pakiza Software Limited
                  </h2>
                  <p className="text-xs text-slate-700 font-normal">
                    Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205
                  </p>
                  <h3 className="font-bold text-xs text-slate-900 pt-1">
                    Cash Requisition (PSL-Operation)
                  </h3>
                  <p className="text-xs font-bold text-slate-800">
                    {preparedBy} ({empId})
                  </p>
                </div>

                <div className="w-48 shrink-0" />
              </div>

              {/* Master Parameters 3-Column Grid */}
              <div className="grid grid-cols-3 gap-y-2 gap-x-6 text-xs font-normal leading-relaxed">
                <div>
                  <span className="font-bold text-slate-900">Requisition No : </span>
                  <span className="font-bold">{reqNo}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Requisition Date : </span>
                  <span>{reqDate}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Requisition For : </span>
                  <span className="font-bold text-slate-900">{reqFor}</span>
                </div>

                <div>
                  <span className="font-bold text-slate-900">Cheque Required : </span>
                  <span>{chequeRequired}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Tenor (days) : </span>
                  <span className="font-bold">{tenor}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Expected Date : </span>
                  <span>{expectedDate}</span>
                </div>

                <div>
                  <span className="font-bold text-slate-900">Possible Adjustment Date : </span>
                  <span>{adjustmentDate}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Previous Unadjusted : </span>
                  <span>{previousUnadjusted}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Status : </span>
                  <span className="font-bold text-slate-900">{status}</span>
                </div>
              </div>

              {/* Line Details Table */}
              <div className="border border-slate-900 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse font-['Times_New_Roman',_Times,_serif]">
                  <thead>
                    <tr className="bg-[#e6e9ff] text-slate-900 font-bold border-b border-slate-900">
                      <th className="py-2 px-3 border-r border-slate-900 w-12 text-left">SL</th>
                      <th className="py-2 px-3 border-r border-slate-900">Purpose</th>
                      <th className="py-2 px-3 border-r border-slate-900">Remarks</th>
                      <th className="py-2 px-3 text-left w-44">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 font-normal">
                    <tr>
                      <td className="py-2 px-3 border-r border-slate-900 font-bold">1</td>
                      <td className="py-2 px-3 border-r border-slate-900 font-bold text-slate-900">{purpose}</td>
                      <td className="py-2 px-3 border-r border-slate-900 text-slate-700">{remarks || ""}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-900 font-bold bg-white">
                      <td colSpan={3} className="py-2 px-3 text-left border-r border-slate-900 font-bold">
                        Total :
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="border-t border-slate-900 font-bold bg-white">
                      <td colSpan={4} className="py-2 px-3">
                        <span className="font-bold">In Words : </span>
                        <span>{amountInWords}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* 5-Stage Signature Approval Grid in Times New Roman Font */}
              <div className="pt-2 grid grid-cols-5 border border-slate-900 divide-x divide-slate-900 text-xs font-['Times_New_Roman',_Times,_serif]">
                {/* Box 1 */}
                <div className="flex flex-col h-full">
                  <div className="bg-[#e6e9ff] font-bold text-slate-900 px-2 h-[34px] flex items-center text-[10.5px] whitespace-nowrap border-b border-slate-900 shrink-0">
                    Prepared By
                  </div>
                  <div className="p-2 space-y-0.5 flex-1 bg-white">
                    <div className="font-bold text-slate-900 text-xs">{preparedBy} ({empId})</div>
                    <div className="text-slate-700 text-[11px]">{dept}</div>
                    <div className="text-[10.5px] text-slate-600 font-mono">25/08/2026 17:48:05</div>
                  </div>
                </div>

                {/* Box 2 */}
                <div className="flex flex-col h-full">
                  <div className="bg-[#e6e9ff] font-bold text-slate-900 px-2 h-[34px] flex items-center justify-between text-[10.5px] whitespace-nowrap border-b border-slate-900 shrink-0">
                    <span>Approved By HOD</span>
                    <span className="text-[10px] font-normal text-slate-800 ml-1">: Approved</span>
                  </div>
                  <div className="p-2 space-y-0.5 flex-1 bg-white">
                    <div className="font-bold text-slate-900 text-xs">Md. Anik Islam</div>
                    <div className="text-slate-700 text-[11px]">Deputy Manager</div>
                    <div className="text-[10.5px] text-slate-600 font-mono">25/08/2026 17:52:35</div>
                  </div>
                </div>

                {/* Box 3 */}
                <div className="flex flex-col h-full">
                  <div className="bg-[#e6e9ff] font-bold text-slate-900 px-2 h-[34px] flex items-center justify-between text-[10.5px] whitespace-nowrap border-b border-slate-900 shrink-0">
                    <span>Verified By HR & Admin</span>
                    <span className="text-[10px] font-normal text-slate-800 ml-1">: Approved</span>
                  </div>
                  <div className="p-2 space-y-0.5 flex-1 bg-white">
                    <div className="font-bold text-slate-900 text-xs">Rajebul Hasan Rajon</div>
                    <div className="text-slate-700 text-[11px]">Deputy Manager</div>
                    <div className="text-[10.5px] text-slate-600 font-mono">25/08/2026 18:48:54</div>
                  </div>
                </div>

                {/* Box 4 */}
                <div className="flex flex-col h-full">
                  <div className="bg-[#e6e9ff] font-bold text-slate-900 px-1.5 h-[34px] flex items-center justify-between text-[10px] whitespace-nowrap border-b border-slate-900 shrink-0">
                    <span>Approved By Operation Head</span>
                    <span className="text-[9.5px] font-normal text-slate-800 ml-0.5">: Approved</span>
                  </div>
                  <div className="p-2 space-y-0.5 flex-1 bg-white">
                    <div className="font-bold text-slate-900 text-xs">Rajebul Hasan Rajon</div>
                    <div className="text-slate-700 text-[11px]">Deputy Manager</div>
                    <div className="text-[10.5px] text-slate-600 font-mono">30/08/2026 16:33:29</div>
                  </div>
                </div>

                {/* Box 5 */}
                <div className="flex flex-col h-full">
                  <div className="bg-[#e6e9ff] font-bold text-slate-900 px-2 h-[34px] flex items-center justify-between text-[10.5px] whitespace-nowrap border-b border-slate-900 shrink-0">
                    <span>Approved By Accounts</span>
                    <span className="text-[10px] font-normal text-slate-800 ml-1">: Approved</span>
                  </div>
                  <div className="p-2 space-y-0.5 flex-1 bg-white">
                    <div className="font-bold text-slate-900 text-xs">Md.Rabiul Islam</div>
                    <div className="text-slate-700 text-[11px]">Assistant Manager</div>
                    <div className="text-[10.5px] text-slate-600 font-mono">31/08/2026 10:24:02</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
