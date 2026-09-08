import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  SlidersHorizontal,
  Building2,
  Check,
  Search,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/procurement-cs-create-batch")({
  head: () => ({
    meta: [
      { title: "Create Comparison Sheet (CS) — CRIPTON Procurement" },
      { name: "description", content: "Create Comparison Sheet Setup dynamic console." },
    ],
  }),
  component: ProcurementCsCreateBatchPage,
});

const FIFTEEN_ITEMS = [
  { id: "IT-101", name: "30s Carded Cotton Yarn", spec: "100% Cotton 30/1 Ring Spun", uom: "Kg", qty: 12000 },
  { id: "IT-102", name: "Spun Polyester Thread 40/2", spec: "High Tenacity Optical White", uom: "Cone", qty: 3000 },
  { id: "IT-103", name: "Reactive Dye Blue B", spec: "High Fixation Rate 98%", uom: "Kg", qty: 2500 },
  { id: "IT-104", name: "Textile Softener Liquid", spec: "Non-Ionic Silicone Softener", uom: "Ltr", qty: 4000 },
  { id: "IT-105", name: "Metal Zipper #5 Brass", spec: "Antique Brass 70cm Auto Lock", uom: "Pcs", qty: 50000 },
  { id: "IT-106", name: "Engraved Metal Buttons", spec: "20mm Alloy Gunmetal Finish", uom: "Pcs", qty: 100000 },
  { id: "IT-107", name: "7-Ply Export Cartons", spec: "Heavy Duty Corrugated 60x40x40cm", uom: "Pcs", qty: 5000 },
  { id: "IT-108", name: "Self-Adhesive Polybags", spec: "LDPE Recyclable 12x15 Inch", uom: "Pcs", qty: 20000 },
  { id: "IT-109", name: "Woven Brand Labels", spec: "Damask Weave High Density 5x2cm", uom: "Pcs", qty: 80000 },
  { id: "IT-110", name: "Printed Care Labels", spec: "Satin Fabric 5-Language Print", uom: "Pcs", qty: 80000 },
  { id: "IT-111", name: "Elastic Band 1.5 Inch", spec: "Knitted Spandex Stretch 120%", uom: "Yds", qty: 15000 },
  { id: "IT-112", name: "Drawcord Cotton Rope", spec: "Tubular Braided 8mm Natural", uom: "Yds", qty: 10000 },
  { id: "IT-113", name: "Interlining Fuse Roll", spec: "Woven Microdot Coating 90gsm", uom: "Mtr", qty: 2000 },
  { id: "IT-114", name: "Plastic Hangers Heavy", spec: "Top Coat Hanger Black PP", uom: "Pcs", qty: 25000 },
  { id: "IT-115", name: "Barcoded Price Tags", spec: "350gsm Coated Cardstock UV", uom: "Pcs", qty: 80000 },
];

const CANDIDATE_VENDORS = [
  "Zhejiang Yarn Spinning Co.",
  "Square Yarns & Threads Ltd",
  "Apex Textile Chemical Ltd",
];

const CANDIDATE_VENDORS_POOL = [
  "Zhejiang Yarn Spinning Co.",
  "Square Yarns & Threads Ltd",
  "Apex Textile Chemical Ltd",
  "Pacific Metal & Trims Ltd",
  "Global Packaging Solutions Ltd",
  "Bengal Dye-Chem Industries",
];

