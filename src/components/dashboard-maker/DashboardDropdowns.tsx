import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Check,
  Search,
  X,
  User,
  Crown,
  Building2,
  Layers,
  Store,
  Package,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { WidgetColSpan } from "./dashboard-maker-types";

// ============================================================================
// BUYERS & WAREHOUSES MASTER CATALOG
// ============================================================================
export interface BuyerMeta {
  id: string;
  name: string;
  country: string;
  code: string;
  tier: string;
}

export const BUYER_OPTIONS: BuyerMeta[] = [
  { id: "H&M Group", name: "H&M Group", country: "Sweden", code: "HM-SE", tier: "Tier-1 Strategic" },
  { id: "Zara / Inditex", name: "Zara / Inditex", country: "Spain", code: "ITX-ES", tier: "Tier-1 Strategic" },
  { id: "Target USA", name: "Target USA", country: "United States", code: "TGT-US", tier: "Tier-1 Major" },
  { id: "Next UK", name: "Next UK", country: "United Kingdom", code: "NXT-GB", tier: "Tier-2 Regular" },
  { id: "C&A Europe", name: "C&A Europe", country: "Belgium / Germany", code: "CA-EU", tier: "Tier-2 Regular" },
  { id: "Marks & Spencer", name: "Marks & Spencer", country: "United Kingdom", code: "MNS-UK", tier: "Tier-2 Core" },
  { id: "Primark", name: "Primark", country: "Ireland / UK", code: "PRM-IE", tier: "Volume Core" },
  { id: "Walmart USA", name: "Walmart USA", country: "United States", code: "WMT-US", tier: "Tier-1 Volume" },
];

export const WAREHOUSE_OPTIONS = [
  { id: "All Warehouses", name: "All Warehouses (সম্মিলিত)", desc: "All 4 Stores Combined" },
  { id: "Central Raw Material Store", name: "Central Raw Material Store", desc: "Fabrics & Yarns Warehouse" },
  { id: "Trims & Accessories Warehouse", name: "Trims & Accessories Store", desc: "Zippers, Buttons & Labels" },
  { id: "Chemical & Dyeing Store", name: "Chemical & Dyeing Store", desc: "Dyes, Chemicals & Washing" },
  { id: "Finished Goods Store", name: "Finished Goods Warehouse", desc: "Packed Cartons Pre-Shipment" },
];

// ============================================================================
// HOOK: OUTSIDE CLICK LISTENER
// ============================================================================
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ============================================================================
// 1. PROFESSIONAL SCOPE DROPDOWN (Personal, Head of Dept, Dept, Company)
// ============================================================================
interface ScopeDropdownProps {
  value: string;
  supportedScopes: Array<"personal" | "managed_depts" | "department" | "company">;
  colSpan: number;
  managedDepartmentCount?: number;
  onChange: (scope: "personal" | "managed_depts" | "department" | "company") => void;
}

