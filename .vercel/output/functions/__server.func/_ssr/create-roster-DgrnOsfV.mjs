import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, e as CalendarDays, Y as ChevronDown } from "../_libs/lucide-react.mjs";
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
const rosterEmployees = [{
  id: "2023043910",
  name: "Tahmid Afsar Shapno",
  dept: "Business Innovation",
  type: "ALL",
  unit: "PSL",
  line: "N/A"
}, {
  id: "2016001055",
  name: "Md. Zahidul Islam",
  dept: "Management",
  type: "ALL",
  unit: "PSL",
  line: "Line-02"
}, {
  id: "2022035599",
  name: "Dipon Saha",
  dept: "Core Development (HR)",
  type: "ALL",
  unit: "PSL",
  line: "Line-03"
}, {
  id: "2025057309",
  name: "Bani Amin Jwel",
  dept: "Core Development (HR)",
  type: "ALL",
  unit: "PSL",
  line: "Line-01"
}, {
  id: "2021032646",
  name: "Sadiqul Islam",
  dept: "Core Sales",
  type: "ALL",
  unit: "PSL",
  line: "Line-02"
}];
const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function CreateRosterPage() {
  const [empIdsInput, setEmpIdsInput] = reactExports.useState("2023043910, 2016001055, 2022035599");
  const [selectedYear, setSelectedYear] = reactExports.useState("2026");
  const [selectedMonth, setSelectedMonth] = reactExports.useState("January");
  const [companyName, setCompanyName] = reactExports.useState("Pakiza Software Limited");
  const [areaName, setAreaName] = reactExports.useState("PSL-Head Office");
  const [employeeType, setEmployeeType] = reactExports.useState("ALL");
  const [subDept, setSubDept] = reactExports.useState("ALL");
  const [unit, setUnit] = reactExports.useState("ALL");
  const [line, setLine] = reactExports.useState("ALL");
  const [joiningFrom, setJoiningFrom] = reactExports.useState("");
  const [joiningTo, setJoiningTo] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("Working");
  const [targetDay, setTargetDay] = reactExports.useState(1);
  const [weekendDay, setWeekendDay] = reactExports.useState("Saturday");
  const [rosterMatrix, setRosterMatrix] = reactExports.useState(() => {
    const initial = {};
    rosterEmployees.forEach((emp) => {
      initial[emp.id] = Array(31).fill("W");
    });
    return initial;
  });
  const activeIds = reactExports.useMemo(() => {
    return empIdsInput.split(",").map((id) => id.trim()).filter((id) => id.length > 0);
  }, [empIdsInput]);
  const filteredEmployees = reactExports.useMemo(() => {
    return rosterEmployees.filter((emp) => {
      if (activeIds.length > 0 && !activeIds.includes(emp.id)) return false;
      if (subDept !== "ALL" && emp.dept !== subDept) return false;
      if (unit !== "ALL" && emp.unit !== unit) return false;
      if (line !== "ALL" && emp.line !== line) return false;
      return true;
    });
  }, [activeIds, subDept, unit, line]);
  const handleSetDayStatus = (statusType) => {
    const dayIdx = targetDay - 1;
    setRosterMatrix((prev) => {
      const next = {
        ...prev
      };
      filteredEmployees.forEach((emp) => {
        const empSchedule = [...next[emp.id] || Array(31).fill("W")];
        empSchedule[dayIdx] = statusType;
        next[emp.id] = empSchedule;
      });
      return next;
    });
  };
  const handleApplyWeekendHoliday = () => {
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear);
    const dayIndicesToUpdate = [];
    const dayMap = {
      "Sunday": 0,
      "Monday": 1,
      "Tuesday": 2,
      "Wednesday": 3,
      "Thursday": 4,
      "Friday": 5,
      "Saturday": 6
    };
    const targetDayIndex = dayMap[weekendDay] ?? 6;
    const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yearNum, monthIndex, d);
      if (dt.getDay() === targetDayIndex) {
        dayIndicesToUpdate.push(d - 1);
      }
    }
    setRosterMatrix((prev) => {
      const next = {
        ...prev
      };
      filteredEmployees.forEach((emp) => {
        const empSchedule = [...next[emp.id] || Array(31).fill("W")];
        dayIndicesToUpdate.forEach((idx) => {
          empSchedule[idx] = "H";
        });
        next[emp.id] = empSchedule;
      });
      return next;
    });
    alert(`Successfully applied Weekend Holiday (H) to all ${weekendDay}s in ${selectedMonth} ${selectedYear}!`);
  };
  const handleRosterHoliday = () => {
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear);
    const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
    const weekendIndices = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yearNum, monthIndex, d);
      if (dt.getDay() === 5 || dt.getDay() === 6) {
        weekendIndices.push(d - 1);
      }
    }
    setRosterMatrix((prev) => {
      const next = {
        ...prev
      };
      filteredEmployees.forEach((emp) => {
        const empSchedule = [...next[emp.id] || Array(31).fill("W")];
        weekendIndices.forEach((idx) => {
          empSchedule[idx] = "H";
        });
        next[emp.id] = empSchedule;
      });
      return next;
    });
    alert("Applied standard roster weekends (Friday & Saturday) as Holiday (H)!");
  };
  const handleDefaultHoliday = () => {
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear);
    const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
    const fridayIndices = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yearNum, monthIndex, d);
      if (dt.getDay() === 5) {
        fridayIndices.push(d - 1);
      }
    }
    setRosterMatrix((prev) => {
      const next = {
        ...prev
      };
      filteredEmployees.forEach((emp) => {
        const empSchedule = [...next[emp.id] || Array(31).fill("W")];
        fridayIndices.forEach((idx) => {
          empSchedule[idx] = "H";
        });
        next[emp.id] = empSchedule;
      });
      return next;
    });
    alert("Applied default weekend (Friday) as Holiday (H)!");
  };
  const handleUpdateRoster = () => {
    alert(`Roster configuration successfully saved & updated for ${filteredEmployees.length} employee(s) for the month of ${selectedMonth} ${selectedYear}!`);
  };
  const handleDeleteRoster = () => {
    if (confirm("Are you sure you want to discard this entire roster schedule configuration?")) {
      setRosterMatrix((prev) => {
        const next = {
          ...prev
        };
        filteredEmployees.forEach((emp) => {
          next[emp.id] = Array(31).fill("W");
        });
        return next;
      });
      alert("Roster configuration successfully reset!");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 xl:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/75", children: "Human Resource" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Employee Roster" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Employee Roster" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50", children: [
            "Month: ",
            selectedMonth,
            " ",
            selectedYear
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-12 gap-6 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-8 bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary", children: "Roster Generation boundaries" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground/50", children: "Left Controls" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Employee ID (Multiple)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: empIdsInput, onChange: (e) => setEmpIdsInput(e.target.value), placeholder: "use comma as separator", className: "w-full h-18 p-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary placeholder:text-muted-foreground/50 resize-none" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Year" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedYear, onChange: (e) => setSelectedYear(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer text-primary", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2024", children: "2024" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: selectedMonth, onChange: (e) => setSelectedMonth(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: monthsList.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Company Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: companyName, onChange: (e) => setCompanyName(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pakiza Software Limited", children: "Pakiza Software Limited" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pakiza Group", children: "Pakiza Group" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Area Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: areaName, onChange: (e) => setAreaName(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL-Head Office", children: "PSL-Head Office" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL-Factory Operations", children: "PSL-Factory Operations" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Employee Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: employeeType, onChange: (e) => setEmployeeType(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Permanent", children: "Permanent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Contractual", children: "Contractual" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Sub Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: subDept, onChange: (e) => setSubDept(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Accounts & Vat", children: "Accounts & Vat" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Development (HR)", children: "Core Development (HR)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Management", children: "Management" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Sales", children: "Core Sales" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Unit" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: unit, onChange: (e) => setUnit(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL", children: "PSL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PTVL", children: "PTVL" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Line" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: line, onChange: (e) => setLine(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Line-01", children: "Line-01" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Line-02", children: "Line-02" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Line-03", children: "Line-03" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Joining From" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: joiningFrom, onChange: (e) => setJoiningFrom(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Joining To" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: joiningTo, onChange: (e) => setJoiningTo(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Working", children: "Working" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Resigned", children: "Resigned" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRosterHoliday, className: "h-8 px-4 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-[10px] rounded-lg tracking-wider uppercase shadow-xs transition", children: "ROSTER HOLIDAY" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleDefaultHoliday, className: "h-8 px-4 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-[10px] rounded-lg tracking-wider uppercase shadow-xs transition", children: "DEFAULT HOLIDAY" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-4 bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary", children: "Day & Weekend Overrides" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground/50", children: "Right Controls" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase block", children: "Select A Day(1-31)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: targetDay, onChange: (e) => setTargetDay(parseInt(e.target.value)), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary appearance-none pr-8 cursor-pointer text-primary", children: Array.from({
                  length: 31
                }, (_, i) => i + 1).map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: day, children: day }, day)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleSetDayStatus("GH"), className: "flex-1 h-8 bg-[#c2db42] hover:bg-[#b5cc38] text-slate-800 font-extrabold text-[10px] rounded-md transition uppercase tracking-wider", children: "GH" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleSetDayStatus("H"), className: "flex-1 h-8 bg-[#c2db42] hover:bg-[#b5cc38] text-slate-800 font-extrabold text-[10px] rounded-md transition uppercase tracking-wider", children: "H" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleSetDayStatus("W"), className: "flex-1 h-8 bg-[#f57c00] hover:bg-[#e65100] text-white font-extrabold text-[10px] rounded-md transition uppercase tracking-wider", children: "CLEAN" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase block", children: "Select A Weekend" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: weekendDay, onChange: (e) => setWeekendDay(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: day, children: day }, day)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleApplyWeekendHoliday, className: "h-9 px-4 bg-[#c2db42] hover:bg-[#b5cc38] text-slate-800 font-extrabold text-[10px] rounded-md transition uppercase tracking-wider", children: "H" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary", children: "Roster Schedule Matrix" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground/60", children: "Dynamic Live View (1-31)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/50 rounded-xl max-h-[50vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[10px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 font-extrabold w-24 border-r border-border/30 text-center", children: "Emp ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 font-extrabold w-36 border-r border-border/30", children: "Employee Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 font-extrabold w-28 border-r border-border/30", children: "Sub Dept" }),
              Array.from({
                length: 31
              }, (_, i) => i + 1).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 font-extrabold text-center w-8 border-r border-border/30", children: d }, d))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30", children: [
              filteredEmployees.map((emp) => {
                const schedule = rosterMatrix[emp.id] || Array(31).fill("W");
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-75 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-bold font-mono text-center text-foreground border-r border-border/20", children: emp.id }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-bold text-foreground/80 border-r border-border/20", children: emp.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground border-r border-border/20", children: emp.dept }),
                  schedule.map((dayStatus, idx) => {
                    let cellColorClass = "bg-muted text-muted-foreground/60";
                    if (dayStatus === "H") {
                      cellColorClass = "bg-rose-500/25 text-rose-700 dark:text-rose-400 font-black";
                    } else if (dayStatus === "GH") {
                      cellColorClass = "bg-[#c2db42]/30 text-slate-800 dark:text-slate-200 font-black";
                    }
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-1 border-r border-border/20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => {
                      setRosterMatrix((prev) => {
                        const next = {
                          ...prev
                        };
                        const sch = [...next[emp.id] || Array(31).fill("W")];
                        const curr = sch[idx];
                        let nextStatus = "W";
                        if (curr === "W") nextStatus = "H";
                        else if (curr === "H") nextStatus = "GH";
                        sch[idx] = nextStatus;
                        next[emp.id] = sch;
                        return next;
                      });
                    }, className: `w-6 h-6 rounded flex items-center justify-center font-bold text-[9px] shadow-xs cursor-pointer select-none transition ${cellColorClass}`, children: dayStatus }) }, idx);
                  })
                ] }, emp.id);
              }),
              filteredEmployees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 35, className: "px-4 py-12 text-center text-muted-foreground font-semibold", children: "No employees found matching these boundaries. Use comma separator in ID panel to active employees." }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleUpdateRoster, className: "h-9 px-6 bg-[#ab47bc] hover:bg-[#9c27b0] text-white font-extrabold text-xs rounded-md shadow-sm transition uppercase tracking-wider", children: "UPDATE ROSTER" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleDeleteRoster, className: "h-9 px-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-md shadow-sm transition uppercase tracking-wider", children: "DELETE ROSTER" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  CreateRosterPage as component
};
