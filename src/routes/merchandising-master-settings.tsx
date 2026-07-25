import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Settings,
  Plus,
  Search,
  Users,
  Layers,
  Percent,
  Package,
  CheckCircle,
  Pencil,
  Trash2,
  Save,
  Filter,
  X,
  Building2,
  Globe,
  DollarSign,
  FileText,
  AlertTriangle,
  Ruler,
  Calculator,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-master-settings")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "buyers",
    };
  },
  head: () => ({
    meta: [
      { title: "Master Settings — RMG Merchandising" },
      { name: "description", content: "Master setup for RMG buyers, fabric library, yarn specs, and process loss percentages." },
    ],
  }),
  component: MerchandisingMasterSettingsPage,
});

// Interfaces
interface BuyerSetting {
  id: string;
  shortCode: string;
  buyerName: string;
  buyingHouse: string;
  country: string;
  aqlStandard: string;
  payTerms: string;
  currency: string;
  contactEmail: string;
  status: "Active" | "Inactive";
}

interface FabricSpec {
  id: string;
  fabricType: string;
  construction: string;
  yarnCount: string;
  composition: string;
  gsm: number;
  spandexPct: number;
  shrinkagePct: string;
}

interface ProcessLoss {
  id: string;
  garmentType: string;
  knittingLossPct: number;
  dyeingLossPct: number;
  cuttingLossPct: number;
  printWashLossPct: number;
}

interface TrimsMaster {
  id: string;
  itemCode: string;
  itemName: string;
  category: "Sewing Trims" | "Packing Trims";
  subCategory: string;
  uom: string;
  unitPriceUsd: number;
  nominatedSupplier: string;
}

interface SpecParameter {
  id: string;
  paramName: string;
  category: "Body Part" | "Size Group" | "Special Requirement";
  defaultValue: string;
}

