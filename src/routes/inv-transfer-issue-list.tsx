import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  ArrowLeftRight,
  Plus,
  Filter,
  Search,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  Package,
  Layers,
  FileSpreadsheet,
  X,
  Eye,
  Edit,
  Send,
  Ban,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  FileCheck2,
  AlertCircle,
  Tag,
  ArrowRight,
  History,
} from "lucide-react";
import { toast } from "sonner";
import {
  InterCompanyTransfer,
  TransferRequisition,
  getStoredInterCompanyTransfers,
  saveStoredInterCompanyTransfers,
  getStoredTransferRequisitions,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-transfer-issue-list")({
  head: () => ({
    meta: [
      { title: "Transfer Issue Register — Inventory ERP" },
      {
        name: "description",
        content: "Track pending and processed transfer issues against approved transfer requisitions.",
      },
    ],
  }),
  component: TransferIssueListPage,
});

function TransferIssueListPage() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<InterCompanyTransfer[]>(() =>
    getStoredInterCompanyTransfers()
  );
  const [requisitions] = useState<TransferRequisition[]>(() =>
    getStoredTransferRequisitions()
  );

  useEffect(() => {
    saveStoredInterCompanyTransfers(transfers);
  }, [transfers]);

  // Tab filter: Pending Issues, Partial Issue, Processed Transfers, All Records
  const [activeTab, setActiveTab] = useState<"pending" | "partial" | "processed" | "all">("pending");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [fromCompanyFilter, setFromCompanyFilter] = useState("All");

  // Report Modal
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetTransfer, setReportTargetTransfer] = useState<InterCompanyTransfer | null>(null);

  // State for Requisition-wise Transfer Issue History Modal ("D" button)
  const [selectedReqForModal, setSelectedReqForModal] = useState<TransferRequisition | null>(null);
  const [isTransferHistoryModalOpen, setIsTransferHistoryModalOpen] = useState(false);

  // Transfer history matching selected requisition
  const reqMatchingTransfers = useMemo(() => {
    if (!selectedReqForModal) return [];
    return transfers.filter(
      (t) =>
        t.transferRequisitionNumber === selectedReqForModal.requisitionNumber ||
        t.transferRequisitionId === selectedReqForModal.id
    );
  }, [transfers, selectedReqForModal]);

  // Requisitions with Issue Fulfillment statistics
  const requisitionsWithTransferStats = useMemo(() => {
    return requisitions.map((req) => {
      const matching = transfers.filter(
        (t) =>
          t.transferRequisitionNumber === req.requisitionNumber ||
          t.transferRequisitionId === req.id
      );
      const totalIssued = matching.reduce(
        (sum, t) => sum + (Number(t.totalTransferQty) || 0),
        0
      );
      const remainingQty = Math.max(0, req.totalRequiredQty - totalIssued);
      const isPartial = totalIssued > 0 && remainingQty > 0;
      const isFullyIssued = totalIssued >= req.totalRequiredQty && totalIssued > 0;
      const isPending = totalIssued === 0;

      return {
        req,
        matchingTransfers: matching,
        totalIssued,
        remainingQty,
        isPartial,
        isFullyIssued,
        isPending,
      };
    });
  }, [requisitions, transfers]);

  // Filter helper
  const matchesSearchAndCompany = (req: TransferRequisition) => {
    if (fromCompanyFilter !== "All" && req.requestedFromCompany !== fromCompanyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.requisitionNumber.toLowerCase().includes(q) ||
        req.requestedFromCompany.toLowerCase().includes(q) ||
        req.requisitioningCompany.toLowerCase().includes(q) ||
        req.items.some((i) => i.itemName.toLowerCase().includes(q) || i.itemCode.toLowerCase().includes(q))
      );
    }
    return true;
  };

  // Pending Transfer Issues (Eligible approved requisitions with 0 issued)
  const pendingRequisitions = useMemo(() => {
    return requisitionsWithTransferStats.filter((r) => {
      if (r.req.status !== "Approved" && r.req.status !== "Approval Pending") return false;
      if (!r.isPending) return false;
      return matchesSearchAndCompany(r.req);
    });
  }, [requisitionsWithTransferStats, fromCompanyFilter, searchQuery]);

  // Partial Issue Requisitions (Transfers issued, but remaining > 0)
  const partialRequisitions = useMemo(() => {
    return requisitionsWithTransferStats.filter((r) => {
      if (r.req.status !== "Approved" && r.req.status !== "Partially Issued") return false;
      if (!r.isPartial) return false;
      return matchesSearchAndCompany(r.req);
    });
  }, [requisitionsWithTransferStats, fromCompanyFilter, searchQuery]);

  // Processed Transfer Issues
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      if (fromCompanyFilter !== "All" && t.fromCompany !== fromCompanyFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.transferId.toLowerCase().includes(q) ||
          (t.transferRequisitionNumber && t.transferRequisitionNumber.toLowerCase().includes(q)) ||
          t.fromCompany.toLowerCase().includes(q) ||
          t.toCompany.toLowerCase().includes(q) ||
          t.items.some((i) => i.itemName.toLowerCase().includes(q) || i.itemCode.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [transfers, fromCompanyFilter, searchQuery]);

  // Preview Report Data
  const previewReportData: StandardReportData = useMemo(() => {
    if (!reportTargetTransfer) {
      return {
        reportType: "transfer-issue",
        title: "TRANSFER ISSUE CHALLAN DOSSIER",
        documentNumber: "ISSUE-PREVIEW",
        documentNo: "ISSUE-PREVIEW",
        documentDate: new Date().toISOString().slice(0, 10),
        department: "Central Warehouse Dispatch",
        metadata: [],
        tableHeaders: [],
        tableRows: [],
      };
    }

    return {
      reportType: "transfer-issue",
      title: "STOCK TRANSFER ISSUE CHALLAN",
      documentNumber: reportTargetTransfer.transferId,
      documentNo: reportTargetTransfer.transferId,
      documentDate: reportTargetTransfer.transferDate,
      department: "Central Warehouse Dispatch",
      status: reportTargetTransfer.status,
      metadata: [
        { label: "Transfer Issue ID", value: reportTargetTransfer.transferId, highlight: true },
        { label: "Date", value: reportTargetTransfer.transferDate },
        { label: "Transfer Type", value: reportTargetTransfer.transferType, highlight: true },
        { label: "Tagged Requisition", value: reportTargetTransfer.transferRequisitionNumber || "None (Direct Transfer)" },
        { label: "Source Company", value: reportTargetTransfer.fromCompany },
        { label: "Source Store", value: reportTargetTransfer.fromStore },
        { label: "Destination Company", value: reportTargetTransfer.toCompany },
        { label: "Destination Store", value: reportTargetTransfer.toStore },
        { label: "Requested / Issued By", value: reportTargetTransfer.requestedBy },
      ],
      tableHeaders: ["SL", "Item Description", "Specification", "UOM", "Issued Qty", "Unit Price (৳)", "Total Value (৳)", "Remarks"],
      tableRows: reportTargetTransfer.items.map((it, idx) => [
        idx + 1,
        <div key={idx}>
          <div className="font-bold text-slate-900">{it.itemName}</div>
          <div className="text-[10px] text-slate-500 font-mono">{it.itemCode}</div>
        </div>,
        it.specification || "-",
        it.uom,
        it.transferQty.toLocaleString(),
        `৳ ${it.unitPrice.toLocaleString()}`,
        `৳ ${it.totalValue.toLocaleString()}`,
        it.remarks || "-",
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTargetTransfer.items.length) },
        { label: "Total Transfer Qty", value: `${reportTargetTransfer.totalTransferQty.toLocaleString()} units` },
        { label: "Total Value", value: `৳ ${reportTargetTransfer.totalTransferValue.toLocaleString()}`, isBold: true, isHighlight: true },
      ],
      signatures: [
        { role: "Store Dispatcher", name: reportTargetTransfer.requestedBy, designation: "Dispatch Officer" },
        { role: "Quality Checker", name: "Nazmul Huda", designation: "QC Inspector" },
        { role: "Security Gate Out", name: "Security Gate Desk", designation: "Security In-charge" },
      ],
    };
  }, [reportTargetTransfer]);

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
                  Stock Transfers / Transfer Issues
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Transfer Issue List
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Transfer Issue Register
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/inv-intercompany-transfer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>+ New Transfer Issue</span>
              </Link>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "pending"
                  ? "border-amber-600 text-amber-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Pending Transfer Issues</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
                {pendingRequisitions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("partial")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "partial"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Partial Issue</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
                {partialRequisitions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("processed")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "processed"
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Processed Transfer Issues</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-extrabold">
                {filteredTransfers.length}
              </span>
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
              All Records ({pendingRequisitions.length + partialRequisitions.length + filteredTransfers.length})
            </button>
          </div>

          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by TR #, Issue #, Company, or Item..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <select
                  value={fromCompanyFilter}
                  onChange={(e) => setFromCompanyFilter(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-indigo-500 outline-none"
                >
                  <option value="All">All Source Companies</option>
                  {MASTER_COMPANIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION A: Pending / Partial Transfer Issues */}
          {(activeTab === "pending" || activeTab === "partial" || activeTab === "all") && (() => {
            const displayList =
              activeTab === "pending"
                ? pendingRequisitions
                : activeTab === "partial"
                ? partialRequisitions
                : [...pendingRequisitions, ...partialRequisitions];

            const sectionTitle =
              activeTab === "partial"
                ? "Partial Transfer Issues (Requisitions Partially Dispatched)"
                : activeTab === "pending"
                ? "Pending Transfer Issues (Approved Requisitions Awaiting Dispatch)"
                : "Pending & Partial Transfer Issues (Requisitions Awaiting Dispatch)";

            const sectionDesc =
              activeTab === "partial"
                ? "These requisitions have partial quantities issued and remaining quantities awaiting dispatch."
                : "These requisitions have been approved and are ready to be issued from the source store.";

            return (
              <div className="bg-white rounded-2xl border border-amber-200/90 shadow-xs overflow-hidden space-y-0">
                <div className="p-4 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-4 text-amber-600" />
                    <div>
                      <h2 className="text-sm font-bold text-amber-950">
                        {sectionTitle}
                      </h2>
                      <p className="text-[11px] text-amber-800">
                        {sectionDesc}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {displayList.length} {activeTab === "partial" ? "Partial" : "Pending"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-[11px]">
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Requisition No</th>
                        <th className="py-2.5 px-3 w-24">Date</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Source Company & Store</th>
                        <th className="py-2.5 px-3 w-28 text-center">Items & Qty</th>
                        <th className="py-2.5 px-3 text-center font-bold w-14">View</th>
                        <th className="py-2.5 px-3 w-28 text-center">Status</th>
                        <th className="py-2.5 px-3 w-36 text-center">Process Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayList.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-slate-400">
                            <CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-1.5" />
                            No {activeTab === "partial" ? "partially issued" : "pending"} transfer issues found.
                          </td>
                        </tr>
                      ) : (
                        displayList.map((item, idx) => (
                          <tr key={item.req.id} className="hover:bg-amber-50/40 transition">
                            <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono font-bold text-indigo-600 block">
                                {item.req.requisitionNumber}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                By {item.req.requestedBy.split("(")[0]}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-600">{item.req.requisitionDate}</td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900">{item.req.requestedFromStore}</div>
                              <div className="text-[10px] text-slate-500">{item.req.requestedFromCompany}</div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="font-bold text-slate-800">{item.req.totalItems} items</span>
                              <div className="text-[10px] text-slate-500">
                                {item.totalIssued > 0 ? (
                                  <span className="font-medium text-amber-700">
                                    {item.totalIssued} / {item.req.totalRequiredQty} units
                                  </span>
                                ) : (
                                  <span>{item.req.totalRequiredQty} units</span>
                                )}
                              </div>
                            </td>
                            {/* View Column with "D" Button */}
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedReqForModal(item.req);
                                  setIsTransferHistoryModalOpen(true);
                                }}
                                className="size-7 rounded-lg bg-indigo-500/10 hover:bg-indigo-600 text-indigo-600 hover:text-white font-black text-xs transition-all shadow-2xs border border-indigo-500/30 inline-flex items-center justify-center cursor-pointer active:scale-95"
                                title={`View Transfer Issue history for ${item.req.requisitionNumber}`}
                              >
                                D
                              </button>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  item.isPartial
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}
                              >
                                {item.isPartial ? "Partially Issued" : item.req.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <Link
                                to="/inv-intercompany-transfer"
                                search={{
                                  transferId: undefined,
                                  type: "multi",
                                  requisitionId: item.req.id,
                                  requisitionNumber: item.req.requisitionNumber,
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                                title="Process transfer issue for this requisition"
                              >
                                <span>Process Issue</span>
                                <ArrowRight className="size-3" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* SECTION B: Processed Transfer Issues */}
          {(activeTab === "processed" || activeTab === "all") && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
              <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Truck className="size-4 text-indigo-600" />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Processed & Dispatched Transfer Issues
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Historical transfer challans dispatched between sister companies and warehouse stores.
                    </p>
                  </div>
                </div>
                <span className="font-bold text-xs text-slate-500">
                  {filteredTransfers.length} Issues Recorded
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100 font-semibold text-slate-700 text-[11px]">
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3 min-w-[130px]">Transfer ID</th>
                      <th className="py-2.5 px-3 min-w-[140px]">Tagged Requisition</th>
                      <th className="py-2.5 px-3 w-24">Date</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Source Store</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Destination Store</th>
                      <th className="py-2.5 px-3 w-24 text-center">Items & Qty</th>
                      <th className="py-2.5 px-3 w-28 text-right">Total Value (৳)</th>
                      <th className="py-2.5 px-3 w-28 text-center">Status</th>
                      <th className="py-2.5 px-3 w-24 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransfers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-10 text-center text-slate-400">
                          No processed transfer issues recorded.
                        </td>
                      </tr>
                    ) : (
                      filteredTransfers.map((t, idx) => (
                        <tr key={t.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                            {t.transferId}
                          </td>
                          <td className="py-3 px-3">
                            {t.transferRequisitionNumber ? (
                              <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                                <Tag className="size-2.5" />
                                {t.transferRequisitionNumber}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10.5px]">Direct Transfer</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-600">{t.transferDate}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900">{t.fromStore}</div>
                            <div className="text-[10px] text-slate-500">{t.fromCompany}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900">{t.toStore}</div>
                            <div className="text-[10px] text-slate-500">{t.toCompany}</div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-slate-800">{t.totalItems} items</span>
                            <div className="text-[10px] text-slate-500">{t.totalTransferQty} units</div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                            ৳ {t.totalTransferValue.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                t.status === "Received"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : t.status === "Dispatched"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : t.status === "Submitted"
                                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                      : "bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Link
                                to="/inv-intercompany-transfer"
                                search={{ transferId: t.id, mode: "view" }}
                                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                                title="View Issue Details"
                              >
                                <Eye className="size-3.5" />
                              </Link>

                              <button
                                type="button"
                                onClick={() => {
                                  setReportTargetTransfer(t);
                                  setPreviewReportOpen(true);
                                }}
                                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                                title="Print Challan"
                              >
                                <Printer className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transfer Issue History Modal (Triggered by "D" button in View Column) */}
          {isTransferHistoryModalOpen && selectedReqForModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                      <History className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Transfer Issue History
                      </h3>
                      <p className="text-xs text-slate-500">
                        Requisition No:{" "}
                        <span className="font-mono font-bold text-indigo-600">
                          {selectedReqForModal.requisitionNumber}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTransferHistoryModalOpen(false);
                      setSelectedReqForModal(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Transfer Issues Table */}
                {reqMatchingTransfers.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                          <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                          <th className="py-2.5 px-4 font-bold">Transfer Issue ID</th>
                          <th className="py-2.5 px-4 font-bold">Issue Date</th>
                          <th className="py-2.5 px-3 text-center font-bold w-20">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reqMatchingTransfers.map((t, rIdx) => (
                          <tr key={t.id || rIdx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 text-center text-slate-400 font-bold">
                              {rIdx + 1}
                            </td>
                            <td className="py-2.5 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsTransferHistoryModalOpen(false);
                                  navigate({
                                    to: "/inv-intercompany-transfer",
                                    search: {
                                      transferId: t.id,
                                      mode: "edit",
                                    },
                                  });
                                }}
                                className="font-mono font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                                title={`Open ${t.transferId} in Edit Mode`}
                              >
                                <span>{t.transferId}</span>
                                <ArrowRight className="size-3" />
                              </button>
                            </td>
                            <td className="py-2.5 px-4 text-slate-600 font-medium font-mono">
                              {t.transferDate}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsTransferHistoryModalOpen(false);
                                  navigate({
                                    to: "/inv-intercompany-transfer",
                                    search: {
                                      transferId: t.id,
                                      mode: "view",
                                    },
                                  });
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                                title="View Transfer Issue (Read-Only Mode)"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <ArrowLeftRight className="size-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-600">
                      No Transfer Issue transactions found
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      No transfer issues have been processed yet for Requisition{" "}
                      {selectedReqForModal.requisitionNumber}.
                    </p>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTransferHistoryModalOpen(false);
                      setSelectedReqForModal(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {previewReportOpen && reportTargetTransfer && (
        <StandardPreviewReportModal
          open={previewReportOpen}
          onOpenChange={setPreviewReportOpen}
          reportData={previewReportData}
        />
      )}
    </div>
  );
}
