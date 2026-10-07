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
  Trash2,
  AlertTriangle,
  Calendar,
  X,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_STOCK_WRITEOFF_DATA,
  StockWriteOffRow,
} from "@/lib/reports-mock-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-stock-writeoff")({
  head: () => ({
    meta: [
      { title: "Stock Write-Off Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Audit permanent inventory derecognitions, damage casualties, obsolescence write-offs, approvals, and cost losses.",
      },
    ],
  }),
  component: StockWriteOffRegisterPage,
});

export function StockWriteOffRegisterPage() {
  const currencyCfg = getActiveCurrencyConfig();

  // Filters
  const [filterWriteOffId, setFilterWriteOffId] = useState("");
  const [filterItem, setFilterItem] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [fromDate, setFromDate] = useState("2026-08-01");
  const [toDate, setToDate] = useState("2026-10-31");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedWriteOffModal, setSelectedWriteOffModal] = useState<StockWriteOffRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  const items = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_WRITEOFF_DATA.map((w) => w.itemName))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_WRITEOFF_DATA.map((w) => w.store))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_STOCK_WRITEOFF_DATA.filter((row) => {
      if (
        filterWriteOffId.trim() &&
        !row.writeOffId.toLowerCase().includes(filterWriteOffId.toLowerCase().trim())
      )
        return false;
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;
      if (filterStatus !== "All" && row.status !== filterStatus) return false;

      if (fromDate && row.date < fromDate) return false;
      if (toDate && row.date > toDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.writeOffId.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.reason.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterWriteOffId,
    filterItem,
    filterStore,
    filterBatch,
    filterStatus,
    fromDate,
    toDate,
    searchQuery,
  ]);

  // 6 Required KPIs: Total Write-Offs, Total Write-Off Qty, Total Write-Off Value, Pending Approval, Approved, Posted
  const kpis = useMemo(() => {
    const totalCount = filteredRows.length;
    const totalQty = filteredRows.reduce((s, r) => s + r.quantity, 0);
    const totalValue = filteredRows.reduce((s, r) => s + r.value, 0);
    const pending = filteredRows.filter((r) => r.status === "Pending Approval").length;
    const approved = filteredRows.filter((r) => r.status === "Approved").length;
    const posted = filteredRows.filter((r) => r.status === "Posted").length;

    return { totalCount, totalQty, totalValue, pending, approved, posted };
  }, [filteredRows]);

  const handleResetFilters = () => {
    setFilterWriteOffId("");
    setFilterItem("All");
    setFilterStore("All");
    setFilterBatch("");
    setFilterStatus("All");
    setFromDate("2026-08-01");
    setToDate("2026-10-31");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Write-Off ID",
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "Quantity",
      "Unit Cost",
      "Value",
      "Reason",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.writeOffId,
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.quantity,
      formatAmount(r.unitCost),
      formatAmount(r.value),
      r.reason,
      r.status,
    ]);

    exportToCSV(`Stock_WriteOff_Register_${fromDate}_to_${toDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Date",
      "Write-Off ID",
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "Quantity",
      "Unit Cost",
      "Value",
      "Reason",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.writeOffId,
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.quantity,
      formatAmount(r.unitCost),
      formatAmount(r.value),
      r.reason,
      r.status,
    ]);

    exportToExcel(
      `Stock_WriteOff_Register_${fromDate}_to_${toDate}.xls`,
      "Stock Write-Off Register",
      headers,
      rows,
      [
        { label: "Total Write-Off Quantity", value: kpis.totalQty.toLocaleString() },
        { label: "Total Write-Off Value Lost", value: formatAmount(kpis.totalValue, undefined, true) },
      ]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Date",
      "Write-Off ID",
      "Item",
      "Store",
      "Qty",
      "Unit Cost",
      "Value Lost",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.date,
      r.writeOffId,
      `${r.itemName} (${r.itemCode})`,
      r.store,
      r.quantity,
      formatAmount(r.unitCost),
      formatAmount(r.value),
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "STOCK WRITE-OFF REGISTER",
      documentNumber: `WOF-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Internal Audit & Asset Disposal Committee",
      metadata: [
        { label: "Date Range", value: `${fromDate} to ${toDate}` },
        { label: "Total Write-Off Cases", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Casualty Qty", value: kpis.totalQty.toLocaleString() },
        { label: "Financial Loss Value", value: formatAmount(kpis.totalValue, undefined, true), isTotal: true, highlight: true },
      ],
      signatures: [
        { role: "Investigation Officer", name: "QA Inspector" },
        { role: "Approved By", name: "Chief Financial Officer" },
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
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Stock Write-Off Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  Permanent Loss Derecognition
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Register of damaged, expired, or obsolete inventory write-offs with governance and approval tracking.
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

          {/* 6 Required KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="p-3 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[10.5px] font-medium text-muted-foreground">Total Write-Offs</span>
              <p className="text-base font-bold mt-1 text-foreground">{kpis.totalCount} Cases</p>
              <span className="text-[10px] text-muted-foreground">All logged</span>
            </div>
            <div className="p-3 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[10.5px] font-medium text-muted-foreground">Total Write-Off Qty</span>
              <p className="text-base font-bold mt-1 text-foreground font-mono">{kpis.totalQty.toLocaleString()}</p>
              <span className="text-[10px] text-rose-500 font-medium">Scrapped units</span>
            </div>
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-xs">
              <span className="text-[10.5px] font-medium text-rose-600">Total Write-Off Value</span>
              <p className="text-base font-bold mt-1 text-rose-600 font-mono">{formatAmount(kpis.totalValue, undefined, true)}</p>
              <span className="text-[10px] text-muted-foreground">{currencyCfg.format}</span>
            </div>
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-xs">
              <span className="text-[10.5px] font-medium text-amber-600">Pending Approval</span>
              <p className="text-base font-bold mt-1 text-amber-600">{kpis.pending}</p>
              <span className="text-[10px] text-muted-foreground">Under review</span>
            </div>
            <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 shadow-xs">
              <span className="text-[10.5px] font-medium text-blue-600">Approved</span>
              <p className="text-base font-bold mt-1 text-blue-600">{kpis.approved}</p>
              <span className="text-[10px] text-muted-foreground">Ready to post</span>
            </div>
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-xs">
              <span className="text-[10.5px] font-medium text-emerald-600">Posted</span>
              <p className="text-base font-bold mt-1 text-emerald-600">{kpis.posted}</p>
              <span className="text-[10px] text-muted-foreground">Final derecognition</span>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter Write-Off Incidents</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Write-Off ID</label>
                <input
                  type="text"
                  placeholder="e.g. WOF-..."
                  value={filterWriteOffId}
                  onChange={(e) => setFilterWriteOffId(e.target.value)}
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Posted">Posted</option>
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
                    <th className="py-2.5 px-3">Write-Off ID</th>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost</th>
                    <th className="py-2.5 px-3 text-right">Value Lost</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-muted-foreground">
                        No write-off entries found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.date}</td>
                        <td className="py-2 px-3 font-mono font-bold text-rose-600 whitespace-nowrap">
                          {row.writeOffId}
                        </td>
                        <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.store}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">{row.batch || "-"}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                          {row.quantity.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                          {formatAmount(row.unitCost)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-rose-600">
                          {formatAmount(row.value)}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground max-w-[200px] truncate" title={row.reason}>
                          {row.reason}
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === "Posted"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : row.status === "Approved"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setSelectedWriteOffModal(row)}
                            className="p-1 rounded-md hover:bg-muted text-primary cursor-pointer transition"
                            title="View Write-Off Details"
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

      {/* Write-off View Modal: Item, Batch, Location, Quantity, Reason, Unit Cost, Write-Off Value, Approval, Posting */}
      {selectedWriteOffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Trash2 className="size-4 text-rose-600" />
                <h3 className="font-bold text-sm text-foreground">
                  Stock Write-Off Dossier — {selectedWriteOffModal.writeOffId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWriteOffModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Description</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedWriteOffModal.itemName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Code</span>
                  <p className="font-mono font-bold text-foreground text-xs mt-0.5">{selectedWriteOffModal.itemCode}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Batch Number</span>
                  <p className="font-mono text-purple-600 font-bold text-xs mt-0.5">{selectedWriteOffModal.batch || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Store & Location</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedWriteOffModal.store} / {selectedWriteOffModal.location || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl border border-border/60 bg-muted/30">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Quantity</span>
                  <p className="text-base font-bold text-foreground mt-1 font-mono">{selectedWriteOffModal.quantity}</p>
                </div>
                <div className="p-2.5 rounded-xl border border-border/60 bg-muted/30">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Unit Cost</span>
                  <p className="text-base font-bold font-mono text-foreground mt-1">{formatAmount(selectedWriteOffModal.unitCost)}</p>
                </div>
                <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <span className="text-[10px] text-rose-600 font-bold uppercase">Write-Off Value</span>
                  <p className="text-base font-bold font-mono text-rose-600 mt-1">{formatAmount(selectedWriteOffModal.value, undefined, true)}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Reason for Derecognition</span>
                <p className="text-foreground text-xs">{selectedWriteOffModal.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Approval Authority</span>
                  <p className="font-bold text-foreground text-xs mt-0.5">{selectedWriteOffModal.approvalBy || "Pending Review"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Posting Date & Status</span>
                  <p className="font-bold text-primary text-xs mt-0.5">{selectedWriteOffModal.postedDate || "In Review"} ({selectedWriteOffModal.status})</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedWriteOffModal(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Close Dossier
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
