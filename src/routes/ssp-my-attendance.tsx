import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Palmtree,
  Grid,
  List,
  Plus,
  HelpCircle,
  TrendingUp,
  CalendarRange
} from "lucide-react";
import { RequestManualAttendanceModal } from "@/components/ssp/RequestManualAttendanceModal";

export const Route = createFileRoute("/ssp-my-attendance")({
  component: MyAttendancePage,
});

type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave" | "Holiday" | "Weekend" | "Future";

interface AttendanceDay {
  date: number;
  status: AttendanceStatus;
  inTime?: string;
  outTime?: string;
  dayName: string;
  leaveType?: string;
  holidayName?: string;
}

// Dummy data for June 2026 (Starts on Monday)
const generateDummyData = (): AttendanceDay[] => {
  const days: AttendanceDay[] = [];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (let i = 1; i <= 30; i++) {
    const dateObj = new Date(2026, 5, i);
    const dayOfWeek = dateObj.getDay();
    const dayName = dayNames[dayOfWeek];

    if (dayOfWeek === 5 || dayOfWeek === 6) {
      days.push({ date: i, status: "Weekend", dayName });
      continue;
    }

    if (i > 25) {
      days.push({ date: i, status: "Future", dayName });
      continue;
    }

    if (i === 15) {
      days.push({ date: i, status: "Absent", dayName });
      continue;
    }

    if (i === 10 || i === 11) {
      days.push({ date: i, status: "Leave", dayName });
      continue;
    }

    if (i === 4) {
      days.push({ date: i, status: "Late", inTime: "09:45 AM", outTime: "06:05 PM", dayName });
      continue;
    }

    if (i === 20) {
      days.push({ date: i, status: "Holiday", dayName });
      continue;
    }

    days.push({ date: i, status: "Present", inTime: "08:55 AM", outTime: "06:00 PM", dayName });
  }
  return days;
};

// Generate a full year of dummy data
const generateYearlyDummyData = (year: number) => {
  const monthsData: { monthName: string; days: AttendanceDay[]; emptyCells: null[] }[] = [];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const today = new Date();

  for (let month = 0; month < 12; month++) {
    const days: AttendanceDay[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dayOfWeek = dateObj.getDay();
      const dayName = dayNames[dayOfWeek];

      let status: AttendanceStatus = "Present";
      let inTime: string | undefined;
      let outTime: string | undefined;
      let leaveType: string | undefined;
      let holidayName: string | undefined;

      if (dayOfWeek === 5 || dayOfWeek === 6) {
        status = "Weekend";
      } else if (dateObj > today) {
        status = "Future";
      } else {
        // Randomly assign some statuses for past/current days to make it look realistic
        const rand = Math.random();
        if (rand < 0.05) {
          status = "Absent";
        } else if (rand < 0.1) {
          status = "Leave";
          leaveType = Math.random() > 0.5 ? "Sick Leave" : "Casual Leave";
        } else if (rand < 0.15) {
          status = "Late";
          inTime = "09:45 AM";
          outTime = "06:05 PM";
        } else if (rand < 0.18) {
          status = "Holiday";
          holidayName = "Public Holiday";
        } else {
          status = "Present";
          // Randomize slightly around 9 to 6
          const inMin = Math.floor(Math.random() * 15) + 45; // 8:45 to 8:59
          inTime = `08:${inMin} AM`;
          const outMin = Math.floor(Math.random() * 30); // 6:00 to 6:29
          outTime = `06:${outMin.toString().padStart(2, '0')} PM`;
        }
      }

      days.push({ date: i, status, inTime, outTime, dayName, leaveType, holidayName });
    }
    monthsData.push({ monthName: monthNames[month], days, emptyCells: Array(firstDay).fill(null) });
  }
  return monthsData;
};

const getStatusBadgeStyle = (status: AttendanceStatus) => {
  switch (status) {
    case "Present": return "bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 dark:border-emerald-500/20";
    case "Late": return "bg-amber-500/5 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10 dark:border-amber-500/20";
    case "Absent": return "bg-rose-500/5 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/10 dark:border-rose-500/20";
    case "Leave": return "bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10 dark:border-blue-500/20";
    case "Holiday": return "bg-purple-500/5 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/10 dark:border-purple-500/20";
    case "Weekend": return "bg-slate-100/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/30 dark:border-slate-800/30";
  }
};

