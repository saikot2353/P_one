import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ExternalLink,
  List,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/procurement-reports-purchase-price")({
  head: () => ({
    meta: [
      { title: "Purchase Price Report — Procurement | CRIPTON" },
      { name: "description", content: "Historical purchase price indexes, lowest/last price comparisons, supplier details, and itemized bill vouchers." },
    ],
  }),
  component: ProcurementReportsPurchasePricePage,
});

export interface BillDetailItem {
  sl: number;
  product: string;
  unit: string;
  quantity: number;
  rate: number;
  total: number;
  dcPrice: number;
  landedCost: number;
}

export interface BillRecord {
  billNo: string;
  billDate: string;
  billTo: string;
  address: string;
  supplier: string;
  purchaseType: string;
  currency: string;
  currencyRate: number;
  totalAmt: number;
  vatAmt: number;
  taxAmt: number;
  otherAmt: number;
  netTotal: number;
  discount: number;
  grandTotal: number;
  items: BillDetailItem[];
}

export interface PurchasePriceHistoryEntry {
  purType: string;
  supplier: string;
  billNo: string;
  billDate: string;
  rate: number;
  dcRate: number;
  landedCost: number;
  currency: string;
  billRef: BillRecord;
}

export interface PurchasePriceItem {
  id: string;
  storeName: string;
  groupName: string;
  itemName: string;
  uom: string;
  lowestPrice: number;
  lowestSupplier?: {
    supplier: string;
    billNo: string;
    billDate: string;
    billRef: BillRecord;
  };
  lastPrice: number;
  lastSupplier?: {
    supplier: string;
    billNo: string;
    billDate: string;
    billRef: BillRecord;
  };
  history: PurchasePriceHistoryEntry[];
}

const SAMPLE_BILL_1001: BillRecord = {
  billNo: "1001",
  billDate: "06/08/2026",
  billTo: "Pakiza Woven Fashion Limited",
  address: "PWFL-Nowpara",
  supplier: "CHAMPION STEEL PRODUCTS",
  purchaseType: "Local",
  currency: "BDT",
  currencyRate: 1.000,
  totalAmt: 67000.0,
  vatAmt: 0.0,
  taxAmt: 0.0,
  otherAmt: 3500.0,
  netTotal: 70500.0,
  discount: 0.0,
  grandTotal: 70500.0,
  items: [
    {
      sl: 1,
      product: "Manager Chair",
      unit: "PCS",
      quantity: 6.0,
      rate: 4500.0,
      total: 27000.0,
      dcPrice: 4500.0,
      landedCost: 4500.0,
    },
    {
      sl: 2,
      product: "Medium Hydrolic Chair (Officer Chair)",
      unit: "PCS",
      quantity: 10.0,
      rate: 4000.0,
      total: 40000.0,
      dcPrice: 4000.0,
      landedCost: 4000.0,
    },
  ],
};

const SAMPLE_BILL_982: BillRecord = {
  billNo: "982",
  billDate: "15/07/2026",
  billTo: "Pakiza Knit Composite Ltd",
  address: "PKCL-Savar",
  supplier: "CHAMPION STEEL PRODUCTS",
  purchaseType: "Local",
  currency: "BDT",
  currencyRate: 1.000,
  totalAmt: 18500.0,
  vatAmt: 0.0,
  taxAmt: 0.0,
  otherAmt: 1500.0,
  netTotal: 20000.0,
  discount: 0.0,
  grandTotal: 20000.0,
  items: [
    {
      sl: 1,
      product: "Visitor Chair",
      unit: "PCS",
      quantity: 10.0,
      rate: 1850.0,
      total: 18500.0,
      dcPrice: 1850.0,
      landedCost: 1850.0,
    },
  ],
};

