import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  FileText,
  Monitor,
  Laptop,
  Plus,
  Send,
  UserCheck,
  Package,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  Search,
  Eye,
  X,
  Printer,
  Minus,
  ArrowLeft,
  Cpu,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ssp-ict-product-budget-request")({
  head: () => ({
    meta: [
      { title: "ICT Product Budget Request — CRIPTON" },
      {
        name: "description",
        content:
          "Submit monthly purchase requests for ICT hardware, monitors, toner, network parts, and IT accessories.",
      },
    ],
  }),
  component: ICTProductBudgetRequestPage,
});

interface RequisitionItem {
  id: string;
  item: string;
  quantity: string;
  justification: string;
  forUse: string;
}

interface BudgetRequestRecord {
  id: string;
  reqType: string;
  items: RequisitionItem[];
  onBehalf: boolean;
  onBehalfEmp?: string;
  date: string;
  status: "Pending HOD" | "Approved" | "Under Review";
}

const ICT_PRODUCTS = [
  'Dell 24" IPS Monitor',
  "Desktop Computer Core i5",
  "Laptop Core i7 16GB RAM",
  "Logitech Wireless Keyboard & Mouse Combo",
  "Logitech USB Headset with Mic",
  "16GB DDR4 RAM 3200MHz",
  "512GB NVMe M.2 SSD",
  "HP LaserJet Pro MFP Printer",
  "HP 85A Black Toner Cartridge",
  "Cisco 24-Port Gigabit Switch",
  "Cat6 UTP Cable Roll (305m)",
  "RJ45 Connectors (Pack of 100)",
  "APC 1200VA Offline UPS",
  "HDMI to Type-C Converter Cable",
  "Logitech C922 Pro Webcam",
  "USB 3.0 4-Port Hub",
  "Laptop Charger 65W Type-C",
  "Ethernet LAN Adapter USB-C",
];

const DUMMY_EMPLOYEES = [
  { id: "emp1", name: "Md. Anik Islam", role: "Deputy Manager", dept: "HR & Admin" },
  { id: "emp2", name: "Rajebul Hasan Rajon", role: "Executive", dept: "IT Systems" },
  { id: "emp3", name: "Md. Zahidul Islam", role: "COO", dept: "Operations" },
  { id: "emp4", name: "Tahmid Afsar Shapno", role: "Software Engineer", dept: "Tech" },
  { id: "emp5", name: "Ayesha Siddiqua", role: "Senior Accountant", dept: "Finance" },
  { id: "emp6", name: "Kazi Farhan", role: "Procurement Officer", dept: "Supply Chain" },
];

const QUICK_ICT_JUSTIFICATIONS = [
  "Monitor flickering replacement in testing workstation",
  "RAM/SSD performance upgrade for software development",
  "Exhausted toner replenishment for admin department printer",
  "Workstation peripheral setup for newly onboarded engineer",
  "Network switch port expansion for production floor",
];

