import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileText,
  Plus,
  Trash2,
  X,
  ChevronDown,
  Calculator,
  RefreshCw,
  Send,
  Edit,
  Eye,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import type { SettlementTypePolicy } from "./final-settlement-configuration";

export const Route = createFileRoute("/final-settlement")({
  head: () => ({
    meta: [
      { title: "Final Settlement — CRIPTON" },
      { name: "description", content: "Process and manage employee final settlements." },
    ],
  }),
  component: FinalSettlementPage,
});

interface SettlementRecord {
  id: string;
  empId: string;
  name: string;
  department: string;
  designation: string;
  joinDate: string;
  resignDate: string;
  settleDate: string;
  settleType: string;
  settleAmt: number;
}
interface DynamicRow {
  for: string;
  amount: string;
}

const mockData: SettlementRecord[] = [
  {
    id: "1",
    empId: "2023043910",
    name: "Tahmid Afsar",
    department: "Business Innovation",
    designation: "Asst. Manager",
    joinDate: "17/04/2023",
    resignDate: "28/05/2026",
    settleDate: "15/06/2026",
    settleType: "Resignation",
    settleAmt: 109317.0,
  },
  {
    id: "2",
    empId: "2023044865",
    name: "Md. Nizam Uddin Shamrat",
    department: "Business Innovation",
    designation: "Asst. Manager",
    joinDate: "17/09/2023",
    resignDate: "17/03/2026",
    settleDate: "20/03/2026",
    settleType: "Resignation",
    settleAmt: -18179.0,
  },
  {
    id: "3",
    empId: "2015051511",
    name: "Anika Rahman",
    department: "Human Resources & Admin",
    designation: "Senior Manager",
    joinDate: "15/05/2015",
    resignDate: "15/06/2026",
    settleDate: "01/07/2026",
    settleType: "Termination",
    settleAmt: 489500.0,
  },
  {
    id: "4",
    empId: "2018091204",
    name: "Tariqul Islam Sunny",
    department: "Software Engineering",
    designation: "Lead Developer",
    joinDate: "12/09/2018",
    resignDate: "10/05/2026",
    settleDate: "20/05/2026",
    settleType: "Retirement",
    settleAmt: 320000.0,
  },
  {
    id: "5",
    empId: "2025090122",
    name: "Sabbir Ahmed",
    department: "Business Innovation",
    designation: "Software Engineer",
    joinDate: "01/09/2025",
    resignDate: "01/04/2026",
    settleDate: "15/04/2026",
    settleType: "Dismissal",
    settleAmt: 23700.0,
  },
  {
    id: "6",
    empId: "2024021811",
    name: "Rashedul Hasan",
    department: "Design & UX",
    designation: "UX Designer",
    joinDate: "18/02/2024",
    resignDate: "05/06/2026",
    settleDate: "15/06/2026",
    settleType: "Death",
    settleAmt: 85200.0,
  }
];

// Dynamic types are loaded from configuration
const elYears = ["2022", "2023", "2024", "2025", "2026"];
const elMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── Reusable small components ────────────────────────────────────────────────

function Select({ value, onChange, children, className = "" }: any) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`w-full text-xs border border-border bg-background rounded px-2.5 py-1.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-2 size-3 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder = "",
  type = "text",
  readOnly = false,
  className = "",
}: any) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full text-xs border border-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40 ${readOnly ? "bg-muted/40 text-foreground" : "bg-background"} ${className}`}
    />
  );
}

// Left side: label + colon + readonly value
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center min-h-[28px] border-b border-border/30 last:border-0">
      <span className="text-[11px] text-muted-foreground w-32 shrink-0 pr-2">{label}</span>
      <span className="text-[11px] text-muted-foreground mr-2">:</span>
      <span className="text-[11px] font-medium text-foreground">{value || ""}</span>
    </div>
  );
}

// Right side: two-column calculation row
function CalcRow({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 border-b border-border/25 last:border-0">
      <div className="py-1.5">{left}</div>
      <div className="py-1.5 border-l border-border/25 pl-3">{right}</div>
    </div>
  );
}