export const ScopeDropdown: React.FC<ScopeDropdownProps> = ({
  value,
  supportedScopes,
  colSpan,
  managedDepartmentCount = 2,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false));

  const scope = value || "company";

  // Visual meta for the active button
  const getTriggerMeta = () => {
    switch (scope) {
      case "personal":
        return {
          icon: <User className="size-3 text-blue-500" />,
          label: "My Self",
          cls: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20",
        };
      case "managed_depts":
        return {
          icon: <Crown className="size-3 text-amber-500" />,
          label: colSpan <= 4 ? "Head" : `Head (${managedDepartmentCount})`,
          cls: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20",
        };
      case "department":
        return {
          icon: <Building2 className="size-3 text-purple-500" />,
          label: "Dept",
          cls: "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20",
        };
      case "company":
      default:
        return {
          icon: <Layers className="size-3 text-emerald-500" />,
          label: "Company",
          cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20",
        };
    }
  };

  const current = getTriggerMeta();

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-6 px-2 rounded-md border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs select-none ${current.cls}`}
        title="Switch Reporting Scope"
      >
        {current.icon}
        <span className="truncate max-w-[65px]">{current.label}</span>
        <ChevronDown className={`size-3 transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl bg-popover/98 backdrop-blur-md border border-border/80 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/50 flex items-center justify-between">
            <span>Select Data Scope</span>
            <span className="text-[9px] text-primary">Live Filter</span>
          </div>

          <div className="space-y-0.5 pt-0.5">
            {supportedScopes.includes("personal") && (
              <button
                type="button"
                onClick={() => {
                  onChange("personal");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  scope === "personal"
                    ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold"
                    : "hover:bg-muted/70 text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <User className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">My Self (আমার নিজের)</div>
                    <div className="text-[9.5px] text-muted-foreground truncate">ব্যক্তিগত উপস্থিতি ও ওভারটাইম</div>
                  </div>
                </div>
                {scope === "personal" && <Check className="size-3.5 text-blue-600 shrink-0" />}
              </button>
            )}

            {supportedScopes.includes("managed_depts") && (
              <button
                type="button"
                onClick={() => {
                  onChange("managed_depts");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  scope === "managed_depts"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold"
                    : "hover:bg-muted/70 text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Crown className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight flex items-center gap-1">
                      <span>Head of Dept</span>
                      <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                        {managedDepartmentCount} Depts
                      </span>
                    </div>
                    <div className="text-[9.5px] text-muted-foreground truncate">বিভাগীয় প্রধানের ফ্লোর রিপোর্ট</div>
                  </div>
                </div>
                {scope === "managed_depts" && <Check className="size-3.5 text-amber-600 shrink-0" />}
              </button>
            )}

            {supportedScopes.includes("department") && (
              <button
                type="button"
                onClick={() => {
                  onChange("department");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  scope === "department"
                    ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold"
                    : "hover:bg-muted/70 text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <Building2 className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Single Department</div>
                    <div className="text-[9.5px] text-muted-foreground truncate">নির্দিষ্ট সেকশনের একক রিপোর্ট</div>
                  </div>
                </div>
                {scope === "department" && <Check className="size-3.5 text-purple-600 shrink-0" />}
              </button>
            )}

            {supportedScopes.includes("company") && (
              <button
                type="button"
                onClick={() => {
                  onChange("company");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  scope === "company"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "hover:bg-muted/70 text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Layers className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Entire Company</div>
                    <div className="text-[9.5px] text-muted-foreground truncate">পুরো ফ্যাক্টরির ১,২৪৮ কর্মী</div>
                  </div>
                </div>
                {scope === "company" && <Check className="size-3.5 text-emerald-600 shrink-0" />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. PROFESSIONAL SEARCHABLE MULTI-SELECT BUYER DROPDOWN
// ============================================================================
interface BuyerMultiSelectDropdownProps {
  selectedBuyers: string[]; // array of selected buyer IDs
  colSpan: number;
  onChange: (buyers: string[]) => void;
}

export const BuyerMultiSelectDropdown: React.FC<BuyerMultiSelectDropdownProps> = ({
  selectedBuyers = [],
  colSpan,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false));

  // Filter buyers by search query
  const filteredBuyers = useMemo(() => {
    if (!search.trim()) return BUYER_OPTIONS;
    const q = search.toLowerCase();
    return BUYER_OPTIONS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.tier.toLowerCase().includes(q)
    );
  }, [search]);

  // Compute active selection label
  const isAllSelected =
    selectedBuyers.length === 0 || selectedBuyers.length === BUYER_OPTIONS.length;

  const triggerLabel = useMemo(() => {
    if (isAllSelected) return "All Buyers";
    if (selectedBuyers.length === 1) {
      return selectedBuyers[0].split(" ")[0];
    }
    return `${selectedBuyers.length} Buyers`;
  }, [isAllSelected, selectedBuyers]);

  // Toggle single buyer
  const handleToggleBuyer = (buyerId: string) => {
    let next: string[];
    if (selectedBuyers.includes(buyerId)) {
      next = selectedBuyers.filter((id) => id !== buyerId);
    } else {
      next = [...selectedBuyers, buyerId];
    }
    onChange(next);
  };

  // Select All
  const handleSelectAll = () => {
    onChange([]); // Empty represents all buyers
  };

  // Clear All (uncheck everything or pick first)
  const handleClearAll = () => {
    onChange([BUYER_OPTIONS[0].id]);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-6 px-2 rounded-md border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs select-none ${
          !isAllSelected
            ? "border-teal-500/50 bg-teal-500/20 text-teal-800 dark:text-teal-200 hover:bg-teal-500/30 font-black"
            : "border-teal-500/35 bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20"
        }`}
        title={`Filter by Buyer (${isAllSelected ? "All" : selectedBuyers.join(", ")})`}
      >
        <Store className="size-3 text-teal-600" />
        <span className="truncate max-w-[70px]">{triggerLabel}</span>
        {!isAllSelected && (
          <span className="size-3.5 rounded-full bg-teal-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">
            {selectedBuyers.length}
          </span>
        )}
        <ChevronDown className={`size-3 transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Floating Searchable Multi-Select Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 rounded-2xl bg-popover/98 backdrop-blur-md border border-border/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
          {/* Header & Search Bar */}
          <div className="space-y-1.5 pb-2 border-b border-border/60">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-foreground px-1">
              <span className="flex items-center gap-1.5 text-teal-600">
                <Store className="size-3.5" />
                <span>Multi-Buyer Filter</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {isAllSelected ? "All Selected" : `${selectedBuyers.length} of ${BUYER_OPTIONS.length}`}
              </span>
            </div>

            {/* Instant Search Input */}
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search buyer name, country..."
                className="w-full h-7 pl-8 pr-7 text-xs bg-muted/50 border border-border/70 rounded-xl outline-none focus:border-teal-500 focus:bg-background transition-all text-foreground placeholder:text-muted-foreground/70"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Quick Actions: Select All & Clear */}
            <div className="flex items-center justify-between pt-0.5 text-[10px]">
              <button
                type="button"
                onClick={handleSelectAll}
                className={`px-2 py-0.5 rounded-md font-bold cursor-pointer transition-colors ${
                  isAllSelected
                    ? "bg-teal-500/20 text-teal-700 dark:text-teal-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                ✓ Select All (Show All)
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2 py-0.5 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 font-medium cursor-pointer transition-colors"
              >
                Reset to Primary
              </button>
            </div>
          </div>

          {/* Scrollable Checklist */}
          <div className="max-h-52 overflow-y-auto space-y-1 pr-0.5">
            {filteredBuyers.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No buyers found matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredBuyers.map((buyer) => {
                const isChecked = isAllSelected || selectedBuyers.includes(buyer.id);
                return (
                  <div
                    key={buyer.id}
                    onClick={() => handleToggleBuyer(buyer.id)}
                    className={`px-2 py-1.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                      isChecked
                        ? "bg-teal-500/10 border-teal-500/40 text-foreground font-bold shadow-2xs"
                        : "bg-background border-border/50 hover:border-teal-300 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs truncate flex items-center gap-1.5">
                        <span className="font-bold">{buyer.name}</span>
                        <span className="text-[9.5px] px-1 py-0.1 rounded bg-muted/60 text-muted-foreground font-mono">
                          {buyer.code}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {buyer.country} • {buyer.tier}
                      </div>
                    </div>

                    <div
                      className={`size-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                        isChecked
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "border-border/80 bg-background"
                      }`}
                    >
                      {isChecked && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Done Action */}
          <div className="pt-1.5 border-t border-border/60 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {isAllSelected ? "Showing combined all buyers" : `Filtering ${selectedBuyers.length} buyers`}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. PROFESSIONAL WAREHOUSE STORE DROPDOWN
// ============================================================================
interface WarehouseDropdownProps {
  value: string;
  colSpan: number;
  onChange: (warehouse: string) => void;
}

export const WarehouseDropdown: React.FC<WarehouseDropdownProps> = ({
  value,
  colSpan,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false));

  const currentVal = value || "All Warehouses";
  const selected = WAREHOUSE_OPTIONS.find((w) => w.id === currentVal) || WAREHOUSE_OPTIONS[0];

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-6 px-2 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs select-none"
        title={`Filter Warehouse: ${selected.name}`}
      >
        <Package className="size-3 text-amber-600" />
        <span className="truncate max-w-[70px]">{selected.name.split(" ")[0]}</span>
        <ChevronDown className={`size-3 transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-64 rounded-2xl bg-popover/98 backdrop-blur-md border border-border/80 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/50 flex items-center justify-between">
            <span>Select Warehouse Store</span>
            <span className="text-[9px] text-amber-600">Stock Location</span>
          </div>

          <div className="space-y-0.5 pt-0.5">
            {WAREHOUSE_OPTIONS.map((w) => {
              const isSelected = currentVal === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    onChange(w.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold"
                      : "hover:bg-muted/70 text-foreground"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold leading-tight truncate">{w.name}</div>
                    <div className="text-[9.5px] text-muted-foreground truncate">{w.desc}</div>
                  </div>
                  {isSelected && <Check className="size-3.5 text-amber-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 4. PROFESSIONAL WIDTH (COLSPAN) DROPDOWN
// ============================================================================
interface WidthDropdownProps {
  value: WidgetColSpan;
  availableSpans: Array<{ val: WidgetColSpan; label: string; desc?: string }>;
  onChange: (span: WidgetColSpan) => void;
}

export const WidthDropdown: React.FC<WidthDropdownProps> = ({
  value,
  availableSpans,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setIsOpen(false));

  const current = availableSpans.find((s) => s.val === value) || availableSpans[0];

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-6 px-1.5 rounded-md border border-border/70 bg-background hover:bg-muted text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-all shadow-2xs select-none"
        title={`Set Card Width: currently ${current.label}`}
      >
        <span>{current.label}</span>
        <ChevronDown className={`size-2.5 transition-transform duration-200 opacity-60 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-popover/98 backdrop-blur-md border border-border/80 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
          <div className="px-2 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/50">
            Card Grid Width
          </div>
          <div className="space-y-0.5 pt-0.5">
            {availableSpans.map((s) => {
              const isSelected = value === s.val;
              return (
                <button
                  key={s.val}
                  type="button"
                  onClick={() => {
                    onChange(s.val);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-muted/70 text-foreground"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{s.label}</span>
                    {s.desc && <span className="text-[9.5px] text-muted-foreground block">{s.desc}</span>}
                  </div>
                  {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
