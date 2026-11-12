import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Filter,
  Eye,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Building2,
  Package,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  WarrantyRegisterItem,
  WarrantyStatusType,
  WarrantyAttachment,
  calculateWarrantyStatus,
  formatRemainingDaysText,
  getAttachmentTypeCategory,
  getStoredWarrantyRegisterItems,
} from "@/lib/warranty-register-data";
import { getStoredWarrantyTypes } from "@/lib/warranty-types-data";
import { exportToCSV, exportToExcel } from "@/lib/report-export-utils";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-report-warranty-register")({
  head: () => ({
    meta: [
      { title: "Warranty Register — Inventory Reports | CRIPTON" },
      {
        name: "description",
        content:
          "Enterprise Warranty Register tracking equipment warranties, SLAs, coverage periods, expiration alerts, and attachments from MRR transactions.",
      },
    ],
  }),
  component: WarrantyRegisterPage,
});

type QuickFilter =
  | "All"
  | "Active"
  | "Expiring in 30 Days"
  | "Expiring in 60 Days"
  | "Expiring in 90 Days"
  | "Expired";

export function WarrantyRegisterPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WarrantyRegisterItem[]>(() =>
    getStoredWarrantyRegisterItems()
  );

  // Reload data from localStorage on mount & listen for window storage events
  useEffect(() => {
    const refreshData = () => {
      setItems(getStoredWarrantyRegisterItems());
    };
    refreshData();
    window.addEventListener("storage", refreshData);
    return () => window.removeEventListener("storage", refreshData);
  }, []);

  // Quick Filter Tab
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("All");

  // Filters
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterItemGroup, setFilterItemGroup] = useState("All");
  const [filterItemCategory, setFilterItemCategory] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterWarrantyType, setFilterWarrantyType] = useState("All");
  const [filterWarrantyStatus, setFilterWarrantyStatus] = useState<
    "All" | WarrantyStatusType
  >("All");
  const [filterStartDateFrom, setFilterStartDateFrom] = useState("");
  const [filterStartDateTo, setFilterStartDateTo] = useState("");
  const [filterEndDateFrom, setFilterEndDateFrom] = useState("");
  const [filterEndDateTo, setFilterEndDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [attachmentModalItem, setAttachmentModalItem] =
    useState<WarrantyRegisterItem | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState<StandardReportData | null>(
    null
  );

  // Distinct options from data
  const companies = useMemo(
    () => Array.from(new Set(items.map((d) => d.company).filter(Boolean))),
    [items]
  );
  const stores = useMemo(
    () => Array.from(new Set(items.map((d) => d.warehouseStore).filter(Boolean))),
    [items]
  );
  const itemGroups = useMemo(
    () => Array.from(new Set(items.map((d) => d.itemGroup).filter(Boolean))),
    [items]
  );
  const itemCategories = useMemo(
    () => Array.from(new Set(items.map((d) => d.itemCategory).filter(Boolean))),
    [items]
  );
  const suppliers = useMemo(
    () => Array.from(new Set(items.map((d) => d.supplier).filter(Boolean))),
    [items]
  );
  const warrantyTypes = useMemo(() => {
    const configured = getStoredWarrantyTypes().map((w) => w.warrantyType);
    const fromData = items.map((d) => d.warrantyType).filter(Boolean);
    return Array.from(new Set([...configured, ...fromData]));
  }, [items]);

  // Enriched items with dynamic real-time status calculation
  const enrichedItems = useMemo(() => {
    return items.map((item) => {
      const calc = calculateWarrantyStatus(
        item.warrantyStartDate,
        item.warrantyEndDate
      );
      return {
        ...item,
        computedStatus: calc.status,
        remainingDays: calc.remainingDays,
        totalDays: calc.totalDays,
        formattedRemainingDays: formatRemainingDaysText(
          calc.remainingDays,
          calc.status
        ),
      };
    });
  }, [items]);

  // Overall KPI Calculations (based on total dataset)
  const overallKpis = useMemo(() => {
    const totalItems = enrichedItems.length;
    const activeWarranty = enrichedItems.filter(
      (i) => i.computedStatus === "Active"
    ).length;
    const expiringSoon = enrichedItems.filter(
      (i) => i.computedStatus === "Expiring Soon"
    ).length;
    const expiredWarranty = enrichedItems.filter(
      (i) => i.computedStatus === "Expired"
    ).length;

    return {
      totalItems,
      activeWarranty,
      expiringSoon,
      expiredWarranty,
    };
  }, [enrichedItems]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return enrichedItems.filter((row) => {
      // 1. Quick Filter tab
      if (quickFilter === "Active" && row.computedStatus !== "Active") return false;
      if (quickFilter === "Expiring in 30 Days") {
        if (!(row.remainingDays >= 0 && row.remainingDays <= 30)) return false;
      }
      if (quickFilter === "Expiring in 60 Days") {
        if (!(row.remainingDays >= 0 && row.remainingDays <= 60)) return false;
      }
      if (quickFilter === "Expiring in 90 Days") {
        if (!(row.remainingDays >= 0 && row.remainingDays <= 90)) return false;
      }
      if (
        quickFilter === "Expired" &&
        row.computedStatus !== "Expired" &&
        row.remainingDays >= 0
      )
        return false;

      // 2. Dropdown Filters
      if (filterCompany !== "All" && row.company !== filterCompany) return false;
      if (filterStore !== "All" && row.warehouseStore !== filterStore) return false;
      if (filterItemGroup !== "All" && row.itemGroup !== filterItemGroup)
        return false;
      if (filterItemCategory !== "All" && row.itemCategory !== filterItemCategory)
        return false;
      if (filterSupplier !== "All" && row.supplier !== filterSupplier) return false;
      if (
        filterWarrantyType !== "All" &&
        row.warrantyType !== filterWarrantyType
      )
        return false;
      if (
        filterWarrantyStatus !== "All" &&
        row.computedStatus !== filterWarrantyStatus
      )
        return false;

      // 3. Date Ranges
      if (filterStartDateFrom && row.warrantyStartDate < filterStartDateFrom)
        return false;
      if (filterStartDateTo && row.warrantyStartDate > filterStartDateTo)
        return false;
      if (filterEndDateFrom && row.warrantyEndDate < filterEndDateFrom) return false;
      if (filterEndDateTo && row.warrantyEndDate > filterEndDateTo) return false;

      // 4. Search Query (Item Code, Item Name, MRR No, Brand, Supplier, PO/WO)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          row.itemCode.toLowerCase().includes(q) ||
          row.itemName.toLowerCase().includes(q) ||
          row.mrrNo.toLowerCase().includes(q) ||
          (row.brand && row.brand.toLowerCase().includes(q)) ||
          (row.supplier && row.supplier.toLowerCase().includes(q)) ||
          (row.poWoNo && row.poWoNo.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [
    enrichedItems,
    quickFilter,
    filterCompany,
    filterStore,
    filterItemGroup,
    filterItemCategory,
    filterSupplier,
    filterWarrantyType,
    filterWarrantyStatus,
    filterStartDateFrom,
    filterStartDateTo,
    filterEndDateFrom,
    filterEndDateTo,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setQuickFilter("All");
    setFilterCompany("All");
    setFilterStore("All");
    setFilterItemGroup("All");
    setFilterItemCategory("All");
    setFilterSupplier("All");
    setFilterWarrantyType("All");
    setFilterWarrantyStatus("All");
    setFilterStartDateFrom("");
    setFilterStartDateTo("");
    setFilterEndDateFrom("");
    setFilterEndDateTo("");
    setSearchQuery("");
    toast.info("All filters reset to default");
  };

  // Download Attachment action helper
  const handleDownloadAttachmentFile = (att: WarrantyAttachment, itemRef: WarrantyRegisterItem) => {
    const docName = att.name;

    try {
      if (att.dataUrl && (att.dataUrl.startsWith("data:") || att.dataUrl.startsWith("blob:"))) {
        const a = document.createElement("a");
        a.href = att.dataUrl;
        a.download = docName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success(`Downloaded "${docName}"`);
        return;
      }

      // Generate authentic certificate text blob
      const content =
        `CRIPTON ERP - OFFICIAL WARRANTY CERTIFICATE / AGREEMENT RECORD\n` +
        `============================================================\n\n` +
        `Document Name:      ${docName}\n` +
        `Item Code:          ${itemRef.itemCode}\n` +
        `Item Name:          ${itemRef.itemName}\n` +
        `Brand / Origin:     ${itemRef.brand} (${itemRef.origin})\n` +
        `Supplier / Vendor:  ${itemRef.supplier}\n` +
        `MRR Reference:      ${itemRef.mrrNo}\n` +
        `PO / WO Reference:  ${itemRef.poWoNo}\n` +
        `Challan No:         ${itemRef.challanNo}\n` +
        `Receive Date:       ${itemRef.receiveDate}\n` +
        `Warehouse Store:    ${itemRef.warehouseStore}\n\n` +
        `WARRANTY COVERAGE\n` +
        `-----------------\n` +
        `Warranty Type:      ${itemRef.warrantyType}\n` +
        `Warranty Start:     ${itemRef.warrantyStartDate}\n` +
        `Warranty Expiration:${itemRef.warrantyEndDate}\n` +
        `Total Period:       ${itemRef.totalWarrantyPeriod}\n` +
        `Current Status:     ${calculateWarrantyStatus(itemRef.warrantyStartDate, itemRef.warrantyEndDate).status}\n\n` +
        `Warranty Terms & Scope:\n` +
        `${itemRef.remarks || "Standard manufacturer warranty coverage applicable per purchase agreement."}\n\n` +
        `Digitally recorded and verified in CRIPTON Inventory Management System.\n`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = docName.endsWith(".pdf") ? docName : `${docName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded "${docName}"`);
    } catch {
      toast.error("Failed to download attachment.");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Item Code",
      "Item Name",
      "Brand",
      "Origin",
      "UOM",
      "Supplier",
      "MRR No",
      "PO / WO No",
      "Warranty Type",
      "Warranty Start Date",
      "Warranty End Date",
      "Remaining Days",
      "Warranty Status",
      "Attachment Count",
      "Store",
      "Company",
    ];

    const rows = filteredRows.map((r, idx) => [
      idx + 1,
      r.itemCode,
      r.itemName,
      r.brand,
      r.origin,
      r.uom,
      r.supplier,
      r.mrrNo,
      r.poWoNo,
      r.warrantyType,
      r.warrantyStartDate,
      r.warrantyEndDate,
      r.formattedRemainingDays,
      r.computedStatus,
      r.attachments ? r.attachments.length : 0,
      r.warehouseStore,
      r.company,
    ]);

    exportToCSV(
      `Warranty_Register_${new Date().toISOString().slice(0, 10)}.csv`,
      headers,
      rows
    );
    toast.success("CSV export initiated");
  };

  // Export to Excel
  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Item Code",
      "Item Name",
      "Brand",
      "Origin",
      "UOM",
      "Supplier",
      "MRR No",
      "PO / WO No",
      "Warranty Type",
      "Warranty Start Date",
      "Warranty End Date",
      "Remaining Days",
      "Warranty Status",
      "Attachment Count",
      "Store",
      "Company",
    ];

    const rows = filteredRows.map((r, idx) => [
      idx + 1,
      r.itemCode,
      r.itemName,
      r.brand,
      r.origin,
      r.uom,
      r.supplier,
      r.mrrNo,
      r.poWoNo,
      r.warrantyType,
      r.warrantyStartDate,
      r.warrantyEndDate,
      r.formattedRemainingDays,
      r.computedStatus,
      r.attachments ? r.attachments.length : 0,
      r.warehouseStore,
      r.company,
    ]);

    const subtotals = [
      { label: "Total Filtered Items", value: filteredRows.length.toString() },
      {
        label: "Active Warranties",
        value: filteredRows
          .filter((r) => r.computedStatus === "Active")
          .length.toString(),
      },
      {
        label: "Expiring Soon (<=30d)",
        value: filteredRows
          .filter((r) => r.computedStatus === "Expiring Soon")
          .length.toString(),
      },
      {
        label: "Expired",
        value: filteredRows
          .filter((r) => r.computedStatus === "Expired")
          .length.toString(),
      },
    ];

    exportToExcel(
      `Warranty_Register_${new Date().toISOString().slice(0, 10)}.xls`,
      `CRIPTON - Warranty Register Report (${new Date().toLocaleDateString()})`,
      headers,
      rows,
      subtotals
    );
    toast.success("Excel report generated successfully!");
  };

  // PDF Preview
  const handlePrintPDF = () => {
    const tableHeaders = [
      "SL",
      "Item Code",
      "Item Name",
      "Supplier",
      "MRR No",
      "Warranty Type",
      "Start Date",
      "End Date",
      "Remaining Days",
      "Status",
    ];

    const tableRows = filteredRows.map((r, idx) => [
      idx + 1,
      r.itemCode,
      `${r.itemName} (${r.brand})`,
      r.supplier,
      r.mrrNo,
      r.warrantyType,
      r.warrantyStartDate,
      r.warrantyEndDate,
      r.formattedRemainingDays,
      r.computedStatus,
    ]);

    setPdfReportData({
      reportTitle: "WARRANTY REGISTER REPORT",
      documentNumber: `WARR-REG-${new Date().toISOString().slice(0, 10)}`,
      reportDate: new Date().toLocaleDateString(),
      companyName:
        filterCompany !== "All"
          ? filterCompany
          : "Pakiza Group of Industries / CRIPTON",
      department: "Central Inventory & Equipment Maintenance Management",
      metadata: [
        { label: "Report Type", value: "Master Warranty Register" },
        { label: "Store Filter", value: filterStore },
        { label: "Active Warranties", value: overallKpis.activeWarranty },
        { label: "Expiring in 30 Days", value: overallKpis.expiringSoon },
      ],
      tableHeaders,
      tableRows,
      financials: [
        { label: "Total Warranty Items", value: overallKpis.totalItems },
        { label: "Active Warranties", value: overallKpis.activeWarranty },
        {
          label: "Expiring Soon (<=30 Days)",
          value: overallKpis.expiringSoon,
          highlight: true,
        },
        { label: "Expired Warranties", value: overallKpis.expiredWarranty },
      ],
      signatures: [
        { role: "Inventory Officer", name: "Maintenance Desk" },
        { role: "Store In-Charge", name: "Warehouse Manager" },
        { role: "Head of Procurement", name: "AGM Supply Chain" },
      ],
    });
    setIsPdfModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-7 py-5 space-y-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-1">
                <span>Inventory Management</span>
                <ChevronRight className="size-3 text-muted-foreground/50" />
                <span>Reports</span>
                <ChevronRight className="size-3 text-muted-foreground/50" />
                <span className="text-foreground font-semibold">Warranty Register</span>
              </div>

              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Warranty Register
                </h1>
                {/* Subtle & Professional Enterprise Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted/80 text-muted-foreground border border-border/80">
                  <ShieldCheck className="size-3 text-primary/70 shrink-0" />
                  <span>MRR Warranty Monitoring</span>
                </span>
              </div>
            </div>

            {/* Export & Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition cursor-pointer shadow-2xs"
                title="Export as Excel (.xls)"
              >
                <FileSpreadsheet className="size-3.5" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-blue-600 dark:text-blue-400 transition cursor-pointer shadow-2xs"
                title="Export as CSV (.csv)"
              >
                <FileText className="size-3.5" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={handlePrintPDF}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-amber-600 dark:text-amber-400 transition cursor-pointer shadow-2xs"
                title="Print or Preview PDF"
              >
                <Printer className="size-3.5" />
                <span>PDF / Print</span>
              </button>
            </div>
          </div>

          {/* 4 Dynamic Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Total Warranty Items */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-2xs transition-all hover:border-border">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Total Warranty Items
                </span>
                <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                  <Package className="size-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-1 text-foreground font-mono tracking-tight">
                {overallKpis.totalItems}
              </p>
              <span className="text-[10.5px] text-muted-foreground flex items-center gap-1 mt-0.5">
                Registered warranty records
              </span>
            </div>

            {/* 2. Active Warranty (Green) */}
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] dark:bg-emerald-950/10 shadow-2xs transition-all hover:border-emerald-500/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Active Warranty
                </span>
                <div className="p-1.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-1 text-emerald-700 dark:text-emerald-400 font-mono tracking-tight">
                {overallKpis.activeWarranty}
              </p>
              <span className="text-[10.5px] text-emerald-600/80 dark:text-emerald-400/80 flex items-center gap-1 mt-0.5">
                Within valid coverage period
              </span>
            </div>

            {/* 3. Expiring Soon (Amber) */}
            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] dark:bg-amber-950/10 shadow-2xs transition-all hover:border-amber-500/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Expiring Soon
                </span>
                <div className="p-1.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="size-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-1 text-amber-700 dark:text-amber-400 font-mono tracking-tight">
                {overallKpis.expiringSoon}
              </p>
              <span className="text-[10.5px] text-amber-600/80 dark:text-amber-400/80 flex items-center gap-1 mt-0.5 font-medium">
                Expiring within next 30 days
              </span>
            </div>

            {/* 4. Expired Warranty (Red) */}
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] dark:bg-rose-950/10 shadow-2xs transition-all hover:border-rose-500/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Expired Warranty
                </span>
                <div className="p-1.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  <XCircle className="size-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-1 text-rose-700 dark:text-rose-400 font-mono tracking-tight">
                {overallKpis.expiredWarranty}
              </p>
              <span className="text-[10.5px] text-rose-600/80 dark:text-rose-400/80 flex items-center gap-1 mt-0.5">
                Coverage period has ended
              </span>
            </div>
          </div>

          {/* Quick Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/60 text-xs font-semibold">
            {(
              [
                { id: "All", label: "All Items", count: enrichedItems.length },
                { id: "Active", label: "Active", count: overallKpis.activeWarranty },
                {
                  id: "Expiring in 30 Days",
                  label: "Expiring in 30 Days",
                  count: enrichedItems.filter(
                    (i) => i.remainingDays >= 0 && i.remainingDays <= 30
                  ).length,
                },
                {
                  id: "Expiring in 60 Days",
                  label: "Expiring in 60 Days",
                  count: enrichedItems.filter(
                    (i) => i.remainingDays >= 0 && i.remainingDays <= 60
                  ).length,
                },
                {
                  id: "Expiring in 90 Days",
                  label: "Expiring in 90 Days",
                  count: enrichedItems.filter(
                    (i) => i.remainingDays >= 0 && i.remainingDays <= 90
                  ).length,
                },
                { id: "Expired", label: "Expired", count: overallKpis.expiredWarranty },
              ] as const
            ).map((tab) => {
              const isSelected = quickFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQuickFilter(tab.id as QuickFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-card hover:bg-muted text-muted-foreground border border-border/70"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Refined Filter & Search Panel */}
          <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Filter & Search Criteria</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/70 hover:bg-muted transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset Filters</span>
              </button>
            </div>

            {/* Row 1: Dropdown Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {/* Company */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Company
                </label>
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="w-full mt-1 h-8.5 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none transition-colors"
                >
                  <option value="All">All Companies</option>
                  {companies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse / Store */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Warehouse / Store
                </label>
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="w-full mt-1 h-8.5 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none transition-colors"
                >
                  <option value="All">All Stores</option>
                  {stores.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Group */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Item Group
                </label>
                <select
                  value={filterItemGroup}
                  onChange={(e) => setFilterItemGroup(e.target.value)}
                  className="w-full mt-1 h-8.5 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none transition-colors"
                >
                  <option value="All">All Item Groups</option>
                  {itemGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Category */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Item Category
                </label>
                <select
                  value={filterItemCategory}
                  onChange={(e) => setFilterItemCategory(e.target.value)}
                  className="w-full mt-1 h-8.5 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none transition-colors"
                >
                  <option value="All">All Categories</option>
                  {itemCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Supplier
                </label>
                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="w-full mt-1 h-8.5 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none transition-colors"
                >
                  <option value="All">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warranty Type */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Warranty Type
                </label>
                <select
                  value={filterWarrantyType}
                  onChange={(e) => setFilterWarrantyType(e.target.value)}
                  className="w-full mt-1 h-8.5 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none transition-colors"
                >
                  <option value="All">All Warranty Types</option>
                  {warrantyTypes.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Status, Date Ranges, Search by Code/Name/MRR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
              {/* Warranty Status */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Warranty Status
                </label>
                <select
                  value={filterWarrantyStatus}
                  onChange={(e) =>
                    setFilterWarrantyStatus(e.target.value as any)
                  }
                  className="w-full mt-1 h-8.5 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none transition-colors"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon (≤30d)</option>
                  <option value="Expired">Expired</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              {/* Warranty Start Date Range */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Start Date Range
                </label>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  <input
                    type="date"
                    value={filterStartDateFrom}
                    onChange={(e) => setFilterStartDateFrom(e.target.value)}
                    placeholder="From"
                    className="w-full h-8.5 px-2 rounded-lg border border-border/80 bg-background text-[11px] font-medium focus:border-primary outline-none"
                    title="Start Date From"
                  />
                  <input
                    type="date"
                    value={filterStartDateTo}
                    onChange={(e) => setFilterStartDateTo(e.target.value)}
                    placeholder="To"
                    className="w-full h-8.5 px-2 rounded-lg border border-border/80 bg-background text-[11px] font-medium focus:border-primary outline-none"
                    title="Start Date To"
                  />
                </div>
              </div>

              {/* Warranty End Date Range */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  End Date Range (Expiry)
                </label>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  <input
                    type="date"
                    value={filterEndDateFrom}
                    onChange={(e) => setFilterEndDateFrom(e.target.value)}
                    placeholder="From"
                    className="w-full h-8.5 px-2 rounded-lg border border-border/80 bg-background text-[11px] font-medium focus:border-primary outline-none"
                    title="End Date From"
                  />
                  <input
                    type="date"
                    value={filterEndDateTo}
                    onChange={(e) => setFilterEndDateTo(e.target.value)}
                    placeholder="To"
                    className="w-full h-8.5 px-2 rounded-lg border border-border/80 bg-background text-[11px] font-medium focus:border-primary outline-none"
                    title="End Date To"
                  />
                </div>
              </div>

              {/* Search by Item Code / Name / MRR No */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Search Item Code / Item Name / MRR No.
                </label>
                <div className="relative mt-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Item Code, Name, MRR No, PO/WO, Brand, or Supplier..."
                    className="w-full h-8.5 pl-8 pr-8 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-primary outline-none shadow-2xs transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary & Counter */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
            <span>
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredRows.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">
                {enrichedItems.length}
              </span>{" "}
              actual warranty records from Material Receive transactions
            </span>
            {filteredRows.length === 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                No warranty records match current filter criteria.
              </span>
            )}
          </div>

          {/* Main Data Table */}
          <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-muted-foreground font-semibold text-[11px] tracking-wide select-none">
                    <th className="py-3 px-3 text-center w-12">SL.</th>
                    <th className="py-3 px-3 min-w-[110px]">Item Code</th>
                    <th className="py-3 px-3 min-w-[220px]">Item Name</th>
                    <th className="py-3 px-3 min-w-[90px]">Brand</th>
                    <th className="py-3 px-3 min-w-[80px]">Origin</th>
                    <th className="py-3 px-2 text-center min-w-[60px]">UoM</th>
                    <th className="py-3 px-3 min-w-[170px]">Supplier</th>
                    <th className="py-3 px-3 min-w-[130px]">MRR No.</th>
                    <th className="py-3 px-3 min-w-[180px]">Warranty Type</th>
                    <th className="py-3 px-3 text-center min-w-[105px]">
                      Warranty Start Date
                    </th>
                    <th className="py-3 px-3 text-center min-w-[105px]">
                      Warranty End Date
                    </th>
                    <th className="py-3 px-3 text-center min-w-[135px]">
                      Remaining Days
                    </th>
                    <th className="py-3 px-3 text-center min-w-[110px]">
                      Warranty Status
                    </th>
                    <th className="py-3 px-3 text-center min-w-[130px]">
                      Attachment
                    </th>
                    <th className="py-3 px-3 text-center w-18 sticky right-0 bg-muted/95 backdrop-blur-xs border-l border-border/70 shadow-xs">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRows.map((row, idx) => {
                    const status = row.computedStatus;
                    const remaining = row.remainingDays;

                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-muted/30 transition-colors group text-foreground"
                      >
                        {/* SL */}
                        <td className="py-2.5 px-3 text-center text-muted-foreground font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Item Code */}
                        <td className="py-2.5 px-3 font-mono font-semibold text-primary">
                          {row.itemCode}
                        </td>

                        {/* Item Name (Only Item Name, no specification beneath) */}
                        <td className="py-2.5 px-3">
                          <span
                            className="font-semibold text-foreground line-clamp-1"
                            title={row.itemName}
                          >
                            {row.itemName}
                          </span>
                        </td>

                        {/* Brand */}
                        <td className="py-2.5 px-3 text-muted-foreground font-medium">
                          {row.brand || "-"}
                        </td>

                        {/* Origin */}
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {row.origin || "-"}
                        </td>

                        {/* UoM */}
                        <td className="py-2.5 px-2 text-center text-muted-foreground font-mono text-[11px]">
                          {row.uom}
                        </td>

                        {/* Supplier (Only Supplier Name, no supplier code beneath) */}
                        <td className="py-2.5 px-3">
                          <span
                            className="font-medium text-foreground line-clamp-1"
                            title={row.supplier}
                          >
                            {row.supplier}
                          </span>
                        </td>

                        {/* MRR No. */}
                        <td className="py-2.5 px-3 font-mono">
                          <span className="font-semibold text-foreground block">
                            {row.mrrNo}
                          </span>
                          <span
                            className="text-[10px] text-muted-foreground font-sans block"
                            title={`PO/WO Reference: ${row.poWoNo}`}
                          >
                            {row.poWoNo}
                          </span>
                        </td>

                        {/* Warranty Type (Only Warranty Type, no warranty period beneath) */}
                        <td className="py-2.5 px-3">
                          <div
                            className="inline-flex items-center gap-1.5 font-semibold text-foreground max-w-[170px]"
                            title={`${row.warrantyType} (${row.totalWarrantyPeriod}) - ${row.remarks || "No remarks"}`}
                          >
                            <ShieldCheck className="size-3 text-primary shrink-0" />
                            <span className="truncate">{row.warrantyType}</span>
                          </div>
                        </td>

                        {/* Warranty Start Date */}
                        <td className="py-2.5 px-3 text-center font-mono text-[11px] text-muted-foreground">
                          {row.warrantyStartDate}
                        </td>

                        {/* Warranty End Date */}
                        <td className="py-2.5 px-3 text-center font-mono text-[11px] font-semibold text-foreground">
                          {row.warrantyEndDate}
                        </td>

                        {/* Remaining Days */}
                        <td className="py-2.5 px-3 text-center">
                          {status === "Upcoming" ? (
                            <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
                              {row.formattedRemainingDays}
                            </span>
                          ) : remaining < 0 ? (
                            <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
                              {row.formattedRemainingDays}
                            </span>
                          ) : remaining <= 30 ? (
                            <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap">
                              {row.formattedRemainingDays}
                            </span>
                          ) : (
                            <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                              {row.formattedRemainingDays}
                            </span>
                          )}
                        </td>

                        {/* Warranty Status Badge */}
                        <td className="py-2.5 px-3 text-center">
                          {status === "Active" && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          )}
                          {status === "Expiring Soon" && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/35">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Expiring Soon
                            </span>
                          )}
                          {status === "Expired" && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              Expired
                            </span>
                          )}
                          {status === "Upcoming" && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              Upcoming
                            </span>
                          )}
                        </td>

                        {/* Attachment Button */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setAttachmentModalItem(row)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border/80 transition-colors shadow-2xs cursor-pointer"
                            title="View & Download Attachments"
                          >
                            <Paperclip className="size-3 text-primary shrink-0" />
                            <span>Attachment</span>
                            {row.attachments && row.attachments.length > 0 && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-mono font-bold">
                                {row.attachments.length}
                              </span>
                            )}
                          </button>
                        </td>

                        {/* Action: View (Navigates directly to MRR transaction, no extra modal) */}
                        <td className="py-2.5 px-3 text-center sticky right-0 bg-card/95 backdrop-blur-xs border-l border-border/70 shadow-xs">
                          <button
                            type="button"
                            onClick={() => {
                              if (row.receiveType === "Direct Receive") {
                                navigate({
                                  to: "/inv-receive-direct",
                                  search: { id: row.mrrNo, mode: "view" } as any,
                                });
                              } else {
                                navigate({
                                  to: "/inv-receive-mrr",
                                  search: {
                                    receiveNo: row.mrrNo,
                                    poNumber: row.poWoNo,
                                    mode: "view",
                                  } as any,
                                });
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs transition-colors cursor-pointer"
                            title="Open Material Receive / MRR Transaction"
                          >
                            <Eye className="size-3" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={15} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ShieldAlert className="size-8 text-muted-foreground/40" />
                          <p className="text-sm font-semibold text-foreground">
                            No warranty records match your criteria.
                          </p>
                          <p className="text-xs text-muted-foreground max-w-md">
                            Try adjusting your filters, clearing the search query, or switching the quick status filter tab.
                          </p>
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer"
                          >
                            <RotateCcw className="size-3" />
                            Reset All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Attachment Modal */}
      {attachmentModalItem && (
        <WarrantyAttachmentModal
          item={attachmentModalItem}
          onClose={() => setAttachmentModalItem(null)}
          onDownload={(att) =>
            handleDownloadAttachmentFile(att, attachmentModalItem)
          }
        />
      )}

      {/* Standard PDF Print Preview Modal */}
      {isPdfModalOpen && pdfReportData && (
        <StandardPreviewReportModal
          data={pdfReportData}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Attachment Modal Component ─────────────────────────────────────────────

interface WarrantyAttachmentModalProps {
  item: WarrantyRegisterItem;
  onClose: () => void;
  onDownload: (att: WarrantyAttachment) => void;
}

function WarrantyAttachmentModal({
  item,
  onClose,
  onDownload,
}: WarrantyAttachmentModalProps) {
  const attachments = item.attachments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Paperclip className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Transaction Attachments
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                  {attachments.length} {attachments.length === 1 ? "file" : "files"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                MRR: <span className="font-bold text-foreground">{item.mrrNo}</span> &bull; Item:{" "}
                <span className="text-foreground">{item.itemName}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {attachments.length > 0 ? (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-muted-foreground font-semibold text-[11px]">
                    <th className="py-2.5 px-3 text-center w-10">SL</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Document Name</th>
                    <th className="py-2.5 px-3 text-center w-24">Type</th>
                    <th className="py-2.5 px-3 text-center w-24">Size</th>
                    <th className="py-2.5 px-3 text-center w-28">Upload Date</th>
                    <th className="py-2.5 px-3 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {attachments.map((att, idx) => {
                    const typeCat = getAttachmentTypeCategory(att.name);
                    return (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 text-center text-muted-foreground font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className="font-medium text-foreground block truncate max-w-[240px]"
                            title={att.name}
                          >
                            {att.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {typeCat === "pdf" ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
                              PDF
                            </span>
                          ) : typeCat === "word" ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                              DOC
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground border border-border uppercase">
                              FILE
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-muted-foreground text-[11px]">
                          {att.size || "1.5 MB"}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-muted-foreground text-[11px]">
                          {att.uploadDate || item.receiveDate}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onDownload(att)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs transition-colors cursor-pointer"
                            title={`Download ${att.name}`}
                          >
                            <Download className="size-3" />
                            <span>Download</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
              <Paperclip className="size-6 mx-auto mb-2 text-muted-foreground/40" />
              <p className="font-semibold text-foreground text-sm">
                No Attachments Found
              </p>
              <p className="mt-1 max-w-sm mx-auto text-muted-foreground">
                No physical or digital warranty document was attached to this item during Material Receive / MRR transaction.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">
            Supplier: <span className="font-semibold text-foreground">{item.supplier}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
