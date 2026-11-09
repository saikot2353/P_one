import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { toast } from "sonner";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  Filter,
  Search,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  User,
  AlertTriangle,
  X,
  Clock,
  ArrowRight,
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

interface MRApprovalSearch {
  action?: "approve" | "view";
  id?: string;
}

export const Route = createFileRoute("/inv-material-requisition-approval-list")({
  validateSearch: (search: Record<string, unknown>): MRApprovalSearch => ({
    action: search.action as any,
    id: search.id as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Material Requisition Approval — Inventory ERP" },
      {
        name: "description",
        content: "Review, approve, return, or reject pending store material requisitions.",
      },
    ],
  }),
  component: MaterialRequisitionApprovalListPage,
});

function MaterialRequisitionApprovalListPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(() =>
    getStoredMaterialRequisitions()
  );

  useEffect(() => {
    setStoredMaterialRequisitions(requisitions);
  }, [requisitions]);

  // Process / View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMRForProcess, setSelectedMRForProcess] = useState<MaterialRequisition | null>(null);
  const [isApprovalMode, setIsApprovalMode] = useState(false);

  // Auto-open modal if navigated to with search query ?id=...
  useEffect(() => {
    if (searchParams.id) {
      const match = requisitions.find(
        (r) => r.id === searchParams.id || r.mrNumber.toLowerCase() === searchParams.id?.toLowerCase()
      );
      if (match) {
        setSelectedMRForProcess(match);
        setIsApprovalMode(match.status === "Submitted");
        setViewModalOpen(true);
      }
    }
  }, [searchParams.id, searchParams.action, requisitions]);

  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  // Tabs: Pending Approval (Default) vs All
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

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

  // Approver Action Modal (Inline list action)
  const [targetMR, setTargetMR] = useState<MaterialRequisition | null>(null);
  const [modalAction, setModalAction] = useState<"Reject" | "Return" | null>(null);
  const [modalComment, setModalComment] = useState("");

  // Report Modal
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<MaterialRequisition | null>(null);

  // Departments for dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    requisitions.forEach((r) => r.department && set.add(r.department));
    return Array.from(set);
  }, [requisitions]);

  // Filtered List
  const filteredList = useMemo(() => {
    return requisitions.filter((mr) => {
      // Tab constraint: pending shows only "Submitted"
      if (activeTab === "pending" && mr.status !== "Submitted") {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          mr.mrNumber.toLowerCase().includes(q) ||
          mr.department.toLowerCase().includes(q) ||
          mr.requestedBy.toLowerCase().includes(q) ||
          mr.warehouseStore.toLowerCase().includes(q);
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
    activeTab,
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

  const pendingCount = useMemo(() => {
    return requisitions.filter((r) => r.status === "Submitted").length;
  }, [requisitions]);

  // Actions
  const handleApprove = (mr: MaterialRequisition) => {
    const updated = requisitions.map((r) => {
      if (r.id === mr.id) {
        return {
          ...r,
          status: "Approved" as MRStatus,
          approvedDate: new Date().toISOString().replace("T", " ").slice(0, 16),
          approvalHistory: [
            ...(r.approvalHistory || []),
            {
              level: (r.approvalHistory?.length || 0) + 1,
              approver: "Rafiqul Islam",
              designation: "Store Manager",
              action: "Approved" as const,
              dateTime: new Date().toISOString().replace("T", " ").slice(0, 16),
              remarks: "Approved from approval list",
            },
          ],
        };
      }
      return r;
    });
    setRequisitions(updated);
    toast.success(`Requisition ${mr.mrNumber} approved successfully!`);
    setViewModalOpen(false);
    setSelectedMRForProcess(null);
  };

  const handleConfirmModalAction = () => {
    if (!targetMR || !modalAction) return;
    if (!modalComment.trim()) {
      toast.error("Please enter a reason or comment.");
      return;
    }

    const isReject = modalAction === "Reject";
    const newStatus: MRStatus = isReject ? "Rejected" : "Returned for Correction";

    const updated = requisitions.map((r) => {
      if (r.id === targetMR.id) {
        return {
          ...r,
          status: newStatus,
          rejectionReason: isReject ? modalComment : undefined,
          returnReason: !isReject ? modalComment : undefined,
          approvalHistory: [
            ...(r.approvalHistory || []),
            {
              level: (r.approvalHistory?.length || 0) + 1,
              approver: "Rafiqul Islam",
              designation: "Store Manager",
              action: (isReject ? "Rejected" : "Returned for Correction") as any,
              dateTime: new Date().toISOString().replace("T", " ").slice(0, 16),
              remarks: modalComment,
            },
          ],
        };
      }
      return r;
    });

    setRequisitions(updated);
    toast.info(
      isReject
        ? `Requisition ${targetMR.mrNumber} rejected.`
        : `Requisition ${targetMR.mrNumber} returned for correction.`
    );
    setTargetMR(null);
    setModalAction(null);
    setModalComment("");
    setViewModalOpen(false);
    setSelectedMRForProcess(null);
  };

  // Preview Report Data
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
      hideLogo: true,
      companyName: reportTarget.organization || "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "MATERIAL REQUISITION APPROVAL NOTE",
      reportNumber: reportTarget.mrNumber,
      reportDate: reportTarget.requisitionDate,
      statusBadge: reportTarget.status,
      metaFields: [
        { label: "Requisition Date", value: reportTarget.requisitionDate },
        { label: "Required Date", value: reportTarget.requiredDate },
        { label: "Requested By", value: reportTarget.requestedBy },
        { label: "Department", value: reportTarget.department },
        { label: "Priority", value: reportTarget.priority },
        { label: "Submitted Date", value: reportTarget.submittedDate || "-" },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "SPECIFICATION",
        "UOM",
        "REQ QTY",
        "APP QTY",
      ],
      tableRows: reportTarget.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.specification || "-",
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
          name: reportTarget.approvalHistory?.[0]?.approver || "Store Manager",
          date: reportTarget.approvedDate || "-",
        },
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 font-bold shadow-sm">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                  Material Requisition Approval Queue
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Review and authorize submitted store requisitions prior to warehouse issue dispatch
                </p>
              </div>
            </div>

            {/* Tab toggles */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "pending"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Pending Approval</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {pendingCount}
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
                <span>All History</span>
                <span className="text-[10px] text-slate-400">({requisitions.length})</span>
              </button>
            </div>
          </div>

          {/* Filter Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Filter className="size-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Approval Filters
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredList.length} of {requisitions.length} records
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* MR ID */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      MR ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MR-2026-0002"
                      value={mrIdFilter}
                      onChange={(e) => setMrIdFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  {/* From Date & To Date Side-by-Side */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Priority
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="All">All Priorities</option>
                      <option value="Critical">Critical</option>
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Normal">Normal</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  {/* Status (When viewing all tab) */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Submitted">Submitted (Pending)</option>
                      <option value="Approved">Approved</option>
                      <option value="Partially Issued">Partially Issued</option>
                      <option value="Fully Issued">Fully Issued</option>
                      <option value="Returned for Correction">Returned for Correction</option>
                      <option value="Rejected">Rejected</option>
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
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100">
              <span className="text-sm font-black text-slate-800">
                {activeTab === "pending" ? "Pending Approvals" : "All Requisitions"} (
                {filteredList.length})
              </span>

              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search queue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3.5 text-center w-12">SL</th>
                    <th className="py-3 px-3.5">Requisition ID</th>
                    <th className="py-3 px-3.5">Requested By</th>
                    <th className="py-3 px-3.5">Department</th>
                    <th className="py-3 px-3.5">Submitted Date</th>
                    <th className="py-3 px-3.5 text-right">Requested Qty</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center sticky right-0 bg-slate-50 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CheckCircle2 className="size-8 text-emerald-400 stroke-[1.5]" />
                          <p className="text-xs font-semibold text-slate-600">
                            {activeTab === "pending"
                              ? "No pending approvals in queue!"
                              : "No requisitions found"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            All material requisitions have been processed.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((mr, idx) => {
                      const isPending = mr.status === "Submitted";
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
                                setSelectedMRForProcess(mr);
                                setIsApprovalMode(isPending);
                                setViewModalOpen(true);
                              }}
                              className="font-bold text-blue-600 hover:text-blue-800 hover:underline font-mono text-left cursor-pointer transition-colors"
                            >
                              {mr.mrNumber}
                            </button>
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-slate-800">
                            {mr.requestedBy}
                          </td>
                          <td className="py-3 px-3.5 text-slate-700">{mr.department}</td>
                          <td className="py-3 px-3.5 font-mono text-slate-600">
                            {mr.submittedDate || (mr.createdDate ? `${mr.createdDate} 09:30 AM` : "—")}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-slate-900 font-mono">
                            {mr.requestedQuantity.toLocaleString()}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold border ${
                                mr.status === "Submitted"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                                  : mr.status === "Approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : mr.status === "Rejected"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {mr.status}
                            </span>
                          </td>

                          {/* Action Column */}
                          <td className="py-3 px-3.5 text-center sticky right-0 bg-white group-hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View / Open in Approval Form */}
                              <button
                                title={isPending ? "Process Approval" : "View Requisition"}
                                onClick={() => {
                                  setSelectedMRForProcess(mr);
                                  setIsApprovalMode(isPending);
                                  setViewModalOpen(true);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold transition-colors"
                              >
                                <Eye className="size-3" />
                                {isPending ? "Process" : "View"}
                              </button>

                              {/* Preview Print */}
                              <button
                                title="Preview Note"
                                onClick={() => {
                                  setReportTarget(mr);
                                  setPreviewReportOpen(true);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <Printer className="size-3.5" />
                              </button>

                              {/* Quick Approvals (Only available if status is Submitted) */}
                              {isPending && (
                                <>
                                  <button
                                    title="Quick Approve"
                                    onClick={() => handleApprove(mr)}
                                    className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  >
                                    <CheckCircle2 className="size-4" />
                                  </button>

                                  <button
                                    title="Return for Correction"
                                    onClick={() => {
                                      setTargetMR(mr);
                                      setModalAction("Return");
                                      setModalComment("");
                                    }}
                                    className="p-1 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                                  >
                                    <RotateCcw className="size-4" />
                                  </button>

                                  <button
                                    title="Reject Requisition"
                                    onClick={() => {
                                      setTargetMR(mr);
                                      setModalAction("Reject");
                                      setModalComment("");
                                    }}
                                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    <XCircle className="size-4" />
                                  </button>
                                </>
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

        {/* Comment Modal for Reject / Return */}
        {modalAction && targetMR && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                {modalAction === "Reject" ? "Reject Requisition" : "Return for Correction"}:{" "}
                <span className="font-mono text-blue-600">{targetMR.mrNumber}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Please provide specific feedback/reason for the requester.
              </p>

              <div className="mt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Reason / Feedback *
                </label>
                <textarea
                  rows={4}
                  value={modalComment}
                  onChange={(e) => setModalComment(e.target.value)}
                  placeholder="Enter detailed justification here..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setModalAction(null);
                    setTargetMR(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmModalAction}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md ${
                    modalAction === "Reject"
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                      : "bg-orange-600 hover:bg-orange-700 shadow-orange-500/20"
                  }`}
                >
                  Confirm {modalAction}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Material Requisition View & Process Modal */}
        <MaterialRequisitionViewModal
          open={viewModalOpen}
          onOpenChange={(open) => {
            setViewModalOpen(open);
            if (!open) setSelectedMRForProcess(null);
          }}
          requisition={selectedMRForProcess}
          isApprovalMode={isApprovalMode}
          onApprove={handleApprove}
          onReject={(mr) => {
            setTargetMR(mr);
            setModalAction("Reject");
            setModalComment("");
          }}
          onReturn={(mr) => {
            setTargetMR(mr);
            setModalAction("Return");
            setModalComment("");
          }}
          onPrint={(target) => {
            setReportTarget(target);
            setPreviewReportOpen(true);
          }}
        />

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