const AVAILABLE_REQUISITIONS = [
  {
    reqNo: "REQ-2026-091",
    title: "Garments Master Raw Materials & Trims",
    dept: "Spinning & Accessories",
    items: FIFTEEN_ITEMS,
  },
  {
    reqNo: "REQ-2026-084",
    title: "Textile Dyes & Processing Auxiliaries",
    dept: "Dyeing Unit #2",
    items: [
      { id: "IT-103", name: "Reactive Dye Blue B", spec: "High Fixation Rate 98%", uom: "Kg", qty: 2500 },
      { id: "IT-104", name: "Textile Softener Liquid", spec: "Non-Ionic Silicone Softener", uom: "Ltr", qty: 4000 },
    ],
  },
  {
    reqNo: "REQ-2026-102",
    title: "Zippers, Buttons & Metal Trim Procurement",
    dept: "Garment Accessories",
    items: [
      { id: "IT-105", name: "Metal Zipper #5 Brass", spec: "Antique Brass 70cm Auto Lock", uom: "Pcs", qty: 50000 },
      { id: "IT-106", name: "Engraved Metal Buttons", spec: "20mm Alloy Gunmetal Finish", uom: "Pcs", qty: 100000 },
    ],
  },
  {
    reqNo: "REQ-2026-115",
    title: "Export Packaging & Barcoding Materials",
    dept: "Finishing & Packaging",
    items: [
      { id: "IT-107", name: "7-Ply Export Cartons", spec: "Heavy Duty Corrugated 60x40x40cm", uom: "Pcs", qty: 5000 },
      { id: "IT-108", name: "Self-Adhesive Polybags", spec: "LDPE Recyclable 12x15 Inch", uom: "Pcs", qty: 20000 },
      { id: "IT-115", name: "Barcoded Price Tags", spec: "350gsm Coated Cardstock UV", uom: "Pcs", qty: 80000 },
    ],
  },
];

