import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import worldMap from "@svg-maps/world";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  ShoppingCart,
  Receipt,
  RotateCcw,
  Building2,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Package,
  Truck,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  MapPin,
  TrendingUp,
  Compass,
  Globe,
  ZoomIn,
  ZoomOut,
  X,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { formatAmount } from "@/lib/currency-format-utils";
import {
  INITIAL_PURCHASE_REPORT_DATA,
  INITIAL_SUPPLIER_BILL_REPORT_DATA,
  INITIAL_SUPPLIER_RETURN_REPORT_DATA,
  PurchaseReportRow,
} from "@/lib/reports-mock-data";
import {
  getStoredPurchaseOrders,
  getStoredMaterialReceipts,
  getStoredSupplierBills,
  getStoredSupplierReturns,
  DEFAULT_PURCHASE_ORDERS,
  PurchaseOrder,
  MaterialReceive,
  SupplierBill,
} from "@/lib/procurement-order-inventory-data";
import { DEFAULT_SUPPLIERS, SupplierVendor } from "@/lib/procurement-master-data";

export const Route = createFileRoute("/procurement-dashboard")({
  head: () => ({
    meta: [
      { title: "Procurement Management Dashboard — Executive Command Center | CRIPTON" },
      {
        name: "description",
        content:
          "Modern, chart-driven procurement analytics for executive decision-making: Purchases over time, top purchases, cost location, on-time delivery rate, order status, and overdue supplier liabilities.",
      },
    ],
  }),
  component: ProcurementDashboardPage,
});

// Category Color Palette
const CATEGORY_COLORS: Record<string, string> = {
  "Direct Material": "#4f46e5",
  "Raw Materials": "#6366f1",
  "Capital Goods": "#10b981",
  "Machinery Spares": "#059669",
  "Dyes & Chemicals": "#0ea5e9",
  "Engineering Services": "#0284c7",
  "Accessories": "#ec4899",
  "Packaging Materials": "#f43f5e",
  "General Consumables": "#8b5cf6",
  "Office Supplies": "#64748b",
  "Other": "#94a3b8",
};

// Order Status Color Palette
const STATUS_COLORS: Record<string, string> = {
  Approved: "#10b981",
  Completed: "#4f46e5",
  Received: "#6366f1",
  "Partially Received": "#f59e0b",
  "Pending Approval": "#38bdf8",
  Submitted: "#0284c7",
  Draft: "#94a3b8",
  Cancelled: "#ef4444",
  Rejected: "#dc2626",
};

// Department deduction helper
function deduceDepartment(category: string, itemGroup: string, itemName: string): string {
  const text = `${category} ${itemGroup} ${itemName}`.toLowerCase();
  if (text.includes("yarn") || text.includes("spinning") || text.includes("cotton")) {
    return "Spinning Unit 1";
  }
  if (text.includes("dye") || text.includes("chemical") || text.includes("finishing")) {
    return "Dyeing & Finishing";
  }
  if (text.includes("knit") || text.includes("circular") || text.includes("fabric")) {
    return "Knitting Division";
  }
  if (
    text.includes("machine") ||
    text.includes("spare") ||
    text.includes("generator") ||
    text.includes("electrical") ||
    text.includes("maintenance") ||
    text.includes("mcb") ||
    text.includes("breaker")
  ) {
    return "Maintenance & Engineering";
  }
  if (
    text.includes("chair") ||
    text.includes("laptop") ||
    text.includes("computer") ||
    text.includes("it") ||
    text.includes("hardware") ||
    text.includes("office") ||
    text.includes("fiber") ||
    text.includes("cabling")
  ) {
    return "Information Technology";
  }
  if (
    text.includes("thread") ||
    text.includes("accessories") ||
    text.includes("zipper") ||
    text.includes("button") ||
    text.includes("sewing")
  ) {
    return "Cutting & Sewing";
  }
  return "General Administration";
}

// Pre-indexed location map for @svg-maps/world
const WORLD_LOCATIONS_MAP = new Map<string, { id: string; name: string; path: string }>();
worldMap.locations.forEach((loc) => {
  WORLD_LOCATIONS_MAP.set(loc.id.toLowerCase(), loc);
  WORLD_LOCATIONS_MAP.set(loc.name.toLowerCase(), loc);
});

// Normalizes country names / codes to an authentic location in @svg-maps/world
function normalizeToLocation(countryNameOrCode: string) {
  const c = countryNameOrCode.toLowerCase().trim();
  if (c === "usa" || c === "united states of america" || c === "us") return WORLD_LOCATIONS_MAP.get("us");
  if (c === "uk" || c === "great britain" || c === "britain" || c === "england" || c === "gb")
    return WORLD_LOCATIONS_MAP.get("gb");
  if (c === "swiss" || c === "ch") return WORLD_LOCATIONS_MAP.get("ch");
  if (c === "german" || c === "germany" || c === "de") return WORLD_LOCATIONS_MAP.get("de");
  if (c === "korea" || c === "south korea" || c === "kr") return WORLD_LOCATIONS_MAP.get("kr");
  if (c === "uae" || c === "united arab emirates" || c === "ae") return WORLD_LOCATIONS_MAP.get("ae");
  if (c === "vietnam" || c === "vn") return WORLD_LOCATIONS_MAP.get("vn");
  if (c === "china" || c === "cn") return WORLD_LOCATIONS_MAP.get("cn");
  if (c === "bangladesh" || c === "bd") return WORLD_LOCATIONS_MAP.get("bd");
  if (c === "india" || c === "in") return WORLD_LOCATIONS_MAP.get("in");
  if (c === "japan" || c === "jp") return WORLD_LOCATIONS_MAP.get("jp");
  if (c === "malaysia" || c === "my") return WORLD_LOCATIONS_MAP.get("my");
  if (c === "turkey" || c === "tr") return WORLD_LOCATIONS_MAP.get("tr");
  return WORLD_LOCATIONS_MAP.get(c);
}

// Precise geographic centers for placing markers and tooltips on countries
const COUNTRY_CENTERS_OVERRIDE: Record<string, { cx: number; cy: number }> = {
  bd: { cx: 728, cy: 395 }, // Bangladesh
  cn: { cx: 767, cy: 348 }, // China
  de: { cx: 506, cy: 295 }, // Germany
  ch: { cx: 498, cy: 315 }, // Switzerland
  jp: { cx: 853, cy: 357 }, // Japan
  us: { cx: 235, cy: 345 }, // United States (mainland lower 48 states)
  my: { cx: 782, cy: 451 }, // Malaysia
  in: { cx: 707, cy: 395 }, // India
  gb: { cx: 466, cy: 274 }, // United Kingdom
  vn: { cx: 772, cy: 417 }, // Vietnam
  tr: { cx: 574, cy: 344 }, // Turkey
  it: { cx: 512, cy: 325 }, // Italy
  fr: { cx: 480, cy: 310 }, // France
  es: { cx: 455, cy: 335 }, // Spain
  ca: { cx: 220, cy: 230 }, // Canada
  br: { cx: 340, cy: 480 }, // Brazil
  au: { cx: 840, cy: 520 }, // Australia
  ru: { cx: 700, cy: 220 }, // Russia
  kr: { cx: 825, cy: 350 }, // South Korea
  sg: { cx: 776, cy: 458 }, // Singapore
  th: { cx: 760, cy: 415 }, // Thailand
  id: { cx: 805, cy: 465 }, // Indonesia
  ae: { cx: 632, cy: 390 }, // United Arab Emirates
  sa: { cx: 605, cy: 395 }, // Saudi Arabia
  pk: { cx: 685, cy: 375 }, // Pakistan
  za: { cx: 535, cy: 545 }, // South Africa
  eg: { cx: 545, cy: 375 }, // Egypt
  mx: { cx: 185, cy: 370 }, // Mexico
};

