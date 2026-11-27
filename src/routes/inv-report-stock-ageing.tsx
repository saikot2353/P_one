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
  RotateCcw,
  Calendar,
  Layers,
  Clock,
  Warehouse,
  Boxes,
  Tag,
  Building2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockAgeingRecord,
  getStockAgeingData,
  AGEING_BUCKETS,
  AgeingBucket,
} from "@/lib/stock-ageing-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-stock-ageing")({
  head: () => ({
    meta: [
      { title: "Stock Ageing Report — Inventory Management | CRIPTON" },
      {
        name: "description",
        content:
          "Batch/Lot and Location-wise stock ageing analysis based on original receipt date with custom day ranges and valuation.",
      },
    ],
  }),
  component: StockAgeingReportPage,
});

export function StockAgeingReportPage() {
  const currencyCfg = getActiveCurrencyConfig();

  // As of Date filter (defaults to today)
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Top Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterItemGroup, setFilterItemGroup] = useState("All");
  const [filterItemCategory, setFilterItemCategory] = useState("All");
  const [filterItemName, setFilterItemName] = useState("");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterOrigin, setFilterOrigin] = useState("All");
  const [filterAgeFrom, setFilterAgeFrom] = useState<string>("");
  const [filterAgeTo, setFilterAgeTo] = useState<string>("");
  const [selectedQuickBucket, setSelectedQuickBucket] = useState<AgeingBucket>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals for PDF / Print
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Compute raw stock ageing records based on selected asOfDate
  const rawRecords = useMemo(() => {
    return getStockAgeingData(asOfDate);
  }, [asOfDate]);

  // Distinct filter options
  const companyOptions = useMemo(
    () => Array.from(new Set(rawRecords.map((r) => r.company).filter(Boolean))),
    [rawRecords]
  );
  const storeOptions = useMemo(
    () => Array.from(new Set(rawRecords.map((r) => r.warehouseStore).filter(Boolean))),
    [rawRecords]
  );
  const groupOptions = useMemo(
    () => Array.from(new Set(rawRecords.map((r) => r.itemGroup).filter(Boolean))),
    [rawRecords]
  );
  const categoryOptions = useMemo(
    () => Array.from(new Set(rawRecords.map((r) => r.itemCategory).filter(Boolean))),
    [rawRecords]
  );
  const brandOptions = useMemo(
    () => Array.from(new Set(rawRecords.map((r) => r.brand).filter(Boolean))),
    [rawRecords]
  );
  const originOptions = useMemo(
    () => Array.from(new Set(rawRecords.map((r) => r.origin).filter(Boolean))),
    [rawRecords]
  );

  // Quick Ageing Option Click Handler
  const handleSelectQuickBucket = (bucket: AgeingBucket) => {
    setSelectedQuickBucket(bucket);
    if (bucket === "All") {
      setFilterAgeFrom("");
      setFilterAgeTo("");
    } else {
      const match = AGEING_BUCKETS.find((b) => b.value === bucket);
      if (match) {
        setFilterAgeFrom(String(match.min));
        setFilterAgeTo(match.max !== undefined ? String(match.max) : "");
      }
    }
  };

  // Filter application
  const filteredRows = useMemo(() => {
    return rawRecords.filter((row) => {
      // Company
      if (filterCompany !== "All" && row.company !== filterCompany) return false;

      // Warehouse / Store
      if (filterStore !== "All" && row.warehouseStore !== filterStore) return false;

      // Item Group
      if (filterItemGroup !== "All" && row.itemGroup !== filterItemGroup) return false;

      // Item Category
      if (filterItemCategory !== "All" && row.itemCategory !== filterItemCategory) return false;

      // Brand
      if (filterBrand !== "All" && row.brand !== filterBrand) return false;

      // Origin
      if (filterOrigin !== "All" && row.origin !== filterOrigin) return false;

      // Item Name
      if (filterItemName.trim()) {
        const q = filterItemName.toLowerCase().trim();
        const match =
          row.itemName.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Ageing range (From / To)
      const fromVal = filterAgeFrom.trim() ? Number(filterAgeFrom) : null;
      const toVal = filterAgeTo.trim() ? Number(filterAgeTo) : null;

      if (fromVal !== null && !isNaN(fromVal) && row.ageDays < fromVal) return false;
      if (toVal !== null && !isNaN(toVal) && row.ageDays > toVal) return false;

      // General search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.itemName.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemGroup.toLowerCase().includes(q) ||
          row.location.toLowerCase().includes(q) ||
          row.batchLotNo.toLowerCase().includes(q) ||
          row.warehouseStore.toLowerCase().includes(q) ||
          row.brand.toLowerCase().includes(q) ||
          row.origin.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    rawRecords,
    filterCompany,
    filterStore,
    filterItemGroup,
    filterItemCategory,
    filterItemName,
    filterBrand,
    filterOrigin,
    filterAgeFrom,
    filterAgeTo,
    searchQuery,
  ]);

  // Aggregate totals
  const totalStockQty = useMemo(
    () => filteredRows.reduce((sum, r) => sum + r.availableStockQty, 0),
    [filteredRows]
  );
  const totalStockValue = useMemo(
    () => filteredRows.reduce((sum, r) => sum + r.stockValue, 0),
    [filteredRows]
  );

  // Actions
  const handleResetFilters = () => {
    setFilterCompany("All");
    setFilterStore("All");
    setFilterItemGroup("All");
    setFilterItemCategory("All");
    setFilterItemName("");
    setFilterBrand("All");
    setFilterOrigin("All");
    setFilterAgeFrom("");
    setFilterAgeTo("");
    setSelectedQuickBucket("All");
    setSearchQuery("");
    setAsOfDate(new Date().toISOString().slice(0, 10));
    toast.info("All filters have been reset.");
  };

  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Item Name",
      "Item Code",
      "Item Group",
      "Brand / Origin",
      "Warehouse / Store",
      "Location",
      "Batch / Lot No.",
      "Stock Receive Date",
      "Age (Days)",
      "UOM",
      "Available Stock Qty",
      "Stock Rate (৳)",
      "Stock Value (৳)",
    ];

    const rows = filteredRows.map((r, idx) => [
      idx + 1,
      r.itemName,
      r.itemCode,
      r.itemGroup,
      `${r.brand} / ${r.origin}`,
      r.warehouseStore,
      r.location,
      r.batchLotNo,
      r.stockReceiveDate,
      r.ageDays,
      r.uom,
      r.availableStockQty,
      formatAmount(r.stockRate),
      formatAmount(r.stockValue),
    ]);

    exportToCSV(`Stock_Ageing_Report_As_Of_${asOfDate}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Item Name",
      "Item Code",
      "Item Group",
      "Brand / Origin",
      "Warehouse / Store",
      "Location",
      "Batch / Lot No.",
      "Stock Receive Date",
      "Age (Days)",
      "UOM",
      "Available Stock Qty",
      "Stock Rate (৳)",
      "Stock Value (৳)",
    ];

    const rows = filteredRows.map((r, idx) => [
      idx + 1,
      r.itemName,
      r.itemCode,
      r.itemGroup,
      `${r.brand} / ${r.origin}`,
      r.warehouseStore,
      r.location,
      r.batchLotNo,
      r.stockReceiveDate,
      r.ageDays,
      r.uom,
      r.availableStockQty,
      formatAmount(r.stockRate),
      formatAmount(r.stockValue),
    ]);

    const subtotals = [
      { label: "Total Filtered Items", value: String(filteredRows.length) },
      { label: "Total Available Stock Qty", value: totalStockQty.toLocaleString() },
      { label: "Total Stock Valuation", value: formatAmount(totalStockValue, undefined, true) },
    ];

    exportToExcel(
      `Stock_Ageing_Report_As_Of_${asOfDate}.xls`,
      `Stock Ageing Report (As of ${asOfDate})`,
      headers,
      rows,
      subtotals
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Item Name",
      "Item Group",
      "Brand / Origin",
      "Warehouse / Store",
      "Location",
      "Batch / Lot No.",
      "Stock Receive Date",
      "Age (Days)",
      "UOM",
      "Available Stock Qty",
      "Stock Rate",
      "Stock Value",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      <div key={idx}>
        <div className="font-bold text-slate-900">{r.itemName}</div>
        <div className="text-[10px] text-slate-500 font-mono">{r.itemCode}</div>
      </div>,
      r.itemGroup,
      `${r.brand} / ${r.origin}`,
      r.warehouseStore,
      r.location,
      r.batchLotNo,
      r.stockReceiveDate,
      <span
        key={idx}
        className={`font-mono font-bold ${
          r.ageDays > 365
            ? "text-rose-600"
            : r.ageDays > 180
              ? "text-amber-600"
              : r.ageDays > 90
                ? "text-blue-600"
                : "text-emerald-600"
        }`}
      >
        {r.ageDays} d
      </span>,
      r.uom,
      r.availableStockQty.toLocaleString(),
      formatAmount(r.stockRate),
      formatAmount(r.stockValue),
    ]);

    setPdfReportData({
      reportTitle: "STOCK AGEING REPORT",
      title: "STOCK AGEING REPORT",
      documentNumber: `AGE-${asOfDate}`,
      reportDate: asOfDate,
      companyName: filterCompany !== "All" ? filterCompany : "Pakiza Group of Industries",
      department: "Central Inventory & Materials Supply",
      orientation: "landscape",
      metadata: [
        { label: "As of Date", value: asOfDate, highlight: true },
        { label: "Warehouse / Store", value: filterStore },
        { label: "Company", value: filterCompany },
        { label: "Total Lots", value: String(filteredRows.length) },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Lots", value: String(filteredRows.length) },
        { label: "Total Available Stock Qty", value: totalStockQty.toLocaleString() },
        {
          label: "Total Stock Value",
          value: formatAmount(totalStockValue, undefined, true),
          isTotal: true,
          highlight: true,
        },
      ],
      signatures: [
        { role: "Store In-charge", name: "Store Operations Desk" },
        { role: "Inventory Controller", name: "Inventory Controller" },
        { role: "Internal Auditor", name: "Audit & Compliance" },
      ],
    });
    setIsPdfModalOpen(true);
  };

  // Helper badge style for age days
  const getAgeBadge = (days: number) => {
    if (days <= 30) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (days <= 60) {
      return "bg-teal-50 text-teal-700 border-teal-200";
    }
    if (days <= 90) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (days <= 180) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (days <= 365) {
      return "bg-orange-50 text-orange-700 border-orange-200";
    }
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="flex h-screen bg-white font-sans text-slate-800 overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-7 py-5 space-y-4">
          {/* Header & Export Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Stock Ageing Report
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Inventory Management → Report
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Location-wise and Batch/Lot-wise stock ageing analysis with original receipt tracking and live valuation.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-emerald-700 transition cursor-pointer shadow-xs"
                title="Export to Excel"
              >
                <FileSpreadsheet className="size-3.5" />
                <span>Export to Excel</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-blue-700 transition cursor-pointer shadow-xs"
                title="Export to CSV"
              >
                <FileText className="size-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={handlePrintPDF}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-amber-700 transition cursor-pointer shadow-xs"
                title="Print Report"
              >
                <Printer className="size-3.5" />
                <span>Print Report</span>
              </button>
              <button
                onClick={handlePrintPDF}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition cursor-pointer shadow-xs"
                title="PDF Download"
              >
                <FileText className="size-3.5" />
                <span>PDF Download</span>
              </button>
            </div>
          </div>

          {/* Top Filter Section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Filter className="size-3.5 text-indigo-600" />
                <span>Report Filters & Search Criteria</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="size-3" /> Reset Filter
              </button>
            </div>

            {/* Row 1: Primary Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Company */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  Company
                </label>
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                >
                  <option value="All">All Companies</option>
                  {companyOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Warehouse / Store */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  Warehouse / Store
                </label>
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                >
                  <option value="All">All Warehouses / Stores</option>
                  {storeOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Item Group */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  Item Group
                </label>
                <select
                  value={filterItemGroup}
                  onChange={(e) => setFilterItemGroup(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                >
                  <option value="All">All Groups</option>
                  {groupOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Item Category */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  Item Category
                </label>
                <select
                  value={filterItemCategory}
                  onChange={(e) => setFilterItemCategory(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                >
                  <option value="All">All Categories</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Item Name */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="Filter by Item Name / Code..."
                  value={filterItemName}
                  onChange={(e) => setFilterItemName(e.target.value)}
                  className="w-full mt-1 h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Row 2: Secondary Filters & Ageing Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              {/* Brand */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  Brand
                </label>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                >
                  <option value="All">All Brands</option>
                  {brandOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Origin */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  Origin
                </label>
                <select
                  value={filterOrigin}
                  onChange={(e) => setFilterOrigin(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                >
                  <option value="All">All Origins</option>
                  {originOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Ageing From & To (Days) */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  Ageing Days (From – To)
                </label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min days"
                    value={filterAgeFrom}
                    onChange={(e) => {
                      setFilterAgeFrom(e.target.value);
                      setSelectedQuickBucket("All");
                    }}
                    className="w-1/2 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                  />
                  <span className="text-slate-400 text-xs">–</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max days"
                    value={filterAgeTo}
                    onChange={(e) => {
                      setFilterAgeTo(e.target.value);
                      setSelectedQuickBucket("All");
                    }}
                    className="w-1/2 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* As of Date */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wide">
                  As of Date
                </label>
                <div className="relative mt-1">
                  <input
                    type="date"
                    value={asOfDate}
                    onChange={(e) => setAsOfDate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Search / Filter Action */}
              <div className="flex flex-col justify-end">
                <div className="relative">
                  <Search className="size-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search / Filter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick Ageing Filter Badges */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Clock className="size-3 text-indigo-500" /> Quick Ageing Filters:
              </span>
              {AGEING_BUCKETS.map((b) => {
                const isSelected = selectedQuickBucket === b.value;
                return (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => handleSelectQuickBucket(b.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Table – Location-Wise Stock Ageing */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {/* Table Meta Bar */}
            <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span>Location-Wise Stock Ageing Records</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {filteredRows.length} Lots
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div>
                  Total Available Qty:{" "}
                  <span className="font-bold font-mono text-slate-900">
                    {totalStockQty.toLocaleString()} units
                  </span>
                </div>
                <span className="text-slate-300">•</span>
                <div>
                  Total Stock Value:{" "}
                  <span className="font-bold font-mono text-indigo-700">
                    {formatAmount(totalStockValue, undefined, true)}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-2.5 px-3 text-center w-12">SL</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Item Group</th>
                    <th className="py-2.5 px-3">Brand / Origin</th>
                    <th className="py-2.5 px-3">Warehouse / Store</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Batch / Lot No.</th>
                    <th className="py-2.5 px-3">Stock Receive Date</th>
                    <th className="py-2.5 px-3 text-center">Age (Days)</th>
                    <th className="py-2.5 px-3 text-center">UOM</th>
                    <th className="py-2.5 px-3 text-right">Available Stock Qty</th>
                    <th className="py-2.5 px-3 text-right">Stock Rate</th>
                    <th className="py-2.5 px-3 text-right">Stock Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-slate-400">
                        <Clock className="size-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                        <p className="text-xs font-semibold text-slate-600">
                          No stock ageing records found
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Try adjusting your filters, date ranges, or search query.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/80 transition-colors whitespace-nowrap text-xs"
                      >
                        {/* 1. SL */}
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[10.5px]">
                          {idx + 1}
                        </td>

                        {/* 2. Item Name */}
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 leading-tight">
                            {row.itemName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {row.itemCode}
                          </div>
                        </td>

                        {/* 3. Item Group */}
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-800">
                            {row.itemGroup}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {row.itemCategory}
                          </div>
                        </td>

                        {/* 4. Brand / Origin */}
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800">
                            {row.brand}
                          </div>
                          <div className="text-[10.5px] text-slate-400">
                            {row.origin}
                          </div>
                        </td>

                        {/* 5. Warehouse / Store */}
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800">
                            {row.warehouseStore}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {row.company}
                          </div>
                        </td>

                        {/* 6. Location */}
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded-md text-[11px]">
                            {row.location}
                          </span>
                        </td>

                        {/* 7. Batch / Lot No. */}
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {row.batchLotNo || "-"}
                        </td>

                        {/* 8. Stock Receive Date */}
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {row.stockReceiveDate}
                        </td>

                        {/* 9. Age (Days) */}
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-full border ${getAgeBadge(
                              row.ageDays
                            )}`}
                          >
                            {row.ageDays} Days
                          </span>
                        </td>

                        {/* 10. UOM */}
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 text-[10.5px]">
                          {row.uom}
                        </td>

                        {/* 11. Available Stock Qty */}
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {row.availableStockQty.toLocaleString()}
                        </td>

                        {/* 12. Stock Rate */}
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          {formatAmount(row.stockRate)}
                        </td>

                        {/* 13. Stock Value */}
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatAmount(row.stockValue)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {/* Table Footer Summary Row */}
                {filteredRows.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 bg-slate-100/90 font-bold text-slate-900 whitespace-nowrap text-xs">
                      <td colSpan={10} className="py-3 px-3 text-right uppercase tracking-wide">
                        Total Summary:
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                        {totalStockQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400">–</td>
                      <td className="py-3 px-3 text-right font-mono font-black text-indigo-700">
                        {formatAmount(totalStockValue, undefined, true)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Standard Preview Report Modal for Print / PDF */}
      {isPdfModalOpen && pdfReportData && (
        <StandardPreviewReportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          data={pdfReportData}
        />
      )}
    </div>
  );
}
