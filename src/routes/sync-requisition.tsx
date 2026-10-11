import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  AlertTriangle,
  UserCheck,
  Check,
  X,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Building2,
  Calendar,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sync-requisition")({
  head: () => ({
    meta: [
      { title: "Sync Requisition — Approvals | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Synchronize requisition workflow layers and re-bind approvals to active organizational layers.",
      },
    ],
  }),
  component: SyncRequisitionPage,
});

export interface WorkflowLayerStep {
  step: number;
  layerName: string;
  role: string;
  approverName: string;
  employeeId: string;
  points: string;
  status: "APPROVED" | "CURRENT_PENDING" | "UPCOMING";
  actionType: "Approve" | "Recommend" | "Verify" | "Acknowledge";
  approvedDate?: string;
}

export interface RequisitionSyncData {
  requisitionNo: string;
  title: string;
  category: string;
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  submissionDate: string;
  workflowName: string;
  totalLayers: number;
  currentLayerIndex: number; // 1-indexed
  layers: WorkflowLayerStep[];
}

// Built-in registry of recognizable requisitions with their dynamic active workflow layers
const SAMPLE_REQUISITIONS: Record<string, RequisitionSyncData> = {
  "REQ-LV-2026-0892": {
    requisitionNo: "REQ-LV-2026-0892",
    title: "Annual Leave Application (5 Days)",
    category: "Leave Application",
    employeeName: "Md. Sadmanur Islam Shishir",
    employeeId: "2024051510",
    department: "Business Innovation",
    designation: "Jr. Executive",
    submissionDate: "2026-08-28",
    workflowName: "Leave Application (Admin dept)",
    totalLayers: 3,
    currentLayerIndex: 2,
    layers: [
      {
        step: 1,
        layerName: "Approved By HOD",
        role: "Department Head",
        approverName: "Md. Anik Islam",
        employeeId: "2023044078",
        points: "100 pts",
        status: "APPROVED",
        actionType: "Recommend",
        approvedDate: "2026-08-28 02:15 PM",
      },
      {
        step: 2,
        layerName: "Approved By HR & Admin",
        role: "Head of HR",
        approverName: "Jahangir Alam",
        employeeId: "2022019941",
        points: "100 pts",
        status: "CURRENT_PENDING",
        actionType: "Approve",
      },
      {
        step: 3,
        layerName: "Approved By MD",
        role: "Managing Director",
        approverName: "Executive Managing Director",
        employeeId: "2019001001",
        points: "100 pts",
        status: "UPCOMING",
        actionType: "Approve",
      },
    ],
  },
  "REQ-SIM-2026-0045": {
    requisitionNo: "REQ-SIM-2026-0045",
    title: "Official Corporate SIM Card Requisition",
    category: "Sim Requisition",
    employeeName: "Md. Abdur Rahaman",
    employeeId: "2021088234",
    department: "Factory Operations",
    designation: "Factory Manager",
    submissionDate: "2026-09-02",
    workflowName: "Sim Requisition",
    totalLayers: 4,
    currentLayerIndex: 1,
    layers: [
      {
        step: 1,
        layerName: "Approved By HOD",
        role: "Head of Department (Operations)",
        approverName: "Group (HOD)",
        employeeId: "N/A",
        points: "100 pts",
        status: "CURRENT_PENDING",
        actionType: "Recommend",
      },
      {
        step: 2,
        layerName: "Approved By HRD",
        role: "Human Resources Director",
        approverName: "Jahangir Alam",
        employeeId: "2022019941",
        points: "100 pts",
        status: "UPCOMING",
        actionType: "Verify",
      },
      {
        step: 3,
        layerName: "Approved By MD",
        role: "Managing Director",
        approverName: "Executive Managing Director",
        employeeId: "2019001001",
        points: "100 pts",
        status: "UPCOMING",
        actionType: "Approve",
      },
      {
        step: 4,
        layerName: "Approved By ICT",
        role: "ICT & Telecom Manager",
        approverName: "Kamrul Hasan",
        employeeId: "2024010092",
        points: "100 pts",
        status: "UPCOMING",
        actionType: "Acknowledge",
      },
    ],
  },
  "REQ-IOU-2026-0129": {
    requisitionNo: "REQ-IOU-2026-0129",
    title: "Emergency IOU Cash Advance Requisition",
    category: "IOU - Requisition",
    employeeName: "Farhana Yasmin",
    employeeId: "2023091145",
    department: "Implementation & BA",
    designation: "Sr. Business Analyst",
    submissionDate: "2026-09-04",
    workflowName: "IOU - Requisition",
    totalLayers: 4,
    currentLayerIndex: 3,
    layers: [
      {
        step: 1,
        layerName: "Approved By Manager",
        role: "Reporting Line Manager",
        approverName: "Md. Anik Islam",
        employeeId: "2023044078",
        points: "100 pts",
        status: "APPROVED",
        actionType: "Recommend",
        approvedDate: "2026-09-04 11:20 AM",
      },
      {
        step: 2,
        layerName: "Approved By HOD",
        role: "Department Head",
        approverName: "Group (HOD)",
        employeeId: "N/A",
        points: "100 pts",
        status: "APPROVED",
        actionType: "Verify",
        approvedDate: "2026-09-04 03:40 PM",
      },
      {
        step: 3,
        layerName: "Approved By Accounts",
        role: "Chief Financial Officer (CFO)",
        approverName: "Sayed Ahmed",
        employeeId: "2020011502",
        points: "100 pts",
        status: "CURRENT_PENDING",
        actionType: "Approve",
      },
      {
        step: 4,
        layerName: "Approved By MD",
        role: "Managing Director",
        approverName: "Executive Managing Director",
        employeeId: "2019001001",
        points: "100 pts",
        status: "UPCOMING",
        actionType: "Approve",
      },
    ],
  },
  "REQ-LN-2026-0034": {
    requisitionNo: "REQ-LN-2026-0034",
    title: "Provident Fund Loan Application",
    category: "Loan Approval",
    employeeName: "Kamrul Hasan",
    employeeId: "2024010092",
    department: "MIS & IT",
    designation: "Network Administrator",
    submissionDate: "2026-09-05",
    workflowName: "Loan Approval",
    totalLayers: 3,
    currentLayerIndex: 2,
    layers: [
      {
        step: 1,
        layerName: "Approved By HOD",
        role: "Department Head (IT)",
        approverName: "Group (HOD)",
        employeeId: "N/A",
        points: "100 pts",
        status: "APPROVED",
        actionType: "Recommend",
        approvedDate: "2026-09-05 10:00 AM",
      },
      {
        step: 2,
        layerName: "Approved By HR & Admin",
        role: "Head of HR",
        approverName: "Jahangir Alam",
        employeeId: "2022019941",
        points: "100 pts",
        status: "CURRENT_PENDING",
        actionType: "Approve",
      },
      {
        step: 3,
        layerName: "Approved By Accounts",
        role: "Accounts & Finance Head",
        approverName: "Sayed Ahmed",
        employeeId: "2020011502",
        points: "100 pts",
        status: "UPCOMING",
        actionType: "Approve",
      },
    ],
  },
};

