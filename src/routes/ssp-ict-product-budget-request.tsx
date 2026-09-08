import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  FileText,
  Laptop,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ssp-ict-product-budget-request")({
  head: () => ({
    meta: [
      { title: "ICT Product Budget Request — CRIPTON" },
      {
        name: "description",
        content: "Submit monthly purchase requests for ICT hardware, monitors, toner, network parts, and IT accessories.",
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
  "Dell 24\" IPS Monitor",
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
  "Md. Anik Islam (Deputy Manager - HR)",
  "Rajebul Hasan Rajon (Executive - IT)",
  "Md. Zahidul Islam (COO - Operations)",
  "Tahmid Afsar Shapno (Software Engineer)",
  "Ayesha Siddiqua (Accountant)",
  "Kazi Farhan (Procurement Officer)",
];

function ICTProductBudgetRequestPage() {
  // ── Form State ────────────────────────────────────────────────────────
  const [reqType, setReqType] = useState("Monthly Purchase Request");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [justification, setJustification] = useState("");

  // Table items list
  const [items, setItems] = useState<RequisitionItem[]>([]);

  // On Behalf
  const [onBehalf, setOnBehalf] = useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = useState(DUMMY_EMPLOYEES[0]);

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
        onBehalfEmp: "Rajebul Hasan Rajon (Executive - IT)",
        date: "08/09/2026",
        status: "Approved",
      },
    ];
  });

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
    toast.success(`Added ${newItem.item} to request list!`);

    // Reset input fields
    setProduct("");
    setQuantity("");
    setJustification("");
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Handle Submit Entire Request
  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Please add at least one item before submitting!");
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
      `ICT Requisition ${newReqId} submitted successfully! Forwarded to HOD for approval.`
    );

    // Reset Form
    setItems([]);
    setProduct("");
    setQuantity("");
    setJustification("");
  };

  return (
    <div className="min-h-screen flex bg-[#eceff1] text-slate-800 transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider font-semibold">
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
              <span className="text-blue-600 font-bold">ICT Product Budget Request</span>
            </div>

            <Link
              to="/ssp-new-requisition"
              className="text-xs text-slate-600 hover:text-blue-600 font-semibold"
            >
              &larr; Back to Hub
            </Link>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              FORM CONTAINER: Matches Screenshot 1 Exactly
              ══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ── LEFT PANEL: Form Fields (Cols 1-5) ───────────────────────── */}
              <form
                onSubmit={handleAddItem}
                className="lg:col-span-5 space-y-6 lg:pr-8 lg:border-r lg:border-slate-200"
              >
                {/* Req. Type * */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Req. Type <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={reqType}
                      onChange={(e) => setReqType(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 pr-8 cursor-pointer outline-none transition-colors"
                    >
                      <option value="Monthly Purchase Request">
                        Monthly Purchase Request
                      </option>
                      <option value="Regular Purchase Request">
                        Regular Purchase Request
                      </option>
                    </select>
                    <ChevronDown className="size-4 text-slate-500 pointer-events-none absolute right-1 top-2" />
                  </div>
                </div>

                {/* Product * (No Category in Screenshot 1!) */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Product <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="ict-products-list"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder=""
                      className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 outline-none placeholder:text-slate-400 transition-colors"
                    />
                    <datalist id="ict-products-list">
                      {ICT_PRODUCTS.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Quantity * */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Quantity <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder=""
                    className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 outline-none placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* Justification * */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Justification <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder=""
                    className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 outline-none placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* ADD Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#1890ff] hover:bg-[#096dd9] text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded shadow-xs transition-colors"
                  >
                    ADD
                  </button>
                </div>
              </form>

              {/* ── RIGHT PANEL: Pink Header Table & On Behalf (Cols 6-12) ─── */}
              <div className="lg:col-span-7 space-y-5">
                {/* Table with Light Pink Header matching Screenshot */}
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#ffebee] border-b border-pink-100 text-xs font-semibold text-slate-700">
                        <th className="py-2.5 px-4">Item</th>
                        <th className="py-2.5 px-3 w-28">Quantity</th>
                        <th className="py-2.5 px-4">Justification</th>
                        <th className="py-2.5 px-3 w-32">For</th>
                        <th className="py-2.5 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 min-h-[140px]">
                      {items.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-14 text-center text-xs text-slate-400 font-normal italic"
                          >
                            No items added yet. Fill the form on the left and click ADD.
                          </td>
                        </tr>
                      ) : (
                        items.map((it) => (
                          <tr
                            key={it.id}
                            className="hover:bg-slate-50 text-xs text-slate-800 transition-colors"
                          >
                            <td className="py-2.5 px-4 font-medium">
                              {it.item}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-700">
                              {it.quantity}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {it.justification}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 truncate">
                              {it.forUse}
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(it.id)}
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded"
                                title="Remove item"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* On Behalf Row (Red text label with checkbox) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-red-600 font-semibold text-xs tracking-wide">
                      On Behalf :
                    </span>
                    <input
                      type="checkbox"
                      checked={onBehalf}
                      onChange={(e) => setOnBehalf(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 size-4 cursor-pointer"
                    />
                  </label>

                  {/* Inline Employee Selector when On Behalf is checked */}
                  {onBehalf && (
                    <div className="flex items-center gap-2 animate-in fade-in duration-200">
                      <select
                        value={onBehalfEmp}
                        onChange={(e) => setOnBehalfEmp(e.target.value)}
                        className="bg-white border border-slate-300 rounded text-xs px-2.5 py-1 text-slate-700 outline-none focus:border-blue-500"
                      >
                        {DUMMY_EMPLOYEES.map((emp) => (
                          <option key={emp} value={emp}>
                            {emp}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* SUBMIT Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-[#1890ff] hover:bg-[#096dd9] text-white text-xs font-bold uppercase tracking-wider px-7 py-2 rounded shadow-xs transition-colors"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              RECENT SUBMITTED REQUESTS
              ══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recent ICT Product Budget Requests
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {savedRequests.length} Total Submissions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Req ID</th>
                    <th className="py-2.5 px-3">Req Type</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Items</th>
                    <th className="py-2.5 px-3">On Behalf</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {savedRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 font-mono font-bold text-blue-600">
                        {req.id}
                      </td>
                      <td className="py-2 px-3 text-slate-700">{req.reqType}</td>
                      <td className="py-2 px-3 text-slate-600">{req.date}</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">
                        {req.items.length} {req.items.length === 1 ? "item" : "items"}
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {req.onBehalf ? (
                          <span className="text-red-600 font-medium">
                            {req.onBehalfEmp}
                          </span>
                        ) : (
                          "Self"
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                            req.status === "Approved"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
