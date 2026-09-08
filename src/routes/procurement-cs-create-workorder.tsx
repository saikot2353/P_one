import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Plus,
  Pencil,
  Trash2,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Eye,
  Building2,
  CheckCircle2,
  Sparkles,
  Download,
  Check,
  ExternalLink,
  Send,
  ShieldCheck,
} from "lucide-react";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-cs-create-workorder")({
  head: () => ({
    meta: [
      { title: "CS PO List — CRIPTON Procurement" },
      { name: "description", content: "Procurement Comparison Sheet (CS) Purchase Order List & Official PO Console." },
    ],
  }),
  component: ProcurementCsPoListPage,
});

export interface PoItem {
  sl: number;
  description: string;
  uom: string;
  qty: number;
  unitPrice: number;
  discount: number;
  netPrice: number;
  currency: string;
  curRate: number;
  amount: number;
  amountBdt: number;
}

export interface PurchaseOrderRecord {
  id: string;
  poNo: string;
  poDate: string;
  csRef: string;
  reqNo: string;
  supplier: string;
  supplierContact: string;
  deliveryTo: string;
  deliveryContact: string;
  jobDescription: string;
  poValidDate: string;
  paymentMode: string;
  grossAmount: number;
  discount: number;
  grandTotal: number;
  netAmount: number;
  advance: number;
  status: "Draft" | "Forwarded" | "Issued" | "Approved" | "In Production" | "Completed";
  preparedBy: string;
  preparedDesignation: string;
  preparedDate: string;
  selectedTerms?: string[];
  forwardedAt?: string;
  forwardedTo?: string;
  items: PoItem[];
}

const DEFAULT_TERMS_AND_CONDITIONS = [
  "Total payment will be done after 100% physical delivery verification & quality inspection.",
  "Please explicitly refer to the P.O. Number in all correspondence, shipping invoices, and delivery challans.",
  "Total bill settlement will be calculated based on actual verified quantity received at store site.",
  "Delivery must be completed strictly within agreed lead time (15 calendar days from PO date).",
  "Substandard or non-compliant materials will be rejected immediately at vendor's sole risk and expense.",
  "Penalty clause: 0.5% per week delay up to a maximum limit of 5% of total PO value.",
];

