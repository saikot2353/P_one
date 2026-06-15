import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Search, Plus, Pencil, Trash2, X,
  FileSpreadsheet, Printer, FileText, Building2, MapPin,
  Layers, Users2, Grid, HelpCircle
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-structure")({
  head: () => ({
    meta: [
      { title: "Structure Setup — CRIPTON HRIS" },
      { name: "description", content: "Configure company structures, operating areas, departments, sections, units, lines, and mappings." },
    ],
  }),
  component: StructureSetupPage,
});

type TabType = "company" | "area" | "mapping" | "department" | "section" | "unit" | "line";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
interface Organization {
  sl: number;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  addressEng: string;
  addressBng: string;
  isActive: "Active" | "Inactive";
}

interface Area {
  sl: number;
  code: string;
  companyName: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  addressEng: string;
  addressBng: string;
  purchase: string;
  isActive: "Active" | "Inactive";
}

interface CompanyMapping {
  sl: number;
  name: string;
  main: string;
  relayDuty: string;
  checked?: boolean;
}

interface Department {
  sl: number;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  isActive: "Active" | "Inactive";
}

interface Section {
  sl: number;
  departmentName: string;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  isActive: "Active" | "Inactive";
}

interface Unit {
  sl: number;
  nameEng: string;
  nameBng: string;
  sortOrder: number;
  isActive: "Active" | "Inactive";
}

interface Line {
  sl: number;
  companyName: string;
  lineEng: string;
  lineBng: string;
  sortOrder: number;
  isActive: "Active" | "Inactive";
}

// ----------------------------------------------------
// Defaults
// ----------------------------------------------------
const DEFAULT_ORGS: Organization[] = [
  { sl: 1, code: "1000", nameEng: "Pakiza Knit Composite Ltd", nameBng: "পাকিজা নিট কম্পোজিট লিঃ", shortName: "PKCL", addressEng: "House# 97, Road# 11/A, Dhanmondi, Dhaka-1209", addressBng: "", isActive: "Active" },
  { sl: 2, code: "2000", nameEng: "Pakiza Technovation Limited", nameBng: "পাকিজা টেকনোভেশন লিমিটেড", shortName: "PTL", addressEng: "Dhanmondi, Dhaka", addressBng: "", isActive: "Active" }
];

const DEFAULT_AREAS: Area[] = [
  { sl: 1, code: "01", companyName: "Pakiza Knit Composite Ltd", nameEng: "PAL-Fabric Dyeing", nameBng: "", shortName: "PAL-FD", addressEng: "Narsingdi", addressBng: "", purchase: "", isActive: "Active" },
  { sl: 2, code: "02", companyName: "Pakiza Knit Composite Ltd", nameEng: "Head Office", nameBng: "", shortName: "HO", addressEng: "Dhanmondi, Dhaka", addressBng: "", purchase: "", isActive: "Active" }
];

const DEFAULT_MAPPINGS: CompanyMapping[] = [
  { sl: 1, name: "Embroidery", main: "RMG Operations", relayDuty: "", checked: false },
  { sl: 2, name: "Rotary Sample (AOP)", main: "All over Printing", relayDuty: "", checked: false },
  { sl: 3, name: "Product Management", main: "Product Management", relayDuty: "", checked: false },
  { sl: 4, name: "Cutting Quality", main: "Quality Assurance Department", relayDuty: "", checked: false },
  { sl: 5, name: "AOP Fabric Store", main: "Material Control Department", relayDuty: "", checked: false },
  { sl: 6, name: "Dyes & Chemical Store (FD)", main: "Material Control Department", relayDuty: "", checked: false },
  { sl: 7, name: "Embroidery Quality", main: "Embroidery", relayDuty: "", checked: false },
  { sl: 8, name: "Quality (RMG)", main: "Quality Assurance Department", relayDuty: "", checked: false },
  { sl: 9, name: "Administration", main: "Administration", relayDuty: "", checked: false },
  { sl: 10, name: "Rotary Engraving (AOP)", main: "All over Printing", relayDuty: "", checked: false },
  { sl: 11, name: "Stenter (AOP)", main: "All over Printing", relayDuty: "", checked: false }
];

