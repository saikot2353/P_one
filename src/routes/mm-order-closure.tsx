import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMMainOrder,
} from "../lib/marketing-merchandising-data";
import {
  Lock,
  Unlock,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  Play,
  ShieldAlert,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-order-closure")({
  head: () => ({
    meta: [
      { title: "Order Closure & Reopening Control — CriptonHRIS" },
      {
        name: "description",
        content: "Operational controls for closing and reopening orders, transaction blockade enforcement, and audit history.",
      },
    ],
  }),
  component: MMOrderClosurePage,
});

function MMOrderClosurePage() {
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [policy, setPolicy] = useState(MMRepository.getPolicy());
  const [activeTab, setActiveTab] = useState<"orders" | "simulation" | "audit">("orders");

  // Action Modal State
  const [selectedOrder, setSelectedOrder] = useState<MMMainOrder | null>(null);
  const [actionType, setActionType] = useState<"Close" | "Reopen">("Close");
  const [actionReason, setActionReason] = useState("");

  // Simulation test state
  const [simulatedOrder, setSimulatedOrder] = useState<MMMainOrder | null>(null);
  const [blockedAlertMessage, setBlockedAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const ords = MMRepository.getOrders();
    setOrders(ords);
    setPolicy(MMRepository.getPolicy());
    if (ords.length > 0) setSimulatedOrder(ords[0]);
  }, []);

  const handleOpenActionModal = (order: MMMainOrder, type: "Close" | "Reopen") => {
    setSelectedOrder(order);
    setActionType(type);
    setActionReason("");
  };

  const confirmAction = () => {
    if (!selectedOrder) return;
    if (!actionReason.trim()) {
      toast.error(`Please provide a mandatory reason to ${actionType.toLowerCase()} this order.`);
      return;
    }

    const nextStatus = actionType === "Close" ? "Closed" : "Open";
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);

    const updated: MMMainOrder = {
      ...selectedOrder,
      orderStatus: nextStatus,
      closureAuditLog: [
        {
          status: actionType === "Close" ? "Closed" : "Reopened",
          timestamp: now,
          user: "Rashidul Islam (Head of Merchandising)",
          reason: actionReason.trim(),
        },
        ...selectedOrder.closureAuditLog,
      ],
    };

    MMRepository.saveOrder(updated);
    const refreshed = MMRepository.getOrders();
    setOrders(refreshed);
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: now,
      entityType: "OrderClosure",
      entityId: selectedOrder.orderNo,
      action: actionType === "Close" ? "Close" : "Reopen",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `${actionType} Order ${selectedOrder.orderNo}. Reason: ${actionReason.trim()}`,
    });

    // Update simulation pointer
    if (simulatedOrder && simulatedOrder.id === selectedOrder.id) {
      setSimulatedOrder(updated);
    }

    setSelectedOrder(null);
    setActionReason("");
    toast.success(`Order ${selectedOrder.orderNo} is now ${nextStatus}.`);
  };

  // Transaction Blockade Simulation
  const simulateTransaction = (txType: "Booking" | "MRR" | "Issuance") => {
    if (!simulatedOrder) return;
    if (simulatedOrder.orderStatus === "Closed") {
      // EXACT MANDATED MESSAGE FROM PROMPT SECTION 15:
      const exactMessage = "This order is currently closed. Please reopen the order before proceeding with this transaction.";
      setBlockedAlertMessage(exactMessage);
      toast.error(exactMessage, { duration: 5000 });
    } else {
      setBlockedAlertMessage(null);
      toast.success(`Transaction allowed: Order ${simulatedOrder.orderNo} is Open. Operational ${txType} can proceed.`);
    }
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-order-closure"
      breadcrumbs={[{ label: "Order Closure Control" }]}
      title="Order Closure & Reopening Control"
      subtitle="Operational transaction blockade enforcement, reopening authorization, and audit logs"
    >
      <div className="space-y-6">
        {/* Mandated System Behavior Banner */}
        <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Operational Enforcement Guard:</strong> When an order is closed, all downstream booking, receiving,
              or issuing transactions are strictly blocked with the mandatory system warning. Only authorized roles
              (Merchandising Manager, Head of Merchandising, Admin) can reopen the order.
            </span>
          </div>
          <span className="font-mono font-bold text-rose-700 dark:text-rose-300 text-[11px] shrink-0">
            Mandatory ERP Control
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "orders" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            Orders Status & Control ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("simulation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "simulation"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Transaction Blockade Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "audit" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Closure & Reopening Audit History</span>
          </button>
        </div>

        {/* ── TAB 1: ORDERS CLOSURE & REOPENING LIST ─────────────────────────── */}
        {activeTab === "orders" && (
          <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b font-semibold">
                  <tr>
                    <th className="py-3 px-3">Order Number</th>
                    <th className="py-3 px-3">Buyer</th>
                    <th className="py-3 px-3">Style / Item</th>
                    <th className="py-3 px-3">Order Qty</th>
                    <th className="py-3 px-3">Current Operational Status</th>
                    <th className="py-3 px-3">Last Closure Event</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">{o.orderNo}</td>
                      <td className="py-3 px-3 font-semibold">{o.buyerName}</td>
                      <td className="py-3 px-3">
                        {o.styleNo} ({o.garmentItem})
                      </td>
                      <td className="py-3 px-3 font-mono">{o.orderQuantity.toLocaleString()} pcs</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            o.orderStatus === "Closed"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          }`}
                        >
                          {o.orderStatus === "Closed" ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          {o.orderStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {o.closureAuditLog[0] ? (
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-slate-200">
                              {o.closureAuditLog[0].status} on {o.closureAuditLog[0].timestamp}
                            </span>
                            <span className="italic text-[10px]">"{o.closureAuditLog[0].reason}"</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {o.orderStatus === "Closed" ? (
                          <button
                            onClick={() => handleOpenActionModal(o, "Reopen")}
                            className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-300 inline-flex items-center gap-1"
                          >
                            <Unlock className="w-3 h-3" /> Reopen Order
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenActionModal(o, "Close")}
                            className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold border border-rose-300 inline-flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" /> Close Order
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: TRANSACTION BLOCKADE SIMULATOR ─────────────────────────── */}
        {activeTab === "simulation" && (
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-teal-600" />
                Live Operational Transaction Blockade Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulate an attempt to execute a Material Receipt (MRR), Fabric Booking, or Store Issuance against an
                Order to test the closure guardrail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800/40 space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Select Target Order to Test:</label>
                  <select
                    value={simulatedOrder?.id || ""}
                    onChange={(e) => {
                      const found = orders.find((o) => o.id === e.target.value);
                      if (found) {
                        setSimulatedOrder(found);
                        setBlockedAlertMessage(null);
                      }
                    }}
                    className="w-full p-2 rounded border bg-white dark:bg-slate-800 font-bold"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNo} — {o.buyerName} | Status: {o.orderStatus}
                      </option>
                    ))}
                  </select>
                </div>

                {simulatedOrder && (
                  <div className="p-3 rounded border bg-white dark:bg-slate-800 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Order Status:</span>
                      <span
                        className={`font-bold ${
                          simulatedOrder.orderStatus === "Closed" ? "text-rose-600 font-mono" : "text-emerald-600 font-mono"
                        }`}
                      >
                        {simulatedOrder.orderStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Buyer PO:</span>
                      <span className="font-mono">{simulatedOrder.buyerPoNumber}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <span className="font-bold block mb-2">Simulate Transaction Execution:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => simulateTransaction("Booking")}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700"
                    >
                      Attempt Booking
                    </button>
                    <button
                      onClick={() => simulateTransaction("MRR")}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700"
                    >
                      Attempt MRR
                    </button>
                    <button
                      onClick={() => simulateTransaction("Issuance")}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700"
                    >
                      Attempt Issuance
                    </button>
                  </div>
                </div>
              </div>

              {/* Blocked message result display */}
              <div className="p-4 rounded-lg border flex flex-col justify-center items-center text-center space-y-3 bg-white dark:bg-slate-900">
                <span className="text-xs font-bold text-slate-400 uppercase">System Interception Output</span>

                {blockedAlertMessage ? (
                  <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs font-bold space-y-2 animate-in zoom-in-95">
                    <AlertTriangle className="w-8 h-8 mx-auto text-rose-600" />
                    <p className="text-sm font-extrabold tracking-tight">TRANSACTION BLOCKED</p>
                    <p className="italic font-sans text-xs">"{blockedAlertMessage}"</p>
                    <span className="block text-[10px] text-rose-500 font-normal">
                      Transaction execution was aborted by Order Closure engine.
                    </span>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs space-y-1">
                    <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500" />
                    <p>Click any transaction button on the left to test closure enforcement.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: AUDIT HISTORY ───────────────────────────────────────────── */}
        {activeTab === "audit" && (
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                Immutable Order Closure & Reopening Log
              </h3>
              <p className="text-xs text-slate-500">
                Tracks state transitions, authorized user IDs, timestamps, and justification reasons
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 border-b">
                  <tr>
                    <th className="py-2.5 px-3">Order No</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Authorized User</th>
                    <th className="py-2.5 px-3">Mandatory Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.flatMap((o) =>
                    o.closureAuditLog.map((log, idx) => (
                      <tr key={`${o.id}-${idx}`}>
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-600">{o.orderNo}</td>
                        <td className="py-2.5 px-3 font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              log.status === "Closed"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="py-2.5 px-3 font-medium">{log.user}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 italic">"{log.reason}"</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODAL: CLOSE OR REOPEN REASON ──────────────────────────────────── */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border shadow-xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                {actionType === "Close" ? (
                  <Lock className="w-5 h-5 text-rose-600" />
                ) : (
                  <Unlock className="w-5 h-5 text-emerald-600" />
                )}
                <span>
                  Confirm {actionType} Order ({selectedOrder.orderNo})
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {actionType === "Close"
                  ? "Closing this order will prevent any new or pending bookings, receipts, or issuances from executing."
                  : "Reopening this order will restore eligibility for operational transactions subject to normal approval controls."}
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Justification Reason:
                </label>
                <textarea
                  rows={3}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={`Reason for ${actionType.toLowerCase()}ing order...`}
                  className="w-full text-xs p-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-1.5 rounded text-xs font-bold text-white ${
                    actionType === "Close" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  Confirm {actionType}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
