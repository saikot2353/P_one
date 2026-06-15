import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as ChevronRight, B as Building2, i as Plus, at as MapPin, am as Layers, aX as UsersRound, G as Grid3x3, S as Search, ax as FileSpreadsheet, P as Printer, d as FileText, ar as Pencil, ap as Trash2, X } from "../_libs/lucide-react.mjs";
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
const DEFAULT_ORGS = [{
  sl: 1,
  code: "1000",
  nameEng: "Pakiza Knit Composite Ltd",
  nameBng: "পাকিজা নিট কম্পোজিট লিঃ",
  shortName: "PKCL",
  addressEng: "House# 97, Road# 11/A, Dhanmondi, Dhaka-1209",
  addressBng: "",
  isActive: "Active"
}, {
  sl: 2,
  code: "2000",
  nameEng: "Pakiza Technovation Limited",
  nameBng: "পাকিজা টেকনোভেশন লিমিটেড",
  shortName: "PTL",
  addressEng: "Dhanmondi, Dhaka",
  addressBng: "",
  isActive: "Active"
}];
const DEFAULT_AREAS = [{
  sl: 1,
  code: "01",
  companyName: "Pakiza Knit Composite Ltd",
  nameEng: "PAL-Fabric Dyeing",
  nameBng: "",
  shortName: "PAL-FD",
  addressEng: "Narsingdi",
  addressBng: "",
  purchase: "",
  isActive: "Active"
}, {
  sl: 2,
  code: "02",
  companyName: "Pakiza Knit Composite Ltd",
  nameEng: "Head Office",
  nameBng: "",
  shortName: "HO",
  addressEng: "Dhanmondi, Dhaka",
  addressBng: "",
  purchase: "",
  isActive: "Active"
}];
const DEFAULT_MAPPINGS = [{
  sl: 1,
  name: "Embroidery",
  main: "RMG Operations",
  relayDuty: "",
  checked: false
}, {
  sl: 2,
  name: "Rotary Sample (AOP)",
  main: "All over Printing",
  relayDuty: "",
  checked: false
}, {
  sl: 3,
  name: "Product Management",
  main: "Product Management",
  relayDuty: "",
  checked: false
}, {
  sl: 4,
  name: "Cutting Quality",
  main: "Quality Assurance Department",
  relayDuty: "",
  checked: false
}, {
  sl: 5,
  name: "AOP Fabric Store",
  main: "Material Control Department",
  relayDuty: "",
  checked: false
}, {
  sl: 6,
  name: "Dyes & Chemical Store (FD)",
  main: "Material Control Department",
  relayDuty: "",
  checked: false
}, {
  sl: 7,
  name: "Embroidery Quality",
  main: "Embroidery",
  relayDuty: "",
  checked: false
}, {
  sl: 8,
  name: "Quality (RMG)",
  main: "Quality Assurance Department",
  relayDuty: "",
  checked: false
}, {
  sl: 9,
  name: "Administration",
  main: "Administration",
  relayDuty: "",
  checked: false
}, {
  sl: 10,
  name: "Rotary Engraving (AOP)",
  main: "All over Printing",
  relayDuty: "",
  checked: false
}, {
  sl: 11,
  name: "Stenter (AOP)",
  main: "All over Printing",
  relayDuty: "",
  checked: false
}];
const DEFAULT_DEPARTMENTS = [{
  sl: 1,
  code: "HR",
  nameEng: "HR & Admin",
  nameBng: "এইচআর ও এডমিন",
  shortName: "HR",
  isActive: "Active"
}, {
  sl: 2,
  code: "IT",
  nameEng: "Information Technology",
  nameBng: "তথ্য প্রযুক্তি",
  shortName: "IT",
  isActive: "Active"
}];
const DEFAULT_SECTIONS = [{
  sl: 1,
  departmentName: "HR & Admin",
  code: "ADM",
  nameEng: "Admin Support",
  nameBng: "",
  shortName: "AS",
  isActive: "Active"
}, {
  sl: 2,
  departmentName: "Information Technology",
  code: "DEV",
  nameEng: "Software Development",
  nameBng: "",
  shortName: "SD",
  isActive: "Active"
}];
const DEFAULT_UNITS = [{
  sl: 1,
  nameEng: "Accessories Store",
  nameBng: "অ্যাক্সেসরিজ স্টোর",
  sortOrder: 1,
  isActive: "Active"
}, {
  sl: 2,
  nameEng: "Admin",
  nameBng: "এডমিন",
  sortOrder: 2,
  isActive: "Active"
}];
const DEFAULT_LINES = [{
  sl: 1,
  companyName: "Pakiza Knit Composite Ltd",
  lineEng: "Line 01",
  lineBng: "লাইন ০১",
  sortOrder: 1,
  isActive: "Active"
}, {
  sl: 2,
  companyName: "Pakiza Knit Composite Ltd",
  lineEng: "Line 02",
  lineBng: "লাইন ০২",
  sortOrder: 2,
  isActive: "Active"
}];
function StructureSetupPage() {
  const [activeTab, setActiveTab] = reactExports.useState("company");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [orgs, setOrgs] = reactExports.useState([]);
  const [areas, setAreas] = reactExports.useState([]);
  const [mappings, setMappings] = reactExports.useState([]);
  const [departments, setDepartments] = reactExports.useState([]);
  const [sections, setSections] = reactExports.useState([]);
  const [units, setUnits] = reactExports.useState([]);
  const [lines, setLines] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["company", "area", "mapping", "department", "section", "unit", "line"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
    const safeParse = (key, defaultVal) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : defaultVal;
      } catch (e) {
        return defaultVal;
      }
    };
    const orgsData = safeParse("hris_organizations", DEFAULT_ORGS);
    setOrgs(orgsData);
    localStorage.setItem("hris_organizations", JSON.stringify(orgsData));
    const areasData = safeParse("hris_areas", DEFAULT_AREAS);
    setAreas(areasData);
    localStorage.setItem("hris_areas", JSON.stringify(areasData));
    const mappingsData = safeParse("hris_company_mappings", DEFAULT_MAPPINGS);
    setMappings(mappingsData);
    localStorage.setItem("hris_company_mappings", JSON.stringify(mappingsData));
    const departmentsData = safeParse("hris_departments", DEFAULT_DEPARTMENTS);
    setDepartments(departmentsData);
    localStorage.setItem("hris_departments", JSON.stringify(departmentsData));
    const sectionsData = safeParse("hris_sections", DEFAULT_SECTIONS);
    setSections(sectionsData);
    localStorage.setItem("hris_sections", JSON.stringify(sectionsData));
    const unitsData = safeParse("hris_units", DEFAULT_UNITS);
    setUnits(unitsData);
    localStorage.setItem("hris_units", JSON.stringify(unitsData));
    const linesData = safeParse("hris_lines", DEFAULT_LINES);
    setLines(linesData);
    localStorage.setItem("hris_lines", JSON.stringify(linesData));
  }, []);
  const [isFormOpen, setIsFormOpen] = reactExports.useState(false);
  const [editSl, setEditSl] = reactExports.useState(null);
  const [orgCode, setOrgCode] = reactExports.useState("");
  const [orgNameEng, setOrgNameEng] = reactExports.useState("");
  const [orgNameBng, setOrgNameBng] = reactExports.useState("");
  const [orgShortName, setOrgShortName] = reactExports.useState("");
  const [orgAddressEng, setOrgAddressEng] = reactExports.useState("");
  const [orgAddressBng, setOrgAddressBng] = reactExports.useState("");
  const [orgIsActive, setOrgIsActive] = reactExports.useState("Active");
  const [areaCode, setAreaCode] = reactExports.useState("");
  const [areaCompany, setAreaCompany] = reactExports.useState("");
  const [areaNameEng, setAreaNameEng] = reactExports.useState("");
  const [areaNameBng, setAreaNameBng] = reactExports.useState("");
  const [areaShortName, setAreaShortName] = reactExports.useState("");
  const [areaAddressEng, setAreaAddressEng] = reactExports.useState("");
  const [areaAddressBng, setAreaAddressBng] = reactExports.useState("");
  const [areaPurchase, setAreaPurchase] = reactExports.useState("");
  const [areaIsActive, setAreaIsActive] = reactExports.useState("Active");
  const [mapName, setMapName] = reactExports.useState("");
  const [mapMain, setMapMain] = reactExports.useState("");
  const [mapRelayDuty, setMapRelayDuty] = reactExports.useState("");
  const [depCode, setDepCode] = reactExports.useState("");
  const [depNameEng, setDepNameEng] = reactExports.useState("");
  const [depNameBng, setDepNameBng] = reactExports.useState("");
  const [depShortName, setDepShortName] = reactExports.useState("");
  const [depIsActive, setDepIsActive] = reactExports.useState("Active");
  const [secDept, setSecDept] = reactExports.useState("");
  const [secCode, setSecCode] = reactExports.useState("");
  const [secNameEng, setSecNameEng] = reactExports.useState("");
  const [secNameBng, setSecNameBng] = reactExports.useState("");
  const [secShortName, setSecShortName] = reactExports.useState("");
  const [secIsActive, setSecIsActive] = reactExports.useState("Active");
  const [unitNameEng, setUnitNameEng] = reactExports.useState("");
  const [unitNameBng, setUnitNameBng] = reactExports.useState("");
  const [unitSort, setUnitSort] = reactExports.useState(0);
  const [unitIsActive, setUnitIsActive] = reactExports.useState("Active");
  const [lineCompany, setLineCompany] = reactExports.useState("");
  const [lineEng, setLineEng] = reactExports.useState("");
  const [lineBng, setLineBng] = reactExports.useState("");
  const [lineSort, setLineSort] = reactExports.useState(0);
  const [lineIsActive, setLineIsActive] = reactExports.useState("Active");
  const openForm = (sl) => {
    setEditSl(sl);
    if (activeTab === "company") {
      const item = orgs.find((o) => o.sl === sl);
      setOrgCode(item?.code || "");
      setOrgNameEng(item?.nameEng || "");
      setOrgNameBng(item?.nameBng || "");
      setOrgShortName(item?.shortName || "");
      setOrgAddressEng(item?.addressEng || "");
      setOrgAddressBng(item?.addressBng || "");
      setOrgIsActive(item?.isActive || "Active");
    } else if (activeTab === "area") {
      const item = areas.find((a) => a.sl === sl);
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
      const item = mappings.find((m) => m.sl === sl);
      setMapName(item?.name || "");
      setMapMain(item?.main || "");
      setMapRelayDuty(item?.relayDuty || "");
    } else if (activeTab === "department") {
      const item = departments.find((d) => d.sl === sl);
      setDepCode(item?.code || "");
      setDepNameEng(item?.nameEng || "");
      setDepNameBng(item?.nameBng || "");
      setDepShortName(item?.shortName || "");
      setDepIsActive(item?.isActive || "Active");
    } else if (activeTab === "section") {
      const item = sections.find((s) => s.sl === sl);
      setSecDept(item?.departmentName || departments[0]?.nameEng || "");
      setSecCode(item?.code || "");
      setSecNameEng(item?.nameEng || "");
      setSecNameBng(item?.nameBng || "");
      setSecShortName(item?.shortName || "");
      setSecIsActive(item?.isActive || "Active");
    } else if (activeTab === "unit") {
      const item = units.find((u) => u.sl === sl);
      setUnitNameEng(item?.nameEng || "");
      setUnitNameBng(item?.nameBng || "");
      setUnitSort(item?.sortOrder || units.length + 1);
      setUnitIsActive(item?.isActive || "Active");
    } else if (activeTab === "line") {
      const item = lines.find((l) => l.sl === sl);
      setLineCompany(item?.companyName || orgs[0]?.nameEng || "");
      setLineEng(item?.lineEng || "");
      setLineBng(item?.lineBng || "");
      setLineSort(item?.sortOrder || lines.length + 1);
      setLineIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };
  const handleDelete = (sl) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    if (activeTab === "company") {
      const updated = orgs.filter((o) => o.sl !== sl).map((o, idx) => ({
        ...o,
        sl: idx + 1
      }));
      setOrgs(updated);
      localStorage.setItem("hris_organizations", JSON.stringify(updated));
    } else if (activeTab === "area") {
      const updated = areas.filter((a) => a.sl !== sl).map((a, idx) => ({
        ...a,
        sl: idx + 1
      }));
      setAreas(updated);
      localStorage.setItem("hris_areas", JSON.stringify(updated));
    } else if (activeTab === "mapping") {
      const updated = mappings.filter((m) => m.sl !== sl).map((m, idx) => ({
        ...m,
        sl: idx + 1
      }));
      setMappings(updated);
      localStorage.setItem("hris_company_mappings", JSON.stringify(updated));
    } else if (activeTab === "department") {
      const updated = departments.filter((d) => d.sl !== sl).map((d, idx) => ({
        ...d,
        sl: idx + 1
      }));
      setDepartments(updated);
      localStorage.setItem("hris_departments", JSON.stringify(updated));
    } else if (activeTab === "section") {
      const updated = sections.filter((s) => s.sl !== sl).map((s, idx) => ({
        ...s,
        sl: idx + 1
      }));
      setSections(updated);
      localStorage.setItem("hris_sections", JSON.stringify(updated));
    } else if (activeTab === "unit") {
      const updated = units.filter((u) => u.sl !== sl).map((u, idx) => ({
        ...u,
        sl: idx + 1
      }));
      setUnits(updated);
      localStorage.setItem("hris_units", JSON.stringify(updated));
    } else if (activeTab === "line") {
      const updated = lines.filter((l) => l.sl !== sl).map((l, idx) => ({
        ...l,
        sl: idx + 1
      }));
      setLines(updated);
      localStorage.setItem("hris_lines", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "company") {
      if (!orgNameEng) {
        toast.error("English name is required.");
        return;
      }
      let nextList = [...orgs];
      if (editSl !== null) {
        nextList = orgs.map((o) => o.sl === editSl ? {
          ...o,
          code: orgCode,
          nameEng: orgNameEng,
          nameBng: orgNameBng,
          shortName: orgShortName,
          addressEng: orgAddressEng,
          addressBng: orgAddressBng,
          isActive: orgIsActive
        } : o);
      } else {
        const sl = orgs.length > 0 ? Math.max(...orgs.map((o) => o.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: orgCode,
          nameEng: orgNameEng,
          nameBng: orgNameBng,
          shortName: orgShortName,
          addressEng: orgAddressEng,
          addressBng: orgAddressBng,
          isActive: orgIsActive
        });
      }
      setOrgs(nextList);
      localStorage.setItem("hris_organizations", JSON.stringify(nextList));
    } else if (activeTab === "area") {
      if (!areaNameEng) {
        toast.error("Area Name is required.");
        return;
      }
      let nextList = [...areas];
      if (editSl !== null) {
        nextList = areas.map((a) => a.sl === editSl ? {
          ...a,
          code: areaCode,
          companyName: areaCompany,
          nameEng: areaNameEng,
          nameBng: areaNameBng,
          shortName: areaShortName,
          addressEng: areaAddressEng,
          addressBng: areaAddressBng,
          purchase: areaPurchase,
          isActive: areaIsActive
        } : a);
      } else {
        const sl = areas.length > 0 ? Math.max(...areas.map((a) => a.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: areaCode,
          companyName: areaCompany,
          nameEng: areaNameEng,
          nameBng: areaNameBng,
          shortName: areaShortName,
          addressEng: areaAddressEng,
          addressBng: areaAddressBng,
          purchase: areaPurchase,
          isActive: areaIsActive
        });
      }
      setAreas(nextList);
      localStorage.setItem("hris_areas", JSON.stringify(nextList));
    } else if (activeTab === "mapping") {
      if (!mapName || !mapMain) {
        toast.error("Name and Main group are required.");
        return;
      }
      let nextList = [...mappings];
      if (editSl !== null) {
        nextList = mappings.map((m) => m.sl === editSl ? {
          ...m,
          name: mapName,
          main: mapMain,
          relayDuty: mapRelayDuty
        } : m);
      } else {
        const sl = mappings.length > 0 ? Math.max(...mappings.map((m) => m.sl)) + 1 : 1;
        nextList.push({
          sl,
          name: mapName,
          main: mapMain,
          relayDuty: mapRelayDuty,
          checked: false
        });
      }
      setMappings(nextList);
      localStorage.setItem("hris_company_mappings", JSON.stringify(nextList));
    } else if (activeTab === "department") {
      if (!depNameEng) {
        toast.error("Department name is required.");
        return;
      }
      let nextList = [...departments];
      if (editSl !== null) {
        nextList = departments.map((d) => d.sl === editSl ? {
          ...d,
          code: depCode,
          nameEng: depNameEng,
          nameBng: depNameBng,
          shortName: depShortName,
          isActive: depIsActive
        } : d);
      } else {
        const sl = departments.length > 0 ? Math.max(...departments.map((d) => d.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: depCode,
          nameEng: depNameEng,
          nameBng: depNameBng,
          shortName: depShortName,
          isActive: depIsActive
        });
      }
      setDepartments(nextList);
      localStorage.setItem("hris_departments", JSON.stringify(nextList));
    } else if (activeTab === "section") {
      if (!secNameEng) {
        toast.error("Section name is required.");
        return;
      }
      let nextList = [...sections];
      if (editSl !== null) {
        nextList = sections.map((s) => s.sl === editSl ? {
          ...s,
          departmentName: secDept,
          code: secCode,
          nameEng: secNameEng,
          nameBng: secNameBng,
          shortName: secShortName,
          isActive: secIsActive
        } : s);
      } else {
        const sl = sections.length > 0 ? Math.max(...sections.map((s) => s.sl)) + 1 : 1;
        nextList.push({
          sl,
          departmentName: secDept,
          code: secCode,
          nameEng: secNameEng,
          nameBng: secNameBng,
          shortName: secShortName,
          isActive: secIsActive
        });
      }
      setSections(nextList);
      localStorage.setItem("hris_sections", JSON.stringify(nextList));
    } else if (activeTab === "unit") {
      if (!unitNameEng) {
        toast.error("Unit name is required.");
        return;
      }
      let nextList = [...units];
      if (editSl !== null) {
        nextList = units.map((u) => u.sl === editSl ? {
          ...u,
          nameEng: unitNameEng,
          nameBng: unitNameBng,
          sortOrder: Number(unitSort),
          isActive: unitIsActive
        } : u);
      } else {
        const sl = units.length > 0 ? Math.max(...units.map((u) => u.sl)) + 1 : 1;
        nextList.push({
          sl,
          nameEng: unitNameEng,
          nameBng: unitNameBng,
          sortOrder: Number(unitSort),
          isActive: unitIsActive
        });
      }
      setUnits(nextList);
      localStorage.setItem("hris_units", JSON.stringify(nextList));
    } else if (activeTab === "line") {
      if (!lineEng) {
        toast.error("Line name is required.");
        return;
      }
      let nextList = [...lines];
      if (editSl !== null) {
        nextList = lines.map((l) => l.sl === editSl ? {
          ...l,
          companyName: lineCompany,
          lineEng,
          lineBng,
          sortOrder: Number(lineSort),
          isActive: lineIsActive
        } : l);
      } else {
        const sl = lines.length > 0 ? Math.max(...lines.map((l) => l.sl)) + 1 : 1;
        nextList.push({
          sl,
          companyName: lineCompany,
          lineEng,
          lineBng,
          sortOrder: Number(lineSort),
          isActive: lineIsActive
        });
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
  const tabsList = [{
    type: "company",
    label: "Company Profile",
    icon: Building2
  }, {
    type: "area",
    label: "Area Name",
    icon: MapPin
  }, {
    type: "mapping",
    label: "Company Mapping",
    icon: Layers
  }, {
    type: "department",
    label: "Department",
    icon: UsersRound
  }, {
    type: "section",
    label: "Section",
    icon: Grid3x3
  }, {
    type: "unit",
    label: "Unit",
    icon: Building2
  }, {
    type: "line",
    label: "Line",
    icon: Grid3x3
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Structure Setup" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-5.5 text-primary" }),
              "Structure Configuration"
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
          activeTab === "company" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "1000px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Company Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Company Name (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Company Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[250px]", children: "Address (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: orgs.filter((o) => (o.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.nameEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.shortName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal truncate max-w-[250px]", title: item.addressEng, children: item.addressEng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "area" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "1200px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Area Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Area Name (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Area Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[250px]", children: "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: areas.filter((a) => (a.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.companyName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.nameEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.shortName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal truncate max-w-[250px]", children: item.addressEng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "mapping" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight", children: "Pakiza Software Limited" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-emerald-500 uppercase tracking-wider block", children: "Mapping For" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "bg-transparent border-0 border-b border-emerald-500/80 outline-none pb-0.5 text-sm font-bold text-slate-800 dark:text-slate-100 pr-8 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "section", children: "Section" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "department", children: "Department" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "unit", children: "Unit" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "line", children: "Line" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "area", children: "Area" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "bg-transparent border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground w-64 outline-none focus:border-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                  toast.success("Mappings submitted successfully!");
                  localStorage.setItem("hris_company_mappings", JSON.stringify(mappings));
                }, className: "bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-sm shadow-sm transition-all", children: "SUBMIT" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-[#cbd5e1] dark:bg-slate-800 text-slate-750 dark:text-slate-200 uppercase font-bold text-[10px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[40px] text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: mappings.length > 0 && mappings.every((m) => m.checked), onChange: (e) => {
                  const checked = e.target.checked;
                  setMappings(mappings.map((m) => ({
                    ...m,
                    checked
                  })));
                }, className: "rounded border-slate-350 text-primary focus:ring-primary size-3.5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[60px] text-center text-slate-500 font-bold", children: "SL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-slate-600 dark:text-slate-300 font-bold", children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-slate-600 dark:text-slate-300 font-bold", children: "Main" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-slate-600 dark:text-slate-300 font-bold w-[250px]", children: "Relay Duty" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-[80px] text-center text-slate-600 dark:text-slate-300 font-bold", children: "Del" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200", children: mappings.filter((m) => (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (m.main || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `${idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/40"} hover:bg-slate-100/50 transition-colors`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!item.checked, onChange: (e) => {
                  const checked = e.target.checked;
                  setMappings(mappings.map((m) => m.sl === item.sl ? {
                    ...m,
                    checked
                  } : m));
                }, className: "rounded border-slate-350 text-primary focus:ring-primary size-3.5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-slate-500 font-normal", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-slate-800 dark:text-slate-100", children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-600 dark:text-slate-350", children: item.main }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: item.relayDuty || "", onChange: (e) => {
                  const val = e.target.value;
                  setMappings(mappings.map((m) => m.sl === item.sl ? {
                    ...m,
                    relayDuty: val
                  } : m));
                }, className: "h-8 w-full max-w-[220px] bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-700 rounded px-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleDelete(item.sl), className: "text-slate-400 hover:text-red-500 font-bold transition text-sm px-2", children: "X" }) })
              ] }, item.sl)) })
            ] }) })
          ] }),
          activeTab === "department" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Department (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Department (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: departments.filter((d) => (d.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
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
          ] }),
          activeTab === "section" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "1000px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Section Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Section (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Section (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: sections.filter((s) => (s.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.departmentName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.nameEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.shortName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "unit" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Name (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Sort Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: units.filter((u) => (u.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.nameEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.sortOrder || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "line" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "900px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Line (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Line (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Sort Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: lines.filter((l) => (l.lineEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.companyName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.lineEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.lineBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.sortOrder || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] })
        ] }) })
      ] }),
      isFormOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-black tracking-tight text-foreground", children: [
              editSl ? "Update" : "Create",
              " ",
              tabsList.find((t) => t.type === activeTab)?.label
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsFormOpen(false), className: "size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-4", children: [
          activeTab === "company" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Company Code *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Company Code", value: orgCode, onChange: (e) => setOrgCode(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Company Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Company Name (Eng)", value: orgNameEng, onChange: (e) => setOrgNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Company Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Company Name (Bng)", value: orgNameBng, onChange: (e) => setOrgNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Short Name", value: orgShortName, onChange: (e) => setOrgShortName(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Address (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Address (Eng)", value: orgAddressEng, onChange: (e) => setOrgAddressEng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Address (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Address (Bng)", value: orgAddressBng, onChange: (e) => setOrgAddressBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: orgIsActive, onChange: (e) => setOrgIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "area" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Area Code *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Area Code", value: areaCode, onChange: (e) => setAreaCode(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Company *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: areaCompany, onChange: (e) => setAreaCompany(e.target.value), className: insetSelectClass, children: orgs.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.nameEng, children: o.nameEng }, o.sl)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Area Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Area Name (Eng)", value: areaNameEng, onChange: (e) => setAreaNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Area Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Area Name (Bng)", value: areaNameBng, onChange: (e) => setAreaNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Short Name", value: areaShortName, onChange: (e) => setAreaShortName(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Address (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Address (Eng)", value: areaAddressEng, onChange: (e) => setAreaAddressEng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Address (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Address (Bng)", value: areaAddressBng, onChange: (e) => setAreaAddressBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: areaIsActive, onChange: (e) => setAreaIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "mapping" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. Embroidery", value: mapName, onChange: (e) => setMapName(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Main *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. RMG Operations", value: mapMain, onChange: (e) => setMapMain(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Relay Duty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Relay Duty value", value: mapRelayDuty, onChange: (e) => setMapRelayDuty(e.target.value), className: insetInputClass })
            ] })
          ] }),
          activeTab === "department" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Department Code *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Code", value: depCode, onChange: (e) => setDepCode(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Department Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Eng)", value: depNameEng, onChange: (e) => setDepNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Department Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Bng)", value: depNameBng, onChange: (e) => setDepNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Short Name", value: depShortName, onChange: (e) => setDepShortName(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: depIsActive, onChange: (e) => setDepIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "section" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Department *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: secDept, onChange: (e) => setSecDept(e.target.value), className: insetSelectClass, children: departments.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d.nameEng, children: d.nameEng }, d.sl)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Section Code *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Code", value: secCode, onChange: (e) => setSecCode(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Section Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Eng)", value: secNameEng, onChange: (e) => setSecNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Section Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Bng)", value: secNameBng, onChange: (e) => setSecNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Short Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Short Name", value: secShortName, onChange: (e) => setSecShortName(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: secIsActive, onChange: (e) => setSecIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "unit" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Unit Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Eng)", value: unitNameEng, onChange: (e) => setUnitNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Unit Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Bng)", value: unitNameBng, onChange: (e) => setUnitNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Sort Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", placeholder: "Sort Order", value: unitSort, onChange: (e) => setUnitSort(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: unitIsActive, onChange: (e) => setUnitIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "line" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Company *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: lineCompany, onChange: (e) => setLineCompany(e.target.value), className: insetSelectClass, children: orgs.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.nameEng, children: o.nameEng }, o.sl)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Line Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Line (Eng)", value: lineEng, onChange: (e) => setLineEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Line Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Line (Bng)", value: lineBng, onChange: (e) => setLineBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Sort Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", placeholder: "Sort Order", value: lineSort, onChange: (e) => setLineSort(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: lineIsActive, onChange: (e) => setLineIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-5 flex items-center justify-between gap-3 bg-[#f8fafc] dark:bg-[#0f172a] -mx-6 -mb-6 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsFormOpen(false), className: "h-10 px-6 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-xs transition-all uppercase tracking-wider shadow-sm hover:shadow", children: "CLOSE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: `h-10 px-8 rounded-lg text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 bg-[#2ecc71] hover:bg-[#27ae60]`, children: editSl ? "UPDATE" : "CREATE" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  StructureSetupPage as component
};
