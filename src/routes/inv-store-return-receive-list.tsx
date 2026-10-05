import { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  RotateCcw,
  Search,
  Filter,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  User,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  Package,
  X,
  FileSpreadsheet,
} from "lucide-react";
import {
  StoreReturn,
  getStoredStoreReturns,
} from "@/lib/inventory-requisition-issue-data";
import { DEFAULT_WAREHOUSES, getStoredData } from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-store-return-receive-list")({
  head: () => ({
    meta: [
      { title: "Store Return Receive List — Inventory ERP" },
      {
        name: "description",
        content: "Store receive queue for materials returned through the Return to Store process.",
      },
    ],
  }),
  component: StoreReturnReceiveListPage,
});

function StoreReturnReceiveListPage() {
  const navigate = useNavigate();

  const [returns] = useState<StoreReturn[]>(() => getStoredStoreReturns());
  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  // Tabs: "pending" vs "all"
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [returnIdFilter, setReturnIdFilter] = useState("");
  const [issueIdFilter, setIssueIdFilter] = useState("");
  const [mrIdFilter, setMrIdFilter] = useState("");
  const [returnedByFilter, setReturnedByFilter] = useState("");
  const [storeFilter, setStoreFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetReturn, setReportTargetReturn] = useState<StoreReturn | null>(null);

  // Pending returns count
  const pendingCount = useMemo(() => {
    return returns.filter(
      (r) => r.status === "Pending Receive" || r.status === "Partially Received"
    ).length;
  }, [returns]);

  // Distinct Stores
  const stores = useMemo(() => {
    const set = new Set<string>();
    returns.forEach((r) => r.warehouseStore && set.add(r.warehouseStore));
    return Array.from(set);
  }, [returns]);

  // Filtered Returns
  const filteredReturns = useMemo(() => {
    return returns.filter((ret) => {
      const isPending = ret.status === "Pending Receive" || ret.status === "Partially Received";

      if (activeTab === "pending" && !isPending) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          ret.returnNumber.toLowerCase().includes(q) ||
          ret.issueNumber.toLowerCase().includes(q) ||
          ret.mrNumber.toLowerCase().includes(q) ||
          ret.issuedTo.toLowerCase().includes(q) ||
          ret.warehouseStore.toLowerCase().includes(q) ||
          ret.department.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (returnIdFilter.trim() && !ret.returnNumber.toLowerCase().includes(returnIdFilter.toLowerCase())) {
        return false;
      }
      if (issueIdFilter.trim() && !ret.issueNumber.toLowerCase().includes(issueIdFilter.toLowerCase())) {
        return false;
      }
      if (mrIdFilter.trim() && !ret.mrNumber.toLowerCase().includes(mrIdFilter.toLowerCase())) {
        return false;
      }
      if (returnedByFilter.trim() && !ret.issuedTo.toLowerCase().includes(returnedByFilter.toLowerCase())) {
        return false;
      }
      if (storeFilter !== "All" && ret.warehouseStore !== storeFilter) {
        return false;
      }
      if (fromDate && ret.returnDate < fromDate) {
        return false;
      }
      if (toDate && ret.returnDate > toDate) {
        return false;
      }
      if (statusFilter !== "All" && ret.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [
    returns,
    activeTab,
    searchQuery,
    returnIdFilter,
    issueIdFilter,
    mrIdFilter,
    returnedByFilter,
    storeFilter,
    fromDate,
    toDate,
    statusFilter,
  ]);

  // Preview Report Data
  const previewReportData: StandardReportData = useMemo(() => {
    if (!reportTargetReturn) {
      return {
        companyName: "Pakiza Knit Composite Ltd",
        companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
        reportTitle: "STORE RETURN RECEIVE NOTE",
        reportNumber: "SRR-PREVIEW",
        reportDate: new Date().toISOString().slice(0, 10),
        statusBadge: "Draft",
        metaFields: [],
        tableHeaders: [],
        tableRows: [],
      };
    }

    return {
      companyName: "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "STORE RETURN RECEIVE NOTE",
      reportNumber: reportTargetReturn.returnNumber,
      reportDate: reportTargetReturn.returnDate,
      statusBadge: reportTargetReturn.status,
      metaFields: [
        { label: "Return ID", value: reportTargetReturn.returnNumber },
        { label: "Material Issue ID", value: reportTargetReturn.issueNumber },
        { label: "Material Requisition ID", value: reportTargetReturn.mrNumber },
        { label: "Returned By", value: reportTargetReturn.issuedTo },
        { label: "Department", value: reportTargetReturn.department },
        { label: "Return Store", value: reportTargetReturn.warehouseStore },
      ],
      tableHeaders: [
        "SL",
        "Item Code",
        "Item Description",
        "Return Store",
        "UOM",
        "Return Qty",
        "Allocations",
        "Condition",
      ],
      tableRows: reportTargetReturn.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.returnStore || reportTargetReturn.warehouseStore,
        it.uom,
        String(it.returnQty),
        it.batchAllocations && it.batchAllocations.length > 0
          ? it.batchAllocations.map((b) => `${b.batchNumber} (${b.quantity})`).join(", ")
          : it.locationAllocations && it.locationAllocations.length > 0
          ? it.locationAllocations.map((l) => `${l.locationName} (${l.quantity})`).join(", ")
          : "—",
        it.returnCondition || "Good (Restock)",
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTargetReturn.totalItems) },
        { label: "Total Return Qty", value: String(reportTargetReturn.totalReturnQty) },
        { label: "Received Qty", value: String(reportTargetReturn.receivedQty || 0) },
        { label: "Status", value: reportTargetReturn.status },
      ],
      notes: [
        `Materials returned from Issue ${reportTargetReturn.issueNumber}.`,
        "Inventory stock verified and replenished via Store Return Receive process.",
      ],
      signatures: [
        { title: "Returned By", name: reportTargetReturn.issuedTo, date: reportTargetReturn.returnDate },
        { title: "Store Officer", name: "Warehouse In-Charge", date: reportTargetReturn.returnDate },
      ],
    };
  }, [reportTargetReturn]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold shadow-sm">
                <PackageCheck className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                  Store Return Receive List
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Receive materials returned from shop floor or departments back into warehouse stock
                </p>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "pending"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Pending Receive</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "all"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>All Return Transactions</span>
                <span className="text-[10px] text-slate-400">({returns.length})</span>
              </button>
            </div>
          </div>

          {/* Filter Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Filter className="size-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Store Return Filters
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredReturns.length} of {returns.length} records
                </span>
              </div>
              <ChevronDown
                className={`size-4 text-slate-400 transition-transform duration-200 ${
                  isFiltersOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFiltersOpen && (
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Return ID */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Return ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RET-2026-0001"
                      value={returnIdFilter}
                      onChange={(e) => setReturnIdFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  {/* Material Issue ID */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Material Issue ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ISS-2026-0001"
                      value={issueIdFilter}
                      onChange={(e) => setIssueIdFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  {/* Material Requisition ID */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Material Requisition ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MR-2026-0001"
                      value={mrIdFilter}
                      onChange={(e) => setMrIdFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  {/* Returned By */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Returned By
                    </label>
                    <input
                      type="text"
                      placeholder="Employee name..."
                      value={returnedByFilter}
                      onChange={(e) => setReturnedByFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  {/* Return Store */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Return Store
                    </label>
                    <select
                      value={storeFilter}
                      onChange={(e) => setStoreFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="All">All Stores</option>
                      {stores.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* From Date & To Date Side-by-Side */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending Receive">Pending Receive</option>
                      <option value="Received">Received</option>
                      <option value="Partially Received">Partially Received</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setReturnIdFilter("");
                      setIssueIdFilter("");
                      setMrIdFilter("");
                      setReturnedByFilter("");
                      setStoreFilter("All");
                      setFromDate("");
                      setToDate("");
                      setStatusFilter("All");
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100">
              <span className="text-sm font-black text-slate-800">
                {activeTab === "pending" ? "Pending Store Return Receipts" : "All Return Records"} (
                {filteredReturns.length})
              </span>

              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search returns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3.5 text-center w-12">SL</th>
                    <th className="py-3 px-3.5">Return ID</th>
                    <th className="py-3 px-3.5">Material Issue ID</th>
                    <th className="py-3 px-3.5">Material Requisition ID</th>
                    <th className="py-3 px-3.5">Return Date</th>
                    <th className="py-3 px-3.5">Returned By</th>
                    <th className="py-3 px-3.5">Return Store</th>
                    <th className="py-3 px-3.5 text-center">Total Items</th>
                    <th className="py-3 px-3.5 text-right font-black">Return Quantity</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center sticky right-0 bg-slate-50 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredReturns.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CheckCircle2 className="size-8 text-emerald-300 stroke-[1.5]" />
                          <p className="text-xs font-semibold text-slate-600">
                            No store returns pending receipt
                          </p>
                          <p className="text-[10px] text-slate-400">
                            All materials returned from departments have been verified and received.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReturns.map((ret, idx) => {
                      const canReceive = ret.status === "Pending Receive" || ret.status === "Partially Received";

                      return (
                        <tr
                          key={ret.id}
                          className="hover:bg-slate-50/70 transition-colors group whitespace-nowrap"
                        >
                          <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="font-bold text-orange-600 font-mono">
                              {ret.returnNumber}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-indigo-600">
                            {ret.issueNumber}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-blue-600">
                            {ret.mrNumber}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600">
                            {ret.returnDate}
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-slate-800">
                            {ret.issuedTo}
                          </td>
                          <td className="py-3 px-3.5 max-w-[160px] truncate" title={ret.warehouseStore}>
                            {ret.warehouseStore}
                          </td>
                          <td className="py-3 px-3.5 text-center font-bold font-mono">
                            {ret.totalItems}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-orange-600 font-mono">
                            {ret.totalReturnQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold border ${
                                ret.status === "Pending Receive"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                                  : ret.status === "Received"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {ret.status}
                            </span>
                          </td>

                          {/* Action Column: RECEIVE BUTTON */}
                          <td className="py-3 px-3.5 text-center sticky right-0 bg-white group-hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center justify-center gap-1.5">
                              {canReceive ? (
                                <Link
                                  to="/inv-store-return-receive"
                                  search={{ returnId: ret.id }}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                                >
                                  <PackageCheck className="size-3.5" />
                                  Receive
                                </Link>
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-400">
                                  Received
                                </span>
                              )}

                              <button
                                title="Print Return Note"
                                onClick={() => {
                                  setReportTargetReturn(ret);
                                  setPreviewReportOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <Printer className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Preview Report Modal */}
        <StandardPreviewReportModal
          isOpen={previewReportOpen}
          onClose={() => {
            setPreviewReportOpen(false);
            setReportTargetReturn(null);
          }}
          data={previewReportData}
        />
      </main>
    </div>
  );
}