function generateFallbackRequisition(reqNo: string): RequisitionSyncData {
  return {
    requisitionNo: reqNo,
    title: `General Requisition (${reqNo})`,
    category: "General Approval Workflow",
    employeeName: "Md. Sadmanur Islam Shishir",
    employeeId: "2024051510",
    department: "Business Innovation",
    designation: "Executive",
    submissionDate: new Date().toISOString().split("T")[0],
    workflowName: "Standard Multi-Layer Workflow",
    totalLayers: 3,
    currentLayerIndex: 1,
    layers: [
      {
        step: 1,
        layerName: "Approved By HOD",
        role: "Department Head",
        approverName: "Group (HOD)",
        employeeId: "N/A",
        points: "100 pts",
        status: "CURRENT_PENDING",
        actionType: "Recommend",
      },
      {
        step: 2,
        layerName: "Approved By HR & Admin",
        role: "Head of HR",
        approverName: "Jahangir Alam",
        employeeId: "2022019941",
        points: "100 pts",
        status: "UPCOMING",
        actionType: "Approve",
      },
      {
        step: 3,
        layerName: "Approved By MD",
        role: "Managing Director",
        approverName: "Executive Managing Director",
        employeeId: "2019001001",
        points: "100 pts",
        status: "UPCOMING",
        actionType: "Approve",
      },
    ],
  };
}

