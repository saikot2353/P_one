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
  Building2,
  MapPin,
  Layers,
  Users2,
  Grid,
  HelpCircle,
  Briefcase,
  SlidersHorizontal,
  GripVertical,
  Settings,
  Coins,
  Calendar,
  Save,
  ArrowLeft,
  LayoutTemplate,
} from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";

interface CompanySetupSearch {
  tab?: TabType;
}

export const Route = createFileRoute("/company-setup")({
  validateSearch: (search: Record<string, unknown>): CompanySetupSearch => {
    return {
      tab: (search.tab as TabType) || "department",
    };
  },
  head: () => ({
    meta: [
      { title: "Company Setup — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure departments, sections, units, and lines.",
      },
    ],
  }),
  component: CompanySetupPage,
});

type TabType = "company" | "area" | "mapping" | "department" | "section" | "unit" | "line" | "holiday" | "payslip";

interface PayslipField {
  key: string;
  category: "status" | "payment" | "deduction";
  defaultLabelEng: string;
  defaultLabelBng: string;
  customLabelEng: string;
  customLabelBng: string;
  isVisible: boolean;
}

const DEFAULT_PAYSLIP_FIELDS: PayslipField[] = [
  // Working Status
  { key: "working_day", category: "status", defaultLabelEng: "Working Day", defaultLabelBng: "কার্য দিবস", customLabelEng: "Working Day", customLabelBng: "কার্য দিবস", isVisible: true },
  { key: "holiday", category: "status", defaultLabelEng: "Holiday", defaultLabelBng: "সাপ্তাহিক ছুটি", customLabelEng: "Holiday", customLabelBng: "সাপ্তাহিক ছুটি", isVisible: true },
  { key: "present", category: "status", defaultLabelEng: "Present", defaultLabelBng: "উপস্থিত দিন", customLabelEng: "Present", customLabelBng: "উপস্থিত দিন", isVisible: true },
  { key: "cl", category: "status", defaultLabelEng: "CL", defaultLabelBng: "নৈমিত্তিক ছুটি", customLabelEng: "CL", customLabelBng: "নৈমিত্তিক ছুটি", isVisible: true },
  { key: "sl", category: "status", defaultLabelEng: "SL", defaultLabelBng: "অসুস্থতাজনিত ছুটি", customLabelEng: "SL", customLabelBng: "অসুস্থতাজনিত ছুটি", isVisible: true },
  { key: "el", category: "status", defaultLabelEng: "EL", defaultLabelBng: "অর্জিত ছুটি", customLabelEng: "EL", customLabelBng: "অর্জিত ছুটি", isVisible: true },
  { key: "ml", category: "status", defaultLabelEng: "ML", defaultLabelBng: "মাতৃত্ব জনিত ছুটি", customLabelEng: "ML", customLabelBng: "মাতৃত্ব জনিত ছুটি", isVisible: true },
  { key: "spl", category: "status", defaultLabelEng: "SPL", defaultLabelBng: "বিশেষ ছুটি", customLabelEng: "SPL", customLabelBng: "বিশেষ ছুটি", isVisible: true },
  { key: "absent", category: "status", defaultLabelEng: "Absent", defaultLabelBng: "অনুপস্থিত দিন", customLabelEng: "Absent", customLabelBng: "অনুপস্থিত দিন", isVisible: true },
  { key: "ot_rate", category: "status", defaultLabelEng: "OT Rate", defaultLabelBng: "ওভার টাইমের হার", customLabelEng: "OT Rate", customLabelBng: "ওভার টাইমের হার", isVisible: true },
  { key: "ot_hour", category: "status", defaultLabelEng: "OT Hour", defaultLabelBng: "ওভার টাইম ঘন্টা", customLabelEng: "OT Hour", customLabelBng: "ওভার টাইম ঘন্টা", isVisible: true },

  // Payments and Deductions / Earnings
  { key: "basic_pay", category: "payment", defaultLabelEng: "Basic Pay", defaultLabelBng: "মূল বেতন", customLabelEng: "Basic Pay", customLabelBng: "মূল বেতন", isVisible: true },
  { key: "house_rent", category: "payment", defaultLabelEng: "House Rent", defaultLabelBng: "বাড়ী ভাড়া", customLabelEng: "House Rent", customLabelBng: "বাড়ী ভাড়া", isVisible: true },
  { key: "medical", category: "payment", defaultLabelEng: "Medical", defaultLabelBng: "চিকিৎসা ভাতা", customLabelEng: "Medical", customLabelBng: "চিকিৎসা ভাতা", isVisible: true },
  { key: "food", category: "payment", defaultLabelEng: "Food", defaultLabelBng: "খাদ্য ভাতা", customLabelEng: "Food", customLabelBng: "খাদ্য ভাতা", isVisible: true },
  { key: "conveyance", category: "payment", defaultLabelEng: "Conveyance", defaultLabelBng: "যাতায়াত ভাতা", customLabelEng: "Conveyance", customLabelBng: "যাতায়াত ভাতা", isVisible: true },
  { key: "gross_salary", category: "payment", defaultLabelEng: "Gross Salary", defaultLabelBng: "মোট বেতন", customLabelEng: "Gross Salary", customLabelBng: "মোট বেতন", isVisible: true },
  { key: "ot_payment", category: "payment", defaultLabelEng: "OT Payment", defaultLabelBng: "ওভার টাইম", customLabelEng: "OT Payment", customLabelBng: "ওভার টাইম", isVisible: true },
  { key: "tiffin", category: "payment", defaultLabelEng: "Tiffin", defaultLabelBng: "টিফিন ভাতা", customLabelEng: "Tiffin", customLabelBng: "টিফিন ভাতা", isVisible: true },
  { key: "night_allowance", category: "payment", defaultLabelEng: "Night Allowance", defaultLabelBng: "নাইট বিল", customLabelEng: "Night Allowance", customLabelBng: "নাইট বিল", isVisible: true },
  { key: "attendance_bonus", category: "payment", defaultLabelEng: "Attendance Bonus", defaultLabelBng: "হাজিরা বোনাস", customLabelEng: "Attendance Bonus", customLabelBng: "হাজিরা বোনাস", isVisible: true },
  { key: "allowance", category: "payment", defaultLabelEng: "Allowance", defaultLabelBng: "আচরণ বোনাস", customLabelEng: "Allowance", customLabelBng: "আচরণ বোনাস", isVisible: true },
  { key: "arrear", category: "payment", defaultLabelEng: "Arrear", defaultLabelBng: "বকেয়া", customLabelEng: "Arrear", customLabelBng: "বকেয়া", isVisible: true },
  { key: "total_payment", category: "payment", defaultLabelEng: "Total Payment", defaultLabelBng: "মোট প্রদান", customLabelEng: "Total Payment", customLabelBng: "মোট প্রদান", isVisible: true },

  // Deductions
  { key: "absent_deduction", category: "deduction", defaultLabelEng: "Absent Deduction", defaultLabelBng: "অনুপস্থিতজনিত কর্তন", customLabelEng: "Absent Deduction", customLabelBng: "অনুপস্থিতজনিত কর্তন", isVisible: true },
  { key: "lunch_deduction", category: "deduction", defaultLabelEng: "Lunch Deduction", defaultLabelBng: "লাঞ্চ কর্তন", customLabelEng: "Lunch Deduction", customLabelBng: "লাঞ্চ কর্তন", isVisible: true },
  { key: "advance", category: "deduction", defaultLabelEng: "Advance", defaultLabelBng: "অগ্রিম", customLabelEng: "Advance", customLabelBng: "অগ্রিম", isVisible: true },
  { key: "wagely_advance", category: "deduction", defaultLabelEng: "Wagely Advance", defaultLabelBng: "অগ্রিম (wagely)", customLabelEng: "Wagely Advance", customLabelBng: "অগ্রিম (wagely)", isVisible: true },
  { key: "adjust", category: "deduction", defaultLabelEng: "Adjust", defaultLabelBng: "সমন্বয়", customLabelEng: "Adjust", customLabelBng: "সমন্বয়", isVisible: true },
  { key: "income_tax", category: "deduction", defaultLabelEng: "Income Tax", defaultLabelBng: "আয়কর", customLabelEng: "Income Tax", customLabelBng: "আয়কর", isVisible: true },
  { key: "revenue_stamp", category: "deduction", defaultLabelEng: "Revenue Stamp", defaultLabelBng: "স্ট্যাম্প বাবদ কর্তন", customLabelEng: "Revenue Stamp", customLabelBng: "স্ট্যাম্প বাবদ কর্তন", isVisible: true },
  { key: "total_deduction", category: "deduction", defaultLabelEng: "Total Deduction", defaultLabelBng: "মোট কর্তন", customLabelEng: "Total Deduction", customLabelBng: "মোট কর্তন", isVisible: true },
];

interface PayslipTemplate {
  id: string;
  title: string;
  companyName: string;
  employeeType: string;
  isActive: boolean;
  fields: PayslipField[];
}

const DEFAULT_TEMPLATES: PayslipTemplate[] = [
  {
    id: "tpl-1",
    title: "Standard Staff Layout",
    companyName: "Pakiza Software Limited",
    employeeType: "Permanent",
    isActive: true,
    fields: DEFAULT_PAYSLIP_FIELDS
  },
  {
    id: "tpl-2",
    title: "Hourly Worker Template",
    companyName: "Pakiza Knit Composite Ltd",
    employeeType: "Casual",
    isActive: true,
    fields: DEFAULT_PAYSLIP_FIELDS.map(f => {
      if (f.key === "conveyance" || f.key === "food") {
        return { ...f, isVisible: false };
      }
      return f;
    })
  }
];

interface DefaultHoliday {
  sl: number;
  year: number;
  effectiveDate: string;
  days: string[];
  remarks: string;
}
// ----------------------------------------------------
interface Organization {
  sl: number;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  addressEng: string;
  addressBng: string;
  isActive: "Active" | "Inactive";
}

interface Area {
  sl: number;
  code: string;
  companyName: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  addressEng: string;
  addressBng: string;
  purchase: string;
  isActive: "Active" | "Inactive";
}

interface CompanyMapping {
  sl: number;
  name: string;
  main: string;
  relayDuty: string;
  checked?: boolean;
}

interface Department {
  sl: number;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  companyName?: string;
  isActive: "Active" | "Inactive";
}

interface Section {
  sl: number;
  departmentName: string;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  companyName?: string;
  isActive: "Active" | "Inactive";
}

interface Unit {
  sl: number;
  nameEng: string;
  nameBng: string;
  sortOrder: number;
  companyName?: string;
  isActive: "Active" | "Inactive";
}

interface Line {
  sl: number;
  companyName: string;
  lineEng: string;
  lineBng: string;
  sortOrder: number;
  isActive: "Active" | "Inactive";
}

// ----------------------------------------------------
// Defaults
// ----------------------------------------------------
const DEFAULT_ORGS: Organization[] = [
  {
    sl: 1,
    code: "1000",
    nameEng: "Pakiza Knit Composite Ltd",
    nameBng: "পাকিজা নিট কম্পোজিট লিঃ",
    shortName: "PKCL",
    addressEng: "House# 97, Road# 11/A, Dhanmondi, Dhaka-1209",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 2,
    code: "2000",
    nameEng: "Pakiza Technovation Limited",
    nameBng: "পাকিজা টেকনোভেশন লিমিটেড",
    shortName: "PTL",
    addressEng: "Dhanmondi, Dhaka",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 3,
    code: "3000",
    nameEng: "Pakiza Spinning Mills Ltd",
    nameBng: "পাকিজা স্পিনিং মিলস লিঃ",
    shortName: "PSML",
    addressEng: "Narsingdi, Bangladesh",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 4,
    code: "4000",
    nameEng: "Pakiza Woven Fashion Ltd",
    nameBng: "পাকিজা ওভেন ফ্যাশন লিঃ",
    shortName: "PWFL",
    addressEng: "Savar, Dhaka",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 5,
    code: "5000",
    nameEng: "Pakiza Dyeing & Printing",
    nameBng: "পাকিজা ডাইং এন্ড প্রিন্টিং",
    shortName: "PDPL",
    addressEng: "Tongipara, Gazipur",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 6,
    code: "6000",
    nameEng: "Pakiza Garments Ltd",
    nameBng: "পাকিজা গার্মেন্টস লিঃ",
    shortName: "PGL",
    addressEng: "Ashulia, Savar",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 7,
    code: "7000",
    nameEng: "Pakiza Logistics Ltd",
    nameBng: "পাকিজা লজিস্টিকস লিঃ",
    shortName: "PLL",
    addressEng: "Tejgaon, Dhaka",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 8,
    code: "8000",
    nameEng: "Pakiza Apparels Ltd",
    nameBng: "পাকিজা অ্যাপারেলস লিঃ",
    shortName: "PAL",
    addressEng: "Narayanganj",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 9,
    code: "9000",
    nameEng: "Pakiza Cotton Mills Ltd",
    nameBng: "পাকিজা কটন মিলস লিঃ",
    shortName: "PCML",
    addressEng: "Comilla",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 10,
    code: "1100",
    nameEng: "Pakiza Texturizing Ltd",
    nameBng: "পাকিজা টেক্সচারাইজিং লিঃ",
    shortName: "PTXL",
    addressEng: "Gazipur",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 12,
    code: "1200",
    nameEng: "Pakiza Fabrics Ltd",
    nameBng: "পাকিজা ফ্যাব্রিকস লিঃ",
    shortName: "PFL",
    addressEng: "Narsingdi",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 13,
    code: "1300",
    nameEng: "Pakiza Retail Venture Ltd",
    nameBng: "পাকিজা রিটেল ভেঞ্চার",
    shortName: "PRVL",
    addressEng: "Gulshan, Dhaka",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 14,
    code: "1400",
    nameEng: "Pakiza Real Estate Ltd",
    nameBng: "পাকিজা রিয়েল এস্টেট",
    shortName: "PREL",
    addressEng: "Uttara, Dhaka",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 15,
    code: "1500",
    nameEng: "Pakiza Agro Industries Ltd",
    nameBng: "পাকিজা এগ্রো ইন্ডাস্ট্রিজ",
    shortName: "PAIL",
    addressEng: "Mymensingh",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 16,
    code: "1600",
    nameEng: "Pakiza Power & Energy Ltd",
    nameBng: "পাকিজা পাওয়ার এন্ড এনার্জি",
    shortName: "PPEL",
    addressEng: "Chittagong",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 17,
    code: "1700",
    nameEng: "Pakiza Packaging Limited",
    nameBng: "পাকিজা প্যাকেজিং লিমিটেড",
    shortName: "PPL",
    addressEng: "Kaliakair, Gazipur",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 18,
    code: "1800",
    nameEng: "Pakiza Chemical Ind Ltd",
    nameBng: "পাকিজা কেমিক্যালস",
    shortName: "PCIL",
    addressEng: "Keraniganj, Dhaka",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 19,
    code: "1900",
    nameEng: "Pakiza Trading House Ltd",
    nameBng: "পাকিজা ট্রেডিং হাউস",
    shortName: "PTHL",
    addressEng: "Motijheel, Dhaka",
    addressBng: "",
    isActive: "Active",
  },
  {
    sl: 20,
    code: "2100",
    nameEng: "Pakiza Software Lab Ltd",
    nameBng: "পাকিজা সফটওয়্যার ল্যাব",
    shortName: "PSLL",
    addressEng: "Mirpur, Dhaka",
    addressBng: "",
    isActive: "Active",
  },
];

