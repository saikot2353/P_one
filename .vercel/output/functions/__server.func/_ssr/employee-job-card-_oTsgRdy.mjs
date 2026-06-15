import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, w as FingerprintPattern, X, ax as FileSpreadsheet, P as Printer, ay as FileDown, S as Search, g as ChevronLeft, Y as ChevronDown, a5 as Check } from "../_libs/lucide-react.mjs";
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
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className = ""
}) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const containerRef = reactExports.useRef(null);
  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()) || o.value.toLowerCase().includes(search.toLowerCase()));
  reactExports.useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: `relative w-full ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
      setIsOpen(!isOpen);
      setSearch("");
    }, className: "w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold flex items-center justify-between text-left focus:border-[#1e88e5] hover:bg-muted/80 transition duration-150 cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-foreground font-bold", children: selectedOption ? selectedOption.label : placeholder }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}` })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-50 w-full mt-1.5 bg-card border border-border rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 border-b border-border/30 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", autoFocus: true, value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search...", className: "w-full h-8 pl-8 pr-3 bg-muted/60 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded-lg outline-none text-xs font-bold transition font-sans" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-y-auto p-1 divide-y divide-border/10 font-sans text-xs", children: filteredOptions.length > 0 ? filteredOptions.map((option) => {
        const isSelected = option.value === value;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          onChange(option.value);
          setIsOpen(false);
        }, className: `w-full px-3 py-2 text-left rounded-lg transition duration-100 flex items-center justify-between font-bold ${isSelected ? "bg-[#1e88e5]/10 text-[#1e88e5]" : "text-foreground/80 hover:bg-muted/80 hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: option.label }),
          isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3 text-[#1e88e5]" })
        ] }, option.value);
      }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2.5 text-center text-muted-foreground text-[11px] font-medium", children: "No matching options found" }) })
    ] })
  ] });
}
const employeeDb = {
  "2023043910": {
    name: "Tahmid Afsar Shapno",
    type: "Permanent",
    subDept: "Business Innovation",
    jobTitle: "Asst. Manager",
    unit: "PSL",
    shift: "General Shift",
    shiftStartDate: "01/08/2023",
    defaultHoliday: "Friday"
  },
  "2016001055": {
    name: "Md. Zahidul Islam",
    type: "Permanent",
    subDept: "Management",
    jobTitle: "Chief Operating Officer",
    unit: "PSL",
    shift: "General Shift",
    shiftStartDate: "15/03/2016",
    defaultHoliday: "Friday"
  },
  "2022035599": {
    name: "Dipon Saha",
    type: "Permanent",
    subDept: "Core Development (HR)",
    jobTitle: "Manager",
    unit: "PTVL",
    shift: "Exe-Ptvl Shift",
    shiftStartDate: "10/05/2022",
    defaultHoliday: "Friday"
  }
};
const generateAttendanceData = (empId, month, year) => {
  const emp = employeeDb[empId] || {
    name: "Unknown Employee",
    shift: "General Shift"
  };
  const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const logs = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${String(day).padStart(2, "0")}/${String(monthIndex + 1).padStart(2, "0")}/${year}`;
    const dateObj = new Date(year, monthIndex, day);
    const isHoliday = dateObj.getDay() === 5;
    if (isHoliday) {
      logs.push({
        empId,
        empName: emp.name,
        date: dateStr,
        outDate: "",
        inTime: "",
        outTime: "",
        overtime: "0.00",
        shift: emp.shift,
        status: "Holiday"
      });
    } else if (day === 21 || day === 22) {
      logs.push({
        empId,
        empName: emp.name,
        date: dateStr,
        outDate: "N/A",
        inTime: "N/A",
        outTime: "N/A",
        overtime: "0.00",
        shift: emp.shift,
        status: "CL"
      });
    } else {
      const inHr = 8 + (day % 3 === 0 ? 2 : 0) + (day % 5 === 0 ? 1 : 0);
      const inMin = Math.floor(20 + day * 7 % 39);
      const inSec = Math.floor(10 + day * 13 % 49);
      const inTimeStr = `${String(inHr).padStart(2, "0")}:${String(inMin).padStart(2, "0")}:${String(inSec).padStart(2, "0")}`;
      const isEarlyDay = day % 7 === 0;
      const outHr = isEarlyDay ? 17 : 18 + (day % 4 === 0 ? 1 : 0) + (day % 6 === 0 ? 2 : 0);
      const outMin = isEarlyDay ? Math.floor(10 + day * 9 % 30) : Math.floor(10 + day * 9 % 45);
      const outSec = Math.floor(10 + day * 17 % 49);
      const outTimeStr = `${String(outHr).padStart(2, "0")}:${String(outMin).padStart(2, "0")}:${String(outSec).padStart(2, "0")}`;
      let ot = "0.00";
      if (!isEarlyDay && outHr >= 19) {
        ot = `${outHr - 18}.00`;
      }
      logs.push({
        empId,
        empName: emp.name,
        date: dateStr,
        outDate: dateStr,
        inTime: inTimeStr,
        outTime: outTimeStr,
        overtime: ot,
        shift: emp.shift,
        status: "Present"
      });
    }
  }
  return logs;
};
function EmployeeJobCardPage() {
  const [selectedMonths, setSelectedMonths] = reactExports.useState(["Jan"]);
  const [selectedYear, setSelectedYear] = reactExports.useState(2026);
  const [selectedCompany, setSelectedCompany] = reactExports.useState("Pakiza Software Limited");
  const [selectedArea, setSelectedArea] = reactExports.useState("PSL-Head Office");
  const [selectedType, setSelectedType] = reactExports.useState("Actual");
  const [activeEmpId, setActiveEmpId] = reactExports.useState("2023043910");
  const [multiEmpIds, setMultiEmpIds] = reactExports.useState(["2023043910"]);
  const [isRuntimeCal, setIsRuntimeCal] = reactExports.useState(false);
  const [shiftInThreshold, setShiftInThreshold] = reactExports.useState("09:00");
  const [shiftOutThreshold, setShiftOutThreshold] = reactExports.useState("18:00");
  const [renderedLogs, setRenderedLogs] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const itemsPerPage = 31;
  const yearOptions = reactExports.useMemo(() => [{
    value: "2026",
    label: "2026"
  }, {
    value: "2025",
    label: "2025"
  }, {
    value: "2024",
    label: "2024"
  }], []);
  const companyOptions = reactExports.useMemo(() => [{
    value: "Pakiza Software Limited",
    label: "Pakiza Software Limited"
  }, {
    value: "Pakiza Group",
    label: "Pakiza Group"
  }], []);
  const areaOptions = reactExports.useMemo(() => [{
    value: "PSL-Head Office",
    label: "PSL-Head Office"
  }, {
    value: "PSL-Factory Operations",
    label: "PSL-Factory Operations"
  }], []);
  const typeOptions = reactExports.useMemo(() => [{
    value: "Actual",
    label: "Actual"
  }, {
    value: "Standard",
    label: "Standard"
  }], []);
  const employeeOptions = reactExports.useMemo(() => {
    return Object.keys(employeeDb).map((id) => ({
      value: id,
      label: `${id} - ${employeeDb[id].name}`
    }));
  }, []);
  const addEmployeeOptions = reactExports.useMemo(() => {
    return Object.keys(employeeDb).filter((id) => !multiEmpIds.includes(id)).map((id) => ({
      value: id,
      label: `${id} - ${employeeDb[id].name}`
    }));
  }, [multiEmpIds]);
  const handleTimeChange = (empId, date, field, value) => {
    setRenderedLogs((prev) => prev.map((row) => {
      if (row.empId === empId && row.date === date) {
        return {
          ...row,
          [field]: value
        };
      }
      return row;
    }));
  };
  const activeEmpMetadata = reactExports.useMemo(() => {
    return employeeDb[activeEmpId] || {
      name: "N/A",
      type: "N/A",
      subDept: "N/A",
      jobTitle: "N/A",
      unit: "N/A",
      shift: "N/A",
      shiftStartDate: "N/A",
      defaultHoliday: "N/A"
    };
  }, [activeEmpId]);
  reactExports.useEffect(() => {
    handleGetLogs();
  }, []);
  const handleGetLogs = () => {
    const allLogs = [];
    multiEmpIds.forEach((empId) => {
      selectedMonths.forEach((m) => {
        allLogs.push(...generateAttendanceData(empId, m, selectedYear));
      });
    });
    setRenderedLogs(allLogs);
    setCurrentPage(1);
  };
  const handleAddEmployee = (id) => {
    const cleanId = id.trim();
    if (cleanId && !multiEmpIds.includes(cleanId)) {
      setMultiEmpIds((prev) => [...prev, cleanId]);
    }
  };
  const handleRemoveEmployee = (id) => {
    if (multiEmpIds.length > 1) {
      setMultiEmpIds((prev) => prev.filter((item) => item !== id));
      if (activeEmpId === id) {
        const remaining = multiEmpIds.filter((item) => item !== id);
        setActiveEmpId(remaining[0]);
      }
    } else {
      alert("At least one employee must be selected!");
    }
  };
  const toggleMonth = (m) => {
    setSelectedMonths((prev) => {
      if (prev.includes(m)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== m);
      } else {
        return [...prev, m];
      }
    });
  };
  const filteredRows = reactExports.useMemo(() => {
    return renderedLogs.filter((row) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return row.empId.includes(q) || row.empName.toLowerCase().includes(q) || row.date.includes(q) || row.status.toLowerCase().includes(q);
    });
  }, [renderedLogs, searchQuery]);
  const stats = reactExports.useMemo(() => {
    let present = 0;
    let holidays = 0;
    let leaves = 0;
    let totalOt = 0;
    let lateCount = 0;
    let earlyLeaveCount = 0;
    filteredRows.forEach((r) => {
      let activeStatus = r.status;
      if (isRuntimeCal && r.status === "Present") {
        const thresholdIn = shiftInThreshold + ":00";
        const thresholdOut = shiftOutThreshold + ":00";
        const inTime = r.inTime;
        const outTime = r.outTime;
        if (inTime && outTime && inTime !== "N/A" && outTime !== "N/A") {
          const isLate = inTime > thresholdIn;
          const isEarly = outTime < thresholdOut;
          if (isLate && isEarly) {
            activeStatus = "Late & Early";
          } else if (isLate) {
            activeStatus = "Late";
          } else if (isEarly) {
            activeStatus = "Early Leave";
          }
        }
      }
      if (activeStatus === "Present") present++;
      if (activeStatus === "Holiday") holidays++;
      if (activeStatus === "CL") leaves++;
      if (activeStatus === "Late") {
        lateCount++;
        present++;
      }
      if (activeStatus === "Early Leave") {
        earlyLeaveCount++;
        present++;
      }
      if (activeStatus === "Late & Early") {
        lateCount++;
        earlyLeaveCount++;
        present++;
      }
      totalOt += parseFloat(r.overtime || "0");
    });
    return {
      present,
      holidays,
      leaves,
      totalOt: totalOt.toFixed(2),
      lateCount,
      earlyLeaveCount
    };
  }, [filteredRows, isRuntimeCal, shiftInThreshold, shiftOutThreshold]);
  const paginatedRows = reactExports.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, currentPage]);
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage) || 1;
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 xl:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/75", children: "Human Resource" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Employee Job Card" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Employee Job Card" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50", children: [
            "Selected: ",
            multiEmpIds.length,
            " Emps / ",
            selectedMonths.length,
            " Months"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/85 p-6 shadow-sm space-y-6 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary", children: "Job Card Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground/50", children: "Filter Boundary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block", children: "Select Months (Multi)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 p-1.5 bg-muted/50 dark:bg-slate-900/40 rounded-xl border border-border/40", children: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => {
                  const isSelected = selectedMonths.includes(m);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleMonth(m), className: `px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-150 ${isSelected ? "bg-[#1e88e5] text-white shadow-sm" : "hover:bg-card text-muted-foreground"}`, children: m }, m);
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Year" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { options: yearOptions, value: selectedYear.toString(), onChange: (val) => setSelectedYear(parseInt(val)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Company" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { options: companyOptions, value: selectedCompany, onChange: setSelectedCompany })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Area Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { options: areaOptions, value: selectedArea, onChange: setSelectedArea })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Active Selected Employees (Multi)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-12 p-2 bg-muted/30 dark:bg-slate-900/30 rounded-xl border border-border/40 flex flex-wrap gap-2 items-center", children: [
                  multiEmpIds.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 hover:bg-primary/15", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      id,
                      " (",
                      employeeDb[id]?.name || "N/A",
                      ")"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemoveEmployee(id), className: "hover:text-red-500 font-bold ml-1 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }) })
                  ] }, id)),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative inline-block w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { options: addEmployeeOptions, value: "", onChange: (val) => {
                    if (val) handleAddEmployee(val);
                  }, placeholder: "+ Add Employee" }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex flex-col justify-between gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { options: typeOptions, value: selectedType, onChange: setSelectedType })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Primary Employee" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { options: employeeOptions, value: activeEmpId, onChange: (val) => {
                    setActiveEmpId(val);
                    handleAddEmployee(val);
                  } })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-primary/[0.02] dark:bg-primary/[0.01] border border-[#1e88e5]/20 rounded-lg flex-1 flex flex-col justify-center space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-primary tracking-wide", children: "Runtime Evaluation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground mt-0.5", children: "Dynamically evaluate punch logs" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative inline-flex items-center cursor-pointer select-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isRuntimeCal, onChange: (e) => setIsRuntimeCal(e.target.checked), className: "sr-only peer" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-5.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#1e88e5]" })
                  ] })
                ] }),
                isRuntimeCal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 pt-2 border-t border-[#1e88e5]/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Shift In Time" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: shiftInThreshold, onChange: (e) => setShiftInThreshold(e.target.value), placeholder: "e.g. 09:00", className: "w-full h-8 px-2.5 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none focus:border-primary text-primary font-mono" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Shift Out Time" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: shiftOutThreshold, onChange: (e) => setShiftOutThreshold(e.target.value), placeholder: "e.g. 18:00", className: "w-full h-8 px-2.5 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none focus:border-primary text-primary font-mono" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-muted/40 dark:bg-[#0c111e]/25 border border-border/40 rounded-lg grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 text-xs font-semibold relative overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-[#1e88e5]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-black text-xs block truncate", children: activeEmpMetadata.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-border/40 inline-block", children: activeEmpMetadata.type })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5", children: "Sub Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold block truncate", children: activeEmpMetadata.subDept })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5", children: "Job Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold block truncate", children: activeEmpMetadata.jobTitle })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5", children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#1e88e5] font-black bg-[#1e88e5]/5 dark:bg-[#1e88e5]/10 border border-[#1e88e5]/20 px-2.5 py-0.5 rounded-md inline-block", children: activeEmpMetadata.unit })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5", children: "Shift" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold block truncate", children: activeEmpMetadata.shift })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5", children: "Shift Start Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold font-mono bg-muted px-2 py-0.5 rounded-md border border-border/40 inline-block", children: activeEmpMetadata.shiftStartDate })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5", children: "Default Holiday" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-extrabold bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20 inline-block", children: activeEmpMetadata.defaultHoliday })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleGetLogs, className: "h-10 px-10 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-xl shadow-md shadow-primary/10 hover:shadow-primary/20 transition duration-150 uppercase tracking-widest flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fetch Attendance" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center font-black text-xs", children: "P" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase block mb-0.5", children: "Present Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground", children: stats.present })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-amber-500/10 text-amber-500 grid place-items-center font-black text-xs", children: "L" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase block mb-0.5", children: "Leaves Taken" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground", children: stats.leaves })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-slate-500/10 text-slate-500 grid place-items-center font-black text-xs", children: "H" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase block mb-0.5", children: "Weekly Holidays" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground", children: stats.holidays })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-black text-xs", children: "OT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase block mb-0.5", children: "Overtime Hours" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-black text-foreground", children: [
                stats.totalOt,
                " hrs"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-rose-500/10 text-rose-500 grid place-items-center font-black text-xs", children: "LT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase block mb-0.5", children: "Late Entries" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground", children: isRuntimeCal ? stats.lateCount : "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-purple-500/10 text-purple-500 grid place-items-center font-black text-xs", children: "EL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase block mb-0.5", children: "Early Leaves" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground", children: isRuntimeCal ? stats.earlyLeaveCount : "—" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 print:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5 text-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EXCEL" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrint, className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-blue-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PRINT" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5 text-rose-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground", children: "Search:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-56 sm:w-64", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search by ID, Name, Date...", className: "w-full h-8 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/50 rounded-xl max-h-[55vh] print:max-h-none print:border-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[950px] xl:min-w-0 border-collapse text-[11px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-12 border-r border-border/30", children: "SL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-28 border-r border-border/30", children: "Employee ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-36 border-r border-border/30", children: "Employee Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "Atn Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "Out Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-24 border-r border-border/30", children: "In Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-24 border-r border-border/30", children: "Out Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-right w-24 border-r border-border/30", children: "Over Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-32 border-r border-border/30", children: "Duty Shift" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-24", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30", children: [
              paginatedRows.map((row, idx) => {
                const slNo = (currentPage - 1) * itemsPerPage + idx + 1;
                let activeStatus = row.status;
                if (isRuntimeCal && row.status === "Present") {
                  const thresholdIn = shiftInThreshold + ":00";
                  const thresholdOut = shiftOutThreshold + ":00";
                  const inTime = row.inTime;
                  const outTime = row.outTime;
                  if (inTime && outTime && inTime !== "N/A" && outTime !== "N/A") {
                    const isLate = inTime > thresholdIn;
                    const isEarly = outTime < thresholdOut;
                    if (isLate && isEarly) {
                      activeStatus = "Late & Early";
                    } else if (isLate) {
                      activeStatus = "Late";
                    } else if (isEarly) {
                      activeStatus = "Early Leave";
                    }
                  }
                }
                let statusBadgeClass = "text-foreground font-semibold";
                if (activeStatus === "Present") {
                  statusBadgeClass = "text-emerald-600 dark:text-emerald-400 font-extrabold";
                } else if (activeStatus === "Holiday") {
                  statusBadgeClass = "text-slate-400 dark:text-slate-500 font-semibold";
                } else if (activeStatus === "CL") {
                  statusBadgeClass = "text-amber-500 dark:text-amber-400 font-extrabold";
                } else if (activeStatus === "Late") {
                  statusBadgeClass = "text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20";
                } else if (activeStatus === "Early Leave") {
                  statusBadgeClass = "text-purple-600 dark:text-purple-400 font-extrabold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20";
                } else if (activeStatus === "Late & Early") {
                  statusBadgeClass = "text-rose-600 dark:text-rose-400 font-extrabold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 animate-pulse";
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-100 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/20", children: slNo }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-bold font-mono text-foreground border-r border-border/20", children: row.empId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-semibold text-foreground/80 border-r border-border/20", children: row.empName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-center font-bold text-foreground/80 border-r border-border/20", children: row.date }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-center text-muted-foreground border-r border-border/20", children: row.outDate || "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center text-primary font-bold border-r border-border/20", children: isRuntimeCal && row.status === "Present" ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: row.inTime, onChange: (e) => handleTimeChange(row.empId, row.date, "inTime", e.target.value), className: "w-20 h-7 text-center bg-slate-100 dark:bg-slate-900 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded outline-none text-[11px] font-bold text-primary font-mono transition" }) : row.inTime || "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center text-primary font-bold border-r border-border/20", children: isRuntimeCal && row.status === "Present" ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: row.outTime, onChange: (e) => handleTimeChange(row.empId, row.date, "outTime", e.target.value), className: "w-20 h-7 text-center bg-slate-100 dark:bg-slate-900 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded outline-none text-[11px] font-bold text-primary font-mono transition" }) : row.outTime || "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-right font-bold text-foreground/85 border-r border-border/20", children: row.overtime }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground border-r border-border/20", children: row.shift }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: statusBadgeClass, children: activeStatus }) })
                ] }, `${row.empId}-${row.date}`);
              }),
              paginatedRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 20, className: "px-4 py-16 text-center text-muted-foreground font-semibold", children: "No attendance job card data found for selected boundaries. Click GET to load records." }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 print:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider", children: [
              "Showing ",
              Math.min((currentPage - 1) * itemsPerPage + 1, filteredRows.length),
              " to ",
              Math.min(currentPage * itemsPerPage, filteredRows.length),
              " of ",
              filteredRows.length,
              " entries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 px-4 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-[10px] rounded-lg transition uppercase tracking-wider", children: "VIEW(PDF)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 px-4 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-[10px] rounded-lg transition uppercase tracking-wider", children: "EXCEL" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: currentPage === 1, onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), className: "p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20", children: [
                  currentPage,
                  " / ",
                  totalPages
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: currentPage === totalPages, onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), className: "p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }) })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  EmployeeJobCardPage as component
};
