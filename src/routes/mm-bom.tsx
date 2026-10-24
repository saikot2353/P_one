import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMBOM,
  MMBOMItem,
  MMMainOrder,
  MMPreCosting,
} from "../lib/marketing-merchandising-data";
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Link as LinkIcon,
  Eye,
  Edit,
  Save,
  ShieldCheck,
  FileText,
  Percent,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-bom")({
  head: () => ({
    meta: [
      { title: "BOM Management & Pre-Cost Linkage — CriptonHRIS" },
      {
        name: "description",
        content: "Bill of Materials (BOM) management with mandatory item-level linkage to approved Pre-Cost Item IDs and unmatched item governance.",
      },
    ],
  }),
  component: MMBOMPage,
});

function MMBOMPage() {
  const [boms, setBoms] = useState<MMBOM[]>([]);
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [preCostings, setPreCostings] = useState<MMPreCosting[]>([]);
  const [selectedBom, setSelectedBom] = useState<MMBOM | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form for New BOM
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [unmatchedReason, setUnmatchedReason] = useState("");

  useEffect(() => {
    const loadedBoms = MMRepository.getBOMs();
    const loadedOrders = MMRepository.getOrders();
    const loadedPreCosts = MMRepository.getPreCostings();
    setBoms(loadedBoms);
    setOrders(loadedOrders);
    setPreCostings(loadedPreCosts);
    if (loadedBoms.length > 0 && !selectedBom) {
      setSelectedBom(loadedBoms[0]);
    }
    if (loadedOrders.length > 0) {
      setSelectedOrderId(loadedOrders[0].id);
    }
  }, []);

  const handleGenerateBom = () => {
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) {
      toast.error("Please select a Main Order.");
      return;
    }

    const preCost = preCostings.find((pc) => pc.preCostId === order.preCostId);
    if (!preCost) {
      toast.error(`Pre-Costing ${order.preCostId} not found.`);
      return;
    }

    if (preCost.status !== "Approved") {
      toast.error(`Pre-Costing ${order.preCostId} is not approved. Cannot release BOM.`);
      return;
    }

    // Populate BOM items linked to Pre-Cost Item IDs
    const nextBomId = `BOM-2026-00${boms.length + 3}`;
    const generatedItems: MMBOMItem[] = preCost.items.map((pci, idx) => {
      // Scale required qty for full order
      const orderQty = order.orderQuantity;
      const totalReq = (pci.requiredQtyWithWastage / 12) * orderQty;
      const totalEstCost = totalReq * pci.unitRate;

      return {
        bomItemId: `BOMI-${nextBomId.slice(-3)}-00${idx + 1}`,
        preCostItemId: pci.preCostItemId, // Mandatory Linkage!
        isUnmatchedAdditional: false,
        category: pci.category as any,
        itemCode: pci.itemCode,
        itemDescription: pci.itemDescription,
        specification: pci.specification,
        bodyPartOrUsedPlace: pci.bodyPartOrUsedPlace,
        preCostEstimatedQty: totalReq,
        preCostRate: pci.unitRate,
        preCostUnit: pci.unit,
        preCostAmount: totalEstCost,
        bomConsumptionPerPc: pci.consumptionPerPc,
        bomWastagePct: pci.wastagePct,
        bomTotalRequiredQty: totalReq,
        bomUnit: pci.unit,
        bomEstimatedRate: pci.unitRate,
        bomEstimatedCost: totalEstCost,
        supplierNominee: pci.supplierNominee,
      };
    });

    const newBom: MMBOM = {
      id: `bom-${Date.now()}`,
      bomId: nextBomId,
      orderId: order.id,
      orderNo: order.orderNo,
      styleNo: order.styleNo,
      preCostId: order.preCostId,
      preCostVersion: order.preCostVersion,
      items: generatedItems,
      totalBomCost: generatedItems.reduce((acc, i) => acc + i.bomEstimatedCost, 0),
      status: "Released",
      createdBy: "Rashidul Islam (Head of Merchandising)",
      createdDate: new Date().toISOString().slice(0, 10),
    };

    MMRepository.saveBOM(newBom);
    setBoms(MMRepository.getBOMs());
    setSelectedBom(newBom);
    setIsCreateModalOpen(false);
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "BOM",
      entityId: newBom.bomId,
      action: "Create",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Generated BOM ${newBom.bomId} for Order ${newBom.orderNo}. Populated ${newBom.items.length} items linked to approved ${newBom.preCostId} v${newBom.preCostVersion}.`,
    });
    toast.success(`BOM ${nextBomId} generated and linked to approved Pre-Costing!`);
  };

  const handleAddUnmatchedItem = () => {
    if (!selectedBom) return;
    const newItemId = `BOMI-${selectedBom.bomId.slice(-3)}-UNMATCHED-${selectedBom.items.length + 1}`;
    const unmatchedItem: MMBOMItem = {
      bomItemId: newItemId,
      preCostItemId: "UNMATCHED-NEW", // Explicitly NOT an existing PreCost ID!
      isUnmatchedAdditional: true,
      category: "Accessories",
      itemCode: "ACC-UNM-01",
      itemDescription: "Additional Security Tag (Unmatched in Pre-Costing)",
      specification: "Added post-buyer audit",
      bodyPartOrUsedPlace: "Pocket Bag",
      preCostEstimatedQty: 0,
      preCostRate: 0,
      preCostUnit: "Pcs",
      preCostAmount: 0,
      bomConsumptionPerPc: 1,
      bomWastagePct: 1.0,
      bomTotalRequiredQty: 45000,
      bomUnit: "Pcs",
      bomEstimatedRate: 0.04,
      bomEstimatedCost: 1800,
      notes: "Exception Item: Requires Merchandising Director clearance before booking.",
    };

    const updatedBom: MMBOM = {
      ...selectedBom,
      items: [...selectedBom.items, unmatchedItem],
      totalBomCost: selectedBom.totalBomCost + unmatchedItem.bomEstimatedCost,
      updatedBy: "Rashidul Islam (Head of Merchandising)",
      updatedDate: new Date().toISOString().slice(0, 10),
    };

    MMRepository.saveBOM(updatedBom);
    setBoms(MMRepository.getBOMs());
    setSelectedBom(updatedBom);
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "BOM",
      entityId: selectedBom.bomId,
      action: "Update",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Added unmatched additional item ${unmatchedItem.itemDescription} to BOM ${selectedBom.bomId}. Explicitly tagged without fabricated Pre-Cost ID.`,
    });
    toast.warning("Unmatched item added with exception tag. Approved Pre-Costing remains intact.");
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-bom"
      breadcrumbs={[{ label: "BOM Management" }]}
      title="BOM Management & Mandatory Pre-Cost Linkage"
      subtitle="Ensuring 100% item-level traceability between commercial costing baselines and operational requirements"
      actions={
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Order BOM</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Core Linkage Rule Banner */}
        <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <LinkIcon className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Mandatory Pre-Costing Linkage:</strong> Every BOM item references a persistent{" "}
              <code className="font-mono font-bold text-teal-800 dark:text-teal-200">preCostItemId</code>. Updating a
              BOM does <em>not</em> modify approved Pre-Costing records. New or unmatched items are explicitly tagged
              as "UNMATCHED-NEW" with exception tracking.
            </span>
          </div>
          <span className="font-bold text-teal-700 dark:text-teal-400 font-mono text-[11px] shrink-0">
            Enforced by Architecture
          </span>
        </div>

        {/* BOM Selector & Details Header */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Order BOM:</span>
            <select
              value={selectedBom?.id || ""}
              onChange={(e) => {
                const found = boms.find((b) => b.id === e.target.value);
                if (found) setSelectedBom(found);
              }}
              className="p-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 outline-none"
            >
              {boms.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bomId} — {b.orderNo} ({b.styleNo})
                </option>
              ))}
            </select>
          </div>

          {selectedBom && (
            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Linked Pre-Cost</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedBom.preCostId} v{selectedBom.preCostVersion}
                </span>
              </div>
              <div className="text-right border-l pl-4 border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Estimated BOM Cost</span>
                <span className="font-mono font-extrabold text-teal-600">
                  ${selectedBom.totalBomCost.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                </span>
              </div>
              <button
                onClick={handleAddUnmatchedItem}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 hover:bg-amber-100 flex items-center gap-1"
                title="Add Unmatched / Additional Item"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Unmatched Item</span>
              </button>
            </div>
          )}
        </div>

        {/* BOM Items Table */}
        {selectedBom && (
          <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-3">BOM Item ID</th>
                    <th className="py-3 px-3">Pre-Cost Item ID</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Item Description & Specification</th>
                    <th className="py-3 px-3">Body Part</th>
                    <th className="py-3 px-3">UoM</th>
                    <th className="py-3 px-3">Pre-Cost Rate ($)</th>
                    <th className="py-3 px-3">BOM Req Qty</th>
                    <th className="py-3 px-3">Estimated Cost ($)</th>
                    <th className="py-3 px-3">Linkage Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedBom.items.map((item) => (
                    <tr
                      key={item.bomItemId}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${
                        item.isUnmatchedAdditional ? "bg-amber-50/40 dark:bg-amber-950/20" : ""
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {item.bomItemId}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        {item.isUnmatchedAdditional ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                            UNMATCHED-NEW
                          </span>
                        ) : (
                          <span className="text-teal-600 dark:text-teal-400 font-bold">{item.preCostItemId}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-medium">{item.category}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block">{item.itemDescription}</span>
                        <span className="text-[10px] text-slate-400">{item.specification}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{item.bodyPartOrUsedPlace}</td>
                      <td className="py-3 px-3 text-center font-bold">{item.bomUnit}</td>
                      <td className="py-3 px-3 font-mono">
                        {item.preCostRate > 0 ? `$${item.preCostRate.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {item.bomTotalRequiredQty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                        ${item.bomEstimatedCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        {item.isUnmatchedAdditional ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Additional Unmatched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Linked to Pre-Cost
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CREATE / POPULATE BOM MODAL ────────────────────────────────────── */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Generate Order BOM</h3>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  Select a confirmed Main Order to generate its Bill of Materials. The system will automatically link
                  each item to the approved Pre-Costing version and retain historical baseline rates.
                </p>

                <div>
                  <label className="block font-bold mb-1">Select Main Order:</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full p-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNo} — {o.buyerName} | Style {o.styleNo} ({o.orderQuantity.toLocaleString()} pcs)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateBom}
                  className="px-5 py-2 rounded text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  Generate & Link BOM Items
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
