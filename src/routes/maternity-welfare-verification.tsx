import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  HeartPulse,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  FileText,
  Upload,
  UploadCloud,
  FileUp,
  Trash2,
  Paperclip,
  FileCheck,
  UserCheck,
  Building2,
  Phone,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Eye,
  FileCheck2,
  ArrowRight,
  Stethoscope,
  X,
  Send,
  Baby,
  Printer,
  Sparkles,
  Info,
} from "lucide-react";
import {
  FemaleEmployee,
  MaternityRequest,
  MaternityDocument,
  INITIAL_FEMALE_EMPLOYEES,
  getMaternityRequests,
  createWelfareMaternityRequest,
  submitWelfareLeaveScheduleToHr,
  checkMaternityEligibility,
} from "@/lib/maternityLeaveStore";

export const Route = createFileRoute("/maternity-welfare-verification")({
  head: () => ({
    meta: [
      { title: "Maternity Welfare Verification & Intake — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Welfare department maternity intake, eligibility validation (>6 months service), document collection, previous history tracking, and leave scheduling based on medical EDD.",
      },
    ],
  }),
  component: MaternityWelfareVerificationPage,
});

function MaternityWelfareVerificationPage() {
  const [requests, setRequests] = useState<MaternityRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "INTAKE" | "MEDICAL" | "SCHEDULE" | "HR" | "APPROVED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");

  // Modals
  const [isNewIntakeOpen, setIsNewIntakeOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewDossierOpen, setIsViewDossierOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<MaternityRequest | null>(null);

  // New Intake Form States (Employee not pre-selected by default)
  const [selectedEmpId, setSelectedEmpId] = useState<string>("");
  const [welfareOfficerName, setWelfareOfficerName] = useState("Rozina Akter (Welfare Lead)");
  const [welfareOfficerId, setWelfareOfficerId] = useState("WLF-012");
  const [informedDate, setInformedDate] = useState("2026-10-28");
  const [tentativeTrimester, setTentativeTrimester] = useState<
    "1st Trimester (1-12 wks)" | "2nd Trimester (13-26 wks)" | "3rd Trimester (27+ wks)"
  >("2nd Trimester (13-26 wks)");
  const [counselingNotes, setCounselingNotes] = useState("");

  // Dynamic Document Rows for Verification Documents (Title input + Attachment upload field + Add Document button)
  interface DocumentRowItem {
    id: string;
    title: string;
    fileName: string;
    fileSize: string;
  }
  const [documentRows, setDocumentRows] = useState<DocumentRowItem[]>([
    { id: "doc-1", title: "Pregnancy Medical Certificate", fileName: "", fileSize: "" },
  ]);

  // Leave Scheduling Form States (Stage 2)
  const [scheduleStartDate, setScheduleStartDate] = useState("");
  const [scheduleEndDate, setScheduleEndDate] = useState("");
  const [scheduleTotalDays, setScheduleTotalDays] = useState(112);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [leaveAddress, setLeaveAddress] = useState("");
  const [welfareScheduleNotes, setWelfareScheduleNotes] = useState("");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Sync Data on load and listen for updates
  const loadRequests = () => {
    setRequests(getMaternityRequests());
  };

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener("maternity-data-updated", handleUpdate);
    return () => window.removeEventListener("maternity-data-updated", handleUpdate);
  }, []);

  // Selected Employee Details for New Intake (null when unselected)
  const currentSelectedEmp = useMemo(() => {
    if (!selectedEmpId) return null;
    return INITIAL_FEMALE_EMPLOYEES.find((e) => e.id === selectedEmpId) || null;
  }, [selectedEmpId]);

  // Eligibility evaluation of current selected employee
  const currentEligibility = useMemo(() => {
    if (!currentSelectedEmp) return null;
    return checkMaternityEligibility(currentSelectedEmp.joiningDate);
  }, [currentSelectedEmp]);

  // Metric counts
  const stats = useMemo(() => {
    const total = requests.length;
    const atMedical = requests.filter(
      (r) => r.currentStage === "WELFARE_INITIATED" || r.currentStage === "MEDICAL_FOLLOWUP"
    ).length;
    const readyForSchedule = requests.filter((r) => r.currentStage === "MEDICAL_VERIFIED").length;
    const atHr = requests.filter((r) => r.currentStage === "WELFARE_LEAVE_SCHEDULED").length;
    const approved = requests.filter((r) => r.currentStage === "HR_APPROVED").length;

    return { total, atMedical, readyForSchedule, atHr, approved };
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Tab filter
      if (activeTab === "INTAKE" && r.currentStage !== "WELFARE_INITIATED") return false;
      if (activeTab === "MEDICAL" && r.currentStage !== "MEDICAL_FOLLOWUP" && r.currentStage !== "WELFARE_INITIATED")
        return false;
      if (activeTab === "SCHEDULE" && r.currentStage !== "MEDICAL_VERIFIED") return false;
      if (activeTab === "HR" && r.currentStage !== "WELFARE_LEAVE_SCHEDULED") return false;
      if (activeTab === "APPROVED" && r.currentStage !== "HR_APPROVED") return false;

      // Department filter
      if (selectedDepartment !== "ALL" && r.employee.department !== selectedDepartment) return false;

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesEmp =
          r.employee.name.toLowerCase().includes(query) ||
          r.employee.id.includes(query) ||
          r.id.toLowerCase().includes(query) ||
          r.employee.department.toLowerCase().includes(query);
        if (!matchesEmp) return false;
      }

      return true;
    });
  }, [requests, activeTab, selectedDepartment, searchTerm]);

  // Handle open Schedule Leave modal for returned medical record
  const openScheduleModal = (req: MaternityRequest) => {
    setActiveRequest(req);
    const eddStr = req.medicalStage.expectedDeliveryDate;
    if (eddStr) {
      const edd = new Date(eddStr);
      const start = new Date(edd);
      start.setDate(edd.getDate() - 56);
      const end = new Date(edd);
      end.setDate(edd.getDate() + 55);

      setScheduleStartDate(req.welfareStage2.expectedLeaveStartDate || start.toISOString().substring(0, 10));
      setScheduleEndDate(req.welfareStage2.expectedLeaveEndDate || end.toISOString().substring(0, 10));
    } else {
      setScheduleStartDate("2026-11-01");
      setScheduleEndDate("2027-02-20");
    }
    setScheduleTotalDays(112);
    setEmergencyContact(req.employee.spouseName || req.employee.emergencyContact || "Spouse");
    setEmergencyPhone(req.employee.emergencyContact || req.employee.phone);
    setLeaveAddress(req.employee.presentAddress || "");
    setWelfareScheduleNotes(
      `Expected delivery date (${eddStr || "Confirmed"}) reviewed. Maternity leave duration scheduled for 112 days in accordance with Labor Act 2006. Medical examination cleared. Recommended for HR approval.`
    );
    setIsScheduleModalOpen(true);
  };

  // Submit Leave Schedule to HR
  const handleSaveLeaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest) return;

    submitWelfareLeaveScheduleToHr(activeRequest.id, {
      startDate: scheduleStartDate,
      endDate: scheduleEndDate,
      totalDays: scheduleTotalDays,
      leaveAddress: leaveAddress,
      emergencyContact: emergencyContact,
      emergencyPhone: emergencyPhone,
      welfareRemarks: welfareScheduleNotes,
    });

    setIsScheduleModalOpen(false);
    showToast(
      `✅ Leave scheduled for ${activeRequest.employee.name} (${scheduleTotalDays} Days: ${scheduleStartDate} to ${scheduleEndDate}) and forwarded to HR Verification!`
    );
  };

  // Document row actions
  const handleAddDocumentRow = () => {
    setDocumentRows((prev) => [
      ...prev,
      {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: "",
        fileName: "",
        fileSize: "",
      },
    ]);
  };

  const handleRemoveDocumentRow = (id: string) => {
    setDocumentRows((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDocumentTitleChange = (id: string, title: string) => {
    setDocumentRows((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title } : d))
    );
  };

  const handleDocumentFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    setDocumentRows((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              fileName: file.name,
              fileSize: sizeStr,
              title: d.title || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
            }
          : d
      )
    );
    e.target.value = "";
  };

  // Submit New Intake
  const handleCreateIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedEmp) {
      showToast("❌ Please select a female employee to proceed.");
      return;
    }
    if (!currentEligibility || !currentEligibility.isEligible) {
      showToast("❌ Cannot submit: Employee does not meet the minimum 6 months service requirement.");
      return;
    }

    const finalDocs: MaternityDocument[] = documentRows
      .filter((d) => d.title.trim() || d.fileName.trim())
      .map((d, index) => {
        const lower = (d.title + " " + d.fileName).toLowerCase();
        let docType: MaternityDocument["type"] = "Other";
        if (lower.includes("usg") || lower.includes("scan") || lower.includes("ultra")) {
          docType = "USG_Report";
        } else if (lower.includes("prescription") || lower.includes("rx")) {
          docType = "Prescription";
        } else if (lower.includes("nid") || lower.includes("id")) {
          docType = "NID";
        } else if (lower.includes("cert") || lower.includes("doctor") || lower.includes("fitness")) {
          docType = "Doctor_Certificate";
        } else if (lower.includes("declaration") || lower.includes("form")) {
          docType = "Declaration_Form";
        }

        return {
          id: `DOC-${Date.now()}-${index}`,
          name: d.title.trim() || d.fileName || `Verification Document ${index + 1}`,
          type: docType,
          size: d.fileSize || "1.2 MB",
          uploadDate: new Date().toISOString().substring(0, 10),
          status: "Verified",
        };
      });

    const finalNotes =
      counselingNotes.trim() ||
      "Employee visited the Welfare Department to notify her pregnancy. Service records reviewed. Documents received and counseling completed regarding nutritional and rest precautions.";

    const created = createWelfareMaternityRequest({
      employee: currentSelectedEmp,
      welfareOfficerName,
      welfareOfficerId,
      informedPregnancyDate: informedDate,
      tentativeTrimester,
      counselingNotes: finalNotes,
      documents: finalDocs,
    });

    setIsNewIntakeOpen(false);
    setSelectedEmpId("");
    setCounselingNotes("");
    setDocumentRows([
      { id: "doc-1", title: "Pregnancy Medical Certificate", fileName: "", fileSize: "" },
    ]);
    showToast(`✅ Maternity request initiated for ${created.employee.name} and forwarded to Medical Verification!`);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Toast Notification */}
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
          {/* Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                <span>Maternity Leave</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-pink-600 dark:text-pink-400 font-semibold">Welfare Verification</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 border border-pink-200 dark:border-pink-800/50">
                  <HeartPulse className="w-6 h-6" />
                </span>
                Maternity Welfare Verification & Intake
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                  Stage 1 & Stage 2
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Initiate employee pregnancy intake, validate 6-month statutory eligibility, review previous maternity leaves,
                and schedule leave dates upon medical EDD confirmation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/maternity-medical-verification"
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition flex items-center gap-1.5"
              >
                <Stethoscope className="w-4 h-4 text-blue-500" />
                Medical Verification Queue
              </Link>

              <button
                onClick={() => {
                  setSelectedEmpId("");
                  setDocumentRows([
                    { id: "doc-1", title: "Pregnancy Medical Certificate", fileName: "", fileSize: "" },
                  ]);
                  setIsNewIntakeOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md shadow-pink-600/20 hover:shadow-lg transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Maternity Intake Form
              </button>
            </div>
          </div>

          {/* Filter Bar & Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "ALL"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  All ({requests.length})
                </button>
                <button
                  onClick={() => setActiveTab("INTAKE")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "INTAKE"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Awaiting Medical Exam
                </button>
                <button
                  onClick={() => setActiveTab("SCHEDULE")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === "SCHEDULE"
                      ? "bg-amber-500 text-white font-semibold shadow-sm"
                      : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ready to Schedule Dates ({stats.readyForSchedule})
                </button>
                <button
                  onClick={() => setActiveTab("HR")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "HR"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Forwarded to HR ({stats.atHr})
                </button>
                <button
                  onClick={() => setActiveTab("APPROVED")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "APPROVED"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Approved ({stats.approved})
                </button>
              </div>

              {/* Department & Search */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Admin and Compliance">Admin and Compliance</option>
                  <option value="Sample & CAD">Sample & CAD</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Production RMG">Production RMG</option>
                  <option value="Merchandising">Merchandising</option>
                </select>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search employee, ID, ref..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Case Ref / Date</th>
                    <th className="py-3.5 px-4">Employee Information</th>
                    <th className="py-3.5 px-4">Continuous Service (Labor Law &ge;6m)</th>
                    <th className="py-3.5 px-4">Previous Leaves</th>
                    <th className="py-3.5 px-4">Current Workflow Stage</th>
                    <th className="py-3.5 px-4">Medical EDD</th>
                    <th className="py-3.5 px-4">Scheduled Leave</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                        <HeartPulse className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        No maternity records found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => {
                      const isReadyToSchedule = req.currentStage === "MEDICAL_VERIFIED";
                      const isApproved = req.currentStage === "HR_APPROVED";

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                        >
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                            <div>{req.id}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{req.welfareStage1.intakeDate}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                {req.employee.name}
                                {req.employee.nameBn && (
                                  <span className="text-[10px] text-slate-400">({req.employee.nameBn})</span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                ID: {req.employee.id} &bull; {req.employee.designation}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {req.employee.department} &bull; {req.employee.section}
                              </p>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              {req.welfareStage1.isEligible ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Eligible ({req.welfareStage1.serviceDurationText})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  Ineligible (&lt; 6 months)
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">Joined: {req.employee.joiningDate}</p>
                          </td>

                          <td className="py-3.5 px-4">
                            {req.employee.previousMaternityLeaves.length > 0 ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  {req.employee.previousMaternityLeaves.length} Previous Leave
                                  {req.employee.previousMaternityLeaves.length > 1 ? "s" : ""}
                                </span>
                                <p className="text-[10px] text-slate-400">
                                  Last: {req.employee.previousMaternityLeaves[0].deliveryDate}
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">1st Maternity (None)</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {req.currentStage === "WELFARE_INITIATED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                <Clock className="w-3 h-3" />
                                Intake Done &rarr; At Medical
                              </span>
                            )}
                            {req.currentStage === "MEDICAL_FOLLOWUP" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                <Stethoscope className="w-3 h-3" />
                                Medical Follow-up Scheduled
                              </span>
                            )}
                            {req.currentStage === "MEDICAL_VERIFIED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300 dark:border-amber-700 animate-pulse">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                Returned: Schedule Leave Dates!
                              </span>
                            )}
                            {req.currentStage === "WELFARE_LEAVE_SCHEDULED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                <Send className="w-3 h-3" />
                                Forwarded to HR
                              </span>
                            )}
                            {req.currentStage === "HR_APPROVED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                HR Approved
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {req.medicalStage.expectedDeliveryDate ? (
                              <div>
                                <span className="font-semibold text-pink-600 dark:text-pink-400">
                                  {req.medicalStage.expectedDeliveryDate}
                                </span>
                                <p className="text-[10px] text-slate-400">EDD Confirmed</p>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Pending Medical EDD</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {req.welfareStage2.expectedLeaveStartDate ? (
                              <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  {req.welfareStage2.expectedLeaveStartDate} to {req.welfareStage2.expectedLeaveEndDate}
                                </p>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                  {req.welfareStage2.totalLeaveDays} Calendar Days (16 Wks)
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Not scheduled yet</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isReadyToSchedule && (
                                <button
                                  onClick={() => openScheduleModal(req)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center gap-1 transition"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  Schedule Dates
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setActiveRequest(req);
                                  setIsViewDossierOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                title="View Dossier"
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
      {/* MODAL 1: NEW MATERNITY INTAKE DRAWER / FORM (STAGE 1 - REDESIGNED)        */}
      {/* ========================================================================= */}
      {isNewIntakeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-pink-50/80 via-white to-rose-50/80 dark:from-pink-950/30 dark:via-slate-900 dark:to-rose-950/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 flex items-center justify-center shadow-xs">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    New Maternity Intake &amp; Eligibility Verification
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Welfare Stage 1: Validate continuous service tenure (&ge; 6 months) and record medical documents
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewIntakeOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleCreateIntake} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* SECTION 1: EMPLOYEE SELECTION & ELIGIBILITY */}
              <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 flex items-center justify-center text-[11px] font-bold">
                      1
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Female Employee Information &amp; Eligibility
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">Continuous Service Check</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Female Employee *
                  </label>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">-- Select Female Employee --</option>
                    {INITIAL_FEMALE_EMPLOYEES.map((emp) => {
                      const elig = checkMaternityEligibility(emp.joiningDate);
                      return (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.id}) — {emp.designation}, {emp.department} [Joined: {emp.joiningDate} &bull;{" "}
                          {elig.isEligible ? "ELIGIBLE" : "INELIGIBLE (<6m)"}]
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* When no employee is selected yet */}
                {!currentSelectedEmp && (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-800/50">
                    <UserCheck className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Please select an employee above to verify her service tenure, statutory eligibility, and previous history.
                    </p>
                  </div>
                )}

                {/* When an employee is selected: Display Particulars & Eligibility */}
                {currentSelectedEmp && currentEligibility && (
                  <div className="space-y-3 pt-1">
                    {/* 4-Column Particulars Overview */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Designation</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {currentSelectedEmp.designation}
                          </p>
                          <p className="text-[10px] text-slate-500">{currentSelectedEmp.department}</p>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Monthly Salary</p>
                          <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {currentSelectedEmp.grossSalary.toLocaleString()} BDT
                          </p>
                          <p className="text-[10px] text-slate-500">{currentSelectedEmp.section}</p>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Joining Date &amp; Tenure</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {currentSelectedEmp.joiningDate}
                          </p>
                          <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {currentEligibility.durationFormatted}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Phone &amp; NID</p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {currentSelectedEmp.phone}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500">{currentSelectedEmp.nid}</p>
                        </div>
                      </div>
                    </div>

                    {/* Statutory Eligibility Banner */}
                    {currentEligibility.isEligible ? (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                              ELIGIBLE FOR STATUTORY MATERNITY BENEFIT (LABOR ACT SECTION 46)
                            </p>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                              Continuous service tenure: <strong>{currentEligibility.durationFormatted}</strong> (Meets &ge; 6 months requirement).
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white flex-shrink-0">
                          Eligible &ge; 6m
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                              INELIGIBLE: LESS THAN 6 MONTHS SERVICE ({currentEligibility.durationFormatted})
                            </p>
                            <p className="text-[11px] text-rose-700 dark:text-rose-300">
                              Employee has not completed 6 months continuous service. Submission is locked in compliance with labor law.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white flex-shrink-0">
                          Ineligible (&lt; 6m)
                        </span>
                      </div>
                    )}

                    {/* Previous Maternity Leave History */}
                    {currentSelectedEmp.previousMaternityLeaves.length > 0 ? (
                      <div className="border border-amber-200 dark:border-amber-900/60 rounded-xl overflow-hidden bg-amber-50/20 dark:bg-amber-950/10">
                        <div className="px-3 py-1.5 bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between">
                          <span>Previous Maternity History ({currentSelectedEmp.previousMaternityLeaves.length} Recorded)</span>
                          {currentSelectedEmp.previousMaternityLeaves.length >= 2 && (
                            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-normal">
                              Statutory limit: max 2 paid children (Sec 46-3)
                            </span>
                          )}
                        </div>
                        <table className="w-full text-xs text-left">
                          <thead className="text-[10px] uppercase text-slate-500 border-b border-amber-200/50">
                            <tr>
                              <th className="py-2 px-3">Child</th>
                              <th className="py-2 px-3">Leave Period</th>
                              <th className="py-2 px-3">Delivery Date</th>
                              <th className="py-2 px-3">Days</th>
                              <th className="py-2 px-3">Benefit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-200/50 dark:divide-amber-900/40">
                            {currentSelectedEmp.previousMaternityLeaves.map((hist, idx) => (
                              <tr key={hist.id}>
                                <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                                  Baby #{hist.childNumber || idx + 1}
                                </td>
                                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                                  {hist.leaveStartDate} to {hist.leaveEndDate}
                                </td>
                                <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{hist.deliveryDate}</td>
                                <td className="py-2 px-3 font-semibold text-emerald-600">{hist.totalDays}d</td>
                                <td className="py-2 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                                  {hist.benefitDisbursedBdt.toLocaleString()} BDT
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        First Maternity Application &mdash; No previous maternity leave recorded.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 2: WELFARE INTAKE DETAILS */}
              <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 flex items-center justify-center text-[11px] font-bold">
                    2
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Welfare Intake &amp; Consultation Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Consultation Date *
                    </label>
                    <input
                      type="date"
                      value={informedDate}
                      onChange={(e) => setInformedDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tentative Pregnancy Trimester *
                    </label>
                    <select
                      value={tentativeTrimester}
                      onChange={(e: any) => setTentativeTrimester(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="1st Trimester (1-12 wks)">1st Trimester (1-12 wks)</option>
                      <option value="2nd Trimester (13-26 wks)">2nd Trimester (13-26 wks)</option>
                      <option value="3rd Trimester (27+ wks)">3rd Trimester (27+ wks)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Welfare Officer Name
                    </label>
                    <input
                      type="text"
                      value={welfareOfficerName}
                      onChange={(e) => setWelfareOfficerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Welfare Counseling Notes &amp; Observations *
                  </label>
                  <textarea
                    rows={2}
                    value={counselingNotes}
                    onChange={(e) => setCounselingNotes(e.target.value)}
                    placeholder="Write a comments (if required)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs resize-y min-h-[50px]"
                  />
                </div>
              </div>

              {/* SECTION 3: REQUIRED MEDICAL REPORTS & VERIFICATION DOCUMENTS */}
              <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 flex items-center justify-center text-[11px] font-bold">
                      3
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Required Medical Reports &amp; Verification Documents
                    </h3>
                  </div>
                  <span className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold">
                    {documentRows.length} Document Row{documentRows.length === 1 ? "" : "s"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provide document titles and upload medical reports (e.g., Doctor&apos;s Prescription, USG Report, Pregnancy Certificate, NID).
                </p>

                {/* Dynamic Document Rows */}
                <div className="space-y-3">
                  {documentRows.map((doc, idx) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-300 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          Document #{idx + 1}
                        </span>

                        {documentRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDocumentRow(doc.id)}
                            className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 transition"
                            title="Remove this document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Title Input Field */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Document Title *
                          </label>
                          <input
                            type="text"
                            value={doc.title}
                            onChange={(e) => handleDocumentTitleChange(doc.id, e.target.value)}
                            placeholder="e.g. Doctor's Prescription, USG Report, NID Copy"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>

                        {/* Attachment Upload Field */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Attachment File
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                onChange={(e) => handleDocumentFileChange(doc.id, e)}
                                className="hidden"
                              />
                              <div className="w-full px-3 py-2 text-xs rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 hover:border-pink-500 hover:bg-pink-50/20 text-slate-600 dark:text-slate-300 flex items-center justify-between transition truncate">
                                <span className="flex items-center gap-1.5 truncate">
                                  <Upload className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                                  <span className="truncate">
                                    {doc.fileName ? doc.fileName : "Choose file to upload..."}
                                  </span>
                                </span>
                                {doc.fileSize && (
                                  <span className="text-[10px] text-emerald-600 font-mono font-medium flex-shrink-0 ml-1">
                                    {doc.fileSize}
                                  </span>
                                )}
                              </div>
                            </label>

                            {doc.fileName && (
                              <button
                                type="button"
                                onClick={() =>
                                  setDocumentRows((prev) =>
                                    prev.map((d) => (d.id === doc.id ? { ...d, fileName: "", fileSize: "" } : d))
                                  )
                                }
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                title="Clear uploaded file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Document Button */}
                  <button
                    type="button"
                    onClick={handleAddDocumentRow}
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-pink-300 dark:border-pink-800/80 text-pink-600 dark:text-pink-400 hover:bg-pink-50/60 dark:hover:bg-pink-950/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                </div>
              </div>

              {/* Modal Footer / Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {!currentSelectedEmp ? (
                    <span className="text-slate-400">Please select an employee</span>
                  ) : currentEligibility?.isEligible ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to submit to Medical Verification
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Service tenure &lt; 6 months (Submission locked)
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsNewIntakeOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!currentSelectedEmp || !currentEligibility?.isEligible}
                    className={`px-5 py-2 text-xs font-semibold rounded-xl text-white shadow-md flex items-center gap-2 transition ${
                      currentSelectedEmp && currentEligibility?.isEligible
                        ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-600/25"
                        : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60 text-slate-500"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit for Medical Verification
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: WELFARE STAGE 2 LEAVE SCHEDULING (AFTER MEDICAL CONFIRMED EDD)    */}
      {/* ========================================================================= */}
      {isScheduleModalOpen && activeRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Schedule Maternity Leave Dates (Welfare Stage 2)
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Medical verification completed. Set Expected Leave Start &amp; End Dates based on Confirmed EDD.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeaveSchedule} className="p-6 space-y-5">
              {/* Medical Verification Summary Box */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                      Medical Officer Final Findings:
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300">
                    Confirmed EDD: {activeRequest.medicalStage.expectedDeliveryDate || "Not recorded"}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {activeRequest.medicalStage.doctorFinalRemarks}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Doctor: {activeRequest.medicalStage.assignedDoctor} &bull; Reg: {activeRequest.medicalStage.doctorRegNo}
                </p>
              </div>

              {/* Leave Dates Calculation Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Leave Start Date *
                  </label>
                  <input
                    type="date"
                    value={scheduleStartDate}
                    onChange={(e) => setScheduleStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Suggested: 8 weeks prior to EDD</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Leave End Date *
                  </label>
                  <input
                    type="date"
                    value={scheduleEndDate}
                    onChange={(e) => setScheduleEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Suggested: 8 weeks after EDD</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Leave Days
                  </label>
                  <input
                    type="number"
                    value={scheduleTotalDays}
                    onChange={(e) => setScheduleTotalDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                  <p className="text-[10px] text-emerald-600 font-medium mt-1">Standard: 112 Days (16 Wks)</p>
                </div>
              </div>

              {/* Emergency Contact & Address During Leave */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Contact Person
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Phone Number
                  </label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Residence Address During Maternity Leave
                </label>
                <input
                  type="text"
                  value={leaveAddress}
                  onChange={(e) => setLeaveAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Welfare Department Final Recommendation to HR
                </label>
                <textarea
                  rows={3}
                  value={welfareScheduleNotes}
                  onChange={(e) => setWelfareScheduleNotes(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-600/25 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit to HR for Final Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW COMPREHENSIVE DOSSIER                                        */}
      {/* ========================================================================= */}
      {isViewDossierOpen && activeRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-pink-600">{activeRequest.id}</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Maternity Case Dossier: {activeRequest.employee.name}
                </h2>
              </div>
              <button
                onClick={() => setIsViewDossierOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Profile Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{activeRequest.employee.name}</p>
                  <p className="text-slate-500">
                    ID: {activeRequest.employee.id} &bull; {activeRequest.employee.designation} &bull; {activeRequest.employee.department}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Service: {activeRequest.welfareStage1.serviceDurationText} (Joined {activeRequest.employee.joiningDate})
                  </p>
                </div>
              </div>

              {/* Welfare Stage 1 Summary */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wide text-[11px]">
                  Welfare Intake & Counseling
                </h4>
                <p className="text-slate-700 dark:text-slate-300">{activeRequest.welfareStage1.counselingNotes}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeRequest.welfareStage1.attachedDocuments.map((doc) => (
                    <span
                      key={doc.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border border-pink-200 text-[11px]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {doc.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medical Stage Summary */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide text-[11px]">
                  Medical Verification & Clinical Findings
                </h4>
                {activeRequest.medicalStage.checkupVisits.length > 0 ? (
                  <div className="space-y-2">
                    {activeRequest.medicalStage.checkupVisits.map((v) => (
                      <div
                        key={v.visitId}
                        className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 text-[11px]"
                      >
                        <div className="flex items-center justify-between font-semibold text-blue-950 dark:text-blue-200">
                          <span>Visit #{v.visitNumber} ({v.visitDate}) - {v.doctorName}</span>
                          <span>BP: {v.bloodPressure} &bull; Fetal HR: {v.fetalHeartRate}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">{v.clinicalFindings}</p>
                        {v.nextFollowupDate && (
                          <p className="text-indigo-600 font-semibold mt-0.5">Next Follow-up: {v.nextFollowupDate}</p>
                        )}
                      </div>
                    ))}
                    {activeRequest.medicalStage.expectedDeliveryDate && (
                      <p className="font-bold text-pink-600 pt-1">
                        Confirmed Expected Delivery Date (EDD): {activeRequest.medicalStage.expectedDeliveryDate}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No clinical visits logged yet.</p>
                )}
              </div>

              {/* Welfare Stage 2 & HR Summary */}
              {activeRequest.welfareStage2.expectedLeaveStartDate && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide text-[11px]">
                    Leave Schedule & Welfare Recommendation
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300">
                    Period: <strong>{activeRequest.welfareStage2.expectedLeaveStartDate}</strong> to{" "}
                    <strong>{activeRequest.welfareStage2.expectedLeaveEndDate}</strong> (
                    {activeRequest.welfareStage2.totalLeaveDays} Days)
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Remarks: {activeRequest.welfareStage2.welfareOfficerRemarks}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end">
              <button
                onClick={() => setIsViewDossierOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-700"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
