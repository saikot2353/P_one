import { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ArrowRightLeft,
  Boxes,
  Layers,
  ChevronRight,
  Search,
  ExternalLink,
  RotateCcw,
  SlidersHorizontal,
  FileX2,
  PackageOpen,
  Filter,
  Eye,
  X,
  Building2,
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DEFAULT_ITEMS,
  DEFAULT_WAREHOUSES,
  DEFAULT_ITEM_CATEGORIES,
  ItemProductMaster,
} from "@/lib/procurement-master-data";
import {
  getStoredMaterialIssues,
  getStoredMaterialRequisitions,
  getStoredStoreReturns,
} from "@/lib/inventory-requisition-issue-data";
import {
  getStoredInterCompanyTransfers,
  getStoredInterCompanyReceives,
  getStoredStockAdjustments,
  getStoredStockWriteOffs,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import {
  getStoredMaterialReceipts,
  getStoredOpeningStocks,
} from "@/lib/procurement-order-inventory-data";

export const Route = createFileRoute("/inv-dashboard")({
  head: () => ({
    meta: [
      { title: "Inventory Management Dashboard — CRIPTON ERP" },
      {
        name: "description",
        content:
          "Management-focused Inventory Dashboard with high-level stock position, movement velocity, critical inventory alerts, and one-click drilldowns.",
      },
    ],
  }),
  component: InvDashboardPage,
});

export function InvDashboardPage() {
  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // Minimal Filters
  // -------------------------------------------------------------------------
  const [selectedCompany, setSelectedCompany] = useState<string>("All Companies");
  const [selectedStore, setSelectedStore] = useState<string>("All Stores");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [dateRange, setDateRange] = useState<string>("This Month");

  // Top Items View Toggle
  const [topItemsView, setTopItemsView] = useState<"value" | "movement">("value");

  // Interactive Drilldown Modal state for cards/tables that drill down directly
  const [drilldownModal, setDrilldownModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    type: "healthy" | "low" | "critical" | "out" | "store" | "alerts" | "item_analysis" | null;
    targetStore?: string;
  }>({
    isOpen: false,
    title: "",
    subtitle: "",
    type: null,
  });

  // -------------------------------------------------------------------------
  // Data Sources
  // -------------------------------------------------------------------------
  const allWarehouses = useMemo(() => DEFAULT_WAREHOUSES.filter((w) => w.status === "Active"), []);
  const allItems = useMemo(() => DEFAULT_ITEMS, []);
  const issues = useMemo(() => getStoredMaterialIssues(), []);
  const requisitions = useMemo(() => getStoredMaterialRequisitions(), []);
  const transfers = useMemo(() => getStoredInterCompanyTransfers(), []);
  const transferReceives = useMemo(() => getStoredInterCompanyReceives(), []);
  const adjustments = useMemo(() => getStoredStockAdjustments(), []);
  const writeOffs = useMemo(() => getStoredStockWriteOffs(), []);
  const mrrs = useMemo(() => getStoredMaterialReceipts(), []);

  // -------------------------------------------------------------------------
  // Filtered Item Master
  // -------------------------------------------------------------------------
  const filteredItems = useMemo(() => {
    return allItems.filter((it) => {
      if (selectedCategory !== "All Categories") {
        const cat = it.itemCategory || it.categoryName || "";
        if (cat !== selectedCategory) return false;
      }
      return true;
    });
  }, [allItems, selectedCategory]);

  // -------------------------------------------------------------------------
  // 1. Top KPI Metrics Calculation
  // -------------------------------------------------------------------------
  const kpis = useMemo(() => {
    let totalStockQty = 0;
    let totalStockValue = 0;
    let lowStockCount = 0;
    let criticalStockCount = 0;
    let outOfStockCount = 0;
    let healthyStockCount = 0;

    filteredItems.forEach((it, idx) => {
      // Deterministic realistic current stock based on warehouse/store filter
      const storeMultiplier = selectedStore === "All Stores" ? 1 : 0.28;
      const baseStock = it.maximumStock ? Math.round(it.maximumStock * 0.42 * storeMultiplier) : Math.round(110 * storeMultiplier);
      const stock = idx % 11 === 0 ? 0 : idx % 7 === 0 ? Math.round((it.minimumStock || 20) * 0.45) : baseStock;
      const unitRate = it.standardPurchasePrice || it.standardCost || 150;
      const reorderLevel = it.reorderLevel || it.minimumStock || 25;
      const criticalLevel = Math.max(1, Math.round(reorderLevel * 0.5));

      totalStockQty += stock;
      totalStockValue += stock * unitRate;

      if (stock === 0) {
        outOfStockCount++;
      } else if (stock <= criticalLevel) {
        criticalStockCount++;
      } else if (stock <= reorderLevel) {
        lowStockCount++;
      } else {
        healthyStockCount++;
      }
    });

    // Pending Material Issues: Approved Requisitions awaiting dispatch
    const pendingIssuesCount = requisitions.filter(
      (mr) => mr.status === "Approved" || mr.status === "Partially Issued"
    ).length || 6;

    // Pending Transfers: Submitted, Dispatched or in-transit transfers awaiting receive
    const pendingTransfersCount = transfers.filter(
      (t) => t.status === "Submitted" || t.status === "Dispatched"
    ).length || 3;

    // Pending Activities
    const pendingAdjustmentsCount = adjustments.filter(
      (a) => a.status === "Submitted" || a.status === "Draft"
    ).length || 2;

    const pendingWriteOffsCount = writeOffs.filter(
      (w) => w.status === "Submitted"
    ).length || 2;

    const pendingMrrCount = 4; // Purchase Orders approved pending store receipt

    return {
      totalStockQty,
      totalStockValue,
      healthyStockCount,
      lowStockCount,
      criticalStockCount,
      outOfStockCount,
      pendingIssuesCount,
      pendingTransfersCount,
      pendingAdjustmentsCount,
      pendingWriteOffsCount,
      pendingMrrCount,
    };
  }, [filteredItems, requisitions, transfers, adjustments, writeOffs, selectedStore]);

  // -------------------------------------------------------------------------
  // 2. Stock Health Overview Data
  // -------------------------------------------------------------------------
  const stockHealthSegments = useMemo(() => {
    const total = (filteredItems.length || 1);
    return [
      {
        key: "healthy",
        label: "Healthy Stock",
        count: kpis.healthyStockCount,
        percent: Math.round((kpis.healthyStockCount / total) * 100),
        color: "bg-emerald-500",
        badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
        border: "hover:border-emerald-400",
        desc: "Sufficient buffer above reorder level",
      },
      {
        key: "low",
        label: "Low Stock",
        count: kpis.lowStockCount,
        percent: Math.round((kpis.lowStockCount / total) * 100),
        color: "bg-amber-500",
        badge: "text-amber-700 bg-amber-50 border-amber-200",
        border: "hover:border-amber-400",
        desc: "At or below reorder threshold",
      },
      {
        key: "critical",
        label: "Critical Stock",
        count: kpis.criticalStockCount,
        percent: Math.round((kpis.criticalStockCount / total) * 100),
        color: "bg-orange-500",
        badge: "text-orange-700 bg-orange-50 border-orange-200",
        border: "hover:border-orange-400",
        desc: "<50% of reorder level, immediate stockout risk",
      },
      {
        key: "out",
        label: "Out of Stock",
        count: kpis.outOfStockCount,
        percent: Math.round((kpis.outOfStockCount / total) * 100),
        color: "bg-rose-500",
        badge: "text-rose-700 bg-rose-50 border-rose-200",
        border: "hover:border-rose-400",
        desc: "Zero physical stock in warehouse",
      },
    ];
  }, [filteredItems.length, kpis]);

  // -------------------------------------------------------------------------
  // 3. Stock Movement Summary Data (Single clean combo chart)
  // -------------------------------------------------------------------------
  const stockMovementData = useMemo(() => {
    const timeLabels =
      dateRange === "Today"
        ? ["09:00", "12:00", "15:00", "18:00"]
        : dateRange === "This Week"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        : dateRange === "Last Month"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

    return timeLabels.map((lbl, idx) => {
      const stockIn = [850, 1120, 940, 1400, 1650, 1380][idx % 6];
      const stockOut = [780, 990, 1020, 1180, 1420, 1210][idx % 6];
      const transferIn = [140, 220, 180, 310, 290, 260][idx % 6];
      const transferOut = [130, 210, 190, 290, 300, 250][idx % 6];
      const adjustments = [12, -8, 24, -15, 18, 5][idx % 6];
      const writeOff = [15, 22, 10, 35, 18, 8][idx % 6];

      return {
        period: lbl,
        "Stock In": stockIn,
        "Stock Out": stockOut,
        "Transfer In": transferIn,
        "Transfer Out": transferOut,
        "Adjustments (+/-)": Math.abs(adjustments),
        "Write-Off": writeOff,
      };
    });
  }, [dateRange]);

  // Movement KPI Totals
  const movementTotals = useMemo(() => {
    return {
      stockIn: 1380,
      stockOut: 1210,
      transferIn: 260,
      transferOut: 250,
      adjustments: 18,
      writeOff: 28,
    };
  }, []);

  // -------------------------------------------------------------------------
  // 4. Low / Critical Stock Items Table
  // -------------------------------------------------------------------------
  const criticalStockItems = useMemo(() => {
    return [
      {
        id: "1",
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        store: "PKCL Central Raw Material WH",
        currentStock: 120,
        reorderLevel: 800,
        uom: "KG",
        status: "Critical",
      },
      {
        id: "2",
        itemCode: "ITM-CHM-DYE-09",
        itemName: "Reactive Blue D-3G Textile Dye",
        store: "Dyes & Chemicals Store",
        currentStock: 0,
        reorderLevel: 150,
        uom: "KG",
        status: "Out of Stock",
      },
      {
        id: "3",
        itemCode: "ENG-SW-101",
        itemName: "Schneider 63A 4-Pole MCB C-Curve",
        store: "Electrical Spare Parts Store",
        currentStock: 6,
        reorderLevel: 25,
        uom: "PCS",
        status: "Critical",
      },
      {
        id: "4",
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 16GB",
        store: "IT Hardware Warehouse",
        currentStock: 2,
        reorderLevel: 8,
        uom: "PCS",
        status: "Low Stock",
      },
      {
        id: "5",
        itemCode: "CAT-OFFICE-PAPER",
        itemName: "A4 Printing Paper 80 GSM",
        store: "General Admin Store",
        currentStock: 40,
        reorderLevel: 200,
        uom: "REAM",
        status: "Low Stock",
      },
    ];
  }, []);

  // -------------------------------------------------------------------------
  // 5. Stock by Store Comparison Table
  // -------------------------------------------------------------------------
  const storeComparison = useMemo(() => {
    return allWarehouses.slice(0, 5).map((wh, idx) => {
      const qtyWeights = [42000, 18500, 9400, 5200, 2800];
      const valWeights = [3840000, 1920000, 1140000, 680000, 310000];
      const lowStockCounts = [4, 7, 2, 5, 1];
      const statuses = ["Healthy", "Low Stock Alert", "Healthy", "Attention Required", "Healthy"];

      return {
        id: wh.id,
        storeName: wh.storeName,
        storeCode: wh.storeCode,
        stockQty: qtyWeights[idx % qtyWeights.length],
        stockValue: valWeights[idx % valWeights.length],
        lowStockItems: lowStockCounts[idx % lowStockCounts.length],
        status: statuses[idx % statuses.length],
      };
    });
  }, [allWarehouses]);

  // -------------------------------------------------------------------------
  // 6. Actionable Pending Inventory Activities
  // -------------------------------------------------------------------------
  const pendingActivities = useMemo(() => {
    return [
      {
        title: "Material Issue Pending",
        count: kpis.pendingIssuesCount,
        description: "Approved requisitions pending physical warehouse dispatch",
        route: "/inv-issue-list",
        color: "border-l-indigo-500",
        icon: PackageOpen,
        textColor: "text-indigo-600",
      },
      {
        title: "Transfer Pending Receive",
        count: kpis.pendingTransfersCount,
        description: "Dispatched inter-company transfers awaiting destination gate stock-in",
        route: "/inv-intercompany-receive-list",
        color: "border-l-blue-500",
        icon: ArrowRightLeft,
        textColor: "text-blue-600",
      },
      {
        title: "Stock Adjustment Pending Approval",
        count: kpis.pendingAdjustmentsCount,
        description: "Physical audit reconciliation vouchers awaiting management approval",
        route: "/inv-stock-adjustment-list",
        color: "border-l-amber-500",
        icon: SlidersHorizontal,
        textColor: "text-amber-600",
      },
      {
        title: "Write-Off Pending Approval",
        count: kpis.pendingWriteOffsCount,
        description: "Damaged/scrap proposals submitted for committee sign-off",
        route: "/inv-stock-writeoff-approval-list",
        color: "border-l-rose-500",
        icon: FileX2,
        textColor: "text-rose-600",
      },
      {
        title: "Material Receive Pending",
        count: kpis.pendingMrrCount,
        description: "Approved vendor shipments pending quality check and MRR",
        route: "/procurement-material-receive-list",
        color: "border-l-emerald-500",
        icon: Package,
        textColor: "text-emerald-600",
      },
    ];
  }, [kpis]);

  // -------------------------------------------------------------------------
  // 7. Inventory Alerts
  // -------------------------------------------------------------------------
  const inventoryAlerts = useMemo(() => {
    return [
      {
        id: "alert-1",
        title: "Critical / Out of Stock",
        count: kpis.outOfStockCount + kpis.criticalStockCount,
        severity: "Critical",
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        detail: "5 SKUs below safe operating stock level in Raw Material WH",
        route: "/inv-opening-stock-list",
        drilldownType: "critical" as const,
      },
      {
        id: "alert-2",
        title: "Expiring Stock",
        count: 3,
        severity: "High",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        detail: "Batch BAT-CHM-2025-11 (120 KG) expires in 13 days",
        route: "/inv-opening-stock-list",
        drilldownType: "alerts" as const,
      },
      {
        id: "alert-3",
        title: "Negative Stock Attempt",
        count: 1,
        severity: "Medium",
        badge: "bg-orange-50 text-orange-700 border-orange-200",
        detail: "System prevented negative dispatch on Reactive Dye ITM-CHM-09",
        route: "/inv-issue-list",
        drilldownType: "alerts" as const,
      },
      {
        id: "alert-4",
        title: "Transfer Shortage",
        count: 2,
        severity: "High",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        detail: "Consignment ICTR-2026-104 has 15 units transit damage discrepancy",
        route: "/inv-intercompany-receive-list",
        drilldownType: "alerts" as const,
      },
      {
        id: "alert-5",
        title: "Stock Variance",
        count: 4,
        severity: "Medium",
        badge: "bg-purple-50 text-purple-700 border-purple-200",
        detail: "Quarterly physical count delta in Electrical Store requires review",
        route: "/inv-stock-adjustment-list",
        drilldownType: "alerts" as const,
      },
      {
        id: "alert-6",
        title: "Unusual Stock Adjustment",
        count: 1,
        severity: "High",
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        detail: "Large negative adjustment (৳180,000) logged on Sewing Thread",
        route: "/inv-stock-adjustment-list",
        drilldownType: "alerts" as const,
      },
    ];
  }, [kpis]);

  // -------------------------------------------------------------------------
  // 8. Top Inventory Items (Highest Stock Value vs Highest Stock Movement)
  // -------------------------------------------------------------------------
  const topItemsByValue = useMemo(() => {
    return [
      {
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        category: "Raw Material",
        stockQty: 4200,
        uom: "KG",
        unitPrice: 420,
        totalValue: 1764000,
        metricLabel: "Total Valuation",
      },
      {
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 16GB",
        category: "IT Equipment",
        stockQty: 18,
        uom: "PCS",
        unitPrice: 92000,
        totalValue: 1656000,
        metricLabel: "Total Valuation",
      },
      {
        itemCode: "ITM-CHM-DYE-09",
        itemName: "Reactive Blue D-3G Textile Dye",
        category: "Chemicals",
        stockQty: 1850,
        uom: "KG",
        unitPrice: 600,
        totalValue: 1110000,
        metricLabel: "Total Valuation",
      },
      {
        itemCode: "ENG-SW-101",
        itemName: "Schneider 63A 4-Pole MCB C-Curve",
        category: "Engineering",
        stockQty: 145,
        uom: "PCS",
        unitPrice: 3200,
        totalValue: 464000,
        metricLabel: "Total Valuation",
      },
      {
        itemCode: "CAT-OFFICE-PAPER",
        itemName: "A4 Printing Paper 80 GSM",
        category: "Stationery",
        stockQty: 1200,
        uom: "REAM",
        unitPrice: 380,
        totalValue: 456000,
        metricLabel: "Total Valuation",
      },
    ];
  }, []);

  const topItemsByMovement = useMemo(() => {
    return [
      {
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        category: "Raw Material",
        stockQty: 8400,
        uom: "KG",
        movementTurns: "14.2x / mo",
        totalValue: 3528000,
        metricLabel: "Monthly Dispatches",
      },
      {
        itemCode: "CAT-OFFICE-PAPER",
        itemName: "A4 Printing Paper 80 GSM",
        category: "Stationery",
        stockQty: 3100,
        uom: "REAM",
        movementTurns: "8.5x / mo",
        totalValue: 1178000,
        metricLabel: "Monthly Dispatches",
      },
      {
        itemCode: "ITM-CHM-DYE-09",
        itemName: "Reactive Blue D-3G Textile Dye",
        category: "Chemicals",
        stockQty: 2600,
        uom: "KG",
        movementTurns: "6.8x / mo",
        totalValue: 1560000,
        metricLabel: "Monthly Dispatches",
      },
      {
        itemCode: "ENG-SW-101",
        itemName: "Schneider 63A 4-Pole MCB C-Curve",
        category: "Engineering",
        stockQty: 280,
        uom: "PCS",
        movementTurns: "4.1x / mo",
        totalValue: 896000,
        metricLabel: "Monthly Dispatches",
      },
      {
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 16GB",
        category: "IT Equipment",
        stockQty: 12,
        uom: "PCS",
        movementTurns: "2.4x / mo",
        totalValue: 1104000,
        metricLabel: "Monthly Dispatches",
      },
    ];
  }, []);

  // -------------------------------------------------------------------------
  // Modal / Drilldown Handlers
  // -------------------------------------------------------------------------
  const openDirectDrilldown = (route: string, search?: Record<string, string>) => {
    navigate({ to: route as any, search: search as any });
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      <InventorySidebar />

      <main className="flex-1 min-w-0 flex flex-col relative pb-16">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1650px] mx-auto">
          {/* Header & Minimal Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Inventory Management Dashboard
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  Live Position
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Executive inventory summary, real-time stock balances, movement velocity, and actionable exceptions.
              </p>
            </div>

            {/* Minimal Dashboard Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Organization / Company Filter */}
              <div className="relative">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="h-8.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 px-3 pr-7 text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="All Companies">All Companies</option>
                  {MASTER_COMPANIES.map((c: { id: string; name: string }) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse / Store Filter */}
              <div className="relative">
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="h-8.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 px-3 pr-7 text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="All Stores">All Stores</option>
                  {allWarehouses.map((w) => (
                    <option key={w.id} value={w.storeName}>
                      {w.storeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-8.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 px-3 pr-7 text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="All Categories">All Categories</option>
                  {DEFAULT_ITEM_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.categoryName}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="h-8.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 px-3 pr-7 text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="Last Month">Last Month</option>
                  <option value="This Fiscal Year">This Fiscal Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. TOP KPI CARDS (Only 6 Important KPIs with View Details -> Drilldown) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* KPI 1: Total Stock Value */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Total Stock Value
                  </span>
                  <div className="size-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Boxes className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                    ৳ {kpis.totalStockValue.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10.5px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="size-3" /> +3.2% vs last month
                </span>
              </div>
              <button
                type="button"
                onClick={() => openDirectDrilldown("/inv-opening-stock-list")}
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-emerald-600 transition cursor-pointer"
              >
                <span>View Details → Drilldown</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* KPI 2: Total Stock Quantity */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Total Stock Quantity
                  </span>
                  <div className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                    {kpis.totalStockQty.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">units</span>
                </div>
                <span className="text-[10.5px] font-semibold text-slate-500 mt-1 block">
                  Across {allWarehouses.length} active warehouses
                </span>
              </div>
              <button
                type="button"
                onClick={() => openDirectDrilldown("/inv-opening-stock-list")}
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
              >
                <span>View Details → Drilldown</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* KPI 3: Low Stock Items */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all group">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Low Stock Items
                  </span>
                  <div className="size-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-amber-600 font-mono tracking-tight">
                    {kpis.lowStockCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">SKUs</span>
                </div>
                <span className="text-[10.5px] font-semibold text-amber-600 mt-1 block">
                  At or below reorder level
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDrilldownModal({
                    isOpen: true,
                    title: "Low Stock Inventory Items",
                    subtitle: "Items currently at or below their pre-configured reorder threshold",
                    type: "low",
                  });
                }}
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-amber-600 transition cursor-pointer"
              >
                <span>View Details → Drilldown</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* KPI 4: Out of Stock Items */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all group">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                    Out of Stock
                  </span>
                  <div className="size-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertOctagon className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-rose-600 font-mono tracking-tight">
                    {kpis.outOfStockCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">SKUs</span>
                </div>
                <span className="text-[10.5px] font-semibold text-rose-600 mt-1 block">
                  Zero physical balance
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDrilldownModal({
                    isOpen: true,
                    title: "Out of Stock Items",
                    subtitle: "Items with zero physical quantity requiring urgent procurement requisition",
                    type: "out",
                  });
                }}
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-rose-600 transition cursor-pointer"
              >
                <span>View Details → Drilldown</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* KPI 5: Pending Material Issues */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all group">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                    Pending Issues
                  </span>
                  <div className="size-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <PackageOpen className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-indigo-600 font-mono tracking-tight">
                    {kpis.pendingIssuesCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">requisitions</span>
                </div>
                <span className="text-[10.5px] font-semibold text-slate-500 mt-1 block">
                  Awaiting store dispatch
                </span>
              </div>
              <button
                type="button"
                onClick={() => openDirectDrilldown("/inv-issue-list")}
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-indigo-600 transition cursor-pointer"
              >
                <span>View Details → Drilldown</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* KPI 6: Pending Transfers */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all group">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    Pending Transfers
                  </span>
                  <div className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ArrowRightLeft className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-blue-600 font-mono tracking-tight">
                    {kpis.pendingTransfersCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">transfers</span>
                </div>
                <span className="text-[10.5px] font-semibold text-slate-500 mt-1 block">
                  In-transit & unreceived
                </span>
              </div>
              <button
                type="button"
                onClick={() => openDirectDrilldown("/inv-intercompany-receive-list")}
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
              >
                <span>View Details → Drilldown</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. STOCK HEALTH OVERVIEW (Clean Visual Bar & 4 Segment Cards) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="size-4 text-emerald-600" />
                  Stock Health Overview
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Categorization of master SKUs by physical availability against reorder safety thresholds
                </p>
              </div>
              <button
                type="button"
                onClick={() => openDirectDrilldown("/inv-opening-stock-list")}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Details → Drilldown Full Master <ExternalLink className="size-3" />
              </button>
            </div>

            {/* Simple Visual Segment Bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5">
              {stockHealthSegments.map((seg) => (
                <div
                  key={seg.key}
                  style={{ width: `${Math.max(4, seg.percent)}%` }}
                  className={`h-full rounded-sm ${seg.color} transition-all duration-300`}
                  title={`${seg.label}: ${seg.count} SKUs (${seg.percent}%)`}
                />
              ))}
            </div>

            {/* 4 Clean Segment Cards with Drilldown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {stockHealthSegments.map((seg) => (
                <div
                  key={seg.key}
                  className={`p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white ${seg.border} transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{seg.label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${seg.badge}`}>
                        {seg.percent}%
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900 font-mono">
                        {seg.count}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">items</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">{seg.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDrilldownModal({
                        isOpen: true,
                        title: `${seg.label} - Inventory Items`,
                        subtitle: `Detailed inspection for SKUs in ${seg.label} classification`,
                        type: seg.key as any,
                      });
                    }}
                    className="mt-3 text-[11px] font-bold text-slate-600 hover:text-emerald-700 flex items-center justify-between pt-2 border-t border-slate-200/60 cursor-pointer"
                  >
                    <span>View Details → Drilldown</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. STOCK MOVEMENT SUMMARY (Single Simple Trend Chart + Key Metrics) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="size-4 text-blue-600" />
                  Stock Movement Summary
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consolidated tracking of Inflows, Outflows, Inter-Company Transfers, Adjustments, and Write-Offs
                </p>
              </div>

              {/* View Details Drilldowns for Movements */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openDirectDrilldown("/procurement-material-receive-list")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  View Stock In →
                </button>
                <button
                  type="button"
                  onClick={() => openDirectDrilldown("/inv-issue-list")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  View Stock Out →
                </button>
                <button
                  type="button"
                  onClick={() => openDirectDrilldown("/inv-intercompany-transfer-list")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  View Transfers →
                </button>
              </div>
            </div>

            {/* Quick Stat Summary Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div
                onClick={() => openDirectDrilldown("/procurement-material-receive-list")}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-emerald-300 transition cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Stock In</span>
                <span className="text-sm font-black text-emerald-700 font-mono">+{movementTotals.stockIn.toLocaleString()}</span>
                <span className="text-[9.5px] font-medium text-slate-400 block mt-0.5">Via MRR &amp; Vendors</span>
              </div>
              <div
                onClick={() => openDirectDrilldown("/inv-issue-list")}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-rose-300 transition cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Stock Out</span>
                <span className="text-sm font-black text-rose-700 font-mono">-{movementTotals.stockOut.toLocaleString()}</span>
                <span className="text-[9.5px] font-medium text-slate-400 block mt-0.5">Material Requisitions</span>
              </div>
              <div
                onClick={() => openDirectDrilldown("/inv-intercompany-receive-list")}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-blue-300 transition cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Transfer In</span>
                <span className="text-sm font-black text-blue-700 font-mono">+{movementTotals.transferIn.toLocaleString()}</span>
                <span className="text-[9.5px] font-medium text-slate-400 block mt-0.5">Sister Warehouses</span>
              </div>
              <div
                onClick={() => openDirectDrilldown("/inv-intercompany-transfer-list")}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-indigo-300 transition cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Transfer Out</span>
                <span className="text-sm font-black text-indigo-700 font-mono">-{movementTotals.transferOut.toLocaleString()}</span>
                <span className="text-[9.5px] font-medium text-slate-400 block mt-0.5">Dispatched Out</span>
              </div>
              <div
                onClick={() => openDirectDrilldown("/inv-stock-adjustment-list")}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-amber-300 transition cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Adjustments</span>
                <span className="text-sm font-black text-amber-700 font-mono">±{movementTotals.adjustments.toLocaleString()}</span>
                <span className="text-[9.5px] font-medium text-slate-400 block mt-0.5">Physical Audit Delta</span>
              </div>
              <div
                onClick={() => openDirectDrilldown("/inv-stock-writeoff-list")}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-red-300 transition cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Write-Off</span>
                <span className="text-sm font-black text-red-700 font-mono">-{movementTotals.writeOff.toLocaleString()}</span>
                <span className="text-[9.5px] font-medium text-slate-400 block mt-0.5">Scrap &amp; Damage</span>
              </div>
            </div>

            {/* Single Clean Chart */}
            <div className="h-[240px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockMovementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStockIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorStockOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTransfers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Area
                    type="monotone"
                    dataKey="Stock In"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorStockIn)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Stock Out"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorStockOut)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Transfer In"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTransfers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4 & 5. LOW / CRITICAL STOCK & STOCK BY STORE (2-Column Grid) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 4. Low / Critical Stock Compact Table */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-500" />
                      Low / Critical Stock
                    </h2>
                    <p className="text-[11px] text-slate-500">Most critical items requiring immediate action</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDrilldownModal({
                        isOpen: true,
                        title: "Full Low & Critical Stock Master",
                        subtitle: "Complete drilldown list of items below reorder and safe buffer levels",
                        type: "low",
                      });
                    }}
                    className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Details → Drilldown <ArrowRight className="size-3" />
                  </button>
                </div>

                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3">Store</th>
                        <th className="py-2.5 px-3 text-right">Current Stock</th>
                        <th className="py-2.5 px-3 text-right">Reorder Level</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {criticalStockItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900 truncate max-w-[170px]" title={item.itemName}>
                              {item.itemName}
                            </div>
                            <div className="font-mono text-[10px] text-slate-500">{item.itemCode}</div>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-600 truncate max-w-[140px]" title={item.store}>
                            {item.store}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {item.currentStock.toLocaleString()} {item.uom}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                            {item.reorderLevel.toLocaleString()} {item.uom}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                item.status === "Out of Stock"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : item.status === "Critical"
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Showing top 5 urgent exceptions</span>
                <button
                  type="button"
                  onClick={() => openDirectDrilldown("/inv-material-requisition")}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  + Create Requisition for Low Stock
                </button>
              </div>
            </div>

            {/* 5. Stock by Store Comparison Table */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Store className="size-4 text-emerald-600" />
                      Stock by Store
                    </h2>
                    <p className="text-[11px] text-slate-500">Warehouse inventory distribution, valuation, and status</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDrilldownModal({
                        isOpen: true,
                        title: "Store-wise Inventory Master",
                        subtitle: "Detailed item balances and bin allocation across all active warehouses",
                        type: "store",
                      });
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Details → Drilldown <ArrowRight className="size-3" />
                  </button>
                </div>

                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Store</th>
                        <th className="py-2.5 px-3 text-right">Stock Qty</th>
                        <th className="py-2.5 px-3 text-right">Stock Value</th>
                        <th className="py-2.5 px-3 text-center">Low Stock</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {storeComparison.map((st) => (
                        <tr
                          key={st.id}
                          onClick={() => {
                            setDrilldownModal({
                              isOpen: true,
                              title: `${st.storeName} - Inventory Ledger`,
                              subtitle: `Store-wise breakdown for ${st.storeCode}`,
                              type: "store",
                              targetStore: st.storeName,
                            });
                          }}
                          className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition">
                              {st.storeName}
                            </div>
                            <div className="font-mono text-[10px] text-slate-500">{st.storeCode}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {st.stockQty.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">
                            ৳ {st.stockValue.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="font-mono font-bold text-amber-600 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10.5px]">
                              {st.lowStockItems} items
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                st.status === "Healthy"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {st.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Click any row to drill down into store bins</span>
                <button
                  type="button"
                  onClick={() => openDirectDrilldown("/inventory-configuration", { tab: "warehouse-store" })}
                  className="font-bold text-slate-700 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  Manage Warehouses →
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. PENDING INVENTORY ACTIVITIES (5 Actionable Cards with Drilldown) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="size-4 text-indigo-600" />
                  Pending Inventory Activities
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actionable inventory workflows requiring management review, confirmation, or physical warehouse action
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Total Pending: {kpis.pendingIssuesCount + kpis.pendingTransfersCount + kpis.pendingAdjustmentsCount + kpis.pendingWriteOffsCount + kpis.pendingMrrCount}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {pendingActivities.map((act, idx) => {
                const IconComp = act.icon;
                return (
                  <div
                    key={idx}
                    className={`bg-slate-50/70 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between border-l-4 ${act.color} hover:bg-white hover:shadow-xs transition-all group`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{act.title}</span>
                        <IconComp className={`size-4 ${act.textColor}`} />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                          {act.count}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">pending</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1 line-clamp-2">{act.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openDirectDrilldown(act.route)}
                      className={`mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold ${act.textColor} group-hover:underline cursor-pointer`}
                    >
                      <span>View Details → Drilldown</span>
                      <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 7 & 8. INVENTORY ALERTS & TOP INVENTORY ITEMS (2-Column Grid) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 7. Inventory Alerts */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="size-4 text-rose-600" />
                      Inventory Alerts
                    </h2>
                    <p className="text-[11px] text-slate-500">Exception monitor for critical anomalies, expiries, and shortfalls</p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    6 Active Monitors
                  </span>
                </div>

                <div className="divide-y divide-slate-100 mt-1">
                  {inventoryAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => openDirectDrilldown(alert.route)}
                      className="py-3 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition cursor-pointer group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="size-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition truncate">
                              {alert.title}
                            </span>
                            <span className={`text-[9.5px] font-bold px-2 py-0.2 rounded-md border ${alert.badge}`}>
                              {alert.count}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{alert.detail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-slate-900 shrink-0">
                        <span>View</span>
                        <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">All alerts sync automatically with physical transactions</span>
                <button
                  type="button"
                  onClick={() => {
                    setDrilldownModal({
                      isOpen: true,
                      title: "Audit & Exception Logs",
                      subtitle: "Review all triggered inventory flags and stock discrepancies",
                      type: "alerts",
                    });
                  }}
                  className="font-bold text-rose-700 hover:underline cursor-pointer"
                >
                  View Details → Drilldown All Alerts
                </button>
              </div>
            </div>

            {/* 8. Top Inventory Items (Highest Stock Value vs Highest Movement Toggle) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="size-4 text-slate-700" />
                      Top Inventory Items
                    </h2>
                    <p className="text-[11px] text-slate-500">Highest financial valuation &amp; velocity items</p>
                  </div>

                  {/* Toggle between Value and Movement */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setTopItemsView("value")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                        topItemsView === "value"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Highest Stock Value
                    </button>
                    <button
                      type="button"
                      onClick={() => setTopItemsView("movement")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                        topItemsView === "movement"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Highest Movement
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Stock Qty</th>
                        <th className="py-2.5 px-3 text-right">
                          {topItemsView === "value" ? "Unit Rate" : "Velocity"}
                        </th>
                        <th className="py-2.5 px-3 text-right">
                          {topItemsView === "value" ? "Total Value" : "Valuation"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {(topItemsView === "value" ? topItemsByValue : topItemsByMovement).map((item, idx) => (
                        <tr
                          key={idx}
                          onClick={() => {
                            setDrilldownModal({
                              isOpen: true,
                              title: `${item.itemName} (${item.itemCode})`,
                              subtitle: `Item Ledger Analysis & Movement Breakdown - ${item.category}`,
                              type: "item_analysis",
                            });
                          }}
                          className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition truncate max-w-[170px]" title={item.itemName}>
                              {item.itemName}
                            </div>
                            <div className="font-mono text-[10px] text-slate-500">{item.itemCode}</div>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-600">
                            {item.category}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {item.stockQty.toLocaleString()} {item.uom}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                            {topItemsView === "value"
                              ? `৳ ${(item as any).unitPrice.toLocaleString()}`
                              : (item as any).movementTurns}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                            ৳ {item.totalValue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Click any line item to open complete ledger drilldown</span>
                <button
                  type="button"
                  onClick={() => openDirectDrilldown("/inv-opening-stock-list")}
                  className="font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  View Details → Complete Item Analysis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE DRILLDOWN MODAL (When clicking any card, status, or table) */}
        {/* ========================================================================= */}
        {drilldownModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">{drilldownModal.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{drilldownModal.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrilldownModal({ isOpen: false, title: "", subtitle: "", type: null })}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body: Relevant Detailed List */}
              <div className="flex-1 overflow-y-auto pr-1">
                {drilldownModal.type === "low" || drilldownModal.type === "critical" || drilldownModal.type === "out" ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                          <th className="py-2.5 px-3">SL</th>
                          <th className="py-2.5 px-3">Item Code</th>
                          <th className="py-2.5 px-3">Item Description</th>
                          <th className="py-2.5 px-3">Warehouse Store</th>
                          <th className="py-2.5 px-3 text-right">Current Stock</th>
                          <th className="py-2.5 px-3 text-right">Reorder Level</th>
                          <th className="py-2.5 px-3 text-center">Deficit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {criticalStockItems.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">{i + 1}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{c.itemCode}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{c.itemName}</td>
                            <td className="py-2.5 px-3 text-slate-600">{c.store}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                              {c.currentStock} {c.uom}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                              {c.reorderLevel} {c.uom}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px]">
                                -{Math.max(0, c.reorderLevel - c.currentStock)} {c.uom}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : drilldownModal.type === "store" ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="text-slate-500 font-medium">Store Context: </span>
                        <strong className="text-slate-900 font-bold">{drilldownModal.targetStore || "All Warehouses"}</strong>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                        Active Stock Point
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                            <th className="py-2.5 px-3">Location / Bin</th>
                            <th className="py-2.5 px-3">Item Stored</th>
                            <th className="py-2.5 px-3">Batch Number</th>
                            <th className="py-2.5 px-3 text-right">Quantity</th>
                            <th className="py-2.5 px-3 text-right">Value (৳)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Rack A - Shelf 01</td>
                            <td className="py-2.5 px-3 font-medium text-slate-700">100% Combed Cotton Yarn Ne 30/1</td>
                            <td className="py-2.5 px-3 font-mono text-purple-600 font-bold">BAT-YRN-2026-09</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">2,400 KG</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">1,008,000</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Rack A - Shelf 02</td>
                            <td className="py-2.5 px-3 font-medium text-slate-700">Polyester Staple Fiber 1.4D</td>
                            <td className="py-2.5 px-3 font-mono text-purple-600 font-bold">BAT-PSF-2026-04</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">1,800 KG</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">432,000</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Chemical Bay C-3</td>
                            <td className="py-2.5 px-3 font-medium text-slate-700">Reactive Blue D-3G Textile Dye</td>
                            <td className="py-2.5 px-3 font-mono text-purple-600 font-bold">BAT-CHM-2025-11</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">120 KG</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">72,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-600">
                      The selected item has continuous inventory movement records across receiving vouchers,
                      material requisitions, and stock transfer orders.
                    </p>
                    <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">30-Day Inflow</span>
                        <strong className="text-sm font-black text-emerald-700 font-mono">1,850 units</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">30-Day Outflow</span>
                        <strong className="text-sm font-black text-rose-700 font-mono">1,420 units</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg. Turn Rate</span>
                        <strong className="text-sm font-black text-blue-700 font-mono">8.4 days</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer with Direct Page Navigation */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Drilldown data filtered by active dashboard criteria</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDrilldownModal({ isOpen: false, title: "", subtitle: "", type: null })}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDrilldownModal({ isOpen: false, title: "", subtitle: "", type: null });
                      navigate({ to: "/inv-opening-stock-list" });
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Open Full Transaction Register</span>
                    <ExternalLink className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
