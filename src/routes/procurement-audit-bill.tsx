import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Pencil,
  Paperclip,
  X,
  CheckCircle2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Download,
} from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-audit-bill")({
  head: () => ({
    meta: [
      { title: "Bill Audit — Procurement | CRIPTON" },
      { name: "description", content: "Procurement Supplier Bill Audit, verification, review notes, and Billing Information document generation." },
    ],
  }),
  component: ProcurementAuditBillPage,
});

export interface BillAuditItem {
  sl: number;
  productName: string;
  qty: number;
  uom: string;
  unitPrice: number;
  total: number;
  reviewNote?: string;
}

export interface BillAuditRecord {
  id: string;
  supplier: string;
  billNo: string;
  billDate: string;
  currency: string;
  currencyRate: number;
  billValue: number;
  vatAmount: number;
  taxAmount: number;
  netPayable: number;
  mrrNo: string;
  mrrDate: string;
  challanNo: string;
  challanDate: string;
  remarks: string;
  status: "Unaudited" | "Audited" | "Under Review";
  poNo: string;
  poDate: string;
  advanceAdjustment: number;
  discount: number;
  othersAmount: number;
  attachmentFileName?: string;
  attachmentUrl?: string;
  auditValue?: number;
  auditNote?: string;
  auditedDate?: string;
  auditedBy?: string;
  commentVatTax?: string;
  preparedBy?: { name: string; designation: string; date: string };
  vatTaxInputtedBy?: { name: string; designation: string; date: string };
  auditedByPerson?: { name: string; designation: string; date: string };
  approvedBy?: { name: string; designation: string; date: string };
  items: BillAuditItem[];
}

