import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Inbox,
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
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  InterCompanyReceive,
  getStoredInterCompanyReceives,
  saveStoredInterCompanyReceives,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-intercompany-receive-list")({
  head: () => ({
    meta: [
      { title: "Inter-Company Transfer Receive List — Inventory ERP" },
      {
        name: "description",
        content: "Acknowledge and inspect incoming inter-company material consignments.",
      },
    ],
  }),
  component: InterCompanyReceiveListPage,
});

function InterCompanyReceiveListPage() {
  const navigate = useNavigate();
  const [receives, setReceives] = useState<InterCompanyReceive[]>(() =>
    getStoredInterCompanyReceives()
  );

  useEffect(() => {
    saveStoredInterCompanyReceives(receives);
  }, [receives]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [receiveIdFilter, setReceiveIdFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromCompanyFilter, setFromCompanyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Tab Filter
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "partial" | "full">("all");

  // Preview Note State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetReceive, setReportTargetReceive] = useState<InterCompanyReceive | null>(null);

  // State for Transfer Receiving History Modal ("D" button)
  const [selectedTransferForReceives, setSelectedTransferForReceives] = useState<InterCompanyReceive | null>(null);
  const [isReceivingHistoryModalOpen, setIsReceivingHistoryModalOpen] = useState(false);

  // Matching receives for selected transfer
  const transferMatchingReceives = useMemo(() => {
    if (!selectedTransferForReceives) return [];
    return receives.filter(
      (r) =>
        r.transferReferenceId === selectedTransferForReceives.transferReferenceId ||
        r.transferId === selectedTransferForReceives.transferId
    );
  }, [receives, selectedTransferForReceives]);

  // Dedicated View Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsTargetReceive, setDetailsTargetReceive] = useState<InterCompanyReceive | null>(null);

  // Filtered
  const filteredReceives = useMemo(() => {
    return receives.filter((r) => {
      if (activeTab === "pending" && r.status !== "Pending Receive") return false;
      if (activeTab === "partial" && r.status !== "Partially Received") return false;
      if (activeTab === "full" && r.status !== "Fully Received") return false;

      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (fromCompanyFilter !== "All" && r.fromCompany !== fromCompanyFilter) return false;

      if (receiveIdFilter.trim() && !r.receiveId.toLowerCase().includes(receiveIdFilter.toLowerCase()))
        return false;

      if (fromDate && r.receiveDate < fromDate) return false;
      if (toDate && r.receiveDate > toDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          r.receiveId.toLowerCase().includes(q) ||
          r.transferReferenceId.toLowerCase().includes(q) ||
          r.fromCompany.toLowerCase().includes(q) ||
          r.toCompany.toLowerCase().includes(q) ||
          r.receivedBy.toLowerCase().includes(q) ||
          r.items.some((it) => it.itemName.toLowerCase().includes(q) || it.itemCode.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [receives, activeTab, statusFilter, fromCompanyFilter, receiveIdFilter, fromDate, toDate, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Fully Received":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Partially Received":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Pending Receive":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Preview Note Data
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!reportTargetReceive) return null;
    return {
      companyName: reportTargetReceive.toCompany,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "INTER-COMPANY GOODS RECEIPT NOTE (IC-GRN)",
      reportNumber: reportTargetReceive.receiveId,
      reportDate: reportTargetReceive.receiveDate,
      statusBadge: reportTargetReceive.status,
      metaFields: [
        { label: "Receive ID", value: reportTargetReceive.receiveId },
        { label: "Transfer Ref ID", value: reportTargetReceive.transferReferenceId },
        { label: "Transfer Date", value: reportTargetReceive.transferDate },
        { label: "Dispatch Date", value: reportTargetReceive.dispatchDate },
        { label: "From Entity", value: `${reportTargetReceive.fromCompany} (${reportTargetReceive.fromStore})` },
        { label: "To Entity", value: `${reportTargetReceive.toCompany} (${reportTargetReceive.toStore})` },
        { label: "Receiving Officer", value: reportTargetReceive.receivedBy },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "DESCRIPTION",
        "UOM",
        "DISPATCHED",
        "RECEIVED",
        "ACCEPTED",
        "SHORT / DAMAGED",
      ],
      tableRows: reportTargetReceive.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.dispatchedQty),
        String(it.receivedQty),
        String(it.acceptedQty),
        String(it.shortageDamagedQty),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTargetReceive.totalItems) },
        { label: "Total Accepted Qty", value: `${reportTargetReceive.totalAcceptedQty} units` },
        { label: "Total Discrepancy", value: `${reportTargetReceive.totalVarianceQty} units` },
      ],
      notes: [
        `Accepted items added to destination stock at ${reportTargetReceive.toStore}.`,
        "Quality check and gate verification report attached.",
      ],
      signatures: [
        { title: "Store Receiving Officer", name: reportTargetReceive.receivedBy, date: reportTargetReceive.receiveDate },
        { title: "Quality Assurance Inspector", name: "QA Officer", date: reportTargetReceive.receiveDate },
        { title: "Warehouse Manager", name: "Store Manager", date: reportTargetReceive.receiveDate },
      ],
    };
  }, [reportTargetReceive]);

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Inbox className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Inter-Company Transfer Receive
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {filteredReceives.length} records
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Inspect incoming transfer consignments, accept verified items, and update destination stock
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/inv-intercompany-receive"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Plus className="size-4" />
                Receive Consignment
              </Link>
            </div>
          </div>

          {/* Quick Stats Tabs (Order: 1. Pending Receive, 2. Partially Received, 3. Fully Received) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "pending",
                label: "Pending Receive",
                count: receives.filter((r) => r.status === "Pending Receive").length,
                color: "text-blue-600",
              },
              {
                id: "partial",
                label: "Partially Received",
                count: receives.filter((r) => r.status === "Partially Received").length,
                color: "text-amber-600",
              },
              {
                id: "full",
                label: "Fully Received",
                count: receives.filter((r) => r.status === "Fully Received").length,
                color: "text-emerald-600",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(activeTab === tab.id ? "all" : (tab.id as any))}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                    : "bg-white/60 border-slate-200/80 hover:bg-white"
                }`}
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{tab.label}</div>
                <div className={`text-xl font-black mt-1 ${tab.color}`}>{tab.count}</div>
              </button>
            ))}
          </div>

          {/* Filter Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Filter className="size-4 text-slate-400" />
                <span>Search & Filter Transfer Receives</span>
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
                      Receive ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ICTR-2026-001"
                      value={receiveIdFilter}
                      onChange={(e) => setReceiveIdFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      From Company
                    </label>
                    <select
                      value={fromCompanyFilter}
                      onChange={(e) => setFromCompanyFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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
                      From Date
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
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
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Search Keyword
                    </label>
                    <div className="relative">
                      <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search transfer ref, entity, receiving officer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-3 text-center w-10">SL</th>
                    <th className="py-3 px-3">Receive ID</th>
                    <th className="py-3 px-3">Receive Date</th>
                    <th className="py-3 px-3">Transfer Ref</th>
                    <th className="py-3 px-3">From Company & Store</th>
                    <th className="py-3 px-3 text-right">Dispatched</th>
                    <th className="py-3 px-3 text-right">Received</th>
                    <th className="py-3 px-3 text-right text-emerald-700">Accepted</th>
                    <th className="py-3 px-3 text-right text-rose-600">Short/Damage</th>
                    <th className="py-3 px-3 text-center font-bold w-14">View</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center sticky right-0 bg-slate-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredReceives.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-slate-400">
                        <Inbox className="size-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No transfer receives recorded</p>
                      </td>
                    </tr>
                  ) : (
                    filteredReceives.map((r, idx) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors whitespace-nowrap">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-bold font-mono text-emerald-700">
                          {r.receiveId}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                          {r.receiveDate}
                        </td>
                        <td className="py-3 px-3 font-bold font-mono text-indigo-600">
                          {r.transferReferenceId}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 line-clamp-1">{r.fromCompany}</div>
                          <div className="text-[10.5px] text-slate-400">{r.fromStore}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {r.totalDispatchedQty.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-800">
                          {r.totalReceivedQty.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                          {r.totalAcceptedQty.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                          {r.totalVarianceQty.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedTransferForReceives(r);
                              setIsReceivingHistoryModalOpen(true);
                            }}
                            className="size-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 hover:text-white font-black text-xs transition-all shadow-2xs border border-emerald-500/30 inline-flex items-center justify-center cursor-pointer active:scale-95"
                            title={`View Transfer Receiving history for ${r.transferReferenceId}`}
                          >
                            D
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              r.status
                            )}`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center sticky right-0 bg-white hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.04)]">
                          <div className="flex items-center justify-center gap-1.5">
                            {r.status === "Pending Receive" && (
                              <button
                                title="Receive Transfer Consignment"
                                onClick={() =>
                                  navigate({
                                    to: "/inv-intercompany-receive",
                                    search: { transferId: r.transferReferenceId },
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer shrink-0"
                              >
                                Receive
                              </button>
                            )}

                            <button
                              title="Print IC-GRN"
                              onClick={() => {
                                setReportTargetReceive(r);
                                setPreviewReportOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
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
        </div>

        {/* Dedicated Transfer Receive View Details Modal */}
        {detailsModalOpen && detailsTargetReceive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Inbox className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-800">Transfer Receive Details</h2>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {detailsTargetReceive.receiveId}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(detailsTargetReceive.status)}`}>
                        {detailsTargetReceive.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Review transfer dispatch, receipt breakdown, and item tracking</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDetailsModalOpen(false);
                    setDetailsTargetReceive(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                {/* Header Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Transfer Reference</div>
                    <div className="font-mono font-bold text-indigo-600 text-sm mt-0.5">{detailsTargetReceive.transferReferenceId}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Receive Date</div>
                    <div className="font-semibold text-slate-800 mt-0.5">{detailsTargetReceive.receiveDate}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Source (From)</div>
                    <div className="font-semibold text-slate-800 mt-0.5">{detailsTargetReceive.fromCompany}</div>
                    <div className="text-[10.5px] text-slate-400">{detailsTargetReceive.fromStore}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Destination (To)</div>
                    <div className="font-semibold text-slate-800 mt-0.5">{detailsTargetReceive.toCompany}</div>
                    <div className="text-[10.5px] text-emerald-600">{detailsTargetReceive.toStore}</div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-10">SL</th>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-2 text-center w-14">UOM</th>
                        <th className="py-2.5 px-3 text-right">Dispatched</th>
                        <th className="py-2.5 px-3 text-right">Received</th>
                        <th className="py-2.5 px-3 text-right text-emerald-700 font-bold">Accepted</th>
                        <th className="py-2.5 px-3 text-right text-rose-600 font-bold">Rejected / Short</th>
                        <th className="py-2.5 px-3 text-center">Batch / Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detailsTargetReceive.items.map((it, idx) => (
                        <tr key={it.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-800">{it.itemName}</div>
                            <div className="font-mono text-[10px] text-indigo-600">{it.itemCode}</div>
                            {it.specification && <div className="text-[10px] text-slate-400 font-normal">{it.specification}</div>}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-600">{it.uom}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">{it.dispatchedQty.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-800">{it.receivedQty.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{it.acceptedQty.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">{it.shortageDamagedQty.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-[10px] text-slate-500">
                            {it.batchAllocations && it.batchAllocations.length > 0 ? (
                              <span className="font-semibold text-indigo-600">Batch: {it.batchAllocations.map(b => `${b.batchNumber} (${b.quantity})`).join(", ")}</span>
                            ) : it.locationAllocations && it.locationAllocations.length > 0 ? (
                              <span className="font-semibold text-emerald-600">Loc: {it.locationAllocations.map(l => `${l.locationName} (${l.quantity})`).join(", ")}</span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Row */}
                <div className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500">Receiving Officer: </span>
                    <span className="font-semibold text-slate-800">{detailsTargetReceive.receivedBy}</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div>
                      <span className="text-slate-500">Total Items: </span>
                      <span className="font-mono font-bold text-slate-900">{detailsTargetReceive.totalItems}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Accepted Qty: </span>
                      <span className="font-mono font-bold text-emerald-700">{detailsTargetReceive.totalAcceptedQty.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Discrepancy: </span>
                      <span className="font-mono font-bold text-rose-600">{detailsTargetReceive.totalVarianceQty.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Receiving History Modal ("D" button) */}
        {isReceivingHistoryModalOpen && selectedTransferForReceives && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <History className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">
                      Transfer Receiving History
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 font-medium">Transfer Ref No:</span>
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {selectedTransferForReceives.transferReferenceId || selectedTransferForReceives.transferId}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReceivingHistoryModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">SL</th>
                      <th className="py-2.5 px-3 font-bold">TR Receive ID</th>
                      <th className="py-2.5 px-3">TR Receive Date</th>
                      <th className="py-2.5 px-3 text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transferMatchingReceives.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          No receiving records found for this transfer reference.
                        </td>
                      </tr>
                    ) : (
                      transferMatchingReceives.map((rec, idx) => (
                        <tr key={rec.id} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 text-center font-mono text-[10px] text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              type="button"
                              onClick={() => {
                                setIsReceivingHistoryModalOpen(false);
                                navigate({
                                  to: "/inv-intercompany-receive",
                                  search: {
                                    receiveId: rec.receiveId,
                                    transferId: rec.transferReferenceId || rec.transferId,
                                    mode: "edit",
                                  },
                                });
                              }}
                              className="font-mono font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer text-left"
                              title="Click to open in Edit Mode"
                            >
                              {rec.receiveId}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {rec.receiveDate}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setIsReceivingHistoryModalOpen(false);
                                navigate({
                                  to: "/inv-intercompany-receive",
                                  search: {
                                    receiveId: rec.receiveId,
                                    transferId: rec.transferReferenceId || rec.transferId,
                                    mode: "view",
                                  },
                                });
                              }}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Report Preview Modal */}
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
