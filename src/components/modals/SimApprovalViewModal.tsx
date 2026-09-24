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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  };
  simDetails: {
    operator: string;
    packageType?: string;
    simNumber?: string;
    existingLimit?: number;
    expectedLimit?: number;
    replacementReason?: string;
    replacementCharge?: number;
    justification: string;
    onBehalf?: boolean;
    onBehalfPerson?: string;
    section?: string;
    attachmentName?: string;
    attachmentSize?: string;
  };
  timeline?: Array<{
    stage: string;
    roleLabel: string;
    approverName: string;
    approverDesignation: string;
    status: "approved" | "pending" | "rejected";
    date: string;
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

  // Approver inputs states
  const [assignedSimNumber, setAssignedSimNumber] = useState("");
  const [approvedBalanceAmount, setApprovedBalanceAmount] = useState<number | string>("");
  const [newIssuedSimNumber, setNewIssuedSimNumber] = useState("");

  // Sync state when data changes
  useEffect(() => {
    if (data) {
      setCurrentStatus(data.status);
      setCommentsList(data.comments || []);
      setApprovalComment("");

      if (data.requestType === "New SIM") {
        setAssignedSimNumber(data.simDetails.simNumber || "01711-554433");
        setApprovedBalanceAmount(data.simDetails.expectedLimit || 1000);
      } else if (data.requestType === "SIM Balance Limit") {
        setApprovedBalanceAmount(data.simDetails.expectedLimit || 2500);
      } else if (data.requestType === "SIM Replacement") {
        setNewIssuedSimNumber("01844-998877");
      }
    }
  }, [data]);

  const handleApprove = () => {
    // Validate required inputs based on request type
    if (data.requestType === "New SIM") {
      if (!String(assignedSimNumber).trim()) {
        toast.error("Please enter the Assigned SIM Number before approving.");
        return;
      }
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
      decisionNote = `[Assigned SIM: ${assignedSimNumber}, Approved Limit: BDT ${Number(approvedBalanceAmount).toLocaleString()}]`;
      updatedDetails.simNumber = assignedSimNumber;
      updatedDetails.expectedLimit = Number(approvedBalanceAmount);
    } else if (data.requestType === "SIM Balance Limit") {
      decisionNote = `[Approved Limit: BDT ${Number(approvedBalanceAmount).toLocaleString()}]`;
      updatedDetails.expectedLimit = Number(approvedBalanceAmount);
    } else if (data.requestType === "SIM Replacement") {
      decisionNote = `[New Issued SIM: ${newIssuedSimNumber}]`;
      updatedDetails.simNumber = newIssuedSimNumber;
    }

    const fullComment = approvalComment.trim()
      ? `${approvalComment} ${decisionNote}`
      : `Approved by HR & Telecom Authority. ${decisionNote}`;

    setCommentsList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        authorName: "Current Approver",
        authorRole: "HR & Telecom Authority",
        timestamp: "Just now",
        comment: fullComment,
        initials: "CA",
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
      : "Requisition rejected by approval authority.";

    setCommentsList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        authorName: "Current Approver",
        authorRole: "HR & Telecom Authority",
        timestamp: "Just now",
        comment: fullComment,
        initials: "CA",
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
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold px-3 py-1">
            Approved
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-bold px-3 py-1">
            Pending Review
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 font-bold px-3 py-1">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case "New SIM":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <PlusCircle className="size-3.5" /> New SIM
          </span>
        );
      case "SIM Balance Limit":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            <TrendingUp className="size-3.5" /> SIM Balance Limit
          </span>
        );
      case "SIM Replacement":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <RefreshCw className="size-3.5" /> SIM Replacement
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            <Smartphone className="size-3.5" /> {type}
          </span>
        );
    }
  };

  // Limit difference calculation for SIM Balance Limit
  const currentLimitVal = data.simDetails.existingLimit || 0;
  const approvedLimitVal = Number(approvedBalanceAmount) || data.simDetails.expectedLimit || 0;
  const limitDiff = approvedLimitVal - currentLimitVal;
  const percentageIncrease = currentLimitVal
    ? Math.round((limitDiff / currentLimitVal) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50 relative space-y-5">
          {/* Top Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs shrink-0 border border-teal-200 dark:border-teal-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    SIM Requisition Approval
                  </h1>
                  {getRequestTypeBadge(data.requestType)}
                  {getStatusBadge(currentStatus)}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-0.5 mt-1">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                    Req No: <span className="text-slate-700 dark:text-slate-200 font-bold">{data.reqNo}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                    Type: <span className="text-teal-700 dark:text-teal-300 font-bold">{data.requestType}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right metadata / Close Button */}
            <div className="flex items-center gap-4 self-end md:self-center">
              <div className="text-right border-r pr-4 border-slate-200 dark:border-slate-800 hidden sm:block">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold tracking-wider uppercase">
                  APPLICATION DATE
                </span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block">
                  {data.applicationDate}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold mt-0.5">
                  Submitted {data.submittedTime}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* On Behalf Alert Banner */}
          {data.simDetails.onBehalf && (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3.5 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="font-extrabold uppercase text-[10px] tracking-wider block text-amber-700 dark:text-amber-400">
                  ON BEHALF REQUISITION
                </span>
                This requisition was submitted on behalf of{" "}
                <span className="font-bold underline">{data.simDetails.onBehalfPerson || "Team Member"}</span>
                {data.simDetails.section && <span> ({data.simDetails.section})</span>}.
              </div>
            </div>
          )}

          {/* REQUISITIONER CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pb-4 lg:pb-0 lg:pr-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-md shadow-teal-500/20 shrink-0">
                  {data.employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                    REQUISITIONER
                  </span>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {data.employee.name}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    ID: {data.employee.id}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      DESIGNATION
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {data.employee.designation}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      DEPARTMENT
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {data.employee.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      SECTION
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {data.employee.section || data.simDetails.section || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      JOINING DATE
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {data.employee.joiningDate || "15 Jan 2023"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <BuildingIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      BUSINESS UNIT
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {data.employee.businessUnit || "Pakiza Software Limited"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      LOCATION
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {data.employee.location || "Head Office, Dhaka"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC PARAMETERS & LIVE APPROVAL INPUT PREVIEW SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Signal className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {data.requestType} Parameters & Live Approver Inputs
                </h3>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                TELECOM ASSET MANAGEMENT
              </span>
            </div>

            {/* TYPE 1: NEW SIM */}
            {data.requestType === "New SIM" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Target Telecom Operator
                    </span>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                      <Signal className="size-4 text-emerald-500" />
                      {data.simDetails.operator}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Recommended Plan
                    </span>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      {data.simDetails.packageType || "Corporate Postpaid Premier"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Assigned SIM Number
                    </span>
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-300 mt-1 font-mono">
                      {assignedSimNumber.trim() ? assignedSimNumber : "Pending Input..."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                      Approved Monthly Balance
                    </span>
                    <p className="text-sm font-black text-teal-700 dark:text-teal-300 mt-1 font-mono">
                      BDT {Number(approvedBalanceAmount || 0).toLocaleString()} / Month
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-50/30 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/10">
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-1">
                    Business Justification for New Connection
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                    "{data.simDetails.justification}"
                  </p>
                </div>
              </div>
            )}

            {/* TYPE 2: SIM BALANCE LIMIT */}
            {data.requestType === "SIM Balance Limit" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      SIM Mobile Number
                    </span>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1 font-mono">
                      {data.simDetails.simNumber || "01711-XXXXXX"}
                    </p>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                      Operator: {data.simDetails.operator}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Current Monthly Limit
                    </span>
                    <p className="text-sm font-black text-slate-600 dark:text-slate-300 mt-1 font-mono">
                      BDT {(data.simDetails.existingLimit || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                      Approved Monthly Limit Amount
                    </span>
                    <p className="text-base font-black text-indigo-700 dark:text-indigo-300 mt-1 font-mono">
                      BDT {approvedLimitVal.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Limit Enhancement Difference
                    </span>
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-300 mt-1 font-mono flex items-center gap-1">
                      +BDT {limitDiff.toLocaleString()}{" "}
                      <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                        +{percentageIncrease}%
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                    Limit Upgrade Justification
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                    "{data.simDetails.justification}"
                  </p>
                </div>
              </div>
            )}

            {/* TYPE 3: SIM REPLACEMENT */}
            {data.requestType === "SIM Replacement" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      SIM Number to Replace
                    </span>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1 font-mono">
                      {data.simDetails.simNumber || "01844-XXXXXX"}
                    </p>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                      Operator: {data.simDetails.operator}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      New Issued SIM Number
                    </span>
                    <p className="text-sm font-black text-amber-700 dark:text-amber-300 mt-1 font-mono">
                      {newIssuedSimNumber.trim() ? newIssuedSimNumber : "Pending Input..."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Replacement Reason
                    </span>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">
                      {data.simDetails.replacementReason || "Damaged / Lost SIM"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Replacement Fee Charge
                    </span>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      BDT {(data.simDetails.replacementCharge || 200).toLocaleString()}{" "}
                      <span className="text-[10px] font-normal text-slate-500">
                        (Company Covered)
                      </span>
                    </p>
                  </div>
                </div>

                {data.simDetails.attachmentName && (
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <Paperclip className="size-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          {data.simDetails.attachmentName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Attached Proof ({data.simDetails.attachmentSize || "PDF Document"})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.info(`Viewing ${data.simDetails.attachmentName}`)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="size-3.5" /> Download
                    </button>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-amber-50/30 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
                    Replacement Request Justification
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                    "{data.simDetails.justification}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* COMMENTS & APPROVER DECISION PANEL */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Comments & Approver Action Controls
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
              {/* Comment Log */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Audit Comments History
                </span>
                {commentsList.length > 0 ? (
                  commentsList.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {c.authorName}{" "}
                          <span className="text-[10px] font-semibold text-slate-400">
                            ({c.authorRole})
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {c.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    No comments recorded yet.
                  </div>
                )}
              </div>

              {/* Action Panel with Dynamic Approver Input Fields */}
              <div className="bg-slate-50/80 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-slate-700">
                  <AlertCircle className="size-4 text-teal-600 dark:text-teal-400" />
                  Approver Input & Decision Controls
                </div>

                {/* DYNAMIC APPROVER INPUTS FOR NEW SIM */}
                {data.requestType === "New SIM" && (
                  <div className="space-y-3 bg-emerald-50/60 dark:bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                    <div className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="size-3.5" /> New SIM Assignment Parameters
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                          Assigned SIM Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={assignedSimNumber}
                            onChange={(e) => setAssignedSimNumber(e.target.value)}
                            placeholder="e.g. 01711-554433"
                            className="w-full h-9 pl-8 pr-3 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                          Approved Balance Amount (BDT) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                          <input
                            type="number"
                            value={approvedBalanceAmount}
                            onChange={(e) => setApprovedBalanceAmount(e.target.value)}
                            placeholder="e.g. 1000"
                            className="w-full h-9 pl-8 pr-3 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DYNAMIC APPROVER INPUTS FOR SIM BALANCE LIMIT */}
                {data.requestType === "SIM Balance Limit" && (
                  <div className="space-y-3 bg-indigo-50/60 dark:bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
                    <div className="text-[11px] font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="size-3.5" /> Approved Balance Limit Amount
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                        Approved Balance Limit (BDT) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                        <input
                          type="number"
                          value={approvedBalanceAmount}
                          onChange={(e) => setApprovedBalanceAmount(e.target.value)}
                          placeholder="e.g. 2500"
                          className="w-full h-9 pl-8 pr-3 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Current: BDT {(data.simDetails.existingLimit || 0).toLocaleString()} → Requested: BDT {(data.simDetails.expectedLimit || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* DYNAMIC APPROVER INPUTS FOR SIM REPLACEMENT */}
                {data.requestType === "SIM Replacement" && (
                  <div className="space-y-3 bg-amber-50/60 dark:bg-amber-500/10 p-3.5 rounded-xl border border-amber-200 dark:border-amber-500/20">
                    <div className="text-[11px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <RefreshCw className="size-3.5" /> New Replacement SIM Card Assignment
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                        New Issued SIM Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={newIssuedSimNumber}
                          onChange={(e) => setNewIssuedSimNumber(e.target.value)}
                          placeholder="e.g. 01844-998877"
                          className="w-full h-9 pl-8 pr-3 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Replaces Old SIM Number: {data.simDetails.simNumber || "01844-556677"}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Approval Remark / Remark Notes
                  </label>
                  <textarea
                    rows={3}
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Enter approval note or rejection reasons..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* APPROVAL WORKFLOW SIGNATURES (MOVED UNDER COMMENTS & APPROVER ACTION CONTROLS) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="w-6 h-6 rounded-md bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Multi-Stage Approval Hierarchy & Signatures
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(
                data.timeline || [
                  {
                    stage: "STAGE 1: DEPARTMENT HEAD",
                    roleLabel: "STAGE 1",
                    approverName: "Md. Tanvir Rahman",
                    approverDesignation: "Head of IT & Operations",
                    status: "approved",
                    date: "2026-09-21 10:30 AM",
                  },
                  {
                    stage: "STAGE 2: TELECOM ADMIN",
                    roleLabel: "STAGE 2",
                    approverName: "Farhana Sharmin",
                    approverDesignation: "Sr. Telecom & Assets Officer",
                    status: "approved",
                    date: "2026-09-21 02:15 PM",
                  },
                  {
                    stage: "STAGE 3: GENERAL HR ADMIN",
                    roleLabel: "STAGE 3",
                    approverName: "Khairul Bashar Masum",
                    approverDesignation: "Manager - HR & Admin",
                    status:
                      currentStatus === "Approved"
                        ? "approved"
                        : currentStatus === "Rejected"
                        ? "rejected"
                        : "pending",
                    date: currentStatus === "Pending" ? "Pending Approval" : "2026-09-24 11:00 AM",
                  },
                ]
              ).map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 relative space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                      {step.roleLabel || `STAGE ${idx + 1}`}
                    </span>
                    {step.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 uppercase">
                        <CheckCircle2 className="size-3" /> Approved
                      </span>
                    ) : step.status === "rejected" ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-500/20 uppercase">
                        <XCircle className="size-3" /> Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20 uppercase">
                        <Clock className="size-3" /> Pending
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {step.approverName}
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.approverDesignation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[9.5px] font-bold text-slate-400">
                    <span>Date: {step.date}</span>
                    <ShieldCheck className="size-3 text-teal-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STICKY APPROVAL ACTION FOOTER (PINNED TO MODAL BOTTOM) */}
        <div className="px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-lg shrink-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Requisition Status:
            </span>
            {getStatusBadge(currentStatus)}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={currentStatus === "Rejected"}
              className="px-5 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 disabled:opacity-50 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
            >
              <XCircle className="size-4" /> Reject Request
            </button>
            <button
              onClick={handleApprove}
              disabled={currentStatus === "Approved"}
              className="px-6 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="size-4" /> Approve Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
