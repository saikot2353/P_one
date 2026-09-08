import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Eye,
  X,
  CreditCard,
  Building2,
  Calendar,
  Filter,
  CheckCircle2,
  Receipt,
  ArrowUpDown,
} from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-payment-list")({
  head: () => ({
    meta: [
      { title: "Purchase Payment List — Procurement | CRIPTON" },
      { name: "description", content: "Procurement Bill Payment transaction registry with date, mode, and supplier filters." },
    ],
  }),
  component: ProcurementPaymentListPage,
});

export interface PaymentRecord {
  id: string;
  voucherNo: string;
  supplier: string;
  mode: "Cash" | "Cheque";
  paymentDate: string;
  amount: number;
  currency: string;
  chqNo: string;
  chqDate: string;
  bankAccount: string;
  remarks: string;
  settledBills?: {
    billNo: string;
    billDate: string;
    location: string;
    billAmt: number;
    paidAmt: number;
    discount: number;
  }[];
}

const INITIAL_PAYMENT_RECORDS: PaymentRecord[] = [
  {
    id: "pay-1",
    voucherNo: "BP-VOUCH-2026-0001",
    supplier: "M.B. Trade Corporation",
    mode: "Cheque",
    paymentDate: "08/09/2026",
    amount: 132500.00,
    currency: "BDT",
    chqNo: "CHQ-981240",
    chqDate: "08/09/2026",
    bankAccount: "Dutch-Bangla Bank - 103110002891 (Principal Br.)",
    remarks: "Payment against Bill #116 (PKCL-Savar)",
    settledBills: [
      { billNo: "116", billDate: "01/09/2024", location: "PKCL-Savar", billAmt: 132500.00, paidAmt: 132500.00, discount: 0 },
    ],
  },
  {
    id: "pay-2",
    voucherNo: "BP-VOUCH-2026-0002",
    supplier: "Madona Enterprise",
    mode: "Cash",
    paymentDate: "05/09/2026",
    amount: 45000.00,
    currency: "BDT",
    chqNo: "—",
    chqDate: "—",
    bankAccount: "Cash in Hand (Accounts Central Cash)",
    remarks: "Cash clearance for urgent packaging materials",
    settledBills: [
      { billNo: "MDN-2026-089", billDate: "28/08/2026", location: "PSL-Operation", billAmt: 45000.00, paidAmt: 45000.00, discount: 0 },
    ],
  },
  {
    id: "pay-3",
    voucherNo: "BP-VOUCH-2026-0003",
    supplier: "MAYER DOYA ENTERPRISE",
    mode: "Cheque",
    paymentDate: "03/09/2026",
    amount: 300000.00,
    currency: "BDT",
    chqNo: "DBBL-491028",
    chqDate: "03/09/2026",
    bankAccount: "Dutch-Bangla Bank - 103110002891 (Principal Br.)",
    remarks: "Settlement of dye chem bills MBTC/2023-24",
    settledBills: [
      { billNo: "MBTC/2023-24/PAL/AT.S/109", billDate: "20/08/2024", location: "PAL-Fabric Dyeing", billAmt: 300000.00, paidAmt: 300000.00, discount: 0 },
    ],
  },
  {
    id: "pay-4",
    voucherNo: "BP-VOUCH-2026-0004",
    supplier: "OHYOUNG INS",
    mode: "Cheque",
    paymentDate: "01/09/2026",
    amount: 29160.00,
    currency: "USD",
    chqNo: "BRAC-008129",
    chqDate: "01/09/2026",
    bankAccount: "BRAC Bank - 1501203491001 (Gulshan Br.)",
    remarks: "Foreign LC settlement against P-240090",
    settledBills: [
      { billNo: "P-240090", billDate: "20/09/2024", location: "Head Office", billAmt: 29160.00, paidAmt: 29160.00, discount: 0 },
    ],
  },
  {
    id: "pay-5",
    voucherNo: "BP-VOUCH-2026-0005",
    supplier: "Silver Apparels Ltd.",
    mode: "Cheque",
    paymentDate: "28/08/2026",
    amount: 51500.00,
    currency: "BDT",
    chqNo: "PBL-190248",
    chqDate: "28/08/2026",
    bankAccount: "Pubali Bank - 091890102341 (Motijheel Br.)",
    remarks: "Fabric dyeing service bill #139",
    settledBills: [
      { billNo: "139", billDate: "02/12/2023", location: "PAL-Fabric Dyeing", billAmt: 51500.00, paidAmt: 51500.00, discount: 0 },
    ],
  },
  {
    id: "pay-6",
    voucherNo: "BP-VOUCH-2026-0006",
    supplier: "Rakamari Tools & Hardware",
    mode: "Cheque",
    paymentDate: "25/08/2026",
    amount: 3820.00,
    currency: "BDT",
    chqNo: "CHQ-550912",
    chqDate: "25/08/2026",
    bankAccount: "Dutch-Bangla Bank - 103110002891 (Principal Br.)",
    remarks: "Full settlement of Bill #1002 (Tools & accessories)",
    settledBills: [
      { billNo: "1002", billDate: "01/03/2026", location: "PKCL-Savar", billAmt: 3820.00, paidAmt: 3820.00, discount: 0 },
    ],
  },
  {
    id: "pay-7",
    voucherNo: "BP-VOUCH-2026-0007",
    supplier: "Gadget & Gaming Zone",
    mode: "Cash",
    paymentDate: "22/08/2026",
    amount: 450.00,
    currency: "BDT",
    chqNo: "—",
    chqDate: "—",
    bankAccount: "Cash in Hand (Accounts Central Cash)",
    remarks: "Mouse purchase Bill #1298",
    settledBills: [
      { billNo: "1298", billDate: "03/09/2026", location: "PSL-Operation", billAmt: 450.00, paidAmt: 450.00, discount: 0 },
    ],
  },
  {
    id: "pay-8",
    voucherNo: "BP-VOUCH-2026-0008",
    supplier: "Global Net Computers",
    mode: "Cheque",
    paymentDate: "18/08/2026",
    amount: 17500.00,
    currency: "BDT",
    chqNo: "EBL-390145",
    chqDate: "18/08/2026",
    bankAccount: "Eastern Bank Ltd - 1042000341 (Dhanmondi Br.)",
    remarks: "IT equipment maintenance Bill #00628",
    settledBills: [
      { billNo: "00628", billDate: "15/08/2026", location: "PAL-Fabric Dyeing", billAmt: 17500.00, paidAmt: 17500.00, discount: 0 },
    ],
  },
  {
    id: "pay-9",
    voucherNo: "BP-VOUCH-2026-0009",
    supplier: "M.B. Trade Corporation",
    mode: "Cash",
    paymentDate: "14/08/2026",
    amount: 120.00,
    currency: "BDT",
    chqNo: "—",
    chqDate: "—",
    bankAccount: "Cash in Hand (Accounts Central Cash)",
    remarks: "Petty cash clearance for Test Bill",
    settledBills: [
      { billNo: "Test Bill", billDate: "07/07/2026", location: "PSL-Operation", billAmt: 120.00, paidAmt: 120.00, discount: 0 },
    ],
  },
  {
    id: "pay-10",
    voucherNo: "BP-VOUCH-2026-0010",
    supplier: "Apex Textile Chemical Ltd",
    mode: "Cheque",
    paymentDate: "10/08/2026",
    amount: 1520000.00,
    currency: "BDT",
    chqNo: "EBL-004128",
    chqDate: "10/08/2026",
    bankAccount: "Eastern Bank Ltd - 1042000341 (Dhanmondi Br.)",
    remarks: "Bulk chemical procurement BIL-2026-0078",
    settledBills: [
      { billNo: "BIL-2026-0078", billDate: "24/08/2026", location: "AOP Unit", billAmt: 1520000.00, paidAmt: 1520000.00, discount: 0 },
    ],
  },
  {
    id: "pay-11",
    voucherNo: "BP-VOUCH-2026-0011",
    supplier: "Konica Hardware",
    mode: "Cash",
    paymentDate: "08/08/2026",
    amount: 380.00,
    currency: "BDT",
    chqNo: "—",
    chqDate: "—",
    bankAccount: "Cash in Hand (Accounts Central Cash)",
    remarks: "Store maintenance Bill #019",
    settledBills: [
      { billNo: "019", billDate: "12/08/2026", location: "PKCL-Savar", billAmt: 380.00, paidAmt: 380.00, discount: 0 },
    ],
  },
  {
    id: "pay-12",
    voucherNo: "BP-VOUCH-2026-0012",
    supplier: "B. BARIA BELT GALLERY",
    mode: "Cheque",
    paymentDate: "04/08/2026",
    amount: 2000.00,
    currency: "BDT",
    chqNo: "IBBL-782190",
    chqDate: "04/08/2026",
    bankAccount: "Islami Bank BD - 2050123992 (Kawran Bazar Br.)",
    remarks: "Belt procurement Bill #020",
    settledBills: [
      { billNo: "020", billDate: "13/08/2026", location: "PKCL-Savar", billAmt: 2000.00, paidAmt: 2000.00, discount: 0 },
    ],
  },
];

