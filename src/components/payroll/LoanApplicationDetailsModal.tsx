import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  FileText,
  Sparkles,
  Printer,
  MessageSquare,
  Send,
  Plus
} from "lucide-react";

export interface LoanAmortizationItem {
  installmentNo: number;
  period: string;
  payment: number;
  balance: number;
}

export interface LoanRecord {
  id: string | number;
  reqNo: string;
  applicationDate: string;
  submittedTime: string;
  status: "Approved" | "Pending" | "Rejected" | "Fully Paid" | "Active" | "Closed";
  approvalStatus?: "Approved" | "Pending" | "Rejected";
  company?: string;
  area?: string;
  empId: string;
  empName: string;
  designation: string;
  department: string;
  section: string;
  operationalDivision: string;
  joinDate: string;
  basicSalary: number;
  grossSalary: number;
  documents?: string;
  avatarUrl?: string;
  requestedAmount: number;
  approvedAmount: number;
  installmentTerm: number;
  paidMonths?: number;
  monthlyRate: number;
  remainingBalance?: number;
  reason: string;
  submitter: {
    name: string;
    empId: string;
    designation: string;
    department: string;
    time: string;
    date: string;
  };
  comments?: Array<{
    author: string;
    role: string;
    timestamp: string;
    text: string;
  }>;
}

interface LoanApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanRecord | null;
  onPrintPdf?: (loan: LoanRecord) => void;
}

export function generateAmortizationSchedule(approvedAmount: number, termMonths: number, startDateStr?: string): LoanAmortizationItem[] {
  const schedule: LoanAmortizationItem[] = [];
  if (termMonths <= 0 || approvedAmount <= 0) return schedule;

  const monthlyPay = Math.round(approvedAmount / termMonths);
  let remaining = approvedAmount;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let baseDate = new Date();
  if (startDateStr) {
    const parts = startDateStr.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        baseDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      } else {
        baseDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
  }

  for (let i = 1; i <= termMonths; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i - 1, 1);
    const period = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    const payment = i === termMonths ? remaining : monthlyPay;
    remaining = Math.max(0, remaining - payment);

    schedule.push({
      installmentNo: i,
      period,
      payment,
      balance: remaining,
    });
  }

  return schedule;
}

