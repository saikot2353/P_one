import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight,
  Package,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  UserCheck,
  User,
  FileText,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { RequisitionViewData } from "@/components/ssp/GeneralStoreRequisitionModal";

export const Route = createFileRoute("/ssp-store-requisition")({
  head: () => ({
    meta: [
      { title: "Store Requisition — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Submit store requisitions for ICT and General products, office stationery, hardware, and IT services.",
      },
    ],
  }),
  component: StoreRequisitionPage,
});

export type RequisitionType = "ICT" | "General";
export type ICTRequisitionType = "Service" | "Product";

export interface StoreRequisitionItem {
  id: string;
  reqType: RequisitionType;
  itemType: "Service" | "Product";
  name: string;
  quantity?: number;
  unit?: string;
  justification: string;
}

export interface StoreRequisitionRecord {
  id: string;
  reqType: RequisitionType;
  items: StoreRequisitionItem[];
  onBehalf: boolean;
  onBehalfEmp?: string;
  date: string;
  status: "Pending HOD" | "Approved" | "Under Review";
  department: string;
}

// ─── MASTER DROPDOWN DATA ───────────────────────────────────────────
export const ICT_SERVICES_OPTIONS = [
  { value: "OS Installation & Re-imaging", label: "OS Installation & Re-imaging (Windows 11 / Ubuntu)" },
  { value: "Laptop RAM / SSD Hardware Upgrade", label: "Laptop RAM / SSD Hardware Upgrade" },
  { value: "Network Port & LAN Setup", label: "Network Port & LAN Setup (Cat6 / IP Configuration)" },
  { value: "Antivirus / Security Suite License", label: "Antivirus / Microsoft 365 License Activation" },
  { value: "Printer Maintenance & Driver Setup", label: "Printer Maintenance & Driver / Network Setup" },
  { value: "VPN & Remote Access Configuration", label: "VPN & Remote Work Corporate Access Setup" },
  { value: "Email Domain / Outlook Setup", label: "Email Domain / Outlook Client Configuration" },
  { value: "Data Backup & Recovery", label: "Corporate Data Backup & Recovery Assistance" },
  { value: "Display / Screen Replacement", label: "Hardware Display / Screen Replacement Service" },
  { value: "Battery / Power Adapter Replacement", label: "Battery / Power Adapter Replacement Service" },
  { value: "Peripheral Troubleshooting", label: "Peripheral (Webcam, Mic, Docking) Troubleshooting" },
  { value: "Software License Activation", label: "Custom Software License (AutoCAD, Adobe, ERP) Activation" },
];

export const ICT_PRODUCTS_OPTIONS = [
  { value: "Dell 24\" IPS Monitor", label: "Dell 24\" UltraSharp IPS Monitor (U2422H)" },
  { value: "Logitech Wireless Combo", label: "Logitech MK295 Silent Wireless Keyboard & Mouse Combo" },
  { value: "Kingston 16GB DDR4 RAM", label: "Kingston 16GB DDR4 3200MHz Laptop RAM" },
  { value: "Samsung 500GB NVMe SSD", label: "Samsung 980 500GB NVMe M.2 High-Speed SSD" },
  { value: "UGREEN 6-in-1 Type-C Hub", label: "UGREEN 6-in-1 USB-C Multifunction Dock / Hub" },
  { value: "Dell 65W Type-C Adapter", label: "Dell 65W USB-C Original Laptop Power Adapter" },
  { value: "Cat6 LAN Cable (5m)", label: "Cat6 UTP Patch Cable (5 Meter Molded)" },
  { value: "Logitech C922 HD Webcam", label: "Logitech C922 Pro Full HD 1080p Webcam" },
  { value: "Jabra Evolve 20 USB Headset", label: "Jabra Evolve 20 USB Noise-Cancelling Headset" },
  { value: "Transcend 1TB External HDD", label: "Transcend 1TB USB 3.1 Shockproof External Hard Drive" },
  { value: "APC 650VA Line UPS", label: "APC 650VA Line Interactive Offline UPS" },
  { value: "HDMI to Type-C Cable (2m)", label: "High-Speed 4K HDMI to Type-C Cable (2m)" },
];

