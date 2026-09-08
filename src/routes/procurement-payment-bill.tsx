import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  CreditCard,
  CheckSquare,
  Square,
  Search,
  Printer,
  CheckCircle2,
  Receipt,
  X,
  History,
  AlertCircle,
  Eye,
} from "lucide-react";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-payment-bill")({
  head: () => ({
    meta: [
      { title: "Bill Payment — Procurement | CRIPTON" },
      { name: "description", content: "Procurement Bill Payment and Settlement Console with multi-bill allocation, payment modes, and voucher generation." },
    ],
  }),
  component: BillPaymentPage,
});

export interface PendingBill {
  id: string;
  supplier: string;
  type: string;
  location: string;
  billNo: string;
  billDate: string;
  billAmt: number;
  currency: "BDT" | "USD";
  dueAmt: number;
  paidAmt: number;
  discount: number;
  selected: boolean;
}

export interface PaymentVoucher {
  id: string;
  voucherNo: string;
  voucherDate: string;
  supplier: string;
  paymentMode: string;
  bankAccount: string;
  chequeNo: string;
  chequeDate: string;
  totalPaid: number;
  totalDiscount: number;
  remarks: string;
  settledBills: {
    billNo: string;
    billDate: string;
    location: string;
    billAmt: number;
    currency: string;
    dueAmt: number;
    paidAmt: number;
    discount: number;
  }[];
  createdAt: string;
  preparedBy: string;
}

