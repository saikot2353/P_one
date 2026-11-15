import React, { useState, useEffect, useMemo } from "react";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Settings,
  ArrowLeft,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Layers,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  Search,
  Sparkles,
  Maximize2,
  Minimize2,
  Copy,
  Table,
  Calculator,
  Equal,
  Percent,
  Check,
  X,
  HelpCircle,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { toast } from "sonner";
import { SearchableSelect, Option } from "@/components/ui/searchable-select";
import { mockData as rawMockEmployees } from "@/routes/monthly-salary-details";

export interface SalarySheetColumn {
  id: string;
  key: string;
  labelEng: string;
  labelBng?: string;
  category:
    | "employee_info"
    | "salary_breakdown"
    | "attendance"
    | "deduction"
    | "overtime"
    | "bonus"
    | "summary_signature";
  mappingType?: "direct" | "formula";
  paramMapping: string;
  formulaExpression?: string; // e.g. "sal_food + sal_conveyance + alw_general"
  width?: string;
  align: "left" | "center" | "right";
  isRotatedHeader?: boolean;
  isRotatedValue?: boolean;
  isVisible: boolean;
  format?: "currency" | "number" | "text" | "date" | "signature";
}

export interface SalarySheetTemplate {
  id: string;
  title: string;
  companyName: string;
  employeeType: string;
  otType?: string;
  isActive: boolean;
  description?: string;
  columns: SalarySheetColumn[];
}

export interface SystemParameterDef {
  key: string;
  nameEng: string;
  nameBng: string;
  category: SalarySheetColumn["category"];
  sampleValue: string | number;
  format: "currency" | "number" | "text" | "date" | "signature";
}

export const SYSTEM_PARAMETERS: SystemParameterDef[] = [
  // Employee Information
  { key: "emp_sl", nameEng: "SL (Serial Number)", nameBng: "ক্রমিক নং", category: "employee_info", sampleValue: 1, format: "number" },
  { key: "emp_id_name", nameEng: "ID, Name & Designation (Stacked Card)", nameBng: "আইডি, নাম ও পদবী", category: "employee_info", sampleValue: "2025058109 / Methoun Ahmed", format: "text" },
  { key: "emp_id", nameEng: "Employee ID (System ID)", nameBng: "কর্মচারী আইডি", category: "employee_info", sampleValue: "2025058109", format: "text" },
  { key: "emp_name", nameEng: "Employee Full Name", nameBng: "কর্মচারীর নাম", category: "employee_info", sampleValue: "Mohammad Methoun Ahmed", format: "text" },
  { key: "emp_designation", nameEng: "Designation / Position", nameBng: "পদবী", category: "employee_info", sampleValue: "Sr. Manager", format: "text" },
  { key: "emp_grade", nameEng: "Pay Grade / Band", nameBng: "গ্রেড", category: "employee_info", sampleValue: "Grade-02", format: "text" },
  { key: "emp_department", nameEng: "Department", nameBng: "বিভাগ", category: "employee_info", sampleValue: "Business Automation", format: "text" },
  { key: "emp_section", nameEng: "Section", nameBng: "শাখা", category: "employee_info", sampleValue: "Core Development", format: "text" },
  { key: "emp_unit", nameEng: "Factory / Corporate Unit", nameBng: "ইউনিট", category: "employee_info", sampleValue: "PSL Unit-01", format: "text" },
  { key: "emp_line", nameEng: "Production Line Number", nameBng: "লাইন", category: "employee_info", sampleValue: "Line-01", format: "text" },
  { key: "emp_join_date", nameEng: "Joining Date (JD)", nameBng: "যোগদানের তারিখ", category: "employee_info", sampleValue: "22/12/2025", format: "date" },
  { key: "emp_bank_acc", nameEng: "Bank Account / MFS No", nameBng: "ব্যাংক হিসাব", category: "employee_info", sampleValue: "1501203498810001", format: "text" },

  // Salary Breakdown (Earnings)
  { key: "sal_basic", nameEng: "Basic Salary", nameBng: "মূল বেতন", category: "salary_breakdown", sampleValue: 78000, format: "currency" },
  { key: "sal_house_rent", nameEng: "House Rent Allowance", nameBng: "বাড়ি ভাড়া", category: "salary_breakdown", sampleValue: 39000, format: "currency" },
  { key: "sal_medical", nameEng: "Medical Allowance", nameBng: "চিকিৎসা ভাতা", category: "salary_breakdown", sampleValue: 7800, format: "currency" },
  { key: "sal_food", nameEng: "Food Allowance", nameBng: "খাদ্য ভাতা", category: "salary_breakdown", sampleValue: 0, format: "currency" },
  { key: "sal_conveyance", nameEng: "Conveyance Allowance", nameBng: "যাতায়াত ভাতা", category: "salary_breakdown", sampleValue: 5200, format: "currency" },
  { key: "sal_gross", nameEng: "Gross Salary (Total Wages)", nameBng: "মোট মূল বেতন", category: "salary_breakdown", sampleValue: 130000, format: "currency" },
  { key: "sal_payable_salary", nameEng: "Payable Salary (Earned Basic/Gross)", nameBng: "প্রদেয় বেতন", category: "salary_breakdown", sampleValue: 128333, format: "currency" },
  { key: "alw_arrear", nameEng: "Arrear / Previous Month Due", nameBng: "বকেয়া বেতন", category: "salary_breakdown", sampleValue: 0, format: "currency" },
  { key: "alw_general", nameEng: "General Allowance", nameBng: "সাধারণ ভাতা", category: "salary_breakdown", sampleValue: 0, format: "currency" },

  // Attendance Metrics
  { key: "att_total_day", nameEng: "Total Month Days (30/31)", nameBng: "মোট দিন", category: "attendance", sampleValue: 31, format: "number" },
  { key: "att_present", nameEng: "Present Days", nameBng: "উপস্থিত দিন", category: "attendance", sampleValue: 20, format: "number" },
  { key: "att_holiday", nameEng: "Holidays & Weekends", nameBng: "ছুটি ও সাপ্তাহিক ছুটি", category: "attendance", sampleValue: 6, format: "number" },
  { key: "att_leave_cl", nameEng: "Casual Leave (CL)", nameBng: "নৈমিত্তিক ছুটি (CL)", category: "attendance", sampleValue: 3, format: "number" },
  { key: "att_leave_sl", nameEng: "Sick Leave (SL)", nameBng: "পীড়া ছুটি (SL)", category: "attendance", sampleValue: 2, format: "number" },
  { key: "att_leave_el", nameEng: "Earned Leave (EL)", nameBng: "অর্জিত ছুটি (EL)", category: "attendance", sampleValue: 0, format: "number" },
  { key: "att_leave_ml", nameEng: "Maternity Leave (ML)", nameBng: "প্রসূতি ছুটি (ML)", category: "attendance", sampleValue: 0, format: "number" },
  { key: "att_absent", nameEng: "Absent Days", nameBng: "অনুপস্থিত দিন", category: "attendance", sampleValue: 0, format: "number" },
  { key: "att_payable_days", nameEng: "Total Payable Attendance Days", nameBng: "মোট প্রদেয় দিন", category: "attendance", sampleValue: 31, format: "number" },

  // Deductions
  { key: "ded_absent", nameEng: "Absent Deduction", nameBng: "অনুপস্থিতজনিত কর্তন", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_advance", nameEng: "Salary Advance Deduction", nameBng: "অগ্রিম বেতন কর্তন", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_stamp", nameEng: "Revenue Stamp (৳10)", nameBng: "রেভিনিউ স্ট্যাম্প (৳১০)", category: "deduction", sampleValue: 10, format: "currency" },
  { key: "ded_wagely", nameEng: "Wagely / Instant Advance", nameBng: "ওয়েজলি অগ্রিম", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_adjust", nameEng: "Adjustment / Loan Deduction", nameBng: "সমন্বয় / ঋণ কর্তন", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_tax", nameEng: "Income Tax (TDS)", nameBng: "উৎস কর (আয়কর)", category: "deduction", sampleValue: 417, format: "currency" },
  { key: "ded_lunch", nameEng: "Lunch / Canteen Deduction", nameBng: "লাঞ্চ কর্তন", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_provident_fund", nameEng: "Provident Fund (PF)", nameBng: "ভবিষ্য তহবিল (PF)", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_total", nameEng: "Total Deductions", nameBng: "মোট কর্তন", category: "deduction", sampleValue: 427, format: "currency" },

  // Overtime
  { key: "ot_hour", nameEng: "OT Hours Worked", nameBng: "ওভারটাইম ঘণ্টা", category: "overtime", sampleValue: 0, format: "number" },
  { key: "ot_rate", nameEng: "OT Hourly Rate", nameBng: "ওভারটাইম হার", category: "overtime", sampleValue: 750.0, format: "currency" },
  { key: "ot_pay", nameEng: "Total Overtime Pay", nameBng: "মোট ওভারটাইম", category: "overtime", sampleValue: 0, format: "currency" },
  { key: "ot_extra_hour", nameEng: "Extra / Friday OT Hours", nameBng: "অতিরিক্ত OT ঘণ্টা", category: "overtime", sampleValue: 0, format: "number" },

  // Bonuses
  { key: "bonus_attendance", nameEng: "Attendance Bonus", nameBng: "উপস্থিতি বোনাস", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "bonus_behavior", nameEng: "Behavior / Compliance Bonus", nameBng: "আচরণ বোনাস", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "bonus_festival", nameEng: "Festival / Eid Bonus", nameBng: "উৎসব বোনাস", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "bonus_production", nameEng: "Production Incentive", nameBng: "উৎপাদন বোনাস", category: "bonus", sampleValue: 0, format: "currency" },

  // Summary & Signatures
  { key: "net_pay", nameEng: "Net Payable Salary", nameBng: "প্রদেয় নিট বেতন", category: "summary_signature", sampleValue: 128333, format: "currency" },
  { key: "col_signature", nameEng: "Employee Signature / Thumbprint", nameBng: "স্বাক্ষর বা টিপসই", category: "summary_signature", sampleValue: "", format: "signature" },
  { key: "col_remarks", nameEng: "Remarks / Bank Status", nameBng: "মন্তব্য", category: "summary_signature", sampleValue: "Paid", format: "text" },
  { key: "custom_param", nameEng: "Custom / Calculated Formula", nameBng: "কাস্টম / হিসাবকৃত সূত্র", category: "summary_signature", sampleValue: "-", format: "text" },
];