function SyncRequisitionPage() {
  const [requisitionInput, setRequisitionInput] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedRequisition, setSyncedRequisition] = useState<RequisitionSyncData | null>(null);
  const [syncTimestamp, setSyncTimestamp] = useState<string | null>(null);

  // Handle clicking "Sync" button -> opens Confirm button/state
  const handleInitiateSync = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNo = requisitionInput.trim();
    if (!cleanNo) {
      toast.error("Please enter a requisition number first.");
      return;
    }
    // Show confirm button
    setShowConfirm(true);
  };

  // Handle clicking "Confirm" button -> runs sync and renders workflow layers
  const handleConfirmSync = () => {
    const cleanNo = requisitionInput.trim().toUpperCase();
    setIsSyncing(true);

    setTimeout(() => {
      const data = SAMPLE_REQUISITIONS[cleanNo] || generateFallbackRequisition(cleanNo);
      setSyncedRequisition(data);
      setSyncTimestamp(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setIsSyncing(false);
      setShowConfirm(false);
      toast.success(`Requisition ${cleanNo} synced successfully with latest workflow layers!`);
    }, 750);
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  const handleQuickSelect = (reqNo: string) => {
    setRequisitionInput(reqNo);
    setShowConfirm(false);
  };

  return (
    <div className="flex h-screen bg-[#f4f7fb] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Subheader Toolbar & Breadcrumb */}
        <div className="px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium select-none">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-500">Approvals</span>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Sync Requisition
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/work-flows"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-colors"
            >
              <Layers size={13} className="text-blue-600" />
              Manage Work Flows
            </Link>
          </div>
        </div>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4">
          {/* Top Panel: Compact Requisition Input & Sync Console */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0062d2] dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
                </div>
                <div>
                  <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Sync Requisition Workflow
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Re-evaluate and synchronize a requisition with the latest active workflow approval layers.
                  </p>
                </div>
              </div>

              {/* Quick sample chips */}
              <div className="flex items-center flex-wrap gap-1.5 text-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-0.5">
                  Samples:
                </span>
                {Object.keys(SAMPLE_REQUISITIONS).map((reqNo) => (
                  <button
                    key={reqNo}
                    type="button"
                    onClick={() => handleQuickSelect(reqNo)}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {reqNo}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact Input & Action Form */}
            <form onSubmit={handleInitiateSync} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 max-w-xl">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={14} />
                  </div>
                  <input
                    type="text"
                    required
                    value={requisitionInput}
                    onChange={(e) => {
                      setRequisitionInput(e.target.value);
                      if (showConfirm) setShowConfirm(false);
                    }}
                    placeholder="Enter Requisition No (e.g. REQ-LV-2026-0892)..."
                    className="w-full pl-8 pr-7 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono uppercase shadow-2xs"
                  />
                  {requisitionInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setRequisitionInput("");
                        setShowConfirm(false);
                      }}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Primary Sync button (when not yet in confirm mode) */}
                {!showConfirm && (
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg bg-[#0062d2] hover:bg-[#0051b0] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
                    SYNC
                  </button>
                )}
              </div>

              {/* CONFIRMATION BUTTON STATE (Appears after clicking Sync) */}
              {showConfirm && (
                <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <AlertTriangle size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Confirm Requisition Synchronization?
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        This will re-bind requisition <span className="font-mono font-bold text-amber-800 dark:text-amber-300">{requisitionInput.trim().toUpperCase()}</span> with its active organizational workflow layers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={handleCancelConfirm}
                      className="h-8 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmSync}
                      disabled={isSyncing}
                      className="h-8 inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          SYNCING...
                        </>
                      ) : (
                        <>
                          <Check size={13} className="stroke-[3]" />
                          CONFIRM SYNC
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RESULTS: WORKFLOW LAYERS THE REQUISITION GOES NOW */}
          {syncedRequisition && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Requisition Meta Header Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 md:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-md">
                        {syncedRequisition.requisitionNo}
                      </span>
                      <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">
                        {syncedRequisition.category}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[11px] font-bold">
                        <CheckCircle2 size={11} />
                        Workflow Synced {syncTimestamp && `@ ${syncTimestamp}`}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                      {syncedRequisition.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs bg-[#f8fafc] dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 shrink-0">
                    <Layers size={16} className="text-blue-600" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        BOUND WORKFLOW
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        {syncedRequisition.workflowName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-0.5">
                  <div>
                    <div className="text-slate-400 font-medium text-[11px]">Requester Employee</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 text-xs">
                      {syncedRequisition.employeeName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ID: {syncedRequisition.employeeId}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-medium text-[11px]">Department</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 text-xs">
                      {syncedRequisition.department}
                    </div>
                    <div className="text-[11px] text-slate-400">{syncedRequisition.designation}</div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-medium text-[11px]">Submission Date</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 text-xs">
                      {syncedRequisition.submissionDate}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-medium text-[11px]">Approval Progress</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 text-xs">
                      Stage {syncedRequisition.currentLayerIndex} of {syncedRequisition.totalLayers}
                    </div>
                    <div className="text-[11px] text-blue-600 font-medium">
                      {syncedRequisition.layers[syncedRequisition.currentLayerIndex - 1]?.layerName || "In Progress"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Workflow Chain (Stepper Flow) */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 md:p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Workflow Layers The Requisition Goes Now
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Active sequential approval hierarchy configured for this requisition.
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">
                    Total: {syncedRequisition.layers.length} Layers
                  </div>
                </div>

                {/* Visual Flow Steppers */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                  {syncedRequisition.layers.map((layer) => {
                    const isApproved = layer.status === "APPROVED";
                    const isCurrent = layer.status === "CURRENT_PENDING";

                    return (
                      <div
                        key={layer.step}
                        className={`relative rounded-lg p-3 border transition-all ${
                          isApproved
                            ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                            : isCurrent
                            ? "border-blue-300 dark:border-blue-700 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-2xs"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 opacity-70"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isApproved
                                ? "bg-emerald-600 text-white"
                                : isCurrent
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {layer.step}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                                : isCurrent
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 animate-pulse"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {isApproved ? "Approved" : isCurrent ? "Active Now" : "Waiting"}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                          {layer.layerName}
                        </h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          {layer.approverName}
                        </div>
                        <div className="text-[10px] text-slate-400">{layer.role}</div>

                        <div className="mt-2.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-500">Action: {layer.actionType}</span>
                          <span className="font-mono text-slate-400">{layer.points}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
