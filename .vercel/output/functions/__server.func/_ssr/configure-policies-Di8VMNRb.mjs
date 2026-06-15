import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as ChevronRight, N as ShieldAlert, i as Plus, ab as Calendar, S as Search, ax as FileSpreadsheet, P as Printer, d as FileText, ar as Pencil, ap as Trash2, X } from "../_libs/lucide-react.mjs";
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
const DEFAULT_LEAVES = [{
  sl: 1,
  company: "",
  leaveType: "CL",
  isEarnLeave: "No",
  leaveQty: 10,
  cfQty: 0,
  countBasedOnJoinDate: "No",
  holidayCount: "No",
  leaveOnPresent: "No",
  splitMonthly: "No",
  maxLeaveInMonth: "",
  isActive: "Active"
}, {
  sl: 2,
  company: "",
  leaveType: "EL",
  isEarnLeave: "Yes",
  leaveQty: 18,
  cfQty: 0,
  countBasedOnJoinDate: "No",
  holidayCount: "No",
  leaveOnPresent: "No",
  splitMonthly: "No",
  maxLeaveInMonth: "",
  isActive: "Active"
}, {
  sl: 3,
  company: "Pakiza Knit Composite Ltd",
  leaveType: "Injury",
  isEarnLeave: "No",
  leaveQty: 45,
  cfQty: 0,
  countBasedOnJoinDate: "No",
  holidayCount: "No",
  leaveOnPresent: "No",
  splitMonthly: "No",
  maxLeaveInMonth: "",
  isActive: "Active"
}];
const DEFAULT_POLICIES = [{
  sl: 1,
  name: "Attendance Standard Policy",
  description: "Late-in and early-out guidelines",
  isActive: "Active"
}, {
  sl: 2,
  name: "Code of Conduct",
  description: "Standard ethical behavioral rules",
  isActive: "Active"
}];
function PoliciesSetupPage() {
  const [activeTab, setActiveTab] = reactExports.useState("leave");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [leaves, setLeaves] = reactExports.useState([]);
  const [policies, setPolicies] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["leave", "policyName"].includes(tabParam)) {
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
    const leavesData = safeParse("hris_leave_settings", DEFAULT_LEAVES);
    setLeaves(leavesData);
    localStorage.setItem("hris_leave_settings", JSON.stringify(leavesData));
    const policiesData = safeParse("hris_policy_names", DEFAULT_POLICIES);
    setPolicies(policiesData);
    localStorage.setItem("hris_policy_names", JSON.stringify(policiesData));
  }, []);
  const [isFormOpen, setIsFormOpen] = reactExports.useState(false);
  const [editSl, setEditSl] = reactExports.useState(null);
  const [leaveCompany, setLeaveCompany] = reactExports.useState("");
  const [leaveType, setLeaveType] = reactExports.useState("");
  const [isEarnLeave, setIsEarnLeave] = reactExports.useState("No");
  const [leaveQty, setLeaveQty] = reactExports.useState(0);
  const [cfQty, setCfQty] = reactExports.useState(0);
  const [countBasedOnJoinDate, setCountBasedOnJoinDate] = reactExports.useState("No");
  const [holidayCount, setHolidayCount] = reactExports.useState("No");
  const [leaveOnPresent, setLeaveOnPresent] = reactExports.useState("No");
  const [splitMonthly, setSplitMonthly] = reactExports.useState("No");
  const [maxLeaveInMonth, setMaxLeaveInMonth] = reactExports.useState("");
  const [leaveIsActive, setLeaveIsActive] = reactExports.useState("Active");
  const [polName, setPolName] = reactExports.useState("");
  const [polDesc, setPolDesc] = reactExports.useState("");
  const [polIsActive, setPolIsActive] = reactExports.useState("Active");
  const openForm = (sl) => {
    setEditSl(sl);
    if (activeTab === "leave") {
      const item = leaves.find((l) => l.sl === sl);
      setLeaveCompany(item?.company || "");
      setLeaveType(item?.leaveType || "");
      setIsEarnLeave(item?.isEarnLeave || "No");
      setLeaveQty(item?.leaveQty || 0);
      setCfQty(item?.cfQty || 0);
      setCountBasedOnJoinDate(item?.countBasedOnJoinDate || "No");
      setHolidayCount(item?.holidayCount || "No");
      setLeaveOnPresent(item?.leaveOnPresent || "No");
      setSplitMonthly(item?.splitMonthly || "No");
      setMaxLeaveInMonth(item?.maxLeaveInMonth || "");
      setLeaveIsActive(item?.isActive || "Active");
    } else if (activeTab === "policyName") {
      const item = policies.find((p) => p.sl === sl);
      setPolName(item?.name || "");
      setPolDesc(item?.description || "");
      setPolIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };
  const handleDelete = (sl) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    if (activeTab === "leave") {
      const updated = leaves.filter((l) => l.sl !== sl).map((l, idx) => ({
        ...l,
        sl: idx + 1
      }));
      setLeaves(updated);
      localStorage.setItem("hris_leave_settings", JSON.stringify(updated));
    } else if (activeTab === "policyName") {
      const updated = policies.filter((p) => p.sl !== sl).map((p, idx) => ({
        ...p,
        sl: idx + 1
      }));
      setPolicies(updated);
      localStorage.setItem("hris_policy_names", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "leave") {
      if (!leaveType) {
        toast.error("Leave Type is required.");
        return;
      }
      let nextList = [...leaves];
      if (editSl !== null) {
        nextList = leaves.map((l) => l.sl === editSl ? {
          ...l,
          company: leaveCompany,
          leaveType,
          isEarnLeave,
          leaveQty: Number(leaveQty),
          cfQty: Number(cfQty),
          countBasedOnJoinDate,
          holidayCount,
          leaveOnPresent,
          splitMonthly,
          maxLeaveInMonth,
          isActive: leaveIsActive
        } : l);
      } else {
        const sl = leaves.length > 0 ? Math.max(...leaves.map((l) => l.sl)) + 1 : 1;
        nextList.push({
          sl,
          company: leaveCompany,
          leaveType,
          isEarnLeave,
          leaveQty: Number(leaveQty),
          cfQty: Number(cfQty),
          countBasedOnJoinDate,
          holidayCount,
          leaveOnPresent,
          splitMonthly,
          maxLeaveInMonth,
          isActive: leaveIsActive
        });
      }
      setLeaves(nextList);
      localStorage.setItem("hris_leave_settings", JSON.stringify(nextList));
    } else if (activeTab === "policyName") {
      if (!polName) {
        toast.error("Policy Name is required.");
        return;
      }
      let nextList = [...policies];
      if (editSl !== null) {
        nextList = policies.map((p) => p.sl === editSl ? {
          ...p,
          name: polName,
          description: polDesc,
          isActive: polIsActive
        } : p);
      } else {
        const sl = policies.length > 0 ? Math.max(...policies.map((p) => p.sl)) + 1 : 1;
        nextList.push({
          sl,
          name: polName,
          description: polDesc,
          isActive: polIsActive
        });
      }
      setPolicies(nextList);
      localStorage.setItem("hris_policy_names", JSON.stringify(nextList));
    }
    toast.success("Saved successfully");
    setIsFormOpen(false);
  };
  const insetWrapperClass = "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass = "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";
  const tabsList = [{
    type: "leave",
    label: "Leave Setting",
    icon: Calendar
  }, {
    type: "policyName",
    label: "Policy Name",
    icon: ShieldAlert
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Leave & Policies" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-5.5 text-primary" }),
              "Leave & Policies Configuration"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openForm(null), className: "h-10 px-5 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide", children: [
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
        "          ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
          activeTab === "leave" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "1200px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Leave Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Is Earn Leave" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Leave Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "CF Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: leaves.filter((l) => (l.leaveType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.company || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.leaveType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.isEarnLeave }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.leaveQty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.cfQty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "policyName" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Policy Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: policies.filter((p) => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.description || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] })
        ] }) })
      ] }),
      isFormOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-black tracking-tight text-foreground", children: [
              editSl ? "Update" : "Create",
              " ",
              tabsList.find((t) => t.type === activeTab)?.label
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsFormOpen(false), className: "size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-4", children: [
          activeTab === "leave" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Company", value: leaveCompany, onChange: (e) => setLeaveCompany(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Leave Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. CL, EL, SL", value: leaveType, onChange: (e) => setLeaveType(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Is Earn Leave *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: isEarnLeave, onChange: (e) => setIsEarnLeave(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Leave Quantity *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: leaveQty, onChange: (e) => setLeaveQty(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "CF Quantity *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: cfQty, onChange: (e) => setCfQty(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Count Base On Join Date *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: countBasedOnJoinDate, onChange: (e) => setCountBasedOnJoinDate(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Holiday Count *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: holidayCount, onChange: (e) => setHolidayCount(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Leave On Present *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: leaveOnPresent, onChange: (e) => setLeaveOnPresent(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Split Monthly *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: splitMonthly, onChange: (e) => setSplitMonthly(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Max Leave in Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: maxLeaveInMonth, onChange: (e) => setMaxLeaveInMonth(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${insetWrapperClass} sm:col-span-2`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: leaveIsActive, onChange: (e) => setLeaveIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "policyName" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Policy Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Policy Name", value: polName, onChange: (e) => setPolName(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Description details", value: polDesc, onChange: (e) => setPolDesc(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: polIsActive, onChange: (e) => setPolIsActive(e.target.value), className: insetSelectClass, children: [
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
  PoliciesSetupPage as component
};
