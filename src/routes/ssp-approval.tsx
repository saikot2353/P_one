import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Printer,
  FileText,
  Eye,
  Table as TableIcon,
  X,
  CheckCircle2,
  Clock,
  CornerUpRight,
  MessageSquare,
  User,
  FileCheck,
  CalendarDays,
  XCircle,
  FolderOpen,
  Building,
  MapPin,
  Paperclip,
  Phone,
  CheckSquare,
} from "lucide-react";

export const Route = createFileRoute("/ssp-approval")({
  component: SSPApprovalPage,
});

type RequisitionStatus = "Approved" | "Pending" | "Rejected";

interface Requisition {
  id: string;
  reqNum: string;
  date: string;
  requestor: string;
  reqFrom: string;
  department: string;
  document: string;
  note: string;
  status: RequisitionStatus;
  details: {
    empId: string;
    doj: string;
    designation: string;
    section: string;
    location: string;
    type: string;
    category: string;
    dates: string;
    duration: string;
    contact: string;
    responsible: string;
    purpose: string;
    balances: {
      leaveType: string;
      enjoyed: number;
      balance: number;
      dateFrom: string;
      dateTo: string;
      duration: string;
      payType: string;
    }[];
    signatures: {
      role: string;
      name: string;
      title: string;
      date: string;
      status: "Approved" | "Pending";
    }[];
  };
}

// Dummy Requisitions matching screenshots
const dummyRequisitions: Requisition[] = [
  {
    id: "382650",
    reqNum: "382650",
    date: "2026-05-24",
    requestor: "Parvej Mahmud",
    reqFrom: "PSL-Operation",
    department: "Business Innovation",
    document: "Leave Application",
    note: "",
    status: "Approved",
    details: {
      empId: "20260658726",
      doj: "22/02/2026",
      designation: "Officer",
      section: "APPS Team",
      location: "Pakiza Software Limited, PSL-Operation",
      type: "Casual Leave",
      category: "Full Day Leave",
      dates: "23/05/2026 to 23/05/2026",
      duration: "1 Days",
      contact: "01521205808",
      responsible: "—",
      purpose: "went to buy cow for Eid Ul Adha",
      balances: [
        {
          leaveType: "Casual Leave",
          enjoyed: 1,
          balance: 8,
          dateFrom: "23/05/2026",
          dateTo: "23/05/2026",
          duration: "1 Days",
          payType: "With Pay",
        },
      ],
      signatures: [
        {
          role: "Manager",
          name: "Md. Anik Islam",
          title: "Deputy Manager",
          date: "25/05/2026 10:07:53",
          status: "Approved",
        },
        {
          role: "HOD",
          name: "Tahmid Afsar",
          title: "Assistant Manager",
          date: "29/05/2026 21:59:47",
          status: "Approved",
        },
        {
          role: "HOD",
          name: "Md. Zahidul Islam",
          title: "COO",
          date: "06/06/2026 14:43:07",
          status: "Approved",
        },
        {
          role: "Head of HR",
          name: "Rajebul Hasan Rajon",
          title: "Deputy Manager",
          date: "06/06/2026 15:12:22",
          status: "Approved",
        },
        {
          role: "Forwarded Approval",
          name: "Rakibul Islam Khan",
          title: "Managing Director (MD's)",
          date: "06/06/2026 18:27:04",
          status: "Approved",
        },
      ],
    },
  },
  {
    id: "382078",
    reqNum: "382078",
    date: "2026-05-21",
    requestor: "Md Mahir Shahriyar",
    reqFrom: "PSL-Operation",
    department: "Business Innovation",
    document: "Leave Application",
    note: "",
    status: "Approved",
    details: {
      empId: "20260658799",
      doj: "10/01/2025",
      designation: "Officer",
      section: "Dev Team",
      location: "Pakiza Software Limited, PSL-Operation",
      type: "Sick Leave",
      category: "Full Day Leave",
      dates: "20/05/2026 to 22/05/2026",
      duration: "3 Days",
      contact: "01712345678",
      responsible: "Md. Anik Islam",
      purpose: "Fever and cold checkup",
      balances: [
        {
          leaveType: "Sick Leave",
          enjoyed: 3,
          balance: 10,
          dateFrom: "20/05/2026",
          dateTo: "22/05/2026",
          duration: "3 Days",
          payType: "With Pay",
        },
      ],
      signatures: [
        {
          role: "Manager",
          name: "Md. Anik Islam",
          title: "Deputy Manager",
          date: "22/05/2026 09:12:00",
          status: "Approved",
        },
        {
          role: "HOD",
          name: "Tahmid Afsar",
          title: "Assistant Manager",
          date: "22/05/2026 18:45:00",
          status: "Approved",
        },
        {
          role: "Head of HR",
          name: "Rajebul Hasan Rajon",
          title: "Deputy Manager",
          date: "23/05/2026 11:20:00",
          status: "Approved",
        },
      ],
    },
  },
  {
    id: "381510",
    reqNum: "381510",
    date: "2026-05-18",
    requestor: "Parvej Mahmud",
    reqFrom: "PSL-Operation",
    department: "Business Innovation",
    document: "ICT Product Store Requisition",
    note: "",
    status: "Approved",
    details: {
      empId: "20260658726",
      doj: "22/02/2026",
      designation: "Officer",
      section: "APPS Team",
      location: "Pakiza Software Limited, PSL-Operation",
      type: "ICT Requisition",
      category: "ICT Store Mode",
      dates: "18/05/2026",
      duration: "1 Items",
      contact: "01521205808",
      responsible: "Tahmid Afsar",
      purpose: "New employee developer laptop replacement",
      balances: [
        {
          leaveType: "ICT Requisition",
          enjoyed: 1,
          balance: 0,
          dateFrom: "18/05/2026",
          dateTo: "18/05/2026",
          duration: "1 Item",
          payType: "Approved Allocation",
        },
      ],
      signatures: [
        {
          role: "IT Admin",
          name: "IT Specialist",
          title: "IT Dept",
          date: "18/05/2026 11:00:00",
          status: "Approved",
        },
        {
          role: "HOD",
          name: "Tahmid Afsar",
          title: "Assistant Manager",
          date: "19/05/2026 14:30:00",
          status: "Approved",
        },
      ],
    },
  },
];