const INITIAL_BILL_AUDIT_RECORDS: BillAuditRecord[] = [
  {
    id: "bil-aud-001",
    supplier: "ZOOM TECHNOLOGY",
    billNo: "489",
    billDate: "31/08/2026",
    currency: "BDT",
    currencyRate: 1.000,
    billValue: 1200.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    netPayable: 1200.00,
    mrrNo: "609",
    mrrDate: "05/09/2026",
    challanNo: "489",
    challanDate: "31/08/2026",
    remarks: "",
    status: "Unaudited",
    poNo: "PO/PSL/2026/000243",
    poDate: "31/08/2026",
    advanceAdjustment: 1030.00,
    discount: 0.00,
    othersAmount: 0.00,
    attachmentFileName: "2.Whatsapp Scan September 5",
    auditValue: 1200.00,
    auditNote: "",
    commentVatTax: "",
    preparedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 16:09:17" },
    vatTaxInputtedBy: { name: "A.K.M Nakibul Haque", designation: "Sr. Officer", date: "06/09/2026 15:48:14" },
    items: [
      {
        sl: 1,
        productName: "Laptop Cooling Fan",
        qty: 1.00,
        uom: "PCS",
        unitPrice: 1200.00,
        total: 1200.00,
        reviewNote: "",
      },
    ],
  },
  {
    id: "bil-aud-002",
    supplier: "Star Tech Ltd",
    billNo: "INV-STLR4-2026-017669",
    billDate: "20/08/2026",
    currency: "BDT",
    currencyRate: 1.000,
    billValue: 43500.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    netPayable: 43500.00,
    mrrNo: "608",
    mrrDate: "05/09/2026",
    challanNo: "INV-STLR4-2028-017669",
    challanDate: "20/08/2026",
    remarks: "",
    status: "Unaudited",
    poNo: "PO/PSL/2026/000225",
    poDate: "18/08/2026",
    advanceAdjustment: 0.00,
    discount: 0.00,
    othersAmount: 0.00,
    attachmentFileName: "StarTech_POS_Printer_Inv.pdf",
    auditValue: 43500.00,
    auditNote: "",
    commentVatTax: "",
    preparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026 11:15:00" },
    vatTaxInputtedBy: { name: "A.K.M Nakibul Haque", designation: "Sr. Officer", date: "06/09/2026 14:20:10" },
    items: [
      {
        sl: 1,
        productName: "Thermal Receipt Printer Epson TM-T82X",
        qty: 3.00,
        uom: "PCS",
        unitPrice: 14500.00,
        total: 43500.00,
        reviewNote: "",
      },
    ],
  },
  {
    id: "bil-aud-003",
    supplier: "Robotics BD",
    billNo: "96551",
    billDate: "18/08/2026",
    currency: "BDT",
    currencyRate: 1.000,
    billValue: 18500.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    netPayable: 18500.00,
    mrrNo: "607",
    mrrDate: "05/09/2026",
    challanNo: "96551",
    challanDate: "18/08/2026",
    remarks: "",
    status: "Unaudited",
    poNo: "PO/PSL/2026/000221",
    poDate: "16/08/2026",
    advanceAdjustment: 0.00,
    discount: 0.00,
    othersAmount: 0.00,
    attachmentFileName: "RoboticsBD_Challan_96551.pdf",
    auditValue: 18500.00,
    auditNote: "",
    commentVatTax: "",
    preparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026 12:45:00" },
    vatTaxInputtedBy: { name: "A.K.M Nakibul Haque", designation: "Sr. Officer", date: "06/09/2026 14:35:22" },
    items: [
      {
        sl: 1,
        productName: "Industrial Proximity Sensor Autonics",
        qty: 10.00,
        uom: "PCS",
        unitPrice: 1850.00,
        total: 18500.00,
        reviewNote: "",
      },
    ],
  },
  {
    id: "bil-aud-004",
    supplier: "Gadget & Gaming Zone",
    billNo: "1298",
    billDate: "03/09/2026",
    currency: "BDT",
    currencyRate: 1.000,
    billValue: 17000.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    netPayable: 17000.00,
    mrrNo: "606",
    mrrDate: "05/09/2026",
    challanNo: "1298",
    challanDate: "03/09/2026",
    remarks: "",
    status: "Unaudited",
    poNo: "PO/PSL/2026/000219",
    poDate: "30/08/2026",
    advanceAdjustment: 0.00,
    discount: 0.00,
    othersAmount: 0.00,
    attachmentFileName: "GadgetGaming_Invoice_1298.pdf",
    auditValue: 17000.00,
    auditNote: "",
    commentVatTax: "",
    preparedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 14:00:00" },
    vatTaxInputtedBy: { name: "A.K.M Nakibul Haque", designation: "Sr. Officer", date: "06/09/2026 15:05:00" },
    items: [
      {
        sl: 1,
        productName: "Conference Microphone System Boya",
        qty: 2.00,
        uom: "SET",
        unitPrice: 8500.00,
        total: 17000.00,
        reviewNote: "",
      },
    ],
  },
  {
    id: "bil-aud-005",
    supplier: "MS Rifat traders",
    billNo: "2499",
    billDate: "02/07/2026",
    currency: "BDT",
    currencyRate: 1.000,
    billValue: 14400.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    netPayable: 14400.00,
    mrrNo: "605",
    mrrDate: "03/09/2026",
    challanNo: "2414",
    challanDate: "02/07/2026",
    remarks: "",
    status: "Unaudited",
    poNo: "PO/PSL/2026/000215",
    poDate: "28/06/2026",
    advanceAdjustment: 2000.00,
    discount: 0.00,
    othersAmount: 0.00,
    attachmentFileName: "RifatTraders_Challan_2414.jpg",
    auditValue: 14400.00,
    auditNote: "",
    commentVatTax: "",
    preparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "03/09/2026 16:10:00" },
    vatTaxInputtedBy: { name: "A.K.M Nakibul Haque", designation: "Sr. Officer", date: "06/09/2026 15:15:00" },
    items: [
      {
        sl: 1,
        productName: "Industrial Stainless Screws M6",
        qty: 45.00,
        uom: "KG",
        unitPrice: 320.00,
        total: 14400.00,
        reviewNote: "",
      },
    ],
  },
  {
    id: "bil-aud-006",
    supplier: "Progoti Stationary Suppliers",
    billNo: "4792",
    billDate: "01/07/2026",
    currency: "BDT",
    currencyRate: 1.000,
    billValue: 92500.00,
    vatAmount: 0.00,
    taxAmount: 0.00,
    netPayable: 92500.00,
    mrrNo: "604",
    mrrDate: "03/09/2026",
    challanNo: "4792",
    challanDate: "01/07/2026",
    remarks: "",
    status: "Unaudited",
    poNo: "PO/PSL/2026/000212",
    poDate: "26/06/2026",
    advanceAdjustment: 0.00,
    discount: 0.00,
    othersAmount: 0.00,
    attachmentFileName: "Progoti_Stationery_Inv_4792.pdf",
    auditValue: 92500.00,
    auditNote: "",
    commentVatTax: "",
    preparedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "03/09/2026 16:30:00" },
    vatTaxInputtedBy: { name: "A.K.M Nakibul Haque", designation: "Sr. Officer", date: "06/09/2026 15:25:00" },
    items: [
      {
        sl: 1,
        productName: "A4 Photocopy Paper 80GSM Double A",
        qty: 50.00,
        uom: "BOX",
        unitPrice: 1850.00,
        total: 92500.00,
        reviewNote: "",
      },
    ],
  },
];

const CURATED_SUPPLIERS = [
  "ALL SUPPLIER",
  "ZOOM TECHNOLOGY",
  "Star Tech Ltd",
  "Robotics BD",
  "Gadget & Gaming Zone",
  "MS Rifat traders",
  "Progoti Stationary Suppliers",
  "NASIR HARDWARE STORE",
  "Konica Hardware",
  "Al-Amin Electronics",
  "New Bhai Bhai Aushad Bitan",
  "Samuda Chemical Complex Ltd",
  "M.B. Trade Corporation",
  "Madona Enterprise",
  "MAYER DOYA ENTERPRISE",
  "Apex Textile Chemical Ltd",
];

