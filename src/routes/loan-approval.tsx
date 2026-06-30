import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronRight,
  CheckCircle2,
  Search,
  FileText,
  Printer,
  Download,
  UserCheck,
  ShieldCheck,
  XCircle,
  Activity,
  Banknote,
} from "lucide-react";

export const Route = createFileRoute("/loan-approval")({
  component: LoanApprovalPage,
  head: () => ({
    meta: [
      { title: "Loan Approvals — CRIPTON" },
      { name: "description", content: "Review and approve employee loan applications." },
    ],
  }),
});

interface LoanRequest {
  id: string;
  empId: string;
  empIdOff: string;
  empName: string;
  areaName: string;
  joinDate: string;
  expLoanAmount: number;
  status: "Pending" | "Approved" | "Rejected";
}

const mockListData: LoanRequest[] = [
  {
    id: "LN-2001",
    empId: "2019013884",
    empIdOff: "2019013884",
    empName: "Javed Mia",
    areaName: "PSL-Operation",
    joinDate: "12/01/2019",
    expLoanAmount: 30000,
    status: "Pending",
  },
  {
    id: "LN-2002",
    empId: "2023045146",
    empIdOff: "",
    empName: "Asif Hossain",
    areaName: "PSL-Operation",
    joinDate: "04/10/2023",
    expLoanAmount: 50000,
    status: "Pending",
  },
  {
    id: "LN-2003",
    empId: "2021022804",
    empIdOff: "",
    empName: "Kaikobad Howlader",
    areaName: "PSL-HR",
    joinDate: "01/05/2021",
    expLoanAmount: 15000,
    status: "Approved",
  },
];

