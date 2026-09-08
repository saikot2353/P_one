import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Search,
  Paperclip,
  Printer,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Filter,
  Calendar,
  Building2,
  Calculator,
  RefreshCw,
  Package,
  X,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/procurement-billing-vat-tax-entry")({
  head: () => ({
    meta: [
      { title: "VAT Tax Entry — Billing | CRIPTON Procurement" },
      { name: "description", content: "Smart VAT & Tax Entry console with real-time tax calculator and bill posting workspace." },
    ],
  }),
  component: VatTaxEntryPage,
});

export interface BillEntryItem {
  id: string;
  itemName: string;
  purchaseQty: number;
  acPrice: number;
  totalPrice: number;
}

export interface UnpostedBill {
  id: string;
  billNo: string;
  billDate: string;
  supplierName: string;
  vatApplicable: string;
  purchaseType: string;
  currency: string;
  currencyRate: number;
  isLoan: string;
  items: BillEntryItem[];
  discount: number;
  otherAmt: number;
  vatPayer: "Own" | "Supplier";
  vatType: "Include" | "Exclude";
  vatPct: number;
  taxPayer: "Own" | "Supplier";
  taxType: "Include" | "Exclude";
  taxPct: number;
  calcVatWithOther: boolean;
  comments?: string;
}

