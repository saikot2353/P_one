import { Printer, X } from "lucide-react";
import clientLogo from "@/components/dashboard/client_logo.png";

interface IOURequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    reqNo?: string;
    reqDate?: string;
    reqFor?: string;
    chequeRequired?: string;
    tenor?: string;
    expectedDate?: string;
    adjustmentDate?: string;
    previousUnadjusted?: string;
    status?: string;
    preparedBy?: string;
    empId?: string;
    dept?: string;
    purpose?: string;
    remarks?: string;
    amount?: number;
  };
}

export function IOURequisitionModal({ isOpen, onClose, data }: IOURequisitionModalProps) {
  if (!isOpen) return null;

  const reqNo = data?.reqNo || "MRN/2026/00035";
  const reqDate = data?.reqDate || "25/08/2026";
  const reqFor = data?.reqFor || "IOU - Salary Advance";
  const chequeRequired = data?.chequeRequired || "No";
  const tenor = data?.tenor || "60";
  const expectedDate = data?.expectedDate || "25/08/2026";
  const adjustmentDate = data?.adjustmentDate || "24/10/2026";
  const previousUnadjusted = data?.previousUnadjusted || "0.00";
  const status = data?.status || "Approved";

  const preparedBy = data?.preparedBy || "Tahmid Afsar";
  const empId = data?.empId || "2023043910";
  const dept = data?.dept || "Business Innovation";
  const purpose = data?.purpose || "Family Issue";
  const remarks = data?.remarks || "";
  const amount = data?.amount || 5000;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto font-['Times_New_Roman',_Times,_serif]">
      <div className="bg-white rounded-xl max-w-6xl w-full flex flex-col shadow-2xl border border-slate-300 overflow-hidden text-xs my-auto">
        {/* Modal Header Bar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0 font-sans">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10.5px] font-bold rounded">
              Pakiza Software Official Slip
            </span>
            <h3 className="text-xs font-bold text-white">
              {reqNo} — {reqFor}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <Printer className="size-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="size-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 grid place-items-center text-xs font-bold cursor-pointer transition"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Printable Requisition Slip Document */}
        <div className="p-6 bg-slate-100 overflow-y-auto max-h-[85vh]">
          <div id="printable-iou-slip" className="bg-white p-8 rounded border border-slate-300 shadow-md space-y-5 text-slate-900 text-xs font-['Times_New_Roman',_Times,_serif]">
            {/* Top Company Header matching exact Pakiza Software screenshot */}
            <div className="flex items-center justify-between border-b border-slate-300 pb-3.5 gap-4">
              <div className="w-44 shrink-0">
                <img
                  src={clientLogo}
                  alt="Pakiza Software Logo"
                  className="h-11 object-contain"
                />
              </div>

              <div className="flex-1 text-center space-y-0.5">
                <h2 className="font-bold text-base text-slate-900 tracking-tight">
                  Pakiza Software Limited
                </h2>
                <p className="text-xs text-slate-700 font-normal">
                  Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205
                </p>
                <h3 className="font-bold text-xs text-slate-900 pt-0.5">
                  Cash Requisition (PSL-Operation)
                </h3>
                <p className="text-xs font-bold text-slate-800">
                  {preparedBy} ({empId})
                </p>
              </div>

              <div className="w-44 shrink-0" />
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
                      <span>Five Thousand Taka</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 5-Stage Signature Approval Grid matching screenshot */}
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
    </div>
  );
}