export const GENERAL_PRODUCTS_OPTIONS = [
  { value: "A4 Copy Paper (80 GSM)", label: "A4 Copy Paper Ream (80 GSM, Double A - 500 Sheets)" },
  { value: "Ballpoint Pens (Blue, Box of 12)", label: "Ballpoint Pens (Matador Blue, Box of 12)" },
  { value: "Ballpoint Pens (Black, Box of 12)", label: "Ballpoint Pens (Matador Black, Box of 12)" },
  { value: "Permanent Markers (Pack of 4)", label: "Permanent Markers (Chisel Tip, Multi-color Pack of 4)" },
  { value: "Document Box File (3-inch)", label: "Document Box File (3-inch, Heavy Duty Board, Pack of 5)" },
  { value: "Expanding File Folder", label: "Expanding File Folder (12 Pockets with Index Tabs)" },
  { value: "Stapler Machine & Staples", label: "Stapler Machine No. 10 & 24/6 Heavy Duty with Staples" },
  { value: "Correction Tape (Pack of 3)", label: "Correction Tape (5mm x 12m, Smooth Flow, Pack of 3)" },
  { value: "Sticky Notes / Post-it", label: "Sticky Notes / Post-it Pad (3x3 inch, 5 Neon Colors)" },
  { value: "2-Hole Paper Punch Machine", label: "2-Hole Paper Punching Machine (Heavy Duty Metal)" },
  { value: "Scotch Tape & Packing Tape", label: "Scotch Tape (1-inch) & Heavy Duty Transparent Packing Tape" },
  { value: "Spiral Executive Notebook", label: "Spiral Executive Notebook (A5 Ruled, Hardcover)" },
  { value: "Facial Tissue Box", label: "Facial Tissue Box (2-Ply, Pack of 4 Boxes)" },
  { value: "Whiteboard Duster & Cleaner", label: "Whiteboard Magnetic Duster & Surface Cleaner Spray" },
];

export const EMPLOYEE_OPTIONS = [
  { value: "EMP-0012: Md. Anik Islam", label: "Md. Anik Islam (EMP-0012) — Deputy Manager, Merchandising" },
  { value: "EMP-0045: Tahmid Afsar", label: "Tahmid Afsar (EMP-0045) — Software Engineer, IT Systems" },
  { value: "EMP-0023: Rajebul Hasan Rajon", label: "Rajebul Hasan Rajon (EMP-0023) — Assistant Manager, HR & Admin" },
  { value: "EMP-0078: Farzana Yasmin", label: "Farzana Yasmin (EMP-0078) — Merchandiser, Woven Division" },
  { value: "EMP-0034: Md. Kamrul Hasan", label: "Md. Kamrul Hasan (EMP-0034) — Quality Assurance Executive" },
  { value: "EMP-0089: Shirin Akter", label: "Shirin Akter (EMP-0089) — Senior Executive, Finance & Accounts" },
  { value: "EMP-0015: Md. Rafiqul Alam", label: "Md. Rafiqul Alam (EMP-0015) — Lead Systems Architect, IT" },
  { value: "EMP-0056: Nusrat Jahan", label: "Nusrat Jahan (EMP-0056) — Assistant Merchandiser" },
  { value: "EMP-0001: Engr. Mosharraf Hossain", label: "Engr. Mosharraf Hossain (EMP-0001) — Managing Director & CEO" },
];

export const QUANTITY_UNITS = ["Pcs", "Box", "Pack", "Ream", "Unit", "Set", "Meter"];

