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
} from "lucide-react";
import { toast } from "sonner";
import {
  InterCompanyTransfer,
  getStoredInterCompanyTransfers,
  saveStoredInterCompanyTransfers,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import { DEFAULT_WAREHOUSES, getStoredData } from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-intercompany-transfer-list")({
  head: () => ({
    meta: [
      { title: "Inter-Company Stock Transfer List — Inventory ERP" },
      {
        name: "description",
        content: "Track inter-company stock transfers between group organizations and warehouses.",
      },
    ],
  }),
  component: InterCompanyTransferListPage,
});

function InterCompanyTransferListPage() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<InterCompanyTransfer[]>(() =>
    getStoredInterCompanyTransfers()
  );

  useEffect(() => {
    saveStoredInterCompanyTransfers(transfers);
  }, [transfers]);

  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [transferIdFilter, setTransferIdFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromCompanyFilter, setFromCompanyFilter] = useState("All");
  const [fromStoreFilter, setFromStoreFilter] = useState("All");
  const [toCompanyFilter, setToCompanyFilter] = useState("All");
  const [toStoreFilter, setToStoreFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Status Tab
  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "dispatched">("all");

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetTransfer, setReportTargetTransfer] = useState<InterCompanyTransfer | null>(null);

  // Filter Logic
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      // Tab filter
      if (activeTab === "active" && (t.status === "Cancelled" || t.status === "Received")) return false;
      if (activeTab === "draft" && t.status !== "Draft") return false;
      if (activeTab === "dispatched" && t.status !== "Dispatched") return false;

      // Status dropdown
      if (statusFilter !== "All" && t.status !== statusFilter) return false;

      // Transfer ID filter
      if (transferIdFilter.trim() && !t.transferId.toLowerCase().includes(transferIdFilter.toLowerCase()))
        return false;

      // Company filters
      if (fromCompanyFilter !== "All" && t.fromCompany !== fromCompanyFilter) return false;
      if (toCompanyFilter !== "All" && t.toCompany !== toCompanyFilter) return false;

      // Store filters
      if (fromStoreFilter !== "All" && t.fromStore !== fromStoreFilter) return false;
      if (toStoreFilter !== "All" && t.toStore !== toStoreFilter) return false;

      // Date range
      if (fromDate && t.transferDate < fromDate) return false;
      if (toDate && t.transferDate > toDate) return false;

      // Quick Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.transferId.toLowerCase().includes(q) ||
          t.fromCompany.toLowerCase().includes(q) ||
          t.toCompany.toLowerCase().includes(q) ||
          t.fromStore.toLowerCase().includes(q) ||
          t.toStore.toLowerCase().includes(q) ||
          t.requestedBy.toLowerCase().includes(q) ||
          t.items.some((i) => i.itemName.toLowerCase().includes(q) || i.itemCode.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [
    transfers,
    activeTab,
    statusFilter,
    transferIdFilter,
    fromCompanyFilter,
    toCompanyFilter,
    fromStoreFilter,
    toStoreFilter,
    fromDate,
    toDate,
    searchQuery,
  ]);

  // Status Actions
  const handleDispatch = (id: string) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "Dispatched",
              dispatchedBy: "Tahmid Afsar Shapno (Dispatched)",
              dispatchDate: new Date().toISOString().slice(0, 10),
            }
          : t
      )
    );
    toast.success("Transfer marked as Dispatched! In-transit inventory recorded.");
  };

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this transfer?")) {
      setTransfers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "Cancelled" } : t))
      );
      toast.info("Transfer cancelled.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Submitted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Approved":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Dispatched":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Received":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Preview Report Data
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!reportTargetTransfer) return null;
    return {
      companyName: reportTargetTransfer.fromCompany,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "INTER-COMPANY STOCK TRANSFER CHALLAN",
      reportNumber: reportTargetTransfer.transferId,
      reportDate: reportTargetTransfer.transferDate,
      statusBadge: reportTargetTransfer.status,
      metaFields: [
        { label: "Transfer ID", value: reportTargetTransfer.transferId },
        { label: "Transfer Date", value: reportTargetTransfer.transferDate },
        { label: "From Company", value: reportTargetTransfer.fromCompany },
        { label: "From Warehouse Store", value: reportTargetTransfer.fromStore },
        { label: "To Destination Company", value: reportTargetTransfer.toCompany },
        { label: "To Destination Store", value: reportTargetTransfer.toStore },
        { label: "Transfer Reason", value: reportTargetTransfer.transferReason },
        { label: "Requested / Dispatched By", value: reportTargetTransfer.requestedBy },
      ],
      tableHeaders: ["SL", "ITEM CODE", "ITEM DESCRIPTION", "UOM", "TRANSFER QTY", "UNIT PRICE (৳)", "TOTAL (৳)"],
      tableRows: reportTargetTransfer.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.transferQty),
        String(it.unitPrice),
        String(it.totalValue.toLocaleString()),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTargetTransfer.totalItems) },
        { label: "Total Transfer Qty", value: `${reportTargetTransfer.totalTransferQty} units` },
        { label: "Total Transfer Value", value: `৳ ${reportTargetTransfer.totalTransferValue.toLocaleString()}` },
      ],
      notes: [
        `Inter-company stock transfer issued from ${reportTargetTransfer.fromStore}.`,
        "Materials in transit must be inspected at destination warehouse upon gate arrival.",
      ],
      signatures: [
        { title: "Dispatched By", name: reportTargetTransfer.requestedBy, date: reportTargetTransfer.transferDate },
        { title: "Vehicle Driver / Carrier", name: "Commercial Transport", date: reportTargetTransfer.transferDate },
        { title: "Authorized In-Charge", name: "Store Operations Manager", date: reportTargetTransfer.transferDate },
      ],
    };
  }, [reportTargetTransfer]);

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <ArrowLeftRight className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Inter-Company Stock Transfer
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {filteredTransfers.length} records
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Manage inventory transfers across sister companies and warehouses with batch tracking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/inv-intercompany-transfer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <Plus className="size-4" />
                New Stock Transfer
              </Link>
            </div>
          </div>

          {/* Quick Stats Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "all", label: "All Transfers", count: transfers.length, color: "text-slate-800" },
              { id: "active", label: "In-Progress", count: transfers.filter((t) => t.status !== "Received" && t.status !== "Cancelled").length, color: "text-blue-600" },
              { id: "dispatched", label: "In Transit", count: transfers.filter((t) => t.status === "Dispatched").length, color: "text-purple-600" },
              { id: "draft", label: "Drafts", count: transfers.filter((t) => t.status === "Draft").length, color: "text-amber-600" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/20"
                    : "bg-white/60 border-slate-200/80 hover:bg-white"
                }`}
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{tab.label}</div>
                <div className={`text-xl font-black mt-1 ${tab.color}`}>{tab.count}</div>
              </button>
            ))}
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Filter className="size-4 text-slate-400" />
                <span>Search & Filter Transfer Records</span>
              </div>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                {isFiltersOpen ? "Collapse" : "Expand"}
                <ChevronDown className={`size-3.5 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {isFiltersOpen && (
              <div className="p-4 space-y-3 bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Transfer ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ICT-2026-001"
                      value={transferIdFilter}
                      onChange={(e) => setTransferIdFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      From Company
                    </label>
                    <select
                      value={fromCompanyFilter}
                      onChange={(e) => setFromCompanyFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="All">All Source Companies</option>
                      {MASTER_COMPANIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      To Destination Company
                    </label>
                    <select
                      value={toCompanyFilter}
                      onChange={(e) => setToCompanyFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="All">All Destination Companies</option>
                      {MASTER_COMPANIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Received">Received</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Search By Keyword
                    </label>
                    <div className="relative">
                      <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search item, person, or transfer ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transfers Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-3 text-center w-10">SL</th>
                    <th className="py-3 px-3">Transfer ID</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">From Company & Store</th>
                    <th className="py-3 px-3">To Company & Store</th>
                    <th className="py-3 px-3 text-center">Items</th>
                    <th className="py-3 px-3 text-right">Transfer Qty</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3">Created By</th>
                    <th className="py-3 px-3 text-center sticky right-0 bg-slate-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        <ArrowLeftRight className="size-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No stock transfers match your criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTransfers.map((t, idx) => (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors whitespace-nowrap">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-bold font-mono text-indigo-600">
                          {t.transferId}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                          {t.transferDate}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 line-clamp-1">{t.fromCompany}</div>
                          <div className="text-[10.5px] text-slate-400">{t.fromStore}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 line-clamp-1">{t.toCompany}</div>
                          <div className="text-[10.5px] text-indigo-500 font-medium">{t.toStore}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          {t.totalItems}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {t.totalTransferQty.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              t.status
                            )}`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-[11px]">
                          {t.requestedBy}
                        </td>
                        <td className="py-3 px-3 text-center sticky right-0 bg-white hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.04)]">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              title="View Transfer"
                              onClick={() =>
                                navigate({
                                  to: "/inv-intercompany-transfer",
                                  search: { transferId: t.id, mode: "view" },
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <Eye className="size-3.5" />
                            </button>

                            {t.status === "Draft" && (
                              <button
                                title="Edit Draft"
                                onClick={() =>
                                  navigate({
                                    to: "/inv-intercompany-transfer",
                                    search: { transferId: t.id, mode: "edit" },
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              >
                                <Edit className="size-3.5" />
                              </button>
                            )}

                            {(t.status === "Submitted" || t.status === "Approved") && (
                              <button
                                title="Mark as Dispatched"
                                onClick={() => handleDispatch(t.id)}
                                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                              >
                                <Truck className="size-3.5" />
                              </button>
                            )}

                            <button
                              title="Print Challan"
                              onClick={() => {
                                setReportTargetTransfer(t);
                                setPreviewReportOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <Printer className="size-3.5" />
                            </button>

                            {t.status === "Draft" && (
                              <button
                                title="Cancel Transfer"
                                onClick={() => handleCancel(t.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Ban className="size-3.5" />
                              </button>
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
        </div>

        {/* Challan Modal */}
        {previewReportOpen && previewReportData && (
          <StandardPreviewReportModal
            isOpen={previewReportOpen}
            onClose={() => setPreviewReportOpen(false)}
            data={previewReportData}
          />
        )}
      </main>
    </div>
  );
}
