import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
} from "lucide-react";

export const Route = createFileRoute("/procurement-reports-payment-statement")({
  head: () => ({
    meta: [
      { title: "Payment Statement Report — Procurement | CRIPTON" },
      { name: "description", content: "Supplier Payment Statement, previous dues, billing amounts, payments settled, and transaction breakdown ledger." },
    ],
  }),
  component: ProcurementReportsPaymentStatementPage,
});

export interface BillTransactionItem {
  sl: number | string;
  billDate: string;
  billNo: string;
  amt: number;
}

export interface PaymentTransactionItem {
  sl: number | string;
  payDate: string;
  chqNo: string;
  amt: number;
}

export interface SupplierPaymentStatementRecord {
  id: string;
  supplier: string;
  location: string;
  preDue: number;
  billingAmt: number;
  paidAmt: number;
  dueBalance: number;
  bills: BillTransactionItem[];
  payments: PaymentTransactionItem[];
  discount: number;
}

const INITIAL_STATEMENT_RECORDS: SupplierPaymentStatementRecord[] = [
  {
    id: "stmt-001",
    supplier: "Madona Enterprise",
    location: "PAL-Fabric Dyeing",
    preDue: 164700.0,
    billingAmt: 299200.0,
    paidAmt: 0.0,
    dueBalance: 463900.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "30/10/2025", billNo: "5560", amt: 299200.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-002",
    supplier: "aamra RESOURCES",
    location: "PAL-Fabric Dyeing",
    preDue: 310000.0,
    billingAmt: 333000.0,
    paidAmt: 0.0,
    dueBalance: 643000.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "07/09/2025", billNo: "0073", amt: 333000.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-003",
    supplier: "Akota Traders",
    location: "PAL-Fabric Dyeing",
    preDue: 48714.0,
    billingAmt: 23500.0,
    paidAmt: 0.0,
    dueBalance: 72214.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "15/10/2025", billNo: "890", amt: 23500.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-004",
    supplier: "Al-Amin Multimedia",
    location: "PAL-Fabric Dyeing",
    preDue: 70485.0,
    billingAmt: 200.0,
    paidAmt: 0.0,
    dueBalance: 70685.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "19/11/2025", billNo: "2122", amt: 200.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-005",
    supplier: "AL-HELAL CORPORATION (PVT) LTD.",
    location: "PAL-Fabric Dyeing",
    preDue: 513626.25,
    billingAmt: 33000.0,
    paidAmt: 0.0,
    dueBalance: 546626.25,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "04/12/2025", billNo: "HC-904", amt: 33000.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-006",
    supplier: "ALTA VISTA TRADING INTERNATIONAL",
    location: "PAL-Fabric Dyeing",
    preDue: 3463567.03,
    billingAmt: 356440.0,
    paidAmt: 0.0,
    dueBalance: 3820007.03,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "12/01/2026", billNo: "AVTI-1092", amt: 356440.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-007",
    supplier: "Altaf Electric Stores",
    location: "PAL-Fabric Dyeing",
    preDue: 211957.0,
    billingAmt: 9400.0,
    paidAmt: 0.0,
    dueBalance: 221357.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "05/02/2026", billNo: "AES-341", amt: 9400.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-008",
    supplier: "Ambia Furniture",
    location: "PAL-Fabric Dyeing",
    preDue: 54900.0,
    billingAmt: 15300.0,
    paidAmt: 0.0,
    dueBalance: 70200.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "14/02/2026", billNo: "AMB-201", amt: 15300.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-009",
    supplier: "Amin Boiler House",
    location: "PAL-Fabric Dyeing",
    preDue: 0.0,
    billingAmt: 2500.0,
    paidAmt: 0.0,
    dueBalance: 2500.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "20/02/2026", billNo: "ABH-098", amt: 2500.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-010",
    supplier: "Apple Enterprise",
    location: "PAL-Fabric Dyeing",
    preDue: 45600.0,
    billingAmt: 22800.0,
    paidAmt: 0.0,
    dueBalance: 68400.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "02/03/2026", billNo: "APL-771", amt: 22800.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-011",
    supplier: "Ariful Bearing House",
    location: "PAL-Fabric Dyeing",
    preDue: 3647.5,
    billingAmt: 100.0,
    paidAmt: 0.0,
    dueBalance: 3747.5,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "10/03/2026", billNo: "ABH-110", amt: 100.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-012",
    supplier: "Autech International",
    location: "PAL-Fabric Dyeing",
    preDue: 535000.0,
    billingAmt: 29400.0,
    paidAmt: 0.0,
    dueBalance: 564400.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "22/03/2026", billNo: "ATI-449", amt: 29400.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-013",
    supplier: "B. Baria Belt Gallery",
    location: "PAL-Fabric Dyeing",
    preDue: 800.0,
    billingAmt: 1000.0,
    paidAmt: 0.0,
    dueBalance: 1800.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "01/04/2026", billNo: "BB-020", amt: 1000.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-014",
    supplier: "B.T. Tex. Access",
    location: "PAL-Fabric Dyeing",
    preDue: 528290.0,
    billingAmt: 33200.0,
    paidAmt: 0.0,
    dueBalance: 561490.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "15/04/2026", billNo: "BTT-993", amt: 33200.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-015",
    supplier: "Bangladesh Machineries & Suppliers",
    location: "PAL-Fabric Dyeing",
    preDue: 0.0,
    billingAmt: 48000.0,
    paidAmt: 0.0,
    dueBalance: 48000.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "28/04/2026", billNo: "BMS-561", amt: 48000.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-016",
    supplier: "Barnali",
    location: "PAL-Fabric Dyeing",
    preDue: 152450.0,
    billingAmt: 11500.0,
    paidAmt: 0.0,
    dueBalance: 163950.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "10/05/2026", billNo: "BRN-102", amt: 11500.0 },
    ],
    payments: [],
  },
  {
    id: "stmt-017",
    supplier: "BHAI BHAI ENTERPRISE",
    location: "PAL-Fabric Dyeing",
    preDue: 63790.0,
    billingAmt: 5700.0,
    paidAmt: 0.0,
    dueBalance: 69490.0,
    discount: 0.0,
    bills: [
      { sl: 2, billDate: "25/05/2026", billNo: "BBE-883", amt: 5700.0 },
    ],
    payments: [],
  },
];

