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
  User,
  ChevronDown,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  FemaleEmployee,
  MaternityRequest,
  MaternityDocument,
  INITIAL_FEMALE_EMPLOYEES,
  getMaternityRequests,
  saveMaternityRequests,
  createWelfareMaternityRequest,
  registerWelfareMaternityEmployee,
  submitWelfareIntakeAndDocs,
  submitWelfareLeaveScheduleToHr,
  checkMaternityEligibility,
  calculateRejoiningDate,
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

// Helper to abbreviate service duration into concise single-line label
function formatServiceShort(str: string): string {
  if (!str) return "";
  return str
    .replace(/years?/gi, "Yrs")
    .replace(/months?/gi, "Mos")
    .replace(/days?/gi, "Days")
    .replace(/,/g, "")
    .trim();
}

function MaternityWelfareVerificationPage() {
  const [requests, setRequests] = useState<MaternityRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "INTAKE" | "MEDICAL" | "SCHEDULE" | "HR" | "APPROVED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  // Filter States
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
    { label: "Welfare Registered (Pending Docs)", value: "WELFARE_REGISTERED" },
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
    setActiveTab("ALL");
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
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [registrationNotes, setRegistrationNotes] = useState("");
  const [isIntakeDocsModalOpen, setIsIntakeDocsModalOpen] = useState(false);
  const [selectedRegisteredReq, setSelectedRegisteredReq] = useState<MaternityRequest | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewDossierOpen, setIsViewDossierOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<MaternityRequest | null>(null);
  const [selectedDocToView, setSelectedDocToView] = useState<{
    doc: MaternityDocument;
    employeeName: string;
    employeeId: string;
    nid?: string;
  } | null>(null);

  // New Intake Form States (Employee not pre-selected by default)
  const [selectedEmpId, setSelectedEmpId] = useState<string>("");
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [empSearchQuery, setEmpSearchQuery] = useState("");
  const empDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (empDropdownRef.current && !empDropdownRef.current.contains(event.target as Node)) {
        setIsEmpDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFemaleEmployees = useMemo(() => {
    if (!empSearchQuery.trim()) return INITIAL_FEMALE_EMPLOYEES;
    const q = empSearchQuery.toLowerCase();
    return INITIAL_FEMALE_EMPLOYEES.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        (emp.nameBn && emp.nameBn.toLowerCase().includes(q)) ||
        emp.id.toLowerCase().includes(q)
    );
  }, [empSearchQuery]);
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


  // View Modal Leave Scheduling Form States (Stage 2)
  const [viewModalEdd, setViewModalEdd] = useState("");
  const [viewModalStartDate, setViewModalStartDate] = useState("");
  const [viewModalEndDate, setViewModalEndDate] = useState("");
  const [viewModalRejoiningDate, setViewModalRejoiningDate] = useState("");
  const [viewModalLeaveAddress, setViewModalLeaveAddress] = useState("");
  const [viewModalRemarks, setViewModalRemarks] = useState("");
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  // Helper to calculate 112-day statutory maternity leave and re-joining date from EDD
  const calculateLeavePeriodFromEdd = (eddDateStr: string) => {
    if (!eddDateStr) return { start: "", end: "", rejoiningDate: "", totalDays: 112 };
    try {
      const parts = eddDateStr.split("-").map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) return { start: "", end: "", rejoiningDate: "", totalDays: 112 };
      const edd = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      if (isNaN(edd.getTime())) return { start: "", end: "", rejoiningDate: "", totalDays: 112 };

      // 56 days (8 weeks) prior to EDD
      const start = new Date(edd);
      start.setDate(edd.getDate() - 56);

      // 55 days post EDD (total 112 calendar days)
      const end = new Date(edd);
      end.setDate(edd.getDate() + 55);

      // Re-joining Date: day immediately after leave end date
      const rejoining = new Date(end);
      rejoining.setDate(end.getDate() + 1);

      const fmt = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dayStr = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${dayStr}`;
      };

      return {
        start: fmt(start),
        end: fmt(end),
        rejoiningDate: fmt(rejoining),
        totalDays: 112,
      };
    } catch {
      return { start: "", end: "", rejoiningDate: "", totalDays: 112 };
    }
  };

  const handleViewModalEddChange = (newEdd: string) => {
    setViewModalEdd(newEdd);
    if (newEdd) {
      const calc = calculateLeavePeriodFromEdd(newEdd);
      setViewModalStartDate(calc.start);
      setViewModalEndDate(calc.end);
      setViewModalRejoiningDate(calc.rejoiningDate);
    } else {
      setViewModalStartDate("");
      setViewModalEndDate("");
      setViewModalRejoiningDate("");
    }
  };

  const openViewDossier = (req: MaternityRequest) => {
    setActiveRequest(req);
    setIsEditingSchedule(false);
    const edd = req.medicalStage.expectedDeliveryDate || "";
    setViewModalEdd(edd);
    if (req.welfareStage2.expectedLeaveStartDate && req.welfareStage2.expectedLeaveEndDate) {
      setViewModalStartDate(req.welfareStage2.expectedLeaveStartDate);
      setViewModalEndDate(req.welfareStage2.expectedLeaveEndDate);
      setViewModalRejoiningDate(
        req.welfareStage2.rejoiningDate || calculateRejoiningDate(req.welfareStage2.expectedLeaveEndDate)
      );
    } else if (edd) {
      const calc = calculateLeavePeriodFromEdd(edd);
      setViewModalStartDate(calc.start);
      setViewModalEndDate(calc.end);
      setViewModalRejoiningDate(calc.rejoiningDate);
    } else {
      setViewModalStartDate("");
      setViewModalEndDate("");
      setViewModalRejoiningDate("");
    }
    setViewModalLeaveAddress(req.welfareStage2.leaveAddress || req.employee.presentAddress || "");
    setViewModalRemarks(
      req.welfareStage2.welfareOfficerRemarks ||
        "Employee completed full statutory continuous service. Verified by attending medical officer with confirmed expected delivery date. Recommended for 16 weeks (112 days) statutory maternity leave."
    );
    setIsViewDossierOpen(true);
  };

  const handleSaveViewModalSchedule = () => {
    if (!activeRequest) return;
    if (!viewModalEdd) {
      showToast("⚠️ Please enter the Expected Delivery Date (EDD).");
      return;
    }

    const calculatedRejoining =
      viewModalRejoiningDate || calculateRejoiningDate(viewModalEndDate);

    const updated = submitWelfareLeaveScheduleToHr(activeRequest.id, {
      startDate: viewModalStartDate,
      endDate: viewModalEndDate,
      rejoiningDate: calculatedRejoining,
      totalDays: 112,
      leaveAddress: viewModalLeaveAddress,
      emergencyContact:
        activeRequest.welfareStage2.emergencyContactPerson || activeRequest.employee.spouseName || "Spouse",
      emergencyPhone: activeRequest.welfareStage2.emergencyPhone || activeRequest.employee.phone,
      welfareRemarks: viewModalRemarks,
    });

    if (updated) {
      updated.medicalStage.expectedDeliveryDate = viewModalEdd;
      const current = getMaternityRequests();
      const idx = current.findIndex((r) => r.id === updated.id);
      if (idx !== -1) {
        current[idx] = updated;
        saveMaternityRequests(current);
      }
      setActiveRequest(updated);
      setRequests(getMaternityRequests());
      showToast(
        `✅ Leave schedule saved for ${activeRequest.employee.name} (${viewModalStartDate} to ${viewModalEndDate}) and forwarded to HR!`
      );
    }
  };

  // Leave Scheduling Form States (Stage 2)
  const [scheduleStartDate, setScheduleStartDate] = useState("");
  const [scheduleEndDate, setScheduleEndDate] = useState("");
  const [scheduleRejoiningDate, setScheduleRejoiningDate] = useState("");
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

      // 1. Company filter
      if (filterCompany !== "ALL") {
        const comp = (r.employee.unit || "").toLowerCase();
        const fComp = filterCompany.toLowerCase();
        if (!comp.includes(fComp) && !fComp.includes("pakiza")) return false;
      }

      // 2. Area filter
      if (filterArea !== "ALL") {
        const addr = (
          (r.employee.presentAddress || "") +
          " " +
          (r.employee.permanentAddress || "") +
          " " +
          (r.employee.unit || "")
        ).toLowerCase();
        if (!addr.includes(filterArea.toLowerCase())) return false;
      }

      // 3. Department filter
      if (filterDepartment !== "ALL" && r.employee.department !== filterDepartment) {
        return false;
      }

      // 4. Section filter
      if (filterSection !== "ALL" && r.employee.section !== filterSection) {
        return false;
      }

      // 5. Date range filter
      const intakeDate = r.welfareStage1.intakeDate || r.createdAt.substring(0, 10);
      if (filterFromDate && intakeDate < filterFromDate) {
        return false;
      }
      if (filterToDate && intakeDate > filterToDate) {
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

      // 7. Stage filter (means in which stage the request is now)
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

  // Handle open Schedule Leave modal for returned medical record
  const openScheduleModal = (req: MaternityRequest) => {
    openViewDossier(req);
  };

  // Submit Leave Schedule to HR
  const handleSaveLeaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest) return;

    submitWelfareLeaveScheduleToHr(activeRequest.id, {
      startDate: scheduleStartDate,
      endDate: scheduleEndDate,
      rejoiningDate: scheduleRejoiningDate || calculateRejoiningDate(scheduleEndDate),
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

  // 1. Initial Registration Handler (First time visit: Employee Info + Eligibility + Notes only)
  const handleRegisterEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedEmp) {
      showToast("❌ Please select a female employee to proceed.");
      return;
    }

    const created = registerWelfareMaternityEmployee({
      employee: currentSelectedEmp,
      notes: registrationNotes,
    });

    setIsRegistrationModalOpen(false);
    setSelectedEmpId("");
    setRegistrationNotes("");
    showToast(`✅ Employee ${created.employee.name} registered for maternity welfare! Record added to Welfare Verification table.`);
  };

  // 2. Open Complete Intake & Documents Modal for a registered employee
  const openIntakeDocsModal = (req: MaternityRequest) => {
    setSelectedRegisteredReq(req);
    setInformedDate(req.welfareStage1.informedPregnancyDate || new Date().toISOString().substring(0, 10));
    setTentativeTrimester(req.welfareStage1.tentativeTrimester || "1st Trimester (1-12 wks)");
    setCounselingNotes(req.welfareStage1.counselingNotes || "");
    if (req.welfareStage1.attachedDocuments && req.welfareStage1.attachedDocuments.length > 0) {
      setDocumentRows(
        req.welfareStage1.attachedDocuments.map((d) => ({
          id: d.id,
          title: d.name,
          fileName: d.name,
          fileSize: d.size,
        }))
      );
    } else {
      setDocumentRows([
        { id: "doc-1", title: "Pregnancy Medical Certificate", fileName: "", fileSize: "" },
      ]);
    }
    setIsIntakeDocsModalOpen(true);
  };

  // 3. Submit Intake & Documents -> Advances to Medical Verification
  const handleSubmitIntakeAndDocs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegisteredReq) return;

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
      "Employee visited with medical reports and documentation. Intake and consultation completed. Forwarded to Medical Clinic for verification.";

    const updated = submitWelfareIntakeAndDocs(selectedRegisteredReq.id, {
      welfareOfficerName,
      welfareOfficerId,
      informedPregnancyDate: informedDate,
      tentativeTrimester,
      counselingNotes: finalNotes,
      documents: finalDocs,
    });

    setIsIntakeDocsModalOpen(false);
    setSelectedRegisteredReq(null);
    setCounselingNotes("");
    setDocumentRows([
      { id: "doc-1", title: "Pregnancy Medical Certificate", fileName: "", fileSize: "" },
    ]);
    if (updated) {
      showToast(`✅ Intake & documents submitted for ${updated.employee.name}. Request forwarded to Medical Verification!`);
    }
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
              <button
                onClick={() => {
                  setSelectedEmpId("");
                  setRegistrationNotes("");
                  setIsRegistrationModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md shadow-pink-600/20 hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Register
              </button>
            </div>
          </div>

          {/* Enhanced Filter Section */}
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
                  className="self-start sm:self-auto text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              )}
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 text-xs">
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
                  {companyOptions.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp === "ALL" ? "All Companies" : comp}
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
                  {areaOptions.map((area) => (
                    <option key={area} value={area}>
                      {area === "ALL" ? "All Areas" : area}
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
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "ALL" ? "All Departments" : dept}
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

              {/* 8. Stage (means in which stage the request is now) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stage
                </label>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
                >
                  {stageOptions.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
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

          {/* Requests Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-3 text-center w-12">SL</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Case Ref / Date</th>
                    <th className="py-3.5 px-4">Employee Information</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Joining Date</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Service Period</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Previous Leaves</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Current Stage</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Medical EDD</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Scheduled Leave</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Re-joining Date</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400 dark:text-slate-500">
                        <HeartPulse className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        No maternity records found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req, idx) => {
                      const isReadyToSchedule = req.currentStage === "MEDICAL_VERIFIED";
                      const isApproved = req.currentStage === "HR_APPROVED";

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                        >
                          {/* SL Column */}
                          <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-500 dark:text-slate-400">
                            {idx + 1}
                          </td>

                          {/* Case Ref / Date */}
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                            <div>{req.id}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{req.welfareStage1.intakeDate}</div>
                          </td>

                          {/* Employee Information (only One Name, ID, Department) */}
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

                          {/* Joining Date (left side of Service Period) */}
                          <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {req.employee.joiningDate.includes("-")
                              ? req.employee.joiningDate.split("-").reverse().join("/")
                              : req.employee.joiningDate}
                          </td>

                          {/* Service Period */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {req.welfareStage1.isEligible ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                                  {formatServiceShort(
                                    req.welfareStage1.serviceDurationText ||
                                      checkMaternityEligibility(req.employee.joiningDate).durationFormatted
                                  )}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 whitespace-nowrap">
                                  <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                                  {formatServiceShort(
                                    req.welfareStage1.serviceDurationText ||
                                      checkMaternityEligibility(req.employee.joiningDate).durationFormatted
                                  )}{" "}
                                  (&lt;6m)
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Previous Leaves */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {req.employee.previousMaternityLeaves.length > 0 ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 whitespace-nowrap">
                                  {req.employee.previousMaternityLeaves.length} Prev Leave{req.employee.previousMaternityLeaves.length > 1 ? "s" : ""}
                                </span>
                                <p className="text-[10px] text-slate-400 whitespace-nowrap">
                                  Last: {req.employee.previousMaternityLeaves[0].deliveryDate}
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] whitespace-nowrap">1st Maternity (None)</span>
                            )}
                          </td>

                          {/* Current Stage */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {req.currentStage === "WELFARE_REGISTERED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border border-pink-200 dark:border-pink-800 whitespace-nowrap">
                                <Clock className="w-3 h-3 flex-shrink-0" />
                                Registered (Pending Docs)
                              </span>
                            )}
                            {req.currentStage === "WELFARE_INITIATED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                                <Clock className="w-3 h-3 flex-shrink-0" />
                                At Medical
                              </span>
                            )}
                            {req.currentStage === "MEDICAL_FOLLOWUP" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
                                <Stethoscope className="w-3 h-3 flex-shrink-0" />
                                Med Follow-up
                              </span>
                            )}
                            {req.currentStage === "MEDICAL_VERIFIED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300 dark:border-amber-700 animate-pulse whitespace-nowrap">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                Ready to Schedule
                              </span>
                            )}
                            {req.currentStage === "WELFARE_LEAVE_SCHEDULED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 whitespace-nowrap">
                                <Send className="w-3 h-3 flex-shrink-0" />
                                Forwarded to HR
                              </span>
                            )}
                            {req.currentStage === "HR_APPROVED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                                HR Approved
                              </span>
                            )}
                          </td>

                          {/* Medical EDD */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
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

                          {/* Scheduled Leave */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {req.welfareStage2.expectedLeaveStartDate ? (
                              <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  {req.welfareStage2.expectedLeaveStartDate} to {req.welfareStage2.expectedLeaveEndDate}
                                </p>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                  {req.welfareStage2.totalLeaveDays} Days (16 Wks)
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Not scheduled yet</span>
                            )}
                          </td>

                          {/* Re-joining Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {req.welfareStage2.expectedLeaveStartDate ? (
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white font-mono text-xs block">
                                  {req.welfareStage2.rejoiningDate || calculateRejoiningDate(req.welfareStage2.expectedLeaveEndDate) || "---"}
                                </span>
                                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                                  Duty Resumption
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">---</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                              {req.currentStage === "WELFARE_REGISTERED" && (
                                <button
                                  onClick={() => openIntakeDocsModal(req)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-xs flex items-center gap-1.5 transition whitespace-nowrap flex-shrink-0 cursor-pointer"
                                  title="Complete Welfare Intake & Documents"
                                >
                                  <FileUp className="w-3.5 h-3.5" />
                                  Intake &amp; Docs
                                </button>
                              )}

                              {isReadyToSchedule && (
                                <button
                                  onClick={() => openScheduleModal(req)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center gap-1 transition whitespace-nowrap flex-shrink-0 cursor-pointer"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  Schedule
                                </button>
                              )}

                              <button
                                onClick={() => openViewDossier(req)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex-shrink-0"
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
      {/* MODAL 1: FEMALE EMPLOYEE REGISTRATION (STAGE 1 INITIAL VISIT)             */}
      {/* ========================================================================= */}
      {isRegistrationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-pink-50/80 via-white to-rose-50/80 dark:from-pink-950/30 dark:via-slate-900 dark:to-rose-950/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 flex items-center justify-center shadow-xs">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Female Employee Maternity Registration
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Welfare Stage 1: Initial visit registration &amp; continuous service tenure eligibility check (&ge; 6 months)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegistrationModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleRegisterEmployee} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* SECTION: EMPLOYEE SELECTION & ELIGIBILITY */}
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

                {/* Searchable Female Employee Dropdown */}
                <div className="relative" ref={empDropdownRef}>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Female Employee *
                  </label>
                  <div
                    onClick={() => setIsEmpDropdownOpen((prev) => !prev)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-pink-500 shadow-2xs transition"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {isEmpDropdownOpen ? (
                        <input
                          type="text"
                          autoFocus
                          value={empSearchQuery}
                          onChange={(e) => setEmpSearchQuery(e.target.value)}
                          placeholder="Search female employee by name or ID..."
                          className="w-full bg-transparent border-none outline-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 p-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : currentSelectedEmp ? (
                        <span className="truncate text-slate-900 dark:text-white font-medium">
                          {currentSelectedEmp.name} <span className="font-mono text-slate-500 dark:text-slate-400">({currentSelectedEmp.id})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Select female employee (searchable)...</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {currentSelectedEmp && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmpId("");
                            setEmpSearchQuery("");
                          }}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 transition"
                          title="Clear selection"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${isEmpDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Dropdown Options List */}
                  {isEmpDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in-50 zoom-in-95">
                      {filteredFemaleEmployees.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No female employee found matching "{empSearchQuery}"
                        </div>
                      ) : (
                        filteredFemaleEmployees.map((emp) => {
                          const isSelected = emp.id === selectedEmpId;
                          return (
                            <button
                              key={emp.id}
                              type="button"
                              onClick={() => {
                                setSelectedEmpId(emp.id);
                                setIsEmpDropdownOpen(false);
                                setEmpSearchQuery("");
                              }}
                              className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between hover:bg-pink-50/80 dark:hover:bg-pink-950/40 transition cursor-pointer ${
                                isSelected
                                  ? "bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 font-semibold"
                                  : "text-slate-800 dark:text-slate-200"
                              }`}
                            >
                              <span className="font-medium text-slate-900 dark:text-slate-100">{emp.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                                  ({emp.id})
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-pink-600" />}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
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
                    {/* EMPLOYEE DETAILS CARD */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="w-5 h-5 rounded-full border border-blue-500/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <User className="w-3 h-3" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                          EMPLOYEE DETAILS
                        </h4>
                      </div>

                      <div className="flex flex-row gap-5 items-start">
                        <div className="flex-shrink-0">
                          <img
                            src={
                              currentSelectedEmp.avatar ||
                              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                            }
                            alt={currentSelectedEmp.name}
                            className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs bg-slate-100 dark:bg-slate-800"
                          />
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                          <div className="space-y-2">
                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Employee Name:
                              </span>
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {currentSelectedEmp.name}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Designation:
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {currentSelectedEmp.designation}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Section:
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {currentSelectedEmp.section}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Location:
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {currentSelectedEmp.unit ? `${currentSelectedEmp.unit} - Operation` : "PSL -Operation"}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Contact:
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {currentSelectedEmp.phone}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Service Period:
                              </span>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {currentEligibility.durationFormatted}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Address:
                              </span>
                              <span className="font-medium text-slate-700 dark:text-slate-300 flex-1 leading-snug">
                                {currentSelectedEmp.presentAddress ||
                                  currentSelectedEmp.permanentAddress ||
                                  "Megh Roddur By 1st Choice Real Estate Ltd., 148 West Rayer Bazar West Dhanmondi, Bangladesh"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Employee ID:
                              </span>
                              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                                {currentSelectedEmp.id}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Department:
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {currentSelectedEmp.department}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Date of Joining:
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {currentSelectedEmp.joiningDate.includes("-")
                                  ? currentSelectedEmp.joiningDate.split("-").reverse().join("/")
                                  : currentSelectedEmp.joiningDate}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Business Unit:
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {currentSelectedEmp.unit || "PSL"}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Eligibility:
                              </span>
                              <span
                                className={`font-bold uppercase ${
                                  currentEligibility.isEligible
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {currentEligibility.isEligible ? "YES" : "NO"}
                              </span>
                            </div>

                            <div className="flex items-baseline">
                              <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                                Documents:
                              </span>
                              <span className="font-medium text-slate-600 dark:text-slate-400">
                                Required upon next visit
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

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

              {/* SECTION: NOTES INPUT FIELD ONLY */}
              <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 flex items-center justify-center text-[11px] font-bold">
                    2
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Registration Notes &amp; Observations
                  </h3>
                </div>
                <textarea
                  rows={3}
                  value={registrationNotes}
                  onChange={(e) => setRegistrationNotes(e.target.value)}
                  placeholder="Record initial visit observations, employee notification notes, and instructions to bring medical reports and documentation upon subsequent visit..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs resize-y"
                />
              </div>

              {/* Modal Footer / Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {!currentSelectedEmp ? (
                    <span className="text-slate-400">Please select an employee</span>
                  ) : (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to register employee in Welfare list
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsRegistrationModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!currentSelectedEmp}
                    className={`px-5 py-2 text-xs font-semibold rounded-xl text-white shadow-md flex items-center gap-2 transition ${
                      currentSelectedEmp
                        ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-600/25 cursor-pointer"
                        : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60 text-slate-500"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Register Employee
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1B: WELFARE INTAKE & DOCUMENTS (STAGE 1 SUBSEQUENT VISIT)           */}
      {/* ========================================================================= */}
      {isIntakeDocsModalOpen && selectedRegisteredReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-pink-50/80 via-white to-rose-50/80 dark:from-pink-950/30 dark:via-slate-900 dark:to-rose-950/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 flex items-center justify-center shadow-xs">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Welfare Intake &amp; Documents Submission
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Welfare Stage 1 (Step 2): Record medical reports and consultation details for {selectedRegisteredReq.employee.name} ({selectedRegisteredReq.employee.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsIntakeDocsModalOpen(false);
                  setSelectedRegisteredReq(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleSubmitIntakeAndDocs} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* EMPLOYEE DETAILS CARD */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="w-5 h-5 rounded-full border border-blue-500/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    EMPLOYEE DETAILS
                  </h4>
                </div>

                <div className="flex flex-row gap-5 items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        selectedRegisteredReq.employee.avatar ||
                        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={selectedRegisteredReq.employee.name}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs bg-slate-100 dark:bg-slate-800"
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Employee Name:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedRegisteredReq.employee.name}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Designation:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedRegisteredReq.employee.designation}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Section:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedRegisteredReq.employee.section}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Location:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedRegisteredReq.employee.unit ? `${selectedRegisteredReq.employee.unit} - Operation` : "PSL -Operation"}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Contact:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedRegisteredReq.employee.phone}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Service Period:
                        </span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {selectedRegisteredReq.welfareStage1.serviceDurationText ||
                            checkMaternityEligibility(selectedRegisteredReq.employee.joiningDate).durationFormatted}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Address:
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex-1 leading-snug">
                          {selectedRegisteredReq.employee.presentAddress ||
                            selectedRegisteredReq.employee.permanentAddress ||
                            "Megh Roddur By 1st Choice Real Estate Ltd., 148 West Rayer Bazar West Dhanmondi, Bangladesh"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Employee ID:
                        </span>
                        <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                          {selectedRegisteredReq.employee.id}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Department:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedRegisteredReq.employee.department}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Date of Joining:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedRegisteredReq.employee.joiningDate.includes("-")
                            ? selectedRegisteredReq.employee.joiningDate.split("-").reverse().join("/")
                            : selectedRegisteredReq.employee.joiningDate}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Business Unit:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedRegisteredReq.employee.unit || "PSL"}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Eligibility:
                        </span>
                        <span
                          className={`font-bold uppercase ${
                            (selectedRegisteredReq.welfareStage1.isEligible ??
                              checkMaternityEligibility(selectedRegisteredReq.employee.joiningDate).isEligible)
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {(selectedRegisteredReq.welfareStage1.isEligible ??
                            checkMaternityEligibility(selectedRegisteredReq.employee.joiningDate).isEligible)
                            ? "YES"
                            : "NO"}
                        </span>
                      </div>

                      <div className="flex items-baseline">
                        <span className="w-28 sm:w-32 text-slate-400 dark:text-slate-500 font-normal flex-shrink-0">
                          Registration Date:
                        </span>
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          {selectedRegisteredReq.welfareStage1.informedDate || "Recorded"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Initial Registration Notes if any */}
                {selectedRegisteredReq.welfareStage1.counselingNotes && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-2 text-xs">
                    <span className="font-semibold text-pink-600 dark:text-pink-400 flex-shrink-0">
                      Initial Registration Note:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 italic">
                      &quot;{selectedRegisteredReq.welfareStage1.counselingNotes}&quot;
                    </span>
                  </div>
                )}
              </div>

              {/* Previous Maternity Leave History */}
              {selectedRegisteredReq.employee.previousMaternityLeaves &&
              selectedRegisteredReq.employee.previousMaternityLeaves.length > 0 ? (
                <div className="border border-amber-200 dark:border-amber-900/60 rounded-xl overflow-hidden bg-amber-50/20 dark:bg-amber-950/10">
                  <div className="px-3 py-1.5 bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between">
                    <span>
                      Previous Maternity History ({selectedRegisteredReq.employee.previousMaternityLeaves.length} Recorded)
                    </span>
                    {selectedRegisteredReq.employee.previousMaternityLeaves.length >= 2 && (
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
                      {selectedRegisteredReq.employee.previousMaternityLeaves.map((hist, idx) => (
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

              {/* SECTION: WELFARE INTAKE & CONSULTATION DETAILS */}
              <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 flex items-center justify-center text-[11px] font-bold">
                    1
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Welfare Intake &amp; Consultation Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Medical Verification Date *
                    </label>
                    <input
                      type="date"
                      value={informedDate}
                      onChange={(e) => setInformedDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Date the employee goes for Medical Verification</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tentative Pregnancy Trimester *
                    </label>
                    <select
                      value={tentativeTrimester}
                      onChange={(e: any) => setTentativeTrimester(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500 cursor-pointer"
                    >
                      <option value="1st Trimester (1-12 wks)">1st Trimester (1-12 wks)</option>
                      <option value="2nd Trimester (13-26 wks)">2nd Trimester (13-26 wks)</option>
                      <option value="3rd Trimester (27+ wks)">3rd Trimester (27+ wks)</option>
                    </select>
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
                    placeholder="Write counseling observations, health precautions advised, or doctor recommendations..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs resize-y min-h-[50px]"
                  />
                </div>
              </div>

              {/* SECTION: DOCUMENTS SECTION */}
              <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 flex items-center justify-center text-[11px] font-bold">
                      2
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Documents Section
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
                            className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
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
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
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
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-pink-300 dark:border-pink-800/80 text-pink-600 dark:text-pink-400 hover:bg-pink-50/60 dark:hover:bg-pink-950/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                </div>
              </div>

              {/* Modal Footer / Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready to submit to Medical Verification
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsIntakeDocsModalOpen(false);
                      setSelectedRegisteredReq(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded-xl text-white shadow-md flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-600/25 cursor-pointer transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit to Medical Verification
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                    onChange={(e) => {
                      const val = e.target.value;
                      setScheduleEndDate(val);
                      if (val) {
                        setScheduleRejoiningDate(calculateRejoiningDate(val));
                      }
                    }}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Suggested: 8 weeks after EDD</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Re-joining Date</span>
                    <span className="text-[10px] text-slate-400 font-normal">View only</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={scheduleRejoiningDate}
                    placeholder="Auto-calculated from end date"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-bold font-mono cursor-not-allowed select-none"
                  />
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-1">Day after leave completion</p>
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {activeRequest.id}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Maternity Case Dossier &bull; {activeRequest.employee.name}
                </h2>
              </div>
              <button
                onClick={() => setIsViewDossierOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* 1. EMPLOYEE DETAILS SECTION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <User className="w-3 h-3" />
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
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
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
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                    <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between">
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
                            <td className="py-2.5 px-3.5 font-semibold text-slate-700 dark:text-slate-300">
                              {hist.totalDays}d
                            </td>
                            <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
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
                      <HeartPulse className="w-3 h-3" />
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

                  {activeRequest.welfareStage1.attachedDocuments.length === 0 ? (
                    <div className="p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                      No documents uploaded yet. Employee registered for initial visit &mdash; medical reports and documentation will be recorded upon subsequent intake visit.
                    </div>
                  ) : (
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
                )}
                </div>
              </div>

              {/* 4. MEDICAL VERIFICATION & CLINICAL FINDINGS */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Stethoscope className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    MEDICAL VERIFICATION &amp; CLINICAL FINDINGS
                  </h4>
                </div>

                {/* Medical Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs">
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
                      {activeRequest.medicalStage.clinicalFitness || "Fit for Light Duty"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Verification Status</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {activeRequest.medicalStage.isFinalCheckupDone ? "Clinically Verified" : "In Progress"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 block">Verification Date</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block">
                      {activeRequest.medicalStage.medicalVerifiedAt || "2026-09-15"}
                    </span>
                  </div>
                </div>

                {/* Clinical Consultations Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Recorded Clinical Consultations &amp; Visits ({activeRequest.medicalStage.checkupVisits.length})
                    </span>
                    {activeRequest.medicalStage.checkupVisits.length > 0 && activeRequest.medicalStage.checkupVisits[0].nextFollowupDate && (
                      <span className="text-[10px] text-slate-500">
                        Next Follow-up: <strong className="text-slate-700 dark:text-slate-300">{activeRequest.medicalStage.checkupVisits[0].nextFollowupDate}</strong>
                      </span>
                    )}
                  </div>

                  {activeRequest.medicalStage.checkupVisits.length > 0 ? (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold">Visit</th>
                            <th className="py-2.5 px-3 font-semibold">Date</th>
                            <th className="py-2.5 px-3 font-semibold">Vitals</th>
                            <th className="py-2.5 px-3 font-semibold">Gestation</th>
                            <th className="py-2.5 px-3 font-semibold">Clinical Findings &amp; Advice</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Doctor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {activeRequest.medicalStage.checkupVisits.map((v) => (
                            <tr key={v.visitId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                              <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                                Visit #{v.visitNumber}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                                {v.visitDate}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                                BP: {v.bloodPressure} &bull; HR: {v.fetalHeartRate}
                              </td>
                              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                                {v.gestationalWeeks ? `${v.gestationalWeeks} wks` : "26 wks"}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                                <p>{v.clinicalFindings}</p>
                                {v.prescribedVitamins && (
                                  <p className="text-[10px] text-slate-400 mt-0.5">Rx: {v.prescribedVitamins}</p>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-right whitespace-nowrap">
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
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Doctor's Final Assessment:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {activeRequest.medicalStage.doctorFinalRemarks}
                    </p>
                  </div>
                )}
              </div>

              {/* 5. LEAVE SCHEDULE & WELFARE RECOMMENDATION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Section Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                    LEAVE SCHEDULE &amp; WELFARE RECOMMENDATION
                  </h4>
                </div>

                {(() => {
                  const isScheduleAlreadyGiven = Boolean(
                    activeRequest.welfareStage2?.expectedLeaveStartDate &&
                    activeRequest.welfareStage2?.expectedLeaveEndDate
                  );

                  // CASE 1: Schedule is already given -> Show overview strip (image part) without input fields
                  if (isScheduleAlreadyGiven && !isEditingSchedule) {
                    return (
                      <div className="space-y-4">
                        {/* 5-column overview card */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                              EXPECTED DELIVERY DATE
                            </span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 block mt-1 text-sm font-mono">
                              {activeRequest.medicalStage?.expectedDeliveryDate || viewModalEdd || "---"}
                            </span>
                            <span className="text-[10px] text-slate-400">Medical EDD</span>
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
                              RE-JOINING DATE
                            </span>
                            <span className="font-bold text-purple-700 dark:text-purple-300 block mt-1 text-sm font-mono">
                              {activeRequest.welfareStage2.rejoiningDate ||
                                calculateRejoiningDate(activeRequest.welfareStage2.expectedLeaveEndDate) ||
                                "---"}
                            </span>
                            <span className="text-[10px] text-slate-400">Post-leave resumption</span>
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
                              {activeRequest.welfareStage2.welfareOfficerRemarks || "Recommended for 16 weeks (112 days) statutory maternity leave."}
                            </p>
                          </div>
                        </div>

                        {/* Status Strip & Edit Schedule Button */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              Schedule Confirmed &bull; Status:{" "}
                              <strong>
                                {activeRequest.currentStage === "HR_APPROVED" ? "Approved by HR" : "Forwarded to HR"}
                              </strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEditingSchedule(true)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
                          >
                            Edit Schedule
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // CASE 2: When case returned from Medical Verification stage OR user clicked Edit -> Show input fields WITHOUT the image part
                  const isReturnedFromMedicalOrReady =
                    activeRequest.medicalStage.expectedDeliveryDate ||
                    activeRequest.medicalStage.isFinalCheckupDone ||
                    activeRequest.currentStage === "MEDICAL_VERIFIED" ||
                    activeRequest.currentStage === "WELFARE_LEAVE_SCHEDULED" ||
                    activeRequest.currentStage === "HR_APPROVED" ||
                    isEditingSchedule;

                  if (isReturnedFromMedicalOrReady) {
                    return (
                      <div className="space-y-4">
                        {/* Notice info */}
                        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/50 flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800 dark:text-blue-300">
                            Enter the <strong>Expected Delivery Date (EDD)</strong>. The system will automatically calculate the 112 calendar days (8 weeks pre-delivery and 8 weeks post-delivery) in compliance with Bangladesh Labor Act Sec. 46 &amp; 47.
                          </p>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                              Expected Delivery Date (EDD) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={viewModalEdd}
                              onChange={(e) => handleViewModalEddChange(e.target.value)}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-slate-400 focus:outline-none transition shadow-2xs font-mono"
                            />
                            {viewModalStartDate && viewModalEndDate && (
                              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1.5">
                                ✓ Auto Leave: <strong>{viewModalStartDate}</strong> to <strong>{viewModalEndDate}</strong> (112 Days / 16 Wks)
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                              <span>Re-joining Date</span>
                              <span className="text-[10px] text-slate-400 font-normal">View only</span>
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={viewModalRejoiningDate}
                              placeholder="Auto-calculated from leave end date"
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/60 text-slate-900 dark:text-white font-bold cursor-not-allowed select-none transition shadow-2xs font-mono"
                            />
                            {viewModalRejoiningDate ? (
                              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1.5">
                                Duty resumption: <strong>{viewModalRejoiningDate}</strong>
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-400 mt-1.5">
                                Auto-calculated when EDD is selected
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                              Address During Leave <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              value={viewModalLeaveAddress}
                              onChange={(e) => setViewModalLeaveAddress(e.target.value)}
                              placeholder="Leave address if different from present residence"
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* Welfare Remarks */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Welfare Officer Recommendation &amp; Remarks
                          </label>
                          <textarea
                            rows={2}
                            value={viewModalRemarks}
                            onChange={(e) => setViewModalRemarks(e.target.value)}
                            placeholder="Welfare department remarks for HR approval..."
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition shadow-2xs leading-relaxed"
                          />
                        </div>

                        {/* Calculated Schedule Info */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                          {viewModalStartDate && viewModalEndDate ? (
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-slate-600 dark:text-slate-400">
                                Calculated Leave Period: <strong className="text-slate-800 dark:text-slate-200">{viewModalStartDate}</strong> to <strong className="text-slate-800 dark:text-slate-200">{viewModalEndDate}</strong> (112 Statutory Days)
                              </span>
                              {viewModalRejoiningDate && (
                                <span className="text-purple-700 dark:text-purple-400 font-semibold">
                                  Official Re-joining Date: <strong className="font-mono">{viewModalRejoiningDate}</strong>
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">Please select an Expected Delivery Date to calculate statutory leave period and re-joining date.</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // CASE 3: Case has not returned from Medical Verification yet
                  return (
                    <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
                      <Clock className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Awaiting Medical Follow-Up Completion
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Once the Medical Officer finishes clinical verification and confirms the Expected Delivery Date, the leave scheduling form will activate here.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer: Action Buttons */}
            {(() => {
              const isScheduleAlreadyGiven = Boolean(
                activeRequest.welfareStage2?.expectedLeaveStartDate &&
                activeRequest.welfareStage2?.expectedLeaveEndDate
              );
              const isReturnedFromMedicalOrReady =
                Boolean(activeRequest.medicalStage.expectedDeliveryDate) ||
                activeRequest.medicalStage.isFinalCheckupDone ||
                activeRequest.currentStage === "MEDICAL_VERIFIED" ||
                activeRequest.currentStage === "WELFARE_LEAVE_SCHEDULED" ||
                activeRequest.currentStage === "HR_APPROVED" ||
                isEditingSchedule;
              const showSubmitButton = isReturnedFromMedicalOrReady && (!isScheduleAlreadyGiven || isEditingSchedule);

              return (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingSchedule(false);
                      setIsViewDossierOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    {isEditingSchedule ? "Cancel" : "Close"}
                  </button>

                  {showSubmitButton && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveViewModalSchedule();
                        if (viewModalEdd && viewModalStartDate && viewModalEndDate) {
                          setIsEditingSchedule(false);
                        }
                      }}
                      disabled={!viewModalEdd || !viewModalStartDate || !viewModalEndDate}
                      className={`px-5 py-2 text-xs font-semibold rounded-xl text-white shadow-md flex items-center gap-2 transition ${
                        viewModalEdd && viewModalStartDate && viewModalEndDate
                          ? "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white cursor-pointer"
                          : "bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {activeRequest.currentStage === "MEDICAL_VERIFIED"
                        ? "Submit Leave Schedule to HR"
                        : "Save & Update Schedule"}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DOCUMENT PREVIEW MODAL                                            */}
      {/* ========================================================================= */}
      {selectedDocToView && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
            {/* Document Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
                    {selectedDocToView.doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Patient: {selectedDocToView.employeeName} ({selectedDocToView.employeeId}) &bull; {selectedDocToView.doc.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Print Document"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDocToView(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/60 dark:bg-slate-950/60">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-xl mx-auto space-y-4">
                {/* Clinical Letterhead */}
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
                          <p><span className="text-slate-400">NID No:</span> <strong className="font-mono text-emerald-700 dark:text-emerald-300">{selectedDocToView.nid || "19922692019000341"}</strong></p>
                          <p><span className="text-slate-400">Date of Birth:</span> <span className="text-slate-700 dark:text-slate-300">15 Apr 1992</span></p>
                          <p><span className="text-slate-400">Address:</span> <span className="text-slate-700 dark:text-slate-300">House 24, Road 4, Sector 10, Uttara, Dhaka</span></p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 border border-slate-200 rounded-lg bg-white/70 dark:bg-slate-900/70 text-center">
                          <div className="w-14 h-16 bg-slate-200 dark:bg-slate-700 rounded mb-1 flex items-center justify-center text-slate-400">
                            <User className="w-7 h-7" />
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">EC-SMART-NID</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* GENERAL DOCTOR'S CERTIFICATE / DECLARATION VIEW */
                  <div className="space-y-3 text-xs">
                    <div className="text-center py-1 bg-pink-50 dark:bg-pink-950/40 rounded border border-pink-200 dark:border-pink-800">
                      <h4 className="font-bold text-pink-900 dark:text-pink-200 uppercase tracking-wider text-[11px]">
                        Pregnancy Medical Certificate &amp; Fitness Declaration
                      </h4>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 space-y-3 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                      <p>
                        This is to certify that <strong>{selectedDocToView.employeeName}</strong> (ID: {selectedDocToView.employeeId})
                        was clinically examined at our clinic on {selectedDocToView.doc.uploadDate}.
                      </p>
                      <p>
                        Upon thorough obstetric examination, she has been confirmed pregnant with an estimated gestational age of <strong>26 weeks</strong>.
                        Her pregnancy is progressing normally with normal vitals and fetal heart activity.
                      </p>
                      <div className="p-2.5 rounded bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200 text-pink-900 dark:text-pink-200">
                        <strong>Expected Delivery Date (EDD):</strong> 28 December 2026.
                      </div>
                      <p>
                        This certificate is issued to fulfill statutory maternity notification requirements under
                        Section 46 of the Bangladesh Labor Act 2006.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end text-[10px] text-slate-500">
                      <div>
                        <p>Hospital Seal: &check; VERIFIED</p>
                        <p>Certificate Ref: #PMC-2026-8812</p>
                      </div>
                      <div className="text-right">
                        <div className="font-serif italic font-bold text-slate-800 dark:text-slate-200 text-xs">
                          Dr. Farzana Yasmin
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">MBBS, DGO</p>
                        <p>Medical Officer &bull; BMDC #A-45920</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Authenticated Medical Record
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDocToView(null)}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 transition cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