export function LoanApplicationDetailsModal({
  isOpen,
  onClose,
  loan,
  onPrintPdf,
}: LoanApplicationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "amortization">("summary");
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<
    Array<{ author: string; role: string; timestamp: string; text: string }>
  >([]);

  if (!isOpen || !loan) return null;

  const schedule = generateAmortizationSchedule(
    loan.approvedAmount || loan.requestedAmount,
    loan.installmentTerm,
    loan.applicationDate
  );

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      {
        author: "HR Reviewer",
        role: "Approver",
        timestamp: "Just now",
        text: commentText.trim(),
      },
    ]);
    setCommentText("");
  };

  const allComments = [...(loan.comments || []), ...localComments];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* ── TOP HEADER (matches screenshot) ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="size-4.5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Loan Application Details
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {loan.reqNo || `LN-${loan.id}`}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    loan.status === "Approved"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : loan.status === "Fully Paid"
                      ? "bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-950/20 dark:text-teal-400"
                      : loan.status === "Rejected"
                      ? "bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-400"
                      : "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400"
                  }`}
                >
                  {loan.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* PDF Button */}
            <button
              onClick={() => onPrintPdf?.(loan)}
              type="button"
              className="h-8 px-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Download or Print PDF"
            >
              <FileText className="size-3.5 text-rose-500" />
              <span>PDF</span>
            </button>

            {/* Application Date & Time */}
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <Calendar className="size-3 text-slate-400" />
                <span>APPLICATION DATE</span>
              </div>
              <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                {loan.applicationDate}
              </div>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-0.5">
                <Clock className="size-2.5 text-slate-400" />
                <span>Submitted {loan.submittedTime || "5:37 PM"}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              className="size-8 rounded-lg border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white dark:bg-slate-900/60">
          
          {/* ── EMPLOYEE DETAILS SECTION (matches screenshot 2 & 3) ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="size-5 rounded-full border border-blue-400 text-blue-600 flex items-center justify-center shrink-0">
                <User className="size-3" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                EMPLOYEE DETAILS
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Employee Photo */}
                <div className="size-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 shadow-2xs">
                  <img
                    src={loan.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={loan.empName}
                    className="size-full object-cover"
                    onError={(e) => {
                      // Fallback image if broken
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>

                {/* 2-Column Key/Value Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Employee Name:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{loan.empName}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Designation:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{loan.designation}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Section:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{loan.section}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Operational Division:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{loan.operationalDivision}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Documents:</span>
                      <span className="text-slate-400">{loan.documents || ""}</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Employee ID:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">{loan.empId}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Department:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{loan.department}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Date of Joining:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">{loan.joinDate}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-36 text-slate-400 font-medium shrink-0">Basic / Gross Salary:</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                        ৳{loan.basicSalary.toLocaleString()} / ৳{loan.grossSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2 FULL-WIDTH PILL TABS (matches screenshot) ── */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all select-none cursor-pointer ${
                activeTab === "summary"
                  ? "bg-[#0052cc] hover:bg-[#0747a6] text-white shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
              }`}
            >
              LOAN SUMMARY & WORKFLOW
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("amortization")}
              className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all select-none cursor-pointer ${
                activeTab === "amortization"
                  ? "bg-[#0052cc] hover:bg-[#0747a6] text-white shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
              }`}
            >
              REPAYMENT & AMORTIZATION SCHEDULE
            </button>
          </div>

          {/* ── TAB 1: LOAN SUMMARY & WORKFLOW ── */}
          {activeTab === "summary" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* 1. LOAN TERMS & DETAILS */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <FileText className="size-3.5 text-blue-500" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    LOAN TERMS & DETAILS
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        REQUESTED AMOUNT
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-2 block">
                        ৳{loan.requestedAmount.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        APPROVED AMOUNT
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-2 block">
                        ৳{loan.approvedAmount.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        INSTALLMENT TERM
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-2 block">
                        {loan.installmentTerm} Months
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        MONTHLY RATE
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-2 block">
                        ৳{loan.monthlyRate.toLocaleString()} <span className="text-xs font-normal text-slate-400">/mo</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. PURPOSE & REMARKS */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <FileText className="size-3.5 text-blue-500" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    PURPOSE & REMARKS
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs min-h-[70px] flex items-center">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 italic">
                    "{loan.reason || "Personal Loan Application"}"
                  </p>
                </div>
              </div>

              {/* 3. APPROVAL WORKFLOW & SIGNATURES */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <FileText className="size-3.5 text-blue-500" />
                  <span className="text-[11px] font-extrabold tracking-wide">
                    Approval Workflow & Signatures
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs">
                  <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-950/20">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      SUBMITTED BY
                    </span>
                    <div className="mt-1">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
                        {loan.submitter?.name} ({loan.submitter?.empId})
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {loan.submitter?.designation}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {loan.submitter?.department}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 font-mono">
                      <span>{loan.submitter?.time || "05:37 PM"}</span>
                      <span>{loan.submitter?.date || "01/09/2026"}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── TAB 2: REPAYMENT & AMORTIZATION SCHEDULE ── */}
          {activeTab === "amortization" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* REPAYMENT PROJECTIONS */}
              <div className="space-y-2">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    REPAYMENT PROJECTIONS
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estimates of monthly deductions from employee base salary starting from application period.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        <th className="px-6 py-3.5 text-center w-28">INSTALLMENT</th>
                        <th className="px-6 py-3.5">SCHEDULED PERIOD</th>
                        <th className="px-6 py-3.5 text-right">REPAYMENT AMOUNT</th>
                        <th className="px-6 py-3.5 text-right">REMAINING BALANCE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 font-mono">
                      {schedule.map((row) => (
                        <tr key={row.installmentNo} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-3 text-center font-bold text-slate-500 font-sans">
                            {row.installmentNo}
                          </td>
                          <td className="px-6 py-3 font-semibold text-slate-800 dark:text-slate-200 font-sans">
                            {row.period}
                          </td>
                          <td className="px-6 py-3 text-right text-blue-600 dark:text-blue-400 font-bold">
                            {row.payment.toFixed(2)}
                          </td>
                          <td className="px-6 py-3 text-right text-slate-800 dark:text-slate-200 font-bold">
                            {row.balance.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* APPROVAL WORKFLOW & SIGNATURES */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <FileText className="size-3.5 text-blue-500" />
                  <span className="text-[11px] font-extrabold tracking-wide">
                    Approval Workflow & Signatures
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs">
                  <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-950/20">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      SUBMITTED BY
                    </span>
                    <div className="mt-1">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
                        {loan.submitter?.name} ({loan.submitter?.empId})
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {loan.submitter?.designation}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {loan.submitter?.department}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 font-mono">
                      <span>{loan.submitter?.time || "05:37 PM"}</span>
                      <span>{loan.submitter?.date || "01/09/2026"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMMENTS & APPROVAL NOTES (as shown in Screenshot 3) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <FileText className="size-3.5 text-blue-500" />
                  <span className="text-[11px] font-extrabold tracking-wide">
                    Comments & Approval Notes
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-4">
                  {allComments.length > 0 ? (
                    <div className="space-y-2.5">
                      {allComments.map((c, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs">
                          <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold">
                            <span>{c.author} ({c.role})</span>
                            <span>{c.timestamp}</span>
                          </div>
                          <p className="mt-1 text-slate-700 dark:text-slate-200">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes or remarks logged yet.</p>
                  )}

                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add an internal review comment..."
                      className="flex-1 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="px-4 h-9 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition-all"
                    >
                      <Send className="size-3" />
                      Post Note
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

