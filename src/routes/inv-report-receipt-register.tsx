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
  ArrowDownLeft,
  Calendar,
  X,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_RECEIPT_REGISTER_DATA,
  ItemReceiptRow,
  ReceiptSourceType,
} from "@/lib/reports-mock-data";
import { formatAmount } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-receipt-register")({
  head: () => ({
    meta: [
      { title: "Item Receipt Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Consolidated register of all incoming inventory across MRR, direct purchases, transfer receiving, store returns, opening stock, and positive adjustments.",
      },
    ],
  }),
  component: ItemReceiptRegisterPage,
});

export function ItemReceiptRegisterPage() {
  // Filters
  const [filterItem, setFilterItem] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterReceiptType, setFilterReceiptType] = useState<string>("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-10-31");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedReceiptModal, setSelectedReceiptModal] = useState<ItemReceiptRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  const receiptTypes: ReceiptSourceType[] = [
    "Material Receipt",
    "Direct Receipt",
    "Transfer Receive",
    "Store Return Receive",
    "Opening Stock",
    "Adjustment +",
  ];

  const items = useMemo(
    () => Array.from(new Set(INITIAL_RECEIPT_REGISTER_DATA.map((r) => r.itemName))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_RECEIPT_REGISTER_DATA.map((r) => r.store))),
    []
  );
  const suppliers = useMemo(
    () => Array.from(new Set(INITIAL_RECEIPT_REGISTER_DATA.map((r) => r.supplier))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_RECEIPT_REGISTER_DATA.filter((row) => {
      if (filterItem.trim() && filterItem !== "All") {
        const q = filterItem.toLowerCase().trim();
        if (!row.itemName.toLowerCase().includes(q) && !row.itemCode.toLowerCase().includes(q)) return false;
      }
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterSupplier !== "All" && row.supplier !== filterSupplier) return false;
      if (filterReceiptType !== "All" && row.receiptType !== filterReceiptType) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;

      if (fromDate && row.date < fromDate) return false;
      if (toDate && row.date > toDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.reference.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.supplier.toLowerCase().includes(q) ||
          row.store.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [filterItem, filterStore, filterSupplier, filterReceiptType, filterBatch, fromDate, toDate, searchQuery]);

  const totalQty = useMemo(() => filteredRows.reduce((s, r) => s + r.quantity, 0), [filteredRows]);
  const totalVal = useMemo(() => filteredRows.reduce((s, r) => s + r.quantity * (r.unitPrice || 0), 0), [filteredRows]);

  const handleResetFilters = () => {
    setFilterItem("All");
    setFilterStore("All");
    setFilterSupplier("All");
    setFilterReceiptType("All");
    setFilterBatch("");
    setFromDate("2026-09-01");
    setToDate("2026-10-31");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Receipt Type",
      "Reference",
      "Supplier / Source",
      "Store",
      "Item Code",
      "Item Name",
      "Batch",
      "Location",
      "Quantity",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.receiptType,
      r.reference,
      r.supplier,
      r.store,
      r.itemCode,
      r.itemName,
      r.batch,
      r.location,
      r.quantity,
      r.status,
    ]);

    exportToCSV(`Item_Receipt_Register_${fromDate}_to_${toDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Date",
      "Receipt Type",
      "Reference",
      "Supplier / Source",
      "Store",
      "Item Code",
      "Item Name",
      "Batch",
      "Location",
      "Quantity",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.receiptType,
      r.reference,
      r.supplier,
      r.store,
      r.itemCode,
      r.itemName,
      r.batch,
      r.location,
      r.quantity,
      r.status,
    ]);

    exportToExcel(
      `Item_Receipt_Register_${fromDate}_to_${toDate}.xls`,
      "Item Receipt Register",
      headers,
      rows,
      [{ label: "Total Quantity Received", value: totalQty.toLocaleString() }]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Date",
      "Type",
      "Reference",
      "Supplier / Source",
      "Store",
      "Item",
      "Qty",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.date,
      r.receiptType,
      r.reference,
      r.supplier,
      r.store,
      `${r.itemName} (${r.itemCode})`,
      r.quantity,
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "ITEM RECEIPT REGISTER",
      documentNumber: `REC-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Material Inward & Store Receiving",
      metadata: [
        { label: "Date Range", value: `${fromDate} to ${toDate}` },
        { label: "Total Receipts", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [{ label: "Total Inward Quantity", value: totalQty.toLocaleString(), highlight: true }],
      signatures: [
        { role: "Receiving In-Charge", name: "Store QA Officer" },
        { role: "Audit Verification", name: "Internal Audit" },
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
                  Item Receipt Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  All Inward Transactions
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Consolidated registry of all receipts across MRRs, direct receives, transfers, returns, and positive adjustments.
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
                <span>Filter Inward Receipts</span>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item</label>
                <input
                  type="text"
                  list="receipt-items-list"
                  placeholder="Search item name/code..."
                  value={filterItem === "All" ? "" : filterItem}
                  onChange={(e) => setFilterItem(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="receipt-items-list">
                  {items.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Supplier / Source</label>
                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Sources</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Receipt Type (6)</label>
                <select
                  value={filterReceiptType}
                  onChange={(e) => setFilterReceiptType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All 6 Types</option>
                  {receiptTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
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
                    <th className="py-2.5 px-3">Receipt Type</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Supplier / Source</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Value (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-muted-foreground">
                        No inward receipts found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.date}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {row.receiptType}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-primary whitespace-nowrap">
                          {row.reference}
                        </td>
                        <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                          {row.supplier}
                        </td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.store}</td>
                        <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">{row.batch || "-"}</td>
                        <td className="py-2 px-3 text-muted-foreground font-mono text-[11px]">{row.location || "-"}</td>
                        <td className="py-2 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                          +{row.quantity.toLocaleString()} {row.uom}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                          ৳{formatAmount(row.quantity * (row.unitPrice || 0))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-muted/60 font-semibold border-t border-border sticky bottom-0">
                  <tr>
                    <td colSpan={8} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px] text-muted-foreground font-bold">
                      Total
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {totalQty.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-foreground">
                      ৳{formatAmount(totalVal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Receipt Modal */}
      {selectedReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="size-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-foreground">
                  Receipt Voucher — {selectedReceiptModal.reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceiptModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Source / Type</span>
                  <p className="font-bold text-primary text-xs mt-0.5">{selectedReceiptModal.receiptType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Receipt Date</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedReceiptModal.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Supplier / Sender</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedReceiptModal.supplier}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Target Store</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedReceiptModal.store}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Received</span>
                  <p className="font-bold text-foreground text-sm mt-0.5">{selectedReceiptModal.itemName}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">Code: {selectedReceiptModal.itemCode}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Received Qty</span>
                  <p className="font-black font-mono text-base text-emerald-600">
                    +{selectedReceiptModal.quantity} {selectedReceiptModal.uom}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedReceiptModal(null)}
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