function ProcurementCsCreateBatchPage() {
  const navigate = useNavigate();
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [selectedReqNos, setSelectedReqNos] = useState<string[]>(["REQ-2026-091"]);
  const [reqSearchQuery, setReqSearchQuery] = useState("");
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([...CANDIDATE_VENDORS]);
  const [vendorPrices, setVendorPrices] = useState<Record<string, Record<string, number>>>({});

  // Combined Items from all selected requisitions
  const combinedWizardItems = useMemo(() => {
    const itemMap = new Map<string, typeof FIFTEEN_ITEMS[0]>();
    AVAILABLE_REQUISITIONS.forEach((req) => {
      if (selectedReqNos.includes(req.reqNo)) {
        req.items.forEach((it) => {
          if (!itemMap.has(it.id)) {
            itemMap.set(it.id, it);
          }
        });
      }
    });
    return Array.from(itemMap.values());
  }, [selectedReqNos]);

  // Filtered Requisitions for Step 1
  const filteredRequisitions = useMemo(() => {
    return AVAILABLE_REQUISITIONS.filter((r) =>
      r.reqNo.toLowerCase().includes(reqSearchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(reqSearchQuery.toLowerCase()) ||
      r.dept.toLowerCase().includes(reqSearchQuery.toLowerCase())
    );
  }, [reqSearchQuery]);

  // Filtered Candidate Vendors for Step 2
  const filteredCandidateVendors = useMemo(() => {
    return CANDIDATE_VENDORS_POOL.filter((v) =>
      v.toLowerCase().includes(vendorSearchQuery.toLowerCase())
    );
  }, [vendorSearchQuery]);

  const toggleReqSelection = (reqNo: string) => {
    setSelectedReqNos((prev) => {
      if (prev.includes(reqNo)) {
        if (prev.length === 1) return prev; // Keep at least 1 selected
        return prev.filter((r) => r !== reqNo);
      }
      return [...prev, reqNo];
    });
  };

  const toggleVendorSelection = (vendorName: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorName)
        ? prev.filter((v) => v !== vendorName)
        : [...prev, vendorName]
    );
  };

  const handlePriceChange = (itemId: string, vendorName: string, priceStr: string) => {
    const val = parseFloat(priceStr) || 0;
    setVendorPrices((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [vendorName]: val,
      },
    }));
  };

  const handleCreateCsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const autoNum = Math.floor(1000 + Math.random() * 9000);
    const csId = `CS-2026-${autoNum}`;

    const compiledItems = combinedWizardItems.map((item) => {
      const itemPrices = vendorPrices[item.id] || {};
      let minVendor = selectedVendors[0] || "";
      let minPrice = Infinity;

      selectedVendors.forEach((v) => {
        const p = itemPrices[v] || 0;
        if (p > 0 && p < minPrice) {
          minPrice = p;
          minVendor = v;
        }
      });

      return {
        ...item,
        prices: itemPrices,
        selectedVendor: minVendor,
      };
    });

    const newCsRecord = {
      id: csId,
      reqRef: selectedReqNos.join(", "),
      category: `Combined Requisition (${compiledItems.length} Items)`,
      quotes: `${selectedVendors.length} Received`,
      min: "$0.01 / Pcs",
      max: "$6.50 / Kg",
      winner: selectedVendors[0] || "Pending Evaluation",
      status: "Under Review",
      vendors: selectedVendors,
      items: compiledItems,
    };

    let existingCs: any[] = [];
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("procurement_cs_records_v3");
      if (saved) {
        try {
          existingCs = JSON.parse(saved);
        } catch (e) {}
      }
      existingCs.unshift(newCsRecord);
      localStorage.setItem("procurement_cs_records_v3", JSON.stringify(existingCs));
    }

    navigate({ to: "/procurement-cs-batch-list" });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <SlidersHorizontal className="size-5.5 text-amber-500" />
                Create New Comparison Sheet (CS)
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Procurement Workspace &gt; Comparison Sheet &gt;{" "}
                <span className="text-amber-500 font-semibold">Create New CS Wizard</span>
              </p>
            </div>
            <button
              onClick={() => navigate({ to: "/procurement-cs-batch-list" })}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Back to CS List
            </button>
          </div>

          {/* Card Wizard */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
            {/* Step Header */}
            <div className="grid grid-cols-3 border-b border-border text-xs font-bold text-center bg-slate-50 dark:bg-slate-900">
              <div
                className={`py-3 flex items-center justify-center gap-2 border-r border-border ${
                  wizardStep === 1 ? "bg-amber-500/10 text-amber-600 border-b-2 border-b-amber-500" : "text-slate-400"
                }`}
              >
                <span className="size-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Step 1: Multi-Select Requisitions
              </div>
              <div
                className={`py-3 flex items-center justify-center gap-2 border-r border-border ${
                  wizardStep === 2 ? "bg-amber-500/10 text-amber-600 border-b-2 border-b-amber-500" : "text-slate-400"
                }`}
              >
                <span className="size-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Step 2: Select Candidate Vendors
              </div>
              <div
                className={`py-3 flex items-center justify-center gap-2 ${
                  wizardStep === 3 ? "bg-amber-500/10 text-amber-600 border-b-2 border-b-amber-500" : "text-slate-400"
                }`}
              >
                <span className="size-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                Step 3: Enter Side-by-Side Quotations
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Search & Multi-Select Requisitions
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Select one or multiple requisitions to combine their items into a single Comparison Sheet.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs shrink-0">
                      {selectedReqNos.length} Requisition(s) Selected &bull; {combinedWizardItems.length} Items Loaded
                    </span>
                  </div>

                  {/* Search input */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Requisition No (e.g. REQ-2026-091), Title, Department..."
                      value={reqSearchQuery}
                      onChange={(e) => setReqSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 h-9 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  {/* Requisition Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs bg-white dark:bg-slate-900">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                        <tr>
                          <th className="p-2.5 w-12 text-center">SELECT</th>
                          <th className="p-2.5">REQ NO</th>
                          <th className="p-2.5">REQUISITION TITLE</th>
                          <th className="p-2.5">DEPARTMENT</th>
                          <th className="p-2.5 text-right">ITEMS COUNT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredRequisitions.map((req) => {
                          const isChecked = selectedReqNos.includes(req.reqNo);
                          return (
                            <tr
                              key={req.reqNo}
                              onClick={() => toggleReqSelection(req.reqNo)}
                              className={`cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-amber-50/60 dark:bg-amber-950/20 font-medium"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-850"
                              }`}
                            >
                              <td className="p-2.5 text-center">
                                <div
                                  className={`size-4.5 rounded border mx-auto flex items-center justify-center ${
                                    isChecked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"
                                  }`}
                                >
                                  {isChecked && <Check className="size-3 stroke-[3]" />}
                                </div>
                              </td>
                              <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">{req.reqNo}</td>
                              <td className="p-2.5 font-bold text-slate-900 dark:text-white">{req.title}</td>
                              <td className="p-2.5 text-slate-500">{req.dept}</td>
                              <td className="p-2.5 text-right font-bold text-amber-600">{req.items.length} Items</td>
                            </tr>
                          );
                        })}
                        {filteredRequisitions.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-slate-400 text-xs">
                              No matching requisitions found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Loaded Items */}
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                      <Layers className="size-4 text-amber-500" />
                      Combined Items Preview ({combinedWizardItems.length} Items Loaded):
                    </div>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase sticky top-0">
                          <tr>
                            <th className="p-2 w-12 text-center">SL</th>
                            <th className="p-2">Item Code</th>
                            <th className="p-2">Item Description</th>
                            <th className="p-2">Specification</th>
                            <th className="p-2">UOM</th>
                            <th className="p-2 text-right">Required Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                          {combinedWizardItems.map((it, idx) => (
                            <tr key={it.id}>
                              <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-800 dark:text-slate-200">{it.id}</td>
                              <td className="p-2 font-semibold text-slate-800 dark:text-slate-200">{it.name}</td>
                              <td className="p-2 text-slate-500">{it.spec}</td>
                              <td className="p-2 text-slate-500">{it.uom}</td>
                              <td className="p-2 text-right font-bold text-amber-600">{it.qty.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Search & Select Candidate Vendors
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Search and choose candidate vendors to compare side-by-side in the quotation matrix.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs shrink-0">
                      {selectedVendors.length} Vendor(s) Selected
                    </span>
                  </div>

                  {/* Vendor Search Bar */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Candidate Vendor Name (e.g. Zhejiang, Square, Apex)..."
                      value={vendorSearchQuery}
                      onChange={(e) => setVendorSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 h-9 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  {/* Vendor Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredCandidateVendors.map((vName) => {
                      const isChecked = selectedVendors.includes(vName);
                      return (
                        <div
                          key={vName}
                          onClick={() => toggleVendorSelection(vName)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            isChecked
                              ? "border-amber-500 bg-amber-50/50 dark:bg-amber-500/10 shadow-xs"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <Building2 className={`size-4 shrink-0 ${isChecked ? "text-amber-500" : "text-slate-400"}`} />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{vName}</span>
                          </div>
                          <div
                            className={`size-4.5 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {isChecked && <Check className="size-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                    {filteredCandidateVendors.length === 0 && (
                      <div className="col-span-full p-6 text-center text-slate-400 text-xs">
                        No candidate vendors found matching "{vendorSearchQuery}".
                      </div>
                    )}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Enter Side-by-Side Quoted Prices
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Input unit prices for each item across candidate vendors.
                      </p>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                      {combinedWizardItems.length}-Item Matrix Grid &bull; {selectedVendors.length} Vendors
                    </span>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto max-h-[450px]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-3 w-56 border-r border-slate-200">Item Name & Spec</th>
                          <th className="p-3 w-24 border-r border-slate-200 text-center">Req Qty</th>
                          {selectedVendors.map((v) => (
                            <th key={v} className="p-3 border-r border-slate-200 text-center bg-amber-50/50 dark:bg-amber-950/30">
                              {v}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white dark:bg-slate-900">
                        {combinedWizardItems.map((it) => (
                          <tr key={it.id}>
                            <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                              <div className="font-bold text-slate-900 dark:text-white">{it.name}</div>
                              <div className="text-[10px] text-slate-400">{it.spec} ({it.uom})</div>
                            </td>
                            <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-700 dark:text-slate-300">
                              {it.qty.toLocaleString()} {it.uom}
                            </td>
                            {selectedVendors.map((vName) => {
                              const currentPrice = vendorPrices[it.id]?.[vName] || "";
                              return (
                                <td key={vName} className="p-3 border-r border-slate-200 dark:border-slate-800 text-center bg-slate-50/30 dark:bg-slate-900/30">
                                  <div className="relative flex items-center justify-center">
                                    <span className="absolute left-2 text-slate-400 text-xs font-bold">$</span>
                                    <input
                                      type="number"
                                      step="0.001"
                                      placeholder="0.00"
                                      value={currentPrice}
                                      onChange={(e) => handlePriceChange(it.id, vName, e.target.value)}
                                      className="w-24 pl-5 pr-2 py-1 text-xs font-bold text-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded focus:border-amber-500 focus:outline-none"
                                    />
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-slate-50 flex justify-between items-center">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {wizardStep < 3 ? (
                <button
                  type="button"
                  disabled={wizardStep === 2 && selectedVendors.length < 2}
                  onClick={() => setWizardStep((prev) => (prev + 1) as any)}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  Next Step <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateCsSubmit}
                  className="px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="size-4 stroke-[3]" /> Create CS ({combinedWizardItems.length} Items)
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
