import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  User, MapPin, Briefcase, DollarSign, Plus, Check, Mail, Phone,
  Calendar, Heart, FileText, CheckCircle2, ChevronRight, ArrowLeft, ArrowRight, Save, X, Info
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

function AddEmployeePage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Custom addition modal states
  const [addingField, setAddingField] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");

  // Address Options
  const [upazilas, setUpazilas] = useState(["Mirpur", "Uttara", "Dhanmondi", "Gulshan"]);
  const [postOffices, setPostOffices] = useState(["Mirpur-12", "Uttara Sector 6", "Dhanmondi-15", "Gulshan-2"]);

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
    emergencyContact: "",
    emergencyRelation: "Father",
    nomineeName: "Fatema Begum",

    // Company Info
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

    // Salary Info
    gross: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Synchronize permanent address if "Same as Present Address" checkbox is checked
  useEffect(() => {
    if (form.sameAsPresent) {
      setForm(prev => ({
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
    form.presCountry
  ]);

  // Handle Input Changes
  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  // Dynamic Salary Breakdowns
  const grossNum = parseFloat(form.gross) || 0;
  const basicVal = grossNum > 0 ? (grossNum * 0.60).toFixed(2) : "0.00";
  const houseRentVal = grossNum > 0 ? (grossNum * 0.25).toFixed(2) : "0.00";
  const medicalVal = grossNum > 0 ? (grossNum * 0.08).toFixed(2) : "0.00";
  const conveyanceVal = grossNum > 0 ? (grossNum * 0.04).toFixed(2) : "0.00";
  const foodVal = grossNum > 0 ? (grossNum * 0.03).toFixed(2) : "0.00";
  const festivalBonusVal = basicVal;
  const pfVal = grossNum > 0 ? (parseFloat(basicVal) * 0.10).toFixed(2) : "0.00";

  // Validate current tab fields or save completely
  const validateFields = () => {
    const required: string[] = [];
    
    // Global required fields across tabs
    required.push("id", "nameEng", "dob", "religion", "gender", "joinDate");
    required.push("dept", "empType", "title", "shift", "confirmDate");
    required.push("gross");

    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    required.forEach(field => {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {
      setShowSuccessModal(true);
    } else {
      // Find which section has errors and jump to it
      if (!form.nameEng || !form.dob || !form.religion || !form.gender || !form.joinDate) {
        setActiveTab("basic");
      } else if (!form.dept || !form.empType || !form.title || !form.shift || !form.confirmDate) {
        setActiveTab("company");
      } else if (!form.gross) {
        setActiveTab("salary");
      }
    }
  };

  const handleAddCustomOption = () => {
    if (!customValue.trim() || !addingField) return;
    if (addingField.includes("Upazila")) {
      setUpazilas(prev => [...prev, customValue.trim()]);
      if (addingField.startsWith("pres")) {
        handleChange("presUpazila", customValue.trim());
      } else {
        handleChange("permUpazila", customValue.trim());
      }
    } else if (addingField.includes("PostOffice")) {
      setPostOffices(prev => [...prev, customValue.trim()]);
      if (addingField.startsWith("pres")) {
        handleChange("presPostOffice", customValue.trim());
      } else {
        handleChange("permPostOffice", customValue.trim());
      }
    }
    setAddingField(null);
    setCustomValue("");
  };

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
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Personnel Info</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Add Employee File</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">Add New Employee Digital File</h1>
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
            
            {/* Step Selection Left Navigation Card */}
            <div className="lg:col-span-1 bg-card border border-border/80 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/50 border-b border-border/20 mb-1">
                Form Directories
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all duration-200 ${
                  activeTab === "basic"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="size-4 shrink-0" />
                <span>1. Basic Information</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("address_contact")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all duration-200 ${
                  activeTab === "address_contact"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin className="size-4 shrink-0" />
                <span>2. Addresses & Contact</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("company")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all duration-200 ${
                  activeTab === "company"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Briefcase className="size-4 shrink-0" />
                <span>3. Company Lifecycle</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("salary")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all duration-200 ${
                  activeTab === "salary"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <DollarSign className="size-4 shrink-0" />
                <span>4. Salary File</span>
              </button>

              <div className="pt-4 mt-2 border-t border-border/20 px-3 space-y-2">
                <div className="flex items-start gap-2 bg-muted/30 border border-border/40 p-3 rounded-xl text-[10px] text-muted-foreground leading-relaxed">
                  <Info className="size-3.5 text-primary shrink-0 mt-0.5" />
                  <span>Fields marked with <span className="text-rose-500 font-bold">*</span> are system mandatory.</span>
                </div>
              </div>
            </div>

            {/* Core Form Card Section */}
            <div className="lg:col-span-3 bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-xs min-h-[500px]">
              
              {/* TAB 1: BASIC INFORMATION */}
              {activeTab === "basic" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <User className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">Primary Identity Dossier</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {/* Emp ID System */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Emp ID (System) <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.id}
                        onChange={e => handleChange("id", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-muted/20 text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.id ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                        placeholder="System Auto ID"
                      />
                    </div>

                    {/* Emp ID Comp */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Emp ID (Comp.)</label>
                      <input
                        type="text"
                        value={form.offcId}
                        onChange={e => handleChange("offcId", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        placeholder="e.g. COMP-10293"
                      />
                    </div>

                    {/* Name English */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Name (Eng) <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.nameEng}
                        onChange={e => handleChange("nameEng", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.nameEng ? "border-rose-400 dark:border-rose-900/60 animate-shake" : "border-border"
                        }`}
                        placeholder="Enter English Name"
                      />
                    </div>

                    {/* Name Bangla */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Name (Bng)</label>
                      <input
                        type="text"
                        value={form.nameBng}
                        onChange={e => handleChange("nameBng", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        placeholder="বাংলায় নাম লিখুন"
                      />
                    </div>

                    {/* Marital Status */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Marital Status</label>
                      <select
                        value={form.maritalStatus}
                        onChange={e => handleChange("maritalStatus", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Date of Birth <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.dob}
                        onChange={e => handleChange("dob", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.dob ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                      />
                    </div>

                    {/* Religion */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Religion <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        value={form.religion}
                        onChange={e => handleChange("religion", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.religion ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                      >
                        <option value="Islam">Islam</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="Buddhism">Buddhism</option>
                        <option value="Christianity">Christianity</option>
                      </select>
                    </div>

                    {/* National ID */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">National ID</label>
                      <input
                        type="text"
                        value={form.nid}
                        onChange={e => handleChange("nid", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        placeholder="NID number"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Gender <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        value={form.gender}
                        onChange={e => handleChange("gender", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.gender ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Birth Reg No */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Birth Reg No</label>
                      <input
                        type="text"
                        value={form.birthRegNo}
                        onChange={e => handleChange("birthRegNo", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        placeholder="Birth registration no"
                      />
                    </div>

                    {/* Blood Group */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Blood Group</label>
                      <select
                        value={form.blood}
                        onChange={e => handleChange("blood", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      >
                        <option value="A (+ve)">A (+ve)</option>
                        <option value="A (-ve)">A (-ve)</option>
                        <option value="B (+ve)">B (+ve)</option>
                        <option value="B (-ve)">B (-ve)</option>
                        <option value="O (+ve)">O (+ve)</option>
                        <option value="O (-ve)">O (-ve)</option>
                        <option value="AB (+ve)">AB (+ve)</option>
                        <option value="AB (-ve)">AB (-ve)</option>
                      </select>
                    </div>

                    {/* Passport No */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Passport No</label>
                      <input
                        type="text"
                        value={form.passportNo}
                        onChange={e => handleChange("passportNo", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        placeholder="Passport number"
                      />
                    </div>

                    {/* Education Level */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Education Level</label>
                      <input
                        type="text"
                        value={form.education}
                        onChange={e => handleChange("education", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
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
                        onChange={e => handleChange("joinDate", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.joinDate ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Family Information Panel */}
                  <div className="border-t border-border/30 pt-6 mt-2 space-y-4">
                    <div className="flex items-center gap-2 pb-1">
                      <Heart className="size-4.5 text-primary" />
                      <h3 className="text-[11px] font-extrabold text-foreground uppercase tracking-widest">Family Details & Ties</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-2xl p-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Father Name (Eng)</label>
                        <input
                          type="text"
                          value={form.fatherNameEng}
                          onChange={e => handleChange("fatherNameEng", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Father Name (Bng)</label>
                        <input
                          type="text"
                          value={form.fatherNameBng}
                          onChange={e => handleChange("fatherNameBng", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Mother Name (Eng)</label>
                        <input
                          type="text"
                          value={form.motherNameEng}
                          onChange={e => handleChange("motherNameEng", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Mother Name (Bng)</label>
                        <input
                          type="text"
                          value={form.motherNameBng}
                          onChange={e => handleChange("motherNameBng", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                        />
                      </div>

                      {/* Spouse Context */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Spouse Name (Eng)</label>
                        <input
                          type="text"
                          disabled={form.maritalStatus !== "Married"}
                          value={form.maritalStatus === "Married" ? form.spouseNameEng : ""}
                          onChange={e => handleChange("spouseNameEng", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full disabled:bg-muted/30 disabled:text-muted-foreground"
                          placeholder={form.maritalStatus !== "Married" ? "Not Married" : ""}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Spouse Name (Bng)</label>
                        <input
                          type="text"
                          disabled={form.maritalStatus !== "Married"}
                          value={form.maritalStatus === "Married" ? form.spouseNameBng : ""}
                          onChange={e => handleChange("spouseNameBng", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full disabled:bg-muted/30 disabled:text-muted-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Spouse NID</label>
                        <input
                          type="text"
                          disabled={form.maritalStatus !== "Married"}
                          value={form.maritalStatus === "Married" ? form.spouseNid : ""}
                          onChange={e => handleChange("spouseNid", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full disabled:bg-muted/30 disabled:text-muted-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Spouse Contact No</label>
                        <input
                          type="text"
                          disabled={form.maritalStatus !== "Married"}
                          value={form.maritalStatus === "Married" ? form.spouseContactNo : ""}
                          onChange={e => handleChange("spouseContactNo", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full disabled:bg-muted/30 disabled:text-muted-foreground"
                        />
                      </div>

                      {/* Documents */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Driving License</label>
                        <input
                          type="text"
                          value={form.drivingLicense}
                          onChange={e => handleChange("drivingLicense", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Professional Membership No</label>
                        <input
                          type="text"
                          value={form.membershipNo}
                          onChange={e => handleChange("membershipNo", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => setActiveTab("address_contact")}
                      className="h-10 px-5 rounded-xl bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/10 transition duration-200"
                    >
                      Next Step <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: ADDRESSES & CONTACT INFO */}
              {activeTab === "address_contact" && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  
                  {/* Addresses Split View */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    {/* PRESENT ADDRESS CARD */}
                    <div className="bg-muted/10 border border-border/30 rounded-2xl p-5 space-y-4 relative">
                      <div className="border-b border-border/30 pb-2.5 flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        <h3 className="text-xs font-extrabold uppercase text-foreground tracking-widest">Present Address</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Country</label>
                          <input
                            type="text"
                            value={form.presCountry}
                            onChange={e => handleChange("presCountry", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Division</label>
                          <select
                            value={form.presDivision}
                            onChange={e => handleChange("presDivision", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-bold focus:outline-none w-full"
                          >
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rajshahi">Rajshahi</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">District</label>
                          <input
                            type="text"
                            value={form.presDistrict}
                            onChange={e => handleChange("presDistrict", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        {/* Upazila/Thana with inline adder */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase flex items-center justify-between">
                            <span>Upazila/Thana</span>
                            <button
                              type="button"
                              onClick={() => setAddingField("presUpazila")}
                              className="text-[9px] font-extrabold text-primary hover:underline"
                            >
                              + add
                            </button>
                          </label>
                          <select
                            value={form.presUpazila}
                            onChange={e => handleChange("presUpazila", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-bold focus:outline-none w-full"
                          >
                            {upazilas.map(u => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                        </div>

                        {/* Post Office with inline adder */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase flex items-center justify-between">
                            <span>Post Office</span>
                            <button
                              type="button"
                              onClick={() => setAddingField("presPostOffice")}
                              className="text-[9px] font-extrabold text-primary hover:underline"
                            >
                              + add
                            </button>
                          </label>
                          <select
                            value={form.presPostOffice}
                            onChange={e => handleChange("presPostOffice", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-bold focus:outline-none w-full"
                          >
                            {postOffices.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Village/House(Eng)</label>
                          <input
                            type="text"
                            value={form.presVillageEng}
                            onChange={e => handleChange("presVillageEng", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Village/House(Bng)</label>
                          <input
                            type="text"
                            value={form.presVillageBng}
                            onChange={e => handleChange("presVillageBng", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Road</label>
                          <input
                            type="text"
                            value={form.presRoad}
                            onChange={e => handleChange("presRoad", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Others</label>
                          <input
                            type="text"
                            value={form.presOthers}
                            onChange={e => handleChange("presOthers", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PERMANENT ADDRESS CARD */}
                    <div className="bg-muted/10 border border-border/30 rounded-2xl p-5 space-y-4 relative">
                      <div className="border-b border-border/30 pb-2.5 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-primary" />
                          <h3 className="text-xs font-extrabold uppercase text-foreground tracking-widest">Permanent Address</h3>
                        </div>
                        <label className="flex items-center gap-1.5 text-[9px] font-extrabold text-primary cursor-pointer select-none bg-primary/10 px-2.5 py-1 rounded-lg">
                          <input
                            type="checkbox"
                            checked={form.sameAsPresent}
                            onChange={e => handleChange("sameAsPresent", e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary size-3.5 cursor-pointer"
                          />
                          Same as Present
                        </label>
                      </div>

                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ${form.sameAsPresent ? "opacity-60 pointer-events-none" : ""}`}>
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Country</label>
                          <input
                            type="text"
                            value={form.permCountry}
                            onChange={e => handleChange("permCountry", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Division</label>
                          <select
                            value={form.permDivision}
                            onChange={e => handleChange("permDivision", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-bold focus:outline-none w-full"
                          >
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rajshahi">Rajshahi</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">District</label>
                          <input
                            type="text"
                            value={form.permDistrict}
                            onChange={e => handleChange("permDistrict", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        {/* Upazila/Thana with inline adder */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase flex items-center justify-between">
                            <span>Upazila/Thana</span>
                            <button
                              type="button"
                              disabled={form.sameAsPresent}
                              onClick={() => setAddingField("permUpazila")}
                              className="text-[9px] font-extrabold text-primary hover:underline disabled:no-underline disabled:text-muted-foreground/50"
                            >
                              + add
                            </button>
                          </label>
                          <select
                            value={form.permUpazila}
                            onChange={e => handleChange("permUpazila", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-bold focus:outline-none w-full"
                          >
                            {upazilas.map(u => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                        </div>

                        {/* Post Office with inline adder */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase flex items-center justify-between">
                            <span>Post Office</span>
                            <button
                              type="button"
                              disabled={form.sameAsPresent}
                              onClick={() => setAddingField("permPostOffice")}
                              className="text-[9px] font-extrabold text-primary hover:underline disabled:no-underline disabled:text-muted-foreground/50"
                            >
                              + add
                            </button>
                          </label>
                          <select
                            value={form.permPostOffice}
                            onChange={e => handleChange("permPostOffice", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-bold focus:outline-none w-full"
                          >
                            {postOffices.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Village/House(Eng)</label>
                          <input
                            type="text"
                            value={form.permVillageEng}
                            onChange={e => handleChange("permVillageEng", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Village/House(Bng)</label>
                          <input
                            type="text"
                            value={form.permVillageBng}
                            onChange={e => handleChange("permVillageBng", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Road</label>
                          <input
                            type="text"
                            value={form.permRoad}
                            onChange={e => handleChange("permRoad", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Others</label>
                          <input
                            type="text"
                            value={form.permOthers}
                            onChange={e => handleChange("permOthers", e.target.value)}
                            className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* CONTACT CHANNELS */}
                  <div className="space-y-4 pt-6 border-t border-border/20">
                    <div className="flex items-center gap-2 pb-1">
                      <Phone className="size-4.5 text-primary" />
                      <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest">Contact Reachability & Info</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-muted/10 border border-border/30 rounded-2xl p-5">
                      {/* Office Email */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Office Email</label>
                        <input
                          type="email"
                          value={form.offcEmail}
                          onChange={e => handleChange("offcEmail", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                          placeholder="corporate@pakizasoftware.com"
                        />
                      </div>

                      {/* Office Mobile */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Office Mobile</label>
                        <input
                          type="text"
                          value={form.offcMobile}
                          onChange={e => handleChange("offcMobile", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                          placeholder="Corporate mobile no"
                        />
                      </div>

                      {/* Office Phone Ex */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Office Phone (Ex.)</label>
                        <input
                          type="text"
                          value={form.offcPhoneEx}
                          onChange={e => handleChange("offcPhoneEx", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                          placeholder="Extension No"
                        />
                      </div>

                      {/* Personal Email */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Personal Email</label>
                        <input
                          type="email"
                          value={form.personalEmail}
                          onChange={e => handleChange("personalEmail", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                          placeholder="personal@gmail.com"
                        />
                      </div>

                      {/* Personal Contact */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Personal Contact No</label>
                        <input
                          type="text"
                          value={form.personalContact}
                          onChange={e => handleChange("personalContact", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        />
                      </div>

                      {/* Emergency Contact */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Emergency Contact No</label>
                        <input
                          type="text"
                          value={form.emergencyContact}
                          onChange={e => handleChange("emergencyContact", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        />
                      </div>

                      {/* Emergency Relation */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Emergency Contact Relation</label>
                        <input
                          type="text"
                          value={form.emergencyRelation}
                          onChange={e => handleChange("emergencyRelation", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        />
                      </div>

                      {/* Nominee Name */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-extrabold text-muted-foreground uppercase">Nominee Name</label>
                        <input
                          type="text"
                          value={form.nomineeName}
                          onChange={e => handleChange("nomineeName", e.target.value)}
                          className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => setActiveTab("basic")}
                      className="h-10 px-5 rounded-xl bg-muted border border-border hover:bg-muted/80 text-xs font-bold flex items-center gap-1.5 transition duration-200"
                    >
                      <ArrowLeft className="size-4" /> Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("company")}
                      className="h-10 px-5 rounded-xl bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/10 transition duration-200"
                    >
                      Next Step <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPANY LIFECYCLE INFO */}
              {activeTab === "company" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <Briefcase className="size-4.5 text-primary" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">Company Assignment & Lifecycle</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {/* Department */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Department <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        value={form.dept}
                        onChange={e => handleChange("dept", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.dept ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                      >
                        <option value="Implementation & Business Analysis">Implementation & Business Analysis</option>
                        <option value="HR, Admin and Compliance">HR, Admin and Compliance</option>
                        <option value="Software Development">Software Development</option>
                        <option value="Quality Assurance">Quality Assurance</option>
                      </select>
                    </div>

                    {/* Working Area */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Working Area</label>
                      <input
                        type="text"
                        value={form.workingArea}
                        onChange={e => handleChange("workingArea", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                      />
                    </div>

                    {/* Section */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Section</label>
                      <input
                        type="text"
                        value={form.sect}
                        onChange={e => handleChange("sect", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                      />
                    </div>

                    {/* Employee Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Employee Type <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        value={form.empType}
                        onChange={e => handleChange("empType", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.empType ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                      >
                        <option value="Office Executive">Office Executive</option>
                        <option value="Factory worker">Factory worker</option>
                        <option value="Support Staff">Support Staff</option>
                      </select>
                    </div>

                    {/* Designation / Title */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Designation <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={e => handleChange("title", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.title ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>

                    {/* Job Nature */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Job Nature</label>
                      <input
                        type="text"
                        value={form.jobNature}
                        onChange={e => handleChange("jobNature", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                      />
                    </div>

                    {/* Unit */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Unit</label>
                      <input
                        type="text"
                        value={form.unit}
                        onChange={e => handleChange("unit", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                      />
                    </div>

                    {/* Line */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Line</label>
                      <input
                        type="text"
                        value={form.line}
                        onChange={e => handleChange("line", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                      />
                    </div>

                    {/* Grade */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Grade</label>
                      <input
                        type="text"
                        value={form.grade}
                        onChange={e => handleChange("grade", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                      />
                    </div>

                    {/* Shift */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Shift <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        value={form.shift}
                        onChange={e => handleChange("shift", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.shift ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                      >
                        <option value="General Shift">General Shift</option>
                        <option value="Night Shift">Night Shift</option>
                        <option value="Roster Shift">Roster Shift</option>
                      </select>
                    </div>

                    {/* Employment Status */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Employment Status</label>
                      <select
                        value={form.empStatus}
                        onChange={e => handleChange("empStatus", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold focus:outline-none w-full"
                      >
                        <option value="Probation">Probation</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Contractual">Contractual</option>
                      </select>
                    </div>

                    {/* Probation Period */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Probation Period</label>
                      <input
                        type="text"
                        value={form.probationPeriod}
                        onChange={e => handleChange("probationPeriod", e.target.value)}
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
                        onChange={e => handleChange("confirmDate", e.target.value)}
                        className={`h-10 px-3.5 rounded-xl border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full ${
                          errors.confirmDate ? "border-rose-400 dark:border-rose-900/60" : "border-border"
                        }`}
                      />
                    </div>

                    {/* Default Holiday */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Default Holiday</label>
                      <input
                        type="text"
                        value={form.holiday}
                        onChange={e => handleChange("holiday", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                      />
                    </div>

                    {/* Set Manager */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Set Manager</label>
                      <input
                        type="text"
                        value={form.setManager}
                        onChange={e => handleChange("setManager", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none w-full"
                      />
                    </div>

                    {/* Recruitment Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Recruitment Type</label>
                      <select
                        value={form.recruitmentType}
                        onChange={e => handleChange("recruitmentType", e.target.value)}
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-bold focus:outline-none w-full"
                      >
                        <option value="New">New</option>
                        <option value="Re-hire">Re-hire</option>
                        <option value="Promotion Transfer">Promotion Transfer</option>
                      </select>
                    </div>
                  </div>

                  {/* RC Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Recruitment Notes (RC Notes)</label>
                    <textarea
                      value={form.rcNotes}
                      onChange={e => handleChange("rcNotes", e.target.value)}
                      className="p-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full h-24 resize-none"
                      placeholder="Add details regarding references, background check or technical interview notes..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => setActiveTab("address_contact")}
                      className="h-10 px-5 rounded-xl bg-muted border border-border hover:bg-muted/80 text-xs font-bold flex items-center gap-1.5 transition duration-200"
                    >
                      <ArrowLeft className="size-4" /> Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("salary")}
                      className="h-10 px-5 rounded-xl bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/10 transition duration-200"
                    >
                      Next Step <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: COMPENSATION & SALARY */}
              {activeTab === "salary" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/30 pb-3 flex items-center gap-2">
                    <DollarSign className="size-4.5 text-emerald-500" />
                    <h2 className="text-xs font-extrabold text-foreground uppercase tracking-widest">Salary Configuration Sheet</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {/* Gross Salary Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                        Gross Salary <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60">৳</span>
                        <input
                          type="number"
                          value={form.gross}
                          onChange={e => handleChange("gross", e.target.value)}
                          className={`h-10 pl-7.5 pr-3.5 rounded-xl border bg-emerald-500/5 text-sm font-extrabold font-mono text-emerald-700 dark:text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full ${
                            errors.gross ? "border-rose-400 dark:border-rose-900/60" : "border-emerald-500/20"
                          }`}
                          placeholder="e.g. 45000"
                        />
                      </div>
                    </div>

                    {/* Basic Salary */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Basic Salary (60%)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">৳</span>
                        <input
                          type="text"
                          readOnly
                          value={parseFloat(basicVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* House Rent */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">House Rent (25%)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">৳</span>
                        <input
                          type="text"
                          readOnly
                          value={parseFloat(houseRentVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Medical */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Medical (8%)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">৳</span>
                        <input
                          type="text"
                          readOnly
                          value={parseFloat(medicalVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Conveyance */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Conveyance (4%)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">৳</span>
                        <input
                          type="text"
                          readOnly
                          value={parseFloat(conveyanceVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Food */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Food (3%)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">৳</span>
                        <input
                          type="text"
                          readOnly
                          value={parseFloat(foodVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Festival Bonus */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Festival Bonus (100% of Basic)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">৳</span>
                        <input
                          type="text"
                          readOnly
                          value={parseFloat(festivalBonusVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Provident Fund */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Provident Fund (10% of Basic)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/60">৳</span>
                        <input
                          type="text"
                          readOnly
                          value={parseFloat(pfVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          className="h-10 pl-7.5 pr-3.5 rounded-xl border border-border bg-muted/20 text-xs font-bold font-mono text-foreground/80 w-full focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      type="button"
                      onClick={() => setActiveTab("company")}
                      className="h-10 px-5 rounded-xl bg-muted border border-border hover:bg-muted/80 text-xs font-bold flex items-center gap-1.5 transition duration-200"
                    >
                      <ArrowLeft className="size-4" /> Previous
                    </button>
                    <button
                      type="submit"
                      className="h-10 px-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-extrabold shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-300 flex items-center gap-1.5"
                    >
                      <Save className="size-4" /> Save Employee File
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
              <button onClick={() => setAddingField(null)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Custom Option Value</label>
              <input
                type="text"
                autoFocus
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
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
              <CheckCircle2 className="size-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-foreground leading-tight">Digital Profile Created!</h2>
              <p className="text-xs text-muted-foreground">The employee dossier has been successfully committed to the database.</p>
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
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">৳{grossNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex w-full gap-3 border-t border-border/30 pt-4 mt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  window.close();
                }}
                className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition duration-200 flex-1"
              >
                Close Tab
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setForm(prev => ({
                    ...prev,
                    id: "2025" + Math.floor(100000 + Math.random() * 900000),
                    nameEng: "",
                    nameBng: "",
                    title: "",
                    gross: "",
                  }));
                  setActiveTab("basic");
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