const SAMPLE_PO_RECORDS: PurchaseOrderRecord[] = [
  {
    id: "1",
    poNo: "PO/PSL/2026/000115",
    poDate: "04/08/2025",
    csRef: "CS-2026-YRN4",
    reqNo: "332576 338726",
    supplier: "Makkah Electric",
    supplierContact: "Md. Jahangir Alam (Sales In-Charge)",
    deliveryTo: "Pakiza Software Limited [PSL-Operation]",
    deliveryContact: "Store & Receiving In-Charge",
    jobDescription: "Electrical Fittings & Cabling Materials for Unit #2",
    poValidDate: "02/04/2026",
    paymentMode: "Credit / LC 90 Days",
    grossAmount: 1755.0,
    discount: 0.0,
    grandTotal: 1755.0,
    netAmount: 1755.0,
    advance: 0.0,
    status: "Draft",
    preparedBy: "Rajebul Hasan Rajon",
    preparedDesignation: "Deputy Manager HR, Admin and Compliance",
    preparedDate: "03/03/2026 14:02:08",
    items: [
      {
        sl: 1,
        description: "MK One Gang Socket",
        uom: "PCS",
        qty: 1,
        unitPrice: 350.0,
        discount: 0,
        netPrice: 350.0,
        currency: "BDT",
        curRate: 1.0,
        amount: 350.0,
        amountBdt: 350.0,
      },
      {
        sl: 2,
        description: "PVC Tape High Insulation",
        uom: "PCS",
        qty: 1,
        unitPrice: 25.0,
        discount: 0,
        netPrice: 25.0,
        currency: "BDT",
        curRate: 1.0,
        amount: 25.0,
        amountBdt: 25.0,
      },
      {
        sl: 3,
        description: "Cable NYY 1X4 Rm Copper Heavy Duty",
        uom: "Yards",
        qty: 15,
        unitPrice: 92.0,
        discount: 0,
        netPrice: 92.0,
        currency: "BDT",
        curRate: 1.0,
        amount: 1380.0,
        amountBdt: 1380.0,
      },
    ],
  },
  {
    id: "2",
    poNo: "PO/PSL/2026/000116",
    poDate: "10/08/2025",
    csRef: "CS-2026-YRN4",
    reqNo: "REQ-2026-091",
    supplier: "Zhejiang Yarn Spinning Co.",
    supplierContact: "Mr. Lin Wei (Export Sales Director)",
    deliveryTo: "Pakiza Spinning Mills Ltd (Spinning Unit)",
    deliveryContact: "Materials Receiving Desk",
    jobDescription: "30s Carded Cotton Yarn 100% Ring Spun Import",
    poValidDate: "15/05/2026",
    paymentMode: "At Sight L/C",
    grossAmount: 40800.0,
    discount: 0.0,
    grandTotal: 40800.0,
    netAmount: 40800.0,
    advance: 0.0,
    status: "Draft",
    preparedBy: "Rajebul Hasan Rajon",
    preparedDesignation: "Deputy Manager HR, Admin and Compliance",
    preparedDate: "05/08/2026 11:30:15",
    items: [
      {
        sl: 1,
        description: "30s Carded Cotton Yarn 100% Cotton Ring Spun",
        uom: "Kg",
        qty: 12000,
        unitPrice: 3.4,
        discount: 0,
        netPrice: 3.4,
        currency: "USD",
        curRate: 120.0,
        amount: 40800.0,
        amountBdt: 4896000.0,
      },
    ],
  },
  {
    id: "3",
    poNo: "PO/PSL/2026/000117",
    poDate: "14/08/2025",
    csRef: "CS-2026-CHM12",
    reqNo: "REQ-2026-084",
    supplier: "Apex Textile Chemical Ltd",
    supplierContact: "Engr. Monirul Islam",
    deliveryTo: "Pakiza Dyeing & Processing Plant",
    deliveryContact: "Chemical Store Officer",
    jobDescription: "Reactive Dye Blue B & Non-Ionic Softeners",
    poValidDate: "30/04/2026",
    paymentMode: "30 Days Credit",
    grossAmount: 20900.0,
    discount: 500.0,
    grandTotal: 20400.0,
    netAmount: 20400.0,
    advance: 5000.0,
    status: "Forwarded",
    forwardedAt: "08/09/2026 10:15",
    forwardedTo: "Apex Textile Chemical Ltd (Engr. Monirul Islam)",
    selectedTerms: DEFAULT_TERMS_AND_CONDITIONS,
    preparedBy: "Rajebul Hasan Rajon",
    preparedDesignation: "Deputy Manager HR, Admin and Compliance",
    preparedDate: "12/08/2026 16:45:00",
    items: [
      {
        sl: 1,
        description: "Reactive Dye Blue B (High Fixation Rate)",
        uom: "Kg",
        qty: 2500,
        unitPrice: 6.2,
        discount: 200,
        netPrice: 6.12,
        currency: "USD",
        curRate: 120.0,
        amount: 15300.0,
        amountBdt: 1836000.0,
      },
      {
        sl: 2,
        description: "Textile Softener Liquid Non-Ionic",
        uom: "Ltr",
        qty: 4000,
        unitPrice: 1.2,
        discount: 300,
        netPrice: 1.125,
        currency: "USD",
        curRate: 120.0,
        amount: 4500.0,
        amountBdt: 540000.0,
      },
    ],
  },
];

