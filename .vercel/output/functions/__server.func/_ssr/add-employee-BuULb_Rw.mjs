import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar, a as SearchableSelect } from "./router-RDWYDEFA.mjs";
import { U as User, aE as DollarSign, aU as GraduationCap, b3 as Baby, V as ShieldCheck, C as ChevronRight, r as Save, a5 as Check, I as Info, q as Users, at as MapPin, av as Camera, b4 as PhoneCall, aV as Heart, t as Briefcase, ap as Trash2, A as ArrowRight, aI as ArrowLeft, i as Plus, b as CircleCheck, b5 as Mail, aL as Phone, O as CreditCard, aw as Upload, az as FilePenLine, d as FileText, b6 as Trash, b7 as History, ah as Award, a_ as BookOpen, ay as FileDown, a7 as Laptop, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
const TABS = [{
  id: "personal_identity",
  label: "Personal & Identity",
  icon: User
}, {
  id: "financial_employment",
  label: "Financial & Employment",
  icon: DollarSign
}, {
  id: "career_qualifications",
  label: "Qualifications & Experience",
  icon: GraduationCap
}, {
  id: "family_dependents",
  label: "Family & Dependents",
  icon: Baby
}, {
  id: "verification_documents",
  label: "Verification & Docs",
  icon: ShieldCheck
}];
function AddEmployeePage() {
  const [activeTab, setActiveTab] = reactExports.useState("personal_identity");
  const [isDropdownOpen, setIsDropdownOpen] = reactExports.useState(false);
  const [showSuccessModal, setShowSuccessModal] = reactExports.useState(false);
  const [subSection, setSubSection] = reactExports.useState("primary_placement");
  const [addingField, setAddingField] = reactExports.useState(null);
  const [customValue, setCustomValue] = reactExports.useState("");
  const [upazilas, setUpazilas] = reactExports.useState(["Mirpur", "Uttara", "Dhanmondi", "Gulshan"]);
  const [postOffices, setPostOffices] = reactExports.useState(["Mirpur-12", "Uttara Sector 6", "Dhanmondi-15", "Gulshan-2"]);
  const [form, setForm] = reactExports.useState({
    // Basic Info
    id: "2025" + Math.floor(1e5 + Math.random() * 9e5),
    // pre-filled system ID
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
    joinDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
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
    jobDescription: "Senior Software Engineer responsible for building high-scale payroll and HR modules using modern web technologies.",
    keyDeliverables: "Fullstack web app development, Git source code management, DB schema optimization.",
    reportingLine: "Tahmid Afsar Shapno (Head Of Department)",
    // 16. Employee Verification
    verificationStatus: "Verified",
    verifiedBy: "HR Compliance Team",
    verificationDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    verificationNotes: "All background verification checks cleared successfully, including academic credential validation and police clearance.",
    // 17. Employee Equipment
    laptopBrand: 'Apple MacBook Pro 16"',
    laptopAssetId: "COMP-2026-089",
    mobileBrand: "iPhone 15",
    mobileAssetId: "MOB-2026-112",
    accessCardId: "AC-559021",
    equipmentIssuedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  const [educationList, setEducationList] = reactExports.useState([{
    degree: "Bachelor of Science (B.Sc)",
    institute: "IIT University of Dhaka",
    passingYear: "2022",
    resultGpa: "3.85",
    attachment: ""
  }]);
  const [experienceList, setExperienceList] = reactExports.useState([{
    company: "Pakiza Software Limited",
    designation: "Software Engineer",
    fromDate: "2023-01-01",
    toDate: "2025-02-28",
    leavingReason: "Career Growth",
    attachment: ""
  }]);
  const [certifications, setCertifications] = reactExports.useState([{
    certificateName: "AWS Certified Solutions Architect",
    organization: "Amazon Web Services",
    issueDate: "2024-06-15",
    expiryDate: "2027-06-15",
    credentialId: "AWS-102938"
  }]);
  const [trainingList, setTrainingList] = reactExports.useState([{
    trainingTitle: "Advanced System Architecture",
    institution: "Coursera / Pakiza Software",
    duration: "12 Weeks",
    completionDate: "2024-03-10",
    remarks: "Excellent performance"
  }]);
  const [involvements, setInvolvements] = reactExports.useState([{
    activityName: "HRIS Standardization Committee",
    role: "Technical Lead",
    duration: "6 Months",
    description: "Led database migration and performance optimizations"
  }]);
  const [dependents, setDependents] = reactExports.useState([{
    depName: "Anisur Rahman",
    depRelation: "Father",
    depDob: "1965-08-12",
    depNid: "1928374650"
  }]);
  const [otherDocs, setOtherDocs] = reactExports.useState([{
    docTitle: "Police Clearance Certificate",
    docType: "PDF",
    docFile: "police_clearance_shapno.pdf"
  }]);
  const [uploadProgress, setUploadProgress] = reactExports.useState({});
  const [errors, setErrors] = reactExports.useState({});
  const handleEduChange = (index, field, value) => {
    setEducationList((prev) => prev.map((item, i) => i === index ? {
      ...item,
      [field]: value
    } : item));
  };
  const addEduRow = () => {
    setEducationList((prev) => [...prev, {
      degree: "Bachelor of Science (B.Sc)",
      institute: "",
      passingYear: "",
      resultGpa: "",
      attachment: ""
    }]);
  };
  const handleExpChange = (index, field, value) => {
    setExperienceList((prev) => prev.map((item, i) => i === index ? {
      ...item,
      [field]: value
    } : item));
  };
  const addExpRow = () => {
    setExperienceList((prev) => [...prev, {
      company: "",
      designation: "",
      fromDate: "",
      toDate: "",
      leavingReason: "",
      attachment: ""
    }]);
  };
  const triggerRowMockUpload = (listType, index) => {
    const mockFileName = `uploaded_${listType}_scan_${index + 1}.pdf`;
    if (listType === "education") {
      setEducationList((prev) => prev.map((item, i) => i === index ? {
        ...item,
        attachment: mockFileName
      } : item));
    } else {
      setExperienceList((prev) => prev.map((item, i) => i === index ? {
        ...item,
        attachment: mockFileName
      } : item));
    }
  };
  const handleCertChange = (index, field, value) => {
    setCertifications((prev) => prev.map((item, i) => i === index ? {
      ...item,
      [field]: value
    } : item));
  };
  const addCertRow = () => {
    setCertifications((prev) => [...prev, {
      certificateName: "",
      organization: "",
      issueDate: "",
      expiryDate: "",
      credentialId: ""
    }]);
  };
  const handleTrainChange = (index, field, value) => {
    setTrainingList((prev) => prev.map((item, i) => i === index ? {
      ...item,
      [field]: value
    } : item));
  };
  const addTrainRow = () => {
    setTrainingList((prev) => [...prev, {
      trainingTitle: "",
      institution: "",
      duration: "",
      completionDate: "",
      remarks: ""
    }]);
  };
  const handleInvolChange = (index, field, value) => {
    setInvolvements((prev) => prev.map((item, i) => i === index ? {
      ...item,
      [field]: value
    } : item));
  };
  const addInvolRow = () => {
    setInvolvements((prev) => [...prev, {
      activityName: "",
      role: "",
      duration: "",
      description: ""
    }]);
  };
  const handleDepChange = (index, field, value) => {
    setDependents((prev) => prev.map((item, i) => i === index ? {
      ...item,
      [field]: value
    } : item));
  };
  const addDepRow = () => {
    setDependents((prev) => [...prev, {
      depName: "",
      depRelation: "Child",
      depDob: "",
      depNid: ""
    }]);
  };
  const handleDocChange = (index, field, value) => {
    setOtherDocs((prev) => prev.map((item, i) => i === index ? {
      ...item,
      [field]: value
    } : item));
  };
  const addDocRow = () => {
    setOtherDocs((prev) => [...prev, {
      docTitle: "",
      docType: "PDF",
      docFile: `attached_document_${Date.now().toString().slice(-4)}.pdf`
    }]);
  };
  reactExports.useEffect(() => {
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
        permCountry: prev.presCountry
      }));
    }
  }, [form.sameAsPresent, form.presDivision, form.presDistrict, form.presUpazila, form.presPostOffice, form.presVillageEng, form.presVillageBng, form.presRoad, form.presOthers, form.presCountry]);
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: false
      }));
    }
  };
  const grossNum = parseFloat(form.gross) || 0;
  const basicVal = grossNum > 0 ? (grossNum * 0.6).toFixed(2) : "0.00";
  const houseRentVal = grossNum > 0 ? (grossNum * 0.25).toFixed(2) : "0.00";
  const medicalVal = grossNum > 0 ? (grossNum * 0.08).toFixed(2) : "0.00";
  const conveyanceVal = grossNum > 0 ? (grossNum * 0.04).toFixed(2) : "0.00";
  const foodVal = grossNum > 0 ? (grossNum * 0.03).toFixed(2) : "0.00";
  const pfVal = grossNum > 0 ? (parseFloat(basicVal) * 0.1).toFixed(2) : "0.00";
  const totalAllowanceVal = (parseFloat(houseRentVal) + parseFloat(medicalVal) + parseFloat(conveyanceVal) + parseFloat(foodVal) + (parseFloat(form.specialAllowance) || 0) + (parseFloat(form.mobileAllowance) || 0) + (parseFloat(form.internetAllowance) || 0) + (parseFloat(form.utilityAllowance) || 0)).toFixed(2);
  const validateFields = () => {
    const required = ["id", "nameEng", "dob", "religion", "gender", "joinDate", "dept", "empType", "title", "shift", "gross"];
    const newErrors = {};
    let isValid = true;
    required.forEach((field) => {
      if (!form[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };
  const handleSave = (e) => {
    e.preventDefault();
    if (validateFields()) {
      setShowSuccessModal(true);
    } else {
      if (!form.nameEng || !form.dob || !form.religion || !form.gender || !form.joinDate || !form.dept || !form.empType || !form.title || !form.shift) {
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
  const triggerMockUpload = (field) => {
    setUploadProgress((prev) => ({
      ...prev,
      [field]: 10
    }));
    let progress = 10;
    const interval = setInterval(() => {
      progress += 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        handleChange(field, `mock_uploaded_${field}_shapno.png`);
      }
      setUploadProgress((prev) => ({
        ...prev,
        [field]: progress
      }));
    }, 200);
  };
  const isTabCompleted = (tabId) => {
    switch (tabId) {
      case "personal_identity":
        return !!(form.nameEng && form.dob && form.gender && form.emergencyName && form.emergencyContact);
      case "financial_employment":
        return !!(form.gross && form.bankName && form.bankAccount && form.jobDescription);
      case "career_qualifications":
        return educationList.length > 0 || experienceList.length > 0;
      case "family_dependents":
        return !!(form.nomineeName && form.nomineeShare);
      case "verification_documents":
        return !!form.verifiedBy;
      default:
        return false;
    }
  };
  const getTabCompletionPercentage = (tabId) => {
    switch (tabId) {
      case "personal_identity": {
        const fields = [form.nameEng, form.nameBng, form.dob, form.nid, form.fatherNameEng, form.motherNameEng, form.personalContact, form.personalEmail, form.presVillageEng, form.emergencyName, form.emergencyContact, form.ref1Name, form.ref1Contact];
        const filled = fields.filter(Boolean).length;
        return Math.round(filled / fields.length * 100);
      }
      case "financial_employment": {
        const fields = [form.gross, form.bankName, form.bankAccount, form.bankBranch, form.routingNumber, form.paymentMode, form.jobDescription, form.keyDeliverables, form.reportingLine];
        const filled = fields.filter(Boolean).length;
        return Math.round(filled / fields.length * 100);
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
        const nomineeFields = [form.nomineeName, form.nomineeRelation, form.nomineeNid, form.nomineeContact, form.nomineeShare, form.nomineeAddress];
        const nomineeFilled = nomineeFields.filter(Boolean).length;
        const nomineeScore = Math.round(nomineeFilled / nomineeFields.length * 70);
        const dependentScore = dependents.length > 0 ? 30 : 0;
        return Math.min(100, nomineeScore + dependentScore);
      }
      case "verification_documents": {
        const verFields = [form.verifiedBy, form.verificationNotes, form.verificationDate];
        const verFilled = verFields.filter(Boolean).length;
        const verScore = Math.round(verFilled / verFields.length * 30);
        const scanFields = [form.picture, form.signature, form.nidScan, form.certificateScan];
        const scanFilled = scanFields.filter(Boolean).length;
        const scanScore = Math.round(scanFilled / scanFields.length * 40);
        const otherScore = otherDocs.length > 0 ? 30 : 0;
        return Math.min(100, verScore + scanScore + otherScore);
      }
      default:
        return 0;
    }
  };
  const overallPercentage = Math.round(TABS.reduce((acc, tab) => acc + getTabCompletionPercentage(tab.id), 0) / TABS.length);
  const getSubSectionCompletionPercentage = (subId) => {
    switch (subId) {
      case "primary_placement": {
        const fields = [form.nameEng, form.nameBng, form.dob, form.gender, form.religion, form.blood, form.maritalStatus, form.education];
        const filled = fields.filter(Boolean).length;
        return Math.round(filled / fields.length * 100);
      }
      case "legal_kinship": {
        const fields = [form.nid, form.fatherNameEng, form.motherNameEng];
        const filled = fields.filter(Boolean).length;
        return Math.round(filled / fields.length * 100);
      }
      case "address_contact": {
        const fields = [form.personalContact, form.personalEmail, form.presVillageEng, form.presUpazila, form.presDistrict];
        const filled = fields.filter(Boolean).length;
        return Math.round(filled / fields.length * 100);
      }
      case "picture_uploads": {
        const fields = [form.picture, form.signature, form.nidScan];
        const filled = fields.filter(Boolean).length;
        return Math.round(filled / fields.length * 100);
      }
      case "emergency_contact": {
        const fields = [form.emergencyName, form.emergencyRelation, form.emergencyContact, form.emergencyAddress];
        const filled = fields.filter(Boolean).length;
        return Math.round(filled / fields.length * 100);
      }
      case "references": {
        const fields = [form.ref1Name, form.ref1Contact];
        const filled = fields.filter(Boolean).length;
        return Math.round(filled / fields.length * 100);
      }
      default:
        return 0;
    }
  };
  TABS.find((t) => t.id === activeTab)?.icon || User;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-primary transition-colors", children: "Personnel Info" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Add Employee File" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-extrabold tracking-tight text-foreground", children: "Add New Employee Digital File" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, className: "h-10 px-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
            " Save Employee Digital File"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "grid grid-cols-1 lg:grid-cols-4 gap-6 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 bg-card border border-border/80 rounded-lg p-4 shadow-xs space-y-1 max-h-[82vh] overflow-y-auto scrollbar-thin", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/50 border-b border-border/20 mb-1.5 sticky top-0 bg-card z-10", children: "Form Directories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-muted/20 border border-border/40 rounded-xl mb-4 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] font-black uppercase text-foreground tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Profile Completion" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-black text-xs", children: [
                  overallPercentage,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-muted border border-border/20 rounded-full overflow-hidden relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 rounded-full", style: {
                width: `${overallPercentage}%`
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground/80 leading-relaxed", children: "Fill in the required fields to complete the employee profile." })
            ] }),
            TABS.map((tab, idx) => {
              const TabIcon = tab.icon;
              const completed = isTabCompleted(tab.id);
              const isActive = activeTab === tab.id;
              const percentage = getTabCompletionPercentage(tab.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                setActiveTab(tab.id);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });
              }, className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all duration-200 ${isActive ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 truncate", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabIcon, { className: "size-4 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                    idx + 1,
                    ". ",
                    tab.label
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] font-black px-1.5 py-0.5 rounded-md ${isActive ? "bg-primary-foreground/15 text-primary-foreground" : percentage === 100 ? "bg-emerald-500/10 text-emerald-500" : percentage > 40 ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"}`, children: [
                    percentage,
                    "%"
                  ] }),
                  completed && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: `size-3.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-emerald-500 stroke-[3]"}` })
                ] })
              ] }, tab.id);
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 mt-2 border-t border-border/20 px-2 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-muted/30 border border-border/40 p-3 rounded-xl text-[10px] text-muted-foreground leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3.5 text-primary shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Fields marked with ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" }),
                " are system mandatory."
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 bg-card border border-border/80 rounded-lg p-6 md:p-8 shadow-xs min-h-[600px] flex flex-col gap-6", children: [
            activeTab === "personal_identity" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200 text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/60 rounded-lg p-5 shadow-xs overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[650px] relative flex items-center justify-between px-6 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[26px] left-[55px] right-[55px] h-[3px] bg-muted/60 border-t border-b border-border/20 z-0" }),
                [{
                  id: "primary_placement",
                  label: "Placement",
                  icon: User,
                  desc: "Personal & Job"
                }, {
                  id: "legal_kinship",
                  label: "Kinship",
                  icon: Users,
                  desc: "NID & Family"
                }, {
                  id: "address_contact",
                  label: "Contact",
                  icon: MapPin,
                  desc: "Reachability"
                }, {
                  id: "picture_uploads",
                  label: "Scans",
                  icon: Camera,
                  desc: "Portraits & NID"
                }, {
                  id: "emergency_contact",
                  label: "Emergency",
                  icon: PhoneCall,
                  desc: "Alternate Reach"
                }, {
                  id: "references",
                  label: "References",
                  icon: Heart,
                  desc: "Referee details"
                }].map((step, idx) => {
                  const StepIcon = step.icon;
                  const isSelected = subSection === step.id;
                  const subPercentage = getSubSectionCompletionPercentage(step.id);
                  const isCompleted = subPercentage === 100;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                    setSubSection(step.id);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    });
                  }, className: "relative z-10 flex flex-col items-center gap-2 group transition-all duration-300 focus:outline-none shrink-0", style: {
                    width: "90px"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `size-[42px] rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${isSelected ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_var(--primary)] scale-110" : isCompleted ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" : "bg-card text-muted-foreground border-border/80 hover:border-muted-foreground/60"}`, children: [
                      isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-[18px] stroke-[3]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StepIcon, { className: "size-[17px]" }),
                      isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-[-4px] rounded-full border-2 border-primary/40 animate-ping opacity-60 pointer-events-none" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5 w-full min-w-[120px]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] font-black uppercase tracking-wider block transition-colors duration-200 ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`, children: [
                        idx + 1,
                        ". ",
                        step.label
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block transition-all duration-200 ${isSelected ? "bg-primary/10 text-primary border border-primary/20" : isCompleted ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10" : subPercentage > 0 ? "bg-amber-500/10 text-amber-600 border border-amber-500/10" : "bg-rose-500/10 text-rose-600 border border-rose-500/10"}`, children: [
                        subPercentage,
                        "%"
                      ] })
                    ] })
                  ] }, step.id);
                })
              ] }) }),
              subSection === "primary_placement" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-emerald-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 h-full w-1.5 bg-emerald-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/30 pb-4 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-emerald-500/10 text-emerald-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-foreground uppercase tracking-wider", children: "Primary & Demographic Dossier" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Core personal data, language registry, and demographics." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Name (English) ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.nameEng, onChange: (e) => handleChange("nameEng", e.target.value), className: `h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none w-full ${errors.nameEng ? "border-rose-400" : "border-border"}`, placeholder: "e.g. Tahmid Afsar Shapno" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Name (Bengali)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.nameBng, onChange: (e) => handleChange("nameBng", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "উদা: তাহমিদ আফসার স্বপ্ন" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Date Of Birth ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.dob, onChange: (e) => handleChange("dob", e.target.value), className: `h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none w-full ${errors.dob ? "border-rose-400" : "border-border"}` })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Gender ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.gender, onChange: () => {
                      }, options: [{
                        value: "Male",
                        label: "Male"
                      }, {
                        value: "Female",
                        label: "Female"
                      }, {
                        value: "Other",
                        label: "Other"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Religion" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.religion, onChange: () => {
                      }, options: [{
                        value: "Islam",
                        label: "Islam"
                      }, {
                        value: "Hinduism",
                        label: "Hinduism"
                      }, {
                        value: "Christianity",
                        label: "Christianity"
                      }, {
                        value: "Buddhism",
                        label: "Buddhism"
                      }, {
                        value: "Others",
                        label: "Others"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Blood Group" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.blood, onChange: () => {
                      }, options: [{
                        value: "A (+ve)",
                        label: "A (+ve)"
                      }, {
                        value: "A (-ve)",
                        label: "A (-ve)"
                      }, {
                        value: "B (+ve)",
                        label: "B (+ve)"
                      }, {
                        value: "B (-ve)",
                        label: "B (-ve)"
                      }, {
                        value: "O (+ve)",
                        label: "O (+ve)"
                      }, {
                        value: "O (-ve)",
                        label: "O (-ve)"
                      }, {
                        value: "AB (+ve)",
                        label: "AB (+ve)"
                      }, {
                        value: "AB (-ve)",
                        label: "AB (-ve)"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Marital Status" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.maritalStatus, onChange: () => {
                      }, options: [{
                        value: "Single",
                        label: "Single"
                      }, {
                        value: "Married",
                        label: "Married"
                      }, {
                        value: "Widowed",
                        label: "Widowed"
                      }, {
                        value: "Divorced",
                        label: "Divorced"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Education Level" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.education, onChange: () => {
                      }, options: [{
                        value: "Bachelor of Science (B.Sc)",
                        label: "Bachelor of Science (B.Sc)"
                      }, {
                        value: "B.Sc.",
                        label: "B.Sc."
                      }, {
                        value: "M.Sc.",
                        label: "M.Sc."
                      }, {
                        value: "HSC",
                        label: "HSC"
                      }, {
                        value: "SSC",
                        label: "SSC"
                      }, {
                        value: "PhD",
                        label: "PhD"
                      }, {
                        value: "Diploma",
                        label: "Diploma"
                      }] }) })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-indigo-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 h-full w-1.5 bg-indigo-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/30 pb-4 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-indigo-500/10 text-indigo-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-foreground uppercase tracking-wider", children: "Corporate Placement & Mapping" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Organizational allocation, reporting structures, and shift schedules." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Emp ID (System) ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.id, disabled: true, className: "h-10 px-3.5 rounded-xl border border-border/50 bg-muted/30 text-xs font-mono font-bold text-muted-foreground w-full cursor-not-allowed" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Emp ID (Company)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.offcId, onChange: (e) => handleChange("offcId", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono", placeholder: "e.g. PSC-10023" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Joining Date ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.joinDate, onChange: (e) => handleChange("joinDate", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Confirmation Date ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.confirmDate, onChange: (e) => handleChange("confirmDate", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Department ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.dept, onChange: () => {
                      }, options: [{
                        value: "Supply Chain",
                        label: "Supply Chain"
                      }, {
                        value: "Implementation & Business Analysis",
                        label: "Implementation & Business Analysis"
                      }, {
                        value: "Human Resources",
                        label: "Human Resources"
                      }, {
                        value: "Accounts & Finance",
                        label: "Accounts & Finance"
                      }, {
                        value: "Information Technology",
                        label: "Information Technology"
                      }, {
                        value: "Production",
                        label: "Production"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Designation ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.title, onChange: () => {
                      }, options: [{
                        value: "Executive",
                        label: "Executive"
                      }, {
                        value: "Office Executive",
                        label: "Office Executive"
                      }, {
                        value: "Senior Software Engineer",
                        label: "Senior Software Engineer"
                      }, {
                        value: "Manager",
                        label: "Manager"
                      }, {
                        value: "Assistant Manager",
                        label: "Assistant Manager"
                      }, {
                        value: "Operator",
                        label: "Operator"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Employee Type ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.empType, onChange: () => {
                      }, options: [{
                        value: "Office Executive",
                        label: "Office Executive"
                      }, {
                        value: "Factory worker",
                        label: "Factory worker"
                      }, {
                        value: "Support Staff",
                        label: "Support Staff"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Working Area" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.workingArea, onChange: () => {
                      }, options: [{
                        value: "PSL-Operation",
                        label: "PSL-Operation"
                      }, {
                        value: "Head Office",
                        label: "Head Office"
                      }, {
                        value: "Factory Building A",
                        label: "Factory Building A"
                      }, {
                        value: "Factory Building B",
                        label: "Factory Building B"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Section" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.sect, onChange: () => {
                      }, options: [{
                        value: "ALL",
                        label: "ALL"
                      }, {
                        value: "Software Development",
                        label: "Software Development"
                      }, {
                        value: "Quality Assurance",
                        label: "Quality Assurance"
                      }, {
                        value: "Operations Support",
                        label: "Operations Support"
                      }, {
                        value: "Garments Production",
                        label: "Garments Production"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Job Nature" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.jobNature, onChange: () => {
                      }, options: [{
                        value: "ALL",
                        label: "ALL"
                      }, {
                        value: "Full-Time",
                        label: "Full-Time"
                      }, {
                        value: "Part-Time",
                        label: "Part-Time"
                      }, {
                        value: "Contractual",
                        label: "Contractual"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Unit" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.unit, onChange: () => {
                      }, options: [{
                        value: "ALL",
                        label: "ALL"
                      }, {
                        value: "Unit 1",
                        label: "Unit 1"
                      }, {
                        value: "Unit 2",
                        label: "Unit 2"
                      }, {
                        value: "Unit 3",
                        label: "Unit 3"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Line" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.line, onChange: () => {
                      }, options: [{
                        value: "ALL",
                        label: "ALL"
                      }, {
                        value: "Line A",
                        label: "Line A"
                      }, {
                        value: "Line B",
                        label: "Line B"
                      }, {
                        value: "Line C",
                        label: "Line C"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Grade" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.grade, onChange: () => {
                      }, options: [{
                        value: "ALL",
                        label: "None"
                      }, {
                        value: "Grade A",
                        label: "Grade A"
                      }, {
                        value: "Grade B",
                        label: "Grade B"
                      }, {
                        value: "Grade C",
                        label: "Grade C"
                      }, {
                        value: "Grade D",
                        label: "Grade D"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "Shift ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.shift, onChange: () => {
                      }, options: [{
                        value: "General Shift",
                        label: "General Shift"
                      }, {
                        value: "Night Shift",
                        label: "Night Shift"
                      }, {
                        value: "Roster Shift",
                        label: "Roster Shift"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Employment Status" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.empStatus, onChange: () => {
                      }, options: [{
                        value: "Probation",
                        label: "Probation"
                      }, {
                        value: "Permanent",
                        label: "Permanent"
                      }, {
                        value: "Contractual",
                        label: "Contractual"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Probation Period" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.probationPeriod, onChange: () => {
                      }, options: [{
                        value: "N/A",
                        label: "N/A"
                      }, {
                        value: "3",
                        label: "3"
                      }, {
                        value: "6",
                        label: "6"
                      }, {
                        value: "12",
                        label: "12"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Default Holiday" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.holiday, onChange: () => {
                      }, options: [{
                        value: "N/A",
                        label: "N/A"
                      }, {
                        value: "Friday",
                        label: "Friday"
                      }, {
                        value: "Sunday",
                        label: "Sunday"
                      }, {
                        value: "Saturday",
                        label: "Saturday"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Set Manager" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.setManager, onChange: () => {
                      }, options: [{
                        value: "Mamunoor Rashid (DGM), Head Office",
                        label: "Mamunoor Rashid (DGM), Head Office"
                      }, {
                        value: "Tahmid Afsar Shapno",
                        label: "Tahmid Afsar Shapno"
                      }, {
                        value: "Sohanur Rahman Sohan",
                        label: "Sohanur Rahman Sohan"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Recruitment Type" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.recruitmentType, onChange: () => {
                      }, options: [{
                        value: "New",
                        label: "New"
                      }, {
                        value: "Re-appointment",
                        label: "Re-appointment"
                      }, {
                        value: "Transfer",
                        label: "Transfer"
                      }] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2 md:col-span-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "RC Notes" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.rcNotes, onChange: (e) => handleChange("rcNotes", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "e.g. Hired via Campus Recruitment Drive" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                    if (window.confirm("Are you sure you want to reset all profile details?")) {
                      setForm((prev) => ({
                        ...prev,
                        nameEng: "",
                        nameBng: "",
                        dob: "",
                        offcId: ""
                      }));
                    }
                  }, className: "h-10 px-5 rounded-xl border border-border text-xs font-extrabold text-rose-500 hover:bg-rose-500/5 transition duration-200 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }),
                    " Reset Details"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                    setSubSection("legal_kinship");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    });
                  }, className: "h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200", children: [
                    "Next Section: Kinship & ID ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                  ] })
                ] })
              ] }),
              subSection === "legal_kinship" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-violet-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 h-full w-1.5 bg-violet-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/30 pb-4 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-violet-500/10 text-violet-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-foreground uppercase tracking-wider", children: "Legal Identification Credentials" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Government-issued identity cards, license numbers, and professional indexes." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                        "National ID (NID) ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.nid, onChange: (e) => handleChange("nid", e.target.value), className: `h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none w-full font-mono ${errors.nid ? "border-rose-400" : "border-border"}`, placeholder: "10 or 17 digit NID number" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Birth Reg No" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.birthRegNo, onChange: (e) => handleChange("birthRegNo", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono", placeholder: "Birth Certificate Number" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Passport No" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.passportNo, onChange: (e) => handleChange("passportNo", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono", placeholder: "Passport Document Number" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Driving License No" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.drivingLicense, onChange: (e) => handleChange("drivingLicense", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono", placeholder: "Driving License Number" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Professional Membership No" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.membershipNo, onChange: (e) => handleChange("membershipNo", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono", placeholder: "e.g. IEB-XXXXX" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-amber-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 h-full w-1.5 bg-amber-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/30 pb-4 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-amber-500/10 text-amber-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-foreground uppercase tracking-wider", children: "Parental & Kinship Context" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Lineage records, primary parent identifiers, and matrimonial registry." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Father Name (English)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.fatherNameEng, onChange: (e) => handleChange("fatherNameEng", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Father Name (Bengali)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.fatherNameBng, onChange: (e) => handleChange("fatherNameBng", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Mother Name (English)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.motherNameEng, onChange: (e) => handleChange("motherNameEng", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Mother Name (Bengali)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.motherNameBng, onChange: (e) => handleChange("motherNameBng", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full" })
                    ] })
                  ] }),
                  form.maritalStatus === "Married" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-6 border-t border-border/30 space-y-4 animate-in slide-in-from-top-3 duration-250", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4 text-rose-500 fill-rose-500 animate-pulse" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Matrimonial Spouse Information" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Spouse Name (English)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.spouseNameEng, onChange: (e) => handleChange("spouseNameEng", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full", placeholder: "Spouse Legal Name" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Spouse Name (Bengali)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.spouseNameBng, onChange: (e) => handleChange("spouseNameBng", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full", placeholder: "উদা: স্বামী/স্ত্রীর নাম" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Spouse NID" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.spouseNid, onChange: (e) => handleChange("spouseNid", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono", placeholder: "Spouse NID Number" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Spouse Contact No" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.spouseContactNo, onChange: (e) => handleChange("spouseContactNo", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono", placeholder: "Contact Number" })
                      ] })
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 p-3 rounded-xl bg-muted/20 border border-border/30 text-[11px] text-muted-foreground flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4 text-muted-foreground/60" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Spouse information fields are hidden because Marital Status is set to",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: form.maritalStatus || "Single" }),
                      ". Change status in step 1 to enable."
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                    setSubSection("primary_placement");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    });
                  }, className: "h-10 px-5 rounded-xl border border-border text-xs font-extrabold text-muted-foreground hover:bg-muted transition duration-200 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                    " Previous Section"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                    setSubSection("address_contact");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    });
                  }, className: "h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200", children: [
                    "Next Section: Contact & Address ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                  ] })
                ] })
              ] }),
              subSection === "address_contact" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-rose-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 h-full w-1.5 bg-rose-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-border/30 pb-4 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-rose-500/10 text-rose-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-5" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-foreground uppercase tracking-wider", children: "Residential Address Directory" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Physical residence history, active mailing postage, and permanent voter tracks." })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none bg-muted/40 border border-border/30 hover:bg-muted/70 px-3 py-1.5 rounded-xl transition duration-200", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.sameAsPresent, onChange: (e) => handleChange("sameAsPresent", e.target.checked), className: "rounded border-border text-emerald-600 focus:ring-emerald-500 size-4 cursor-pointer" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold text-foreground uppercase tracking-wider", children: "Same as Present" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 border-b border-border/20 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-rose-500 tracking-wider bg-rose-500/10 px-2 py-0.5 rounded", children: "Present Address" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Division" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.presDivision, onChange: () => {
                          }, options: [{
                            value: "Dhaka",
                            label: "Dhaka"
                          }, {
                            value: "Rangpur",
                            label: "Rangpur"
                          }, {
                            value: "Chittagong",
                            label: "Chittagong"
                          }, {
                            value: "Sylhet",
                            label: "Sylhet"
                          }, {
                            value: "Rajshahi",
                            label: "Rajshahi"
                          }, {
                            value: "Khulna",
                            label: "Khulna"
                          }, {
                            value: "Barisal",
                            label: "Barisal"
                          }, {
                            value: "Mymensingh",
                            label: "Mymensingh"
                          }] }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "District" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.presDistrict, onChange: () => {
                          }, options: [{
                            value: "Dhaka",
                            label: "Dhaka"
                          }, {
                            value: "Kurigram",
                            label: "Kurigram"
                          }, {
                            value: "Gazipur",
                            label: "Gazipur"
                          }, {
                            value: "Narayanganj",
                            label: "Narayanganj"
                          }, {
                            value: "Chittagong",
                            label: "Chittagong"
                          }, {
                            value: "Sylhet",
                            label: "Sylhet"
                          }, {
                            value: "Rajshahi",
                            label: "Rajshahi"
                          }, {
                            value: "Rangpur",
                            label: "Rangpur"
                          }] }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Upazila" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAddingField("presUpazila"), className: "text-[9px] font-extrabold text-amber-500 hover:text-amber-600 transition flex items-center gap-0.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-2.5 stroke-[3]" }),
                              " Add"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.presUpazila, onChange: () => {
                          }, options: upazilas.map((u) => ({
                            value: u,
                            label: u
                          })) }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PostOffice" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAddingField("presPostOffice"), className: "text-[9px] font-extrabold text-amber-500 hover:text-amber-600 transition flex items-center gap-0.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-2.5 stroke-[3]" }),
                              " Add"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.presPostOffice, onChange: () => {
                          }, options: postOffices.map((p) => ({
                            value: p,
                            label: p
                          })) }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Village/House (Eng)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.presVillageEng, onChange: (e) => handleChange("presVillageEng", e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "Vill # Dhopapara" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Village/House (Bng)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.presVillageBng, onChange: (e) => handleChange("presVillageBng", e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "গ্রাম # ধোপাপাড়া" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Road" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.presRoad, onChange: (e) => handleChange("presRoad", e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "Road No / Name" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Others" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.presOthers, onChange: (e) => handleChange("presOthers", e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "Flat / Level" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Country" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.presCountry, onChange: () => {
                          }, options: [{
                            value: "Bangladesh",
                            label: "Bangladesh"
                          }, {
                            value: "India",
                            label: "India"
                          }, {
                            value: "USA",
                            label: "USA"
                          }, {
                            value: "UK",
                            label: "UK"
                          }] }) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/30 rounded-xl p-3.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-muted-foreground/75 uppercase tracking-widest block mb-1", children: "Mailing Dispatch preview" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground block truncate", children: [
                          form.presVillageEng || "Dhopapara",
                          ", Road ",
                          form.presRoad || "N/A",
                          ",",
                          " ",
                          form.presUpazila,
                          ", ",
                          form.presDistrict,
                          ", ",
                          form.presCountry
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 border-b border-border/20 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-indigo-500 tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded", children: "Permanent Address" }) }),
                      form.sameAsPresent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[318px] border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 gap-3 bg-muted/5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-10 text-emerald-500 animate-bounce" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-foreground", children: "Same as Present Address" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground max-w-[240px] mt-1", children: "Data from the present address section will automatically replicate for legal & postage reports." })
                        ] })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 animate-in fade-in duration-200", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Division" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.permDivision, onChange: () => {
                          }, options: [{
                            value: "Dhaka",
                            label: "Dhaka"
                          }, {
                            value: "Rangpur",
                            label: "Rangpur"
                          }, {
                            value: "Chittagong",
                            label: "Chittagong"
                          }, {
                            value: "Sylhet",
                            label: "Sylhet"
                          }, {
                            value: "Rajshahi",
                            label: "Rajshahi"
                          }, {
                            value: "Khulna",
                            label: "Khulna"
                          }, {
                            value: "Barisal",
                            label: "Barisal"
                          }, {
                            value: "Mymensingh",
                            label: "Mymensingh"
                          }] }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "District" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.permDistrict, onChange: () => {
                          }, options: [{
                            value: "Dhaka",
                            label: "Dhaka"
                          }, {
                            value: "Kurigram",
                            label: "Kurigram"
                          }, {
                            value: "Gazipur",
                            label: "Gazipur"
                          }, {
                            value: "Narayanganj",
                            label: "Narayanganj"
                          }, {
                            value: "Chittagong",
                            label: "Chittagong"
                          }, {
                            value: "Sylhet",
                            label: "Sylhet"
                          }, {
                            value: "Rajshahi",
                            label: "Rajshahi"
                          }, {
                            value: "Rangpur",
                            label: "Rangpur"
                          }] }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Upazila" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAddingField("permUpazila"), className: "text-[9px] font-extrabold text-amber-500 hover:text-amber-600 transition flex items-center gap-0.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-2.5 stroke-[3]" }),
                              " Add"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.permUpazila, onChange: () => {
                          }, options: upazilas.map((u) => ({
                            value: u,
                            label: u
                          })) }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PostOffice" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAddingField("permPostOffice"), className: "text-[9px] font-extrabold text-amber-500 hover:text-amber-600 transition flex items-center gap-0.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-2.5 stroke-[3]" }),
                              " Add"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.permPostOffice, onChange: () => {
                          }, options: postOffices.map((p) => ({
                            value: p,
                            label: p
                          })) }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Village/House (Eng)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.permVillageEng, onChange: (e) => handleChange("permVillageEng", e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "Vill # Khalilgonj" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Village/House (Bng)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.permVillageBng, onChange: (e) => handleChange("permVillageBng", e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "গ্রাম # খলিলগঞ্জ" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Road" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.permRoad, onChange: (e) => handleChange("permRoad", e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "Road No / Name" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Others" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.permOthers, onChange: (e) => handleChange("permOthers", e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "Flat / Level" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Country" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.permCountry, onChange: () => {
                          }, options: [{
                            value: "Bangladesh",
                            label: "Bangladesh"
                          }, {
                            value: "India",
                            label: "India"
                          }, {
                            value: "USA",
                            label: "USA"
                          }, {
                            value: "UK",
                            label: "UK"
                          }] }) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/30 rounded-xl p-3.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-muted-foreground/75 uppercase tracking-widest block mb-1", children: "Legal Dossier dispatch preview" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground block truncate", children: form.sameAsPresent ? `${form.presVillageEng || "Dhopapara"}, Road ${form.presRoad || "N/A"}, ${form.presUpazila}, ${form.presDistrict}, ${form.presCountry}` : `${form.permVillageEng || "Khalilgonj"}, Road ${form.permRoad || "N/A"}, ${form.permUpazila}, ${form.permDistrict}, ${form.permCountry}` })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-lg p-6 shadow-2xs relative overflow-hidden transition-all duration-300 hover:border-sky-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 h-full w-1.5 bg-sky-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/30 pb-4 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-sky-500/10 text-sky-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-foreground uppercase tracking-wider", children: "Contact & Reachability Channels" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Primary communication channels, corporate extensions, and personal mailboxes." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: "Office Email" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: form.offcEmail, onChange: (e) => handleChange("offcEmail", e.target.value), className: "h-10 pl-9 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "employee@pakizasoftware.com" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Office Mobile" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.offcMobile, onChange: (e) => handleChange("offcMobile", e.target.value), className: "h-10 pl-9 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono", placeholder: "017500XXXXX" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Office extension (Ex.)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.offcPhoneEx, onChange: (e) => handleChange("offcPhoneEx", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono", placeholder: "e.g. 102" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: "Personal Email" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: form.personalEmail, onChange: (e) => handleChange("personalEmail", e.target.value), className: "h-10 pl-9 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full", placeholder: "personal@gmail.com" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: "Personal Contact No" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.personalContact, onChange: (e) => handleChange("personalContact", e.target.value), className: "h-10 pl-9 pr-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full font-mono", placeholder: "017130XXXXX" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3.5 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                    setSubSection("legal_kinship");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    });
                  }, className: "h-10 px-5 rounded-xl border border-border text-xs font-extrabold text-muted-foreground hover:bg-muted transition duration-200 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                    " Previous Section"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                    setSubSection("picture_uploads");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    });
                  }, className: "h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200", children: [
                    "Next Section: Upload Scans ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                  ] })
                ] })
              ] })
            ] }),
            activeTab === "financial_employment" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "size-4.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Compensation Structure & Financials" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 space-y-5 bg-card border border-border/60 rounded-lg p-5 shadow-2xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-2.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-primary uppercase tracking-wider", children: "Base Salary & Standard Splits" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Input the employee's gross monthly package. Basic and regulatory components will calculate instantly." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-extrabold text-primary uppercase flex items-center gap-1", children: [
                          "Gross Salary ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60", children: "৳" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.gross, onChange: (e) => handleChange("gross", e.target.value), className: `h-10 pl-7.5 pr-3.5 rounded-xl border bg-primary/5 text-sm font-extrabold font-mono text-primary focus:outline-none focus:ring-1 focus:ring-primary w-full ${errors.gross ? "border-rose-400" : "border-border/80"}`, placeholder: "e.g. 45000" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Basic Salary (60% of Gross)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: parseFloat(basicVal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          }), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "House Rent Allowance (25%)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: parseFloat(houseRentVal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          }), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Medical Allowance (8%)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: parseFloat(medicalVal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          }), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Conveyance Allowance (4%)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: parseFloat(conveyanceVal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          }), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Food Allowance (3%)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: parseFloat(foodVal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          }), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Provident Fund (10% of Basic)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: parseFloat(pfVal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          }), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none" })
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 space-y-5 bg-card border border-border/60 rounded-lg p-5 shadow-2xs flex flex-col justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-2.5 mb-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-foreground uppercase tracking-wider", children: "Supplementary Allowances & Taxes" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Specify custom corporate perks and recurring tax withholdings." })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Special Allowance" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.specialAllowance, onChange: (e) => handleChange("specialAllowance", e.target.value), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none focus:ring-1 focus:ring-primary", placeholder: "e.g. 5000" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Mobile Allowance" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.mobileAllowance, onChange: (e) => handleChange("mobileAllowance", e.target.value), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none", placeholder: "e.g. 1000" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Internet Allowance" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.internetAllowance, onChange: (e) => handleChange("internetAllowance", e.target.value), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none", placeholder: "e.g. 1500" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Utility Allowance" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.utilityAllowance, onChange: (e) => handleChange("utilityAllowance", e.target.value), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none", placeholder: "e.g. 2000" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-rose-500 uppercase", children: "Tax Deduction" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-rose-500/60", children: "৳" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.taxDeduction, onChange: (e) => handleChange("taxDeduction", e.target.value), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-rose-200/60 bg-rose-500/5 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono w-full focus:outline-none", placeholder: "e.g. 3000" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Gratuity Contribution" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60", children: "৳" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.gratuity, onChange: (e) => handleChange("gratuity", e.target.value), className: "h-9.5 pl-7.5 pr-3.5 rounded-xl border border-border bg-card text-xs font-bold font-mono w-full focus:outline-none", placeholder: "e.g. 5000" })
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border/30 grid grid-cols-2 gap-3.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 rounded-xl p-3 border border-primary/10", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-primary uppercase tracking-wider block", children: "Total Allowance" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-extrabold font-mono text-primary mt-1 block", children: [
                          "৳",
                          parseFloat(totalAllowanceVal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block", children: "Est. Net Payable" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block", children: [
                          "৳",
                          ((parseFloat(form.gross) || 0) + (parseFloat(totalAllowanceVal) || 0) - (parseFloat(form.taxDeduction) || 0)).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          })
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 bg-card border border-border/60 rounded-lg p-5 shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-2.5 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-4.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Disbursement Routing & Bank details" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Specify official payout methods and secure transaction routing details." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Payment Mode" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.paymentMode, onChange: () => {
                    }, options: [{
                      value: "Bank Transfer",
                      label: "Bank Transfer"
                    }, {
                      value: "Cash",
                      label: "Cash payment"
                    }, {
                      value: "Mobile Banking",
                      label: "Mobile Banking (bKash/Nagad)"
                    }] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Bank Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.bankName, onChange: (e) => handleChange("bankName", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full", placeholder: "e.g. Dutch-Bangla Bank" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Account Number" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.bankAccount, onChange: (e) => handleChange("bankAccount", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono", placeholder: "e.g. 102.120.99827" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Branch Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.bankBranch, onChange: (e) => handleChange("bankBranch", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full", placeholder: "e.g. Motijheel Branch" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Routing Number" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.routingNumber, onChange: (e) => handleChange("routingNumber", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono", placeholder: "e.g. 020260120" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 my-8 pt-2" })
            ] }),
            activeTab === "personal_identity" && subSection === "picture_uploads" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Document & Image Upload Center" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-6" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-extrabold text-foreground uppercase tracking-wider", children: "Employee Portrait" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Premium front portrait, clean background. Max 2MB." })
                  ] }),
                  uploadProgress.picture !== void 0 && uploadProgress.picture < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-1.5 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary h-1.5 rounded-full transition-all", style: {
                    width: `${uploadProgress.picture}%`
                  } }) }),
                  form.picture ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-card/95 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-8" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground font-mono", children: form.picture }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleChange("picture", ""), className: "text-[9px] font-bold text-rose-500 hover:underline", children: "Remove file" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => triggerMockUpload("picture"), className: "h-9 px-4 rounded-xl border border-primary/30 hover:bg-primary/5 text-primary text-xs font-bold transition flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3.5" }),
                    " Upload Portrait Photo"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "size-6" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-extrabold text-foreground uppercase tracking-wider", children: "Authorized Signature" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Digital signature scan on clean white sheet. Max 1MB." })
                  ] }),
                  uploadProgress.signature !== void 0 && uploadProgress.signature < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-1.5 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-indigo-500 h-1.5 rounded-full transition-all", style: {
                    width: `${uploadProgress.signature}%`
                  } }) }),
                  form.signature ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-card/95 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-8" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground font-mono", children: form.signature }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleChange("signature", ""), className: "text-[9px] font-bold text-rose-500 hover:underline", children: "Remove file" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => triggerMockUpload("signature"), className: "h-9 px-4 rounded-xl border border-indigo-500/30 hover:bg-indigo-500/5 text-indigo-500 text-xs font-bold transition flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3.5" }),
                    " Upload Signature Scan"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-6" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-extrabold text-foreground uppercase tracking-wider", children: "National ID Card Scan" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Scanned PDF or High-res JPG of both sides. Max 4MB." })
                  ] }),
                  uploadProgress.nidScan !== void 0 && uploadProgress.nidScan < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-1.5 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-500 h-1.5 rounded-full transition-all", style: {
                    width: `${uploadProgress.nidScan}%`
                  } }) }),
                  form.nidScan ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-card/95 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-8" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground font-mono", children: form.nidScan }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleChange("nidScan", ""), className: "text-[9px] font-bold text-rose-500 hover:underline", children: "Remove file" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => triggerMockUpload("nidScan"), className: "h-9 px-4 rounded-xl border border-amber-500/30 hover:bg-amber-500/5 text-amber-500 text-xs font-bold transition flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3.5" }),
                    " Upload NID Card Scan"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-muted/10 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-4.5 relative overflow-hidden min-h-[220px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-6" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-extrabold text-foreground uppercase tracking-wider", children: "Degree Certificate" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Verified academic graduation degree certificate. Max 5MB." })
                  ] }),
                  uploadProgress.certificateScan !== void 0 && uploadProgress.certificateScan < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-1.5 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-emerald-500 h-1.5 rounded-full transition-all", style: {
                    width: `${uploadProgress.certificateScan}%`
                  } }) }),
                  form.certificateScan ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-card/95 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-8" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground font-mono", children: form.certificateScan }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleChange("certificateScan", ""), className: "text-[9px] font-bold text-rose-500 hover:underline", children: "Remove file" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => triggerMockUpload("certificateScan"), className: "h-9 px-4 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/5 text-emerald-500 text-xs font-bold transition flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3.5" }),
                    " Upload Certificate Scan"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setSubSection("address_contact");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                  " Previous Section"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setSubSection("emergency_contact");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md", children: [
                  "Next Section: Emergency Contact ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                ] })
              ] })
            ] }),
            activeTab === "career_qualifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Academic Credentials & Qualifications" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 min-w-[200px]", children: "Degree / Exam Title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Institution Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[100px] text-center", children: "Passing Year" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[100px] text-center", children: "Result / GPA" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[170px] text-center", children: "Attachment (Optional)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[60px] text-right", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
                  educationList.map((edu, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5 transition-colors font-semibold text-foreground/80", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: edu.degree, onChange: () => {
                    }, options: [{
                      value: "Secondary (SSC)",
                      label: "Secondary School (SSC)"
                    }, {
                      value: "Higher Secondary (HSC)",
                      label: "Higher Secondary (HSC)"
                    }, {
                      value: "Bachelor of Science (B.Sc)",
                      label: "Bachelor of Science (B.Sc)"
                    }, {
                      value: "Master of Science (M.Sc)",
                      label: "Master of Science (M.Sc)"
                    }, {
                      value: "MBA / Post Grad",
                      label: "Executive MBA / Post Grad"
                    }, {
                      value: "PhD / Doctorate",
                      label: "PhD / Doctorate Degree"
                    }] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: edu.institute, onChange: (e) => handleEduChange(index, "institute", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Dhaka University" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: edu.passingYear, onChange: (e) => handleEduChange(index, "passingYear", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center font-mono focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. 2022" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: edu.resultGpa, onChange: (e) => handleEduChange(index, "resultGpa", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center font-mono focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. 3.85" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: edu.attachment ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg gap-1.5 max-w-[150px] mx-auto animate-in fade-in duration-200", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-bold text-emerald-600 truncate", children: edu.attachment }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleEduChange(index, "attachment", ""), className: "text-rose-500 hover:text-rose-600 font-black text-[10px] shrink-0", title: "Remove certificate attachment", children: "✕" })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => triggerRowMockUpload("education", index), className: "h-7 px-2.5 rounded-lg border border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition duration-200", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3 text-primary/75" }),
                      " Upload File"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEducationList((prev) => prev.filter((_, i) => i !== index)), className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "size-3.5" }) }) })
                  ] }, index)),
                  educationList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-8 text-center text-muted-foreground text-xs italic", children: "No academic credentials logged yet. Click the button below to add your first qualification." }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addEduRow, className: "h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                " Add Academic Qualification"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 my-8 pt-2" })
            ] }),
            activeTab === "career_qualifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Prior Job Experience & Career History" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Organization / Company" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Designation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[120px] text-center", children: "From Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[120px] text-center", children: "To Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Reason for Leaving" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[170px] text-center", children: "Attachment (Optional)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[60px] text-right", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
                  experienceList.map((exp, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5 transition-colors font-semibold text-foreground/80", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: exp.company, onChange: (e) => handleExpChange(index, "company", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Brain Station 23" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: exp.designation, onChange: (e) => handleExpChange(index, "designation", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Senior Software Engineer" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: exp.fromDate, onChange: (e) => handleExpChange(index, "fromDate", e.target.value), className: "h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: exp.toDate, onChange: (e) => handleExpChange(index, "toDate", e.target.value), className: "h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: exp.leavingReason, onChange: (e) => handleExpChange(index, "leavingReason", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Career Growth" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: exp.attachment ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg gap-1.5 max-w-[150px] mx-auto animate-in fade-in duration-200", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-bold text-emerald-600 truncate", children: exp.attachment }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleExpChange(index, "attachment", ""), className: "text-rose-500 hover:text-rose-600 font-black text-[10px] shrink-0", title: "Remove experience attachment", children: "✕" })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => triggerRowMockUpload("experience", index), className: "h-7 px-2.5 rounded-lg border border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition duration-200", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3 text-primary/75" }),
                      " Upload File"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setExperienceList((prev) => prev.filter((_, i) => i !== index)), className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "size-3.5" }) }) })
                  ] }, index)),
                  experienceList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-8 text-center text-muted-foreground text-xs italic", children: "No prior work experience logged. Click the button below to add your first job history." }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addExpRow, className: "h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                " Add Job Experience Row"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 my-8 pt-2" })
            ] }),
            activeTab === "career_qualifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Professional Certifications & Credentials" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Certificate Title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Issuing Authority / Organization" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[180px] text-center", children: "Credential ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[150px] text-center", children: "Issue Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[60px] text-right", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
                  certifications.map((cert, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5 transition-colors font-semibold text-foreground/80", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: cert.certificateName, onChange: (e) => handleCertChange(index, "certificateName", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. AWS Certified Architect" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: cert.organization, onChange: (e) => handleCertChange(index, "organization", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Amazon Web Services" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: cert.credentialId, onChange: (e) => handleCertChange(index, "credentialId", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center font-mono focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. AWS-12345" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: cert.issueDate, onChange: (e) => handleCertChange(index, "issueDate", e.target.value), className: "h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCertifications((prev) => prev.filter((_, i) => i !== index)), className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "size-3.5" }) }) })
                  ] }, index)),
                  certifications.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-muted-foreground text-xs italic", children: "No certification credentials added yet. Click the button below to add your first cert." }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addCertRow, className: "h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                " Add Certification Row"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 my-8 pt-2" })
            ] }),
            activeTab === "career_qualifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Professional Training Programs" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Training Title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Institution / Provider" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[150px] text-center", children: "Duration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[150px] text-center", children: "Completion Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[60px] text-right", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
                  trainingList.map((t, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5 transition-colors font-semibold text-foreground/80", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: t.trainingTitle, onChange: (e) => handleTrainChange(index, "trainingTitle", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Advanced System Architecture" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: t.institution, onChange: (e) => handleTrainChange(index, "institution", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Coursera" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: t.duration, onChange: (e) => handleTrainChange(index, "duration", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. 12 Weeks" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: t.completionDate, onChange: (e) => handleTrainChange(index, "completionDate", e.target.value), className: "h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTrainingList((prev) => prev.filter((_, i) => i !== index)), className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "size-3.5" }) }) })
                  ] }, index)),
                  trainingList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-muted-foreground text-xs italic", children: "No training programs logged. Click the button below to add your first training record." }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addTrainRow, className: "h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                " Add Training Program Row"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 my-8 pt-2" })
            ] }),
            activeTab === "career_qualifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Organizational Involvements & Committee Commitments" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Committee / Group Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Role Played" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[150px] text-center", children: "Duration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Key Deliverable / Remarks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[60px] text-right", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
                  involvements.map((invol, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5 transition-colors font-semibold text-foreground/80", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: invol.activityName, onChange: (e) => handleInvolChange(index, "activityName", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Safety Committee" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: invol.role, onChange: (e) => handleInvolChange(index, "role", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Committee Secretary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: invol.duration, onChange: (e) => handleInvolChange(index, "duration", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. 6 Months" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: invol.description, onChange: (e) => handleInvolChange(index, "description", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Supervised emergency drills" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setInvolvements((prev) => prev.filter((_, i) => i !== index)), className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "size-3.5" }) }) })
                  ] }, index)),
                  involvements.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-muted-foreground text-xs italic", children: "No organizational involvements logged. Click the button below to add your first record." }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addInvolRow, className: "h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                " Add Organizational Involvement Row"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setActiveTab("financial_employment");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                  " Previous Step"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setActiveTab("family_dependents");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md", children: [
                  "Next Step: Family & Dependents ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                ] })
              ] })
            ] }),
            activeTab === "personal_identity" && subSection === "emergency_contact" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-4.5 text-rose-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Emergency Contact & Reachability" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-lg p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                    "Contact Person Name ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.emergencyName, onChange: (e) => handleChange("emergencyName", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full", placeholder: "e.g. M. A. Rahman" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Relationship" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.emergencyRelation, onChange: () => {
                  }, options: [{
                    value: "Father",
                    label: "Father"
                  }, {
                    value: "Mother",
                    label: "Mother"
                  }, {
                    value: "Spouse",
                    label: "Spouse"
                  }, {
                    value: "Sibling",
                    label: "Sibling"
                  }, {
                    value: "Guardian",
                    label: "Guardian"
                  }] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                    "Primary Mobile No ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.emergencyContact, onChange: (e) => handleChange("emergencyContact", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full font-mono", placeholder: "e.g. 017XXXXXXXX" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Alternative Contact No" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.emergencyAltContact, onChange: (e) => handleChange("emergencyAltContact", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono", placeholder: "Alternative number" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Email Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: form.emergencyEmail, onChange: (e) => handleChange("emergencyEmail", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full", placeholder: "e.g. parent@gmail.com" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2 md:col-span-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Detailed Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.emergencyAddress, onChange: (e) => handleChange("emergencyAddress", e.target.value), className: "p-3 rounded-xl border border-border bg-card text-xs font-semibold w-full h-20 resize-none", placeholder: "Enter full physical residential address of emergency contact..." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setSubSection("picture_uploads");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                  " Previous Section"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setSubSection("references");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md", children: [
                  "Next Section: References ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                ] })
              ] })
            ] }),
            activeTab === "family_dependents" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Nominee Declaration Dossier" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-lg p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                    "Nominee Full Name ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.nomineeName, onChange: (e) => handleChange("nomineeName", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Relation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.nomineeRelation, onChange: () => {
                  }, options: [{
                    value: "Mother",
                    label: "Mother"
                  }, {
                    value: "Father",
                    label: "Father"
                  }, {
                    value: "Spouse",
                    label: "Spouse"
                  }, {
                    value: "Child",
                    label: "Child"
                  }, {
                    value: "Sibling",
                    label: "Sibling"
                  }] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                    "Nominee NID / Birth Reg ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.nomineeNid, onChange: (e) => handleChange("nomineeNid", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full font-mono", placeholder: "NID or Birth cert" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Nominee Contact No" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.nomineeContact, onChange: (e) => handleChange("nomineeContact", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Nominee Share Percentage (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", max: "100", value: form.nomineeShare, onChange: (e) => handleChange("nomineeShare", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full font-mono text-primary bg-primary/5", placeholder: "e.g. 100" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2 md:col-span-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Nominee Permanent Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.nomineeAddress, onChange: (e) => handleChange("nomineeAddress", e.target.value), className: "p-3 rounded-xl border border-border bg-card text-xs font-semibold w-full h-20 resize-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 my-8 pt-2" })
            ] }),
            activeTab === "personal_identity" && subSection === "references" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Professional & Corporate References" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-muted/15 rounded-lg p-5 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-primary uppercase tracking-widest border-b border-border/20 pb-2", children: "Primary Reference" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-extrabold text-muted-foreground uppercase", children: "Referee Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.ref1Name, onChange: (e) => handleChange("ref1Name", e.target.value), className: "h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full", placeholder: "Name" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-extrabold text-muted-foreground uppercase", children: "Designation & Org" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.ref1Designation, onChange: (e) => handleChange("ref1Designation", e.target.value), className: "h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full", placeholder: "e.g. Director, Tech Ltd" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-extrabold text-muted-foreground uppercase", children: "Contact Number" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.ref1Contact, onChange: (e) => handleChange("ref1Contact", e.target.value), className: "h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full font-mono", placeholder: "Contact number" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-muted/15 rounded-lg p-5 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-indigo-500 uppercase tracking-widest border-b border-border/20 pb-2", children: "Secondary Reference" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-extrabold text-muted-foreground uppercase", children: "Referee Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.ref2Name, onChange: (e) => handleChange("ref2Name", e.target.value), className: "h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full", placeholder: "Name" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-extrabold text-muted-foreground uppercase", children: "Designation & Org" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.ref2Designation, onChange: (e) => handleChange("ref2Designation", e.target.value), className: "h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full", placeholder: "e.g. Manager, HR" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-extrabold text-muted-foreground uppercase", children: "Contact Number" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.ref2Contact, onChange: (e) => handleChange("ref2Contact", e.target.value), className: "h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full font-mono", placeholder: "Contact number" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setSubSection("emergency_contact");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                  " Previous Section"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setActiveTab("financial_employment");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md", children: [
                  "Next Step: Financial & Employment ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                ] })
              ] })
            ] }),
            activeTab === "family_dependents" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Baby, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Family Dependents Registry" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Dependent Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[200px]", children: "Relationship" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[165px] text-center", children: "Date of Birth" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[200px] text-center", children: "NID / Birth Cert No" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[60px] text-right", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
                  dependents.map((dep, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5 transition-colors font-semibold text-foreground/80", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: dep.depName, onChange: (e) => handleDepChange(index, "depName", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Sarah Rahman" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: dep.depRelation, onChange: () => {
                    }, options: [{
                      value: "Child",
                      label: "Child (Son/Daughter)"
                    }, {
                      value: "Spouse",
                      label: "Spouse (Husband/Wife)"
                    }, {
                      value: "Parent",
                      label: "Parent (Father/Mother)"
                    }] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dep.depDob, onChange: (e) => handleDepChange(index, "depDob", e.target.value), className: "h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: dep.depNid, onChange: (e) => handleDepChange(index, "depNid", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full text-center font-mono focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. 19951234567" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDependents((prev) => prev.filter((_, i) => i !== index)), className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "size-3.5" }) }) })
                  ] }, index)),
                  dependents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-muted-foreground text-xs italic", children: "No family dependents listed. Click the button below to add eligible family members." }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addDepRow, className: "h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                " Add Family Dependent Row"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setActiveTab("career_qualifications");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                  " Previous Step"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setActiveTab("verification_documents");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md", children: [
                  "Next Step: Verification & Docs ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                ] })
              ] })
            ] }),
            activeTab === "financial_employment" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Corporate Job Description & Charter" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 bg-muted/10 border border-border/30 rounded-lg p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Key Roles & Responsibilities" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.jobDescription, onChange: (e) => handleChange("jobDescription", e.target.value), className: "p-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full h-32 resize-none leading-relaxed", placeholder: "Describe key duties, system administration, coding standards, etc..." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Key Performance Indicators (KPIs) / Deliverables" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.keyDeliverables, onChange: (e) => handleChange("keyDeliverables", e.target.value), className: "p-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full h-24 resize-none leading-relaxed", placeholder: "Enter primary deliverables expected from this designation..." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Primary Reporting Manager" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.reportingLine, onChange: (e) => handleChange("reportingLine", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold text-primary bg-primary/5 w-full", placeholder: "e.g. Director, Systems" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Alternate reporting authority" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full", placeholder: "e.g. Chief Operations Officer" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 my-8 pt-2" })
            ] }),
            activeTab === "verification_documents" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Supporting Documents & PDF Annexes" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-lg overflow-hidden mt-4 bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Document Title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[220px]", children: "Document Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[300px]", children: "Attached File Name (Simulation)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[60px] text-right", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
                  otherDocs.map((doc, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5 transition-colors font-semibold text-foreground/80", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: doc.docTitle, onChange: (e) => handleDocChange(index, "docTitle", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. Police Clearance Certificate" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: doc.docType, onChange: () => {
                    }, options: [{
                      value: "PDF",
                      label: "PDF Document"
                    }, {
                      value: "DOCX",
                      label: "Microsoft Word (DOCX)"
                    }, {
                      value: "IMAGE",
                      label: "Image File (JPG/PNG)"
                    }, {
                      value: "EXCEL",
                      label: "Spreadsheet (XLS/CSV)"
                    }] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: doc.docFile, onChange: (e) => handleDocChange(index, "docFile", e.target.value), className: "h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full font-mono focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "e.g. police_clearance.pdf" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOtherDocs((prev) => prev.filter((_, i) => i !== index)), className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "size-3.5" }) }) })
                  ] }, index)),
                  otherDocs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-8 text-center text-muted-foreground text-xs italic", children: "No supporting documents uploaded yet. Click the button below to upload/attach one." }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addDocRow, className: "h-8.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                " Attach Supporting Document"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 my-8 pt-2" })
            ] }),
            activeTab === "verification_documents" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4.5 text-emerald-500 animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Official Auditor Background Verification" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-lg p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Background Check Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: form.verificationStatus, onChange: () => {
                  }, options: [{
                    value: "Verified",
                    label: "Verified & Cleared"
                  }, {
                    value: "Pending",
                    label: "Pending Audit"
                  }, {
                    value: "Rejected",
                    label: "Flagged / Denied"
                  }] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                    "Audited / Verified By ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.verifiedBy, onChange: (e) => handleChange("verifiedBy", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Verification Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.verificationDate, onChange: (e) => handleChange("verificationDate", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2 md:col-span-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Auditor Notes & Findings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.verificationNotes, onChange: (e) => handleChange("verificationNotes", e.target.value), className: "p-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full h-24 resize-none leading-relaxed" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setActiveTab("family_dependents");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                  " Previous Step"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "h-10 px-6 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-1.5 shadow-primary/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
                  " Save Employee Digital File"
                ] })
              ] })
            ] }),
            activeTab === "financial_employment" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 pb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Laptop, { className: "size-4.5 text-primary animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: "Corporate Equipment & Asset Assignment" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-lg p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Laptop Brand & Model" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.laptopBrand, onChange: (e) => handleChange("laptopBrand", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                    "Laptop Asset Tag ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.laptopAssetId, onChange: (e) => handleChange("laptopAssetId", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold w-full font-mono text-primary bg-primary/5" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Mobile Asset Model" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.mobileBrand, onChange: (e) => handleChange("mobileBrand", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Mobile Asset ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.mobileAssetId, onChange: (e) => handleChange("mobileAssetId", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Access Card Tag ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.accessCardId, onChange: (e) => handleChange("accessCardId", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono", placeholder: "Access card RFID" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Issuance Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.equipmentIssuedDate, onChange: (e) => handleChange("equipmentIssuedDate", e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold w-full font-mono" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-5 border-t border-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setActiveTab("personal_identity");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-5 rounded-xl bg-muted border border-border text-xs font-bold flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
                  " Previous Step"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setActiveTab("career_qualifications");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }, className: "h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md", children: [
                  "Next Step: Qualifications & Experience ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    addingField && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 rounded-lg shadow-2xl p-5 w-full max-w-sm overflow-hidden flex flex-col gap-4 animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 pb-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-extrabold text-foreground uppercase tracking-widest", children: [
          "Add Custom ",
          addingField.includes("Upazila") ? "Upazila/Thana" : "Post Office"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAddingField(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Custom Option Value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", autoFocus: true, value: customValue, onChange: (e) => setCustomValue(e.target.value), className: "h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full", placeholder: addingField.includes("Upazila") ? "e.g. Banani" : "e.g. Banani-11" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t border-border/30 pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAddingField(null), className: "h-9 px-4 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition duration-200", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAddCustomOption, className: "h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition duration-200", children: "Add Option" })
      ] })
    ] }) }),
    showSuccessModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 rounded-lg shadow-2xl p-6 w-full max-w-md overflow-hidden flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-xs animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-8 animate-pulse" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-extrabold text-foreground leading-tight", children: "Digital Profile Created!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The employee profile has been successfully saved to the database." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-muted/20 border border-border/30 rounded-xl p-4.5 text-left text-xs space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-bold", children: "Employee ID:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-primary", children: form.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Name (Eng):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: form.nameEng })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Designation:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: form.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Gross Salary:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold font-mono text-emerald-600 dark:text-emerald-400", children: [
            "৳",
            grossNum.toLocaleString("en-IN", {
              minimumFractionDigits: 2
            })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full gap-3 border-t border-border/30 pt-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/personnel-list", className: "h-10 px-5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition duration-200 flex-1 flex items-center justify-center", children: "Go to Directory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowSuccessModal(false);
          setForm((prev) => ({
            ...prev,
            id: "2025" + Math.floor(1e5 + Math.random() * 9e5),
            nameEng: "",
            nameBng: "",
            title: "",
            gross: ""
          }));
          setActiveTab("personal_identity");
        }, className: "h-10 px-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 flex-1", children: "Create Another" })
      ] })
    ] }) })
  ] });
}
export {
  AddEmployeePage as component
};
