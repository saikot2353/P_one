import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  Filter,
  Search,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  User,
  AlertTriangle,
  X,
  Clock,
  ArrowRight,
  Package,
  Layers,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import {
  TransferRequisition,
  getStoredTransferRequisitions,
  saveStoredTransferRequisitions,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-transfer-requisition-approval")({
  head: () => ({
    meta: [
      { title: "Transfer Requisition Approval — Inventory ERP" },
      {
        name: "description",
        content: "Review, approve, reject, or return inter-company stock transfer requisitions.",
      },
    ],
  }),
  component: TransferRequisitionApprovalPage,
});

function TransferRequisitionApprovalPage() {
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState<TransferRequisition[]>(() =>
    getStoredTransferRequisitions()
  );

  useEffect(() => {
    saveStoredTransferRequisitions(requisitions);
  }, [requisitions]);

  // Active Approving Entity (The company from which goods are requested)
  const [activeCompany, setActiveCompany] = useState<string>("All");

  // Tabs: Pending Approval (Default) vs All
  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "returned" | "rejected" | "all"
  >("pending");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Inspect Modal
  const [inspectedReq, setInspectedReq] = useState<TransferRequisition | null>(null);

  // Action Dialog State (Reject or Return for Correction)
  const [actionTarget, setActionTarget] = useState<TransferRequisition | null>(null);
  const [actionType, setActionType] = useState<"Approve" | "Reject" | "Return" | null>(null);
  const [actionComment, setActionComment] = useState("");

  // Report Modal
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<TransferRequisition | null>(null);

  // Filtered List
  const filteredList = useMemo(() => {
    return requisitions.filter((r) => {
      // Company constraint: for inter-company transfer, this requisition must be requested FROM this company
      if (activeCompany !== "All" && r.requestedFromCompany !== activeCompany) {
        return false;
      }

      // Tab filter
      if (activeTab === "pending" && r.status !== "Approval Pending") return false;
      if (activeTab === "approved" && r.status !== "Approved" && r.status !== "Fully Issued") return false;
      if (activeTab === "returned" && r.status !== "Returned for Correction") return false;
      if (activeTab === "rejected" && r.status !== "Rejected") return false;

      // Transfer Type filter
      if (typeFilter !== "All" && r.transferType !== typeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.requisitionNumber.toLowerCase().includes(q) ||
          r.requisitioningCompany.toLowerCase().includes(q) ||
          r.requisitioningStore.toLowerCase().includes(q) ||
          r.requestedFromStore.toLowerCase().includes(q) ||
          r.requestedBy.toLowerCase().includes(q) ||
          r.items.some((i) => i.itemName.toLowerCase().includes(q) || i.itemCode.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [requisitions, activeCompany, activeTab, typeFilter, searchQuery]);

  // Action Execution
  const handleExecuteAction = () => {
    if (!actionTarget || !actionType) return;

    if ((actionType === "Reject" || actionType === "Return") && !actionComment.trim()) {
      toast.error(`Please provide justification/remarks to ${actionType === "Reject" ? "reject" : "return"} this requisition.`);
      return;
    }

    const updated = requisitions.map((r) => {
      if (r.id !== actionTarget.id) return r;

      if (actionType === "Approve") {
        return {
          ...r,
          status: "Approved" as const,
          approvedBy: "Engr. Tanvir Ahmed (Authorized Operations Approver)",
          approvalDate: new Date().toISOString().slice(0, 10),
          approvalRemarks: actionComment.trim() || "Approved for Transfer Issue fulfillment.",
          updatedAt: new Date().toISOString(),
        };
      }

      if (actionType === "Reject") {
        return {
          ...r,
          status: "Rejected" as const,
          rejectedRemarks: actionComment.trim(),
          updatedAt: new Date().toISOString(),
        };
      }

      if (actionType === "Return") {
        return {
          ...r,
          status: "Returned for Correction" as const,
          returnedRemarks: actionComment.trim(),
          updatedAt: new Date().toISOString(),
        };
      }

      return r;
    });

    setRequisitions(updated);

    if (actionType === "Approve") {
      toast.success(
        `Requisition "${actionTarget.requisitionNumber}" APPROVED! It is now taggable in Transfer Issue.`
      );
    } else if (actionType === "Reject") {
      toast.error(`Requisition "${actionTarget.requisitionNumber}" REJECTED.`);
    } else if (actionType === "Return") {
      toast.warning(
        `Requisition "${actionTarget.requisitionNumber}" returned for correction.`
      );
    }

    setActionTarget(null);
    setActionType(null);
    setActionComment("");
  };

  const reportData: StandardReportData = useMemo(() => {
    if (!reportTarget) {
      return {
        reportType: "transfer-requisition",
        title: "STOCK TRANSFER REQUISITION DOSSIER",
        documentNumber: "TR-APPROVAL",
        documentNo: "TR-APPROVAL",
        documentDate: new Date().toISOString().slice(0, 10),
        department: "Central Inventory & Materials Supply",
        metadata: [],
        tableHeaders: [],
        tableRows: [],
      };
    }

    return {
      reportType: "transfer-requisition",
      title: "STOCK TRANSFER REQUISITION DOSSIER",
      documentNumber: reportTarget.requisitionNumber,
      documentNo: reportTarget.requisitionNumber,
      documentDate: reportTarget.requisitionDate,
      department: "Central Inventory & Materials Supply",
      status: reportTarget.status,
      metadata: [
        { label: "Requisition No", value: reportTarget.requisitionNumber, highlight: true },
        { label: "Date", value: reportTarget.requisitionDate },
        { label: "Transfer Type", value: reportTarget.transferType, highlight: true },
        { label: "Requisitioning Company", value: reportTarget.requisitioningCompany },
        { label: "Requisitioning Store", value: reportTarget.requisitioningStore },
        { label: "Requested From Company", value: reportTarget.requestedFromCompany, highlight: true },
        { label: "Requested From Store", value: reportTarget.requestedFromStore },
        { label: "Requested By", value: reportTarget.requestedBy },
        { label: "Status", value: reportTarget.status },
      ],
      tableHeaders: ["SL", "Item Description", "Specification", "UOM", "Requested Qty", "Est. Unit Price (৳)", "Est. Total Value (৳)", "Remarks"],
      tableRows: reportTarget.items.map((it, idx) => [
        idx + 1,
        <div key={idx}>
          <div className="font-bold text-slate-900">{it.itemName}</div>
          <div className="text-[10px] text-slate-500 font-mono">{it.itemCode}</div>
        </div>,
        it.specification || "-",
        it.uom,
        it.requiredQty.toLocaleString(),
        `৳ ${it.estimatedUnitPrice.toLocaleString()}`,
        `৳ ${it.totalEstimatedValue.toLocaleString()}`,
        it.remarks || "-",
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTarget.items.length) },
        { label: "Total Requested Qty", value: `${reportTarget.totalRequiredQty.toLocaleString()} units` },
        { label: "Total Est. Value", value: `৳ ${reportTarget.totalEstimatedValue.toLocaleString()}`, isBold: true, isHighlight: true },
      ],
      signatures: [
        { role: "Requisitioner", name: reportTarget.requestedBy, designation: "Store Officer" },
        { role: "Store In-charge", name: "Md. Anik Islam", designation: "Asst. Manager" },
        { role: "Authorized Approver", name: reportTarget.approvedBy || "Operations Desk", designation: "Head of Operations" },
      ],
    };
  }, [reportTarget]);

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans text-slate-900 overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Stock Transfers / Approvals
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Approval Desk
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Transfer Requisition Approval Desk
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/inv-transfer-requisition-list"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <span>Requisition Register</span>
              </Link>

              <Link
                to="/inv-intercompany-transfer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <span>Go to Transfer Issue</span>
              </Link>
            </div>
          </div>

          {/* Active Approving Entity Selector */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <strong className="font-bold text-indigo-950 block text-sm">
                  Inter-Company Approval Authority Scope
                </strong>
                <p className="text-indigo-800 text-[11.5px] mt-0.5">
                  Requisitions appear in this desk when goods are requested from your company. Select your company entity below:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-indigo-900">Requested From:</span>
              <select
                value={activeCompany}
                onChange={(e) => setActiveCompany(e.target.value)}
                className="h-9 px-3 rounded-xl border border-indigo-300 bg-white text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="All">All Companies (Full Group View)</option>
                {MASTER_COMPANIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "pending"
                  ? "border-amber-600 text-amber-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Pending Approval ({requisitions.filter((r) => r.status === "Approval Pending").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("approved")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "approved"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Approved ({requisitions.filter((r) => r.status === "Approved" || r.status === "Fully Issued").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("returned")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "returned"
                  ? "border-orange-600 text-orange-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Returned for Correction ({requisitions.filter((r) => r.status === "Returned for Correction").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rejected")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "rejected"
                  ? "border-rose-600 text-rose-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Rejected ({requisitions.filter((r) => r.status === "Rejected").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "all"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              All Records ({requisitions.length})
            </button>
          </div>

          {/* Quick Filters */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3 text-xs">
            <div className="flex-1 w-full relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pending requisition by TR #, company, item..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="w-full sm:w-48 shrink-0">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-indigo-500 outline-none"
              >
                <option value="All">All Transfer Types</option>
                <option value="Inter-Company">Inter-Company</option>
                <option value="Intra-Company">Intra-Company</option>
              </select>
            </div>
          </div>

          {/* Approvals Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 font-semibold text-slate-700 text-[11px]">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[120px]">Requisition No</th>
                    <th className="py-2.5 px-3 w-24">Date</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Requisitioning Company</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Source Store (Our Depot)</th>
                    <th className="py-2.5 px-3 w-24 text-center">Items & Qty</th>
                    <th className="py-2.5 px-3 w-28 text-right">Est. Value (৳)</th>
                    <th className="py-2.5 px-3 w-32 text-center">Status</th>
                    <th className="py-2.5 px-3 min-w-[240px] text-center">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No requisitions awaiting approval matching the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((req, idx) => (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => setInspectedReq(req)}
                            className="font-bold text-blue-600 hover:underline cursor-pointer text-left block"
                          >
                            {req.requisitionNumber}
                          </button>
                          <div className="text-[10px] text-slate-400">
                            By {req.requestedBy.split("(")[0]}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{req.requisitionDate}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 truncate max-w-[190px]">
                            {req.requisitioningCompany}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[190px]">
                            {req.requisitioningStore}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-amber-900 truncate max-w-[190px]">
                            {req.requestedFromStore}
                          </div>
                          <div className="text-[10px] text-amber-700 font-medium truncate max-w-[190px]">
                            {req.requestedFromCompany}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-slate-800">{req.totalItems} items</span>
                          <div className="text-[10px] text-slate-500">{req.totalRequiredQty} units</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          ৳ {req.totalEstimatedValue.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              req.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : req.status === "Approval Pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : req.status === "Returned for Correction"
                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                    : req.status === "Rejected"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setInspectedReq(req)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10.5px] transition cursor-pointer"
                              title="Inspect line items"
                            >
                              <Eye className="size-3.5 inline mr-1" />
                              View
                            </button>

                            {req.status === "Approval Pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionTarget(req);
                                    setActionType("Approve");
                                    setActionComment("Approved for warehouse transfer dispatch.");
                                  }}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] transition shadow-2xs cursor-pointer"
                                >
                                  <CheckCircle2 className="size-3 inline mr-1" />
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionTarget(req);
                                    setActionType("Return");
                                    setActionComment("");
                                  }}
                                  className="px-2 py-1 rounded bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-[10.5px] transition cursor-pointer"
                                >
                                  <RotateCcw className="size-3 inline mr-1" />
                                  Return
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionTarget(req);
                                    setActionType("Reject");
                                    setActionComment("");
                                  }}
                                  className="px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-[10.5px] transition cursor-pointer"
                                >
                                  <XCircle className="size-3 inline mr-1" />
                                  Reject
                                </button>
                              </>
                            )}

                            {req.status === "Approved" && (
                              <Link
                                to="/inv-intercompany-transfer"
                                search={{ transferId: undefined }}
                                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10.5px] transition cursor-pointer"
                              >
                                Issue Goods →
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Requisition Inspection Modal */}
      {inspectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <FileCheck2 className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Requisition Details — {inspectedReq.requisitionNumber}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Date: {inspectedReq.requisitionDate} • Status: <span className="font-bold text-slate-800">{inspectedReq.status}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedReq(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Routing Card */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase block">Requisitioning Entity (Recipient)</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{inspectedReq.requisitioningCompany}</div>
                  <div className="text-slate-600">{inspectedReq.requisitioningStore}</div>
                  <div className="text-slate-400 text-[11px] mt-1">Requested by: {inspectedReq.requestedBy}</div>
                </div>

                <div>
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase block">Source Entity (Provider)</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{inspectedReq.requestedFromCompany}</div>
                  <div className="text-slate-600">{inspectedReq.requestedFromStore}</div>
                  {inspectedReq.remarks && (
                    <div className="text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 mt-2 text-[11px]">
                      <strong>Remarks:</strong> {inspectedReq.remarks}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Requested Line Items ({inspectedReq.items.length})</h3>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Item Description</th>
                        <th className="py-2 px-3">Specification</th>
                        <th className="py-2 px-3 text-center">UOM</th>
                        <th className="py-2 px-3 text-right">Required Qty</th>
                        <th className="py-2 px-3 text-right">Unit Rate (৳)</th>
                        <th className="py-2 px-3 text-right">Total (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inspectedReq.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{it.itemName}</div>
                            <div className="text-[10px] text-blue-600 font-mono">{it.itemCode}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">{it.specification || "-"}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-700">{it.uom}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">{it.requiredQty.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">৳ {it.estimatedUnitPrice.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">৳ {it.totalEstimatedValue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {inspectedReq.returnedRemarks && (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900">
                  <strong className="block font-bold">Correction Feedback:</strong>
                  <p className="mt-0.5">{inspectedReq.returnedRemarks}</p>
                </div>
              )}

              {inspectedReq.rejectedRemarks && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                  <strong className="block font-bold">Rejection Reason:</strong>
                  <p className="mt-0.5">{inspectedReq.rejectedRemarks}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setReportTarget(inspectedReq);
                  setPreviewReportOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>Print Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectedReq(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve / Reject / Return Action Modal */}
      {actionTarget && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                actionType === "Approve"
                  ? "bg-emerald-50/70 border-emerald-200"
                  : actionType === "Reject"
                    ? "bg-rose-50/70 border-rose-200"
                    : "bg-orange-50/70 border-orange-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {actionType === "Approve" && <CheckCircle2 className="size-5 text-emerald-600" />}
                {actionType === "Reject" && <XCircle className="size-5 text-rose-600" />}
                {actionType === "Return" && <RotateCcw className="size-5 text-orange-600" />}
                <h2 className="text-base font-bold text-slate-900">
                  {actionType === "Approve"
                    ? "Confirm Requisition Approval"
                    : actionType === "Reject"
                      ? "Reject Transfer Requisition"
                      : "Return Requisition for Correction"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActionTarget(null);
                  setActionType(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                You are performing <strong>{actionType}</strong> on Transfer Requisition{" "}
                <span className="font-mono font-bold text-slate-900">{actionTarget.requisitionNumber}</span> requested by{" "}
                <span className="font-bold text-slate-900">{actionTarget.requisitioningCompany}</span>.
              </p>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700">
                  {actionType === "Approve"
                    ? "Approval Remarks (Optional)"
                    : actionType === "Reject"
                      ? "Reason for Rejection *"
                      : "Correction Instructions *"}
                </label>
                <textarea
                  rows={3}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  placeholder={
                    actionType === "Approve"
                      ? "Add optional comments for fulfillment desk..."
                      : actionType === "Reject"
                        ? "Specify reason for rejecting this transfer requisition..."
                        : "Describe required changes for the requester to correct..."
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs resize-none outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActionTarget(null);
                  setActionType(null);
                }}
                className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteAction}
                className={`px-5 py-1.5 rounded-lg text-white font-bold text-xs transition shadow-xs cursor-pointer ${
                  actionType === "Approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : actionType === "Reject"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {previewReportOpen && reportTarget && (
        <StandardPreviewReportModal
          open={previewReportOpen}
          onOpenChange={setPreviewReportOpen}
          reportData={reportData}
        />
      )}
    </div>
  );
}
