import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Coins,
  Gift,
  Coffee,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-compensation")({
  head: () => ({
    meta: [
      { title: "Allowances & Bonuses Setup — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure allowance rates, tiffin rates, lunch rates, conveyance, and bonus policies.",
      },
    ],
  }),
  component: CompensationSetupPage,
});

type TabType = "allowance" | "tiffin" | "lunch" | "conveyance" | "bonus";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
interface AllowanceRate {
  sl: number;
  company: string;
  area: string;
  applicableFrom: string;
  applicableTo: string;
  employeeType: string;
  department: string;
  subDepartment: string;
  designation: string;
  workingHourFrom: string;
  workingHourTo: string;
  salaryFrom: number;
  salaryTo: number;
  rateFor: string;
  basedOn: string;
  rate: number;
  divByHour: string;
  divByDay: string;
  getAfterReq: string;
  getAfterReqRate: number;
  eotAfter: number;
  lunch: number;
  dinner: number;
  isActive: "Active" | "Inactive";
  calculationFor: string;
}

interface TiffinRate {
  sl: number;
  company: string;
  area: string;
  applicableFrom: string;
  applicableTo: string;
  employeeType: string;
  department: string;
  section: string;
  designation: string;
  workingHourFrom: string;
  workingHourTo: string;
  isActive: "Active" | "Inactive";
  basedOnTiffin: string;
  workingShift: string;
  rate: number;
}

interface LunchRate {
  sl: number;
  employeeType: string;
  rate: number;
  isActive: "Active" | "Inactive";
}

interface ConveyanceSetup {
  sl: number;
  employeeType: string;
  amount: number;
  isActive: "Active" | "Inactive";
}

interface BonusSetting {
  sl: number;
  employeeType: string;
  daysFrom: number;
  daysTo: number;
  basedOn: string;
  bonusPercent: number;
  designation: string;
  includeServiceLength: "Yes" | "No";
  isActive: "Active" | "Inactive";
}

