import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  X,
  Layers,
  History,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_LEDGER_DATA,
  TransactionLedgerRow,
  LedgerTransactionType,
} from "@/lib/reports-mock-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-transaction-ledger")({
  head: () => ({
    meta: [
      { title: "Item Transaction Ledger — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Accounting-style running stock ledger recording all 11 transaction types with inflow, outflow, and balances.",
      },
    ],
  }),
  component: ItemTransactionLedgerPage,
});

export function ItemTransactionLedgerPage() {
  const navigate = useNavigate();
  const currencyCfg = getActiveCurrencyConfig();

  // Filters
  const [filterItem, setFilterItem] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [fromDate, setFromDate] = useState("2026-08-01");
  const [toDate, setToDate] = useState("2026-10-31");
  const [filterTxType, setFilterTxType] = useState<string>("All");
  const [filterRefNo, setFilterRefNo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedTxModal, setSelectedTxModal] = useState<TransactionLedgerRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Filter options
  const items = useMemo(
    () => Array.from(new Set(INITIAL_LEDGER_DATA.map((l) => l.itemName))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_LEDGER_DATA.map((l) => l.store))),
    []
  );

  const transactionTypes: LedgerTransactionType[] = [
    "Opening Stock",
    "Material Receipt",
    "Direct Receipt",
    "Material Issue",
    "Store Return",
    "Supplier Return",
    "Transfer In",
    "Transfer Out",
    "Adjustment +",
    "Adjustment -",
    "Write-Off",
  ];

  // Filtered dataset
  const filteredRows = useMemo(() => {
    return INITIAL_TRANSACTION_LEDGER_DATA.filter((row) => {
      if (filterItem.trim() && filterItem !== "All") {
        const q = filterItem.toLowerCase().trim();
        if (!row.itemName.toLowerCase().includes(q) && !row.itemCode.toLowerCase().includes(q)) return false;
      }
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterTxType !== "All" && row.transactionType !== filterTxType) return false;
      if (filterRefNo.trim() && !row.referenceNo.toLowerCase().includes(filterRefNo.toLowerCase().trim()))
        return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;
      if (filterLocation.trim() && !row.location.toLowerCase().includes(filterLocation.toLowerCase().trim()))
        return false;

      if (fromDate && row.date < fromDate) return false;
      if (toDate && row.date > toDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.referenceNo.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          (row.remarks && row.remarks.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterItem,
    filterStore,
    filterTxType,
    filterRefNo,
    filterBatch,
    filterLocation,
    fromDate,
    toDate,
    searchQuery,
  ]);

  // Overall inflow and outflow sums
  const totalIn = useMemo(() => filteredRows.reduce((s, r) => s + r.inQty, 0), [filteredRows]);
  const totalOut = useMemo(() => filteredRows.reduce((s, r) => s + r.outQty, 0), [filteredRows]);

  const handleResetFilters = () => {
    setFilterItem("All");
    setFilterStore("All");
    setFilterTxType("All");
    setFilterRefNo("");
    setFilterBatch("");
    setFilterLocation("");
    setFromDate("2026-08-01");
    setToDate("2026-10-31");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Transaction Type",
      "Reference No.",
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "Location",
      "In Qty",
      "Out Qty",
      "Balance",
      "Remarks",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.transactionType,
      r.referenceNo,
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.location,
      r.inQty,
      r.outQty,
      r.balance,
      r.remarks || "",
    ]);

    exportToCSV(`Item_Transaction_Ledger_${fromDate}_to_${toDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Date",
      "Transaction Type",
      "Reference No.",
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "Location",
      "In Qty",
      "Out Qty",
      "Balance",
      "Remarks",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.transactionType,
      r.referenceNo,
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.location,
      r.inQty,
      r.outQty,
      r.balance,
      r.remarks || "",
    ]);

    const subtotals = [
      { label: "Total Inflow Quantity", value: totalIn.toLocaleString() },
      { label: "Total Outflow Quantity", value: totalOut.toLocaleString() },
    ];

    exportToExcel(
      `Item_Transaction_Ledger_${fromDate}_to_${toDate}.xls`,
      "Item Transaction Ledger",
      headers,
      rows,
      subtotals
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Date",
      "Type",
      "Reference No.",
      "Store",
      "Batch/Loc",
      "In",
      "Out",
      "Balance",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.date,
      r.transactionType,
      r.referenceNo,
      r.store,
      r.batch || r.location,
      r.inQty > 0 ? `+${r.inQty}` : "-",
      r.outQty > 0 ? `-${r.outQty}` : "-",
      r.balance,
    ]);

    setPdfReportData({
      reportTitle: "ITEM TRANSACTION LEDGER",
      documentNumber: `LEDGER-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Central Inventory Audit & Store Accounts",
      metadata: [
        { label: "Date Range", value: `${fromDate} to ${toDate}` },
        { label: "Transaction Type", value: filterTxType },
        { label: "Item Filter", value: filterItem },
        { label: "Total Transactions", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total In Qty", value: totalIn.toLocaleString() },
        { label: "Total Out Qty", value: totalOut.toLocaleString() },
      ],
      signatures: [
        { role: "Store Ledger Keeper", name: "Accounts Officer" },
        { role: "Inventory Audit", name: "Audit Inspector" },
        { role: "Head of Supply Chain", name: "General Manager" },
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
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Item Transaction Ledger
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Accounting-Style Stock Ledger
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full chronologically ordered stock ledger documenting inflows, outflows, and running balances across all 11 transaction types.
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

          {/* Quick Metrics (Transaction Types Tracked KPI card removed) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Ledger Transactions</span>
              <p className="text-lg font-bold mt-1 text-foreground">{filteredRows.length} Entries</p>
              <span className="text-[10px] text-muted-foreground">In active date range</span>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-600">Total Inflow (Receipts)</span>
              <p className="text-lg font-bold mt-1 text-emerald-600 font-mono">+{totalIn.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">Stock increases</span>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-rose-600">Total Outflow (Issues)</span>
              <p className="text-lg font-bold mt-1 text-rose-600 font-mono">-{totalOut.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">Stock deductions</span>
            </div>
          </div>

          {/* Dynamic Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter Transaction Ledger</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {/* Item Search */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item</label>
                <input
                  type="text"
                  list="ledger-items-list"
                  placeholder="Search Item..."
                  value={filterItem === "All" ? "" : filterItem}
                  onChange={(e) => setFilterItem(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="ledger-items-list">
                  {items.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>

              {/* Store */}
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

              {/* Transaction Type */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Tx Type (11)</label>
                <select
                  value={filterTxType}
                  onChange={(e) => setFilterTxType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Types</option>
                  {transactionTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Ref No */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Ref No.</label>
                <input
                  type="text"
                  placeholder="e.g. MRR-..."
                  value={filterRefNo}
                  onChange={(e) => setFilterRefNo(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* Batch */}
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

              {/* Location */}
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

              {/* From Date */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* To Date */}
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

          {/* Ledger Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Transaction Type</th>
                    <th className="py-2.5 px-3">Reference No.</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">In Qty</th>
                    <th className="py-2.5 px-3 text-right">Out Qty</th>
                    <th className="py-2.5 px-3 text-right font-bold text-primary">Balance</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-muted-foreground">
                        No transactions found matching the filter parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedTxModal(row)}
                        className="hover:bg-muted/40 cursor-pointer transition"
                      >
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.date}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.inQty > 0
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : row.outQty > 0
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                            }`}
                          >
                            {row.transactionType}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-primary whitespace-nowrap">
                          {row.referenceNo}
                        </td>
                        <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                          {row.itemName}
                        </td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.store}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">
                          {row.batch || "-"}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground font-mono text-[11px]">
                          {row.location || "-"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {row.inQty > 0 ? `+${row.inQty.toLocaleString()}` : "-"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-rose-500">
                          {row.outQty > 0 ? `-${row.outQty.toLocaleString()}` : "-"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-primary text-sm">
                          {row.balance.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTxModal(row);
                            }}
                            className="p-1 rounded-md hover:bg-muted text-primary cursor-pointer transition"
                            title="View Transaction Details"
                          >
                            <Eye className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filteredRows.length > 0 && (
                  <tfoot className="bg-primary/10 text-foreground font-black border-t-2 border-primary/30 sticky bottom-0">
                    <tr>
                      <td colSpan={7} className="py-3 px-3 text-right text-xs uppercase tracking-wider text-primary">
                        TOTAL LEDGER MOVEMENTS:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        +{totalIn.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-bold text-rose-500">
                        -{totalOut.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm text-primary font-black">
                        {(filteredRows[filteredRows.length - 1]?.balance ?? 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center text-[10px] text-muted-foreground font-normal">
                        {filteredRows.length} Entries
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border text-xs text-muted-foreground">
              <div>
                Showing <span className="font-bold text-foreground">{filteredRows.length}</span> ledger vouchers between {fromDate} and {toDate}.
              </div>
              <div className="text-[11px] font-mono">
                Click any line to inspect full voucher details.
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Transaction Voucher — {selectedTxModal.referenceNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTxModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Transaction Type</span>
                  <p className="font-bold text-primary text-xs mt-0.5">{selectedTxModal.transactionType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Date</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedTxModal.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Description</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedTxModal.itemName} ({selectedTxModal.itemCode})</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Store & Location</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedTxModal.store} / {selectedTxModal.location || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Inflow Qty</span>
                  <p className="text-base font-bold text-emerald-600 mt-1 font-mono">
                    {selectedTxModal.inQty > 0 ? `+${selectedTxModal.inQty}` : "-"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <span className="text-[10px] text-rose-600 font-bold uppercase">Outflow Qty</span>
                  <p className="text-base font-bold text-rose-600 mt-1 font-mono">
                    {selectedTxModal.outQty > 0 ? `-${selectedTxModal.outQty}` : "-"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5">
                  <span className="text-[10px] text-primary font-bold uppercase">Resulting Balance</span>
                  <p className="text-base font-bold text-primary mt-1 font-mono">
                    {selectedTxModal.balance}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Audit Remarks / Narrative</span>
                <p className="text-foreground text-xs">{selectedTxModal.remarks || "Standard inventory transaction entry"}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedTxModal(null)}
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
