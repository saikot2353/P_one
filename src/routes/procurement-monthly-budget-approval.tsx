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
  ChevronRight,
  Layers,
  XCircle,
  RotateCcw,
  Check,
  FileSpreadsheet,
  DollarSign,
  Info,
  CalendarRange,
} from "lucide-react";
import {
  MonthlyBudgetRequisition,
  getStoredMonthlyBudgetRequisitions,
  setStoredMonthlyBudgetRequisitions,
} from "@/lib/procurement-requisition-data";

interface MBRApprovalSearch {
  id?: string;
}

export const Route = createFileRoute("/procurement-monthly-budget-approval")({
  validateSearch: (search: Record<string, unknown>): MBRApprovalSearch => {
    return {
      id: search.id as string | undefined,
    };
  },
  component: MonthlyBudgetApprovalPage,
});

export default function MonthlyBudgetApprovalPage() {
  const search = Route.useSearch();
  const [requisitions, setRequisitions] = useState<MonthlyBudgetRequisition[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(search.id || null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Submitted");
  const [monthFilter, setMonthFilter] = useState<string>("All");

  // Decision Modal
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"Approve" | "Reject" | "Return">("Approve");
  const [decisionRemarks, setDecisionRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stock Quantity Breakdown Modal State
  const [stockModal, setStockModal] = useState<{
    open: boolean;
    itemName: string;
    stockQty: number;
    uom: string;
    stores: { name: string; qty: number }[];
  } | null>(null);

  // Editable App QTY state for approver
  const [approvedQuantities, setApprovedQuantities] = useState<Record<string, number>>({});
  const [qtyErrors, setQtyErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setRequisitions(getStoredMonthlyBudgetRequisitions());
  }, []);

  useEffect(() => {
    if (search.id) {
      setSelectedReqId(search.id);
    }
  }, [search.id]);

  const selectedReq = useMemo(() => {
    return requisitions.find((r) => r.id === selectedReqId) || null;
  }, [requisitions, selectedReqId]);

  const filteredList = useMemo(() => {
    return (requisitions || []).filter((r) => {
      const reqNo = r.requisitionNumber || r.requisitionId || "";
      const org = r.organization || r.company || "";
      const dept = r.department || "";
      const bMonth = r.budgetMonth || "";

      const matchesSearch =
        reqNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bMonth.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Submitted"
          ? r.status === "Submitted" || r.status === "Pending Approval"
          : r.status === statusFilter);

      const matchesMonth = monthFilter === "All" || bMonth === monthFilter;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [requisitions, searchTerm, statusFilter, monthFilter]);

  const counts = useMemo(() => {
    const pending = (requisitions || []).filter(
      (r) => r.status === "Submitted" || r.status === "Pending Approval"
    ).length;
    const approved = (requisitions || []).filter((r) => r.status === "Approved").length;
    const rejected = (requisitions || []).filter((r) => r.status === "Rejected").length;
    return { pending, approved, rejected, total: (requisitions || []).length };
  }, [requisitions]);

  const uniqueMonths = useMemo(() => {
    return Array.from(new Set((requisitions || []).map((r) => r.budgetMonth || ""))).filter(Boolean).sort().reverse();
  }, [requisitions]);

  useEffect(() => {
    if (selectedReq?.items) {
      const initAppQties: Record<string, number> = {};
      selectedReq.items.forEach((it) => {
        initAppQties[it.id] = (it as any).approvedQuantity !== undefined ? (it as any).approvedQuantity : (it.estimatedQuantity ?? 0);
      });
      setApprovedQuantities(initAppQties);
      setQtyErrors({});
    }
  }, [selectedReq]);

  const handleOpenDecision = (type: "Approve" | "Reject" | "Return") => {
    if (type === "Approve") {
      const hasErrors = Object.keys(qtyErrors).length > 0;
      if (hasErrors) {
        toast.error("Please correct invalid Approved Quantities before approving.");
        return;
      }
    }
    setDecisionType(type);
    setDecisionRemarks("");
    setDecisionModalOpen(true);
  };

  const handleProcessDecision = () => {
    if (!selectedReq) return;

    if ((decisionType === "Reject" || decisionType === "Return") && !decisionRemarks.trim()) {
      toast.error(`Please provide remarks for why this budget is being ${decisionType.toLowerCase()}ed.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const newStatus =
        decisionType === "Approve" ? "Approved" : decisionType === "Reject" ? "Rejected" : "Draft";

      const updated = requisitions.map((r) => {
        if (r.id !== selectedReq.id) return r;
        const itemsWithApprovedQty = (r.items || []).map((it) => {
          const appQty = approvedQuantities[it.id] !== undefined ? approvedQuantities[it.id] : (it.estimatedQuantity ?? 0);
          return {
            ...it,
            approvedQuantity: appQty,
          };
        });

        return {
          ...r,
          status: newStatus as any,
          items: itemsWithApprovedQty,
          auditHistory: [
            ...(r.auditHistory || []),
            {
              action: `Monthly Budget ${decisionType}d by Budget Committee`,
              date: now,
              user: "Budget Committee (Admin)",
              note: decisionRemarks || undefined,
            },
          ],
        };
      });

      setStoredMonthlyBudgetRequisitions(updated);
      setRequisitions(updated);
      setIsSubmitting(false);
      setDecisionModalOpen(false);
      toast.success(
        `Monthly Budget Requisition ${selectedReq.requisitionNumber || selectedReq.requisitionId} has been ${decisionType.toLowerCase()}ed!`
      );
    }, 400);
  };

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
                <span>Monthly Budget Approval</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
                Monthly Budget Requisition Approval
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Verify department monthly planned material quotas, validate budget caps, and sanction requisitions.
              </p>
            </div>
            {selectedReq && (
              <button
                onClick={() => setSelectedReqId(null)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Budget Queue
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => {
                setStatusFilter("Submitted");
                setSelectedReqId(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                statusFilter === "Submitted"
                  ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Awaiting Review
                </span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-900">{counts.pending}</div>
              <p className="text-xs text-amber-600 mt-1">Needs committee sign-off</p>
            </button>

            <button
              onClick={() => {
                setStatusFilter("Approved");
                setSelectedReqId(null);
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
              <p className="text-xs text-emerald-600 mt-1">Active for PR issuance</p>
            </button>

            <button
              onClick={() => {
                setStatusFilter("Rejected");
                setSelectedReqId(null);
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
              <p className="text-xs text-rose-600 mt-1">Disapproved budgets</p>
            </button>
          </div>

          {!selectedReq ? (
            /* Queue List */
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Budget #, department, month..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Month:</span>
                    <select
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="All">All Months</option>
                      {uniqueMonths.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="All">All</option>
                      <option value="Submitted">Pending Approval / Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Budget Requisition #</th>
                      <th className="py-3 px-4">Budget Month</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Requested By</th>
                      <th className="py-3 px-4 text-center">Items</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-medium text-slate-600">No monthly budget requisitions found</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Try adjusting your search criteria or status filter.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((req) => {
                        const reqNo = req.requisitionNumber || req.requisitionId || "MBR";
                        const org = req.organization || req.company || "Pakiza Group";
                        const itemsCount = req.items?.length || 0;
                        const requesterName = req.requestedBy || (req as any).requesterName || (req as any).employeeName || "Tariqul Islam (Procurement)";

                        return (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition group">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-indigo-600">{reqNo}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {req.requisitionDate}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              <Calendar className="w-3 h-3 text-indigo-500" />
                              {req.budgetMonth}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">{req.department}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">{requesterName}</div>
                            <div className="text-xs text-slate-400">Creator</div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                              {itemsCount} items
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                req.status === "Approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : req.status === "Submitted"
                                  ? "bg-amber-100 text-amber-800 animate-pulse"
                                  : req.status === "Rejected"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {req.status === "Approved" ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : req.status === "Rejected" ? (
                                <XCircle className="w-3 h-3 text-rose-600" />
                              ) : (
                                <Clock className="w-3 h-3 text-amber-600" />
                              )}
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedReqId(req.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-sm cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Review Budget
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
          ) : selectedReq ? (
            /* Review & Decision Screen */
            (() => {
              const reqNo = selectedReq.requisitionNumber || (selectedReq as any).requisitionId || "MBR";
              const org = selectedReq.organization || (selectedReq as any).company || "Pakiza Group";
              const itemsList = selectedReq.items || [];
              const requesterName = selectedReq.requestedBy || (selectedReq as any).requesterName || (selectedReq as any).employeeName || "Tariqul Islam (Procurement)";

              return (
            <div className="space-y-6">
              {/* Decision Bar */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">{reqNo}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedReq.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedReq.status === "Submitted"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {selectedReq.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Budget Month: {selectedReq.budgetMonth}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-6 text-xs text-slate-500 mt-2">
                    <div>
                      <span className="text-slate-400">Budget Submission Date: </span>
                      <strong className="text-slate-800 font-semibold">{selectedReq.requisitionDate || "2026-09-20"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Requested By: </span>
                      <strong className="text-slate-800 font-semibold">{requesterName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Department: </span>
                      <strong className="text-slate-800 font-semibold">{selectedReq.department}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReqId(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition self-start md:self-auto cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to List
                </button>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Monthly Estimated Line Items ({itemsList.length})
                  </h2>
                  <div className="text-xs text-slate-500 font-medium">
                    Requested items aligned with budget approval requirements
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/75 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Item Name</th>
                        <th className="py-2.5 px-3">Item Specification</th>
                        <th className="py-2.5 px-3">Brand</th>
                        <th className="py-2.5 px-3">Origin</th>
                        <th className="py-2.5 px-3">UOM</th>
                        <th className="py-2.5 px-3 text-right">Stock Quantity</th>
                        <th className="py-2.5 px-3 text-right">Est. Req Qty</th>
                        <th className="py-2.5 px-3 text-right min-w-[120px]">App QTY *</th>
                        <th className="py-2.5 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {itemsList.map((item, idx) => {
                        const stockQty = (item as any).currentStock ?? 150;
                        const reqQty = item.estimatedQuantity ?? 0;
                        const currentAppQty = approvedQuantities[item.id] !== undefined ? approvedQuantities[item.id] : reqQty;
                        const err = qtyErrors[item.id];

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-3 text-slate-400 font-medium">{idx + 1}</td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900">{item.itemName}</div>
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              {item.specification || (item as any).spec || "—"}
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
                                  const storeA = Math.round(stockQty * 0.53);
                                  const storeB = Math.round(stockQty * 0.33);
                                  const storeC = Math.max(0, stockQty - storeA - storeB);
                                  setStockModal({
                                    open: true,
                                    itemName: item.itemName,
                                    stockQty: stockQty,
                                    uom: item.uom || "Units",
                                    stores: [
                                      { name: "Store A", qty: storeA },
                                      { name: "Store B", qty: storeB },
                                      { name: "Store C", qty: storeC },
                                    ],
                                  });
                                }}
                                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer bg-indigo-50/70 px-2 py-0.5 rounded transition"
                                title="Click to view Store / Warehouse stock breakdown"
                              >
                                <span>{stockQty.toLocaleString()}</span>
                                <span className="text-[10px] text-indigo-400">ℹ</span>
                              </button>
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-slate-900">
                              {reqQty.toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex flex-col items-end">
                                <input
                                  type="number"
                                  min="0"
                                  max={reqQty}
                                  value={currentAppQty}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val > reqQty) {
                                      setQtyErrors((prev) => ({
                                        ...prev,
                                        [item.id]: `Cannot exceed Req Qty (${reqQty})`,
                                      }));
                                    } else if (val < 0) {
                                      setQtyErrors((prev) => ({
                                        ...prev,
                                        [item.id]: `Cannot be negative`,
                                      }));
                                    } else {
                                      setQtyErrors((prev) => {
                                        const next = { ...prev };
                                        delete next[item.id];
                                        return next;
                                      });
                                    }
                                    setApprovedQuantities((prev) => ({ ...prev, [item.id]: val }));
                                  }}
                                  className={`w-24 text-right px-2 py-1 text-xs border rounded-lg font-bold outline-none transition ${
                                    err
                                      ? "border-rose-400 bg-rose-50 text-rose-700 focus:ring-1 focus:ring-rose-400"
                                      : "border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                  }`}
                                />
                                {err && (
                                  <span className="text-[10px] text-rose-600 font-medium mt-0.5 whitespace-nowrap">
                                    {err}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-600">{item.remarks || "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Department Remarks */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Department Remarks & Operational Justification
                </h3>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedReq.remarks || "No additional remarks specified."}
                </p>
              </div>

              {/* Action Area in Footer */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedReqId(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Approvals List
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleOpenDecision("Return")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition shadow-sm cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Return for Correction
                  </button>
                  <button
                    onClick={() => handleOpenDecision("Reject")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition shadow-sm cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject Budget
                  </button>
                  <button
                    onClick={() => handleOpenDecision("Approve")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Budget
                  </button>
                </div>
              </div>
            </div>
              );
            })()
          ) : null}

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
                      {decisionType} Monthly Budget
                    </h3>
                    <p className="text-xs text-slate-500">
                      Budget No: <strong className="text-slate-700">{selectedReq?.requisitionNumber}</strong>
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Committee Decision Remarks{" "}
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
                        ? "Enter optional approval notes or sanction conditions..."
                        : decisionType === "Reject"
                        ? "Specify the reason for rejecting this budget quota..."
                        : "Specify the clarifications or revisions requested from the department..."
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
                    className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
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
