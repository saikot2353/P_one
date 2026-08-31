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
  Calendar,
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

interface SavedLeaveRecord {
  id: string;
  empId: string;
  empName: string;
  subDepartment: string;
  area: string;
  eddDate: string;
  startDate: string;
  endDate: string;
  days: number;
  avgDailyWage: number;
  totalBenefit: number;
  firstInstalment: number;
  secondInstalment: number;
  status: "Pending Approval" | "1st Payment Disbursed" | "Completed";
}

// Initial 3-month demo salary history for Nusrat Jahan Tania (2023084102)
const defaultDemoSalaryHistory: SalaryHistoryRow[] = [
  {
    month: "May 2026",
    days: 26,
    basic: 28000,
    houseRent: 14000,
    medical: 2000,
    conveyance: 1000,
    food: 0,
    monthlyWages: 45000,
    present: 26,
    abs: 0,
    leave: 0,
    attnBonus: 1000,
    wagesPayable: 46000,
    otHours: 12,
    otRate: 269.23,
    otAmount: 3230.76,
    bonus: 0,
    netWages: 49230.76,
  },
  {
    month: "April 2026",
    days: 26,
    basic: 28000,
    houseRent: 14000,
    medical: 2000,
    conveyance: 1000,
    food: 0,
    monthlyWages: 45000,
    present: 25,
    abs: 1,
    leave: 0,
    attnBonus: 0,
    wagesPayable: 43269.23,
    otHours: 8,
    otRate: 269.23,
    otAmount: 2153.84,
    bonus: 0,
    netWages: 45423.07,
  },
  {
    month: "March 2026",
    days: 26,
    basic: 28000,
    houseRent: 14000,
    medical: 2000,
    conveyance: 1000,
    food: 0,
    monthlyWages: 45000,
    present: 26,
    abs: 0,
    leave: 0,
    attnBonus: 1000,
    wagesPayable: 46000,
    otHours: 16,
    otRate: 269.23,
    otAmount: 4307.68,
    bonus: 0,
    netWages: 50307.68,
  },
];

