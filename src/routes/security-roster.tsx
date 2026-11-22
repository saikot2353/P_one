import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  CalendarDays,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  Download,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/security-roster")({
  head: () => ({
    meta: [
      { title: "Security Roster — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Security Department shift scheduling matrix, rotational roster allocations, and default holiday configurations.",
      },
    ],
  }),
  component: SecurityRosterPage,
});

// Personnel Record Structure
export interface RosterPersonnel {
  id: string;
  name: string;
  dept: string;
  section: string;
  designation: string;
  type: string;
  unit: string;
  line: string;
  status: "Working" | "Resigned" | "On Leave";
}

export const DEPARTMENTS_WITH_SECTIONS: Record<string, string[]> = {
  Security: [
    "Main Gate & Perimeter Guard",
    "Factory & Production Floor Security",
    "Warehouse & MCD Store Security",
    "CCTV Monitoring & Control Room",
    "Night Patrol & Vigilance Team",
    "Executive & Visitor Protocol",
  ],
  "Fabric Dyeing": [
    "Dyeing Planning",
    "Fabric Dyeing Floor",
    "Sample Dyeing",
    "Dyeing Lab & Matching",
    "Grey Fabric Store",
  ],
  Sewing: [
    "Sewing Line-01",
    "Sewing Line-02",
    "Sewing Line-03",
    "Sewing Sample Section",
    "Sewing Alteration Unit",
  ],
  Cutting: [
    "Auto Cutting Unit",
    "Manual Cutting Line",
    "Spreading & Bundling",
    "Pattern & Marker",
  ],
  Finishing: [
    "Iron & Pressing Line",
    "Packing & Cartoning",
    "Metal Detection Unit",
    "Poly Packing Section",
  ],
  "Quality Assurance": [
    "Inline QA (Sewing)",
    "Final Audit Inspection",
    "Fabric Testing Lab",
    "Finishing QA",
  ],
  Maintenance: [
    "Mechanical Repair & Workshop",
    "Electrical & Generator Substation",
    "Boiler & Compressor Room",
  ],
  "Material Control (MCD)": [
    "Accessories Store (MCD)",
    "Fabric Godown / Store",
    "General Utility Store",
  ],
  "Human Resources": [
    "HR, Admin and Compliance",
    "Timekeeping & Attendance",
    "Security & Safety Wing",
  ],
};

