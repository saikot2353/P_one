import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Topbar } from "@/components/dashboard/Topbar";
import { toast } from "sonner";
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
  Sparkles,
  Cpu,
  Scan,
  Loader2,
  AlertTriangle,
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    academic: true,
    experience: false,
    certifications: false,
    training: false,
    involvements: false,
  });

  // Custom addition modal states
  const [addingField, setAddingField] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");

  // Missing attachment warning state
  const [missingAttachments, setMissingAttachments] = useState<{
    type: "education" | "experience";
    label: string;
  }[] | null>(null);

  // Practical File Upload states
  const [uploadingState, setUploadingState] = useState<{
    listType: "education" | "experience";
    index: number;
    progress: number;
  } | null>(null);
  const [previewFile, setPreviewFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);

  const handleRowFileUpload = (listType: "education" | "experience", index: number) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.jpg,.jpeg,.png";
    
    fileInput.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      // Extension validation
      const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        toast.error("Only PDF, JPG, JPEG, and PNG files are allowed!");
        return;
      }
      
      // Size validation (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size exceeds the 5MB limit!");
        return;
      }
      
      const fileSizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;
        
      let currentProgress = 0;
      setUploadingState({ listType, index, progress: 0 });
      
      const interval = setInterval(() => {
        currentProgress += 10;
        setUploadingState({ listType, index, progress: currentProgress });
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setUploadingState(null);
          
          const generatedAttachmentId = "att_" + Math.floor(100000 + Math.random() * 900000).toString(16);
          const updatedFileName = `${file.name} (${fileSizeStr})`;
          if (listType === "education") {
            setEducationList((prev) =>
              prev.map((item, i) => (i === index ? { ...item, attachment: updatedFileName, attachmentId: generatedAttachmentId } : item))
            );
          } else {
            setExperienceList((prev) =>
              prev.map((item, i) => (i === index ? { ...item, attachment: updatedFileName, attachmentId: generatedAttachmentId } : item))
            );
          }
          toast.success(`${file.name} uploaded successfully!`);
        }
      }, 100);
    };
    
    fileInput.click();
  };

  // NID OCR Simulation States
  const [isNidScanning, setIsNidScanning] = useState(false);
  const [nidScanProgress, setNidScanProgress] = useState(0);
  const [nidScanStep, setNidScanStep] = useState(0);
  const [showNidOcrModal, setShowNidOcrModal] = useState(false);
  const [showNidScannerModal, setShowNidScannerModal] = useState(false);
  const [scanDocumentType, setScanDocumentType] = useState("");
  const [rawOcrText, setRawOcrText] = useState("");
  const [nidFrontImage, setNidFrontImage] = useState<File | null>(null);
  const [nidBackImage, setNidBackImage] = useState<File | null>(null);
  const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(null);
  const [nidBackPreview, setNidBackPreview] = useState<string | null>(null);
  const [extractedNid, setExtractedNid] = useState({
    nameEng: "",
    nameBng: "",
    fatherNameEng: "",
    fatherNameBng: "",
    motherNameEng: "",
    motherNameBng: "",
    nid: "",
    dob: "",
    gender: "Male",
    religion: "Islam",
    blood: "B (+ve)",
    presVillageEng: "",
    presVillageBng: "",
    presRoad: "",
    presDistrict: "Dhaka",
    presDivision: "Dhaka",
    presUpazila: "Mirpur",
    presPostOffice: "Mirpur-12",
  });

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
    mobileAllowance: "0",
    internetAllowance: "",
    utilityAllowance: "",
    allowanceOption: "OverTime",
    attendanceBonusRate: "425",
    holidayRate: "0",
    behaviorBonus: "100",
    transportAllowance: "0",
    lunchAllowance: "0",

    // 3. Salary & Bank Details
    bankPay: "",
    cashPay: "",
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
      attachmentId: "",
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
      attachmentId: "",
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
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === "attachment" && !value) {
            updated.attachmentId = "";
          }
          return updated;
        }
        return item;
      }),
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
        attachmentId: "",
      },
    ]);
  };

  const handleExpChange = (index: number, field: string, value: string) => {
    setExperienceList((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === "attachment" && !value) {
            updated.attachmentId = "";
          }
          return updated;
        }
        return item;
      }),
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

  const finalizeSave = () => {
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      let list: any[] = [];
      if (synced) {
        try {
          list = JSON.parse(synced);
        } catch (err) {
          console.error(err);
        }
      }

      // Map the form state to match personnel-list structure
      const newEmp = {
        id: form.id,
        offcId: form.offcId || "—",
        name: form.nameEng,
        type: form.empType,
        dept: form.dept,
        sect: form.sect,
        title: form.title,
        unit: form.unit,
        line: form.line,
        grade: form.grade,
        shift: form.shift,
        joinDate: form.joinDate,
        confirmDate: form.confirmDate || "—",
        holiday: form.holiday || "—",
        blood: form.blood,
        gross: form.gross,
        basic: (parseFloat(form.gross) * 0.6).toFixed(2),
        email: form.offcEmail || "—",
        officeMob: form.offcMobile || "—",
        personalContact: form.personalContact || "—",
        gender: form.gender,
        dob: form.dob,
        status: "Working",
        empStatus: form.empStatus,
        acStatus: "Active",
        allowanceOption: form.allowanceOption,
        attendanceBonusRate: form.attendanceBonusRate,
        holidayRate: form.holidayRate,
        behaviorBonus: form.behaviorBonus,
        transportAllowance: form.transportAllowance,
        mobileAllowance: form.mobileAllowance,
        lunchAllowance: form.lunchAllowance,
        specialAllowance: form.specialAllowance,
        internetAllowance: form.internetAllowance,
        utilityAllowance: form.utilityAllowance,
        taxDeduction: form.taxDeduction,
        gratuity: form.gratuity,
        bankPay: form.bankPay,
        cashPay: form.cashPay,
        bankName: form.bankName,
        bankAccount: form.bankAccount,
        educationList: educationList,
        experienceList: experienceList,
        certifications: certifications,
        trainingList: trainingList,
        involvements: involvements,
      };
      list.push(newEmp);
      localStorage.setItem("recruitment_synced_employees", JSON.stringify(list));
    }
    setMissingAttachments(null);
    setShowSuccessModal(true);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    if (!validateFields()) {
      // Jump to the tab that has errors
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
      return;
    }

    // Collect rows that have content but are missing an attachment
    const missing: { type: "education" | "experience"; label: string }[] = [];

    educationList.forEach((edu) => {
      const hasContent = edu.degree || edu.institute || edu.passingYear || edu.resultGpa;
      if (hasContent && !edu.attachment) {
        missing.push({
          type: "education",
          label: edu.degree
            ? `${edu.degree}${edu.institute ? " — " + edu.institute : ""}`
            : edu.institute || "Unnamed Education Entry",
        });
      }
    });

    experienceList.forEach((exp) => {
      const hasContent = exp.company || exp.designation || exp.fromDate || exp.toDate;
      if (hasContent && !exp.attachment) {
        missing.push({
          type: "experience",
          label: exp.company
            ? `${exp.company}${exp.designation ? " — " + exp.designation : ""}`
            : exp.designation || "Unnamed Experience Entry",
        });
      }
    });

    if (missing.length > 0) {
      setMissingAttachments(missing);
    } else {
      finalizeSave();
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

  const parseNidText = (text: string) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    let nameEng = "";
    let nameBng = "";
    let fatherNameBng = "";
    let motherNameBng = "";
    let nid = "";
    let dob = "";
    let gender = "Male";
    let bloodGroup = "";
    let addressLines: string[] = [];

    // --- Pass 1: Extract NID Number ---
    // Only normalize digits in a scoped way (don't mutate the entire text)
    const digitNormalized = text
      .replace(/[lI]/g, "1")
      .replace(/O/g, "0")
      .replace(/S(?=\d)/g, "5");
    // NID numbers: 10, 13, or 17 digits, possibly with spaces from OCR
    const nidMatch = digitNormalized.match(/\b(\d[\d\s]{8,18}\d)\b/);
    if (nidMatch) {
      nid = nidMatch[1].replace(/\s/g, "");
      // Validate: must be 10, 13, or 17 digits
      if (![10, 13, 17].includes(nid.length)) {
        // Try to find a cleaner match
        const strictMatch = digitNormalized.match(/\b(\d{10}|\d{13}|\d{17})\b/);
        nid = strictMatch ? strictMatch[1] : nid;
      }
    }

    // --- Pass 2: Extract Date of Birth ---
    // Match "Date of Birth: 12 Jul 1999" or "12 Jul 1999" or "12-07-1999" or "1999-07-12"
    // IMPORTANT: Skip any line that says "Place of Birth" / "জন্মস্থান"
    for (const line of lines) {
      if (/(place of birth|জন্মস্থান|birthplace)/i.test(line)) continue;

      // "Date of Birth: 12 Jul 1999" pattern
      if (/(date of birth|dob|birth date|জন্ম তারিখ)/i.test(line)) {
        const afterColon = line.split(/[:]\s*/);
        if (afterColon.length > 1) {
          const dateStr = afterColon.slice(1).join(":").trim();
          if (dateStr.length > 3) dob = dateStr;
        }
        if (!dob) {
          // Try to find a date pattern within the line itself
          const inlineDate = line.match(/(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})/);
          if (inlineDate) dob = inlineDate[1];
        }
        continue;
      }

      // Standalone date formats (if DOB label wasn't found)
      if (!dob) {
        const standaloneDate = line.match(/^(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})$/);
        if (standaloneDate) dob = standaloneDate[1];
      }
    }

    // --- Pass 3: Extract structured fields line by line ---
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLower = line.toLowerCase();

      // === Name (English) ===
      // "Name: TAHMID AFSAR" — must NOT contain father/mother/spouse keywords
      if (
        /(^name\b|^nane\b|^mame\b)/i.test(lineLower) &&
        !/(father|mother|spouse|পিতা|মাতা)/i.test(lineLower)
      ) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1 && parts.slice(1).join(":").trim().length > 1) {
          nameEng = parts.slice(1).join(":").trim();
        } else if (i + 1 < lines.length && /^[A-Z\s\.]+$/.test(lines[i + 1].trim())) {
          nameEng = lines[i + 1].trim();
        }
      }

      // === Name (Bangla) ===
      // "নাম: তাহমিদ আফসার" — must NOT be on a line that also says পিতা or মাতা
      if (/নাম/.test(line) && !/(পিতা|মাতা|স্বামী|স্ত্রী)/.test(line)) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1 && parts.slice(1).join(":").trim().length > 1) {
          nameBng = parts.slice(1).join(":").trim();
        } else if (i + 1 < lines.length) {
          nameBng = lines[i + 1].trim();
        }
      }

      // === Father's Name (Bangla) ===
      // "পিতা: আফসার উদ্দিন বাবুল"
      if (/পিতা/.test(line)) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1 && parts.slice(1).join(":").trim().length > 1) {
          fatherNameBng = parts.slice(1).join(":").trim();
        } else if (i + 1 < lines.length) {
          fatherNameBng = lines[i + 1].trim();
        }
      }

      // === Mother's Name (Bangla) ===
      // "মাতা: মিসেস শাহীন আফসার"  or "মাতা:মিসেস শাহীন আফসার" (no space after colon)
      if (/মাতা/.test(line)) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1 && parts.slice(1).join(":").trim().length > 1) {
          motherNameBng = parts.slice(1).join(":").trim();
        } else if (i + 1 < lines.length) {
          motherNameBng = lines[i + 1].trim();
        }
      }

      // === Address (Bangla / English) ===
      // NID address is multi-line. Start capturing from "ঠিকানা:" and grab continuation lines.
      if (/(ঠিকানা|address)/i.test(line)) {
        const parts = line.split(/ঠিকানা[:]\s*/i);
        let addrStart = "";
        if (parts.length > 1) {
          addrStart = parts.slice(1).join(":").trim();
        } else {
          const engParts = line.split(/address[:]\s*/i);
          if (engParts.length > 1) addrStart = engParts.slice(1).join(":").trim();
        }
        if (addrStart) addressLines.push(addrStart);

        // Grab continuation lines (lines that look like address fragments, not new key-value pairs)
        for (let j = i + 1; j < lines.length && j <= i + 4; j++) {
          const nextLine = lines[j];
          // Stop if we hit a new labeled field
          if (
            /(^name|^নাম|^পিতা|^মাতা|^date|^জন্ম|^blood|^রক্তের|^id\s*no|^national)/i.test(nextLine)
          )
            break;
          // Address continuation lines typically contain: numbers, commas, Bengali place names
          if (nextLine.length > 3) {
            addressLines.push(nextLine);
          }
        }
      }

      // === Blood Group ===
      if (/(blood|রক্তের)/i.test(line)) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1) {
          let bg = parts.slice(1).join(":").trim().toUpperCase().replace(/\s/g, "");
          // Check AB first (before A/B to avoid partial matches)
          if (bg.includes("AB+") || bg.includes("AB(+")) bloodGroup = "AB (+ve)";
          else if (bg.includes("AB-") || bg.includes("AB(-")) bloodGroup = "AB (-ve)";
          else if (bg.includes("A+") || bg.includes("A(+")) bloodGroup = "A (+ve)";
          else if (bg.includes("A-") || bg.includes("A(-")) bloodGroup = "A (-ve)";
          else if (bg.includes("B+") || bg.includes("B(+")) bloodGroup = "B (+ve)";
          else if (bg.includes("B-") || bg.includes("B(-")) bloodGroup = "B (-ve)";
          else if (bg.includes("O+") || bg.includes("O(+")) bloodGroup = "O (+ve)";
          else if (bg.includes("O-") || bg.includes("O(-")) bloodGroup = "O (-ve)";
        }
      }

      // === Gender ===
      if (/(female|মহিলা)/i.test(line)) {
        gender = "Female";
      }
    }

    // --- Pass 4: Fallback strategies ---

    // Name English fallback: look for an ALL CAPS line that's not a known label
    if (!nameEng) {
      const allCapsLine = lines.find(
        (l) =>
          /^[A-Z][A-Z\s\.]{4,}$/.test(l.trim()) &&
          !/(FATHER|MOTHER|BLOOD|NID|DATE|BIRTH|GOVERNMENT|REPUBLIC|NATIONAL|CARD|BANGLADESH)/i.test(
            l,
          ),
      );
      if (allCapsLine) nameEng = allCapsLine.trim();
    }

    // Mother's Name Bangla fallback: On Smart Cards, মাতা name appears on the line AFTER "Date of Birth"
    if (!motherNameBng) {
      const dobLineIdx = lines.findIndex(
        (l) => /(date of birth|dob|জন্ম তারিখ)/i.test(l) && !/(place|জন্মস্থান)/i.test(l),
      );
      if (dobLineIdx !== -1 && dobLineIdx + 1 < lines.length) {
        const nextLine = lines[dobLineIdx + 1].trim();
        // Make sure it's not another known field
        if (
          nextLine.length > 3 &&
          !/(id|nid|blood|address|ঠিকানা|রক্তের|national|\d{5,})/i.test(nextLine)
        ) {
          motherNameBng = nextLine;
        }
      }
    }

    // DOB fallback: if still not found, try to find any date-like pattern in the entire text
    if (!dob) {
      const anyDate = text.match(/(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})/);
      if (anyDate) dob = anyDate[1];
    }

    // --- Pass 5: Normalize DOB to YYYY-MM-DD ---
    if (dob) {
      const monthMap: Record<string, string> = {
        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        aug: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dec: "12",
        january: "01",
        february: "02",
        march: "03",
        april: "04",
        june: "06",
        july: "07",
        august: "08",
        september: "09",
        october: "10",
        november: "11",
        december: "12",
      };
      // "12 Jul 1999" or "12-Jul-1999"
      const match1 = dob.match(/(\d{1,2})[\s\-\/]+([a-zA-Z]{3,})[\s\-\/]+(\d{4})/);
      // "1999-07-12" (ISO format)
      const match2 = dob.match(/(\d{4})[\s\-\/]+(\d{1,2})[\s\-\/]+(\d{1,2})/);
      // "12-07-1999" or "12/07/1999"
      const match3 = dob.match(/(\d{1,2})[\-\/](\d{1,2})[\-\/](\d{4})/);

      if (match1) {
        const day = match1[1].padStart(2, "0");
        const monthKey = match1[2].toLowerCase().substring(0, 3);
        const month = monthMap[monthKey] || monthMap[match1[2].toLowerCase()] || "01";
        const year = match1[3];
        dob = `${year}-${month}-${day}`;
      } else if (match2) {
        dob = `${match2[1]}-${match2[2].padStart(2, "0")}-${match2[3].padStart(2, "0")}`;
      } else if (match3) {
        dob = `${match3[3]}-${match3[2].padStart(2, "0")}-${match3[1].padStart(2, "0")}`;
      } else {
        // Last resort: try native Date parsing
        const dObj = new Date(dob);
        if (!isNaN(dObj.getTime())) {
          const offset = dObj.getTimezoneOffset() * 60000;
          dob = new Date(dObj.getTime() - offset).toISOString().slice(0, 10);
        } else {
          dob = ""; // Unparseable, clear it
        }
      }
    }

    // --- Pass 6: Clean and assemble the full address ---
    const fullAddress = addressLines.join(", ").replace(/,\s*,/g, ",").replace(/\s+/g, " ").trim();

    // --- Final: Clean output values ---
    // For English name: strip the "Name:" prefix if it slipped through and remove non-latin chars
    const cleanEngName = (val: string) =>
      val
        .replace(/(name|nane|mame)[:\-\s]*/gi, "")
        .replace(/[^a-zA-Z\s\.]/g, "")
        .trim();
    const cleanBngLabel = (val: string, label: string) =>
      val.replace(new RegExp(`${label}[:\\-\\s]*`, "ig"), "").trim();

    return {
      nameEng: cleanEngName(nameEng) || "",
      nameBng: cleanBngLabel(nameBng, "নাম") || "",
      fatherNameEng: "", // Not typically on Bangladeshi Smart Card front/back
      fatherNameBng: cleanBngLabel(fatherNameBng, "পিতা") || "",
      motherNameEng: "", // Not typically on Bangladeshi Smart Card front/back
      motherNameBng: cleanBngLabel(motherNameBng, "মাতা") || "",
      blood: bloodGroup || "",
      nid: nid || "",
      dob: dob || "",
      gender,
      religion: "Islam",
      presVillageEng: fullAddress || "",
      presVillageBng: fullAddress || "",
      presRoad: "",
      presDistrict: "",
      presDivision: "",
      presUpazila: "",
      presPostOffice: "",
    };
  };

  const handleRealNidUpload = async () => {
    if (!nidFrontImage) return;

    setIsNidScanning(true);
    setNidScanProgress(5);
    setNidScanStep(1); // Initializing

    try {
      // Image Optimization (Downscaling)
      const resizeImage = (f: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const reader = new FileReader();
          reader.onload = (e) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let width = img.width;
              let height = img.height;
              const maxDim = 1024;

              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", 0.9));
              } else {
                resolve(e.target?.result as string);
              }
            };
            if (typeof e.target?.result === "string") {
              img.src = e.target.result;
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
      };

      const processFile = async (file: File) => {
        const optimizedImageBase64 = await resizeImage(file);
        const formData = new FormData();
        formData.append("apikey", "K85293260888957");
        formData.append("base64Image", optimizedImageBase64);
        formData.append("language", "ben");
        formData.append("detectOrientation", "true");
        formData.append("scale", "true");
        formData.append("OCREngine", "3");

        const res = await fetch("https://api.ocr.space/parse/image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data && data.ParsedResults && data.ParsedResults.length > 0) {
          return data.ParsedResults[0].ParsedText || "";
        } else if (data && data.ErrorMessage) {
          throw new Error(
            Array.isArray(data.ErrorMessage) ? data.ErrorMessage.join(", ") : data.ErrorMessage,
          );
        }
        return "";
      };

      setNidScanProgress(15);
      setNidScanStep(2); // Optimizing Images

      setNidScanProgress(30);
      setNidScanStep(3); // Uploading & Extracting Front Side
      let combinedText = await processFile(nidFrontImage);

      if (nidBackImage) {
        setNidScanProgress(55);
        setNidScanStep(3); // Uploading & Extracting Back Side
        const backText = await processFile(nidBackImage);
        combinedText += "\n" + backText;
      }

      setNidScanProgress(80);
      setNidScanStep(4); // Structuring fields

      if (!combinedText || combinedText.trim() === "") {
        throw new Error("Could not extract any text. Please ensure the image is clear.");
      }

      setNidScanProgress(100);

      setTimeout(() => {
        setIsNidScanning(false);
        const extracted = parseNidText(combinedText);
        setExtractedNid(extracted);
        setRawOcrText(combinedText);
        setShowNidScannerModal(false);
        setShowNidOcrModal(true);
      }, 400);
    } catch (err: any) {
      console.error("OCR Scanning failed: ", err);
      setNidScanProgress(100);
      setTimeout(() => {
        setIsNidScanning(false);
        setExtractedNid({
          nameEng: "Upload Completed",
          nameBng: "",
          fatherNameEng: "",
          fatherNameBng: "",
          motherNameEng: "",
          motherNameBng: "",
          nid: "",
          dob: "",
          gender: "Male",
          religion: "Islam",
          blood: "B (+ve)",
          presVillageEng: "",
          presVillageBng: "",
          presRoad: "",
          presDistrict: "Dhaka",
          presDivision: "Dhaka",
          presUpazila: "Mirpur",
          presPostOffice: "Mirpur-12",
        });
        setRawOcrText(
          `OCR Error: ${err?.message || "Unknown error"}\n\nModal loaded in safe input mode. Please enter the details manually below.`,
        );
        setShowNidScannerModal(false);
        setShowNidOcrModal(true);
      }, 400);
    }
  };

  const handleAutofill = () => {
    setForm((prev) => ({
      ...prev,
      nameEng: extractedNid.nameEng,
      nameBng: extractedNid.nameBng,
      fatherNameEng: extractedNid.fatherNameEng,
      fatherNameBng: extractedNid.fatherNameBng,
      motherNameEng: extractedNid.motherNameEng,
      motherNameBng: extractedNid.motherNameBng,
      nid: extractedNid.nid,
      dob: extractedNid.dob,
      gender: extractedNid.gender,
      religion: extractedNid.religion,
      blood: extractedNid.blood,
      presVillageEng: extractedNid.presVillageEng,
      presVillageBng: extractedNid.presVillageBng,
      presRoad: extractedNid.presRoad,
      presDistrict: extractedNid.presDistrict,
      presDivision: extractedNid.presDivision,
      presUpazila: extractedNid.presUpazila,
      presPostOffice: extractedNid.presPostOffice,
      permVillageEng: extractedNid.presVillageEng,
      permVillageBng: extractedNid.presVillageBng,
      permRoad: extractedNid.presRoad,
      permDistrict: extractedNid.presDistrict,
      permDivision: extractedNid.presDivision,
      permUpazila: extractedNid.presUpazila,
      permPostOffice: extractedNid.presPostOffice,
      sameAsPresent: true,
      nidScan: nidFrontImage
        ? `uploaded_real_nid.jpg`
        : `mock_nid_ocr_${extractedNid.nameEng.toLowerCase().replace(/ /g, "_")}.jpg`,
    }));
    setShowNidOcrModal(false);
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
          form.picture,
          form.signature,
          form.nidScan,
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
        const verScore = Math.round((verFilled / verFields.length) * 70);

        const otherScore = otherDocs.length > 0 ? 30 : 0;
        return Math.min(100, verScore + otherScore);
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
          form.fatherNameEng,
          form.fatherNameBng,
          form.motherNameEng,
          form.motherNameBng,
          form.nid,
          form.spouseNameEng,
          form.spouseNameBng,
          form.spouseNid,
          form.spouseContactNo,
          form.picture,
          form.signature,
          form.nidScan,
        ];
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
          <div className="bg-card border border-border/80 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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

          {/* ===== FORM DIRECTORIES + FORM BODY ===== */}
          {/* ===== FORM DIRECTORIES + FORM BODY ===== */}
          {/* ===== HORIZONTAL PROFILE COMPLETION CARD ===== */}
          <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
            {/* Top bar: Overall progress + label */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20 border border-border/30 rounded-xl p-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">
                  Profile Completion Status
                </span>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <Info className="size-3 text-primary shrink-0" />
                  <span>
                    Fields marked with <span className="text-rose-500 font-bold">*</span> are
                    mandatory for validation.
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="relative size-12 flex items-center justify-center shrink-0 bg-card rounded-full border border-border/30 shadow-2xs">
                  <svg className="size-full transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      className="stroke-muted/40"
                      strokeWidth="3"
                      fill="transparent"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      className="stroke-primary transition-all duration-500"
                      strokeWidth="3.5"
                      strokeDasharray={125.6}
                      strokeDashoffset={125.6 - (125.6 * overallPercentage) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-primary">
                    {overallPercentage}%
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-foreground">Overall Progress</span>
                  <span className="text-[10px] text-muted-foreground block">
                    Completed {TABS.filter((t) => isTabCompleted(t.id)).length} of {TABS.length}{" "}
                    sections
                  </span>
                </div>
              </div>
            </div>

            {/* Horizontal scrollable tab row / Grid on large screens */}
            <div className="overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <div className="grid grid-cols-5 gap-2.5 min-w-[760px] md:min-w-0">
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
                      className={`group text-left p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[96px] cursor-pointer hover:-translate-y-0.5 ${
                        isActive
                          ? "bg-primary/8 border-primary/45 shadow-xs"
                          : "bg-card border-border/80 hover:border-primary/20 hover:bg-muted/10"
                      }`}
                    >
                      {/* Top part: Icon + step indicator */}
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                          Step 0{idx + 1}
                        </span>
                        <div
                          className={`size-6 rounded-md flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : completed
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {completed && !isActive ? (
                            <Check className="size-3.5 stroke-[3]" />
                          ) : (
                            <TabIcon className="size-3.5" />
                          )}
                        </div>
                      </div>

                      {/* Label */}
                      <div className="mt-2.5">
                        <span
                          className={`block text-[11px] font-black leading-tight truncate ${isActive ? "text-primary" : "text-foreground"}`}
                        >
                          {tab.label}
                        </span>
                      </div>

                      {/* Section progress */}
                      <div className="mt-2.5 w-full flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden border border-border/10">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              percentage === 100
                                ? "bg-emerald-500"
                                : percentage > 40
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span
                          className={`text-[9px] font-black shrink-0 ${
                            isActive
                              ? "text-primary"
                              : percentage === 100
                                ? "text-emerald-500"
                                : percentage > 40
                                  ? "text-amber-500"
                                  : "text-rose-500"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-0">
            {/* Core Form Card Section - full width */}
            <div className="bg-card border border-border/80 rounded-lg p-6 md:p-8 shadow-xs min-h-[600px] flex flex-col gap-6">
              {/* TAB 1: PERSONAL & IDENTITY (CONSOLIDATED) */}
              {activeTab === "personal_identity" && (
                <div className="space-y-6 animate-in fade-in duration-200 text-foreground">
                  {/* Premium, High-fidelity Progress Stepper Timeline */}
                  <div className="bg-card border border-border/60 rounded-lg p-5 shadow-xs overflow-x-auto scrollbar-thin">
                    <div className="min-w-[650px] relative flex items-center justify-between px-6 py-3">
                      {/* Horizontal connecting track line behind the dots */}
                      <div className="absolute top-[26px] left-[55px] right-[55px] h-[3px] bg-muted/60 border-t border-b border-border/20 z-0" />

                      {[
                        {
                          id: "primary_placement",
                          label: "Placement",
                          icon: User,
                          desc: "Personal, Job & IDs",
                        },
                        {
                          id: "address_contact",
                          label: "Contact",
                          icon: MapPin,
                          desc: "Reachability",
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
                      {/* AI NID OCR Scanner Widget */}
                      <div className="bg-card border border-border/80 rounded-xl p-5 md:p-6 shadow-xs relative overflow-hidden transition-all duration-300 hover:border-primary/20 bg-gradient-to-br from-card to-primary/5">
                        <div className="absolute top-0 right-0 p-3 opacity-[0.03] text-primary pointer-events-none">
                          <Cpu className="size-24" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                          <div className="space-y-1.5 max-w-xl">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
                              <Sparkles className="size-3" /> AI Smart Utility
                            </div>
                            <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                              Autofill with Smart Document Scan
                            </h3>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              Upload a scanned copy or picture of your National ID, Passport, Birth
                              Certificate, or Driving License. Our smart AI extractor will instantly
                              parse your name, parent details, date of birth, document number,
                              gender, and addresses so you don't have to enter them manually.
                            </p>
                          </div>

                          {/* Control Panel */}
                          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={() => setShowNidScannerModal(true)}
                              className="h-10 px-6 rounded-xl text-xs font-black shadow-lg bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                              <Scan className="size-4 group-hover:rotate-12 transition-transform" />{" "}
                              Open Smart Scanner
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card 1: Core Specifications */}
                      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-emerald-500/20">
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

                          {/* Father Name (English) */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Father Name (English)
                            </label>
                            <input
                              type="text"
                              value={form.fatherNameEng}
                              onChange={(e) => handleChange("fatherNameEng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                              placeholder="Father's Legal Name"
                            />
                          </div>

                          {/* Father Name (Bengali) */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Father Name (Bengali)
                            </label>
                            <input
                              type="text"
                              value={form.fatherNameBng}
                              onChange={(e) => handleChange("fatherNameBng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                              placeholder="উদা: পিতার নাম"
                            />
                          </div>

                          {/* Mother Name (English) */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Mother Name (English)
                            </label>
                            <input
                              type="text"
                              value={form.motherNameEng}
                              onChange={(e) => handleChange("motherNameEng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                              placeholder="Mother's Legal Name"
                            />
                          </div>

                          {/* Mother Name (Bengali) */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">
                              Mother Name (Bengali)
                            </label>
                            <input
                              type="text"
                              value={form.motherNameBng}
                              onChange={(e) => handleChange("motherNameBng", e.target.value)}
                              className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                              placeholder="উদা: মাতার নাম"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Corporate Placement Mapping */}
                      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-indigo-500/20">
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

                      {/* Card 3: Legal Identification Credentials */}
                      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-violet-500/20">
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

                      {/* Card 4: Matrimonial & Spouse Information */}
                      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-amber-500/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-amber-500" />
                        <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-5">
                          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                            <Users className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                              Matrimonial Context
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              Matrimonial registry and primary spouse details.
                            </p>
                          </div>
                        </div>

                        {form.maritalStatus === "Married" ? (
                          <div className="space-y-4 animate-in slide-in-from-top-3 duration-250">
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
                          <div className="p-3 rounded-xl bg-muted/20 border border-border/30 text-[11px] text-muted-foreground flex items-center gap-2">
                            <Info className="size-4 text-muted-foreground/60" />
                            <span>
                              Spouse information fields are hidden because Marital Status is set to{" "}
                              <strong>{form.maritalStatus || "Single"}</strong>.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card 5: Scans & Uploads */}
                      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-blue-500/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500" />
                        <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-5">
                          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <Camera className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                              Document & Image Uploads
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              Upload portraits, signatures, and ID card scans.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Portrait Upload */}
                          <div className="border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]">
                            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                              <User className="size-6" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                                Employee Portrait
                              </h4>
                              <p className="text-[10px] text-muted-foreground">
                                Premium front portrait. Max 2MB.
                              </p>
                            </div>

                            {uploadProgress.picture !== undefined &&
                              uploadProgress.picture < 100 && (
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
                                <Upload className="size-3.5" /> Upload Photo
                              </button>
                            )}
                          </div>

                          {/* Signature Upload */}
                          <div className="border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]">
                            <div className="size-14 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                              <FileSignature className="size-6" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                                Authorized Signature
                              </h4>
                              <p className="text-[10px] text-muted-foreground">
                                Digital signature scan. Max 1MB.
                              </p>
                            </div>

                            {uploadProgress.signature !== undefined &&
                              uploadProgress.signature < 100 && (
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
                                <Upload className="size-3.5" /> Upload Signature
                              </button>
                            )}
                          </div>

                          {/* NID Card Scan */}
                          <div className="border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]">
                            <div className="size-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                              <FileText className="size-6" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                                National ID Card Scan
                              </h4>
                              <p className="text-[10px] text-muted-foreground">
                                Scanned NID (both sides). Max 4MB.
                              </p>
                            </div>

                            {uploadProgress.nidScan !== undefined &&
                              uploadProgress.nidScan < 100 && (
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
                                <Upload className="size-3.5" /> Upload NID Scan
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom action bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Progress saved. Exiting...");
                              window.location.href = "/";
                            }}
                            className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                          >
                            Save and Exit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Progress saved as draft successfully!");
                            }}
                            className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                          >
                            Save as Draft
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("address_contact");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Next Section <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUBSECTION: CONTACT & RESIDENCY */}
                  {subSection === "address_contact" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Card 5: Residential Address Directory */}
                      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-rose-500/20">
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
                              {" "}
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
                              <div className="h-[318px] border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 gap-3 bg-muted/5">
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
                      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-sky-500/20">
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
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Progress saved. Exiting...");
                              window.location.href = "/";
                            }}
                            className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                          >
                            Save and Exit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Progress saved as draft successfully!");
                            }}
                            className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                          >
                            Save as Draft
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("emergency_contact");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Next Section <ArrowRight className="size-4" />
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
                      <div className="lg:col-span-7 space-y-5 bg-card border border-border/60 rounded-lg p-5 shadow-2xs">
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
                      <div className="lg:col-span-5 space-y-5 bg-card border border-border/60 rounded-lg p-5 shadow-2xs flex flex-col justify-between">
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

                  {/* Custom Allowance Section matching Client Requirements */}
                  <div className="bg-card border border-border/60 rounded-lg p-5 shadow-2xs space-y-4">
                    <div className="border-b border-border/30 pb-2.5 flex items-center gap-2">
                      <h3 className="text-xs font-extrabold text-[#7cb342] uppercase tracking-widest">
                        Allowance
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                      {/* Allowance Option */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Allowance Option
                        </label>
                        <select
                          value={form.allowanceOption}
                          onChange={(e) => handleChange("allowanceOption", e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-border/60 pb-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-[#7cb342] focus:ring-0 cursor-pointer"
                        >
                          <option value="N/A">N/A</option>
                          <option value="OverTime">OverTime</option>
                          <option value="Fixed OverTime">Fixed OverTime</option>
                          <option value="OverTime + Fixed OverTime">OverTime + Fixed OverTime</option>
                          <option value="Allowance">Allowance</option>
                          <option value="Not Allowed">Not Allowed</option>
                        </select>
                      </div>

                      {/* Attendance Bonus Rate */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Attendance Bonus Rate
                        </label>
                        <input
                          type="number"
                          value={form.attendanceBonusRate}
                          onChange={(e) => handleChange("attendanceBonusRate", e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-border/60 pb-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-[#7cb342] focus:ring-0 font-mono"
                          placeholder="0"
                        />
                      </div>

                      {/* Holiday Rate */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Holiday Rate
                        </label>
                        <input
                          type="number"
                          value={form.holidayRate}
                          onChange={(e) => handleChange("holidayRate", e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-border/60 pb-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-[#7cb342] focus:ring-0 font-mono"
                          placeholder="0"
                        />
                      </div>

                      {/* Behavior Bonus */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Behavior Bonus
                        </label>
                        <input
                          type="number"
                          value={form.behaviorBonus}
                          onChange={(e) => handleChange("behaviorBonus", e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-border/60 pb-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-[#7cb342] focus:ring-0 font-mono"
                          placeholder="0"
                        />
                      </div>

                      {/* Transport Allownce */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Transport Allownce
                        </label>
                        <input
                          type="number"
                          value={form.transportAllowance}
                          onChange={(e) => handleChange("transportAllowance", e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-border/60 pb-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-[#7cb342] focus:ring-0 font-mono"
                          placeholder="0"
                        />
                      </div>

                      {/* Mobile Allownce */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Mobile Allownce
                        </label>
                        <input
                          type="number"
                          value={form.mobileAllowance}
                          onChange={(e) => handleChange("mobileAllowance", e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-border/60 pb-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-[#7cb342] focus:ring-0 font-mono"
                          placeholder="0"
                        />
                      </div>

                      {/* Lunch Allownce */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Lunch Allownce
                        </label>
                        <input
                          type="number"
                          value={form.lunchAllowance}
                          onChange={(e) => handleChange("lunchAllowance", e.target.value)}
                          className="w-full bg-transparent border-t-0 border-x-0 border-b border-border/60 pb-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-[#7cb342] focus:ring-0 font-mono"
                          placeholder="0"
                        />
                      </div>
                      
                      {/* Empty column spacer */}
                      <div className="hidden sm:block" />
                    </div>
                  </div>

                  {/* Disbursement Routing (Bank Details) */}
                  <div className="space-y-5 bg-card border border-border/60 rounded-lg p-5 shadow-2xs">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Bank Pay
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                            ৳
                          </span>
                          <input
                            type="number"
                            value={form.bankPay}
                            onChange={(e) => handleChange("bankPay", e.target.value)}
                            className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold font-mono w-full focus:outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Cash Pay
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">
                            ৳
                          </span>
                          <input
                            type="number"
                            value={form.cashPay}
                            onChange={(e) => handleChange("cashPay", e.target.value)}
                            className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold font-mono w-full focus:outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={form.bankName}
                          onChange={(e) => handleChange("bankName", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full focus:outline-none"
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
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono focus:outline-none"
                          placeholder="e.g. 102.120.99827"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wizard Step Navigation Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("career_qualifications");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Next Section <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: QUALIFICATIONS & EXPERIENCE (SINGLE-PAGE COLLAPSIBLE SECTIONS) */}
              {activeTab === "career_qualifications" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-2">
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Qualifications, Experience & Credentials
                    </h2>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Add academic qualifications, prior work history, certifications, training, and
                      involvements.
                    </p>
                  </div>

                  {/* 1. ACADEMIC QUALIFICATIONS */}
                  <div className="bg-card border border-border/60 rounded-lg overflow-hidden transition-all duration-300 hover:border-border">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((prev) => ({ ...prev, academic: !prev.academic }))
                      }
                      className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition duration-200 border-b border-border/40 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <GraduationCap className="size-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                            Academic Credentials
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-muted/80 text-muted-foreground">
                            {educationList.length} Added
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-300 ${openSections.academic ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openSections.academic && (
                      <div className="p-4 space-y-4 animate-in fade-in duration-200">
                        <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30 backdrop-blur-xs">
                          <table className="w-full border-collapse text-left text-xs">
                            <thead>
                              <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                                <th className="px-4 py-3 min-w-[200px]">Degree / Exam Title</th>
                                <th className="px-4 py-3">Institution Name</th>
                                <th className="px-4 py-3 w-[100px] text-center">Passing Year</th>
                                <th className="px-4 py-3 w-[100px] text-center">Result / GPA</th>
                                <th className="px-4 py-3 w-[170px] text-center">
                                  Attachment (Optional)
                                </th>
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
                                        {
                                          value: "Secondary (SSC)",
                                          label: "Secondary School (SSC)",
                                        },
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
                                        {
                                          value: "MBA / Post Grad",
                                          label: "Executive MBA / Post Grad",
                                        },
                                        {
                                          value: "PhD / Doctorate",
                                          label: "PhD / Doctorate Degree",
                                        },
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
                                    {uploadingState && uploadingState.listType === "education" && uploadingState.index === index ? (
                                      <div className="w-[130px] mx-auto space-y-1">
                                        <div className="flex justify-between text-[8px] font-bold text-primary">
                                          <span>Uploading...</span>
                                          <span>{uploadingState.progress}%</span>
                                        </div>
                                        <div className="w-full bg-muted-foreground/10 rounded-full h-1">
                                          <div 
                                            className="bg-primary h-1 rounded-full transition-all duration-100" 
                                            style={{ width: `${uploadingState.progress}%` }}
                                          />
                                        </div>
                                      </div>
                                    ) : edu.attachment ? (
                                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg gap-1.5 max-w-[150px] mx-auto animate-in fade-in duration-200">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const parts = edu.attachment.split(" (");
                                            setPreviewFile({
                                              name: parts[0],
                                              size: parts[1]?.replace(")", "") || "Unknown",
                                              type: parts[0].split(".").pop() || "pdf"
                                            });
                                          }}
                                          className="text-[9px] font-mono font-bold text-emerald-600 truncate hover:underline text-left flex items-center gap-1 cursor-pointer"
                                          title="Click to preview file"
                                        >
                                          <FileText className="size-3 text-emerald-600 shrink-0" />
                                          <span className="truncate max-w-[90px]">{edu.attachment.split(" (")[0]}</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleEduChange(index, "attachment", "")}
                                          className="text-rose-500 hover:text-rose-600 font-black text-[10px] shrink-0 cursor-pointer"
                                          title="Remove certificate attachment"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleRowFileUpload("education", index)}
                                        className="h-7 px-2.5 rounded-lg border border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition duration-200 cursor-pointer"
                                      >
                                        <Upload className="size-3 text-primary/75" /> Upload File
                                      </button>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEducationList((prev) =>
                                          prev.filter((_, i) => i !== index),
                                        )
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
                                    No academic credentials logged yet. Click the button below to
                                    add your first qualification.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-start">
                          <button
                            type="button"
                            onClick={addEduRow}
                            className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <Plus className="size-3.5" /> Add Academic Qualification
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. PRIOR JOB EXPERIENCE */}
                  <div className="bg-card border border-border/60 rounded-lg overflow-hidden transition-all duration-300 hover:border-border">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((prev) => ({ ...prev, experience: !prev.experience }))
                      }
                      className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition duration-200 border-b border-border/40 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <History className="size-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                            Prior Job Experience
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-muted/80 text-muted-foreground">
                            {experienceList.length} Added
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-300 ${openSections.experience ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openSections.experience && (
                      <div className="p-4 space-y-4 animate-in fade-in duration-200">
                        <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30 backdrop-blur-xs">
                          <table className="w-full border-collapse text-left text-xs">
                            <thead>
                              <tr className="bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                                <th className="px-4 py-3">Organization / Company</th>
                                <th className="px-4 py-3">Designation</th>
                                <th className="px-4 py-3 w-[120px] text-center">From Date</th>
                                <th className="px-4 py-3 w-[120px] text-center">To Date</th>
                                <th className="px-4 py-3">Reason for Leaving</th>
                                <th className="px-4 py-3 w-[170px] text-center">
                                  Attachment (Optional)
                                </th>
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
                                      onChange={(e) =>
                                        handleExpChange(index, "company", e.target.value)
                                      }
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
                                      onChange={(e) =>
                                        handleExpChange(index, "fromDate", e.target.value)
                                      }
                                      className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary"
                                    />
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    <input
                                      type="date"
                                      value={exp.toDate}
                                      onChange={(e) =>
                                        handleExpChange(index, "toDate", e.target.value)
                                      }
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
                                    {uploadingState && uploadingState.listType === "experience" && uploadingState.index === index ? (
                                      <div className="w-[130px] mx-auto space-y-1">
                                        <div className="flex justify-between text-[8px] font-bold text-primary">
                                          <span>Uploading...</span>
                                          <span>{uploadingState.progress}%</span>
                                        </div>
                                        <div className="w-full bg-muted-foreground/10 rounded-full h-1">
                                          <div 
                                            className="bg-primary h-1 rounded-full transition-all duration-100" 
                                            style={{ width: `${uploadingState.progress}%` }}
                                          />
                                        </div>
                                      </div>
                                    ) : exp.attachment ? (
                                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg gap-1.5 max-w-[150px] mx-auto animate-in fade-in duration-200">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const parts = exp.attachment.split(" (");
                                            setPreviewFile({
                                              name: parts[0],
                                              size: parts[1]?.replace(")", "") || "Unknown",
                                              type: parts[0].split(".").pop() || "pdf"
                                            });
                                          }}
                                          className="text-[9px] font-mono font-bold text-emerald-600 truncate hover:underline text-left flex items-center gap-1 cursor-pointer"
                                          title="Click to preview file"
                                        >
                                          <FileText className="size-3 text-emerald-600 shrink-0" />
                                          <span className="truncate max-w-[90px]">{exp.attachment.split(" (")[0]}</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleExpChange(index, "attachment", "")}
                                          className="text-rose-500 hover:text-rose-600 font-black text-[10px] shrink-0 cursor-pointer"
                                          title="Remove experience attachment"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleRowFileUpload("experience", index)}
                                        className="h-7 px-2.5 rounded-lg border border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition duration-200 cursor-pointer"
                                      >
                                        <Upload className="size-3 text-primary/75" /> Upload File
                                      </button>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExperienceList((prev) =>
                                          prev.filter((_, i) => i !== index),
                                        )
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
                                    No prior work experience logged. Click the button below to add
                                    your first job history.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-start">
                          <button
                            type="button"
                            onClick={addExpRow}
                            className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <Plus className="size-3.5" /> Add Job Experience Row
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. CERTIFICATIONS */}
                  <div className="bg-card border border-border/60 rounded-lg overflow-hidden transition-all duration-300 hover:border-border">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((prev) => ({
                          ...prev,
                          certifications: !prev.certifications,
                        }))
                      }
                      className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition duration-200 border-b border-border/40 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Award className="size-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                            Professional Certifications
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-muted/80 text-muted-foreground">
                            {certifications.length} Added
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-300 ${openSections.certifications ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openSections.certifications && (
                      <div className="p-4 space-y-4 animate-in fade-in duration-200">
                        <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30 backdrop-blur-xs">
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
                                        setCertifications((prev) =>
                                          prev.filter((_, i) => i !== index),
                                        )
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
                                    No certification credentials added yet. Click the button below
                                    to add your first cert.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-start">
                          <button
                            type="button"
                            onClick={addCertRow}
                            className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <Plus className="size-3.5" /> Add Certification Row
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. TRAINING HISTORY */}
                  <div className="bg-card border border-border/60 rounded-lg overflow-hidden transition-all duration-300 hover:border-border">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((prev) => ({ ...prev, training: !prev.training }))
                      }
                      className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition duration-200 border-b border-border/40 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <BookOpen className="size-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                            Training Programs
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-muted/80 text-muted-foreground">
                            {trainingList.length} Added
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-300 ${openSections.training ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openSections.training && (
                      <div className="p-4 space-y-4 animate-in fade-in duration-200">
                        <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30 backdrop-blur-xs">
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
                                        setTrainingList((prev) =>
                                          prev.filter((_, i) => i !== index),
                                        )
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
                                    No training programs logged. Click the button below to add your
                                    first training record.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-start">
                          <button
                            type="button"
                            onClick={addTrainRow}
                            className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <Plus className="size-3.5" /> Add Training Program Row
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. OTHER INVOLVEMENTS */}
                  <div className="bg-card border border-border/60 rounded-lg overflow-hidden transition-all duration-300 hover:border-border">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((prev) => ({ ...prev, involvements: !prev.involvements }))
                      }
                      className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 transition duration-200 border-b border-border/40 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Users className="size-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                            Other Involvements
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-muted/80 text-muted-foreground">
                            {involvements.length} Added
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-300 ${openSections.involvements ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openSections.involvements && (
                      <div className="p-4 space-y-4 animate-in fade-in duration-200">
                        <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30 backdrop-blur-xs">
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
                                      onChange={(e) =>
                                        handleInvolChange(index, "role", e.target.value)
                                      }
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
                                        setInvolvements((prev) =>
                                          prev.filter((_, i) => i !== index),
                                        )
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
                                    No organizational involvements logged. Click the button below to
                                    add your first record.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-start">
                          <button
                            type="button"
                            onClick={addInvolRow}
                            className="h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <Plus className="size-3.5" /> Add Organizational Involvement Row
                          </button>
                        </div>
                      </div>
                    )}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-lg p-5">
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

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSubSection("references");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Next Section <ArrowRight className="size-4" />
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-lg p-5">
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
                    <div className="border border-border bg-muted/15 rounded-lg p-5 space-y-4">
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
                    <div className="border border-border bg-muted/15 rounded-lg p-5 space-y-4">
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

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("financial_employment");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Next Section <ArrowRight className="size-4" />
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
                  <div className="border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
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

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("verification_documents");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Next Section <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SUBSECTION: JOB DESCRIPTION */}
              {activeTab === "career_qualifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <FileText className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Corporate Job Description & Charter
                    </h2>
                  </div>

                  <div className="space-y-5 bg-muted/10 border border-border/30 rounded-lg p-5">
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
                  <div className="border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-lg p-5">
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

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="h-10 px-6 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-1.5 shadow-primary/20 transition-all duration-200"
                    >
                      <Save className="size-4" /> Save Employee Digital File
                    </button>
                  </div>
                </div>
              )}

              {/* SUBSECTION: EMPLOYEE EQUIPMENT */}
              {activeTab === "career_qualifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <Laptop className="size-4.5 text-primary animate-pulse" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                      Corporate Equipment & Asset Assignment
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-lg p-5">
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

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("personal_identity");
                        setSubSection("references");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Next Section <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* MISSING ATTACHMENTS WARNING MODAL */}
      {missingAttachments && missingAttachments.length > 0 && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-border/30 bg-amber-500/5">
              <div className="size-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="size-4.5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest">
                  Missing Attachment Documents
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {missingAttachments.length} credential{missingAttachments.length > 1 ? "s" : ""} without supporting document
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The following entries don't have an attached document. Since attachments are <span className="text-amber-600 font-bold">optional</span>, you can proceed without them — but documents help verify the credentials.
              </p>

              {/* Missing list grouped by type */}
              <div className="space-y-2.5">
                {/* Education group */}
                {missingAttachments.filter(m => m.type === "education").length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-indigo-500">
                      <GraduationCap className="size-3" /> Academic Credentials
                    </div>
                    <div className="space-y-1">
                      {missingAttachments.filter(m => m.type === "education").map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-500/5 border border-indigo-500/15"
                        >
                          <div className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-[10px] font-semibold text-foreground/80 truncate">{item.label}</span>
                          <span className="ml-auto shrink-0 text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                            No Doc
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience group */}
                {missingAttachments.filter(m => m.type === "experience").length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-500">
                      <Briefcase className="size-3" /> Work Experience
                    </div>
                    <div className="space-y-1">
                      {missingAttachments.filter(m => m.type === "experience").map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15"
                        >
                          <div className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-[10px] font-semibold text-foreground/80 truncate">{item.label}</span>
                          <span className="ml-auto shrink-0 text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                            No Doc
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border/30 bg-muted/20">
              <button
                type="button"
                onClick={() => {
                  setMissingAttachments(null);
                  setActiveTab("career_qualifications");
                  setOpenSections(prev => ({ ...prev, academic: true, experience: true }));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="h-9 px-4 rounded-xl border border-amber-500/40 text-amber-600 hover:bg-amber-500/10 text-[11px] font-bold flex items-center gap-1.5 transition duration-200 cursor-pointer"
              >
                <Upload className="size-3.5" /> Go Back & Attach
              </button>
              <button
                type="button"
                onClick={() => finalizeSave()}
                className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <Save className="size-3.5" /> Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATTACHMENT PREVIEW MODAL OVERLAY */}
      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 rounded-lg shadow-2xl p-5 w-full max-w-2xl overflow-hidden flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="size-4.5 text-primary animate-pulse" />
                <div>
                  <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest truncate max-w-[300px]">
                    {previewFile.name}
                  </h3>
                  <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">
                    File Size: {previewFile.size} | Type: {previewFile.type.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-bold p-1 rounded-lg hover:bg-muted/50 transition"
              >
                <X className="size-4" />
              </button>
            </div>
            
            {/* Premium Mock File Content Viewer */}
            <div className="bg-muted/30 border border-border/40 rounded-xl p-6 h-96 flex flex-col items-center justify-center relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] opacity-50" />
              
              <div className="z-10 text-center space-y-4 max-w-sm">
                <div className="size-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-md">
                  <FileText className="size-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">Secure Document Viewer</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    This is a secure local sandbox visualization of the uploaded digital file. Verification checks are automatically verified.
                  </p>
                </div>
                
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <ShieldCheck className="size-3.5" /> Checked & Secured by SAIF
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="h-9 px-4 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Downloading ${previewFile.name}...`);
                }}
                className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ADD OPTION MODAL OVERLAY */}
      {addingField && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 rounded-lg shadow-2xl p-5 w-full max-w-xl overflow-hidden flex flex-col gap-4 animate-in zoom-in-95 duration-200">
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

      {/* AI NID OCR SCANNER MODAL OVERLAY */}
      {showNidOcrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/30 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                    AI NID OCR Extracted Information
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Review and verify the details extracted from the National ID card image.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNidOcrModal(false)}
                className="size-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body - Editable Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto max-h-[65vh] pr-1.5">
              {/* Left Column: Image Preview & Raw OCR Log */}
              <div className="lg:col-span-5 space-y-4">
                {nidFrontPreview ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Camera className="size-3.5 text-primary" /> Scanned Document Previews
                    </label>
                    <div className="flex flex-col gap-3">
                      <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/20 relative aspect-video flex items-center justify-center p-1.5 shadow-sm">
                        <img
                          src={nidFrontPreview}
                          alt="Front Side"
                          className="object-contain max-h-32 w-full rounded-lg"
                        />
                      </div>
                      {nidBackPreview && (
                        <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/20 relative aspect-video flex items-center justify-center p-1.5 shadow-sm">
                          <img
                            src={nidBackPreview}
                            alt="Back Side"
                            className="object-contain max-h-32 w-full rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-border/80 rounded-xl p-4 text-center text-[10px] text-muted-foreground bg-muted/10 space-y-2">
                    <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto">
                      <Sparkles className="size-4" />
                    </div>
                    <span className="block font-bold">Mock Profiler Mode</span>
                    <span className="block text-[9px] text-muted-foreground/75">
                      Pre-populated simulation database loaded.
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Cpu className="size-3.5 text-primary" /> Raw OCR Text Console
                  </label>
                  <textarea
                    readOnly
                    value={rawOcrText}
                    className="h-60 w-full p-2.5 rounded-xl bg-muted/40 border border-border/50 text-[9px] font-mono text-muted-foreground/80 resize-none focus:outline-none scrollbar-thin"
                    placeholder="Raw scanned text log will appear here..."
                  />
                </div>
              </div>

              {/* Right Column: Editable fields */}
              <div className="lg:col-span-7 space-y-6">
                {/* Category 1: Names & Identity */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-border/20 pb-1">
                    1. Names & Identity Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Name (English)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.nameEng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, nameEng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Name (Bangla)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.nameBng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, nameBng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Father's Name (Bng)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.fatherNameBng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, fatherNameBng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Mother's Name (Bng)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.motherNameBng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, motherNameBng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Category 2: Legal Registry */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-border/20 pb-1">
                    2. National Registry & Demographics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        NID Number
                      </label>
                      <input
                        type="text"
                        value={extractedNid.nid}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, nid: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={extractedNid.dob}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, dob: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Gender
                      </label>
                      <select
                        value={extractedNid.gender}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, gender: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category 3: Address Mapping */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-border/20 pb-1">
                    3. Address Coordinates
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Village / Street (English)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.presVillageEng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, presVillageEng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-border/30 pt-4 mt-2">
              <button
                type="button"
                onClick={() => setShowNidOcrModal(false)}
                className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition duration-200"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleAutofill}
                className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-md hover:opacity-95 transition duration-200 flex items-center justify-center gap-1.5"
              >
                <Check className="size-4" /> Confirm & Autofill Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE SUCCESS DIALOG OVERLAY */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 rounded-lg shadow-2xl p-6 w-full max-w-2xl overflow-hidden flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-200">
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
      {/* NID Scanner Modal */}
      {showNidScannerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => !isNidScanning && setShowNidScannerModal(false)}
          />
          <div className="relative w-full max-w-3xl bg-card border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Scan className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                    Smart Document Scanner
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Upload both sides of the document for AI data extraction
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNidScannerModal(false)}
                disabled={isNidScanning}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 flex flex-col gap-8 bg-gradient-to-b from-transparent to-muted/10">
              {/* Document Type Selector */}
              {!isNidScanning && (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    Step 1: Select Document Type
                  </span>
                  <select
                    className="h-11 px-4 rounded-xl bg-card border border-border/60 text-sm font-bold outline-none focus:border-primary shadow-xs min-w-[280px] text-center"
                    value={scanDocumentType}
                    onChange={(e) => setScanDocumentType(e.target.value)}
                  >
                    <option value="" disabled>
                      -- Select Document --
                    </option>
                    <option value="NID">National ID (NID)</option>
                    <option value="Passport">Passport</option>
                    <option value="Birth_Certificate">Birth Certificate</option>
                    <option value="Driving_License">Driving License</option>
                  </select>
                </div>
              )}

              {/* Upload Zones */}
              {scanDocumentType && !isNidScanning && (
                <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      Step 2: Upload Images
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Front Side Upload */}
                    <div
                      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 ${nidFrontImage ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer group"}`}
                      onClick={() =>
                        !nidFrontImage && document.getElementById("modal-front-input")?.click()
                      }
                    >
                      <input
                        type="file"
                        id="modal-front-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setNidFrontImage(f);
                            setNidFrontPreview(URL.createObjectURL(f));
                          }
                        }}
                      />
                      {nidFrontPreview ? (
                        <div className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={nidFrontPreview}
                            alt="Front Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setNidFrontImage(null);
                                setNidFrontPreview(null);
                              }}
                              className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2"
                            >
                              <Trash2 className="size-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                            <Upload className="size-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Front Side</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Click to browse
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Back Side Upload */}
                    <div
                      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 ${nidBackImage ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer group"}`}
                      onClick={() =>
                        !nidBackImage && document.getElementById("modal-back-input")?.click()
                      }
                    >
                      <input
                        type="file"
                        id="modal-back-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setNidBackImage(f);
                            setNidBackPreview(URL.createObjectURL(f));
                          }
                        }}
                      />
                      {nidBackPreview ? (
                        <div className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={nidBackPreview}
                            alt="Back Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setNidBackImage(null);
                                setNidBackPreview(null);
                              }}
                              className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2"
                            >
                              <Trash2 className="size-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                            <Upload className="size-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Back Side</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Click to browse
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Scanning Animation UI */}
              {isNidScanning && (
                <div className="flex flex-col items-center justify-center py-12 w-full animate-in zoom-in-95 duration-500">
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse scale-90" />
                    <div className="relative p-8 bg-card border border-primary/30 rounded-2xl shadow-[0_0_40px_rgba(var(--primary-rgb),0.12)] flex flex-col items-center gap-6 text-center">
                      <div className="relative flex items-center justify-center size-28">
                        <svg
                          className="absolute inset-0 w-full h-full -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            className="text-muted/20 stroke-current"
                            strokeWidth="5"
                            cx="50"
                            cy="50"
                            r="44"
                            fill="transparent"
                          />
                          <circle
                            className="text-primary stroke-current transition-all duration-300 ease-in-out"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="276.46"
                            strokeDashoffset={276.46 - (276.46 * nidScanProgress) / 100}
                            cx="50"
                            cy="50"
                            r="44"
                            fill="transparent"
                          />
                        </svg>
                        <Cpu className="size-10 text-primary animate-pulse" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-black uppercase tracking-wider text-primary">
                          {nidScanStep === 1 && "Initializing AI Engine..."}
                          {nidScanStep === 2 && "Optimizing Images for Transfer..."}
                          {nidScanStep === 3 && "Running Deep-Learning OCR..."}
                          {nidScanStep === 4 && "Structuring Semantic Fields..."}
                        </h4>
                        <p className="text-xs font-bold text-muted-foreground mt-1.5">
                          {nidScanProgress}% Completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNidScannerModal(false)}
                disabled={isNidScanning}
                className="h-10 px-6 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!scanDocumentType || !nidFrontImage || isNidScanning}
                onClick={handleRealNidUpload}
                className={`h-10 px-8 rounded-xl text-xs font-black shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${!scanDocumentType || !nidFrontImage || isNidScanning ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70" : "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"}`}
              >
                {isNidScanning ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Start Scan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
