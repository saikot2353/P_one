import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  FileCheck2,
  X,
  Printer,
  FileText,
  User,
  Briefcase,
  Calendar,
  Search,
  RotateCcw,
  UserCheck,
  Check,
  Info,
  Filter,
  CheckSquare2,
  XCircle,
  Zap,
  Award,
  Wallet,
  ArrowUpRight,
  Sliders,
  Send,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/separation-clearance-approval")({
  head: () => ({
    meta: [
      { title: "Clearance Approval Console — Separation Module | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Parallel clearance approval queue with instant full-detail inspection modal and multi-department verification.",
      },
    ],
  }),
  component: SeparationClearanceApprovalPage,
});

export type ClearanceStatus = "Approved" | "Pending" | "Rejected";

export interface DeptClearanceState {
  status: ClearanceStatus;
  remarks?: string;
  clearedBy?: string;
  clearedDate?: string;
}

export interface EmployeeClearanceRecord {
  id: string;
  type: "Clearance Request" | "Advance Request" | "Leave Request" | "Increment Request";
  empId: string;
  empName: string;
  department: string;
  designation: string;
  joiningDate: string;
  noticeDate: string;
  lastWorkingDate: string;
  separationType: string;
  immediateReportingName: string;
  immediateReportingDesignation: string;
  resignationReason: string;
  hrDirectives: string;

  accounts: DeptClearanceState;
  administration: DeptClearanceState;
  ict: DeptClearanceState;
  immediateReporting: DeptClearanceState;
  hrDepartment: DeptClearanceState;
  coo: DeptClearanceState;

  overallStatus: "In Progress" | "Fully Cleared" | "Blocked";
}

export type ApproverRole =
  | "ALL"
  | "accounts"
  | "administration"
  | "ict"
  | "immediateReporting"
  | "hrDepartment"
  | "coo";

const ROLE_LABELS: Record<ApproverRole, string> = {
  ALL: "Master Admin (All Departments)",
  accounts: "Accounts & Finance",
  administration: "Administration",
  ict: "ICT & Systems",
  immediateReporting: "Immediate Boss",
  hrDepartment: "HR Department",
  coo: "COO / Executive Office",
};

