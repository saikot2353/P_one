import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Fingerprint, ChevronRight, CalendarDays, RefreshCw, X, ChevronDown, Check, SlidersHorizontal
} from "lucide-react";

export const Route = createFileRoute("/create-roster")({
  head: () => ({
    meta: [
      { title: "Employee Roster — CRIPTON" },
      { name: "description", content: "Corporate Shift Roster scheduling registry, weekend allocations, and default holiday configurations." },
    ],
  }),
  component: CreateRosterPage,
});

// Mock initial employee database for roster generation
const rosterEmployees = [
  { id: "2023043910", name: "Tahmid Afsar Shapno", dept: "Business Innovation", type: "ALL", unit: "PSL", line: "N/A" },
  { id: "2016001055", name: "Md. Zahidul Islam", dept: "Management", type: "ALL", unit: "PSL", line: "Line-02" },
  { id: "2022035599", name: "Dipon Saha", dept: "Core Development (HR)", type: "ALL", unit: "PSL", line: "Line-03" },
  { id: "2025057309", name: "Bani Amin Jwel", dept: "Core Development (HR)", type: "ALL", unit: "PSL", line: "Line-01" },
  { id: "2021032646", name: "Sadiqul Islam", dept: "Core Sales", type: "ALL", unit: "PSL", line: "Line-02" }
];

