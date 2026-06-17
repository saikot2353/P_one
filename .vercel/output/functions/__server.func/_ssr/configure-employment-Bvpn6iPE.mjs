import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as ChevronRight, aA as UserCheck, i as Plus, aY as Shield, ah as Award, t as Briefcase, aZ as Globe, aV as Heart, at as MapPin, S as Search, ax as FileSpreadsheet, P as Printer, d as FileText, ar as Pencil, ap as Trash2, X } from "../_libs/lucide-react.mjs";
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
const DEFAULT_DESIGNATIONS = [{
  sl: 1,
  name: "Sr. Operator",
  nameBng: "",
  shortName: "SO",
  isActive: "Active"
}, {
  sl: 2,
  name: "Asst. Supervisor",
  nameBng: "",
  shortName: "AS",
  isActive: "Active"
}];
const DEFAULT_JOB_TITLES = [{
  sl: 1,
  designationGroup: "Sr. Operator",
  code: "",
  titleEng: "Sr. Welder",
  titleBng: "সিনিঃ ওয়েল্ডার",
  empType: "ALL",
  lunchBill: "",
  attnBill: "",
  ifterBill: "",
  schedule: "",
  kajerDhoron: "ওয়েল্ডিং করে জোড়া দেওয়া",
  jobNature: "Select...",
  grade: "ALL",
  otType: "",
  sortOrder: 1,
  isActive: "Active"
}];
const DEFAULT_EMPLOYEE_TYPES = [{
  sl: 1,
  code: "PER",
  nameEng: "Permanent",
  nameBng: "স্থায়ী",
  shortName: "PER",
  isOfficer: "No",
  isWorker: "Yes",
  isActive: "Active"
}, {
  sl: 2,
  code: "PROB",
  nameEng: "Probation",
  nameBng: "শিক্ষানবিস",
  shortName: "PROB",
  isOfficer: "No",
  isWorker: "Yes",
  isActive: "Active"
}];
const DEFAULT_GRADES = [{
  sl: 1,
  grade: "Grade 1",
  gradeBng: "গ্রেড ১",
  basic: 15e3,
  houseRent: 7500,
  medical: 1500,
  transport: 1e3,
  food: 1500,
  other: 500,
  total: 27e3,
  isActive: "Active"
}, {
  sl: 2,
  grade: "Grade 2",
  gradeBng: "গ্রেড ২",
  basic: 12500,
  houseRent: 6250,
  medical: 1500,
  transport: 1e3,
  food: 1500,
  other: 250,
  total: 23e3,
  isActive: "Active"
}, {
  sl: 3,
  grade: "Grade 3",
  gradeBng: "গ্রেড ৩",
  basic: 10500,
  houseRent: 5250,
  medical: 1500,
  transport: 1e3,
  food: 1500,
  other: 0,
  total: 19750,
  isActive: "Active"
}, {
  sl: 4,
  grade: "Grade 4",
  gradeBng: "গ্রেড ৪",
  basic: 9500,
  houseRent: 4750,
  medical: 1500,
  transport: 1e3,
  food: 1500,
  other: 0,
  total: 18250,
  isActive: "Active"
}, {
  sl: 5,
  grade: "Grade 5",
  gradeBng: "গ্রেড ৫",
  basic: 8800,
  houseRent: 4400,
  medical: 1500,
  transport: 1e3,
  food: 1500,
  other: 0,
  total: 17200,
  isActive: "Active"
}, {
  sl: 6,
  grade: "Grade 6",
  gradeBng: "গ্রেড ৬",
  basic: 8400,
  houseRent: 4200,
  medical: 1500,
  transport: 1e3,
  food: 1500,
  other: 0,
  total: 16600,
  isActive: "Active"
}, {
  sl: 7,
  grade: "Grade 7",
  gradeBng: "গ্রেড ৭",
  basic: 8e3,
  houseRent: 4e3,
  medical: 1500,
  transport: 1e3,
  food: 1500,
  other: 0,
  total: 16e3,
  isActive: "Active"
}];
const DEFAULT_NATURES = [{
  sl: 1,
  name: "Direct",
  isActive: "Active"
}, {
  sl: 2,
  name: "Indirect",
  isActive: "Active"
}];
const DEFAULT_COUNTRIES = [{
  sl: 1,
  code: "BD",
  nameEng: "Bangladesh",
  nameBng: "বাংলাদেশ",
  shortName: "BD",
  nationality: "Bangladeshi",
  isActive: "Active"
}];
const DEFAULT_RELIGIONS = [{
  sl: 1,
  code: "IS",
  religionName: "Islam",
  religionNameBng: "ইসলাম",
  isActive: "Active"
}, {
  sl: 2,
  code: "HI",
  religionName: "Hinduism",
  religionNameBng: "সনাতন",
  isActive: "Active"
}, {
  sl: 3,
  code: "BU",
  religionName: "Buddhism",
  religionNameBng: "বৌদ্ধধর্ম",
  isActive: "Active"
}, {
  sl: 4,
  code: "CH",
  religionName: "Christianity",
  religionNameBng: "খ্রিস্টধর্ম",
  isActive: "Active"
}];
const DEFAULT_PLACES = [{
  sl: 1,
  code: "DH",
  nameEng: "Dhaka",
  nameBng: "ঢাকা",
  shortName: "DH",
  isActive: "Active"
}, {
  sl: 2,
  code: "GA",
  nameEng: "Gazipur",
  nameBng: "গাজীপুর",
  shortName: "GA",
  isActive: "Active"
}];
function EmploymentSetupPage() {
  const [activeTab, setActiveTab] = reactExports.useState("designationGroup");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [designations, setDesignations] = reactExports.useState([]);
  const [jobTitles, setJobTitles] = reactExports.useState([]);
  const [empTypes, setEmpTypes] = reactExports.useState([]);
  const [grades, setGrades] = reactExports.useState([]);
  const [natures, setNatures] = reactExports.useState([]);
  const [countries, setCountries] = reactExports.useState([]);
  const [religions, setReligions] = reactExports.useState([]);
  const [places, setPlaces] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["designationGroup", "jobTitle", "empType", "grade", "nature", "country", "religion", "place"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
    const safeParse = (key, defaultVal, requiredKey) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return defaultVal;
        if (requiredKey && parsed.length > 0 && parsed[0] && !(requiredKey in parsed[0])) {
          return defaultVal;
        }
        return parsed;
      } catch (e) {
        return defaultVal;
      }
    };
    const designationsData = safeParse("hris_designations", DEFAULT_DESIGNATIONS, "name");
    setDesignations(designationsData);
    localStorage.setItem("hris_designations", JSON.stringify(designationsData));
    const jobsData = safeParse("hris_job_titles", DEFAULT_JOB_TITLES, "titleEng");
    setJobTitles(jobsData);
    localStorage.setItem("hris_job_titles", JSON.stringify(jobsData));
    const typesData = safeParse("hris_employee_types", DEFAULT_EMPLOYEE_TYPES, "nameEng");
    setEmpTypes(typesData);
    localStorage.setItem("hris_employee_types", JSON.stringify(typesData));
    const gradesData = safeParse("hris_grades", DEFAULT_GRADES, "grade");
    setGrades(gradesData);
    localStorage.setItem("hris_grades", JSON.stringify(gradesData));
    const naturesData = safeParse("hris_job_natures", DEFAULT_NATURES, "name");
    setNatures(naturesData);
    localStorage.setItem("hris_job_natures", JSON.stringify(naturesData));
    const countriesData = safeParse("hris_countries", DEFAULT_COUNTRIES, "nameEng");
    setCountries(countriesData);
    localStorage.setItem("hris_countries", JSON.stringify(countriesData));
    const religionsData = safeParse("hris_religions", DEFAULT_RELIGIONS, "religionName");
    setReligions(religionsData);
    localStorage.setItem("hris_religions", JSON.stringify(religionsData));
    const placesData = safeParse("hris_places_in_bd", DEFAULT_PLACES, "nameEng");
    setPlaces(placesData);
    localStorage.setItem("hris_places_in_bd", JSON.stringify(placesData));
  }, []);
  const [isFormOpen, setIsFormOpen] = reactExports.useState(false);
  const [editSl, setEditSl] = reactExports.useState(null);
  const [desigName, setDesigName] = reactExports.useState("");
  const [desigNameBng, setDesigNameBng] = reactExports.useState("");
  const [desigShort, setDesigShort] = reactExports.useState("");
  const [desigIsActive, setDesigIsActive] = reactExports.useState("Active");
  const [jobDesigGroup, setJobDesigGroup] = reactExports.useState("");
  const [jobCode, setJobCode] = reactExports.useState("");
  const [jobTitleEng, setJobTitleEng] = reactExports.useState("");
  const [jobTitleBng, setJobTitleBng] = reactExports.useState("");
  const [jobEmpType, setJobEmpType] = reactExports.useState("ALL");
  const [jobLunch, setJobLunch] = reactExports.useState("");
  const [jobAttn, setJobAttn] = reactExports.useState("");
  const [jobIfter, setJobIfter] = reactExports.useState("");
  const [jobSchedule, setJobSchedule] = reactExports.useState("");
  const [jobKajer, setJobKajer] = reactExports.useState("");
  const [jobNature, setJobNature] = reactExports.useState("Select...");
  const [jobGrade, setJobGrade] = reactExports.useState("ALL");
  const [jobOtType, setJobOtType] = reactExports.useState("");
  const [jobSort, setJobSort] = reactExports.useState(0);
  const [jobIsActive, setJobIsActive] = reactExports.useState("Active");
  const [typeCode, setTypeCode] = reactExports.useState("");
  const [typeNameEng, setTypeNameEng] = reactExports.useState("");
  const [typeNameBng, setTypeNameBng] = reactExports.useState("");
  const [typeShort, setTypeShort] = reactExports.useState("");
  const [typeIsOfficer, setTypeIsOfficer] = reactExports.useState("No");
  const [typeIsWorker, setTypeIsWorker] = reactExports.useState("Yes");
  const [typeIsActive, setTypeIsActive] = reactExports.useState("Active");
  const [gradeName, setGradeName] = reactExports.useState("");
  const [gradeNameBng, setGradeNameBng] = reactExports.useState("");
  const [gradeBasic, setGradeBasic] = reactExports.useState(0);
  const [gradeHouseRent, setGradeHouseRent] = reactExports.useState(0);
  const [gradeMedical, setGradeMedical] = reactExports.useState(0);
  const [gradeTransport, setGradeTransport] = reactExports.useState(0);
  const [gradeFood, setGradeFood] = reactExports.useState(0);
  const [gradeOther, setGradeOther] = reactExports.useState(0);
  const [gradeIsActive, setGradeIsActive] = reactExports.useState("Active");
  const [natureName, setNatureName] = reactExports.useState("");
  const [natureIsActive, setNatureIsActive] = reactExports.useState("Active");
  const [countryCode, setCountryCode] = reactExports.useState("");
  const [countryNameEng, setCountryNameEng] = reactExports.useState("");
  const [countryNameBng, setCountryNameBng] = reactExports.useState("");
  const [countryShort, setCountryShort] = reactExports.useState("");
  const [countryNationality, setCountryNationality] = reactExports.useState("");
  const [countryIsActive, setCountryIsActive] = reactExports.useState("Active");
  const [religionCode, setReligionCode] = reactExports.useState("");
  const [religionNameEng, setReligionNameEng] = reactExports.useState("");
  const [religionNameBng, setReligionNameBng] = reactExports.useState("");
  const [religionIsActive, setReligionIsActive] = reactExports.useState("Active");
  const [placeCode, setPlaceCode] = reactExports.useState("");
  const [placeNameEng, setPlaceNameEng] = reactExports.useState("");
  const [placeNameBng, setPlaceNameBng] = reactExports.useState("");
  const [placeShort, setPlaceShort] = reactExports.useState("");
  const [placeIsActive, setPlaceIsActive] = reactExports.useState("Active");
  const openForm = (sl) => {
    setEditSl(sl);
    if (activeTab === "designationGroup") {
      const item = designations.find((d) => d.sl === sl);
      setDesigName(item?.name || "");
      setDesigNameBng(item?.nameBng || "");
      setDesigShort(item?.shortName || "");
      setDesigIsActive(item?.isActive || "Active");
    } else if (activeTab === "jobTitle") {
      const item = jobTitles.find((j) => j.sl === sl);
      setJobDesigGroup(item?.designationGroup || designations[0]?.name || "");
      setJobCode(item?.code || "");
      setJobTitleEng(item?.titleEng || "");
      setJobTitleBng(item?.titleBng || "");
      setJobEmpType(item?.empType || "ALL");
      setJobLunch(item?.lunchBill || "");
      setJobAttn(item?.attnBill || "");
      setJobIfter(item?.ifterBill || "");
      setJobSchedule(item?.schedule || "");
      setJobKajer(item?.kajerDhoron || "");
      setJobNature(item?.jobNature || "Select...");
      setJobGrade(item?.grade || "ALL");
      setJobOtType(item?.otType || "");
      setJobSort(item?.sortOrder || jobTitles.length + 1);
      setJobIsActive(item?.isActive || "Active");
    } else if (activeTab === "empType") {
      const item = empTypes.find((t) => t.sl === sl);
      setTypeCode(item?.code || "");
      setTypeNameEng(item?.nameEng || "");
      setTypeNameBng(item?.nameBng || "");
      setTypeShort(item?.shortName || "");
      setTypeIsOfficer(item?.isOfficer || "No");
      setTypeIsWorker(item?.isWorker || "Yes");
      setTypeIsActive(item?.isActive || "Active");
    } else if (activeTab === "grade") {
      const item = grades.find((g) => g.sl === sl);
      setGradeName(item?.grade || "");
      setGradeNameBng(item?.gradeBng || "");
      setGradeBasic(item?.basic || 0);
      setGradeHouseRent(item?.houseRent || 0);
      setGradeMedical(item?.medical || 0);
      setGradeTransport(item?.transport || 0);
      setGradeFood(item?.food || 0);
      setGradeOther(item?.other || 0);
      setGradeIsActive(item?.isActive || "Active");
    } else if (activeTab === "nature") {
      const item = natures.find((n) => n.sl === sl);
      setNatureName(item?.name || "");
      setNatureIsActive(item?.isActive || "Active");
    } else if (activeTab === "country") {
      const item = countries.find((c) => c.sl === sl);
      setCountryCode(item?.code || "");
      setCountryNameEng(item?.nameEng || "");
      setCountryNameBng(item?.nameBng || "");
      setCountryShort(item?.shortName || "");
      setCountryNationality(item?.nationality || "");
      setCountryIsActive(item?.isActive || "Active");
    } else if (activeTab === "religion") {
      const item = religions.find((r) => r.sl === sl);
      setReligionCode(item?.code || "");
      setReligionNameEng(item?.religionName || "");
      setReligionNameBng(item?.religionNameBng || "");
      setReligionIsActive(item?.isActive || "Active");
    } else if (activeTab === "place") {
      const item = places.find((p) => p.sl === sl);
      setPlaceCode(item?.code || "");
      setPlaceNameEng(item?.nameEng || "");
      setPlaceNameBng(item?.nameBng || "");
      setPlaceShort(item?.shortName || "");
      setPlaceIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };
  const handleDelete = (sl) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    if (activeTab === "designationGroup") {
      const updated = designations.filter((d) => d.sl !== sl).map((d, idx) => ({
        ...d,
        sl: idx + 1
      }));
      setDesignations(updated);
      localStorage.setItem("hris_designations", JSON.stringify(updated));
    } else if (activeTab === "jobTitle") {
      const updated = jobTitles.filter((j) => j.sl !== sl).map((j, idx) => ({
        ...j,
        sl: idx + 1
      }));
      setJobTitles(updated);
      localStorage.setItem("hris_job_titles", JSON.stringify(updated));
    } else if (activeTab === "empType") {
      const updated = empTypes.filter((t) => t.sl !== sl).map((t, idx) => ({
        ...t,
        sl: idx + 1
      }));
      setEmpTypes(updated);
      localStorage.setItem("hris_employee_types", JSON.stringify(updated));
    } else if (activeTab === "grade") {
      const updated = grades.filter((g) => g.sl !== sl).map((g, idx) => ({
        ...g,
        sl: idx + 1
      }));
      setGrades(updated);
      localStorage.setItem("hris_grades", JSON.stringify(updated));
    } else if (activeTab === "nature") {
      const updated = natures.filter((n) => n.sl !== sl).map((n, idx) => ({
        ...n,
        sl: idx + 1
      }));
      setNatures(updated);
      localStorage.setItem("hris_job_natures", JSON.stringify(updated));
    } else if (activeTab === "country") {
      const updated = countries.filter((c) => c.sl !== sl).map((c, idx) => ({
        ...c,
        sl: idx + 1
      }));
      setCountries(updated);
      localStorage.setItem("hris_countries", JSON.stringify(updated));
    } else if (activeTab === "religion") {
      const updated = religions.filter((r) => r.sl !== sl).map((r, idx) => ({
        ...r,
        sl: idx + 1
      }));
      setReligions(updated);
      localStorage.setItem("hris_religions", JSON.stringify(updated));
    } else if (activeTab === "place") {
      const updated = places.filter((p) => p.sl !== sl).map((p, idx) => ({
        ...p,
        sl: idx + 1
      }));
      setPlaces(updated);
      localStorage.setItem("hris_places_in_bd", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "designationGroup") {
      if (!desigName) {
        toast.error("Designation Group Name is required.");
        return;
      }
      let nextList = [...designations];
      if (editSl !== null) {
        nextList = designations.map((d) => d.sl === editSl ? {
          ...d,
          name: desigName,
          nameBng: desigNameBng,
          shortName: desigShort,
          isActive: desigIsActive
        } : d);
      } else {
        const sl = designations.length > 0 ? Math.max(...designations.map((d) => d.sl)) + 1 : 1;
        nextList.push({
          sl,
          name: desigName,
          nameBng: desigNameBng,
          shortName: desigShort,
          isActive: desigIsActive
        });
      }
      setDesignations(nextList);
      localStorage.setItem("hris_designations", JSON.stringify(nextList));
    } else if (activeTab === "jobTitle") {
      if (!jobTitleEng) {
        toast.error("Job Title (Eng) is required.");
        return;
      }
      let nextList = [...jobTitles];
      if (editSl !== null) {
        nextList = jobTitles.map((j) => j.sl === editSl ? {
          ...j,
          designationGroup: jobDesigGroup,
          code: jobCode,
          titleEng: jobTitleEng,
          titleBng: jobTitleBng,
          empType: jobEmpType,
          lunchBill: jobLunch,
          attnBill: jobAttn,
          ifterBill: jobIfter,
          schedule: jobSchedule,
          kajerDhoron: jobKajer,
          jobNature,
          grade: jobGrade,
          otType: jobOtType,
          sortOrder: Number(jobSort),
          isActive: jobIsActive
        } : j);
      } else {
        const sl = jobTitles.length > 0 ? Math.max(...jobTitles.map((j) => j.sl)) + 1 : 1;
        nextList.push({
          sl,
          designationGroup: jobDesigGroup,
          code: jobCode,
          titleEng: jobTitleEng,
          titleBng: jobTitleBng,
          empType: jobEmpType,
          lunchBill: jobLunch,
          attnBill: jobAttn,
          ifterBill: jobIfter,
          schedule: jobSchedule,
          kajerDhoron: jobKajer,
          jobNature,
          grade: jobGrade,
          otType: jobOtType,
          sortOrder: Number(jobSort),
          isActive: jobIsActive
        });
      }
      setJobTitles(nextList);
      localStorage.setItem("hris_job_titles", JSON.stringify(nextList));
    } else if (activeTab === "empType") {
      if (!typeNameEng) {
        toast.error("Employee Type Name is required.");
        return;
      }
      let nextList = [...empTypes];
      if (editSl !== null) {
        nextList = empTypes.map((t) => t.sl === editSl ? {
          ...t,
          code: typeCode,
          nameEng: typeNameEng,
          nameBng: typeNameBng,
          shortName: typeShort,
          isOfficer: typeIsOfficer,
          isWorker: typeIsWorker,
          isActive: typeIsActive
        } : t);
      } else {
        const sl = empTypes.length > 0 ? Math.max(...empTypes.map((t) => t.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: typeCode,
          nameEng: typeNameEng,
          nameBng: typeNameBng,
          shortName: typeShort,
          isOfficer: typeIsOfficer,
          isWorker: typeIsWorker,
          isActive: typeIsActive
        });
      }
      setEmpTypes(nextList);
      localStorage.setItem("hris_employee_types", JSON.stringify(nextList));
    } else if (activeTab === "grade") {
      if (!gradeName) {
        toast.error("Grade Name is required.");
        return;
      }
      let nextList = [...grades];
      const total = Number(gradeBasic) + Number(gradeHouseRent) + Number(gradeMedical) + Number(gradeTransport) + Number(gradeFood) + Number(gradeOther);
      if (editSl !== null) {
        nextList = grades.map((g) => g.sl === editSl ? {
          ...g,
          grade: gradeName,
          gradeBng: gradeNameBng,
          basic: Number(gradeBasic),
          houseRent: Number(gradeHouseRent),
          medical: Number(gradeMedical),
          transport: Number(gradeTransport),
          food: Number(gradeFood),
          other: Number(gradeOther),
          total,
          isActive: gradeIsActive
        } : g);
      } else {
        const sl = grades.length > 0 ? Math.max(...grades.map((g) => g.sl)) + 1 : 1;
        nextList.push({
          sl,
          grade: gradeName,
          gradeBng: gradeNameBng,
          basic: Number(gradeBasic),
          houseRent: Number(gradeHouseRent),
          medical: Number(gradeMedical),
          transport: Number(gradeTransport),
          food: Number(gradeFood),
          other: Number(gradeOther),
          total,
          isActive: gradeIsActive
        });
      }
      setGrades(nextList);
      localStorage.setItem("hris_grades", JSON.stringify(nextList));
    } else if (activeTab === "nature") {
      if (!natureName) {
        toast.error("Job Nature Name is required.");
        return;
      }
      let nextList = [...natures];
      if (editSl !== null) {
        nextList = natures.map((n) => n.sl === editSl ? {
          ...n,
          name: natureName,
          isActive: natureIsActive
        } : n);
      } else {
        const sl = natures.length > 0 ? Math.max(...natures.map((n) => n.sl)) + 1 : 1;
        nextList.push({
          sl,
          name: natureName,
          isActive: natureIsActive
        });
      }
      setNatures(nextList);
      localStorage.setItem("hris_job_natures", JSON.stringify(nextList));
    } else if (activeTab === "country") {
      if (!countryNameEng) {
        toast.error("Country Name is required.");
        return;
      }
      let nextList = [...countries];
      if (editSl !== null) {
        nextList = countries.map((c) => c.sl === editSl ? {
          ...c,
          code: countryCode,
          nameEng: countryNameEng,
          nameBng: countryNameBng,
          shortName: countryShort,
          nationality: countryNationality,
          isActive: countryIsActive
        } : c);
      } else {
        const sl = countries.length > 0 ? Math.max(...countries.map((c) => c.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: countryCode,
          nameEng: countryNameEng,
          nameBng: countryNameBng,
          shortName: countryShort,
          nationality: countryNationality,
          isActive: countryIsActive
        });
      }
      setCountries(nextList);
      localStorage.setItem("hris_countries", JSON.stringify(nextList));
    } else if (activeTab === "religion") {
      if (!religionNameEng) {
        toast.error("Religion Name is required.");
        return;
      }
      let nextList = [...religions];
      if (editSl !== null) {
        nextList = religions.map((r) => r.sl === editSl ? {
          ...r,
          code: religionCode,
          religionName: religionNameEng,
          religionNameBng,
          isActive: religionIsActive
        } : r);
      } else {
        const sl = religions.length > 0 ? Math.max(...religions.map((r) => r.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: religionCode,
          religionName: religionNameEng,
          religionNameBng,
          isActive: religionIsActive
        });
      }
      setReligions(nextList);
      localStorage.setItem("hris_religions", JSON.stringify(nextList));
    } else if (activeTab === "place") {
      if (!placeNameEng) {
        toast.error("District Name is required.");
        return;
      }
      let nextList = [...places];
      if (editSl !== null) {
        nextList = places.map((p) => p.sl === editSl ? {
          ...p,
          code: placeCode,
          nameEng: placeNameEng,
          nameBng: placeNameBng,
          shortName: placeShort,
          isActive: placeIsActive
        } : p);
      } else {
        const sl = places.length > 0 ? Math.max(...places.map((p) => p.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: placeCode,
          nameEng: placeNameEng,
          nameBng: placeNameBng,
          shortName: placeShort,
          isActive: placeIsActive
        });
      }
      setPlaces(nextList);
      localStorage.setItem("hris_places_in_bd", JSON.stringify(nextList));
    }
    toast.success("Saved successfully");
    setIsFormOpen(false);
  };
  const insetWrapperClass = "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass = "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";
  const tabsList = [{
    type: "designationGroup",
    label: "Designation Group",
    icon: Shield
  }, {
    type: "jobTitle",
    label: "Job Title",
    icon: Award
  }, {
    type: "empType",
    label: "Employee Type",
    icon: UserCheck
  }, {
    type: "grade",
    label: "Grade",
    icon: Briefcase
  }, {
    type: "nature",
    label: "Job Nature",
    icon: Briefcase
  }, {
    type: "country",
    label: "Country",
    icon: Globe
  }, {
    type: "religion",
    label: "Religion",
    icon: Heart
  }, {
    type: "place",
    label: "Place in BD",
    icon: MapPin
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-2 max-w-[1800px] mx-auto w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Configure" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Employment Setup" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-5.5 text-primary" }),
              "Job & Employee Configuration"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openForm(null), className: "h-10 px-5 rounded-lg bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 animate-bounce" }),
            " Add New Record"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 border-b border-border/50 pb-2", children: tabsList.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.type;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setActiveTab(tab.type);
            setSearchQuery("");
          }, className: `flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border border-border/85 hover:bg-muted text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabIcon, { className: "size-4" }),
            tab.label
          ] }, tab.type);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/65 border border-border/40 rounded-lg px-3 py-1.5 w-full md:w-80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-muted-foreground/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: `Search ${tabsList.find((t) => t.type === activeTab)?.label}...`, value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "bg-transparent border-0 outline-none text-xs w-full text-foreground placeholder:text-muted-foreground/60 font-semibold" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full md:w-auto justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toast.success("Exporting to Excel..."), className: "h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-4 text-emerald-600" }),
              " EXCEL"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => window.print(), className: "h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 text-blue-600" }),
              " PRINT"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toast.success("Generating PDF..."), className: "h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-red-600" }),
              " PDF"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
          activeTab === "designationGroup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Designation Group" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Designation Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: designations.filter((d) => (d.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.shortName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "jobTitle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "1600px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px]", children: "Designation Group" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Designation Title (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Job Title (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Emp Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Lunch Bill" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Attn. Bill" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Ifter Bill" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Schedule" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Kajer Dhoron" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Job Nature" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Grade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "OT Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Sort Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: jobTitles.filter((j) => (j.titleEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200", children: item.designationGroup }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono text-slate-700 dark:text-slate-300", children: item.code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.titleEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-slate-800 dark:text-slate-200 font-normal", children: item.titleBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400", children: item.empType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.lunchBill || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.attnBill || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.ifterBill || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.schedule || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal max-w-[200px] truncate", children: item.kajerDhoron || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400", children: item.jobNature }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400", children: item.grade }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400", children: item.otType || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.sortOrder }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "empType" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "900px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Employee Type (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Employee Type (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsOfficer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsWorker" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: empTypes.filter((t) => (t.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.nameEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.shortName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.isOfficer }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.isWorker }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "1200px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Grade (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Grade (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-right", children: "Basic" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-right", children: "House Rent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-right", children: "Medical" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-right", children: "Transport" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-right", children: "Food" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-right", children: "Other" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-right", children: "Total Salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: grades.filter((g) => (g.grade || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.grade }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.gradeBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: item.basic }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: item.houseRent }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: item.medical }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: item.transport }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: item.food }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: item.other }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono text-primary font-bold", children: item.total }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "nature" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Job Nature" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: natures.filter((n) => (n.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "country" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "900px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Country (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Country (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Nationality" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: countries.filter((c) => (c.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.nameEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.shortName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.nationality || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "religion" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Religion Name (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Religion Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: religions.filter((r) => (r.religionName || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.religionName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.religionNameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "place" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "District Name (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "District Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: places.filter((p) => (p.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.nameEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.shortName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] })
        ] }) })
      ] }),
      isFormOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-black tracking-tight text-foreground", children: [
              editSl ? "Update" : "Create",
              " ",
              tabsList.find((t) => t.type === activeTab)?.label
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsFormOpen(false), className: "size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-4", children: [
          activeTab === "designationGroup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Designation Group Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Group Name", value: desigName, onChange: (e) => setDesigName(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Designation Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Designation Name (Bng)", value: desigNameBng, onChange: (e) => setDesigNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Short Name", value: desigShort, onChange: (e) => setDesigShort(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: desigIsActive, onChange: (e) => setDesigIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "jobTitle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Designation Group *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: jobDesigGroup, onChange: (e) => setJobDesigGroup(e.target.value), className: insetSelectClass, children: designations.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d.name, children: d.name }, d.sl)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Code", value: jobCode, onChange: (e) => setJobCode(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Designation Title (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Title (Eng)", value: jobTitleEng, onChange: (e) => setJobTitleEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Designation Title (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Title (Bng)", value: jobTitleBng, onChange: (e) => setJobTitleBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: jobEmpType, onChange: (e) => setJobEmpType(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                empTypes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.nameEng, children: t.nameEng }, t.sl))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Grade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: jobGrade, onChange: (e) => setJobGrade(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                grades.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g.grade, children: g.grade }, g.sl))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "OT Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "OT Type", value: jobOtType, onChange: (e) => setJobOtType(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Lunch Bill" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Lunch Bill", value: jobLunch, onChange: (e) => setJobLunch(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Attendance Bonus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Attendance Bonus", value: jobAttn, onChange: (e) => setJobAttn(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Ifter Bill" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Ifter Bill", value: jobIfter, onChange: (e) => setJobIfter(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Schedule" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Schedule", value: jobSchedule, onChange: (e) => setJobSchedule(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Kajer Dhoron (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Kajer Dhoron", value: jobKajer, onChange: (e) => setJobKajer(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Job Nature" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: jobNature, onChange: (e) => setJobNature(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Select...", children: "Select..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Direct", children: "Direct" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Indirect", children: "Indirect" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Sort Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", placeholder: "Sort Order", value: jobSort, onChange: (e) => setJobSort(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${insetWrapperClass} sm:col-span-2`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: jobIsActive, onChange: (e) => setJobIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "empType" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Type Code *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Code", value: typeCode, onChange: (e) => setTypeCode(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Eng)", value: typeNameEng, onChange: (e) => setTypeNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Bng)", value: typeNameBng, onChange: (e) => setTypeNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Short Name", value: typeShort, onChange: (e) => setTypeShort(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsOfficer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: typeIsOfficer, onChange: (e) => setTypeIsOfficer(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsWorker" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: typeIsWorker, onChange: (e) => setTypeIsWorker(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: typeIsActive, onChange: (e) => setTypeIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Grade (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Grade (Eng)", value: gradeName, onChange: (e) => setGradeName(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Grade (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Grade (Bng)", value: gradeNameBng, onChange: (e) => setGradeNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Basic Salary *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: gradeBasic, onChange: (e) => setGradeBasic(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "House Rent *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: gradeHouseRent, onChange: (e) => setGradeHouseRent(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Medical Allowance *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: gradeMedical, onChange: (e) => setGradeMedical(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Transport Allowance *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: gradeTransport, onChange: (e) => setGradeTransport(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Food Allowance *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: gradeFood, onChange: (e) => setGradeFood(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Other Allowance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: gradeOther, onChange: (e) => setGradeOther(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${insetWrapperClass} sm:col-span-2`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gradeIsActive, onChange: (e) => setGradeIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "nature" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Job Nature Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Direct / Indirect", value: natureName, onChange: (e) => setNatureName(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: natureIsActive, onChange: (e) => setNatureIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "country" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Country Code *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. BD", value: countryCode, onChange: (e) => setCountryCode(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Country Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Country (Eng)", value: countryNameEng, onChange: (e) => setCountryNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Country Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Country (Bng)", value: countryNameBng, onChange: (e) => setCountryNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Short Name", value: countryShort, onChange: (e) => setCountryShort(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Nationality" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Nationality", value: countryNationality, onChange: (e) => setCountryNationality(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: countryIsActive, onChange: (e) => setCountryIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "religion" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Religion Code *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Code", value: religionCode, onChange: (e) => setReligionCode(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Religion Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Religion (Eng)", value: religionNameEng, onChange: (e) => setReligionNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Religion Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Religion (Bng)", value: religionNameBng, onChange: (e) => setReligionNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: religionIsActive, onChange: (e) => setReligionIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "place" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "District Code *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Code", value: placeCode, onChange: (e) => setPlaceCode(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "District Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "District (Eng)", value: placeNameEng, onChange: (e) => setPlaceNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "District Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "District (Bng)", value: placeNameBng, onChange: (e) => setPlaceNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Short Name", value: placeShort, onChange: (e) => setPlaceShort(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: placeIsActive, onChange: (e) => setPlaceIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-5 flex items-center justify-between gap-3 bg-[#f8fafc] dark:bg-[#0f172a] -mx-6 -mb-6 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsFormOpen(false), className: "h-10 px-6 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-xs transition-all uppercase tracking-wider shadow-sm hover:shadow", children: "CLOSE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-10 px-8 rounded-lg text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 bg-[#2ecc71] hover:bg-[#27ae60]", children: editSl ? "UPDATE" : "CREATE" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  EmploymentSetupPage as component
};
