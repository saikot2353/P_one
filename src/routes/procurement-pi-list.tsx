import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Plus,
  Trash2,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Eye,
  Building2,
  CheckCircle2,
  RefreshCw,
  Home,
  ChevronRight,
  Filter,
  Package,
} from "lucide-react";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-pi-list")({
  head: () => ({
    meta: [
      { title: "PI List (Proforma Invoice) — CRIPTON Procurement" },
      { name: "description", content: "Proforma Invoice List with PI Date filters, L/C details, shipment tracking, and document viewer." },
    ],
  }),
  component: ProformaInvoiceListPage,
});

export interface PiItem {
  sl: number;
  reqNo?: string;
  productName?: string;
  originName?: string;
  description: string;
  qty: number;
  uom: string;
  rate: number;
  unitPrice?: number;
  total: number;
  remarks?: string;
}

export interface PiRecord {
  id: string;
  piNo: string;
  piDate: string;
  lcNo: string;
  lcDate: string;
  shipmentDate: string;
  supplier: string;
  productType: string;
  status: "Submit" | "Approved" | "Draft" | "Pending" | "Verified";
  shipmentTerms?: string;
  piValidityDate?: string;
  currency?: string;
  portOfDischarge?: string;
  piType?: string;
  portOfLoading?: string;
  upcharge?: number;
  discount?: number;
  reqNo?: string;
  productName?: string;
  originName?: string;
  remarks?: string;
  items?: PiItem[];
}

const INITIAL_MOCK_PIS: PiRecord[] = [
  {
    id: "pi-1",
    piNo: "SDC/EXP/3319/2026-27",
    piDate: "14/07/2026",
    lcNo: "169026150164",
    lcDate: "15/07/2026",
    shipmentDate: "01/09/2026",
    supplier: "Spectrum Dyes & Chemicals PVT. Ltd.",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "CFR",
    piValidityDate: "01/09/2026",
    currency: "USD",
    portOfDischarge: "Chittagong Port, Bangladesh",
    piType: "Non-Bond LC/PO",
    portOfLoading: "Nhava Sheva, India",
    upcharge: 0.0,
    discount: 0.0,
    items: [
      {
        sl: 1,
        reqNo: "399204",
        productName: "Shade Cards & Bags",
        originName: "India",
        description: "Textile Dyeing Shade Card & Sample Bags",
        qty: 88.0,
        uom: "KG",
        rate: 1.0,
        total: 88.0,
        remarks: "Sample shade cards for unit 2 dyeing line",
      },
    ],
  },
  {
    id: "pi-2",
    piNo: "TCBL-271/26",
    piDate: "18/07/2026",
    lcNo: "169026100004",
    lcDate: "30/07/2026",
    shipmentDate: "31/08/2026",
    supplier: "Tubingen Chemical (BD) Ltd",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "FOB",
    piValidityDate: "31/08/2026",
    currency: "USD",
    portOfDischarge: "Chittagong Port, Bangladesh",
    piType: "Non-Bond LC/PO",
    portOfLoading: "Hamburg, Germany",
    upcharge: 0.0,
    discount: 0.0,
    items: [
      {
        sl: 1,
        reqNo: "399210",
        productName: "Textile Softener Liquid Non-Ionic",
        originName: "Germany",
        description: "High Softness Concentrated Liquid",
        qty: 4000.0,
        uom: "Ltr",
        rate: 2.225,
        total: 8900.0,
        remarks: "Urgent shipment for bulk finishing batch",
      },
    ],
  },
  {
    id: "pi-3",
    piNo: "ZJ-YRN-9921/2026",
    piDate: "02/08/2026",
    lcNo: "169026200088",
    lcDate: "05/08/2026",
    shipmentDate: "15/09/2026",
    supplier: "Zhejiang Yarn Spinning Co.",
    productType: "Textile Yarn",
    status: "Approved",
    shipmentTerms: "CIF",
    piValidityDate: "15/09/2026",
    currency: "USD",
    portOfDischarge: "Chittagong Port, Bangladesh",
    piType: "Irrevocable Sight L/C",
    portOfLoading: "Ningbo, China",
    upcharge: 0.0,
    discount: 0.0,
    items: [
      {
        sl: 1,
        reqNo: "399315",
        productName: "30s Carded Cotton Yarn 100% Ring Spun",
        originName: "China",
        description: "Weaving Grade 100% Cotton",
        qty: 12000.0,
        uom: "Kg",
        rate: 3.4,
        total: 40800.0,
        remarks: "100% Cotton Ring Spun Import",
      },
    ],
  },
];

