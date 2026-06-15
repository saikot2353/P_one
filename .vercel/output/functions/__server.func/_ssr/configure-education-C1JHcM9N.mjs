import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as ChevronRight, ah as Award, i as Plus, aN as Building, a_ as BookOpen, aU as GraduationCap, S as Search, ax as FileSpreadsheet, P as Printer, d as FileText, ar as Pencil, ap as Trash2, X } from "../_libs/lucide-react.mjs";
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
const DEFAULT_QUALIFICATIONS = [{
  sl: 1,
  education: "Alim",
  isActive: "Active"
}, {
  sl: 2,
  education: "B.A",
  isActive: "Active"
}, {
  sl: 3,
  education: "B.B.A",
  isActive: "Active"
}, {
  sl: 4,
  education: "B.B.S",
  isActive: "Active"
}, {
  sl: 5,
  education: "B.Com",
  isActive: "Active"
}, {
  sl: 6,
  education: "B.S.S",
  isActive: "Active"
}];
const DEFAULT_INSTITUTIONS = [{
  sl: 1,
  education: "University of Dhaka",
  isActive: "Active"
}, {
  sl: 2,
  education: "National University",
  isActive: "Active"
}, {
  sl: 3,
  education: "Bangladesh University of Engineering and Technology (BUET)",
  isActive: "Active"
}, {
  sl: 4,
  education: "University of Rajshahi",
  isActive: "Active"
}, {
  sl: 5,
  education: "University of Chittagong",
  isActive: "Active"
}, {
  sl: 6,
  education: "Jahangirnagar University",
  isActive: "Active"
}, {
  sl: 7,
  education: "Jagannath University",
  isActive: "Active"
}, {
  sl: 8,
  education: "Shahjalal University of Science and Technology",
  isActive: "Active"
}];
const DEFAULT_RESULTS = [{
  sl: 1,
  result: "A-",
  isActive: "Active"
}, {
  sl: 2,
  result: "A (Grade)",
  isActive: "Active"
}, {
  sl: 3,
  result: "A+",
  isActive: "Active"
}, {
  sl: 4,
  result: "B (Grade)",
  isActive: "Active"
}, {
  sl: 5,
  result: "C (Grade)",
  isActive: "Active"
}, {
  sl: 6,
  result: "D (Grade)",
  isActive: "Active"
}, {
  sl: 7,
  result: "First Division",
  isActive: "Active"
}, {
  sl: 8,
  result: "Second Division",
  isActive: "Active"
}, {
  sl: 9,
  result: "Third Division",
  isActive: "Active"
}];
const DEFAULT_TRAININGS = [{
  sl: 1,
  name: "WPC Meeting.",
  isActive: "Active"
}, {
  sl: 2,
  name: "Leave and Procudure.",
  isActive: "Active"
}, {
  sl: 3,
  name: "OHS (Occupation Health & Safety)",
  isActive: "Active"
}, {
  sl: 4,
  name: "Overtime Calculation & Procudure.",
  isActive: "Active"
}, {
  sl: 5,
  name: "Labour Law for the Worker.",
  isActive: "Active"
}];
function EducationSetupPage() {
  const [activeTab, setActiveTab] = reactExports.useState("qualification");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [qualifications, setQualifications] = reactExports.useState([]);
  const [institutions, setInstitutions] = reactExports.useState([]);
  const [results, setResults] = reactExports.useState([]);
  const [trainings, setTrainings] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["qualification", "institution", "result", "training"].includes(tabParam)) {
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
    const qualificationsData = safeParse("hris_educational_qualifications", DEFAULT_QUALIFICATIONS, "education");
    setQualifications(qualificationsData);
    localStorage.setItem("hris_educational_qualifications", JSON.stringify(qualificationsData));
    const institutionsData = safeParse("hris_educational_institutions", DEFAULT_INSTITUTIONS, "education");
    setInstitutions(institutionsData);
    localStorage.setItem("hris_educational_institutions", JSON.stringify(institutionsData));
    const resultsData = safeParse("hris_educational_results", DEFAULT_RESULTS, "result");
    setResults(resultsData);
    localStorage.setItem("hris_educational_results", JSON.stringify(resultsData));
    const trainingsData = safeParse("hris_training_categories", DEFAULT_TRAININGS, "name");
    setTrainings(trainingsData);
    localStorage.setItem("hris_training_categories", JSON.stringify(trainingsData));
  }, []);
  const [isFormOpen, setIsFormOpen] = reactExports.useState(false);
  const [editSl, setEditSl] = reactExports.useState(null);
  const [qualTitle, setQualTitle] = reactExports.useState("");
  const [qualIsActive, setQualIsActive] = reactExports.useState("Active");
  const [instTitle, setInstTitle] = reactExports.useState("");
  const [instIsActive, setInstIsActive] = reactExports.useState("Active");
  const [resTitle, setResTitle] = reactExports.useState("");
  const [resIsActive, setResIsActive] = reactExports.useState("Active");
  const [trainName, setTrainName] = reactExports.useState("");
  const [trainIsActive, setTrainIsActive] = reactExports.useState("Active");
  const openForm = (sl) => {
    setEditSl(sl);
    if (activeTab === "qualification") {
      const item = qualifications.find((q) => q.sl === sl);
      setQualTitle(item?.education || "");
      setQualIsActive(item?.isActive || "Active");
    } else if (activeTab === "institution") {
      const item = institutions.find((i) => i.sl === sl);
      setInstTitle(item?.education || "");
      setInstIsActive(item?.isActive || "Active");
    } else if (activeTab === "result") {
      const item = results.find((r) => r.sl === sl);
      setResTitle(item?.result || "");
      setResIsActive(item?.isActive || "Active");
    } else if (activeTab === "training") {
      const item = trainings.find((t) => t.sl === sl);
      setTrainName(item?.name || "");
      setTrainIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };
  const handleDelete = (sl) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    if (activeTab === "qualification") {
      const updated = qualifications.filter((q) => q.sl !== sl).map((q, idx) => ({
        ...q,
        sl: idx + 1
      }));
      setQualifications(updated);
      localStorage.setItem("hris_educational_qualifications", JSON.stringify(updated));
    } else if (activeTab === "institution") {
      const updated = institutions.filter((i) => i.sl !== sl).map((i, idx) => ({
        ...i,
        sl: idx + 1
      }));
      setInstitutions(updated);
      localStorage.setItem("hris_educational_institutions", JSON.stringify(updated));
    } else if (activeTab === "result") {
      const updated = results.filter((r) => r.sl !== sl).map((r, idx) => ({
        ...r,
        sl: idx + 1
      }));
      setResults(updated);
      localStorage.setItem("hris_educational_results", JSON.stringify(updated));
    } else if (activeTab === "training") {
      const updated = trainings.filter((t) => t.sl !== sl).map((t, idx) => ({
        ...t,
        sl: idx + 1
      }));
      setTrainings(updated);
      localStorage.setItem("hris_training_categories", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "qualification") {
      if (!qualTitle) {
        toast.error("Title is required.");
        return;
      }
      let nextList = [...qualifications];
      if (editSl !== null) {
        nextList = qualifications.map((q) => q.sl === editSl ? {
          ...q,
          education: qualTitle,
          isActive: qualIsActive
        } : q);
      } else {
        const sl = qualifications.length > 0 ? Math.max(...qualifications.map((q) => q.sl)) + 1 : 1;
        nextList.push({
          sl,
          education: qualTitle,
          isActive: qualIsActive
        });
      }
      setQualifications(nextList);
      localStorage.setItem("hris_educational_qualifications", JSON.stringify(nextList));
    } else if (activeTab === "institution") {
      if (!instTitle) {
        toast.error("Institution name is required.");
        return;
      }
      let nextList = [...institutions];
      if (editSl !== null) {
        nextList = institutions.map((i) => i.sl === editSl ? {
          ...i,
          education: instTitle,
          isActive: instIsActive
        } : i);
      } else {
        const sl = institutions.length > 0 ? Math.max(...institutions.map((i) => i.sl)) + 1 : 1;
        nextList.push({
          sl,
          education: instTitle,
          isActive: instIsActive
        });
      }
      setInstitutions(nextList);
      localStorage.setItem("hris_educational_institutions", JSON.stringify(nextList));
    } else if (activeTab === "result") {
      if (!resTitle) {
        toast.error("Result name is required.");
        return;
      }
      let nextList = [...results];
      if (editSl !== null) {
        nextList = results.map((r) => r.sl === editSl ? {
          ...r,
          result: resTitle,
          isActive: resIsActive
        } : r);
      } else {
        const sl = results.length > 0 ? Math.max(...results.map((r) => r.sl)) + 1 : 1;
        nextList.push({
          sl,
          result: resTitle,
          isActive: resIsActive
        });
      }
      setResults(nextList);
      localStorage.setItem("hris_educational_results", JSON.stringify(nextList));
    } else if (activeTab === "training") {
      if (!trainName) {
        toast.error("Training name is required.");
        return;
      }
      let nextList = [...trainings];
      if (editSl !== null) {
        nextList = trainings.map((t) => t.sl === editSl ? {
          ...t,
          name: trainName,
          isActive: trainIsActive
        } : t);
      } else {
        const sl = trainings.length > 0 ? Math.max(...trainings.map((t) => t.sl)) + 1 : 1;
        nextList.push({
          sl,
          name: trainName,
          isActive: trainIsActive
        });
      }
      setTrainings(nextList);
      localStorage.setItem("hris_training_categories", JSON.stringify(nextList));
    }
    toast.success("Saved successfully");
    setIsFormOpen(false);
  };
  const insetWrapperClass = "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass = "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";
  const tabsList = [{
    type: "qualification",
    label: "Educational Qualification",
    icon: Award
  }, {
    type: "institution",
    label: "Education Institution",
    icon: Building
  }, {
    type: "result",
    label: "Education Result",
    icon: BookOpen
  }, {
    type: "training",
    label: "Training Category",
    icon: GraduationCap
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Education & Training" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-5.5 text-primary" }),
              "Education & Training Configuration"
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
          activeTab === "qualification" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Education / Qualification" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: qualifications.filter((q) => (q.education || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.education }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "institution" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Education (Institution Name)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: institutions.filter((i) => (i.education || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.education }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Result / Division" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: results.filter((r) => (r.result || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.result }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "training" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Training Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: trainings.filter((t) => (t.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] })
        ] }) })
      ] }),
      isFormOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-black tracking-tight text-foreground", children: [
              editSl ? "Update" : "Create",
              " ",
              tabsList.find((t) => t.type === activeTab)?.label
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsFormOpen(false), className: "size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-4", children: [
          activeTab === "qualification" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Education / Qualification Title *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. Alim, B.A, B.B.A", value: qualTitle, onChange: (e) => setQualTitle(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: qualIsActive, onChange: (e) => setQualIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "institution" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Institution Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Institution Name", value: instTitle, onChange: (e) => setInstTitle(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: instIsActive, onChange: (e) => setInstIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Result / Division Title *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. A+, First Division", value: resTitle, onChange: (e) => setResTitle(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: resIsActive, onChange: (e) => setResIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "training" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Training Category Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Training name", value: trainName, onChange: (e) => setTrainName(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trainIsActive, onChange: (e) => setTrainIsActive(e.target.value), className: insetSelectClass, children: [
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
  EducationSetupPage as component
};
