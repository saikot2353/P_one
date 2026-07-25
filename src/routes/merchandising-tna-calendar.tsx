import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-tna-calendar")({
  head: () => ({
    meta: [
      { title: "TNA Calendar — RMG Merchandising" },
      { name: "description", content: "Time & Action critical path tracking, milestone deadlines, and shipment delay alerts." },
    ],
  }),
  component: MerchandisingTNACalendarPage,
});

interface TNAMilestone {
  step: number;
  name: string;
  planDate: string;
  actualDate?: string;
  status: "Completed" | "Pending" | "Delayed";
}

interface TNAOrder {
  id: string;
  poNo: string;
  styleNo: string;
  buyerName: string;
  orderQty: number;
  shipmentDate: string;
  currentMilestone: string;
  health: "On Track" | "Attention" | "Critical";
  milestones: TNAMilestone[];
}

const initialTNAOrders: TNAOrder[] = [
  {
    id: "tna-1",
    poNo: "PO-2026-ITPS",
    styleNo: "ST-8822",
    buyerName: "ITPS",
    orderQty: 12000,
    shipmentDate: "2026-08-15",
    currentMilestone: "Accessories In-House",
    health: "On Track",
    milestones: [
      { step: 1, name: "Order Confirmation", planDate: "2026-07-01", actualDate: "2026-07-01", status: "Completed" },
      { step: 2, name: "Yarn Booking", planDate: "2026-07-05", actualDate: "2026-07-04", status: "Completed" },
      { step: 3, name: "Lab Dip Approval", planDate: "2026-07-12", actualDate: "2026-07-10", status: "Completed" },
      { step: 4, name: "Fabric Booking", planDate: "2026-07-15", actualDate: "2026-07-14", status: "Completed" },
      { step: 5, name: "Accessories In-House", planDate: "2026-07-25", status: "Pending" },
      { step: 6, name: "PP Sample Approval", planDate: "2026-07-28", status: "Pending" },
      { step: 7, name: "Cutting Start", planDate: "2026-08-01", status: "Pending" },
      { step: 8, name: "Sewing Start", planDate: "2026-08-04", status: "Pending" },
      { step: 9, name: "Pre-Ship Inspection", planDate: "2026-08-12", status: "Pending" },
      { step: 10, name: "Ex-Factory Date", planDate: "2026-08-15", status: "Pending" },
    ],
  },
  {
    id: "tna-2",
    poNo: "PO-LND-899",
    styleNo: "AM-899",
    buyerName: "A-M-London Fashion Ltd",
    orderQty: 5400,
    shipmentDate: "2026-08-20",
    currentMilestone: "Lab Dip Approval",
    health: "Critical",
    milestones: [
      { step: 1, name: "Order Confirmation", planDate: "2026-07-05", actualDate: "2026-07-05", status: "Completed" },
      { step: 2, name: "Yarn Booking", planDate: "2026-07-10", actualDate: "2026-07-12", status: "Completed" },
      { step: 3, name: "Lab Dip Approval", planDate: "2026-07-18", status: "Delayed" },
      { step: 4, name: "Fabric Booking", planDate: "2026-07-22", status: "Pending" },
      { step: 5, name: "PP Sample Approval", planDate: "2026-08-02", status: "Pending" },
      { step: 6, name: "Cutting Start", planDate: "2026-08-05", status: "Pending" },
      { step: 7, name: "Ex-Factory Date", planDate: "2026-08-20", status: "Pending" },
    ],
  },
];

function MerchandisingTNACalendarPage() {
  const [tnaOrders, setTnaOrders] = useState<TNAOrder[]>(initialTNAOrders);
  const [selectedOrder, setSelectedOrder] = useState<TNAOrder>(initialTNAOrders[0]);

  const handleUpdateMilestone = (stepNo: number) => {
    const updatedMilestones = selectedOrder.milestones.map(m =>
      m.step === stepNo ? { ...m, status: "Completed" as const, actualDate: new Date().toISOString().split("T")[0] } : m
    );
    const updatedOrder = { ...selectedOrder, milestones: updatedMilestones };
    setSelectedOrder(updatedOrder);
    setTnaOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    toast.success(`Milestone #${stepNo} marked as completed!`);
  };

  return (
    <MerchandisingLayout
      activePath="tna"
      breadcrumbs={[{ label: "TNA Calendar" }, { label: "Milestone Tracking Board" }]}
      title="Time & Action (TNA) Critical Path"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Calendar className="size-5" /></span>
              Time & Action (TNA) Critical Path Calendar
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monitor 11 critical production events from order placement to final ex-factory shipment date</p>
          </div>
        </div>

        {/* ORDER SELECTION LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tnaOrders.map((o) => (
            <div
              key={o.id}
              onClick={() => setSelectedOrder(o)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedOrder.id === o.id
                  ? "bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/20 shadow-md"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-350"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">{o.poNo}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                  o.health === "On Track"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse"
                }`}>
                  {o.health}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold">
                <div>Style: <span className="text-teal-600 dark:text-teal-400 font-bold">{o.styleNo}</span></div>
                <div>Buyer: <span className="text-slate-700 dark:text-slate-300">{o.buyerName}</span></div>
                <div>Order Qty: <span className="font-mono font-bold">{o.orderQty.toLocaleString()} Pcs</span></div>
                <div>Shipment: <span className="font-mono font-bold text-slate-900 dark:text-white">{o.shipmentDate}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* DETAILED MILESTONE TRACKER FOR SELECTED ORDER */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Critical Path Timeline for {selectedOrder.poNo} ({selectedOrder.styleNo})
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Click milestone to complete actual date</p>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              Shipment Target: {selectedOrder.shipmentDate}
            </span>
          </div>

          {/* Timeline Visual Progress */}
          <div className="relative border-l-2 border-teal-500/30 pl-6 ml-3 space-y-6">
            {selectedOrder.milestones.map((m) => (
              <div key={m.step} className="relative flex items-center justify-between group">
                {/* Dot indicator */}
                <div className={`absolute -left-[31px] size-4 rounded-full border-2 bg-white dark:bg-slate-900 transition-colors ${
                  m.status === "Completed"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : m.status === "Delayed"
                    ? "border-rose-500 bg-rose-500"
                    : "border-slate-300 dark:border-slate-700"
                }`} />

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">Step {m.step}: {m.name}</span>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-extrabold ${
                      m.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : m.status === "Delayed"
                        ? "bg-rose-500/10 text-rose-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Plan Date: <span className="font-mono">{m.planDate}</span>
                    {m.actualDate && <span className="ml-3 text-emerald-600 dark:text-emerald-400">Actual: {m.actualDate}</span>}
                  </div>
                </div>

                {m.status !== "Completed" && (
                  <button
                    onClick={() => handleUpdateMilestone(m.step)}
                    className="px-3 py-1 bg-slate-100 hover:bg-teal-500 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg transition cursor-pointer"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </MerchandisingLayout>
  );
}