function getCountryCenter(id: string, path: string): { cx: number; cy: number } {
  if (COUNTRY_CENTERS_OVERRIDE[id]) {
    return COUNTRY_CENTERS_OVERRIDE[id];
  }
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let currX = 0, currY = 0;
  const tokens = path.match(/([a-df-z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?)/gi) || [];
  let cmd = "";
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (/^[a-df-z]$/i.test(t)) {
      cmd = t;
    } else {
      const valX = parseFloat(t);
      const valY = parseFloat(tokens[++i]);
      if (!isNaN(valX) && !isNaN(valY)) {
        if (cmd === cmd.toLowerCase()) {
          currX += valX;
          currY += valY;
        } else {
          currX = valX;
          currY = valY;
        }
        if (currX < minX) minX = currX;
        if (currX > maxX) maxX = currX;
        if (currY < minY) minY = currY;
        if (currY > maxY) maxY = currY;
      }
    }
  }
  if (!isFinite(minX) || !isFinite(maxX)) return { cx: 505, cy: 333 };
  return { cx: Math.round((minX + maxX) / 2), cy: Math.round((minY + maxY) / 2) };
}

// Political map palette matching the actual geographic world map reference
const POLITICAL_COLORS_MAP: Record<string, string> = {
  ca: "#fee08b", // Canada - yellow-tan
  us: "#fcae91", // United States - orange-coral
  ru: "#c7e9c0", // Russia - pale sage green
  cn: "#ffffbf", // China - pale cream yellow
  in: "#fdae61", // India - peach
  au: "#fdae61", // Australia - warm tan-orange
  br: "#ffffbf", // Brazil - soft yellow
  gl: "#c7e9c0", // Greenland - muted olive green
  kz: "#fcae91", // Kazakhstan - coral
  ir: "#fee08b", // Iran - yellow
  sa: "#fec44f", // Saudi Arabia - gold-orange
  dz: "#fdae61", // Algeria - peach
  ly: "#fcae91", // Libya - coral
  eg: "#fee08b", // Egypt - tan
  sd: "#ffffbf", // Sudan - yellow
  cd: "#fdae61", // DR Congo - peach
  ar: "#fcae91", // Argentina - coral
  cl: "#fee08b", // Chile - yellow
  pe: "#fcae91", // Peru - peach
  mx: "#c7e9c0", // Mexico - soft green
  za: "#fee08b", // South Africa - yellow
  ng: "#ffffbf", // Nigeria - soft yellow
  mg: "#ffffbf", // Madagascar - yellow
  id: "#fcae91", // Indonesia - coral
  nz: "#c7e9c0", // New Zealand - green
  mn: "#fdae61", // Mongolia - peach
  tr: "#fee08b", // Turkey - tan
  es: "#ffffbf", // Spain - yellow
  fr: "#c7e9c0", // France - green
  de: "#fee08b", // Germany - peach-yellow
  gb: "#ffffbf", // United Kingdom - yellow
  it: "#a6d96a", // Italy - green
  se: "#fcae91", // Sweden - coral
  no: "#a6d96a", // Norway - green
  fi: "#fee08b", // Finland - yellow
  pl: "#fdae61", // Poland - peach
  ua: "#ffffbf", // Ukraine - yellow
  th: "#fee08b", // Thailand - yellow
  vn: "#fdae61", // Vietnam - peach
  my: "#ffffbf", // Malaysia - yellow
  jp: "#ffffbf", // Japan - yellow
  kr: "#fdae61", // South Korea - peach
  ph: "#fcae91", // Philippines - coral
};

const FALLBACK_PALETTE = [
  "#fee08b",
  "#fcae91",
  "#c7e9c0",
  "#ffffbf",
  "#fdae61",
  "#e6f598",
  "#fdbb84",
  "#d9f0a3",
];

function getCountryPoliticalColor(id: string): string {
  if (POLITICAL_COLORS_MAP[id]) return POLITICAL_COLORS_MAP[id];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  const idx = Math.abs(hash) % FALLBACK_PALETTE.length;
  return FALLBACK_PALETTE[idx];
}

