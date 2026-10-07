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

export const Route = createFileRoute("/inv-transfer-requisition-list")({
  head: () => ({
    meta: [
      { title: "Transfer Requisition Register — Inventory ERP" },
      {
        name: "description",
        content: "Track inter-company and intra-company transfer requisitions with status workflows.",
      },
    ],
  }),
  component: TransferRequisitionListPage,
});

function TransferRequisitionListPage() {
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState<TransferRequisition[]>(() =>
    getStoredTransferRequisitions()
  );

  useEffect(() => {
    saveStoredTransferRequisitions(requisitions);
  }, [requisitions]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [reqCompanyFilter, setReqCompanyFilter] = useState("All");
  const [requestedFromCompanyFilter, setRequestedFromCompanyFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "draft">("all");

  // Report Modal
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<TransferRequisition | null>(null);

  // Filter Logic
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((r) => {
      // Tab filter
      if (activeTab === "pending" && r.status !== "Approval Pending") return false;
      if (activeTab === "approved" && r.status !== "Approved" && r.status !== "Fully Issued") return false;
      if (activeTab === "draft" && r.status !== "Draft") return false;

      // Status dropdown
      if (statusFilter !== "All" && r.status !== statusFilter) return false;

      // Type filter
      if (typeFilter !== "All" && r.transferType !== typeFilter) return false;

      // Company filters
      if (reqCompanyFilter !== "All" && r.requisitioningCompany !== reqCompanyFilter) return false;
      if (requestedFromCompanyFilter !== "All" && r.requestedFromCompany !== requestedFromCompanyFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.requisitionNumber.toLowerCase().includes(q) ||
          r.requisitioningCompany.toLowerCase().includes(q) ||
          r.requisitioningStore.toLowerCase().includes(q) ||
          r.requestedFromCompany.toLowerCase().includes(q) ||
          r.requestedFromStore.toLowerCase().includes(q) ||
          r.requestedBy.toLowerCase().includes(q) ||
          r.items.some((i) => i.itemName.toLowerCase().includes(q) || i.itemCode.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [requisitions, activeTab, statusFilter, typeFilter, reqCompanyFilter, requestedFromCompanyFilter, searchQuery]);

  const reportData: StandardReportData = useMemo(() => {
    if (!reportTarget) {
      return {
        reportType: "transfer-requisition",
        title: "STOCK TRANSFER REQUISITION DOSSIER",
        documentNumber: "TR-PREVIEW",
        documentNo: "TR-PREVIEW",
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
                  Stock Transfers / Requisitions
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Requisition Register
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Transfer Requisition Register
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/inv-transfer-requisition-approval"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
              >
                <FileCheck2 className="size-3.5" />
                <span>Approval Desk</span>
              </Link>

              <Link
                to="/inv-transfer-requisition"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>New Transfer Requisition</span>
              </Link>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "all"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              All Requisitions ({requisitions.length})
            </button>
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
              onClick={() => setActiveTab("draft")}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "draft"
                  ? "border-slate-800 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Drafts ({requisitions.filter((r) => r.status === "Draft").length})
            </button>
          </div>

          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by TR #, Company, Store, Item..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none"
                >
                  <option value="All">All Transfer Types</option>
                  <option value="Inter-Company">Inter-Company</option>
                  <option value="Intra-Company">Intra-Company</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approval Pending">Approval Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Returned for Correction">Returned for Correction</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Fully Issued">Fully Issued</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div>
                <select
                  value={reqCompanyFilter}
                  onChange={(e) => setReqCompanyFilter(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none"
                >
                  <option value="All">All Requester Companies</option>
                  {MASTER_COMPANIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 font-semibold text-slate-700 text-[11px]">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[120px]">Requisition No</th>
                    <th className="py-2.5 px-3 w-24">Date</th>
                    <th className="py-2.5 px-3 w-28">Type</th>
                    <th className="py-2.5 px-3 min-w-[220px]">Requisitioning Store</th>
                    <th className="py-2.5 px-3 min-w-[220px]">Requested From (Source)</th>
                    <th className="py-2.5 px-3 w-24 text-center">Items & Qty</th>
                    <th className="py-2.5 px-3 w-28 text-right">Est. Value (৳)</th>
                    <th className="py-2.5 px-3 w-32 text-center">Status</th>
                    <th className="py-2.5 px-3 w-28 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequisitions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        No transfer requisitions match the current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequisitions.map((req, idx) => (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <Link
                            to="/inv-transfer-requisition"
                            search={{ id: req.id, mode: "view" }}
                            className="font-bold text-blue-600 hover:underline"
                          >
                            {req.requisitionNumber}
                          </Link>
                          <div className="text-[10px] text-slate-400">By {req.requestedBy.split("(")[0]}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{req.requisitionDate}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              req.transferType === "Inter-Company"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {req.transferType}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 truncate max-w-[210px]">{req.requisitioningStore}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[210px]">{req.requisitioningCompany}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-amber-900 truncate max-w-[210px]">{req.requestedFromStore}</div>
                          <div className="text-[10px] text-amber-700 font-medium truncate max-w-[210px]">{req.requestedFromCompany}</div>
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
                                      : req.status === "Fully Issued"
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                        : "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link
                              to="/inv-transfer-requisition"
                              search={{ id: req.id, mode: "view" }}
                              className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
                              title="View Requisition"
                            >
                              <Eye className="size-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                setReportTarget(req);
                                setPreviewReportOpen(true);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                              title="Print Dossier"
                            >
                              <Printer className="size-3.5" />
                            </button>

                            {req.status === "Approved" && (
                              <Link
                                to="/inv-intercompany-transfer"
                                search={{ transferId: undefined }}
                                className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition cursor-pointer"
                                title="Issue requested goods via Transfer Issue"
                              >
                                Issue Goods
                              </Link>
                            )}

                            {req.status === "Approval Pending" && (
                              <Link
                                to="/inv-transfer-requisition-approval"
                                className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] transition cursor-pointer"
                                title="Review in Approval Desk"
                              >
                                Review
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
