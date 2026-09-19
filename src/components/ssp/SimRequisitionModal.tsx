import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  Smartphone,
  User,
  FileCheck,
  MessageSquare,
  Check,
  Printer,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";

export interface SimRequisitionData {
  id?: string;
  reqNum?: string;
  reqDate?: string;
  status?: string;
  requestFor?: string;
  simNumber?: string;
  existingLimit?: string;
  expectedLimit?: string;
  operator?: string;
  justification?: string;
  attachmentName?: string;
  attachmentSize?: string;
  onBehalf?: boolean;
  section?: string;
  requisitionFor?: string;
  requesterName?: string;
  requesterId?: string;
  department?: string;
  createdAt?: string;
}

interface SimRequisitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: SimRequisitionData | null;
}

export function SimRequisitionModal({ open, onOpenChange, data }: SimRequisitionModalProps) {
  // Use passed data or defaults from official slip mock
  const reqNo = data?.reqNum || data?.id || "PSL-RQ-SIM-398542";
  const reqDateFormatted = data?.reqDate ? data.reqDate : "22 Aug 2026";
  const status = data?.status || "Approved";
  const isApproved = status === "Approved";

  const employeeName = data?.requisitionFor
    ? data.requisitionFor.replace(/\s*\(EMP-[^)]+\)/, "").replace(/\s*\(Self\)/, "")
    : "Md. Anik Islam";
  const employeeId = data?.requisitionFor?.includes("EMP-")
    ? data.requisitionFor.match(/EMP-(\d+)/)?.[1] || "2023044078"
    : "2023044078";
  const designation = "Deputy Manager";
  const department = data?.department || "Business Innovation";
  const section = data?.section || "WEB-Team";
  const doj = "16 Aug 2023";
  const location = "PSL-Operation";
  const businessUnit = "Pakiza Software Limited";
  const contact = data?.simNumber || "01324726844";
  const responsible = data?.requesterName
    ? `${data.requesterName} (Asst. Manager)`
    : "Tahmid Afsar (Asst. Manager)";

  const requestForText = data?.requestFor || "SIM Balance Limit";
  const justificationText =
    data?.justification || "To Call Customer and Developer";
  const simNumber = data?.simNumber || (data ? "-" : "01324726844");
  const existingLimit = data?.existingLimit || (data ? "-" : "400 Taka");
  const expectedLimit = data?.expectedLimit || (data ? "-" : "800 Taka");
  const approvedLimit = data?.expectedLimit || (data ? "-" : "800 Taka");
  const documents = data?.attachmentName ? data.attachmentName : "No";
  const issueStatus = "Implemented";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl overflow-hidden gap-0 max-h-[92vh] flex flex-col [&>button]:hidden text-slate-700 dark:text-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-slate-700 shadow-3xs">
              <Smartphone className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">
                  SIM Requisition
                </h2>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                    isApproved
                      ? "bg-emerald-50 text-emerald-750 border-emerald-105"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  • {status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                # Application No: {reqNo.startsWith("PSL-") ? reqNo : `PSL-RQ-${reqNo}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right border-r border-slate-100 dark:border-slate-800 pr-4">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-widest font-extrabold">
                APPLICATION DATE
              </span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 block mt-0.5">
                {reqDateFormatted}
              </span>
              <span className="text-[9.5px] text-slate-400 dark:text-slate-500 block mt-0.5 font-semibold">
                Submitted 18:27 PM
              </span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shrink-0 shadow-3xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f8fafc]/40 dark:bg-slate-950/20">
          <div className="grid grid-cols-1 gap-5">
            {/* Employee Details Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-slate-900 shadow-3xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Request For (Employee Details)
                </span>
              </div>

              <div className="pl-1 text-xs flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {/* Employee Image */}
                <div className="w-[91px] h-[91px] shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shadow-3xs">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
                    alt={employeeName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details list */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-12 font-semibold text-slate-700 dark:text-slate-200 w-full max-w-3xl">
                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Employee Name:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {employeeName}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Employee ID:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">
                      {employeeId}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Designation:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {designation}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Department:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {department}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Section:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {section}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Date of Joining:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">
                      {doj}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Location:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {location}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Business Unit:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {businessUnit}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Contact:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">
                      {contact}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[105px] shrink-0">
                      Requisition By:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {responsible}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIM Requisition Particulars Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-[#fcfdfd] dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2.5 w-10 text-center whitespace-nowrap">SL</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">REQUEST FOR</th>
                  <th className="px-3 py-2.5 w-[22%] whitespace-nowrap">JUSTIFICATION</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">SIM NUMBER</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">EXISTING LIMIT</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">EXPECTED LIMIT</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">APPROVED LIMIT</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">DOCUMENTS</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">ISSUE STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      <div className="size-3.5 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                        <Check className="size-2.5 stroke-[3.5]" />
                      </div>
                      <span className="text-slate-850 dark:text-slate-200 font-mono font-bold">1</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-bold text-slate-850 dark:text-slate-100">
                    {requestForText}
                  </td>
                  <td className="px-3 py-2.5 italic break-words leading-tight">
                    "{justificationText}"
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {simNumber}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-slate-600 dark:text-slate-400 font-mono">
                    {existingLimit}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {expectedLimit}
                  </td>
                  <td className="px-3 py-2.5 font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {approvedLimit}
                  </td>
                  <td className="px-3 py-2.5">
                    {documents !== "No" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 underline font-medium">
                        <FileText className="size-3" />
                        {documents}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-normal">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded text-[9.5px] font-bold">
                      <ShieldCheck className="size-3 shrink-0" />
                      {issueStatus}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Approval Workflow & Signatures */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-1.5">
              <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-slate-900 shadow-3xs">
                <FileCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Approval Workflow & Signatures
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  role: "Manager",
                  name: "Rajebul Hasan Rajon",
                  title: "Deputy Manager",
                  date: "23/08/2026 · 09:25:43",
                  status: "Approved",
                },
                {
                  role: "HOD",
                  name: "Tahmid Afsar",
                  title: "Deputy Manager",
                  date: "23/08/2026 · 09:26:53",
                  status: "Approved",
                },
                {
                  role: "MD Sir",
                  name: "Rakibul Islam Khan",
                  title: "Managing Director (MD's)",
                  date: "23/08/2026 · 13:27:20",
                  status: "Approved",
                },
              ].map((sig, idx) => {
                const isSigApproved = sig.status === "Approved";
                return (
                  <div
                    key={idx}
                    className={`p-3 border rounded-xl flex flex-col justify-between h-[105px] relative text-slate-700 dark:text-slate-300 transition-colors ${
                      isSigApproved
                        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                        : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          {sig.role}: {sig.status}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 text-[8.5px] font-black uppercase ${
                            isSigApproved ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {isSigApproved ? "✓ Approved" : "⏳ Pending"}
                        </span>
                      </div>
                      <p
                        className={`text-[11.5px] font-extrabold leading-snug truncate ${
                          isSigApproved
                            ? "text-slate-800 dark:text-slate-100"
                            : "text-slate-500 dark:text-slate-400 italic"
                        }`}
                      >
                        {sig.name}
                      </p>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold truncate leading-tight">
                        {sig.title}
                      </p>
                    </div>
                    <div
                      className={`mt-2 pt-1.5 border-t flex justify-between items-center text-[8.5px] font-mono ${
                        isSigApproved
                          ? "border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400"
                          : "border-amber-200/50 dark:border-amber-800/50 text-amber-600 dark:text-amber-500"
                      }`}
                    >
                      <span>{sig.date.split(" · ")[1]}</span>
                      <span>{sig.date.split(" · ")[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comments & Approval Notes */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-1.5">
              <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-slate-900 shadow-3xs">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Comments History & Approval Notes
              </span>
            </div>

            <div className="space-y-3 pr-1">
              <div className="flex gap-3 items-start bg-slate-50/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-slate-750 dark:text-slate-250">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  AI
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11.5px] font-extrabold text-slate-755 dark:text-slate-255">
                      Md. Anik Islam <span className="text-slate-400 font-semibold">· Deputy Manager</span>
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-semibold font-mono">
                      22 Aug 2026 · 18:27
                    </span>
                  </div>
                  <p className="text-[11.5px] font-semibold text-slate-650 dark:text-slate-350 leading-relaxed">
                    "{justificationText}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/30 flex justify-between items-center shrink-0">
          <button
            onClick={() => window.print()}
            className="h-8.5 px-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="size-3.5" />
            <span>Print Slip</span>
          </button>

          <button
            onClick={() => onOpenChange(false)}
            className="h-8.5 px-4 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
