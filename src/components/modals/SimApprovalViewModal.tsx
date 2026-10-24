import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Building2,
  MapPin,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  Paperclip,
  Download,
  ShieldCheck,
  Signal,
  Layers,
  CalendarDays,
  UserCheck,
  BuildingIcon,
  CreditCard,
  Hash,
  Printer,
  Hourglass,
  Calendar,
  FileCheck2,
  FileText,
  User,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SingleSimPrintModal } from "./SingleSimPrintModal";

export interface SimApprovalModalData {
  id: string;
  reqNo: string;
  applicationDate: string;
  submittedTime: string;
  status: "Pending" | "Approved" | "Rejected";
  requestType: "New SIM" | "SIM Balance Limit" | "SIM Replacement";
  employee: {
    name: string;
    id: string;
    designation: string;
    department: string;
    section?: string;
    division?: string;
    location?: string;
    joiningDate?: string;
    businessUnit?: string;
    requisitionBy?: string;
    contact?: string;
    avatarUrl?: string;
  };
  simDetails: {
    operator: string;
    packageType?: string;
    simNumber?: string;
    existingLimit?: number;
    expectedLimit?: number;
    approvedLimit?: number;
    replacementReason?: string;
    replacementCharge?: number;
    justification: string;
    onBehalf?: boolean;
    onBehalfPerson?: string;
    section?: string;
    attachmentName?: string;
    attachmentSize?: string;
    documents?: string;
    issueStatus?: string;
  };
  timeline?: Array<{
    stage: string;
    roleLabel: string;
    approverName: string;
    approverDesignation: string;
    approverDepartment?: string;
    status: "approved" | "pending" | "rejected";
    date: string;
    time?: string;
  }>;
  comments?: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    timestamp: string;
    comment: string;
    initials: string;
  }>;
}

interface SimApprovalViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SimApprovalModalData | null;
  onStatusChange?: (
    id: string,
    newStatus: "Approved" | "Rejected",
    updatedDetails?: Partial<SimApprovalModalData["simDetails"]>
  ) => void;
}