function ICTProductBudgetRequestPage() {
  // Form State
  const [reqType, setReqType] = useState("Monthly Purchase Request");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [justification, setJustification] = useState("");

  // Items List
  const [items, setItems] = useState<RequisitionItem[]>([]);

  // On Behalf
  const [onBehalf, setOnBehalf] = useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = useState(
    `${DUMMY_EMPLOYEES[1].name} (${DUMMY_EMPLOYEES[1].role} - ${DUMMY_EMPLOYEES[1].dept})`
  );

  // Search in ledger
  const [searchLedger, setSearchLedger] = useState("");
  const [selectedViewRecord, setSelectedViewRecord] = useState<BudgetRequestRecord | null>(null);

  // Saved requests in local storage
  const [savedRequests, setSavedRequests] = useState<BudgetRequestRecord[]>(() => {
    const saved = localStorage.getItem("ssp_ict_budget_requests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: "REQ-2026-ICT-001",
        reqType: "Monthly Purchase Request",
        items: [
          {
            id: "1",
            item: 'Dell 24" IPS Monitor',
            quantity: "1",
            justification: "Station monitor flickering replacement in testing lab",
            forUse: "Department Uses",
          },
        ],
        onBehalf: true,
        onBehalfEmp: "Rajebul Hasan Rajon (Executive - IT Systems)",
        date: "08/09/2026",
        status: "Approved",
      },
      {
        id: "REQ-2026-ICT-002",
        reqType: "Regular Purchase Request",
        items: [
          {
            id: "2",
            item: "HP 85A Black Toner Cartridge",
            quantity: "2",
            justification: "Printer toner exhausted in HR Documentation room",
            forUse: "Department Uses",
          },
          {
            id: "3",
            item: "Logitech Wireless Keyboard & Mouse Combo",
            quantity: "3",
            justification: "Required for new engineering recruits",
            forUse: "Department Uses",
          },
        ],
        onBehalf: false,
        date: "07/09/2026",
        status: "Pending HOD",
      },
    ];
  });

  // Stepper helpers
  const handleIncQty = () => {
    const val = parseInt(quantity) || 0;
    setQuantity(String(val + 1));
  };

  const handleDecQty = () => {
    const val = parseInt(quantity) || 1;
    if (val > 1) setQuantity(String(val - 1));
  };

  // Handle Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) {
      toast.error("Please enter or select an ICT Product!");
      return;
    }
    if (!quantity.trim() || Number(quantity) <= 0) {
      toast.error("Please enter a valid Quantity!");
      return;
    }
    if (!justification.trim()) {
      toast.error("Please provide a Justification!");
      return;
    }

    const newItem: RequisitionItem = {
      id: Date.now().toString(),
      item: product.trim(),
      quantity: quantity.trim(),
      justification: justification.trim(),
      forUse: onBehalf ? onBehalfEmp : "Department Uses",
    };

    setItems((prev) => [...prev, newItem]);
    toast.success(`Added "${newItem.item}" to ICT requisition list!`);

    // Reset fields for rapid entry
    setProduct("");
    setQuantity("1");
    setJustification("");
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    if (confirm("Are you sure you want to clear all items in this ICT draft?")) {
      setItems([]);
      toast.info("Cleared all items from draft.");
    }
  };

  // Handle Submit Entire Request
  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Please add at least one ICT item before submitting!");
      return;
    }

    const newReqId = `REQ-2026-ICT-${String(savedRequests.length + 1).padStart(3, "0")}`;

    const newRecord: BudgetRequestRecord = {
      id: newReqId,
      reqType,
      items,
      onBehalf,
      onBehalfEmp: onBehalf ? onBehalfEmp : undefined,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Pending HOD",
    };

    const updated = [newRecord, ...savedRequests];
    setSavedRequests(updated);
    localStorage.setItem("ssp_ict_budget_requests", JSON.stringify(updated));

    toast.success(
      `ICT Requisition ${newReqId} submitted successfully! Forwarded to IT HOD for approval.`
    );

    // Reset Form
    setItems([]);
    setProduct("");
    setQuantity("1");
    setJustification("");
  };

  const totalQtyCount = useMemo(() => {
    return items.reduce((acc, it) => acc + (parseInt(it.quantity) || 0), 0);
  }, [items]);

  const filteredRecords = useMemo(() => {
    if (!searchLedger.trim()) return savedRequests;
    const q = searchLedger.toLowerCase();
    return savedRequests.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.reqType.toLowerCase().includes(q) ||
        (r.onBehalfEmp && r.onBehalfEmp.toLowerCase().includes(q))
    );
  }, [savedRequests, searchLedger]);

  return (
    <div className="min-h-screen flex bg-[#f1f5f9] text-slate-800 transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto w-full">
          
          {/* ══════════════════════════════════════════════════════════════════════════
              ELEGANT HEADER & BREADCRUMB BAR
              ══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3 text-slate-400" />
                <Link to="/ssp-new-requisition" className="hover:text-blue-600 transition-colors">
                  SSP
                </Link>
                <ChevronRight className="size-3 text-slate-400" />
                <Link to="/ssp-new-requisition" className="hover:text-blue-600 transition-colors">
                  New Requisition
                </Link>
                <ChevronRight className="size-3 text-slate-400" />
                <span className="text-cyan-600 font-bold">ICT Product Budget Request</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-xs">
                  <Monitor className="size-4.5" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  ICT Product Budget Request
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ICT Hardware & Consumables
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/ssp-new-requisition"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Hub</span>
              </Link>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              FORM CONTAINER: Matches Screenshot 1 with Rich Aesthetics
              ══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Top subtle cyan accent bar */}
            <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* ── LEFT PANEL: Form Fields (Cols 1-5) ───────────────────────── */}
                <form
                  onSubmit={handleAddItem}
                  className="lg:col-span-5 space-y-5 lg:pr-8 lg:border-r lg:border-slate-200"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Cpu className="size-3.5 text-cyan-600" />
                      Configure ICT Item
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Step 1 of 2
                    </span>
                  </div>

                  {/* Req. Type * */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Req. Type <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={reqType}
                        onChange={(e) => setReqType(e.target.value)}
                        className="w-full appearance-none bg-slate-50/50 hover:bg-slate-50 border-0 border-b-2 border-slate-300 focus:border-cyan-500 focus:bg-cyan-50/10 focus:ring-0 text-sm font-medium text-slate-800 px-2 py-2 pr-8 cursor-pointer outline-none transition-all rounded-t-sm"
                      >
                        <option value="Monthly Purchase Request">
                          Monthly Purchase Request
                        </option>
                        <option value="Regular Purchase Request">
                          Regular Purchase Request
                        </option>
                      </select>
                      <ChevronDown className="size-4 text-slate-500 pointer-events-none absolute right-2 top-3" />
                    </div>
                  </div>

                  {/* Product * (No Category dropdown in Screenshot 1!) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700">
                      Product <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        list="ict-products-list"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="Type or select ICT hardware/accessory..."
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border-0 border-b-2 border-slate-300 focus:border-cyan-500 focus:bg-cyan-50/10 focus:ring-0 text-sm font-medium text-slate-800 px-2 py-2 outline-none placeholder:text-slate-400 transition-all rounded-t-sm"
                      />
                      <datalist id="ict-products-list">
                        {ICT_PRODUCTS.map((p) => (
                          <option key={p} value={p} />
                        ))}
                      </datalist>
                    </div>

                    {/* Quick Popular ICT Chips */}
                    <div className="pt-1">
                      <div className="text-[10.5px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                        <span>Frequent ICT Items:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Dell 24" IPS Monitor',
                          "Logitech Wireless Combo",
                          "HP 85A Toner",
                          "512GB NVMe SSD",
                          "16GB DDR4 RAM",
                          "APC 1200VA UPS",
                        ].map((chip) => (
                          <button
                            type="button"
                            key={chip}
                            onClick={() => setProduct(chip)}
                            className="text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 text-slate-600 transition-colors"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quantity * with Stepper */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Quantity <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleDecQty}
                        className="size-8 rounded border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                        title="Decrease"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="1"
                        className="flex-1 bg-slate-50/50 hover:bg-slate-50 border-0 border-b-2 border-slate-300 focus:border-cyan-500 focus:bg-cyan-50/10 focus:ring-0 text-sm font-semibold text-center text-slate-800 px-2 py-1.5 outline-none transition-all rounded-t-sm"
                      />
                      <button
                        type="button"
                        onClick={handleIncQty}
                        className="size-8 rounded border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                        title="Increase"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Justification * with quick presets */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700">
                      Justification <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Enter justification or click preset below..."
                      className="w-full bg-slate-50/50 hover:bg-slate-50 border-0 border-b-2 border-slate-300 focus:border-cyan-500 focus:bg-cyan-50/10 focus:ring-0 text-sm font-medium text-slate-800 px-2 py-2 outline-none placeholder:text-slate-400 transition-all rounded-t-sm"
                    />

                    <div className="flex flex-wrap gap-1 pt-1">
                      {QUICK_ICT_JUSTIFICATIONS.map((just) => (
                        <button
                          type="button"
                          key={just}
                          onClick={() => setJustification(just)}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-cyan-100 hover:text-cyan-800 text-slate-600 transition-colors text-left"
                        >
                          {just}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ADD Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 bg-[#1890ff] hover:bg-[#096dd9] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
                    >
                      <Plus className="size-4" />
                      <span>ADD ITEM</span>
                    </button>
                    <span className="text-[11px] text-slate-500 italic">
                      Item will queue into the table &rarr;
                    </span>
                  </div>
                </form>

                {/* ── RIGHT PANEL: Pink Header Table & On Behalf (Cols 6-12) ─── */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        ICT Requisition Queue
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                        {items.length} {items.length === 1 ? "Item" : "Items"} ({totalQtyCount} Units)
                      </span>
                    </div>

                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline"
                      >
                        Clear Draft
                      </button>
                    )}
                  </div>

                  {/* Table with Light Pink Header matching Screenshot */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-[#ffebee] border-b border-pink-200/70 text-slate-800 font-bold uppercase tracking-wide text-[11px]">
                          <th className="py-3 px-4">Item</th>
                          <th className="py-3 px-3 w-24 text-center">Quantity</th>
                          <th className="py-3 px-4">Justification</th>
                          <th className="py-3 px-4 w-36">For</th>
                          <th className="py-3 px-2 w-10 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-16 text-center text-xs text-slate-400 font-normal"
                            >
                              <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                                <div className="size-10 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-400">
                                  <Laptop className="size-5" />
                                </div>
                                <p className="font-semibold text-slate-600 text-xs">
                                  No ICT items queued yet
                                </p>
                                <p className="text-[11px] text-slate-600">
                                  Fill in the form on the left with your IT equipment needs and click <strong>ADD</strong>.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          items.map((it) => (
                            <tr
                              key={it.id}
                              className="hover:bg-cyan-50/30 transition-colors animate-in fade-in"
                            >
                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900">{it.item}</div>
                                <span className="text-[10px] font-medium text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100 inline-block mt-0.5">
                                  ICT Equipment
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded text-xs">
                                  {it.quantity}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600">
                                {it.justification}
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-[11px] font-medium text-slate-700 bg-slate-100/80 px-2 py-1 rounded block truncate">
                                  {it.forUse}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(it.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded"
                                  title="Remove item"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>

                      {items.length > 0 && (
                        <tfoot>
                          <tr className="bg-slate-50 border-t border-slate-200 text-slate-700 font-bold text-xs">
                            <td className="py-2.5 px-4">Total ({items.length} unique items)</td>
                            <td className="py-2.5 px-3 text-center font-bold text-cyan-700">
                              {totalQtyCount}
                            </td>
                            <td colSpan={3}></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>

                  {/* ── On Behalf Delegation Box ─────────────────────────────── */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={onBehalf}
                          onChange={(e) => setOnBehalf(e.target.checked)}
                          className="rounded border-slate-300 text-red-600 focus:ring-red-500 size-4 cursor-pointer"
                        />
                        <span className="text-red-600 font-bold text-xs tracking-wide">
                          On Behalf :
                        </span>
                        <span className="text-xs text-slate-500 font-normal">
                          (Submit ICT requisition for another employee)
                        </span>
                      </label>

                      {onBehalf && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                          Delegated Request
                        </span>
                      )}
                    </div>

                    {/* Inline Employee Selector when On Behalf is checked */}
                    {onBehalf && (
                      <div className="pt-2 border-t border-slate-200/80 animate-in fade-in duration-200 space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          Select Employee on whose behalf this ICT request is filed:
                        </label>
                        <select
                          value={onBehalfEmp}
                          onChange={(e) => setOnBehalfEmp(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md text-xs px-3 py-1.5 text-slate-800 font-medium outline-none focus:border-cyan-500 shadow-xs"
                        >
                          {DUMMY_EMPLOYEES.map((emp) => (
                            <option
                              key={emp.id}
                              value={`${emp.name} (${emp.role} - ${emp.dept})`}
                            >
                              {emp.name} — {emp.role} ({emp.dept})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* SUBMIT Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={items.length === 0}
                      className={`inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider px-8 py-2.5 rounded-lg shadow-sm transition-all ${
                        items.length === 0
                          ? "bg-slate-300 cursor-not-allowed text-slate-500"
                          : "bg-[#1890ff] hover:bg-[#096dd9] active:scale-[0.98] hover:shadow"
                      }`}
                    >
                      <Send className="size-4" />
                      <span>SUBMIT ICT REQUISITION</span>
                    </button>

                    <div className="text-right text-[11px] text-slate-600">
                      Approver: <span className="font-semibold text-slate-700">IT Head / HOD</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              RECENT SUBMITTED REQUESTS LEDGER
              ══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <Monitor className="size-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Recent ICT Product Budget Requests
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Track the lifecycle and approval status of submitted IT hardware & consumable requests
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchLedger}
                    onChange={(e) => setSearchLedger(e.target.value)}
                    placeholder="Search by ID, Req Type, Employee..."
                    className="pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-cyan-500 w-56 text-slate-700"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                  {filteredRecords.length} Submissions
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10.5px]">
                    <th className="py-2.5 px-3">Req ID</th>
                    <th className="py-2.5 px-3">Req Type</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-center">Items</th>
                    <th className="py-2.5 px-3">On Behalf</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                        {req.id}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{req.reqType}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {req.date}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-bold text-slate-800 bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full text-[11px] border border-cyan-100">
                          {req.items.length} {req.items.length === 1 ? "item" : "items"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {req.onBehalf ? (
                          <span className="text-red-600 font-medium text-[11px] flex items-center gap-1">
                            <UserCheck className="size-3" />
                            {req.onBehalfEmp}
                          </span>
                        ) : (
                          <span className="text-slate-500">Self</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            req.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {req.status === "Approved" ? (
                            <CheckCircle2 className="size-3 text-emerald-600" />
                          ) : (
                            <Clock className="size-3 text-amber-600" />
                          )}
                          {req.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedViewRecord(req)}
                          className="p-1 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                          title="View Requisition Voucher"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              VOUCHER PREVIEW MODAL
              ══════════════════════════════════════════════════════════════════════════ */}
          {selectedViewRecord && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="size-5 text-cyan-600" />
                    <h3 className="text-sm font-bold text-slate-800">
                      ICT Requisition Voucher: {selectedViewRecord.id}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedViewRecord(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <X className="size-4.5" />
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-600 block">Req Type</span>
                      <span className="font-bold text-slate-800">{selectedViewRecord.reqType}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Scope</span>
                      <span className="font-bold text-cyan-600">ICT Hardware & Supplies</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Date</span>
                      <span className="font-bold text-slate-800">{selectedViewRecord.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Status</span>
                      <span className="font-bold text-emerald-600">{selectedViewRecord.status}</span>
                    </div>
                  </div>

                  {selectedViewRecord.onBehalf && (
                    <div className="text-xs bg-red-50 text-red-700 p-2.5 rounded border border-red-200 font-medium">
                      Applied On Behalf: {selectedViewRecord.onBehalfEmp}
                    </div>
                  )}

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#ffebee] text-slate-800 font-bold border-b border-pink-200">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Item</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5">Justification</th>
                          <th className="p-2.5">For</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedViewRecord.items.map((it, idx) => (
                          <tr key={it.id}>
                            <td className="p-2.5 text-slate-600">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-800">{it.item}</td>
                            <td className="p-2.5 text-center font-bold text-cyan-600">{it.quantity}</td>
                            <td className="p-2.5 text-slate-600">{it.justification}</td>
                            <td className="p-2.5 text-slate-600">{it.forUse}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                  >
                    <Printer className="size-3.5" />
                    Print Voucher
                  </button>
                  <button
                    onClick={() => setSelectedViewRecord(null)}
                    className="px-4 py-1.5 text-xs font-bold rounded bg-slate-800 hover:bg-slate-900 text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