const CURATED_SUPPLIERS = [
  "All...",
  "M.B. Trade Corporation",
  "Madona Enterprise",
  "MAYER DOYA ENTERPRISE",
  "OHYOUNG INS",
  "Silver Apparels Ltd.",
  "\"Ma\" Motors",
  "1 to 100 Plus Market",
  "1 To 99 Plus Noyon Varieties Store",
  "3NS Technology BD",
  "3S Knitwear",
  "4 BROTHERS CAR DECORATION",
  "4G Light House",
  "A & P Tex",
  "A & R SOURCING LTD.",
  "A & Z Trading",
  "A F Digital Press",
  "A H B PAPER HOUSE",
  "A K Khan Motors",
  "A One Car Accessories",
  "Apex Textile Chemical Ltd",
  "Rakamari Tools & Hardware",
  "Gadget & Gaming Zone",
  "Global Net Computers",
  "Konica Hardware",
  "B. BARIA BELT GALLERY",
  "Robotics BD",
  "Star Tech Ltd",
  "Techno House",
  "ZOOM TECHNOLOGY",
];

function numberToWords(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return "Zero";
  const units = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const helper = (n: number): string => {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
    if (n < 1000) return units[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + helper(n % 100) : "");
    if (n < 100000) return helper(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + helper(n % 1000) : "");
    if (n < 10000000) return helper(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + helper(n % 100000) : "");
    return helper(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + helper(n % 10000000) : "");
  };

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  let result = helper(integerPart).trim();
  if (decimalPart > 0) {
    result += " and " + helper(decimalPart).trim() + " Paisa";
  }
  return result;
}