export const CATEGORY_LABELS: Record<SalarySheetColumn["category"], { label: string; bng: string; color: string; badge: string }> = {
  employee_info: { label: "Employee Info", bng: "কর্মচারী বিবরণ", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900", badge: "bg-blue-500" },
  salary_breakdown: { label: "Salary Breakdown", bng: "বেতনের বিবরণ", color: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900", badge: "bg-emerald-500" },
  attendance: { label: "Attendance", bng: "উপস্থিতি", color: "text-amber-700 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900", badge: "bg-amber-500" },
  deduction: { label: "Deductions", bng: "কর্তনসমূহ", color: "text-rose-700 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900", badge: "bg-rose-500" },
  overtime: { label: "Overtime (OT)", bng: "ওভারটাইম", color: "text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900", badge: "bg-indigo-500" },
  bonus: { label: "Bonuses & Allowances", bng: "বোনাস ও অতিরিক্ত", color: "text-purple-700 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900", badge: "bg-purple-500" },
  summary_signature: { label: "Net Pay & Signature", bng: "নিট বেতন ও স্বাক্ষর", color: "text-slate-800 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700", badge: "bg-slate-600" },
};

// One-Click Formula Presets for Allowances, OT, Net Pay, etc.
export const FORMULA_PRESETS = [
  {
    nameEng: "Other Allowance (Food + Conveyance)",
    nameBng: "অন্যান্য ভাতা (খাদ্য + যাতায়াত)",
    expression: "sal_food + sal_conveyance",
    category: "salary_breakdown",
  },
  {
    nameEng: "All Non-Basic Allowances (House Rent + Medical + Food + Conveyance)",
    nameBng: "সকল ভাতা (বাড়ি ভাড়া + চিকিৎসা + খাদ্য + যাতায়াত)",
    expression: "sal_house_rent + sal_medical + sal_food + sal_conveyance",
    category: "salary_breakdown",
  },
  {
    nameEng: "Combined Medical & Conveyance (Medical + Conveyance)",
    nameBng: "চিকিৎসা ও যাতায়াত ভাতা",
    expression: "sal_medical + sal_conveyance",
    category: "salary_breakdown",
  },
  {
    nameEng: "Earned Gross Wages (Basic + House + Medical + Food + Conveyance)",
    nameBng: "উপার্জিত মোট মজুরি",
    expression: "sal_basic + sal_house_rent + sal_medical + sal_food + sal_conveyance",
    category: "salary_breakdown",
  },
  {
    nameEng: "Calculated OT Amount (OT Hours × OT Rate)",
    nameBng: "ওভারটাইম পরিমাণ (OT ঘণ্টা × OT হার)",
    expression: "ot_hour * ot_rate",
    category: "overtime",
  },
  {
    nameEng: "Total Statutory Deductions (Absent + Advance + Stamp + Tax + Wagely)",
    nameBng: "আইনসম্মত কর্তনসমূহ",
    expression: "ded_absent + ded_advance + ded_stamp + ded_tax + ded_wagely",
    category: "deduction",
  },
  {
    nameEng: "Net Take-Home Pay (Gross - Total Deductions + OT Pay + Attendance Bonus)",
    nameBng: "প্রদেয় নিট বেতন",
    expression: "sal_gross - ded_total + ot_pay + bonus_attendance",
    category: "summary_signature",
  },
];

// Mathematical Evaluator supporting +, -, *, /, (, )
export function evaluateFormula(expr: string | undefined, emp: any): number {
  if (!expr || !expr.trim()) return 0;

  const paramValues: Record<string, number> = {
    sal_basic: emp.basic || 0,
    sal_house_rent: emp.houseRent || 0,
    sal_medical: emp.medical || 0,
    sal_food: emp.food || 0,
    sal_conveyance: emp.conveyance || 0,
    sal_gross: emp.gross || 0,
    sal_payable_salary: emp.payableSalary || 0,
    alw_arrear: emp.arrear || 0,
    alw_general: emp.genAlw || 0,
    att_total_day: emp.totalDay || 0,
    att_present: emp.present || 0,
    att_holiday: emp.holiday || 0,
    att_leave_cl: emp.cl || 0,
    att_leave_sl: emp.sl || 0,
    att_leave_el: emp.el || 0,
    att_leave_ml: emp.ml || 0,
    att_absent: emp.absent || 0,
    att_payable_days: emp.payableDays || 0,
    ded_absent: emp.absDeduc || 0,
    ded_advance: emp.advance || 0,
    ded_stamp: emp.revStamp || 0,
    ded_wagely: emp.wagelyAd || 0,
    ded_adjust: emp.adjust || 0,
    ded_tax: emp.tax || 0,
    ded_lunch: emp.lunch || 0,
    ded_provident_fund: emp.pf || 0,
    ded_total: emp.totalDeduc || 0,
    ot_hour: emp.otHour || 0,
    ot_rate: emp.otRate || 0,
    ot_pay: emp.otPay || 0,
    bonus_attendance: emp.attendanceBonus || 0,
    bonus_behavior: emp.behaviorBonus || 0,
    bonus_festival: emp.festivalBonus || 0,
    bonus_production: 0,
    net_pay: emp.netPay || 0,
  };

  try {
    let sanitized = expr;
    const sortedKeys = Object.keys(paramValues).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      const regex = new RegExp(`\\b${key}\\b`, "g");
      sanitized = sanitized.replace(regex, String(paramValues[key] ?? 0));
    }

    // Only allow safe math tokens
    if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
      return 0;
    }

    const result = Function(`"use strict"; return (${sanitized})`)();
    return typeof result === "number" && !isNaN(result) && isFinite(result)
      ? Math.round(result * 100) / 100
      : 0;
  } catch {
    return 0;
  }
}

export function formatFormulaHumanReadable(expr: string | undefined): string {
  if (!expr) return "";
  let readable = expr;
  for (const param of SYSTEM_PARAMETERS) {
    const regex = new RegExp(`\\b${param.key}\\b`, "g");
    readable = readable.replace(regex, `[${param.nameEng.split(" (")[0]}]`);
  }
  return readable;
}

