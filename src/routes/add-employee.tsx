import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  User,
  MapPin,
  Briefcase,
  DollarSign,
  Plus,
  Check,
  Mail,
  Phone,
  Calendar,
  Heart,
  FileText,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Info,
  Gift,
  Camera,
  Upload,
  GraduationCap,
  History,
  Award,
  BookOpen,
  Users,
  PhoneCall,
  FileSignature,
  Baby,
  ShieldCheck,
  Laptop,
  HelpCircle,
  FileDown,
  ShieldAlert,
  Eye,
  Trash2,
  Edit3,
  Trash,
  ChevronDown,
  CreditCard,
} from "lucide-react";

export const Route = createFileRoute("/add-employee")({
  head: () => ({
    meta: [
      { title: "Add Employee — CRIPTON HRIS" },
      { name: "description", content: "Create a new employee profile in the digital directory." },
    ],
  }),
  component: AddEmployeePage,
});

// Master navigation tabs consolidated from 17 directories into 5 highly cohesive tabs
const TABS = [
  { id: "personal_identity", label: "Personal & Identity", icon: User },
  { id: "financial_employment", label: "Financial & Employment", icon: DollarSign },
  { id: "career_qualifications", label: "Qualifications & Experience", icon: GraduationCap },
  { id: "family_dependents", label: "Family & Dependents", icon: Baby },
  { id: "verification_documents", label: "Verification & Docs", icon: ShieldCheck },
];

