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
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Calendar,
  X,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_STOCK_ADJUSTMENT_DATA,
  StockAdjustmentRow,
} from "@/lib/reports-mock-data";
import { formatAmount } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-stock-adjustment")({
  head: () => ({
    meta: [
      { title: "Stock Adjustment Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Historical register of manual inventory reconciliations, physical count variances, and stock corrections.",
      },
    ],
  }),
  component: StockAdjustmentRegisterPage,
});

export function StockAdjustmentRegisterPage() {
  // Filters
  const [filterAdjustmentId, setFilterAdjustmentId] = useState("");
  const [filterItem, setFilterItem] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterAdjustmentType, setFilterAdjustmentType] = useState("All");
  const [filterReason, setFilterReason] = useState("");
  const [fromDate, setFromDate] = useState("2026-08-01");
  const [toDate, setToDate] = useState("2026-10-31");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedAdjustmentModal, setSelectedAdjustmentModal] = useState<StockAdjustmentRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  const items = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_ADJUSTMENT_DATA.map((a) => a.itemName))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_ADJUSTMENT_DATA.map((a) => a.store))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_STOCK_ADJUSTMENT_DATA.filter((row) => {
      if (
        filterAdjustmentId.trim() &&
        !row.adjustmentId.toLowerCase().includes(filterAdjustmentId.toLowerCase().trim())
      )
        return false;
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterAdjustmentType !== "All" && row.adjustmentType !== filterAdjustmentType) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;
      if (filterLocation.trim() && !row.location.toLowerCase().includes(filterLocation.toLowerCase().trim()))
        return false;
      if (filterReason.trim() && !row.reason.toLowerCase().includes(filterReason.toLowerCase().trim()))
        return false;

      if (fromDate && row.date < fromDate) return false;
      if (toDate && row.date > toDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.adjustmentId.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.reason.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterAdjustmentId,
    filterItem,
    filterStore,
    filterAdjustmentType,
    filterBatch,
    filterLocation,
    filterReason,
    fromDate,
    toDate,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setFilterAdjustmentId("");
    setFilterItem("All");
    setFilterStore("All");
    setFilterAdjustmentType("All");
    setFilterBatch("");
    setFilterLocation("");
    setFilterReason("");
    setFromDate("2026-08-01");
    setToDate("2026-10-31");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Adjustment ID",
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "Adjustment Type",
      "Previous Qty",
      "Adjustment Qty",
      "Final Qty",
      "Reason",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.adjustmentId,
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.adjustmentType,
      r.previousQty,
      r.adjustmentQty,
      r.finalQty,
      r.reason,
    ]);

    exportToCSV(`Stock_Adjustment_Register_${fromDate}_to_${toDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Date",
      "Adjustment ID",
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "Adjustment Type",
      "Previous Qty",
      "Adjustment Qty",
      "Final Qty",
      "Reason",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.adjustmentId,
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.adjustmentType,
      r.previousQty,
      r.adjustmentQty,
      r.finalQty,
      r.reason,
    ]);

    exportToExcel(
      `Stock_Adjustment_Register_${fromDate}_to_${toDate}.xls`,
      "Stock Adjustment Register",
      headers,
      rows,
      [{ label: "Total Reconciled Vouchers", value: filteredRows.length }]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Date",
      "Adjustment ID",
      "Item",
      "Store",
      "Type",
      "Prev Qty",
      "Adj Qty",
      "Final Qty",
      "Reason",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.date,
      r.adjustmentId,
      `${r.itemName} (${r.itemCode})`,
      r.store,
      r.adjustmentType,
      r.previousQty,
      r.adjustmentType === "Stock Increase" ? `+${r.adjustmentQty}` : `-${r.adjustmentQty}`,
      r.finalQty,
      r.reason,
    ]);

    setPdfReportData({
      reportTitle: "STOCK ADJUSTMENT REGISTER",
      documentNumber: `ADJ-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Inventory Audit & Stock Reconciliation Desk",
      metadata: [
        { label: "Date Range", value: `${fromDate} to ${toDate}` },
        { label: "Total Adjustments", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      signatures: [
        { role: "Store Audit Officer", name: "Physical Audit Inspector" },
        { role: "Approved By", name: "Supply Chain Director" },
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
                  Stock Adjustment Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Manual Adjustments (+ / -)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Audit trail of manual inventory quantity changes, physical stock counts, and discrepancy reconciliations.
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

          {/* Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter Adjustment Vouchers</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Adjustment ID</label>
                <input
                  type="text"
                  placeholder="e.g. ADJ-..."
                  value={filterAdjustmentId}
                  onChange={(e) => setFilterAdjustmentId(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item</label>
                <select
                  value={filterItem}
                  onChange={(e) => setFilterItem(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Items</option>
                  {items.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Type (+ / -)</label>
                <select
                  value={filterAdjustmentType}
                  onChange={(e) => setFilterAdjustmentType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Stock Increase">Stock Increase (+)</option>
                  <option value="Stock Decrease">Stock Decrease (-)</option>
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Batch</label>
                <input
                  type="text"
                  placeholder="Filter batch..."
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Reason Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. audit, count..."
                  value={filterReason}
                  onChange={(e) => setFilterReason(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Adjustment ID</th>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3 text-right">Previous Qty</th>
                    <th className="py-2.5 px-3 text-right">Adjustment Qty</th>
                    <th className="py-2.5 px-3 text-right font-bold text-primary">Final Qty</th>
                    <th className="py-2.5 px-3">Audit Reason</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-muted-foreground">
                        No adjustment records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.date}</td>
                        <td className="py-2 px-3 font-mono font-bold text-primary whitespace-nowrap">
                          {row.adjustmentId}
                        </td>
                        <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.store}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">{row.batch || "-"}</td>
                        <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                          {row.previousQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold whitespace-nowrap">
                          {row.adjustmentType === "Stock Increase" ? (
                            <span className="text-emerald-600 flex items-center justify-end gap-1">
                              <ArrowUp className="size-3" /> +{row.adjustmentQty.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-rose-500 flex items-center justify-end gap-1">
                              <ArrowDown className="size-3" /> -{row.adjustmentQty.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-primary text-sm">
                          {row.finalQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground max-w-[250px] truncate" title={row.reason}>
                          {row.reason}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setSelectedAdjustmentModal(row)}
                            className="p-1 rounded-md hover:bg-muted text-primary cursor-pointer transition"
                            title="View Adjustment Transaction"
                          >
                            <Eye className="size-3.5" />
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

      {/* Adjustment Detail Modal */}
      {selectedAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Stock Adjustment Voucher — {selectedAdjustmentModal.adjustmentId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAdjustmentModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Adjustment Type</span>
                  <p className="font-bold text-primary text-xs mt-0.5">{selectedAdjustmentModal.adjustmentType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Date</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedAdjustmentModal.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Store & Batch</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">
                    {selectedAdjustmentModal.store} ({selectedAdjustmentModal.batch || "No Batch"})
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Description</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">
                    {selectedAdjustmentModal.itemName} [{selectedAdjustmentModal.itemCode}]
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl border border-border/60 bg-muted/30">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Previous Qty</span>
                  <p className="text-base font-bold text-foreground mt-1 font-mono">
                    {selectedAdjustmentModal.previousQty}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl border ${selectedAdjustmentModal.adjustmentType === "Stock Increase" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600" : "border-rose-500/20 bg-rose-500/5 text-rose-600"}`}>
                  <span className="text-[10px] font-bold uppercase">Adjusted Qty</span>
                  <p className="text-base font-bold font-mono mt-1">
                    {selectedAdjustmentModal.adjustmentType === "Stock Increase" ? `+${selectedAdjustmentModal.adjustmentQty}` : `-${selectedAdjustmentModal.adjustmentQty}`}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5">
                  <span className="text-[10px] text-primary font-bold uppercase">Final Balance</span>
                  <p className="text-base font-bold font-mono text-primary mt-1">
                    {selectedAdjustmentModal.finalQty}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Formal Reconciliation Reason</span>
                <p className="text-foreground text-xs">{selectedAdjustmentModal.reason}</p>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedAdjustmentModal(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Close Voucher
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