const initialClearanceRecords: EmployeeClearanceRecord[] = [
  {
    id: "CLR-2025-57068",
    type: "Clearance Request",
    empId: "2025057068",
    empName: "Riazul Islam",
    department: "Implementation & Business Analysis",
    designation: "Asst. Manager",
    joiningDate: "15/01/2023",
    noticeDate: "15/08/2026",
    lastWorkingDate: "2026-09-15",
    separationType: "Resignation",
    immediateReportingName: "Mahbubur Rahman",
    immediateReportingDesignation: "Manager (Software & Analysis)",
    resignationReason: "Better Career Opportunity in Enterprise Software Architecture",
    hrDirectives: "Verify all project handovers, ERP access revocation, and advance settlement.",
    accounts: {
      status: "Approved",
      remarks: "All loan balances & expense claims reconciled",
      clearedBy: "Accounts Dept Lead",
      clearedDate: "20/08/2026",
    },
    administration: {
      status: "Approved",
      remarks: "ID card, locker key & desk assets returned",
      clearedBy: "Admin Executive",
      clearedDate: "18/08/2026",
    },
    ict: {
      status: "Approved",
      remarks: "Laptop, email ID & VPN access revoked",
      clearedBy: "IT Support Admin",
      clearedDate: "19/08/2026",
    },
    immediateReporting: {
      status: "Approved",
      remarks: "Complete project handover verified",
      clearedBy: "Mahbubur Rahman",
      clearedDate: "16/08/2026",
    },
    hrDepartment: {
      status: "Approved",
      remarks: "Exit survey & service records complete",
      clearedBy: "HR Manager",
      clearedDate: "21/08/2026",
    },
    coo: { status: "Pending", remarks: "Awaiting final executive signoff" },
    overallStatus: "In Progress",
  },
  {
    id: "CLR-2026-012",
    type: "Clearance Request",
    empId: "2021051280",
    empName: "Farhana Akter",
    department: "Human Resource & Admin",
    designation: "HR Officer",
    joiningDate: "01/06/2021",
    noticeDate: "12/08/2026",
    lastWorkingDate: "2026-09-15",
    separationType: "Resignation",
    immediateReportingName: "Tariqul Islam",
    immediateReportingDesignation: "Senior HR Manager",
    resignationReason: "Personal & Higher Family Responsibilities",
    hrDirectives: "Ensure HR file handover, employee ID badge deposit, and final settlement calculation.",
    accounts: {
      status: "Approved",
      remarks: "No outstanding dues",
      clearedBy: "Finance Mgr",
      clearedDate: "20/08/2026",
    },
    administration: {
      status: "Approved",
      remarks: "Returned desk keys & access card",
      clearedBy: "Admin Officer",
      clearedDate: "18/08/2026",
    },
    ict: {
      status: "Approved",
      remarks: "Domain user account deactivated",
      clearedBy: "IT Lead",
      clearedDate: "19/08/2026",
    },
    immediateReporting: {
      status: "Approved",
      remarks: "Handover complete to Assistant Manager",
      clearedBy: "Tariqul Islam",
      clearedDate: "16/08/2026",
    },
    hrDepartment: {
      status: "Approved",
      remarks: "Exit survey done",
      clearedBy: "HR Lead",
      clearedDate: "21/08/2026",
    },
    coo: {
      status: "Approved",
      remarks: "Final Release Approved by Executive Director",
      clearedBy: "COO Office",
      clearedDate: "22/08/2026",
    },
    overallStatus: "Fully Cleared",
  },
  {
    id: "CLR-2026-013",
    type: "Clearance Request",
    empId: "2020093311",
    empName: "Rokeya Begum",
    department: "Finishing & Packing",
    designation: "Quality Inspector",
    joiningDate: "18/09/2020",
    noticeDate: "18/08/2026",
    lastWorkingDate: "2026-09-20",
    separationType: "Resignation",
    immediateReportingName: "Kabir Hossain",
    immediateReportingDesignation: "Floor Supervisor",
    resignationReason: "Relocation to Home District",
    hrDirectives: "Verify factory line inspection stamp deposit & attendance cards.",
    accounts: { status: "Pending" },
    administration: { status: "Pending" },
    ict: {
      status: "Approved",
      remarks: "N/A - Factory worker profile",
      clearedBy: "IT Helpdesk",
      clearedDate: "21/08/2026",
    },
    immediateReporting: {
      status: "Approved",
      remarks: "Line quality logs handed over",
      clearedBy: "Kabir Hossain",
      clearedDate: "22/08/2026",
    },
    hrDepartment: { status: "Pending" },
    coo: { status: "Pending" },
    overallStatus: "In Progress",
  },
  {
    id: "CLR-2026-014",
    type: "Clearance Request",
    empId: "2022041203",
    empName: "Khairul Bashar Masum",
    department: "Accounts & Finance",
    designation: "Asst. Manager",
    joiningDate: "10/02/2022",
    noticeDate: "20/08/2026",
    lastWorkingDate: "2026-09-25",
    separationType: "Resignation",
    immediateReportingName: "Sayed Ahmed",
    immediateReportingDesignation: "AGM Finance",
    resignationReason: "Career Growth in Banking Sector",
    hrDirectives: "Ensure audit ledger handover, petty cash box transfer, and bank signature authority revocation.",
    accounts: { status: "Pending" },
    administration: {
      status: "Approved",
      remarks: "Desk assets returned",
      clearedBy: "Admin Lead",
      clearedDate: "24/08/2026",
    },
    ict: {
      status: "Approved",
      remarks: "ERP & Banking portal user revoked",
      clearedBy: "IT Support",
      clearedDate: "24/08/2026",
    },
    immediateReporting: {
      status: "Approved",
      remarks: "Ledger books handed over",
      clearedBy: "Sayed Ahmed",
      clearedDate: "23/08/2026",
    },
    hrDepartment: { status: "Pending" },
    coo: { status: "Pending" },
    overallStatus: "In Progress",
  },
  {
    id: "CLR-2026-015",
    type: "Clearance Request",
    empId: "2023043021",
    empName: "Easin Mia",
    department: "Administration",
    designation: "Receptionist",
    joiningDate: "12/04/2023",
    noticeDate: "25/08/2026",
    lastWorkingDate: "2026-09-28",
    separationType: "Resignation",
    immediateReportingName: "Zakir Hossain",
    immediateReportingDesignation: "Admin Officer",
    resignationReason: "Personal Reasons",
    hrDirectives: "Collect PABX phone equipment, visitor logbook, and entrance access cards.",
    accounts: { status: "Pending" },
    administration: { status: "Pending" },
    ict: { status: "Pending" },
    immediateReporting: {
      status: "Approved",
      remarks: "Front desk register handed over",
      clearedBy: "Zakir Hossain",
      clearedDate: "26/08/2026",
    },
    hrDepartment: { status: "Pending" },
    coo: { status: "Pending" },
    overallStatus: "In Progress",
  },
  {
    id: "CLR-2026-016",
    type: "Clearance Request",
    empId: "2023046001",
    empName: "Sohanur Rahman Sohan",
    department: "Brand & Media",
    designation: "Executive",
    joiningDate: "15/04/2023",
    noticeDate: "28/08/2026",
    lastWorkingDate: "2026-09-30",
    separationType: "Resignation",
    immediateReportingName: "Rafiqul Islam",
    immediateReportingDesignation: "Brand Manager",
    resignationReason: "Higher Studies Abroad",
    hrDirectives: "Verify digital media assets, social media master credentials, and DSLR camera return.",
    accounts: {
      status: "Approved",
      remarks: "Media budget advance cleared",
      clearedBy: "Accounts Team",
      clearedDate: "29/08/2026",
    },
    administration: {
      status: "Approved",
      remarks: "Camera & drone hardware returned",
      clearedBy: "Admin Executive",
      clearedDate: "29/08/2026",
    },
    ict: {
      status: "Approved",
      remarks: "Adobe Creative Cloud license revoked",
      clearedBy: "IT Lead",
      clearedDate: "30/08/2026",
    },
    immediateReporting: {
      status: "Approved",
      remarks: "Design source files backed up on NAS",
      clearedBy: "Rafiqul Islam",
      clearedDate: "28/08/2026",
    },
    hrDepartment: { status: "Pending" },
    coo: { status: "Pending" },
    overallStatus: "In Progress",
  },
];