function AddEmployeePage() {
  const [activeTab, setActiveTab] = useState("personal_identity");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subSection, setSubSection] = useState("primary_placement");

  // Custom addition modal states
  const [addingField, setAddingField] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");

  // Address Options
  const [upazilas, setUpazilas] = useState(["Mirpur", "Uttara", "Dhanmondi", "Gulshan"]);
  const [postOffices, setPostOffices] = useState([
    "Mirpur-12",
    "Uttara Sector 6",
    "Dhanmondi-15",
    "Gulshan-2",
  ]);

  // Form State
  const [form, setForm] = useState({
    // Basic Info
    id: "2025" + Math.floor(100000 + Math.random() * 900000), // pre-filled system ID
    offcId: "",
    nameEng: "",
    nameBng: "",
    fatherNameEng: "Mohammad Abdur Rahman",
    fatherNameBng: "মোহাম্মদ আবদুর রহমান",
    motherNameEng: "Sultana Begum",
    motherNameBng: "সুলতানা বেগম",
    spouseNameEng: "",
    spouseNameBng: "",
    spouseNid: "",
    spouseContactNo: "",
    membershipNo: "",
    drivingLicense: "",
    maritalStatus: "Single",
    dob: "",
    religion: "Islam",
    nid: "",
    gender: "Male",
    birthRegNo: "",
    blood: "B (+ve)",
    passportNo: "",
    education: "Bachelor of Science (B.Sc)",
    joinDate: new Date().toISOString().split("T")[0],

    // Present Address
    presDivision: "Dhaka",
    presDistrict: "Dhaka",
    presUpazila: "Mirpur",
    presPostOffice: "Mirpur-12",
    presVillageEng: "Vill # Dhopapara",
    presVillageBng: "গ্রাম # ধোপাপাড়া",
    presRoad: "Road # 12",
    presOthers: "",
    presCountry: "Bangladesh",

    // Permanent Address
    sameAsPresent: false,
    permDivision: "Dhaka",
    permDistrict: "Dhaka",
    permUpazila: "Mirpur",
    permPostOffice: "Mirpur-12",
    permVillageEng: "Vill # Dhopapara",
    permVillageBng: "গ্রাম # ধোপাপাড়া",
    permRoad: "Road # 12",
    permOthers: "",
    permCountry: "Bangladesh",

    // Contact info
    offcEmail: "",
    offcMobile: "",
    offcPhoneEx: "",
    personalEmail: "",
    personalContact: "",

    // Corporate Mapping Info (Grouped inside Basic tab)
    dept: "Implementation & Business Analysis",
    workingArea: "PSL-Operation",
    sect: "ALL",
    empType: "Office Executive",
    title: "",
    jobNature: "ALL",
    unit: "ALL",
    line: "ALL",
    grade: "ALL",
    shift: "General Shift",
    empStatus: "Probation",
    probationPeriod: "N/A",
    confirmDate: "",
    holiday: "N/A",
    setManager: "Tahmid Afsar",
    recruitmentType: "New",
    rcNotes: "",

    // 2. Allowance Info
    gross: "",
    specialAllowance: "",
    mobileAllowance: "",
    internetAllowance: "",
    utilityAllowance: "",

    // 3. Salary & Bank Details
    bankName: "Dutch-Bangla Bank Limited",
    bankAccount: "",
    bankBranch: "Mirpur Circle-10",
    routingNumber: "090261987",
    pfDeduction: "10",
    taxDeduction: "0",
    gratuity: "0",
    paymentMode: "Bank Transfer",

    // 4. Picture Upload files (Mock base64 or file name)
    picture: "",
    signature: "",
    nidScan: "",
    certificateScan: "",

    // 10. Emergency Contact Details
    emergencyName: "",
    emergencyRelation: "Father",
    emergencyContact: "",
    emergencyAltContact: "",
    emergencyEmail: "",
    emergencyAddress: "",

    // 11. Nominee Form
    nomineeName: "Fatema Begum",
    nomineeRelation: "Mother",
    nomineeNid: "",
    nomineeContact: "",
    nomineeShare: "100",
    nomineeAddress: "",

    // 12. Reference
    ref1Name: "",
    ref1Designation: "",
    ref1Org: "",
    ref1Contact: "",
    ref1Email: "",
    ref2Name: "",
    ref2Designation: "",
    ref2Org: "",
    ref2Contact: "",
    ref2Email: "",

    // 14. Job Description
    jobDescription:
      "Senior Software Engineer responsible for building high-scale payroll and HR modules using modern web technologies.",
    keyDeliverables:
      "Fullstack web app development, Git source code management, DB schema optimization.",
    reportingLine: "Tahmid Afsar Shapno (Head Of Department)",

    // 16. Employee Verification
    verificationStatus: "Verified",
    verifiedBy: "HR Compliance Team",
    verificationDate: new Date().toISOString().split("T")[0],
    verificationNotes:
      "All background verification checks cleared successfully, including academic credential validation and police clearance.",

    // 17. Employee Equipment
    laptopBrand: 'Apple MacBook Pro 16"',
    laptopAssetId: "COMP-2026-089",
    mobileBrand: "iPhone 15",
    mobileAssetId: "MOB-2026-112",
    accessCardId: "AC-559021",
    equipmentIssuedDate: new Date().toISOString().split("T")[0],
  });

  // Dynamic lists for multi-value tabs
  const [educationList, setEducationList] = useState<any[]>([
    {
      degree: "Bachelor of Science (B.Sc)",
      institute: "IIT University of Dhaka",
      passingYear: "2022",
      resultGpa: "3.85",
      attachment: "",
    },
  ]);
  const [experienceList, setExperienceList] = useState<any[]>([
    {
      company: "Pakiza Software Limited",
      designation: "Software Engineer",
      fromDate: "2023-01-01",
      toDate: "2025-02-28",
      leavingReason: "Career Growth",
      attachment: "",
    },
  ]);
  const [certifications, setCertifications] = useState<any[]>([
    {
      certificateName: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      issueDate: "2024-06-15",
      expiryDate: "2027-06-15",
      credentialId: "AWS-102938",
    },
  ]);
  const [trainingList, setTrainingList] = useState<any[]>([
    {
      trainingTitle: "Advanced System Architecture",
      institution: "Coursera / Pakiza Software",
      duration: "12 Weeks",
      completionDate: "2024-03-10",
      remarks: "Excellent performance",
    },
  ]);
  const [involvements, setInvolvements] = useState<any[]>([
    {
      activityName: "HRIS Standardization Committee",
      role: "Technical Lead",
      duration: "6 Months",
      description: "Led database migration and performance optimizations",
    },
  ]);
  const [dependents, setDependents] = useState<any[]>([
    { depName: "Anisur Rahman", depRelation: "Father", depDob: "1965-08-12", depNid: "1928374650" },
  ]);
  const [otherDocs, setOtherDocs] = useState<any[]>([
    {
      docTitle: "Police Clearance Certificate",
      docType: "PDF",
      docFile: "police_clearance_shapno.pdf",
    },
  ]);

  // Upload progress indicators for pictures
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Spreadsheet-style helper functions for inline editing
  const handleEduChange = (index: number, field: string, value: string) => {
    setEducationList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const addEduRow = () => {
    setEducationList((prev) => [
      ...prev,
      {
        degree: "Bachelor of Science (B.Sc)",
        institute: "",
        passingYear: "",
        resultGpa: "",
        attachment: "",
      },
    ]);
  };

  const handleExpChange = (index: number, field: string, value: string) => {
    setExperienceList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const addExpRow = () => {
    setExperienceList((prev) => [
      ...prev,
      { company: "", designation: "", fromDate: "", toDate: "", leavingReason: "", attachment: "" },
    ]);
  };

  const triggerRowMockUpload = (listType: "education" | "experience", index: number) => {
    const mockFileName = `uploaded_${listType}_scan_${index + 1}.pdf`;
    if (listType === "education") {
      setEducationList((prev) =>
        prev.map((item, i) => (i === index ? { ...item, attachment: mockFileName } : item)),
      );
    } else {
      setExperienceList((prev) =>
        prev.map((item, i) => (i === index ? { ...item, attachment: mockFileName } : item)),
      );
    }
  };

  const handleCertChange = (index: number, field: string, value: string) => {
    setCertifications((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const addCertRow = () => {
    setCertifications((prev) => [
      ...prev,
      { certificateName: "", organization: "", issueDate: "", expiryDate: "", credentialId: "" },
    ]);
  };

  const handleTrainChange = (index: number, field: string, value: string) => {
    setTrainingList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const addTrainRow = () => {
    setTrainingList((prev) => [
      ...prev,
      { trainingTitle: "", institution: "", duration: "", completionDate: "", remarks: "" },
    ]);
  };

  const handleInvolChange = (index: number, field: string, value: string) => {
    setInvolvements((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const addInvolRow = () => {
    setInvolvements((prev) => [
      ...prev,
      { activityName: "", role: "", duration: "", description: "" },
    ]);
  };

  const handleDepChange = (index: number, field: string, value: string) => {
    setDependents((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const addDepRow = () => {
    setDependents((prev) => [
      ...prev,
      { depName: "", depRelation: "Child", depDob: "", depNid: "" },
    ]);
  };

  const handleDocChange = (index: number, field: string, value: string) => {
    setOtherDocs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const addDocRow = () => {
    setOtherDocs((prev) => [
      ...prev,
      {
        docTitle: "",
        docType: "PDF",
        docFile: `attached_document_${Date.now().toString().slice(-4)}.pdf`,
      },
    ]);
  };

  // Synchronize permanent address if checkbox checked
  useEffect(() => {
    if (form.sameAsPresent) {
      setForm((prev) => ({
        ...prev,
        permDivision: prev.presDivision,
        permDistrict: prev.presDistrict,
        permUpazila: prev.presUpazila,
        permPostOffice: prev.presPostOffice,
        permVillageEng: prev.presVillageEng,
        permVillageBng: prev.presVillageBng,
        permRoad: prev.presRoad,
        permOthers: prev.presOthers,
        permCountry: prev.presCountry,
      }));
    }
  }, [
    form.sameAsPresent,
    form.presDivision,
    form.presDistrict,
    form.presUpazila,
    form.presPostOffice,
    form.presVillageEng,
    form.presVillageBng,
    form.presRoad,
    form.presOthers,
    form.presCountry,
  ]);

  // Handle Input Changes
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Dynamic Salary & Allowance Calculations
  const grossNum = parseFloat(form.gross) || 0;
  const basicVal = grossNum > 0 ? (grossNum * 0.6).toFixed(2) : "0.00";
  const houseRentVal = grossNum > 0 ? (grossNum * 0.25).toFixed(2) : "0.00";
  const medicalVal = grossNum > 0 ? (grossNum * 0.08).toFixed(2) : "0.00";
  const conveyanceVal = grossNum > 0 ? (grossNum * 0.04).toFixed(2) : "0.00";
  const foodVal = grossNum > 0 ? (grossNum * 0.03).toFixed(2) : "0.00";
  const pfVal = grossNum > 0 ? (parseFloat(basicVal) * 0.1).toFixed(2) : "0.00";
  const festivalBonusVal = basicVal;

  const totalAllowanceVal = (
    parseFloat(houseRentVal) +
    parseFloat(medicalVal) +
    parseFloat(conveyanceVal) +
    parseFloat(foodVal) +
    (parseFloat(form.specialAllowance) || 0) +
    (parseFloat(form.mobileAllowance) || 0) +
    (parseFloat(form.internetAllowance) || 0) +
    (parseFloat(form.utilityAllowance) || 0)
  ).toFixed(2);

  // Validate required fields
  const validateFields = () => {
    const required: string[] = [
      "id",
      "nameEng",
      "dob",
      "religion",
      "gender",
      "joinDate",
      "dept",
      "empType",
      "title",
      "shift",
      "gross",
    ];
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    required.forEach((field) => {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    if (validateFields()) {
      setShowSuccessModal(true);
    } else {
      // Find which section has errors and jump to it
      if (
        !form.nameEng ||
        !form.dob ||
        !form.religion ||
        !form.gender ||
        !form.joinDate ||
        !form.dept ||
        !form.empType ||
        !form.title ||
        !form.shift
      ) {
        setActiveTab("personal_identity");
      } else if (!form.gross) {
        setActiveTab("financial_employment");
      }
    }
  };

  const handleAddCustomOption = () => {
    if (!customValue.trim() || !addingField) return;
    if (addingField.includes("Upazila")) {
      setUpazilas((prev) => [...prev, customValue.trim()]);
      if (addingField.startsWith("pres")) {
        handleChange("presUpazila", customValue.trim());
      } else {
        handleChange("permUpazila", customValue.trim());
      }
    } else if (addingField.includes("PostOffice")) {
      setPostOffices((prev) => [...prev, customValue.trim()]);
      if (addingField.startsWith("pres")) {
        handleChange("presPostOffice", customValue.trim());
      } else {
        handleChange("permPostOffice", customValue.trim());
      }
    }
    setAddingField(null);
    setCustomValue("");
  };

  // Mock File Upload Handlers
  const triggerMockUpload = (field: string) => {
    setUploadProgress((prev) => ({ ...prev, [field]: 10 }));
    let progress = 10;
    const interval = setInterval(() => {
      progress += 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        handleChange(field, `mock_uploaded_${field}_shapno.png`);
      }
      setUploadProgress((prev) => ({ ...prev, [field]: progress }));
    }, 200);
  };

  // Tab Completion Checkers for the 5 Master Tabs
  const isTabCompleted = (tabId: string) => {
    switch (tabId) {
      case "personal_identity":
        return !!(
          form.nameEng &&
          form.dob &&
          form.gender &&
          form.emergencyName &&
          form.emergencyContact
        );
      case "financial_employment":
        return !!(form.gross && form.bankName && form.bankAccount && form.jobDescription);
      case "career_qualifications":
        // Valid if at least one academic record is entered
        return educationList.length > 0 || experienceList.length > 0;
      case "family_dependents":
        return !!(form.nomineeName && form.nomineeShare);
      case "verification_documents":
        return !!form.verifiedBy;
      default:
        return false;
    }
  };

  const getTabCompletionPercentage = (tabId: string): number => {
    switch (tabId) {
      case "personal_identity": {
        const fields = [
          form.nameEng,
          form.nameBng,
          form.dob,
          form.nid,
          form.fatherNameEng,
          form.motherNameEng,
          form.personalContact,
          form.personalEmail,
          form.presVillageEng,
          form.emergencyName,
          form.emergencyContact,
          form.ref1Name,
          form.ref1Contact,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      case "financial_employment": {
        const fields = [
          form.gross,
          form.bankName,
          form.bankAccount,
          form.bankBranch,
          form.routingNumber,
          form.paymentMode,
          form.jobDescription,
          form.keyDeliverables,
          form.reportingLine,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      case "career_qualifications": {
        let score = 0;
        if (educationList.length > 0) score += 40;
        if (experienceList.length > 0) score += 30;
        if (certifications.length > 0) score += 15;
        if (trainingList.length > 0) score += 15;
        return Math.min(100, score);
      }
      case "family_dependents": {
        const nomineeFields = [
          form.nomineeName,
          form.nomineeRelation,
          form.nomineeNid,
          form.nomineeContact,
          form.nomineeShare,
          form.nomineeAddress,
        ];
        const nomineeFilled = nomineeFields.filter(Boolean).length;
        const nomineeScore = Math.round((nomineeFilled / nomineeFields.length) * 70);
        const dependentScore = dependents.length > 0 ? 30 : 0;
        return Math.min(100, nomineeScore + dependentScore);
      }
      case "verification_documents": {
        const verFields = [form.verifiedBy, form.verificationNotes, form.verificationDate];
        const verFilled = verFields.filter(Boolean).length;
        const verScore = Math.round((verFilled / verFields.length) * 30);

        const scanFields = [form.picture, form.signature, form.nidScan, form.certificateScan];
        const scanFilled = scanFields.filter(Boolean).length;
        const scanScore = Math.round((scanFilled / scanFields.length) * 40);

        const otherScore = otherDocs.length > 0 ? 30 : 0;
        return Math.min(100, verScore + scanScore + otherScore);
      }
      default:
        return 0;
    }
  };

  const overallPercentage = Math.round(
    TABS.reduce((acc, tab) => acc + getTabCompletionPercentage(tab.id), 0) / TABS.length,
  );

  const getSubSectionCompletionPercentage = (subId: string): number => {
    switch (subId) {
      case "primary_placement": {
        const fields = [
          form.nameEng,
          form.nameBng,
          form.dob,
          form.gender,
          form.religion,
          form.blood,
          form.maritalStatus,
          form.education,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      case "legal_kinship": {
        const fields = [form.nid, form.fatherNameEng, form.motherNameEng];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      case "address_contact": {
        const fields = [
          form.personalContact,
          form.personalEmail,
          form.presVillageEng,
          form.presUpazila,
          form.presDistrict,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      case "picture_uploads": {
        const fields = [form.picture, form.signature, form.nidScan];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      case "emergency_contact": {
        const fields = [
          form.emergencyName,
          form.emergencyRelation,
          form.emergencyContact,
          form.emergencyAddress,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      case "references": {
        const fields = [form.ref1Name, form.ref1Contact];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
      }
      default:
        return 0;
    }
  };

  const ActiveIcon = TABS.find((t) => t.id === activeTab)?.icon || User;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Core Container */}
      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <Topbar />

        {/* Form Body Scrollpane */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6">
          {/* Top Panel Breadcrumbs and Title Card */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Personnel Info</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Add Employee File</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  Add New Employee Digital File
                </h1>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="h-10 px-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Save className="size-4" /> Save Employee Digital File
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Step Selection Left Navigation Card (Scrollable list of all 17 options) */}
            <div className="lg:col-span-1 bg-card border border-border/80 rounded-2xl p-4 shadow-xs space-y-1 max-h-[82vh] overflow-y-auto scrollbar-thin">
              <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/50 border-b border-border/20 mb-1.5 sticky top-0 bg-card z-10">
                Form Directories
              </div>

              {/* Overall Form Completion Progress Widget */}
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl mb-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-foreground tracking-wider">
                  <span>Profile Completion</span>
                  <span className="text-primary font-black text-xs">{overallPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-muted border border-border/20 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 rounded-full"
                    style={{ width: `${overallPercentage}%` }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground/80 leading-relaxed">
                  Fill in the required fields to complete the employee profile.
                </p>
              </div>

              {TABS.map((tab, idx) => {
                const TabIcon = tab.icon;
                const completed = isTabCompleted(tab.id);
                const isActive = activeTab === tab.id;
                const percentage = getTabCompletionPercentage(tab.id);

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <TabIcon className="size-4 shrink-0" />
                      <span className="truncate">
                        {idx + 1}. {tab.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? "bg-primary-foreground/15 text-primary-foreground"
                            : percentage === 100
                              ? "bg-emerald-500/10 text-emerald-500"
                              : percentage > 40
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {percentage}%
                      </span>
                      {completed && (
                        <Check
                          className={`size-3.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-emerald-500 stroke-[3]"}`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}

              <div className="pt-4 mt-2 border-t border-border/20 px-2 space-y-2">
                <div className="flex items-start gap-2 bg-muted/30 border border-border/40 p-3 rounded-xl text-[10px] text-muted-foreground leading-relaxed">
                  <Info className="size-3.5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Fields marked with <span className="text-rose-500 font-bold">*</span> are system
                    mandatory.
                  </span>
                </div>
              </div>
            </div>

            {/* Core Form Card Section */}
            <div className="lg:col-span-3 bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-xs min-h-[600px] flex flex-col gap-6">
              {/* TAB 1: PERSONAL & IDENTITY (CONSOLIDATED) */}
              {activeTab === "personal_identity" && (
                <div className="space-y-6 animate-in fade-in duration-200 text-foreground">
                  {/* Premium, High-fidelity Progress Stepper Timeline */}
                  <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs overflow-x-auto scrollbar-thin">
                    <div className="min-w-[650px] relative flex items-center justify-between px-6 py-3">
                      {/* Horizontal connecting track line behind the dots */}
                      <div className="absolute top-[26px] left-[55px] right-[55px] h-[3px] bg-muted/60 border-t border-b border-border/20 z-0" />

                      {[
                        {
                          id: "primary_placement",
                          label: "Placement",
                          icon: User,
                          desc: "Personal & Job",
                        },
                        {
                          id: "legal_kinship",
                          label: "Kinship",
                          icon: Users,
                          desc: "NID & Family",
                        },
                        {
                          id: "address_contact",
                          label: "Contact",
                          icon: MapPin,
                          desc: "Reachability",
                        },
                        {
                          id: "picture_uploads",
                          label: "Scans",
                          icon: Camera,
                          desc: "Portraits & NID",
                        },
                        {
                          id: "emergency_contact",
                          label: "Emergency",
                          icon: PhoneCall,
                          desc: "Alternate Reach",
                        },
                        {
                          id: "references",
                          label: "References",
                          icon: Heart,
                          desc: "Referee details",
                        },
                      ].map((step, idx) => {
                        const StepIcon = step.icon;
                        const isSelected = subSection === step.id;
                        const subPercentage = getSubSectionCompletionPercentage(step.id);
                        const isCompleted = subPercentage === 100;

                        return (
                          <button
                            key={step.id}
                            type="button"
                            onClick={() => {
                              setSubSection(step.id);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="relative z-10 flex flex-col items-center gap-2 group transition-all duration-300 focus:outline-none shrink-0"
                            style={{ width: "90px" }}
                          >
                            {/* Circle Stepper Dot/Bubble */}
                            <div
                              className={`size-[42px] rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                                isSelected
                                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_var(--primary)] scale-110"
                                  : isCompleted
                                    ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                                    : "bg-card text-muted-foreground border-border/80 hover:border-muted-foreground/60"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="size-[18px] stroke-[3]" />
                              ) : (
                                <StepIcon className="size-[17px]" />
                              )}

                              {/* Pulsing neon highlight around active bubble */}
                              {isSelected && (
                                <div className="absolute inset-[-4px] rounded-full border-2 border-primary/40 animate-ping opacity-60 pointer-events-none" />
                              )}
                            </div>

                            {/* Text labels and percentages */}
                            <div className="text-center space-y-1.5 w-full min-w-[120px]">
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider block transition-colors duration-200 ${
                                  isSelected
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-foreground"
                                }`}
                              >
                                {idx + 1}. {step.label}
                              </span>

                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block transition-all duration-200 ${
                                  isSelected
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : isCompleted
                                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10"
                                      : subPercentage > 0
                                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/10"
                                        : "bg-rose-500/10 text-rose-600 border border-rose-500/10"
                                }`}
                              >
                                {subPercentage}%
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SUBSECTION: PRIMARY & JOB PLACEMENT */}
                  {subSection === "primary_placement" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Card 1: Core Specifications */}
                      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-emerald-500/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-500" />
                        <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-5">
                          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <User className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                              Primary & Demographic Dossier
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              Core personal data, language registry, and demographics.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                          {/* English Name */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Name (English) <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.nameEng}
                              onChange={(e) => handleChange("nameEng", e.target.value)}
                              className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none w-full ${
                                errors.nameEng ? "border-rose-400" : "border-border"
                              }`}
                              placeholder="e.g. Tahmid Afsar Shapno"
                            />
                          </div>

                          {/* Bengali Name */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Name (Bengali)
                            </label>
                            <input
                              type="text"
                              value={form.nameBng}
                              onChange={(e) => handleChange("nameBng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                              placeholder="উদা: তাহমিদ আফসার স্বপ্ন"
                            />
                          </div>

                          {/* Date of Birth */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Date Of Birth <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <input
                              type="date"
                              value={form.dob}
                              onChange={(e) => handleChange("dob", e.target.value)}
                              className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none w-full ${
                                errors.dob ? "border-rose-400" : "border-border"
                              }`}
                            />
                          </div>

                          {/* Gender */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Gender <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.gender}
                                onChange={() => {}}
                                options={[
                                  { value: "Male", label: "Male" },
                                  { value: "Female", label: "Female" },
                                  { value: "Other", label: "Other" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Religion */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Religion
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.religion}
                                onChange={() => {}}
                                options={[
                                  { value: "Islam", label: "Islam" },
                                  { value: "Hinduism", label: "Hinduism" },
                                  { value: "Christianity", label: "Christianity" },
                                  { value: "Buddhism", label: "Buddhism" },
                                  { value: "Others", label: "Others" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Blood Group */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Blood Group
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.blood}
                                onChange={() => {}}
                                options={[
                                  { value: "A (+ve)", label: "A (+ve)" },
                                  { value: "A (-ve)", label: "A (-ve)" },
                                  { value: "B (+ve)", label: "B (+ve)" },
                                  { value: "B (-ve)", label: "B (-ve)" },
                                  { value: "O (+ve)", label: "O (+ve)" },
                                  { value: "O (-ve)", label: "O (-ve)" },
                                  { value: "AB (+ve)", label: "AB (+ve)" },
                                  { value: "AB (-ve)", label: "AB (-ve)" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Marital Status */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Marital Status
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.maritalStatus}
                                onChange={() => {}}
                                options={[
                                  { value: "Single", label: "Single" },
                                  { value: "Married", label: "Married" },
                                  { value: "Widowed", label: "Widowed" },
                                  { value: "Divorced", label: "Divorced" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Education Level */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Education Level
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.education}
                                onChange={() => {}}
                                options={[
                                  {
                                    value: "Bachelor of Science (B.Sc)",
                                    label: "Bachelor of Science (B.Sc)",
                                  },
                                  { value: "B.Sc.", label: "B.Sc." },
                                  { value: "M.Sc.", label: "M.Sc." },
                                  { value: "HSC", label: "HSC" },
                                  { value: "SSC", label: "SSC" },
                                  { value: "PhD", label: "PhD" },
                                  { value: "Diploma", label: "Diploma" },
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Corporate Placement Mapping */}
                      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-indigo-500/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-indigo-500" />
                        <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-5">
                          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                            <Briefcase className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                              Corporate Placement & Mapping
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              Organizational allocation, reporting structures, and shift schedules.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                          {/* System ID */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Emp ID (System) <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.id}
                              disabled
                              className="h-10 px-3.5 rounded-xl border border-border/50 bg-muted/30 text-xs font-mono font-bold text-muted-foreground w-full cursor-not-allowed"
                            />
                          </div>

                          {/* Company ID */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Emp ID (Company)
                            </label>
                            <input
                              type="text"
                              value={form.offcId}
                              onChange={(e) => handleChange("offcId", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono"
                              placeholder="e.g. PSC-10023"
                            />
                          </div>

                          {/* Joining Date */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Joining Date <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <input
                              type="date"
                              value={form.joinDate}
                              onChange={(e) => handleChange("joinDate", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                            />
                          </div>

                          {/* Confirmation Date */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Confirmation Date <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <input
                              type="date"
                              value={form.confirmDate}
                              onChange={(e) => handleChange("confirmDate", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                            />
                          </div>

                          {/* Department */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Department <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.dept}
                                onChange={() => {}}
                                options={[
                                  { value: "Supply Chain", label: "Supply Chain" },
                                  {
                                    value: "Implementation & Business Analysis",
                                    label: "Implementation & Business Analysis",
                                  },
                                  { value: "Human Resources", label: "Human Resources" },
                                  { value: "Accounts & Finance", label: "Accounts & Finance" },
                                  {
                                    value: "Information Technology",
                                    label: "Information Technology",
                                  },
                                  { value: "Production", label: "Production" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Designation */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Designation <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.title}
                                onChange={() => {}}
                                options={[
                                  { value: "Executive", label: "Executive" },
                                  { value: "Office Executive", label: "Office Executive" },
                                  {
                                    value: "Senior Software Engineer",
                                    label: "Senior Software Engineer",
                                  },
                                  { value: "Manager", label: "Manager" },
                                  { value: "Assistant Manager", label: "Assistant Manager" },
                                  { value: "Operator", label: "Operator" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Employee Type */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Employee Type <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.empType}
                                onChange={() => {}}
                                options={[
                                  { value: "Office Executive", label: "Office Executive" },
                                  { value: "Factory worker", label: "Factory worker" },
                                  { value: "Support Staff", label: "Support Staff" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Working Area */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Working Area
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.workingArea}
                                onChange={() => {}}
                                options={[
                                  { value: "PSL-Operation", label: "PSL-Operation" },
                                  { value: "Head Office", label: "Head Office" },
                                  { value: "Factory Building A", label: "Factory Building A" },
                                  { value: "Factory Building B", label: "Factory Building B" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Section */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Section
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.sect}
                                onChange={() => {}}
                                options={[
                                  { value: "ALL", label: "ALL" },
                                  { value: "Software Development", label: "Software Development" },
                                  { value: "Quality Assurance", label: "Quality Assurance" },
                                  { value: "Operations Support", label: "Operations Support" },
                                  { value: "Garments Production", label: "Garments Production" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Job Nature */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Job Nature
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.jobNature}
                                onChange={() => {}}
                                options={[
                                  { value: "ALL", label: "ALL" },
                                  { value: "Full-Time", label: "Full-Time" },
                                  { value: "Part-Time", label: "Part-Time" },
                                  { value: "Contractual", label: "Contractual" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Unit */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Unit
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.unit}
                                onChange={() => {}}
                                options={[
                                  { value: "ALL", label: "ALL" },
                                  { value: "Unit 1", label: "Unit 1" },
                                  { value: "Unit 2", label: "Unit 2" },
                                  { value: "Unit 3", label: "Unit 3" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Line */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Line
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.line}
                                onChange={() => {}}
                                options={[
                                  { value: "ALL", label: "ALL" },
                                  { value: "Line A", label: "Line A" },
                                  { value: "Line B", label: "Line B" },
                                  { value: "Line C", label: "Line C" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Grade */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Grade
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.grade}
                                onChange={() => {}}
                                options={[
                                  { value: "ALL", label: "None" },
                                  { value: "Grade A", label: "Grade A" },
                                  { value: "Grade B", label: "Grade B" },
                                  { value: "Grade C", label: "Grade C" },
                                  { value: "Grade D", label: "Grade D" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Shift */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Shift <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.shift}
                                onChange={() => {}}
                                options={[
                                  { value: "General Shift", label: "General Shift" },
                                  { value: "Night Shift", label: "Night Shift" },
                                  { value: "Roster Shift", label: "Roster Shift" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Employment Status */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Employment Status
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.empStatus}
                                onChange={() => {}}
                                options={[
                                  { value: "Probation", label: "Probation" },
                                  { value: "Permanent", label: "Permanent" },
                                  { value: "Contractual", label: "Contractual" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Probation Period */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Probation Period
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.probationPeriod}
                                onChange={() => {}}
                                options={[
                                  { value: "N/A", label: "N/A" },
                                  { value: "3", label: "3" },
                                  { value: "6", label: "6" },
                                  { value: "12", label: "12" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Default Holiday */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Default Holiday
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.holiday}
                                onChange={() => {}}
                                options={[
                                  { value: "N/A", label: "N/A" },
                                  { value: "Friday", label: "Friday" },
                                  { value: "Sunday", label: "Sunday" },
                                  { value: "Saturday", label: "Saturday" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Set Manager */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Set Manager
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.setManager}
                                onChange={() => {}}
                                options={[
                                  {
                                    value: "Mamunoor Rashid (DGM), Head Office",
                                    label: "Mamunoor Rashid (DGM), Head Office",
                                  },
                                  { value: "Tahmid Afsar Shapno", label: "Tahmid Afsar Shapno" },
                                  { value: "Sohanur Rahman Sohan", label: "Sohanur Rahman Sohan" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* Recruitment Type */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Recruitment Type
                            </label>
                            <div className="relative">
                              <SearchableSelect
                                value={form.recruitmentType}
                                onChange={() => {}}
                                options={[
                                  { value: "New", label: "New" },
                                  { value: "Re-appointment", label: "Re-appointment" },
                                  { value: "Transfer", label: "Transfer" },
                                ]}
                              />
                            </div>
                          </div>

                          {/* RC Notes */}
                          <div className="space-y-1.5 sm:col-span-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              RC Notes
                            </label>
                            <input
                              type="text"
                              value={form.rcNotes}
                              onChange={(e) => handleChange("rcNotes", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                              placeholder="e.g. Hired via Campus Recruitment Drive"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom action bar */}
                      <div className="flex items-center justify-between pt-5 border-t border-border/20">
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm("Are you sure you want to reset all profile details?")
                            ) {
                              setForm((prev) => ({
                                ...prev,
                                nameEng: "",
                                nameBng: "",
                                dob: "",
                                offcId: "",
                              }));
                            }
                          }}
                          className="h-10 px-5 rounded-xl border border-border text-xs font-extrabold text-rose-500 hover:bg-rose-500/5 transition duration-200 flex items-center gap-1.5"
                        >
                          <Trash2 className="size-4" /> Reset Details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("legal_kinship");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Next Section: Kinship & ID <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUBSECTION: LEGAL CREDENTIALS & KINSHIP */}
                  {subSection === "legal_kinship" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Card 3: Legal Identification Credentials */}
                      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-violet-500/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-violet-500" />
                        <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-5">
                          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                            <ShieldCheck className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                              Legal Identification Credentials
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              Government-issued identity cards, license numbers, and professional
                              indexes.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                          {/* NID */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              National ID (NID) <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.nid}
                              onChange={(e) => handleChange("nid", e.target.value)}
                              className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none w-full font-mono ${
                                errors.nid ? "border-rose-400" : "border-border"
                              }`}
                              placeholder="10 or 17 digit NID number"
                            />
                          </div>

                          {/* Birth Reg No */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Birth Reg No
                            </label>
                            <input
                              type="text"
                              value={form.birthRegNo}
                              onChange={(e) => handleChange("birthRegNo", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono"
                              placeholder="Birth Certificate Number"
                            />
                          </div>

                          {/* Passport No */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Passport No
                            </label>
                            <input
                              type="text"
                              value={form.passportNo}
                              onChange={(e) => handleChange("passportNo", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono"
                              placeholder="Passport Document Number"
                            />
                          </div>

                          {/* Driving License */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Driving License No
                            </label>
                            <input
                              type="text"
                              value={form.drivingLicense}
                              onChange={(e) => handleChange("drivingLicense", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono"
                              placeholder="Driving License Number"
                            />
                          </div>

                          {/* Professional Membership No */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Professional Membership No
                            </label>
                            <input
                              type="text"
                              value={form.membershipNo}
                              onChange={(e) => handleChange("membershipNo", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono"
                              placeholder="e.g. IEB-XXXXX"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Parental & Kinship Context */}
                      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-amber-500/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-amber-500" />
                        <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-5">
                          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                            <Users className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                              Parental & Kinship Context
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              Lineage records, primary parent identifiers, and matrimonial registry.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                          {/* Father Name Eng */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Father Name (English)
                            </label>
                            <input
                              type="text"
                              value={form.fatherNameEng}
                              onChange={(e) => handleChange("fatherNameEng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                            />
                          </div>

                          {/* Father Name Bng */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Father Name (Bengali)
                            </label>
                            <input
                              type="text"
                              value={form.fatherNameBng}
                              onChange={(e) => handleChange("fatherNameBng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                            />
                          </div>

                          {/* Mother Name Eng */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Mother Name (English)
                            </label>
                            <input
                              type="text"
                              value={form.motherNameEng}
                              onChange={(e) => handleChange("motherNameEng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                            />
                          </div>

                          {/* Mother Name Bng */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Mother Name (Bengali)
                            </label>
                            <input
                              type="text"
                              value={form.motherNameBng}
                              onChange={(e) => handleChange("motherNameBng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                            />
                          </div>
                        </div>

                        {/* Married Fields: Conditionally rendered with animated scale-in */}
                        {form.maritalStatus === "Married" ? (
                          <div className="mt-6 pt-6 border-t border-border/30 space-y-4 animate-in slide-in-from-top-3 duration-250">
                            <div className="flex items-center gap-2">
                              <Heart className="size-4 text-rose-500 fill-rose-500 animate-pulse" />
                              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                                Matrimonial Spouse Information
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                              {/* Spouse Name Eng */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Spouse Name (English)
                                </label>
                                <input
                                  type="text"
                                  value={form.spouseNameEng}
                                  onChange={(e) => handleChange("spouseNameEng", e.target.value)}
                                  className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                                  placeholder="Spouse Legal Name"
                                />
                              </div>

                              {/* Spouse Name Bng */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Spouse Name (Bengali)
                                </label>
                                <input
                                  type="text"
                                  value={form.spouseNameBng}
                                  onChange={(e) => handleChange("spouseNameBng", e.target.value)}
                                  className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                                  placeholder="উদা: স্বামী/স্ত্রীর নাম"
                                />
                              </div>

                              {/* Spouse NID */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Spouse NID
                                </label>
                                <input
                                  type="text"
                                  value={form.spouseNid}
                                  onChange={(e) => handleChange("spouseNid", e.target.value)}
                                  className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                                  placeholder="Spouse NID Number"
                                />
                              </div>

                              {/* Spouse Contact */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Spouse Contact No
                                </label>
                                <input
                                  type="text"
                                  value={form.spouseContactNo}
                                  onChange={(e) => handleChange("spouseContactNo", e.target.value)}
                                  className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                                  placeholder="Contact Number"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-5 p-3 rounded-xl bg-muted/20 border border-border/30 text-[11px] text-muted-foreground flex items-center gap-2">
                            <Info className="size-4 text-muted-foreground/60" />
                            <span>
                              Spouse information fields are hidden because Marital Status is set to{" "}
                              <strong>{form.maritalStatus || "Single"}</strong>. Change status in
                              step 1 to enable.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom action bar */}
                      <div className="flex items-center justify-between pt-5 border-t border-border/20">
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("primary_placement");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-5 rounded-xl border border-border text-xs font-extrabold text-muted-foreground hover:bg-muted transition duration-200 flex items-center gap-1.5"
                        >
                          <ArrowLeft className="size-4" /> Previous Section
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("address_contact");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Next Section: Contact & Address <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUBSECTION: CONTACT & RESIDENCY */}
                  {subSection === "address_contact" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Card 5: Residential Address Directory */}
                      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-rose-500/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-rose-500" />
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/30 pb-4 mb-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                              <MapPin className="size-5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                                Residential Address Directory
                              </h3>
                              <p className="text-[11px] text-muted-foreground">
                                Physical residence history, active mailing postage, and permanent
                                voter tracks.
                              </p>
                            </div>
                          </div>

                          {/* Same as present address checkbox */}
                          <label className="flex items-center gap-2 cursor-pointer select-none bg-muted/40 border border-border/30 hover:bg-muted/70 px-3 py-1.5 rounded-xl transition duration-200">
                            <input
                              type="checkbox"
                              checked={form.sameAsPresent}
                              onChange={(e) => handleChange("sameAsPresent", e.target.checked)}
                              className="rounded border-border text-emerald-600 focus:ring-emerald-500 size-4 cursor-pointer"
                            />
                            <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                              Same as Present
                            </span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Present Address Block */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-border/20 pb-2">
                              <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider bg-rose-500/10 px-2 py-0.5 rounded">
                                Present Address
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {/* Division */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Division
                                </label>
                                <div className="relative">
                                  <SearchableSelect
                                    value={form.presDivision}
                                    onChange={() => {}}
                                    options={[
                                      { value: "Dhaka", label: "Dhaka" },
                                      { value: "Rangpur", label: "Rangpur" },
                                      { value: "Chittagong", label: "Chittagong" },
                                      { value: "Sylhet", label: "Sylhet" },
                                      { value: "Rajshahi", label: "Rajshahi" },
                                      { value: "Khulna", label: "Khulna" },
                                      { value: "Barisal", label: "Barisal" },
                                      { value: "Mymensingh", label: "Mymensingh" },
                                    ]}
                                  />
                                </div>
                              </div>

                              {/* District */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  District
                                </label>
                                <div className="relative">
                                  <SearchableSelect
                                    value={form.presDistrict}
                                    onChange={() => {}}
                                    options={[
                                      { value: "Dhaka", label: "Dhaka" },
                                      { value: "Kurigram", label: "Kurigram" },
                                      { value: "Gazipur", label: "Gazipur" },
                                      { value: "Narayanganj", label: "Narayanganj" },
                                      { value: "Chittagong", label: "Chittagong" },
                                      { value: "Sylhet", label: "Sylhet" },
                                      { value: "Rajshahi", label: "Rajshahi" },
                                      { value: "Rangpur", label: "Rangpur" },
                                    ]}
                                  />
                                </div>
                              </div>

                              {/* Upazila/Thana */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                                  <span>Upazila</span>
                                  <button
                                    type="button"
                                    onClick={() => setAddingField("presUpazila")}
                                    className="text-[9px] font-extrabold text-amber-500 hover:text-amber-600 transition flex items-center gap-0.5"
                                  >
                                    <Plus className="size-2.5 stroke-[3]" /> Add
                                  </button>
                                </label>
                                <div className="relative">
                                  <SearchableSelect
                                    value={form.presUpazila}
                                    onChange={() => {}}
                                    options={upazilas.map((u) => ({ value: u, label: u }))}
                                  />
                                </div>
                              </div>

                              {/* PostOffice */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                                  <span>PostOffice</span>
                                  <button
                                    type="button"
                                    onClick={() => setAddingField("presPostOffice")}
                                    className="text-[9px] font-extrabold text-amber-500 hover:text-amber-600 transition flex items-center gap-0.5"
                                  >
                                    <Plus className="size-2.5 stroke-[3]" /> Add
                                  </button>
                                </label>
                                <div className="relative">
                                  <SearchableSelect
                                    value={form.presPostOffice}
                                    onChange={() => {}}
                                    options={postOffices.map((p) => ({ value: p, label: p }))}
                                  />
                                </div>
                              </div>

                              {/* Village/House Eng */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Village/House (Eng)
                                </label>
                                <input
                                  type="text"
                                  value={form.presVillageEng}
                                  onChange={(e) => handleChange("presVillageEng", e.target.value)}
                                  className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                  placeholder="Vill # Dhopapara"
                                />
                              </div>

                              {/* Village/House Bng */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Village/House (Bng)
                                </label>
                                <input
                                  type="text"
                                  value={form.presVillageBng}
                                  onChange={(e) => handleChange("presVillageBng", e.target.value)}
                                  className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                  placeholder="গ্রাম # ধোপাপাড়া"
                                />
                              </div>

                              {/* Road */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Road
                                </label>
                                <input
                                  type="text"
                                  value={form.presRoad}
                                  onChange={(e) => handleChange("presRoad", e.target.value)}
                                  className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                  placeholder="Road No / Name"
                                />
                              </div>

                              {/* Others */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Others
                                </label>
                                <input
                                  type="text"
                                  value={form.presOthers}
                                  onChange={(e) => handleChange("presOthers", e.target.value)}
                                  className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                  placeholder="Flat / Level"
                                />
                              </div>

                              {/* Country */}
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Country
                                </label>
                                <div className="relative">
                                  <SearchableSelect
                                    value={form.presCountry}
                                    onChange={() => {}}
                                    options={[
                                      { value: "Bangladesh", label: "Bangladesh" },
                                      { value: "India", label: "India" },
                                      { value: "USA", label: "USA" },
                                      { value: "UK", label: "UK" },
                                    ]}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="bg-muted/10 border border-border/30 rounded-xl p-3.5">
                              <span className="text-[8px] font-black text-muted-foreground/75 uppercase tracking-widest block mb-1">
                                Mailing Dispatch preview
                              </span>
                              <span className="text-xs font-bold text-foreground block truncate">
                                {form.presVillageEng || "Dhopapara"}, Road {form.presRoad || "N/A"},{" "}
                                {form.presUpazila}, {form.presDistrict}, {form.presCountry}
                              </span>
                            </div>
                          </div>

                          {/* Permanent Address Block */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-border/20 pb-2">
                              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">
                                Permanent Address
                              </span>
                            </div>

                            {form.sameAsPresent ? (
                              <div className="h-[318px] border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 gap-3 bg-muted/5">
                                <CheckCircle2 className="size-10 text-emerald-500 animate-bounce" />
                                <div className="text-center">
                                  <p className="text-xs font-extrabold text-foreground">
                                    Same as Present Address
                                  </p>
                                  <p className="text-[10px] text-muted-foreground max-w-[240px] mt-1">
                                    Data from the present address section will automatically
                                    replicate for legal & postage reports.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                                {/* Division */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    Division
                                  </label>
                                  <div className="relative">
                                    <SearchableSelect
                                      value={form.permDivision}
                                      onChange={() => {}}
                                      options={[
                                        { value: "Dhaka", label: "Dhaka" },
                                        { value: "Rangpur", label: "Rangpur" },
                                        { value: "Chittagong", label: "Chittagong" },
                                        { value: "Sylhet", label: "Sylhet" },
                                        { value: "Rajshahi", label: "Rajshahi" },
                                        { value: "Khulna", label: "Khulna" },
                                        { value: "Barisal", label: "Barisal" },
                                        { value: "Mymensingh", label: "Mymensingh" },
                                      ]}
                                    />
                                  </div>
                                </div>

                                {/* District */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    District
                                  </label>
                                  <div className="relative">
                                    <SearchableSelect
                                      value={form.permDistrict}
                                      onChange={() => {}}
                                      options={[
                                        { value: "Dhaka", label: "Dhaka" },
                                        { value: "Kurigram", label: "Kurigram" },
                                        { value: "Gazipur", label: "Gazipur" },
                                        { value: "Narayanganj", label: "Narayanganj" },
                                        { value: "Chittagong", label: "Chittagong" },
                                        { value: "Sylhet", label: "Sylhet" },
                                        { value: "Rajshahi", label: "Rajshahi" },
                                        { value: "Rangpur", label: "Rangpur" },
                                      ]}
                                    />
                                  </div>
                                </div>

                                {/* Upazila */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                                    <span>Upazila</span>
                                    <button
                                      type="button"
                                      onClick={() => setAddingField("permUpazila")}
                                      className="text-[9px] font-extrabold text-amber-500 hover:text-amber-600 transition flex items-center gap-0.5"
                                    >
                                      <Plus className="size-2.5 stroke-[3]" /> Add
                                    </button>
                                  </label>
                                  <div className="relative">
                                    <SearchableSelect
                                      value={form.permUpazila}
                                      onChange={() => {}}
                                      options={upazilas.map((u) => ({ value: u, label: u }))}
                                    />
                                  </div>
                                </div>

                                {/* PostOffice */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                                    <span>PostOffice</span>
                                    <button
                                      type="button"
                                      onClick={() => setAddingField("permPostOffice")}
                                      className="text-[9px] font-extrabold text-amber-500 hover:text-amber-600 transition flex items-center gap-0.5"
                                    >
                                      <Plus className="size-2.5 stroke-[3]" /> Add
                                    </button>
                                  </label>
                                  <div className="relative">
                                    <SearchableSelect
                                      value={form.permPostOffice}
                                      onChange={() => {}}
                                      options={postOffices.map((p) => ({ value: p, label: p }))}
                                    />
                                  </div>
                                </div>

                                {/* Village/House Eng */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    Village/House (Eng)
                                  </label>
                                  <input
                                    type="text"
                                    value={form.permVillageEng}
                                    onChange={(e) => handleChange("permVillageEng", e.target.value)}
                                    className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                    placeholder="Vill # Khalilgonj"
                                  />
                                </div>

                                {/* Village/House Bng */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    Village/House (Bng)
                                  </label>
                                  <input
                                    type="text"
                                    value={form.permVillageBng}
                                    onChange={(e) => handleChange("permVillageBng", e.target.value)}
                                    className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                    placeholder="গ্রাম # খলিলগঞ্জ"
                                  />
                                </div>

                                {/* Road */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    Road
                                  </label>
                                  <input
                                    type="text"
                                    value={form.permRoad}
                                    onChange={(e) => handleChange("permRoad", e.target.value)}
                                    className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                    placeholder="Road No / Name"
                                  />
                                </div>

                                {/* Others */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    Others
                                  </label>
                                  <input
                                    type="text"
                                    value={form.permOthers}
                                    onChange={(e) => handleChange("permOthers", e.target.value)}
                                    className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                    placeholder="Flat / Level"
                                  />
                                </div>

                                {/* Country */}
                                <div className="col-span-2 space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    Country
                                  </label>
                                  <div className="relative">
                                    <SearchableSelect
                                      value={form.permCountry}
                                      onChange={() => {}}
                                      options={[
                                        { value: "Bangladesh", label: "Bangladesh" },
                                        { value: "India", label: "India" },
                                        { value: "USA", label: "USA" },
                                        { value: "UK", label: "UK" },
                                      ]}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="bg-muted/10 border border-border/30 rounded-xl p-3.5">
                              <span className="text-[8px] font-black text-muted-foreground/75 uppercase tracking-widest block mb-1">
                                Legal Dossier dispatch preview
                              </span>
                              <span className="text-xs font-bold text-foreground block truncate">
                                {form.sameAsPresent
                                  ? `${form.presVillageEng || "Dhopapara"}, Road ${form.presRoad || "N/A"}, ${form.presUpazila}, ${form.presDistrict}, ${form.presCountry}`
                                  : `${form.permVillageEng || "Khalilgonj"}, Road ${form.permRoad || "N/A"}, ${form.permUpazila}, ${form.permDistrict}, ${form.permCountry}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 6: Contact & Reachability */}
                      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-sky-500/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-sky-500" />
                        <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-5">
                          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
                            <Mail className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                              Contact & Reachability Channels
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              Primary communication channels, corporate extensions, and personal
                              mailboxes.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                          {/* Office Email */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Office Email
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={form.offcEmail}
                                onChange={(e) => handleChange("offcEmail", e.target.value)}
                                className="h-10 pl-9 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                placeholder="employee@pakizasoftware.com"
                              />
                              <Mail className="size-3.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          {/* Office Mobile */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Office Mobile
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={form.offcMobile}
                                onChange={(e) => handleChange("offcMobile", e.target.value)}
                                className="h-10 pl-9 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono"
                                placeholder="017500XXXXX"
                              />
                              <Phone className="size-3.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          {/* Office Extension */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Office extension (Ex.)
                            </label>
                            <input
                              type="text"
                              value={form.offcPhoneEx}
                              onChange={(e) => handleChange("offcPhoneEx", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono"
                              placeholder="e.g. 102"
                            />
                          </div>

                          {/* Personal Email */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Personal Email
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={form.personalEmail}
                                onChange={(e) => handleChange("personalEmail", e.target.value)}
                                className="h-10 pl-9 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                                placeholder="personal@gmail.com"
                              />
                              <Mail className="size-3.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          {/* Personal Contact */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              Personal Contact No
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={form.personalContact}
                                onChange={(e) => handleChange("personalContact", e.target.value)}
                                className="h-10 pl-9 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono"
                                placeholder="017130XXXXX"
                              />
                              <Phone className="size-3.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom action bar */}
                      <div className="flex items-center justify-between pt-5 border-t border-border/20">
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("legal_kinship");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-5 rounded-xl border border-border text-xs font-extrabold text-muted-foreground hover:bg-muted transition duration-200 flex items-center gap-1.5"
                        >
                          <ArrowLeft className="size-4" /> Previous Section
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("picture_uploads");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Next Section: Upload Scans <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* TAB 2: FINANCIAL & EMPLOYMENT (CONSOLIDATED COMPENSATION & DISBURSEMENT) */}
              {activeTab === "financial_employment" && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Unified Compensation & Perks Grid */}
                  <div className="space-y-5">
                    <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                      <DollarSign className="size-4.5 text-primary" />
                      <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                        Compensation Structure & Financials
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left Block: Base Compensation & Automated Breakdown Splits */}
                      <div className="lg:col-span-7 space-y-5 bg-card border border-border/60 rounded-2xl p-5 shadow-2xs">
                        <div className="border-b border-border/30 pb-2.5">
                          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">
                            Base Salary & Standard Splits
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Input the employee's gross monthly package. Basic and regulatory
                            components will calculate instantly.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-extrabold text-primary uppercase flex items-center gap-1">
                              Gross Salary <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60">
                                ৳
                              </span>
                              <input
                                type="number"
                                value={form.gross}
                                onChange={(e) => handleChange("gross", e.target.value)}
                                className={`h-10 pl-7.5 pr-3.5 rounded-xl border bg-primary/5 text-sm font-extrabold font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                                  errors.gross ? "border-rose-400" : "border-border/80"
                                }`}
                                placeholder="e.g. 45000"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Basic Salary (60% of Gross)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                ৳
                              </span>
                              <input
                                type="text"
                                readOnly
                                value={parseFloat(basicVal).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                                className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              House Rent Allowance (25%)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                ৳
                              </span>
                              <input
                                type="text"
                                readOnly
                                value={parseFloat(houseRentVal).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                                className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Medical Allowance (8%)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                ৳
                              </span>
                              <input
                                type="text"
                                readOnly
                                value={parseFloat(medicalVal).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                                className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Conveyance Allowance (4%)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                ৳
                              </span>
                              <input
                                type="text"
                                readOnly
                                value={parseFloat(conveyanceVal).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                                className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Food Allowance (3%)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                ৳
                              </span>
                              <input
                                type="text"
                                readOnly
                                value={parseFloat(foodVal).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                                className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Provident Fund (10% of Basic)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                ৳
                              </span>
                              <input
                                type="text"
                                readOnly
                                value={parseFloat(pfVal).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                                className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Supplementary Perks & Dynamic Deductions */}
                      <div className="lg:col-span-5 space-y-5 bg-card border border-border/60 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="border-b border-border/30 pb-2.5 mb-4">
                            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                              Supplementary Allowances & Taxes
                            </h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Specify custom corporate perks and recurring tax withholdings.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                Special Allowance
                              </label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                  ৳
                                </span>
                                <input
                                  type="number"
                                  value={form.specialAllowance}
                                  onChange={(e) => handleChange("specialAllowance", e.target.value)}
                                  className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="e.g. 5000"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                Mobile Allowance
                              </label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                  ৳
                                </span>
                                <input
                                  type="number"
                                  value={form.mobileAllowance}
                                  onChange={(e) => handleChange("mobileAllowance", e.target.value)}
                                  className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none"
                                  placeholder="e.g. 1000"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                Internet Allowance
                              </label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                  ৳
                                </span>
                                <input
                                  type="number"
                                  value={form.internetAllowance}
                                  onChange={(e) =>
                                    handleChange("internetAllowance", e.target.value)
                                  }
                                  className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none"
                                  placeholder="e.g. 1500"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                Utility Allowance
                              </label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                  ৳
                                </span>
                                <input
                                  type="number"
                                  value={form.utilityAllowance}
                                  onChange={(e) => handleChange("utilityAllowance", e.target.value)}
                                  className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none"
                                  placeholder="e.g. 2000"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-rose-500 uppercase">
                                Tax Deduction
                              </label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-rose-500/60">
                                  ৳
                                </span>
                                <input
                                  type="number"
                                  value={form.taxDeduction}
                                  onChange={(e) => handleChange("taxDeduction", e.target.value)}
                                  className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-rose-200/60 bg-rose-500/5 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono w-full focus:outline-none"
                                  placeholder="e.g. 3000"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                Gratuity Contribution
                              </label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                                  ৳
                                </span>
                                <input
                                  type="number"
                                  value={form.gratuity}
                                  onChange={(e) => handleChange("gratuity", e.target.value)}
                                  className="h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none"
                                  placeholder="e.g. 5000"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dynamic Summary Cards */}
                        <div className="pt-4 border-t border-border/30 grid grid-cols-2 gap-3.5">
                          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                            <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider block">
                              Total Allowance
                            </span>
                            <span className="text-sm font-extrabold font-mono text-primary mt-1 block">
                              ৳
                              {parseFloat(totalAllowanceVal).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10">
                            <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                              Est. Net Payable
                            </span>
                            <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                              ৳
                              {(
                                (parseFloat(form.gross) || 0) +
                                (parseFloat(totalAllowanceVal) || 0) -
                                (parseFloat(form.taxDeduction) || 0)
                              ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Disbursement Routing (Bank Details) */}
                  <div className="space-y-5 bg-card border border-border/60 rounded-2xl p-5 shadow-2xs">
                    <div className="border-b border-border/30 pb-2.5 flex items-center gap-2">
                      <CreditCard className="size-4.5 text-primary" />
                      <div>
                        <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                          Disbursement Routing & Bank details
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Specify official payout methods and secure transaction routing details.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Payment Mode
                        </label>
                        <SearchableSelect
                          value={form.paymentMode}
                          onChange={() => {}}
                          options={[
                            { value: "Bank Transfer", label: "Bank Transfer" },
                            { value: "Cash", label: "Cash payment" },
                            { value: "Mobile Banking", label: "Mobile Banking (bKash/Nagad)" },
                          ]}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={form.bankName}
                          onChange={(e) => handleChange("bankName", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                          placeholder="e.g. Dutch-Bangla Bank"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={form.bankAccount}
                          onChange={(e) => handleChange("bankAccount", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                          placeholder="e.g. 102.120.99827"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Branch Name
                        </label>
                        <input
                          type="text"
                          value={form.bankBranch}
                          onChange={(e) => handleChange("bankBranch", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                          placeholder="e.g. Motijheel Branch"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Routing Number
                        </label>
                        <input
                          type="text"
                          value={form.routingNumber}
                          onChange={(e) => handleChange("routingNumber", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                          placeholder="e.g. 020260120"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/30 my-8 pt-2" />
                </div>
              )}

              {/* SUBSECTION: PICTURE UPLOAD */}
              {activeTab === "personal_identity" && subSection === "picture_uploads" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <Camera className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Document & Image Upload Center
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Portrait Upload */}
                    <div className="border border-border/60 bg-muted/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]">
                      <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                        <User className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                          Employee Portrait
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Premium front portrait, clean background. Max 2MB.
                        </p>
                      </div>

                      {uploadProgress.picture !== undefined && uploadProgress.picture < 100 && (
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{ width: `${uploadProgress.picture}%` }}
                          ></div>
                        </div>
                      )}

                      {form.picture ? (
                        <div className="absolute inset-0 bg-card/95 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in">
                          <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                            <Check className="size-8" />
                          </div>
                          <span className="text-[10px] font-bold text-foreground font-mono">
                            {form.picture}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleChange("picture", "")}
                            className="text-[9px] font-bold text-rose-500 hover:underline"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerMockUpload("picture")}
                          className="h-9 px-4 rounded-xl border border-primary/30 hover:bg-primary/5 text-primary text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Upload className="size-3.5" /> Upload Portrait Photo
                        </button>
                      )}
                    </div>

                    {/* Signature Upload */}
                    <div className="border border-border/60 bg-muted/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]">
                      <div className="size-14 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                        <FileSignature className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                          Authorized Signature
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Digital signature scan on clean white sheet. Max 1MB.
                        </p>
                      </div>

                      {uploadProgress.signature !== undefined && uploadProgress.signature < 100 && (
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${uploadProgress.signature}%` }}
                          ></div>
                        </div>
                      )}

                      {form.signature ? (
                        <div className="absolute inset-0 bg-card/95 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in">
                          <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                            <Check className="size-8" />
                          </div>
                          <span className="text-[10px] font-bold text-foreground font-mono">
                            {form.signature}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleChange("signature", "")}
                            className="text-[9px] font-bold text-rose-500 hover:underline"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerMockUpload("signature")}
                          className="h-9 px-4 rounded-xl border border-indigo-500/30 hover:bg-indigo-500/5 text-indigo-500 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Upload className="size-3.5" /> Upload Signature Scan
                        </button>
                      )}
                    </div>

                    {/* NID Card Scan */}
                    <div className="border border-border/60 bg-muted/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]">
                      <div className="size-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                        <FileText className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                          National ID Card Scan
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Scanned PDF or High-res JPG of both sides. Max 4MB.
                        </p>
                      </div>

                      {uploadProgress.nidScan !== undefined && uploadProgress.nidScan < 100 && (
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                          <div
                            className="bg-amber-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${uploadProgress.nidScan}%` }}
                          ></div>
                        </div>
                      )}

                      {form.nidScan ? (
                        <div className="absolute inset-0 bg-card/95 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in">
                          <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                            <Check className="size-8" />
                          </div>
                          <span className="text-[10px] font-bold text-foreground font-mono">
                            {form.nidScan}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleChange("nidScan", "")}
                            className="text-[9px] font-bold text-rose-500 hover:underline"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerMockUpload("nidScan")}
                          className="h-9 px-4 rounded-xl border border-amber-500/30 hover:bg-amber-500/5 text-amber-500 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Upload className="size-3.5" /> Upload NID Card Scan
                        </button>
                      )}
                    </div>

                    {/* Academic Degree Scan */}
                    <div className="border border-border/60 bg-muted/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]">
                      <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                        <GraduationCap className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                          Degree Certificate
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Verified academic graduation degree certificate. Max 5MB.
                        </p>
                      </div>

                      {uploadProgress.certificateScan !== undefined &&
                        uploadProgress.certificateScan < 100 && (
                          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${uploadProgress.certificateScan}%` }}
                            ></div>
                          </div>
                        )}

                      {form.certificateScan ? (
                        <div className="absolute inset-0 bg-card/95 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in">
                          <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                            <Check className="size-8" />
                          </div>
                          <span className="text-[10px] font-bold text-foreground font-mono">
                            {form.certificateScan}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleChange("certificateScan", "")}
                            className="text-[9px] font-bold text-rose-500 hover:underline"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerMockUpload("certificateScan")}
                          className="h-9 px-4 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/5 text-emerald-500 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Upload className="size-3.5" /> Upload Certificate Scan
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => {
                        setSubSection("address_contact");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-4" /> Previous Section
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubSection("emergency_contact");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      Next Section: Emergency Contact <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: QUALIFICATIONS & EXPERIENCE (CONSOLIDATED) */}
              {activeTab === "career_qualifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <GraduationCap className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Academic Credentials & Qualifications
                    </h2>
                  </div>

                  {/* Inline Spreadsheet Table */}
                  <div className="border border-border/40 rounded-2xl overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                          <th className="px-4 py-3 min-w-[200px]">Degree / Exam Title</th>
                          <th className="px-4 py-3">Institution Name</th>
                          <th className="px-4 py-3 w-[100px] text-center">Passing Year</th>
                          <th className="px-4 py-3 w-[100px] text-center">Result / GPA</th>
                          <th className="px-4 py-3 w-[170px] text-center">Attachment (Optional)</th>
                          <th className="px-4 py-3 w-[60px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {educationList.map((edu, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/5 transition-colors font-semibold text-foreground/80"
                          >
                            <td className="px-4 py-2">
                              <SearchableSelect
                                value={edu.degree}
                                onChange={() => {}}
                                options={[
                                  { value: "Secondary (SSC)", label: "Secondary School (SSC)" },
                                  {
                                    value: "Higher Secondary (HSC)",
                                    label: "Higher Secondary (HSC)",
                                  },
                                  {
                                    value: "Bachelor of Science (B.Sc)",
                                    label: "Bachelor of Science (B.Sc)",
                                  },
                                  {
                                    value: "Master of Science (M.Sc)",
                                    label: "Master of Science (M.Sc)",
                                  },
                                  { value: "MBA / Post Grad", label: "Executive MBA / Post Grad" },
                                  { value: "PhD / Doctorate", label: "PhD / Doctorate Degree" },
                                ]}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={edu.institute}
                                onChange={(e) =>
                                  handleEduChange(index, "institute", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Dhaka University"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={edu.passingYear}
                                onChange={(e) =>
                                  handleEduChange(index, "passingYear", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center font-mono focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. 2022"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={edu.resultGpa}
                                onChange={(e) =>
                                  handleEduChange(index, "resultGpa", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center font-mono focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. 3.85"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              {edu.attachment ? (
                                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg gap-1.5 max-w-[150px] mx-auto animate-in fade-in duration-200">
                                  <span className="text-[10px] font-mono font-bold text-emerald-600 truncate">
                                    {edu.attachment}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleEduChange(index, "attachment", "")}
                                    className="text-rose-500 hover:text-rose-600 font-black text-[10px] shrink-0"
                                    title="Remove certificate attachment"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => triggerRowMockUpload("education", index)}
                                  className="h-7 px-2.5 rounded-lg border border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition duration-200"
                                >
                                  <Upload className="size-3 text-primary/75" /> Upload File
                                </button>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setEducationList((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {educationList.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-8 text-center text-muted-foreground text-xs italic"
                            >
                              No academic credentials logged yet. Click the button below to add your
                              first qualification.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row Button */}
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      onClick={addEduRow}
                      className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="size-3.5" /> Add Academic Qualification
                    </button>
                  </div>

                  <div className="border-t border-border/30 my-8 pt-2" />
                </div>
              )}

              {/* SUBSECTION: PRIOR JOB EXPERIENCE */}
              {activeTab === "career_qualifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <History className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Prior Job Experience & Career History
                    </h2>
                  </div>

                  {/* Inline Spreadsheet Table */}
                  <div className="border border-border/40 rounded-2xl overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                          <th className="px-4 py-3">Organization / Company</th>
                          <th className="px-4 py-3">Designation</th>
                          <th className="px-4 py-3 w-[120px] text-center">From Date</th>
                          <th className="px-4 py-3 w-[120px] text-center">To Date</th>
                          <th className="px-4 py-3">Reason for Leaving</th>
                          <th className="px-4 py-3 w-[170px] text-center">Attachment (Optional)</th>
                          <th className="px-4 py-3 w-[60px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {experienceList.map((exp, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/5 transition-colors font-semibold text-foreground/80"
                          >
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleExpChange(index, "company", e.target.value)}
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Brain Station 23"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={exp.designation}
                                onChange={(e) =>
                                  handleExpChange(index, "designation", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Senior Software Engineer"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="date"
                                value={exp.fromDate}
                                onChange={(e) => handleExpChange(index, "fromDate", e.target.value)}
                                className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="date"
                                value={exp.toDate}
                                onChange={(e) => handleExpChange(index, "toDate", e.target.value)}
                                className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={exp.leavingReason}
                                onChange={(e) =>
                                  handleExpChange(index, "leavingReason", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Career Growth"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              {exp.attachment ? (
                                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg gap-1.5 max-w-[150px] mx-auto animate-in fade-in duration-200">
                                  <span className="text-[10px] font-mono font-bold text-emerald-600 truncate">
                                    {exp.attachment}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleExpChange(index, "attachment", "")}
                                    className="text-rose-500 hover:text-rose-600 font-black text-[10px] shrink-0"
                                    title="Remove experience attachment"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => triggerRowMockUpload("experience", index)}
                                  className="h-7 px-2.5 rounded-lg border border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition duration-200"
                                >
                                  <Upload className="size-3 text-primary/75" /> Upload File
                                </button>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setExperienceList((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {experienceList.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-8 text-center text-muted-foreground text-xs italic"
                            >
                              No prior work experience logged. Click the button below to add your
                              first job history.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row Button */}
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      onClick={addExpRow}
                      className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="size-3.5" /> Add Job Experience Row
                    </button>
                  </div>

                  <div className="border-t border-border/30 my-8 pt-2" />
                </div>
              )}

              {/* SUBSECTION: PROFESSIONAL CERTIFICATES */}
              {activeTab === "career_qualifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <Award className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Professional Certifications & Credentials
                    </h2>
                  </div>

                  {/* Inline Spreadsheet Table */}
                  <div className="border border-border/40 rounded-2xl overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                          <th className="px-4 py-3">Certificate Title</th>
                          <th className="px-4 py-3">Issuing Authority / Organization</th>
                          <th className="px-4 py-3 w-[180px] text-center">Credential ID</th>
                          <th className="px-4 py-3 w-[150px] text-center">Issue Date</th>
                          <th className="px-4 py-3 w-[60px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {certifications.map((cert, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/5 transition-colors font-semibold text-foreground/80"
                          >
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={cert.certificateName}
                                onChange={(e) =>
                                  handleCertChange(index, "certificateName", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. AWS Certified Architect"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={cert.organization}
                                onChange={(e) =>
                                  handleCertChange(index, "organization", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Amazon Web Services"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={cert.credentialId}
                                onChange={(e) =>
                                  handleCertChange(index, "credentialId", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center font-mono focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. AWS-12345"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="date"
                                value={cert.issueDate}
                                onChange={(e) =>
                                  handleCertChange(index, "issueDate", e.target.value)
                                }
                                className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setCertifications((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {certifications.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-8 text-center text-muted-foreground text-xs italic"
                            >
                              No certification credentials added yet. Click the button below to add
                              your first cert.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row Button */}
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      onClick={addCertRow}
                      className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="size-3.5" /> Add Certification Row
                    </button>
                  </div>

                  <div className="border-t border-border/30 my-8 pt-2" />
                </div>
              )}

              {/* SUBSECTION: PROFESSIONAL TRAINING */}
              {activeTab === "career_qualifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <BookOpen className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Professional Training Programs
                    </h2>
                  </div>

                  {/* Inline Spreadsheet Table */}
                  <div className="border border-border/40 rounded-2xl overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                          <th className="px-4 py-3">Training Title</th>
                          <th className="px-4 py-3">Institution / Provider</th>
                          <th className="px-4 py-3 w-[150px] text-center">Duration</th>
                          <th className="px-4 py-3 w-[150px] text-center">Completion Date</th>
                          <th className="px-4 py-3 w-[60px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {trainingList.map((t, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/5 transition-colors font-semibold text-foreground/80"
                          >
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={t.trainingTitle}
                                onChange={(e) =>
                                  handleTrainChange(index, "trainingTitle", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Advanced System Architecture"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={t.institution}
                                onChange={(e) =>
                                  handleTrainChange(index, "institution", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Coursera"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="text"
                                value={t.duration}
                                onChange={(e) =>
                                  handleTrainChange(index, "duration", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. 12 Weeks"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="date"
                                value={t.completionDate}
                                onChange={(e) =>
                                  handleTrainChange(index, "completionDate", e.target.value)
                                }
                                className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setTrainingList((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {trainingList.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-8 text-center text-muted-foreground text-xs italic"
                            >
                              No training programs logged. Click the button below to add your first
                              training record.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row Button */}
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      onClick={addTrainRow}
                      className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="size-3.5" /> Add Training Program Row
                    </button>
                  </div>

                  <div className="border-t border-border/30 my-8 pt-2" />
                </div>
              )}

              {/* SUBSECTION: ORGANIZATIONAL INVOLVEMENT */}
              {activeTab === "career_qualifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <Users className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Organizational Involvements & Committee Commitments
                    </h2>
                  </div>

                  {/* Inline Spreadsheet Table */}
                  <div className="border border-border/40 rounded-2xl overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                          <th className="px-4 py-3">Committee / Group Name</th>
                          <th className="px-4 py-3">Role Played</th>
                          <th className="px-4 py-3 w-[150px] text-center">Duration</th>
                          <th className="px-4 py-3">Key Deliverable / Remarks</th>
                          <th className="px-4 py-3 w-[60px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {involvements.map((invol, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/5 transition-colors font-semibold text-foreground/80"
                          >
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={invol.activityName}
                                onChange={(e) =>
                                  handleInvolChange(index, "activityName", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Safety Committee"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={invol.role}
                                onChange={(e) => handleInvolChange(index, "role", e.target.value)}
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Committee Secretary"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="text"
                                value={invol.duration}
                                onChange={(e) =>
                                  handleInvolChange(index, "duration", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. 6 Months"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={invol.description}
                                onChange={(e) =>
                                  handleInvolChange(index, "description", e.target.value)
                                }
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Supervised emergency drills"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setInvolvements((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {involvements.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-8 text-center text-muted-foreground text-xs italic"
                            >
                              No organizational involvements logged. Click the button below to add
                              your first record.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row Button */}
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      onClick={addInvolRow}
                      className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="size-3.5" /> Add Organizational Involvement Row
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("financial_employment");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-4" /> Previous Step
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("family_dependents");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      Next Step: Family & Dependents <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SUBSECTION: EMERGENCY CONTACT */}
              {activeTab === "personal_identity" && subSection === "emergency_contact" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <PhoneCall className="size-4.5 text-rose-500" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Emergency Contact & Reachability
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-2xl p-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Contact Person Name <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.emergencyName}
                        onChange={(e) => handleChange("emergencyName", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                        placeholder="e.g. M. A. Rahman"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Relationship
                      </label>
                      <SearchableSelect
                        value={form.emergencyRelation}
                        onChange={() => {}}
                        options={[
                          { value: "Father", label: "Father" },
                          { value: "Mother", label: "Mother" },
                          { value: "Spouse", label: "Spouse" },
                          { value: "Sibling", label: "Sibling" },
                          { value: "Guardian", label: "Guardian" },
                        ]}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Primary Mobile No <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.emergencyContact}
                        onChange={(e) => handleChange("emergencyContact", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full font-mono"
                        placeholder="e.g. 017XXXXXXXX"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Alternative Contact No
                      </label>
                      <input
                        type="text"
                        value={form.emergencyAltContact}
                        onChange={(e) => handleChange("emergencyAltContact", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                        placeholder="Alternative number"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.emergencyEmail}
                        onChange={(e) => handleChange("emergencyEmail", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                        placeholder="e.g. parent@gmail.com"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Detailed Address
                      </label>
                      <textarea
                        value={form.emergencyAddress}
                        onChange={(e) => handleChange("emergencyAddress", e.target.value)}
                        className="p-3 rounded-xl border border-border bg-card text-xs font-semibold w-full h-20 resize-none"
                        placeholder="Enter full physical residential address of emergency contact..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => {
                        setSubSection("picture_uploads");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-4" /> Previous Section
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubSection("references");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      Next Section: References <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: FAMILY & DEPENDENTS (CONSOLIDATED) */}
              {activeTab === "family_dependents" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <FileSignature className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Nominee Declaration Dossier
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-2xl p-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Nominee Full Name <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.nomineeName}
                        onChange={(e) => handleChange("nomineeName", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Relation
                      </label>
                      <SearchableSelect
                        value={form.nomineeRelation}
                        onChange={() => {}}
                        options={[
                          { value: "Mother", label: "Mother" },
                          { value: "Father", label: "Father" },
                          { value: "Spouse", label: "Spouse" },
                          { value: "Child", label: "Child" },
                          { value: "Sibling", label: "Sibling" },
                        ]}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Nominee NID / Birth Reg <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.nomineeNid}
                        onChange={(e) => handleChange("nomineeNid", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full font-mono"
                        placeholder="NID or Birth cert"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Nominee Contact No
                      </label>
                      <input
                        type="text"
                        value={form.nomineeContact}
                        onChange={(e) => handleChange("nomineeContact", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Nominee Share Percentage (%)
                      </label>
                      <input
                        type="number"
                        max="100"
                        value={form.nomineeShare}
                        onChange={(e) => handleChange("nomineeShare", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full font-mono text-primary bg-primary/5"
                        placeholder="e.g. 100"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Nominee Permanent Address
                      </label>
                      <textarea
                        value={form.nomineeAddress}
                        onChange={(e) => handleChange("nomineeAddress", e.target.value)}
                        className="p-3 rounded-xl border border-border bg-card text-xs font-semibold w-full h-20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border/30 my-8 pt-2" />
                </div>
              )}

              {/* SUBSECTION: REFERENCE */}
              {activeTab === "personal_identity" && subSection === "references" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <Heart className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Professional & Corporate References
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reference 1 */}
                    <div className="border border-border bg-muted/15 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest border-b border-border/20 pb-2">
                        Primary Reference
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                            Referee Name
                          </label>
                          <input
                            type="text"
                            value={form.ref1Name}
                            onChange={(e) => handleChange("ref1Name", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full"
                            placeholder="Name"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                            Designation & Org
                          </label>
                          <input
                            type="text"
                            value={form.ref1Designation}
                            onChange={(e) => handleChange("ref1Designation", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full"
                            placeholder="e.g. Director, Tech Ltd"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                            Contact Number
                          </label>
                          <input
                            type="text"
                            value={form.ref1Contact}
                            onChange={(e) => handleChange("ref1Contact", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full font-mono"
                            placeholder="Contact number"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reference 2 */}
                    <div className="border border-border bg-muted/15 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-extrabold text-indigo-500 uppercase tracking-widest border-b border-border/20 pb-2">
                        Secondary Reference
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                            Referee Name
                          </label>
                          <input
                            type="text"
                            value={form.ref2Name}
                            onChange={(e) => handleChange("ref2Name", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full"
                            placeholder="Name"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                            Designation & Org
                          </label>
                          <input
                            type="text"
                            value={form.ref2Designation}
                            onChange={(e) => handleChange("ref2Designation", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full"
                            placeholder="e.g. Manager, HR"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">
                            Contact Number
                          </label>
                          <input
                            type="text"
                            value={form.ref2Contact}
                            onChange={(e) => handleChange("ref2Contact", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full font-mono"
                            placeholder="Contact number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => {
                        setSubSection("emergency_contact");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-4" /> Previous Section
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("financial_employment");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      Next Step: Financial & Employment <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SUBSECTION: FAMILY DEPENDENTS */}
              {activeTab === "family_dependents" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <Baby className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Family Dependents Registry
                    </h2>
                  </div>

                  {/* Inline Spreadsheet Table */}
                  <div className="border border-border/40 rounded-2xl overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                          <th className="px-4 py-3">Dependent Name</th>
                          <th className="px-4 py-3 w-[200px]">Relationship</th>
                          <th className="px-4 py-3 w-[165px] text-center">Date of Birth</th>
                          <th className="px-4 py-3 w-[200px] text-center">NID / Birth Cert No</th>
                          <th className="px-4 py-3 w-[60px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {dependents.map((dep, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/5 transition-colors font-semibold text-foreground/80"
                          >
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={dep.depName}
                                onChange={(e) => handleDepChange(index, "depName", e.target.value)}
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Sarah Rahman"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <SearchableSelect
                                value={dep.depRelation}
                                onChange={() => {}}
                                options={[
                                  { value: "Child", label: "Child (Son/Daughter)" },
                                  { value: "Spouse", label: "Spouse (Husband/Wife)" },
                                  { value: "Parent", label: "Parent (Father/Mother)" },
                                ]}
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="date"
                                value={dep.depDob}
                                onChange={(e) => handleDepChange(index, "depDob", e.target.value)}
                                className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="text"
                                value={dep.depNid}
                                onChange={(e) => handleDepChange(index, "depNid", e.target.value)}
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center font-mono focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. 19951234567"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setDependents((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {dependents.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-8 text-center text-muted-foreground text-xs italic"
                            >
                              No family dependents listed. Click the button below to add eligible
                              family members.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row Button */}
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      onClick={addDepRow}
                      className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="size-3.5" /> Add Family Dependent Row
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("career_qualifications");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-4" /> Previous Step
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("verification_documents");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      Next Step: Verification & Docs <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SUBSECTION: JOB DESCRIPTION */}
              {activeTab === "financial_employment" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <FileText className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Corporate Job Description & Charter
                    </h2>
                  </div>

                  <div className="space-y-5 bg-muted/10 border border-border/30 rounded-2xl p-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Key Roles & Responsibilities
                      </label>
                      <textarea
                        value={form.jobDescription}
                        onChange={(e) => handleChange("jobDescription", e.target.value)}
                        className="p-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full h-32 resize-none leading-relaxed"
                        placeholder="Describe key duties, system administration, coding standards, etc..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Key Performance Indicators (KPIs) / Deliverables
                      </label>
                      <textarea
                        value={form.keyDeliverables}
                        onChange={(e) => handleChange("keyDeliverables", e.target.value)}
                        className="p-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full h-24 resize-none leading-relaxed"
                        placeholder="Enter primary deliverables expected from this designation..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Primary Reporting Manager
                        </label>
                        <input
                          type="text"
                          value={form.reportingLine}
                          onChange={(e) => handleChange("reportingLine", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold text-primary bg-primary/5 w-full"
                          placeholder="e.g. Director, Systems"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Alternate reporting authority
                        </label>
                        <input
                          type="text"
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                          placeholder="e.g. Chief Operations Officer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/30 my-8 pt-2" />
                </div>
              )}

              {/* TAB 15: OTHERS DOCX */}
              {activeTab === "verification_documents" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <FileDown className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Supporting Documents & PDF Annexes
                    </h2>
                  </div>

                  {/* Inline Spreadsheet Table */}
                  <div className="border border-border/40 rounded-2xl overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                          <th className="px-4 py-3">Document Title</th>
                          <th className="px-4 py-3 w-[220px]">Document Type</th>
                          <th className="px-4 py-3 w-[300px]">Attached File Name (Simulation)</th>
                          <th className="px-4 py-3 w-[60px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {otherDocs.map((doc, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/5 transition-colors font-semibold text-foreground/80"
                          >
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={doc.docTitle}
                                onChange={(e) => handleDocChange(index, "docTitle", e.target.value)}
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Police Clearance Certificate"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <SearchableSelect
                                value={doc.docType}
                                onChange={() => {}}
                                options={[
                                  { value: "PDF", label: "PDF Document" },
                                  { value: "DOCX", label: "Microsoft Word (DOCX)" },
                                  { value: "IMAGE", label: "Image File (JPG/PNG)" },
                                  { value: "EXCEL", label: "Spreadsheet (XLS/CSV)" },
                                ]}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={doc.docFile}
                                onChange={(e) => handleDocChange(index, "docFile", e.target.value)}
                                className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full font-mono focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. police_clearance.pdf"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setOtherDocs((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition"
                              >
                                <Trash className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {otherDocs.length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-muted-foreground text-xs italic"
                            >
                              No supporting documents uploaded yet. Click the button below to
                              upload/attach one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row Button */}
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      onClick={addDocRow}
                      className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Plus className="size-3.5" /> Attach Supporting Document
                    </button>
                  </div>

                  <div className="border-t border-border/30 my-8 pt-2" />
                </div>
              )}

              {/* TAB 16: EMPLOYEE VERIFICATION */}
              {activeTab === "verification_documents" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <ShieldCheck className="size-4.5 text-emerald-500 animate-pulse" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Official Auditor Background Verification
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-2xl p-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Background Check Status
                      </label>
                      <SearchableSelect
                        value={form.verificationStatus}
                        onChange={() => {}}
                        options={[
                          { value: "Verified", label: "Verified & Cleared" },
                          { value: "Pending", label: "Pending Audit" },
                          { value: "Rejected", label: "Flagged / Denied" },
                        ]}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Audited / Verified By <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.verifiedBy}
                        onChange={(e) => handleChange("verifiedBy", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Verification Date
                      </label>
                      <input
                        type="date"
                        value={form.verificationDate}
                        onChange={(e) => handleChange("verificationDate", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Auditor Notes & Findings
                      </label>
                      <textarea
                        value={form.verificationNotes}
                        onChange={(e) => handleChange("verificationNotes", e.target.value)}
                        className="p-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full h-24 resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("family_dependents");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-4" /> Previous Step
                    </button>
                    <button
                      type="submit"
                      className="h-10 px-6 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-1.5 shadow-primary/20"
                    >
                      <Save className="size-4" /> Save Employee Digital File
                    </button>
                  </div>
                </div>
              )}

              {/* SUBSECTION: EMPLOYEE EQUIPMENT */}
              {activeTab === "financial_employment" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <Laptop className="size-4.5 text-primary animate-pulse" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Corporate Equipment & Asset Assignment
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-2xl p-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Laptop Brand & Model
                      </label>
                      <input
                        type="text"
                        value={form.laptopBrand}
                        onChange={(e) => handleChange("laptopBrand", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Laptop Asset Tag <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.laptopAssetId}
                        onChange={(e) => handleChange("laptopAssetId", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full font-mono text-primary bg-primary/5"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Mobile Asset Model
                      </label>
                      <input
                        type="text"
                        value={form.mobileBrand}
                        onChange={(e) => handleChange("mobileBrand", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Mobile Asset ID
                      </label>
                      <input
                        type="text"
                        value={form.mobileAssetId}
                        onChange={(e) => handleChange("mobileAssetId", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Access Card Tag ID
                      </label>
                      <input
                        type="text"
                        value={form.accessCardId}
                        onChange={(e) => handleChange("accessCardId", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                        placeholder="Access card RFID"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Issuance Date
                      </label>
                      <input
                        type="date"
                        value={form.equipmentIssuedDate}
                        onChange={(e) => handleChange("equipmentIssuedDate", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("personal_identity");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-4" /> Previous Step
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("career_qualifications");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      Next Step: Qualifications & Experience <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* CUSTOM ADD OPTION MODAL OVERLAY */}
      {addingField && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xl p-5 w-full max-w-sm overflow-hidden flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
              <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                Add Custom {addingField.includes("Upazila") ? "Upazila/Thana" : "Post Office"}
              </h3>
              <button
                onClick={() => setAddingField(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                Custom Option Value
              </label>
              <input
                type="text"
                autoFocus
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                placeholder={addingField.includes("Upazila") ? "e.g. Banani" : "e.g. Banani-11"}
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-border/30 pt-3">
              <button
                onClick={() => setAddingField(null)}
                className="h-9 px-4 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomOption}
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition duration-200"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE SUCCESS DIALOG OVERLAY */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xl p-6 w-full max-w-md overflow-hidden flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-200">
            <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-xs animate-bounce">
              <CheckCircle2 className="size-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-foreground leading-tight">
                Digital Profile Created!
              </h2>
              <p className="text-xs text-muted-foreground">
                The employee profile has been successfully saved to the database.
              </p>
            </div>

            <div className="w-full bg-muted/20 border border-border/30 rounded-xl p-4.5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-bold">Employee ID:</span>
                <span className="font-extrabold text-primary">{form.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Name (Eng):</span>
                <span className="font-bold text-foreground">{form.nameEng}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Designation:</span>
                <span className="font-bold text-foreground">{form.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Gross Salary:</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ৳{grossNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex w-full gap-3 border-t border-border/30 pt-4 mt-2">
              <Link
                to="/personnel-list"
                className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition duration-200 flex-1 flex items-center justify-center"
              >
                Go to Directory
              </Link>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setForm((prev) => ({
                    ...prev,
                    id: "2025" + Math.floor(100000 + Math.random() * 900000),
                    nameEng: "",
                    nameBng: "",
                    title: "",
                    gross: "",
                  }));
                  setActiveTab("personal_identity");
                }}
                className="h-10 px-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 flex-1"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