const monthsList = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function CreateRosterPage() {
  // Left config parameters
  const [empIdsInput, setEmpIdsInput] = useState("2023043910, 2016001055, 2022035599");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [companyName, setCompanyName] = useState("Pakiza Software Limited");
  const [areaName, setAreaName] = useState("PSL-Head Office");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [joiningFrom, setJoiningFrom] = useState("");
  const [joiningTo, setJoiningTo] = useState("");
  const [status, setStatus] = useState("Working");

  // Right quick override controls
  const [targetDay, setTargetDay] = useState(1);
  const [weekendDay, setWeekendDay] = useState("Saturday");

  // Roster matrix state: maps empId -> Array of 31 status strings ('W' = Work, 'H' = Holiday, 'GH' = Govt Holiday)
  const [rosterMatrix, setRosterMatrix] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    rosterEmployees.forEach(emp => {
      // Default: set every day to 'W' (Working)
      initial[emp.id] = Array(31).fill("W");
    });
    return initial;
  });

  // Calculate parsed list of comma-separated active IDs
  const activeIds = useMemo(() => {
    return empIdsInput
      .split(",")
      .map(id => id.trim())
      .filter(id => id.length > 0);
  }, [empIdsInput]);

  // Filter roster employees by selection boundaries
  const filteredEmployees = useMemo(() => {
    return rosterEmployees.filter(emp => {
      // Comma separator match
      if (activeIds.length > 0 && !activeIds.includes(emp.id)) return false;
      if (subDept !== "ALL" && emp.dept !== subDept) return false;
      if (unit !== "ALL" && emp.unit !== unit) return false;
      if (line !== "ALL" && emp.line !== line) return false;
      return true;
    });
  }, [activeIds, subDept, unit, line]);

  // Action: Set Specific Day (1-31) Status
  const handleSetDayStatus = (statusType: "GH" | "H" | "W") => {
    const dayIdx = targetDay - 1;
    setRosterMatrix(prev => {
      const next = { ...prev };
      filteredEmployees.forEach(emp => {
        const empSchedule = [...(next[emp.id] || Array(31).fill("W"))];
        empSchedule[dayIdx] = statusType;
        next[emp.id] = empSchedule;
      });
      return next;
    });
  };

  // Action: Apply Weekend day Holiday
  const handleApplyWeekendHoliday = () => {
    // Determine which indices match the chosen weekend day for the selected month/year
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear);
    const dayIndicesToUpdate: number[] = [];

    // Map weekend name to JS day index (Saturday = 6, Sunday = 0, Friday = 5, etc.)
    const dayMap: Record<string, number> = {
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6
    };
    const targetDayIndex = dayMap[weekendDay] ?? 6;

    // Check all days (1 to 31)
    const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yearNum, monthIndex, d);
      if (dt.getDay() === targetDayIndex) {
        dayIndicesToUpdate.push(d - 1);
      }
    }

    setRosterMatrix(prev => {
      const next = { ...prev };
      filteredEmployees.forEach(emp => {
        const empSchedule = [...(next[emp.id] || Array(31).fill("W"))];
        dayIndicesToUpdate.forEach(idx => {
          empSchedule[idx] = "H";
        });
        next[emp.id] = empSchedule;
      });
      return next;
    });
    alert(`Successfully applied Weekend Holiday (H) to all ${weekendDay}s in ${selectedMonth} ${selectedYear}!`);
  };

  // Action: ROSTER HOLIDAY
  const handleRosterHoliday = () => {
    // Automatically flag Fridays and Saturdays as H
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear);
    const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
    const weekendIndices: number[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yearNum, monthIndex, d);
      // Friday (5) or Saturday (6)
      if (dt.getDay() === 5 || dt.getDay() === 6) {
        weekendIndices.push(d - 1);
      }
    }

    setRosterMatrix(prev => {
      const next = { ...prev };
      filteredEmployees.forEach(emp => {
        const empSchedule = [...(next[emp.id] || Array(31).fill("W"))];
        weekendIndices.forEach(idx => {
          empSchedule[idx] = "H";
        });
        next[emp.id] = empSchedule;
      });
      return next;
    });
    alert("Applied standard roster weekends (Friday & Saturday) as Holiday (H)!");
  };

  // Action: DEFAULT HOLIDAY
  const handleDefaultHoliday = () => {
    // Automatically flag Fridays as H
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear);
    const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
    const fridayIndices: number[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yearNum, monthIndex, d);
      if (dt.getDay() === 5) { // Friday
        fridayIndices.push(d - 1);
      }
    }

    setRosterMatrix(prev => {
      const next = { ...prev };
      filteredEmployees.forEach(emp => {
        const empSchedule = [...(next[emp.id] || Array(31).fill("W"))];
        fridayIndices.forEach(idx => {
          empSchedule[idx] = "H";
        });
        next[emp.id] = empSchedule;
      });
      return next;
    });
    alert("Applied default weekend (Friday) as Holiday (H)!");
  };

  // Bottom action: UPDATE ROSTER
  const handleUpdateRoster = () => {
    alert(`Roster configuration successfully saved & updated for ${filteredEmployees.length} employee(s) for the month of ${selectedMonth} ${selectedYear}!`);
  };

  // Bottom action: DELETE ROSTER
  const handleDeleteRoster = () => {
    if (confirm("Are you sure you want to discard this entire roster schedule configuration?")) {
      setRosterMatrix(prev => {
        const next = { ...prev };
        filteredEmployees.forEach(emp => {
          next[emp.id] = Array(31).fill("W");
        });
        return next;
      });
      alert("Roster configuration successfully reset!");
    }
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
                <span className="text-primary font-semibold">Employee Roster</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <CalendarDays className="size-5.5 text-primary animate-pulse" />
                <span>Employee Roster</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
                Month: {selectedMonth} {selectedYear}
              </span>
            </div>
          </div>

          {/* Configuration Grid Panel (Two main cards side by side) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Card: General Criteria Selection */}
            <div className="xl:col-span-8 bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Roster Generation boundaries</span>
                <span className="text-[9px] font-bold text-muted-foreground/50">Left Controls</span>
              </div>

              {/* Roster Criteria Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Employee ID textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Employee ID (Multiple)</label>
                  <textarea
                    value={empIdsInput}
                    onChange={(e) => setEmpIdsInput(e.target.value)}
                    placeholder="use comma as separator"
                    className="w-full h-18 p-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary placeholder:text-muted-foreground/50 resize-none"
                  />
                </div>

                {/* Year Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Year</label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer text-primary"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Month Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Month</label>
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                    >
                      {monthsList.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Company Name</label>
                  <div className="relative">
                    <select
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                      <option value="Pakiza Group">Pakiza Group</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Area Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Area Name</label>
                  <div className="relative">
                    <select
                      value={areaName}
                      onChange={(e) => setAreaName(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                    >
                      <option value="PSL-Head Office">PSL-Head Office</option>
                      <option value="PSL-Factory Operations">PSL-Factory Operations</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Employee Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Employee Type</label>
                  <div className="relative">
                    <select
                      value={employeeType}
                      onChange={(e) => setEmployeeType(e.target.value)}
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
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Sub Department</label>
                  <div className="relative">
                    <select
                      value={subDept}
                      onChange={(e) => setSubDept(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                    >
                      <option value="ALL">ALL</option>
                      <option value="Accounts & Vat">Accounts & Vat</option>
                      <option value="Core Development (HR)">Core Development (HR)</option>
                      <option value="Management">Management</option>
                      <option value="Core Sales">Core Sales</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Unit */}
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Line</label>
                  <div className="relative">
                    <select
                      value={line}
                      onChange={(e) => setLine(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                    >
                      <option value="ALL">ALL</option>
                      <option value="Line-01">Line-01</option>
                      <option value="Line-02">Line-02</option>
                      <option value="Line-03">Line-03</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Joining From */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Joining From</label>
                  <input
                    type="date"
                    value={joiningFrom}
                    onChange={(e) => setJoiningFrom(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition"
                  />
                </div>

                {/* Joining To */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Joining To</label>
                  <input
                    type="date"
                    value={joiningTo}
                    onChange={(e) => setJoiningTo(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Working">Working</option>
                      <option value="Resigned">Resigned</option>
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Roster Actions bottom left inside first card */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleRosterHoliday}
                  className="h-8 px-4 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-[10px] rounded-lg tracking-wider uppercase shadow-xs transition"
                >
                  ROSTER HOLIDAY
                </button>
                <button
                  onClick={handleDefaultHoliday}
                  className="h-8 px-4 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-[10px] rounded-lg tracking-wider uppercase shadow-xs transition"
                >
                  DEFAULT HOLIDAY
                </button>
              </div>

            </div>

            {/* Right Card: Day & Weekend Override Selector */}
            <div className="xl:col-span-4 bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Day & Weekend Overrides</span>
                <span className="text-[9px] font-bold text-muted-foreground/50">Right Controls</span>
              </div>

              {/* Selector A Day */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">Select A Day(1-31)</label>
                <div className="relative">
                  <select
                    value={targetDay}
                    onChange={(e) => setTargetDay(parseInt(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary appearance-none pr-8 cursor-pointer text-primary"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Overwrite action buttons row */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleSetDayStatus("GH")}
                    className="flex-1 h-8 bg-[#c2db42] hover:bg-[#b5cc38] text-slate-800 font-extrabold text-[10px] rounded-md transition uppercase tracking-wider"
                  >
                    GH
                  </button>
                  <button
                    onClick={() => handleSetDayStatus("H")}
                    className="flex-1 h-8 bg-[#c2db42] hover:bg-[#b5cc38] text-slate-800 font-extrabold text-[10px] rounded-md transition uppercase tracking-wider"
                  >
                    H
                  </button>
                  <button
                    onClick={() => handleSetDayStatus("W")}
                    className="flex-1 h-8 bg-[#f57c00] hover:bg-[#e65100] text-white font-extrabold text-[10px] rounded-md transition uppercase tracking-wider"
                  >
                    CLEAN
                  </button>
                </div>
              </div>

              {/* Selector A Weekend */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">Select A Weekend</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select
                      value={weekendDay}
                      onChange={(e) => setWeekendDay(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                    >
                      {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    onClick={handleApplyWeekendHoliday}
                    className="h-9 px-4 bg-[#c2db42] hover:bg-[#b5cc38] text-slate-800 font-extrabold text-[10px] rounded-md transition uppercase tracking-wider"
                  >
                    H
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Table Card: Generated Scheduler Roster Calendar */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Roster Schedule Matrix</span>
              <span className="text-[9px] font-bold text-muted-foreground/60">Dynamic Live View (1-31)</span>
            </div>

            {/* Matrix Data Spreadsheet */}
            <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[50vh]">
              <table className="w-full border-collapse text-[10px] text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                    <th className="px-3 py-2.5 font-extrabold w-24 border-r border-border/30 text-center">Emp ID</th>
                    <th className="px-3 py-2.5 font-extrabold w-36 border-r border-border/30">Employee Name</th>
                    <th className="px-3 py-2.5 font-extrabold w-28 border-r border-border/30">Sub Dept</th>
                    
                    {/* Render days 1 to 31 columns */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <th key={d} className="px-2 py-2.5 font-extrabold text-center w-8 border-r border-border/30">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredEmployees.map(emp => {
                    const schedule = rosterMatrix[emp.id] || Array(31).fill("W");

                    return (
                      <tr key={emp.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-75 whitespace-nowrap">
                        <td className="px-3 py-2 font-bold font-mono text-center text-foreground border-r border-border/20">{emp.id}</td>
                        <td className="px-3 py-2 font-bold text-foreground/80 border-r border-border/20">{emp.name}</td>
                        <td className="px-3 py-2 text-muted-foreground border-r border-border/20">{emp.dept}</td>

                        {/* Roster schedule cells */}
                        {schedule.map((dayStatus, idx) => {
                          let cellColorClass = "bg-muted text-muted-foreground/60"; // 'W' Work Day
                          if (dayStatus === "H") {
                            cellColorClass = "bg-rose-500/25 text-rose-700 dark:text-rose-400 font-black"; // Holiday
                          } else if (dayStatus === "GH") {
                            cellColorClass = "bg-[#c2db42]/30 text-slate-800 dark:text-slate-200 font-black"; // Govt Holiday
                          }

                          return (
                            <td key={idx} className="p-1 border-r border-border/20 text-center">
                              <div
                                onClick={() => {
                                  // Click row day cell directly to toggle between W -> H -> GH
                                  setRosterMatrix(prev => {
                                    const next = { ...prev };
                                    const sch = [...(next[emp.id] || Array(31).fill("W"))];
                                    const curr = sch[idx];
                                    let nextStatus = "W";
                                    if (curr === "W") nextStatus = "H";
                                    else if (curr === "H") nextStatus = "GH";
                                    sch[idx] = nextStatus;
                                    next[emp.id] = sch;
                                    return next;
                                  });
                                }}
                                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[9px] shadow-xs cursor-pointer select-none transition ${cellColorClass}`}
                              >
                                {dayStatus}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={35} className="px-4 py-12 text-center text-muted-foreground font-semibold">
                        No employees found matching these boundaries. Use comma separator in ID panel to active employees.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={handleUpdateRoster}
                className="h-9 px-6 bg-[#ab47bc] hover:bg-[#9c27b0] text-white font-extrabold text-xs rounded-md shadow-sm transition uppercase tracking-wider"
              >
                UPDATE ROSTER
              </button>
              <button
                onClick={handleDeleteRoster}
                className="h-9 px-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-md shadow-sm transition uppercase tracking-wider"
              >
                DELETE ROSTER
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
