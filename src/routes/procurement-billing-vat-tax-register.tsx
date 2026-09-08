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
  Building2,
  Receipt,
  RefreshCw,
  CheckCircle2,
  Clock,
} from "lucide-react";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-billing-vat-tax-register")({
  head: () => ({
    meta: [
      { title: "VAT and Tax Register — Billing | CRIPTON Procurement" },
      { name: "description", content: "Procurement Billing VAT and Tax Register with posting status filters and billing details document viewer." },
    ],
  }),
  component: VatTaxRegisterPage,
});

export interface VatTaxItem {
  sl: number;
  item: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  totalPrice: number;
}

export interface VatTaxRecord {
  id: string;
  sl: number;
  supplier: string;
  billNo: string;
  billDate: string;
  billType: string;
  currency: string;
  exchangeRate: number;
  billValue: number;
  vatAmount: number;
  taxAmount: number;
  discountAmt: number;
  netPayable: number;
  status: "Post" | "Unpost";
  poWoNo?: string;
  poWoDate?: string;
  mrirNo?: string;
  mrirDate?: string;
  challanNo?: string;
  challanDate?: string;
  advanceAdjustment?: number;
  items?: VatTaxItem[];
  preparedBy?: { name: string; title: string; date: string };
  vatTaxInputtedBy?: { name: string; title: string; date: string };
  auditedBy?: { name: string; title: string; date: string };
}

const INITIAL_VAT_TAX_RECORDS: VatTaxRecord[] = [
  {
    id: "vt-1",
    sl: 1,
    supplier: "Gadget & Gaming Zone",
    billNo: "1298",
    billDate: "03/09/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 450.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 450.00,
    status: "Post",
    poWoNo: "PO/PSL/2026/000240",
    poWoDate: "03/09/2026",
    mrirNo: "606",
    mrirDate: "05/09/2026",
    challanNo: "1298",
    challanDate: "03/09/2026",
    advanceAdjustment: 0.00,
    items: [
      { sl: 1, item: "Mouse", quantity: 1.00, uom: "PCS", unitPrice: 450.00, totalPrice: 450.00 },
    ],
    preparedBy: { name: "Rajebul Hasan Rajon", title: "Deputy Manager", date: "05/09/2026 16:07:05" },
    vatTaxInputtedBy: { name: "A.K.M Nakibul Haque", title: "Sr. Officer", date: "06/09/2026 15:46:51" },
    auditedBy: { name: "Md.Shahidul Islam", title: "Assistant Manager", date: "08/09/2026 09:13:18" },
  },
  {
    id: "vt-2",
    sl: 2,
    supplier: "UNKNOWN",
    billNo: "00",
    billDate: "10/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 48.99,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 48.99,
    status: "Unpost",
  },
  {
    id: "vt-3",
    sl: 3,
    supplier: "Konica Hardware",
    billNo: "019",
    billDate: "12/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 380.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 380.00,
    status: "Post",
  },
  {
    id: "vt-4",
    sl: 4,
    supplier: "B. BARIA BELT GALLERY",
    billNo: "020",
    billDate: "13/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 2000.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 2000.00,
    status: "Post",
  },
  {
    id: "vt-5",
    sl: 5,
    supplier: "Global Net Computers",
    billNo: "00628",
    billDate: "15/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 17500.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 17500.00,
    status: "Post",
  },
  {
    id: "vt-6",
    sl: 6,
    supplier: "Cash Purchase Supplier",
    billNo: "00",
    billDate: "16/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 680.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 680.00,
    status: "Post",
  },
  {
    id: "vt-7",
    sl: 7,
    supplier: "Robotics BD",
    billNo: "96551",
    billDate: "18/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 78830.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 78830.00,
    status: "Post",
  },
  {
    id: "vt-8",
    sl: 8,
    supplier: "Star Tech Ltd",
    billNo: "INV-STLR4-2026-017669",
    billDate: "20/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 500.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 500.00,
    status: "Post",
  },
  {
    id: "vt-9",
    sl: 9,
    supplier: "Cash Purchase Supplier",
    billNo: "00",
    billDate: "23/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 200.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 200.00,
    status: "Post",
  },
  {
    id: "vt-10",
    sl: 10,
    supplier: "Techno House",
    billNo: "6747",
    billDate: "25/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 20000.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 20000.00,
    status: "Unpost",
  },
  {
    id: "vt-11",
    sl: 11,
    supplier: "ZOOM TECHNOLOGY",
    billNo: "489",
    billDate: "31/08/2026",
    billType: "Local",
    currency: "BDT",
    exchangeRate: 1.000,
    billValue: 1200.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    discountAmt: 0.00,
    netPayable: 1200.00,
    status: "Post",
  },
];

