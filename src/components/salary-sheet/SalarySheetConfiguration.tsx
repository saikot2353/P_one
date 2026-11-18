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
  Building2,
  Split,
  Briefcase,
  ArrowUpDown,
  ArrowDownAZ,
  ArrowUpZA,
  Users,
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
    | "none"
    | "employee_info"
    | "salary_breakdown"
    | "attendance"
    | "deduction"
    | "overtime"
    | "bonus"
    | "summary_signature";
  paramMapping: string;
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
  groupBy?: "department" | "section";
  sortMode?: "designation" | "alphabetical";
  alphabeticalOrder?: "asc" | "desc";
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
  { key: "ded_advance", nameEng: "Salary Advance Deduction", nameBng: "অগ্রিম বেতন কর্তন", category: "deduction", sampleValue: 5000, format: "currency" },
  { key: "ded_loan", nameEng: "Loan / Installment Deduction", nameBng: "ঋণ কর্তন", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_tax", nameEng: "Income Tax (TDS)", nameBng: "উৎস কর (আয়কর)", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_stamp", nameEng: "Revenue Stamp (৳10)", nameBng: "রেভিনিউ স্ট্যাম্প (৳১০)", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_lunch", nameEng: "Lunch / Canteen Deduction", nameBng: "লাঞ্চ কর্তন", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_wagely", nameEng: "Wagely / Instant Advance", nameBng: "ওয়েজলি অগ্রিম", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_adjust", nameEng: "Adjustment Deduction", nameBng: "সমন্বয় কর্তন", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_fair_shop", nameEng: "Fair Price Shop Deduction", nameBng: "ন্যায্য দোকান কর্তন", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_provident_fund", nameEng: "Provident Fund (PF)", nameBng: "ভবিষ্য তহবিল (PF)", category: "deduction", sampleValue: 0, format: "currency" },
  { key: "ded_total", nameEng: "Total Deductions", nameBng: "মোট কর্তন", category: "deduction", sampleValue: 5000, format: "currency" },

  // Overtime
  { key: "ot_hour", nameEng: "OT Hours Worked", nameBng: "ওভারটাইম ঘণ্টা", category: "overtime", sampleValue: 0, format: "number" },
  { key: "ot_rate", nameEng: "OT Hourly Rate", nameBng: "ওভারটাইম হার", category: "overtime", sampleValue: 0, format: "currency" },
  { key: "ot_pay", nameEng: "Total Overtime Pay", nameBng: "মোট ওভারটাইম", category: "overtime", sampleValue: 0, format: "currency" },
  { key: "ot_extra_hour", nameEng: "Extra / Friday OT Hours", nameBng: "অতিরিক্ত OT ঘণ্টা", category: "overtime", sampleValue: 0, format: "number" },

  // Bonuses & Allowances
  { key: "bonus_festival", nameEng: "Festival / Eid Bonus", nameBng: "উৎসব বোনাস", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "alw_holiday", nameEng: "Holiday Allowance", nameBng: "ছুটির ভাতা", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "alw_arrear", nameEng: "Alw + Arrear / Previous Due", nameBng: "বকেয়া ভাতা", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "alw_tiffin", nameEng: "Tiffin Bill", nameBng: "টিফিন বিল", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "alw_night", nameEng: "Night Bill", nameBng: "নাইট বিল", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "bonus_behavior", nameEng: "Behavior / Compliance Bonus", nameBng: "আচরণ বোনাস", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "bonus_attendance", nameEng: "Attendance Bonus", nameBng: "উপস্থিতি বোনাস", category: "bonus", sampleValue: 0, format: "currency" },
  { key: "bonus_production", nameEng: "Production Incentive", nameBng: "উৎপাদন বোনাস", category: "bonus", sampleValue: 0, format: "currency" },

  // Summary & Signatures
  { key: "net_pay", nameEng: "Net Payable Salary", nameBng: "প্রদেয় নিট বেতন", category: "summary_signature", sampleValue: 16200, format: "currency" },
  { key: "pay_bank", nameEng: "Bank Pay (Disbursement)", nameBng: "ব্যাংক পে", category: "summary_signature", sampleValue: 16200, format: "currency" },
  { key: "pay_cash", nameEng: "Cash Pay (Disbursement)", nameBng: "নগদ পে", category: "summary_signature", sampleValue: 0, format: "currency" },
  { key: "col_signature", nameEng: "Employee Signature / Thumbprint", nameBng: "স্বাক্ষর বা টিপসই", category: "summary_signature", sampleValue: "", format: "signature" },
  { key: "col_remarks", nameEng: "Remarks / Bank Status", nameBng: "মন্তব্য", category: "summary_signature", sampleValue: "Paid", format: "text" },
  { key: "custom_param", nameEng: "Custom / Calculated Formula", nameBng: "কাস্টম / হিসাবকৃত সূত্র", category: "summary_signature", sampleValue: "-", format: "text" },
];