function ProcurementPaymentListPage() {
  // Filter States
  const [dateFrom, setDateFrom] = useState("2026-08-01");
  const [dateTo, setDateTo] = useState("2026-09-08");
  const [paymentMode, setPaymentMode] = useState<"All" | "Cash" | "Cheque">("All");
  const [supplierName, setSupplierName] = useState<string>("All...");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Records state (synced with bill payment vouchers if created)
  const [records, setRecords] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem("procurement_payment_list_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Check if there are payment vouchers from Bill Payment page
    const createdVouchers = localStorage.getItem("procurement_payment_vouchers_v1");
    if (createdVouchers) {
      try {
        const vList = JSON.parse(createdVouchers);
        if (Array.isArray(vList) && vList.length > 0) {
          const mappedVouchers: PaymentRecord[] = vList.map((v: any) => ({
            id: v.id,
            voucherNo: v.voucherNo,
            supplier: v.supplier,
            mode: v.paymentMode.toLowerCase().includes("cash") ? "Cash" : "Cheque",
            paymentDate: v.voucherDate,
            amount: v.totalPaid,
            currency: "BDT",
            chqNo: v.chequeNo || "—",
            chqDate: v.chequeDate || "—",
            bankAccount: v.bankAccount,
            remarks: v.remarks || "Supplier settlement",
            settledBills: v.settledBills,
          }));
          return [...mappedVouchers, ...INITIAL_PAYMENT_RECORDS];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PAYMENT_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem("procurement_payment_list_v1", JSON.stringify(records));
  }, [records]);

  // Modal State for Viewing Payment Voucher
  const [viewingRecord, setViewingRecord] = useState<PaymentRecord | null>(null);

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Payment Mode filter
      if (paymentMode !== "All" && rec.mode !== paymentMode) {
        return false;
      }
      // Supplier filter
      if (supplierName !== "All..." && rec.supplier !== supplierName) {
        return false;
      }
      // General search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchSupplier = rec.supplier.toLowerCase().includes(q);
        const matchVoucher = rec.voucherNo.toLowerCase().includes(q);
        const matchChq = rec.chqNo.toLowerCase().includes(q);
        const matchRemarks = rec.remarks.toLowerCase().includes(q);
        if (!matchSupplier && !matchVoucher && !matchChq && !matchRemarks) {
          return false;
        }
      }
      return true;
    });
  }, [records, paymentMode, supplierName, searchQuery]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  // Options for SearchableSelect
  const supplierOptions = useMemo(() => {
    return CURATED_SUPPLIERS.map((s) => ({ value: s, label: s }));
  }, []);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-16">
        <ProcurementTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-5 w-full max-w-[1700px] mx-auto">
          
          {/* Breadcrumb & Title */}
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <CreditCard className="size-5.5 text-blue-600" />
              Purchase Payment List
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Procurement &gt; Payment &gt; <span className="text-blue-600 font-semibold">Payment List</span>
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              FILTER CONSOLE (Matching User's Prompt)
              ═══════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              
              {/* Date From */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Date From
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Date To */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Date To
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Payment Mode (Cash / Cheque) */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Payment Mode
                </label>
                <div className="flex items-center gap-2 h-9">
                  {(["All", "Cash", "Cheque"] as const).map((mode) => (
                    <label
                      key={mode}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium cursor-pointer transition select-none ${
                        paymentMode === mode
                          ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentModeFilter"
                        value={mode}
                        checked={paymentMode === mode}
                        onChange={() => setPaymentMode(mode)}
                        className="size-3 text-blue-600 focus:ring-0"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supplier Name Searchable Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Supplier Name
                </label>
                <SearchableSelect
                  options={supplierOptions}
                  value={supplierName}
                  onChange={(val) => setSupplierName(val)}
                  placeholder="Select Supplier..."
                  className="h-9 text-xs"
                />
              </div>

              {/* Show Action Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="w-full h-9 px-6 bg-[#7cb342] hover:bg-[#689f38] text-white font-bold text-xs rounded shadow-xs transition duration-150 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Filter className="size-3.5" />
                  Show
                </button>
              </div>

            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              PAYMENT REGISTRY TABLE & EXPORT BAR
              ═══════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Toolbar: Export Actions & Live Search */}
            <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 bg-slate-50/60">
              
              {/* Export Actions matching user's prompt: [Excel] [Print] [PDF] */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert("Exporting payment list to Excel...")}
                  className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-xs rounded flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-xs rounded flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Printer className="size-3.5 text-blue-600" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-xs rounded flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <FileText className="size-3.5 text-rose-600" /> PDF
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search supplier, voucher, chq, remarks..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 h-8 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 text-[11px] font-bold">
                    
                    {/* Action Column: ∇ */}
                    <th className="px-3 py-2.5 w-12 text-center border-r border-slate-200">
                      <span className="text-slate-500 text-sm">∇</span>
                    </th>

                    <th className="px-3.5 py-2.5 border-r border-slate-200 min-w-[200px]">
                      Supplier
                    </th>
                    <th className="px-3 py-2.5 border-r border-slate-200 w-24 text-center">
                      Mode
                    </th>
                    <th className="px-3 py-2.5 border-r border-slate-200 min-w-[110px]">
                      PaymentDate
                    </th>
                    <th className="px-3.5 py-2.5 border-r border-slate-200 min-w-[130px] text-right">
                      Amount
                    </th>
                    <th className="px-3 py-2.5 border-r border-slate-200 min-w-[130px]">
                      ChqNo
                    </th>
                    <th className="px-3 py-2.5 border-r border-slate-200 min-w-[110px]">
                      ChqDate
                    </th>
                    <th className="px-3.5 py-2.5 min-w-[250px]">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {paginatedRecords.map((rec, index) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-blue-50/40 transition-colors duration-100"
                    >
                      {/* Action Button: ∇ */}
                      <td className="px-3 py-2 text-center border-r border-slate-200">
                        <button
                          type="button"
                          onClick={() => setViewingRecord(rec)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100 transition cursor-pointer mx-auto flex items-center justify-center"
                          title="View Payment Voucher"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </td>

                      {/* Supplier */}
                      <td className="px-3.5 py-2 border-r border-slate-200 font-semibold text-slate-900">
                        {rec.supplier}
                      </td>

                      {/* Mode */}
                      <td className="px-3 py-2 border-r border-slate-200 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.mode === "Cheque"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {rec.mode}
                        </span>
                      </td>

                      {/* Payment Date */}
                      <td className="px-3 py-2 border-r border-slate-200 text-slate-600 font-mono">
                        {rec.paymentDate}
                      </td>

                      {/* Amount */}
                      <td className="px-3.5 py-2 border-r border-slate-200 text-right font-mono font-bold text-slate-900">
                        {rec.currency === "USD" ? "$" : "৳"}
                        {rec.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* ChqNo */}
                      <td className="px-3 py-2 border-r border-slate-200 font-mono text-slate-700">
                        {rec.chqNo}
                      </td>

                      {/* ChqDate */}
                      <td className="px-3 py-2 border-r border-slate-200 text-slate-600 font-mono">
                        {rec.chqDate}
                      </td>

                      {/* Remarks */}
                      <td className="px-3.5 py-2 text-slate-600">
                        {rec.remarks}
                      </td>
                    </tr>
                  ))}

                  {paginatedRecords.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Pagination */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2 font-sans">
              <div>
                Showing {filteredRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} entries
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`size-6 rounded text-[11px] font-bold cursor-pointer transition ${
                      currentPage === p
                        ? "bg-[#8BC34A] text-white"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════
            OFFICIAL PAYMENT VOUCHER MODAL
            ═══════════════════════════════════════════════════════════ */}
        {viewingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto print:p-0 print:bg-white">
            <div className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-[900px] max-h-[94vh] overflow-y-auto relative border border-slate-300 print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
              
              {/* Modal Action Bar */}
              <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center print:hidden rounded-t-xl border-b border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Receipt className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm font-mono tracking-tight">{viewingRecord.voucherNo}</span>
                    <p className="text-[11px] text-slate-400 font-medium">Official Bill Payment Voucher</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition cursor-pointer shadow-sm shadow-emerald-600/30"
                  >
                    <Printer className="size-4" /> Print Voucher
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

              {/* Printable Document Body */}
              <div className="p-8 sm:p-10 space-y-5 bg-white text-slate-900" style={{ fontFamily: "Arial, 'Segoe UI', Tahoma, sans-serif" }}>
                
                {/* Header Row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <img src={pakizaSoftwareLogo} alt="PAKIZA SOFTWARE" className="h-10 w-auto object-contain" />
                      <div>
                        <h1 className="text-xl font-black tracking-tight text-blue-950 uppercase leading-none">
                          PAKIZA<br />
                          <span className="text-sm font-bold tracking-normal">SOFTWARE</span>
                        </h1>
                        <p className="text-[8px] text-slate-500 italic font-medium tracking-wide">
                          Experience | Intelligence | Automation
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 font-normal mt-1 max-w-[320px] leading-snug">
                      Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <h2 className="text-2xl font-bold text-slate-600 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                      Bill Payment Voucher
                    </h2>
                    <table className="border-collapse border border-slate-700 text-[11px] text-left">
                      <tbody>
                        <tr className="border-b border-slate-700">
                          <td className="border-r border-slate-700 px-2 py-0.5 font-bold text-slate-800 bg-slate-50">Voucher No :</td>
                          <td className="px-2 py-0.5 font-mono font-bold text-slate-900 min-w-[170px]">{viewingRecord.voucherNo}</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="border-r border-slate-700 px-2 py-0.5 font-bold text-slate-800 bg-slate-50">Payment Date :</td>
                          <td className="px-2 py-0.5 font-bold text-slate-900">{viewingRecord.paymentDate}</td>
                        </tr>
                        <tr>
                          <td className="border-r border-slate-700 px-2 py-0.5 font-bold text-slate-800 bg-slate-50">Supplier :</td>
                          <td className="px-2 py-0.5 font-bold text-slate-900">{viewingRecord.supplier}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Metadata Table */}
                <table className="w-full text-[11px] border-collapse border border-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-700">
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-700 bg-slate-50 w-[16%]">Payment Mode</td>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-900 w-[34%]">{viewingRecord.mode}</td>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-700 bg-slate-50 w-[16%]">Bank / Source</td>
                      <td className="px-2.5 py-1.5 font-bold text-slate-900 w-[34%]">{viewingRecord.bankAccount}</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-700 bg-slate-50">Cheque No</td>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-mono text-slate-900">{viewingRecord.chqNo}</td>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-700 bg-slate-50">Cheque Date</td>
                      <td className="px-2.5 py-1.5 text-slate-900">{viewingRecord.chqDate}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Settled Bills Breakdown */}
                {viewingRecord.settledBills && viewingRecord.settledBills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                      Settled Bills Breakdown
                    </h4>
                    <table className="w-full text-[11px] border-collapse border border-slate-700">
                      <thead>
                        <tr className="bg-[#eeeffa] border-b border-slate-700">
                          <th className="border-r border-slate-700 px-2.5 py-1.5 text-left font-bold text-slate-800 w-10">SL</th>
                          <th className="border-r border-slate-700 px-2.5 py-1.5 text-left font-bold text-slate-800">Bill No</th>
                          <th className="border-r border-slate-700 px-2.5 py-1.5 text-left font-bold text-slate-800">Bill Date</th>
                          <th className="border-r border-slate-700 px-2.5 py-1.5 text-left font-bold text-slate-800">Location</th>
                          <th className="border-r border-slate-700 px-2.5 py-1.5 text-right font-bold text-slate-800 w-28">Bill Amt</th>
                          <th className="border-r border-slate-700 px-2.5 py-1.5 text-right font-bold text-slate-800 w-24">Discount</th>
                          <th className="px-2.5 py-1.5 text-right font-bold text-slate-800 w-28">Paid Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingRecord.settledBills.map((sb, idx) => (
                          <tr key={idx} className="border-b border-slate-700">
                            <td className="border-r border-slate-700 px-2.5 py-1 text-center text-slate-600">{idx + 1}</td>
                            <td className="border-r border-slate-700 px-2.5 py-1 font-semibold text-slate-900">{sb.billNo}</td>
                            <td className="border-r border-slate-700 px-2.5 py-1 font-mono text-slate-600">{sb.billDate}</td>
                            <td className="border-r border-slate-700 px-2.5 py-1 text-slate-700">{sb.location || "—"}</td>
                            <td className="border-r border-slate-700 px-2.5 py-1 text-right font-mono">{sb.billAmt.toFixed(2)}</td>
                            <td className="border-r border-slate-700 px-2.5 py-1 text-right font-mono text-amber-700">{sb.discount.toFixed(2)}</td>
                            <td className="px-2.5 py-1 text-right font-mono font-bold text-slate-900">{sb.paidAmt.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-b border-slate-700 bg-slate-50 font-bold">
                          <td colSpan={6} className="border-r border-slate-700 px-3 py-1.5 text-right text-slate-800">
                            Total Settled:
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-black text-slate-900 text-xs">
                            {viewingRecord.currency === "USD" ? "$" : "৳"}{viewingRecord.amount.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* Amount in words and Remarks */}
                <table className="w-full text-[11px] border-collapse border border-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-700">
                      <td className="px-3 py-1.5">
                        <span className="font-bold text-slate-900">Amount in Words: </span>
                        <span className="italic text-slate-800">{numberToWords(viewingRecord.amount)} {viewingRecord.currency === "USD" ? "Dollars" : "Taka"} Only.</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5">
                        <span className="font-bold text-slate-900">Remarks: </span>
                        <span className="text-slate-700">{viewingRecord.remarks}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Signatures */}
                <div className="pt-12 grid grid-cols-4 gap-6 text-center text-[11px] print:pt-16">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Prepared By</p>
                    <div className="border-t border-slate-800 my-1"></div>
                    <p className="text-[10px] text-slate-500">Accounts Officer</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Verified By</p>
                    <div className="border-t border-slate-800 my-1"></div>
                    <p className="text-[10px] text-slate-500">Audit & Accounts</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Approved By</p>
                    <div className="border-t border-slate-800 my-1"></div>
                    <p className="text-[10px] text-slate-500">Head of Finance</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Received By</p>
                    <div className="border-t border-slate-800 my-1"></div>
                    <p className="text-[10px] text-slate-500">Supplier Representative</p>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="text-center text-[9px] text-slate-400 pt-5 border-t border-slate-200">
                  This is a computer-generated Bill Payment Voucher from Pakiza HRIS & ERP System.
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