// Initial Mock Data
const initialBuyers: BuyerSetting[] = [
  { id: "b-1", shortCode: "ITPS", buyerName: "ITPS Sourcing Group", buyingHouse: "ITPS BD Sourcing", country: "United Kingdom", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", contactEmail: "buyer@itps-uk.com", status: "Active" },
  { id: "b-2", shortCode: "AML", buyerName: "A-M-London Fashion Ltd", buyingHouse: "London Buying Group", country: "United Kingdom", aqlStandard: "AQL 1.5", payTerms: "90 Days LC", currency: "USD", contactEmail: "sourcing@am-london.co.uk", status: "Active" },
  { id: "b-3", shortCode: "NORD", buyerName: "Nordic Wear AS", buyingHouse: "Scandi Trading Ltd", country: "Norway", aqlStandard: "AQL 2.5", payTerms: "At Sight LC", currency: "EUR", contactEmail: "po@nordicwear.no", status: "Active" },
  { id: "b-4", shortCode: "ZARA", buyerName: "Inditex Zara BD", buyingHouse: "Inditex Dhaka Office", country: "Spain", aqlStandard: "AQL 1.5", payTerms: "90 Days BBLC", currency: "EUR", contactEmail: "zara-bd@inditex.es", status: "Active" },
];

const initialFabrics: FabricSpec[] = [
  { id: "f-1", fabricType: "Single Jersey", construction: "28 Gauge", yarnCount: "30s/1 Combed", composition: "100% Cotton", gsm: 160, spandexPct: 0, shrinkagePct: "L: -3%, W: -2%" },
  { id: "f-2", fabricType: "1x1 Rib", construction: "18 Gauge", yarnCount: "30s/1 Carded", composition: "95% Cotton 5% Spandex", gsm: 220, spandexPct: 5, shrinkagePct: "L: -4%, W: -3%" },
  { id: "f-3", fabricType: "2/1 Twill Woven", construction: "133 x 72", yarnCount: "40s x 40s", composition: "98% Cotton 2% Spandex", gsm: 240, spandexPct: 2, shrinkagePct: "L: -2%, W: -1%" },
  { id: "f-4", fabricType: "Heavy Fleece (Brushed)", construction: "20 Gauge", yarnCount: "20s/1 + 10s/1 Poly", composition: "80% Cotton 20% Polyester", gsm: 300, spandexPct: 0, shrinkagePct: "L: -3%, W: -3%" },
];

const initialProcessLoss: ProcessLoss[] = [
  { id: "pl-1", garmentType: "Basic T-Shirt (Knit)", knittingLossPct: 3.0, dyeingLossPct: 4.5, cuttingLossPct: 2.5, printWashLossPct: 2.0 },
  { id: "pl-2", garmentType: "Polo Shirt (Pique Knit)", knittingLossPct: 3.5, dyeingLossPct: 5.0, cuttingLossPct: 3.0, printWashLossPct: 2.5 },
  { id: "pl-3", garmentType: "Chino Pants (Woven)", knittingLossPct: 0.0, dyeingLossPct: 3.0, cuttingLossPct: 4.0, printWashLossPct: 3.5 },
  { id: "pl-4", garmentType: "Hooded Sweatshirt (Heavy Knit)", knittingLossPct: 3.5, dyeingLossPct: 5.5, cuttingLossPct: 3.0, printWashLossPct: 3.0 },
];

const initialTrims: TrimsMaster[] = [
  { id: "t-1", itemCode: "TRM-THD-01", itemName: "100% Spun Polyester Thread 40/2", category: "Sewing Trims", subCategory: "Sewing Thread", uom: "Cone (4000m)", unitPriceUsd: 1.45, nominatedSupplier: "Coats Bangladesh" },
  { id: "t-2", itemCode: "TRM-LBL-02", itemName: "Woven Main Label (Damask HD)", category: "Sewing Trims", subCategory: "Labels", uom: "Pcs", unitPriceUsd: 0.035, nominatedSupplier: "Avery Dennison BD" },
  { id: "t-3", itemCode: "TRM-PLY-03", itemName: "Self-Seal Polybag (12x18 inch)", category: "Packing Trims", subCategory: "Polybags", uom: "Pcs", unitPriceUsd: 0.042, nominatedSupplier: "Kazi Poly Ltd" },
  { id: "t-4", itemCode: "TRM-CTN-04", itemName: "7-Ply Master Shipping Carton", category: "Packing Trims", subCategory: "Cartons", uom: "Pcs", unitPriceUsd: 0.85, nominatedSupplier: "Mir Carton Ltd" },
  { id: "t-5", itemCode: "TRM-ZIP-05", itemName: "#5 Nylon Open-End Metal Zipper", category: "Sewing Trims", subCategory: "Zippers", uom: "Pcs", unitPriceUsd: 0.28, nominatedSupplier: "YKK Bangladesh Ltd" },
];

const initialSpecs: SpecParameter[] = [
  { id: "sp-1", paramName: "Chest Width (1/2 Chest)", category: "Body Part", defaultValue: "54.0 cm" },
  { id: "sp-2", paramName: "Body Length from HPS", category: "Body Part", defaultValue: "72.0 cm" },
  { id: "sp-3", paramName: "Standard Adult Size Range", category: "Size Group", defaultValue: "S, M, L, XL, XXL" },
  { id: "sp-4", paramName: "OEKO-TEX Standard 100 Certified", category: "Special Requirement", defaultValue: "Mandatory Class 1" },
];

function MerchandisingMasterSettingsPage() {
  const search = Route.useSearch();
  const searchTab = search?.tab || "buyers";

  const [activeTab, setActiveTab] = useState<"buyers" | "fabrics" | "specs" | "loss" | "financial">(
    (searchTab as any) || "buyers"
  );

  useEffect(() => {
    if (searchTab) {
      // Map 'trims' to 'financial' if passed
      if (searchTab === "trims") {
        setActiveTab("financial");
      } else if (["buyers", "fabrics", "specs", "loss", "financial"].includes(searchTab)) {
        setActiveTab(searchTab as any);
      }
    }
  }, [searchTab]);

  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [buyers, setBuyers] = useState<BuyerSetting[]>(initialBuyers);
  const [fabrics, setFabrics] = useState<FabricSpec[]>(initialFabrics);
  const [processLosses, setProcessLosses] = useState<ProcessLoss[]>(initialProcessLoss);
  const [trims, setTrims] = useState<TrimsMaster[]>(initialTrims);
  const [specs, setSpecs] = useState<SpecParameter[]>(initialSpecs);

  // Financial Config States
  const [cpmRateUsd, setCpmRateUsd] = useState(0.085); // Cost per minute ($)
  const [commercialLossPct, setCommercialLossPct] = useState(2.5); // %
  const [bankInterestPct, setBankInterestPct] = useState(4.0); // %
  const [targetMarginPct, setTargetMarginPct] = useState(12.0); // %

  // Modal States
  const [buyerModal, setBuyerModal] = useState<{ open: boolean; item?: BuyerSetting }>({ open: false });
  const [fabricModal, setFabricModal] = useState<{ open: boolean; item?: FabricSpec }>({ open: false });
  const [lossModal, setLossModal] = useState<{ open: boolean; item?: ProcessLoss }>({ open: false });
  const [trimsModal, setTrimsModal] = useState<{ open: boolean; item?: TrimsMaster }>({ open: false });
  const [specModal, setSpecModal] = useState<{ open: boolean; item?: SpecParameter }>({ open: false });

  // Form Field States
  const [buyerForm, setBuyerForm] = useState<Partial<BuyerSetting>>({
    shortCode: "",
    buyerName: "",
    buyingHouse: "",
    country: "United Kingdom",
    aqlStandard: "AQL 2.5",
    payTerms: "120 Days BBLC",
    currency: "USD",
    contactEmail: "",
    status: "Active",
  });

  const [fabricForm, setFabricForm] = useState<Partial<FabricSpec>>({
    fabricType: "Single Jersey",
    construction: "",
    yarnCount: "",
    composition: "100% Cotton",
    gsm: 180,
    spandexPct: 0,
    shrinkagePct: "L: -3%, W: -2%",
  });

  const [lossForm, setLossForm] = useState<Partial<ProcessLoss>>({
    garmentType: "",
    knittingLossPct: 3.0,
    dyeingLossPct: 4.5,
    cuttingLossPct: 2.5,
    printWashLossPct: 2.0,
  });

  const [trimsForm, setTrimsForm] = useState<Partial<TrimsMaster>>({
    itemCode: "",
    itemName: "",
    category: "Sewing Trims",
    subCategory: "Sewing Thread",
    uom: "Pcs",
    unitPriceUsd: 0.05,
    nominatedSupplier: "",
  });

  const [specForm, setSpecForm] = useState<Partial<SpecParameter>>({
    paramName: "",
    category: "Body Part",
    defaultValue: "",
  });

  // --- BUYER ACTIONS ---
  const handleOpenBuyerModal = (item?: BuyerSetting) => {
    if (item) {
      setBuyerForm(item);
      setBuyerModal({ open: true, item });
    } else {
      setBuyerForm({
        shortCode: "",
        buyerName: "",
        buyingHouse: "",
        country: "United Kingdom",
        aqlStandard: "AQL 2.5",
        payTerms: "120 Days BBLC",
        currency: "USD",
        contactEmail: "",
        status: "Active",
      });
      setBuyerModal({ open: true });
    }
  };

  const handleSaveBuyer = () => {
    if (!buyerForm.buyerName?.trim()) {
      toast.error("Buyer Name is required");
      return;
    }

    if (buyerModal.item) {
      setBuyers(prev => prev.map(b => b.id === buyerModal.item!.id ? ({ ...b, ...buyerForm } as BuyerSetting) : b));
      toast.success(`Buyer ${buyerForm.buyerName} updated successfully!`);
    } else {
      const newB: BuyerSetting = {
        id: `b-${Date.now()}`,
        shortCode: buyerForm.shortCode || buyerForm.buyerName.substring(0, 4).toUpperCase(),
        buyerName: buyerForm.buyerName,
        buyingHouse: buyerForm.buyingHouse || "Direct Buyer",
        country: buyerForm.country || "Bangladesh",
        aqlStandard: buyerForm.aqlStandard || "AQL 2.5",
        payTerms: buyerForm.payTerms || "120 Days BBLC",
        currency: buyerForm.currency || "USD",
        contactEmail: buyerForm.contactEmail || "info@buyer.com",
        status: buyerForm.status || "Active",
      };
      setBuyers([newB, ...buyers]);
      toast.success(`New Buyer ${newB.buyerName} registered!`);
    }
    setBuyerModal({ open: false });
  };

  const handleDeleteBuyer = (id: string) => {
    setBuyers(prev => prev.filter(b => b.id !== id));
    toast.success("Buyer removed from master database");
  };

  // --- FABRIC SPEC ACTIONS ---
  const handleOpenFabricModal = (item?: FabricSpec) => {
    if (item) {
      setFabricForm(item);
      setFabricModal({ open: true, item });
    } else {
      setFabricForm({ fabricType: "Single Jersey", construction: "", yarnCount: "", composition: "100% Cotton", gsm: 180, spandexPct: 0, shrinkagePct: "L: -3%, W: -2%" });
      setFabricModal({ open: true });
    }
  };

  const handleSaveFabric = () => {
    if (!fabricForm.fabricType?.trim()) {
      toast.error("Fabric Type is required");
      return;
    }
    if (fabricModal.item) {
      setFabrics(prev => prev.map(f => f.id === fabricModal.item!.id ? ({ ...f, ...fabricForm } as FabricSpec) : f));
      toast.success("Fabric Spec updated!");
    } else {
      const newF: FabricSpec = {
        id: `f-${Date.now()}`,
        fabricType: fabricForm.fabricType || "Single Jersey",
        construction: fabricForm.construction || "28 Gauge",
        yarnCount: fabricForm.yarnCount || "30s/1 Combed",
        composition: fabricForm.composition || "100% Cotton",
        gsm: Number(fabricForm.gsm) || 180,
        spandexPct: Number(fabricForm.spandexPct) || 0,
        shrinkagePct: fabricForm.shrinkagePct || "L: -3%, W: -2%",
      };
      setFabrics([newF, ...fabrics]);
      toast.success("New Fabric Spec registered!");
    }
    setFabricModal({ open: false });
  };

  const handleDeleteFabric = (id: string) => {
    setFabrics(prev => prev.filter(f => f.id !== id));
    toast.success("Fabric Spec deleted");
  };

  // --- PROCESS LOSS ACTIONS ---
  const handleOpenLossModal = (item?: ProcessLoss) => {
    if (item) {
      setLossForm(item);
      setLossModal({ open: true, item });
    } else {
      setLossForm({ garmentType: "", knittingLossPct: 3.0, dyeingLossPct: 4.5, cuttingLossPct: 2.5, printWashLossPct: 2.0 });
      setLossModal({ open: true });
    }
  };

  const handleSaveLoss = () => {
    if (!lossForm.garmentType?.trim()) {
      toast.error("Garment Category is required");
      return;
    }
    if (lossModal.item) {
      setProcessLosses(prev => prev.map(l => l.id === lossModal.item!.id ? ({ ...l, ...lossForm } as ProcessLoss) : l));
      toast.success("Process Loss matrix updated!");
    } else {
      const newL: ProcessLoss = {
        id: `pl-${Date.now()}`,
        garmentType: lossForm.garmentType,
        knittingLossPct: Number(lossForm.knittingLossPct) || 0,
        dyeingLossPct: Number(lossForm.dyeingLossPct) || 0,
        cuttingLossPct: Number(lossForm.cuttingLossPct) || 0,
        printWashLossPct: Number(lossForm.printWashLossPct) || 0,
      };
      setProcessLosses([newL, ...processLosses]);
      toast.success("New Process Loss rule added!");
    }
    setLossModal({ open: false });
  };

  const handleDeleteLoss = (id: string) => {
    setProcessLosses(prev => prev.filter(l => l.id !== id));
    toast.success("Process Loss rule removed");
  };

  // --- TRIMS ACTIONS ---
  const handleOpenTrimsModal = (item?: TrimsMaster) => {
    if (item) {
      setTrimsForm(item);
      setTrimsModal({ open: true, item });
    } else {
      setTrimsForm({ itemCode: "", itemName: "", category: "Sewing Trims", subCategory: "Sewing Thread", uom: "Pcs", unitPriceUsd: 0.05, nominatedSupplier: "" });
      setTrimsModal({ open: true });
    }
  };

  const handleSaveTrims = () => {
    if (!trimsForm.itemName?.trim()) {
      toast.error("Trims Item Name is required");
      return;
    }
    if (trimsModal.item) {
      setTrims(prev => prev.map(t => t.id === trimsModal.item!.id ? ({ ...t, ...trimsForm } as TrimsMaster) : t));
      toast.success("Trims item updated!");
    } else {
      const newT: TrimsMaster = {
        id: `t-${Date.now()}`,
        itemCode: trimsForm.itemCode || `TRM-${Math.floor(100 + Math.random() * 900)}`,
        itemName: trimsForm.itemName,
        category: trimsForm.category || "Sewing Trims",
        subCategory: trimsForm.subCategory || "General",
        uom: trimsForm.uom || "Pcs",
        unitPriceUsd: Number(trimsForm.unitPriceUsd) || 0.05,
        nominatedSupplier: trimsForm.nominatedSupplier || "Local Nominated",
      };
      setTrims([newT, ...trims]);
      toast.success("New Trims item added to catalog!");
    }
    setTrimsModal({ open: false });
  };

  const handleDeleteTrims = (id: string) => {
    setTrims(prev => prev.filter(t => t.id !== id));
    toast.success("Trims item deleted");
  };

  // --- SPECS ACTIONS ---
  const handleOpenSpecModal = (item?: SpecParameter) => {
    if (item) {
      setSpecForm(item);
      setSpecModal({ open: true, item });
    } else {
      setSpecForm({ paramName: "", category: "Body Part", defaultValue: "" });
      setSpecModal({ open: true });
    }
  };

  const handleSaveSpec = () => {
    if (!specForm.paramName?.trim()) {
      toast.error("Parameter Name is required");
      return;
    }
    if (specModal.item) {
      setSpecs(prev => prev.map(s => s.id === specModal.item!.id ? ({ ...s, ...specForm } as SpecParameter) : s));
      toast.success("Specification Parameter updated!");
    } else {
      const newS: SpecParameter = {
        id: `sp-${Date.now()}`,
        paramName: specForm.paramName,
        category: specForm.category || "Body Part",
        defaultValue: specForm.defaultValue || "-",
      };
      setSpecs([newS, ...specs]);
      toast.success("New Spec Parameter added!");
    }
    setSpecModal({ open: false });
  };

  const handleDeleteSpec = (id: string) => {
    setSpecs(prev => prev.filter(s => s.id !== id));
    toast.success("Parameter removed");
  };

  // Filtered queries
  const filteredBuyers = buyers.filter(b =>
    b.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.buyingHouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFabrics = fabrics.filter(f =>
    f.fabricType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.yarnCount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.composition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLosses = processLosses.filter(l =>
    l.garmentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrims = trims.filter(t =>
    t.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nominatedSupplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpecs = specs.filter(s =>
    s.paramName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MerchandisingLayout
      activePath="masterSettings"
      breadcrumbs={[{ label: "Master Settings" }, { label: activeTab.toUpperCase() }]}
      title="RMG Master Configurations Suite"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Settings className="size-5" /></span>
              RMG Master Database & Parameters
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage global configurations for Buyers, Material Specs, Measurement Parameters, Process Loss, and Financial CPM</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-xl">
              ✓ Merchandising Master DB Live
            </span>
          </div>
        </div>

        {/* Tab Selection Navigation & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "buyers", label: "Company & Buyer Setup", icon: Users, count: buyers.length },
              { id: "fabrics", label: "Material Library (Yarn/Fabric)", icon: Layers, count: fabrics.length },
              { id: "specs", label: "Specifications & Parameters", icon: Ruler, count: specs.length },
              { id: "loss", label: "Process & Loss Setup %", icon: Percent, count: processLosses.length },
              { id: "financial", label: "Financial Config & Trims", icon: Calculator, count: trims.length },
            ].map((t) => {
              const Icon = t.icon;
              const isSel = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id as any);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                    isSel
                      ? "bg-teal-500 text-white shadow-md shadow-teal-500/15"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSel ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
        </div>

        {/* TAB 1: BUYER SETUP */}
        {activeTab === "buyers" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Registered RMG Buyers ({filteredBuyers.length})</span>
              <button
                onClick={() => handleOpenBuyerModal()}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={14} /> Register New Buyer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Buyer Name</th>
                    <th className="px-4 py-3">Buying House / Agent</th>
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3">AQL Standard</th>
                    <th className="px-4 py-3">Payment Term</th>
                    <th className="px-4 py-3">Currency</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                  {filteredBuyers.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono font-bold text-slate-400">{b.shortCode}</td>
                      <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">{b.buyerName}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{b.buyingHouse}</td>
                      <td className="px-4 py-3">{b.country}</td>
                      <td className="px-4 py-3 font-mono">{b.aqlStandard}</td>
                      <td className="px-4 py-3">{b.payTerms}</td>
                      <td className="px-4 py-3 font-mono font-bold">{b.currency}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          b.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-500"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenBuyerModal(b)}
                            className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteBuyer(b.id)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FABRIC & YARN SPECS */}
        {activeTab === "fabrics" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Fabric & Yarn Specification Master Library ({filteredFabrics.length})</span>
              <button
                onClick={() => handleOpenFabricModal()}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={14} /> Add Fabric Spec
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Fabric Type</th>
                    <th className="px-4 py-3">Construction</th>
                    <th className="px-4 py-3">Yarn Count</th>
                    <th className="px-4 py-3">Composition</th>
                    <th className="px-4 py-3 text-right">Standard GSM</th>
                    <th className="px-4 py-3 text-right">Spandex %</th>
                    <th className="px-4 py-3">Shrinkage %</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                  {filteredFabrics.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{f.fabricType}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.construction}</td>
                      <td className="px-4 py-3 font-mono text-teal-600 dark:text-teal-400 font-bold">{f.yarnCount}</td>
                      <td className="px-4 py-3">{f.composition}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">{f.gsm} gsm</td>
                      <td className="px-4 py-3 text-right font-mono">{f.spandexPct}%</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{f.shrinkagePct}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenFabricModal(f)}
                            className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteFabric(f.id)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SPECIFICATIONS & PARAMETERS */}
        {activeTab === "specs" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Garment Specifications & Size Groups Master ({filteredSpecs.length})</span>
              <button
                onClick={() => handleOpenSpecModal()}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={14} /> Add Parameter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Parameter / Part Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Default Standard Value</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                  {filteredSpecs.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.paramName}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                          {s.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-teal-600 dark:text-teal-400 font-bold">{s.defaultValue}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenSpecModal(s)}
                            className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSpec(s.id)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PROCESS LOSS MATRIX */}
        {activeTab === "loss" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">Garment Process Loss Matrix %</span>
                <span className="text-[10px] text-slate-400">Default wastage margins for material requirement calculations</span>
              </div>
              <button
                onClick={() => handleOpenLossModal()}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={14} /> Add Garment Loss Rule
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Garment Category</th>
                    <th className="px-4 py-3 text-right">Knitting Loss %</th>
                    <th className="px-4 py-3 text-right">Dyeing Loss %</th>
                    <th className="px-4 py-3 text-right">Cutting Loss %</th>
                    <th className="px-4 py-3 text-right">Print/Wash Loss %</th>
                    <th className="px-4 py-3 text-right">Total Est. Loss %</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                  {filteredLosses.map((pl) => {
                    const totalLoss = pl.knittingLossPct + pl.dyeingLossPct + pl.cuttingLossPct + pl.printWashLossPct;
                    return (
                      <tr key={pl.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{pl.garmentType}</td>
                        <td className="px-4 py-3 text-right font-mono">{pl.knittingLossPct}%</td>
                        <td className="px-4 py-3 text-right font-mono">{pl.dyeingLossPct}%</td>
                        <td className="px-4 py-3 text-right font-mono">{pl.cuttingLossPct}%</td>
                        <td className="px-4 py-3 text-right font-mono">{pl.printWashLossPct}%</td>
                        <td className="px-4 py-3 text-right font-mono font-black text-rose-500">{totalLoss.toFixed(1)}%</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenLossModal(pl)}
                              className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteLoss(pl.id)}
                              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL CONFIG & TRIMS */}
        {activeTab === "financial" && (
          <div className="space-y-6">
            {/* CPM & Overhead Config Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Calculator className="size-4 text-teal-500" /> Costing Configuration (CPM & Commercial Overhead)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Cost Per Minute (CPM USD)</label>
                  <input
                    type="number"
                    step="0.005"
                    value={cpmRateUsd}
                    onChange={(e) => setCpmRateUsd(Number(e.target.value))}
                    className="w-full text-sm font-black px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-teal-600 dark:text-teal-400 font-mono"
                  />
                  <span className="text-[9px] text-slate-400">Used for factory CM pricing formula</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Commercial Overhead %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={commercialLossPct}
                    onChange={(e) => setCommercialLossPct(Number(e.target.value))}
                    className="w-full text-sm font-black px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 font-mono"
                  />
                  <span className="text-[9px] text-slate-400">Default BBLC & port clearance %</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Bank Interest & L/C %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={bankInterestPct}
                    onChange={(e) => setBankInterestPct(Number(e.target.value))}
                    className="w-full text-sm font-black px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 font-mono"
                  />
                  <span className="text-[9px] text-slate-400">LC opening charge & interest</span>
                </div>

                <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl space-y-1">
                  <label className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">Target Net Profit Margin %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={targetMarginPct}
                    onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                    className="w-full text-sm font-black px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-teal-500/30 rounded-lg text-teal-600 dark:text-teal-400 font-mono"
                  />
                  <span className="text-[9px] text-teal-600/70 font-semibold">Minimum profit margin rule</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => toast.success("Financial CPM & Commercial Overhead parameters saved!")}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} /> SAVE FINANCIAL PARAMETERS
                </button>
              </div>
            </div>

            {/* Trims Master Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Trims & Accessories Master Catalog ({filteredTrims.length})</span>
                <button
                  onClick={() => handleOpenTrimsModal()}
                  className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus size={14} /> Add Trims Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Item Description</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">UOM</th>
                      <th className="px-4 py-3 text-right">Unit Price (USD)</th>
                      <th className="px-4 py-3">Nominated Supplier</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                    {filteredTrims.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono font-bold text-slate-400">{t.itemCode}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{t.itemName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                            t.category === "Sewing Trims"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                          }`}>
                            {t.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">{t.uom}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-teal-600 dark:text-teal-400">${t.unitPriceUsd.toFixed(3)}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t.nominatedSupplier}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenTrimsModal(t)}
                              className="p-1 text-slate-500 hover:text-teal-500 hover:bg-slate-100 rounded transition cursor-pointer"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTrims(t.id)}
                              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: BUYER MODAL */}
        {buyerModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="size-4 text-teal-500" />
                  {buyerModal.item ? "Edit Buyer Configuration" : "Register New Buyer"}
                </h3>
                <button onClick={() => setBuyerModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Buyer Short Code</label>
                    <input
                      type="text"
                      placeholder="e.g. ZARA"
                      value={buyerForm.shortCode}
                      onChange={(e) => setBuyerForm({ ...buyerForm, shortCode: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Buyer Name *</label>
                    <input
                      type="text"
                      placeholder="Full Buyer Name"
                      value={buyerForm.buyerName}
                      onChange={(e) => setBuyerForm({ ...buyerForm, buyerName: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Buying House / Agent</label>
                    <input
                      type="text"
                      placeholder="Agent or Direct"
                      value={buyerForm.buyingHouse}
                      onChange={(e) => setBuyerForm({ ...buyerForm, buyingHouse: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Country</label>
                    <input
                      type="text"
                      placeholder="Country of Origin"
                      value={buyerForm.country}
                      onChange={(e) => setBuyerForm({ ...buyerForm, country: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">AQL Standard</label>
                    <select
                      value={buyerForm.aqlStandard}
                      onChange={(e) => setBuyerForm({ ...buyerForm, aqlStandard: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="AQL 1.5">AQL 1.5 Strict</option>
                      <option value="AQL 2.5">AQL 2.5 Standard</option>
                      <option value="AQL 4.0">AQL 4.0 Relaxed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Pay Terms</label>
                    <select
                      value={buyerForm.payTerms}
                      onChange={(e) => setBuyerForm({ ...buyerForm, payTerms: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="120 Days BBLC">120 Days BBLC</option>
                      <option value="90 Days BBLC">90 Days BBLC</option>
                      <option value="At Sight LC">At Sight LC</option>
                      <option value="TT Transfer">TT Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Currency</label>
                    <select
                      value={buyerForm.currency}
                      onChange={(e) => setBuyerForm({ ...buyerForm, currency: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="BDT">BDT (৳)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Contact Email</label>
                  <input
                    type="email"
                    placeholder="buyer@domain.com"
                    value={buyerForm.contactEmail}
                    onChange={(e) => setBuyerForm({ ...buyerForm, contactEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setBuyerModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveBuyer}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE BUYER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: FABRIC SPEC MODAL */}
        {fabricModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Layers className="size-4 text-teal-500" />
                  {fabricModal.item ? "Edit Fabric Spec" : "Add New Fabric Spec"}
                </h3>
                <button onClick={() => setFabricModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Fabric Type *</label>
                    <input
                      type="text"
                      placeholder="e.g. Single Jersey, 2/1 Twill"
                      value={fabricForm.fabricType}
                      onChange={(e) => setFabricForm({ ...fabricForm, fabricType: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Construction / Gauge</label>
                    <input
                      type="text"
                      placeholder="e.g. 28 Gauge or 133x72"
                      value={fabricForm.construction}
                      onChange={(e) => setFabricForm({ ...fabricForm, construction: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Yarn Count</label>
                    <input
                      type="text"
                      placeholder="e.g. 30s/1 Combed"
                      value={fabricForm.yarnCount}
                      onChange={(e) => setFabricForm({ ...fabricForm, yarnCount: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Composition</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Cotton"
                      value={fabricForm.composition}
                      onChange={(e) => setFabricForm({ ...fabricForm, composition: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Standard GSM</label>
                    <input
                      type="number"
                      value={fabricForm.gsm}
                      onChange={(e) => setFabricForm({ ...fabricForm, gsm: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Spandex %</label>
                    <input
                      type="number"
                      value={fabricForm.spandexPct}
                      onChange={(e) => setFabricForm({ ...fabricForm, spandexPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Shrinkage %</label>
                    <input
                      type="text"
                      value={fabricForm.shrinkagePct}
                      onChange={(e) => setFabricForm({ ...fabricForm, shrinkagePct: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setFabricModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveFabric}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE SPEC
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: SPEC PARAMETER MODAL */}
        {specModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Ruler className="size-4 text-teal-500" />
                  {specModal.item ? "Edit Specification Parameter" : "Add Specification Parameter"}
                </h3>
                <button onClick={() => setSpecModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Parameter / Part Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Chest Width (1/2 Chest)"
                    value={specForm.paramName}
                    onChange={(e) => setSpecForm({ ...specForm, paramName: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Category</label>
                    <select
                      value={specForm.category}
                      onChange={(e) => setSpecForm({ ...specForm, category: e.target.value as any })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="Body Part">Body Part</option>
                      <option value="Size Group">Size Group</option>
                      <option value="Special Requirement">Special Requirement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Standard Value</label>
                    <input
                      type="text"
                      placeholder="e.g. 54.0 cm or S, M, L"
                      value={specForm.defaultValue}
                      onChange={(e) => setSpecForm({ ...specForm, defaultValue: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setSpecModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveSpec}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE PARAMETER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: PROCESS LOSS MODAL */}
        {lossModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Percent className="size-4 text-teal-500" />
                  {lossModal.item ? "Edit Process Loss Rule" : "Add Process Loss Rule"}
                </h3>
                <button onClick={() => setLossModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Garment Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Basic T-Shirt (Knit)"
                    value={lossForm.garmentType}
                    onChange={(e) => setLossForm({ ...lossForm, garmentType: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Knitting/Weaving Loss %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.knittingLossPct}
                      onChange={(e) => setLossForm({ ...lossForm, knittingLossPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Dyeing & Finish Loss %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.dyeingLossPct}
                      onChange={(e) => setLossForm({ ...lossForm, dyeingLossPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Cutting Loss %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.cuttingLossPct}
                      onChange={(e) => setLossForm({ ...lossForm, cuttingLossPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Print/Wash Loss %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.printWashLossPct}
                      onChange={(e) => setLossForm({ ...lossForm, printWashLossPct: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setLossModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveLoss}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE LOSS RULE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: TRIMS MODAL */}
        {trimsModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <Package className="size-4 text-teal-500" />
                  {trimsModal.item ? "Edit Trims Item" : "Add New Trims Item"}
                </h3>
                <button onClick={() => setTrimsModal({ open: false })} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Item Code</label>
                    <input
                      type="text"
                      placeholder="e.g. TRM-THD-01"
                      value={trimsForm.itemCode}
                      onChange={(e) => setTrimsForm({ ...trimsForm, itemCode: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Category</label>
                    <select
                      value={trimsForm.category}
                      onChange={(e) => setTrimsForm({ ...trimsForm, category: e.target.value as any })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      <option value="Sewing Trims">Sewing Trims</option>
                      <option value="Packing Trims">Packing Trims</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Item Description *</label>
                  <input
                    type="text"
                    placeholder="Full Trims Description"
                    value={trimsForm.itemName}
                    onChange={(e) => setTrimsForm({ ...trimsForm, itemName: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">UOM</label>
                    <input
                      type="text"
                      placeholder="e.g. Cone, Pcs, Dzn"
                      value={trimsForm.uom}
                      onChange={(e) => setTrimsForm({ ...trimsForm, uom: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={trimsForm.unitPriceUsd}
                      onChange={(e) => setTrimsForm({ ...trimsForm, unitPriceUsd: Number(e.target.value) })}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Supplier</label>
                    <input
                      type="text"
                      placeholder="Nominated Supplier"
                      value={trimsForm.nominatedSupplier}
                      onChange={(e) => setTrimsForm({ ...trimsForm, nominatedSupplier: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button
                  onClick={() => setTrimsModal({ open: false })}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleSaveTrims}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition cursor-pointer"
                >
                  SAVE TRIMS ITEM
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
