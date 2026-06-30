import { useState, useRef } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight,
  UserPlus,
  User,
  Building2,
  MapPin,
  Camera,
  Upload,
  Trash2,
  Copy,
  CheckCircle2,
  Info,
  Contact2,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/recruitment-basic-entry")({
  component: RecruitmentBasicEntry,
});

// ─── Reusable Field Components ───────────────────────────────────────────────

function FieldInput({
  label,
  required,
  readOnly,
  value,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string;
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
        defaultValue={value}
        placeholder={placeholder}
        className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-200
          ${
            readOnly
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
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/50 bg-muted/20">
      <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs">
        {icon}
      </div>
      <div>
        <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">
          {title}
        </h2>
        {subtitle && <p className="text-[10px] text-muted-foreground/75 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Smart Photo Uploader ────────────────────────────────────────────────────

function PhotoUploader({ label, isSignature = false }: { label: string; isSignature?: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [camMode, setCamMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 min-w-[280px] bg-muted/10 border border-border/60 rounded-lg p-5 space-y-4 transition-all hover:shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
          {label}
        </span>
        {preview && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            <CheckCircle2 className="size-2.5" /> Loaded
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Upload/Preview Zone */}
        <div
          onClick={() => fileRef.current?.click()}
          className={`relative shrink-0 overflow-hidden border-2 border-dashed border-border/80 hover:border-primary/50 bg-card hover:bg-muted/10 transition-all duration-300 cursor-pointer flex items-center justify-center group
            ${isSignature ? "w-64 h-24 rounded-xl" : "w-32 h-32 rounded-lg"}`}
        >
          {preview ? (
            <img src={preview} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground/50 group-hover:text-primary/70 text-center p-2">
              <Upload className="size-6 stroke-[1.8]" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Browse File</span>
              <span className="text-[8px] text-muted-foreground/60">Max 2MB (JPG/PNG)</span>
            </div>
          )}
          {preview && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">Replace File</span>
            </div>
          )}
        </div>

        {/* Options and Controls */}
        <div className="flex-1 w-full space-y-2.5">
          <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
            {isSignature
              ? "Upload a clear digital signature image. Ensure background is white or transparent."
              : "Upload a passport-sized color photo of the candidate (minimum 200x200px format)."}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-1 min-w-[80px] h-8 rounded-lg bg-card border border-border/80 hover:border-primary/30 hover:bg-primary/5 text-foreground/80 hover:text-primary text-[10px] font-bold transition-all shadow-3xs"
            >
              Select Image
            </button>
            {!isSignature && (
              <button
                type="button"
                onClick={() => setCamMode(!camMode)}
                className={`h-8 px-3 rounded-lg border text-[10px] font-bold transition-all
                  ${camMode ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/80 hover:border-primary/30 hover:bg-primary/5 text-foreground/80 hover:text-primary"}`}
              >
                <Camera className="size-3.5 inline mr-1" /> Webcam
              </button>
            )}
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="h-8 px-2.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 text-[10px] font-bold transition-all"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─── Option Matrices ─────────────────────────────────────────────────────────

const religionOptions = [
  { value: "Islam", label: "Islam" },
  { value: "Hindu", label: "Hindu" },
  { value: "Christian", label: "Christian" },
  { value: "Buddhist", label: "Buddhist" },
  { value: "Other", label: "Other" },
];

const maritalStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
];

const employeeTypeOptions = [
  { value: "Worker", label: "Worker" },
  { value: "Staff", label: "Staff" },
  { value: "Executive", label: "Executive" },
];

const departmentOptions = [
  { value: "RMG Operation", label: "RMG Operation" },
  { value: "Quality Control", label: "Quality Control" },
  { value: "HR & Admin", label: "HR & Admin" },
  { value: "Commercial", label: "Commercial" },
];

const sectionOptions = [
  { value: "Sewing", label: "Sewing" },
  { value: "Cutting", label: "Cutting" },
  { value: "Finishing", label: "Finishing" },
  { value: "Washing", label: "Washing" },
];

const designationOptions = [
  { value: "Operator", label: "Operator" },
  { value: "Helper", label: "Helper" },
  { value: "Quality Inspector", label: "Quality Inspector" },
  { value: "Floor Incharge", label: "Floor Incharge" },
];

const unitOptions = [
  { value: "Unit-6", label: "Unit-6" },
  { value: "Unit-7", label: "Unit-7" },
  { value: "Unit-8", label: "Unit-8" },
];

const lineOptions = Array.from({ length: 20 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Line ${i + 1}`,
}));

const gradeOptions = ["A+", "A", "A-", "B+", "B", "C+", "C", "H"].map((g) => ({
  value: g,
  label: g,
}));

const jobNatureOptions = [
  { value: "Permanent", label: "Permanent" },
  { value: "Temporary", label: "Temporary" },
  { value: "Contractual", label: "Contractual" },
  { value: "Probation", label: "Probation" },
];

const shiftOptions = [
  { value: "General Shift", label: "General Shift" },
  { value: "Shift A", label: "Shift A" },
  { value: "Shift B", label: "Shift B" },
  { value: "Shift C", label: "Shift C" },
];

const divisionOptions = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
].map((d) => ({ value: d, label: d }));

const districtOptions = ["Dhaka", "Gazipur", "Narayanganj", "Chattogram", "Sylhet", "Comilla"].map(
  (d) => ({ value: d, label: d }),
);

const thanaOptions = [
  "Uttara",
  "Mirpur",
  "Motijheel",
  "Tongi",
  "Gazipur Sadar",
  "Hathazari",
  "Raujan",
  "Boalkhali",
].map((t) => ({ value: t, label: t }));

const postOfficeOptions = ["Uttara Model Town", "Mirpur-10", "Hathazari", "Raujan Bazar"].map(
  (p) => ({ value: p, label: p }),
);

const countryOptions = [{ value: "Bangladesh", label: "Bangladesh" }];

// ─── Main Component ──────────────────────────────────────────────────────────

function RecruitmentBasicEntry() {
  const router = useRouter();
  const [copyAddress, setCopyAddress] = useState(false);

  // Dropdown States
  const [religion, setReligion] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [designation, setDesignation] = useState("");
  const [unit, setUnit] = useState("");
  const [line, setLine] = useState("");
  const [grade, setGrade] = useState("");
  const [jobNature, setJobNature] = useState("");
  const [shift, setShift] = useState("");

  // Address States
  const [presDivision, setPresDivision] = useState("");
  const [presDistrict, setPresDistrict] = useState("");
  const [presThana, setPresThana] = useState("");
  const [presPostOffice, setPresPostOffice] = useState("");
  const [presCountry, setPresCountry] = useState("Bangladesh");

  const [permDivision, setPermDivision] = useState("");
  const [permDistrict, setPermDistrict] = useState("");
  const [permThana, setPermThana] = useState("");
  const [permPostOffice, setPermPostOffice] = useState("");
  const [permCountry, setPermCountry] = useState("Bangladesh");

  const handleSubmit = () => {
    alert("✅ Candidate PAL000016 registered successfully!");
    router.navigate({ to: "/recruitment-basic-info-list" });
  };

  const handleReset = () => {
    setReligion("");
    setMaritalStatus("");
    setEmployeeType("");
    setDepartment("");
    setSection("");
    setDesignation("");
    setUnit("");
    setLine("");
    setGrade("");
    setJobNature("");
    setShift("");
    setPresDivision("");
    setPresDistrict("");
    setPresThana("");
    setPresPostOffice("");
    setPermDivision("");
    setPermDistrict("");
    setPermThana("");
    setPermPostOffice("");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
          {/* Page Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>IE Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Basic Entry Form</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <UserPlus className="size-5.5 text-primary animate-pulse" />
                <span>New Candidate Registration</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-xl px-3 py-2 shadow-2xs">
              <Info className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                Data inter-linked to IE Assessment &amp; Personal Info
              </span>
            </div>
          </div>

          {/* ── CARD 1: BASIC INFO ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<User className="size-4" />}
              title="Basic Info"
              subtitle="Personal identification details"
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <FieldInput label="Emp ID (Temp)" required readOnly value="PAL000016" />
              <FieldInput label="Employee Name (Eng)" required placeholder="Enter full name" />
              <FieldInput label="Employee Name (Bng)" placeholder="বাংলা নাম" />

              <FieldInput label="Date of Joining (DOJ)" required type="date" />
              <FieldInput label="Date of Birth (DOB)" required type="date" />

              <FieldSelect
                label="Religion"
                required
                value={religion}
                onChange={setReligion}
                options={religionOptions}
              />

              <FieldSelect
                label="Marital Status"
                required
                value={maritalStatus}
                onChange={setMaritalStatus}
                options={maritalStatusOptions}
              />

              <FieldInput label="NID Number" placeholder="National ID number" />
              <FieldInput label="Birth Registration No" placeholder="Birth certificate number" />
            </div>
          </div>

          {/* ── CARD 2: DETAILS INFO ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<Contact2 className="size-4" />}
              title="Details Info"
              subtitle="Family & contact information"
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <FieldInput label="Father Name (Eng)" placeholder="Father's name (English)" />
              <FieldInput label="Father Name (Bng)" placeholder="বাবার নাম (বাংলা)" />
              <FieldInput label="Mother Name (Eng)" placeholder="Mother's name (English)" />

              <FieldInput label="Mother Name (Bng)" placeholder="মায়ের নাম (বাংলা)" />
              <FieldInput label="Personal Contact No" required placeholder="e.g. 01XXXXXXXXX" />
              <FieldInput label="Emergency Contact No" placeholder="Emergency contact number" />
            </div>
          </div>

          {/* ── CARD 3: COMPANY INFO ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<Building2 className="size-4" />}
              title="Company Info"
              subtitle="Organizational placement details"
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <FieldSelect
                label="Employee Type"
                required
                value={employeeType}
                onChange={setEmployeeType}
                options={employeeTypeOptions}
              />

              <FieldSelect
                label="Department"
                required
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
              />

              <FieldSelect
                label="Section"
                required
                value={section}
                onChange={setSection}
                options={sectionOptions}
              />

              <FieldSelect
                label="Designation Title"
                required
                value={designation}
                onChange={setDesignation}
                options={designationOptions}
              />

              <FieldSelect label="Unit" value={unit} onChange={setUnit} options={unitOptions} />

              <FieldSelect label="Line" value={line} onChange={setLine} options={lineOptions} />

              <FieldSelect label="Grade" value={grade} onChange={setGrade} options={gradeOptions} />

              <FieldSelect
                label="Job Nature"
                value={jobNature}
                onChange={setJobNature}
                options={jobNatureOptions}
              />

              <FieldSelect label="Shift" value={shift} onChange={setShift} options={shiftOptions} />
            </div>
          </div>

          {/* ── CARD 4: PRESENT ADDRESS ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<MapPin className="size-4" />}
              title="Present Address"
              subtitle="Current residential address"
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              <FieldSelect
                label="Division"
                value={presDivision}
                onChange={setPresDivision}
                options={divisionOptions}
              />
              <FieldSelect
                label="District"
                value={presDistrict}
                onChange={setPresDistrict}
                options={districtOptions}
              />
              <FieldSelect
                label="Thana / Upazila"
                value={presThana}
                onChange={setPresThana}
                options={thanaOptions}
              />

              <FieldSelect
                label="Post Office"
                value={presPostOffice}
                onChange={setPresPostOffice}
                options={postOfficeOptions}
              />

              <FieldInput label="Village / House" placeholder="House no., Village name" />
              <FieldInput label="Road / Block" placeholder="Road no., Block" />

              <FieldSelect
                label="Country"
                value={presCountry}
                onChange={setPresCountry}
                options={countryOptions}
              />
              <FieldInput
                label="Full Present Address"
                readOnly
                placeholder="Auto-generated"
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* ── CARD 5: PERMANENT ADDRESS ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">
                    Permanent Address
                  </h2>
                  <p className="text-[10px] text-muted-foreground/75 mt-1">Home / native address</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-card hover:bg-muted border border-border/80 rounded-xl px-3.5 py-1.5 transition-all shadow-2xs">
                <input
                  type="checkbox"
                  id="copyAddress"
                  checked={copyAddress}
                  onChange={(e) => setCopyAddress(e.target.checked)}
                  className="size-3.5 accent-primary cursor-pointer rounded"
                />
                <Copy className="size-3 text-muted-foreground" />
                <span className="text-[10.5px] text-foreground font-bold whitespace-nowrap">
                  Same as Present Address
                </span>
              </label>
            </div>
            <div
              className={`p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 transition-opacity duration-300 ${copyAddress ? "opacity-50 pointer-events-none" : ""}`}
            >
              <FieldSelect
                label="Division"
                value={permDivision}
                onChange={setPermDivision}
                options={divisionOptions}
              />
              <FieldSelect
                label="District"
                value={permDistrict}
                onChange={setPermDistrict}
                options={districtOptions}
              />
              <FieldSelect
                label="Thana / Upazila"
                value={permThana}
                onChange={setPermThana}
                options={thanaOptions}
              />

              <FieldSelect
                label="Post Office"
                value={permPostOffice}
                onChange={setPermPostOffice}
                options={postOfficeOptions}
              />

              <FieldInput label="Village / House" placeholder="House no., Village name" />
              <FieldInput label="Road / Block" placeholder="Road no., Block" />

              <FieldSelect
                label="Country"
                value={permCountry}
                onChange={setPermCountry}
                options={countryOptions}
              />
              <FieldInput
                label="Full Permanent Address"
                readOnly
                placeholder="Auto-generated"
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* ── CARD 6: EMPLOYEE PHOTO & SIGNATURE ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<Camera className="size-4" />}
              title="Employee Picture Info"
              subtitle="Upload photo & signature — JPG/PNG or Webcam"
            />
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <PhotoUploader label="Employee Photo" />
                <PhotoUploader label="Employee Signature" isSignature={true} />
              </div>
            </div>
          </div>

          {/* ── SUBMIT BAR (at the very bottom) ────────────────────────── */}
          <div className="p-5 bg-card rounded-lg border border-border/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-muted-foreground font-semibold">
              All <span className="text-red-500 font-bold">*</span> marked fields are required
              before candidate registration.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="h-10 px-8 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground font-bold text-xs transition-all"
              >
                Reset Form
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="h-10 px-10 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Submit &amp; Register Candidate
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
