import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  FileText, 
  Printer, 
  FileDown, 
  Play, 
  ChevronRight, 
  AlertCircle, 
  Database,
  Building,
  MapPin,
  UserCheck,
  Building2,
  ListFilter,
  Edit,
  Save,
  CheckCircle2,
  TrendingDown,
  Moon,
  Clock,
  Tag,
  Info
} from "lucide-react";

// Deduction Template and Ramadan Month configurations definitions (aligned with payroll-deductions page)
interface DeductionTemplate {
  id: number;
  name: string;
  type: string;
  amount: string;
  amountType: "flat" | "percent-basic" | "percent-gross";
  targetGroup: string;
  status: "Active" | "Inactive";
  recurrence: "one-time" | "monthly";
  oneTimeMonth?: string;
  oneTimeYear?: string;
  excludeRamadan: boolean;
  excludedMonths: string[];
  customExcludedPeriods: string[];
  employeeExclusions?: { empId: string; periods: string[] }[];
  prorataEnabled: boolean;
  prorataDateThreshold: number;
  prorataReductionType: "percent" | "flat";
  prorataReductionValue: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

const checkDeductionStatus = (
  template: DeductionTemplate,
  year: number,
  monthStr: string,
  designatedRamadanMonth?: string,
  empId?: string
): { isSkipped: boolean; reason?: string } => {
  if (template.status === "Inactive") {
    return { isSkipped: true, reason: "Inactive Template" };
  }

  // Employee exclusions
  if (empId && template.employeeExclusions) {
    const empExcl = template.employeeExclusions.find(x => x.empId === empId);
    if (empExcl) {
      const monthNum = String(MONTHS.indexOf(monthStr) + 1).padStart(2, "0");
      const periodStr = `${year}-${monthNum}`;
      if (empExcl.periods && empExcl.periods.includes(periodStr)) {
        return { isSkipped: true, reason: `Employee Opt-Out` };
      }
    }
  }

  // One-time
  if (template.recurrence === "one-time") {
    if (template.oneTimeMonth !== monthStr || template.oneTimeYear !== String(year)) {
      return { isSkipped: true, reason: `One-time date mismatch` };
    }
    return { isSkipped: false };
  }

  // Ramadan month designated override
  if (template.excludeRamadan && designatedRamadanMonth === monthStr) {
    return { isSkipped: true, reason: `Ramadan designated skip` };
  }

  // Annual skip
  const exclMonths = template.excludedMonths || [];
  if (exclMonths.includes(monthStr)) {
    return { isSkipped: true, reason: `Annual skip month` };
  }

  // Custom period skip
  const monthNum = String(MONTHS.indexOf(monthStr) + 1).padStart(2, "0");
  const periodStr = `${year}-${monthNum}`;
  const customExcl = template.customExcludedPeriods || [];
  if (customExcl.includes(periodStr)) {
    return { isSkipped: true, reason: `One-off period skip` };
  }

  return { isSkipped: false };
};

const getEvaluatedAmount = (amount: string, amountType: "flat" | "percent-basic" | "percent-gross", basic: number, gross: number) => {
  const numericVal = Number(amount) || 0;
  if (amountType === "percent-basic") {
    return Math.round((numericVal / 100) * basic);
  }
  if (amountType === "percent-gross") {
    return Math.round((numericVal / 100) * gross);
  }
  return numericVal;
};

// Target Roster Database with mock joining dates standardized
const ROSTER_EMPLOYEES = [
  { id: 1, empId: "2025057068", name: "Riazul Islam", empType: "Office Executive", department: "Accounts & Vat", designation: "Asst. Manager", basic: 42000, gross: 70000, joinDate: "01/08/2023" },
  { id: 2, empId: "2023046001", name: "Sohanur Rahman Sohan", empType: "Office Executive", department: "Admin", designation: "Executive", basic: 30000, gross: 50000, joinDate: "15/02/2023" },
  { id: 3, empId: "2023043021", name: "Easin Mia", empType: "Office Executive", department: "Admin", designation: "Receptionist", basic: 15000, gross: 25000, joinDate: "05/07/2026" }, // Joined early July (normal rate)
  { id: 4, empId: "2026059411", name: "Jannatul Maowa", empType: "Office Executive", department: "Admin", designation: "Jr. Executive", basic: 18000, gross: 30000, joinDate: "15/07/2026" }, // Joined late July (pro-rated discount)
  { id: 5, empId: "2024049326", name: "Hanif Uddin", empType: "Office Executive", department: "APPS Team", designation: "Sr. Executive", basic: 36000, gross: 60000, joinDate: "10/11/2024" }
];

export const Route = createFileRoute("/monthly-salary-process")({
  head: () => ({
    meta: [
      { title: "Monthly Salary Process — CRIPTON" },
      { name: "description", content: "Process and preview monthly staff salaries with diagnostic logs." },
    ],
  }),
  component: MonthlySalaryProcessPage,
});

interface ProcessedSalaryRecord {
  id: number;
  empId: string;
  name: string;
  wd: number;
  present: number;
  absent: number;
  leave: number;
  holiday: number;
  basic: number;
  gross: number;
  ot: string; // OT Hours
  otPay: number;
  attBonus: number;
  allowance: number;
  lunchDeduct: number;
  transportDeduct: number;
  pf: number;
  tax: number;
  absentDeduct: number;
  advance: number;
  adjust: number;
  wagelyAdv: number;
  loan: number;
  netSalary: number;
}

// Parse joining date to check if joining date is in the processing year/month
const isJoiningMonth = (joinDateStr: string, processYear: number, processMonthStr: string) => {
  if (!joinDateStr) return { matches: false, joinDay: 1 };
  const parts = joinDateStr.split("/");
  if (parts.length !== 3) return { matches: false, joinDay: 1 };
  const joinDay = Number(parts[0]);
  const joinMonthNum = Number(parts[1]);
  const joinYear = Number(parts[2]);

  const processMonthNum = MONTHS.indexOf(processMonthStr) + 1;
  const matches = joinYear === processYear && joinMonthNum === processMonthNum;
  return { matches, joinDay };
};

function MonthlySalaryProcessPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [processedRecords, setProcessedRecords] = useState<ProcessedSalaryRecord[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Configuration settings (for generation lookups)
  const [processYear, setProcessYear] = useState("2026");
  const [processMonth, setProcessMonth] = useState("Jul");

  // Selection filters for search
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Overlay Modal States
  const [editingRecord, setEditingRecord] = useState<ProcessedSalaryRecord | null>(null);
  
  // Editable form fields states
  const [editWd, setEditWd] = useState(0);
  const [editPresent, setEditPresent] = useState(0);
  const [editAbsent, setEditAbsent] = useState(0);
  const [editLeave, setEditLeave] = useState(0);
  const [editHoliday, setEditHoliday] = useState(0);

  const [editBasic, setEditBasic] = useState(0);
  const [editGross, setEditGross] = useState(0);
  const [editOtHours, setEditOtHours] = useState("");
  const [editOtPay, setEditOtPay] = useState(0);
  const [editAttBonus, setEditAttBonus] = useState(0);
  const [editAllowance, setEditAllowance] = useState(0);

  const [editLunchDeduct, setEditLunchDeduct] = useState(0);
  const [editTransportDeduct, setEditTransportDeduct] = useState(0);
  const [editPf, setEditPf] = useState(0);
  const [editTax, setEditTax] = useState(0);
  const [editAbsentDeduct, setEditAbsentDeduct] = useState(0);
  const [editAdvance, setEditAdvance] = useState(0);
  const [editWagelyAdv, setEditWagelyAdv] = useState(0);
  const [editLoan, setEditLoan] = useState(0);
  const [editAdjust, setEditAdjust] = useState(0);

  // Read mounted states
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch persisted data key string
  const activeStorageKey = useMemo(() => {
    return `payroll_processed_salary_${processYear}_${processMonth}`;
  }, [processYear, processMonth]);

  // Handle Load/Retrieve Month Data
  const handleFetchData = () => {
    const stored = localStorage.getItem(activeStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProcessedRecords(parsed);
          setIsDataLoaded(true);
          return;
        }
      } catch (e) {
        console.error("Failed to parse processed data", e);
      }
    }
    alert(`No processed data exists for ${processMonth} ${processYear} yet. Please click the PROCESS button to calculate salary rates first.`);
    setProcessedRecords([]);
    setIsDataLoaded(false);
  };

  // Run dynamic payroll calculator and save records per month
  const handleProcessSalaries = () => {
    // Fetch dynamic general configurations
    let otMultiplier = 1.5;
    let attendanceBonus = 1000;
    let pfEmployeeRate = 10;
    let taxStandardExemption = 350000;

    const storedGeneral = localStorage.getItem("payroll_general_settings");
    if (storedGeneral) {
      try {
        const parsed = JSON.parse(storedGeneral);
        if (parsed.otMultiplier !== undefined) otMultiplier = Number(parsed.otMultiplier);
        if (parsed.attendanceBonus !== undefined) attendanceBonus = Number(parsed.attendanceBonus);
        if (parsed.pfEmployeeRate !== undefined) pfEmployeeRate = Number(parsed.pfEmployeeRate);
        if (parsed.taxStandardExemption !== undefined) taxStandardExemption = Number(parsed.taxStandardExemption);
      } catch (e) {
        console.error("Failed to parse general settings in calculation run", e);
      }
    }

    // Fetch dynamic lateness settings
    let gracePeriod = 15;
    let allowedLateDays = 3;
    let penaltyMultiplier = 1;
    let lateTriggerRatio = 3;
    let penaltyBaseType = "gross";

    const storedLateness = localStorage.getItem("payroll_lateness_settings");
    if (storedLateness) {
      try {
        const parsed = JSON.parse(storedLateness);
        if (parsed.gracePeriod !== undefined) gracePeriod = Number(parsed.gracePeriod);
        if (parsed.allowedLateDays !== undefined) allowedLateDays = Number(parsed.allowedLateDays);
        if (parsed.penaltyMultiplier !== undefined) penaltyMultiplier = Number(parsed.penaltyMultiplier);
        if (parsed.lateTriggerRatio !== undefined) lateTriggerRatio = Number(parsed.lateTriggerRatio);
        if (parsed.penaltyBaseType !== undefined) penaltyBaseType = parsed.penaltyBaseType;
      } catch (e) {
        console.error("Failed to parse lateness settings in calculation run", e);
      }
    }

    // 1. Fetch deduction templates rules
    let templates: DeductionTemplate[] = [];
    const storedTemplates = localStorage.getItem("payroll_deduction_templates");
    if (storedTemplates) {
      try {
        templates = JSON.parse(storedTemplates);
      } catch (e) {
        console.error("Failed to read templates", e);
      }
    }

    // 2. Fetch designated Ramadan Month configurations
    let ramadanMonthMap: Record<number, string> = { 2026: "Feb" };
    const storedRamadan = localStorage.getItem("payroll_ramadan_months");
    if (storedRamadan) {
      try {
        ramadanMonthMap = JSON.parse(storedRamadan);
      } catch (e) {
        console.error("Failed to read Ramadan mappings", e);
      }
    }
    const designatedRamMonth = ramadanMonthMap[Number(processYear)] || "Feb";

    // 3. Process each staff profile dynamically
    const generated: ProcessedSalaryRecord[] = ROSTER_EMPLOYEES.map((emp) => {
      let lunchDeduct = 0;
      let transportDeduct = 0;
      let otherDeduct = 0;
      let penaltyDeduct = 0;

      // Evaluate active templates rules
      templates.forEach(t => {
        if (t.status === "Active") {
          const statusRes = checkDeductionStatus(t, Number(processYear), processMonth, designatedRamMonth, emp.empId);
          if (!statusRes.isSkipped) {
            let evaluatedAmt = getEvaluatedAmount(t.amount, t.amountType, emp.basic, emp.gross);
            
            // Dynamic Pro-rata reduction check
            if (t.prorataEnabled) {
              const checkJoin = isJoiningMonth(emp.joinDate, Number(processYear), processMonth);
              if (checkJoin.matches && checkJoin.joinDay > t.prorataDateThreshold) {
                const val = t.prorataReductionValue || 0;
                if (t.prorataReductionType === "percent") {
                  const factor = (100 - val) / 100;
                  evaluatedAmt = Math.round(evaluatedAmt * factor);
                } else {
                  evaluatedAmt = Math.max(0, evaluatedAmt - val);
                }
              }
            }

            if (t.type === "Lunch Deduction") {
              lunchDeduct += evaluatedAmt;
            } else if (t.type === "Transport Deduction") {
              transportDeduct += evaluatedAmt;
            } else if (t.type === "Penalty" || t.type === "Damage") {
              penaltyDeduct += evaluatedAmt;
            } else {
              otherDeduct += evaluatedAmt;
            }
          }
        }
      });

      // Default attendance parameters
      const wd = 30;
      const holiday = 4;
      const leave = 1;
      const absent = emp.empId === "2025057068" ? 1 : 0; // default mock absent value
      const present = wd - holiday - leave - absent;

      // Basic parameters calculations
      const basic = emp.basic;
      const gross = emp.gross;

      // Lateness penalty calculations using dynamic lateness settings
      const lateCheckins = emp.empId === "2023046001" ? 5 : (emp.empId === "2026059411" ? 4 : (emp.empId === "2023043021" ? 2 : 0));
      let latenessPenalty = 0;
      if (lateCheckins > allowedLateDays) {
        const excessLates = lateCheckins - allowedLateDays;
        const penaltyTriggers = Math.floor(excessLates / lateTriggerRatio);
        const baseAmt = penaltyBaseType === "basic" ? basic : gross;
        latenessPenalty = Math.round(penaltyTriggers * (baseAmt / wd) * penaltyMultiplier);
      }
      
      // Calculate absent deduction rate if absent > 0
      let absentPenalty = penaltyDeduct + latenessPenalty;
      if (absent > 0) {
        // Flat daily gross rate deduction if absent
        absentPenalty += Math.round((gross / wd) * absent);
      }

      // Overtime Pay calculations using configuration settings
      const otHours = emp.empId === "2023046001" ? 12 : (emp.empId === "2023043021" ? 8 : 0);
      const hourlyRate = basic / 208; // 208 standard work hours per month
      const otPay = Math.round(otHours * hourlyRate * otMultiplier);

      // Attendance Bonus using configuration settings
      const attBonus = absent === 0 ? attendanceBonus : 0;

      // PF Employee deduction using configuration settings
      const pfVal = Math.round(basic * (pfEmployeeRate / 100));

      // Monthly projected Tax using configuration exemption slab settings
      const annualGross = gross * 12;
      let taxVal = 0;
      if (annualGross > taxStandardExemption) {
        taxVal = Math.round(((annualGross - taxStandardExemption) * 0.05) / 12);
      }

      // Net salary formula: Gross + OT + Bonus - Deductions (Lunch, Transport, PF, Tax, Absents, Other)
      const netSalary = (gross + otPay + attBonus) - (lunchDeduct + transportDeduct + pfVal + taxVal + absentPenalty + otherDeduct);

      return {
        id: emp.id,
        empId: emp.empId,
        name: emp.name,
        wd,
        present,
        absent,
        leave,
        holiday,
        basic,
        gross,
        ot: otHours.toFixed(2),
        otPay,
        attBonus,
        allowance: 0,
        lunchDeduct,
        transportDeduct,
        pf: pfVal,
        tax: taxVal,
        absentDeduct: absentPenalty,
        advance: 0,
        adjust: 0,
        wagelyAdv: 0,
        loan: 0,
        netSalary
      };
    });

    // Save and load
    localStorage.setItem(activeStorageKey, JSON.stringify(generated));
    setProcessedRecords(generated);
    setIsDataLoaded(true);
    alert(`Success: Payroll processed and saved for ${processMonth} ${processYear}! (${generated.length} employees calculated).`);
  };

  // Trigger row edits
  const handleEditRecord = (record: ProcessedSalaryRecord) => {
    setEditingRecord(record);
    setEditWd(record.wd);
    setEditPresent(record.present);
    setEditAbsent(record.absent);
    setEditLeave(record.leave);
    setEditHoliday(record.holiday);

    setEditBasic(record.basic);
    setEditGross(record.gross);
    setEditOtHours(record.ot);
    setEditOtPay(record.otPay);
    setEditAttBonus(record.attBonus);
    setEditAllowance(record.allowance);

    setEditLunchDeduct(record.lunchDeduct);
    setEditTransportDeduct(record.transportDeduct);
    setEditPf(record.pf);
    setEditTax(record.tax);
    setEditAbsentDeduct(record.absentDeduct);
    setEditAdvance(record.advance);
    setEditWagelyAdv(record.wagelyAdv);
    setEditLoan(record.loan);
    setEditAdjust(record.adjust);
  };

  // Live Audited net salary calculation in dialog
  const liveNetSalary = useMemo(() => {
    const gross = Number(editGross) || 0;
    const ot = Number(editOtPay) || 0;
    const bonus = Number(editAttBonus) || 0;
    const allowance = Number(editAllowance) || 0;
    const adjust = Number(editAdjust) || 0;

    const lunch = Number(editLunchDeduct) || 0;
    const transport = Number(editTransportDeduct) || 0;
    const pf = Number(editPf) || 0;
    const tax = Number(editTax) || 0;
    const absent = Number(editAbsentDeduct) || 0;
    const advance = Number(editAdvance) || 0;
    const loan = Number(editLoan) || 0;

    return (gross + ot + bonus + allowance + adjust) - (lunch + transport + pf + tax + absent + advance + loan);
  }, [
    editGross, editOtPay, editAttBonus, editAllowance, editAdjust,
    editLunchDeduct, editTransportDeduct, editPf, editTax, editAbsentDeduct, editAdvance, editLoan
  ]);

  // Save manual overrides
  const handleSaveOverrides = () => {
    if (!editingRecord) return;

    const updatedList = processedRecords.map((r) => {
      if (r.id === editingRecord.id) {
        return {
          ...r,
          wd: editWd,
          present: editPresent,
          absent: editAbsent,
          leave: editLeave,
          holiday: editHoliday,
          basic: editBasic,
          gross: editGross,
          ot: editOtHours,
          otPay: editOtPay,
          attBonus: editAttBonus,
          allowance: editAllowance,
          lunchDeduct: editLunchDeduct,
          transportDeduct: editTransportDeduct,
          pf: editPf,
          tax: editTax,
          absentDeduct: editAbsentDeduct,
          advance: editAdvance,
          adjust: editAdjust,
          wagelyAdv: editWagelyAdv,
          loan: editLoan,
          netSalary: liveNetSalary
        };
      }
      return r;
    });

    localStorage.setItem(activeStorageKey, JSON.stringify(updatedList));
    setProcessedRecords(updatedList);
    setEditingRecord(null);
  };

  const filteredRecords = processedRecords.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.empId.includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-800 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-5 md:p-8 space-y-6 w-full max-w-[1600px] mx-auto font-sans">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Home</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span>Payroll</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span className="text-slate-600">Salary Process</span>
          </div>

          {/* Header Description */}
          <div className="relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Monthly Salary Process & Adjustments
              </h1>
              <p className="text-sm text-slate-500 max-w-4xl leading-relaxed">
                Run dynamic payroll batches by loading rule mappings from deduction templates. View generated records per processing month, and manually adjust individual employee variables if necessary.
              </p>
            </div>
          </div>

          {/* Dynamic Configuration Controls Form */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Form row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Year</label>
                <select 
                  value={processYear}
                  onChange={(e) => setProcessYear(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans"
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Month</label>
                <select 
                  value={processMonth}
                  onChange={(e) => setProcessMonth(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans"
                >
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Process Type</label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>Final</option>
                  <option>Advance</option>
                  <option>Bonus</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Salary Type</label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>ALL</option>
                  <option>Regular</option>
                  <option>Contractual</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-start">
                <Button 
                  onClick={handleProcessSalaries}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl transition-all shadow-md shadow-rose-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Play className="size-4 shrink-0" />
                  PROCESS
                </Button>
              </div>
            </div>

            {/* Form row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-4">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <Building className="size-3 text-slate-400" /> Company
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>Pakiza Software Limited</option>
                </select>
              </div>

              <div className="col-span-4">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" /> Area Name
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>PSL-Operation</option>
                </select>
              </div>

              <div className="col-span-4">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <UserCheck className="size-3 text-slate-400" /> Employee Type
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>ALL</option>
                  <option>Permanent</option>
                  <option>Contractual</option>
                </select>
              </div>
            </div>

            {/* Form row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <Building2 className="size-3 text-slate-400" /> Department
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>ALL</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider flex items-center gap-1">
                  <ListFilter className="size-3 text-slate-400" /> Unit
                </label>
                <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans">
                  <option>ALL</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5 tracking-wider">Employee Id</label>
                <input
                  type="text"
                  placeholder="Use comma as separator"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold placeholder:text-slate-355 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="col-span-4 flex justify-start">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  onClick={handleFetchData}
                >
                  <Database className="size-4 shrink-0" />
                  GET PROCESSED DATA
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col min-h-[500px] overflow-hidden">
            
            {/* Top Action Bar */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="flex bg-slate-100/80 border border-slate-200/50 rounded-xl p-1 w-fit shadow-xs">
                <Button variant="ghost" size="sm" className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <FileDown className="size-4 text-emerald-600" />
                  EXCEL
                </Button>
                <div className="w-px bg-slate-200 my-1.5" />
                <Button variant="ghost" size="sm" className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <Printer className="size-4 text-blue-600" />
                  PRINT
                </Button>
                <div className="w-px bg-slate-200 my-1.5" />
                <Button variant="ghost" size="sm" className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5">
                  <FileText className="size-4 text-rose-600" />
                  PDF
                </Button>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search processed records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-64 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-450"
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-x-auto relative">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[2100px] border-collapse">
                <thead className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 bg-slate-50/50 border-b border-slate-200/80 sticky top-0 z-10 font-sans">
                  <tr>
                    <th className="px-3 py-3.5 border-r border-slate-100 w-12 text-center">SL</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-center w-20">Edit</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 w-24">Emp Id</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 min-w-[180px]">Name</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-center w-12">WD</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-center w-16">Present</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-center w-16">Absent</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-center w-16">Leave</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-center w-16">Holiday</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Basic</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Gross</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-center">OT Hrs</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">OT Pay</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Att. Bonus</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Allowance</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Lunch Deduct</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Transport Deduct</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">PF</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Tax</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Absent Deduct</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Advance</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Adjust</th>
                    <th className="px-3 py-3.5 border-r border-slate-100 text-right">Loan</th>
                    <th className="px-3 py-3.5 text-right pr-6 min-w-[140px] bg-blue-55/20 text-blue-600 font-extrabold">Final Net Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {!isDataLoaded ? (
                    <tr>
                      <td colSpan={24} className="px-6 py-20 text-center text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="size-6 text-slate-300" />
                          <span>No data retrieved. Select Month/Year and click "GET PROCESSED DATA" or run "PROCESS" calculations.</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={24} className="px-6 py-20 text-center text-slate-400 font-medium">
                        No processed records match selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-3 py-3 font-semibold text-slate-400 text-center border-r border-slate-100">{idx + 1}</td>
                        <td className="px-3 py-3 text-center border-r border-slate-100">
                          <button 
                            onClick={() => handleEditRecord(row)}
                            className="bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer shadow-xs" 
                            title="Adjust Record values"
                          >
                            <Edit className="size-3.5" />
                          </button>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-800 border-r border-slate-100">{row.empId}</td>
                        <td className="px-3 py-3 font-bold text-slate-800 border-r border-slate-100 min-w-[180px] group-hover:text-blue-600 transition-colors">{row.name}</td>
                        <td className="px-3 py-3 text-center border-r border-slate-100">{row.wd}</td>
                        <td className="px-3 py-3 text-center font-medium text-emerald-600 border-r border-slate-100">{row.present}</td>
                        <td className="px-3 py-3 text-center font-medium text-rose-500 border-r border-slate-100">{row.absent}</td>
                        <td className="px-3 py-3 text-center font-medium text-amber-600 border-r border-slate-100">{row.leave}</td>
                        <td className="px-3 py-3 text-center font-medium text-blue-600 border-r border-slate-100">{row.holiday}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">৳{row.basic.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">৳{row.gross.toLocaleString()}</td>
                        <td className="px-3 py-3 text-center border-r border-slate-100 font-mono">{row.ot}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">৳{row.otPay.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">৳{row.attBonus.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">৳{row.allowance.toLocaleString()}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">
                          {row.lunchDeduct > 0 ? (
                            <div className="flex flex-col items-end">
                              <span>৳{row.lunchDeduct.toLocaleString()}</span>
                              {/* Show small indicator if pro-rated lunch deduction in processing */}
                              {row.empId === "2026059411" && processMonth === "Jul" && processYear === "2026" && (
                                <span className="text-[9px] text-indigo-500 font-extrabold leading-none mt-0.5">Pro-rated</span>
                              )}
                            </div>
                          ) : "৳0"}
                        </td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">{row.transportDeduct > 0 ? `৳${row.transportDeduct.toLocaleString()}` : "৳0"}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">{row.pf > 0 ? `৳${row.pf.toLocaleString()}` : "৳0"}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">{row.tax > 0 ? `৳${row.tax.toLocaleString()}` : "৳0"}</td>
                        <td className="px-3 py-3 font-mono text-right text-rose-600 border-r border-slate-100">{row.absentDeduct > 0 ? `৳${row.absentDeduct.toLocaleString()}` : "৳0"}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">{row.advance > 0 ? `৳${row.advance.toLocaleString()}` : "৳0"}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">{row.adjust !== 0 ? `৳${row.adjust.toLocaleString()}` : "৳0"}</td>
                        <td className="px-3 py-3 font-mono text-right border-r border-slate-100">{row.loan > 0 ? `৳${row.loan.toLocaleString()}` : "৳0"}</td>
                        <td className="px-3 py-3 font-mono text-right pr-6 font-extrabold text-blue-600 bg-blue-50/20">৳{row.netSalary.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {isDataLoaded && (
              <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 text-xs font-bold text-slate-400">
                <div>
                  Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
                </div>
                <div className="flex gap-2 items-center">
                  <span className="cursor-not-allowed opacity-50 mr-2">Previous</span>
                  <button className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-sm shadow-blue-500/10">1</button>
                  <span className="cursor-not-allowed opacity-50 ml-2">Next</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ADJUSTMENT OVERLAYS EDIT MODAL */}
        <Dialog open={editingRecord !== null} onOpenChange={(open) => {
          if (!open) setEditingRecord(null);
        }}>
          {editingRecord && (
            <DialogContent className="sm:max-w-4xl p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-2xl">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl shadow-xs">
                    <Edit className="size-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-extrabold text-slate-800">
                      Payroll Adjustments — {editingRecord.name}
                    </DialogTitle>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Emp ID: {editingRecord.empId} • Editing {processMonth} {processYear} salary record</p>
                  </div>
                </div>
              </div>

              {/* Scrollable form details */}
              <div className="px-6 py-5 max-h-[60vh] overflow-y-auto bg-slate-50/40 space-y-6">
                
                {/* Section A: Attendance Parameters */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">1. Attendance Parameters</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Working Days</label>
                      <input
                        type="number"
                        value={editWd}
                        onChange={(e) => setEditWd(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-455 font-bold uppercase tracking-wider block text-emerald-600">Present Days</label>
                      <input
                        type="number"
                        value={editPresent}
                        onChange={(e) => setEditPresent(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-455 font-bold uppercase tracking-wider block text-rose-500">Absent Days</label>
                      <input
                        type="number"
                        value={editAbsent}
                        onChange={(e) => setEditAbsent(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-455 font-bold uppercase tracking-wider block text-amber-600">Leave Days</label>
                      <input
                        type="number"
                        value={editLeave}
                        onChange={(e) => setEditLeave(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-455 font-bold uppercase tracking-wider block text-blue-600">Holiday Days</label>
                      <input
                        type="number"
                        value={editHoliday}
                        onChange={(e) => setEditHoliday(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Salary & Earnings overrides */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">2. Monthly Earnings (৳)</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Basic Salary</label>
                      <input
                        type="number"
                        value={editBasic}
                        onChange={(e) => setEditBasic(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gross Salary</label>
                      <input
                        type="number"
                        value={editGross}
                        onChange={(e) => setEditGross(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">OT Hours</label>
                      <input
                        type="text"
                        value={editOtHours}
                        onChange={(e) => setEditOtHours(e.target.value)}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">OT Pay (৳)</label>
                      <input
                        type="number"
                        value={editOtPay}
                        onChange={(e) => setEditOtPay(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Att. Bonus (৳)</label>
                      <input
                        type="number"
                        value={editAttBonus}
                        onChange={(e) => setEditAttBonus(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Allowance (৳)</label>
                      <input
                        type="number"
                        value={editAllowance}
                        onChange={(e) => setEditAllowance(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Deductions, Advances & Loans overrides */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">3. Monthly Deductions & Exceptions (৳)</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Lunch Deduct</label>
                      <input
                        type="number"
                        value={editLunchDeduct}
                        onChange={(e) => setEditLunchDeduct(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Transport Deduct</label>
                      <input
                        type="number"
                        value={editTransportDeduct}
                        onChange={(e) => setEditTransportDeduct(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">PF Deduct</label>
                      <input
                        type="number"
                        value={editPf}
                        onChange={(e) => setEditPf(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Tax Deduct</label>
                      <input
                        type="number"
                        value={editTax}
                        onChange={(e) => setEditTax(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider text-rose-500">Absent Penalty</label>
                      <input
                        type="number"
                        value={editAbsentDeduct}
                        onChange={(e) => setEditAbsentDeduct(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-rose-600 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Salary Adv.</label>
                      <input
                        type="number"
                        value={editAdvance}
                        onChange={(e) => setEditAdvance(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Loan Repay</label>
                      <input
                        type="number"
                        value={editLoan}
                        onChange={(e) => setEditLoan(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Adjustments</label>
                      <input
                        type="number"
                        value={editAdjust}
                        onChange={(e) => setEditAdjust(Number(e.target.value))}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section D: Live calculated net pay auditor banner */}
                <div className="bg-blue-600 text-white rounded-2xl p-5 flex flex-row items-center justify-between shadow-md shadow-blue-500/10">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">Live Net Pay Audit</span>
                    <span className="text-xs opacity-75 block font-medium">Matches recalculations based on configured adjustments.</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-2xl font-extrabold tracking-tight font-mono">
                      ৳ {liveNetSalary.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-2.5">
                <Button
                  variant="ghost"
                  className="text-slate-600 font-bold px-4 rounded-xl hover:bg-slate-100 h-10 select-none text-xs cursor-pointer"
                  onClick={() => setEditingRecord(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md h-10 px-6 rounded-xl flex items-center gap-2 select-none text-xs cursor-pointer"
                  onClick={handleSaveOverrides}
                >
                  <Save className="size-4" />
                  Save Adjustments
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </main>
    </div>
  );
}
