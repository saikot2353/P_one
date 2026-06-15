import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { i as initializeRecruitmentMockData, S as Sidebar, T as Topbar } from "./router-B8Fpsbpq.mjs";
import { ag as Tag, Q as Cpu, ah as Award, ai as Ruler, aj as Database, ak as Percent, al as TrendingUp, am as Layers, C as ChevronRight, ae as Sparkles, S as Search, i as Plus, an as UserCog, a6 as CalendarClock, ao as SquarePen, ap as Trash2, X } from "../_libs/lucide-react.mjs";
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
function RecruitmentConfiguration() {
  const [activeTab, setActiveTab] = reactExports.useState("op_name");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editingItem, setEditingItem] = reactExports.useState(null);
  const [operations, setOperations] = reactExports.useState([]);
  const [machines, setMachines] = reactExports.useState([]);
  const [opGrades, setOpGrades] = reactExports.useState([]);
  const [measurements, setMeasurements] = reactExports.useState([]);
  const [smvBank, setSmvBank] = reactExports.useState([]);
  const [effGrades, setEffGrades] = reactExports.useState([]);
  const [gradeVsGrade, setGradeVsGrade] = reactExports.useState([]);
  const [multiSs, setMultiSs] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      initializeRecruitmentMockData();
      setOperations(JSON.parse(localStorage.getItem("recruitment_config_operations") || "[]"));
      setMachines(JSON.parse(localStorage.getItem("recruitment_config_machines") || "[]"));
      setOpGrades(JSON.parse(localStorage.getItem("recruitment_config_op_grades") || "[]"));
      setMeasurements(JSON.parse(localStorage.getItem("recruitment_config_measurements") || "[]"));
      setSmvBank(JSON.parse(localStorage.getItem("recruitment_config_smv_bank") || "[]"));
      setEffGrades(JSON.parse(localStorage.getItem("recruitment_config_eff_grades") || "[]"));
      setGradeVsGrade(JSON.parse(localStorage.getItem("recruitment_config_grade_vs_grade") || "[]"));
      setMultiSs(JSON.parse(localStorage.getItem("recruitment_config_multi_ss_v2") || "[]"));
    }
  }, []);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    setOperations(JSON.parse(localStorage.getItem("recruitment_config_operations") || "[]"));
    setMachines(JSON.parse(localStorage.getItem("recruitment_config_machines") || "[]"));
    setOpGrades(JSON.parse(localStorage.getItem("recruitment_config_op_grades") || "[]"));
    setMeasurements(JSON.parse(localStorage.getItem("recruitment_config_measurements") || "[]"));
    setSmvBank(JSON.parse(localStorage.getItem("recruitment_config_smv_bank") || "[]"));
    setEffGrades(JSON.parse(localStorage.getItem("recruitment_config_eff_grades") || "[]"));
    setGradeVsGrade(JSON.parse(localStorage.getItem("recruitment_config_grade_vs_grade") || "[]"));
    setMultiSs(JSON.parse(localStorage.getItem("recruitment_config_multi_ss_v2") || "[]"));
  }, [activeTab]);
  const saveConfig = (key, data, setter) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };
  const [formData, setFormData] = reactExports.useState({});
  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };
  const handleSave = () => {
    if (activeTab === "op_name" && !editingItem) {
      if (operations.some((o) => o.opName.toLowerCase() === formData.opName?.toLowerCase())) {
        alert("Duplicate Operation Name user can't save.");
        return;
      }
    }
    if (activeTab === "measurement" && !editingItem) {
      if (measurements.some((m) => m.name.toLowerCase() === formData.name?.toLowerCase())) {
        alert("Duplicate Measurement (MP) user can't save.");
        return;
      }
    }
    if (activeTab === "mc_name" && !editingItem) {
      if (machines.some((m) => m.mcFullName.toLowerCase() === formData.mcFullName?.toLowerCase())) {
        alert("Duplicate M/C Name user can't save.");
        return;
      }
    }
    const payload = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
      createdBy: editingItem ? editingItem.createdBy : "MTS 30/03/2026 23:56:02 PM",
      updatedBy: editingItem ? "MTS 30/03/2026 23:57:12 PM" : ""
    };
    let updatedList;
    if (activeTab === "op_name") {
      updatedList = editingItem ? operations.map((o) => o.id === editingItem.id ? payload : o) : [...operations, payload];
      saveConfig("recruitment_config_operations", updatedList, setOperations);
    } else if (activeTab === "mc_name") {
      updatedList = editingItem ? machines.map((m) => m.id === editingItem.id ? payload : m) : [...machines, payload];
      saveConfig("recruitment_config_machines", updatedList, setMachines);
    } else if (activeTab === "op_grade") {
      updatedList = editingItem ? opGrades.map((m) => m.id === editingItem.id ? payload : m) : [...opGrades, payload];
      saveConfig("recruitment_config_op_grades", updatedList, setOpGrades);
    } else if (activeTab === "measurement") {
      updatedList = editingItem ? measurements.map((m) => m.id === editingItem.id ? payload : m) : [...measurements, payload];
      saveConfig("recruitment_config_measurements", updatedList, setMeasurements);
    } else if (activeTab === "smv_bank") {
      updatedList = editingItem ? smvBank.map((s) => s.id === editingItem.id ? payload : s) : [...smvBank, payload];
      saveConfig("recruitment_config_smv_bank", updatedList, setSmvBank);
    } else if (activeTab === "eff_grade") {
      updatedList = editingItem ? effGrades.map((e) => e.id === editingItem.id ? payload : e) : [...effGrades, payload];
      saveConfig("recruitment_config_eff_grades", updatedList, setEffGrades);
    } else if (activeTab === "grade_vs_grade") {
      updatedList = editingItem ? gradeVsGrade.map((g) => g.id === editingItem.id ? payload : g) : [...gradeVsGrade, payload];
      saveConfig("recruitment_config_grade_vs_grade", updatedList, setGradeVsGrade);
    } else if (activeTab === "multi_ss") {
      updatedList = editingItem ? multiSs.map((m) => m.id === editingItem.id ? payload : m) : [...multiSs, payload];
      saveConfig("recruitment_config_multi_ss_v2", updatedList, setMultiSs);
    }
    handleCloseModal();
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return;
    if (activeTab === "op_name") saveConfig("recruitment_config_operations", operations.filter((i) => i.id !== id), setOperations);
    else if (activeTab === "mc_name") saveConfig("recruitment_config_machines", machines.filter((i) => i.id !== id), setMachines);
    else if (activeTab === "op_grade") saveConfig("recruitment_config_op_grades", opGrades.filter((i) => i.id !== id), setOpGrades);
    else if (activeTab === "measurement") saveConfig("recruitment_config_measurements", measurements.filter((i) => i.id !== id), setMeasurements);
    else if (activeTab === "smv_bank") saveConfig("recruitment_config_smv_bank", smvBank.filter((i) => i.id !== id), setSmvBank);
    else if (activeTab === "eff_grade") saveConfig("recruitment_config_eff_grades", effGrades.filter((i) => i.id !== id), setEffGrades);
    else if (activeTab === "grade_vs_grade") saveConfig("recruitment_config_grade_vs_grade", gradeVsGrade.filter((i) => i.id !== id), setGradeVsGrade);
    else if (activeTab === "multi_ss") saveConfig("recruitment_config_multi_ss_v2", multiSs.filter((i) => i.id !== id), setMultiSs);
  };
  const tabs = [{
    id: "op_name",
    label: "Operation Name",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-4" }),
    count: operations.length
  }, {
    id: "mc_name",
    label: "M/C Name",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "size-4" }),
    count: machines.length
  }, {
    id: "op_grade",
    label: "Operation Grade",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-4" }),
    count: opGrades.length
  }, {
    id: "measurement",
    label: "Measurement",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Ruler, { className: "size-4" }),
    count: measurements.length
  }, {
    id: "smv_bank",
    label: "SMV Bank",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "size-4" }),
    count: smvBank.length
  }, {
    id: "eff_grade",
    label: "Eff. Grade Point",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "size-4" }),
    count: effGrades.length
  }, {
    id: "grade_vs_grade",
    label: "Grade Points vs Grade",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4" }),
    count: gradeVsGrade.length
  }, {
    id: "multi_ss",
    label: "Multi/SS",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-4" }),
    count: multiSs.length
  }];
  let currentData = [];
  if (activeTab === "op_name") currentData = operations;
  if (activeTab === "mc_name") currentData = machines;
  if (activeTab === "op_grade") currentData = opGrades;
  if (activeTab === "measurement") currentData = measurements;
  if (activeTab === "smv_bank") currentData = smvBank;
  if (activeTab === "eff_grade") currentData = effGrades;
  if (activeTab === "grade_vs_grade") currentData = gradeVsGrade;
  if (activeTab === "multi_ss") currentData = multiSs;
  if (searchQuery) {
    currentData = currentData.filter((item) => JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase()));
  }
  const activeTabDetails = tabs.find((t) => t.id === activeTab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "IE Recruitment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Configuration Matrices" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "IE Configuration Settings" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search values...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "h-10 w-60 pl-9 pr-4 rounded-xl border border-border/80 bg-background text-xs outline-none focus:border-primary transition-all" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleOpenModal(), className: "h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:shadow-md hover:bg-primary/95 transition flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              " Add Record"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3", children: tabs.map((t) => {
          const isActive = activeTab === t.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(t.id), className: `flex flex-col items-center justify-center p-3.5 rounded-lg border text-center transition-all duration-200 relative group
                    ${isActive ? "bg-primary/10 border-primary text-primary shadow-2xs" : "bg-card border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-xl mb-2 transition-colors duration-200 
                    ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`, children: t.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-wider block leading-tight", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center justify-center mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold border
                    ${isActive ? "bg-primary/20 border-primary/30 text-primary" : "bg-muted border-border/40 text-muted-foreground"}`, children: [
              t.count,
              " items"
            ] })
          ] }, t.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border/40 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "p-1.5 rounded-lg bg-primary/15 text-primary", children: activeTabDetails?.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black uppercase tracking-wider text-foreground", children: [
                activeTabDetails?.label,
                " Database",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 font-bold text-muted-foreground lowercase", children: [
                  "(",
                  currentData.length,
                  " records found)"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 font-bold", children: "Delete permissions granted to administrator" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse", style: {
            minWidth: activeTab === "grade_vs_grade" ? "1200px" : activeTab === "multi_ss" ? "1100px" : activeTab === "smv_bank" ? "900px" : "700px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-[#f8fafc] dark:bg-[#0f172a] text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 w-12 text-center sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] z-10 border-r border-border/30", children: "SL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 w-28 text-center sticky left-12 bg-[#f8fafc] dark:bg-[#0f172a] z-10 border-r border-border/30", children: "Actions" }),
              activeTab === "op_name" && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[320px] border-r border-border/30", children: "Operation Name" }),
              activeTab === "mc_name" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[240px] border-r border-border/30", children: "M/C Full Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "Short Name" })
              ] }),
              activeTab === "op_grade" && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[160px] border-r border-border/30", children: "Operation Grade" }),
              activeTab === "measurement" && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[200px] border-r border-border/30", children: "Measurement (MP) Name" }),
              activeTab === "smv_bank" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[240px] border-r border-border/30", children: "Operation Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "M/C Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Op. Grade" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Measurement" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[80px] border-r border-border/30", children: "SMV" })
              ] }),
              activeTab === "eff_grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[120px] border-r border-border/30", children: "Eff. From (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[120px] border-r border-border/30", children: "Eff. To (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[120px] border-r border-border/30", children: "Grade Point" })
              ] }),
              activeTab === "grade_vs_grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[140px] border-r border-border/30", children: "GP From" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[140px] border-r border-border/30", children: "GP To" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[80px] border-r border-border/30", children: "Grade" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[120px] border-r border-border/30", children: "Salary From" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[120px] border-r border-border/30", children: "Salary To" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "Govt. Grade" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Valid From" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Valid To" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "Remarks" })
              ] }),
              activeTab === "multi_ss" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "Grade Point" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "Op. Grade" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[130px] border-r border-border/30", children: "Min Op. Count" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "M/C Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[70px] border-r border-border/30", children: "Eff%" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[90px] border-r border-border/30", children: "Add Amt" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Valid. Remarks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Remarks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Valid From" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Valid To" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[180px] text-primary/80 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "size-3.5" }),
                " Created By"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[180px] text-primary/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "size-3.5" }),
                " Updated By"
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30 text-foreground", children: [
              currentData.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const rowBgClass = isEven ? "bg-white dark:bg-[#0f172a]" : "bg-[#f8fafc] dark:bg-[#131d30]";
                const stickyCellBgClass = isEven ? "bg-white dark:bg-[#0f172a] group-hover:bg-[#f1f5f9] dark:group-hover:bg-[#1c283d]" : "bg-[#f8fafc] dark:bg-[#131d30] group-hover:bg-[#f1f5f9] dark:group-hover:bg-[#1c283d]";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all cursor-pointer ${rowBgClass}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 text-center text-slate-500 font-bold sticky left-0 ${stickyCellBgClass} z-10 border-r border-border/30 w-12 min-w-[48px] max-w-[48px] transition-all`, children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 sticky left-12 ${stickyCellBgClass} z-10 border-r border-border/30 w-28 min-w-[112px] max-w-[112px] transition-all`, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Edit record", onClick: () => handleOpenModal(item), className: "w-7 h-7 rounded border border-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "size-3.5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Delete record", onClick: () => handleDelete(item.id), className: "w-7 h-7 rounded border border-slate-200 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 text-red-500 dark:text-red-400 transition flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
                  ] }) }),
                  activeTab === "op_name" && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-foreground border-r border-border/30", children: item.opName }),
                  activeTab === "mc_name" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold border-r border-border/30", children: item.mcFullName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded", children: item.mcName }) })
                  ] }),
                  activeTab === "op_grade" && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400 text-[11px] font-black px-2.5 py-0.5 rounded-full", children: item.grade }) }),
                  activeTab === "measurement" && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-semibold border-r border-border/30", children: item.name }),
                  activeTab === "smv_bank" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-[11px] border-r border-border/30", children: item.opName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded", children: item.mcName }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400 text-[10px] font-black px-2 py-0.5 rounded-full", children: item.opGrade }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-[11px] border-r border-border/30", children: item.meas }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-black text-primary border-r border-border/30", children: item.smvValue })
                  ] }),
                  activeTab === "eff_grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono border-r border-border/30", children: [
                      item.effFrom,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono border-r border-border/30", children: [
                      item.effTo,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 font-black text-[11px] px-2.5 py-0.5 rounded-full", children: item.point }) })
                  ] }),
                  activeTab === "grade_vs_grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono border-r border-border/30", children: item.pointFrom }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono border-r border-border/30", children: item.pointTo }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 font-black text-[11px] px-2.5 py-0.5 rounded", children: item.grade }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono border-r border-border/30", children: item.salaryFrom && `৳${Number(item.salaryFrom).toLocaleString()}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono border-r border-border/30", children: item.salaryTo && `৳${Number(item.salaryTo).toLocaleString()}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[11px] border-r border-border/30", children: item.govtGrade }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[11px] border-r border-border/30", children: item.validityFrom }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[11px] border-r border-border/30", children: item.validityTo }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: item.remarks && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${item.remarks === "Current" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`, children: item.remarks }) })
                  ] }),
                  activeTab === "multi_ss" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-bold border-r border-border/30", children: item.point }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400 text-[10px] font-black px-2 py-0.5 rounded-full", children: item.opGrade }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono border-r border-border/30", children: item.minOpCount }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${item.mcType === "Same" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-455" : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"}`, children: item.mcType }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono font-bold text-green-700 dark:text-green-400 border-r border-border/30", children: [
                      item.eff,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono border-r border-border/30", children: [
                      "৳",
                      item.addAmt
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[11px] border-r border-border/30", children: item.validityRemarks }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[11px] border-r border-border/30", children: item.remarks }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[11px] border-r border-border/30", children: item.validityFrom }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[11px] border-r border-border/30", children: item.validityTo })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[10px] text-muted-foreground border-r border-border/30 whitespace-nowrap", children: item.createdBy }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-[10px] text-muted-foreground whitespace-nowrap", children: item.updatedBy || "—" })
                ] }, item.id);
              }),
              currentData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 20, className: "px-4 py-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "size-10 text-muted-foreground/30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-muted-foreground", children: "No records configured in this matrix" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60", children: 'Click "Add Record" to seed data' })
              ] }) }) })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    modalOpen && (() => {
      const tabLabel = tabs.find((t) => t.id === activeTab)?.label ?? "";
      const isEdit = !!editingItem;
      const inp = "w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10";
      const sel = "w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer";
      const lbl = "block text-[11.5px] font-black text-muted-foreground uppercase tracking-wide mb-1.5";
      const isWideModal = activeTab === "grade_vs_grade" || activeTab === "multi_ss" || activeTab === "smv_bank";
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: {
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)"
      }, onClick: (e) => {
        if (e.target === e.currentTarget) handleCloseModal();
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full rounded-lg shadow-2xl border border-border/60 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150", style: {
        maxWidth: isWideModal ? 580 : 420,
        maxHeight: "90vh"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between px-5 py-4 ${isEdit ? "bg-gradient-to-r from-orange-500 to-amber-500" : "bg-gradient-to-r from-primary to-primary/80"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5", children: isEdit ? "Editing Record" : "New Record" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-black text-white tracking-tight", children: tabLabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCloseModal, className: "p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-5 overflow-y-auto space-y-4 ${isWideModal ? "grid grid-cols-2 gap-x-4 gap-y-4 space-y-0" : ""}`, children: [
          activeTab === "op_name" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
              "Operation Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.opName || "", onChange: (e) => setFormData({
              ...formData,
              opName: e.target.value
            }), className: inp, placeholder: "Enter operation name" })
          ] }),
          activeTab === "mc_name" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "M/C Full Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.mcFullName || "", onChange: (e) => setFormData({
                ...formData,
                mcFullName: e.target.value
              }), className: inp, placeholder: "e.g. Single Needle Lock Stitch" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "M/C Short Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.mcName || "", onChange: (e) => setFormData({
                ...formData,
                mcName: e.target.value
              }), className: inp, placeholder: "e.g. SNLS" })
            ] })
          ] }),
          activeTab === "op_grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
              "Operation Grade ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.grade || "", onChange: (e) => setFormData({
              ...formData,
              grade: e.target.value
            }), className: inp, placeholder: "e.g. P, P1, A, B+" })
          ] }),
          activeTab === "measurement" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
              "Measurement (MP) Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.name || "", onChange: (e) => setFormData({
              ...formData,
              name: e.target.value
            }), className: inp, placeholder: "e.g. 44 CM" })
          ] }),
          activeTab === "smv_bank" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Operation Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.opName || "", onChange: (e) => setFormData({
                ...formData,
                opName: e.target.value
              }), className: sel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select Operation —" }),
                operations.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.opName, children: o.opName }, o.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "M/C Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.mcName || "", onChange: (e) => setFormData({
                ...formData,
                mcName: e.target.value
              }), className: sel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select M/C —" }),
                machines.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.mcName, children: m.mcName }, m.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Operation Grade ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.opGrade || "", onChange: (e) => setFormData({
                ...formData,
                opGrade: e.target.value
              }), className: sel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select Grade —" }),
                opGrades.map((og) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: og.grade, children: og.grade }, og.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Measurement (MP) ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.meas || "", onChange: (e) => setFormData({
                ...formData,
                meas: e.target.value
              }), className: sel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select Measurement —" }),
                measurements.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.name, children: m.name }, m.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "SMV Value ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.smvValue || "", onChange: (e) => setFormData({
                ...formData,
                smvValue: e.target.value
              }), className: inp, placeholder: "e.g. 0.26" })
            ] })
          ] }),
          activeTab === "eff_grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Efficiency From (%) ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.effFrom || "", onChange: (e) => setFormData({
                ...formData,
                effFrom: e.target.value
              }), className: inp, placeholder: "e.g. 40.00" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Efficiency To (%) ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.effTo || "", onChange: (e) => setFormData({
                ...formData,
                effTo: e.target.value
              }), className: inp, placeholder: "e.g. 49.99" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Grade Point ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.point || "", onChange: (e) => setFormData({
                ...formData,
                point: e.target.value
              }), className: inp, placeholder: "e.g. 1.00" })
            ] })
          ] }),
          activeTab === "grade_vs_grade" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Validity From ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: formData.validityFrom || "", onChange: (e) => setFormData({
                ...formData,
                validityFrom: e.target.value
              }), className: inp })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Validity To ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: formData.validityTo || "", onChange: (e) => setFormData({
                ...formData,
                validityTo: e.target.value
              }), className: inp })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "GP From ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.pointFrom || "", onChange: (e) => setFormData({
                ...formData,
                pointFrom: e.target.value
              }), className: inp, placeholder: "e.g. 2.00" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "GP To ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.pointTo || "", onChange: (e) => setFormData({
                ...formData,
                pointTo: e.target.value
              }), className: inp, placeholder: "e.g. 2.99" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Grade ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.grade || "", onChange: (e) => setFormData({
                ...formData,
                grade: e.target.value
              }), className: sel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select —" }),
                ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "H", "Special"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g, children: g }, g))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Govt. Grade ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.govtGrade || "", onChange: (e) => setFormData({
                ...formData,
                govtGrade: e.target.value
              }), className: sel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select —" }),
                ["Grade-1", "Grade-2", "Grade-3", "Grade-4"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g, children: g }, g))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Salary From ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.salaryFrom || "", onChange: (e) => setFormData({
                ...formData,
                salaryFrom: e.target.value
              }), className: inp, placeholder: "e.g. 13000" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Salary To ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.salaryTo || "", onChange: (e) => setFormData({
                ...formData,
                salaryTo: e.target.value
              }), className: inp, placeholder: "e.g. 13500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: lbl, children: "Remarks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.remarks || "", onChange: (e) => setFormData({
                ...formData,
                remarks: e.target.value
              }), className: inp, placeholder: "Optional notes" })
            ] })
          ] }),
          activeTab === "multi_ss" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Validity From ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: formData.validityFrom || "", onChange: (e) => setFormData({
                ...formData,
                validityFrom: e.target.value
              }), className: inp })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Validity To ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: formData.validityTo || "", onChange: (e) => setFormData({
                ...formData,
                validityTo: e.target.value
              }), className: inp })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Total GP ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.point || "", onChange: (e) => setFormData({
                ...formData,
                point: e.target.value
              }), className: inp, placeholder: "e.g. 5.00" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Op. Grade ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.opGrade || "", onChange: (e) => setFormData({
                ...formData,
                opGrade: e.target.value
              }), className: sel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select Grade —" }),
                opGrades.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.grade, children: o.grade }, o.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Min Op. Count ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.minOpCount || "", onChange: (e) => setFormData({
                ...formData,
                minOpCount: e.target.value
              }), className: inp, placeholder: "Comma separated, e.g. 2" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "M/C Type ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formData.mcType || "", onChange: (e) => setFormData({
                ...formData,
                mcType: e.target.value
              }), className: sel, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select —" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Same", children: "Same" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Different", children: "Different" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Efficiency % ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.eff || "", onChange: (e) => setFormData({
                ...formData,
                eff: e.target.value
              }), className: inp, placeholder: "e.g. 90" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: lbl, children: [
                "Add Amount ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.addAmt || "", onChange: (e) => setFormData({
                ...formData,
                addAmt: e.target.value
              }), className: inp, placeholder: "e.g. 500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: lbl, children: "Validity Remarks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.validityRemarks || "", onChange: (e) => setFormData({
                ...formData,
                validityRemarks: e.target.value
              }), className: inp, placeholder: "e.g. Current" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: lbl, children: "Remarks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formData.remarks || "", onChange: (e) => setFormData({
                ...formData,
                remarks: e.target.value
              }), className: inp, placeholder: "Optional notes" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-t border-border/40 bg-muted/20 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-bold", children: "*" }),
            " Required fields"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCloseModal, className: "h-10 px-6 rounded-xl border border-border/80 text-muted-foreground font-bold text-xs hover:border-red-300 hover:text-red-500 hover:bg-red-50/50 transition-all", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, className: `h-10 px-8 rounded-xl font-black text-xs text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all
                      ${isEdit ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600" : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"}`, children: isEdit ? "Update Record" : "Save Record" })
          ] })
        ] })
      ] }) });
    })()
  ] });
}
export {
  RecruitmentConfiguration as component
};