const DEFAULT_DEPARTMENTS: Department[] = [
  { sl: 1, code: "HR", nameEng: "HR & Admin", nameBng: "এইচআর ও এডমিন", shortName: "HR", isActive: "Active" },
  { sl: 2, code: "IT", nameEng: "Information Technology", nameBng: "তথ্য প্রযুক্তি", shortName: "IT", isActive: "Active" }
];

const DEFAULT_SECTIONS: Section[] = [
  { sl: 1, departmentName: "HR & Admin", code: "ADM", nameEng: "Admin Support", nameBng: "", shortName: "AS", isActive: "Active" },
  { sl: 2, departmentName: "Information Technology", code: "DEV", nameEng: "Software Development", nameBng: "", shortName: "SD", isActive: "Active" }
];

const DEFAULT_UNITS: Unit[] = [
  { sl: 1, nameEng: "Accessories Store", nameBng: "অ্যাক্সেসরিজ স্টোর", sortOrder: 1, isActive: "Active" },
  { sl: 2, nameEng: "Admin", nameBng: "এডমিন", sortOrder: 2, isActive: "Active" }
];

const DEFAULT_LINES: Line[] = [
  { sl: 1, companyName: "Pakiza Knit Composite Ltd", lineEng: "Line 01", lineBng: "লাইন ০১", sortOrder: 1, isActive: "Active" },
  { sl: 2, companyName: "Pakiza Knit Composite Ltd", lineEng: "Line 02", lineBng: "লাইন ০২", sortOrder: 2, isActive: "Active" }
];

