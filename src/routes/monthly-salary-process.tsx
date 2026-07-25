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
  Info,
  Utensils,
  Car,
  Wallet,
  Percent,
  AlertTriangle,
  ArrowUpRight,
  Coins,
  Sliders,
  LayoutGrid,
  X,
  Star,
  Trash2,
  ChevronDown,
  ArrowUp,
  ArrowDown
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
// Target Roster Database matching the provided salary sheet data exactly
const ROSTER_EMPLOYEES = [
  {
    id: 1,
    type: "Regular",
    empId: "2024049326",
    name: "Hanif Uddin",
    joinDate: "01/06/2024",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "APPS Team", // Area
    designation: "Sr. Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 22,
    present: 20,
    absent: 0,
    leave: 2,
    holiday: 8,
    basic: 30000,
    hRent: 15000,
    med: 3000,
    conv: 2000,
    food: 0,
    gross: 50000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 48750,
    revStamp: 0,
    totalPay: 48750,
    bankPay: 36750,
    cashPay: 12000,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0271433"
  },
  {
    id: 2,
    type: "Regular",
    empId: "2026058726",
    name: "Parvej Mahmud",
    joinDate: "22/02/2026",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "APPS Team",
    designation: "Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 20,
    present: 18,
    absent: 0,
    leave: 2,
    holiday: 10,
    basic: 24000,
    hRent: 12000,
    med: 2400,
    conv: 1600,
    food: 0,
    gross: 40000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 38750,
    revStamp: 0,
    totalPay: 38750,
    bankPay: 30000,
    cashPay: 8750,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0756558"
  },
  {
    id: 3,
    type: "Regular",
    empId: "2026058686",
    name: "Md. Abdur Rahaman",
    joinDate: "15/02/2026",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "Business Innovation",
    designation: "Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 20,
    present: 19,
    absent: 0,
    leave: 1,
    holiday: 10,
    basic: 30000,
    hRent: 15000,
    med: 3000,
    conv: 2000,
    food: 0,
    gross: 50000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 48750,
    revStamp: 0,
    totalPay: 48750,
    bankPay: 40000,
    cashPay: 8750,
    bankName: "",
    accountNo: ""
  },
  {
    id: 4,
    type: "Regular",
    empId: "2023043910",
    name: "Tahmid Afsar",
    joinDate: "01/08/2023",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    designation: "Asst. Manager",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 22,
    present: 20,
    absent: 0,
    leave: 2,
    holiday: 8,
    basic: 31200,
    hRent: 15600,
    med: 3120,
    conv: 2080,
    food: 0,
    gross: 52000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 13961,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 36789,
    revStamp: 0,
    totalPay: 36789,
    bankPay: 31500,
    cashPay: 5289,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0256059"
  },
  {
    id: 5,
    type: "Regular",
    empId: "2025054609",
    name: "Md Mahir Shahriyar",
    joinDate: "15/03/2025",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    designation: "Jr. Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 22,
    present: 20,
    absent: 0,
    leave: 2,
    holiday: 8,
    basic: 19800,
    hRent: 9900,
    med: 1980,
    conv: 1320,
    food: 0,
    gross: 33000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 31750,
    revStamp: 0,
    totalPay: 31750,
    bankPay: 25000,
    cashPay: 6750,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "163.105.0055997"
  },
  {
    id: 6,
    type: "Regular",
    empId: "2024049166",
    name: "MD Maimoon Hossain Shomoy",
    joinDate: "18/05/2024",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Sr. Executive",
    grade: " ",
    unit: "PSL",
    line: " ",
    wd: 22,
    present: 18,
    absent: 0,
    leave: 4,
    holiday: 8,
    basic: 25800,
    hRent: 12900,
    med: 2580,
    conv: 1720,
    food: 0,
    gross: 43000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 41750,
    revStamp: 0,
    totalPay: 41750,
    bankPay: 31500,
    cashPay: 10250,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0271342"
  },
  {
    id: 7,
    type: "Regular",
    empId: "2024051510",
    name: "Md. Sadmanur Islam Shishir",
    joinDate: "01/09/2024",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Jr. Executive",
    grade: " ",
    unit: "PSL",
    line: " ",
    wd: 22,
    present: 19,
    absent: 0,
    leave: 3,
    holiday: 8,
    basic: 16200,
    hRent: 8100,
    med: 1620,
    conv: 1080,
    food: 0,
    gross: 27000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 25750,
    revStamp: 0,
    totalPay: 25750,
    bankPay: 15750,
    cashPay: 10000,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0274893"
  },
  {
    id: 8,
    type: "Regular",
    empId: "2023044078",
    name: "Md. Anik Islam",
    joinDate: "16/08/2023",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Deputy Manager",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 22,
    present: 20,
    absent: 0,
    leave: 2,
    holiday: 8,
    basic: 47400,
    hRent: 23700,
    med: 4740,
    conv: 3160,
    food: 0,
    gross: 79000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 67750,
    revStamp: 0,
    totalPay: 67750,
    bankPay: 38588,
    cashPay: 29162,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0258700"
  },
  {
    id: 9,
    type: "Regular",
    empId: "2025053125",
    name: "Al Riyad Karim",
    joinDate: "12/01/2025",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Sr. Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 22,
    present: 18,
    absent: 0,
    leave: 4,
    holiday: 8,
    basic: 27600,
    hRent: 13800,
    med: 2760,
    conv: 1840,
    food: 0,
    gross: 46000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 44750,
    revStamp: 0,
    totalPay: 44750,
    bankPay: 35000,
    cashPay: 9750,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0347140"
  },
  {
    id: 10,
    type: "Regular",
    empId: "2025054707",
    name: "Allama Bakhtiyar Nafis",
    joinDate: "16/04/2025",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Jr. Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 22,
    present: 20,
    absent: 0,
    leave: 2,
    holiday: 8,
    basic: 15000,
    hRent: 7500,
    med: 1500,
    conv: 1000,
    food: 0,
    gross: 25000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 23750,
    revStamp: 0,
    totalPay: 23750,
    bankPay: 15000,
    cashPay: 8750,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "238.105.0019971"
  },
  {
    id: 11,
    type: "Regular",
    empId: "2025054710",
    name: "Raihan Jami Khan",
    joinDate: "16/04/2025",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Jr. Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 22,
    present: 20,
    absent: 0,
    leave: 2,
    holiday: 8,
    basic: 15000,
    hRent: 7500,
    med: 1500,
    conv: 1000,
    food: 0,
    gross: 25000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 23750,
    revStamp: 0,
    totalPay: 23750,
    bankPay: 15000,
    cashPay: 8750,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0457353"
  },
  {
    id: 12,
    type: "Regular",
    empId: "2026059418",
    name: "Md Robayet Hasan Yeasin",
    joinDate: "10/05/2026",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Jr. Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 20,
    present: 20,
    absent: 0,
    leave: 0,
    holiday: 10,
    basic: 18000,
    hRent: 9000,
    med: 1800,
    conv: 1200,
    food: 0,
    gross: 30000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 28750,
    revStamp: 0,
    totalPay: 28750,
    bankPay: 28750,
    cashPay: 0,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0793441"
  },
  {
    id: 13,
    type: "Regular",
    empId: "2026059427",
    name: "Mir Md Moshiu Islam",
    joinDate: "11/05/2026",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Jr. Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 20,
    present: 20,
    absent: 0,
    leave: 0,
    holiday: 10,
    basic: 15000,
    hRent: 7500,
    med: 1500,
    conv: 1000,
    food: 0,
    gross: 25000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 23750,
    revStamp: 0,
    totalPay: 23750,
    bankPay: 23750,
    cashPay: 0,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0793452"
  },
  {
    id: 14,
    type: "New",
    empId: "2026059573",
    name: "Md. Piyash Hasan",
    joinDate: "10/06/2026",
    employeeType: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team", // Area
    designation: "Executive",
    grade: "None",
    unit: "PSL",
    line: "N/A",
    wd: 21,
    present: 16,
    absent: 0,
    leave: 0,
    holiday: 5,
    basic: 24000,
    hRent: 12000,
    med: 2400,
    conv: 1600,
    food: 0,
    gross: 40000,
    ot2: 0,
    otPay2: 0,
    ot3: 0,
    otPay3: 0,
    eot: 0,
    eotPay: 0,
    totalOt: 0,
    totalOtPay: 0,
    attBonus: 0,
    behaviorBonus: 0,
    holidayAllowance: 0,
    generalAllowance: 0,
    conveyanceAllowance: 0,
    incentiveAllowance: 0,
    nightAllowance: 0,
    tiffin: 0,
    otherAllowance: 0,
    totalAllowance: 0,
    arrearAdjust: 0,
    tax: 0,
    absentDeduct: 0,
    advance: 0,
    adjust: 0,
    wagelyAdv: 0,
    loan: 0,
    lunchDeduct: 1250,
    lateDeduct: 0,
    paySalary: 26750,
    revStamp: 0,
    totalPay: 26750,
    bankPay: 25000,
    cashPay: 1750,
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "125.105.52631"
  }
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
  type: string;
  empId: string;
  name: string;
  joinDate: string;
  employeeType: string;
  department: string;
  section: string; // Area
  designation: string;
  grade: string;
  unit: string;
  line: string;
  wd: number;
  present: number;
  absent: number;
  leave: number;
  holiday: number;
  basic: number;
  hRent: number;
  med: number;
  conv: number;
  food: number;
  gross: number;
  ot2: number;
  otPay2: number;
  ot3: number;
  otPay3: number;
  eot: number;
  eotPay: number;
  totalOt: number;
  totalOtPay: number;
  attBonus: number;
  behaviorBonus: number;
  holidayAllowance: number;
  generalAllowance: number;
  conveyanceAllowance: number;
  incentiveAllowance: number;
  nightAllowance: number;
  tiffin: number;
  otherAllowance: number;
  totalAllowance: number;
  arrearAdjust: number;
  tax: number;
  absentDeduct: number;
  advance: number;
  adjust: number;
  wagelyAdv: number;
  loan: number;
  lunchDeduct: number;
  lateDeduct: number;
  paySalary: number;
  revStamp: number;
  totalPay: number;
  bankPay: number;
  cashPay: number;
  bankName: string;
  accountNo: string;
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

const DEFAULT_COLUMNS = {
  type: true,
  empId: true,
  name: true,
  joinDate: true,
  employeeType: true,
  department: true,
  section: true,
  designation: true,
  grade: true,
  unit: true,
  line: true,
  wd: true,
  present: true,
  absent: true,
  leave: true,
  holiday: true,
  basic: true,
  hRent: true,
  med: true,
  conv: true,
  food: true,
  gross: true,
  ot2: true,
  otPay2: true,
  ot3: true,
  otPay3: true,
  eot: true,
  eotPay: true,
  totalOt: true,
  totalOtPay: true,
  attBonus: true,
  behaviorBonus: true,
  holidayAllowance: true,
  generalAllowance: true,
  conveyanceAllowance: true,
  incentiveAllowance: true,
  nightAllowance: true,
  tiffin: true,
  otherAllowance: true,
  totalAllowance: true,
  arrearAdjust: true,
  tax: true,
  absentDeduct: true,
  advance: true,
  adjust: true,
  wagelyAdv: true,
  loan: true,
  lunchDeduct: true,
  lateDeduct: true,
  paySalary: true,
  revStamp: true,
  totalPay: true,
  bankPay: true,
  cashPay: true,
  bankName: true,
  accountNo: true
};

type ColumnKey = keyof typeof DEFAULT_COLUMNS;

const COLUMN_LABELS: Record<ColumnKey, string> = {
  type: "Type",
  empId: "Emp Id",
  name: "Name",
  joinDate: "Join Date",
  employeeType: "Employee Type",
  department: "Department",
  section: "Area",
  designation: "Designation",
  grade: "Grade",
  unit: "Unit",
  line: "Line",
  wd: "WD",
  present: "Present",
  absent: "Absent",
  leave: "Leave",
  holiday: "Holiday",
  basic: "Basic",
  hRent: "HRent",
  med: "Med",
  conv: "Conv",
  food: "Food",
  gross: "Gross",
  ot2: "OT(2)",
  otPay2: "OT Pay(2)",
  ot3: "OT(3)",
  otPay3: "OT Pay(3)",
  eot: "EOT",
  eotPay: "EOT Pay",
  totalOt: "Total OT",
  totalOtPay: "Total OT Pay",
  attBonus: "Att. Bonus",
  behaviorBonus: "Behavior Bonus",
  holidayAllowance: "Holiday Allowance",
  generalAllowance: "General Allowance",
  conveyanceAllowance: "Conveyance Allowance",
  incentiveAllowance: "Incentive Allowance",
  nightAllowance: "Night Allowance",
  tiffin: "Tiffin",
  otherAllowance: "Other Allowance",
  totalAllowance: "Total Allowance",
  arrearAdjust: "Arrear/Adjust",
  tax: "Tax",
  absentDeduct: "Absent Deduction",
  advance: "Advance Amount",
  adjust: "Adjust",
  wagelyAdv: "Wagely Adv",
  loan: "Loan",
  lunchDeduct: "Lunch Deduct",
  lateDeduct: "Late Deduct",
  paySalary: "Pay Salary",
  revStamp: "Rev. Stamp",
  totalPay: "Total Pay",
  bankPay: "Bank Pay",
  cashPay: "Cash Pay",
  bankName: "Bank Name",
  accountNo: "Account No"
};

type ColumnTemplate = {
  id: string;
  name: string;
  isActive: boolean;
  isDefault?: boolean;
  columns: Record<ColumnKey, boolean>;
  order: ColumnKey[];
};

const columnStorageKey = "salary_process_column_templates_v1";
const defaultColumnOrder = Object.keys(DEFAULT_COLUMNS) as ColumnKey[];

const createDefaultColumnTemplate = (): ColumnTemplate => ({
  id: "default",
  name: "Default Columns",
  isActive: true,
  isDefault: true,
  columns: { ...DEFAULT_COLUMNS },
  order: [...defaultColumnOrder],
});

const normalizeColumnOrder = (order?: ColumnKey[]) => {
  const validKeys = new Set(defaultColumnOrder);
  const cleaned = (order || []).filter((key): key is ColumnKey => validKeys.has(key));
  return [...cleaned, ...defaultColumnOrder.filter((key) => !cleaned.includes(key))];
};

const normalizeColumnVisibility = (columns?: Partial<Record<ColumnKey, boolean>>) => ({
  ...DEFAULT_COLUMNS,
  ...(columns || {}),
});

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

  // Column rearrangement & show/hide configurations
  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({ ...DEFAULT_COLUMNS });
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>([...defaultColumnOrder]);
  const [draftVisibleCols, setDraftVisibleCols] = useState<Record<ColumnKey, boolean>>({ ...DEFAULT_COLUMNS });
  const [draftColumnOrder, setDraftColumnOrder] = useState<ColumnKey[]>([...defaultColumnOrder]);
  const [columnTemplates, setColumnTemplates] = useState<ColumnTemplate[]>([createDefaultColumnTemplate()]);
  const [templateName, setTemplateName] = useState("");
  const [isColSelectorOpen, setIsColSelectorOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  // Read mounted states & load column templates
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const fallback = [createDefaultColumnTemplate()];
      try {
        const savedTemplates = localStorage.getItem(columnStorageKey);
        if (savedTemplates) {
          const parsed = JSON.parse(savedTemplates);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalizedTemplates = parsed.map((t: any) => ({
              ...t,
              columns: normalizeColumnVisibility(t.columns),
              order: normalizeColumnOrder(t.order),
            }));
            const activeTemplate = normalizedTemplates.find((t: any) => t.isActive) || normalizedTemplates[0] || fallback[0];
            setColumnTemplates(normalizedTemplates);
            setVisibleCols(normalizeColumnVisibility(activeTemplate.columns));
            setColumnOrder(normalizeColumnOrder(activeTemplate.order));
            setDraftVisibleCols(normalizeColumnVisibility(activeTemplate.columns));
            setDraftColumnOrder(normalizeColumnOrder(activeTemplate.order));
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load column templates", e);
      }
      setColumnTemplates(fallback);
      localStorage.setItem(columnStorageKey, JSON.stringify(fallback));
    }
  }, []);

  // Save column templates on changes
  useEffect(() => {
    if (!isMounted) return;
    if (typeof window === "undefined") return;
    localStorage.setItem(columnStorageKey, JSON.stringify(columnTemplates));
  }, [columnTemplates, isMounted]);

  const openColumnModal = () => {
    setDraftVisibleCols({ ...visibleCols });
    setDraftColumnOrder([...columnOrder]);
    setIsColSelectorOpen(true);
  };

  const toggleDraftColumn = (key: ColumnKey) => {
    setDraftVisibleCols((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const moveDraftColumn = (key: ColumnKey, direction: "up" | "down") => {
    setDraftColumnOrder((prev) => {
      const currentIndex = prev.indexOf(key);
      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
      return next;
    });
  };

  const updateDraftSerial = (key: ColumnKey, value: string) => {
    const serial = Number(value);
    if (!Number.isFinite(serial)) return;

    setDraftColumnOrder((prev) => {
      const currentIndex = prev.indexOf(key);
      const nextIndex = Math.min(Math.max(serial - 1, 0), prev.length - 1);
      if (currentIndex < 0 || currentIndex === nextIndex) return prev;

      const next = [...prev];
      next.splice(currentIndex, 1);
      next.splice(nextIndex, 0, key);
      return next;
    });
  };

  const handleDragStart = (e: any, index: number) => {
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (e: any, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDraggedOverIndex(index);
  };

  const handleDrop = (e: any, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    setDraftColumnOrder((prev) => {
      const next = [...prev];
      const [draggedItem] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, draggedItem);
      return next;
    });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const applyColumnConfig = (templates = columnTemplates) => {
    const columns = normalizeColumnVisibility(draftVisibleCols);
    const order = normalizeColumnOrder(draftColumnOrder);

    setVisibleCols(columns);
    setColumnOrder(order);
    setDraftVisibleCols(columns);
    setDraftColumnOrder(order);
    setColumnTemplates(
      templates.map((template) => (template.isActive ? { ...template, columns, order } : template)),
    );
  };

  const activateColumnTemplate = (templateId: string) => {
    const targetTemplate = columnTemplates.find((template) => template.id === templateId);
    if (!targetTemplate) return;

    const columns = normalizeColumnVisibility(targetTemplate.columns);
    const order = normalizeColumnOrder(targetTemplate.order);
    const updatedTemplates = columnTemplates.map((template) => ({
      ...template,
      isActive: template.id === templateId,
    }));

    setColumnTemplates(updatedTemplates);
    setVisibleCols(columns);
    setColumnOrder(order);
    setDraftVisibleCols(columns);
    setDraftColumnOrder(order);
  };

  const deactivateColumnTemplate = (templateId: string) => {
    const targetTemplate = columnTemplates.find((template) => template.id === templateId);
    const defaultTemplate = createDefaultColumnTemplate();
    if (!targetTemplate || targetTemplate.isDefault) return;

    const updatedTemplates = columnTemplates.map((template) => ({
      ...template,
      isActive: template.id === defaultTemplate.id,
    }));

    setColumnTemplates(updatedTemplates);
    setVisibleCols({ ...defaultTemplate.columns });
    setColumnOrder([...defaultTemplate.order]);
    setDraftVisibleCols({ ...defaultTemplate.columns });
    setDraftColumnOrder([...defaultTemplate.order]);
  };

  const saveColumnTemplate = () => {
    const name = templateName.trim();
    if (!name) return;

    const newTemplate: ColumnTemplate = {
      id: `custom_${Date.now()}`,
      name,
      isActive: true,
      columns: { ...draftVisibleCols },
      order: [...draftColumnOrder],
    };

    const updatedTemplates = columnTemplates.map((t) => ({ ...t, isActive: false })).concat(newTemplate);
    setColumnTemplates(updatedTemplates);
    setTemplateName("");
    applyColumnConfig(updatedTemplates);
  };

  const deleteColumnTemplate = (templateId: string) => {
    const target = columnTemplates.find((t) => t.id === templateId);
    if (!target || target.isDefault) return;

    const updatedTemplates = columnTemplates.filter((t) => t.id !== templateId);
    if (target.isActive) {
      const defaultTemplate = updatedTemplates.find((t) => t.isDefault) || updatedTemplates[0];
      if (defaultTemplate) {
        defaultTemplate.isActive = true;
        setVisibleCols(normalizeColumnVisibility(defaultTemplate.columns));
        setColumnOrder(normalizeColumnOrder(defaultTemplate.order));
        setDraftVisibleCols(normalizeColumnVisibility(defaultTemplate.columns));
        setDraftColumnOrder(normalizeColumnOrder(defaultTemplate.order));
      }
    }
    setColumnTemplates(updatedTemplates);
  };

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
    const generated: ProcessedSalaryRecord[] = ROSTER_EMPLOYEES.map((emp) => {
      return {
        ...emp,
        netSalary: emp.totalPay
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

                {/* Column Configuration Selector */}
                <button
                  onClick={openColumnModal}
                  className="h-10 px-4 rounded-xl border border-slate-250 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer bg-white"
                >
                  <LayoutGrid className="size-4 text-blue-600" />
                  <span>Columns</span>
                  <ChevronDown className="size-3 text-slate-450" />
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-x-auto relative">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[3200px] border-collapse border border-slate-200">
                <thead className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 bg-slate-50 sticky top-0 z-10 font-sans">
                  <tr className="divide-x divide-slate-200 border-b border-slate-200">
                    <th className="px-2 py-2 text-center w-12 bg-slate-50">SL</th>
                    <th className="px-2 py-2 text-center w-16 bg-slate-50">Edit</th>
                    {columnOrder.map((key) => {
                      if (!visibleCols[key]) return null;
                      
                      let extraClass = "";
                      if (key === "paySalary") extraClass = "font-extrabold bg-[#f1f5f9]";
                      else if (key === "totalPay") extraClass = "font-extrabold bg-[#eff6ff] text-blue-600";
                      else if (key === "absentDeduct") extraClass = "text-rose-600";
                      else if (key === "lateDeduct") extraClass = "text-rose-500";
                      
                      let alignClass = "text-left";
                      const rightAligned = [
                        "basic", "hRent", "med", "conv", "food", "gross", "otPay2", "otPay3", "eotPay", 
                        "totalOtPay", "attBonus", "behaviorBonus", "holidayAllowance", "generalAllowance", 
                        "conveyanceAllowance", "incentiveAllowance", "nightAllowance", "tiffin", "otherAllowance", 
                        "totalAllowance", "arrearAdjust", "tax", "absentDeduct", "advance", "adjust", 
                        "wagelyAdv", "loan", "lunchDeduct", "lateDeduct", "paySalary", "revStamp", "totalPay", 
                        "bankPay", "cashPay"
                      ];
                      const centerAligned = [
                        "wd", "present", "absent", "leave", "holiday", "ot2", "ot3", "eot", "totalOt"
                      ];
                      
                      if (rightAligned.includes(key)) alignClass = "text-right";
                      else if (centerAligned.includes(key)) alignClass = "text-center";
                      
                      return (
                        <th key={key} className={`px-2 py-2 ${alignClass} ${extraClass}`}>
                          {COLUMN_LABELS[key]}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 bg-white text-slate-700 font-sans">
                  {!isDataLoaded ? (
                    <tr>
                      <td colSpan={columnOrder.filter(k => visibleCols[k]).length + 2} className="px-6 py-20 text-center text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="size-6 text-slate-300" />
                          <span>No data retrieved. Select Month/Year and click "GET PROCESSED DATA" or run "PROCESS" calculations.</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={columnOrder.filter(k => visibleCols[k]).length + 2} className="px-6 py-20 text-center text-slate-400 font-medium">
                        No processed records match selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 divide-x divide-slate-150 transition-colors group">
                        <td className="px-2 py-1.5 font-semibold text-slate-400 text-center">{idx + 1}</td>
                        <td className="px-2 py-1.5 text-center">
                          <button 
                            onClick={() => handleEditRecord(row)}
                            className="bg-blue-50 text-blue-600 p-1 rounded hover:bg-blue-100 transition-colors cursor-pointer shadow-xs border border-blue-100" 
                            title="Adjust Record values"
                          >
                            <Edit className="size-3" />
                          </button>
                        </td>
                        {columnOrder.map((key) => {
                          if (!visibleCols[key]) return null;
                          
                          const val = row[key as keyof ProcessedSalaryRecord];
                          let cellClass = "text-slate-650";
                          let formatVal = val;
                          
                          if (key === "type") cellClass = "font-semibold text-slate-500";
                          else if (key === "empId") cellClass = "font-semibold text-slate-800";
                          else if (key === "name") cellClass = "font-bold text-slate-900 group-hover:text-blue-600 transition-colors min-w-[150px]";
                          else if (key === "joinDate") cellClass = "font-medium text-slate-550";
                          else if (key === "bankName") cellClass = "font-semibold text-slate-600 text-xs";
                          else if (key === "accountNo") cellClass = "font-mono text-slate-500";
                          
                          const currencyKeys = [
                            "basic", "hRent", "med", "conv", "food", "gross", "otPay2", "otPay3", "eotPay", 
                            "totalOtPay", "attBonus", "behaviorBonus", "holidayAllowance", "generalAllowance", 
                            "conveyanceAllowance", "incentiveAllowance", "nightAllowance", "tiffin", "otherAllowance", 
                            "totalAllowance", "arrearAdjust", "tax", "absentDeduct", "advance", "adjust", 
                            "wagelyAdv", "loan", "lunchDeduct", "lateDeduct", "paySalary", "revStamp", "totalPay", 
                            "bankPay", "cashPay"
                          ];
                          const centerAligned = [
                            "wd", "present", "absent", "leave", "holiday", "ot2", "ot3", "eot", "totalOt"
                          ];
                          
                          let alignClass = "text-left";
                          if (currencyKeys.includes(key)) {
                            alignClass = "text-right font-mono";
                            formatVal = typeof val === "number" ? val.toLocaleString() : val;
                            if (key === "paySalary") cellClass = "font-bold bg-slate-50 text-slate-800";
                            else if (key === "totalPay") cellClass = "font-extrabold bg-blue-50/30 text-blue-600";
                            else if (key === "absentDeduct") cellClass = "text-rose-600";
                            else if (key === "lateDeduct") cellClass = "text-rose-500";
                          } else if (centerAligned.includes(key)) {
                            alignClass = "text-center font-mono";
                            if (key === "present") cellClass = "font-medium text-emerald-600";
                            else if (key === "absent") cellClass = "font-medium text-rose-500";
                            else if (key === "leave") cellClass = "font-medium text-amber-600";
                            else if (key === "holiday") cellClass = "font-medium text-blue-600";
                          }
                          
                          return (
                            <td key={key} className={`px-2 py-1.5 ${alignClass} ${cellClass}`}>
                              {formatVal}
                            </td>
                          );
                        })}
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
                
                {/* Section: Deductions & Exceptions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <TrendingDown className="size-4.5 text-rose-500" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-550 block">Monthly Deductions & Exceptions (৳)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    
                    {/* Lunch Deduct */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-150 bg-slate-50/30">
                      <div className="size-9 rounded-lg flex items-center justify-center bg-orange-50 border border-orange-100 text-orange-500 shrink-0">
                        <Utensils className="size-4.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lunch Deduct</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editLunchDeduct}
                            onChange={(e) => setEditLunchDeduct(Number(e.target.value))}
                            className="w-full h-8.5 pl-6 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 font-mono focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Transport Deduct */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-150 bg-slate-50/30">
                      <div className="size-9 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-100 text-blue-500 shrink-0">
                        <Car className="size-4.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Transport Deduct</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editTransportDeduct}
                            onChange={(e) => setEditTransportDeduct(Number(e.target.value))}
                            className="w-full h-8.5 pl-6 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 font-mono focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PF Deduct */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-150 bg-slate-50/30">
                      <div className="size-9 rounded-lg flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-500 shrink-0">
                        <Wallet className="size-4.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PF Deduct</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editPf}
                            onChange={(e) => setEditPf(Number(e.target.value))}
                            className="w-full h-8.5 pl-6 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 font-mono focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tax Deduct */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-150 bg-slate-50/30">
                      <div className="size-9 rounded-lg flex items-center justify-center bg-teal-50 border border-teal-100 text-teal-500 shrink-0">
                        <Percent className="size-4.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tax Deduct</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editTax}
                            onChange={(e) => setEditTax(Number(e.target.value))}
                            className="w-full h-8.5 pl-6 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 font-mono focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Absent Penalty */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-150 bg-slate-50/30">
                      <div className="size-9 rounded-lg flex items-center justify-center bg-rose-50 border border-rose-100 text-rose-500 shrink-0">
                        <AlertTriangle className="size-4.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-rose-600">Absent Penalty</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editAbsentDeduct}
                            onChange={(e) => setEditAbsentDeduct(Number(e.target.value))}
                            className="w-full h-8.5 pl-6 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-rose-600 font-mono focus:ring-4 focus:ring-rose-500/5 focus:border-rose-400 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Salary Advance */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-150 bg-slate-50/30">
                      <div className="size-9 rounded-lg flex items-center justify-center bg-violet-50 border border-violet-100 text-violet-500 shrink-0">
                        <ArrowUpRight className="size-4.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Salary Adv.</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editAdvance}
                            onChange={(e) => setEditAdvance(Number(e.target.value))}
                            className="w-full h-8.5 pl-6 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 font-mono focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Loan Repay */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-150 bg-slate-50/30">
                      <div className="size-9 rounded-lg flex items-center justify-center bg-amber-50 border border-amber-100 text-amber-500 shrink-0">
                        <Coins className="size-4.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Loan Repay</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editLoan}
                            onChange={(e) => setEditLoan(Number(e.target.value))}
                            className="w-full h-8.5 pl-6 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 font-mono focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Adjustments */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-150 bg-slate-50/30">
                      <div className="size-9 rounded-lg flex items-center justify-center bg-emerald-50 border border-emerald-100 text-emerald-500 shrink-0">
                        <Sliders className="size-4.5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Adjustments</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">৳</span>
                          <input
                            type="number"
                            value={editAdjust}
                            onChange={(e) => setEditAdjust(Number(e.target.value))}
                            className="w-full h-8.5 pl-6 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 font-mono focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
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

        {/* COLUMN SELECTOR DIALOG */}
        {isColSelectorOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={(event) => {
              if (event.target === event.currentTarget) setIsColSelectorOpen(false);
            }}
          >
            <div className="bg-white w-full max-w-4xl border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col font-sans">
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="size-4.5 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-800">Column Arrangement & Visibility</h3>
                  </div>
                  <p className="text-[11px] text-slate-455 mt-1 font-medium">
                    Show/hide columns, drag columns to reorder, and save reusable custom templates.
                  </p>
                </div>
                <button
                  onClick={() => setIsColSelectorOpen(false)}
                  className="size-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-0 overflow-hidden flex-1">
                {/* Left Panel: Templates */}
                <div className="border-b lg:border-b-0 lg:border-r border-slate-100 p-5 space-y-4 overflow-y-auto bg-slate-50/30">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Saved Templates
                      </span>
                      <span className="text-[10px] font-bold text-blue-600">
                        {columnTemplates.length} templates
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {columnTemplates.map((template) => {
                        const visibleCount = Object.values(template.columns).filter(Boolean).length;

                        return (
                          <div
                            key={template.id}
                            className={`rounded-xl border p-3.5 transition-all ${template.isActive ? "border-blue-200 bg-blue-50/20 shadow-xs" : "border-slate-200 bg-white"}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  {template.isDefault && (
                                    <Star className="size-3.5 text-amber-500 fill-amber-500/20" />
                                  )}
                                  <span className="text-xs font-bold text-slate-700 truncate block">
                                    {template.name}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                                  {visibleCount} visible • {defaultColumnOrder.length - visibleCount} hidden
                                </div>
                              </div>
                              <span
                                className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${template.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                              >
                                {template.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-3.5">
                              <button
                                onClick={() =>
                                  template.isActive && !template.isDefault
                                    ? deactivateColumnTemplate(template.id)
                                    : activateColumnTemplate(template.id)
                                }
                                disabled={template.isActive && template.isDefault}
                                className="h-7 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                              >
                                {template.isActive && !template.isDefault
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                              {!template.isDefault && (
                                <button
                                  onClick={() => deleteColumnTemplate(template.id)}
                                  className="h-7 px-2.5 rounded-lg border border-rose-100 bg-rose-50/20 hover:bg-rose-50 hover:text-rose-600 text-rose-500 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Trash2 className="size-3" />
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Save Current Layout
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={templateName}
                        onChange={(event) => setTemplateName(event.target.value)}
                        placeholder="Template name"
                        className="w-full h-8.5 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none text-xs transition duration-200 font-semibold text-slate-700"
                      />
                      <button
                        onClick={saveColumnTemplate}
                        className="h-8.5 px-3.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Save className="size-3.5" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Reorder list */}
                <div className="min-h-0 flex flex-col overflow-hidden flex-1">
                  <div className="grid grid-cols-[48px_1fr_100px] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Order</span>
                    <span>Column Name</span>
                    <span className="text-right">Visibility</span>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-slate-100">
                    {draftColumnOrder.map((key, index) => {
                      const isVisible = draftVisibleCols[key];
                      const isOver = draggedOverIndex === index;

                      return (
                        <div
                          key={key}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center gap-4 py-2 bg-white transition-all cursor-grab active:cursor-grabbing group ${isOver ? "bg-blue-50/50 scale-[0.99] border-y border-blue-100" : ""}`}
                        >
                          <div className="w-8 text-[11px] font-bold text-slate-300 font-mono flex items-center gap-1.5">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">⋮⋮</span>
                            <span>{index + 1}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-slate-700 block">{COLUMN_LABELS[key]}</span>
                          </div>

                          <div className="w-24 flex items-center justify-end gap-2.5">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => moveDraftColumn(key, "up")}
                                disabled={index === 0}
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="size-3" />
                              </button>
                              <button
                                onClick={() => moveDraftColumn(key, "down")}
                                disabled={index === draftColumnOrder.length - 1}
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="size-3" />
                              </button>
                            </div>
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={() => toggleDraftColumn(key)}
                              className="size-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-2.5">
                    <Button
                      variant="ghost"
                      onClick={() => setIsColSelectorOpen(false)}
                      className="text-slate-500 font-bold px-4 rounded-xl hover:bg-slate-100 h-9.5 text-xs cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        applyColumnConfig();
                        setIsColSelectorOpen(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 text-xs"
                    >
                      Apply Layout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