function SeparationClearanceApprovalPage() {
  const [records, setRecords] = useState<EmployeeClearanceRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_clearance_records");
      return saved ? JSON.parse(saved) : initialClearanceRecords;
    }
    return initialClearanceRecords;
  });

  useEffect(() => {
    localStorage.setItem("cripton_clearance_records", JSON.stringify(records));
  }, [records]);

  const [toastMsg, setToastMsg] = useState("");

  // Role Perspective Filter
  const [activeRole, setActiveRole] = useState<ApproverRole>("ALL");

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selection for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // FULL DETAILS MODAL STATE ("when clicked all details should be shown")
  const [detailsRecord, setDetailsRecord] = useState<EmployeeClearanceRecord | null>(null);

  // Quick Action Remarks State inside Modal
  const [modalRemarks, setModalRemarks] = useState("");

  // Printable Form Modal State
  const [printModalRecord, setPrintModalRecord] = useState<EmployeeClearanceRecord | null>(null);

  const departmentOptions = useMemo(() => {
    const depts = new Set(records.map((r) => r.department));
    return ["ALL", ...Array.from(depts)];
  }, [records]);

  // Statistics
  const stats = useMemo(() => {
    let myPending = 0;
    let myApproved = 0;
    let fullyCleared = 0;

    records.forEach((r) => {
      if (r.overallStatus === "Fully Cleared") fullyCleared++;

      if (activeRole === "ALL") {
        const stages = [
          r.accounts,
          r.administration,
          r.ict,
          r.immediateReporting,
          r.hrDepartment,
          r.coo,
        ];
        if (stages.some((s) => s.status === "Pending")) myPending++;
        if (stages.every((s) => s.status === "Approved")) myApproved++;
      } else {
        const deptState = r[activeRole];
        if (deptState.status === "Pending") myPending++;
        if (deptState.status === "Approved") myApproved++;
      }
    });

    return {
      total: records.length,
      myPending,
      myApproved,
      fullyCleared,
    };
  }, [records, activeRole]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.empId.toLowerCase().includes(q) ||
        r.empName.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);

      const matchesDept = deptFilter === "ALL" || r.department === deptFilter;

      let matchesStatus = true;
      if (statusFilter === "Pending Review") {
        if (activeRole === "ALL") {
          matchesStatus = [
            r.accounts,
            r.administration,
            r.ict,
            r.immediateReporting,
            r.hrDepartment,
            r.coo,
          ].some((s) => s.status === "Pending");
        } else {
          matchesStatus = r[activeRole].status === "Pending";
        }
      } else if (statusFilter === "Approved") {
        if (activeRole === "ALL") {
          matchesStatus = [
            r.accounts,
            r.administration,
            r.ict,
            r.immediateReporting,
            r.hrDepartment,
            r.coo,
          ].every((s) => s.status === "Approved");
        } else {
          matchesStatus = r[activeRole].status === "Approved";
        }
      } else if (statusFilter === "In Progress") {
        matchesStatus = r.overallStatus === "In Progress";
      } else if (statusFilter === "Fully Cleared") {
        matchesStatus = r.overallStatus === "Fully Cleared";
      }

      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && r.lastWorkingDate >= fromDate;
      if (toDate) matchesDate = matchesDate && r.lastWorkingDate <= toDate;

      return matchesSearch && matchesDept && matchesStatus && matchesDate;
    });
  }, [records, searchTerm, deptFilter, statusFilter, activeRole, fromDate, toDate]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setDeptFilter("ALL");
    setStatusFilter("ALL");
    setFromDate("");
    setToDate("");
  };

  const getClearanceProgress = (r: EmployeeClearanceRecord) => {
    const stages = [
      r.accounts,
      r.administration,
      r.ict,
      r.immediateReporting,
      r.hrDepartment,
      r.coo,
    ];
    const approvedCount = stages.filter((s) => s.status === "Approved").length;
    const percentage = Math.round((approvedCount / 6) * 100);
    return { approvedCount, percentage };
  };

  // Row Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Direct Approval / Rejection Handler
  const handleApproveDept = (
    recId: string,
    deptKey: "accounts" | "administration" | "ict" | "immediateReporting" | "hrDepartment" | "coo",
    decision: "Approved" | "Rejected",
    customRemarks?: string
  ) => {
    const updated = records.map((r) => {
      if (r.id === recId) {
        const updatedDept: DeptClearanceState = {
          status: decision,
          remarks:
            customRemarks ||
            (decision === "Approved"
              ? "All department requirements & assets cleared."
              : "Dues or handover pending"),
          clearedBy: `${ROLE_LABELS[deptKey]} Approver`,
          clearedDate: new Date().toLocaleDateString(),
        };

        const newRec = {
          ...r,
          [deptKey]: updatedDept,
        };

        const allApproved =
          (deptKey === "accounts" ? decision : r.accounts.status) === "Approved" &&
          (deptKey === "administration" ? decision : r.administration.status) === "Approved" &&
          (deptKey === "ict" ? decision : r.ict.status) === "Approved" &&
          (deptKey === "immediateReporting" ? decision : r.immediateReporting.status) === "Approved" &&
          (deptKey === "hrDepartment" ? decision : r.hrDepartment.status) === "Approved" &&
          (deptKey === "coo" ? decision : r.coo.status) === "Approved";

        newRec.overallStatus = allApproved ? "Fully Cleared" : "In Progress";
        return newRec;
      }
      return r;
    });

    setRecords(updated);

    // Update open details modal state if matching
    if (detailsRecord && detailsRecord.id === recId) {
      const fresh = updated.find((item) => item.id === recId);
      if (fresh) setDetailsRecord(fresh);
    }

    const rec = records.find((item) => item.id === recId);
    setToastMsg(
      `Clearance for ${rec?.empName || recId} (${ROLE_LABELS[deptKey]}) updated to ${decision}.`
    );
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Bulk Approval Handler
  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    const roleKey = activeRole === "ALL" ? "accounts" : activeRole;

    const updated = records.map((r) => {
      if (selectedIds.has(r.id)) {
        const updatedDept: DeptClearanceState = {
          status: "Approved",
          remarks: `Bulk approved by ${ROLE_LABELS[roleKey]}`,
          clearedBy: `${ROLE_LABELS[roleKey]} Approver`,
          clearedDate: new Date().toLocaleDateString(),
        };

        const newRec = {
          ...r,
          [roleKey]: updatedDept,
        };

        const allApproved =
          (roleKey === "accounts" ? "Approved" : r.accounts.status) === "Approved" &&
          (roleKey === "administration" ? "Approved" : r.administration.status) === "Approved" &&
          (roleKey === "ict" ? "Approved" : r.ict.status) === "Approved" &&
          (roleKey === "immediateReporting" ? "Approved" : r.immediateReporting.status) === "Approved" &&
          (roleKey === "hrDepartment" ? "Approved" : r.hrDepartment.status) === "Approved" &&
          (roleKey === "coo" ? "Approved" : r.coo.status) === "Approved";

        newRec.overallStatus = allApproved ? "Fully Cleared" : "In Progress";
        return newRec;
      }
      return r;
    });

    setRecords(updated);
    setToastMsg(
      `Successfully bulk approved ${selectedIds.size} clearance requests for ${ROLE_LABELS[roleKey]}.`
    );
    setTimeout(() => setToastMsg(""), 4000);
    setSelectedIds(new Set());
  };

  const getEffectiveDeptKey = ():
    | "accounts"
    | "administration"
    | "ict"
    | "immediateReporting"
    | "hrDepartment"
    | "coo" => {
    return activeRole === "ALL" ? "accounts" : activeRole;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Separation</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Clearance Approval Queue
            </span>
          </div>

          {/* PARALLEL WORKFLOW BADGE & MATRIX LINK */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-extrabold text-[11px] flex items-center gap-1.5 shadow-2xs">
              <Zap size={14} className="text-emerald-600 fill-emerald-500" />
              <span>PARALLEL APPROVAL • All 6 Approvers Notified Simultaneously</span>
            </div>

            <Link
              to="/separation-clearance"
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileCheck2 size={15} />
              <span>Clearance Matrix &amp; Forms</span>
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {toastMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button onClick={() => setToastMsg("")} className="font-bold text-emerald-600 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* TOP ROLE SELECTOR & STATS CARDS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="size-5 text-blue-600" />
                  Separation Clearance Approval Queue
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click any row or the &quot;VIEW&quot; button to inspect complete resignation metadata, handover notes, and 6-stage clearance progress.
                </p>
              </div>

              {/* Department Role Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  Viewing As Role:
                </span>
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as ApproverRole)}
                  className="h-9 px-3 border-2 border-blue-500 rounded-xl bg-blue-50 dark:bg-blue-950/60 font-bold text-xs text-blue-900 dark:text-blue-200 outline-none shadow-2xs cursor-pointer"
                >
                  <option value="ALL">Master Admin (All Departments)</option>
                  <option value="accounts">Accounts &amp; Finance</option>
                  <option value="administration">Administration</option>
                  <option value="ict">ICT &amp; Systems</option>
                  <option value="immediateReporting">Immediate Boss</option>
                  <option value="hrDepartment">HR Department</option>
                  <option value="coo">COO / Executive</option>
                </select>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Total Active Requests
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    {stats.total}
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    Pending For {activeRole === "ALL" ? "Approvers" : ROLE_LABELS[activeRole]}
                  </div>
                  <div className="text-xl font-black text-amber-900 dark:text-amber-200 mt-1">
                    {stats.myPending}
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Clock size={20} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Approved By {activeRole === "ALL" ? "Departments" : ROLE_LABELS[activeRole]}
                  </div>
                  <div className="text-xl font-black text-blue-900 dark:text-blue-200 mt-1">
                    {stats.myApproved}
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                    100% Fully Cleared
                  </div>
                  <div className="text-xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
                    {stats.fullyCleared}
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Award size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* FILTER TOOLBAR */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Search size={15} className="text-blue-600" />
                <span>Search &amp; Filter Approval Records</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 text-[11px]"
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {/* Text Search */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Search Keyword</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Emp ID, Name, Title, Clearance ID..."
                  className="w-full h-8.5 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department Dropdown Filter */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Department</label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none font-medium text-xs"
                >
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>
                      {d === "ALL" ? "All Departments" : d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Overall Status Filter */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Approval Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none font-medium text-xs"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="In Progress">In Progress (Overall)</option>
                  <option value="Fully Cleared">Fully Cleared (100%)</option>
                </select>
              </div>

              {/* Date Range: From Date */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Leaving From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none text-xs"
                />
              </div>

              {/* Date Range: To Date */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Leaving To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-8.5 px-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* BULK ACTION BAR */}
          {selectedIds.size > 0 && (
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 rounded-xl flex items-center justify-between shadow-xs animate-fadeIn">
              <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <CheckSquare2 size={16} className="text-blue-600" />
                <span>{selectedIds.size} employees selected for bulk action</span>
              </div>
              <button
                type="button"
                onClick={handleBulkApprove}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition uppercase tracking-wider"
              >
                <CheckCircle2 size={15} />
                <span>Bulk Approve Selected as {ROLE_LABELS[getEffectiveDeptKey()]}</span>
              </button>
            </div>
          )}

          {/* APPROVAL QUEUE LIST (EXACT DESIGN MATCH TO SCREENSHOT) */}
          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 italic">
                No approval records found matching your filter criteria.
              </div>
            ) : (
              filteredRecords.map((r) => {
                const { approvedCount, percentage } = getClearanceProgress(r);
                const isSelected = selectedIds.has(r.id);
                const activeRoleKey = getEffectiveDeptKey();
                const myDeptState = r[activeRoleKey];

                return (
                  <div
                    key={r.id}
                    onClick={() => setDetailsRecord(r)}
                    className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                    } p-4 sm:px-5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4`}
                  >
                    {/* Left Column: Checkbox, Badge Icon & Request ID */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectRow(e as any, r.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-slate-300 size-4 text-blue-600 shrink-0 cursor-pointer"
                      />

                      {/* Icon Badge */}
                      <div className="size-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                        <FileCheck2 size={20} />
                      </div>

                      {/* ID & Request Type */}
                      <div className="min-w-[130px]">
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm font-mono tracking-tight">
                          {r.id}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {r.type}
                        </div>
                      </div>
                    </div>

                    {/* Middle Left: Employee Info */}
                    <div className="min-w-[220px]">
                      <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm hover:text-blue-600 transition-colors">
                        {r.empName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {r.empId} • {r.designation}
                      </div>
                    </div>

                    {/* Middle Right: Details / Progress */}
                    <div className="flex-1 min-w-[240px]">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {r.department} • Leaving: <span className="font-mono text-rose-600 font-bold">{r.lastWorkingDate}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                          <div
                            className={`h-full transition-all ${
                              percentage === 100 ? "bg-emerald-600" : "bg-blue-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 font-mono">
                          {approvedCount}/6 Stages ({percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Status Pill Badge */}
                    <div className="shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold border inline-flex items-center gap-1.5 ${
                          myDeptState.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                            : myDeptState.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                            : "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                        }`}
                      >
                        {myDeptState.status === "Approved" ? (
                          <CheckCircle2 size={13} className="text-emerald-600" />
                        ) : myDeptState.status === "Rejected" ? (
                          <XCircle size={13} className="text-rose-600" />
                        ) : (
                          <Clock size={13} className="text-amber-600" />
                        )}
                        <span>{myDeptState.status === "Pending" ? "Pending Review" : myDeptState.status}</span>
                      </span>
                    </div>

                    {/* Action Buttons Right (Exact match to screenshot icons) */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Approve Circle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveDept(r.id, activeRoleKey, "Approved");
                        }}
                        title={`Approve as ${ROLE_LABELS[activeRoleKey]}`}
                        className="size-8 rounded-full border border-emerald-300 dark:border-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-xs font-bold flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-2xs"
                      >
                        <Check size={16} />
                      </button>

                      {/* Reject Circle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveDept(r.id, activeRoleKey, "Rejected");
                        }}
                        title={`Reject as ${ROLE_LABELS[activeRoleKey]}`}
                        className="size-8 rounded-full border border-rose-300 dark:border-rose-800 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950 dark:hover:bg-rose-900 text-xs font-bold flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-2xs"
                      >
                        <X size={16} />
                      </button>

                      {/* VIEW Button ("when clicked all details should be shown") */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailsRecord(r);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-extrabold text-[11px] transition uppercase tracking-wider flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <span>VIEW</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* "WHEN CLICKED ALL DETAILS SHOULD BE SHOWN" (COMPREHENSIVE FULL-DETAIL INSPECTION MODAL) */}
      {detailsRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-['Inter']">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl flex flex-col overflow-hidden animate-fadeIn my-auto max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-8 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 font-black flex items-center justify-center shadow-inner">
                  <FileCheck2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-white text-base">
                      Clearance Request Details — {detailsRecord.id}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        detailsRecord.overallStatus === "Fully Cleared"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                      }`}
                    >
                      {detailsRecord.overallStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    Full resignation metadata, departmental handover checklist, and 6-stage clearance status
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPrintModalRecord(detailsRecord)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
                >
                  <Printer size={15} /> Official Form
                </button>

                <button
                  type="button"
                  onClick={() => setDetailsRecord(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body - Comprehensive All Details View */}
            <div className="p-8 space-y-6 text-xs overflow-y-auto">
              
              {/* EMPLOYEE PROFILE & RESIGNATION CARD */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-800/90 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="size-4 text-blue-600" />
                    Employee Resignation Profile &amp; Service Data
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Joining: {detailsRecord.joiningDate}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Employee Name &amp; ID
                    </span>
                    <span className="font-black text-slate-900 dark:text-slate-100 text-base">
                      {detailsRecord.empName} ({detailsRecord.empId})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Department &amp; Title
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {detailsRecord.department} • {detailsRecord.designation}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Date of Leaving Service
                    </span>
                    <span className="font-black text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800 inline-block font-mono text-sm">
                      {detailsRecord.lastWorkingDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Notice Submission Date
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {detailsRecord.noticeDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Separation Type
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {detailsRecord.separationType}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Immediate Reporting Boss
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {detailsRecord.immediateReportingName} ({detailsRecord.immediateReportingDesignation})
                    </span>
                  </div>

                  <div className="col-span-1 sm:col-span-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Stated Resignation Reason
                    </span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 italic text-xs leading-relaxed">
                      &ldquo;{detailsRecord.resignationReason}&rdquo;
                    </p>
                  </div>

                  {detailsRecord.hrDirectives && (
                    <div className="col-span-1 sm:col-span-3 space-y-1">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">
                        HR Directives for Clearance Officers
                      </span>
                      <p className="font-medium text-blue-900 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/80">
                        {detailsRecord.hrDirectives}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CLEARANCE PROGRESS BAR */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Overall Clearance Stage Progress
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">
                    {getClearanceProgress(detailsRecord).approvedCount} of 6 Stages Cleared ({getClearanceProgress(detailsRecord).percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
                  <div
                    className={`h-full transition-all ${
                      getClearanceProgress(detailsRecord).percentage === 100
                        ? "bg-emerald-600"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${getClearanceProgress(detailsRecord).percentage}%` }}
                  />
                </div>
              </div>

              {/* ALL 6 DEPARTMENT CLEARANCE CARDS MATRIX */}
              <div className="space-y-3">
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Multi-Departmental Parallel Verification Status</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Click &quot;Approve&quot; or &quot;Reject&quot; on any department card to record decision
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "accounts" as const, label: "Accounts & Finance", desc: "Reconcile loans, advance balances, and final dues" },
                    { key: "administration" as const, label: "Administration", desc: "Collect ID badge, desk keys, & office property" },
                    { key: "ict" as const, label: "ICT & Systems", desc: "Revoke email, VPN, ERP credentials & collect laptop" },
                    { key: "immediateReporting" as const, label: "Immediate Boss", desc: "Verify tasks, project files, & ongoing handover" },
                    { key: "hrDepartment" as const, label: "HR Department", desc: "Conduct exit survey & verify employee service file" },
                    { key: "coo" as const, label: "COO / Executive Office", desc: "Final executive approval & release authorization" },
                  ].map(({ key, label, desc }) => {
                    const deptState = detailsRecord[key];
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-2xl border transition-all ${
                          deptState.status === "Approved"
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                            : deptState.status === "Rejected"
                            ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                            : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                        } space-y-2.5`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                            {label}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              deptState.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : deptState.status === "Rejected"
                                ? "bg-rose-100 text-rose-800 border-rose-300"
                                : "bg-amber-100 text-amber-800 border-amber-300"
                            }`}
                          >
                            {deptState.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {desc}
                        </p>

                        <div className="text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-slate-400 block text-[9px] uppercase">
                            Remarks / Dues Notes:
                          </span>
                          <span>{deptState.remarks || "No remarks entered."}</span>
                          {deptState.clearedBy && (
                            <div className="text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                              Cleared by: {deptState.clearedBy} ({deptState.clearedDate})
                            </div>
                          )}
                        </div>

                        {/* Interactive Buttons for this department */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleApproveDept(
                                detailsRecord.id,
                                key,
                                "Approved",
                                modalRemarks || "Cleared and approved"
                              )
                            }
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs flex items-center gap-1 transition"
                          >
                            <Check size={12} /> Approve {label}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleApproveDept(
                                detailsRecord.id,
                                key,
                                "Rejected",
                                modalRemarks || "Dues / requirements pending"
                              )
                            }
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-2xs flex items-center gap-1 transition"
                          >
                            <X size={12} /> Hold / Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* QUICK DECISION REMARKS INPUT FOR ACTIVE ROLE */}
              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
                <label className="block font-extrabold text-blue-900 dark:text-blue-200 text-xs uppercase tracking-wider">
                  Update Clearance Decision as {ROLE_LABELS[getEffectiveDeptKey()]}
                </label>
                <textarea
                  rows={2}
                  value={modalRemarks}
                  onChange={(e) => setModalRemarks(e.target.value)}
                  placeholder="Enter specific handover, equipment, or loan settlement notes..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleApproveDept(
                        detailsRecord.id,
                        getEffectiveDeptKey(),
                        "Rejected",
                        modalRemarks || "Dues pending"
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <XCircle size={15} /> Reject {ROLE_LABELS[getEffectiveDeptKey()]}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleApproveDept(
                        detailsRecord.id,
                        getEffectiveDeptKey(),
                        "Approved",
                        modalRemarks || "Approved and cleared"
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={15} /> Approve {ROLE_LABELS[getEffectiveDeptKey()]}
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500 font-medium">
                Showing full details for clearance request #{detailsRecord.id}
              </div>

              <button
                type="button"
                onClick={() => setDetailsRecord(null)}
                className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* OFFICIAL PRINTABLE PAKIZA CLEARANCE FORM MODAL */}
      {printModalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white font-['Inter']">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full relative">
            <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-500" />

            <div className="px-8 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden font-sans">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  Official Employee Clearance Form
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                  VERIFIED DOCUMENT
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
                >
                  <Printer size={15} /> Print Clearance Form
                </button>

                <button
                  type="button"
                  onClick={() => setPrintModalRecord(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[85vh] print:max-h-none print:overflow-visible text-xs font-sans">
              {/* Header */}
              <div className="text-center space-y-1 border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  PAKIZA APPARELS &amp; SOFTWARE LTD.
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  Plot # 12, Main Road, Sector-03, Uttara, Dhaka-1230, Bangladesh
                </p>
                <div className="pt-2">
                  <span className="px-4 py-1 rounded-full bg-slate-900 text-white font-black text-xs uppercase tracking-wider inline-block">
                    EMPLOYEE SEPARATION CLEARANCE FORM
                  </span>
                </div>
              </div>

              {/* Employee Particulars Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Employee Name &amp; ID
                  </span>
                  <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                    {printModalRecord.empName} ({printModalRecord.empId})
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Department &amp; Designation
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {printModalRecord.department} • {printModalRecord.designation}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Joining Date &amp; Last Working Date
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {printModalRecord.joiningDate} to{" "}
                    <span className="font-extrabold text-rose-600">
                      {printModalRecord.lastWorkingDate}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Immediate Reporting Boss
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {printModalRecord.immediateReportingName} (
                    {printModalRecord.immediateReportingDesignation})
                  </div>
                </div>
              </div>

              {/* 6 Department Clearances Matrix Table */}
              <div className="space-y-2">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Multi-Departmental Verification Matrix
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-2.5 border-r border-slate-300 w-44">Department</th>
                      <th className="p-2.5 border-r border-slate-300 text-center w-28">Status</th>
                      <th className="p-2.5 border-r border-slate-300">Handover / Dues Remarks</th>
                      <th className="p-2.5 text-center w-36">Cleared By &amp; Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      { key: "accounts", label: "Accounts & Finance" },
                      { key: "administration", label: "Administration" },
                      { key: "ict", label: "ICT & Systems" },
                      { key: "immediateReporting", label: "Immediate Boss" },
                      { key: "hrDepartment", label: "HR Department" },
                      { key: "coo", label: "COO / Executive Office" },
                    ].map(({ key, label }) => {
                      const st = printModalRecord[
                        key as keyof EmployeeClearanceRecord
                      ] as DeptClearanceState;
                      return (
                        <tr key={key}>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-300">
                            {label}
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-300">
                            <span
                              className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                                st.status === "Approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {st.status}
                            </span>
                          </td>
                          <td className="p-2.5 border-r border-slate-300 text-slate-600 font-medium">
                            {st.remarks || "No pending remarks"}
                          </td>
                          <td className="p-2.5 text-center text-slate-500 font-mono text-[10px]">
                            {st.clearedBy ? (
                              <div>
                                <div className="font-bold text-slate-800">{st.clearedBy}</div>
                                <div>{st.clearedDate}</div>
                              </div>
                            ) : (
                              "Pending"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 4 Signatures Block */}
              <div className="pt-12 grid grid-cols-4 gap-4 text-center text-[10px]">
                <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-700">
                  Employee Signature
                </div>
                <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-700">
                  Dept Head / Reporting Boss
                </div>
                <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-700">
                  HR Head Signature
                </div>
                <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-700">
                  COO Approval
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