export function ProcurementCsPoListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState<PurchaseOrderRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("procurement_cs_po_list_v3");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return SAMPLE_PO_RECORDS;
  });

  // Save to local storage on update
  const updateTableData = (newData: PurchaseOrderRecord[]) => {
    setTableData(newData);
    if (typeof window !== "undefined") {
      localStorage.setItem("procurement_cs_po_list_v3", JSON.stringify(newData));
    }
  };

  // Modal State for PO Document Detail View
  const [activePoDocument, setActivePoDocument] = useState<PurchaseOrderRecord | null>(null);

  // Edit / Create Form Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPo, setEditingPo] = useState<PurchaseOrderRecord | null>(null);
  const [formData, setFormData] = useState<Partial<PurchaseOrderRecord>>({});

  // Forward PO Modal State
  const [forwardingPo, setForwardingPo] = useState<PurchaseOrderRecord | null>(null);
  const [selectedTerms, setSelectedTerms] = useState<string[]>(DEFAULT_TERMS_AND_CONDITIONS);
  const [customTermInput, setCustomTermInput] = useState("");
  const [termSearchQuery, setTermSearchQuery] = useState("");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filtered Data
  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        row.poNo.toLowerCase().includes(q) ||
        row.csRef.toLowerCase().includes(q) ||
        row.reqNo.toLowerCase().includes(q) ||
        row.supplier.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
      );
    });
  }, [tableData, searchQuery]);

  // Combined and Filtered Terms List inside Modal
  const allAvailableTerms = useMemo(() => {
    const list = [...DEFAULT_TERMS_AND_CONDITIONS];
    if (forwardingPo?.selectedTerms) {
      forwardingPo.selectedTerms.forEach((t) => {
        if (!list.includes(t)) list.push(t);
      });
    }
    selectedTerms.forEach((t) => {
      if (!list.includes(t)) list.push(t);
    });
    return list;
  }, [forwardingPo, selectedTerms]);

  const filteredTermsList = useMemo(() => {
    const q = termSearchQuery.toLowerCase().trim();
    if (!q) return allAvailableTerms;
    return allAvailableTerms.filter((term) => term.toLowerCase().includes(q));
  }, [allAvailableTerms, termSearchQuery]);

  // Open Forward Modal
  const handleOpenForwardModal = (po: PurchaseOrderRecord) => {
    setForwardingPo(po);
    setSelectedTerms(po.selectedTerms && po.selectedTerms.length > 0 ? po.selectedTerms : [...DEFAULT_TERMS_AND_CONDITIONS]);
    setTermSearchQuery("");
  };

  // Process & Forward PO
  const handleProcessAndForward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forwardingPo) return;
    if (selectedTerms.length === 0) {
      alert("Please select at least one Term & Condition to proceed with forwarding.");
      return;
    }

    const timestamp = new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

    const updated = tableData.map((item) => {
      if (item.id === forwardingPo.id) {
        return {
          ...item,
          status: "Forwarded" as const,
          selectedTerms: selectedTerms,
          forwardedAt: timestamp,
          forwardedTo: item.supplier,
        };
      }
      return item;
    });

    updateTableData(updated);
    setNotificationMsg(`Purchase Order ${forwardingPo.poNo} has been successfully processed & forwarded to ${forwardingPo.supplier}!`);
    setTimeout(() => setNotificationMsg(null), 6000);

    setForwardingPo(null);
  };

  // Handle Save (Create / Edit)
  const handleSavePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPo) {
      const updated = tableData.map((item) =>
        item.id === editingPo.id ? ({ ...item, ...formData } as PurchaseOrderRecord) : item
      );
      updateTableData(updated);
    } else {
      const autoNum = Math.floor(118 + Math.random() * 800);
      const newPo: PurchaseOrderRecord = {
        id: Date.now().toString(),
        poNo: formData.poNo || `PO/PSL/2026/000${autoNum}`,
        poDate: formData.poDate || new Date().toLocaleDateString("en-GB"),
        csRef: formData.csRef || "CS-2026-YRN4",
        reqNo: formData.reqNo || "REQ-2026-091",
        supplier: formData.supplier || "Zhejiang Yarn Spinning Co.",
        supplierContact: formData.supplierContact || "Md. Jahangir Alam",
        deliveryTo: "Pakiza Software Limited [PSL-Operation]",
        deliveryContact: "Store & Receiving In-Charge",
        jobDescription: formData.jobDescription || "Garments Master Materials Procurement",
        poValidDate: "02/04/2026",
        paymentMode: "Credit / LC 90 Days",
        grossAmount: 1755.0,
        discount: 0,
        grandTotal: 1755.0,
        netAmount: 1755.0,
        advance: 0,
        status: "Draft",
        preparedBy: "Rajebul Hasan Rajon",
        preparedDesignation: "Deputy Manager HR, Admin and Compliance",
        preparedDate: new Date().toLocaleString(),
        selectedTerms: DEFAULT_TERMS_AND_CONDITIONS,
        items: [
          {
            sl: 1,
            description: formData.jobDescription || "Master Materials Package",
            uom: "PCS",
            qty: 1,
            unitPrice: 1755.0,
            discount: 0,
            netPrice: 1755.0,
            currency: "BDT",
            curRate: 1.0,
            amount: 1755.0,
            amountBdt: 1755.0,
          },
        ],
      };
      updateTableData([newPo, ...tableData]);
    }
    setIsEditModalOpen(false);
    setEditingPo(null);
  };

  const handleDeletePo = (id: string) => {
    if (confirm("Are you sure you want to delete this Purchase Order (PO) record?")) {
      updateTableData(tableData.filter((item) => item.id !== id));
    }
  };

  const handlePrintPo = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <SlidersHorizontal className="size-5.5 text-amber-500" />
                CS PO List (Comparison Sheet Purchase Orders)
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                Procurement Workspace &gt; Comparison Sheet &gt;{" "}
                <span className="text-amber-500 font-semibold">CS PO List</span>
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPo(null);
                setFormData({});
                setIsEditModalOpen(true);
              }}
              className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="size-4" />
              Create New PO
            </button>
          </div>

          {/* Main PO Table Card */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
            {/* Notification Toast Banner */}
            {notificationMsg && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>{notificationMsg}</span>
                </div>
                <button onClick={() => setNotificationMsg(null)} className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer">
                  <X className="size-4" />
                </button>
              </div>
            )}

            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel
                </button>
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <Printer className="size-3.5 text-blue-600" /> Print
                </button>
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search PO No, CS Ref, Supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-3 h-[32px] bg-[#f8fafc] border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 rounded-md text-xs font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 dark:bg-slate-800">
                    <th className="px-4 py-2.5 font-semibold w-12 text-center border-r border-slate-100">SL</th>
                    <th className="px-4 py-2.5 font-semibold w-40 text-center border-r border-slate-100">ACTIONS</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">PO NUMBER</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">PO DATE</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">CS REF ID</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">REQUISITION REF</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">SUPPLIER / VENDOR</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100 text-right">NET AMOUNT</th>
                    <th className="px-4 py-2.5 font-semibold text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal text-slate-700 dark:text-slate-200 bg-white dark:bg-transparent">
                  {filteredData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-amber-50/30 dark:hover:bg-slate-800/40 border-b border-slate-100 transition-colors">
                      <td className="px-4 py-2.5 text-center border-r border-slate-100 text-slate-500 font-normal">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2.5 text-center border-r border-slate-100 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setActivePoDocument(row)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 transition border border-emerald-200 shadow-2xs cursor-pointer"
                            title="View Official Purchase Order Document"
                          >
                            <Eye className="size-4" />
                          </button>
                          {row.status === "Draft" ? (
                            <button
                              onClick={() => handleOpenForwardModal(row)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition shadow-2xs cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                              title="Process & Forward Purchase Order"
                            >
                              <Send className="size-3" />
                              Forward
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenForwardModal(row)}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 transition border border-emerald-200 shadow-2xs cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                              title="View / Re-Forward Terms & Conditions"
                            >
                              <CheckCircle2 className="size-3 text-emerald-600" />
                              Forwarded
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingPo(row);
                              setFormData({ ...row });
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Edit Record"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePo(row.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {row.poNo}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 text-slate-500 whitespace-nowrap">
                        {row.poDate}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {row.csRef}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {row.reqNo}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 font-semibold text-slate-800 dark:text-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="size-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{row.supplier}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {row.items[0]?.currency === "USD" ? "$" : "৳"}
                        {row.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase flex items-center justify-center gap-1 w-fit mx-auto ${
                            row.status === "Draft"
                              ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                              : row.status === "Forwarded" || row.status === "Issued" || row.status === "Approved"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : row.status === "In Production"
                              ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {row.status === "Draft" && <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />}
                          {row.status === "Forwarded" && <Check className="size-3 text-emerald-600" />}
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-muted-foreground font-semibold">
                        No Purchase Orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-100 bg-[#fcfdfd] dark:bg-slate-900/40 text-[11px] text-muted-foreground font-normal flex flex-col sm:flex-row justify-between items-center gap-3">
              <span>Showing 1 to {filteredData.length} of {tableData.length} entries</span>
              <div className="flex items-center gap-1.5 font-sans">
                <button className="px-2 py-1 text-slate-400 hover:text-slate-700">Previous</button>
                <button className="size-6 bg-amber-500 text-white font-semibold rounded flex items-center justify-center text-[10px]">1</button>
                <button className="px-2 py-1 text-slate-400 hover:text-slate-700">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* FORWARD PURCHASE ORDER - ULTRA CLEAN & SEARCHABLE MODAL           */}
        {/* ================================================================= */}
        {forwardingPo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-4xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header - Ultra Clean */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Send className="size-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Forward Purchase Order
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold border border-slate-200 dark:border-slate-700">
                        {forwardingPo.poNo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Supplier: <span className="font-semibold text-slate-800 dark:text-slate-200">{forwardingPo.supplier}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForwardingPo(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body - Clean & Searchable */}
              <form onSubmit={handleProcessAndForward} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 text-xs font-sans">
                {/* Search Bar for Terms */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search terms & conditions..."
                    value={termSearchQuery}
                    onChange={(e) => setTermSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400"
                  />
                  {termSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTermSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Section Header */}
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Terms &amp; Conditions ({selectedTerms.length} Selected)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Select terms to include in the official forwarded Purchase Order document.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedTerms.length === allAvailableTerms.length) {
                        setSelectedTerms([]);
                      } else {
                        setSelectedTerms([...allAvailableTerms]);
                      }
                    }}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    {selectedTerms.length === allAvailableTerms.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                {/* Terms Checklist - Filtered & Spacious */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredTermsList.map((term, index) => {
                    const isChecked = selectedTerms.includes(term);
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedTerms(selectedTerms.filter((t) => t !== term));
                          } else {
                            setSelectedTerms([...selectedTerms, term]);
                          }
                        }}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 size-4 accent-slate-800 rounded cursor-pointer shrink-0"
                        />
                        <span className="text-xs font-normal leading-relaxed flex-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300 mr-1.5">{index + 1}.</span>
                          {term}
                        </span>
                      </div>
                    );
                  })}

                  {filteredTermsList.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs font-medium">
                      No terms &amp; conditions matched "{termSearchQuery}".
                    </div>
                  )}
                </div>

                {/* Add Custom Term Input */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add custom term & condition..."
                    value={customTermInput}
                    onChange={(e) => setCustomTermInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (customTermInput.trim()) {
                          setSelectedTerms([...selectedTerms, customTermInput.trim()]);
                          setCustomTermInput("");
                        }
                      }
                    }}
                    className="flex-1 px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTermInput.trim()) {
                        setSelectedTerms([...selectedTerms, customTermInput.trim()]);
                        setCustomTermInput("");
                      }
                    }}
                    className="h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                  >
                    <Plus className="size-4" /> Add Term
                  </button>
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setForwardingPo(null)}
                    className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    Process &amp; Forward PO
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* OFFICIAL EXECUTIVE PURCHASE ORDER (PO) DOCUMENT MODAL           */}
        {/* ================================================================= */}
        {activePoDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col max-h-[96vh]">
              {/* Modal Top Control Bar */}
              <div className="flex justify-between items-center px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-amber-400" />
                  <h3 className="text-xs font-black tracking-wide uppercase">
                    Official Purchase Order Document Preview — {activePoDocument.poNo}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintPo}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Printer className="size-4" /> Print PO Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePoDocument(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer ml-2"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* PRINTABLE DOCUMENT CANVAS */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-100 dark:bg-slate-900/60 font-sans">
                <div
                  id="printable-po-document"
                  className="bg-white dark:bg-slate-950 p-8 md:p-10 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-4xl mx-auto space-y-6 relative overflow-hidden text-xs"
                >
                  {/* DRAFT / FORWARDED WATERMARK OVERLAY */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.06] dark:opacity-[0.08]">
                    <span className="text-[120px] font-black uppercase tracking-widest -rotate-45 text-slate-900 dark:text-white">
                      {activePoDocument.status === "Draft" ? "DRAFT" : "PURCHASE ORDER"}
                    </span>
                  </div>

                  {/* Header Row: Company Branding + Document Title & Meta */}
                  <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 dark:border-slate-100 pb-4 gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-3">
                        <img
                          src={pakizaSoftwareLogo}
                          alt="Pakiza Software Logo"
                          className="h-11 w-auto object-contain max-w-[240px]"
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-2 space-y-0.5 font-medium">
                        <p>Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205</p>
                        <p>Phone: +880 2 9612345 &bull; Email: procurement@pakiza.com</p>
                      </div>
                    </div>

                    <div className="text-right w-full sm:w-auto">
                      <h2 className="text-xl font-black tracking-wider text-slate-800 dark:text-slate-100 uppercase">
                        PURCHASE ORDER
                      </h2>

                      {/* Header PO Meta Table */}
                      <table className="text-[11px] font-sans text-left mt-2 border-collapse ml-auto border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                        <tbody>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <td className="py-1 px-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">P.O. Number:</td>
                            <td className="py-1 px-3 font-mono font-bold text-slate-900 dark:text-white">{activePoDocument.poNo}</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <td className="py-1 px-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">P.O. Date:</td>
                            <td className="py-1 px-3 font-medium text-slate-800 dark:text-slate-200">{activePoDocument.poDate}</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <td className="py-1 px-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">Ref #:</td>
                            <td className="py-1 px-3 font-semibold text-amber-600 dark:text-amber-400">{activePoDocument.csRef}</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">Req No:</td>
                            <td className="py-1 px-3 font-bold text-blue-600 dark:text-blue-400 underline">{activePoDocument.reqNo}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3-Column Information Box (Supplier, Delivery, Job Terms) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden text-[11px] relative z-10">
                    {/* Supplier Info */}
                    <div className="p-3 bg-indigo-50/70 dark:bg-slate-900">
                      <div className="text-[10px] font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300 border-b border-indigo-200 dark:border-slate-800 pb-1 mb-2">
                        SUPPLIER INFORMATION
                      </div>
                      <div className="font-black text-slate-900 dark:text-white text-xs">{activePoDocument.supplier}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-[10px] mt-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Contact Person:</span> {activePoDocument.supplierContact}
                      </div>
                    </div>

                    {/* Delivery To */}
                    <div className="p-3 bg-indigo-50/70 dark:bg-slate-900">
                      <div className="text-[10px] font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300 border-b border-indigo-200 dark:border-slate-800 pb-1 mb-2">
                        DELIVERY TO
                      </div>
                      <div className="font-black text-slate-900 dark:text-white text-xs">{activePoDocument.deliveryTo}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-[10px] mt-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Contact Person:</span> {activePoDocument.deliveryContact}
                      </div>
                    </div>

                    {/* Job / PO Terms */}
                    <div className="p-3 bg-indigo-50/70 dark:bg-slate-900">
                      <div className="text-[10px] font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300 border-b border-indigo-200 dark:border-slate-800 pb-1 mb-2">
                        JOB / PO TERMS
                      </div>
                      <div className="text-[10px] text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-white">Description:</span> {activePoDocument.jobDescription}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">PO Valid Date:</span> {activePoDocument.poValidDate}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Payment Mode:</span> {activePoDocument.paymentMode}
                      </div>
                    </div>
                  </div>

                  {/* PO Items Table */}
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden relative z-10">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-indigo-100/80 dark:bg-slate-800 text-[9px] font-bold text-slate-700 dark:text-slate-200 uppercase border-b border-slate-300 dark:border-slate-700">
                        <tr>
                          <th className="py-2 px-2 text-center border-r border-slate-300 dark:border-slate-700 w-8">SL</th>
                          <th className="py-2 px-3 border-r border-slate-300 dark:border-slate-700">DESCRIPTION</th>
                          <th className="py-2 px-2 text-center border-r border-slate-300 dark:border-slate-700 w-12">UOM</th>
                          <th className="py-2 px-2 text-center border-r border-slate-300 dark:border-slate-700 w-12">QTY</th>
                          <th className="py-2 px-2 text-right border-r border-slate-300 dark:border-slate-700 w-20">UNIT PRICE</th>
                          <th className="py-2 px-2 text-right border-r border-slate-300 dark:border-slate-700 w-16">DISCOUNT</th>
                          <th className="py-2 px-2 text-right border-r border-slate-300 dark:border-slate-700 w-20">NET PRICE</th>
                          <th className="py-2 px-2 text-center border-r border-slate-300 dark:border-slate-700 w-16">CURRENCY</th>
                          <th className="py-2 px-2 text-center border-r border-slate-300 dark:border-slate-700 w-14">CUR.RATE</th>
                          <th className="py-2 px-2.5 text-right border-r border-slate-300 dark:border-slate-700 w-24">AMOUNT</th>
                          <th className="py-2 px-2.5 text-right w-28">AMOUNT(BDT)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 font-mono text-[10px]">
                        {activePoDocument.items.map((item) => (
                          <tr key={item.sl} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                            <td className="py-1.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
                              {item.sl}
                            </td>
                            <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800 font-sans font-bold text-slate-800 dark:text-slate-100">
                              {item.description}
                            </td>
                            <td className="py-1.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 font-sans text-slate-600 dark:text-slate-400">
                              {item.uom}
                            </td>
                            <td className="py-1.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                              {item.qty}
                            </td>
                            <td className="py-1.5 px-2 text-right border-r border-slate-200 dark:border-slate-800">
                              {item.unitPrice.toFixed(2)}
                            </td>
                            <td className="py-1.5 px-2 text-right border-r border-slate-200 dark:border-slate-800 text-slate-500">
                              {item.discount.toFixed(2)}
                            </td>
                            <td className="py-1.5 px-2 text-right border-r border-slate-200 dark:border-slate-800 font-semibold">
                              {item.netPrice.toFixed(2)}
                            </td>
                            <td className="py-1.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 font-sans text-slate-600 dark:text-slate-400">
                              {item.currency}
                            </td>
                            <td className="py-1.5 px-2 text-center border-r border-slate-200 dark:border-slate-800">
                              {item.curRate.toFixed(2)}
                            </td>
                            <td className="py-1.5 px-2.5 text-right border-r border-slate-200 dark:border-slate-800 font-bold">
                              {item.amount.toFixed(2)}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-black text-slate-900 dark:text-white">
                              {item.amountBdt.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Lower Row: Selected Terms & Conditions (Left) + Financial Summary Block (Right) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 relative z-10">
                    {/* Terms & Conditions (Left) */}
                    <div className="md:col-span-7 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-[10px]">
                      <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 mb-2 flex items-center justify-between">
                        <span>Terms &amp; Conditions</span>
                        {activePoDocument.status === "Forwarded" && (
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                            <Check className="size-3" /> Processed &amp; Forwarded
                          </span>
                        )}
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                        {(
                          activePoDocument.selectedTerms || [
                            "Total payment will be done after delivery verification.",
                            "Please refer to the P.O. Number in all correspondence.",
                            "Total bill will be at actual quantity received and verified.",
                          ]
                        ).map((term, i) => (
                          <li key={i}>{term}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Financial Summary Box (Right) */}
                    <div className="md:col-span-5 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden font-mono text-[11px]">
                      <table className="w-full text-right border-collapse">
                        <tbody>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <td className="py-1 px-3 font-sans font-bold text-slate-600 dark:text-slate-400">Gross Amount :</td>
                            <td className="py-1 px-3 font-semibold text-slate-800 dark:text-slate-200 w-28">{activePoDocument.grossAmount.toFixed(2)}</td>
                            <td className="py-1 px-3 font-bold text-slate-900 dark:text-white w-28">{activePoDocument.grossAmount.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <td className="py-1 px-3 font-sans font-bold text-slate-600 dark:text-slate-400">Discount :</td>
                            <td className="py-1 px-3 font-semibold text-slate-800 dark:text-slate-200">{activePoDocument.discount.toFixed(2)}</td>
                            <td className="py-1 px-3 font-bold text-slate-900 dark:text-white">{activePoDocument.discount.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-800 font-bold bg-slate-100 dark:bg-slate-800/80">
                            <td className="py-1 px-3 font-sans text-slate-900 dark:text-white">Grand Total :</td>
                            <td className="py-1 px-3 text-slate-900 dark:text-white">{activePoDocument.grandTotal.toFixed(2)}</td>
                            <td className="py-1 px-3 text-slate-900 dark:text-white">{activePoDocument.grandTotal.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-800 font-bold">
                            <td className="py-1 px-3 font-sans text-slate-600 dark:text-slate-400">Net Amount :</td>
                            <td className="py-1 px-3 text-slate-900 dark:text-white">{activePoDocument.netAmount.toFixed(2)}</td>
                            <td className="py-1 px-3 text-slate-900 dark:text-white">{activePoDocument.netAmount.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-3 font-sans font-bold text-slate-600 dark:text-slate-400">Advance :</td>
                            <td className="py-1 px-3 font-semibold text-slate-800 dark:text-slate-200">{activePoDocument.advance.toFixed(2)}</td>
                            <td className="py-1 px-3 font-bold text-slate-900 dark:text-white">{activePoDocument.advance.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Signature & Authorization Section */}
                  <div className="pt-8 flex justify-between items-end text-[11px] relative z-10">
                    <div>
                      <div className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Prepared By</div>
                      <div className="font-black text-slate-900 dark:text-white text-sm mt-1">{activePoDocument.preparedBy}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-[10px]">{activePoDocument.preparedDesignation}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">{activePoDocument.preparedDate}</div>
                    </div>

                    <div className="text-center border-t border-slate-400 dark:border-slate-600 pt-1 w-44">
                      <span className="font-bold text-[10px] text-slate-600 dark:text-slate-400">Authorized Signature</span>
                    </div>
                  </div>

                  {/* System Generated Notice Footer */}
                  <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative z-10">
                    This is system Generated Purchase Order, No Need Signature &amp; Seal
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex justify-between items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setActivePoDocument(null)}
                  className="px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  Close Document
                </button>

                <button
                  type="button"
                  onClick={handlePrintPo}
                  className="px-5 py-1.5 text-xs font-extrabold text-white bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Printer className="size-4" /> Print Purchase Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT PO FORM MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="size-4 text-amber-500" />
                  {editingPo ? "Edit Purchase Order" : "Create New Purchase Order (PO)"}
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSavePo} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PO Number</label>
                  <input
                    type="text"
                    placeholder="e.g. PO/PSL/2026/000115 (Leave empty for auto)"
                    value={formData.poNo || ""}
                    onChange={(e) => setFormData({ ...formData, poNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CS Ref ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS-2026-YRN4"
                      value={formData.csRef || ""}
                      onChange={(e) => setFormData({ ...formData, csRef: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Requisition Ref *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 332576"
                      value={formData.reqNo || ""}
                      onChange={(e) => setFormData({ ...formData, reqNo: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Supplier / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Makkah Electric / Zhejiang Yarn Spinning Co."
                    value={formData.supplier || ""}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job / Items Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electrical Fittings, MK One Gang Socket..."
                    value={formData.jobDescription || ""}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PO Status</label>
                    <select
                      value={formData.status || "Draft"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Forwarded">Forwarded</option>
                      <option value="Issued">Issued</option>
                      <option value="Approved">Approved</option>
                      <option value="In Production">In Production</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PO Date</label>
                    <input
                      type="text"
                      placeholder="e.g. 04/08/2025"
                      value={formData.poDate || ""}
                      onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg shadow-sm transition cursor-pointer"
                  >
                    {editingPo ? "Update PO Record" : "Create PO Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
