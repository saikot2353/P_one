import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Search, Plus, Pencil, Trash2, X,
  FileSpreadsheet, Printer, FileText, UserCheck, Shield,
  Award, Globe, Heart, MapPin, Briefcase, SlidersHorizontal, GripVertical
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-employment")({
  head: () => ({
    meta: [
      { title: "Employment Setup — CRIPTON HRIS" },
      { name: "description", content: "Configure designation groups, job titles, employee types, grades, countries, religions, and places in BD." },
    ],
  }),
  component: EmploymentSetupPage,
});

type TabType = "designationGroup" | "jobTitle" | "empType" | "grade" | "nature" | "country" | "religion" | "place";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
interface DesignationGroup {
  sl: number;
  name: string;
  nameBng: string;
  shortName: string;
  isActive: "Active" | "Inactive";
}

interface JobTitle {
  sl: number;
  designationGroup: string;
  code: string;
  titleEng: string;
  titleBng: string;
  empType: string;
  lunchBill: string;
  attnBill: string;
  ifterBill: string;
  schedule: string;
  kajerDhoron: string;
  jobNature: string;
  grade: string;
  otType: string;
  sortOrder: number;
  isActive: "Active" | "Inactive";
}

interface EmployeeType {
  sl: number;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  isOfficer: "Yes" | "No";
  isWorker: "Yes" | "No";
  isActive: "Active" | "Inactive";
}

interface Grade {
  sl: number;
  grade: string;
  gradeBng: string;
  basic: number;
  houseRent: number;
  medical: number;
  transport: number;
  food: number;
  other: number;
  total: number;
  isActive: "Active" | "Inactive";
}

interface JobNature {
  sl: number;
  name: string;
  isActive: "Active" | "Inactive";
}

interface Country {
  sl: number;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  nationality: string;
  isActive: "Active" | "Inactive";
}

interface Religion {
  sl: number;
  code: string;
  religionName: string;
  religionNameBng: string;
  isActive: "Active" | "Inactive";
}

interface PlaceInBD {
  sl: number;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  isActive: "Active" | "Inactive";
}

// ----------------------------------------------------
// Defaults
// ----------------------------------------------------
const DEFAULT_DESIGNATIONS: DesignationGroup[] = [
  { sl: 1, name: "Managing Director", nameBng: "ব্যবস্থাপনা পরিচালক", shortName: "MD", isActive: "Active" },
  { sl: 2, name: "Executive Director", nameBng: "নির্বাহী পরিচালক", shortName: "ED", isActive: "Active" },
  { sl: 3, name: "Director", nameBng: "পরিচালক", shortName: "DIR", isActive: "Active" },
  { sl: 4, name: "General Manager", nameBng: "মহাব্যবস্থাপক", shortName: "GM", isActive: "Active" },
  { sl: 5, name: "Deputy General Manager", nameBng: "উপ-মহাব্যবস্থাপক", shortName: "DGM", isActive: "Active" },
  { sl: 6, name: "Assistant General Manager", nameBng: "সহকারী মহাব্যবস্থাপক", shortName: "AGM", isActive: "Active" },
  { sl: 7, name: "Manager", nameBng: "ব্যবস্থাপক", shortName: "MGR", isActive: "Active" },
  { sl: 8, name: "Deputy Manager", nameBng: "উপ-ব্যবস্থাপক", shortName: "DMGR", isActive: "Active" },
  { sl: 9, name: "Assistant Manager", nameBng: "সহকারী ব্যবস্থাপক", shortName: "AMGR", isActive: "Active" },
  { sl: 10, name: "Senior Executive", nameBng: "সিনিয়র এক্সিকিউটিভ", shortName: "SR.EXE", isActive: "Active" },
  { sl: 11, name: "Executive", nameBng: "এক্সিকিউটিভ", shortName: "EXE", isActive: "Active" },
  { sl: 12, name: "Junior Executive", nameBng: "জুনিয়র এক্সিকিউটিভ", shortName: "JR.EXE", isActive: "Active" }
];

const DEFAULT_DESIGNATIONS_POOL = [
  "Managing Director",
  "Executive Director",
  "Director",
  "General Manager",
  "Deputy General Manager",
  "Assistant General Manager",
  "Manager",
  "Deputy Manager",
  "Assistant Manager",
  "Senior Executive",
  "Executive",
  "Junior Executive",
  "Senior Officer",
  "Officer",
  "Junior Officer",
  "Senior Supervisor",
  "Supervisor",
  "Asst. Supervisor",
  "Line Leader",
  "Operator",
  "Asst. Operator",
  "Helper"
];

const DEFAULT_JOB_TITLES: JobTitle[] = [
  { sl: 1, designationGroup: "Sr. Operator", code: "", titleEng: "Sr. Welder", titleBng: "সিনিঃ ওয়েল্ডার", empType: "ALL", lunchBill: "", attnBill: "", ifterBill: "", schedule: "", kajerDhoron: "ওয়েল্ডিং করে জোড়া দেওয়া", jobNature: "Select...", grade: "ALL", otType: "", sortOrder: 1, isActive: "Active" }
];

const DEFAULT_EMPLOYEE_TYPES: EmployeeType[] = [
  { sl: 1, code: "PER", nameEng: "Permanent", nameBng: "স্থায়ী", shortName: "PER", isOfficer: "No", isWorker: "Yes", isActive: "Active" },
  { sl: 2, code: "PROB", nameEng: "Probation", nameBng: "শিক্ষানবিস", shortName: "PROB", isOfficer: "No", isWorker: "Yes", isActive: "Active" }
];

