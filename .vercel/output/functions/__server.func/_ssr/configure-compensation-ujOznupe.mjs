import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-B8Fpsbpq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as ChevronRight, J as Coins, i as Plus, a$ as Coffee, b0 as Truck, b1 as Gift, S as Search, ax as FileSpreadsheet, P as Printer, d as FileText, ar as Pencil, ap as Trash2, X } from "../_libs/lucide-react.mjs";
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
const DEFAULT_ALLOWANCES = [{
  sl: 1,
  company: "Pakiza Knit Composite Ltd",
  area: "Factory",
  applicableFrom: "2026-01-01",
  applicableTo: "2026-12-31",
  employeeType: "ALL",
  department: "All Departments",
  subDepartment: "ALL",
  designation: "ALL",
  workingHourFrom: "08:00",
  workingHourTo: "17:00",
  salaryFrom: 1e4,
  salaryTo: 1e5,
  rateFor: "Holiday",
  basedOn: "Basic",
  rate: 1.5,
  divByHour: "Yes",
  getAfterReq: "No",
  getAfterReqRate: 0,
  eotAfter: 0,
  lunch: 0,
  dinner: 0,
  isActive: "Active"
}];
const DEFAULT_TIFFIN = [{
  sl: 1,
  employeeType: "ALL",
  rate: 50,
  isActive: "Active"
}];
const DEFAULT_LUNCH = [{
  sl: 1,
  employeeType: "ALL",
  rate: 80,
  isActive: "Active"
}];
const DEFAULT_CONVEYANCE = [{
  sl: 1,
  employeeType: "ALL",
  amount: 1500,
  isActive: "Active"
}];
const DEFAULT_BONUSES = [{
  sl: 1,
  employeeType: "ALL",
  daysFrom: 180,
  daysTo: 365,
  basedOn: "Basic",
  bonusPercent: 50,
  isActive: "Active"
}];
function CompensationSetupPage() {
  const [activeTab, setActiveTab] = reactExports.useState("allowance");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [allowances, setAllowances] = reactExports.useState([]);
  const [tiffinRates, setTiffinRates] = reactExports.useState([]);
  const [lunchRates, setLunchRates] = reactExports.useState([]);
  const [conveyances, setConveyances] = reactExports.useState([]);
  const [bonuses, setBonuses] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["allowance", "tiffin", "lunch", "conveyance", "bonus"].includes(tabParam)) {
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
    const allowancesData = safeParse("hris_allowance_rates", DEFAULT_ALLOWANCES);
    setAllowances(allowancesData);
    localStorage.setItem("hris_allowance_rates", JSON.stringify(allowancesData));
    const tiffinData = safeParse("hris_tiffin_rates", DEFAULT_TIFFIN);
    setTiffinRates(tiffinData);
    localStorage.setItem("hris_tiffin_rates", JSON.stringify(tiffinData));
    const lunchData = safeParse("hris_lunch_rates", DEFAULT_LUNCH);
    setLunchRates(lunchData);
    localStorage.setItem("hris_lunch_rates", JSON.stringify(lunchData));
    const conveyanceData = safeParse("hris_conveyance_setups", DEFAULT_CONVEYANCE);
    setConveyances(conveyanceData);
    localStorage.setItem("hris_conveyance_setups", JSON.stringify(conveyanceData));
    const bonusesData = safeParse("hris_bonus_settings", DEFAULT_BONUSES);
    setBonuses(bonusesData);
    localStorage.setItem("hris_bonus_settings", JSON.stringify(bonusesData));
  }, []);
  const [isFormOpen, setIsFormOpen] = reactExports.useState(false);
  const [editSl, setEditSl] = reactExports.useState(null);
  const [company, setCompany] = reactExports.useState("");
  const [area, setArea] = reactExports.useState("");
  const [applicableFrom, setApplicableFrom] = reactExports.useState("");
  const [applicableTo, setApplicableTo] = reactExports.useState("");
  const [employeeType, setEmployeeType] = reactExports.useState("ALL");
  const [department, setDepartment] = reactExports.useState("All Departments");
  const [subDepartment, setSubDepartment] = reactExports.useState("");
  const [designation, setDesignation] = reactExports.useState("ALL");
  const [workingHourFrom, setWorkingHourFrom] = reactExports.useState("");
  const [workingHourTo, setWorkingHourTo] = reactExports.useState("");
  const [salaryFrom, setSalaryFrom] = reactExports.useState(0);
  const [salaryTo, setSalaryTo] = reactExports.useState(0);
  const [rateFor, setRateFor] = reactExports.useState("");
  const [basedOn, setBasedOn] = reactExports.useState("--Select--");
  const [rate, setRate] = reactExports.useState(0);
  const [divByHour, setDivByHour] = reactExports.useState("");
  const [getAfterReq, setGetAfterReq] = reactExports.useState("No");
  const [getAfterReqRate, setGetAfterReqRate] = reactExports.useState(0);
  const [eotAfter, setEotAfter] = reactExports.useState(0);
  const [lunch, setLunch] = reactExports.useState(0);
  const [dinner, setDinner] = reactExports.useState(0);
  const [allowanceIsActive, setAllowanceIsActive] = reactExports.useState("Active");
  const [tiffinEmpType, setTiffinEmpType] = reactExports.useState("ALL");
  const [tiffinRateVal, setTiffinRateVal] = reactExports.useState(50);
  const [tiffinIsActive, setTiffinIsActive] = reactExports.useState("Active");
  const [lunchEmpType, setLunchEmpType] = reactExports.useState("ALL");
  const [lunchRateVal, setLunchRateVal] = reactExports.useState(80);
  const [lunchIsActive, setLunchIsActive] = reactExports.useState("Active");
  const [convEmpType, setConvEmpType] = reactExports.useState("ALL");
  const [convAmount, setConvAmount] = reactExports.useState(1500);
  const [convIsActive, setConvIsActive] = reactExports.useState("Active");
  const [bonusEmpType, setBonusEmpType] = reactExports.useState("ALL");
  const [bonusDaysFrom, setBonusDaysFrom] = reactExports.useState(180);
  const [bonusDaysTo, setBonusDaysTo] = reactExports.useState(365);
  const [bonusBasedOn, setBonusBasedOn] = reactExports.useState("Basic");
  const [bonusPercent, setBonusPercent] = reactExports.useState(50);
  const [bonusIsActive, setBonusIsActive] = reactExports.useState("Active");
  const openForm = (sl) => {
    setEditSl(sl);
    if (activeTab === "allowance") {
      const item = allowances.find((a) => a.sl === sl);
      setCompany(item?.company || "Pakiza Knit Composite Ltd");
      setArea(item?.area || "Factory");
      setApplicableFrom(item?.applicableFrom || "");
      setApplicableTo(item?.applicableTo || "");
      setEmployeeType(item?.employeeType || "ALL");
      setDepartment(item?.department || "All Departments");
      setSubDepartment(item?.subDepartment || "ALL");
      setDesignation(item?.designation || "ALL");
      setWorkingHourFrom(item?.workingHourFrom || "");
      setWorkingHourTo(item?.workingHourTo || "");
      setSalaryFrom(item?.salaryFrom || 0);
      setSalaryTo(item?.salaryTo || 0);
      setRateFor(item?.rateFor || "");
      setBasedOn(item?.basedOn || "--Select--");
      setRate(item?.rate || 0);
      setDivByHour(item?.divByHour || "");
      setGetAfterReq(item?.getAfterReq || "No");
      setGetAfterReqRate(item?.getAfterReqRate || 0);
      setEotAfter(item?.eotAfter || 0);
      setLunch(item?.lunch || 0);
      setDinner(item?.dinner || 0);
      setAllowanceIsActive(item?.isActive || "Active");
    } else if (activeTab === "tiffin") {
      const item = tiffinRates.find((t) => t.sl === sl);
      setTiffinEmpType(item?.employeeType || "ALL");
      setTiffinRateVal(item?.rate || 50);
      setTiffinIsActive(item?.isActive || "Active");
    } else if (activeTab === "lunch") {
      const item = lunchRates.find((l) => l.sl === sl);
      setLunchEmpType(item?.employeeType || "ALL");
      setLunchRateVal(item?.rate || 80);
      setLunchIsActive(item?.isActive || "Active");
    } else if (activeTab === "conveyance") {
      const item = conveyances.find((c) => c.sl === sl);
      setConvEmpType(item?.employeeType || "ALL");
      setConvAmount(item?.amount || 1500);
      setConvIsActive(item?.isActive || "Active");
    } else if (activeTab === "bonus") {
      const item = bonuses.find((b) => b.sl === sl);
      setBonusEmpType(item?.employeeType || "ALL");
      setBonusDaysFrom(item?.daysFrom || 180);
      setBonusDaysTo(item?.daysTo || 365);
      setBonusBasedOn(item?.basedOn || "Basic");
      setBonusPercent(item?.bonusPercent || 50);
      setBonusIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };
  const handleDelete = (sl) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    if (activeTab === "allowance") {
      const updated = allowances.filter((a) => a.sl !== sl).map((a, idx) => ({
        ...a,
        sl: idx + 1
      }));
      setAllowances(updated);
      localStorage.setItem("hris_allowance_rates", JSON.stringify(updated));
    } else if (activeTab === "tiffin") {
      const updated = tiffinRates.filter((t) => t.sl !== sl).map((t, idx) => ({
        ...t,
        sl: idx + 1
      }));
      setTiffinRates(updated);
      localStorage.setItem("hris_tiffin_rates", JSON.stringify(updated));
    } else if (activeTab === "lunch") {
      const updated = lunchRates.filter((l) => l.sl !== sl).map((l, idx) => ({
        ...l,
        sl: idx + 1
      }));
      setLunchRates(updated);
      localStorage.setItem("hris_lunch_rates", JSON.stringify(updated));
    } else if (activeTab === "conveyance") {
      const updated = conveyances.filter((c) => c.sl !== sl).map((c, idx) => ({
        ...c,
        sl: idx + 1
      }));
      setConveyances(updated);
      localStorage.setItem("hris_conveyance_setups", JSON.stringify(updated));
    } else if (activeTab === "bonus") {
      const updated = bonuses.filter((b) => b.sl !== sl).map((b, idx) => ({
        ...b,
        sl: idx + 1
      }));
      setBonuses(updated);
      localStorage.setItem("hris_bonus_settings", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "allowance") {
      if (!company || !applicableFrom || !applicableTo) {
        toast.error("Required fields must be filled.");
        return;
      }
      let nextList = [...allowances];
      if (editSl !== null) {
        nextList = allowances.map((a) => a.sl === editSl ? {
          ...a,
          company,
          area,
          applicableFrom,
          applicableTo,
          employeeType,
          department,
          subDepartment,
          designation,
          workingHourFrom,
          workingHourTo,
          salaryFrom: Number(salaryFrom),
          salaryTo: Number(salaryTo),
          rateFor,
          basedOn,
          rate: Number(rate),
          divByHour,
          getAfterReq,
          getAfterReqRate: Number(getAfterReqRate),
          eotAfter: Number(eotAfter),
          lunch: Number(lunch),
          dinner: Number(dinner),
          isActive: allowanceIsActive
        } : a);
      } else {
        const sl = allowances.length > 0 ? Math.max(...allowances.map((a) => a.sl)) + 1 : 1;
        nextList.push({
          sl,
          company,
          area,
          applicableFrom,
          applicableTo,
          employeeType,
          department,
          subDepartment,
          designation,
          workingHourFrom,
          workingHourTo,
          salaryFrom: Number(salaryFrom),
          salaryTo: Number(salaryTo),
          rateFor,
          basedOn,
          rate: Number(rate),
          divByHour,
          getAfterReq,
          getAfterReqRate: Number(getAfterReqRate),
          eotAfter: Number(eotAfter),
          lunch: Number(lunch),
          dinner: Number(dinner),
          isActive: allowanceIsActive
        });
      }
      setAllowances(nextList);
      localStorage.setItem("hris_allowance_rates", JSON.stringify(nextList));
    } else if (activeTab === "tiffin") {
      let nextList = [...tiffinRates];
      if (editSl !== null) {
        nextList = tiffinRates.map((t) => t.sl === editSl ? {
          ...t,
          employeeType: tiffinEmpType,
          rate: Number(tiffinRateVal),
          isActive: tiffinIsActive
        } : t);
      } else {
        const sl = tiffinRates.length > 0 ? Math.max(...tiffinRates.map((t) => t.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: tiffinEmpType,
          rate: Number(tiffinRateVal),
          isActive: tiffinIsActive
        });
      }
      setTiffinRates(nextList);
      localStorage.setItem("hris_tiffin_rates", JSON.stringify(nextList));
    } else if (activeTab === "lunch") {
      let nextList = [...lunchRates];
      if (editSl !== null) {
        nextList = lunchRates.map((l) => l.sl === editSl ? {
          ...l,
          employeeType: lunchEmpType,
          rate: Number(lunchRateVal),
          isActive: lunchIsActive
        } : l);
      } else {
        const sl = lunchRates.length > 0 ? Math.max(...lunchRates.map((l) => l.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: lunchEmpType,
          rate: Number(lunchRateVal),
          isActive: lunchIsActive
        });
      }
      setLunchRates(nextList);
      localStorage.setItem("hris_lunch_rates", JSON.stringify(nextList));
    } else if (activeTab === "conveyance") {
      let nextList = [...conveyances];
      if (editSl !== null) {
        nextList = conveyances.map((c) => c.sl === editSl ? {
          ...c,
          employeeType: convEmpType,
          amount: Number(convAmount),
          isActive: convIsActive
        } : c);
      } else {
        const sl = conveyances.length > 0 ? Math.max(...conveyances.map((c) => c.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: convEmpType,
          amount: Number(convAmount),
          isActive: convIsActive
        });
      }
      setConveyances(nextList);
      localStorage.setItem("hris_conveyance_setups", JSON.stringify(nextList));
    } else if (activeTab === "bonus") {
      let nextList = [...bonuses];
      if (editSl !== null) {
        nextList = bonuses.map((b) => b.sl === editSl ? {
          ...b,
          employeeType: bonusEmpType,
          daysFrom: Number(bonusDaysFrom),
          daysTo: Number(bonusDaysTo),
          basedOn: bonusBasedOn,
          bonusPercent: Number(bonusPercent),
          isActive: bonusIsActive
        } : b);
      } else {
        const sl = bonuses.length > 0 ? Math.max(...bonuses.map((b) => b.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: bonusEmpType,
          daysFrom: Number(bonusDaysFrom),
          daysTo: Number(bonusDaysTo),
          basedOn: bonusBasedOn,
          bonusPercent: Number(bonusPercent),
          isActive: bonusIsActive
        });
      }
      setBonuses(nextList);
      localStorage.setItem("hris_bonus_settings", JSON.stringify(nextList));
    }
    toast.success("Saved successfully");
    setIsFormOpen(false);
  };
  const insetWrapperClass = "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass = "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";
  const tabsList = [{
    type: "allowance",
    label: "Allowance Rate",
    icon: Coins
  }, {
    type: "tiffin",
    label: "Tiffin Rate",
    icon: Coffee
  }, {
    type: "lunch",
    label: "Lunch Rate",
    icon: Coffee
  }, {
    type: "conveyance",
    label: "Conveyance Setup",
    icon: Truck
  }, {
    type: "bonus",
    label: "Bonus Setting",
    icon: Gift
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Allowances & Bonuses" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "size-5.5 text-primary" }),
              "Compensation Configuration"
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
          activeTab === "allowance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "1800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "SL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Applicable From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Applicable To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px]", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px]", children: "Sub Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px]", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Working Hours From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Working Hours To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[110px] text-right", children: "Salary From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[110px] text-right", children: "Salary To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px]", children: "Rate For" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[110px]", children: "Based On" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Div By Hour" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Get After Req" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "EOT After" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Lunch" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[100px] text-center", children: "Dinner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: allowances.filter((a) => (a.company || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.applicableFrom }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.applicableTo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.employeeType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200", children: item.department }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300", children: item.subDepartment || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200", children: item.designation }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.workingHourFrom || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.workingHourTo || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: item.salaryFrom }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: item.salaryTo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.rateFor || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.basedOn }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.rate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.divByHour || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal", children: item.getAfterReq }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.getAfterReqRate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.eotAfter }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.lunch }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.dinner }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "tiffin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px] text-right", children: "Tiffin Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: tiffinRates.filter((t) => (t.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.employeeType }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: [
                item.rate,
                " BDT"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "lunch" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px] text-right", children: "Lunch Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: lunchRates.filter((l) => (l.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.employeeType }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: [
                item.rate,
                " BDT"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "conveyance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "800px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[300px]", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px] text-right", children: "Conveyance Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: conveyances.filter((c) => (c.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.employeeType }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-normal font-mono", children: [
                item.amount,
                " BDT"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] }),
          activeTab === "bonus" && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse whitespace-nowrap", style: {
            minWidth: "900px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 min-w-[200px]", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Days From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Days To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[150px]", children: "Based On" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "Bonus (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 w-[120px] text-center", children: "IsActive" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-foreground", children: bonuses.filter((b) => (b.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openForm(item.sl), className: "text-orange-500 hover:text-orange-600 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(item.sl), className: "text-red-500 hover:text-red-650 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100", children: item.employeeType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.daysFrom }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: item.daysTo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-normal", children: item.basedOn }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-center font-normal font-mono", children: [
                item.bonusPercent,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`, children: item.isActive }) })
            ] }, item.sl)) })
          ] })
        ] }) })
      ] }),
      isFormOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-black tracking-tight text-foreground", children: [
              editSl ? "Update" : "Create",
              " ",
              tabsList.find((t) => t.type === activeTab)?.label
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsFormOpen(false), className: "size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-4", children: [
          activeTab === "allowance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Company *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: company, onChange: (e) => setCompany(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Area *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: area, onChange: (e) => setArea(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Applicable From *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: applicableFrom, onChange: (e) => setApplicableFrom(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Applicable To *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: applicableTo, onChange: (e) => setApplicableTo(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: employeeType, onChange: (e) => setEmployeeType(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: department, onChange: (e) => setDepartment(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: subDepartment, onChange: (e) => setSubDepartment(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: designation, onChange: (e) => setDesignation(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Working Hour From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: workingHourFrom, onChange: (e) => setWorkingHourFrom(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Working Hour To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: workingHourTo, onChange: (e) => setWorkingHourTo(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Salary From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: salaryFrom, onChange: (e) => setSalaryFrom(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Salary To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: salaryTo, onChange: (e) => setSalaryTo(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Rate For" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: rateFor, onChange: (e) => setRateFor(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Based On" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: basedOn, onChange: (e) => setBasedOn(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "--Select--", children: "--Select--" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Basic", children: "Basic" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Gross", children: "Gross" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Flat", children: "Flat" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", value: rate, onChange: (e) => setRate(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Div By Hour" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: divByHour, onChange: (e) => setDivByHour(e.target.value), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Get After Reguler" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: getAfterReq, onChange: (e) => setGetAfterReq(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: getAfterReqRate, onChange: (e) => setGetAfterReqRate(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "EOT After" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: eotAfter, onChange: (e) => setEotAfter(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Lunch Break" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: lunch, onChange: (e) => setLunch(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Dinner Break" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: dinner, onChange: (e) => setDinner(Number(e.target.value)), className: insetInputClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: allowanceIsActive, onChange: (e) => setAllowanceIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "tiffin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: tiffinEmpType, onChange: (e) => setTiffinEmpType(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Tiffin Rate (BDT) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: tiffinRateVal, onChange: (e) => setTiffinRateVal(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: tiffinIsActive, onChange: (e) => setTiffinIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "lunch" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: lunchEmpType, onChange: (e) => setLunchEmpType(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Lunch Rate (BDT) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: lunchRateVal, onChange: (e) => setLunchRateVal(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: lunchIsActive, onChange: (e) => setLunchIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "conveyance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: convEmpType, onChange: (e) => setConvEmpType(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Conveyance Amount (BDT) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: convAmount, onChange: (e) => setConvAmount(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: convIsActive, onChange: (e) => setConvIsActive(e.target.value), className: insetSelectClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
              ] })
            ] })
          ] }),
          activeTab === "bonus" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Employee Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: bonusEmpType, onChange: (e) => setBonusEmpType(e.target.value), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Days From *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: bonusDaysFrom, onChange: (e) => setBonusDaysFrom(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Days To *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: bonusDaysTo, onChange: (e) => setBonusDaysTo(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Based On *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: bonusBasedOn, onChange: (e) => setBonusBasedOn(e.target.value), className: insetSelectClass, required: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Basic", children: "Basic" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Gross", children: "Gross" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Flat", children: "Flat" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "Bonus (%) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: bonusPercent, onChange: (e) => setBonusPercent(Number(e.target.value)), className: insetInputClass, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: insetWrapperClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: insetLabelClass, children: "IsActive *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: bonusIsActive, onChange: (e) => setBonusIsActive(e.target.value), className: insetSelectClass, children: [
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
  CompensationSetupPage as component
};
