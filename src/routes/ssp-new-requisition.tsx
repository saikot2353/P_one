import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  CalendarClock,
  Laptop,
  Package,
  Smartphone,
  Utensils,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Trash2,
  ChevronDown,
  Layers,
  HandCoins,
  Search,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ssp-new-requisition")({
  validateSearch: (search: Record<string, unknown>): { menu?: string } => {
    return {
      menu: typeof search.menu === "string" ? search.menu : "general",
    };
  },
  head: () => ({
    meta: [
      { title: "New Requisition — CRIPTON" },
      {
        name: "description",
        content:
          "Submit General Product Budget Requests, ICT Product Budget Requests, Leave, IOU and other requisitions.",
      },
    ],
  }),
  component: NewRequisitionPage,
});

interface RequisitionItem {
  id: string;
  item: string;
  category?: string;
  quantity: string;
  justification: string;
  forUse: string;
}

interface BudgetRequestRecord {
  id: string;
  reqType: string;
  type: "General Product Budget Request" | "ICT Product Budget Request";
  category?: string;
  items: RequisitionItem[];
  onBehalf: boolean;
  onBehalfEmp?: string;
  date: string;
  status: "Pending HOD" | "Approved" | "Under Review";
}

const GENERAL_CATEGORIES = [
  "General Stationary",
  "Pantry & Refreshment",
  "Cleaning & Sanitation",
  "Printing & Paper Supplies",
  "Hardware & Electrical",
  "Office Furniture & Fixtures",
  "Safety & Protective Wear",
];