const SAMPLE_BILL_1042: BillRecord = {
  billNo: "1042",
  billDate: "20/08/2026",
  billTo: "Pakiza Knit Composite Ltd",
  address: "PKCL-Savar",
  supplier: "HATIL COMPLEX LTD",
  purchaseType: "Local",
  currency: "BDT",
  currencyRate: 1.000,
  totalAmt: 48000.0,
  vatAmt: 0.0,
  taxAmt: 0.0,
  otherAmt: 2000.0,
  netTotal: 50000.0,
  discount: 0.0,
  grandTotal: 50000.0,
  items: [
    {
      sl: 1,
      product: "Executive Chair",
      unit: "PCS",
      quantity: 4.0,
      rate: 12000.0,
      total: 48000.0,
      dcPrice: 12000.0,
      landedCost: 12000.0,
    },
  ],
};

const INITIAL_PURCHASE_PRICE_ITEMS: PurchasePriceItem[] = [
  {
    id: "pp-001",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Visitor Chair",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-002",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Manager Chair",
    uom: "PCS",
    lowestPrice: 4500.0,
    lowestSupplier: {
      supplier: "CHAMPION STEEL PRODUCTS",
      billNo: "1001",
      billDate: "06/08/2026",
      billRef: SAMPLE_BILL_1001,
    },
    lastPrice: 4500.0,
    lastSupplier: {
      supplier: "CHAMPION STEEL PRODUCTS",
      billNo: "1001",
      billDate: "06/08/2026",
      billRef: SAMPLE_BILL_1001,
    },
    history: [
      {
        purType: "Local",
        supplier: "CHAMPION STEEL PRODUCTS",
        billNo: "1001",
        billDate: "06/08/2026",
        rate: 4500.0,
        dcRate: 4500.0,
        landedCost: 4500.0,
        currency: "BDT",
        billRef: SAMPLE_BILL_1001,
      },
    ],
  },
  {
    id: "pp-003",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Desk",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-004",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "HOD Chair",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-005",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Cabinet",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-006",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Desk Cabinet",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-007",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Plastic Chair",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-008",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Drawer Cabinet",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-009",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Pattern Table",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-010",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Management Chair",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-011",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Executive Chair",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-012",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Sofa",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  {
    id: "pp-013",
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "Tea Table",
    uom: "PCS",
    lowestPrice: 0.0,
    lastPrice: 0.0,
    history: [],
  },
  // Additional categories for realistic browsing
  {
    id: "pp-014",
    storeName: "General Item Store",
    groupName: "General Stationary",
    itemName: "A4 Photocopy Paper 80GSM",
    uom: "BOX",
    lowestPrice: 1850.0,
    lowestSupplier: {
      supplier: "Progoti Stationary Suppliers",
      billNo: "4792",
      billDate: "01/07/2026",
      billRef: SAMPLE_BILL_982,
    },
    lastPrice: 1850.0,
    lastSupplier: {
      supplier: "Progoti Stationary Suppliers",
      billNo: "4792",
      billDate: "01/07/2026",
      billRef: SAMPLE_BILL_982,
    },
    history: [
      {
        purType: "Local",
        supplier: "Progoti Stationary Suppliers",
        billNo: "4792",
        billDate: "01/07/2026",
        rate: 1850.0,
        dcRate: 1850.0,
        landedCost: 1850.0,
        currency: "BDT",
        billRef: SAMPLE_BILL_982,
      },
    ],
  },
  {
    id: "pp-015",
    storeName: "General Item Store",
    groupName: "IT Hardware",
    itemName: "Barcode Scanner Handheld",
    uom: "PCS",
    lowestPrice: 4800.0,
    lowestSupplier: {
      supplier: "Gadget & Gear",
      billNo: "GGS026202607000383",
      billDate: "16/07/2026",
      billRef: SAMPLE_BILL_1042,
    },
    lastPrice: 4800.0,
    lastSupplier: {
      supplier: "Gadget & Gear",
      billNo: "GGS026202607000383",
      billDate: "16/07/2026",
      billRef: SAMPLE_BILL_1042,
    },
    history: [
      {
        purType: "Local",
        supplier: "Gadget & Gear",
        billNo: "GGS026202607000383",
        billDate: "16/07/2026",
        rate: 4800.0,
        dcRate: 4800.0,
        landedCost: 4800.0,
        currency: "BDT",
        billRef: SAMPLE_BILL_1042,
      },
    ],
  },
];

const STORE_OPTIONS = [
  "General Item Store",
  "Yarn Store",
  "Dyes & Chemical Store",
  "Spare Parts Store",
  "Accessories Store",
  "All Stores",
];

const GROUP_OPTIONS = [
  "Furniture_FixedAssets",
  "General Stationary",
  "IT Hardware",
  "Electrical Spares",
  "Mechanical Spares",
  "Packaging Materials",
  "All Groups",
];

function ProcurementReportsPurchasePricePage() {
  // Filter states
  const [storeName, setStoreName] = useState("General Item Store");
  const [groupName, setGroupName] = useState("Furniture_FixedAssets");
  const [itemNameInput, setItemNameInput] = useState("");

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    storeName: "General Item Store",
    groupName: "Furniture_FixedAssets",
    itemName: "",
  });

  // Table search & pagination
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Modals:
  // 1. Purchase Price History Modal (Screenshot 2)
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<PurchasePriceItem | null>(null);

  // 2. Full Bill Details Modal (Screenshot 3)
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillRecord | null>(null);

  const handleApplyFilter = () => {
    setAppliedFilters({
      storeName,
      groupName,
      itemName: itemNameInput.trim(),
    });
    setCurrentPage(1);
  };

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return INITIAL_PURCHASE_PRICE_ITEMS.filter((item) => {
      // Store filter
      if (appliedFilters.storeName !== "All Stores" && item.storeName !== appliedFilters.storeName) {
        return false;
      }
      // Group filter
      if (appliedFilters.groupName !== "All Groups" && item.groupName !== appliedFilters.groupName) {
        return false;
      }
      // Item name filter
      if (appliedFilters.itemName) {
        if (!item.itemName.toLowerCase().includes(appliedFilters.itemName.toLowerCase())) {
          return false;
        }
      }
      // Table search
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        const match =
          item.itemName.toLowerCase().includes(q) ||
          item.groupName.toLowerCase().includes(q) ||
          item.uom.toLowerCase().includes(q) ||
          (item.lowestSupplier?.supplier || "").toLowerCase().includes(q) ||
          (item.lastSupplier?.supplier || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [appliedFilters, tableSearch]);

  // Pagination
  const totalEntries = filteredRecords.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Open History Modal
  const openHistoryModal = (item: PurchasePriceItem) => {
    setSelectedHistoryItem(item);
    setHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setHistoryModalOpen(false);
    setSelectedHistoryItem(null);
  };

  // Open Bill Details Modal
  const openBillModal = (bill: BillRecord) => {
    setSelectedBill(bill);
    setBillModalOpen(true);
  };

  const closeBillModal = () => {
    setBillModalOpen(false);
    setSelectedBill(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "GroupName", "ItemName", "Uom", "LowestPrice", "LowestSupplier", "LowestBillNo",
      "LowestBillDate", "LastPrice", "LastSupplier", "LastBillNo", "LastBillDate"
    ];
    const rows = filteredRecords.map((r) => [
      `"${r.groupName.replace(/"/g, '""')}"`,
      `"${r.itemName.replace(/"/g, '""')}"`,
      r.uom,
      `${r.lowestPrice.toFixed(2)} Tk.`,
      `"${(r.lowestSupplier?.supplier || "").replace(/"/g, '""')}"`,
      r.lowestSupplier?.billNo || "",
      r.lowestSupplier?.billDate || "",
      `${r.lastPrice.toFixed(2)} Tk.`,
      `"${(r.lastSupplier?.supplier || "").replace(/"/g, '""')}"`,
      r.lastSupplier?.billNo || "",
      r.lastSupplier?.billDate || "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `purchase_price_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTable = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-7 space-y-5 w-full max-w-[1700px] mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-[#1890ff]" />
                Purchase Price
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Procurement Workspace &gt; Reports &gt; <span className="text-[#1890ff] font-medium">Purchase Price</span>
              </p>
            </div>
          </div>

          {/* Top Filter Card (Matching Screenshot 1 with blue left accent bar) */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-[#1890ff] p-5 pl-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              {/* Store Name */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Store Name
                </label>
                <select
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                >
                  {STORE_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Group Name */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Group Name
                </label>
                <select
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                >
                  {GROUP_OPTIONS.map((grp) => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemNameInput}
                  onChange={(e) => setItemNameInput(e.target.value)}
                  placeholder="Enter item name..."
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>

              {/* SHOW Button */}
              <div>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="w-24 h-8 bg-[#1890ff] hover:bg-sky-600 text-white font-bold text-xs uppercase rounded transition-colors shadow-2xs cursor-pointer flex items-center justify-center tracking-wider"
                >
                  SHOW
                </button>
              </div>
            </div>
          </div>

          {/* Table Card (Matching Screenshot 1) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden">
            {/* Toolbar: EXCEL, PRINT, PDF, Search */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {/* Left Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  EXCEL
                </button>
                <button
                  type="button"
                  onClick={handlePrintTable}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="size-3.5 text-blue-600" />
                  PRINT
                </button>
                <button
                  type="button"
                  onClick={handlePrintTable}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <FileText className="size-3.5 text-rose-600" />
                  PDF
                </button>
              </div>

              {/* Right Search Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-8 w-48 sm:w-64 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>
            </div>

            {/* Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    <th className="py-2.5 px-3 w-12 text-center">∇</th>
                    <th className="py-2.5 px-3 min-w-[160px]">GroupName</th>
                    <th className="py-2.5 px-3 min-w-[180px]">ItemName</th>
                    <th className="py-2.5 px-2.5 w-16 text-center">Uom</th>
                    <th className="py-2.5 px-3 w-28 text-right">LowestPrice</th>
                    <th className="py-2.5 px-4 min-w-[240px]">Supplier Details(Lowest Price)</th>
                    <th className="py-2.5 px-3 w-28 text-right">LastPrice</th>
                    <th className="py-2.5 px-4 min-w-[240px]">Supplier Details(Last Price)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        No purchase price records found matching criteria
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-sky-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                          idx % 2 === 1 ? "bg-slate-50/40 dark:bg-slate-850/40" : ""
                        }`}
                      >
                        {/* ∇: Action Button to Open History Modal */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => openHistoryModal(row)}
                            title="View Purchase Price History"
                            className="p-1 text-[#1890ff] hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded transition-colors cursor-pointer"
                          >
                            <List className="size-4 text-[#1890ff]" />
                          </button>
                        </td>

                        {/* GroupName */}
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                          {row.groupName}
                        </td>

                        {/* ItemName */}
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                          {row.itemName}
                        </td>

                        {/* Uom */}
                        <td className="py-2.5 px-2.5 text-center font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                          {row.uom}
                        </td>

                        {/* LowestPrice */}
                        <td className="py-2.5 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                          {row.lowestPrice.toFixed(2)} Tk.
                        </td>

                        {/* Supplier Details(Lowest Price) */}
                        <td className="py-2.5 px-4 text-xs">
                          {row.lowestSupplier ? (
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {row.lowestSupplier.supplier}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                <span>
                                  Bill: {row.lowestSupplier.billNo}, Date: {row.lowestSupplier.billDate}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openBillModal(row.lowestSupplier!.billRef)}
                                  title="View Bill Details"
                                  className="text-[#1890ff] hover:text-sky-700 cursor-pointer"
                                >
                                  <ExternalLink className="size-3.5 text-[#1890ff]" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* LastPrice */}
                        <td className="py-2.5 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                          {row.lastPrice.toFixed(2)} Tk.
                        </td>

                        {/* Supplier Details(Last Price) */}
                        <td className="py-2.5 px-4 text-xs">
                          {row.lastSupplier ? (
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {row.lastSupplier.supplier}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                <span>
                                  Bill: {row.lastSupplier.billNo}, Date: {row.lastSupplier.billDate}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openBillModal(row.lastSupplier!.billRef)}
                                  title="View Bill Details"
                                  className="text-[#1890ff] hover:text-sky-700 cursor-pointer"
                                >
                                  <ExternalLink className="size-3.5 text-[#1890ff]" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Status Footer (Matching Screenshot 1) */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                Showing {totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-[#1890ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-7 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#52c41a] text-white shadow-2xs"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-[#1890ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: Purchase Price History Modal (Matching Screenshot 2)            */}
      {/* ========================================================================= */}
      {historyModalOpen && selectedHistoryItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="grid grid-cols-2 gap-8 text-xs w-full max-w-md">
                <div>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Product Name: </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 ml-2">
                    {selectedHistoryItem.itemName}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Unit: </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 ml-2">
                    {selectedHistoryItem.uom}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeHistoryModal}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-3">
              <div className="text-xs font-semibold italic text-slate-600 dark:text-slate-400">
                Bill Details
              </div>

              <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
                      <th className="py-2.5 px-3 w-10 text-center border-r border-slate-300 dark:border-slate-700">#</th>
                      <th className="py-2.5 px-3 min-w-[100px] border-r border-slate-300 dark:border-slate-700">PurType</th>
                      <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-300 dark:border-slate-700">Supplier</th>
                      <th className="py-2.5 px-3 w-24 border-r border-slate-300 dark:border-slate-700">BillNo</th>
                      <th className="py-2.5 px-3 w-24 border-r border-slate-300 dark:border-slate-700">BillDate</th>
                      <th className="py-2.5 px-3 w-24 text-right border-r border-slate-300 dark:border-slate-700">Rate</th>
                      <th className="py-2.5 px-3 w-24 text-right border-r border-slate-300 dark:border-slate-700">DCRate</th>
                      <th className="py-2.5 px-3 w-24 text-right border-r border-slate-300 dark:border-slate-700">LandedCost</th>
                      <th className="py-2.5 px-2.5 w-16 text-center">Currency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-750">
                    {selectedHistoryItem.history.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                          No historical bill records recorded for this item
                        </td>
                      </tr>
                    ) : (
                      selectedHistoryItem.history.map((entry, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          {/* # with External Link Icon */}
                          <td className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => {
                                closeHistoryModal();
                                openBillModal(entry.billRef);
                              }}
                              title="Open Full Bill Voucher"
                              className="text-[#1890ff] hover:text-sky-700 cursor-pointer p-0.5"
                            >
                              <ExternalLink className="size-3.5 text-[#1890ff]" />
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                            {entry.purType}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                            {entry.supplier}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700">
                            {entry.billNo}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">
                            {entry.billDate}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                            {entry.rate.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                            {entry.dcRate.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                            {entry.landedCost.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                            {entry.currency}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
              <button
                type="button"
                onClick={closeHistoryModal}
                className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Full Bill Details Modal (Matching Screenshot 3)                 */}
      {/* ========================================================================= */}
      {billModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Supplier Bill Document — Bill #{selectedBill.billNo}
              </span>
              <button
                type="button"
                onClick={closeBillModal}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* 4-Row Metadata Layout (Matching Screenshot 3) */}
              <div className="border border-slate-300 dark:border-slate-700 rounded p-4 space-y-2 bg-slate-50/40 dark:bg-slate-850/40 text-xs">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600 dark:text-slate-400">Bill To:</span>
                    <span className="flex-1 font-semibold text-slate-900 dark:text-slate-100">
                      {selectedBill.billTo}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-slate-600 dark:text-slate-400">Bill No:</span>
                    <span className="flex-1 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {selectedBill.billNo}
                    </span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600 dark:text-slate-400">Address:</span>
                    <span className="flex-1 text-slate-800 dark:text-slate-200">
                      {selectedBill.address}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-slate-600 dark:text-slate-400">Bill Date:</span>
                    <span className="flex-1 text-slate-800 dark:text-slate-200">
                      {selectedBill.billDate}
                    </span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600 dark:text-slate-400">Supplier:</span>
                    <span className="flex-1 font-semibold text-slate-900 dark:text-slate-100">
                      {selectedBill.supplier}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-slate-600 dark:text-slate-400">Purchase Type:</span>
                    <span className="flex-1 text-slate-800 dark:text-slate-200">
                      {selectedBill.purchaseType}
                    </span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="w-28 font-medium text-slate-600 dark:text-slate-400">Currency:</span>
                    <span className="flex-1 font-semibold text-slate-900 dark:text-slate-100">
                      {selectedBill.currency}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium text-slate-600 dark:text-slate-400">Currency Rate (Tk):</span>
                    <span className="flex-1 font-mono text-slate-800 dark:text-slate-200">
                      {selectedBill.currencyRate.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill Details Section Header */}
              <div className="text-xs font-semibold italic text-slate-600 dark:text-slate-400">
                Bill Details
              </div>

              {/* Items Table & Integrated Financial Summary (Matching Screenshot 3) */}
              <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
                      <th className="py-2.5 px-3 w-8 text-center border-r border-slate-300 dark:border-slate-700">#</th>
                      <th className="py-2.5 px-3 min-w-[220px] border-r border-slate-300 dark:border-slate-700">Product</th>
                      <th className="py-2.5 px-2.5 w-16 text-center border-r border-slate-300 dark:border-slate-700">Unit</th>
                      <th className="py-2.5 px-3 w-20 text-right border-r border-slate-300 dark:border-slate-700">Quantity</th>
                      <th className="py-2.5 px-3 w-24 text-right border-r border-slate-300 dark:border-slate-700">Rate</th>
                      <th className="py-2.5 px-3 w-24 text-right border-r border-slate-300 dark:border-slate-700">Total</th>
                      <th className="py-2.5 px-3 w-24 text-right border-r border-slate-300 dark:border-slate-700">DC Price</th>
                      <th className="py-2.5 px-3 w-24 text-right">LandedCost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-750">
                    {selectedBill.items.map((item) => (
                      <tr key={item.sl} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700">
                          {item.sl}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.product}
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-mono text-slate-700 dark:text-slate-300 text-[11px] border-r border-slate-200 dark:border-slate-700">
                          {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.quantity.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.rate.toFixed(0)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.total.toFixed(0)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700">
                          {item.dcPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">
                          {item.landedCost.toFixed(2)}
                        </td>
                      </tr>
                    ))}

                    {/* Integrated Summary Rows (Matching Screenshot 3) */}
                    <tr className="border-t border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-850/40">
                      <td colSpan={4}></td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        Total Amt
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        {selectedBill.totalAmt.toFixed(0)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>

                    <tr>
                      <td colSpan={4}></td>
                      <td className="py-1.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Vat Amt
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedBill.vatAmt.toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>

                    <tr>
                      <td colSpan={4}></td>
                      <td className="py-1.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Tax Amt
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedBill.taxAmt.toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>

                    <tr>
                      <td colSpan={4}></td>
                      <td className="py-1.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Other Amt
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedBill.otherAmt.toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>

                    <tr className="bg-slate-50 dark:bg-slate-800/60 font-semibold">
                      <td colSpan={4}></td>
                      <td className="py-1.5 px-3 text-right text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        Net Total
                      </td>
                      <td className="py-1.5 px-3 text-right text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        {selectedBill.netTotal.toFixed(0)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>

                    <tr>
                      <td colSpan={4}></td>
                      <td className="py-1.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Discount
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700">
                        {selectedBill.discount.toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>

                    <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                      <td colSpan={4}></td>
                      <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        G.Total
                      </td>
                      <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        {selectedBill.grandTotal.toFixed(0)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[#1890ff] hover:bg-sky-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="size-3.5" /> Print Bill
              </button>
              <button
                type="button"
                onClick={closeBillModal}
                className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
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
