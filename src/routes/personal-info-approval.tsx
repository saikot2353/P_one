import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  X,
  ChevronRight,
  Eye,
  Check,
  AlertCircle,
  ExternalLink,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  type PersonalInfoApprovalRequest,
  type FieldChange,
  getPersonalInfoApprovalRequests,
  approvePersonalInfoRequest,
  rejectPersonalInfoRequest,
} from "@/lib/personalInfoApprovalStore";

export const Route = createFileRoute("/personal-info-approval")({
  head: () => ({
    meta: [
      { title: "Personal Info Approval — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Review and approve employee personal info modifications with field-level before/after diff comparison.",
      },
    ],
  }),
  component: PersonalInfoApprovalPage,
});

export function PersonalInfoApprovalPage() {
  const [requests, setRequests] = useState<PersonalInfoApprovalRequest[]>(() =>
    getPersonalInfoApprovalRequests()
  );
  const [selectedRequest, setSelectedRequest] = useState<PersonalInfoApprovalRequest | null>(null);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);

  // Filters & Search
  const [globalSearch, setGlobalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [deptFilter, setDeptFilter] = useState("All");

  // Approval / Rejection action state
  const [approverRemarks, setApproverRemarks] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const loadRequests = () => {
    const data = getPersonalInfoApprovalRequests();
    setRequests(data);
  };

  useEffect(() => {
    loadRequests();
    const handleStorageChange = () => {
      loadRequests();
    };
    window.addEventListener("personal_info_approvals_changed", handleStorageChange);
    return () => {
      window.removeEventListener("personal_info_approvals_changed", handleStorageChange);
    };
  }, []);

  // Compute distinct departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (r.department) set.add(r.department);
    });
    return ["All", ...Array.from(set)];
  }, [requests]);

  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === "Pending").length;
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (deptFilter !== "All" && r.department !== deptFilter) return false;
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        return (
          r.empName.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, deptFilter, globalSearch]);

  const handleOpenDiff = (req: PersonalInfoApprovalRequest) => {
    setSelectedRequest(req);
    setApproverRemarks(req.actionRemarks || "");
    setRejectReason(req.rejectionReason || "");
    setIsDiffModalOpen(true);
  };

  const handleApprove = (reqId: string) => {
    const res = approvePersonalInfoRequest(reqId, "Head of HR Approvals", approverRemarks);
    if (res.success) {
      toast.success(res.message);
      loadRequests();
      setIsDiffModalOpen(false);
      setSelectedRequest(null);
    } else {
      toast.error(res.message);
    }
  };

  const handleReject = (reqId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejecting the requested changes.");
      return;
    }
    const res = rejectPersonalInfoRequest(reqId, "Head of HR Approvals", rejectReason);
    if (res.success) {
      toast.success(res.message);
      loadRequests();
      setIsDiffModalOpen(false);
      setIsRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectReason("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-x-hidden">
        <Topbar />

        {/* Full-width container filling the page */}
        <div className="p-4 sm:p-6 w-full flex-1 flex flex-col space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <Link to="/personnel-list" className="hover:text-blue-600 transition-colors">
                  Personnel Info
                </Link>
                <ChevronRight className="size-3 text-slate-400" />
                <span>HR Approvals</span>
                <ChevronRight className="size-3 text-slate-400" />
                <span className="text-slate-800 dark:text-slate-200 font-bold">Personal Info Approval</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Personal Info Approval
                </h1>
                {pendingCount > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review profile modifications submitted from the Personal List page. Inspect previous and proposed info before approval.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/personnel-list"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <span>Personnel List</span>
                <ExternalLink className="size-3 opacity-60" />
              </Link>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Employee ID, Name, Title, Request ID..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Department Filter & Status Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="size-3 text-slate-400" />
                <span>Department:</span>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter Buttons */}
              <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                {(["All", "Pending", "Approved", "Rejected"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-md transition-all text-xs font-medium ${
                      statusFilter === status
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Container - filling the page */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="px-4 py-3 w-32">Request ID</th>
                    <th className="px-4 py-3">Employee Information</th>
                    <th className="px-4 py-3">Department & Role</th>
                    <th className="px-4 py-3">Changed Fields</th>
                    <th className="px-4 py-3">Requested By & Date</th>
                    <th className="px-4 py-3 text-center w-28">Status</th>
                    <th className="px-4 py-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-normal">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          No approval requests found
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {globalSearch
                            ? "Try adjusting your search criteria."
                            : "There are currently no requests in this status."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => {
                      const isPending = req.status === "Pending";
                      const isApproved = req.status === "Approved";
                      const isRejected = req.status === "Rejected";

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          {/* Request ID */}
                          <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300 font-medium">
                            {req.id}
                          </td>

                          {/* Employee Information (no circle avatar) */}
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-100">
                                {req.empName}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                ID: {req.empId}
                              </div>
                            </div>
                          </td>

                          {/* Department & Role */}
                          <td className="px-4 py-3">
                            <div className="text-slate-700 dark:text-slate-200 font-medium">
                              {req.designation}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {req.department}
                            </div>
                          </td>

                          {/* Changed Fields (clean neutral badges) */}
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1 max-w-sm">
                              {req.changes.map((ch, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                                >
                                  {ch.fieldLabel}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Requested By & Date */}
                          <td className="px-4 py-3">
                            <div className="text-slate-700 dark:text-slate-300">
                              {req.requestedBy}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {req.requestDate} {req.requestTime}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3 text-center">
                            {isPending && (
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50">
                                Pending
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
                                Approved
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                Rejected
                              </span>
                            )}
                          </td>

                          {/* Action (View Icon only) */}
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleOpenDiff(req)}
                              className="size-8 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 inline-flex items-center justify-center transition shadow-2xs cursor-pointer"
                              title="View Details & Diff"
                            >
                              <Eye className="size-4" />
                            </button>
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

        {/* ─── CLEAN DIFF & APPROVAL MODAL ────────────────────────────────────── */}
        {isDiffModalOpen && selectedRequest && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsDiffModalOpen(false);
            }}
          >
            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Review Personal Info Changes
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Request ID: {selectedRequest.id}
                  </p>
                </div>

                <button
                  onClick={() => setIsDiffModalOpen(false)}
                  className="size-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Employee Summary Info */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {selectedRequest.empName}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    ID: {selectedRequest.empId} • {selectedRequest.designation} • {selectedRequest.department}
                  </div>
                </div>

                <div className="text-right text-slate-500 dark:text-slate-400">
                  <div>Requested by: <span className="text-slate-700 dark:text-slate-200 font-medium">{selectedRequest.requestedBy}</span></div>
                  <div>Date: <span className="text-slate-700 dark:text-slate-200">{selectedRequest.requestDate} {selectedRequest.requestTime}</span></div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* Diff Table */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Changed Fields ({selectedRequest.changes.length})
                  </div>

                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                          <th className="px-4 py-2.5 w-1/3">Field</th>
                          <th className="px-4 py-2.5 w-1/3">Previous Info</th>
                          <th className="px-4 py-2.5 w-1/3">Proposed Info</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
                        {selectedRequest.changes.map((ch: FieldChange, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                            <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                              {ch.fieldLabel}
                            </td>
                            <td className="px-4 py-2.5 text-slate-400 line-through">
                              {ch.oldValue || "—"}
                            </td>
                            <td className="px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">
                              {ch.newValue}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audit status notices */}
                {selectedRequest.status === "Approved" && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs">
                    Approved by {selectedRequest.actionBy} on {selectedRequest.actionDate}.
                    {selectedRequest.actionRemarks && ` Remarks: "${selectedRequest.actionRemarks}"`}
                  </div>
                )}

                {selectedRequest.status === "Rejected" && (
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs">
                    Rejected by {selectedRequest.actionBy} on {selectedRequest.actionDate}.
                    {selectedRequest.rejectionReason && ` Reason: "${selectedRequest.rejectionReason}"`}
                  </div>
                )}

                {/* Approver Remarks Input (if Pending) */}
                {selectedRequest.status === "Pending" && (
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Approver Remarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={approverRemarks}
                      onChange={(e) => setApproverRemarks(e.target.value)}
                      placeholder="Add any verification note before approving or rejecting..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setIsDiffModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>

                {selectedRequest.status === "Pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRejectDialogOpen(true)}
                      className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="size-3.5" />
                      <span>Approve Changes</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/personnel-list"
                    className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 transition flex items-center gap-1.5"
                  >
                    <span>View in Personnel List</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── CLEAN REJECT REASON MODAL ──────────────────────────────────────── */}
        {isRejectDialogOpen && selectedRequest && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsRejectDialogOpen(false);
            }}
          >
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Reject Personal Info Changes
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedRequest.empName} ({selectedRequest.empId})
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Reason for Rejection *
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="State the reason for rejecting this change..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsRejectDialogOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-2xs cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
