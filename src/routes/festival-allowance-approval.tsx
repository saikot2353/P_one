import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Coins,
  ShieldCheck,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  FileSpreadsheet,
  Printer,
  Calendar,
  Users,
  Building2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  type FestivalAllowanceBatch,
  type FestivalAllowanceEmployeeItem,
  getFestivalAllowanceBatches,
  approveFestivalAllowanceBatch,
  rejectFestivalAllowanceBatch,
} from "@/lib/festivalAllowanceStore";

export const Route = createFileRoute("/festival-allowance-approval")({
  head: () => ({
    meta: [
      { title: "Festival Allowance Approval — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Review, audit, and approve submitted festival holiday allowance claims, employee day rates, and net disbursement amounts.",
      },
    ],
  }),
  component: FestivalAllowanceApprovalPage,
});

export function FestivalAllowanceApprovalPage() {
  const [batches, setBatches] = useState<FestivalAllowanceBatch[]>(() =>
    getFestivalAllowanceBatches()
  );

  // Load from store & subscribe to changes
  const loadBatches = () => {
    setBatches(getFestivalAllowanceBatches());
  };

  useEffect(() => {
    loadBatches();
    const handleAllowanceChanged = () => {
      loadBatches();
    };
    window.addEventListener("festival_allowances_changed", handleAllowanceChanged);
    return () => {
      window.removeEventListener("festival_allowances_changed", handleAllowanceChanged);
    };
  }, []);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Details Modal State
  const [selectedBatch, setSelectedBatch] = useState<FestivalAllowanceBatch | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Rejection Dialog State
  const [rejectingBatch, setRejectingBatch] = useState<FestivalAllowanceBatch | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Distinct Departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    batches.forEach((b) => {
      if (b.department) set.add(b.department);
    });
    return ["All", ...Array.from(set)];
  }, [batches]);

  // Statistics
  const pendingCount = useMemo(
    () => batches.filter((b) => b.status === "Pending").length,
    [batches]
  );

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (departmentFilter !== "All" && b.department !== departmentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.id.toLowerCase().includes(q) ||
          b.department.toLowerCase().includes(q) ||
          b.submittedBy.toLowerCase().includes(q) ||
          b.month.toLowerCase().includes(q) ||
          b.year.toLowerCase().includes(q) ||
          b.processFor.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [batches, statusFilter, departmentFilter, searchQuery]);

  // Actions
  const handleApprove = (batch: FestivalAllowanceBatch) => {
    const success = approveFestivalAllowanceBatch(
      batch.id,
      "HR Approver",
      "Approved as per festival allowance and duty roster policy."
    );
    if (success) {
      toast.success(`Allowance #${batch.id} Approved!`, {
        description: `Approved festival allowance for ${batch.employeeCount} employee(s) (৳ ${batch.totalPayable.toLocaleString()}).`,
      });
      loadBatches();
      if (selectedBatch?.id === batch.id) {
        setIsDetailsModalOpen(false);
        setSelectedBatch(null);
      }
    }
  };

  const handleOpenReject = (batch: FestivalAllowanceBatch) => {
    setRejectingBatch(batch);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectingBatch) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason for rejecting the requisition.");
      return;
    }

    const success = rejectFestivalAllowanceBatch(
      rejectingBatch.id,
      "HR Approver",
      rejectionReason.trim()
    );

    if (success) {
      toast.info(`Allowance #${rejectingBatch.id} Rejected`, {
        description: `Reason: ${rejectionReason.trim()}`,
      });
      loadBatches();
      setIsRejectDialogOpen(false);
      setRejectingBatch(null);
      setRejectionReason("");
      if (selectedBatch?.id === rejectingBatch.id) {
        setIsDetailsModalOpen(false);
        setSelectedBatch(null);
      }
    }
  };

  const handleOpenDetails = (batch: FestivalAllowanceBatch) => {
    setSelectedBatch(batch);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans antialiased">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* --------------------------------------------------------------------------- */}
          {/* Header Banner                                                               */}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground">Approvals</span>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground">HR Approvals</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold uppercase">
                  Festival Allowance Approval
                </span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <ShieldCheck className="size-6 text-primary" />
                <span>Festival Allowance Approval</span>
                {pendingCount > 0 && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    {pendingCount} Pending
                  </span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Review, audit, and approve submitted festival holiday allowance claims, day rates, and disbursement totals.
              </p>
            </div>
          </div>

          {/* --------------------------------------------------------------------------- */}
          {/* Filter Console Panel (Clean direct bar, no top 4 cards)                     */}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border border-border/60">
                {(["Pending", "Approved", "Rejected", "All"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      statusFilter === status
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {status}
                    {status === "Pending" && pendingCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground font-medium shrink-0">
                  Department:
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="h-8 px-2.5 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary transition cursor-pointer"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-card text-foreground">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search and Quick Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Req ID, month, department, or submitter..."
                  className="w-full h-9 pl-9 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground">{filteredBatches.length}</span> of{" "}
                <span className="font-bold text-foreground">{batches.length}</span> requisitions
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------------- */}
          {/* Batches Table                                                               */}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border/60 font-bold whitespace-nowrap">
                    <th className="py-3 px-4">Req ID</th>
                    <th className="py-3 px-4">Year / Month</th>
                    <th className="py-3 px-4">Process For</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Submitted By</th>
                    <th className="py-3 px-4 text-center">Employees</th>
                    <th className="py-3 px-4 text-right">Total Payable</th>
                    <th className="py-3 px-4">Submitted Time</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-foreground">
                  {filteredBatches.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Coins className="size-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">No festival allowance requisitions match current filters.</p>
                          <p className="text-xs text-muted-foreground/70">
                            Try changing the status tab or clearing your search.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBatches.map((batch) => {
                      return (
                        <tr key={batch.id} className="hover:bg-muted/40 transition-colors">
                          {/* Req ID */}
                          <td className="py-3 px-4 font-bold text-primary whitespace-nowrap">
                            {batch.id}
                          </td>

                          {/* Year / Month */}
                          <td className="py-3 px-4 font-semibold whitespace-nowrap">
                            {batch.month} {batch.year}
                          </td>

                          {/* Process For */}
                          <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-medium">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="size-3 text-primary/70" />
                              {batch.processFor}
                            </span>
                          </td>

                          {/* Department */}
                          <td className="py-3 px-4 whitespace-nowrap font-medium">
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="size-3.5 text-muted-foreground" />
                              {batch.department}
                            </span>
                          </td>

                          {/* Submitted By */}
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                            {batch.submittedBy}
                          </td>

                          {/* Employee Count */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground">
                              <Users className="size-3" />
                              {batch.employeeCount}
                            </span>
                          </td>

                          {/* Total Payable */}
                          <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-foreground">
                            ৳ {batch.totalPayable.toLocaleString()}
                          </td>

                          {/* Submitted Time */}
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                            {batch.submittedDate}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {batch.status === "Pending" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                <Clock className="size-3" /> Pending
                              </span>
                            )}
                            {batch.status === "Approved" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                <CheckCircle2 className="size-3" /> Approved
                              </span>
                            )}
                            {batch.status === "Rejected" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                <XCircle className="size-3" /> Rejected
                              </span>
                            )}
                          </td>

                          {/* Action Column (View Icon Only) */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleOpenDetails(batch)}
                                title="View Details & Approve/Reject"
                                className="size-8 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-primary flex items-center justify-center transition shadow-2xs cursor-pointer"
                              >
                                <Eye className="size-4" />
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

        {/* --------------------------------------------------------------------------- */}
        {/* Details & Review Modal                                                      */}
        {/* --------------------------------------------------------------------------- */}
        {isDetailsModalOpen && selectedBatch && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsDetailsModalOpen(false);
            }}
          >
            <div className="bg-card w-full max-w-[1020px] max-h-[90vh] flex flex-col rounded-2xl border border-border/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-foreground">
              {/* Modal Header */}
              <div className="p-5 border-b border-border/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-primary">{selectedBatch.id}</span>
                    {selectedBatch.status === "Pending" && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Pending Approval
                      </span>
                    )}
                    {selectedBatch.status === "Approved" && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Approved
                      </span>
                    )}
                    {selectedBatch.status === "Rejected" && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        Rejected
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-foreground mt-1">
                    Review Festival Allowance Requisition
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition cursor-pointer"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Modal Body Info Cards */}
              <div className="p-5 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-muted/30 p-3.5 rounded-xl border border-border/50">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Period</span>
                    <span className="font-bold text-foreground">
                      {selectedBatch.month} {selectedBatch.year}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Process For</span>
                    <span className="font-bold text-foreground">{selectedBatch.processFor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Department</span>
                    <span className="font-bold text-foreground">{selectedBatch.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Submitted By</span>
                    <span className="font-bold text-foreground">{selectedBatch.submittedBy}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Total Net Pay</span>
                    <span className="font-black text-primary">
                      ৳ {selectedBatch.totalPayable.toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedBatch.actionRemarks && (
                  <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <span className="font-bold text-foreground block mb-0.5">
                      Approver Remarks ({selectedBatch.actionBy} on {selectedBatch.actionDate}):
                    </span>
                    {selectedBatch.actionRemarks}
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Included Employee Records ({selectedBatch.items?.length || selectedBatch.employeeCount})
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Total: ৳ {selectedBatch.totalPayable.toLocaleString()}
                    </span>
                  </div>

                  <div className="border border-border/60 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-muted/50 text-muted-foreground font-semibold border-b border-border/50 sticky top-0 whitespace-nowrap">
                          <th className="py-2 px-3 w-10">SL</th>
                          <th className="py-2 px-3">Emp ID</th>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Designation</th>
                          <th className="py-2 px-3">Dept / Section</th>
                          <th className="py-2 px-3 text-right">Gross</th>
                          <th className="py-2 px-3 text-right">Basic</th>
                          <th className="py-2 px-3 text-center">Days</th>
                          <th className="py-2 px-3 text-right">Day Rate</th>
                          <th className="py-2 px-3 text-right">Payable</th>
                          <th className="py-2 px-3 text-center">OT Hrs</th>
                          <th className="py-2 px-3 text-right">Net Pay</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-foreground">
                        {!selectedBatch.items || selectedBatch.items.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="py-6 text-center text-muted-foreground">
                              Detailed employee records archived for this batch.
                            </td>
                          </tr>
                        ) : (
                          selectedBatch.items.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-muted/30 whitespace-nowrap">
                              <td className="py-2 px-3 text-muted-foreground">{idx + 1}</td>
                              <td className="py-2 px-3 font-semibold text-foreground">{item.empId}</td>
                              <td className="py-2 px-3 font-medium">{item.name}</td>
                              <td className="py-2 px-3 text-muted-foreground">{item.designation}</td>
                              <td className="py-2 px-3 text-muted-foreground">
                                {item.department} / {item.section}
                              </td>
                              <td className="py-2 px-3 text-right font-medium">{item.gross.toLocaleString()}</td>
                              <td className="py-2 px-3 text-right text-muted-foreground">{item.basic.toLocaleString()}</td>
                              <td className="py-2 px-3 text-center font-bold text-foreground">{item.totalDay}</td>
                              <td className="py-2 px-3 text-right font-medium">{item.perDayRate.toLocaleString()}</td>
                              <td className="py-2 px-3 text-right font-medium">{item.payableAmt.toLocaleString()}</td>
                              <td className="py-2 px-3 text-center text-muted-foreground">
                                {item.otHour ? item.otHour.toFixed(2) : "0.00"}
                              </td>
                              <td className="py-2 px-3 text-right font-bold text-foreground">
                                ৳ {item.netPay.toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>

                {selectedBatch.status === "Pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReject(selectedBatch)}
                      className="px-4 py-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 border border-rose-500/20 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                    >
                      <X className="size-3.5" /> Reject Requisition
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedBatch)}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="size-3.5" /> Approve Requisition
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------------- */}
        {/* Reject Dialog                                                               */}
        {/* --------------------------------------------------------------------------- */}
        {isRejectDialogOpen && rejectingBatch && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsRejectDialogOpen(false);
            }}
          >
            <div className="bg-card w-full max-w-[500px] rounded-2xl border border-border/80 shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-150 text-foreground">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="size-5 text-rose-600" />
                  <span>Reject Festival Allowance Requisition</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsRejectDialogOpen(false)}
                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  You are about to reject requisition <span className="font-bold text-foreground">#{rejectingBatch.id}</span> ({rejectingBatch.department}, {rejectingBatch.employeeCount} employees, ৳ {rejectingBatch.totalPayable.toLocaleString()}). Please specify the rejection reason:
                </p>

                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Rate dispute, attendance discrepancy, or duplicate submission..."
                  className="w-full p-3 rounded-lg bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-rose-500 transition resize-none"
                />
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectDialogOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
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
