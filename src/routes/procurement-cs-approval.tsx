import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { toast } from "sonner";
import {
  Scale,
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
  FileCheck,
  Award,
  Users,
  DollarSign,
  TrendingDown,
  RotateCcw,
  ShieldCheck,
  FileSpreadsheet,
  Printer,
  Paperclip,
  FileText,
} from "lucide-react";
import {
  ComparativeStatement,
  CSItemQuote,
  getStoredComparativeStatements,
  setStoredComparativeStatements,
  computeLowestPrice,
} from "@/lib/procurement-requisition-data";

interface CSApprovalSearch {
  id?: string;
}

export const Route = createFileRoute("/procurement-cs-approval")({
  validateSearch: (search: Record<string, unknown>): CSApprovalSearch => {
    return {
      id: search.id as string | undefined,
    };
  },
  component: CSApprovalPage,
});

export default function CSApprovalPage() {
  const search = Route.useSearch();
  const [statements, setStatements] = useState<ComparativeStatement[]>([]);
  const [selectedCsId, setSelectedCsId] = useState<string | null>(search.id || null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Under Review");
  const [procurementTypeFilter, setProcurementTypeFilter] = useState<string>("All");

  // Decision Modal
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"Approve" | "Reject">("Approve");
  const [decisionRemarks, setDecisionRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load all CS statements automatically from storage
  useEffect(() => {
    setStatements(getStoredComparativeStatements());
  }, []);

  useEffect(() => {
    if (search.id) {
      setSelectedCsId(search.id);
    }
  }, [search.id]);

  const selectedCS = useMemo(() => {
    return statements.find((s) => s.id === selectedCsId) || null;
  }, [statements, selectedCsId]);

  const filteredList = useMemo(() => {
    return (statements || []).filter((s) => {
      const csNum = s.csNumber || "";
      const prNum = s.prNumber || "";
      const org = s.organization || (s as any).company || "";
      const recSupp = s.recommendedSupplierName || "";
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        csNum.toLowerCase().includes(term) ||
        prNum.toLowerCase().includes(term) ||
        org.toLowerCase().includes(term) ||
        recSupp.toLowerCase().includes(term) ||
        (s.linkedPRs || []).some((lp) => lp.prNumber.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Under Review"
          ? s.status === "Under Review" || s.status === "Submitted"
          : s.status === statusFilter);

      const matchesType =
        procurementTypeFilter === "All" || s.procurementType === procurementTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [statements, searchTerm, statusFilter, procurementTypeFilter]);

  const counts = useMemo(() => {
    const underReview = (statements || []).filter(
      (s) => s.status === "Under Review" || s.status === "Submitted"
    ).length;
    const approved = (statements || []).filter((s) => s.status === "Approved").length;
    const rejected = (statements || []).filter((s) => s.status === "Rejected").length;
    return { underReview, approved, rejected, total: (statements || []).length };
  }, [statements]);

  // Compute breakdown of items grouped by assigned supplier for selected CS
  const selectedAwardGroups = useMemo(() => {
    if (!selectedCS) return [];
    const map: Record<
      string,
      { supplierId: string; supplierName: string; items: CSItemQuote[]; totalAmount: number }
    > = {};

    (selectedCS.items || []).forEach((it) => {
      const sId =
        it.assignedSupplierId ||
        selectedCS.recommendedSupplierId ||
        selectedCS.suppliers?.[0]?.supplierId ||
        "unassigned";
      const sName =
        it.assignedSupplierName ||
        selectedCS.suppliers?.find((s: any) => s.supplierId === sId)?.supplierName ||
        "Awarded Supplier";
      const quote = it.quotes?.[sId];
      const itemTotal =
        typeof quote?.unitPrice === "number"
          ? quote.unitPrice * it.quantity
          : it.estimatedTotalPrice;

      if (!map[sId]) {
        map[sId] = { supplierId: sId, supplierName: sName, items: [], totalAmount: 0 };
      }
      map[sId].items.push(it);
      map[sId].totalAmount += itemTotal;
    });

    return Object.values(map);
  }, [selectedCS]);

  const handleOpenDecision = (type: "Approve" | "Reject") => {
    setDecisionType(type);
    setDecisionRemarks("");
    setDecisionModalOpen(true);
  };

  const handleProcessDecision = () => {
    if (!selectedCS) return;

    if (decisionType === "Reject" && !decisionRemarks.trim()) {
      toast.error("Please provide a justification remark for rejection.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const newStatus = decisionType === "Approve" ? "Approved" : "Rejected";

      const updatedWorkflow = (selectedCS.approvalWorkflow || []).map((w) => ({
        ...w,
        status: newStatus as any,
        actionDate: now.split(" ")[0],
        remarks: decisionRemarks || w.remarks,
      }));

      const updated = statements.map((cs) => {
        if (cs.id !== selectedCS.id) return cs;
        return {
          ...cs,
          status: newStatus as any,
          approvalWorkflow: updatedWorkflow,
          approvalRemarks: decisionRemarks || undefined,
          approvalDate: now.split(" ")[0],
          auditHistory: [
            ...(cs.auditHistory || []),
            {
              action: `Comparative Statement ${decisionType}d by Purchase Approval Authority`,
              date: now,
              user: "Authorized Executive Approver",
              note: decisionRemarks || undefined,
            },
          ],
        };
      });

      setStoredComparativeStatements(updated);
      setStatements(updated);
      setIsSubmitting(false);
      setDecisionModalOpen(false);
      toast.success(`Comparative Statement ${selectedCS.csNumber} has been ${decisionType.toLowerCase()}d!`);
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
                <span>Procurement</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>CS Approval</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
                Comparative Statement (CS) Approval
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Review consolidated supplier quotations, multi-PR coverage, item-wise vendor awards, and sanction or reject comparative statements.
              </p>
            </div>

            {selectedCS && (
              <button
                onClick={() => setSelectedCsId(null)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to CS Queue
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => {
                setStatusFilter("Under Review");
                setSelectedCsId(null);
              }}
              className={`p-4 rounded-xl border text-left transition shadow-xs cursor-pointer ${statusFilter === "Under Review" && !selectedCsId
                  ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20"
                  : "bg-white border-slate-200 hover:border-slate-300"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Pending Approval
                </span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-900">{counts.underReview}</div>
              <p className="text-xs text-amber-600 mt-1">Awaiting executive sanction</p>
            </button>

            <button
              onClick={() => {
                setStatusFilter("Approved");
                setSelectedCsId(null);
              }}
              className={`p-4 rounded-xl border text-left transition shadow-xs cursor-pointer ${statusFilter === "Approved" && !selectedCsId
                  ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20"
                  : "bg-white border-slate-200 hover:border-slate-300"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Approved
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-900">{counts.approved}</div>
              <p className="text-xs text-emerald-600 mt-1">Sanctioned & ready for PO/WO</p>
            </button>

            <button
              onClick={() => {
                setStatusFilter("Rejected");
                setSelectedCsId(null);
              }}
              className={`p-4 rounded-xl border text-left transition shadow-xs cursor-pointer ${statusFilter === "Rejected" && !selectedCsId
                  ? "bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20"
                  : "bg-white border-slate-200 hover:border-slate-300"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                  Rejected
                </span>
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-rose-900">{counts.rejected}</div>
              <p className="text-xs text-rose-600 mt-1">Declined comparative statements</p>
            </button>
          </div>

          {!selectedCS ? (
            /* Queue List */
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by CS #, PR #, supplier, dept..."
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
                      <option value="Under Review">Pending Approval / Under Review</option>
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
                      <th className="py-3 px-4">CS Number</th>
                      <th className="py-3 px-4">Linked PR Reference</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4 text-center">Bidders</th>
                      <th className="py-3 px-4">Recommended Awarded Winner</th>
                      <th className="py-3 px-4 text-right">Value (BDT)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-medium text-slate-600">No comparative statements found</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Try adjusting your search criteria or status filter.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((cs) => {
                        const csNum = cs.csNumber || "CS";
                        const org = cs.organization || (cs as any).company || "Pakiza Group";
                        const prNum = cs.prNumber || "PR Reference";
                        const prEst = cs.prTotalEstimatedCost ?? (cs as any).totalEstimatedValue ?? 0;
                        const supQuotesCount = (cs.suppliers || []).length;
                        const recSupp = cs.recommendedSupplierName || "Pending Decision";
                        const negTotal = cs.negotiatedTotal ?? 0;

                        return (
                          <tr key={cs.id} className="hover:bg-slate-50/80 transition group">
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-indigo-600">{csNum}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {cs.csDate}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">
                                {cs.linkedPRs && cs.linkedPRs.length > 1 ? (
                                  <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold text-xs border border-indigo-100">
                                    {cs.linkedPRs.length} PRs Linked
                                  </span>
                                ) : (
                                  prNum
                                )}
                              </div>
                              {cs.linkedPRs && cs.linkedPRs.length > 1 && (
                                <div
                                  className="text-[10px] text-slate-400 truncate max-w-[170px]"
                                  title={cs.linkedPRs.map((p) => p.prNumber).join(", ")}
                                >
                                  {cs.linkedPRs.map((p) => p.prNumber).join(", ")}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">{cs.department || "Procurement & Commercial"}</div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                                <Users className="w-3 h-3" />
                                {supQuotesCount} Quotes
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-xs">
                              —
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="font-bold text-slate-900">
                                {negTotal.toLocaleString("en-BD", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                              <div className="text-[11px] text-slate-400">{cs.currency || "BDT"}</div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${cs.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : cs.status === "Under Review"
                                      ? "bg-amber-100 text-amber-800 animate-pulse"
                                      : cs.status === "Rejected"
                                        ? "bg-rose-100 text-rose-800"
                                        : "bg-slate-100 text-slate-700"
                                  }`}
                              >
                                {cs.status === "Approved" ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                ) : cs.status === "Rejected" ? (
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                ) : (
                                  <Clock className="w-3 h-3 text-amber-600" />
                                )}
                                {cs.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedCsId(cs.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-xs cursor-pointer"
                              >
                                <Scale className="w-3.5 h-3.5" />
                                Review & Decide
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
            /* Review & Decision Screen */
            (() => {
              const viewSuppliers = selectedCS.suppliers || [];
              const viewItems = selectedCS.items || [];
              const viewScorecards = selectedCS.technicalScorecards || [];
              const viewPrEst =
                selectedCS.prTotalEstimatedCost ?? (selectedCS as any).totalEstimatedValue ?? 0;
              const viewNegTotal = selectedCS.negotiatedTotal ?? 0;
              const viewSavings = selectedCS.estimatedSavings ?? 0;
              const csNum = selectedCS.csNumber || "CS";
              const org = selectedCS.organization || (selectedCS as any).company || "Pakiza Group";

              return (
                <div className="space-y-6">
                  {/* Decision Top Bar */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl font-bold text-slate-900">{csNum}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedCS.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : selectedCS.status === "Under Review"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                        >
                          {selectedCS.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {selectedCS.procurementType}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-6 text-xs text-slate-500 mt-2">
                        <div>
                          <span className="text-slate-400">Prepared By: </span>
                          <strong className="text-slate-800 font-semibold">{selectedCS.preparedBy}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Department: </span>
                          <strong className="text-slate-800">{selectedCS.department}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Contract Total: </span>
                          <strong className="text-indigo-700 font-bold">
                            BDT {viewNegTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleOpenDecision("Reject")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition shadow-xs cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject CS
                      </button>
                      <button
                        onClick={() => handleOpenDecision("Approve")}
                        className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve CS
                      </button>
                    </div>
                  </div>

                  {/* Section 13: Assigned Suppliers */}
                  {selectedAwardGroups.length > 0 && (
                    <div className="rounded-xl border border-indigo-200 bg-white p-5 space-y-4 shadow-sm">
                      <div className="border-b border-slate-200 pb-3">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-500" />
                          Assigned Suppliers
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Suppliers assigned for procurement under this Comparative Statement
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedAwardGroups.map((grp) => (
                          <div
                            key={grp.supplierId}
                            className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-2.5 text-xs"
                          >
                            <div className="flex items-center justify-between border-b border-indigo-100/70 pb-2">
                              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-indigo-600 inline-block"></span>
                                {grp.supplierName}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                                {grp.items.length} Products Allocated
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {grp.items.map((it) => {
                                const q = it.quotes?.[grp.supplierId];
                                const itemAmt =
                                  typeof q?.unitPrice === "number"
                                    ? q.unitPrice * it.quantity
                                    : it.estimatedTotalPrice;
                                return (
                                  <div
                                    key={it.id}
                                    className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded border border-indigo-50"
                                  >
                                    <div>
                                      <span className="font-medium text-slate-800">{it.itemName}</span>
                                      <div className="text-[10px] text-slate-500 mt-0.5">
                                        {it.specification && <span>Spec: {it.specification} • </span>}
                                        <span>Origin: {it.origin || "Imported"}</span>
                                        {it.brand && <span className="text-slate-400"> • Brand: {it.brand}</span>}
                                      </div>
                                    </div>
                                    <div className="font-bold text-slate-900 text-right">
                                      BDT {itemAmt.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="pt-2 border-t border-indigo-100 flex justify-between items-center text-xs font-bold text-indigo-950">
                              <span>Supplier Award Subtotal:</span>
                              <span>
                                BDT {grp.totalAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 14: Comprehensive Item-Wise Quotations Matrix */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-indigo-600" />
                        Comprehensive Item-Wise Quotations Matrix ({viewItems.length} Items)
                      </h2>
                      <span className="text-[11px] text-slate-500">
                        Green highlight indicates Lowest Evaluated Bidder (L1) per item
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700 text-[11px]">
                            <th className="py-2.5 px-3 border-r border-slate-200 w-8">#</th>
                            <th className="py-2.5 px-3 border-r border-slate-200 min-w-[200px]">
                              Item Description & Origin
                            </th>
                            <th className="py-2.5 px-3 border-r border-slate-200 w-16 text-center">UOM</th>
                            <th className="py-2.5 px-3 border-r border-slate-200 w-16 text-right">Qty</th>
                            <th className="py-2.5 px-3 border-r border-slate-200 w-24 text-right">
                              PR Est. Rate
                            </th>
                            {viewSuppliers.map((s) => (
                              <th
                                key={s.supplierId}
                                className="py-2.5 px-3 border-r border-slate-200 min-w-[170px] text-center bg-slate-50/70"
                              >
                                <div className="font-bold text-slate-900 truncate">{s.supplierName}</div>
                                <div className="text-[10px] text-slate-500 font-normal">
                                  Ref: {s.quotationRef}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {viewItems.map((item, idx) => {
                            const lowestPrice = computeLowestPrice(
                              item.quotes || {},
                              viewSuppliers.map((s) => s.supplierId)
                            );

                            return (
                              <tr key={item.id} className="hover:bg-slate-50/50">
                                <td className="py-2.5 px-3 border-r border-slate-200 text-slate-400 font-medium">
                                  {idx + 1}
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-200">
                                  <div className="font-semibold text-slate-900">{item.itemName}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5 space-y-0.5">
                                    {item.specification && <div>Spec: {item.specification}</div>}
                                    <div className="text-slate-400">
                                      Origin: {item.origin || "Imported"} • Brand: {item.brand || "OEM"}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-200 text-center font-medium text-slate-600">
                                  {item.uom}
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-200 text-right font-bold text-slate-900">
                                  {item.quantity}
                                </td>
                                <td className="py-2.5 px-3 border-r border-slate-200 text-right text-slate-600 font-medium">
                                  {(item.estimatedUnitPrice ?? 0).toLocaleString()}
                                </td>

                                {viewSuppliers.map((s) => {
                                  const q = item.quotes?.[s.supplierId];
                                  const isLowest =
                                    typeof q?.unitPrice === "number" &&
                                    lowestPrice !== null &&
                                    q.unitPrice === lowestPrice;

                                  return (
                                    <td
                                      key={s.supplierId}
                                      className={`py-2.5 px-3 border-r border-slate-200 text-right ${isLowest ? "bg-emerald-50/70" : ""
                                        }`}
                                    >
                                      {q?.unitPrice === null || q?.unitPrice === undefined ? (
                                        <span className="text-slate-400 italic">Blank</span>
                                      ) : q?.unitPrice === "NA" ? (
                                        <span className="text-rose-500 font-medium">N/A</span>
                                      ) : (
                                        <div>
                                          <div className="flex items-center justify-end gap-1.5">
                                            {isLowest && (
                                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-200/80 px-1 rounded">
                                                L1
                                              </span>
                                            )}
                                            <span className="font-bold text-slate-900">
                                              {(typeof q.unitPrice === "number"
                                                ? q.unitPrice
                                                : 0
                                              ).toLocaleString("en-BD", {
                                                minimumFractionDigits: 2,
                                              })}
                                            </span>
                                          </div>
                                          <div className="text-[10px] text-slate-500">
                                            Total: {(q.totalPrice ?? 0).toLocaleString()}
                                          </div>
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 15: CS Approval Attachment */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-indigo-600" />
                        CS Attachments ({(selectedCS.attachments || []).length})
                      </h3>
                      <span className="text-[11px] text-slate-500">Supporting documents submitted with CS</span>
                    </div>

                    {(!selectedCS.attachments || selectedCS.attachments.length === 0) ? (
                      <p className="text-xs text-slate-400 italic py-2">No attachments were uploaded with this Comparative Statement.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedCS.attachments.map((att: any, idx: number) => (
                          <div
                            key={att.id || idx}
                            className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <div className="font-semibold text-slate-900 truncate">{att.documentName || att.fileName}</div>
                                <div className="text-[10px] text-slate-500">{att.fileSize || "750 KB"} • {att.uploadedBy}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 shrink-0">
                              Attached
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          )}

          {/* Decision Modal */}
          {decisionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2.5 rounded-xl ${decisionType === "Approve"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                      }`}
                  >
                    {decisionType === "Approve" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {decisionType} Comparative Statement
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedCS?.csNumber} • {selectedCS?.organization}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Decision Remarks & Notes {decisionType === "Reject" ? "*" : "(Optional)"}
                    </label>
                    <textarea
                      rows={3}
                      value={decisionRemarks}
                      onChange={(e) => setDecisionRemarks(e.target.value)}
                      placeholder={
                        decisionType === "Approve"
                          ? "e.g. Approved by Purchase Committee as recommended. Authorize PO issuance."
                          : "e.g. Pricing variance exceeds allowable ceiling or specification mismatch."
                      }
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setDecisionModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleProcessDecision}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg transition shadow-sm ${decisionType === "Approve"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-rose-600 hover:bg-rose-700"
                        }`}
                    >
                      {isSubmitting ? "Processing..." : `Confirm ${decisionType}`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
