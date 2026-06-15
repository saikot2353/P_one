import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { 
  ChevronRight, Search, Plus, Pencil, Trash2, X,
  FileSpreadsheet, Printer, FileText, Coins, Gift, Coffee, Truck
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-compensation")({
  head: () => ({
    meta: [
      { title: "Allowances & Bonuses Setup — CRIPTON HRIS" },
      { name: "description", content: "Configure allowance rates, tiffin rates, lunch rates, conveyance, and bonus policies." },
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
  getAfterReq: string;
  getAfterReqRate: number;
  eotAfter: number;
  lunch: number;
  dinner: number;
  isActive: "Active" | "Inactive";
}

interface TiffinRate {
  sl: number;
  employeeType: string;
  rate: number;
  isActive: "Active" | "Inactive";
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
  isActive: "Active" | "Inactive";
}

// ----------------------------------------------------
// Defaults
// ----------------------------------------------------
const DEFAULT_ALLOWANCES: AllowanceRate[] = [
  { sl: 1, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "ALL", department: "All Departments", subDepartment: "ALL", designation: "ALL", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 10000, salaryTo: 100000, rateFor: "Holiday", basedOn: "Basic", rate: 1.5, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 2, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Operator", department: "Production Dept", subDepartment: "Sewing Section", designation: "Operator", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 8000, salaryTo: 16000, rateFor: "Overtime", basedOn: "Basic", rate: 2.0, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 3, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Helper", department: "Production Dept", subDepartment: "Sewing Section", designation: "Helper", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 8000, salaryTo: 10000, rateFor: "Overtime", basedOn: "Basic", rate: 2.0, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 4, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Staff", department: "Quality Assurance", subDepartment: "Inspection", designation: "QC Inspector", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 12000, salaryTo: 25000, rateFor: "Overtime", basedOn: "Gross", rate: 1.5, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 5, company: "Pakiza Knit Composite Ltd", area: "Head Office", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Officer", department: "HR & Admin", subDepartment: "Admin Support", designation: "HR Executive", workingHourFrom: "09:00", workingHourTo: "18:00", salaryFrom: 20000, salaryTo: 35000, rateFor: "Holiday", basedOn: "Flat Rate", rate: 1000, divByHour: "No", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 6, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Operator", department: "Production Dept", subDepartment: "Cutting Section", designation: "Cutter", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 9000, salaryTo: 15000, rateFor: "Overtime", basedOn: "Basic", rate: 2.0, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 7, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "ALL", department: "Maintenance Dept", subDepartment: "Machine Repairs", designation: "Electrician", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 10000, salaryTo: 22000, rateFor: "Night Shift", basedOn: "Flat Rate", rate: 150, divByHour: "No", getAfterReq: "Yes", getAfterReqRate: 4, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 8, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Worker", department: "Washing Department", subDepartment: "Washing Lab", designation: "Operator", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 8500, salaryTo: 14000, rateFor: "Overtime", basedOn: "Basic", rate: 2.0, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 9, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Security Guard", department: "Security & Safety", subDepartment: "Fire & Safety Wing", designation: "Security Guard", workingHourFrom: "06:00", workingHourTo: "18:00", salaryFrom: 9500, salaryTo: 15000, rateFor: "Holiday", basedOn: "Flat Rate", rate: 500, divByHour: "No", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 10, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Worker", department: "Packaging & Carton", subDepartment: "Carton Box Maker", designation: "Helper", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 8000, salaryTo: 9500, rateFor: "Overtime", basedOn: "Basic", rate: 2.0, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 11, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "ALL", department: "Store & Inventory", subDepartment: "Yarn Store", designation: "Store Executive", workingHourFrom: "08:30", workingHourTo: "17:30", salaryFrom: 15000, salaryTo: 28000, rateFor: "Overtime", basedOn: "Gross", rate: 1.5, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 12, company: "Pakiza Knit Composite Ltd", area: "Head Office", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Officer", department: "Finance & Accounts", subDepartment: "Accounts Payable", designation: "Senior Accountant", workingHourFrom: "09:00", workingHourTo: "18:00", salaryFrom: 30000, salaryTo: 55000, rateFor: "Holiday", basedOn: "Flat Rate", rate: 1500, divByHour: "No", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 13, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Driver", department: "Logistics & Supply", subDepartment: "Central Warehouse", designation: "Heavy Vehicle Driver", workingHourFrom: "08:00", workingHourTo: "18:00", salaryFrom: 12000, salaryTo: 20000, rateFor: "Holiday", basedOn: "Flat Rate", rate: 800, divByHour: "No", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 14, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Casual", department: "Production Dept", subDepartment: "Sewing Section", designation: "Helper", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 8000, salaryTo: 9000, rateFor: "Overtime", basedOn: "Basic", rate: 2.0, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 15, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Apprentice", department: "Production Dept", subDepartment: "Sewing Section", designation: "Trainee Operator", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 6000, salaryTo: 8000, rateFor: "Overtime", basedOn: "Basic", rate: 1.5, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 16, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "ALL", department: "Engineering & Utility", subDepartment: "Power House", designation: "Boiler Operator", workingHourFrom: "08:00", workingHourTo: "16:00", salaryFrom: 11000, salaryTo: 22000, rateFor: "Night Shift", basedOn: "Flat Rate", rate: 200, divByHour: "No", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 17, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Permanent", department: "Quality Assurance", subDepartment: "Inspection", designation: "QC Inspector", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 10000, salaryTo: 18000, rateFor: "Overtime", basedOn: "Basic", rate: 2.0, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 18, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Staff", department: "Production Dept", subDepartment: "Sample Section", designation: "Pattern Maker", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 15000, salaryTo: 28000, rateFor: "Overtime", basedOn: "Gross", rate: 1.5, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 19, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "ALL", department: "Production Dept", subDepartment: "Sewing Section", designation: "Line Leader", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 12000, salaryTo: 20000, rateFor: "Attendance Bonus", basedOn: "Flat Rate", rate: 500, divByHour: "No", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" },
  { sl: 20, company: "Pakiza Knit Composite Ltd", area: "Factory", applicableFrom: "2026-01-01", applicableTo: "2026-12-31", employeeType: "Supervisor", department: "Production Dept", subDepartment: "Sewing Section", designation: "Supervisor", workingHourFrom: "08:00", workingHourTo: "17:00", salaryFrom: 15000, salaryTo: 25000, rateFor: "Overtime", basedOn: "Basic", rate: 2.0, divByHour: "Yes", getAfterReq: "No", getAfterReqRate: 0, eotAfter: 0, lunch: 0, dinner: 0, isActive: "Active" }
];

const DEFAULT_TIFFIN: TiffinRate[] = [
  { sl: 1, employeeType: "ALL", rate: 50, isActive: "Active" },
  { sl: 2, employeeType: "Permanent", rate: 55, isActive: "Active" },
  { sl: 3, employeeType: "Casual", rate: 45, isActive: "Active" },
  { sl: 4, employeeType: "Contractual", rate: 60, isActive: "Active" },
  { sl: 5, employeeType: "Apprentice", rate: 40, isActive: "Active" },
  { sl: 6, employeeType: "Part-Time", rate: 50, isActive: "Active" },
  { sl: 7, employeeType: "Intern", rate: 60, isActive: "Active" },
  { sl: 8, employeeType: "Temporary", rate: 45, isActive: "Active" },
  { sl: 9, employeeType: "Seasonal", rate: 45, isActive: "Active" },
  { sl: 10, employeeType: "Outsourced", rate: 50, isActive: "Active" },
  { sl: 11, employeeType: "Consultant", rate: 70, isActive: "Active" },
  { sl: 12, employeeType: "Freelance", rate: 70, isActive: "Active" },
  { sl: 13, employeeType: "Daily Wager", rate: 40, isActive: "Active" },
  { sl: 14, employeeType: "Project-Based", rate: 60, isActive: "Active" },
  { sl: 15, employeeType: "Advisory Staff", rate: 80, isActive: "Active" },
  { sl: 16, employeeType: "Trainee", rate: 45, isActive: "Active" },
  { sl: 17, employeeType: "Shift-Worker", rate: 55, isActive: "Active" },
  { sl: 18, employeeType: "On-Call Staff", rate: 50, isActive: "Active" },
  { sl: 19, employeeType: "Retainer Contract", rate: 65, isActive: "Active" },
  { sl: 20, employeeType: "Guest Expert", rate: 75, isActive: "Active" }
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
  { sl: 20, employeeType: "Guest Expert", rate: 110, isActive: "Active" }
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
  { sl: 20, employeeType: "Guest Expert", amount: 3000, isActive: "Active" }
];

const DEFAULT_BONUSES: BonusSetting[] = [
  { sl: 1, employeeType: "ALL", daysFrom: 180, daysTo: 365, basedOn: "Basic", bonusPercent: 50, isActive: "Active" },
  { sl: 2, employeeType: "Permanent", daysFrom: 365, daysTo: 9999, basedOn: "Basic", bonusPercent: 100, isActive: "Active" },
  { sl: 3, employeeType: "Casual", daysFrom: 180, daysTo: 365, basedOn: "Gross", bonusPercent: 30, isActive: "Active" },
  { sl: 4, employeeType: "Contractual", daysFrom: 90, daysTo: 365, basedOn: "Basic", bonusPercent: 40, isActive: "Active" },
  { sl: 5, employeeType: "Apprentice", daysFrom: 180, daysTo: 365, basedOn: "Basic", bonusPercent: 20, isActive: "Active" },
  { sl: 6, employeeType: "Part-Time", daysFrom: 180, daysTo: 365, basedOn: "Basic", bonusPercent: 30, isActive: "Active" },
  { sl: 7, employeeType: "Intern", daysFrom: 90, daysTo: 180, basedOn: "Gross", bonusPercent: 25, isActive: "Active" },
  { sl: 8, employeeType: "Temporary", daysFrom: 180, daysTo: 365, basedOn: "Gross", bonusPercent: 30, isActive: "Active" },
  { sl: 9, employeeType: "Seasonal", daysFrom: 90, daysTo: 180, basedOn: "Basic", bonusPercent: 20, isActive: "Active" },
  { sl: 10, employeeType: "Outsourced", daysFrom: 180, daysTo: 365, basedOn: "Basic", bonusPercent: 35, isActive: "Active" },
  { sl: 11, employeeType: "Consultant", daysFrom: 180, daysTo: 365, basedOn: "Gross", bonusPercent: 50, isActive: "Active" },
  { sl: 12, employeeType: "Freelance", daysFrom: 180, daysTo: 365, basedOn: "Basic", bonusPercent: 40, isActive: "Active" },
  { sl: 13, employeeType: "Daily Wager", daysFrom: 90, daysTo: 180, basedOn: "Basic", bonusPercent: 15, isActive: "Active" },
  { sl: 14, employeeType: "Project-Based", daysFrom: 180, daysTo: 365, basedOn: "Gross", bonusPercent: 45, isActive: "Active" },
  { sl: 15, employeeType: "Advisory Staff", daysFrom: 365, daysTo: 9999, basedOn: "Gross", bonusPercent: 80, isActive: "Active" },
  { sl: 16, employeeType: "Trainee", daysFrom: 90, daysTo: 180, basedOn: "Basic", bonusPercent: 20, isActive: "Active" },
  { sl: 17, employeeType: "Shift-Worker", daysFrom: 180, daysTo: 365, basedOn: "Basic", bonusPercent: 55, isActive: "Active" },
  { sl: 18, employeeType: "On-Call Staff", daysFrom: 180, daysTo: 365, basedOn: "Basic", bonusPercent: 40, isActive: "Active" },
  { sl: 19, employeeType: "Retainer Contract", daysFrom: 180, daysTo: 365, basedOn: "Gross", bonusPercent: 40, isActive: "Active" },
  { sl: 20, employeeType: "Guest Expert", daysFrom: 90, daysTo: 365, basedOn: "Basic", bonusPercent: 50, isActive: "Active" }
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
  const [getAfterReq, setGetAfterReq] = useState("No");
  const [getAfterReqRate, setGetAfterReqRate] = useState<number>(0);
  const [eotAfter, setEotAfter] = useState<number>(0);
  const [lunch, setLunch] = useState<number>(0);
  const [dinner, setDinner] = useState<number>(0);
  const [allowanceIsActive, setAllowanceIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Tiffin Rate
  const [tiffinEmpType, setTiffinEmpType] = useState("ALL");
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
  const [bonusIsActive, setBonusIsActive] = useState<"Active" | "Inactive">("Active");

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "allowance") {
      const item = allowances.find(a => a.sl === sl);
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
      setGetAfterReq(item?.getAfterReq || "No");
      setGetAfterReqRate(item?.getAfterReqRate || 0);
      setEotAfter(item?.eotAfter || 0);
      setLunch(item?.lunch || 0);
      setDinner(item?.dinner || 0);
      setAllowanceIsActive(item?.isActive || "Active");
    } else if (activeTab === "tiffin") {
      const item = tiffinRates.find(t => t.sl === sl);
      setTiffinEmpType(item?.employeeType || "ALL");
      setTiffinRateVal(item?.rate || 50);
      setTiffinIsActive(item?.isActive || "Active");
    } else if (activeTab === "lunch") {
      const item = lunchRates.find(l => l.sl === sl);
      setLunchEmpType(item?.employeeType || "ALL");
      setLunchRateVal(item?.rate || 80);
      setLunchIsActive(item?.isActive || "Active");
    } else if (activeTab === "conveyance") {
      const item = conveyances.find(c => c.sl === sl);
      setConvEmpType(item?.employeeType || "ALL");
      setConvAmount(item?.amount || 1500);
      setConvIsActive(item?.isActive || "Active");
    } else if (activeTab === "bonus") {
      const item = bonuses.find(b => b.sl === sl);
      setBonusEmpType(item?.employeeType || "ALL");
      setBonusDaysFrom(item?.daysFrom || 180);
      setBonusDaysTo(item?.daysTo || 365);
      setBonusBasedOn(item?.basedOn || "Basic");
      setBonusPercent(item?.bonusPercent || 50);
      setBonusIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "allowance") {
      const updated = allowances.filter(a => a.sl !== sl).map((a, idx) => ({ ...a, sl: idx + 1 }));
      setAllowances(updated);
      localStorage.setItem("hris_allowance_rates", JSON.stringify(updated));
    } else if (activeTab === "tiffin") {
      const updated = tiffinRates.filter(t => t.sl !== sl).map((t, idx) => ({ ...t, sl: idx + 1 }));
      setTiffinRates(updated);
      localStorage.setItem("hris_tiffin_rates", JSON.stringify(updated));
    } else if (activeTab === "lunch") {
      const updated = lunchRates.filter(l => l.sl !== sl).map((l, idx) => ({ ...l, sl: idx + 1 }));
      setLunchRates(updated);
      localStorage.setItem("hris_lunch_rates", JSON.stringify(updated));
    } else if (activeTab === "conveyance") {
      const updated = conveyances.filter(c => c.sl !== sl).map((c, idx) => ({ ...c, sl: idx + 1 }));
      setConveyances(updated);
      localStorage.setItem("hris_conveyance_setups", JSON.stringify(updated));
    } else if (activeTab === "bonus") {
      const updated = bonuses.filter(b => b.sl !== sl).map((b, idx) => ({ ...b, sl: idx + 1 }));
      setBonuses(updated);
      localStorage.setItem("hris_bonus_settings", JSON.stringify(updated));
    }

    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "allowance") {
      if (!company || !applicableFrom || !applicableTo) { toast.error("Required fields must be filled."); return; }
      let nextList = [...allowances];
      if (editSl !== null) {
        nextList = allowances.map(a => a.sl === editSl ? { ...a, company, area, applicableFrom, applicableTo, employeeType, department, subDepartment, designation, workingHourFrom, workingHourTo, salaryFrom: Number(salaryFrom), salaryTo: Number(salaryTo), rateFor, basedOn, rate: Number(rate), divByHour, getAfterReq, getAfterReqRate: Number(getAfterReqRate), eotAfter: Number(eotAfter), lunch: Number(lunch), dinner: Number(dinner), isActive: allowanceIsActive } : a);
      } else {
        const sl = allowances.length > 0 ? Math.max(...allowances.map(a => a.sl)) + 1 : 1;
        nextList.push({ sl, company, area, applicableFrom, applicableTo, employeeType, department, subDepartment, designation, workingHourFrom, workingHourTo, salaryFrom: Number(salaryFrom), salaryTo: Number(salaryTo), rateFor, basedOn, rate: Number(rate), divByHour, getAfterReq, getAfterReqRate: Number(getAfterReqRate), eotAfter: Number(eotAfter), lunch: Number(lunch), dinner: Number(dinner), isActive: allowanceIsActive });
      }
      setAllowances(nextList);
      localStorage.setItem("hris_allowance_rates", JSON.stringify(nextList));
    } else if (activeTab === "tiffin") {
      let nextList = [...tiffinRates];
      if (editSl !== null) {
        nextList = tiffinRates.map(t => t.sl === editSl ? { ...t, employeeType: tiffinEmpType, rate: Number(tiffinRateVal), isActive: tiffinIsActive } : t);
      } else {
        const sl = tiffinRates.length > 0 ? Math.max(...tiffinRates.map(t => t.sl)) + 1 : 1;
        nextList.push({ sl, employeeType: tiffinEmpType, rate: Number(tiffinRateVal), isActive: tiffinIsActive });
      }
      setTiffinRates(nextList);
      localStorage.setItem("hris_tiffin_rates", JSON.stringify(nextList));
    } else if (activeTab === "lunch") {
      let nextList = [...lunchRates];
      if (editSl !== null) {
        nextList = lunchRates.map(l => l.sl === editSl ? { ...l, employeeType: lunchEmpType, rate: Number(lunchRateVal), isActive: lunchIsActive } : l);
      } else {
        const sl = lunchRates.length > 0 ? Math.max(...lunchRates.map(l => l.sl)) + 1 : 1;
        nextList.push({ sl, employeeType: lunchEmpType, rate: Number(lunchRateVal), isActive: lunchIsActive });
      }
      setLunchRates(nextList);
      localStorage.setItem("hris_lunch_rates", JSON.stringify(nextList));
    } else if (activeTab === "conveyance") {
      let nextList = [...conveyances];
      if (editSl !== null) {
        nextList = conveyances.map(c => c.sl === editSl ? { ...c, employeeType: convEmpType, amount: Number(convAmount), isActive: convIsActive } : c);
      } else {
        const sl = conveyances.length > 0 ? Math.max(...conveyances.map(c => c.sl)) + 1 : 1;
        nextList.push({ sl, employeeType: convEmpType, amount: Number(convAmount), isActive: convIsActive });
      }
      setConveyances(nextList);
      localStorage.setItem("hris_conveyance_setups", JSON.stringify(nextList));
    } else if (activeTab === "bonus") {
      let nextList = [...bonuses];
      if (editSl !== null) {
        nextList = bonuses.map(b => b.sl === editSl ? { ...b, employeeType: bonusEmpType, daysFrom: Number(bonusDaysFrom), daysTo: Number(bonusDaysTo), basedOn: bonusBasedOn, bonusPercent: Number(bonusPercent), isActive: bonusIsActive } : b);
      } else {
        const sl = bonuses.length > 0 ? Math.max(...bonuses.map(b => b.sl)) + 1 : 1;
        nextList.push({ sl, employeeType: bonusEmpType, daysFrom: Number(bonusDaysFrom), daysTo: Number(bonusDaysTo), basedOn: bonusBasedOn, bonusPercent: Number(bonusPercent), isActive: bonusIsActive });
      }
      setBonuses(nextList);
      localStorage.setItem("hris_bonus_settings", JSON.stringify(nextList));
    }

    toast.success("Saved successfully");
    setIsFormOpen(false);
  };

  const insetWrapperClass = "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass = "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass = "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";

  // Tab Header Items
  const tabsList: { type: TabType; label: string; icon: any }[] = [
    { type: "allowance", label: "Allowance Rate", icon: Coins },
    { type: "tiffin", label: "Tiffin Rate", icon: Coffee },
    { type: "lunch", label: "Lunch Rate", icon: Coffee },
    { type: "conveyance", label: "Conveyance Setup", icon: Truck },
    { type: "bonus", label: "Bonus Setting", icon: Gift }
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-2 max-w-[1800px] mx-auto w-full">
          {/* Breadcrumb & Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Configure</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Allowances & Bonuses</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Coins className="size-5.5 text-primary" />
                Compensation Configuration
              </h1>
            </div>
            <button 
              onClick={() => openForm(null)}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Plus className="size-4 animate-bounce" /> Add New Record
            </button>
          </div>

          {/* Horizontal Master Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
            {tabsList.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => {
                    setActiveTab(tab.type);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border/85 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TabIcon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar & Actions toolbar */}
          <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 bg-muted/65 border border-border/40 rounded-lg px-3 py-1.5 w-full md:w-80">
              <Search className="size-4 text-muted-foreground/70" />
              <input 
                type="text" 
                placeholder={`Search ${tabsList.find(t => t.type === activeTab)?.label}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs w-full text-foreground placeholder:text-muted-foreground/60 font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button 
                onClick={() => toast.success("Exporting to Excel...")}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <FileSpreadsheet className="size-4 text-emerald-600" /> EXCEL
              </button>
              <button 
                onClick={() => window.print()}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <Printer className="size-4 text-blue-600" /> PRINT
              </button>
              <button 
                onClick={() => toast.success("Generating PDF...")}
                className="h-9.5 px-3 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs text-muted-foreground flex items-center gap-1.5 transition-all uppercase"
              >
                <FileText className="size-4 text-red-600" /> PDF
              </button>
            </div>
          </div>

          {/* Master Table Router */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              
              {activeTab === "allowance" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "1800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">SL</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
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
                      <th className="px-5 py-4 w-[120px] text-center">Get After Req</th>
                      <th className="px-5 py-4 w-[100px] text-center">Rate</th>
                      <th className="px-5 py-4 w-[100px] text-center">EOT After</th>
                      <th className="px-5 py-4 w-[100px] text-center">Lunch</th>
                      <th className="px-5 py-4 w-[100px] text-center">Dinner</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {allowances.filter(a => (a.company || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.applicableFrom}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.applicableTo}</td>
                        <td className="px-5 py-3.5 font-normal">{item.employeeType}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">{item.department}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">{item.subDepartment || "—"}</td>
                        <td className="px-5 py-3.5 font-normal text-slate-800 dark:text-slate-200">{item.designation}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.workingHourFrom || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.workingHourTo || "—"}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.salaryFrom}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.salaryTo}</td>
                        <td className="px-5 py-3.5 font-normal">{item.rateFor || "—"}</td>
                        <td className="px-5 py-3.5 font-normal">{item.basedOn}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.rate}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.divByHour || "—"}</td>
                        <td className="px-5 py-3.5 text-center font-normal">{item.getAfterReq}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.getAfterReqRate}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.eotAfter}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.lunch}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.dinner}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "tiffin" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[300px]">Employee Type</th>
                      <th className="px-5 py-4 w-[150px] text-right">Tiffin Rate</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {tiffinRates.filter(t => (t.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.employeeType}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.rate} BDT</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "lunch" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[300px]">Employee Type</th>
                      <th className="px-5 py-4 w-[150px] text-right">Lunch Rate</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {lunchRates.filter(l => (l.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.employeeType}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.rate} BDT</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "conveyance" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "800px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[300px]">Employee Type</th>
                      <th className="px-5 py-4 w-[150px] text-right">Conveyance Amount</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {conveyances.filter(c => (c.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.employeeType}</td>
                        <td className="px-5 py-3.5 text-right font-normal font-mono">{item.amount} BDT</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "bonus" && (
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "900px" }}>
                  <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                    <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                      <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">#</th>
                      <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">Actions</th>
                      <th className="px-5 py-4 min-w-[200px]">Employee Type</th>
                      <th className="px-5 py-4 w-[120px] text-center">Days From</th>
                      <th className="px-5 py-4 w-[120px] text-center">Days To</th>
                      <th className="px-5 py-4 w-[150px]">Based On</th>
                      <th className="px-5 py-4 w-[120px] text-center">Bonus (%)</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {bonuses.filter(b => (b.employeeType || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                        <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">{idx + 1}</td>
                        <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openForm(item.sl)} className="text-orange-500 hover:text-orange-600 transition"><Pencil className="size-4" /></button>
                            <button onClick={() => handleDelete(item.sl)} className="text-red-500 hover:text-red-650 transition"><Trash2 className="size-4" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-normal text-slate-900 dark:text-slate-100">{item.employeeType}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.daysFrom}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.daysTo}</td>
                        <td className="px-5 py-3.5 font-normal">{item.basedOn}</td>
                        <td className="px-5 py-3.5 text-center font-normal font-mono">{item.bonusPercent}%</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${item.isActive === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>{item.isActive}</span>
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
            <div className="bg-card border border-border/80 w-full max-w-xl rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                    <Coins className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight text-foreground">
                      {editSl ? "Update" : "Create"} {tabsList.find(t => t.type === activeTab)?.label}
                    </h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="size-8.5 rounded-xl hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground border border-border/20"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {activeTab === "allowance" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company *</label>
                      <input type="text" value={company} onChange={e => setCompany(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Area *</label>
                      <input type="text" value={area} onChange={e => setArea(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Applicable From *</label>
                      <input type="date" value={applicableFrom} onChange={e => setApplicableFrom(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Applicable To *</label>
                      <input type="date" value={applicableTo} onChange={e => setApplicableTo(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type *</label>
                      <input type="text" value={employeeType} onChange={e => setEmployeeType(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department</label>
                      <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Section</label>
                      <input type="text" value={subDepartment} onChange={e => setSubDepartment(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Designation</label>
                      <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Working Hour From</label>
                      <input type="text" value={workingHourFrom} onChange={e => setWorkingHourFrom(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Working Hour To</label>
                      <input type="text" value={workingHourTo} onChange={e => setWorkingHourTo(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Salary From</label>
                      <input type="number" value={salaryFrom} onChange={e => setSalaryFrom(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Salary To</label>
                      <input type="number" value={salaryTo} onChange={e => setSalaryTo(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Rate For</label>
                      <input type="text" value={rateFor} onChange={e => setRateFor(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Based On</label>
                      <select value={basedOn} onChange={e => setBasedOn(e.target.value)} className={insetSelectClass}>
                        <option value="--Select--">--Select--</option>
                        <option value="Basic">Basic</option>
                        <option value="Gross">Gross</option>
                        <option value="Flat">Flat</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Rate</label>
                      <input type="number" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Div By Hour</label>
                      <input type="text" value={divByHour} onChange={e => setDivByHour(e.target.value)} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Get After Reguler</label>
                      <select value={getAfterReq} onChange={e => setGetAfterReq(e.target.value)} className={insetSelectClass}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Rate</label>
                      <input type="number" value={getAfterReqRate} onChange={e => setGetAfterReqRate(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>EOT After</label>
                      <input type="number" value={eotAfter} onChange={e => setEotAfter(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Lunch Break</label>
                      <input type="number" value={lunch} onChange={e => setLunch(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Dinner Break</label>
                      <input type="number" value={dinner} onChange={e => setDinner(Number(e.target.value))} className={insetInputClass} />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={allowanceIsActive} onChange={e => setAllowanceIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "tiffin" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type *</label>
                      <input type="text" value={tiffinEmpType} onChange={e => setTiffinEmpType(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Tiffin Rate (BDT) *</label>
                      <input type="number" value={tiffinRateVal} onChange={e => setTiffinRateVal(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={tiffinIsActive} onChange={e => setTiffinIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "lunch" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type *</label>
                      <input type="text" value={lunchEmpType} onChange={e => setLunchEmpType(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Lunch Rate (BDT) *</label>
                      <input type="number" value={lunchRateVal} onChange={e => setLunchRateVal(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={lunchIsActive} onChange={e => setLunchIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "conveyance" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type *</label>
                      <input type="text" value={convEmpType} onChange={e => setConvEmpType(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Conveyance Amount (BDT) *</label>
                      <input type="number" value={convAmount} onChange={e => setConvAmount(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={convIsActive} onChange={e => setConvIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "bonus" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Employee Type *</label>
                      <input type="text" value={bonusEmpType} onChange={e => setBonusEmpType(e.target.value)} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Days From *</label>
                      <input type="number" value={bonusDaysFrom} onChange={e => setBonusDaysFrom(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Days To *</label>
                      <input type="number" value={bonusDaysTo} onChange={e => setBonusDaysTo(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Based On *</label>
                      <select value={bonusBasedOn} onChange={e => setBonusBasedOn(e.target.value)} className={insetSelectClass} required>
                        <option value="Basic">Basic</option>
                        <option value="Gross">Gross</option>
                        <option value="Flat">Flat</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Bonus (%) *</label>
                      <input type="number" value={bonusPercent} onChange={e => setBonusPercent(Number(e.target.value))} className={insetInputClass} required />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select value={bonusIsActive} onChange={e => setBonusIsActive(e.target.value as any)} className={insetSelectClass}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="border-t border-border/50 pt-5 flex items-center justify-between gap-3 bg-[#f8fafc] dark:bg-[#0f172a] -mx-6 -mb-6 p-6">
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