export function ProformaInvoiceListPage() {
  const navigate = useNavigate();

  // Filter Controls Form State
  const [piDateFrom, setPiDateFrom] = useState("");
  const [piDateTo, setPiDateTo] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All...");
  const [piNumberFilter, setPiNumberFilter] = useState("");

  // PI List State (synced with localStorage)
  const [piList, setPiList] = useState<PiRecord[]>(INITIAL_MOCK_PIS);

  // Document Viewer State
  const [viewingPi, setViewingPi] = useState<PiRecord | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("procurement_pi_list_v1");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const combinedMap = new Map<string, PiRecord>();
            parsed.forEach((pi: PiRecord) => combinedMap.set(pi.piNo, pi));
            INITIAL_MOCK_PIS.forEach((pi: PiRecord) => {
              if (!combinedMap.has(pi.piNo)) {
                combinedMap.set(pi.piNo, pi);
              }
            });
            setPiList(Array.from(combinedMap.values()));
          }
        } catch (e) {}
      }
    }
  }, []);

  // Filter Logic
  const filteredPiList = useMemo(() => {
    return piList.filter((pi) => {
      // Filter Supplier Name
      if (
        supplierFilter !== "All..." &&
        !pi.supplier.toLowerCase().includes(supplierFilter.toLowerCase())
      ) {
        return false;
      }
      // Filter PI Number
      if (piNumberFilter && !pi.piNo.toLowerCase().includes(piNumberFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [piList, supplierFilter, piNumberFilter]);

  // Unique Suppliers for Dropdown
  const supplierOptions = useMemo(() => {
    const suppliers = new Set<string>();
    piList.forEach((p) => suppliers.add(p.supplier));
    return Array.from(suppliers);
  }, [piList]);

  return (
    <div className="min-h-screen flex bg-slate-100/70 dark:bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 w-full max-w-[1600px] mx-auto">
          {/* Top Breadcrumb & Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-card p-4 rounded-2xl border border-border shadow-2xs">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
                <Home className="size-3.5" />
                <span>Home</span>
                <ChevronRight className="size-3" />
                <span>Proforma Invoice</span>
                <ChevronRight className="size-3" />
                <span className="text-blue-600 dark:text-blue-400 font-bold">PI List</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Package className="size-5.5 text-blue-600 dark:text-blue-400" />
                Proforma Invoice List (PI List)
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-pi-create" })}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="size-4" /> Create PI
              </button>
            </div>
          </div>

          {/* FILTER CONTROLS CARD */}
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Filter className="size-4 text-blue-600 dark:text-blue-400" /> PI Filter Parameters
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPiDateFrom("");
                  setPiDateTo("");
                  setSupplierFilter("All...");
                  setPiNumberFilter("");
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs items-end">
              {/* PI Date From */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PI Date From</label>
                <input
                  type="date"
                  value={piDateFrom}
                  onChange={(e) => setPiDateFrom(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-normal outline-none focus:border-blue-500"
                />
              </div>

              {/* PI Date To */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PI Date To</label>
                <input
                  type="date"
                  value={piDateTo}
                  onChange={(e) => setPiDateTo(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-normal outline-none focus:border-blue-500"
                />
              </div>

              {/* Supplier Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Supplier Name</label>
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
                >
                  <option value="All...">All...</option>
                  {supplierOptions.map((sup) => (
                    <option key={sup} value={sup}>{sup}</option>
                  ))}
                </select>
              </div>

              {/* PI Number */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PI Number</label>
                <input
                  type="text"
                  placeholder="e.g. SDC/EXP/3319"
                  value={piNumberFilter}
                  onChange={(e) => setPiNumberFilter(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-medium outline-none focus:border-blue-500"
                />
              </div>

              {/* Show / Filter Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search className="size-4" /> Show
                </button>
              </div>
            </div>
          </div>

          {/* MAIN PI REGISTRY TABLE CONTAINER */}
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col">
            {/* Toolbar Header & Exports */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Proforma Invoices ({filteredPiList.length})
                </span>
              </div>

              {/* Export Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => alert("Exporting Excel file...")}
                  className="h-8 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5" /> Excel
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => alert("Downloading PDF document...")}
                  className="h-8 px-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="size-3.5" /> PDF
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-slate-100/80 dark:bg-slate-800/80 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    <th className="p-3 text-center w-12 border-r border-border/60">#</th>
                    <th className="p-3 border-r border-border/60">PINo</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">PIDate</th>
                    <th className="p-3 text-center w-32 border-r border-border/60">LcNo</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">LcDate</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">ShipmentDate</th>
                    <th className="p-3 border-r border-border/60">Supplier</th>
                    <th className="p-3 text-center w-36 border-r border-border/60">ProductType</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">Status</th>
                    <th className="p-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-white dark:bg-transparent font-normal">
                  {filteredPiList.map((pi, index) => (
                    <tr key={pi.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                      <td className="p-3 text-center text-slate-500 border-r border-border/60 font-medium">
                        {index + 1}
                      </td>

                      {/* PINo (Clickable to view details modal) */}
                      <td className="p-3 border-r border-border/60 font-mono font-bold">
                        <button
                          type="button"
                          onClick={() => setViewingPi(pi)}
                          className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 transition cursor-pointer font-mono font-bold"
                        >
                          {pi.piNo}
                        </button>
                      </td>

                      <td className="p-3 text-center text-slate-600 dark:text-slate-400 border-r border-border/60 font-medium whitespace-nowrap">
                        {pi.piDate}
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-border/60 whitespace-nowrap">
                        {pi.lcNo}
                      </td>

                      <td className="p-3 text-center text-slate-600 dark:text-slate-400 border-r border-border/60 font-medium whitespace-nowrap">
                        {pi.lcDate}
                      </td>

                      <td className="p-3 text-center text-amber-600 dark:text-amber-400 border-r border-border/60 font-semibold whitespace-nowrap">
                        {pi.shipmentDate}
                      </td>

                      <td className="p-3 border-r border-border/60 font-bold text-slate-900 dark:text-white max-w-[240px] truncate" title={pi.supplier}>
                        {pi.supplier}
                      </td>

                      <td className="p-3 text-center border-r border-border/60 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                          {pi.productType}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="p-3 text-center border-r border-border/60 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-flex items-center gap-1 ${
                            pi.status === "Approved" || pi.status === "Submit"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : pi.status === "Verified"
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {pi.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingPi(pi)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                            title="View Document"
                          >
                            <Eye className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredPiList.length === 0 && (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                        No Proforma Invoice records match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
              <span>Showing 1 to {filteredPiList.length} of {filteredPiList.length} entries</span>
              <div className="flex items-center gap-1">
                <button disabled className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 bg-blue-600 text-white font-bold rounded-md">1</button>
                <button disabled className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-400 cursor-not-allowed">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* PROFORMA INVOICE VIEW MODAL */}
        {viewingPi && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto print:p-0 print:bg-white">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative border border-slate-200 print:border-none print:shadow-none print:max-h-none print:w-full">
              
              {/* Modal Header Bar (Hidden on Print) */}
              <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center print:hidden rounded-t-2xl border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono tracking-tight">{viewingPi.piNo}</span>
                      <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                        {viewingPi.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Proforma Invoice Preview</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition cursor-pointer shadow-sm shadow-sky-600/30"
                  >
                    <Printer className="size-4" /> Print Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingPi(null)}
                    className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Printable Document Canvas */}
              <div className="p-8 sm:p-10 space-y-6 relative font-sans text-slate-800 bg-white">
                
                {/* Header: Company Name & Document Title */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <img src={pakizaSoftwareLogo} alt="Pakiza Knit Composite Ltd" className="h-8 w-auto object-contain" />
                    <h1 className="text-2xl font-black tracking-tight text-[#6bb92d]">
                      Pakiza Knit Composite Ltd
                    </h1>
                  </div>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">
                    Holding No A-1/5, Mojidpur(Boro Boli Meher), Savar, Dhaka.
                  </p>
                  <div className="pt-2">
                    <h2 className="text-xl font-bold text-[#2bb5f6] tracking-tight">
                      Proforma Invoice
                    </h2>
                  </div>
                </div>

                {/* Two-Column Metadata Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-xs pt-2">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">PI No:</span>
                      <span className="col-span-2 font-bold font-mono text-slate-900">{viewingPi.piNo}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">LC No:</span>
                      <span className="col-span-2 font-bold font-mono text-slate-900">{viewingPi.lcNo || "—"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Supplier Name:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.supplier}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Shipment Terms:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.shipmentTerms || "CFR"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">PI Validity Date:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.piValidityDate || viewingPi.shipmentDate}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Currency:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.currency || "USD"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Port of Discharge:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.portOfDischarge || "Chittagong Port, Bangladesh"}</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">PI Date:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.piDate}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">LC Date:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.lcDate || "—"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Shipment Date:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.shipmentDate}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">PI Type:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.piType || "Non-Bond LC/PO"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Product Type:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.productType}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">Port of Loading:</span>
                      <span className="col-span-2 font-bold text-slate-900">{viewingPi.portOfLoading || "Nhava Sheva, India"}</span>
                    </div>
                  </div>
                </div>

                {/* PI Details Table Section */}
                <div className="space-y-1.5 pt-4">
                  <h3 className="text-xs italic font-medium text-slate-500">PI Details</h3>
                  
                  <div className="border border-slate-300 rounded-sm overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#cbd4dc] text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                          <th className="p-2.5 w-10 text-slate-700">#</th>
                          <th className="p-2.5 text-slate-700">ReqNums</th>
                          <th className="p-2.5 text-slate-700">ProductName</th>
                          <th className="p-2.5 text-slate-700">OriginName</th>
                          <th className="p-2.5 text-slate-700">Description</th>
                          <th className="p-2.5 text-right text-slate-700">Quantity</th>
                          <th className="p-2.5 text-right text-slate-700">Rate</th>
                          <th className="p-2.5 text-right text-slate-700">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {viewingPi.items && viewingPi.items.length > 0 ? (
                          viewingPi.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 text-slate-600 font-medium">{idx + 1}</td>
                              <td className="p-2.5 font-bold font-mono text-slate-900">{item.reqNo || viewingPi.reqNo || "399204"}</td>
                              <td className="p-2.5 font-bold text-slate-900">{item.productName || item.description || "Shade Cards & Bags"}</td>
                              <td className="p-2.5 text-slate-600">{item.originName || "India"}</td>
                              <td className="p-2.5 text-slate-600">{item.description}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900">{item.qty} {item.uom || "KG"}</td>
                              <td className="p-2.5 text-right font-mono text-slate-800">{(item.unitPrice ?? item.rate ?? 0).toFixed(2)}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900 font-mono">{item.total.toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr className="hover:bg-slate-50">
                            <td className="p-2.5 text-slate-600 font-medium">1</td>
                            <td className="p-2.5 font-bold font-mono text-slate-900">{viewingPi.reqNo || "399204"}</td>
                            <td className="p-2.5 font-bold text-slate-900">{viewingPi.productName || "Shade Cards & Bags"}</td>
                            <td className="p-2.5 text-slate-600">{viewingPi.originName || "India"}</td>
                            <td className="p-2.5 text-slate-600">Standard Dyes & Chemicals Batch</td>
                            <td className="p-2.5 text-right font-bold text-slate-900">88.000 KG</td>
                            <td className="p-2.5 text-right font-mono text-slate-800">1.00</td>
                            <td className="p-2.5 text-right font-bold text-slate-900 font-mono">88.00</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Remarks & Financial Summary Row */}
                  <div className="pt-3 flex flex-col sm:flex-row justify-between items-start text-xs border-t border-slate-200">
                    <div className="space-y-1 font-bold text-slate-800">
                      <span>Remarks : {viewingPi.remarks || "N/A"}</span>
                    </div>

                    <div className="w-full sm:w-64 space-y-2 pt-2 sm:pt-0">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                        <span className="font-bold text-slate-900">
                          {viewingPi.items && viewingPi.items.length > 0 
                            ? viewingPi.items.reduce((acc, i) => acc + i.qty, 0).toFixed(3)
                            : "88.000"}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-700">Total:</span>
                          <span className="font-bold font-mono text-slate-900">
                            {viewingPi.items && viewingPi.items.length > 0
                              ? viewingPi.items.reduce((acc, i) => acc + i.total, 0).toFixed(2)
                              : "88.00"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 text-slate-700">
                        <span className="font-medium">Upcharge:</span>
                        <span className="font-bold font-mono text-slate-900">{(viewingPi.upcharge || 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-end gap-4 text-slate-700 border-b border-slate-200 pb-1">
                        <span className="font-medium">Discount:</span>
                        <span className="font-bold font-mono text-slate-900">{(viewingPi.discount || 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-end gap-4 text-slate-900 font-black text-sm pt-0.5">
                        <span>Net Total:</span>
                        <span className="font-mono text-slate-900">
                          {viewingPi.items && viewingPi.items.length > 0
                            ? (viewingPi.items.reduce((acc, i) => acc + i.total, 0) + (viewingPi.upcharge || 0) - (viewingPi.discount || 0)).toFixed(2)
                            : "88.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signatures & Footer Verification */}
                <div className="pt-16 grid grid-cols-3 gap-6 text-center text-xs font-bold text-slate-700 print:pt-20">
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">Prepared By</p>
                    <p className="text-[10px] text-slate-500 font-normal">Commercial Executive</p>
                  </div>
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">Checked By</p>
                    <p className="text-[10px] text-slate-500 font-normal">Audit & Accounts</p>
                  </div>
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">Authorized Signature</p>
                    <p className="text-[10px] text-slate-500 font-normal">Head of Commercial</p>
                  </div>
                </div>

                {/* Print Footer note */}
                <div className="text-center text-[10px] text-slate-400 pt-6 border-t border-slate-100 print:block">
                  This is a computer-generated Proforma Invoice document from Pakiza HRIS &amp; ERP System.
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
