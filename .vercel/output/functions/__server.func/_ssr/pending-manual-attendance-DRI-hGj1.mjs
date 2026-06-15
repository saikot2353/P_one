import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, w as FingerprintPattern, K as RefreshCw, ab as Calendar, Y as ChevronDown, ax as FileSpreadsheet, P as Printer, ay as FileDown, S as Search, ar as Pencil, X, a as Clock, g as ChevronLeft } from "../_libs/lucide-react.mjs";
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
const initialPendingList = [{
  id: "2016001055",
  name: "Md. Zahidul Islam",
  dept1: "Management",
  dept2: "Management",
  title: "Chief Operating Officer",
  date: "16/05/2026",
  inTime: "09:02:45",
  outDate: "16/05/2026",
  outTime: "17:59:58",
  reason: "",
  systemBy: "Naim Hasan Roky",
  systemDate: "17/05/2026",
  systemInfo: "In Time Request\nOut Time RequestOut Date Changed.(16/05/2026)",
  hodStatus: "Approve",
  hrdStatus: "Pending",
  mdStatus: "Pending",
  hodName: "Rakibul Islam Khan"
}, {
  id: "2022035599",
  name: "Dipon Saha",
  dept1: "Core Development (HR)",
  dept2: "Development Team",
  title: "Manager",
  date: "15/05/2026",
  inTime: "09:15:30",
  outDate: "15/05/2026",
  outTime: "18:05:12",
  reason: "Severe Traffic Jam",
  systemBy: "Self Service",
  systemDate: "15/05/2026",
  systemInfo: "Late In Approval Request",
  hodStatus: "Pending",
  hrdStatus: "Pending",
  mdStatus: "Pending",
  hodName: "Zakir Hossain"
}, {
  id: "2023043910",
  name: "Tahmid Afsar Shapno",
  dept1: "Business Innovation",
  dept2: "Project Resource & Strategy",
  title: "Asst. Manager",
  date: "14/05/2026",
  inTime: "10:30:00",
  outDate: "14/05/2026",
  outTime: "19:30:00",
  reason: "Audit Visit Support",
  systemBy: "Naim Hasan Roky",
  systemDate: "15/05/2026",
  systemInfo: "In/Out Punch Missing Correction",
  hodStatus: "Approve",
  hrdStatus: "Approve",
  mdStatus: "Pending",
  hodName: "Rakibul Islam Khan"
}, {
  id: "2021032646",
  name: "Sadiqul Islam",
  dept1: "Core Sales",
  dept2: "Retail Sales",
  title: "Deputy Manager",
  date: "15/05/2026",
  inTime: "08:55:00",
  outDate: "15/05/2026",
  outTime: "18:30:00",
  reason: "Early morning Client Meeting",
  systemBy: "Self Service",
  systemDate: "15/05/2026",
  systemInfo: "Punch In Correction Request",
  hodStatus: "Pending",
  hrdStatus: "Pending",
  mdStatus: "Pending",
  hodName: "Zakir Hossain"
}];
function PendingManualAttendancePage() {
  const [requests, setRequests] = reactExports.useState(initialPendingList);
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [startDate, setStartDate] = reactExports.useState("14/05/2026");
  const [endDate, setEndDate] = reactExports.useState("17/05/2026");
  const [empType, setEmpType] = reactExports.useState("ALL");
  const [subDept, setSubDept] = reactExports.useState("ALL");
  const [jobTitle, setJobTitle] = reactExports.useState("ALL");
  const [unit, setUnit] = reactExports.useState("ALL");
  const [line, setLine] = reactExports.useState("ALL");
  const [searchEmpId, setSearchEmpId] = reactExports.useState("");
  const [statusRequest, setStatusRequest] = reactExports.useState("ALL Request");
  const [editingRequest, setEditingRequest] = reactExports.useState(null);
  const [editInTime, setEditInTime] = reactExports.useState("");
  const [editOutTime, setEditOutTime] = reactExports.useState("");
  const [editReason, setEditReason] = reactExports.useState("");
  const [editHodStatus, setEditHodStatus] = reactExports.useState("Pending");
  const [activeDatePicker, setActiveDatePicker] = reactExports.useState(null);
  const [activeTimePicker, setActiveTimePicker] = reactExports.useState(null);
  const [calendarMonth, setCalendarMonth] = reactExports.useState(4);
  const [calendarYear, setCalendarYear] = reactExports.useState(2026);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  reactExports.useEffect(() => {
    const handleOutsideClick = (e) => {
      const target = e.target;
      if (!target.closest(".date-picker-trigger") && !target.closest(".date-picker-popover")) {
        setActiveDatePicker(null);
      }
      if (!target.closest(".time-picker-trigger") && !target.closest(".time-picker-popover")) {
        setActiveTimePicker(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const isAllSelected = reactExports.useMemo(() => {
    return requests.length > 0 && selectedIds.size === requests.length;
  }, [requests, selectedIds]);
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(/* @__PURE__ */ new Set());
    } else {
      setSelectedIds(new Set(requests.map((r) => r.id)));
    }
  };
  const toggleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one correction request to delete!");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected pending request(s)?`)) {
      setRequests((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      setSelectedIds(/* @__PURE__ */ new Set());
      alert("Requests deleted successfully!");
    }
  };
  const handleApproveSelected = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one correction request to approve!");
      return;
    }
    if (confirm(`Are you sure you want to approve ${selectedIds.size} selected attendance correction request(s)?`)) {
      setRequests((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      setSelectedIds(/* @__PURE__ */ new Set());
      alert("Requests approved successfully!");
    }
  };
  const handleStartEdit = (req) => {
    setEditingRequest(req);
    setEditInTime(req.inTime);
    setEditOutTime(req.outTime);
    setEditReason(req.reason);
    setEditHodStatus(req.hodStatus);
  };
  const handleSaveEdit = () => {
    if (!editingRequest) return;
    setRequests((prev) => prev.map((r) => {
      if (r.id !== editingRequest.id) return r;
      return {
        ...r,
        inTime: editInTime,
        outTime: editOutTime,
        reason: editReason,
        hodStatus: editHodStatus
      };
    }));
    setEditingRequest(null);
    alert("Manual Request updated successfully!");
  };
  const filteredRequests = reactExports.useMemo(() => {
    return requests.filter((r) => {
      if (searchEmpId.trim() && !r.id.includes(searchEmpId.trim())) return false;
      if (subDept !== "ALL" && r.dept1 !== subDept) return false;
      if (statusRequest !== "ALL Request") {
        const matchStatus = statusRequest === "Pending" ? "Pending" : "Approve";
        if (r.hodStatus !== matchStatus) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return r.name.toLowerCase().includes(query) || r.id.includes(query) || r.title.toLowerCase().includes(query) || r.hodName.toLowerCase().includes(query);
      }
      return true;
    });
  }, [requests, searchEmpId, subDept, statusRequest, searchQuery]);
  const handleSelectDate = (dateString) => {
    if (!activeDatePicker) return;
    const {
      id,
      field
    } = activeDatePicker;
    if (id === "filters") {
      if (field === "startDate") setStartDate(dateString);
      if (field === "endDate") setEndDate(dateString);
    }
    setActiveDatePicker(null);
  };
  const handleSelectTime = (timeString) => {
    if (!activeTimePicker) return;
    const {
      id,
      field
    } = activeTimePicker;
    if (id === "edit") {
      if (field === "inTime") setEditInTime(timeString);
      if (field === "outTime") setEditOutTime(timeString);
    }
    setActiveTimePicker(null);
  };
  const renderCalendarDays = reactExports.useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(/* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8" }, `empty-${i}`));
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, "0");
      const monthStr = String(calendarMonth + 1).padStart(2, "0");
      const fullDate = `${dayStr}/${monthStr}/${calendarYear}`;
      days.push(/* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (ev) => {
        ev.stopPropagation();
        handleSelectDate(fullDate);
      }, className: "size-8 rounded-lg hover:bg-primary hover:text-white flex items-center justify-center text-[11px] font-bold text-foreground/85 transition", children: day }, `day-${day}`));
    }
    return days;
  }, [calendarMonth, calendarYear, activeDatePicker]);
  const renderCalendarMarkup = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-56 select-none bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (ev) => {
          ev.stopPropagation();
          if (calendarMonth === 0) {
            setCalendarMonth(11);
            setCalendarYear((prev) => prev - 1);
          } else {
            setCalendarMonth((prev) => prev - 1);
          }
        }, className: "p-1 rounded-lg hover:bg-muted text-muted-foreground transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black uppercase text-foreground tracking-wider", children: [
          monthNames[calendarMonth],
          " ",
          calendarYear
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (ev) => {
          ev.stopPropagation();
          if (calendarMonth === 11) {
            setCalendarMonth(0);
            setCalendarYear((prev) => prev + 1);
          } else {
            setCalendarMonth((prev) => prev + 1);
          }
        }, className: "p-1 rounded-lg hover:bg-muted text-muted-foreground transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-1 text-[9px] font-bold text-center text-muted-foreground uppercase pb-1 tracking-wider border-b border-border/30 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Su" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Mo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Tu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "We" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Th" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Fr" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Sa" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-0.5 text-center", children: renderCalendarDays })
    ] });
  };
  const renderTimeClockMarkup = () => {
    const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];
    const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
    const currVal = activeTimePicker?.field === "inTime" ? editInTime : editOutTime;
    const [currHr, currMin] = currVal ? currVal.split(":") : ["09", "00"];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[260px] select-none space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground", children: "Clock Selector" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-bold text-xs", children: [
          currHr || "09",
          ":",
          currMin || "00"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8.5px] font-extrabold text-primary uppercase tracking-wider", children: "HR Presets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1", children: [{
          label: "09:00 IN",
          val: "09:00"
        }, {
          label: "10:00 IN",
          val: "10:00"
        }, {
          label: "18:00 OUT",
          val: "18:00"
        }, {
          label: "20:00 OUT",
          val: "20:00"
        }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (ev) => {
          ev.stopPropagation();
          handleSelectTime(p.val);
        }, className: "py-1 px-1 bg-muted hover:bg-primary hover:text-white rounded text-[8.5px] font-black uppercase border border-border/40 text-foreground/80 transition", children: p.label }, p.val)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-bold text-muted-foreground uppercase", children: "Hours" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 h-32 overflow-y-auto border border-border/40 rounded-lg p-1 bg-muted/40 scrollbar-none", children: hours.map((hr) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (ev) => {
            ev.stopPropagation();
            const nextTime = `${hr}:${currMin || "00"}`;
            if (activeTimePicker?.field === "inTime") setEditInTime(nextTime);
            else setEditOutTime(nextTime);
          }, className: ["py-1 rounded text-[9.5px] font-mono font-bold", currHr === hr ? "bg-primary text-white" : "bg-card border border-border/20 text-foreground/70 hover:bg-muted"].join(" "), children: hr }, hr)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-bold text-muted-foreground uppercase", children: "Minutes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 h-32 overflow-y-auto border border-border/40 rounded-lg p-1 bg-muted/40 scrollbar-none", children: minutes.map((min) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (ev) => {
            ev.stopPropagation();
            const nextTime = `${currHr || "09"}:${min}`;
            if (activeTimePicker?.field === "inTime") setEditInTime(nextTime);
            else setEditOutTime(nextTime);
          }, className: ["py-1 rounded text-[9.5px] font-mono font-bold", currMin === min ? "bg-primary text-white" : "bg-card border border-border/20 text-foreground/70 hover:bg-muted"].join(" "), children: min }, min)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1.5 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (ev) => {
        ev.stopPropagation();
        handleSelectTime(`${currHr || "09"}:${currMin || "00"}`);
      }, className: "w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-extrabold text-[11px] transition uppercase shadow-xs tracking-wider", children: "Apply Time Punch" }) })
    ] });
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Manual Attendance Approval" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Manual Attendance Approval" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setRequests(initialPendingList), className: "h-10 px-4 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reset List" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/85 p-5 shadow-xs space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary", children: "Criteria Selection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground/50", children: "Audit Registry" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Start Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative date-picker-trigger", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: startDate, onClick: () => setActiveDatePicker({
                  id: "filters",
                  field: "startDate"
                }), className: "w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" }),
                activeDatePicker?.id === "filters" && activeDatePicker?.field === "startDate" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100", children: renderCalendarMarkup() })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "End Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative date-picker-trigger", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: endDate, onClick: () => setActiveDatePicker({
                  id: "filters",
                  field: "endDate"
                }), className: "w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" }),
                activeDatePicker?.id === "filters" && activeDatePicker?.field === "endDate" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100", children: renderCalendarMarkup() })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: empType, onChange: (e) => setEmpType(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Permanent", children: "Permanent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Contractual", children: "Contractual" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Sub Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: subDept, onChange: (e) => setSubDept(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Management", children: "Management" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Development (HR)", children: "Core Development (HR)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Accounts & Vat", children: "Accounts & Vat" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Sales", children: "Core Sales" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Job Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: jobTitle, onChange: (e) => setJobTitle(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chief Operating Officer", children: "Chief Operating Officer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Manager", children: "Manager" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Executive", children: "Executive" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Line" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: line, onChange: (e) => setLine(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Line 1", children: "Line 1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Line 2", children: "Line 2" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Employee Id" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchEmpId, onChange: (e) => setSearchEmpId(e.target.value), placeholder: "Enter ID...", className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusRequest, onChange: (e) => setStatusRequest(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL Request", children: "ALL Request" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pending", children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approved" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full h-9.5 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition duration-150 uppercase tracking-wider", children: "SEARCH" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5 text-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EXCEL" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search query...", className: "w-full h-8 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/50 rounded-xl max-h-[55vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-[1950px] w-full border-collapse text-[11px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 text-center border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[60px] min-w-[60px] max-w-[60px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isAllSelected, onChange: toggleSelectAll, className: "rounded border-border/60 text-primary focus:ring-primary/15 cursor-pointer animate-pulse" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[60px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-3 font-extrabold text-center border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[40px] min-w-[40px] max-w-[40px]", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[100px] bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 font-extrabold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[120px] min-w-[120px] max-w-[120px]", children: "Reason" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[220px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-3 font-extrabold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[90px] min-w-[90px] max-w-[90px]", children: "Emp ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[310px] bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 font-extrabold border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[160px] min-w-[160px] max-w-[160px]", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-48 bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-48 bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-24 bg-[#f1f5f9] dark:bg-[#0f172a]", children: "In Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Out Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-24 bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Out Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-extrabold w-[340px] min-w-[340px] bg-[#f1f5f9] dark:bg-[#0f172a]", children: "System Data" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-44 bg-[#f1f5f9] dark:bg-[#0f172a]", children: "HOD" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30", children: [
              filteredRequests.map((r, idx) => {
                const isSelected = selectedIds.has(r.id);
                const stickyCellBgClass = isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b] group-hover:bg-[#e2e8f0] dark:group-hover:bg-[#334155]" : "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: ["group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-150 whitespace-nowrap", isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b]" : ""].join(" "), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-0 ${stickyCellBgClass} px-4 py-2.5 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[60px] min-w-[60px] max-w-[60px] transition-all`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleSelectRow(r.id), className: "rounded border-border/60 text-primary focus:ring-primary/15 cursor-pointer" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleStartEdit(r), className: "p-1 rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition", title: "Edit Punch Log", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3" }) })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-[60px] ${stickyCellBgClass} px-3 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[40px] min-w-[40px] max-w-[40px] transition-all`, children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-[100px] ${stickyCellBgClass} px-4 py-2.5 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[120px] min-w-[120px] max-w-[120px] transition-all`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: r.reason ? "font-semibold text-foreground/80" : "text-muted-foreground/30 italic", children: r.reason || "N/A" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-[220px] ${stickyCellBgClass} px-3 py-2.5 font-bold text-foreground/90 font-mono border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[90px] min-w-[90px] max-w-[90px] transition-all`, children: r.id }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-[310px] ${stickyCellBgClass} px-4 py-2.5 font-semibold text-foreground border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[160px] min-w-[160px] max-w-[160px] transition-all`, children: r.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-foreground/80 font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.dept1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/75 font-normal", children: r.dept2 })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-foreground/75 font-semibold", children: r.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-center font-bold text-foreground/80", children: r.date }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-center text-primary font-bold", children: r.inTime }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-center font-bold text-foreground/80", children: r.outDate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-center text-primary font-bold", children: r.outTime }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5 whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-foreground/70 bg-muted/20 dark:bg-[#0e1626]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-x-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-muted-foreground/70 font-semibold", children: "By" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-9 font-bold text-foreground/90", children: [
                      ": ",
                      r.systemBy
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-muted-foreground/70 font-semibold", children: "Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-9 font-bold text-foreground/90", children: [
                      ": ",
                      r.systemDate
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-muted-foreground/70 font-semibold", children: "Info" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-9 font-semibold text-primary/80 truncate", children: [
                      ": ",
                      r.systemInfo
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-muted-foreground/70 font-semibold", children: "HOD" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-9 font-bold", children: [
                      ": ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: r.hodStatus === "Approve" ? "text-emerald-500" : "text-amber-500", children: r.hodStatus })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-muted-foreground/70 font-semibold", children: "HRD" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-9 font-bold text-amber-500", children: [
                      ": ",
                      r.hrdStatus
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-muted-foreground/70 font-semibold", children: "MD" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-9 font-bold text-amber-500", children: [
                      ": ",
                      r.mdStatus
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-semibold text-foreground/90", children: r.hodName })
                ] }, r.id);
              }),
              filteredRequests.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 20, className: "px-4 py-12 text-center text-muted-foreground font-semibold", children: "No pending attendance correction requests match these filter boundaries." }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider", children: [
              "Showing 1 to ",
              filteredRequests.length,
              " of ",
              requests.length,
              " entries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleDeleteSelected, className: "h-9 px-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-lg shadow-sm transition duration-150 uppercase tracking-wider", children: "DELETE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleApproveSelected, className: "h-9 px-6 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-xs rounded-lg shadow-sm transition duration-150 uppercase tracking-wider", children: "APPROVE" })
            ] })
          ] })
        ] })
      ] }),
      editingRequest && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card text-foreground rounded-lg border border-border shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/60 flex items-center justify-between bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xs font-black text-foreground flex items-center gap-1.5 tracking-wide uppercase", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Edit Pending Manual Request" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingRequest(null), className: "size-7 rounded-lg hover:bg-muted text-muted-foreground/60 hover:text-foreground flex items-center justify-center transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-muted-foreground", children: "Employee ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-foreground font-mono text-sm mt-0.5", children: editingRequest.id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-muted-foreground", children: "Employee Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-foreground text-sm mt-0.5", children: editingRequest.name })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5", children: [
                "In Time ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative time-picker-trigger", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: editInTime, onClick: () => setActiveTimePicker({
                  id: "edit",
                  field: "inTime"
                }), className: "w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/60 text-xs font-bold outline-none cursor-pointer text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" }),
                activeTimePicker?.id === "edit" && activeTimePicker?.field === "inTime" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100", children: renderTimeClockMarkup() })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5", children: [
                "Out Time ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative time-picker-trigger", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", readOnly: true, value: editOutTime, onClick: () => setActiveTimePicker({
                  id: "edit",
                  field: "outTime"
                }), className: "w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/60 text-xs font-bold outline-none cursor-pointer text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" }),
                activeTimePicker?.id === "edit" && activeTimePicker?.field === "outTime" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 bg-card border border-border/70 rounded-lg p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100", children: renderTimeClockMarkup() })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75", children: "Reason" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editReason, onChange: (e) => setEditReason(e.target.value), placeholder: "Input correction reason...", className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none focus:border-primary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75", children: "HOD Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editHodStatus, onChange: (e) => setEditHodStatus(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none focus:border-primary cursor-pointer appearance-none pr-8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pending", children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approve", children: "Approve" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-t border-border/60 flex items-center justify-between bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingRequest(null), className: "h-9 px-5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider transition", children: "Close" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSaveEdit, className: "h-9 px-6 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-sm transition", children: "Apply Changes" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  PendingManualAttendancePage as component
};
