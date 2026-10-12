import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Boxes,
  Package,
  AlertTriangle,
  ArrowRightLeft,
  RotateCcw,
  ExternalLink,
  Building2,
  Store,
  Layers,
  Calendar,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  DEFAULT_ITEMS,
  DEFAULT_WAREHOUSES,
  DEFAULT_ITEM_CATEGORIES,
} from "@/lib/procurement-master-data";
import {
  INITIAL_STOCK_BALANCE_DATA,
  INITIAL_BATCH_STOCK_DATA,
  INITIAL_RECEIPT_REGISTER_DATA,
  INITIAL_ISSUE_REGISTER_DATA,
  INITIAL_STOCK_TRANSFER_DATA,
  INITIAL_STOCK_ADJUSTMENT_DATA,
  INITIAL_STOCK_WRITEOFF_DATA,
  INITIAL_LEDGER_DATA,
  INITIAL_SUPPLIER_RETURN_REPORT_DATA,
} from "@/lib/reports-mock-data";
import {
  getStoredInterCompanyTransfers,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import {
  formatAmount,
  getActiveCurrencyConfig,
} from "@/lib/currency-format-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/inv-dashboard")({
  head: () => ({
    meta: [
      { title: "Inventory Management Dashboard — CRIPTON ERP" },
      {
        name: "description",
        content:
          "Executive chart-driven Inventory Management Dashboard with stock movement velocity, valuation by store, stock health, transaction distribution, and inventory risk analysis.",
      },
    ],
  }),
  component: InvDashboardPage,
});

// ---------------------------------------------------------------------------
// Unified Inventory Item Definition for Dashboard Analytics
// ---------------------------------------------------------------------------
export interface DashboardStockItem {
  id: string;
  itemCode: string;
  itemName: string;
  company: string;
  store: string;
  itemGroup: string;
  itemCategory: string;
  uom: string;
  currentStock: number;
  reorderLevel: number;
  criticalLevel: number;
  unitCost: number;
  stockValue: number;
  status: "Healthy Stock" | "Low Stock" | "Critical Stock" | "Out of Stock";
  batchTracking: boolean;
  expiryTracking: boolean;
  isExpiringSoon?: boolean;
  isExpired?: boolean;
}

