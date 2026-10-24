import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMPreCosting,
  MMPreCostItem,
  ApprovalStatus,
  GarmentBusinessType,
} from "../lib/marketing-merchandising-data";
import {
  Calculator,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  GitBranch,
  Layers,
  ArrowRight,
  Save,
  AlertTriangle,
  History,
  FileCheck,
  Percent,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-pre-costing")({
  head: () => ({
    meta: [
      { title: "Style Pre-Costing Management — CriptonHRIS" },
      {
        name: "description",
        content: "Style-wise item-level pre-costing, revision amendments with visual diff comparison, and approval control.",
      },
    ],
  }),
  component: MMPreCostingPage,
});

function MMPreCostingPage() {
  const searchParams = useSearch({ strict: false }) as { quotationId?: string; tab?: string };
  const [preCostings, setPreCostings] = useState<MMPreCosting[]>([]);
  const [policy, setPolicy] = useState(MMRepository.getPolicy());
  const [selectedCosting, setSelectedCosting] = useState<MMPreCosting | null>(null);
  const [activeTab, setActiveTab] = useState<"register" | "create" | "compare">("register");

  // Comparison view state
  const [diffCosting, setDiffCosting] = useState<MMPreCosting | null>(null);

  // Amendment modal state
  const [amendModalOpen, setAmendModalOpen] = useState(false);
  const [targetAmendCosting, setTargetAmendCosting] = useState<MMPreCosting | null>(null);
  const [amendReason, setAmendReason] = useState("");

  // Create Costing Form state
  const [formPreCostId, setFormPreCostId] = useState("");
  const [formStyleNo, setFormStyleNo] = useState("HM-KT-8842");
  const [formStyleDesc, setFormStyleDesc] = useState("Ladies Henley Tee");
  const [formGarmentType, setFormGarmentType] = useState<GarmentBusinessType>("Knit");
  const [formBuyer, setFormBuyer] = useState("H&M Hennes & Mauritz");
  const [formSeason, setFormSeason] = useState("Autumn / Winter 2026");
  const [formCmCost, setFormCmCost] = useState<number>(6.50);
  const [formCommercialPct, setFormCommercialPct] = useState<number>(3.5);
  const [formProfitPct, setFormProfitPct] = useState<number>(8.0);
  const [formOfferedFob, setFormOfferedFob] = useState<number>(4.85);

  const [formItems, setFormItems] = useState<MMPreCostItem[]>([
    {
      preCostItemId: "PCI-NEW-1",
      category: "Fabric",
      itemCode: "FAB-KT-001",
      itemDescription: "100% Combed Cotton 2x2 Rib 220 GSM",
      specification: "Bio-polished, Reactive dyed",
      bodyPartOrUsedPlace: "Main Body",
      consumptionPerPc: 0.28,
      unit: "Kg",
      wastagePct: 5.0,
      requiredQtyWithWastage: 3.528,
      unitRate: 4.20,
      totalAmountPerDzn: 14.82,
      supplierNominee: "Pakiza Knitting & Dyeing",
    },
    {
      preCostItemId: "PCI-NEW-2",
      category: "Accessories",
      itemCode: "ACC-BTN-01",
      itemDescription: "Shell Button 18L",
      specification: "4 Holes DTM",
      bodyPartOrUsedPlace: "Placket (3 pcs)",
      consumptionPerPc: 3,
      unit: "Pcs",
      wastagePct: 3.0,
      requiredQtyWithWastage: 37.08,
      unitRate: 0.035,
      totalAmountPerDzn: 1.30,
      supplierNominee: "Dekko Buttons Ltd",
    },
    {
      preCostItemId: "PCI-NEW-3",
      category: "Accessories",
      itemCode: "ACC-LBL-01",
      itemDescription: "Woven Main Brand Tag",
      specification: "Damask 45x20mm",
      bodyPartOrUsedPlace: "Back Neck",
      consumptionPerPc: 1,
      unit: "Pcs",
      wastagePct: 2.0,
      requiredQtyWithWastage: 12.24,
      unitRate: 0.045,
      totalAmountPerDzn: 0.55,
      supplierNominee: "Avery Dennison BD",
    },
  ]);

  useEffect(() => {
    setPreCostings(MMRepository.getPreCostings());
    setPolicy(MMRepository.getPolicy());
    if (searchParams?.tab === "compare") {
      setActiveTab("compare");
    } else if (searchParams?.tab === "create") {
      setActiveTab("create");
    }
  }, [searchParams]);

  // Calculations for form items total
  const formMaterialsTotalDzn = useMemo(() => {
    return formItems.reduce((acc, item) => acc + (Number(item.totalAmountPerDzn) || 0), 0);
  }, [formItems]);

  const formCommercialCostDzn = useMemo(() => {
    return (formMaterialsTotalDzn + formCmCost) * (formCommercialPct / 100);
  }, [formMaterialsTotalDzn, formCmCost, formCommercialPct]);

  const formProfitDzn = useMemo(() => {
    return (formMaterialsTotalDzn + formCmCost + formCommercialCostDzn) * (formProfitPct / 100);
  }, [formMaterialsTotalDzn, formCmCost, formCommercialCostDzn, formProfitPct]);

  const formTotalCostDzn = useMemo(() => {
    return formMaterialsTotalDzn + formCmCost + formCommercialCostDzn + formProfitDzn;
  }, [formMaterialsTotalDzn, formCmCost, formCommercialCostDzn, formProfitDzn]);

  const formCostPerPc = useMemo(() => formTotalCostDzn / 12, [formTotalCostDzn]);

  const handleApprove = (pc: MMPreCosting) => {
    const updated: MMPreCosting = {
      ...pc,
      status: "Approved",
      approvedBy: "Rashidul Islam (Head of Merchandising)",
      approvalDate: new Date().toISOString().replace("T", " ").substring(0, 19),
      isCurrentActive: true,
    };
    MMRepository.savePreCosting(updated);
    setPreCostings(MMRepository.getPreCostings());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "PreCosting",
      entityId: pc.preCostId,
      action: "Approve",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Pre-Costing ${pc.preCostId} v${pc.version} approved ($${pc.totalCostPerDzn.toFixed(2)}/dzn). Activated for BOM & Main Orders.`,
    });
    toast.success(`Pre-Costing ${pc.preCostId} v${pc.version} approved.`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = `PC-2026-00${preCostings.length + 3}`;
    const initialStatus: ApprovalStatus = policy.preCostingApprovalRequired ? "Pending Approval" : "Approved";

    const newCosting: MMPreCosting = {
      id: `pc-${Date.now()}`,
      preCostId: nextId,
      styleNo: formStyleNo,
      styleDescription: formStyleDesc,
      garmentType: formGarmentType,
      season: formSeason,
      buyerName: formBuyer,
      currency: "USD",
      version: 1,
      isCurrentActive: !policy.preCostingApprovalRequired,
      status: initialStatus,
      items: formItems,
      cmCostPerDzn: formCmCost,
      commercialCostPct: formCommercialPct,
      commercialCostPerDzn: formCommercialCostDzn,
      profitPct: formProfitPct,
      profitPerDzn: formProfitDzn,
      totalCostPerDzn: formTotalCostDzn,
      costPerPc: formCostPerPc,
      offeredFobPerPc: formOfferedFob,
      approvedBy: policy.preCostingApprovalRequired ? undefined : "Auto-Approved by Company Policy",
      approvalDate: policy.preCostingApprovalRequired ? undefined : new Date().toISOString().slice(0, 10),
      createdBy: "Rashidul Islam (Head of Merchandising)",
      createdDate: new Date().toISOString().slice(0, 10),
    };

    MMRepository.savePreCosting(newCosting);
    setPreCostings(MMRepository.getPreCostings());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "PreCosting",
      entityId: newCosting.preCostId,
      action: "Create",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Created Style Pre-Costing ${newCosting.preCostId} for ${newCosting.styleNo}. Status: ${newCosting.status}`,
    });

    setActiveTab("register");
    toast.success(`Style Pre-Costing ${newCosting.preCostId} created successfully.`);
  };

  // Initiate Amendment Workflow
  const handleInitiateAmendment = (pc: MMPreCosting) => {
    if (policy.postApprovalPreCostingRestrictions === "StrictLock") {
      toast.error("Company policy strictly locks approved Pre-Costings. Amendments are prohibited.");
      return;
    }
    setTargetAmendCosting(pc);
    setAmendReason("");
    setAmendModalOpen(true);
  };

  const confirmAmendment = () => {
    if (!targetAmendCosting) return;
    if (!amendReason.trim()) {
      toast.error("Please enter a mandatory amendment justification reason.");
      return;
    }

    // Clone and create new version
    const newVersionNumber = targetAmendCosting.version + 1;
    const amendedItems = targetAmendCosting.items.map((item) => {
      // Modify second item slightly to demonstrate revision comparison diff
      if (item.category === "Accessories") {
        return {
          ...item,
          unitRate: Number((item.unitRate * 1.05).toFixed(4)),
          totalAmountPerDzn: Number((item.totalAmountPerDzn * 1.05).toFixed(2)),
        };
      }
      return { ...item };
    });

    // Add a new item to demonstrate added element in diff
    amendedItems.push({
      preCostItemId: `PCI-REV-${newVersionNumber}-NEW`,
      category: "Trims",
      itemCode: "TRM-HT-01",
      itemDescription: "FSC Recycled Hang Tag & String",
      specification: "Buyer nominated eco-tag",
      bodyPartOrUsedPlace: "Main Tag",
      consumptionPerPc: 1,
      unit: "Pcs",
      wastagePct: 2.0,
      requiredQtyWithWastage: 12.24,
      unitRate: 0.05,
      totalAmountPerDzn: 0.61,
      supplierNominee: "Avery Dennison BD",
    });

    const amendedTotalDzn = amendedItems.reduce((acc, i) => acc + i.totalAmountPerDzn, 0) + targetAmendCosting.cmCostPerDzn;

    const revisedCosting: MMPreCosting = {
      ...targetAmendCosting,
      id: `pc-${Date.now()}`,
      version: newVersionNumber,
      status: "Pending Approval", // Must be re-approved!
      isCurrentActive: false, // Previous version remains active until approved!
      amendmentReason: amendReason.trim(),
      items: amendedItems,
      totalCostPerDzn: amendedTotalDzn,
      costPerPc: amendedTotalDzn / 12,
      previousVersionSnapshot: {
        version: targetAmendCosting.version,
        items: targetAmendCosting.items,
        totalCostPerDzn: targetAmendCosting.totalCostPerDzn,
        offeredFobPerPc: targetAmendCosting.offeredFobPerPc,
        approvalDate: targetAmendCosting.approvalDate,
      },
      createdDate: new Date().toISOString().slice(0, 10),
    };

    MMRepository.savePreCosting(revisedCosting);
    setPreCostings(MMRepository.getPreCostings());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "PreCosting",
      entityId: targetAmendCosting.preCostId,
      action: "Amend",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Created Amendment Version ${newVersionNumber} for ${targetAmendCosting.preCostId}. Reason: ${amendReason.trim()}`,
    });

    setAmendModalOpen(false);
    setDiffCosting(revisedCosting);
    setActiveTab("compare");
    toast.success(`Amendment v${newVersionNumber} created! Ready for revision comparison and re-approval.`);
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-pre-costing"
      breadcrumbs={[{ label: "Style Pre-Costing" }]}
      title="Style-wise Pre-Costing Management"
      subtitle="Item-level costing with persistent identifiers (preCostItemId), multi-version revisions, and visual diff analysis"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "register" ? "bg-teal-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border"
            }`}
          >
            Costing Register
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === "create" ? "bg-teal-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Pre-Costing</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Policy Notice */}
        <div className="p-3 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Item-Level Identifier Rule:</strong> Every fabric and trim item carries a persistent{" "}
              <code className="font-mono font-bold text-teal-800 dark:text-teal-200">preCostItemId</code> linked
              directly to downstream BOM and Booking items.
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-400">
            Policy: {policy.postApprovalPreCostingRestrictions}
          </span>
        </div>

        {/* ── TAB 1: PRE-COSTING REGISTER ────────────────────────────────────── */}
        {activeTab === "register" && (
          <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-3">Pre-Cost ID</th>
                    <th className="py-3 px-3">Version</th>
                    <th className="py-3 px-3">Buyer & Season</th>
                    <th className="py-3 px-3">Style No & Description</th>
                    <th className="py-3 px-3">Garment Type</th>
                    <th className="py-3 px-3">Items Count</th>
                    <th className="py-3 px-3">Cost / Dzn ($)</th>
                    <th className="py-3 px-3">Offered FOB ($)</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {preCostings.map((pc) => (
                    <tr key={pc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                        {pc.preCostId}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">
                          v{pc.version}
                        </span>
                        {pc.isCurrentActive && (
                          <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold uppercase">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block">{pc.buyerName}</span>
                        <span className="text-[10px] text-slate-400">{pc.season}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block">{pc.styleNo}</span>
                        <span className="text-[10px] text-slate-400">{pc.styleDescription}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                          {pc.garmentType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">{pc.items.length} items</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        ${pc.totalCostPerDzn.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-semibold">
                        ${pc.offeredFobPerPc.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            pc.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : pc.status === "Pending Approval"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {pc.status === "Approved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {pc.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCosting(pc)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-600"
                            title="View Costing Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {pc.status === "Pending Approval" && (
                            <button
                              onClick={() => handleApprove(pc)}
                              className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-300"
                              title="Approve Costing"
                            >
                              Approve
                            </button>
                          )}

                          {pc.status === "Approved" && (
                            <button
                              onClick={() => handleInitiateAmendment(pc)}
                              className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 text-[11px] font-bold border border-amber-300 flex items-center gap-1"
                              title="Amend / Create Revision"
                            >
                              <GitBranch className="w-3 h-3" /> Amend
                            </button>
                          )}

                          {pc.previousVersionSnapshot && (
                            <button
                              onClick={() => {
                                setDiffCosting(pc);
                                setActiveTab("compare");
                              }}
                              className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold border border-indigo-300"
                              title="View Revision Diff Comparison"
                            >
                              Diff
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: CREATE NEW STYLE PRE-COSTING ────────────────────────────── */}
        {activeTab === "create" && (
          <form onSubmit={handleCreateSubmit} className="space-y-5 text-xs">
            <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                1. General Style & Commercial Basis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold mb-1">Style Number *</label>
                  <input
                    type="text"
                    value={formStyleNo}
                    onChange={(e) => setFormStyleNo(e.target.value)}
                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-800 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Buyer *</label>
                  <input
                    type="text"
                    value={formBuyer}
                    onChange={(e) => setFormBuyer(e.target.value)}
                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Garment Business Type</label>
                  <select
                    value={formGarmentType}
                    onChange={(e) => setFormGarmentType(e.target.value as any)}
                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-800 font-bold text-teal-600"
                  >
                    <option value="Knit">Knit Garments</option>
                    <option value="Woven">Woven Garments</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Season</label>
                  <input
                    type="text"
                    value={formSeason}
                    onChange={(e) => setFormSeason(e.target.value)}
                    className="w-full p-2 rounded border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Individual Item-Level Costing Table */}
            <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    2. Individual Item-wise Estimation (Fabric, Accessories, Trims)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Maintained at individual item level with persistent <strong>preCostItemId</strong> references
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormItems((prev) => [
                      ...prev,
                      {
                        preCostItemId: `PCI-NEW-${prev.length + 1}`,
                        category: "Accessories",
                        itemCode: "ACC-NEW",
                        itemDescription: "New Accessory Item",
                        specification: "Standard Spec",
                        bodyPartOrUsedPlace: "Placement",
                        consumptionPerPc: 1,
                        unit: "Pcs",
                        wastagePct: 2.0,
                        requiredQtyWithWastage: 12.24,
                        unitRate: 0.10,
                        totalAmountPerDzn: 1.22,
                      },
                    ])
                  }
                  className="px-2.5 py-1 text-xs font-bold rounded bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-300"
                >
                  + Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="py-2 px-2">Item ID</th>
                      <th className="py-2 px-2">Category</th>
                      <th className="py-2 px-2">Item Description</th>
                      <th className="py-2 px-2">UoM</th>
                      <th className="py-2 px-2">Cons/Pc</th>
                      <th className="py-2 px-2">Wastage %</th>
                      <th className="py-2 px-2">Unit Rate ($)</th>
                      <th className="py-2 px-2">Amount / Dzn ($)</th>
                      <th className="py-2 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {formItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-2 font-mono font-bold text-teal-600">{item.preCostItemId}</td>
                        <td className="py-2 px-2">
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const updated = [...formItems];
                              updated[idx].category = e.target.value as any;
                              setFormItems(updated);
                            }}
                            className="p-1 rounded border bg-white dark:bg-slate-800 text-[11px]"
                          >
                            <option value="Fabric">Fabric</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Trims">Trims</option>
                            <option value="Wash">Wash</option>
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.itemDescription}
                            onChange={(e) => {
                              const updated = [...formItems];
                              updated[idx].itemDescription = e.target.value;
                              setFormItems(updated);
                            }}
                            className="w-56 p-1 rounded border bg-white dark:bg-slate-800 text-[11px]"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => {
                              const updated = [...formItems];
                              updated[idx].unit = e.target.value;
                              setFormItems(updated);
                            }}
                            className="w-14 p-1 rounded border bg-white dark:bg-slate-800 text-center text-[11px]"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.consumptionPerPc}
                            onChange={(e) => {
                              const updated = [...formItems];
                              const cons = parseFloat(e.target.value) || 0;
                              updated[idx].consumptionPerPc = cons;
                              const reqDzn = cons * 12 * (1 + updated[idx].wastagePct / 100);
                              updated[idx].requiredQtyWithWastage = reqDzn;
                              updated[idx].totalAmountPerDzn = Number((reqDzn * updated[idx].unitRate).toFixed(2));
                              setFormItems(updated);
                            }}
                            className="w-16 p-1 rounded border bg-white dark:bg-slate-800 text-[11px]"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.1"
                            value={item.wastagePct}
                            onChange={(e) => {
                              const updated = [...formItems];
                              const wst = parseFloat(e.target.value) || 0;
                              updated[idx].wastagePct = wst;
                              const reqDzn = updated[idx].consumptionPerPc * 12 * (1 + wst / 100);
                              updated[idx].requiredQtyWithWastage = reqDzn;
                              updated[idx].totalAmountPerDzn = Number((reqDzn * updated[idx].unitRate).toFixed(2));
                              setFormItems(updated);
                            }}
                            className="w-14 p-1 rounded border bg-white dark:bg-slate-800 text-[11px]"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.001"
                            value={item.unitRate}
                            onChange={(e) => {
                              const updated = [...formItems];
                              const rate = parseFloat(e.target.value) || 0;
                              updated[idx].unitRate = rate;
                              updated[idx].totalAmountPerDzn = Number(
                                (updated[idx].requiredQtyWithWastage * rate).toFixed(2)
                              );
                              setFormItems(updated);
                            }}
                            className="w-20 p-1 rounded border bg-white dark:bg-slate-800 font-mono text-[11px]"
                          />
                        </td>
                        <td className="py-2 px-2 font-mono font-bold text-slate-900 dark:text-white">
                          ${item.totalAmountPerDzn.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setFormItems((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Costing Summary Box */}
            <div className="p-5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-2.5 rounded bg-white dark:bg-slate-800 border">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Materials / Dzn</span>
                  <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    ${formMaterialsTotalDzn.toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-slate-800 border">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">CM / Dzn</span>
                  <input
                    type="number"
                    step="0.1"
                    value={formCmCost}
                    onChange={(e) => setFormCmCost(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono font-bold text-xs p-1 rounded border"
                  />
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-slate-800 border">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Commercial Cost</span>
                  <span className="text-xs font-mono font-bold">
                    ${formCommercialCostDzn.toFixed(2)} ({formCommercialPct}%)
                  </span>
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-slate-800 border">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Margin/Profit</span>
                  <span className="text-xs font-mono font-bold text-teal-600">
                    ${formProfitDzn.toFixed(2)} ({formProfitPct}%)
                  </span>
                </div>
                <div className="p-2.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700">
                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-bold uppercase block">
                    Total Estimated FOB/Pc
                  </span>
                  <span className="text-base font-mono font-extrabold text-teal-700 dark:text-teal-300">
                    ${(formTotalCostDzn / 12).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  Save & Submit Pre-Costing
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── TAB 3: VISUAL AMENDMENT DIFF COMPARISON ─────────────────────────── */}
        {activeTab === "compare" && diffCosting && (
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-indigo-600" />
                  Pre-Costing Revision Comparison Diff (v{diffCosting.version} vs Approved v
                  {diffCosting.previousVersionSnapshot?.version || 1})
                </h3>
                <p className="text-xs text-slate-500">
                  Amendment Reason: <em>"{diffCosting.amendmentReason || "Supplier price escalation"}"</em>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 font-bold text-xs border border-amber-300">
                  Status: {diffCosting.status}
                </span>
                {diffCosting.status === "Pending Approval" && (
                  <button
                    onClick={() => handleApprove(diffCosting)}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  >
                    Approve Revised Version
                  </button>
                )}
              </div>
            </div>

            {/* Visual Diff Legend */}
            <div className="flex items-center gap-4 text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="font-bold text-slate-700 dark:text-slate-300">Diff Legend:</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400" /> Added Item (Green)
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-400" /> Modified Item (Amber)
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
                <span className="w-3 h-3 rounded bg-rose-100 border border-rose-400" /> Removed Item (Red)
              </span>
            </div>

            {/* Comparison Item Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Item ID</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">Previous Rate ($)</th>
                    <th className="py-2.5 px-3">Proposed Revised Rate ($)</th>
                    <th className="py-2.5 px-3">Previous Amount / Dzn</th>
                    <th className="py-2.5 px-3">Proposed Amount / Dzn</th>
                    <th className="py-2.5 px-3">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {diffCosting.items.map((item, idx) => {
                    const prevItem = diffCosting.previousVersionSnapshot?.items.find(
                      (p) => p.preCostItemId === item.preCostItemId
                    );
                    const isNew = !prevItem;
                    const isModified = prevItem && (prevItem.unitRate !== item.unitRate || prevItem.totalAmountPerDzn !== item.totalAmountPerDzn);

                    let rowClass = "hover:bg-slate-50/50";
                    if (isNew) rowClass = "bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200";
                    else if (isModified) rowClass = "bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200";

                    return (
                      <tr key={idx} className={rowClass}>
                        <td className="py-2.5 px-3 font-mono font-bold">{item.preCostItemId}</td>
                        <td className="py-2.5 px-3">{item.category}</td>
                        <td className="py-2.5 px-3 font-semibold">{item.itemDescription}</td>
                        <td className="py-2.5 px-3 font-mono">{prevItem ? `$${prevItem.unitRate.toFixed(4)}` : "—"}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">${item.unitRate.toFixed(4)}</td>
                        <td className="py-2.5 px-3 font-mono">{prevItem ? `$${prevItem.totalAmountPerDzn.toFixed(2)}` : "—"}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">${item.totalAmountPerDzn.toFixed(2)}</td>
                        <td className="py-2.5 px-3 font-bold">
                          {isNew && <span className="text-emerald-700">+ NEW ITEM</span>}
                          {isModified && (
                            <span className="text-amber-700">
                              Δ +${(item.totalAmountPerDzn - (prevItem?.totalAmountPerDzn || 0)).toFixed(2)}
                            </span>
                          )}
                          {!isNew && !isModified && <span className="text-slate-400">Unchanged</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Diff Summary */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Cost Summary Diff: Previous Active v{diffCosting.previousVersionSnapshot?.version} ($
                {diffCosting.previousVersionSnapshot?.totalCostPerDzn.toFixed(2)}/dzn) → Revised v{diffCosting.version}{" "}
                (${diffCosting.totalCostPerDzn.toFixed(2)}/dzn)
              </span>
              <span className="font-mono font-extrabold text-indigo-600">
                Δ ${(diffCosting.totalCostPerDzn - (diffCosting.previousVersionSnapshot?.totalCostPerDzn || 0)).toFixed(2)}{" "}
                USD / Dzn
              </span>
            </div>
          </div>
        )}

        {/* ── MODAL: INITIATE AMENDMENT JUSTIFICATION ────────────────────────── */}
        {amendModalOpen && targetAmendCosting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <GitBranch className="w-5 h-5 text-amber-500" />
                <span>Amend Style Pre-Costing ({targetAmendCosting.preCostId})</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Initiating an amendment will preserve current approved <strong>v{targetAmendCosting.version}</strong> as
                active until the revised <strong>v{targetAmendCosting.version + 1}</strong> is formally approved.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Amendment Reason:
                </label>
                <textarea
                  rows={3}
                  value={amendReason}
                  onChange={(e) => setAmendReason(e.target.value)}
                  placeholder="e.g. Yarn price escalation of $0.15/kg notified by spinning mill..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setAmendModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAmendment}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Create Revision v{targetAmendCosting.version + 1}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