// ----------------------------------------------------
// Defaults
// ----------------------------------------------------
const DEFAULT_ALLOWANCES: AllowanceRate[] = [
  {
    sl: 1,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "ALL",
    department: "All Departments",
    subDepartment: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 10000,
    salaryTo: 100000,
    rateFor: "Holiday",
    basedOn: "Basic",
    rate: 1.5,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 2,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Operator",
    department: "Production Dept",
    subDepartment: "Sewing Section",
    designation: "Operator",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 8000,
    salaryTo: 16000,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 2.0,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 3,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Helper",
    department: "Production Dept",
    subDepartment: "Sewing Section",
    designation: "Helper",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 8000,
    salaryTo: 10000,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 2.0,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 4,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Staff",
    department: "Quality Assurance",
    subDepartment: "Inspection",
    designation: "QC Inspector",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 12000,
    salaryTo: 25000,
    rateFor: "Overtime",
    basedOn: "Gross",
    rate: 1.5,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 5,
    company: "Pakiza Knit Composite Ltd",
    area: "Head Office",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Officer",
    department: "HR & Admin",
    subDepartment: "Admin Support",
    designation: "HR Executive",
    workingHourFrom: "09:00",
    workingHourTo: "18:00",
    salaryFrom: 20000,
    salaryTo: 35000,
    rateFor: "Holiday",
    basedOn: "Fixed Rate",
    rate: 1000,
    divByHour: "No",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 6,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Operator",
    department: "Production Dept",
    subDepartment: "Cutting Section",
    designation: "Cutter",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 9000,
    salaryTo: 15000,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 2.0,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 7,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "ALL",
    department: "Maintenance Dept",
    subDepartment: "Machine Repairs",
    designation: "Electrician",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 10000,
    salaryTo: 22000,
    rateFor: "Night Shift",
    basedOn: "Fixed Rate",
    rate: 150,
    divByHour: "No",
    getAfterReq: "Yes",
    getAfterReqRate: 4,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 8,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Worker",
    department: "Washing Department",
    subDepartment: "Washing Lab",
    designation: "Operator",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 8500,
    salaryTo: 14000,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 2.0,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 9,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Security Guard",
    department: "Security & Safety",
    subDepartment: "Fire & Safety Wing",
    designation: "Security Guard",
    workingHourFrom: "06:00",
    workingHourTo: "18:00",
    salaryFrom: 9500,
    salaryTo: 15000,
    rateFor: "Holiday",
    basedOn: "Fixed Rate",
    rate: 500,
    divByHour: "No",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 10,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Worker",
    department: "Packaging & Carton",
    subDepartment: "Carton Box Maker",
    designation: "Helper",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 8000,
    salaryTo: 9500,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 2.0,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 11,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "ALL",
    department: "Store & Inventory",
    subDepartment: "Yarn Store",
    designation: "Store Executive",
    workingHourFrom: "08:30",
    workingHourTo: "17:30",
    salaryFrom: 15000,
    salaryTo: 28000,
    rateFor: "Overtime",
    basedOn: "Gross",
    rate: 1.5,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 12,
    company: "Pakiza Knit Composite Ltd",
    area: "Head Office",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Officer",
    department: "Finance & Accounts",
    subDepartment: "Accounts Payable",
    designation: "Senior Accountant",
    workingHourFrom: "09:00",
    workingHourTo: "18:00",
    salaryFrom: 30000,
    salaryTo: 55000,
    rateFor: "Holiday",
    basedOn: "Fixed Rate",
    rate: 1500,
    divByHour: "No",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 13,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Driver",
    department: "Logistics & Supply",
    subDepartment: "Central Warehouse",
    designation: "Heavy Vehicle Driver",
    workingHourFrom: "08:00",
    workingHourTo: "18:00",
    salaryFrom: 12000,
    salaryTo: 20000,
    rateFor: "Holiday",
    basedOn: "Fixed Rate",
    rate: 800,
    divByHour: "No",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 14,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Casual",
    department: "Production Dept",
    subDepartment: "Sewing Section",
    designation: "Helper",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 8000,
    salaryTo: 9000,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 2.0,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 15,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Apprentice",
    department: "Production Dept",
    subDepartment: "Sewing Section",
    designation: "Trainee Operator",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 6000,
    salaryTo: 8000,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 1.5,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 16,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "ALL",
    department: "Engineering & Utility",
    subDepartment: "Power House",
    designation: "Boiler Operator",
    workingHourFrom: "08:00",
    workingHourTo: "16:00",
    salaryFrom: 11000,
    salaryTo: 22000,
    rateFor: "Night Shift",
    basedOn: "Fixed Rate",
    rate: 200,
    divByHour: "No",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 17,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Permanent",
    department: "Quality Assurance",
    subDepartment: "Inspection",
    designation: "QC Inspector",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 10000,
    salaryTo: 18000,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 2.0,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 18,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Staff",
    department: "Production Dept",
    subDepartment: "Sample Section",
    designation: "Pattern Maker",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 15000,
    salaryTo: 28000,
    rateFor: "Overtime",
    basedOn: "Gross",
    rate: 1.5,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 19,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "ALL",
    department: "Production Dept",
    subDepartment: "Sewing Section",
    designation: "Line Leader",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 12000,
    salaryTo: 20000,
    rateFor: "Attendance Bonus",
    basedOn: "Fixed Rate",
    rate: 500,
    divByHour: "No",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
  {
    sl: 20,
    company: "Pakiza Knit Composite Ltd",
    area: "Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Supervisor",
    department: "Production Dept",
    subDepartment: "Sewing Section",
    designation: "Supervisor",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    salaryFrom: 15000,
    salaryTo: 25000,
    rateFor: "Overtime",
    basedOn: "Basic",
    rate: 2.0,
    divByHour: "Yes",
    getAfterReq: "No",
    getAfterReqRate: 0,
    eotAfter: 0,
    lunch: 0,
    dinner: 0,
    isActive: "Active",
    divByDay: "No",
    calculationFor: "Shift",
  },
];

const DEFAULT_TIFFIN: TiffinRate[] = [
  {
    sl: 1,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "ALL",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 50,
  },
  {
    sl: 2,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Permanent",
    department: "Production Dept",
    section: "Sewing Section",
    designation: "Operator",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 55,
  },
  {
    sl: 3,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Casual",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 45,
  },
  {
    sl: 4,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Contractual",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 60,
  },
  {
    sl: 5,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Apprentice",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 40,
  },
  {
    sl: 6,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Part-Time",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 50,
  },
  {
    sl: 7,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Intern",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 60,
  },
  {
    sl: 8,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Temporary",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 45,
  },
  {
    sl: 9,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Seasonal",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 45,
  },
  {
    sl: 10,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Outsourced",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 50,
  },
  {
    sl: 11,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Consultant",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 70,
  },
  {
    sl: 12,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Freelance",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 70,
  },
  {
    sl: 13,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Daily Wager",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 40,
  },
  {
    sl: 14,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Project-Based",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 60,
  },
  {
    sl: 15,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Advisory Staff",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 80,
  },
  {
    sl: 16,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Trainee",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 45,
  },
  {
    sl: 17,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Shift-Worker",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 55,
  },
  {
    sl: 18,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "On-Call Staff",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 50,
  },
  {
    sl: 19,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Retainer Contract",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 65,
  },
  {
    sl: 20,
    company: "Aleya Apparels Ltd.",
    area: "Aleya-Factory",
    applicableFrom: "2026-01-01",
    applicableTo: "2026-12-31",
    employeeType: "Guest Expert",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    workingHourFrom: "08:00",
    workingHourTo: "17:00",
    isActive: "Active",
    basedOnTiffin: "Hour",
    workingShift: "Day",
    rate: 75,
  },
];

const DEFAULT_LUNCH: LunchRate[] = [
  { sl: 1, employeeType: "ALL", rate: 80, isActive: "Active" },
  { sl: 2, employeeType: "Permanent", rate: 85, isActive: "Active" },
  { sl: 3, employeeType: "Casual", rate: 75, isActive: "Active" },
  { sl: 4, employeeType: "Contractual", rate: 90, isActive: "Active" },
  { sl: 5, employeeType: "Apprentice", rate: 70, isActive: "Active" },
  { sl: 6, employeeType: "Part-Time", rate: 80, isActive: "Active" },
  { sl: 7, employeeType: "Intern", rate: 90, isActive: "Active" },
  { sl: 8, employeeType: "Temporary", rate: 75, isActive: "Active" },
  { sl: 9, employeeType: "Seasonal", rate: 75, isActive: "Active" },
  { sl: 10, employeeType: "Outsourced", rate: 80, isActive: "Active" },
  { sl: 11, employeeType: "Consultant", rate: 100, isActive: "Active" },
  { sl: 12, employeeType: "Freelance", rate: 100, isActive: "Active" },
  { sl: 13, employeeType: "Daily Wager", rate: 70, isActive: "Active" },
  { sl: 14, employeeType: "Project-Based", rate: 90, isActive: "Active" },
  { sl: 15, employeeType: "Advisory Staff", rate: 120, isActive: "Active" },
  { sl: 16, employeeType: "Trainee", rate: 75, isActive: "Active" },
  { sl: 17, employeeType: "Shift-Worker", rate: 85, isActive: "Active" },
  { sl: 18, employeeType: "On-Call Staff", rate: 80, isActive: "Active" },
  { sl: 19, employeeType: "Retainer Contract", rate: 95, isActive: "Active" },
  { sl: 20, employeeType: "Guest Expert", rate: 110, isActive: "Active" },
];

const DEFAULT_CONVEYANCE: ConveyanceSetup[] = [
  { sl: 1, employeeType: "ALL", amount: 1500, isActive: "Active" },
  { sl: 2, employeeType: "Permanent", amount: 1600, isActive: "Active" },
  { sl: 3, employeeType: "Casual", amount: 1200, isActive: "Active" },
  { sl: 4, employeeType: "Contractual", amount: 2000, isActive: "Active" },
  { sl: 5, employeeType: "Apprentice", amount: 1000, isActive: "Active" },
  { sl: 6, employeeType: "Part-Time", amount: 1500, isActive: "Active" },
  { sl: 7, employeeType: "Intern", amount: 1800, isActive: "Active" },
  { sl: 8, employeeType: "Temporary", amount: 1200, isActive: "Active" },
  { sl: 9, employeeType: "Seasonal", amount: 1200, isActive: "Active" },
  { sl: 10, employeeType: "Outsourced", amount: 1400, isActive: "Active" },
  { sl: 11, employeeType: "Consultant", amount: 2500, isActive: "Active" },
  { sl: 12, employeeType: "Freelance", amount: 2500, isActive: "Active" },
  { sl: 13, employeeType: "Daily Wager", amount: 800, isActive: "Active" },
  { sl: 14, employeeType: "Project-Based", amount: 2000, isActive: "Active" },
  { sl: 15, employeeType: "Advisory Staff", amount: 3500, isActive: "Active" },
  { sl: 16, employeeType: "Trainee", amount: 1100, isActive: "Active" },
  { sl: 17, employeeType: "Shift-Worker", amount: 1600, isActive: "Active" },
  { sl: 18, employeeType: "On-Call Staff", amount: 1500, isActive: "Active" },
  { sl: 19, employeeType: "Retainer Contract", amount: 2200, isActive: "Active" },
  { sl: 20, employeeType: "Guest Expert", amount: 3000, isActive: "Active" },
];

const DEFAULT_BONUSES: BonusSetting[] = [
  {
    sl: 1,
    employeeType: "ALL",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 50,
    designation: "ALL",
    includeServiceLength: "Yes",
    isActive: "Active",
  },
  {
    sl: 2,
    employeeType: "Permanent",
    daysFrom: 365,
    daysTo: 9999,
    basedOn: "Basic",
    bonusPercent: 100,
    designation: "ALL",
    includeServiceLength: "Yes",
    isActive: "Active",
  },
  {
    sl: 3,
    employeeType: "Casual",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Gross",
    bonusPercent: 30,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 4,
    employeeType: "Contractual",
    daysFrom: 90,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 40,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 5,
    employeeType: "Apprentice",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 20,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 6,
    employeeType: "Part-Time",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 30,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 7,
    employeeType: "Intern",
    daysFrom: 90,
    daysTo: 180,
    basedOn: "Gross",
    bonusPercent: 25,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 8,
    employeeType: "Temporary",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Gross",
    bonusPercent: 30,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 9,
    employeeType: "Seasonal",
    daysFrom: 90,
    daysTo: 180,
    basedOn: "Basic",
    bonusPercent: 20,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 10,
    employeeType: "Outsourced",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 35,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 11,
    employeeType: "Consultant",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Gross",
    bonusPercent: 50,
    designation: "ALL",
    includeServiceLength: "Yes",
    isActive: "Active",
  },
  {
    sl: 12,
    employeeType: "Freelance",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 40,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 13,
    employeeType: "Daily Wager",
    daysFrom: 90,
    daysTo: 180,
    basedOn: "Basic",
    bonusPercent: 15,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 14,
    employeeType: "Project-Based",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Gross",
    bonusPercent: 45,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 15,
    employeeType: "Advisory Staff",
    daysFrom: 365,
    daysTo: 9999,
    basedOn: "Gross",
    bonusPercent: 80,
    designation: "ALL",
    includeServiceLength: "Yes",
    isActive: "Active",
  },
  {
    sl: 16,
    employeeType: "Trainee",
    daysFrom: 90,
    daysTo: 180,
    basedOn: "Basic",
    bonusPercent: 20,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 17,
    employeeType: "Shift-Worker",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 55,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 18,
    employeeType: "On-Call Staff",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 40,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 19,
    employeeType: "Retainer Contract",
    daysFrom: 180,
    daysTo: 365,
    basedOn: "Gross",
    bonusPercent: 40,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
  {
    sl: 20,
    employeeType: "Guest Expert",
    daysFrom: 90,
    daysTo: 365,
    basedOn: "Basic",
    bonusPercent: 50,
    designation: "ALL",
    includeServiceLength: "No",
    isActive: "Active",
  },
];

function CompensationSetupPage() {
  const [activeTab, setActiveTab] = useState<TabType>("allowance");
  const [searchQuery, setSearchQuery] = useState("");

  // Lists state
  const [allowances, setAllowances] = useState<AllowanceRate[]>([]);
  const [tiffinRates, setTiffinRates] = useState<TiffinRate[]>([]);
  const [lunchRates, setLunchRates] = useState<LunchRate[]>([]);
  const [conveyances, setConveyances] = useState<ConveyanceSetup[]>([]);
  const [bonuses, setBonuses] = useState<BonusSetting[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabType;
      if (tabParam && ["allowance", "tiffin", "lunch", "conveyance", "bonus"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    const safeParse = (key: string, defaultVal: any) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return defaultVal;
        // Override if stored array is shorter than default to force load expanded mock data
        if (parsed.length < defaultVal.length) {
          return defaultVal;
        }
        return parsed;
      } catch (e) {
        return defaultVal;
      }
    };

    // Allowances
    const allowancesData = safeParse("hris_allowance_rates", DEFAULT_ALLOWANCES);
    setAllowances(allowancesData);
    localStorage.setItem("hris_allowance_rates", JSON.stringify(allowancesData));

    // Tiffin
    const tiffinData = safeParse("hris_tiffin_rates", DEFAULT_TIFFIN);
    setTiffinRates(tiffinData);
    localStorage.setItem("hris_tiffin_rates", JSON.stringify(tiffinData));

    // Lunch
    const lunchData = safeParse("hris_lunch_rates", DEFAULT_LUNCH);
    setLunchRates(lunchData);
    localStorage.setItem("hris_lunch_rates", JSON.stringify(lunchData));

    // Conveyance
    const conveyanceData = safeParse("hris_conveyance_setups", DEFAULT_CONVEYANCE);
    setConveyances(conveyanceData);
    localStorage.setItem("hris_conveyance_setups", JSON.stringify(conveyanceData));

    // Bonuses
    const bonusesData = safeParse("hris_bonus_settings", DEFAULT_BONUSES);
    setBonuses(bonusesData);
    localStorage.setItem("hris_bonus_settings", JSON.stringify(bonusesData));
  }, []);

  // Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSl, setEditSl] = useState<number | null>(null);

  // Form states - Allowance Rate
  const [company, setCompany] = useState("");
  const [area, setArea] = useState("");
  const [applicableFrom, setApplicableFrom] = useState("");
  const [applicableTo, setApplicableTo] = useState("");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [subDepartment, setSubDepartment] = useState("");
  const [designation, setDesignation] = useState("ALL");
  const [workingHourFrom, setWorkingHourFrom] = useState("");
  const [workingHourTo, setWorkingHourTo] = useState("");
  const [salaryFrom, setSalaryFrom] = useState<number>(0);
  const [salaryTo, setSalaryTo] = useState<number>(0);
  const [rateFor, setRateFor] = useState("");
  const [basedOn, setBasedOn] = useState("--Select--");
  const [rate, setRate] = useState<number>(0);
  const [divByHour, setDivByHour] = useState("");
  const [divByDay, setDivByDay] = useState("No");
  const [getAfterReq, setGetAfterReq] = useState("No");
  const [getAfterReqRate, setGetAfterReqRate] = useState<number>(0);
  const [eotAfter, setEotAfter] = useState<number>(0);
  const [lunch, setLunch] = useState<number>(0);
  const [dinner, setDinner] = useState<number>(0);
  const [allowanceIsActive, setAllowanceIsActive] = useState<"Active" | "Inactive">("Active");
  const [calculationFor, setCalculationFor] = useState("Shift");

  // Form states - Tiffin Rate
  const [tiffinCompany, setTiffinCompany] = useState("Aleya Apparels Ltd.");
  const [tiffinArea, setTiffinArea] = useState("Aleya-Factory");
  const [tiffinApplicableFrom, setTiffinApplicableFrom] = useState("2026-01-01");
  const [tiffinApplicableTo, setTiffinApplicableTo] = useState("2026-12-31");
  const [tiffinEmpType, setTiffinEmpType] = useState("ALL");
  const [tiffinDepartment, setTiffinDepartment] = useState("All Departments");
  const [tiffinSection, setTiffinSection] = useState("ALL");
  const [tiffinDesignation, setTiffinDesignation] = useState("ALL");
  const [tiffinWorkingHourFrom, setTiffinWorkingHourFrom] = useState("08:00");
  const [tiffinWorkingHourTo, setTiffinWorkingHourTo] = useState("17:00");
  const [tiffinBasedOn, setTiffinBasedOn] = useState("Hour");
  const [tiffinWorkingShift, setTiffinWorkingShift] = useState("Day");
  const [tiffinRateVal, setTiffinRateVal] = useState<number>(50);
  const [tiffinIsActive, setTiffinIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Lunch Rate
  const [lunchEmpType, setLunchEmpType] = useState("ALL");
  const [lunchRateVal, setLunchRateVal] = useState<number>(80);
  const [lunchIsActive, setLunchIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Conveyance
  const [convEmpType, setConvEmpType] = useState("ALL");
  const [convAmount, setConvAmount] = useState<number>(1500);
  const [convIsActive, setConvIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Bonus
  const [bonusEmpType, setBonusEmpType] = useState("ALL");
  const [bonusDaysFrom, setBonusDaysFrom] = useState<number>(180);
  const [bonusDaysTo, setBonusDaysTo] = useState<number>(365);
  const [bonusBasedOn, setBonusBasedOn] = useState("Basic");
  const [bonusPercent, setBonusPercent] = useState<number>(50);
  const [bonusDesignation, setBonusDesignation] = useState("ALL");
  const [bonusIncludeServiceLength, setBonusIncludeServiceLength] = useState<"Yes" | "No">("Yes");
  const [bonusIsActive, setBonusIsActive] = useState<"Active" | "Inactive">("Active");

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "allowance") {
      const item = allowances.find((a) => a.sl === sl);
      setCompany(item?.company || "Pakiza Knit Composite Ltd");
      setArea(item?.area || "Factory");
      setApplicableFrom(item?.applicableFrom || "");
      setApplicableTo(item?.applicableTo || "");
      setEmployeeType(item?.employeeType || "ALL");
      setDepartment(item?.department || "All Departments");
      setSubDepartment(item?.subDepartment || "ALL");
      setDesignation(item?.designation || "ALL");
      setWorkingHourFrom(item?.workingHourFrom || "");
      setWorkingHourTo(item?.workingHourTo || "");
      setSalaryFrom(item?.salaryFrom || 0);
      setSalaryTo(item?.salaryTo || 0);
      setRateFor(item?.rateFor || "");
      setBasedOn(item?.basedOn || "--Select--");
      setRate(item?.rate || 0);
      setDivByHour(item?.divByHour || "");
      setDivByDay(item?.divByDay || "No");
      setGetAfterReq(item?.getAfterReq || "No");
      setGetAfterReqRate(item?.getAfterReqRate || 0);
      setEotAfter(item?.eotAfter || 0);
      setLunch(item?.lunch || 0);
      setDinner(item?.dinner || 0);
      setAllowanceIsActive(item?.isActive || "Active");
      setCalculationFor(item?.calculationFor || "Shift");
    } else if (activeTab === "tiffin") {
      const item = tiffinRates.find((t) => t.sl === sl);
      setTiffinCompany(item?.company || "Aleya Apparels Ltd.");
      setTiffinArea(item?.area || "Aleya-Factory");
      setTiffinApplicableFrom(item?.applicableFrom || "2026-01-01");
      setTiffinApplicableTo(item?.applicableTo || "2026-12-31");
      setTiffinEmpType(item?.employeeType || "ALL");
      setTiffinDepartment(item?.department || "All Departments");
      setTiffinSection(item?.section || "ALL");
      setTiffinDesignation(item?.designation || "ALL");
      setTiffinWorkingHourFrom(item?.workingHourFrom || "08:00");
      setTiffinWorkingHourTo(item?.workingHourTo || "17:00");
      setTiffinBasedOn(item?.basedOnTiffin || "Hour");
      setTiffinWorkingShift(item?.workingShift || "Day");
      setTiffinRateVal(item?.rate || 50);
      setTiffinIsActive(item?.isActive || "Active");
    } else if (activeTab === "lunch") {
      const item = lunchRates.find((l) => l.sl === sl);
      setLunchEmpType(item?.employeeType || "ALL");
      setLunchRateVal(item?.rate || 80);
      setLunchIsActive(item?.isActive || "Active");
    } else if (activeTab === "conveyance") {
      const item = conveyances.find((c) => c.sl === sl);
      setConvEmpType(item?.employeeType || "ALL");
      setConvAmount(item?.amount || 1500);
      setConvIsActive(item?.isActive || "Active");
    } else if (activeTab === "bonus") {
      const item = bonuses.find((b) => b.sl === sl);
      setBonusEmpType(item?.employeeType || "ALL");
      setBonusDaysFrom(item?.daysFrom || 180);
      setBonusDaysTo(item?.daysTo || 365);
      setBonusBasedOn(item?.basedOn || "Basic");
      setBonusPercent(item?.bonusPercent || 50);
      setBonusDesignation(item?.designation || "ALL");
      setBonusIncludeServiceLength(item?.includeServiceLength || "Yes");
      setBonusIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "allowance") {
      const updated = allowances
        .filter((a) => a.sl !== sl)
        .map((a, idx) => ({ ...a, sl: idx + 1 }));
      setAllowances(updated);
      localStorage.setItem("hris_allowance_rates", JSON.stringify(updated));
    } else if (activeTab === "tiffin") {
      const updated = tiffinRates
        .filter((t) => t.sl !== sl)
        .map((t, idx) => ({ ...t, sl: idx + 1 }));
      setTiffinRates(updated);
      localStorage.setItem("hris_tiffin_rates", JSON.stringify(updated));
    } else if (activeTab === "lunch") {
      const updated = lunchRates
        .filter((l) => l.sl !== sl)
        .map((l, idx) => ({ ...l, sl: idx + 1 }));
      setLunchRates(updated);
      localStorage.setItem("hris_lunch_rates", JSON.stringify(updated));
    } else if (activeTab === "conveyance") {
      const updated = conveyances
        .filter((c) => c.sl !== sl)
        .map((c, idx) => ({ ...c, sl: idx + 1 }));
      setConveyances(updated);
      localStorage.setItem("hris_conveyance_setups", JSON.stringify(updated));
    } else if (activeTab === "bonus") {
      const updated = bonuses.filter((b) => b.sl !== sl).map((b, idx) => ({ ...b, sl: idx + 1 }));
      setBonuses(updated);
      localStorage.setItem("hris_bonus_settings", JSON.stringify(updated));
    }

    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "allowance") {
      if (!company || !applicableFrom || !applicableTo) {
        toast.error("Required fields must be filled.");
        return;
      }
      let nextList = [...allowances];
      if (editSl !== null) {
        nextList = allowances.map((a) =>
          a.sl === editSl
            ? {
              ...a,
              company,
              area,
              applicableFrom,
              applicableTo,
              employeeType,
              department,
              subDepartment,
              designation,
              workingHourFrom,
              workingHourTo,
              salaryFrom: Number(salaryFrom),
              salaryTo: Number(salaryTo),
              rateFor,
              basedOn,
              rate: Number(rate),
              divByHour,
              divByDay,
              getAfterReq,
              getAfterReqRate: Number(getAfterReqRate),
              eotAfter: Number(eotAfter),
              lunch: Number(lunch),
              dinner: Number(dinner),
              isActive: allowanceIsActive,
              calculationFor,
            }
            : a,
        );
      } else {
        const sl = allowances.length > 0 ? Math.max(...allowances.map((a) => a.sl)) + 1 : 1;
        nextList.push({
          sl,
          company,
          area,
          applicableFrom,
          applicableTo,
          employeeType,
          department,
          subDepartment,
          designation,
          workingHourFrom,
          workingHourTo,
          salaryFrom: Number(salaryFrom),
          salaryTo: Number(salaryTo),
          rateFor,
          basedOn,
          rate: Number(rate),
          divByHour,
          divByDay,
          getAfterReq,
          getAfterReqRate: Number(getAfterReqRate),
          eotAfter: Number(eotAfter),
          lunch: Number(lunch),
          dinner: Number(dinner),
          isActive: allowanceIsActive,
          calculationFor,
        });
      }
      setAllowances(nextList);
      localStorage.setItem("hris_allowance_rates", JSON.stringify(nextList));
    } else if (activeTab === "tiffin") {
      let nextList = [...tiffinRates];
      if (editSl !== null) {
        nextList = tiffinRates.map((t) =>
          t.sl === editSl
            ? {
              ...t,
              company: tiffinCompany,
              area: tiffinArea,
              applicableFrom: tiffinApplicableFrom,
              applicableTo: tiffinApplicableTo,
              employeeType: tiffinEmpType,
              department: tiffinDepartment,
              section: tiffinSection,
              designation: tiffinDesignation,
              workingHourFrom: tiffinWorkingHourFrom,
              workingHourTo: tiffinWorkingHourTo,
              basedOnTiffin: tiffinBasedOn,
              workingShift: tiffinWorkingShift,
              rate: Number(tiffinRateVal),
              isActive: tiffinIsActive,
            }
            : t,
        );
      } else {
        const sl = tiffinRates.length > 0 ? Math.max(...tiffinRates.map((t) => t.sl)) + 1 : 1;
        nextList.push({
          sl,
          company: tiffinCompany,
          area: tiffinArea,
          applicableFrom: tiffinApplicableFrom,
          applicableTo: tiffinApplicableTo,
          employeeType: tiffinEmpType,
          department: tiffinDepartment,
          section: tiffinSection,
          designation: tiffinDesignation,
          workingHourFrom: tiffinWorkingHourFrom,
          workingHourTo: tiffinWorkingHourTo,
          basedOnTiffin: tiffinBasedOn,
          workingShift: tiffinWorkingShift,
          rate: Number(tiffinRateVal),
          isActive: tiffinIsActive,
        });
      }
      setTiffinRates(nextList);
      localStorage.setItem("hris_tiffin_rates", JSON.stringify(nextList));
    } else if (activeTab === "lunch") {
      let nextList = [...lunchRates];
      if (editSl !== null) {
        nextList = lunchRates.map((l) =>
          l.sl === editSl
            ? {
              ...l,
              employeeType: lunchEmpType,
              rate: Number(lunchRateVal),
              isActive: lunchIsActive,
            }
            : l,
        );
      } else {
        const sl = lunchRates.length > 0 ? Math.max(...lunchRates.map((l) => l.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: lunchEmpType,
          rate: Number(lunchRateVal),
          isActive: lunchIsActive,
        });
      }
      setLunchRates(nextList);
      localStorage.setItem("hris_lunch_rates", JSON.stringify(nextList));
    } else if (activeTab === "conveyance") {
      let nextList = [...conveyances];
      if (editSl !== null) {
        nextList = conveyances.map((c) =>
          c.sl === editSl
            ? {
              ...c,
              employeeType: convEmpType,
              amount: Number(convAmount),
              isActive: convIsActive,
            }
            : c,
        );
      } else {
        const sl = conveyances.length > 0 ? Math.max(...conveyances.map((c) => c.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: convEmpType,
          amount: Number(convAmount),
          isActive: convIsActive,
        });
      }
      setConveyances(nextList);
      localStorage.setItem("hris_conveyance_setups", JSON.stringify(nextList));
    } else if (activeTab === "bonus") {
      let nextList = [...bonuses];
      if (editSl !== null) {
        nextList = bonuses.map((b) =>
          b.sl === editSl
            ? {
              ...b,
              employeeType: bonusEmpType,
              daysFrom: Number(bonusDaysFrom),
              daysTo: Number(bonusDaysTo),
              basedOn: bonusBasedOn,
              bonusPercent: Number(bonusPercent),
              designation: bonusDesignation,
              includeServiceLength: bonusIncludeServiceLength,
              isActive: bonusIsActive,
            }
            : b,
        );
      } else {
        const sl = bonuses.length > 0 ? Math.max(...bonuses.map((b) => b.sl)) + 1 : 1;
        nextList.push({
          sl,
          employeeType: bonusEmpType,
          daysFrom: Number(bonusDaysFrom),
          daysTo: Number(bonusDaysTo),
          basedOn: bonusBasedOn,
          bonusPercent: Number(bonusPercent),
          designation: bonusDesignation,
          includeServiceLength: bonusIncludeServiceLength,
          isActive: bonusIsActive,
        });
      }
      setBonuses(nextList);
      localStorage.setItem("hris_bonus_settings", JSON.stringify(nextList));
    }

    toast.success("Saved successfully");
    setIsFormOpen(false);
  };

  const insetWrapperClass = "space-y-1.5 flex flex-col relative";
  const insetLabelClass = "text-[11px] font-bold uppercase text-slate-600 tracking-wider [&:has(>span)]:text-slate-600";
  const insetInputClass = "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] text-sm shadow-sm placeholder:text-slate-400";
  const insetSelectClass = "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] text-sm appearance-none cursor-pointer shadow-sm bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m7%2015%205%205%205-5%22%2F%3E%3Cpath%20d%3D%22m7%209%205-5%205%205%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center]";

  // Tab Header Items
  const tabsList: { type: TabType; label: string; icon: any }[] = [
    { type: "allowance", label: "Allowance Rate", icon: Coins },
    { type: "tiffin", label: "Tiffin Rate", icon: Coffee },
    { type: "lunch", label: "Lunch Rate", icon: Coffee },
    { type: "conveyance", label: "Conveyance Setup", icon: Truck },
    { type: "bonus", label: "Bonus Setting", icon: Gift },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-2 max-w-[1800px] mx-auto w-full">
          {/* Breadcrumb & Header */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3.5" />
                <span>Configure</span>
                <ChevronRight className="size-3.5" />
                <span className="text-primary font-bold">Allowances & Bonuses</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Coins className="size-6 text-primary" />
                Compensation Configuration
              </h1>
            </div>
            <button
              onClick={() => openForm(null)}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="size-4.5" /> Add New Record
            </button>
          </div>

          {/* Horizontal Master Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 pb-5 border-b border-border/40 mb-4">
            {tabsList.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => {
                    setActiveTab(tab.type);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium"
                    }`}
                >
                  <TabIcon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar & Actions toolbar */}
          <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="w-full md:w-80 h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus-within:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all flex items-center gap-2.5 shadow-sm">
              <Search className="size-4.5 text-muted-foreground/70" />
              <input
                type="text"
                placeholder={`Search ${tabsList.find((t) => t.type === activeTab)?.label}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/50 font-medium"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <button
                onClick={() => toast.success("Exporting to Excel...")}
                className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm"
              >
                <FileSpreadsheet className="size-4.5 text-emerald-600" /> Excel
              </button>
              <button
                onClick={() => window.print()}
                className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm"
              >
                <Printer className="size-4.5 text-blue-600" /> Print
              </button>
              <button
                onClick={() => toast.success("Generating PDF...")}
                className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm"
              >
                <FileText className="size-4.5 text-red-600" /> PDF
              </button>
            </div>
          </div>

          {/* Master Table Router */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === "allowance" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "2000px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        SL
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 w-[120px] text-center">Applicable From</th>
                      <th className="px-5 py-4 w-[120px] text-center">Applicable To</th>
                      <th className="px-5 py-4 w-[120px]">Employee Type</th>
                      <th className="px-5 py-4 w-[150px]">Department</th>
                      <th className="px-5 py-4 w-[150px]">Sub Department</th>
                      <th className="px-5 py-4 w-[150px]">Designation</th>
                      <th className="px-5 py-4 w-[120px] text-center">Working Hours From</th>
                      <th className="px-5 py-4 w-[120px] text-center">Working Hours To</th>
                      <th className="px-5 py-4 w-[110px] text-right">Salary From</th>
                      <th className="px-5 py-4 w-[110px] text-right">Salary To</th>
                      <th className="px-5 py-4 w-[120px]">Rate For</th>
                      <th className="px-5 py-4 w-[110px]">Based On</th>
                      <th className="px-5 py-4 w-[100px] text-center">Rate</th>
                      <th className="px-5 py-4 w-[100px] text-center">Div By Hour</th>
                      <th className="px-5 py-4 w-[100px] text-center">Div By Day</th>
                      <th className="px-5 py-4 w-[120px] text-center">Get After Req</th>
                      <th className="px-5 py-4 w-[100px] text-center">Rate</th>
                      <th className="px-5 py-4 w-[100px] text-center">EOT After</th>
                      <th className="px-5 py-4 w-[100px] text-center">Lunch</th>
                      <th className="px-5 py-4 w-[100px] text-center">Dinner</th>
                      <th className="px-5 py-4 w-[150px]">Calculation For</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {allowances
                      .filter((a) =>
                        (a.company || "").toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((item, idx) => (
                        <tr
                          key={item.sl}
                          className="group hover:bg-muted/50 transition-all"
                        >
                          <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                            {idx + 1}
                          </td>
                          <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openForm(item.sl)}
                                className="text-orange-500 hover:text-orange-600 transition"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.sl)}
                                className="text-red-500 hover:text-red-650 transition"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.applicableFrom}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.applicableTo}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.employeeType}</td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.department}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.subDepartment || "—"}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.designation}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.workingHourFrom || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.workingHourTo || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-right font-normal font-mono">
                            {item.salaryFrom}
                          </td>
                          <td className="px-5 py-3.5 text-right font-normal font-mono">
                            {item.salaryTo}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.rateFor || "—"}</td>
                          <td className="px-5 py-3.5 font-normal">{item.basedOn}</td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.rate}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal">
                            {item.divByHour || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal">
                            {item.divByDay || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal">
                            {item.getAfterReq}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.getAfterReqRate}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.eotAfter}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.lunch}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.dinner}
                          </td>
                          <td className="px-5 py-3.5 font-normal">
                            {item.calculationFor || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
                            >
                              {item.isActive}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeTab === "tiffin" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "1600px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        SL
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 w-[150px]">Company</th>
                      <th className="px-5 py-4 w-[120px]">Area</th>
                      <th className="px-5 py-4 w-[120px] text-center">Applicable From</th>
                      <th className="px-5 py-4 w-[120px] text-center">Applicable To</th>
                      <th className="px-5 py-4 w-[120px]">Employee Type</th>
                      <th className="px-5 py-4 w-[150px]">Department</th>
                      <th className="px-5 py-4 w-[120px]">Section</th>
                      <th className="px-5 py-4 w-[120px]">Designation</th>
                      <th className="px-5 py-4 w-[120px] text-center">Hours From</th>
                      <th className="px-5 py-4 w-[120px] text-center">Hours To</th>
                      <th className="px-5 py-4 w-[110px]">Based On</th>
                      <th className="px-5 py-4 w-[110px]">Working Shift</th>
                      <th className="px-5 py-4 w-[100px] text-right">Tiffin Rate</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {tiffinRates
                      .filter(
                        (t) =>
                          (t.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((item, idx) => (
                        <tr
                          key={item.sl}
                          className="group hover:bg-muted/50 transition-all"
                        >
                          <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                            {idx + 1}
                          </td>
                          <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openForm(item.sl)}
                                className="text-orange-500 hover:text-orange-600 transition"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.sl)}
                                className="text-red-500 hover:text-red-650 transition"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-normal">
                            {item.company || "Aleya Apparels Ltd."}
                          </td>
                          <td className="px-5 py-3.5 font-normal">
                            {item.area || "Aleya-Factory"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.applicableFrom || "2026-01-01"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.applicableTo || "2026-12-31"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.employeeType}</td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.department || "All Departments"}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.section || "ALL"}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">
                            {item.designation || "ALL"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.workingHourFrom || "08:00"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.workingHourTo || "17:00"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">
                            {item.basedOnTiffin || "Hour"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.workingShift || "Day"}</td>
                          <td className="px-5 py-3.5 text-right font-normal font-mono">
                            {item.rate} BDT
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
                            >
                              {item.isActive}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeTab === "lunch" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "800px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 min-w-[300px]">Employee Type</th>
                      <th className="px-5 py-4 w-[150px] text-right">Lunch Rate</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {lunchRates
                      .filter((l) =>
                        (l.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((item, idx) => (
                        <tr
                          key={item.sl}
                          className="group hover:bg-muted/50 transition-all"
                        >
                          <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                            {idx + 1}
                          </td>
                          <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openForm(item.sl)}
                                className="text-orange-500 hover:text-orange-600 transition"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.sl)}
                                className="text-red-500 hover:text-red-650 transition"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.employeeType}
                          </td>
                          <td className="px-5 py-3.5 text-right font-normal font-mono">
                            {item.rate} BDT
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
                            >
                              {item.isActive}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeTab === "conveyance" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "800px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 min-w-[300px]">Employee Type</th>
                      <th className="px-5 py-4 w-[150px] text-right">Conveyance Amount</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {conveyances
                      .filter((c) =>
                        (c.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((item, idx) => (
                        <tr
                          key={item.sl}
                          className="group hover:bg-muted/50 transition-all"
                        >
                          <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                            {idx + 1}
                          </td>
                          <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openForm(item.sl)}
                                className="text-orange-500 hover:text-orange-600 transition"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.sl)}
                                className="text-red-500 hover:text-red-650 transition"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.employeeType}
                          </td>
                          <td className="px-5 py-3.5 text-right font-normal font-mono">
                            {item.amount} BDT
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
                            >
                              {item.isActive}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeTab === "bonus" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "900px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 min-w-[180px]">Employee Type</th>
                      <th className="px-5 py-4 w-[120px] text-center">Days Form</th>
                      <th className="px-5 py-4 w-[120px] text-center">Days To</th>
                      <th className="px-5 py-4 w-[150px]">Based On</th>
                      <th className="px-5 py-4 w-[120px] text-center">Bonus (%)</th>
                      <th className="px-5 py-4 min-w-[150px]">Designation</th>
                      <th className="px-5 py-4 w-[160px] text-center">Inc. Service Length</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {bonuses
                      .filter((b) =>
                        (b.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((item, idx) => (
                        <tr
                          key={item.sl}
                          className="group hover:bg-muted/50 transition-all"
                        >
                          <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                            {idx + 1}
                          </td>
                          <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openForm(item.sl)}
                                className="text-orange-500 hover:text-orange-600 transition"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.sl)}
                                className="text-red-500 hover:text-red-650 transition"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.employeeType}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.daysFrom}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.daysTo}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.basedOn}</td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.bonusPercent}%
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.designation || "ALL"}</td>
                          <td className="px-5 py-3.5 text-center font-normal">
                            {item.includeServiceLength || "Yes"}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
                            >
                              {item.isActive}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Master Modal Router */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div
              className={`bg-white border-slate-200 w-full rounded-2xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 ${activeTab === "allowance" ? "max-w-6xl" : activeTab === "tiffin" ? "max-w-4xl" : "max-w-2xl"}`}
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-full bg-[#0f172a] text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-slate-800">
                      {editSl ? "Update" : "Create"}{" "}
                      {tabsList.find((t) => t.type === activeTab)?.label}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeTab === "allowance" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Scope & Target */}
                    <div className="space-y-4 bg-muted/5 p-4 rounded-xl border border-border/30">
                      <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2 mb-3">
                        Scope & Target
                      </h3>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Company <span className="text-red-500">*</span></label>
                        <select
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className={insetSelectClass}
                          required
                        >
                          <option value="ALL">ALL</option>
                          <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                          <option value="Aleya Apparels Ltd.">Aleya Apparels Ltd.</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Area <span className="text-red-500">*</span></label>
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className={insetSelectClass}
                          required
                        >
                          <option value="ALL">ALL</option>
                          <option value="Factory">Factory</option>
                          <option value="Aleya-Factory">Aleya-Factory</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Employee Type <span className="text-red-500">*</span></label>
                        <select
                          value={employeeType}
                          onChange={(e) => setEmployeeType(e.target.value)}
                          className={insetSelectClass}
                          required
                        >
                          <option value="ALL">ALL</option>
                          <option value="Worker">Worker</option>
                          <option value="Operator">Operator</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Helper">Helper</option>
                          <option value="Admin staff">Admin staff</option>
                          <option value="Permanent Worker">Permanent Worker</option>
                          <option value="Casual Worker">Casual Worker</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Department</label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="All Departments">All Departments</option>
                          <option value="HR, Admin and Compliance">HR, Admin and Compliance</option>
                          <option value="Production Dept">Production Dept</option>
                          <option value="HR & Admin">HR & Admin</option>
                          <option value="Quality Assurance">Quality Assurance</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Section</label>
                        <select
                          value={subDepartment}
                          onChange={(e) => setSubDepartment(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                          <option value="Admin">Admin</option>
                          <option value="Sewing Section">Sewing Section</option>
                          <option value="Finishing Section">Finishing Section</option>
                          <option value="Cutting Section">Cutting Section</option>
                          <option value="Inspection">Inspection</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Designation</label>
                        <select
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                          <option value="Driver">Driver</option>
                          <option value="Operator">Operator</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Helper">Helper</option>
                          <option value="QC Inspector">QC Inspector</option>
                          <option value="Executive">Executive</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>IsActive <span className="text-red-500">*</span></label>
                        <select
                          value={allowanceIsActive}
                          onChange={(e) => setAllowanceIsActive(e.target.value as any)}
                          className={insetSelectClass}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Column 2: Date, Salary & Working Hours */}
                    <div className="space-y-4 bg-muted/5 p-4 rounded-xl border border-border/30">
                      <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2 mb-3">
                        Timing & Salary Ranges
                      </h3>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Applicable From <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          value={applicableFrom}
                          onChange={(e) => setApplicableFrom(e.target.value)}
                          className={insetInputClass}
                          required
                        />
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Applicable To <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          value={applicableTo}
                          onChange={(e) => setApplicableTo(e.target.value)}
                          className={insetInputClass}
                          required
                        />
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Working Hour From</label>
                        <input
                          type="text"
                          value={workingHourFrom}
                          onChange={(e) => setWorkingHourFrom(e.target.value)}
                          className={insetInputClass}
                          placeholder="00:00"
                        />
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Working Hour To</label>
                        <input
                          type="text"
                          value={workingHourTo}
                          onChange={(e) => setWorkingHourTo(e.target.value)}
                          className={insetInputClass}
                          placeholder="00:00"
                        />
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Salary From</label>
                        <input
                          type="number"
                          value={salaryFrom}
                          onChange={(e) => setSalaryFrom(Number(e.target.value))}
                          className={insetInputClass}
                          placeholder="0"
                        />
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Salary To</label>
                        <input
                          type="number"
                          value={salaryTo}
                          onChange={(e) => setSalaryTo(Number(e.target.value))}
                          className={insetInputClass}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Column 3: Rate, Breaks & Special Rules */}
                    <div className="space-y-4 bg-muted/5 p-4 rounded-xl border border-border/30">
                      <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2 mb-3">
                        Rates, Breaks & Special Rules
                      </h3>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Rate For</label>
                        <select
                          value={rateFor}
                          onChange={(e) => setRateFor(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="ALL">ALL</option>
                          <option value="Holiday">Holiday</option>
                          <option value="Overtime">Overtime</option>
                          <option value="Friday">Friday</option>
                          <option value="Night">Night</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Based On</label>
                        <select
                          value={basedOn}
                          onChange={(e) => setBasedOn(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="--Select--">--Select--</option>
                          <option value="Basic">Basic</option>
                          <option value="Basic Salary">Basic Salary</option>
                          <option value="Gross">Gross</option>
                          <option value="Fixed">Fixed</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={rate}
                          onChange={(e) => setRate(Number(e.target.value))}
                          className={insetInputClass}
                          placeholder="0.00"
                        />
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Div By Hour</label>
                        <select
                          value={divByHour}
                          onChange={(e) => setDivByHour(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Div By Day</label>
                        <select
                          value={divByDay}
                          onChange={(e) => setDivByDay(e.target.value)}
                          className={insetSelectClass}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Get After Regular</label>
                          <select
                            value={getAfterReq}
                            onChange={(e) => setGetAfterReq(e.target.value)}
                            className={insetSelectClass}
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Rate</label>
                          <input
                            type="number"
                            value={getAfterReqRate}
                            onChange={(e) => setGetAfterReqRate(Number(e.target.value))}
                            className={insetInputClass}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>EOT After</label>
                        <input
                          type="number"
                          value={eotAfter}
                          onChange={(e) => setEotAfter(Number(e.target.value))}
                          className={insetInputClass}
                          placeholder="0"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Lunch Break</label>
                          <input
                            type="number"
                            value={lunch}
                            onChange={(e) => setLunch(Number(e.target.value))}
                            className={insetInputClass}
                            placeholder="0"
                          />
                        </div>
                        <div className={insetWrapperClass}>
                          <label className={insetLabelClass}>Dinner Break</label>
                          <input
                            type="number"
                            value={dinner}
                            onChange={(e) => setDinner(Number(e.target.value))}
                            className={insetInputClass}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Calculation For <span className="text-red-500">*</span></label>
                        <select
                          value={calculationFor}
                          onChange={(e) => setCalculationFor(e.target.value)}
                          className={insetSelectClass}
                          required
                        >
                          <option value="Shift">Shift</option>
                          <option value="Shift For Allowance">Shift For Allowance</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "tiffin" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company <span className="text-red-500">*</span></label>
                      <select
                        value={tiffinCompany}
                        onChange={(e) => setTiffinCompany(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="Aleya Apparels Ltd.">Aleya Apparels Ltd.</option>
                        <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                        <option value="Cripton Group">Cripton Group</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Area <span className="text-red-500">*</span></label>
                      <select
                        value={tiffinArea}
                        onChange={(e) => setTiffinArea(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="Aleya-Factory">Aleya-Factory</option>
                        <option value="Pakiza-Factory">Pakiza-Factory</option>
                        <option value="Factory">Factory</option>
                        <option value="Head Office">Head Office</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Applicable From <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        value={tiffinApplicableFrom}
                        onChange={(e) => setTiffinApplicableFrom(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Applicable To <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        value={tiffinApplicableTo}
                        onChange={(e) => setTiffinApplicableTo(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type</label>
                      <select
                        value={tiffinEmpType}
                        onChange={(e) => setTiffinEmpType(e.target.value)}
                        className={insetSelectClass}
                      >
                        <option value="ALL">ALL</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Casual">Casual</option>
                        <option value="Contractual">Contractual</option>
                        <option value="Operator">Operator</option>
                        <option value="Helper">Helper</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department</label>
                      <select
                        value={tiffinDepartment}
                        onChange={(e) => setTiffinDepartment(e.target.value)}
                        className={insetSelectClass}
                      >
                        <option value="All Departments">All Departments</option>
                        <option value="Production Dept">Production Dept</option>
                        <option value="Quality Assurance">Quality Assurance</option>
                        <option value="HR & Admin">HR & Admin</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Section</label>
                      <select
                        value={tiffinSection}
                        onChange={(e) => setTiffinSection(e.target.value)}
                        className={insetSelectClass}
                      >
                        <option value="ALL">ALL</option>
                        <option value="Sewing Section">Sewing Section</option>
                        <option value="Cutting Section">Cutting Section</option>
                        <option value="Finishing Section">Finishing Section</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Designation</label>
                      <select
                        value={tiffinDesignation}
                        onChange={(e) => setTiffinDesignation(e.target.value)}
                        className={insetSelectClass}
                      >
                        <option value="ALL">ALL</option>
                        <option value="Operator">Operator</option>
                        <option value="Helper">Helper</option>
                        <option value="QC Inspector">QC Inspector</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Working Hour From</label>
                      <input
                        type="text"
                        placeholder="e.g. 08:00"
                        value={tiffinWorkingHourFrom}
                        onChange={(e) => setTiffinWorkingHourFrom(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Working Hour To</label>
                      <input
                        type="text"
                        placeholder="e.g. 17:00"
                        value={tiffinWorkingHourTo}
                        onChange={(e) => setTiffinWorkingHourTo(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive <span className="text-red-500">*</span></label>
                      <select
                        value={tiffinIsActive}
                        onChange={(e) => setTiffinIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Based On Tiffin <span className="text-red-500">*</span></label>
                      <select
                        value={tiffinBasedOn}
                        onChange={(e) => setTiffinBasedOn(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="Hour">Hour</option>
                        <option value="Fixed">Fixed</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Working Shift</label>
                      <select
                        value={tiffinWorkingShift}
                        onChange={(e) => setTiffinWorkingShift(e.target.value)}
                        className={insetSelectClass}
                      >
                        <option value="Day">Day</option>
                        <option value="Night">Night</option>
                        <option value="All">All</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Rate</label>
                      <input
                        type="number"
                        placeholder="Rate"
                        value={tiffinRateVal}
                        onChange={(e) => setTiffinRateVal(Number(e.target.value))}
                        className={insetInputClass}
                        required
                      />
                    </div>
                  </div>
                )}

                {activeTab === "lunch" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={lunchEmpType}
                        onChange={(e) => setLunchEmpType(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Lunch Rate (BDT) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        value={lunchRateVal}
                        onChange={(e) => setLunchRateVal(Number(e.target.value))}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive <span className="text-red-500">*</span></label>
                      <select
                        value={lunchIsActive}
                        onChange={(e) => setLunchIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "conveyance" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={convEmpType}
                        onChange={(e) => setConvEmpType(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Conveyance Amount (BDT) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        value={convAmount}
                        onChange={(e) => setConvAmount(Number(e.target.value))}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive <span className="text-red-500">*</span></label>
                      <select
                        value={convIsActive}
                        onChange={(e) => setConvIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "bonus" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type <span className="text-red-500">*</span></label>
                      <select
                        value={bonusEmpType}
                        onChange={(e) => setBonusEmpType(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="ALL">ALL</option>
                        <option value="Worker">Worker</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Casual">Casual</option>
                        <option value="Contractual">Contractual</option>
                        <option value="Apprentice">Apprentice</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Intern">Intern</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Seasonal">Seasonal</option>
                        <option value="Outsourced">Outsourced</option>
                        <option value="Consultant">Consultant</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Days Form <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        value={bonusDaysFrom}
                        onChange={(e) => setBonusDaysFrom(Number(e.target.value))}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Days To</label>
                      <input
                        type="number"
                        value={bonusDaysTo}
                        onChange={(e) => setBonusDaysTo(Number(e.target.value))}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Based On <span className="text-red-500">*</span></label>
                      <select
                        value={bonusBasedOn}
                        onChange={(e) => setBonusBasedOn(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="Basic">Basic</option>
                        <option value="Gross">Gross</option>
                        <option value="Fixed">Fixed</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Bonus (%) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        value={bonusPercent}
                        onChange={(e) => setBonusPercent(Number(e.target.value))}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Designation <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={bonusDesignation}
                        onChange={(e) => setBonusDesignation(e.target.value)}
                        className={insetInputClass}
                        placeholder="ALL"
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Is Include Service Length <span className="text-red-500">*</span></label>
                      <select
                        value={bonusIncludeServiceLength}
                        onChange={(e) =>
                          setBonusIncludeServiceLength(e.target.value as "Yes" | "No")
                        }
                        className={insetSelectClass}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive <span className="text-red-500">*</span></label>
                      <select
                        value={bonusIsActive}
                        onChange={(e) => setBonusIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="border-t border-border/50 pt-5 flex items-center justify-between gap-3 bg-transparent -mx-6 -mb-6 p-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="h-10 px-6 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-xs transition-all uppercase tracking-wider shadow-sm hover:shadow"
                  >
                    CLOSE
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-8 rounded-lg text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 bg-[#2ecc71] hover:bg-[#27ae60]"
                  >
                    {editSl ? "UPDATE" : "CREATE"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
