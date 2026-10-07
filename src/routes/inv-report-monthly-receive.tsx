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
  ArrowDownLeft,
  Calendar,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_RECEIPT_REGISTER_DATA,
  ItemReceiptRow,
  ReceiptSourceType,
} from "@/lib/reports-mock-data";
import { formatAmount } from "@/lib/currency-format-utils";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-monthly-receive")({
  head: () => ({
    meta: [
      { title: "Month-wise Material Receive Report — Inventory | CRIPTON" },
      {
        name: "description",
        content:
          "Monthly aggregated report of all incoming inventory with subtotals, item specifications, and source analysis.",
      },
    ],
  }),
  component: MonthWiseMaterialReceiveReportPage,
});

export function MonthWiseMaterialReceiveReportPage() {
  // Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterItem, setFilterItem] = useState("All");
  const [filterItemGroup, setFilterItemGroup] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterReceiptType, setFilterReceiptType] = useState("All");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [fromMonth, setFromMonth] = useState("2026-08");
  const [toMonth, setToMonth] = useState("2026-10");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(null);

  const receiptTypes: ReceiptSourceType[] = [
    "Material Receipt",
    "Direct Receipt",
    "Transfer Receive",
    "Store Return Receive",
    "Opening Stock",
    "Adjustment +",
  ];

  const companies = useMemo(
    () => Array.from(new Set(INITIAL_RECEIPT_REGISTER_DATA.map((r) => r.company))),
    []
  );
  const stores = useMemo(
    () => Array.from(new Set(INITIAL_RECEIPT_REGISTER_DATA.map((r) => r.store))),
    []
  );
  const items = useMemo(
    () => Array.from(new Set(INITIAL_RECEIPT_REGISTER_DATA.map((r) => r.itemName))),
    []
  );
  const itemGroups = useMemo(
    () => Array.from(new Set(INITIAL_RECEIPT_REGISTER_DATA.map((r) => r.itemGroup))),
    []
  );
  const suppliers = useMemo(
    () => Array.from(new Set(INITIAL_RECEIPT_REGISTER_DATA.map((r) => r.supplier))),
    []
  );

  const filteredRows = useMemo(() => {
    return INITIAL_RECEIPT_REGISTER_DATA.filter((row) => {
      if (filterCompany !== "All" && row.company !== filterCompany) return false;
      if (filterStore !== "All" && row.store !== filterStore) return false;
      if (filterItem !== "All" && row.itemName !== filterItem) return false;
      if (filterItemGroup !== "All" && row.itemGroup !== filterItemGroup) return false;
      if (filterSupplier !== "All" && row.supplier !== filterSupplier) return false;
      if (filterReceiptType !== "All" && row.receiptType !== filterReceiptType) return false;
      if (filterBatch.trim() && !row.batch.toLowerCase().includes(filterBatch.toLowerCase().trim()))
        return false;
      if (filterLocation.trim() && !row.location.toLowerCase().includes(filterLocation.toLowerCase().trim()))
        return false;

      if (fromMonth && row.month < fromMonth) return false;
      if (toMonth && row.month > toMonth) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.reference.toLowerCase().includes(q) ||
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.supplier.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    filterCompany,
    filterStore,
    filterItem,
    filterItemGroup,
    filterSupplier,
    filterReceiptType,
    filterBatch,
    filterLocation,
    fromMonth,
    toMonth,
    searchQuery,
  ]);

  // Grouped by Month
  const groupedByMonth = useMemo(() => {
    const groups: { [key: string]: { label: string; rows: ItemReceiptRow[] } } = {};
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

  const totalQty = useMemo(() => filteredRows.reduce((s, r) => s + r.quantity, 0), [filteredRows]);

  const handleResetFilters = () => {
    setFilterCompany("All");
    setFilterStore("All");
    setFilterItem("All");
    setFilterItemGroup("All");
    setFilterSupplier("All");
    setFilterReceiptType("All");
    setFilterBatch("");
    setFilterLocation("");
    setFromMonth("2026-08");
    setToMonth("2026-10");
    setSearchQuery("");
    toast.info("Filters reset");
  };

  const handleExportCSV = () => {
    const headers = [
      "Month",
      "Receipt Date",
      "Receipt Type",
      "Receipt Reference",
      "Item Code",
      "Item Name",
      "Specification",
      "Brand",
      "Origin",
      "UOM",
      "Store",
      "Batch",
      "Location",
      "Received Quantity",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.monthLabel,
      r.date,
      r.receiptType,
      r.reference,
      r.itemCode,
      r.itemName,
      r.specification,
      r.brand,
      r.origin,
      r.uom,
      r.store,
      r.batch,
      r.location,
      r.quantity,
      r.status,
    ]);

    exportToCSV(`Month_wise_Material_Receive_Report_${fromMonth}_to_${toMonth}.csv`, headers, rows);
    toast.success("CSV export downloaded successfully!");
  };

  const handleExportExcel = () => {
    const headers = [
      "Month",
      "Receipt Date",
      "Receipt Type",
      "Receipt Reference",
      "Item Code",
      "Item Name",
      "Specification",
      "Brand",
      "Origin",
      "UOM",
      "Store",
      "Batch",
      "Location",
      "Received Quantity",
      "Status",
    ];

    const rows = filteredRows.map((r) => [
      r.monthLabel,
      r.date,
      r.receiptType,
      r.reference,
      r.itemCode,
      r.itemName,
      r.specification,
      r.brand,
      r.origin,
      r.uom,
      r.store,
      r.batch,
      r.location,
      r.quantity,
      r.status,
    ]);

    exportToExcel(
      `Month_wise_Material_Receive_Report_${fromMonth}_to_${toMonth}.xls`,
      "Month-wise Material Receive Report",
      headers,
      rows,
      [{ label: "Overall Total Received Quantity", value: totalQty.toLocaleString() }]
    );
    toast.success("Excel report generated successfully!");
  };

  const handlePrintPDF = () => {
    const tableHeaders = [
      "Month",
      "Date",
      "Type",
      "Ref",
      "Item",
      "Store",
      "Batch/Loc",
      "Qty",
      "Status",
    ];

    const tableRows = filteredRows.map((r) => [
      r.monthLabel,
      r.date,
      r.receiptType,
      r.reference,
      r.itemName,
      r.store,
      r.batch || r.location,
      r.quantity,
      r.status,
    ]);

    setPdfReportData({
      reportTitle: "MONTH-WISE MATERIAL RECEIVE REPORT",
      documentNumber: `M-REC-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString("en-GB"),
      companyName: filterCompany !== "All" ? filterCompany : "Pakiza Group of Industries",
      department: "Material Receiving & Logistics",
      metadata: [
        { label: "Period", value: `${fromMonth} to ${toMonth}` },
        { label: "Total Receipts", value: filteredRows.length },
      ],
      tableHeaders,
      tableRows,
      financials: [{ label: "Overall Received Qty", value: totalQty.toLocaleString(), highlight: true }],
      signatures: [
        { role: "Receiving Supervisor", name: "Inward Store Keeper" },
        { role: "Inventory Manager", name: "Central Operations" },
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
                  Month-wise Material Receive Report
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Monthly Inward Registers
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly aggregated inbound volumes across purchase receipts, direct receipts, transfers, and store returns.
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
                <span>Filter Monthly Material Receipts</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
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
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Supplier</label>
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

              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Receipt Type (6)</label>
                <select
                  value={filterReceiptType}
                  onChange={(e) => setFilterReceiptType(e.target.value)}
                  className="w-full mt-1 h-8 px-2 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="All">All 6 Types</option>
                  {receiptTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
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
              <table className="w-full text-xs text-left border-collapse min-w-[1450px]">
                <thead className="bg-muted/80 text-muted-foreground font-semibold uppercase text-[10.5px] sticky top-0 z-10 backdrop-blur-xs border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3">Receipt Date</th>
                    <th className="py-2.5 px-3">Receipt Type</th>
                    <th className="py-2.5 px-3">Receipt Reference</th>
                    <th className="py-2.5 px-3">Item Code</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Specification</th>
                    <th className="py-2.5 px-3">Brand</th>
                    <th className="py-2.5 px-3">Origin</th>
                    <th className="py-2.5 px-3">UOM</th>
                    <th className="py-2.5 px-3">Store</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">Received Qty</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {Object.keys(groupedByMonth).length === 0 ? (
                    <tr>
                      <td colSpan={15} className="py-8 text-center text-muted-foreground">
                        No monthly receive transactions found.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(groupedByMonth).map(([monthKey, group]) => {
                      const groupQty = group.rows.reduce((s, r) => s + r.quantity, 0);

                      return (
                        <tbody key={monthKey} className="divide-y divide-border/50">
                          {/* Monthly Header */}
                          <tr className="bg-primary/5 font-bold text-primary border-t-2 border-primary/20">
                            <td colSpan={15} className="py-2 px-3 text-xs tracking-wide">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <Calendar className="size-3.5 text-primary" />
                                  <span>{group.label}</span>
                                  <span className="text-[10px] font-normal text-muted-foreground">
                                    ({group.rows.length} incoming receipts)
                                  </span>
                                </span>
                                <span className="text-xs font-mono font-bold">
                                  Subtotal Received: {groupQty.toLocaleString()} units
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Rows */}
                          {group.rows.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/40 transition">
                              <td className="py-2 px-3 text-muted-foreground font-mono text-[11px]">{row.monthLabel}</td>
                              <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.date}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {row.receiptType}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-mono font-semibold text-primary whitespace-nowrap">{row.reference}</td>
                              <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground">{row.itemCode}</td>
                              <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">{row.itemName}</td>
                              <td className="py-2 px-3 text-muted-foreground max-w-[200px] truncate" title={row.specification}>{row.specification}</td>
                              <td className="py-2 px-3 text-foreground">{row.brand}</td>
                              <td className="py-2 px-3 text-foreground">{row.origin}</td>
                              <td className="py-2 px-3 text-muted-foreground">{row.uom}</td>
                              <td className="py-2 px-3 text-foreground whitespace-nowrap">{row.store}</td>
                              <td className="py-2 px-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">{row.batch || "-"}</td>
                              <td className="py-2 px-3 text-muted-foreground font-mono text-[11px]">{row.location || "-"}</td>
                              <td className="py-2 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                                +{row.quantity.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-center whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}

                          {/* Subtotal */}
                          <tr className="bg-muted/60 font-bold text-foreground border-b-2 border-border/80">
                            <td colSpan={13} className="py-2 px-3 text-right text-[11px] uppercase tracking-wide">
                              Monthly Subtotal ({group.label}):
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              +{groupQty.toLocaleString()}
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      );
                    })
                  )}
                </tbody>

                {filteredRows.length > 0 && (
                  <tfoot className="bg-primary/10 text-foreground font-black border-t-2 border-primary/30">
                    <tr>
                      <td colSpan={13} className="py-3 px-3 text-right text-xs uppercase tracking-wider text-primary">
                        OVERALL GRAND TOTAL RECEIVED:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm text-primary font-black">
                        +{totalQty.toLocaleString()} Units
                      </td>
                      <td className="py-3 px-3 text-center text-[10px] text-muted-foreground">
                        {filteredRows.length} Total Receipts
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
