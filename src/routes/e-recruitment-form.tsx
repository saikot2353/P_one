import { useState, useRef } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight,
  UserPlus,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Camera,
  Upload,
  Trash2,
  Copy,
  CheckCircle2,
  Info,
  Contact2,
  Search,
  Plus,
  FileText,
  ShieldCheck,
  Mail,
  Heart
} from "lucide-react";

export const Route = createFileRoute("/e-recruitment-form")({
  component: ERecruitmentForm,
});

// ─── Reusable Field Components ───────────────────────────────────────────────

function FieldInput({
  label,
  required,
  readOnly,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-200
          ${readOnly
            ? "bg-muted/60 border-border/30 text-primary font-bold cursor-default"
            : "bg-background border-border/80 text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
          }`}
      />
    </div>
  );
}

function FieldSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <span className="inline-flex items-center gap-0.5 text-[8.5px] font-black text-primary/80 tracking-wider uppercase bg-primary/5 px-1.5 py-0.5 rounded-md border border-primary/10 select-none">
          <Search className="size-2 text-primary" /> Searchable
        </span>
      </div>
      <SearchableSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder || `Search & select ${label}...`}
      />
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
      <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs">
        {icon}
      </div>
      <div>
        <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">{title}</h2>
        {subtitle && <p className="text-[10px] text-muted-foreground/75 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Option Matrices ─────────────────────────────────────────────────────────

const religionOptions = [
  { value: "Islam", label: "Islam" },
  { value: "Hindu", label: "Hindu" },
  { value: "Christian", label: "Christian" },
  { value: "Buddhist", label: "Buddhist" },
  { value: "Other", label: "Other" }
];

const maritalStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" }
];

const divisionOptions = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"].map(d => ({ value: d, label: d }));
const districtOptions = ["Dhaka", "Gazipur", "Narayanganj", "Chattogram", "Sylhet", "Comilla"].map(d => ({ value: d, label: d }));
const thanaOptions = ["Uttara", "Mirpur", "Motijheel", "Tongi", "Gazipur Sadar", "Hathazari", "Raujan", "Boalkhali"].map(t => ({ value: t, label: t }));
const postOfficeOptions = ["Uttara Model Town", "Mirpur-10", "Hathazari", "Raujan Bazar"].map(p => ({ value: p, label: p }));
const countryOptions = [{ value: "Bangladesh", label: "Bangladesh" }];

// ─── Main Component ──────────────────────────────────────────────────────────

function ERecruitmentForm() {
  const router = useRouter();
  const [copyAddress, setCopyAddress] = useState(false);

  // Candidate Photo Preview
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoFileRef = useRef<HTMLInputElement>(null);

  // Basic Details States
  const [nameEng, setNameEng] = useState("");
  const [nameBng, setNameBng] = useState("");
  const [dob, setDob] = useState("");
  const [religion, setReligion] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  const [birthReg, setBirthReg] = useState("");

  const [fatherEng, setFatherEng] = useState("");
  const [fatherBng, setFatherBng] = useState("");
  const [motherEng, setMotherEng] = useState("");
  const [motherBng, setMotherBng] = useState("");

  const [personalContact, setPersonalContact] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");

  // Additional Contact Person details
  const [contactPerson, setContactPerson] = useState("");
  const [relationship, setRelationship] = useState("");

  // Address: Present States
  const [presDivision, setPresDivision] = useState("");
  const [presDistrict, setPresDistrict] = useState("");
  const [presThana, setPresThana] = useState("");
  const [presPostOffice, setPresPostOffice] = useState("");
  const [presVillage, setPresVillage] = useState("");
  const [presRoad, setPresRoad] = useState("");
  const [presCountry, setPresCountry] = useState("Bangladesh");

  // Address: Permanent States
  const [permDivision, setPermDivision] = useState("");
  const [permDistrict, setPermDistrict] = useState("");
  const [permThana, setPermThana] = useState("");
  const [permPostOffice, setPermPostOffice] = useState("");
  const [permVillage, setPermVillage] = useState("");
  const [permRoad, setPermRoad] = useState("");
  const [permCountry, setPermCountry] = useState("Bangladesh");

  // Dynamic Lists
  const [academics, setAcademics] = useState<any[]>([
    { id: "1", title: "", institution: "", year: "", result: "", file: null }
  ]);
  const [experiences, setExperiences] = useState<any[]>([
    { id: "1", company: "", designation: "", from: "", to: "", reason: "", file: null }
  ]);

  // Nominee Dossier States
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [nomineeNidReg, setNomineeNidReg] = useState("");
  const [nomineeContact, setNomineeContact] = useState("");

  // Compute Full Addresses
  const fullPresentAddress = [
    presVillage ? `House/Village: ${presVillage}` : "",
    presRoad ? `Road/Block: ${presRoad}` : "",
    presPostOffice ? `PO: ${presPostOffice}` : "",
    presThana ? `Thana: ${presThana}` : "",
    presDistrict ? `District: ${presDistrict}` : "",
    presDivision ? `Division: ${presDivision}` : "",
    presCountry
  ].filter(Boolean).join(", ");

  const computedPermDivision = copyAddress ? presDivision : permDivision;
  const computedPermDistrict = copyAddress ? presDistrict : permDistrict;
  const computedPermThana = copyAddress ? presThana : permThana;
  const computedPermPostOffice = copyAddress ? presPostOffice : permPostOffice;
  const computedPermVillage = copyAddress ? presVillage : permVillage;
  const computedPermRoad = copyAddress ? presRoad : permRoad;
  const computedPermCountry = copyAddress ? presCountry : permCountry;

  const fullPermanentAddress = [
    computedPermVillage ? `House/Village: ${computedPermVillage}` : "",
    computedPermRoad ? `Road/Block: ${computedPermRoad}` : "",
    computedPermPostOffice ? `PO: ${computedPermPostOffice}` : "",
    computedPermThana ? `Thana: ${computedPermThana}` : "",
    computedPermDistrict ? `District: ${computedPermDistrict}` : "",
    computedPermDivision ? `Division: ${computedPermDivision}` : "",
    computedPermCountry
  ].filter(Boolean).join(", ");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Academic Grid Operations
  const handleAddAcademic = () => {
    setAcademics([...academics, { id: Date.now().toString(), title: "", institution: "", year: "", result: "", file: null }]);
  };
  const handleRemoveAcademic = (id: string) => {
    if (academics.length > 1) setAcademics(academics.filter(a => a.id !== id));
  };
  const handleAcademicChange = (id: string, key: string, value: any) => {
    setAcademics(academics.map(a => a.id === id ? { ...a, [key]: value } : a));
  };

  // Experience Grid Operations
  const handleAddExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), company: "", designation: "", from: "", to: "", reason: "", file: null }]);
  };
  const handleRemoveExperience = (id: string) => {
    if (experiences.length > 1) setExperiences(experiences.filter(e => e.id !== id));
  };
  const handleExperienceChange = (id: string, key: string, value: any) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [key]: value } : e));
  };

  const handleSubmit = () => {
    if (!nameEng || !dob || !religion || !maritalStatus || !personalContact) {
      alert("Please fill in all required (*) fields.");
      return;
    }

    const saved = localStorage.getItem("recruitment_candidates");
    const parsed = saved ? JSON.parse(saved) : [];
    const newCandidate = {
      empIdTemp: `PAL${String(parsed.length + 1).padStart(6, "0")}`,
      nameEng,
      nameBng,
      doj: new Date().toISOString().split("T")[0],
      personalContact,
      personalEmail,
      department: "RMG Operation",
      designation: "Operator",
      assessStatus: "IE Pending",
      dob,
      religion,
      maritalStatus,
      nidNumber,
      birthReg,
      fatherNameEng: fatherEng,
      fatherNameBng: fatherBng,
      motherNameEng: motherEng,
      motherNameBng: motherBng,
      emergencyContact,
      contactPerson,
      relationship,
      photo: photoPreview,
      presentAddress: fullPresentAddress,
      permanentAddress: fullPermanentAddress,
      academics,
      experiences,
      nominee: {
        name: nomineeName,
        relation: nomineeRelation,
        nidReg: nomineeNidReg,
        contact: nomineeContact
      }
    };

    localStorage.setItem("recruitment_candidates", JSON.stringify([...parsed, newCandidate]));
    alert("✅ Candidate registered successfully under Public e-Recruitment Portal!");
    router.navigate({ to: "/recruitment-basic-info-list" });
  };

  const handleReset = () => {
    setNameEng("");
    setNameBng("");
    setDob("");
    setReligion("");
    setMaritalStatus("");
    setNidNumber("");
    setBirthReg("");
    setFatherEng("");
    setFatherBng("");
    setMotherEng("");
    setMotherBng("");
    setPersonalContact("");
    setEmergencyContact("");
    setPersonalEmail("");
    setContactPerson("");
    setRelationship("");
    setPhotoPreview(null);
    setAcademics([{ id: "1", title: "", institution: "", year: "", result: "", file: null }]);
    setExperiences([{ id: "1", company: "", designation: "", from: "", to: "", reason: "", file: null }]);
    setNomineeName("");
    setNomineeRelation("");
    setNomineeNidReg("");
    setNomineeContact("");
    setCopyAddress(false);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full">

          {/* Breadcrumb & Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">e-Recruitment Form</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <UserPlus className="size-5.5 text-primary" />
                <span>e-Recruitment Application Form</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2 shadow-2xs">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Security Active (SSL Encrypted)</span>
            </div>
          </div>

          {/* Intro Card */}
          <div className="bg-card rounded-lg border border-border/80 p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="space-y-1.5 z-10 relative">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight text-primary">Employment Application Portal</h2>
              <p className="text-xs text-muted-foreground font-medium max-w-3xl leading-relaxed">
                Please complete the application form below with your correct personal, contact, academic, and professional details. Fields marked with <span className="text-red-500 font-bold">*</span> are mandatory.
              </p>
            </div>
          </div>

          {/* ── SECTION 1: CANDIDATE IDENTITY ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<User className="size-4" />}
              title="Candidate Profile & Identity"
              subtitle="Primary applicant identification and document credentials"
            />
            <div className="p-6 flex flex-col lg:flex-row gap-8">
              {/* Photo Upload Zone */}
              <div className="w-full lg:w-72 shrink-0 flex flex-col items-center gap-4 bg-muted/10 border border-border/60 rounded-lg p-5">
                <span className="text-[11px] font-black uppercase tracking-wider text-foreground/80">Candidate Photo</span>
                <div
                  onClick={() => photoFileRef.current?.click()}
                  className="relative w-40 h-40 rounded-lg border-2 border-dashed border-border/85 hover:border-primary/50 bg-card hover:bg-muted/10 transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center group"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Candidate Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/50 group-hover:text-primary/70 text-center p-3">
                      <Camera className="size-8 stroke-[1.5]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Upload Portrait</span>
                      <span className="text-[8px] text-muted-foreground/60">Max 2MB (JPG/PNG)</span>
                    </div>
                  )}
                  {photoPreview && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">Replace Photo</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => photoFileRef.current?.click()}
                    className="flex-1 h-8 rounded-lg bg-card border border-border/85 text-[10px] font-bold text-foreground/80 hover:text-primary hover:border-primary/30 transition-all shadow-3xs"
                  >
                    Select File
                  </button>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="h-8 px-3 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 transition-all"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
                <input ref={photoFileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>

              {/* Identity Details Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
                <FieldInput label="Candidate Name (ENG)" required placeholder="John Doe" value={nameEng} onChange={e => setNameEng(e.target.value)} />
                <FieldInput label="Candidate Name (BNG)" placeholder="জন ডো" value={nameBng} onChange={e => setNameBng(e.target.value)} />
                <FieldInput label="Date of Birth (DOB)" required type="date" value={dob} onChange={e => setDob(e.target.value)} />

                <FieldSelect label="Religion" required value={religion} onChange={setReligion} options={religionOptions} />
                <FieldSelect label="Marital Status" required value={maritalStatus} onChange={setMaritalStatus} options={maritalStatusOptions} />
                <FieldInput label="NID Number" placeholder="e.g. 5534XXXXXXXX" value={nidNumber} onChange={e => setNidNumber(e.target.value)} />

                <FieldInput label="Birth Registration No" placeholder="e.g. 199XXXXXXXXXXXXXX" value={birthReg} onChange={e => setBirthReg(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── SECTION 2: FAMILY & PRIMARY CONTACT ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<Contact2 className="size-4" />}
              title="Family Details & Contacts"
              subtitle="Parental information, personal contact details, and emergency references"
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
              <FieldInput label="Father Name (ENG)" placeholder="Father's English Name" value={fatherEng} onChange={e => setFatherEng(e.target.value)} />
              <FieldInput label="Father Name (BNG)" placeholder="বাবার বাংলা নাম" value={fatherBng} onChange={e => setFatherBng(e.target.value)} />
              <FieldInput label="Mother Name (ENG)" placeholder="Mother's English Name" value={motherEng} onChange={e => setMotherEng(e.target.value)} />

              <FieldInput label="Mother Name (BNG)" placeholder="মায়ের বাংলা নাম" value={motherBng} onChange={e => setMotherBng(e.target.value)} />
              <FieldInput label="Personal Contact No" required placeholder="e.g. 017XXXXXXXX" value={personalContact} onChange={e => setPersonalContact(e.target.value)} />
              <FieldInput label="Emergency Contact No" placeholder="Alternative contact number" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} />

              <FieldInput label="Personal Email" type="email" placeholder="john.doe@example.com" value={personalEmail} onChange={e => setPersonalEmail(e.target.value)} />
              <FieldInput label="Contact Person Name" placeholder="Emergency reference name" value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
              <FieldInput label="Relationship" placeholder="e.g. Brother, Wife" value={relationship} onChange={e => setRelationship(e.target.value)} />
            </div>
          </div>

          {/* ── SECTION 3: ADDRESS ENROLLMENT ── */}
          {/* Present Address */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<MapPin className="size-4" />}
              title="Present Address"
              subtitle="Current residential and mailing coordinates"
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5">
              <FieldSelect label="Division" value={presDivision} onChange={setPresDivision} options={divisionOptions} />
              <FieldSelect label="District" value={presDistrict} onChange={setPresDistrict} options={districtOptions} />
              <FieldSelect label="Thana / Upazila" value={presThana} onChange={setPresThana} options={thanaOptions} />
              <FieldSelect label="Post Office" value={presPostOffice} onChange={setPresPostOffice} options={postOfficeOptions} />

              <FieldInput label="Village / House" placeholder="e.g. House 35, Block D" value={presVillage} onChange={e => setPresVillage(e.target.value)} />
              <FieldInput label="Road / Block" placeholder="e.g. Road 12" value={presRoad} onChange={e => setPresRoad(e.target.value)} />
              <FieldSelect label="Country" value={presCountry} onChange={setPresCountry} options={countryOptions} />

              <div className="md:col-span-2 xl:col-span-4 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Full Present Address</label>
                <div className="h-10 px-3 flex items-center bg-muted/40 rounded-xl border border-border/50 text-xs font-semibold text-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap">
                  {fullPresentAddress || "Division, District, Thana, PO details auto-compiled here..."}
                </div>
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs"><MapPin className="size-4" /></div>
                <div>
                  <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">Permanent Address</h2>
                  <p className="text-[10px] text-muted-foreground/75 mt-1">Native / legal home address</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-card hover:bg-muted border border-border/80 rounded-xl px-3.5 py-1.5 transition-all shadow-2xs">
                <input
                  type="checkbox"
                  checked={copyAddress}
                  onChange={(e) => setCopyAddress(e.target.checked)}
                  className="size-3.5 accent-primary cursor-pointer rounded"
                />
                <Copy className="size-3 text-muted-foreground" />
                <span className="text-[10.5px] text-foreground font-bold whitespace-nowrap">Same as Present Address</span>
              </label>
            </div>
            <div className={`p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5 transition-opacity duration-300 ${copyAddress ? "opacity-45 pointer-events-none" : ""}`}>
              <FieldSelect label="Division" value={permDivision} onChange={setPermDivision} options={divisionOptions} />
              <FieldSelect label="District" value={permDistrict} onChange={setPermDistrict} options={districtOptions} />
              <FieldSelect label="Thana / Upazila" value={permThana} onChange={setPermThana} options={thanaOptions} />
              <FieldSelect label="Post Office" value={permPostOffice} onChange={setPermPostOffice} options={postOfficeOptions} />

              <FieldInput label="Village / House" placeholder="e.g. Village/Para name" value={permVillage} onChange={e => setPermVillage(e.target.value)} />
              <FieldInput label="Road / Block" placeholder="e.g. Post Code/Word" value={permRoad} onChange={e => setPermRoad(e.target.value)} />
              <FieldSelect label="Country" value={permCountry} onChange={setPermCountry} options={countryOptions} />

              <div className="md:col-span-2 xl:col-span-4 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Full Permanent Address</label>
                <div className="h-10 px-3 flex items-center bg-muted/40 rounded-xl border border-border/50 text-xs font-semibold text-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap">
                  {fullPermanentAddress || "Division, District, Thana, PO details auto-compiled here..."}
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 4: ACADEMIC CREDENTIALS ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs"><GraduationCap className="size-4" /></div>
                <div>
                  <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">Academic Credentials &amp; Qualifications</h2>
                  <p className="text-[10px] text-muted-foreground/75 mt-1">Highest educational details, board examinations and certificates</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddAcademic}
                className="inline-flex items-center gap-1 bg-primary hover:opacity-95 text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-xs transition"
              >
                <Plus className="size-3.5" /> Add Row
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/70 border-b border-border/30 bg-muted/20">
                      <th className="px-4 py-3">Degree / Exam Title</th>
                      <th className="px-4 py-3">Institution Name</th>
                      <th className="px-4 py-3 w-40">Passing Year</th>
                      <th className="px-4 py-3 w-40">Result / GPA</th>
                      <th className="px-4 py-3 w-64">Attachment (Optional)</th>
                      <th className="px-4 py-3 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {academics.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="e.g. SSC, HSC, Diploma"
                            value={row.title}
                            onChange={(e) => handleAcademicChange(row.id, "title", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="Board or School Name"
                            value={row.institution}
                            onChange={(e) => handleAcademicChange(row.id, "institution", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            placeholder="YYYY"
                            value={row.year}
                            onChange={(e) => handleAcademicChange(row.id, "year", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="e.g. 5.00 / First Div"
                            value={row.result}
                            onChange={(e) => handleAcademicChange(row.id, "result", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-semibold"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <label className="flex-1 flex items-center justify-center gap-1.5 h-9 border border-dashed border-border/80 hover:border-primary/50 bg-background hover:bg-muted/20 rounded-lg text-[10px] font-bold text-muted-foreground cursor-pointer transition">
                              <Upload className="size-3" />
                              <span className="truncate">{row.file ? row.file.name : "Choose PDF/JPG"}</span>
                              <input
                                type="file"
                                accept=".pdf,image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleAcademicChange(row.id, "file", file);
                                }}
                              />
                            </label>
                            {row.file && (
                              <button
                                type="button"
                                onClick={() => handleAcademicChange(row.id, "file", null)}
                                className="size-9 rounded-lg border border-red-200 bg-red-50 text-red-650 flex items-center justify-center hover:bg-red-100"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            disabled={academics.length === 1}
                            onClick={() => handleRemoveAcademic(row.id)}
                            className="size-9 rounded-lg border border-border/40 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── SECTION 5: PRIOR JOB EXPERIENCE ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs"><Briefcase className="size-4" /></div>
                <div>
                  <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">Prior Job Experience &amp; Career History</h2>
                  <p className="text-[10px] text-muted-foreground/75 mt-1">Previous employment history, designations and clearances</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center gap-1 bg-primary hover:opacity-95 text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-xs transition"
              >
                <Plus className="size-3.5" /> Add Row
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/70 border-b border-border/30 bg-muted/20">
                      <th className="px-4 py-3">Organization / Company</th>
                      <th className="px-4 py-3">Designation</th>
                      <th className="px-4 py-3 w-40">From Date</th>
                      <th className="px-4 py-3 w-40">To Date</th>
                      <th className="px-4 py-3">Reason for Leaving</th>
                      <th className="px-4 py-3 w-56">Attachment (Optional)</th>
                      <th className="px-4 py-3 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {experiences.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={row.company}
                            onChange={(e) => handleExperienceChange(row.id, "company", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="Job Title / Role"
                            value={row.designation}
                            onChange={(e) => handleExperienceChange(row.id, "designation", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="date"
                            value={row.from}
                            onChange={(e) => handleExperienceChange(row.id, "from", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="date"
                            value={row.to}
                            onChange={(e) => handleExperienceChange(row.id, "to", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            placeholder="Reason for Resignation"
                            value={row.reason}
                            onChange={(e) => handleExperienceChange(row.id, "reason", e.target.value)}
                            className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <label className="flex-1 flex items-center justify-center gap-1.5 h-9 border border-dashed border-border/80 hover:border-primary/50 bg-background hover:bg-muted/20 rounded-lg text-[10px] font-bold text-muted-foreground cursor-pointer transition">
                              <Upload className="size-3" />
                              <span className="truncate">{row.file ? row.file.name : "Experience Copy"}</span>
                              <input
                                type="file"
                                accept=".pdf,image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleExperienceChange(row.id, "file", file);
                                }}
                              />
                            </label>
                            {row.file && (
                              <button
                                type="button"
                                onClick={() => handleExperienceChange(row.id, "file", null)}
                                className="size-9 rounded-lg border border-red-200 bg-red-50 text-red-650 flex items-center justify-center hover:bg-red-100"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            disabled={experiences.length === 1}
                            onClick={() => handleRemoveExperience(row.id)}
                            className="size-9 rounded-lg border border-border/40 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── SECTION 6: NOMINEE DECLARATION ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<Heart className="size-4" />}
              title="Nominee Declaration Dossier"
              subtitle="Declared legal nominee details for official allocations and benefits"
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5">
              <FieldInput label="Nominee Full Name" placeholder="Nominee's complete name" value={nomineeName} onChange={e => setNomineeName(e.target.value)} />
              <FieldInput label="Relation" placeholder="e.g. Spouse, Mother, Son" value={nomineeRelation} onChange={e => setNomineeRelation(e.target.value)} />
              <FieldInput label="Nominee NID / Birth Reg" placeholder="Identity credentials" value={nomineeNidReg} onChange={e => setNomineeNidReg(e.target.value)} />
              <FieldInput label="Nominee Contact No" placeholder="Nominee's mobile number" value={nomineeContact} onChange={e => setNomineeContact(e.target.value)} />
            </div>
          </div>

          {/* ── SUBMIT BAR ────────────────────────── */}
          <div className="p-5 bg-card rounded-lg border border-border/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-muted-foreground font-semibold">
              All <span className="text-red-500 font-bold">*</span> marked fields are required before application submission.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="h-10 px-8 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground font-bold text-xs transition-all"
              >
                Reset Form
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="h-10 px-10 rounded-lg bg-primary text-primary-foreground font-black text-xs shadow-md hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Submit Application Form
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
