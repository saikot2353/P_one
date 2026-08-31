import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileDown,
  Save,
  RefreshCw,
  CheckCircle2,
  CalendarX,
  Search,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/maternity-leave")({
  head: () => ({
    meta: [
      { title: "Maternity Leave Benefit Calculation — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Calculate and process 112-day maternity leave benefits, salary history, and pre/post-natal payment installments.",
      },
    ],
  }),
  component: MaternityLeavePage,
});

// Mock female employee database for pre-populating standard HR records
interface FemaleEmployee {
  id: string;
  name: string;
  area: string;
  subDepartment: string;
  jobTitle: string;
  joiningDate: string;
  basicSalary: number;
  grossSalary: number;
}

const mockFemaleEmployees: Record<string, FemaleEmployee> = {
  "2023084102": {
    id: "2023084102",
    name: "Nusrat Jahan Tania",
    area: "PKCL-Savar",
    subDepartment: "Quality Assurance & Control",
    jobTitle: "Senior Executive",
    joiningDate: "2023-03-15",
    basicSalary: 28000,
    grossSalary: 45000,
  },
  "2022019943": {
    id: "2022019943",
    name: "Sharmin Sultana",
    area: "PKCL-Gazipur",
    subDepartment: "Sewing Production - Line 4",
    jobTitle: "Senior Operator",
    joiningDate: "2022-01-10",
    basicSalary: 16500,
    grossSalary: 26000,
  },
  "2021051280": {
    id: "2021051280",
    name: "Farhana Akter",
    area: "Head Office",
    subDepartment: "Human Resource & Admin",
    jobTitle: "HR Officer",
    joiningDate: "2021-06-01",
    basicSalary: 24000,
    grossSalary: 38000,
  },
  "2020093311": {
    id: "2020093311",
    name: "Rokeya Begum",
    area: "PKCL-Savar",
    subDepartment: "Finishing & Packing",
    jobTitle: "Quality Inspector",
    joiningDate: "2020-09-18",
    basicSalary: 18000,
    grossSalary: 29000,
  },
};

interface SalaryHistoryRow {
  month: string;
  days: number;
  basic: number;
  houseRent: number;
  medical: number;
  conveyance: number;
  food: number;
  monthlyWages: number;
  present: number;
  abs: number;
  leave: number;
  attnBonus: number;
  wagesPayable: number;
  otHours: number;
  otRate: number;
  otAmount: number;
  bonus: number;
  netWages: number;
}

interface SavedMaternityRecord {
  id: string;
  empId: string;
  empName: string;
  area: string;
  subDepartment: string;
  eddDate: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  avgDailyEarnings: number;
  total112DaysEarnings: number;
  firstInstalment: number;
  secondInstalment: number;
  status: "Pending HR Approval" | "1st Payment Disbursed" | "Fully Settled";
  createdAt: string;
}