const DEFAULT_GRADES: Grade[] = [
  { sl: 1, grade: "Grade 1", gradeBng: "গ্রেড ১", basic: 15000, houseRent: 7500, medical: 1500, transport: 1000, food: 1500, other: 500, total: 27000, isActive: "Active" },
  { sl: 2, grade: "Grade 2", gradeBng: "গ্রেড ২", basic: 12500, houseRent: 6250, medical: 1500, transport: 1000, food: 1500, other: 250, total: 23000, isActive: "Active" },
  { sl: 3, grade: "Grade 3", gradeBng: "গ্রেড ৩", basic: 10500, houseRent: 5250, medical: 1500, transport: 1000, food: 1500, other: 0, total: 19750, isActive: "Active" },
  { sl: 4, grade: "Grade 4", gradeBng: "গ্রেড ৪", basic: 9500, houseRent: 4750, medical: 1500, transport: 1000, food: 1500, other: 0, total: 18250, isActive: "Active" },
  { sl: 5, grade: "Grade 5", gradeBng: "গ্রেড ৫", basic: 8800, houseRent: 4400, medical: 1500, transport: 1000, food: 1500, other: 0, total: 17200, isActive: "Active" },
  { sl: 6, grade: "Grade 6", gradeBng: "গ্রেড ৬", basic: 8400, houseRent: 4200, medical: 1500, transport: 1000, food: 1500, other: 0, total: 16600, isActive: "Active" },
  { sl: 7, grade: "Grade 7", gradeBng: "গ্রেড ৭", basic: 8000, houseRent: 4000, medical: 1500, transport: 1000, food: 1500, other: 0, total: 16000, isActive: "Active" }
];

const DEFAULT_NATURES: JobNature[] = [
  { sl: 1, name: "Direct", isActive: "Active" },
  { sl: 2, name: "Indirect", isActive: "Active" }
];

const DEFAULT_COUNTRIES: Country[] = [
  { sl: 1, code: "BD", nameEng: "Bangladesh", nameBng: "বাংলাদেশ", shortName: "BD", nationality: "Bangladeshi", isActive: "Active" }
];

const DEFAULT_RELIGIONS: Religion[] = [
  { sl: 1, code: "IS", religionName: "Islam", religionNameBng: "ইসলাম", isActive: "Active" },
  { sl: 2, code: "HI", religionName: "Hinduism", religionNameBng: "সনাতন", isActive: "Active" },
  { sl: 3, code: "BU", religionName: "Buddhism", religionNameBng: "বৌদ্ধধর্ম", isActive: "Active" },
  { sl: 4, code: "CH", religionName: "Christianity", religionNameBng: "খ্রিস্টধর্ম", isActive: "Active" }
];

const DEFAULT_PLACES: PlaceInBD[] = [
  { sl: 1, code: "DH", nameEng: "Dhaka", nameBng: "ঢাকা", shortName: "DH", isActive: "Active" },
  { sl: 2, code: "GA", nameEng: "Gazipur", nameBng: "গাজীপুর", shortName: "GA", isActive: "Active" }
];

