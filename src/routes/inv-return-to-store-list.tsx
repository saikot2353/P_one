import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  RotateCcw,
  Search,
  Filter,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  User,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  History,
  X,
  FileSpreadsheet,
  Eye,
} from "lucide-react";
import {
  MaterialIssue,
  StoreReturn,
  getStoredMaterialIssues,
  getStoredStoreReturns,
} from "@/lib/inventory-requisition-issue-data";
import { DEFAULT_WAREHOUSES, getStoredData } from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-return-to-store-list")({
  head: () => ({
    meta: [
      { title: "Return to Store List — Inventory ERP" },
      {
        name: "description",
        content: "Receiver and department-wise register of issued items eligible for store return.",
      },
    ],
  }),
  component: ReturnToStoreListPage,
});

function ReturnToStoreListPage() {
  const navigate = useNavigate();

  const [issues] = useState<MaterialIssue[]>(() => getStoredMaterialIssues());
  const [returns] = useState<StoreReturn[]>(() => getStoredStoreReturns());
  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  // Tabs: "eligible" (Eligible issues with returnable qty > 0) vs "all" vs "returns" (Return slips history)
  const [activeTab, setActiveTab] = useState<"eligible" | "all" | "returns">("eligible");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [issueIdFilter, setIssueIdFilter] = useState("");
  const [mrIdFilter, setMrIdFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [fromIssueDateFilter, setFromIssueDateFilter] = useState("");
  const [toIssueDateFilter, setToIssueDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Issuer Return History Modal State (D Button)
  const [issuerHistoryModalOpen, setIssuerHistoryModalOpen] = useState(false);
  const [selectedIssuerIssue, setSelectedIssuerIssue] = useState<MaterialIssue | null>(null);

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetIssue, setReportTargetIssue] = useState<MaterialIssue | null>(null);

  // Departments for dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    issues.forEach((i) => i.department && set.add(i.department));
    return Array.from(set);
  }, [issues]);

  // Unique item names for Item Name filter suggestions
  const allUniqueItemNames = useMemo(() => {
    const set = new Set<string>();
    issues.forEach((i) => {
      i.items?.forEach((it) => {
        if (it.itemName) set.add(it.itemName);
      });
    });
    return Array.from(set).sort();
  }, [issues]);

  // Issuer returns for D button modal
  const matchedIssuerReturns = useMemo(() => {
    if (!selectedIssuerIssue) return [];
    const emp = (selectedIssuerIssue.issuedTo || "").toLowerCase().trim();
    const empId = (selectedIssuerIssue.employeeId || "").toLowerCase().trim();
    const issId = selectedIssuerIssue.id;
    const issNum = (selectedIssuerIssue.issueNumber || "").toLowerCase().trim();

    return returns.filter((ret) => {
      const retEmp = (ret.issuedTo || "").toLowerCase().trim();
      const retEmpId = (ret.employeeId || "").toLowerCase().trim();
      const retIssId = ret.issueId;
      const retIssNum = (ret.issueNumber || "").toLowerCase().trim();

      const sameEmp =
        (emp && retEmp && (retEmp.includes(emp) || emp.includes(retEmp))) ||
        (empId && retEmpId && retEmpId === empId);
      const sameIssue =
        (issId && retIssId && retIssId === issId) ||
        (issNum && retIssNum && retIssNum === issNum);

      return sameEmp || sameIssue;
    });
  }, [selectedIssuerIssue, returns]);

  // Eligible Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      const returnable =
        iss.returnableQty !== undefined
          ? iss.returnableQty
          : Math.max(0, iss.totalIssueQty - (iss.previouslyReturnedQty || 0));

      if (activeTab === "eligible" && returnable <= 0) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          iss.issueNumber.toLowerCase().includes(q) ||
          iss.mrNumber.toLowerCase().includes(q) ||
          iss.issuedTo.toLowerCase().includes(q) ||
          iss.department.toLowerCase().includes(q) ||
          iss.warehouseStore.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (issueIdFilter.trim() && !iss.issueNumber.toLowerCase().includes(issueIdFilter.toLowerCase())) {
        return false;
      }
      if (mrIdFilter.trim() && !iss.mrNumber.toLowerCase().includes(mrIdFilter.toLowerCase())) {
        return false;
      }
      if (employeeFilter.trim() && !iss.issuedTo.toLowerCase().includes(employeeFilter.toLowerCase())) {
        return false;
      }
      if (itemNameFilter.trim()) {
        const q = itemNameFilter.trim().toLowerCase();
        const hasMatchingItem = iss.items?.some(
          (it) =>
            it.itemName.toLowerCase().includes(q) ||
            (it.itemCode && it.itemCode.toLowerCase().includes(q))
        );
        if (!hasMatchingItem) return false;
      }
      if (departmentFilter !== "All" && iss.department !== departmentFilter) {
        return false;
      }
      if (warehouseFilter !== "All" && iss.warehouseStore !== warehouseFilter) {
        return false;
      }
      if (fromIssueDateFilter && iss.issueDate < fromIssueDateFilter) {
        return false;
      }
      if (toIssueDateFilter && iss.issueDate > toIssueDateFilter) {
        return false;
      }
      if (statusFilter !== "All") {
        const derivedStatus =
          returnable === 0
            ? "Fully Returned"
            : (iss.previouslyReturnedQty || 0) > 0
            ? "Partially Returned"
            : "Eligible for Return";
        if (derivedStatus !== statusFilter) return false;
      }

      return true;
    });
  }, [
    issues,
    activeTab,
    searchQuery,
    issueIdFilter,
    mrIdFilter,
    employeeFilter,
    itemNameFilter,
    departmentFilter,
    warehouseFilter,
    fromIssueDateFilter,
    toIssueDateFilter,
    statusFilter,
  ]);

  const eligibleCount = useMemo(() => {
    return issues.filter((i) => {
      const returnable =
        i.returnableQty !== undefined
          ? i.returnableQty
          : Math.max(0, i.totalIssueQty - (i.previouslyReturnedQty || 0));
      return returnable > 0;
    }).length;
  }, [issues]);

  // Derived Return Status
  const getDerivedReturnStatus = (iss: MaterialIssue) => {
    const returnable =
      iss.returnableQty !== undefined
        ? iss.returnableQty
        : Math.max(0, iss.totalIssueQty - (iss.previouslyReturnedQty || 0));

    if (returnable === 0) {
      return {
        label: "Fully Returned",
        badge: "bg-purple-50 text-purple-700 border-purple-200",
      };
    }
    if ((iss.previouslyReturnedQty || 0) > 0) {
      return {
        label: "Partially Returned",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    return {
      label: "Eligible for Return",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  };

  // Preview Report Data
  const previewReportData: StandardReportData = useMemo(() => {
    if (!reportTargetIssue) {
      return {
        companyName: "Pakiza Knit Composite Ltd",
        companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
        reportTitle: "RETURN TO STORE ELIGIBILITY REPORT",
        reportNumber: "RET-PREVIEW",
        reportDate: new Date().toISOString().slice(0, 10),
        statusBadge: "Active",
        metaFields: [],
        tableHeaders: [],
        tableRows: [],
      };
    }
    const derived = getDerivedReturnStatus(reportTargetIssue);
    return {
      companyName: reportTargetIssue.organization || "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "STORE RETURN ELIGIBILITY LEDGER",
      reportNumber: reportTargetIssue.issueNumber,
      reportDate: reportTargetIssue.issueDate,
      statusBadge: derived.label,
      metaFields: [
        { label: "Material Issue ID", value: reportTargetIssue.issueNumber },
        { label: "Material Requisition ID", value: reportTargetIssue.mrNumber },
        { label: "Issued To", value: reportTargetIssue.issuedTo },
        { label: "Employee ID", value: reportTargetIssue.employeeId || "EMP-00142" },
        { label: "Department", value: reportTargetIssue.department },
        { label: "Warehouse / Store", value: reportTargetIssue.warehouseStore },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "UOM",
        "ORIGINAL ISSUED",
        "PREV RETURNED",
        "RETURNABLE QTY",
        "UNIT PRICE",
      ],
      tableRows: reportTargetIssue.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.issueQty),
        "0",
        String(it.issueQty),
        String(it.unitPrice || 0),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTargetIssue.totalItems) },
        { label: "Total Issued Qty", value: String(reportTargetIssue.totalIssueQty) },
        {
          label: "Returnable Qty",
          value: String(reportTargetIssue.returnableQty || reportTargetIssue.totalIssueQty),
        },
      ],
      notes: [
        `Materials originally dispatched under Issue ${reportTargetIssue.issueNumber}.`,
        "Unconsumed or excess materials may be returned to store using Return to Store action.",
      ],
      signatures: [
        { title: "Employee / Holder", name: reportTargetIssue.issuedTo, date: "-" },
        { title: "Store Receiving Officer", name: "Store Officer", date: "-" },
      ],
    };
  }, [reportTargetIssue]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 font-bold shadow-sm">
                <RotateCcw className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                  Return to Store List
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  User and receiver-wise registry of issued items eligible for store return
                </p>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab("eligible")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "eligible"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Eligible for Return</span>
                {eligibleCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-600 text-white">
                    {eligibleCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "all"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>All Issues</span>
                <span className="text-[10px] text-slate-400">({issues.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("returns")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "returns"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <PackageCheck className="size-3.5" />
                <span>Return Slips</span>
                <span className="text-[10px] text-slate-400">({returns.length})</span>
              </button>
            </div>
          </div>

          {/* Filter Section Accordion */}
          {activeTab !== "returns" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Filter className="size-4 text-orange-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Return Queue Filters
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {filteredIssues.length} issues found
                  </span>
                </div>
                <ChevronDown
                  className={`size-4 text-slate-400 transition-transform duration-200 ${
                    isFiltersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFiltersOpen && (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* 1. Material Issue ID */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Material Issue ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ISS-2026-0001"
                        value={issueIdFilter}
                        onChange={(e) => setIssueIdFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>

                    {/* 2. MR ID */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        MR ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MR-2026-0001"
                        value={mrIdFilter}
                        onChange={(e) => setMrIdFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>

                    {/* 3. Employee / Issued To */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Employee / Issued To
                      </label>
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={employeeFilter}
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>

                    {/* 4. Item Name (Added after Employee / Issued To) */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        list="return-queue-items-list"
                        placeholder="Search item name or code..."
                        value={itemNameFilter}
                        onChange={(e) => setItemNameFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                      <datalist id="return-queue-items-list">
                        {allUniqueItemNames.map((name) => (
                          <option key={name} value={name} />
                        ))}
                      </datalist>
                    </div>

                    {/* 5. Department */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Department
                      </label>
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <option value="All">All Departments</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 6. Warehouse / Store */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Warehouse / Store
                      </label>
                      <select
                        value={warehouseFilter}
                        onChange={(e) => setWarehouseFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <option value="All">All Warehouses</option>
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.name}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 7. From Issue Date */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        From Issue Date
                      </label>
                      <input
                        type="date"
                        value={fromIssueDateFilter}
                        onChange={(e) => setFromIssueDateFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>

                    {/* 8. To Issue Date */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        To Issue Date
                      </label>
                      <input
                        type="date"
                        value={toIssueDateFilter}
                        onChange={(e) => setToIssueDateFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>

                    {/* 9. Status */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Eligible for Return">Eligible for Return</option>
                        <option value="Partially Returned">Partially Returned</option>
                        <option value="Fully Returned">Fully Returned</option>
                      </select>
                    </div>

                    {/* 10. Reset Filters Action Button */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setIssueIdFilter("");
                          setMrIdFilter("");
                          setEmployeeFilter("");
                          setItemNameFilter("");
                          setDepartmentFilter("All");
                          setWarehouseFilter("All");
                          setFromIssueDateFilter("");
                          setToIssueDateFilter("");
                          setStatusFilter("All");
                        }}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="size-3.5 text-slate-400" />
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Table Card (Eligible Issues) */}
          {activeTab !== "returns" ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100">
                <span className="text-sm font-black text-slate-800">
                  {activeTab === "eligible"
                    ? "Issued Materials Eligible for Return"
                    : "All Material Issues"}{" "}
                  ({filteredIssues.length})
                </span>

                <div className="relative flex-1 sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search receiver, issue ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      <th className="py-3 px-3.5 text-center w-12">SL</th>
                      <th className="py-3 px-3.5">Material Issue ID</th>
                      <th className="py-3 px-3.5">Material Requisition ID</th>
                      <th className="py-3 px-3.5">Issue Date</th>
                      <th className="py-3 px-3.5">Department</th>
                      <th className="py-3 px-3.5">Issued To</th>
                      <th className="py-3 px-3 text-center">Details</th>
                      <th className="py-3 px-3.5 text-center">Total Items</th>
                      <th className="py-3 px-3.5 text-right">Issued Quantity</th>
                      <th className="py-3 px-3.5 text-right">Prev Returned</th>
                      <th className="py-3 px-3.5 text-right font-black text-orange-700">
                        Returnable Qty
                      </th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                      <th className="py-3 px-3.5 text-center sticky right-0 bg-slate-50 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredIssues.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <CheckCircle2 className="size-8 text-orange-300 stroke-[1.5]" />
                            <p className="text-xs font-semibold text-slate-600">
                              No issued materials found
                            </p>
                            <p className="text-[10px] text-slate-400">
                              All issued items have either been fully returned or accounted for.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredIssues.map((iss, idx) => {
                        const statusObj = getDerivedReturnStatus(iss);
                        const returnable =
                          iss.returnableQty !== undefined
                            ? iss.returnableQty
                            : Math.max(0, iss.totalIssueQty - (iss.previouslyReturnedQty || 0));
                        const canReturn = returnable > 0;

                        return (
                          <tr
                            key={iss.id}
                            className="hover:bg-slate-50/70 transition-colors group whitespace-nowrap"
                          >
                            <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[10px]">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="font-bold text-indigo-600 font-mono">
                                {iss.issueNumber}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 font-mono text-blue-600 font-bold">
                              {iss.mrNumber}
                            </td>
                            <td className="py-3 px-3.5 text-slate-600 font-mono">{iss.issueDate}</td>
                            <td className="py-3 px-3.5 font-semibold text-slate-800">
                              {iss.department}
                            </td>
                            <td className="py-3 px-3.5 text-slate-800 font-medium">
                              <div className="flex items-center gap-1.5">
                                <User className="size-3 text-slate-400" />
                                <span>{iss.issuedTo}</span>
                              </div>
                            </td>

                            {/* Details Column — D Button */}
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedIssuerIssue(iss);
                                  setIssuerHistoryModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-orange-100 hover:bg-orange-200 text-orange-700 font-black text-[11px] shadow-2xs border border-orange-200 hover:border-orange-300 transition-all cursor-pointer active:scale-95"
                                title={`View return history for ${iss.issuedTo}`}
                              >
                                D
                              </button>
                            </td>
                            <td className="py-3 px-3.5 text-center font-bold font-mono">
                              {iss.totalItems}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-slate-900 font-mono">
                              {iss.totalIssueQty.toLocaleString()}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-amber-600 font-mono">
                              {(iss.previouslyReturnedQty || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-orange-600 font-mono">
                              {returnable.toLocaleString()}
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold border ${statusObj.badge}`}
                              >
                                {statusObj.label}
                              </span>
                            </td>

                            {/* Action: RETURN TO STORE BUTTON */}
                            <td className="py-3 px-3.5 text-center sticky right-0 bg-white group-hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                              <div className="flex items-center justify-center gap-1.5">
                                {canReturn ? (
                                  <Link
                                    to="/inv-issue-return"
                                    search={{ issueId: iss.id }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                                  >
                                    <RotateCcw className="size-3.5" />
                                    Return to Store
                                  </Link>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-400">
                                    Completed
                                  </span>
                                )}

                                <button
                                  title="Print Ledger Report"
                                  onClick={() => {
                                    setReportTargetIssue(iss);
                                    setPreviewReportOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                >
                                  <Printer className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Tab: Confirmed Return Slips */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 flex justify-between items-center border-b border-slate-100">
                <span className="text-sm font-black text-slate-800">
                  Confirmed Return to Store Slips ({returns.length})
                </span>
                <Link
                  to="/inv-issue-return"
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  New Return Entry
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      <th className="py-3 px-3.5 text-center w-12">SL</th>
                      <th className="py-3 px-3.5">Return Number</th>
                      <th className="py-3 px-3.5">Return Date</th>
                      <th className="py-3 px-3.5">Material Issue ID</th>
                      <th className="py-3 px-3.5">MR ID</th>
                      <th className="py-3 px-3.5">Department</th>
                      <th className="py-3 px-3.5">Returned By (Employee)</th>
                      <th className="py-3 px-3.5">Warehouse / Store</th>
                      <th className="py-3 px-3.5 text-center">Items</th>
                      <th className="py-3 px-3.5 text-right font-black text-orange-600">
                        Total Return Qty
                      </th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {returns.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-10 text-center text-slate-400">
                          No return slips recorded yet.
                        </td>
                      </tr>
                    ) : (
                      returns.map((ret, idx) => (
                        <tr
                          key={ret.id}
                          className="hover:bg-slate-50/70 transition-colors whitespace-nowrap"
                        >
                          <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-orange-600">
                            {ret.returnNumber}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600">{ret.returnDate}</td>
                          <td className="py-3 px-3.5 font-mono text-indigo-600 font-bold">
                            {ret.issueNumber}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-blue-600 font-bold">
                            {ret.mrNumber}
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-slate-800">
                            {ret.department}
                          </td>
                          <td className="py-3 px-3.5 text-slate-800">{ret.issuedTo}</td>
                          <td className="py-3 px-3.5 max-w-[160px] truncate" title={ret.warehouseStore}>
                            {ret.warehouseStore}
                          </td>
                          <td className="py-3 px-3.5 text-center font-bold font-mono">
                            {ret.totalItems}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-orange-600">
                            {ret.totalReturnQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span className="px-2.5 py-1 rounded-full text-[9.5px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                              {ret.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Issuer Return History Modal (Triggered by 'D' Button) */}
        {issuerHistoryModalOpen && selectedIssuerIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
                    <History className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                      Issuer Return History
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Return records for <span className="font-semibold text-orange-300">{selectedIssuerIssue.issuedTo}</span> ({selectedIssuerIssue.department})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIssuerHistoryModalOpen(false);
                    setSelectedIssuerIssue(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Body: Return History Table */}
              <div className="p-6">
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-4 font-bold">Return ID</th>
                        <th className="py-2.5 px-4 font-bold">Date</th>
                        <th className="py-2.5 px-4 font-bold text-center w-28">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
                      {matchedIssuerReturns.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-10 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <RotateCcw className="size-7 text-slate-300" />
                              <p className="text-xs font-semibold text-slate-600">
                                No Return History Found
                              </p>
                              <p className="text-[10px] text-slate-400">
                                No previous store returns recorded for {selectedIssuerIssue.issuedTo}.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        matchedIssuerReturns.map((ret) => (
                          <tr key={ret.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Return ID — clicking opens Return to Store Entry form in Editable Mode */}
                            <td className="py-3 px-4">
                              <Link
                                to="/inv-issue-return"
                                search={{ returnId: ret.id, issueId: ret.issueId, mode: "edit" }}
                                className="font-mono font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1.5"
                                title="Open Return in Editable Mode"
                              >
                                <span>{ret.returnNumber}</span>
                                <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-orange-50 text-orange-600 border border-orange-200 font-sans font-semibold">
                                  Edit
                                </span>
                              </Link>
                            </td>

                            {/* Date — displays date on which material was returned */}
                            <td className="py-3 px-4 font-mono text-slate-600">
                              {ret.returnDate}
                            </td>

                            {/* Action — View button opens Return to Store Entry in View-Only Mode */}
                            <td className="py-3 px-4 text-center">
                              <Link
                                to="/inv-issue-return"
                                search={{ returnId: ret.id, issueId: ret.issueId, mode: "view" }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors shadow-2xs"
                                title="Open Return in View-Only Mode"
                              >
                                <Eye className="size-3.5 text-slate-500" />
                                <span>View</span>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Total return records: <strong className="text-slate-700">{matchedIssuerReturns.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIssuerHistoryModalOpen(false);
                    setSelectedIssuerIssue(null);
                  }}
                  className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Report Modal */}
        <StandardPreviewReportModal
          isOpen={previewReportOpen}
          onClose={() => setPreviewReportOpen(false)}
          data={previewReportData}
        />
      </main>
    </div>
  );
}
