import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar, a as SearchableSelect } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, D as UserPlus, V as ShieldCheck, U as User, av as Camera, ap as Trash2, as as ContactRound, at as MapPin, au as Copy, aU as GraduationCap, i as Plus, aw as Upload, t as Briefcase, aV as Heart, S as Search } from "../_libs/lucide-react.mjs";
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
function FieldInput({
  label,
  required,
  readOnly,
  value,
  onChange,
  placeholder,
  type = "text",
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col gap-1.5 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wide", children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 ml-0.5", children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, readOnly, value, onChange, placeholder, className: `h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-200
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/75 mt-1", children: subtitle })
    ] })
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
function ERecruitmentForm() {
  const router = useRouter();
  const [copyAddress, setCopyAddress] = reactExports.useState(false);
  const [photoPreview, setPhotoPreview] = reactExports.useState(null);
  const photoFileRef = reactExports.useRef(null);
  const [nameEng, setNameEng] = reactExports.useState("");
  const [nameBng, setNameBng] = reactExports.useState("");
  const [dob, setDob] = reactExports.useState("");
  const [religion, setReligion] = reactExports.useState("");
  const [maritalStatus, setMaritalStatus] = reactExports.useState("");
  const [nidNumber, setNidNumber] = reactExports.useState("");
  const [birthReg, setBirthReg] = reactExports.useState("");
  const [fatherEng, setFatherEng] = reactExports.useState("");
  const [fatherBng, setFatherBng] = reactExports.useState("");
  const [motherEng, setMotherEng] = reactExports.useState("");
  const [motherBng, setMotherBng] = reactExports.useState("");
  const [personalContact, setPersonalContact] = reactExports.useState("");
  const [emergencyContact, setEmergencyContact] = reactExports.useState("");
  const [personalEmail, setPersonalEmail] = reactExports.useState("");
  const [contactPerson, setContactPerson] = reactExports.useState("");
  const [relationship, setRelationship] = reactExports.useState("");
  const [presDivision, setPresDivision] = reactExports.useState("");
  const [presDistrict, setPresDistrict] = reactExports.useState("");
  const [presThana, setPresThana] = reactExports.useState("");
  const [presPostOffice, setPresPostOffice] = reactExports.useState("");
  const [presVillage, setPresVillage] = reactExports.useState("");
  const [presRoad, setPresRoad] = reactExports.useState("");
  const [presCountry, setPresCountry] = reactExports.useState("Bangladesh");
  const [permDivision, setPermDivision] = reactExports.useState("");
  const [permDistrict, setPermDistrict] = reactExports.useState("");
  const [permThana, setPermThana] = reactExports.useState("");
  const [permPostOffice, setPermPostOffice] = reactExports.useState("");
  const [permVillage, setPermVillage] = reactExports.useState("");
  const [permRoad, setPermRoad] = reactExports.useState("");
  const [permCountry, setPermCountry] = reactExports.useState("Bangladesh");
  const [academics, setAcademics] = reactExports.useState([{
    id: "1",
    title: "",
    institution: "",
    year: "",
    result: "",
    file: null
  }]);
  const [experiences, setExperiences] = reactExports.useState([{
    id: "1",
    company: "",
    designation: "",
    from: "",
    to: "",
    reason: "",
    file: null
  }]);
  const [nomineeName, setNomineeName] = reactExports.useState("");
  const [nomineeRelation, setNomineeRelation] = reactExports.useState("");
  const [nomineeNidReg, setNomineeNidReg] = reactExports.useState("");
  const [nomineeContact, setNomineeContact] = reactExports.useState("");
  const fullPresentAddress = [presVillage ? `House/Village: ${presVillage}` : "", presRoad ? `Road/Block: ${presRoad}` : "", presPostOffice ? `PO: ${presPostOffice}` : "", presThana ? `Thana: ${presThana}` : "", presDistrict ? `District: ${presDistrict}` : "", presDivision ? `Division: ${presDivision}` : "", presCountry].filter(Boolean).join(", ");
  const computedPermDivision = copyAddress ? presDivision : permDivision;
  const computedPermDistrict = copyAddress ? presDistrict : permDistrict;
  const computedPermThana = copyAddress ? presThana : permThana;
  const computedPermPostOffice = copyAddress ? presPostOffice : permPostOffice;
  const computedPermVillage = copyAddress ? presVillage : permVillage;
  const computedPermRoad = copyAddress ? presRoad : permRoad;
  const computedPermCountry = copyAddress ? presCountry : permCountry;
  const fullPermanentAddress = [computedPermVillage ? `House/Village: ${computedPermVillage}` : "", computedPermRoad ? `Road/Block: ${computedPermRoad}` : "", computedPermPostOffice ? `PO: ${computedPermPostOffice}` : "", computedPermThana ? `Thana: ${computedPermThana}` : "", computedPermDistrict ? `District: ${computedPermDistrict}` : "", computedPermDivision ? `Division: ${computedPermDivision}` : "", computedPermCountry].filter(Boolean).join(", ");
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result);
      reader.readAsDataURL(file);
    }
  };
  const handleAddAcademic = () => {
    setAcademics([...academics, {
      id: Date.now().toString(),
      title: "",
      institution: "",
      year: "",
      result: "",
      file: null
    }]);
  };
  const handleRemoveAcademic = (id) => {
    if (academics.length > 1) setAcademics(academics.filter((a) => a.id !== id));
  };
  const handleAcademicChange = (id, key, value) => {
    setAcademics(academics.map((a) => a.id === id ? {
      ...a,
      [key]: value
    } : a));
  };
  const handleAddExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      company: "",
      designation: "",
      from: "",
      to: "",
      reason: "",
      file: null
    }]);
  };
  const handleRemoveExperience = (id) => {
    if (experiences.length > 1) setExperiences(experiences.filter((e) => e.id !== id));
  };
  const handleExperienceChange = (id, key, value) => {
    setExperiences(experiences.map((e) => e.id === id ? {
      ...e,
      [key]: value
    } : e));
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
      doj: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
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
    router.navigate({
      to: "/recruitment-basic-info-list"
    });
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
    setAcademics([{
      id: "1",
      title: "",
      institution: "",
      year: "",
      result: "",
      file: null
    }]);
    setExperiences([{
      id: "1",
      company: "",
      designation: "",
      from: "",
      to: "",
      reason: "",
      file: null
    }]);
    setNomineeName("");
    setNomineeRelation("");
    setNomineeNidReg("");
    setNomineeContact("");
    setCopyAddress(false);
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Recruitment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "e-Recruitment Form" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-5.5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "e-Recruitment Application Form" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2 shadow-2xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold", children: "Security Active (SSL Encrypted)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-6 shadow-xs relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 z-10 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold text-foreground tracking-tight text-primary", children: "Employment Application Portal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-medium max-w-3xl leading-relaxed", children: [
              "Please complete the application form below with your correct personal, contact, academic, and professional details. Fields marked with ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-bold", children: "*" }),
              " are mandatory."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }), title: "Candidate Profile & Identity", subtitle: "Primary applicant identification and document credentials" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col lg:flex-row gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-72 shrink-0 flex flex-col items-center gap-4 bg-muted/10 border border-border/60 rounded-lg p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-black uppercase tracking-wider text-foreground/80", children: "Candidate Photo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => photoFileRef.current?.click(), className: "relative w-40 h-40 rounded-lg border-2 border-dashed border-border/85 hover:border-primary/50 bg-card hover:bg-muted/10 transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center group", children: [
                photoPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photoPreview, alt: "Candidate Preview", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground/50 group-hover:text-primary/70 text-center p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-8 stroke-[1.5]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold uppercase tracking-wider", children: "Upload Portrait" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-muted-foreground/60", children: "Max 2MB (JPG/PNG)" })
                ] }),
                photoPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-[10px] font-bold", children: "Replace Photo" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => photoFileRef.current?.click(), className: "flex-1 h-8 rounded-lg bg-card border border-border/85 text-[10px] font-bold text-foreground/80 hover:text-primary hover:border-primary/30 transition-all shadow-3xs", children: "Select File" }),
                photoPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPhotoPreview(null), className: "h-8 px-3 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: photoFileRef, type: "file", accept: "image/*", className: "hidden", onChange: handlePhotoUpload })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Candidate Name (ENG)", required: true, placeholder: "John Doe", value: nameEng, onChange: (e) => setNameEng(e.target.value) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Candidate Name (BNG)", placeholder: "জন ডো", value: nameBng, onChange: (e) => setNameBng(e.target.value) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Date of Birth (DOB)", required: true, type: "date", value: dob, onChange: (e) => setDob(e.target.value) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Religion", required: true, value: religion, onChange: setReligion, options: religionOptions }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Marital Status", required: true, value: maritalStatus, onChange: setMaritalStatus, options: maritalStatusOptions }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "NID Number", placeholder: "e.g. 5534XXXXXXXX", value: nidNumber, onChange: (e) => setNidNumber(e.target.value) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Birth Registration No", placeholder: "e.g. 199XXXXXXXXXXXXXX", value: birthReg, onChange: (e) => setBirthReg(e.target.value) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRound, { className: "size-4" }), title: "Family Details & Contacts", subtitle: "Parental information, personal contact details, and emergency references" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Father Name (ENG)", placeholder: "Father's English Name", value: fatherEng, onChange: (e) => setFatherEng(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Father Name (BNG)", placeholder: "বাবার বাংলা নাম", value: fatherBng, onChange: (e) => setFatherBng(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Mother Name (ENG)", placeholder: "Mother's English Name", value: motherEng, onChange: (e) => setMotherEng(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Mother Name (BNG)", placeholder: "মায়ের বাংলা নাম", value: motherBng, onChange: (e) => setMotherBng(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Personal Contact No", required: true, placeholder: "e.g. 017XXXXXXXX", value: personalContact, onChange: (e) => setPersonalContact(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Emergency Contact No", placeholder: "Alternative contact number", value: emergencyContact, onChange: (e) => setEmergencyContact(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Personal Email", type: "email", placeholder: "john.doe@example.com", value: personalEmail, onChange: (e) => setPersonalEmail(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Contact Person Name", placeholder: "Emergency reference name", value: contactPerson, onChange: (e) => setContactPerson(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Relationship", placeholder: "e.g. Brother, Wife", value: relationship, onChange: (e) => setRelationship(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }), title: "Present Address", subtitle: "Current residential and mailing coordinates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Division", value: presDivision, onChange: setPresDivision, options: divisionOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "District", value: presDistrict, onChange: setPresDistrict, options: districtOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Thana / Upazila", value: presThana, onChange: setPresThana, options: thanaOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Post Office", value: presPostOffice, onChange: setPresPostOffice, options: postOfficeOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Village / House", placeholder: "e.g. House 35, Block D", value: presVillage, onChange: (e) => setPresVillage(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Road / Block", placeholder: "e.g. Road 12", value: presRoad, onChange: (e) => setPresRoad(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Country", value: presCountry, onChange: setPresCountry, options: countryOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 xl:col-span-4 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wide", children: "Full Present Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 px-3 flex items-center bg-muted/40 rounded-xl border border-border/50 text-xs font-semibold text-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap", children: fullPresentAddress || "Division, District, Thana, PO details auto-compiled here..." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none", children: "Permanent Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/75 mt-1", children: "Native / legal home address" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer bg-card hover:bg-muted border border-border/80 rounded-xl px-3.5 py-1.5 transition-all shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: copyAddress, onChange: (e) => setCopyAddress(e.target.checked), className: "size-3.5 accent-primary cursor-pointer rounded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] text-foreground font-bold whitespace-nowrap", children: "Same as Present Address" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5 transition-opacity duration-300 ${copyAddress ? "opacity-45 pointer-events-none" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Division", value: permDivision, onChange: setPermDivision, options: divisionOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "District", value: permDistrict, onChange: setPermDistrict, options: districtOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Thana / Upazila", value: permThana, onChange: setPermThana, options: thanaOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Post Office", value: permPostOffice, onChange: setPermPostOffice, options: postOfficeOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Village / House", placeholder: "e.g. Village/Para name", value: permVillage, onChange: (e) => setPermVillage(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Road / Block", placeholder: "e.g. Post Code/Word", value: permRoad, onChange: (e) => setPermRoad(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSelect, { label: "Country", value: permCountry, onChange: setPermCountry, options: countryOptions }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 xl:col-span-4 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wide", children: "Full Permanent Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 px-3 flex items-center bg-muted/40 rounded-xl border border-border/50 text-xs font-semibold text-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap", children: fullPermanentAddress || "Division, District, Thana, PO details auto-compiled here..." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none", children: "Academic Credentials & Qualifications" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/75 mt-1", children: "Highest educational details, board examinations and certificates" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleAddAcademic, className: "inline-flex items-center gap-1 bg-primary hover:opacity-95 text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-xs transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
              " Add Row"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[9px] uppercase font-bold tracking-wider text-muted-foreground/70 border-b border-border/30 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Degree / Exam Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Institution Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-40", children: "Passing Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-40", children: "Result / GPA" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-64", children: "Attachment (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center w-16", children: "Action" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20", children: academics.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. SSC, HSC, Diploma", value: row.title, onChange: (e) => handleAcademicChange(row.id, "title", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Board or School Name", value: row.institution, onChange: (e) => handleAcademicChange(row.id, "institution", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", placeholder: "YYYY", value: row.year, onChange: (e) => handleAcademicChange(row.id, "year", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. 5.00 / First Div", value: row.result, onChange: (e) => handleAcademicChange(row.id, "result", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-semibold" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex-1 flex items-center justify-center gap-1.5 h-9 border border-dashed border-border/80 hover:border-primary/50 bg-background hover:bg-muted/20 rounded-lg text-[10px] font-bold text-muted-foreground cursor-pointer transition", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: row.file ? row.file.name : "Choose PDF/JPG" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".pdf,image/*", className: "hidden", onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAcademicChange(row.id, "file", file);
                  } })
                ] }),
                row.file && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleAcademicChange(row.id, "file", null), className: "size-9 rounded-lg border border-red-200 bg-red-50 text-red-650 flex items-center justify-center hover:bg-red-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: academics.length === 1, onClick: () => handleRemoveAcademic(row.id), className: "size-9 rounded-lg border border-border/40 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) }) })
            ] }, row.id)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none", children: "Prior Job Experience & Career History" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/75 mt-1", children: "Previous employment history, designations and clearances" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleAddExperience, className: "inline-flex items-center gap-1 bg-primary hover:opacity-95 text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-xs transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
              " Add Row"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[9px] uppercase font-bold tracking-wider text-muted-foreground/70 border-b border-border/30 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Organization / Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-40", children: "From Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-40", children: "To Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Reason for Leaving" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-56", children: "Attachment (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center w-16", children: "Action" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20", children: experiences.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Company Name", value: row.company, onChange: (e) => handleExperienceChange(row.id, "company", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Job Title / Role", value: row.designation, onChange: (e) => handleExperienceChange(row.id, "designation", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: row.from, onChange: (e) => handleExperienceChange(row.id, "from", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: row.to, onChange: (e) => handleExperienceChange(row.id, "to", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Reason for Resignation", value: row.reason, onChange: (e) => handleExperienceChange(row.id, "reason", e.target.value), className: "h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex-1 flex items-center justify-center gap-1.5 h-9 border border-dashed border-border/80 hover:border-primary/50 bg-background hover:bg-muted/20 rounded-lg text-[10px] font-bold text-muted-foreground cursor-pointer transition", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: row.file ? row.file.name : "Experience Copy" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".pdf,image/*", className: "hidden", onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file) handleExperienceChange(row.id, "file", file);
                  } })
                ] }),
                row.file && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleExperienceChange(row.id, "file", null), className: "size-9 rounded-lg border border-red-200 bg-red-50 text-red-650 flex items-center justify-center hover:bg-red-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: experiences.length === 1, onClick: () => handleRemoveExperience(row.id), className: "size-9 rounded-lg border border-border/40 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) }) })
            ] }, row.id)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4" }), title: "Nominee Declaration Dossier", subtitle: "Declared legal nominee details for official allocations and benefits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Nominee Full Name", placeholder: "Nominee's complete name", value: nomineeName, onChange: (e) => setNomineeName(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Relation", placeholder: "e.g. Spouse, Mother, Son", value: nomineeRelation, onChange: (e) => setNomineeRelation(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Nominee NID / Birth Reg", placeholder: "Identity credentials", value: nomineeNidReg, onChange: (e) => setNomineeNidReg(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldInput, { label: "Nominee Contact No", placeholder: "Nominee's mobile number", value: nomineeContact, onChange: (e) => setNomineeContact(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-card rounded-lg border border-border/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-semibold", children: [
            "All ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-bold", children: "*" }),
            " marked fields are required before application submission."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleReset, className: "h-10 px-8 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground font-bold text-xs transition-all", children: "Reset Form" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleSubmit, className: "h-10 px-10 rounded-lg bg-primary text-primary-foreground font-black text-xs shadow-md hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all", children: "Submit Application Form" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ERecruitmentForm as component
};
