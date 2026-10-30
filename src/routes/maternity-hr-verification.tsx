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
} from "lucide-react";
import {
  MaternityRequest,
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
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "ALL">("PENDING");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");

  // Modals
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isSanctionLetterOpen, setIsSanctionLetterOpen] = useState(false);
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
      // Tab filter
      if (activeTab === "PENDING" && r.currentStage !== "WELFARE_LEAVE_SCHEDULED") return false;
      if (activeTab === "APPROVED" && r.currentStage !== "HR_APPROVED") return false;

      // Department filter
      if (selectedDept !== "ALL" && r.employee.department !== selectedDept) return false;

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          r.employee.name.toLowerCase().includes(query) ||
          r.employee.id.includes(query) ||
          r.id.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [requests, activeTab, selectedDept, searchTerm]);

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

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setActiveTab("PENDING")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === "PENDING"
                      ? "bg-purple-600 text-white font-semibold shadow-sm"
                      : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Pending HR Verification ({stats.pendingHr})
                </button>
                <button
                  onClick={() => setActiveTab("APPROVED")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "APPROVED"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Approved Cases ({stats.approved})
                </button>
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "ALL"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  All Applications ({stats.total})
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Admin and Compliance">Admin and Compliance</option>
                  <option value="Sample & CAD">Sample & CAD</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Production RMG">Production RMG</option>
                </select>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search applicant, ID, sanction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Case Ref / Sanction</th>
                    <th className="py-3.5 px-4">Employee Details</th>
                    <th className="py-3.5 px-4">Statutory Service (&ge;6m)</th>
                    <th className="py-3.5 px-4">Medical Confirmed EDD</th>
                    <th className="py-3.5 px-4">Leave Duration (112 Days)</th>
                    <th className="py-3.5 px-4">Calculated Benefit (BDT)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        No maternity records pending for this HR filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => {
                      const isPendingHr = req.currentStage === "WELFARE_LEAVE_SCHEDULED";
                      const isApproved = req.currentStage === "HR_APPROVED";

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                        >
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

                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                {req.employee.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                ID: {req.employee.id} &bull; {req.employee.designation}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {req.employee.department} &bull; Monthly:{" "}
                                {req.employee.grossSalary.toLocaleString()} BDT
                              </p>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {req.welfareStage1.serviceDurationText}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Joined: {req.employee.joiningDate}
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-pink-600 dark:text-pink-400">
                              {req.medicalStage.expectedDeliveryDate || "N/A"}
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {req.medicalStage.checkupVisits.length} checkups verified
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {req.welfareStage2.expectedLeaveStartDate} to {req.welfareStage2.expectedLeaveEndDate}
                            </p>
                            <span className="text-[10px] font-semibold text-emerald-600">
                              {req.welfareStage2.totalLeaveDays || 112} Days (16 Weeks)
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {req.hrStage.benefitEstimate.total112DaysAmount.toLocaleString()} BDT
                            </p>
                            <p className="text-[10px] text-slate-500">
                              2 Inst: {req.hrStage.benefitEstimate.firstInstallment.toLocaleString()} x 2
                            </p>
                          </td>

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

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPendingHr && (
                                <button
                                  onClick={() => openVerifyModal(req)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs flex items-center gap-1 transition"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Verify &amp; Approve
                                </button>
                              )}

                              {isApproved && (
                                <button
                                  onClick={() => openSanctionLetter(req)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 transition"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  Sanction Order
                                </button>
                              )}

                              <button
                                onClick={() => openVerifyModal(req)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                                title="Audit Dossier"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
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
                    Case Ref: <strong className="font-mono text-purple-600 dark:text-purple-400">{activeRequest.id}</strong> &bull; Review compliance and approve 112 days leave order
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* 1. Employee & Statutory Service Overview */}
              <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Employee</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">{activeRequest.employee.name}</strong>
                    <span className="text-[10px] text-slate-500 block">ID: {activeRequest.employee.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Department &amp; Section</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium block">{activeRequest.employee.department}</span>
                    <span className="text-[10px] text-slate-500">{activeRequest.employee.section}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Designation &amp; Salary</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium block">{activeRequest.employee.designation}</span>
                    <span className="font-mono text-[10px] font-bold text-emerald-600">{activeRequest.employee.grossSalary.toLocaleString()} BDT / mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Service Tenure</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{activeRequest.employee.joiningDate}</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{activeRequest.welfareStage1.serviceDurationText}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                      Labor Law Sec. 46 Compliant (&ge; 6 Months Continuous Service)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Statutory Eligible
                  </span>
                </div>
              </div>

              {/* 2. Medical Clearance & Proposed Leave Schedule */}
              <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Medical Clearance */}
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        Medical Clearance
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeRequest.medicalStage.checkupVisits.length} checkups
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      Confirmed EDD: <span className="text-pink-600 dark:text-pink-400">{activeRequest.medicalStage.expectedDeliveryDate || "Confirmed"}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Doctor Fitness: <strong className="text-slate-700 dark:text-slate-300">{activeRequest.medicalStage.clinicalFitness}</strong>
                    </p>
                  </div>

                  {/* Scheduled Leave */}
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Scheduled Leave Period
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">112 Days (16 Weeks)</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      {activeRequest.welfareStage2.expectedLeaveStartDate} &rarr; {activeRequest.welfareStage2.expectedLeaveEndDate}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      56 days pre-natal &bull; 56 days post-natal (Labor Act Sec 46)
                    </p>
                  </div>
                </div>

                {/* Attached Documents List */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wide mb-1.5">
                    Attached Verification Documents ({activeRequest.welfareStage1.attachedDocuments.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRequest.welfareStage1.attachedDocuments.map((doc) => (
                      <span
                        key={doc.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-500" />
                        {doc.name}
                        <span className="text-[10px] text-slate-400 font-mono">({doc.size})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Comments */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Comments
                </label>
                <textarea
                  rows={2}
                  value={hrRemarks}
                  onChange={(e) => setHrRemarks(e.target.value)}
                  placeholder="Write a comments (if required)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs resize-y min-h-[50px]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={handleReject}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject Application
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>

                {activeRequest.currentStage === "WELFARE_LEAVE_SCHEDULED" ? (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/25 flex items-center gap-2 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve &amp; Issue Sanction Order
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifyModalOpen(false);
                      openSanctionLetter(activeRequest);
                    }}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2 transition"
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
    </div>
  );
}
