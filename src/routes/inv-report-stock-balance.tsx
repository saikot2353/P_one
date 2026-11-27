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
  Package,
  Layers,
  Building2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_STOCK_BALANCE_DATA,
  StockBalanceRow,
  INITIAL_LEDGER_DATA,
} from "@/lib/reports-mock-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-stock-balance")({
  head: () => ({
    meta: [
      { title: "Stock Balance Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Master stock balance register showing current on-hand, available, reserved, in-transit, and damaged quantities with valuation.",
      },
    ],
  }),
  component: StockBalanceRegisterPage,
});

export function StockBalanceRegisterPage() {
  const navigate = useNavigate();
  const currencyCfg = getActiveCurrencyConfig();

  // Filters (initialized from URL search params for seamless drill-down support)
  const [filterCompany, setFilterCompany] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("company") || "All";
    }
    return "All";
  });
  const [filterStore, setFilterStore] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("store") || "All";
    }
    return "All";
  });
  const [filterItem, setFilterItem] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("item") || "All";
    }
    return "All";
  });
  const [filterItemGroup, setFilterItemGroup] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("itemGroup") || "All";
    }
    return "All";
  });
  const [filterItemCategory, setFilterItemCategory] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("itemCategory") || "All";
    }
    return "All";
  });
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterOrigin, setFilterOrigin] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStockStatus, setFilterStockStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("stockStatus") || p.get("status") || "All";
    }
    return "All";
  });
  const [fromDate, setFilterFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setFilterToDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedItemModal, setSelectedItemModal] = useState<StockBalanceRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Filter options
  const companies = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_BALANCE_DATA.map((d) => d.company))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_BALANCE_DATA.map((d) => d.store))),
    []
  );
  const items = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_BALANCE_DATA.map((d) => d.itemName))),
    []
  );
  const itemGroups = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_BALANCE_DATA.map((d) => d.itemGroup))),
    []
  );
  const itemCategories = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_BALANCE_DATA.map((d) => d.itemCategory))),
    []
  );
  const brands = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_BALANCE_DATA.map((d) => d.brand))),
    []
  );
  const origins = useMemo(
    () => Array.from(new Set(INITIAL_STOCK_BALANCE_DATA.map((d) => d.origin))),
    []
  );

  // Filtered dataset with dynamic Opening, In QTY, Out QTY, and Current Stock calculation
  const computedRows = useMemo(() => {
    return INITIAL_STOCK_BALANCE_DATA.filter((row) => {
      if (filterCompany !== "All" && row.company !== filterCompany) return false;
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterItem.trim() && filterItem !== "All") {
        const q = filterItem.toLowerCase().trim();
        if (!row.itemName.toLowerCase().includes(q) && !row.itemCode.toLowerCase().includes(q)) return false;
      }
      if (filterItemGroup.trim() && filterItemGroup !== "All") {
        const q = filterItemGroup.toLowerCase().trim();
        if (!row.itemGroup.toLowerCase().includes(q)) return false;
      }
      if (filterItemCategory.trim() && filterItemCategory !== "All") {
        const q = filterItemCategory.toLowerCase().trim();
        if (!row.itemCategory.toLowerCase().includes(q)) return false;
      }
      if (filterBrand.trim() && filterBrand !== "All") {
        const q = filterBrand.toLowerCase().trim();
        if (!row.brand.toLowerCase().includes(q)) return false;
      }
      if (filterOrigin.trim() && filterOrigin !== "All") {
        const q = filterOrigin.toLowerCase().trim();
        if (!row.origin.toLowerCase().includes(q)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.specification.toLowerCase().includes(q) ||
          row.store.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    }).map((row) => {
      // Find matching ledger transactions for this item
      const itemTx = INITIAL_LEDGER_DATA.filter((tx) => tx.itemCode === row.itemCode);

      // 1. Opening Stock: closing stock balance before selected From Date
      // If transactions exist before fromDate, net them against row.availableQty baseline, or compute from opening baseline
      let openingStock = row.availableQty;
      const txBefore = itemTx.filter((t) => fromDate && t.date < fromDate);
      const txDuring = itemTx.filter(
        (t) => (!fromDate || t.date >= fromDate) && (!toDate || t.date <= toDate)
      );

      // In QTY: total quantity of all stock receipts within selected From Date and To Date
      let inQty = txDuring.reduce((sum, t) => sum + (t.inQty || 0), 0);

      // Out QTY: total quantity of all stock issues within selected From Date and To Date
      let outQty = txDuring.reduce((sum, t) => sum + (t.outQty || 0), 0);

      if (txDuring.length > 0) {
        // When item has ledger entries, opening stock is the balance right before fromDate
        if (txBefore.length > 0) {
          // Sort by date ascending
          const sortedBefore = [...txBefore].sort((a, b) => a.date.localeCompare(b.date));
          openingStock = sortedBefore[sortedBefore.length - 1].balance;
        } else {
          // If no transactions before fromDate, take first transaction's previous balance
          const sortedDuring = [...txDuring].sort((a, b) => a.date.localeCompare(b.date));
          const firstTx = sortedDuring[0];
          openingStock = Math.max(0, firstTx.balance - firstTx.inQty + firstTx.outQty);
        }
      } else {
        // Fallback realistic proportional values for demo items without ledger rows
        openingStock = row.availableQty;
        inQty = Math.round(row.inTransitQty || 0);
        outQty = Math.round(row.damagedQty || 0);
      }

      // Current Stock: Opening Stock + In QTY - Out QTY
      const currentStock = openingStock + inQty - outQty;
      const stockVal = Math.round(currentStock * row.unitCost);

      return {
        ...row,
        openingStock,
        inQty,
        outQty,
        currentStock,
        stockValue: stockVal,
      };
    });
  }, [
    filterCompany,
    filterStore,
    filterItem,
    filterItemGroup,
    filterItemCategory,
    filterBrand,
    filterOrigin,
    fromDate,
    toDate,
    searchQuery,
  ]);

  const filteredRows = computedRows;

  // Aggregate sums
  const totalOpeningStock = useMemo(
    () => filteredRows.reduce((s, r) => s + r.openingStock, 0),
    [filteredRows]
  );
  const totalInQty = useMemo(
    () => filteredRows.reduce((s, r) => s + r.inQty, 0),
    [filteredRows]
  );
  const totalOutQty = useMemo(
    () => filteredRows.reduce((s, r) => s + r.outQty, 0),
    [filteredRows]
  );
  const totalCurrentStock = useMemo(
    () => filteredRows.reduce((s, r) => s + r.currentStock, 0),
    [filteredRows]
  );
  const totalValuation = useMemo(
    () => filteredRows.reduce((s, r) => s + r.stockValue, 0),
    [filteredRows]
  );

  const handleResetFilters = () => {
    setFilterCompany("All");
    setFilterStore("All");
    setFilterItem("All");
    setFilterItemGroup("All");
    setFilterItemCategory("All");
    setFilterBrand("All");
    setFilterOrigin("All");
    setFilterBatch("");
    setFilterLocation("");
    setFilterStockStatus("All");
    setSearchQuery("");
    const d = new Date();
    d.setDate(d.getDate() - 90);
    setFilterFromDate(d.toISOString().slice(0, 10));
    setFilterToDate(new Date().toISOString().slice(0, 10));
    toast.info("Filters reset to default");
  };

  const handleExportCSV = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Specification",
      "Brand",
      "Origin",
      "UOM",
      "Store",
      "Opening Stock",
      "In QTY",
      "Out QTY",
      "Current Stock",
      "Unit Cost",
      "Stock Value",
    ];

    const rows = filteredRows.map((r) => [
      r.itemCode,
      r.itemName,
      r.specification,
      r.brand,
      r.origin,
      r.uom,
      r.store,
      r.openingStock,
      r.inQty,
      r.outQty,
      r.currentStock,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
    ]);

    exportToCSV(`Stock_Balance_Register_${fromDate}_to_${toDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Specification",
      "Brand",
      "Origin",
      "UOM",
      "Store",
      "Opening Stock",
      "In QTY",
      "Out QTY",
      "Current Stock",
      "Unit Cost",
      "Stock Value",
    ];

    const rows = filteredRows.map((r) => [
      r.itemCode,
      r.itemName,
      r.specification,
      r.brand,
      r.origin,
      r.uom,
      r.store,
      r.openingStock,
      r.inQty,
      r.outQty,
      r.currentStock,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
    ]);

    const subtotals = [
      { label: "Overall Total Opening Stock", value: totalOpeningStock.toLocaleString() },
      { label: "Overall Total In QTY", value: totalInQty.toLocaleString() },
      { label: "Overall Total Out QTY", value: totalOutQty.toLocaleString() },
      { label: "Overall Total Current Stock", value: totalCurrentStock.toLocaleString() },
      { label: "Overall Total Stock Valuation", value: formatAmount(totalValuation, undefined, true) },
    ];

    exportToExcel(
      `Stock_Balance_Register_${fromDate}_to_${toDate}.xls`,
      `Stock Balance Register (${fromDate} to ${toDate})`,
      headers,
      rows,
      subtotals
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Item Code",
      "Item Description",
      "UOM",
      "Store",
      "Opening Stock",
      "In QTY",
      "Out QTY",
      "Current Stock",
      "Unit Cost",
      "Stock Value",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.itemCode,
      `${r.itemName} (${r.specification || "-"})`,
      r.uom,
      r.store,
      r.openingStock.toLocaleString(),
      r.inQty.toLocaleString(),
      r.outQty.toLocaleString(),
      r.currentStock.toLocaleString(),
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
    ]);

    setPdfReportData({
      reportTitle: "STOCK BALANCE REGISTER",
      documentNumber: `STK-BAL-${fromDate}-${toDate}`,
      reportDate: `${fromDate} to ${toDate}`,
      companyName: filterCompany !== "All" ? filterCompany : "Pakiza Group of Industries",
      department: "Central Inventory & Materials Management",
      metadata: [
        { label: "Date Range", value: `${fromDate} to ${toDate}`, highlight: true },
        { label: "Store Filter", value: filterStore },
        { label: "Total Stock Items", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Items", value: filteredRows.length },
        { label: "Total Opening Stock", value: totalOpeningStock.toLocaleString() },
        { label: "Total In QTY", value: totalInQty.toLocaleString() },
        { label: "Total Out QTY", value: totalOutQty.toLocaleString() },
        { label: "Total Current Stock", value: totalCurrentStock.toLocaleString() },
        {
          label: "Total Inventory Value",
          value: formatAmount(totalValuation, undefined, true),
          isTotal: true,
          highlight: true,
        },
      ],
      signatures: [
        { role: "Store Keeper", name: "Inventory Controller" },
        { role: "Warehouse Manager", name: "AGM Supply Chain" },
        { role: "Financial Auditor", name: "Internal Audit Desk" },
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
                  Stock Balance Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Inventory Master Register
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Current inventory positions across all warehouses, stores, locations, and batch partitions.
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

          {/* Dynamic Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter Stock Balance Register</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {/* Company */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Company</label>
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Companies</option>
                  {companies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Warehouse / Store */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Warehouse / Store</label>
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

              {/* Item Search */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item</label>
                <input
                  type="text"
                  list="sb-items-list"
                  placeholder="Search Item..."
                  value={filterItem === "All" ? "" : filterItem}
                  onChange={(e) => setFilterItem(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="sb-items-list">
                  {items.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>

              {/* Item Group Search */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item Group</label>
                <input
                  type="text"
                  list="sb-groups-list"
                  placeholder="Search Group..."
                  value={filterItemGroup === "All" ? "" : filterItemGroup}
                  onChange={(e) => setFilterItemGroup(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="sb-groups-list">
                  {itemGroups.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>

              {/* Item Category Search */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item Category</label>
                <input
                  type="text"
                  list="sb-categories-list"
                  placeholder="Search Category..."
                  value={filterItemCategory === "All" ? "" : filterItemCategory}
                  onChange={(e) => setFilterItemCategory(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="sb-categories-list">
                  {itemCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              {/* Brand Search */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Brand</label>
                <input
                  type="text"
                  list="sb-brands-list"
                  placeholder="Search Brand..."
                  value={filterBrand === "All" ? "" : filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="sb-brands-list">
                  {brands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              {/* Origin Search */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Origin</label>
                <input
                  type="text"
                  list="sb-origins-list"
                  placeholder="Search Origin..."
                  value={filterOrigin === "All" ? "" : filterOrigin}
                  onChange={(e) => setFilterOrigin(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="sb-origins-list">
                  {origins.map((o) => (
                    <option key={o} value={o} />
                  ))}
                </datalist>
              </div>

              {/* From Date */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* Quick Search */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Search Item</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    placeholder="Search keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-7 pr-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                  />
                  <Search className="size-3.5 absolute left-2 top-2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Stock Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1400px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Item Code</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Specification</th>
                    <th className="py-2.5 px-3">Brand</th>
                    <th className="py-2.5 px-3">Origin</th>
                    <th className="py-2.5 px-3">UOM</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3 text-right">Opening Stock</th>
                    <th className="py-2.5 px-3 text-right">In QTY</th>
                    <th className="py-2.5 px-3 text-right">Out QTY</th>
                    <th className="py-2.5 px-3 text-right">Current Stock</th>
                    <th className="py-2.5 px-3 text-right">Stock Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-muted-foreground">
                        No stock balance records found for the active criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 font-mono text-[11px] font-bold text-primary whitespace-nowrap">
                          {row.itemCode}
                        </td>
                        <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">
                          {row.itemName}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground max-w-[200px] truncate" title={row.specification}>
                          {row.specification}
                        </td>
                        <td className="py-2 px-3 text-foreground">{row.brand}</td>
                        <td className="py-2 px-3 text-foreground">{row.origin}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.uom}</td>
                        <td className="py-2 px-3 text-foreground font-medium whitespace-nowrap">
                          {row.store}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                          {row.openingStock.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {row.inQty > 0 ? `+${row.inQty.toLocaleString()}` : "0"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-rose-500 font-semibold">
                          {row.outQty > 0 ? `-${row.outQty.toLocaleString()}` : "0"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-foreground">
                          {row.currentStock.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-primary">
                          {formatAmount(row.stockValue)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {filteredRows.length > 0 && (
                  <tfoot className="bg-primary/10 text-foreground font-black border-t-2 border-primary/30">
                    <tr>
                      <td colSpan={7} className="py-3 px-3 text-right text-xs uppercase tracking-wider text-primary">
                        TOTAL REGISTER BALANCE:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-bold text-foreground">
                        {totalOpeningStock.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-bold text-emerald-600">
                        +{totalInQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-bold text-rose-500">
                        -{totalOutQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-black text-foreground">
                        {totalCurrentStock.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm font-black text-primary">
                        {formatAmount(totalValuation, undefined, true)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border text-xs text-muted-foreground">
              <div>
                Period Range: <span className="font-bold text-foreground">{fromDate}</span> to <span className="font-bold text-foreground">{toDate}</span> | {filteredRows.length} items evaluated.
              </div>
              <div className="text-[11px] font-mono">
                Currency: <span className="font-bold text-foreground">{currencyCfg.currencyCode}</span> ({currencyCfg.symbol}) | Format: <span className="font-bold text-foreground">{currencyCfg.format}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Item Stock Details View Modal */}
      {selectedItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Item Stock Breakdown — {selectedItemModal.itemName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Code</span>
                  <p className="font-mono font-bold text-foreground mt-0.5">{selectedItemModal.itemCode}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Tracking Mode</span>
                  <p className="font-bold text-primary mt-0.5">
                    {selectedItemModal.trackingType === "Batch" ? "Batch Controlled (B)" : "Location Controlled (L)"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Warehouse Store</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedItemModal.store}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Assigned Location / Batch</span>
                  <p className="font-mono text-foreground mt-0.5">
                    {selectedItemModal.batch || selectedItemModal.location || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Available Qty</span>
                  <p className="text-base font-bold text-emerald-600 mt-1 font-mono">
                    {selectedItemModal.availableQty} {selectedItemModal.uom}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <span className="text-[10px] text-blue-600 font-bold uppercase">In-Transit</span>
                  <p className="text-base font-bold text-blue-600 mt-1 font-mono">
                    {selectedItemModal.inTransitQty} {selectedItemModal.uom}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5">
                  <span className="text-[10px] text-primary font-bold uppercase">Total Quantity</span>
                  <p className="text-base font-bold text-primary mt-1 font-mono">
                    {selectedItemModal.totalQty} {selectedItemModal.uom}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit Cost:</span>
                  <span className="font-mono font-semibold">{formatAmount(selectedItemModal.unitCost, undefined, true)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reorder Safety Level:</span>
                  <span className="font-mono font-semibold">{selectedItemModal.reorderLevel} {selectedItemModal.uom}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border font-bold text-sm text-foreground">
                  <span>Calculated Valuation:</span>
                  <span className="font-mono text-primary font-black">
                    {formatAmount(selectedItemModal.stockValue, undefined, true)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => {
                  const itm = selectedItemModal.itemCode;
                  setSelectedItemModal(null);
                  navigate({ to: "/inv-report-item-stock", search: { item: itm } as any });
                }}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Drill down to Item Stock Register</span>
                <ArrowRight className="size-3.5" />
              </button>
              <button
                onClick={() => setSelectedItemModal(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Print Modal */}
      <StandardPreviewReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={pdfReportData}
      />
    </div>
  );
}
