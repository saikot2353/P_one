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
  RotateLeft,
  Calendar,
  X,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_SUPPLIER_RETURN_REPORT_DATA,
  SupplierReturnReportRow,
} from "@/lib/reports-mock-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-monthly-supplier-return")({
  head: () => ({
    meta: [
      { title: "Month-wise Supplier Stock Return Report — Inventory | CRIPTON" },
      {
        name: "description",
        content:
          "Audit monthly rejected/returned inventory dispatched back to suppliers with debit notes, unit costs, and value subtotals.",
      },
    ],
  }),
  component: MonthWiseSupplierStockReturnReportPage,
});

export function MonthWiseSupplierStockReturnReportPage() {
  const currencyCfg = getActiveCurrencyConfig();  // Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterItem, setFilterItem] = useState("All");
  const [filterItemGroup, setFilterItemGroup] = useState("All");
  const [filterItemCategory, setFilterItemCategory] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [fromMonth, setFromMonth] = useState("2026-08");
  const [toMonth, setToMonth] = useState("2026-10");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  const companies = useMemo(
    () => Array.from(new Set(INITIAL_SUPPLIER_RETURN_REPORT_DATA.map((r) => r.company))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_SUPPLIER_RETURN_REPORT_DATA.map((r) => r.store))),
    []
  );
  const suppliers = useMemo(
    () => Array.from(new Set(INITIAL_SUPPLIER_RETURN_REPORT_DATA.map((r) => r.supplier))),
    []
  );
  const items = useMemo(
    () => Array.from(new Set(INITIAL_SUPPLIER_RETURN_REPORT_DATA.map((r) => r.itemName))),
    []
  );
  const itemGroups = useMemo(
    () => Array.from(new Set(INITIAL_SUPPLIER_RETURN_REPORT_DATA.map((r) => r.itemGroup))),
    []
  );
  const itemCategories = useMemo(
    () => Array.from(new Set(INITIAL_SUPPLIER_RETURN_REPORT_DATA.map((r) => r.itemCategory).filter(Boolean))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_SUPPLIER_RETURN_REPORT_DATA.filter((row) => {
      if (filterCompany !== "All" && row.company !== filterCompany) return false;
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterSupplier.trim() && filterSupplier !== "All") {
        const q = filterSupplier.toLowerCase().trim();
        if (!row.supplier.toLowerCase().includes(q)) return false;
      }
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
      if (filterLocation.trim() && !row.location.toLowerCase().includes(filterLocation.toLowerCase().trim()))
        return false;

      if (fromMonth && row.month < fromMonth) return false;
      if (toMonth && row.month > toMonth) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.supplierReturnRef.toLowerCase().includes(q) ||
          row.poWoNo.toLowerCase().includes(q) ||
          row.mrrNo.toLowerCase().includes(q) ||
          row.supplier.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterCompany,
    filterStore,
    filterSupplier,
    filterItem,
    filterItemGroup,
    filterItemCategory,
    filterBatch,
    filterLocation,
    fromMonth,
    toMonth,
    searchQuery,
  ]);

  // Monthly Summaries
  const monthlySummaries = useMemo(() => {
    const map = new Map<string, { month: string; monthLabel: string; totalQty: number; totalVal: number; count: number }>();
    filteredRows.forEach((r) => {
      const existing = map.get(r.month) || {
        month: r.month,
        monthLabel: r.monthLabel,
        totalQty: 0,
        totalVal: 0,
        count: 0,
      };
      existing.totalQty += r.returnQuantity;
      existing.totalVal += r.returnValue;
      existing.count += 1;
      map.set(r.month, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.month.localeCompare(a.month));
  }, [filteredRows]);

  const totalQty = useMemo(() => filteredRows.reduce((s, r) => s + r.returnQuantity, 0), [filteredRows]);
  const totalValue = useMemo(() => filteredRows.reduce((s, r) => s + r.returnValue, 0), [filteredRows]);

  const handleResetFilters = () => {
    setFilterCompany("All");
    setFilterStore("All");
    setFilterSupplier("All");
    setFilterItem("All");
    setFilterItemGroup("All");
    setFilterItemCategory("All");
    setFilterBatch("");
    setFilterLocation("");
    setFromMonth("2026-08");
    setToMonth("2026-10");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = ["Month", "Return Quantity", "Value (BDT)"];
    const rows = monthlySummaries.map((m) => [m.monthLabel, m.totalQty, m.totalVal]);

    exportToCSV(`Month_wise_Supplier_Return_Report_${fromMonth}_to_${toMonth}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = ["Month", "Return Quantity", "Value (BDT)"];
    const rows = monthlySummaries.map((m) => [m.monthLabel, m.totalQty, m.totalVal]);

    exportToExcel(
      `Month_wise_Supplier_Return_Report_${fromMonth}_to_${toMonth}.xls`,
      "Month-wise Supplier Return Report",
      headers,
      rows,
      [
        { label: "Overall Total Return Quantity", value: totalQty.toLocaleString() },
        { label: "Overall Total Return Value", value: formatAmount(totalValue, undefined, true) },
      ]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = ["Month", "Return Quantity", "Value (৳)"];
    const tableRows = monthlySummaries.map((m) => [
      m.monthLabel,
      m.totalQty.toLocaleString(),
      formatAmount(m.totalVal, undefined, true),
    ]);

    setPdfReportData({
      reportTitle: "MONTH-WISE SUPPLIER STOCK RETURN REPORT",
      documentNumber: `M-SRET-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: filterCompany !== "All" ? filterCompany : "Pakiza Group of Industries",
      department: "Supplier Returns & Debit Notes",
      metadata: [
        { label: "Period", value: `${fromMonth} to ${toMonth}` },
        { label: "Supplier Filter", value: filterSupplier },
        { label: "Total Months", value: monthlySummaries.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Overall Return Quantity", value: totalQty.toLocaleString(), highlight: true },
        { label: "Debit Note Financial Value", value: formatAmount(totalValue, undefined, true), isTotal: true, highlight: true },
      ],
      signatures: [
        { role: "Store Return Officer", name: "Gate Dispatcher" },
        { role: "Accounts Payable", name: "Debit Note Team" },
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
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Month-wise Supplier Stock Return Report
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Monthly Rejection & Debit Notes
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly aggregated rejected materials sent back to vendors with PO, MRR links, and financial debit note values.
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
                <span>Filter Supplier Returns</span>
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

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Supplier / Vendor</label>
                <input
                  type="text"
                  list="supplier-return-options"
                  placeholder="Search supplier..."
                  value={filterSupplier === "All" ? "" : filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value || "All")}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="supplier-return-options">
                  <option value="All">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item</label>
                <input
                  type="text"
                  list="item-return-options"
                  placeholder="Search item..."
                  value={filterItem === "All" ? "" : filterItem}
                  onChange={(e) => setFilterItem(e.target.value || "All")}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="item-return-options">
                  <option value="All">All Items</option>
                  {items.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Item Group</label>
                <input
                  type="text"
                  list="group-return-options"
                  placeholder="Search group..."
                  value={filterItemGroup === "All" ? "" : filterItemGroup}
                  onChange={(e) => setFilterItemGroup(e.target.value || "All")}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
                <datalist id="group-return-options">
                  <option value="All">All Groups</option>
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">From Month</label>
                <input
                  type="month"
                  value={fromMonth}
                  onChange={(e) => setFromMonth(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">To Month</label>
                <input
                  type="month"
                  value={toMonth}
                  onChange={(e) => setToMonth(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Month</th>
                    <th className="py-2.5 px-4 text-right font-bold">Return Quantity</th>
                    <th className="py-2.5 px-4 text-right font-bold">Value (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {monthlySummaries.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-muted-foreground">
                        No supplier return records found.
                      </td>
                    </tr>
                  ) : (
                    monthlySummaries.map((row) => (
                      <tr key={row.month} className="hover:bg-muted/40 transition">
                        <td className="py-2.5 px-4 font-semibold text-foreground flex items-center gap-2">
                          <Calendar className="size-3.5 text-primary" />
                          <span>{row.monthLabel}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            ({row.count} records)
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-amber-600">
                          {row.totalQty.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-foreground">
                          {formatAmount(row.totalVal, undefined, true)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {monthlySummaries.length > 0 && (
                  <tfoot className="bg-primary/10 text-foreground font-black border-t-2 border-primary/30">
                    <tr>
                      <td className="py-3 px-4 text-left text-xs uppercase tracking-wider text-primary font-bold">
                        OVERALL TOTAL
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-sm text-foreground font-bold">
                        {totalQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-sm text-amber-600 font-black">
                        {formatAmount(totalValue, undefined, true)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* PDF Modal */}
      <StandardPreviewReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={pdfReportData}
      />
    </div>
  );
}