const DEFAULT_AREAS: Area[] = [
  {
    sl: 1,
    code: "01",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "PAL-Fabric Dyeing",
    nameBng: "",
    shortName: "PAL-FD",
    addressEng: "Narsingdi",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 2,
    code: "02",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Head Office",
    nameBng: "",
    shortName: "HO",
    addressEng: "Dhanmondi, Dhaka",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 3,
    code: "03",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Savar Cutting Unit",
    nameBng: "",
    shortName: "SCU",
    addressEng: "Savar, Dhaka",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 4,
    code: "04",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Savar Sewing Unit",
    nameBng: "",
    shortName: "SSU",
    addressEng: "Savar, Dhaka",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 5,
    code: "05",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Savar Finishing Unit",
    nameBng: "",
    shortName: "SFU",
    addressEng: "Savar, Dhaka",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 6,
    code: "06",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Narsingdi Spinning",
    nameBng: "",
    shortName: "NSP",
    addressEng: "Narsingdi",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 7,
    code: "07",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Narsingdi Yarn Dyeing",
    nameBng: "",
    shortName: "NYD",
    addressEng: "Narsingdi",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 8,
    code: "08",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Tongipara Dyeing Unit",
    nameBng: "",
    shortName: "TDU",
    addressEng: "Tongipara, Gazipur",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 9,
    code: "09",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Ashulia Printing Unit",
    nameBng: "",
    shortName: "APU",
    addressEng: "Ashulia, Savar",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 10,
    code: "10",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Narayanganj Apparels",
    nameBng: "",
    shortName: "NJA",
    addressEng: "Narayanganj",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 11,
    code: "11",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Comilla Spinning Unit",
    nameBng: "",
    shortName: "CSU",
    addressEng: "Comilla",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 12,
    code: "12",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Gazipur Texturizing",
    nameBng: "",
    shortName: "GTL",
    addressEng: "Gazipur",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 13,
    code: "13",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Narsingdi Weaving",
    nameBng: "",
    shortName: "NWV",
    addressEng: "Narsingdi",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 14,
    code: "14",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Gulshan Showroom",
    nameBng: "",
    shortName: "GSR",
    addressEng: "Gulshan, Dhaka",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 15,
    code: "15",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Uttara Warehouse",
    nameBng: "",
    shortName: "UWH",
    addressEng: "Uttara, Dhaka",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 16,
    code: "16",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Mymensingh Feed Mill",
    nameBng: "",
    shortName: "MFM",
    addressEng: "Mymensingh",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 17,
    code: "17",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Chittagong Port Depot",
    nameBng: "",
    shortName: "CPD",
    addressEng: "Chittagong",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 18,
    code: "18",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Kaliakair Packaging",
    nameBng: "",
    shortName: "KKP",
    addressEng: "Kaliakair, Gazipur",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 19,
    code: "19",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Keraniganj Chemical Depot",
    nameBng: "",
    shortName: "KCD",
    addressEng: "Keraniganj, Dhaka",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
  {
    sl: 20,
    code: "20",
    companyName: "Pakiza Knit Composite Ltd",
    nameEng: "Motijheel Sales Office",
    nameBng: "",
    shortName: "MSO",
    addressEng: "Motijheel, Dhaka",
    addressBng: "",
    purchase: "",
    isActive: "Active",
  },
];

const DEFAULT_MAPPINGS: CompanyMapping[] = [
  { sl: 1, name: "Embroidery", main: "RMG Operations", relayDuty: "", checked: false },
  { sl: 2, name: "Rotary Sample (AOP)", main: "All over Printing", relayDuty: "", checked: false },
  { sl: 3, name: "Product Management", main: "Product Management", relayDuty: "", checked: false },
  {
    sl: 4,
    name: "Cutting Quality",
    main: "Quality Assurance Department",
    relayDuty: "",
    checked: false,
  },
  {
    sl: 5,
    name: "AOP Fabric Store",
    main: "Material Control Department",
    relayDuty: "",
    checked: false,
  },
  {
    sl: 6,
    name: "Dyes & Chemical Store (FD)",
    main: "Material Control Department",
    relayDuty: "",
    checked: false,
  },
  { sl: 7, name: "Embroidery Quality", main: "Embroidery", relayDuty: "", checked: false },
  {
    sl: 8,
    name: "Quality (RMG)",
    main: "Quality Assurance Department",
    relayDuty: "",
    checked: false,
  },
  { sl: 9, name: "Administration", main: "Administration", relayDuty: "", checked: false },
  {
    sl: 10,
    name: "Rotary Engraving (AOP)",
    main: "All over Printing",
    relayDuty: "",
    checked: false,
  },
  { sl: 11, name: "Stenter (AOP)", main: "All over Printing", relayDuty: "", checked: false },
  { sl: 12, name: "Sample Sewing", main: "RMG Operations", relayDuty: "", checked: false },
  { sl: 13, name: "Washing & Dyeing", main: "Finishing Operations", relayDuty: "", checked: false },
  {
    sl: 14,
    name: "Yarn Dyeing Lab",
    main: "Quality Assurance Department",
    relayDuty: "",
    checked: false,
  },
  {
    sl: 15,
    name: "Mechanical Maintenance",
    main: "Engineering Department",
    relayDuty: "",
    checked: false,
  },
  {
    sl: 16,
    name: "Electrical Support",
    main: "Engineering Department",
    relayDuty: "",
    checked: false,
  },
  { sl: 17, name: "CAD/CAM Design", main: "Product Management", relayDuty: "", checked: false },
  {
    sl: 18,
    name: "Finished Goods Store",
    main: "Material Control Department",
    relayDuty: "",
    checked: false,
  },
  {
    sl: 19,
    name: "Utility Support Team",
    main: "Engineering Department",
    relayDuty: "",
    checked: false,
  },
  {
    sl: 20,
    name: "Security & Safety Squad",
    main: "Administration",
    relayDuty: "",
    checked: false,
  },
];

const DEFAULT_DEPARTMENTS: Department[] = [
  {
    sl: 1,
    code: "HR",
    nameEng: "HR & Admin",
    nameBng: "এইচআর ও এডমিন",
    shortName: "HR",
    isActive: "Active",
  },
  {
    sl: 2,
    code: "IT",
    nameEng: "Information Technology",
    nameBng: "তথ্য প্রযুক্তি",
    shortName: "IT",
    isActive: "Active",
  },
  {
    sl: 3,
    code: "FIN",
    nameEng: "Finance & Accounts",
    nameBng: "অর্থ ও হিসাব",
    shortName: "FIN",
    isActive: "Active",
  },
  {
    sl: 4,
    code: "PROD",
    nameEng: "Production Dept",
    nameBng: "উৎপাদন বিভাগ",
    shortName: "PROD",
    isActive: "Active",
  },
  {
    sl: 5,
    code: "MKT",
    nameEng: "Marketing & Sales",
    nameBng: "বিপণন ও বিক্রয়",
    shortName: "MKT",
    isActive: "Active",
  },
  {
    sl: 6,
    code: "LOG",
    nameEng: "Logistics & Supply",
    nameBng: "লজিস্টিকস ও সরবরাহ",
    shortName: "LOG",
    isActive: "Active",
  },
  {
    sl: 7,
    code: "QA",
    nameEng: "Quality Assurance",
    nameBng: "মান নিয়ন্ত্রণ",
    shortName: "QA",
    isActive: "Active",
  },
  {
    sl: 8,
    code: "PLAN",
    nameEng: "Planning & Control",
    nameBng: "পরিকল্পনা ও নিয়ন্ত্রণ",
    shortName: "PLAN",
    isActive: "Active",
  },
  {
    sl: 9,
    code: "ENG",
    nameEng: "Engineering & Utility",
    nameBng: "প্রকৌশল ও ইউটিলিটি",
    shortName: "ENG",
    isActive: "Active",
  },
  {
    sl: 10,
    code: "COMM",
    nameEng: "Commercial Department",
    nameBng: "কমার্শিয়াল বিভাগ",
    shortName: "COMM",
    isActive: "Active",
  },
  {
    sl: 11,
    code: "PROC",
    nameEng: "Procurement & Purchase",
    nameBng: "ক্রয় ও সংগ্রহ",
    shortName: "PROC",
    isActive: "Active",
  },
  {
    sl: 12,
    code: "RND",
    nameEng: "Research & Development",
    nameBng: "গবেষণা ও উন্নয়ন",
    shortName: "RND",
    isActive: "Active",
  },
  {
    sl: 13,
    code: "SEC",
    nameEng: "Security & Safety",
    nameBng: "নিরাপত্তা ও সেফটি",
    shortName: "SEC",
    isActive: "Active",
  },
  {
    sl: 14,
    code: "MAIN",
    nameEng: "Maintenance Dept",
    nameBng: "রক্ষণাবেক্ষণ",
    shortName: "MAIN",
    isActive: "Active",
  },
  {
    sl: 15,
    code: "WASH",
    nameEng: "Washing Department",
    nameBng: "ওয়াশিং বিভাগ",
    shortName: "WASH",
    isActive: "Active",
  },
  {
    sl: 16,
    code: "PACK",
    nameEng: "Packaging & Carton",
    nameBng: "প্যাকেজিং বিভাগ",
    shortName: "PACK",
    isActive: "Active",
  },
  {
    sl: 17,
    code: "CAD",
    nameEng: "CAD Design Section",
    nameBng: "ক্যাড ডিজাইন",
    shortName: "CAD",
    isActive: "Active",
  },
  {
    sl: 18,
    code: "STORE",
    nameEng: "Store & Inventory",
    nameBng: "স্টোর ও ইনভেন্টরি",
    shortName: "STORE",
    isActive: "Active",
  },
  {
    sl: 19,
    code: "LEGAL",
    nameEng: "Legal & Compliance",
    nameBng: "আইন ও কমপ্লায়েন্স",
    shortName: "COMP",
    isActive: "Active",
  },
  {
    sl: 20,
    code: "PR",
    nameEng: "Public Relations",
    nameBng: "জনসংযোগ বিভাগ",
    shortName: "PR",
    isActive: "Active",
  },
];

const DEFAULT_SECTIONS: Section[] = [
  {
    sl: 1,
    departmentName: "HR & Admin",
    code: "ADM",
    nameEng: "Admin Support",
    nameBng: "",
    shortName: "AS",
    isActive: "Active",
  },
  {
    sl: 2,
    departmentName: "Information Technology",
    code: "DEV",
    nameEng: "Software Development",
    nameBng: "",
    shortName: "SD",
    isActive: "Active",
  },
  {
    sl: 3,
    departmentName: "Finance & Accounts",
    code: "ACC",
    nameEng: "Accounts Payable",
    nameBng: "",
    shortName: "AP",
    isActive: "Active",
  },
  {
    sl: 4,
    departmentName: "Production Dept",
    code: "SEW",
    nameEng: "Sewing Section",
    nameBng: "",
    shortName: "SEW",
    isActive: "Active",
  },
  {
    sl: 5,
    departmentName: "Marketing & Sales",
    code: "DOM",
    nameEng: "Domestic Sales",
    nameBng: "",
    shortName: "DS",
    isActive: "Active",
  },
  {
    sl: 6,
    departmentName: "Logistics & Supply",
    code: "WH",
    nameEng: "Central Warehouse",
    nameBng: "",
    shortName: "CW",
    isActive: "Active",
  },
  {
    sl: 7,
    departmentName: "Quality Assurance",
    code: "IQC",
    nameEng: "Incoming Quality",
    nameBng: "",
    shortName: "IQC",
    isActive: "Active",
  },
  {
    sl: 8,
    departmentName: "Planning & Control",
    code: "SCH",
    nameEng: "Production Scheduling",
    nameBng: "",
    shortName: "SCH",
    isActive: "Active",
  },
  {
    sl: 9,
    departmentName: "Engineering & Utility",
    code: "PWR",
    nameEng: "Power House",
    nameBng: "",
    shortName: "PH",
    isActive: "Active",
  },
  {
    sl: 10,
    departmentName: "Commercial Department",
    code: "EXP",
    nameEng: "Export Logistics",
    nameBng: "",
    shortName: "EXP",
    isActive: "Active",
  },
  {
    sl: 11,
    departmentName: "Procurement & Purchase",
    code: "LCP",
    nameEng: "Local Purchase",
    nameBng: "",
    shortName: "LP",
    isActive: "Active",
  },
  {
    sl: 12,
    departmentName: "Research & Development",
    code: "SMP",
    nameEng: "Sample Section",
    nameBng: "",
    shortName: "SMP",
    isActive: "Active",
  },
  {
    sl: 13,
    departmentName: "Security & Safety",
    code: "FIRE",
    nameEng: "Fire & Safety Wing",
    nameBng: "",
    shortName: "FSW",
    isActive: "Active",
  },
  {
    sl: 14,
    departmentName: "Maintenance Dept",
    code: "MCH",
    nameEng: "Machine Repairs",
    nameBng: "",
    shortName: "MR",
    isActive: "Active",
  },
  {
    sl: 15,
    departmentName: "Washing Department",
    code: "DYE",
    nameEng: "Washing Lab",
    nameBng: "",
    shortName: "WL",
    isActive: "Active",
  },
  {
    sl: 16,
    departmentName: "Packaging & Carton",
    code: "BOX",
    nameEng: "Carton Box Maker",
    nameBng: "",
    shortName: "CBM",
    isActive: "Active",
  },
  {
    sl: 17,
    departmentName: "CAD Design Section",
    code: "CADS",
    nameEng: "Pattern Making",
    nameBng: "",
    shortName: "PM",
    isActive: "Active",
  },
  {
    sl: 18,
    departmentName: "Store & Inventory",
    code: "YS",
    nameEng: "Yarn Store",
    nameBng: "",
    shortName: "YS",
    isActive: "Active",
  },
  {
    sl: 19,
    departmentName: "Legal & Compliance",
    code: "CMPL",
    nameEng: "Social Compliance",
    nameBng: "",
    shortName: "SC",
    isActive: "Active",
  },
  {
    sl: 20,
    departmentName: "Public Relations",
    code: "CSR",
    nameEng: "CSR Initiatives",
    nameBng: "",
    shortName: "CSR",
    isActive: "Active",
  },
];

const DEFAULT_UNITS: Unit[] = [
  {
    sl: 1,
    nameEng: "Accessories Store",
    nameBng: "অ্যাক্সেসরিজ স্টোর",
    sortOrder: 1,
    isActive: "Active",
  },
  { sl: 2, nameEng: "Admin Unit", nameBng: "এডমিন ইউনিট", sortOrder: 2, isActive: "Active" },
  { sl: 3, nameEng: "Cutting Unit", nameBng: "কাটিং ইউনিট", sortOrder: 3, isActive: "Active" },
  { sl: 4, nameEng: "Sewing Unit A", nameBng: "সেলাই ইউনিট এ", sortOrder: 4, isActive: "Active" },
  { sl: 5, nameEng: "Sewing Unit B", nameBng: "সেলাই ইউনিট বি", sortOrder: 5, isActive: "Active" },
  { sl: 6, nameEng: "Finishing Unit", nameBng: "ফিনিশিং ইউনিট", sortOrder: 6, isActive: "Active" },
  { sl: 7, nameEng: "Ironing Unit", nameBng: "ইস্ত্রি ইউনিট", sortOrder: 7, isActive: "Active" },
  {
    sl: 8,
    nameEng: "Packaging Unit",
    nameBng: "প্যাকেজিং ইউনিট",
    sortOrder: 8,
    isActive: "Active",
  },
  {
    sl: 9,
    nameEng: "Fabric Inspection",
    nameBng: "ফ্যাব্রিক পরিদর্শন",
    sortOrder: 9,
    isActive: "Active",
  },
  {
    sl: 10,
    nameEng: "Yarn Inspection",
    nameBng: "সুতা পরিদর্শন",
    sortOrder: 10,
    isActive: "Active",
  },
  {
    sl: 11,
    nameEng: "Dyes Lab Unit",
    nameBng: "ডাইস ল্যাব ইউনিট",
    sortOrder: 11,
    isActive: "Active",
  },
  {
    sl: 12,
    nameEng: "Boiler Station",
    nameBng: "বয়লার স্টেশন",
    sortOrder: 12,
    isActive: "Active",
  },
  {
    sl: 13,
    nameEng: "Generator Station",
    nameBng: "জেনারেটর স্টেশন",
    sortOrder: 13,
    isActive: "Active",
  },
  {
    sl: 14,
    nameEng: "Wastewater Treatment",
    nameBng: "বর্জ্য জল শোধনাগার",
    sortOrder: 14,
    isActive: "Active",
  },
  {
    sl: 15,
    nameEng: "Export Warehouse",
    nameBng: "রপ্তানি গুদাম",
    sortOrder: 15,
    isActive: "Active",
  },
  {
    sl: 16,
    nameEng: "Local Delivery Depot",
    nameBng: "স্থানীয় বিতরণ ডিপো",
    sortOrder: 16,
    isActive: "Active",
  },
  {
    sl: 17,
    nameEng: "Quality Control Lab",
    nameBng: "গুণমান নিয়ন্ত্রণ ল্যাব",
    sortOrder: 17,
    isActive: "Active",
  },
  {
    sl: 18,
    nameEng: "Design Studio",
    nameBng: "ডিজাইন স্টুডিও",
    sortOrder: 18,
    isActive: "Active",
  },
  {
    sl: 19,
    nameEng: "Sample Room Unit",
    nameBng: "নমুনা ঘর ইউনিট",
    sortOrder: 19,
    isActive: "Active",
  },
  {
    sl: 20,
    nameEng: "Maintenance Workshop",
    nameBng: "রক্ষণাবেক্ষণ কর্মশালা",
    sortOrder: 20,
    isActive: "Active",
  },
];

const DEFAULT_LINES: Line[] = [
  {
    sl: 1,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 01",
    lineBng: "লাইন ০১",
    sortOrder: 1,
    isActive: "Active",
  },
  {
    sl: 2,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 02",
    lineBng: "লাইন ০২",
    sortOrder: 2,
    isActive: "Active",
  },
  {
    sl: 3,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 03",
    lineBng: "লাইন ০৩",
    sortOrder: 3,
    isActive: "Active",
  },
  {
    sl: 4,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 04",
    lineBng: "লাইন ০৪",
    sortOrder: 4,
    isActive: "Active",
  },
  {
    sl: 5,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 05",
    lineBng: "লাইন ০৫",
    sortOrder: 5,
    isActive: "Active",
  },
  {
    sl: 6,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 06",
    lineBng: "লাইন ০৬",
    sortOrder: 6,
    isActive: "Active",
  },
  {
    sl: 7,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 07",
    lineBng: "লাইন ০৭",
    sortOrder: 7,
    isActive: "Active",
  },
  {
    sl: 8,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 08",
    lineBng: "লাইন ০৮",
    sortOrder: 8,
    isActive: "Active",
  },
  {
    sl: 9,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 09",
    lineBng: "লাইন ০৯",
    sortOrder: 9,
    isActive: "Active",
  },
  {
    sl: 10,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 10",
    lineBng: "লাইন ১০",
    sortOrder: 10,
    isActive: "Active",
  },
  {
    sl: 11,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 11",
    lineBng: "লাইন ১১",
    sortOrder: 11,
    isActive: "Active",
  },
  {
    sl: 12,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 12",
    lineBng: "লাইন ১২",
    sortOrder: 12,
    isActive: "Active",
  },
  {
    sl: 13,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 13",
    lineBng: "লাইন ১৩",
    sortOrder: 13,
    isActive: "Active",
  },
  {
    sl: 14,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 14",
    lineBng: "লাইন ১৪",
    sortOrder: 14,
    isActive: "Active",
  },
  {
    sl: 15,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 15",
    lineBng: "লাইন ১৫",
    sortOrder: 15,
    isActive: "Active",
  },
  {
    sl: 16,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 16",
    lineBng: "লাইন ১৬",
    sortOrder: 16,
    isActive: "Active",
  },
  {
    sl: 17,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 17",
    lineBng: "লাইন ১৭",
    sortOrder: 17,
    isActive: "Active",
  },
  {
    sl: 18,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 18",
    lineBng: "লাইন ১৮",
    sortOrder: 18,
    isActive: "Active",
  },
  {
    sl: 19,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 19",
    lineBng: "লাইন ১৯",
    sortOrder: 19,
    isActive: "Active",
  },
  {
    sl: 20,
    companyName: "Pakiza Knit Composite Ltd",
    lineEng: "Line 20",
    lineBng: "লাইন ২০",
    sortOrder: 20,
    isActive: "Active",
  },
];

const DEFAULT_DESIGNATIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Lead Engineer",
  "HR Executive",
  "HR Manager",
  "HR Director",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "DevOps Engineer",
  "Marketing Executive",
  "Sales Representative",
  "Office Assistant",
  "Executive Director",
  "Managing Director",
  "Accountant",
  "Finance Manager",
  "Operations Manager",
  "Receptionist",
];

