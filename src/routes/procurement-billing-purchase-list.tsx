import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Search,
  Printer,
  FileSpreadsheet,
  FileText,
  Eye,
  X,
  Filter,
  Calendar,
  MapPin,
  Package,
  Building,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-billing-purchase-list")({
  head: () => ({
    meta: [
      { title: "Purchase List — Billing | CRIPTON Procurement" },
      { name: "description", content: "Procurement Billing Purchase List Registry with location, date, and document filters." },
    ],
  }),
  component: PurchaseListPage,
});

export interface BillItem {
  sl: number;
  product: string;
  unit: string;
  quantity: number;
  rate: number;
  total: number;
  dcPrice: number;
  landedCost: number;
}

export interface PurchaseBillRecord {
  id: string;
  billNo: string;
  billDate: string;
  supplier: string;
  type: string; // e.g. Local
  currency: string; // e.g. BDT
  rate: string; // e.g. N/A or numerical
  billTo?: string;
  address?: string;
  currencyRateTk?: number;
  items?: BillItem[];
  vatAmt?: number;
  taxAmt?: number;
  otherAmt?: number;
  discount?: number;
}

const DEFAULT_SAMPLE_ITEMS: BillItem[] = [
  { sl: 1, product: "Photolac Blue RS 1203", unit: "KG", quantity: 120.00, rate: 1130, total: 135600, dcPrice: 1130.00, landedCost: 1130.00 },
  { sl: 2, product: "Rotary Screen Stripper", unit: "KG", quantity: 420.00, rate: 350, total: 147000, dcPrice: 350.00, landedCost: 350.00 },
  { sl: 3, product: "Photo Emulsion RS-100 with sensitizer", unit: "KG", quantity: 360.00, rate: 1180, total: 424800, dcPrice: 1180.00, landedCost: 1180.00 },
  { sl: 4, product: "Endring Remover SER-30", unit: "KG", quantity: 120.00, rate: 240, total: 28800, dcPrice: 240.00, landedCost: 240.00 },
  { sl: 5, product: "Flat Bed Striper", unit: "KG", quantity: 810.00, rate: 150, total: 121500, dcPrice: 150.00, landedCost: 150.00 },
  { sl: 6, product: "Flatbed Screen Cleaner", unit: "KG", quantity: 330.00, rate: 300, total: 99000, dcPrice: 300.00, landedCost: 300.00 },
];

