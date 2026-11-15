import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/earn-leave-process")({
  head: () => ({
    meta: [
      { title: "Earn Leave Process — CRIPTON" },
      {
        name: "description",
        content:
          "Accrue, calculate, scale, and process cash compensation for employee earned leaves.",
      },
    ],
  }),
  component: EarnLeaveProcessPage,
});

interface EarnLeaveRecord {
  sl: number;
  empId: string;
  empName: string;
  type: string;
  department: string;
  designation: string;
  joinDate: string;
  gross: number;
  presentDays: number;
  earnedDays: number;
  earnedDaysCf: number;
  takenEl: number;
  takenElPrev: number;
}

const initialRecords: EarnLeaveRecord[] = [
  {
    sl: 1,
    empId: "2025013004",
    empName: "Javed Mia",
    type: "Office Staff",
    department: "HR, Admin and Compliance",
    designation: "Helper (Cook)",
    joinDate: "12/01/2019",
    gross: 21000.0,
    presentDays: 244,
    earnedDays: 13.56,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 2,
    empId: "2025013005",
    empName: "Mohammed Tareq Safa",
    type: "Office Staff",
    department: "MIS",
    designation: "AGM",
    joinDate: "15/06/2020",
    gross: 0.0,
    presentDays: 274,
    earnedDays: 15.22,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 3,
    empId: "2021022904",
    empName: "Rakibul Islam",
    type: "Worker",
    department: "HR, Admin and Compliance",
    designation: "Security Guard",
    joinDate: "12/02/2021",
    gross: 15700.0,
    presentDays: 266,
    earnedDays: 14.78,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 4,
    empId: "2021022905",
    empName: "Md. Monjur Alam",
    type: "Worker",
    department: "HR, Admin and Compliance",
    designation: "Driver",
    joinDate: "18/02/2021",
    gross: 21500.0,
    presentDays: 266,
    earnedDays: 14.78,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 5,
    empId: "2021093542",
    empName: "Zakir Hossain",
    type: "Office Executive",
    department: "Business Automation (HR)",
    designation: "Executive",
    joinDate: "25/09/2021",
    gross: 31500.0,
    presentDays: 263,
    earnedDays: 14.61,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 6,
    empId: "2022035599",
    empName: "Dipon Saha",
    type: "Office Executive",
    department: "Business Automation (HR)",
    designation: "Manager",
    joinDate: "01/01/2022",
    gross: 67000.0,
    presentDays: 249,
    earnedDays: 13.83,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 7,
    empId: "2022043632",
    empName: "Md. Xabil",
    type: "Office Staff",
    department: "HR, Admin and Compliance",
    designation: "Asst. Cook",
    joinDate: "29/10/2022",
    gross: 18000.0,
    presentDays: 268,
    earnedDays: 14.89,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 8,
    empId: "2023024031",
    empName: "Rasin Mia",
    type: "Office Staff",
    department: "HR, Admin and Compliance",
    designation: "Electrician",
    joinDate: "01/02/2023",
    gross: 14000.0,
    presentDays: 252,
    earnedDays: 14.0,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 9,
    empId: "2023043909",
    empName: "Md. Azharur Rider",
    type: "Office Executive",
    department: "Business Development",
    designation: "Manager",
    joinDate: "01/08/2023",
    gross: 60000.0,
    presentDays: 249,
    earnedDays: 13.83,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 10,
    empId: "2023043910",
    empName: "Tahmid Afsar",
    type: "Office Executive",
    department: "Business Innovation",
    designation: "Deputy Manager",
    joinDate: "01/08/2023",
    gross: 67000.0,
    presentDays: 247,
    earnedDays: 13.72,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 11,
    empId: "2023044074",
    empName: "Md. Anwar Hossain",
    type: "Office Executive",
    department: "Core Development",
    designation: "Asst. Manager",
    joinDate: "06/01/2023",
    gross: 62000.0,
    presentDays: 264,
    earnedDays: 14.67,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 12,
    empId: "2023044412",
    empName: "Tanvir Rahaman Shuvo",
    type: "Office Executive",
    department: "Deputy Manager",
    designation: "Deputy Manager",
    joinDate: "04/01/2023",
    gross: 58000.0,
    presentDays: 248,
    earnedDays: 13.78,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 13,
    empId: "2023044478",
    empName: "Md. Arib Islam",
    type: "Office Executive",
    department: "Business Innovation",
    designation: "Deputy Manager",
    joinDate: "16/06/2023",
    gross: 59000.0,
    presentDays: 281,
    earnedDays: 15.61,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 14,
    empId: "2023044543",
    empName: "Arif Hossain",
    type: "Office Staff",
    department: "HR, Admin and Compliance",
    designation: "Driver",
    joinDate: "04/10/2023",
    gross: 21200.0,
    presentDays: 266,
    earnedDays: 14.78,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 15,
    empId: "2023044561",
    empName: "Sohanoor Rahman Sohan",
    type: "Office Executive",
    department: "HR, Admin and Compliance",
    designation: "Executive",
    joinDate: "07/11/2023",
    gross: 27000.0,
    presentDays: 268,
    earnedDays: 14.89,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 16,
    empId: "2024014911",
    empName: "Sumaya Shrifa",
    type: "Office Executive",
    department: "Deputy Manager",
    designation: "Deputy Manager",
    joinDate: "01/01/2024",
    gross: 67000.0,
    presentDays: 214,
    earnedDays: 11.89,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 17,
    empId: "2024014968",
    empName: "Md. Mahmoor Hossain Shomoy",
    type: "Office Executive",
    department: "Business Innovation",
    designation: "Sr. Executive",
    joinDate: "16/01/2024",
    gross: 48000.0,
    presentDays: 268,
    earnedDays: 14.89,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 18,
    empId: "2024015036",
    empName: "Hanif Uddin",
    type: "Office Executive",
    department: "Business Innovation",
    designation: "Sr. Executive",
    joinDate: "01/02/2024",
    gross: 38000.0,
    presentDays: 247,
    earnedDays: 13.72,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 19,
    empId: "2024015107",
    empName: "S.M Rabbi Rahman Tuhin",
    type: "Office Executive",
    department: "Core Development",
    designation: "Asst. Manager",
    joinDate: "01/03/2024",
    gross: 70000.0,
    presentDays: 267,
    earnedDays: 14.83,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 20,
    empId: "2024015135",
    empName: "Fatima Khanabun Druba",
    type: "Office Executive",
    department: "Implementation & Business Analysis",
    designation: "Asst. Manager",
    joinDate: "17/03/2024",
    gross: 50000.0,
    presentDays: 264,
    earnedDays: 14.67,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 21,
    empId: "2024015139",
    empName: "Irfan Hossain",
    type: "Office Executive",
    department: "Implementation & Business Analysis",
    designation: "Jr. Executive",
    joinDate: "17/03/2024",
    gross: 26000.0,
    presentDays: 262,
    earnedDays: 14.56,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 22,
    empId: "2024015218",
    empName: "Md. Sadmanur Islam Shahir",
    type: "Office Executive",
    department: "Business Innovation",
    designation: "Jr. Executive",
    joinDate: "01/05/2024",
    gross: 27000.0,
    presentDays: 254,
    earnedDays: 14.11,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 23,
    empId: "2024015231",
    empName: "Md. Al Amin",
    type: "Office Executive",
    department: "Core Development",
    designation: "Sr. Executive",
    joinDate: "07/05/2024",
    gross: 51000.0,
    presentDays: 255,
    earnedDays: 14.17,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 24,
    empId: "2024015413",
    empName: "Dipon Kumar Gunda",
    type: "Office Executive",
    department: "Business Development",
    designation: "Executive",
    joinDate: "14/10/2024",
    gross: 41000.0,
    presentDays: 268,
    earnedDays: 14.89,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 25,
    empId: "2024015438",
    empName: "Md. Mahidul Haque",
    type: "Office Executive",
    department: "Core Development",
    designation: "Manager",
    joinDate: "15/10/2024",
    gross: 90000.0,
    presentDays: 263,
    earnedDays: 14.61,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 26,
    empId: "2024015501",
    empName: "Al Riyad Karim",
    type: "Office Executive",
    department: "Business Innovation",
    designation: "Asst. Manager",
    joinDate: "12/12/2024",
    gross: 60000.0,
    presentDays: 268,
    earnedDays: 14.89,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 27,
    empId: "2025015271",
    empName: "Md. Maruf Hossain",
    type: "Office Executive",
    department: "Business Development",
    designation: "Asst. Manager",
    joinDate: "05/01/2025",
    gross: 58000.0,
    presentDays: 244,
    earnedDays: 13.56,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 28,
    empId: "2025015340",
    empName: "Miraz Uddin",
    type: "Office Staff",
    department: "HR, Admin and Compliance",
    designation: "Jr. Executive",
    joinDate: "20/01/2025",
    gross: 24000.0,
    presentDays: 255,
    earnedDays: 14.17,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 29,
    empId: "2025015372",
    empName: "Md. Jahid Hasan Polok",
    type: "Office Executive",
    department: "Core Development",
    designation: "Sr. Executive",
    joinDate: "22/01/2025",
    gross: 46000.0,
    presentDays: 235,
    earnedDays: 13.06,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 30,
    empId: "2025015403",
    empName: "Md. Shahriar Alahi Khan",
    type: "Office Executive",
    department: "Business Development",
    designation: "Asst. Manager",
    joinDate: "01/02/2025",
    gross: 60000.0,
    presentDays: 223,
    earnedDays: 12.39,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
  {
    sl: 31,
    empId: "2025015456",
    empName: "Md Rahat Hossain",
    type: "Office Executive",
    department: "Database Administrator (DBA)",
    designation: "Asst. Manager",
    joinDate: "06/03/2025",
    gross: 67000.0,
    presentDays: 205,
    earnedDays: 11.39,
    earnedDaysCf: 0,
    takenEl: 0,
    takenElPrev: 0,
  },
];

function EarnLeaveProcessPage() {
  const [processType, setProcessType] = useState<"year" | "month" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("type");
      if (t === "year" || t === "month") {
        setProcessType(t);
      }
    }
  }, []);

  // Database States
  const [records] = useState<EarnLeaveRecord[]>(initialRecords);

  // Filter Form States (defaults matching screenshot)
  const [year, setYear] = useState("2024");
  const [dateInput, setDateInput] = useState("31/12/2025");
  const [statusFilter, setStatusFilter] = useState("Working");
  const [percentInput, setPercentInput] = useState("100");
  const [empType, setEmpType] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [unit, setUnit] = useState("");
  const [empIdFilter, setEmpIdFilter] = useState("");

  // Applied Filter State
  const [appliedFilters, setAppliedFilters] = useState({
    year: "2024",
    dateInput: "31/12/2025",
    statusFilter: "Working",
    percentInput: "100",
    empType: "",
    department: "",
    section: "",
    unit: "",
    empIdFilter: "",
  });

  const handleSearch = () => {
    setAppliedFilters({
      year,
      dateInput,
      statusFilter,
      percentInput,
      empType,
      department,
      section,
      unit,
      empIdFilter,
    });
  };

  const handleReset = () => {
    setYear("2024");
    setDateInput("31/12/2025");
    setStatusFilter("Working");
    setPercentInput("100");
    setEmpType("");
    setDepartment("");
    setSection("");
    setUnit("");
    setEmpIdFilter("");
    setAppliedFilters({
      year: "2024",
      dateInput: "31/12/2025",
      statusFilter: "Working",
      percentInput: "100",
      empType: "",
      department: "",
      section: "",
      unit: "",
      empIdFilter: "",
    });
  };

  // Distinct dropdown lists derived from records
  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.department && set.add(r.department));
    return Array.from(set).sort();
  }, [records]);

  const empTypeOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.type && set.add(r.type));
    return Array.from(set).sort();
  }, [records]);

  // Real-time calculated table rows
  const computedRows = useMemo(() => {
    const scalePercent = parseFloat(appliedFilters.percentInput) || 100;

    return records
      .filter((r) => {
        if (
          appliedFilters.empIdFilter.trim() &&
          r.empId !== appliedFilters.empIdFilter.trim() &&
          !r.empName.toLowerCase().includes(appliedFilters.empIdFilter.trim().toLowerCase())
        ) {
          return false;
        }

        if (appliedFilters.department && r.department !== appliedFilters.department) {
          return false;
        }

        if (appliedFilters.empType && r.type !== appliedFilters.empType) {
          return false;
        }

        return true;
      })
      .map((r, index) => {
        // Per Day Amount = Gross / 30
        const perDayAmount = r.gross > 0 ? Math.round((r.gross / 30) * 100) / 100 : 0.0;

        // Total EL = Earned Days + Earned Days CF - Taken EL - Taken EL Prev
        const totalEl =
          Math.round((r.earnedDays + r.earnedDaysCf - r.takenEl - r.takenElPrev) * 100) / 100;

        // Total Amount = Total EL * Per Day Amount
        const totalAmount = Math.round(totalEl * perDayAmount * 100) / 100;

        // Pay Day = Total EL * (scalePercent / 100)
        const payDay = Math.round(totalEl * (scalePercent / 100) * 100) / 100;

        // Net Pay = Pay Day * Per Day Amount
        const netPay = Math.round(payDay * perDayAmount * 100) / 100;

        return {
          ...r,
          displaySl: index + 1,
          perDayAmount,
          totalEl,
          totalAmount,
          percent: scalePercent,
          payDay,
          netPay,
        };
      });
  }, [records, appliedFilters]);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-7 space-y-4 max-w-[1700px] w-full mx-auto">
          {/* Breadcrumb matching image top-left */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium select-none">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span>Leave</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Earn Leave Process
              {processType === "year" ? "" : processType === "month" ? " (Month)" : ""}
            </span>
          </div>

          {/* Filter Card */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-all">
            {/* Row 1: YEAR, DATE, STATUS, PERCENT (%) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3.5">
              {/* YEAR * */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  YEAR <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    className="w-full h-8.5 pl-9 pr-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* DATE * */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  DATE <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    placeholder="31/12/2025"
                    className="w-full h-8.5 px-3 pr-9 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  />
                  <Calendar className="size-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  STATUS
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="Working">Working</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>

              {/* PERCENT (%) * */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  PERCENT (%) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={percentInput}
                  onChange={(e) => setPercentInput(e.target.value)}
                  placeholder="100"
                  className="w-full h-8.5 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Row 2: EMPLOYEE TYPE, DEPARTMENT, SECTION, UNIT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3.5">
              {/* EMPLOYEE TYPE */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  EMPLOYEE TYPE
                </label>
                <select
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="">Select employee type...</option>
                  {empTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* DEPARTMENT */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  DEPARTMENT
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="">Select Department...</option>
                  {departmentOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* SECTION */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  SECTION
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="">Select Section...</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                  <option value="Development">Development</option>
                  <option value="Operation">Operation</option>
                </select>
              </div>

              {/* UNIT */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  UNIT
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="">Select Unit...</option>
                  <option value="Head Office">Head Office</option>
                  <option value="Factory Unit 1">Factory Unit 1</option>
                  <option value="Factory Unit 2">Factory Unit 2</option>
                </select>
              </div>
            </div>

            {/* Row 3: EMPID + Right Action Buttons (Reset, SEARCH) */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
              <div className="w-full sm:w-1/4 max-w-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  EMPID
                </label>
                <input
                  type="text"
                  value={empIdFilter}
                  onChange={(e) => setEmpIdFilter(e.target.value)}
                  placeholder="Select Employee(s)"
                  className="w-full h-8.5 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 self-end">
                {/* Reset button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="size-8.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors shadow-xs cursor-pointer"
                  title="Reset Filter"
                >
                  <RotateCcw className="size-3.5" />
                </button>

                {/* SEARCH button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-8.5 px-4.5 rounded-md bg-[#1976d2] hover:bg-[#1565c0] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
                >
                  <Search className="size-3.5 stroke-[2.2]" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200/90 dark:border-slate-700/80 whitespace-nowrap select-none text-[9.5px] uppercase tracking-wider">
                    <th className="py-2.5 px-2.5 text-center w-10">SL</th>
                    <th className="py-2.5 px-2.5">EMP ID</th>
                    <th className="py-2.5 px-3">NAME</th>
                    <th className="py-2.5 px-2.5">TYPE</th>
                    <th className="py-2.5 px-3">DEPARTMENT</th>
                    <th className="py-2.5 px-3">DESIGNATION</th>
                    <th className="py-2.5 px-2.5 text-center">JOIN DATE</th>
                    <th className="py-2.5 px-2.5 text-right">GROSS</th>
                    <th className="py-2.5 px-2 text-center">PRESENT DAYS</th>
                    <th className="py-2.5 px-2 text-center">EARNED DAY</th>
                    <th className="py-2.5 px-2 text-center">EARNED DAY(CF)</th>
                    <th className="py-2.5 px-2 text-center">TAKEN EL</th>
                    <th className="py-2.5 px-2 text-center">TAKEN EL (PREV)</th>
                    <th className="py-2.5 px-2 text-center">TOTAL EL</th>
                    <th className="py-2.5 px-2.5 text-right">PER DAY AMOUNT</th>
                    <th className="py-2.5 px-2.5 text-right">TOTAL AMOUNT</th>
                    <th className="py-2.5 px-2 text-center">PERCENT(%)</th>
                    <th className="py-2.5 px-2 text-center">PAY DAY</th>
                    <th className="py-2.5 px-3 text-right">NET PAY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                  {computedRows.map((row) => (
                    <tr
                      key={row.empId}
                      className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap"
                    >
                      {/* SL */}
                      <td className="py-2 px-2.5 text-center text-slate-400 font-mono text-[10px]">
                        {row.displaySl}
                      </td>

                      {/* EMP ID */}
                      <td className="py-2 px-2.5 font-mono text-[10.5px] text-slate-600 dark:text-slate-400">
                        {row.empId}
                      </td>

                      {/* NAME */}
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                        {row.empName}
                      </td>

                      {/* TYPE */}
                      <td className="py-2 px-2.5 text-slate-600 dark:text-slate-400">
                        {row.type}
                      </td>

                      {/* DEPARTMENT */}
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                        {row.department}
                      </td>

                      {/* DESIGNATION */}
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                        {row.designation}
                      </td>

                      {/* JOIN DATE */}
                      <td className="py-2 px-2.5 text-center font-mono text-[10.5px] text-slate-500 dark:text-slate-400">
                        {row.joinDate}
                      </td>

                      {/* GROSS */}
                      <td className="py-2 px-2.5 text-right font-mono text-slate-900 dark:text-white font-semibold">
                        {row.gross.toFixed(2)}
                      </td>

                      {/* PRESENT DAYS */}
                      <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                        {row.presentDays}
                      </td>

                      {/* EARNED DAY */}
                      <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                        {row.earnedDays}
                      </td>

                      {/* EARNED DAY(CF) */}
                      <td className="py-2 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                        {row.earnedDaysCf}
                      </td>

                      {/* TAKEN EL */}
                      <td className="py-2 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                        {row.takenEl}
                      </td>

                      {/* TAKEN EL (PREV) */}
                      <td className="py-2 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                        {row.takenElPrev}
                      </td>

                      {/* TOTAL EL */}
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        {row.totalEl}
                      </td>

                      {/* PER DAY AMOUNT */}
                      <td className="py-2 px-2.5 text-right font-mono text-slate-700 dark:text-slate-300">
                        {row.perDayAmount.toFixed(2)}
                      </td>

                      {/* TOTAL AMOUNT */}
                      <td className="py-2 px-2.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {row.totalAmount.toFixed(2)}
                      </td>

                      {/* PERCENT(%) */}
                      <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                        {row.percent}%
                      </td>

                      {/* PAY DAY */}
                      <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                        {row.payDay}
                      </td>

                      {/* NET PAY */}
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {row.netPay.toFixed(2)}
                      </td>
                    </tr>
                  ))}

                  {computedRows.length === 0 && (
                    <tr>
                      <td colSpan={19} className="py-12 text-center text-slate-400 font-medium">
                        No employees found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
