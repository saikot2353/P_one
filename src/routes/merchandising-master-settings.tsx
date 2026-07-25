import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-master-settings")({
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
  buyerName: string;
  buyingHouse: string;
  aqlStandard: string;
  payTerms: string;
  currency: string;
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
  itemName: string;
  category: "Sewing Trims" | "Packing Trims";
  uom: string;
  unitPriceUsd: number;
  nominatedSupplier: string;
}

// Initial Mock Data
const initialBuyers: BuyerSetting[] = [
  { id: "b-1", buyerName: "ITPS", buyingHouse: "ITPS Sourcing BD", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD", status: "Active" },
  { id: "b-2", buyerName: "A-M-London Fashion Ltd", buyingHouse: "London Buying Group", aqlStandard: "AQL 1.5", payTerms: "90 Days LC", currency: "USD", status: "Active" },
  { id: "b-3", buyerName: "Nordic Wear AS", buyingHouse: "Scandi Trading Ltd", aqlStandard: "AQL 2.5", payTerms: "At Sight LC", currency: "EUR", status: "Active" },
];

const initialFabrics: FabricSpec[] = [
  { id: "f-1", fabricType: "Single Jersey", construction: "28 Gauge", yarnCount: "30s/1 Combed", composition: "100% Cotton", gsm: 160, spandexPct: 0 },
  { id: "f-2", fabricType: "1x1 Rib", construction: "18 Gauge", yarnCount: "30s/1 Carded", composition: "95% Cotton 5% Spandex", gsm: 220, spandexPct: 5 },
  { id: "f-3", fabricType: "2/1 Twill Woven", construction: "133 x 72", yarnCount: "40s x 40s", composition: "98% Cotton 2% Spandex", gsm: 240, spandexPct: 2 },
];

const initialProcessLoss: ProcessLoss[] = [
  { id: "pl-1", garmentType: "Basic T-Shirt (Knit)", knittingLossPct: 3.0, dyeingLossPct: 4.5, cuttingLossPct: 2.5, printWashLossPct: 2.0 },
  { id: "pl-2", garmentType: "Polo Shirt (Pique Knit)", knittingLossPct: 3.5, dyeingLossPct: 5.0, cuttingLossPct: 3.0, printWashLossPct: 2.5 },
  { id: "pl-3", garmentType: "Chino Pants (Woven)", knittingLossPct: 0.0, dyeingLossPct: 3.0, cuttingLossPct: 4.0, printWashLossPct: 3.5 },
];

const initialTrims: TrimsMaster[] = [
  { id: "t-1", itemName: "100% Spun Polyester Thread 40/2", category: "Sewing Trims", uom: "Cone (4000m)", unitPriceUsd: 1.45, nominatedSupplier: "Coats Bangladesh" },
  { id: "t-2", itemName: "Woven Main Label (Damask)", category: "Sewing Trims", uom: "Pcs", unitPriceUsd: 0.035, nominatedSupplier: "Avery Dennison BD" },
  { id: "t-3", itemName: "Self-Seal Polybag (12x18 inch)", category: "Packing Trims", uom: "Pcs", unitPriceUsd: 0.042, nominatedSupplier: "Kazi Poly Ltd" },
  { id: "t-4", itemName: "7-Ply Master Shipping Carton", category: "Packing Trims", uom: "Pcs", unitPriceUsd: 0.85, nominatedSupplier: "Mir Carton Ltd" },
];

function MerchandisingMasterSettingsPage() {
  const [activeTab, setActiveTab] = useState<"buyers" | "fabrics" | "loss" | "trims">("buyers");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [buyers, setBuyers] = useState<BuyerSetting[]>(initialBuyers);
  const [fabrics, setFabrics] = useState<FabricSpec[]>(initialFabrics);
  const [processLosses, setProcessLosses] = useState<ProcessLoss[]>(initialProcessLoss);
  const [trims, setTrims] = useState<TrimsMaster[]>(initialTrims);

  // New buyer form inline
  const [newBuyer, setNewBuyer] = useState({ buyerName: "", buyingHouse: "", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD" });

  const handleAddBuyer = () => {
    if (!newBuyer.buyerName.trim()) {
      toast.error("Please enter buyer name");
      return;
    }
    const item: BuyerSetting = {
      id: `b-${Date.now()}`,
      buyerName: newBuyer.buyerName,
      buyingHouse: newBuyer.buyingHouse || "Direct Buyer",
      aqlStandard: newBuyer.aqlStandard,
      payTerms: newBuyer.payTerms,
      currency: newBuyer.currency,
      status: "Active",
    };
    setBuyers([item, ...buyers]);
    setNewBuyer({ buyerName: "", buyingHouse: "", aqlStandard: "AQL 2.5", payTerms: "120 Days BBLC", currency: "USD" });
    toast.success(`Buyer ${item.buyerName} added to master database`);
  };

  const handleDeleteBuyer = (id: string) => {
    setBuyers(buyers.filter(b => b.id !== id));
    toast.success("Buyer configuration removed");
  };

  return (
    <MerchandisingLayout
      activePath="masterSettings"
      breadcrumbs={[{ label: "Master Settings" }, { label: activeTab.toUpperCase() }]}
      title="RMG Master Configurations"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Settings className="size-5" /></span>
              Master Configuration Suite
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage global parameters for Buyers, Fabric Formulations, Process Loss %, and Accessories</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-xl">
              ✓ Garments ERP Master DB Active
            </span>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: "buyers", label: "Buyer Setup", icon: Users, count: buyers.length },
            { id: "fabrics", label: "Fabric & Yarn Specs", icon: Layers, count: fabrics.length },
            { id: "loss", label: "Process Loss Matrix %", icon: Percent, count: processLosses.length },
            { id: "trims", label: "Trims & Accessories", icon: Package, count: trims.length },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
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

        {/* TAB 1: BUYER SETUP */}
        {activeTab === "buyers" && (
          <div className="space-y-6">
            {/* Quick Add Form */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Plus className="size-4 text-teal-500" /> Add New Buyer Configuration
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <input
                  type="text"
                  placeholder="Buyer Name (e.g. Zara, ITPS)"
                  value={newBuyer.buyerName}
                  onChange={(e) => setNewBuyer({ ...newBuyer, buyerName: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Buying House / Agent"
                  value={newBuyer.buyingHouse}
                  onChange={(e) => setNewBuyer({ ...newBuyer, buyingHouse: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
                />
                <select
                  value={newBuyer.aqlStandard}
                  onChange={(e) => setNewBuyer({ ...newBuyer, aqlStandard: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                >
                  <option value="AQL 2.5">AQL 2.5 Standard</option>
                  <option value="AQL 1.5">AQL 1.5 Strict</option>
                  <option value="AQL 4.0">AQL 4.0 Relaxed</option>
                </select>
                <select
                  value={newBuyer.payTerms}
                  onChange={(e) => setNewBuyer({ ...newBuyer, payTerms: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                >
                  <option value="120 Days BBLC">120 Days BBLC</option>
                  <option value="90 Days LC">90 Days LC</option>
                  <option value="At Sight LC">At Sight LC</option>
                  <option value="TT Transfer">TT Transfer</option>
                </select>
                <button
                  onClick={handleAddBuyer}
                  className="w-full h-9 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} /> Add Buyer
                </button>
              </div>
            </div>

            {/* Buyer Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Registered RMG Buyers</span>
                <span className="text-[11px] font-bold text-slate-400">Total: {buyers.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Buyer Name</th>
                      <th className="px-4 py-3">Buying House</th>
                      <th className="px-4 py-3">AQL Standard</th>
                      <th className="px-4 py-3">Payment Term</th>
                      <th className="px-4 py-3">Currency</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                    {buyers.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">{b.buyerName}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{b.buyingHouse}</td>
                        <td className="px-4 py-3">{b.aqlStandard}</td>
                        <td className="px-4 py-3">{b.payTerms}</td>
                        <td className="px-4 py-3 font-mono">{b.currency}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteBuyer(b.id)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FABRIC & YARN SPECS */}
        {activeTab === "fabrics" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Fabric & Yarn Specification Master Library</span>
              <button
                onClick={() => toast.success("Opening fabric spec wizard")}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Spec
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                  {fabrics.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{f.fabricType}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.construction}</td>
                      <td className="px-4 py-3 font-mono text-teal-600 dark:text-teal-400">{f.yarnCount}</td>
                      <td className="px-4 py-3">{f.composition}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">{f.gsm} gsm</td>
                      <td className="px-4 py-3 text-right font-mono">{f.spandexPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PROCESS LOSS MATRIX */}
        {activeTab === "loss" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">Garment Process Loss Matrix %</span>
                <span className="text-[10px] text-slate-400">Default wastage margins for material requirement calculations</span>
              </div>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                  {processLosses.map((pl) => {
                    const totalLoss = pl.knittingLossPct + pl.dyeingLossPct + pl.cuttingLossPct + pl.printWashLossPct;
                    return (
                      <tr key={pl.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{pl.garmentType}</td>
                        <td className="px-4 py-3 text-right font-mono">{pl.knittingLossPct}%</td>
                        <td className="px-4 py-3 text-right font-mono">{pl.dyeingLossPct}%</td>
                        <td className="px-4 py-3 text-right font-mono">{pl.cuttingLossPct}%</td>
                        <td className="px-4 py-3 text-right font-mono">{pl.printWashLossPct}%</td>
                        <td className="px-4 py-3 text-right font-mono font-black text-rose-500">{totalLoss.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TRIMS & ACCESSORIES MASTER */}
        {activeTab === "trims" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Trims & Accessories Master Catalog</span>
              <button
                onClick={() => toast.success("Adding trims item to catalog")}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Trims Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Item Description</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">UOM</th>
                    <th className="px-4 py-3 text-right">Unit Price (USD)</th>
                    <th className="px-4 py-3">Nominated Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                  {trims.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