export function SimApprovalViewModal({
  isOpen,
  onClose,
  data,
  onStatusChange,
}: SimApprovalViewModalProps) {
  if (!isOpen || !data) return null;

  const [approvalComment, setApprovalComment] = useState("");
  const [currentStatus, setCurrentStatus] = useState<"Pending" | "Approved" | "Rejected">(
    data.status
  );
  const [commentsList, setCommentsList] = useState(data.comments || []);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Approver inputs states
  const [assignedSimNumber, setAssignedSimNumber] = useState("");
  const [approvedBalanceAmount, setApprovedBalanceAmount] = useState<number | string>(
    data.simDetails.approvedLimit || data.simDetails.expectedLimit || 1000
  );
  const [newIssuedSimNumber, setNewIssuedSimNumber] = useState("");

  // Sync state when data changes
  useEffect(() => {
    if (data) {
      setCurrentStatus(data.status);
      setCommentsList(data.comments || []);
      setApprovalComment("");

      if (data.requestType === "New SIM") {
        setAssignedSimNumber(data.simDetails.simNumber || "—");
        setApprovedBalanceAmount(
          data.simDetails.approvedLimit || data.simDetails.expectedLimit || 1000
        );
      } else if (data.requestType === "SIM Balance Limit") {
        setApprovedBalanceAmount(
          data.simDetails.approvedLimit || data.simDetails.expectedLimit || 2500
        );
      } else if (data.requestType === "SIM Replacement") {
        setNewIssuedSimNumber("01844-998877");
      }
    }
  }, [data]);

  const handleApprove = () => {
    if (data.requestType === "New SIM") {
      if (!approvedBalanceAmount || Number(approvedBalanceAmount) <= 0) {
        toast.error("Please enter a valid Approved SIM Balance Amount.");
        return;
      }
    } else if (data.requestType === "SIM Balance Limit") {
      if (!approvedBalanceAmount || Number(approvedBalanceAmount) <= 0) {
        toast.error("Please enter a valid Approved Balance Amount.");
        return;
      }
    } else if (data.requestType === "SIM Replacement") {
      if (!String(newIssuedSimNumber).trim()) {
        toast.error("Please enter the New Issued SIM Number.");
        return;
      }
    }

    setCurrentStatus("Approved");

    let decisionNote = "";
    const updatedDetails: Partial<SimApprovalModalData["simDetails"]> = {};

    if (data.requestType === "New SIM") {
      decisionNote = `[Approved Limit: BDT ${Number(approvedBalanceAmount).toLocaleString()}]`;
      if (assignedSimNumber && assignedSimNumber !== "—") {
        updatedDetails.simNumber = assignedSimNumber;
      }
      updatedDetails.expectedLimit = Number(approvedBalanceAmount);
      updatedDetails.approvedLimit = Number(approvedBalanceAmount);
    } else if (data.requestType === "SIM Balance Limit") {
      decisionNote = `[Approved Limit: BDT ${Number(approvedBalanceAmount).toLocaleString()}]`;
      updatedDetails.expectedLimit = Number(approvedBalanceAmount);
      updatedDetails.approvedLimit = Number(approvedBalanceAmount);
    } else if (data.requestType === "SIM Replacement") {
      decisionNote = `[New Issued SIM: ${newIssuedSimNumber}]`;
      updatedDetails.simNumber = newIssuedSimNumber;
    }

    const fullComment = approvalComment.trim()
      ? `${approvalComment} ${decisionNote}`
      : `Approved by ICT & Authority. ${decisionNote}`;

    setCommentsList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        authorName: "Mamunoor Rashid",
        authorRole: "DGM (ICT)",
        timestamp: "Just now",
        comment: fullComment,
        initials: "MR",
      },
    ]);

    toast.success(`SIM Requisition (${data.requestType}) approved successfully!`);
    if (onStatusChange) {
      onStatusChange(data.id, "Approved", updatedDetails);
    }
  };

  const handleReject = () => {
    setCurrentStatus("Rejected");
    const fullComment = approvalComment.trim()
      ? approvalComment
      : "Requisition rejected by ICT authority.";

    setCommentsList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        authorName: "Mamunoor Rashid",
        authorRole: "DGM (ICT)",
        timestamp: "Just now",
        comment: fullComment,
        initials: "MR",
      },
    ]);

    toast.error(`SIM Requisition (${data.requestType}) rejected.`);
    if (onStatusChange) {
      onStatusChange(data.id, "Rejected");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold px-3 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 font-bold px-3 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
            PENDING
          </span>
        );
      case "Rejected":
        return (
          <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 font-bold px-3 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
            Rejected
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 4 Approval signatures workflow cards matching Image 1
  const approvalWorkflowCards = [
    {
      roleTitle: "APPROVED BY HOD",
      name: "Mohammad Tareq Safa",
      designation: "AGM",
      department: "MIS",
      status: "APPROVED" as const,
      time: "12:17 AM",
      date: "16/10/2026",
    },
    {
      roleTitle: "APPROVED BY HRD",
      name: "Rajebul Hasan Rajon",
      designation: "Deputy Manager",
      department: "HR, Admin and Compliance",
      status: "APPROVED" as const,
      time: "12:18 AM",
      date: "16/10/2026",
    },
    {
      roleTitle: "APPROVED BY MD",
      name: "Rakibul Islam Khan",
      designation: "Managing Director",
      department: "Management",
      status: "APPROVED" as const,
      time: "12:19 AM",
      date: "16/10/2026",
    },
    {
      roleTitle: "APPROVED BY ICT",
      name: "Mamunoor Rashid",
      designation: "DGM",
      department: "Information and Communication Technology",
      status: currentStatus === "Approved" ? ("APPROVED" as const) : ("PENDING" as const),
      time: currentStatus === "Approved" ? "12:25 PM" : "N/A",
      date: currentStatus === "Approved" ? "16/10/2026" : "N/A",
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 md:p-7 bg-white dark:bg-slate-900 space-y-6">
            {/* ── TOP HEADER BAR (Exact Image 1 Header) ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs shrink-0 border border-sky-100 dark:border-sky-800/40">
                  <Smartphone className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900 dark:text-white">
                    SIM Requisition Approval
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                      {data.reqNo}
                    </span>
                    {getStatusBadge(currentStatus)}
                  </div>
                </div>
              </div>

              {/* Right metadata + Actions */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <div className="text-right border-r pr-4 border-slate-200 dark:border-slate-800 hidden sm:block">
                  <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase">
                    <Calendar className="w-3 h-3" />
                    <span>APPLICATION DATE</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                    {data.applicationDate || "11/10/2026"}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span>Submitted {data.submittedTime || "12:22 PM"}</span>
                  </div>
                </div>

                {/* Print button in header */}
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  title="Print Official SIM Application Form"
                >
                  <Printer className="size-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Print Form</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── CARD 1: REQUEST FOR (EMPLOYEE DETAILS) (Exact Image 1) ── */}
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center gap-2">
                <UserCheck className="size-4 text-sky-600 dark:text-sky-400" />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  REQUEST FOR (EMPLOYEE DETAILS)
                </span>
              </div>

              <div className="p-4 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-5">
                {/* Left Employee Photo / Avatar */}
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-2xs">
                  <img
                    src={
                      data.employee.avatarUrl ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80"
                    }
                    alt={data.employee.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                {/* 3-Column Info Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5 text-xs">
                  {/* Column 1 */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Employee Name:
                      </span>
                      <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                        {data.employee.name || "Ruhul Amin"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Department:
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                        {data.employee.department || "Implementation & Business Analysis"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Location:
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                        {data.employee.location || "PSL-Operation"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Requisition By:
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                        {data.employee.requisitionBy || `${data.employee.name} (Manager)`}
                      </p>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Employee ID:
                      </span>
                      <p className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                        {data.employee.id || "2026062074"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Section:
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                        {data.employee.section || "Business Analysis"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Business Unit:
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                        {data.employee.businessUnit || "PSL"}
                      </p>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Designation:
                      </span>
                      <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                        {data.employee.designation || "Manager"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Date of Joining:
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                        {data.employee.joiningDate || "03/10/2026"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        Contact:
                      </span>
                      <p className="font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {data.employee.contact || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 2: MAIN DATA TABLE (Exact Columns: SL, Request For, Justification, Sim Number, Existing Limit, Expected Limit, Approved Limit, Documents, Issue Status) ── */}
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px] font-bold">
                      <th className="px-4 py-3 text-center w-12">SL</th>
                      <th className="px-4 py-3">REQUEST FOR</th>
                      <th className="px-4 py-3">JUSTIFICATION</th>
                      <th className="px-4 py-3">SIM NUMBER</th>
                      <th className="px-4 py-3">EXISTING LIMIT</th>
                      <th className="px-4 py-3">EXPECTED LIMIT</th>
                      <th className="px-4 py-3">APPROVED LIMIT</th>
                      <th className="px-4 py-3 text-center">DOCUMENTS</th>
                      <th className="px-4 py-3 text-center">ISSUE STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3.5 text-center font-bold text-slate-500">1</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                        {data.requestType}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 italic">
                        "{data.simDetails.justification || "Office use"}"
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-500">
                        {assignedSimNumber && assignedSimNumber !== "—"
                          ? assignedSimNumber
                          : data.simDetails.simNumber || "—"}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {data.simDetails.existingLimit
                          ? data.simDetails.existingLimit.toLocaleString()
                          : "1000"}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-500">
                        {data.simDetails.expectedLimit
                          ? data.simDetails.expectedLimit.toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {approvedBalanceAmount
                          ? Number(approvedBalanceAmount).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-400">
                        {data.simDetails.attachmentName ? (
                          <span className="text-blue-600 underline font-semibold cursor-pointer">
                            {data.simDetails.attachmentName}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            currentStatus === "Approved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}
                        >
                          {currentStatus === "Approved" ? "Issued" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── CARD 3: APPROVAL WORKFLOW & SIGNATURES (Exact Image 1) ── */}
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center gap-2">
                <FileCheck2 className="size-4 text-sky-600 dark:text-sky-400" />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Approval Workflow & Signatures
                </span>
              </div>

              <div className="p-4 md:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {approvalWorkflowCards.map((card, idx) => {
                    const isApproved = card.status === "APPROVED";
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border flex flex-col justify-between overflow-hidden transition-all ${
                          isApproved
                            ? "border-emerald-200/90 bg-emerald-50/20 dark:border-emerald-800/40 dark:bg-emerald-950/10"
                            : "border-amber-200/90 bg-amber-50/20 dark:border-amber-800/40 dark:bg-amber-950/10"
                        }`}
                      >
                        {/* Card Top: Role and Status Badge */}
                        <div className="p-3 pb-2 flex items-center justify-between">
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider ${
                              isApproved ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                            }`}
                          >
                            {card.roleTitle}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              isApproved
                                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/40"
                                : "text-amber-700 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-900/40"
                            }`}
                          >
                            {isApproved ? (
                              <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Hourglass className="size-3 text-amber-600 dark:text-amber-400" />
                            )}
                            {card.status}
                          </span>
                        </div>

                        {/* Officer Name & Designation */}
                        <div className="px-3 py-1 space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                            {card.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            {card.designation}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight truncate">
                            {card.department}
                          </p>
                        </div>

                        {/* Card Bottom Time Bar */}
                        <div
                          className={`mt-3 px-3 py-1.5 text-[10px] font-mono flex items-center justify-between border-t ${
                            isApproved
                              ? "bg-emerald-100/50 border-emerald-200/60 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800/30 dark:text-emerald-300"
                              : "bg-amber-100/50 border-amber-200/60 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800/30 dark:text-amber-300"
                          }`}
                        >
                          <span>{card.time}</span>
                          <span>{card.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── CARD 4: COMMENTS & APPROVER ACTION CONTROLS (Exact Image 1) ── */}
            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs space-y-4">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center gap-2">
                <MessageSquare className="size-4 text-purple-600 dark:text-purple-400" />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  COMMENTS & APPROVER ACTION CONTROLS
                </span>
              </div>

              <div className="p-4 md:p-6 space-y-6">
                {/* Audit Comments History */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    AUDIT COMMENTS HISTORY
                  </span>

                  {commentsList.length === 0 ? (
                    <div className="py-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                      No comments or approval notes yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {commentsList.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {c.authorName} ({c.authorRole})
                            </span>
                            <span className="text-slate-400">{c.timestamp}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300">{c.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Approver Input & Decision Controls */}
                <div className="rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/30 dark:bg-indigo-950/10 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
                    <Info className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      APPROVER INPUT & DECISION CONTROLS
                    </span>
                  </div>

                  {/* Approved Balance Limit Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/40 p-4 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <TrendingUp className="size-4" />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        APPROVED BALANCE LIMIT AMOUNT
                      </span>
                    </div>

                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      APPROVED BALANCE LIMIT (BDT) <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative max-w-md">
                      <CreditCard className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={approvedBalanceAmount}
                        onChange={(e) => setApprovedBalanceAmount(e.target.value)}
                        placeholder="1000"
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Current: BDT 1,000 → Requested: BDT 0
                    </p>
                  </div>

                  {/* Comment & Decision Buttons (if Pending) */}
                  {currentStatus === "Pending" && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                          Approval / Rejection Remark
                        </label>
                        <textarea
                          value={approvalComment}
                          onChange={(e) => setApprovalComment(e.target.value)}
                          placeholder="Add comment or approval instruction..."
                          rows={2}
                          className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleApprove}
                          className="flex-1 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98 cursor-pointer"
                        >
                          <CheckCircle2 className="size-4" />
                          <span>Approve Requisition</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleReject}
                          className="flex-1 h-9 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
                        >
                          <XCircle className="size-4" />
                          <span>Reject Requisition</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Bottom Footer (Exact Image 1) */}
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <Printer className="size-3.5 text-blue-600" />
              <span>Print SIM Application</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-9 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>

      {/* Official SIM Application Print Preview Modal (Image 2) */}
      <SingleSimPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        data={data}
        approvedLimit={approvedBalanceAmount}
        assignedSimNumber={assignedSimNumber}
      />
    </>
  );
}