function MaternityLeavePage() {
  // Form State
  const [area, setArea] = useState("PKCL-Savar");
  const [empId, setEmpId] = useState("2023084102");
  const [empName, setEmpName] = useState("Nusrat Jahan Tania");
  const [subDepartment, setSubDepartment] = useState("Quality Assurance & Control");
  const [jobTitle, setJobTitle] = useState("Senior Executive");
  const [dateOfJoining, setDateOfJoining] = useState("2023-03-15");

  const [eddDate, setEddDate] = useState("2026-10-15");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-12-21");
  const [days, setDays] = useState(112);

  // Table & Calculation State
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistoryRow[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Saved records state
  const [savedRecords, setSavedRecords] = useState<SavedMaternityRecord[]>([
    {
      id: "ML-2026-001",
      empId: "2021051280",
      empName: "Farhana Akter",
      area: "Head Office",
      subDepartment: "Human Resource & Admin",
      eddDate: "2026-08-10",
      startDate: "2026-07-01",
      endDate: "2026-10-20",
      totalDays: 112,
      avgDailyEarnings: 1461.54,
      total112DaysEarnings: 163692.48,
      firstInstalment: 81846.24,
      secondInstalment: 81846.24,
      status: "1st Payment Disbursed",
      createdAt: "2026-06-25",
    },
  ]);

  // Handle Employee ID search/lookup
  const handleEmpIdChange = (idVal: string) => {
    setEmpId(idVal);
    const matched = mockFemaleEmployees[idVal.trim()];
    if (matched) {
      setEmpName(matched.name);
      setArea(matched.area);
      setSubDepartment(matched.subDepartment);
      setJobTitle(matched.jobTitle);
      setDateOfJoining(matched.joiningDate);
    }
  };

  // Auto-calculate end date or days when start date changes
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val && days > 0) {
      const d = new Date(val);
      d.setDate(d.getDate() + days - 1);
      setEndDate(d.toISOString().slice(0, 10));
    }
  };

  const handleDaysChange = (val: number) => {
    setDays(val);
    if (startDate && val > 0) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + val - 1);
      setEndDate(d.toISOString().slice(0, 10));
    }
  };

  // Generate / Load 3 months Salary History
  const handleLoadSalaryHistory = () => {
    if (!empId) {
      alert("Please enter a valid Employee ID first!");
      return;
    }

    const matched = mockFemaleEmployees[empId.trim()];
    const gross = matched ? matched.grossSalary : 35000;
    const basic = matched ? matched.basicSalary : Math.round(gross * 0.6);
    const houseRent = Math.round(basic * 0.5);
    const medical = 1500;
    const conveyance = 1000;
    const food = gross - (basic + houseRent + medical + conveyance);

    // Mock 3 previous months history
    const mockMonths: SalaryHistoryRow[] = [
      {
        month: "May 2026",
        days: 26,
        basic: basic,
        houseRent: houseRent,
        medical: medical,
        conveyance: conveyance,
        food: food > 0 ? food : 1500,
        monthlyWages: gross,
        present: 25,
        abs: 0,
        leave: 1,
        attnBonus: 1000,
        wagesPayable: gross + 1000,
        otHours: 12,
        otRate: Math.round((basic / 208) * 2),
        otAmount: Math.round(((basic / 208) * 2) * 12),
        bonus: 0,
        netWages: gross + 1000 + Math.round(((basic / 208) * 2) * 12),
      },
      {
        month: "Apr 2026",
        days: 25,
        basic: basic,
        houseRent: houseRent,
        medical: medical,
        conveyance: conveyance,
        food: food > 0 ? food : 1500,
        monthlyWages: gross,
        present: 24,
        abs: 1,
        leave: 0,
        attnBonus: 0,
        wagesPayable: Math.round((gross / 25) * 24),
        otHours: 16,
        otRate: Math.round((basic / 208) * 2),
        otAmount: Math.round(((basic / 208) * 2) * 16),
        bonus: 0,
        netWages: Math.round((gross / 25) * 24) + Math.round(((basic / 208) * 2) * 16),
      },
      {
        month: "Mar 2026",
        days: 26,
        basic: basic,
        houseRent: houseRent,
        medical: medical,
        conveyance: conveyance,
        food: food > 0 ? food : 1500,
        monthlyWages: gross,
        present: 26,
        abs: 0,
        leave: 0,
        attnBonus: 1000,
        wagesPayable: gross + 1000,
        otHours: 8,
        otRate: Math.round((basic / 208) * 2),
        otAmount: Math.round(((basic / 208) * 2) * 8),
        bonus: Math.round(basic * 0.5),
        netWages: gross + 1000 + Math.round(((basic / 208) * 2) * 8) + Math.round(basic * 0.5),
      },
    ];

    setSalaryHistory(mockMonths);
    setIsLoaded(true);
  };

  // Calculations
  const totalWorkingDays = useMemo(() => {
    return salaryHistory.reduce((acc, row) => acc + row.days, 0);
  }, [salaryHistory]);

  const totalEarnings3Months = useMemo(() => {
    return salaryHistory.reduce((acc, row) => acc + row.netWages, 0);
  }, [salaryHistory]);

  const avgDailyEarnings = useMemo(() => {
    if (totalWorkingDays === 0) return 0;
    return Number((totalEarnings3Months / totalWorkingDays).toFixed(2));
  }, [totalWorkingDays, totalEarnings3Months]);

  const total112DaysEarnings = useMemo(() => {
    return Number((avgDailyEarnings * days).toFixed(2));
  }, [avgDailyEarnings, days]);

  const firstInstalment = useMemo(() => {
    return Number((avgDailyEarnings * Math.floor(days / 2)).toFixed(2));
  }, [avgDailyEarnings, days]);

  const secondInstalment = useMemo(() => {
    return Number((total112DaysEarnings - firstInstalment).toFixed(2));
  }, [total112DaysEarnings, firstInstalment]);

  // Actions
  const handleSave = () => {
    if (!isLoaded || salaryHistory.length === 0) {
      alert("Please click 'Load' to calculate salary history before saving!");
      return;
    }

    const newRec: SavedMaternityRecord = {
      id: `ML-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      empId,
      empName,
      area,
      subDepartment,
      eddDate,
      startDate,
      endDate,
      totalDays: days,
      avgDailyEarnings,
      total112DaysEarnings,
      firstInstalment,
      secondInstalment,
      status: "Pending HR Approval",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setSavedRecords([newRec, ...savedRecords]);
    setSuccessMsg(`Maternity Leave Benefit calculation saved successfully! Record ID: ${newRec.id}`);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const headers = [
      "Month",
      "Days",
      "Basic",
      "Houserent",
      "Medical",
      "Conveyance",
      "Food",
      "Monthly Wages",
      "Present",
      "Abs",
      "Leave",
      "Attn Bonus",
      "Wages Payable",
      "OT Hours",
      "OT Rate",
      "OT Amount",
      "Bonus",
      "Net Wages",
    ];

    const rows = salaryHistory.map((r) => [
      r.month,
      r.days,
      r.basic,
      r.houseRent,
      r.medical,
      r.conveyance,
      r.food,
      r.monthlyWages,
      r.present,
      r.abs,
      r.leave,
      r.attnBonus,
      r.wagesPayable,
      r.otHours,
      r.otRate,
      r.otAmount,
      r.bonus,
      r.netWages,
    ]);

    const csvContent = [
      `Maternity Leave Benefit Calculation Statement for ${empName} (${empId})`,
      `Area: ${area}, Sub Dept: ${subDepartment}, EDD: ${eddDate}, Period: ${startDate} to ${endDate} (${days} Days)`,
      `Avg Daily Wage: ${avgDailyEarnings} BDT, Total 112 Days Benefit: ${total112DaysEarnings} BDT`,
      `1st Instalment (56 Days): ${firstInstalment} BDT, 2nd Instalment (56 Days): ${secondInstalment} BDT`,
      "",
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Maternity_Leave_${empId}_${startDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans overflow-hidden">
      {/* Primary Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Breadcrumb Navigation Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Leave</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Maternity Leave
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <ShieldCheck size={14} /> Statutory 112 Days Benefit (Labor Law)
            </span>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Success Banner */}
          {successMsg && (
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fadeIn shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
                <span className="text-sm font-semibold">{successMsg}</span>
              </div>
              <button
                onClick={() => setSuccessMsg("")}
                className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Form Card (Replicating exact layout of screenshot reference) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <CalendarX size={18} className="text-rose-600" />
                Maternity Leave Application & Salary History Configurator
              </div>
              <span className="text-xs text-slate-500">
                Select female employee to auto-fill parameters
              </span>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">

                {/* Left Column Controls */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      Area
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                    >
                      <option value="PKCL-Savar">PKCL-Savar</option>
                      <option value="PKCL-Gazipur">PKCL-Gazipur</option>
                      <option value="Head Office">Head Office</option>
                      <option value="Dhamrai Factory">Dhamrai Factory</option>
                      <option value="Chittagong Depot">Chittagong Depot</option>
                    </select>
                  </div>

                  <div className="flex items-center relative">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      EmpId
                    </label>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={empId}
                        onChange={(e) => handleEmpIdChange(e.target.value)}
                        placeholder="e.g. 2023084102"
                        className="w-full h-8 px-2.5 pr-8 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                      />
                      <Search size={14} className="absolute right-2.5 top-2 text-slate-400" />
                    </div>
                  </div>

                  {/* Female Employee Quick Preset Suggestions */}
                  <div className="ml-36 flex flex-wrap gap-1">
                    <span className="text-[10px] text-slate-400 mr-1">Presets:</span>
                    {Object.values(mockFemaleEmployees).map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => handleEmpIdChange(emp.id)}
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          empId === emp.id
                            ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {emp.name.split(" ")[0]} ({emp.id})
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      Emp Name
                    </label>
                    <input
                      type="text"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      Sub Department
                    </label>
                    <input
                      type="text"
                      value={subDepartment}
                      onChange={(e) => setSubDepartment(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      Date of joining
                    </label>
                    <input
                      type="date"
                      value={dateOfJoining}
                      onChange={(e) => setDateOfJoining(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                    />
                  </div>
                </div>

                {/* Right Column Controls */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      EDD Date
                    </label>
                    <input
                      type="date"
                      value={eddDate}
                      onChange={(e) => setEddDate(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs font-medium text-rose-600 dark:text-rose-400"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 dark:text-slate-400 font-medium">
                      Days
                    </label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => handleDaysChange(Number(e.target.value))}
                      className="w-32 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-xs font-bold"
                    />
                    <span className="ml-2 text-slate-400 text-xs">days (Standard: 112)</span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleLoadSalaryHistory}
                      className="px-6 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} className={isLoaded ? "" : "animate-spin-slow"} />
                      Load
                    </button>
                    {isLoaded && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 size={13} /> 3-Month salary history loaded
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Salary History Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                Salary History
              </h3>
              <span className="text-xs text-slate-500">
                Pre-maternity leave 3 months salary records used for average daily benefit wage calculation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1200px]">
                <thead>
                  <tr className="bg-[#eef2f7] dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-indigo-950 dark:text-slate-200 font-bold">
                    <th className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-700">Month</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-center">Days</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Basic</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Houserent</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Medical</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Conveyance</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Food</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Monthly Wages</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-center">Present</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-center">Abs</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-center">Leave</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Attn. Bonus</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Wages Payable</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-center">OT Hours</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">OT Rate</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">OT Amount</th>
                    <th className="py-2.5 px-2 border-r border-slate-300 dark:border-slate-700 text-right">Bonus</th>
                    <th className="py-2.5 px-2 text-right">Net Wages</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={18}
                        className="py-8 text-center text-slate-400 dark:text-slate-500 font-medium bg-slate-50/50 dark:bg-slate-900/50"
                      >
                        No data available! Click <strong className="text-slate-600 dark:text-slate-300 font-semibold">Load</strong> above to fetch 3-month salary history.
                      </td>
                    </tr>
                  ) : (
                    salaryHistory.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
                          {row.month}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-center">
                          {row.days}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.basic.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.houseRent.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.medical.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.conveyance.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.food.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right font-semibold">
                          {row.monthlyWages.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-center font-medium text-emerald-600">
                          {row.present}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-center text-rose-500">
                          {row.abs}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-center text-amber-600">
                          {row.leave}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.attnBonus.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right font-medium">
                          {row.wagesPayable.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-center">
                          {row.otHours}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.otRate}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.otAmount.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 text-right">
                          {row.bonus.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20">
                          {row.netWages.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Row */}
            {salaryHistory.length > 0 && (
              <div className="bg-slate-100 dark:bg-slate-800/80 px-5 py-2.5 border-t border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>3 Months Total Summary</span>
                <div className="flex gap-6">
                  <span>Total Working Days: {totalWorkingDays}</span>
                  <span>Total Gross Earnings: {totalEarnings3Months.toLocaleString()} BDT</span>
                </div>
              </div>
            )}
          </div>

          {/* Benefit Calculations & Action Buttons Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">

              <div className="space-y-3">
                <div className="flex items-center">
                  <label className="w-56 text-slate-600 dark:text-slate-400 font-medium">
                    Earnings per working day (Average)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={avgDailyEarnings > 0 ? avgDailyEarnings.toFixed(2) : ""}
                    placeholder="Auto Calculated"
                    className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-56 text-slate-600 dark:text-slate-400 font-medium">
                    Earnings total for {days} days
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={total112DaysEarnings > 0 ? total112DaysEarnings.toFixed(2) : ""}
                    placeholder="Auto Calculated"
                    className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-rose-600 dark:text-rose-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <label className="w-64 text-slate-600 dark:text-slate-400 font-medium">
                    1st instalment payable for 56 days
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={firstInstalment > 0 ? firstInstalment.toFixed(2) : ""}
                    placeholder="Pre-natal 56 Days"
                    className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-64 text-slate-600 dark:text-slate-400 font-medium">
                    2nd instalment payable at after birth of Baby
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={secondInstalment > 0 ? secondInstalment.toFixed(2) : ""}
                    placeholder="Post-natal 56 Days"
                    className="flex-1 h-8 px-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Action Buttons (Save, PDF, EXCEL) */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Save size={14} className="text-blue-600 dark:text-blue-400" />
                  Save
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Printer size={14} className="text-slate-600 dark:text-slate-400" />
                  PDF
                </button>

                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-4 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600 dark:text-emerald-400" />
                  EXCEL
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Form standard compliant with Bangladesh Labor Act 2006 (Section 46/47)
              </span>
            </div>
          </div>

          {/* Saved Records Database Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <FileDown size={16} className="text-blue-600" />
                Maternity Leave Records Database ({savedRecords.length})
              </h3>
              <span className="text-xs text-slate-500">
                Track submitted applications and instalment payment states
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                    <th className="py-2.5 px-3">Record ID</th>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Sub Dept / Area</th>
                    <th className="py-2.5 px-3">EDD Date</th>
                    <th className="py-2.5 px-3">Leave Period</th>
                    <th className="py-2.5 px-3 text-right">Avg Daily Wage</th>
                    <th className="py-2.5 px-3 text-right">Total Benefit (112 Days)</th>
                    <th className="py-2.5 px-3 text-right">1st Instalment</th>
                    <th className="py-2.5 px-3 text-right">2nd Instalment</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {savedRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-600 dark:text-rose-400">
                        {rec.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{rec.empName}</div>
                        <div className="text-[10px] text-slate-400">ID: {rec.empId}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        <div>{rec.subDepartment}</div>
                        <div className="text-[10px] text-slate-400">{rec.area}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-medium">
                        {rec.eddDate}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {rec.startDate} to {rec.endDate} ({rec.totalDays}d)
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                        ৳{rec.avgDailyEarnings.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-700 dark:text-rose-400">
                        ৳{rec.total112DaysEarnings.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                        ৳{rec.firstInstalment.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                        ৳{rec.secondInstalment.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === "Fully Settled"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : rec.status === "1st Payment Disbursed"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
