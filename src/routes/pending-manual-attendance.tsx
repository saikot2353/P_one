import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Fingerprint, Search, FileSpreadsheet, Printer, FileDown, X, SlidersHorizontal, Pencil,
  ChevronDown, ChevronRight, ChevronLeft, LayoutGrid, Check, Plus, Trash2, Calendar, Clock, AlertCircle, RefreshCw
} from "lucide-react";

export const Route = createFileRoute("/pending-manual-attendance")({
  head: () => ({
    meta: [
      { title: "Manual Attendance Approval — CRIPTON" },
      { name: "description", content: "HR audit registry of attendance corrections, department approvals, and punch overrides." },
    ],
  }),
  component: PendingManualAttendancePage,
});

// Authentic pending requests dataset based directly on your spreadsheet image structure!
const initialPendingList = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  }
];

function PendingManualAttendancePage() {
  const [requests, setRequests] = useState(initialPendingList);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Filters (Matches your top card parameters precisely!)
  const [startDate, setStartDate] = useState("14/05/2026");
  const [endDate, setEndDate] = useState("17/05/2026");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [statusRequest, setStatusRequest] = useState("ALL Request");

  // Inline dynamic edit modal states
  const [editingRequest, setEditingRequest] = useState<any | null>(null);
  const [editInTime, setEditInTime] = useState("");
  const [editOutTime, setEditOutTime] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editHodStatus, setEditHodStatus] = useState("Pending");

  // Custom Calendar & Clock Picker states
  const [activeDatePicker, setActiveDatePicker] = useState<{ id: string; field: string } | null>(null);
  const [activeTimePicker, setActiveTimePicker] = useState<{ id: string; field: string } | null>(null);
  
  // Calendar month state
  const [calendarMonth, setCalendarMonth] = useState(4); // May
  const [calendarYear, setCalendarYear] = useState(2026);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Self-cleaning clickaway listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
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

  // Global Checkbox toggles
  const isAllSelected = useMemo(() => {
    return requests.length > 0 && selectedIds.size === requests.length;
  }, [requests, selectedIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(requests.map(r => r.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Delete Action (Red Button!)
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one correction request to delete!");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected pending request(s)?`)) {
      setRequests(prev => prev.filter(r => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
      alert("Requests deleted successfully!");
    }
  };

  // Approve Action (Green Button!)
  const handleApproveSelected = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one correction request to approve!");
      return;
    }
    if (confirm(`Are you sure you want to approve ${selectedIds.size} selected attendance correction request(s)?`)) {
      setRequests(prev => prev.filter(r => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
      alert("Requests approved successfully!");
    }
  };

  // Trigger editing modal
  const handleStartEdit = (req: any) => {
    setEditingRequest(req);
    setEditInTime(req.inTime);
    setEditOutTime(req.outTime);
    setEditReason(req.reason);
    setEditHodStatus(req.hodStatus);
  };

  // Save changes from Edit Modal
  const handleSaveEdit = () => {
    if (!editingRequest) return;
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== editingRequest.id) return r;
        return {
          ...r,
          inTime: editInTime,
          outTime: editOutTime,
          reason: editReason,
          hodStatus: editHodStatus
        };
      })
    );
    setEditingRequest(null);
    alert("Manual Request updated successfully!");
  };

  // Search filter query matching!
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      // 1. Employee ID filter
      if (searchEmpId.trim() && !r.id.includes(searchEmpId.trim())) return false;
      
      // 2. Department filter
      if (subDept !== "ALL" && r.dept1 !== subDept) return false;
      
      // 3. Status filter
      if (statusRequest !== "ALL Request") {
        const matchStatus = statusRequest === "Pending" ? "Pending" : "Approve";
        if (r.hodStatus !== matchStatus) return false;
      }

      // 4. General search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(query) ||
          r.id.includes(query) ||
          r.title.toLowerCase().includes(query) ||
          r.hodName.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [requests, searchEmpId, subDept, statusRequest, searchQuery]);

  // Date selection handler
  const handleSelectDate = (dateString: string) => {
    if (!activeDatePicker) return;
    const { id, field } = activeDatePicker;

    if (id === "filters") {
      if (field === "startDate") setStartDate(dateString);
      if (field === "endDate") setEndDate(dateString);
    }
    setActiveDatePicker(null);
  };

  // Time selection handler
  const handleSelectTime = (timeString: string) => {
    if (!activeTimePicker) return;
    const { id, field } = activeTimePicker;

    if (id === "edit") {
      if (field === "inTime") setEditInTime(timeString);
      if (field === "outTime") setEditOutTime(timeString);
    }
    setActiveTimePicker(null);
  };

  // Render Days for Calendar
  const renderCalendarDays = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="size-8" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, "0");
      const monthStr = String(calendarMonth + 1).padStart(2, "0");
      const fullDate = `${dayStr}/${monthStr}/${calendarYear}`;

      days.push(
        <button
          key={`day-${day}`}
          onClick={(ev) => {
            ev.stopPropagation();
            handleSelectDate(fullDate);
          }}
          className="size-8 rounded-lg hover:bg-primary hover:text-white flex items-center justify-center text-[11px] font-bold text-foreground/85 transition"
        >
          {day}
        </button>
      );
    }
    return days;
  }, [calendarMonth, calendarYear, activeDatePicker]);

  // Calendar Markup
  const renderCalendarMarkup = () => {
    return (
      <div className="w-56 select-none bg-card">
        <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
          <button 
            onClick={(ev) => {
              ev.stopPropagation();
              if (calendarMonth === 0) {
                setCalendarMonth(11);
                setCalendarYear(prev => prev - 1);
              } else {
                setCalendarMonth(prev => prev - 1);
              }
            }}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="text-[10px] font-black uppercase text-foreground tracking-wider">
            {monthNames[calendarMonth]} {calendarYear}
          </span>
          <button 
            onClick={(ev) => {
              ev.stopPropagation();
              if (calendarMonth === 11) {
                setCalendarMonth(0);
                setCalendarYear(prev => prev + 1);
              } else {
                setCalendarMonth(prev => prev + 1);
              }
            }}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-center text-muted-foreground uppercase pb-1 tracking-wider border-b border-border/30 mb-1">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {renderCalendarDays}
        </div>
      </div>
    );
  };

  // Clock Selector Markup
  const renderTimeClockMarkup = () => {
    const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];
    const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
    const currVal = activeTimePicker?.field === "inTime" ? editInTime : editOutTime;
    const [currHr, currMin] = currVal ? currVal.split(":") : ["09", "00"];

    return (
      <div className="w-[260px] select-none space-y-3">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Clock Selector</span>
          <div className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-bold text-xs">
            {currHr || "09"}:{currMin || "00"}
          </div>
        </div>

        {/* HR Quick Presets */}
        <div className="space-y-1">
          <span className="text-[8.5px] font-extrabold text-primary uppercase tracking-wider">HR Presets</span>
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: "09:00 IN", val: "09:00" },
              { label: "10:00 IN", val: "10:00" },
              { label: "18:00 OUT", val: "18:00" },
              { label: "20:00 OUT", val: "20:00" }
            ].map(p => (
              <button
                key={p.val}
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleSelectTime(p.val);
                }}
                className="py-1 px-1 bg-muted hover:bg-primary hover:text-white rounded text-[8.5px] font-black uppercase border border-border/40 text-foreground/80 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hours / Minutes Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[8px] font-bold text-muted-foreground uppercase">Hours</span>
            <div className="grid grid-cols-3 gap-1 h-32 overflow-y-auto border border-border/40 rounded-lg p-1 bg-muted/40 scrollbar-none">
              {hours.map(hr => (
                <button
                  key={hr}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    const nextTime = `${hr}:${currMin || "00"}`;
                    if (activeTimePicker?.field === "inTime") setEditInTime(nextTime);
                    else setEditOutTime(nextTime);
                  }}
                  className={["py-1 rounded text-[9.5px] font-mono font-bold", currHr === hr ? "bg-primary text-white" : "bg-card border border-border/20 text-foreground/70 hover:bg-muted"].join(" ")}
                >
                  {hr}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[8px] font-bold text-muted-foreground uppercase">Minutes</span>
            <div className="grid grid-cols-3 gap-1 h-32 overflow-y-auto border border-border/40 rounded-lg p-1 bg-muted/40 scrollbar-none">
              {minutes.map(min => (
                <button
                  key={min}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    const nextTime = `${currHr || "09"}:${min}`;
                    if (activeTimePicker?.field === "inTime") setEditInTime(nextTime);
                    else setEditOutTime(nextTime);
                  }}
                  className={["py-1 rounded text-[9.5px] font-mono font-bold", currMin === min ? "bg-primary text-white" : "bg-card border border-border/20 text-foreground/70 hover:bg-muted"].join(" ")}
                >
                  {min}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-1.5 border-t border-border/30">
          <button 
            onClick={(ev) => {
              ev.stopPropagation();
              handleSelectTime(`${currHr || "09"}:${currMin || "00"}`);
            }}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-extrabold text-[11px] transition uppercase shadow-xs tracking-wider"
          >
            Apply Time Punch
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Breadcrumbs and Page Title */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Manual Attendance Approval</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Fingerprint className="size-5.5 text-primary animate-pulse" />
                <span>Manual Attendance Approval</span>
              </h1>
            </div>
            <button 
              onClick={() => setRequests(initialPendingList)}
              className="h-10 px-4 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition duration-200"
            >
              <RefreshCw className="size-3.5 text-primary" />
              <span>Reset List</span>
            </button>
          </div>

          {/* Top Panel: Criteria Selection */}
          <div className="bg-card rounded-2xl border border-border/85 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Criteria Selection</span>
              <span className="text-[9px] font-bold text-muted-foreground/50">Audit Registry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Start Date */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Start Date</label>
                <div className="relative date-picker-trigger">
                  <input
                    type="text"
                    readOnly
                    value={startDate}
                    onClick={() => setActiveDatePicker({ id: "filters", field: "startDate" })}
                    className="w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer text-primary"
                  />
                  <Calendar className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />

                  {activeDatePicker?.id === "filters" && activeDatePicker?.field === "startDate" && (
                    <div className="absolute z-50 bg-card border border-border/70 rounded-2xl p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                      {renderCalendarMarkup()}
                    </div>
                  )}
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">End Date</label>
                <div className="relative date-picker-trigger">
                  <input
                    type="text"
                    readOnly
                    value={endDate}
                    onClick={() => setActiveDatePicker({ id: "filters", field: "endDate" })}
                    className="w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer text-primary"
                  />
                  <Calendar className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />

                  {activeDatePicker?.id === "filters" && activeDatePicker?.field === "endDate" && (
                    <div className="absolute z-50 bg-card border border-border/70 rounded-2xl p-4 shadow-2xl space-y-3 date-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                      {renderCalendarMarkup()}
                    </div>
                  )}
                </div>
              </div>

              {/* Employee Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Employee Type</label>
                <div className="relative">
                  <select 
                    value={empType}
                    onChange={(e) => setEmpType(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contractual">Contractual</option>
                  </select>
                  <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Sub Department */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Sub Department</label>
                <div className="relative">
                  <select 
                    value={subDept}
                    onChange={(e) => setSubDept(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Management">Management</option>
                    <option value="Core Development (HR)">Core Development (HR)</option>
                    <option value="Accounts & Vat">Accounts & Vat</option>
                    <option value="Core Sales">Core Sales</option>
                  </select>
                  <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Job Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Job Title</label>
                <div className="relative">
                  <select 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Chief Operating Officer">Chief Operating Officer</option>
                    <option value="Manager">Manager</option>
                    <option value="Executive">Executive</option>
                  </select>
                  <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Unit */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Unit</label>
                <div className="relative">
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    <option value="PSL">PSL</option>
                    <option value="PTVL">PTVL</option>
                  </select>
                  <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Line */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Line</label>
                <div className="relative">
                  <select 
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Line 1">Line 1</option>
                    <option value="Line 2">Line 2</option>
                  </select>
                  <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Employee ID input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Employee Id</label>
                <input
                  type="text"
                  value={searchEmpId}
                  onChange={(e) => setSearchEmpId(e.target.value)}
                  placeholder="Enter ID..."
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
                <div className="relative">
                  <select 
                    value={statusRequest}
                    onChange={(e) => setStatusRequest(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                  >
                    <option value="ALL Request">ALL Request</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                  </select>
                  <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Blue Search Button exactly matching Pakiza theme! */}
              <div className="flex items-end pt-1">
                <button className="w-full h-9.5 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition duration-150 uppercase tracking-wider">
                  SEARCH
                </button>
              </div>

            </div>
          </div>

          {/* Spreadsheet Datagrid Block */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            
            {/* Utilities Actions & Table Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
              <div className="flex items-center gap-1.5 select-none">
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>EXCEL</span>
                </button>
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <Printer className="size-3.5 text-blue-500" />
                  <span>PRINT</span>
                </button>
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Right Side Text Search */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Search:</span>
                <div className="relative w-56 sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search query..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* High-Fidelity Table with Fixed (Sticky Left) Columns */}
            <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[55vh]">
              <table className="min-w-[1950px] w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                    {/* Fixed Left Header Columns */}
                    <th className="sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 text-center border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[60px] min-w-[60px] max-w-[60px]">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-border/60 text-primary focus:ring-primary/15 cursor-pointer animate-pulse"
                      />
                    </th>
                    <th className="sticky left-[60px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-3 font-extrabold text-center border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[40px] min-w-[40px] max-w-[40px]">#</th>
                    <th className="sticky left-[100px] bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 font-extrabold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[120px] min-w-[120px] max-w-[120px]">Reason</th>
                    <th className="sticky left-[220px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-3 font-extrabold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[90px] min-w-[90px] max-w-[90px]">Emp ID</th>
                    <th className="sticky left-[310px] bg-[#f1f5f9] dark:bg-[#0f172a] px-4 py-3 font-extrabold border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[160px] min-w-[160px] max-w-[160px]">Name</th>
                    
                    {/* Scrolling Columns */}
                    <th className="px-4 py-3 font-extrabold w-48 bg-[#f1f5f9] dark:bg-[#0f172a]">Department</th>
                    <th className="px-4 py-3 font-extrabold w-48 bg-[#f1f5f9] dark:bg-[#0f172a]">Designation</th>
                    <th className="px-4 py-3 font-extrabold text-center w-28 bg-[#f1f5f9] dark:bg-[#0f172a]">Date</th>
                    <th className="px-4 py-3 font-extrabold text-center w-24 bg-[#f1f5f9] dark:bg-[#0f172a]">In Time</th>
                    <th className="px-4 py-3 font-extrabold text-center w-28 bg-[#f1f5f9] dark:bg-[#0f172a]">Out Date</th>
                    <th className="px-4 py-3 font-extrabold text-center w-24 bg-[#f1f5f9] dark:bg-[#0f172a]">Out Time</th>
                    <th className="px-5 py-3 font-extrabold w-[340px] min-w-[340px] bg-[#f1f5f9] dark:bg-[#0f172a]">System Data</th>
                    <th className="px-4 py-3 font-extrabold w-44 bg-[#f1f5f9] dark:bg-[#0f172a]">HOD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredRequests.map((r, idx) => {
                    const isSelected = selectedIds.has(r.id);
                    const stickyCellBgClass = isSelected
                      ? "bg-[#f1f5f9] dark:bg-[#1e293b] group-hover:bg-[#e2e8f0] dark:group-hover:bg-[#334155]"
                      : "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";

                    return (
                      <tr 
                        key={r.id}
                        className={[
                          "group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-150 whitespace-nowrap",
                          isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b]" : ""
                        ].join(" ")}
                      >
                        {/* 1. Selector + Pencil Action Column (Sticky Left) */}
                        <td className={`sticky left-0 ${stickyCellBgClass} px-4 py-2.5 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[60px] min-w-[60px] max-w-[60px] transition-all`}>
                          <div className="flex items-center justify-between gap-1">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleSelectRow(r.id)}
                              className="rounded border-border/60 text-primary focus:ring-primary/15 cursor-pointer"
                            />
                            <button 
                              onClick={() => handleStartEdit(r)}
                              className="p-1 rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition"
                              title="Edit Punch Log"
                            >
                              <Pencil className="size-3" />
                            </button>
                          </div>
                        </td>

                        {/* 2. # SL (Sticky Left) */}
                        <td className={`sticky left-[60px] ${stickyCellBgClass} px-3 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[40px] min-w-[40px] max-w-[40px] transition-all`}>{idx + 1}</td>

                        {/* 3. Reason (Sticky Left) */}
                        <td className={`sticky left-[100px] ${stickyCellBgClass} px-4 py-2.5 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[120px] min-w-[120px] max-w-[120px] transition-all`}>
                          <span className={r.reason ? "font-semibold text-foreground/80" : "text-muted-foreground/30 italic"}>
                            {r.reason || "N/A"}
                          </span>
                        </td>

                        {/* 4. Emp ID (Sticky Left) */}
                        <td className={`sticky left-[220px] ${stickyCellBgClass} px-3 py-2.5 font-bold text-foreground/90 font-mono border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[90px] min-w-[90px] max-w-[90px] transition-all`}>{r.id}</td>

                        {/* 5. Name (Sticky Left) */}
                        <td className={`sticky left-[310px] ${stickyCellBgClass} px-4 py-2.5 font-semibold text-foreground border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[160px] min-w-[160px] max-w-[160px] transition-all`}>{r.name}</td>

                        {/* 6. Department (Double line!) */}
                        <td className="px-4 py-2.5 text-foreground/80 font-medium">
                          <div>{r.dept1}</div>
                          <div className="text-[10px] text-muted-foreground/75 font-normal">{r.dept2}</div>
                        </td>

                        {/* 7. Designation */}
                        <td className="px-4 py-2.5 text-foreground/75 font-semibold">{r.title}</td>

                        {/* 8. Date */}
                        <td className="px-4 py-2.5 font-mono text-center font-bold text-foreground/80">{r.date}</td>

                        {/* 9. In Time */}
                        <td className="px-4 py-2.5 font-mono text-center text-primary font-bold">{r.inTime}</td>

                        {/* 10. Out Date */}
                        <td className="px-4 py-2.5 font-mono text-center font-bold text-foreground/80">{r.outDate}</td>

                        {/* 11. Out Time */}
                        <td className="px-4 py-2.5 font-mono text-center text-primary font-bold">{r.outTime}</td>

                        {/* 12. System Data block (Matches your text output style precisely!) */}
                        <td className="px-5 py-2.5 whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-foreground/70 bg-muted/20 dark:bg-[#0e1626]/20">
                          <div className="grid grid-cols-12 gap-x-1">
                            <span className="col-span-3 text-muted-foreground/70 font-semibold">By</span>
                            <span className="col-span-9 font-bold text-foreground/90">: {r.systemBy}</span>
                            
                            <span className="col-span-3 text-muted-foreground/70 font-semibold">Date</span>
                            <span className="col-span-9 font-bold text-foreground/90">: {r.systemDate}</span>
                            
                            <span className="col-span-3 text-muted-foreground/70 font-semibold">Info</span>
                            <span className="col-span-9 font-semibold text-primary/80 truncate">: {r.systemInfo}</span>
                            
                            <span className="col-span-3 text-muted-foreground/70 font-semibold">HOD</span>
                            <span className="col-span-9 font-bold">
                              : <span className={r.hodStatus === "Approve" ? "text-emerald-500" : "text-amber-500"}>{r.hodStatus}</span>
                            </span>
                            
                            <span className="col-span-3 text-muted-foreground/70 font-semibold">HRD</span>
                            <span className="col-span-9 font-bold text-amber-500">: {r.hrdStatus}</span>
                            
                            <span className="col-span-3 text-muted-foreground/70 font-semibold">MD</span>
                            <span className="col-span-9 font-bold text-amber-500">: {r.mdStatus}</span>
                          </div>
                        </td>

                        {/* 13. HOD Manager Name */}
                        <td className="px-4 py-2.5 font-semibold text-foreground/90">{r.hodName}</td>
                      </tr>
                    );
                  })}

                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={20} className="px-4 py-12 text-center text-muted-foreground font-semibold">
                        No pending attendance correction requests match these filter boundaries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Datagrid Footer / Discard Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <span className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                Showing 1 to {filteredRequests.length} of {requests.length} entries
              </span>
              
              <div className="flex items-center gap-2">
                {/* DELETE red button exactly matching Pakiza style! */}
                <button
                  onClick={handleDeleteSelected}
                  className="h-9 px-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-lg shadow-sm transition duration-150 uppercase tracking-wider"
                >
                  DELETE
                </button>

                {/* APPROVE green button exactly matching Pakiza style! */}
                <button
                  onClick={handleApproveSelected}
                  className="h-9 px-6 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-xs rounded-lg shadow-sm transition duration-150 uppercase tracking-wider"
                >
                  APPROVE
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Dynamic Inline edit modal */}
        {editingRequest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card text-foreground rounded-2xl border border-border shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-muted/30">
                <h2 className="text-xs font-black text-foreground flex items-center gap-1.5 tracking-wide uppercase">
                  <Pencil className="size-4 text-primary" />
                  <span>Edit Pending Manual Request</span>
                </h2>
                <button 
                  onClick={() => setEditingRequest(null)}
                  className="size-7 rounded-lg hover:bg-muted text-muted-foreground/60 hover:text-foreground flex items-center justify-center transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground">Employee ID</span>
                    <div className="font-black text-foreground font-mono text-sm mt-0.5">{editingRequest.id}</div>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground">Employee Name</span>
                    <div className="font-bold text-foreground text-sm mt-0.5">{editingRequest.name}</div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Edit In Time */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5">
                      In Time <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative time-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={editInTime}
                        onClick={() => setActiveTimePicker({ id: "edit", field: "inTime" })}
                        className="w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/60 text-xs font-bold outline-none cursor-pointer text-primary"
                      />
                      <Clock className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />

                      {activeTimePicker?.id === "edit" && activeTimePicker?.field === "inTime" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-2xl p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderTimeClockMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Out Time */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75 flex items-center gap-0.5">
                      Out Time <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative time-picker-trigger">
                      <input
                        type="text"
                        readOnly
                        value={editOutTime}
                        onClick={() => setActiveTimePicker({ id: "edit", field: "outTime" })}
                        className="w-full h-9 px-3 pl-8.5 rounded-lg bg-muted border border-border/60 text-xs font-bold outline-none cursor-pointer text-primary"
                      />
                      <Clock className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />

                      {activeTimePicker?.id === "edit" && activeTimePicker?.field === "outTime" && (
                        <div className="absolute z-50 bg-card border border-border/70 rounded-2xl p-4 shadow-2xl space-y-3 time-picker-popover top-full mt-1.5 left-0 animate-in fade-in duration-100">
                          {renderTimeClockMarkup()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Reason */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75">Reason</label>
                    <input
                      type="text"
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      placeholder="Input correction reason..."
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none focus:border-primary"
                    />
                  </div>

                  {/* Edit HOD Approval Status */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75">HOD Status</label>
                    <div className="relative">
                      <select
                        value={editHodStatus}
                        onChange={(e) => setEditHodStatus(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none focus:border-primary cursor-pointer appearance-none pr-8"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approve">Approve</option>
                      </select>
                      <ChevronDown className="size-3 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-border/60 flex items-center justify-between bg-muted/20">
                <button
                  onClick={() => setEditingRequest(null)}
                  className="h-9 px-5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider transition"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="h-9 px-6 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-sm transition"
                >
                  Apply Changes
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