function LoanApprovalPage() {
  const [mainTab, setMainTab] = useState<"hod" | "hr">("hod");
  const [records, setRecords] = useState<LoanRequest[]>(mockListData);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (selectedArea !== "ALL" && r.areaName !== selectedArea) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.empName.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, selectedStatus, selectedArea, searchQuery]);

  const stats = useMemo(() => {
    let totalPending = 0;
    let pendingAmount = 0;
    let approvedAmount = 0;

    records.forEach((r) => {
      if (r.status === "Pending") {
        totalPending++;
        pendingAmount += r.expLoanAmount;
      } else if (r.status === "Approved") {
        approvedAmount += r.expLoanAmount;
      }
    });

    return { totalPending, pendingAmount, approvedAmount, totalRecords: records.length };
  }, [records]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(
        new Set(filteredRecords.filter((r) => r.status === "Pending").map((r) => r.id)),
      );
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to approve ${selectedIds.size} loan applications?`)) return;

    setRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: "Approved" } : r)),
    );
    setSelectedIds(new Set());
    toast.success(`Successfully approved ${selectedIds.size} requests!`);
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    const remarks = window.prompt("Please provide a reason for bulk rejection:");
    if (remarks === null) return;

    setRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: "Rejected" } : r)),
    );
    setSelectedIds(new Set());
    toast.success(`Successfully rejected ${selectedIds.size} requests!`);
  };

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Rejected") => {
    if (newStatus === "Rejected") {
      const remarks = window.prompt("Please provide a reason for rejection:");
      if (remarks === null) return;
    }
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    toast.success(`Loan request ${newStatus.toLowerCase()} successfully!`);
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = [
      "Req ID",
      "Employee Name",
      "Employee ID",
      "Area",
      "Join Date",
      "Amount",
      "Status",
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.empName,
      r.empId,
      r.areaName,
      r.joinDate,
      r.expLoanAmount,
      r.status,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `loan_approvals_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 print:hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">Payroll Approval</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  Loan Approvals
                </span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-md ${mainTab === "hod" ? "bg-amber-500/10 text-amber-600" : "bg-blue-600/10 text-blue-600"}`}
                >
                  {mainTab === "hod" ? (
                    <UserCheck className="size-4" />
                  ) : (
                    <ShieldCheck className="size-4" />
                  )}
                </div>
                <span>Loan Approval Validation</span>
              </h1>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
              <button
                onClick={() => setMainTab("hod")}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${mainTab === "hod" ? "bg-amber-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700"}`}
              >
                <UserCheck className="size-3.5" />
                HOD APPROVAL
              </button>
              <button
                onClick={() => setMainTab("hr")}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${mainTab === "hr" ? "bg-[#2563eb] text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700"}`}
              >
                <ShieldCheck className="size-3.5" />
                HR APPROVAL
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0 print:hidden">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <FileText className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Total Applications
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {stats.totalRecords} Records
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-emerald-500/10 bg-emerald-500/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider">
                  Approved Liability
                </p>
                <h3 className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  ৳ {stats.approvedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-amber-500/10 bg-amber-500/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase tracking-wider">
                  Pending Liability
                </p>
                <h3 className="text-sm font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
                  ৳ {stats.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-[#1e88e5]/20 bg-[#1e88e5]/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[#1e88e5] shrink-0 border border-[#1e88e5]/20">
                <Banknote className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#1e88e5]/70 uppercase tracking-wider">
                  Pending Approvals
                </p>
                <h3 className="text-sm font-extrabold text-[#1e88e5] mt-0.5">
                  {stats.totalPending} Awaiting
                </h3>
              </div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 print:hidden space-y-3">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-8.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="h-8.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="ALL">All Areas</option>
                  <option value="PSL-Operation">PSL-Operation</option>
                  <option value="PSL-HR">PSL-HR</option>
                  <option value="PSL-IT">PSL-IT</option>
                </select>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ID or Employee Name..."
                    className="w-full h-8.5 pl-8 pr-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-[#2563eb] transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleExportCSV}
                  className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition text-emerald-600"
                >
                  <Download className="size-3.5" /> Export
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition text-[#2563eb]"
                >
                  <Printer className="size-3.5" /> Print
                </button>
              </div>
            </div>
          </div>

          {/* Main Table Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
            {selectedIds.size > 0 && (
              <div className="p-3 bg-[#2563eb]/5 border-b border-[#2563eb]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/20"
                  >
                    {selectedIds.size} Selected
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">
                    records ready for action
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkReject}
                    className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                  >
                    <XCircle className="size-3.5" /> Reject Selected
                  </button>
                  <button
                    onClick={handleBulkApprove}
                    className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm"
                  >
                    <CheckCircle2 className="size-3.5" /> Approve Selected
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr>
                    {selectedStatus === "Pending" && (
                      <th className="px-4 py-3 w-[50px] text-center border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                          onChange={handleSelectAll}
                          checked={
                            selectedIds.size ===
                              filteredRecords.filter((r) => r.status === "Pending").length &&
                            selectedIds.size > 0
                          }
                        />
                      </th>
                    )}
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 w-[60px]">
                      Sl
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                      Employee Details
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[150px]">
                      Area Name
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[120px]">
                      Join Date
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right border-r border-slate-200 dark:border-slate-800 w-[150px]">
                      Exp. Loan Amount
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[120px]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center w-[100px] print:hidden">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-b border-slate-100 dark:divide-slate-800 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  {filteredRecords.map((row, idx) => {
                    const isChecked = selectedIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isChecked ? "bg-[#2563eb]/5 dark:bg-[#2563eb]/10" : ""}`}
                      >
                        {selectedStatus === "Pending" && (
                          <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                            {row.status === "Pending" && (
                              <input
                                type="checkbox"
                                className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                                checked={isChecked}
                                onChange={() => handleSelectOne(row.id)}
                              />
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            {row.empName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {row.empId} {row.empIdOff ? `(Off: ${row.empIdOff})` : ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                          {row.areaName}
                        </td>
                        <td className="px-4 py-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">
                          {row.joinDate}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-[#2563eb] border-r border-slate-200 dark:border-slate-800">
                          {row.expLoanAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                          {row.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                              <Activity className="size-3" /> Pending
                            </span>
                          )}
                          {row.status === "Approved" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                              <CheckCircle2 className="size-3" /> Approved
                            </span>
                          )}
                          {row.status === "Rejected" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                              <XCircle className="size-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Viewing details for ${row.empName}`);
                              }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#2563eb] rounded transition"
                              title="View Details"
                            >
                              <Search className="size-3.5" />
                            </button>
                            {row.status === "Pending" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(row.id, "Approved");
                                  }}
                                  className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-500 rounded transition"
                                  title="Approve"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(row.id, "Rejected");
                                  }}
                                  className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded transition"
                                  title="Reject"
                                >
                                  <XCircle className="size-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-slate-500 font-medium">
                        No loan requests found matching the current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0 print:hidden">
              <div>Showing {filteredRecords.length} records</div>
              <div className="flex items-center gap-1.5">
                <button className="text-slate-400 hover:text-slate-600 transition-colors" disabled>
                  Previous
                </button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">
                  1
                </button>
                <button className="text-slate-400 hover:text-slate-600 transition-colors" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