const INITIAL_UNPOSTED_BILLS: UnpostedBill[] = [
  {
    id: "bill-6747",
    billNo: "6747",
    billDate: "25/08/2026",
    supplierName: "Techno House",
    vatApplicable: "Yes",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    items: [
      { id: "item-1", itemName: "SSD 1 TB :: PCS", purchaseQty: 1, acPrice: 20000.0, totalPrice: 20000.0 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    vatPayer: "Own",
    vatType: "Include",
    vatPct: 0.0,
    taxPayer: "Own",
    taxType: "Include",
    taxPct: 0.0,
    calcVatWithOther: false,
    comments: "",
  },
  {
    id: "bill-00",
    billNo: "00",
    billDate: "10/08/2026",
    supplierName: "UNKNOWN",
    vatApplicable: "No",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    items: [
      { id: "item-2", itemName: "Office Consumables Batch", purchaseQty: 1, acPrice: 48.99, totalPrice: 48.99 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    vatPayer: "Own",
    vatType: "Include",
    vatPct: 0.0,
    taxPayer: "Own",
    taxType: "Include",
    taxPct: 0.0,
    calcVatWithOther: false,
    comments: "",
  },
  {
    id: "bill-019",
    billNo: "019",
    billDate: "12/08/2026",
    supplierName: "Konica Hardware",
    vatApplicable: "Yes",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    items: [
      { id: "item-3", itemName: "High Grade Door Hinges :: SET", purchaseQty: 2, acPrice: 190.0, totalPrice: 380.0 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    vatPayer: "Own",
    vatType: "Include",
    vatPct: 5.0,
    taxPayer: "Own",
    taxType: "Include",
    taxPct: 2.0,
    calcVatWithOther: false,
    comments: "",
  },
  {
    id: "bill-020",
    billNo: "020",
    billDate: "13/08/2026",
    supplierName: "B. BARIA BELT GALLERY",
    vatApplicable: "Yes",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    items: [
      { id: "item-4", itemName: "Industrial Conveyor Belts :: PCS", purchaseQty: 4, acPrice: 500.0, totalPrice: 2000.0 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    vatPayer: "Own",
    vatType: "Include",
    vatPct: 0.0,
    taxPayer: "Own",
    taxType: "Include",
    taxPct: 0.0,
    calcVatWithOther: false,
    comments: "",
  },
  {
    id: "bill-00628",
    billNo: "00628",
    billDate: "15/08/2026",
    supplierName: "Global Net Computers",
    vatApplicable: "Yes",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    items: [
      { id: "item-5", itemName: "Gigabit Managed Switch 24P :: PCS", purchaseQty: 1, acPrice: 17500.0, totalPrice: 17500.0 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    vatPayer: "Own",
    vatType: "Include",
    vatPct: 5.0,
    taxPayer: "Own",
    taxType: "Include",
    taxPct: 2.0,
    calcVatWithOther: false,
    comments: "",
  },
];

function VatTaxEntryPage() {
  // Filter Console State
  const [dateFrom, setDateFrom] = useState("09/08/2026");
  const [dateTo, setDateTo] = useState("08/09/2026");
  const [vatApplicableFilter, setVatApplicableFilter] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");

  // Left List Search State
  const [leftSearchQuery, setLeftSearchQuery] = useState("");

  // Bills Data State
  const [bills, setBills] = useState<UnpostedBill[]>(() => {
    const saved = localStorage.getItem("procurement_unposted_bills_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_UNPOSTED_BILLS;
  });

  useEffect(() => {
    localStorage.setItem("procurement_unposted_bills_v1", JSON.stringify(bills));
  }, [bills]);

  // Selected Bill for Right Form Console
  const [selectedBillId, setSelectedBillId] = useState<string>("bill-6747");

  // Form State for Active Selected Bill
  const activeBill = useMemo(() => {
    return bills.find((b) => b.id === selectedBillId) || bills[0];
  }, [bills, selectedBillId]);

  const [formData, setFormData] = useState<UnpostedBill>(activeBill);

  useEffect(() => {
    if (activeBill) {
      setFormData({ ...activeBill });
    }
  }, [activeBill]);

  // Attachment Modal State
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  // Success Notification Toast
  const [successMsg, setSuccessMsg] = useState("");

  // Filtered Unposted Bills List for Left Panel
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      // VAT Applicable Filter
      if (vatApplicableFilter !== "All" && vatApplicableFilter !== "select One") {
        if (b.vatApplicable.toLowerCase() !== vatApplicableFilter.toLowerCase()) return false;
      }

      // Supplier Filter
      if (supplierFilter !== "All" && supplierFilter !== "Select...") {
        if (b.supplierName !== supplierFilter) return false;
      }

      // Left Search Query
      if (leftSearchQuery.trim()) {
        const q = leftSearchQuery.toLowerCase().trim();
        const matchesNo = b.billNo.toLowerCase().includes(q);
        const matchesSupplier = b.supplierName.toLowerCase().includes(q);
        const matchesDate = b.billDate.toLowerCase().includes(q);
        if (!matchesNo && !matchesSupplier && !matchesDate) return false;
      }

      return true;
    });
  }, [bills, vatApplicableFilter, supplierFilter, leftSearchQuery]);

  // Real-time Financial & VAT / Tax Calculation Logic
  const calculations = useMemo(() => {
    const subtotal = formData.items.reduce((acc, item) => acc + item.totalPrice, 0);
    const discount = Number(formData.discount) || 0;
    const otherAmt = Number(formData.otherAmt) || 0;

    // Base for VAT & TAX
    const baseAmt = formData.calcVatWithOther ? subtotal + otherAmt - discount : subtotal - discount;

    const vatPct = Number(formData.vatPct) || 0;
    let vatAmt = 0;
    if (vatPct > 0) {
      if (formData.vatType === "Include") {
        vatAmt = (baseAmt * vatPct) / (100 + vatPct);
      } else {
        vatAmt = (baseAmt * vatPct) / 100;
      }
    }

    const taxPct = Number(formData.taxPct) || 0;
    let taxAmt = 0;
    if (taxPct > 0) {
      if (formData.taxType === "Include") {
        taxAmt = (baseAmt * taxPct) / (100 + taxPct);
      } else {
        taxAmt = (baseAmt * taxPct) / 100;
      }
    }

    let netPayable = baseAmt + otherAmt;
    if (formData.vatType === "Exclude" && formData.vatPayer === "Own") {
      netPayable += vatAmt;
    }
    if (formData.taxType === "Exclude" && formData.taxPayer === "Own") {
      netPayable += taxAmt;
    }

    const grandTotal = netPayable;

    return {
      subtotal,
      discount,
      otherAmt,
      vatAmt,
      taxAmt,
      netPayable,
      grandTotal,
    };
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update in local state database
    setBills((prev) =>
      prev.map((b) => (b.id === formData.id ? { ...formData } : b))
    );

    setSuccessMsg(`VAT & Tax Entry for Bill #${formData.billNo} successfully saved!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const resetFilterConsole = () => {
    setDateFrom("09/08/2026");
    setDateTo("08/09/2026");
    setVatApplicableFilter("All");
    setSupplierFilter("All");
    setLeftSearchQuery("");
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
                <Calculator className="size-6 text-emerald-600 dark:text-emerald-400" />
                VAT Tax Entry
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Procurement Workspace &gt; Billing &gt; <span className="text-emerald-600 dark:text-emerald-400 font-semibold">VAT Tax Entry</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAttachmentOpen(true)}
                className="h-9 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Paperclip className="size-4" /> View Attachments
              </button>
            </div>
          </div>

          {/* Success Notification Banner */}
          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800">
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Top Filter Parameters Console (Matching Screenshot Bar Layout) */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
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

              {/* VAT Applicable */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  VAT Applicable
                </label>
                <select
                  value={vatApplicableFilter}
                  onChange={(e) => setVatApplicableFilter(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">select One</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Supplier Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Supplier Name
                </label>
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">Select...</option>
                  <option value="Techno House">Techno House</option>
                  <option value="UNKNOWN">UNKNOWN</option>
                  <option value="Konica Hardware">Konica Hardware</option>
                  <option value="B. BARIA BELT GALLERY">B. BARIA BELT GALLERY</option>
                  <option value="Global Net Computers">Global Net Computers</option>
                </select>
              </div>

              {/* Action Buttons (SHOW & ATTACHMENT) */}
              <div className="lg:col-span-2 flex items-center gap-2 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => {}}
                  className="h-9 px-5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  SHOW
                </button>
                <button
                  type="button"
                  onClick={() => setIsAttachmentOpen(true)}
                  className="h-9 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  ATTACHMENT
                </button>
              </div>

            </div>
          </div>

          {/* Main 2-Column Split Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN (4/12): Unposted Bills Selection List */}
            <div className="lg:col-span-4 bg-card border border-border rounded-xl shadow-xs overflow-hidden flex flex-col">
              
              {/* Header & Search */}
              <div className="p-4 border-b border-border space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="size-4 text-blue-600" />
                    Unposted Bills List
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                    {filteredBills.length} Bills
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search bill no or supplier..."
                    value={leftSearchQuery}
                    onChange={(e) => setLeftSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 h-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Bills Selection Table */}
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase border-b border-border sticky top-0 z-10">
                      <th className="p-2.5 text-center w-10">Sel</th>
                      <th className="p-2.5">Bill NO</th>
                      <th className="p-2.5 text-center">Bill Date</th>
                      <th className="p-2.5">Supplier Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-white dark:bg-transparent font-normal">
                    {filteredBills.map((b) => {
                      const isSelected = b.id === selectedBillId;
                      return (
                        <tr
                          key={b.id}
                          onClick={() => setSelectedBillId(b.id)}
                          className={`cursor-pointer transition ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/50 border-l-4 border-l-blue-600 font-medium"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
                          }`}
                        >
                          <td className="p-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => setSelectedBillId(b.id)}
                              className="size-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">
                            {b.billNo}
                          </td>
                          <td className="p-2.5 text-center text-slate-600 dark:text-slate-400 text-[11px]">
                            {b.billDate}
                          </td>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]" title={b.supplierName}>
                            {b.supplierName}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredBills.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400 font-medium text-xs">
                          No unposted bills match search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* RIGHT COLUMN (8/12): Prepare Bill / VAT Tax Entry Form Console */}
            <div className="lg:col-span-8 bg-card border border-border rounded-xl shadow-xs overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="size-4 text-emerald-600" />
                  Prepare Bill &amp; Calculate VAT/Tax
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Bill No:</span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs">
                    {formData.billNo}
                  </span>
                </div>
              </div>

              {/* Form Canvas */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
                
                {/* Header Inputs Grid (Matching Screenshot Layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/60 dark:bg-slate-900/40 p-4 rounded-xl border border-border">
                  
                  {/* Bill Number */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Bill Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.billNo}
                      className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  {/* Bill Date */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Bill Date
                    </label>
                    <input
                      type="text"
                      value={formData.billDate}
                      onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Purchase Type */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Purchase Type
                    </label>
                    <select
                      value={formData.purchaseType}
                      onChange={(e) => setFormData({ ...formData, purchaseType: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Local">Local</option>
                      <option value="Import">Import</option>
                      <option value="Foreign">Foreign</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="BDT">BDT</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  {/* CurrencyRate(Tk) */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      CurrencyRate(Tk)
                    </label>
                    <input
                      type="number"
                      value={formData.currencyRate}
                      onChange={(e) => setFormData({ ...formData, currencyRate: Number(e.target.value) || 1.0 })}
                      className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Is Loan */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Is Loan
                    </label>
                    <select
                      value={formData.isLoan}
                      onChange={(e) => setFormData({ ...formData, isLoan: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                </div>

                {/* Purchased Items Table */}
                <div className="border border-emerald-200 dark:border-emerald-950 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#bbf2c2] text-slate-900 font-bold border-b border-emerald-300 text-[11px]">
                        <th className="p-2.5 text-slate-800">ItemName</th>
                        <th className="p-2.5 text-center w-28 text-slate-800">PurchaseQty</th>
                        <th className="p-2.5 text-right w-32 text-slate-800">AcPrice</th>
                        <th className="p-2.5 text-right w-36 text-slate-800">TotalPrice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white dark:bg-slate-900">
                      {formData.items.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{item.itemName}</td>
                          <td className="p-2.5 text-center">
                            <input
                              type="number"
                              value={item.purchaseQty}
                              onChange={(e) => {
                                const newQty = Number(e.target.value) || 0;
                                const newItems = [...formData.items];
                                newItems[idx].purchaseQty = newQty;
                                newItems[idx].totalPrice = newQty * newItems[idx].acPrice;
                                setFormData({ ...formData, items: newItems });
                              }}
                              className="w-20 h-7 text-center border border-slate-300 rounded px-1 font-mono font-bold bg-slate-50 dark:bg-slate-800"
                            />
                          </td>
                          <td className="p-2.5 text-right">
                            <input
                              type="number"
                              value={item.acPrice}
                              onChange={(e) => {
                                const newPrice = Number(e.target.value) || 0;
                                const newItems = [...formData.items];
                                newItems[idx].acPrice = newPrice;
                                newItems[idx].totalPrice = newItems[idx].purchaseQty * newPrice;
                                setFormData({ ...formData, items: newItems });
                              }}
                              className="w-28 h-7 text-right border border-slate-300 rounded px-1 font-mono font-bold bg-slate-50 dark:bg-slate-800"
                            />
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {item.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary & Live VAT/TAX Calculation Block */}
                <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 rounded-xl border border-border space-y-3">
                  
                  {/* Total Amount Header */}
                  <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Payer / Calculation Type</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-900 dark:text-white">Total Amt</span>
                      <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                        {calculations.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Discount Input */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Discount</span>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || 0 })}
                      className="w-32 h-7 px-2 text-right border border-slate-300 rounded font-mono font-bold bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Calculate VAT and TAX checkbox option */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <input
                      type="checkbox"
                      id="calcVatWithOther"
                      checked={formData.calcVatWithOther}
                      onChange={(e) => setFormData({ ...formData, calcVatWithOther: e.target.checked })}
                      className="size-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="calcVatWithOther" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      Calculate VAT and TAX with other amount.
                    </label>
                  </div>

                  {/* Other Amt Input */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Other Amt</span>
                    <input
                      type="number"
                      value={formData.otherAmt}
                      onChange={(e) => setFormData({ ...formData, otherAmt: Number(e.target.value) || 0 })}
                      className="w-32 h-7 px-2 text-right border border-slate-300 rounded font-mono font-bold bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* VAT Amount Controls Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs pt-1">
                    <select
                      value={formData.vatPayer}
                      onChange={(e) => setFormData({ ...formData, vatPayer: e.target.value as any })}
                      className="h-7 px-2 border border-slate-300 rounded bg-white dark:bg-slate-800 font-medium"
                    >
                      <option value="Own">Own</option>
                      <option value="Supplier">Supplier</option>
                    </select>

                    <select
                      value={formData.vatType}
                      onChange={(e) => setFormData({ ...formData, vatType: e.target.value as any })}
                      className="h-7 px-2 border border-slate-300 rounded bg-white dark:bg-slate-800 font-medium"
                    >
                      <option value="Include">Include</option>
                      <option value="Exclude">Exclude</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-700">Vat Amt</span>
                      <input
                        type="number"
                        placeholder="%"
                        value={formData.vatPct || ""}
                        onChange={(e) => setFormData({ ...formData, vatPct: Number(e.target.value) || 0 })}
                        className="w-16 h-7 px-1 text-center border border-slate-300 rounded font-mono font-bold bg-white dark:bg-slate-800"
                      />
                      <span className="font-bold text-slate-500">%</span>
                    </div>

                    <div className="text-right font-mono font-bold text-slate-900 dark:text-white">
                      {calculations.vatAmt.toFixed(3)}
                    </div>
                  </div>

                  {/* TAX Amount Controls Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs pt-1">
                    <select
                      value={formData.taxPayer}
                      onChange={(e) => setFormData({ ...formData, taxPayer: e.target.value as any })}
                      className="h-7 px-2 border border-slate-300 rounded bg-white dark:bg-slate-800 font-medium"
                    >
                      <option value="Own">Own</option>
                      <option value="Supplier">Supplier</option>
                    </select>

                    <select
                      value={formData.taxType}
                      onChange={(e) => setFormData({ ...formData, taxType: e.target.value as any })}
                      className="h-7 px-2 border border-slate-300 rounded bg-white dark:bg-slate-800 font-medium"
                    >
                      <option value="Include">Include</option>
                      <option value="Exclude">Exclude</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-700">Tax Amt</span>
                      <input
                        type="number"
                        placeholder="%"
                        value={formData.taxPct || ""}
                        onChange={(e) => setFormData({ ...formData, taxPct: Number(e.target.value) || 0 })}
                        className="w-16 h-7 px-1 text-center border border-slate-300 rounded font-mono font-bold bg-white dark:bg-slate-800"
                      />
                      <span className="font-bold text-slate-500">%</span>
                    </div>

                    <div className="text-right font-mono font-bold text-slate-900 dark:text-white">
                      {calculations.taxAmt.toFixed(3)}
                    </div>
                  </div>

                  {/* Net Payable & G.Total Footer */}
                  <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                      <span>Net Payable</span>
                      <span className="font-mono text-sm">{calculations.netPayable.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center font-black text-slate-900 dark:text-white text-sm pt-1">
                      <span>G.Total</span>
                      <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
                        {calculations.grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Comments (if any) Input */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Comments (if any)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter any notes or comments regarding this VAT and Tax entry..."
                    value={formData.comments || ""}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="h-10 px-8 bg-[#6bb92d] hover:bg-[#5da724] text-white font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition cursor-pointer shadow-sm shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="size-4" />
                    SUBMIT
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

        {/* ATTACHMENT MODAL */}
        {isAttachmentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto relative border border-slate-200">
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Paperclip className="size-5 text-sky-400" />
                  <span className="font-bold text-sm">Bill &amp; Challan Attachments</span>
                </div>
                <button onClick={() => setIsAttachmentOpen(false)} className="p-1 text-slate-400 hover:text-white transition">
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Attached Challan Copy</span>
                    <span className="text-slate-500 font-mono text-[11px]">PDF Document</span>
                  </div>
                  <p className="text-slate-600">Supplier Tax Challan Copy - Bill #{formData.billNo} ({formData.supplierName})</p>
                  <div className="pt-2 flex gap-2">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded font-bold text-xs flex items-center gap-1">
                      <FileText className="size-3.5" /> Download Challan PDF
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">MRIR Receipt Scan</span>
                    <span className="text-slate-500 font-mono text-[11px]">JPG Image</span>
                  </div>
                  <p className="text-slate-600">Material Receive &amp; Inspection Report scan</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
