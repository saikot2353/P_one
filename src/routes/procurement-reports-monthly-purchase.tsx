import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Building2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Package,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_PURCHASE_REPORT_DATA,
  PurchaseReportRow,
} from "@/lib/reports-mock-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/procurement-reports-monthly-purchase")({
  head: () => ({
    meta: [
      { title: "Month-wise Purchase Report — Procurement | CRIPTON" },
      {
        name: "description",
        content:
          "Track purchase transactions month-by-month with subtotals, vendor summaries, tax and amount breakdowns.",
      },
    ],
  }),
  component: MonthWisePurchaseReportPage,
});

export function MonthWisePurchaseReportPage() {
  const navigate = useNavigate();
  const currencyCfg = getActiveCurrencyConfig();

  // Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterPurchaseType, setFilterPurchaseType] = useState("All");
  const [filterPoWo, setFilterPoWo] = useState("");
  const [filterItem, setFilterItem] = useState("All");
  const [filterItemGroup, setFilterItemGroup] = useState("All");
  const [filterItemCategory, setFilterItemCategory] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterOrigin, setFilterOrigin] = useState("All");
  const [fromMonth, setFromMonth] = useState("2026-01");
  const [toMonth, setToMonth] = useState("2026-12");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Modals
  const [selectedPoModal, setSelectedPoModal] = useState<PurchaseReportRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Filter options derived from dataset
  const companies = useMemo(
    () => Array.from(new Set(INITIAL_PURCHASE_REPORT_DATA.map((d) => d.company))),
    []
  );
  const suppliers = useMemo(
    () => Array.from(new Set(INITIAL_PURCHASE_REPORT_DATA.map((d) => d.supplier))),
    []
  );
  const items = useMemo(
    () => Array.from(new Set(INITIAL_PURCHASE_REPORT_DATA.map((d) => d.itemName))),
    []
  );
  const itemGroups = useMemo(
    () => Array.from(new Set(INITIAL_PURCHASE_REPORT_DATA.map((d) => d.itemGroup))),
    []
  );
  const itemCategories = useMemo(
    () => Array.from(new Set(INITIAL_PURCHASE_REPORT_DATA.map((d) => d.itemCategory))),
    []
  );
  const brands = useMemo(
    () => Array.from(new Set(INITIAL_PURCHASE_REPORT_DATA.map((d) => d.brand))),
    []
  );
  const origins = useMemo(
    () => Array.from(new Set(INITIAL_PURCHASE_REPORT_DATA.map((d) => d.origin))),
    []
  );

  // Filtered rows
  const filteredRows = useMemo(() => {
    return INITIAL_PURCHASE_REPORT_DATA.filter((row) => {
      if (filterCompany !== "All" && row.company !== filterCompany) return false;
      if (filterSupplier !== "All" && row.supplier !== filterSupplier) return false;
      if (filterPurchaseType !== "All" && row.purchaseType !== filterPurchaseType) return false;
      if (filterPoWo.trim() && !row.poWoNo.toLowerCase().includes(filterPoWo.toLowerCase().trim()))
        return false;
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterItemGroup !== "All" && row.itemGroup !== filterItemGroup) return false;
      if (filterItemCategory !== "All" && row.itemCategory !== filterItemCategory) return false;
      if (filterBrand !== "All" && row.brand !== filterBrand) return false;
      if (filterOrigin !== "All" && row.origin !== filterOrigin) return false;

      // Month range filter
      if (fromMonth && row.month < fromMonth) return false;
      if (toMonth && row.month > toMonth) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.poWoNo.toLowerCase().includes(q) ||
          row.supplier.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.specification.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterCompany,
    filterSupplier,
    filterPurchaseType,
    filterPoWo,
    filterItem,
    filterItemGroup,
    filterItemCategory,
    filterBrand,
    filterOrigin,
    fromMonth,
    toMonth,
    searchQuery,
  ]);

  // Grouped by Month
  const groupedByMonth = useMemo(() => {
    const groups: { [key: string]: { label: string; rows: PurchaseReportRow[] } } = {};
    // Sort descending by month
    const sorted = [...filteredRows].sort((a, b) => b.month.localeCompare(a.month));

    sorted.forEach((row) => {
      if (!groups[row.month]) {
        groups[row.month] = {
          label: row.monthLabel,
          rows: [],
        };
      }
      groups[row.month].rows.push(row);
    });

    return groups;
  }, [filteredRows]);

  // Overall totals
  const overallTotals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => ({
        qty: acc.qty + r.quantity,
        discount: acc.discount + r.discount,
        vat: acc.vat + r.vat,
        other: acc.other + r.otherCharges,
        total: acc.total + r.totalAmount,
      }),
      { qty: 0, discount: 0, vat: 0, other: 0, total: 0 }
    );
  }, [filteredRows]);

  const handleResetFilters = () => {
    setFilterCompany("All");
    setFilterSupplier("All");
    setFilterPurchaseType("All");
    setFilterPoWo("");
    setFilterItem("All");
    setFilterItemGroup("All");
    setFilterItemCategory("All");
    setFilterBrand("All");
    setFilterOrigin("All");
    setFromMonth("2026-01");
    setToMonth("2026-12");
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("Filters reset to default");
  };

  const handleExportCSV = () => {
    const headers = [
      "Month",
      "Purchase Date",
      "PO/WO No.",
      "Purchase Type",
      "Supplier / Vendor",
      "Item Code",
      "Item Name",
      "Specification",
      "Brand",
      "Origin",
      "UOM",
      "Quantity",
      "Unit Price",
      "Discount",
      "Tax %",
      "VAT",
      "Other Charges",
      "Total Amount",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.monthLabel,
      r.purchaseDate,
      r.poWoNo,
      r.purchaseType,
      r.supplier,
      r.itemCode,
      r.itemName,
      r.specification,
      r.brand,
      r.origin,
      r.uom,
      r.quantity,
      formatAmount(r.unitPrice),
      formatAmount(r.discount),
      `${r.taxPercent}%`,
      formatAmount(r.vat),
      formatAmount(r.otherCharges),
      formatAmount(r.totalAmount),
      r.status,
    ]);

    exportToCSV(`Month_wise_Purchase_Report_${fromMonth}_to_${toMonth}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Month",
      "Purchase Date",
      "PO/WO No.",
      "Purchase Type",
      "Supplier / Vendor",
      "Item Code",
      "Item Name",
      "Specification",
      "Brand",
      "Origin",
      "UOM",
      "Quantity",
      "Unit Price",
      "Discount",
      "Tax %",
      "VAT",
      "Other Charges",
      "Total Amount",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.monthLabel,
      r.purchaseDate,
      r.poWoNo,
      r.purchaseType,
      r.supplier,
      r.itemCode,
      r.itemName,
      r.specification,
      r.brand,
      r.origin,
      r.uom,
      r.quantity,
      formatAmount(r.unitPrice),
      formatAmount(r.discount),
      `${r.taxPercent}%`,
      formatAmount(r.vat),
      formatAmount(r.otherCharges),
      formatAmount(r.totalAmount),
      r.status,
    ]);

    const subtotals = [
      { label: "Overall Total Quantity", value: overallTotals.qty },
      { label: "Overall Total Amount", value: formatAmount(overallTotals.total, undefined, true) },
    ];

    exportToExcel(
      `Month_wise_Purchase_Report_${fromMonth}_to_${toMonth}.xls`,
      "Month-wise Purchase Report",
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
      "PO/WO No.",
      "Supplier",
      "Item & Spec",
      "UOM",
      "Qty",
      "Rate",
      "Total Amount",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.purchaseDate,
      r.poWoNo,
      r.supplier,
      `${r.itemName} (${r.specification || "-"})`,
      r.uom,
      r.quantity,
      formatAmount(r.unitPrice),
      formatAmount(r.totalAmount),
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "MONTH-WISE PURCHASE REPORT",
      documentNumber: `PUR-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: filterCompany !== "All" ? filterCompany : "Pakiza Group of Industries",
      department: "Central Procurement & Supply Chain",
      metadata: [
        { label: "Period Range", value: `${fromMonth} to ${toMonth}` },
        { label: "Supplier Filter", value: filterSupplier },
        { label: "Purchase Type", value: filterPurchaseType },
        { label: "Total Transactions", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Quantity", value: overallTotals.qty },
        { label: "Total VAT", value: formatAmount(overallTotals.vat, undefined, true) },
        {
          label: "Grand Total Value",
          value: formatAmount(overallTotals.total, undefined, true),
          isTotal: true,
          highlight: true,
        },
      ],
      signatures: [
        { role: "Prepared By", name: "Procurement Officer" },
        { role: "Verified By", name: "Internal Audit" },
        { role: "Approved By", name: "Head of Procurement" },
      ],
    });
    setIsPdfModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-7 py-5 space-y-4">
          {/* Header & Export Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Month-wise Purchase Report
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Procurement Reports
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comprehensive monthly aggregated purchase registers, price breakdowns, and vendor volumes.
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

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Total Purchases</span>
              <p className="text-lg font-bold mt-1 text-foreground">{filteredRows.length} Records</p>
              <span className="text-[10px] text-muted-foreground">Active in selected range</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Total Purchased Qty</span>
              <p className="text-lg font-bold mt-1 text-foreground font-mono">
                {overallTotals.qty.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium">Aggregated Units</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Total VAT Incurred</span>
              <p className="text-lg font-bold mt-1 text-foreground font-mono">
                {formatAmount(overallTotals.vat, undefined, true)}
              </p>
              <span className="text-[10px] text-muted-foreground">Configured Tax Format</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-primary/5 border-primary/20 shadow-xs">
              <span className="text-[11px] font-medium text-primary">Grand Total Amount</span>
              <p className="text-lg font-bold mt-1 text-primary font-mono">
                {formatAmount(overallTotals.total, undefined, true)}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Format: {currencyCfg.format}
              </span>
            </div>
          </div>

          {/* Dynamic Filter Section */}
          <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Advanced Report Filters</span>
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

              {/* Supplier */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Supplier / Vendor</label>
                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Purchase Type */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Purchase Type</label>
                <select
                  value={filterPurchaseType}
                  onChange={(e) => setFilterPurchaseType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Local">Local</option>
                  <option value="Foreign">Foreign</option>
                  <option value="Work Order">Work Order</option>
                </select>
              </div>

              {/* PO/WO No */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">PO/WO No.</label>
                <input
                  type="text"
                  placeholder="e.g. PO-2026-0089"
                  value={filterPoWo}
                  onChange={(e) => setFilterPoWo(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* From Month */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">From Month</label>
                <input
                  type="month"
                  value={fromMonth}
                  onChange={(e) => setFromMonth(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              {/* To Month */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">To Month</label>
                <input
                  type="month"
                  value={toMonth}
                  onChange={(e) => setToMonth(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                />
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

              {/* Global search */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Quick Search</label>
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

          {/* Grouped Month-wise Report Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1700px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3">Purchase Date</th>
                    <th className="py-2.5 px-3">PO/WO No.</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Supplier / Vendor</th>
                    <th className="py-2.5 px-3">Item Code</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Specification</th>
                    <th className="py-2.5 px-3">Brand</th>
                    <th className="py-2.5 px-3">Origin</th>
                    <th className="py-2.5 px-3">UOM</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Discount</th>
                    <th className="py-2.5 px-3 text-right">Tax %</th>
                    <th className="py-2.5 px-3 text-right">VAT</th>
                    <th className="py-2.5 px-3 text-right">Other Charges</th>
                    <th className="py-2.5 px-3 text-right">Total Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {Object.keys(groupedByMonth).length === 0 ? (
                    <tr>
                      <td colSpan={20} className="py-8 text-center text-muted-foreground">
                        No purchase records found matching the specified filters.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(groupedByMonth).map(([monthKey, group]) => {
                      const groupQty = group.rows.reduce((s, r) => s + r.quantity, 0);
                      const groupDiscount = group.rows.reduce((s, r) => s + r.discount, 0);
                      const groupVat = group.rows.reduce((s, r) => s + r.vat, 0);
                      const groupOther = group.rows.reduce((s, r) => s + r.otherCharges, 0);
                      const groupTotal = group.rows.reduce((s, r) => s + r.totalAmount, 0);

                      return (
                        <tbody key={monthKey} className="divide-y divide-border/50">
                          {/* Group Header */}
                          <tr className="bg-primary/5 font-bold text-primary border-t-2 border-primary/20">
                            <td colSpan={20} className="py-2 px-3 text-xs tracking-wide">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <Calendar className="size-3.5 text-primary" />
                                  <span>{group.label}</span>
                                  <span className="text-[10px] font-normal text-muted-foreground">
                                    ({group.rows.length} transactions)
                                  </span>
                                </span>
                                <span className="text-xs font-mono">
                                  Subtotal: {formatAmount(groupTotal, undefined, true)}
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Rows */}
                          {group.rows.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/40 transition">
                              <td className="py-2 px-3 text-muted-foreground font-mono text-[11px]">
                                {row.monthLabel}
                              </td>
                              <td className="py-2 px-3 text-foreground whitespace-nowrap">
                                {row.purchaseDate}
                              </td>
                              <td className="py-2 px-3 font-semibold text-primary font-mono whitespace-nowrap">
                                {row.poWoNo}
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    row.purchaseType === "Work Order"
                                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                      : row.purchaseType === "Foreign"
                                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  }`}
                                >
                                  {row.purchaseType}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                                {row.supplier}
                              </td>
                              <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground">
                                {row.itemCode}
                              </td>
                              <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">
                                {row.itemName}
                              </td>
                              <td className="py-2 px-3 text-muted-foreground max-w-[200px] truncate" title={row.specification}>
                                {row.specification || "-"}
                              </td>
                              <td className="py-2 px-3 text-foreground">{row.brand}</td>
                              <td className="py-2 px-3 text-foreground">{row.origin}</td>
                              <td className="py-2 px-3 text-muted-foreground">{row.uom}</td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                                {row.quantity.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-foreground">
                                {formatAmount(row.unitPrice)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                                {formatAmount(row.discount)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                                {row.taxPercent}%
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                                {formatAmount(row.vat)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                                {formatAmount(row.otherCharges)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-primary">
                                {formatAmount(row.totalAmount)}
                              </td>
                              <td className="py-2 px-3 text-center whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => setSelectedPoModal(row)}
                                  className="p-1 rounded-md hover:bg-muted text-primary cursor-pointer transition"
                                  title="View PO/WO Details"
                                >
                                  <Eye className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}

                          {/* Monthly Subtotal Row */}
                          <tr className="bg-muted/60 font-bold text-foreground border-b-2 border-border/80">
                            <td colSpan={11} className="py-2 px-3 text-right text-[11px] uppercase tracking-wide">
                              Subtotal for {group.label}:
                            </td>
                            <td className="py-2 px-3 text-right font-mono">{groupQty.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right font-mono">-</td>
                            <td className="py-2 px-3 text-right font-mono">{formatAmount(groupDiscount)}</td>
                            <td className="py-2 px-3 text-right font-mono">-</td>
                            <td className="py-2 px-3 text-right font-mono">{formatAmount(groupVat)}</td>
                            <td className="py-2 px-3 text-right font-mono">{formatAmount(groupOther)}</td>
                            <td className="py-2 px-3 text-right font-mono text-primary font-bold">
                              {formatAmount(groupTotal)}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tbody>
                      );
                    })
                  )}
                </tbody>

                {/* Overall Grand Total Footer */}
                {filteredRows.length > 0 && (
                  <tfoot className="bg-primary/10 text-foreground font-black border-t-2 border-primary/30">
                    <tr>
                      <td colSpan={11} className="py-3 px-3 text-right text-xs uppercase tracking-wider text-primary">
                        OVERALL GRAND TOTAL:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {overallTotals.qty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">-</td>
                      <td className="py-3 px-3 text-right font-mono">{formatAmount(overallTotals.discount)}</td>
                      <td className="py-3 px-3 text-right font-mono">-</td>
                      <td className="py-3 px-3 text-right font-mono">{formatAmount(overallTotals.vat)}</td>
                      <td className="py-3 px-3 text-right font-mono">{formatAmount(overallTotals.other)}</td>
                      <td className="py-3 px-3 text-right font-mono text-sm text-primary font-black">
                        {formatAmount(overallTotals.total, undefined, true)}
                      </td>
                      <td colSpan={2} className="py-3 px-3 text-center text-[10px] text-muted-foreground">
                        {filteredRows.length} Items Aggregated
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border text-xs text-muted-foreground">
              <div>
                Showing <span className="font-bold text-foreground">{filteredRows.length}</span> purchase entries across {Object.keys(groupedByMonth).length} months.
              </div>
              <div className="text-[11px] font-mono">
                Currency: <span className="font-bold text-foreground">{currencyCfg.currencyCode}</span> ({currencyCfg.symbol}) | Format: <span className="font-bold text-foreground">{currencyCfg.format}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PO / WO Detail View Modal */}
      {selectedPoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Order Details — {selectedPoModal.poWoNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPoModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Supplier</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedPoModal.supplier}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Company</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedPoModal.company}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Purchase Date</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedPoModal.purchaseDate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Order Type</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedPoModal.purchaseType}</p>
                </div>
              </div>

              <div className="space-y-1.5 border border-border/60 rounded-xl p-3">
                <h4 className="font-bold text-foreground text-xs">Item Information</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div><span className="text-muted-foreground">Code:</span> <span className="font-mono">{selectedPoModal.itemCode}</span></div>
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-semibold">{selectedPoModal.itemName}</span></div>
                  <div><span className="text-muted-foreground">Specification:</span> <span>{selectedPoModal.specification}</span></div>
                  <div><span className="text-muted-foreground">Brand / Origin:</span> <span>{selectedPoModal.brand} ({selectedPoModal.origin})</span></div>
                  <div><span className="text-muted-foreground">Quantity:</span> <span className="font-bold">{selectedPoModal.quantity} {selectedPoModal.uom}</span></div>
                  <div><span className="text-muted-foreground">Unit Price:</span> <span className="font-mono">{formatAmount(selectedPoModal.unitPrice)}</span></div>
                </div>
              </div>

              <div className="space-y-1 rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs">
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Gross Amount:</span>
                  <span className="font-mono">{formatAmount(selectedPoModal.quantity * selectedPoModal.unitPrice)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatAmount(selectedPoModal.discount)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Tax ({selectedPoModal.taxPercent}%):</span>
                  <span className="font-mono">+{formatAmount((selectedPoModal.quantity * selectedPoModal.unitPrice * selectedPoModal.taxPercent) / 100)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>VAT:</span>
                  <span className="font-mono">+{formatAmount(selectedPoModal.vat)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Other Charges:</span>
                  <span className="font-mono">+{formatAmount(selectedPoModal.otherCharges)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-primary/20 font-bold text-sm text-primary">
                  <span>Total Payable:</span>
                  <span className="font-mono">{formatAmount(selectedPoModal.totalAmount, undefined, true)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => {
                  setSelectedPoModal(null);
                  navigate({ to: "/procurement-po-list" });
                }}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold cursor-pointer"
              >
                Go to PO Register
              </button>
              <button
                onClick={() => setSelectedPoModal(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Standard Print Modal */}
      <StandardPreviewReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={pdfReportData}
      />
    </div>
  );
}
