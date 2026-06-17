import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar, a as SearchableSelect } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, D as UserPlus, I as Info, U as User, as as ContactRound, B as Building2, at as MapPin, au as Copy, av as Camera, S as Search, b as CircleCheck, aw as Upload, ap as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/tslib.mjs";
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
function FieldInput({
  label,
  required,
  readOnly,
  value,
  placeholder,
  type = "text",
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col gap-1.5 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wide", children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 ml-0.5", children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, readOnly, defaultValue: value, placeholder, className: `h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-200
          ${readOnly ? "bg-muted/60 border-border/30 text-primary font-bold cursor-default" : "bg-background border-border/80 text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10"}` })
  ] });
}
function FieldSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col gap-1.5 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wide", children: [
        label,
        required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 ml-0.5", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 text-[8.5px] font-black text-primary/80 tracking-wider uppercase bg-primary/5 px-1.5 py-0.5 rounded-md border border-primary/10 select-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-2 text-primary" }),
        " Searchable"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value, onChange, options, placeholder: placeholder || `Search & select ${label}...` })
  ] });
}
function SectionHeader({
  icon,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3.5 border-b border-border/50 bg-muted/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/75 mt-1", children: subtitle })
    ] })
  ] });
}
function PhotoUploader({
  label,
  isSignature = false
}) {
  const [preview, setPreview] = reactExports.useState(null);
  const [camMode, setCamMode] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result);
      reader.readAsDataURL(file);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[280px] bg-muted/10 border border-border/60 rounded-lg p-5 space-y-4 transition-all hover:shadow-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-border/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-foreground/80", children: label }),
      preview && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-2.5" }),
        " Loaded"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => fileRef.current?.click(), className: `relative shrink-0 overflow-hidden border-2 border-dashed border-border/80 hover:border-primary/50 bg-card hover:bg-muted/10 transition-all duration-300 cursor-pointer flex items-center justify-center group
            ${isSignature ? "w-64 h-24 rounded-xl" : "w-32 h-32 rounded-lg"}`, children: [
        preview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preview, alt: label, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5 text-muted-foreground/50 group-hover:text-primary/70 text-center p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-6 stroke-[1.8]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold uppercase tracking-wider", children: "Browse File" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-muted-foreground/60", children: "Max 2MB (JPG/PNG)" })
        ] }),
        preview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-[10px] font-bold", children: "Replace File" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full space-y-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/70 leading-relaxed", children: isSignature ? "Upload a clear digital signature image. Ensure background is white or transparent." : "Upload a passport-sized color photo of the candidate (minimum 200x200px format)." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => fileRef.current?.click(), className: "flex-1 min-w-[80px] h-8 rounded-lg bg-card border border-border/80 hover:border-primary/30 hover:bg-primary/5 text-foreground/80 hover:text-primary text-[10px] font-bold transition-all shadow-3xs", children: "Select Image" }),
          !isSignature && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setCamMode(!camMode), className: `h-8 px-3 rounded-lg border text-[10px] font-bold transition-all
                  ${camMode ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/80 hover:border-primary/30 hover:bg-primary/5 text-foreground/80 hover:text-primary"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-3.5 inline mr-1" }),
            " Webcam"
          ] }),
          preview && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setPreview(null);
            if (fileRef.current) fileRef.current.value = "";
          }, className: "h-8 px-2.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 text-[10px] font-bold transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: handleFile })
  ] });
}
const religionOptions = [{
  value: "Islam",
  label: "Islam"
}, {
  value: "Hindu",
  label: "Hindu"
}, {
  value: "Christian",
  label: "Christian"
}, {
  value: "Buddhist",
  label: "Buddhist"
}, {
  value: "Other",
  label: "Other"
}];
const maritalStatusOptions = [{
  value: "Single",
  label: "Single"
}, {
  value: "Married",
  label: "Married"
}, {
  value: "Divorced",
  label: "Divorced"
}, {
  value: "Widowed",
  label: "Widowed"
}];
const employeeTypeOptions = [{
  value: "Worker",
  label: "Worker"
}, {
  value: "Staff",
  label: "Staff"
}, {
  value: "Executive",
  label: "Executive"
}];
const departmentOptions = [{
  value: "RMG Operation",
  label: "RMG Operation"
}, {
  value: "Quality Control",
  label: "Quality Control"
}, {
  value: "HR & Admin",
  label: "HR & Admin"
}, {
  value: "Commercial",
  label: "Commercial"
}];
const sectionOptions = [{
  value: "Sewing",
  label: "Sewing"
}, {
  value: "Cutting",
  label: "Cutting"
}, {
  value: "Finishing",
  label: "Finishing"
}, {
  value: "Washing",
  label: "Washing"
}];
const designationOptions = [{
  value: "Operator",
  label: "Operator"
}, {
  value: "Helper",
  label: "Helper"
}, {
  value: "Quality Inspector",
  label: "Quality Inspector"
}, {
  value: "Floor Incharge",
  label: "Floor Incharge"
}];
const unitOptions = [{
  value: "Unit-6",
  label: "Unit-6"
}, {
  value: "Unit-7",
  label: "Unit-7"
}, {
  value: "Unit-8",
  label: "Unit-8"
}];
const lineOptions = Array.from({
  length: 20
}, (_, i) => ({
  value: `${i + 1}`,
  label: `Line ${i + 1}`
}));
const gradeOptions = ["A+", "A", "A-", "B+", "B", "C+", "C", "H"].map((g) => ({
  value: g,
  label: g
}));
const jobNatureOptions = [{
  value: "Permanent",
  label: "Permanent"
}, {
  value: "Temporary",
  label: "Temporary"
}, {
  value: "Contractual",
  label: "Contractual"
}, {
  value: "Probation",
  label: "Probation"
}];
const shiftOptions = [{
  value: "General Shift",
  label: "General Shift"
}, {
  value: "Shift A",
  label: "Shift A"
}, {
  value: "Shift B",
  label: "Shift B"
}, {
  value: "Shift C",
  label: "Shift C"
}];
const divisionOptions = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"].map((d) => ({
  value: d,
  label: d
}));
const districtOptions = ["Dhaka", "Gazipur", "Narayanganj", "Chattogram", "Sylhet", "Comilla"].map((d) => ({
  value: d,
  label: d
}));
const thanaOptions = ["Uttara", "Mirpur", "Motijheel", "Tongi", "Gazipur Sadar", "Hathazari", "Raujan", "Boalkhali"].map((t) => ({
  value: t,
  label: t
}));
const postOfficeOptions = ["Uttara Model Town", "Mirpur-10", "Hathazari", "Raujan Bazar"].map((p) => ({
  value: p,
  label: p
}));
const countryOptions = [{
  value: "Bangladesh",
  label: "Bangladesh"
}];
function RecruitmentBasicEntry() {
  const router = useRouter();
  const [copyAddress, setCopyAddress] = reactExports.useState(false);
  const [religion, setReligion] = reactExports.useState("");
  const [maritalStatus, setMaritalStatus] = reactExports.useState("");
  const [employeeType, setEmployeeType] = reactExports.useState("");
  const [department, setDepartment] = reactExports.useState("");
  const [section, setSection] = reactExports.useState("");
  const [designation, setDesignation] = reactExports.useState("");
  const [unit, setUnit] = reactExports.useState("");
  const [line, setLine] = reactExports.useState("");
  const [grade, setGrade] = reactExports.useState("");
  const [jobNature, setJobNature] = reactExports.useState("");
  const [shift, setShift] = reactExports.useState("");
  const [presDivision, setPresDivision] = reactExports.useState("");
  const [presDistrict, setPresDistrict] = reactExports.useState("");
  const [presThana, setPresThana] = reactExports.useState("");
  const [presPostOffice, setPresPostOffice] = reactExports.useState("");
  const [presCountry, setPresCountry] = reactExports.useState("Bangladesh");
  const [permDivision, setPermDivision] = reactExports.useState("");
  const [permDistrict, setPermDistrict] = reactExports.useState("");
  const [permThana, setPermThana] = reactExports.useState("");
  const [permPostOffice, setPermPostOffice] = reactExports.useState("");
  const [permCountry, setPermCountry] = reactExports.useState("Bangladesh");
  const handleSubmit = () => {
    alert("✅ Candidate PAL000016 registered successfully!");
    router.navigate({
      to: "/recruitment-basic-info-list"
    });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "IE Recruitment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Basic Entry Form" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "New Candidate Registration" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-xl px-3 py-2 shadow-2xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3.5 text-amber-600 dark:text-amber-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-amber-700 dark:text-amber-400 font-semibold", children: "Data inter-linked to IE Assessment & Personal Info" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }), title: "Basic Info", subtitle: "Personal identification details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Emp ID (Temp)", required: true, readOnly: true, value: "PAL000016" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Employee Name (Eng)", required: true, placeholder: "Enter full name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Employee Name (Bng)", placeholder: "বাংলা নাম" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Date of Joining (DOJ)", required: true, type: "date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Date of Birth (DOB)", required: true, type: "date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Religion", required: true, value: religion, onChange: setReligion, options: religionOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Marital Status", required: true, value: maritalStatus, onChange: setMaritalStatus, options: maritalStatusOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "NID Number", placeholder: "National ID number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Birth Registration No", placeholder: "Birth certificate number" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRound, { className: "size-4" }), title: "Details Info", subtitle: "Family & contact information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Father Name (Eng)", placeholder: "Father's name (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Father Name (Bng)", placeholder: "বাবার নাম (বাংলা)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Mother Name (Eng)", placeholder: "Mother's name (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Mother Name (Bng)", placeholder: "মায়ের নাম (বাংলা)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Personal Contact No", required: true, placeholder: "e.g. 01XXXXXXXXX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Emergency Contact No", placeholder: "Emergency contact number" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-4" }), title: "Company Info", subtitle: "Organizational placement details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Employee Type", required: true, value: employeeType, onChange: setEmployeeType, options: employeeTypeOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Department", required: true, value: department, onChange: setDepartment, options: departmentOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Section", required: true, value: section, onChange: setSection, options: sectionOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Designation Title", required: true, value: designation, onChange: setDesignation, options: designationOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Unit", value: unit, onChange: setUnit, options: unitOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Line", value: line, onChange: setLine, options: lineOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Grade", value: grade, onChange: setGrade, options: gradeOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Job Nature", value: jobNature, onChange: setJobNature, options: jobNatureOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Shift", value: shift, onChange: setShift, options: shiftOptions })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }), title: "Present Address", subtitle: "Current residential address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Division", value: presDivision, onChange: setPresDivision, options: divisionOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "District", value: presDistrict, onChange: setPresDistrict, options: districtOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Thana / Upazila", value: presThana, onChange: setPresThana, options: thanaOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Post Office", value: presPostOffice, onChange: setPresPostOffice, options: postOfficeOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Village / House", placeholder: "House no., Village name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Road / Block", placeholder: "Road no., Block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Country", value: presCountry, onChange: setPresCountry, options: countryOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Full Present Address", readOnly: true, placeholder: "Auto-generated", className: "md:col-span-2" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border/50 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none", children: "Permanent Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/75 mt-1", children: "Home / native address" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer bg-card hover:bg-muted border border-border/80 rounded-xl px-3.5 py-1.5 transition-all shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", id: "copyAddress", checked: copyAddress, onChange: (e) => setCopyAddress(e.target.checked), className: "size-3.5 accent-primary cursor-pointer rounded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] text-foreground font-bold whitespace-nowrap", children: "Same as Present Address" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 transition-opacity duration-300 ${copyAddress ? "opacity-50 pointer-events-none" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Division", value: permDivision, onChange: setPermDivision, options: divisionOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "District", value: permDistrict, onChange: setPermDistrict, options: districtOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Thana / Upazila", value: permThana, onChange: setPermThana, options: thanaOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Post Office", value: permPostOffice, onChange: setPermPostOffice, options: postOfficeOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Village / House", placeholder: "House no., Village name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Road / Block", placeholder: "Road no., Block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Country", value: permCountry, onChange: setPermCountry, options: countryOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Full Permanent Address", readOnly: true, placeholder: "Auto-generated", className: "md:col-span-2" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-4" }), title: "Employee Picture Info", subtitle: "Upload photo & signature — JPG/PNG or Webcam" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoUploader, { label: "Employee Photo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoUploader, { label: "Employee Signature", isSignature: true })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-card rounded-lg border border-border/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-semibold", children: [
            "All ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-bold", children: "*" }),
            " marked fields are required before candidate registration."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleReset, className: "h-10 px-8 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground font-bold text-xs transition-all", children: "Reset Form" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleSubmit, className: "h-10 px-10 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-all", children: "Submit & Register Candidate" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  RecruitmentBasicEntry as component
};