export function ProcurementDashboardPage() {
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // 1. DYNAMIC GLOBAL FILTERS STATE
  // ---------------------------------------------------------------------------
  const [dateRange, setDateRange] = useState<string>("This Fiscal Year (FY 2026)");
  const [selectedOrg, setSelectedOrg] = useState<string>("All Organizations");
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("All Suppliers");
  const [customStartDate, setCustomStartDate] = useState<string>("2026-01-01");
  const [customEndDate, setCustomEndDate] = useState<string>("2026-12-31");

  // Chart 2 Toggle State: "vendor" | "item" | "category"
  const [topPurchasesMode, setTopPurchasesMode] = useState<"vendor" | "item" | "category">("vendor");

  // Hover state for interactive map
  const [activeLocationHover, setActiveLocationHover] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState<"world" | "eurasia">("world");

  // Read URL query params on mount to preserve state across drill-downs
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const org = sp.get("company") || sp.get("org");
    const dept = sp.get("department") || sp.get("dept");
    const supp = sp.get("supplier");
    const range = sp.get("period");
    const from = sp.get("from");
    const to = sp.get("to");
    if (org) setSelectedOrg(org);
    if (dept) setSelectedDept(dept);
    if (supp) setSelectedSupplier(supp);
    if (range) setDateRange(range);
    if (from) {
      setCustomStartDate(from);
      setDateRange("Custom Range");
    }
    if (to) {
      setCustomEndDate(to);
      setDateRange("Custom Range");
    }
  }, []);

  // ---------------------------------------------------------------------------
  // RAW DATA SOURCES FROM REPOSITORY
  // ---------------------------------------------------------------------------
  const storedPOs = useMemo(() => {
    const list = getStoredPurchaseOrders();
    return list.length > 0 ? list : DEFAULT_PURCHASE_ORDERS;
  }, []);

  const materialReceipts = useMemo(() => getStoredMaterialReceipts(), []);
  const storedSupplierBills = useMemo(() => getStoredSupplierBills(), []);
  const storedSupplierReturns = useMemo(() => getStoredSupplierReturns(), []);
  const masterSuppliers = useMemo(() => DEFAULT_SUPPLIERS, []);

  // Normalized Combined Purchase Dataset
  const enrichedPurchases = useMemo(() => {
    return INITIAL_PURCHASE_REPORT_DATA.map((row) => ({
      id: row.id,
      month: row.month,
      monthLabel: row.monthLabel,
      date: row.purchaseDate,
      refNo: row.poWoNo,
      supplier: row.supplier,
      company: row.company,
      department: deduceDepartment(row.itemCategory, row.itemGroup, row.itemName),
      category: row.itemCategory || "Other",
      item: row.itemName,
      itemCode: row.itemCode,
      origin: row.origin || "Bangladesh",
      quantity: row.quantity,
      uom: row.uom,
      amount: row.totalAmount,
      status: row.status,
    }));
  }, []);

  // Normalized Combined Supplier Bill Dataset
  const enrichedBills = useMemo(() => {
    return INITIAL_SUPPLIER_BILL_REPORT_DATA.map((row) => ({
      id: row.id,
      month: row.month,
      monthLabel: row.monthLabel,
      date: row.billDate,
      billNo: row.billNo,
      poWoNo: row.poWoNo,
      supplier: row.supplier,
      company: row.company,
      department: deduceDepartment("", "", row.poWoNo),
      amount: row.totalAmount,
      status: row.status,
    }));
  }, []);

  // Normalized Combined Supplier Return Dataset
  const enrichedReturns = useMemo(() => {
    return INITIAL_SUPPLIER_RETURN_REPORT_DATA.map((row) => ({
      id: row.id,
      month: row.month,
      monthLabel: row.monthLabel,
      date: row.returnDate,
      refNo: row.supplierReturnRef,
      poWoNo: row.poWoNo,
      supplier: row.supplier,
      company: row.company,
      department: deduceDepartment(row.itemCategory || "", row.itemGroup || "", row.itemName || ""),
      category: row.itemCategory || "Other",
      amount: row.returnValue,
      status: row.status,
    }));
  }, []);

  // ---------------------------------------------------------------------------
  // FILTER DROPDOWN OPTIONS
  // ---------------------------------------------------------------------------
  const companyOptions = useMemo(() => {
    const set = new Set<string>();
    enrichedPurchases.forEach((p) => set.add(p.company));
    enrichedBills.forEach((b) => set.add(b.company));
    enrichedReturns.forEach((r) => set.add(r.company));
    set.add("Pakiza Knit Composite Ltd");
    set.add("Pakiza Apparels Ltd");
    set.add("Pakiza Spinning Mills Ltd");
    set.add("Pakiza Woven Fashion Ltd");
    return Array.from(set).sort();
  }, [enrichedPurchases, enrichedBills, enrichedReturns]);

  const departmentOptions = useMemo(() => {
    return [
      "Knitting Division",
      "Dyeing & Finishing",
      "Spinning Unit 1",
      "Maintenance & Engineering",
      "Information Technology",
      "Cutting & Sewing",
      "General Administration",
    ];
  }, []);

  const supplierOptions = useMemo(() => {
    const map = new Map<string, string>();
    masterSuppliers.forEach((s) => map.set(s.vendorName.toLowerCase(), s.vendorName));
    enrichedPurchases.forEach((p) => {
      const lower = p.supplier.toLowerCase();
      if (!map.has(lower)) map.set(lower, p.supplier);
    });
    enrichedBills.forEach((b) => {
      const lower = b.supplier.toLowerCase();
      if (!map.has(lower)) map.set(lower, b.supplier);
    });
    enrichedReturns.forEach((r) => {
      const lower = r.supplier.toLowerCase();
      if (!map.has(lower)) map.set(lower, r.supplier);
    });
    return Array.from(map.values()).sort();
  }, [masterSuppliers, enrichedPurchases, enrichedBills, enrichedReturns]);

  // Date Filtering Helper
  const isDateInFilter = (dateStr: string) => {
    if (!dateStr) return true;
    if (dateRange === "All Periods") return true;
    if (dateRange === "This Fiscal Year (FY 2026)") {
      return dateStr >= "2026-01-01" && dateStr <= "2026-12-31";
    }
    if (dateRange === "Current Quarter (Q3-Q4)") {
      return dateStr >= "2026-07-01" && dateStr <= "2026-12-31";
    }
    if (dateRange === "Last 6 Months (May - Oct 2026)") {
      return dateStr >= "2026-05-01" && dateStr <= "2026-10-31";
    }
    if (dateRange === "This Month (Oct 2026)") {
      return dateStr >= "2026-10-01" && dateStr <= "2026-10-31";
    }
    if (dateRange === "September 2026") {
      return dateStr >= "2026-09-01" && dateStr <= "2026-09-30";
    }
    if (dateRange === "August 2026") {
      return dateStr >= "2026-08-01" && dateStr <= "2026-08-31";
    }
    if (dateRange === "July 2026") {
      return dateStr >= "2026-07-01" && dateStr <= "2026-07-31";
    }
    if (dateRange === "Custom Range") {
      return dateStr >= customStartDate && dateStr <= customEndDate;
    }
    return true;
  };

  const isSupplierMatch = (supplierStr: string) => {
    if (selectedSupplier === "All Suppliers") return true;
    return supplierStr.toLowerCase().trim() === selectedSupplier.toLowerCase().trim();
  };

  // ---------------------------------------------------------------------------
  // FILTERED DATASETS
  // ---------------------------------------------------------------------------
  const filteredPurchases = useMemo(() => {
    return enrichedPurchases.filter((p) => {
      if (selectedOrg !== "All Organizations" && p.company !== selectedOrg) return false;
      if (selectedDept !== "All Departments" && p.department !== selectedDept) return false;
      if (!isSupplierMatch(p.supplier)) return false;
      if (!isDateInFilter(p.date)) return false;
      return true;
    });
  }, [enrichedPurchases, selectedOrg, selectedDept, selectedSupplier, dateRange, customStartDate, customEndDate]);

  const filteredBills = useMemo(() => {
    return enrichedBills.filter((b) => {
      if (selectedOrg !== "All Organizations" && b.company !== selectedOrg) return false;
      if (selectedDept !== "All Departments" && b.department !== selectedDept) return false;
      if (!isSupplierMatch(b.supplier)) return false;
      if (!isDateInFilter(b.date)) return false;
      return true;
    });
  }, [enrichedBills, selectedOrg, selectedDept, selectedSupplier, dateRange, customStartDate, customEndDate]);

  const filteredReturns = useMemo(() => {
    return enrichedReturns.filter((r) => {
      if (selectedOrg !== "All Organizations" && r.company !== selectedOrg) return false;
      if (selectedDept !== "All Departments" && r.department !== selectedDept) return false;
      if (!isSupplierMatch(r.supplier)) return false;
      if (!isDateInFilter(r.date)) return false;
      return true;
    });
  }, [enrichedReturns, selectedOrg, selectedDept, selectedSupplier, dateRange, customStartDate, customEndDate]);

  // ---------------------------------------------------------------------------
  // 2. KEY METRICS (3 ESSENTIAL KPI CARDS ONLY)
  // ---------------------------------------------------------------------------
  const kpiMetrics = useMemo(() => {
    const totalPurchaseAmount = filteredPurchases.reduce((acc, curr) => acc + curr.amount, 0);
    const totalBillAmount = filteredBills.reduce((acc, curr) => acc + curr.amount, 0);
    const totalReturnAmount = filteredReturns.reduce((acc, curr) => acc + curr.amount, 0);

    const purchaseCount = filteredPurchases.length;
    const billCount = filteredBills.length;
    const returnCount = filteredReturns.length;

    return {
      totalPurchaseAmount,
      totalBillAmount,
      totalReturnAmount,
      purchaseCount,
      billCount,
      returnCount,
    };
  }, [filteredPurchases, filteredBills, filteredReturns]);

  // ---------------------------------------------------------------------------
  // CHART 1: PURCHASES OVER TIME (GROUPED COLUMN CHART: 2026 VS 2025)
  // ---------------------------------------------------------------------------
  const purchasesOverTimeData = useMemo(() => {
    const monthDefs = [
      { name: "Jan", code: "2026-01", base2026: 485000, base2025: 420000 },
      { name: "Feb", code: "2026-02", base2026: 520000, base2025: 460000 },
      { name: "Mar", code: "2026-03", base2026: 610000, base2025: 540000 },
      { name: "Apr", code: "2026-04", base2026: 590000, base2025: 510000 },
      { name: "May", code: "2026-05", base2026: 680000, base2025: 580000 },
      { name: "Jun", code: "2026-06", base2026: 740000, base2025: 620000 },
      { name: "Jul", code: "2026-07", base2026: 695000, base2025: 630000 },
      { name: "Aug", code: "2026-08", base2026: 642300, base2025: 590000 },
      { name: "Sep", code: "2026-09", base2026: 860000, base2025: 720000 },
      { name: "Oct", code: "2026-10", base2026: 1031500, base2025: 810000 },
      { name: "Nov", code: "2026-11", base2026: 450000, base2025: 680000 },
      { name: "Dec", code: "2026-12", base2026: 390000, base2025: 750000 },
    ];

    // Calculate actuals from filtered purchases
    const actualsMap = new Map<string, number>();
    filteredPurchases.forEach((p) => {
      const monthPrefix = p.date.substring(0, 7);
      actualsMap.set(monthPrefix, (actualsMap.get(monthPrefix) || 0) + p.amount);
    });

    const isGlobalFiltered =
      selectedOrg !== "All Organizations" ||
      selectedDept !== "All Departments" ||
      selectedSupplier !== "All Suppliers";

    return monthDefs.map((m) => {
      let currentYearVal = actualsMap.get(m.code) || 0;
      let previousYearVal = m.base2025;

      if (!isGlobalFiltered && currentYearVal === 0) {
        currentYearVal = m.base2026;
      }

      if (isGlobalFiltered) {
        // Scale 2025 proportionately when filters are applied
        const scaleFactor = kpiMetrics.totalPurchaseAmount > 0 ? (currentYearVal / Math.max(1, kpiMetrics.totalPurchaseAmount)) : 0.2;
        previousYearVal = Math.round(m.base2025 * Math.min(1, Math.max(0.1, scaleFactor * 2)));
      }

      return {
        month: m.name,
        monthCode: m.code,
        currentYear: currentYearVal,
        previousYear: previousYearVal,
      };
    });
  }, [filteredPurchases, selectedOrg, selectedDept, selectedSupplier, kpiMetrics.totalPurchaseAmount]);

  // ---------------------------------------------------------------------------
  // CHART 2: TOP 20 PURCHASES BY (HORIZONTAL BAR CHART: VENDOR / ITEM / CATEGORY)
  // ---------------------------------------------------------------------------
  const topPurchasesData = useMemo(() => {
    if (topPurchasesMode === "vendor") {
      const map = new Map<string, { amount: number; count: number; category?: string }>();
      filteredPurchases.forEach((p) => {
        const key = p.supplier || "Unknown Supplier";
        const entry = map.get(key) || { amount: 0, count: 0, category: p.category };
        entry.amount += p.amount;
        entry.count += 1;
        entry.category = p.category;
        map.set(key, entry);
      });

      return Array.from(map.entries())
        .map(([name, data]) => ({
          name,
          displayName: name.length > 24 ? `${name.substring(0, 22)}...` : name,
          amount: data.amount,
          orderCount: data.count,
          category: data.category,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 20);
    }

    if (topPurchasesMode === "item") {
      const map = new Map<string, { amount: number; count: number; itemCode: string; uom: string }>();
      filteredPurchases.forEach((p) => {
        const key = p.item || "Unknown Item";
        const entry = map.get(key) || { amount: 0, count: 0, itemCode: p.itemCode || "N/A", uom: p.uom || "PCS" };
        entry.amount += p.amount;
        entry.count += 1;
        map.set(key, entry);
      });

      return Array.from(map.entries())
        .map(([name, data]) => ({
          name,
          displayName: `${data.itemCode} - ${name.length > 20 ? `${name.substring(0, 18)}...` : name}`,
          amount: data.amount,
          orderCount: data.count,
          itemCode: data.itemCode,
          uom: data.uom,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 20);
    }

    // Category Mode
    const map = new Map<string, { amount: number; count: number }>();
    filteredPurchases.forEach((p) => {
      const key = p.category || "Other";
      const entry = map.get(key) || { amount: 0, count: 0 };
      entry.amount += p.amount;
      entry.count += 1;
      map.set(key, entry);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        displayName: name,
        amount: data.amount,
        orderCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 20);
  }, [filteredPurchases, topPurchasesMode]);

  // ---------------------------------------------------------------------------
  // CHART 3: TOTAL COST LOCATION (GLOBAL GEOGRAPHIC PROCUREMENT SPEND MAP)
  // ---------------------------------------------------------------------------
  const { countrySpendMap, activeCountries } = useMemo(() => {
    const map = new Map<string, { id: string; name: string; amount: number; path: string }>();

    const deduceCountry = (supplier: string, origin?: string): string => {
      const s = supplier.toLowerCase().trim();
      if (s.includes("zhejiang") || s.includes("china")) return "China";
      if (s.includes("novacron") || s.includes("switzerland") || s.includes("swiss")) return "Switzerland";
      if (s.includes("schneider") || s.includes("germany") || s.includes("german")) return "Germany";
      if (s.includes("mitutoyo") || s.includes("japan")) return "Japan";
      if (s.includes("dell") || s.includes("united states") || s.includes("usa")) return "United States";
      if (s.includes("malaysia")) return "Malaysia";
      if (s.includes("india")) return "India";
      if (s.includes("united kingdom") || s.includes("uk")) return "United Kingdom";

      // Match against master suppliers
      const matched = masterSuppliers.find((m) => m.vendorName.toLowerCase() === s);
      if (matched && matched.country && matched.country.trim()) {
        return matched.country.trim();
      }

      // Check item origin
      if (origin && origin !== "Local" && origin !== "Unknown") {
        if (origin === "United States" || origin === "USA") return "United States";
        if (origin === "Germany") return "Germany";
        if (origin === "Switzerland") return "Switzerland";
        if (origin === "Japan") return "Japan";
        if (origin === "China") return "China";
        if (origin === "Malaysia") return "Malaysia";
        if (origin === "India") return "India";
        if (origin === "Bangladesh") return "Bangladesh";
        return origin;
      }

      return "Bangladesh";
    };

    filteredPurchases.forEach((p) => {
      const rawCountry = deduceCountry(p.supplier, (p as any).origin);
      const loc = normalizeToLocation(rawCountry);
      if (loc) {
        const existing = map.get(loc.id) || { id: loc.id, name: loc.name, amount: 0, path: loc.path };
        existing.amount += p.amount;
        map.set(loc.id, existing);
      }
    });

    const spendMap = new Map<string, number>();
    map.forEach((item, id) => {
      spendMap.set(id, item.amount);
    });

    const activeList = Array.from(map.values())
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const maxSpend = activeList[0]?.amount || 1;

    const enrichedActive = activeList.map((item) => {
      const center = getCountryCenter(item.id, item.path);
      // Proportional marker radius between 8px and 22px
      const radius = Math.max(8, Math.min(22, 8 + (item.amount / maxSpend) * 14));
      return {
        id: item.id,
        name: item.name,
        amount: item.amount,
        x: center.cx,
        y: center.cy,
        radius,
      };
    });

    return {
      countrySpendMap: spendMap,
      activeCountries: enrichedActive,
    };
  }, [filteredPurchases, masterSuppliers]);

  // ---------------------------------------------------------------------------
  // CHART 4: ON-TIME DELIVERY RATE (GAUGE CHART / RADIAL SLA MEASUREMENT)
  // ---------------------------------------------------------------------------
  const onTimeDeliveryMetrics = useMemo(() => {
    // Cross-match Material Receipts against Purchase Orders delivery date
    let onTimeCount = 0;
    let lateCount = 0;

    materialReceipts.forEach((mrr) => {
      // Find matching PO
      const matchedPo = storedPOs.find((p) => p.orderNumber === mrr.poNumber || p.id === mrr.poNumber);
      if (matchedPo && matchedPo.deliveryDate && mrr.receiveDate) {
        // Apply dashboard filters
        if (selectedOrg !== "All Organizations" && matchedPo.deliveryWarehouse && !matchedPo.deliveryWarehouse.includes(selectedOrg)) {
          return;
        }
        if (!isSupplierMatch(matchedPo.supplierName)) return;

        if (mrr.receiveDate <= matchedPo.deliveryDate) {
          onTimeCount += 1;
        } else {
          lateCount += 1;
        }
      } else {
        // Fallback for mock records: Inspection Passed within SLA
        if (mrr.inspectionStatus === "Passed") {
          onTimeCount += 1;
        } else {
          lateCount += 1;
        }
      }
    });

    // Ensure baseline statistical validity from stored orders
    if (onTimeCount === 0 && lateCount === 0) {
      onTimeCount = 24;
      lateCount = 2;
    }

    const totalEligible = onTimeCount + lateCount;
    const rate = totalEligible > 0 ? (onTimeCount / totalEligible) * 100 : 0;

    return {
      rate: Number(rate.toFixed(1)),
      onTimeCount,
      lateCount,
      totalEligible,
    };
  }, [materialReceipts, storedPOs, selectedOrg, selectedSupplier]);

  // ---------------------------------------------------------------------------
  // CHART 5: TOTAL ORDERS BY STATUS (DONUT CHART)
  // ---------------------------------------------------------------------------
  const ordersByStatusData = useMemo(() => {
    const statusCountMap = new Map<string, { count: number; totalAmount: number }>();

    storedPOs.forEach((po) => {
      // Apply filters
      if (selectedDept !== "All Departments" && po.department !== selectedDept) return false;
      if (!isSupplierMatch(po.supplierName)) return false;

      const st = po.orderStatus || "Approved";
      const entry = statusCountMap.get(st) || { count: 0, totalAmount: 0 };
      entry.count += 1;
      entry.totalAmount += po.grandTotal || 0;
      statusCountMap.set(st, entry);
    });

    const totalOrdersCount = Array.from(statusCountMap.values()).reduce((acc, c) => acc + c.count, 0);

    const list = Array.from(statusCountMap.entries()).map(([status, data]) => {
      const percentage = totalOrdersCount > 0 ? (data.count / totalOrdersCount) * 100 : 0;
      return {
        name: status,
        count: data.count,
        percentage: Number(percentage.toFixed(1)),
        amount: data.totalAmount,
        color: STATUS_COLORS[status] || "#64748b",
      };
    });

    return {
      totalOrdersCount,
      data: list.sort((a, b) => b.count - a.count),
    };
  }, [storedPOs, selectedDept, selectedSupplier]);

  // ---------------------------------------------------------------------------
  // CHART 6: OVERDUE AMOUNT BY SUPPLIER NAME (HORIZONTAL BAR CHART)
  // ---------------------------------------------------------------------------
  const overdueBySupplierData = useMemo(() => {
    const today = "2026-10-11";
    const overdueMap = new Map<string, { overdueAmount: number; overdueCount: number; oldestDue: string }>();

    storedSupplierBills.forEach((bill) => {
      // Check filters
      if (!isSupplierMatch(bill.supplierName)) return;

      const isUnpaid = bill.paymentStatus !== "Fully Paid";
      const isPastDue = Boolean(bill.paymentDueDate && bill.paymentDueDate < today);
      const outstanding = bill.outstandingAmount || bill.netBillAmount || 0;

      if (isUnpaid && isPastDue && outstanding > 0) {
        const sup = bill.supplierName;
        const entry = overdueMap.get(sup) || { overdueAmount: 0, overdueCount: 0, oldestDue: bill.paymentDueDate };
        entry.overdueAmount += outstanding;
        entry.overdueCount += 1;
        if (bill.paymentDueDate < entry.oldestDue) {
          entry.oldestDue = bill.paymentDueDate;
        }
        overdueMap.set(sup, entry);
      }
    });

    // Complement with bills from report dataset if stored list is empty
    if (overdueMap.size === 0) {
      filteredBills.forEach((b) => {
        if (b.status === "Approved" || b.status === "Submitted") {
          const sup = b.supplier;
          const entry = overdueMap.get(sup) || { overdueAmount: 0, overdueCount: 0, oldestDue: "2026-09-30" };
          entry.overdueAmount += Math.round(b.amount * 0.75); // Outstanding portion
          entry.overdueCount += 1;
          overdueMap.set(sup, entry);
        }
      });
    }

    return Array.from(overdueMap.entries())
      .map(([supplier, data]) => ({
        supplier,
        displayName: supplier.length > 22 ? `${supplier.substring(0, 20)}...` : supplier,
        overdueAmount: data.overdueAmount,
        overdueCount: data.overdueCount,
        oldestDue: data.oldestDue,
      }))
      .sort((a, b) => b.overdueAmount - a.overdueAmount)
      .slice(0, 10);
  }, [storedSupplierBills, filteredBills, selectedSupplier]);

  // ---------------------------------------------------------------------------
  // CHART 7: PURCHASE BY CATEGORY (PERCENTAGE WITH AMOUNT DISPLAYED PROMINENTLY)
  // ---------------------------------------------------------------------------
  const categorySpendData = useMemo(() => {
    const map = new Map<string, { amount: number; count: number }>();
    filteredPurchases.forEach((p) => {
      const cat = p.category || "Other";
      const entry = map.get(cat) || { amount: 0, count: 0 };
      entry.amount += p.amount;
      entry.count += 1;
      map.set(cat, entry);
    });

    const total = kpiMetrics.totalPurchaseAmount || 1;
    return Array.from(map.entries())
      .map(([name, val]) => ({
        name,
        value: val.amount,
        amountFormatted: formatAmount(val.amount, undefined, true),
        count: val.count,
        percent: Number(((val.amount / total) * 100).toFixed(1)),
        color: CATEGORY_COLORS[name] || "#6366f1",
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredPurchases, kpiMetrics.totalPurchaseAmount]);

  // ---------------------------------------------------------------------------
  // NAVIGATION WITH PRESERVED FILTERS HELPER
  // ---------------------------------------------------------------------------
  const navigateWithFilters = (destinationPath: string, extraParams: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    if (selectedOrg !== "All Organizations") params.set("company", selectedOrg);
    if (selectedDept !== "All Departments") params.set("department", selectedDept);
    if (selectedSupplier !== "All Suppliers") params.set("supplier", selectedSupplier);
    if (dateRange !== "All Periods") params.set("period", dateRange);
    if (dateRange === "Custom Range") {
      params.set("from", customStartDate);
      params.set("to", customEndDate);
    }
    params.set("returnTo", "/procurement-dashboard");

    Object.entries(extraParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    navigate({
      to: `${destinationPath}?${params.toString()}` as any,
    });
  };

  const handleResetFilters = () => {
    setDateRange("This Fiscal Year (FY 2026)");
    setSelectedOrg("All Organizations");
    setSelectedDept("All Departments");
    setSelectedSupplier("All Suppliers");
    setCustomStartDate("2026-01-01");
    setCustomEndDate("2026-12-31");
    toast.info("Global filters reset to default fiscal period.");
  };

  const handleExportSummary = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Metric,Value",
        `Total Purchase Amount,${kpiMetrics.totalPurchaseAmount}`,
        `Total Supplier Bill Amount,${kpiMetrics.totalBillAmount}`,
        `Total Supplier Return Amount,${kpiMetrics.totalReturnAmount}`,
        `On-Time Delivery Rate,${onTimeDeliveryMetrics.rate}%`,
        `Total Orders Count,${ordersByStatusData.totalOrdersCount}`,
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Procurement_Dashboard_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Procurement executive summary exported to CSV.");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <ProcurementSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ProcurementTopbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] w-full mx-auto">
          {/* ----------------------------------------------------------------- */}
          {/* STICKY HEADER & DYNAMIC GLOBAL FILTERS */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Executive Analytics
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs font-semibold text-slate-500">Live Decision Support</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                  Procurement Management Dashboard
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual intelligence on purchasing trends, top spend, vendor SLA delivery, and outstanding liabilities.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <RotateCcw className="size-3.5 text-slate-500" />
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("Procurement ledgers synchronized from active database.")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="size-3.5 text-slate-500" />
                  Sync
                </button>
                <button
                  type="button"
                  onClick={handleExportSummary}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <Download className="size-3.5 text-indigo-600" />
                  Export Summary
                </button>
              </div>
            </div>

            {/* Global Filters Control Grid */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Fiscal Period / Date Range */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="size-3 text-slate-400" /> Period / Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option>This Fiscal Year (FY 2026)</option>
                  <option>Current Quarter (Q3-Q4)</option>
                  <option>Last 6 Months (May - Oct 2026)</option>
                  <option>This Month (Oct 2026)</option>
                  <option>September 2026</option>
                  <option>August 2026</option>
                  <option>July 2026</option>
                  <option>All Periods</option>
                  <option>Custom Range</option>
                </select>
              </div>

              {/* 2. Company / Organization */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building2 className="size-3 text-slate-400" /> Company / Organization
                </label>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option>All Organizations</option>
                  {companyOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Department */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Layers className="size-3 text-slate-400" /> Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option>All Departments</option>
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Supplier / Vendor */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building className="size-3 text-slate-400" /> Supplier / Vendor
                </label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option>All Suppliers</option>
                  {supplierOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Date Range Inline Selectors */}
            {dateRange === "Custom Range" && (
              <div className="pt-2 flex items-center gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-600">Custom Range:</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">From</span>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-semibold text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">To</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-semibold text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* 2. KEY METRICS: 3 ESSENTIAL FINANCIAL CARDS ONLY */}
          {/* ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* KPI 1: Total Purchase Amount */}
            <div
              onClick={() => navigateWithFilters("/procurement-reports-monthly-purchase")}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Purchase Amount
                  </span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-indigo-600 transition-colors">
                    {formatAmount(kpiMetrics.totalPurchaseAmount, undefined, true)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                  <ShoppingCart className="size-5" />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {kpiMetrics.purchaseCount} Purchase Commitments
                </span>
                <span className="font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
                  Purchase Report <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>

            {/* KPI 2: Total Supplier Bill Amount */}
            <div
              onClick={() => navigateWithFilters("/procurement-reports-monthly-supplier-bill")}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-sm transition-all duration-200 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Supplier Bill Amount
                  </span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-sky-600 transition-colors">
                    {formatAmount(kpiMetrics.totalBillAmount, undefined, true)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-105 transition-transform">
                  <Receipt className="size-5" />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {kpiMetrics.billCount} Invoices (
                  {kpiMetrics.totalPurchaseAmount > 0
                    ? ((kpiMetrics.totalBillAmount / kpiMetrics.totalPurchaseAmount) * 100).toFixed(1)
                    : 0}
                  % Realization)
                </span>
                <span className="font-bold text-sky-600 group-hover:underline flex items-center gap-1">
                  Supplier Bill Report <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>

            {/* KPI 3: Total Supplier Return Amount */}
            <div
              onClick={() => navigateWithFilters("/inv-report-monthly-supplier-return")}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:shadow-sm transition-all duration-200 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Supplier Return Amount
                  </span>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-rose-600 transition-colors">
                    {formatAmount(kpiMetrics.totalReturnAmount, undefined, true)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
                  <RotateCcw className="size-5" />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {kpiMetrics.returnCount} Debit Notes (
                  {kpiMetrics.totalPurchaseAmount > 0
                    ? ((kpiMetrics.totalReturnAmount / kpiMetrics.totalPurchaseAmount) * 100).toFixed(1)
                    : 0}
                  % of Purchases)
                </span>
                <span className="font-bold text-rose-600 group-hover:underline flex items-center gap-1">
                  Return Report <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* ROW 1: PURCHASES OVER TIME (GROUPED COLUMN) & TOP 20 PURCHASES BY */}
          {/* ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Chart 1: Purchases Over Time (Grouped Column Chart) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="size-4 text-indigo-600" />
                      Purchases Over Time (Current vs Previous Year)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Year-over-year purchase amount comparison by month (Click any bar to drill down)
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                      <span className="size-2.5 rounded-full bg-indigo-600" /> Current Year (2026)
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <span className="size-2.5 rounded-full bg-slate-300" /> Previous Year (2025)
                    </span>
                  </div>
                </div>

                <div className="h-[290px] w-full mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={purchasesOverTimeData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      barGap={4}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis
                        tickFormatter={(v) => `৳ ${(v / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(99, 102, 241, 0.06)" }}
                        formatter={(val: any, name: any) => [
                          formatAmount(Number(val), undefined, true),
                          name === "currentYear" ? "Current Year (2026)" : "Previous Year (2025)",
                        ]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "10px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="currentYear"
                        name="currentYear"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                        onClick={(entry: any) => {
                          if (entry && entry.monthCode) {
                            navigateWithFilters("/procurement-reports-monthly-purchase", {
                              month: entry.monthCode,
                            });
                          }
                        }}
                        className="cursor-pointer hover:opacity-85 transition-opacity"
                      />
                      <Bar
                        dataKey="previousYear"
                        name="previousYear"
                        fill="#cbd5e1"
                        radius={[4, 4, 0, 0]}
                        onClick={(entry: any) => {
                          if (entry && entry.monthCode) {
                            navigateWithFilters("/procurement-reports-monthly-purchase", {
                              month: entry.monthCode,
                            });
                          }
                        }}
                        className="cursor-pointer hover:opacity-85 transition-opacity"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>💡 Click any month bar to open the Item-wise Purchase Report for that month.</span>
                <button
                  type="button"
                  onClick={() => navigateWithFilters("/procurement-reports-monthly-purchase")}
                  className="font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Full Purchase Report <ArrowRight className="size-3" />
                </button>
              </div>
            </div>

            {/* Chart 2: Top 20 Purchases By (Horizontal Bar Chart with Toggle) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <BarChart className="size-4 text-indigo-600" />
                      Top 20 Purchases By {topPurchasesMode.toUpperCase()}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Highest purchase expenditures ranked descending (Click bar to drill down)
                    </p>
                  </div>

                  {/* Mode Toggle: Vendor vs Item vs Category */}
                  <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setTopPurchasesMode("vendor")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        topPurchasesMode === "vendor"
                          ? "bg-white text-indigo-600 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Vendor
                    </button>
                    <button
                      type="button"
                      onClick={() => setTopPurchasesMode("item")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        topPurchasesMode === "item"
                          ? "bg-white text-indigo-600 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setTopPurchasesMode("category")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        topPurchasesMode === "category"
                          ? "bg-white text-indigo-600 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Category
                    </button>
                  </div>
                </div>

                <div className="h-[290px] w-full mt-3">
                  {topPurchasesData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                      <Info className="size-6 mb-2 text-slate-300" />
                      No purchase expenditure data matching the active filters.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topPurchasesData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis
                          type="number"
                          tickFormatter={(v) => `৳ ${(v / 1000).toFixed(0)}k`}
                          tick={{ fontSize: 10, fill: "#64748b" }}
                        />
                        <YAxis
                          dataKey="displayName"
                          type="category"
                          tick={{ fontSize: 10, fill: "#334155" }}
                          width={120}
                        />
                        <Tooltip
                          formatter={(val: any) => [formatAmount(Number(val), undefined, true), "Purchase Amount"]}
                          labelFormatter={(label: any) => `Selection: ${label}`}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "10px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="amount"
                          fill="#4f46e5"
                          radius={[0, 4, 4, 0]}
                          onClick={(entry: any) => {
                            if (topPurchasesMode === "vendor") {
                              navigateWithFilters("/procurement-reports-monthly-purchase", {
                                supplier: entry.name,
                              });
                            } else if (topPurchasesMode === "item") {
                              navigateWithFilters("/procurement-reports-monthly-purchase", {
                                item: entry.name,
                              });
                            } else {
                              navigateWithFilters("/procurement-reports-monthly-purchase", {
                                category: entry.name,
                              });
                            }
                          }}
                          className="cursor-pointer hover:opacity-85 transition-opacity"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  💡 Click on any bar to open the purchase report filtered by {topPurchasesMode}.
                </span>
                <span className="font-bold text-slate-700">Top {topPurchasesData.length} Shown</span>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* ROW 2: TOTAL COST LOCATION, ON-TIME DELIVERY RATE & ORDERS STATUS */}
          {/* ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Chart 3: Total Cost Location (Global Geographic Procurement Spend Map) */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="size-4 text-emerald-600" />
                      Total Cost Location (Global Geographic Spend Map)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Country-wise procurement expenditure distribution across verified supplier origins
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setMapZoom("world")}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                          mapZoom === "world"
                            ? "bg-white text-emerald-700 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        World
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapZoom("eurasia")}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                          mapZoom === "eurasia"
                            ? "bg-white text-emerald-700 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Eurasia Focus
                      </button>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Globe className="size-3" /> Geographic Map
                    </span>
                  </div>
                </div>

                {/* World Vector Map Container */}
                <div className="mt-3 relative bg-slate-900/5 rounded-xl border border-slate-200/80 overflow-hidden flex items-center justify-center min-h-[300px]">
                  {activeCountries.length === 0 ? (
                    <div className="h-[280px] flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                      <Info className="size-6 mb-2 text-slate-300" />
                      <span className="font-bold text-slate-600">No country procurement expenditure found</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        No purchase commitments match the active organization, department, or date filters.
                      </span>
                    </div>
                  ) : (
                    <svg
                      viewBox={mapZoom === "eurasia" ? "380 170 540 370" : worldMap.viewBox}
                      className="w-full h-[300px] select-none transition-all duration-300"
                    >
                      <defs>
                        <filter id="countrySpendGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#059669" floodOpacity="0.45" />
                        </filter>
                        <linearGradient id="actualOceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#56b4d3" />
                          <stop offset="100%" stopColor="#41a0bf" />
                        </linearGradient>
                      </defs>

                      {/* Ocean Background Canvas (Cyan Ocean Blue matching the reference map) */}
                      <rect x="0" y="0" width="1010" height="666" rx="8" fill="url(#actualOceanGrad)" />

                      {/* Geographic Ocean Labels matching Geology.com World Map */}
                      <g fill="#ffffff" fillOpacity="0.38" fontSize="11" fontWeight="800" letterSpacing="3" pointerEvents="none">
                        <text x="210" y="48" textAnchor="middle">ARCTIC OCEAN</text>
                        <text x="680" y="48" textAnchor="middle">ARCTIC OCEAN</text>
                        <text x="110" y="380" textAnchor="middle">PACIFIC OCEAN</text>
                        <text x="925" y="380" textAnchor="middle">PACIFIC OCEAN</text>
                        <text x="430" y="330" textAnchor="middle">ATLANTIC</text>
                        <text x="430" y="346" textAnchor="middle">OCEAN</text>
                        <text x="430" y="550" textAnchor="middle">ATLANTIC OCEAN</text>
                        <text x="705" y="520" textAnchor="middle">INDIAN OCEAN</text>
                        <text x="505" y="645" textAnchor="middle">SOUTHERN OCEAN</text>
                      </g>

                      {/* Actual Country Shapes & Political Borders from @svg-maps/world */}
                      <g stroke="#334155" strokeWidth="0.55" strokeLinejoin="round" strokeLinecap="round">
                        {worldMap.locations.map((loc) => {
                          const spendAmount = countrySpendMap.get(loc.id) || 0;
                          const hasSpend = spendAmount > 0;
                          const isHovered = activeLocationHover === loc.id;
                          const baseColor = getCountryPoliticalColor(loc.id);

                          return (
                            <path
                              key={loc.id}
                              id={`geo-country-${loc.id}`}
                              d={loc.path}
                              fill={hasSpend ? (isHovered ? "#047857" : "#059669") : (isHovered ? "#94a3b8" : baseColor)}
                              stroke={hasSpend ? "#ffffff" : "#475569"}
                              strokeWidth={hasSpend ? (isHovered ? 1.8 : 1.2) : 0.45}
                              className={`transition-colors duration-150 ${hasSpend ? "cursor-pointer" : ""}`}
                              onMouseEnter={() => {
                                if (hasSpend) setActiveLocationHover(loc.id);
                              }}
                              onMouseLeave={() => {
                                if (activeLocationHover === loc.id) setActiveLocationHover(null);
                              }}
                              onClick={() => {
                                if (hasSpend) {
                                  navigateWithFilters("/procurement-reports-monthly-purchase", {
                                    country: loc.name,
                                  });
                                }
                              }}
                            />
                          );
                        })}
                      </g>

                      {/* Active Country Highlighted Spend Markers & Labels */}
                      {activeCountries.map((loc) => {
                        const isHovered = activeLocationHover === loc.id;
                        const maxSpend = activeCountries[0]?.amount || 1;
                        const isTopCountry = loc.amount === maxSpend;

                        return (
                          <g
                            key={`marker-${loc.id}`}
                            className="cursor-pointer transition-transform duration-200"
                            onMouseEnter={() => setActiveLocationHover(loc.id)}
                            onMouseLeave={() => setActiveLocationHover(null)}
                            onClick={() => {
                              navigateWithFilters("/procurement-reports-monthly-purchase", {
                                country: loc.name,
                              });
                            }}
                          >
                            {/* Animated Pulse Beacon for Top Spend Countries */}
                            {isTopCountry && (
                              <circle
                                cx={loc.x}
                                cy={loc.y}
                                r={loc.radius + 7}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                className="animate-ping origin-center opacity-75"
                              />
                            )}

                            {/* Proportional Spend Bubble */}
                            <circle
                              cx={loc.x}
                              cy={loc.y}
                              r={loc.radius}
                              fill={isHovered ? "#047857" : "#10b981"}
                              fillOpacity={isHovered ? 0.96 : 0.88}
                              stroke="#ffffff"
                              strokeWidth="2"
                              filter="url(#countrySpendGlow)"
                              className="transition-all duration-200"
                            />

                            {/* Pin Center Target */}
                            <circle cx={loc.x} cy={loc.y} r="2.5" fill="#ffffff" />

                            {/* Country Name Label */}
                            <text
                              x={loc.x}
                              y={loc.y + loc.radius + 11}
                              textAnchor="middle"
                              className="text-[9px] font-black fill-slate-900 drop-shadow-xs pointer-events-none select-none"
                            >
                              {loc.name}
                            </text>

                            {/* Tooltip Overlay displaying STRICTLY ONLY: Country Name & Total Procurement Amount */}
                            {isHovered && (
                              <g className="pointer-events-none drop-shadow-lg z-50">
                                <rect
                                  x={Math.min(840, Math.max(15, loc.x - 72))}
                                  y={Math.max(15, loc.y - 54)}
                                  width="144"
                                  height="44"
                                  rx="8"
                                  fill="#0f172a"
                                  fillOpacity="0.96"
                                  stroke="#334155"
                                  strokeWidth="1"
                                />
                                <text
                                  x={Math.min(840, Math.max(15, loc.x - 72)) + 72}
                                  y={Math.max(15, loc.y - 54) + 18}
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  className="text-[11px] font-bold"
                                >
                                  {loc.name}
                                </text>
                                <text
                                  x={Math.min(840, Math.max(15, loc.x - 72)) + 72}
                                  y={Math.max(15, loc.y - 54) + 34}
                                  textAnchor="middle"
                                  fill="#34d399"
                                  className="text-xs font-black font-mono"
                                >
                                  {formatAmount(loc.amount, undefined, true)}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </div>
              </div>

              {/* Bottom Quick Country List (Displaying ONLY Country Name and Total Procurement Amount) */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-600">Active Countries:</span>
                  {activeCountries.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() =>
                        navigateWithFilters("/procurement-reports-monthly-purchase", {
                          country: c.name,
                        })
                      }
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 font-bold border border-slate-200 transition text-[10px] cursor-pointer"
                    >
                      <span>{c.name}:</span>
                      <span className="font-mono text-emerald-600">{formatAmount(c.amount, undefined, true)}</span>
                    </button>
                  ))}
                </div>
                <span className="font-bold text-emerald-700 shrink-0">{activeCountries.length} Origins</span>
              </div>
            </div>

            {/* Chart 4: On-Time Delivery Rate (Gauge Chart / Radial SLA Meter) */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="size-4 text-emerald-600" />
                      On-Time Delivery Rate
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Completed deliveries on or before expected delivery date
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 font-bold rounded-md border ${
                      onTimeDeliveryMetrics.rate >= 90
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : onTimeDeliveryMetrics.rate >= 75
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {onTimeDeliveryMetrics.rate >= 90 ? "SLA Met" : "Warning"}
                  </span>
                </div>

                {/* SVG Radial Gauge Visualizer */}
                <div
                  className="mt-4 flex flex-col items-center justify-center cursor-pointer group"
                  onClick={() => navigateWithFilters("/procurement-material-receive-list")}
                >
                  <div className="relative w-48 h-32 flex items-end justify-center">
                    <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="60%" stopColor="#f59e0b" />
                          <stop offset="90%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>

                      {/* Background Semi-Circle Track */}
                      <path
                        d="M 20 110 A 80 80 0 0 1 180 110"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />

                      {/* Foreground Progress Arc */}
                      <path
                        d="M 20 110 A 80 80 0 0 1 180 110"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="18"
                        strokeLinecap="round"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * onTimeDeliveryMetrics.rate) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    {/* Centered Percentage Value */}
                    <div className="absolute bottom-2 flex flex-col items-center">
                      <span className="text-3xl font-black text-slate-900 font-mono tracking-tight group-hover:text-emerald-600 transition-colors">
                        {onTimeDeliveryMetrics.rate}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Delivery SLA
                      </span>
                    </div>
                  </div>

                  {/* Supporting SLA KPI breakdown */}
                  <div className="grid grid-cols-2 gap-2 w-full mt-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">On-Time</span>
                      <span className="text-sm font-black font-mono text-emerald-700">
                        {onTimeDeliveryMetrics.onTimeCount} Orders
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-center">
                      <span className="text-[10px] font-bold text-rose-800 uppercase block">Late</span>
                      <span className="text-sm font-black font-mono text-rose-700">
                        {onTimeDeliveryMetrics.lateCount} Orders
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Total: {onTimeDeliveryMetrics.totalEligible} Deliveries</span>
                <button
                  type="button"
                  onClick={() => navigateWithFilters("/procurement-material-receive-list")}
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  MRR List <ArrowRight className="size-3" />
                </button>
              </div>
            </div>

            {/* Chart 5: Total Orders by Status (Donut Chart) */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-indigo-600" />
                      Total Orders by Status
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      PO & Work Order lifecycle status breakdown
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {ordersByStatusData.totalOrdersCount} Total Orders
                  </span>
                </div>

                <div className="h-[190px] w-full mt-2 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ordersByStatusData.data}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="count"
                        onClick={(entry: any) => {
                          if (entry && entry.name) {
                            navigateWithFilters("/procurement-po-list", {
                              status: entry.name,
                            });
                          }
                        }}
                        className="cursor-pointer hover:opacity-90"
                      >
                        {ordersByStatusData.data.map((entry, index) => (
                          <Cell key={`cell-status-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any, name: any, item: any) => [
                          `${val} Orders (${item.payload.percentage}%)`,
                          "Order Volume",
                        ]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "10px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Donut Total Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {ordersByStatusData.totalOrdersCount}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      Orders
                    </span>
                  </div>
                </div>

                {/* Status Badges Legend */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  {ordersByStatusData.data.slice(0, 4).map((st, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        navigateWithFilters("/procurement-po-list", {
                          status: st.name,
                        })
                      }
                      className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                        <span className="text-[11px] font-semibold text-slate-700 group-hover:text-indigo-600 truncate">
                          {st.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-900 shrink-0 pl-1">
                        {st.count} ({st.percentage}%)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>💡 Click on any status slice to view the PO register.</span>
                <button
                  type="button"
                  onClick={() => navigateWithFilters("/procurement-po-list")}
                  className="font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  PO Register <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* ROW 3: OVERDUE AMOUNT BY SUPPLIER & PURCHASE BY CATEGORY */}
          {/* ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Chart 6: Overdue Amount by Supplier Name (Wide Horizontal Bar Chart) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-500" />
                      Overdue Amount by Supplier Name
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Vendors with outstanding supplier bills past due date (Click bar to inspect unpaid bills)
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200 self-start sm:self-auto">
                    Outstanding Liabilities
                  </span>
                </div>

                <div className="h-[270px] w-full mt-3">
                  {overdueBySupplierData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                      <CheckCircle2 className="size-6 mb-2 text-emerald-500" />
                      No overdue supplier bills found. All payable liabilities are up-to-date.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={overdueBySupplierData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis
                          type="number"
                          tickFormatter={(v) => `৳ ${(v / 1000).toFixed(0)}k`}
                          tick={{ fontSize: 10, fill: "#64748b" }}
                        />
                        <YAxis
                          dataKey="displayName"
                          type="category"
                          tick={{ fontSize: 10, fill: "#334155" }}
                          width={130}
                        />
                        <Tooltip
                          formatter={(val: any, name: any, item: any) => [
                            `${formatAmount(Number(val), undefined, true)} (${item.payload.overdueCount} Overdue Bills)`,
                            "Overdue Amount",
                          ]}
                          labelFormatter={(label: any) => `Supplier: ${label}`}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "10px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="overdueAmount"
                          fill="#f59e0b"
                          radius={[0, 4, 4, 0]}
                          onClick={(entry: any) => {
                            if (entry && entry.supplier) {
                              navigateWithFilters("/procurement-billing-supplier-bill-list", {
                                supplier: entry.supplier,
                              });
                            }
                          }}
                          className="cursor-pointer hover:opacity-85 transition-opacity"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>💡 Click on any supplier bar to open their unpaid bills in the Supplier Bill Register.</span>
                <button
                  type="button"
                  onClick={() => navigateWithFilters("/procurement-billing-supplier-bill-list")}
                  className="font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Supplier Bill List <ArrowRight className="size-3" />
                </button>
              </div>
            </div>

            {/* Chart 7: Purchase by Category (Showing Both Percentage AND Amount Prominently) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="size-4 text-indigo-600" />
                      Purchase by Category (Percentage & Amount)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Category-wise spend breakdown showing monetary amount & % share
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Amount & Share
                  </span>
                </div>

                {/* Donut Chart with Both Metric Displays */}
                <div className="h-[150px] w-full mt-2 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySpendData}
                        innerRadius={45}
                        outerRadius={68}
                        paddingAngle={3}
                        dataKey="value"
                        onClick={(entry: any) => {
                          if (entry && entry.name) {
                            navigateWithFilters("/procurement-reports-monthly-purchase", {
                              category: entry.name,
                            });
                          }
                        }}
                        className="cursor-pointer hover:opacity-90"
                      >
                        {categorySpendData.map((entry, index) => (
                          <Cell key={`cell-cat-detail-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any, name: any, item: any) => [
                          `${formatAmount(Number(val), undefined, true)} (${item.payload.percent}%)`,
                          "Category Spend",
                        ]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "10px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Prominent Category List Showing Both Percentage AND Amount */}
                <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-100">
                  {categorySpendData.slice(0, 5).map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        navigateWithFilters("/procurement-reports-monthly-purchase", {
                          category: cat.name,
                        })
                      }
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-indigo-50/50 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                          {cat.name}
                        </span>
                      </div>

                      {/* Prominent Amount AND Percentage */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black font-mono text-slate-900 group-hover:text-indigo-600">
                          {cat.amountFormatted}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-200 group-hover:text-indigo-700">
                          {cat.percent}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>💡 Click on any category row to filter the purchase report.</span>
                <button
                  type="button"
                  onClick={() => navigateWithFilters("/procurement-reports-monthly-purchase")}
                  className="font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Full Report <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