export const CATEGORY_LABELS: Record<SalarySheetColumn["category"], { label: string; bng: string; color: string; badge: string }> = {
  none: { label: "None (No Section)", bng: "কোন সেকশন নেই", color: "text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700", badge: "bg-slate-500" },
  employee_info: { label: "Employee Info", bng: "কর্মচারী বিবরণ", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900", badge: "bg-blue-500" },
  salary_breakdown: { label: "Salary Breakdown", bng: "বেতনের বিবরণ", color: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900", badge: "bg-emerald-500" },
  attendance: { label: "Attendance", bng: "উপস্থিতি", color: "text-amber-700 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900", badge: "bg-amber-500" },
  deduction: { label: "Deduction", bng: "কর্তনসমূহ", color: "text-rose-700 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900", badge: "bg-rose-500" },
  overtime: { label: "Overtime", bng: "ওভারটাইম", color: "text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900", badge: "bg-indigo-500" },
  bonus: { label: "Bonuses & Allowances", bng: "বোনাস ও অতিরিক্ত", color: "text-purple-700 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900", badge: "bg-purple-500" },
  summary_signature: { label: "Net Pay & Signature", bng: "নিট বেতন ও স্বাক্ষর", color: "text-slate-800 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700", badge: "bg-slate-600" },
};


export const DEFAULT_SALARY_SHEET_COLUMNS: SalarySheetColumn[] = [
  // 1. Employee Info (No Section / Standalone)
  { id: "col-1", key: "sl", labelEng: "SL", labelBng: "নং", category: "none", paramMapping: "emp_sl", align: "center", width: "24px", isVisible: true, format: "number" },
  { id: "col-2", key: "emp_card", labelEng: "ID & Name", labelBng: "আইডি ও নাম", category: "none", paramMapping: "emp_id_name", align: "left", width: "135px", isVisible: true, format: "text" },

  // 2. Salary Breakdown (Section)
  { id: "col-3", key: "basic", labelEng: "Basic", labelBng: "মূল বেতন", category: "salary_breakdown", paramMapping: "sal_basic", align: "right", width: "48px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-4", key: "house_rent", labelEng: "House Rent", labelBng: "বাড়ি ভাড়া", category: "salary_breakdown", paramMapping: "sal_house_rent", align: "right", width: "48px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-5", key: "medical", labelEng: "Medical", labelBng: "চিকিৎসা", category: "salary_breakdown", paramMapping: "sal_medical", align: "right", width: "46px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-6", key: "food", labelEng: "Food", labelBng: "খাদ্য", category: "salary_breakdown", paramMapping: "sal_food", align: "right", width: "42px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-7", key: "conveyance", labelEng: "Conveyance", labelBng: "যাতায়াত", category: "salary_breakdown", paramMapping: "sal_conveyance", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-8", key: "gross", labelEng: "Gross", labelBng: "মোট বেতন", category: "salary_breakdown", paramMapping: "sal_gross", align: "right", width: "52px", isRotatedHeader: true, isVisible: true, format: "currency" },

  // 3. Attendance (Section)
  { id: "col-9", key: "total_day", labelEng: "Working Day", labelBng: "কার্যদিবস", category: "attendance", paramMapping: "att_total_day", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-10", key: "holiday", labelEng: "Holiday", labelBng: "ছুটি", category: "attendance", paramMapping: "att_holiday", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-11", key: "present", labelEng: "Present", labelBng: "উপস্থিত", category: "attendance", paramMapping: "att_present", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-12", key: "cl", labelEng: "CL", labelBng: "নৈমিত্তিক", category: "attendance", paramMapping: "att_leave_cl", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-13", key: "sl", labelEng: "SL", labelBng: "পীড়া", category: "attendance", paramMapping: "att_leave_sl", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-14", key: "el", labelEng: "EL", labelBng: "অর্জিত", category: "attendance", paramMapping: "att_leave_el", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-15", key: "ml", labelEng: "ML", labelBng: "প্রসূতি", category: "attendance", paramMapping: "att_leave_ml", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-16", key: "absent", labelEng: "Absent", labelBng: "অনুপস্থিত", category: "attendance", paramMapping: "att_absent", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },

  // 4. Deduction (Section)
  { id: "col-17", key: "abs_deduc", labelEng: "Absent Deduct", labelBng: "অনুপস্থিত কর্তন", category: "deduction", paramMapping: "ded_absent", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-18", key: "advance", labelEng: "Advance", labelBng: "অগ্রিম", category: "deduction", paramMapping: "ded_advance", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-19", key: "loan", labelEng: "Loan", labelBng: "ঋণ", category: "deduction", paramMapping: "ded_loan", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-20", key: "tax", labelEng: "Tax", labelBng: "আয়কর", category: "deduction", paramMapping: "ded_tax", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-21", key: "rev_stamp", labelEng: "Revenue Stamp", labelBng: "স্ট্যাম্প", category: "deduction", paramMapping: "ded_stamp", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-22", key: "lunch", labelEng: "Lunch Deduct", labelBng: "লাঞ্চ কর্তন", category: "deduction", paramMapping: "ded_lunch", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-23", key: "wagely_ad", labelEng: "Wagely", labelBng: "ওয়েজলি", category: "deduction", paramMapping: "ded_wagely", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-24", key: "adjust", labelEng: "Adjust", labelBng: "সমন্বয়", category: "deduction", paramMapping: "ded_adjust", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-25", key: "fair_shop", labelEng: "Fair Shop", labelBng: "দোকান", category: "deduction", paramMapping: "ded_fair_shop", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },

  // 5. Pay Salary (Standalone - No Section)
  { id: "col-26", key: "pay_salary", labelEng: "Pay Salary", labelBng: "প্রদেয় বেতন", category: "none", paramMapping: "sal_payable_salary", align: "right", width: "52px", isRotatedHeader: true, isVisible: true, format: "currency" },

  // 6. Overtime (Section)
  { id: "col-27", key: "ot_hour", labelEng: "OT Hour", labelBng: "OT ঘণ্টা", category: "overtime", paramMapping: "ot_hour", align: "center", width: "24px", isRotatedHeader: true, isVisible: true, format: "number" },
  { id: "col-28", key: "ot_rate", labelEng: "OT Rate", labelBng: "OT হার", category: "overtime", paramMapping: "ot_rate", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-29", key: "ot_pay", labelEng: "OT Pay", labelBng: "মোট OT", category: "overtime", paramMapping: "ot_pay", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },

  // 7. Bonuses & Allowances (Section)
  { id: "col-30", key: "festival_bonus", labelEng: "Festival Bonus", labelBng: "উৎসব বোনাস", category: "bonus", paramMapping: "bonus_festival", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-31", key: "holiday_alw", labelEng: "Holiday Allowance", labelBng: "ছুটির ভাতা", category: "bonus", paramMapping: "alw_holiday", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-32", key: "alw_arrear", labelEng: "Alw+Arrear", labelBng: "বকেয়া ভাতা", category: "bonus", paramMapping: "alw_arrear", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-33", key: "tiffin", labelEng: "Tiffin", labelBng: "টিফিন", category: "bonus", paramMapping: "alw_tiffin", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-34", key: "night_bill", labelEng: "Night Bill", labelBng: "নাইট বিল", category: "bonus", paramMapping: "alw_night", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-35", key: "behavior_bonus", labelEng: "Behavior Bonus", labelBng: "আচরণ বোনাস", category: "bonus", paramMapping: "bonus_behavior", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-36", key: "att_bonus", labelEng: "Attendance bonus", labelBng: "হাজিরা বোনাস", category: "bonus", paramMapping: "bonus_attendance", align: "right", width: "44px", isRotatedHeader: true, isVisible: true, format: "currency" },

  // 8. Net Pay, Bank Pay, Cash Pay & Signature (Standalone - No Section)
  { id: "col-37", key: "net_pay", labelEng: "Net Pay", labelBng: "নিট প্রদেয়", category: "none", paramMapping: "net_pay", align: "right", width: "56px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-38", key: "bank_pay", labelEng: "Bank Pay", labelBng: "ব্যাংক পে", category: "none", paramMapping: "pay_bank", align: "right", width: "54px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-39", key: "cash_pay", labelEng: "Cash Pay", labelBng: "নগদ পে", category: "none", paramMapping: "pay_cash", align: "right", width: "46px", isRotatedHeader: true, isVisible: true, format: "currency" },
  { id: "col-40", key: "signature", labelEng: "Signature", labelBng: "স্বাক্ষর", category: "none", paramMapping: "col_signature", align: "center", width: "85px", isRotatedHeader: true, isVisible: true, format: "signature" },
];

export const DEFAULT_SALARY_SHEET_TEMPLATES: SalarySheetTemplate[] = [
  {
    id: "sheet-tpl-1",
    title: "Standard Full Landscape Salary",
    companyName: "Pakiza Software Limited",
    employeeType: "OFFICE STAFF",
    otType: "2hrs OT",
    isActive: true,
    groupBy: "department",
    sortMode: "designation",
    alphabeticalOrder: "asc",
    description: "Standard compliant factory salary sheet with full breakdown, attendance matrix, OT calculation, and stamp deductions.",
    columns: DEFAULT_SALARY_SHEET_COLUMNS,
  },
  {
    id: "sheet-tpl-2",
    title: "Office Executive & Management Salary Sheet",
    companyName: "Pakiza Software Limited",
    employeeType: "Office Executive",
    isActive: true,
    groupBy: "department",
    sortMode: "designation",
    alphabeticalOrder: "asc",
    description: "Corporate office executive monthly salary register with bank transfer and income tax columns.",
    columns: DEFAULT_SALARY_SHEET_COLUMNS.filter((c) => !["ot_hour", "ot_rate", "ot_pay"].includes(c.key)),
  },
  {
    id: "sheet-tpl-3",
    title: "Compact Compliance Audit Salary Sheet",
    companyName: "Pakiza Knit Composite Ltd",
    employeeType: "All Categories",
    isActive: false,
    groupBy: "section",
    sortMode: "alphabetical",
    alphabeticalOrder: "asc",
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
  const [newGroupBy, setNewGroupBy] = useState<"department" | "section">("department");
  const [newSortMode, setNewSortMode] = useState<"designation" | "alphabetical">("designation");
  const [newAlphaOrder, setNewAlphaOrder] = useState<"asc" | "desc">("asc");

  // Live preview group filter
  const [previewGroupFilter, setPreviewGroupFilter] = useState<string>("all");

  // Add column modal
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColLabelEng, setNewColLabelEng] = useState("");
  const [newColLabelBng, setNewColLabelBng] = useState("");
  const [newColCategory, setNewColCategory] = useState<SalarySheetColumn["category"]>("none");
  const [newColParamMapping, setNewColParamMapping] = useState("sal_basic");
  const [newColAlign, setNewColAlign] = useState<"left" | "center" | "right">("center");
  const [newColRotated, setNewColRotated] = useState(true);
  const [newColValueRotated, setNewColValueRotated] = useState(false);
  const [newColWidth, setNewColWidth] = useState("48px");

  // Options for SearchableSelect
  const systemParamOptions: Option[] = useMemo(() => {
    return SYSTEM_PARAMETERS.map((p) => ({
      value: p.key,
      label: `${p.nameEng} (${p.nameBng})`,
    }));
  }, []);

  const categoryOptions: Option[] = useMemo(() => {
    return [
      { value: "none", label: "None (No Section / Standalone)" },
      ...Object.entries(CATEGORY_LABELS)
        .filter(([k]) => k !== "none")
        .map(([k, v]) => ({
          value: k,
          label: v.label,
        })),
    ];
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

  // Filter & Search inside Column Editor
  const [columnSearch, setColumnSearch] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");

  // Interactive Live Preview Controls
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "bn">("en");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("salary_sheet_templates_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const upgraded = Array.isArray(parsed)
          ? parsed.map((t: SalarySheetTemplate) => {
              const baseT = {
                ...t,
                groupBy: t.groupBy || "department",
                sortMode: t.sortMode || "designation",
                alphabeticalOrder: t.alphabeticalOrder || "asc",
              };
              if (t.id === "sheet-tpl-1") {
                return {
                  ...baseT,
                  title: "Standard Full Landscape Salary",
                  employeeType: t.employeeType || "OFFICE STAFF",
                  columns:
                    t.columns.length < 35
                      ? JSON.parse(JSON.stringify(DEFAULT_SALARY_SHEET_COLUMNS))
                      : t.columns,
                };
              }
              return baseT;
            })
          : DEFAULT_SALARY_SHEET_TEMPLATES;
        setTemplates(upgraded);
        localStorage.setItem("salary_sheet_templates_data", JSON.stringify(upgraded));
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
      groupBy: newGroupBy,
      sortMode: newSortMode,
      alphabeticalOrder: newAlphaOrder,
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

  const handleUpdateGrouping = (groupBy: "department" | "section") => {
    if (!editingTemplate) return;
    const updated = { ...editingTemplate, groupBy };
    setEditingTemplate(updated);
    const updatedTemplates = templates.map((t) => (t.id === updated.id ? updated : t));
    saveTemplates(updatedTemplates);
    toast.success(`Sheet grouping set to ${groupBy === "department" ? "Department-Wise" : "Section-Wise"}`);
  };

  const handleUpdateSortMode = (sortMode: "designation" | "alphabetical") => {
    if (!editingTemplate) return;
    const updated = { ...editingTemplate, sortMode };
    setEditingTemplate(updated);
    const updatedTemplates = templates.map((t) => (t.id === updated.id ? updated : t));
    saveTemplates(updatedTemplates);
    toast.success(`Employee sorting set to ${sortMode === "designation" ? "Designation-Wise" : "Alphabetical"}`);
  };

  const handleUpdateAlphaOrder = (alphabeticalOrder: "asc" | "desc") => {
    if (!editingTemplate) return;
    const updated = { ...editingTemplate, alphabeticalOrder };
    setEditingTemplate(updated);
    const updatedTemplates = templates.map((t) => (t.id === updated.id ? updated : t));
    saveTemplates(updatedTemplates);
    toast.success(`Alphabetical order set to ${alphabeticalOrder === "asc" ? "Ascending (A-Z)" : "Descending (Z-A)"}`);
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
      paramMapping: newColParamMapping,
      align: newColAlign,
      width: newColWidth.trim() || "48px",
      isRotatedHeader: newColRotated,
      isRotatedValue: newColValueRotated,
      isVisible: true,
      format: paramDef?.format || "currency",
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
      const matchCategory = activeCategoryTab === "all" || c.category === activeCategoryTab;
      if (!matchCategory) return false;

      const matchSearch =
        !columnSearch.trim() ||
        c.labelEng.toLowerCase().includes(columnSearch.toLowerCase()) ||
        (c.labelBng && c.labelBng.includes(columnSearch)) ||
        c.paramMapping.toLowerCase().includes(columnSearch.toLowerCase());
      return matchSearch;
    });
  }, [editingTemplate, columnSearch, activeCategoryTab]);

  // Mock employee values for real-time live interactive salary sheet view matching factory register
  const sampleEmployees = useMemo(() => {
    return [
      {
        serialNo: 1,
        id: "2019013884",
        officeId: "2019013884",
        name: "Javed Mia",
        designation: "Helper (Cook)",
        grade: "None",
        department: "HR, Admin and Compliance",
        section: "Canteen & Support",
        unit: "ALL",
        line: "ALL",
        joinDate: "12/01/2019",
        bankAcc: "1501203498810001",
        basic: 12720,
        houseRent: 6360,
        medical: 1272,
        food: 0,
        conveyance: 848,
        gross: 21200,
        totalDay: 23,
        holiday: 8,
        present: 20,
        cl: 3,
        sl: 0,
        el: 0,
        ml: 0,
        absent: 0,
        absDeduc: 0,
        advance: 5000,
        loan: 0,
        tax: 0,
        revStamp: 0,
        lunch: 0,
        wagelyAd: 0,
        adjust: 0,
        fairShop: 0,
        payableSalary: 16200,
        otHour: 0,
        otRate: 0,
        otPay: 0,
        festivalBonus: 0,
        holidayAllowance: 0,
        alwArrear: 0,
        tiffin: 0,
        nightBill: 0,
        behaviorBonus: 0,
        attendanceBonus: 0,
        netPay: 16200,
        bankPay: 16200,
        cashPay: 0,
      },
      {
        serialNo: 2,
        id: "2021022804",
        officeId: "2021022804",
        name: "Kaikobad Howlader",
        designation: "Security Guard",
        grade: "None",
        department: "HR, Admin and Compliance",
        section: "Security Section",
        unit: "ALL",
        line: "ALL",
        joinDate: "12/01/2021",
        bankAcc: "1501203498810002",
        basic: 8933,
        houseRent: 4417,
        medical: 750,
        food: 1250,
        conveyance: 450,
        gross: 15700,
        totalDay: 23,
        holiday: 8,
        present: 23,
        cl: 0,
        sl: 0,
        el: 0,
        ml: 0,
        absent: 0,
        absDeduc: 0,
        advance: 0,
        loan: 0,
        tax: 0,
        revStamp: 0,
        lunch: 0,
        wagelyAd: 0,
        adjust: 0,
        fairShop: 0,
        payableSalary: 15700,
        otHour: 0,
        otRate: 0,
        otPay: 0,
        festivalBonus: 0,
        holidayAllowance: 0,
        alwArrear: 0,
        tiffin: 0,
        nightBill: 0,
        behaviorBonus: 200,
        attendanceBonus: 300,
        netPay: 16200,
        bankPay: 16200,
        cashPay: 0,
      },
      {
        serialNo: 3,
        id: "2021028542",
        officeId: "2021028542",
        name: "Zakir Hossain",
        designation: "Executive",
        grade: "None",
        department: "HR, Admin and Compliance",
        section: "Compliance Management",
        unit: "ALL",
        line: "ALL",
        joinDate: "09/30/2021",
        bankAcc: "1501203498810003",
        basic: 18900,
        houseRent: 9450,
        medical: 1890,
        food: 0,
        conveyance: 1260,
        gross: 31500,
        totalDay: 23,
        holiday: 8,
        present: 22,
        cl: 1,
        sl: 0,
        el: 0,
        ml: 0,
        absent: 0,
        absDeduc: 0,
        advance: 2500,
        loan: 0,
        tax: 1250,
        revStamp: 0,
        lunch: 0,
        wagelyAd: 0,
        adjust: 0,
        fairShop: 0,
        payableSalary: 27750,
        otHour: 0,
        otRate: 0,
        otPay: 0,
        festivalBonus: 0,
        holidayAllowance: 0,
        alwArrear: 0,
        tiffin: 0,
        nightBill: 0,
        behaviorBonus: 0,
        attendanceBonus: 0,
        netPay: 27750,
        bankPay: 27750,
        cashPay: 0,
      },
      {
        serialNo: 4,
        id: "2022035599",
        officeId: "2022035599",
        name: "Dipon Saha",
        designation: "Manager",
        grade: "Grade-03",
        department: "HR, Admin and Compliance",
        section: "HR Operations",
        unit: "ALL",
        line: "ALL",
        joinDate: "01/03/2022",
        bankAcc: "1501203498810004",
        basic: 40200,
        houseRent: 20100,
        medical: 4020,
        food: 0,
        conveyance: 2680,
        gross: 67000,
        totalDay: 23,
        holiday: 8,
        present: 23,
        cl: 0,
        sl: 0,
        el: 0,
        ml: 0,
        absent: 0,
        absDeduc: 0,
        advance: 0,
        loan: 0,
        tax: 0,
        revStamp: 0,
        lunch: 0,
        wagelyAd: 0,
        adjust: 0,
        fairShop: 0,
        payableSalary: 67000,
        otHour: 0,
        otRate: 0,
        otPay: 0,
        festivalBonus: 0,
        holidayAllowance: 0,
        alwArrear: 0,
        tiffin: 0,
        nightBill: 0,
        behaviorBonus: 0,
        attendanceBonus: 0,
        netPay: 67000,
        bankPay: 67000,
        cashPay: 0,
      },
      {
        serialNo: 5,
        id: "2025058109",
        officeId: "2025058109",
        name: "Mohammad Methoun Ahmed",
        designation: "Sr. Manager",
        grade: "Grade-02",
        department: "Business Automation",
        section: "Core Development",
        unit: "ALL",
        line: "ALL",
        joinDate: "22/12/2025",
        bankAcc: "1501203498810005",
        basic: 78000,
        houseRent: 39000,
        medical: 7800,
        food: 0,
        conveyance: 5200,
        gross: 130000,
        totalDay: 23,
        holiday: 8,
        present: 20,
        cl: 3,
        sl: 0,
        el: 0,
        ml: 0,
        absent: 0,
        absDeduc: 0,
        advance: 0,
        loan: 0,
        tax: 417,
        revStamp: 0,
        lunch: 0,
        wagelyAd: 0,
        adjust: 0,
        fairShop: 0,
        payableSalary: 128333,
        otHour: 0,
        otRate: 0,
        otPay: 0,
        festivalBonus: 0,
        holidayAllowance: 0,
        alwArrear: 0,
        tiffin: 0,
        nightBill: 0,
        behaviorBonus: 0,
        attendanceBonus: 0,
        netPay: 128333,
        bankPay: 128333,
        cashPay: 0,
      },
    ];
  }, []);

  // Designation Hierarchy ranking (RMG & Corporate hierarchy)
  const getDesignationRank = (desig: string): number => {
    const d = desig.toLowerCase().trim();
    if (d.includes("director") || d.includes("general manager") || d.includes("gm")) return 1;
    if (d.includes("sr. manager") || d.includes("senior manager")) return 2;
    if (d.includes("manager")) return 3;
    if (d.includes("asst. manager") || d.includes("assistant manager")) return 4;
    if (d.includes("sr. executive") || d.includes("senior executive")) return 5;
    if (d.includes("executive")) return 6;
    if (d.includes("officer")) return 7;
    if (d.includes("supervisor")) return 8;
    if (d.includes("operator")) return 9;
    if (d.includes("guard")) return 10;
    if (d.includes("helper") || d.includes("cook")) return 11;
    return 20;
  };

  // Dynamically sorted employees according to template's sortMode & alphabeticalOrder
  const sortedSampleEmployees = useMemo(() => {
    const sortMode = editingTemplate?.sortMode || "designation";
    const alphaOrder = editingTemplate?.alphabeticalOrder || "asc";
    const multiplier = alphaOrder === "desc" ? -1 : 1;

    const list = [...sampleEmployees];

    list.sort((a, b) => {
      if (sortMode === "designation") {
        const rankA = getDesignationRank(a.designation);
        const rankB = getDesignationRank(b.designation);
        if (rankA !== rankB) {
          return rankA - rankB;
        }
        // Within same designation, alphabetical sorting by employee name
        return a.name.localeCompare(b.name) * multiplier;
      } else {
        // Direct Alphabetical by employee name
        return a.name.localeCompare(b.name) * multiplier;
      }
    });

    return list.map((emp, idx) => ({
      ...emp,
      serialNo: idx + 1,
    }));
  }, [editingTemplate?.sortMode, editingTemplate?.alphabeticalOrder, sampleEmployees]);

  // Distinct groups based on groupBy setting
  const availableGroups = useMemo(() => {
    const isSection = editingTemplate?.groupBy === "section";
    const groupMap = new Map<string, number>();
    sortedSampleEmployees.forEach((emp) => {
      const key = isSection ? (emp.section || "General Section") : (emp.department || "General Department");
      groupMap.set(key, (groupMap.get(key) || 0) + 1);
    });
    return Array.from(groupMap.entries()).map(([name, count]) => ({ name, count }));
  }, [editingTemplate?.groupBy, sortedSampleEmployees]);

  // Filtered employees for preview canvas
  const displayEmployees = useMemo(() => {
    if (previewGroupFilter === "all") return sortedSampleEmployees;
    const isSection = editingTemplate?.groupBy === "section";
    return sortedSampleEmployees
      .filter((emp) => {
        const key = isSection ? (emp.section || "General Section") : (emp.department || "General Department");
        return key === previewGroupFilter;
      })
      .map((emp, idx) => ({
        ...emp,
        serialNo: idx + 1,
      }));
  }, [previewGroupFilter, editingTemplate?.groupBy, sortedSampleEmployees]);

  // Helper to extract value based on column definition
  const getCellValue = (emp: any, col: SalarySheetColumn) => {
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
          <div className="text-left font-sans p-1 leading-tight min-w-[125px]">
            <span className="font-extrabold text-black dark:text-slate-900 block text-[8px] tracking-tight">{emp.id}</span>
            <span className="text-neutral-500 block text-[6.5px]">Office ID: {emp.officeId || emp.id}</span>
            <span className="text-black dark:text-slate-900 font-extrabold block text-[7.5px] leading-tight">{emp.name}</span>
            <span className="text-neutral-600 block text-[6.5px]">{emp.designation}</span>
            <div className="flex justify-between mt-0.5 text-[6px] text-neutral-500">
              <span>Grade: {emp.grade || "None"}</span>
              <span>JD: {emp.joinDate}</span>
            </div>
          </div>
        );
      case "sal_basic":
        return Number(emp.basic || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case "sal_house_rent":
        return Number(emp.houseRent || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case "sal_medical":
        return Number(emp.medical || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case "sal_food":
        return Number(emp.food || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case "sal_conveyance":
        return Number(emp.conveyance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case "sal_gross":
        return (
          <span className="font-bold text-black dark:text-slate-900">
            {Number(emp.gross || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      case "sal_payable_salary":
        return (
          <span className="font-bold text-black dark:text-slate-900">
            {Number(emp.payableSalary || 0).toLocaleString()}
          </span>
        );
      case "alw_arrear":
        return emp.alwArrear ? Number(emp.alwArrear).toLocaleString() : "0";
      case "alw_holiday":
        return emp.holidayAllowance ? Number(emp.holidayAllowance).toLocaleString() : "0";
      case "alw_tiffin":
        return emp.tiffin ? Number(emp.tiffin).toLocaleString() : "0";
      case "alw_night":
        return emp.nightBill ? Number(emp.nightBill).toLocaleString() : "0";
      case "alw_general":
        return "0";
      case "att_total_day":
        return emp.totalDay ?? 23;
      case "att_holiday":
        return emp.holiday ?? 8;
      case "att_present":
        return emp.present ?? 20;
      case "att_leave_cl":
        return emp.cl ?? 0;
      case "att_leave_sl":
        return emp.sl ?? 0;
      case "att_leave_el":
        return emp.el ?? 0;
      case "att_leave_ml":
        return emp.ml ?? 0;
      case "att_absent":
        return emp.absent ?? 0;
      case "att_payable_days":
        return emp.payableDays || emp.totalDay || 23;
      case "ded_absent":
        return emp.absDeduc ? Number(emp.absDeduc).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0";
      case "ded_advance":
        return emp.advance ? Number(emp.advance).toLocaleString() : "0";
      case "ded_loan":
        return emp.loan ? Number(emp.loan).toLocaleString() : "0";
      case "ded_tax":
        return emp.tax ? Number(emp.tax).toLocaleString() : "0";
      case "ded_stamp":
        return emp.revStamp ?? 0;
      case "ded_lunch":
        return emp.lunch ? Number(emp.lunch).toLocaleString() : "0";
      case "ded_wagely":
        return emp.wagelyAd ? Number(emp.wagelyAd).toLocaleString() : "0";
      case "ded_adjust":
        return emp.adjust ? Number(emp.adjust).toLocaleString() : "0";
      case "ded_fair_shop":
        return emp.fairShop ? Number(emp.fairShop).toLocaleString() : "0";
      case "ded_provident_fund":
        return "0";
      case "ded_total":
        return (Number(emp.advance || 0) + Number(emp.tax || 0) + Number(emp.loan || 0)).toLocaleString();
      case "ot_hour":
        return Number(emp.otHour || 0).toFixed(2);
      case "ot_rate":
        return Number(emp.otRate || 0).toFixed(2);
      case "ot_pay":
        return Number(emp.otPay || 0).toFixed(2);
      case "bonus_attendance":
        return emp.attendanceBonus ? Number(emp.attendanceBonus).toLocaleString() : "0";
      case "bonus_behavior":
        return emp.behaviorBonus ? Number(emp.behaviorBonus).toLocaleString() : "0";
      case "bonus_festival":
        return emp.festivalBonus ? Number(emp.festivalBonus).toLocaleString() : "0";
      case "bonus_production":
        return "0";
      case "net_pay":
        return (
          <span className="font-extrabold text-black dark:text-slate-900">
            {Number(emp.netPay || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      case "pay_bank":
        return Number(emp.bankPay || emp.netPay || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case "pay_cash":
        return Number(emp.cashPay || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case "col_signature":
        return <div className="h-9 min-w-[75px]"></div>;
      case "col_remarks":
        return <span className="text-[7.5px] font-semibold text-emerald-700">PAID</span>;
      default:
        return "-";
    }
  };

  // Helper to compute footer total for a column
  const getColumnFooterTotal = (col: SalarySheetColumn) => {
    const fieldMap: Record<string, string> = {
      sal_basic: "basic",
      sal_house_rent: "houseRent",
      sal_medical: "medical",
      sal_food: "food",
      sal_conveyance: "conveyance",
      sal_gross: "gross",
      att_total_day: "totalDay",
      att_holiday: "holiday",
      att_present: "present",
      att_leave_cl: "cl",
      att_leave_sl: "sl",
      att_leave_el: "el",
      att_leave_ml: "ml",
      att_absent: "absent",
      ded_absent: "absDeduc",
      ded_advance: "advance",
      ded_loan: "loan",
      ded_tax: "tax",
      ded_stamp: "revStamp",
      ded_lunch: "lunch",
      ded_wagely: "wagelyAd",
      ded_adjust: "adjust",
      ded_fair_shop: "fairShop",
      sal_payable_salary: "payableSalary",
      ot_hour: "otHour",
      ot_rate: "otRate",
      ot_pay: "otPay",
      bonus_festival: "festivalBonus",
      alw_holiday: "holidayAllowance",
      alw_arrear: "alwArrear",
      alw_tiffin: "tiffin",
      alw_night: "nightBill",
      bonus_behavior: "behaviorBonus",
      bonus_attendance: "attendanceBonus",
      net_pay: "netPay",
      pay_bank: "bankPay",
      pay_cash: "cashPay",
    };

    const prop = fieldMap[col.paramMapping];
    if (prop) {
      const sum = displayEmployees.reduce((acc, emp: any) => acc + (Number(emp[prop]) || 0), 0);
      if (col.format === "currency") {
        return sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      return sum ? sum.toLocaleString() : "0";
    }

    return "-";
  };

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
    if (["sal_gross", "sal_payable_salary", "net_pay", "pay_bank"].includes(col.paramMapping)) {
      return "58px";
    }
    if (col.width && parseInt(col.width) > 0) {
      if (parseInt(col.width) > 55 && col.isRotatedHeader) return "50px";
      return col.width;
    }
    return col.isRotatedHeader ? "50px" : "58px";
  };

  // Group consecutive columns under tier-1 sections for the authentic landscape sheet
  const headerGroups = useMemo(() => {
    if (!editingTemplate) return [];
    const visibleCols = editingTemplate.columns.filter((c) => c.isVisible);
    const groups: {
      type: "group" | "standalone";
      categoryKey?: SalarySheetColumn["category"];
      labelEng: string;
      labelBng: string;
      colSpan: number;
      columns: SalarySheetColumn[];
    }[] = [];

    const isStandaloneCol = (col: SalarySheetColumn) => {
      if (col.category === "none") return true;
      if (col.category === "employee_info") return true;
      return [
        "emp_sl",
        "emp_id_name",
        "sal_payable_salary",
        "net_pay",
        "pay_bank",
        "pay_cash",
        "col_signature",
        "col_remarks",
      ].includes(col.paramMapping);
    };

    for (const col of visibleCols) {
      if (isStandaloneCol(col)) {
        groups.push({
          type: "standalone",
          categoryKey: col.category,
          labelEng: col.labelEng,
          labelBng: col.labelBng || col.labelEng,
          colSpan: 1,
          columns: [col],
        });
        continue;
      }

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.type === "group" && lastGroup.categoryKey === col.category) {
        lastGroup.colSpan += 1;
        lastGroup.columns.push(col);
      } else {
        const catInfo = CATEGORY_LABELS[col.category] || { label: col.category, bng: col.category };
        groups.push({
          type: "group",
          categoryKey: col.category,
          labelEng: catInfo.label,
          labelBng: catInfo.bng,
          colSpan: 1,
          columns: [col],
        });
      }
    }
    return groups;
  }, [editingTemplate]);

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
                Salary Sheet Configuration
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize column layouts, set section groupings (or None for standalone headers), and map system field parameters.
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
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                            {tpl.groupBy === "section" ? <Split className="size-3" /> : <Building2 className="size-3" />}
                            {tpl.groupBy === "section" ? "Section-Wise" : "Department-Wise"}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                            <Briefcase className="size-3" />
                            {tpl.sortMode === "alphabetical" ? "Alphabetical" : "Designation"} ({tpl.alphabeticalOrder === "desc" ? "Z→A" : "A→Z"})
                          </span>
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
                              let tplToEdit = JSON.parse(JSON.stringify(tpl));
                              if (tplToEdit.id === "sheet-tpl-1" && tplToEdit.columns.length < 35) {
                                tplToEdit.columns = JSON.parse(JSON.stringify(DEFAULT_SALARY_SHEET_COLUMNS));
                              }
                              setEditingTemplate(tplToEdit);
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
            <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase tracking-wide">
                      {editingTemplate.employeeType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border/50">
                      {editingTemplate.companyName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {editingTemplate.columns.filter((c) => c.isVisible).length} Active Columns
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <SlidersHorizontal className="size-5 text-primary" />
                    Configuring: {editingTemplate.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add new columns, delete unwanted ones, customize headers (English/Bengali), and map database parameters.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      setNewColLabelEng("");
                      setNewColLabelBng("");
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

              {/* Sheet Grouping & Employee Ordering Rules */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 1. Group By: Department vs Section */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground flex items-center gap-1">
                      <Building2 className="size-3 text-blue-600" />
                      Sheet Grouping
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-background/80 p-0.5 rounded-lg border border-border/60">
                      <button
                        type="button"
                        onClick={() => handleUpdateGrouping("department")}
                        className={`h-7.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          editingTemplate.groupBy !== "section"
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Building2 className="size-3" /> Department Wise
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateGrouping("section")}
                        className={`h-7.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          editingTemplate.groupBy === "section"
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Split className="size-3" /> Section Wise
                      </button>
                    </div>
                  </div>

                  {/* 2. Primary Sort: Designation vs Alphabetical */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground flex items-center gap-1">
                      <Briefcase className="size-3 text-purple-600" />
                      Primary Ordering
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-background/80 p-0.5 rounded-lg border border-border/60">
                      <button
                        type="button"
                        onClick={() => handleUpdateSortMode("designation")}
                        className={`h-7.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          editingTemplate.sortMode !== "alphabetical"
                            ? "bg-purple-600 text-white shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Briefcase className="size-3" /> Designation Wise
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateSortMode("alphabetical")}
                        className={`h-7.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          editingTemplate.sortMode === "alphabetical"
                            ? "bg-purple-600 text-white shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ArrowDownAZ className="size-3" /> Alphabetical
                      </button>
                    </div>
                  </div>

                  {/* 3. Alphabetical Order: Ascending vs Descending */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground flex items-center gap-1">
                      <ArrowUpDown className="size-3 text-emerald-600" />
                      Alphabetical Order
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-background/80 p-0.5 rounded-lg border border-border/60">
                      <button
                        type="button"
                        onClick={() => handleUpdateAlphaOrder("asc")}
                        className={`h-7.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          editingTemplate.alphabeticalOrder !== "desc"
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ArrowDownAZ className="size-3" /> Ascending (A → Z)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateAlphaOrder("desc")}
                        className={`h-7.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          editingTemplate.alphabeticalOrder === "desc"
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ArrowUpZA className="size-3" /> Descending (Z → A)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Filter Pills (matching authentic UI) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-border/30 pt-3">
                {[
                  { key: "all", label: "All", count: editingTemplate.columns.length },
                  { key: "none", label: "No Section (None)", count: editingTemplate.columns.filter((c) => c.category === "none").length },
                  { key: "salary_breakdown", label: "Salary Breakdown", count: editingTemplate.columns.filter((c) => c.category === "salary_breakdown").length },
                  { key: "attendance", label: "Attendance", count: editingTemplate.columns.filter((c) => c.category === "attendance").length },
                  { key: "deduction", label: "Deduction", count: editingTemplate.columns.filter((c) => c.category === "deduction").length },
                  { key: "overtime", label: "Overtime", count: editingTemplate.columns.filter((c) => c.category === "overtime").length },
                  { key: "bonus", label: "Bonuses & Allowances", count: editingTemplate.columns.filter((c) => c.category === "bonus").length },
                  { key: "employee_info", label: "Employee Info", count: editingTemplate.columns.filter((c) => c.category === "employee_info").length },
                ].filter((cat) => cat.key === "all" || cat.count > 0).map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategoryTab(cat.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategoryTab === cat.key
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
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
                      placeholder="Search column or parameter..."
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
                      <th className="px-3 py-3 w-[150px]">Section</th>
                      <th className="px-3 py-3 min-w-[150px]">English Label</th>
                      <th className="px-3 py-3 min-w-[140px]">বাংলা Label</th>
                      <th className="px-3 py-3 min-w-[240px]">System Field Parameter</th>
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
                            <div className="w-[150px]">
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

                          {/* System Field Parameter (Only Field Mapping) */}
                          <td className="px-3 py-2">
                            <div className="w-full min-w-[240px]">
                              <SearchableSelect
                                options={systemParamOptions}
                                value={col.paramMapping}
                                onChange={(newVal) => {
                                  const paramDef = SYSTEM_PARAMETERS.find((p) => p.key === newVal);
                                  handleColumnUpdate(col.id, {
                                    paramMapping: newVal,
                                    format: paramDef?.format || col.format || "text",
                                  });
                                }}
                                placeholder="Select parameter..."
                                className="w-full h-8 text-xs font-semibold bg-background"
                              />
                            </div>
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

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Group Filter Switcher */}
                    <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs font-bold">
                      <span className="px-2 text-muted-foreground text-[11px] font-semibold flex items-center gap-1">
                        {editingTemplate.groupBy === "section" ? <Split className="size-3 text-blue-600" /> : <Building2 className="size-3 text-blue-600" />}
                        {editingTemplate.groupBy === "section" ? "Section:" : "Department:"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewGroupFilter("all")}
                        className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer text-xs ${
                          previewGroupFilter === "all"
                            ? "bg-background text-foreground shadow-2xs font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        All ({sortedSampleEmployees.length})
                      </button>
                      {availableGroups.map((g) => (
                        <button
                          key={g.name}
                          type="button"
                          onClick={() => setPreviewGroupFilter(g.name)}
                          className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer text-xs ${
                            previewGroupFilter === g.name
                              ? "bg-background text-primary shadow-2xs font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {g.name} ({g.count})
                        </button>
                      ))}
                    </div>

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
                    {/* Factory Header Block */}
                    <div className="relative pb-2 mb-2 text-center">
                      <div className="absolute right-0 top-0 text-[8px] font-semibold text-neutral-700">
                        Page: 1 of 8
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-0.5">
                        <div className="size-5 rounded bg-black text-white font-black flex items-center justify-center text-[10px]">
                          P
                        </div>
                        <h1 className="font-black text-[14px] uppercase tracking-wider text-black">
                          {editingTemplate.companyName}
                        </h1>
                      </div>
                      <p className="text-[8.5px] font-medium text-neutral-700">
                        Kha-48C Tropicana, House-27 Road-02, Dhaka-1209
                      </p>
                      <p className="text-[10px] font-black text-black underline uppercase mt-0.5 tracking-wide">
                        {previewLanguage === "en"
                          ? `Monthly Salary Sheet - Oct, 2026`
                          : `মাসিক বেতন বিবরণী - অক্টোবর, ২০২৬`}
                      </p>
                    </div>

                    {/* Meta Filter Strip matching factory report */}
                    <div className="border border-black px-3 py-1 mb-2.5 flex items-center justify-between text-[8px] font-bold text-black uppercase bg-slate-50/50 flex-wrap gap-2">
                      <div>
                        <span className="font-semibold text-neutral-600">Employee Type: </span>
                        <span>{editingTemplate.employeeType}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-600">
                          {editingTemplate.groupBy === "section" ? "Section: " : "Department: "}
                        </span>
                        <span>
                          {previewGroupFilter === "all"
                            ? (editingTemplate.groupBy === "section" ? "ALL SECTIONS" : "HR, Admin and Compliance")
                            : previewGroupFilter}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-600">Ordering: </span>
                        <span className="text-purple-900 font-extrabold">
                          {editingTemplate.sortMode === "designation"
                            ? `Designation → Name (${editingTemplate.alphabeticalOrder?.toUpperCase() || "ASC"})`
                            : `Name Alphabetical (${editingTemplate.alphabeticalOrder?.toUpperCase() || "ASC"})`}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-600">Unit: </span>
                        <span>ALL</span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-600">Line: </span>
                        <span>ALL</span>
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
                        {/* Tier 1 Header: Section Super-headers and Standalone Columns */}
                        <tr>
                          {headerGroups.map((group, gIdx) => {
                            if (group.type === "standalone") {
                              const col = group.columns[0];
                              const headerTitle =
                                previewLanguage === "bn" && col.labelBng ? col.labelBng : col.labelEng;
                              const isRot = col.isRotatedHeader;
                              const colW = getEffectiveColumnWidth(col);
                              const isNarrow = parseInt(colW) <= 30;

                              return (
                                <th
                                  key={`th-standalone-${col.id}`}
                                  rowSpan={2}
                                  style={{
                                    width: colW,
                                    minWidth: colW,
                                    maxWidth: colW,
                                  }}
                                  className={`border border-black font-extrabold uppercase bg-slate-100 ${
                                    isNarrow ? "px-0 py-1 overflow-hidden" : "px-1 py-1.5"
                                  } align-middle`}
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
                            }

                            // Tier 1 Group Section Header
                            const sectionTitle = previewLanguage === "bn" ? group.labelBng : group.labelEng;
                            return (
                              <th
                                key={`th-group-${gIdx}`}
                                colSpan={group.colSpan}
                                className="border border-black font-extrabold uppercase bg-slate-200 text-black py-1 px-1 text-[8.5px] tracking-wider text-center align-middle"
                              >
                                {sectionTitle}
                              </th>
                            );
                          })}
                        </tr>

                        {/* Tier 2 Header: Sub-headers for Grouped Columns */}
                        <tr>
                          {headerGroups.flatMap((group) => {
                            if (group.type === "standalone") return [];
                            return group.columns.map((col) => {
                              const headerTitle =
                                previewLanguage === "bn" && col.labelBng ? col.labelBng : col.labelEng;
                              const isRot = col.isRotatedHeader;
                              const colW = getEffectiveColumnWidth(col);
                              const isNarrow = parseInt(colW) <= 30;

                              return (
                                <th
                                  key={`th-sub-${col.id}`}
                                  style={{
                                    width: colW,
                                    minWidth: colW,
                                    maxWidth: colW,
                                  }}
                                  className={`border border-black font-extrabold uppercase bg-slate-100 text-black ${
                                    isNarrow ? "px-0 py-1 overflow-hidden" : "px-1 py-1"
                                  } ${isRot ? "h-[65px] align-middle" : "align-middle"}`}
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
                            });
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black text-[8px] font-medium text-black">
                        {displayEmployees.map((emp) => (
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

              <div className="pt-2 border-t border-border/40 space-y-3">
                <span className="text-[11px] font-bold text-foreground/90 uppercase tracking-wider block">
                  Grouping & Sorting Rules
                </span>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Sheet Grouping</label>
                  <div className="grid grid-cols-2 gap-2 bg-muted/20 p-1 rounded-xl border border-border/50">
                    <button
                      type="button"
                      onClick={() => setNewGroupBy("department")}
                      className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        newGroupBy === "department"
                          ? "bg-background text-primary shadow-2xs font-bold border border-border/60"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Department Wise
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGroupBy("section")}
                      className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        newGroupBy === "section"
                          ? "bg-background text-primary shadow-2xs font-bold border border-border/60"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Section Wise
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Primary Sort</label>
                    <div className="grid grid-cols-2 gap-1 bg-muted/20 p-0.5 rounded-xl border border-border/50">
                      <button
                        type="button"
                        onClick={() => setNewSortMode("designation")}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                          newSortMode === "designation"
                            ? "bg-background text-purple-600 shadow-2xs font-bold border border-border/60"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Designation
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewSortMode("alphabetical")}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                          newSortMode === "alphabetical"
                            ? "bg-background text-purple-600 shadow-2xs font-bold border border-border/60"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Alphabetical
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Alphabetical Order</label>
                    <div className="grid grid-cols-2 gap-1 bg-muted/20 p-0.5 rounded-xl border border-border/50">
                      <button
                        type="button"
                        onClick={() => setNewAlphaOrder("asc")}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                          newAlphaOrder === "asc"
                            ? "bg-background text-emerald-600 shadow-2xs font-bold border border-border/60"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Asc (A-Z)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAlphaOrder("desc")}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                          newAlphaOrder === "desc"
                            ? "bg-background text-emerald-600 shadow-2xs font-bold border border-border/60"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Desc (Z-A)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

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
                  Define header labels, assign an optional section grouping (or None for standalone), and select a system field parameter.
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

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">System Field Parameter</label>
                  <SearchableSelect
                    options={systemParamOptions}
                    value={newColParamMapping}
                    onChange={(val) => setNewColParamMapping(val)}
                    className="w-full h-9 text-xs font-semibold"
                    placeholder="Search parameter..."
                  />
                </div>
              </div>

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
