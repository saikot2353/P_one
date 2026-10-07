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

  // Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterItem, setFilterItem] = useState("All");
  const [filterItemGroup, setFilterItemGroup] = useState("All");
  const [filterItemCategory, setFilterItemCategory] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterOrigin, setFilterOrigin] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStockStatus, setFilterStockStatus] = useState("All");
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().slice(0, 10));
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

  // Filtered dataset
  const filteredRows = useMemo(() => {
    return INITIAL_STOCK_BALANCE_DATA.filter((row) => {
      if (filterCompany !== "All" && row.company !== filterCompany) return false;
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterItemGroup !== "All" && row.itemGroup !== filterItemGroup) return false;
      if (filterItemCategory !== "All" && row.itemCategory !== filterItemCategory) return false;
      if (filterBrand !== "All" && row.brand !== filterBrand) return false;
      if (filterOrigin !== "All" && row.origin !== filterOrigin) return false;
      if (filterStockStatus !== "All" && row.stockStatus !== filterStockStatus) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;
      if (
        filterLocation.trim() &&
        !row.location.toLowerCase().includes(filterLocation.toLowerCase().trim())
      )
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.specification.toLowerCase().includes(q) ||
          row.store.toLowerCase().includes(q) ||
          row.batch.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterCompany,
    filterStore,
    filterItem,
    filterItemGroup,
    filterItemCategory,
    filterBrand,
    filterOrigin,
    filterStockStatus,
    filterBatch,
    filterLocation,
    searchQuery,
  ]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalItems = filteredRows.length;
    const totalQty = filteredRows.reduce((s, r) => s + r.totalQty, 0);
    const totalVal = filteredRows.reduce((s, r) => s + r.stockValue, 0);
    const lowStock = filteredRows.filter((r) => r.stockStatus === "Low Stock").length;
    const outOfStock = filteredRows.filter((r) => r.stockStatus === "Out of Stock" || r.availableQty <= 0).length;
    const inTransit = filteredRows.reduce((s, r) => s + r.inTransitQty, 0);

    return { totalItems, totalQty, totalVal, lowStock, outOfStock, inTransit };
  }, [filteredRows]);

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
    setAsOfDate(new Date().toISOString().slice(0, 10));
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
      "Available Qty",
      "Reserved Qty",
      "In-Transit Qty",
      "Damaged Qty",
      "Total Qty",
      "Unit Cost",
      "Stock Value",
      "Tracking Mode",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.itemCode,
      r.itemName,
      r.specification,
      r.brand,
      r.origin,
      r.uom,
      r.store,
      r.availableQty,
      r.reservedQty,
      r.inTransitQty,
      r.damagedQty,
      r.totalQty,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
      r.trackingType === "Batch" ? "B (Batch)" : "L (Location)",
      r.stockStatus,
    ]);

    exportToCSV(`Stock_Balance_Register_As_Of_${asOfDate}.csv`, headers, rows);
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
      "Available Qty",
      "Reserved Qty",
      "In-Transit Qty",
      "Damaged Qty",
      "Total Qty",
      "Unit Cost",
      "Stock Value",
      "Tracking Mode",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.itemCode,
      r.itemName,
      r.specification,
      r.brand,
      r.origin,
      r.uom,
      r.store,
      r.availableQty,
      r.reservedQty,
      r.inTransitQty,
      r.damagedQty,
      r.totalQty,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
      r.trackingType === "Batch" ? "B (Batch)" : "L (Location)",
      r.stockStatus,
    ]);

    const subtotals = [
      { label: "Overall Total Stock Quantity", value: kpis.totalQty.toLocaleString() },
      { label: "Overall Total Stock Valuation", value: formatAmount(kpis.totalVal, undefined, true) },
    ];

    exportToExcel(
      `Stock_Balance_Register_As_Of_${asOfDate}.xls`,
      `Stock Balance Register (As of ${asOfDate})`,
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
      "Avail Qty",
      "Total Qty",
      "Unit Cost",
      "Stock Value",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.itemCode,
      `${r.itemName} (${r.specification || "-"})`,
      r.uom,
      r.store,
      r.availableQty,
      r.totalQty,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
      r.stockStatus,
    ]);

    setPdfReportData({
      reportTitle: "STOCK BALANCE REGISTER",
      documentNumber: `STK-BAL-${asOfDate}`,
      reportDate: asOfDate,
      companyName: filterCompany !== "All" ? filterCompany : "Pakiza Group of Industries",
      department: "Central Inventory & Materials Management",
      metadata: [
        { label: "As of Date", value: asOfDate },
        { label: "Store Filter", value: filterStore },
        { label: "Total Stock Items", value: filteredRows.length },
        { label: "In-Transit Volume", value: kpis.inTransit },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Items", value: kpis.totalItems },
        { label: "Total Stock Qty", value: kpis.totalQty.toLocaleString() },
        {
          label: "Total Inventory Value",
          value: formatAmount(kpis.totalVal, undefined, true),
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

          {/* 6 Required KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="p-3 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[10.5px] font-medium text-muted-foreground">Total Items</span>
              <p className="text-base font-bold mt-1 text-foreground">{kpis.totalItems} SKUs</p>
              <span className="text-[10px] text-muted-foreground">Catalog products</span>
            </div>
            <div className="p-3 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[10.5px] font-medium text-muted-foreground">Total Stock Qty</span>
              <p className="text-base font-bold mt-1 text-foreground font-mono">
                {kpis.totalQty.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium">On-hand volume</span>
            </div>
            <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 shadow-xs">
              <span className="text-[10.5px] font-medium text-primary">Total Stock Value</span>
              <p className="text-base font-bold mt-1 text-primary font-mono">
                {formatAmount(kpis.totalVal, undefined, true)}
              </p>
              <span className="text-[10px] text-muted-foreground">{currencyCfg.format}</span>
            </div>
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-xs">
              <span className="text-[10.5px] font-medium text-amber-600 dark:text-amber-400">Low Stock Items</span>
              <p className="text-base font-bold mt-1 text-amber-600 dark:text-amber-400 font-mono">
                {kpis.lowStock}
              </p>
              <span className="text-[10px] text-muted-foreground">Below reorder point</span>
            </div>
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-xs">
              <span className="text-[10.5px] font-medium text-rose-600 dark:text-rose-400">Out of Stock</span>
              <p className="text-base font-bold mt-1 text-rose-600 dark:text-rose-400 font-mono">
                {kpis.outOfStock}
              </p>
              <span className="text-[10px] text-muted-foreground">Zero available balance</span>
            </div>
            <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 shadow-xs">
              <span className="text-[10.5px] font-medium text-blue-600 dark:text-blue-400">In-Transit Stock</span>
              <p className="text-base font-bold mt-1 text-blue-600 dark:text-blue-400 font-mono">
                {kpis.inTransit.toLocaleString()}
              </p>
              <span className="text-[10px] text-muted-foreground">Dispatched between stores</span>
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

              {/* Item */}
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

              {/* Item Group */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item Group</label>
                <select
                  value={filterItemGroup}
                  onChange={(e) => setFilterItemGroup(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Groups</option>
                  {itemGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Item Category */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item Category</label>
                <select
                  value={filterItemCategory}
                  onChange={(e) => setFilterItemCategory(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Categories</option>
                  {itemCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Stock Status */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Stock Status</label>
                <select
                  value={filterStockStatus}
                  onChange={(e) => setFilterStockStatus(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Normal">Normal</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="In-Transit">In-Transit</option>
                </select>
              </div>

              {/* Batch */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Batch No.</label>
                <input
                  type="text"
                  placeholder="e.g. BAT-YRN..."
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Location / Bin</label>
                <input
                  type="text"
                  placeholder="e.g. Rack-01 / Bin-04"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Brand</label>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Origin */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Origin</label>
                <select
                  value={filterOrigin}
                  onChange={(e) => setFilterOrigin(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Origins</option>
                  {origins.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* As of Date */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">As of Date</label>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* Quick Search */}
              <div>
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
              <table className="w-full text-xs text-left border-collapse min-w-[1550px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Tracking</th>
                    <th className="py-2.5 px-3">Item Code</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Specification</th>
                    <th className="py-2.5 px-3">Brand</th>
                    <th className="py-2.5 px-3">Origin</th>
                    <th className="py-2.5 px-3">UOM</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3 text-right">Available Qty</th>
                    <th className="py-2.5 px-3 text-right">Reserved Qty</th>
                    <th className="py-2.5 px-3 text-right">In-Transit Qty</th>
                    <th className="py-2.5 px-3 text-right">Damaged Qty</th>
                    <th className="py-2.5 px-3 text-right">Total Qty</th>
                    <th className="py-2.5 px-3 text-right">Stock Value</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="py-8 text-center text-muted-foreground">
                        No stock balance records found for the active criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3">
                          {/* Strict single badge requirement: B = Batch, L = Location */}
                          {row.trackingType === "Batch" ? (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                              title="Batch Tracked Item"
                            >
                              B
                            </span>
                          ) : (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              title="Location Tracked Item"
                            >
                              L
                            </span>
                          )}
                        </td>
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
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {row.availableQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                          {row.reservedQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                          {row.inTransitQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-rose-500">
                          {row.damagedQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                          {row.totalQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-primary">
                          {formatAmount(row.stockValue)}
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.stockStatus === "Normal"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : row.stockStatus === "Low Stock"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : row.stockStatus === "In-Transit"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            }`}
                          >
                            {row.stockStatus}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setSelectedItemModal(row)}
                            className="p-1 rounded-md hover:bg-muted text-primary cursor-pointer transition"
                            title="View Item Stock Details"
                          >
                            <Eye className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {filteredRows.length > 0 && (
                  <tfoot className="bg-primary/10 text-foreground font-black border-t-2 border-primary/30">
                    <tr>
                      <td colSpan={8} className="py-3 px-3 text-right text-xs uppercase tracking-wider text-primary">
                        TOTAL REGISTER BALANCE:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-bold text-emerald-600">
                        {filteredRows.reduce((s, r) => s + r.availableQty, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {filteredRows.reduce((s, r) => s + r.reservedQty, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs text-blue-600">
                        {kpis.inTransit.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs text-rose-500">
                        {filteredRows.reduce((s, r) => s + r.damagedQty, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-black text-foreground">
                        {kpis.totalQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm font-black text-primary">
                        {formatAmount(kpis.totalVal, undefined, true)}
                      </td>
                      <td colSpan={2} className="py-3 px-3 text-center text-[10px] text-muted-foreground">
                        {filteredRows.length} Items Listed
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border text-xs text-muted-foreground">
              <div>
                Report Position As of: <span className="font-bold text-foreground">{asOfDate}</span> | {filteredRows.length} items evaluated.
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