function VatTaxRegisterPage() {
  // Filter States
  const [dateFrom, setDateFrom] = useState("2026-08-01");
  const [dateTo, setDateTo] = useState("2026-09-08");
  const [billNoQuery, setBillNoQuery] = useState("");
  const [poNoQuery, setPoNoQuery] = useState("");
  const [postingStatus, setPostingStatus] = useState<"All" | "Post" | "Un-Post">("All");
  const [supplierQuery, setSupplierQuery] = useState("");

  // Records state
  const [records, setRecords] = useState<VatTaxRecord[]>(() => {
    const saved = localStorage.getItem("procurement_vat_tax_records_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VAT_TAX_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem("procurement_vat_tax_records_v1", JSON.stringify(records));
  }, [records]);

  // Modal State
  const [viewingRecord, setViewingRecord] = useState<VatTaxRecord | null>(null);

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Bill No Filter
      if (billNoQuery.trim() && !rec.billNo.toLowerCase().includes(billNoQuery.toLowerCase().trim())) {
        return false;
      }
      // PO No Filter
      if (poNoQuery.trim()) {
        const pQuery = poNoQuery.toLowerCase().trim();
        if (!rec.poWoNo || !rec.poWoNo.toLowerCase().includes(pQuery)) return false;
      }
      // Posting Status Filter
      if (postingStatus !== "All") {
        const targetStatus = postingStatus === "Post" ? "Post" : "Unpost";
        if (rec.status !== targetStatus) return false;
      }
      // Supplier Name Filter
      if (supplierQuery.trim() && !rec.supplier.toLowerCase().includes(supplierQuery.toLowerCase().trim())) {
        return false;
      }

      return true;
    });
  }, [records, billNoQuery, poNoQuery, postingStatus, supplierQuery]);

  const resetFilters = () => {
    setDateFrom("2026-08-01");
    setDateTo("2026-09-08");
    setBillNoQuery("");
    setPoNoQuery("");
    setPostingStatus("All");
    setSupplierQuery("");
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
                <Receipt className="size-6 text-emerald-600 dark:text-emerald-400" />
                VAT and Tax Register
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Procurement Workspace &gt; Billing &gt; <span className="text-emerald-600 dark:text-emerald-400 font-semibold">VAT and Tax Register</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="size-4" /> Print Register
              </button>
            </div>
          </div>

          {/* Filter Parameters Bar */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-emerald-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Search &amp; Filter Parameters
                </h2>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end text-xs">
              
              {/* Date From */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="size-3.5 text-slate-400" /> Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Bill No */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Bill No
                </label>
                <input
                  type="text"
                  placeholder="1298, 019..."
                  value={billNoQuery}
                  onChange={(e) => setBillNoQuery(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Purchase Order No */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Purchase Order No
                </label>
                <input
                  type="text"
                  placeholder="PO/PSL/2026..."
                  value={poNoQuery}
                  onChange={(e) => setPoNoQuery(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* VAT & Tax Posting Status */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  VAT &amp; Tax Posting Status
                </label>
                <div className="flex items-center gap-3 h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {(["All", "Post", "Un-Post"] as const).map((st) => (
                    <label key={st} className="flex items-center gap-1 cursor-pointer text-xs font-medium">
                      <input
                        type="radio"
                        name="postingStatus"
                        checked={postingStatus === st}
                        onChange={() => setPostingStatus(st)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supplier Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Supplier Name
                </label>
                <input
                  type="text"
                  placeholder="Gadget & Gaming, Star Tech..."
                  value={supplierQuery}
                  onChange={(e) => setSupplierQuery(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {}}
                className="h-9 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition cursor-pointer shadow-sm shadow-blue-600/30"
              >
                <Search className="size-4" /> Search
              </button>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden flex flex-col">
            
            {/* Toolbar Export Bar */}
            <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert("Exporting VAT & Tax Register to Excel...")}
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
                  onClick={() => alert("Downloading VAT & Tax Register PDF...")}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 text-red-700 dark:text-red-400 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground">1</span> to <span className="font-bold text-foreground">{filteredRecords.length}</span> of <span className="font-bold text-foreground">{filteredRecords.length}</span> entries
              </div>
            </div>

            {/* VAT & Tax Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold text-[11px] border-b border-border">
                    <th className="p-3 text-center w-12 border-r border-border/60">SL</th>
                    <th className="p-3 text-center w-16 border-r border-border/60">Action</th>
                    <th className="p-3 border-r border-border/60">Supplier Name</th>
                    <th className="p-3 border-r border-border/60">Bill No</th>
                    <th className="p-3 text-center border-r border-border/60">Bill Date</th>
                    <th className="p-3 text-center border-r border-border/60">Bill Type</th>
                    <th className="p-3 text-center border-r border-border/60">Currency</th>
                    <th className="p-3 text-center border-r border-border/60">Exchange Rate</th>
                    <th className="p-3 text-right border-r border-border/60">Bill Value</th>
                    <th className="p-3 text-right border-r border-border/60">Vat amount</th>
                    <th className="p-3 text-right border-r border-border/60">Tax amount</th>
                    <th className="p-3 text-right border-r border-border/60">Discount Amt</th>
                    <th className="p-3 text-right border-r border-border/60">Net Payable</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-white dark:bg-transparent font-normal">
                  {filteredRecords.map((rec, index) => (
                    <tr key={rec.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                      {/* SL */}
                      <td className="p-3 text-center text-slate-500 border-r border-border/60 font-medium">
                        {rec.sl || index + 1}
                      </td>

                      {/* Action */}
                      <td className="p-3 text-center border-r border-border/60">
                        <button
                          type="button"
                          onClick={() => setViewingRecord(rec)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                          title="View Billing Information"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>

                      {/* Supplier Name */}
                      <td className="p-3 border-r border-border/60 font-bold text-slate-900 dark:text-white max-w-[220px] truncate" title={rec.supplier}>
                        {rec.supplier}
                      </td>

                      {/* Bill No (Clickable) */}
                      <td className="p-3 border-r border-border/60 font-mono font-bold">
                        <button
                          type="button"
                          onClick={() => setViewingRecord(rec)}
                          className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 transition cursor-pointer font-mono font-bold"
                        >
                          {rec.billNo}
                        </button>
                      </td>

                      {/* Bill Date */}
                      <td className="p-3 text-center text-slate-600 dark:text-slate-400 border-r border-border/60 font-medium whitespace-nowrap">
                        {rec.billDate}
                      </td>

                      {/* Bill Type */}
                      <td className="p-3 text-center border-r border-border/60 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                          {rec.billType}
                        </span>
                      </td>

                      {/* Currency */}
                      <td className="p-3 text-center font-bold text-slate-800 dark:text-slate-200 border-r border-border/60 whitespace-nowrap">
                        {rec.currency}
                      </td>

                      {/* Exchange Rate */}
                      <td className="p-3 text-center text-slate-600 dark:text-slate-400 border-r border-border/60 font-mono">
                        {rec.exchangeRate.toFixed(3)}
                      </td>

                      {/* Bill Value */}
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white border-r border-border/60">
                        {rec.billValue.toFixed(2)}
                      </td>

                      {/* Vat amount */}
                      <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-400 border-r border-border/60">
                        {rec.vatAmount.toFixed(2)}
                      </td>

                      {/* Tax amount */}
                      <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-400 border-r border-border/60">
                        {rec.taxAmount.toFixed(2)}
                      </td>

                      {/* Discount Amt */}
                      <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-400 border-r border-border/60">
                        {rec.discountAmt.toFixed(2)}
                      </td>

                      {/* Net Payable */}
                      <td className="p-3 text-right font-mono font-black text-slate-900 dark:text-white border-r border-border/60">
                        {rec.netPayable.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-flex items-center gap-1 ${
                            rec.status === "Post"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          {rec.status === "Post" ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={14} className="p-8 text-center text-slate-400 font-medium">
                        No VAT &amp; Tax records match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
              <span>Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries</span>
              
              <div className="flex items-center gap-1">
                <button disabled className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-400 cursor-not-allowed font-medium">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white font-bold rounded-md text-xs">
                  1
                </button>
                <button disabled className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-400 cursor-not-allowed font-medium">
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* BILLING INFORMATION VIEW MODAL (Matching Screenshot) */}
        {viewingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto print:p-0 print:bg-white">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative border border-slate-200 print:border-none print:shadow-none print:max-h-none print:w-full">
              
              {/* Modal Sticky Action Bar */}
              <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center print:hidden rounded-t-2xl border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Receipt className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono tracking-tight">Bill No: {viewingRecord.billNo}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wide border ${
                        viewingRecord.status === "Post" 
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}>
                        {viewingRecord.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Billing Information Document Preview</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition cursor-pointer shadow-sm shadow-emerald-600/30"
                  >
                    <Printer className="size-4" /> Print Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingRecord(null)}
                    className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Printable Document Body Canvas (Matching User Screenshot Layout) */}
              <div className="p-8 sm:p-10 space-y-6 relative font-sans text-slate-800 bg-white">
                
                {/* Header: Company Logo & Bill Info Header Block */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-4">
                  
                  {/* Company Branding Left */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <img src={pakizaSoftwareLogo} alt="PAKIZA SOFTWARE" className="h-8 w-auto object-contain" />
                      <div>
                        <h1 className="text-xl font-black tracking-tight text-blue-950 uppercase">
                          PAKIZA SOFTWARE
                        </h1>
                        <p className="text-[10px] text-slate-500 italic font-semibold">
                          Excellence | Intelligence | Automation
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium pt-1">
                      Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205
                    </p>
                  </div>

                  {/* Billing Header Table Right */}
                  <div className="w-full sm:w-72 border border-slate-300 text-xs rounded-xs overflow-hidden">
                    <div className="bg-slate-50 text-slate-600 font-bold p-1.5 text-right tracking-wider border-b border-slate-300 uppercase text-[10px]">
                      Billing Information
                    </div>
                    <div className="divide-y divide-slate-300">
                      <div className="grid grid-cols-3 p-1.5 bg-white">
                        <span className="font-semibold text-slate-600">Bill No :</span>
                        <span className="col-span-2 font-mono font-bold text-slate-900">{viewingRecord.billNo}</span>
                      </div>
                      <div className="grid grid-cols-3 p-1.5 bg-white">
                        <span className="font-semibold text-slate-600">Bill Date :</span>
                        <span className="col-span-2 font-bold text-slate-900">{viewingRecord.billDate}</span>
                      </div>
                      <div className="grid grid-cols-3 p-1.5 bg-white">
                        <span className="font-semibold text-slate-600">Supplier :</span>
                        <span className="col-span-2 font-bold text-slate-900">{viewingRecord.supplier}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Centered Document Title */}
                <div className="text-center pt-1">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight underline underline-offset-4">
                    Billing Information
                  </h2>
                </div>

                {/* 3-Row Bordered Metadata Grid */}
                <div className="border border-slate-400 text-xs font-sans">
                  {/* Row 1 */}
                  <div className="grid grid-cols-6 border-b border-slate-400 divide-x divide-slate-400 p-2 bg-white">
                    <span className="font-bold text-slate-800">PO/WO</span>
                    <span className="font-mono font-bold text-blue-600 hover:underline cursor-pointer">
                      {viewingRecord.poWoNo || "PO/PSL/2026/000240"}
                    </span>
                    <span className="font-bold text-slate-800">PO/WO Date</span>
                    <span className="font-bold text-slate-900">{viewingRecord.poWoDate || "03/09/2026"}</span>
                    <span className="font-bold text-slate-800">Currency</span>
                    <span className="font-bold text-slate-900">{viewingRecord.currency}</span>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-6 border-b border-slate-400 divide-x divide-slate-400 p-2 bg-white">
                    <span className="font-bold text-slate-800">Exchange Rate</span>
                    <span className="font-mono text-slate-900">{viewingRecord.exchangeRate.toFixed(3)}</span>
                    <span className="font-bold text-slate-800">MRIR No</span>
                    <span className="font-mono font-bold text-blue-600 hover:underline cursor-pointer">
                      {viewingRecord.mrirNo || "606"}
                    </span>
                    <span className="font-bold text-slate-800">MRIR Date</span>
                    <span className="font-bold text-slate-900">{viewingRecord.mrirDate || "05/09/2026"}</span>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-6 divide-x divide-slate-400 p-2 bg-white">
                    <span className="font-bold text-slate-800">Challan No</span>
                    <span className="font-mono font-bold text-slate-900">{viewingRecord.challanNo || viewingRecord.billNo}</span>
                    <span className="font-bold text-slate-800">Challan Date</span>
                    <span className="font-bold text-slate-900">{viewingRecord.challanDate || viewingRecord.billDate}</span>
                    <span className="font-bold text-slate-800">Advance Adjustment</span>
                    <span className="font-mono text-slate-900">{(viewingRecord.advanceAdjustment || 0).toFixed(2)}</span>
                  </div>
                </div>

                {/* Items Grid & Summary */}
                <div className="border border-slate-400 text-xs font-sans overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400 text-[11px]">
                        <th className="p-2 w-10 border-r border-slate-400">SL</th>
                        <th className="p-2 border-r border-slate-400">Item</th>
                        <th className="p-2 text-right w-24 border-r border-slate-400">Quantity</th>
                        <th className="p-2 text-center w-20 border-r border-slate-400">UOM</th>
                        <th className="p-2 text-right w-28 border-r border-slate-400">Unit Price</th>
                        <th className="p-2 text-right w-32">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {(viewingRecord.items && viewingRecord.items.length > 0 ? viewingRecord.items : [
                        { sl: 1, item: "Mouse", quantity: 1.00, uom: "PCS", unitPrice: 450.00, totalPrice: 450.00 }
                      ]).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 border-r border-slate-300 text-slate-600">{item.sl || idx + 1}</td>
                          <td className="p-2 border-r border-slate-300 font-bold text-slate-900">{item.item}</td>
                          <td className="p-2 border-r border-slate-300 text-right font-mono font-semibold">{item.quantity.toFixed(2)}</td>
                          <td className="p-2 border-r border-slate-300 text-center text-slate-600">{item.uom}</td>
                          <td className="p-2 border-r border-slate-300 text-right font-mono">{item.unitPrice.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-900">{item.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary Breakdown Rows */}
                  <div className="border-t border-slate-400 divide-y divide-slate-300 text-xs">
                    <div className="grid grid-cols-6 p-2 font-bold text-slate-900">
                      <span className="col-span-2 text-right pr-4">Total Quantity</span>
                      <span className="font-mono">
                        {viewingRecord.items && viewingRecord.items.length > 0
                          ? viewingRecord.items.reduce((acc, i) => acc + i.quantity, 0)
                          : 1}
                      </span>
                      <span className="col-span-2 text-right pr-4">Total Amount</span>
                      <span className="text-right font-mono font-bold">
                        {viewingRecord.items && viewingRecord.items.length > 0
                          ? viewingRecord.items.reduce((acc, i) => acc + i.totalPrice, 0)
                          : 450}
                      </span>
                    </div>

                    <div className="grid grid-cols-6 p-2 text-slate-700">
                      <span className="col-span-5 text-right font-bold pr-4">Discount(-)</span>
                      <span className="text-right font-mono font-bold">{(viewingRecord.discountAmt || 0).toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-6 p-2 text-slate-700">
                      <span className="col-span-5 text-right font-bold pr-4">Others Amount</span>
                      <span className="text-right font-mono font-bold">0.00</span>
                    </div>

                    <div className="grid grid-cols-6 p-2 text-slate-700">
                      <span className="col-span-5 text-right font-bold pr-4">VAT(Inc)</span>
                      <span className="text-right font-mono font-bold">{(viewingRecord.vatAmount || 0).toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-6 p-2 text-slate-700">
                      <span className="col-span-5 text-right font-bold pr-4">TAX(Inc)</span>
                      <span className="text-right font-mono font-bold">{(viewingRecord.taxAmount || 0).toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-6 p-2 font-bold text-slate-900">
                      <span className="col-span-5 text-right font-bold pr-4">Net Payable</span>
                      <span className="text-right font-mono font-bold">{viewingRecord.netPayable.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-6 p-2 font-black text-slate-900 bg-slate-50">
                      <span className="col-span-5 text-right font-bold pr-4">Total Amount</span>
                      <span className="text-right font-mono font-bold text-sm">{viewingRecord.netPayable.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Words & Comments Box */}
                <div className="border border-slate-400 text-xs divide-y divide-slate-400 font-sans">
                  <div className="p-2 font-bold text-slate-900">
                    In words: <span className="font-semibold text-slate-700">Four Hundred Fifty Only.</span>
                  </div>
                  <div className="p-2 font-bold text-slate-900">
                    Comment (Vat &amp; Tax) :
                  </div>
                </div>

                {/* 4-Column Signature Block (Matching Screenshot) */}
                <div className="pt-12 grid grid-cols-4 gap-4 text-center text-xs font-sans print:pt-16">
                  
                  {/* Prepared By */}
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-bold text-slate-800">Prepared By</p>
                    <p className="font-bold text-slate-900 text-[11px]">{viewingRecord.preparedBy?.name || "Rajebul Hasan Rajon"}</p>
                    <p className="text-[10px] text-slate-500">{viewingRecord.preparedBy?.title || "Deputy Manager"}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{viewingRecord.preparedBy?.date || "05/09/2026 16:07:05"}</p>
                  </div>

                  {/* Vat and Tax Inputted By */}
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-bold text-slate-800">Vat and Tax Inputted By</p>
                    <p className="font-bold text-slate-900 text-[11px]">{viewingRecord.vatTaxInputtedBy?.name || "A.K.M Nakibul Haque"}</p>
                    <p className="text-[10px] text-slate-500">{viewingRecord.vatTaxInputtedBy?.title || "Sr. Officer"}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{viewingRecord.vatTaxInputtedBy?.date || "06/09/2026 15:46:51"}</p>
                  </div>

                  {/* Audited By */}
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-bold text-slate-800">Audited By</p>
                    <p className="font-bold text-slate-900 text-[11px]">{viewingRecord.auditedBy?.name || "Md.Shahidul Islam"}</p>
                    <p className="text-[10px] text-slate-500">{viewingRecord.auditedBy?.title || "Assistant Manager"}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{viewingRecord.auditedBy?.date || "08/09/2026 09:13:18"}</p>
                  </div>

                  {/* Approved By */}
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-bold text-slate-800">Approved By</p>
                    <div className="h-6"></div>
                    <p className="text-[10px] text-slate-400">Authorized Signature</p>
                  </div>

                </div>

                {/* Print Footer note */}
                <div className="text-center text-[10px] text-slate-400 pt-6 border-t border-slate-100 print:block">
                  This is a computer-generated VAT &amp; Tax Billing Information document from Pakiza HRIS &amp; ERP System.
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