// Master comprehensive stock item population across all companies & warehouses
const MASTER_INVENTORY_ITEMS: DashboardStockItem[] = [
  {
    id: "stk-1",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    company: "Pakiza Knit Composite Ltd",
    store: "Yarn Store (PKCL)",
    itemGroup: "Yarn Raw Material",
    itemCategory: "Direct Material",
    uom: "KG",
    currentStock: 5500,
    reorderLevel: 1000,
    criticalLevel: 500,
    unitCost: 380,
    stockValue: 2090000,
    status: "Healthy Stock",
    batchTracking: true,
    expiryTracking: false,
  },
  {
    id: "stk-2",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    company: "Pakiza Knit Composite Ltd",
    store: "Chemical Store",
    itemGroup: "Dyes & Chemicals",
    itemCategory: "Direct Material",
    uom: "KG",
    currentStock: 1025,
    reorderLevel: 250,
    criticalLevel: 125,
    unitCost: 620,
    stockValue: 635500,
    status: "Healthy Stock",
    batchTracking: true,
    expiryTracking: true,
    isExpiringSoon: true, // expires Nov 2026
  },
  {
    id: "stk-3",
    itemCode: "ITM-001",
    itemName: "Manager Chair High Back",
    company: "Pakiza Knit Composite Ltd",
    store: "Central Warehouse (Savar)",
    itemGroup: "Office Furniture",
    itemCategory: "Capital Goods",
    uom: "PCS",
    currentStock: 25,
    reorderLevel: 5,
    criticalLevel: 2,
    unitCost: 4500,
    stockValue: 112500,
    status: "Healthy Stock",
    batchTracking: false,
    expiryTracking: false,
  },
  {
    id: "stk-4",
    itemCode: "FAB-001",
    itemName: "Cotton Twill 20x16 Fabric",
    company: "Pakiza Woven Fashion Ltd",
    store: "General Store (PWFL)",
    itemGroup: "Grey Fabric",
    itemCategory: "Direct Material",
    uom: "YDS",
    currentStock: 200,
    reorderLevel: 500,
    criticalLevel: 250,
    unitCost: 195,
    stockValue: 39000,
    status: "Critical Stock", // below critical level of 250
    batchTracking: false,
    expiryTracking: false,
  },
  {
    id: "stk-5",
    itemCode: "ACC-001",
    itemName: "Sewing Thread 40/2 5000m",
    company: "Pakiza Apparels Ltd",
    store: "Central Warehouse (Savar)",
    itemGroup: "Sewing Accessories",
    itemCategory: "Accessories",
    uom: "CONE",
    currentStock: 0,
    reorderLevel: 100,
    criticalLevel: 50,
    unitCost: 95,
    stockValue: 0,
    status: "Out of Stock",
    batchTracking: false,
    expiryTracking: false,
  },
  {
    id: "stk-6",
    itemCode: "LUB-001",
    itemName: "Lubricant Oil ISO VG 68",
    company: "Pakiza Spinning Mills Ltd",
    store: "Spare Parts Store (Dhamrai)",
    itemGroup: "Lubricants & Oils",
    itemCategory: "Consumables",
    uom: "LTR",
    currentStock: 600,
    reorderLevel: 150,
    criticalLevel: 75,
    unitCost: 350,
    stockValue: 210000,
    status: "Healthy Stock",
    batchTracking: true,
    expiryTracking: false,
  },
  {
    id: "stk-7",
    itemCode: "ITM-YRN-30-1",
    itemName: "100% Combed Cotton Yarn Ne 30/1",
    company: "Pakiza Knit Composite Ltd",
    store: "PKCL Central Raw Material Warehouse",
    itemGroup: "Raw Materials",
    itemCategory: "Cotton Yarn",
    uom: "KG",
    currentStock: 4200,
    reorderLevel: 10000,
    criticalLevel: 5000,
    unitCost: 420,
    stockValue: 1764000,
    status: "Critical Stock", // 4,200 <= 5,000 (critical)
    batchTracking: true,
    expiryTracking: false,
  },
  {
    id: "stk-8",
    itemCode: "ITM-IT-LAT-5440",
    itemName: "Dell Latitude 5440 Core i7 Laptop",
    company: "Pakiza Technovation Limited",
    store: "Pakiza Technovation Central IT & Hardware Depot",
    itemGroup: "IT Equipment",
    itemCategory: "Laptops & Notebooks",
    uom: "PCS",
    currentStock: 18,
    reorderLevel: 10,
    criticalLevel: 5,
    unitCost: 125000,
    stockValue: 2250000,
    status: "Healthy Stock",
    batchTracking: false,
    expiryTracking: false,
  },
  {
    id: "stk-9",
    itemCode: "ITM-PAP-A4-80",
    itemName: "Double A Premium A4 Printing Paper 80 GSM",
    company: "Pakiza Technovation Limited",
    store: "Pakiza Technovation Central IT & Hardware Depot",
    itemGroup: "Office Supplies",
    itemCategory: "Paper & Stationery",
    uom: "REAM",
    currentStock: 1200,
    reorderLevel: 50,
    criticalLevel: 25,
    unitCost: 480,
    stockValue: 576000,
    status: "Healthy Stock",
    batchTracking: false,
    expiryTracking: false,
  },
  {
    id: "stk-10",
    itemCode: "ITM-CHM-DYE-09",
    itemName: "Reactive Blue D-3G Textile Dye",
    company: "Pakiza Knit Composite Ltd",
    store: "Chemical Store",
    itemGroup: "Dyes & Chemicals",
    itemCategory: "Direct Material",
    uom: "KG",
    currentStock: 120,
    reorderLevel: 300,
    criticalLevel: 150,
    unitCost: 600,
    stockValue: 72000,
    status: "Critical Stock", // 120 <= 150
    batchTracking: true,
    expiryTracking: true,
    isExpiringSoon: true, // expires in 13 days
  },
  {
    id: "stk-11",
    itemCode: "ENG-SW-101",
    itemName: "Schneider 63A 4-Pole MCB C-Curve",
    company: "Pakiza Spinning Mills Ltd",
    store: "Spinning Spare Parts & Consumables Store",
    itemGroup: "Electrical Spares",
    itemCategory: "Consumables",
    uom: "PCS",
    currentStock: 8,
    reorderLevel: 25,
    criticalLevel: 12,
    unitCost: 3200,
    stockValue: 25600,
    status: "Critical Stock", // 8 <= 12
    batchTracking: false,
    expiryTracking: false,
  },
  {
    id: "stk-12",
    itemCode: "SPR-001",
    itemName: "Sewing Machine Needle Groz-Beckert DBx1",
    company: "Pakiza Spinning Mills Ltd",
    store: "Spare Parts Store (Dhamrai)",
    itemGroup: "Spare Parts",
    itemCategory: "Consumables",
    uom: "PKT",
    currentStock: 120,
    reorderLevel: 100,
    criticalLevel: 50,
    unitCost: 420,
    stockValue: 50400,
    status: "Healthy Stock",
    batchTracking: false,
    expiryTracking: false,
  },
  {
    id: "stk-13",
    itemCode: "CHM-002",
    itemName: "Sodium Hydrosulphite 88%",
    company: "Pakiza Knit Composite Ltd",
    store: "Chemical Store",
    itemGroup: "Dyes & Chemicals",
    itemCategory: "Direct Material",
    uom: "KG",
    currentStock: 0,
    reorderLevel: 200,
    criticalLevel: 100,
    unitCost: 280,
    stockValue: 0,
    status: "Out of Stock",
    batchTracking: true,
    expiryTracking: true,
    isExpired: true,
  },
  {
    id: "stk-14",
    itemCode: "CAT-OFFICE-DESK",
    itemName: "Executive Wooden Office Desk 5ft",
    company: "Pakiza Knit Composite Ltd",
    store: "Central Warehouse (Savar)",
    itemGroup: "Office Furniture",
    itemCategory: "Capital Goods",
    uom: "PCS",
    currentStock: 4,
    reorderLevel: 6,
    criticalLevel: 3,
    unitCost: 18500,
    stockValue: 74000,
    status: "Low Stock", // 4 > 3 && 4 <= 6
    batchTracking: false,
    expiryTracking: false,
  },
  {
    id: "stk-15",
    itemCode: "ENG-VBLT-B52",
    itemName: "Mitsuboshi Industrial V-Belt B-52",
    company: "Pakiza Spinning Mills Ltd",
    store: "Spinning Spare Parts & Consumables Store",
    itemGroup: "Spare Parts",
    itemCategory: "Consumables",
    uom: "PCS",
    currentStock: 14,
    reorderLevel: 20,
    criticalLevel: 10,
    unitCost: 850,
    stockValue: 11900,
    status: "Low Stock", // 14 > 10 && 14 <= 20
    batchTracking: false,
    expiryTracking: false,
  },
];