// Initial pending bills matching user's screenshot exactly for M.B. Trade Corporation
const INITIAL_PENDING_BILLS: PendingBill[] = [
  {
    id: "pb-1",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PSL-Operation",
    billNo: "Test Bill",
    billDate: "07/07/2026",
    billAmt: 120.00,
    currency: "BDT",
    dueAmt: 120.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-2",
    supplier: "M.B. Trade Corporation",
    type: "",
    location: "",
    billNo: "P-240090",
    billDate: "20/09/2024",
    billAmt: 29160.00,
    currency: "USD",
    dueAmt: 29160.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-3",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PKCL-Savar",
    billNo: "116",
    billDate: "01/09/2024",
    billAmt: 132500.00,
    currency: "BDT",
    dueAmt: 132500.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-4",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PAL-Fabric Dyeing",
    billNo: "MBTC/2023-24/PAL/AT.S/109",
    billDate: "20/08/2024",
    billAmt: 300000.00,
    currency: "BDT",
    dueAmt: 300000.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-5",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PKCL-Savar",
    billNo: "216",
    billDate: "30/05/2024",
    billAmt: 132500.00,
    currency: "BDT",
    dueAmt: 132500.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-6",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PAL-Fabric Dyeing",
    billNo: "139",
    billDate: "02/12/2023",
    billAmt: 51500.00,
    currency: "BDT",
    dueAmt: 51500.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-7",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PWFL-Nowpara",
    billNo: "139",
    billDate: "02/12/2023",
    billAmt: 54000.00,
    currency: "BDT",
    dueAmt: 54000.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-8",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PKCL-Savar",
    billNo: "112",
    billDate: "22/10/2023",
    billAmt: 153000.00,
    currency: "BDT",
    dueAmt: 153000.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-9",
    supplier: "M.B. Trade Corporation",
    type: "",
    location: "",
    billNo: "ABC-Tareq",
    billDate: "18/10/2023",
    billAmt: 2880.00,
    currency: "USD",
    dueAmt: 2880.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-10",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PAL-Fabric Dyeing",
    billNo: "74",
    billDate: "23/08/2023",
    billAmt: 46000.00,
    currency: "BDT",
    dueAmt: 46000.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-11",
    supplier: "M.B. Trade Corporation",
    type: "Gen",
    location: "PWFL-Nowpara",
    billNo: "2943",
    billDate: "06/07/2023",
    billAmt: 36500.00,
    currency: "BDT",
    dueAmt: 36500.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-12",
    supplier: "Rakamari Tools & Hardware",
    type: "Gen",
    location: "PKCL-Savar",
    billNo: "1002",
    billDate: "01/03/2026",
    billAmt: 3820.00,
    currency: "BDT",
    dueAmt: 3820.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-13",
    supplier: "Gadget & Gaming Zone",
    type: "Gen",
    location: "PSL-Operation",
    billNo: "1298",
    billDate: "03/09/2026",
    billAmt: 450.00,
    currency: "BDT",
    dueAmt: 450.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
  {
    id: "pb-14",
    supplier: "Global Net Computers",
    type: "Gen",
    location: "PAL-Fabric Dyeing",
    billNo: "00628",
    billDate: "15/08/2026",
    billAmt: 17500.00,
    currency: "BDT",
    dueAmt: 17500.00,
    paidAmt: 0,
    discount: 0,
    selected: false,
  },
];

const SUPPLIERS_LIST = [
  "M.B. Trade Corporation",
  "Rakamari Tools & Hardware",
  "Gadget & Gaming Zone",
  "Global Net Computers",
  "Apex Textile Chemical Ltd",
  "Konica Hardware",
  "B. BARIA BELT GALLERY",
  "Robotics BD",
  "Star Tech Ltd",
  "Techno House",
  "ZOOM TECHNOLOGY",
];

const BANK_ACCOUNTS = [
  "Dutch-Bangla Bank - 103110002891 (Principal Br.)",
  "BRAC Bank - 1501203491001 (Gulshan Br.)",
  "Pubali Bank - 091890102341 (Motijheel Br.)",
  "Eastern Bank Ltd - 1042000341 (Dhanmondi Br.)",
  "Islami Bank BD - 2050123992 (Kawran Bazar Br.)",
  "Cash in Hand (Accounts Central Cash)",
];

const PAYMENT_MODES = [
  "Cheque",
  "Bank Transfer",
  "Cash",
  "BEFTN",
  "RTGS",
  "Pay Order",
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

function BillPaymentPage() {
  // Top Form States (matching screenshot)
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("2026-09-08");
  const [supplierName, setSupplierName] = useState<string>("M.B. Trade Corporation");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [chequeNo, setChequeNo] = useState<string>("");
  const [chequeDate, setChequeDate] = useState<string>("2026-09-08");
  const [lumpSumAmount, setLumpSumAmount] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  // Bills list state
  const [bills, setBills] = useState<PendingBill[]>(() => {
    const saved = localStorage.getItem("procurement_pending_bills_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PENDING_BILLS;
  });

  // Payment Vouchers History
  const [vouchers, setVouchers] = useState<PaymentVoucher[]>(() => {
    const saved = localStorage.getItem("procurement_payment_vouchers_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("procurement_pending_bills_v1", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem("procurement_payment_vouchers_v1", JSON.stringify(vouchers));
  }, [vouchers]);

  // Active View Tab: 'entry' or 'history'
  const [activeTab, setActiveTab] = useState<"entry" | "history">("entry");

  // Search query for table
  const [searchQuery, setSearchQuery] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState<"ALL" | "BDT" | "USD">("ALL");

  // Modal State for Voucher View
  const [viewingVoucher, setViewingVoucher] = useState<PaymentVoucher | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered bills for the currently selected supplier
  const displayedBills = useMemo(() => {
    return bills.filter((b) => {
      // Must match supplier
      if (supplierName && b.supplier !== supplierName) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNo = b.billNo.toLowerCase().includes(q);
        const matchLoc = b.location.toLowerCase().includes(q);
        const matchType = b.type.toLowerCase().includes(q);
        if (!matchNo && !matchLoc && !matchType) return false;
      }
      // Currency filter
      if (currencyFilter !== "ALL" && b.currency !== currencyFilter) {
        return false;
      }
      return true;
    });
  }, [bills, supplierName, searchQuery, currencyFilter]);

  // Live Calculations for summary
  const totalPaidAmt = useMemo(() => {
    return displayedBills.reduce((sum, b) => sum + (b.selected ? Number(b.paidAmt || 0) : 0), 0);
  }, [displayedBills]);

  const totalDiscount = useMemo(() => {
    return displayedBills.reduce((sum, b) => sum + (b.selected ? Number(b.discount || 0) : 0), 0);
  }, [displayedBills]);

  const selectedBillsCount = useMemo(() => {
    return displayedBills.filter((b) => b.selected).length;
  }, [displayedBills]);

  const allSelected = useMemo(() => {
    return displayedBills.length > 0 && displayedBills.every((b) => b.selected);
  }, [displayedBills]);

  // Row selection toggle
  const handleToggleSelect = (id: string) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextSelected = !b.selected;
          return {
            ...b,
            selected: nextSelected,
            paidAmt: nextSelected ? (b.paidAmt > 0 ? b.paidAmt : b.dueAmt) : 0,
            discount: nextSelected ? b.discount : 0,
          };
        }
        return b;
      })
    );
  };

  // Master Select All / Deselect All
  const handleSelectAll = () => {
    const nextState = !allSelected;
    setBills((prev) =>
      prev.map((b) => {
        const isCurrentlyDisplayed = displayedBills.some((db) => db.id === b.id);
        if (isCurrentlyDisplayed) {
          return {
            ...b,
            selected: nextState,
            paidAmt: nextState ? (b.paidAmt > 0 ? b.paidAmt : b.dueAmt) : 0,
            discount: nextState ? b.discount : 0,
          };
        }
        return b;
      })
    );
  };

  // PaidAmt input change
  const handlePaidAmtChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            paidAmt: num,
            selected: num > 0 || b.discount > 0 ? true : b.selected,
          };
        }
        return b;
      })
    );
  };

  // Discount input change
  const handleDiscountChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            discount: num,
            selected: num > 0 || b.paidAmt > 0 ? true : b.selected,
          };
        }
        return b;
      })
    );
  };

  // Auto-allocate entered lump-sum amount
  const handleAutoAllocate = () => {
    const amountToAllocate = parseFloat(lumpSumAmount);
    if (!amountToAllocate || isNaN(amountToAllocate) || amountToAllocate <= 0) {
      alert("Please enter a valid amount in the 'Amount' field to allocate.");
      return;
    }

    let remaining = amountToAllocate;
    setBills((prev) =>
      prev.map((b) => {
        const isMatch = displayedBills.some((db) => db.id === b.id);
        if (!isMatch) return b;

        if (remaining <= 0) {
          return { ...b, selected: false, paidAmt: 0 };
        }

        const alloc = Math.min(remaining, b.dueAmt);
        remaining -= alloc;

        return {
          ...b,
          selected: true,
          paidAmt: alloc,
        };
      })
    );

    showToast(`Allocated ৳${amountToAllocate.toLocaleString()} across eligible bills.`);
  };

  // Reset / Clear row inputs
  const handleResetSelections = () => {
    setBills((prev) =>
      prev.map((b) => ({
        ...b,
        selected: false,
        paidAmt: 0,
        discount: 0,
      }))
    );
    showToast("Bill selections and amounts reset.");
  };

  // Handle SUBMIT action
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierName) {
      alert("Please select a Supplier Name.");
      return;
    }

    const selectedBills = displayedBills.filter((b) => b.selected && b.paidAmt > 0);
    if (selectedBills.length === 0) {
      alert("Please select at least one bill and enter a PaidAmt to settle.");
      return;
    }

    const voucherNum = `BP-VOUCH-${new Date().getFullYear()}-${String(vouchers.length + 1).padStart(4, "0")}`;
    const newVoucher: PaymentVoucher = {
      id: "vouch-" + Date.now(),
      voucherNo: voucherNum,
      voucherDate: paymentDate,
      supplier: supplierName,
      paymentMode: paymentMode || "Bank Transfer",
      bankAccount: bankAccount || "Dutch-Bangla Bank - 103110002891 (Principal Br.)",
      chequeNo: chequeNo || "N/A",
      chequeDate: chequeDate,
      totalPaid: totalPaidAmt,
      totalDiscount: totalDiscount,
      remarks: remarks || "Settlement of supplier bills",
      settledBills: selectedBills.map((b) => ({
        billNo: b.billNo,
        billDate: b.billDate,
        location: b.location,
        billAmt: b.billAmt,
        currency: b.currency,
        dueAmt: b.dueAmt,
        paidAmt: b.paidAmt,
        discount: b.discount,
      })),
      createdAt: new Date().toISOString(),
      preparedBy: "Accounts Officer",
    };

    // Update bills state to deduct paid amounts
    setBills((prev) =>
      prev.map((b) => {
        const settled = selectedBills.find((sb) => sb.id === b.id);
        if (settled) {
          const newDue = Math.max(0, b.dueAmt - settled.paidAmt - settled.discount);
          return {
            ...b,
            dueAmt: newDue,
            paidAmt: 0,
            discount: 0,
            selected: false,
          };
        }
        return b;
      })
    );

    // Save voucher
    setVouchers((prev) => [newVoucher, ...prev]);

    // Open voucher modal
    setViewingVoucher(newVoucher);
    showToast(`Payment Voucher ${voucherNum} generated successfully!`);
  };

  return (
    <div className="min-h-screen flex bg-[#f4f6f9] text-slate-800 transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-16">
        <ProcurementTopbar />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-emerald-500/30 animate-in slide-in-from-top-3">
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-7 space-y-5 w-full max-w-[1700px] mx-auto">
          
          {/* Breadcrumb & Navigation Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                <CreditCard className="size-5.5 text-blue-600" />
                Bill Payment
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Procurement &gt; Payment &gt; <span className="text-blue-600 font-semibold">Bill Payment</span>
              </p>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("entry")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === "entry"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="size-3.5" />
                Payment Settlement
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === "history"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <History className="size-3.5" />
                Payment History
                {vouchers.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold">
                    {vouchers.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeTab === "entry" ? (
            <>
              {/* ═══════════════════════════════════════════════════════════
                  TOP FORM CARD (Exact Layout matching User's Screenshot)
                  ═══════════════════════════════════════════════════════════ */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200/90 border-l-[6px] border-l-[#1890ff] p-5 lg:p-6 transition-all">
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  
                  {/* Row 1: 6 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                    
                    {/* Payment Mode */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 block">
                        Payment Mode
                      </label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="">Select Mode</option>
                        {PAYMENT_MODES.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Date */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 block">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Supplier Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 block">
                        Supplier Name
                      </label>
                      <select
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {SUPPLIERS_LIST.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bank Account */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 block">
                        Bank Account
                      </label>
                      <select
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer truncate"
                      >
                        <option value="">Select Bank Account</option>
                        {BANK_ACCOUNTS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Cheque No */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 block">
                        Cheque No
                      </label>
                      <input
                        type="text"
                        placeholder="Cheque No"
                        value={chequeNo}
                        onChange={(e) => setChequeNo(e.target.value)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Cheque Date */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 block">
                        Cheque Date
                      </label>
                      <input
                        type="date"
                        value={chequeDate}
                        onChange={(e) => setChequeDate(e.target.value)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                  </div>

                  {/* Row 2: Amount, Remarks, SUBMIT Button, Summary Stats, SHOW Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center pt-2">
                    
                    {/* Amount */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 block">
                        Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={lumpSumAmount}
                          onChange={(e) => setLumpSumAmount(e.target.value)}
                          className="w-full h-8 pl-2.5 pr-14 bg-white border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                        />
                        {lumpSumAmount && (
                          <button
                            type="button"
                            onClick={handleAutoAllocate}
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                            title="Allocate this amount across bills"
                          >
                            Allocate
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600 block">
                        Remarks
                      </label>
                      <input
                        type="text"
                        placeholder="Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* SUBMIT Button */}
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="h-8 px-5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold text-xs rounded shadow-xs transition duration-150 cursor-pointer uppercase tracking-wider"
                      >
                        SUBMIT
                      </button>
                    </div>

                    {/* Empty placeholder column to preserve layout balance */}
                    <div className="hidden lg:block"></div>

                    {/* Real-time Summary: PaidAmt & Discount */}
                    <div className="space-y-0.5 text-left font-sans">
                      <div className="text-xs font-bold text-[#16a34a]">
                        PaidAmt: <span className="font-mono">{totalPaidAmt.toFixed(0)}</span>
                      </div>
                      <div className="text-xs font-bold text-[#16a34a]">
                        Discount: <span className="font-mono">{totalDiscount.toFixed(0)}</span>
                      </div>
                    </div>

                    {/* SHOW Button */}
                    <div className="flex justify-end items-end">
                      <button
                        type="button"
                        onClick={() => showToast(`Loaded ${displayedBills.length} pending bills for ${supplierName}`)}
                        className="h-8 px-6 bg-[#7cb342] hover:bg-[#689f38] text-white font-bold text-xs rounded shadow-xs transition duration-150 cursor-pointer uppercase tracking-wider"
                      >
                        SHOW
                      </button>
                    </div>

                  </div>

                </form>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  BILLS TABLE & TOOLBAR (Matching User's Screenshot)
                  ═══════════════════════════════════════════════════════════ */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Secondary Action Toolbar */}
                <div className="px-4 py-2.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 bg-slate-50/70 text-xs">
                  
                  {/* Left stats & bulk actions */}
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700">
                      Pending Bills: <span className="text-blue-600 font-bold">{displayedBills.length}</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-600 font-medium">
                      Selected: <span className="font-bold text-emerald-600">{selectedBillsCount}</span>
                    </span>
                    {selectedBillsCount > 0 && (
                      <button
                        type="button"
                        onClick={handleResetSelections}
                        className="text-[11px] text-rose-600 hover:underline font-medium cursor-pointer"
                      >
                        Clear Selections
                      </button>
                    )}
                  </div>

                  {/* Right quick filters & search */}
                  <div className="flex items-center gap-2">
                    {/* Currency filter tabs */}
                    <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-white">
                      {(["ALL", "BDT", "USD"] as const).map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => setCurrencyFilter(curr)}
                          className={`px-2.5 py-1 text-[10px] font-bold cursor-pointer transition ${
                            currencyFilter === curr
                              ? "bg-slate-800 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>

                    {/* Table search box */}
                    <div className="relative w-48">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search bill / location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-7 pr-2 h-7 bg-white border border-slate-300 rounded text-[11px] text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Export Actions */}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="h-7 px-2 bg-white hover:bg-slate-50 border border-slate-300 rounded text-[11px] font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                      title="Print Table"
                    >
                      <Printer className="size-3 text-slate-600" /> Print
                    </button>
                  </div>

                </div>

                {/* Table with light blue-gray header */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#dce3ec] text-slate-700 border-b border-slate-300 text-[11px] font-semibold">
                        
                        {/* Select All Checkbox column with filter icon */}
                        <th className="px-3 py-2 w-10 text-center border-r border-slate-300/80">
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-slate-600 hover:text-slate-900 flex items-center justify-center mx-auto cursor-pointer"
                            title={allSelected ? "Deselect All" : "Select All"}
                          >
                            <span className="text-[10px] mr-0.5">▽</span>
                            {allSelected ? (
                              <CheckSquare className="size-4 text-blue-600" />
                            ) : (
                              <Square className="size-4 text-slate-400" />
                            )}
                          </button>
                        </th>

                        <th className="px-3 py-2 w-16 border-r border-slate-300/80 font-bold">Type</th>
                        <th className="px-3 py-2 min-w-[150px] border-r border-slate-300/80 font-bold">Location</th>
                        <th className="px-3 py-2 min-w-[170px] border-r border-slate-300/80 font-bold">Bill No</th>
                        <th className="px-3 py-2 min-w-[110px] border-r border-slate-300/80 font-bold">Bill Date</th>
                        <th className="px-3 py-2 min-w-[130px] text-right border-r border-slate-300/80 font-bold">Bill Amt</th>
                        <th className="px-3 py-2 min-w-[110px] text-right border-r border-slate-300/80 font-bold">DueAmt</th>
                        <th className="px-3 py-2 min-w-[130px] text-center border-r border-slate-300/80 font-bold bg-[#d4deea]">
                          PaidAmt
                        </th>
                        <th className="px-3 py-2 min-w-[130px] text-center font-bold bg-[#d4deea]">
                          Discount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {displayedBills.map((bill) => (
                        <tr
                          key={bill.id}
                          className={`transition-colors duration-100 ${
                            bill.selected ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50/70"
                          }`}
                        >
                          {/* Row Checkbox */}
                          <td className="px-3 py-1.5 text-center border-r border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect(bill.id)}
                              className="cursor-pointer text-slate-400 hover:text-blue-600 flex items-center justify-center mx-auto"
                            >
                              {bill.selected ? (
                                <CheckSquare className="size-4 text-blue-600" />
                              ) : (
                                <Square className="size-4 text-slate-300" />
                              )}
                            </button>
                          </td>

                          {/* Type */}
                          <td className="px-3 py-1.5 border-r border-slate-200 text-slate-700 font-medium">
                            {bill.type || "—"}
                          </td>

                          {/* Location */}
                          <td className="px-3 py-1.5 border-r border-slate-200 text-slate-800">
                            {bill.location || "—"}
                          </td>

                          {/* Bill No */}
                          <td className="px-3 py-1.5 border-r border-slate-200 font-semibold text-slate-900">
                            {bill.billNo}
                          </td>

                          {/* Bill Date */}
                          <td className="px-3 py-1.5 border-r border-slate-200 text-slate-600 font-mono">
                            {bill.billDate}
                          </td>

                          {/* Bill Amt */}
                          <td className="px-3 py-1.5 border-r border-slate-200 text-right font-mono font-medium text-slate-800">
                            {bill.billAmt.toFixed(2)} {bill.currency}
                          </td>

                          {/* DueAmt */}
                          <td className="px-3 py-1.5 border-r border-slate-200 text-right font-mono font-bold text-rose-700">
                            {bill.dueAmt.toFixed(2)}
                          </td>

                          {/* PaidAmt Input Box */}
                          <td className="px-3 py-1.5 border-r border-slate-200 text-center bg-white">
                            <input
                              type="number"
                              step="0.01"
                              value={bill.paidAmt > 0 ? bill.paidAmt : ""}
                              onChange={(e) => handlePaidAmtChange(bill.id, e.target.value)}
                              placeholder="0.00"
                              className={`w-full max-w-[120px] h-7 px-2 text-right text-xs font-mono font-bold rounded border transition ${
                                bill.paidAmt > 0
                                  ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 focus:bg-white"
                                  : "border-slate-300 bg-[#fafafa] text-slate-700 hover:border-slate-400 focus:bg-white focus:border-blue-500"
                              } focus:outline-none`}
                            />
                          </td>

                          {/* Discount Input Box */}
                          <td className="px-3 py-1.5 text-center bg-white">
                            <input
                              type="number"
                              step="0.01"
                              value={bill.discount > 0 ? bill.discount : ""}
                              onChange={(e) => handleDiscountChange(bill.id, e.target.value)}
                              placeholder="0.00"
                              className={`w-full max-w-[120px] h-7 px-2 text-right text-xs font-mono font-bold rounded border transition ${
                                bill.discount > 0
                                  ? "border-amber-500 bg-amber-50/50 text-amber-900 focus:bg-white"
                                  : "border-slate-300 bg-[#fafafa] text-slate-700 hover:border-slate-400 focus:bg-white focus:border-blue-500"
                              } focus:outline-none`}
                            />
                          </td>
                        </tr>
                      ))}

                      {displayedBills.length === 0 && (
                        <tr>
                          <td colSpan={9} className="text-center py-12 text-slate-400 font-medium">
                            <AlertCircle className="size-8 text-slate-300 mx-auto mb-2" />
                            No pending bills found for the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {/* Table Totals Footer */}
                    {displayedBills.length > 0 && (
                      <tfoot>
                        <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300 text-xs">
                          <td colSpan={5} className="px-4 py-2.5 text-right border-r border-slate-200">
                            Total Outstanding Due:
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono border-r border-slate-200 text-slate-600">
                            —
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-rose-700 border-r border-slate-200">
                            ৳{displayedBills.filter(b => b.currency === "BDT").reduce((a, b) => a + b.dueAmt, 0).toFixed(2)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-emerald-700 border-r border-slate-200 bg-emerald-50/50">
                            ৳{totalPaidAmt.toFixed(2)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-amber-700 bg-amber-50/50">
                            ৳{totalDiscount.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>

                {/* Table Bottom Navigation Bar */}
                <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span>Showing {displayedBills.length} pending bill records for <strong>{supplierName}</strong></span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-600">
                      Total Allocated: <strong className="text-emerald-700 font-mono">৳{totalPaidAmt.toFixed(2)}</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-600">
                      Total Discount: <strong className="text-amber-700 font-mono">৳{totalDiscount.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

              </div>
            </>
          ) : (
            /* ═══════════════════════════════════════════════════════════
               PAYMENT HISTORY & VOUCHERS TAB
               ═══════════════════════════════════════════════════════════ */
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <History className="size-4 text-blue-600" />
                    Payment Vouchers History
                  </h3>
                  <p className="text-xs text-slate-500">Record of all finalized bill payment transactions and disbursements</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {vouchers.length} Total Payments
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] font-semibold">
                      <th className="px-4 py-2.5 w-12 text-center">SL</th>
                      <th className="px-4 py-2.5">Voucher No</th>
                      <th className="px-4 py-2.5">Payment Date</th>
                      <th className="px-4 py-2.5">Supplier</th>
                      <th className="px-4 py-2.5">Payment Mode</th>
                      <th className="px-4 py-2.5">Bank / Cheque</th>
                      <th className="px-4 py-2.5 text-right">Bills Settled</th>
                      <th className="px-4 py-2.5 text-right font-bold">Total Paid</th>
                      <th className="px-4 py-2.5 text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {vouchers.map((vouch, idx) => (
                      <tr key={vouch.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-2 text-center text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-2 font-mono font-bold text-blue-600">{vouch.voucherNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-600">{vouch.voucherDate}</td>
                        <td className="px-4 py-2 font-semibold text-slate-800">{vouch.supplier}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">
                            {vouch.paymentMode}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-slate-600">
                          <div className="font-medium text-slate-700">{vouch.bankAccount.split(" (")[0]}</div>
                          {vouch.chequeNo !== "N/A" && (
                            <div className="text-[10px] text-slate-400 font-mono">Chq: {vouch.chequeNo}</div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-slate-700">
                          {vouch.settledBills.length} Bill{vouch.settledBills.length > 1 ? "s" : ""}
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-emerald-700 text-xs">
                          ৳{vouch.totalPaid.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => setViewingVoucher(vouch)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 mx-auto cursor-pointer transition"
                          >
                            <Eye className="size-3" /> View
                          </button>
                        </td>
                      </tr>
                    ))}

                    {vouchers.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center py-12 text-slate-400">
                          No payment vouchers generated yet. Settle bills in the "Payment Settlement" tab to view history.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════
            OFFICIAL PAYMENT VOUCHER MODAL (Printable Document)
            ═══════════════════════════════════════════════════════════ */}
        {viewingVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto print:p-0 print:bg-white">
            <div className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-[900px] max-h-[94vh] overflow-y-auto relative border border-slate-300 print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
              
              {/* Modal Action Bar */}
              <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center print:hidden rounded-t-xl border-b border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Receipt className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm font-mono tracking-tight">{viewingVoucher.voucherNo}</span>
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
                    onClick={() => setViewingVoucher(null)}
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
                          <td className="px-2 py-0.5 font-mono font-bold text-slate-900 min-w-[170px]">{viewingVoucher.voucherNo}</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="border-r border-slate-700 px-2 py-0.5 font-bold text-slate-800 bg-slate-50">Payment Date :</td>
                          <td className="px-2 py-0.5 font-bold text-slate-900">{viewingVoucher.voucherDate}</td>
                        </tr>
                        <tr>
                          <td className="border-r border-slate-700 px-2 py-0.5 font-bold text-slate-800 bg-slate-50">Supplier :</td>
                          <td className="px-2 py-0.5 font-bold text-slate-900">{viewingVoucher.supplier}</td>
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
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-900 w-[34%]">{viewingVoucher.paymentMode}</td>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-700 bg-slate-50 w-[16%]">Bank Account</td>
                      <td className="px-2.5 py-1.5 font-bold text-slate-900 w-[34%]">{viewingVoucher.bankAccount}</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-700 bg-slate-50">Cheque No</td>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-mono text-slate-900">{viewingVoucher.chequeNo}</td>
                      <td className="border-r border-slate-700 px-2.5 py-1.5 font-bold text-slate-700 bg-slate-50">Cheque Date</td>
                      <td className="px-2.5 py-1.5 text-slate-900">{viewingVoucher.chequeDate}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Settled Bills Breakdown */}
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
                      {viewingVoucher.settledBills.map((sb, idx) => (
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
                        <td colSpan={5} className="border-r border-slate-700 px-3 py-1.5 text-right text-slate-800">
                          Total Summary:
                        </td>
                        <td className="border-r border-slate-700 px-2.5 py-1.5 text-right font-mono text-amber-700">
                          {viewingVoucher.totalDiscount.toFixed(2)}
                        </td>
                        <td className="px-2.5 py-1.5 text-right font-mono font-black text-slate-900 text-xs">
                          {viewingVoucher.totalPaid.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Amount in words and Remarks */}
                <table className="w-full text-[11px] border-collapse border border-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-700">
                      <td className="px-3 py-1.5">
                        <span className="font-bold text-slate-900">Amount in Words: </span>
                        <span className="italic text-slate-800">{numberToWords(viewingVoucher.totalPaid)} Taka Only.</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5">
                        <span className="font-bold text-slate-900">Remarks: </span>
                        <span className="text-slate-700">{viewingVoucher.remarks}</span>
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