// Company Basic Settings interface
interface CompanyBasicSettings {
  companyType: string;
  ssp: string;
  encryption: string;
  companyData: string;
  companyId: string;
  joinYearWithId: string;
  idFormat: string;
  officeId: string;
  systemId: string;
  deptWiseSection: string;
  employeeEditApproval: string;
  newEmployeeApproval: string;
  dashboard: string;
  authorizationLE: string;
  absentBasedOnInOut: string;
  absentDeductBasedOn: string;
  otRequisition: string;
  mlCount: string;
  mlStamp: string;
  ageVerification: string;
  maxAge: string;
  minAge: string;
  withoutInAbsent: string;
  minServiceLengthForLeave: string;
  autoSalaryProcess: string;
  otRateCalculation: string;
  searchingBy: string;
  holidayTiffin: string;
  holidayNight: string;
  earlyOut: string;
  earlyOutBasedOn: string;
  salaryBreakdownRound: string;
  sandwichHoliday: string;
  sandwichEmployeeType: string;
  lateTimeCalculation: string;
  halfLeave: string;
}

const DEFAULT_COMPANY_SETTINGS: CompanyBasicSettings = {
  companyType: "Knit",
  ssp: "Yes",
  encryption: "No",
  companyData: "Combined",
  companyId: "Combined",
  joinYearWithId: "Yes",
  idFormat: "000000",
  officeId: "No",
  systemId: "Yes",
  deptWiseSection: "Yes",
  employeeEditApproval: "No",
  newEmployeeApproval: "No",
  dashboard: "None",
  authorizationLE: "Early Out",
  absentBasedOnInOut: "No",
  absentDeductBasedOn: "Basic / 30 days",
  otRequisition: "No",
  mlCount: "120",
  mlStamp: "0",
  ageVerification: "Yes",
  maxAge: "70",
  minAge: "18",
  withoutInAbsent: "Yes",
  minServiceLengthForLeave: "0",
  autoSalaryProcess: "No",
  otRateCalculation: "Regular",
  searchingBy: "System ID",
  holidayTiffin: "No",
  holidayNight: "No",
  earlyOut: "Yes",
  earlyOutBasedOn: "Gross/30",
  salaryBreakdownRound: "Yes",
  sandwichHoliday: "No",
  sandwichEmployeeType: "ALL",
  lateTimeCalculation: "Late Time",
  halfLeave: "No",
};

const DEFAULT_HOLIDAYS: DefaultHoliday[] = [
  {
    sl: 1,
    year: 2024,
    effectiveDate: "2024-07-15",
    days: ["Friday"],
    remarks: "Initial configuration: Friday as default weekly holiday",
  },
  {
    sl: 2,
    year: 2026,
    effectiveDate: "2026-07-01",
    days: ["Friday", "Saturday"],
    remarks: "Updated weekend schedule: Friday & Saturday as default weekly holidays",
  },
];

