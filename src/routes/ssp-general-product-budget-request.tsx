import { useState, useMemo, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  ChevronDown,
  X,
  Camera,
  Trash2,
  FileText,
  ShoppingBag,
  Send,
  Eye,
  Printer,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ssp-general-product-budget-request")({
  head: () => ({
    meta: [
      { title: "General Product Budget Request — CRIPTON" },
      {
        name: "description",
        content:
          "Submit monthly purchase requests for general stationary, consumables, and department supplies.",
      },
    ],
  }),
  component: GeneralProductBudgetRequestPage,
});

interface RequisitionItem {
  id: string;
  item: string;
  category: string;
  quantity: string;
  justification: string;
  forUse: string;
  attachmentName?: string;
}

interface BudgetRequestRecord {
  id: string;
  reqType: string;
  category: string;
  items: RequisitionItem[];
  onBehalf: boolean;
  onBehalfEmp?: string;
  date: string;
  status: "Pending HOD" | "Approved" | "Under Review";
}

const CATEGORIES = [
  "General Stationary",
  "Pantry & Refreshment",
  "Cleaning & Sanitation",
  "Printing & Paper Supplies",
  "Hardware & Electrical",
  "Office Furniture & Fixtures",
  "Safety & Protective Wear",
];

const PRODUCTS_BY_CAT: Record<string, string[]> = {
  "General Stationary": [
    "Pad Ink 1Ltr",
    "A4 Paper (80 GSM Box)",
    "Ballpoint Pen (Blue)",
    "Ballpoint Pen (Black)",
    "Box File (Legal Size)",
    "Sticky Notes (Yellow 3x3)",
    "Stapler (Heavy Duty) & Pins",
    "Highlighter Marker (Assorted)",
    "Permanent Marker (Black)",
    "Punching Machine (Double Hole)",
    "Clear File Folder (A4)",
    "Desk Organizer Tray",
    "Scissors 8 inch",
    "Glue Stick 35g",
    "Calculator 12 Digits",
    "Paper Clips Box",
  ],
  "Pantry & Refreshment": [
    "Tea Bags (Box of 100)",
    "Coffee Powder (200g Jar)",
    "Sugar (1kg Packet)",
    "Powder Milk (500g)",
    "Paper Cups (Pack of 100)",
    "Tissue Box (Facial)",
    "Drinking Water 20L Jar",
  ],
  "Cleaning & Sanitation": [
    "Floor Cleaner Liquid (5L)",
    "Hand Wash Liquid (5L)",
    "Glass Cleaner Spray (500ml)",
    "Air Freshener (300ml)",
    "Microfiber Cleaning Cloth",
    "Dustbin (Plastic 15L)",
    "Toilet Cleaner Harpic",
  ],
  "Printing & Paper Supplies": [
    "Letterhead Paper (100 GSM)",
    "Envelope (Standard DL)",
    "Envelope (A4 Size Brown)",
    "Receipt Voucher Book",
    "Gate Pass Book",
    "Voucher Binding File",
  ],
  "Hardware & Electrical": [
    "Multiplug Extension Socket 5-port",
    "LED Bulb 15W Daylight",
    "AA Batteries (Pack of 4)",
    "AAA Batteries (Pack of 4)",
    "Wall Clock",
  ],
  "Office Furniture & Fixtures": [
    "Executive Office Chair",
    "Visitor Chair",
    "Footrest Ergonomic",
    "Whiteboard 4x3 Feet",
    "Whiteboard Duster & Pens",
  ],
  "Safety & Protective Wear": [
    "Safety Face Masks (Box of 50)",
    "First Aid Medicine Kit",
    "Nitrile Gloves (Box)",
    "Safety Goggles",
  ],
};

const DUMMY_EMPLOYEES = [
  "Md. Anik Islam (Deputy Manager - HR & Admin)",
  "Rajebul Hasan Rajon (Executive - IT Systems)",
  "Md. Zahidul Islam (COO - Operations)",
  "Tahmid Afsar Shapno (Software Engineer)",
  "Ayesha Siddiqua (Senior Accountant - Finance)",
  "Kazi Farhan (Procurement Officer - Supply Chain)",
];