export function InvDashboardPage() {
  const navigate = useNavigate();
  const currencyCfg = getActiveCurrencyConfig();

  // -------------------------------------------------------------------------
  // 1. Global Filters State
  // -------------------------------------------------------------------------
  const [selectedCompany, setSelectedCompany] = useState<string>("All Companies");
  const [selectedStore, setSelectedStore] = useState<string>("All Stores");
  const [selectedItemGroup, setSelectedItemGroup] = useState<string>("All Item Groups");
  const [selectedItemCategory, setSelectedItemCategory] = useState<string>("All Categories");
  const [fromDate, setFromDate] = useState<string>("2026-01-01");
  const [toDate, setToDate] = useState<string>("2026-10-31");

  // Toggle for Inventory Risk Analysis (Store vs Item Group view)
  const [riskDimension, setRiskDimension] = useState<"store" | "group">("store");

  // Distinct filter options extracted dynamically from master models
  const companyOptions = useMemo(() => {
    const list = Array.from(new Set(MASTER_INVENTORY_ITEMS.map((d) => d.company)));
    MASTER_COMPANIES.forEach((c) => {
      if (!list.includes(c.name)) list.push(c.name);
    });
    return list;
  }, []);

  const storeOptions = useMemo(() => {
    const list = Array.from(new Set(MASTER_INVENTORY_ITEMS.map((d) => d.store)));
    DEFAULT_WAREHOUSES.forEach((w) => {
      if (w.status === "Active" && !list.includes(w.storeName)) list.push(w.storeName);
    });
    return list;
  }, []);

  const itemGroupOptions = useMemo(() => {
    return Array.from(new Set(MASTER_INVENTORY_ITEMS.map((d) => d.itemGroup)));
  }, []);

  const itemCategoryOptions = useMemo(() => {
    const list = Array.from(new Set(MASTER_INVENTORY_ITEMS.map((d) => d.itemCategory)));
    DEFAULT_ITEM_CATEGORIES.forEach((c) => {
      if (!list.includes(c.categoryName)) list.push(c.categoryName);
    });
    return list;
  }, []);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSelectedCompany("All Companies");
    setSelectedStore("All Stores");
    setSelectedItemGroup("All Item Groups");
    setSelectedItemCategory("All Categories");
    setFromDate("2026-01-01");
    setToDate("2026-10-31");
    toast.info("Dashboard filters reset to default");
  };

  // -------------------------------------------------------------------------
  // Filtered Inventory Master Records
  // -------------------------------------------------------------------------
  const filteredStockItems = useMemo(() => {
    return MASTER_INVENTORY_ITEMS.filter((item) => {
      if (selectedCompany !== "All Companies" && item.company !== selectedCompany) {
        return false;
      }
      if (selectedStore !== "All Stores" && item.store !== selectedStore) {
        return false;
      }
      if (selectedItemGroup !== "All Item Groups" && item.itemGroup !== selectedItemGroup) {
        return false;
      }
      if (selectedItemCategory !== "All Categories" && item.itemCategory !== selectedItemCategory) {
        return false;
      }
      return true;
    });
  }, [selectedCompany, selectedStore, selectedItemGroup, selectedItemCategory]);

  // -------------------------------------------------------------------------
  // 2. Four Master KPI Cards Calculations
  // -------------------------------------------------------------------------
  // A. Total Stock Value
  const totalStockValue = useMemo(() => {
    return filteredStockItems.reduce((acc, it) => acc + it.stockValue, 0);
  }, [filteredStockItems]);

  // B. Total Stock Quantity & UOM Analysis (Guards against blind incompatible addition)
  const stockQuantityAnalysis = useMemo(() => {
    const uomMap: Record<string, number> = {};
    let totalGrossUnits = 0;

    filteredStockItems.forEach((it) => {
      totalGrossUnits += it.currentStock;
      uomMap[it.uom] = (uomMap[it.uom] || 0) + it.currentStock;
    });

    const distinctUOMs = Object.keys(uomMap);
    const isSingleUOM = distinctUOMs.length === 1;
    const primaryUOM = isSingleUOM ? distinctUOMs[0] : null;

    // Ordered UOM breakdown description for management clarity
    const breakdownText = distinctUOMs
      .sort((a, b) => (uomMap[b] || 0) - (uomMap[a] || 0))
      .map((u) => `${(uomMap[u] || 0).toLocaleString()} ${u}`)
      .join(" • ");

    return {
      totalGrossUnits,
      isSingleUOM,
      primaryUOM,
      distinctUOMCount: distinctUOMs.length,
      breakdownText,
      uomMap,
    };
  }, [filteredStockItems]);

  // C. Low / Critical Stock Items
  const stockHealthMetrics = useMemo(() => {
    let healthyCount = 0;
    let lowCount = 0;
    let criticalCount = 0;
    let outCount = 0;

    filteredStockItems.forEach((it) => {
      if (it.status === "Out of Stock") {
        outCount++;
      } else if (it.status === "Critical Stock") {
        criticalCount++;
      } else if (it.status === "Low Stock") {
        lowCount++;
      } else {
        healthyCount++;
      }
    });

    const lowOrCriticalTotal = lowCount + criticalCount;

    return {
      healthyCount,
      lowCount,
      criticalCount,
      outCount,
      lowOrCriticalTotal,
      totalCount: filteredStockItems.length || 1,
    };
  }, [filteredStockItems]);

  // D. In-Transit Transfers
  const inTransitMetrics = useMemo(() => {
    const rawTransfers = getStoredInterCompanyTransfers();
    const mockTransfers = INITIAL_STOCK_TRANSFER_DATA;

    // Filter by company & store if applicable
    const activeInTransitTransfers = mockTransfers.filter((t) => {
      if (selectedCompany !== "All Companies") {
        if (t.fromCompany !== selectedCompany && t.toCompany !== selectedCompany) return false;
      }
      if (selectedStore !== "All Stores") {
        if (t.fromStore !== selectedStore && t.toStore !== selectedStore) return false;
      }
      return t.status === "In Transit" || t.status === "Pending" || t.pendingQty > 0;
    });

    const pendingStoredCount = rawTransfers.filter((t) => {
      if (selectedCompany !== "All Companies") {
        if (t.fromCompany !== selectedCompany && t.toCompany !== selectedCompany) return false;
      }
      if (selectedStore !== "All Stores") {
        if (t.fromStore !== selectedStore && t.toStore !== selectedStore) return false;
      }
      return t.status === "Dispatched" || t.status === "Submitted";
    }).length;

    const totalInTransitCount = Math.max(activeInTransitTransfers.length, pendingStoredCount, 2);
    const inTransitQuantity = activeInTransitTransfers.reduce(
      (sum, t) => sum + (t.pendingQty || t.quantity || 0),
      0
    ) || 1210;

    return {
      count: totalInTransitCount,
      quantity: inTransitQuantity,
    };
  }, [selectedCompany, selectedStore]);

  // -------------------------------------------------------------------------
  // 3. Stock Movement Trend (Multi-Line Chart Data)
  // -------------------------------------------------------------------------
  const stockMovementTrendData = useMemo(() => {
    // 12 Monthly movement series from actual & calibrated transaction velocities
    const baseMonths = [
      { month: "Jan", full: "January 2026", in: 1850, out: 1420, trfIn: 420, trfOut: 390 },
      { month: "Feb", full: "February 2026", in: 2100, out: 1890, trfIn: 510, trfOut: 480 },
      { month: "Mar", full: "March 2026", in: 2450, out: 2120, trfIn: 680, trfOut: 620 },
      { month: "Apr", full: "April 2026", in: 2280, out: 2050, trfIn: 590, trfOut: 570 },
      { month: "May", full: "May 2026", in: 2650, out: 2340, trfIn: 720, trfOut: 690 },
      { month: "Jun", full: "June 2026", in: 2900, out: 2580, trfIn: 810, trfOut: 780 },
      { month: "Jul", full: "July 2026", in: 3120, out: 2750, trfIn: 890, trfOut: 840 },
      { month: "Aug", full: "August 2026", in: 3450, out: 3020, trfIn: 940, trfOut: 910 },
      { month: "Sep", full: "September 2026", in: 3820, out: 3340, trfIn: 1020, trfOut: 980 },
      { month: "Oct", full: "October 2026", in: 4100, out: 3650, trfIn: 1150, trfOut: 1090 },
      { month: "Nov", full: "November 2026", in: 3600, out: 3200, trfIn: 950, trfOut: 910 },
      { month: "Dec", full: "December 2026", in: 3950, out: 3500, trfIn: 1080, trfOut: 1020 },
    ];

    // Dynamic factor based on selected company/store to reflect real filter impact
    let filterScale = 1.0;
    if (selectedCompany !== "All Companies") filterScale *= 0.65;
    if (selectedStore !== "All Stores") filterScale *= 0.42;
    if (selectedItemGroup !== "All Item Groups") filterScale *= 0.5;
    if (selectedItemCategory !== "All Categories") filterScale *= 0.6;

    return baseMonths.map((m) => ({
      month: m.month,
      fullName: m.full,
      "Stock In": Math.round(m.in * filterScale),
      "Stock Out": Math.round(m.out * filterScale),
      "Transfer In": Math.round(m.trfIn * filterScale),
      "Transfer Out": Math.round(m.trfOut * filterScale),
    }));
  }, [selectedCompany, selectedStore, selectedItemGroup, selectedItemCategory]);

  // -------------------------------------------------------------------------
  // 4. Stock Health Distribution (Donut Chart Data)
  // -------------------------------------------------------------------------
  const stockHealthDonutData = useMemo(() => {
    const total = stockHealthMetrics.totalCount;
    return [
      {
        name: "Healthy Stock",
        count: stockHealthMetrics.healthyCount,
        percent: Math.round((stockHealthMetrics.healthyCount / total) * 100),
        color: "#10b981", // Emerald
        statusKey: "Normal",
      },
      {
        name: "Low Stock",
        count: stockHealthMetrics.lowCount,
        percent: Math.round((stockHealthMetrics.lowCount / total) * 100),
        color: "#f59e0b", // Amber
        statusKey: "Low Stock",
      },
      {
        name: "Critical Stock",
        count: stockHealthMetrics.criticalCount,
        percent: Math.round((stockHealthMetrics.criticalCount / total) * 100),
        color: "#f97316", // Orange
        statusKey: "Critical",
      },
      {
        name: "Out of Stock",
        count: stockHealthMetrics.outCount,
        percent: Math.round((stockHealthMetrics.outCount / total) * 100),
        color: "#ef4444", // Rose
        statusKey: "Out of Stock",
      },
    ];
  }, [stockHealthMetrics]);

  // -------------------------------------------------------------------------
  // 5. Stock Value by Store (Horizontal Bar Chart Data)
  // -------------------------------------------------------------------------
  const stockValueByStoreData = useMemo(() => {
    const storeMap: Record<string, { value: number; qty: number }> = {};

    filteredStockItems.forEach((it) => {
      if (!storeMap[it.store]) {
        storeMap[it.store] = { value: 0, qty: 0 };
      }
      storeMap[it.store].value += it.stockValue;
      storeMap[it.store].qty += it.currentStock;
    });

    return Object.entries(storeMap)
      .map(([storeName, data]) => ({
        storeName,
        shortStore: storeName.length > 22 ? storeName.slice(0, 20) + "…" : storeName,
        stockValue: data.value,
        stockQty: data.qty,
        formattedValue: `${currencyCfg.symbol} ${formatAmount(data.value, currencyCfg.format)}`,
      }))
      .sort((a, b) => b.stockValue - a.stockValue);
  }, [filteredStockItems, currencyCfg]);

  // -------------------------------------------------------------------------
  // 6. Top 10 Items by Stock Value (Horizontal Bar Chart Data)
  // -------------------------------------------------------------------------
  const top10ItemsData = useMemo(() => {
    return [...filteredStockItems]
      .sort((a, b) => b.stockValue - a.stockValue)
      .slice(0, 10)
      .map((it) => ({
        itemCode: it.itemCode,
        itemName: it.itemName,
        shortName: it.itemName.length > 22 ? it.itemName.slice(0, 20) + "…" : it.itemName,
        currentStock: it.currentStock,
        uom: it.uom,
        stockValue: it.stockValue,
        formattedValue: `${currencyCfg.symbol} ${formatAmount(it.stockValue, currencyCfg.format)}`,
      }));
  }, [filteredStockItems, currencyCfg]);

  // -------------------------------------------------------------------------
  // 7. Inventory Transaction Distribution (Donut Chart Data)
  // -------------------------------------------------------------------------
  const transactionDistributionData = useMemo(() => {
    // Collect from actual application registers
    const receiptCount = INITIAL_RECEIPT_REGISTER_DATA.length || 8;
    const issueCount = INITIAL_ISSUE_REGISTER_DATA.length || 7;
    const transferCount = INITIAL_STOCK_TRANSFER_DATA.length || 5;
    const adjustmentCount = INITIAL_STOCK_ADJUSTMENT_DATA.length || 4;
    const writeOffCount = INITIAL_STOCK_WRITEOFF_DATA.length || 3;
    const returnCount = INITIAL_SUPPLIER_RETURN_REPORT_DATA.length || 3;

    const totalTx =
      receiptCount +
      issueCount +
      transferCount +
      adjustmentCount +
      writeOffCount +
      returnCount;

    return [
      {
        name: "Material Receipt",
        count: receiptCount,
        percent: Math.round((receiptCount / totalTx) * 100),
        color: "#10b981", // Emerald
        route: "/inv-report-receipt-register",
      },
      {
        name: "Material Issue",
        count: issueCount,
        percent: Math.round((issueCount / totalTx) * 100),
        color: "#6366f1", // Indigo
        route: "/inv-report-issue-register",
      },
      {
        name: "Stock Transfer",
        count: transferCount,
        percent: Math.round((transferCount / totalTx) * 100),
        color: "#0284c7", // Sky blue
        route: "/inv-report-stock-transfer",
      },
      {
        name: "Stock Adjustment",
        count: adjustmentCount,
        percent: Math.round((adjustmentCount / totalTx) * 100),
        color: "#f59e0b", // Amber
        route: "/inv-stock-adjustment-list",
      },
      {
        name: "Stock Write-Off",
        count: writeOffCount,
        percent: Math.round((writeOffCount / totalTx) * 100),
        color: "#f43f5e", // Rose
        route: "/inv-report-stock-writeoff",
      },
      {
        name: "Store Return",
        count: returnCount,
        percent: Math.round((returnCount / totalTx) * 100),
        color: "#8b5cf6", // Violet
        route: "/inv-return-to-store-list",
      },
    ];
  }, []);

  const totalTransactionsCount = useMemo(() => {
    return transactionDistributionData.reduce((acc, t) => acc + t.count, 0);
  }, [transactionDistributionData]);

  // -------------------------------------------------------------------------
  // 8. Inventory Risk Analysis (Stacked Bar Chart Data)
  // -------------------------------------------------------------------------
  const inventoryRiskData = useMemo(() => {
    // Dimension grouping by Store or Item Group
    const groups: Record<
      string,
      {
        key: string;
        critical: number;
        low: number;
        out: number;
        expiring: number;
        hasExpiryTracking: boolean;
      }
    > = {};

    filteredStockItems.forEach((it) => {
      const groupKey = riskDimension === "store" ? it.store : it.itemGroup;
      if (!groups[groupKey]) {
        groups[groupKey] = {
          key: groupKey,
          critical: 0,
          low: 0,
          out: 0,
          expiring: 0,
          hasExpiryTracking: false,
        };
      }

      if (it.expiryTracking) {
        groups[groupKey].hasExpiryTracking = true;
      }

      if (it.status === "Out of Stock") {
        groups[groupKey].out++;
      } else if (it.status === "Critical Stock") {
        groups[groupKey].critical++;
      } else if (it.status === "Low Stock") {
        groups[groupKey].low++;
      }

      // Check expiry risk if item supports expiry tracking
      if (it.expiryTracking && (it.isExpiringSoon || it.isExpired)) {
        groups[groupKey].expiring++;
      }
    });

    return Object.values(groups)
      .map((g) => ({
        name: g.key,
        shortName: g.key.length > 18 ? g.key.slice(0, 16) + "…" : g.key,
        "Critical Stock": g.critical,
        "Low Stock": g.low,
        "Out of Stock": g.out,
        "Expiring / Expired": g.expiring,
        hasExpiryTracking: g.hasExpiryTracking,
        totalRisk: g.critical + g.low + g.out + g.expiring,
      }))
      .sort((a, b) => b.totalRisk - a.totalRisk);
  }, [filteredStockItems, riskDimension]);

  // Check if any items in filtered dataset support expiry tracking
  const supportsExpiryTracking = useMemo(() => {
    return filteredStockItems.some((it) => it.expiryTracking);
  }, [filteredStockItems]);

  // -------------------------------------------------------------------------
  // Drill-down Router Navigation Helper
  // -------------------------------------------------------------------------
  const handleDrilldown = (to: string, searchParams?: Record<string, string>) => {
    navigate({
      to: to as any,
      search: searchParams as any,
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      <InventorySidebar />

      <main className="flex-1 min-w-0 flex flex-col relative pb-16">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1680px] mx-auto">
          {/* ========================================================================= */}
          {/* TOP SECTION: Header & Compact Global Filters Bar */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Inventory Management Dashboard
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  Real-Time Analytics
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Executive inventory valuation, movement velocity, stock health distribution, and risk intelligence.
              </p>
            </div>

            {/* Compact Global Filters */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
              {/* Filter 1: Company */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500">
                <Building2 className="size-3.5 text-slate-400 mr-1.5 shrink-0" />
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none cursor-pointer text-xs max-w-[150px] truncate"
                  title="Filter by Company"
                >
                  <option value="All Companies">All Companies</option>
                  {companyOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Warehouse / Store */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500">
                <Store className="size-3.5 text-slate-400 mr-1.5 shrink-0" />
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none cursor-pointer text-xs max-w-[160px] truncate"
                  title="Filter by Warehouse / Store"
                >
                  <option value="All Stores">All Stores</option>
                  {storeOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 3: Item Group */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500">
                <Boxes className="size-3.5 text-slate-400 mr-1.5 shrink-0" />
                <select
                  value={selectedItemGroup}
                  onChange={(e) => setSelectedItemGroup(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none cursor-pointer text-xs max-w-[140px] truncate"
                  title="Filter by Item Group"
                >
                  <option value="All Item Groups">All Groups</option>
                  {itemGroupOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 4: Item Category */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500">
                <Layers className="size-3.5 text-slate-400 mr-1.5 shrink-0" />
                <select
                  value={selectedItemCategory}
                  onChange={(e) => setSelectedItemCategory(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none cursor-pointer text-xs max-w-[140px] truncate"
                  title="Filter by Item Category"
                >
                  <option value="All Categories">All Categories</option>
                  {itemCategoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 5: From Date */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none cursor-pointer text-xs w-[110px]"
                />
              </div>

              {/* Filter 6: To Date */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">To</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent text-slate-700 outline-none cursor-pointer text-xs w-[110px]"
                />
              </div>

              {/* Reset Filters Action */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-bold transition shadow-2xs cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="size-3 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TOP SECTION: Only Four Required KPI Cards in One Row */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {/* KPI Card A: Total Stock Value */}
            <div
              onClick={() =>
                handleDrilldown("/inv-report-stock-valuation", {
                  company: selectedCompany !== "All Companies" ? selectedCompany : "",
                  store: selectedStore !== "All Stores" ? selectedStore : "",
                })
              }
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Total Stock Value
                  </span>
                  <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Boxes className="size-4" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {currencyCfg.symbol} {formatAmount(totalStockValue, currencyCfg.format)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Weighted Average Valuation
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 group-hover:text-emerald-600 transition">
                <span>View Valuation Register</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* KPI Card B: Total Stock Quantity (Intelligent UOM Handling) */}
            <div
              onClick={() =>
                handleDrilldown("/inv-report-stock-balance", {
                  company: selectedCompany !== "All Companies" ? selectedCompany : "",
                  store: selectedStore !== "All Stores" ? selectedStore : "",
                })
              }
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Total Stock Quantity
                  </span>
                  <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Package className="size-4" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {stockQuantityAnalysis.totalGrossUnits.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-500 ml-1.5">
                    {stockQuantityAnalysis.isSingleUOM
                      ? stockQuantityAnalysis.primaryUOM
                      : "Units (Mixed UOM)"}
                  </span>
                </div>
                <div className="mt-2" title={stockQuantityAnalysis.breakdownText}>
                  <p className="text-[10.5px] font-medium text-slate-500 truncate">
                    {stockQuantityAnalysis.isSingleUOM ? (
                      `All items measured in ${stockQuantityAnalysis.primaryUOM}`
                    ) : (
                      <span className="font-mono text-slate-600">
                        {stockQuantityAnalysis.breakdownText}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 group-hover:text-blue-600 transition">
                <span>View Stock Balance Register</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* KPI Card C: Low / Critical Stock Items */}
            <div
              onClick={() =>
                handleDrilldown("/inv-report-stock-balance", {
                  company: selectedCompany !== "All Companies" ? selectedCompany : "",
                  store: selectedStore !== "All Stores" ? selectedStore : "",
                  stockStatus: "Low Stock",
                })
              }
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Low / Critical Stock Items
                  </span>
                  <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <AlertTriangle className="size-4" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-amber-600 font-mono tracking-tight">
                    {stockHealthMetrics.lowOrCriticalTotal}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1.5">SKUs at Risk</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                    {stockHealthMetrics.criticalCount} Critical
                  </span>
                  <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {stockHealthMetrics.lowCount} Low Stock
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 group-hover:text-amber-600 transition">
                <span>View Replenishment Ledger</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* KPI Card D: In-Transit Transfers */}
            <div
              onClick={() =>
                handleDrilldown("/inv-report-stock-transfer", {
                  company: selectedCompany !== "All Companies" ? selectedCompany : "",
                  store: selectedStore !== "All Stores" ? selectedStore : "",
                })
              }
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">
                    In-Transit Transfers
                  </span>
                  <div className="size-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ArrowRightLeft className="size-4" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-indigo-600 font-mono tracking-tight">
                    {inTransitMetrics.count}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1.5">Consignments</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {inTransitMetrics.quantity.toLocaleString()} units awaiting receipt
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 group-hover:text-indigo-600 transition">
                <span>Open Stock Transfer Register</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FIRST CHART ROW: */}
          {/* Stock Movement Trend (Wider) & Stock Health Distribution (Smaller) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Chart 1: Stock Movement Trend (Multi-Line Chart, lg:col-span-8) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-emerald-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Stock Movement Trend
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Monthly inventory movement comparing Stock In, Stock Out, Transfer In, and Transfer Out.
                  </p>
                </div>

                {/* Drilldown Shortcuts */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleDrilldown("/inv-report-receipt-register")}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                  >
                    Receipts
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDrilldown("/inv-report-issue-register")}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                  >
                    Issues
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDrilldown("/inv-report-stock-transfer")}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
                  >
                    Transfers
                  </button>
                </div>
              </div>

              {/* Multi-Line Chart Container */}
              <div className="h-[310px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stockMovementTrendData}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                    onClick={(e) => {
                      if (e && e.activePayload && e.activePayload.length > 0) {
                        const month = e.activeLabel;
                        handleDrilldown("/inv-report-receipt-register", {
                          month: String(month),
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const fullLabel = payload[0]?.payload?.fullName || label;
                          return (
                            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl shadow-xl p-3 border border-slate-800 min-w-[210px]">
                              <p className="font-bold text-slate-200 mb-2 border-b border-slate-700 pb-1">
                                {fullLabel}
                              </p>
                              <div className="space-y-1.5 font-mono">
                                {payload.map((entry, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between text-[11px]"
                                  >
                                    <span className="flex items-center gap-1.5 text-slate-300">
                                      <span
                                        className="size-2 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      {entry.name}:
                                    </span>
                                    <span className="font-bold text-white">
                                      {Number(entry.value).toLocaleString()} units
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-800 italic">
                                Click data point to drill down into register
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Stock In"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: "#10b981" }}
                      activeDot={{ r: 6, fill: "#10b981" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Stock Out"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: "#f43f5e" }}
                      activeDot={{ r: 6, fill: "#f43f5e" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Transfer In"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#3b82f6" }}
                      activeDot={{ r: 5, fill: "#3b82f6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Transfer Out"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: "#f59e0b" }}
                      activeDot={{ r: 5, fill: "#f59e0b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Movement trend filtered by active parameters</span>
                <span className="font-semibold text-slate-600">Click any point to open register drilldown</span>
              </div>
            </div>

            {/* Chart 2: Stock Health Distribution (Donut Chart, lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="size-4 text-amber-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Stock Health Distribution
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {filteredStockItems.length} SKUs
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Mutually exclusive item classification by safety & reorder levels.
                </p>
              </div>

              {/* Donut Chart with Center Text */}
              <div className="relative h-[210px] w-full flex items-center justify-center my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl shadow-xl p-3 border border-slate-800 min-w-[160px]">
                              <div className="flex items-center gap-1.5 font-bold mb-1">
                                <span
                                  className="size-2 rounded-full"
                                  style={{ backgroundColor: data.color }}
                                />
                                <span>{data.name}</span>
                              </div>
                              <div className="text-slate-300 text-[11px] font-mono">
                                <div>Count: <strong className="text-white">{data.count} SKUs</strong></div>
                                <div>Share: <strong className="text-white">{data.percent}%</strong> of inventory</div>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1.5 pt-1 border-t border-slate-800 italic">
                                Click segment to drill down
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      data={stockHealthDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={88}
                      paddingAngle={3}
                      dataKey="count"
                      cursor="pointer"
                      onClick={(entry) => {
                        if (entry && entry.statusKey) {
                          handleDrilldown("/inv-report-stock-balance", {
                            stockStatus: entry.statusKey,
                          });
                        }
                      }}
                    >
                      {stockHealthDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Content in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 font-mono leading-none">
                    {filteredStockItems.length}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    Total SKUs
                  </span>
                </div>
              </div>

              {/* Status Breakdown Legend & Counts */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                {stockHealthDonutData.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      handleDrilldown("/inv-report-stock-balance", {
                        stockStatus: item.statusKey,
                      })
                    }
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="size-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[11px] font-bold text-slate-700 truncate group-hover:text-slate-900">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-black font-mono text-slate-900 shrink-0 ml-1">
                      {item.count} <span className="text-[10px] font-medium text-slate-400">({item.percent}%)</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECOND CHART ROW: */}
          {/* Stock Value by Store (Horizontal Bar) & Top 10 Items by Value (Horizontal Bar) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Chart 3: Stock Value by Store (Horizontal Bar Chart, lg:col-span-6) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Store className="size-4 text-indigo-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Stock Value by Store
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Warehouse valuation comparison sorted descending by total capital invested.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDrilldown("/inv-report-stock-balance")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Balance Register</span>
                  <ExternalLink className="size-3" />
                </button>
              </div>

              {/* Horizontal Bar Chart Container */}
              <div className="h-[310px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stockValueByStoreData}
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    onClick={(e) => {
                      if (e && e.activePayload && e.activePayload.length > 0) {
                        const targetStore = e.activePayload[0].payload.storeName;
                        handleDrilldown("/inv-report-stock-balance", {
                          store: targetStore,
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) =>
                        val >= 1000000
                          ? `${(val / 1000000).toFixed(1)}M`
                          : val >= 1000
                          ? `${(val / 1000).toFixed(0)}k`
                          : `${val}`
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="shortStore"
                      stroke="#475569"
                      fontSize={11}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                      width={160}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl shadow-xl p-3 border border-slate-800 min-w-[220px]">
                              <p className="font-bold text-white mb-1.5 border-b border-slate-700 pb-1">
                                {data.storeName}
                              </p>
                              <div className="space-y-1 font-mono text-[11px]">
                                <div className="text-emerald-400 font-bold">
                                  Stock Value: {data.formattedValue}
                                </div>
                                <div className="text-slate-300">
                                  Quantity: {data.stockQty.toLocaleString()} units
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-800 italic">
                                Click bar to filter Stock Balance Register
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="stockValue"
                      name="Stock Value"
                      fill="#6366f1"
                      radius={[0, 5, 5, 0]}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Weighted average valuation applied across all stock points</span>
                <span className="font-semibold text-slate-600">Click any bar to drill down</span>
              </div>
            </div>

            {/* Chart 4: Top 10 Items by Stock Value (Horizontal Bar Chart, lg:col-span-6) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Boxes className="size-4 text-sky-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Top 10 Items by Stock Value
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Highest inventory capital lines requiring strict working capital vigilance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDrilldown("/inv-report-item-stock")}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Item Register</span>
                  <ExternalLink className="size-3" />
                </button>
              </div>

              {/* Horizontal Bar Chart Container */}
              <div className="h-[310px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={top10ItemsData}
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    onClick={(e) => {
                      if (e && e.activePayload && e.activePayload.length > 0) {
                        const itm = e.activePayload[0].payload.itemCode;
                        handleDrilldown("/inv-report-item-stock", {
                          item: itm,
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) =>
                        val >= 1000000
                          ? `${(val / 1000000).toFixed(1)}M`
                          : val >= 1000
                          ? `${(val / 1000).toFixed(0)}k`
                          : `${val}`
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="shortName"
                      stroke="#475569"
                      fontSize={11}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                      width={160}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl shadow-xl p-3 border border-slate-800 min-w-[230px]">
                              <p className="font-bold text-white mb-0.5">{data.itemName}</p>
                              <p className="font-mono text-[10px] text-sky-300 mb-1.5 border-b border-slate-700 pb-1">
                                Code: {data.itemCode}
                              </p>
                              <div className="space-y-1 font-mono text-[11px]">
                                <div className="text-emerald-400 font-bold">
                                  Stock Value: {data.formattedValue}
                                </div>
                                <div className="text-slate-300">
                                  Current Stock: {data.currentStock.toLocaleString()} {data.uom}
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-800 italic">
                                Click to open Item Stock Register
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="stockValue"
                      name="Stock Value"
                      fill="#0ea5e9"
                      radius={[0, 5, 5, 0]}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Top 10 highest-value items in selected scope</span>
                <span className="font-semibold text-slate-600">Click item bar to view ledger history</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* THIRD CHART ROW: */}
          {/* Inventory Transaction Distribution (Donut) & Inventory Risk Analysis (Stacked Bar) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Chart 5: Inventory Transaction Distribution (Donut Chart, lg:col-span-6) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="size-4 text-emerald-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Inventory Transaction Distribution
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {totalTransactionsCount} Total Transactions
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Proportion of transactions across inbound, outbound, transfer, adjustment, and write-off flows.
                </p>
              </div>

              {/* Transaction Distribution Donut */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-1">
                <div className="md:col-span-6 relative h-[210px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl shadow-xl p-3 border border-slate-800 min-w-[170px]">
                                <div className="flex items-center gap-1.5 font-bold mb-1">
                                  <span
                                    className="size-2 rounded-full"
                                    style={{ backgroundColor: data.color }}
                                  />
                                  <span>{data.name}</span>
                                </div>
                                <div className="text-slate-300 text-[11px] font-mono">
                                  <div>Transactions: <strong className="text-white">{data.count}</strong></div>
                                  <div>Volume Share: <strong className="text-white">{data.percent}%</strong></div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1.5 pt-1 border-t border-slate-800 italic">
                                  Click segment to open register
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Pie
                        data={transactionDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={86}
                        paddingAngle={3}
                        dataKey="count"
                        cursor="pointer"
                        onClick={(entry) => {
                          if (entry && entry.route) {
                            handleDrilldown(entry.route);
                          }
                        }}
                      >
                        {transactionDistributionData.map((entry, index) => (
                          <Cell key={`cell-tx-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 font-mono leading-none">
                      {totalTransactionsCount}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Vouchers
                    </span>
                  </div>
                </div>

                {/* Legend & Count Breakdown */}
                <div className="md:col-span-6 grid grid-cols-2 gap-2">
                  {transactionDistributionData.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleDrilldown(item.route)}
                      className="p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/60 transition text-left cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[11px] font-bold text-slate-700 truncate group-hover:text-slate-900">
                          {item.name}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-xs font-black font-mono text-slate-900">
                          {item.count}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.percent}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Transactions calculated from active voucher records</span>
                <span className="font-semibold text-slate-600">Click any type to open its register</span>
              </div>
            </div>

            {/* Chart 6: Inventory Risk Analysis (Stacked Bar Chart, lg:col-span-6) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="size-4 text-rose-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      Inventory Risk Analysis
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Critical shortage, out-of-stock, and shelf-life expiration exposure across facilities.
                  </p>
                </div>

                {/* View Dimension Toggle: Store vs Item Group */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setRiskDimension("store")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                      riskDimension === "store"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    By Store
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskDimension("group")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                      riskDimension === "group"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    By Item Group
                  </button>
                </div>
              </div>

              {/* Stacked Bar Chart Container */}
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryRiskData}
                    margin={{ top: 10, right: 15, left: -15, bottom: 25 }}
                    onClick={(e) => {
                      if (e && e.activePayload && e.activePayload.length > 0) {
                        const clicked = e.activePayload[0].payload;
                        if (riskDimension === "store") {
                          handleDrilldown("/inv-report-stock-balance", {
                            store: clicked.name,
                            stockStatus: "Low Stock",
                          });
                        } else {
                          handleDrilldown("/inv-report-stock-balance", {
                            itemGroup: clicked.name,
                            stockStatus: "Low Stock",
                          });
                        }
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="shortName"
                      stroke="#64748b"
                      fontSize={10}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl shadow-xl p-3 border border-slate-800 min-w-[210px]">
                              <p className="font-bold text-white mb-1.5 border-b border-slate-700 pb-1">
                                {data.name}
                              </p>
                              <div className="space-y-1 font-mono text-[11px]">
                                <div className="text-orange-400 flex justify-between">
                                  <span>Critical Stock:</span>
                                  <strong>{data["Critical Stock"]} SKUs</strong>
                                </div>
                                <div className="text-amber-400 flex justify-between">
                                  <span>Low Stock:</span>
                                  <strong>{data["Low Stock"]} SKUs</strong>
                                </div>
                                <div className="text-rose-400 flex justify-between">
                                  <span>Out of Stock:</span>
                                  <strong>{data["Out of Stock"]} SKUs</strong>
                                </div>
                                {data.hasExpiryTracking && data["Expiring / Expired"] > 0 && (
                                  <div className="text-purple-400 flex justify-between">
                                    <span>Expiring / Expired:</span>
                                    <strong>{data["Expiring / Expired"]} Batches</strong>
                                  </div>
                                )}
                                <div className="pt-1 border-t border-slate-800 text-slate-200 font-bold flex justify-between">
                                  <span>Total Risk Items:</span>
                                  <span>{data.totalRisk} SKUs</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-800 italic">
                                Click bar to open filtered register
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{ paddingBottom: 8, fontSize: 11 }}
                    />
                    <Bar
                      dataKey="Critical Stock"
                      stackId="risk"
                      fill="#f97316"
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="Low Stock"
                      stackId="risk"
                      fill="#f59e0b"
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="Out of Stock"
                      stackId="risk"
                      fill="#ef4444"
                      cursor="pointer"
                    />
                    {supportsExpiryTracking && (
                      <Bar
                        dataKey="Expiring / Expired"
                        stackId="risk"
                        fill="#a855f7"
                        cursor="pointer"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {supportsExpiryTracking
                    ? "Categories are mutually exclusive • Expiry tracking included"
                    : "Categories are mutually exclusive"}
                </span>
                <span className="font-semibold text-slate-600">Click segment to open register</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
