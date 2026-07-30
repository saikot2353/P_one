import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Wind,
  Layers,
  Package,
  Calculator,
  Plus,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-material-bookings")({
  head: () => ({
    meta: [
      { title: "Material Bookings — RMG Merchandising" },
      { name: "description", content: "Auto Yarn requirement calculation engine, Fabric Booking sheets, and Trims purchase orders." },
    ],
  }),
  component: MerchandisingMaterialBookingsPage,
});

interface BookingRecord {
  id: string;
  bookingNo: string;
  type: "Yarn Booking" | "Fabric Booking" | "Trims WO";
  styleNo: string;
  buyerName: string;
  supplier: string;
  qty: string;
  deliveryDate: string;
  status: "Issued" | "Submitted" | "Confirmed" | "Revised";
}

const initialBookings: BookingRecord[] = [
  { id: "bk-1", bookingNo: "YB-2026-104", type: "Yarn Booking", styleNo: "ST-8822", buyerName: "ITPS", supplier: "Noman Spinning Mills", qty: "3,845 Kg", deliveryDate: "2026-08-05", status: "Confirmed" },
  { id: "bk-2", bookingNo: "FB-2026-088", type: "Fabric Booking", styleNo: "AM-899", buyerName: "A-M-London Fashion Ltd", supplier: "Envoy Textiles Ltd", qty: "5,120 Yds", deliveryDate: "2026-08-12", status: "Submitted" },
  { id: "bk-3", bookingNo: "TR-2026-201", type: "Trims WO", styleNo: "ST-8822", buyerName: "ITPS", supplier: "Coats Bangladesh", qty: "1,200 Cones", deliveryDate: "2026-08-08", status: "Issued" },
];

function MerchandisingMaterialBookingsPage() {
  const [activeTab, setActiveTab] = useState<"yarnCalc" | "fabric" | "trims">("yarnCalc");
  
  const searchTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") : null;
  useEffect(() => {
    if (searchTab === "yarnCalc" || searchTab === "fabric" || searchTab === "trims") {
      setActiveTab(searchTab);
    }
  }, [searchTab]);
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);

  // Yarn Calculator States
  const [orderDzn, setOrderDzn] = useState(1000); // 1000 Dzn = 12,000 Pcs
  const [bodyConsKg, setBodyConsKg] = useState(2.85); // kg per dzn
  const [ribConsKg, setRibConsKg] = useState(0.35); // kg per dzn
  const [knittingLossPct, setKnittingLossPct] = useState(3.5); // %
  const [dyeingLossPct, setDyeingLossPct] = useState(4.5); // %

  const yarnCalcResult = useMemo(() => {
    const netBodyKg = orderDzn * bodyConsKg;
    const netRibKg = orderDzn * ribConsKg;
    const totalNetKg = netBodyKg + netRibKg;

    // Total Loss Multiplier
    const totalLossPct = knittingLossPct + dyeingLossPct;
    const grossYarnKg = Math.round(totalNetKg * (1 + totalLossPct / 100));

    return {
      netBodyKg: Math.round(netBodyKg),
      netRibKg: Math.round(netRibKg),
      totalNetKg: Math.round(totalNetKg),
      grossYarnKg,
    };
  }, [orderDzn, bodyConsKg, ribConsKg, knittingLossPct, dyeingLossPct]);

  const handleGenerateYarnWO = () => {
    const booking: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingNo: `YB-2026-${Math.floor(200 + Math.random() * 800)}`,
      type: "Yarn Booking",
      styleNo: "ST-8822",
      buyerName: "ITPS",
      supplier: "Square Spinning Mills",
      qty: `${yarnCalcResult.grossYarnKg.toLocaleString()} Kg`,
      deliveryDate: "2026-08-15",
      status: "Issued",
    };
    setBookings([booking, ...bookings]);
    toast.success(`Yarn Booking ${booking.bookingNo} generated successfully for ${booking.qty}`);
  };

  return (
    <MerchandisingLayout
      activePath="sourcing"
      breadcrumbs={[{ label: "Sourcing & Bookings" }, { label: "Material Procurement Engine" }]}
      title="Material Sourcing & Booking Sheets"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Wind className="size-5" /></span>
              Material Procurement Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automated Yarn requirement formulation, Fabric Booking sheets for Dyeing & Knitting mills, and Accessories WOs</p>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: "yarnCalc", label: "Auto Yarn Calculator (Kg)", icon: Calculator },
            { id: "fabric", label: "Fabric Booking Sheets", icon: Layers },
            { id: "trims", label: "Trims & Accessories WOs", icon: Package },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                  isSel
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/15"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: AUTO YARN CALCULATOR */}
        {activeTab === "yarnCalc" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Calculator className="size-4 text-teal-500" /> Auto Yarn Formula Engine (RMG Standard)
                </h3>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg">
                  Formula: Net Fabric (Kg) × (1 + Knitting Loss % + Dyeing Loss %)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Order Qty (Dozen)</label>
                  <input
                    type="number"
                    value={orderDzn}
                    onChange={(e) => setOrderDzn(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold block">= {(orderDzn * 12).toLocaleString()} Pcs</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Body Fabric Cons (Kg/Dzn)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={bodyConsKg}
                    onChange={(e) => setBodyConsKg(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Rib/Collar Cons (Kg/Dzn)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={ribConsKg}
                    onChange={(e) => setRibConsKg(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Knitting Loss %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={knittingLossPct}
                    onChange={(e) => setKnittingLossPct(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Dyeing Loss %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={dyeingLossPct}
                    onChange={(e) => setDyeingLossPct(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
              </div>

              {/* Output Result */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase text-slate-400">Total Net Fabric Required</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{yarnCalcResult.totalNetKg.toLocaleString()} Kg</div>
                  <span className="text-[10px] text-slate-400">(Body: {yarnCalcResult.netBodyKg.toLocaleString()}kg + Rib: {yarnCalcResult.netRibKg.toLocaleString()}kg)</span>
                </div>

                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400">Total Gross Yarn Needed (Kg)</span>
                  <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{yarnCalcResult.grossYarnKg.toLocaleString()} Kg</div>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">Includes {knittingLossPct + dyeingLossPct}% total process loss</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <button
                    onClick={handleGenerateYarnWO}
                    className="w-full h-11 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-teal-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Auto Issue Yarn Booking Sheet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Active Material Booking Sheets</span>
            <span className="text-[11px] font-bold text-slate-400">Total: {bookings.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Booking No</th>
                  <th className="px-4 py-3">Booking Type</th>
                  <th className="px-4 py-3">Style No</th>
                  <th className="px-4 py-3">Buyer Name</th>
                  <th className="px-4 py-3">Nominated Supplier / Mill</th>
                  <th className="px-4 py-3 font-bold text-right">Booked Quantity</th>
                  <th className="px-4 py-3">Target Delivery</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{b.bookingNo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                        b.type === "Yarn Booking"
                          ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                          : b.type === "Fabric Booking"
                          ? "bg-teal-500/10 text-teal-600 border-teal-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}>
                        {b.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">{b.styleNo}</td>
                    <td className="px-4 py-3">{b.buyerName}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{b.supplier}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">{b.qty}</td>
                    <td className="px-4 py-3 text-slate-500">{b.deliveryDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MerchandisingLayout>
  );
}