function GeneralProductBudgetRequestPage() {
  // Form State
  const [reqType, setReqType] = useState("Regular Purchase Request");
  const [category, setCategory] = useState("General Stationary");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [justification, setJustification] = useState("");

  // Table items list - preloaded with the user's item
  const [items, setItems] = useState<RequisitionItem[]>([
    {
      id: "1",
      item: "Pad Ink 1Ltr",
      category: "General Stationary",
      quantity: "1 PCS",
      justification: "s",
      forUse: "Regular",
    },
  ]);

  // On Behalf
  const [onBehalf, setOnBehalf] = useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = useState(DUMMY_EMPLOYEES[0]);

  // File Attachment ref for row item
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachingItemId, setAttachingItemId] = useState<string | null>(null);

  // Search & Modal
  const [searchLedger, setSearchLedger] = useState("");
  const [selectedViewRecord, setSelectedViewRecord] = useState<BudgetRequestRecord | null>(null);

  // Saved requests in local storage
  const [savedRequests, setSavedRequests] = useState<BudgetRequestRecord[]>(() => {
    const saved = localStorage.getItem("ssp_general_budget_requests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: "REQ-2026-GP-001",
        reqType: "Regular Purchase Request",
        category: "General Stationary",
        items: [
          {
            id: "1",
            item: "Pad Ink 1Ltr",
            category: "General Stationary",
            quantity: "1 PCS",
            justification: "s",
            forUse: "Regular",
          },
        ],
        onBehalf: false,
        date: "08/09/2026",
        status: "Pending HOD",
      },
    ];
  });

  const availableProducts =
    PRODUCTS_BY_CAT[category] || PRODUCTS_BY_CAT["General Stationary"];

  // ── Bulletproof Handle Add Item ───────────────────────────────────────
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!product || !product.trim()) {
      toast.error("Please enter a Product name!");
      return;
    }

    if (!quantity || !quantity.trim()) {
      toast.error("Please enter Quantity!");
      return;
    }

    if (!justification || !justification.trim()) {
      toast.error("Please enter Justification!");
      return;
    }

    // Format quantity: if numeric only, append PCS (e.g. 1 -> 1 PCS)
    const trimmedQty = quantity.trim();
    const formattedQty = /^\d+$/.test(trimmedQty) ? `${trimmedQty} PCS` : trimmedQty;

    // For column: Regular or Monthly from reqType, or onBehalfEmp if onBehalf is checked
    const forValue = onBehalf && onBehalfEmp
      ? onBehalfEmp
      : reqType.includes("Regular")
        ? "Regular"
        : "Monthly";

    const newItem: RequisitionItem = {
      id: Date.now().toString(),
      item: product.trim(),
      category: category || "General Stationary",
      quantity: formattedQty,
      justification: justification.trim(),
      forUse: forValue,
    };

    setItems((prev) => [...prev, newItem]);
    toast.success(`Added "${newItem.item}" to table!`);

    // Clear input fields
    setProduct("");
    setQuantity("");
    setJustification("");
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Attachment Handler
  const handleTriggerAttachment = (id: string) => {
    setAttachingItemId(id);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !attachingItemId) return;

    setItems((prev) =>
      prev.map((it) =>
        it.id === attachingItemId ? { ...it, attachmentName: file.name } : it
      )
    );
    toast.success(`Attached "${file.name}" to item.`);
    setAttachingItemId(null);
  };

  // Submit Whole Request
  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Please add at least one item before submitting!");
      return;
    }

    const newReqId = `REQ-2026-GP-${String(savedRequests.length + 1).padStart(3, "0")}`;

    const newRecord: BudgetRequestRecord = {
      id: newReqId,
      reqType,
      category,
      items,
      onBehalf,
      onBehalfEmp: onBehalf ? onBehalfEmp : undefined,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Pending HOD",
    };

    const updated = [newRecord, ...savedRequests];
    setSavedRequests(updated);
    localStorage.setItem("ssp_general_budget_requests", JSON.stringify(updated));

    toast.success(`Requisition ${newReqId} submitted successfully!`);
  };

  const filteredRecords = useMemo(() => {
    if (!searchLedger.trim()) return savedRequests;
    const q = searchLedger.toLowerCase();
    return savedRequests.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.reqType.toLowerCase().includes(q) ||
        (r.onBehalfEmp && r.onBehalfEmp.toLowerCase().includes(q))
    );
  }, [savedRequests, searchLedger]);

  return (
    <div className="min-h-screen flex bg-[#eceff1] text-slate-800 transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        {/* Hidden File Input for Camera/Attachment icon */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
        />

        <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto w-full">
          
          {/* Breadcrumb Bar */}
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
              <span className="text-blue-600 font-bold">General Product Budget Request</span>
            </div>

            <Link
              to="/ssp-new-requisition"
              className="text-xs text-slate-600 hover:text-blue-600 font-semibold"
            >
              &larr; Back to Hub
            </Link>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              FORM CONTAINER: Matches User Screenshot Exactly
              ══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ── LEFT PANEL: Form Fields (Cols 1-5) ───────────────────────── */}
              <div className="lg:col-span-5 space-y-6 lg:pr-8 lg:border-r lg:border-slate-200">
                {/* Req. Type * */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Req. Type <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={reqType}
                      onChange={(e) => setReqType(e.target.value)}
                      className="w-full appearance-none bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 pr-8 cursor-pointer outline-none transition-colors"
                    >
                      <option value="Regular Purchase Request">
                        Regular Purchase Request
                      </option>
                      <option value="Monthly Purchase Request">
                        Monthly Purchase Request
                      </option>
                    </select>
                    <ChevronDown className="size-4 text-slate-500 pointer-events-none absolute right-1 top-2" />
                  </div>
                </div>

                {/* Category * */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Category <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                      }}
                      className="w-full appearance-none bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 pr-8 cursor-pointer outline-none transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="size-4 text-slate-500 pointer-events-none absolute right-1 top-2" />
                  </div>
                </div>

                {/* Product * */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Product <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="general-products-list"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddItem();
                        }
                      }}
                      placeholder=""
                      className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 outline-none placeholder:text-slate-400 transition-colors"
                    />
                    <datalist id="general-products-list">
                      {availableProducts.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Quantity * (Use Text input so 1 or 1 PCS works seamlessly!) */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Quantity <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddItem();
                      }
                    }}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddItem();
                      }
                    }}
                    placeholder=""
                    className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 outline-none placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* ADD Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleAddItem()}
                    className="bg-[#1890ff] hover:bg-[#096dd9] text-white text-xs font-bold uppercase tracking-wider px-6 py-2 rounded shadow-xs transition-colors"
                  >
                    ADD
                  </button>
                </div>
              </div>

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
                        <th className="py-2.5 px-2 w-16 text-right pr-4"></th>
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
                              <div>{it.item}</div>
                              {it.attachmentName && (
                                <span className="text-[10px] text-blue-600 block truncate">
                                  📎 {it.attachmentName}
                                </span>
                              )}
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
                            <td className="py-2.5 px-2 text-right pr-3">
                              <div className="inline-flex items-center gap-1.5">
                                {/* Camera / Attachment Icon matching screenshot */}
                                <button
                                  type="button"
                                  onClick={() => handleTriggerAttachment(it.id)}
                                  className="p-1 text-slate-500 hover:text-blue-600 transition-colors rounded"
                                  title="Attach image or document"
                                >
                                  <Camera className="size-3.5" />
                                </button>
                                {/* Delete 'X' icon matching screenshot */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(it.id)}
                                  className="p-1 text-slate-500 hover:text-red-500 transition-colors rounded"
                                  title="Remove item"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
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
              RECENT SUBMITTED REQUESTS LEDGER
              ══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recent General Product Budget Requests
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
                    <th className="py-2.5 px-3">Category</th>
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
                      <td className="py-2 px-3 text-slate-600">{req.category}</td>
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
