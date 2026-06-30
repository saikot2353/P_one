import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight,
  Search,
  Printer,
  FileText,
  Eye,
  Table as TableIcon,
  CalendarRange,
  CheckCircle2,
  Clock,
  XCircle,
  FolderOpen,
} from "lucide-react";
import { LeaveApplicationModal } from "@/components/ssp/LeaveApplicationModal";
import { GeneralStoreRequisitionModal } from "@/components/ssp/GeneralStoreRequisitionModal";

export const Route = createFileRoute("/ssp-my-requisition")({
  component: MyRequisitionPage,
});

type RequisitionStatus = "Approved" | "Pending" | "Rejected";

interface RequisitionRow {
  id: string;
  reqNum: string;
  date: string;
  status: RequisitionStatus;
  doc: string;
  note: string;
  onClickView: () => void;
}

function MyRequisitionPage() {
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  // States
  const [requester, setRequester] = useState("Tahmid Afsar");
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | "All">("All");
  const [dateFrom, setDateFrom] = useState("2026-03-01");
  const [dateTo, setDateTo] = useState("2026-06-08");
  const [reqNumber, setReqNumber] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  const requesterOptions = [{ value: "Tahmid Afsar", label: "Tahmid Afsar (Assistant Manager)" }];

  const tableData: RequisitionRow[] = [
    {
      id: "378956",
      reqNum: "378956",
      date: "2026-05-05",
      status: "Approved",
      doc: "General Product Store Requisition",
      note: "",
      onClickView: () => setStoreModalOpen(true),
    },
    {
      id: "372569",
      reqNum: "372569",
      date: "2026-04-01",
      status: "Approved",
      doc: "Leave Application",
      note: "",
      onClickView: () => setLeaveModalOpen(true),
    },
  ];

  // Calculate stats
  const totalCount = tableData.length;
  const approvedCount = tableData.filter((r) => r.status === "Approved").length;
  const pendingCount = tableData.filter((r) => r.status === "Pending").length;
  const rejectedCount = tableData.filter((r) => r.status === "Rejected").length;

  // Filter logic
  const filteredData = tableData.filter((row) => {
    if (statusFilter !== "All" && row.status !== statusFilter) return false;
    if (reqNumber && !row.reqNum.includes(reqNumber)) return false;
    if (globalSearch) {
      const search = globalSearch.toLowerCase();
      return (
        row.reqNum.includes(search) ||
        row.doc.toLowerCase().includes(search) ||
        row.date.includes(search)
      );
    }
    return true;
  });

  return (
    <div className="h-screen flex bg-[#f1f5f9] text-[#334155] overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-4 overflow-hidden">
          {/* Header Block */}
          <div className="bg-white border border-slate-200/80 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-primary transition-colors">SSP</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-655 font-semibold">My Requisition</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-slate-400" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800">My Requisitions</h1>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Track and monitor the status of all requisitions you have submitted.
            </div>
          </div>

          {/* KPI Dashboard Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
            {/* Total Requisitions */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3">
              <div className="size-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-555 shrink-0 border border-slate-100">
                <FolderOpen className="size-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Submitted
                </p>
                <h3 className="text-base font-black text-slate-800 leading-none mt-0.5">
                  {totalCount} Requests
                </h3>
              </div>
            </div>

            {/* Approved */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3">
              <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/40">
                <CheckCircle2 className="size-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Approved
                </p>
                <h3 className="text-base font-black text-slate-800 leading-none mt-0.5">
                  {approvedCount} Requests
                </h3>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3">
              <div className="size-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100/40">
                <Clock className="size-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Pending
                </p>
                <h3 className="text-base font-black text-slate-800 leading-none mt-0.5">
                  {pendingCount} Requests
                </h3>
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3">
              <div className="size-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 border border-rose-100/40">
                <XCircle className="size-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Rejected
                </p>
                <h3 className="text-base font-black text-slate-800 leading-none mt-0.5">
                  {rejectedCount} Requests
                </h3>
              </div>
            </div>
          </div>

          {/* Smart Filters and Navigation Bar */}
          <div className="bg-white border border-slate-200/80 rounded-lg p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row xl:items-center justify-between gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-3">
              {/* Requester Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Employee:
                </span>
                <SearchableSelect
                  value={requester}
                  onChange={setRequester}
                  options={requesterOptions}
                  className="h-8 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-2"
                />
              </div>

              {/* Date From & To */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-3xs">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-7 px-1.5 bg-transparent border-0 text-[10.5px] font-bold focus:outline-none"
                />
                <span className="text-slate-350 text-[10.5px] font-bold">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-7 px-1.5 bg-transparent border-0 text-[10.5px] font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Smart Filter Pills (One-click filtering) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-3xs">
                {(["All", "Approved", "Pending", "Rejected"] as const).map((filter) => {
                  const isActive = statusFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${
                        isActive
                          ? "bg-slate-700 text-white shadow-3xs"
                          : "text-slate-500 hover:bg-white/40 hover:text-slate-800"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-40">
                <Search className="absolute left-2.5 top-2 size-3 text-slate-400" />
                <input
                  type="text"
                  value={reqNumber}
                  onChange={(e) => setReqNumber(e.target.value)}
                  placeholder="Req Number..."
                  className="h-7.5 pl-8 pr-3 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Action Toolbar & Requisitions List Table Card */}
          <div className="flex-1 bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-200 bg-slate-50/20 shrink-0">
              <div className="flex items-center gap-1.5">
                <button className="h-8 px-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 bg-white cursor-pointer shadow-3xs">
                  <TableIcon className="size-3.5 text-emerald-600" /> EXCEL
                </button>
                <button className="h-8 px-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 bg-white cursor-pointer shadow-3xs">
                  <Printer className="size-3.5 text-slate-500" /> PRINT
                </button>
                <button className="h-8 px-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 bg-white cursor-pointer shadow-3xs">
                  <FileText className="size-3.5 text-rose-500" /> PDF
                </button>
              </div>

              <div className="relative w-48">
                <Search className="absolute left-2.5 top-2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Quick Search..."
                  className="h-7.5 w-full pl-8.5 pr-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Contiguous Data Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-white border-b border-slate-200 z-10 shadow-3xs">
                  <tr className="bg-[#fafafa]">
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Actions
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      ReqNum
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      ReqDate
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Document
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      ReqNote
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-5 py-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={row.onClickView}
                            className="size-7 rounded-lg bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-900 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-3xs"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button className="size-7 rounded-lg bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-900 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-3xs">
                            <Printer className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-2 font-bold text-slate-800">{row.reqNum}</td>
                      <td className="px-5 py-2 text-slate-500 font-mono">{row.date}</td>
                      <td className="px-5 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                            row.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : "bg-amber-50 text-amber-700 border-amber-200/50"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-2 text-slate-800">{row.doc}</td>
                      <td className="px-5 py-2 text-slate-400 font-normal italic">
                        {row.note || "—"}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                        No requisitions found matching current status/filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-5 py-2.5 border-t border-slate-200 bg-slate-50/10 shrink-0">
              <div>
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  className="text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30"
                  disabled
                >
                  Previous
                </button>
                <button className="size-5.5 rounded bg-slate-700 text-white flex items-center justify-center shadow-sm text-[9.5px]">
                  1
                </button>
                <button
                  className="text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30"
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LeaveApplicationModal open={leaveModalOpen} onOpenChange={setLeaveModalOpen} />
      <GeneralStoreRequisitionModal open={storeModalOpen} onOpenChange={setStoreModalOpen} />
    </div>
  );
}