function MaternityLeavePage() {
  // Form input states
  const [selectedArea, setSelectedArea] = useState("PKCL-Savar");
  const [empIdInput, setEmpIdInput] = useState("2023084102");
  const [empName, setEmpName] = useState("Nusrat Jahan Tania");
  const [subDepartment, setSubDepartment] = useState("Quality Assurance & Control");
  const [jobTitle, setJobTitle] = useState("Senior Executive");
  const [joiningDate, setJoiningDate] = useState("2023-03-15");

  const [eddDate, setEddDate] = useState("2026-10-15");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-12-21");
  const [leaveDays, setLeaveDays] = useState(112);

  // Pre-loaded salary history with default demo data
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistoryRow[]>(defaultDemoSalaryHistory);

  // Notification Toast
  const [toastMsg, setToastMsg] = useState("");

  // Saved Maternity Leave Database
  const [savedRecords, setSavedRecords] = useState<SavedLeaveRecord[]>([
    {
      id: "ML-2026-001",
      empId: "2021051280",
      empName: "Farhana Akter",
      subDepartment: "Human Resource & Admin",
      area: "Head Office",
      eddDate: "2026-08-10",
      startDate: "2026-07-01",
      endDate: "2026-10-20",
      days: 112,
      avgDailyWage: 1461.54,
      totalBenefit: 163692.48,
      firstInstalment: 81846.24,
      secondInstalment: 81846.24,
      status: "1st Payment Disbursed",
    },
  ]);

  // Handle Preset Female Employee Click
  const handleSelectPreset = (empId: string) => {
    const matched = mockFemaleEmployees[empId];
    if (matched) {
      setEmpIdInput(matched.id);
      setEmpName(matched.name);
      setSelectedArea(matched.area);
      setSubDepartment(matched.subDepartment);
      setJobTitle(matched.jobTitle);
      setJoiningDate(matched.joiningDate);
      generateSalaryHistory(matched);
    }
  };

  // Generate 3-month salary history for selected employee
  const generateSalaryHistory = (employee: FemaleEmployee) => {
    const gross = employee.grossSalary;
    const basic = employee.basicSalary;
    const houseRent = Math.round(basic * 0.5);
    const medical = 2000;
    const conveyance = 1000;
    const food = gross - (basic + houseRent + medical + conveyance);
    const otRate = Number(((basic / 208) * 2).toFixed(2));

    const rows: SalaryHistoryRow[] = [
      {
        month: "May 2026",
        days: 26,
        basic,
        houseRent,
        medical,
        conveyance,
        food: food > 0 ? food : 0,
        monthlyWages: gross,
        present: 26,
        abs: 0,
        leave: 0,
        attnBonus: 1000,
        wagesPayable: gross + 1000,
        otHours: 12,
        otRate,
        otAmount: Number((12 * otRate).toFixed(2)),
        bonus: 0,
        netWages: Number((gross + 1000 + 12 * otRate).toFixed(2)),
      },
      {
        month: "April 2026",
        days: 26,
        basic,
        houseRent,
        medical,
        conveyance,
        food: food > 0 ? food : 0,
        monthlyWages: gross,
        present: 25,
        abs: 1,
        leave: 0,
        attnBonus: 0,
        wagesPayable: Number((gross - gross / 26).toFixed(2)),
        otHours: 8,
        otRate,
        otAmount: Number((8 * otRate).toFixed(2)),
        bonus: 0,
        netWages: Number((gross - gross / 26 + 8 * otRate).toFixed(2)),
      },
      {
        month: "March 2026",
        days: 26,
        basic,
        houseRent,
        medical,
        conveyance,
        food: food > 0 ? food : 0,
        monthlyWages: gross,
        present: 26,
        abs: 0,
        leave: 0,
        attnBonus: 1000,
        wagesPayable: gross + 1000,
        otHours: 16,
        otRate,
        otAmount: Number((16 * otRate).toFixed(2)),
        bonus: 0,
        netWages: Number((gross + 1000 + 16 * otRate).toFixed(2)),
      },
    ];

    setSalaryHistory(rows);
    setToastMsg(`Loaded 3-month salary history for ${employee.name}.`);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleLoadClick = () => {
    if (mockFemaleEmployees[empIdInput]) {
      generateSalaryHistory(mockFemaleEmployees[empIdInput]);
    } else {
      const gross = 35000;
      const basic = 21000;
      generateSalaryHistory({
        id: empIdInput || "2023084102",
        name: empName || "Employee",
        area: selectedArea,
        subDepartment: subDepartment || "Operations",
        jobTitle: jobTitle || "Staff",
        joiningDate: joiningDate || "2023-01-01",
        basicSalary: basic,
        grossSalary: gross,
      });
    }
  };

  // Salary Calculations Summary
  const calculations = useMemo(() => {
    if (salaryHistory.length === 0) {
      return { avgDailyWage: 0, total112Benefit: 0, firstInstalment: 0, secondInstalment: 0 };
    }

    const totalNetWages = salaryHistory.reduce((acc, row) => acc + row.netWages, 0);
    const totalWorkingDays = salaryHistory.reduce((acc, row) => acc + row.days, 0);

    const avgDailyWage = Number((totalNetWages / (totalWorkingDays || 78)).toFixed(2));
    const total112Benefit = Number((avgDailyWage * leaveDays).toFixed(2));
    const firstInstalment = Number((total112Benefit / 2).toFixed(2));
    const secondInstalment = Number((total112Benefit - firstInstalment).toFixed(2));

    return {
      avgDailyWage,
      total112Benefit,
      firstInstalment,
      secondInstalment,
    };
  }, [salaryHistory, leaveDays]);

  // Totals for Salary History Table
  const salaryTotals = useMemo(() => {
    return salaryHistory.reduce(
      (acc, r) => ({
        days: acc.days + r.days,
        basic: acc.basic + r.basic,
        houseRent: acc.houseRent + r.houseRent,
        medical: acc.medical + r.medical,
        conveyance: acc.conveyance + r.conveyance,
        food: acc.food + r.food,
        monthlyWages: acc.monthlyWages + r.monthlyWages,
        present: acc.present + r.present,
        abs: acc.abs + r.abs,
        leave: acc.leave + r.leave,
        attnBonus: acc.attnBonus + r.attnBonus,
        wagesPayable: acc.wagesPayable + r.wagesPayable,
        otHours: acc.otHours + r.otHours,
        otAmount: acc.otAmount + r.otAmount,
        bonus: acc.bonus + r.bonus,
        netWages: acc.netWages + r.netWages,
      }),
      {
        days: 0,
        basic: 0,
        houseRent: 0,
        medical: 0,
        conveyance: 0,
        food: 0,
        monthlyWages: 0,
        present: 0,
        abs: 0,
        leave: 0,
        attnBonus: 0,
        wagesPayable: 0,
        otHours: 0,
        otAmount: 0,
        bonus: 0,
        netWages: 0,
      }
    );
  }, [salaryHistory]);

  // Save Maternity Leave Record
  const handleSaveRecord = () => {
    if (!empName) {
      alert("Please select or enter an Employee ID and Name first!");
      return;
    }

    const newRecord: SavedLeaveRecord = {
      id: `ML-${new Date().getFullYear()}-${String(savedRecords.length + 1).padStart(3, "0")}`,
      empId: empIdInput,
      empName,
      subDepartment,
      area: selectedArea,
      eddDate,
      startDate,
      endDate,
      days: leaveDays,
      avgDailyWage: calculations.avgDailyWage,
      totalBenefit: calculations.total112Benefit,
      firstInstalment: calculations.firstInstalment,
      secondInstalment: calculations.secondInstalment,
      status: "Pending Approval",
    };

    setSavedRecords([newRecord, ...savedRecords]);
    setToastMsg(`Maternity Leave Application for ${empName} saved successfully!`);
    setTimeout(() => setToastMsg(""), 5000);
  };

  // Export Excel CSV
  const handleExportExcel = () => {
    const csvHeader =
      "Month,Days,Basic,Houserent,Medical,Conveyance,Food,Monthly Wages,Present,Abs,Leave,Attn Bonus,Wages Payable,OT Hours,OT Rate,OT Amount,Bonus,Net Wages\n";
    const csvRows = salaryHistory
      .map((r) =>
        [
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
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Maternity_Leave_Salary_History_${empIdInput}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans overflow-hidden">
      {/* Primary Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Breadcrumb Header */}
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck size={14} /> Labor Act 2006 (Sec 46/47) Compliant
            </span>
          </div>
        </div>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Notification Toast */}
          {toastMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button
                onClick={() => setToastMsg("")}
                className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* REALIGNED TOP CONFIGURATOR CARD WITH LOAD BUTTON ON BOTTOM RIGHT */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            
            {/* Card Header */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <CalendarX size={18} className="text-rose-600" />
                Maternity Leave Application & Salary History Configurator
              </h2>

              <div className="text-[11px] text-slate-500">
                Select female employee to auto-fill parameters
              </div>
            </div>

            {/* Form Input Fields Grid */}
            <div className="p-5 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3.5 text-xs">
                
                {/* Left Column Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">Area</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    >
                      <option value="PKCL-Savar">PKCL-Savar</option>
                      <option value="PKCL-Gazipur">PKCL-Gazipur</option>
                      <option value="Head Office">Head Office</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">EmpId</label>
                    <div className="col-span-2 relative flex items-center">
                      <input
                        type="text"
                        value={empIdInput}
                        onChange={(e) => setEmpIdInput(e.target.value)}
                        placeholder="Enter Emp ID"
                        className="w-full h-8 pl-2.5 pr-8 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-semibold outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleLoadClick}
                        className="absolute right-2 text-slate-400 hover:text-blue-600"
                        title="Search Employee ID"
                      >
                        <Search size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-[11px] text-slate-400">Presets:</span>
                    <div className="col-span-2 flex flex-wrap items-center gap-1.5">
                      {Object.keys(mockFemaleEmployees).map((key) => {
                        const isSel = empIdInput === key;
                        const emp = mockFemaleEmployees[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleSelectPreset(key)}
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                              isSel
                                ? "bg-rose-100 border-rose-400 text-rose-700 font-bold dark:bg-rose-950 dark:text-rose-300"
                                : "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {emp.name.split(" ")[0]} ({key})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">Emp Name</label>
                    <input
                      type="text"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-semibold outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">Sub Department</label>
                    <input
                      type="text"
                      value={subDepartment}
                      onChange={(e) => setSubDepartment(e.target.value)}
                      className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">Date of joining</label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Right Column Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">EDD Date</label>
                    <input
                      type="date"
                      value={eddDate}
                      onChange={(e) => setEddDate(e.target.value)}
                      className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-rose-500 font-medium text-xs text-rose-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center">
                    <label className="text-slate-600 dark:text-slate-400 font-medium">Days</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="number"
                        value={leaveDays}
                        onChange={(e) => setLeaveDays(Number(e.target.value))}
                        className="w-24 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none text-xs"
                      />
                      <span className="text-slate-400 text-[11px]">days (Standard: 112 / 120)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* DEDICATED BOTTOM-RIGHT FOOTER ACTION ROW FOR LOAD BUTTON */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleLoadClick}
                  className="h-9 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
                >
                  <RefreshCw size={15} />
                  <span>Load 3-Month Salary History</span>
                </button>
              </div>

            </div>
          </div>

          {/* SALARY HISTORY TABLE (WITH PRE-POPULATED DEMO DATA) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-0">
            
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Salary History
              </h3>
              <span className="text-[11px] text-slate-500">
                Pre-maternity leave 3 months salary records used for average daily benefit wage calculation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1200px]">
                <thead>
                  <tr className="bg-[#bce0fd] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-b border-slate-300 dark:border-slate-700 font-bold text-[11px]">
                    <th className="py-2.5 px-3 border-r border-slate-300/60">Month</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-center">Days</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">Basic</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">Houserent</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">Medical</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">Conveyance</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">Food</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right font-black text-blue-900">Monthly Wages</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-center text-emerald-800">Present</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-center text-rose-800">Abs</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-center">Leave</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">Attn. Bonus</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right font-bold">Wages Payable</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-center">OT Hours</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">OT Rate</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">OT Amount</th>
                    <th className="py-2.5 px-2 border-r border-slate-300/60 text-right">Bonus</th>
                    <th className="py-2.5 px-2 text-right font-black text-rose-900">Net Wages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px]">
                  {salaryHistory.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 border-r font-bold text-slate-800 dark:text-slate-200">{row.month}</td>
                      <td className="py-2 px-2 border-r text-center">{row.days}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.basic.toLocaleString()}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.houseRent.toLocaleString()}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.medical.toLocaleString()}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.conveyance.toLocaleString()}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.food.toLocaleString()}</td>
                      <td className="py-2 px-2 border-r text-right font-bold text-blue-700 dark:text-blue-400 font-mono">
                        {row.monthlyWages.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 border-r text-center font-bold text-emerald-600">{row.present}</td>
                      <td className="py-2 px-2 border-r text-center font-bold text-rose-500">{row.abs}</td>
                      <td className="py-2 px-2 border-r text-center">{row.leave}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.attnBonus.toLocaleString()}</td>
                      <td className="py-2 px-2 border-r text-right font-bold font-mono">{row.wagesPayable.toLocaleString()}</td>
                      <td className="py-2 px-2 border-r text-center">{row.otHours}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.otRate}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.otAmount.toLocaleString()}</td>
                      <td className="py-2 px-2 border-r text-right font-mono">{row.bonus.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-black text-rose-700 dark:text-rose-400 font-mono">
                        ৳{row.netWages.toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {/* SUMMARY TOTALS ROW */}
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-[11px]">
                    <td className="py-2.5 px-3 border-r text-slate-900 dark:text-slate-100">TOTAL (3 Months)</td>
                    <td className="py-2.5 px-2 border-r text-center">{salaryTotals.days}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.basic.toLocaleString()}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.houseRent.toLocaleString()}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.medical.toLocaleString()}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.conveyance.toLocaleString()}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.food.toLocaleString()}</td>
                    <td className="py-2.5 px-2 border-r text-right text-blue-900 font-mono">
                      {salaryTotals.monthlyWages.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 border-r text-center text-emerald-700">{salaryTotals.present}</td>
                    <td className="py-2.5 px-2 border-r text-center text-rose-700">{salaryTotals.abs}</td>
                    <td className="py-2.5 px-2 border-r text-center">{salaryTotals.leave}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.attnBonus.toLocaleString()}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.wagesPayable.toLocaleString()}</td>
                    <td className="py-2.5 px-2 border-r text-center">{salaryTotals.otHours}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">-</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.otAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-2 border-r text-right font-mono">{salaryTotals.bonus.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right text-rose-800 font-black font-mono">
                      ৳{salaryTotals.netWages.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* BOTTOM CALCULATION & ACTION SUMMARY CARD */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-xs">
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-slate-600 dark:text-slate-400 font-medium">
                    Earnings per working day (Average)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`৳${calculations.avgDailyWage.toLocaleString()}`}
                    className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-slate-600 dark:text-slate-400 font-medium">
                    Earnings total for {leaveDays} days
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`৳${calculations.total112Benefit.toLocaleString()}`}
                    className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono font-bold text-rose-600 dark:text-rose-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-slate-600 dark:text-slate-400 font-medium">
                    1st instalment payable for 56 days
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`Pre-natal 56 Days: ৳${calculations.firstInstalment.toLocaleString()}`}
                    className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono font-bold text-blue-700 dark:text-blue-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-slate-600 dark:text-slate-400 font-medium">
                    2nd instalment payable after birth of Baby
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`Post-natal 56 Days: ৳${calculations.secondInstalment.toLocaleString()}`}
                    className="col-span-2 h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono font-bold text-blue-700 dark:text-blue-400 outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Actions Toolbar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveRecord}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save size={15} />
                  Save Application
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Printer size={15} className="text-slate-600" />
                  PDF / Print Statement
                </button>

                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <FileSpreadsheet size={15} className="text-emerald-600" />
                  EXCEL Export
                </button>
              </div>

              <div className="text-[11px] text-slate-400 italic">
                Form standard compliant with Bangladesh Labor Act 2006 (Section 46/47)
              </div>
            </div>

          </div>

          {/* SAVED MATERNITY LEAVE RECORDS DATABASE */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                Maternity Leave Records Database ({savedRecords.length})
              </h3>
              <span className="text-[11px] text-slate-500">Track submitted applications and instalment payment states</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3">Record ID</th>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Sub Dept / Area</th>
                    <th className="py-2.5 px-3">EDD Date</th>
                    <th className="py-2.5 px-3">Leave Period</th>
                    <th className="py-2.5 px-3 text-right">Avg Daily Wage</th>
                    <th className="py-2.5 px-3 text-right">Total Benefit ({leaveDays} Days)</th>
                    <th className="py-2.5 px-3 text-right">1st Instalment</th>
                    <th className="py-2.5 px-3 text-right">2nd Instalment</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {savedRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-600">{r.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{r.empName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {r.empId}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-slate-800 dark:text-slate-200">{r.subDepartment}</div>
                        <div className="text-[10px] text-slate-400">{r.area}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{r.eddDate}</td>
                      <td className="py-2.5 px-3 font-medium">
                        {r.startDate} to {r.endDate} ({r.days}d)
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">৳{r.avgDailyWage.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">৳{r.totalBenefit.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳{r.firstInstalment.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳{r.secondInstalment.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {r.status}
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