function EmploymentSetupPage() {
  const [activeTab, setActiveTab] = useState<TabType>("designationGroup");
  const [searchQuery, setSearchQuery] = useState("");

  // Lists state
  const [designations, setDesignations] = useState<DesignationGroup[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [empTypes, setEmpTypes] = useState<EmployeeType[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [natures, setNatures] = useState<JobNature[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [places, setPlaces] = useState<PlaceInBD[]>([]);

  // Reorder modal states
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [tempDesignations, setTempDesignations] = useState<DesignationGroup[]>([]);

  // Fresh Reorder modal states
  const [isFreshOrderModalOpen, setIsFreshOrderModalOpen] = useState(false);
  const [availableList, setAvailableList] = useState<string[]>([]);
  const [orderedList, setOrderedList] = useState<string[]>([]);
  const [availableSearchQuery, setAvailableSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabType;
      if (tabParam && ["designationGroup", "jobTitle", "empType", "grade", "nature", "country", "religion", "place"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    const safeParse = (key: string, defaultVal: any, requiredKey?: string) => {
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

    // Designation Group
    let designationsData = safeParse("hris_designations", DEFAULT_DESIGNATIONS, "name");
    if (designationsData.length <= 2) {
      designationsData = DEFAULT_DESIGNATIONS;
    }
    setDesignations(designationsData);
    localStorage.setItem("hris_designations", JSON.stringify(designationsData));

    // Job Titles
    const jobsData = safeParse("hris_job_titles", DEFAULT_JOB_TITLES, "titleEng");
    setJobTitles(jobsData);
    localStorage.setItem("hris_job_titles", JSON.stringify(jobsData));

    // Employee Types
    const typesData = safeParse("hris_employee_types", DEFAULT_EMPLOYEE_TYPES, "nameEng");
    setEmpTypes(typesData);
    localStorage.setItem("hris_employee_types", JSON.stringify(typesData));

    // Grades
    const gradesData = safeParse("hris_grades", DEFAULT_GRADES, "grade");
    setGrades(gradesData);
    localStorage.setItem("hris_grades", JSON.stringify(gradesData));

    // Job Natures
    const naturesData = safeParse("hris_job_natures", DEFAULT_NATURES, "name");
    setNatures(naturesData);
    localStorage.setItem("hris_job_natures", JSON.stringify(naturesData));

    // Countries
    const countriesData = safeParse("hris_countries", DEFAULT_COUNTRIES, "nameEng");
    setCountries(countriesData);
    localStorage.setItem("hris_countries", JSON.stringify(countriesData));

    // Religions
    const religionsData = safeParse("hris_religions", DEFAULT_RELIGIONS, "religionName");
    setReligions(religionsData);
    localStorage.setItem("hris_religions", JSON.stringify(religionsData));

    // Places
    const placesData = safeParse("hris_places_in_bd", DEFAULT_PLACES, "nameEng");
    setPlaces(placesData);
    localStorage.setItem("hris_places_in_bd", JSON.stringify(placesData));
  }, []);

  // Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSl, setEditSl] = useState<number | null>(null);

  // Form states - Designation Group
  const [desigName, setDesigName] = useState("");
  const [desigNameBng, setDesigNameBng] = useState("");
  const [desigShort, setDesigShort] = useState("");
  const [desigIsActive, setDesigIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Job Title
  const [jobDesigGroup, setJobDesigGroup] = useState("");
  const [jobCode, setJobCode] = useState("");
  const [jobTitleEng, setJobTitleEng] = useState("");
  const [jobTitleBng, setJobTitleBng] = useState("");
  const [jobEmpType, setJobEmpType] = useState("ALL");
  const [jobLunch, setJobLunch] = useState("");
  const [jobAttn, setJobAttn] = useState("");
  const [jobIfter, setJobIfter] = useState("");
  const [jobSchedule, setJobSchedule] = useState("");
  const [jobKajer, setJobKajer] = useState("");
  const [jobNature, setJobNature] = useState("Select...");
  const [jobGrade, setJobGrade] = useState("ALL");
  const [jobOtType, setJobOtType] = useState("");
  const [jobSort, setJobSort] = useState<number>(0);
  const [jobIsActive, setJobIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Employee Type
  const [typeCode, setTypeCode] = useState("");
  const [typeNameEng, setTypeNameEng] = useState("");
  const [typeNameBng, setTypeNameBng] = useState("");
  const [typeShort, setTypeShort] = useState("");
  const [typeIsOfficer, setTypeIsOfficer] = useState<"Yes" | "No">("No");
  const [typeIsWorker, setTypeIsWorker] = useState<"Yes" | "No">("Yes");
  const [typeIsActive, setTypeIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Grade
  const [gradeName, setGradeName] = useState("");
  const [gradeNameBng, setGradeNameBng] = useState("");
  const [gradeBasic, setGradeBasic] = useState<number>(0);
  const [gradeHouseRent, setGradeHouseRent] = useState<number>(0);
  const [gradeMedical, setGradeMedical] = useState<number>(0);
  const [gradeTransport, setGradeTransport] = useState<number>(0);
  const [gradeFood, setGradeFood] = useState<number>(0);
  const [gradeOther, setGradeOther] = useState<number>(0);
  const [gradeIsActive, setGradeIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Job Nature
  const [natureName, setNatureName] = useState("");
  const [natureIsActive, setNatureIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Country
  const [countryCode, setCountryCode] = useState("");
  const [countryNameEng, setCountryNameEng] = useState("");
  const [countryNameBng, setCountryNameBng] = useState("");
  const [countryShort, setCountryShort] = useState("");
  const [countryNationality, setCountryNationality] = useState("");
  const [countryIsActive, setCountryIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Religion
  const [religionCode, setReligionCode] = useState("");
  const [religionNameEng, setReligionNameEng] = useState("");
  const [religionNameBng, setReligionNameBng] = useState("");
  const [religionIsActive, setReligionIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Place in BD (District)
  const [placeCode, setPlaceCode] = useState("");
  const [placeNameEng, setPlaceNameEng] = useState("");
  const [placeNameBng, setPlaceNameBng] = useState("");
  const [placeShort, setPlaceShort] = useState("");
  const [placeIsActive, setPlaceIsActive] = useState<"Active" | "Inactive">("Active");

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "designationGroup") {
      const item = designations.find(d => d.sl === sl);
      setDesigName(item?.name || "");
      setDesigNameBng(item?.nameBng || "");
      setDesigShort(item?.shortName || "");
      setDesigIsActive(item?.isActive || "Active");
    } else if (activeTab === "jobTitle") {
      const item = jobTitles.find(j => j.sl === sl);
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
      const item = empTypes.find(t => t.sl === sl);
      setTypeCode(item?.code || "");
      setTypeNameEng(item?.nameEng || "");
      setTypeNameBng(item?.nameBng || "");
      setTypeShort(item?.shortName || "");
      setTypeIsOfficer(item?.isOfficer || "No");
      setTypeIsWorker(item?.isWorker || "Yes");
      setTypeIsActive(item?.isActive || "Active");
    } else if (activeTab === "grade") {
      const item = grades.find(g => g.sl === sl);
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
      const item = natures.find(n => n.sl === sl);
      setNatureName(item?.name || "");
      setNatureIsActive(item?.isActive || "Active");
    } else if (activeTab === "country") {
      const item = countries.find(c => c.sl === sl);
      setCountryCode(item?.code || "");
      setCountryNameEng(item?.nameEng || "");
      setCountryNameBng(item?.nameBng || "");
      setCountryShort(item?.shortName || "");
      setCountryNationality(item?.nationality || "");
      setCountryIsActive(item?.isActive || "Active");
    } else if (activeTab === "religion") {
      const item = religions.find(r => r.sl === sl);
      setReligionCode(item?.code || "");
      setReligionNameEng(item?.religionName || "");
      setReligionNameBng(item?.religionNameBng || "");
      setReligionIsActive(item?.isActive || "Active");
    } else if (activeTab === "place") {
      const item = places.find(p => p.sl === sl);
      setPlaceCode(item?.code || "");
      setPlaceNameEng(item?.nameEng || "");
      setPlaceNameBng(item?.nameBng || "");
      setPlaceShort(item?.shortName || "");
      setPlaceIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "designationGroup") {
      const updated = designations.filter(d => d.sl !== sl).map((d, idx) => ({ ...d, sl: idx + 1 }));
      setDesignations(updated);
      localStorage.setItem("hris_designations", JSON.stringify(updated));
    } else if (activeTab === "jobTitle") {
      const updated = jobTitles.filter(j => j.sl !== sl).map((j, idx) => ({ ...j, sl: idx + 1 }));
      setJobTitles(updated);
      localStorage.setItem("hris_job_titles", JSON.stringify(updated));
    } else if (activeTab === "empType") {
      const updated = empTypes.filter(t => t.sl !== sl).map((t, idx) => ({ ...t, sl: idx + 1 }));
      setEmpTypes(updated);
      localStorage.setItem("hris_employee_types", JSON.stringify(updated));
    } else if (activeTab === "grade") {
      const updated = grades.filter(g => g.sl !== sl).map((g, idx) => ({ ...g, sl: idx + 1 }));
      setGrades(updated);
      localStorage.setItem("hris_grades", JSON.stringify(updated));
    } else if (activeTab === "nature") {
      const updated = natures.filter(n => n.sl !== sl).map((n, idx) => ({ ...n, sl: idx + 1 }));
      setNatures(updated);
      localStorage.setItem("hris_job_natures", JSON.stringify(updated));
    } else if (activeTab === "country") {
      const updated = countries.filter(c => c.sl !== sl).map((c, idx) => ({ ...c, sl: idx + 1 }));
      setCountries(updated);
      localStorage.setItem("hris_countries", JSON.stringify(updated));
    } else if (activeTab === "religion") {
      const updated = religions.filter(r => r.sl !== sl).map((r, idx) => ({ ...r, sl: idx + 1 }));
      setReligions(updated);
      localStorage.setItem("hris_religions", JSON.stringify(updated));
    } else if (activeTab === "place") {
      const updated = places.filter(p => p.sl !== sl).map((p, idx) => ({ ...p, sl: idx + 1 }));
      setPlaces(updated);
      localStorage.setItem("hris_places_in_bd", JSON.stringify(updated));
    }

    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "designationGroup") {
      if (!desigName) { toast.error("Designation Group Name is required."); return; }
      let nextList = [...designations];
      if (editSl !== null) {
        nextList = designations.map(d => d.sl === editSl ? { ...d, name: desigName, nameBng: desigNameBng, shortName: desigShort, isActive: desigIsActive } : d);
      } else {
        const sl = designations.length > 0 ? Math.max(...designations.map(d => d.sl)) + 1 : 1;
        nextList.push({ sl, name: desigName, nameBng: desigNameBng, shortName: desigShort, isActive: desigIsActive });
      }
      setDesignations(nextList);
      localStorage.setItem("hris_designations", JSON.stringify(nextList));
    } else if (activeTab === "jobTitle") {
      if (!jobTitleEng) { toast.error("Job Title (Eng) is required."); return; }
      let nextList = [...jobTitles];
      if (editSl !== null) {
        nextList = jobTitles.map(j => j.sl === editSl ? { ...j, designationGroup: jobDesigGroup, code: jobCode, titleEng: jobTitleEng, titleBng: jobTitleBng, empType: jobEmpType, lunchBill: jobLunch, attnBill: jobAttn, ifterBill: jobIfter, schedule: jobSchedule, kajerDhoron: jobKajer, jobNature: jobNature, grade: jobGrade, otType: jobOtType, sortOrder: Number(jobSort), isActive: jobIsActive } : j);
      } else {
        const sl = jobTitles.length > 0 ? Math.max(...jobTitles.map(j => j.sl)) + 1 : 1;
        nextList.push({ sl, designationGroup: jobDesigGroup, code: jobCode, titleEng: jobTitleEng, titleBng: jobTitleBng, empType: jobEmpType, lunchBill: jobLunch, attnBill: jobAttn, ifterBill: jobIfter, schedule: jobSchedule, kajerDhoron: jobKajer, jobNature: jobNature, grade: jobGrade, otType: jobOtType, sortOrder: Number(jobSort), isActive: jobIsActive });
      }
      setJobTitles(nextList);
      localStorage.setItem("hris_job_titles", JSON.stringify(nextList));
    } else if (activeTab === "empType") {
      if (!typeNameEng) { toast.error("Employee Type Name is required."); return; }
      let nextList = [...empTypes];
      if (editSl !== null) {
        nextList = empTypes.map(t => t.sl === editSl ? { ...t, code: typeCode, nameEng: typeNameEng, nameBng: typeNameBng, shortName: typeShort, isOfficer: typeIsOfficer, isWorker: typeIsWorker, isActive: typeIsActive } : t);
      } else {
        const sl = empTypes.length > 0 ? Math.max(...empTypes.map(t => t.sl)) + 1 : 1;
        nextList.push({ sl, code: typeCode, nameEng: typeNameEng, nameBng: typeNameBng, shortName: typeShort, isOfficer: typeIsOfficer, isWorker: typeIsWorker, isActive: typeIsActive });
      }
      setEmpTypes(nextList);
      localStorage.setItem("hris_employee_types", JSON.stringify(nextList));
    } else if (activeTab === "grade") {
      if (!gradeName) { toast.error("Grade Name is required."); return; }
      let nextList = [...grades];
      const total = Number(gradeBasic) + Number(gradeHouseRent) + Number(gradeMedical) + Number(gradeTransport) + Number(gradeFood) + Number(gradeOther);
      if (editSl !== null) {
        nextList = grades.map(g => g.sl === editSl ? { ...g, grade: gradeName, gradeBng: gradeNameBng, basic: Number(gradeBasic), houseRent: Number(gradeHouseRent), medical: Number(gradeMedical), transport: Number(gradeTransport), food: Number(gradeFood), other: Number(gradeOther), total, isActive: gradeIsActive } : g);
      } else {
        const sl = grades.length > 0 ? Math.max(...grades.map(g => g.sl)) + 1 : 1;
        nextList.push({ sl, grade: gradeName, gradeBng: gradeNameBng, basic: Number(gradeBasic), houseRent: Number(gradeHouseRent), medical: Number(gradeMedical), transport: Number(gradeTransport), food: Number(gradeFood), other: Number(gradeOther), total, isActive: gradeIsActive });
      }
      setGrades(nextList);
      localStorage.setItem("hris_grades", JSON.stringify(nextList));
    } else if (activeTab === "nature") {
      if (!natureName) { toast.error("Job Nature Name is required."); return; }
      let nextList = [...natures];
      if (editSl !== null) {
        nextList = natures.map(n => n.sl === editSl ? { ...n, name: natureName, isActive: natureIsActive } : n);
      } else {
        const sl = natures.length > 0 ? Math.max(...natures.map(n => n.sl)) + 1 : 1;
        nextList.push({ sl, name: natureName, isActive: natureIsActive });
      }
      setNatures(nextList);
      localStorage.setItem("hris_job_natures", JSON.stringify(nextList));
    } else if (activeTab === "country") {
      if (!countryNameEng) { toast.error("Country Name is required."); return; }
      let nextList = [...countries];
      if (editSl !== null) {
        nextList = countries.map(c => c.sl === editSl ? { ...c, code: countryCode, nameEng: countryNameEng, nameBng: countryNameBng, shortName: countryShort, nationality: countryNationality, isActive: countryIsActive } : c);
      } else {
        const sl = countries.length > 0 ? Math.max(...countries.map(c => c.sl)) + 1 : 1;
        nextList.push({ sl, code: countryCode, nameEng: countryNameEng, nameBng: countryNameBng, shortName: countryShort, nationality: countryNationality, isActive: countryIsActive });
      }
      setCountries(nextList);
      localStorage.setItem("hris_countries", JSON.stringify(nextList));
    } else if (activeTab === "religion") {
      if (!religionNameEng) { toast.error("Religion Name is required."); return; }
      let nextList = [...religions];
      if (editSl !== null) {
        nextList = religions.map(r => r.sl === editSl ? { ...r, code: religionCode, religionName: religionNameEng, religionNameBng: religionNameBng, isActive: religionIsActive } : r);
      } else {
        const sl = religions.length > 0 ? Math.max(...religions.map(r => r.sl)) + 1 : 1;
        nextList.push({ sl, code: religionCode, religionName: religionNameEng, religionNameBng: religionNameBng, isActive: religionIsActive });
      }
      setReligions(nextList);
      localStorage.setItem("hris_religions", JSON.stringify(nextList));
    } else if (activeTab === "place") {
      if (!placeNameEng) { toast.error("District Name is required."); return; }
      let nextList = [...places];
      if (editSl !== null) {
        nextList = places.map(p => p.sl === editSl ? { ...p, code: placeCode, nameEng: placeNameEng, nameBng: placeNameBng, shortName: placeShort, isActive: placeIsActive } : p);
      } else {
        const sl = places.length > 0 ? Math.max(...places.map(p => p.sl)) + 1 : 1;
        nextList.push({ sl, code: placeCode, nameEng: placeNameEng, nameBng: placeNameBng, shortName: placeShort, isActive: placeIsActive });
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

  // Tab Header Items
  const tabsList: { type: TabType; label: string; icon: any }[] = [
    { type: "designationGroup", label: "Designation Group", icon: Shield },
    { type: "jobTitle", label: "Job Title", icon: Award },
    { type: "empType", label: "Employee Type", icon: UserCheck },
    { type: "grade", label: "Grade", icon: Briefcase },
    { type: "nature", label: "Job Nature", icon: Briefcase },
    { type: "country", label: "Country", icon: Globe },
    { type: "religion", label: "Religion", icon: Heart },
    { type: "place", label: "Place in BD", icon: MapPin }
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-2 max-w-[1800px] mx-auto w-full">
          {/* Breadcrumb & Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Configure</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Employment Setup</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <UserCheck className="size-5.5 text-primary" />
                Job & Employee Configuration
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {activeTab === "designationGroup" && (
                <>
                  <button
                    onClick={() => {
                      setAvailableList(DEFAULT_DESIGNATIONS_POOL);
                      setOrderedList([]);
                      setAvailableSearchQuery("");
                      setIsFreshOrderModalOpen(true);
                    }}
                    className="h-10 px-5 rounded-lg border border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0f172a] hover:bg-[#cbd5e1] dark:hover:bg-slate-800 text-[#0f172a] dark:text-slate-200 font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer border-dashed"
                  >
                    <Briefcase className="size-4 text-primary" /> Fresh Designation Order
                  </button>
                  <button
                    onClick={() => {
                      setTempDesignations(designations);
                      setIsReorderModalOpen(true);
                    }}
                    className="h-10 px-5 rounded-lg border border-border/80 bg-card text-foreground font-black text-xs hover:bg-muted transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                  >
                    <SlidersHorizontal className="size-4" /> Reorder Designations
                  </button>
                </>
              )}
              <button
                onClick={() => openForm(null)}
                className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <Plus className="size-4 animate-bounce" /> Add New Record
              </button>
            </div>
          </div>

          {/* Horizontal Master Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
            {tabsList.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => {
                    setActiveTab(tab.type);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border/85 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <TabIcon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar & Actions toolbar */}
          <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 bg-muted/65 border border-border/40 rounded-lg px-3 py-1.5 w-full md:w-80">
              <Search className="size-4 text-muted-foreground/70" />
              <input
                type="text"
                placeholder={`Search ${tabsList.find(t => t.type === activeTab)?.label}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs w-full text-foreground placeholder:text-muted-foreground/60 font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => toast.success("Exporting to Excel...")}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <FileSpreadsheet className="size-4 text-emerald-600" /> EXCEL
              </button>
              <button
                onClick={() => window.print()}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <Printer className="size-4 text-blue-600" /> PRINT
              </button>
              <button
                onClick={() => toast.success("Generating PDF...")}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <FileText className="size-4 text-red-600" /> PDF
              </button>
            </div>
          </div>

          {/* Master Table Router */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">

              {activeTab === "designationGroup" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Designation Group</th>
                      <th className="px-5 py-4 min-w-[200px]">Designation Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {designations.filter(d => (d.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.nameBng || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "jobTitle" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "1600px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 w-[150px]">Designation Group</th>
                      <th className="px-5 py-4 w-[100px]">Code</th>
                      <th className="px-5 py-4 min-w-[150px]">Designation Title (Eng)</th>
                      <th className="px-5 py-4 min-w-[150px]">Job Title (Bng)</th>
                      <th className="px-5 py-4 w-[100px]">Emp Type</th>
                      <th className="px-5 py-4 w-[100px] text-center">Lunch Bill</th>
                      <th className="px-5 py-4 w-[100px] text-center">Attn. Bill</th>
                      <th className="px-5 py-4 w-[100px] text-center">Ifter Bill</th>
                      <th className="px-5 py-4 w-[100px] text-center">Schedule</th>
                      <th className="px-5 py-4 min-w-[200px]">Kajer Dhoron</th>
                      <th className="px-5 py-4 w-[100px]">Job Nature</th>
                      <th className="px-5 py-4 w-[100px]">Grade</th>
                      <th className="px-5 py-4 w-[100px]">OT Type</th>
                      <th className="px-5 py-4 w-[100px] text-center">Sort Order</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {jobTitles.filter(j => (j.titleEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">{item.designationGroup}</td>
                        <td className="px-5 py-3.5 font-normal font-mono text-slate-700 dark:text-slate-300">{item.code || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.titleEng}</td>
                        <td className="px-5 py-3.5 text-slate-800 dark:text-slate-200 font-normal">{item.titleBng || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400">{item.empType}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.lunchBill || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.attnBill || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.ifterBill || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.schedule || "—"}</td>
                        <td className="px-5 py-3.5 font-normal max-w-[200px] truncate">{item.kajerDhoron || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400">{item.jobNature}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400">{item.grade}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400">{item.otType || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.sortOrder}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "empType" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "900px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 w-[120px]">Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Employee Type (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Employee Type (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsOfficer</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsWorker</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {empTypes.filter(t => (t.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.nameEng}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.nameBng || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.isOfficer}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.isWorker}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "grade" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "1200px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[150px]">Grade (Eng)</th>
                      <th className="px-5 py-4 min-w-[150px]">Grade (Bng)</th>
                      <th className="px-5 py-4 w-[100px] text-right">Basic</th>
                      <th className="px-5 py-4 w-[100px] text-right">House Rent</th>
                      <th className="px-5 py-4 w-[100px] text-right">Medical</th>
                      <th className="px-5 py-4 w-[100px] text-right">Transport</th>
                      <th className="px-5 py-4 w-[100px] text-right">Food</th>
                      <th className="px-5 py-4 w-[100px] text-right">Other</th>
                      <th className="px-5 py-4 w-[120px] text-right">Total Salary</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {grades.filter(g => (g.grade || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.grade}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.gradeBng || "—"}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.basic}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.houseRent}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.medical}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.transport}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.food}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.other}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono text-primary font-bold">{item.total}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "nature" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[300px]">Job Nature</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {natures.filter(n => (n.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "country" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "900px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 w-[120px]">Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Country (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Country (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 min-w-[150px]">Nationality</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {countries.filter(c => (c.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.nameEng}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.nameBng || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.nationality || "—"}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "religion" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 w-[120px]">Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Religion Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Religion Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {religions.filter(r => (r.religionName || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.religionName}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.religionNameBng || "—"}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "place" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 w-[120px]">Code</th>
                      <th className="px-5 py-4 min-w-[200px]">District Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">District Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {places.filter(p => (p.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.nameEng}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.nameBng || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          </div>
        </div>

        {/* Master Modal Router */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">

              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                    <UserCheck className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight text-foreground">
                      {editSl ? "Update" : "Create"} {tabsList.find(t => t.type === activeTab)?.label}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">

                {activeTab === "designationGroup" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Designation Group Name *</label>
                      <input type="text" placeholder="Group Name" value={desigName} onChange={e => setDesigName(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Designation Name (Bng)</label>
                      <input type="text" placeholder="Designation Name (Bng)" value={desigNameBng} onChange={e => setDesigNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input type="text" placeholder="Short Name" value={desigShort} onChange={e => setDesigShort(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={desigIsActive} onChange={e => setDesigIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "jobTitle" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Designation Group *</label>
                      <select value={jobDesigGroup} onChange={e => setJobDesigGroup(e.target.value)} className={insetSelectClass}>
                        {designations.map(d => (
                          <option key={d.sl} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Code</label>
                      <input type="text" placeholder="Code" value={jobCode} onChange={e => setJobCode(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Designation Title (Eng) *</label>
                      <input type="text" placeholder="Title (Eng)" value={jobTitleEng} onChange={e => setJobTitleEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Designation Title (Bng)</label>
                      <input type="text" placeholder="Title (Bng)" value={jobTitleBng} onChange={e => setJobTitleBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type</label>
                      <select value={jobEmpType} onChange={e => setJobEmpType(e.target.value)} className={insetSelectClass}>
                        <option value="ALL">ALL</option>
                        {empTypes.map(t => (
                          <option key={t.sl} value={t.nameEng}>{t.nameEng}</option>
                        ))}
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Grade</label>
                      <select value={jobGrade} onChange={e => setJobGrade(e.target.value)} className={insetSelectClass}>
                        <option value="ALL">ALL</option>
                        {grades.map(g => (
                          <option key={g.sl} value={g.grade}>{g.grade}</option>
                        ))}
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>OT Type</label>
                      <input type="text" placeholder="OT Type" value={jobOtType} onChange={e => setJobOtType(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Lunch Bill</label>
                      <input type="text" placeholder="Lunch Bill" value={jobLunch} onChange={e => setJobLunch(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Attendance Bonus</label>
                      <input type="text" placeholder="Attendance Bonus" value={jobAttn} onChange={e => setJobAttn(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Ifter Bill</label>
                      <input type="text" placeholder="Ifter Bill" value={jobIfter} onChange={e => setJobIfter(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Schedule</label>
                      <input type="text" placeholder="Schedule" value={jobSchedule} onChange={e => setJobSchedule(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Kajer Dhoron (Bng)</label>
                      <input type="text" placeholder="Kajer Dhoron" value={jobKajer} onChange={e => setJobKajer(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Job Nature</label>
                      <select value={jobNature} onChange={e => setJobNature(e.target.value)} className={insetSelectClass}>
                        <option value="Select...">Select...</option>
                        <option value="Direct">Direct</option>
                        <option value="Indirect">Indirect</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Sort Order</label>
                      <input type="number" placeholder="Sort Order" value={jobSort} onChange={e => setJobSort(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={`${insetWrapperClass} sm:col-span-2`}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={jobIsActive} onChange={e => setJobIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "empType" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Type Code *</label>
                      <input type="text" placeholder="Code" value={typeCode} onChange={e => setTypeCode(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type (Eng) *</label>
                      <input type="text" placeholder="Name (Eng)" value={typeNameEng} onChange={e => setTypeNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type (Bng)</label>
                      <input type="text" placeholder="Name (Bng)" value={typeNameBng} onChange={e => setTypeNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input type="text" placeholder="Short Name" value={typeShort} onChange={e => setTypeShort(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsOfficer</label>
                      <select value={typeIsOfficer} onChange={e => setTypeIsOfficer(e.target.value as any)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsWorker</label>
                      <select value={typeIsWorker} onChange={e => setTypeIsWorker(e.target.value as any)} className={insetSelectClass}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={typeIsActive} onChange={e => setTypeIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "grade" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Grade (Eng) *</label>
                      <input type="text" placeholder="Grade (Eng)" value={gradeName} onChange={e => setGradeName(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Grade (Bng)</label>
                      <input type="text" placeholder="Grade (Bng)" value={gradeNameBng} onChange={e => setGradeNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Basic Salary *</label>
                      <input type="number" value={gradeBasic} onChange={e => setGradeBasic(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>House Rent *</label>
                      <input type="number" value={gradeHouseRent} onChange={e => setGradeHouseRent(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Medical Allowance *</label>
                      <input type="number" value={gradeMedical} onChange={e => setGradeMedical(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Transport Allowance *</label>
                      <input type="number" value={gradeTransport} onChange={e => setGradeTransport(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Food Allowance *</label>
                      <input type="number" value={gradeFood} onChange={e => setGradeFood(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Other Allowance</label>
                      <input type="number" value={gradeOther} onChange={e => setGradeOther(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={`${insetWrapperClass} sm:col-span-2`}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={gradeIsActive} onChange={e => setGradeIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "nature" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Job Nature Name *</label>
                      <input type="text" placeholder="Direct / Indirect" value={natureName} onChange={e => setNatureName(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={natureIsActive} onChange={e => setNatureIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "country" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Country Code *</label>
                      <input type="text" placeholder="e.g. BD" value={countryCode} onChange={e => setCountryCode(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Country Name (Eng) *</label>
                      <input type="text" placeholder="Country (Eng)" value={countryNameEng} onChange={e => setCountryNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Country Name (Bng)</label>
                      <input type="text" placeholder="Country (Bng)" value={countryNameBng} onChange={e => setCountryNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input type="text" placeholder="Short Name" value={countryShort} onChange={e => setCountryShort(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Nationality</label>
                      <input type="text" placeholder="Nationality" value={countryNationality} onChange={e => setCountryNationality(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={countryIsActive} onChange={e => setCountryIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "religion" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Religion Code *</label>
                      <input type="text" placeholder="Code" value={religionCode} onChange={e => setReligionCode(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Religion Name (Eng) *</label>
                      <input type="text" placeholder="Religion (Eng)" value={religionNameEng} onChange={e => setReligionNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Religion Name (Bng)</label>
                      <input type="text" placeholder="Religion (Bng)" value={religionNameBng} onChange={e => setReligionNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={religionIsActive} onChange={e => setReligionIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "place" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>District Code *</label>
                      <input type="text" placeholder="Code" value={placeCode} onChange={e => setPlaceCode(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>District Name (Eng) *</label>
                      <input type="text" placeholder="District (Eng)" value={placeNameEng} onChange={e => setPlaceNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>District Name (Bng)</label>
                      <input type="text" placeholder="District (Bng)" value={placeNameBng} onChange={e => setPlaceNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input type="text" placeholder="Short Name" value={placeShort} onChange={e => setPlaceShort(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={placeIsActive} onChange={e => setPlaceIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="border-t border-border/50 pt-5 flex items-center justify-between gap-3 bg-[#f8fafc] dark:bg-[#0f172a] -mx-6 -mb-6 p-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="h-10 px-6 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-xs transition-all uppercase tracking-wider shadow-sm hover:shadow"
                  >
                    CLOSE
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-8 rounded-lg text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 bg-[#2ecc71] hover:bg-[#27ae60]"
                  >
                    {editSl ? "UPDATE" : "CREATE"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Designation Group Reordering Modal */}
        {isReorderModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-350">
            <div className="bg-card border border-border/80 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">

              {/* Header */}
              <div className="px-6 py-5 border-b border-border/40 bg-gradient-to-r from-muted/50 via-card to-muted/30 dark:from-[#0f172a] dark:to-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                    <SlidersHorizontal className="size-5.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-foreground">
                      Reorder Designation Groups
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      Drag and drop to set hierarchical/display order of designation groups.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsReorderModalOpen(false)}
                  className="size-9 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-all text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/60 hover:scale-105"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-foreground">
                  <span>Designation Hierarchy</span>
                  <span className="text-[10px] text-primary normal-case">Top of list has higher precedence (e.g. MD at #1)</span>
                </div>

                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {tempDesignations.map((des, index) => (
                    <div
                      key={des.name}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", index.toString());
                        e.dataTransfer.effectAllowed = "move";
                        e.currentTarget.classList.add("opacity-30", "border-primary");
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove("opacity-30", "border-primary");
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
                        if (isNaN(fromIndex) || fromIndex === index) return;
                        const updated = [...tempDesignations];
                        const [movedItem] = updated.splice(fromIndex, 1);
                        updated.splice(index, 0, movedItem);
                        setTempDesignations(updated);
                      }}
                      className="flex items-center justify-between p-3.5 bg-card hover:bg-muted/20 border border-border/85 hover:border-primary/45 rounded-xl transition-all duration-200 shadow-sm cursor-grab active:cursor-grabbing group/item"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="text-muted-foreground/30 group-hover/item:text-primary transition-colors cursor-grab p-1 hover:bg-muted rounded">
                          <GripVertical className="size-4" />
                        </div>
                        <div className="size-6 rounded-lg bg-primary/10 border border-primary/15 text-primary flex items-center justify-center text-[10px] font-black font-mono">
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{des.name}</span>
                          {des.nameBng && (
                            <span className="text-[9px] text-muted-foreground mt-0.5">{des.nameBng}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase font-mono">
                          {des.shortName || "N/A"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${des.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-650 border-red-500/20"}`}>
                          {des.isActive}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border/40 pt-5 flex items-center justify-between gap-3 bg-gradient-to-r from-muted/30 to-muted/10 dark:from-[#0f172a] dark:to-[#121b2e] p-6">
                <button
                  type="button"
                  onClick={() => setIsReorderModalOpen(false)}
                  className="h-10.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all uppercase tracking-wider border border-border/50"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const finalized = tempDesignations.map((item, idx) => ({
                      ...item,
                      sl: idx + 1
                    }));
                    setDesignations(finalized);
                    localStorage.setItem("hris_designations", JSON.stringify(finalized));
                    toast.success("Designation hierarchy ordered successfully!");
                    setIsReorderModalOpen(false);
                  }}
                  className="h-10.5 px-9 rounded-xl text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-2 bg-[#2ecc71] hover:bg-[#27ae60] active:scale-98"
                >
                  SAVE ORDER
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Fresh Designation Order Modal */}
        {isFreshOrderModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
            <div className="bg-card border border-border/80 w-full max-w-5xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-300">

              {/* Header */}
              <div className="px-6 py-5 border-b border-border/40 bg-gradient-to-r from-muted/50 via-card to-muted/30 dark:from-[#0f172a] dark:to-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                    <Briefcase className="size-5.5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-foreground">
                      Fresh Designation Setup
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      Drag designations from Left (Available Pool) to Right (Ordered List) to set up your hierarchy.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFreshOrderModalOpen(false)}
                  className="size-9 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-all text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/60 hover:scale-105"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

                {/* Left Side: Available Pool */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const source = e.dataTransfer.getData("source");
                    if (source === "ordered") {
                      const fromIndex = parseInt(e.dataTransfer.getData("index"), 10);
                      if (isNaN(fromIndex)) return;
                      const item = orderedList[fromIndex];
                      setOrderedList(orderedList.filter((_, idx) => idx !== fromIndex));
                      if (!availableList.includes(item)) {
                        setAvailableList([...availableList, item]);
                      }
                      toast.success(`Moved back: ${item}`);
                    }
                  }}
                  className="md:col-span-5 flex flex-col bg-muted/20 dark:bg-slate-900/50 border border-border/80 rounded-lg p-5 space-y-4 shadow-xs"
                >
                  <div className="border-b border-border/40 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Available Pool</h3>
                      <p className="text-[9px] text-muted-foreground/80 mt-0.5 font-semibold">Drag from here, or double-click to add.</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-border/45 font-extrabold text-slate-500 font-mono">
                      {availableList.length} items
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div className="flex items-center gap-2 bg-card border border-border/80 rounded-xl px-3 py-2 shadow-xs mb-1">
                    <Search className="size-3.5 text-muted-foreground/60" />
                    <input
                      type="text"
                      placeholder="Search available designations..."
                      value={availableSearchQuery}
                      onChange={e => setAvailableSearchQuery(e.target.value)}
                      className="bg-transparent border-0 outline-none text-xs w-full text-foreground placeholder:text-muted-foreground/60 font-semibold p-0 focus:ring-0"
                    />
                    {availableSearchQuery && (
                      <button
                        onClick={() => setAvailableSearchQuery("")}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[400px] flex-1 pr-2 scrollbar-thin">
                    {availableList.filter(des => des.toLowerCase().includes(availableSearchQuery.toLowerCase())).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
                        <p className="text-xs text-muted-foreground font-bold italic">
                          {availableList.length === 0 ? "All designations selected!" : "No matches found"}
                        </p>
                      </div>
                    ) : (
                      availableList
                        .filter(des => des.toLowerCase().includes(availableSearchQuery.toLowerCase()))
                        .map((des) => (
                          <div
                            key={des}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("source", "available");
                              e.dataTransfer.setData("value", des);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDoubleClick={() => {
                              setAvailableList(availableList.filter(d => d !== des));
                              setOrderedList([...orderedList, des]);
                              toast.success(`Added: ${des}`);
                            }}
                            className="p-3 bg-card hover:bg-primary/5 hover:text-primary border border-border/80 hover:border-primary/45 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 transition duration-200 shadow-xs cursor-grab select-none hover:shadow hover:-translate-y-0.5 active:scale-98"
                          >
                            {des}
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Middle: Drag indicators / guide */}
                <div className="md:col-span-2 flex flex-col items-center justify-center gap-6 py-4 md:py-0 select-none">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-muted px-2.5 py-1 rounded-md border border-border/60">
                    Interactions
                  </span>
                  <div className="hidden md:flex flex-col gap-4 items-center">
                    <div className="flex flex-col items-center gap-1.5 bg-card border border-border/80 p-2.5 rounded-xl shadow-xs w-28 text-center">
                      <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary font-black text-xs">➔</div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Drag & Drop</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 bg-card border border-border/80 p-2.5 rounded-xl shadow-xs w-28 text-center">
                      <div className="flex items-center justify-center size-7 rounded-lg bg-emerald-500/10 text-emerald-600 font-black text-xs">⇄</div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Double Click</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Ordered List */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const source = e.dataTransfer.getData("source");
                    if (source === "available") {
                      const val = e.dataTransfer.getData("value");
                      if (val && !orderedList.includes(val)) {
                        setOrderedList([...orderedList, val]);
                        setAvailableList(availableList.filter(d => d !== val));
                        toast.success(`Added: ${val}`);
                      }
                    }
                  }}
                  className="md:col-span-5 flex flex-col bg-muted/20 dark:bg-slate-900/50 border border-border/80 rounded-lg p-5 space-y-4 shadow-xs"
                >
                  <div className="border-b border-border/40 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-primary">Hierarchy Order</h3>
                      <p className="text-[9px] text-muted-foreground/80 mt-0.5 font-semibold">Drag items to sort. Double-click to remove.</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 font-black text-primary font-mono">
                      {orderedList.length} selected
                    </span>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[400px] flex-1 pr-2 scrollbar-thin flex flex-col justify-start">
                    {orderedList.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-slate-400">
                        <Briefcase className="size-8 text-slate-350 mb-2.5 animate-pulse" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">List is empty</p>
                        <p className="text-[9px] text-muted-foreground/70 mt-1 max-w-[200px]">Drag designations here to start building the hierarchy.</p>
                      </div>
                    ) : (
                      orderedList.map((des, index) => (
                        <div
                          key={des}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("source", "ordered");
                            e.dataTransfer.setData("index", index.toString());
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const source = e.dataTransfer.getData("source");
                            if (source === "ordered") {
                              const fromIndex = parseInt(e.dataTransfer.getData("index"), 10);
                              if (isNaN(fromIndex) || fromIndex === index) return;
                              const updated = [...orderedList];
                              const [movedItem] = updated.splice(fromIndex, 1);
                              updated.splice(index, 0, movedItem);
                              setOrderedList(updated);
                            }
                          }}
                          onDoubleClick={() => {
                            setOrderedList(orderedList.filter(d => d !== des));
                            if (!availableList.includes(des)) {
                              setAvailableList([...availableList, des]);
                            }
                            toast.success(`Removed: ${des}`);
                          }}
                          className="flex items-center gap-3 p-3 bg-card border border-border/80 hover:border-primary/45 rounded-xl transition duration-150 cursor-grab hover:shadow-xs group/item"
                        >
                          <div className="text-muted-foreground/30 group-hover/item:text-primary transition-colors cursor-grab">
                            <GripVertical className="size-4" />
                          </div>
                          <div className="size-5.5 rounded-lg bg-primary/10 border border-primary/15 text-primary flex items-center justify-center text-[9px] font-black font-mono">
                            {index + 1}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{des}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="border-t border-border/40 pt-5 flex items-center justify-between gap-3 bg-gradient-to-r from-muted/30 to-muted/10 dark:from-[#0f172a] dark:to-[#121b2e] p-6">
                <button
                  type="button"
                  onClick={() => setIsFreshOrderModalOpen(false)}
                  className="h-10.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all uppercase tracking-wider border border-border/50"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (orderedList.length === 0) {
                      toast.error("Please add at least one designation to the ordered list");
                      return;
                    }
                    const finalized = orderedList.map((name, index) => {
                      const existing = designations.find(d => d.name === name);
                      return {
                        sl: index + 1,
                        name,
                        nameBng: existing?.nameBng || "",
                        shortName: existing?.shortName || name.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 4),
                        isActive: existing?.isActive || "Active"
                      };
                    });
                    setDesignations(finalized);
                    localStorage.setItem("hris_designations", JSON.stringify(finalized));
                    toast.success("Fresh designation hierarchy saved successfully!");
                    setIsFreshOrderModalOpen(false);
                  }}
                  className="h-10.5 px-9 rounded-xl text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-2 bg-[#2ecc71] hover:bg-[#27ae60] active:scale-98"
                >
                  SAVE HIERARCHY
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