function CompanySetupPage() {
  const search = Route.useSearch();
  const [activeTab, setActiveTab] = useState<TabType>(search.tab || "department");

  useEffect(() => {
    if (search.tab) {
      setActiveTab(search.tab);
    }
  }, [search.tab]);

  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");

  // Payslip Templates States
  const [payslipTemplates, setPayslipTemplates] = useState<PayslipTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<PayslipTemplate | null>(null);
  const [isConfiguringTemplate, setIsConfiguringTemplate] = useState(false);
  const [previewLang, setPreviewLang] = useState<"en" | "bn">("en");

  // Create Template Modal States
  const [isCreateTplOpen, setIsCreateTplOpen] = useState(false);
  const [tplTitle, setTplTitle] = useState("");
  const [tplCompany, setTplCompany] = useState("");
  const [tplEmpType, setTplEmpType] = useState("Permanent");

  // Load templates from local storage
  useEffect(() => {
    const saved = localStorage.getItem("payslip_templates_data");
    if (saved) {
      try {
        setPayslipTemplates(JSON.parse(saved));
      } catch (e) {
        setPayslipTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      setPayslipTemplates(DEFAULT_TEMPLATES);
      localStorage.setItem("payslip_templates_data", JSON.stringify(DEFAULT_TEMPLATES));
    }
  }, []);

  const saveTemplatesToStorage = (updatedList: PayslipTemplate[]) => {
    setPayslipTemplates(updatedList);
    localStorage.setItem("payslip_templates_data", JSON.stringify(updatedList));
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplTitle.trim()) {
      toast.error("Template title is required!");
      return;
    }
    const newTpl: PayslipTemplate = {
      id: `tpl-${Date.now()}`,
      title: tplTitle,
      companyName: tplCompany || (orgs[0]?.nameEng || "Pakiza Software Limited"),
      employeeType: tplEmpType,
      isActive: true,
      fields: JSON.parse(JSON.stringify(DEFAULT_PAYSLIP_FIELDS))
    };

    const updated = [...payslipTemplates, newTpl];
    saveTemplatesToStorage(updated);
    
    toast.success("Payslip template created successfully!");
    setIsCreateTplOpen(false);
    setTplTitle("");
    setEditingTemplate(newTpl);
    setIsConfiguringTemplate(true);
    toast.success("Template created successfully! Now configure its fields.");
  };

  const handleFieldChange = (key: string, updates: Partial<PayslipField>) => {
    if (!editingTemplate) return;
    const updatedFields = editingTemplate.fields.map(field => 
      field.key === key ? { ...field, ...updates } : field
    );
    setEditingTemplate({
      ...editingTemplate,
      fields: updatedFields
    });
  };

  const handleSaveTemplateConfig = () => {
    if (!editingTemplate) return;
    const updated = payslipTemplates.map(tpl => 
      tpl.id === editingTemplate.id ? editingTemplate : tpl
    );
    saveTemplatesToStorage(updated);
    setIsConfiguringTemplate(false);
    setEditingTemplate(null);
    toast.success("Template configuration saved successfully!");
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      const updated = payslipTemplates.filter(t => t.id !== id);
      saveTemplatesToStorage(updated);
      toast.success("Template deleted.");
    }
  };

  const handleToggleTemplateStatus = (id: string) => {
    const updated = payslipTemplates.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    saveTemplatesToStorage(updated);
    toast.success("Template status updated.");
  };

  // Lists State
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [mappings, setMappings] = useState<CompanyMapping[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [holidays, setHolidays] = useState<DefaultHoliday[]>([]);

  // Form states - Holiday
  const [holidayYear, setHolidayYear] = useState<number>(2026);
  const [holidayEffectiveDate, setHolidayEffectiveDate] = useState("");
  const [holidayDays, setHolidayDays] = useState<string[]>([]);
  const [holidayRemarks, setHolidayRemarks] = useState("");

  // Designation assignment state
  const [deptDesignations, setDeptDesignations] = useState<Record<number, string[]>>({});
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningDept, setAssigningDept] = useState<Department | null>(null);
  const [tempDesignations, setTempDesignations] = useState<string[]>([]);
  const [selectedNewDesignation, setSelectedNewDesignation] = useState("");
  const [customDesignation, setCustomDesignation] = useState("");

  // Company Basic Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsCompany, setSettingsCompany] = useState<Organization | null>(null);
  const [settingsTab, setSettingsTab] = useState("all");
  const [companySettings, setCompanySettings] = useState<Record<number, CompanyBasicSettings>>({});

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabType;
      if (
        tabParam &&
        ["company", "area", "mapping", "department", "section", "unit", "line", "holiday"].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }

    const safeParse = (key: string, defaultVal: any) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return defaultVal;
        // Override if length is less than default to populate expanded list
        if (parsed.length < defaultVal.length) {
          return defaultVal;
        }
        return parsed;
      } catch (e) {
        return defaultVal;
      }
    };

    // Organizations
    const orgsData = safeParse("hris_organizations", DEFAULT_ORGS);
    setOrgs(orgsData);
    localStorage.setItem("hris_organizations", JSON.stringify(orgsData));

    // Areas
    const areasData = safeParse("hris_areas", DEFAULT_AREAS);
    setAreas(areasData);
    localStorage.setItem("hris_areas", JSON.stringify(areasData));

    // Company Mappings
    const mappingsData = safeParse("hris_company_mappings", DEFAULT_MAPPINGS);
    setMappings(mappingsData);
    localStorage.setItem("hris_company_mappings", JSON.stringify(mappingsData));

    const assignDefaultCompany = (items: any[]) => {
      const defaultCompany = orgsData[0]?.nameEng || "Pakiza Knit Composite Ltd";
      return items.map((item) => ({
        ...item,
        companyName: item.companyName || defaultCompany,
      }));
    };

    // Departments
    const departmentsData = assignDefaultCompany(safeParse("hris_departments", DEFAULT_DEPARTMENTS));
    setDepartments(departmentsData);
    localStorage.setItem("hris_departments", JSON.stringify(departmentsData));

    // Sections
    const sectionsData = assignDefaultCompany(safeParse("hris_sections", DEFAULT_SECTIONS));
    setSections(sectionsData);
    localStorage.setItem("hris_sections", JSON.stringify(sectionsData));

    // Units
    const unitsData = assignDefaultCompany(safeParse("hris_units", DEFAULT_UNITS));
    setUnits(unitsData);
    localStorage.setItem("hris_units", JSON.stringify(unitsData));

    // Lines
    const linesData = assignDefaultCompany(safeParse("hris_lines", DEFAULT_LINES));
    setLines(linesData);
    localStorage.setItem("hris_lines", JSON.stringify(linesData));

    // Default Holidays
    const holidaysData = safeParse("hris_default_holidays", DEFAULT_HOLIDAYS);
    setHolidays(holidaysData);
    localStorage.setItem("hris_default_holidays", JSON.stringify(holidaysData));

    // Load Department Designations
    const deptDesignationsData = localStorage.getItem("hris_dept_designations");
    if (deptDesignationsData) {
      try {
        setDeptDesignations(JSON.parse(deptDesignationsData));
      } catch (e) {
        setDeptDesignations({});
      }
    } else {
      const initial: Record<number, string[]> = {
        1: ["HR Director", "HR Manager", "HR Executive"],
        2: ["Lead Engineer", "Senior Software Engineer", "Software Engineer", "UI/UX Designer"],
      };
      setDeptDesignations(initial);
      localStorage.setItem("hris_dept_designations", JSON.stringify(initial));
    }
  }, []);

  // Shared Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSl, setEditSl] = useState<number | null>(null);

  // Copy Modal States
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copySourceCompany, setCopySourceCompany] = useState("");
  const [copyTargetCompany, setCopyTargetCompany] = useState("");
  const [selectedCopyItems, setSelectedCopyItems] = useState<number[]>([]);
  const [formSelectedCompanies, setFormSelectedCompanies] = useState<string[]>([]);

  // Form states - Company
  const [orgCode, setOrgCode] = useState("");
  const [orgNameEng, setOrgNameEng] = useState("");
  const [orgNameBng, setOrgNameBng] = useState("");
  const [orgShortName, setOrgShortName] = useState("");
  const [orgAddressEng, setOrgAddressEng] = useState("");
  const [orgAddressBng, setOrgAddressBng] = useState("");
  const [orgIsActive, setOrgIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Area
  const [areaCode, setAreaCode] = useState("");
  const [areaCompany, setAreaCompany] = useState("");
  const [areaNameEng, setAreaNameEng] = useState("");
  const [areaNameBng, setAreaNameBng] = useState("");
  const [areaShortName, setAreaShortName] = useState("");
  const [areaAddressEng, setAreaAddressEng] = useState("");
  const [areaAddressBng, setAreaAddressBng] = useState("");
  const [areaPurchase, setAreaPurchase] = useState("");
  const [areaIsActive, setAreaIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Mapping
  const [mapName, setMapName] = useState("");
  const [mapMain, setMapMain] = useState("");
  const [mapRelayDuty, setMapRelayDuty] = useState("");

  // Form states - Department
  const [depCode, setDepCode] = useState("");
  const [depNameEng, setDepNameEng] = useState("");
  const [depNameBng, setDepNameBng] = useState("");
  const [depShortName, setDepShortName] = useState("");
  const [depIsActive, setDepIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Section
  const [secDept, setSecDept] = useState("");
  const [secCode, setSecCode] = useState("");
  const [secNameEng, setSecNameEng] = useState("");
  const [secNameBng, setSecNameBng] = useState("");
  const [secShortName, setSecShortName] = useState("");
  const [secIsActive, setSecIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Unit
  const [unitNameEng, setUnitNameEng] = useState("");
  const [unitNameBng, setUnitNameBng] = useState("");
  const [unitSort, setUnitSort] = useState<number>(0);
  const [unitIsActive, setUnitIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Line
  const [lineCompany, setLineCompany] = useState("");
  const [lineEng, setLineEng] = useState("");
  const [lineBng, setLineBng] = useState("");
  const [lineSort, setLineSort] = useState<number>(0);
  const [lineIsActive, setLineIsActive] = useState<"Active" | "Inactive">("Active");

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "company") {
      const item = orgs.find((o) => o.sl === sl);
      setOrgCode(item?.code || "");
      setOrgNameEng(item?.nameEng || "");
      setOrgNameBng(item?.nameBng || "");
      setOrgShortName(item?.shortName || "");
      setOrgAddressEng(item?.addressEng || "");
      setOrgAddressBng(item?.addressBng || "");
      setOrgIsActive(item?.isActive || "Active");
    } else if (activeTab === "area") {
      const item = areas.find((a) => a.sl === sl);
      setAreaCode(item?.code || "");
      setAreaCompany(item?.companyName || orgs[0]?.nameEng || "");
      setAreaNameEng(item?.nameEng || "");
      setAreaNameBng(item?.nameBng || "");
      setAreaShortName(item?.shortName || "");
      setAreaAddressEng(item?.addressEng || "");
      setAreaAddressBng(item?.addressBng || "");
      setAreaPurchase(item?.purchase || "");
      setAreaIsActive(item?.isActive || "Active");
    } else if (activeTab === "mapping") {
      const item = mappings.find((m) => m.sl === sl);
      setMapName(item?.name || "");
      setMapMain(item?.main || "");
      setMapRelayDuty(item?.relayDuty || "");
    } else if (activeTab === "department") {
      const item = departments.find((d) => d.sl === sl);
      setDepCode(item?.code || "");
      setDepNameEng(item?.nameEng || "");
      setDepNameBng(item?.nameBng || "");
      setDepShortName(item?.shortName || "");
      setDepIsActive(item?.isActive || "Active");
      setFormSelectedCompanies(item?.companyName ? [item.companyName] : []);
    } else if (activeTab === "section") {
      const item = sections.find((s) => s.sl === sl);
      setSecDept(item?.departmentName || departments[0]?.nameEng || "");
      setSecCode(item?.code || "");
      setSecNameEng(item?.nameEng || "");
      setSecNameBng(item?.nameBng || "");
      setSecShortName(item?.shortName || "");
      setSecIsActive(item?.isActive || "Active");
      setFormSelectedCompanies(item?.companyName ? [item.companyName] : []);
    } else if (activeTab === "unit") {
      const item = units.find((u) => u.sl === sl);
      setUnitNameEng(item?.nameEng || "");
      setUnitNameBng(item?.nameBng || "");
      setUnitSort(item?.sortOrder || units.length + 1);
      setUnitIsActive(item?.isActive || "Active");
      setFormSelectedCompanies(item?.companyName ? [item.companyName] : []);
    } else if (activeTab === "line") {
      const item = lines.find((l) => l.sl === sl);
      setLineCompany(item?.companyName || orgs[0]?.nameEng || "");
      setLineEng(item?.lineEng || "");
      setLineBng(item?.lineBng || "");
      setLineSort(item?.sortOrder || lines.length + 1);
      setLineIsActive(item?.isActive || "Active");
      setFormSelectedCompanies(item?.companyName ? [item.companyName] : []);
    } else if (activeTab === "holiday") {
      const item = holidays.find((h) => h.sl === sl);
      setHolidayYear(item?.year || 2026);
      setHolidayEffectiveDate(item?.effectiveDate || "");
      setHolidayDays(item?.days || []);
      setHolidayRemarks(item?.remarks || "");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "company") {
      const updated = orgs.filter((o) => o.sl !== sl).map((o, idx) => ({ ...o, sl: idx + 1 }));
      setOrgs(updated);
      localStorage.setItem("hris_organizations", JSON.stringify(updated));
    } else if (activeTab === "area") {
      const updated = areas.filter((a) => a.sl !== sl).map((a, idx) => ({ ...a, sl: idx + 1 }));
      setAreas(updated);
      localStorage.setItem("hris_areas", JSON.stringify(updated));
    } else if (activeTab === "mapping") {
      const updated = mappings.filter((m) => m.sl !== sl).map((m, idx) => ({ ...m, sl: idx + 1 }));
      setMappings(updated);
      localStorage.setItem("hris_company_mappings", JSON.stringify(updated));
    } else if (activeTab === "department") {
      const updated = departments
        .filter((d) => d.sl !== sl)
        .map((d, idx) => ({ ...d, sl: idx + 1 }));
      setDepartments(updated);
      localStorage.setItem("hris_departments", JSON.stringify(updated));
    } else if (activeTab === "section") {
      const updated = sections.filter((s) => s.sl !== sl).map((s, idx) => ({ ...s, sl: idx + 1 }));
      setSections(updated);
      localStorage.setItem("hris_sections", JSON.stringify(updated));
    } else if (activeTab === "unit") {
      const updated = units.filter((u) => u.sl !== sl).map((u, idx) => ({ ...u, sl: idx + 1 }));
      setUnits(updated);
      localStorage.setItem("hris_units", JSON.stringify(updated));
    } else if (activeTab === "line") {
      const updated = lines.filter((l) => l.sl !== sl).map((l, idx) => ({ ...l, sl: idx + 1 }));
      setLines(updated);
      localStorage.setItem("hris_lines", JSON.stringify(updated));
    } else if (activeTab === "holiday") {
      const updated = holidays.filter((h) => h.sl !== sl).map((h, idx) => ({ ...h, sl: idx + 1 }));
      setHolidays(updated);
      localStorage.setItem("hris_default_holidays", JSON.stringify(updated));
    }
    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "company") {
      if (!orgNameEng) {
        toast.error("English name is required.");
        return;
      }
      let nextList = [...orgs];
      if (editSl !== null) {
        nextList = orgs.map((o) =>
          o.sl === editSl
            ? {
              ...o,
              code: orgCode,
              nameEng: orgNameEng,
              nameBng: orgNameBng,
              shortName: orgShortName,
              addressEng: orgAddressEng,
              addressBng: orgAddressBng,
              isActive: orgIsActive,
            }
            : o,
        );
      } else {
        const sl = orgs.length > 0 ? Math.max(...orgs.map((o) => o.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: orgCode,
          nameEng: orgNameEng,
          nameBng: orgNameBng,
          shortName: orgShortName,
          addressEng: orgAddressEng,
          addressBng: orgAddressBng,
          isActive: orgIsActive,
        });
      }
      setOrgs(nextList);
      localStorage.setItem("hris_organizations", JSON.stringify(nextList));
    } else if (activeTab === "area") {
      if (!areaNameEng) {
        toast.error("Area Name is required.");
        return;
      }
      let nextList = [...areas];
      if (editSl !== null) {
        nextList = areas.map((a) =>
          a.sl === editSl
            ? {
              ...a,
              code: areaCode,
              companyName: areaCompany,
              nameEng: areaNameEng,
              nameBng: areaNameBng,
              shortName: areaShortName,
              addressEng: areaAddressEng,
              addressBng: areaAddressBng,
              purchase: areaPurchase,
              isActive: areaIsActive,
            }
            : a,
        );
      } else {
        const sl = areas.length > 0 ? Math.max(...areas.map((a) => a.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: areaCode,
          companyName: areaCompany,
          nameEng: areaNameEng,
          nameBng: areaNameBng,
          shortName: areaShortName,
          addressEng: areaAddressEng,
          addressBng: areaAddressBng,
          purchase: areaPurchase,
          isActive: areaIsActive,
        });
      }
      setAreas(nextList);
      localStorage.setItem("hris_areas", JSON.stringify(nextList));
    } else if (activeTab === "mapping") {
      if (!mapName || !mapMain) {
        toast.error("Name and Main group are required.");
        return;
      }
      let nextList = [...mappings];
      if (editSl !== null) {
        nextList = mappings.map((m) =>
          m.sl === editSl ? { ...m, name: mapName, main: mapMain, relayDuty: mapRelayDuty } : m,
        );
      } else {
        const sl = mappings.length > 0 ? Math.max(...mappings.map((m) => m.sl)) + 1 : 1;
        nextList.push({
          sl,
          name: mapName,
          main: mapMain,
          relayDuty: mapRelayDuty,
          checked: false,
        });
      }
      setMappings(nextList);
      localStorage.setItem("hris_company_mappings", JSON.stringify(nextList));
    } else if (activeTab === "department") {
      if (!depNameEng) {
        toast.error("Department name is required.");
        return;
      }
      if (formSelectedCompanies.length === 0) {
        toast.error("Please select at least one concern.");
        return;
      }
      let nextList = [...departments];
      if (editSl !== null) {
        nextList = departments.map((d) =>
          d.sl === editSl
            ? {
              ...d,
              code: depCode,
              nameEng: depNameEng,
              nameBng: depNameBng,
              shortName: depShortName,
              isActive: depIsActive,
              companyName: formSelectedCompanies[0],
            }
            : d,
        );
        if (formSelectedCompanies.length > 1) {
          formSelectedCompanies.slice(1).forEach((company) => {
            const sl = nextList.length > 0 ? Math.max(...nextList.map((d) => d.sl)) + 1 : 1;
            nextList.push({
              sl,
              code: depCode,
              nameEng: depNameEng,
              nameBng: depNameBng,
              shortName: depShortName,
              isActive: depIsActive,
              companyName: company,
            });
          });
        }
      } else {
        formSelectedCompanies.forEach((company) => {
          const sl = nextList.length > 0 ? Math.max(...nextList.map((d) => d.sl)) + 1 : 1;
          nextList.push({
            sl,
            code: depCode,
            nameEng: depNameEng,
            nameBng: depNameBng,
            shortName: depShortName,
            isActive: depIsActive,
            companyName: company,
          });
        });
      }
      setDepartments(nextList);
      localStorage.setItem("hris_departments", JSON.stringify(nextList));
    } else if (activeTab === "section") {
      if (!secNameEng) {
        toast.error("Section name is required.");
        return;
      }
      if (formSelectedCompanies.length === 0) {
        toast.error("Please select at least one concern.");
        return;
      }
      let nextList = [...sections];
      if (editSl !== null) {
        nextList = sections.map((s) =>
          s.sl === editSl
            ? {
              ...s,
              departmentName: secDept,
              code: secCode,
              nameEng: secNameEng,
              nameBng: secNameBng,
              shortName: secShortName,
              isActive: secIsActive,
              companyName: formSelectedCompanies[0],
            }
            : s,
        );
        if (formSelectedCompanies.length > 1) {
          formSelectedCompanies.slice(1).forEach((company) => {
            const sl = nextList.length > 0 ? Math.max(...nextList.map((s) => s.sl)) + 1 : 1;
            nextList.push({
              sl,
              departmentName: secDept,
              code: secCode,
              nameEng: secNameEng,
              nameBng: secNameBng,
              shortName: secShortName,
              isActive: secIsActive,
              companyName: company,
            });
          });
        }
      } else {
        formSelectedCompanies.forEach((company) => {
          const sl = nextList.length > 0 ? Math.max(...nextList.map((s) => s.sl)) + 1 : 1;
          nextList.push({
            sl,
            departmentName: secDept,
            code: secCode,
            nameEng: secNameEng,
            nameBng: secNameBng,
            shortName: secShortName,
            isActive: secIsActive,
            companyName: company,
          });
        });
      }
      setSections(nextList);
      localStorage.setItem("hris_sections", JSON.stringify(nextList));
    } else if (activeTab === "unit") {
      if (!unitNameEng) {
        toast.error("Unit name is required.");
        return;
      }
      if (formSelectedCompanies.length === 0) {
        toast.error("Please select at least one concern.");
        return;
      }
      let nextList = [...units];
      if (editSl !== null) {
        nextList = units.map((u) =>
          u.sl === editSl
            ? {
              ...u,
              nameEng: unitNameEng,
              nameBng: unitNameBng,
              sortOrder: Number(unitSort),
              isActive: unitIsActive,
              companyName: formSelectedCompanies[0],
            }
            : u,
        );
        if (formSelectedCompanies.length > 1) {
          formSelectedCompanies.slice(1).forEach((company) => {
            const sl = nextList.length > 0 ? Math.max(...nextList.map((u) => u.sl)) + 1 : 1;
            nextList.push({
              sl,
              nameEng: unitNameEng,
              nameBng: unitNameBng,
              sortOrder: Number(unitSort),
              isActive: unitIsActive,
              companyName: company,
            });
          });
        }
      } else {
        formSelectedCompanies.forEach((company) => {
          const sl = nextList.length > 0 ? Math.max(...nextList.map((u) => u.sl)) + 1 : 1;
          nextList.push({
            sl,
            nameEng: unitNameEng,
            nameBng: unitNameBng,
            sortOrder: Number(unitSort),
            isActive: unitIsActive,
            companyName: company,
          });
        });
      }
      setUnits(nextList);
      localStorage.setItem("hris_units", JSON.stringify(nextList));
    } else if (activeTab === "line") {
      if (!lineEng) {
        toast.error("Line name is required.");
        return;
      }
      if (formSelectedCompanies.length === 0) {
        toast.error("Please select at least one concern.");
        return;
      }
      let nextList = [...lines];
      if (editSl !== null) {
        nextList = lines.map((l) =>
          l.sl === editSl
            ? {
              ...l,
              companyName: formSelectedCompanies[0],
              lineEng: lineEng,
              lineBng: lineBng,
              sortOrder: Number(lineSort),
              isActive: lineIsActive,
            }
            : l,
        );
        if (formSelectedCompanies.length > 1) {
          formSelectedCompanies.slice(1).forEach((company) => {
            const sl = nextList.length > 0 ? Math.max(...nextList.map((l) => l.sl)) + 1 : 1;
            nextList.push({
              sl,
              companyName: company,
              lineEng,
              lineBng,
              sortOrder: Number(lineSort),
              isActive: lineIsActive,
            });
          });
        }
      } else {
        formSelectedCompanies.forEach((company) => {
          const sl = nextList.length > 0 ? Math.max(...nextList.map((l) => l.sl)) + 1 : 1;
          nextList.push({
            sl,
            companyName: company,
            lineEng,
            lineBng,
            sortOrder: Number(lineSort),
            isActive: lineIsActive,
          });
        });
      }
      setLines(nextList);
      localStorage.setItem("hris_lines", JSON.stringify(nextList));
    } else if (activeTab === "holiday") {
      if (!holidayEffectiveDate) {
        toast.error("Effective date is required.");
        return;
      }
      if (holidayDays.length === 0) {
        toast.error("Please select at least one holiday day.");
        return;
      }
      let nextList = [...holidays];
      if (editSl !== null) {
        nextList = holidays.map((h) =>
          h.sl === editSl
            ? {
                ...h,
                year: Number(holidayYear),
                effectiveDate: holidayEffectiveDate,
                days: holidayDays,
                remarks: holidayRemarks,
              }
            : h
        );
      } else {
        const sl = nextList.length > 0 ? Math.max(...nextList.map((h) => h.sl)) + 1 : 1;
        nextList.push({
          sl,
          year: Number(holidayYear),
          effectiveDate: holidayEffectiveDate,
          days: holidayDays,
          remarks: holidayRemarks,
        });
      }
      setHolidays(nextList);
      localStorage.setItem("hris_default_holidays", JSON.stringify(nextList));
    }

    toast.success("Saved successfully");
    setIsFormOpen(false);
  };

  const handleCopySubmit = () => {
    if (!copySourceCompany || !copyTargetCompany) {
      toast.error("Please select both source and target companies.");
      return;
    }
    if (selectedCopyItems.length === 0) {
      toast.error("Please select at least one item to copy.");
      return;
    }

    if (activeTab === "department") {
      let nextList = [...departments];
      const itemsToCopy = departments.filter((d) => selectedCopyItems.includes(d.sl));
      let maxSl = departments.length > 0 ? Math.max(...departments.map((d) => d.sl)) : 0;
      itemsToCopy.forEach((item) => {
        maxSl++;
        nextList.push({ ...item, sl: maxSl, companyName: copyTargetCompany });
      });
      setDepartments(nextList);
      localStorage.setItem("hris_departments", JSON.stringify(nextList));
    } else if (activeTab === "section") {
      let nextList = [...sections];
      const itemsToCopy = sections.filter((s) => selectedCopyItems.includes(s.sl));
      let maxSl = sections.length > 0 ? Math.max(...sections.map((s) => s.sl)) : 0;
      itemsToCopy.forEach((item) => {
        maxSl++;
        nextList.push({ ...item, sl: maxSl, companyName: copyTargetCompany });
      });
      setSections(nextList);
      localStorage.setItem("hris_sections", JSON.stringify(nextList));
    } else if (activeTab === "unit") {
      let nextList = [...units];
      const itemsToCopy = units.filter((u) => selectedCopyItems.includes(u.sl));
      let maxSl = units.length > 0 ? Math.max(...units.map((u) => u.sl)) : 0;
      itemsToCopy.forEach((item) => {
        maxSl++;
        nextList.push({ ...item, sl: maxSl, companyName: copyTargetCompany });
      });
      setUnits(nextList);
      localStorage.setItem("hris_units", JSON.stringify(nextList));
    } else if (activeTab === "line") {
      let nextList = [...lines];
      const itemsToCopy = lines.filter((l) => selectedCopyItems.includes(l.sl));
      let maxSl = lines.length > 0 ? Math.max(...lines.map((l) => l.sl)) : 0;
      itemsToCopy.forEach((item) => {
        maxSl++;
        nextList.push({ ...item, sl: maxSl, companyName: copyTargetCompany });
      });
      setLines(nextList);
      localStorage.setItem("hris_lines", JSON.stringify(nextList));
    }

    toast.success("Items copied successfully");
    setIsCopyModalOpen(false);
    setSelectedCopyItems([]);
  };

  const getSourceItemsForCopy = () => {
    if (!copySourceCompany) return [];
    if (activeTab === "department") return departments.filter((d) => d.companyName === copySourceCompany);
    if (activeTab === "section") return sections.filter((s) => s.companyName === copySourceCompany);
    if (activeTab === "unit") return units.filter((u) => u.companyName === copySourceCompany);
    if (activeTab === "line") return lines.filter((l) => l.companyName === copySourceCompany);
    return [];
  };

  const insetWrapperClass = "space-y-1.5";
  const insetLabelClass = "text-xs font-semibold text-foreground/80 block";
  const insetInputClass = "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none";
  const insetSelectClass = "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center]";

  // Tab Header Items
  const tabsList: { type: TabType; label: string; icon: any }[] = [
    { type: "department", label: "Department", icon: Users2 },
    { type: "section", label: "Section", icon: Grid },
    { type: "unit", label: "Unit", icon: Building2 },
    { type: "line", label: "Line", icon: Grid },
    { type: "holiday", label: "Default Holiday Setup", icon: Calendar },
    { type: "payslip", label: "Payslip Configuration", icon: Settings },
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
                <span className="text-primary font-bold">Structure Setup</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Building2 className="size-6 text-primary" />
                Company Setup
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => {
                  setCopySourceCompany("");
                  setCopyTargetCompany(companyFilter === "all" ? "" : companyFilter);
                  setSelectedCopyItems([]);
                  setIsCopyModalOpen(true);
                }}
                className="h-10 px-4 rounded-xl bg-muted text-foreground border border-border/60 font-semibold text-sm shadow-sm hover:bg-muted/80 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <Layers className="size-4.5 text-blue-500" /> Copy From...
              </button>
              <button
                onClick={() => openForm(null)}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="size-4.5" /> Add New Record
              </button>
            </div>
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${isActive
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
          {activeTab !== "payslip" && (
            <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="w-full sm:w-64 md:w-80 h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus-within:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all flex items-center gap-2.5 shadow-sm">
                  <Search className="size-4.5 text-muted-foreground/70" />
                  <input
                    type="text"
                    placeholder={`Search ${tabsList.find((t) => t.type === activeTab)?.label}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/50 font-medium"
                  />
                </div>
                <div className="w-full sm:w-64 md:w-72">
                  <SearchableSelect
                    value={companyFilter}
                    onChange={(val) => setCompanyFilter(val)}
                    options={[
                      { value: "all", label: "Select Company" },
                      ...orgs.map((org) => ({ value: org.nameEng, label: org.nameEng }))
                    ]}
                    placeholder="Select Company"
                  />
                </div>
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
          )}

          {/* Payslip Configuration Tab Content */}
          {activeTab === "payslip" && (
            <>
              {!isConfiguringTemplate ? (
                /* List View of Templates */
                <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                    <div>
                      <h2 className="text-base font-bold text-foreground">Payslip Templates Setup</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Manage and customize payslip columns and translations based on employee types.</p>
                    </div>
                    <button
                      onClick={() => {
                        setTplTitle("");
                        setTplCompany(orgs[0]?.nameEng || "Pakiza Software Limited");
                        setTplEmpType("Permanent");
                        setIsCreateTplOpen(true);
                      }}
                      className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Plus className="size-4.5" /> Create New Template
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-border/40 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                      <thead className="bg-muted/30 text-muted-foreground uppercase font-bold tracking-wider text-xs border-b border-border/40">
                        <tr>
                          <th className="px-5 py-4 w-[60px] text-center border-r border-border/30">#</th>
                          <th className="px-5 py-4">Template Title</th>
                          <th className="px-5 py-4">Target Company</th>
                          <th className="px-5 py-4">Employee Type</th>
                          <th className="px-5 py-4 text-center w-[120px]">Status</th>
                          <th className="px-5 py-4 text-center w-[150px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-foreground">
                        {payslipTemplates.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-5 py-12 text-center">
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <LayoutTemplate className="size-6" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-bold text-foreground">No Payslip Templates</p>
                                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">You haven't configured any payslip templates yet. Create one to customize how payslips appear for different employee types.</p>
                                </div>
                                <button
                                  onClick={() => {
                                    setTplTitle("");
                                    setTplCompany(orgs[0]?.nameEng || "Pakiza Software Limited");
                                    setTplEmpType("Permanent");
                                    setIsCreateTplOpen(true);
                                  }}
                                  className="h-9 px-4 mt-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                >
                                  <Plus className="size-4" /> Create First Template
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          payslipTemplates.map((tpl, idx) => (
                            <tr key={tpl.id} className="group hover:bg-muted/40 transition-colors">
                              <td className="px-5 py-4 text-center text-slate-500 font-normal border-r border-border/30">{idx + 1}</td>
                              <td className="px-5 py-4 font-bold text-foreground">{tpl.title}</td>
                              <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{tpl.companyName}</td>
                              <td className="px-5 py-4">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/15">
                                  {tpl.employeeType}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-center">
                                <button
                                  onClick={() => handleToggleTemplateStatus(tpl.id)}
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                                    tpl.isActive
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                      : "bg-slate-500/10 text-slate-650 border-slate-500/20"
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
                                      setIsConfiguringTemplate(true);
                                    }}
                                    className="h-8 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all flex items-center gap-1.5"
                                    title="Configure Fields"
                                  >
                                    <Settings className="size-3.5" /> Configure
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTemplate(tpl.id)}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                                    title="Delete Template"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Editor View of Templates */
                editingTemplate && (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Form Settings */}
                    <div className="xl:col-span-7 space-y-6">
                      <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm space-y-4">
                        {/* Top Bar inside Card */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/15 uppercase tracking-wide">
                                {editingTemplate.employeeType}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                {editingTemplate.companyName}
                              </span>
                            </div>
                            <h2 className="text-base font-bold text-foreground mt-1">Configure: {editingTemplate.title}</h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsConfiguringTemplate(false);
                                setEditingTemplate(null);
                              }}
                              className="h-9 px-4 rounded-xl border border-border/40 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all hover:bg-muted flex items-center gap-1.5"
                            >
                              <ArrowLeft className="size-3.5" /> Back to List
                            </button>
                            <button
                              onClick={handleSaveTemplateConfig}
                              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold transition-all hover:bg-primary/90 shadow-sm flex items-center gap-1.5"
                            >
                              <Save className="size-3.5" /> Save Template
                            </button>
                          </div>
                        </div>

                        {/* Sections */}
                        {/* Status Fields */}
                        <div className="space-y-3 pt-2">
                          <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-primary/20 pb-1.5">Working Status Section</h3>
                          <div className="divide-y divide-border/20 max-h-[30vh] overflow-y-auto pr-1">
                            {editingTemplate.fields.filter(f => f.category === "status").map(field => (
                              <div key={field.key} className="grid grid-cols-12 gap-3 items-center py-2 text-xs">
                                <div className="col-span-3">
                                  <span className="font-bold text-foreground block">{field.defaultLabelEng}</span>
                                  <span className="text-[10px] text-muted-foreground">{field.defaultLabelBng}</span>
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="text"
                                    value={field.customLabelEng}
                                    onChange={(e) => handleFieldChange(field.key, { customLabelEng: e.target.value })}
                                    placeholder={field.defaultLabelEng}
                                    className="w-full h-8 px-2.5 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs outline-none transition-all"
                                  />
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="text"
                                    value={field.customLabelBng}
                                    onChange={(e) => handleFieldChange(field.key, { customLabelBng: e.target.value })}
                                    placeholder={field.defaultLabelBng}
                                    className="w-full h-8 px-2.5 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs outline-none transition-all"
                                  />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  <label className="relative inline-flex items-center cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={field.isVisible}
                                      onChange={(e) => handleFieldChange(field.key, { isVisible: e.target.checked })}
                                      className="sr-only peer"
                                    />
                                    <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 dark:after:border-slate-655 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Payment Fields */}
                        <div className="space-y-3 pt-2">
                          <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-primary/20 pb-1.5">Payments & Earnings Section</h3>
                          <div className="divide-y divide-border/20 max-h-[30vh] overflow-y-auto pr-1">
                            {editingTemplate.fields.filter(f => f.category === "payment").map(field => (
                              <div key={field.key} className="grid grid-cols-12 gap-3 items-center py-2 text-xs">
                                <div className="col-span-3">
                                  <span className="font-bold text-foreground block">{field.defaultLabelEng}</span>
                                  <span className="text-[10px] text-muted-foreground">{field.defaultLabelBng}</span>
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="text"
                                    value={field.customLabelEng}
                                    onChange={(e) => handleFieldChange(field.key, { customLabelEng: e.target.value })}
                                    placeholder={field.defaultLabelEng}
                                    className="w-full h-8 px-2.5 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs outline-none transition-all"
                                  />
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="text"
                                    value={field.customLabelBng}
                                    onChange={(e) => handleFieldChange(field.key, { customLabelBng: e.target.value })}
                                    placeholder={field.defaultLabelBng}
                                    className="w-full h-8 px-2.5 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs outline-none transition-all"
                                  />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  <label className="relative inline-flex items-center cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={field.isVisible}
                                      onChange={(e) => handleFieldChange(field.key, { isVisible: e.target.checked })}
                                      className="sr-only peer"
                                    />
                                    <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-355 dark:after:border-slate-655 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Deduction Fields */}
                        <div className="space-y-3 pt-2">
                          <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-primary/20 pb-1.5">Deductions Section</h3>
                          <div className="divide-y divide-border/20 max-h-[30vh] overflow-y-auto pr-1">
                            {editingTemplate.fields.filter(f => f.category === "deduction").map(field => (
                              <div key={field.key} className="grid grid-cols-12 gap-3 items-center py-2 text-xs">
                                <div className="col-span-3">
                                  <span className="font-bold text-foreground block">{field.defaultLabelEng}</span>
                                  <span className="text-[10px] text-muted-foreground">{field.defaultLabelBng}</span>
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="text"
                                    value={field.customLabelEng}
                                    onChange={(e) => handleFieldChange(field.key, { customLabelEng: e.target.value })}
                                    placeholder={field.defaultLabelEng}
                                    className="w-full h-8 px-2.5 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs outline-none transition-all"
                                  />
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="text"
                                    value={field.customLabelBng}
                                    onChange={(e) => handleFieldChange(field.key, { customLabelBng: e.target.value })}
                                    placeholder={field.defaultLabelBng}
                                    className="w-full h-8 px-2.5 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary text-xs outline-none"
                                  />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  <label className="relative inline-flex items-center cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={field.isVisible}
                                      onChange={(e) => handleFieldChange(field.key, { isVisible: e.target.checked })}
                                      className="sr-only peer"
                                    />
                                    <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-355 dark:after:border-slate-655 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Live Interactive Mockup */}
                    <div className="xl:col-span-5 space-y-4 xl:sticky xl:top-[90px]">
                      <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                          <h3 className="text-sm font-bold text-foreground">Interactive Payslip Preview</h3>
                          <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/40 shadow-inner">
                            <button
                              onClick={() => setPreviewLang("en")}
                              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${previewLang === "en" ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                            >
                              English
                            </button>
                            <button
                              onClick={() => setPreviewLang("bn")}
                              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${previewLang === "bn" ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                            >
                              বাংলা
                            </button>
                          </div>
                        </div>

                        {/* Preview Container */}
                        <div className="bg-white text-black p-5 rounded-xl border border-slate-300 shadow-sm font-sans relative overflow-hidden select-none leading-normal">
                          {/* Decorative Sideline */}
                          <div className="absolute top-0 right-3 w-[2px] h-full border-r border-dotted border-black/30" />

                          {/* Company Header */}
                          <div className="text-center font-bold text-[14px] uppercase tracking-tight">
                            {editingTemplate.companyName}
                          </div>
                          <div className="text-center text-[10.5px] font-bold border-b border-black pb-1 mb-2 tracking-tight">
                            {previewLang === "en" ? "Pay Slip For the month of -Jul, 2026" : "পে স্লিপ - জুলাই, ২০২৬"}
                          </div>

                          {/* Emp Info */}
                          <div className="grid grid-cols-2 text-[10px] leading-relaxed mb-2.5">
                            <div>
                              <span className="font-bold">{previewLang === "en" ? "ID" : "আইডি"}:</span> 2023043910
                            </div>
                            <div>
                              <span className="font-bold">{previewLang === "en" ? "JD" : "যোগদানের তারিখ"}:</span> 01/08/2023
                            </div>
                            <div className="col-span-2">
                              <span className="font-bold">{previewLang === "en" ? "Name" : "নাম"}:</span> Tahmid Afsar
                            </div>
                            <div className="col-span-2">
                              <span className="font-bold">{previewLang === "en" ? "Department" : "বিভাগ"}:</span> Project Resource & Strategy
                            </div>
                            <div className="col-span-2">
                              <span className="font-bold">{previewLang === "en" ? "Designation" : "পদবী"}:</span> Deputy Manager
                            </div>
                            <div className="col-span-2 flex justify-between">
                              <span><span className="font-bold">{previewLang === "en" ? "Grade" : "গ্রেড"}:</span> —</span>
                              <span><span className="font-bold">{previewLang === "en" ? "Unit" : "ইউনিট"}:</span> PSL</span>
                              <span><span className="font-bold">{previewLang === "en" ? "Line" : "লাইন"}:</span> N/A</span>
                            </div>
                          </div>

                          {/* Working Status */}
                          <div className="border-t border-b border-black py-1 mb-1.5 flex justify-between text-[11px] font-extrabold uppercase tracking-wide">
                            <span>{previewLang === "en" ? "Working Status" : "কার্য অবস্থা"}</span>
                            <span>{previewLang === "en" ? "Unit" : "ইউনিট"}</span>
                          </div>
                          <div className="space-y-1 text-[10.5px] mb-3">
                            {editingTemplate.fields.filter(f => f.category === "status" && f.isVisible).map(f => {
                              const mockValues: Record<string, string> = {
                                working_day: "25",
                                holiday: "6",
                                present: "24",
                                cl: "1",
                                sl: "0",
                                el: "0",
                                ml: "0",
                                spl: "0",
                                absent: "0",
                                ot_rate: "120.00",
                                ot_hour: "0.00",
                              };
                              const label = previewLang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                              return (
                                <div key={f.key} className="flex justify-between pl-4 font-bold text-slate-800">
                                  <span>{label}</span>
                                  <span className="font-mono text-black font-extrabold">{mockValues[f.key] || "0"}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Payments and Deductions */}
                          <div className="border-t border-b border-black py-1 mb-1.5 flex justify-between text-[11px] font-extrabold uppercase tracking-wide">
                            <span>{previewLang === "en" ? "Payments and Deductions" : "প্রদান এবং কর্তনসমূহ"}</span>
                            <span>{previewLang === "en" ? "Amount (TK.)" : "টাকা (TK.)"}</span>
                          </div>
                          <div className="space-y-1 text-[10.5px] mb-2">
                            {editingTemplate.fields.filter(f => f.category === "payment" && f.isVisible && f.key !== "total_payment").map(f => {
                              const mockValues: Record<string, string> = {
                                basic_pay: "100000",
                                house_rent: "50000",
                                medical: "10000",
                                food: "0",
                                conveyance: "5000",
                                gross_salary: "165000",
                                ot_payment: "0",
                                tiffin: "0",
                                night_allowance: "0",
                                attendance_bonus: "0",
                                allowance: "10000",
                                arrear: "0.00",
                              };
                              const label = previewLang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                              const isGross = f.key === "gross_salary";
                              return (
                                <div key={f.key} className={`flex justify-between pl-4 font-bold text-slate-800 ${isGross ? "font-black text-black border-t border-dashed border-black/40 pt-1 mt-1 text-[11px]" : ""}`}>
                                  <span>{label}</span>
                                  <span className="font-mono text-black font-extrabold">{mockValues[f.key] || "0"}</span>
                                </div>
                              );
                            })}
                            {(() => {
                              const f = editingTemplate.fields.find(field => field.key === "total_payment");
                              if (!f || !f.isVisible) return null;
                              const label = previewLang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                              return (
                                <div className="flex justify-between font-black border-t-2 border-black pt-1.5 mt-2 text-[11px] uppercase">
                                  <span>{label}</span>
                                  <span className="font-mono">175000</span>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Deductions */}
                          <div className="space-y-1 text-[10.5px] mb-3">
                            {editingTemplate.fields.filter(f => f.category === "deduction" && f.isVisible && f.key !== "total_deduction").map(f => {
                              const mockValues: Record<string, string> = {
                                absent_deduction: "0",
                                lunch_deduction: "2500",
                                advance: "5000",
                                wagely_advance: "0",
                                adjust: "0",
                                income_tax: "2500",
                                revenue_stamp: "0",
                              };
                              const label = previewLang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                              return (
                                <div key={f.key} className="flex justify-between pl-4 font-bold text-slate-800">
                                  <span>{label}</span>
                                  <span className="font-mono text-black font-extrabold">{mockValues[f.key] || "0"}</span>
                                </div>
                              );
                            })}
                            {(() => {
                              const f = editingTemplate.fields.find(field => field.key === "total_deduction");
                              if (!f || !f.isVisible) return null;
                              const label = previewLang === "en" ? f.customLabelEng || f.defaultLabelEng : f.customLabelBng || f.defaultLabelBng;
                              return (
                                <div className="flex justify-between font-black border-t-2 border-black pt-1.5 mt-2 text-[11px] uppercase">
                                  <span>{label}</span>
                                  <span className="font-mono">10000</span>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Net Payment */}
                          <div className="flex justify-between font-black border-t border-b-2 border-black py-1.5 mt-2 text-[11.5px] uppercase">
                            <span>{previewLang === "en" ? "Net Payment" : "নেট পেমেন্ট"}</span>
                            <span className="font-mono">165000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          )}

          {/* Master Table Router */}
          {activeTab !== "payslip" && (
            <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">

            <div className="overflow-x-auto">
              {activeTab === "company" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "1000px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[140px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 w-[120px]">Company Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Company Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Company Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 min-w-[250px]">Address (Eng)</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {orgs
                      .filter((o) =>
                        (o.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
                                title="Edit"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.sl)}
                                className="text-red-500 hover:text-red-650 transition"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSettingsCompany(item);
                                  setIsSettingsOpen(true);
                                }}
                                className="text-blue-500 hover:text-blue-600 transition-colors"
                                title="Company Basic Settings"
                              >
                                <Settings className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-normal font-mono">{item.code}</td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.nameEng}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.nameBng || "—"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                          <td
                            className="px-5 py-3.5 font-normal truncate max-w-[250px]"
                            title={item.addressEng}
                          >
                            {item.addressEng || "—"}
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

              {activeTab === "area" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "1200px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 w-[100px]">Area Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Company</th>
                      <th className="px-5 py-4 min-w-[200px]">Area Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Area Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 min-w-[250px]">Address</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {areas
                      .filter((a) =>
                        (a.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
                          <td className="px-5 py-3.5 font-normal font-mono">{item.code}</td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.companyName}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.nameEng}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.nameBng || "—"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                          <td className="px-5 py-3.5 font-normal truncate max-w-[250px]">
                            {item.addressEng || "—"}
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

              {activeTab === "mapping" && (
                <div className="p-6 bg-card">
                  {/* Custom Header for Mapping */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40">
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        Pakiza Software Limited
                      </h2>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">
                          Mapping For
                        </label>
                        <select className="bg-transparent border-0 border-b border-emerald-500/80 outline-none pb-0.5 text-sm font-bold text-slate-800 dark:text-slate-100 pr-8 cursor-pointer">
                          <option value="section">Section</option>
                          <option value="department">Department</option>
                          <option value="unit">Unit</option>
                          <option value="line">Line</option>
                          <option value="area">Area</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground w-64 outline-none focus:border-primary"
                        />
                      </div>
                      <button
                        onClick={() => {
                          toast.success("Mappings submitted successfully!");
                          localStorage.setItem("hris_company_mappings", JSON.stringify(mappings));
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-sm shadow-sm transition-all"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </div>

                  {/* Redesigned Mapping Table */}
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                      <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                        <tr>
                          <th className="px-4 py-3 w-[40px] text-center">
                            <input
                              type="checkbox"
                              checked={mappings.length > 0 && mappings.every((m) => m.checked)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setMappings(mappings.map((m) => ({ ...m, checked })));
                              }}
                              className="rounded border-slate-350 text-primary focus:ring-primary size-3.5"
                            />
                          </th>
                          <th className="px-4 py-3 w-[60px] text-center text-slate-500 font-bold">
                            SL
                          </th>
                          <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold">
                            Name
                          </th>
                          <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold">
                            Main
                          </th>
                          <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold w-[250px]">
                            Relay Duty
                          </th>
                          <th className="px-4 py-3 w-[80px] text-center text-slate-600 dark:text-slate-300 font-bold">
                            Del
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                        {mappings
                          .filter(
                            (m) =>
                              (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (m.main || "").toLowerCase().includes(searchQuery.toLowerCase()),
                          )
                          .map((item, idx) => (
                            <tr
                              key={item.sl}
                              className={`${idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/40"} hover:bg-slate-100/50 transition-colors`}
                            >
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!item.checked}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setMappings(
                                      mappings.map((m) =>
                                        m.sl === item.sl ? { ...m, checked } : m,
                                      ),
                                    );
                                  }}
                                  className="rounded border-slate-350 text-primary focus:ring-primary size-3.5"
                                />
                              </td>
                              <td className="px-4 py-3 text-center text-slate-500 font-normal">
                                {idx + 1}
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                                {item.name}
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-350">
                                {item.main}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={item.relayDuty || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setMappings(
                                      mappings.map((m) =>
                                        m.sl === item.sl ? { ...m, relayDuty: val } : m,
                                      ),
                                    );
                                  }}
                                  className="h-8 w-full max-w-[220px] bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-700 rounded px-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-foreground"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.sl)}
                                  className="text-slate-400 hover:text-red-500 font-bold transition text-sm px-2"
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "department" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "800px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[140px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 w-[120px]">Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Department (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Department (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {departments
                      .filter((d) => {
                        const matchSearch = (d.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase());
                        const matchCompany = companyFilter === "all" || d.companyName === companyFilter;
                        return matchSearch && matchCompany;
                      })
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
                                title="Edit Department"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.sl)}
                                className="text-red-500 hover:text-red-650 transition"
                                title="Delete Department"
                              >
                                <Trash2 className="size-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setAssigningDept(item);
                                  setTempDesignations(deptDesignations[item.sl] || []);
                                  setSelectedNewDesignation("");
                                  setCustomDesignation("");
                                  setIsAssignModalOpen(true);
                                }}
                                className="text-blue-500 hover:text-blue-600 transition-colors"
                                title="Assign Designations"
                              >
                                <Briefcase className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.nameEng}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.nameBng || "—"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
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

              {activeTab === "section" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "1000px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                        Actions
                      </th>
                      <th className="px-5 py-4 min-w-[200px]">Department</th>
                      <th className="px-5 py-4 w-[100px]">Section Code</th>
                      <th className="px-5 py-4 min-w-[200px]">Section (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Section (Bng)</th>
                      <th className="px-5 py-4 w-[120px]">Short Name</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {sections
                      .filter((s) => {
                        const matchSearch = (s.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase());
                        const matchCompany = companyFilter === "all" || s.companyName === companyFilter;
                        return matchSearch && matchCompany;
                      })
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
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.departmentName}
                          </td>
                          <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.nameEng}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.nameBng || "—"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
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

              {activeTab === "unit" && (
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
                      <th className="px-5 py-4 min-w-[200px]">Name (Eng)</th>
                      <th className="px-5 py-4 min-w-[200px]">Name (Bng)</th>
                      <th className="px-5 py-4 w-[120px] text-center">Sort Order</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {units
                      .filter((u) => {
                        const matchSearch = (u.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase());
                        const matchCompany = companyFilter === "all" || u.companyName === companyFilter;
                        return matchSearch && matchCompany;
                      })
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
                            {item.nameEng}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.nameBng || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.sortOrder || "—"}
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

              {activeTab === "line" && (
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
                      <th className="px-5 py-4 min-w-[200px]">Company</th>
                      <th className="px-5 py-4 min-w-[150px]">Line (Eng)</th>
                      <th className="px-5 py-4 min-w-[150px]">Line (Bng)</th>
                      <th className="px-5 py-4 w-[120px] text-center">Sort Order</th>
                      <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {lines
                      .filter((l) => {
                        const matchSearch = (l.lineEng || "").toLowerCase().includes(searchQuery.toLowerCase());
                        const matchCompany = companyFilter === "all" || l.companyName === companyFilter;
                        return matchSearch && matchCompany;
                      })
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
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.companyName}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">
                            {item.lineEng}
                          </td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.lineBng || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-center font-normal font-mono">
                            {item.sortOrder || "—"}
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

              {activeTab === "holiday" && (
                <table
                  className="w-full text-left text-xs border-collapse whitespace-nowrap"
                  style={{ minWidth: "900px" }}
                >
                  <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                    <tr className="bg-transparent">
                      <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                        #
                      </th>
                      <th className="px-5 py-4 w-[110px] text-center">Status</th>
                      <th className="px-5 py-4 w-[100px] text-center">Year</th>
                      <th className="px-5 py-4 min-w-[200px]">Effective Date</th>
                      <th className="px-5 py-4 min-w-[250px]">Default Holiday Days</th>
                      <th className="px-5 py-4 min-w-[300px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-foreground">
                    {(() => {
                      const todayStr = new Date().toISOString().slice(0, 10);
                      const sortedHolidays = [...holidays].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
                      const activeHoliday = sortedHolidays.filter(h => h.effectiveDate <= todayStr)[0];

                      return sortedHolidays
                        .filter((h) => {
                          const matchSearch = (h.remarks || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (h.effectiveDate || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            String(h.year).includes(searchQuery) ||
                            h.days.some(day => day.toLowerCase().includes(searchQuery.toLowerCase()));
                          return matchSearch;
                        })
                        .map((item, idx) => {
                          let statusLabel = "Archived";
                          let statusStyle = "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:border-slate-500/30";
                          if (activeHoliday && item.sl === activeHoliday.sl) {
                            statusLabel = "Active";
                            statusStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:border-emerald-500/30";
                          } else if (item.effectiveDate > todayStr) {
                            statusLabel = "Upcoming";
                            statusStyle = "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:border-blue-500/30";
                          }

                          return (
                            <tr
                              key={item.sl}
                              className="group hover:bg-muted/50 transition-all"
                            >
                              <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                                {idx + 1}
                              </td>
                              <td className="px-5 py-3.5 text-center font-normal">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusStyle}`}>
                                  {statusLabel}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center font-normal font-mono">
                                {item.year}
                              </td>
                              <td className="px-5 py-3.5 font-normal text-foreground font-semibold">
                                {item.effectiveDate}
                              </td>
                              <td className="px-5 py-3.5 font-normal">
                                <div className="flex flex-wrap gap-1">
                                  {item.days.map((d) => (
                                    <span key={d} className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/15">
                                      {d}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300 whitespace-normal max-w-sm">
                                {item.remarks || "—"}
                              </td>
                            </tr>
                          );
                        });
                    })()}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          )}
        </div>

      {/* Copy From Modal */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border/60 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Layers className="size-5 text-blue-500" />
                Copy {tabsList.find((t) => t.type === activeTab)?.label}
              </h2>
              <button
                onClick={() => setIsCopyModalOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80 block">Source Company *</label>
                  <SearchableSelect
                    value={copySourceCompany}
                    onChange={(val) => {
                      setCopySourceCompany(val);
                      setSelectedCopyItems([]);
                    }}
                    options={orgs.map((org) => ({ value: org.nameEng, label: org.nameEng }))}
                    placeholder="Select Source Company"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80 block">Target Company *</label>
                  <SearchableSelect
                    value={copyTargetCompany}
                    onChange={(val) => setCopyTargetCompany(val)}
                    options={orgs.map((org) => ({ value: org.nameEng, label: org.nameEng }))}
                    placeholder="Select Target Company"
                  />
                </div>
              </div>

              <div className="bg-muted/10 border border-border/50 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-muted/30 px-4 py-3 border-b border-border/50 flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    className="size-4 rounded border-border/60"
                    checked={getSourceItemsForCopy().length > 0 && selectedCopyItems.length === getSourceItemsForCopy().length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCopyItems(getSourceItemsForCopy().map(i => i.sl));
                      } else {
                        setSelectedCopyItems([]);
                      }
                    }}
                  />
                  <span className="text-sm font-semibold text-foreground">Select All Items</span>
                </div>
                <div className="p-2 max-h-[30vh] overflow-y-auto">
                  {getSourceItemsForCopy().length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No items found for source company.</div>
                  ) : (
                    <div className="space-y-1">
                      {getSourceItemsForCopy().map((item: any) => (
                        <label key={item.sl} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/40 rounded-lg cursor-pointer transition-colors">
                          <input 
                            type="checkbox"
                            checked={selectedCopyItems.includes(item.sl)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCopyItems([...selectedCopyItems, item.sl]);
                              } else {
                                setSelectedCopyItems(selectedCopyItems.filter(id => id !== item.sl));
                              }
                            }}
                            className="size-4 rounded border-border/60" 
                          />
                          <span className="text-sm font-medium">
                            {('nameEng' in item) ? item.nameEng : ('lineEng' in item ? item.lineEng : item.code)}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border/50 bg-muted/10 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsCopyModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCopySubmit}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Layers className="size-4.5" /> Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Payslip Template Modal */}
      {isCreateTplOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border/60 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus className="size-5 text-primary" />
                Create Payslip Template
              </h2>
              <button
                onClick={() => setIsCreateTplOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTemplate}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80 block">Template Title *</label>
                  <input
                    type="text"
                    required
                    value={tplTitle}
                    onChange={(e) => setTplTitle(e.target.value)}
                    placeholder="e.g. Standard Staff, Casual Wages"
                    className="w-full h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80 block">Target Company *</label>
                  <SearchableSelect
                    value={tplCompany}
                    onChange={(val) => setTplCompany(val)}
                    options={orgs.map((org) => ({ value: org.nameEng, label: org.nameEng }))}
                    placeholder="Select Company"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80 block">Employee Type *</label>
                  <SearchableSelect
                    value={tplEmpType}
                    onChange={(val) => setTplEmpType(val)}
                    options={[
                      { value: "Permanent", label: "Permanent" },
                      { value: "Contractual", label: "Contractual" },
                      { value: "Provision", label: "Provision" },
                      { value: "Casual", label: "Casual" },
                      { value: "Apprentice", label: "Apprentice" }
                    ]}
                    placeholder="Select Employee Type"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/50 bg-muted/10 flex items-center justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsCreateTplOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/95 transition-all flex items-center gap-2"
                >
                  <Plus className="size-4" /> Create & Configure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-border/40">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-border/30 bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground">
                      {editSl ? "Update" : "Create"}{" "}
                      {tabsList.find((t) => t.type === activeTab)?.label}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="size-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeTab === "company" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company Code *</label>
                      <input
                        type="text"
                        placeholder="Company Code"
                        value={orgCode}
                        onChange={(e) => setOrgCode(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company Name (Eng) *</label>
                      <input
                        type="text"
                        placeholder="Company Name (Eng)"
                        value={orgNameEng}
                        onChange={(e) => setOrgNameEng(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company Name (Bng)</label>
                      <input
                        type="text"
                        placeholder="Company Name (Bng)"
                        value={orgNameBng}
                        onChange={(e) => setOrgNameBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input
                        type="text"
                        placeholder="Short Name"
                        value={orgShortName}
                        onChange={(e) => setOrgShortName(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Address (Eng)</label>
                      <input
                        type="text"
                        placeholder="Address (Eng)"
                        value={orgAddressEng}
                        onChange={(e) => setOrgAddressEng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Address (Bng)</label>
                      <input
                        type="text"
                        placeholder="Address (Bng)"
                        value={orgAddressBng}
                        onChange={(e) => setOrgAddressBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={orgIsActive}
                        onChange={(e) => setOrgIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "area" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Area Code *</label>
                      <input
                        type="text"
                        placeholder="Area Code"
                        value={areaCode}
                        onChange={(e) => setAreaCode(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Company *</label>
                      <select
                        value={areaCompany}
                        onChange={(e) => setAreaCompany(e.target.value)}
                        className={insetSelectClass}
                      >
                        {orgs.map((o) => (
                          <option key={o.sl} value={o.nameEng}>
                            {o.nameEng}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Area Name (Eng) *</label>
                      <input
                        type="text"
                        placeholder="Area Name (Eng)"
                        value={areaNameEng}
                        onChange={(e) => setAreaNameEng(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Area Name (Bng)</label>
                      <input
                        type="text"
                        placeholder="Area Name (Bng)"
                        value={areaNameBng}
                        onChange={(e) => setAreaNameBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input
                        type="text"
                        placeholder="Short Name"
                        value={areaShortName}
                        onChange={(e) => setAreaShortName(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Address (Eng)</label>
                      <input
                        type="text"
                        placeholder="Address (Eng)"
                        value={areaAddressEng}
                        onChange={(e) => setAreaAddressEng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Address (Bng)</label>
                      <input
                        type="text"
                        placeholder="Address (Bng)"
                        value={areaAddressBng}
                        onChange={(e) => setAreaAddressBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={areaIsActive}
                        onChange={(e) => setAreaIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "mapping" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Embroidery"
                        value={mapName}
                        onChange={(e) => setMapName(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Main *</label>
                      <input
                        type="text"
                        placeholder="e.g. RMG Operations"
                        value={mapMain}
                        onChange={(e) => setMapMain(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Relay Duty</label>
                      <input
                        type="text"
                        placeholder="Relay Duty value"
                        value={mapRelayDuty}
                        onChange={(e) => setMapRelayDuty(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "department" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Concern (Company) *</label>
                      <MultiSelect
                        options={orgs.map((org) => ({ value: org.nameEng, label: org.nameEng }))}
                        selected={formSelectedCompanies}
                        onChange={setFormSelectedCompanies}
                        placeholder="Select Concerns..."
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department Code *</label>
                      <input
                        type="text"
                        placeholder="Code"
                        value={depCode}
                        onChange={(e) => setDepCode(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department Name (Eng) *</label>
                      <input
                        type="text"
                        placeholder="Name (Eng)"
                        value={depNameEng}
                        onChange={(e) => setDepNameEng(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department Name (Bng)</label>
                      <input
                        type="text"
                        placeholder="Name (Bng)"
                        value={depNameBng}
                        onChange={(e) => setDepNameBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input
                        type="text"
                        placeholder="Short Name"
                        value={depShortName}
                        onChange={(e) => setDepShortName(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={depIsActive}
                        onChange={(e) => setDepIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "section" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Concern (Company) *</label>
                      <MultiSelect
                        options={orgs.map((org) => ({ value: org.nameEng, label: org.nameEng }))}
                        selected={formSelectedCompanies}
                        onChange={setFormSelectedCompanies}
                        placeholder="Select Concerns..."
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Department *</label>
                      <select
                        value={secDept}
                        onChange={(e) => setSecDept(e.target.value)}
                        className={insetSelectClass}
                      >
                        {departments.map((d) => (
                          <option key={d.sl} value={d.nameEng}>
                            {d.nameEng}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Section Code *</label>
                      <input
                        type="text"
                        placeholder="Code"
                        value={secCode}
                        onChange={(e) => setSecCode(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Section Name (Eng) *</label>
                      <input
                        type="text"
                        placeholder="Name (Eng)"
                        value={secNameEng}
                        onChange={(e) => setSecNameEng(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Section Name (Bng)</label>
                      <input
                        type="text"
                        placeholder="Name (Bng)"
                        value={secNameBng}
                        onChange={(e) => setSecNameBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Short Name</label>
                      <input
                        type="text"
                        placeholder="Short Name"
                        value={secShortName}
                        onChange={(e) => setSecShortName(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={secIsActive}
                        onChange={(e) => setSecIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "unit" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Concern (Company) *</label>
                      <MultiSelect
                        options={orgs.map((org) => ({ value: org.nameEng, label: org.nameEng }))}
                        selected={formSelectedCompanies}
                        onChange={setFormSelectedCompanies}
                        placeholder="Select Concerns..."
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Unit Name (Eng) *</label>
                      <input
                        type="text"
                        placeholder="Name (Eng)"
                        value={unitNameEng}
                        onChange={(e) => setUnitNameEng(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Unit Name (Bng)</label>
                      <input
                        type="text"
                        placeholder="Name (Bng)"
                        value={unitNameBng}
                        onChange={(e) => setUnitNameBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Sort Order</label>
                      <input
                        type="number"
                        placeholder="Sort Order"
                        value={unitSort}
                        onChange={(e) => setUnitSort(Number(e.target.value))}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={unitIsActive}
                        onChange={(e) => setUnitIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "line" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Concern (Company) *</label>
                      <MultiSelect
                        options={orgs.map((org) => ({ value: org.nameEng, label: org.nameEng }))}
                        selected={formSelectedCompanies}
                        onChange={setFormSelectedCompanies}
                        placeholder="Select Concerns..."
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Line Name (Eng) *</label>
                      <input
                        type="text"
                        placeholder="Line (Eng)"
                        value={lineEng}
                        onChange={(e) => setLineEng(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Line Name (Bng)</label>
                      <input
                        type="text"
                        placeholder="Line (Bng)"
                        value={lineBng}
                        onChange={(e) => setLineBng(e.target.value)}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Sort Order</label>
                      <input
                        type="number"
                        placeholder="Sort Order"
                        value={lineSort}
                        onChange={(e) => setLineSort(Number(e.target.value))}
                        className={insetInputClass}
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>IsActive *</label>
                      <select
                        value={lineIsActive}
                        onChange={(e) => setLineIsActive(e.target.value as any)}
                        className={insetSelectClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "holiday" && (
                  <div className="space-y-4">
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Year *</label>
                      <select
                        value={holidayYear}
                        onChange={(e) => setHolidayYear(Number(e.target.value))}
                        className={insetSelectClass}
                        required
                      >
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                        <option value={2027}>2027</option>
                        <option value={2028}>2028</option>
                        <option value={2029}>2029</option>
                        <option value={2030}>2030</option>
                      </select>
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Effective Date *</label>
                      <input
                        type="date"
                        value={holidayEffectiveDate}
                        onChange={(e) => setHolidayEffectiveDate(e.target.value)}
                        className={insetInputClass}
                        required
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Default Holidays *</label>
                      <MultiSelect
                        options={[
                          { value: "Saturday", label: "Saturday" },
                          { value: "Sunday", label: "Sunday" },
                          { value: "Monday", label: "Monday" },
                          { value: "Tuesday", label: "Tuesday" },
                          { value: "Wednesday", label: "Wednesday" },
                          { value: "Thursday", label: "Thursday" },
                          { value: "Friday", label: "Friday" },
                        ]}
                        selected={holidayDays}
                        onChange={setHolidayDays}
                        placeholder="Select holidays..."
                      />
                    </div>
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Remarks</label>
                      <textarea
                        placeholder="Enter setup details or reasons"
                        value={holidayRemarks}
                        onChange={(e) => setHolidayRemarks(e.target.value)}
                        className={`${insetInputClass} h-20 py-2 resize-none`}
                      />
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="border-t border-border/30 pt-4 flex items-center justify-end gap-3 bg-muted/10 -mx-6 -mb-6 p-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="h-10 px-5 rounded-xl bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center"
                  >
                    {editSl ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Designation Assignment Modal */}
        {isAssignModalOpen && assigningDept && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-border/40">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-border/30 bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                    <SlidersHorizontal className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                      Assign & Order Designations
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Department:{" "}
                      <span className="text-primary font-bold px-2 py-0.5 rounded-md bg-primary/10 border border-primary/15">
                        {assigningDept.nameEng} ({assigningDept.code})
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="size-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Column: Designation selection & custom addition */}
                <div className="md:col-span-5 space-y-5">
                  <div className="bg-muted/20 dark:bg-slate-900/50 border border-border/80 rounded-lg p-5 space-y-5 shadow-xs">
                    <div className="border-b border-border/40 pb-2.5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-primary">
                        Add New Designations
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                        Select existing templates or register custom ones.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Pre-defined select dropdown */}
                      <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Choose Existing</label>
                        <select
                          value={selectedNewDesignation}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedNewDesignation(val);
                            if (val && !tempDesignations.includes(val)) {
                              setTempDesignations([...tempDesignations, val]);
                              setSelectedNewDesignation("");
                              toast.success(`Added: ${val}`);
                            }
                          }}
                          className={`${insetSelectClass} font-bold text-slate-800 dark:text-slate-100`}
                        >
                          <option value="">-- Click to select --</option>
                          {DEFAULT_DESIGNATIONS.filter(
                            (des) => !tempDesignations.includes(des),
                          ).map((des, index) => (
                            <option key={index} value={des}>
                              {des}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-border/30"></div>
                        <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                          OR
                        </span>
                        <div className="flex-grow border-t border-border/30"></div>
                      </div> */}

                      {/* Custom designation field */}
                      {/* <div className={insetWrapperClass}>
                        <label className={insetLabelClass}>Register Custom</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            placeholder="Type custom name..."
                            value={customDesignation}
                            onChange={(e) => setCustomDesignation(e.target.value)}
                            className={`${insetInputClass} flex-1 font-semibold text-slate-800 dark:text-slate-100`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (customDesignation.trim()) {
                                  const val = customDesignation.trim();
                                  if (!tempDesignations.includes(val)) {
                                    setTempDesignations([...tempDesignations, val]);
                                    setCustomDesignation("");
                                    toast.success(`Added custom: ${val}`);
                                  } else {
                                    toast.warning(`${val} is already added`);
                                  }
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customDesignation.trim()) {
                                const val = customDesignation.trim();
                                if (!tempDesignations.includes(val)) {
                                  setTempDesignations([...tempDesignations, val]);
                                  setCustomDesignation("");
                                  toast.success(`Added custom: ${val}`);
                                } else {
                                  toast.warning(`${val} is already added`);
                                }
                              }
                            }}
                            className="h-8 px-3.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-black text-[10px] transition-all shadow-sm active:scale-95"
                          >
                            ADD
                          </button>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Right Column: Drag and Drop list */}
                <div className="md:col-span-7 flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <span>Assigned List</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-500 font-mono">
                        {tempDesignations.length} items
                      </span>
                    </h3>
                    {tempDesignations.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm("Remove all assigned designations?")) {
                            setTempDesignations([]);
                          }
                        }}
                        className="text-[10px] font-extrabold text-red-500 hover:text-red-650 transition uppercase tracking-wider"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {tempDesignations.length === 0 ? (
                    <div className="flex-1 border-2 border-dashed border-border/80 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-muted/10 min-h-[260px]">
                      <div className="size-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                        <Briefcase className="size-6 text-muted-foreground/45 animate-pulse" />
                      </div>
                      <p className="text-xs text-muted-foreground font-bold">
                        No designations assigned
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-[280px]">
                        Use the left panel to pick templates or register custom designations.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 flex-1">
                      {tempDesignations.map((des, index) => {
                        return (
                          <div
                            key={des}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", index.toString());
                              e.dataTransfer.effectAllowed = "move";
                              e.currentTarget.classList.add("opacity-30", "border-primary");
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.classList.remove("opacity-30", "border-primary");
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
                              if (isNaN(fromIndex) || fromIndex === index) return;
                              const updated = [...tempDesignations];
                              const [movedItem] = updated.splice(fromIndex, 1);
                              updated.splice(index, 0, movedItem);
                              setTempDesignations(updated);
                            }}
                            className="flex items-center justify-between p-3.5 bg-card hover:bg-muted/20 border border-border/85 hover:border-primary/45 rounded-xl transition-all duration-200 shadow-sm cursor-grab active:cursor-grabbing group/item hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              {/* Grip Handle */}
                              <div className="text-muted-foreground/30 group-hover/item:text-primary transition-colors cursor-grab p-1 hover:bg-muted rounded">
                                <GripVertical className="size-4" />
                              </div>
                              {/* Number Badge */}
                              <div className="size-6 rounded-lg bg-primary/10 border border-primary/15 text-primary flex items-center justify-center text-[10px] font-black font-mono">
                                {index + 1}
                              </div>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                {des}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setTempDesignations(tempDesignations.filter((d) => d !== des));
                                toast.success(`Removed: ${des}`);
                              }}
                              className="size-7.5 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-all text-muted-foreground hover:text-red-500 border border-transparent hover:border-red-500/20 active:scale-95"
                              title="Remove designation"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-border/30 pt-4 flex items-center justify-end gap-3 bg-muted/10 p-6">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="h-10 px-5 rounded-xl bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...deptDesignations,
                      [assigningDept.sl]: tempDesignations,
                    };
                    setDeptDesignations(updated);
                    localStorage.setItem("hris_dept_designations", JSON.stringify(updated));
                    toast.success("Designations assigned and ordered successfully!");
                    setIsAssignModalOpen(false);
                  }}
                  className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Company Basic Settings Modal */}
        {isSettingsOpen &&
          settingsCompany &&
          (() => {
            const sl = settingsCompany.sl;
            const cfg: CompanyBasicSettings = companySettings[sl] ?? {
              ...DEFAULT_COMPANY_SETTINGS,
            };
            const update = (field: keyof CompanyBasicSettings, val: string) => {
              setCompanySettings((prev) => ({
                ...prev,
                [sl]: { ...(prev[sl] ?? DEFAULT_COMPANY_SETTINGS), [field]: val },
              }));
            };

            const sel = "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center]";
            const lbl = "text-xs font-semibold text-foreground/85 block flex items-center gap-1";
            const wrap = "space-y-1.5";
            const inp = "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none";

            const SectionHeader = ({ title, badge, icon: Icon }: { title: string; badge?: string; icon: any }) => (
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shadow-2xs border border-primary/20">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">{title}</h3>
                </div>
                {badge && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                    {badge}
                  </span>
                )}
              </div>
            );

            const isTabVisible = (tabId: string) => settingsTab === "all" || settingsTab === tabId;

            return (
              <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <div className="bg-card w-full max-w-[1150px] rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-border/40">
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-border/30 bg-card flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm border border-primary/20">
                          <Settings className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold tracking-tight text-foreground">
                              Company Basic Settings
                            </h2>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              35 Fields Configured
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">
                              {settingsCompany.code}
                            </span>
                            <p className="text-xs text-muted-foreground font-medium">
                              {settingsCompany.nameEng}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="size-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-4.5" />
                      </button>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-border/30 pt-3">
                      {[
                        { id: "all", label: "All Settings", icon: SlidersHorizontal },
                        { id: "approval", label: "Approvals & Governance", icon: Building2 },
                        { id: "attendance", label: "Attendance & Work", icon: Briefcase },
                        { id: "overtime", label: "OT & Allowances", icon: Coins },
                        { id: "leave", label: "Leave & Holidays", icon: Layers },
                        { id: "salary", label: "Salary & Validation", icon: Grid },
                        { id: "system", label: "ID & System Setup", icon: Settings },
                      ].map((t) => {
                        const Icon = t.icon;
                        const active = settingsTab === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSettingsTab(t.id)}
                            className={[
                              "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer",
                              active
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                            ].join(" ")}
                          >
                            <Icon className="size-3.5" />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-6 bg-muted/5 space-y-6">
                    {/* 1. Approval & General Governance */}
                    {isTabVisible("approval") && (
                      <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                        <SectionHeader title="Approval & General Governance" badge="5 Fields" icon={Building2} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className={wrap}>
                            <label className={lbl}>Employee Edit Approval <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.employeeEditApproval}
                              onChange={(e) => update("employeeEditApproval", e.target.value)}
                              className={sel}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>New Employee Approval <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.newEmployeeApproval}
                              onChange={(e) => update("newEmployeeApproval", e.target.value)}
                              className={sel}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Dashboard <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.dashboard}
                              onChange={(e) => update("dashboard", e.target.value)}
                              className={sel}
                            >
                              <option value="None">None</option>
                              <option value="Basic">Basic</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Authorization(L/E) <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.authorizationLE}
                              onChange={(e) => update("authorizationLE", e.target.value)}
                              className={sel}
                            >
                              <option value="Early Out">Early Out</option>
                              <option value="Late In">Late In</option>
                              <option value="Both">Both</option>
                              <option value="None">None</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Searching By <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.searchingBy}
                              onChange={(e) => update("searchingBy", e.target.value)}
                              className={sel}
                            >
                              <option value="System ID">System ID</option>
                              <option value="Office ID">Office ID</option>
                              <option value="Finger ID">Finger ID</option>
                              <option value="Custom ID">Custom ID</option>
                              <option value="Both">Both</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Attendance & Work Rules */}
                    {isTabVisible("attendance") && (
                      <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                        <SectionHeader title="Attendance & Absence Rules" badge="6 Fields" icon={Briefcase} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className={wrap}>
                            <label className={lbl}>Absent Based on In/Out <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.absentBasedOnInOut}
                              onChange={(e) => update("absentBasedOnInOut", e.target.value)}
                              className={sel}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Absent Deduct Based On <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.absentDeductBasedOn}
                              onChange={(e) => update("absentDeductBasedOn", e.target.value)}
                              className={sel}
                            >
                              <option value="Basic / 30 days">Basic / 30 days</option>
                              <option value="Gross / 30 days">Gross / 30 days</option>
                              <option value="Basic / 26 days">Basic / 26 days</option>
                              <option value="Gross / 26 days">Gross / 26 days</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>WithOut In Absent <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.withoutInAbsent}
                              onChange={(e) => update("withoutInAbsent", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Early Out <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.earlyOut}
                              onChange={(e) => update("earlyOut", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Early Out Based On <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.earlyOutBasedOn}
                              onChange={(e) => update("earlyOutBasedOn", e.target.value)}
                              className={sel}
                            >
                              <option value="Gross/30">Gross/30</option>
                              <option value="Basic/30">Basic/30</option>
                              <option value="Gross/26">Gross/26</option>
                              <option value="Basic/26">Basic/26</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Late Time Calculation <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.lateTimeCalculation}
                              onChange={(e) => update("lateTimeCalculation", e.target.value)}
                              className={sel}
                            >
                              <option value="Late Time">Late Time</option>
                              <option value="Grace Time">Grace Time</option>
                              <option value="Shift Time">Shift Time</option>
                              <option value="Exact Punch">Exact Punch</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Overtime & Allowance Rules */}
                    {isTabVisible("overtime") && (
                      <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                        <SectionHeader title="Overtime & Allowance Settings" badge="4 Fields" icon={Coins} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className={wrap}>
                            <label className={lbl}>OT Requisition <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.otRequisition}
                              onChange={(e) => update("otRequisition", e.target.value)}
                              className={sel}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>OT Rate Calculation <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.otRateCalculation}
                              onChange={(e) => update("otRateCalculation", e.target.value)}
                              className={sel}
                            >
                              <option value="Regular">Regular</option>
                              <option value="Double">Double</option>
                              <option value="Custom">Custom</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Holiday Tiffin <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.holidayTiffin}
                              onChange={(e) => update("holidayTiffin", e.target.value)}
                              className={sel}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Holiday Night <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.holidayNight}
                              onChange={(e) => update("holidayNight", e.target.value)}
                              className={sel}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. Leave & Holiday Rules */}
                    {isTabVisible("leave") && (
                      <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                        <SectionHeader title="Leave & Holiday Rules" badge="5 Fields" icon={Layers} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className={wrap}>
                            <label className={lbl}>Min Service Length Required For Leave(Month)</label>
                            <input
                              type="number"
                              value={cfg.minServiceLengthForLeave}
                              onChange={(e) => update("minServiceLengthForLeave", e.target.value)}
                              className={inp}
                              placeholder="0"
                            />
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>ML Count <span className="text-rose-500">*</span></label>
                            <input
                              type="number"
                              value={cfg.mlCount}
                              onChange={(e) => update("mlCount", e.target.value)}
                              className={inp}
                              placeholder="120"
                            />
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>ML Stamp <span className="text-rose-500">*</span></label>
                            <input
                              type="number"
                              value={cfg.mlStamp}
                              onChange={(e) => update("mlStamp", e.target.value)}
                              className={inp}
                              placeholder="0"
                            />
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Sandwich Holiday <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.sandwichHoliday}
                              onChange={(e) => update("sandwichHoliday", e.target.value)}
                              className={sel}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Sandwich Employee Type</label>
                            <input
                              type="text"
                              value={cfg.sandwichEmployeeType}
                              onChange={(e) => update("sandwichEmployeeType", e.target.value)}
                              className={inp}
                              placeholder="ALL"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. Salary & Age Validations */}
                    {isTabVisible("salary") && (
                      <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                        <SectionHeader title="Salary & Age Validations" badge="5 Fields" icon={Grid} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className={wrap}>
                            <label className={lbl}>Auto Salary Process <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.autoSalaryProcess}
                              onChange={(e) => update("autoSalaryProcess", e.target.value)}
                              className={sel}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Salary BreakDown Round <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.salaryBreakdownRound}
                              onChange={(e) => update("salaryBreakdownRound", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Age Verification <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.ageVerification}
                              onChange={(e) => update("ageVerification", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Min Age <span className="text-rose-500">*</span></label>
                            <input
                              type="number"
                              value={cfg.minAge}
                              onChange={(e) => update("minAge", e.target.value)}
                              className={inp}
                              placeholder="18"
                            />
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Max Age <span className="text-rose-500">*</span></label>
                            <input
                              type="number"
                              value={cfg.maxAge}
                              onChange={(e) => update("maxAge", e.target.value)}
                              className={inp}
                              placeholder="70"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 6. Company Architecture & ID Setup */}
                    {isTabVisible("system") && (
                      <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                        <SectionHeader title="Company Architecture & ID Setup" badge="11 Fields" icon={Settings} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className={wrap}>
                            <label className={lbl}>Company Type <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.companyType}
                              onChange={(e) => update("companyType", e.target.value)}
                              className={sel}
                            >
                              <option value="Knit">Knit</option>
                              <option value="Woven">Woven</option>
                              <option value="Spinning">Spinning</option>
                              <option value="Dyeing">Dyeing</option>
                              <option value="Composite">Composite</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Company Data <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.companyData}
                              onChange={(e) => update("companyData", e.target.value)}
                              className={sel}
                            >
                              <option value="Combined">Combined</option>
                              <option value="Separate">Separate</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Company ID <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.companyId}
                              onChange={(e) => update("companyId", e.target.value)}
                              className={sel}
                            >
                              <option value="Combined">Combined</option>
                              <option value="Separate">Separate</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>ID Format <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={cfg.idFormat}
                              onChange={(e) => update("idFormat", e.target.value)}
                              className={inp}
                              placeholder="000000"
                            />
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Join Year w/ ID <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.joinYearWithId}
                              onChange={(e) => update("joinYearWithId", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Office ID <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.officeId}
                              onChange={(e) => update("officeId", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>System ID <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.systemId}
                              onChange={(e) => update("systemId", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Dept Wise Section <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.deptWiseSection}
                              onChange={(e) => update("deptWiseSection", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>SSP Portal <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.ssp}
                              onChange={(e) => update("ssp", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Encryption <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.encryption}
                              onChange={(e) => update("encryption", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className={wrap}>
                            <label className={lbl}>Half Leave <span className="text-rose-500">*</span></label>
                            <select
                              value={cfg.halfLeave}
                              onChange={(e) => update("halfLeave", e.target.value)}
                              className={sel}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="border-t border-border/30 pt-4 flex items-center justify-between bg-card p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Changes will apply to {settingsCompany.nameEng}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(false)}
                        className="h-10 px-5 rounded-xl bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...companySettings, [sl]: cfg };
                          setCompanySettings(updated);
                          localStorage.setItem("hris_company_settings", JSON.stringify(updated));
                          toast.success("Company Basic Settings updated successfully!");
                          setIsSettingsOpen(false);
                        }}
                        className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
      </main>
    </div>
  );
}