const LOCATION_OPTIONS = [
  "PAL-Fabric Dyeing",
  "PKCL-Savar",
  "PWFL-Nowpara",
  "PSL-Operation",
  "All Locations",
];

function ProcurementReportsPaymentStatementPage() {
  // Filter States
  const [billLocation, setBillLocation] = useState("PAL-Fabric Dyeing");
  const [dateFrom, setDateFrom] = useState("2025-09-01");
  const [dateTo, setDateTo] = useState("2026-09-08");

  // Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    billLocation: "PAL-Fabric Dyeing",
    dateFrom: "2025-09-01",
    dateTo: "2026-09-08",
  });

  // Table Search & Pagination
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Selected check rows
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Transaction Statement Modal State (Screenshot 2)
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const handleApplyFilter = () => {
    setAppliedFilters({
      billLocation,
      dateFrom,
      dateTo,
    });
    setCurrentPage(1);
  };

  // Filtered List
  const filteredRecords = useMemo(() => {
    return INITIAL_STATEMENT_RECORDS.filter((rec) => {
      // Location filter
      if (appliedFilters.billLocation !== "All Locations" && rec.location !== appliedFilters.billLocation) {
        return false;
      }
      // Table search
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        const match =
          rec.supplier.toLowerCase().includes(q) ||
          rec.preDue.toString().includes(q) ||
          rec.billingAmt.toString().includes(q) ||
          rec.dueBalance.toString().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [appliedFilters, tableSearch]);

  // Select all toggler
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length && filteredRecords.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Items to show in the Transaction Statement Modal
  const itemsForTransactionModal = useMemo(() => {
    if (selectedIds.length > 0) {
      return filteredRecords.filter((r) => selectedIds.includes(r.id));
    }
    return filteredRecords;
  }, [filteredRecords, selectedIds]);

  // Pagination
  const totalEntries = filteredRecords.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Supplier", "PreDue", "BillingAmt", "PaidAmt", "DueBalance"];
    const rows = filteredRecords.map((r) => [
      `"${r.supplier.replace(/"/g, '""')}"`,
      r.preDue.toFixed(2),
      r.billingAmt.toFixed(2),
      r.paidAmt.toFixed(2),
      r.dueBalance.toFixed(2),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payment_statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTable = () => {
    window.print();
  };

  const formatDateDisplay = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    if (!y || !m || !d) return dateStr;
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-7 space-y-5 w-full max-w-[1700px] mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-[#1890ff]" />
                Payment Statement
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Procurement Workspace &gt; Reports &gt; <span className="text-[#1890ff] font-medium">Payment Statement</span>
              </p>
            </div>
          </div>

          {/* Top Filter Card (Matching Screenshot 1 with blue left accent bar) */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-[#1890ff] p-5 pl-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              {/* Bill Location */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bill Location
                </label>
                <select
                  value={billLocation}
                  onChange={(e) => setBillLocation(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                >
                  {LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>

              {/* SHOW Button */}
              <div>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="w-24 h-8 bg-[#1890ff] hover:bg-sky-600 text-white font-bold text-xs uppercase rounded transition-colors shadow-2xs cursor-pointer flex items-center justify-center tracking-wider"
                >
                  SHOW
                </button>
              </div>

              {/* TRANSACTION Button (Green button in Screenshot 1) */}
              <div>
                <button
                  type="button"
                  onClick={() => setTransactionModalOpen(true)}
                  className="w-28 h-8 bg-[#689f38] hover:bg-green-700 text-white font-bold text-xs uppercase rounded transition-colors shadow-2xs cursor-pointer flex items-center justify-center tracking-wider"
                >
                  TRANSACTION
                </button>
              </div>
            </div>
          </div>

          {/* Table Card (Matching Screenshot 1) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden">
            {/* Toolbar: EXCEL, PRINT, PDF, Search */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {/* Left Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  EXCEL
                </button>
                <button
                  type="button"
                  onClick={handlePrintTable}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="size-3.5 text-blue-600" />
                  PRINT
                </button>
                <button
                  type="button"
                  onClick={handlePrintTable}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <FileText className="size-3.5 text-rose-600" />
                  PDF
                </button>
              </div>

              {/* Right Search Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-8 w-48 sm:w-64 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredRecords.length && filteredRecords.length > 0}
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff] size-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-4 min-w-[260px]">Supplier</th>
                    <th className="py-2.5 px-4 min-w-[140px] text-right">PreDue</th>
                    <th className="py-2.5 px-4 min-w-[140px] text-right">BillingAmt</th>
                    <th className="py-2.5 px-4 min-w-[140px] text-right">PaidAmt</th>
                    <th className="py-2.5 px-4 min-w-[140px] text-right">DueBalance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                        No supplier payment records found matching criteria
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-sky-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                          selectedIds.includes(row.id) ? "bg-sky-50/60 dark:bg-sky-950/30" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => handleToggleRow(row.id)}
                            className="rounded border-slate-300 text-[#1890ff] focus:ring-[#1890ff] size-3.5 cursor-pointer"
                          />
                        </td>

                        {/* Supplier */}
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {row.supplier}
                        </td>

                        {/* PreDue */}
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                          {row.preDue.toFixed(2)}
                        </td>

                        {/* BillingAmt */}
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                          {row.billingAmt.toFixed(2)}
                        </td>

                        {/* PaidAmt */}
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                          {row.paidAmt.toFixed(2)}
                        </td>

                        {/* DueBalance */}
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {row.dueBalance.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Status Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                Showing {totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-[#1890ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-7 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#52c41a] text-white shadow-2xs"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-[#1890ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: Transactions Date Between Report (Matching Screenshot 2)         */}
      {/* ========================================================================= */}
      {transactionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-lg shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-300">
            {/* Modal Screen-Only Action Bar */}
            <div className="print:hidden px-5 py-2.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-4 text-[#1890ff]" />
                <span className="text-xs font-bold text-slate-800">
                  Transactions Statement Report Preview ({itemsForTransactionModal.length} suppliers)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#1890ff] hover:bg-sky-600 text-white font-semibold text-xs rounded flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print Statement
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionModalOpen(false)}
                  className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Sheet (Matching Screenshot 2) */}
            <div className="p-6 md:p-8 bg-white font-sans text-xs space-y-6 max-h-[85vh] overflow-y-auto">
              {/* Document Header */}
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-[#52c41a] tracking-wide">
                  Pakiza Apparels Limited
                </h2>
                <p className="text-[11px] text-slate-600">
                  Khordo Nowpara, Rasulpur, Madhabdi, Narsingdi
                </p>
                <h3 className="text-sm font-semibold text-sky-500 pt-1 tracking-wide">
                  Transactions Date Between {formatDateDisplay(appliedFilters.dateFrom)} And {formatDateDisplay(appliedFilters.dateTo)}
                </h3>
              </div>

              {/* 3-Column Grid of Transaction Cards (Matching Screenshot 2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {itemsForTransactionModal.map((sup) => (
                  <div
                    key={sup.id}
                    className="border border-slate-300 rounded p-3 space-y-3 bg-white shadow-2xs text-[11px]"
                  >
                    {/* Supplier Name Title */}
                    <div className="font-semibold text-sky-600 italic truncate pb-1">
                      {sup.supplier}
                    </div>

                    {/* Bills Section Table (Pink Header) */}
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#ffebee] border-b border-slate-200 text-slate-800 font-bold text-[10.5px]">
                            <th className="py-1 px-2 w-16">Sl</th>
                            <th className="py-1 px-2">Bill Date</th>
                            <th className="py-1 px-2">Bill No</th>
                            <th className="py-1 px-2 text-right">Amt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {/* Opening Row */}
                          <tr className="bg-slate-50/40">
                            <td className="py-1 px-2 font-medium">Opening</td>
                            <td className="py-1 px-2"></td>
                            <td className="py-1 px-2"></td>
                            <td className="py-1 px-2 text-right font-mono font-medium">
                              {sup.preDue.toFixed(2)}
                            </td>
                          </tr>

                          {/* Dynamic Bill Rows */}
                          {sup.bills.map((bill, idx) => (
                            <tr key={idx}>
                              <td className="py-1 px-2">{bill.sl}</td>
                              <td className="py-1 px-2 text-slate-600">{bill.billDate}</td>
                              <td className="py-1 px-2 font-mono text-slate-700">{bill.billNo}</td>
                              <td className="py-1 px-2 text-right font-mono">
                                {bill.amt.toFixed(2)}
                              </td>
                            </tr>
                          ))}

                          {/* Bill Total */}
                          <tr className="border-t border-slate-300 font-bold bg-slate-50/70">
                            <td colSpan={3} className="py-1 px-2 text-right">
                              Bill Total
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-slate-900">
                              {(sup.preDue + sup.billingAmt).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Payments Section Table (Lavender Header) */}
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#f3e5f5] border-b border-slate-200 text-slate-800 font-bold text-[10.5px]">
                            <th className="py-1 px-2 w-16">Sl</th>
                            <th className="py-1 px-2">Pay Date</th>
                            <th className="py-1 px-2">Chq No</th>
                            <th className="py-1 px-2 text-right">Amt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {/* Payment Rows if any */}
                          {sup.payments.length === 0 ? null : (
                            sup.payments.map((pay, pIdx) => (
                              <tr key={pIdx}>
                                <td className="py-1 px-2">{pay.sl}</td>
                                <td className="py-1 px-2 text-slate-600">{pay.payDate}</td>
                                <td className="py-1 px-2 font-mono text-slate-700">{pay.chqNo}</td>
                                <td className="py-1 px-2 text-right font-mono">
                                  {pay.amt.toFixed(2)}
                                </td>
                              </tr>
                            ))
                          )}

                          {/* Pay Total */}
                          <tr className="font-bold">
                            <td colSpan={3} className="py-1 px-2 text-right text-slate-700">
                              Pay Total
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-slate-900">
                              {sup.paidAmt.toFixed(2)}
                            </td>
                          </tr>

                          {/* Discount */}
                          <tr>
                            <td colSpan={3} className="py-1 px-2 text-right text-slate-600">
                              Discount
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-slate-700">
                              {sup.discount.toFixed(2)}
                            </td>
                          </tr>

                          {/* Out Standing */}
                          <tr className="border-t border-slate-300 font-black bg-slate-50/70">
                            <td colSpan={3} className="py-1 px-2 text-right text-slate-900">
                              Out Standing
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-slate-950">
                              {sup.dueBalance.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