function StoreRequisitionPage() {
  const navigate = useNavigate();

  // ─── 1. REQUISITION TYPE: ICT vs General ───
  const [reqType, setReqType] = useState<RequisitionType>("ICT");

  // ─── 2. ICT REQUISITION TYPE: Service vs Product (used when reqType === 'ICT') ───
  const [ictReqType, setIctReqType] = useState<ICTRequisitionType>("Service");

  // Effective current item type: if General -> strictly Product. If ICT -> Service or Product.
  const currentItemType: "Service" | "Product" = reqType === "General" ? "Product" : ictReqType;

  // ─── 3. ITEM ENTRY FIELDS ───
  // Service Field
  const [selectedService, setSelectedService] = useState("");
  // Product Field
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("Pcs");
  // Justification Field (mandatory for both)
  const [justification, setJustification] = useState("");

  // ─── 4. MULTIPLE ITEMS LIST ───
  const [items, setItems] = useState<StoreRequisitionItem[]>([]);

  // ─── 5. ON BEHALF SELECT OPTION & EMPLOYEE DROPDOWN ───
  const [onBehalf, setOnBehalf] = useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = useState("");

  // ─── REQUISITION VIEW DOCKET MODAL ───
  const [viewDocketModal, setViewDocketModal] = useState<RequisitionViewData | null>(null);

  // ─── 6. RECENT REQUISITIONS LIST ───
  const [submittedRequisitions, setSubmittedRequisitions] = useState<StoreRequisitionRecord[]>([
    {
      id: "REQ-2026-STR-001",
      reqType: "ICT",
      items: [
        {
          id: "1",
          reqType: "ICT",
          itemType: "Product",
          name: "Dell 24\" IPS Monitor",
          quantity: 1,
          unit: "Unit",
          justification: "Dual monitor setup required for multi-system ERP monitoring and cross-referencing.",
        },
        {
          id: "2",
          reqType: "ICT",
          itemType: "Service",
          name: "Laptop RAM / SSD Hardware Upgrade",
          justification: "Current system freezes while processing heavy Excel sheets and SQL exports.",
        },
      ],
      onBehalf: false,
      date: "27/10/2026",
      status: "Pending HOD",
      department: "Information Technology",
    },
    {
      id: "REQ-2026-STR-002",
      reqType: "General",
      items: [
        {
          id: "3",
          reqType: "General",
          itemType: "Product",
          name: "A4 Copy Paper (80 GSM)",
          quantity: 5,
          unit: "Ream",
          justification: "Monthly departmental audit printing and purchase order file records.",
        },
        {
          id: "4",
          reqType: "General",
          itemType: "Product",
          name: "Document Box File (3-inch)",
          quantity: 10,
          unit: "Pcs",
          justification: "Archiving supplier MRRs and bill documentation for FY 2026-27.",
        },
      ],
      onBehalf: true,
      onBehalfEmp: "Md. Anik Islam (EMP-0012) — Deputy Manager, Merchandising",
      date: "26/10/2026",
      status: "Approved",
      department: "Merchandising",
    },
  ]);

  // Product dropdown options based on current reqType
  const currentProductOptions = reqType === "ICT" ? ICT_PRODUCTS_OPTIONS : GENERAL_PRODUCTS_OPTIONS;

  // Handle Add Item to Multiple Items List
  const handleAddItem = () => {
    const itemName = currentItemType === "Service" ? selectedService.trim() : selectedProduct.trim();

    if (!itemName) {
      toast.error(
        currentItemType === "Service"
          ? "Please select or type a service name."
          : "Please select or type a product name."
      );
      return;
    }

    if (!justification.trim()) {
      toast.error("Justification is required for this item.");
      return;
    }

    const qtyNumber = currentItemType === "Product" ? Math.max(1, parseInt(quantity, 10) || 1) : undefined;

    const newItem: StoreRequisitionItem = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      reqType,
      itemType: currentItemType,
      name: itemName,
      quantity: qtyNumber,
      unit: currentItemType === "Product" ? unit : undefined,
      justification: justification.trim(),
    };

    setItems((prev) => [...prev, newItem]);

    // Reset current item fields for rapid multiple item entry
    if (currentItemType === "Service") {
      setSelectedService("");
    } else {
      setSelectedProduct("");
      setQuantity("1");
    }
    setJustification("");

    toast.success(
      `✓ Added "${itemName}" to requisition list. Requisition type locked to ${reqType} (${currentItemType}).`
    );
  };

  // Handle Remove Item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (next.length === 0) {
        toast.info("Item removed. Requisition type is now unlocked.");
      } else {
        toast.info("Item removed from list.");
      }
      return next;
    });
  };

  // Handle Final Requisition Submit
  const handleSubmitRequisition = () => {
    if (items.length === 0) {
      toast.error("Please add at least one product or service before submitting.");
      return;
    }

    if (onBehalf && !onBehalfEmp.trim()) {
      toast.error("You checked 'On Behalf'. Please select the target employee from the dropdown.");
      return;
    }

    const newReqId = `REQ-2026-STR-${(submittedRequisitions.length + 1).toString().padStart(3, "0")}`;
    const newRecord: StoreRequisitionRecord = {
      id: newReqId,
      reqType,
      items: [...items],
      onBehalf,
      onBehalfEmp: onBehalf ? onBehalfEmp : undefined,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      status: "Pending HOD",
      department: "Merchandising & Operations",
    };

    setSubmittedRequisitions((prev) => [newRecord, ...prev]);
    setItems([]);
    setJustification("");
    setSelectedProduct("");
    setSelectedService("");
    setOnBehalf(false);
    setOnBehalfEmp("");

    toast.success(
      `🎉 Requisition ${newReqId} submitted successfully with ${newRecord.items.length} item(s)!`
    );

    navigate({
      to: "/ssp-store-requisition-view",
      search: { id: newReqId },
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-5 w-full">
          {/* Breadcrumb & Header */}
          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <Link to="/ssp-new-requisition" className="hover:text-primary transition-colors">
                  SSP
                </Link>
                <ChevronRight className="size-2.5" />
                <Link to="/ssp-new-requisition" className="hover:text-primary transition-colors">
                  New Requisition
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Store Requisition</span>
              </div>

              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
                  <Package className="size-5" />
                </div>
                <span>Store Requisition Portal</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Request ICT hardware, support services, and general corporate store stationery with individual justifications.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <Link
                to="/ssp-new-requisition"
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition flex items-center gap-1.5"
              >
                <span>← Requisition Hub</span>
              </Link>
              <div className="text-[10.5px] font-black uppercase bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg shadow-2xs">
                Roster Grade: Grade 3 Employee
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ─── LEFT COLUMN: REQUISITION BUILDER FORM (6 COLS) ────────────────────────── */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-card border border-border/80 rounded-2xl shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Layers className="size-4 text-primary" />
                      Configure Requisition Item
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select type, item, and enter required justification.
                    </p>
                  </div>
                </div>

                {/* Clean Simple Dropdowns: Requisition Type & ICT Requisition Type (Locked when items exist) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <span>Requisition Type</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      {items.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          <Lock className="size-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <select
                      value={reqType}
                      disabled={items.length > 0}
                      onChange={(e) => {
                        const val = e.target.value as "ICT" | "General";
                        setReqType(val);
                        setSelectedProduct("");
                        setSelectedService("");
                      }}
                      className={cn(
                        "w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary transition",
                        items.length > 0
                          ? "opacity-75 cursor-not-allowed bg-muted/40 text-muted-foreground select-none"
                          : "cursor-pointer hover:border-primary/50"
                      )}
                    >
                      <option value="ICT">ICT</option>
                      <option value="General">General</option>
                    </select>
                    {items.length > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Lock className="size-2.5 text-amber-500" />
                        Type locked. Remove all items from list to switch.
                      </p>
                    )}
                  </div>

                  {reqType === "ICT" && (
                    <div className="animate-in fade-in duration-150">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <span>ICT Requisition Type</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        {items.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            <Lock className="size-2.5" /> Locked
                          </span>
                        )}
                      </div>
                      <select
                        value={ictReqType}
                        disabled={items.length > 0}
                        onChange={(e) => {
                          const val = e.target.value as "Service" | "Product";
                          setIctReqType(val);
                          setSelectedProduct("");
                          setSelectedService("");
                        }}
                        className={cn(
                          "w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary transition",
                          items.length > 0
                            ? "opacity-75 cursor-not-allowed bg-muted/40 text-muted-foreground select-none"
                            : "cursor-pointer hover:border-primary/50"
                        )}
                      >
                        <option value="Service">Service</option>
                        <option value="Product">Product</option>
                      </select>
                      {items.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Lock className="size-2.5 text-amber-500" />
                          Sub-type locked while items are in list.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* ITEM FIELD (Service Searchable Dropdown OR Product Searchable Dropdown) */}
                {currentItemType === "Service" ? (
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Service <span className="text-rose-500">*</span>
                    </label>
                    <SearchableSelect
                      options={ICT_SERVICES_OPTIONS}
                      value={selectedService}
                      onChange={setSelectedService}
                      placeholder="Search service..."
                      allowCustom={true}
                      className="w-full h-10 text-xs font-medium"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Product <span className="text-rose-500">*</span>
                      </label>
                      <SearchableSelect
                        options={currentProductOptions}
                        value={selectedProduct}
                        onChange={setSelectedProduct}
                        placeholder={
                          reqType === "ICT"
                            ? "Search ICT Hardware..."
                            : "Search General Stationery..."
                        }
                        allowCustom={true}
                        className="w-full h-10 text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Quantity <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Unit
                        </label>
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer hover:border-primary/50 transition"
                        >
                          {QUANTITY_UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. JUSTIFICATION FIELD (Required for every item) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Item Justification <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      Specific business reason / urgency for this item
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Explain why this product/service is needed, what project/audit requires it, or what issue occurred..."
                    className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary resize-none placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Add to List Button */}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer shadow-xs"
                >
                  <Plus className="size-4 stroke-[2.5]" />
                  <span>
                    Add {currentItemType} to Requisition List (
                    {items.length} Added So Far)
                  </span>
                </button>
              </div>

              {/* 5. ON BEHALF SELECT OPTION & SEARCHABLE EMPLOYEE DROPDOWN */}
              <div className="bg-card border border-border/80 rounded-2xl shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="onBehalfCheckbox"
                      checked={onBehalf}
                      onChange={(e) => setOnBehalf(e.target.checked)}
                      className="size-4.5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <label
                      htmlFor="onBehalfCheckbox"
                      className="text-xs font-bold text-foreground cursor-pointer select-none flex items-center gap-1.5"
                    >
                      <UserCheck className="size-4 text-primary" />
                      <span>Request On Behalf of Another Employee</span>
                    </label>
                  </div>

                  {onBehalf && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase">
                      Active
                    </span>
                  )}
                </div>

                {onBehalf && (
                  <div className="p-4 bg-muted/20 border border-border/80 rounded-xl space-y-2 animate-in fade-in duration-150">
                    <label className="block text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Target Employee <span className="text-rose-500">*</span>
                    </label>
                    <SearchableSelect
                      options={EMPLOYEE_OPTIONS}
                      value={onBehalfEmp}
                      onChange={setOnBehalfEmp}
                      placeholder="Search employee by name, ID, or department..."
                      allowCustom={true}
                      className="w-full h-10.5 text-xs font-medium"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      The requisition docket and approval routing will be processed under this employee&apos;s name and departmental quota.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ─── RIGHT COLUMN: MULTIPLE ITEMS CART & SUBMISSION DOCKET (6 COLS) ────────── */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-card border border-border/80 rounded-2xl shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-foreground">
                      Requisition Items List ({items.length})
                    </h3>
                    {items.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Lock className="size-2.5" />
                        {reqType} • {currentItemType}
                      </span>
                    )}
                  </div>

                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setItems([]);
                        toast.info("All items cleared. Requisition type is now unlocked.");
                      }}
                      className="text-[10.5px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Items List Rendering */}
                {items.length === 0 ? (
                  <div className="py-12 px-4 text-center border-2 border-dashed border-border/70 rounded-xl bg-muted/10 space-y-2">
                    <Package className="size-8 text-muted-foreground/40 mx-auto" />
                    <p className="text-xs font-semibold text-muted-foreground">
                      No products or services added yet
                    </p>
                    <p className="text-[10.5px] text-muted-foreground/80 max-w-xs mx-auto">
                      Use the left form to select items, specify justification, and click &ldquo;Add to Requisition List&rdquo;. You can include multiple items.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 transition space-y-2 relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold text-muted-foreground font-mono">
                                #{idx + 1}
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                  item.itemType === "Service"
                                    ? "bg-purple-500/10 text-purple-600 border-purple-500/25"
                                    : item.reqType === "ICT"
                                    ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/25"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/25"
                                }`}
                              >
                                {item.reqType} {item.itemType}
                              </span>
                              {item.quantity && (
                                <span className="text-[10px] font-mono font-bold text-foreground bg-card border border-border px-1.5 py-0.2 rounded">
                                  Qty: {item.quantity} {item.unit || "Pcs"}
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-bold text-foreground truncate mt-1">
                              {item.name}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                            title="Remove this item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>

                        {/* Justification Box */}
                        <div className="p-2.5 bg-card rounded-lg border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                          <span className="font-semibold text-foreground mr-1">Justification:</span>
                          {item.justification}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submission Footer */}
                <div className="pt-3 border-t border-border/60 space-y-3">
                  {onBehalf && onBehalfEmp && (
                    <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-xs text-primary flex items-center gap-2">
                      <User className="size-4 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold">On Behalf of:</span> {onBehalfEmp}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmitRequisition}
                    disabled={items.length === 0}
                    className={`w-full h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs ${
                      items.length > 0
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                        : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Send className="size-4" />
                    <span>Submit Store Requisition ({items.length} Items)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
