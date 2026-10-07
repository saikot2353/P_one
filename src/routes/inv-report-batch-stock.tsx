import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Layers,
  History,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_BATCH_STOCK_DATA,
  BatchStockRow,
  INITIAL_LEDGER_DATA,
} from "@/lib/reports-mock-data";
import { formatAmount } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-batch-stock")({
  head: () => ({
    meta: [
      { title: "Batch Stock Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Dedicated register for batch-controlled products with manufacture, expiry dates, batch health KPIs, and transaction history.",
      },
    ],
  }),
  component: BatchStockRegisterPage,
});

export function BatchStockRegisterPage() {
  // Filters
  const [filterItem, setFilterItem] = useState("All");
  const [filterBatchNo, setFilterBatchNo] = useState("");
  const [filterStore, setFilterStore] = useState("All");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterExpiryDate, setFilterExpiryDate] = useState("");
  const [filterBatchStatus, setFilterBatchStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedBatchDrilldown, setSelectedBatchDrilldown] = useState<BatchStockRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Filter options
  const items = useMemo(
    () => Array.from(new Set(INITIAL_BATCH_STOCK_DATA.map((b) => b.itemName))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_BATCH_STOCK_DATA.map((b) => b.store))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_BATCH_STOCK_DATA.filter((row) => {
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterBatchStatus !== "All" && row.status !== filterBatchStatus) return false;
      if (filterBatchNo.trim() && !row.batch.toLowerCase().includes(filterBatchNo.toLowerCase().trim()))
        return false;
      if (filterLocation.trim() && !row.location.toLowerCase().includes(filterLocation.toLowerCase().trim()))
        return false;
      if (filterExpiryDate && row.expiryDate > filterExpiryDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.batch.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.store.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterItem,
    filterBatchNo,
    filterStore,
    filterLocation,
    filterExpiryDate,
    filterBatchStatus,
    searchQuery,
  ]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalBatches = filteredRows.length;
    const activeBatches = filteredRows.filter((r) => r.status === "Active").length;
    const expiredBatches = filteredRows.filter((r) => r.status === "Expired").length;
    const expiringSoon = filteredRows.filter((r) => r.status === "Expiring Soon").length;
    const batchStockQty = filteredRows.reduce((s, r) => s + r.quantity, 0);

    return { totalBatches, activeBatches, expiredBatches, expiringSoon, batchStockQty };
  }, [filteredRows]);

  const handleResetFilters = () => {
    setFilterItem("All");
    setFilterBatchNo("");
    setFilterStore("All");
    setFilterLocation("");
    setFilterExpiryDate("");
    setFilterBatchStatus("All");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Batch",
      "Mfg Date",
      "Expiry Date",
      "Store",
      "Location",
      "Quantity",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.itemCode,
      r.itemName,
      r.batch,
      r.mfgDate,
      r.expiryDate,
      r.store,
      r.location,
      r.quantity,
      r.status,
    ]);

    exportToCSV("Batch_Stock_Register.csv", headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Batch",
      "Mfg Date",
      "Expiry Date",
      "Store",
      "Location",
      "Quantity",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.itemCode,
      r.itemName,
      r.batch,
      r.mfgDate,
      r.expiryDate,
      r.store,
      r.location,
      r.quantity,
      r.status,
    ]);

    exportToExcel(
      "Batch_Stock_Register.xls",
      "Batch Stock Register",
      headers,
      rows,
      [{ label: "Total Batch Stock Qty", value: kpis.batchStockQty.toLocaleString() }]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Item",
      "Batch",
      "Mfg Date",
      "Expiry Date",
      "Store",
      "Location",
      "Quantity",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      `${r.itemName} (${r.itemCode})`,
      r.batch,
      r.mfgDate,
      r.expiryDate,
      r.store,
      r.location,
      r.quantity,
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "BATCH STOCK REGISTER",
      documentNumber: `BATCH-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Quality Assurance & Batch Inventory",
      metadata: [
        { label: "Active Batches", value: kpis.activeBatches },
        { label: "Expiring Soon", value: kpis.expiringSoon },
        { label: "Expired Batches", value: kpis.expiredBatches },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Batches", value: kpis.totalBatches },
        { label: "Batch Quantity", value: kpis.batchStockQty.toLocaleString(), highlight: true },
      ],
      signatures: [
        { role: "Batch QA Officer", name: "Quality Auditor" },
        { role: "Store Manager", name: "Central Warehouse" },
      ],
    });
    setIsPdfModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-7 py-5 space-y-4">
          {/* Header & Export Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Batch Stock Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Batch-Controlled Only [B]
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monitoring shelf-life, production lots, quarantine status, and batch audit trails.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/70 bg-card hover:bg-muted text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="size-3.5" />
                <span>Excel</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/70 bg-card hover:bg-muted text-xs font-semibold text-blue-600 dark:text-blue-400 transition cursor-pointer shadow-xs"
              >
                <FileText className="size-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={handlePrintPDF}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/70 bg-card hover:bg-muted text-xs font-semibold text-amber-600 dark:text-amber-400 transition cursor-pointer shadow-xs"
              >
                <Printer className="size-3.5" />
                <span>PDF / Print</span>
              </button>
            </div>
          </div>

          {/* 5 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Total Batches</span>
              <p className="text-lg font-bold mt-1 text-foreground">{kpis.totalBatches}</p>
              <span className="text-[10px] text-muted-foreground">Controlled lots</span>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-600">Active Batches</span>
              <p className="text-lg font-bold mt-1 text-emerald-600">{kpis.activeBatches}</p>
              <span className="text-[10px] text-muted-foreground">Fit for issue</span>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-rose-600">Expired Batches</span>
              <p className="text-lg font-bold mt-1 text-rose-600">{kpis.expiredBatches}</p>
              <span className="text-[10px] text-muted-foreground">Quarantined</span>
            </div>
            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-amber-600">Expiring Soon</span>
              <p className="text-lg font-bold mt-1 text-amber-600">{kpis.expiringSoon}</p>
              <span className="text-[10px] text-muted-foreground">Within 60 days</span>
            </div>
            <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">Batch Stock Qty</span>
              <p className="text-lg font-bold mt-1 text-purple-600 dark:text-purple-400 font-mono">
                {kpis.batchStockQty.toLocaleString()}
              </p>
              <span className="text-[10px] text-muted-foreground">Aggregate units</span>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter Batch Register</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item</label>
                <select
                  value={filterItem}
                  onChange={(e) => setFilterItem(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Batch Items</option>
                  {items.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Batch Number</label>
                <input
                  type="text"
                  placeholder="e.g. BAT-..."
                  value={filterBatchNo}
                  onChange={(e) => setFilterBatchNo(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Store</label>
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Stores</option>
                  {stores.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Location</label>
                <input
                  type="text"
                  placeholder="Filter location..."
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Expiry Before</label>
                <input
                  type="date"
                  value={filterExpiryDate}
                  onChange={(e) => setFilterExpiryDate(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Batch Status</label>
                <select
                  value={filterBatchStatus}
                  onChange={(e) => setFilterBatchStatus(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1100px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3">Batch Number</th>
                    <th className="py-2.5 px-3">Manufacture Date</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Action / Drill-down</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-muted-foreground">
                        No batch-tracked records found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                          {row.batch}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">{row.mfgDate}</td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap font-medium">{row.expiryDate}</td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.store}</td>
                        <td className="py-2 px-3 text-muted-foreground font-mono">{row.location}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                          {row.quantity.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : row.status === "Expiring Soon"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setSelectedBatchDrilldown(row)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition cursor-pointer"
                          >
                            <History className="size-3" />
                            <span>Drill-down</span>
                          </button>
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

      {/* Batch Drill-down Transaction History Modal */}
      {selectedBatchDrilldown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <History className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Batch Lifecycle History — {selectedBatchDrilldown.batch}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBatchDrilldown(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedBatchDrilldown.itemName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Store & Location</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedBatchDrilldown.store} ({selectedBatchDrilldown.location})</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Shelf Life</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedBatchDrilldown.mfgDate} to {selectedBatchDrilldown.expiryDate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Current Lot Balance</span>
                  <p className="font-bold font-mono text-primary text-xs mt-0.5">{selectedBatchDrilldown.quantity} units</p>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[300px]">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-muted text-muted-foreground font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-2.5">Date</th>
                      <th className="py-2 px-2.5">Transaction</th>
                      <th className="py-2 px-2.5">Ref No.</th>
                      <th className="py-2 px-2.5 text-right">In</th>
                      <th className="py-2 px-2.5 text-right">Out</th>
                      <th className="py-2 px-2.5 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {INITIAL_LEDGER_DATA.filter((l) => l.itemCode === selectedBatchDrilldown.itemCode).map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/40">
                        <td className="py-2 px-2.5">{tx.date}</td>
                        <td className="py-2 px-2.5 font-semibold text-primary">{tx.transactionType}</td>
                        <td className="py-2 px-2.5 font-mono text-[11px] text-muted-foreground">{tx.referenceNo}</td>
                        <td className="py-2 px-2.5 text-right font-mono text-emerald-600">{tx.inQty > 0 ? `+${tx.inQty}` : "-"}</td>
                        <td className="py-2 px-2.5 text-right font-mono text-rose-500">{tx.outQty > 0 ? `-${tx.outQty}` : "-"}</td>
                        <td className="py-2 px-2.5 text-right font-mono font-bold">{tx.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedBatchDrilldown(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      <StandardPreviewReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={pdfReportData}
      />
    </div>
  );
}
