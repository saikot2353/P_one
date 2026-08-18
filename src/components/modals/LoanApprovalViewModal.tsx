import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Briefcase,
  Building2,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  Banknote,
  Info,
  Send,
  MessageSquare,
  BadgePercent,
  Layers,
  ArrowRight,
  ShieldCheck,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface LoanApprovalModalData {
  id: string;
  moduleName?: string;
  reqNo?: string;
  applicationDate?: string;
  submittedTime?: string;
  status: "Pending" | "Approved" | "Rejected";
  employee: {
    name: string;
    id: string;
    designation: string;
    department: string;
    section?: string;
    division?: string;
    location?: string;
    joiningDate: string;
    basicSalary: number;
    grossSalary: number;
  };
  terms: {
    requestedAmount: number;
    approvedAmount: number;
    installmentTermMonths: number;
    monthlyRate: number;
    reason: string;
  };
  timeline?: Array<{
    stage: string;
    roleLabel: string;
    approverName: string;
    approverDesignation?: string;
    status: "approved" | "pending" | "rejected";
    date: string;
  }>;
  amortizationSchedule?: Array<{
    installmentNo: number;
    scheduledPeriod: string;
    repaymentAmount: number;
    remainingBalance: number;
  }>;
  comments?: Array<{
    author: string;
    role: string;
    timestamp: string;
    text: string;
    avatarBg?: string;
  }>;
}

interface LoanApprovalViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: LoanApprovalModalData | null;
  onApprove?: (id: string, approvedAmount?: number, termMonths?: number) => void;
  onReject?: (id: string) => void;
}

