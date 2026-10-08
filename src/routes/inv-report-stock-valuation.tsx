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
  Calculator,
  TrendingUp,
  Award,
  Layers,
  X,
  Building2,
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

export const Route = createFileRoute("/inv-report-stock-valuation")({
  head: () => ({
    meta: [
      { title: "Stock Valuation Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Financial inventory valuation register for Management and Finance with weighted average unit costs, total capital invested, and drilldowns.",
      },
    ],
  }),
  component: StockValuationRegisterPage,
});

export function StockValuationRegisterPage() {
  const currencyCfg = getActiveCurrencyConfig();

  // Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterItem, setFilterItem] = useState("All");
  const [filterItemGroup, setFilterItemGroup] = useState("All");
  const [filterItemCategory, setFilterItemCategory] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedValuationDrilldown, setSelectedValuationDrilldown] = useState<StockBalanceRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

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

  const filteredRows = useMemo(() => {
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
      if (filterItemCategory !== "All" && row.itemCategory !== filterItemCategory) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.store.toLowerCase().includes(q);
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
    filterBatch,
    searchQuery,
  ]);

  // 4 Required KPIs: Total Stock Value, Total Stock Quantity, Average Unit Cost, Highest Value Item
  const kpis = useMemo(() => {
    const totalValue = filteredRows.reduce((s, r) => s + r.stockValue, 0);
    const totalQty = filteredRows.reduce((s, r) => s + r.totalQty, 0);
    const avgUnitCost = totalQty > 0 ? totalValue / totalQty : 0;

    let highestItem = filteredRows[0];
    filteredRows.forEach((r) => {
      if (!highestItem || r.stockValue > highestItem.stockValue) {
        highestItem = r;
      }
    });

    return { totalValue, totalQty, avgUnitCost, highestItem };
  }, [filteredRows]);

  const handleResetFilters = () => {
    setFilterCompany("All");
    setFilterStore("All");
    setFilterItem("All");
    setFilterItemGroup("All");
    setFilterItemCategory("All");
    setFilterBatch("");
    setAsOfDate(new Date().toISOString().slice(0, 10));
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "UOM",
      "Quantity",
      "Unit Cost",
      "Stock Value",
    ];

    const rows = filteredRows.map((r) => [
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.uom,
      r.totalQty,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
    ]);

    exportToCSV(`Stock_Valuation_Register_As_Of_${asOfDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Item Code",
      "Item Name",
      "Store",
      "Batch",
      "UOM",
      "Quantity",
      "Unit Cost",
      "Stock Value",
    ];

    const rows = filteredRows.map((r) => [
      r.itemCode,
      r.itemName,
      r.store,
      r.batch,
      r.uom,
      r.totalQty,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
    ]);

    exportToExcel(
      `Stock_Valuation_Register_As_Of_${asOfDate}.xls`,
      `Stock Valuation Register (${asOfDate})`,
      headers,
      rows,
      [
        { label: "Total Stock Quantity", value: kpis.totalQty.toLocaleString() },
        { label: "Grand Total Valuation", value: formatAmount(kpis.totalValue, undefined, true) },
      ]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Item",
      "Store",
      "Batch",
      "UOM",
      "Quantity",
      "Unit Cost",
      "Stock Value",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      `${r.itemName} (${r.itemCode})`,
      r.store,
      r.batch || "-",
      r.uom,
      r.totalQty,
      formatAmount(r.unitCost),
      formatAmount(r.stockValue),
    ]);

    setPdfReportData({
      reportTitle: "STOCK VALUATION REGISTER",
      documentNumber: `VAL-REP-${asOfDate}`,
      reportDate: asOfDate,
      companyName: filterCompany !== "All" ? filterCompany : "Pakiza Group of Industries",
      department: "Financial Accounts & Inventory Valuation",
      metadata: [
        { label: "As of Date", value: asOfDate },
        { label: "Total Evaluated SKUs", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Units", value: kpis.totalQty.toLocaleString() },
        { label: "Average Unit Cost", value: formatAmount(kpis.avgUnitCost, undefined, true) },
        {
          label: "Total Inventory Capital Value",
          value: formatAmount(kpis.totalValue, undefined, true),
          isTotal: true,
          highlight: true,
        },
      ],
      signatures: [
        { role: "Inventory Valuation Analyst", name: "Cost Accountant" },
        { role: "Approved By", name: "CFO / Finance Controller" },
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
                  Stock Valuation Register
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Management & Finance
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Financial audit register computing stock quantities by weighted unit costs for balance sheet inventory assets.
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

          {/* 3 KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 shadow-xs">
              <span className="text-[11px] font-medium text-primary">Total Stock Value</span>
              <p className="text-lg font-bold mt-1 text-primary font-mono">{formatAmount(kpis.totalValue, undefined, true)}</p>
              <span className="text-[10px] text-muted-foreground">{currencyCfg.format}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Total Stock Quantity</span>
              <p className="text-lg font-bold mt-1 text-foreground font-mono">{kpis.totalQty.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-600 font-medium">Physical inventory</span>
            </div>
            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-xs">
              <span className="text-[11px] font-medium text-amber-600">Highest Value Item</span>
              <p className="text-base font-bold mt-1 text-amber-600 truncate" title={kpis.highestItem?.itemName}>
                {kpis.highestItem?.itemName || "None"}
              </p>
              <span className="text-[10px] font-mono text-muted-foreground">
                {formatAmount(kpis.highestItem?.stockValue, undefined, true)}
              </span>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter Valuation Register</span>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item</label>
                <input
                  type="text"
                  list="val-items-list"
                  placeholder="Search item..."
                  value={filterItem === "All" ? "" : filterItem}
                  onChange={(e) => setFilterItem(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="val-items-list">
                  {items.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item Group</label>
                <input
                  type="text"
                  list="val-groups-list"
                  placeholder="Search group..."
                  value={filterItemGroup === "All" ? "" : filterItemGroup}
                  onChange={(e) => setFilterItemGroup(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="val-groups-list">
                  {itemGroups.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>

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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">As of Date</label>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Search</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    placeholder="Search item..."
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
              <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Item Code & Name</th>
                    <th className="py-2.5 px-3">Specification</th>
                    <th className="py-2.5 px-3">Brand</th>
                    <th className="py-2.5 px-3">Origin</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">UOM</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost</th>
                    <th className="py-2.5 px-3 text-right">Stock Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-muted-foreground">
                        No valuation records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">
                          {row.itemName} <span className="font-mono text-muted-foreground text-[11px]">({row.itemCode})</span>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{row.specification || "-"}</td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.brand || "-"}</td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.origin || "-"}</td>
                        <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.store}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">{row.batch || "-"}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.uom}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                          {row.totalQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                          {formatAmount(row.unitCost)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-primary">
                          {formatAmount(row.stockValue)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-muted/60 font-semibold border-t border-border sticky bottom-0">
                  <tr>
                    <td colSpan={7} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px] text-muted-foreground font-bold">
                      Total
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-foreground">
                      {kpis.totalQty.toLocaleString()}
                    </td>
                    <td></td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-primary">
                      {formatAmount(kpis.totalValue, undefined, true)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Drilldown Modal: Stock Value ↓ Item ↓ Store ↓ Batch ↓ Quantity × Unit Cost */}
      {selectedValuationDrilldown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Calculator className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Valuation Calculation Drill-down
                </h3>
              </div>
              <button
                onClick={() => setSelectedValuationDrilldown(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wide">
                  Financial Valuation Tree:
                </h4>
                <div className="space-y-1 pl-2 font-mono text-[11px] text-foreground">
                  <div>Stock Value: <span className="font-bold text-primary">{formatAmount(selectedValuationDrilldown.stockValue, undefined, true)}</span></div>
                  <div className="pl-4">↓ Item: <span className="font-semibold">{selectedValuationDrilldown.itemName} [{selectedValuationDrilldown.itemCode}]</span></div>
                  <div className="pl-8">↓ Store: <span className="font-semibold">{selectedValuationDrilldown.store}</span></div>
                  <div className="pl-12">↓ Batch: <span className="font-semibold">{selectedValuationDrilldown.batch || "No Batch Partition"}</span></div>
                  <div className="pl-16 font-bold text-primary">
                    ↓ Quantity × Unit Cost: {selectedValuationDrilldown.totalQty} {selectedValuationDrilldown.uom} × {formatAmount(selectedValuationDrilldown.unitCost)} = {formatAmount(selectedValuationDrilldown.stockValue, undefined, true)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Item Valuation Method</span>
                  <p className="font-bold text-foreground text-xs mt-0.5">Weighted Average</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Balance Sheet Allocation</span>
                  <p className="font-bold text-primary text-xs mt-0.5">Current Assets &gt; Inventories</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => setSelectedValuationDrilldown(null)}
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
