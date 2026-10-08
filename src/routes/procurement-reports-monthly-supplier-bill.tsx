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
  Calendar,
  Receipt,
  X,
  CreditCard,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_SUPPLIER_BILL_REPORT_DATA,
  SupplierBillReportRow,
} from "@/lib/reports-mock-data";
import { formatAmount, getActiveCurrencyConfig } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/procurement-reports-monthly-supplier-bill")({
  head: () => ({
    meta: [
      { title: "Month-wise Supplier Bill Report — Procurement | CRIPTON" },
      {
        name: "description",
        content:
          "Track verified supplier invoices, MRRs, purchase orders, taxes, VAT, and payments month-by-month.",
      },
    ],
  }),
  component: MonthWiseSupplierBillReportPage,
});

export function MonthWiseSupplierBillReportPage() {
  const navigate = useNavigate();
  const currencyCfg = getActiveCurrencyConfig();

  // Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterBillStatus, setFilterBillStatus] = useState("All");
  const [filterPoWo, setFilterPoWo] = useState("");
  const [filterBillType, setFilterBillType] = useState("All");
  const [fromMonth, setFromMonth] = useState("2026-01");
  const [toMonth, setToMonth] = useState("2026-12");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedBillModal, setSelectedBillModal] = useState<SupplierBillReportRow | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  // Filter options
  const companies = useMemo(
    () => Array.from(new Set(INITIAL_SUPPLIER_BILL_REPORT_DATA.map((d) => d.company))),
    []
  );
  const suppliers = useMemo(
    () => Array.from(new Set(INITIAL_SUPPLIER_BILL_REPORT_DATA.map((d) => d.supplier))),
    []
  );

  // Filtered rows
  const filteredRows = useMemo(() => {
    return INITIAL_SUPPLIER_BILL_REPORT_DATA.filter((row) => {
      if (filterCompany !== "All" && row.company !== filterCompany) return false;
      if (filterSupplier !== "All" && row.supplier !== filterSupplier) return false;
      if (filterBillStatus !== "All" && row.status !== filterBillStatus) return false;
      if (filterBillType !== "All" && row.billType !== filterBillType) return false;
      if (filterPoWo.trim() && !row.poWoNo.toLowerCase().includes(filterPoWo.toLowerCase().trim()))
        return false;

      // Month range filter
      if (fromMonth && row.month < fromMonth) return false;
      if (toMonth && row.month > toMonth) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.billNo.toLowerCase().includes(q) ||
          row.supplier.toLowerCase().includes(q) ||
          row.poWoNo.toLowerCase().includes(q) ||
          row.mrrNo.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterCompany,
    filterSupplier,
    filterBillStatus,
    filterPoWo,
    filterBillType,
    fromMonth,
    toMonth,
    searchQuery,
  ]);

  // Grouped by Month
  const groupedByMonth = useMemo(() => {
    const groups: { [key: string]: { label: string; rows: SupplierBillReportRow[] } } = {};
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
        quantity: acc.quantity + (r.quantity || 0),
        billAmount: acc.billAmount + r.billAmount,
        discount: acc.discount + r.discount,
        tax: acc.tax + r.tax,
        vat: acc.vat + r.vat,
        other: acc.other + r.otherCharges,
        total: acc.total + r.totalAmount,
      }),
      { quantity: 0, billAmount: 0, discount: 0, tax: 0, vat: 0, other: 0, total: 0 }
    );
  }, [filteredRows]);

  const handleResetFilters = () => {
    setFilterCompany("All");
    setFilterSupplier("All");
    setFilterBillStatus("All");
    setFilterPoWo("");
    setFilterBillType("All");
    setFromMonth("2026-01");
    setToMonth("2026-12");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Month",
      "Bill Date",
      "Bill No.",
      "Supplier / Vendor",
      "PO/WO No.",
      "MRR No.",
      "Total Qty",
      "Bill Amount",
      "Discount",
      "Tax",
      "VAT",
      "Other Charges",
      "Total Amount",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.monthLabel,
      r.billDate,
      r.billNo,
      r.supplier,
      r.poWoNo,
      r.mrrNo,
      (r.quantity || 0).toLocaleString(),
      formatAmount(r.billAmount),
      formatAmount(r.discount),
      formatAmount(r.tax),
      formatAmount(r.vat),
      formatAmount(r.otherCharges),
      formatAmount(r.totalAmount),
      r.status,
    ]);

    exportToCSV(`Month_wise_Supplier_Bill_Report_${fromMonth}_to_${toMonth}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Month",
      "Bill Date",
      "Bill No.",
      "Supplier / Vendor",
      "PO/WO No.",
      "MRR No.",
      "Total Qty",
      "Bill Amount",
      "Discount",
      "Tax",
      "VAT",
      "Other Charges",
      "Total Amount",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.monthLabel,
      r.billDate,
      r.billNo,
      r.supplier,
      r.poWoNo,
      r.mrrNo,
      r.quantity || 0,
      formatAmount(r.billAmount),
      formatAmount(r.discount),
      formatAmount(r.tax),
      formatAmount(r.vat),
      formatAmount(r.otherCharges),
      formatAmount(r.totalAmount),
      r.status,
    ]);

    const subtotals = [
      { label: "Overall Total Quantity", value: overallTotals.quantity.toLocaleString() },
      { label: "Overall Total Bill Amount", value: formatAmount(overallTotals.billAmount) },
      { label: "Overall Net Total Amount", value: formatAmount(overallTotals.total, undefined, true) },
    ];

    exportToExcel(
      `Month_wise_Supplier_Bill_Report_${fromMonth}_to_${toMonth}.xls`,
      "Month-wise Supplier Bill Report",
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
      "Bill No.",
      "Supplier",
      "PO/WO No.",
      "MRR No.",
      "Total Qty",
      "Bill Amt",
      "Tax & VAT",
      "Net Total",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.billDate,
      r.billNo,
      r.supplier,
      r.poWoNo,
      r.mrrNo,
      (r.quantity || 0).toLocaleString(),
      formatAmount(r.billAmount),
      formatAmount(r.tax + r.vat),
      formatAmount(r.totalAmount),
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "MONTH-WISE SUPPLIER BILL REPORT",
      documentNumber: `BILL-REP-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: filterCompany !== "All" ? filterCompany : "Pakiza Group of Industries",
      department: "Procurement Billing & Accounts Payable",
      metadata: [
        { label: "Period Range", value: `${fromMonth} to ${toMonth}` },
        { label: "Supplier Filter", value: filterSupplier },
        { label: "Bill Status", value: filterBillStatus },
        { label: "Total Invoices", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Bill Amount", value: formatAmount(overallTotals.billAmount, undefined, true) },
        { label: "Total Tax Incurred", value: formatAmount(overallTotals.tax, undefined, true) },
        { label: "Total VAT Incurred", value: formatAmount(overallTotals.vat, undefined, true) },
        {
          label: "Grand Net Payable",
          value: formatAmount(overallTotals.total, undefined, true),
          isTotal: true,
          highlight: true,
        },
      ],
      signatures: [
        { role: "Checked By", name: "Billing Executive" },
        { role: "Verified By", name: "Accounts Payable Manager" },
        { role: "Approved By", name: "CFO / Finance Controller" },
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
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Month-wise Supplier Bill Report
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Procurement Reports
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Audit monthly invoice payables, discount concessions, withholding tax, and VAT liability.
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
              <span className="text-[11px] font-medium text-muted-foreground">Total Invoices</span>
              <p className="text-lg font-bold mt-1 text-foreground">{filteredRows.length} Bills</p>
              <span className="text-[10px] text-muted-foreground">In active date range</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Base Bill Amount</span>
              <p className="text-lg font-bold mt-1 text-foreground font-mono">
                {formatAmount(overallTotals.billAmount, undefined, true)}
              </p>
              <span className="text-[10px] text-muted-foreground">Excluding tax/charges</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground">Tax & VAT Withheld</span>
              <p className="text-lg font-bold mt-1 text-foreground font-mono">
                {formatAmount(overallTotals.tax + overallTotals.vat, undefined, true)}
              </p>
              <span className="text-[10px] text-amber-600 font-medium">Compliance Total</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-primary/5 border-primary/20 shadow-xs">
              <span className="text-[11px] font-medium text-primary">Grand Payable Total</span>
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
                <span>Filter Supplier Bills</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
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

              {/* Bill Status */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Bill Status</label>
                <select
                  value={filterBillStatus}
                  onChange={(e) => setFilterBillStatus(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Bill Type */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Bill Type</label>
                <select
                  value={filterBillType}
                  onChange={(e) => setFilterBillType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Local">Local</option>
                  <option value="Foreign">Foreign</option>
                  <option value="Service">Service</option>
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
            </div>
          </div>

          {/* Grouped Month-wise Supplier Bill Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1550px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3 whitespace-nowrap">Month</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Bill Date</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Bill No.</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Supplier / Vendor</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">PO/WO No.</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">MRR No.</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Total Qty</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Bill Amount</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Discount</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Tax</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">VAT</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Other Charges</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Total Amount</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Status</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {Object.keys(groupedByMonth).length === 0 ? (
                    <tr>
                      <td colSpan={15} className="py-8 text-center text-muted-foreground">
                        No supplier bill records found matching the specified filters.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(groupedByMonth).map(([monthKey, group]) => {
                      const groupQty = group.rows.reduce((s, r) => s + (r.quantity || 0), 0);
                      const groupBillAmt = group.rows.reduce((s, r) => s + r.billAmount, 0);
                      const groupDiscount = group.rows.reduce((s, r) => s + r.discount, 0);
                      const groupTax = group.rows.reduce((s, r) => s + r.tax, 0);
                      const groupVat = group.rows.reduce((s, r) => s + r.vat, 0);
                      const groupOther = group.rows.reduce((s, r) => s + r.otherCharges, 0);
                      const groupTotal = group.rows.reduce((s, r) => s + r.totalAmount, 0);

                      return (
                        <tbody key={monthKey} className="divide-y divide-border/50">
                          {/* Group Header */}
                          <tr className="bg-primary/5 font-bold text-primary border-t-2 border-primary/20">
                            <td colSpan={15} className="py-2 px-3 text-xs tracking-wide">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <Calendar className="size-3.5 text-primary" />
                                  <span>{group.label}</span>
                                  <span className="text-[10px] font-normal text-muted-foreground">
                                    ({group.rows.length} invoices)
                                  </span>
                                </span>
                                <span className="text-xs font-mono">
                                  Month Net Payable: {formatAmount(groupTotal, undefined, true)}
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Rows */}
                          {group.rows.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/40 transition">
                              <td className="py-2 px-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                                {row.monthLabel}
                              </td>
                              <td className="py-2 px-3 text-foreground whitespace-nowrap">
                                {row.billDate}
                              </td>
                              <td className="py-2 px-3 font-semibold text-primary font-mono whitespace-nowrap">
                                {row.billNo}
                              </td>
                              <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                                {row.supplier}
                              </td>
                              <td className="py-2 px-3 font-mono text-muted-foreground whitespace-nowrap">
                                {row.poWoNo}
                              </td>
                              <td className="py-2 px-3 font-mono text-muted-foreground whitespace-nowrap">
                                {row.mrrNo}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-semibold text-foreground whitespace-nowrap">
                                {(row.quantity || 0).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-foreground font-semibold whitespace-nowrap">
                                {formatAmount(row.billAmount)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                                {formatAmount(row.discount)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                                {formatAmount(row.tax)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                                {formatAmount(row.vat)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                                {formatAmount(row.otherCharges)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-primary whitespace-nowrap">
                                {formatAmount(row.totalAmount)}
                              </td>
                              <td className="py-2 px-3 text-center whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    row.status === "Paid"
                                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                      : row.status === "Approved"
                                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center whitespace-nowrap">
                                <button
                                  onClick={() => setSelectedBillModal(row)}
                                  className="p-1 rounded-md hover:bg-muted text-primary cursor-pointer transition"
                                  title="View Supplier Bill Details"
                                >
                                  <Eye className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}

                          {/* Monthly Subtotal */}
                          <tr className="bg-muted/60 font-bold text-foreground border-b-2 border-border/80">
                            <td colSpan={6} className="py-2 px-3 text-right text-[11px] uppercase tracking-wide">
                              Subtotal for {group.label}:
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                              {groupQty.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-right font-mono">{formatAmount(groupBillAmt)}</td>
                            <td className="py-2 px-3 text-right font-mono">{formatAmount(groupDiscount)}</td>
                            <td className="py-2 px-3 text-right font-mono">{formatAmount(groupTax)}</td>
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
                  <tfoot className="bg-primary/10 text-foreground font-black border-t-2 border-primary/30 sticky bottom-0">
                    <tr>
                      <td colSpan={6} className="py-3 px-3 text-right text-xs uppercase tracking-wider text-primary">
                        OVERALL GRAND TOTAL:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs font-black text-primary">
                        {overallTotals.quantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {formatAmount(overallTotals.billAmount)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {formatAmount(overallTotals.discount)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {formatAmount(overallTotals.tax)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {formatAmount(overallTotals.vat)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {formatAmount(overallTotals.other)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm text-primary font-black">
                        {formatAmount(overallTotals.total, undefined, true)}
                      </td>
                      <td colSpan={2} className="py-3 px-3 text-center text-[10px] text-muted-foreground">
                        {filteredRows.length} Bills Total
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border text-xs text-muted-foreground">
              <div>
                Showing <span className="font-bold text-foreground">{filteredRows.length}</span> supplier bills across {Object.keys(groupedByMonth).length} months.
              </div>
              <div className="text-[11px] font-mono">
                Currency: <span className="font-bold text-foreground">{currencyCfg.currencyCode}</span> ({currencyCfg.symbol}) | Format: <span className="font-bold text-foreground">{currencyCfg.format}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Supplier Bill Detail Modal */}
      {selectedBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Supplier Bill Voucher — {selectedBillModal.billNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBillModal(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Supplier</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedBillModal.supplier}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Company</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedBillModal.company}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Bill Date</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedBillModal.billDate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Bill Type / Status</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{selectedBillModal.billType} ({selectedBillModal.status})</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border border-border/60 rounded-xl p-3">
                <div><span className="text-muted-foreground">PO/WO Ref:</span> <span className="font-bold font-mono ml-1">{selectedBillModal.poWoNo}</span></div>
                <div><span className="text-muted-foreground">MRR / Receipt:</span> <span className="font-bold font-mono ml-1">{selectedBillModal.mrrNo}</span></div>
              </div>

              <div className="space-y-1.5 rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs">
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Gross Invoice Amount:</span>
                  <span className="font-mono">{formatAmount(selectedBillModal.billAmount)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Discount Allowed:</span>
                  <span className="font-mono">-{formatAmount(selectedBillModal.discount)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>AIT / Tax Withheld:</span>
                  <span className="font-mono">+{formatAmount(selectedBillModal.tax)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>VAT (Direct Output):</span>
                  <span className="font-mono">+{formatAmount(selectedBillModal.vat)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Other Incidental Charges:</span>
                  <span className="font-mono">+{formatAmount(selectedBillModal.otherCharges)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-primary/20 font-bold text-sm text-primary">
                  <span>Net Payable Amount:</span>
                  <span className="font-mono">{formatAmount(selectedBillModal.totalAmount, undefined, true)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/20">
              <button
                onClick={() => {
                  setSelectedBillModal(null);
                  navigate({ to: "/procurement-billing-supplier-bill-list" });
                }}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold cursor-pointer"
              >
                Go to Bill Register
              </button>
              <button
                onClick={() => setSelectedBillModal(null)}
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
