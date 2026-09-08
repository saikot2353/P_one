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
  CreditCard,
  Receipt,
  Check,
  DollarSign,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/procurement-billing-prepare")({
  head: () => ({
    meta: [
      { title: "Prepare Bill — Billing | CRIPTON Procurement" },
      { name: "description", content: "Prepare supplier invoice bill from purchase orders & GRN challans with item pricing and advance adjustment." },
    ],
  }),
  component: PrepareBillPage,
});

export interface PrepareBillItem {
  id: string;
  itemName: string;
  purchaseQty: number;
  acPrice: number;
  totalPrice: number;
}

export interface PendingPoGrn {
  id: string;
  poNo: string;
  chNo: string;
  chDate: string;
  grNo: string;
  grDate: string;
  supplierName: string;
  location: string;
  purchaseType: string;
  currency: string;
  currencyRate: number;
  isLoan: string;
  billNumber?: string;
  billDate?: string;
  items: PrepareBillItem[];
  discount: number;
  otherAmt: number;
  advanceAdjustment: number;
  comments?: string;
}

const INITIAL_PENDING_GRNS: PendingPoGrn[] = [
  {
    id: "po-238",
    poNo: "PO/PSL/2026/000238",
    chNo: "00",
    chDate: "30/07/2026",
    grNo: "GIS/612",
    grDate: "06/09/2026",
    supplierName: "Al-Amin Electronics",
    location: "PSL-Operation",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    billNumber: "6747",
    billDate: "08/09/2026",
    items: [
      { id: "item-238-1", itemName: "Alkaline Battery :: PCS", purchaseQty: 60, acPrice: 60.0000, totalPrice: 3600.00 },
      { id: "item-238-2", itemName: "Multi-plug Extension Cable 5M :: PCS", purchaseQty: 5, acPrice: 800.0000, totalPrice: 4000.00 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    advanceAdjustment: 0.0,
    comments: "",
  },
  {
    id: "po-239",
    poNo: "PO/PSL/2026/000239",
    chNo: "1298",
    chDate: "02/08/2026",
    grNo: "GIS/615",
    grDate: "07/09/2026",
    supplierName: "Al-Amin Electronics",
    location: "PSL-Operation",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    billNumber: "1298",
    billDate: "08/09/2026",
    items: [
      { id: "item-239-1", itemName: "Mouse Optical USB :: PCS", purchaseQty: 10, acPrice: 450.0000, totalPrice: 4500.00 },
      { id: "item-239-2", itemName: "Keyboard Standard USB :: PCS", purchaseQty: 5, acPrice: 650.0000, totalPrice: 3250.00 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    advanceAdjustment: 0.0,
    comments: "",
  },
  {
    id: "po-412",
    poNo: "PO/PKCL/2026/000412",
    chNo: "450",
    chDate: "10/08/2026",
    grNo: "GIS/620",
    grDate: "08/09/2026",
    supplierName: "Harmony Chem Ltd.",
    location: "PKCL-Savar",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    billNumber: "7226",
    billDate: "08/09/2026",
    items: [
      { id: "item-412-1", itemName: "Dispersing Agent H-200 :: KG", purchaseQty: 500, acPrice: 185.0000, totalPrice: 92500.00 },
      { id: "item-412-2", itemName: "Levelling Agent L-50 :: KG", purchaseQty: 300, acPrice: 210.0000, totalPrice: 63000.00 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    advanceAdjustment: 0.0,
    comments: "",
  },
  {
    id: "po-105",
    poNo: "PO/PAL/2026/000105",
    chNo: "908",
    chDate: "15/08/2026",
    grNo: "GIS/622",
    grDate: "08/09/2026",
    supplierName: "Dysin International Ltd.",
    location: "PAL-AOP",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    billNumber: "2701",
    billDate: "08/09/2026",
    items: [
      { id: "item-105-1", itemName: "Reactive Dye Blue 19 :: KG", purchaseQty: 250, acPrice: 580.0000, totalPrice: 145000.00 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    advanceAdjustment: 0.0,
    comments: "",
  },
  {
    id: "po-240",
    poNo: "PO/PSL/2026/000240",
    chNo: "6747",
    chDate: "25/08/2026",
    grNo: "GIS/625",
    grDate: "08/09/2026",
    supplierName: "Techno House",
    location: "PSL-Operation",
    purchaseType: "Local",
    currency: "BDT",
    currencyRate: 1.0,
    isLoan: "No",
    billNumber: "6747",
    billDate: "08/09/2026",
    items: [
      { id: "item-240-1", itemName: "SSD 1 TB :: PCS", purchaseQty: 1, acPrice: 20000.0000, totalPrice: 20000.00 },
    ],
    discount: 0.0,
    otherAmt: 0.0,
    advanceAdjustment: 0.0,
    comments: "",
  },
];

function PrepareBillPage() {
  // Top Filter Console State
  const [locationFilter, setLocationFilter] = useState("All");
  const [documentFilter, setDocumentFilter] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("Al-Amin Electronics");

  // Left Panel Search State
  const [leftSearchQuery, setLeftSearchQuery] = useState("");

  // Pending Records Database
  const [records, setRecords] = useState<PendingPoGrn[]>(() => {
    const saved = localStorage.getItem("procurement_prepare_bills_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PENDING_GRNS;
  });

  useEffect(() => {
    localStorage.setItem("procurement_prepare_bills_v1", JSON.stringify(records));
  }, [records]);

  // Active Selected PO/GRN for Right Console
  const [selectedRecordId, setSelectedRecordId] = useState<string>("po-238");

  // Form State for Active Record
  const activeRecord = useMemo(() => {
    return records.find((r) => r.id === selectedRecordId) || records[0];
  }, [records, selectedRecordId]);

  const [formData, setFormData] = useState<PendingPoGrn>(activeRecord);

  useEffect(() => {
    if (activeRecord) {
      setFormData({ ...activeRecord });
    }
  }, [activeRecord]);

  // Modal States
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [advanceAmountInput, setAdvanceAmountInput] = useState<number>(0);

  // Success Toast Banner State
  const [successMsg, setSuccessMsg] = useState("");

  // Filtered Left Panel List
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Location Filter
      if (locationFilter !== "All" && locationFilter !== "") {
        if (r.location !== locationFilter) return false;
      }

      // Document Filter
      if (documentFilter !== "All" && documentFilter !== "") {
        if (r.poNo !== documentFilter) return false;
      }

      // Supplier Filter
      if (supplierFilter !== "All" && supplierFilter !== "Select...") {
        if (r.supplierName !== supplierFilter) return false;
      }

      // Left Panel Search Query
      if (leftSearchQuery.trim()) {
        const q = leftSearchQuery.toLowerCase().trim();
        const matchesPo = r.poNo.toLowerCase().includes(q);
        const matchesCh = r.chNo.toLowerCase().includes(q);
        const matchesGr = r.grNo.toLowerCase().includes(q);
        const matchesSupplier = r.supplierName.toLowerCase().includes(q);
        if (!matchesPo && !matchesCh && !matchesGr && !matchesSupplier) return false;
      }

      return true;
    });
  }, [records, locationFilter, documentFilter, supplierFilter, leftSearchQuery]);

  // Financial Calculations
  const calculations = useMemo(() => {
    const subtotal = formData.items.reduce((acc, item) => acc + item.totalPrice, 0);
    const discount = Number(formData.discount) || 0;
    const otherAmt = Number(formData.otherAmt) || 0;
    const advanceAdj = Number(formData.advanceAdjustment) || 0;

    const netPayable = subtotal - discount + otherAmt - advanceAdj;
    const grandTotal = subtotal - discount + otherAmt;

    return {
      subtotal,
      discount,
      otherAmt,
      advanceAdj,
      netPayable,
      grandTotal,
    };
  }, [formData]);

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();

    setRecords((prev) =>
      prev.map((r) => (r.id === formData.id ? { ...formData } : r))
    );

    setSuccessMsg(`Supplier Bill #${formData.billNumber || formData.chNo} saved successfully!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const applyAdvanceAdjustment = () => {
    setFormData({
      ...formData,
      advanceAdjustment: advanceAmountInput,
    });
    setIsAdjustmentModalOpen(false);
    setSuccessMsg(`Advance adjustment of Tk ${advanceAmountInput.toFixed(2)} applied to Bill!`);
    setTimeout(() => setSuccessMsg(""), 4000);
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
                Prepare Bill
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Procurement Workspace &gt; Billing &gt; <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Prepare Bill</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAttachmentOpen(true)}
                className="h-9 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Paperclip className="size-4" /> ATTACHMENT
              </button>
            </div>
          </div>

          {/* Success Banner */}
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

          {/* Top Filter Parameters Console (Matching User Screenshot Bar) */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end text-xs">
              
              {/* Location */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">All Locations</option>
                  <option value="PSL-Operation">PSL-Operation</option>
                  <option value="PKCL-Savar">PKCL-Savar</option>
                  <option value="PAL-AOP">PAL-AOP</option>
                </select>
              </div>

              {/* Document */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Document
                </label>
                <select
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">All Documents</option>
                  <option value="PO/PSL/2026/000238">PO/PSL/2026/000238</option>
                  <option value="PO/PSL/2026/000239">PO/PSL/2026/000239</option>
                  <option value="PO/PKCL/2026/000412">PO/PKCL/2026/000412</option>
                  <option value="PO/PAL/2026/000105">PO/PAL/2026/000105</option>
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
                  <option value="Al-Amin Electronics">Al-Amin Electronics</option>
                  <option value="Harmony Chem Ltd.">Harmony Chem Ltd.</option>
                  <option value="Dysin International Ltd.">Dysin International Ltd.</option>
                  <option value="Techno House">Techno House</option>
                </select>
              </div>

              {/* Action Button: SHOW */}
              <div className="pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => {}}
                  className="h-9 px-6 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs w-full sm:w-auto"
                >
                  SHOW
                </button>
              </div>

            </div>
          </div>

          {/* Master-Detail 2-Column Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT PANEL (5/12): Pending PO & GRN List Selection Table */}
            <div className="lg:col-span-5 bg-card border border-border rounded-xl shadow-xs overflow-hidden flex flex-col">
              
              {/* Header & Search Bar */}
              <div className="p-4 border-b border-border space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="size-4 text-blue-600" />
                    Pending PO / GRN Challans
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                    {filteredRecords.length} Items
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search PO NO, ChNo, GRNo..."
                    value={leftSearchQuery}
                    onChange={(e) => setLeftSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 h-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Data Table Matching Screenshot Headers: PO NO, Attachment, ChNo, ChDate, GRNo, GRDate */}
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase border-b border-border sticky top-0 z-10">
                      <th className="p-2.5 text-center w-8">Sel</th>
                      <th className="p-2.5">PO NO</th>
                      <th className="p-2.5 text-center w-8">Att</th>
                      <th className="p-2.5">ChNo</th>
                      <th className="p-2.5 text-center">ChDate</th>
                      <th className="p-2.5">GRNo</th>
                      <th className="p-2.5 text-center">GRDate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-white dark:bg-transparent font-normal">
                    {filteredRecords.map((r) => {
                      const isSelected = r.id === selectedRecordId;
                      return (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedRecordId(r.id)}
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
                              onChange={() => setSelectedRecordId(r.id)}
                              className="size-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* PO NO */}
                          <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {r.poNo}
                          </td>

                          {/* Attachment Icon */}
                          <td className="p-2.5 text-center text-emerald-600">
                            <Paperclip className="size-3.5 mx-auto text-emerald-600" />
                          </td>

                          {/* ChNo */}
                          <td className="p-2.5 font-mono text-slate-800 dark:text-slate-200">
                            {r.chNo}
                          </td>

                          {/* ChDate */}
                          <td className="p-2.5 text-center text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap">
                            {r.chDate}
                          </td>

                          {/* GRNo */}
                          <td className="p-2.5 font-mono font-bold text-blue-700 dark:text-blue-400">
                            {r.grNo}
                          </td>

                          {/* GRDate */}
                          <td className="p-2.5 text-center text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap">
                            {r.grDate}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400 font-medium text-xs">
                          No pending PO/GRN documents match search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* RIGHT PANEL (7/12): Prepare Bill Form Workspace */}
            <div className="lg:col-span-7 bg-card border border-border rounded-xl shadow-xs overflow-hidden flex flex-col">
              
              {/* Form Title Bar */}
              <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="size-4 text-emerald-600" />
                  Prepare Bill
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Supplier:</span>
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                    {formData.supplierName}
                  </span>
                </div>
              </div>

              {/* Form Canvas */}
              <form onSubmit={handleSaveBill} className="p-6 space-y-6 text-xs">
                
                {/* Top Input Metadata Fields Grid (Matching Screenshot Layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/60 dark:bg-slate-900/40 p-4 rounded-xl border border-border">
                  
                  {/* Bill Number */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Bill Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.billNumber || "6747"}
                      onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                      className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Bill Date */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Bill Date
                    </label>
                    <input
                      type="text"
                      value={formData.billDate || "08/09/2026"}
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
                      onChange={(e) => setFormData({ ...formData, currencyRate: Number(e.target.value) || 1 })}
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

                {/* Purchased Items Table (Light Green Header #bbf2c2 Matching Screenshot) */}
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

                {/* Financial Totals Breakdown Box */}
                <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 rounded-xl border border-border space-y-2.5 text-xs">
                  
                  {/* Total Amt */}
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="font-bold text-slate-900 dark:text-white">Total Amt</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                      {calculations.subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Discount</span>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || 0 })}
                      className="w-32 h-7 px-2 text-right border border-slate-300 rounded font-mono font-bold bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Other Amt */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Other Amt</span>
                    <input
                      type="number"
                      value={formData.otherAmt}
                      onChange={(e) => setFormData({ ...formData, otherAmt: Number(e.target.value) || 0 })}
                      className="w-32 h-7 px-2 text-right border border-slate-300 rounded font-mono font-bold bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Advance Adjustment */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Advance Adjustment</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                      {calculations.advanceAdj.toFixed(2)}
                    </span>
                  </div>

                  {/* Net Payable & G.Total */}
                  <div className="pt-2 border-t border-slate-200 space-y-1">
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

                {/* Comments (if any) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Comments (if any)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter any comments or remarks for this prepared bill..."
                    value={formData.comments || ""}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Bottom Action Bar: Adjustment (Orange), ATTACHMENT (Blue), SAVE (Green) */}
                <div className="pt-2 flex flex-col sm:flex-row justify-end items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAdvanceAmountInput(formData.advanceAdjustment || 500);
                      setIsAdjustmentModalOpen(true);
                    }}
                    className="h-9 px-5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs w-full sm:w-auto"
                  >
                    Adjustment
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAttachmentOpen(true)}
                    className="h-9 px-5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs w-full sm:w-auto"
                  >
                    ATTACHMENT
                  </button>

                  <button
                    type="submit"
                    className="h-9 px-7 bg-[#6bb92d] hover:bg-[#5ea724] text-white font-black text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-600/30 w-full sm:w-auto"
                  >
                    <CheckCircle2 className="size-4" /> SAVE
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

        {/* ADVANCE ADJUSTMENT MODAL */}
        {isAdjustmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto relative border border-slate-200">
              <div className="bg-amber-600 text-white p-4 flex justify-between items-center rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-5" />
                  <span className="font-bold text-sm">Advance Adjustment Console</span>
                </div>
                <button onClick={() => setIsAdjustmentModalOpen(false)} className="p-1 text-amber-100 hover:text-white transition">
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <p className="text-slate-600 font-medium">
                  Enter advance payment deduction amount for Supplier <span className="font-bold text-slate-900">{formData.supplierName}</span>:
                </p>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Advance Amount (Tk)</label>
                  <input
                    type="number"
                    value={advanceAmountInput}
                    onChange={(e) => setAdvanceAmountInput(Number(e.target.value) || 0)}
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdjustmentModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyAdvanceAdjustment}
                    className="px-5 py-2 bg-amber-600 text-white rounded-lg font-bold text-xs"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ATTACHMENT MODAL */}
        {isAttachmentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto relative border border-slate-200">
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Paperclip className="size-5 text-sky-400" />
                  <span className="font-bold text-sm">Challan &amp; GRN Attachments</span>
                </div>
                <button onClick={() => setIsAttachmentOpen(false)} className="p-1 text-slate-400 hover:text-white transition">
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Supplier Challan #{formData.chNo}</span>
                    <span className="text-slate-500 font-mono text-[11px]">Date: {formData.chDate}</span>
                  </div>
                  <p className="text-slate-600">Original delivery challan scan copy from {formData.supplierName}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Store Receive Note #{formData.grNo}</span>
                    <span className="text-slate-500 font-mono text-[11px]">Date: {formData.grDate}</span>
                  </div>
                  <p className="text-slate-600">Goods receive note verified by store manager</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