function numberToWords(amount: number): string {
  if (amount === 0) return "Zero";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertLessThanOneThousand(n: number): string {
    let result = "";
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      result += ones[n] + " ";
    }
    return result.trim();
  }

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) return "Zero Only";

  let words = "";

  const crore = Math.floor(integerPart / 10000000);
  let remainder = integerPart % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  if (crore > 0) words += convertLessThanOneThousand(crore) + " Crore ";
  if (lakh > 0) words += convertLessThanOneThousand(lakh) + " Lakh ";
  if (thousand > 0) words += convertLessThanOneThousand(thousand) + " Thousand ";
  if (remainder > 0) words += convertLessThanOneThousand(remainder);

  words = words.trim();

  if (words.length > 0) words += "";
  if (decimalPart > 0) {
    words += " and " + convertLessThanOneThousand(decimalPart) + " Paisa";
  }

  return words + " Only.";
}

function ProcurementAuditBillPage() {
  // Filter States
  const [dateFrom, setDateFrom] = useState("2026-08-08");
  const [dateTo, setDateTo] = useState("2026-09-08");
  const [auditedStatus, setAuditedStatus] = useState("Unaudited");
  const [supplierName, setSupplierName] = useState("ALL SUPPLIER");

  // Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: "2026-08-08",
    dateTo: "2026-09-08",
    auditedStatus: "Unaudited",
    supplierName: "ALL SUPPLIER",
  });

  // Table Search & Pagination
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Master Data
  const [billList, setBillList] = useState<BillAuditRecord[]>(() => {
    try {
      const saved = localStorage.getItem("procurement_bill_audit_records_v1");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BILL_AUDIT_RECORDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("procurement_bill_audit_records_v1", JSON.stringify(billList));
    } catch {
      // ignore
    }
  }, [billList]);

  // Modal States:
  // 1. Bill Audit Modal (Amber pencil icon)
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedAuditBill, setSelectedAuditBill] = useState<BillAuditRecord | null>(null);
  const [auditValueInput, setAuditValueInput] = useState<number>(0);
  const [auditNoteInput, setAuditNoteInput] = useState("");
  const [itemReviewNotes, setItemReviewNotes] = useState<Record<number, string>>({});

  // 2. Billing Information Document Modal (Blue printer icon)
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPrintBill, setSelectedPrintBill] = useState<BillAuditRecord | null>(null);

  // 3. Attachment Viewer Modal (Green paperclip icon)
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [selectedAttachmentBill, setSelectedAttachmentBill] = useState<BillAuditRecord | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApplyFilter = () => {
    setAppliedFilters({
      dateFrom,
      dateTo,
      auditedStatus,
      supplierName,
    });
    setCurrentPage(1);
  };

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return billList.filter((rec) => {
      // Audited status filter
      if (appliedFilters.auditedStatus !== "All") {
        if (rec.status !== appliedFilters.auditedStatus) {
          return false;
        }
      }
      // Supplier filter
      if (appliedFilters.supplierName !== "ALL SUPPLIER") {
        if (rec.supplier.toLowerCase() !== appliedFilters.supplierName.toLowerCase()) {
          return false;
        }
      }
      // Table search filter
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        const match =
          rec.supplier.toLowerCase().includes(q) ||
          rec.billNo.toLowerCase().includes(q) ||
          rec.mrrNo.toLowerCase().includes(q) ||
          rec.challanNo.toLowerCase().includes(q) ||
          rec.poNo.toLowerCase().includes(q) ||
          rec.status.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [billList, appliedFilters, tableSearch]);

  // Pagination
  const totalEntries = filteredRecords.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Open Bill Audit Modal
  const openAuditModal = (record: BillAuditRecord) => {
    setSelectedAuditBill(record);
    setAuditValueInput(record.auditValue || record.netPayable);
    setAuditNoteInput(record.auditNote || "");
    const initialNotes: Record<number, string> = {};
    record.items.forEach((item) => {
      initialNotes[item.sl] = item.reviewNote || "";
    });
    setItemReviewNotes(initialNotes);
    setAuditModalOpen(true);
  };

  const closeAuditModal = () => {
    setAuditModalOpen(false);
    setSelectedAuditBill(null);
  };

  // Commit Bill Audit Action ("AUDITED" or "REVIEW")
  const handleCommitAudit = (actionType: "AUDITED" | "REVIEW") => {
    if (!selectedAuditBill) return;

    const newStatus: "Audited" | "Under Review" = actionType === "AUDITED" ? "Audited" : "Under Review";

    setBillList((prev) =>
      prev.map((b) => {
        if (b.id === selectedAuditBill.id) {
          const updatedItems = b.items.map((it) => ({
            ...it,
            reviewNote: itemReviewNotes[it.sl] || "",
          }));

          return {
            ...b,
            status: newStatus,
            auditValue: Number(auditValueInput) || b.netPayable,
            auditNote: auditNoteInput,
            auditedDate: new Date().toLocaleDateString("en-GB"),
            auditedBy: "Audit Team (A. Rahman)",
            items: updatedItems,
          };
        }
        return b;
      })
    );

    setToastMessage(
      actionType === "AUDITED"
        ? `Bill #${selectedAuditBill.billNo} has been marked as AUDITED successfully!`
        : `Bill #${selectedAuditBill.billNo} has been set to UNDER REVIEW.`
    );
    setTimeout(() => setToastMessage(null), 4000);
    closeAuditModal();
  };

  // Open Print Modal
  const openPrintModal = (record: BillAuditRecord) => {
    setSelectedPrintBill(record);
    setPrintModalOpen(true);
  };

  const closePrintModal = () => {
    setPrintModalOpen(false);
    setSelectedPrintBill(null);
  };

  // Open Attachment Modal
  const openAttachmentModal = (record: BillAuditRecord) => {
    setSelectedAttachmentBill(record);
    setAttachmentModalOpen(true);
  };

  const closeAttachmentModal = () => {
    setAttachmentModalOpen(false);
    setSelectedAttachmentBill(null);
  };

  // Export handlers
  const handleExportCSV = () => {
    const headers = [
      "Supplier", "Bill No", "Bill Date", "Currency", "Currency Rate", "Bill Value",
      "Vat Amount", "Tax Amount", "Net Payable", "Mrr No", "Challan No", "Remarks", "Status"
    ];
    const rows = filteredRecords.map((r) => [
      `"${r.supplier.replace(/"/g, '""')}"`,
      `"${r.billNo.replace(/"/g, '""')}"`,
      r.billDate,
      r.currency,
      r.currencyRate.toFixed(3),
      r.billValue.toFixed(2),
      r.vatAmount.toFixed(2),
      r.taxAmount.toFixed(2),
      r.netPayable.toFixed(2),
      r.mrrNo,
      `"${r.challanNo.replace(/"/g, '""')}"`,
      `"${r.remarks.replace(/"/g, '""')}"`,
      r.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bill_audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTable = () => {
    window.print();
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
                Bill Audit
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Procurement Workspace &gt; Audit &gt; <span className="text-[#1890ff] font-medium">Bill Audit</span>
              </p>
            </div>

            {toastMessage && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 text-emerald-800 dark:text-emerald-200 px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-xs animate-in fade-in">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                {toastMessage}
              </div>
            )}
          </div>

          {/* Top Filter Card (Matching Screenshot 1 with blue left accent bar) */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-[#1890ff] p-5 pl-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

              {/* Audited Status */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Audited Status
                </label>
                <select
                  value={auditedStatus}
                  onChange={(e) => setAuditedStatus(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                >
                  <option value="Unaudited">Unaudited</option>
                  <option value="Audited">Audited</option>
                  <option value="Under Review">Under Review</option>
                  <option value="All">All Statuses</option>
                </select>
              </div>

              {/* Supplier Name */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Supplier Name
                </label>
                <SearchableSelect
                  options={CURATED_SUPPLIERS.map((s) => ({ value: s, label: s }))}
                  value={supplierName}
                  onChange={(val) => setSupplierName(val)}
                  placeholder="Select supplier..."
                  className="w-full h-8 text-xs border-slate-300 dark:border-slate-700 rounded"
                />
              </div>
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

            {/* Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
                    <th className="py-2.5 px-3 w-28 text-center">Action</th>
                    <th className="py-2.5 px-4 min-w-[180px]">Supplier</th>
                    <th className="py-2.5 px-3 min-w-[100px]">Bill No</th>
                    <th className="py-2.5 px-3 w-24">Bill Date</th>
                    <th className="py-2.5 px-2.5 w-16 text-center">Currency</th>
                    <th className="py-2.5 px-3 w-24 text-right">Currency Rate</th>
                    <th className="py-2.5 px-3 w-24 text-right">Bill Value</th>
                    <th className="py-2.5 px-3 w-20 text-right">Vat Amount</th>
                    <th className="py-2.5 px-3 w-20 text-right">Tax Amount</th>
                    <th className="py-2.5 px-3 w-24 text-right font-bold">Net Payable</th>
                    <th className="py-2.5 px-3 w-20 text-center">Mrr No</th>
                    <th className="py-2.5 px-3 min-w-[100px]">Challan No</th>
                    <th className="py-2.5 px-3 min-w-[100px]">Remarks</th>
                    <th className="py-2.5 px-3 w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-12 text-center text-slate-400 text-xs">
                        No bill records found matching criteria
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-sky-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                          idx % 2 === 1 ? "bg-slate-50/40 dark:bg-slate-850/40" : ""
                        }`}
                      >
                        {/* Action Column: Blue Printer, Amber Pencil, Green Paperclip */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Blue Printer Button */}
                            <button
                              type="button"
                              onClick={() => openPrintModal(row)}
                              title="Print / View Billing Information"
                              className="p-1 text-[#1890ff] hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded transition-colors cursor-pointer"
                            >
                              <Printer className="size-4 text-[#1890ff]" />
                            </button>
                            {/* Amber Pencil Button */}
                            <button
                              type="button"
                              onClick={() => openAuditModal(row)}
                              title="Bill Audit & Line Review"
                              className="p-1 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded transition-colors cursor-pointer"
                            >
                              <Pencil className="size-4 text-amber-500" />
                            </button>
                            {/* Green Paperclip Button */}
                            <button
                              type="button"
                              onClick={() => openAttachmentModal(row)}
                              title={`View Attachment (${row.attachmentFileName || "File"})`}
                              className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded transition-colors cursor-pointer"
                            >
                              <Paperclip className="size-4 text-emerald-600" />
                            </button>
                          </div>
                        </td>

                        {/* Supplier */}
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {row.supplier}
                        </td>

                        {/* Bill No */}
                        <td className="py-2.5 px-3 font-mono text-slate-800 dark:text-slate-200">
                          {row.billNo}
                        </td>

                        {/* Bill Date */}
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          {row.billDate}
                        </td>

                        {/* Currency */}
                        <td className="py-2.5 px-2.5 text-center font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                          {row.currency}
                        </td>

                        {/* Currency Rate */}
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                          {row.currencyRate.toFixed(3)}
                        </td>

                        {/* Bill Value */}
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                          {row.billValue.toFixed(2)}
                        </td>

                        {/* Vat Amount */}
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                          {row.vatAmount.toFixed(2)}
                        </td>

                        {/* Tax Amount */}
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                          {row.taxAmount.toFixed(2)}
                        </td>

                        {/* Net Payable */}
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                          {row.netPayable.toFixed(2)}
                        </td>

                        {/* Mrr No */}
                        <td className="py-2.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.mrrNo}
                        </td>

                        {/* Challan No */}
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                          {row.challanNo || "—"}
                        </td>

                        {/* Remarks */}
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                          {row.remarks || "—"}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                              row.status === "Audited"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : row.status === "Under Review"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {row.status}
                          </span>
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
      {/* MODAL 1: Bill Audit Modal (Matching Screenshot 2)                         */}
      {/* ========================================================================= */}
      {auditModalOpen && selectedAuditBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Bill Audit
              </h2>
              <button
                type="button"
                onClick={closeAuditModal}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Metadata Grid (Matching Screenshot 2) */}
              <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden text-xs">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 dark:border-slate-700 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      BILL NO
                    </span>
                    <span className="flex-1 px-3 py-1.5 font-semibold text-slate-900 dark:text-slate-100">
                      {selectedAuditBill.billNo}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      Bill Date
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditBill.billDate}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      Supplier
                    </span>
                    <span className="flex-1 px-3 py-1.5 font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {selectedAuditBill.supplier}
                    </span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 dark:border-slate-700 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      PO/WO
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-blue-600 dark:text-blue-400 font-medium underline cursor-pointer">
                      {selectedAuditBill.poNo}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      PO/WO Date
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditBill.poDate}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      Currency
                    </span>
                    <span className="flex-1 px-3 py-1.5 font-semibold text-slate-900 dark:text-slate-100">
                      {selectedAuditBill.currency}
                    </span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 dark:border-slate-700 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      Exchange Rate
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200 font-mono">
                      {selectedAuditBill.currencyRate.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      MRIR No
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-blue-600 dark:text-blue-400 font-semibold underline cursor-pointer">
                      {selectedAuditBill.mrrNo}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      MRIR Date
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditBill.mrrDate}
                    </span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      Challan NO
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200 font-mono">
                      {selectedAuditBill.challanNo || "—"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      Challan Date
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditBill.challanDate || "—"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40"></span>
                    <span className="flex-1 px-3 py-1.5"></span>
                  </div>
                </div>
              </div>

              {/* Items Table & Integrated Financial Breakdown (Matching Screenshot 2) */}
              <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                      <th className="py-2.5 px-3 w-10 text-center border-r border-slate-300 dark:border-slate-700">SL</th>
                      <th className="py-2.5 px-3 min-w-[220px] border-r border-slate-300 dark:border-slate-700">Product Name</th>
                      <th className="py-2.5 px-3 w-20 text-right border-r border-slate-300 dark:border-slate-700">Qty</th>
                      <th className="py-2.5 px-2.5 w-16 text-center border-r border-slate-300 dark:border-slate-700">UOM</th>
                      <th className="py-2.5 px-3 w-24 text-right border-r border-slate-300 dark:border-slate-700">Unit Price</th>
                      <th className="py-2.5 px-3 w-28 text-right border-r border-slate-300 dark:border-slate-700">Total</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Review Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-750">
                    {selectedAuditBill.items.map((item) => (
                      <tr key={item.sl} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-center font-semibold border-r border-slate-200 dark:border-slate-700">
                          {item.sl}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.productName}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.qty.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2.5 text-center text-slate-700 dark:text-slate-300 font-mono text-[11px] border-r border-slate-200 dark:border-slate-700">
                          {item.uom}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.total.toFixed(2)}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={itemReviewNotes[item.sl] || ""}
                            onChange={(e) =>
                              setItemReviewNotes((prev) => ({
                                ...prev,
                                [item.sl]: e.target.value,
                              }))
                            }
                            placeholder="Enter review note..."
                            className="w-full h-7 px-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                          />
                        </td>
                      </tr>
                    ))}

                    {/* Integrated Summary Rows matching Screenshot 2 */}
                    <tr className="border-t border-slate-300 dark:border-slate-700">
                      <td colSpan={2} className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        Total Qty:
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        {selectedAuditBill.items.reduce((s, i) => s + i.qty, 0).toFixed(2)}
                      </td>
                      <td colSpan={2} className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        Total Amount:
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        {selectedAuditBill.billValue.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td colSpan={3} className="border-r border-slate-300 dark:border-slate-700"></td>
                      <td colSpan={2} className="py-1.5 px-3 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Discount:
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedAuditBill.discount.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td colSpan={3} className="border-r border-slate-300 dark:border-slate-700"></td>
                      <td colSpan={2} className="py-1.5 px-3 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Vat(Inc):
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedAuditBill.vatAmount.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td colSpan={3} className="border-r border-slate-300 dark:border-slate-700"></td>
                      <td colSpan={2} className="py-1.5 px-3 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Tax(Inc) :
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedAuditBill.taxAmount.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td colSpan={3} className="border-r border-slate-300 dark:border-slate-700"></td>
                      <td colSpan={2} className="py-1.5 px-3 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Others Amount () :
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedAuditBill.othersAmount.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td colSpan={3} className="border-r border-slate-300 dark:border-slate-700"></td>
                      <td colSpan={2} className="py-1.5 px-3 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Advance Adjustment :
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedAuditBill.advanceAdjustment.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>

                    <tr className="bg-slate-50 dark:bg-slate-800 font-bold">
                      <td colSpan={3} className="border-r border-slate-300 dark:border-slate-700"></td>
                      <td colSpan={2} className="py-1.5 px-3 text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        Net Amount:
                      </td>
                      <td className="py-1.5 px-3 text-right font-black text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        {selectedAuditBill.netPayable.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* In Words */}
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">In Words: </span>
                <span className="text-slate-700 dark:text-slate-300 italic">
                  {numberToWords(selectedAuditBill.netPayable)}
                </span>
              </div>

              {/* Attachment File Link */}
              {selectedAuditBill.attachmentFileName && (
                <div className="text-xs flex items-center gap-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Attchment File: </span>
                  <button
                    type="button"
                    onClick={() => openAttachmentModal(selectedAuditBill)}
                    className="text-blue-600 dark:text-blue-400 font-medium underline hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {selectedAuditBill.attachmentFileName}
                    <ExternalLink className="size-3" />
                  </button>
                </div>
              )}

              {/* Audit Value Input with Red Asterisk */}
              <div className="w-full sm:w-64">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Audit Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={auditValueInput}
                  onChange={(e) => setAuditValueInput(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-900 dark:text-slate-100 font-bold outline-none focus:border-[#1890ff]"
                />
              </div>

              {/* Audit Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Audit Note
                </label>
                <textarea
                  rows={2}
                  value={auditNoteInput}
                  onChange={(e) => setAuditNoteInput(e.target.value)}
                  placeholder="Enter audit observations, rate verifications, or remarks..."
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff] bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Modal Footer: CLOSE on left, REVIEW & AUDITED on right */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <button
                type="button"
                onClick={closeAuditModal}
                className="px-4 py-2 text-xs font-semibold uppercase text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
              >
                CLOSE
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCommitAudit("REVIEW")}
                  className="px-5 py-2 bg-[#fa8c16] hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-2xs cursor-pointer"
                >
                  REVIEW
                </button>
                <button
                  type="button"
                  onClick={() => handleCommitAudit("AUDITED")}
                  className="px-6 py-2 bg-[#1890ff] hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-2xs cursor-pointer"
                >
                  AUDITED
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Billing Information Document Print View (Matching Screenshot 3) */}
      {/* ========================================================================= */}
      {printModalOpen && selectedPrintBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-300">
            {/* Modal Screen-Only Action Bar */}
            <div className="print:hidden px-5 py-2.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="size-4 text-[#1890ff]" />
                <span className="text-xs font-bold text-slate-800">
                  Billing Information Preview — Bill #{selectedPrintBill.billNo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#1890ff] hover:bg-sky-600 text-white font-semibold text-xs rounded flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print
                </button>
                <button
                  type="button"
                  onClick={closePrintModal}
                  className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Sheet (Matching Screenshot 3) */}
            <div className="p-8 bg-white font-sans text-xs space-y-5">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                {/* Left: Logo & Address */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <img src={pakizaSoftwareLogo} alt="Pakiza Software" className="h-9 object-contain" />
                    <div>
                      <div className="font-black text-sm tracking-wide text-slate-900">PAKIZA SOFTWARE</div>
                      <div className="text-[9px] text-slate-500 font-semibold tracking-wider">Excellence | Intelligence | Automation</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 pt-1 leading-tight">
                    <div>Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205</div>
                  </div>
                </div>

                {/* Right: Boxed Billing Info Table */}
                <div className="text-right flex flex-col items-end">
                  <div className="text-sm font-bold tracking-wider text-slate-800 mb-1 uppercase">
                    Billing Information
                  </div>
                  <div className="border border-slate-400 rounded text-[11px] text-left divide-y divide-slate-300 w-56">
                    <div className="flex justify-between px-2.5 py-0.5">
                      <span className="font-semibold text-slate-700">Bill No :</span>
                      <span className="font-bold text-slate-900">{selectedPrintBill.billNo}</span>
                    </div>
                    <div className="flex justify-between px-2.5 py-0.5">
                      <span className="font-semibold text-slate-700">Bill Date :</span>
                      <span className="text-slate-800">{selectedPrintBill.billDate}</span>
                    </div>
                    <div className="flex justify-between px-2.5 py-0.5">
                      <span className="font-semibold text-slate-700">Supplier :</span>
                      <span className="font-semibold text-slate-900 truncate">{selectedPrintBill.supplier}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Centered Document Title */}
              <div className="text-center pt-1 pb-1">
                <h3 className="text-sm font-bold text-slate-900 underline tracking-wide">
                  Billing Information
                </h3>
              </div>

              {/* Boxed Metadata Table (Matching Screenshot 3) */}
              <div className="border border-slate-400 text-[11px]">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 divide-y md:divide-y-0 md:divide-x divide-slate-300">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">PO/WO</span>
                    <span className="flex-1 px-2.5 py-1 text-blue-600 font-semibold underline">{selectedPrintBill.poNo}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">PO/WO Date</span>
                    <span className="flex-1 px-2.5 py-1 text-slate-800">{selectedPrintBill.poDate}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">Currency</span>
                    <span className="flex-1 px-2.5 py-1 font-semibold text-slate-900">{selectedPrintBill.currency}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 divide-y md:divide-y-0 md:divide-x divide-slate-300">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">Exchange Rate</span>
                    <span className="flex-1 px-2.5 py-1 text-slate-800 font-mono">{selectedPrintBill.currencyRate.toFixed(3)}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">MRIR No</span>
                    <span className="flex-1 px-2.5 py-1 text-blue-600 font-semibold underline">{selectedPrintBill.mrrNo}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">MRIR Date</span>
                    <span className="flex-1 px-2.5 py-1 text-slate-800">{selectedPrintBill.mrrDate}</span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-300">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">Challan No</span>
                    <span className="flex-1 px-2.5 py-1 font-mono text-slate-800">{selectedPrintBill.challanNo || "—"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">Challan Date</span>
                    <span className="flex-1 px-2.5 py-1 text-slate-800">{selectedPrintBill.challanDate || "—"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-bold text-slate-800 px-2.5 py-1">Advance Adjustment</span>
                    <span className="flex-1 px-2.5 py-1 font-mono text-slate-800">{selectedPrintBill.advanceAdjustment.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Items Table with Lavender Header (Matching Screenshot 3) */}
              <div className="border border-slate-400">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[#EEF0FD] border-b border-slate-400 text-slate-900 font-bold">
                      <th className="py-1.5 px-2 w-8 text-center border-r border-slate-400">SL</th>
                      <th className="py-1.5 px-3 min-w-[200px] border-r border-slate-400">Item</th>
                      <th className="py-1.5 px-3 w-24 text-right border-r border-slate-400">Quantity</th>
                      <th className="py-1.5 px-2.5 w-16 text-center border-r border-slate-400">UOM</th>
                      <th className="py-1.5 px-3 w-28 text-right border-r border-slate-400">Unit Price</th>
                      <th className="py-1.5 px-3 w-32 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {selectedPrintBill.items.map((item) => (
                      <tr key={item.sl}>
                        <td className="py-2 px-2 text-center font-semibold border-r border-slate-400 align-top">
                          {item.sl}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-900 border-r border-slate-400 align-top">
                          {item.productName}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900 border-r border-slate-400 align-top">
                          {item.qty.toFixed(2)}
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono text-slate-700 border-r border-slate-400 align-top">
                          {item.uom}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold border-r border-slate-400 align-top">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold border-slate-400 align-top">
                          {item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Financial Summary Below Table */}
                <div className="border-t border-slate-400 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-400 text-[11px]">
                  {/* Left: Total Quantity */}
                  <div className="p-2.5 font-bold text-slate-800 flex items-start">
                    Total Quantity : {selectedPrintBill.items.reduce((s, i) => s + i.qty, 0)}
                  </div>

                  {/* Right: Summary Breakdown */}
                  <div className="divide-y divide-slate-200">
                    <div className="flex justify-between px-3 py-1">
                      <span className="font-medium text-slate-700">Total Amount</span>
                      <span className="font-bold text-slate-900">{selectedPrintBill.billValue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-0.5">
                      <span className="text-slate-600">Discount(-)</span>
                      <span className="font-mono">{selectedPrintBill.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-0.5">
                      <span className="text-slate-600">Others Amount</span>
                      <span className="font-mono">{selectedPrintBill.othersAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-0.5">
                      <span className="text-slate-600">VAT(Inc)</span>
                      <span className="font-mono">{selectedPrintBill.vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-0.5">
                      <span className="text-slate-600">TAX(Inc)</span>
                      <span className="font-mono">{selectedPrintBill.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-1 bg-slate-50 font-semibold">
                      <span className="text-slate-800">Net Payable</span>
                      <span className="font-mono text-slate-900">{selectedPrintBill.netPayable.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-1 bg-slate-100 font-bold">
                      <span className="text-slate-900">Total Amount</span>
                      <span className="font-mono text-slate-900">{selectedPrintBill.netPayable.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* In words line */}
              <div className="text-[11px] pt-1">
                <span className="font-bold text-slate-800">In words: </span>
                <span className="text-slate-900 italic">
                  {numberToWords(selectedPrintBill.netPayable)}
                </span>
              </div>

              {/* Comment field */}
              <div className="border border-slate-400 p-2 text-[10.5px]">
                <span className="font-bold text-slate-800">Comment (Vat &amp; Tax) : </span>
                <span className="text-slate-700">{selectedPrintBill.commentVatTax || ""}</span>
              </div>

              {/* 4-Tier Signature Block (Matching Screenshot 3) */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-[10.5px]">
                {/* 1. Prepared By */}
                <div className="flex flex-col justify-end">
                  <div className="font-semibold text-slate-900">
                    {selectedPrintBill.preparedBy?.name || "Rajebul Hasan Rajon"}
                  </div>
                  <div className="text-slate-600">
                    {selectedPrintBill.preparedBy?.designation || "Deputy Manager"}
                  </div>
                  <div className="text-slate-500 font-mono text-[9.5px]">
                    {selectedPrintBill.preparedBy?.date || "05/09/2026 16:09:17"}
                  </div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    Prepared By
                  </div>
                </div>

                {/* 2. Vat and Tax Inputted By */}
                <div className="flex flex-col justify-end">
                  <div className="font-semibold text-slate-900">
                    {selectedPrintBill.vatTaxInputtedBy?.name || "A.K.M Nakibul Haque"}
                  </div>
                  <div className="text-slate-600">
                    {selectedPrintBill.vatTaxInputtedBy?.designation || "Sr. Officer"}
                  </div>
                  <div className="text-slate-500 font-mono text-[9.5px]">
                    {selectedPrintBill.vatTaxInputtedBy?.date || "06/09/2026 15:48:14"}
                  </div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    Vat and Tax Inputted By
                  </div>
                </div>

                {/* 3. Audited By */}
                <div className="flex flex-col justify-end">
                  {selectedPrintBill.status === "Audited" ? (
                    <>
                      <div className="font-semibold text-slate-900">A. Rahman</div>
                      <div className="text-slate-600">Audit Team Lead</div>
                      <div className="text-slate-500 font-mono text-[9.5px]">08/09/2026 11:30:00</div>
                    </>
                  ) : (
                    <div className="h-10"></div>
                  )}
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    Audited By
                  </div>
                </div>

                {/* 4. Approved By */}
                <div className="flex flex-col justify-end">
                  <div className="h-10"></div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    Approved By
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Attachment Viewer Modal (Green Paperclip Action)                 */}
      {/* ========================================================================= */}
      {attachmentModalOpen && selectedAttachmentBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <Paperclip className="size-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Bill Attachment Document
                </span>
              </div>
              <button
                type="button"
                onClick={closeAttachmentModal}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-3">
                <FileText className="size-8 text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {selectedAttachmentBill.attachmentFileName || "Bill_Invoice_Scan.pdf"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Supplier: {selectedAttachmentBill.supplier} &bull; Bill #{selectedAttachmentBill.billNo}
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <div className="text-slate-500 text-xs">Document Scan Preview Verified</div>
                <div className="text-[11px] text-slate-400">
                  Physical vendor challan and original tax invoice attached under MRR #{selectedAttachmentBill.mrrNo}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeAttachmentModal}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Downloading ${selectedAttachmentBill.attachmentFileName}...`);
                  }}
                  className="px-4 py-1.5 bg-[#1890ff] hover:bg-sky-600 text-white rounded font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="size-3.5" />
                  Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
