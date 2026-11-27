import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  SlidersHorizontal,
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
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockAdjustment,
  getStoredStockAdjustments,
  saveStoredStockAdjustments,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import { DEFAULT_WAREHOUSES, getStoredData } from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-stock-adjustment-list")({
  head: () => ({
    meta: [
      { title: "Stock Adjustment (+/-) List — Inventory ERP" },
      {
        name: "description",
        content: "Track inventory balance adjustments, cycle counts, physical variance, and write-ups.",
      },
    ],
  }),
  component: StockAdjustmentListPage,
});

function StockAdjustmentListPage() {
  const navigate = useNavigate();
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(() =>
    getStoredStockAdjustments()
  );

  useEffect(() => {
    saveStoredStockAdjustments(adjustments);
  }, [adjustments]);

  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustmentIdFilter, setAdjustmentIdFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [storeFilter, setStoreFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Active Tab Filter
  const [activeTab, setActiveTab] = useState<"all" | "increase" | "decrease" | "posted">("all");

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetAdj, setReportTargetAdj] = useState<StockAdjustment | null>(null);

  // Filtered Records
  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((adj) => {
      // Tab filter
      if (activeTab === "increase" && adj.adjustmentType !== "Increase (+)") return false;
      if (activeTab === "decrease" && adj.adjustmentType !== "Decrease (-)") return false;
      if (activeTab === "posted" && adj.status !== "Posted") return false;

      // Status dropdown
      if (statusFilter !== "All" && adj.status !== statusFilter) return false;

      // Type dropdown
      if (typeFilter !== "All" && adj.adjustmentType !== typeFilter) return false;

      // Company filter
      if (companyFilter !== "All" && adj.company !== companyFilter) return false;

      // Store filter
      if (storeFilter !== "All" && adj.warehouseStore !== storeFilter) return false;

      // ID filter
      if (adjustmentIdFilter.trim() && !adj.adjustmentId.toLowerCase().includes(adjustmentIdFilter.toLowerCase()))
        return false;

      // Date range
      if (fromDate && adj.adjustmentDate < fromDate) return false;
      if (toDate && adj.adjustmentDate > toDate) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          adj.adjustmentId.toLowerCase().includes(q) ||
          adj.company.toLowerCase().includes(q) ||
          adj.warehouseStore.toLowerCase().includes(q) ||
          adj.adjustmentReason.toLowerCase().includes(q) ||
          adj.createdBy.toLowerCase().includes(q) ||
          adj.items.some((it) => it.itemName.toLowerCase().includes(q) || it.itemCode.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [
    adjustments,
    activeTab,
    statusFilter,
    typeFilter,
    companyFilter,
    storeFilter,
    adjustmentIdFilter,
    fromDate,
    toDate,
    searchQuery,
  ]);

  const handlePostAdjustment = (id: string) => {
    setAdjustments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "Posted",
              postedDate: new Date().toISOString().slice(0, 10),
            }
          : a
      )
    );
    toast.success("Adjustment posted! Store stock ledger updated successfully.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Submitted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Approved":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Posted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Preview Note Data
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!reportTargetAdj) return null;
    return {
      companyName: reportTargetAdj.company,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "STOCK ADJUSTMENT JOURNAL VOUCHER",
      reportNumber: reportTargetAdj.adjustmentId,
      reportDate: reportTargetAdj.adjustmentDate,
      statusBadge: reportTargetAdj.status,
      metaFields: [
        { label: "Adjustment ID", value: reportTargetAdj.adjustmentId },
        { label: "Date", value: reportTargetAdj.adjustmentDate },
        { label: "Company", value: reportTargetAdj.company },
        { label: "Store / Warehouse", value: reportTargetAdj.warehouseStore },
        { label: "Adjustment Type", value: reportTargetAdj.adjustmentType },
        { label: "Reason Category", value: reportTargetAdj.adjustmentReason },
        { label: "Initiated By", value: reportTargetAdj.createdBy },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "DESCRIPTION",
        "UOM",
        "CURR STOCK",
        "ADJ QTY",
        "NEW STOCK",
        "UNIT COST (৳)",
        "VALUATION IMPACT (৳)",
      ],
      tableRows: reportTargetAdj.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.currentStock),
        `${it.adjustmentQty > 0 ? "+" : ""}${it.adjustmentQty}`,
        String(it.newStock),
        String(it.unitCost),
        String(it.adjustmentValue.toLocaleString()),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTargetAdj.totalItems) },
        {
          label: "Net Adjusted Qty",
          value: `${reportTargetAdj.totalAdjustmentQty > 0 ? "+" : ""}${reportTargetAdj.totalAdjustmentQty} units`,
        },
        {
          label: "Net Financial Impact",
          value: `৳ ${reportTargetAdj.totalAdjustmentValue.toLocaleString()}`,
        },
      ],
      notes: [
        `Inventory physical stock adjusted against ${reportTargetAdj.adjustmentReason}.`,
        "Audited against physical store bin balance count.",
      ],
      signatures: [
        { title: "Physical Counted By", name: reportTargetAdj.createdBy, date: reportTargetAdj.adjustmentDate },
        { title: "Inventory Controller", name: "Store Manager", date: reportTargetAdj.adjustmentDate },
        { title: "Financial Auditor", name: "Internal Audit Dept", date: reportTargetAdj.adjustmentDate },
      ],
    };
  }, [reportTargetAdj]);

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-600">
                <SlidersHorizontal className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Stock Adjustment (+/-)
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {filteredAdjustments.length} records
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Record physical stock count variances, scrap corrections, and write-ups across store ledgers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/inv-stock-adjustment"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 active:scale-95 transition-all"
              >
                <Plus className="size-4" />
                New Stock Adjustment
              </Link>
            </div>
          </div>

          {/* Quick Stats Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "all", label: "All Adjustments", count: adjustments.length, color: "text-slate-800" },
              {
                id: "increase",
                label: "Stock Increases (+)",
                count: adjustments.filter((a) => a.adjustmentType === "Increase (+)").length,
                color: "text-emerald-600",
              },
              {
                id: "decrease",
                label: "Stock Decreases (-)",
                count: adjustments.filter((a) => a.adjustmentType === "Decrease (-)").length,
                color: "text-rose-600",
              },
              {
                id: "posted",
                label: "Posted Ledger",
                count: adjustments.filter((a) => a.status === "Posted").length,
                color: "text-teal-600",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-white border-teal-500 shadow-sm ring-1 ring-teal-500/20"
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
                <span>Search & Filter Adjustment Records</span>
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
                      Adjustment ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ADJ-2026-001"
                      value={adjustmentIdFilter}
                      onChange={(e) => setAdjustmentIdFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Company
                    </label>
                    <select
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="All">All Companies</option>
                      {MASTER_COMPANIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Adjustment Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="All">All Types</option>
                      <option value="Increase (+)">Increase (+)</option>
                      <option value="Decrease (-)">Decrease (-)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Posted">Posted</option>
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
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
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
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Search Keyword
                    </label>
                    <div className="relative">
                      <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search item, reason, or created by..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
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
                    <th className="py-3 px-3">Adjustment ID</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Company & Store</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Reason</th>
                    <th className="py-3 px-3 text-center">Items</th>
                    <th className="py-3 px-3 text-right">Net Qty</th>
                    <th className="py-3 px-3 text-right">Net Value (৳)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3">Created By</th>
                    <th className="py-3 px-3 text-center sticky right-0 bg-slate-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredAdjustments.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-slate-400">
                        <SlidersHorizontal className="size-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No stock adjustments match your filter criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAdjustments.map((adj, idx) => (
                      <tr key={adj.id} className="hover:bg-slate-50/70 transition-colors whitespace-nowrap">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-bold font-mono text-teal-700">
                          {adj.adjustmentId}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                          {adj.adjustmentDate}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 line-clamp-1">{adj.company}</div>
                          <div className="text-[10.5px] text-slate-400">{adj.warehouseStore}</div>
                        </td>
                        <td className="py-3 px-3">
                          {adj.adjustmentType === "Increase (+)" ? (
                            <span className="flex items-center gap-1 font-bold text-emerald-600">
                              <TrendingUp className="size-3.5" />
                              Increase (+)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-bold text-rose-600">
                              <TrendingDown className="size-3.5" />
                              Decrease (-)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {adj.adjustmentReason}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          {adj.totalItems}
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-mono font-bold ${
                            adj.totalAdjustmentQty >= 0 ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {adj.totalAdjustmentQty > 0 ? `+${adj.totalAdjustmentQty}` : adj.totalAdjustmentQty}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-800">
                          ৳ {adj.totalAdjustmentValue.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              adj.status
                            )}`}
                          >
                            {adj.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-[11px]">
                          {adj.createdBy}
                        </td>
                        <td className="py-3 px-3 text-center sticky right-0 bg-white hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.04)]">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              title="View Adjustment"
                              onClick={() =>
                                navigate({
                                  to: "/inv-stock-adjustment",
                                  search: { adjustmentId: adj.id, mode: "view" },
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                            >
                              <Eye className="size-3.5" />
                            </button>

                            {adj.status === "Draft" && (
                              <button
                                title="Edit Draft"
                                onClick={() =>
                                  navigate({
                                    to: "/inv-stock-adjustment",
                                    search: { adjustmentId: adj.id, mode: "edit" },
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              >
                                <Edit className="size-3.5" />
                              </button>
                            )}

                            {adj.status === "Submitted" && (
                              <button
                                title="Post to Stock Ledger"
                                onClick={() => handlePostAdjustment(adj.id)}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <CheckCircle2 className="size-3.5" />
                              </button>
                            )}

                            <button
                              title="Print Voucher"
                              onClick={() => {
                                setReportTargetAdj(adj);
                                setPreviewReportOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
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

        {/* Preview Note */}
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
