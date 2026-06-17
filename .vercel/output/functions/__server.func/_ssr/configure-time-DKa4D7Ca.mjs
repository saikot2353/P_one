import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as ChevronRight, ab as Calendar, i as Plus, a as Clock, aW as TriangleAlert, J as Coins, S as Search, ax as FileSpreadsheet, P as Printer, d as FileText, ar as Pencil, ap as Trash2, X } from "../_libs/lucide-react.mjs";
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
const DEFAULT_SHIFTS = [{
  sl: 1,
  nameEng: "RMG-PIP",
  nameBng: "আরএমজি-পিআইপি",
  startTime: "08:00:00",
  endTime: "17:00:00",
  lateTime: "08:05:00",
  startTimeFrom: "06:30:00",
  endTimeTo: "10:30:00",
  lateCount: "Yes",
  sortOrder: 33,
  isActive: "Active",
  isRotate: "No",
  rotationCriteria: "",
  shiftChangeDay: "",
  isLateDeduction: "No",
  deductionFrom: "",
  deductionPer: "",
  deductionAfterDay: ""
}];
const DEFAULT_OT_CONFIGS = [{
  sl: 1,
  employeeType: "ALL",
  otCalculationType: "Flat Hour",
  bufferMinutes: 15,
  isActive: "Active"
}];
const DEFAULT_ABNORMAL_SHIFTS = [{
  sl: 1,
  shiftName: "Night Shift Extra",
  date: "2026-06-20",
  reason: "Product Launch",
  isActive: "Active"
}];
const DEFAULT_ATTN_BONUS_POLICIES = [{
  sl: 1,
  name: "General Worker Policy",
  allowedLateDays: 3,
  allowedAbsentDays: 0,
  bonusAmount: 500,
  isActive: "Active"
}];
function TimeSetupPage() {
  const [activeTab, setActiveTab] = reactExports.useState("shift");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [shifts, setShifts] = reactExports.useState([]);
  const [otConfigs, setOtConfigs] = reactExports.useState([]);
  const [abnormalShifts, setAbnormalShifts] = reactExports.useState([]);
  const [attnPolicies, setAttnPolicies] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["shift", "ot", "abnormal", "bonus"].includes(tabParam)) {
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
    const shiftsData = safeParse("hris_shifts", DEFAULT_SHIFTS);
    setShifts(shiftsData);
    localStorage.setItem("hris_shifts", JSON.stringify(shiftsData));
    const otData = safeParse("hris_ot_config", DEFAULT_OT_CONFIGS);
    setOtConfigs(otData);
    localStorage.setItem("hris_ot_config", JSON.stringify(otData));
    const abData = safeParse("hris_abnormal_shifts", DEFAULT_ABNORMAL_SHIFTS);
    setAbnormalShifts(abData);
    localStorage.setItem("hris_abnormal_shifts", JSON.stringify(abData));
    const policiesData = safeParse("hris_attendance_bonus_policy", DEFAULT_ATTN_BONUS_POLICIES);
    setAttnPolicies(policiesData);
    localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(policiesData));
  }, []);
  const [isFormOpen, setIsFormOpen] = reactExports.useState(false);
  const [editSl, setEditSl] = reactExports.useState(null);
  const [shiftNameEng, setShiftNameEng] = reactExports.useState("");
  const [shiftNameBng, setShiftNameBng] = reactExports.useState("");
  const [shiftStart, setShiftStart] = reactExports.useState("08:00:00");
  const [shiftEnd, setShiftEnd] = reactExports.useState("17:00:00");
  const [shiftLate, setShiftLate] = reactExports.useState("08:05:00");
  const [shiftLateCount, setShiftLateCount] = reactExports.useState("Yes");
  const [shiftStartFrom, setShiftStartFrom] = reactExports.useState("06:00:00");
  const [shiftEndTo, setShiftEndTo] = reactExports.useState("12:00:00");
  const [shiftSort, setShiftSort] = reactExports.useState(1);
  const [shiftIsActive, setShiftIsActive] = reactExports.useState("Active");
  const [shiftIsRotate, setShiftIsRotate] = reactExports.useState("No");
  const [shiftRotation, setShiftRotation] = reactExports.useState("");
  const [shiftChangeDay, setShiftChangeDay] = reactExports.useState("Select..");
  const [shiftIsLateDeduct, setShiftIsLateDeduct] = reactExports.useState("No");
  const [shiftDeductFrom, setShiftDeductFrom] = reactExports.useState("");
  const [shiftDeductPer, setShiftDeductPer] = reactExports.useState("");
  const [shiftDeductAfterDay, setShiftDeductAfterDay] = reactExports.useState("");
  const [otEmpType, setOtEmpType] = reactExports.useState("ALL");
  const [otCalcType, setOtCalcType] = reactExports.useState("Flat Hour");
  const [otBuffer, setOtBuffer] = reactExports.useState(15);
  const [otIsActive, setOtIsActive] = reactExports.useState("Active");
  const [abShiftName, setAbShiftName] = reactExports.useState("");
  const [abDate, setAbDate] = reactExports.useState("");
  const [abReason, setAbReason] = reactExports.useState("");
  const [abIsActive, setAbIsActive] = reactExports.useState("Active");
  const [policyName, setPolicyName] = reactExports.useState("");
  const [policyLate, setPolicyLate] = reactExports.useState(3);
  const [policyAbsent, setPolicyAbsent] = reactExports.useState(0);
  const [policyAmount, setPolicyAmount] = reactExports.useState(500);
  const [policyIsActive, setPolicyIsActive] = reactExports.useState("Active");
  const openForm = (sl) => {
    setEditSl(sl);
    if (activeTab === "shift") {
      const item = shifts.find((s) => s.sl === sl);
      setShiftNameEng(item?.nameEng || "");
      setShiftNameBng(item?.nameBng || "");
      setShiftStart(item?.startTime || "08:00:00");
      setShiftEnd(item?.endTime || "17:00:00");
      setShiftLate(item?.lateTime || "08:05:00");
      setShiftLateCount(item?.lateCount || "Yes");
      setShiftStartFrom(item?.startTimeFrom || "06:00:00");
      setShiftEndTo(item?.endTimeTo || "12:00:00");
      setShiftSort(item?.sortOrder || shifts.length + 1);
      setShiftIsActive(item?.isActive || "Active");
      setShiftIsRotate(item?.isRotate || "No");
      setShiftRotation(item?.rotationCriteria || "");
      setShiftChangeDay(item?.shiftChangeDay || "Select..");
      setShiftIsLateDeduct(item?.isLateDeduction || "No");
      setShiftDeductFrom(item?.deductionFrom || "");
      setShiftDeductPer(item?.deductionPer || "");
      setShiftDeductAfterDay(item?.deductionAfterDay || "");
    } else if (activeTab === "ot") {
      const item = otConfigs.find((o) => o.sl === sl);
      setOtEmpType(item?.employeeType || "ALL");
      setOtCalcType(item?.otCalculationType || "Flat Hour");
      setOtBuffer(item?.bufferMinutes || 15);
      setOtIsActive(item?.isActive || "Active");
    } else if (activeTab === "abnormal") {
      const item = abnormalShifts.find((a) => a.sl === sl);
      setAbShiftName(item?.shiftName || "");
      setAbDate(item?.date || "");
      setAbReason(item?.reason || "");
      setAbIsActive(item?.isActive || "Active");
    } else if (activeTab === "bonus") {
      const item = attnPolicies.find((b) => b.sl === sl);
      setPolicyName(item?.name || "");
      setPolicyLate(item?.allowedLateDays || 3);
      setPolicyAbsent(item?.allowedAbsentDays || 0);
      setPolicyAmount(item?.bonusAmount || 500);
      setPolicyIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };
  const handleDelete = (sl) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    if (activeTab === "shift") {
      const updated = shifts.filter((s) => s.sl !== sl).map((s, idx) => ({
        ...s,
        sl: idx + 1
      }));
      setShifts(updated);
      localStorage.setItem("hris_shifts", JSON.stringify(updated));
    } else if (activeTab === "ot") {
      const updated = otConfigs.filter((o) => o.sl !== sl).map((o, idx) => ({
        ...o,
        sl: idx + 1
      }));
      setOtConfigs(updated);
      localStorage.setItem("hris_ot_config", JSON.stringify(updated));
    } else if (activeTab === "abnormal") {
      const updated = abnormalShifts.filter((a) => a.sl !== sl).map((a, idx) => ({
        ...a,
        sl: idx + 1
      }));
      setAbnormalShifts(updated);
      localStorage.setItem("hris_abnormal_shifts", JSON.stringify(updated));
    } else if (activeTab === "bonus") {
      const updated = attnPolicies.filter((b) => b.sl !== sl).map((b, idx) => ({
        ...b,
        sl: idx + 1
      }));
      setAttnPolicies(updated);
      localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "shift") {
      if (!shiftNameEng) {
        toast.error("Shift Name is required.");
        return;
      }
      let nextList = [...shifts];
      if (editSl !== null) {
        nextList = shifts.map((s) => s.sl === editSl ? {
          ...s,
          nameEng: shiftNameEng,
          nameBng: shiftNameBng,
          startTime: shiftStart,
          endTime: shiftEnd,
          lateTime: shiftLate,
          startTimeFrom: shiftStartFrom,
          endTimeTo: shiftEndTo,
          lateCount: shiftLateCount,
          sortOrder: Number(shiftSort),
          isActive: shiftIsActive,
          isRotate: shiftIsRotate,
          rotationCriteria: shiftRotation,
          shiftChangeDay,
          isLateDeduction: shiftIsLateDeduct,
          deductionFrom: shiftDeductFrom,
          deductionPer: shiftDeductPer,
          deductionAfterDay: shiftDeductAfterDay
        } : s);
      } else {
        const sl = shifts.length > 0 ? Math.max(...shifts.map((s) => s.sl)) + 1 : 1;
        nextList.push({
          sl,
          nameEng: shiftNameEng,
          nameBng: shiftNameBng,
          startTime: shiftStart,
          endTime: shiftEnd,
          lateTime: shiftLate,
          startTimeFrom: shiftStartFrom,
          endTimeTo: shiftEndTo,
          lateCount: shiftLateCount,
          sortOrder: Number(shiftSort),
          isActive: shiftIsActive,
          isRotate: shiftIsRotate,
          rotationCriteria: shiftRotation,
          shiftChangeDay,
          isLateDeduction: shiftIsLateDeduct,
          deductionFrom: shiftDeductFrom,
          deductionPer: shiftDeductPer,
          deductionAfterDay: shiftDeductAfterDay
        });
      }
      setShifts(nextList);
      localStorage.setItem("hris_shifts", JSON.stringify(nextList));
    } else if (activeTab === "ot") {
      let nextList = [...otConfigs];
      if (editSl !== null) {
        nextList = otConfigs.map((o) => o.sl === editSl ? {
          ...o,
          employeeType: otEmpType,
          otCalculationType: otCalcType,
          bufferMinutes: Number(otBuffer),
          isActive: otIsActive
        } : o);
      } else {
        const sl = otConfigs.length > 0 ? Math.max(...otConfigs.map((o) => o.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: otEmpType,
          otCalculationType: otCalcType,
          bufferMinutes: Number(otBuffer),
          isActive: otIsActive
        });
      }
      setOtConfigs(nextList);
      localStorage.setItem("hris_ot_config", JSON.stringify(nextList));
    } else if (activeTab === "abnormal") {
      if (!abShiftName) {
        toast.error("Shift Name is required.");
        return;
      }
      let nextList = [...abnormalShifts];
      if (editSl !== null) {
        nextList = abnormalShifts.map((a) => a.sl === editSl ? {
          ...a,
          shiftName: abShiftName,
          date: abDate,
          reason: abReason,
          isActive: abIsActive
        } : a);
      } else {
        const sl = abnormalShifts.length > 0 ? Math.max(...abnormalShifts.map((a) => a.sl)) + 1 : 1;
        nextList.push({
          sl,
          shiftName: abShiftName,
          date: abDate,
          reason: abReason,
          isActive: abIsActive
        });
      }
      setAbnormalShifts(nextList);
      localStorage.setItem("hris_abnormal_shifts", JSON.stringify(nextList));
    } else if (activeTab === "bonus") {
      if (!policyName) {
        toast.error("Policy Name is required.");
        return;
      }
      let nextList = [...attnPolicies];
      if (editSl !== null) {
        nextList = attnPolicies.map((b) => b.sl === editSl ? {
          ...b,
          name: policyName,
          allowedLateDays: Number(policyLate),
          allowedAbsentDays: Number(policyAbsent),
          bonusAmount: Number(policyAmount),
          isActive: policyIsActive
        } : b);
      } else {
        const sl = attnPolicies.length > 0 ? Math.max(...attnPolicies.map((b) => b.sl)) + 1 : 1;
        nextList.push({
          sl,
          name: policyName,
          allowedLateDays: Number(policyLate),
          allowedAbsentDays: Number(policyAbsent),
          bonusAmount: Number(policyAmount),
          isActive: policyIsActive
        });
      }
      setAttnPolicies(nextList);
      localStorage.setItem("hris_attendance_bonus_policy", JSON.stringify(nextList));
    }
    toast.success("Saved successfully");
    setIsFormOpen(false);
  };
  const insetWrapperClass = "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass = "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";
  const tabsList = [{
    type: "shift",
    label: "Standard Shift",
    icon: Calendar
  }, {
    type: "ot",
    label: "OT Configuration",
    icon: Clock
  }, {
    type: "abnormal",
    label: "Abnormal Shift",
    icon: TriangleAlert
  }, {
    type: "bonus",
    label: "Attendance Bonus Policy",
    icon: Coins
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Time & Shift Setup" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-5.5 text-primary" }),
              "Time & Shift Configuration"
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
          activeTab === "shift" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "1600px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Name (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Start Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "End Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Late Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "Start Time From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px]", children: "End Time To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Late Count" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Sort Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "IsRotate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[150px]", children: "Rotation Criteria" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Shift Change Day" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: shifts.filter((s) => (s.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.nameEng }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200", children: item.nameBng || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.startTime }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.endTime }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.lateTime }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.startTimeFrom }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal font-mono", children: item.endTimeTo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.lateCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.sortOrder }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.isRotate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.rotationCriteria || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.shiftChangeDay || "—" })
            ] }, item.sl)) })
          ] }),
          activeTab === "ot" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "OT Calculation Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px] text-center", children: "Buffer Minutes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: otConfigs.filter((o) => (o.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.employeeType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200", children: item.otCalculationType }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: [
                item.bufferMinutes,
                " mins"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "abnormal" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Shift Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px] text-center", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[250px]", children: "Reason" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: abnormalShifts.filter((a) => (a.shiftName || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.shiftName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.reason || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "bonus" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Policy Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px] text-center", children: "Allowed Late Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px] text-center", children: "Allowed Absent Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px] text-right", children: "Bonus Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: attnPolicies.filter((b) => (b.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: [
                item.allowedLateDays,
                " days"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: [
                item.allowedAbsentDays,
                " days"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-normal font-mono text-emerald-600", children: [
                item.bonusAmount,
                " BDT"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] })
        ] }) })
      ] }),
      isFormOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-black tracking-tight text-foreground", children: [
              editSl ? "Update" : "Create",
              " ",
              tabsList.find((t) => t.type === activeTab)?.label
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsFormOpen(false), className: "size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-4", children: [
          activeTab === "shift" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Name (Eng) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Eng)", value: shiftNameEng, onChange: (e) => setShiftNameEng(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Name (Bng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name (Bng)", value: shiftNameBng, onChange: (e) => setShiftNameBng(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Start Time *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. 08:00:00", value: shiftStart, onChange: (e) => setShiftStart(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "End Time *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. 17:00:00", value: shiftEnd, onChange: (e) => setShiftEnd(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Late Time *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. 08:05:00", value: shiftLate, onChange: (e) => setShiftLate(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Late Count *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: shiftLateCount, onChange: (e) => setShiftLateCount(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Start Time From *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. 06:00:00", value: shiftStartFrom, onChange: (e) => setShiftStartFrom(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "End Time To *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. 12:00:00", value: shiftEndTo, onChange: (e) => setShiftEndTo(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Sort Order *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", placeholder: "Sort Order", value: shiftSort, onChange: (e) => setShiftSort(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Is Rotate?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: shiftIsRotate, onChange: (e) => setShiftIsRotate(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Rotation Criteria" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Criteria", value: shiftRotation, onChange: (e) => setShiftRotation(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Shift Change Day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: shiftChangeDay, onChange: (e) => setShiftChangeDay(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Select..", children: "Select.." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Friday", children: "Friday" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Saturday", children: "Saturday" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Sunday", children: "Sunday" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Monday", children: "Monday" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Tuesday", children: "Tuesday" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Wednesday", children: "Wednesday" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Thursday", children: "Thursday" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Is Late Deduction?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: shiftIsLateDeduct, onChange: (e) => setShiftIsLateDeduct(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Deduction From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: shiftDeductFrom, onChange: (e) => setShiftDeductFrom(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Deduction Per" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: shiftDeductPer, onChange: (e) => setShiftDeductPer(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Deduction After Day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: shiftDeductAfterDay, onChange: (e) => setShiftDeductAfterDay(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${insetWrapperClass} sm:col-span-2`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: shiftIsActive, onChange: (e) => setShiftIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "ot" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. ALL, Permanent", value: otEmpType, onChange: (e) => setOtEmpType(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "OT Calculation Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: otCalcType, onChange: (e) => setOtCalcType(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Flat Hour", children: "Flat Hour" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Basic Ratio", children: "Basic Ratio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Gross Ratio", children: "Gross Ratio" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Buffer Minutes *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: otBuffer, onChange: (e) => setOtBuffer(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: otIsActive, onChange: (e) => setOtIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "abnormal" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Shift Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Abnormal Shift Name", value: abShiftName, onChange: (e) => setAbShiftName(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Date *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: abDate, onChange: (e) => setAbDate(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Reason" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Reason details", value: abReason, onChange: (e) => setAbReason(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: abIsActive, onChange: (e) => setAbIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "bonus" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Policy Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Policy Name", value: policyName, onChange: (e) => setPolicyName(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Allowed Late Days *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: policyLate, onChange: (e) => setPolicyLate(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Allowed Absent Days *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: policyAbsent, onChange: (e) => setPolicyAbsent(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Bonus Amount (BDT) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: policyAmount, onChange: (e) => setPolicyAmount(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: policyIsActive, onChange: (e) => setPolicyIsActive(e.target.value), className: insetSelectClass, children: [
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
  TimeSetupPage as component
};
