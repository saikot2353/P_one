import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Plus,
  Trash2,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Check,
  Eye,
  Building2,
  Layers,
  Award,
  ShoppingCart,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/procurement-cs-batch-list")({
  head: () => ({
    meta: [
      { title: "Comparison Sheet (CS) List — CRIPTON Procurement" },
      { name: "description", content: "Procurement Comparison Sheet (CS) management list console." },
    ],
  }),
  component: ProcurementCsBatchListPage,
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

// Price dataset generator for 15 items
const generate15ItemPrices = (items: typeof FIFTEEN_ITEMS) => {
  const basePrices: Record<string, [number, number, number]> = {
    "IT-101": [3.40, 3.65, 3.80],
    "IT-102": [1.80, 1.65, 1.95],
    "IT-103": [6.20, 6.50, 5.90],
    "IT-104": [1.20, 1.35, 1.40],
    "IT-105": [0.12, 0.15, 0.14],
    "IT-106": [0.08, 0.07, 0.09],
    "IT-107": [1.45, 1.60, 1.50],
    "IT-108": [0.05, 0.04, 0.06],
    "IT-109": [0.03, 0.035, 0.028],
    "IT-110": [0.02, 0.018, 0.025],
    "IT-111": [0.25, 0.22, 0.28],
    "IT-112": [0.18, 0.20, 0.16],
    "IT-113": [1.10, 1.25, 1.15],
    "IT-114": [0.30, 0.28, 0.35],
    "IT-115": [0.015, 0.012, 0.018],
  };

  return items.map((it) => {
    const tuple = basePrices[it.id] || [1.0, 1.1, 1.2];
    const pricesObj: Record<string, number> = {
      "Zhejiang Yarn Spinning Co.": tuple[0],
      "Square Yarns & Threads Ltd": tuple[1],
      "Apex Textile Chemical Ltd": tuple[2],
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

export function ProcurementCsBatchListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const initialCsData = [
    {
      id: "CS-2026-YRN4",
      reqRef: "REQ-2026-091",
      category: "Garments Master Requisition (15 Items)",
      quotes: "3 Received",
      min: "$0.012 / Pcs",
      max: "$6.50 / Kg",
      winner: "Zhejiang Yarn Spinning Co.",
      status: "Under Review",
      vendors: CANDIDATE_VENDORS,
      items: generate15ItemPrices(FIFTEEN_ITEMS),
    },
    {
      id: "CS-2026-CHM12",
      reqRef: "REQ-2026-084",
      category: "Textile Dyes & Auxiliaries",
      quotes: "3 Received",
      min: "৳620.00 / Kg",
      max: "৳690.00 / Kg",
      winner: "Apex Textile Chemical Ltd",
      status: "Approved & PO Generated",
      vendors: ["Apex Textile Chemical Ltd", "Square Yarns & Threads Ltd", "Zhejiang Yarn Spinning Co."],
      items: generate15ItemPrices(FIFTEEN_ITEMS.slice(2, 6)),
    },
    {
      id: "CS-2026-ACC09",
      reqRef: "REQ-2026-102",
      category: "Zippers & Metal Trim",
      quotes: "3 Received",
      min: "$0.08 / Pcs",
      max: "$0.18 / Pcs",
      winner: "Square Yarns & Threads Ltd",
      status: "Workorder Issued",
      vendors: ["Square Yarns & Threads Ltd", "Zhejiang Yarn Spinning Co.", "Apex Textile Chemical Ltd"],
      items: generate15ItemPrices(FIFTEEN_ITEMS.slice(4, 8)),
    },
  ];

  const [tableData, setTableData] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("procurement_cs_records_v3");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return initialCsData;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("procurement_cs_records_v3", JSON.stringify(tableData));
    }
  }, [tableData]);

  // Create CS Wizard Modal state
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [selectedReqNos, setSelectedReqNos] = useState<string[]>(["REQ-2026-091"]);
  const [reqSearchQuery, setReqSearchQuery] = useState("");
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([...CANDIDATE_VENDORS]);
  const [wizardItemPrices, setWizardItemPrices] = useState<Record<string, Record<string, number>>>({});

  // View Matrix Modal state
  const [activeCsMatrix, setActiveCsMatrix] = useState<any | null>(null);
  const [itemVendorChoices, setItemVendorChoices] = useState<Record<string, string>>({});

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

  // Search Filter
  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [tableData, searchQuery]);

  // Open Create CS Wizard
  const openCreateWizard = () => {
    setWizardStep(1);
    setSelectedReqNos(["REQ-2026-091"]);
    setReqSearchQuery("");
    setVendorSearchQuery("");
    setSelectedVendors([...CANDIDATE_VENDORS]);
    setWizardItemPrices({});
    setIsCreateWizardOpen(true);
  };

  // Toggle Requisition selection in Wizard
  const toggleReqSelection = (reqNo: string) => {
    setSelectedReqNos((prev) => {
      if (prev.includes(reqNo)) {
        if (prev.length === 1) return prev; // Keep at least 1 selected
        return prev.filter((r) => r !== reqNo);
      }
      return [...prev, reqNo];
    });
  };

  // Toggle Vendor selection in Wizard
  const toggleVendorSelection = (vendorName: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorName)
        ? prev.filter((v) => v !== vendorName)
        : [...prev, vendorName]
    );
  };

  // Price input change in wizard
  const handlePriceChange = (itemId: string, vendorName: string, priceStr: string) => {
    const val = parseFloat(priceStr) || 0;
    setWizardItemPrices((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [vendorName]: val,
      },
    }));
  };

  // Finish Create CS
  const handleSaveNewCs = (e: React.FormEvent) => {
    e.preventDefault();
    const autoNum = Math.floor(1000 + Math.random() * 9000);
    const csId = `CS-2026-${autoNum}`;

    const compiledItems = combinedWizardItems.map((item) => {
      const itemPrices = wizardItemPrices[item.id] || {};
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

    setTableData((prev) => [newCsRecord, ...prev]);
    setIsCreateWizardOpen(false);
  };

  // Open Matrix in Dedicated New Tab / Page
  const openMatrixModal = (cs: any) => {
    if (typeof window !== "undefined") {
      window.open(`/procurement-cs-detail?id=${encodeURIComponent(cs.id)}`, "_blank");
    }
  };

  // Calculate Overall Cost Winner in Matrix Modal
  const matrixVendorTotals = useMemo(() => {
    if (!activeCsMatrix || !activeCsMatrix.items || !activeCsMatrix.vendors) return {};
    const totals: Record<string, number> = {};
    activeCsMatrix.vendors.forEach((v: string) => {
      totals[v] = 0;
    });

    activeCsMatrix.items.forEach((it: any) => {
      activeCsMatrix.vendors.forEach((v: string) => {
        const unitP = it.prices?.[v] || 0;
        totals[v] += unitP * (it.qty || 1);
      });
    });

    return totals;
  }, [activeCsMatrix]);

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

  // Finalize CS & Auto-Create PO
  const handleFinalizeCsAndCreatePo = () => {
    if (!activeCsMatrix) return;

    const vendorGroupings: Record<string, any[]> = {};
    activeCsMatrix.items.forEach((it: any) => {
      const chosenV = itemVendorChoices[it.id] || it.selectedVendor || activeCsMatrix.vendors[0];
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
        requisitionNo: activeCsMatrix.reqRef,
        totalValue: `$${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        deliveryDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
        status: "Approved",
      };

      savedPos.unshift(newPo);
      createdPoNumbers.push(`${poNum} → ${vendorName} ($${totalVal.toLocaleString()})`);
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("procurement_po_records", JSON.stringify(savedPos));
    }

    setTableData((prev) =>
      prev.map((cs) =>
        cs.id === activeCsMatrix.id
          ? {
              ...cs,
              status: "Approved & PO Generated",
              winner: lowestVendorWinner || cs.winner,
            }
          : cs
      )
    );

    alert(`Comparison Sheet Finalized Successfully!\n\nAuto-Generated Purchase Orders:\n` + createdPoNumbers.join("\n"));
    setActiveCsMatrix(null);
  };

  const handleDeleteCs = (id: string) => {
    if (confirm("Are you sure you want to delete this CS record?")) {
      setTableData((prev) => prev.filter((item) => item.id !== id));
    }
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
                Comparison Sheet (CS) Registry
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Procurement Workspace &gt; Comparison Sheet &gt;{" "}
                <span className="text-amber-500 font-semibold">CS List</span>
              </p>
            </div>
            <button
              onClick={openCreateWizard}
              className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="size-4" />
              Create New CS
            </button>
          </div>

          {/* Main CS Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel
                </button>
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs">
                  <Printer className="size-3.5 text-blue-600" /> Print
                </button>
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs">
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search CS No, Requisition, Vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-3 h-[32px] bg-[#f8fafc] border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 dark:bg-slate-800">
                    <th className="px-4 py-2.5 font-semibold w-12 text-center border-r border-slate-100">SL</th>
                    <th className="px-4 py-2.5 font-semibold w-24 text-center border-r border-slate-100">ACTIONS</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">CS NUMBER</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">REQUISITION REF</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">ITEM CATEGORY</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">ITEMS COUNT</th>
                    <th className="px-4 py-2.5 font-semibold border-r border-slate-100">LOWEST / WINNER VENDOR</th>
                    <th className="px-4 py-2.5 font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal text-slate-700 dark:text-slate-200 bg-white dark:bg-transparent">
                  {filteredData.map((row: any, index: number) => (
                    <tr key={row.id || index} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                      <td className="px-4 py-2.5 text-center border-r border-slate-100 text-slate-500 font-normal">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2.5 text-center border-r border-slate-100 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openMatrixModal(row)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 transition border border-emerald-200/80 shadow-2xs cursor-pointer"
                            title="View Side-by-Side Comparison Matrix"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCs(row.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition cursor-pointer"
                            title="Delete CS"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 font-bold text-slate-900 dark:text-white">
                        {row.id}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 text-blue-600 font-medium">
                        {row.reqRef}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100">
                        {row.category}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 font-bold text-slate-700 dark:text-slate-300">
                        {row.items?.length || 15} Items
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 font-medium text-slate-800 dark:text-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Award className="size-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{row.winner}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                            row.status.includes("Approved") || row.status.includes("Issued")
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : row.status === "Under Review"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-muted-foreground font-semibold">
                        No Comparison Sheets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
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

        {/* ======================================================== */}
        {/* STEP-BY-STEP CREATE CS WIZARD MODAL                      */}
        {/* ======================================================== */}
        {isCreateWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-5xl rounded-xl shadow-2xl border border-border/80 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-slate-50 dark:bg-slate-900 shrink-0">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Plus className="size-4.5 text-amber-500" />
                    Create New Comparison Sheet (CS)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Step {wizardStep} of 3 &bull; Select Requisition &bull; Select Candidate Vendors &bull; Enter Quotations
                  </p>
                </div>
                <button onClick={() => setIsCreateWizardOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X className="size-5" />
                </button>
              </div>

              {/* Progress Steps Header */}
              <div className="grid grid-cols-3 border-b border-slate-200 text-[11px] font-bold text-center bg-white dark:bg-slate-950">
                <div
                  className={`py-2.5 border-r border-slate-200 flex items-center justify-center gap-2 ${
                    wizardStep === 1 ? "bg-amber-500/10 text-amber-600 border-b-2 border-b-amber-500" : "text-slate-400"
                  }`}
                >
                  <span className="size-4.5 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center">1</span>
                  15-Item Requisition
                </div>
                <div
                  className={`py-2.5 border-r border-slate-200 flex items-center justify-center gap-2 ${
                    wizardStep === 2 ? "bg-amber-500/10 text-amber-600 border-b-2 border-b-amber-500" : "text-slate-400"
                  }`}
                >
                  <span className="size-4.5 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center">2</span>
                  Select Vendors
                </div>
                <div
                  className={`py-2.5 flex items-center justify-center gap-2 ${
                    wizardStep === 3 ? "bg-amber-500/10 text-amber-600 border-b-2 border-b-amber-500" : "text-slate-400"
                  }`}
                >
                  <span className="size-4.5 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center">3</span>
                  Enter Vendor Prices
                </div>
              </div>

              {/* Wizard Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Step 1: Search & Multi-Select Requisitions
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Select one or multiple requisitions to combine their items into a single Comparison Sheet.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs shrink-0">
                        {selectedReqNos.length} Requisition(s) Selected &bull; {combinedWizardItems.length} Items Loaded
                      </span>
                    </div>

                    {/* Requisition Search Bar */}
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

                    {/* Requisition Multi-Select Grid/Table */}
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

                    {/* Loaded Combined Items Table */}
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
                          Step 2: Search & Select Candidate Vendors
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
                          Step 3: Enter Side-by-Side Quoted Prices
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
                                const currentPrice = wizardItemPrices[it.id]?.[vName] || "";
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

              {/* Wizard Footer Controls */}
              <div className="p-4 border-t border-border bg-slate-50 dark:bg-slate-900 flex justify-between items-center shrink-0">
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
                    onClick={handleSaveNewCs}
                    className="px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Check className="size-4 stroke-[3]" /> Create CS ({combinedWizardItems.length} Items)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ULTRA-COMPACT EXCEL-STYLE DENSE SPREADSHEET MATRIX MODAL */}
        {/* ======================================================== */}
        {activeCsMatrix && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-7xl rounded-xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col max-h-[96vh]">
              {/* Ultra-Compact Modal Header */}
              <div className="flex justify-between items-center px-4 py-2 border-b border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    CS
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Comparison Matrix: {activeCsMatrix.id}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase">
                      {activeCsMatrix.status}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Requisition: <span className="font-bold text-slate-700 dark:text-slate-300">{activeCsMatrix.reqRef}</span> ({activeCsMatrix.items?.length || 15} Items)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCsMatrix(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Slim Executive Winner Banner Strip */}
              {lowestVendorWinner && (
                <div className="px-4 py-2 bg-emerald-500/10 dark:bg-emerald-950/40 border-b border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-2">
                    <Award className="size-4 text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">
                      RECOMMENDED OVERALL LOWEST COST WINNER:
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-xs">
                      {lowestVendorWinner}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-[10px] text-slate-500">Evaluated: <strong className="text-slate-800 dark:text-slate-200">{activeCsMatrix.items?.length || 15} Items</strong></span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black flex items-center gap-1 text-sm">
                      <TrendingDown className="size-4 text-emerald-600" />
                      ${(matrixVendorTotals[lowestVendorWinner] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              {/* Compact Body Content */}
              <div className="flex-1 overflow-hidden p-3 flex flex-col">
                {/* Excel-Style Dense Grid Table Container */}
                <div className="flex-1 overflow-auto border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs bg-white dark:bg-slate-950">
                  <table className="w-full text-left border-collapse text-[11px] min-w-[1000px]">
                    <thead className="sticky top-0 z-20 bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase border-b border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="py-1.5 px-2 w-10 text-center border-r border-slate-300 dark:border-slate-700 bg-slate-300 dark:bg-slate-700">SL</th>
                        <th className="py-1.5 px-2.5 w-72 border-r border-slate-300 dark:border-slate-700">ITEM DESCRIPTION & SPECIFICATION</th>
                        <th className="py-1.5 px-2 w-20 border-r border-slate-300 dark:border-slate-700 text-center">REQ QTY</th>
                        {activeCsMatrix.vendors.map((vName: string) => {
                          const isOverallWinner = vName === lowestVendorWinner;
                          return (
                            <th
                              key={vName}
                              className={`py-1.5 px-2 border-r border-slate-300 dark:border-slate-700 text-center ${
                                isOverallWinner
                                  ? "bg-emerald-200/90 text-emerald-950 dark:bg-emerald-900/80 dark:text-emerald-100"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                              }`}
                            >
                              <div className="font-extrabold text-[11px] truncate">{vName}</div>
                              {isOverallWinner && (
                                <span className="inline-block px-1.5 py-0.2 rounded text-[8px] font-black bg-emerald-700 text-white uppercase">
                                  ★ Winner
                                </span>
                              )}
                            </th>
                          );
                        })}
                        <th className="py-1.5 px-2 w-48 text-center bg-amber-200/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-l border-slate-300">
                          VENDOR SELECTION
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {activeCsMatrix.items.map((it: any, index: number) => {
                        // Calculate row minimum price
                        let rowMinPrice = Infinity;
                        activeCsMatrix.vendors.forEach((v: string) => {
                          const price = it.prices?.[v] || 0;
                          if (price > 0 && price < rowMinPrice) {
                            rowMinPrice = price;
                          }
                        });

                        const selectedV = itemVendorChoices[it.id] || it.selectedVendor || activeCsMatrix.vendors[0];

                        return (
                          <tr key={it.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/60 transition-colors">
                            <td className="py-1 px-2 text-center border-r border-slate-300 dark:border-slate-700 text-slate-500 font-normal bg-slate-50/50 dark:bg-slate-900/50 text-[10px]">
                              {index + 1}
                            </td>
                            <td className="py-1 px-2.5 border-r border-slate-300 dark:border-slate-700">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {it.name} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({it.spec})</span>
                              </div>
                            </td>
                            <td className="py-1 px-2 border-r border-slate-300 dark:border-slate-700 text-center font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                              {it.qty.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">{it.uom}</span>
                            </td>

                            {/* Vendor Price Cells - Inline Clean Highlight */}
                            {activeCsMatrix.vendors.map((vName: string) => {
                              const price = it.prices?.[vName] || 0;
                              const isLowestRowPrice = Math.abs(price - rowMinPrice) < 0.0001 && price > 0;

                              return (
                                <td
                                  key={vName}
                                  className={`py-1 px-2 border-r border-slate-300 dark:border-slate-700 text-center font-mono text-[11px] whitespace-nowrap ${
                                    isLowestRowPrice
                                      ? "bg-emerald-100/90 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-200 font-black"
                                      : "text-slate-800 dark:text-slate-200"
                                  }`}
                                >
                                  {isLowestRowPrice ? (
                                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-200/90 dark:bg-emerald-900 border border-emerald-400 text-emerald-950 dark:text-emerald-100 font-black shadow-2xs">
                                      <span>★</span> ${price.toFixed(3)}
                                    </div>
                                  ) : (
                                    <span>{price > 0 ? `$${price.toFixed(3)}` : "N/A"}</span>
                                  )}
                                </td>
                              );
                            })}

                            {/* Excel-Style Compact Vendor Selector */}
                            <td className="py-1 px-1.5 text-center bg-amber-50/30 dark:bg-amber-950/20">
                              <select
                                value={selectedV}
                                onChange={(e) =>
                                  setItemVendorChoices((prev) => ({
                                    ...prev,
                                    [it.id]: e.target.value,
                                  }))
                                }
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-amber-500 focus:border-amber-500 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-800 dark:text-slate-100 outline-none h-6 cursor-pointer"
                              >
                                {activeCsMatrix.vendors.map((v: string) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {/* Sticky Footer Vendor Totals */}
                    <tfoot className="sticky bottom-0 z-20 bg-slate-200 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700 font-black text-[11px]">
                      <tr>
                        <td className="py-1.5 px-2 text-center border-r border-slate-300 dark:border-slate-700 text-slate-500 bg-slate-300 dark:bg-slate-700">Σ</td>
                        <td className="py-1.5 px-2.5 border-r border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" colSpan={2}>
                          OVERALL CS VENDOR TOTAL ({activeCsMatrix.items?.length || 15} ITEMS):
                        </td>
                        {activeCsMatrix.vendors.map((vName: string) => {
                          const total = matrixVendorTotals[vName] || 0;
                          const isLowestTotal = vName === lowestVendorWinner;
                          return (
                            <td
                              key={vName}
                              className={`py-1.5 px-2 border-r border-slate-300 dark:border-slate-700 text-center font-mono text-xs ${
                                isLowestTotal
                                  ? "text-emerald-950 dark:text-emerald-200 bg-emerald-300 dark:bg-emerald-900 font-black"
                                  : "text-slate-900 dark:text-slate-100"
                              }`}
                            >
                              ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          );
                        })}
                        <td className="py-1.5 px-2 text-center text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                          Item Choices Applied
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="px-4 py-2 border-t border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex justify-between items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveCsMatrix(null)}
                  className="px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  Close Matrix
                </button>

                {activeCsMatrix.status !== "Approved & PO Generated" && (
                  <button
                    type="button"
                    onClick={handleFinalizeCsAndCreatePo}
                    className="px-5 py-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <ShoppingCart className="size-4" />
                    Finalize CS & Auto-Create PO
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