function MyAttendancePage() {
  const [currentMonth, setCurrentMonth] = useState("June 2026");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "yearly">("calendar");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "All">("All");

  const attendanceData = generateDummyData();
  const yearlyData = generateYearlyDummyData(2026);
  const emptyCells = Array(1).fill(null);

  // Calculate statistics
  const presentDays = attendanceData.filter(d => d.status === "Present").length;
  const lateDays = attendanceData.filter(d => d.status === "Late").length;
  const absentDays = attendanceData.filter(d => d.status === "Absent").length;
  const leaveDays = attendanceData.filter(d => d.status === "Leave").length;
  const holidayDays = attendanceData.filter(d => d.status === "Holiday").length;
  const totalWorkingDays = presentDays + lateDays + absentDays + leaveDays;
  const presentRate = totalWorkingDays > 0 ? Math.round(((presentDays + lateDays) / totalWorkingDays) * 100) : 0;

  const handleDayClick = (dayNumber: number, status: AttendanceStatus) => {
    if (status === "Future") return;

    const dateStr = `2026-06-${dayNumber.toString().padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    setIsModalOpen(true);
  };

  const filteredData = attendanceData.filter(day => {
    if (statusFilter === "All") return true;
    return day.status === statusFilter;
  });

  const totalSlots = emptyCells.length + attendanceData.length;
  const numRows = Math.ceil(totalSlots / 7);
  const totalGridSlots = numRows * 7;
  const endEmptyCells = Array(totalGridSlots - totalSlots).fill(null);

  return (
    <div className="h-screen flex bg-[#f8fafc] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-4 overflow-hidden">

          {/* Header Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-primary transition-colors">SSP</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">My Attendance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-slate-400" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  My Attendance
                </h1>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              View your monthly attendance details, track punches, and request adjustments.
            </div>
          </div>

          {/* Monthly Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">

            {/* Total Working Days */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-555 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <CalendarDays className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Working Days</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{totalWorkingDays} Days</h3>
              </div>
            </div>

            {/* Present Rate & Days */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100/40 dark:border-emerald-900/30">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Present Days</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{presentDays + lateDays} Days</h3>
                  <span className="text-[8px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-1 py-0.5 rounded leading-none">
                    {presentRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Late Arrivals */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100/40 dark:border-amber-900/30">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Late Arrivals</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{lateDays} {lateDays === 1 ? "Day" : "Days"}</h3>
              </div>
            </div>

            {/* Absent Days */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-100/40 dark:border-rose-900/30">
                <XCircle className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Absent Days</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{absentDays} {absentDays === 1 ? "Day" : "Days"}</h3>
              </div>
            </div>

            {/* Leaves & Holidays */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="size-8.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100/40 dark:border-blue-900/30">
                <Palmtree className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Off / Holiday</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{leaveDays + holidayDays} Days</h3>
              </div>
            </div>

          </div>

          {/* Interactive Navigation and Filter Control Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">

            <div className="flex flex-wrap items-center gap-3">
              {/* Month Navigator */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                <button className="p-1 hover:bg-white dark:hover:bg-slate-700 hover:shadow-2xs rounded transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                  <ChevronLeft className="size-3" />
                </button>
                <span className="text-xs font-bold px-2 min-w-[80px] text-center select-none text-slate-700 dark:text-slate-200">{currentMonth}</span>
                <button className="p-1 hover:bg-white dark:hover:bg-slate-700 hover:shadow-2xs rounded transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                  <ChevronRight className="size-3" />
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition-all ${viewMode === "calendar"
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs border border-slate-200/30 dark:border-slate-700"
                      : "text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                >
                  <Grid className="size-3" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition-all ${viewMode === "list"
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs border border-slate-200/30 dark:border-slate-700"
                      : "text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                >
                  <List className="size-3" />
                  List
                </button>
                <button
                  onClick={() => setViewMode("yearly")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition-all ${viewMode === "yearly"
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs border border-slate-200/30 dark:border-slate-700"
                      : "text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                >
                  <CalendarRange className="size-3" />
                  Yearly
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
              {(["All", "Present", "Late", "Absent", "Leave", "Holiday", "Weekend"] as const).map(filter => {
                const isActive = statusFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${isActive
                        ? "bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 shadow-3xs"
                        : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

          </div>

          {/* View Panels */}
          {viewMode === "calendar" ? (

            /* Professional Contiguous Calendar Block */
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col min-h-0">

              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="py-2.5 text-center text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">
                    {day}
                  </div>
                ))}
              </div>

              {/* Contiguous Grid */}
              <div
                className="flex-1 grid grid-cols-7 bg-white dark:bg-slate-900 overflow-hidden divide-x divide-slate-100 dark:divide-slate-800 border-t border-l border-slate-100 dark:border-slate-800"
                style={{ gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))` }}
              >

                {/* Empty cells */}
                {emptyCells.map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="border-b border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/25 dark:bg-slate-950/10"
                  />
                ))}

                {attendanceData.map((day) => {
                  const isFilteredOut = statusFilter !== "All" && day.status !== statusFilter;
                  const isWeekend = day.status === "Weekend";
                  const isFuture = day.status === "Future";
                  const isCurrentDay = day.date === 14;

                  let cellBg = "bg-emerald-50/50 dark:bg-emerald-950/20";
                  let dateColor = "text-emerald-900 dark:text-emerald-400";
                  let statusText = "Present";
                  let statusColor = "text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/30 border-emerald-200/40 dark:border-emerald-900/30";

                  if (isWeekend) {
                    cellBg = "bg-slate-100/70 dark:bg-slate-900/40";
                    dateColor = "text-slate-400 dark:text-slate-500";
                    statusText = "Weekend";
                    statusColor = "text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800/40 border-slate-300/40 dark:border-slate-700/20";
                  } else if (isFuture) {
                    cellBg = "bg-slate-50/30 dark:bg-slate-950/10 opacity-70";
                    dateColor = "text-slate-300 dark:text-slate-700";
                    statusText = "";
                    statusColor = "";
                  } else if (day.status === "Absent") {
                    cellBg = "bg-rose-50/60 dark:bg-rose-950/20";
                    dateColor = "text-rose-900 dark:text-rose-400";
                    statusText = "Absent";
                    statusColor = "text-rose-700 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-950/30 border-rose-200/40 dark:border-rose-900/30";
                  } else if (day.status === "Leave") {
                    cellBg = "bg-blue-50/60 dark:bg-blue-950/20";
                    dateColor = "text-blue-900 dark:text-blue-400";
                    statusText = "Leave";
                    statusColor = "text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-950/30 border-blue-200/40 dark:border-blue-900/30";
                  } else if (day.status === "Holiday") {
                    cellBg = "bg-purple-50/60 dark:bg-purple-950/20";
                    dateColor = "text-purple-900 dark:text-purple-400";
                    statusText = "Holiday";
                    statusColor = "text-purple-700 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-950/30 border-purple-200/40 dark:border-purple-900/30";
                  } else if (day.status === "Late") {
                    cellBg = "bg-amber-50/60 dark:bg-amber-950/20";
                    dateColor = "text-amber-900 dark:text-amber-400";
                    statusText = "Late";
                    statusColor = "text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30 border-amber-200/40 dark:border-amber-900/30";
                  }

                  return (
                    <div
                      key={day.date}
                      onClick={() => handleDayClick(day.date, day.status)}
                      className={`group relative p-2.5 flex flex-col justify-between border-b border-r border-slate-200/80 dark:border-slate-800/85 transition-all duration-150 ${isFilteredOut ? "opacity-10 pointer-events-none" : ""
                        } ${isFuture
                          ? "cursor-default select-none"
                          : isWeekend
                            ? "cursor-default select-none"
                            : isCurrentDay
                              ? `${cellBg} ring-1.5 ring-slate-800 dark:ring-slate-200 z-5 cursor-pointer shadow-sm`
                              : `${cellBg} hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer`
                        }`}
                    >
                      {/* Grid Cell Header */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[11px] font-extrabold ${isCurrentDay
                            ? "text-slate-900 dark:text-white"
                            : dateColor
                          }`}>
                          {day.date.toString().padStart(2, '0')}
                          {isCurrentDay && <span className="ml-1 text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/30 px-1 py-0.5 rounded">Today</span>}
                        </span>

                        {statusText && (
                          <span className={`px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase tracking-widest border ${statusColor}`}>
                            {statusText}
                          </span>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col justify-end gap-1 mt-2.5">
                        {!isFuture && !isWeekend && (
                          <div className="space-y-1 text-[9.5px] font-mono select-none">
                            <div className="flex items-center justify-between bg-white/45 dark:bg-slate-900/45 px-1.5 py-0.5 rounded border border-slate-200/20 dark:border-slate-800/20">
                              <span className="text-[7.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">In:</span>
                              <span className="font-bold text-slate-700 dark:text-slate-350">{day.inTime || "—"}</span>
                            </div>
                            <div className="flex items-center justify-between bg-white/45 dark:bg-slate-900/45 px-1.5 py-0.5 rounded border border-slate-200/20 dark:border-slate-800/20">
                              <span className="text-[7.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Out:</span>
                              <span className="font-bold text-slate-700 dark:text-slate-350">{day.outTime || "—"}</span>
                            </div>
                          </div>
                        )}
                        {(isWeekend || isFuture) && <div className="h-9" />}
                      </div>

                      {/* Hover Overlay Trigger */}
                      {!isFuture && !isWeekend && (
                        <div className="absolute inset-0 bg-[#fafafa]/98 dark:bg-slate-900/98 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-100 z-10">
                          <span className="text-[8.5px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded shadow-3xs hover:bg-slate-50 dark:hover:bg-slate-700">
                            <Plus className="size-2" /> Adjust punches
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}    {/* Padding for end of month */}
                {endEmptyCells.map((_, i) => (
                  <div
                    key={`empty-end-${i}`}
                    className="border-b border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/25 dark:bg-slate-950/10"
                  />
                ))}
              </div>

            </div>
          ) : viewMode === "yearly" ? (

            /* Professional Yearly View Panel */
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-y-auto min-h-0 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {yearlyData.map((month, monthIndex) => {
                  const endEmptyCells = Array((7 - ((month.emptyCells.length + month.days.length) % 7)) % 7).fill(null);
                  return (
                    <div key={month.monthName} className="flex flex-col">
                      <h3 className="text-sm font-extrabold text-primary mb-3 pl-1">{month.monthName}</h3>
                      <div className="bg-white dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm backdrop-blur-xl">
                        <div className="grid grid-cols-7 border-b border-slate-100/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl px-2">
                          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                            <div key={i} className="py-2 text-center text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-1.5 p-3 bg-gradient-to-b from-transparent to-slate-50/30 dark:to-slate-900/20 rounded-b-2xl">
                          {month.emptyCells.map((_, i) => (
                            <div key={`empty-${i}`} className="w-7 h-7 mx-auto" />
                          ))}
                          {month.days.map(day => {
                            let cellStyles = "";

                            if (day.status === "Present") {
                              cellStyles = "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold";
                            } else if (day.status === "Absent") {
                              cellStyles = "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold";
                            } else if (day.status === "Late") {
                              cellStyles = "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold";
                            } else if (day.status === "Leave") {
                              cellStyles = "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold";
                            } else if (day.status === "Holiday") {
                              cellStyles = "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold";
                            } else if (day.status === "Future") {
                              cellStyles = "bg-transparent text-slate-300 dark:text-slate-600 font-medium";
                            } else if (day.status === "Weekend") {
                              cellStyles = "bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-bold";
                            }

                            const interactiveClass = day.status !== "Future" && day.status !== "Weekend"
                              ? "hover:scale-110 hover:shadow-sm cursor-pointer hover:-translate-y-0.5 z-10 hover:ring-2 ring-offset-1 dark:ring-offset-slate-900 ring-slate-200 dark:ring-slate-700"
                              : "cursor-default";

                            return (
                              <div
                                key={day.date}
                                onClick={() => day.status !== "Future" && day.status !== "Weekend" && handleDayClick(day.date, day.status)}
                                className={`relative group w-7 h-7 mx-auto rounded-[8px] flex items-center justify-center text-[10px] transition-all duration-200 ${cellStyles} ${interactiveClass}`}
                              >
                                {day.date}
                                {day.status !== "Future" && day.status !== "Weekend" && (
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] flex flex-col items-center">
                                    <div className="bg-slate-900 text-white text-[9px] px-2 py-1.5 rounded shadow-xl whitespace-nowrap border border-slate-700 font-mono tracking-tight flex flex-col gap-0.5">
                                      {(day.status === "Present" || day.status === "Late") && (
                                        <>
                                          <div className="flex justify-between gap-3">
                                            <span className="text-slate-400 font-sans">In:</span>
                                            <span className="font-bold text-emerald-400">{day.inTime || "—"}</span>
                                          </div>
                                          <div className="flex justify-between gap-3">
                                            <span className="text-slate-400 font-sans">Out:</span>
                                            <span className="font-bold text-rose-400">{day.outTime || "—"}</span>
                                          </div>
                                        </>
                                      )}
                                      {day.status === "Absent" && (
                                        <div className="font-bold text-rose-400 text-center font-sans tracking-wide">
                                          Absent
                                        </div>
                                      )}
                                      {day.status === "Leave" && (
                                        <div className="font-bold text-blue-400 text-center font-sans tracking-wide">
                                          {day.leaveType || "Leave"}
                                        </div>
                                      )}
                                      {day.status === "Holiday" && (
                                        <div className="font-bold text-purple-400 text-center font-sans tracking-wide">
                                          {day.holidayName || "Holiday"}
                                        </div>
                                      )}
                                    </div>
                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-900 -mt-[1px]"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {endEmptyCells.map((_, i) => (
                            <div key={`end-empty-${i}`} className="w-7 h-7 mx-auto" />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (

            /* Professional List View Panel */
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 shadow-[0_1px_0px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0px_rgba(255,255,255,0.05)] border-b border-slate-200 dark:border-slate-800">
                    <tr className="bg-slate-50/50 dark:bg-slate-950/20">
                      <th className="px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Day of Week</th>
                      <th className="px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Check In</th>
                      <th className="px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Check Out</th>
                      <th className="px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredData.map((day) => {
                      const isWeekend = day.status === "Weekend";
                      const isFuture = day.status === "Future";

                      return (
                        <tr
                          key={day.date}
                          className={`hover:bg-slate-50/20 dark:hover:bg-slate-800/10 transition-colors group ${day.date === 14 ? "bg-slate-50/30 dark:bg-slate-800/30" : ""
                            }`}
                        >
                          <td className="px-6 py-2.5 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              {day.date === 14 && <div className="size-1.5 rounded-full bg-slate-800 dark:bg-slate-200" />}
                              <span className="text-xs font-bold">
                                June {day.date.toString().padStart(2, "0")}, 2026
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-2.5 text-xs text-slate-400 dark:text-slate-500 font-medium">{day.dayName}</td>
                          <td className="px-6 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(day.status)}`}>
                              {day.status}
                            </span>
                          </td>
                          <td className="px-6 py-2.5">
                            {day.inTime ? (
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                <Clock className="size-3.5 text-slate-400 dark:text-slate-500" />
                                {day.inTime}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300 dark:text-slate-600">-</span>
                            )}
                          </td>
                          <td className="px-6 py-2.5">
                            {day.outTime ? (
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                <ArrowRight className="size-3.5 text-slate-400 dark:text-slate-500" />
                                {day.outTime}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300 dark:text-slate-600">-</span>
                            )}
                          </td>
                          <td className="px-6 py-2.5 text-right">
                            {!isFuture && !isWeekend && (
                              <button
                                onClick={() => handleDayClick(day.date, day.status)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-slate-900 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-200 px-2.5 py-1 rounded transition-all cursor-pointer"
                              >
                                <Plus className="size-2.5" /> Adjust
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Legend Panel */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.015)] shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <HelpCircle className="size-3.5 text-slate-400" />
              <span>Hover over any active date to request manual adjustments.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: "Present", color: "bg-emerald-500" },
                { label: "Late", color: "bg-amber-500" },
                { label: "Absent", color: "bg-rose-500" },
                { label: "Leave", color: "bg-blue-500" },
                { label: "Holiday", color: "bg-purple-500" },
                { label: "Weekend", color: "bg-slate-400 dark:bg-slate-600" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`size-1.5 rounded-full ${item.color}`} />
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <RequestManualAttendanceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDate={selectedDateStr}
      />
    </div>
  );
}
