import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  SlidersHorizontal,
  ArrowLeft,
  Search,
  Check,
  Award,
  ShoppingCart,
  TrendingDown,
  ChevronDown,
  Printer,
  FileSpreadsheet,
  Building2,
  Sparkles,
  X,
} from "lucide-react";

export const Route = createFileRoute("/procurement-cs-detail")({
  head: () => ({
    meta: [
      { title: "Comparison Sheet (CS) Matrix Detail — CRIPTON Procurement" },
      { name: "description", content: "Dedicated full-page Comparison Sheet Matrix view console." },
    ],
  }),
  component: ProcurementCsDetailPage,
});

// Master 15 Items for Comprehensive Comparison
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
  "Dacca Accessories & Thread Ind.",
];

// Price dataset generator for 15 items
const generate15ItemPrices = (items: typeof FIFTEEN_ITEMS) => {
  const basePrices: Record<string, [number, number, number, number]> = {
    "IT-101": [3.40, 3.65, 3.80, 3.70],
    "IT-102": [1.80, 1.65, 1.95, 1.75],
    "IT-103": [6.20, 6.50, 5.90, 6.10],
    "IT-104": [1.20, 1.35, 1.40, 1.25],
    "IT-105": [0.12, 0.15, 0.14, 0.13],
    "IT-106": [0.08, 0.07, 0.09, 0.085],
    "IT-107": [1.45, 1.60, 1.50, 1.42],
    "IT-108": [0.05, 0.04, 0.06, 0.045],
    "IT-109": [0.03, 0.035, 0.028, 0.032],
    "IT-110": [0.02, 0.018, 0.025, 0.022],
    "IT-111": [0.25, 0.22, 0.28, 0.24],
    "IT-112": [0.18, 0.20, 0.16, 0.19],
    "IT-113": [1.10, 1.25, 1.15, 1.12],
    "IT-114": [0.30, 0.28, 0.35, 0.32],
    "IT-115": [0.015, 0.012, 0.018, 0.014],
  };

  return items.map((it) => {
    const tuple = basePrices[it.id] || [1.0, 1.1, 1.2, 1.15];
    const pricesObj: Record<string, number> = {
      "Zhejiang Yarn Spinning Co.": tuple[0],
      "Square Yarns & Threads Ltd": tuple[1],
      "Apex Textile Chemical Ltd": tuple[2],
      "Dacca Accessories & Thread Ind.": tuple[3],
    };

    let lowestVendor = CANDIDATE_VENDORS[0];
    let minP = Infinity;
    Object.entries(pricesObj).forEach(([v, p]) => {
      if (p < minP) {
        minP = p;
        lowestVendor = v;
      }
    });

    return {
      ...it,
      prices: pricesObj,
      selectedVendor: lowestVendor,
    };
  });
};

