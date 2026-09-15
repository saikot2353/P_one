import { useState, useMemo, useRef } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight,
  Plus,
  Trash2,
  Camera,
  FileText,
  Send,
  Eye,
  Printer,
  CheckCircle2,
  Clock,
  X,
  Layers,
  ShoppingBag,
  Search,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ssp-product-budget-request")({
  head: () => ({
    meta: [
      { title: "Product Budget Request — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Submit monthly purchase requests for General stationery, consumables, pantry supplies, ICT hardware, monitors, toner, and IT accessories.",
      },
    ],
  }),
  component: ProductBudgetRequestPage,
});

export type ProductType = "General" | "ICT";

interface RequisitionItem {
  id: string;
  item: string;
  productType: ProductType;
  category: string;
  quantity: string;
  justification: string;
  forUse: string;
  attachmentName?: string;
}

interface BudgetRequestRecord {
  id: string;
  reqType: string;
  productType: ProductType;
  category: string;
  items: RequisitionItem[];
  onBehalf: boolean;
  onBehalfEmp?: string;
  date: string;
  status: "Pending HOD" | "Approved" | "Under Review";
}

const inputClass =
  "w-full h-9.5 px-3.5 text-[13px] font-bold text-foreground bg-muted/40 dark:bg-slate-900/40 border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border transition-all placeholder:text-muted-foreground/45";

const labelClass =
  "block text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className={labelClass}>
        {label}
        {required && <span className="text-rose-500 ml-0.5 font-bold">*</span>}
      </label>
      {children}
    </div>
  );
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

const ICT_CATEGORIES = [
  "IT Hardware & Computers",
  "Monitors & Displays",
  "Network & Connectivity",
  "Toner & Printing Supplies",
  "Power & UPS",
  "IT Accessories & Cables",
];

