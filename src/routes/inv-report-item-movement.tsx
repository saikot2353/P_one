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
  GitCommit,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_MOVEMENT_DATA,
  ItemMovementRow,
} from "@/lib/reports-mock-data";
import { formatAmount } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-item-movement")({
  head: () => ({
    meta: [
      { title: "Item Movement Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Trace material journey from originating store to receiving points with comprehensive movement timeline.",
      },
    ],
  }),
  component: ItemMovementRegisterPage,
});

export function ItemMovementRegisterPage() {
  // Filters
  const [filterItem, setFilterItem] = useState("All");
  const [filterFromStore, setFilterFromStore] = useState("All");
  const [filterToStore, setFilterToStore] = useState("All");
  const [filterTxType, setFilterTxType] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-10-31");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedTimelineMovement, setSelectedTimelineMovement] = useState<ItemMovementRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Filter options
  const items = useMemo(
    () => Array.from(new Set(INITIAL_MOVEMENT_DATA.map((m) => m.itemName))),
    []
  );
  const stores = useMemo(() => {
    const froms = INITIAL_MOVEMENT_DATA.map((m) => m.fromStore);
    const tos = INITIAL_MOVEMENT_DATA.map((m) => m.toStore);
    return Array.from(new Set([...froms, ...tos]));
  }, []);

  const filteredRows = useMemo(() => {
    return INITIAL_MOVEMENT_DATA.filter((row) => {
      if (filterItem.trim() && filterItem !== "All") {
        const q = filterItem.toLowerCase().trim();
        if (!row.itemName.toLowerCase().includes(q) && !row.itemCode.toLowerCase().includes(q)) return false;
      }
      if (filterTxType !== "All" && row.transaction !== filterTxType) return false;
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
          row.itemName.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterItem,
    filterTxType,
    filterBatch,
    filterLocation,
    fromDate,
    toDate,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setFilterItem("All");
    setFilterFromStore("All");
    setFilterToStore("All");
    setFilterTxType("All");
    setFilterBatch("");
    setFilterLocation("");
    setFromDate("2026-09-01");
    setToDate("2026-10-31");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Item Code",
      "Item Name",
      "Transaction",
      "Reference",
      "From Store",
      "To Store",
      "Batch",
      "Location",
      "Quantity",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.itemCode,
      r.itemName,
      r.transaction,
      r.reference,
      r.fromStore,
      r.toStore,
      r.batch,
      r.location,
      r.quantity,
      r.status,
    ]);

    exportToCSV(`Item_Movement_Register_${fromDate}_to_${toDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Date",
      "Item Code",
      "Item Name",
      "Transaction",
      "Reference",
      "From Store",
      "To Store",
      "Batch",
      "Location",
      "Quantity",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.date,
      r.itemCode,
      r.itemName,
      r.transaction,
      r.reference,
      r.fromStore,
      r.toStore,
      r.batch,
      r.location,
      r.quantity,
      r.status,
    ]);

    const totalQty = filteredRows.reduce((s, r) => s + r.quantity, 0);

    exportToExcel(
      `Item_Movement_Register_${fromDate}_to_${toDate}.xls`,
      "Item Movement Register",
      headers,
      rows,
      [{ label: "Total Transferred / Issued Quantity", value: totalQty.toLocaleString() }]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Date",
      "Item",
      "Transaction",
      "Reference",
      "From Store",
      "To Store",
      "Qty",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.date,
      `${r.itemName} (${r.itemCode})`,
      r.transaction,
      r.reference,
      r.fromStore,
      r.toStore,
      r.quantity,
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "ITEM MOVEMENT REGISTER",
      documentNumber: `MOV-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Internal Logistics & Store Operations",
      metadata: [
        { label: "Date Range", value: `${fromDate} to ${toDate}` },
        { label: "Total Movements", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Quantity Moved", value: filteredRows.reduce((s, r) => s + r.quantity, 0).toLocaleString() },
      ],
      signatures: [
        { role: "Logistics Controller", name: "Dispatcher Officer" },
        { role: "Receiving Store", name: "Floor Store Supervisor" },
        { role: "Security Gate Pass", name: "Chief Security Officer" },
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
                  Item Movement Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Stock Transfer & Flow Track
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track where inventory moved from, where it moved to, and full physical touchpoint timelines.
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
                <span>Filter Movement Trails</span>
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
                <input
                  type="text"
                  list="movement-items-list"
                  placeholder="Search item name/code..."
                  value={filterItem === "All" ? "" : filterItem}
                  onChange={(e) => setFilterItem(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="movement-items-list">
                  {items.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Transaction</label>
                <select
                  value={filterTxType}
                  onChange={(e) => setFilterTxType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Material Issue">Material Issue</option>
                  <option value="Inter-Company Transfer">Inter-Company Transfer</option>
                  <option value="Return to Store">Return to Store</option>
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
              <table className="w-full text-xs text-left border-collapse min-w-[900px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">Transaction</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No item movement records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.date}</td>
                        <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            {row.transaction}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-primary whitespace-nowrap">
                          {row.reference}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">
                          {row.batch || "-"}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground font-mono text-[11px]">
                          {row.location || "-"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-foreground">
                          {row.quantity.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-muted/60 font-semibold border-t border-border sticky bottom-0">
                  <tr>
                    <td colSpan={6} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px] text-muted-foreground font-bold">
                      Total Quantity
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-foreground">
                      {filteredRows.reduce((s, r) => s + r.quantity, 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Movement Timeline Modal */}
      {selectedTimelineMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Movement Timeline — {selectedTimelineMovement.reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTimelineMovement(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item & Quantity</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">
                    {selectedTimelineMovement.itemName} ({selectedTimelineMovement.quantity} units)
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Origin → Destination</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">
                    {selectedTimelineMovement.fromStore} → {selectedTimelineMovement.toStore}
                  </p>
                </div>
              </div>

              {/* Vertical Stepper Timeline as requested: Central Store ↓ Rack-A-01 ↓ Material Issue ↓ Department Store ↓ Return to Store ↓ Central Store */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/30">
                {selectedTimelineMovement.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <span className="absolute -left-6 top-0.5 size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] font-bold">
                      {idx + 1}
                    </span>
                    <div className="bg-muted/40 border border-border/60 rounded-xl p-2.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs">{step.stage}</span>
                        <span className="text-[10.5px] font-mono text-muted-foreground">{step.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="size-3 text-primary" /> {step.locationOrStore}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedTimelineMovement(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Close Timeline
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
