import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { toast } from "sonner";
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  ArrowLeft,
  Paperclip,
  Download,
  AlertCircle,
  TrendingDown,
  Layers,
  ChevronRight,
  User,
  XCircle,
  RotateCcw,
  Check,
  FileText,
  DollarSign,
  Info,
} from "lucide-react";
import {
  PurchaseRequisition,
  getStoredPurchaseRequisitions,
  setStoredPurchaseRequisitions,
} from "@/lib/procurement-requisition-data";

interface PRApprovalSearch {
  id?: string;
}

export const Route = createFileRoute("/procurement-pr-approval")({
  validateSearch: (search: Record<string, unknown>): PRApprovalSearch => {
    return {
      id: search.id as string | undefined,
    };
  },
  component: PurchaseRequisitionApprovalPage,
});

export default function PurchaseRequisitionApprovalPage() {
  const search = Route.useSearch();
  const [prs, setPrs] = useState<PurchaseRequisition[]>([]);
  const [selectedPrId, setSelectedPrId] = useState<string | null>(search.id || null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending Approval");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  // Approval Action Modal/State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"Approve" | "Reject" | "Return">("Approve");
  const [decisionRemarks, setDecisionRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // App QTY approver state & validation
  const [approvedQuantities, setApprovedQuantities] = useState<Record<string, number>>({});
  const [qtyErrors, setQtyErrors] = useState<Record<string, string>>({});

  // Stock Quantity Breakdown Modal State
  const [stockModal, setStockModal] = useState<{
    open: boolean;
    itemName: string;
    stockQty: number;
    uom: string;
    stores: { name: string; qty: number }[];
  } | null>(null);

  useEffect(() => {
    setPrs(getStoredPurchaseRequisitions());
  }, []);

  useEffect(() => {
    if (search.id) {
      setSelectedPrId(search.id);
    }
  }, [search.id]);

  const selectedPR = useMemo(() => {
    return prs.find((p) => p.id === selectedPrId) || null;
  }, [prs, selectedPrId]);

  useEffect(() => {
    if (selectedPR && selectedPR.items) {
      const initial: Record<string, number> = {};
      selectedPR.items.forEach((it) => {
        const reqQty = it.requiredQuantity ?? it.requestedQuantity ?? 1;
        initial[it.id] = (it as any).approvedQuantity ?? reqQty;
      });
      setApprovedQuantities(initial);
      setQtyErrors({});
    }
  }, [selectedPR]);

  const handleApprovedQtyChange = (itemId: string, reqQty: number, valStr: string) => {
    const val = Number(valStr);
    if (isNaN(val) || val < 0) {
      setQtyErrors((prev) => ({ ...prev, [itemId]: "Invalid quantity" }));
      return;
    }
    if (val > reqQty) {
      setQtyErrors((prev) => ({
        ...prev,
        [itemId]: `App QTY cannot exceed Req Qty (${reqQty})`,
      }));
    } else {
      setQtyErrors((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
    setApprovedQuantities((prev) => ({ ...prev, [itemId]: val }));
  };

  // Filtered PR list for review queue
  const filteredPrs = useMemo(() => {
    return prs.filter((p) => {
      const prNo = p.prNumber || "";
      const org = p.organization || p.company || "";
      const dept = p.department || "";
      const req = p.requesterName || p.requestedBy || "";
      const pur = p.purpose || "";

      const matchesSearch =
        prNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pur.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending Approval"
          ? p.status === "Pending Approval" || p.status === "Submitted"
          : p.status === statusFilter);

      const matchesPriority = priorityFilter === "All" || p.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [prs, searchTerm, statusFilter, priorityFilter]);

  const counts = useMemo(() => {
    const pending = prs.filter((p) => p.status === "Pending Approval" || p.status === "Submitted").length;
    const approved = prs.filter((p) => p.status === "Approved").length;
    const rejected = prs.filter((p) => p.status === "Rejected").length;
    const returned = prs.filter((p) => p.status === "Returned").length;
    return { pending, approved, rejected, returned, total: prs.length };
  }, [prs]);

  const handleOpenDecision = (type: "Approve" | "Reject" | "Return") => {
    setDecisionType(type);
    setDecisionRemarks("");
    setDecisionModalOpen(true);
  };

  const handleProcessDecision = () => {
    if (!selectedPR) return;

    if ((decisionType === "Reject" || decisionType === "Return") && !decisionRemarks.trim()) {
      toast.error(`Please provide remarks for why this PR is being ${decisionType.toLowerCase()}ed.`);
      return;
    }

    if (Object.keys(qtyErrors).length > 0) {
      toast.error("Please resolve approved quantity errors before confirming decision.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date().toISOString().split("T")[0];
      const newStatus =
        decisionType === "Approve" ? "Approved" : decisionType === "Reject" ? "Rejected" : "Returned";

      const updatedPRs = prs.map((p) => {
        if (p.id !== selectedPR.id) return p;

        const updatedItems = (p.items || []).map((it) => {
          const reqQty = it.requiredQuantity ?? it.requestedQuantity ?? 1;
          const appQty = approvedQuantities[it.id] != null ? approvedQuantities[it.id] : ((it as any).approvedQuantity ?? reqQty);
          return {
            ...it,
            approvedQuantity: appQty,
          };
        });

        // Clone approval stages and update
        const updatedStages = [...(p.approvalWorkflow || [])];
        let foundPending = false;
        for (let i = 0; i < updatedStages.length; i++) {
          if (updatedStages[i].status === "Pending") {
            updatedStages[i] = {
              ...updatedStages[i],
              status: decisionType === "Approve" ? "Approved" : decisionType === "Reject" ? "Rejected" : "Returned",
              actionDate: now,
              approverName: "Md. Rafiqul Islam (HOD / Authorized)",
              remarks: decisionRemarks || (decisionType === "Approve" ? "Verified and approved" : ""),
            };
            foundPending = true;
            break;
          }
        }
        if (!foundPending) {
          updatedStages.push({
            stageNumber: updatedStages.length + 1,
            stageName: "Executive Decision",
            approverRole: "Authorized Officer",
            approverName: "Md. Rafiqul Islam",
            status: newStatus as any,
            actionDate: now,
            remarks: decisionRemarks,
          });
        }

        return {
          ...p,
          items: updatedItems,
          status: newStatus as any,
          approvalWorkflow: updatedStages,
          auditHistory: [
            ...(p.auditHistory || []),
            {
              action: `PR ${decisionType}d by Md. Rafiqul Islam`,
              date: new Date().toISOString().replace("T", " ").substring(0, 19),
              user: "Md. Rafiqul Islam (Reviewer)",
              note: decisionRemarks || undefined,
            },
          ],
        };
      });

      setStoredPurchaseRequisitions(updatedPRs);
      setPrs(updatedPRs);
      setIsSubmitting(false);
      setDecisionModalOpen(false);
      toast.success(`Purchase Requisition ${selectedPR.prNumber} has been ${decisionType.toLowerCase()}ed!`);
    }, 400);
  };

  // Safe fallback helpers for selectedPR
  const selectedCost = selectedPR ? (selectedPR.totalEstimatedCost ?? selectedPR.totalEstimatedAmount ?? 0) : 0;
  const selectedBudget = selectedPR?.budgetHead || {
    code: "OPEX-GENERAL",
    name: "General Departmental Operational Budget",
    allocatedAmount: Math.max(selectedCost * 1.5, 500000),
    utilizedAmount: 0,
    remainingAmount: Math.max(selectedCost * 1.5, 500000),
    budgetAvailable: true,
  };
  const selectedStages = (selectedPR?.approvalWorkflow && selectedPR.approvalWorkflow.length > 0)
    ? selectedPR.approvalWorkflow
    : (selectedPR?.approvalHistory || []).map((ah, idx) => ({
        stageNumber: ah.level || idx + 1,
        stageName: ah.stageName,
        approverRole: ah.designation || "Approver",
        approverName: ah.approverName,
        status: (ah.action === "Approved" ? "Approved" : ah.action === "Submitted" ? "Approved" : "Pending") as any,
        actionDate: ah.dateTime?.split(" ")[0],
        remarks: ah.remarks,
      }));

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
                <span>Purchase Requisition</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Approval Management</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
                Purchase Requisition Approval
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Review, verify budgets, and make authorized approval decisions on pending purchase requisitions.
              </p>
            </div>
            {selectedPR && (
              <button
                onClick={() => setSelectedPrId(null)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Approval Queue
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => {
                setStatusFilter("Pending Approval");
                setSelectedPrId(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                statusFilter === "Pending Approval"
                  ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Awaiting Review</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-900">{counts.pending}</div>
              <p className="text-xs text-amber-600 mt-1">Needs attention</p>
            </button>

            <button
              onClick={() => {
                setStatusFilter("Approved");
                setSelectedPrId(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                statusFilter === "Approved"
                  ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Approved</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-900">{counts.approved}</div>
              <p className="text-xs text-emerald-600 mt-1">Ready for CS / PO</p>
            </button>

            <button
              onClick={() => {
                setStatusFilter("Returned");
                setSelectedPrId(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                statusFilter === "Returned"
                  ? "bg-orange-50 border-orange-300 ring-2 ring-orange-400"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Returned</span>
                <RotateCcw className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-900">{counts.returned}</div>
              <p className="text-xs text-orange-600 mt-1">Sent back for changes</p>
            </button>

            <button
              onClick={() => {
                setStatusFilter("Rejected");
                setSelectedPrId(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                statusFilter === "Rejected"
                  ? "bg-rose-50 border-rose-300 ring-2 ring-rose-400"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Rejected</span>
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-rose-900">{counts.rejected}</div>
              <p className="text-xs text-rose-600 mt-1">Declined requisitions</p>
            </button>
          </div>

          {!selectedPR ? (
            /* Queue List View */
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by PR #, department, requester..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending Approval">Pending Approval / Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Returned">Returned</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Priority:</span>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="All">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">PR Number & Date</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Requester</th>
                      <th className="py-3 px-4 text-right">Est. Cost (BDT)</th>
                      <th className="py-3 px-4 text-center">Priority</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredPrs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-medium text-slate-600">No requisitions found</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Try adjusting your search criteria or status filter.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredPrs.map((pr) => {
                        const estCost = pr.totalEstimatedCost ?? pr.totalEstimatedAmount ?? 0;
                        const org = pr.organization || pr.company || "Pakiza Group";
                        const reqName = pr.requesterName || pr.requestedBy || "Officer";
                        const reqDesig = pr.requesterDesignation || pr.designation || "Staff";
                        const curr = pr.currency || "BDT";

                        return (
                          <tr key={pr.id} className="hover:bg-slate-50/80 transition group">
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-indigo-600">{pr.prNumber}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {pr.prDate}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">{pr.department}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {reqName}
                              </div>
                              <div className="text-xs text-slate-400">{reqDesig}</div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="font-semibold text-slate-900">
                                {estCost.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                              </div>
                              <div className="text-[11px] text-slate-400">{curr}</div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                                  pr.priority === "Urgent"
                                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                                    : pr.priority === "High"
                                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                                    : pr.priority === "Medium"
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                              >
                                {pr.priority}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                  pr.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : pr.status === "Pending Approval" || pr.status === "Submitted"
                                    ? "bg-amber-100 text-amber-800 animate-pulse"
                                    : pr.status === "Returned"
                                    ? "bg-orange-100 text-orange-800"
                                    : pr.status === "Rejected"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {pr.status === "Approved" ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                ) : pr.status === "Returned" ? (
                                  <RotateCcw className="w-3 h-3 text-orange-600" />
                                ) : pr.status === "Rejected" ? (
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                ) : (
                                  <Clock className="w-3 h-3 text-amber-600" />
                                )}
                                {pr.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedPrId(pr.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-sm"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Review PR
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Detailed Review & Decision Screen */
            <div className="space-y-6">
              {/* Top Decision Bar */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">{selectedPR.prNumber}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedPR.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedPR.status === "Pending Approval" || selectedPR.status === "Submitted"
                          ? "bg-amber-100 text-amber-800"
                          : selectedPR.status === "Returned"
                          ? "bg-orange-100 text-orange-800"
                          : selectedPR.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {selectedPR.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        selectedPR.priority === "Urgent"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {selectedPR.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Submitted on {selectedPR.prDate} by{" "}
                    <strong className="text-slate-700">
                      {selectedPR.requesterName || selectedPR.requestedBy || "Staff"}
                    </strong>{" "}
                    ({selectedPR.requesterDesignation || selectedPR.designation || "Officer"}) -{" "}
                    {selectedPR.department}
                  </p>
                </div>

                {/* Decision Action Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleOpenDecision("Return")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Return for Revision
                  </button>
                  <button
                    onClick={() => handleOpenDecision("Reject")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition shadow-sm"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject Requisition
                  </button>
                  <button
                    onClick={() => handleOpenDecision("Approve")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve PR
                  </button>
                </div>
              </div>

              {/* Single Column Full-Width Flow */}
              <div className="space-y-6">
                {/* Requisition Header Summary */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Requisition Header Summary
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Required Date</span>
                      <span className="font-semibold text-slate-800">
                        {selectedPR.requiredByDate || selectedPR.requiredDate || "Immediate"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Purpose &amp; Justification</span>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                        {selectedPR.purpose}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Requested Items (Single Full-Width Table Section) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      Requested Items ({selectedPR.items?.length || 0})
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[950px]">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-100/75 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
                          <th className="py-2.5 px-3 w-10">#</th>
                          <th className="py-2.5 px-3">Item Details</th>
                          <th className="py-2.5 px-3">Specification</th>
                          <th className="py-2.5 px-3 w-28">Brand</th>
                          <th className="py-2.5 px-3 w-28">Origin</th>
                          <th className="py-2.5 px-3 w-20">UOM</th>
                          <th className="py-2.5 px-3 text-right w-24">Stock Quantity</th>
                          <th className="py-2.5 px-3 text-right w-20">Req Qty</th>
                          <th className="py-2.5 px-3 text-right w-28 bg-emerald-50/60 text-emerald-800">App QTY</th>
                          <th className="py-2.5 px-3 text-right w-24">Est. Unit Price</th>
                          <th className="py-2.5 px-3 text-right w-28">Total Est. Price</th>
                          <th className="py-2.5 px-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(selectedPR.items || []).map((item, idx) => {
                          const reqQty = item.requiredQuantity ?? item.requestedQuantity ?? 1;
                          const currentAppQty = approvedQuantities[item.id] != null ? approvedQuantities[item.id] : ((item as any).approvedQuantity ?? reqQty);
                          const unitPrice = item.estimatedUnitPrice ?? 0;
                          const lineTotal = item.totalEstimatedPrice ?? item.estimatedAmount ?? (reqQty * unitPrice);
                          const currentStockQty = item.currentStock ?? 150;

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-3 text-slate-400 font-mono font-medium">{idx + 1}</td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900">{item.itemName}</div>
                                <div className="text-[11px] font-mono text-slate-400">{item.itemCode}</div>
                              </td>
                              <td className="py-3 px-3 text-slate-600">
                                {item.specification || item.specifications || "—"}
                              </td>
                              <td className="py-3 px-3 text-slate-600">
                                {item.brand || "Standard OEM"}
                              </td>
                              <td className="py-3 px-3 text-slate-600">
                                {item.origin || "Imported"}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.uom}</td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const storeA = Math.round(currentStockQty * 0.53);
                                    const storeB = Math.round(currentStockQty * 0.33);
                                    const storeC = Math.max(0, currentStockQty - storeA - storeB);
                                    setStockModal({
                                      open: true,
                                      itemName: item.itemName,
                                      stockQty: currentStockQty,
                                      uom: item.uom || "Units",
                                      stores: [
                                        { name: "Store A", qty: storeA },
                                        { name: "Store B", qty: storeB },
                                        { name: "Store C", qty: storeC },
                                      ],
                                    });
                                  }}
                                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer bg-indigo-50/70 px-2 py-0.5 rounded transition"
                                  title="Click to view Store / Warehouse breakdown"
                                >
                                  <span>{currentStockQty.toLocaleString()}</span>
                                  <span className="text-[10px] text-indigo-400">ℹ</span>
                                </button>
                              </td>
                              <td className="py-3 px-3 text-right font-bold text-slate-900">
                                {reqQty.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right bg-emerald-50/30">
                                <input
                                  type="number"
                                  min={0}
                                  max={reqQty}
                                  value={currentAppQty}
                                  onChange={(e) => handleApprovedQtyChange(item.id, reqQty, e.target.value)}
                                  className={`w-20 text-right font-mono font-bold px-2 py-1 bg-white border rounded focus:ring-2 outline-none text-xs ${
                                    qtyErrors[item.id]
                                      ? "border-rose-500 focus:ring-rose-500/20 text-rose-600"
                                      : "border-emerald-500/50 focus:ring-emerald-500/20 focus:border-emerald-500 text-emerald-800"
                                  }`}
                                />
                                {qtyErrors[item.id] && (
                                  <div className="text-[9.5px] text-rose-500 font-bold mt-0.5 whitespace-nowrap">
                                    {qtyErrors[item.id]}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-slate-700">
                                {unitPrice.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 px-3 text-right font-bold text-indigo-700">
                                {lineTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                                {item.remarks || "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Supporting Documents (Full-Width) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-indigo-600" />
                    Supporting Documents ({selectedPR.attachments?.length || 0})
                  </h2>
                  {!selectedPR.attachments || selectedPR.attachments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No attachments attached to this requisition.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedPR.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-800 truncate">{att.fileName}</div>
                              <div className="text-[11px] text-slate-400">
                                {att.fileSize || "1.2 MB"} • Uploaded by {att.uploadedBy || "Requester"}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => toast.info(`Viewing preview of ${att.fileName}`)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
                            title="Download / View"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Approval Workflow Chain (Separate Full-Width Section with Scrolling) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Approval Workflow Chain
                    </h3>
                    <span className="text-xs text-slate-500">
                      Step {selectedPR.currentApprovalLevel || 2} of {selectedStages.length}
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto pr-2 space-y-4">
                    <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {selectedStages.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div
                            className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.status === "Approved"
                                ? "bg-emerald-500 text-white ring-4 ring-emerald-50"
                                : step.status === "Pending"
                                ? "bg-amber-500 text-white ring-4 ring-amber-50 animate-pulse"
                                : step.status === "Returned"
                                ? "bg-orange-500 text-white ring-4 ring-orange-50"
                                : step.status === "Rejected"
                                ? "bg-rose-500 text-white ring-4 ring-rose-50"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {step.status === "Approved" ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              step.stageNumber || idx + 1
                            )}
                          </div>

                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800">{step.stageName}</span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    step.status === "Approved"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : step.status === "Pending"
                                      ? "bg-amber-100 text-amber-800"
                                      : step.status === "Returned"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {step.status}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1">
                                <strong>{step.approverRole || "Role"}</strong>: {step.approverName || "Pending Assignee"}
                              </div>
                              {step.remarks && (
                                <div className="text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-200 mt-1.5 italic">
                                  &quot;{step.remarks}&quot;
                                </div>
                              )}
                            </div>

                            {step.actionDate && (
                              <div className="text-[10px] text-slate-400 font-mono shrink-0">
                                Date: {step.actionDate}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Decision Modal */}
          {decisionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      decisionType === "Approve"
                        ? "bg-emerald-100 text-emerald-700"
                        : decisionType === "Reject"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {decisionType === "Approve" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : decisionType === "Reject" ? (
                      <XCircle className="w-6 h-6" />
                    ) : (
                      <RotateCcw className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {decisionType} Purchase Requisition
                    </h3>
                    <p className="text-xs text-slate-500">
                      PR Number: <strong className="text-slate-700">{selectedPR?.prNumber}</strong>
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approval / Decision Remarks{" "}
                    {(decisionType === "Reject" || decisionType === "Return") && (
                      <span className="text-rose-500">* (Mandatory)</span>
                    )}
                  </label>
                  <textarea
                    rows={4}
                    value={decisionRemarks}
                    onChange={(e) => setDecisionRemarks(e.target.value)}
                    placeholder={
                      decisionType === "Approve"
                        ? "Enter optional approval notes or instructions..."
                        : decisionType === "Reject"
                        ? "Specify the exact reason for rejecting this requisition..."
                        : "Specify the clarifications or revisions requested from the initiator..."
                    }
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDecisionModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleProcessDecision}
                    className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition flex items-center gap-1.5 ${
                      decisionType === "Approve"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : decisionType === "Reject"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-orange-600 hover:bg-orange-700"
                    }`}
                  >
                    {isSubmitting && <Clock className="w-3.5 h-3.5 animate-spin" />}
                    Confirm {decisionType}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Stock Quantity Breakdown Modal */}
          {stockModal && stockModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Stock Quantity Breakdown</h3>
                    <p className="text-xs text-slate-500 truncate max-w-[240px]">{stockModal.itemName}</p>
                  </div>
                  <button
                    onClick={() => setStockModal(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-4 space-y-3">
                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-900">Stock Quantity:</span>
                    <span className="text-sm font-bold text-indigo-700">
                      {stockModal.stockQty.toLocaleString()} {stockModal.uom}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {stockModal.stores.map((st) => (
                      <div
                        key={st.name}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition text-xs"
                      >
                        <span className="font-medium text-slate-700">{st.name}</span>
                        <span className="font-bold text-slate-900">→ {st.qty.toLocaleString()} {stockModal.uom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStockModal(null)}
                    className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
