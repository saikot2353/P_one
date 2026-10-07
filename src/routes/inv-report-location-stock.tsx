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
  MapPin,
  ChevronRight,
  Layers,
  Building2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_LOCATION_STOCK_DATA,
  LocationStockRow,
} from "@/lib/reports-mock-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-location-stock")({
  head: () => ({
    meta: [
      { title: "Location Stock Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Rack, shelf, bin, and floor-wise inventory breakdown with physical location hierarchies and stock valuation.",
      },
    ],
  }),
  component: LocationStockRegisterPage,
});

export function LocationStockRegisterPage() {
  const currencyCfg = getActiveCurrencyConfig();

  // Filters
  const [filterStore, setFilterStore] = useState("All");
  const [filterLocationType, setFilterLocationType] = useState("All");
  const [filterItem, setFilterItem] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedLocationDrilldown, setSelectedLocationDrilldown] = useState<LocationStockRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Filter options
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_LOCATION_STOCK_DATA.map((l) => l.store))),
    []
  );
  const items = useMemo(
    () => Array.from(new Set(INITIAL_LOCATION_STOCK_DATA.map((l) => l.itemName))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_LOCATION_STOCK_DATA.filter((row) => {
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterLocationType !== "All" && row.locationType !== filterLocationType) return false;
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.locationCode.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.rack.toLowerCase().includes(q) ||
          row.shelf.toLowerCase().includes(q) ||
          row.bin.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [filterStore, filterLocationType, filterItem, filterBatch, searchQuery]);

  const totalQty = useMemo(() => filteredRows.reduce((s, r) => s + r.quantity, 0), [filteredRows]);
  const totalVal = useMemo(() => filteredRows.reduce((s, r) => s + r.stockValue, 0), [filteredRows]);

  const handleResetFilters = () => {
    setFilterStore("All");
    setFilterLocationType("All");
    setFilterItem("All");
    setFilterBatch("");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Store",
      "Location Code",
      "Rack",
      "Shelf",
      "Bin",
      "Item Code",
      "Item Name",
      "Batch",
      "UOM",
      "Quantity",
      "Unit Cost",
      "Stock Value",
    ];

    const rows = filteredRows.map((r) => [
      r.store,
      r.locationCode,
      r.rack,
      r.shelf,
      r.bin,
      r.itemCode,
      r.itemName,
      r.batch,
      r.uom,
      r.quantity,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
    ]);

    exportToCSV("Location_Stock_Register.csv", headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Store",
      "Location Code",
      "Rack",
      "Shelf",
      "Bin",
      "Item Code",
      "Item Name",
      "Batch",
      "UOM",
      "Quantity",
      "Unit Cost",
      "Stock Value",
    ];

    const rows = filteredRows.map((r) => [
      r.store,
      r.locationCode,
      r.rack,
      r.shelf,
      r.bin,
      r.itemCode,
      r.itemName,
      r.batch,
      r.uom,
      r.quantity,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
    ]);

    exportToExcel(
      "Location_Stock_Register.xls",
      "Location Stock Register",
      headers,
      rows,
      [
        { label: "Total Quantity", value: totalQty.toLocaleString() },
        { label: "Total Stock Value", value: formatAmount(totalVal, undefined, true) },
      ]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Store",
      "Rack / Shelf / Bin",
      "Item Name",
      "UOM",
      "Quantity",
      "Stock Value",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.store,
      `${r.rack} > ${r.shelf} > ${r.bin}`,
      `${r.itemName} (${r.itemCode})`,
      r.uom,
      r.quantity,
      formatAmount(r.stockValue),
    ]);

    setPdfReportData({
      reportTitle: "LOCATION STOCK REGISTER",
      documentNumber: `LOC-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: "Pakiza Group of Industries",
      department: "Warehouse & Physical Location Storage",
      metadata: [
        { label: "Store Filter", value: filterStore },
        { label: "Location Type", value: filterLocationType },
        { label: "Total Locations", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Bin Qty", value: totalQty.toLocaleString() },
        { label: "Total Value", value: formatAmount(totalVal, undefined, true), isTotal: true, highlight: true },
      ],
      signatures: [
        { role: "Warehouse Bin In-Charge", name: "Location Controller" },
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
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Location Stock Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Rack / Shelf / Bin Breakdown
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect physical storage addresses, hierarchical bin occupancies, and location stock values.
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

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Active Storage Locations</span>
              <p className="text-lg font-bold mt-1 text-foreground">{filteredRows.length} Bins / Slots</p>
              <span className="text-[10px] text-muted-foreground">Mapped storage</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Total Units in Bins</span>
              <p className="text-lg font-bold mt-1 text-foreground font-mono">{totalQty.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-600 font-medium">Physical inventory</span>
            </div>
            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 shadow-xs">
              <span className="text-[11px] font-medium text-primary">Bin Stock Valuation</span>
              <p className="text-lg font-bold mt-1 text-primary font-mono">{formatAmount(totalVal, undefined, true)}</p>
              <span className="text-[10px] text-muted-foreground">{currencyCfg.format}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Location Hierarchy</span>
              <p className="text-lg font-bold mt-1 text-foreground">Store &gt; Rack &gt; Shelf &gt; Bin</p>
              <span className="text-[10px] text-muted-foreground">Full drilldown supported</span>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter Storage Addresses</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Location Type</label>
                <select
                  value={filterLocationType}
                  onChange={(e) => setFilterLocationType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Rack">Rack</option>
                  <option value="Shelf">Shelf</option>
                  <option value="Bin">Bin</option>
                  <option value="Floor">Floor</option>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Quick Search</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    placeholder="Search rack, shelf, bin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-7 pr-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                  />
                  <Search className="size-3.5 absolute left-2 top-2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1100px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Location Hierarchy</th>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">UOM</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Stock Value</th>
                    <th className="py-2.5 px-3 text-center">Drill-down</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No location stock records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">{row.store}</td>
                        <td className="py-2 px-3">
                          <span className="font-mono text-primary font-semibold flex items-center gap-1">
                            <MapPin className="size-3 text-primary" />
                            {row.rack} &gt; {row.shelf} &gt; {row.bin}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">[{row.locationCode}]</span>
                        </td>
                        <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">{row.batch}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.uom}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                          {row.quantity.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-primary">
                          {formatAmount(row.stockValue)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setSelectedLocationDrilldown(row)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition cursor-pointer"
                          >
                            <Layers className="size-3" />
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

      {/* Location Drill-down Modal as requested: Store ↓ Rack ↓ Shelf ↓ Bin ↓ Item ↓ Batch */}
      {selectedLocationDrilldown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Location Hierarchy Drill-down
                </h3>
              </div>
              <button
                onClick={() => setSelectedLocationDrilldown(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wide">
                  Physical Storage Tree:
                </h4>
                <div className="space-y-1 pl-2 font-mono text-[11px] text-foreground">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span className="size-2 rounded-full bg-primary" />
                    <span>Store: {selectedLocationDrilldown.store}</span>
                  </div>
                  <div className="pl-4 flex items-center gap-2 text-muted-foreground">
                    <span>↓ Rack:</span> <span className="font-bold text-foreground">{selectedLocationDrilldown.rack}</span>
                  </div>
                  <div className="pl-8 flex items-center gap-2 text-muted-foreground">
                    <span>↓ Shelf:</span> <span className="font-bold text-foreground">{selectedLocationDrilldown.shelf}</span>
                  </div>
                  <div className="pl-12 flex items-center gap-2 text-muted-foreground">
                    <span>↓ Bin:</span> <span className="font-bold text-primary font-bold">{selectedLocationDrilldown.bin} ({selectedLocationDrilldown.locationCode})</span>
                  </div>
                  <div className="pl-16 flex items-center gap-2 text-emerald-600 font-semibold">
                    <span>↓ Item:</span> <span>{selectedLocationDrilldown.itemName} [{selectedLocationDrilldown.itemCode}]</span>
                  </div>
                  <div className="pl-20 flex items-center gap-2 text-purple-600 font-semibold">
                    <span>↓ Batch:</span> <span>{selectedLocationDrilldown.batch}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex justify-between">
                <div>
                  <span className="text-muted-foreground">Physical Qty:</span>
                  <p className="font-bold font-mono text-sm text-foreground">{selectedLocationDrilldown.quantity} {selectedLocationDrilldown.uom}</p>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">Stock Valuation:</span>
                  <p className="font-bold font-mono text-sm text-primary">{formatAmount(selectedLocationDrilldown.stockValue, undefined, true)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedLocationDrilldown(null)}
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
