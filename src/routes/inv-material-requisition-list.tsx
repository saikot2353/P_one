import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Send,
  XCircle,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  Warehouse,
  User,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import {
  MaterialRequisition,
  getStoredMaterialRequisitions,
  setStoredMaterialRequisitions,
  MRStatus,
} from "@/lib/inventory-requisition-issue-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";
import { DEFAULT_WAREHOUSES, getStoredData } from "@/lib/procurement-master-data";
import { MaterialRequisitionViewModal } from "@/components/inventory/MaterialRequisitionViewModal";

interface MRListSearch {
  action?: "view";
  id?: string;
}

export const Route = createFileRoute("/inv-material-requisition-list")({
  validateSearch: (search: Record<string, unknown>): MRListSearch => ({
    action: search.action as any,
    id: search.id as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Material Requisition List — Inventory ERP" },
      { name: "description", content: "View and manage all Material Requisitions created across departments." },
    ],
  }),
  component: MaterialRequisitionListPage,
});

function MaterialRequisitionListPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(() =>
    getStoredMaterialRequisitions()
  );

  useEffect(() => {
    setStoredMaterialRequisitions(requisitions);
  }, [requisitions]);

  // View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMRForView, setSelectedMRForView] = useState<MaterialRequisition | null>(null);

  // Auto-open modal if accessed via query params ?action=view&id=...
  useEffect(() => {
    if (searchParams.id) {
      const match = requisitions.find(
        (r) => r.id === searchParams.id || r.mrNumber.toLowerCase() === searchParams.id?.toLowerCase()
      );
      if (match) {
        setSelectedMRForView(match);
        setViewModalOpen(true);
      }
    }
  }, [searchParams.id, searchParams.action, requisitions]);

  // Master Warehouses
  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [mrIdFilter, setMrIdFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [requestedByFilter, setRequestedByFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<MaterialRequisition | null>(null);

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Departments list for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    requisitions.forEach((r) => r.department && set.add(r.department));
    return Array.from(set);
  }, [requisitions]);

  // Filtered requisitions
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((mr) => {
      // Free text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          mr.mrNumber.toLowerCase().includes(q) ||
          mr.department.toLowerCase().includes(q) ||
          mr.requestedBy.toLowerCase().includes(q) ||
          mr.warehouseStore.toLowerCase().includes(q) ||
          mr.status.toLowerCase().includes(q);
        if (!matchesQ) return false;
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
      if (priorityFilter !== "All" && mr.priority !== priorityFilter) {
        return false;
      }
      if (statusFilter !== "All" && mr.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [
    requisitions,
    searchQuery,
    mrIdFilter,
    fromDate,
    toDate,
    departmentFilter,
    requestedByFilter,
    warehouseFilter,
    priorityFilter,
    statusFilter,
  ]);

  // Status Badge Helper
  const getStatusBadge = (status: MRStatus) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Submitted":
        return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Partially Issued":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Fully Issued":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Returned for Correction":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Cancelled":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-100 text-rose-800 font-bold border-rose-200";
      case "Urgent":
        return "bg-amber-100 text-amber-800 font-bold border-amber-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Actions
  const handleSubmitMR = (id: string) => {
    const updated = requisitions.map((r) =>
      r.id === id
        ? {
            ...r,
            status: "Submitted" as MRStatus,
            submittedDate: new Date().toISOString().replace("T", " ").slice(0, 16),
            approvalHistory: [
              ...(r.approvalHistory || []),
              {
                level: 1,
                approver: r.requestedBy,
                designation: r.requesterDesignation || "Requester",
                action: "Submitted" as const,
                dateTime: new Date().toISOString().replace("T", " ").slice(0, 16),
                remarks: "Submitted to Store Approver",
              },
            ],
          }
        : r
    );
    setRequisitions(updated);
    toast.success("Material Requisition submitted successfully! Now pending in Approval Queue.");
  };

  const handleCancelMR = (id: string) => {
    const updated = requisitions.map((r) =>
      r.id === id ? { ...r, status: "Cancelled" as MRStatus } : r
    );
    setRequisitions(updated);
    toast.info("Material Requisition cancelled.");
  };

  const handleDeleteMR = (id: string) => {
    const updated = requisitions.filter((r) => r.id !== id);
    setRequisitions(updated);
    setDeleteConfirmId(null);
    toast.success("Material Requisition deleted successfully.");
  };

  // Report Modal Data Builder
  const previewReportData: StandardReportData = useMemo(() => {
    if (!reportTarget) {
      return {
        companyName: "Pakiza Knit Composite Ltd",
        companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
        reportTitle: "MATERIAL REQUISITION NOTE",
        reportNumber: "MR-PREVIEW",
        reportDate: new Date().toISOString().slice(0, 10),
        statusBadge: "Draft",
        metaFields: [],
        tableHeaders: [],
        tableRows: [],
      };
    }
    return {
      reportType: "material-requisition",
      hideDocHeaderInfo: true,
      hideLogo: true,
      companyName: reportTarget.organization || "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "MATERIAL REQUISITION NOTE",
      reportNumber: reportTarget.mrNumber,
      documentNumber: reportTarget.mrNumber,
      documentNo: reportTarget.mrNumber,
      reportDate: reportTarget.requisitionDate,
      documentDate: reportTarget.requisitionDate,
      statusBadge: reportTarget.status,
      metaFields: [
        { label: "Requisition No", value: reportTarget.mrNumber, highlight: true },
        { label: "Requisition Date", value: reportTarget.requisitionDate },
        { label: "Required Date", value: reportTarget.requiredDate },
        { label: "Requested By", value: reportTarget.requestedBy },
        { label: "Department", value: reportTarget.department },
        { label: "Priority", value: reportTarget.priority },
        { label: "Purpose", value: reportTarget.purpose || "N/A" },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "SPECIFICATION",
        "BRAND",
        "ORIGIN",
        "UOM",
        "REQ QTY",
        "APP QTY",
      ],
      tableRows: reportTarget.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.specification || "-",
        it.brand || "Pakiza Standard",
        it.origin || "Local",
        it.uom,
        String(it.requestedQuantity),
        String(it.approvedQuantity ?? it.requestedQuantity),
      ]),
      summaryCards: [
        { label: "Requested Qty", value: String(reportTarget.requestedQuantity) },
      ],
      signatures: [
        { title: "Requested By", name: reportTarget.requestedBy, date: reportTarget.requisitionDate },
        {
          title: "Approved By",
          name: reportTarget.approvalHistory?.[0]?.approver || "Department Head",
          date: reportTarget.approvedDate || "-",
        },
        { title: "Store In-Charge", name: "Store Officer", date: "-" },
        { title: "Received By", name: "Receiver Signature", date: "-" },
      ],
    };
  }, [reportTarget]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Material Requisition List
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Central registry for all store material requisitions and stock availability tracking
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/inv-material-requisition"
                search={{ action: "create" }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                <Plus className="size-4" strokeWidth={2.5} />
                Create Material Requisition
              </Link>
            </div>
          </div>

          {/* Filter Section Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Filter className="size-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Search & Filters
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredRequisitions.length} of {requisitions.length} records
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {/* MR ID Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Requisition ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. MR-2026-0001"
                        value={mrIdFilter}
                        onChange={(e) => setMrIdFilter(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* From Date & To Date Side-by-Side */}
                  <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Department
                    </label>
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
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
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Requested By
                    </label>
                    <input
                      type="text"
                      placeholder="Requester name..."
                      value={requestedByFilter}
                      onChange={(e) => setRequestedByFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted (Pending Approval)</option>
                      <option value="Approved">Approved</option>
                      <option value="Partially Issued">Partially Issued</option>
                      <option value="Fully Issued">Fully Issued</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Returned for Correction">Returned for Correction</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setMrIdFilter("");
                      setFromDate("");
                      setToDate("");
                      setDepartmentFilter("All");
                      setRequestedByFilter("");
                      setWarehouseFilter("All");
                      setPriorityFilter("All");
                      setStatusFilter("All");
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-800">
                  Requisition Records ({filteredRequisitions.length})
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Quick search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3.5 text-center w-12">SL</th>
                    <th className="py-3 px-3.5">Requisition ID</th>
                    <th className="py-3 px-3.5">Requisition Date</th>
                    <th className="py-3 px-3.5">Department</th>
                    <th className="py-3 px-3.5">Requested By</th>
                    <th className="py-3 px-3.5">Required Date</th>
                    <th className="py-3 px-3.5 text-right">Req Qty</th>
                    <th className="py-3 px-3.5 text-right">Issued Qty</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center sticky right-0 bg-slate-50 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRequisitions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText className="size-8 text-slate-300 stroke-[1.5]" />
                          <p className="text-xs font-semibold">No Material Requisitions found</p>
                          <p className="text-[10px] text-slate-400">
                            Try adjusting your filters or click Create Material Requisition
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRequisitions.map((mr, idx) => {
                      const isDraft = mr.status === "Draft";
                      const isSubmitted = mr.status === "Submitted";
                      const isReturned = mr.status === "Returned for Correction";
                      const isCanEdit = isDraft || isReturned;
                      const isCanSubmit = isDraft || isReturned;
                      const isCanCancel = isSubmitted;
                      const isCanDelete = isDraft;

                      return (
                        <tr
                          key={mr.id}
                          className="hover:bg-slate-50/70 transition-colors group whitespace-nowrap"
                        >
                          <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMRForView(mr);
                                setViewModalOpen(true);
                              }}
                              className="font-bold text-blue-600 hover:text-blue-800 hover:underline font-mono text-left cursor-pointer transition-colors"
                              title="Click to view requisition details"
                            >
                              {mr.mrNumber}
                            </button>
                          </td>
                          <td className="py-3 px-3.5 text-slate-600 font-mono">
                            {mr.requisitionDate}
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-slate-800">
                            {mr.department}
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-1.5">
                              <User className="size-3 text-slate-400" />
                              <span className="font-medium text-slate-800">{mr.requestedBy}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600">
                            {mr.requiredDate}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-slate-900 font-mono">
                            {mr.requestedQuantity.toLocaleString()}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-indigo-600 font-mono">
                            {mr.issuedQuantity.toLocaleString()}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold border ${getStatusBadge(
                                mr.status
                              )}`}
                            >
                              {mr.status}
                            </span>
                          </td>

                          {/* Condition-based Actions */}
                          <td className="py-3 px-3.5 text-center sticky right-0 bg-white group-hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center justify-center gap-1">
                              {/* View Action (Opens Modal) */}
                              <button
                                title="View Requisition"
                                onClick={() => {
                                  setSelectedMRForView(mr);
                                  setViewModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <Eye className="size-3.5" />
                              </button>

                              {/* Print / Report */}
                              <button
                                title="Preview Report"
                                onClick={() => {
                                  setReportTarget(mr);
                                  setPreviewReportOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <Printer className="size-3.5" />
                              </button>

                              {/* Edit Action */}
                              {isCanEdit && (
                                <button
                                  title="Edit Requisition"
                                  onClick={() =>
                                    navigate({
                                      to: "/inv-material-requisition",
                                      search: { action: "edit", id: mr.id },
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                >
                                  <Edit className="size-3.5" />
                                </button>
                              )}

                              {/* Submit Action */}
                              {isCanSubmit && (
                                <button
                                  title="Submit for Approval"
                                  onClick={() => handleSubmitMR(mr.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                >
                                  <Send className="size-3.5" />
                                </button>
                              )}

                              {/* Cancel Action */}
                              {isCanCancel && (
                                <button
                                  title="Cancel Requisition"
                                  onClick={() => handleCancelMR(mr.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <XCircle className="size-3.5" />
                                </button>
                              )}

                              {/* Delete Action */}
                              {isCanDelete && (
                                <button
                                  title="Delete Draft"
                                  onClick={() => setDeleteConfirmId(mr.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
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

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 mx-auto">
                <AlertTriangle className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 text-center">
                Delete Requisition?
              </h3>
              <p className="text-xs text-slate-500 text-center mt-1">
                Are you sure you want to permanently delete this draft requisition? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMR(deleteConfirmId)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20"
                >
                  Delete
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

        {/* Material Requisition In-Page View Modal */}
        <MaterialRequisitionViewModal
          open={viewModalOpen}
          onOpenChange={(isOpen) => {
            setViewModalOpen(isOpen);
            if (!isOpen) {
              setSelectedMRForView(null);
            }
          }}
          requisition={selectedMRForView}
          onPrint={(target) => {
            setReportTarget(target);
            setPreviewReportOpen(true);
          }}
        />
      </main>
    </div>
  );
}
