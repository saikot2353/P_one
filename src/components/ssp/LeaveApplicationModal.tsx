import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  CheckCircle2,
  CalendarDays,
  Clock,
  Phone,
  User,
  MapPin,
  Paperclip,
  FileText,
  FileCheck,
  CheckSquare,
  Building,
  Layers,
  MessageSquare,
  Check,
} from "lucide-react";

interface LeaveApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaveApplicationModal({ open, onOpenChange }: LeaveApplicationModalProps) {
  const details = [
    ["Type", "Sick Leave"],
    ["From", "04/04/2026"],
    ["Category", "Full Day Leave"],
    ["To", "04/04/2026"],
    ["Documents", "—"],
    ["Duration", "1 Day"],
    ["Contact", "01750021154"],
    ["Responsible", "Md. Anik Islam (Dy. Manager)"],
    ["Address", "Jahangirnagar University"],
    ["Purpose", "Semester Final Exam"],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl overflow-hidden gap-0 max-h-[92vh] flex flex-col [&>button]:hidden text-slate-700 dark:text-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-700 shadow-3xs">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">
                  Leave Application
                </h2>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-750 border-emerald-105">
                  • Approved
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                # Application No: PSL-RQ-LEAVE-372569
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right border-r border-slate-100 dark:border-slate-800 pr-4">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-widest font-extrabold">
                APPLICATION DATE
              </span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 block mt-0.5">
                01 Apr 2026
              </span>
              <span className="text-[9.5px] text-slate-400 dark:text-slate-500 block mt-0.5 font-semibold">
                Submitted 09:18 AM
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
                <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-900 shadow-3xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Employee Details</span>
              </div>

              <div className="pl-1 text-xs flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {/* Employee Image */}
                <div className="w-[91px] h-[91px] shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shadow-3xs">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80"
                    alt="Tahmid Afsar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details list */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-12 font-semibold text-slate-700 dark:text-slate-200 w-full max-w-3xl">
                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Employee Name:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">Tahmid Afsar</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Employee ID:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">2023043910</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Designation:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">Asst. Manager</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Department:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">Business Innovation</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Section:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">APPS Team</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Date of Joining:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">15 Mar 2024</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Location:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">PSL-Operation</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Business Unit:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">Pakiza Software Limited</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Contact:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">{details.find(d => d[0] === "Contact")?.[1] || "01750021154"}</span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-[95px] shrink-0">Responsible:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{details.find(d => d[0] === "Responsible")?.[1] || "Md. Anik Islam (Dy. Manager)"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Balance Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-[#fcfdfd] dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2.5 w-10 text-center whitespace-nowrap">SL</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">TYPE</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">CATEGORY</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">DATE RANGE</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">DUR.</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">ENJ. / BAL.</th>
                  <th className="px-3 py-2.5 w-[18%] whitespace-nowrap">PURPOSE</th>
                  <th className="px-3 py-2.5 w-[18%] whitespace-nowrap">ADDRESS</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">DOCS</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">PAY TYPE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      <div className="size-3.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Check className="size-2.5 stroke-[3.5]" />
                      </div>
                      <span className="text-slate-850 dark:text-slate-200 font-mono font-bold">2</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-bold text-slate-855 dark:text-slate-100">Sick Leave</td>
                  <td className="px-3 py-2.5">{details.find(d => d[0] === "Category")?.[1] || "Full Day Leave"}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] leading-tight">
                    <div>04/04/2026</div>
                    <div className="text-slate-400 font-normal">to 04/04/2026</div>
                  </td>
                  <td className="px-3 py-2.5">1 Day</td>
                  <td className="px-3 py-2.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">2</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">12</span>
                  </td>
                  <td className="px-3 py-2.5 italic break-words leading-tight">"{details.find(d => d[0] === "Purpose")?.[1] || "Semester Final Exam"}"</td>
                  <td className="px-3 py-2.5 break-words leading-tight">{details.find(d => d[0] === "Address")?.[1] || "Jahangirnagar University"}</td>
                  <td className="px-3 py-2.5 text-slate-400 dark:text-slate-500 font-normal">None</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 rounded text-[9px] font-bold">
                      <FileText className="size-2.5 shrink-0" />
                      With Pay
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Approval Workflow & Signatures */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-1.5">
              <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-900 shadow-3xs">
                <FileCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Approval Workflow & Signatures</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {[
                {
                  role: "Manager",
                  name: "Md. Zahidul Islam",
                  title: "COO",
                  date: "02 Apr 2026 · 13:50",
                  status: "Approved",
                },
                {
                  role: "Head of HR",
                  name: "Rajebul Hasan Rajon",
                  title: "Deputy Manager",
                  date: "21 Apr 2026 · 20:11",
                  status: "Approved",
                },
                {
                  role: "Managing Director",
                  name: "Pending Signature",
                  title: "MD",
                  date: "N/A · N/A",
                  status: "Pending",
                }
              ].map((sig, idx) => {
                const isApproved = sig.status === "Approved";
                return (
                  <div
                    key={idx}
                    className={`flex-1 p-3 border rounded-xl flex flex-col justify-between h-[105px] relative text-slate-700 dark:text-slate-300 transition-colors ${
                      isApproved 
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10' 
                        : 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          {sig.role}
                        </span>
                        <span className={`inline-flex items-center gap-0.5 text-[8.5px] font-black uppercase ${
                          isApproved ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {isApproved ? "✓ Approved" : "⏳ Pending"}
                        </span>
                      </div>
                      <p className={`text-[11.5px] font-extrabold leading-snug truncate ${
                        isApproved ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 italic'
                      }`}>
                        {sig.name}
                      </p>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold truncate leading-tight">
                        {sig.title}
                      </p>
                    </div>
                    <div className={`mt-2 pt-1.5 border-t flex justify-between items-center text-[8.5px] font-mono ${
                      isApproved 
                        ? 'border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400' 
                        : 'border-amber-200/50 dark:border-amber-800/50 text-amber-600 dark:text-amber-500'
                    }`}>
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
              <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-900 shadow-3xs">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Comments & Approval Notes</span>
            </div>

            <div className="space-y-3 pr-1">
              <div className="flex gap-3 items-start bg-slate-50/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-slate-750 dark:text-slate-250">
                <div className="w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  TA
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11.5px] font-extrabold text-slate-755 dark:text-slate-255">
                      Tahmid Afsar <span className="text-slate-400 font-semibold">· Employee</span>
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-semibold font-mono">01 Apr 2026 · 09:18</span>
                  </div>
                  <p className="text-[11.5px] font-semibold text-slate-650 dark:text-slate-350 leading-relaxed">
                    Request submitted for Semester Final Exam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/30 flex justify-end shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="h-8.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
