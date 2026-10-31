import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
  FileText,
  UserCheck,
  User,
  Paperclip,
  Building2,
  Stethoscope,
  HeartPulse,
  Send,
  Eye,
  X,
  ChevronRight,
  AlertCircle,
  Coins,
  MessageSquare,
  Printer,
  FileCheck2,
  XCircle,
  ArrowRight,
  Sparkles,
  Download,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  MaternityRequest,
  MaternityDocument,
  INITIAL_FEMALE_EMPLOYEES,
  checkMaternityEligibility,
  getMaternityRequests,
  approveMaternityByHr,
  rejectMaternityByHr,
} from "@/lib/maternityLeaveStore";

export const Route = createFileRoute("/maternity-hr-verification")({
  head: () => ({
    meta: [
      { title: "Maternity HR Verification & Sanction Approval — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "HR verification of welfare and medical maternity dossiers, statutory compliance audit, benefit computation, and formal maternity leave sanction order approval.",
      },
    ],
  }),
  component: MaternityHrVerificationPage,
});

function MaternityHrVerificationPage() {
  const [requests, setRequests] = useState<MaternityRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Comprehensive Filter States (Matching Medical Verification)
  const [filterCompany, setFilterCompany] = useState("ALL");
  const [filterArea, setFilterArea] = useState("ALL");
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [filterSection, setFilterSection] = useState("ALL");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterStage, setFilterStage] = useState("ALL");
  const [filterEmployeeType, setFilterEmployeeType] = useState("ALL");

  const companyOptions = useMemo(
    () => ["ALL", "Pakiza Knit Composite Ltd", "Pakiza Apparels Ltd", "Pakiza Spinning Mills Ltd"],
    []
  );

  const areaOptions = useMemo(
    () => ["ALL", "Gazipur", "Dhaka", "Savar", "Ashulia", "Narayanganj"],
    []
  );

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (r.employee.department) set.add(r.employee.department);
    });
    INITIAL_FEMALE_EMPLOYEES.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [requests]);

  const sectionOptions = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (filterDepartment === "ALL" || r.employee.department === filterDepartment) {
        if (r.employee.section) set.add(r.employee.section);
      }
    });
    INITIAL_FEMALE_EMPLOYEES.forEach((e) => {
      if (filterDepartment === "ALL" || e.department === filterDepartment) {
        if (e.section) set.add(e.section);
      }
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [requests, filterDepartment]);

  const statusOptions = ["ALL", "Working", "On Leave", "Active", "Pending", "Approved"];

  const stageOptions = [
    { label: "All Stages", value: "ALL" },
    { label: "Leave Scheduled (Forwarded to HR)", value: "WELFARE_LEAVE_SCHEDULED" },
    { label: "HR Approved (Sanction Issued)", value: "HR_APPROVED" },
    { label: "Medical Verified (At Welfare)", value: "MEDICAL_VERIFIED" },
    { label: "Medical Follow-up In Progress", value: "MEDICAL_FOLLOWUP" },
    { label: "Welfare Initiated", value: "WELFARE_INITIATED" },
  ];

  const employeeTypeOptions = ["ALL", "Worker", "Staff", "Executive", "Management"];

  const handleResetFilters = () => {
    setFilterCompany("ALL");
    setFilterArea("ALL");
    setFilterDepartment("ALL");
    setFilterSection("ALL");
    setFilterFromDate("");
    setFilterToDate("");
    setFilterStatus("ALL");
    setFilterStage("ALL");
    setFilterEmployeeType("ALL");
    setSearchTerm("");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCompany !== "ALL") count++;
    if (filterArea !== "ALL") count++;
    if (filterDepartment !== "ALL") count++;
    if (filterSection !== "ALL") count++;
    if (filterFromDate) count++;
    if (filterToDate) count++;
    if (filterStatus !== "ALL") count++;
    if (filterStage !== "ALL") count++;
    if (filterEmployeeType !== "ALL") count++;
    if (searchTerm) count++;
    return count;
  }, [
    filterCompany,
    filterArea,
    filterDepartment,
    filterSection,
    filterFromDate,
    filterToDate,
    filterStatus,
    filterStage,
    filterEmployeeType,
    searchTerm,
  ]);

  // Modals
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isSanctionLetterOpen, setIsSanctionLetterOpen] = useState(false);
  const [selectedDocToView, setSelectedDocToView] = useState<{
    doc: MaternityDocument;
    employeeName: string;
    employeeId: string;
    nid?: string;
  } | null>(null);
  const [activeRequest, setActiveRequest] = useState<MaternityRequest | null>(null);

  // Approval Form State
  const [hrOfficerName, setHrOfficerName] = useState("Md. Tariqul Islam (Head of HR & Compliance)");
  const [hrRemarks, setHrRemarks] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  const loadData = () => {
    setRequests(getMaternityRequests());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("maternity-data-updated", handleUpdate);
    return () => window.removeEventListener("maternity-data-updated", handleUpdate);
  }, []);

  // Metrics
  const stats = useMemo(() => {
    const pendingHr = requests.filter((r) => r.currentStage === "WELFARE_LEAVE_SCHEDULED").length;
    const approved = requests.filter((r) => r.currentStage === "HR_APPROVED").length;
    const totalBenefit = requests
      .filter((r) => r.currentStage === "HR_APPROVED")
      .reduce((sum, r) => sum + (r.hrStage.benefitEstimate?.total112DaysAmount || 0), 0);

    return { pendingHr, approved, totalBenefit, total: requests.length };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // 1. Company filter
      if (filterCompany !== "ALL") {
        const empComp = r.employee.unit || "";
        if (!empComp.toLowerCase().includes(filterCompany.toLowerCase().split(" ")[0])) {
          return false;
        }
      }

      // 3. Area filter
      if (filterArea !== "ALL") {
        const addr = `${r.employee.presentAddress} ${r.employee.permanentAddress}`.toLowerCase();
        if (!addr.includes(filterArea.toLowerCase())) {
          return false;
        }
      }

      // 4. Department filter
      if (filterDepartment !== "ALL" && r.employee.department !== filterDepartment) {
        return false;
      }

      // 5. Section filter
      if (filterSection !== "ALL" && r.employee.section !== filterSection) {
        return false;
      }

      // 6. Date Range (Leave Start Date or Intake Date)
      const recordDate = r.welfareStage2?.expectedLeaveStartDate || r.welfareStage1.intakeDate;
      if (filterFromDate && recordDate < filterFromDate) {
        return false;
      }
      if (filterToDate && recordDate > filterToDate) {
        return false;
      }

      // 7. Status filter
      if (filterStatus !== "ALL") {
        const st = (r.statusLabel || "Working").toLowerCase();
        const fSt = filterStatus.toLowerCase();
        if (fSt === "approved" && r.currentStage !== "HR_APPROVED") return false;
        if (fSt === "on leave" && r.currentStage !== "HR_APPROVED") return false;
        if (fSt === "pending" && r.currentStage === "HR_APPROVED") return false;
        if (!st.includes(fSt) && fSt !== "active" && fSt !== "working") return false;
      }

      // 8. Stage filter
      if (filterStage !== "ALL" && r.currentStage !== filterStage) {
        return false;
      }

      // 9. Employee Type filter
      if (filterEmployeeType !== "ALL") {
        const desig = (r.employee.designation || "").toLowerCase();
        const fType = filterEmployeeType.toLowerCase();
        if (fType === "worker") {
          const isWorker =
            desig.includes("operator") ||
            desig.includes("worker") ||
            desig.includes("loader") ||
            desig.includes("helper") ||
            desig.includes("iron") ||
            desig.includes("inspector");
          if (!isWorker) return false;
        } else if (fType === "executive" || fType === "management") {
          const isExec =
            desig.includes("executive") ||
            desig.includes("manager") ||
            desig.includes("lead") ||
            desig.includes("officer");
          if (!isExec) return false;
        } else if (fType === "staff") {
          const isStaff =
            !desig.includes("operator") && !desig.includes("helper") && !desig.includes("loader");
          if (!isStaff) return false;
        }
      }

      // 10. Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          r.employee.name.toLowerCase().includes(query) ||
          r.employee.id.includes(query) ||
          r.id.toLowerCase().includes(query) ||
          (r.hrStage.sanctionOrderNo && r.hrStage.sanctionOrderNo.toLowerCase().includes(query)) ||
          r.employee.department.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [
    requests,
    filterCompany,
    filterArea,
    filterDepartment,
    filterSection,
    filterFromDate,
    filterToDate,
    filterStatus,
    filterStage,
    filterEmployeeType,
    searchTerm,
  ]);

  // Open Verification Modal
  const openVerifyModal = (req: MaternityRequest) => {
    setActiveRequest(req);
    setHrRemarks(req.hrStage.hrRemarks || "");
    setIsVerifyModalOpen(true);
  };

  // Open Formal Sanction Order Printable
  const openSanctionLetter = (req: MaternityRequest) => {
    setActiveRequest(req);
    setIsSanctionLetterOpen(true);
  };

  // Submit HR Approval
  const handleApprove = () => {
    if (!activeRequest) return;

    const finalRemarks = hrRemarks.trim() || "Statutory maternity leave approved under Section 46 & 47 of Bangladesh Labor Act 2006.";
    const approved = approveMaternityByHr(activeRequest.id, hrOfficerName, finalRemarks);
    setIsVerifyModalOpen(false);
    if (approved) {
      setActiveRequest(approved);
      showToast(
        `✅ Maternity Leave Approved! Sanction Order No: ${approved.hrStage.sanctionOrderNo} issued for ${approved.employee.name}.`
      );
      setIsSanctionLetterOpen(true);
    }
  };

  // Reject Request
  const handleReject = () => {
    if (!activeRequest) return;
    const reason = window.prompt("Please state the statutory or administrative reason for rejection:");
    if (!reason) return;

    rejectMaternityByHr(activeRequest.id, hrOfficerName, reason);
    setIsVerifyModalOpen(false);
    showToast(`⚠️ Maternity request ${activeRequest.id} rejected.`);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-18 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-400 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{toastMessage}</span>
            <button onClick={() => setToastMessage("")} className="ml-2 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                <span>Maternity Leave</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-purple-600 dark:text-purple-400 font-semibold">HR Verification</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                Maternity Leave HR Verification &amp; Approval
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verify employee statutory eligibility, audit welfare intake documentation and medical clinical findings,
                and sanction 112-day maternity benefit leave orders.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/maternity-payment"
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-1.5"
              >
                <Coins className="w-4 h-4 text-emerald-500" />
                Maternity Payment Registry
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COMPREHENSIVE FILTER SECTION (Matches Medical Verification Page)          */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Filter Maternity Records
                    {activeFilterCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {activeFilterCount} active
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Filter by organization hierarchy, geography, timeline, status, and workflow stage.
                  </p>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {/* 1. Company */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company
                </label>
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                >
                  {companyOptions.map((c) => (
                    <option key={c} value={c}>
                      {c === "ALL" ? "All Companies" : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Area */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Area
                </label>
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                >
                  {areaOptions.map((a) => (
                    <option key={a} value={a}>
                      {a === "ALL" ? "All Areas" : a}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Department */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => {
                    setFilterDepartment(e.target.value);
                    setFilterSection("ALL");
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                >
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>
                      {d === "ALL" ? "All Departments" : d}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Section */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Section
                </label>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                >
                  {sectionOptions.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec === "ALL" ? "All Sections" : sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Date Range: From Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                />
              </div>

              {/* 6. Date Range: To Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                />
              </div>

              {/* 7. Status */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st === "ALL" ? "All Statuses" : st}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Stage */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stage
                </label>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                >
                  {stageOptions.map((sg) => (
                    <option key={sg.value} value={sg.value}>
                      {sg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 9. Employee Type */}
              <div className="sm:col-span-2 md:col-span-1 lg:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employee Type
                </label>
                <select
                  value={filterEmployeeType}
                  onChange={(e) => setFilterEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                >
                  {employeeTypeOptions.map((tp) => (
                    <option key={tp} value={tp}>
                      {tp === "ALL" ? "All Employee Types" : tp}
                    </option>
                  ))}
                </select>
              </div>

              {/* 10. Search Input */}
              <div className="sm:col-span-2 md:col-span-2 lg:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by employee name, ID, department, case ref..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Result Count Footer */}
            <div className="pt-2 flex items-center justify-end">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing <strong className="text-slate-800 dark:text-slate-200">{filteredRequests.length}</strong> of {requests.length} records
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-3 text-center w-12">SL</th>
                    <th className="py-3.5 px-4">Case Ref / Sanction</th>
                    <th className="py-3.5 px-4">Employee Details</th>
                    <th className="py-3.5 px-4">Joining Date</th>
                    <th className="py-3.5 px-4">Service Period</th>
                    <th className="py-3.5 px-4">Welfare Confirmed EDD</th>
                    <th className="py-3.5 px-4">Leave Duration (112 Days)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        No maternity records pending for this HR filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req, idx) => {
                      const isPendingHr = req.currentStage === "WELFARE_LEAVE_SCHEDULED";
                      const isApproved = req.currentStage === "HR_APPROVED";

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                        >
                          {/* 1. SL Column */}
                          <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-500 dark:text-slate-400">
                            {idx + 1}
                          </td>

                          {/* 2. Case Ref / Sanction */}
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                            <div>{req.id}</div>
                            {req.hrStage.sanctionOrderNo ? (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                {req.hrStage.sanctionOrderNo}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Pending Sanction</span>
                            )}
                          </td>

                          {/* 3. Employee Details (Only Name, ID, Department) */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {req.employee.name}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                ID: {req.employee.id}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {req.employee.department}
                              </p>
                            </div>
                          </td>

                          {/* 4. Joining Date */}
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                            {req.employee.joiningDate.includes("-")
                              ? req.employee.joiningDate.split("-").reverse().join("/")
                              : req.employee.joiningDate}
                          </td>

                          {/* 5. Service Period */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {req.welfareStage1.serviceDurationText ||
                                checkMaternityEligibility(req.employee.joiningDate).durationFormatted}
                            </span>
                          </td>

                          {/* 6. Welfare Confirmed EDD */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-pink-600 dark:text-pink-400 font-mono">
                              {req.medicalStage.expectedDeliveryDate || "N/A"}
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {req.medicalStage.checkupVisits.length} checkups verified
                            </p>
                          </td>

                          {/* 7. Leave Duration (112 Days) */}
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {req.welfareStage2.expectedLeaveStartDate} to {req.welfareStage2.expectedLeaveEndDate}
                            </p>
                            <span className="text-[10px] font-semibold text-emerald-600">
                              {req.welfareStage2.totalLeaveDays || 112} Days (16 Weeks)
                            </span>
                          </td>

                          {/* 8. Status */}
                          <td className="py-3.5 px-4">
                            {isPendingHr && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-700 animate-pulse">
                                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                Action Required: Verify &amp; Sign
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approved
                              </span>
                            )}
                            {!isPendingHr && !isApproved && (
                              <span className="text-slate-400 text-xs">{req.statusLabel}</span>
                            )}
                          </td>

                          {/* 9. Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPendingHr && (
                                <button
                                  onClick={() => openVerifyModal(req)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs flex items-center gap-1 transition cursor-pointer"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Verify &amp; Approve
                                </button>
                              )}

                              {isApproved && (
                                <button
                                  onClick={() => openSanctionLetter(req)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1 transition cursor-pointer"
                                >
                                  <FileCheck2 className="w-3.5 h-3.5" />
                                  Sanction Order
                                </button>
                              )}

                              <button
                                onClick={() => openVerifyModal(req)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
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
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: HR 360° VERIFICATION & SANCTION APPROVAL MODAL                   */}
      {/* ========================================================================= */}
      {isVerifyModalOpen && activeRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl lg:max-w-6xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/80 dark:from-purple-950/30 dark:via-slate-900 dark:to-indigo-950/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center font-bold shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    HR Statutory Verification &amp; Sanction Approval
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Patient: {activeRequest.employee.name} (ID: {activeRequest.employee.id}) &bull; Case Ref:{" "}
                    <strong className="font-mono text-purple-600 dark:text-purple-400">{activeRequest.id}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* 1. EMPLOYEE DETAILS (Matches Welfare & Medical stages) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <User className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    EMPLOYEE DETAILS
                  </h4>
                </div>

                <div className="flex flex-row gap-5 items-start">
                  {/* Photo Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        activeRequest.employee.avatar ||
                        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={activeRequest.employee.name}
                      className="w-24 h-28 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs bg-slate-100 dark:bg-slate-800"
                    />
                  </div>

                  {/* Two Columns Grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                    {/* Column 1 */}
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Employee Name:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {activeRequest.employee.name}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Designation:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {activeRequest.employee.designation}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Section:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {activeRequest.employee.section}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Location:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {activeRequest.employee.unit ? `${activeRequest.employee.unit} - Operation` : "Unit-01 - Operation"}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Contact:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {activeRequest.employee.phone}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Service Period:
                        </span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {activeRequest.welfareStage1.serviceDurationText ||
                            checkMaternityEligibility(activeRequest.employee.joiningDate).durationFormatted}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Address:
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex-1 leading-snug">
                          {activeRequest.employee.presentAddress ||
                            activeRequest.employee.permanentAddress ||
                            "House 24, Road 4, Sector 10, Uttara, Dhaka"}
                        </span>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Employee ID:
                        </span>
                        <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                          {activeRequest.employee.id}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Department:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {activeRequest.employee.department}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Date of Joining:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {activeRequest.employee.joiningDate.includes("-")
                            ? activeRequest.employee.joiningDate.split("-").reverse().join("/")
                            : activeRequest.employee.joiningDate}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Business Unit:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {activeRequest.employee.unit || "Unit-01"}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Eligibility:
                        </span>
                        <span
                          className={`font-bold uppercase ${
                            activeRequest.welfareStage1.isEligible
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {activeRequest.welfareStage1.isEligible ? "YES" : "NO"}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Documents:
                        </span>
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. PREVIOUS MATERNITY HISTORY */}
              {activeRequest.employee.previousMaternityLeaves &&
                activeRequest.employee.previousMaternityLeaves.length > 0 && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
                    <div className="px-4 py-2.5 bg-amber-50/70 dark:bg-amber-950/20 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between border-b border-amber-200/50 dark:border-amber-900/30">
                      <span>
                        Previous Maternity History ({activeRequest.employee.previousMaternityLeaves.length} Recorded)
                      </span>
                    </div>
                    <table className="w-full text-xs text-left">
                      <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                        <tr>
                          <th className="py-2.5 px-3.5 font-bold">CHILD</th>
                          <th className="py-2.5 px-3.5 font-bold">LEAVE PERIOD</th>
                          <th className="py-2.5 px-3.5 font-bold">DELIVERY DATE</th>
                          <th className="py-2.5 px-3.5 font-bold">DAYS</th>
                          <th className="py-2.5 px-3.5 font-bold">BENEFIT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeRequest.employee.previousMaternityLeaves.map((hist, idx) => (
                          <tr key={hist.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                            <td className="py-2.5 px-3.5 font-bold text-slate-800 dark:text-slate-200">
                              Baby #{hist.childNumber || idx + 1}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                              {hist.leaveStartDate} to {hist.leaveEndDate}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-800 dark:text-slate-200 font-medium">
                              {hist.deliveryDate}
                            </td>
                            <td className="py-2.5 px-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                              {hist.totalDays}d
                            </td>
                            <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-slate-100">
                              {hist.benefitDisbursedBdt.toLocaleString()} BDT
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              {/* 3. WELFARE INTAKE & COUNSELING (Stage 1 Details) */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 bg-white dark:bg-slate-900 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                      <HeartPulse className="w-3 h-3 text-rose-500" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                      WELFARE INTAKE &amp; COUNSELING
                    </h4>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    Intake Date: {activeRequest.welfareStage1.intakeDate}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 text-slate-700 dark:text-slate-300 text-xs leading-relaxed border border-slate-200/60 dark:border-slate-800">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Counseling Notes &amp; Observations:</p>
                  <p>{activeRequest.welfareStage1.counselingNotes}</p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      Attached Verification Documents ({activeRequest.welfareStage1.attachedDocuments.length})
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">Click any document to view preview</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {activeRequest.welfareStage1.attachedDocuments.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() =>
                          setSelectedDocToView({
                            doc,
                            employeeName: activeRequest.employee.name,
                            employeeId: activeRequest.employee.id,
                            nid: activeRequest.employee.nid,
                          })
                        }
                        className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition text-left cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:group-hover:text-white">
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {doc.size} &bull; {doc.type.replace(/_/g, " ")}
                            </p>
                          </div>
                        </div>

                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex-shrink-0 ml-2">
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. MEDICAL VERIFICATION & CLINICAL FINDINGS (Medical Stage Details) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Stethoscope className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    MEDICAL VERIFICATION &amp; CLINICAL FINDINGS
                  </h4>
                </div>

                {/* Medical Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Attending Doctor</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                      {activeRequest.medicalStage.assignedDoctor || "Dr. Farzana Yasmin"}
                    </span>
                    <span className="text-[10px] text-slate-500 block">BMDC #{activeRequest.medicalStage.doctorRegNo || "A-45920"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Clinical Fitness</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {activeRequest.medicalStage.clinicalFitness || "Normal Health - Fit to Work"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Confirmed EDD</span>
                    <span className="font-bold text-pink-600 dark:text-pink-400 block font-mono">
                      {activeRequest.medicalStage.expectedDeliveryDate || "2026-12-25"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Medical Clearance</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {activeRequest.medicalStage.medicalVerifiedAt || "2026-10-28"}
                    </span>
                  </div>
                </div>

                {/* Clinical Consultations Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Recorded Clinical Consultations &amp; Visits ({activeRequest.medicalStage.checkupVisits.length})
                    </span>
                  </div>

                  {activeRequest.medicalStage.checkupVisits.length > 0 ? (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                          <tr>
                            <th className="py-3 px-4 font-bold">VISIT</th>
                            <th className="py-3 px-4 font-bold">DATE</th>
                            <th className="py-3 px-4 font-bold">VITALS</th>
                            <th className="py-3 px-4 font-bold">GESTATION</th>
                            <th className="py-3 px-4 font-bold">CLINICAL FINDINGS &amp; ADVICE</th>
                            <th className="py-3 px-4 font-bold text-right">DOCTOR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {activeRequest.medicalStage.checkupVisits.map((v) => (
                            <tr key={v.visitId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                              <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                Visit #{v.visitNumber}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                {v.visitDate}
                              </td>
                              <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                                BP: {v.bloodPressure} &bull; HR: {v.fetalHeartRate.includes("bpm") ? v.fetalHeartRate : `${v.fetalHeartRate} bpm`}
                              </td>
                              <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                {v.gestationalWeeks ? `${v.gestationalWeeks} wks` : "24 wks"}
                              </td>
                              <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                                <p>{v.clinicalFindings}</p>
                                {v.prescribedVitamins && (
                                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                    Rx: {v.prescribedVitamins}
                                  </p>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-right whitespace-nowrap">
                                {v.doctorName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                      No clinical checkup visits logged yet.
                    </div>
                  )}
                </div>

                {/* Doctor's Final Remarks */}
                {activeRequest.medicalStage.doctorFinalRemarks && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Doctor's Final Assessment &amp; Clearance:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {activeRequest.medicalStage.doctorFinalRemarks}
                    </p>
                  </div>
                )}
              </div>

              {/* 5. LEAVE SCHEDULE & WELFARE RECOMMENDATION (Welfare Stage 2 Details) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    LEAVE SCHEDULE &amp; WELFARE RECOMMENDATION
                  </h4>
                </div>

                {/* 4-column overview card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                      EXPECTED DELIVERY DATE
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mt-1 text-sm font-mono">
                      {activeRequest.medicalStage?.expectedDeliveryDate || "2026-12-25"}
                    </span>
                    <span className="text-[10px] text-slate-400">Welfare Confirmed EDD</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                      LEAVE START DATE
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mt-1 text-sm font-mono">
                      {activeRequest.welfareStage2.expectedLeaveStartDate || "2026-11-01"}
                    </span>
                    <span className="text-[10px] text-slate-400">56d pre-delivery</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                      LEAVE END DATE
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mt-1 text-sm font-mono">
                      {activeRequest.welfareStage2.expectedLeaveEndDate || "2027-02-20"}
                    </span>
                    <span className="text-[10px] text-slate-400">55d post-delivery</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                      TOTAL DURATION
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-1 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      112 Days (16 Wks)
                    </span>
                    <span className="text-[10px] text-slate-400">BLA Sec. 46/47</span>
                  </div>
                </div>

                {/* Given Address During Leave & Welfare Recommendation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Address During Leave
                    </span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {activeRequest.welfareStage2.leaveAddress || activeRequest.employee.presentAddress || "Same as present residence"}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Welfare Recommendation &amp; Remarks
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeRequest.welfareStage2.welfareOfficerRemarks || "Recommended for 16 weeks (112 days) statutory maternity leave as per Bangladesh Labor Act 2006."}
                    </p>
                  </div>
                </div>
              </div>


            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between flex-shrink-0">
              <div>
                {activeRequest.currentStage === "WELFARE_LEAVE_SCHEDULED" && (
                  <button
                    type="button"
                    onClick={handleReject}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject Application
                  </button>
                )}
                {activeRequest.currentStage === "HR_APPROVED" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Maternity Leave Sanctioned by HR
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>

                {activeRequest.currentStage === "WELFARE_LEAVE_SCHEDULED" ? (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/25 flex items-center gap-2 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Approve &amp; Issue Sanction Order
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifyModalOpen(false);
                      openSanctionLetter(activeRequest);
                    }}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    View Sanction Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FORMAL MATERNITY LEAVE SANCTION ORDER (PRINTABLE)                */}
      {/* ========================================================================= */}
      {isSanctionLetterOpen && activeRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Top Toolbar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <Printer className="w-4 h-4 text-purple-600" />
                Maternity Leave Sanction Order Letter Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Sanction Order
                </button>
                <button
                  onClick={() => setIsSanctionLetterOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letter Body */}
            <div className="p-8 space-y-6 text-xs text-slate-800 font-serif leading-relaxed max-h-[75vh] overflow-y-auto">
              {/* Header Letterhead */}
              <div className="text-center border-b pb-4">
                <h1 className="text-lg font-black tracking-wide text-slate-950 uppercase font-sans">
                  CRIPTON APPARELS &amp; TEXTILES LTD.
                </h1>
                <p className="text-[11px] text-slate-600 font-sans">
                  Plot # 45-48, Sector 08, Export Processing Zone, Savar, Dhaka, Bangladesh
                </p>
                <p className="text-[10px] text-slate-500 font-sans">
                  Corporate HR &amp; Compliance Department &bull; Email: hr-compliance@cripton.com
                </p>
                <div className="mt-3 inline-block px-3 py-1 rounded bg-slate-100 text-slate-900 font-sans font-bold text-xs uppercase tracking-wider">
                  OFFICIAL SANCTION ORDER FOR STATUTORY MATERNITY LEAVE
                </div>
              </div>

              {/* Memo & Date */}
              <div className="flex justify-between font-sans text-xs">
                <div>
                  <strong>Memo No:</strong>{" "}
                  <span className="font-mono text-purple-700 font-bold">
                    {activeRequest.hrStage.sanctionOrderNo || "CRIPTON/HR/MAT/2026/089"}
                  </span>
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {activeRequest.hrStage.approvedAt ? activeRequest.hrStage.approvedAt.substring(0, 10) : "2026-10-28"}
                </div>
              </div>

              {/* Subject */}
              <div className="font-sans font-bold text-xs bg-slate-50 p-2.5 rounded border">
                Subject: Sanction of 112 Days Statutory Maternity Leave with Benefit under Section 46 &amp; 47 of the
                Bangladesh Labor Act 2006.
              </div>

              {/* Addressed to */}
              <div className="font-sans space-y-1">
                <p>
                  <strong>To:</strong> {activeRequest.employee.name} (ID: {activeRequest.employee.id})
                </p>
                <p>
                  <strong>Designation:</strong> {activeRequest.employee.designation} &bull;{" "}
                  <strong>Department:</strong> {activeRequest.employee.department}
                </p>
              </div>

              {/* Body */}
              <div className="space-y-3 text-justify">
                <p>
                  This is to inform you that upon evaluation of your pregnancy notification submitted to the Welfare
                  Department, verification of continuous service tenure ({activeRequest.welfareStage1.serviceDurationText}),
                  and confirmation of Expected Delivery Date ({activeRequest.medicalStage.expectedDeliveryDate}) by the
                  authorized Medical Officer, the management is pleased to sanction your statutory Maternity Leave for a
                  period of <strong>112 (One Hundred and Twelve) consecutive calendar days</strong>.
                </p>

                <table className="w-full border-collapse border border-slate-300 font-sans text-[11px] my-3">
                  <tbody className="divide-y divide-slate-300">
                    <tr className="bg-slate-50">
                      <td className="p-2 font-bold w-1/3">Sanctioned Leave Period</td>
                      <td className="p-2 font-bold text-purple-700">
                        From {activeRequest.welfareStage2.expectedLeaveStartDate} To{" "}
                        {activeRequest.welfareStage2.expectedLeaveEndDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">Total Leave Duration</td>
                      <td className="p-2">112 Calendar Days (16 Consecutive Weeks)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2 font-bold">Expected Delivery Date (EDD)</td>
                      <td className="p-2 text-pink-700 font-bold">{activeRequest.medicalStage.expectedDeliveryDate}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">Total Maternity Benefit Amount</td>
                      <td className="p-2 font-bold font-mono">
                        BDT {activeRequest.hrStage.benefitEstimate.total112DaysAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2 font-bold">1st Installment (50% Prior)</td>
                      <td className="p-2 font-mono">
                        BDT {activeRequest.hrStage.benefitEstimate.firstInstallment.toLocaleString()} (Payable within 3
                        days of leave commencement)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">2nd Installment (50% Post)</td>
                      <td className="p-2 font-mono">
                        BDT {activeRequest.hrStage.benefitEstimate.secondInstallment.toLocaleString()} (Payable within 8
                        weeks post delivery upon birth verification)
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  You are requested to notify the Welfare Department immediately after childbirth with the delivery
                  certificate for final disbursement of the second installment. We wish you and your newborn healthy and
                  safe delivery.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between font-sans text-xs">
                <div className="text-center">
                  <div className="border-t border-slate-400 w-40 pt-1">
                    <p className="font-bold">{activeRequest.welfareStage1.welfareOfficerName}</p>
                    <p className="text-[10px] text-slate-500">Welfare Officer</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-t border-slate-400 w-44 pt-1">
                    <p className="font-bold">{activeRequest.medicalStage.assignedDoctor}</p>
                    <p className="text-[10px] text-slate-500">Chief Medical Officer</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-t border-slate-400 w-48 pt-1">
                    <p className="font-bold text-purple-800">{activeRequest.hrStage.hrReviewerName || hrOfficerName}</p>
                    <p className="text-[10px] text-slate-500">Head of HR &amp; Compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL 3: DOCUMENT VIEWER / PREVIEW                                           */}
      {/* ========================================================================= */}
      {selectedDocToView && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
            {/* Document Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50 via-white to-indigo-50 dark:from-purple-950/30 dark:via-slate-900 dark:to-indigo-950/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedDocToView.doc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold uppercase">
                      {selectedDocToView.doc.type.replace(/_/g, " ")}
                    </span>
                    <span>Size: {selectedDocToView.doc.size}</span>
                    <span>&bull;</span>
                    <span>Uploaded: {selectedDocToView.doc.uploadDate}</span>
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Print Document"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDocToView(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="p-5 overflow-y-auto flex-1 bg-slate-100/60 dark:bg-slate-950/60">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-xl mx-auto space-y-4">
                <div className="border-b-2 border-slate-800 dark:border-slate-300 pb-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <HeartPulse className="w-6 h-6 text-rose-500" />
                    <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                      Central Maternity &amp; Women Health Clinic
                    </h2>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Industrial Health Complex, Plot 14, Sector 7, Uttara, Dhaka-1230 &bull; License #DHK-MED-92418
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Patient Name</span>
                    <strong className="text-slate-800 dark:text-slate-200">{selectedDocToView.employeeName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Employee ID</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {selectedDocToView.employeeId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Document Date</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedDocToView.doc.uploadDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Doc Ref</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{selectedDocToView.doc.id}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <p>
                    <strong>Document Description:</strong> Official {selectedDocToView.doc.name} submitted during welfare counseling and verified by clinic medical officer.
                  </p>
                  <p>
                    <strong>Verification Status:</strong> Authenticated and confirmed compliant with the Bangladesh Labor Act 2006 statutory requirements.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                Document Ref: {selectedDocToView.doc.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDocToView(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
