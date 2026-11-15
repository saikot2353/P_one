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
  SlidersHorizontal,
  RotateCcw,
  User,
  Paperclip,
} from "lucide-react";
import {
  MaternityRequest,
  MaternityDocument,
  MedicalCheckupVisit,
  INITIAL_FEMALE_EMPLOYEES,
  getMaternityRequests,
  logMedicalVisitAndProcess,
  checkMaternityEligibility,
  getMaternityVerificationConfig,
} from "@/lib/maternityLeaveStore";

export const Route = createFileRoute("/maternity-medical-verification")({
  head: () => ({
    meta: [
      { title: "Maternity Medical Verification & Follow-up Clinic — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Medical officer maternity verification, in-person clinical checkup logs, scheduled follow-up visits, vitals tracking, and clinical clearance for Welfare leave scheduling.",
      },
    ],
  }),
  component: MaternityMedicalVerificationPage,
});

function MaternityMedicalVerificationPage() {
  const [requests, setRequests] = useState<MaternityRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Comprehensive Filter States
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
    { label: "Welfare Initiated (At Medical)", value: "WELFARE_INITIATED" },
    { label: "Medical Follow-up Scheduled", value: "MEDICAL_FOLLOWUP" },
    { label: "Medical Verified (Ready to Schedule)", value: "MEDICAL_VERIFIED" },
    { label: "Leave Scheduled (Forwarded to HR)", value: "WELFARE_LEAVE_SCHEDULED" },
    { label: "HR Approved", value: "HR_APPROVED" },
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

  const [maternityConfig, setMaternityConfig] = useState(() => getMaternityVerificationConfig());
  const targetFollowupCount = maternityConfig.minMedicalFollowupCount || 3;

  const loadData = () => {
    setRequests(getMaternityRequests());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    const handleConfigUpdate = (e: any) => {
      if (e.detail) setMaternityConfig(e.detail);
      else setMaternityConfig(getMaternityVerificationConfig());
    };
    window.addEventListener("maternity-data-updated", handleUpdate);
    window.addEventListener("maternity-config-updated", handleConfigUpdate);
    return () => {
      window.removeEventListener("maternity-data-updated", handleUpdate);
      window.removeEventListener("maternity-config-updated", handleConfigUpdate);
    };
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Exclude initial welfare registrations awaiting intake & documents
      if (r.currentStage === "WELFARE_REGISTERED") {
        return false;
      }

      // 1. Company filter
      if (filterCompany !== "ALL") {
        const empComp = r.employee.unit || "";
        if (!empComp.toLowerCase().includes(filterCompany.toLowerCase().split(" ")[0])) {
          return false;
        }
      }

      // 2. Area filter
      if (filterArea !== "ALL") {
        const addr = `${r.employee.presentAddress} ${r.employee.permanentAddress}`.toLowerCase();
        if (!addr.includes(filterArea.toLowerCase())) {
          return false;
        }
      }

      // 3. Department filter
      if (filterDepartment !== "ALL" && r.employee.department !== filterDepartment) {
        return false;
      }

      // 4. Section filter
      if (filterSection !== "ALL" && r.employee.section !== filterSection) {
        return false;
      }

      // 5. Date Range (Intake Date)
      const recordDate = r.welfareStage1.intakeDate;
      if (filterFromDate && recordDate < filterFromDate) {
        return false;
      }
      if (filterToDate && recordDate > filterToDate) {
        return false;
      }

      // 6. Status filter
      if (filterStatus !== "ALL") {
        const st = (r.statusLabel || "Working").toLowerCase();
        const fSt = filterStatus.toLowerCase();
        if (fSt === "approved" && r.currentStage !== "HR_APPROVED") return false;
        if (fSt === "on leave" && r.currentStage !== "HR_APPROVED") return false;
        if (fSt === "pending" && r.currentStage === "HR_APPROVED") return false;
        if (!st.includes(fSt) && fSt !== "active" && fSt !== "working") return false;
      }

      // 7. Stage filter
      if (filterStage !== "ALL" && r.currentStage !== filterStage) {
        return false;
      }

      // 8. Employee Type filter
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

      // 9. Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesEmp =
          r.employee.name.toLowerCase().includes(query) ||
          (r.employee.nameBn && r.employee.nameBn.toLowerCase().includes(query)) ||
          r.employee.id.includes(query) ||
          r.id.toLowerCase().includes(query) ||
          r.employee.department.toLowerCase().includes(query) ||
          r.employee.section.toLowerCase().includes(query);
        if (!matchesEmp) return false;
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

  // Open Examination Modal
  const openExamModal = (req: MaternityRequest) => {
    setActiveRequest(req);
    const visitCount = req.medicalStage.checkupVisits.length;
    const currentVisitNum = visitCount + 1;
    const isFinal = currentVisitNum >= targetFollowupCount;

    // Prefill form
    setDoctorName(req.medicalStage.assignedDoctor || "Dr. Farzana Yasmin, MBBS, DGO");
    setDoctorRegNo(req.medicalStage.doctorRegNo || "BMDC-A-45920");
    setCheckupDate("2026-10-28");

    // Suggest default gestational weeks based on trimester or visits
    const guessedWeeks = visitCount > 0 ? (req.medicalStage.checkupVisits[visitCount - 1].gestationalWeeks || 24) + 2 : 24;
    setGestationalWeeks(guessedWeeks);

    setIsFinalCheckup(isFinal);
    setNextFollowupDate("2026-11-15");
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

    const currentVisitNum = activeRequest.medicalStage.checkupVisits.length + 1;
    const isFinal = currentVisitNum >= targetFollowupCount;

    const finalFindings =
      clinicalFindings.trim() ||
      "Active fetal movement present. Fetal heart sounds regular and strong. No ankle edema. Fundal height matches gestational age.";
    const finalVitamins =
      prescribedVitamins.trim() ||
      "Tab. Calcium Carbonate 500mg (1+0+1), Cap. Iron Polymaltose Complex (0+1+0), Tab. Folic Acid 5mg.";
    const finalRemarks =
      doctorFinalRemarks.trim() ||
      "Patient clinically stable. Fetal wellbeing verified through clinical examination. Full medical follow-up protocol completed and forwarded to Welfare.";

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
        nextFollowupDate: isFinal ? null : nextFollowupDate,
        medicalReports: ["Clinical_Checkup_Slip.pdf"],
      },
      isFinal,
      undefined,
      clinicalFitness,
      finalRemarks
    );

    setIsExamModalOpen(false);

    if (isFinal) {
      showToast(
        `✅ Final medical follow-up (#${currentVisitNum}) completed for ${activeRequest.employee.name}! Case forwarded to Welfare for EDD & leave scheduling.`
      );
    } else {
      showToast(
        `✅ Follow-up #${currentVisitNum} logged for ${activeRequest.employee.name}. Next follow-up appointment scheduled for ${nextFollowupDate}.`
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
                Medical officer clinical examinations, vital signs logging, scheduled follow-up visits, and clinical clearance for Welfare leave scheduling.
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

          {/* Enhanced Filter Section matching image */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Filter Maternity Records
                    {activeFilterCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 transition"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
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
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition"
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

          {/* Medical Patients Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-3 text-center w-12">SL</th>
                    <th className="py-3.5 px-4">Case Ref</th>
                    <th className="py-3.5 px-4">Employee Information</th>
                    <th className="py-3.5 px-4">Welfare Intake Info</th>
                    <th className="py-3.5 px-4">Checkup Visits Done</th>
                    <th className="py-3.5 px-4">Follow-up Schedule</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Stethoscope className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        No patients found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req, idx) => {
                      const visits = req.medicalStage.checkupVisits || [];
                      const lastVisit = visits[visits.length - 1];
                      const isNeedsExam =
                        req.currentStage === "WELFARE_INITIATED" || req.currentStage === "MEDICAL_FOLLOWUP";

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                        >
                          {/* SL Column */}
                          <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-500 dark:text-slate-400">
                            {idx + 1}
                          </td>

                          {/* Case Ref */}
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                            <div>{req.id}</div>
                            <span className="text-[10px] text-slate-400">Intake: {req.welfareStage1.intakeDate}</span>
                          </td>

                          {/* Employee Information (only Name, ID, Department) */}
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

                          {/* Welfare Intake Info */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border border-pink-200">
                              {req.welfareStage1.tentativeTrimester}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {req.welfareStage1.attachedDocuments.length} Documents uploaded
                            </p>
                          </td>

                          {/* Checkup Visits Done */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                              <Activity className="w-3.5 h-3.5" />
                              {visits.length} Visit{visits.length === 1 ? "" : "s"} Logged
                            </span>
                          </td>

                          {/* Follow-up Schedule */}
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

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isNeedsExam && (
                                <button
                                  onClick={() => openExamModal(req)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1 transition"
                                >
                                  <Stethoscope className="w-3.5 h-3.5" />
                                  {visits.length === 0
                                    ? "Perform Checkup"
                                    : visits.length + 1 >= targetFollowupCount
                                    ? "Final Follow-up"
                                    : `Follow-up #${visits.length + 1}`}
                                </button>
                              )}

                              {req.currentStage === "MEDICAL_VERIFIED" && !req.welfareStage2.expectedLeaveStartDate && (
                                <Link
                                  to="/maternity-welfare-verification"
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center gap-1 transition"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  Schedule at Welfare
                                </Link>
                              )}

                              {/* View icon only shown when Assessment is Completed */}
                              {Boolean(
                                req.medicalStage.isFinalCheckupDone ||
                                req.currentStage === "MEDICAL_VERIFIED" ||
                                req.currentStage === "WELFARE_LEAVE_SCHEDULED" ||
                                req.currentStage === "HR_APPROVED"
                              ) && (
                                <button
                                  onClick={() => {
                                    setActiveRequest(req);
                                    setIsViewDossierOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                  title="View Clinical Dossier"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl lg:max-w-6xl shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
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

            <form onSubmit={handleSaveCheckup} className="p-6 space-y-6 flex-1 overflow-y-auto text-xs">
              {/* 1. EMPLOYEE DETAILS (Image 1) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
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
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
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

              {/* 3. WELFARE INTAKE & COUNSELING */}
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

              {/* 4. Previous Checkup Visits Log (Visit History - Image 2) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    RECORDED CLINICAL CONSULTATIONS &amp; VISITS ({activeRequest.medicalStage.checkupVisits.length})
                  </h4>
                  {(() => {
                    const latestVisitWithFollowup = [...activeRequest.medicalStage.checkupVisits]
                      .reverse()
                      .find((v) => v.nextFollowupDate);
                    return latestVisitWithFollowup?.nextFollowupDate ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Next Follow-up:{" "}
                        <strong className="text-slate-900 dark:text-white font-bold">
                          {latestVisitWithFollowup.nextFollowupDate}
                        </strong>
                      </span>
                    ) : null;
                  })()}
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
                        {[...activeRequest.medicalStage.checkupVisits]
                          .sort((a, b) => a.visitNumber - b.visitNumber)
                          .map((v) => (
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
                  <div className="py-6 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                    No clinical checkup visits logged yet.
                  </div>
                )}
              </div>

              {/* 5. Input Today's Checkup Results */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 bg-white dark:bg-slate-900 shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Stethoscope className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    Input Today&apos;s Checkup Results (Visit #{(activeRequest.medicalStage.checkupVisits.length || 0) + 1})
                  </h4>
                </div>

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

                {/* Observations & Prescriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
              </div>

              {/* 6. Medical Follow-up & Welfare Forwarding (Automated based on Follow-up Count) */}
              {(() => {
                const currentVisitNumber = (activeRequest.medicalStage.checkupVisits.length || 0) + 1;
                const isCurrentFinal = currentVisitNumber >= targetFollowupCount;

                return (
                  <>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 bg-white dark:bg-slate-900 shadow-2xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isCurrentFinal
                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                            }`}
                          >
                            {isCurrentFinal ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <CalendarPlus className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                            {isCurrentFinal
                              ? "Final Medical Follow-up"
                              : "Medical Follow-up Schedule"}
                          </span>
                        </div>
                        {isCurrentFinal ? (
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/50 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Final Follow-up &rarr; Forward to Welfare
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/50">
                            Follow-up {currentVisitNumber}/{targetFollowupCount}
                          </span>
                        )}
                      </div>

                      {!isCurrentFinal ? (
                        /* Schedule Next Follow-up Date (Shown for visits < targetFollowupCount) */
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                              <CalendarPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span>Schedule Next Follow-up Date for Re-examination</span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Required Follow-ups: <strong>{targetFollowupCount}</strong>
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                                Next Follow-up Appointment Date *
                              </label>
                              <input
                                type="date"
                                value={nextFollowupDate}
                                onChange={(e) => setNextFollowupDate(e.target.value)}
                                required={!isCurrentFinal}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                                Follow-up Examination Purpose
                              </label>
                              <input
                                type="text"
                                defaultValue="Review maternal vitals and fetal wellbeing in follow-up examination"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                              />
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            ℹ️ Follow-up count is set to {targetFollowupCount}. At the {targetFollowupCount === 3 ? "3rd" : `#${targetFollowupCount}`} follow-up, this section will automatically be removed and the case will be forwarded to Welfare.
                          </p>
                        </div>
                      ) : (
                        /* Final Clinical Follow-up & Medical Clearance - Forward to Welfare */
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
                          <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Clinical Fitness Status
                            </label>
                            <select
                              value={clinicalFitness}
                              onChange={(e: any) => setClinicalFitness(e.target.value)}
                              className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                            >
                              <option value="Normal Health - Fit to Work">Normal Health - Fit to Work</option>
                              <option value="Fit for Light Duty">Fit for Light Duty (Restricted lifting/standing)</option>
                              <option value="High Risk - Immediate Rest Advised">High Risk - Immediate Rest Advised</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                              Doctor&apos;s Final Assessment &amp; Clearance Notes
                            </label>
                            <textarea
                              rows={2}
                              value={doctorFinalRemarks}
                              onChange={(e) => setDoctorFinalRemarks(e.target.value)}
                              placeholder="Write clinical clearance comments (if required)..."
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
                          isCurrentFinal
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25"
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        {isCurrentFinal
                          ? "Complete Final Follow-up & Forward to Welfare"
                          : `Save Follow-up #${currentVisitNumber} & Schedule Next Date`}
                      </button>
                    </div>
                  </>
                );
              })()}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW PATIENT DOSSIER                                                */}
      {/* ========================================================================= */}
      {isViewDossierOpen && activeRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl lg:max-w-6xl shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 dark:from-blue-950/30 dark:via-slate-900 dark:to-indigo-950/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center font-bold shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Medical Checkup Record &amp; Clinical Dossier
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                      Assessment Completed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Patient: {activeRequest.employee.name} (ID: {activeRequest.employee.id}) &bull; Case Ref:{" "}
                    {activeRequest.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title="Print Clinical Summary"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setIsViewDossierOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* 1. EMPLOYEE DETAILS (Image 1) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
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
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
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

              {/* 3. WELFARE INTAKE & COUNSELING */}
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

              {/* 4. MEDICAL VERIFICATION & CLINICAL FINDINGS */}
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
                    <span className="text-[10px] text-slate-500 block">
                      BMDC #{activeRequest.medicalStage.doctorRegNo || "A-45920"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Clinical Fitness</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {activeRequest.medicalStage.clinicalFitness || "Normal Health - Fit to Work"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Medical Clearance</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {activeRequest.medicalStage.medicalVerifiedAt || "2026-10-28"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Assessment Status</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
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
                          {[...activeRequest.medicalStage.checkupVisits]
                            .sort((a, b) => a.visitNumber - b.visitNumber)
                            .map((v) => (
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

              {/* 5. SUBSEQUENT STAGES / WELFARE RECOMMENDATION (if already scheduled) */}
              {activeRequest.welfareStage2?.expectedLeaveStartDate ? (
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
                        {activeRequest.welfareStage2.expectedLeaveStartDate}
                      </span>
                      <span className="text-[10px] text-slate-400">56d pre-delivery</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                        LEAVE END DATE
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block mt-1 text-sm font-mono">
                        {activeRequest.welfareStage2.expectedLeaveEndDate}
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

                  {activeRequest.welfareStage2.leaveAddress && (
                    <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                        Address During Leave
                      </span>
                      <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {activeRequest.welfareStage2.leaveAddress}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Medical clearance complete. Patient file has been forwarded to Welfare for statutory 112-day leave scheduling.
                    </span>
                  </div>
                  <Link
                    to="/maternity-welfare-verification"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition whitespace-nowrap shadow-xs"
                  >
                    Open at Welfare
                  </Link>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Clinical Verification &amp; Follow-up Complete
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsViewDossierOpen(false)}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer shadow-xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