function SSPApprovalPage() {
  const [selectedReq, setSelectedReq] = useState<Requisition | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsHistory, setCommentsHistory] = useState<
    Record<string, { user: string; text: string; date: string }[]>
  >({
    "382650": [
      {
        user: "Md. Anik Islam",
        text: "Approved, eligible for casual leave.",
        date: "25/05/2026 10:07",
      },
    ],
  });

  // Filter States
  const [approver, setApprover] = useState("Tahmid Afsar");
  const [location, setLocation] = useState("All Location");
  const [docType, setDocType] = useState("All Document");
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | "All">("Approved");
  const [reqNumSearch, setReqNumSearch] = useState("");
  const [dateType, setDateType] = useState("Requisition Date");
  const [dateFrom, setDateFrom] = useState("2026-03-01");
  const [dateTo, setDateTo] = useState("2026-06-08");
  const [globalSearch, setGlobalSearch] = useState("");

  const approverOptions = [{ value: "Tahmid Afsar", label: "Tahmid Afsar (Assistant Manager)" }];
  const locationOptions = [
    { value: "All Location", label: "All Location" },
    { value: "PSL-Operation", label: "PSL-Operation" },
  ];
  const docTypeOptions = [
    { value: "All Document", label: "All Document" },
    { value: "Leave Application", label: "Leave Application" },
    { value: "ICT Product Store Requisition", label: "ICT Product Store Requisition" },
  ];
  const dateTypeOptions = [
    { value: "Requisition Date", label: "Requisition Date" },
    { value: "Effective Date", label: "Effective Date" },
  ];

  const handleOpenModal = (req: Requisition) => {
    setSelectedReq(req);
    setCommentText("");
    setModalOpen(true);
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedReq) return;
    const newComment = {
      user: "Tahmid Afsar (You)",
      text: commentText,
      date: new Date().toLocaleString(),
    };
    setCommentsHistory((prev) => ({
      ...prev,
      [selectedReq.id]: [...(prev[selectedReq.id] || []), newComment],
    }));
    setCommentText("");
  };

  // Stats
  const totalCount = dummyRequisitions.length;
  const approvedCount = dummyRequisitions.filter((r) => r.status === "Approved").length;
  const pendingCount = dummyRequisitions.filter((r) => r.status === "Pending").length;
  const rejectedCount = dummyRequisitions.filter((r) => r.status === "Rejected").length;

  // Filter logic
  const filteredData = dummyRequisitions.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) return false;
    if (docType !== "All Document" && item.document !== docType) return false;
    if (reqNumSearch && !item.reqNum.includes(reqNumSearch)) return false;
    if (globalSearch) {
      const search = globalSearch.toLowerCase();
      return (
        item.requestor.toLowerCase().includes(search) ||
        item.reqNum.includes(search) ||
        item.department.toLowerCase().includes(search) ||
        item.document.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10">
          {/* Header Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-primary transition-colors">SSP</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  Approval Queue
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  SSP Requisition Approvals
                </h1>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Review, comment on, and authorize leave applications and general requisitions.
            </div>
          </div>

          {/* KPI Dashboard Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
            {/* Total Requisitions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <FolderOpen className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Total Queue
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {totalCount} Requests
                </h3>
              </div>
            </div>

            {/* Approved */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Approved
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {approvedCount} Requests
                </h3>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Pending
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {pendingCount} Requests
                </h3>
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-100 dark:border-rose-800">
                <XCircle className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Rejected
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {rejectedCount} Requests
                </h3>
              </div>
            </div>
          </div>

          {/* Smart Filters (Dynamic layout grid, compact) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-3.5 gap-y-2.5">
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Approver
                </label>
                <SearchableSelect
                  value={approver}
                  onChange={setApprover}
                  options={approverOptions}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Location
                </label>
                <SearchableSelect
                  value={location}
                  onChange={setLocation}
                  options={locationOptions}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Document
                </label>
                <SearchableSelect
                  value={docType}
                  onChange={setDocType}
                  options={docTypeOptions}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Date For
                </label>
                <SearchableSelect
                  value={dateType}
                  onChange={setDateType}
                  options={dateTypeOptions}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Date From & To in a combined card */}
              <div className="space-y-0.5 xl:col-span-2">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Date Period
                </label>
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-7 px-1.5 bg-transparent border-0 text-[10px] font-bold focus:outline-none flex-1 min-w-0 text-slate-800 dark:text-slate-200"
                  />
                  <span className="text-slate-400 dark:text-slate-600 text-[9px] font-bold">
                    to
                  </span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-7 px-1.5 bg-transparent border-0 text-[10px] font-bold focus:outline-none flex-1 min-w-0 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
              {/* Monochromatic Status Filter Pills */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-inner">
                {(["All", "Approved", "Pending", "Rejected"] as const).map((filter) => {
                  const isActive = statusFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${
                        isActive
                          ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-40">
                  <Search className="absolute left-2.5 top-2 size-3 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={reqNumSearch}
                    onChange={(e) => setReqNumSearch(e.target.value)}
                    placeholder="Req Number..."
                    className="h-7.5 pl-8 pr-3 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>

                <button className="h-7.5 px-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm cursor-pointer">
                  <Search className="size-3" /> Search
                </button>
              </div>
            </div>
          </div>

          {/* Action Toolbar & Requisitions List Table Card */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
              <div className="flex items-center gap-1.5">
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <TableIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> EXCEL
                </button>
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <Printer className="size-3.5 text-slate-500 dark:text-slate-400" /> PRINT
                </button>
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <FileText className="size-3.5 text-rose-500 dark:text-rose-400" /> PDF
                </button>
              </div>

              <div className="relative w-48">
                <Search className="absolute left-2.5 top-2 size-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Quick Search..."
                  className="h-7.5 w-full pl-8.5 pr-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-400 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Contiguous Data Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr className="bg-slate-50 dark:bg-slate-950">
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Actions
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      ReqNum
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      ReqDate
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Requestor
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      ReqFrom
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Department
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Document
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      ReqNote
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-b border-slate-100 dark:divide-slate-800 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {filteredData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="px-5 py-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenModal(row)}
                            className="size-7 rounded-lg bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button className="size-7 rounded-lg bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-sm">
                            <Printer className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-2 font-bold text-slate-800 dark:text-slate-100">
                        {row.reqNum}
                      </td>
                      <td className="px-5 py-2 text-slate-500 dark:text-slate-400 font-mono">
                        {row.date}
                      </td>
                      <td className="px-5 py-2 text-slate-800 dark:text-slate-200">
                        {row.requestor}
                      </td>
                      <td className="px-5 py-2 text-slate-400 dark:text-slate-500">
                        {row.reqFrom}
                      </td>
                      <td className="px-5 py-2 text-slate-500 dark:text-slate-400">
                        {row.department}
                      </td>
                      <td className="px-5 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${
                            row.document.includes("Leave")
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900"
                              : "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900"
                          }`}
                        >
                          {row.document}
                        </span>
                      </td>
                      <td className="px-5 py-2 text-slate-400 dark:text-slate-500 font-normal italic">
                        {row.note || "—"}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-slate-400 dark:text-slate-500 font-bold"
                      >
                        No requisitions found matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-30"
                  disabled
                >
                  Previous
                </button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">
                  1
                </button>
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-30"
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Requisition Approval Modal */}
      {selectedReq && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-5xl p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl overflow-hidden gap-0 max-h-[92vh] flex flex-col [&>button]:hidden text-slate-700 dark:text-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-700 shadow-3xs">
                  <CalendarDays className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">
                      {selectedReq.document}
                    </h2>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                      selectedReq.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : selectedReq.status === "Rejected"
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      • {selectedReq.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                    # Application No: PSL-RQ-{selectedReq.document.toUpperCase().includes("LEAVE") ? "LEAVE" : "ICT"}-{selectedReq.reqNum}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right border-r border-slate-100 dark:border-slate-800 pr-4">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-widest font-extrabold">
                    APPLICATION DATE
                  </span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 block mt-0.5">
                    {new Date(selectedReq.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                  <span className="text-[9.5px] text-slate-400 dark:text-slate-500 block mt-0.5 font-semibold">
                    Submitted 09:18 AM
                  </span>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shrink-0 shadow-3xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f8fafc]/40 dark:bg-slate-950/20">
              
              {/* REQUESTER & REQUEST FOR Section (2nd Image design) */}
              <div className="bg-[#fcfdfd] dark:bg-slate-900 border border-slate-200/80 rounded-xl p-5 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6 relative text-slate-700 dark:text-slate-200">
                {/* Column 1: Requester Details */}
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-750 dark:text-slate-350 uppercase tracking-widest mb-3">
                    <User className="size-3.5 text-blue-600 dark:text-blue-400" />
                    REQUESTER:
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-450">
                    <h4 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-100 mb-2">
                      {selectedReq.requestor}
                    </h4>
                    <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 font-semibold text-[11px]">
                      <span className="text-slate-400">Emp Id:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.empId}</span>

                      <span className="text-slate-400">DOJ:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.doj}</span>

                      <span className="text-slate-400">Designation:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.designation}</span>

                      <span className="text-slate-400">Section:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.section}</span>

                      <span className="text-slate-400">Dept:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.department}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 font-bold text-[11px] mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {selectedReq.details.location}
                    </div>
                  </div>
                </div>

                {/* Column 2: Request For Details */}
                <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-5 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-750 dark:text-slate-350 uppercase tracking-widest mb-3">
                    <Building className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                    REQUEST FOR:
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-450 text-slate-700 dark:text-slate-200">
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-slate-400">Department:</span>
                      <span className="text-slate-750 dark:text-slate-150 font-bold">{selectedReq.department}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-slate-400">Section:</span>
                      <span className="text-slate-750 dark:text-slate-150 font-bold">{selectedReq.details.section}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Details section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-900 shadow-3xs">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Leave Details</span>
                </div>

                <div className="pl-1 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 font-semibold text-slate-700 dark:text-slate-200 mt-2">
                    <div className="flex items-center gap-1 md:col-span-2">
                      <span className="text-slate-400 dark:text-slate-500 font-normal">Leave Type:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.type}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 dark:text-slate-500 font-normal">Category:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.category}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 dark:text-slate-500 font-normal">Contact:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">{selectedReq.details.contact}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 dark:text-slate-500 font-normal">From Date:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">
                        {selectedReq.details.balances[0]?.dateFrom || selectedReq.details.dates.split(" to ")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 dark:text-slate-500 font-normal">Responsible:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.responsible}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 dark:text-slate-500 font-normal">To Date:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold font-mono">
                        {selectedReq.details.balances[0]?.dateTo || selectedReq.details.dates.split(" to ")[1] || selectedReq.details.dates}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 dark:text-slate-500 font-normal">Documents:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">None uploaded</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 dark:text-slate-500 font-normal">Duration:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.duration}</span>
                    </div>

                    <div className="flex items-start gap-1 md:col-span-2">
                      <span className="text-slate-400 dark:text-slate-500 font-normal shrink-0">Address:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">{selectedReq.details.location}</span>
                    </div>

                    <div className="flex items-start gap-1 md:col-span-2">
                      <span className="text-slate-400 dark:text-slate-500 font-normal shrink-0">Purpose:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold italic">"{selectedReq.details.purpose}"</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Balance Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#fcfdfd] dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 w-16">SL</th>
                      <th className="px-4 py-3">LEAVE TYPE</th>
                      <th className="px-4 py-3">ENJOYED</th>
                      <th className="px-4 py-3">BALANCE</th>
                      <th className="px-4 py-3">DATE RANGE</th>
                      <th className="px-4 py-3">DURATION</th>
                      <th className="px-4 py-3">PAY TYPE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {selectedReq.details.balances.map((bal, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 flex items-center gap-2">
                          <CheckSquare className="size-3.5 text-blue-600 shrink-0" />
                          <span className="text-slate-850 dark:text-slate-200">2</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-850 dark:text-slate-100">{bal.leaveType}</td>
                        <td className="px-4 py-3">{bal.enjoyed}</td>
                        <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-extrabold">{bal.balance}</td>
                        <td className="px-4 py-3 font-mono text-[11px]">
                          {bal.dateFrom} — {bal.dateTo}
                        </td>
                        <td className="px-4 py-3">{bal.duration}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 rounded text-[10px] font-bold">
                            <FileText className="size-3 shrink-0" />
                            {bal.payType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Approval Workflow & Signatures */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-1.5">
                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-900 shadow-3xs">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Approval Workflow & Signatures</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {selectedReq.details.signatures.map((sig, idx) => {
                    const isApproved = sig.status === "Approved";
                    return (
                      <div
                        key={idx}
                        className={`p-3 border rounded-xl flex flex-col justify-between h-[105px] relative transition-all ${
                          isApproved
                            ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                              {sig.role}
                            </span>
                            <span className={`inline-flex items-center gap-0.5 text-[8.5px] font-black uppercase ${isApproved ? "text-emerald-600" : "text-amber-500"}`}>
                              {isApproved ? "✓ Approved" : "🕒 Pending"}
                            </span>
                          </div>
                          <p className="text-[11.5px] font-extrabold text-slate-800 dark:text-slate-100 leading-snug truncate">
                            {sig.name}
                          </p>
                          <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold truncate leading-tight">
                            {sig.title}
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[8.5px] text-slate-400 font-mono">
                          {isApproved ? (
                            <>
                              <span>{sig.date.split(" ")[1] || "12:00 AM"}</span>
                              <span>{sig.date.split(" ")[0]}</span>
                            </>
                          ) : (
                            <span className="italic">Pending</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comments & Approval Notes */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-1.5">
                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-900 shadow-3xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Comments & Approval Notes</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Comments List */}
                  <div className="lg:col-span-8 space-y-3 max-h-[180px] overflow-y-auto pr-1">
                    {(commentsHistory[selectedReq.id] || []).map((comm, idx) => {
                      const initials = comm.user.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
                      return (
                        <div key={idx} className="flex gap-3 items-start bg-slate-50/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-slate-750 dark:text-slate-250">
                          <div className="w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[11.5px] font-extrabold text-slate-750 dark:text-slate-250">
                                {comm.user} <span className="text-slate-400 font-semibold">· Manager</span>
                              </span>
                              <span className="text-[9.5px] text-slate-400 font-semibold font-mono">{comm.date}</span>
                            </div>
                            <p className="text-[11.5px] font-semibold text-slate-650 dark:text-slate-350 leading-relaxed">
                              {comm.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {(!commentsHistory[selectedReq.id] || commentsHistory[selectedReq.id].length === 0) && (
                      <div className="h-20 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-bold bg-slate-50/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        No previous comments recorded.
                      </div>
                    )}
                  </div>

                  {/* Right Column: Add Comment Form */}
                  <div className="lg:col-span-4 flex flex-col gap-2.5 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Add Decision Comment</h4>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Type comment or notes here..."
                      className="w-full flex-1 min-h-[90px] p-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-slate-400 bg-slate-50 dark:bg-slate-950 placeholder:text-slate-400/50 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddComment}
                        className="h-8 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10.5px] font-extrabold transition-all flex items-center gap-1 cursor-pointer shadow-3xs"
                      >
                        Post Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/30 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                Click action below to execute your requisition decision status.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="h-8.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="h-8.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                >
                  <CornerUpRight className="size-3.5" /> Forward
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="h-8.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                >
                  <X className="size-3.5" /> Reject
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="size-3.5" /> Approve
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