const GENERAL_PRODUCTS_BY_CAT: Record<string, string[]> = {
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

const ICT_PRODUCTS_BY_CAT: Record<string, string[]> = {
  "IT Hardware & Computers": [
    "Desktop Computer Core i5",
    "Laptop Core i7 16GB RAM",
    "16GB DDR4 RAM 3200MHz",
    "512GB NVMe M.2 SSD",
  ],
  "Monitors & Displays": [
    'Dell 24" IPS Monitor',
    'HP 27" FHD Monitor',
    "Dual Monitor Stand Arm",
  ],
  "Network & Connectivity": [
    "Cisco 24-Port Gigabit Switch",
    "Cat6 UTP Cable Roll (305m)",
    "RJ45 Connectors (Pack of 100)",
    "Ethernet LAN Adapter USB-C",
  ],
  "Toner & Printing Supplies": [
    "HP LaserJet Pro MFP Printer",
    "HP 85A Black Toner Cartridge",
    "Canon NPG-59 Toner Cartridge",
  ],
  "Power & UPS": [
    "APC 1200VA Offline UPS",
    "UPS Replacement Battery 12V 7Ah",
  ],
  "IT Accessories & Cables": [
    "Logitech Wireless Keyboard & Mouse Combo",
    "Logitech USB Headset with Mic",
    "HDMI to Type-C Converter Cable",
    "Logitech C922 Pro Webcam",
    "USB 3.0 4-Port Hub",
    "Laptop Charger 65W Type-C",
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

function ProductBudgetRequestPage() {
  const searchParams = useSearch({ strict: false }) as { type?: string };
  const initialProductType: ProductType =
    searchParams?.type?.toUpperCase() === "ICT" ? "ICT" : "General";

  // Tab State: LIST vs CREATE
  const [activeTab, setActiveTab] = useState<"MY_LIST" | "CREATE">("MY_LIST");

  // Form State
  const [productType, setProductType] = useState<ProductType>(initialProductType);
  const [reqType, setReqType] = useState("Regular Purchase Request");
  const [category, setCategory] = useState<string>(
    initialProductType === "ICT" ? ICT_CATEGORIES[0] : GENERAL_CATEGORIES[0]
  );
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [justification, setJustification] = useState("");

  const handleProductTypeChange = (newType: ProductType) => {
    setProductType(newType);
    setCategory(newType === "ICT" ? ICT_CATEGORIES[0] : GENERAL_CATEGORIES[0]);
    setProduct("");
  };

  // Table items list
  const [items, setItems] = useState<RequisitionItem[]>([
    {
      id: "1",
      item: "Pad Ink 1Ltr",
      productType: "General",
      category: "General Stationary",
      quantity: "1 PCS",
      justification: "Monthly office supply replenishment",
      forUse: "Regular",
    },
    {
      id: "2",
      item: 'Dell 24" IPS Monitor',
      productType: "ICT",
      category: "Monitors & Displays",
      quantity: "1 PCS",
      justification: "Development workstation monitor upgrade",
      forUse: "Regular",
    },
  ]);

  // On Behalf
  const [onBehalf, setOnBehalf] = useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = useState(DUMMY_EMPLOYEES[0]);

  // File Attachment
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachingItemId, setAttachingItemId] = useState<string | null>(null);

  // Search & Modal
  const [searchLedger, setSearchLedger] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "General" | "ICT">("All");
  const [selectedViewRecord, setSelectedViewRecord] = useState<BudgetRequestRecord | null>(null);

  // Saved requests in local storage
  const [savedRequests, setSavedRequests] = useState<BudgetRequestRecord[]>(() => {
    const saved = localStorage.getItem("ssp_product_budget_requests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: "REQ-2026-PBR-001",
        reqType: "Regular Purchase Request",
        productType: "General",
        category: "General Stationary",
        items: [
          {
            id: "1",
            item: "Pad Ink 1Ltr",
            productType: "General",
            category: "General Stationary",
            quantity: "1 PCS",
            justification: "Monthly supply replenishment",
            forUse: "Regular",
          },
        ],
        onBehalf: false,
        date: "08/09/2026",
        status: "Pending HOD",
      },
      {
        id: "REQ-2026-PBR-002",
        reqType: "Regular Purchase Request",
        productType: "ICT",
        category: "Monitors & Displays",
        items: [
          {
            id: "2",
            item: 'Dell 24" IPS Monitor',
            productType: "ICT",
            category: "Monitors & Displays",
            quantity: "1 PCS",
            justification: "Station monitor replacement",
            forUse: "Regular",
          },
        ],
        onBehalf: true,
        onBehalfEmp: "Rajebul Hasan Rajon (Executive - IT Systems)",
        date: "09/09/2026",
        status: "Approved",
      },
    ];
  });

  const categories = productType === "ICT" ? ICT_CATEGORIES : GENERAL_CATEGORIES;

  const productOptions = useMemo(() => {
    const sourceMap = productType === "ICT" ? ICT_PRODUCTS_BY_CAT : GENERAL_PRODUCTS_BY_CAT;
    const list = sourceMap[category] || Object.values(sourceMap).flat();
    return list.map((item) => ({
      value: item,
      label: item,
    }));
  }, [productType, category]);

  // Handle Add Item
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const selectedProduct = product.trim();
    if (!selectedProduct) {
      toast.error("Please select or enter a Product name!");
      return;
    }

    const trimmedQty = quantity.trim();
    let formattedQty = "1 PCS";
    if (trimmedQty) {
      formattedQty = /^\d+$/.test(trimmedQty) ? `${trimmedQty} PCS` : trimmedQty;
    }

    const finalJustification = justification.trim() || "-";

    const forValue =
      onBehalf && onBehalfEmp
        ? onBehalfEmp
        : reqType.includes("Regular")
        ? "Regular"
        : "Monthly";

    const newItem: RequisitionItem = {
      id: Date.now().toString(),
      item: selectedProduct,
      productType,
      category: category || (productType === "ICT" ? "IT Hardware" : "General Stationary"),
      quantity: formattedQty,
      justification: finalJustification,
      forUse: forValue,
    };

    setItems((prev) => [...prev, newItem]);
    toast.success(`Added "${newItem.item}" to table!`);

    setProduct("");
    setQuantity("");
    setJustification("");
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

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
    toast.success(`Attached "${file.name}"`);
    setAttachingItemId(null);
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Please add at least one item before submitting!");
      return;
    }

    const newReqId = `REQ-2026-PBR-${String(savedRequests.length + 1).padStart(3, "0")}`;

    const newRecord: BudgetRequestRecord = {
      id: newReqId,
      reqType,
      productType,
      category,
      items: [...items],
      onBehalf,
      onBehalfEmp: onBehalf ? onBehalfEmp : undefined,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Pending HOD",
    };

    const updated = [newRecord, ...savedRequests];
    setSavedRequests(updated);
    localStorage.setItem("ssp_product_budget_requests", JSON.stringify(updated));

    toast.success(`Requisition #${newReqId} submitted successfully!`);

    setItems([]);
    setProduct("");
    setQuantity("");
    setJustification("");
    setActiveTab("MY_LIST");
  };

  const filteredRequests = useMemo(() => {
    return savedRequests.filter((req) => {
      const matchesType = typeFilter === "All" || req.productType === typeFilter;
      const matchesQuery =
        !searchLedger.trim() ||
        req.id.toLowerCase().includes(searchLedger.toLowerCase()) ||
        req.reqType.toLowerCase().includes(searchLedger.toLowerCase()) ||
        req.items.some(
          (i) =>
            i.item.toLowerCase().includes(searchLedger.toLowerCase()) ||
            i.category.toLowerCase().includes(searchLedger.toLowerCase())
        );
      return matchesType && matchesQuery;
    });
  }, [savedRequests, searchLedger, typeFilter]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 space-y-5">
          {/* Header Card (Matching Manpower Requisitions Screenshot) */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  HOME
                </Link>
                <ChevronRight className="size-2.5 text-muted-foreground/60" />
                <Link to="/ssp-new-requisition" className="hover:text-primary transition-colors">
                  SELF SERVICE PORTAL
                </Link>
                <ChevronRight className="size-2.5 text-muted-foreground/60" />
                <span className="text-primary font-extrabold">PRODUCT BUDGET REQUEST</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <ShoppingBag className="size-6 text-primary" />
                </div>
                <span>Product Budget Request</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(activeTab === "CREATE" ? "MY_LIST" : "CREATE")}
                className="h-10 px-4 bg-primary hover:bg-primary-glow hover:shadow-primary/15 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-xs transition duration-150 flex items-center gap-1.5 uppercase cursor-pointer"
              >
                {activeTab === "CREATE" ? (
                  <>
                    <FileText className="size-4" />
                    <span>View Requisitions List</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    <span>Submit New Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Workflow Pill Tabs (Matching Screenshot) */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-black uppercase tracking-wide select-none border-b border-border/30 pb-3">
            <button
              onClick={() => setActiveTab("MY_LIST")}
              className={`px-3.5 py-1.5 rounded-lg border transition duration-150 flex items-center gap-1.5 ${
                activeTab === "MY_LIST"
                  ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950 font-bold"
                  : "bg-muted/40 border-border hover:bg-muted text-muted-foreground font-semibold"
              }`}
            >
              <FileText className="size-3.5" />
              My Requests List ({savedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("CREATE")}
              className={`px-3.5 py-1.5 rounded-lg border transition duration-150 flex items-center gap-1.5 ${
                activeTab === "CREATE"
                  ? "bg-blue-600 border-blue-600 text-white font-bold"
                  : "bg-muted/40 border-border hover:bg-blue-500/5 text-blue-600 font-semibold"
              }`}
            >
              <Plus className="size-3.5" />
              Create Product Requisition
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            className="hidden"
          />

          {/* TAB: MY_LIST (Matching Screenshot) */}
          {activeTab === "MY_LIST" && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                    Requisitions Submitted By Me
                  </span>

                  {/* Type Filter Pills */}
                  <div className="inline-flex p-0.5 bg-muted/50 rounded-lg text-[10px] font-extrabold border border-border/50">
                    {(["All", "General", "ICT"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTypeFilter(t)}
                        className={`px-2.5 py-0.5 rounded-md transition-all ${
                          typeFilter === t
                            ? "bg-primary text-white shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchLedger}
                    onChange={(e) => setSearchLedger(e.target.value)}
                    placeholder="Search my requests..."
                    className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold transition duration-200"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-border/50 rounded-xl shadow-3xs">
                <table className="min-w-[900px] w-full border-collapse text-[10.5px] text-left">
                  <thead>
                    <tr className="bg-[#f8fafc] dark:bg-slate-800/20 text-slate-800 dark:text-slate-250 font-black border-b border-slate-200 dark:border-slate-800/80">
                      <th className="px-4 py-3 font-extrabold">Req ID</th>
                      <th className="px-4 py-3 font-extrabold">Type</th>
                      <th className="px-4 py-3 font-extrabold">Req. Schedule</th>
                      <th className="px-4 py-3 font-extrabold">Items Summary</th>
                      <th className="px-4 py-3 font-extrabold text-center">Date</th>
                      <th className="px-4 py-3 font-extrabold text-center">Delegation</th>
                      <th className="px-4 py-3 font-extrabold text-center">Current Status</th>
                      <th className="px-4 py-3 font-extrabold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredRequests.map((r) => {
                      let statusBadge =
                        "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                      if (r.status === "Approved")
                        statusBadge =
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450";

                      return (
                        <tr
                          key={r.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition"
                        >
                          <td className="px-4 py-3 font-mono font-bold text-primary">{r.id}</td>
                          <td className="px-4 py-3 font-bold text-foreground">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[9.5px] font-black ${
                                r.productType === "ICT"
                                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {r.productType} Product
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-muted-foreground">{r.reqType}</td>
                          <td className="px-4 py-3 font-semibold text-foreground max-w-xs truncate">
                            {r.items.map((i) => i.item).join(", ")}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground font-bold">
                            {r.date}
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            {r.onBehalf ? (
                              <span className="text-rose-600 dark:text-rose-400 font-bold">
                                On Behalf
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Self</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase ${statusBadge}`}
                            >
                              <span
                                className={`size-1 rounded-full ${
                                  r.status === "Approved" ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                              />
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedViewRecord(r)}
                                className="p-1.5 rounded-full border border-border hover:bg-primary/10 text-primary transition"
                                title="View Requisition"
                              >
                                <Eye className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-12 text-center text-muted-foreground font-bold"
                        >
                          No requisitions found. Click "Submit New Request" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CREATE (Form Workflow) */}
          {activeTab === "CREATE" && (
            <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-xs space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="border-b border-border/40 pb-3 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  New Product Budget Requisition Form
                </span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  Fill items & add to queue before submitting
                </span>
              </div>

              {/* Smart Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="Type" required>
                  <select
                    value={productType}
                    onChange={(e) => handleProductTypeChange(e.target.value as ProductType)}
                    className={inputClass}
                  >
                    <option value="General">General Product</option>
                    <option value="ICT">ICT Product</option>
                  </select>
                </Field>

                <Field label="Req. Type" required>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Regular Purchase Request">Regular Purchase Request</option>
                    <option value="Monthly Purchase Request">Monthly Purchase Request</option>
                  </select>
                </Field>

                <Field label="Category" required>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setProduct("");
                    }}
                    className={inputClass}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Product" required>
                  <SearchableSelect
                    options={productOptions}
                    value={product}
                    onChange={setProduct}
                    placeholder={`Select ${productType} product...`}
                    className="h-9.5 rounded-xl bg-muted/40 dark:bg-slate-900/40 border border-border/80 text-xs font-bold"
                  />
                </Field>

                <Field label="Quantity" required>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 1, 5, 2 Box"
                    className={inputClass}
                  />
                </Field>

                <Field label="Justification">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Enter justification or purpose..."
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem()}
                      className="h-9.5 px-4 bg-primary hover:bg-primary/90 text-white font-extrabold text-xs rounded-xl shadow-xs transition duration-150 shrink-0 flex items-center gap-1 uppercase"
                    >
                      <Plus className="size-4" /> Add
                    </button>
                  </div>
                </Field>
              </div>

              {/* Items Queue Table */}
              <div className="border border-border/60 rounded-xl overflow-hidden shadow-3xs space-y-0">
                <div className="bg-muted/40 px-4 py-2.5 border-b border-border/60 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-foreground tracking-wider flex items-center gap-1.5">
                    <Layers className="size-3.5 text-primary" />
                    Requested Items Queue ({items.length})
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-[#f8fafc] dark:bg-slate-800/30 text-slate-800 dark:text-slate-200 font-extrabold border-b border-border/60 uppercase">
                        <th className="py-2.5 px-4 w-10 text-center">#</th>
                        <th className="py-2.5 px-4">Item</th>
                        <th className="py-2.5 px-4">Type / Category</th>
                        <th className="py-2.5 px-4">Quantity</th>
                        <th className="py-2.5 px-4">Justification</th>
                        <th className="py-2.5 px-4">For</th>
                        <th className="py-2.5 px-4 text-center">Attach</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-medium">
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-muted-foreground font-bold">
                            No items queued. Fill out the fields above and click "+ Add".
                          </td>
                        </tr>
                      ) : (
                        items.map((item, idx) => (
                          <tr
                            key={item.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-2.5 px-4 text-center font-bold text-muted-foreground">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 font-black text-foreground">
                              {item.item}
                            </td>
                            <td className="py-2.5 px-4 text-muted-foreground font-semibold">
                              <span className="font-bold text-primary">{item.productType}</span>: {item.category}
                            </td>
                            <td className="py-2.5 px-4 font-extrabold text-foreground">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-4 text-muted-foreground max-w-xs truncate">
                              {item.justification}
                            </td>
                            <td className="py-2.5 px-4 text-muted-foreground font-semibold">
                              {item.forUse}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              {item.attachmentName ? (
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                                  {item.attachmentName}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleTriggerAttachment(item.id)}
                                  className="p-1.5 text-muted-foreground hover:text-primary transition"
                                  title="Attach file"
                                >
                                  <Camera className="size-3.5" />
                                </button>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1.5 text-muted-foreground hover:text-rose-500 transition"
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
              </div>

              {/* Bottom Actions Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/40">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onBehalf}
                      onChange={(e) => setOnBehalf(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      On Behalf :
                    </span>
                  </label>

                  {onBehalf && (
                    <div className="w-64 sm:w-72">
                      <select
                        value={onBehalfEmp}
                        onChange={(e) => setOnBehalfEmp(e.target.value)}
                        className={inputClass}
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("MY_LIST")}
                    className="h-10 px-4 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-xl transition uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="h-10 px-6 bg-primary hover:bg-primary-glow text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="size-3.5" /> Submit Requisition
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* View Record Modal */}
      {selectedViewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-xl w-full border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-primary text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black flex items-center gap-1.5">
                  <FileText className="size-4 text-white" />
                  Requisition #{selectedViewRecord.id}
                </h3>
                <p className="text-[11px] text-white/80 font-semibold">
                  Submitted {selectedViewRecord.date} • {selectedViewRecord.productType} Product Request
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedViewRecord(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-muted/40 rounded-xl border border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground block font-bold text-[9.5px] uppercase tracking-wider">
                    Req. Type
                  </span>
                  <span className="font-extrabold text-foreground">
                    {selectedViewRecord.reqType}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-bold text-[9.5px] uppercase tracking-wider">
                    Status
                  </span>
                  <span className="font-extrabold text-amber-600">{selectedViewRecord.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-bold text-[9.5px] uppercase tracking-wider">
                    Delegation
                  </span>
                  <span className="font-extrabold text-foreground">
                    {selectedViewRecord.onBehalf ? "On Behalf" : "Self Request"}
                  </span>
                </div>
                {selectedViewRecord.onBehalfEmp && (
                  <div>
                    <span className="text-muted-foreground block font-bold text-[9.5px] uppercase tracking-wider">
                      On Behalf Of
                    </span>
                    <span className="font-extrabold text-foreground">
                      {selectedViewRecord.onBehalfEmp}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Requested Items ({selectedViewRecord.items.length})
                </h4>
                <div className="border border-border/60 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-muted/40 text-foreground font-black border-b border-border/60 text-[10.5px]">
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Qty</th>
                        <th className="py-2.5 px-3">Justification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-medium">
                      {selectedViewRecord.items.map((it) => (
                        <tr key={it.id}>
                          <td className="py-2.5 px-3 font-extrabold text-foreground">
                            {it.item}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{it.category}</td>
                          <td className="py-2.5 px-3 font-bold text-foreground">
                            {it.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{it.justification}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 px-5 py-3 border-t border-border/60 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  toast.info("Preparing print...");
                  window.print();
                }}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="size-3.5" /> Print
              </button>
              <button
                type="button"
                onClick={() => setSelectedViewRecord(null)}
                className="px-5 py-2 bg-primary hover:bg-primary-glow text-white text-xs font-black rounded-xl shadow-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