// Searchable Vendor Select Component
function SearchableVendorSelect({
  vendors,
  value,
  onChange,
}: {
  vendors: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => v.toLowerCase().includes(filterQuery.toLowerCase()));
  }, [vendors, filterQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-amber-500 rounded px-2.5 py-1 text-left text-[11px] font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between shadow-2xs cursor-pointer whitespace-nowrap"
      >
        <span className="truncate pr-1">{value || "Select Vendor..."}</span>
        <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 z-50 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl p-2 space-y-1 animate-in fade-in duration-100">
          <div className="relative mb-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search vendor..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filteredVendors.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  onChange(v);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium flex items-center justify-between cursor-pointer transition-colors ${
                  v === value
                    ? "bg-amber-500/10 text-amber-600 font-bold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="whitespace-nowrap">{v}</span>
                {v === value && <Check className="size-3 text-amber-500" />}
              </button>
            ))}
            {filteredVendors.length === 0 && (
              <div className="text-[11px] text-slate-400 p-2 text-center">No vendors found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProcurementCsDetailPage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const csId = searchParams.get("id") || "CS-2026-YRN4";

  const [csRecord, setCsRecord] = useState<any>(null);
  const [itemVendorChoices, setItemVendorChoices] = useState<Record<string, string>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("procurement_cs_records_v3");
      let allRecords: any[] = [];
      if (saved) {
        try {
          allRecords = JSON.parse(saved);
        } catch (e) {}
      }

      let found = allRecords.find((r) => r.id === csId);
      if (!found) {
        found = {
          id: csId,
          reqRef: "REQ-2026-091",
          category: "Garments Master Requisition (15 Items)",
          quotes: "4 Received",
          min: "$0.012 / Pcs",
          max: "$6.50 / Kg",
          winner: "Zhejiang Yarn Spinning Co.",
          status: "Under Review",
          vendors: CANDIDATE_VENDORS,
          items: generate15ItemPrices(FIFTEEN_ITEMS),
        };
      }

      setCsRecord(found);

      const initialChoices: Record<string, string> = {};
      if (found.items) {
        found.items.forEach((it: any) => {
          initialChoices[it.id] = it.selectedVendor || found.vendors[0];
        });
      }
      setItemVendorChoices(initialChoices);
    }
  }, [csId]);

  // Calculate Overall Cost Winner
  const matrixVendorTotals = useMemo(() => {
    if (!csRecord || !csRecord.items || !csRecord.vendors) return {};
    const totals: Record<string, number> = {};
    csRecord.vendors.forEach((v: string) => {
      totals[v] = 0;
    });

    csRecord.items.forEach((it: any) => {
      csRecord.vendors.forEach((v: string) => {
        const unitP = it.prices?.[v] || 0;
        totals[v] += unitP * (it.qty || 1);
      });
    });

    return totals;
  }, [csRecord]);

  const lowestVendorWinner = useMemo(() => {
    let minCost = Infinity;
    let winner = "";
    Object.entries(matrixVendorTotals).forEach(([v, cost]) => {
      if (cost > 0 && cost < minCost) {
        minCost = cost;
        winner = v;
      }
    });
    return winner;
  }, [matrixVendorTotals]);

  // Vendor PO breakdown summary for confirmation modal
  const selectedVendorBreakdown = useMemo(() => {
    if (!csRecord || !csRecord.items) return [];
    const groupings: Record<string, { itemCount: number; totalCost: number }> = {};

    csRecord.items.forEach((it: any) => {
      const chosenV = itemVendorChoices[it.id] || it.selectedVendor || csRecord.vendors[0];
      if (!groupings[chosenV]) {
        groupings[chosenV] = { itemCount: 0, totalCost: 0 };
      }
      groupings[chosenV].itemCount += 1;
      groupings[chosenV].totalCost += (it.prices[chosenV] || 0) * (it.qty || 1);
    });

    return Object.entries(groupings).map(([vName, data]) => ({
      vendorName: vName,
      itemCount: data.itemCount,
      totalCost: data.totalCost,
    }));
  }, [csRecord, itemVendorChoices]);

  // Execute Finalize CS & Auto-Create PO
  const executeFinalizeCs = () => {
    if (!csRecord) return;

    const vendorGroupings: Record<string, any[]> = {};
    csRecord.items.forEach((it: any) => {
      const chosenV = itemVendorChoices[it.id] || it.selectedVendor || csRecord.vendors[0];
      if (!vendorGroupings[chosenV]) {
        vendorGroupings[chosenV] = [];
      }
      vendorGroupings[chosenV].push(it);
    });

    const createdPoNumbers: string[] = [];
    let savedPos: any[] = [];
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("procurement_po_records");
      if (existing) {
        try {
          savedPos = JSON.parse(existing);
        } catch (e) {}
      }
    }

    Object.entries(vendorGroupings).forEach(([vendorName, itemsList]) => {
      const poNum = `PO-2026-00${Math.floor(484 + Math.random() * 500)}`;
      const totalVal = itemsList.reduce((acc, curr) => acc + (curr.prices[vendorName] || 0) * curr.qty, 0);

      const newPo = {
        id: (savedPos.length + 1).toString(),
        poNo: poNum,
        date: new Date().toISOString().slice(0, 10),
        supplier: vendorName,
        requisitionNo: csRecord.reqRef,
        totalValue: `$${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        deliveryDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
        status: "Approved",
      };

      savedPos.unshift(newPo);
      createdPoNumbers.push(`${poNum} → ${vendorName} ($${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })})`);
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("procurement_po_records", JSON.stringify(savedPos));
    }

    const updated = {
      ...csRecord,
      status: "Approved & PO Generated",
      winner: lowestVendorWinner || csRecord.winner,
    };
    setCsRecord(updated);

    if (typeof window !== "undefined") {
      const savedCs = localStorage.getItem("procurement_cs_records_v3");
      if (savedCs) {
        try {
          const parsed = JSON.parse(savedCs);
          const newCsList = parsed.map((c: any) => (c.id === csRecord.id ? updated : c));
          localStorage.setItem("procurement_cs_records_v3", JSON.stringify(newCsList));
        } catch (e) {}
      }
    }

    setIsConfirmModalOpen(false);
  };

  if (!csRecord) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading Comparison Sheet Matrix...</div>;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-x-hidden">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 w-full max-w-[1700px] mx-auto flex-1 flex flex-col">
          {/* Top Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate({ to: "/procurement-cs-batch-list" })}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Back to CS List"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="size-5.5 text-amber-500" />
                  Comparison Sheet Matrix: {csRecord.id}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                  {csRecord.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requisition Ref: <span className="font-bold text-slate-800 dark:text-slate-200">{csRecord.reqRef}</span> &bull; Category: {csRecord.category} &bull;{" "}
                <span className="text-emerald-600 font-bold">{csRecord.items?.length || 15} Items Loaded</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="h-9 px-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="size-3.5 text-blue-600" /> Print CS
              </button>
              {csRecord.status !== "Approved & PO Generated" && (
                <button
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <ShoppingCart className="size-4" />
                  Finalize CS & Auto-Create PO
                </button>
              )}
            </div>
          </div>

          {/* Slim Executive Winner Banner */}
          {lowestVendorWinner && (
            <div className="px-5 py-3 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs shrink-0 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Award className="size-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider">
                    RECOMMENDED OVERALL LOWEST COST WINNER
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {lowestVendorWinner}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Evaluated Items</div>
                  <div className="text-xs font-black text-slate-800 dark:text-slate-200">{csRecord.items?.length || 15} Items</div>
                </div>
                <div className="text-right border-l border-emerald-200 dark:border-emerald-800/80 pl-6">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Total CS Cost Quote</div>
                  <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <TrendingDown className="size-4 text-emerald-600" />
                    ${(matrixVendorTotals[lowestVendorWinner] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* High-Density Excel Spreadsheet Grid Container */}
          <div className="flex-1 min-h-0 border border-slate-300 dark:border-slate-800 rounded-xl shadow-sm bg-white dark:bg-slate-950 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse text-[11px] min-w-[1300px]">
                {/* Sticky Header */}
                <thead className="sticky top-0 z-30 bg-slate-200 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase border-b-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    {/* Fixed Left Columns */}
                    <th className="py-2 px-2 w-10 text-center border-r border-slate-300 dark:border-slate-700 bg-slate-300 dark:bg-slate-700 sticky left-0 z-40">
                      SL
                    </th>
                    <th className="py-2 px-3 w-80 border-r border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 sticky left-10 z-40 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                      ITEM DESCRIPTION & SPECIFICATION
                    </th>
                    <th className="py-2 px-2.5 w-24 border-r-2 border-slate-400 dark:border-slate-600 text-center bg-slate-200 dark:bg-slate-800 sticky left-[360px] z-40 shadow-[4px_0_6px_rgba(0,0,0,0.08)]">
                      REQ QTY
                    </th>

                    {/* Scrollable Vendor Columns */}
                    {csRecord.vendors.map((vName: string) => {
                      const isOverallWinner = vName === lowestVendorWinner;
                      return (
                        <th
                          key={vName}
                          className={`py-2 px-3 border-r border-slate-300 dark:border-slate-700 text-center whitespace-nowrap min-w-[220px] ${
                            isOverallWinner
                              ? "bg-emerald-200/90 text-emerald-950 dark:bg-emerald-900/80 dark:text-emerald-100"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <div className="font-extrabold text-xs whitespace-nowrap">{vName}</div>
                          {isOverallWinner && (
                            <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[8px] font-black bg-emerald-700 text-white uppercase tracking-wide">
                              ★ Lowest Total Winner
                            </span>
                          )}
                        </th>
                      );
                    })}

                    {/* Vendor Selection Column */}
                    <th className="py-2 px-3 w-64 text-center bg-amber-200/70 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-l border-slate-300 whitespace-nowrap">
                      VENDOR SELECTION (SEARCHABLE)
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {csRecord.items.map((it: any, index: number) => {
                    // Find lowest price for this row
                    let rowMinPrice = Infinity;
                    csRecord.vendors.forEach((v: string) => {
                      const price = it.prices?.[v] || 0;
                      if (price > 0 && price < rowMinPrice) {
                        rowMinPrice = price;
                      }
                    });

                    const selectedV = itemVendorChoices[it.id] || it.selectedVendor || csRecord.vendors[0];

                    return (
                      <tr key={it.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/60 transition-colors">
                        {/* Fixed Left Columns */}
                        <td className="py-1.5 px-2 text-center border-r border-slate-300 dark:border-slate-700 text-slate-500 font-normal bg-slate-100/70 dark:bg-slate-900 sticky left-0 z-20 text-[10px]">
                          {index + 1}
                        </td>
                        <td className="py-1.5 px-3 border-r border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 sticky left-10 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                          <div className="font-bold text-slate-900 dark:text-white truncate" title={`${it.name} (${it.spec})`}>
                            {it.name} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({it.spec})</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2.5 border-r-2 border-slate-400 dark:border-slate-600 text-center font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap bg-white dark:bg-slate-950 sticky left-[360px] z-20 shadow-[4px_0_6px_rgba(0,0,0,0.08)]">
                          {it.qty.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">{it.uom}</span>
                        </td>

                        {/* Vendor Price Cells - CLEAN COLORED CELL WITH NO INNER BOX */}
                        {csRecord.vendors.map((vName: string) => {
                          const price = it.prices?.[vName] || 0;
                          const isLowestRowPrice = Math.abs(price - rowMinPrice) < 0.0001 && price > 0;

                          return (
                            <td
                              key={vName}
                              className={`py-1.5 px-3 border-r border-slate-300 dark:border-slate-700 text-center font-mono text-xs whitespace-nowrap transition-colors ${
                                isLowestRowPrice
                                  ? "bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 font-black"
                                  : "text-slate-800 dark:text-slate-200"
                              }`}
                            >
                              {price > 0 ? `$${price.toFixed(3)}` : "N/A"}
                            </td>
                          );
                        })}

                        {/* Searchable Vendor Dropdown Cell */}
                        <td className="py-1.5 px-2 text-center bg-amber-50/20 dark:bg-amber-950/20 border-l border-slate-300">
                          <SearchableVendorSelect
                            vendors={csRecord.vendors}
                            value={selectedV}
                            onChange={(newV) =>
                              setItemVendorChoices((prev) => ({
                                ...prev,
                                [it.id]: newV,
                              }))
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Sticky Footer Vendor Totals */}
                <tfoot className="sticky bottom-0 z-30 bg-slate-200 dark:bg-slate-800 border-t-2 border-slate-400 dark:border-slate-600 font-black text-xs">
                  <tr>
                    <td className="py-2 px-2 text-center border-r border-slate-300 dark:border-slate-700 text-slate-500 bg-slate-300 dark:bg-slate-700 sticky left-0 z-40">
                      Σ
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800 sticky left-10 z-40 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                      OVERALL CS VENDOR COST TOTAL ({csRecord.items?.length || 15} ITEMS):
                    </td>
                    <td className="py-2 px-2.5 border-r-2 border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 sticky left-[360px] z-40 shadow-[4px_0_6px_rgba(0,0,0,0.08)]" />

                    {csRecord.vendors.map((vName: string) => {
                      const total = matrixVendorTotals[vName] || 0;
                      const isLowestTotal = vName === lowestVendorWinner;
                      return (
                        <td
                          key={vName}
                          className={`py-2 px-3 border-r border-slate-300 dark:border-slate-700 text-center font-mono text-sm whitespace-nowrap ${
                            isLowestTotal
                              ? "text-emerald-950 dark:text-emerald-100 bg-emerald-300 dark:bg-emerald-800 font-black"
                              : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      );
                    })}

                    <td className="py-2 px-3 text-center text-amber-900 dark:text-amber-300 text-[11px] font-black border-l border-slate-300">
                      Item Choices Applied
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ARE YOU SURE FINALIZATION CONFIRMATION MODAL             */}
        {/* ======================================================== */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                    <ShoppingCart className="size-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Confirm CS Finalization & Auto PO Generation
                  </h3>
                </div>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-xs">
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  Are you sure you want to finalize Comparison Sheet <strong className="text-slate-900 dark:text-white font-black">{csRecord.id}</strong> ({csRecord.reqRef})?
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Vendor Purchase Orders To Be Created:
                  </div>
                  <div className="space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedVendorBreakdown.map((item) => (
                      <div key={item.vendorName} className="pt-1.5 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{item.vendorName}</div>
                          <div className="text-[10px] text-slate-400">{item.itemCount} Items Assigned</div>
                        </div>
                        <div className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                          ${item.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                  ⚠️ Finalizing will mark this CS as Approved and automatically record official Purchase Orders in the PO registry.
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeFinalizeCs}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="size-4 stroke-[3]" />
                  Yes, Finalize & Create PO
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