function StructureSetupPage() {
  const [activeTab, setActiveTab] = useState<TabType>("company");
  const [searchQuery, setSearchQuery] = useState("");

  // Lists State
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [mappings, setMappings] = useState<CompanyMapping[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabType;
      if (tabParam && ["company", "area", "mapping", "department", "section", "unit", "line"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    const safeParse = (key: string, defaultVal: any) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : defaultVal;
      } catch (e) {
        return defaultVal;
      }
    };

    // Organizations
    const orgsData = safeParse("hris_organizations", DEFAULT_ORGS);
    setOrgs(orgsData);
    localStorage.setItem("hris_organizations", JSON.stringify(orgsData));

    // Areas
    const areasData = safeParse("hris_areas", DEFAULT_AREAS);
    setAreas(areasData);
    localStorage.setItem("hris_areas", JSON.stringify(areasData));

    // Company Mappings
    const mappingsData = safeParse("hris_company_mappings", DEFAULT_MAPPINGS);
    setMappings(mappingsData);
    localStorage.setItem("hris_company_mappings", JSON.stringify(mappingsData));

    // Departments
    const departmentsData = safeParse("hris_departments", DEFAULT_DEPARTMENTS);
    setDepartments(departmentsData);
    localStorage.setItem("hris_departments", JSON.stringify(departmentsData));

    // Sections
    const sectionsData = safeParse("hris_sections", DEFAULT_SECTIONS);
    setSections(sectionsData);
    localStorage.setItem("hris_sections", JSON.stringify(sectionsData));

    // Units
    const unitsData = safeParse("hris_units", DEFAULT_UNITS);
    setUnits(unitsData);
    localStorage.setItem("hris_units", JSON.stringify(unitsData));

    // Lines
    const linesData = safeParse("hris_lines", DEFAULT_LINES);
    setLines(linesData);
    localStorage.setItem("hris_lines", JSON.stringify(linesData));
  }, []);

  // Shared Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSl, setEditSl] = useState<number | null>(null);

  // Form states - Company
  const [orgCode, setOrgCode] = useState("");
  const [orgNameEng, setOrgNameEng] = useState("");
  const [orgNameBng, setOrgNameBng] = useState("");
  const [orgShortName, setOrgShortName] = useState("");
  const [orgAddressEng, setOrgAddressEng] = useState("");
  const [orgAddressBng, setOrgAddressBng] = useState("");
  const [orgIsActive, setOrgIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Area
  const [areaCode, setAreaCode] = useState("");
  const [areaCompany, setAreaCompany] = useState("");
  const [areaNameEng, setAreaNameEng] = useState("");
  const [areaNameBng, setAreaNameBng] = useState("");
  const [areaShortName, setAreaShortName] = useState("");
  const [areaAddressEng, setAreaAddressEng] = useState("");
  const [areaAddressBng, setAreaAddressBng] = useState("");
  const [areaPurchase, setAreaPurchase] = useState("");
  const [areaIsActive, setAreaIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Mapping
  const [mapName, setMapName] = useState("");
  const [mapMain, setMapMain] = useState("");
  const [mapRelayDuty, setMapRelayDuty] = useState("");

  // Form states - Department
  const [depCode, setDepCode] = useState("");
  const [depNameEng, setDepNameEng] = useState("");
  const [depNameBng, setDepNameBng] = useState("");
  const [depShortName, setDepShortName] = useState("");
  const [depIsActive, setDepIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Section
  const [secDept, setSecDept] = useState("");
  const [secCode, setSecCode] = useState("");
  const [secNameEng, setSecNameEng] = useState("");
  const [secNameBng, setSecNameBng] = useState("");
  const [secShortName, setSecShortName] = useState("");
  const [secIsActive, setSecIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Unit
  const [unitNameEng, setUnitNameEng] = useState("");
  const [unitNameBng, setUnitNameBng] = useState("");
  const [unitSort, setUnitSort] = useState<number>(0);
  const [unitIsActive, setUnitIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Line
  const [lineCompany, setLineCompany] = useState("");
  const [lineEng, setLineEng] = useState("");
  const [lineBng, setLineBng] = useState("");
  const [lineSort, setLineSort] = useState<number>(0);
  const [lineIsActive, setLineIsActive] = useState<"Active" | "Inactive">("Active");

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "company") {
      const item = orgs.find(o => o.sl === sl);
      setOrgCode(item?.code || "");
      setOrgNameEng(item?.nameEng || "");
      setOrgNameBng(item?.nameBng || "");
      setOrgShortName(item?.shortName || "");
      setOrgAddressEng(item?.addressEng || "");
      setOrgAddressBng(item?.addressBng || "");
      setOrgIsActive(item?.isActive || "Active");
    } else if (activeTab === "area") {
      const item = areas.find(a => a.sl === sl);
      setAreaCode(item?.code || "");
      setAreaCompany(item?.companyName || orgs[0]?.nameEng || "");
      setAreaNameEng(item?.nameEng || "");
      setAreaNameBng(item?.nameBng || "");
      setAreaShortName(item?.shortName || "");
      setAreaAddressEng(item?.addressEng || "");
      setAreaAddressBng(item?.addressBng || "");
      setAreaPurchase(item?.purchase || "");
      setAreaIsActive(item?.isActive || "Active");
    } else if (activeTab === "mapping") {
      const item = mappings.find(m => m.sl === sl);
      setMapName(item?.name || "");
      setMapMain(item?.main || "");
      setMapRelayDuty(item?.relayDuty || "");
    } else if (activeTab === "department") {
      const item = departments.find(d => d.sl === sl);
      setDepCode(item?.code || "");
      setDepNameEng(item?.nameEng || "");
      setDepNameBng(item?.nameBng || "");
      setDepShortName(item?.shortName || "");
      setDepIsActive(item?.isActive || "Active");
    } else if (activeTab === "section") {
      const item = sections.find(s => s.sl === sl);
      setSecDept(item?.departmentName || departments[0]?.nameEng || "");
      setSecCode(item?.code || "");
      setSecNameEng(item?.nameEng || "");
      setSecNameBng(item?.nameBng || "");
      setSecShortName(item?.shortName || "");
      setSecIsActive(item?.isActive || "Active");
    } else if (activeTab === "unit") {
      const item = units.find(u => u.sl === sl);
      setUnitNameEng(item?.nameEng || "");
      setUnitNameBng(item?.nameBng || "");
      setUnitSort(item?.sortOrder || units.length + 1);
      setUnitIsActive(item?.isActive || "Active");
    } else if (activeTab === "line") {
      const item = lines.find(l => l.sl === sl);
      setLineCompany(item?.companyName || orgs[0]?.nameEng || "");
      setLineEng(item?.lineEng || "");
      setLineBng(item?.lineBng || "");
      setLineSort(item?.sortOrder || lines.length + 1);
      setLineIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "company") {
      const updated = orgs.filter(o => o.sl !== sl).map((o, idx) => ({ ...o, sl: idx + 1 }));
      setOrgs(updated);
      localStorage.setItem("hris_organizations", JSON.stringify(updated));
    } else if (activeTab === "area") {
      const updated = areas.filter(a => a.sl !== sl).map((a, idx) => ({ ...a, sl: idx + 1 }));
      setAreas(updated);
      localStorage.setItem("hris_areas", JSON.stringify(updated));
    } else if (activeTab === "mapping") {
      const updated = mappings.filter(m => m.sl !== sl).map((m, idx) => ({ ...m, sl: idx + 1 }));
      setMappings(updated);
      localStorage.setItem("hris_company_mappings", JSON.stringify(updated));
    } else if (activeTab === "department") {
      const updated = departments.filter(d => d.sl !== sl).map((d, idx) => ({ ...d, sl: idx + 1 }));
      setDepartments(updated);
      localStorage.setItem("hris_departments", JSON.stringify(updated));
    } else if (activeTab === "section") {
      const updated = sections.filter(s => s.sl !== sl).map((s, idx) => ({ ...s, sl: idx + 1 }));
      setSections(updated);
      localStorage.setItem("hris_sections", JSON.stringify(updated));
    } else if (activeTab === "unit") {
      const updated = units.filter(u => u.sl !== sl).map((u, idx) => ({ ...u, sl: idx + 1 }));
      setUnits(updated);
      localStorage.setItem("hris_units", JSON.stringify(updated));
    } else if (activeTab === "line") {
      const updated = lines.filter(l => l.sl !== sl).map((l, idx) => ({ ...l, sl: idx + 1 }));
      setLines(updated);
      localStorage.setItem("hris_lines", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "company") {
      if (!orgNameEng) { toast.error("English name is required."); return; }
      let nextList = [...orgs];
      if (editSl !== null) {
        nextList = orgs.map(o => o.sl === editSl ? { ...o, code: orgCode, nameEng: orgNameEng, nameBng: orgNameBng, shortName: orgShortName, addressEng: orgAddressEng, addressBng: orgAddressBng, isActive: orgIsActive } : o);
      } else {
        const sl = orgs.length > 0 ? Math.max(...orgs.map(o => o.sl)) + 1 : 1;
        nextList.push({ sl, code: orgCode, nameEng: orgNameEng, nameBng: orgNameBng, shortName: orgShortName, addressEng: orgAddressEng, addressBng: orgAddressBng, isActive: orgIsActive });
      }
      setOrgs(nextList);
      localStorage.setItem("hris_organizations", JSON.stringify(nextList));
    } else if (activeTab === "area") {
      if (!areaNameEng) { toast.error("Area Name is required."); return; }
      let nextList = [...areas];
      if (editSl !== null) {
        nextList = areas.map(a => a.sl === editSl ? { ...a, code: areaCode, companyName: areaCompany, nameEng: areaNameEng, nameBng: areaNameBng, shortName: areaShortName, addressEng: areaAddressEng, addressBng: areaAddressBng, purchase: areaPurchase, isActive: areaIsActive } : a);
      } else {
        const sl = areas.length > 0 ? Math.max(...areas.map(a => a.sl)) + 1 : 1;
        nextList.push({ sl, code: areaCode, companyName: areaCompany, nameEng: areaNameEng, nameBng: areaNameBng, shortName: areaShortName, addressEng: areaAddressEng, addressBng: areaAddressBng, purchase: areaPurchase, isActive: areaIsActive });
      }
      setAreas(nextList);
      localStorage.setItem("hris_areas", JSON.stringify(nextList));
    } else if (activeTab === "mapping") {
      if (!mapName || !mapMain) { toast.error("Name and Main group are required."); return; }
      let nextList = [...mappings];
      if (editSl !== null) {
        nextList = mappings.map(m => m.sl === editSl ? { ...m, name: mapName, main: mapMain, relayDuty: mapRelayDuty } : m);
      } else {
        const sl = mappings.length > 0 ? Math.max(...mappings.map(m => m.sl)) + 1 : 1;
        nextList.push({ sl, name: mapName, main: mapMain, relayDuty: mapRelayDuty, checked: false });
      }
      setMappings(nextList);
      localStorage.setItem("hris_company_mappings", JSON.stringify(nextList));
    } else if (activeTab === "department") {
      if (!depNameEng) { toast.error("Department name is required."); return; }
      let nextList = [...departments];
      if (editSl !== null) {
        nextList = departments.map(d => d.sl === editSl ? { ...d, code: depCode, nameEng: depNameEng, nameBng: depNameBng, shortName: depShortName, isActive: depIsActive } : d);
      } else {
        const sl = departments.length > 0 ? Math.max(...departments.map(d => d.sl)) + 1 : 1;
        nextList.push({ sl, code: depCode, nameEng: depNameEng, nameBng: depNameBng, shortName: depShortName, isActive: depIsActive });
      }
      setDepartments(nextList);
      localStorage.setItem("hris_departments", JSON.stringify(nextList));
    } else if (activeTab === "section") {
      if (!secNameEng) { toast.error("Section name is required."); return; }
      let nextList = [...sections];
      if (editSl !== null) {
        nextList = sections.map(s => s.sl === editSl ? { ...s, departmentName: secDept, code: secCode, nameEng: secNameEng, nameBng: secNameBng, shortName: secShortName, isActive: secIsActive } : s);
      } else {
        const sl = sections.length > 0 ? Math.max(...sections.map(s => s.sl)) + 1 : 1;
        nextList.push({ sl, departmentName: secDept, code: secCode, nameEng: secNameEng, nameBng: secNameBng, shortName: secShortName, isActive: secIsActive });
      }
      setSections(nextList);
      localStorage.setItem("hris_sections", JSON.stringify(nextList));
    } else if (activeTab === "unit") {
      if (!unitNameEng) { toast.error("Unit name is required."); return; }
      let nextList = [...units];
      if (editSl !== null) {
        nextList = units.map(u => u.sl === editSl ? { ...u, nameEng: unitNameEng, nameBng: unitNameBng, sortOrder: Number(unitSort), isActive: unitIsActive } : u);
      } else {
        const sl = units.length > 0 ? Math.max(...units.map(u => u.sl)) + 1 : 1;
        nextList.push({ sl, nameEng: unitNameEng, nameBng: unitNameBng, sortOrder: Number(unitSort), isActive: unitIsActive });
      }
      setUnits(nextList);
      localStorage.setItem("hris_units", JSON.stringify(nextList));
    } else if (activeTab === "line") {
      if (!lineEng) { toast.error("Line name is required."); return; }
      let nextList = [...lines];
      if (editSl !== null) {
        nextList = lines.map(l => l.sl === editSl ? { ...l, companyName: lineCompany, lineEng: lineEng, lineBng: lineBng, sortOrder: Number(lineSort), isActive: lineIsActive } : l);
      } else {
        const sl = lines.length > 0 ? Math.max(...lines.map(l => l.sl)) + 1 : 1;
        nextList.push({ sl, companyName: lineCompany, lineEng, lineBng, sortOrder: Number(lineSort), isActive: lineIsActive });
      }
      setLines(nextList);
      localStorage.setItem("hris_lines", JSON.stringify(nextList));
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
    { type: "company", label: "Company Profile", icon: Building2 },
    { type: "area", label: "Area Name", icon: MapPin },
    { type: "mapping", label: "Company Mapping", icon: Layers },
    { type: "department", label: "Department", icon: Users2 },
    { type: "section", label: "Section", icon: Grid },
    { type: "unit", label: "Unit", icon: Building2 },
    { type: "line", label: "Line", icon: Grid }
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
                <span className="text-primary font-black">Structure Setup</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Building2 className="size-5.5 text-primary" />
                Structure Configuration
              </h1>
            </div>
            <button
              onClick={() => openForm(null)}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Plus className="size-4 animate-bounce" /> Add New Record
            </button>
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

              {activeTab === "company" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "1000px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 w-[120px]">Company Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Company Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Company Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 min-w-[250px]">Address (Eng)</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {orgs.filter(o => (o.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.code}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.nameEng}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.nameBng || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                        <td className="px-5 py-3.5 font-normal truncate max-w-[250px]" title={item.addressEng}>{item.addressEng || "—"}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "area" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "1200px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 w-[100px]">Area Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Company</th>
                      <th className="px-5 py-4 min-w-[200px]">Area Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Area Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 min-w-[250px]">Address</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {areas.filter(a => (a.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal font-mono">{item.code}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.companyName}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.nameEng}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.nameBng || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                        <td className="px-5 py-3.5 font-normal truncate max-w-[250px]">{item.addressEng || "—"}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "mapping" && (
                <div className="p-6 bg-card">
                  {/* Custom Header for Mapping */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40">
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Pakiza Software Limited</h2>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Mapping For</label>
                        <select className="bg-transparent border-0 border-b border-emerald-500/80 outline-none pb-0.5 text-sm font-bold text-slate-800 dark:text-slate-100 pr-8 cursor-pointer">
                          <option value="section">Section</option>
                          <option value="department">Department</option>
                          <option value="unit">Unit</option>
                          <option value="line">Line</option>
                          <option value="area">Area</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground w-64 outline-none focus:border-primary"
                        />
                      </div>
                      <button
                        onClick={() => {
                          toast.success("Mappings submitted successfully!");
                          localStorage.setItem("hris_company_mappings", JSON.stringify(mappings));
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-sm shadow-sm transition-all"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </div>

                  {/* Redesigned Mapping Table */}
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                      <thead className="bg-[#cbd5e1] dark:bg-slate-800 text-slate-750 dark:text-slate-200 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="px-4 py-3 w-[40px] text-center">
                            <input
                              type="checkbox"
                              checked={mappings.length > 0 && mappings.every(m => m.checked)}
                              onChange={e => {
                                const checked = e.target.checked;
                                setMappings(mappings.map(m => ({ ...m, checked })));
                              }}
                              className="rounded border-slate-350 text-primary focus:ring-primary size-3.5"
                            />
                          </th>
                          <th className="px-4 py-3 w-[60px] text-center text-slate-500 font-bold">SL</th>
                          <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold">Name</th>
                          <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold">Main</th>
                          <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold w-[250px]">Relay Duty</th>
                          <th className="px-4 py-3 w-[80px] text-center text-slate-600 dark:text-slate-300 font-bold">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                        {mappings
                          .filter(m => (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (m.main || "").toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item, idx) => (
                            <tr key={item.sl} className={`${idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/40"} hover:bg-slate-100/50 transition-colors`}>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!item.checked}
                                  onChange={e => {
                                    const checked = e.target.checked;
                                    setMappings(mappings.map(m => m.sl === item.sl ? { ...m, checked } : m));
                                  }}
                                  className="rounded border-slate-350 text-primary focus:ring-primary size-3.5"
                                />
                              </td>
                              <td className="px-4 py-3 text-center text-slate-500 font-normal">{idx + 1}</td>
                              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{item.name}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-350">{item.main}</td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={item.relayDuty || ""}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setMappings(mappings.map(m => m.sl === item.sl ? { ...m, relayDuty: val } : m));
                                  }}
                                  className="h-8 w-full max-w-[220px] bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-700 rounded px-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-foreground"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.sl)}
                                  className="text-slate-400 hover:text-red-500 font-bold transition text-sm px-2"
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "department" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 w-[120px]">Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Department (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Department (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {departments.filter(d => (d.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
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

              {activeTab === "section" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "1000px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Department</th>
                      <th className="px-5 py-4 w-[100px]">Section Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Section (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Section (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {sections.filter(s => (s.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.departmentName}</td>
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

              {activeTab === "unit" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px] text-center">Sort Order</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {units.filter(u => (u.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.nameEng}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.nameBng || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.sortOrder || "—"}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "line" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "900px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Company</th>
                      <th className="px-5 py-4 min-w-[150px]">Line (Eng)</th>
                      <th className="px-5 py-4 min-w-[150px]">Line (Bng)</th>
                      <th className="px-5 py-4 w-[120px] text-center">Sort Order</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {lines.filter(l => (l.lineEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.companyName}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.lineEng}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.lineBng || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.sortOrder || "—"}</td>
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
                    <Building2 className="size-5" />
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

                {activeTab === "company" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company Code *</label>
                      <input type="text" placeholder="Company Code" value={orgCode} onChange={e => setOrgCode(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company Name (Eng) *</label>
                      <input type="text" placeholder="Company Name (Eng)" value={orgNameEng} onChange={e => setOrgNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company Name (Bng)</label>
                      <input type="text" placeholder="Company Name (Bng)" value={orgNameBng} onChange={e => setOrgNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input type="text" placeholder="Short Name" value={orgShortName} onChange={e => setOrgShortName(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Address (Eng)</label>
                      <input type="text" placeholder="Address (Eng)" value={orgAddressEng} onChange={e => setOrgAddressEng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Address (Bng)</label>
                      <input type="text" placeholder="Address (Bng)" value={orgAddressBng} onChange={e => setOrgAddressBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={orgIsActive} onChange={e => setOrgIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "area" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Area Code *</label>
                      <input type="text" placeholder="Area Code" value={areaCode} onChange={e => setAreaCode(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company *</label>
                      <select value={areaCompany} onChange={e => setAreaCompany(e.target.value)} className={insetSelectClass}>
                        {orgs.map(o => (
                          <option key={o.sl} value={o.nameEng}>{o.nameEng}</option>
                        ))}
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Area Name (Eng) *</label>
                      <input type="text" placeholder="Area Name (Eng)" value={areaNameEng} onChange={e => setAreaNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Area Name (Bng)</label>
                      <input type="text" placeholder="Area Name (Bng)" value={areaNameBng} onChange={e => setAreaNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input type="text" placeholder="Short Name" value={areaShortName} onChange={e => setAreaShortName(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Address (Eng)</label>
                      <input type="text" placeholder="Address (Eng)" value={areaAddressEng} onChange={e => setAreaAddressEng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Address (Bng)</label>
                      <input type="text" placeholder="Address (Bng)" value={areaAddressBng} onChange={e => setAreaAddressBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={areaIsActive} onChange={e => setAreaIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "mapping" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Name *</label>
                      <input type="text" placeholder="e.g. Embroidery" value={mapName} onChange={e => setMapName(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Main *</label>
                      <input type="text" placeholder="e.g. RMG Operations" value={mapMain} onChange={e => setMapMain(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Relay Duty</label>
                      <input type="text" placeholder="Relay Duty value" value={mapRelayDuty} onChange={e => setMapRelayDuty(e.target.value)} className={insetInputClass} />
                    </div>
                  </div>
                )}

                {activeTab === "department" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department Code *</label>
                      <input type="text" placeholder="Code" value={depCode} onChange={e => setDepCode(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department Name (Eng) *</label>
                      <input type="text" placeholder="Name (Eng)" value={depNameEng} onChange={e => setDepNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department Name (Bng)</label>
                      <input type="text" placeholder="Name (Bng)" value={depNameBng} onChange={e => setDepNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input type="text" placeholder="Short Name" value={depShortName} onChange={e => setDepShortName(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={depIsActive} onChange={e => setDepIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "section" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department *</label>
                      <select value={secDept} onChange={e => setSecDept(e.target.value)} className={insetSelectClass}>
                        {departments.map(d => (
                          <option key={d.sl} value={d.nameEng}>{d.nameEng}</option>
                        ))}
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Section Code *</label>
                      <input type="text" placeholder="Code" value={secCode} onChange={e => setSecCode(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Section Name (Eng) *</label>
                      <input type="text" placeholder="Name (Eng)" value={secNameEng} onChange={e => setSecNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Section Name (Bng)</label>
                      <input type="text" placeholder="Name (Bng)" value={secNameBng} onChange={e => setSecNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input type="text" placeholder="Short Name" value={secShortName} onChange={e => setSecShortName(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={secIsActive} onChange={e => setSecIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "unit" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Unit Name (Eng) *</label>
                      <input type="text" placeholder="Name (Eng)" value={unitNameEng} onChange={e => setUnitNameEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Unit Name (Bng)</label>
                      <input type="text" placeholder="Name (Bng)" value={unitNameBng} onChange={e => setUnitNameBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Sort Order</label>
                      <input type="number" placeholder="Sort Order" value={unitSort} onChange={e => setUnitSort(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={unitIsActive} onChange={e => setUnitIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "line" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company *</label>
                      <select value={lineCompany} onChange={e => setLineCompany(e.target.value)} className={insetSelectClass}>
                        {orgs.map(o => (
                          <option key={o.sl} value={o.nameEng}>{o.nameEng}</option>
                        ))}
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Line Name (Eng) *</label>
                      <input type="text" placeholder="Line (Eng)" value={lineEng} onChange={e => setLineEng(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Line Name (Bng)</label>
                      <input type="text" placeholder="Line (Bng)" value={lineBng} onChange={e => setLineBng(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Sort Order</label>
                      <input type="number" placeholder="Sort Order" value={lineSort} onChange={e => setLineSort(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={lineIsActive} onChange={e => setLineIsActive(e.target.value as any)} className={insetSelectClass}>
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
                    className={`h-10 px-8 rounded-lg text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 bg-[#2ecc71] hover:bg-[#27ae60]`}
                  >
                    {editSl ? "UPDATE" : "CREATE"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