export const DEFAULT_SALARY_SHEET_COLUMNS: SalarySheetColumn[] = [
  { id: "col-1", key: "sl", labelEng: "SL", labelBng: "নং", category: "employee_info", mappingType: "direct", paramMapping: "emp_sl", align: "center", width: "24px", isVisible: true, format: "number" },
  { id: "col-2", key: "emp_card", labelEng: "ID & Name", labelBng: "আইডি ও নাম", category: "employee_info", mappingType: "direct", paramMapping: "emp_id_name", align: "left", width: "135px", isVisible: true, format: "text" },
  { id: "col-3", key: "basic", labelEng: "Basic", labelBng: "মূল বেতন", category: "salary_breakdown", mappingType: "direct", paramMapping: "sal_basic", align: "center", width: "52px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-4", key: "house_rent", labelEng: "House Rent", labelBng: "বাড়ি ভাড়া", category: "salary_breakdown", mappingType: "direct", paramMapping: "sal_house_rent", align: "center", width: "50px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-5", key: "medical", labelEng: "Medical", labelBng: "চিকিৎসা", category: "salary_breakdown", mappingType: "direct", paramMapping: "sal_medical", align: "center", width: "46px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-6", key: "food", labelEng: "Food", labelBng: "খাদ্য", category: "salary_breakdown", mappingType: "direct", paramMapping: "sal_food", align: "center", width: "42px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-7", key: "conveyance", labelEng: "Conveyance", labelBng: "যাতায়াত", category: "salary_breakdown", mappingType: "direct", paramMapping: "sal_conveyance", align: "center", width: "46px", isRotatedHeader: true, isVisible: true, format: "currency" },
  {
    id: "col-8",
    key: "other_alw",
    labelEng: "Other Allowance",
    labelBng: "অন্যান্য ভাতা",
    category: "salary_breakdown",
    mappingType: "formula",
    paramMapping: "custom_param",
    formulaExpression: "sal_food + sal_conveyance",
    align: "center",
    width: "50px",
    isRotatedHeader: true,
    isVisible: true,
    format: "currency",
  },
  { id: "col-9", key: "gross", labelEng: "Gross", labelBng: "মোট বেতন", category: "salary_breakdown", mappingType: "direct", paramMapping: "sal_gross", align: "center", width: "54px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-10", key: "total_day", labelEng: "Total Day", labelBng: "মোট দিন", category: "attendance", mappingType: "direct", paramMapping: "att_total_day", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-11", key: "present", labelEng: "Present", labelBng: "উপস্থিত", category: "attendance", mappingType: "direct", paramMapping: "att_present", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-12", key: "holiday", labelEng: "Holiday", labelBng: "ছুটি", category: "attendance", mappingType: "direct", paramMapping: "att_holiday", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-13", key: "cl", labelEng: "CL", labelBng: "নৈমিত্তিক", category: "attendance", mappingType: "direct", paramMapping: "att_leave_cl", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-14", key: "sl", labelEng: "SL (Leave)", labelBng: "পীড়া", category: "attendance", mappingType: "direct", paramMapping: "att_leave_sl", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-15", key: "el", labelEng: "EL", labelBng: "অর্জিত", category: "attendance", mappingType: "direct", paramMapping: "att_leave_el", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-16", key: "absent", labelEng: "Absent", labelBng: "অনুপস্থিত", category: "attendance", mappingType: "direct", paramMapping: "att_absent", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-17", key: "abs_deduc", labelEng: "Abs. Deduc", labelBng: "অনুপস্থিত কর্তন", category: "deduction", mappingType: "direct", paramMapping: "ded_absent", align: "center", width: "48px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-18", key: "advance", labelEng: "Advance", labelBng: "অগ্রিম", category: "deduction", mappingType: "direct", paramMapping: "ded_advance", align: "center", width: "48px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-19", key: "rev_stamp", labelEng: "Rev. Stamp", labelBng: "স্ট্যাম্প", category: "deduction", mappingType: "direct", paramMapping: "ded_stamp", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-20", key: "wagely_ad", labelEng: "Wagely Ad", labelBng: "ওয়েজলি", category: "deduction", mappingType: "direct", paramMapping: "ded_wagely", align: "center", width: "48px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-21", key: "adjust", labelEng: "Adjust", labelBng: "সমন্বয়", category: "deduction", mappingType: "direct", paramMapping: "ded_adjust", align: "center", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-22", key: "tax", labelEng: "Tax", labelBng: "আয়কর", category: "deduction", mappingType: "direct", paramMapping: "ded_tax", align: "center", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-23", key: "pay_salary", labelEng: "Pay Salary", labelBng: "প্রদেয় বেতন", category: "salary_breakdown", mappingType: "direct", paramMapping: "sal_payable_salary", align: "center", width: "54px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-24", key: "ot_hour", labelEng: "OT Hour", labelBng: "OT ঘণ্টা", category: "overtime", mappingType: "direct", paramMapping: "ot_hour", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-25", key: "ot_rate", labelEng: "OT Rate", labelBng: "OT হার", category: "overtime", mappingType: "direct", paramMapping: "ot_rate", align: "center", width: "46px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-26", key: "ot_pay", labelEng: "OT Pay", labelBng: "মোট OT", category: "overtime", mappingType: "direct", paramMapping: "ot_pay", align: "center", width: "48px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-27", key: "att_bonus", labelEng: "Attendance Bonus", labelBng: "হাজিরা বোনাস", category: "bonus", mappingType: "direct", paramMapping: "bonus_attendance", align: "center", width: "46px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-28", key: "net_pay", labelEng: "Net Pay", labelBng: "নিট প্রদেয়", category: "summary_signature", mappingType: "direct", paramMapping: "net_pay", align: "center", width: "62px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-29", key: "signature", labelEng: "Signature", labelBng: "স্বাক্ষর", category: "summary_signature", mappingType: "direct", paramMapping: "col_signature", align: "center", width: "85px", isRotatedHeader: true, isVisible: true, format: "signature" },
];

export const DEFAULT_SALARY_SHEET_TEMPLATES: SalarySheetTemplate[] = [
  {
    id: "sheet-tpl-1",
    title: "Standard Full Landscape Salary Sheet (WH)",
    companyName: "Pakiza Software Limited",
    employeeType: "Worker",
    otType: "2hrs OT",
    isActive: true,
    description: "Standard compliant factory salary sheet with full breakdown, attendance matrix, OT calculation, and stamp deductions.",
    columns: DEFAULT_SALARY_SHEET_COLUMNS,
  },
  {
    id: "sheet-tpl-2",
    title: "Office Executive & Management Salary Sheet",
    companyName: "Pakiza Software Limited",
    employeeType: "Office Executive",
    isActive: true,
    description: "Corporate office executive monthly salary register with bank transfer and income tax columns.",
    columns: DEFAULT_SALARY_SHEET_COLUMNS.filter((c) => !["ot_hour", "ot_rate", "ot_pay"].includes(c.key)),
  },
  {
    id: "sheet-tpl-3",
    title: "Compact Compliance Audit Salary Sheet",
    companyName: "Pakiza Knit Composite Ltd",
    employeeType: "All Categories",
    isActive: false,
    description: "Compact audit-friendly monthly register with key attendance and statutory wage columns.",
    columns: DEFAULT_SALARY_SHEET_COLUMNS.filter((c) => !["wagely_ad", "adjust"].includes(c.key)),
  },
];

interface Props {
  onBackToOverview?: () => void;
}

export function SalarySheetConfiguration({ onBackToOverview }: Props) {
  const [templates, setTemplates] = useState<SalarySheetTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<SalarySheetTemplate | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Template creation modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("Pakiza Software Limited");
  const [newEmpType, setNewEmpType] = useState("Worker");
  const [newOtType, setNewOtType] = useState("2hrs OT");

  // Add column modal
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColLabelEng, setNewColLabelEng] = useState("");
  const [newColLabelBng, setNewColLabelBng] = useState("");
  const [newColCategory, setNewColCategory] = useState<SalarySheetColumn["category"]>("salary_breakdown");
  const [newColMappingType, setNewColMappingType] = useState<"direct" | "formula">("direct");
  const [newColParamMapping, setNewColParamMapping] = useState("sal_basic");
  const [newColFormula, setNewColFormula] = useState("sal_food + sal_conveyance");
  const [newColAlign, setNewColAlign] = useState<"left" | "center" | "right">("center");
  const [newColRotated, setNewColRotated] = useState(true);
  const [newColValueRotated, setNewColValueRotated] = useState(false);
  const [newColWidth, setNewColWidth] = useState("65px");

  // Formula Builder Modal for Existing Column
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [activeFormulaColId, setActiveFormulaColId] = useState<string | null>(null);
  const [modalFormulaExpr, setModalFormulaExpr] = useState("");
  const [modalParamSearch, setModalParamSearch] = useState("");

  // Options for SearchableSelect
  const systemParamOptions: Option[] = useMemo(() => {
    return SYSTEM_PARAMETERS.map((p) => ({
      value: p.key,
      label: `${p.nameEng} (${p.nameBng})`,
    }));
  }, []);

  const categoryOptions: Option[] = useMemo(() => {
    return Object.entries(CATEGORY_LABELS).map(([k, v]) => ({
      value: k,
      label: v.label,
    }));
  }, []);

  const companyOptions: Option[] = [
    { value: "Pakiza Software Limited", label: "Pakiza Software Limited" },
    { value: "Pakiza Knit Composite Ltd", label: "Pakiza Knit Composite Ltd" },
    { value: "Pakiza Cotton Mills Ltd", label: "Pakiza Cotton Mills Ltd" },
    { value: "All Group Entities", label: "All Group Entities" },
  ];

  const empTypeOptions: Option[] = [
    { value: "Worker", label: "Worker" },
    { value: "Office Executive", label: "Office Executive" },
    { value: "Management", label: "Management" },
    { value: "Staff", label: "Staff" },
    { value: "Casual", label: "Casual" },
    { value: "All Categories", label: "All Categories" },
  ];

  const otTypeOptions: Option[] = [
    { value: "2hrs OT", label: "2hrs OT (Standard Daily Overtime)" },
    { value: "3hrs OT", label: "3hrs OT (Heavy Peak Overtime)" },
    { value: "Flat OT", label: "Flat Overtime Rate" },
    { value: "None", label: "None (No OT Calculation)" },
  ];

  // Filtered parameters for formula modal
  const filteredModalParams = useMemo(() => {
    const allowed = SYSTEM_PARAMETERS.filter((p) =>
      ["salary_breakdown", "deduction", "overtime", "bonus"].includes(p.category)
    );
    if (!modalParamSearch.trim()) return allowed;
    const q = modalParamSearch.toLowerCase();
    return allowed.filter(
      (p) =>
        p.nameEng.toLowerCase().includes(q) ||
        p.nameBng.includes(q) ||
        p.key.toLowerCase().includes(q)
    );
  }, [modalParamSearch]);

  // Filter & Search inside Column Editor
  const [columnSearch, setColumnSearch] = useState("");

  // Interactive Live Preview Controls
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "bn">("en");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("salary_sheet_templates_data");
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch {
        setTemplates(DEFAULT_SALARY_SHEET_TEMPLATES);
      }
    } else {
      setTemplates(DEFAULT_SALARY_SHEET_TEMPLATES);
      localStorage.setItem("salary_sheet_templates_data", JSON.stringify(DEFAULT_SALARY_SHEET_TEMPLATES));
    }
  }, []);

  const saveTemplates = (updated: SalarySheetTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem("salary_sheet_templates_data", JSON.stringify(updated));
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Template title is required!");
      return;
    }

    const newTpl: SalarySheetTemplate = {
      id: `sheet-tpl-${Date.now()}`,
      title: newTitle.trim(),
      companyName: newCompany,
      employeeType: newEmpType,
      otType: newEmpType === "Worker" ? newOtType : undefined,
      isActive: true,
      description: `Custom salary sheet layout for ${newEmpType} at ${newCompany}.`,
      columns: JSON.parse(JSON.stringify(DEFAULT_SALARY_SHEET_COLUMNS)),
    };

    const updated = [...templates, newTpl];
    saveTemplates(updated);
    setIsCreateOpen(false);
    setNewTitle("");
    setEditingTemplate(newTpl);
    setIsConfiguring(true);
    toast.success("Salary Sheet template created! Now configure its columns.");
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this salary sheet template?")) {
      const updated = templates.filter((t) => t.id !== id);
      saveTemplates(updated);
      toast.success("Template deleted.");
    }
  };

  const handleToggleTemplateStatus = (id: string) => {
    const updated = templates.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t));
    saveTemplates(updated);
    toast.success("Template status updated.");
  };

  const handleDuplicateTemplate = (tpl: SalarySheetTemplate) => {
    const cloned: SalarySheetTemplate = {
      ...JSON.parse(JSON.stringify(tpl)),
      id: `sheet-tpl-${Date.now()}`,
      title: `${tpl.title} (Copy)`,
      isActive: true,
    };
    const updated = [...templates, cloned];
    saveTemplates(updated);
    toast.success("Template duplicated successfully!");
  };

  // Column operations
  const handleColumnUpdate = (colId: string, updates: Partial<SalarySheetColumn>) => {
    if (!editingTemplate) return;
    const updatedCols = editingTemplate.columns.map((c) => {
      if (c.id !== colId) return c;
      const merged = { ...c, ...updates };
      // When value is rotated vertically, squeeze column width tightly; when returned to horizontal, restore standard width
      if (updates.isRotatedValue !== undefined) {
        if (updates.isRotatedValue) {
          merged.width = "24px";
          merged.isRotatedHeader = true;
        } else {
          if (!c.width || parseInt(c.width) <= 30) {
            merged.width = "52px";
          }
        }
      }
      if (updates.isRotatedHeader !== undefined) {
        if (
          updates.isRotatedHeader &&
          [
            "att_total_day",
            "att_present",
            "att_holiday",
            "att_leave_cl",
            "att_leave_sl",
            "att_leave_el",
            "att_leave_ml",
            "att_absent",
            "ot_hour",
            "ot_extra_hour",
            "emp_sl",
            "ded_stamp",
          ].includes(c.paramMapping)
        ) {
          merged.width = "24px";
        }
      }
      return merged;
    });
    setEditingTemplate({
      ...editingTemplate,
      columns: updatedCols,
    });
  };

  const handleDeleteColumn = (colId: string) => {
    if (!editingTemplate) return;
    const colToDelete = editingTemplate.columns.find((c) => c.id === colId);
    const updatedCols = editingTemplate.columns.filter((c) => c.id !== colId);
    setEditingTemplate({
      ...editingTemplate,
      columns: updatedCols,
    });
    toast.info(`Column "${colToDelete?.labelEng || "Selected"}" deleted.`);
  };

  const handleMoveColumn = (colId: string, direction: "up" | "down") => {
    if (!editingTemplate) return;
    const idx = editingTemplate.columns.findIndex((c) => c.id === colId);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= editingTemplate.columns.length) return;

    const cols = [...editingTemplate.columns];
    const [moved] = cols.splice(idx, 1);
    cols.splice(targetIdx, 0, moved);

    setEditingTemplate({
      ...editingTemplate,
      columns: cols,
    });
  };

  const handleAddCustomColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    if (!newColLabelEng.trim()) {
      toast.error("Column label in English is required!");
      return;
    }

    const paramDef = SYSTEM_PARAMETERS.find((p) => p.key === newColParamMapping);

    const newCol: SalarySheetColumn = {
      id: `custom-col-${Date.now()}`,
      key: `custom_${newColLabelEng.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      labelEng: newColLabelEng.trim(),
      labelBng: newColLabelBng.trim() || undefined,
      category: newColCategory,
      mappingType: newColMappingType,
      paramMapping: newColMappingType === "formula" ? "custom_param" : newColParamMapping,
      formulaExpression: newColMappingType === "formula" ? newColFormula : undefined,
      align: newColAlign,
      width: newColWidth.trim() || "65px",
      isRotatedHeader: newColRotated,
      isRotatedValue: newColValueRotated,
      isVisible: true,
      format: newColMappingType === "formula" ? "currency" : paramDef?.format || "text",
    };

    const updatedCols = [...editingTemplate.columns, newCol];
    setEditingTemplate({
      ...editingTemplate,
      columns: updatedCols,
    });

    setIsAddColumnOpen(false);
    setNewColLabelEng("");
    setNewColLabelBng("");
    toast.success(`Column "${newCol.labelEng}" added successfully!`);
  };

  const handleOpenFormulaModal = (col: SalarySheetColumn) => {
    setActiveFormulaColId(col.id);
    setModalFormulaExpr(col.formulaExpression || col.paramMapping || "sal_basic");
    setModalParamSearch("");
    setIsFormulaModalOpen(true);
  };

  const handleSaveFormulaModal = () => {
    if (!editingTemplate || !activeFormulaColId) return;
    handleColumnUpdate(activeFormulaColId, {
      mappingType: "formula",
      paramMapping: "custom_param",
      formulaExpression: modalFormulaExpr.trim(),
    });
    setIsFormulaModalOpen(false);
    setActiveFormulaColId(null);
    toast.success("Mathematical formula updated for column!");
  };

  const handleRestoreDefaultColumns = () => {
    if (!editingTemplate) return;
    if (window.confirm("Reset all columns to standard default layout? Any custom columns will be replaced.")) {
      setEditingTemplate({
        ...editingTemplate,
        columns: JSON.parse(JSON.stringify(DEFAULT_SALARY_SHEET_COLUMNS)),
      });
      toast.success("Columns reset to standard defaults.");
    }
  };

  const handleSaveConfiguration = () => {
    if (!editingTemplate) return;
    const updated = templates.map((t) => (t.id === editingTemplate.id ? editingTemplate : t));
    saveTemplates(updated);

    // Save as current active salary sheet config for global viewers
    localStorage.setItem("active_salary_sheet_config", JSON.stringify(editingTemplate));

    toast.success("Salary sheet configuration saved successfully!");
  };

  // Filter columns list for editing
  const filteredColumns = useMemo(() => {
    if (!editingTemplate) return [];
    return editingTemplate.columns.filter((c) => {
      const matchSearch =
        !columnSearch.trim() ||
        c.labelEng.toLowerCase().includes(columnSearch.toLowerCase()) ||
        (c.labelBng && c.labelBng.includes(columnSearch)) ||
        c.paramMapping.toLowerCase().includes(columnSearch.toLowerCase()) ||
        (c.formulaExpression && c.formulaExpression.toLowerCase().includes(columnSearch.toLowerCase()));
      return matchSearch;
    });
  }, [editingTemplate, columnSearch]);

  // Mock employee values for real-time live interactive salary sheet view
  const sampleEmployees = useMemo(() => {
    return [
      {
        serialNo: 1,
        id: "2025058109",
        name: "Mohammad Methoun Ahmed",
        designation: "Sr. Manager",
        grade: "Grade-02",
        department: "Business Automation",
        section: "Core Development",
        unit: "PSL Unit-01",
        line: "N/A",
        joinDate: "22/12/2025",
        bankAcc: "1501203498810001",
        basic: 78000,
        houseRent: 39000,
        medical: 7800,
        food: 0,
        conveyance: 5200,
        gross: 130000,
        totalDay: 31,
        present: 20,
        holiday: 6,
        cl: 3,
        sl: 2,
        el: 0,
        ml: 0,
        absent: 0,
        payableDays: 31,
        absDeduc: 0,
        advance: 0,
        revStamp: 10,
        wagelyAd: 0,
        adjust: 0,
        tax: 417,
        lunch: 0,
        pf: 0,
        totalDeduc: 427,
        payableSalary: 128333,
        otHour: 0,
        otRate: 750.0,
        otPay: 0,
        behaviorBonus: 0,
        attendanceBonus: 0,
        festivalBonus: 0,
        netPay: 128333,
      },
      {
        serialNo: 2,
        id: "2026058685",
        name: "Md Johirul Islam",
        designation: "Executive",
        grade: "Grade-05",
        department: "Business Automation",
        section: "Core Development",
        unit: "PSL Unit-01",
        line: "N/A",
        joinDate: "15/02/2026",
        bankAcc: "1501203498810002",
        basic: 20400,
        houseRent: 10200,
        medical: 2040,
        food: 0,
        conveyance: 1360,
        gross: 34000,
        totalDay: 31,
        present: 23,
        holiday: 6,
        cl: 1,
        sl: 1,
        el: 0,
        ml: 0,
        absent: 0,
        payableDays: 31,
        absDeduc: 0,
        advance: 0,
        revStamp: 10,
        wagelyAd: 0,
        adjust: 0,
        tax: 0,
        lunch: 0,
        pf: 0,
        totalDeduc: 10,
        payableSalary: 36750,
        otHour: 0,
        otRate: 196.15,
        otPay: 0,
        behaviorBonus: 0,
        attendanceBonus: 0,
        festivalBonus: 0,
        netPay: 36750,
      },
      {
        serialNo: 3,
        id: "2022035599",
        name: "Dipon Saha",
        designation: "Manager",
        grade: "Grade-03",
        department: "Business Automation",
        section: "Core Development",
        unit: "PSL Unit-01",
        line: "N/A",
        joinDate: "01/03/2022",
        bankAcc: "1501203498810003",
        basic: 40200,
        houseRent: 20100,
        medical: 4020,
        food: 0,
        conveyance: 2680,
        gross: 67000,
        totalDay: 31,
        present: 23,
        holiday: 6,
        cl: 0,
        sl: 2,
        el: 0,
        ml: 0,
        absent: 0,
        payableDays: 31,
        absDeduc: 0,
        advance: 0,
        revStamp: 10,
        wagelyAd: 0,
        adjust: 0,
        tax: 0,
        lunch: 0,
        pf: 0,
        totalDeduc: 10,
        payableSalary: 67000,
        otHour: 0,
        otRate: 386.54,
        otPay: 0,
        behaviorBonus: 0,
        attendanceBonus: 0,
        festivalBonus: 0,
        netPay: 67000,
      },
      {
        serialNo: 4,
        id: "2024052333",
        name: "Md. Al-Amin Hossain",
        designation: "Sr. Executive",
        grade: "Grade-04",
        department: "RMG Operations",
        section: "Cutting Section",
        unit: "Unit-01",
        line: "Line-02",
        joinDate: "10/05/2024",
        bankAcc: "1501203498810004",
        basic: 28800,
        houseRent: 14400,
        medical: 2880,
        food: 0,
        conveyance: 1920,
        gross: 48000,
        totalDay: 31,
        present: 21,
        holiday: 6,
        cl: 2,
        sl: 2,
        el: 0,
        ml: 0,
        absent: 0,
        payableDays: 31,
        absDeduc: 0,
        advance: 0,
        revStamp: 10,
        wagelyAd: 0,
        adjust: 0,
        tax: 0,
        lunch: 0,
        pf: 0,
        totalDeduc: 10,
        payableSalary: 46750,
        otHour: 18,
        otRate: 276.92,
        otPay: 4984,
        behaviorBonus: 0,
        attendanceBonus: 1000,
        festivalBonus: 0,
        netPay: 52734,
      },
      {
        serialNo: 5,
        id: "2024052410",
        name: "Mst. Sharmin Akter",
        designation: "Quality Inspector",
        grade: "Grade-06",
        department: "Quality Assurance",
        section: "Finishing QA",
        unit: "Unit-01",
        line: "Line-01",
        joinDate: "18/06/2024",
        bankAcc: "1501203498810005",
        basic: 24600,
        houseRent: 12300,
        medical: 2460,
        food: 0,
        conveyance: 1640,
        gross: 41000,
        totalDay: 31,
        present: 22,
        holiday: 6,
        cl: 0,
        sl: 3,
        el: 0,
        ml: 0,
        absent: 0,
        payableDays: 31,
        absDeduc: 0,
        advance: 0,
        revStamp: 10,
        wagelyAd: 0,
        adjust: 0,
        tax: 0,
        lunch: 0,
        pf: 0,
        totalDeduc: 10,
        payableSalary: 39750,
        otHour: 24,
        otRate: 236.54,
        otPay: 5676,
        behaviorBonus: 0,
        attendanceBonus: 1000,
        festivalBonus: 0,
        netPay: 46426,
      },
    ];
  }, []);

  // Helper to extract value based on column definition (direct or formula)
  const getCellValue = (emp: any, col: SalarySheetColumn) => {
    // 1. Formula Calculation Mode
    if (col.mappingType === "formula" && col.formulaExpression) {
      const calcResult = evaluateFormula(col.formulaExpression, emp);
      return (
        <span className="font-mono font-semibold text-purple-700 dark:text-purple-300">
          {calcResult.toLocaleString()}
        </span>
      );
    }

    // 2. Direct Parameter Mapping Mode
    switch (col.paramMapping) {
      case "emp_sl":
        return emp.serialNo;
      case "emp_id":
        return emp.id;
      case "emp_name":
        return emp.name;
      case "emp_designation":
        return emp.designation;
      case "emp_grade":
        return emp.grade;
      case "emp_department":
        return emp.department;
      case "emp_section":
        return emp.section;
      case "emp_unit":
        return emp.unit;
      case "emp_line":
        return emp.line;
      case "emp_join_date":
        return emp.joinDate;
      case "emp_bank_acc":
        return emp.bankAcc;
      case "emp_id_name":
        return (
          <div className="text-left font-sans p-1 leading-tight min-w-[120px]">
            <span className="font-bold text-black dark:text-slate-900 block text-[8px]">{emp.id}</span>
            <span className="text-black dark:text-slate-900 font-semibold block text-[7.5px] leading-tight">{emp.name}</span>
            <span className="text-neutral-600 block text-[6.5px]">{emp.designation}</span>
            <div className="flex justify-between mt-1 text-[6px] text-neutral-500 border-t border-neutral-200 pt-0.5">
              <span>{emp.grade}</span>
              <span>JD: {emp.joinDate}</span>
            </div>
          </div>
        );
      case "sal_basic":
        return emp.basic ? emp.basic.toLocaleString() : "-";
      case "sal_house_rent":
        return emp.houseRent ? emp.houseRent.toLocaleString() : "-";
      case "sal_medical":
        return emp.medical ? emp.medical.toLocaleString() : "-";
      case "sal_food":
        return emp.food ? emp.food.toLocaleString() : "-";
      case "sal_conveyance":
        return emp.conveyance ? emp.conveyance.toLocaleString() : "-";
      case "sal_gross":
        return emp.gross ? emp.gross.toLocaleString() : "-";
      case "sal_payable_salary":
        return emp.payableSalary ? emp.payableSalary.toLocaleString() : "-";
      case "alw_arrear":
        return "-";
      case "alw_general":
        return "-";
      case "att_total_day":
        return emp.totalDay;
      case "att_present":
        return emp.present;
      case "att_holiday":
        return emp.holiday;
      case "att_leave_cl":
        return emp.cl || "-";
      case "att_leave_sl":
        return emp.sl || "-";
      case "att_leave_el":
        return emp.el || "-";
      case "att_leave_ml":
        return emp.ml || "-";
      case "att_absent":
        return emp.absent || "-";
      case "att_payable_days":
        return emp.payableDays;
      case "ded_absent":
        return emp.absDeduc ? emp.absDeduc.toLocaleString() : "-";
      case "ded_advance":
        return emp.advance ? emp.advance.toLocaleString() : "-";
      case "ded_stamp":
        return emp.revStamp ? emp.revStamp.toLocaleString() : "-";
      case "ded_wagely":
        return emp.wagelyAd ? emp.wagelyAd.toLocaleString() : "-";
      case "ded_adjust":
        return emp.adjust ? emp.adjust.toLocaleString() : "-";
      case "ded_tax":
        return emp.tax ? emp.tax.toLocaleString() : "-";
      case "ded_lunch":
        return "-";
      case "ded_provident_fund":
        return "-";
      case "ded_total":
        return emp.totalDeduc ? emp.totalDeduc.toLocaleString() : "-";
      case "ot_hour":
        return emp.otHour || "-";
      case "ot_rate":
        return emp.otRate ? emp.otRate.toFixed(2) : "-";
      case "ot_pay":
        return emp.otPay ? emp.otPay.toLocaleString() : "-";
      case "bonus_attendance":
        return emp.attendanceBonus ? emp.attendanceBonus.toLocaleString() : "-";
      case "bonus_behavior":
        return emp.behaviorBonus ? emp.behaviorBonus.toLocaleString() : "-";
      case "bonus_festival":
        return emp.festivalBonus ? emp.festivalBonus.toLocaleString() : "-";
      case "bonus_production":
        return "-";
      case "net_pay":
        return <span className="font-bold text-black dark:text-slate-900">{emp.netPay.toLocaleString()}</span>;
      case "col_signature":
        return <div className="h-9 min-w-[70px]"></div>;
      case "col_remarks":
        return <span className="text-[7.5px] font-semibold text-emerald-700">PAID</span>;
      default:
        return "-";
    }
  };

  // Helper to compute footer total for a column
  const getColumnFooterTotal = (col: SalarySheetColumn) => {
    if (col.mappingType === "formula" && col.formulaExpression) {
      const sum = sampleEmployees.reduce((acc, emp) => acc + evaluateFormula(col.formulaExpression, emp), 0);
      return sum ? sum.toLocaleString() : "-";
    }

    switch (col.paramMapping) {
      case "sal_basic":
        return "192,000";
      case "sal_house_rent":
        return "96,000";
      case "sal_medical":
        return "18,480";
      case "sal_food":
        return "0";
      case "sal_conveyance":
        return "12,800";
      case "sal_gross":
        return "320,000";
      case "sal_payable_salary":
        return "318,583";
      case "ded_stamp":
        return "50";
      case "ded_tax":
        return "417";
      case "ded_total":
        return "467";
      case "ot_hour":
        return "42";
      case "ot_pay":
        return "10,660";
      case "bonus_attendance":
        return "2,000";
      case "net_pay":
        return "326,943";
      default:
        return "-";
    }
  };

  // Formula evaluation preview for active column in modal
  const modalEvaluationPreview = useMemo(() => {
    if (!modalFormulaExpr.trim()) return null;
    const emp1 = sampleEmployees[0];
    const emp4 = sampleEmployees[3];
    return {
      emp1Name: emp1.name,
      emp1Val: evaluateFormula(modalFormulaExpr, emp1),
      emp4Name: emp4.name,
      emp4Val: evaluateFormula(modalFormulaExpr, emp4),
    };
  }, [modalFormulaExpr, sampleEmployees]);

  // Strict compact column width calculator for realistic ledger density
  const getEffectiveColumnWidth = (col: SalarySheetColumn): string => {
    if (col.isRotatedValue) return "24px";
    if (
      [
        "att_total_day",
        "att_present",
        "att_holiday",
        "att_leave_cl",
        "att_leave_sl",
        "att_leave_el",
        "att_leave_ml",
        "att_absent",
        "ot_hour",
        "ot_extra_hour",
        "emp_sl",
        "ded_stamp",
      ].includes(col.paramMapping)
    ) {
      return col.isRotatedHeader ? "24px" : "32px";
    }
    if (col.paramMapping === "emp_id_name") return "140px";
    if (col.paramMapping === "col_signature") return "85px";
    if (col.width && parseInt(col.width) > 0) {
      if (parseInt(col.width) > 55 && col.isRotatedHeader) return "50px";
      return col.width;
    }
    return col.isRotatedHeader ? "50px" : "58px";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      {!isConfiguring ? (
        /* Template List Mode */
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-md border border-primary/20">
                  Payroll Configuration
                </span>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  Landscape Salary Sheets
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 mt-1">
                <FileSpreadsheet className="size-6 text-primary" />
                Salary Sheet Configuration & Formulas
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize column layouts, add mathematical formula columns (+, -, ×, ÷) like "Other Allowance", and map system parameters.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {onBackToOverview && (
                <button
                  type="button"
                  onClick={onBackToOverview}
                  className="h-10 px-4 rounded-xl border border-border/60 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>
              )}
              <button
                onClick={() => {
                  setNewTitle("");
                  setIsCreateOpen(true);
                }}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="size-4" /> Add New Salary Sheet Template
              </button>
            </div>
          </div>

          {/* Templates Table */}
          <div className="overflow-x-auto border border-border/40 rounded-xl">
            <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
              <thead className="bg-muted/30 text-muted-foreground uppercase font-bold tracking-wider text-xs border-b border-border/40">
                <tr>
                  <th className="px-5 py-4 w-[60px] text-center border-r border-border/30">#</th>
                  <th className="px-5 py-4">Template Title</th>
                  <th className="px-5 py-4">Target Company</th>
                  <th className="px-5 py-4">Employee Type</th>
                  <th className="px-5 py-4 text-center">Active Columns</th>
                  <th className="px-5 py-4 text-center w-[120px]">Status</th>
                  <th className="px-5 py-4 text-center w-[200px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-foreground">
                {templates.map((tpl, idx) => {
                  const activeColCount = tpl.columns.filter((c) => c.isVisible).length;
                  const formulaColCount = tpl.columns.filter((c) => c.mappingType === "formula").length;
                  return (
                    <tr key={tpl.id} className="group hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-4 text-center text-muted-foreground font-mono border-r border-border/30">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-foreground text-sm flex items-center gap-2">
                          {tpl.title}
                          {tpl.id === "sheet-tpl-1" && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                              Default Master
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{tpl.description}</span>
                          {formulaColCount > 0 && (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.2 rounded text-[10px] border border-purple-200 dark:border-purple-800">
                              <Calculator className="size-3" /> {formulaColCount} Formula {formulaColCount === 1 ? "Col" : "Cols"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-foreground/80 font-medium">{tpl.companyName}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            {tpl.employeeType}
                          </span>
                          {tpl.otType && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              {tpl.otType}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                          <Table className="size-3.5" />
                          {activeColCount} / {tpl.columns.length} Cols
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleTemplateStatus(tpl.id)}
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            tpl.isActive
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20"
                          }`}
                        >
                          {tpl.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTemplate(JSON.parse(JSON.stringify(tpl)));
                              setIsConfiguring(true);
                            }}
                            className="h-8 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="Configure Columns & Parameter Mappings"
                          >
                            <Settings className="size-3.5" /> Configure
                          </button>
                          <button
                            onClick={() => handleDuplicateTemplate(tpl)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Duplicate Template"
                          >
                            <Copy className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(tpl.id)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Template"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Column Configuration & Live Preview Mode */
        editingTemplate && (
          <div className="space-y-6">
            {/* Top Toolbar in Configuration Mode */}
            <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="size-5 text-primary" />
                  Configuring: {editingTemplate.title}
                </h2>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => {
                    setNewColLabelEng("");
                    setNewColLabelBng("");
                    setNewColMappingType("direct");
                    setIsAddColumnOpen(true);
                  }}
                  className="h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="size-4" /> Add Column
                </button>
                <button
                  onClick={handleRestoreDefaultColumns}
                  className="h-9 px-3.5 rounded-xl border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to standard default columns"
                >
                  <RotateCcw className="size-3.5" /> Restore Defaults
                </button>
                <button
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className={`h-9 px-3.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    showLivePreview
                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                      : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="size-3.5" />
                  {showLivePreview ? "Hide Live View" : "Show Live View"}
                </button>
                <button
                  onClick={() => {
                    setIsConfiguring(false);
                    setEditingTemplate(null);
                  }}
                  className="h-9 px-3.5 rounded-xl border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" /> Back to Templates
                </button>
                <button
                  onClick={handleSaveConfiguration}
                  className="h-9 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Save className="size-4" /> Save Configuration
                </button>
              </div>
            </div>

            {/* Main Editor: Columns Table */}
            <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-72 h-9 px-3 rounded-lg border border-border/60 bg-muted/10 flex items-center gap-2 text-xs">
                    <Search className="size-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search column, mapping, formula..."
                      value={columnSearch}
                      onChange={(e) => setColumnSearch(e.target.value)}
                      className="bg-transparent border-0 outline-none w-full text-foreground placeholder:text-muted-foreground text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Columns List / Table */}
              <div className="overflow-x-auto border border-border/40 rounded-xl">
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                  <thead className="bg-muted/40 text-muted-foreground uppercase font-bold tracking-wider text-[11px] border-b border-border/40">
                    <tr>
                      <th className="px-3 py-3 w-[50px] text-center">#</th>
                      <th className="px-3 py-3 w-[140px]">Section</th>
                      <th className="px-3 py-3 min-w-[150px]">English Label</th>
                      <th className="px-3 py-3 min-w-[140px]">বাংলা Label</th>
                      <th className="px-3 py-3 min-w-[300px]">Mapping & Formula</th>
                      <th className="px-2 py-3 text-center w-[85px]">Align</th>
                      <th className="px-2 py-3 text-center w-[75px]" title="Header Orientation">Header</th>
                      <th className="px-2 py-3 text-center w-[75px]" title="Cell Value Orientation">Value</th>
                      <th className="px-2 py-3 text-center w-[60px]">Show</th>
                      <th className="px-2 py-3 text-center w-[45px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground font-medium">
                    {filteredColumns.map((col) => {
                      const fullIndex = editingTemplate.columns.findIndex((c) => c.id === col.id);
                      const isFormula = col.mappingType === "formula";
                      return (
                        <tr
                          key={col.id}
                          className={`hover:bg-muted/30 transition-colors ${!col.isVisible ? "opacity-40 bg-muted/20" : ""}`}
                        >
                          {/* Order / Reorder */}
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-mono text-muted-foreground text-xs font-semibold w-5 text-center">
                                {fullIndex + 1}
                              </span>
                              <div className="flex flex-col -space-y-0.5 opacity-60 hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => handleMoveColumn(col.id, "up")}
                                  disabled={fullIndex === 0}
                                  className="text-muted-foreground hover:text-primary disabled:opacity-20 cursor-pointer p-0.5"
                                  title="Move Up"
                                >
                                  <ChevronUp className="size-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveColumn(col.id, "down")}
                                  disabled={fullIndex === editingTemplate.columns.length - 1}
                                  className="text-muted-foreground hover:text-primary disabled:opacity-20 cursor-pointer p-0.5"
                                  title="Move Down"
                                >
                                  <ChevronDown className="size-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Section / Category Dropdown */}
                          <td className="px-3 py-2">
                            <div className="w-[140px]">
                              <SearchableSelect
                                options={categoryOptions}
                                value={col.category}
                                onChange={(val) =>
                                  handleColumnUpdate(col.id, {
                                    category: val as SalarySheetColumn["category"],
                                  })
                                }
                                className="w-full h-8 text-xs font-medium"
                                placeholder="Section..."
                              />
                            </div>
                          </td>

                          {/* Label English */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={col.labelEng}
                              onChange={(e) => handleColumnUpdate(col.id, { labelEng: e.target.value })}
                              className="w-full h-8 px-2.5 rounded-lg border border-border/40 hover:border-border focus:border-primary/50 bg-muted/15 focus:bg-background font-semibold text-xs outline-none transition-all"
                              placeholder="e.g. Basic"
                            />
                          </td>

                          {/* Label Bengali */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={col.labelBng || ""}
                              onChange={(e) => handleColumnUpdate(col.id, { labelBng: e.target.value })}
                              className="w-full h-8 px-2.5 rounded-lg border border-border/40 hover:border-border focus:border-primary/50 bg-muted/15 focus:bg-background font-medium text-xs outline-none transition-all"
                              placeholder="e.g. মূল বেতন"
                            />
                          </td>

                          {/* Parameter Mapping & Math Formula Controls (Single Clean Line) */}
                          <td className="px-3 py-2">
                            {isFormula ? (
                              <div className="flex items-center gap-1.5 min-w-[300px]">
                                <button
                                  type="button"
                                  onClick={() => handleColumnUpdate(col.id, { mappingType: "direct" })}
                                  className="h-8 px-2.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-[11px] font-black flex items-center gap-1 hover:bg-purple-200 cursor-pointer shrink-0 transition-all shadow-2xs"
                                  title="Click to switch back to Single Parameter"
                                >
                                  <Calculator className="size-3" /> fx Formula
                                </button>
                                <div
                                  onClick={() => handleOpenFormulaModal(col)}
                                  className="flex-1 h-8 px-2.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 hover:border-purple-400 flex items-center justify-between gap-1.5 cursor-pointer transition-all min-w-0"
                                  title="Click to edit formula"
                                >
                                  <span className="font-mono text-xs font-bold text-purple-900 dark:text-purple-100 truncate">
                                    {col.formulaExpression || "sal_food + sal_conveyance"}
                                  </span>
                                  <span className="text-[10px] font-bold text-purple-600 bg-purple-200/60 dark:bg-purple-900/60 px-1.5 py-0.5 rounded shrink-0">
                                    Edit
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 min-w-[300px]">
                                <span className="h-8 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold flex items-center gap-1 shrink-0">
                                  <span className="size-1.5 rounded-full bg-emerald-500"></span> Field
                                </span>
                                <div className="flex-1 min-w-0">
                                  <SearchableSelect
                                    options={systemParamOptions}
                                    value={col.paramMapping}
                                    onChange={(newVal) => handleColumnUpdate(col.id, { paramMapping: newVal })}
                                    placeholder="Search parameter..."
                                    className="w-full h-8 text-xs font-semibold bg-background"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleColumnUpdate(col.id, {
                                      mappingType: "formula",
                                      formulaExpression: col.formulaExpression || col.paramMapping || "sal_basic",
                                    });
                                    handleOpenFormulaModal(col);
                                  }}
                                  className="h-8 px-2 rounded-lg border border-dashed border-border/80 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-muted-foreground hover:text-purple-600 text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                                  title="Switch to Formula Calculation"
                                >
                                  <Calculator className="size-3" /> +fx
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Alignment (Clean Icon Group) */}
                          <td className="px-2 py-2 text-center">
                            <div className="inline-flex rounded-lg border border-border/50 p-0.5 bg-muted/20">
                              <button
                                type="button"
                                onClick={() => handleColumnUpdate(col.id, { align: "left" })}
                                className={`p-1 rounded transition-colors ${
                                  col.align === "left"
                                    ? "bg-background text-primary shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                                title="Align Left"
                              >
                                <AlignLeft className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleColumnUpdate(col.id, { align: "center" })}
                                className={`p-1 rounded transition-colors ${
                                  col.align === "center"
                                    ? "bg-background text-primary shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                                title="Align Center"
                              >
                                <AlignCenter className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleColumnUpdate(col.id, { align: "right" })}
                                className={`p-1 rounded transition-colors ${
                                  col.align === "right"
                                    ? "bg-background text-primary shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                                title="Align Right"
                              >
                                <AlignRight className="size-3" />
                              </button>
                            </div>
                          </td>

                          {/* Header Orientation */}
                          <td className="px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleColumnUpdate(col.id, { isRotatedHeader: !col.isRotatedHeader })}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                                col.isRotatedHeader
                                  ? "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800"
                                  : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted"
                              }`}
                              title="Header Style: 90° Vertical vs Horizontal"
                            >
                              {col.isRotatedHeader ? "90° Vert" : "Horiz"}
                            </button>
                          </td>

                          {/* Cell Value Orientation */}
                          <td className="px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleColumnUpdate(col.id, { isRotatedValue: !col.isRotatedValue })}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                                col.isRotatedValue
                                  ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800"
                                  : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted"
                              }`}
                              title="Cell Value Style: 90° Vertical vs Horizontal"
                            >
                              {col.isRotatedValue ? "90° Vert" : "Horiz"}
                            </button>
                          </td>

                          {/* Visible Toggle */}
                          <td className="px-2 py-2 text-center">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={col.isVisible}
                                onChange={(e) => handleColumnUpdate(col.id, { isVisible: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </td>

                          {/* Delete Column Button */}
                          <td className="px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteColumn(col.id)}
                              className="size-7 rounded-lg border border-transparent hover:border-red-500/20 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                              title="Delete column"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Live Landscape Salary Sheet View ("ar view to already korai ache") */}
            {showLivePreview && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                        Live Sheet View
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Updates automatically as you add, delete, rename, reorder, or calculate formula columns
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mt-1 flex items-center gap-2">
                      <Table className="size-5 text-emerald-600" />
                      Landscape Salary Sheet Real-Time Preview
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Language Switch */}
                    <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/50 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPreviewLanguage("en")}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          previewLanguage === "en" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground"
                        }`}
                      >
                        English Headers
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewLanguage("bn")}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          previewLanguage === "bn" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground"
                        }`}
                      >
                        বাংলা হেডার
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="h-8 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="size-3.5" /> Print Sheet
                    </button>
                  </div>
                </div>

                {/* The Real Salary Sheet Landscape Canvas */}
                <div className="bg-white text-black p-4 sm:p-6 rounded-xl border border-slate-300 shadow-inner overflow-x-auto select-none font-sans">
                  <div className="w-fit min-w-[700px] mx-auto">
                    {/* Company Header Block */}
                    <div className="text-center pb-3 border-b border-black mb-3">
                      <h1 className="font-extrabold text-[15px] uppercase tracking-wider text-black">
                        {editingTemplate.companyName}
                      </h1>
                      <p className="text-[11px] font-bold text-neutral-800 uppercase mt-0.5">
                        {previewLanguage === "en"
                          ? `Monthly Salary Sheet & Wage Register — July, 2026 (${editingTemplate.employeeType})`
                          : `মাসিক বেতন বিবরণী ও মজুরি রেজিস্টার — জুলাই, ২০২৬ (${editingTemplate.employeeType})`}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-semibold text-neutral-600 mt-1.5 px-2">
                        <span>Unit: PSL Unit-01</span>
                        <span>Section: All Active Sections</span>
                        <span>Total Employees: {sampleEmployees.length}</span>
                        <span>Currency: BDT (৳)</span>
                      </div>
                    </div>

                    {/* Dynamic Table based on Active Columns */}
                    <table className="border-collapse border border-black text-[9px] text-center table-fixed mx-auto">
                      <colgroup>
                        {editingTemplate.columns
                          .filter((c) => c.isVisible)
                          .map((col) => {
                            const w = getEffectiveColumnWidth(col);
                            return <col key={col.id} style={{ width: w, minWidth: w, maxWidth: w }} />;
                          })}
                      </colgroup>
                      <thead className="bg-slate-100 text-black border-b border-black">
                        <tr>
                          {editingTemplate.columns
                            .filter((c) => c.isVisible)
                            .map((col) => {
                              const headerTitle =
                                previewLanguage === "bn" && col.labelBng ? col.labelBng : col.labelEng;
                              const isRot = col.isRotatedHeader;
                              const colW = getEffectiveColumnWidth(col);
                              const isNarrow = parseInt(colW) <= 30;
                              return (
                                <th
                                  key={col.id}
                                  style={{
                                    width: colW,
                                    minWidth: colW,
                                    maxWidth: colW,
                                  }}
                                  className={`border border-black font-extrabold uppercase ${
                                    isNarrow ? "px-0 py-1 overflow-hidden" : "px-1 py-1.5"
                                  } ${isRot ? "h-[70px] align-middle" : "align-middle"}`}
                                >
                                  {isRot ? (
                                    <div
                                      style={{
                                        writingMode: "vertical-rl",
                                        transform: "rotate(180deg)",
                                        whiteSpace: "nowrap",
                                        margin: "0 auto",
                                        lineHeight: 1,
                                        fontSize: "7.5px",
                                        display: "block",
                                        width: "fit-content",
                                      }}
                                    >
                                      {headerTitle}
                                    </div>
                                  ) : (
                                    <span className="text-[8px] tracking-tight">{headerTitle}</span>
                                  )}
                                </th>
                              );
                            })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black text-[8px] font-medium text-black">
                        {sampleEmployees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                            {editingTemplate.columns
                              .filter((c) => c.isVisible)
                              .map((col) => {
                                const isValRot = col.isRotatedValue;
                                const colW = getEffectiveColumnWidth(col);
                                const isNarrow = parseInt(colW) <= 30;
                                return (
                                  <td
                                    key={col.id}
                                    style={{
                                      width: colW,
                                      minWidth: colW,
                                      maxWidth: colW,
                                    }}
                                    className={`border border-black ${
                                      isNarrow
                                        ? "px-0 py-0.5 overflow-hidden align-middle"
                                        : "px-1 py-1 align-middle"
                                    } ${
                                      col.align === "left"
                                        ? "text-left"
                                        : col.align === "right"
                                        ? "text-right font-mono"
                                        : "text-center font-mono"
                                    }`}
                                  >
                                    {isValRot ? (
                                      <div
                                        style={{
                                          writingMode: "vertical-rl",
                                          transform: "rotate(180deg)",
                                          whiteSpace: "nowrap",
                                          margin: "0 auto",
                                          lineHeight: 1,
                                          fontSize: "7.5px",
                                          display: "block",
                                          width: "fit-content",
                                        }}
                                      >
                                        {getCellValue(emp, col)}
                                      </div>
                                    ) : (
                                      getCellValue(emp, col)
                                    )}
                                  </td>
                                );
                              })}
                          </tr>
                        ))}
                      </tbody>

                      {/* Summary Totals Row */}
                      <tfoot className="bg-slate-100 font-bold text-black border-t-2 border-black text-[8px]">
                        <tr>
                          {editingTemplate.columns
                            .filter((c) => c.isVisible)
                            .map((col, cIdx) => {
                              const isValRot = col.isRotatedValue;
                              const colW = getEffectiveColumnWidth(col);
                              const isNarrow = parseInt(colW) <= 30;

                              if (cIdx === 0) {
                                return (
                                  <td
                                    key={col.id}
                                    style={{
                                      width: colW,
                                      minWidth: colW,
                                      maxWidth: colW,
                                    }}
                                    className={`border border-black px-0.5 py-1 text-center font-black ${
                                      isNarrow ? "overflow-hidden align-middle" : "align-middle"
                                    }`}
                                  >
                                    {isValRot ? (
                                      <div
                                        style={{
                                          writingMode: "vertical-rl",
                                          transform: "rotate(180deg)",
                                          whiteSpace: "nowrap",
                                          margin: "0 auto",
                                          lineHeight: 1,
                                          fontSize: "7.5px",
                                          display: "block",
                                          width: "fit-content",
                                        }}
                                      >
                                        TOTAL
                                      </div>
                                    ) : (
                                      "TOTAL"
                                    )}
                                  </td>
                                );
                              }
                              if (col.paramMapping === "emp_id_name") {
                                return (
                                  <td
                                    key={col.id}
                                    style={{
                                      width: colW,
                                      minWidth: colW,
                                      maxWidth: colW,
                                    }}
                                    className="border border-black px-1.5 py-1 text-left font-black align-middle"
                                  >
                                    {sampleEmployees.length} Records
                                  </td>
                                );
                              }
                              return (
                                <td
                                  key={col.id}
                                  style={{
                                    width: colW,
                                    minWidth: colW,
                                    maxWidth: colW,
                                  }}
                                  className={`border border-black font-mono font-bold ${
                                    isNarrow
                                      ? "px-0 py-0.5 overflow-hidden align-middle"
                                      : "px-1 py-1 align-middle"
                                  } ${
                                    col.align === "left"
                                      ? "text-left"
                                      : col.align === "right"
                                      ? "text-right"
                                      : "text-center"
                                  }`}
                                >
                                  {isValRot ? (
                                    <div
                                      style={{
                                        writingMode: "vertical-rl",
                                        transform: "rotate(180deg)",
                                        whiteSpace: "nowrap",
                                        margin: "0 auto",
                                        lineHeight: 1,
                                        fontSize: "7.5px",
                                        display: "block",
                                        width: "fit-content",
                                      }}
                                    >
                                      {getColumnFooterTotal(col)}
                                    </div>
                                  ) : (
                                    getColumnFooterTotal(col)
                                  )}
                                </td>
                              );
                            })}
                        </tr>
                      </tfoot>
                    </table>

                    {/* Signatures Footer */}
                    <div className="grid grid-cols-4 gap-6 pt-10 text-[9px] font-bold text-neutral-800 text-center uppercase">
                      <div className="border-t border-black pt-1">Prepared By</div>
                      <div className="border-t border-black pt-1">Checked By</div>
                      <div className="border-t border-black pt-1">Head of HR</div>
                      <div className="border-t border-black pt-1">Managing Director</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Modal: Mathematical Formula Builder */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-3xl sm:max-w-4xl w-full shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Calculator className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Formula Builder</h3>
                  <p className="text-xs text-muted-foreground">Configure mathematical calculation for this column</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormulaModalOpen(false)}
                className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Formula Expression Input Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Formula Expression</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setModalFormulaExpr((prev) => {
                          const trimmed = prev.trim();
                          const tokens = trimmed.split(/\s+/);
                          if (tokens.length <= 1) return "";
                          tokens.pop();
                          return tokens.join(" ");
                        });
                      }}
                      className="text-[11px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded border border-border/50 hover:bg-muted cursor-pointer transition-colors"
                    >
                      ⌫ Backspace
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalFormulaExpr("")}
                      className="text-[11px] text-rose-600 hover:text-rose-700 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={modalFormulaExpr}
                  onChange={(e) => setModalFormulaExpr(e.target.value)}
                  placeholder="e.g. sal_food + sal_conveyance"
                  className="w-full h-12 px-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/30 font-mono text-sm font-bold focus:ring-2 focus:ring-purple-500/20 outline-none text-purple-950 dark:text-purple-100"
                />
                {modalFormulaExpr && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                    <Sparkles className="size-3.5 text-purple-500 shrink-0" />
                    <span className="font-semibold text-foreground/70">Preview:</span>
                    <span className="font-medium text-foreground">{formatFormulaHumanReadable(modalFormulaExpr)}</span>
                  </div>
                )}
              </div>

              {/* Math Operators - Only Signs */}
              <div>
                <span className="text-xs font-semibold text-foreground/80 block mb-1.5">Operators</span>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { label: "+", val: " + " },
                    { label: "-", val: " - " },
                    { label: "×", val: " * " },
                    { label: "÷", val: " / " },
                    { label: "(", val: " ( " },
                    { label: ")", val: " ) " },
                  ].map((op) => (
                    <button
                      key={op.label}
                      type="button"
                      onClick={() => setModalFormulaExpr((prev) => `${prev.trim()}${op.val}`)}
                      className="h-10 rounded-xl border border-border/70 hover:border-purple-400 bg-muted/20 hover:bg-purple-50 dark:hover:bg-purple-950/50 font-mono font-bold text-base flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 text-foreground"
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Parameters to Insert with Real-Time Search */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground/80">
                    Available Parameters ({filteredModalParams.length})
                  </span>
                  <div className="w-64 h-8 px-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center gap-1.5 text-xs">
                    <Search className="size-3.5 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      placeholder="Search parameters (e.g. food, basic)..."
                      value={modalParamSearch}
                      onChange={(e) => setModalParamSearch(e.target.value)}
                      className="bg-transparent border-0 outline-none w-full text-xs placeholder:text-muted-foreground text-foreground"
                    />
                    {modalParamSearch && (
                      <button
                        type="button"
                        onClick={() => setModalParamSearch("")}
                        className="text-muted-foreground hover:text-foreground text-[10px] cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-3 border border-border/50 rounded-xl bg-muted/10">
                  {filteredModalParams.length === 0 ? (
                    <div className="text-xs text-muted-foreground p-3 w-full text-center">
                      No parameter matching "{modalParamSearch}"
                    </div>
                  ) : (
                    filteredModalParams.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => {
                          setModalFormulaExpr((prev) => {
                            const trimmed = prev.trim();
                            if (!trimmed) return p.key;
                            const lastChar = trimmed[trimmed.length - 1];
                            if (["+", "-", "*", "/", "("].includes(lastChar)) {
                              return `${trimmed} ${p.key}`;
                            }
                            return `${trimmed} + ${p.key}`;
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-border/60 bg-background hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/40 text-xs font-semibold text-foreground/85 hover:text-purple-700 dark:hover:text-purple-300 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
                      >
                        {p.nameEng.split(" (")[0]}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Live Preview Evaluation on Sample Employees */}
              {modalEvaluationPreview && (
                <div className="p-3.5 bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Live Sample Evaluation
                    </span>
                    <span className="font-mono text-purple-700 dark:text-purple-300 font-extrabold text-[11px]">
                      Valid Expression
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-muted-foreground text-xs truncate">{modalEvaluationPreview.emp1Name}</span>
                      <span className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-400">
                        ৳{modalEvaluationPreview.emp1Val.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-muted-foreground text-xs truncate">{modalEvaluationPreview.emp4Name}</span>
                      <span className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-400">
                        ৳{modalEvaluationPreview.emp4Val.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/60 font-semibold hover:bg-muted text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFormulaModal}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                >
                  Save Formula
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Salary Sheet Template */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-primary" />
                New Salary Sheet Template
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="size-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-foreground/80 block mb-1">
                  Template Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Factory Worker Monthly Register"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/60 bg-muted/10 font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground/80 block mb-1">Target Company</label>
                <SearchableSelect
                  options={companyOptions}
                  value={newCompany}
                  onChange={(val) => setNewCompany(val)}
                  className="w-full h-9 text-xs font-semibold"
                  placeholder="Select company..."
                />
              </div>

              <div>
                <label className="font-semibold text-foreground/80 block mb-1">Employee Type</label>
                <SearchableSelect
                  options={empTypeOptions}
                  value={newEmpType}
                  onChange={(val) => setNewEmpType(val)}
                  className="w-full h-9 text-xs font-semibold"
                  placeholder="Select employee type..."
                />
              </div>

              {newEmpType === "Worker" && (
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">OT Setup Type</label>
                  <SearchableSelect
                    options={otTypeOptions}
                    value={newOtType}
                    onChange={(val) => setNewOtType(val)}
                    className="w-full h-9 text-xs font-semibold"
                    placeholder="Select OT type..."
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/60 font-semibold hover:bg-muted text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-sm cursor-pointer"
                >
                  Create & Configure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Custom Column (Direct or Formula) */}
      {isAddColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-2xl sm:max-w-3xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Plus className="size-5 text-sky-600" />
                  Add Column to Salary Sheet
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Define header labels, and map to either a direct parameter or a mathematical formula.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddColumnOpen(false)}
                className="size-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomColumn} className="space-y-4 text-xs">
              {/* Mapping Mode Switch: Direct vs Math Formula */}
              <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/50 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setNewColMappingType("direct")}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                    newColMappingType === "direct" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground"
                  }`}
                >
                  Single Field Parameter
                </button>
                <button
                  type="button"
                  onClick={() => setNewColMappingType("formula")}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    newColMappingType === "formula" ? "bg-purple-600 text-white shadow-2xs" : "text-muted-foreground hover:text-purple-600"
                  }`}
                >
                  <Calculator className="size-3.5" /> Calculated Formula
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Column Label (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Other Allowance"
                    value={newColLabelEng}
                    onChange={(e) => setNewColLabelEng(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-border/60 bg-muted/10 font-bold text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Column Label (বাংলা)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. অন্যান্য ভাতা"
                    value={newColLabelBng}
                    onChange={(e) => setNewColLabelBng(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-border/60 bg-muted/10 font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Category / Section</label>
                  <SearchableSelect
                    options={categoryOptions}
                    value={newColCategory}
                    onChange={(val) => setNewColCategory(val as SalarySheetColumn["category"])}
                    className="w-full h-9 text-xs font-semibold"
                    placeholder="Select Section..."
                  />
                </div>

                {newColMappingType === "direct" && (
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">System Parameter</label>
                    <SearchableSelect
                      options={systemParamOptions}
                      value={newColParamMapping}
                      onChange={(val) => setNewColParamMapping(val)}
                      className="w-full h-9 text-xs font-semibold"
                      placeholder="Search parameter..."
                    />
                  </div>
                )}
              </div>

              {/* Formula input when in formula mode */}
              {newColMappingType === "formula" && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-purple-900 dark:text-purple-200 text-[11px] flex items-center gap-1.5">
                      <Calculator className="size-3.5" />
                      Formula Expression (e.g. sal_food + sal_conveyance)
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={newColFormula}
                    onChange={(e) => setNewColFormula(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-purple-900 dark:text-purple-100 outline-none"
                    placeholder="sal_food + sal_conveyance"
                  />
                  <div className="text-[10.5px] text-purple-700 dark:text-purple-300">
                    Preview: {formatFormulaHumanReadable(newColFormula)}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Alignment</label>
                  <select
                    value={newColAlign}
                    onChange={(e) => setNewColAlign(e.target.value as "left" | "center" | "right")}
                    className="w-full h-9 px-3 rounded-xl border border-border/60 bg-background font-semibold text-xs cursor-pointer"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Header Style</label>
                  <select
                    value={newColRotated ? "vertical" : "horizontal"}
                    onChange={(e) => setNewColRotated(e.target.value === "vertical")}
                    className="w-full h-9 px-3 rounded-xl border border-border/60 bg-background font-semibold text-xs cursor-pointer"
                  >
                    <option value="vertical">Vertical (90°)</option>
                    <option value="horizontal">Horizontal</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Value Style</label>
                  <select
                    value={newColValueRotated ? "vertical" : "horizontal"}
                    onChange={(e) => setNewColValueRotated(e.target.value === "vertical")}
                    className="w-full h-9 px-3 rounded-xl border border-border/60 bg-background font-semibold text-xs cursor-pointer"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical (90°)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Column Width</label>
                  <input
                    type="text"
                    value={newColWidth}
                    onChange={(e) => setNewColWidth(e.target.value)}
                    placeholder="e.g. 65px"
                    className="w-full h-9 px-3 rounded-xl border border-border/60 bg-muted/10 font-mono text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsAddColumnOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/60 font-semibold hover:bg-muted text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Add Column
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
