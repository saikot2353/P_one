import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Briefcase,
  Plus,
  Droplet,
  Grid,
  Printer,
  Layers,
  FileCheck,
  Search,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-work-orders")({
  head: () => ({
    meta: [
      { title: "Sub-Contract Work Orders — RMG Merchandising" },
      { name: "description", content: "Issue and track sub-contract work orders for Washing, Screen Printing, AOP, Embroidery, and Dyeing units." },
    ],
  }),
  component: MerchandisingWorkOrdersPage,
});

interface ServiceWorkOrder {
  id: string;
  woNo: string;
  serviceType: "Dyeing WO" | "Garment Wash WO" | "Screen Print WO" | "AOP Print WO" | "Embroidery WO";
  styleNo: string;
  buyerName: string;
  contractor: string;
  qty: string;
  rateUsd: number;
  totalValUsd: number;
  deliveryDate: string;
  status: "Issued" | "In Production" | "Completed";
}

const initialWOs: ServiceWorkOrder[] = [
  { id: "wo-1", woNo: "WO-WASH-2026-012", serviceType: "Garment Wash WO", styleNo: "ST-8822", buyerName: "ITPS", contractor: "Euro Wash & Dyeing Ltd", qty: "12,000 Pcs", rateUsd: 0.35, totalValUsd: 4200.0, deliveryDate: "2026-08-10", status: "In Production" },
  { id: "wo-2", woNo: "WO-PRNT-2026-045", serviceType: "Screen Print WO", styleNo: "ST-8822", buyerName: "ITPS", contractor: "Smart Print Ltd", qty: "12,000 Pcs", rateUsd: 0.22, totalValUsd: 2640.0, deliveryDate: "2026-08-06", status: "Completed" },
  { id: "wo-3", woNo: "WO-EMB-2026-018", serviceType: "Embroidery WO", styleNo: "AM-899", buyerName: "A-M-London Fashion Ltd", contractor: "Classic Emb Tech", qty: "5,400 Pcs", rateUsd: 0.45, totalValUsd: 2430.0, deliveryDate: "2026-08-15", status: "Issued" },
];

function MerchandisingWorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<ServiceWorkOrder[]>(initialWOs);
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [showNewWOForm, setShowNewWOForm] = useState(false);
  const [newWO, setNewWO] = useState({
    serviceType: "Garment Wash WO" as ServiceWorkOrder["serviceType"],
    styleNo: "ST-8822",
    buyerName: "ITPS",
    contractor: "Euro Wash & Dyeing Ltd",
    qtyPcs: 10000,
    rateUsd: 0.30,
    deliveryDate: "2026-08-20",
  });

  const handleIssueWO = () => {
    if (!newWO.styleNo.trim() || !newWO.contractor.trim()) {
      toast.error("Please fill required fields");
      return;
    }
    const totalVal = newWO.qtyPcs * newWO.rateUsd;
    const wo: ServiceWorkOrder = {
      id: `wo-${Date.now()}`,
      woNo: `WO-${newWO.serviceType.substring(0, 4).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      serviceType: newWO.serviceType,
      styleNo: newWO.styleNo,
      buyerName: newWO.buyerName,
      contractor: newWO.contractor,
      qty: `${newWO.qtyPcs.toLocaleString()} Pcs`,
      rateUsd: newWO.rateUsd,
      totalValUsd: Math.round(totalVal * 100) / 100,
      deliveryDate: newWO.deliveryDate,
      status: "Issued",
    };
    setWorkOrders([wo, ...workOrders]);
    setShowNewWOForm(false);
    toast.success(`Work Order ${wo.woNo} issued to ${wo.contractor}`);
  };

  const filteredWOs = workOrders.filter(w => {
    const matchesSearch =
      w.woNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.styleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.contractor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || w.serviceType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <MerchandisingLayout
      activePath="services"
      breadcrumbs={[{ label: "Service Work Orders" }, { label: "Sub-Contract Order Ledger" }]}
      title="Sub-Contracting Service Work Orders"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Briefcase className="size-5" /></span>
              Service Sub-Contract Work Orders
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Issue, track, and reconcile work orders for Dyeing, Garment Wash, Screen Printing, AOP, and Embroidery facilities</p>
          </div>

          <button
            onClick={() => setShowNewWOForm(!showNewWOForm)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-teal-500/15 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus size={14} /> ISSUE SERVICE WORK ORDER
          </button>
        </div>

        {/* ISSUE NEW WO FORM */}
        {showNewWOForm && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-teal-500/30 shadow-lg space-y-4 animate-in fade-in">
            <h3 className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-2">
              <Plus className="size-4" /> Generate Sub-Contract Work Order
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <select
                value={newWO.serviceType}
                onChange={(e) => setNewWO({ ...newWO, serviceType: e.target.value as any })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              >
                <option value="Garment Wash WO">Garment Wash WO</option>
                <option value="Screen Print WO">Screen Print WO</option>
                <option value="AOP Print WO">AOP Print WO</option>
                <option value="Embroidery WO">Embroidery WO</option>
                <option value="Dyeing WO">Dyeing WO</option>
              </select>

              <input
                type="text"
                placeholder="Style No (e.g. ST-8822)"
                value={newWO.styleNo}
                onChange={(e) => setNewWO({ ...newWO, styleNo: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />

              <input
                type="text"
                placeholder="Sub-Contractor / Unit Name"
                value={newWO.contractor}
                onChange={(e) => setNewWO({ ...newWO, contractor: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />

              <input
                type="number"
                placeholder="Qty Pcs"
                value={newWO.qtyPcs}
                onChange={(e) => setNewWO({ ...newWO, qtyPcs: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />

              <input
                type="number"
                step="0.01"
                placeholder="Service Rate ($)"
                value={newWO.rateUsd}
                onChange={(e) => setNewWO({ ...newWO, rateUsd: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />

              <button
                onClick={handleIssueWO}
                className="w-full h-9 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Confirm & Issue WO
              </button>
            </div>
          </div>
        )}

        {/* WORK ORDER LEDGER */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Search by WO no, style, contractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />

            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "Garment Wash WO", "Screen Print WO", "Embroidery WO", "Dyeing WO"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                    filterType === t
                      ? "bg-teal-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">WO Number</th>
                  <th className="px-4 py-3">Service Category</th>
                  <th className="px-4 py-3">Sub-Contractor / Unit</th>
                  <th className="px-4 py-3">Style No</th>
                  <th className="px-4 py-3 text-right">Order Qty</th>
                  <th className="px-4 py-3 text-right">Rate ($)</th>
                  <th className="px-4 py-3 text-right">Total Amount ($)</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                {filteredWOs.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{w.woNo}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        {w.serviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-teal-600 dark:text-teal-400 font-bold">{w.contractor}</td>
                    <td className="px-4 py-3 font-bold">{w.styleNo}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">{w.qty}</td>
                    <td className="px-4 py-3 text-right font-mono">${w.rateUsd.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono font-extrabold text-teal-600 dark:text-teal-400">${w.totalValUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        w.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : w.status === "In Production"
                          ? "bg-teal-500/10 text-teal-600 border border-teal-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}>
                        {w.status}
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