const INITIAL_PURCHASE_BILLS: PurchaseBillRecord[] = [
  {
    id: "bill-1970",
    billNo: "1970",
    billDate: "05/09/2026",
    supplier: "M/S H.M. Hero Chemicals",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
    billTo: "Pakiza Apparels Limited",
    address: "PAL-AOP",
    currencyRateTk: 1.000,
    items: DEFAULT_SAMPLE_ITEMS,
    vatAmt: 0.00,
    taxAmt: 0.00,
    otherAmt: 0.00,
    discount: 0.00,
  },
  {
    id: "bill-908",
    billNo: "908",
    billDate: "01/09/2026",
    supplier: "JAMUNA CHEMICALS",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
    billTo: "Pakiza Knit Composite Ltd",
    address: "PKCL-Savar",
    currencyRateTk: 1.000,
    items: [
      { sl: 1, product: "Sodium Hydrosulfite 88%", unit: "KG", quantity: 500.00, rate: 195, total: 97500, dcPrice: 195.00, landedCost: 195.00 },
      { sl: 2, product: "Hydrogen Peroxide 50%", unit: "KG", quantity: 800.00, rate: 85, total: 68000, dcPrice: 85.00, landedCost: 85.00 },
      { sl: 3, product: "Caustic Soda Flakes", unit: "KG", quantity: 1000.00, rate: 72, total: 72000, dcPrice: 72.00, landedCost: 72.00 },
    ],
    vatAmt: 0.00,
    taxAmt: 0.00,
    otherAmt: 0.00,
    discount: 0.00,
  },
  {
    id: "bill-22980",
    billNo: "22980",
    billDate: "01/09/2026",
    supplier: "Alpha Corporation",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
    billTo: "Pakiza Apparels Limited",
    address: "PAL-AOP",
    currencyRateTk: 1.000,
    items: [
      { sl: 1, product: "Fixing Agent FX-90", unit: "KG", quantity: 250.00, rate: 420, total: 105000, dcPrice: 420.00, landedCost: 420.00 },
      { sl: 2, product: "Softener Cationic Flakes", unit: "KG", quantity: 600.00, rate: 160, total: 96000, dcPrice: 160.00, landedCost: 160.00 },
    ],
    vatAmt: 0.00,
    taxAmt: 0.00,
    otherAmt: 0.00,
    discount: 0.00,
  },
  {
    id: "bill-9496",
    billNo: "9496",
    billDate: "01/09/2026",
    supplier: "Samuda Chemical Complex Ltd",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
    billTo: "Pakiza Knit Composite Ltd",
    address: "PKCL-Savar",
    currencyRateTk: 1.000,
  },
  {
    id: "bill-7226",
    billNo: "7226",
    billDate: "31/08/2026",
    supplier: "Harmony Chem Ltd.",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
    billTo: "Pakiza Software Limited",
    address: "PSL-Operation",
    currencyRateTk: 1.000,
  },
  {
    id: "bill-2701",
    billNo: "2701",
    billDate: "27/08/2026",
    supplier: "Dysin International Ltd.",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
    billTo: "Pakiza Apparels Limited",
    address: "PAL-AOP",
    currencyRateTk: 1.000,
  },
  {
    id: "bill-6479",
    billNo: "6479",
    billDate: "25/08/2026",
    supplier: "Harmony Chem Ltd.",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-2405",
    billNo: "2405",
    billDate: "24/08/2026",
    supplier: "Dysin International Ltd.",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-698",
    billNo: "698",
    billDate: "23/08/2026",
    supplier: "Arafat Chemical",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-141",
    billNo: "141",
    billDate: "23/08/2026",
    supplier: "M/S SHAMS ENTERPRISE",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-1007",
    billNo: "1007",
    billDate: "19/08/2026",
    supplier: "M/S MM Traders",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-1006",
    billNo: "1006",
    billDate: "19/08/2026",
    supplier: "M/S MM Traders",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-15628",
    billNo: "15628",
    billDate: "17/08/2026",
    supplier: "WELL-CHEM ENTERPRISE",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-011",
    billNo: "011",
    billDate: "14/08/2026",
    supplier: "COLOR PLAN",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-1315",
    billNo: "1315",
    billDate: "13/08/2026",
    supplier: "Dysin International Ltd",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-24886",
    billNo: "24886",
    billDate: "13/08/2026",
    supplier: "Harmony Chem Ltd.",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-2421",
    billNo: "2421",
    billDate: "12/08/2026",
    supplier: "SB Chemical",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-3112",
    billNo: "3112",
    billDate: "12/08/2026",
    supplier: "WASH SOLUTION",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-24322",
    billNo: "24322",
    billDate: "10/08/2026",
    supplier: "Harmony Chem Ltd.",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-24218",
    billNo: "24218",
    billDate: "09/08/2026",
    supplier: "Harmony Chem Ltd.",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
  {
    id: "bill-5098",
    billNo: "5098",
    billDate: "08/08/2026",
    supplier: "Flexo Graphics",
    type: "Local",
    currency: "BDT",
    rate: "N/A",
  },
];

function PurchaseListPage() {
  // Filter States
  const [dateFrom, setDateFrom] = useState("2026-08-01");
  const [dateTo, setDateTo] = useState("2026-09-08");
  const [locationFilter, setLocationFilter] = useState("All");
  const [documentQuery, setDocumentQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");

  // Storage synced bill list
  const [billList, setBillList] = useState<PurchaseBillRecord[]>(() => {
    const saved = localStorage.getItem("procurement_purchase_bills_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PURCHASE_BILLS;
  });

  useEffect(() => {
    localStorage.setItem("procurement_purchase_bills_v1", JSON.stringify(billList));
  }, [billList]);

  // Modal viewing state
  const [viewingBill, setViewingBill] = useState<PurchaseBillRecord | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Filter logic
  const filteredBills = useMemo(() => {
    return billList.filter((bill) => {
      // Document Search (Bill No or Supplier)
      if (documentQuery.trim()) {
        const query = documentQuery.toLowerCase().trim();
        const matchesDoc = bill.billNo.toLowerCase().includes(query) || bill.supplier.toLowerCase().includes(query);
        if (!matchesDoc) return false;
      }

      // Location Filter
      if (locationFilter !== "All") {
        if (bill.address && bill.address !== locationFilter) return false;
      }

      // Product Query
      if (productQuery.trim()) {
        const pQuery = productQuery.toLowerCase().trim();
        if (bill.items && bill.items.length > 0) {
          const hasProduct = bill.items.some((item) => item.product.toLowerCase().includes(pQuery));
          if (!hasProduct) return false;
        }
      }

      return true;
    });
  }, [billList, documentQuery, locationFilter, productQuery]);

  const totalEntries = 1068; // Mock high total count matching screenshot
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage) || 1;

  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBills.slice(start, start + itemsPerPage);
  }, [filteredBills, currentPage]);

  const resetFilters = () => {
    setDateFrom("2026-08-01");
    setDateTo("2026-09-08");
    setLocationFilter("All");
    setDocumentQuery("");
    setProductQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <FileText className="size-6 text-blue-600 dark:text-blue-400" />
                Purchase List
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Procurement Workspace &gt; Billing &gt; <span className="text-blue-600 dark:text-blue-400 font-semibold">Purchase List</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="size-4" /> Print Report
              </button>
            </div>
          </div>

          {/* Search & Filters Bar Console */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Search &amp; Filter Parameters
                </h2>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end text-xs">
              
              {/* Date From */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="size-3.5 text-slate-400" /> Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Date To */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="size-3.5 text-slate-400" /> Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="size-3.5 text-slate-400" /> Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">All Locations</option>
                  <option value="PAL-AOP">PAL-AOP</option>
                  <option value="PKCL-Savar">PKCL-Savar</option>
                  <option value="PSL-Operation">PSL-Operation</option>
                </select>
              </div>

              {/* Document */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <FileText className="size-3.5 text-slate-400" /> Document (Bill / Supplier)
                </label>
                <input
                  type="text"
                  placeholder="Bill No or Supplier..."
                  value={documentQuery}
                  onChange={(e) => setDocumentQuery(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Package className="size-3.5 text-slate-400" /> Product Name
                </label>
                <input
                  type="text"
                  placeholder="Photolac, Chemical..."
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="h-9 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition cursor-pointer shadow-sm shadow-blue-600/30"
              >
                <Search className="size-4" /> Search
              </button>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden flex flex-col">
            
            {/* Action Bar (Export buttons) */}
            <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert("Exporting Purchase List to Excel...")}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="size-3.5 text-blue-600" /> Print
                </button>

                <button
                  type="button"
                  onClick={() => alert("Downloading Purchase List PDF...")}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 text-red-700 dark:text-red-400 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground">{paginatedBills.length}</span> of <span className="font-bold text-foreground">1,068</span> entries
              </div>
            </div>

            {/* Purchase Bills Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold text-[11px] border-b border-border">
                    <th className="p-3 text-center w-16 border-r border-border/60">View</th>
                    <th className="p-3 border-r border-border/60">Bill No</th>
                    <th className="p-3 text-center border-r border-border/60">Bill Date</th>
                    <th className="p-3 border-r border-border/60">Supplier</th>
                    <th className="p-3 text-center border-r border-border/60">Type</th>
                    <th className="p-3 text-center border-r border-border/60">Currency</th>
                    <th className="p-3 text-center">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-white dark:bg-transparent font-normal">
                  {paginatedBills.map((bill, index) => (
                    <tr key={bill.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                      {/* View Action */}
                      <td className="p-3 text-center border-r border-border/60">
                        <button
                          type="button"
                          onClick={() => setViewingBill(bill)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                          title="View Bill Details"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>

                      {/* Bill No (Clickable) */}
                      <td className="p-3 border-r border-border/60 font-mono font-bold">
                        <button
                          type="button"
                          onClick={() => setViewingBill(bill)}
                          className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 transition cursor-pointer font-mono font-bold"
                        >
                          {bill.billNo}
                        </button>
                      </td>

                      {/* Bill Date */}
                      <td className="p-3 text-center text-slate-600 dark:text-slate-400 border-r border-border/60 font-medium whitespace-nowrap">
                        {bill.billDate}
                      </td>

                      {/* Supplier */}
                      <td className="p-3 border-r border-border/60 font-bold text-slate-900 dark:text-white max-w-[300px] truncate" title={bill.supplier}>
                        {bill.supplier}
                      </td>

                      {/* Type */}
                      <td className="p-3 text-center border-r border-border/60 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                          {bill.type}
                        </span>
                      </td>

                      {/* Currency */}
                      <td className="p-3 text-center font-bold text-slate-800 dark:text-slate-200 border-r border-border/60 whitespace-nowrap">
                        {bill.currency}
                      </td>

                      {/* Rate */}
                      <td className="p-3 text-center text-slate-500 font-medium whitespace-nowrap">
                        {bill.rate}
                      </td>
                    </tr>
                  ))}

                  {paginatedBills.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                        No purchase bills found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
              <span>Showing 1 to {paginatedBills.length} of 1,068 entries</span>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer font-medium"
                >
                  Previous
                </button>
                
                {[1, 2, 3, 4, 5].map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-md font-bold text-xs transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <span className="px-1 text-slate-400">...</span>

                <button
                  type="button"
                  onClick={() => setCurrentPage(43)}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition cursor-pointer ${
                    currentPage === 43
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  43
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer font-medium"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* PURCHASE BILL DOCUMENT VIEW MODAL (Matching Screenshot) */}
        {viewingBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto print:p-0 print:bg-white">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative border border-slate-200 print:border-none print:shadow-none print:max-h-none print:w-full">
              
              {/* Modal Header Action Bar */}
              <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center print:hidden rounded-t-2xl border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono tracking-tight">Bill No: {viewingBill.billNo}</span>
                      <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wide">
                        {viewingBill.type} Purchase
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Purchase Bill Document View</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition cursor-pointer shadow-sm shadow-blue-600/30"
                  >
                    <Printer className="size-4" /> Print Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingBill(null)}
                    className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Printable Document Body Canvas */}
              <div className="p-8 sm:p-10 space-y-6 relative font-sans text-slate-800 bg-white">
                
                {/* Official Branding Header (Print Version) */}
                <div className="hidden print:flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={pakizaSoftwareLogo} alt="Pakiza Group" className="h-10 w-auto object-contain" />
                    <div>
                      <h2 className="text-lg font-black text-slate-900 uppercase">Pakiza Apparels Limited</h2>
                      <p className="text-xs text-slate-600">Purchase Billing Console</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-700 border border-slate-300 px-3 py-1 rounded">
                      PURCHASE BILL
                    </span>
                  </div>
                </div>

                {/* Header Information Grid (Matching User Screenshot Layout) */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-xs border-b border-slate-200 pb-5">
                  
                  {/* Left Metadata Column */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Bill To:</span>
                      <span className="col-span-3 font-bold text-slate-900 text-sm">
                        {viewingBill.billTo || "Pakiza Apparels Limited"}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Address:</span>
                      <span className="col-span-3 font-bold text-slate-900">
                        {viewingBill.address || "PAL-AOP"}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Supplier:</span>
                      <span className="col-span-3 font-bold text-slate-900 text-sm">
                        {viewingBill.supplier}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Currency:</span>
                      <span className="col-span-3 font-bold text-slate-900">
                        {viewingBill.currency}
                      </span>
                    </div>
                  </div>

                  {/* Right Metadata Column */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Bill No:</span>
                      <span className="col-span-3 font-mono font-bold text-slate-900 text-sm">
                        {viewingBill.billNo}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Bill Date:</span>
                      <span className="col-span-3 font-bold text-slate-900">
                        {viewingBill.billDate}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Purchase Type:</span>
                      <span className="col-span-3 font-bold text-slate-900">
                        {viewingBill.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Currency Rate (Tk):</span>
                      <span className="col-span-3 font-mono font-bold text-slate-900">
                        {(viewingBill.currencyRateTk || 1.000).toFixed(3)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bill Details Section Header */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs italic font-medium text-slate-500">Bill Details</h3>

                  {/* Bill Items Grid */}
                  <div className="border-t border-b border-slate-200 text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                          <th className="py-2.5 px-2 w-10 text-slate-600">#</th>
                          <th className="py-2.5 px-2 text-slate-600">Product</th>
                          <th className="py-2.5 px-2 text-center w-16 text-slate-600">Unit</th>
                          <th className="py-2.5 px-2 text-right w-24 text-slate-600">Quantity</th>
                          <th className="py-2.5 px-2 text-right w-20 text-slate-600">Rate</th>
                          <th className="py-2.5 px-2 text-right w-24 text-slate-600">Total</th>
                          <th className="py-2.5 px-2 text-right w-24 text-slate-600">DC Price</th>
                          <th className="py-2.5 px-2 text-right w-24 text-slate-600">LandedCost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(viewingBill.items && viewingBill.items.length > 0 ? viewingBill.items : DEFAULT_SAMPLE_ITEMS).map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-2 text-slate-600 font-medium">{item.sl || idx + 1}</td>
                            <td className="py-2.5 px-2 font-bold text-slate-900">{item.product}</td>
                            <td className="py-2.5 px-2 text-center font-semibold text-slate-600">{item.unit}</td>
                            <td className="py-2.5 px-2 text-right font-mono font-medium">{item.quantity.toFixed(2)}</td>
                            <td className="py-2.5 px-2 text-right font-mono text-slate-800">{item.rate}</td>
                            <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900">{item.total}</td>
                            <td className="py-2.5 px-2 text-right font-mono text-slate-700">{item.dcPrice.toFixed(2)}</td>
                            <td className="py-2.5 px-2 text-right font-mono text-slate-700">{item.landedCost.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Summary Breakdown (Matching Screenshot Right Stack) */}
                  <div className="pt-4 flex justify-end text-xs">
                    <div className="w-full sm:w-72 space-y-2">
                      
                      <div className="flex justify-between items-center py-1 bg-slate-50 px-3 rounded font-bold text-slate-900">
                        <span>Total Amt</span>
                        <span className="font-mono text-sm">
                          {viewingBill.items && viewingBill.items.length > 0
                            ? viewingBill.items.reduce((acc, i) => acc + i.total, 0)
                            : 956700}
                        </span>
                      </div>

                      <div className="flex justify-between items-center px-3 text-slate-700">
                        <span className="font-medium">Vat Amt</span>
                        <span className="font-mono font-bold">{(viewingBill.vatAmt || 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center px-3 text-slate-700">
                        <span className="font-medium">Tax Amt</span>
                        <span className="font-mono font-bold">{(viewingBill.taxAmt || 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center px-3 text-slate-700">
                        <span className="font-medium">Other Amt</span>
                        <span className="font-mono font-bold">{(viewingBill.otherAmt || 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 bg-slate-50 px-3 rounded font-bold text-slate-900">
                        <span>Net Total</span>
                        <span className="font-mono text-sm">
                          {viewingBill.items && viewingBill.items.length > 0
                            ? viewingBill.items.reduce((acc, i) => acc + i.total, 0) + (viewingBill.vatAmt || 0) + (viewingBill.taxAmt || 0) + (viewingBill.otherAmt || 0)
                            : 956700}
                        </span>
                      </div>

                      <div className="flex justify-between items-center px-3 text-slate-700">
                        <span className="font-medium">Discount</span>
                        <span className="font-mono font-bold">{(viewingBill.discount || 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 bg-slate-100 px-3 rounded font-black text-slate-900 text-sm">
                        <span>G.Total</span>
                        <span className="font-mono text-base text-blue-700">
                          {viewingBill.items && viewingBill.items.length > 0
                            ? viewingBill.items.reduce((acc, i) => acc + i.total, 0) + (viewingBill.vatAmt || 0) + (viewingBill.taxAmt || 0) + (viewingBill.otherAmt || 0) - (viewingBill.discount || 0)
                            : 956700}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Executive Signature Block */}
                <div className="pt-16 grid grid-cols-3 gap-6 text-center text-xs font-bold text-slate-700 print:pt-20">
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">Prepared By</p>
                    <p className="text-[10px] text-slate-500 font-normal">Accounts / Billing Officer</p>
                  </div>
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">Verified By</p>
                    <p className="text-[10px] text-slate-500 font-normal">Store &amp; Inventory Auditor</p>
                  </div>
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">Authorized Signature</p>
                    <p className="text-[10px] text-slate-500 font-normal">Head of Finance &amp; Accounts</p>
                  </div>
                </div>

                {/* Print Footer note */}
                <div className="text-center text-[10px] text-slate-400 pt-6 border-t border-slate-100 print:block">
                  This is an official computer-generated Purchase Bill document from Pakiza HRIS &amp; ERP System.
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
