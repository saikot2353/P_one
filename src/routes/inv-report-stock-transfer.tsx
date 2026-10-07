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
  Truck,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_STOCK_TRANSFER_DATA,
  StockTransferRow,
} from "@/lib/reports-mock-data";
import { formatAmount } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-stock-transfer")({
  head: () => ({
    meta: [
      { title: "Stock Transfer Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Track Inter-Company and Intra-Company stock movements across Dispatch, Transit, Receive, and QA variance acceptance workflows.",
      },
    ],
  }),
  component: StockTransferRegisterPage,
});

export function StockTransferRegisterPage() {
  // Filters
  const [filterTransferId, setFilterTransferId] = useState("");
  const [filterFromCompany, setFilterFromCompany] = useState("All");
  const [filterToCompany, setFilterToCompany] = useState("All");
  const [filterFromStore, setFilterFromStore] = useState("All");
  const [filterToStore, setFilterToStore] = useState("All");
  const [filterItem, setFilterItem] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-10-31");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedTransferModal, setSelectedTransferModal] = useState<StockTransferRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  const companies = useMemo(() => {
    const froms = INITIAL_STOCK_TRANSFER_DATA.map((t) => t.fromCompany);
    const tos = INITIAL_STOCK_TRANSFER_DATA.map((t) => t.toCompany);
    return Array.from(new Set([...froms, ...tos]));
  }, []);

  const stores = useMemo(() => {
    const froms = INITIAL_STOCK_TRANSFER_DATA.map((t) => t.fromStore);
    const tos = INITIAL_STOCK_TRANSFER_DATA.map((t) => t.toStore);
    return Array.from(new Set([...froms, ...tos]));
  }, []);

  const items = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_TRANSFER_DATA.map((t) => t.itemName))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_STOCK_TRANSFER_DATA.filter((row) => {
      if (filterTransferId.trim() && !row.transferId.toLowerCase().includes(filterTransferId.toLowerCase().trim()))
        return false;
      if (filterFromCompany !== "All" && row.fromCompany !== filterFromCompany) return false;
      if (filterToCompany !== "All" && row.toCompany !== filterToCompany) return false;
      if (filterFromStore !== "All" && row.fromStore !== filterFromStore) return false;
      if (filterToStore !== "All" && row.toStore !== filterToStore) return false;
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;
      if (filterStatus !== "All" && row.status !== filterStatus) return false;

      if (fromDate && row.date < fromDate) return false;
      if (toDate && row.date > toDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.transferId.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.fromStore.toLowerCase().includes(q) ||
          row.toStore.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterTransferId,
    filterFromCompany,
    filterToCompany,
    filterFromStore,
    filterToStore,
    filterItem,
    filterBatch,
    filterStatus,
    fromDate,
    toDate,
    searchQuery,
  ]);

  // KPIs as requested: Pending, In Transit, Partially Received, Fully Received, Short / Variance
  const kpis = useMemo(() => {
    const pending = filteredRows.filter((r) => r.status === "Pending").length;
    const inTransit = filteredRows.filter((r) => r.status === "In Transit").length;
    const partiallyReceived = filteredRows.filter((r) => r.status === "Partially Received").length;
    const fullyReceived = filteredRows.filter((r) => r.status === "Fully Received").length;
    const variance = filteredRows.filter((r) => r.status === "Short / Variance").length;

    return { pending, inTransit, partiallyReceived, fullyReceived, variance };
  }, [filteredRows]);

  const handleResetFilters = () => {
    setFilterTransferId("");
    setFilterFromCompany("All");
    setFilterToCompany("All");
    setFilterFromStore("All");
    setFilterToStore("All");
    setFilterItem("All");
    setFilterBatch("");
    setFilterStatus("All");
    setFromDate("2026-09-01");
    setToDate("2026-10-31");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Transfer ID",
      "Date",
      "Item Code",
      "Item Name",
      "From Company",
      "To Company",
      "From Store",
      "To Store",
      "Quantity",
      "Received Qty",
      "Pending Qty",
      "Variance",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.transferId,
      r.date,
      r.itemCode,
      r.itemName,
      r.fromCompany,
      r.toCompany,
      r.fromStore,
      r.toStore,
      r.quantity,
      r.receivedQty,
      r.pendingQty,
      r.varianceQty,
      r.status,
    ]);

    exportToCSV(`Stock_Transfer_Register_${fromDate}_to_${toDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Transfer ID",
      "Date",
      "Item Code",
      "Item Name",
      "From Company",
      "To Company",
      "From Store",
      "To Store",
      "Quantity",
      "Received Qty",
      "Pending Qty",
      "Variance",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.transferId,
      r.date,
      r.itemCode,
      r.itemName,
      r.fromCompany,
      r.toCompany,
      r.fromStore,
      r.toStore,
      r.quantity,
      r.receivedQty,
      r.pendingQty,
      r.varianceQty,
      r.status,
    ]);

    exportToExcel(
      `Stock_Transfer_Register_${fromDate}_to_${toDate}.xls`,
      "Stock Transfer Register",
      headers,
      rows,
      [
        {
          label: "Total Transfer Volume",
          value: filteredRows.reduce((s, r) => s + r.quantity, 0).toLocaleString(),
        },
      ]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Transfer ID",
      "Date",
      "Item",
      "From Store",
      "To Store",
      "Qty",
      "Received",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.transferId,
      r.date,
      `${r.itemName} (${r.itemCode})`,
      r.fromStore,
      r.toStore,
      r.quantity,
      r.receivedQty,
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "STOCK TRANSFER REGISTER",
      documentNumber: `TRF-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Supply Chain & Inter-Unit Logistics",
      metadata: [
        { label: "Date Range", value: `${fromDate} to ${toDate}` },
        { label: "Total Transfers", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Transfer Quantity", value: filteredRows.reduce((s, r) => s + r.quantity, 0).toLocaleString(), highlight: true },
      ],
      signatures: [
        { role: "Dispatch Gate In-Charge", name: "Central Transport Desk" },
        { role: "Destination Store Keeper", name: "Inward Gate" },
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
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Stock Transfer Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Inter & Intra-Company Transfers
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full 5-stage lifecycle: Transfer → Dispatch → In Transit → Receive → Acceptance & Variance settlement.
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

          {/* 5 Required KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Pending</span>
              <p className="text-lg font-bold mt-1 text-foreground">{kpis.pending}</p>
              <span className="text-[10px] text-muted-foreground">Awaiting dispatch</span>
            </div>
            <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-blue-600">In Transit</span>
              <p className="text-lg font-bold mt-1 text-blue-600">{kpis.inTransit}</p>
              <span className="text-[10px] text-muted-foreground">On the road</span>
            </div>
            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-amber-600">Partially Received</span>
              <p className="text-lg font-bold mt-1 text-amber-600">{kpis.partiallyReceived}</p>
              <span className="text-[10px] text-muted-foreground">Balance remaining</span>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-600">Fully Received</span>
              <p className="text-lg font-bold mt-1 text-emerald-600">{kpis.fullyReceived}</p>
              <span className="text-[10px] text-muted-foreground">Stock updated</span>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-rose-600">Short / Variance</span>
              <p className="text-lg font-bold mt-1 text-rose-600">{kpis.variance}</p>
              <span className="text-[10px] text-muted-foreground">Discrepancy logged</span>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter Stock Transfers</span>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Transfer ID</label>
                <input
                  type="text"
                  placeholder="e.g. TRF-..."
                  value={filterTransferId}
                  onChange={(e) => setFilterTransferId(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">From Store</label>
                <select
                  value={filterFromStore}
                  onChange={(e) => setFilterFromStore(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Sources</option>
                  {stores.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">To Store</label>
                <select
                  value={filterToStore}
                  onChange={(e) => setFilterToStore(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Destinations</option>
                  {stores.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Partially Received">Partially Received</option>
                  <option value="Fully Received">Fully Received</option>
                  <option value="Short / Variance">Short / Variance</option>
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
              <table className="w-full text-xs text-left border-collapse min-w-[1250px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Transfer ID</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3">From Store</th>
                    <th className="py-2.5 px-3">To Store</th>
                    <th className="py-2.5 px-3 text-right">Transfer Qty</th>
                    <th className="py-2.5 px-3 text-right">Received Qty</th>
                    <th className="py-2.5 px-3 text-right">Pending Qty</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Lifecycle Flow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-muted-foreground">
                        No stock transfer records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 font-mono font-bold text-primary whitespace-nowrap">
                          {row.transferId}
                        </td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.date}</td>
                        <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.fromStore}</td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.toStore}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                          {row.quantity.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-600 font-semibold">
                          {row.receivedQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-amber-600 font-semibold">
                          {row.pendingQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === "Fully Received"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : row.status === "In Transit"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : row.status === "Short / Variance"
                                ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setSelectedTransferModal(row)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition cursor-pointer"
                          >
                            <Eye className="size-3" />
                            <span>View Flow</span>
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

      {/* Interactive 5-Stage View Flow Modal as requested: Transfer ↓ Dispatch ↓ In Transit ↓ Receive ↓ Accepted / Rejected / Damaged ↓ Final Stock */}
      {selectedTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Transfer Lifecycle Flow — {selectedTransferModal.transferId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTransferModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item & Batch</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">
                    {selectedTransferModal.itemName} ({selectedTransferModal.batch || "No Batch"})
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Transfer Status</span>
                  <p className="font-bold text-primary text-xs mt-0.5">{selectedTransferModal.status}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">From Store</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedTransferModal.fromStore}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">To Store</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedTransferModal.toStore}</p>
                </div>
              </div>

              {/* 5-Stage Visual Workflow */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wide">
                  5-Stage Workflow Audit:
                </h4>

                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>1. Transfer Requisition Approved: {selectedTransferModal.quantity} units</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold pl-4">
                    <span>↓</span>
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>2. Dispatched from Origin: {selectedTransferModal.quantity} units</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold pl-8">
                    <span>↓</span>
                    <Truck className="size-3.5 text-blue-600" />
                    <span>3. In Transit (Logistics Vehicle Tracked)</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold pl-12">
                    <span>↓</span>
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>4. Destination Inward Receive: {selectedTransferModal.receivedQty} units</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold pl-16">
                    <span>↓</span>
                    <AlertTriangle className="size-3.5 text-amber-600" />
                    <span>
                      5. QA Clearance: Accepted ({selectedTransferModal.stages.accepted}), Damaged ({selectedTransferModal.stages.damaged}), Variance ({selectedTransferModal.varianceQty})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-black pl-20">
                    <span>↓</span>
                    <span>Final Available Stock Posted: {selectedTransferModal.stages.finalStock || selectedTransferModal.receivedQty} units</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedTransferModal(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Close View Flow
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