const INITIAL_ROSTER_PERSONNEL: RosterPersonnel[] = [
  {
    id: "2019004521",
    name: "Md. Ruhul Amin",
    dept: "Security",
    section: "Main Gate & Perimeter Guard",
    designation: "Head Security Guard",
    type: "Permanent",
    unit: "PSL",
    line: "Gate-01",
    status: "Working",
  },
  {
    id: "2021008922",
    name: "Kazi Delwar Hossain",
    dept: "Security",
    section: "Main Gate & Perimeter Guard",
    designation: "Sr. Security Guard",
    type: "Permanent",
    unit: "PSL",
    line: "Gate-01",
    status: "Working",
  },
  {
    id: "2024003310",
    name: "Nazmul Huda",
    dept: "Security",
    section: "Main Gate & Perimeter Guard",
    designation: "Security Guard",
    type: "Contractual",
    unit: "PSL",
    line: "Gate-02",
    status: "Working",
  },
  {
    id: "2020006734",
    name: "Md. Anisur Rahman",
    dept: "Security",
    section: "CCTV Monitoring & Control Room",
    designation: "CCTV In-Charge",
    type: "Permanent",
    unit: "PSL",
    line: "Control-A",
    status: "Working",
  },
  {
    id: "2022007819",
    name: "Sultan Mahmud",
    dept: "Security",
    section: "CCTV Monitoring & Control Room",
    designation: "Surveillance Executive",
    type: "Permanent",
    unit: "PSL",
    line: "Control-A",
    status: "Working",
  },
  {
    id: "2018003411",
    name: "Md. Jasim Uddin",
    dept: "Security",
    section: "Factory & Production Floor Security",
    designation: "Security Supervisor",
    type: "Permanent",
    unit: "PSL",
    line: "Floor-01",
    status: "Working",
  },
  {
    id: "2023009102",
    name: "Shariful Islam",
    dept: "Security",
    section: "Factory & Production Floor Security",
    designation: "Security Guard",
    type: "Permanent",
    unit: "PSL",
    line: "Floor-02",
    status: "Working",
  },
  {
    id: "2021005678",
    name: "Abdul Mannan",
    dept: "Security",
    section: "Warehouse & MCD Store Security",
    designation: "MCD Guard",
    type: "Permanent",
    unit: "PSL",
    line: "MCD-01",
    status: "Working",
  },
  {
    id: "2022008432",
    name: "Md. Kabir Hossain",
    dept: "Security",
    section: "Night Patrol & Vigilance Team",
    designation: "Patrol Officer",
    type: "Permanent",
    unit: "PSL",
    line: "Patrol-01",
    status: "Working",
  },
  {
    id: "2020009845",
    name: "Md. Harun Ur Rashid",
    dept: "Security",
    section: "Night Patrol & Vigilance Team",
    designation: "Armed Security Guard",
    type: "Permanent",
    unit: "PSL",
    line: "Patrol-02",
    status: "Working",
  },
  {
    id: "2023001290",
    name: "Faruk Ahmed",
    dept: "Security",
    section: "Executive & Visitor Protocol",
    designation: "Security Protocol Officer",
    type: "Permanent",
    unit: "PSL",
    line: "VIP-Wing",
    status: "Working",
  },
  // Sample entries for other unlocked departments
  {
    id: "2023045146",
    name: "Asif Hossain",
    dept: "Fabric Dyeing",
    section: "Dyeing Planning",
    designation: "Dyeing Planning Officer",
    type: "Permanent",
    unit: "PAL",
    line: "Line-01",
    status: "Working",
  },
  {
    id: "2019003881",
    name: "Mizanur Rahman",
    dept: "Fabric Dyeing",
    section: "Dyeing Planning",
    designation: "Sr. Planning Officer",
    type: "Permanent",
    unit: "PAL",
    line: "Line-02",
    status: "Working",
  },
  {
    id: "2024001188",
    name: "Kamrul Islam",
    dept: "Sewing",
    section: "Sewing Line-01",
    designation: "Senior Operator",
    type: "Permanent",
    unit: "PSL",
    line: "Line-01",
    status: "Working",
  },
];

const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Shift and Day Status Legend
const SHIFT_CODES: Record<
  string,
  { label: string; full: string; time: string; badgeClass: string }
> = {
  D: {
    label: "D",
    full: "Day Guard",
    time: "06:00 AM – 06:00 PM",
    badgeClass: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/40 font-bold",
  },
  N: {
    label: "N",
    full: "Night Guard",
    time: "06:00 PM – 06:00 AM",
    badgeClass: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-400/40 font-bold",
  },
  M: {
    label: "M",
    full: "Morning Shift",
    time: "06:00 AM – 02:00 PM",
    badgeClass: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40 font-bold",
  },
  E: {
    label: "E",
    full: "Evening Shift",
    time: "02:00 PM – 10:00 PM",
    badgeClass: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 font-bold",
  },
  G: {
    label: "G",
    full: "General Shift",
    time: "08:00 AM – 05:00 PM",
    badgeClass: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40 font-bold",
  },
  H: {
    label: "H",
    full: "Holiday",
    time: "Weekend / Day Off",
    badgeClass: "bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-400/50 font-black",
  },
  GH: {
    label: "GH",
    full: "Govt Holiday",
    time: "Public Holiday",
    badgeClass: "bg-[#c2db42]/40 text-slate-900 dark:text-slate-100 border border-[#c2db42] font-black",
  },
  W: {
    label: "W",
    full: "Regular Duty",
    time: "Duty Shift",
    badgeClass: "bg-muted text-muted-foreground/70 font-semibold",
  },
};