export function LoanApprovalViewModal({
  isOpen,
  onClose,
  data,
  onApprove,
  onReject,
}: LoanApprovalViewModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "amortization">("summary");
  const [newComment, setNewComment] = useState("");
  const [commentsList, setCommentsList] = useState<
    Array<{ author: string; role: string; timestamp: string; text: string }>
  >([]);

  const [isEditing, setIsEditing] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [installmentTerm, setInstallmentTerm] = useState<number>(0);
  const [tempApprovedAmount, setTempApprovedAmount] = useState<number>(0);
  const [tempInstallmentTerm, setTempInstallmentTerm] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const initialApprovedAmount = data.terms?.approvedAmount || (data.status === "Approved" ? (data.terms?.requestedAmount ?? 1000) : (data.terms?.requestedAmount ?? 1000));
      setApprovedAmount(initialApprovedAmount);
      setInstallmentTerm(data.terms?.installmentTermMonths ?? 4);
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  // Fallback / default data if caller passes minimal info
  const loan: LoanApprovalModalData = {
    id: data?.id || "2026079299",
    moduleName: data?.moduleName || "Loan",
    reqNo: data?.reqNo || data?.id || "LN-2026079299",
    applicationDate: data?.applicationDate || "14 Jul 2026",
    submittedTime: data?.submittedTime || "09:18 AM",
    status: data?.status || "Pending",
    employee: {
      name: data?.employee?.name || "Mr X",
      id: data?.employee?.id || "2026079299",
      designation: data?.employee?.designation || "Placeholder Designation",
      department: data?.employee?.department || "12312",
      section: data?.employee?.section || "Project Resource & Strategy",
      division: data?.employee?.division || "Pakiza Software Limited",
      location: data?.employee?.location || "PSL-Operation",
      joiningDate: data?.employee?.joiningDate || "2026-07-25T00:00:00Z",
      basicSalary: data?.employee?.basicSalary ?? 0,
      grossSalary: data?.employee?.grossSalary ?? 0,
    },
    terms: {
      requestedAmount: data?.terms?.requestedAmount ?? 1000,
      approvedAmount: approvedAmount,
      installmentTermMonths: installmentTerm,
      monthlyRate: Math.round(approvedAmount / Math.max(1, installmentTerm)),
      reason: data?.terms?.reason || "ddddddddddvc cxv xsxvs",
    },
    timeline: data?.timeline || [
      {
        stage: "STAGE 1: HR, ADMIN AND COMPLIANCE",
        roleLabel: "STAGE 1",
        approverName: "Rajebul Hasan Rajon",
        approverDesignation: "HR, Admin and Compliance",
        status: "pending",
        date: "2026-08-12T06:58:49.285855+00:00",
      },
      {
        stage: "STAGE 2: 12312",
        roleLabel: "STAGE 2",
        approverName: data?.employee?.name || "Mr X",
        approverDesignation: "Department Head",
        status: "approved",
        date: "2026-08-18T03:57:57.3663+00:00",
      },
      {
        stage: "STAGE 3: ABC",
        roleLabel: "STAGE 3",
        approverName: "Md. Sadmanur Islam Shishir",
        approverDesignation: "ABC Approval Authority",
        status: "pending",
        date: "2026-08-12T06:58:49.285855+00:00",
      },
    ],
    amortizationSchedule: generateDefaultSchedule(approvedAmount, installmentTerm),
    comments: data?.comments || [],
  };

  const monthlyRate = Math.round(approvedAmount / Math.max(1, installmentTerm));
  const amortizationSchedule = generateDefaultSchedule(approvedAmount, installmentTerm);

  const handleStartEdit = () => {
    setTempApprovedAmount(approvedAmount);
    setTempInstallmentTerm(installmentTerm);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (tempApprovedAmount < 0) {
      toast.error("Approved amount cannot be negative");
      return;
    }
    if (tempInstallmentTerm <= 0) {
      toast.error("Installment term must be at least 1 month");
      return;
    }
    setApprovedAmount(tempApprovedAmount);
    setInstallmentTerm(tempInstallmentTerm);
    setIsEditing(false);
    toast.success("Loan terms updated locally!");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const item = {
      author: "Current Reviewer",
      role: "Approval Officer",
      timestamp: "Just now",
      text: newComment.trim(),
    };
    setCommentsList([...commentsList, item]);
    setNewComment("");
    toast.success("Note added successfully");
  };

  const currentComments = [...(loan.comments || []), ...commentsList];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#F8FAFC] dark:bg-[#0B1120] w-full max-w-5xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* TOP MODAL HEADER */}
        <div className="bg-white dark:bg-slate-900 px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[#2563eb] flex items-center justify-center shrink-0">
              <Banknote className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {loan.moduleName} details — ID: {loan.id}
                </h2>
                {loan.status === "Pending" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                    <span className="size-1 rounded-full bg-amber-500 animate-pulse" /> PENDING
                  </span>
                )}
                {loan.status === "Approved" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                    <CheckCircle2 className="size-2.5" /> APPROVED
                  </span>
                )}
                {loan.status === "Rejected" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                    <XCircle className="size-2.5" /> REJECTED
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Verify employee information, approval flow timelines, and repayment projections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end border-r border-slate-200 dark:border-slate-800 pr-3.5">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                APPLICATION DATE
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {loan.applicationDate}
              </span>
              <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                <Clock className="size-3 text-slate-400" /> Submitted {loan.submittedTime}
              </span>
            </div>

            <button
              onClick={onClose}
              className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* MODAL MAIN CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* CARD 1: EMPLOYEE HERO BOX (Flat & Compact Style) */}
          <div className="bg-slate-50/80 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-[240px]">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#2563eb] dark:text-blue-400 font-bold text-sm flex items-center justify-center shrink-0">
                {getInitials(loan.employee.name)}
              </div>
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  REQUEST FOR
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {loan.employee.name}
                </h3>
                <div className="text-xs font-medium text-slate-400 mt-0.5">
                  Employee ID · <span className="font-mono">{loan.employee.id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-2.5 flex-1 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-slate-800 pt-3 md:pt-0 md:pl-5">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Briefcase className="size-3 text-slate-400" /> DESIGNATION
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {loan.employee.designation}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Building2 className="size-3 text-slate-400" /> DEPARTMENT
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {loan.employee.department}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Layers className="size-3 text-slate-400" /> SECTION
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {loan.employee.section || "N/A"}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar className="size-3 text-slate-400" /> JOINING DATE
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 font-mono">
                  {loan.employee.joiningDate}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" /> OPERATIONAL DIVISION
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {loan.employee.division || loan.employee.location || "Placeholder Unit"}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Banknote className="size-3 text-slate-400" /> BASIC / GROSS SALARY
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 font-mono">
                  ৳{loan.employee.basicSalary.toLocaleString()} / ৳{loan.employee.grossSalary.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* TAB SWITCHER BUTTONS (Image 1 & 2 Tabs) - Filled Container style */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl w-full border border-slate-200/60 dark:border-slate-850">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center justify-center gap-2 ${
                activeTab === "summary"
                  ? "bg-white dark:bg-slate-900 text-[#2563eb] shadow-sm"
                  : "text-slate-555 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="size-3.5" /> 1. {loan.moduleName?.toUpperCase() || "LOAN"} SUMMARY & FLOW
            </button>
            {loan.moduleName === "Loan" && (
              <button
                onClick={() => setActiveTab("amortization")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center justify-center gap-2 ${
                  activeTab === "amortization"
                    ? "bg-white dark:bg-slate-900 text-[#2563eb] shadow-sm"
                    : "text-slate-555 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Calendar className="size-3.5" /> 2. AMORTIZATION SCHEDULE
              </button>
            )}
          </div>

          {/* TAB 1: LOAN SUMMARY & FLOW */}
          {activeTab === "summary" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* SECTION: LOAN TERMS & DETAILS */}
              <div className="bg-slate-50/80 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="size-3.5 text-[#2563eb]" /> {loan.moduleName?.toUpperCase() || "LOAN"} TERMS & DETAILS
                  </div>
                  {loan.moduleName === "Loan" && (
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleCancelEdit}
                            className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="px-2.5 py-1 rounded-md bg-[#2563eb] hover:bg-blue-700 text-white text-[10px] font-bold transition-colors shadow-sm"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleStartEdit}
                          className="px-2.5 py-1 rounded-md bg-[#2563eb]/10 hover:bg-[#2563eb]/20 text-[#2563eb] dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 text-[10px] font-bold transition-colors flex items-center gap-1"
                        >
                          <Pencil className="size-2.5" />
                          Edit Terms
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Table Layout for terms */}
                <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden mt-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          <th className="px-5 py-3">REQUESTED AMOUNT</th>
                          <th className="px-5 py-3">APPROVED AMOUNT</th>
                          <th className="px-5 py-3">INSTALLMENT TERM</th>
                          <th className="px-5 py-3">MONTHLY RATE</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                        <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="px-5 py-4 font-mono">
                            ৳{loan.terms.requestedAmount.toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            {isEditing ? (
                              <div className="relative max-w-[140px]">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2563eb]">৳</span>
                                <input
                                  type="number"
                                  value={tempApprovedAmount}
                                  onChange={(e) => setTempApprovedAmount(Number(e.target.value))}
                                  className="w-full bg-transparent border-b border-[#2563eb] py-0.5 pl-3.5 text-xs font-semibold font-mono focus:outline-none focus:border-blue-600 text-slate-900 dark:text-white"
                                />
                              </div>
                            ) : (
                              <span className="font-mono">৳{approvedAmount.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {isEditing ? (
                              <div className="relative max-w-[110px]">
                                <input
                                  type="number"
                                  value={tempInstallmentTerm}
                                  onChange={(e) => setTempInstallmentTerm(Number(e.target.value))}
                                  className="w-full bg-transparent border-b border-slate-350 dark:border-slate-700 py-0.5 pr-8 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                                  min="1"
                                  max="60"
                                />
                                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-slate-400">Months</span>
                              </div>
                            ) : (
                              <span>{installmentTerm} Months</span>
                            )}
                          </td>
                          <td className="px-5 py-4 font-mono">
                            ৳{monthlyRate.toLocaleString()}<span className="text-[10px] font-medium text-slate-550 ml-0.5">/mo</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Reason detail line, cleanly integrated underneath */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex flex-col gap-0.5">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Reason / Remarks
                  </span>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 italic">
                    "{loan.terms.reason}"
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-200/50 dark:bg-slate-800/60 my-5" />

              {/* SECTION: APPROVAL FLOW TIMELINE */}
              <div className="py-1 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-800/80 pb-2.5">
                  <ShieldCheck className="size-3.5 text-[#2563eb]" /> APPROVAL FLOW TIMELINE
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loan.timeline?.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/80 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#2563eb] dark:text-blue-400">
                          {step.stage || `STAGE ${idx + 1}`}
                        </span>
                        {step.status === "approved" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                            <CheckCircle2 className="size-3" /> APPROVED
                          </span>
                        )}
                        {step.status === "pending" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">
                            <Clock className="size-3" /> PENDING
                          </span>
                        )}
                        {step.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-500/20">
                            <XCircle className="size-3" /> REJECTED
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <div className="size-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-400 flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                          {step.approverName}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                          Status: {step.status} • <span className="font-mono text-[10px]">{step.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AMORTIZATION SCHEDULE */}
          {activeTab === "amortization" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* SECTION: REPAYMENT PROJECTIONS */}
              <div className="py-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-250/60 dark:border-slate-800 pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-[#2563eb]" /> REPAYMENT PROJECTIONS
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-450 mt-0.5">
                      Estimates of monthly deductions from employee base salary starting from application period.
                    </p>
                  </div>
                </div>

                {/* INFO ALERT BOX (From Image 2) */}
                <div className="bg-blue-50/40 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3 flex items-start gap-2.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                  <Info className="size-4 text-[#2563eb] shrink-0 mt-0.5" />
                  <div>
                    Calculations assume zero percent company interest. Installments are deducted automatically during monthly process execution.
                  </div>
                </div>

                {/* AMORTIZATION TABLE */}
                <div className="border border-slate-200/60 dark:border-slate-800 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-450">
                          <th className="px-5 py-2.5 text-center w-24">INSTALLMENT</th>
                          <th className="px-5 py-2.5">SCHEDULED PERIOD</th>
                          <th className="px-5 py-2.5 text-right">REPAYMENT AMOUNT</th>
                          <th className="px-5 py-2.5 text-right">REMAINING BALANCE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-350">
                        {amortizationSchedule?.map((row) => (
                          <tr key={row.installmentNo} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-5 py-2.5 text-center font-mono font-bold text-slate-400">
                              {row.installmentNo}
                            </td>
                            <td className="px-5 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                              {row.scheduledPeriod}
                            </td>
                            <td className="px-5 py-2.5 text-right font-mono text-slate-800 dark:text-white">
                              ৳{row.repaymentAmount.toLocaleString()}
                            </td>
                            <td className="px-5 py-2.5 text-right font-mono text-slate-800 dark:text-white">
                              ৳{row.remainingBalance.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200/50 dark:bg-slate-800/60 my-5" />

              {/* SECTION: COMMENTS & APPROVAL NOTES */}
              <div className="py-1 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-800/80 pb-2.5">
                  <FileText className="size-3.5 text-[#2563eb]" /> Comments & Approval Notes
                </div>

                {currentComments.length > 0 ? (
                  <div className="space-y-3">
                    {currentComments.map((comment, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/80 dark:bg-slate-950/60 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-800/80 flex items-start gap-3"
                      >
                        <div className="size-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {getInitials(comment.author)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {comment.author}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400">
                                · {comment.role}
                              </span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs font-medium text-slate-400">
                    No comments or approval notes yet.
                  </div>
                )}

                {/* Add Comment Input Form */}
                <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add an approval note or remark..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Send className="size-3.5" /> Note
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-white dark:bg-slate-900 px-5 py-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Request Ref: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{loan.reqNo}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none h-9 px-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            >
              Close
            </button>

            {loan.status === "Pending" && (
              <>
                <button
                  onClick={() => {
                    if (onReject) onReject(loan.id);
                    else toast.success(`Loan request ${loan.id} rejected.`);
                    onClose();
                  }}
                  className="flex-1 sm:flex-none h-9 px-4 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle className="size-3.5" /> Reject
                </button>

                <button
                  onClick={() => {
                    if (onApprove) onApprove(loan.id, approvedAmount, installmentTerm);
                    else toast.success(`Loan request ${loan.id} approved successfully with amount ৳${approvedAmount.toLocaleString()} over ${installmentTerm} months!`);
                    onClose();
                  }}
                  className="flex-1 sm:flex-none h-9 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="size-3.5" /> Approve Loan
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function generateDefaultSchedule(requestedAmount: number, months: number) {
  const perMonth = Math.round(requestedAmount / Math.max(1, months));
  const monthsArr = [
    "Jun 2026",
    "Jul 2026",
    "Aug 2026",
    "Sep 2026",
    "Oct 2026",
    "Nov 2026",
    "Dec 2026",
    "Jan 2027",
    "Feb 2027",
    "Mar 2027",
    "Apr 2027",
    "May 2027",
  ];

  let remaining = requestedAmount;
  const list = [];

  for (let i = 1; i <= months; i++) {
    const isLast = i === months;
    const amount = isLast ? remaining : Math.min(perMonth, remaining);
    remaining = Math.max(0, remaining - amount);
    list.push({
      installmentNo: i,
      scheduledPeriod: monthsArr[(i - 1) % monthsArr.length],
      repaymentAmount: amount,
      remainingBalance: remaining,
    });
  }

  return list;
}
