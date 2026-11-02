import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  PackageOpen,
  ArrowRight,
  Filter,
  Search,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  User,
  Clock,
  CheckCircle2,
  Layers,
  FileSpreadsheet,
  X,
  History,
  FileText,
  Eye,
} from "lucide-react";
import {
  MaterialRequisition,
  MaterialIssue,
  getStoredMaterialRequisitions,
  setStoredMaterialRequisitions,
  getStoredMaterialIssues,
} from "@/lib/inventory-requisition-issue-data";
import { DEFAULT_WAREHOUSES, getStoredData } from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-issue-list")({
  head: () => ({
    meta: [
      { title: "Material Issue List — Inventory ERP" },
      {
        name: "description",
        content: "Track approved requisitions pending issue, partial issues, and remaining quantities.",
      },
    ],
  }),
  component: MaterialIssueListPage,
});

function MaterialIssueListPage() {
  const navigate = useNavigate();

  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(() =>
    getStoredMaterialRequisitions()
  );
  const [issuedRecords] = useState<MaterialIssue[]>(() => getStoredMaterialIssues());

  useEffect(() => {
    setStoredMaterialRequisitions(requisitions);
  }, [requisitions]);

  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  // Tabs: "pending" (Approved with pending or partial issue) vs "all" (All approved/issued MRs)
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [mrIdFilter, setMrIdFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [requestedByFilter, setRequestedByFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Preview Report & Issue View State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetMR, setReportTargetMR] = useState<MaterialRequisition | null>(null);
  const [viewingIssue, setViewingIssue] = useState<MaterialIssue | null>(null);

  // State for Requisition-wise Material Issue History Modal ("D" button)
  const [selectedReqForIssues, setSelectedReqForIssues] = useState<MaterialRequisition | null>(null);
  const [isIssueHistoryModalOpen, setIsIssueHistoryModalOpen] = useState(false);

  const reqMatchingIssues = useMemo(() => {
    if (!selectedReqForIssues) return [];
    return issuedRecords.filter(
      (iss) =>
        iss.mrId === selectedReqForIssues.id || iss.mrNumber === selectedReqForIssues.mrNumber
    );
  }, [issuedRecords, selectedReqForIssues]);

  const handleViewMR = (mr: MaterialRequisition) => {
    const existing = issuedRecords.find(
      (iss) => iss.mrNumber === mr.mrNumber || iss.mrId === mr.id
    );
    navigate({
      to: "/inv-issue-regular",
      search: {
        mrId: mr.id,
        issueId: existing?.id,
        mode: "view",
      },
    });
  };

  // Distinct Departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    requisitions.forEach((r) => r.department && set.add(r.department));
    return Array.from(set);
  }, [requisitions]);

  // Approved Requisitions eligible for issue
  const eligibleRequisitions = useMemo(() => {
    return requisitions.filter((mr) => {
      // Must be approved, partially issued, or fully issued
      const isEligibleStatus =
        mr.status === "Approved" ||
        mr.status === "Partially Issued" ||
        mr.status === "Fully Issued";

      if (!isEligibleStatus) return false;

      // Pending tab: Only shows MRs with remaining issue quantity > 0
      if (activeTab === "pending") {
        if (mr.remainingQuantity <= 0) return false;
      }

      // Quick search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          mr.mrNumber.toLowerCase().includes(q) ||
          mr.department.toLowerCase().includes(q) ||
          mr.requestedBy.toLowerCase().includes(q) ||
          mr.warehouseStore.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (mrIdFilter.trim() && !mr.mrNumber.toLowerCase().includes(mrIdFilter.toLowerCase())) {
        return false;
      }
      if (fromDate && mr.requisitionDate < fromDate) {
        return false;
      }
      if (toDate && mr.requisitionDate > toDate) {
        return false;
      }
      if (departmentFilter !== "All" && mr.department !== departmentFilter) {
        return false;
      }
      if (
        requestedByFilter.trim() &&
        !mr.requestedBy.toLowerCase().includes(requestedByFilter.toLowerCase())
      ) {
        return false;
      }
      if (warehouseFilter !== "All" && mr.warehouseStore !== warehouseFilter) {
        return false;
      }
      if (statusFilter !== "All") {
        const derived =
          mr.issuedQuantity === 0
            ? "Pending Issue"
            : mr.remainingQuantity > 0
            ? "Partially Issued"
            : "Fully Issued";
        if (derived !== statusFilter) return false;
      }

      return true;
    });
  }, [
    requisitions,
    activeTab,
    searchQuery,
    mrIdFilter,
    fromDate,
    toDate,
    departmentFilter,
    requestedByFilter,
    warehouseFilter,
    statusFilter,
  ]);

  // Derived Status Label & Badge
  const getDerivedIssueStatus = (mr: MaterialRequisition) => {
    if (mr.issuedQuantity === 0) {
      return {
        label: "Pending Issue",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
      };
    }
    if (mr.remainingQuantity > 0) {
      return {
        label: "Partially Issued",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    return {
      label: "Fully Issued",
      badge: "bg-purple-50 text-purple-700 border-purple-200",
    };
  };

  const pendingIssueCount = useMemo(() => {
    return requisitions.filter(
      (r) =>
        (r.status === "Approved" || r.status === "Partially Issued") && r.remainingQuantity > 0
    ).length;
  }, [requisitions]);

  // Preview Report Data
  const previewReportData: StandardReportData = useMemo(() => {
    if (!reportTargetMR) {
      return {
        companyName: "Pakiza Knit Composite Ltd",
        companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
        reportTitle: "MATERIAL ISSUE DISPATCH SUMMARY",
        reportNumber: "ISS-PREVIEW",
        reportDate: new Date().toISOString().slice(0, 10),
        statusBadge: "Draft",
        metaFields: [],
        tableHeaders: [],
        tableRows: [],
      };
    }
    const issueStatus = getDerivedIssueStatus(reportTargetMR);
    return {
      companyName: reportTargetMR.organization || "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "MATERIAL ISSUE DISPATCH REPORT",
      reportNumber: reportTargetMR.mrNumber,
      reportDate: reportTargetMR.requisitionDate,
      statusBadge: issueStatus.label,
      metaFields: [
        { label: "Department", value: reportTargetMR.department },
        { label: "Requested By", value: reportTargetMR.requestedBy },
        { label: "Warehouse / Store", value: reportTargetMR.warehouseStore },
        { label: "Required Date", value: reportTargetMR.requiredDate },
        { label: "Approved Date", value: reportTargetMR.approvedDate || "-" },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "UOM",
        "REQ QTY",
        "ISSUED QTY",
        "REMAINING QTY",
        "AVL STOCK",
        "REMARKS",
      ],
      tableRows: reportTargetMR.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.requestedQuantity),
        String(it.issuedQuantity || 0),
        String(it.remainingQuantity),
        String(it.availableStock),
        it.remarks || "-",
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTargetMR.totalItems) },
        { label: "Requested Qty", value: String(reportTargetMR.requestedQuantity) },
        { label: "Issued Qty", value: String(reportTargetMR.issuedQuantity) },
        { label: "Remaining Qty", value: String(reportTargetMR.remainingQuantity) },
      ],
      notes: [
        `Requisition authorized on ${reportTargetMR.approvedDate || reportTargetMR.requisitionDate}.`,
        reportTargetMR.remainingQuantity > 0
          ? `Pending issue balance: ${reportTargetMR.remainingQuantity} units eligible for store dispatch.`
          : "Requisition fully issued.",
      ],
      signatures: [
        { title: "Store Officer", name: "Warehouse Dispatcher", date: "-" },
        { title: "Received By", name: reportTargetMR.requestedBy, date: "-" },
      ],
    };
  }, [reportTargetMR]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                <PackageOpen className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                  Material Issue List
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Primary store dispatch queue for approved Material Requisitions with pending or partial issues
                </p>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "pending"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Pending / Partial Issue</span>
                {pendingIssueCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                    {pendingIssueCount}
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
                <span>All Requisitions</span>
                <span className="text-[10px] text-slate-400">
                  (
                  {
                    requisitions.filter(
                      (r) =>
                        r.status === "Approved" ||
                        r.status === "Partially Issued" ||
                        r.status === "Fully Issued"
                    ).length
                  }
                  )
                </span>
              </button>
            </div>
          </div>

          {/* Store-wise Filter Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-indigo-600" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Store-Wise Filters & Search Criteria
                </h2>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {eligibleRequisitions.length} eligible requisitions
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setMrIdFilter("");
                  setFromDate("");
                  setToDate("");
                  setDepartmentFilter("All");
                  setRequestedByFilter("");
                  setWarehouseFilter("All");
                  setStatusFilter("All");
                }}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <History className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              {/* Warehouse / Store */}
              <div>
                <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Warehouse / Store *
                </label>
                <select
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-indigo-50/30 border-2 border-indigo-500/20 rounded-xl font-bold text-xs text-slate-800 outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
                >
                  <option value="All">All Delivery Stores / Warehouses</option>
                  {warehouses.map((wh: any) => (
                    <option key={wh.id} value={wh.storeName}>
                      {wh.storeName} ({wh.storeCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Requisition ID */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requisition ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. MR-2026-0001"
                  value={mrIdFilter}
                  onChange={(e) => setMrIdFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium outline-none font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium outline-none text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Requested By */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requested By
                </label>
                <input
                  type="text"
                  placeholder="Requester name..."
                  value={requestedByFilter}
                  onChange={(e) => setRequestedByFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium outline-none text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Requisition Date From */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requisition Date From
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Requisition Date To */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requisition Date To
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Issue Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium outline-none text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Issue">Pending Issue (0 issued)</option>
                  <option value="Partially Issued">Partially Issued</option>
                  <option value="Fully Issued">Fully Issued</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Card (Pending / Requisitions view) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100">
              <span className="text-sm font-black text-slate-800">
                {activeTab === "pending"
                  ? "Requisitions Pending Material Issue"
                  : "All Approved Requisitions"}{" "}
                ({eligibleRequisitions.length})
              </span>

              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by MR, Dept, Requester..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3.5 text-center w-12">SL</th>
                    <th className="py-3 px-3.5">Requisition ID</th>
                    <th className="py-3 px-3.5">Requisition Date</th>
                    <th className="py-3 px-3.5">Department</th>
                    <th className="py-3 px-3.5">Requested By</th>
                    <th className="py-3 px-3.5 text-center">Total Items</th>
                    <th className="py-3 px-3.5 text-right">Requested Qty</th>
                    <th className="py-3 px-3.5 text-right">Previously Issued</th>
                    <th className="py-3 px-3.5 text-right font-black">Remaining Issue Qty</th>
                    <th className="py-3 px-3.5 text-center font-bold w-14">View</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center sticky right-0 bg-slate-50 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {eligibleRequisitions.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CheckCircle2 className="size-8 text-indigo-300 stroke-[1.5]" />
                          <p className="text-xs font-semibold text-slate-600">
                            No requisitions pending issue
                          </p>
                          <p className="text-[10px] text-slate-400">
                            All authorized material requisitions have been fully dispatched.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    eligibleRequisitions.map((mr, idx) => {
                      const issueStatus = getDerivedIssueStatus(mr);
                      const canIssue = mr.remainingQuantity > 0;

                      return (
                        <tr
                          key={mr.id}
                          className="hover:bg-slate-50/70 transition-colors group whitespace-nowrap"
                        >
                          <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="font-bold text-blue-600 font-mono">
                              {mr.mrNumber}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-slate-600 font-mono">
                            {mr.requisitionDate}
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-slate-800">
                            {mr.department}
                          </td>
                          <td className="py-3 px-3.5 text-slate-800">{mr.requestedBy}</td>
                          <td className="py-3 px-3.5 text-center font-bold font-mono">
                            {mr.totalItems}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-slate-900 font-mono">
                            {mr.requestedQuantity.toLocaleString()}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-indigo-600 font-mono">
                            {mr.issuedQuantity.toLocaleString()}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-amber-600 font-mono">
                            {mr.remainingQuantity.toLocaleString()}
                          </td>
                          {/* View Column with "D" Button */}
                          <td className="py-3 px-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReqForIssues(mr);
                                setIsIssueHistoryModalOpen(true);
                              }}
                              className="size-7 rounded-lg bg-indigo-500/10 hover:bg-indigo-600 text-indigo-600 hover:text-white font-black text-xs transition-all shadow-2xs border border-indigo-500/30 inline-flex items-center justify-center cursor-pointer active:scale-95"
                              title={`View Material Issue history for ${mr.mrNumber}`}
                            >
                              D
                            </button>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold border ${issueStatus.badge}`}
                            >
                              {issueStatus.label}
                            </span>
                          </td>

                          {/* Action Column (Issue and Print buttons only - Eye icon removed per requirements) */}
                          <td className="py-3 px-3.5 text-center sticky right-0 bg-white group-hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center justify-center gap-1.5">
                              {canIssue ? (
                                <Link
                                  to="/inv-issue-regular"
                                  search={{ mrId: mr.id }}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                                >
                                  <PackageOpen className="size-3.5" />
                                  Issue
                                </Link>
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-400">
                                  Dispatched
                                </span>
                              )}

                              <button
                                title="Print Summary Note"
                                onClick={() => {
                                  setReportTargetMR(mr);
                                  setPreviewReportOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
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
        </div>

        {/* Issue History Modal (Triggered by "D" button in View Column) */}
        {isIssueHistoryModalOpen && selectedReqForIssues && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                    <History className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Material Issue History
                    </h3>
                    <p className="text-xs text-slate-500">
                      Requisition Number:{" "}
                      <span className="font-mono font-bold text-indigo-600">
                        {selectedReqForIssues.mrNumber}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsIssueHistoryModalOpen(false);
                    setSelectedReqForIssues(null);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Issues List Table */}
              {reqMatchingIssues.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                        <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                        <th className="py-2.5 px-4 font-bold">Issue ID</th>
                        <th className="py-2.5 px-4 font-bold">Issue Date</th>
                        <th className="py-2.5 px-3 text-center font-bold w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reqMatchingIssues.map((iss, rIdx) => (
                        <tr key={iss.id || rIdx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-bold">
                            {rIdx + 1}
                          </td>
                          <td className="py-2.5 px-4">
                            <button
                              type="button"
                              onClick={() => {
                                setIsIssueHistoryModalOpen(false);
                                navigate({
                                  to: "/inv-issue-regular",
                                  search: {
                                    mrId: selectedReqForIssues.id,
                                    issueId: iss.id,
                                    mode: "edit",
                                  },
                                });
                              }}
                              className="font-mono font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title={`Open ${iss.issueNumber} in Edit Mode`}
                            >
                              <span>{iss.issueNumber}</span>
                              <ArrowRight className="size-3" />
                            </button>
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 font-medium font-mono">
                            {iss.issueDate}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setIsIssueHistoryModalOpen(false);
                                navigate({
                                  to: "/inv-issue-regular",
                                  search: {
                                    mrId: selectedReqForIssues.id,
                                    issueId: iss.id,
                                    mode: "view",
                                  },
                                });
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                              title="View Material Issue (Read-Only Mode)"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <PackageOpen className="size-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-600">
                    No Material Issue transactions found
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    No issue transactions have been posted yet for Requisition{" "}
                    {selectedReqForIssues.mrNumber}.
                  </p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsIssueHistoryModalOpen(false);
                    setSelectedReqForIssues(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Material Issue Details View Modal */}
        {viewingIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    <PackageOpen className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base">
                        Material Issue Details
                      </h3>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {viewingIssue.issueNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {viewingIssue.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Store dispatch slip details against Requisition {viewingIssue.mrNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingIssue(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Meta details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Requisition ID
                    </span>
                    <span className="font-mono font-bold text-blue-600 text-xs mt-0.5 block">
                      {viewingIssue.mrNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Issue Date
                    </span>
                    <span className="font-mono font-medium text-slate-700 text-xs mt-0.5 block">
                      {viewingIssue.issueDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Department
                    </span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                      {viewingIssue.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Issued To
                    </span>
                    <span className="font-medium text-slate-800 text-xs mt-0.5 block">
                      {viewingIssue.issuedTo}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Warehouse / Store
                    </span>
                    <span className="font-medium text-slate-800 text-xs mt-0.5 block">
                      {viewingIssue.warehouseStore}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Items
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">
                      {viewingIssue.totalItems}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Dispatched
                    </span>
                    <span className="font-mono font-bold text-indigo-600 text-xs mt-0.5 block">
                      {viewingIssue.totalIssueQty.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Dispatched Items
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                          <th className="py-2.5 px-3 text-center w-10">SL</th>
                          <th className="py-2.5 px-3">Item Code</th>
                          <th className="py-2.5 px-3">Item Description</th>
                          <th className="py-2.5 px-3 text-center">UOM</th>
                          <th className="py-2.5 px-3 text-right">Requested Qty</th>
                          <th className="py-2.5 px-3 text-right text-indigo-700 font-bold">
                            Issued Qty
                          </th>
                          <th className="py-2.5 px-3">Batch / Location</th>
                          <th className="py-2.5 px-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {viewingIssue.items.map((it, i) => (
                          <tr key={it.id || i} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 text-center text-slate-400 font-mono text-[10px]">
                              {i + 1}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-blue-600">
                              {it.itemCode}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-800">
                              {it.itemName}
                              {it.specification && (
                                <p className="text-[10px] text-slate-400 font-normal">
                                  {it.specification}
                                </p>
                              )}
                            </td>
                            <td className="py-2 px-3 text-center font-mono text-slate-600">
                              {it.uom}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-600">
                              {(it.mrRequestedQty || 0).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-indigo-600">
                              {it.issueQty.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-slate-600 font-mono text-[10px]">
                              {it.batchAllocations && it.batchAllocations.length > 0
                                ? it.batchAllocations.map((b) => `Batch: ${b.batchNumber} (${b.quantity})`).join(", ")
                                : it.locationAllocations && it.locationAllocations.length > 0
                                ? it.locationAllocations.map((l) => `Loc: ${l.locationName} (${l.quantity})`).join(", ")
                                : "-"}
                            </td>
                            <td className="py-2 px-3 text-slate-500">
                              {it.remarks || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-800">
                          <td colSpan={5} className="py-2 px-3 text-right text-[10px] uppercase tracking-wider">
                            Total Dispatched:
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-indigo-600">
                            {viewingIssue.totalIssueQty.toLocaleString()}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {viewingIssue.remarks && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Dispatch Remarks
                    </span>
                    <p className="text-xs text-slate-700">{viewingIssue.remarks}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setViewingIssue(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
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