export const SHIFT_TYPE_OPTIONS = [
  { value: "D", label: "D — Day Guard (12h: 06:00 - 18:00)" },
  { value: "N", label: "N — Night Guard (12h: 18:00 - 06:00)" },
  { value: "M", label: "M — Morning Shift (06:00 - 14:00)" },
  { value: "E", label: "E — Evening Shift (14:00 - 22:00)" },
  { value: "G", label: "G — General Shift (09:00 - 18:00)" },
  { value: "H", label: "H — Weekly Holiday" },
  { value: "GH", label: "GH — Govt Holiday" },
  { value: "W", label: "W — Regular Duty" },
];

function SecurityRosterPage() {
  // Left Config Filter Parameters (Roster Generation Boundaries)
  const [empIdsInput, setEmpIdsInput] = useState(
    "2019004521, 2021008922, 2024003310, 2020006734, 2022007819, 2018003411"
  );
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [selectedDept, setSelectedDept] = useState("Security"); // Unlocked, default Security
  const [subDept, setSubDept] = useState("ALL");

  // Right Quick Override Controls (Day & Shift Overrides)
  const [overrideStartDate, setOverrideStartDate] = useState("2026-11-01");
  const [overrideEndDate, setOverrideEndDate] = useState("2026-11-30");
  const [overrideShiftType, setOverrideShiftType] = useState("D");
  const [weekendDay, setWeekendDay] = useState("Friday");

  // Selected personnel in the matrix table
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.size === filteredPersonnel.length && filteredPersonnel.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredPersonnel.map((p) => p.id)));
    }
  };

  // Available sections based on selected department
  const availableSections = useMemo(() => {
    if (selectedDept === "ALL" || selectedDept === "All") {
      const all: string[] = [];
      Object.values(DEPARTMENTS_WITH_SECTIONS).forEach((list) => all.push(...list));
      return Array.from(new Set(all));
    }
    return DEPARTMENTS_WITH_SECTIONS[selectedDept] || DEPARTMENTS_WITH_SECTIONS["Security"];
  }, [selectedDept]);

  // Days in current selected month
  const daysInMonth = useMemo(() => {
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear, 10) || 2026;
    return new Date(yearNum, monthIndex + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  // Roster matrix state: maps empId -> Array of 31 status strings
  const [rosterMatrix, setRosterMatrix] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    INITIAL_ROSTER_PERSONNEL.forEach((emp, index) => {
      // Default security schedule pattern: alternating Day (D) and Night (N) with weekly Holiday (H)
      const schedule = Array(31).fill("W");
      for (let d = 0; d < 31; d++) {
        // Fridays default to Holiday (H)
        if ((d + 1) % 7 === 6) {
          schedule[d] = "H";
        } else if (index % 2 === 0) {
          schedule[d] = "D"; // Day Guard
        } else {
          schedule[d] = "N"; // Night Guard
        }
      }
      initial[emp.id] = schedule;
    });
    return initial;
  });

  // Calculate parsed list of comma-separated active IDs
  const activeIds = useMemo(() => {
    return empIdsInput
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }, [empIdsInput]);

  // Filter roster personnel by selection boundaries
  const filteredPersonnel = useMemo(() => {
    return INITIAL_ROSTER_PERSONNEL.filter((emp) => {
      // Comma separator ID match
      if (activeIds.length > 0 && !activeIds.includes(emp.id)) return false;
      // Department filter (unlocked)
      if (selectedDept !== "ALL" && selectedDept !== "All" && emp.dept !== selectedDept)
        return false;
      // Section / Sub Dept
      if (subDept !== "ALL" && subDept !== "All" && emp.section !== subDept)
        return false;
      return true;
    });
  }, [activeIds, selectedDept, subDept]);

  // Pre-fill roster with weekend holidays when month or year changes
  useEffect(() => {
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear, 10) || 2026;
    const daysCount = new Date(yearNum, monthIndex + 1, 0).getDate();

    const fridayIndices: number[] = [];
    for (let d = 1; d <= daysCount; d++) {
      const dt = new Date(yearNum, monthIndex, d);
      if (dt.getDay() === 5) {
        // Friday
        fridayIndices.push(d - 1);
      }
    }

    setRosterMatrix((prev) => {
      const next = { ...prev };
      INITIAL_ROSTER_PERSONNEL.forEach((emp, index) => {
        const empSchedule = Array(31).fill("W");
        for (let idx = 0; idx < daysCount; idx++) {
          if (fridayIndices.includes(idx)) {
            empSchedule[idx] = "H";
          } else if (index % 2 === 0) {
            empSchedule[idx] = "D"; // 12h Day
          } else {
            empSchedule[idx] = "N"; // 12h Night
          }
        }
        next[emp.id] = empSchedule;
      });
      return next;
    });
  }, [selectedMonth, selectedYear]);

  // Action: Apply Shift Type to Date Range (Start Date to End Date)
  const handleApplyShiftToDateRange = (shiftToApply?: string) => {
    const shift = shiftToApply || overrideShiftType;
    if (!overrideStartDate || !overrideEndDate) {
      toast.error("Please select both Start Date and End Date.");
      return;
    }

    const start = new Date(overrideStartDate);
    const end = new Date(overrideEndDate);

    if (start > end) {
      toast.error("Start Date cannot be after End Date.");
      return;
    }

    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear, 10) || 2026;

    // Find all day indices (0 to daysInMonth - 1) matching the date range in this month
    const dayIndices: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const current = new Date(yearNum, monthIndex, d);
      current.setHours(0, 0, 0, 0);
      const s = new Date(start);
      s.setHours(0, 0, 0, 0);
      const e = new Date(end);
      e.setHours(0, 0, 0, 0);

      if (current >= s && current <= e) {
        dayIndices.push(d - 1);
      }
    }

    if (dayIndices.length === 0) {
      toast.warning(
        `Selected date range does not match any days in ${selectedMonth} ${selectedYear}.`
      );
      return;
    }

    const targetList =
      selectedRowIds.size > 0
        ? filteredPersonnel.filter((emp) => selectedRowIds.has(emp.id))
        : filteredPersonnel;

    setRosterMatrix((prev) => {
      const next = { ...prev };
      targetList.forEach((emp) => {
        const empSchedule = [...(next[emp.id] || Array(31).fill("W"))];
        dayIndices.forEach((idx) => {
          empSchedule[idx] = shift;
        });
        next[emp.id] = empSchedule;
      });
      return next;
    });

    toast.success(
      `Applied Shift '${shift}' from ${overrideStartDate} to ${overrideEndDate} (${dayIndices.length} days) for ${targetList.length} personnel.`
    );
  };

  // Action: Apply Weekend Day Holiday
  const handleApplyWeekendHoliday = () => {
    const monthIndex = monthsList.indexOf(selectedMonth);
    const yearNum = parseInt(selectedYear, 10) || 2026;
    const dayIndicesToUpdate: number[] = [];

    const dayMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const targetDayIndex = dayMap[weekendDay] ?? 5;

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yearNum, monthIndex, d);
      if (dt.getDay() === targetDayIndex) {
        dayIndicesToUpdate.push(d - 1);
      }
    }

    const targetList =
      selectedRowIds.size > 0
        ? filteredPersonnel.filter((emp) => selectedRowIds.has(emp.id))
        : filteredPersonnel;

    setRosterMatrix((prev) => {
      const next = { ...prev };
      targetList.forEach((emp) => {
        const empSchedule = [...(next[emp.id] || Array(31).fill("W"))];
        dayIndicesToUpdate.forEach((idx) => {
          empSchedule[idx] = "H";
        });
        next[emp.id] = empSchedule;
      });
      return next;
    });
    toast.success(
      `Applied Weekend Holiday (H) to all ${weekendDay}s in ${selectedMonth} ${selectedYear} for ${targetList.length} personnel!`
    );
  };

  // Action: Auto Rotational 12h Day/Night Shift Distribution
  const handleAutoSecurityRotation = () => {
    const targetList =
      selectedRowIds.size > 0
        ? filteredPersonnel.filter((emp) => selectedRowIds.has(emp.id))
        : filteredPersonnel;

    setRosterMatrix((prev) => {
      const next = { ...prev };
      targetList.forEach((emp, idx) => {
        const empSchedule = [...(next[emp.id] || Array(31).fill("W"))];
        for (let d = 0; d < daysInMonth; d++) {
          if (empSchedule[d] === "H" || empSchedule[d] === "GH") continue;
          // Alternate D and N every 7 days (weekly rotation)
          const week = Math.floor(d / 7);
          const isDay = (idx + week) % 2 === 0;
          empSchedule[d] = isDay ? "D" : "N";
        }
        next[emp.id] = empSchedule;
      });
      return next;
    });
    toast.success(`Applied weekly alternating 12h Day/Night rotation for ${targetList.length} personnel!`);
  };

  // Bottom action: UPDATE ROSTER
  const handleUpdateRoster = () => {
    const targetCount = selectedRowIds.size > 0 ? selectedRowIds.size : filteredPersonnel.length;
    toast.success(
      `Security Roster schedule successfully updated & saved for ${targetCount} personnel for ${selectedMonth} ${selectedYear}!`
    );
  };

  // Bottom action: DELETE ROSTER
  const handleDeleteRoster = () => {
    const targetList =
      selectedRowIds.size > 0
        ? filteredPersonnel.filter((emp) => selectedRowIds.has(emp.id))
        : filteredPersonnel;

    if (
      confirm(
        `Are you sure you want to reset roster configuration for ${targetList.length} personnel to default work days?`
      )
    ) {
      setRosterMatrix((prev) => {
        const next = { ...prev };
        targetList.forEach((emp) => {
          next[emp.id] = Array(31).fill("W");
        });
        return next;
      });
      toast.info(`Security roster schedule has been reset for ${targetList.length} personnel.`);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Emp ID",
      "Employee Name",
      "Department",
      "Section",
      "Designation",
      ...Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`),
    ];

    const rows = filteredPersonnel.map((emp) => {
      const schedule = rosterMatrix[emp.id] || Array(31).fill("W");
      return [
        emp.id,
        `"${emp.name}"`,
        `"${emp.dept}"`,
        `"${emp.section}"`,
        `"${emp.designation}"`,
        ...schedule.slice(0, daysInMonth),
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Security_Roster_${selectedDept}_${selectedMonth}_${selectedYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Security roster CSV exported.");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6 w-full">
          {/* Breadcrumbs and Page Title Header (matching /create-roster style) */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Shift Management</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Security Roster</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2.5">
                <ShieldCheck className="size-6 text-primary" />
                <span>Security Roster Scheduling Matrix</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-3.5 py-1.5 rounded-full border border-border/50 font-mono">
                Month: {selectedMonth} {selectedYear}
              </span>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="size-3.5 text-muted-foreground" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Configuration Grid Panel (Two main cards side by side: Left 8 cols, Right 4 cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Card: General Criteria Selection */}
            <div className="xl:col-span-8 bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <SlidersHorizontal className="size-3.5" />
                  <span>Roster Generation Boundaries</span>
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/50">
                  Left Controls
                </span>
              </div>

              {/* Roster Criteria Grid */}
              <div className="space-y-4">
                {/* Employee ID textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Employee ID (Multiple)
                    </label>
                    <span className="text-[9.5px] text-primary/70 font-medium">comma separated</span>
                  </div>
                  <textarea
                    value={empIdsInput}
                    onChange={(e) => setEmpIdsInput(e.target.value)}
                    placeholder="use comma as separator"
                    rows={2}
                    className="w-full h-16 p-2.5 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary placeholder:text-muted-foreground/50 resize-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Year Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Year
                    </label>
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Month
                    </label>
                    <div className="relative">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                      >
                        {monthsList.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Department (UNLOCKED with Security as default) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDept}
                        onChange={(e) => {
                          setSelectedDept(e.target.value);
                          setSubDept("ALL");
                        }}
                        className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer text-primary"
                      >
                        {Object.keys(DEPARTMENTS_WITH_SECTIONS).map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                        <option value="ALL">ALL Departments</option>
                      </select>
                      <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Sub Department / Section */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Sub Department / Section
                    </label>
                    <div className="relative">
                      <select
                        value={subDept}
                        onChange={(e) => setSubDept(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                      >
                        <option value="ALL">ALL Sections</option>
                        {availableSections.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Day & Weekend Override Selector */}
            <div className="xl:col-span-4 bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                  Day &amp; Shift Overrides
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/50">
                  Right Controls
                </span>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={overrideStartDate}
                    onChange={(e) => setOverrideStartDate(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={overrideEndDate}
                    min={overrideStartDate}
                    onChange={(e) => setOverrideEndDate(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Select Shift Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Select Shift Type
                </label>
                <div className="relative">
                  <select
                    value={overrideShiftType}
                    onChange={(e) => setOverrideShiftType(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer text-primary"
                  >
                    {SHIFT_TYPE_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Apply Shift to Date Range Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleApplyShiftToDateRange()}
                  className="w-full h-9 bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Apply Shift to Date Range</span>
                </button>

                {/* Quick Override Badges */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyShiftToDateRange("D")}
                    className="h-7.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] rounded-md transition uppercase tracking-wider cursor-pointer"
                    title="Apply 12-Hour Day Guard (D) to Range"
                  >
                    D (Day)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyShiftToDateRange("N")}
                    className="h-7.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] rounded-md transition uppercase tracking-wider cursor-pointer"
                    title="Apply 12-Hour Night Guard (N) to Range"
                  >
                    N (Night)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyShiftToDateRange("H")}
                    className="h-7.5 bg-[#c2db42] hover:bg-[#b5cc38] text-slate-900 font-extrabold text-[10px] rounded-md transition uppercase tracking-wider cursor-pointer"
                    title="Apply Holiday (H) to Range"
                  >
                    H
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyShiftToDateRange("W")}
                    className="h-7.5 bg-[#f57c00] hover:bg-[#e65100] text-white font-extrabold text-[10px] rounded-md transition uppercase tracking-wider cursor-pointer"
                    title="Reset to Regular Work (W)"
                  >
                    CLEAN
                  </button>
                </div>
              </div>

              {/* Select A Weekend */}
              <div className="space-y-2 pt-3 border-t border-border/40">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Select A Weekend Day
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select
                      value={weekendDay}
                      onChange={(e) => setWeekendDay(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                    >
                      {[
                        "Friday",
                        "Saturday",
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                      ].map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="size-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyWeekendHoliday}
                    className="px-3 h-9 bg-muted hover:bg-border/60 text-foreground font-bold text-xs rounded-lg transition border border-border/60 cursor-pointer"
                  >
                    Apply Weekend
                  </button>
                </div>
              </div>

              {/* Auto 12h Day / Night Rotation helper */}
              <div className="pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={handleAutoSecurityRotation}
                  className="w-full h-9 px-3 rounded-lg bg-muted/60 hover:bg-muted border border-border/60 text-xs font-bold text-primary flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className="size-3 text-primary" />
                  <span>Auto 12h Day / Night Rotation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Table Card: Generated Scheduler Roster Calendar */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">
                  Security Roster Schedule Matrix
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Dynamic Live Matrix (1–{daysInMonth}) • {filteredPersonnel.length} Personnel
                  {selectedRowIds.size > 0 && (
                    <span className="ml-2 font-bold text-primary">
                      ({selectedRowIds.size} Selected)
                    </span>
                  )}
                </span>
              </div>

              {/* Badge Legend */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                <span className="text-muted-foreground font-bold mr-1">Legend:</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
                  D: Day (12h)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold">
                  N: Night (12h)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold">
                  M: Morning
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                  E: Evening
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500/25 text-rose-700 dark:text-rose-300 font-bold">
                  H: Holiday
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#c2db42]/40 text-slate-900 dark:text-slate-100 font-bold">
                  GH: Govt Holiday
                </span>
              </div>
            </div>

            {/* Matrix Data Spreadsheet */}
            <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[55vh]">
              <table className="w-full border-collapse text-[10.5px] text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap sticky top-0 z-10">
                    <th className="px-2 py-2.5 font-extrabold w-10 border-r border-border/30 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredPersonnel.length > 0 &&
                          selectedRowIds.size === filteredPersonnel.length
                        }
                        onChange={handleToggleSelectAll}
                        className="size-3.5 rounded cursor-pointer accent-primary"
                        title="Select All"
                      />
                    </th>
                    <th className="px-3 py-2.5 font-extrabold w-24 border-r border-border/30 text-center">
                      Emp ID
                    </th>
                    <th className="px-3 py-2.5 font-extrabold w-36 border-r border-border/30">
                      Employee Name
                    </th>
                    <th className="px-3 py-2.5 font-extrabold w-28 border-r border-border/30">
                      Section
                    </th>
                    <th className="px-3 py-2.5 font-extrabold w-28 border-r border-border/30">
                      Designation
                    </th>

                    {/* Render days 1 to daysInMonth columns */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                      <th
                        key={d}
                        className="px-1.5 py-2.5 font-extrabold text-center w-8 border-r border-border/30"
                      >
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredPersonnel.map((emp) => {
                    const schedule = rosterMatrix[emp.id] || Array(31).fill("W");
                    const isRowSelected = selectedRowIds.has(emp.id);

                    return (
                      <tr
                        key={emp.id}
                        className={`transition duration-75 whitespace-nowrap ${
                          isRowSelected
                            ? "bg-primary/10 dark:bg-primary/20 hover:bg-primary/15"
                            : "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]"
                        }`}
                      >
                        <td className="px-2 py-2 text-center border-r border-border/20">
                          <input
                            type="checkbox"
                            checked={isRowSelected}
                            onChange={() => handleToggleRow(emp.id)}
                            className="size-3.5 rounded cursor-pointer accent-primary"
                          />
                        </td>
                        <td className="px-3 py-2 font-bold font-mono text-center text-foreground border-r border-border/20">
                          {emp.id}
                        </td>
                        <td className="px-3 py-2 font-bold text-foreground/80 border-r border-border/20">
                          {emp.name}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground border-r border-border/20">
                          {emp.section}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground border-r border-border/20">
                          {emp.designation}
                        </td>

                        {/* Roster schedule cells */}
                        {Array.from({ length: daysInMonth }, (_, idx) => {
                          const dayStatus = schedule[idx] || "W";
                          const codeInfo = SHIFT_CODES[dayStatus] || SHIFT_CODES["W"];

                          return (
                            <td key={idx} className="p-0.5 border-r border-border/20 text-center">
                              <div
                                onClick={() => {
                                  // Click row day cell directly to toggle between D -> N -> H -> W
                                  setRosterMatrix((prev) => {
                                    const next = { ...prev };
                                    const sch = [...(next[emp.id] || Array(31).fill("W"))];
                                    const curr = sch[idx] || "W";
                                    let nextStatus = "D";
                                    if (curr === "D") nextStatus = "N";
                                    else if (curr === "N") nextStatus = "H";
                                    else if (curr === "H") nextStatus = "W";
                                    else nextStatus = "D";
                                    sch[idx] = nextStatus;
                                    next[emp.id] = sch;
                                    return next;
                                  });
                                }}
                                className={`w-6 h-6 mx-auto rounded flex items-center justify-center font-bold text-[9px] shadow-2xs cursor-pointer select-none transition ${codeInfo.badgeClass}`}
                                title={`${emp.name} - Day ${idx + 1}: ${codeInfo.full} (${codeInfo.time})`}
                              >
                                {dayStatus}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {filteredPersonnel.length === 0 && (
                    <tr>
                      <td
                        colSpan={daysInMonth + 5}
                        className="px-4 py-12 text-center text-muted-foreground font-semibold"
                      >
                        No personnel found matching the specified filter criteria. Try adjusting the boundaries above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleUpdateRoster}
                  className="h-9 px-6 bg-[#ab47bc] hover:bg-[#9c27b0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider cursor-pointer"
                >
                  UPDATE ROSTER
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRoster}
                  className="h-9 px-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider cursor-pointer"
                >
                  RESET ROSTER
                </button>
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Click any individual day cell to toggle shift: <span className="font-bold">D → N → H → W</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