const GENERAL_PRODUCTS_BY_CAT: Record<string, string[]> = {
  "General Stationary": [
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

export function NewRequisitionPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  // Active Menu: 'general' | 'ict' | 'hub'
  const [activeMenu, setActiveMenu] = useState<"general" | "ict" | "hub">(() => {
    if (search.menu === "ict") return "ict";
    if (search.menu === "hub") return "hub";
    return "general";
  });

  useEffect(() => {
    if (search.menu === "ict") setActiveMenu("ict");
    else if (search.menu === "hub") return setActiveMenu("hub");
    else setActiveMenu("general");
  }, [search.menu]);

  const setMenu = (menu: "general" | "ict" | "hub") => {
    setActiveMenu(menu);
    navigate({
      to: "/ssp-new-requisition",
      search: { menu },
    });
  };

  // ── Form State ────────────────────────────────────────────────────────
  const [reqType, setReqType] = useState("Monthly Purchase Request");
  const [category, setCategory] = useState("General Stationary");
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
    const saved = localStorage.getItem("ssp_budget_requisitions");
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
        reqType: "Monthly Purchase Request",
        type: "General Product Budget Request",
        category: "General Stationary",
        items: [
          {
            id: "1",
            item: "A4 Paper (80 GSM Box)",
            category: "General Stationary",
            quantity: "5",
            justification: "Monthly departmental documentation & printing",
            forUse: "Department Uses",
          },
          {
            id: "2",
            item: "Ballpoint Pen (Blue)",
            category: "General Stationary",
            quantity: "20",
            justification: "Staff routine daily office stationery",
            forUse: "Department Uses",
          },
        ],
        onBehalf: false,
        date: "08/09/2026",
        status: "Pending HOD",
      },
      {
        id: "REQ-2026-ICT-002",
        reqType: "Monthly Purchase Request",
        type: "ICT Product Budget Request",
        items: [
          {
            id: "3",
            item: 'Dell 24" IPS Monitor',
            quantity: "1",
            justification: "Replacement for flickering monitor in QA station",
            forUse: "Personal Uses",
          },
        ],
        onBehalf: true,
        onBehalfEmp: "Rajebul Hasan Rajon (Executive - IT)",
        date: "06/09/2026",
        status: "Approved",
      },
    ];
  });

  const availableProducts = useMemo(() => {
    if (activeMenu === "ict") {
      return ICT_PRODUCTS;
    }
    return GENERAL_PRODUCTS_BY_CAT[category] || GENERAL_PRODUCTS_BY_CAT["General Stationary"];
  }, [activeMenu, category]);

  // Handle Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) {
      toast.error("Please enter or select a Product!");
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
      category: activeMenu === "general" ? category : undefined,
      quantity: quantity.trim(),
      justification: justification.trim(),
      forUse: onBehalf ? onBehalfEmp : "Department Uses",
    };

    setItems((prev) => [...prev, newItem]);
    toast.success(`Added ${newItem.item} to request list!`);

    // Reset input fields for rapid multi-entry
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

    const newReqId = `REQ-2026-${activeMenu === "ict" ? "ICT" : "GP"}-${String(
      savedRequests.length + 1
    ).padStart(3, "0")}`;

    const newRecord: BudgetRequestRecord = {
      id: newReqId,
      reqType,
      type:
        activeMenu === "ict"
          ? "ICT Product Budget Request"
          : "General Product Budget Request",
      category: activeMenu === "general" ? category : undefined,
      items,
      onBehalf,
      onBehalfEmp: onBehalf ? onBehalfEmp : undefined,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Pending HOD",
    };

    const updated = [newRecord, ...savedRequests];
    setSavedRequests(updated);
    localStorage.setItem("ssp_budget_requisitions", JSON.stringify(updated));

    toast.success(
      `Requisition ${newReqId} submitted successfully! Forwarded to HOD for approval.`
    );

    // Reset Form
    setItems([]);
    setProduct("");
    setQuantity("");
    setJustification("");
  };

  // Requisition Hub Categories
  const categories = [
    {
      title: "General Product Budget Request",
      icon: Package,
      desc: "Submit monthly purchase requests for stationery, paper, pantry, cleaning, and office consumables.",
      to: "/ssp-new-requisition?menu=general",
      onClick: () => setMenu("general"),
      color: "from-blue-500/10 via-blue-500/5 to-transparent hover:border-blue-500/40",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      badge: "ERP Active",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      title: "ICT Product Budget Request",
      icon: Laptop,
      desc: "Submit monthly hardware, monitor, toner, peripheral, and network accessory purchase requests.",
      to: "/ssp-new-requisition?menu=ict",
      onClick: () => setMenu("ict"),
      color: "from-purple-500/10 via-purple-500/5 to-transparent hover:border-purple-500/40",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      badge: "ERP Active",
      badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    {
      title: "IOU Requisition",
      icon: HandCoins,
      desc: "Request temporary cash advances with IOU slips and track multi-level adjustment approvals.",
      to: "/ssp-iou-requisition",
      color: "from-amber-500/10 via-amber-500/5 to-transparent hover:border-amber-500/40",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      badge: "Active",
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      title: "Leave Application",
      icon: CalendarClock,
      desc: "Apply for annual, sick, or casual leaves and track balance accounts.",
      to: "/ssp-leave-requisition",
      color: "from-emerald-500/10 via-emerald-500/5 to-transparent hover:border-emerald-500/40",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      badge: "Active",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      title: "Sim Requisition",
      icon: Smartphone,
      desc: "Request corporate mobile SIM allocation, cellular package updates, or limits.",
      to: "#",
      color: "from-slate-500/10 via-slate-500/5 to-transparent hover:border-slate-500/40",
      iconColor: "text-slate-500",
      iconBg: "bg-slate-500/10 border-slate-500/20",
      badge: "Available",
      badgeColor: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
    {
      title: "Lunch and Conveyance",
      icon: Utensils,
      desc: "Submit reimbursement claims for business food expenditures and travel allowances.",
      to: "#",
      color: "from-rose-500/10 via-rose-500/5 to-transparent hover:border-rose-500/40",
      iconColor: "text-rose-500",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      badge: "Claimable",
      badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#eceff1] text-slate-800 transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto w-full">
          {/* Breadcrumb & Top Level Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider font-semibold">
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3 text-slate-400" />
              <span className="text-slate-600 font-medium">SSP</span>
              <ChevronRight className="size-3 text-slate-400" />
              <span className="text-blue-600 font-bold">New Requisition</span>
            </div>

            {/* Quick switcher buttons for the requested menus */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200">
              <button
                type="button"
                onClick={() => setMenu("general")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all ${
                  activeMenu === "general"
                    ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Package className="size-3.5" />
                <span>General Product Budget Request</span>
              </button>

              <button
                type="button"
                onClick={() => setMenu("ict")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all ${
                  activeMenu === "ict"
                    ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Laptop className="size-3.5" />
                <span>ICT Product Budget Request</span>
              </button>

              <button
                type="button"
                onClick={() => setMenu("hub")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all ${
                  activeMenu === "hub"
                    ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="size-3.5" />
                <span>All SSP Portals</span>
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              FORM CONTAINER: Matches Screenshot 1 & Screenshot 2
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeMenu !== "hub" && (
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
                        <option value="Emergency Purchase Request">
                          Emergency Purchase Request
                        </option>
                        <option value="Special Purchase Request">
                          Special Purchase Request
                        </option>
                        <option value="Yearly Budget Request">
                          Yearly Budget Request
                        </option>
                        <option value="Project Purchase Request">
                          Project Purchase Request
                        </option>
                      </select>
                      <ChevronDown className="size-4 text-slate-500 pointer-events-none absolute right-1 top-2" />
                    </div>
                  </div>

                  {/* Category * (Only in General Product Budget Request - Screenshot 2) */}
                  {activeMenu === "general" && (
                    <div className="space-y-1 animate-in fade-in duration-200">
                      <label className="block text-xs font-medium text-slate-700">
                        Category <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            setProduct("");
                          }}
                          className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 pr-8 cursor-pointer outline-none transition-colors"
                        >
                          {GENERAL_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="size-4 text-slate-500 pointer-events-none absolute right-1 top-2" />
                      </div>
                    </div>
                  )}

                  {/* Product * */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Product <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        list="products-datalist"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="Select or enter product name..."
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 focus:ring-0 text-sm font-normal text-slate-800 py-1.5 outline-none placeholder:text-slate-400 transition-colors"
                      />
                      <datalist id="products-datalist">
                        {availableProducts.map((p) => (
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
                      placeholder="Enter quantity"
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
                      placeholder="Enter business justification..."
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
                          <th className="py-2.5 px-2 w-12 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 min-h-[140px]">
                        {items.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-12 text-center text-xs text-slate-400 font-normal italic"
                            >
                              No items added to request yet. Fill the form on the left and click ADD.
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
                                {it.category && (
                                  <span className="text-[10px] text-slate-500">
                                    {it.category}
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
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              RECENT BUDGET SUBMISSIONS LEDGER
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeMenu !== "hub" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Recent Submitted Budget Requests
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
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Category / Mode</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Items Count</th>
                      <th className="py-2.5 px-3">Applicant / On Behalf</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {savedRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-blue-600">
                          {req.id}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {req.type}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {req.category || "Standard ICT Hardware"}
                        </td>
                        <td className="py-2 px-3 text-slate-600">{req.date}</td>
                        <td className="py-2 px-3 font-semibold text-slate-700">
                          {req.items.length} {req.items.length === 1 ? "item" : "items"}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {req.onBehalf ? (
                            <span className="text-red-600 font-medium">
                              On Behalf: {req.onBehalfEmp}
                            </span>
                          ) : (
                            <span className="text-slate-600">Self (Logged-in User)</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                              req.status === "Approved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : req.status === "Under Review"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
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
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              ALL SSP REQUISITION CATEGORIES (HUB VIEW)
              ══════════════════════════════════════════════════════════════════════════ */}
          {activeMenu === "hub" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Select Requisition Portal
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Choose an official requisition portal to submit specialized requests.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const isHash = cat.to === "#";
                    const isAction = !!cat.onClick;
                    return isAction ? (
                      <button
                        type="button"
                        key={cat.title}
                        onClick={cat.onClick}
                        className="text-left group relative bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-5 shadow-xs transition-all duration-300 flex flex-col gap-3 hover:-translate-y-0.5"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div
                            className={`size-10 rounded-md border ${cat.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                          >
                            <cat.icon className={`size-5 ${cat.iconColor}`} />
                          </div>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${cat.badgeColor}`}
                          >
                            {cat.badge}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {cat.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-normal mt-1">
                            {cat.desc}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 mt-1">
                          <span>Open Form</span>
                          <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </button>
                    ) : (
                      <Link
                        key={cat.title}
                        to={cat.to}
                        className={`group relative bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-5 shadow-xs transition-all duration-300 flex flex-col gap-3 hover:-translate-y-0.5 ${
                          isHash ? "pointer-events-none opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`size-10 rounded-md border ${cat.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                          >
                            <cat.icon className={`size-5 ${cat.iconColor}`} />
                          </div>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${cat.badgeColor}`}
                          >
                            {cat.badge}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {cat.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-normal mt-1">
                            {cat.desc}
                          </p>
                        </div>

                        {!isHash && (
                          <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 mt-1">
                            <span>Open Portal</span>
                            <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
