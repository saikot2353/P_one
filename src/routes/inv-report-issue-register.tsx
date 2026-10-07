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
  ArrowUpRight,
  Calendar,
  X,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_ISSUE_REGISTER_DATA,
  ItemIssueRow,
  IssueSourceType,
} from "@/lib/reports-mock-data";
import { formatAmount } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-issue-register")({
  head: () => ({
    meta: [
      { title: "Item Issue Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Consolidated register of all outgoing inventory across material issues, supplier returns, transfers out, write-offs, and negative adjustments.",
      },
    ],
  }),
  component: ItemIssueRegisterPage,
});

export function ItemIssueRegisterPage() {
  // Filters
  const [filterItem, setFilterItem] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterIssueType, setFilterIssueType] = useState<string>("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [fromDate, setFromDate] = useState("2026-08-01");
  const [toDate, setToDate] = useState("2026-10-31");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedIssueModal, setSelectedIssueModal] = useState<ItemIssueRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  const issueTypes: IssueSourceType[] = [
    "Material Issue",
    "Supplier Return",
    "Transfer Out",
    "Write-Off",
    "Adjustment -",
  ];

  const items = useMemo(
    () => Array.from(new Set(INITIAL_ISSUE_REGISTER_DATA.map((i) => i.itemName))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_ISSUE_REGISTER_DATA.map((i) => i.store))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_ISSUE_REGISTER_DATA.filter((row) => {
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterIssueType !== "All" && row.issueType !== filterIssueType) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;
      if (filterLocation.trim() && !row.location.toLowerCase().includes(filterLocation.toLowerCase().trim()))
        return false;

      if (fromDate && row.date < fromDate) return false;
      if (toDate && row.date > toDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.reference.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.issuedTo.toLowerCase().includes(q) ||
          row.store.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [filterItem, filterStore, filterIssueType, filterBatch, filterLocation, fromDate, toDate, searchQuery]);

  const totalQty = useMemo(() => filteredRows.reduce((s, r) => s + r.quantity, 0), [filteredRows]);

  const handleResetFilters = () => {
    setFilterItem("All");
    setFilterStore("All");
    setFilterIssueType("All");
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
      "Issue Type",
      "Reference",
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "Location",
      "Quantity",
      "Issued To",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.issueType,
      r.reference,
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.location,
      r.quantity,
      r.issuedTo,
      r.status,
    ]);

    exportToCSV(`Item_Issue_Register_${fromDate}_to_${toDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Date",
      "Issue Type",
      "Reference",
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "Location",
      "Quantity",
      "Issued To",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.issueType,
      r.reference,
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.location,
      r.quantity,
      r.issuedTo,
      r.status,
    ]);

    exportToExcel(
      `Item_Issue_Register_${fromDate}_to_${toDate}.xls`,
      "Item Issue Register",
      headers,
      rows,
      [{ label: "Total Quantity Issued", value: totalQty.toLocaleString() }]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Date",
      "Type",
      "Reference",
      "Item",
      "Store",
      "Qty",
      "Issued To",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.date,
      r.issueType,
      r.reference,
      `${r.itemName} (${r.itemCode})`,
      r.store,
      r.quantity,
      r.issuedTo,
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "ITEM ISSUE REGISTER",
      documentNumber: `ISS-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Material Outward & Store Issuance",
      metadata: [
        { label: "Date Range", value: `${fromDate} to ${toDate}` },
        { label: "Total Issues", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [{ label: "Total Outward Quantity", value: totalQty.toLocaleString(), highlight: true }],
      signatures: [
        { role: "Store Issuer", name: "Floor Dispatcher" },
        { role: "Inventory Controller", name: "Audit Lead" },
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
                  Item Issue Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  All Outward Transactions
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Consolidated registry of all deductions across production issues, supplier returns, transfers out, write-offs, and adjustments.
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
                <span>Filter Outward Issues</span>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Issue Type (5)</label>
                <select
                  value={filterIssueType}
                  onChange={(e) => setFilterIssueType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All 5 Types</option>
                  {issueTypes.map((t) => (
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
                    <th className="py-2.5 px-3">Issue Type</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3">Issued To</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-muted-foreground">
                        No issue records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.date}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            {row.issueType}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-primary whitespace-nowrap">
                          {row.reference}
                        </td>
                        <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.store}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">{row.batch || "-"}</td>
                        <td className="py-2 px-3 text-muted-foreground font-mono text-[11px]">{row.location || "-"}</td>
                        <td className="py-2 px-3 text-right font-mono font-black text-rose-500">
                          -{row.quantity.toLocaleString()} {row.uom}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground max-w-[200px] truncate" title={row.issuedTo}>
                          {row.issuedTo}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setSelectedIssueModal(row)}
                            className="p-1 rounded-md hover:bg-muted text-primary cursor-pointer transition"
                            title="View Issue Voucher"
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

      {/* Issue Modal */}
      {selectedIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="size-4 text-rose-500" />
                <h3 className="font-bold text-sm text-foreground">
                  Issue Voucher — {selectedIssueModal.reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIssueModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Issue Type</span>
                  <p className="font-bold text-primary text-xs mt-0.5">{selectedIssueModal.issueType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Issue Date</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedIssueModal.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Issued From Store</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedIssueModal.store}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Issued To Recipient</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedIssueModal.issuedTo}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Deducted</span>
                  <p className="font-bold text-foreground text-sm mt-0.5">{selectedIssueModal.itemName}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">Code: {selectedIssueModal.itemCode}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Deducted Qty</span>
                  <p className="font-black font-mono text-base text-rose-600">
                    -{selectedIssueModal.quantity} {selectedIssueModal.uom}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedIssueModal(null)}
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