// Right side individual field
function CalcField({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value?: string;
  onChange?: any;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground w-28 shrink-0">{label}</span>
      {onChange ? (
        <Input
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className="flex-1 h-6 py-0.5 text-[11px] font-mono"
        />
      ) : (
        <span className="text-[11px] font-bold text-foreground font-mono">{value || ""}</span>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-b border-border/60">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{title}</span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded border border-border/40 overflow-hidden bg-card/50">
      <div className="bg-muted/30 px-3 py-1.5 border-b border-border/40">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function SectionToggle({ label = "Include" }: { label?: string }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input type="checkbox" defaultChecked className="accent-primary size-3" />
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
    </label>
  );
}

// ─── Mock Data & Configurations ───────────────────────────────────────────────

const defaultSettlementPolicies: SettlementTypePolicy[] = [
  {
    id: "1", name: "Resignation", legalReference: "Section 27, BLA 2006",
    description: "Worker voluntarily resigns.",
    noticePeriodDays: 60, noticePaidByEmployer: false, noticeDeductedFromEmployee: true,
    compensationTiers: [
      { minYear: 2, minMonth: 11, minDay: 30, daysPerYear: 7 },
      { minYear: 3, minMonth: 0,  minDay: 0,  daysPerYear: 7 },
      { minYear: 3, minMonth: 11, minDay: 0,  daysPerYear: 7 },
      { minYear: 3, minMonth: 11, minDay: 30, daysPerYear: 15 },
      { minYear: 4, minMonth: 0,  minDay: 0,  daysPerYear: 15 },
      { minYear: 9, minMonth: 0,  minDay: 0,  daysPerYear: 15 },
      { minYear: 9, minMonth: 11, minDay: 0,  daysPerYear: 15 },
      { minYear: 9, minMonth: 11, minDay: 30, daysPerYear: 30 },
      { minYear: 10, minMonth: 0, minDay: 0,  daysPerYear: 30 },
    ],
    minServiceMonthsForCompensation: 35, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
  {
    id: "2", name: "Termination by Employer", legalReference: "Section 26, BLA 2006",
    description: "Employer terminates a permanent worker.",
    noticePeriodDays: 120, noticePaidByEmployer: true, noticeDeductedFromEmployee: false,
    compensationTiers: [
      { minYear: 1, minMonth: 0, minDay: 0, daysPerYear: 30 },
      { minYear: 10, minMonth: 0, minDay: 0, daysPerYear: 45 },
    ],
    minServiceMonthsForCompensation: 12, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
  {
    id: "3", name: "Retrenchment", legalReference: "Section 20, BLA 2006",
    description: "Employer retrenches on grounds of redundancy.",
    noticePeriodDays: 30, noticePaidByEmployer: true, noticeDeductedFromEmployee: false,
    compensationTiers: [
      { minYear: 1, minMonth: 0, minDay: 0, daysPerYear: 30 },
      { minYear: 10, minMonth: 0, minDay: 0, daysPerYear: 45 },
    ],
    minServiceMonthsForCompensation: 12, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
  {
    id: "4", name: "Discharge", legalReference: "Section 22, BLA 2006",
    description: "Worker discharged for physical/mental incapacity.",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [
      { minYear: 1, minMonth: 0, minDay: 0, daysPerYear: 30 },
      { minYear: 10, minMonth: 0, minDay: 0, daysPerYear: 45 },
    ],
    minServiceMonthsForCompensation: 12, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
  {
    id: "5", name: "Dismissal (Misconduct)", legalReference: "Section 23(1)(b) & 23(3), BLA 2006",
    description: "Worker dismissed for misconduct.",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [{ minYear: 1, minMonth: 0, minDay: 0, daysPerYear: 15 }],
    minServiceMonthsForCompensation: 12, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: false, minServiceMonthsForGratuity: 0,
    isProvidentFundPayable: true, isMisconductBased: true, isDeathCase: false,
  },
  {
    id: "6", name: "Removal (Minor Punishment)", legalReference: "Section 23(2)(a), BLA 2006",
    description: "Worker removed as lighter punishment for misconduct.",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [{ minYear: 1, minMonth: 0, minDay: 0, daysPerYear: 15 }],
    minServiceMonthsForCompensation: 12, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: false, minServiceMonthsForGratuity: 0,
    isProvidentFundPayable: true, isMisconductBased: true, isDeathCase: false,
  },
  {
    id: "7", name: "Retirement (Age-Based)", legalReference: "Section 28, BLA 2006",
    description: "Worker retires upon reaching 60 years.",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [
      { minYear: 1, minMonth: 0, minDay: 0, daysPerYear: 30 },
      { minYear: 10, minMonth: 0, minDay: 0, daysPerYear: 45 },
    ],
    minServiceMonthsForCompensation: 12, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
  {
    id: "8", name: "Voluntary Retirement (25 Yrs Service)", legalReference: "Section 2(1), BLA 2006",
    description: "Worker voluntarily retires after 25 years.",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [
      { minYear: 25, minMonth: 0, minDay: 0, daysPerYear: 30 },
      { minYear: 35, minMonth: 0, minDay: 0, daysPerYear: 45 },
    ],
    minServiceMonthsForCompensation: 300, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
  {
    id: "9", name: "Death in Service", legalReference: "Section 19, BLA 2006 (Amended 2013)",
    description: "Worker dies during service (2+ years required).",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [
      { minYear: 2, minMonth: 0, minDay: 0, daysPerYear: 30 },
      { minYear: 10, minMonth: 0, minDay: 0, daysPerYear: 45 },
    ],
    minServiceMonthsForCompensation: 24, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: true,
  },
  {
    id: "10", name: "Absconding / Abandonment", legalReference: "Section 27(3A), BLA 2006 (Amended 2013)",
    description: "Worker absent >10 days without notice.",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [],
    minServiceMonthsForCompensation: 0, isCompensationApplicable: false,
    earnedLeaveEncashable: true, isGratuityApplicable: false, minServiceMonthsForGratuity: 0,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
  {
    id: "11", name: "Contract Expiry", legalReference: "Section 4(5), BLA 2006",
    description: "Temporary worker's contract expires.",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [],
    minServiceMonthsForCompensation: 0, isCompensationApplicable: false,
    earnedLeaveEncashable: true, isGratuityApplicable: false, minServiceMonthsForGratuity: 0,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
  {
    id: "12", name: "Mutual Separation", legalReference: "As per mutual agreement",
    description: "Employment ends by mutual agreement.",
    noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false,
    compensationTiers: [
      { minYear: 1, minMonth: 0, minDay: 0, daysPerYear: 30 },
      { minYear: 10, minMonth: 0, minDay: 0, daysPerYear: 45 },
    ],
    minServiceMonthsForCompensation: 12, isCompensationApplicable: true,
    earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false,
  },
];

interface MockEmployee {
  company: string;
  name: string;
  joiningDate: string;
  designation: string;
  department: string;
  section: string;
  line: string;
  grade: string;
  grossSalary: string;
  basicSalary: string;
  tenure: string;
  dayShortage: string;
  resignApplyDate: string;
  resignDate: string;
  lastWorkingDate: string;
  settlementDate: string;
  workingDays: string;
  present: string;
  leave: string;
  holiday: string;
  absentDays: string;
  absentDeduction: string;
  pfDeduction: string;
  taxDeduction: string;
  advanceDeduction: string;
  loanDeduction: string;
  lunchDeduction: string;
  othersDeduction: string;
  revStamp: string;
  paySalary: string;
  otRate: string;
  otHour: string;
  otPayment: string;
  behaviourAllowance: string;
  holidayAllowance: string;
  generalAllowance: string;
  conveyanceAllowance: string;
  incentiveAllowance: string;
  otherAllowance: string;
  arrear: string;
  attendanceBonus: string;
  tiffinNightBill: string;
  elFrom: string;
  elTo: string;
  elBalanceDays: string;
  clBalanceDays: string;
  pfAmount: string;
  cpfAmount: string;
  serviceBenefitYear: string;
  serviceBenefitMonth: string;
  serviceBenefitDay: string;
  unit: string;
  employeeType: string;
  bankAccount: string;
  houseRent: string;
  medical: string;
  transport: string;
  food: string;
  photo: string;
}

const MOCK_EMPLOYEES: Record<string, MockEmployee> = {
  "2023043910": {
    company: "Pakiza Software Limited (PSL-Operation)",
    name: "Tahmid Afsar",
    joiningDate: "17/04/2023",
    designation: "Asst. Manager",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    line: "N/A",
    grade: "Grade-3",
    grossSalary: "46500.00",
    basicSalary: "27900.00",
    tenure: "03 Year, 00 Month, 11 Day",
    dayShortage: "5 Days",
    resignApplyDate: "2026-04-28",
    resignDate: "2026-05-28",
    lastWorkingDate: "2026-05-25",
    settlementDate: "2026-06-15",
    workingDays: "25",
    present: "23",
    leave: "2",
    holiday: "0",
    absentDays: "2",
    absentDeduction: "1860.00",
    pfDeduction: "2000.00",
    taxDeduction: "500.00",
    advanceDeduction: "1000.00",
    loanDeduction: "500.00",
    lunchDeduction: "1200.00",
    othersDeduction: "0.00",
    revStamp: "10.00",
    paySalary: "25000.00",
    otRate: "150.00",
    otHour: "10",
    otPayment: "1500.00",
    behaviourAllowance: "500.00",
    holidayAllowance: "0.00",
    generalAllowance: "1000.00",
    conveyanceAllowance: "2000.00",
    incentiveAllowance: "1500.00",
    otherAllowance: "0.00",
    arrear: "0.00",
    attendanceBonus: "1000.00",
    tiffinNightBill: "300.00",
    elFrom: "2023",
    elTo: "2026",
    elBalanceDays: "45.50",
    clBalanceDays: "5",
    pfAmount: "30000.00",
    cpfAmount: "30000.00",
    serviceBenefitYear: "3",
    serviceBenefitMonth: "0",
    serviceBenefitDay: "11",
    unit: "PSL",
    employeeType: "Office Executive",
    bankAccount: "171.103.0256059",
    houseRent: "13950.00",
    medical: "2790.00",
    transport: "1860.00",
    food: "0.00",
    photo: "https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
  },
  "2015051511": {
    company: "Pakiza Software Limited (PSL-Operation)",
    name: "Anika Rahman",
    joiningDate: "15/05/2015",
    designation: "Senior Manager",
    department: "Human Resources & Admin",
    section: "Corporate HR",
    line: "N/A",
    grade: "Grade-1",
    grossSalary: "75000.00",
    basicSalary: "45000.00",
    tenure: "11 Year, 01 Month, 00 Day",
    dayShortage: "0 Days",
    resignApplyDate: "2026-05-15",
    resignDate: "2026-06-15",
    lastWorkingDate: "2026-06-15",
    settlementDate: "2026-07-01",
    workingDays: "26",
    present: "25",
    leave: "1",
    holiday: "0",
    absentDays: "0",
    absentDeduction: "0.00",
    pfDeduction: "4500.00",
    taxDeduction: "2500.00",
    advanceDeduction: "0.00",
    loanDeduction: "0.00",
    lunchDeduction: "1200.00",
    othersDeduction: "0.00",
    revStamp: "10.00",
    paySalary: "45000.00",
    otRate: "0.00",
    otHour: "0",
    otPayment: "0.00",
    behaviourAllowance: "2000.00",
    holidayAllowance: "0.00",
    generalAllowance: "5000.00",
    conveyanceAllowance: "5000.00",
    incentiveAllowance: "0.00",
    otherAllowance: "0.00",
    arrear: "0.00",
    attendanceBonus: "2000.00",
    tiffinNightBill: "0.00",
    elFrom: "2015",
    elTo: "2026",
    elBalanceDays: "120.00",
    clBalanceDays: "10",
    pfAmount: "240000.00",
    cpfAmount: "240000.00",
    serviceBenefitYear: "11",
    serviceBenefitMonth: "1",
    serviceBenefitDay: "0",
    unit: "Corporate",
    employeeType: "HR Director",
    bankAccount: "189.201.0984121",
    houseRent: "22500.00",
    medical: "4500.00",
    transport: "3000.00",
    food: "0.00",
    photo: "https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
  },
  "2025090122": {
    company: "Pakiza Software Limited (PSL-Operation)",
    name: "Sabbir Ahmed",
    joiningDate: "01/09/2025",
    designation: "Software Engineer",
    department: "Business Innovation",
    section: "Core Software Engineering",
    line: "N/A",
    grade: "Grade-4",
    grossSalary: "30000.00",
    basicSalary: "18000.00",
    tenure: "00 Year, 08 Month, 00 Day",
    dayShortage: "0 Days",
    resignApplyDate: "2026-04-01",
    resignDate: "2026-05-01",
    lastWorkingDate: "2026-05-01",
    settlementDate: "2026-05-15",
    workingDays: "22",
    present: "20",
    leave: "2",
    holiday: "0",
    absentDays: "0",
    absentDeduction: "0.00",
    pfDeduction: "1800.00",
    taxDeduction: "0.00",
    advanceDeduction: "2000.00",
    loanDeduction: "0.00",
    lunchDeduction: "1200.00",
    othersDeduction: "0.00",
    revStamp: "10.00",
    paySalary: "18000.00",
    otRate: "100.00",
    otHour: "5",
    otPayment: "500.00",
    behaviourAllowance: "0.00",
    holidayAllowance: "0.00",
    generalAllowance: "0.00",
    conveyanceAllowance: "1000.00",
    incentiveAllowance: "0.00",
    otherAllowance: "0.00",
    arrear: "0.00",
    attendanceBonus: "0.00",
    tiffinNightBill: "0.00",
    elFrom: "2025",
    elTo: "2026",
    elBalanceDays: "5.00",
    clBalanceDays: "2",
    pfAmount: "14400.00",
    cpfAmount: "14400.00",
    serviceBenefitYear: "0",
    serviceBenefitMonth: "8",
    serviceBenefitDay: "0",
    unit: "PSL",
    employeeType: "Core Developer",
    bankAccount: "192.168.0125439",
    houseRent: "9000.00",
    medical: "1800.00",
    transport: "1200.00",
    food: "0.00",
    photo: "https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
  },
  "2023044865": {
    company: "Pakiza Software Limited (PSL-Operation)",
    name: "Md. Nizam Uddin Shamrat",
    joiningDate: "17/09/2023",
    designation: "Asst. Manager",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    line: "N/A",
    grade: "Grade-3",
    grossSalary: "46500.00",
    basicSalary: "27900.00",
    tenure: "02 Year, 06 Month, 00 Day",
    dayShortage: "0 Days",
    resignApplyDate: "2026-02-15",
    resignDate: "2026-03-17",
    lastWorkingDate: "2026-03-17",
    settlementDate: "2026-03-20",
    workingDays: "26",
    present: "24",
    leave: "2",
    holiday: "0",
    absentDays: "0",
    absentDeduction: "0.00",
    pfDeduction: "2000.00",
    taxDeduction: "500.00",
    advanceDeduction: "20000.00",
    loanDeduction: "0.00",
    lunchDeduction: "1200.00",
    othersDeduction: "0.00",
    revStamp: "10.00",
    paySalary: "25000.00",
    otRate: "150.00",
    otHour: "0",
    otPayment: "0.00",
    behaviourAllowance: "500.00",
    holidayAllowance: "0.00",
    generalAllowance: "1000.00",
    conveyanceAllowance: "2000.00",
    incentiveAllowance: "1500.00",
    otherAllowance: "0.00",
    arrear: "0.00",
    attendanceBonus: "1000.00",
    tiffinNightBill: "0.00",
    elFrom: "2023",
    elTo: "2026",
    elBalanceDays: "12.00",
    clBalanceDays: "5",
    pfAmount: "18000.00",
    cpfAmount: "18000.00",
    serviceBenefitYear: "2",
    serviceBenefitMonth: "6",
    serviceBenefitDay: "0",
    unit: "PSL",
    employeeType: "Office Executive",
    bankAccount: "171.103.0256088",
    houseRent: "13950.00",
    medical: "2790.00",
    transport: "1860.00",
    food: "0.00",
    photo: "https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
  },
  "2018091204": {
    company: "Pakiza Software Limited (PSL-Operation)",
    name: "Tariqul Islam Sunny",
    joiningDate: "12/09/2018",
    designation: "Lead Developer",
    department: "Software Engineering",
    section: "Core Software Engineering",
    line: "N/A",
    grade: "Grade-1",
    grossSalary: "58000.00",
    basicSalary: "34800.00",
    tenure: "07 Year, 08 Month, 00 Day",
    dayShortage: "0 Days",
    resignApplyDate: "2026-04-10",
    resignDate: "2026-05-10",
    lastWorkingDate: "2026-05-10",
    settlementDate: "2026-05-20",
    workingDays: "25",
    present: "23",
    leave: "2",
    holiday: "0",
    absentDays: "0",
    absentDeduction: "0.00",
    pfDeduction: "3500.00",
    taxDeduction: "1500.00",
    advanceDeduction: "0.00",
    loanDeduction: "0.00",
    lunchDeduction: "1200.00",
    othersDeduction: "0.00",
    revStamp: "10.00",
    paySalary: "35000.00",
    otRate: "0.00",
    otHour: "0",
    otPayment: "0.00",
    behaviourAllowance: "1000.00",
    holidayAllowance: "0.00",
    generalAllowance: "2000.00",
    conveyanceAllowance: "3000.00",
    incentiveAllowance: "2000.00",
    otherAllowance: "0.00",
    arrear: "0.00",
    attendanceBonus: "1500.00",
    tiffinNightBill: "0.00",
    elFrom: "2018",
    elTo: "2026",
    elBalanceDays: "45.00",
    clBalanceDays: "8",
    pfAmount: "160000.00",
    cpfAmount: "160000.00",
    serviceBenefitYear: "7",
    serviceBenefitMonth: "8",
    serviceBenefitDay: "0",
    unit: "PSL",
    employeeType: "Technical Lead",
    bankAccount: "192.168.0125488",
    houseRent: "17400.00",
    medical: "3480.00",
    transport: "2320.00",
    food: "0.00",
    photo: "https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
  },
  "2024021811": {
    company: "Pakiza Software Limited (PSL-Operation)",
    name: "Rashedul Hasan",
    joiningDate: "18/02/2024",
    designation: "UX Designer",
    department: "Design & UX",
    section: "Creative UI/UX",
    line: "N/A",
    grade: "Grade-3",
    grossSalary: "30000.00",
    basicSalary: "18000.00",
    tenure: "02 Year, 03 Month, 18 Day",
    dayShortage: "0 Days",
    resignApplyDate: "2026-05-05",
    resignDate: "2026-06-05",
    lastWorkingDate: "2026-06-05",
    settlementDate: "2026-06-15",
    workingDays: "26",
    present: "24",
    leave: "2",
    holiday: "0",
    absentDays: "0",
    absentDeduction: "0.00",
    pfDeduction: "1800.00",
    taxDeduction: "0.00",
    advanceDeduction: "0.00",
    loanDeduction: "0.00",
    lunchDeduction: "1200.00",
    othersDeduction: "0.00",
    revStamp: "10.00",
    paySalary: "18000.00",
    otRate: "100.00",
    otHour: "2",
    otPayment: "200.00",
    behaviourAllowance: "500.00",
    holidayAllowance: "0.00",
    generalAllowance: "1000.00",
    conveyanceAllowance: "1000.00",
    incentiveAllowance: "500.00",
    otherAllowance: "0.00",
    arrear: "0.00",
    attendanceBonus: "1000.00",
    tiffinNightBill: "0.00",
    elFrom: "2024",
    elTo: "2026",
    elBalanceDays: "15.00",
    clBalanceDays: "5",
    pfAmount: "24400.00",
    cpfAmount: "24400.00",
    serviceBenefitYear: "2",
    serviceBenefitMonth: "3",
    serviceBenefitDay: "18",
    unit: "PSL",
    employeeType: "Creative Executive",
    bankAccount: "192.168.0125499",
    houseRent: "9000.00",
    medical: "1800.00",
    transport: "1200.00",
    food: "0.00",
    photo: "https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
  }
};

// ─── Compensation Tier Helper ──────────────────────────────────────────────────
// Reads compensationTiers from the active policy (configured in Final Settlement
// Configuration) and finds the highest applicable tier for the given Y/M/D.
// Tiers are sorted descending by Y/M/D — the first tier whose minimum is ≤
// the employee's service period wins.
function getCompDaysFromTiers(
  tiers: Array<{ minYear: number; minMonth: number; minDay: number; daysPerYear: number; minServiceDays?: number }>,
  y: number,
  m: number,
  d: number,
  basis: "year" | "day" = "year"
): number {
  if (!tiers || tiers.length === 0) return 0;
  
  if (basis === "day") {
    const sorted = [...tiers].sort((a, b) => (b.minServiceDays ?? 0) - (a.minServiceDays ?? 0));
    const empTotalDays = y * 365 + m * 30 + d;
    for (const tier of sorted) {
      if (empTotalDays >= (tier.minServiceDays ?? 0)) return tier.daysPerYear;
    }
    return 0;
  } else {
    const sorted = [...tiers].sort((a, b) => {
      if (b.minYear !== a.minYear) return b.minYear - a.minYear;
      if (b.minMonth !== a.minMonth) return b.minMonth - a.minMonth;
      return b.minDay - a.minDay;
    });
    for (const tier of sorted) {
      const empTotal  = y * 366 + m * 31 + d;
      const tierTotal = tier.minYear * 366 + tier.minMonth * 31 + tier.minDay;
      if (empTotal >= tierTotal) return tier.daysPerYear;
    }
    return 0;
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────

function FinalSettlementPage() {
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [records] = useState<SettlementRecord[]>(mockData);

  // ── Core fields ──
  const [mode, setMode] = useState("With Salary");
  const [employeeId, setEmployeeId] = useState("");
  const [empLoaded, setEmpLoaded] = useState(false);

  // Dynamic Policies
  const [settlementPolicies, setSettlementPolicies] = useState<SettlementTypePolicy[]>(defaultSettlementPolicies);

  useEffect(() => {
    const stored = localStorage.getItem("fs_settlement_types_v4");
    if (stored) {
      const parsed = JSON.parse(stored).map((p: any) => ({
        ...p,
        calculationBasis: p.calculationBasis || "year",
        countPresentDay: p.countPresentDay !== undefined ? p.countPresentDay : false,
      }));
      setSettlementPolicies(parsed);
    } else {
      const initialized = defaultSettlementPolicies.map((p: any) => ({
        ...p,
        calculationBasis: "year",
        countPresentDay: false,
      }));
      setSettlementPolicies(initialized);
      localStorage.setItem("fs_settlement_types_v4", JSON.stringify(initialized));
    }
  }, []);

  // Settlement Info
  const [settlementType, setSettlementType] = useState("");
  const [settlementDate, setSettlementDate] = useState("");
  const [resignApplyDate, setResignApplyDate] = useState("");
  const [resignDate, setResignDate] = useState("");
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [deductionType, setDeductionType] = useState<"yes" | "no">("no");

  // Calculation fields (editable)
  const [noticePeriod, setNoticePeriod] = useState("");
  const [noticeShortage, setNoticeShortage] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [present, setPresent] = useState("");
  const [leave, setLeave] = useState("");
  const [holiday, setHoliday] = useState("");
  const [absentDays, setAbsentDays] = useState("");
  const [absentDeduction, setAbsentDeduction] = useState("");
  const [pfDeduction, setPfDeduction] = useState("");
  const [taxDeduction, setTaxDeduction] = useState("");
  const [advanceDeduction, setAdvanceDeduction] = useState("");
  const [loanDeduction, setLoanDeduction] = useState("");
  const [lunchDeduction, setLunchDeduction] = useState("");
  const [othersDeduction, setOthersDeduction] = useState("");
  const [revStamp, setRevStamp] = useState("");
  const [paySalary, setPaySalary] = useState("");
  const [wagelyAdvance, setWagelyAdvance] = useState("");
  const [otRate, setOtRate] = useState("");
  const [otPayment, setOtPayment] = useState("");
  const [otHour, setOtHour] = useState("");
  const [behaviourAllowance, setBehaviourAllowance] = useState("");
  const [holidayAllowance, setHolidayAllowance] = useState("");
  const [generalAllowance, setGeneralAllowance] = useState("");
  const [conveyanceAllowance, setConveyanceAllowance] = useState("");
  const [incentiveAllowance, setIncentiveAllowance] = useState("");
  const [otherAllowance, setOtherAllowance] = useState("");
  const [arrear, setArrear] = useState("");
  const [attendanceBonus, setAttendanceBonus] = useState("");
  const [netSalary, setNetSalary] = useState("");
  const [tiffinNightBill, setTiffinNightBill] = useState("");

  // EL Year
  const [elFrom, setElFrom] = useState("");
  const [elFromMonth, setElFromMonth] = useState("");
  const [elTo, setElTo] = useState("");
  const [elToMonth, setElToMonth] = useState("");
  const [elBalanceDays, setElBalanceDays] = useState("");
  const [elPayment, setElPayment] = useState("");
  const [clBalanceDays, setClBalanceDays] = useState("");
  const [clPayment, setClPayment] = useState("");
  const [serviceBenefitYear, setServiceBenefitYear] = useState("");
  const [serviceBenefitMonth, setServiceBenefitMonth] = useState("");
  const [serviceBenefitDay, setServiceBenefitDay] = useState("");
  const [payableDaysPerYear, setPayableDaysPerYear] = useState("");
  const [serviceBenefitTotal, setServiceBenefitTotal] = useState("");
  const [pfAmount, setPfAmount] = useState("");
  const [cpfAmount, setCpfAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [compensationAmt, setCompensationAmt] = useState("");
  const [compensationRemarks, setCompensationRemarks] = useState("");
  const [netPayment, setNetPayment] = useState("");
  const [comments, setComments] = useState("");

  const activePolicy = settlementPolicies.find(p => p.name === settlementType);
  const calculationBasis = activePolicy?.calculationBasis ?? "year";
  const countPresentDay = activePolicy?.countPresentDay ?? false;

  // Accordion states
  const [showSalaryInfo, setShowSalaryInfo] = useState(true);
  const [showEarnLeaveInfo, setShowEarnLeaveInfo] = useState(true);
  const [showServiceBenefitInfo, setShowServiceBenefitInfo] = useState(true);
  const [showCompensationInfo, setShowCompensationInfo] = useState(true);
  const [showDeductionInfo, setShowDeductionInfo] = useState(true);

  // Dynamic rows
  const [compensations, setCompensations] = useState<DynamicRow[]>([{ for: "", amount: "" }]);
  const [deductions, setDeductions] = useState<DynamicRow[]>([{ for: "", amount: "" }]);

  // Salary table
  const [salaryFromDate, setSalaryFromDate] = useState("");
  const [salaryToDate, setSalaryToDate] = useState("");

  // Employee info (demo - would be fetched by ID)
  const [currentEmployee, setCurrentEmployee] = useState<any>(MOCK_EMPLOYEES["2023043910"]);
  const emp = currentEmployee;

  const [calculated, setCalculated] = useState(false);

  const loadDemoData = (id: string) => {
    setMode("With Salary");
    setEmployeeId(id);
    
    // Find matching employee profile, default to 2023043910 if not found
    const targetEmp = MOCK_EMPLOYEES[id] || MOCK_EMPLOYEES["2023043910"];
    setCurrentEmployee(targetEmp);
    setEmpLoaded(true);

    const mappedSettleType = id === "2015051511" ? "Termination by Employer" : 
                            id === "2018091204" ? "Retirement" : 
                            id === "2024021811" ? "Death" : 
                            id === "2025090122" ? "Dismissal" : 
                            "Resignation";
    setSettlementType(mappedSettleType);
    setSettlementDate(targetEmp.settlementDate);
    setResignApplyDate(targetEmp.resignApplyDate);
    setResignDate(targetEmp.resignDate);
    setLastWorkingDate(targetEmp.lastWorkingDate);
    setDeductionType("no");
    setNoticePeriod("30");
    setNoticeShortage(targetEmp.dayShortage.split(" ")[0]);
    setWorkingDays(targetEmp.workingDays);
    setPresent(targetEmp.present);
    setLeave(targetEmp.leave);
    setHoliday(targetEmp.holiday);
    setAbsentDays(targetEmp.absentDays);
    setAbsentDeduction(targetEmp.absentDeduction);
    setPfDeduction(targetEmp.pfDeduction);
    setTaxDeduction(targetEmp.taxDeduction);
    setAdvanceDeduction(targetEmp.advanceDeduction);
    setLoanDeduction(targetEmp.loanDeduction);
    setLunchDeduction(targetEmp.lunchDeduction);
    setOthersDeduction(targetEmp.othersDeduction);
    setRevStamp(targetEmp.revStamp);
    setPaySalary(targetEmp.paySalary);
    setWagelyAdvance("0.00");
    setOtRate(targetEmp.otRate);
    setOtPayment(targetEmp.otPayment);
    setOtHour(targetEmp.otHour);
    setBehaviourAllowance(targetEmp.behaviourAllowance);
    setHolidayAllowance("0.00");
    setGeneralAllowance(targetEmp.generalAllowance);
    setConveyanceAllowance(targetEmp.conveyanceAllowance);
    setIncentiveAllowance(targetEmp.incentiveAllowance);
    setOtherAllowance(targetEmp.otherAllowance);
    setArrear("0.00");
    setAttendanceBonus(targetEmp.attendanceBonus);
    
    const basic = Number(targetEmp.basicSalary);
    const allowances = Number(targetEmp.behaviourAllowance) + Number(targetEmp.generalAllowance) + Number(targetEmp.conveyanceAllowance) + Number(targetEmp.incentiveAllowance) + Number(targetEmp.otherAllowance) + Number(targetEmp.attendanceBonus);
    const netSalaryVal = Number(targetEmp.paySalary) + allowances;
    setNetSalary(netSalaryVal.toFixed(2));
    
    setTiffinNightBill(targetEmp.tiffinNightBill);
    setElFrom(targetEmp.elFrom);
    setElTo(targetEmp.elTo);
    setElBalanceDays(targetEmp.elBalanceDays);
    
    const elPay = Number(targetEmp.elBalanceDays) * (basic / 30);
    setElPayment(elPay.toFixed(2));
    
    setClBalanceDays(targetEmp.clBalanceDays);
    const clPay = Number(targetEmp.clBalanceDays) * (basic / 30);
    setClPayment(clPay.toFixed(2));
    
    setServiceBenefitYear(targetEmp.serviceBenefitYear);
    setServiceBenefitMonth(targetEmp.serviceBenefitMonth);
    setServiceBenefitDay(targetEmp.serviceBenefitDay);
    const _sbY = Number(targetEmp.serviceBenefitYear);
    const _sbM = Number(targetEmp.serviceBenefitMonth);
    const _sbD = Number(targetEmp.serviceBenefitDay);
    const _sbDailyRate = basic / 30;
    const loadPolicy = settlementPolicies.find(p => p.name === mappedSettleType);
    const _sbCompDays = getCompDaysFromTiers(
      loadPolicy?.compensationTiers ?? [],
      _sbY, _sbM, _sbD,
      loadPolicy?.calculationBasis ?? "year"
    );
    setPayableDaysPerYear(_sbCompDays.toString());
    let sbPay = 0;
    if (_sbCompDays > 0) {
      if ((loadPolicy?.calculationBasis ?? "year") === "year") {
        sbPay = _sbY * _sbCompDays * _sbDailyRate;
      } else {
        const totalDays = (_sbY * 365) + (_sbM * 30) + _sbD;
        sbPay = (totalDays / 365) * _sbCompDays * _sbDailyRate;
      }
    }
    setServiceBenefitTotal(sbPay.toFixed(2));
    
    setPfAmount(targetEmp.pfAmount);
    setCpfAmount(targetEmp.cpfAmount);
    
    const pfAmtVal = Number(targetEmp.pfAmount);
    const cpfAmtVal = Number(targetEmp.cpfAmount);
    
    // Sum of compensations
    const compensationSum = elPay + sbPay + pfAmtVal + cpfAmtVal;
    
    // Sum of earnings
    const earningsSum = netSalaryVal + Number(targetEmp.tiffinNightBill) + compensationSum;
    
    // Sum of deductions
    const deductionsSum = Number(targetEmp.absentDeduction) + Number(targetEmp.pfDeduction) + Number(targetEmp.taxDeduction) + Number(targetEmp.advanceDeduction) + Number(targetEmp.loanDeduction) + Number(targetEmp.lunchDeduction) + Number(targetEmp.othersDeduction) + Number(targetEmp.revStamp);
    
    const calculatedGrandTotal = earningsSum - deductionsSum;
    
    setGrandTotal(calculatedGrandTotal.toFixed(2));
    setCompensationAmt("0.00");
    setCompensationRemarks("");
    setNetPayment(calculatedGrandTotal.toFixed(2));
    setComments("Verified by HR. Cleared all assets.");
    
    setCompensations([
      { for: "Special Performance Bonus", amount: "0.00" },
      { for: "", amount: "" }
    ]);
    setDeductions([
      { for: "Lost ID Card Penalty", amount: "0.00" },
      { for: "", amount: "" }
    ]);
    setCalculated(true);
  };

  const handleLoadEmployee = () => {
    if (!employeeId.trim()) {
      toast.error("Please enter Employee ID");
      return;
    }
    loadDemoData(employeeId);
    toast.success("Employee loaded with demo data successfully.");
  };

  const handleEdit = (row: SettlementRecord) => {
    loadDemoData(row.empId);
    setView("create");
  };

  const handleCalculate = () => {
    if (!empLoaded) {
      toast.error("Please load an employee first.");
      return;
    }
    if (!settlementType) {
      toast.error("Please select Settlement Type.");
      return;
    }
    
    // Find selected policy
    const policy = settlementPolicies.find(p => p.name === settlementType);
    if (!policy) {
      toast.error("Invalid settlement type policy.");
      return;
    }

    const basicSalary = Number(emp.basicSalary) || 0;
    const dailyRate = basicSalary / 30;

    // Notice calculation
    let calculatedNoticePeriod = "0";
    let calculatedNoticeShortage = "0";
    let noticeDeductionAmt = 0;
    let noticePayAmt = 0;

    if (policy.noticeDeductedFromEmployee) {
      calculatedNoticePeriod = policy.noticePeriodDays.toString();
      if (resignApplyDate && lastWorkingDate) {
        const apply = new Date(resignApplyDate);
        const working = new Date(lastWorkingDate);
        const diffTime = working.getTime() - apply.getTime();
        const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        const shortage = Math.max(0, policy.noticePeriodDays - diffDays);
        calculatedNoticeShortage = shortage.toString();
        noticeDeductionAmt = shortage * dailyRate;
      } else {
        calculatedNoticeShortage = noticeShortage || "0";
        noticeDeductionAmt = Number(calculatedNoticeShortage) * dailyRate;
      }
      setNoticePeriod(calculatedNoticePeriod);
      setNoticeShortage(calculatedNoticeShortage);
    } else {
      setNoticePeriod("0");
      setNoticeShortage("0");
    }

    if (policy.noticePaidByEmployer) {
      calculatedNoticePeriod = policy.noticePeriodDays.toString();
      noticePayAmt = policy.noticePeriodDays * dailyRate;
      setNoticePeriod(calculatedNoticePeriod);
    }

    // Dynamic Compensations array
    let updatedCompensations = [...compensations.filter(c => c.for && !c.for.toLowerCase().includes("notice"))];
    if (noticePayAmt > 0) {
      updatedCompensations = updatedCompensations.filter(c => c.for !== "");
      updatedCompensations.push({ for: "Notice Pay (In Lieu)", amount: noticePayAmt.toFixed(2) });
      updatedCompensations.push({ for: "", amount: "" });
    }
    setCompensations(updatedCompensations);

    // Dynamic Deductions array
    let updatedDeductions = [...deductions.filter(d => d.for && !d.for.toLowerCase().includes("notice"))];
    if (noticeDeductionAmt > 0) {
      updatedDeductions = updatedDeductions.filter(d => d.for !== "");
      updatedDeductions.push({ for: "Notice Period Shortage", amount: noticeDeductionAmt.toFixed(2) });
      updatedDeductions.push({ for: "", amount: "" });
    }
    setDeductions(updatedDeductions);

    // Service Benefit / Compensation — exact tiered Y/M/D business rules:
    // SL1: Y=2, M=11, 30≤D≤31  → 7
    // SL2: Y=3, 0≤M<11          → 7
    // SL3: Y=3, M=11, 0≤D<30   → 7
    // SL4: Y=3, M=11, 30≤D≤31  → 15
    // SL5: 4≤Y<9               → 15  (any M, any D)
    // SL5b:Y=9, 0≤M<11         → 15
    // SL6: Y=9, M=11, 0≤D<30   → 15
    // SL7: Y=9, M=11, 30≤D≤31  → 30
    // SL8: Y≥10                → 30
    let finalServiceBenefitTotal = 0;
    let compDays = 0;
    
    if (showServiceBenefitInfo && policy.isCompensationApplicable) {
      let sbY = Number(serviceBenefitYear) || 0;
      let sbM = Number(serviceBenefitMonth) || 0;
      let sbD = Number(serviceBenefitDay) || 0;

      // Adjust tenure for present day if option is enabled
      if (countPresentDay) {
        sbD += 1;
        if (sbD >= 30) {
          sbD -= 30;
          sbM += 1;
          if (sbM >= 12) {
            sbM -= 12;
            sbY += 1;
          }
        }
      }

      const totalMonths = sbY * 12 + sbM;
      
      if (totalMonths >= policy.minServiceMonthsForCompensation) {
        compDays = getCompDaysFromTiers(
          policy?.compensationTiers ?? [],
          sbY, sbM, sbD,
          calculationBasis
        );
        if (compDays > 0) {
          if (calculationBasis === "year") {
            finalServiceBenefitTotal = sbY * compDays * dailyRate;
          } else {
            // Day basis calculation: (totalDays / 365) * compDays * dailyRate
            const totalDays = (sbY * 365) + (sbM * 30) + sbD;
            finalServiceBenefitTotal = (totalDays / 365) * compDays * dailyRate;
          }
        }
        setPayableDaysPerYear(compDays.toString());
        setServiceBenefitTotal(finalServiceBenefitTotal.toFixed(2));
      } else {
        setPayableDaysPerYear("0");
        setServiceBenefitTotal("0.00");
      }
    } else {
      setPayableDaysPerYear("0");
      setServiceBenefitTotal("0.00");
    }

    // Earned Leave dynamic encashment
    let finalElPayment = 0;
    if (showEarnLeaveInfo && policy.earnedLeaveEncashable) {
      finalElPayment = (Number(elBalanceDays) || 0) * dailyRate;
      setElPayment(finalElPayment.toFixed(2));
    } else {
      setElPayment("0.00");
    }

    // PF Amount dynamic logic
    let finalPfAmount = Number(emp.pfAmount) || 0;
    let finalCpfAmount = Number(emp.cpfAmount) || 0;
    if (!policy.isProvidentFundPayable) {
      finalPfAmount = 0;
      finalCpfAmount = 0;
    }
    setPfAmount(finalPfAmount.toFixed(2));
    setCpfAmount(finalCpfAmount.toFixed(2));

    // Calculate Grand Total (Earnings - Deductions)
    const basicPay = showSalaryInfo ? (Number(paySalary) || 0) : 0;
    const allowances = showSalaryInfo ? (Number(behaviourAllowance) + Number(holidayAllowance) + Number(generalAllowance) + Number(conveyanceAllowance) + Number(incentiveAllowance) + Number(otherAllowance) + Number(arrear) + Number(attendanceBonus)) : 0;
    const activeNetSalary = basicPay + allowances;
    setNetSalary(activeNetSalary.toFixed(2));

    const extraCompensations = showCompensationInfo ? updatedCompensations.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) : 0;
    const earningsSum = activeNetSalary + Number(tiffinNightBill) + finalElPayment + (showEarnLeaveInfo ? (Number(clPayment) || 0) : 0) + finalServiceBenefitTotal + finalPfAmount + finalCpfAmount + extraCompensations;

    const activeDeductionsSum = showSalaryInfo ? (Number(absentDeduction) + Number(pfDeduction) + Number(taxDeduction) + Number(advanceDeduction) + Number(loanDeduction) + Number(lunchDeduction) + Number(othersDeduction) + Number(revStamp)) : 0;
    const extraDeductions = showDeductionInfo ? updatedDeductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) : 0;
    const deductionsSum = activeDeductionsSum + extraDeductions;

    const calculatedGrandTotal = earningsSum - deductionsSum;
    setGrandTotal(calculatedGrandTotal.toFixed(2));
    setNetPayment(calculatedGrandTotal.toFixed(2));
    setCalculated(true);
    toast.success("Calculation complete for " + settlementType + ".");
  };

  const handleSubmit = () => {
    if (!calculated) {
      toast.error("Please run Calculation before submitting.");
      return;
    }
    toast.success("Final Settlement submitted for approval.");
    setView("list");
  };

  useEffect(() => {
    if (calculated) {
      handleCalculate();
    }
  }, [showSalaryInfo, showEarnLeaveInfo, showServiceBenefitInfo, showCompensationInfo, showDeductionInfo, settlementType, calculationBasis, countPresentDay]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />

        <div className="p-4 md:p-5 space-y-4 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span>Benefits</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Final Settlement</span>
          </div>

          {/* Page Header */}
          <div className="bg-card border border-border/60 rounded-lg p-4 shadow-sm flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <div className="p-1.5 bg-primary/10 rounded border border-primary/20 text-primary">
                <FileText className="size-4" />
              </div>
              Final Settlement
            </h1>
            <div className="flex items-center gap-2">
              {view === "create" ? (
                <button
                  onClick={() => {
                    setView("list");
                    setEmpLoaded(false);
                    setEmployeeId("");
                    setCalculated(false);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors"
                >
                  <X className="size-3.5" /> Back to List
                </button>
              ) : (
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus className="size-3.5" /> New Settlement
                </button>
              )}
            </div>
          </div>

          {/* ─── LIST VIEW ─────────────────────────────────────────────────── */}
          {view === "list" && (
            <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 border-b border-border/60 bg-muted/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Settlement Records</span>
                <span className="text-[11px] text-muted-foreground">{records.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20">
                      {[
                        "",
                        "Emp ID",
                        "Name",
                        "Department",
                        "Designation",
                        "Join Date",
                        "Resign Date",
                        "Settle Date",
                        "Settle Type",
                        "Settle Amt",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap ${h === "Settle Amt" ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border/40 hover:bg-muted/20 transition-colors group"
                      >
                        <td className="px-3 py-2.5 w-16">
                          <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => {
                                loadDemoData(row.empId);
                                setView("detail");
                              }}
                              className="text-muted-foreground hover:text-emerald-500 transition-colors"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleEdit(row)}
                              className="text-muted-foreground hover:text-blue-500 transition-colors"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              onClick={() => toast.error("Delete confirmation needed.")}
                              className="text-muted-foreground hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-foreground">{row.empId}</td>
                        <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.department}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.designation}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.joinDate}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.resignDate}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {row.settleDate || "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            row.settleType.toLowerCase().includes("resign")
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/25"
                              : row.settleType.toLowerCase().includes("terminat")
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/25"
                              : row.settleType.toLowerCase().includes("dismiss")
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/25"
                              : row.settleType.toLowerCase().includes("retire")
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                              : "bg-purple-500/10 text-purple-600 border-purple-500/25"
                          }`}>
                            {row.settleType}
                          </span>
                        </td>
                        <td
                          className={`px-3 py-2.5 text-right font-mono font-semibold ${row.settleAmt < 0 ? "text-rose-500" : "text-emerald-600"}`}
                        >
                          {row.settleAmt.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── CREATE FORM ────────────────────────────────────────────────── */}
          {view === "create" && (
            <div className="bg-card border border-border/60 shadow-sm rounded flex flex-col relative min-h-[calc(100vh-140px)] w-full overflow-hidden">
              <div className="p-6 flex-1 space-y-4">
                {/* ── Configuration & Records ── */}
                <div className="rounded-xl border border-primary/20 overflow-hidden bg-card mb-5 shadow-sm">
                  <div className="flex items-center gap-2.5 px-5 py-3.5 bg-primary/5 border-b border-primary/10">
                    <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary/80">Configuration &amp; Records</span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                          Employee ID <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-1.5">
                          <Input
                            value={employeeId}
                            onChange={(e: any) => setEmployeeId(e.target.value)}
                            placeholder="e.g. 2023043910"
                            className="font-bold border-blue-500/30 focus:border-blue-500 focus:ring-blue-500/20 flex-1"
                          />
                          <button
                            type="button"
                            onClick={handleLoadEmployee}
                            className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold tracking-wider transition-colors shadow-sm cursor-pointer shrink-0"
                          >
                            Load
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Settlement Type <span className="text-rose-500">*</span>
                        </label>
                        <Select
                          value={settlementType}
                          onChange={(e: any) => setSettlementType(e.target.value)}
                        >
                          <option value="">Select Type</option>
                          {settlementPolicies.map((t) => (
                            <option key={t.id} value={t.name}>
                              {t.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Apply Date <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={resignApplyDate}
                          onChange={(e: any) => setResignApplyDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Action Date <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={settlementDate}
                          onChange={(e: any) => setSettlementDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Payment Type <span className="text-rose-500">*</span>
                        </label>
                        <Select>
                          <option>Bank</option>
                          <option>Cash</option>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer h-[15px] select-none">
                          <input type="checkbox" className="accent-primary size-3 rounded border-border" defaultChecked />
                          Notice Deduction
                        </label>
                        <Select>
                          <option>30</option>
                          <option>60</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Employee Information ── */}
                <div className="border border-border/60 rounded-xl p-5 mb-6 bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 mb-5 text-[11px] font-bold text-[#84cc16]">
                    <span className="uppercase tracking-wider border-b-2 border-[#84cc16]/30 pb-0.5">
                      Employee Information
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6 items-start pt-1">
                    {/* Employee Photo */}
                    <div className="flex flex-col items-center gap-2.5 shrink-0 w-full md:w-32 bg-muted/10 p-3 rounded-xl border border-border/30 shadow-inner">
                      <div className="w-[105px] h-[130px] rounded-lg border border-border/80 bg-white p-1 shadow-sm overflow-hidden flex items-center justify-center">
                        {empLoaded && emp.photo ? (
                          <img 
                            src={emp.photo} 
                            alt={emp.name} 
                            className="size-full object-cover object-top rounded-md transition-all duration-300 hover:scale-105" 
                          />
                        ) : (
                          <div className="size-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-300 rounded-md">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center px-1">No Photo</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-muted border border-border/40 px-2 py-0.5 rounded shadow-sm">
                        {empLoaded ? employeeId : "ID — — —"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0.5 flex-1 w-full">
                      <div className="space-y-1.5 border-r border-border/30 pr-6">
                        <InfoRow
                          label="Company"
                          value={empLoaded ? emp.company : ""}
                        />
                        <InfoRow label="Emp Name" value={empLoaded ? emp.name : ""} />
                        <InfoRow label="Designation" value={empLoaded ? emp.designation : ""} />
                        <InfoRow label="Department" value={empLoaded ? emp.department : ""} />
                        <InfoRow
                          label="Section"
                          value={empLoaded ? emp.section : ""}
                        />
                        <InfoRow label="Unit" value={empLoaded ? emp.unit : ""} />
                        <InfoRow label="Joining Date" value={empLoaded ? emp.joiningDate : ""} />
                        <InfoRow label="Employee Type" value={empLoaded ? emp.employeeType : ""} />
                        <InfoRow label="Bank Account" value={empLoaded ? emp.bankAccount : ""} />
                      </div>
                      <div className="space-y-1.5 pl-6">
                        <InfoRow label="Basic Salary" value={empLoaded ? emp.basicSalary : ""} />
                        <InfoRow label="House Rent" value={empLoaded ? emp.houseRent : ""} />
                        <InfoRow label="Medical" value={empLoaded ? emp.medical : ""} />
                        <InfoRow label="Transport Allowance" value={empLoaded ? emp.transport : ""} />
                        <InfoRow label="Food Allowance" value={empLoaded ? emp.food : ""} />
                        <div className="pt-2 mt-2 border-t border-border/50">
                          <InfoRow label="Gross Salary" value={empLoaded ? emp.grossSalary : ""} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Sections ── */}

                {/* Salary Info */}
                <div className="border border-border/60 rounded-xl p-5 mb-5 bg-card shadow-sm transition-all duration-300">
                  <div 
                    className={`flex items-center justify-between cursor-pointer select-none ${showSalaryInfo ? "mb-4" : "mb-0"}`}
                    onClick={() => setShowSalaryInfo(!showSalaryInfo)}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={showSalaryInfo} 
                        onChange={(e) => {
                          e.stopPropagation();
                          setShowSalaryInfo(e.target.checked);
                        }} 
                        className="accent-blue-600 size-3.5 rounded border-border cursor-pointer transition-all" 
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">Salary Information</h3>
                    </div>
                    {showSalaryInfo ? <ChevronDown className="size-4 text-blue-600" /> : <ChevronRight className="size-4 text-blue-600" />}
                  </div>

                  {showSalaryInfo && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-end gap-4 mb-5 p-4 bg-muted/20 border border-border/40 rounded-lg">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                            From Date <span className="text-rose-500">*</span>
                          </label>
                          <Input
                            type="date"
                            value={salaryFromDate}
                            onChange={(e: any) => setSalaryFromDate(e.target.value)}
                            className="w-36 font-semibold text-xs border-border/60 bg-background focus:border-blue-500 focus:ring-blue-500/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                            To Date <span className="text-rose-500">*</span>
                          </label>
                          <Input
                            type="date"
                            value={salaryToDate}
                            onChange={(e: any) => setSalaryToDate(e.target.value)}
                            className="w-36 font-semibold text-xs border-border/60 bg-background focus:border-blue-500 focus:ring-blue-500/20"
                          />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase transition-all tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer">
                          <RefreshCw className="size-3.5" />
                          Generate Salary
                        </button>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-border/80 shadow-inner bg-card">
                        <table className="w-full text-[10px] text-center whitespace-nowrap">
                          <thead className="bg-muted/30 border-b border-border/70 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider">
                            <tr>
                              <th className="p-2.5 font-semibold border-r border-border/50">#</th>
                              <th className="p-2.5 font-semibold border-r border-border/50 text-left">Emp Id</th>
                              <th className="p-2.5 font-semibold border-r border-border/50 text-left">Name</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Month</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Year</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">W/D</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Present</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Holiday</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Leave</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Absent</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">OT</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">OT Amt</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Pay Basic</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">House Rent</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Medical</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Transport</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Food</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Adv Amount</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Abs Amount</th>
                              <th className="p-2.5 font-semibold border-r border-border/50">Tax Amount</th>
                              <th className="p-2.5 font-semibold">Total Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {empLoaded ? (
                              <tr className="border-b border-border/30 hover:bg-muted/15 transition-colors">
                                <td className="p-2.5 border-r border-border/50 font-medium text-muted-foreground">1</td>
                                <td className="p-2.5 border-r border-border/50 text-left font-mono font-semibold">{employeeId}</td>
                                <td className="p-2.5 border-r border-border/50 text-left font-semibold text-foreground">{emp.name}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono">06</td>
                                <td className="p-2.5 border-r border-border/50 font-mono">2026</td>
                                <td className="p-2.5 border-r border-border/50 font-mono">{workingDays}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono">{present}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono">{holiday}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono">{leave}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono">{absentDays}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono">{otHour}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right">৳{Number(otPayment).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right">৳{Number(emp.basicSalary).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right">৳{Number(emp.houseRent).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right">৳{Number(emp.medical).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right">৳{Number(emp.transport).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right">৳{Number(emp.food).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right text-rose-500">৳{Number(advanceDeduction).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right text-rose-500">৳{Number(absentDeduction).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 border-r border-border/50 font-mono text-right text-rose-500">৳{Number(taxDeduction).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                <td className="p-2.5 font-semibold text-right">
                                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20 shadow-sm">
                                    ৳{Number(netSalary).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                  </span>
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan={21} className="p-5 text-center text-muted-foreground italic bg-muted/5">
                                  No salary data generated. Enter employee ID and dates to generate.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Compensation Info */}
                <div className="border border-border/60 rounded-xl p-5 mb-5 bg-card shadow-sm transition-all duration-300">
                  <div 
                    className={`flex items-center justify-between cursor-pointer select-none ${showCompensationInfo ? "mb-4" : "mb-0"}`}
                    onClick={() => setShowCompensationInfo(!showCompensationInfo)}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={showCompensationInfo} 
                        onChange={(e) => {
                          e.stopPropagation();
                          setShowCompensationInfo(e.target.checked);
                        }} 
                        className="accent-lime-600 size-3.5 rounded border-border cursor-pointer transition-all" 
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-lime-600">Compensation Additions</h3>
                    </div>
                    {showCompensationInfo ? <ChevronDown className="size-4 text-lime-600" /> : <ChevronRight className="size-4 text-lime-600" />}
                  </div>

                  {showCompensationInfo && (
                    <div className="overflow-hidden rounded-lg border border-border/80 shadow-sm bg-card animate-fadeIn">
                      <table className="w-full text-[11px]">
                        <thead className="bg-lime-500/5 border-b border-border/70 text-lime-600 font-semibold text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="p-2.5 font-semibold border-r border-border/50 w-12 text-center">#</th>
                            <th className="p-2.5 font-semibold border-r border-border/50 text-left">Compensation For</th>
                            <th className="p-2.5 font-semibold border-r border-border/50 text-right w-44">Amount (৳)</th>
                            <th className="p-2.5 font-semibold w-12 text-center text-muted-foreground/50">
                              <Plus className="size-3.5 mx-auto" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {compensations.map((row, i) => (
                            <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors">
                              <td className="p-2.5 border-r border-border/50 text-center text-muted-foreground font-medium">{i + 1}</td>
                              <td className="p-0 border-r border-border/50">
                                <Input
                                  value={row.for}
                                  onChange={(e: any) =>
                                    setCompensations((p) =>
                                      p.map((r, idx) =>
                                        idx === i ? { ...r, for: e.target.value } : r,
                                      ),
                                    )
                                  }
                                  placeholder="e.g. Special Performance Bonus"
                                  className="border-0 shadow-none h-9 text-[11px] rounded-none focus-visible:ring-0 bg-transparent"
                                />
                              </td>
                              <td className="p-0 border-r border-border/50">
                                <Input
                                  value={row.amount}
                                  onChange={(e: any) =>
                                    setCompensations((p) =>
                                      p.map((r, idx) =>
                                        idx === i ? { ...r, amount: e.target.value } : r,
                                      ),
                                    )
                                  }
                                  placeholder="0.00"
                                  type="number"
                                  className="border-0 shadow-none h-9 text-[11px] text-right font-mono font-semibold rounded-none focus-visible:ring-0 bg-transparent"
                                />
                              </td>
                              <td className="p-1 text-center">
                                {i === compensations.length - 1 ? (
                                  <button
                                    onClick={() =>
                                      setCompensations((p) => [...p, { for: "", amount: "" }])
                                    }
                                    className="p-1 rounded text-lime-600 border border-lime-500/20 hover:bg-lime-500/10 transition-all mx-auto block cursor-pointer"
                                  >
                                    <Plus className="size-3" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setCompensations((p) => p.filter((_, idx) => idx !== i))
                                    }
                                    className="p-1 rounded text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 transition-all mx-auto block cursor-pointer"
                                  >
                                    <Trash2 className="size-3" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Earn Leave Info */}
                <div className="border border-border/60 rounded-xl p-5 mb-5 bg-card shadow-sm transition-all duration-300">
                  <div 
                    className={`flex items-center justify-between cursor-pointer select-none ${showEarnLeaveInfo ? "mb-4" : "mb-0"}`}
                    onClick={() => setShowEarnLeaveInfo(!showEarnLeaveInfo)}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={showEarnLeaveInfo} 
                        onChange={(e) => {
                          e.stopPropagation();
                          setShowEarnLeaveInfo(e.target.checked);
                        }} 
                        className="accent-blue-600 size-3.5 rounded border-border cursor-pointer transition-all" 
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">Earn Leave (EL) Encashment</h3>
                    </div>
                    {showEarnLeaveInfo ? <ChevronDown className="size-4 text-blue-600" /> : <ChevronRight className="size-4 text-blue-600" />}
                  </div>

                  {showEarnLeaveInfo && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-end gap-4 mb-5 p-4 bg-muted/20 border border-border/40 rounded-lg">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">EL Year Range</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted-foreground font-medium">From</span>
                              <Select className="w-20 font-bold border-border/50 bg-background text-[11px]" value={elFrom} onChange={(e: any) => setElFrom(e.target.value)}>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                              </Select>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted-foreground font-medium">To</span>
                              <Select className="w-20 font-bold border-border/50 bg-background text-[11px]" value={elTo} onChange={(e: any) => setElTo(e.target.value)}>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase transition-all tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer">
                          <RefreshCw className="size-3.5" />
                          Generate EL
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center justify-between p-3.5 rounded-lg bg-blue-500/5 border border-blue-500/10 shadow-sm">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Annual Leave Days</span>
                            <p className="text-[10.5px] text-muted-foreground font-medium">Remaining balance eligible for encashment</p>
                          </div>
                          <span className="text-sm font-extrabold text-foreground font-mono bg-background border border-border/50 px-3 py-1 rounded shadow-sm">
                            {empLoaded ? elBalanceDays : "0.00"} Days
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 shadow-sm">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Encashment Pay Amount</span>
                            <p className="text-[10.5px] text-muted-foreground font-medium">Calculated rate: basic salary daily rate</p>
                          </div>
                          <span className="text-sm font-extrabold text-emerald-600 font-mono bg-background border border-emerald-500/20 px-3 py-1 rounded shadow-sm">
                            ৳{empLoaded ? Number(elPayment).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Benefit Info */}
                <div className="border border-border/60 rounded-xl p-5 mb-5 bg-card shadow-sm transition-all duration-300">
                  <div 
                    className={`flex items-center justify-between cursor-pointer select-none ${showServiceBenefitInfo ? "mb-4" : "mb-0"}`}
                    onClick={() => setShowServiceBenefitInfo(!showServiceBenefitInfo)}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={showServiceBenefitInfo} 
                        onChange={(e) => {
                          e.stopPropagation();
                          setShowServiceBenefitInfo(e.target.checked);
                        }} 
                        className="accent-blue-600 size-3.5 rounded border-border cursor-pointer transition-all" 
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">Service Benefit / Compensation</h3>
                    </div>
                    {showServiceBenefitInfo ? <ChevronDown className="size-4 text-blue-600" /> : <ChevronRight className="size-4 text-blue-600" />}
                  </div>

                  {showServiceBenefitInfo && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-end justify-between gap-4 mb-5 p-4 bg-muted/20 border border-border/40 rounded-lg">
                        <div className="flex flex-wrap items-end gap-5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Calculated Service Tenure</span>
                            <div className="inline-flex items-center px-3 py-1 bg-blue-500/10 text-blue-600 rounded text-xs font-bold border border-blue-500/20 shadow-sm h-8">
                              {empLoaded && emp.tenure ? emp.tenure : "—"}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Calculation Basis</span>
                            <div className="inline-flex items-center px-3 py-1 bg-muted border border-border/60 text-muted-foreground rounded text-[11px] font-semibold h-8 capitalize">
                              {calculationBasis} Basis
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Count Present Day</span>
                            <div className="inline-flex items-center px-3 py-1 bg-muted border border-border/60 text-muted-foreground rounded text-[11px] font-semibold h-8">
                              {countPresentDay ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={handleCalculate}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase transition-all tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer h-8"
                        >
                          <RefreshCw className="size-3.5" />
                          Generate Benefit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center justify-between p-3.5 rounded-lg bg-blue-500/5 border border-blue-500/10 shadow-sm">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                              {calculationBasis === "year" ? "Calculated Service Period" : "Calculated Service Days"}
                            </span>
                            <p className="text-[10.5px] text-muted-foreground font-medium">
                              {calculationBasis === "year" ? "Completed service benefit tenure" : "Completed service benefit days"}
                            </p>
                          </div>
                          <span className="text-sm font-extrabold text-foreground font-mono bg-background border border-border/50 px-3 py-1 rounded shadow-sm">
                            {empLoaded ? (
                              calculationBasis === "year"
                                ? `${serviceBenefitYear}Y ${serviceBenefitMonth}M ${serviceBenefitDay}D`
                                : `${(Number(serviceBenefitYear) * 365 + Number(serviceBenefitMonth) * 30 + Number(serviceBenefitDay) + (countPresentDay ? 1 : 0))} Days`
                            ) : "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 shadow-sm">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Benefit Pay Amount</span>
                            <p className="text-[10.5px] text-muted-foreground font-medium">
                              {calculationBasis === "year" 
                                ? "Formula: completed years × days/year × daily rate" 
                                : "Formula: total days / 365 × days/year × daily rate"}
                            </p>
                          </div>
                          <span className="text-sm font-extrabold text-emerald-600 font-mono bg-background border border-emerald-500/20 px-3 py-1 rounded shadow-sm">
                            ৳{empLoaded ? Number(serviceBenefitTotal).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Deduction Info */}
                <div className="border border-border/60 rounded-xl p-5 mb-6 bg-card shadow-sm transition-all duration-300">
                  <div 
                    className={`flex items-center justify-between cursor-pointer select-none ${showDeductionInfo ? "mb-4" : "mb-0"}`}
                    onClick={() => setShowDeductionInfo(!showDeductionInfo)}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={showDeductionInfo} 
                        onChange={(e) => {
                          e.stopPropagation();
                          setShowDeductionInfo(e.target.checked);
                        }} 
                        className="accent-rose-600 size-3.5 rounded border-border cursor-pointer transition-all" 
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600">Deduction Items</h3>
                    </div>
                    {showDeductionInfo ? <ChevronDown className="size-4 text-rose-600" /> : <ChevronRight className="size-4 text-rose-600" />}
                  </div>

                  {showDeductionInfo && (
                    <div className="overflow-hidden rounded-lg border border-border/80 shadow-sm bg-card animate-fadeIn">
                      <table className="w-full text-[11px]">
                        <thead className="bg-rose-500/5 border-b border-border/70 text-rose-600 font-semibold text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="p-2.5 font-semibold border-r border-border/50 w-12 text-center">#</th>
                            <th className="p-2.5 font-semibold border-r border-border/50 text-left">Deduction For</th>
                            <th className="p-2.5 font-semibold border-r border-border/50 text-right w-44">Amount (৳)</th>
                            <th className="p-2.5 font-semibold w-12 text-center text-rose-600/50">
                              <Plus className="size-3.5 mx-auto" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {deductions.map((row, i) => (
                            <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors">
                              <td className="p-2.5 border-r border-border/50 text-center text-muted-foreground font-medium">{i + 1}</td>
                              <td className="p-0 border-r border-border/50">
                                <Input
                                  value={row.for}
                                  onChange={(e: any) =>
                                    setDeductions((p) =>
                                      p.map((r, idx) =>
                                        idx === i ? { ...r, for: e.target.value } : r,
                                      ),
                                    )
                                  }
                                  placeholder="e.g. Unadjusted Loan"
                                  className="border-0 shadow-none h-9 text-[11px] rounded-none focus-visible:ring-0 bg-transparent"
                                />
                              </td>
                              <td className="p-0 border-r border-border/50">
                                <Input
                                  value={row.amount}
                                  onChange={(e: any) =>
                                    setDeductions((p) =>
                                      p.map((r, idx) =>
                                        idx === i ? { ...r, amount: e.target.value } : r,
                                      ),
                                    )
                                  }
                                  placeholder="0.00"
                                  type="number"
                                  className="border-0 shadow-none h-9 text-[11px] text-right font-mono font-semibold rounded-none focus-visible:ring-0 bg-transparent"
                                />
                              </td>
                              <td className="p-1 text-center">
                                {i === deductions.length - 1 ? (
                                  <button
                                    onClick={() =>
                                      setDeductions((p) => [...p, { for: "", amount: "" }])
                                    }
                                    className="p-1 rounded text-rose-600 border border-rose-500/20 hover:bg-rose-500/10 transition-all mx-auto block cursor-pointer"
                                  >
                                    <Plus className="size-3" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setDeductions((p) => p.filter((_, idx) => idx !== i))
                                    }
                                    className="p-1 rounded text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 transition-all mx-auto block cursor-pointer"
                                  >
                                    <Trash2 className="size-3" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ── Summary & Actions ── */}
                <div className="flex justify-end mb-6">
                  <div className="w-full md:w-[45%] border border-border/50 rounded p-4 space-y-2.5 font-bold text-[11px] bg-card shadow-sm">
                    <div className="flex justify-between">
                      <span>Total Payable</span>
                      <span>: {empLoaded ? "109317.00" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Notice Pay-D Days</span>
                      <span>: {empLoaded ? "3000.00" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Advance</span>
                      <span>: {empLoaded ? "1000.00" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile Bill</span>
                      <span>: {empLoaded ? "500.00" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue Stamp</span>
                      <span>: {empLoaded ? "10.00" : ""}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-2.5 mt-2.5">
                      <span>Grand Total</span>
                      <span>: {empLoaded ? grandTotal : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NetPayable</span>
                      <span>: {empLoaded ? netPayment : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50/80 border-t border-border/50 p-4 rounded-b flex items-center justify-between">
                <button
                  onClick={handleCalculate}
                  className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-bold rounded transition-colors shadow-sm tracking-wide"
                >
                  CALCULATION
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-400 border border-gray-200 text-[11px] font-bold rounded cursor-not-allowed tracking-wide"
                  disabled
                >
                  SUBMIT
                </button>
              </div>
            </div>
          )}

          {/* ─── DETAIL / PRINT VIEW ────────────────────────────────────────── */}
          {view === "detail" && (
            <div className="bg-white text-black border border-border/60 rounded-lg shadow-sm p-8 max-w-5xl mx-auto w-full relative">
              <button
                onClick={() => window.print()}
                className="absolute top-4 right-4 p-2 bg-muted/20 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded transition-colors print:hidden"
              >
                <Printer className="size-4" />
              </button>

              {/* Header */}
              <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-gray-150 pb-6 mb-8 gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">{emp.company.replace(" (PSL-Operation)", "")}</h2>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">
                    Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205
                  </p>
                  <h3 className="text-base font-bold text-blue-600 mt-2.5 uppercase tracking-wider">Final Settlement Sheet</h3>
                </div>
                
                {/* ID-style employee portrait on details sheet */}
                <div className="shrink-0 border-2 border-gray-300 p-0.5 bg-white shadow-sm rounded overflow-hidden w-[80px] h-[100px]">
                  {emp.photo ? (
                    <img 
                      src={emp.photo} 
                      alt={emp.name} 
                      className="size-full object-cover object-top rounded-sm" 
                    />
                  ) : (
                    <div className="size-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-300 rounded-sm">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center">No Photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Info Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-8 text-[11px]">
                {/* Employee Info */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 border-b border-gray-300 pb-1">
                    Employee Info
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Employee ID</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{employeeId}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Employee Name</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.name}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Joining Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.joiningDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Designation</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.designation}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Department</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.department}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Line</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.line}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Grade</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.grade}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Gross Salary</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.grossSalary}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Basic Salary</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.basicSalary}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Tenure of work</span>
                      <span className="w-4">:</span>
                      <span className="flex-1 font-bold">{emp.tenure}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Day Shortage</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.dayShortage}</span>
                    </div>
                  </div>
                </div>

                {/* Settlement Info */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 border-b border-gray-300 pb-1">
                    Settlement Info
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Code</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">9348</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Settlement Type</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{settlementType}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Settlement Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{settlementDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Resign Apply Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{resignApplyDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Resign Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{resignDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Last Working Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{lastWorkingDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Notice Period</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{noticePeriod} Days</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Comments</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{comments}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Area Grid */}
              <div className="grid grid-cols-2 gap-x-12 items-start text-[10px]">
                {/* Left Column: Payment Info (Earnings + Deductions) */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 text-[11px]">Payment Info</h4>
                  <div className="border border-gray-300">
                    <div className="bg-gray-100 px-3 py-1.5 italic font-bold border-b border-gray-300">
                      Earning Sectors
                    </div>
                    <div className="px-3 py-2 space-y-2">
                      <div className="flex">
                        <span className="flex-1 text-gray-600">
                          Salary (Up to {lastWorkingDate})
                        </span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{paySalary}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Attendance Bonus</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{attendanceBonus}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">EID Bonus</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">0.00</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">
                          Earn Leave ({elBalanceDays} Days)
                        </span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{elPayment}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Over Time ({otHour} Hours)</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{otPayment}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Provident Fund (PF + CPF)</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">0.00</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Night & Tiffin Bill</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{tiffinNightBill}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Other Payment</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">0.00</span>
                      </div>
                    </div>
                    <div className="flex bg-gray-100 p-2 font-bold mt-1">
                      <span className="flex-1 text-right pr-4">Total Earning</span>
                      <span className="w-16">: Tk.</span>
                      <span className="w-20 text-right">
                        {(parseFloat(paySalary) || 0) +
                          (parseFloat(attendanceBonus) || 0) +
                          (parseFloat(elPayment) || 0) +
                          (parseFloat(otPayment) || 0) +
                          (parseFloat(tiffinNightBill) || 0)}
                      </span>
                    </div>

                    <div className="bg-gray-100 px-3 py-1.5 italic font-bold border-b border-t border-gray-300">
                      Deduction Sectors
                    </div>
                    <div className="px-3 py-2 space-y-2">
                      <div className="flex">
                        <span className="flex-1 text-gray-600">
                          Tenure of Notice ({noticeShortage} Days)
                        </span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">0.00</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Absent ({absentDays} Days)</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{absentDeduction}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Other Payment</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{othersDeduction}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Advance Payment</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{advanceDeduction}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Revenue Stamp</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{revStamp}</span>
                      </div>
                    </div>
                    <div className="flex bg-gray-100 p-2 font-bold mt-1">
                      <span className="flex-1 text-right pr-4">Total Deduction</span>
                      <span className="w-16">: Tk.</span>
                      <span className="w-20 text-right">
                        {(parseFloat(absentDeduction) || 0) +
                          (parseFloat(othersDeduction) || 0) +
                          (parseFloat(advanceDeduction) || 0) +
                          (parseFloat(revStamp) || 0)}
                      </span>
                    </div>

                    <div className="flex bg-[#f9cbbd] text-[#c0431b] p-3 font-bold mt-1 text-[11px]">
                      <span className="flex-1 text-right pr-4">Net Payable</span>
                      <span className="w-16">: Tk.</span>
                      <span className="w-20 text-right">{netPayment}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Other Details */}
                <div className="space-y-6 pt-6">
                  {/* Earn Leave */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">
                      Earn Leave Details
                    </h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr>
                          <th className="text-left pb-1 font-semibold text-gray-600">Type</th>
                          <th className="text-right pb-1 font-semibold text-gray-600">Days</th>
                          <th className="text-right pb-1 font-semibold text-gray-600">Rate</th>
                          <th className="text-right pb-1 font-semibold text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">EL Balance</td>
                          <td className="text-right pt-2">{elBalanceDays}</td>
                          <td className="text-right pt-2">
                            {(
                              (parseFloat(elPayment) || 0) / (parseFloat(elBalanceDays) || 1)
                            ).toFixed(2)}
                          </td>
                          <td className="text-right pt-2">{elPayment}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">
                      Total Tk. {elPayment}
                    </div>
                  </div>

                  {/* Service Benefit */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">
                      Service Benefit Details
                    </h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr>
                          <th className="text-left pb-1 font-semibold text-gray-600">
                            Service Period
                          </th>
                          <th className="text-right pb-1 font-semibold text-gray-600">
                            Payable Days Per Year(SB)
                          </th>
                          <th className="text-right pb-1 font-semibold text-gray-600">
                            Service Benefit (Total)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">
                            {calculationBasis === "year" 
                              ? `${serviceBenefitYear}Y ${serviceBenefitMonth}M ${serviceBenefitDay}D`
                              : `${(Number(serviceBenefitYear) * 365 + Number(serviceBenefitMonth) * 30 + Number(serviceBenefitDay) + (countPresentDay ? 1 : 0))} Days`
                            }
                          </td>
                          <td className="text-right pt-2">{payableDaysPerYear}</td>
                          <td className="text-right pt-2">{serviceBenefitTotal}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">
                      Total Tk. {serviceBenefitTotal}
                    </div>
                  </div>

                  {/* Compensation Details */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">
                      Compensation Details
                    </h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr>
                          <th className="text-left pb-1 font-semibold text-gray-600">
                            Compensation Remarks
                          </th>
                          <th className="text-right pb-1 font-semibold text-gray-600">
                            Compensation Amt
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">{compensationRemarks || "N/A"}</td>
                          <td className="text-right pt-2">{compensationAmt}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">
                      Total Tk. {compensationAmt}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
