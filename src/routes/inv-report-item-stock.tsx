import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
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
  Package,
  Layers,
  ArrowRight,
  TrendingDown,
  Building2,
  Calendar,
  X,
  History,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_STOCK_BALANCE_DATA,
  ItemStockBreakdownRow,
  INITIAL_LEDGER_DATA,
} from "@/lib/reports-mock-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-item-stock")({
  head: () => ({
    meta: [
      { title: "Item Stock Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Single item focal register showing stock summary, store-wise and batch-wise breakdowns, and drilldowns to transaction history.",
      },
    ],
  }),
  component: ItemStockRegisterPage,
});

export function ItemStockRegisterPage() {
  const navigate = useNavigate();
  const searchParams = (useSearch({ strict: false }) as any) || {};
  const currencyCfg = getActiveCurrencyConfig();

  // Active Selected Item
  const [selectedItemCode, setSelectedItemCode] = useState<string>(() => {
    return searchParams.item || INITIAL_STOCK_BALANCE_DATA[0].itemCode;
  });

  // Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterFromDate, setFilterFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  });
  const [filterToDate, setFilterToDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Item Search Modal
  const [isItemSearchModalOpen, setIsItemSearchModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");

  // Drilldown Modal
  const [selectedDrilldownBatch, setSelectedDrilldownBatch] = useState<ItemStockBreakdownRow | null>(null);

  // PDF Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Match current active item
  const activeItem = useMemo(() => {
    return (
      INITIAL_STOCK_BALANCE_DATA.find((i) => i.itemCode === selectedItemCode) ||
      INITIAL_STOCK_BALANCE_DATA[0]
    );
  }, [selectedItemCode]);

  // Stock Summary Metrics
  const stockSummary = useMemo(() => {
    const isYarn = activeItem.itemCode.includes("YRN");
    const isChair = activeItem.itemCode.includes("ITM");
    const isDye = activeItem.itemCode.includes("CHM");

    if (isYarn) {
      return {
        openingStock: 3360,
        totalReceived: 3500,
        totalIssued: 1600,
        transferIn: 1000,
        transferOut: 500,
        returns: 200,
        adjustments: 40,
        writeOff: 0,
        currentStock: 5500,
      };
    } else if (isChair) {
      return {
        openingStock: 15,
        totalReceived: 18,
        totalIssued: 10,
        transferIn: 5,
        transferOut: 2,
        returns: 1,
        adjustments: 2,
        writeOff: 0,
        currentStock: 25,
      };
    } else if (isDye) {
      return {
        openingStock: 950,
        totalReceived: 600,
        totalIssued: 350,
        transferIn: 0,
        transferOut: 300,
        returns: 0,
        adjustments: -15,
        writeOff: 25,
        currentStock: 1025,
      };
    }

    return {
      openingStock: 200,
      totalReceived: 300,
      totalIssued: 150,
      transferIn: 50,
      transferOut: 20,
      returns: 10,
      adjustments: 5,
      writeOff: 0,
      currentStock: 395,
    };
  }, [activeItem]);

  // Stock Breakdown Table
  const rawBreakdown: ItemStockBreakdownRow[] = useMemo(() => {
    if (activeItem.itemCode.includes("YRN")) {
      return [
        {
          store: "Yarn Store (PKCL)",
          location: "Row-A / Pallet-01",
          batch: "BAT-YRN-2610-01",
          opening: 2500,
          inQty: 2500,
          outQty: 800,
          balance: 4200,
        },
        {
          store: "Yarn Store (PKCL)",
          location: "Row-A / Pallet-02",
          batch: "BAT-YRN-2609-03",
          opening: 860,
          inQty: 1000,
          outQty: 560,
          balance: 1300,
        },
      ];
    } else if (activeItem.itemCode.includes("CHM")) {
      return [
        {
          store: "Chemical Store",
          location: "Drum Rack C-12",
          batch: "BAT-DYE-2609-04",
          opening: 700,
          inQty: 500,
          outQty: 350,
          balance: 850,
        },
        {
          store: "Chemical Store",
          location: "Drum Rack C-14",
          batch: "BAT-DYE-2608-01",
          opening: 250,
          inQty: 100,
          outQty: 175,
          balance: 175,
        },
      ];
    } else {
      return [
        {
          store: "Central Warehouse (Savar)",
          location: activeItem.location || "Rack-01 / Shelf-A / Bin-04",
          batch: activeItem.batch || "-",
          opening: 15,
          inQty: 18,
          outQty: 8,
          balance: activeItem.totalQty,
        },
      ];
    }
  }, [activeItem]);

  // Filtered breakdown
  const filteredBreakdown = useMemo(() => {
    return rawBreakdown.filter((row) => {
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterLocation.trim() && !row.location.toLowerCase().includes(filterLocation.toLowerCase().trim()))
        return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;
      return true;
    });
  }, [rawBreakdown, filterStore, filterLocation, filterBatch]);

  // Drilldown transactions for the selected batch filtered by From/To date
  const drilldownTransactions = useMemo(() => {
    if (!selectedDrilldownBatch) return [];
    return INITIAL_LEDGER_DATA.filter((l) => {
      if (l.itemCode !== activeItem.itemCode) return false;
      if (filterFromDate && l.date < filterFromDate) return false;
      if (filterToDate && l.date > filterToDate) return false;
      return true;
    });
  }, [selectedDrilldownBatch, activeItem, filterFromDate, filterToDate]);

  const handleExportCSV = () => {
    const headers = ["Store", "Location", "Batch", "Opening", "In Qty", "Out Qty", "Balance"];
    const rows = filteredBreakdown.map((r) => [
      r.store,
      r.location,
      r.batch,
      r.opening,
      r.inQty,
      r.outQty,
      r.balance,
    ]);

    exportToCSV(
      `Item_Stock_Register_${activeItem.itemCode}_${filterFromDate}_to_${filterToDate}.csv`,
      headers,
      rows
    );
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = ["Store", "Location", "Batch", "Opening", "In Qty", "Out Qty", "Balance"];
    const rows = filteredBreakdown.map((r) => [
      r.store,
      r.location,
      r.batch,
      r.opening,
      r.inQty,
      r.outQty,
      r.balance,
    ]);

    const subtotals = [
      { label: "Current Balance", value: stockSummary.currentStock },
      { label: "Stock Valuation", value: formatAmount(stockSummary.currentStock * activeItem.unitCost, undefined, true) },
    ];

    exportToExcel(
      `Item_Stock_Register_${activeItem.itemCode}_${filterFromDate}_to_${filterToDate}.xls`,
      `Item Stock Register: ${activeItem.itemName} (${activeItem.itemCode}) [${filterFromDate} to ${filterToDate}]`,
      headers,
      rows,
      subtotals
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = ["Store", "Location", "Batch", "Opening", "In Qty", "Out Qty", "Balance"];
    const tableRows = filteredBreakdown.map((r) => [
      r.store,
      r.location,
      r.batch,
      r.opening,
      r.inQty,
      r.outQty,
      r.balance,
    ]);

    setPdfReportData({
      reportTitle: `ITEM STOCK REGISTER — ${activeItem.itemCode}`,
      documentNumber: `ITEM-STK-${activeItem.itemCode}`,
      reportDate: `${filterFromDate} to ${filterToDate}`,
      companyName: activeItem.company,
      department: "Central Inventory Management",
      metadata: [
        { label: "Date Range", value: `${filterFromDate} to ${filterToDate}`, highlight: true },
        { label: "Item Name", value: activeItem.itemName },
        { label: "Specification", value: activeItem.specification },
        { label: "UOM", value: activeItem.uom },
        { label: "Tracking Mode", value: activeItem.trackingType === "Batch" ? "B (Batch)" : "L (Location)" },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Current Stock", value: stockSummary.currentStock },
        { label: "Unit Cost", value: formatAmount(activeItem.unitCost, undefined, true) },
        {
          label: "Total Valuation",
          value: formatAmount(stockSummary.currentStock * activeItem.unitCost, undefined, true),
          isTotal: true,
          highlight: true,
        },
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
                  Item Stock Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Item Focal Register
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete focal ledger of a single product with storage partitions, inflows/outflows, and audit trail.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsItemSearchModalOpen(true)}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition cursor-pointer shadow-xs"
              >
                <Search className="size-3.5" />
                <span>Search Item</span>
              </button>
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

          {/* Item Summary Card */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                <div>
                  <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                    {activeItem.itemName}
                    <span className="font-mono text-xs text-primary font-normal">
                      [{activeItem.itemCode}]
                    </span>
                    {activeItem.trackingType === "Batch" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        B
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        L
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeItem.specification}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsItemSearchModalOpen(true)}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                Switch Item <ArrowRight className="size-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 border-t border-primary/10 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Brand</span>
                <p className="font-semibold text-foreground">{activeItem.brand}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Origin</span>
                <p className="font-semibold text-foreground">{activeItem.origin}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">UOM</span>
                <p className="font-semibold text-foreground">{activeItem.uom}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Unit Cost</span>
                <p className="font-mono font-semibold text-foreground">{formatAmount(activeItem.unitCost, undefined, true)}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Group</span>
                <p className="font-semibold text-foreground">{activeItem.itemGroup}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Category</span>
                <p className="font-semibold text-foreground">{activeItem.itemCategory}</p>
              </div>
            </div>
          </div>

          {/* Stock Summary Metrics (9 metrics) */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            <div className="p-2.5 rounded-xl border border-border/70 bg-card text-center">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Opening Stock</span>
              <p className="text-sm font-bold font-mono mt-1 text-foreground">{stockSummary.openingStock}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">Total Received</span>
              <p className="text-sm font-bold font-mono mt-1 text-emerald-600">+{stockSummary.totalReceived}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
              <span className="text-[10px] text-rose-600 font-semibold uppercase">Total Issued</span>
              <p className="text-sm font-bold font-mono mt-1 text-rose-600">-{stockSummary.totalIssued}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center">
              <span className="text-[10px] text-blue-600 font-semibold uppercase">Transfer In</span>
              <p className="text-sm font-bold font-mono mt-1 text-blue-600">+{stockSummary.transferIn}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center">
              <span className="text-[10px] text-blue-600 font-semibold uppercase">Transfer Out</span>
              <p className="text-sm font-bold font-mono mt-1 text-blue-600">-{stockSummary.transferOut}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center">
              <span className="text-[10px] text-amber-600 font-semibold uppercase">Returns</span>
              <p className="text-sm font-bold font-mono mt-1 text-amber-600">+{stockSummary.returns}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center">
              <span className="text-[10px] text-purple-600 font-semibold uppercase">Adjustments</span>
              <p className="text-sm font-bold font-mono mt-1 text-purple-600">{stockSummary.adjustments >= 0 ? `+${stockSummary.adjustments}` : stockSummary.adjustments}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
              <span className="text-[10px] text-red-600 font-semibold uppercase">Write-Off</span>
              <p className="text-sm font-bold font-mono mt-1 text-red-600">-{stockSummary.writeOff}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-primary/30 bg-primary/10 text-center">
              <span className="text-[10px] text-primary font-bold uppercase">Current Stock</span>
              <p className="text-sm font-bold font-mono mt-1 text-primary">{stockSummary.currentStock}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs flex flex-wrap gap-2.5 items-center justify-between shadow-xs">
            <div className="flex flex-wrap gap-2.5 items-center flex-1">
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Store</label>
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="w-36 mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Stores</option>
                  <option value="Yarn Store (PKCL)">Yarn Store (PKCL)</option>
                  <option value="Central Warehouse (Savar)">Central Warehouse (Savar)</option>
                  <option value="Chemical Store">Chemical Store</option>
                  <option value="General Store (PWFL)">General Store (PWFL)</option>
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Location</label>
                <input
                  type="text"
                  placeholder="Filter location..."
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-36 mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Batch</label>
                <input
                  type="text"
                  placeholder="Filter batch..."
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="w-36 mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">From Date</label>
                <input
                  type="date"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                  className="w-36 mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">To Date</label>
                <input
                  type="date"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                  className="w-36 mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setFilterStore("All");
                setFilterLocation("");
                setFilterBatch("");
                const d = new Date();
                d.setDate(d.getDate() - 90);
                setFilterFromDate(d.toISOString().slice(0, 10));
                setFilterToDate(new Date().toISOString().slice(0, 10));
              }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer pt-3"
            >
              <RotateCcw className="size-3" /> Reset
            </button>
          </div>

          {/* Stock Breakdown Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="p-3 bg-muted/40 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Stock Breakdown by Store, Location, and Batch
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Click any row for Transaction History Drill-down
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3 text-right">Opening</th>
                    <th className="py-2.5 px-3 text-right">In</th>
                    <th className="py-2.5 px-3 text-right">Out</th>
                    <th className="py-2.5 px-3 text-right font-bold text-primary">Balance</th>
                    <th className="py-2.5 px-3 text-center">Drill-down</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredBreakdown.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedDrilldownBatch(row)}
                      className="hover:bg-muted/40 cursor-pointer transition"
                    >
                      <td className="py-2 px-3 font-semibold text-foreground">{row.store}</td>
                      <td className="py-2 px-3 text-muted-foreground font-mono">{row.location}</td>
                      <td className="py-2 px-3 font-mono font-medium text-purple-600 dark:text-purple-400">
                        {row.batch}
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{row.opening.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-600 font-semibold">
                        +{row.inQty.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-rose-500 font-semibold">
                        -{row.outQty.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-black text-primary text-sm">
                        {row.balance.toLocaleString()} {activeItem.uom}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDrilldownBatch(row);
                          }}
                          className="px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[10.5px] flex items-center gap-1 mx-auto"
                        >
                          <History className="size-3" />
                          <span>History</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Item Search Modal */}
      {isItemSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Select Inventory Item</h3>
              </div>
              <button
                onClick={() => setIsItemSearchModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Code, Name, Specification, Brand, Origin, or UOM..."
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-background text-xs font-medium focus:border-primary outline-none"
                  autoFocus
                />
                <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
              </div>

              <div className="max-h-[380px] overflow-y-auto space-y-1.5 divide-y divide-border/40">
                {INITIAL_STOCK_BALANCE_DATA.filter((i) => {
                  if (!modalSearchTerm.trim()) return true;
                  const term = modalSearchTerm.toLowerCase();
                  return (
                    i.itemCode.toLowerCase().includes(term) ||
                    i.itemName.toLowerCase().includes(term) ||
                    i.specification.toLowerCase().includes(term) ||
                    i.brand.toLowerCase().includes(term) ||
                    i.origin.toLowerCase().includes(term) ||
                    i.uom.toLowerCase().includes(term)
                  );
                }).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItemCode(item.itemCode);
                      setIsItemSearchModalOpen(false);
                      toast.success(`Loaded stock register for ${item.itemName}`);
                    }}
                    className={`p-2.5 rounded-lg hover:bg-muted/60 transition cursor-pointer flex items-center justify-between ${
                      item.itemCode === selectedItemCode ? "bg-primary/10 border border-primary/20" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-primary">{item.itemCode}</span>
                        <span className="font-semibold text-xs text-foreground">{item.itemName}</span>
                        {item.trackingType === "Batch" ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-500/10 text-purple-600 border border-purple-500/20">
                            B
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            L
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.specification}</p>
                      <div className="flex gap-3 text-[10.5px] text-muted-foreground mt-1">
                        <span>Brand: {item.brand}</span>
                        <span>Origin: {item.origin}</span>
                        <span>UOM: {item.uom}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-foreground">
                        {item.totalQty} {item.uom}
                      </span>
                      <p className="text-[10px] text-muted-foreground">In Stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drill-down Transaction History Modal */}
      {selectedDrilldownBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <History className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Transaction Audit Drill-down — {activeItem.itemName} ({selectedDrilldownBatch.batch || selectedDrilldownBatch.location})
                </h3>
              </div>
              <button
                onClick={() => setSelectedDrilldownBatch(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs flex justify-between">
                <div>
                  <span className="text-muted-foreground">Item:</span> <span className="font-bold">{activeItem.itemName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Store:</span> <span className="font-semibold">{selectedDrilldownBatch.store}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Batch Balance:</span>{" "}
                  <span className="font-mono font-black text-primary">{selectedDrilldownBatch.balance} {activeItem.uom}</span>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[340px]">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-muted text-muted-foreground font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-2.5">Date</th>
                      <th className="py-2 px-2.5">Type</th>
                      <th className="py-2 px-2.5">Ref No.</th>
                      <th className="py-2 px-2.5 text-right">In</th>
                      <th className="py-2 px-2.5 text-right">Out</th>
                      <th className="py-2 px-2.5 text-right">Balance</th>
                      <th className="py-2 px-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {drilldownTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/40">
                        <td className="py-2 px-2.5 text-foreground">{tx.date}</td>
                        <td className="py-2 px-2.5 font-semibold text-primary">{tx.transactionType}</td>
                        <td className="py-2 px-2.5 font-mono text-[11px] text-muted-foreground">{tx.referenceNo}</td>
                        <td className="py-2 px-2.5 text-right font-mono text-emerald-600">
                          {tx.inQty > 0 ? `+${tx.inQty}` : "-"}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-rose-500">
                          {tx.outQty > 0 ? `-${tx.outQty}` : "-"}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono font-bold">{tx.balance}</td>
                        <td className="py-2 px-2.5 text-muted-foreground text-[11px]">{tx.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedDrilldownBatch(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Close Drilldown
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
