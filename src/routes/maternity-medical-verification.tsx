import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Stethoscope,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  FileText,
  AlertCircle,
  Activity,
  Heart,
  CalendarPlus,
  Send,
  Eye,
  X,
  ChevronRight,
  ShieldCheck,
  Plus,
  ArrowRight,
  Baby,
  HeartPulse,
  Printer,
  Sparkles,
  Download,
  ExternalLink,
  FileCheck,
} from "lucide-react";
import {
  MaternityRequest,
  MaternityDocument,
  MedicalCheckupVisit,
  getMaternityRequests,
  logMedicalVisitAndProcess,
} from "@/lib/maternityLeaveStore";

export const Route = createFileRoute("/maternity-medical-verification")({
  head: () => ({
    meta: [
      { title: "Maternity Medical Verification & Follow-up Clinic — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Medical officer maternity verification, in-person clinical checkup logs, scheduled follow-up visits, vitals tracking, and Expected Delivery Date (EDD) confirmation.",
      },
    ],
  }),
  component: MaternityMedicalVerificationPage,
});

function MaternityMedicalVerificationPage() {
  const [requests, setRequests] = useState<MaternityRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING_INITIAL" | "FOLLOWUP" | "COMPLETED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");

  // Clinical Examination Modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<MaternityRequest | null>(null);

  // Selected Document to Open/View in Modal
  const [selectedDocToView, setSelectedDocToView] = useState<{
    doc: MaternityDocument;
    employeeName: string;
    employeeId: string;
    nid?: string;
  } | null>(null);

  // New Checkup Form Fields
  const [doctorName, setDoctorName] = useState("Dr. Farzana Yasmin, MBBS, DGO");
  const [doctorRegNo, setDoctorRegNo] = useState("BMDC-A-45920");
  const [checkupDate, setCheckupDate] = useState("2026-10-28");
  const [bp, setBp] = useState("118/76 mmHg");
  const [pulse, setPulse] = useState("78 bpm");
  const [weightKg, setWeightKg] = useState(62.5);
  const [gestationalWeeks, setGestationalWeeks] = useState(26);
  const [fetalHeartRate, setFetalHeartRate] = useState("142 bpm");
  const [hemoglobin, setHemoglobin] = useState("11.6 g/dL");
  const [bloodSugar, setBloodSugar] = useState("5.4 mmol/L");
  const [clinicalFindings, setClinicalFindings] = useState("");
  const [prescribedVitamins, setPrescribedVitamins] = useState("");

  // Workflow Decision: Follow-up vs Final Assessment
  const [isFinalCheckup, setIsFinalCheckup] = useState(false);
  const [nextFollowupDate, setNextFollowupDate] = useState("2026-11-12");
  const [eddDate, setEddDate] = useState("2026-12-28");
  const [clinicalFitness, setClinicalFitness] = useState<
    "Normal Health - Fit to Work" | "Fit for Light Duty" | "High Risk - Immediate Rest Advised"
  >("Fit for Light Duty");
  const [doctorFinalRemarks, setDoctorFinalRemarks] = useState("");

  // View Dossier Modal
  const [isViewDossierOpen, setIsViewDossierOpen] = useState(false);

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

  // Filter requests that are relevant to Medical: WELFARE_INITIATED, MEDICAL_FOLLOWUP, or already MEDICAL_VERIFIED/beyond
  const stats = useMemo(() => {
    const queue = requests.filter(
      (r) =>
        r.currentStage === "WELFARE_INITIATED" ||
        r.currentStage === "MEDICAL_FOLLOWUP" ||
        r.currentStage === "MEDICAL_VERIFIED"
    );
    const initialPending = requests.filter((r) => r.currentStage === "WELFARE_INITIATED").length;
    const followups = requests.filter((r) => r.currentStage === "MEDICAL_FOLLOWUP").length;
    const completed = requests.filter(
      (r) =>
        r.currentStage === "MEDICAL_VERIFIED" ||
        r.currentStage === "WELFARE_LEAVE_SCHEDULED" ||
        r.currentStage === "HR_APPROVED"
    ).length;

    return { totalQueue: queue.length, initialPending, followups, completed };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Tab filter
      if (activeTab === "PENDING_INITIAL" && r.currentStage !== "WELFARE_INITIATED") return false;
      if (activeTab === "FOLLOWUP" && r.currentStage !== "MEDICAL_FOLLOWUP") return false;
      if (
        activeTab === "COMPLETED" &&
        r.currentStage !== "MEDICAL_VERIFIED" &&
        r.currentStage !== "WELFARE_LEAVE_SCHEDULED" &&
        r.currentStage !== "HR_APPROVED"
      )
        return false;

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

  // Open Examination Modal
  const openExamModal = (req: MaternityRequest) => {
    setActiveRequest(req);
    const visitCount = req.medicalStage.checkupVisits.length;

    // Prefill form
    setDoctorName(req.medicalStage.assignedDoctor || "Dr. Farzana Yasmin, MBBS, DGO");
    setDoctorRegNo(req.medicalStage.doctorRegNo || "BMDC-A-45920");
    setCheckupDate("2026-10-28");

    // Suggest default gestational weeks based on trimester or visits
    const guessedWeeks = visitCount > 0 ? (req.medicalStage.checkupVisits[visitCount - 1].gestationalWeeks || 24) + 2 : 24;
    setGestationalWeeks(guessedWeeks);

    // If already has visits, toggle default to final checkup if week >= 28 or let user choose
    setIsFinalCheckup(visitCount >= 1);
    setNextFollowupDate("2026-11-15");
    setEddDate(req.medicalStage.expectedDeliveryDate || "2026-12-28");
    setClinicalFitness(req.medicalStage.clinicalFitness || "Normal Health - Fit to Work");
    setClinicalFindings("");
    setPrescribedVitamins("");
    setDoctorFinalRemarks(req.medicalStage.doctorFinalRemarks || "");

    setIsExamModalOpen(true);
  };

  // Submit Clinical Checkup Result
  const handleSaveCheckup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest) return;

    if (isFinalCheckup && !eddDate) {
      showToast("❌ Please specify the Confirmed Expected Delivery Date (EDD).");
      return;
    }

    const finalFindings =
      clinicalFindings.trim() ||
      "Active fetal movement present. Fetal heart sounds regular and strong. No ankle edema. Fundal height matches gestational age.";
    const finalVitamins =
      prescribedVitamins.trim() ||
      "Tab. Calcium Carbonate 500mg (1+0+1), Cap. Iron Polymaltose Complex (0+1+0), Tab. Folic Acid 5mg.";
    const finalRemarks =
      doctorFinalRemarks.trim() ||
      "Patient clinically stable. Fetal wellbeing verified through examination. Confirmed Expected Delivery Date (EDD).";

    const updated = logMedicalVisitAndProcess(
      activeRequest.id,
      {
        visitDate: checkupDate,
        doctorName,
        doctorRegNo,
        bloodPressure: bp,
        pulseRate: pulse,
        weightKg,
        gestationalWeeks,
        fetalHeartRate,
        hemoglobin,
        bloodSugar,
        clinicalFindings: finalFindings,
        prescribedVitamins: finalVitamins,
        nextFollowupDate: isFinalCheckup ? null : nextFollowupDate,
        medicalReports: ["Clinical_Checkup_Slip.pdf"],
      },
      isFinalCheckup,
      isFinalCheckup ? eddDate : undefined,
      clinicalFitness,
      finalRemarks
    );

    setIsExamModalOpen(false);

    if (isFinalCheckup) {
      showToast(
        `✅ Final medical checkup completed for ${activeRequest.employee.name}! EDD: ${eddDate} confirmed. Case returned to Welfare for leave scheduling.`
      );
    } else {
      showToast(
        `✅ Checkup logged for ${activeRequest.employee.name}. Next follow-up appointment scheduled for ${nextFollowupDate}.`
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-18 right-8 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-400 animate-in fade-in slide-in-from-top-4">
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
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Medical Verification</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                  <Stethoscope className="w-6 h-6" />
                </span>
                Maternity Medical Verification & Follow-up Clinic
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Medical officer clinical examinations, vital signs logging, scheduled follow-up visits, and Expected
                Delivery Date (EDD) certification.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/maternity-welfare-verification"
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-950/60 dark:text-pink-300 border border-pink-200 dark:border-pink-800 transition flex items-center gap-1.5"
              >
                <HeartPulse className="w-4 h-4 text-pink-500" />
                Back to Welfare Intake
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
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
                  onClick={() => setActiveTab("PENDING_INITIAL")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "PENDING_INITIAL"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  New Awaiting Checkup ({stats.initialPending})
                </button>
                <button
                  onClick={() => setActiveTab("FOLLOWUP")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "FOLLOWUP"
                      ? "bg-indigo-600 text-white font-semibold shadow-sm"
                      : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                  }`}
                >
                  Follow-ups Scheduled ({stats.followups})
                </button>
                <button
                  onClick={() => setActiveTab("COMPLETED")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === "COMPLETED"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  EDD Finalized &amp; Sent ({stats.completed})
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
                    placeholder="Search patient, ID, ref..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Medical Patients Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Case Ref</th>
                    <th className="py-3.5 px-4">Patient / Employee</th>
                    <th className="py-3.5 px-4">Welfare Intake Info</th>
                    <th className="py-3.5 px-4">Checkup Visits Done</th>
                    <th className="py-3.5 px-4">Follow-up Schedule</th>
                    <th className="py-3.5 px-4">Clinical Findings / Vitals</th>
                    <th className="py-3.5 px-4">Confirmed EDD</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Stethoscope className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        No patients found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => {
                      const visits = req.medicalStage.checkupVisits || [];
                      const lastVisit = visits[visits.length - 1];
                      const isNeedsExam =
                        req.currentStage === "WELFARE_INITIATED" || req.currentStage === "MEDICAL_FOLLOWUP";

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                        >
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                            <div>{req.id}</div>
                            <span className="text-[10px] text-slate-400">Intake: {req.welfareStage1.intakeDate}</span>
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
                                {req.employee.department} &bull; Age:{" "}
                                {new Date().getFullYear() - new Date(req.employee.dob).getFullYear()}
                              </p>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border border-pink-200">
                              {req.welfareStage1.tentativeTrimester}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {req.welfareStage1.attachedDocuments.length} Documents uploaded
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                              <Activity className="w-3.5 h-3.5" />
                              {visits.length} Visit{visits.length === 1 ? "" : "s"} Logged
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {lastVisit && lastVisit.nextFollowupDate ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300">
                                  <Calendar className="w-3 h-3 text-indigo-600" />
                                  {lastVisit.nextFollowupDate}
                                </span>
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
                                  Patient to return for re-check
                                </p>
                              </div>
                            ) : req.medicalStage.isFinalCheckupDone ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Assessment Completed
                              </span>
                            ) : (
                              <span className="text-amber-600 font-semibold text-xs flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                1st Checkup Pending
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {lastVisit ? (
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                  BP: {lastVisit.bloodPressure} &bull; FHR: {lastVisit.fetalHeartRate}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  Gest. Age: {lastVisit.gestationalWeeks} wks &bull; Hb: {lastVisit.hemoglobin}
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No vitals recorded</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {req.medicalStage.expectedDeliveryDate ? (
                              <div className="inline-flex flex-col">
                                <span className="font-bold text-pink-600 dark:text-pink-400 text-xs">
                                  {req.medicalStage.expectedDeliveryDate}
                                </span>
                                <span className="text-[10px] text-slate-400">Confirmed by Doctor</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">To be set on final checkup</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isNeedsExam && (
                                <button
                                  onClick={() => openExamModal(req)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1 transition"
                                >
                                  <Stethoscope className="w-3.5 h-3.5" />
                                  {visits.length === 0 ? "Perform Checkup" : "Follow-up / Finalize"}
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setActiveRequest(req);
                                  setIsViewDossierOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                title="View Patient Dossier"
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
      {/* MODAL: MEDICAL EXAMINATION & FOLLOW-UP RECORDING                          */}
      {/* ========================================================================= */}
      {isExamModalOpen && activeRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Medical Checkup &amp; Follow-up Examination
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Patient: {activeRequest.employee.name} (ID: {activeRequest.employee.id}) &bull; Case Ref:{" "}
                    {activeRequest.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCheckup} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
              {/* Patient Dossier Bar & Uploaded Reports Preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeRequest.employee.name}
                  </h3>
                  <p className="text-slate-500">
                    ID: {activeRequest.employee.id} &bull; {activeRequest.employee.designation} &bull;{" "}
                    {activeRequest.employee.department}
                  </p>
                  <p className="text-slate-500">
                    Spouse: {activeRequest.employee.spouseName} &bull; Phone: {activeRequest.employee.phone}
                  </p>
                </div>

                <div className="w-full md:w-auto">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      Welfare Submitted Documents ({activeRequest.welfareStage1.attachedDocuments.length}):
                    </p>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Click to open &amp; view</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 font-medium text-xs shadow-2xs transition group cursor-pointer"
                        title={`Click to open ${doc.name}`}
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition" />
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {doc.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({doc.size})</span>
                        <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Previous Checkup Visits History Timeline */}
              {activeRequest.medicalStage.checkupVisits.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Previous Checkup Visits Log (Visit History)
                  </label>
                  <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/50">
                    {activeRequest.medicalStage.checkupVisits.map((v) => (
                      <div
                        key={v.visitId}
                        className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px]">
                              Visit #{v.visitNumber}
                            </span>
                            <span>Date: {v.visitDate}</span>
                            <span className="text-slate-400 font-normal">by {v.doctorName}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">
                            <strong>Findings:</strong> {v.clinicalFindings}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            <strong>Rx:</strong> {v.prescribedVitamins}
                          </p>
                        </div>

                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            BP: {v.bloodPressure} &bull; FHR: {v.fetalHeartRate}
                          </p>
                          <p className="text-slate-400 text-[10px]">
                            Weight: {v.weightKg} kg &bull; Gest. Age: {v.gestationalWeeks} wks
                          </p>
                          {v.nextFollowupDate && (
                            <span className="mt-1 inline-block text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                              Follow-up Date: {v.nextFollowupDate}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Checkup Clinical Inputs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Input Today&apos;s Checkup Results (Visit #{(activeRequest.medicalStage.checkupVisits.length || 0) + 1})
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Checkup Date *</label>
                    <input
                      type="date"
                      value={checkupDate}
                      onChange={(e) => setCheckupDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Blood Pressure (BP) *</label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      placeholder="e.g. 118/76 mmHg"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Pulse Rate</label>
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      placeholder="e.g. 78 bpm"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Patient Weight (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Gestational Age (Weeks) *</label>
                    <input
                      type="number"
                      value={gestationalWeeks}
                      onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Fetal Heart Rate (FHR) *</label>
                    <input
                      type="text"
                      value={fetalHeartRate}
                      onChange={(e) => setFetalHeartRate(e.target.value)}
                      placeholder="e.g. 142 bpm"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Hemoglobin (Hb)</label>
                    <input
                      type="text"
                      value={hemoglobin}
                      onChange={(e) => setHemoglobin(e.target.value)}
                      placeholder="e.g. 11.5 g/dL"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Blood Sugar Level</label>
                    <input
                      type="text"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                      placeholder="e.g. 5.4 mmol/L"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Observations & Prescriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Clinical Examination Findings &amp; Observations *
                  </label>
                  <textarea
                    rows={2}
                    value={clinicalFindings}
                    onChange={(e) => setClinicalFindings(e.target.value)}
                    placeholder="Write a comments (if required)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs resize-y min-h-[50px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Prescribed Supplements &amp; Dietary Advice
                  </label>
                  <textarea
                    rows={2}
                    value={prescribedVitamins}
                    onChange={(e) => setPrescribedVitamins(e.target.value)}
                    placeholder="Write a comments (if required)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs resize-y min-h-[50px]"
                  />
                </div>
              </div>

              {/* CRITICAL WORKFLOW SELECTION: SCHEDULE FOLLOW-UP VS COMPLETE FINAL CHECKUP & CONFIRM EDD */}
              <div className="p-4 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFinalAssessment"
                      checked={isFinalCheckup}
                      onChange={(e) => setIsFinalCheckup(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isFinalAssessment" className="text-sm font-bold text-blue-950 dark:text-blue-200 cursor-pointer">
                      Mark as Final Medical Checkup &amp; Confirm Expected Delivery Date (EDD)
                    </label>
                  </div>
                  <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300">
                    {isFinalCheckup ? "Final Stage &rarr; Returns to Welfare" : "Patient to Return for Follow-up"}
                  </span>
                </div>

                {!isFinalCheckup ? (
                  /* Schedule Next Follow-up Date (Requirement) */
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
                      <CalendarPlus className="w-4 h-4" />
                      <span>Schedule Next Follow-up Date for Re-examination</span>
                    </div>
                    <p className="text-slate-500">
                      As per the process, the medical officer calls her for follow-up and gives her the next follow-up date.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1">
                          Next Follow-up Appointment Date *
                        </label>
                        <input
                          type="date"
                          value={nextFollowupDate}
                          onChange={(e) => setNextFollowupDate(e.target.value)}
                          required={!isFinalCheckup}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1">
                          Follow-up Examination Purpose
                        </label>
                        <input
                          type="text"
                          defaultValue="Review repeat USG anomaly scan & Hb levels before confirming EDD"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Final Checkup & EDD Entry (Requirement) */
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                      <Baby className="w-4 h-4" />
                      <span>Confirmed Expected Delivery Date (EDD) &amp; Medical Clearance</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-pink-600 dark:text-pink-400 mb-1">
                          Expected Delivery Date (EDD) *
                        </label>
                        <input
                          type="date"
                          value={eddDate}
                          onChange={(e) => setEddDate(e.target.value)}
                          required={isFinalCheckup}
                          className="w-full px-3 py-2 rounded-xl border border-pink-400 dark:border-pink-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Calculated via Naegele&apos;s rule / USG</p>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Clinical Fitness Status
                        </label>
                        <select
                          value={clinicalFitness}
                          onChange={(e: any) => setClinicalFitness(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                        >
                          <option value="Normal Health - Fit to Work">Normal Health - Fit to Work</option>
                          <option value="Fit for Light Duty">Fit for Light Duty (Restricted lifting/standing)</option>
                          <option value="High Risk - Immediate Rest Advised">High Risk - Immediate Rest Advised</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Doctor&apos;s Final Assessment &amp; Clearance Notes
                      </label>
                      <textarea
                        rows={2}
                        value={doctorFinalRemarks}
                        onChange={(e) => setDoctorFinalRemarks(e.target.value)}
                        placeholder="Write a comments (if required)"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs resize-y min-h-[50px]"
                      />
                    </div>
                  </div>
                )}
              </div>


              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`px-5 py-2.5 text-xs font-semibold rounded-xl text-white shadow-md flex items-center gap-2 transition ${
                    isFinalCheckup
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isFinalCheckup ? "Complete Final Checkup & Submit to Welfare" : "Save Visit & Schedule Follow-up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW PATIENT DOSSIER                                                */}
      {/* ========================================================================= */}
      {isViewDossierOpen && activeRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600">{activeRequest.id}</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Medical Record: {activeRequest.employee.name}
                </h2>
              </div>
              <button onClick={() => setIsViewDossierOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-blue-600">Clinical Visits History</h4>
                {activeRequest.medicalStage.checkupVisits.length > 0 ? (
                  activeRequest.medicalStage.checkupVisits.map((v) => (
                    <div key={v.visitId} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Visit #{v.visitNumber} ({v.visitDate}) - BP: {v.bloodPressure}, Weight: {v.weightKg} kg, Gest.
                        Age: {v.gestationalWeeks} wks
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{v.clinicalFindings}</p>
                      {v.nextFollowupDate && (
                        <p className="text-indigo-600 font-semibold mt-0.5">Next Follow-up: {v.nextFollowupDate}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No visits logged yet.</p>
                )}
              </div>

              {activeRequest.medicalStage.expectedDeliveryDate && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <p className="font-bold text-emerald-800 dark:text-emerald-200">
                    Confirmed Expected Delivery Date (EDD): {activeRequest.medicalStage.expectedDeliveryDate}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Fitness: {activeRequest.medicalStage.clinicalFitness} &bull; Remarks:{" "}
                    {activeRequest.medicalStage.doctorFinalRemarks}
                  </p>
                </div>
              )}

              {/* Welfare Submitted Documents in Dossier */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Welfare Submitted Documents ({activeRequest.welfareStage1.attachedDocuments.length})
                  </h4>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Click to open &amp; inspect</span>
                </div>
                <div className="flex flex-wrap gap-2">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 text-slate-800 dark:text-slate-200 font-medium text-xs transition cursor-pointer shadow-2xs group"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition" />
                      <span className="group-hover:text-blue-600 font-semibold">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({doc.size})</span>
                      <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsViewDossierOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DOCUMENT VIEWER / PREVIEW                                           */}
      {/* ========================================================================= */}
      {selectedDocToView && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
            {/* Document Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-indigo-950/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedDocToView.doc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold uppercase">
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
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Print Document"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDocToView(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Content */}
            <div className="p-5 overflow-y-auto flex-1 bg-slate-100/60 dark:bg-slate-950/60">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-xl mx-auto space-y-4">
                {/* Clinical Header / Letterhead */}
                <div className="border-b-2 border-slate-800 dark:border-slate-300 pb-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <HeartPulse className="w-6 h-6 text-rose-500" />
                    <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                      Central Maternity &amp; Women Health Clinic
                    </h2>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Department of Obstetrics, Gynaecology &amp; Fetal Medicine &bull; License #DHK-MED-92418
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Industrial Health Complex, Plot 14, Sector 7, Uttara, Dhaka-1230 &bull; Phone: +880 1711-000000
                  </p>
                </div>

                {/* Patient Particulars Bar */}
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

                {/* DYNAMIC DOCUMENT CONTENT */}
                {selectedDocToView.doc.type === "USG_Report" ||
                selectedDocToView.doc.name.toLowerCase().includes("usg") ||
                selectedDocToView.doc.name.toLowerCase().includes("scan") ? (
                  /* USG REPORT VIEW */
                  <div className="space-y-3 text-xs">
                    <div className="text-center py-1 bg-blue-50 dark:bg-blue-950/40 rounded border border-blue-200 dark:border-blue-800">
                      <h4 className="font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider text-[11px]">
                        Ultrasonography of Gravid Uterus (2nd Trimester Anomaly Scan)
                      </h4>
                    </div>

                    <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                      <p>
                        <strong>Clinical Indication:</strong> Routine antenatal screening, gestational age determination, fetal anatomy scan.
                      </p>
                      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-1.5 bg-slate-50/30">
                        <p className="font-bold text-slate-900 dark:text-white text-xs border-b pb-1">
                          Ultrasound Findings:
                        </p>
                        <p>&bull; <strong>Gestational Sac:</strong> Single intrauterine gestation noted with active fetal cardiac motion.</p>
                        <p>&bull; <strong>Fetal Heart Rate (FHR):</strong> 142 beats per minute, regular rhythm.</p>
                        <p>&bull; <strong>Fetal Presentation:</strong> Cephalic, spine situated to the maternal left.</p>
                        <p>&bull; <strong>Liquor / Amniotic Fluid:</strong> Adequate in quantity (AFI: 14.2 cm).</p>
                        <p>&bull; <strong>Placenta:</strong> Posterior, upper segment, Grade-II maturity. No signs of placenta praevia.</p>
                        <p>&bull; <strong>Biometry:</strong> BPD: 66 mm &bull; FL: 48 mm &bull; AC: 218 mm.</p>
                        <p>&bull; <strong>Estimated Gestational Age:</strong> 26 Weeks &plusmn; 1 Week.</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <p className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                          Impression / Conclusion:
                        </p>
                        <p className="text-emerald-800 dark:text-emerald-300 text-[11px]">
                          Single live intrauterine pregnancy of 26 weeks gestational age. Normal fetal growth parameters and no gross anatomical defects detected at this stage.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end text-[10px] text-slate-500">
                      <div>
                        <p>Instrument: GE Voluson E8 Expert 3D/4D</p>
                        <p>Hospital Barcode: #USG-2026-98124</p>
                      </div>
                      <div className="text-right">
                        <div className="font-serif italic font-bold text-slate-800 dark:text-slate-200 text-xs">
                          Dr. Nahid Sultana
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">MBBS, FCPS (Radiology &amp; Imaging)</p>
                        <p>Consultant Radiologist &bull; BMDC #A-31294</p>
                      </div>
                    </div>
                  </div>
                ) : selectedDocToView.doc.type === "Prescription" ||
                  selectedDocToView.doc.name.toLowerCase().includes("prescription") ||
                  selectedDocToView.doc.name.toLowerCase().includes("slip") ? (
                  /* PRESCRIPTION VIEW */
                  <div className="space-y-3 text-xs">
                    <div className="text-center py-1 bg-purple-50 dark:bg-purple-950/40 rounded border border-purple-200 dark:border-purple-800">
                      <h4 className="font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider text-[11px]">
                        Antenatal Consultation &amp; Medical Prescription Slip
                      </h4>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-700 dark:text-slate-300">
                      <div className="grid grid-cols-2 gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800 border">
                        <div>
                          <strong>Clinical Diagnosis:</strong> Gravida-2, 26 weeks gestation
                        </div>
                        <div>
                          <strong>Vitals:</strong> BP: 118/76 mmHg | Pulse: 78 bpm | Hb: 11.6 g/dL
                        </div>
                      </div>

                      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
                        <span className="font-serif text-lg font-bold text-slate-900 dark:text-white">Rx</span>
                        <div className="space-y-1.5 pl-3 border-l-2 border-purple-300">
                          <p>1. <strong>Tab. Calcium Carbonate 500mg</strong> &mdash; 1 + 0 + 1 (After meals daily)</p>
                          <p>2. <strong>Cap. Iron Polymaltose Complex</strong> &mdash; 0 + 1 + 0 (After lunch daily)</p>
                          <p>3. <strong>Tab. Folic Acid 5mg</strong> &mdash; 1 + 0 + 0 (Morning)</p>
                          <p>4. <strong>Nutritional Dietary Advice:</strong> High protein, boiled milk, green leafy vegetables.</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                        <p className="font-bold text-amber-900 dark:text-amber-200 text-xs">Workplace Advice:</p>
                        <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                          Advised light duties. Avoid heavy lifting (&gt; 5 kg), continuous standing exceeding 60 minutes, and extreme vibration zones in production line.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end text-[10px] text-slate-500">
                      <div>
                        <p>Follow-up Recommended: Every 2 weeks</p>
                        <p>Hospital Reg: #OPD-2026-4418</p>
                      </div>
                      <div className="text-right">
                        <div className="font-serif italic font-bold text-slate-800 dark:text-slate-200 text-xs">
                          Dr. Farzana Yasmin
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">MBBS, DGO (Obstetrics &amp; Gynae)</p>
                        <p>Medical Officer &bull; BMDC Reg #A-45920</p>
                      </div>
                    </div>
                  </div>
                ) : selectedDocToView.doc.type === "NID" ||
                  selectedDocToView.doc.name.toLowerCase().includes("nid") ? (
                  /* NID CARD VIEW */
                  <div className="space-y-3 text-xs">
                    <div className="text-center py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800">
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider text-[11px]">
                        National Identity Card Verification (Bangladesh Election Commission)
                      </h4>
                    </div>

                    <div className="border-2 border-emerald-500/40 rounded-xl p-4 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-slate-800 dark:to-teal-950/30 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                            BD
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">Government of the People&apos;s Republic of Bangladesh</p>
                            <p className="text-[10px] text-slate-500">National ID Card / জাতীয় পরিচয়পত্র</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border border-emerald-300">
                          VERIFIED
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-[11px]">
                        <div className="col-span-2 space-y-1">
                          <p><span className="text-slate-400">Name:</span> <strong className="text-slate-800 dark:text-slate-200">{selectedDocToView.employeeName}</strong></p>
                          <p><span className="text-slate-400">Father/Husband:</span> <span className="text-slate-700 dark:text-slate-300">Md. Rafiqul Islam</span></p>
                          <p><span className="text-slate-400">National ID No:</span> <strong className="font-mono text-emerald-700 dark:text-emerald-400 text-xs">{selectedDocToView.nid || "19942694123000548"}</strong></p>
                          <p><span className="text-slate-400">Date of Birth:</span> <span className="text-slate-700 dark:text-slate-300">14 Sep 1994</span></p>
                        </div>
                        <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-800">
                          <UserCheck className="w-10 h-10 text-slate-400" />
                          <span className="text-[9px] text-slate-400 mt-1">Photo Match</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* GENERAL DOCTOR CERTIFICATE / OTHER DOCUMENT VIEW */
                  <div className="space-y-3 text-xs">
                    <div className="text-center py-1 bg-pink-50 dark:bg-pink-950/40 rounded border border-pink-200 dark:border-pink-800">
                      <h4 className="font-bold text-pink-900 dark:text-pink-200 uppercase tracking-wider text-[11px]">
                        Official Pregnancy Medical Fitness Certificate
                      </h4>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 leading-relaxed text-[11px] text-slate-700 dark:text-slate-300">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        TO WHOM IT MAY CONCERN / WELFARE &amp; HR DEPARTMENT:
                      </p>
                      <p>
                        This is to certify that <strong>{selectedDocToView.employeeName}</strong>, holding Employee ID: <strong>{selectedDocToView.employeeId}</strong>, was clinically examined at our clinic.
                      </p>
                      <p>
                        Clinical tests and sonography confirm that she is currently pregnant with expected date of delivery (EDD) confirmed. She is physically cleared for light indoor duties until the onset of statutory maternity leave under the Bangladesh Labor Act 2006.
                      </p>
                      <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-200 font-semibold text-xs">
                        Recommendation: Approved for statutory 112 days maternity leave scheduling.
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end text-[10px] text-slate-500">
                      <div>
                        <p>Certified on: {selectedDocToView.doc.uploadDate}</p>
                        <p>Seal of Chief Medical Officer</p>
                      </div>
                      <div className="text-right">
                        <div className="font-serif italic font-bold text-slate-800 dark:text-slate-200 text-xs">
                          Dr. Farzana Yasmin
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">In-Charge Medical Officer</p>
                        <p>BMDC Reg #A-45920</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Document Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Dossier verified &bull; Ready for medical consultation
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`📥 Downloaded ${selectedDocToView.doc.name}`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDocToView(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
